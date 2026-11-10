import {snapshot} from './fixtures.mjs';
import type {ProjectSnapshot} from '@application/project-storage';
import {inheritedProperties,sizingProperties,specimenStyles} from './sizing.mjs';
const properties=[...new Set([...inheritedProperties,'background-color','display','-webkit-box-orient','-webkit-line-clamp','overflow','overflow-x','overflow-y','box-sizing',...sizingProperties,'padding-top','padding-right','padding-bottom','padding-left','margin-top','margin-right','margin-bottom','margin-left','border-top-width','border-right-width','border-bottom-width','border-left-width','border-top-style','border-right-style','border-bottom-style','border-left-style'])];
type NodeSpec={tag:string;classes:string;inline:string;resolved:Record<string,string>;children:NodeSpec[];text?:string};
type RecordValue={tag:string;classes:string;style:Record<string,string>;box:Record<string,number>;text:string|null;inlineCSS:string;sizing:Record<string,string>;context:unknown;cascade:unknown};
type Spec={kind:string;width:number;nodes:NodeSpec[];baseline:RecordValue[];inspectorMaxWidth?:string};
const root=document.getElementById('root')!;
function authoredInspectorMaxWidth(e:Element){const candidates=(cascade(e) as {selector:string;style:string}[]).filter(r=>r.selector==='.inspector-heading p').map(r=>{const s=document.createElement('div').style;s.cssText=r.style;return s.maxWidth;}).filter(Boolean);if(candidates.length!==1||candidates[0]!=='285px')throw Error('Unreviewed inspector authored maximum');return candidates[0];}
// Raw matching rule declarations + all enclosing group conditions; container matching
// is recorded rather than guessed. Actual resolved values and ancestor context are separate.
function cascade(e:Element){const rules:unknown[]=[];function walk(list:CSSRuleList,conditions:string[]){for(const r of Array.from(list)){if(r instanceof CSSStyleRule){if(e.matches(r.selectorText))rules.push({selector:r.selectorText,style:r.style.cssText,conditions});}else if('cssRules'in r)walk((r as CSSGroupingRule).cssRules,[...conditions,r.cssText.split('{')[0].trim()]);}}for(const sheet of Array.from(document.styleSheets))walk(sheet.cssRules,[]);return rules;}
function context(e:Element){const p=e.parentElement!;return {parentTag:p.tagName,parentClasses:p.className,parentDisplay:getComputedStyle(p).display,ancestors:Array.from((function*(n:Element|null){while(n){const s=getComputedStyle(n);yield {tag:n.tagName,classes:n.className,display:s.display,containerType:s.containerType,containerName:s.containerName,width:n.getBoundingClientRect().width};n=n.parentElement;}})(p))};}
function sizing(e:Element){
 // Obtain specified sizing keywords without converting computed used pixels into authored
 // constraints. The cascade is retained independently for audit. Any matching non-default
 // height declaration is rejected by offline/current-source checks and the live guard.
 const result:Record<string,string>={height:'auto','min-height':'auto','max-height':'none'};
 const vertical=['height','min-height','max-height','block-size','min-block-size','max-block-size'];
 if(getComputedStyle(e).writingMode!=='horizontal-tb')throw Error('Unreviewed writing mode');
 const declarations=cascade(e) as {style:string;selector:string;conditions:string[]}[];
 for(const d of declarations){const s=document.createElement('div').style;s.cssText=d.style;for(const p of vertical)if(s.getPropertyValue(p))throw Error('Unexpected authored vertical sizing rule '+d.selector+': '+p);}
 const inline=(e as HTMLElement).style;for(const p of vertical)if(inline.getPropertyValue(p))throw Error('Unexpected inline vertical sizing: '+p);
 return result;
}
function record(e:Element):RecordValue {const c=getComputedStyle(e),r=e.getBoundingClientRect();return {tag:e.tagName.toLowerCase(),classes:e.className,style:Object.fromEntries(properties.map(p=>[p,c.getPropertyValue(p)])),box:{width:r.width,height:r.height,clientWidth:e.clientWidth,clientHeight:e.clientHeight,scrollWidth:e.scrollWidth,scrollHeight:e.scrollHeight},text:e.textContent,sizing:sizing(e),inlineCSS:(e as HTMLElement).style.cssText,context:context(e),cascade:cascade(e)};}
function node(e:Element):NodeSpec {return {tag:e.tagName.toLowerCase(),classes:e.className,inline:e.getAttribute('style')??'',resolved:record(e).style,children:Array.from(e.children).map(node),...(e.children.length?{}:{text:e.textContent??''})};}
function targets(kind:string):Element[]{if(kind==='inspector')return [document.querySelector('.inspector-heading p')!];const row=document.querySelector('.token-row')!;return [row.querySelector('.token-identity > span')!,row.querySelector(':scope > span:nth-child(2)')!];}
function flatten(es:Element[]):Element[]{return es.flatMap(e=>[e,...Array.from(e.querySelectorAll('*'))]);}
function surfaces(){return document.querySelector('[data-specimen]')?Array.from(document.querySelector('[data-specimen]')!.children):targets(currentKind);}
let currentKind='wide',prepared='';
async function digest(s:string){return [...new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(s)))].map(b=>b.toString(16).padStart(2,'0')).join('');}
function make(s:NodeSpec,kind:string,index:number):HTMLElement {const e=document.createElement(s.tag);e.className=s.classes;for(const [k,v]of Object.entries(specimenStyles(s,kind,index)))e.style.setProperty(k,v as string);for(const c of s.children)e.append(make(c,kind,2));if(s.text!==undefined)e.textContent=s.text;return e;}
function replace(text:string){for(const e of flatten(surfaces()).filter(e=>e.children.length===0))e.textContent=text;}
async function painted(id:string){performance.mark(id+'-dom-complete');await new Promise<void>(ok=>requestAnimationFrame(()=>requestAnimationFrame(()=>{performance.mark(id+'-painted');ok();})));}
function measure(){return flatten(surfaces()).map(record);}
declare global {interface Window {isolation:{capture:(kind:string)=>Spec;install:(s:Spec)=>void;control:(id:string,s?:Spec)=>Promise<unknown>;prepare:()=>Promise<unknown>;mount:(id:string)=>Promise<unknown>;measure:()=>RecordValue[];environment:()=>unknown}}}
window.isolation={
 capture(kind){currentKind=kind;const es=targets(kind),active=kind==='inspector'?es[0]:kind==='wide'?es[1]:es[0];const width=active.getBoundingClientRect().width;if(!width)throw Error('Active surface has no used width');return {kind,width,nodes:es.map(node),baseline:flatten(es).map(record),...(kind==='inspector'?{inspectorMaxWidth:authoredInspectorMaxWidth(es[0])}:{})};},
 install(s){currentKind=s.kind;root.replaceChildren();const block=document.createElement('div');block.dataset.specimen=s.kind;block.style.width=s.width+'px';
 // Inspector paragraph keeps its authored selector context, without heading ancestry:
 // the matching .inspector-heading p maximum-width rule is
 // copied as its original authored max-width; inherited typography is explicit.
 for(const [i,n]of s.nodes.entries()){const e=make(n,s.kind,i);if(s.kind==='inspector'){if(!s.inspectorMaxWidth)throw Error('Missing authored inspector max-width');e.style.maxWidth=s.inspectorMaxWidth;}block.append(e);}root.append(block);},
 async control(id,s){performance.mark(id+'-activation');if(s)window.isolation.install(s);const original=surfaces().map(e=>e.textContent!);const baseline=measure();performance.mark(id+'-baseline-measured');replace('One');await painted(id+'-one');const one=measure();performance.mark(id+'-one-measured');replace('First line\nSecond line\nThird line');await painted(id+'-multi');const multi=measure();performance.mark(id+'-multi-measured');for(const [i,e]of surfaces().entries())for(const leaf of flatten([e]).filter(e=>!e.children.length))leaf.textContent=original[i];await painted(id);return {baseline,one,multi};},
 async prepare(){const begin=performance.now();const fixture=snapshot('65535') as unknown as ProjectSnapshot;prepared=fixture.tokens[0].description!;const constructed=performance.now();const sha256=await digest(prepared);return {rawUnits:prepared.length,sha256,constructionMs:constructed-begin,verificationMs:performance.now()-constructed,completePrettyUnits:JSON.stringify(fixture.tokens[0],null,2).length};},
 async mount(id){performance.mark(id+'-activation');replace(prepared);performance.mark(id+'-dom-complete');const leaves=flatten(surfaces()).filter(e=>e.children.length===0),equality=leaves.map(e=>e.textContent===prepared);await new Promise<void>(ok=>requestAnimationFrame(()=>requestAnimationFrame(()=>{performance.mark(id+'-painted');ok();})));return {equality,domUnits:leaves.map(e=>e.textContent!.length),domSha256:await Promise.all(leaves.map(e=>digest(e.textContent!))),leaves:leaves.length};},
 measure,
 environment(){return {ua:navigator.userAgent,dpr:devicePixelRatio,viewport:{width:innerWidth,height:innerHeight},visualViewportScale:visualViewport?.scale,fontsStatus:document.fonts.status,fontCheck:document.fonts.check('11px Inter'),bodyFont:getComputedStyle(document.body).fontFamily};}
};
