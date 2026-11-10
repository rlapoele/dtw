// Finite G-02 safety proof only. Never terminates Safari.app or shared windows.
import {spawn} from 'node:child_process';import {readFile,writeFile} from 'node:fs/promises';import {createServer} from 'node:http';import path from 'node:path';import {createHash} from 'node:crypto';
const out='output/increment-007-e4-qualification',r={started:new Date().toISOString(),events:[],attempts:[],scope:'small E-4 source plus finite12s worker supervisor probe; no Safari boundary or defensive source fixture',limits:{finiteBlockMs:12000,interveneAfterStartMs:2000,closeResponseDeadlineMs:3000,outerWatchdogMs:30000},gaps:['Native Safari renderer whole-task timing unavailable: small source equality is not performance qualification','Native selection/copy/Find/AT/zoom not run']};let sid,driver,current;
const save=()=>writeFile(out+'/safari.json',JSON.stringify(r,null,2)+'\n');
const server=createServer(async(req,res)=>{const u=new URL(req.url,'http://localhost');
 if(u.pathname==='/signal'){const event={type:u.searchParams.get('event'),run:u.searchParams.get('run'),at:Date.now()};r.events.push(event);if(current&&event.run===current.id){if(event.type==='block-start'){current.started=event.at;current.start?.();}if(event.type==='witness-acquired')current.witness=event.at;if(event.type==='natural-finish')current.natural=event.at;}res.end('ok');void save();return;}
 if(u.pathname==='/started'){res.end(current?.started?'yes':'no');return;}
 if(u.pathname==='/probe'){res.setHeader('Content-Type','text/html');res.end('<!doctype html><title>E4 owned finite supervisor probe</title>Owned synthetic probe');return;}
 try{const p=path.resolve(out,'build','.'+(u.pathname==='/'?'/index.html':u.pathname));if(!p.startsWith(path.resolve(out,'build')+'/'))throw Error();res.setHeader('Content-Type',p.endsWith('.html')?'text/html':p.endsWith('.css')?'text/css':'text/javascript');res.end(await readFile(p));}catch{res.writeHead(404).end();}
});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));const origin='http://127.0.0.1:'+server.address().port;r.origin=origin;
const portServer=createServer();await new Promise(ok=>portServer.listen(0,'127.0.0.1',ok));const port=portServer.address().port;await new Promise(ok=>portServer.close(ok));const base='http://127.0.0.1:'+port;
async function req(route,body,method=body===undefined?'GET':'POST',timeout=30000){const response=await fetch(base+route,{method,signal:AbortSignal.timeout(timeout),headers:{'Content-Type':'application/json'},...(body===undefined?{}:{body:JSON.stringify(body)})});const data=await response.json();if(data.value?.error)throw Error(JSON.stringify(data.value));return data.value;}
const cmd=(route,body,method,timeout)=>req('/session/'+sid+route,body,method,timeout);
const sync=(script,args=[])=>cmd('/execute/sync',{script,args});
const asyncScript=(script,args=[])=>cmd('/execute/async',{script,args});
async function wait(fn,ms=5000){const end=Date.now()+ms;while(Date.now()<end){if(await fn())return;await new Promise(ok=>setTimeout(ok,50));}throw Error('Bounded wait exceeded');}
async function finiteProbe(intervene,index){
 const id='probe-'+index;current={id};const item={id,intervene,events:[],requestedAt:Date.now()};r.attempts.push(item);
 await cmd('/url',{url:origin+'/probe'});const owned=await cmd('/window');item.ownedWindow=owned;
 const second=await cmd('/window/new',{type:'tab'});await cmd('/window',{handle:second.handle});await cmd('/url',{url:origin+'/probe'});
 await sync(`const id=arguments[0],origin=location.origin;const text=\`(async()=>{while(await(await fetch('${origin}/started')).text()!=='yes')await new Promise(ok=>setTimeout(ok,30));await navigator.locks.request('e4-finite-'+\`+JSON.stringify(id)+\`,async()=>{await fetch('${origin}/signal?run='+\`+JSON.stringify(id)+\`+'&event=witness-acquired');});})();\`;window.witness=new Worker(URL.createObjectURL(new Blob([text],{type:'text/javascript'})));return true;`,[id]);
 await cmd('/window',{handle:owned});
 const started=new Promise(ok=>{current.start=ok;});item.pendingCommandStart=Date.now();let finished=false;
 const pending=asyncScript(`const id=arguments[0],done=arguments[arguments.length-1],origin=location.origin;const code=\`navigator.locks.request('e4-finite-'+\`+JSON.stringify(id)+\`,async()=>{await fetch('${origin}/signal?run='+\`+JSON.stringify(id)+\`+'&event=block-start');const end=performance.now()+12000;while(performance.now()<end){};await fetch('${origin}/signal?run='+\`+JSON.stringify(id)+\`+'&event=natural-finish');}).then(()=>postMessage('finished'));\`;const worker=new Worker(URL.createObjectURL(new Blob([code],{type:'text/javascript'})));worker.onmessage=()=>done({natural:true});worker.onerror=e=>done({error:e.message});`,[id]).then(value=>{finished=true;item.pendingCommandEnd=Date.now();item.pendingResult=value;},error=>{finished=true;item.pendingCommandEnd=Date.now();item.pendingError=String(error);});
 await Promise.race([started,new Promise((_,no)=>setTimeout(()=>no(Error('No block-start signal')),5000))]);item.blockStarted=current.started;item.pendingAtStart=!finished;
 if(intervene){
  await new Promise(ok=>setTimeout(ok,2000));item.pendingBeforeController=!finished;
  // Separate controller process submits the exact current owned-window close while execute/async is pending.
  const code=`const started=Date.now();try{const response=await fetch(process.argv[1],{method:'DELETE',signal:AbortSignal.timeout(3000)});console.log(JSON.stringify({started,ended:Date.now(),status:response.status,body:await response.json()}));}catch(error){console.log(JSON.stringify({started,ended:Date.now(),error:String(error)}));}`;
  const controller=spawn(process.execPath,['--input-type=module','-e',code,base+'/session/'+sid+'/window'],{stdio:['ignore','pipe','pipe']});item.controllerPid=controller.pid;let output='';controller.stdout.on('data',b=>output+=b);await new Promise(ok=>controller.once('close',ok));item.controller=JSON.parse(output);await save();
 }
 await pending;await new Promise(ok=>setTimeout(ok,100));Object.assign(item,{naturalFinish:current.natural,witnessAcquired:current.witness,events:r.events.filter(e=>e.run===id)});
 item.status=intervene?(item.pendingBeforeController&&!item.controller.error&&item.witnessAcquired&&item.witnessAcquired<item.blockStarted+11000&&!item.naturalFinish?'pass':'fail'):'control-completed';
 // Pending command has settled before any cleanup request; never retry a close during the block.
 await cmd('/window',{handle:second.handle}).catch(()=>{});await cmd('/window',undefined,'DELETE').catch(()=>{});await cmd('/window',{handle:owned}).catch(()=>{});
 await save();return item.status==='pass';
}
try{
 driver=spawn('/usr/bin/safaridriver',['-p',String(port)],{stdio:['ignore','ignore','pipe']});r.driverPid=driver.pid;driver.stderr.on('data',b=>r.stderr=((r.stderr??'')+b).slice(-4000));await wait(async()=>{try{await req('/status');return true;}catch{return false;}});
 const session=await req('/session',{capabilities:{alwaysMatch:{browserName:'safari',acceptInsecureCerts:false}}});sid=session.sessionId;r.capabilities=session.capabilities;await cmd('/timeouts',{script:20000,pageLoad:15000});await cmd('/url',{url:origin});await wait(()=>sync('return !!window.e4?.ready'));
 r.small=await asyncScript(`const done=arguments[arguments.length-1];e4.load('small').then(value=>done(value),error=>done({error:String(error)}));`);
 r.small.closed=await asyncScript(`const done=arguments[arguments.length-1];e4.stats().then(done);`);
 const token=await cmd('/element',{using:'xpath',value:"//button[contains(., 't0')]"});await cmd('/element/'+token['element-6066-11e4-a52e-4f735466cecf']+'/click',{});
 const summary=await cmd('/element',{using:'css selector',value:'summary'});const openAt=Date.now();await cmd('/element/'+summary['element-6066-11e4-a52e-4f735466cecf']+'/click',{});await wait(()=>sync('return !!e4.metrics()?.painted'));
 const text=await sync('return document.querySelector("[data-source]").textContent');r.small.source={units:text.length,sha256:createHash('sha256').update(text).digest('hex'),wallMs:Date.now()-openAt,metrics:await sync('return e4.metrics()'),status:'native exact-source small observation only; no target-renderer task coverage'};
 await finiteProbe(false,0);for(let i=1;i<=3;i++){if(!await finiteProbe(true,i)){r.stop={id:'probe-'+i,reason:'Same-pending-state external supervisor not qualified; no Safari defensive data authorized to run'};break;}}
 r.status=r.stop?'partial-supervisor-failed':'partial-safe-subset';
}catch(error){r.error=String(error);r.status='inconclusive';}finally{
 if(sid)try{await req('/session/'+sid,undefined,'DELETE',10000);r.cleanup={ownAutomationSessionDeleted:true,sharedSafariNeverTerminated:true};}catch(error){r.cleanup={error:String(error),sharedSafariNeverTerminated:true};}driver?.kill('SIGTERM');await new Promise(ok=>server.close(ok));r.ended=new Date().toISOString();await save();
}
