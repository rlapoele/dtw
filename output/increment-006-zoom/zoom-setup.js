async page => {
  const original=['0.2314','0.41234567890123456789','0.67890123456789'];
  for(const [i,name] of ['Red','Green','Blue'].entries()) await page.getByRole('textbox',{name,exact:true}).fill(original[i]);
  await page.getByRole('textbox',{name:'Alpha',exact:true}).fill('0.1234567890123456789');
  await page.getByRole('button',{name:'Apply changes',exact:true}).click();
  await page.getByRole('combobox',{name:'RGB entry scale',exact:true}).selectOption('bytes');
  const values=await Promise.all(['Red','Green','Blue'].map(name=>page.getByRole('textbox',{name,exact:true}).inputValue()));
  if(JSON.stringify(values)!==JSON.stringify(['59','105','173']))throw Error(JSON.stringify(values));
  if(!await page.getByRole('button',{name:'Apply changes',exact:true}).isDisabled())throw Error('Passive scale dirtied');
  await page.getByRole('textbox',{name:'Red',exact:true}).scrollIntoViewIfNeeded();
  await page.screenshot({path:'output/increment-006-zoom/example-100.png'});
  const settings=await page.context().newPage();
  await settings.goto('chrome://settings/appearance');
  return {values,settings:await settings.locator('body').ariaSnapshot()};
}
