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
const manifestPath=root+'/output/increment-007-implementation/s4-r7-before-review-manifest.json';
const expectedManifest='42f0e3c7e7cc53de36219f6b7b49be8d86c3ba11d4d1aae3b6c61a6311763df5';
const kind='catalogue25',coldOnly=false;let nativeFixturePath;
assert(['maximum','catalogue25','source65535','source65536','source65537'].includes(kind),'Only the original boundary inventory may execute after coordinator release');
const expectedTokens=kind==='maximum'?10000:1;let currentFixture;
assert(['ordinary100','ordinary1000','maximum','catalogue25','source65535','source65536','source65537'].includes(kind),'Choose one finite reviewed case');
const stamp=new Date().toISOString().replaceAll(':','-');
const output=root+'/output/playwright/increment-007-implementation/qualification-native-file-first-8mib-r7-'+kind+'-'+stamp;
await mkdir(output,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const evidence={case:kind,date:new Date().toISOString(),manifest:expectedManifest,operations:[],fixtures:[],watchdog:[],errors:[],status:'preparing',limits:{ordinaryTask:100,sourceTask:250,sourceAction:5000,operationStop:30000}};
const checkpoint=()=>writeFileSync(output+'/evidence.json.gz',gzipSync(Buffer.from(JSON.stringify(evidence))));
async function verifyManifest(){const bytes=await readFile(manifestPath);assert.equal(sha(bytes),expectedManifest);const manifest=JSON.parse(bytes);for(const item of [...manifest.sources,...manifest.build])assert.equal(sha(await readFile(item.path.startsWith('/')?item.path:root+'/'+item.path)),item.sha256,'Snapshot drift: '+item.path);}
await verifyManifest();
for(const artifact of ['r7-first-8mib-native-file-diagnostic.mjs','r5-qualification-fixtures.mjs','r5-owned-process-watchdog.mjs']){const bytes=await readFile(new URL('./'+artifact,import.meta.url));evidence[artifact+'Sha256']=sha(bytes);await writeFile(output+'/'+artifact+'.gz',gzipSync(bytes));}
const profile=await mkdtemp(path.join(tmpdir(),'dtw007-qualification-owned-'));
const chrome=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--user-data-dir='+profile,'--remote-debugging-port=0','--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
evidence.profile=profile;evidence.ownedChromePid=chrome.pid;checkpoint();
let browser,page,downloadPath;
const supervisor=new OwnedProcessWatchdog(chrome,evidence,checkpoint);
const supervised=(name,fn)=>supervisor.run(name,fn);
async function metrics(){return page.evaluate(()=>{const state=window.__dtwQualification;state.collect(state.observer.takeRecords());return {tasks:state.tasks.splice(0),calls:state.calls.splice(0),now:performance.now(),timeOrigin:performance.timeOrigin};});}
async function operation(name,fn,{sourceUnits=0,actionBudget=Infinity}={}){
  let duration,data,preceding,rendererStart,rendererEnd,rendererEndOrigin;
  await supervised(name,async()=>{
    preceding=await metrics();rendererStart=preceding.now;
    const started=performance.now();
    await fn();
    // Two native animation frames include the complete resulting first paint.
    const end=await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve({now:performance.now(),timeOrigin:performance.timeOrigin})))));rendererEnd=end.now;rendererEndOrigin=end.timeOrigin;
    duration=performance.now()-started;
    // Observer delivery is supervised but is not charged as action latency.
    await page.waitForTimeout(60);
    data=await metrics();
  });
  const budget=sourceUnits>65536?250:100;
  data.tasks=preceding.timeOrigin!==data.timeOrigin?[...preceding.tasks.map(task=>({...task,phase:'pre-navigation',timeOrigin:preceding.timeOrigin})),...data.tasks.map(task=>({...task,phase:'new-document',timeOrigin:data.timeOrigin}))]:[...preceding.tasks,...data.tasks].map(task=>({...task,timeOrigin:data.timeOrigin,phase:task.start+task.duration<=rendererStart?'pre':task.start>=rendererEnd?'trailing':'overlap'}));
  const result={name,duration,sourceUnits,taskBudget:budget,rendererStart,rendererStartOrigin:preceding.timeOrigin,rendererEnd,rendererEndOrigin,precedingCalls:preceding.calls,...data};
  evidence.operations.push(result);checkpoint();
  const visibleError=await page.evaluate(()=>[...document.querySelectorAll('#tokens [role=alert],aside.inspector [role=alert],[role=dialog] [role=alert]')].find(element=>element.getClientRects().length&&element.textContent.trim())?.textContent);
  assert(!visibleError,'Application error: '+visibleError);
  assert.equal(evidence.errors.length,0,'Production page error');
  assert(data.tasks.every(task=>task.duration<=budget),`Renderer task exceeds ${budget}ms in ${name}`);
  assert(duration<=actionBudget,`Action exceeds ${actionBudget}ms in ${name}`);
  assert(data.calls.every(call=>call.status==='ok'),'Worker rejected operation in '+name);
  return result;
}
const p95=samples=>[...samples].sort((a,b)=>a-b)[Math.ceil(samples.length*0.95)-1];
async function projects(){await page.locator('header.topbar').getByRole('button',{name:'Projects',exact:true}).click();await page.waitForFunction(()=>document.querySelector('main > h1')?.textContent==='Projects in this browser');await page.waitForFunction(()=>document.querySelector('main input[type=file]')?.disabled===false);}
async function loaded(expected=expectedTokens){
  await page.waitForFunction(expected=>{
    const panel=document.querySelector('#tokens');if(!panel)return false;
    const error=panel.querySelector('.error[role=alert]');if(error)throw Error(error.textContent);
    const heading=panel.querySelector('h1');
    const loading=[...panel.querySelectorAll(':scope > p[role=status]')].some(element=>element.textContent.startsWith('Preparing complete project list'));
    const create=panel.querySelector('.panel-header button'),table=panel.querySelector('.token-table');
    return heading?.textContent==='All colors'&&!loading&&create?.disabled===false&&table?.children.length===expected+1;
  },expected);
}
async function submitBackup(value,restore=true){assert(nativeFixturePath,'Native fixture must be written before timing');await page.locator('input[type=file]').setInputFiles(nativeFixturePath);await page.waitForFunction(()=>document.querySelector('[role=dialog]')?.textContent.includes('Review project backup'));const preview=await page.locator('[role=dialog] dl dd').allTextContents();assert.equal(preview[0],JSON.stringify(value.project.id));assert.equal(preview[2].replace(/\s+/g,' ').trim(),`${value.groups.length} groups · ${value.tokens.length} tokens`);if(restore){await page.locator('[role=dialog] button').filter({hasText:/^Restore project$/}).click();await loaded();}else{throw Error('Diagnostic never stages/cancels another file');}}

