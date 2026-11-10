import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {specimenStyles,assertInlinePolicy,compareControl,compareRecords,growthCheck} from './sizing.mjs';
const base='research/increment-007-ordinary-rendering-isolation-r2/';
test('computed pixel height/limits/display are evidence only, never cloned',()=>{
 const n={inline:'',resolved:{height:'16.5px','min-height':'auto','max-height':'none',display:'flow-root','font-size':'11px'}};
 const s=specimenStyles(n,'wide',2);assert.equal(s['font-size'],'11px');for(const p of ['height','min-height','max-height','display'])assert.equal(p in s,false);
 assert.throws(()=>assertInlinePolicy({...s,height:n.resolved.height},'wide',2),/Resolved sizing/);
 assert.throws(()=>assertInlinePolicy({...s,'min-height':'0px'},'wide',2),/Resolved sizing/);
 assert.throws(()=>specimenStyles({...n,inline:'height:16.5px'},'wide',2),/Unexpected original/);
});
test('responsive translation retains authored legacy-box clamp; computed flow-root forbidden',()=>{
 const n={inline:'',resolved:{display:'flow-root'}};
 assert.equal(specimenStyles(n,'compact',0).display,'-webkit-box');assert.equal(specimenStyles(n,'wide',0).display,'none');assert.equal(specimenStyles(n,'wide',1).display,'block');assert.equal(specimenStyles(n,'compact',1).display,'none');assert.equal(specimenStyles(n,'compact',2).display,undefined);
 assert.throws(()=>assertInlinePolicy({display:'flow-root'},'compact',0),/authored clamp/);
});
const rec=(height,text,outer=false)=>({tag:'span',classes:outer?'hidden @3xl:block min-w-0 text-caption text-secondary':'line-clamp-2 whitespace-pre-wrap wrap-anywhere',style:{'writing-mode':'horizontal-tb',height:height+'px','min-height':'0px','line-height':'16.5px','-webkit-line-clamp':'2',overflow:'hidden'},box:{width:284,height},text,sizing:{height:'auto','min-height':'auto','max-height':'none'},context:{parentDisplay:'block'}});
const stages=()=>Object.fromEntries([['baseline',16.5,'Small editable synthetic source'],['one',16.5,'One'],['multi',33,'First line\nSecond line\nThird line']].map(([k,h,t])=>[k,[{...rec(0,t),style:{...rec(0,t).style,display:'none'}},rec(h,t,true),rec(h,t)]]));
test('only exact wide grid auto → block 0px is explained; geometry and authoring stay strict',()=>{
 const leaf=stages();for(const arr of Object.values(leaf))arr[1].style['min-block-size']='0px';const original=structuredClone(leaf);for(const arr of Object.values(original)){arr[1].style['min-height']='auto';arr[1].style['min-block-size']='auto';arr[1].context.parentDisplay='grid';}
 assert.equal(compareControl(original,leaf,'wide').pass,true);
 for(const k of ['height','min-height','max-height']){const bad=structuredClone(leaf);bad.multi[1].sizing[k]='33px';assert.equal(compareControl(original,bad,'wide').pass,false);}
 const bad=structuredClone(leaf);bad.multi[1].box.height=16.5;assert.equal(compareControl(original,bad,'wide').pass,false);
 assert.equal(compareRecords(original.baseline,leaf.baseline,'compact').pass,false);const vertical=structuredClone(leaf.baseline);vertical[1].style['writing-mode']='vertical-rl';assert.equal(compareRecords(original.baseline,vertical,'wide').pass,false);
 const wrong=structuredClone(leaf.baseline);wrong[1].style['min-height']='1px';assert.equal(compareRecords(original.baseline,wrong,'wide').pass,false);
 const context=structuredClone(leaf.baseline);context[1].context.parentDisplay='flex';assert.equal(compareRecords(original.baseline,context,'wide').pass,false);
});
test('fixed-height mutant passes small baseline but fails modest natural growth guard',()=>{
 const correct=stages(),mutant=structuredClone(correct);mutant.multi[1].box.height=16.5;mutant.multi[2].box.height=16.5;mutant.multi[1].style.height='16.5px';mutant.multi[2].style.height='16.5px';
 assert.equal(compareRecords(correct.baseline,mutant.baseline,'wide').pass,true);assert.equal(growthCheck(mutant,'wide').pass,false);assert.equal(compareControl(correct,mutant,'wide').pass,false);
 const unclamped=structuredClone(correct);unclamped.multi[2].box.height=49.5;assert.equal(growthCheck(unclamped,'wide').pass,false);
});
test('modest multiline safeguard really contains exactly three lines',()=>{const text=stages().multi[2].text;assert.equal(text.split('\n').length,3);assert.equal(text.includes('\\n'),false);});
test('inspector grows to three unclamped lines',()=>{
 const s=Object.fromEntries(['baseline','one','multi'].map(k=>[k,[stages()[k][2]]]));s.multi[0].box.height=49.5;assert.equal(growthCheck(s,'inspector').pass,true);s.multi[0].box.height=16.5;assert.equal(growthCheck(s,'inspector').pass,false);
});
test('current markup retains complete variants and inspector; authored structural rules pinned',async()=>{
 const token=await readFile('src/presentation/features/workbench/components/TokenList.tsx','utf8'),editor=await readFile('src/presentation/features/workbench/components/Editor.tsx','utf8'),css=await readFile('src/presentation/styles/global.css','utf8');
 assert.ok(token.includes('@3xl:hidden mt-2 line-clamp-2 whitespace-pre-wrap wrap-anywhere text-caption text-secondary'));assert.ok(token.includes('hidden @3xl:block min-w-0 text-caption text-secondary"><span className="line-clamp-2 whitespace-pre-wrap wrap-anywhere"'));assert.ok(editor.includes('<p className="text-caption text-muted-foreground whitespace-pre-wrap wrap-anywhere">'));
 assert.match(css,/\.inspector-heading p\s*\{\s*max-width: 285px;/);
 const src=await readFile(base+'specimen.ts','utf8');assert.ok(!src.includes('e.style.setProperty(k,v);'));assert.ok(src.includes('specimenStyles(s,kind,index)'));
});
