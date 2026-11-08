async page => {
  await page.getByLabel('Project name',{exact:true}).fill('Zoom verification');
  await page.getByRole('button',{name:'Create project',exact:true}).click();
  return await page.locator('body').ariaSnapshot();
}
