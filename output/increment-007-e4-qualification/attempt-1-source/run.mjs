import {spawn,execFileSync} from 'node:child_process';import {readFile,writeFile,mkdir,mkdtemp} from 'node:fs/promises';import {createServer} from 'node:http';import {createHash} from 'node:crypto';import {tmpdir} from 'node:os';import path from 'node:path';
import {verdict} from './trace.mjs';import {snapshot,kinds} from './fixtures.mjs';import {semantic,preflight,canonical} from '../increment-007-stage-a/codec.mjs';
const out='output/increment-007-e4-qualification',hash=s=>createHash('sha256').update(s).digest('hex');
const r={start:new Date().toISOString(),os:execFileSync('sw_vers').toString(),hardware:'not queried: sandbox sysctl denied',node:process.version,cases:[],fixtures:{},limits:{ordinaryTaskMs:100,exceptionalTaskMs:250,exceptionalAboveUnits:65536,perActionMs:5000,safetyWatchdogMs:30000},gaps:['Safari defensive/native cases pending supervisor gate','AT not run','Browser Find/actual200%zoom require observed native browser UI proof; no geometry substitute'],clipboardProcedure:'User approved overwrite with synthetic source/document and read only after correlated native copy. No original clipboard read, save or restore.'};
for(const kind of kinds){const s=snapshot(kind),text=JSON.stringify(s.tokens[0],null,2);r.fixtures[kind]={counts:{...semantic(s),...preflight(s)},canonicalSha256:hash(canonical(s)),units:text.length,sha256:hash(text)};}
const save=()=>writeFile(out+'/chrome.json',JSON.stringify(r,null,2)+'\n');await save();
const server=createServer(async(req,res)=>{try{const pathname=new URL(req.url,'http://localhost').pathname,p=path.resolve(out,'build','.'+(pathname==='/'?'/index.html':pathname));if(!p.startsWith(path.resolve(out,'build')+'/'))throw Error('path');res.setHeader('Content-Type',p.endsWith('.html')?'text/html':p.endsWith('.css')?'text/css':'text/javascript');res.end(await readFile(p));}catch{res.writeHead(404).end();}});await new Promise(ok=>server.listen(0,'127.0.0.1',ok));r.origin='http://127.0.0.1:'+server.address().port;
const {chromium}=await import('/Users/rlapoele-pro/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs');r.profile=await mkdtemp(path.join(tmpdir(),'dtw-e4-'));let child,browser,page,cdp,timer,seq=0;
async function traced(label,ceiling,fn){
 const id=String(++seq).padStart(3,'0')+'-'+label;r.active=id;await save();let tracing=false;const wall=Date.now();
 timer=setTimeout(()=>{r.watchdog={id,ms:Date.now()-wall,pid:child.pid,action:'SIGKILL own disposable Chrome'};child.kill('SIGKILL');void save();},30000);
 try{
  await cdp.send('Tracing.start',{categories:'-*,toplevel,devtools.timeline,v8,blink.user_timing,disabled-by-default-devtools.timeline',transferMode:'ReturnAsStream'});tracing=true;
  await page.evaluate(name=>performance.mark(name),id+'-start');const activated=Date.now();const value=await fn();const actionWallMs=Date.now()-activated;await page.evaluate(name=>performance.mark(name),id+'-end');
  const done=new Promise(ok=>cdp.once('Tracing.tracingComplete',ok));await cdp.send('Tracing.end');tracing=false;const event=await done;let text='';while(true){const p=await cdp.send('IO.read',{handle:event.stream});text+=p.data;if(p.eof)break;}await cdp.send('IO.close',{handle:event.stream});await writeFile(out+'/'+id+'-trace.json',text);
  const trace=JSON.parse(text),targetFrameId=(await cdp.send('Page.getFrameTree')).frameTree.frame.id;const marks=trace.traceEvents.filter(e=>e.name===id+'-start'||e.name===id+'-end');
  const begin=marks.find(e=>e.name===id+'-start'),end=marks.find(e=>e.name===id+'-end');const timing=verdict(trace,{targetFrameId,start:begin?.ts,end:end?.ts,ceilingMs:ceiling});
  if(!begin||!end){timing.status='inconclusive';timing.reason='Action interval marks absent';}
  const result={id,label,status:timing.status,actionWallMs,value,trace:timing};if(actionWallMs>5000){result.status='fail';result.reason='Five-second action maximum exceeded';}r.cases.push(result);await save();
  if(result.status!=='pass'){r.stop={id,status:result.status,reason:result.reason??timing.reason};await save();return false;}return true;
 }catch(e){r.cases.push({id,label,status:'invalid',error:String(e),wallMs:Date.now()-wall});r.stop={id,reason:String(e),status:'invalid'};if(tracing)await cdp.send('Tracing.end').catch(()=>{});await save();return false;}finally{clearTimeout(timer);}
}
async function closeSource(){const d=page.locator('details').filter({has:page.locator('summary',{hasText:'All authored data'})});if(await d.getAttribute('open')!==null){await d.locator('summary').click();await page.waitForFunction(()=>!document.querySelector('[data-source]'));}}
async function openSource(){await page.getByText('All authored data',{exact:true}).click();await page.waitForFunction(()=>e4.metrics()?.painted,{timeout:5000});return page.evaluate(()=>e4.metrics());}
try{
 child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--user-data-dir='+r.profile,'--remote-debugging-port=0','--no-first-run','--no-default-browser-check','about:blank'],{stdio:['ignore','ignore','pipe']});r.pid=child.pid;child.stderr.on('data',b=>r.stderr=((r.stderr??'')+b).slice(-3000));
 for(let i=0;i<100;i++){try{const port=String(await readFile(path.join(r.profile,'DevToolsActivePort'))).split('\n')[0];browser=await chromium.connectOverCDP('http://127.0.0.1:'+port,{timeout:1000});break;}catch{await new Promise(ok=>setTimeout(ok,100));}}
 if(!browser)throw Error('Own Chrome attach failed');r.browser=browser.version();const context=browser.contexts()[0];page=await context.newPage();page.on('pageerror',error=>{r.errors??=[];r.errors.push(String(error));});page.setDefaultTimeout(5000);await page.setViewportSize({width:1600,height:1100});cdp=await context.newCDPSession(page);
 const startup=Date.now();await page.goto(r.origin);await page.waitForFunction(()=>e4.ready);r.coldStartup={wallMs:Date.now()-startup,ua:await page.evaluate(()=>navigator.userAgent),status:'observed only; no task pass attributed to navigation'};await save();
 for(const kind of ['small','65535','65536','65537','escape','long-color','raw','escaped-large']){
  const fixture=r.fixtures[kind],gate=fixture.units>65536?250:100;
  if(!await traced(kind+'-ordinary-load',100,async()=>{const value=await page.evaluate(k=>e4.load(k),kind);await page.getByRole('button',{name:/t0/}).first().waitFor();return {value,worker:await page.evaluate(()=>e4.stats())};}))break;
  if(!await traced(kind+'-ordinary-select',100,async()=>{await page.getByRole('button',{name:/t0/}).first().click();await page.getByText('All authored data',{exact:true}).waitFor();return {inputs:await page.locator('[aria-label="Selected token"] input').count(),worker:await page.evaluate(()=>e4.stats()),sourceNodes:await page.locator('[data-source]').count()};}))break;
  // Safe first-risk opening precedes any workload repetition.
  if(!await traced(kind+'-first-open',gate,openSource))break;
  if(!await traced(kind+'-exact-complete-equality',gate,async()=>{const text=await page.locator('[data-source]').textContent();if(text.length!==fixture.units||hash(text)!==fixture.sha256)throw Error('Applied complete-source equality mismatch');return {units:text.length,sha256:hash(text),worker:await page.evaluate(()=>e4.stats())};}))break;
  await page.screenshot({path:out+'/'+kind+'-open.png'});
  let okay=true;for(let i=0;i<21;i++){await closeSource();if(!await traced(kind+'-'+(i===0?'warmup':'sample-'+i),gate,openSource)){okay=false;break;}}if(!okay)break;
  // Native selection is observed separately. Cmd+A is allowed to reveal document-wide scope;
  // never relabel this as local exact-source success.
  if(!await traced(kind+'-native-select',gate,async()=>{await page.locator('[data-source]').focus();await page.keyboard.press('Meta+A');return page.evaluate(()=>{const s=getSelection(),p=document.querySelector('[data-source]');return {units:s.toString().length,text:s.toString(),sourceOnly:s.rangeCount===1&&s.getRangeAt(0).commonAncestorContainer===p.firstChild,scope:'actual keyboard Cmd+A after focus on document pre'};});}))break;
  // A copy-event witness plus next event-loop turn is required before any clipboard read.
  if(!await traced(kind+'-native-copy',gate,async()=>{
   const selected=await page.evaluate(()=>{window.__copySeen=false;document.addEventListener('copy',()=>{window.__copySeen=true;},{once:true});return getSelection().toString();});
   await page.keyboard.press('Meta+C');await page.waitForFunction(()=>window.__copySeen);await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));
   const copied=execFileSync('/usr/bin/pbpaste').toString('utf8');return {copyEvent:true,selectedUnits:selected.length,clipboardUnits:copied.length,selectedSha256:hash(selected),clipboardSha256:hash(copied),clipboardEqualsSelected:copied===selected,clipboardEqualsSource:copied.length===fixture.units&&hash(copied)===fixture.sha256,scope:'native Cmd+C; authorized synthetic clipboard read only after copy witness'};
  }))break;
  await page.keyboard.press('ArrowRight');
  if(!await traced(kind+'-ordinary-geometry',100,async()=>page.locator('[data-source]').evaluate(e=>({scrollWidth:e.scrollWidth,scrollHeight:e.scrollHeight,clientWidth:e.clientWidth,clientHeight:e.clientHeight,documentOverflow:document.documentElement.scrollWidth>innerWidth,whiteSpace:getComputedStyle(e).whiteSpace,maxHeight:getComputedStyle(e).maxHeight}))))break;
  // Closed source must release its encoded worker result, not precompute the next request.
  await closeSource();const closed=await page.evaluate(()=>e4.stats());r.cases.push({id:kind+'-closed-state',status:'observation',value:closed});await save();
 }
}catch(error){r.error=String(error);}finally{
 clearTimeout(timer);r.end=new Date().toISOString();await save();await browser?.close().catch(()=>{});child?.kill('SIGTERM');await new Promise(ok=>server.close(ok));r.cleanup={ownedBrowserClosed:true,ownedServerClosed:true,user4227Untouched:true};await save();
}
