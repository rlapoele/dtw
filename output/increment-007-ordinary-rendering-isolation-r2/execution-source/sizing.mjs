// Policy applies to emitted inline styles, never to observation. Resolved sizing/display
// stays evidence only: computed pixel heights and legacy display serialization cannot
// replace the authored automatic height or -webkit-box clamp.
export const inheritedProperties=['font-family','font-size','font-weight','font-style','font-stretch','font-variant','font-kerning','font-feature-settings','font-variation-settings','font-synthesis','line-height','letter-spacing','word-spacing','white-space','overflow-wrap','word-break','hyphens','text-transform','text-indent','text-align','text-rendering','text-wrap-mode','text-wrap-style','direction','writing-mode','color'];
export const sizingProperties=['width','height','min-width','max-width','min-height','max-height','inline-size','block-size','min-inline-size','max-inline-size','min-block-size','max-block-size'];
export function specimenStyles(node,kind,index){
 if(node.inline)throw Error('Unexpected original inline declaration: review rather than overwrite');
 const styles=Object.fromEntries(inheritedProperties.map(p=>[p,node.resolved[p]]));
 // Original container-query visibility is translated to its AUTHORED display declaration.
 // Other classes and the complete original inner clamp remain on their original nodes.
 if(kind!=='inspector'&&index===0)styles.display=kind==='wide'?'none':'-webkit-box';
 if(kind!=='inspector'&&index===1)styles.display=kind==='wide'?'block':'none';
 assertInlinePolicy(styles,kind,index);return styles;
}
export function assertInlinePolicy(styles,kind,index){
 for(const p of sizingProperties)if(p in styles)throw Error('Resolved sizing must not become an inline constraint: '+p);
 for(const p of Object.keys(styles))if(!inheritedProperties.includes(p)&&!(p==='display'&&kind!=='inspector'&&index<2))throw Error('Unsupported structural override: '+p);
 if(styles.display!==undefined&&styles.display!==(index===0?(kind==='wide'?'none':'-webkit-box'):(kind==='wide'?'block':'none')))throw Error('Responsive display must preserve authored clamp/visibility');
}
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
export function compareRecords(original,leaf,kind){
 const differences=[],explained=[];
 if(original.length!==leaf.length)return {pass:false,differences:['Node count'],explained};
 original.forEach((o,i)=>{
  const l=leaf[i];
  for(const p of Object.keys(o.style))if(o.style[p]!==l.style[p]){
   const automatic=o.sizing.height==='auto'&&l.sizing.height==='auto'&&o.sizing['min-height']==='auto'&&l.sizing['min-height']==='auto';
   const expected=kind==='wide'&&i===1&&['min-height','min-block-size'].includes(p)&&o.style['writing-mode']==='horizontal-tb'&&l.style['writing-mode']==='horizontal-tb'&&o.style[p]==='auto'&&l.style[p]==='0px'&&o.context.parentDisplay==='grid'&&l.context.parentDisplay==='block'&&automatic&&same(o.box,l.box)&&same(o.sizing,l.sizing);
   (expected?explained:differences).push({node:i,property:p,original:o.style[p],leaf:l.style[p],...(expected?{reason:'Preserved authored auto; grid item to block automatic minimum resolution; geometry/growth separately required'}:{})});
  }
  for(const p of ['box','text','tag','classes','sizing'])if(!same(o[p],l[p]))differences.push({node:i,property:p,original:o[p],leaf:l[p]});
 });
 return {pass:differences.length===0,differences,explained};
}
export function growthCheck(stages,kind){
 const active=kind==='wide'?2:0,one=stages.one[active],multi=stages.multi[active];
 if(!one||!multi)return {pass:false,reason:'Missing growth records'};
 const line=Number.parseFloat(one.style['line-height']),lines=kind==='inspector'?3:2;
 const failures=[];
 if(one.text!=='One'||multi.text!=='First line\nSecond line\nThird line')failures.push('Exact modest text');
 if(!(line>0)||Math.abs(one.box.height-line)>0.05||Math.abs(multi.box.height-line*lines)>0.05)failures.push('Natural one-to-multi line height/clamp');
 if(!(multi.box.height>one.box.height))failures.push('Height did not grow');
 if(kind!=='inspector'&&(one.style['-webkit-line-clamp']!=='2'||multi.style['-webkit-line-clamp']!=='2'||one.style.overflow!=='hidden'||multi.style.overflow!=='hidden'))failures.push('Two-line authored clamp missing');
 // Every node must retain authored sizing and text independent of the used pixel height.
 for(const name of ['baseline','one','multi'])for(const n of stages[name]??[])if(n.sizing.height!=='auto'||n.sizing['min-height']!=='auto'||n.sizing['max-height']!=='none')failures.push(name+': Unsupported authored vertical constraint');
 if(kind==='wide'&&Math.abs(stages.multi[1].box.height-multi.box.height)>0.05)failures.push('Wide wrapper failed natural child growth');
 return {pass:failures.length===0,failures,lineHeight:line,oneHeight:one.box.height,multiHeight:multi.box.height,expectedLines:lines};
}
export function compareControl(original,leaf,kind){
 const stages=Object.fromEntries(['baseline','one','multi'].map(k=>[k,compareRecords(original[k],leaf[k],kind)]));
 const originalGrowth=growthCheck(original,kind),leafGrowth=growthCheck(leaf,kind);
 return {pass:Object.values(stages).every(v=>v.pass)&&originalGrowth.pass&&leafGrowth.pass,stages,originalGrowth,leafGrowth};
}
