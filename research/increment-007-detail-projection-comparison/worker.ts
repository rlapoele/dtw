import {makeFixture} from '../increment-007-rendering-qualification/fixtures.mjs';
import {createAuthoringOperations} from '@application/authoring';
import type {ProjectReadback,TokenInspection} from '@application/authoring';
import type {ProjectSnapshot} from '@application/project-storage';
import {identityLabels,pathLabel,resolvedColor} from '@presentation/readback';
import {eligible} from '@presentation/session';
import {colorPreview} from '@presentation/preview';
import {nextFrame} from './transport.mjs';
import type {RowData,SelectedEditor,Summary,Value,Derived,Context} from './projections';
let snapshot:ProjectSnapshot,project:ProjectReadback,labels:Map<string,string>,groups:Map<string,string>,context:Context;
let serial=0;const active=new Map<string,{handle:number;text:string;context:Context;records?:Map<number,{text:string;next?:number}>}>();
const operations=createAuthoringOperations({load:()=>({status:'ok',value:snapshot}),commit:()=>{throw Error('read-only comparison');}});
function current(c:Context){return JSON.stringify(c)===JSON.stringify(context);}
function inspect(id:string):TokenInspection {const r=operations.inspectToken(snapshot.project.id,id);if(r.status!=='ok')throw Error(JSON.stringify(r.error));return r.value;}
function summary(value:Value|undefined):Summary {
 if(value?.kind==='token-reference')return {kind:'reference',label:labels.get(value.targetTokenId)??'Missing target'};
 if(value?.kind==='literal'&&value.valueType==='color')return {kind:'color',value};
 return {kind:'other',text:value?.kind??'No assignment'};
}
function preview(id:string){const t=project.tokens.find(t=>t.authored.id===id)!;return t.authored.definition?.type==='color'?colorPreview(resolvedColor(inspect(id))):colorPreview(undefined);}
function rows(query:string,group:{kind:'all'}|{kind:'root'}|{kind:'group';id:string}):RowData[]{
 return project.tokens.filter(t=>labels.get(t.authored.id)!.toLowerCase().includes(query.toLowerCase())&&(group.kind==='all'||(group.kind==='root'?t.authored.parentGroupId===null:t.authored.parentGroupId===group.id))).map(({authored:t})=>({id:t.id,label:labels.get(t.id)!,description:t.description,layer:t.layer,type:t.definition?.type,summary:summary(t.definition?.assignments[0]?.value),preview:preview(t.id)}));
}
function editor(id:string):SelectedEditor {
 const t=project.tokens.find(t=>t.authored.id===id)?.authored;if(!t)throw Error('Selected token removed');
 const applicable=project.tokens.filter(t=>t.authored.definition?.type==='color'),rl=identityLabels(applicable,undefined,t.id),v=t.definition?.assignments[0]?.value;
 return {id:t.id,label:labels.get(t.id)!,description:t.description,layer:t.layer,type:t.definition?.type,semanticRole:t.semanticRole,regeneration:t.authoring.regeneration,parentLabel:t.parentGroupId===null?'Project root':groups.get(t.parentGroupId)??'Missing group',editable:eligible(t),baseline:eligible(t)?v:undefined,summary:summary(v),preview:preview(t.id),references:applicable.map(t=>({id:t.authored.id,label:rl.get(t.authored.id)!}))};
}
function derived(id:string):Derived {
 // This isolated first risk gate handles literal/reference chains only. No expression
 // or composite is passed to the uninstrumented resolver; Stage B F-5 remains open.
 const seen=new Set<string>();let next:string|undefined=id;
 while(next!==undefined){if(seen.has(next))break;seen.add(next);if(seen.size>10000)return {status:'unavailable',reason:'Evaluation unavailable: step budget'};
 const t=project.tokens.find(t=>t.authored.id===next)?.authored;const v=t?.definition?.assignments[0]?.value;
 if(v&&v.kind!=='literal'&&v.kind!=='token-reference')return {status:'unavailable',reason:'Comparison guard does not qualify expression/composite evaluation'};
 next=v?.kind==='token-reference'?v.targetTokenId:undefined;}
 const r=inspect(id).resolution;
 const traces=r.trace.map(s=>({label:project.tokens.find(t=>t.authored.id===s.tokenId)?pathLabel(project.tokens.find(t=>t.authored.id===s.tokenId)!.path):s.tokenId,id:s.tokenId,target:s.targetTokenId}));
 return {status:'ready',resolved:r.status==='resolved'?JSON.stringify(r.value,null,2):undefined,reason:r.status==='unresolved'?r.reason:undefined,trace:traces,diagnostics:JSON.stringify(r.diagnostics,null,2)};
}
self.onmessage=({data:x})=>{try{
 if(x.op==='load'){
  active.clear();context=x.context;const f=makeFixture(x.kind);snapshot=f.snapshot as unknown as ProjectSnapshot;
  const r=operations.readProject(snapshot.project.id);if(r.status!=='ok')throw Error(JSON.stringify(r.error));project=r.value;labels=identityLabels(project.tokens);groups=identityLabels(project.groups,['Project root','All tokens']);
  self.postMessage({id:x.id,value:{kind:x.kind,counts:f.counts,tokens:project.tokens.length,groups:project.groups.length,rawUnits:x.kind==='raw'?JSON.stringify(snapshot.tokens[0],null,2).length:undefined}});return;
 }
 if(!current(x.context))throw Error('Obsolete context');
 if(x.op==='release'){active.delete(x.surface);self.postMessage({id:x.id,value:{released:true}});return;}
 if(x.op==='stats'){self.postMessage({id:x.id,value:{active:[...active.keys()],units:[...active.values()].reduce((n,r)=>n+r.text.length,0)}});return;}
 if(x.op==='frame'){
  const r=active.get(x.surface);if(!r||r.handle!==x.handle||!current(r.context))throw Error('Obsolete result');
  const record=r.records?.get(x.item??r.handle);const text=record?.text??r.text;const frame=nextFrame(text,x.offset,{request:x.id,view:x.context.result,item:x.item??r.handle});self.postMessage({id:x.id,value:{...frame,next:frame.complete?record?.next:undefined}});return;
 }
 let value:unknown;
 if(x.op==='rows'){
 const list=rows(x.query??'',x.group??{kind:'all'}),handles=list.map(()=>++serial),records=new Map(handles.map((h,i)=>[h,{text:JSON.stringify(list[i]),next:handles[i+1]}]));
 const handle=handles[0]??++serial;active.set(x.surface,{handle,text:'',records,context});self.postMessage({id:x.id,value:{handle,count:list.length,context}});return;
 }
 else if(x.op==='navigation')value={project:project.project.name,groups:project.groups.map(g=>({id:g.authored.id,label:groups.get(g.authored.id),path:g.path})),parentChoices:project.groups.map(g=>({id:g.authored.id,label:groups.get(g.authored.id)})),allContent:[...project.groups.map(g=>({kind:'group',id:g.authored.id,label:groups.get(g.authored.id),path:g.path})),...project.tokens.map(t=>({kind:'token',id:t.authored.id,label:labels.get(t.authored.id),path:t.path}))]};
 else if(x.op==='editor')value=editor(x.tokenId);
 else if(x.op==='preview')value=preview(x.tokenId);
 else if(x.op==='derived')value=derived(x.tokenId);
 else if(x.op==='raw'){const t=snapshot.tokens.find(t=>t.id===x.tokenId);if(!t)throw Error('Removed token');value=JSON.stringify(t,null,2);}
 else throw Error('Unknown named read');
 const text=JSON.stringify(value),handle=++serial;active.set(x.surface,{handle,text,context});
 self.postMessage({id:x.id,value:{handle,total:text.length,context}});
 }catch(e){self.postMessage({id:x.id,error:String(e)});}};
