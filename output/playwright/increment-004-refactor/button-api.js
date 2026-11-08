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
 await page.getByRole('dialog').waitFor();if(!await page.getByRole('dialog').evaluate(e=>e.classList.contains('popup-string-caller')&&e.classList.contains('dialog-popup')))throw Error('Popup string class lost');await page.getByRole('button',{name:'Close',exact:true}).click();
 await page.getByRole('dialog').waitFor({state:'hidden'});
 if(!await page.getByRole('button',{name:'Open',exact:true}).evaluate(e=>e===document.activeElement))throw Error('focus return failed');
 await page.getByRole('button',{name:'Open popup callback',exact:true}).click();
 const popup=page.getByRole('dialog',{name:'Popup callback composition'});await popup.waitFor();
 if(!await popup.evaluate(e=>e.classList.contains('popup-open-caller')&&e.classList.contains('dialog-popup')&&e.classList.contains('fixed')&&e.classList.contains('p-7')))throw Error('DialogContent callback or owned classes lost');
 const state=await page.evaluate(()=>JSON.parse(document.documentElement.dataset.popupCallbackState));
 if(state.open!==true||state.nested!==false||state.nestedDialogOpen!==false||!('transitionStatus' in state))throw Error('DialogContent callback state not forwarded');
 if(!await popup.evaluate(e=>e.tagName==='SECTION'&&e.title==='Forwarded popup title'&&e.dataset.renderComposed==='true'&&e.dataset.refForwarded==='true'))throw Error('DialogContent props/ref/render lost');
 await page.getByRole('button',{name:'Clear popup classes',exact:true}).click();
 if(!await popup.evaluate(e=>!e.classList.contains('popup-open-caller')&&!e.classList.contains('undefined')&&e.classList.contains('dialog-popup')&&e.classList.contains('p-7')))throw Error('Undefined popup callback changed owned classes');
 await page.getByRole('button',{name:'Close popup callback',exact:true}).click();await popup.waitFor({state:'hidden'});
 if(!await page.getByRole('button',{name:'Open popup callback',exact:true}).evaluate(e=>e===document.activeElement))throw Error('Popup callback focus return lost');
 if(!await page.getByRole('button',{name:'Undefined callback',exact:true}).evaluate(e=>!e.classList.contains('undefined')&&e.classList.contains('h-8')))throw Error('Undefined Button callback changed owned classes');
 return 'PASS Button callback/string/undefined classes, props/ref, keyboard/disabled/sizes; DialogContent string/callback/undefined classes, actual state, props/ref/render and focus return';
}
