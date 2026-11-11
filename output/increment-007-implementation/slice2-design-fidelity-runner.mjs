import { chromium } from '/Users/rlapoele-pro/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
const dir=process.cwd()+'/output/playwright/increment-007-implementation';
const profile=await mkdtemp(path.join(tmpdir(),'dtw007-fidelity-'));
const child=spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--user-data-dir='+profile,'--remote-debugging-port=0','--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'});
const r={profile,pid:child.pid,checks:[],errors:[]};let browser;
const timer=setTimeout(()=>child.kill('SIGTERM'),55000);
try{
for(let i=0;i<100;i++){try{const port=(await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0];browser=await chromium.connectOverCDP('http://127.0.0.1:'+port,{timeout:1000});break}catch{await new Promise(x=>setTimeout(x,100))}}
if(!browser)throw Error('Chrome not ready');r.browser=browser.version();const context=browser.contexts()[0];context.setDefaultTimeout(4000);const p=await context.newPage();await p.setViewportSize({width:1600,height:1000});p.on('pageerror',e=>r.errors.push(String(e)));
const snap=async n=>{await writeFile(dir+'/slice2-fidelity-r2-'+n+'.txt',await p.locator('body').ariaSnapshot())};
const shot=async n=>p.screenshot({path:dir+'/slice2-fidelity-r2-'+n+'.png'});
await p.goto('http://127.0.0.1:4327');await p.getByText('No projects retained in this browser.').waitFor();await snap('01-projects');await shot('01-projects');
await p.getByLabel('Project name').fill('Fidelity scope');await p.getByRole('button',{name:'Create project',exact:true}).click();await p.getByRole('heading',{name:'All colors',exact:true}).waitFor();await snap('02-empty');
await p.getByRole('button',{name:'New token',exact:true}).first().click();await snap('03-create');await p.getByRole('dialog').getByLabel('Name',{exact:true}).fill('brand');await p.getByLabel('Description (optional)').fill('Readable ordinary words keep their boundaries.\nExact newlines remain.');await p.getByRole('dialog').getByRole('button',{name:'Create',exact:true}).click();await p.getByLabel('Red',{exact:true}).waitFor();await snap('04-editor');await shot('04-desktop');
r.viewOptions=await p.getByRole('combobox',{name:'View color space',exact:true}).locator('option').allTextContents();
for(const label of r.viewOptions){await p.getByRole('combobox',{name:'View color space',exact:true}).selectOption({label});r.checks.push({view:label,fields:await p.locator('input:not([type=range])').evaluateAll(es=>es.map(e=>({label:e.labels?.[0]?.textContent?.trim(),value:e.value})))})}
await p.getByRole('combobox',{name:'View color space',exact:true}).selectOption('srgb');await p.getByRole('combobox',{name:'RGB entry scale',exact:true}).selectOption('bytes');await snap('05-bytes');await shot('05-bytes');
await p.getByText('All authored data',{exact:true}).scrollIntoViewIfNeeded();await snap('06-source-closed');await shot('06-source-closed');await p.getByText('All authored data',{exact:true}).click();const source=p.getByLabel('Complete applied authored data');await source.waitFor();await source.scrollIntoViewIfNeeded();await snap('07-source');await shot('07-source');r.source=await source.evaluate(e=>{const s=getComputedStyle(e);return {text:e.textContent,whiteSpace:s.whiteSpace,overflow:s.overflow,clientHeight:e.clientHeight,scrollHeight:e.scrollHeight,maxHeight:s.maxHeight,tabIndex:e.tabIndex}});
await p.getByRole('tab',{name:'Resolved & trace',exact:true}).click();await snap('08-resolved');await shot('08-resolved');
await p.setViewportSize({width:760,height:900});await snap('09-compact');await shot('09-compact');r.compact=await p.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));
await p.setViewportSize({width:320,height:900});await snap('10-narrow');await shot('10-narrow');r.narrow=await p.evaluate(()=>({width:innerWidth,scrollWidth:document.documentElement.scrollWidth}));r.status='passed';
}catch(e){r.status='failed';r.error=String(e)}finally{await writeFile(dir+'/slice2-fidelity-r2-receipt.json',JSON.stringify(r,null,2));if(browser)await browser.close().catch(()=>{});child.kill('SIGTERM');clearTimeout(timer)}