async function prepare(value){currentFixture=value;const facts=fixtureFacts(value);evidence.fixtures.push({...facts,projectId:value.project.id,sha256:sha(Buffer.from(JSON.stringify(envelope(value))))});checkpoint();await operation('setup:stage/restore '+value.project.id,()=>submitBackup(value));}
async function backup(){
  const event=page.waitForEvent('download');await page.locator('header.topbar').getByRole('button',{name:'Download backup',exact:true}).click();const file=await event;
  const target=path.join(downloadPath,path.basename(file.suggestedFilename()));let bytes,decoded;
  for(let index=0;index<100;index++){try{bytes=await readFile(target);decoded=JSON.parse(bytes);break;}catch{await new Promise(resolve=>setTimeout(resolve,20));}}
  assert(decoded,'Native downloaded backup not complete');assert.equal(decoded.format,'dtw.project-backup');assert.deepEqual(decoded.snapshot,currentFixture);
  (evidence.backupReceipts??=[]).push({projectId:decoded.snapshot.project.id,tokens:decoded.snapshot.tokens.length,createdAt:decoded.createdAt,bytes:bytes.length,sha256:sha(bytes)});return bytes;
}

try{
  await supervised('owned Chrome readiness',async()=>{for(let i=0;i<100;i++){try{const port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];browser=await chromium.connectOverCDP('http://127.0.0.1:'+port,{timeout:1000});break;}catch{await new Promise(r=>setTimeout(r,100));}}assert(browser,'Owned Chrome unavailable');});
  evidence.browser=browser.version();downloadPath=path.join(profile,'downloads');await mkdir(downloadPath);const cdp=await browser.newBrowserCDPSession();await cdp.send('Browser.setDownloadBehavior',{behavior:'allow',downloadPath,eventsEnabled:true});const context=browser.contexts()[0];context.setDefaultTimeout(7000);
  await context.addInitScript(()=>{
    const state=window.__dtwQualification={tasks:[],calls:[]};
    state.collect=entries=>{for(const entry of entries)state.tasks.push({start:entry.startTime,duration:entry.duration,name:entry.name});};state.observer=new PerformanceObserver(list=>state.collect(list.getEntries()));state.observer.observe({type:'longtask',buffered:true});
    const NativeWorker=window.Worker;
    window.Worker=class extends NativeWorker{
      constructor(...args){super(...args);this.pending=new Map();this.addEventListener('message',event=>{const message=event.data,request=this.pending.get(message?.id);if(request){state.calls.push({operation:request.operation,duration:performance.now()-request.start,status:message.status,...(request.operation==='command'?{acceptance:message.value?.status,commandId:message.value?.receipt?.commandId,revision:message.value?.revision}:{}),...(request.operation==='inspection'?{tokenId:message.value?.token?.id,selectedValue:message.value?.authoredValue}:{})});this.pending.delete(message.id);}});}
      postMessage(message,...rest){this.pending.set(message.id,{operation:message.operation,start:performance.now()});return super.postMessage(message,...rest);}
    };
  });
  page=await context.newPage();page.on('pageerror',error=>{evidence.errors.push(String(error));checkpoint();});
  await supervised('cold empty-origin startup',async()=>{await page.goto('http://127.0.0.1:4336/');await page.waitForFunction(()=>[...document.querySelectorAll('main > p')].some(element=>element.textContent==='No projects retained in this browser.'));});
  evidence.observer=await page.evaluate(()=>({supported:PerformanceObserver.supportedEntryTypes.includes('longtask'),instrumented:!!window.__dtwQualification}));assert(evidence.observer.supported&&evidence.observer.instrumented,'Long-task observer unavailable');evidence.coldStartup=await metrics();assert(evidence.coldStartup.calls.length>0,'Production Worker observation unavailable');assert(evidence.coldStartup.tasks.every(t=>t.duration<=100),'Cold ordinary startup task exceeds 100ms');
  await supervised('positive-control:native temporary button click',async()=>{
    await metrics();
    await page.evaluate(()=>{const button=document.createElement('button');button.id='dtw-qualification-positive-control';button.textContent='Qualification observer control';button.style.cssText='position:fixed;left:0;top:0;z-index:999999;background:white;color:black';button.addEventListener('click',()=>{const started=performance.now();while(performance.now()-started<75){};window.__dtwControlDuration=performance.now()-started;});document.body.append(button);});
    await page.locator('#dtw-qualification-positive-control').click();await page.waitForTimeout(100);
    const observed=await metrics();evidence.positiveControl={...observed,invokedDuration:await page.evaluate(()=>window.__dtwControlDuration),scope:'Native temporary control, excluded from qualification samples'};
    await page.locator('#dtw-qualification-positive-control').evaluate(element=>element.remove());
    assert(observed.tasks.some(task=>task.duration>=70),'Native75ms positive control not observed');await metrics();checkpoint();
  });
  evidence.scope='ONEfirst8MiB setup using real local file path, notbuffer/Fileinjection; trace/profiler diagnostic, no25record/sample qualification';
  const preparationStarted=performance.now();let value;
  await supervised('fixture:prepare exact native file outside action timing',async()=>{
    value=exactSnapshotBytes('catalogue-00');const bytes=Buffer.from(JSON.stringify(envelope(value)));assert.equal(sha(bytes),'1623ccec41a9eaffaa562be1fcb84471518d94739f6b8d5c1836e7f7800cfc28');nativeFixturePath=path.join(profile,'catalogue-00.json');await writeFile(nativeFixturePath,bytes);evidence.nativeFixture={path:nativeFixturePath,sha256:sha(bytes),fileBytes:bytes.length,preparationMs:performance.now()-preparationStarted};checkpoint();
  });
  const traceSession=await context.newCDPSession(page);
  await supervised('diagnostic:start-trace/profiler',async()=>{await traceSession.send('Profiler.enable');await traceSession.send('Profiler.start');await traceSession.send('Tracing.start',{categories:'devtools.timeline,v8.execute,blink.user_timing,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});});
  try{await prepare(value);}
  finally{
    await supervised('diagnostic:finish-trace/profiler',async()=>{
      const cpu=await traceSession.send('Profiler.stop');await writeFile(output+'/native-file-cpu-profile.json.gz',gzipSync(Buffer.from(JSON.stringify(cpu))));const completed=new Promise(resolve=>traceSession.once('Tracing.tracingComplete',resolve));await traceSession.send('Tracing.end');const {stream}=await completed;const chunks=[];let done=false,total=0;
      while(!done){const frame=await traceSession.send('IO.read',{handle:stream});const bytes=frame.base64Encoded?Buffer.from(frame.data,'base64'):Buffer.from(frame.data);total+=bytes.length;assert(total<64*1024*1024,'Diagnostic trace exceeds64MiB');chunks.push(bytes);done=frame.eof;}
      await traceSession.send('IO.close',{handle:stream});await writeFile(output+'/native-file-trace.json.gz',gzipSync(Buffer.concat(chunks)));evidence.traceBytes=total;
    });
  }
  await supervised('correctness:one complete retained record summary',async()=>{
    evidence.retained=await page.evaluate(()=>new Promise((resolve,reject)=>{const request=indexedDB.open('dtw-projects-v1',1);request.onsuccess=()=>{const db=request.result,tx=db.transaction('projects');let count,summary;tx.objectStore('projects').count().onsuccess=event=>count=event.target.result;tx.objectStore('projects').get('catalogue-00').onsuccess=event=>{const record=event.target.result;summary={revision:record.revision,id:record.snapshot.project.id,groups:record.snapshot.groups.map(group=>({id:group.id,descriptionUnits:group.description.length})),tokens:record.snapshot.tokens.map(token=>({id:token.id,red:token.definition.assignments[0].value.components[0]}))};};tx.oncomplete=()=>{db.close();resolve({count,...summary});};tx.onabort=()=>reject(tx.error);};request.onerror=()=>reject(request.error);}));
    assert.equal(evidence.retained.count,1);assert.equal(evidence.retained.id,'catalogue-00');assert.deepEqual(evidence.retained.groups,value.groups.map(group=>({id:group.id,descriptionUnits:group.description.length})));assert.deepEqual(evidence.retained.tokens,[{id:'t0',red:'0.2'}]);assert(evidence.retained.revision);assert.equal(await page.locator('.group-tree > button').count(),64);assert.equal(await page.locator('.token-row').count(),1);
  });
  await verifyManifest();evidence.status='passed';checkpoint();
}catch(error){evidence.status=supervisor.expired?'watchdog-stopped':'failed';evidence.error=String(error);checkpoint();if(page&&!supervisor.expired){await supervised('failure:evidence-capture',async()=>{evidence.failureUI=await page.locator('body').ariaSnapshot().catch(()=>null);await page.screenshot({path:output+'/failure.png',fullPage:true,timeout:3000}).catch(()=>{});}).catch(error=>{evidence.captureError=String(error);});}}
finally{supervisor.clear();checkpoint();if(browser)await browser.close().catch(()=>{});chrome.kill('SIGTERM');}
console.log(JSON.stringify({output,status:evidence.status,operations:evidence.operations.length,error:evidence.error}));
if(evidence.status!=='passed')process.exitCode=1;
