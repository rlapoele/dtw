async page => {
  const description = ' First zoom line\nSecond zoom line\nThird exact line  ';
  await page.getByLabel('Description (optional)', {exact:true}).fill(description);
  await page.getByRole('button',{name:'Create',exact:true}).click();
  await page.getByRole('alert').waitFor();
  if (await page.getByLabel('Description (optional)',{exact:true}).inputValue() !== description) throw Error('Rejected creation lost description');
  const failure = await page.evaluate(() => ({ focused: document.activeElement?.getAttribute('role'), text: document.activeElement?.textContent }));
  if (failure.focused !== 'alert') throw Error('Creation error focus lost');
  await page.screenshot({path:'output/increment-005-zoom/creation-error.png'});
  await page.getByLabel('Name',{exact:true}).fill('zoom exact');
  await page.getByRole('button',{name:'Create',exact:true}).click();
  return { failure, snapshot: await page.locator('body').ariaSnapshot() };
}
