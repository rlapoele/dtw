async page => {
 const log=[]; const b=n=>page.getByRole('button',{name:n,exact:true});
 await page.goto('http://127.0.0.1:5173');await page.setViewportSize({width:1440,height:900});
 await page.getByLabel('Project name').fill('Review'); await b('Create project').click();await b('New token').first().click();
 await page.getByLabel('Name',{exact:true}).fill('a');await b('Create').click();
 await page.getByLabel('Red',{exact:true}).fill('0.123456789123456789123456789');await b('Apply changes').click();
 await page.getByRole('combobox',{name:'View color space',exact:true}).selectOption('oklch');await page.getByRole('combobox',{name:'View color space',exact:true}).selectOption('srgb');
 if(await page.getByLabel('Red',{exact:true}).inputValue()!=='0.123456789123456789123456789')throw Error('passive exact string');
 await page.getByLabel('Red',{exact:true}).fill('-');await b('Reference').click();await b('Literal color').click();
 if(await page.getByLabel('Red',{exact:true}).inputValue()!=='-')throw Error('incomplete draft');
 await b('Apply changes').click();await page.getByRole('alert').waitFor();
 if(await page.getByLabel('Red',{exact:true}).inputValue()!=='-')throw Error('rejection retention');
 await b('Cancel').click();
 await page.getByLabel('Green',{exact:true}).fill('none');
 if(await page.getByLabel('Green slider',{exact:true}).count())throw Error('none coerced to range');
 await b('Collapse token inspector').click();
 if(await page.getByLabel('Green',{exact:true}).isVisible())throw Error('collapsed contents visible');
 await b('Expand token inspector').click();
 if(await page.getByLabel('Green',{exact:true}).inputValue()!=='none')throw Error('collapse draft retention');
 await b('Cancel').click(); await page.getByRole('tab',{name:'Resolved & trace'}).click();
 await page.getByRole('tabpanel',{name:'Resolved & trace'}).waitFor(); await page.getByLabel('Red',{exact:true}).waitFor({state:'hidden'});
 await page.getByRole('tab',{name:'Authored value'}).click();
 await page.getByRole('searchbox').fill('not present');await b('Show selected token').click();
 await page.waitForFunction(()=>document.activeElement?.matches('.token-row[aria-pressed=true]'));
 log.push('exact long/incomplete/none text, passive views, mode/collapse/tab retention, rejected apply, selected reveal/focus');
 for(const [w,h] of [[1500,900],[1499,900],[1120,900],[1119,900],[901,900],[900,900],[768,900],[767,900],[541,900],[540,900],[320,740],[1440,480]]) {
  await page.setViewportSize({width:w,height:h});
  const metrics=await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth,grid:getComputedStyle(document.querySelector('.workbench')).gridTemplateColumns,rows:getComputedStyle(document.querySelector('.workbench')).gridTemplateRows}));
  if(metrics.scroll>w)throw Error('horizontal page overflow '+w);
  await page.locator('.editor-actions').scrollIntoViewIfNeeded(); if(!await b('Apply changes').isVisible())throw Error('lost apply '+w);
  await page.screenshot({path:`output/playwright/increment-004-review/review-${w}-${h}.png`});log.push(metrics);
 }
 await page.setViewportSize({width:768,height:900});await b('Open project navigation').click();
 await page.getByRole('dialog',{name:'Project navigation'}).waitFor();
 await page.keyboard.press('Escape');await page.getByRole('dialog').waitFor({state:'hidden'});
 if(!await b('Open project navigation').evaluate(e=>document.activeElement===e))throw Error('drawer focus return');
 await b('New token').first().click();await page.getByLabel('Name',{exact:true}).fill('modal');await page.keyboard.press('Escape');
 await page.getByRole('dialog').waitFor({state:'hidden'});
 log.push('drawer Escape/focus return and modal Escape');return log;
}
