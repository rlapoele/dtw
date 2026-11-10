import {writeFile,mkdir} from 'node:fs/promises';
// Checkpoint original failure BEFORE cleanup. Cleanup never rewrites the verdict.
export async function runFinite({inventory,execute,cleanup,checkpoint,environment,setup=async()=>{},watchdogMs=30000,onWatchdog=()=>{}}){
 const report={environment,cases:inventory.map(c=>({...c,status:'not-run'})),cleanup:[],events:[]};
 await checkpoint(report);
 for(const row of report.cases){
  row.status='running';row.started=new Date().toISOString();row.trace=[];await checkpoint(report);
  let timer;
  const record=async fact=>{if(row.trace.length>=8192)throw Error('trace-ceiling');row.trace.push(fact);await checkpoint(report);};
  try{const setupStart=Date.now();row.setup=await setup(row,record);row.setupMs=Date.now()-setupStart;await checkpoint(report);row.measuredStart=new Date().toISOString();row.value=await Promise.race([execute(row,record),new Promise((_,reject)=>{timer=setTimeout(()=>{void (async()=>{try{await record({type:'external-watchdog',ms:watchdogMs});await onWatchdog();}catch(error){row.watchdogActionError=String(error);}finally{reject(Error('external-watchdog-expired'));}})();},watchdogMs);})]);row.status='pass';}
  catch(error){row.status='fail';row.error={name:error.name,message:error.message,stack:error.stack};}
  finally{clearTimeout(timer);row.ended=new Date().toISOString();await checkpoint(report);}
  if(row.status!=='pass')break;
 }
 await checkpoint(report); // survives browser shutdown / profile removal failure
 try{await cleanup();report.cleanup.push({status:'complete'});}catch(error){report.cleanup.push({status:'fail',error:String(error)});}
 await checkpoint(report);return report;
}
export async function jsonCheckpoint(file,value){await mkdir(new URL('.',`file://${file}`).pathname,{recursive:true});await writeFile(file,JSON.stringify(value,null,2)+'\n');}
