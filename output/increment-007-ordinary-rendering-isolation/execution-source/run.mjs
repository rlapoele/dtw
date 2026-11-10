import {spawn,execFileSync,fork} from 'node:child_process';
import {readFile,writeFile,mkdir,mkdtemp,rm} from 'node:fs/promises';
import {createServer} from 'node:http';
import {createHash} from 'node:crypto';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {verdict} from './trace.mjs';
import {snapshot} from './fixtures.mjs';
import {canonical} from '../increment-007-stage-a/codec.mjs';
const out='output/increment-007-ordinary-rendering-isolation';
const hash=s=>createHash('sha256').update(s).digest('hex');
const action=process.argv[2];
if(!['control-wide','risk-wide','control-compact','risk-compact','control-inspector','risk-inspector'].includes(action))throw Error('Explicit single action required');
const [phase,kind]=action.split('-');
let previous;try{previous=JSON.parse(await readFile(out+'/state.json'));}catch{}
if(previous?.stop)throw Error('Batch already stopped; no further browser actions authorized');
const order=['control-wide','risk-wide','control-compact','risk-compact','control-inspector','risk-inspector'];
if(order[previous?.completed?.length??0]!==action)throw Error('Finite order prerequisite failed');
const r={action,start:new Date().toISOString(),os:execFileSync('sw_vers').toString(),node:process.version,limits:{maximumWholeTargetTaskMs:100,externalSafetyMs:30000},baseline:execFileSync('git',['rev-parse','HEAD']).toString().trim()};
const save=()=>writeFile(out+'/'+action+'.json',JSON.stringify(r,null,2)+'\n');
const f=snapshot('65535'),pretty=JSON.stringify(f.tokens[0],null,2),description=f.tokens[0].description;
r.fixture={canonicalSha256:hash(canonical(f)),completePrettyUnits:pretty.length,completePrettySha256:hash(pretty),rawDescriptionUnits:description.length,rawDescriptionSha256:hash(description),frozenFixtureFileSha256:hash(await readFile('output/increment-007-e4-qualification/attempt-1-source/fixtures.mjs')),isolatedFixtureFileSha256:hash(await readFile('research/increment-007-ordinary-rendering-isolation/fixtures.mjs'))};
if(r.fixture.canonicalSha256!=='1b4b5241cf1af157ac990eb238c210366180d95076845d897ff2afe706beca8e'||r.fixture.completePrettySha256!=='739717a5620a061f514a96948c80ae45044d37789d822b85e56d500522d442e6'||pretty.length!==65535)throw Error('Frozen fixture mismatch');
const server=createServer(async(req,res)=>{try{const u=new URL(req.url,'http://localhost'),p=path.resolve('/tmp/dtw-ordinary-isolation-build','.'+(u.pathname==='/'?'/index.html':u.pathname));if(!p.startsWith('/tmp/dtw-ordinary-isolation-build/'))throw Error('path');res.setHeader('Content-Type',p.endsWith('.html')?'text/html':p.endsWith('.css')?'text/css':'text/javascript');res.end(await readFile(p));}catch{res.writeHead(404).end();}});
await new Promise(ok=>server.listen(0,'127.0.0.1',ok));r.origin='http://127.0.0.1:'+server.address().port;
const {chromium}=await import('/Users/rlapoele-pro/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs');
r.profile=await mkdtemp(path.join(tmpdir(),'dtw-ordinary-isolation-'));
let child,browser,watcher,page,cdp;
async function arm(id){await new Promise((ok,bad)=>{const fn=m=>{if(m.armed===id){watcher.off('error',bad);watcher.off('message',fn);ok();}};watcher.on('message',fn);watcher.once('error',bad);watcher.send({type:'arm',id,pid:child.pid,profile:r.profile,file:path.resolve(out,action+'-watchdog.json')});});}
async function traceMount(fn){
 await arm(action);
 await cdp.send('Tracing.start',{categories:'-*,toplevel,devtools.timeline,v8,blink.user_timing,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});
 const started=Date.now();r.value=await fn();r.actionWallMs=Date.now()-started;
 const done=new Promise(ok=>cdp.once('Tracing.tracingComplete',ok));await cdp.send('Tracing.end');const event=await done;let text='';for(;;){const q=await cdp.send('IO.read',{handle:event.stream});text+=q.data;if(q.eof)break;}await cdp.send('IO.close',{handle:event.stream});
 await writeFile(out+'/'+action+'-trace.json',text);
 const trace=JSON.parse(text),events=trace.traceEvents;
 const frameId=(await cdp.send('Page.getFrameTree')).frameTree.frame.id;
 const start=events.find(e=>e.name===action+'-activation'),end=events.find(e=>e.name===action+'-painted'),dom=events.find(e=>e.name===action+'-dom-complete');
 r.marks={start,dom,end};r.targetFrameId=frameId;
 r.timing=verdict(trace,{targetFrameId:frameId,start:start?.ts,end:end?.ts,ceilingMs:100});
 if(!start||!end||!dom||start.pid!==end.pid||start.tid!==end.tid||start.pid!==r.timing.coverage.ownership.pid||dom.ts<start.ts||end.ts<dom.ts){r.timing.status='inconclusive';r.timing.reason='Missing/unowned/unordered activation DOM paint marks';}
 const {pid}=r.timing.coverage.ownership,threads=r.timing.coverage.rendererThreads;
 const all=events.filter(e=>e.ph==='X'&&e.pid===pid&&threads.some(t=>t.tid===e.tid)&&e.ts<end?.ts&&e.ts+e.dur>start?.ts);
 await writeFile(out+'/'+action+'-target-events.json',JSON.stringify(all,null,2)+'\n');
 watcher.send({type:'disarm'});
 r.status=r.timing.status;
}
try{
 child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--user-data-dir='+r.profile,'--remote-debugging-port=0','--no-first-run','--no-default-browser-check','about:blank'],{detached:true,stdio:['ignore','ignore','pipe']});r.pid=child.pid;child.stderr.on('data',b=>r.stderr=((r.stderr??'')+b).slice(-2000));
 watcher=fork(new URL('./watchdog.mjs',import.meta.url),[],{stdio:['ignore','ignore','ignore','ipc']});
 await arm(action+'-setup');
 for(let i=0;i<100;i++){try{const port=String(await readFile(path.join(r.profile,'DevToolsActivePort'))).split('\n')[0];browser=await chromium.connectOverCDP('http://127.0.0.1:'+port,{timeout:1000});break;}catch{await new Promise(ok=>setTimeout(ok,100));}}
 if(!browser)throw Error('Owned Chrome attach failed');r.browser=browser.version();
 const context=browser.contexts()[0];page=await context.newPage();page.setDefaultTimeout(5000);await page.setViewportSize({width:kind==='compact'?1000:1600,height:1100});cdp=await context.newCDPSession(page);page.on('pageerror',e=>{r.pageErrors??=[];r.pageErrors.push(String(e));});
 let spec;
 if(phase==='control'){
  await page.goto(r.origin);await page.locator('.token-row').first().waitFor();await page.evaluate(()=>document.fonts.ready);
  if(kind==='inspector'){await page.locator('.token-row').first().click();await page.locator('.inspector-heading p').waitFor();}
  spec=await page.evaluate(k=>window.isolation.capture(k),kind);r.originalEnvironment=await page.evaluate(()=>window.isolation.environment());
  await page.screenshot({path:out+'/'+action+'-application.png'});
  const selector=kind==='inspector'?'.inspector-heading p':kind==='wide'?'.token-row > span:nth-child(2)':'.token-row .token-identity > span';
  await page.locator(selector).first().screenshot({path:out+'/'+action+'-application-surface.png'});
  await writeFile(out+'/'+kind+'-spec.json',JSON.stringify(spec,null,2)+'\n');
 }else spec=JSON.parse(await readFile(out+'/'+kind+'-spec.json'));
 // Fresh page with no App render or application/grid/flex ancestry.
 await page.close();page=await context.newPage();await page.setViewportSize({width:kind==='compact'?1000:1600,height:1100});cdp=await context.newCDPSession(page);await page.goto(r.origin+'/?leaf');await page.waitForFunction(()=>window.isolation);await page.evaluate(()=>document.fonts.ready);
 r.leafEnvironment=await page.evaluate(()=>window.isolation.environment());
 if(phase==='control'){
  await traceMount(()=>page.evaluate(async({s,id})=>{performance.mark(id+'-activation');const measured=window.isolation.install(s);performance.mark(id+'-dom-complete');await new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(()=>{performance.mark(id+'-painted');ok(null);})));return measured;},{s:spec,id:action}));
  r.controlMatches=JSON.stringify(r.value)===JSON.stringify(spec.baseline);r.baseline=spec.baseline;
  if(!r.controlMatches){r.status='inconclusive';r.reason='Small-control computed style/text/box mismatch';}
  await page.screenshot({path:out+'/'+action+'-leaf.png'});
  await page.locator('[data-specimen] > '+(kind==='wide'?'span:nth-child(2)':'*')).first().screenshot({path:out+'/'+action+'-leaf-surface.png'});
 }else{
  await page.evaluate(s=>window.isolation.install(s),spec);
  r.preconstruction=await page.evaluate(()=>window.isolation.prepare());
  if(r.preconstruction.rawUnits!==description.length||r.preconstruction.sha256!==hash(description))throw Error('Browser exact fixture mismatch');
  await traceMount(()=>page.evaluate(id=>window.isolation.mount(id),action));
  if(!r.value.equality.every(Boolean)||r.value.domSha256.some(h=>h!==hash(description))){r.status='inconclusive';r.reason='Complete exact DOM mismatch';}
  // If already failed, retain existing DOM evidence, no further layout measurement.
  if(r.status==='pass'){r.geometry=await page.evaluate(()=>window.isolation.measure());await page.screenshot({path:out+'/'+action+'-leaf.png'});}
 }
 if(r.pageErrors?.length){r.status='inconclusive';r.reason='Browser page errors';}
}catch(e){r.status='inconclusive';r.error=String(e);}finally{
 watcher?.send({type:'disarm'});await browser?.close().catch(()=>{});try{process.kill(-child.pid,'SIGTERM');}catch{}
 watcher?.disconnect();await new Promise(ok=>server.close(ok));await rm(r.profile,{recursive:true,force:true});r.cleanup={ownedBrowserClosed:true,ownedServerClosed:true,ownedProfileRemoved:true,watchdogDisconnected:true};r.end=new Date().toISOString();await save();
 const state={completed:[...(previous?.completed??[]),action],...(r.status==='pass'?{}:{stop:{action,status:r.status,reason:r.reason??r.timing?.reason??r.error}})};await writeFile(out+'/state.json',JSON.stringify(state,null,2)+'\n');console.log(JSON.stringify({action,status:r.status,controlMatches:r.controlMatches,maxima:r.timing?.maxima,reason:r.reason??r.error}));
}
