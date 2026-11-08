async page => {
 await page.goto('http://127.0.0.1:5173/test/browser/components.html');
 const callback=page.getByRole('button',{name:'Callback',exact:true});
 if(!await callback.evaluate(e=>e.classList.contains('caller-enabled')&&e.classList.contains('h-8')&&e.title==='Forwarded title'))throw Error('callback/base/props lost');
 await callback.focus();await page.keyboard.press('Enter');
 if(await page.getByLabel('Clicks').textContent()!=='1')throw Error('keyboard or ref failed');
 const disabled=page.getByRole('button',{name:'Disabled',exact:true});
 if(!await disabled.isDisabled()||!await disabled.evaluate(e=>e.classList.contains('caller-disabled')))throw Error('disabled state lost');
 await disabled.evaluate(e=>e.click());
 if(await page.getByLabel('Clicks').textContent()!=='1')throw Error('disabled handler ran');
 if(await page.getByRole('button',{name:'Compact',exact:true}).evaluate(e=>getComputedStyle(e).height)!=='28px')throw Error('compact size unreachable');
 await page.getByRole('button',{name:'Open',exact:true}).click();
 await page.getByRole('dialog').waitFor();await page.getByRole('button',{name:'Close',exact:true}).click();
 await page.getByRole('dialog').waitFor({state:'hidden'});
 if(!await page.getByRole('button',{name:'Open',exact:true}).evaluate(e=>e===document.activeElement))throw Error('focus return failed');
 return 'PASS callback state/classes, string classes, props/ref, keyboard, disabled, 28px size, Dialog render and focus return';
}
