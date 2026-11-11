import { chromium } from '/Users/rlapoele-pro/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs';
import { mkdtemp, writeFile, readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import { tmpdir } from 'node:os';
import path from 'node:path';
const output = '/Users/rlapoele-pro/Library/CloudStorage/Dropbox/Projects/aiAssistedProjects/dtw/output/increment-007-implementation';
const profile = await mkdtemp(path.join(tmpdir(),'dtw007-owned-')); const child = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',['--user-data-dir='+profile,'--remote-debugging-port=0','--no-first-run','--no-default-browser-check','about:blank'],{stdio:'ignore'}); let browser;
const evidence = { manifest:'s4-r5-before-browser-manifest.json',profile, pid: child.pid, checks: [], errors: [] };
const timeout = setTimeout(() => { child.kill('SIGTERM'); }, 30000);
try {
  for(let i=0;i<100;i++){ try { const port = (await readFile(path.join(profile,'DevToolsActivePort'),'utf8')).split('\n')[0]; browser = await chromium.connectOverCDP('http://127.0.0.1:'+port,{timeout:1000}); break; } catch { await new Promise(r=>setTimeout(r,100)); } }
  if(!browser) throw Error('Owned Chrome not ready'); evidence.browser = browser.version(); const context = browser.contexts()[0]; context.setDefaultTimeout(5000); const page = await context.newPage(); page.on('pageerror',e=>evidence.errors.push(String(e)));
  await page.goto('http://127.0.0.1:4334'); await page.getByText('No projects retained in this browser.').waitFor();
  await page.getByLabel('Project name').fill('Clean replacement probe');await page.getByRole('button',{name:'Create project',exact:true}).click();await page.getByRole('heading',{name:'All colors',exact:true}).waitFor();
  await page.getByRole('button',{name:'New token',exact:true}).first().click();await page.getByRole('dialog').getByLabel('Name',{exact:true}).fill('brand');await page.getByRole('dialog').getByRole('button',{name:'Create',exact:true}).click();await page.getByLabel('Red',{exact:true}).waitFor();
  evidence.before=await page.getByLabel('Red',{exact:true}).inputValue();
  const snapshot=await page.evaluate(()=>new Promise((resolve,reject)=>{const req=indexedDB.open('dtw-projects-v1',1);req.onsuccess=()=>{const db=req.result;const tx=db.transaction('projects');const read=tx.objectStore('projects').openCursor();read.onsuccess=()=>resolve(read.result.value.snapshot);tx.oncomplete=()=>db.close();tx.onabort=()=>reject(tx.error)}}));
  snapshot.tokens[0].definition.assignments[0].value.components=['0.8','0.6','0.4'];snapshot.tokens[0].definition.assignments[0].value.alpha='0.7';
  const wrapper={format:'dtw.project-backup',formatVersion:1,authoredVersion:1,createdAt:'2026-11-11T00:00:00.000Z',snapshot};
  await page.getByLabel('Project backup file',{exact:true}).setInputFiles({name:'reviewer-change.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(wrapper))});
  await page.getByRole('button',{name:'Review replacement',exact:true}).click();await page.getByRole('button',{name:'Download current local backup',exact:true}).click();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Replace complete project',exact:true}).click();await page.getByRole('dialog').waitFor({state:'hidden'});
  async function stored(){return page.evaluate(()=>new Promise((resolve,reject)=>{const req=indexedDB.open('dtw-projects-v1',1);req.onsuccess=()=>{const db=req.result;const tx=db.transaction('projects');const read=tx.objectStore('projects').openCursor();read.onsuccess=()=>resolve(read.result.value.snapshot);tx.oncomplete=()=>db.close();tx.onabort=()=>reject(tx.error)}}));}
  async function check(condition, description){if(!condition)throw Error(description); evidence.checks.push(description);}
  await page.getByLabel('Red',{exact:true}).waitFor();
  await check(await page.getByLabel('Red',{exact:true}).inputValue()==='0.8'&&await page.getByLabel('Green',{exact:true}).inputValue()==='0.6'&&await page.getByLabel('Blue',{exact:true}).inputValue()==='0.4','clean literal replacement synchronizes all fields');
  await page.getByLabel('Red',{exact:true}).fill('0.3');await page.getByRole('button',{name:'Apply changes',exact:true}).click();await page.getByText('Changes applied and retained.').waitFor();
  let applied=(await stored()).tokens[0].definition.assignments[0].value;
  await check(JSON.stringify(applied.components)==='["0.3","0.6","0.4"]'&&applied.alpha==='0.7','following single-channel Apply retains newly applied untouched Green/Blue/Alpha');
  async function replace(snapshot){const wrapper={format:'dtw.project-backup',formatVersion:1,authoredVersion:1,createdAt:'2026-11-11T00:00:00.000Z',snapshot};await page.getByLabel('Project backup file',{exact:true}).setInputFiles({name:'changed.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(wrapper))});await page.getByRole('button',{name:'Review replacement',exact:true}).click();await page.getByRole('button',{name:'Download current local backup',exact:true}).click();await page.getByRole('checkbox').check();await page.getByRole('button',{name:'Replace complete project',exact:true}).click();await page.getByRole('dialog').waitFor({state:'hidden'});}
  let reference=await stored();const target=structuredClone(reference.tokens[0]);target.id='target';target.localName='target';reference.tokens.push(target);reference.tokens[0].definition.assignments[0].value={kind:'token-reference',targetTokenId:'target',valuePath:[]};await replace(reference);
  await page.getByRole('combobox',{name:'Target token',exact:true}).waitFor();await check(await page.getByRole('combobox',{name:'Target token',exact:true}).inputValue()==='"target"','clean literal-to-reference replacement synchronizes active mode and target');
  const unrelated=await stored();unrelated.project.name='Unrelated metadata revision';await replace(unrelated);await check(await page.getByRole('combobox',{name:'Target token',exact:true}).inputValue()==='"target"','unrelated revision leaves clean reference exact and no changed-baseline recovery');
  await check(await page.getByRole('heading',{name:'Applied state changed',exact:true}).count()===0,'clean sessions do not request dirty-baseline reapply');
  const literal=await stored();literal.tokens[0].definition.assignments[0].value={kind:'literal',valueType:'color',colorSpace:'srgb',components:['0.9','0.5','0.2'],alpha:'0.8'};await replace(literal);await page.getByLabel('Red',{exact:true}).waitFor();await check(await page.getByLabel('Red',{exact:true}).inputValue()==='0.9','clean reference-to-literal replacement follows new applied coordinates');
  await page.getByRole('button',{name:'Reference',exact:true}).click();await check(await page.getByRole('combobox',{name:'Target token',exact:true}).inputValue()!== '"target"','clean replacement clears inactive stale reference session');await page.getByRole('button',{name:'Literal color',exact:true}).click();
  await page.getByRole('combobox',{name:'RGB entry scale',exact:true}).selectOption('bytes');
  const passive=await stored();passive.tokens[0].definition.assignments[0].value.components=['0.2','0.4','0.6'];await replace(passive);await check(await page.getByRole('combobox',{name:'RGB entry scale',exact:true}).inputValue()==='bytes'&&await page.getByLabel('Red',{exact:true}).inputValue()==='51','clean replacement preserves passive byte scale while refreshing displayed components');
  await page.screenshot({path:output+'/s4-r5-clean.png',fullPage:true});evidence.status='passed';
} catch(error) { evidence.status='failed';evidence.error=String(error); } finally { await writeFile(output+'/s4-r5-clean.json',JSON.stringify(evidence,null,2)); if(browser) await browser.close().catch(()=>{}); child.kill('SIGTERM');clearTimeout(timeout); }
console.log(JSON.stringify(evidence));

if(evidence.status!=="passed")process.exitCode=1;
