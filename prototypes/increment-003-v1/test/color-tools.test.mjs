import {test} from 'node:test';
import assert from 'node:assert/strict';
import {byteIssue,colorPreview,convertColor,editByteChannel,formatConverted,literalIssue,srgbEntry} from '../src/color-tools.ts';
const color=(components,space='srgb',alpha='1')=>({space,components,alpha});
const converted=(c,space)=>{const result=convertColor(c,space);assert.equal(result.ok,true,JSON.stringify(result));return result.value;};
const near=(a,b,tolerance=1e-8)=>assert.ok(Math.abs(Number(a)-Number(b))<tolerance,`${a} != ${b}`);
const spaces=['srgb','display-p3','hsl','oklab','oklch'];
test('0–255 entries divide by 255; fractions and extended values are not integer rounded or clipped',()=>{
 let c=color(['0','0','0']);for(const [i,v]of ['250','30','30'].entries()){const r=editByteChannel(c,i,v);assert.equal(r.ok,true);c=r.value;}
 assert.deepEqual(c.components,['0.980392156863','0.117647058824','0.117647058824']);
 assert.match(colorPreview(c).css,/0.980392156863/);
 assert.deepEqual(srgbEntry(c,'bytes'),['250','30','30']);
 assert.equal(srgbEntry(color(['0.5','0','0']),'bytes')[0],'127.5');
 for(const space of spaces){const back=converted(converted(c,space),'srgb');assert.deepEqual(srgbEntry(back,'bytes'),['250','30','30']);}
 assert.equal(editByteChannel(c,1,'127.5').value.components[1],'0.5');
 assert.equal(editByteChannel(c,0,'510').value.components[0],'2');
 assert.equal(editByteChannel(c,0,'-255').value.components[0],'-1');
});
test('representation toggles preserve long authored strings and alpha without mutating the input',()=>{
 const c=color(['0.123456789123456789123456789','0.5','none'],'srgb','0.999999999999999999');const original=structuredClone(c);
 for(let i=0;i<3;i++){srgbEntry(c,'bytes');assert.deepEqual(srgbEntry(c,'normalized'),c.components);}
 assert.deepEqual(c,original);assert.equal(converted(c,'srgb'),c);
 const changed=editByteChannel(c,1,'30').value;assert.equal(changed.components[0],c.components[0]);assert.equal(changed.alpha,c.alpha);
});
test('all five spaces convert red and preserve alpha; no library identifier leaks',()=>{
 const red=color(['1','0','0'],'srgb','0.123456789123456789');
 const hsl=converted(red,'hsl');near(hsl.components[0],0);near(hsl.components[1],100);near(hsl.components[2],50);
 const lab=converted(red,'oklab');near(lab.components[0],.62795536,1e-6);near(lab.components[1],.22486306,1e-6);near(lab.components[2],.1258463,1e-6);
 for(const space of spaces){const c=converted(red,space);assert.equal(c.space,space);assert.equal(c.alpha,red.alpha);const back=converted(c,'srgb');back.components.forEach((v,i)=>near(v,red.components[i]));assert.ok(colorPreview(c).css,`${space}: ${colorPreview(c).message}`);}
});
test('all 25 space pairs retain the same sample color within 1e-8 sRGB roundtrip tolerance',()=>{
 const source=color(['0.25','0.5','0.75']);
 for(const first of spaces)for(const second of spaces){const back=converted(converted(converted(source,first),second),'srgb');back.components.forEach((v,i)=>near(v,source.components[i]));}
});
test('black, white and gray produce explicit powerless hue and can convert back without inventing a hue',()=>{
 for(const v of ['0','0.5','1'])for(const space of spaces){const c=converted(color([v,v,v]),space);if(space==='hsl')assert.equal(c.components[0],'none');if(space==='oklch')assert.equal(c.components[2],'none');const back=converted(c,'srgb');back.components.forEach(n=>near(n,v));assert.ok(colorPreview(c).css);}
 assert.equal(converted(color(['none','0','50'],'hsl'),'srgb').components[0],'0.5');
});
test('missing components and partial/non-finite entries cannot be converted or previewed as zero',()=>{
 for(const value of ['','-','.','0.','1e2','Infinity','NaN']){const c=color([value,'0','0']);assert.ok(literalIssue(c));assert.equal(convertColor(c,'oklab').ok,false);assert.equal(colorPreview(c).css,undefined);assert.ok(byteIssue([value,'0','0']));assert.equal(editByteChannel(c,0,value).ok,false);}
 for(const c of [color(['none','0','0']),color(['none','20','50'],'hsl'),color(['0.5','0.1','none'],'oklch')]){assert.equal(convertColor(c,'display-p3').ok,false);assert.equal(colorPreview(c).css,undefined);}
 assert.ok(byteIssue(['100000000000000000000000000000000000','0','0']));
 assert.ok(literalIssue(color(['0','0','0'],'srgb','2')));
});
test('out-of-gamut conversion retains extended raw coordinates and withholds the sRGB preview',()=>{
 assert.equal(colorPreview(color(['1.000000000001','0','0'])).css,undefined);
 const p3=color(['0','1','0'],'display-p3');const rgb=converted(p3,'srgb');assert.ok(rgb.components.some(v=>Number(v)<0||Number(v)>1));assert.equal(colorPreview(p3).css,undefined);assert.match(colorPreview(p3).message,/without clipping/);
 const back=converted(rgb,'display-p3');back.components.forEach((v,i)=>near(v,p3.components[i]));
});
test('conversion formatting has no exponent or negative zero and rejects non-finite results',()=>{
 for(const n of [-0,1e-15,-1e-15,123.0000000000001])assert.doesNotMatch(formatConverted(n),/e|^-0$/);
 assert.equal(formatConverted(.12345678912349),'0.123456789123');assert.throws(()=>formatConverted(Infinity));assert.throws(()=>formatConverted(1e21));
});
