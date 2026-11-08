async (page) => {
 const old=await page.context().newPage();
 const props=['display','position','width','height','minHeight','padding','margin','gap','font','color','backgroundColor','border','borderRadius','gridTemplateColumns','gridTemplateRows','overflow'];
 async function init(p,url){await p.setViewportSize({width:1440,height:900});await p.goto(url);await p.getByRole('button',{name:'Create project',exact:true}).click();await p.getByRole('button',{name:'New token',exact:true}).first().click();await p.getByLabel('Name',{exact:true}).fill('primary');await p.getByRole('button',{name:'Create',exact:true}).click();}
 await init(old,'http://127.0.0.1:5184'); await init(page,'http://127.0.0.1:5173');
 const selectors=['.topbar','.brand','.brand svg','.session-notice','.sidebar-content','.sidebar-project','.nav-item','.count','.sidebar-bottom p','.panel-header','.panel-header h1','.panel-header p','.search input','.token-row','.swatch','.swatch > span','.token-identity strong','.token-identity small','.value-summary','.value-summary small','.inspector-header','.inspector-region-title','.header-specimen','.header-specimen > span','.inspector-heading','.inspector-heading h2','.inspector-heading p','.badge','.tabs','[role=tab]','.editor-body','.mode-switch','.mode-switch button','.field','.field select','.view-note','.component-control','.component-value','.component-value input','.component-range','.range-ends','.editor-actions','.statusbar'];
 const results=[];
 for(const [width,height] of [[1440,900],[1500,900],[1499,900],[1120,900],[1119,900],[901,900],[900,900],[768,900],[767,900],[541,900],[540,900],[320,740],[1440,480]]){
  await old.setViewportSize({width,height});await page.setViewportSize({width,height});
  await Promise.all([old,page].map(p=>p.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))))));
  const read=async p=>p.evaluate(({selectors,props})=>Object.fromEntries(selectors.map(q=>{const e=document.querySelector(q);if(!e)return[q,null];const s=getComputedStyle(e);return[q,Object.fromEntries(props.map(k=>[k,s[k]]))]})),{selectors,props});
  const a=await read(old),b=await read(page);const differences=[];
  for(const q of selectors)for(const prop of props)if(a[q]?.[prop]!==b[q]?.[prop])differences.push({selector:q,property:prop,before:a[q]?.[prop],after:b[q]?.[prop]});
  results.push({width,height,differences});
  await old.screenshot({path:`output/playwright/increment-004-review/paired-baseline-${width}-${height}.png`});
  await page.screenshot({path:`output/playwright/increment-004-review/final-${width}-${height}.png`});
 }
 for(const [p,prefix] of [[old,'paired-baseline'],[page,'final']]) {
  await p.setViewportSize({width:1440,height:900});
  await p.getByRole('button',{name:'New token',exact:true}).first().click();
  await p.screenshot({animations:'disabled',path:`output/playwright/increment-004-review/${prefix}-modal.png`});
  await p.keyboard.press('Escape');
  await p.setViewportSize({width:768,height:900});
  await p.getByRole('button',{name:'Open project navigation'}).click();
  await p.getByRole('dialog',{name:'Project navigation'}).waitFor();
  await p.screenshot({animations:'disabled',path:`output/playwright/increment-004-review/${prefix}-drawer.png`});
  await p.keyboard.press('Escape');
 }
 await old.close();return results;
}
