const state=document.querySelector('#state'), pre=document.querySelector('#evidence');
const runButton=document.querySelector('#run'), fileInput=document.querySelector('#file'), download=document.querySelector('#download');
const evidence={started:new Date().toISOString(),url:location.href,origin:location.origin,userAgent:navigator.userAgent,secure:isSecureContext,topLevel:window===window.top,mode:location.pathname,events:[],cases:[]};
const record=(type,value)=>{evidence.events.push({type,time:performance.now(),value});pre.textContent=JSON.stringify(evidence,null,2);};
let serial=0,blobURL,backup,main,peer;
function client(){const worker=new Worker('/worker.mjs',{type:'module'}),pending=new Map();
 worker.onmessage=({data})=>{const p=pending.get(data.id);if(!p)return;clearTimeout(p.timer);pending.delete(data.id);data.error?p.reject(Error(data.error)):p.resolve(data.value);};
 worker.onerror=event=>{record('worker-error',{message:event.message||'worker load error'});for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('worker unavailable'));}pending.clear();};
 return {worker,call(op,args={},transfer=[]){return new Promise((resolve,reject)=>{const id=++serial,timer=setTimeout(()=>{pending.delete(id);reject(Error('bounded 8s RPC timeout'));},8000);pending.set(id,{resolve,reject,timer});worker.postMessage({id,op,args},transfer);});},stop(){worker.terminate();for(const p of pending.values()){clearTimeout(p.timer);p.reject(Error('worker terminated'));}pending.clear();}};}
async function digest(bytes){return Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),x=>x.toString(16).padStart(2,'0')).join('');}
function assert(v,label){if(!v)throw Error(label);}
async function test(id,fn){try{const value=await fn();evidence.cases.push({id,status:'pass',value});record('case-pass',id);return value;}catch(error){evidence.cases.push({id,status:'fail',error:String(error)});record('case-fail',{id,error:String(error)});throw error;}}
async function run(){runButton.disabled=true;try{
 const mechanisms=await test('G05-worker-strict-complete-abort',()=>main.call('mechanisms'));
 backup=new Uint8Array(mechanisms.bytes);delete mechanisms.bytes;
 await test('G05-worker-exact-transfer',async()=>{const bytes=backup.slice().buffer,expectedHash=await digest(bytes),echoPromise=main.call('echo',{bytes},[bytes]);const detached=bytes.byteLength===0;const echo=await echoPromise;assert(detached&&echo.exact&&echo.sha256===expectedHash,'transfer mismatch');const returnedHash=await digest(echo.bytes);assert(returnedHash===expectedHash,'return bytes mismatch');delete echo.bytes;return {...echo,detached,returnedHash};});
 await test('G05-worker-native-locks',async()=>{const key=crypto.randomUUID();peer=client();await peer.call('capability');let owner,contender;try{owner=await main.call('acquire',{key});contender=await peer.call('acquire',{key});assert(owner&&!contender,'exclusive lock failed');}finally{await main.call('release',{key});}const after=await peer.call('acquire',{key});try{assert(after,'reacquisition failed');}finally{await peer.call('release',{key});peer.stop();peer=null;}return {owner,contender,after};});
 if(blobURL)URL.revokeObjectURL(blobURL);blobURL=URL.createObjectURL(new Blob([backup],{type:'application/json'}));download.href=blobURL;download.hidden=false;fileInput.disabled=false;
 state.textContent='Small HTTPS mechanisms passed. Download and choose this synthetic backup to qualify the native file path.';
 }catch(error){state.textContent='Required mechanism failed; no fallback: '+String(error);fileInput.disabled=true;download.hidden=true;}finally{record('run-finished',null);}}
download.addEventListener('click',()=>record('download-gesture',{bytes:backup?.length,filename:download.download,meaning:'initiation only; not proof of completed file'}));
fileInput.addEventListener('change',async()=>{const file=fileInput.files[0];if(!file)return;try{await test('G05-native-selected-file-restore',async()=>{assert(backup,'run mechanisms first');assert(file.size<=65536,'only small synthetic backup allowed');const bytes=await file.arrayBuffer(),hash=await digest(bytes),expected=await digest(backup);assert(hash===expected,'file differs from synthetic backup');const promise=main.call('file-restore',{bytes},[bytes]),detached=bytes.byteLength===0;const result=await promise;assert(detached&&result.sha256===hash&&await digest(result.bytes)===hash,'restored byte mismatch');delete result.bytes;return {...result,selectedFilename:file.name,selectedBytes:file.size,selectedSHA256:hash,detached};});state.textContent='Exact synthetic file restored into a fresh own database.';}catch(error){state.textContent='File check failed: '+String(error);}record('file-finished',null);});
fileInput.addEventListener('cancel',()=>record('native-file-input-cancel','actual cancel event'));
document.addEventListener('securitypolicyviolation',e=>record('csp-violation',{effectiveDirective:e.effectiveDirective,blockedURI:e.blockedURI,disposition:e.disposition}));
async function init(){try{
 assert(isSecureContext&&window===window.top,'top-level secure context required');
 if(location.pathname==='/capability-failure'){record('injected-required-capability-denial',{capability:'Worker',injection:true});throw Error('required worker capability denied by labelled negative control');}
 main=client();const capability=await main.call('capability');assert(capability.secure&&capability.locks&&capability.indexedDB,'required worker capability unavailable');
 evidence.capability=capability;
 if(location.pathname==='/blocked')throw Error('CSP negative unexpectedly loaded worker');
 state.textContent='Module worker ready; small synthetic checks available.';runButton.disabled=false;record('ready',capability);
 }catch(error){evidence.capabilityFailure=String(error);main?.stop();main=null;state.textContent='Required capability unavailable; no storage/fallback: '+String(error);record('fail-closed',{error:String(error),writesDispatched:0,synchronousFallback:false,volatileFallback:false});}finally{window.httpsQualificationReady=true;}}
runButton.addEventListener('click',run);
window.h={evidence,run,stop(){main?.stop();peer?.stop();if(blobURL)URL.revokeObjectURL(blobURL);},snapshot(){return JSON.parse(JSON.stringify(evidence));}};
window.addEventListener('pagehide',()=>window.h.stop());
await init();
