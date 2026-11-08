async page=>{
 await page.goto('http://127.0.0.1:5173/test/browser/components.html');
 await page.getByRole('button',{name:'Open popup callback',exact:true}).click();
 const popup=page.getByRole('dialog',{name:'Popup callback composition'});await popup.waitFor();
 const before=await popup.evaluate(e=>({classes:e.className,tag:e.tagName,title:e.title,ref:e.dataset.refForwarded,render:e.dataset.renderComposed}));
 if(!before.classes.includes('popup-open-caller')||!before.classes.includes('dialog-popup')||!before.classes.includes('p-7'))throw Error('callback/owned classes lost');
 if(before.tag!=='SECTION'||before.ref!=='true'||before.render!=='true'||before.title!=='Forwarded popup title')throw Error('forwarding failed');
 const state=await page.evaluate(()=>JSON.parse(document.documentElement.dataset.popupCallbackState));
 if(state.open!==true||state.nested!==false||state.nestedDialogOpen!==false||!('transitionStatus' in state))throw Error('callback state invalid');
 await page.getByRole('button',{name:'Clear popup classes',exact:true}).click();
 const after=await popup.getAttribute('class');if(after.includes('popup-open-caller')||after.includes('undefined')||!after.includes('dialog-popup'))throw Error('undefined callback failed');
 await page.keyboard.press('Escape');await popup.waitFor({state:'hidden'});
 await page.waitForFunction(()=>document.activeElement?.textContent==='Open popup callback');
 await page.getByRole('button',{name:'Open',exact:true}).click();
 const stringPopup=page.getByRole('dialog',{name:'Composition'});await stringPopup.waitFor();
 if(!await stringPopup.evaluate(e=>e.classList.contains('popup-string-caller')&&e.classList.contains('p-7')))throw Error('string caller lost');
 await page.getByRole('button',{name:'Close',exact:true}).click();await stringPopup.waitFor({state:'hidden'});
 const button=page.getByRole('button',{name:'Undefined callback',exact:true});if(!await button.evaluate(e=>e.classList.contains('h-8')&&!e.classList.contains('undefined')))throw Error('Button undefined guard');
 return {pass:true,before,state,after,focusReturn:true,stringCaller:true,undefinedButton:true};
}
