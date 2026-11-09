import * as parser from '../increment-007-stage-a/node_modules/jsonc-parser/lib/esm/main.js';
import {makeCodec,canonical} from '../increment-007-stage-a/codec.mjs';
import {fixture,coverage,exactBytes} from '../increment-007-stage-a/fixtures.mjs';
import {validateCall,classify} from './protocol.mjs';
const codec=makeCodec(parser),DB='dtw-worker-qualification-v1',held=new Map(),attempts=new Map();
let seq=0,active=null;
const event=(type,detail={})=>postMessage({event:true,seq:++seq,type,...detail});
const lockName=p=>JSON.stringify(['dtw-worker-qualification-v1','project',p]);
function open(){return new Promise((resolve,reject)=>{const r=indexedDB.open(DB,1);r.onupgradeneeded=()=>{r.result.createObjectStore('projects');r.result.createObjectStore('metadata');r.transaction.objectStore('metadata').put('incarnation-1','incarnation');};r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error);});}
async function read(project){const db=await open();return new Promise((resolve,reject)=>{const tx=db.transaction(['projects','metadata']);let record,incarnation;tx.objectStore('projects').get(project).onsuccess=e=>record=e.target.result;tx.objectStore('metadata').get('incarnation').onsuccess=e=>incarnation=e.target.result;tx.oncomplete=()=>{event('read-complete',{project,revision:record?.revision??null});db.close();resolve({record,incarnation});};tx.onabort=()=>{db.close();reject(tx.error);};});}
function sample(kind,project='p'){
 const s=['coverage','detail'].includes(kind)?coverage():kind==='max'?exactBytes():fixture(kind==='100'?100:kind==='1000'?1000:0);
 if(kind==='detail'){s.project.description='x'.repeat(65535)+String.fromCharCode(0xd800);s.tokens[1].definition.assignments[0].value.value='1'.repeat(4096);}
 if(kind==='entities'){
  s.tokens=Array.from({length:10000},(_,i)=>({id:'t'+i,projectId:'p',localName:'',parentGroupId:null,authoring:{regeneration:'allowed'}}));
  s.groups=Array.from({length:2000},(_,i)=>({id:'g'+i,projectId:'p',localName:'',parentGroupId:null}));
 }
 s.project.id=project;for(const x of [...s.tokens,...s.groups])x.projectId=project;
 return s;
}
function validateRecord(r,key){
 if(!r||Object.keys(r).sort().join(',')!=='authoredVersion,lastAcceptedCommand,recordVersion,revision,snapshot'||r.recordVersion!==1||r.authoredVersion!==1||r.snapshot.project.id!==key)throw Error('record-shape');
 if(typeof r.revision!=='string'||!r.revision.length||r.revision.length>128)throw Error('record-revision');
 const c=r.lastAcceptedCommand;
 if(!c||Object.keys(c).sort().join(',')!=='commandId,operation,result'||typeof c.commandId!=='string'||!c.commandId.length||c.commandId.length>128||c.operation!=='restoreProject'||!c.result||Object.keys(c.result).sort().join(',')!=='entityKind,id'||c.result.entityKind!=='project'||c.result.id!==key)throw Error('record-command');
 return codec.encode(r.snapshot);
}
async function lock(project){if(held.has(project))return true;return new Promise((resolve,reject)=>navigator.locks.request(lockName(project),{ifAvailable:true},l=>{if(!l){event('lock-unavailable',{project});resolve(false);return;}return new Promise(release=>{held.set(project,release);event('lock-acquired',{project});resolve(true);});}).catch(reject));}
async function dispatch(a,abort=false){
 if(a.state==='cancelled')return {status:'never-dispatched'};
 if(a.state!=='prepared')throw Error('attempt-state');
 if(!held.has(a.project))throw Error('ownership');
 const db=await open();
 if(a.state==='cancelled'||!held.has(a.project)){db.close();return {status:'never-dispatched'};}
 a.state='issued';
 return new Promise((resolve,reject)=>{
  let tx;try{tx=db.transaction(['projects','metadata'],'readwrite',{durability:'strict'});}catch(e){db.close();reject(e);return;}
  const started=performance.now(),store=tx.objectStore('projects');event('issued',{command:a.command,project:a.project,durability:tx.durability});
  let reason='aborted',current,incarnation,count,ready=0;
  const check=()=>{if(++ready!==3)return;
   if(incarnation!==a.incarnation){reason='incarnation';tx.abort();return;}
   if((current?.revision??null)!==a.expected){reason='revision-conflict';tx.abort();return;}
   if(a.protection!==null&&a.protection!==(current?.revision??null)){reason='protection-conflict';tx.abort();return;}
   if(!current&&count>=25){reason='capacity';tx.abort();return;}
   const record={recordVersion:1,authoredVersion:1,revision:a.command,lastAcceptedCommand:{commandId:a.command,operation:'restoreProject',result:{entityKind:'project',id:a.project}},snapshot:a.snapshot};
   store.put(record,a.project).onsuccess=()=>{event('request-success',{command:a.command});if(abort)tx.abort();};
  };
  store.get(a.project).onsuccess=e=>{current=e.target.result;check();};
  store.count().onsuccess=e=>{count=e.target.result;check();};
  tx.objectStore('metadata').get('incarnation').onsuccess=e=>{incarnation=e.target.result;check();};
  tx.oncomplete=()=>{a.state='complete';active=null;event('complete',{command:a.command});db.close();resolve({status:'retained',revision:a.command,dispatchCompleteMs:performance.now()-started});};
  tx.onabort=()=>{a.state='abort';active=null;event('abort',{command:a.command,reason});db.close();resolve({status:reason,dispatchCompleteMs:performance.now()-started});};
 });
}
async function catalogue(){const db=await open(),started=performance.now();return new Promise((resolve,reject)=>{
 const tx=db.transaction('projects'),rows=[];let bytes=0;event('catalogue-issued');
 tx.objectStore('projects').openCursor().onsuccess=e=>{const c=e.target.result;if(!c)return;try{const encoded=validateRecord(c.value,c.key);bytes+=encoded.counts.snapshotBytes;rows.push({project:c.key,name:c.value.snapshot.project.name,tokens:c.value.snapshot.tokens.length,groups:c.value.snapshot.groups.length,revision:c.value.revision,status:'supported'});}catch(error){rows.push({project:c.key,status:'unavailable',reason:String(error).slice(0,200)});}c.continue();};
 tx.oncomplete=()=>{event('catalogue-complete',{records:rows.length});db.close();resolve({rows,bytes,workerMs:performance.now()-started});};tx.onabort=()=>{db.close();reject(tx.error);};
 });}
