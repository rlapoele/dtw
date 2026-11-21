// Exploration only. Run from repository root: node output/color-ramp-interpolation-v1/generate.mjs
import { converter, interpolate, clampChroma, displayable, formatHex } from 'culori';
import { writeFileSync } from 'node:fs';
const lch = converter('oklch');
const labels = [50,100,200,300,400,500,600,700,800,900,950];
const examples = [
 {title:'One blue seed',seeds:[{step:500,hex:'#3b82f6'}]},
 {title:'Two related-hue seeds',seeds:[{step:300,hex:'#38bdf8'},{step:700,hex:'#4f46e5'}]},
 {title:'Two contrasting-hue seeds',seeds:[{step:300,hex:'#f59e0b'},{step:700,hex:'#2563eb'}]},
];
for (const example of examples) {
 const first=lch(example.seeds[0].hex), last=lch(example.seeds.at(-1).hex);
 const anchors=[{step:50,color:{mode:'oklch',l:.97,c:.015,h:first.h}},...example.seeds.map(s=>({...s,color:lch(s.hex)})),{step:950,color:{mode:'oklch',l:.20,c:.03,h:last.h}}];
 example.targets={light:anchors[0].color,dark:anchors.at(-1).color};
 example.rows={};
 for (const space of ['oklab','oklch']) {
  example.rows[space]=labels.map(step=>{
   const seed=example.seeds.find(s=>s.step===step);
   let raw;
   if(seed) raw=lch(seed.hex);
   else {
    const right=anchors.findIndex(a=>a.step>=step);
    if(right===0) raw=anchors[0].color;
    else {const a=anchors[right-1], b=anchors[right]; raw=interpolate([a.color,b.color],space)((step-a.step)/(b.step-a.step));}
   }
   const mapped=!seed && !displayable(raw);
   const shown=seed ? seed.hex : formatHex(mapped?clampChroma(raw,'oklch','rgb'):raw);
   return {step,hex:shown,seed:!!seed,mapped,raw,rawOklch:lch(raw),displayOklch:lch(shown)};
  });
 }
 example.identicalHex=example.rows.oklab.every((x,i)=>x.hex===example.rows.oklch[i].hex);
 example.mappedCounts=Object.fromEntries(Object.entries(example.rows).map(([s,rows])=>[s,rows.filter(r=>r.mapped).length]));
 // Essential exploration checks only.
 for(const seed of example.seeds) for(const space of ['oklab','oklch']) if(example.rows[space].find(r=>r.step===seed.step).hex!==seed.hex) throw Error('Anchor changed');
 for(let i=0;i<labels.length;i++) if(Math.abs(example.rows.oklab[i].rawOklch.l-example.rows.oklch[i].rawOklch.l)>1e-7) throw Error('Unequal lightness');
}
const data={date:'2026-11-21',library:'Culori 4.0.2',labels,assumptions:['Opaque sRGB seeds; manual anchor positions, no Auto-placement algorithm.','Linear piecewise interpolation using numeric step-label positions, not equal array-index spacing.','OKLCH uses the shortest hue arc (Culori default); OKLab interpolates Cartesian components.','Shared outer targets: L=0.97/C=0.015 with first seed hue; L=0.20/C=0.03 with last seed hue. These are illustrative recipe choices.','Exact seed HEX preserved. Out-of-sRGB generated samples use Culori clampChroma in OKLCH; star marks affected swatches. Display is 8-bit sRGB HEX.','No alpha interpolation, algorithm selection, production precision contract or ramp implementation.'],examples};
writeFileSync(new URL('./data.json',import.meta.url),JSON.stringify(data,null,2)+'\n');
console.log(JSON.stringify(examples.map(e=>({title:e.title,identicalHex:e.identicalHex,mappedCounts:e.mappedCounts,midpoints:Object.fromEntries(Object.entries(e.rows).map(([k,r])=>[k,r.find(v=>v.step===500)]))})),null,2));
