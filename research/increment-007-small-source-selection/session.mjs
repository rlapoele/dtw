import {chromium} from '/Users/rlapoele-pro/.npm/_npx/705bc6b22212b352/node_modules/playwright/index.mjs';
import {writeFile} from 'node:fs/promises';
const browser=await chromium.launch({channel:'chrome',headless:true});
const context=await browser.newContext({viewport:{width:1600,height:1100}});
const page=await context.newPage();await page.goto('http://127.0.0.1:4231/');await page.getByLabel('Description wrapping',{exact:true}).selectOption('current');
console.log(await browser.version());console.log(await page.locator('body').innerText());
await page.screenshot({path:'output/increment-007-small-source-selection/initial.png'});
// Line-oriented commands retain one owned native browser context. No selection injection.
import readline from 'node:readline';
const rl=readline.createInterface({input:process.stdin,terminal:false});
for await(const line of rl){try{if(line==='close'){await browser.close();break;}console.log(await eval('(async()=>{'+line+'})()'));}catch(e){console.log(String(e));}}
