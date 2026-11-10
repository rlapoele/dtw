import net from 'node:net';
import {spawn} from 'node:child_process';
import {boundedCommand,listenerPids} from './driver-diagnostic.mjs';

export const image='/System/Library/PrivateFrameworks/WebDriver.framework/Versions/A/XPCServices/com.apple.WebDriver.HTTPService.xpc/Contents/MacOS/com.apple.WebDriver.HTTPService';
export const executablePaths=[image,'/System/Volumes/Preboot/Cryptexes/Incoming/OS'+image];
export const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
export function commandOK(r){return r.exitCode===0&&!r.timedOut&&!r.signal&&!r.error&&r.stderr==='';}
export function endpointGone(r){return r.exitCode===1&&!r.timedOut&&!r.signal&&r.stdout===''&&r.stderr==='';}
export function validateListener({numeric,ps,executable,uid,live}) {
  if(!live)throw Error('owned driver not live');
  if(!commandOK(numeric))throw Error('listener query failed');
  const pids=listenerPids(numeric.stdout);
  if(pids.length!==1)throw Error('ambiguous listener PIDs');
  const pid=pids[0];
  if(!commandOK(ps)||!commandOK(executable))throw Error('listener metadata query failed');
  const lines=ps.stdout.trim().split('\n');
  const match=lines.length===1&&lines[0].trim().match(/^(\d+)\s+(\d+)\s+(\d+)\s+(.+)$/);
  if(!match||Number(match[1])!==pid||Number(match[3])!==uid||match[4]!==image)throw Error('listener PID/UID/image mismatch');
  const sections=numeric.stdout.split(/(?=^p\d+$)/m).filter(s=>s.startsWith('p'));
  if(sections.length!==1||!sections[0].split('\n').includes('u'+uid)||!sections[0].split('\n').includes('ccom.apple.WebDriver.HTTPService'))throw Error('listener identity fields mismatch');
  const paths=executable.stdout.split('\n').filter(s=>s.startsWith('n')).map(s=>s.slice(1));
  if(!executable.stdout.split('\n').includes('p'+pid)||!paths.some(p=>executablePaths.includes(p)))throw Error('listener executable path mismatch');
  return {pid,uid,ppid:Number(match[2]),image,executablePaths:paths.filter(p=>executablePaths.includes(p))};
}
export async function stopOwnedDriver(state,{query=boundedCommand,checkpoint=async()=>{}}={}) {
  const {child,receipt}=state;
  receipt.cleanup={requestedAt:Date.now(),pid:child.pid,signal:'SIGTERM',sent:false};
  if(child.exitCode===null&&child.signalCode===null)receipt.cleanup.sent=child.kill('SIGTERM');
  const start=Date.now();
  while(child.exitCode===null&&child.signalCode===null&&Date.now()-start<2000)await pause(25);
  receipt.cleanup.observedExit=child.exitCode!==null||child.signalCode!==null;
  receipt.cleanup.exitCode=child.exitCode;receipt.cleanup.signalCode=child.signalCode;
  receipt.cleanup.endpoint=await query('/usr/sbin/lsof',state.numericArgs,1000);
  receipt.cleanup.endpointGone=endpointGone(receipt.cleanup.endpoint);
  receipt.cleanup.completedAt=Date.now();
  await checkpoint(receipt);
  return receipt.cleanup;
}
export async function startOwnedXpcDriver({checkpoint=async()=>{},query=boundedCommand,launch=spawn,reservePort,uid=process.getuid(),timeoutMs=5000}={}) {
  const receipt={startedAt:Date.now(),uid,events:[],attempts:[],stdout:'',stderr:'',stdoutTruncated:false,stderrTruncated:false};
  await checkpoint(receipt);
  if(reservePort)receipt.port=await reservePort();
  else {
    const reserve=net.createServer();
    await new Promise((resolve,reject)=>{reserve.once('error',reject);reserve.listen(0,'127.0.0.1',resolve);});
    receipt.port=reserve.address().port;await new Promise(resolve=>reserve.close(resolve));
  }
  const numericArgs=['-nP','-iTCP:'+receipt.port,'-sTCP:LISTEN','-FpcuLn'];
  receipt.before=await query('/usr/sbin/lsof',numericArgs,1000);
  if(!endpointGone(receipt.before)) {receipt.refusal='endpoint not proven unused';await checkpoint(receipt);throw Error(receipt.refusal);}
  receipt.command='/usr/bin/safaridriver';receipt.args=['-p',String(receipt.port)];
  const child=launch(receipt.command,receipt.args,{stdio:['ignore','pipe','pipe']});
  receipt.pid=child.pid??null;
  const state={child,receipt,numericArgs};let spawnError;
  for(const stream of ['stdout','stderr'])child[stream].on('data',b=>{const text=receipt[stream]+b;receipt[stream+'Truncated'] ||= text.length>10000;receipt[stream]=text.slice(-10000);});
  child.once('spawn',()=>receipt.events.push({type:'spawn',at:Date.now(),pid:child.pid}));
  child.once('error',e=>{spawnError=e;receipt.events.push({type:'error',at:Date.now(),error:String(e),code:e.code});});
  child.once('exit',(code,signal)=>receipt.events.push({type:'exit',at:Date.now(),code,signal}));
  const live=()=>!spawnError&&Number.isInteger(child.pid)&&child.exitCode===null&&child.signalCode===null;
  try {
    await checkpoint(receipt);
    const start=Date.now();
    while(Date.now()-start<timeoutMs) {
      if(!live())throw Error('owned driver exited or spawn failed');
      const numeric=await query('/usr/sbin/lsof',numericArgs,1000),attempt={at:Date.now(),numeric};receipt.attempts.push(attempt);
      if(endpointGone(numeric)){await checkpoint(receipt);await pause(50);continue;}
      const pids=listenerPids(numeric.stdout);
      if(!commandOK(numeric)||pids.length!==1)throw Error('listener query failed or ambiguous');
      const pid=pids[0];
      attempt.ps=await query('/bin/ps',['-p',String(pid),'-o','pid=,ppid=,uid=,comm='],1000);
      attempt.executable=await query('/usr/sbin/lsof',['-nP','-a','-p',String(pid),'-d','txt','-Fpn'],1000);
      receipt.ownership=validateListener({...attempt,uid,live:live()});
      receipt.ownership.verifiedAt=Date.now();await checkpoint(receipt);
      if(!live())throw Error('owned driver exited after ownership checkpoint');
      return state;
    }
    throw Error('owned driver readiness deadline');
  }catch(error){receipt.failure=String(error);try{await checkpoint(receipt);}finally{await stopOwnedDriver(state,{query,checkpoint});}throw error;}
}
