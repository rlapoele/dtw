import test from 'node:test';import assert from 'node:assert/strict';import {EventEmitter} from 'node:events';
import {readFile} from 'node:fs/promises';
import {image,validateListener,startOwnedXpcDriver,stopOwnedDriver} from './owned-xpc-driver.mjs';
const ok=stdout=>({exitCode:0,stdout,stderr:'',signal:null,timedOut:false,error:null});
const gone=()=>({...ok(''),exitCode:1,error:{code:1}});
const native=()=>({numeric:ok('p41131\nccom.apple.WebDriver.HTTPService\nu501\nn127.0.0.1:59466\n'),ps:ok('41131 1 501 '+image+'\n'),executable:ok('p41131\nftxt\nn/System/Volumes/Preboot/Cryptexes/Incoming/OS'+image+'\n'),uid:501,live:true});
test('distinct observed XPC PID validates with exact UID and executable evidence',()=>assert.equal(validateListener(native()).pid,41131));
test('saved native phase-1 raw receipts validate without rewriting fields',async()=>{
 const report=JSON.parse(await readFile(new URL('../../output/increment-007-safari-readiness-supervision/driver-diagnostic.json',import.meta.url)));
 const attempt=report.attempts.find(a=>a.listenerPids.length===1);
 const identity=validateListener({numeric:attempt.numeric,ps:attempt.metadata[0],executable:attempt.metadata[1],uid:report.uid,live:true});
 assert.equal(identity.pid,41131);assert.notEqual(identity.pid,report.spawnPid);
});
for(const [name,alter] of [
 ['wrong PID',r=>r.ps=ok('999 1 501 '+image+'\n')],['wrong UID',r=>r.ps=ok('41131 1 502 '+image+'\n')],
 ['wrong name',r=>r.numeric.stdout=r.numeric.stdout.replace('ccom.apple.WebDriver.HTTPService','csafaridriver')],
 ['wrong image path',r=>r.ps.stdout=r.ps.stdout.replace('/System/Library','/tmp/System/Library')],
 ['suffix-only fake executable',r=>r.executable.stdout=r.executable.stdout.replace('/System/Volumes/Preboot/Cryptexes/Incoming/OS','/tmp')],
 ['multiple listeners',r=>r.numeric.stdout+='p41132\nccom.apple.WebDriver.HTTPService\nu501\n'],
 ['query timeout',r=>r.numeric={...r.numeric,timedOut:true,signal:'SIGTERM'}],
 ['metadata error',r=>r.ps={...r.ps,error:{code:'EACCES'}}],['dead child',r=>r.live=false],
])test('refuses '+name,()=>{const r=native();alter(r);assert.throws(()=>validateListener(r));});
function child(){const c=new EventEmitter();Object.assign(c,{pid:41128,exitCode:null,signalCode:null,stdout:new EventEmitter(),stderr:new EventEmitter()});c.kill=signal=>{assert.equal(signal,'SIGTERM');c.exitCode=0;c.emit('exit',0,null);return true;};return c;}
test('occupied endpoint refuses before spawning',async()=>{let launched=false;await assert.rejects(startOwnedXpcDriver({reservePort:async()=>59466,query:async()=>native().numeric,launch:()=>{launched=true;}}),/unused/);assert.equal(launched,false);});
test('early driver exit preserves failure and cleanup endpoint evidence',async()=>{
 const c=child(),snapshots=[];c.exitCode=7;
 await assert.rejects(startOwnedXpcDriver({reservePort:async()=>59466,query:async()=>gone(),launch:()=>c,checkpoint:async r=>snapshots.push(structuredClone(r))}),/exited/);
 const last=snapshots.at(-1);assert.match(last.failure,/exited/);assert.equal(last.cleanup.observedExit,true);assert.equal(last.cleanup.endpointGone,true);assert.equal(last.cleanup.sent,false);
});
test('successful corrected identity checkpoints output and cleanup targets only launcher',async()=>{
 const c=child(),snapshots=[];let n=0;
 const query=async(command,args)=>{if(command==='/bin/ps')return native().ps;if(args.includes('-d'))return native().executable;return ++n===2?native().numeric:gone();};
 const state=await startOwnedXpcDriver({reservePort:async()=>59466,query,launch:()=>c,checkpoint:async r=>snapshots.push(structuredClone(r))});
 c.stdout.emit('data','x'.repeat(11000));c.stderr.emit('data','raw stderr');
 await stopOwnedDriver(state,{query,checkpoint:async r=>snapshots.push(structuredClone(r))});
 const last=snapshots.at(-1);assert.equal(last.pid,41128);assert.equal(last.ownership.pid,41131);assert.equal(last.stdout.length,10000);assert.equal(last.stdoutTruncated,true);assert.equal(last.stderr,'raw stderr');assert.equal(last.cleanup.pid,41128);assert.equal(last.cleanup.observedExit,true);assert.equal(last.cleanup.endpointGone,true);
});
test('checkpoint failure after launch still attempts scoped cleanup',async()=>{
 const c=child();let count=0;
 await assert.rejects(startOwnedXpcDriver({reservePort:async()=>59466,query:async()=>gone(),launch:()=>c,checkpoint:async()=>{if(++count>=2)throw Error('disk refusal');}}),/disk refusal/);
 assert.equal(c.exitCode,0);
});
