async page => {
  const baseline = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio, scale: visualViewport.scale, scrollWidth: document.documentElement.scrollWidth }));
  if (baseline.width !== 1440 || baseline.height !== 900 || baseline.dpr !== 1 || baseline.scale !== 1) throw Error('Bad baseline ' + JSON.stringify(baseline));
  await page.screenshot({ path: 'output/increment-005-zoom/baseline.png' });
  await page.goto('chrome://settings/appearance');
  return { baseline, settingsSnapshot: await page.locator('body').ariaSnapshot() };
}
