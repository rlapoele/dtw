// Small synthetic HTTPS probe only. No production application operations or RPC.
import * as parser from './vendor/main.js';
import {makeCodec, canonical} from './codec.mjs';
import {coverage} from './fixtures.mjs';
const codec=makeCodec(parser), sample=coverage(), held=new Map();
const prefix='dtw-isolated-https-g05-', events=[];
let sequence=0;
const event=(type,detail={})=>events.push({sequence:++sequence,type,time:performance.now(),...detail});
const same=(a,b)=>canonical(a)===canonical(b);
const assert=(v,label)=>{if(!v)throw Error(label);};
async function open(name){return new Promise((resolve,reject)=>{const r=indexedDB.open(prefix+name,1);r.onupgradeneeded=()=>r.result.createObjectStore('records');r.onerror=()=>reject(r.error);r.onsuccess=()=>resolve(r.result);});}
async function read(name){const db=await open(name);return new Promise((resolve,reject)=>{const tx=db.transaction('records');let record;tx.objectStore('records').get('synthetic').onsuccess=e=>{record=e.target.result;event('read-request-success');};tx.oncomplete=()=>{event('read-complete');db.close();resolve(record);};tx.onabort=()=>{db.close();reject(tx.error);};});}
async function write(name,snapshot,abort=false){const db=await open(name);return new Promise((resolve,reject)=>{let tx;try{tx=db.transaction('records','readwrite',{durability:'strict'});assert(tx.durability==='strict','strict durability unavailable');}catch(e){db.close();reject(e);return;}
 const begin=events.length;event('write-issued',{abort,durability:tx.durability});
 const req=tx.objectStore('records').put({revision:abort?'aborted':'accepted',snapshot},'synthetic');
 req.onsuccess=()=>{event('write-request-success');if(abort){event('explicit-abort-request');tx.abort();}};
 tx.oncomplete=()=>{event('write-complete');db.close();resolve({status:'retained-after-complete',trace:events.slice(begin)});};
 tx.onabort=()=>{event('write-abort');db.close();if(abort)resolve({status:'known-aborted',trace:events.slice(begin)});else reject(tx.error||Error('unexpected abort'));};
 });}
async function acquire(key){return new Promise((resolve,reject)=>{navigator.locks.request(prefix+key,{ifAvailable:true},lock=>{if(!lock){event('lock-unavailable');resolve(false);return;}return new Promise(release=>{held.set(key,release);event('lock-acquired');resolve(true);});}).catch(reject);});}
function release(key){held.get(key)?.();held.delete(key);event('lock-release');}
async function digest(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');}
const expected=codec.encode(sample).bytes;
async function call(op,args){switch(op){
case 'capability': return {secure:isSecureContext,worker:true,locks:!!navigator.locks,indexedDB:!!self.indexedDB,origin:location.origin,userAgent:navigator.userAgent};
case 'acquire': return acquire(args.key);
case 'release': release(args.key);return true;
case 'mechanisms': {
 assert(isSecureContext&&navigator.locks&&self.indexedDB,'required capability unavailable');
 const name=crypto.randomUUID();const committed=await write(name,sample);const before=await read(name);
 assert(same(before.snapshot,sample),'commit readback mismatch');
 const changed=structuredClone(sample);changed.project.description='synthetic aborted value';
 const aborted=await write(name,changed,true);const after=await read(name);
 assert(same(before,after),'abort changed record');
 assert(committed.trace.map(x=>x.type).join(',')==='write-issued,write-request-success,write-complete','complete event order');
 assert(aborted.trace.map(x=>x.type).join(',')==='write-issued,write-request-success,explicit-abort-request,write-abort','abort event order');
 const bytes=expected.slice();return {committed,aborted,exactReadback:true,unchangedAfterAbort:true,byteLength:bytes.length,sha256:await digest(bytes),bytes:bytes.buffer,syntheticDatabase:prefix+name};
}
case 'file-restore': {
 assert(args.bytes instanceof ArrayBuffer&&args.bytes.byteLength<=65536,'synthetic file bound');
 const input=new Uint8Array(args.bytes);assert(input.length===expected.length&&input.every((v,i)=>v===expected[i]),'only the exact synthetic backup is accepted');
 const decoded=codec.decode(input);assert(same(decoded.snapshot,sample),'decode exact mismatch');
 const name='restore-'+crypto.randomUUID();const absent=await read(name);assert(absent===undefined,'restore target not empty');
 const committed=await write(name,decoded.snapshot);const after=await read(name);const encoded=codec.encode(after.snapshot).bytes;
 assert(encoded.length===input.length&&encoded.every((v,i)=>v===input[i]),'restore bytes mismatch');
 return {status:'restored-synthetic-only',freshEmptyDatabase:true,committed,exactAuthoredEquality:true,exactBytes:true,sha256:await digest(encoded),byteLength:encoded.length,bytes:encoded.buffer,syntheticDatabase:prefix+name};
}
case 'echo': {
 assert(args.bytes instanceof ArrayBuffer&&args.bytes.byteLength<=65536,'synthetic transfer bound');const bytes=new Uint8Array(args.bytes);
 const decoded=codec.decode(bytes);assert(same(decoded.snapshot,sample),'transferred fixture mismatch');const output=codec.encode(decoded.snapshot).bytes;
 assert(bytes.length===output.length&&bytes.every((v,i)=>v===output[i]),'transfer exact bytes mismatch');
 return {exact:true,sha256:await digest(output),byteLength:output.length,bytes:output.buffer};
}
default:throw Error('unknown synthetic operation');}}
self.onmessage=async({data})=>{try{const value=await call(data.op,data.args||{});postMessage({id:data.id,value},value?.bytes?[value.bytes]:[]);}catch(error){postMessage({id:data.id,error:String(error)});}};
