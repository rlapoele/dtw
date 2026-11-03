import ColorJS from 'colorjs.io';
import type { Color, Space } from './fixtures';
export type Triple = [string,string,string];
export type Result<T> = {ok:true;value:T}|{ok:false;error:string};
export type InputMode = 'normalized'|'bytes';
const ids:Record<Space,string>={srgb:'srgb','display-p3':'p3',hsl:'hsl',oklab:'oklab',oklch:'oklch'};
// Presentation policy only: no exponent/-0, 12 fractional places; no gamut mapping.
export function formatConverted(n:number):string {
 if(!Number.isFinite(n)||Math.abs(n)>=1e21)throw new Error('Conversion result cannot be represented by this prototype.');
 const text=n.toFixed(12).replace(/\.?0+$/,'');
 return !text||text==='-0'?'0':text;
}
// Derived byte fields are a display representation, separate from authored values.
export function formatByteDisplay(n:number):string {
 if(!Number.isFinite(n)||Math.abs(n)>=1e21)throw new Error('These values are too large for the 0–255 entry display.');
 const text=n.toFixed(6).replace(/\.?0+$/,'');
 return !text||text==='-0'?'0':text;
}
export function numericText(text:string):boolean {
 return /^-?(?:0|[1-9]\d*)(?:\.\d+)?$/.test(text)&&Number.isFinite(Number(text));
}
export function literalIssue(c:Color):string|undefined {
 if(c.components.some(s=>s!=='none'&&!numericText(s)))return 'Complete each component with decimal text or none (no exponent notation).';
 if(!numericText(c.alpha)||Number(c.alpha)<0||Number(c.alpha)>1)return 'Alpha must be a numeric ratio from 0 to 1.';
}
export function srgbEntry(c:Color,mode:InputMode):Triple {
 return mode==='normalized'?[...c.components]:c.components.map(s=>s==='none'||!numericText(s)?s:formatByteDisplay(Number(s)*255)) as Triple;
}
export function byteIssue(text:Triple):string|undefined {
 if(text.some(s=>s!=='none'&&!numericText(s)))return 'Complete all 0–255 fields with decimal text or none before applying or switching representation.';
 try{for(const s of text)if(s!=='none'){formatByteDisplay(Number(s));formatConverted(Number(s)/255);}}catch{return 'This channel is too large for the prototype conversion range.';}
}
export function editByteChannel(c:Color,index:number,text:string):Result<Color>{
 if(text!=='none'&&!numericText(text))return {ok:false,error:'Finish the channel value before applying.'};
 try{const components:Triple=[...c.components];components[index]=text==='none'?'none':formatConverted(Number(text)/255);return {ok:true,value:{...c,components}};}
 catch{return {ok:false,error:'This channel is too large to display in the prototype.'};}
}
// Color.js accepts null for a missing coordinate. Only a powerless hue with
// exactly zero saturation/chroma is passed through; no invented numeric hue.
function conversionCoords(c:Color):[number|null,number|null,number|null]|undefined {
 const missing=c.components.flatMap((v,i)=>v==='none'?[i]:[]);
 const powerless=(c.space==='hsl'&&missing.length===1&&missing[0]===0&&Number(c.components[1])===0)||(c.space==='oklch'&&missing.length===1&&missing[0]===2&&Number(c.components[1])===0);
 if(missing.length&&!powerless)return;
 return c.components.map(v=>v==='none'?null:Number(v)) as [number|null,number|null,number|null];
}
export function convertColor(c:Color,target:Space):Result<Color>{
 const issue=literalIssue(c);if(issue)return {ok:false,error:issue};
 // A no-op preserves all authored text, including precise or missing values.
 if(target===c.space)return {ok:true,value:c};
 const coords=conversionCoords(c);
 if(!coords)return {ok:false,error:'Conversion unavailable for missing components. Only a powerless hue with zero saturation/chroma can convert. Current space and draft are preserved.'};
 try{
  const result=new ColorJS(ids[c.space],coords,Number(c.alpha)).to(ids[target]);
  const hueIndex=target==='hsl'?0:target==='oklch'?2:-1;
  const components=result.coords.map((n,i)=>(n===null||Number.isNaN(n))&&i===hueIndex?'none':formatConverted(n??NaN)) as Triple;
  return {ok:true,value:{space:target,components,alpha:c.alpha}};
 }catch{return {ok:false,error:'Conversion unavailable for these values. Current space and draft are preserved.'};}
}
export function colorPreview(c?:Color):{css?:string;message:string}{
 if(!c)return {message:'No resolved color specimen.'};
 const issue=literalIssue(c);if(issue)return {message:`Preview unavailable: ${issue}`};
 const input=conversionCoords(c);
 if(!input)return {message:'Preview unavailable for missing components. Values are retained.'};
 try{
  const rgb=new ColorJS(ids[c.space],input,Number(c.alpha)).to('srgb');
  const numbers=rgb.coords.map(n=>{if(n===null||!Number.isFinite(n))throw new Error('Non-finite preview');return n;});
  // Authored sRGB has strict bounds; only cross-space conversion noise within
  // 1e-10 may be rounded at the preview boundary. This never writes authored data.
  const tolerance=c.space==='srgb'?0:1e-10;
  if(numbers.some(n=>n < -tolerance || n > 1+tolerance))return {message:'Outside the sRGB preview gamut. Values are retained without clipping or gamut mapping.'};
  const coords=numbers.map(n=>n<0?0:n>1?1:n);
  return {css:`color(srgb ${coords.map(formatConverted).join(' ')} / ${c.alpha})`,message:c.space==='srgb'?'sRGB specimen · normalized channels':'Approximate sRGB specimen · converted for display'};
 }catch{return {message:'Preview unavailable for these values. Authored text is retained.'};}
}
