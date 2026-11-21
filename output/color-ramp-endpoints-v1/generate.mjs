// Isolated endpoint exploration, not application implementation.
// Run: node output/color-ramp-endpoints-v1/generate.mjs
import {converter,formatHex,displayable} from 'culori';
import {writeFileSync} from 'node:fs';
const lch=converter('oklch'),labels=[50,100,200,300,400,500,600,700,800,900,950];
const examples=[{title:'Near-white',hex:'#fafafa',interior:true},{title:'Near-black',hex:'#030303',interior:true},{title:'White',hex:'#ffffff'},{title:'Black',hex:'#000000'}];
function nearest(l){return labels.reduce((best,s)=>Math.abs(.97-.77*(s-50)/900-l)<Math.abs(.97-.77*(best-50)/900-l)?s:best,50);}
function generate(hex,ls,anchor){
 if(ls===1&&anchor!==50||ls===0&&anchor!==950)return {status:'blocked',reason:ls===1?'White must occupy step 50: no lighter steps exist.':'Black must occupy step 950: no darker steps exist.'};
 const high=anchor===50?ls:ls>=.97?(1+ls)/2:.97;
 const low=anchor===950?ls:ls<=.20?ls/2:.20;
 const rows=labels.map(step=>{
  const isSeed=step===anchor;
  const t=isSeed?0:step<anchor?(anchor-step)/(anchor-50):(step-anchor)/(950-anchor);
  const L=isSeed?ls:ls+((step<anchor?high:low)-ls)*t;
  const raw={mode:'oklch',l:L,c:0};
  return {step,L,raw,anchor:isSeed,hex:isSeed?hex:formatHex(raw)};
 });
 for(let i=0;i<rows.length;i++){
  rows[i].duplicatePrevious=i>0&&rows[i].hex===rows[i-1].hex;
  if(!displayable(rows[i].hex))throw Error('Invalid display hex');
  if(!/^#([0-9a-f]{2})\1\1$/.test(rows[i].hex))throw Error('Not neutral '+JSON.stringify(rows[i]));
  if(i&&rows[i].L>=rows[i-1].L)throw Error('Nonmonotone lightness');
 }
 return {status:'ok',anchor,high,low,rows,distinctHex:new Set(rows.map(x=>x.hex)).size,duplicatePairs:rows.filter(x=>x.duplicatePrevious).map(x=>[rows[labels.indexOf(x.step)-1].step,x.step])};
}
for(const e of examples){
 e.L=e.hex==='#ffffff'?1:e.hex==='#000000'?0:lch(e.hex).l;
 e.auto=generate(e.hex,e.L,nearest(e.L));
 e.interior=generate(e.hex,e.L,500);
 if(e.auto.rows.find(x=>x.anchor).hex!==e.hex)throw Error('Changed seed');
 if(e.interior.status==='ok'&&e.interior.rows.find(x=>x.anchor).hex!==e.hex)throw Error('Changed interior seed');
}
const data={date:'2026-11-21',library:'Culori 4.0.2',labels,assumptions:['Neutral opaque seeds isolate endpoint and placement behavior. Chroma is exactly zero; neither hue nor alpha varies.','Default endpoints L=.97/.20; linear lightness on either side of the seed using numeric step-label positions.','Illustrative Auto picks nearest reference lightness .97-.77*(step-50)/900, ties to lighter step.','An endpoint seed replaces that endpoint. For an interior seed at/above .97, upper=(1+Ls)/2; at/below .20, lower=Ls/2.','Exact white/black restricted to steps50/950 respectively; interior creation is blocked rather than producing a flat section.','Raw generated coordinates are OKLCH. HEX is an8-bit sRGB preview; duplicate HEX does not imply identical authored coordinates.','No perceptual distinguishability threshold is selected. Only duplicate displayed HEX is flagged.','No gamut mapping needed for neutral examples; chromatic extremes, other step counts and alpha are not qualified.','Endpoint/Auto/placement policy is exploratory, not yet accepted.'],examples};
writeFileSync(new URL('./data.json',import.meta.url),JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify(examples.map(e=>({title:e.title,L:e.L,auto:e.auto.anchor,interior:e.interior.status,distinct:e.interior.distinctHex,duplicates:e.interior.duplicatePairs,high:e.interior.high,low:e.interior.low})),null,2));
