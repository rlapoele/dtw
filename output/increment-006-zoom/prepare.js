async page => {
  const metrics = () => page.evaluate(() => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio, scale: visualViewport.scale, scrollWidth: document.documentElement.scrollWidth }));
  const baseline = await metrics();
  if(baseline.width!==1440||baseline.height!==900||baseline.dpr!==1) throw Error(JSON.stringify(baseline));
  await page.getByLabel('Project name',{exact:true}).fill('Integer zoom review');
  await page.getByRole('button',{name:'Create project',exact:true}).click();
  await page.getByRole('button',{name:'New token',exact:true}).first().click();
  await page.getByLabel('Name',{exact:true}).fill('Precise color');
  await page.getByLabel('Description (optional)',{exact:true}).fill('Exact source retained through integer display.');
  await page.getByRole('button',{name:'Create',exact:true}).click();
  return { baseline, snapshot:await page.locator('body').ariaSnapshot() };
}
