async page => {
 const results=[];
 for(const [url,prefix] of [['http://127.0.0.1:5184','r1-baseline'],['http://127.0.0.1:5173','r1-final']]) {
  await page.setViewportSize({width:768,height:900});await page.goto(url);
  await page.getByRole('button',{name:'Create project',exact:true}).click();
  const trigger=page.getByRole('button',{name:'Open project navigation'});
  const geometry=await trigger.evaluate(e=>{const i=e.querySelector('svg'),b=e.getBoundingClientRect(),r=i.getBoundingClientRect();return {buttonWidth:b.width,buttonHeight:b.height,iconWidth:r.width,iconHeight:r.height}});
  if(geometry.buttonWidth!==44||geometry.buttonHeight!==44||geometry.iconWidth!==22||geometry.iconHeight!==22)throw Error(JSON.stringify({prefix,geometry}));
  await page.screenshot({path:`output/playwright/increment-004-refactor/${prefix}-navigation-icon.png`});
  await trigger.click();await page.getByRole('dialog',{name:'Project navigation'}).waitFor();
  await page.waitForFunction(()=>{const e=document.querySelector('.navigation-drawer');return e&&e.getBoundingClientRect().left>=-0.1&&!e.hasAttribute('data-starting-style')});
  await page.screenshot({path:`output/playwright/increment-004-refactor/${prefix}-drawer-open.png`});
  await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.getAttribute('aria-label')==='Open project navigation');
  results.push({prefix,geometry,focusReturned:true});
 }
 return results;
}
