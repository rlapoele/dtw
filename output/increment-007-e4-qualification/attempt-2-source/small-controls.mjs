// Only safe small fixtures after the preserved ordinary-load risk failure.
export async function controls({page,r,traced,openSource,closeSource,out,hash}){
 await page.getByRole('button',{name:/t0/}).first().click();
 if(!await traced('small-draft-failure-retry',100,async()=>{
  const red=page.getByRole('textbox',{name:/^Red/});await red.fill('0.');
  await page.getByRole('button',{name:'Reference',exact:true}).click();await page.getByLabel('Target token',{exact:true}).selectOption('target');
  await page.getByRole('button',{name:'Literal color',exact:true}).click();if(await red.inputValue()!=='0.')throw Error('Literal draft lost');
  await page.getByLabel('Requested failure',{exact:true}).selectOption('fail-once');
  const summary=page.getByText('All authored data',{exact:true});await summary.focus();await page.keyboard.press('Enter');
  await page.getByRole('button',{name:'Retry authored data'}).waitFor();await page.screenshot({path:out+'/S2-failure-draft.png'});
  if(await red.inputValue()!=='0.')throw Error('Failed source destroyed draft');
  await page.getByRole('button',{name:'Retry authored data'}).click();await page.waitForFunction(()=>e4.metrics()?.painted);
  const text=await page.locator('[data-source]').textContent();if(hash(text)!==r.fixtures.small.sha256)throw Error('Source changed by draft');
  await page.getByRole('button',{name:'Reference',exact:true}).click();const reference=await page.getByLabel('Target token',{exact:true}).inputValue();
  await page.getByRole('button',{name:'Literal color',exact:true}).click();const literal=await red.inputValue();
  if(reference!=='target'||literal!=='0.')throw Error('Independent draft lost');
  return {literal,reference,appliedSourceSha256:hash(text),appliedUnits:text.length,retryFocus:await page.evaluate(()=>document.activeElement?.textContent),scope:'actual worker error, explicit Retry and real production fields; no Apply performed'};
 }))return;
 await closeSource();await page.getByLabel('Requested failure',{exact:true}).selectOption('complete');
 if(!await traced('small-real-response-close-fence',100,async()=>{
  await page.evaluate(()=>e4.hold(true));await page.getByText('All authored data',{exact:true}).click();await page.waitForFunction(()=>e4.queued()>0);
  const preparing=await page.getByText('Preparing authored data…',{exact:true}).isVisible();await closeSource();const released=await page.evaluate(()=>e4.release());
  await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));
  const nodes=await page.locator('[data-source]').count(),events=await page.evaluate(()=>e4.events().slice(-8));if(nodes!==0||!events.some(e=>e.ignored))throw Error('Late closed-source publication');
  return {preparing,released,nodes,events,worker:await page.evaluate(()=>e4.stats()),scope:'real worker source response held at renderer harness boundary, then close before delivery'};
 }))return;
 await page.getByRole('button',{name:'Cancel',exact:true}).click();
 if(!await traced('small-real-response-selection-fence',100,async()=>{
  await page.evaluate(()=>e4.hold(true));await page.getByText('All authored data',{exact:true}).click();await page.waitForFunction(()=>e4.queued()>0);
  await page.getByRole('button',{name:/target/}).first().click();const released=await page.evaluate(()=>e4.release());
  await page.evaluate(()=>new Promise(ok=>requestAnimationFrame(()=>requestAnimationFrame(ok))));
  const nodes=await page.locator('[data-source]').count(),events=await page.evaluate(()=>e4.events().slice(-8));if(nodes!==0||!events.some(e=>e.ignored))throw Error('Late selected-source publication');return {released,nodes,events};
 }))return;
 // Browser shortcuts are observed, not assumed to be honored by CDP key dispatch.
 const before=await page.evaluate(()=>({innerWidth,devicePixelRatio}));for(let i=0;i<5;i++)await page.keyboard.press('Meta+Equal');
 const after=await page.evaluate(()=>({innerWidth,devicePixelRatio}));r.actualZoom={before,after,status:after.devicePixelRatio===before.devicePixelRatio*2?'observed keyboard200percent':'unqualified: shortcut did not establish200percent',method:'actual keyboard Cmd+= five times; no device-metrics emulation used as zoom proof'};await page.keyboard.press('Meta+0');
 await page.setViewportSize({width:760,height:900});await page.getByRole('button',{name:/t0/}).first().click();await openSource();await page.screenshot({path:out+'/S2-compact.png'});r.compact={width:760,height:900,sourceUnits:(await page.locator('[data-source]').textContent()).length,scope:'safe modest source only; screenshot/geometry is not AT or browserzoom evidence'};
}