async function run(x){switch(x.op){
 case 'watchdogHang':await lock('watchdog-safety');event('watchdog-held');while(true){}
 case 'capability':{const db=await open(),tx=db.transaction('metadata','readwrite',{durability:'strict'}),strict=tx.durability;await new Promise((r,j)=>{tx.objectStore('metadata').put('probe','capability');tx.oncomplete=r;tx.onabort=j;});db.close();return {secure:isSecureContext,worker:typeof document==='undefined',indexedDB:!!indexedDB,locks:!!navigator.locks,strict,userAgent:navigator.userAgent};}
 case 'lock':return lock(x.project);
 case 'release':held.get(x.project)?.();held.delete(x.project);event('lock-release',{project:x.project});return true;
 case 'read':{const {record,incarnation}=await read(x.project);if(!record)return {project:x.project,absent:true,incarnation};validateRecord(record,x.project);return {project:x.project,revision:record.revision,incarnation,projection:{name:record.snapshot.project.name,first:record.snapshot.tokens[0]??null,count:record.snapshot.tokens.length},latest:record.lastAcceptedCommand,exactCoverage:canonical(record.snapshot)===canonical(sample('coverage',x.project))};}
 case 'prepare':{if(active)throw Error('one-active-mutation');const snapshot=sample(x.fixture,x.project),encoded=codec.encode(snapshot),{incarnation}=await read(x.project);if(!held.has(x.project))throw Error('ownership');const a={...x,snapshot:encoded.snapshot,incarnation,state:'prepared'};active=x.command;attempts.set(x.command,a);event('prepared',{command:x.command});return {command:x.command,expected:x.expected,incarnation,bytes:encoded.counts.snapshotBytes};}
 case 'dispatch':{const a=attempts.get(x.command);if(!a)throw Error('attempt-missing');return dispatch(a,x.abort);}
 case 'cancel':{const a=attempts.get(x.command);if(!a)throw Error('attempt-missing');if(a.state==='prepared'){a.state='cancelled';active=null;event('dispatch-stopped',{command:x.command});return {status:'never-dispatched',stopped:true};}return {status:'unknown',stopped:false};}
 case 'catalogue':return catalogue();
 case 'echo':{const decoded=codec.decode(new Uint8Array(x.bytes)),encoded=codec.encode(decoded.snapshot);return {transfer:encoded.bytes.buffer,exact:canonical(decoded.snapshot)===canonical(encoded.snapshot),counts:encoded.counts};}
 case 'recover':{const ownership=await lock(x.project);if(!ownership)return {status:'unknown',proof:{ownership:false}};event('recovery-ownership',{project:x.project});const {record,incarnation}=await read(x.project);if(record){try{validateRecord(record,x.project);}catch(error){return {status:'unknown',reason:'retained-record-unavailable',error:String(error)};}}const proof={ownership,stopped:x.stopped,ordered:true,incarnation};event('recovery-proof',{project:x.project,...proof});return {status:classify(x.attempt,record?{revision:record.revision,last:record.lastAcceptedCommand?.commandId}:null,proof),proof,revision:record?.revision??null};}
 case 'reset':{if(active)throw Error('active');for(const release of held.values())release();held.clear();return new Promise((r,j)=>{const q=indexedDB.deleteDatabase(DB);q.onsuccess=()=>r(true);q.onerror=()=>j(q.error);});}
 case 'seed':{for(let i=0;i<x.count;i++){const project=String.fromCharCode(65+i);await lock(project);const old=await read(project),snapshot=sample(x.fixture,project);codec.encode(snapshot);const a={project,command:'seed-'+i,expected:old.record?.revision??null,incarnation:old.incarnation,protection:null,snapshot,state:'prepared'};await dispatch(a);held.get(project)?.();held.delete(project);}return {count:x.count,fixture:x.fixture};}
 case 'bench':{const start=performance.now(),s=sample(x.fixture),t=performance.now(),e=codec.encode(s),encodeMs=performance.now()-t,d=performance.now(),decoded=codec.decode(e.bytes),decodeMs=performance.now()-d;return {encodeMs,decodeMs,workerMs:performance.now()-start,exact:canonical(s)===canonical(decoded.snapshot),counts:e.counts,rows:s.tokens.map(t=>({id:t.id,name:t.localName,kind:t.definition?.type??'name-only'})),detail:s.project.description??'',transfer:e.bytes.buffer};}
 default:throw Error('unsupported');
}}
onmessage=async e=>{let x;try{x=validateCall(e.data);const result=await run(x);const transfer=result?.transfer instanceof ArrayBuffer?[result.transfer]:[];postMessage({id:x.id,ok:true,result},transfer);}catch(error){postMessage({id:e.data?.id??null,ok:false,error:String(error).slice(0,250)});}};
event('module-ready');
