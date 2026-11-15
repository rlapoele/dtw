const {chromium}=require('/Users/rlapoele-pro/.npm/_npx/31e32ef8478fbf80/node_modules/playwright');
(async()=>{
const b=await chromium.launch({channel:'chrome',headless:true});
const c=await b.newContext({viewport:{width:720,height:800},acceptDownloads:true});const p=await c.newPage();p.setDefaultTimeout(5000);const errors=[];p.on('pageerror',e=>errors.push(String(e)));
await p.goto('http://127.0.0.1:5173');console.log('version',b.version());
await p.getByLabel('Project name',{exact:true}).fill('Review synthetic 011');await p.getByRole('button',{name:'Create project',exact:true}).click();
await p.getByRole('button',{name:'Projects',exact:true}).waitFor();await p.getByRole('button',{name:'Projects',exact:true}).click();
await p.getByRole('button',{name:'Inspect selected project',exact:true}).click();await p.getByRole('button',{name:'Download backup',exact:true}).waitFor();
const [d]=await Promise.all([p.waitForEvent('download'),p.getByRole('button',{name:'Download backup',exact:true}).click()]);const path=await d.path();
await p.getByRole('button',{name:'Back to projects',exact:true}).click();await p.getByLabel('Project backup file',{exact:true}).setInputFiles(path);
await p.getByRole('button',{name:'Open local project',exact:true}).waitFor();
console.log('before',await p.getByRole('dialog').innerText());await p.getByRole('button',{name:'Open local project',exact:true}).click();await p.waitForTimeout(350);
console.log('after restore open',await p.locator('body').innerText());console.log('workbench',await p.locator('.workbench').count());await p.screenshot({path:'output/playwright/increment-011/reviewer/restore-open-blocked.png',fullPage:true});
console.log('pageerrors',errors);await b.close();
})().catch(e=>{console.error(e);process.exit(1)});
