async page => {
  const settings=page.context().pages().find(p=>p.url()==='chrome://settings/appearance');
  await settings.getByRole('combobox',{name:'Page zoom',exact:true}).selectOption({label:'200%'});
  await settings.screenshot({path:'output/increment-006-zoom/settings-200.png'});
  await page.bringToFront();
  await page.waitForFunction(()=>devicePixelRatio===2&&innerWidth===720);
  const metrics=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scale:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth}));
  if(metrics.height!==450||metrics.scale!==1||metrics.scrollWidth>metrics.width)throw Error(JSON.stringify(metrics));
  await page.getByRole('textbox',{name:'Red',exact:true}).scrollIntoViewIfNeeded();
  await page.screenshot({path:'output/increment-006-zoom/example-200.png'});
  return {metrics,snapshot:await page.locator('body').ariaSnapshot()};
}
