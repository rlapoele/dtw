async page => {
  const metrics=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scale:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth}));
  const row=await page.locator('.token-row').textContent();
  if(!row.includes('R: 0.2314')||!row.includes('G: 0.509803921568627451')||!row.includes('B: 0.67890123456789')||!row.includes('Alpha: 0.37'))throw Error('Post-flow exact source mismatch');
  const shortFooterHidden=await page.locator('footer').isHidden();
  await page.screenshot({path:'output/increment-006-zoom/quiet-list-200.png'});
  await page.getByRole('button',{name:'New token',exact:true}).first().click();
  const cancel=page.getByRole('button',{name:'Cancel',exact:true});await cancel.scrollIntoViewIfNeeded();
  const cancelBox=await cancel.boundingBox();
  if(!cancelBox||cancelBox.y<0||cancelBox.y+cancelBox.height>450)throw Error('Dialog action unreachable');
  await page.screenshot({path:'output/increment-006-zoom/dialog-actions-200.png'});
  await cancel.click();await page.getByRole('dialog',{name:'Create a color token',exact:true}).waitFor({state:'hidden'});
  await page.waitForFunction(()=>document.activeElement?.textContent==='New token');
  const focus=await page.evaluate(()=>document.activeElement?.textContent);
  const fixture=await page.context().newPage();await fixture.goto('http://127.0.0.1:5186/test/browser/increment006.html');
  return {productionPass:true,metrics,row,shortFooterHidden,cancelBox,focus,fixture:await fixture.locator('body').ariaSnapshot()};
}
