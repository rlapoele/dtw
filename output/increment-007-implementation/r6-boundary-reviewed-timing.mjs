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
const manifestPath=root+'/output/increment-007-implementation/s4-r6-before-review-manifest.json';
const expectedManifest='1980ae8614277ffd0f87661b206acbde8aaea9a7807c2605849b7811fa6c09b4';
const kind=process.argv[2],coldOnly=process.argv.includes('--cold-only');
assert(['maximum','catalogue25','source65535','source65536','source65537'].includes(kind),'Only the original boundary inventory may execute after coordinator release');
const expectedTokens=kind==='maximum'?10000:1;let currentFixture;
assert(['ordinary100','ordinary1000','maximum','catalogue25','source65535','source65536','source65537'].includes(kind),'Choose one finite reviewed case');
const stamp=new Date().toISOString().replaceAll(':','-');
const output=root+'/output/playwright/increment-007-implementation/qualification-boundary-reviewed-r6-'+kind+'-'+stamp;
await mkdir(output,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const evidence={case:kind,date:new Date().toISOString(),manifest:expectedManifest,operations:[],fixtures:[],watchdog:[],errors:[],status:'preparing',limits:{ordinaryTask:100,sourceTask:250,sourceAction:5000,operationStop:30000}};
const checkpoint=()=>writeFileSync(output+'/evidence.json.gz',gzipSync(Buffer.from(JSON.stringify(evidence))));
async function verifyManifest(){const bytes=await readFile(manifestPath);assert.equal(sha(bytes),expectedManifest);const manifest=JSON.parse(bytes);for(const item of [...manifest.sources,...manifest.build])assert.equal(sha(await readFile(item.path.startsWith('/')?item.path:root+'/'+item.path)),item.sha256,'Snapshot drift: '+item.path);}
await verifyManifest();
for(const artifact of ['r6-boundary-reviewed-timing.mjs','r5-qualification-fixtures.mjs','r5-owned-process-watchdog.mjs']){const bytes=await readFile(new URL('./'+artifact,import.meta.url));evidence[artifact+'Sha256']=sha(bytes);await writeFile(output+'/'+artifact+'.gz',gzipSync(bytes));}
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
async function submitBackup(value,restore=true){const file={name:'qualification.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(envelope(value)))};await page.locator('input[type=file]').setInputFiles(file);await page.waitForFunction(()=>document.querySelector('[role=dialog]')?.textContent.includes('Review project backup'));const preview=await page.locator('[role=dialog] dl dd').allTextContents();assert.equal(preview[0],JSON.stringify(value.project.id));assert.equal(preview[2].replace(/\s+/g,' ').trim(),`${value.groups.length} groups · ${value.tokens.length} tokens`);if(restore){await page.locator('[role=dialog] button').filter({hasText:/^Restore project$/}).click();await loaded();}else{await page.locator('[role=dialog] button').filter({hasText:/^Cancel$/}).click();await page.locator('[role=dialog]').waitFor({state:'hidden'});await page.waitForFunction(()=>document.querySelector('header.topbar input[type=file]')?.disabled===false);}}
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
  await supervised('cold empty-origin startup',async()=>{await page.goto('http://127.0.0.1:4335/');await page.waitForFunction(()=>[...document.querySelectorAll('main > p')].some(element=>element.textContent==='No projects retained in this browser.'));});
  evidence.observer=await page.evaluate(()=>({supported:PerformanceObserver.supportedEntryTypes.includes('longtask'),instrumented:!!window.__dtwQualification}));assert(evidence.observer.supported&&evidence.observer.instrumented,'Long-task observer unavailable');evidence.coldStartup=await metrics();assert(evidence.coldStartup.calls.length>0,'Production Worker observation unavailable');assert(evidence.coldStartup.tasks.every(t=>t.duration<=100),'Cold ordinary startup task exceeds 100ms');
  await supervised('positive-control:native temporary button click',async()=>{
    await metrics();
    await page.evaluate(()=>{const button=document.createElement('button');button.id='dtw-qualification-positive-control';button.textContent='Qualification observer control';button.style.cssText='position:fixed;left:0;top:0;z-index:999999;background:white;color:black';button.addEventListener('click',()=>{const started=performance.now();while(performance.now()-started<75){};window.__dtwControlDuration=performance.now()-started;});document.body.append(button);});
    await page.locator('#dtw-qualification-positive-control').click();await page.waitForTimeout(100);
    const observed=await metrics();evidence.positiveControl={...observed,invokedDuration:await page.evaluate(()=>window.__dtwControlDuration),scope:'Native temporary control, excluded from qualification samples'};
    await page.locator('#dtw-qualification-positive-control').evaluate(element=>element.remove());
    assert(observed.tasks.some(task=>task.duration>=70),'Native75ms positive control not observed');await metrics();checkpoint();
  });
  if(kind==='maximum'){
    const value=snapshot('maximum-entities',10000,2000,false);await prepare(value);
    const allContent=await page.locator('.sidebar-content > button:nth-of-type(2)').elementHandle();assert(allContent);assert.equal(await allContent.textContent(),'All content');
    await operation('maximum:All content',async()=>{await allContent.click();await page.waitForFunction(()=>document.querySelector('#tokens h1')?.textContent==='All content'&&document.querySelector('#tokens > div:not([class])')?.children.length===12001);});
    // One after-action correctness check; no repeated text/name traversal.
    const members=page.locator('#tokens > div:not([class]) > button');assert.equal(await members.count(),12000);
    for(const [index,label]of [[0,'Group · group0 · "g0"'],[1999,'Group · group1999 · "g1999"'],[2000,'Token · token0 · "t0"'],[11999,'Token · token9999 · "t9999"']])assert.equal(await members.nth(index).textContent(),label);
    const last=await members.nth(11999).elementHandle();assert(last);
    const inspection=await operation('maximum:last-token inspection',async()=>{await last.click();await page.waitForFunction(()=>document.querySelector('aside.inspector .inspector-heading h2')?.textContent==='token9999'&&document.querySelector('aside.inspector .inspector-heading .eyebrow')?.textContent==='Unassigned token'&&document.querySelector('aside.inspector summary')?.textContent==='All authored data');});
    assert.equal(inspection.calls.filter(call=>call.operation==='inspection').at(-1)?.tokenId,'t9999');
    await operation('maximum:complete backup equality',backup);await operation('maximum:catalogue',projects);
    const reopen=await page.locator('main ul button').filter({hasText:/^maximum-entities$/}).elementHandle();assert(reopen);await operation('maximum:reopen',async()=>{await reopen.click();await loaded();});
  }else if(kind==='catalogue25'){
    for(let index=0;index<25;index++){const value=exactSnapshotBytes('catalogue-'+String(index).padStart(2,'0'));await prepare(value);await operation(index===24?'cold:25x8MiB-catalogue':`setup:catalogue:${index}`,projects);}
    assert.equal(await page.locator('main ul > li').count(),25);const samples=[];
    for(let index=-1;index<20;index++){
      const project=await page.locator('main ul button').filter({hasText:/^catalogue-00$/}).elementHandle();assert(project);
      await operation(`catalogue:open:${index}`,async()=>{await project.click();await loaded();});
      const result=await operation(`${index<0?'warmup':'measured'}:25x8MiB-catalogue:${index}`,projects);if(index>=0)samples.push(result.duration);
    }
    evidence.distributions={catalogue:samples,p95:p95(samples),scope:'Defensive200MiB catalogue: no2second SLA;30s operation stop and100ms ordinary tasks remain'};
  }else{
    const units=Number(kind.slice(6)),value=sourceBoundary(units),expectedSource=JSON.stringify(value.groups[0],null,2);await prepare(value);
    const allContent=await page.locator('.sidebar-content > button:nth-of-type(2)').elementHandle();assert(allContent);assert.equal(await allContent.textContent(),'All content');
    await operation('source:All content',async()=>{await allContent.click();await page.waitForFunction(()=>document.querySelector('#tokens h1')?.textContent==='All content'&&document.querySelector('#tokens > div:not([class])')?.children.length===3);});
    const group=await page.locator('#tokens > div:not([class]) > button').first().elementHandle();assert(group);assert.equal(await group.textContent(),'Group · group0 · "g0"');
    await operation('source:group inspection',async()=>{await group.click();await page.waitForFunction(()=>{const panel=document.querySelector('#token-inspector-content');const paragraphs=panel?.querySelectorAll(':scope > div > p');return panel?.querySelector('h2')?.textContent==='group0'&&paragraphs?.[0]?.textContent==='Group · Read only'&&paragraphs?.[2]?.textContent==='Group identity: "g0"';});});
    const source=page.locator('#token-inspector-content [aria-label="Complete applied authored data"]'),disclosure=await page.locator('#token-inspector-content summary').elementHandle();assert(disclosure);assert.equal(await disclosure.textContent(),'All authored data');const samples=[];
    for(let index=-2;index<20;index++){
      const phase=index===-2?'cold':index===-1?'warmup':'measured';
      const result=await operation(`${phase}:source-open:${units}:${index}`,async()=>{await disclosure.click();await page.waitForFunction(expected=>{const source=document.querySelector('#token-inspector-content [aria-label="Complete applied authored data"]');return source?.childNodes.length===1&&source.firstChild?.nodeType===Node.TEXT_NODE&&source.firstChild.length===expected;},units);},{sourceUnits:units,actionBudget:units>65536?5000:Infinity});if(index>=0)samples.push(result.duration);
      await operation('correctness:complete source string equality',async()=>assert.equal(await source.textContent(),expectedSource),{sourceUnits:units});
      if(index===-2){
        await operation('source:scroll into view (ordinary gate)',async()=>source.scrollIntoViewIfNeeded());
        const geometry=await source.evaluate(element=>{const text=element.firstChild,first=document.createRange(),last=document.createRange();first.setStart(text,0);first.setEnd(text,1);last.setStart(text,text.length-1);last.setEnd(text,text.length);const a=first.getBoundingClientRect(),b=last.getBoundingClientRect();const p=element.getBoundingClientRect();return {first:{x:a.left+0.2,y:a.top+a.height/2},last:{x:b.right-0.2,y:b.top+b.height/2},bounds:{left:Math.max(p.left,0),right:Math.min(p.right,innerWidth),top:Math.max(p.top,0),bottom:Math.min(p.bottom,innerHeight)}};});
        for(const point of [geometry.first,geometry.last])assert(point.x>geometry.bounds.left&&point.x<geometry.bounds.right&&point.y>geometry.bounds.top&&point.y<geometry.bounds.bottom,'Native selection endpoint outside visible source/viewport');
        await operation('source:native scoped Shift-mouse selection',async()=>{await page.mouse.click(geometry.first.x,geometry.first.y);await page.keyboard.down('Shift');await page.mouse.click(geometry.last.x,geometry.last.y);await page.keyboard.up('Shift');assert(await page.evaluate(()=>{const source=document.querySelector('#token-inspector-content [aria-label="Complete applied authored data"]'),selection=getSelection(),node=source.firstChild;return selection.anchorNode===node&&selection.focusNode===node&&Math.min(selection.anchorOffset,selection.focusOffset)===0&&Math.max(selection.anchorOffset,selection.focusOffset)===node.length;}));},{sourceUnits:units,actionBudget:units>65536?5000:Infinity});
        await operation('correctness:complete native selected-string equality',async()=>assert.equal(await page.evaluate(()=>getSelection().toString()),expectedSource),{sourceUnits:units});
        for(const marker of ['source-boundary-😀-','source-middle-marker','source-end-marker']){
          await operation('source:native in-page Find API (wrap enabled):'+marker,async()=>{
            const match=await page.evaluate(needle=>{const found=window.find(needle,false,false,true,false,false,false),source=document.querySelector('#token-inspector-content [aria-label="Complete applied authored data"]'),selection=getSelection(),node=source.firstChild;return {found,exact:selection.toString()===needle,inside:selection.anchorNode===node&&selection.focusNode===node};},marker);assert(match.found&&match.exact&&match.inside);
            await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));
            assert(await page.evaluate(()=>{const source=document.querySelector('#token-inspector-content [aria-label="Complete applied authored data"]'),selection=getSelection(),r=selection.getRangeAt(0).getBoundingClientRect(),p=source.getBoundingClientRect();return Math.max(r.left,p.left,0)<Math.min(r.right,p.right,innerWidth)&&Math.max(r.top,p.top,0)<Math.min(r.bottom,p.bottom,innerHeight);}),'Native in-page Find match was not revealed');
          },{sourceUnits:units,actionBudget:units>65536?5000:Infinity});
        }
      }
      await operation('source:close (ordinary gate)',async()=>{await disclosure.click();await source.waitFor({state:'hidden'});});
    }
    evidence.distributions={source:samples,p95:p95(samples),scope:'Opening only; full equality/selection correctness separately labelled. In-pageFind API does not qualify realBrowserFindUI/clipboard/AT.'};
  }
  await verifyManifest();evidence.status='passed';checkpoint();
}catch(error){evidence.status=supervisor.expired?'watchdog-stopped':'failed';evidence.error=String(error);checkpoint();if(page&&!supervisor.expired){await supervised('failure:evidence-capture',async()=>{evidence.failureUI=await page.locator('body').ariaSnapshot().catch(()=>null);await page.screenshot({path:output+'/failure.png',fullPage:true,timeout:3000}).catch(()=>{});}).catch(error=>{evidence.captureError=String(error);});}}
finally{supervisor.clear();checkpoint();if(browser)await browser.close().catch(()=>{});chrome.kill('SIGTERM');}
console.log(JSON.stringify({output,status:evidence.status,operations:evidence.operations.length,error:evidence.error}));
if(evidence.status!=='passed')process.exitCode=1;
