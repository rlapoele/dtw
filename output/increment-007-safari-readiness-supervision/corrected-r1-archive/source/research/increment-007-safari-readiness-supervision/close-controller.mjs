import {writeFile,rename} from 'node:fs/promises';
const [port,sid,target,file]=process.argv.slice(2);
if(!/^\d+$/.test(port)||!sid||!target||!file)throw Error('controller scope missing');
const receipt={target,requestAt:Date.now(),method:'DELETE pinned exact owned current window',deadlineMs:3000};
const save=async()=>{await writeFile(file+'.tmp',JSON.stringify(receipt,null,2)+'\n');await rename(file+'.tmp',file);};
await save();
try {
 const response=await fetch(`http://127.0.0.1:${port}/session/${encodeURIComponent(sid)}/window`,{method:'DELETE',signal:AbortSignal.timeout(3000)});
 receipt.status=response.status;receipt.response=await response.json();receipt.ok=response.ok&&!receipt.response.value?.error;
}catch(error){receipt.error=String(error);receipt.ok=false;}
receipt.responseAt=Date.now();await save();process.stdout.write(JSON.stringify(receipt));
