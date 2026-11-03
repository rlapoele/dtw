import type { Color, Space } from './fixtures';
import { byteIssue, convertColor, editByteChannel, srgbEntry } from './color-tools';
import type { InputMode, Triple } from './color-tools';
const labels:Record<Space,[string,string,string]>={srgb:['Red','Green','Blue'],'display-p3':['Red','Green','Blue'],hsl:['Hue (°)','Saturation (%)','Lightness (%)'],oklab:['Lightness','a','b'],oklch:['Lightness','Chroma','Hue (°)']};
export function LiteralFields({color,mode,byteText,onMode,onBytes,onChange,onError}:{color:Color;mode:InputMode;byteText:Triple|null;onMode:(m:InputMode)=>void;onBytes:(t:Triple|null)=>void;onChange:(c:Color)=>void;onError:(e:string)=>void}){
 const inputs=color.space==='srgb'&&mode==='bytes'?byteText??srgbEntry(color,'bytes'):color.components;
 const incomplete=color.space==='srgb'&&mode==='bytes'?byteIssue(inputs):undefined;
 function changeSpace(space:Space){
  if(incomplete){onError(incomplete);return;}
  const result=convertColor(color,space);
  if(!result.ok){onError(result.error);return;}
  if(space==='srgb'&&mode==='bytes'){try{srgbEntry(result.value,'bytes');}catch{onError('Converted values are too large for this entry scale. Choose normalized entry before converting. Current draft is preserved.');return;}}
  onChange(result.value);onBytes(null);
 }
 function changeMode(next:InputMode){if(incomplete){onError(incomplete);return;}if(next==='bytes'){try{srgbEntry(color,'bytes');}catch{onError('These values are too large for the 0–255 entry display. Current draft and entry scale are preserved.');return;}}onMode(next);onBytes(null);onError('');}
 function changeComponent(index:number,text:string){
  if(color.space==='srgb'&&mode==='bytes'){
   const next:Triple=[...inputs];next[index]=text;onBytes(next);
   if(text===inputs[index])return;
   const result=editByteChannel(color,index,text);
   if(result.ok)onChange(result.value);else onError(result.error);
  }else{const components:Triple=[...color.components];components[index]=text;onChange({...color,components});}
 }
 return <><label className="field">Color space<select value={color.space} onChange={e=>changeSpace(e.target.value as Space)}>{Object.keys(labels).map(s=><option key={s} value={s}>{s==='srgb'?'sRGB':s==='display-p3'?'Display P3':s.toUpperCase()}</option>)}</select></label>
 {color.space==='srgb'&&<label className="field">RGB entry scale<select value={mode} onChange={e=>changeMode(e.target.value as InputMode)}><option value="normalized">Normalized · 0–1</option><option value="bytes">0–255 scale</option></select></label>}
 <div className="grid grid-cols-3 gap-3">{inputs.map((value,index)=><label className="field" key={index}>{labels[color.space][index]}<input type="text" value={value} autoComplete="off" spellCheck={false} aria-describedby="exact-note editor-error" aria-invalid={Boolean(incomplete)||undefined} onChange={e=>changeComponent(index,e.target.value)}/></label>)}</div>
 <label className="field alpha-field">Alpha<input type="text" value={color.alpha} aria-describedby="exact-note editor-error" onChange={e=>onChange({...color,alpha:e.target.value})}/></label>
 <p id="exact-note" className="helper">{color.space==='srgb'?(mode==='bytes'?<>0–255 entry is divided by 255 for the normalized draft. Fractions are allowed. For a red specimen, try <code>250, 30, 30</code>. </>:<>sRGB channels use 0–1: <code>1</code> means full intensity (255 in the other entry scale). For pure red, enter <code>1, 0, 0</code>. </>):null}Components accept decimal text or <code>none</code>. Alpha stays 0–1. Changing space converts the draft approximately; Apply commits it for this session.</p>
</>;
}
