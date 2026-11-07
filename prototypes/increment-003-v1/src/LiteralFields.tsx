import { Select } from './Select';
import type { CSSProperties } from 'react';
import type { Color, Space } from './fixtures';
import { byteIssue, convertColor, editByteChannel, literalIssue, numericText, srgbEntry } from './color-tools';
import type { InputMode, Triple } from './color-tools';
export const spaceName=(s:Space)=>s==='srgb'?'sRGB':s==='display-p3'?'Display P3':s.toUpperCase();
const labels:Record<Space,[string,string,string]>={srgb:['Red','Green','Blue'],'display-p3':['Red','Green','Blue'],hsl:['Hue (°)','Saturation (%)','Lightness (%)'],oklab:['Lightness','a','b'],oklch:['Lightness','Chroma','Hue (°)']};
type RangeSpec={min:number;max:number;step:number;gradient:string};
function rangeSpec(space:Space,index:number,bytes:boolean):RangeSpec {
 const hue=(space==='hsl'&&index===0)||(space==='oklch'&&index===2);
 if(hue)return {min:0,max:359.9,step:0.1,gradient:'linear-gradient(to right,#e33333,#d3c825,#30b94c,#31c8cb,#3655e1,#b737cd,#e33333)'};
 if(space==='hsl')return {min:0,max:100,step:0.1,gradient:index===2?'linear-gradient(to right,#111,#999,#fff)':'linear-gradient(to right,#9b9b9b,#4b78bd)'};
 if(space==='oklab'&&index>0)return {min:-0.4,max:0.4,step:0.001,gradient:index===1?'linear-gradient(to right,#389d70,#aaa,#c4598e)':'linear-gradient(to right,#5670be,#aaa,#c1ae45)'};
 if(space==='oklch'&&index===1)return {min:0,max:0.4,step:0.001,gradient:'linear-gradient(to right,#aaa,#456bc8)'};
 if(space==='srgb'||space==='display-p3')return {min:0,max:bytes?255:1,step:bytes?1:0.001,gradient:`linear-gradient(to right,#222,${['#e45c5c','#4f9e61','#557bd0'][index]})`};
 return {min:0,max:1,step:0.001,gradient:'linear-gradient(to right,#111,#fff)'};
}
export function LiteralFields({color,viewSpace,mode,byteText,onView,onMode,onBytes,onChange,onError}:{color:Color;viewSpace:Space;mode:InputMode;byteText:Triple|null;onView:(s:Space)=>void;onMode:(m:InputMode)=>void;onBytes:(t:Triple|null)=>void;onChange:(c:Color)=>void;onError:(e:string)=>void}){
 const converted=convertColor(color,viewSpace);
 const displayed=converted.ok?converted.value:color;
 const bytes=displayed.space==='srgb'&&mode==='bytes';
 let inputs:Triple=displayed.components;
 try{if(bytes)inputs=byteText??srgbEntry(displayed,'bytes');}catch{/* failed space/scale changes are refused before reaching this state */}
 const incomplete=bytes?byteIssue(inputs):undefined;
 function changeSpace(space:Space){
  if(incomplete){onError(incomplete);return;}
  const issue=literalIssue(color);if(issue){onError(`Finish the current entries before changing view. ${issue}`);return;}
  const result=convertColor(color,space);
  if(!result.ok){onError(result.error);return;}
  if(space==='srgb'&&mode==='bytes'){try{srgbEntry(result.value,'bytes');}catch{onError('This color cannot use the 0–255 display. Current view and draft are preserved.');return;}}
  onView(space);onError('');
 }
 function changeMode(next:InputMode){if(incomplete){onError(incomplete);return;}if(next==='bytes'){try{srgbEntry(displayed,'bytes');}catch{onError('These values are too large for the 0–255 display. Current draft and entry scale are preserved.');return;}}onMode(next);onBytes(null);onError('');}
 function changeComponent(index:number,text:string){
  if(bytes){const next:Triple=[...inputs];next[index]=text;onBytes(next);if(text===inputs[index])return;const result=editByteChannel(displayed,index,text);if(result.ok)onChange(result.value);else onError(result.error);}
  else{const components:Triple=[...displayed.components];components[index]=text;onBytes(null);onChange({...displayed,components});}
 }
 return <><label className="field">View color space<Select value={viewSpace} aria-describedby="space-note" onChange={e=>changeSpace(e.target.value as Space)}>{Object.keys(labels).map(s=><option key={s} value={s}>{spaceName(s as Space)}</option>)}</Select></label>
 <p id="space-note" className="view-note">{viewSpace===color.space?<>Draft in <strong>{spaceName(color.space)}</strong>. Switching view keeps its exact values.</>:<>Viewing an approximate <strong>{spaceName(viewSpace)}</strong> representation. Draft remains in <strong>{spaceName(color.space)}</strong> until you edit a component here.</>}</p>
 {displayed.space==='srgb'&&<label className="field">RGB entry scale<Select value={mode} onChange={e=>changeMode(e.target.value as InputMode)}><option value="normalized">Normalized · 0–1</option><option value="bytes">0–255 scale</option></Select></label>}
 <div className="component-controls">{inputs.map((value,index)=>{const spec=rangeSpec(displayed.space,index,bytes);const available=numericText(value)&&Number(value)>=spec.min&&Number(value)<=spec.max;const name=labels[displayed.space][index];return <div className="component-control" key={`${displayed.space}-${index}`}><label className="component-value"><span>{name}</span><input type="text" value={value} autoComplete="off" spellCheck={false} aria-describedby={`range-note-${index} exact-note editor-error`} aria-invalid={Boolean(incomplete)||undefined} onChange={e=>changeComponent(index,e.target.value)}/></label>{available?<><input className="component-range" type="range" min={spec.min} max={spec.max} step={spec.step} value={Number(value)} style={{'--range-gradient':spec.gradient} as CSSProperties} aria-label={`${name} slider`} aria-valuetext={`${value}${name.includes('°')?' degrees':name.includes('%')?' percent':''}`} aria-describedby={`range-note-${index}`} onChange={e=>changeComponent(index,e.target.value)}/><div className="range-ends" aria-hidden="true"><span>{spec.min}</span><span>{spec.max}</span></div></>:<p className="helper range-unavailable">{value==='none'?'Missing component · use exact entry to set a value.':numericText(value)?'Outside this visual range · exact value retained.':'Complete the exact entry to use the slider.'}</p>}<p className="sr-only" id={`range-note-${index}`}>Illustrative range {spec.min} to {spec.max}; slider step {spec.step}. Exact entry supports finer values and any valid extended coordinates.</p></div>;})}</div>
 <div className="component-control alpha-control"><label className="component-value"><span>Alpha</span><input type="text" value={color.alpha} aria-describedby="exact-note editor-error" onChange={e=>onChange({...color,alpha:e.target.value})}/></label>{numericText(color.alpha)&&Number(color.alpha)>=0&&Number(color.alpha)<=1&&<><input className="component-range alpha-range" type="range" min="0" max="1" step="0.01" value={Number(color.alpha)} aria-label="Alpha slider" aria-valuetext={color.alpha} onChange={e=>onChange({...color,alpha:e.target.value})}/><div className="range-ends" aria-hidden="true"><span>Transparent · 0</span><span>Opaque · 1</span></div></>}</div>
 <p id="exact-note" className="helper">Exact fields accept decimal text or <code>none</code>; alpha stays 0–1. Range colors are illustrative, not a color prediction. Sliders make deliberate, stepped edits; text keeps full precision. Apply saves the draft in {spaceName(color.space)}.</p>
</>;
}
