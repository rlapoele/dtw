// Driver-only evidence collection. No HTTP, WebDriver session, or browser commands.
import {spawn, execFile} from 'node:child_process';
import net from 'node:net';
import {mkdir, writeFile, rename} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';

export function listenerPids(text) {
  return [...new Set(text.split('\n').filter(line => /^p\d+$/.test(line)).map(line => Number(line.slice(1))))];
}
export async function boundedCommand(command, args, timeoutMs=1000) {
  const start=Date.now();
  return new Promise(resolve => {
    execFile(command,args,{encoding:'utf8',timeout:timeoutMs,maxBuffer:32768},(error,stdout,stderr)=>resolve({
      command,args,timeoutMs,stdout,stderr,exitCode:error ? (typeof error.code==='number'?error.code:null):0,
      signal:error?.signal??null,timedOut:Boolean(error?.killed),error:error?{name:error.name,message:error.message,code:error.code}:null,elapsedMs:Date.now()-start,
    }));
  });
}
async function main() {
  const output=new URL('../../output/increment-007-safari-readiness-supervision/',import.meta.url);
  await mkdir(output,{recursive:true});
  const report={started:new Date().toISOString(),kind:'driver-only; no HTTP or session',node:process.version,uid:process.getuid(),events:[],attempts:[]};
  const checkpoint=async()=>{const tmp=new URL('driver-diagnostic.json.tmp',output);await writeFile(tmp,JSON.stringify(report,null,2)+'\n');await rename(tmp,new URL('driver-diagnostic.json',output));};
  await checkpoint();
  const reserve=net.createServer();
  await new Promise((resolve,reject)=>{reserve.once('error',reject);reserve.listen(0,'127.0.0.1',resolve);});
  report.port=reserve.address().port;
  const numericArgs=['-nP','-iTCP:'+report.port,'-sTCP:LISTEN','-FpcuLn'];
  await new Promise(resolve=>reserve.close(resolve));
  report.beforeLaunch=await boundedCommand('/usr/sbin/lsof',numericArgs);
  if(report.beforeLaunch.exitCode!==1||report.beforeLaunch.stdout!==''||report.beforeLaunch.stderr!=='') {report.refusal='exact endpoint not proven unused';await checkpoint();return;}
  report.command='/usr/bin/safaridriver';report.args=['-p',String(report.port)];
  const child=spawn(report.command,report.args,{stdio:['ignore','ignore','pipe']});
  report.spawnPid=child.pid??null;report.stderr='';report.stderrTruncated=false;
  let exited=false;
  child.stderr.on('data',b=>{const next=report.stderr+b;report.stderrTruncated ||= next.length>10000;report.stderr=next.slice(-10000);});
  child.once('spawn',()=>report.events.push({type:'spawn',at:Date.now(),pid:child.pid}));
  child.once('error',e=>report.events.push({type:'error',at:Date.now(),message:String(e),code:e.code}));
  child.once('exit',(code,signal)=>{exited=true;report.events.push({type:'exit',at:Date.now(),code,signal});});
  const start=Date.now();
  try {
    await checkpoint();
    for(let attempt=0;attempt<3&&Date.now()-start<6000&&!exited;attempt++) {
      const original=await boundedCommand('/usr/sbin/lsof',['-t','-a','-p',String(child.pid),'-iTCP:'+report.port,'-sTCP:LISTEN']);
      const numeric=await boundedCommand('/usr/sbin/lsof',numericArgs);
      const pids=listenerPids(numeric.stdout);
      const receipt={at:Date.now(),original,originalPredicate:original.exitCode===0&&original.stdout.trim().split('\n').includes(String(child.pid)),numeric,listenerPids:pids,metadata:[]};
      for(const pid of pids.filter(pid=>pid!==child.pid)) {
        receipt.metadata.push(await boundedCommand('/bin/ps',['-p',String(pid),'-o','pid=,ppid=,uid=,comm=']));
        receipt.metadata.push(await boundedCommand('/usr/sbin/lsof',['-nP','-a','-p',String(pid),'-d','txt','-Fpn']));
      }
      report.attempts.push(receipt);await checkpoint();
      if(pids.length)break;
      await new Promise(resolve=>setTimeout(resolve,100));
    }
  } catch(e) {report.failure=String(e);}
  finally {
    report.cleanup={requestedAt:Date.now(),targetPid:child.pid,signal:'SIGTERM',sent:false};
    if(!exited)report.cleanup.sent=child.kill('SIGTERM');
    await checkpoint();
    const stop=Date.now();
    while(!exited&&Date.now()-stop<2000)await new Promise(resolve=>setTimeout(resolve,25));
    report.cleanup.observedExit=exited;
    report.cleanup.endpoint=await boundedCommand('/usr/sbin/lsof',numericArgs);
    report.cleanup.endpointGone=report.cleanup.endpoint.exitCode===1&&report.cleanup.endpoint.stdout===''&&report.cleanup.endpoint.stderr==='';
    report.cleanup.completedAt=Date.now();report.finished=new Date().toISOString();await checkpoint();
  }
  console.log(JSON.stringify({output:fileURLToPath(new URL('driver-diagnostic.json',output)),spawnPid:report.spawnPid,port:report.port,listenerPids:report.attempts.map(a=>a.listenerPids),cleanup:report.cleanup}));
}
if(process.argv[1]===fileURLToPath(import.meta.url))await main();
