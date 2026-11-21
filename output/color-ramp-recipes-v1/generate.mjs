// Isolated visual exploration; not a production algorithm.
// Run: node output/color-ramp-recipes-v1/generate.mjs
import {converter, clampChroma, displayable, formatHex} from 'culori';
import {writeFileSync} from 'node:fs';
const toLch=converter('oklch'), labels=[50,100,200,300,400,500,600,700,800,900,950];
const high=.97, low=.20;
const examples=[{title:'Blue',hex:'#3b82f6'},{title:'Yellow',hex:'#facc15'},{title:'Muted mauve',hex:'#8b7b89'},{title:'Neutral gray',hex:'#808080',neutral:true}];
for(const e of examples){
 const seed=toLch(e.hex);
 // Exact sRGB grayscale has no chromatic intent; discard conversion roundoff.
 if(e.neutral){seed.c=0;delete seed.h;}
 e.seed=seed;
 e.anchor=labels.reduce((best,s)=>Math.abs(high-(high-low)*(s-50)/900-seed.l)<Math.abs(high-(high-low)*(best-50)/900-seed.l)?s:best,labels[0]);
 e.rows={};
 for(const recipe of ['linear','retained']){
  e.rows[recipe]=labels.map(step=>{
   const isSeed=step===e.anchor;
   const lightSide=step<e.anchor;
   const t=isSeed?0:lightSide?(e.anchor-step)/(e.anchor-50):(step-e.anchor)/(950-e.anchor);
   const endpointL=lightSide?high:low, endpointRatio=lightSide?.05:.15;
   const l=isSeed?seed.l:seed.l+(endpointL-seed.l)*t;
   const weight=recipe==='linear'?1-t:1-t*t;
   const c=isSeed?seed.c:seed.c*(endpointRatio+(1-endpointRatio)*weight);
   const raw={mode:'oklch',l,c,...(!e.neutral?{h:seed.h}:{})};
   const mapped=!isSeed&&!displayable(raw);
   const hex=isSeed?e.hex:formatHex(mapped?clampChroma(raw,'oklch','rgb'):raw);
   return {step,hex,anchor:isSeed,mapped,t,raw,displayOklch:toLch(hex)};
  });
 }
 e.mappedCounts=Object.fromEntries(Object.entries(e.rows).map(([k,r])=>[k,r.filter(v=>v.mapped).length]));
 e.identicalHex=e.rows.linear.every((v,i)=>v.hex===e.rows.retained[i].hex);
 for(let i=0;i<labels.length;i++){
  const a=e.rows.linear[i],b=e.rows.retained[i];
  if(a.raw.l!==b.raw.l || a.raw.h!==b.raw.h) throw Error('Uncontrolled comparison');
  for(const v of [a,b]){
   if(v.raw.c>seed.c+1e-12 || !displayable(v.hex)) throw Error('Invalid sample');
   if(v.anchor&&v.hex!==e.hex) throw Error('Seed changed');
   if(e.neutral && !/^#([0-9a-f]{2})\1\1$/.test(v.hex)) throw Error('Tinted gray');
   if(i && v.raw.l>=e.rows[v===a?'linear':'retained'][i-1].raw.l) throw Error('Nondecreasing L');
  }
 }
}
const data={date:'2026-11-21',library:'Culori4.0.2',labels,assumptions:['Exact opaque sRGB seeds. Constant OKLCH hue; exact grayscale treated as C=0.','Same piecewise-linear lightness for both recipes. Light endpoint0.97; dark endpoint0.20.','Illustrative Auto: nearest reference lightness L=0.97-0.77*(step-50)/900; ties choose lighter step. All chosen seeds lie within endpoints.','t is normalized distance from the seed to the relevant endpoint using numeric step labels.','Endpoint chroma ratio e=0.05 on light side,0.15 on dark side. A: C=Cs*(e+(1-e)*(1-t)); B: C=Cs*(e+(1-e)*(1-t^2)).','Generated chroma never exceeds seed chroma. Both recipes retain identical endpoints and exact seed.','Out-of-sRGB samples use Culori clampChroma in OKLCH; * indicates mapping. Display values rounded to8-bit sRGB HEX.','This is a comparison, not accepted endpoints/taper/Auto/gamut policy; alpha and extreme seed cases are outside these samples.'],examples};
writeFileSync(new URL('./data.json',import.meta.url),JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify(examples.map(e=>({title:e.title,anchor:e.anchor,mapped:e.mappedCounts,identical:e.identicalHex})),null,2));
