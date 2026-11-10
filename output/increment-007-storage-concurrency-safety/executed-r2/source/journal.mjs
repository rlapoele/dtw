import {writeFile,mkdir} from 'node:fs/promises';
export async function runFinite({inventory,execute,cleanup,checkpoint,environment,setup=async()=>{},failureEvidence=async()=>{},watchdogMs=30000,onWatchdog=()=>{}}){
 const report={environment,cases:inventory.map(c=>({...c,status:'not-run'})),cleanup:[]};
 let writes=Promise.resolve();const save=()=>{const snapshot=structuredClone(report);return writes=writes.then(()=>checkpoint(snapshot));};
 await save();
 for(const row of report.cases){
  row.status='running';row.started=new Date().toISOString();row.trace=[];await save();
  let timer,expired=false,watchdogWork=Promise.resolve();
  const record=async fact=>{if(row.trace.length>=8192)throw Error('trace-ceiling');row.trace.push(fact);await save();};
  try{
   const setupStart=Date.now();row.setup=await setup(row,record);row.setupMs=Date.now()-setupStart;await save();row.measuredStart=new Date().toISOString();
   const deadline=new Promise((_,reject)=>{timer=setTimeout(()=>{
    // The deadline latches the failed verdict before any asynchronous receipt/action.
    expired=true;reject(Error('external-watchdog-expired'));
    watchdogWork=(async()=>{const action=Promise.resolve().then(onWatchdog);const receipt=record({type:'external-watchdog',ms:watchdogMs});let actionDeadline;try{await Promise.race([Promise.all([action,receipt]),new Promise((_,fail)=>{actionDeadline=setTimeout(()=>fail(Error('watchdog intervention/receipt deadline')),4000);})]);}catch(error){row.watchdogActionError=String(error);}finally{clearTimeout(actionDeadline);}})();
   },watchdogMs);});
   row.value=await Promise.race([Promise.resolve().then(()=>execute(row,record)),deadline]);
   if(expired)throw Error('external-watchdog-expired');row.status='pass';
  }catch(error){row.status='fail';row.error={name:error.name,message:error.message,stack:error.stack};await save();try{row.partialEvidence=await failureEvidence(row);}catch(e){row.evidenceError=String(e);}}
  finally{clearTimeout(timer);await watchdogWork;row.ended=new Date().toISOString();await save();}
  if(row.status!=='pass')break;
 }
 await save();
 try{await cleanup();report.cleanup.push({status:'complete'});}catch(error){report.cleanup.push({status:'fail',error:String(error)});}
 await save();return report;
}
export async function jsonCheckpoint(file,value){await mkdir(new URL('.',`file://${file}`).pathname,{recursive:true});await writeFile(file,JSON.stringify(value,null,2)+'\n');}
