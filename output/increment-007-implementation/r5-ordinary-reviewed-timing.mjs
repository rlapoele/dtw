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
const kind=process.argv[2],coldOnly=process.argv.includes('--cold-only');
assert(['ordinary100','ordinary1000'].includes(kind),'Only independently audited ordinary cases may execute');
const expectedTokens=Number(kind.slice(8));let expectedRed='0.2';const seenCommandIds=new Set();
assert(['ordinary100','ordinary1000','maximum','catalogue25','source65535','source65536','source65537'].includes(kind),'Choose one finite reviewed case');
const stamp=new Date().toISOString().replaceAll(':','-');
const output=root+'/output/playwright/increment-007-implementation/qualification-ordinary-reviewed-'+kind+'-'+stamp;
await mkdir(output,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const evidence={case:kind,date:new Date().toISOString(),manifest:expectedManifest,operations:[],fixtures:[],watchdog:[],errors:[],status:'preparing',limits:{ordinaryTask:100,sourceTask:250,sourceAction:5000,operationStop:30000}};
const checkpoint=()=>writeFileSync(output+'/evidence.json.gz',gzipSync(Buffer.from(JSON.stringify(evidence))));
async function verifyManifest(){const bytes=await readFile(manifestPath);assert.equal(sha(bytes),expectedManifest);const manifest=JSON.parse(bytes);for(const item of [...manifest.sources,...manifest.build])assert.equal(sha(await readFile(item.path.startsWith('/')?item.path:root+'/'+item.path)),item.sha256,'Snapshot drift: '+item.path);}
await verifyManifest();
for(const artifact of ['r5-ordinary-reviewed-timing.mjs','r5-qualification-fixtures.mjs','r5-owned-process-watchdog.mjs']){const bytes=await readFile(new URL('./'+artifact,import.meta.url));evidence[artifact+'Sha256']=sha(bytes);await writeFile(output+'/'+artifact+'.gz',gzipSync(bytes));}
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
async function chooseToken(){
  const row=page.locator('.token-row').first();assert.equal(await row.locator('.token-name').textContent(),'token0');await row.click();
  const field=page.locator('aside.inspector .component-control:first-child .component-value input');await field.waitFor();
  assert.equal(await page.locator('aside.inspector .component-control:first-child .component-value > span').textContent(),'Red');
  assert.equal(await field.inputValue(),expectedRed);
}
async function submitBackup(value,restore=true){const file={name:'qualification.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(envelope(value)))};await page.locator('input[type=file]').setInputFiles(file);await page.waitForFunction(()=>document.querySelector('[role=dialog]')?.textContent.includes('Review project backup'));const preview=await page.locator('[role=dialog] dl dd').allTextContents();assert.equal(preview[0],JSON.stringify(value.project.id));assert.equal(preview[2].replace(/\s+/g,' ').trim(),`${value.groups.length} groups · ${value.tokens.length} tokens`);if(restore){await page.locator('[role=dialog] button').filter({hasText:/^Restore project$/}).click();await loaded();}else{await page.locator('[role=dialog] button').filter({hasText:/^Cancel$/}).click();await page.locator('[role=dialog]').waitFor({state:'hidden'});await page.waitForFunction(()=>document.querySelector('header.topbar input[type=file]')?.disabled===false);}}
async function prepare(value){const facts=fixtureFacts(value);evidence.fixtures.push({...facts,projectId:value.project.id,sha256:sha(Buffer.from(JSON.stringify(envelope(value))))});checkpoint();await operation('setup:stage/restore '+value.project.id,()=>submitBackup(value));}
async function backup(){
  const event=page.waitForEvent('download');await page.locator('header.topbar').getByRole('button',{name:'Download backup',exact:true}).click();const file=await event;
  const target=path.join(downloadPath,path.basename(file.suggestedFilename()));let bytes,decoded;
  for(let index=0;index<100;index++){try{bytes=await readFile(target);decoded=JSON.parse(bytes);break;}catch{await new Promise(resolve=>setTimeout(resolve,20));}}
  assert(decoded,'Native downloaded backup not complete');assert.equal(decoded.format,'dtw.project-backup');assert.equal(decoded.snapshot.project.id,'ordinary-'+expectedTokens);assert.equal(decoded.snapshot.tokens.length,expectedTokens);assert.equal(decoded.snapshot.groups.length,0);assert.equal(decoded.snapshot.tokens[0].definition.assignments[0].value.components[0],expectedRed);
  (evidence.backupReceipts??=[]).push({projectId:decoded.snapshot.project.id,tokens:decoded.snapshot.tokens.length,createdAt:decoded.createdAt,bytes:bytes.length,sha256:sha(bytes)});return bytes;
}
function verifyCommand(result,desired){
  const commands=result.calls.filter(call=>call.operation==='command');assert.equal(commands.length,1);const command=commands[0];assert.equal(command.acceptance,'retained');assert(typeof command.commandId==='string'&&command.commandId.length);assert(typeof command.revision==='string'&&command.revision.length);assert(!seenCommandIds.has(command.commandId),'Repeated terminal receipt');seenCommandIds.add(command.commandId);
  const inspection=result.calls.filter(call=>call.operation==='inspection').at(-1);assert(inspection,'Fresh inspection required');assert.equal(inspection.tokenId,'t0');assert.equal(inspection.selectedValue?.components?.[0],desired);
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
  await supervised('cold empty-origin startup',async()=>{await page.goto('http://127.0.0.1:4334/');await page.waitForFunction(()=>[...document.querySelectorAll('main > p')].some(element=>element.textContent==='No projects retained in this browser.'));});
  evidence.observer=await page.evaluate(()=>({supported:PerformanceObserver.supportedEntryTypes.includes('longtask'),instrumented:!!window.__dtwQualification}));assert(evidence.observer.supported&&evidence.observer.instrumented,'Long-task observer unavailable');evidence.coldStartup=await metrics();assert(evidence.coldStartup.calls.length>0,'Production Worker observation unavailable');assert(evidence.coldStartup.tasks.every(t=>t.duration<=100),'Cold ordinary startup task exceeds 100ms');
  await supervised('positive-control:native temporary button click',async()=>{
    await metrics();
    await page.evaluate(()=>{const button=document.createElement('button');button.id='dtw-qualification-positive-control';button.textContent='Qualification observer control';button.style.cssText='position:fixed;left:0;top:0;z-index:999999;background:white;color:black';button.addEventListener('click',()=>{const started=performance.now();while(performance.now()-started<75){};window.__dtwControlDuration=performance.now()-started;});document.body.append(button);});
    await page.locator('#dtw-qualification-positive-control').click();await page.waitForTimeout(100);
    const observed=await metrics();evidence.positiveControl={...observed,invokedDuration:await page.evaluate(()=>window.__dtwControlDuration),scope:'Native temporary control, excluded from qualification samples'};
    await page.locator('#dtw-qualification-positive-control').evaluate(element=>element.remove());
    assert(observed.tasks.some(task=>task.duration>=70),'Native75ms positive control not observed');await metrics();checkpoint();
  });
  if(kind.startsWith('ordinary')){
    const count=Number(kind.slice(8)),value=snapshot('ordinary-'+count,count);await prepare(value);await operation('cold:selected inspection',chooseToken);
    const commands=[],encodes=[],decodes=[],catalogues=[];
    if(!coldOnly)for(let index=-1;index<20;index++){
      const phase=index<0?'warmup':'measured';
      const desired=index%2===0?'0.3':'0.4';
      const red=await page.locator('aside.inspector .component-control:first-child .component-value input').elementHandle(),apply=await page.locator('aside.inspector').getByRole('button',{name:'Apply changes',exact:true}).elementHandle();assert(red&&apply);
      const action=await operation(`${phase}:command:${index}`,async()=>{
        await red.fill(desired);
        await page.waitForFunction(()=>[...document.querySelector('aside.inspector').querySelectorAll('button')].some(button=>button.textContent==='Apply changes'&&!button.disabled));
        await apply.click();
        await page.waitForFunction(expected=>{const aside=document.querySelector('aside.inspector');const error=aside.querySelector('#editor-error');if(error?.textContent)throw Error(error.textContent);return [...aside.querySelectorAll('button')].some(button=>button.textContent==='Apply changes'&&button.disabled)&&aside.querySelector('.component-control:first-child .component-value input')?.value===expected&&aside.querySelector('.editor-actions + p[role=status]')?.textContent.includes('Changes applied and retained.');},desired);
      });
      verifyCommand(action,desired);expectedRed=desired;
      const encoded=await operation(`${phase}:backup:${index}`,backup,{actionBudget:2000});
      const decoded=await operation(`${phase}:stage-cancel:${index}`,()=>submitBackup(value,false),{actionBudget:2000});
      const catalogue=await operation(`${phase}:catalogue:${index}`,projects,{actionBudget:2000});
      await operation(`${phase}:reopen:${index}`,async()=>{await page.locator('main ul button').filter({hasText:new RegExp('^'+value.project.name+'$')}).click();await loaded();await chooseToken();});
      if(index>=0){commands.push(action.duration);encodes.push(encoded.duration);decodes.push(decoded.duration);catalogues.push(catalogue.duration);}
    }
    evidence.distributions={commands,encodes,decodes,catalogues,p95:{command:p95(commands),encode:p95(encodes),decode:p95(decodes),catalogue:p95(catalogues)}};
    if(!coldOnly)assert(p95(commands)<=(count===100?250:1000),'Command p95 exceeds agreed budget');
    evidence.coldOnly=coldOnly;
    await operation('cold-correction:fresh-app-worker-startup',async()=>{await page.reload();await page.waitForFunction(()=>document.querySelector('main > h1')?.textContent==='Projects in this browser');await page.locator('main ul button').filter({hasText:new RegExp('^'+value.project.name+'$')}).waitFor();});
    await operation('cold-correction:persisted-project-open/selection',async()=>{await page.locator('main ul button').filter({hasText:new RegExp('^'+value.project.name+'$')}).click();await loaded();await chooseToken();});
    const coldRed=await page.locator('aside.inspector .component-control:first-child .component-value input').elementHandle(),coldApply=await page.locator('aside.inspector').getByRole('button',{name:'Apply changes',exact:true}).elementHandle();assert(coldRed&&coldApply);
    evidence.coldCommand=await operation('cold-correction:first-authoring-Apply',async()=>{
      await coldRed.fill('0.1');
      await page.waitForFunction(()=>[...document.querySelector('aside.inspector').querySelectorAll('button')].some(button=>button.textContent==='Apply changes'&&!button.disabled));
      await coldApply.click();
      await page.waitForFunction(()=>{const aside=document.querySelector('aside.inspector');const error=aside.querySelector('#editor-error');if(error?.textContent)throw Error(error.textContent);return [...aside.querySelectorAll('button')].some(button=>button.textContent==='Apply changes'&&button.disabled)&&aside.querySelector('.component-control:first-child .component-value input')?.value==='0.1'&&aside.querySelector('.editor-actions + p[role=status]')?.textContent.includes('Changes applied and retained.');});
    });
    verifyCommand(evidence.coldCommand,'0.1');expectedRed='0.1';

  }
  await verifyManifest();evidence.status='passed';checkpoint();
}catch(error){evidence.status=supervisor.expired?'watchdog-stopped':'failed';evidence.error=String(error);checkpoint();if(page&&!supervisor.expired){await supervised('failure:evidence-capture',async()=>{evidence.failureUI=await page.locator('body').ariaSnapshot().catch(()=>null);await page.screenshot({path:output+'/failure.png',fullPage:true,timeout:3000}).catch(()=>{});}).catch(error=>{evidence.captureError=String(error);});}}
finally{supervisor.clear();checkpoint();if(browser)await browser.close().catch(()=>{});chrome.kill('SIGTERM');}
console.log(JSON.stringify({output,status:evidence.status,operations:evidence.operations.length,error:evidence.error}));
if(evidence.status!=='passed')process.exitCode=1;
