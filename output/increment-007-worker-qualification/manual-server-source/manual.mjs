const status=document.querySelector('#status'),project='manual-safari-checkpoint',observations=[];
function log(type,value){observations.push({type,time:new Date().toISOString(),value});status.textContent=JSON.stringify(observations,null,2);}
async function save(){const evidence={origin:location.origin,userAgent:navigator.userAgent,normalProfile:'user instructed to use normal nonprivate Safari; not fingerprinted',observations,events:q.events,lifecycle:q.lifecycle,previousLifecycle:sessionStorage.getItem('worker-lifecycle')};await fetch('/manual-evidence',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(evidence)});}
async function verify(){const result=await q.call('read',{project});log('verify-existing',result);await save();return result;}
while(!window.ready)await new Promise(r=>setTimeout(r,10));
try{log('capability',await q.call('capability'));await verify();}catch(e){log('error',String(e));}
document.querySelector('#checkpoint').onclick=async()=>{try{const old=await q.call('read',{project});if(!old.absent){log('checkpoint-already-exists-do-not-overwrite',old);return;}if(!await q.call('lock',{project}))throw Error('checkpoint is owned by another open harness tab');const command='manual-'+Date.now();const attempt=await q.call('prepare',{project,command,expected:null,fixture:'coverage',protection:null});log('checkpoint-attempt',attempt);log('checkpoint-complete',await q.call('dispatch',{command,abort:false}));await q.call('release',{project});await verify();}catch(e){log('error',String(e));await save();}};
document.querySelector('#verify').onclick=verify;
document.querySelector('#restart').onclick=async()=>{log('user-attestation','I quit and reopened normal Safari myself before this click; other browser work managed by me');await verify();};
document.querySelector('#save').onclick=async()=>{log('user-record','Record observations clicked');await save();};
// Generate small exact backup in worker; native download click remains user operated.
const b=await q.call('bench',{fixture:'coverage'});q.setBackup(b.transfer);
document.querySelector('#file').addEventListener('change',async e=>{try{const f=e.target.files[0];if(!f)return;const bytes=await f.arrayBuffer();const hash=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',bytes)),b=>b.toString(16).padStart(2,'0')).join('');const result=await q.call('echo',{bytes},[bytes]);log('native-picker-selected',{name:f.name,bytes:result.transfer.byteLength,sha256:hash,workerDecodeExact:result.exact});await save();}catch(e){log('file-error',String(e));await save();}});
document.querySelector('#file').addEventListener('cancel',async()=>{log('native-picker-cancel','native input cancel event received');await save();});
document.querySelector('#download').addEventListener('click',async()=>{log('native-download-gesture',{expectedBytes:b.counts.fileBytes});await save();});
