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
const kind='source65535',coldOnly=false;let nativeFixturePath,nativeFileSession;
assert(['maximum','catalogue25','source65535','source65536','source65537'].includes(kind),'Only the original boundary inventory may execute after coordinator release');
const expectedTokens=kind==='maximum'?10000:1;let currentFixture;
assert(['ordinary100','ordinary1000','maximum','catalogue25','source65535','source65536','source65537'].includes(kind),'Choose one finite reviewed case');
const stamp=new Date().toISOString().replaceAll(':','-');
const output=root+'/output/playwright/increment-007-implementation/qualification-source-find-geometry-r7-'+kind+'-'+stamp;
await mkdir(output,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex');
const evidence={case:kind,date:new Date().toISOString(),manifest:expectedManifest,operations:[],fixtures:[],watchdog:[],errors:[],status:'preparing',limits:{ordinaryTask:100,sourceTask:250,sourceAction:5000,operationStop:30000}};
const checkpoint=()=>writeFileSync(output+'/evidence.json.gz',gzipSync(Buffer.from(JSON.stringify(evidence))));
async function verifyManifest(){const bytes=await readFile(manifestPath);assert.equal(sha(bytes),expectedManifest);const manifest=JSON.parse(bytes);for(const item of [...manifest.sources,...manifest.build])assert.equal(sha(await readFile(item.path.startsWith('/')?item.path:root+'/'+item.path)),item.sha256,'Snapshot drift: '+item.path);}
await verifyManifest();
for(const artifact of ['r7-source-find-geometry-diagnostic.mjs','r5-qualification-fixtures.mjs','r5-owned-process-watchdog.mjs']){const bytes=await readFile(new URL('./'+artifact,import.meta.url));evidence[artifact+'Sha256']=sha(bytes);await writeFile(output+'/'+artifact+'.gz',gzipSync(bytes));}
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
async function submitBackup(value,restore=true){assert(nativeFixturePath,'Native fixture must be written before timing');assert(await page.locator('input[type=file]').isEnabled(),'Native file input is not ready');const {root:documentRoot}=await nativeFileSession.send('DOM.getDocument',{depth:0});const {nodeId}=await nativeFileSession.send('DOM.querySelector',{nodeId:documentRoot.nodeId,selector:'input[type=file]'});assert(nodeId,'Native input node not found');await nativeFileSession.send('DOM.setFileInputFiles',{files:[nativeFixturePath],nodeId});await page.waitForFunction(()=>document.querySelector('[role=dialog]')?.textContent.includes('Review project backup'));const preview=await page.locator('[role=dialog] dl dd').allTextContents();assert.equal(preview[0],JSON.stringify(value.project.id));assert.equal(preview[2].replace(/\s+/g,' ').trim(),`${value.groups.length} groups · ${value.tokens.length} tokens`);if(restore){await page.locator('[role=dialog] button').filter({hasText:/^Restore project$/}).click();await loaded();}else{throw Error('Boundary inventory restores one fixture per native file');}}

async function prepare(value){
  currentFixture=value;const started=performance.now(),facts=fixtureFacts(value);const bytes=Buffer.from(JSON.stringify(envelope(value)));const fixture={...facts,projectId:value.project.id,sha256:sha(bytes)};evidence.fixtures.push(fixture);
  await supervised('fixture:prepare local native file outside action',async()=>{nativeFixturePath=path.join(profile,'fixture-'+evidence.fixtures.length+'.json');await writeFile(nativeFixturePath,bytes);fixture.nativeFile={path:nativeFixturePath,fileBytes:bytes.length,preparationMs:performance.now()-started};checkpoint();});
  await operation('setup:stage/restore '+value.project.id,()=>submitBackup(value));
}

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
  page=await context.newPage();nativeFileSession=await context.newCDPSession(page);page.on('pageerror',error=>{evidence.errors.push(String(error));checkpoint();});
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
  {
    const units=Number(kind.slice(6)),value=sourceBoundary(units),expectedSource=JSON.stringify(value.groups[0],null,2);await prepare(value);
    const allContent=await page.locator('.sidebar-content > button:nth-of-type(2)').elementHandle();assert(allContent);assert.equal(await allContent.textContent(),'All content');
    await operation('source:All content',async()=>{await allContent.click();await page.waitForFunction(()=>document.querySelector('#tokens h1')?.textContent==='All content'&&document.querySelector('#tokens > div:not([class])')?.children.length===3);});
    const group=await page.locator('#tokens > div:not([class]) > button').first().elementHandle();assert(group);assert.equal(await group.textContent(),'Group · group0 · "g0"');
    await operation('source:group inspection',async()=>{await group.click();await page.waitForFunction(()=>{const panel=document.querySelector('#token-inspector-content');const paragraphs=panel?.querySelectorAll(':scope > div > p');return panel?.querySelector('h2')?.textContent==='group0'&&paragraphs?.[0]?.textContent==='Group · Read only'&&paragraphs?.[2]?.textContent==='Group identity: "g0"';});});
    const source=page.locator('#token-inspector-content [aria-label="Complete applied authored data"]'),disclosure=await page.locator('#token-inspector-content summary').elementHandle();assert(disclosure);assert.equal(await disclosure.textContent(),'All authored data');const samples=[];
    for(const index of [-2]){
      const phase=index===-2?'cold':index===-1?'warmup':'measured';
      const result=await operation(`${phase}:source-open:${units}:${index}`,async()=>{await disclosure.click();await page.waitForFunction(expected=>{const source=document.querySelector('#token-inspector-content [aria-label="Complete applied authored data"]');return source?.childNodes.length===1&&source.firstChild?.nodeType===Node.TEXT_NODE&&source.firstChild.length===expected;},units);},{sourceUnits:units,actionBudget:units>65536?5000:Infinity});if(index>=0)samples.push(result.duration);
      await operation('correctness:complete source string equality',async()=>assert.equal(await source.textContent(),expectedSource),{sourceUnits:units});
      if(index===-2){
        await operation('source:scroll into view (ordinary gate)',async()=>source.scrollIntoViewIfNeeded());
        const geometry=await source.evaluate(element=>{const text=element.firstChild,first=document.createRange(),last=document.createRange();first.setStart(text,0);first.setEnd(text,1);last.setStart(text,text.length-1);last.setEnd(text,text.length);const a=first.getBoundingClientRect(),b=last.getBoundingClientRect();const p=element.getBoundingClientRect();return {first:{x:a.left+0.2,y:a.top+a.height/2},last:{x:b.right-0.2,y:b.top+b.height/2},bounds:{left:Math.max(p.left,0),right:Math.min(p.right,innerWidth),top:Math.max(p.top,0),bottom:Math.min(p.bottom,innerHeight)}};});
        for(const point of [geometry.first,geometry.last])assert(point.x>geometry.bounds.left&&point.x<geometry.bounds.right&&point.y>geometry.bounds.top&&point.y<geometry.bounds.bottom,'Native selection endpoint outside visible source/viewport');
        await operation('source:native scoped Shift-mouse selection',async()=>{await page.mouse.click(geometry.first.x,geometry.first.y);await page.keyboard.down('Shift');await page.mouse.click(geometry.last.x,geometry.last.y);await page.keyboard.up('Shift');assert(await page.evaluate(()=>{const source=document.querySelector('#token-inspector-content [aria-label="Complete applied authored data"]'),selection=getSelection(),node=source.firstChild;return selection.anchorNode===node&&selection.focusNode===node&&Math.min(selection.anchorOffset,selection.focusOffset)===0&&Math.max(selection.anchorOffset,selection.focusOffset)===node.length;}));},{sourceUnits:units,actionBudget:units>65536?5000:Infinity});
        await operation('correctness:complete native selected-string equality',async()=>assert.equal(await page.evaluate(()=>getSelection().toString()),expectedSource),{sourceUnits:units});
        evidence.geometry=[];let markerIndex=0;
        async function captureGeometry(label){return page.evaluate(label=>{
          const source=document.querySelector('#token-inspector-content [aria-label="Complete applied authored data"]'),selection=getSelection(),range=selection.getRangeAt(0);
          const rect=r=>({x:r.x,y:r.y,left:r.left,right:r.right,top:r.top,bottom:r.bottom,width:r.width,height:r.height});
          const r=range.getBoundingClientRect(),p=source.getBoundingClientRect(),ancestors=[];
          for(let element=source;element&&ancestors.length<10;element=element.parentElement){const css=getComputedStyle(element);ancestors.push({tag:element.tagName,id:element.id,className:element.className,rect:rect(element.getBoundingClientRect()),clientWidth:element.clientWidth,clientHeight:element.clientHeight,scrollLeft:element.scrollLeft,scrollTop:element.scrollTop,scrollWidth:element.scrollWidth,scrollHeight:element.scrollHeight,overflowX:css.overflowX,overflowY:css.overflowY});}
          return {label,now:performance.now(),timeOrigin:performance.timeOrigin,viewport:{width:innerWidth,height:innerHeight,scrollX,scrollY,devicePixelRatio,documentWidth:document.documentElement.clientWidth,documentHeight:document.documentElement.clientHeight,visual:visualViewport?{width:visualViewport.width,height:visualViewport.height,scale:visualViewport.scale,offsetLeft:visualViewport.offsetLeft,offsetTop:visualViewport.offsetTop}:null},source:rect(p),ancestors,selection:{anchorInSource:selection.anchorNode===source.firstChild,focusInSource:selection.focusNode===source.firstChild,anchorOffset:selection.anchorOffset,focusOffset:selection.focusOffset,bounding:rect(r),clients:[...range.getClientRects()].map(rect)},originalReveal:Math.max(r.left,p.left,0)<Math.min(r.right,p.right,innerWidth)&&Math.max(r.top,p.top,0)<Math.min(r.bottom,p.bottom,innerHeight)};
        },label);}
        for(const marker of ['source-boundary-😀-','source-middle-marker','source-end-marker']){
          const before=await captureGeometry('before:'+marker);let after;
          await operation('diagnostic:native in-page Find API geometry:'+marker,async()=>{
            const match=await page.evaluate(needle=>{const found=window.find(needle,false,false,true,false,false,false),source=document.querySelector('#token-inspector-content [aria-label="Complete applied authored data"]'),selection=getSelection(),node=source.firstChild;return {found,exact:selection.toString()===needle,inside:selection.anchorNode===node&&selection.focusNode===node};},marker);assert(match.found&&match.exact&&match.inside);
            await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));after=await captureGeometry('after:'+marker);
          });
          evidence.geometry.push({marker,before,after});checkpoint();
          await supervised('diagnostic:viewport screenshot',()=>page.screenshot({path:output+'/marker-'+markerIndex+++'.png',fullPage:false}));
        }
        evidence.scope='ONE65535-unit geometry diagnostic, nativeinpageFindAPI only, no20sample qualification/noappscrollfix';
        evidence.originalRevealVerdict=evidence.geometry.every(sample=>sample.after.originalReveal);
        // Retain the original failed predicate after the expressly requested three
        // diagnostic observations; no qualifying verdict is silently upgraded.
        assert(evidence.originalRevealVerdict,'Original native in-page Find reveal predicate remains false');
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
