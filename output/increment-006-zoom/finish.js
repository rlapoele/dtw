async page => {
  await page.setViewportSize({width:640,height:1440});
  const narrow=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scale:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth}));
  const footer=page.getByRole('contentinfo');await footer.scrollIntoViewIfNeeded();const footerBox=await footer.boundingBox();
  if(narrow.width!==320||narrow.height!==720||narrow.dpr!==2||narrow.scrollWidth>320||!footerBox||footerBox.x<0||footerBox.x+footerBox.width>320||footerBox.y+footerBox.height>720)throw Error(JSON.stringify({narrow,footerBox}));
  await page.screenshot({path:'output/increment-006-zoom/narrow-footer-200.png'});
  await page.setViewportSize({width:1440,height:900});
  await page.getByRole('button',{name:'Expand token inspector',exact:true}).click();
  await page.getByRole('combobox',{name:'RGB entry scale',exact:true}).selectOption('bytes');
  const note=page.getByText('Approximate · exact normalized 0.2314',{exact:true});
  await note.evaluate(el=>el.scrollIntoView({block:'center'}));
  const noteBox=await note.boundingBox(),actionsBox=await page.locator('.editor-actions').boundingBox();
  if(!noteBox||!actionsBox||noteBox.y+noteBox.height>actionsBox.y)throw Error('Centered approximation occluded');
  await page.screenshot({path:'output/increment-006-zoom/approximation-visible-200.png'});
  const settings=page.context().pages().find(p=>p.url()==='chrome://settings/appearance');
  await settings.getByRole('combobox',{name:'Page zoom',exact:true}).selectOption({label:'100%'});
  await page.bringToFront();await page.waitForFunction(()=>devicePixelRatio===1&&innerWidth===1440);
  const restored=await page.evaluate(()=>({width:innerWidth,height:innerHeight,dpr:devicePixelRatio,scale:visualViewport.scale,scrollWidth:document.documentElement.scrollWidth}));
  return {pass:true,narrow,footerBox,noteBox,actionsBox,restored};
}
