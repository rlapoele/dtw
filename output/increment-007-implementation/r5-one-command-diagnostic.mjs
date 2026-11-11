import { chromium } from '/Users/rlapoele-pro/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import { mkdtemp, readFile, mkdir, writeFile } from 'node:fs/promises';
import { writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { gzipSync } from 'node:zlib';
import { tmpdir } from 'node:os';
import path from 'node:path';
import assert from 'node:assert/strict';
import { OwnedProcessWatchdog } from './r5-owned-process-watchdog.mjs';
import {snapshot,envelope,exactSnapshotBytes,sourceBoundary,fixtureFacts} from './r5-qualification-fixtures.mjs';
const root='/Users/rlapoele-pro/Library/CloudStorage/Dropbox/Projects/aiAssistedProjects/dtw';
const manifestPath=root+'/output/increment-007-implementation/s4-r5-before-browser-manifest.json';
const expectedManifest='771f2f1bf841dffb2c9888ac6dc512ce12e584e4e498e4ab5413232110f8ab4f';
const kind='ordinary1000',coldOnly=true;
assert(['ordinary100','ordinary1000','maximum','catalogue25','source65535','source65536','source65537'].includes(kind),'Choose one finite reviewed case');
const stamp=new Date().toISOString().replaceAll(':','-');
const output=root+'/output/playwright/increment-007-implementation/qualification-diagnostic-one-command-'+kind+'-'+stamp;
await mkdir(output,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const evidence={case:kind,date:new Date().toISOString(),manifest:expectedManifest,operations:[],fixtures:[],watchdog:[],errors:[],status:'preparing',limits:{ordinaryTask:100,sourceTask:250,sourceAction:5000,operationStop:30000}};
const checkpoint=()=>writeFileSync(output+'/evidence.json.gz',gzipSync(Buffer.from(JSON.stringify(evidence))));
async function verifyManifest(){const bytes=await readFile(manifestPath);assert.equal(sha(bytes),expectedManifest);const manifest=JSON.parse(bytes);for(const item of [...manifest.sources,...manifest.build])assert.equal(sha(await readFile(item.path.startsWith('/')?item.path:root+'/'+item.path)),item.sha256,'Snapshot drift: '+item.path);}
await verifyManifest();
for(const artifact of ['r5-one-command-diagnostic.mjs','r5-qualification-fixtures.mjs','r5-owned-process-watchdog.mjs']){const bytes=await readFile(new URL('./'+artifact,import.meta.url));evidence[artifact+'Sha256']=sha(bytes);await writeFile(output+'/'+artifact+'.gz',gzipSync(bytes));}
const profile=await mkdtemp(path.join(tmpdir(),'dtw007-qualification-owned-'));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--user-data-dir='+profile,'--remote-debugging-port=0','--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
evidence.profile=profile;evidence.ownedChromePid=chrome.pid;checkpoint();
let browser,page,downloadPath;
const supervisor=new OwnedProcessWatchdog(chrome,evidence,checkpoint);
const supervised=(name,fn)=>supervisor.run(name,fn);
async function metrics(){return page.evaluate(()=>({tasks:window.__dtwQualification.tasks.splice(0),calls:window.__dtwQualification.calls.splice(0)}));}
async function operation(name,fn,{sourceUnits=0,actionBudget=Infinity}={}){
  let duration,data;
  await supervised(name,async()=>{
    await metrics();
    const started=performance.now();
    await fn();
    // Two native animation frames include the complete resulting first paint.
    await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
    duration=performance.now()-started;
    // Observer delivery is supervised but is not charged as action latency.
    await page.waitForTimeout(60);
    data=await metrics();
  });
  const budget=sourceUnits>65536?250:100;
  const result={name,duration,sourceUnits,taskBudget:budget,...data};
  evidence.operations.push(result);checkpoint();
  assert.equal(evidence.errors.length,0,'Production page error');
  assert(data.tasks.every(task=>task.duration<=budget),`Renderer task exceeds ${budget}ms in ${name}`);
  assert(duration<=actionBudget,`Action exceeds ${actionBudget}ms in ${name}`);
  assert(data.calls.every(call=>call.status==='ok'),'Worker rejected operation in '+name);
  return result;
}
const p95=samples=>[...samples].sort((a,b)=>a-b)[Math.ceil(samples.length*0.95)-1];
async function projects(){await page.getByRole('button',{name:'Projects',exact:true}).click();await page.getByRole('heading',{name:'Projects in this browser',exact:true}).waitFor();await page.waitForFunction(()=>!document.querySelector('input[type=file]')?.disabled);}
async function loaded(){await page.getByRole('heading',{name:'All colors',exact:true}).waitFor();await page.getByText(/Preparing complete project list/).waitFor({state:'hidden'});await page.getByRole('button',{name:'New token',exact:true}).first().waitFor();}
async function chooseToken(){await page.getByRole('button',{name:/^token0 Unspecified/}).click();await page.getByLabel('Red',{exact:true}).waitFor();}
async function submitBackup(value,restore=true){const file={name:'qualification.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(envelope(value)))};await page.getByLabel('Project backup file',{exact:true}).setInputFiles(file);await page.getByRole('heading',{name:'Review project backup',exact:true}).waitFor();if(restore){await page.getByRole('button',{name:'Restore project',exact:true}).click();await loaded();}else{await page.getByRole('dialog').getByRole('button',{name:'Cancel',exact:true}).click();await page.getByRole('dialog').waitFor({state:'hidden'});}}
async function prepare(value){const facts=fixtureFacts(value);evidence.fixtures.push({...facts,projectId:value.project.id,sha256:sha(Buffer.from(JSON.stringify(envelope(value))))});checkpoint();await operation('setup:stage/restore '+value.project.id,()=>submitBackup(value));}
async function backup(){const event=page.waitForEvent('download');await page.getByRole('button',{name:'Download backup',exact:true}).click();const file=await event;const target=path.join(downloadPath,path.basename(file.suggestedFilename()));for(let index=0;index<100;index++){try{const bytes=await readFile(target);assert(JSON.parse(bytes).snapshot,'Invalid backup');return bytes;}catch{await new Promise(resolve=>setTimeout(resolve,20));}}throw Error('Native downloaded backup not complete');}
try{
  await supervised('owned Chrome readiness',async()=>{for(let i=0;i<100;i++){try{const port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];browser=await chromium.connectOverCDP('http://127.0.0.1:'+port,{timeout:1000});break;}catch{await new Promise(r=>setTimeout(r,100));}}assert(browser,'Owned Chrome unavailable');});
  evidence.browser=browser.version();downloadPath=path.join(profile,'downloads');await mkdir(downloadPath);const cdp=await browser.newBrowserCDPSession();await cdp.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath,eventsEnabled:true});const context=browser.contexts()[0];context.setDefaultTimeout(7000);
  await context.addInitScript(()=>{
    const state=window.__dtwQualification={tasks:[],calls:[]};
    new PerformanceObserver(list=>{for(const entry of list.getEntries())state.tasks.push({start:entry.startTime,duration:entry.duration,name:entry.name});}).observe({type:'longtask',buffered:true});
    const NativeWorker=window.Worker;
    window.Worker=class extends NativeWorker{
      constructor(...args){super(...args);this.pending=new Map();this.addEventListener('message',event=>{const message=event.data,request=this.pending.get(message?.id);if(request){state.calls.push({operation:request.operation,duration:performance.now()-request.start,status:message.status});this.pending.delete(message.id);}});}
      postMessage(message,...rest){this.pending.set(message.id,{operation:message.operation,start:performance.now()});return super.postMessage(message,...rest);}
    };
  });
  page=await context.newPage();page.on('pageerror',error=>{evidence.errors.push(String(error));checkpoint();});
  await supervised('cold empty-origin startup',async()=>{await page.goto('http://127.0.0.1:4334/');await page.getByText('No projects retained in this browser.').waitFor();});
  evidence.observer=await page.evaluate(()=>({supported:PerformanceObserver.supportedEntryTypes.includes('longtask'),instrumented:!!window.__dtwQualification}));assert(evidence.observer.supported&&evidence.observer.instrumented,'Long-task observer unavailable');evidence.coldStartup=await metrics();assert(evidence.coldStartup.calls.length>0,'Production Worker observation unavailable');assert(evidence.coldStartup.tasks.every(t=>t.duration<=100),'Cold ordinary startup task exceeds 100ms');
  if(kind.startsWith('ordinary')){
    const count=Number(kind.slice(8)),value=snapshot('ordinary-'+count,count);await prepare(value);await operation('cold:selected inspection',chooseToken);
    const commands=[],encodes=[],decodes=[],catalogues=[];
    if(!coldOnly)for(let index=-1;index<20;index++){
      const phase=index<0?'warmup':'measured';
      const action=await operation(`${phase}:command:${index}`,async()=>{await page.getByLabel('Red',{exact:true}).fill(index%2===0?'0.3':'0.4');await page.getByRole('button',{name:'Apply changes',exact:true}).click();await page.getByRole('button',{name:'Apply changes',exact:true}).waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(el=>el.textContent==='Apply changes'&&el.disabled));});
      const encoded=await operation(`${phase}:backup:${index}`,backup,{actionBudget:2000});
      const decoded=await operation(`${phase}:stage-cancel:${index}`,()=>submitBackup(value,false),{actionBudget:2000});
      const catalogue=await operation(`${phase}:catalogue:${index}`,projects,{actionBudget:2000});
      await operation(`${phase}:reopen:${index}`,async()=>{await page.getByRole('button',{name:value.project.name,exact:true}).click();await loaded();await chooseToken();});
      if(index>=0){commands.push(action.duration);encodes.push(encoded.duration);decodes.push(decoded.duration);catalogues.push(catalogue.duration);}
    }
    evidence.distributions={commands,encodes,decodes,catalogues,p95:{command:p95(commands),encode:p95(encodes),decode:p95(decodes),catalogue:p95(catalogues)}};
    if(!coldOnly)assert(p95(commands)<=(count===100?250:1000),'Command p95 exceeds agreed budget');
    evidence.coldOnly=coldOnly;
    await operation('cold-correction:fresh-app-worker-startup',async()=>{await page.reload();await page.getByRole('heading',{name:'Projects in this browser',exact:true}).waitFor();await page.getByRole('button',{name:value.project.name,exact:true}).waitFor();});
    await operation('cold-correction:persisted-project-open/selection',async()=>{await page.getByRole('button',{name:value.project.name,exact:true}).click();await loaded();await chooseToken();});
    evidence.scope='One bounded traced command, diagnostic instrumentation overhead; not a performance qualification sample';
    const traceSession=await context.newCDPSession(page);
    await supervised('diagnostic:start-trace/profiler',async()=>{await traceSession.send('Profiler.enable');await traceSession.send('Profiler.start');await traceSession.send('Tracing.start',{categories:'devtools.timeline,v8.execute,blink.user_timing,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});});
    try {
    evidence.coldCommand=await operation('cold-correction:first-authoring-Apply',async()=>{await page.getByLabel('Red',{exact:true}).fill('0.1');await page.getByRole('button',{name:'Apply changes',exact:true}).click();await page.getByRole('button',{name:'Apply changes',exact:true}).waitFor();await page.waitForFunction(()=>[...document.querySelectorAll('button')].some(el=>el.textContent==='Apply changes'&&el.disabled));});
    } finally {
      await supervised('diagnostic:finish-trace/profiler',async()=>{
        const profile=await traceSession.send('Profiler.stop');await writeFile(output+'/command-cpu-profile.json.gz',gzipSync(Buffer.from(JSON.stringify(profile))));
        const completed=new Promise(resolve=>traceSession.once('Tracing.tracingComplete',resolve));await traceSession.send('Tracing.end');const {stream}=await completed;const chunks=[];let done=false,bytes=0;while(!done){const read=await traceSession.send('IO.read',{handle:stream});const chunk=read.base64Encoded?Buffer.from(read.data,'base64'):Buffer.from(read.data);bytes+=chunk.length;assert(bytes<64*1024*1024,'Diagnostic trace exceeds finite64MiB budget');chunks.push(chunk);done=read.eof;}await traceSession.send('IO.close',{handle:stream});const traceBytes=Buffer.concat(chunks);await writeFile(output+'/command-trace.json.gz',gzipSync(traceBytes));evidence.diagnosticTraceBytes=traceBytes.length;
      });
    }

  }else if(kind==='maximum'){
    const value=snapshot('maximum-entities',10000,2000,false);await prepare(value);
    await operation('maximum:All content',async()=>{await page.getByRole('button',{name:'All content',exact:true}).click();await page.getByRole('heading',{name:'All content',exact:true}).waitFor();assert.equal(await page.getByRole('button',{name:/^Token · /}).count(),10000);assert.equal(await page.getByRole('button',{name:/^Group · /}).count(),2000);});
    await operation('maximum:last-token inspection',async()=>{await page.getByRole('button',{name:'Token · token9999 · "t9999"',exact:true}).click();await page.getByText('All authored data',{exact:true}).waitFor();});
    await operation('maximum:backup',backup,{actionBudget:2000});await operation('maximum:catalogue',projects,{actionBudget:2000});
  }else if(kind==='catalogue25'){
    for(let index=0;index<25;index++){
      const value=exactSnapshotBytes('catalogue-'+String(index).padStart(2,'0'));await prepare(value);await operation(`setup:catalogue:${index}`,projects);
    }
    assert.equal(await page.locator('main ul > li').count(),25,'Catalogue count');
    const samples=[];
    for(let index=-1;index<20;index++){
      await operation(`catalogue:open:${index}`,async()=>{await page.getByRole('button',{name:'catalogue-00',exact:true}).click();await loaded();});
      const result=await operation(`${index<0?'warmup':'measured'}:25x8MiB-catalogue:${index}`,projects);if(index>=0)samples.push(result.duration);
    }
    evidence.distributions={catalogue:samples,p95:p95(samples)};
  }else{
    const units=Number(kind.slice(6)),value=sourceBoundary(units);await prepare(value);
    await operation('source:All content/group inspection',async()=>{await page.getByRole('button',{name:'All content',exact:true}).click();await page.getByRole('button',{name:'Group · group0 · "g0"',exact:true}).click();await page.getByText('Group · Read only',{exact:true}).waitFor();});
    const source=page.getByLabel('Complete applied authored data');const samples=[];
    for(let index=-2;index<20;index++){
      const phase=index===-2?'cold':index===-1?'warmup':'measured';
      const result=await operation(`${phase}:source:${units}:${index}`,async()=>{await page.getByText('All authored data',{exact:true}).click();await source.waitFor();const text=await source.textContent();assert.equal(text,JSON.stringify(value.groups[0],null,2));assert.equal(text.length,units);}, {sourceUnits:units,actionBudget:units>65536?5000:Infinity});
      if(index>=0)samples.push(result.duration);
      if(index===-2){
        await operation('source:native scoped mouse selection',async()=>{
          const geometry=await source.evaluate(element=>{const text=element.firstChild;const first=document.createRange(),last=document.createRange();first.setStart(text,0);first.setEnd(text,1);last.setStart(text,text.length-1);last.setEnd(text,text.length);const a=first.getBoundingClientRect(),b=last.getBoundingClientRect();return {first:{x:a.left+0.2,y:a.top+a.height/2},last:{x:b.right-0.2,y:b.top+b.height/2}};});
          await page.mouse.click(geometry.first.x,geometry.first.y);await page.keyboard.down('Shift');await page.mouse.click(geometry.last.x,geometry.last.y);await page.keyboard.up('Shift');assert.equal(await page.evaluate(()=>getSelection().toString()),JSON.stringify(value.groups[0],null,2));
        },{sourceUnits:units,actionBudget:units>65536?5000:Infinity});
        for(const marker of ['source-boundary-😀-','source-middle-marker','source-end-marker'])await operation('source:native Find '+marker,async()=>{assert(await page.evaluate(needle=>window.find(needle),marker),'Native in-page Find did not locate exact text');},{sourceUnits:units,actionBudget:units>65536?5000:Infinity});
      }
      await operation('source:close',async()=>{await page.getByText('All authored data',{exact:true}).click();await source.waitFor({state:'hidden'});});
    }
    evidence.distributions={source:samples,p95:p95(samples)};
  }
  await verifyManifest();evidence.status='passed';checkpoint();
}catch(error){evidence.status=supervisor.expired?'watchdog-stopped':'failed';evidence.error=String(error);checkpoint();if(page&&!supervisor.expired){evidence.failureUI=await page.locator('body').ariaSnapshot().catch(()=>null);await page.screenshot({path:output+'/failure.png',fullPage:true,timeout:3000}).catch(()=>{});}}
finally{supervisor.clear();checkpoint();if(browser)await browser.close().catch(()=>{});chrome.kill('SIGTERM');}
console.log(JSON.stringify({output,status:evidence.status,operations:evidence.operations.length,error:evidence.error}));
if(evidence.status!=='passed')process.exitCode=1;
