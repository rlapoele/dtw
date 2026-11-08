async page => {
  await page.getByRole('combobox', { name: 'Page zoom', exact: true }).selectOption({ label: '200%' });
  await page.screenshot({ path: 'output/increment-005-zoom/settings-200.png' });
  await page.goto('http://127.0.0.1:4185');
  const metrics = await page.evaluate(() => ({ width: innerWidth, height: innerHeight, dpr: devicePixelRatio, scale: visualViewport.scale, scrollWidth: document.documentElement.scrollWidth }));
  if (metrics.width !== 720 || metrics.height !== 450 || metrics.dpr !== 2 || metrics.scale !== 1) throw Error('Not actual 200% zoom: ' + JSON.stringify(metrics));
  return { metrics, snapshot: await page.locator('body').ariaSnapshot() };
}
