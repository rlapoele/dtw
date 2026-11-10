// No inventory import and no storage-case execution path. Live release is external.
import {spawn} from 'node:child_process';
import {mkdir,readFile,writeFile,rename} from 'node:fs/promises';
import {createHash,randomUUID} from 'node:crypto';
import path from 'node:path';
import {serve,csp} from '../increment-007-storage-concurrency-safety/server.mjs';
import {startOwnedXpcDriver,stopOwnedDriver,pause} from './owned-xpc-driver.mjs';
import {gateFacts,assessControl} from './gate-evidence.mjs';

if(!process.argv.includes('--released-live'))throw Error('offline only: independent preflight and coordinator release required');
const expected=process.argv.find(x=>x.startsWith('--preflight-sha='))?.split('=')[1];
const preflightFile='output/increment-007-safari-readiness-supervision/corrected-preflight.json';
const manifestBytes=await readFile(preflightFile),sha=b=>createHash('sha256').update(b).digest('hex');
if(!expected||sha(manifestBytes)!==expected)throw Error('released preflight hash missing or changed');
const manifest=JSON.parse(manifestBytes);
for(const [file,hash]of Object.entries(manifest.source))if(sha(await readFile(file))!==hash)throw Error('source changed: '+file);
const output=path.resolve('output/increment-007-safari-readiness-supervision/native-gate');
// Existing evidence must never be overwritten by a second launch.
await mkdir(output);
const host={startedAt:Date.now(),scope:'one corrected readiness attempt; one 12s control and at most three 12s close probes; zero storage cases',preflightSha:expected,node:process.version,csp,events:[],handles:[],controls:[]};
const writes=new Map();
async function checkpoint(file,data){const bytes=JSON.stringify(data,null,2)+'\n';const operation=(writes.get(file)??Promise.resolve()).catch(()=>{}).then(async()=>{await writeFile(path.join(output,file+'.tmp'),bytes);await rename(path.join(output,file+'.tmp'),path.join(output,file));});writes.set(file,operation);await operation;}
const save=()=>checkpoint('host.json',host);
const safeSave=async()=>{try{await save();}catch(error){(host.checkpointErrors??=[]).push({at:Date.now(),error:String(error)});process.stderr.write('Evidence checkpoint failed: '+String(error)+'\n');}};
await save();
let driver,server,received,origin,sid,pendingOperation,operationSettled=true;
const handles=new Set(),closeAttempted=new Set();
async function request(route,body,method=body===undefined?'GET':'POST',ms=15000){
 if(!driver?.receipt.ownership||driver.child.exitCode!==null||driver.child.signalCode!==null)throw Error('owned endpoint not live and verified');
 const event={type:'request',route,method,at:Date.now()};host.events.push(event);await save();
 try {const r=await fetch('http://127.0.0.1:'+driver.receipt.port+route,{method,signal:AbortSignal.timeout(ms),headers:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});const raw=await r.json();event.status=r.status;event.returnedAt=Date.now();event.response=raw;if(!r.ok||raw.value?.error)throw Error(JSON.stringify(raw));await save();return raw.value;}
 catch(error){event.error=String(error);event.returnedAt=Date.now();await save();throw error;}
}
const wd=(route,body,method,ms)=>request('/session/'+encodeURIComponent(sid)+route,body,method,ms);
async function evaluate(fn,arg,ms=15000){const r=await wd('/execute/async',{script:'const done=arguments[arguments.length-1];Promise.resolve(('+fn.toString()+')(arguments[0])).then(value=>done({value}),error=>done({error:String(error)}));',args:[arg??null]},'POST',ms);if(r.error)throw Error(r.error);return r.value;}
async function navigate(handle,id){await wd('/window',{handle});await wd('/url',{url:origin+'/research/increment-007-storage-concurrency-safety/index.html'});await evaluate(async id=>{for(let i=0;i<100;i++){if(window.ready){await q.setup({id,family:'gate',variant:''});return true;}await new Promise(r=>setTimeout(r,20));}throw Error('page readiness');},id);}
async function ownNewWindow(){const {handle}=await wd('/window/new',{type:'window'});if(!handle||handles.has(handle))throw Error('new own window identity unavailable');handles.add(handle);host.handles=[...handles];await save();return handle;}
async function waitFact(predicate,ms){const begin=Date.now();while(Date.now()-begin<ms){const r=received.find(predicate);if(r)return r;await pause(20);}throw Error('matching positive recorder receipt deadline');}
async function closeController(control){
 const file=path.join(output,'close-'+control.repetition+'.json');
 const child=spawn(process.execPath,['research/increment-007-safari-readiness-supervision/close-controller.mjs',String(driver.receipt.port),sid,control.target,file],{stdio:['ignore','pipe','pipe']});
 const receipt={pid:child.pid,stdout:'',stderr:'',stdoutTruncated:false,stderrTruncated:false,startedAt:Date.now()};control.controller=receipt;
 for(const stream of ['stdout','stderr'])child[stream].on('data',b=>{const s=receipt[stream]+b;receipt[stream+'Truncated'] ||=s.length>16000;receipt[stream]=s.slice(-16000);});
 let exited=false;child.once('error',error=>{receipt.error=String(error);});child.once('exit',(code,signal)=>{exited=true;receipt.exit={code,signal,at:Date.now()};});
 const start=Date.now();while(!exited&&Date.now()-start<4500)await pause(20);
 if(!exited){receipt.timeout=true;receipt.stopOwnController=child.kill('SIGTERM');await save();throw Error('close controller did not exit');}
 await save();if(receipt.error||receipt.exit.code!==0)throw Error('close controller failed');
 return JSON.parse(await readFile(file));
}
try {
 driver=await startOwnedXpcDriver({checkpoint:r=>checkpoint('driver.json',r)});
 host.driverOwnership=driver.receipt.ownership;await save();
 host.status=await request('/status',undefined,'GET',1000);await save();
 ({server,received,origin}=await serve(output));host.origin=origin;await save();
 const session=await request('/session',{capabilities:{alwaysMatch:{browserName:'safari'}}});sid=session.sessionId;if(!sid)throw Error('new session identity absent');host.session=session;await save();
 await wd('/timeouts',{script:25000,pageLoad:10000,implicit:0});
 const first=await wd('/window');if(!first)throw Error('initial own session window absent');handles.add(first);host.handles=[...handles];await save();
 for(let repetition=0;repetition<4;repetition++) {
  const target=repetition===0?first:await ownNewWindow(),witness=await ownNewWindow();
  const nonce=randomUUID(),targetCase='g02-target-'+nonce,witnessCase='g02-witness-'+nonce,lock='safety-g02-'+nonce;
  const control={repetition,target,witness,targetCase,witnessCase,lock,intervention:repetition>0,startedAt:Date.now(),status:'running'};host.controls.push(control);await save();
  await navigate(target,targetCase);await navigate(witness,witnessCase);
  await evaluate(lock=>q.armWitness(lock),lock);await wd('/window',{handle:target});
  const pinned=await wd('/window');if(pinned!==target)throw Error('target pin verification failed');control.pinnedTarget=pinned;await save();
  operationSettled=false;control.commandStartedAt=Date.now();
  pendingOperation=evaluate(async lock=>{const value=await q.block(lock);await q.flush();return value;},lock,28000).then(value=>{operationSettled=true;control.result=value;control.commandEndedAt=Date.now();},error=>{operationSettled=true;control.commandError=String(error);control.commandEndedAt=Date.now();});
  await waitFact(e=>e.type==='block-start'&&e.lock===lock&&e.caseId===targetCase&&e.actor==='native-worker'&&e.worker==='A',3000);
  const start=gateFacts(received,control).start;control.startReceipt=start;control.pendingAtPositiveStart=!operationSettled;await save();
  if(!control.pendingAtPositiveStart)throw Error('execute already completed before positive start');
  if(control.intervention){
   await pause(Math.max(0,Date.parse(start.receivedAt)+2000-Date.now()));
   control.pendingAtClose=!operationSettled;if(!control.pendingAtClose)throw Error('execute settled before close');
   closeAttempted.add(target);control.closeLaunchAt=Date.now();await save();
   control.close=await closeController(control);control.pendingAtCloseResponse=!operationSettled;await save();
   if(!control.close.ok)throw Error('close failed/queued/deadline');
   await waitFact(e=>e.type==='witness-acquired'&&e.lock===lock&&e.caseId===witnessCase&&e.actor==='native-worker'&&e.worker==='A',3000);
  }
  await pendingOperation;
  await waitFact(e=>e.type==='witness-acquired'&&e.lock===lock&&e.caseId===witnessCase,2000);
  control.facts=gateFacts(received,control);assessControl(control,control.facts);control.status='pass';await save();
  // Deliberately no next stage/storage inventory after the fourth gate control.
 }
 host.result='G-02 pass; readiness/supervision only; zero storage cases';await save();
}catch(error){host.result='stopped';host.originalError=String(error);await safeSave();process.exitCode=1;}
finally {
 // Settle only the already-issued finite command. No retry, new stress, or switch while pending.
 if(pendingOperation&&!operationSettled){host.settlingAt=Date.now();await safeSave();await Promise.race([pendingOperation,pause(29000)]);}
 host.partialReceipts=received??[];host.cleanup={startedAt:Date.now(),errors:[],skipped:[]};await safeSave();
 if(sid&&operationSettled){
  let remaining;try{remaining=await wd('/window/handles');}catch(error){host.cleanup.errors.push(String(error));}
  if(Array.isArray(remaining))for(const handle of handles){
   if(!remaining.includes(handle))continue;
   if(closeAttempted.has(handle)){host.cleanup.skipped.push({handle,reason:'close already attempted; no repeated close'});continue;}
   try{await wd('/window',{handle});if(await wd('/window')!==handle)throw Error('cleanup target verification');closeAttempted.add(handle);await wd('/window',undefined,'DELETE',3000);}catch(error){host.cleanup.errors.push(String(error));}
  }
 }else if(sid)host.cleanup.skipped.push({reason:'pending command not settled; no window intervention'});
 await safeSave();
 if(driver)try{host.cleanup.driver=await stopOwnedDriver(driver,{checkpoint:r=>checkpoint('driver.json',r)});}catch(error){host.cleanup.errors.push(String(error));}
 if(server){server.closeAllConnections();await new Promise(resolve=>server.close(resolve));host.cleanup.serverClosed=true;}
 host.cleanup.finishedAt=Date.now();await safeSave();
}
