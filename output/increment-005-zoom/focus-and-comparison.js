async page => {
  await page.getByRole('button',{name:'New token',exact:true}).first().click();
  await page.getByRole('dialog',{name:'Create a color token',exact:true}).waitFor();
  await page.getByRole('button',{name:'Cancel',exact:true}).click();
  await page.getByRole('dialog',{name:'Create a color token',exact:true}).waitFor({state:'hidden'});
  await page.waitForFunction(()=>document.activeElement?.textContent==='New token');
  const focus=await page.evaluate(()=>document.activeElement?.textContent);
  const compact=await page.locator('.token-identity .line-clamp-2').evaluate(el=>({height:el.getBoundingClientRect().height,scrollHeight:el.scrollHeight,lineHeight:getComputedStyle(el).lineHeight,display:getComputedStyle(el).display}));
  const settings=await page.context().newPage();
  await settings.goto('chrome://settings/appearance');
  const settingsSnapshot=await settings.locator('body').ariaSnapshot();
  await settings.getByRole('combobox',{name:'Page zoom',exact:true}).selectOption({label:'100%'});
  await settings.close();
  await page.bringToFront();
  await page.waitForFunction(()=>devicePixelRatio===1&&innerWidth===1440);
  const metrics100=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scale:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth}));
  await page.locator('.token-panel').evaluate(el=>el.scrollTop=0);
  await page.screenshot({path:'output/increment-005-zoom/example-100.png'});
  return {focus,compact,metrics100,settingsSnapshot};
}
