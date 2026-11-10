import React,{memo,useCallback,useState} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Row} from './Row';
import {Editor} from './Editor';
import {nextFrame,appendFrame,sameContext,encodedBytes} from './transport.mjs';
import type {RowData,SelectedEditor,Derived,Context,Preview} from './projections';
import '@presentation/styles.css';import './comparison.css';
const worker=new Worker(new URL('./worker.ts',import.meta.url),{type:'module'});
let serial=0,result=0,current:Context,selection:string|undefined,selectionEpoch=0,rawEpoch=0,draftContext='',api:any;
const pending=new Map<number,{resolve:(v:any)=>void;reject:(e:Error)=>void}>(),surfaceEpoch=new Map<string,number>();
const events:any[]=[],frames:any[]=[],tasks:any[]=[];let renders=0;
worker.onmessage=({data:x})=>{const p=pending.get(x.id);pending.delete(x.id);if(!p)return;x.error?p.reject(Error(x.error)):p.resolve(x.value);};
function request(op:string,fields:object={}){return new Promise<any>((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});worker.postMessage({id,op,context:current,...fields});});}
const paint=()=>new Promise<void>(r=>requestAnimationFrame(()=>requestAnimationFrame(()=>r())));
try{new PerformanceObserver(l=>tasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask'});}catch{}
function valid(c:Context,surface:string,epoch:number,entity?:string,se?:number,dc?:string){return sameContext(c,current)&&surfaceEpoch.get(surface)===epoch&&(entity===undefined||selection===entity&&selectionEpoch===se)&&(dc===undefined||draftContext===dc);}
async function read(op:string,surface:string,fields:object={},entity?:string,dc?:string){
 const c=current,se=selectionEpoch,epoch=(surfaceEpoch.get(surface)??0)+1;surfaceEpoch.set(surface,epoch);
 const live=()=>valid(c,surface,epoch,entity,se,dc),t=performance.now();const head=await request(op,{...fields,surface});if(!live())return;
 let offset=0,parts:string[]=[];while(true){const f=await request('frame',{surface,handle:head.handle,offset});if(!live())return;
 frames.push({surface,bytes:encodedBytes(f),units:f.text.length});parts.push(f.text);offset+=f.text.length;if(f.complete)break;}
 if(!live())return;const value=JSON.parse(parts.join(''));parts=[];if(!live())return;await request('release',{surface});if(!live())return;
 events.push({op,surface,period:'preparation-transfer-assembly',ms:performance.now()-t});return {value,live};
}
const Block=memo(({rows,onSelect}:{rows:readonly RowData[];onSelect:(id:string)=>void})=><>{rows.map(t=>{renders++;return <Row key={t.id} t={t} onSelect={onSelect}/>;})}</>);
const noop=()=>{};const applyFailure=()=>({status:'failure',error:{code:'invalid-domain-input',message:'Read-only comparison injected failure; drafts retained.'}} as const);
function Harness(){const [blocks,setBlocks]=useState<readonly (readonly RowData[])[]>([]),[editor,setEditor]=useState<SelectedEditor>(),[raw,setRaw]=useState<string>(),[derived,setDerived]=useState<Derived>(),[targetPreview,setTargetPreview]=useState<Preview>(),[status,setStatus]=useState('Ready'),[query,setQuery]=useState('');
 const select=useCallback(async(id:string)=>{selection=id;selectionEpoch++;rawEpoch++;draftContext='';flushSync(()=>{setEditor(undefined);setRaw(undefined);setDerived(undefined);setTargetPreview(undefined);});const r=await read('editor','editor',{tokenId:id},id);if(!r?.live())return;flushSync(()=>{if(r.live())setEditor(r.value);});await paint();if(!r.live())return;events.push({op:'editor',period:'mount-paint',at:performance.now()});},[]);
 const requestRaw=useCallback(async()=>{const id=selection;if(id===undefined)return;const e=++rawEpoch;const r=await read('raw','raw',{tokenId:id},id);if(!r?.live()||e!==rawEpoch)return;flushSync(()=>{if(r.live()&&e===rawEpoch)setRaw(r.value);});await paint();if(!r.live()||e!==rawEpoch)return;events.push({op:'raw',period:'mount-paint',at:performance.now()});},[]);
 const requestDerived=useCallback(async()=>{const id=selection;if(id===undefined)return;const r=await read('derived','derived',{tokenId:id},id);if(r?.live())flushSync(()=>{if(r.live())setDerived(r.value);});},[]);
 const requestPreview=useCallback(async(id:string,dc:string)=>{draftContext=dc;const selected=selection;if(selected===undefined)return;setTargetPreview(undefined);const r=await read('preview','preview',{tokenId:id},selected,dc);if(r?.live())flushSync(()=>{if(r.live())setTargetPreview(r.value);});},[]);
 async function load(kind:string,q=''){
 current={worker:1,project:'p',incarnation:1,revision:1,result:++result};selection=undefined;selectionEpoch++;rawEpoch++;surfaceEpoch.clear();draftContext='';const c=current;
 flushSync(()=>{setBlocks([]);setEditor(undefined);setRaw(undefined);setDerived(undefined);setStatus('Preparing remaining results…');});
 const begin=performance.now(),startRenders=renders,startFrames=frames.length;const loaded=await request('load',{kind});if(!sameContext(c,current))return {obsolete:true};
 const head=await request('rows',{surface:'rows',query:q,group:{kind:'all'}});if(!sameContext(c,current))return {obsolete:true};let handle:number|undefined=head.handle,count=0,block:RowData[]=[],maxBlockBytes=0;
 while(count<head.count&&handle!==undefined){let offset=0,parts:string[]=[];let next:number|undefined;
  while(true){const f=await request('frame',{surface:'rows',handle:head.handle,item:handle,offset});if(!sameContext(c,current))return {obsolete:true};frames.push({surface:'rows',bytes:encodedBytes(f),units:f.text.length});parts.push(f.text);offset+=f.text.length;if(f.complete){next=f.next;break;}}
  if(!sameContext(c,current))return {obsolete:true};const row=JSON.parse(parts.join('')) as RowData;parts=[];
  // Complete canonical identity and all display fields exist before selectable mount.
  if(typeof row.id!=='string'||typeof row.label!=='string')throw Error('Incomplete row');
  block.push(row);count++;maxBlockBytes=Math.max(maxBlockBytes,encodedBytes(row));
  if(block.length===24||count===head.count){const immutable=Object.freeze(block);block=[];await paint();if(!sameContext(c,current))return {obsolete:true};flushSync(()=>{if(sameContext(c,current))setBlocks(old=>[...old,immutable]);});await paint();if(!sameContext(c,current))return {obsolete:true};}
  handle=next;
 }
 await request('release',{surface:'rows'});if(!sameContext(c,current))return {obsolete:true};flushSync(()=>setStatus('All results prepared'));await paint();if(!sameContext(c,current))return {obsolete:true};
 const value={...loaded,count,mounted:document.querySelectorAll('.token-row').length,rowRenders:renders-startRenders,totalMs:performance.now()-begin,maxLogicalRowBytes:maxBlockBytes,transport:frames.slice(startFrames)};
 if(value.count!==value.mounted||value.count!==value.rowRenders)throw Error('Invalid mount evidence');return value;
 }
 api={load,select,requestRaw,requestDerived,setQuery};
 return <><header><h1>Exact-detail / read-projection comparison</h1><p role="status">{status}</p><label>Search tokens <input value={query} onChange={e=>{setQuery(e.target.value);void load((window as any).comparison.kind,e.target.value);}}/></label></header><main className="comparison"><section className="list-pane" aria-label="Tokens"><div className="token-table @container border-t border-border"><div className="table-heading border-b border-border p-3 narrow:px-2 grid grid-cols-2 @3xl:grid-cols-3 gap-3 text-muted-foreground"><span>Token</span><span className="hidden @3xl:block">Description</span><span>Authored value</span></div>{blocks.map((rows,i)=><Block key={i} rows={rows} onSelect={select}/>)}</div></section><section className="editor-pane">{editor&&<Editor key={editor.id} data={editor} derived={derived} targetPreview={targetPreview} requestPreview={requestPreview} rawText={raw} requestRaw={requestRaw} requestDerived={requestDerived} onApply={applyFailure} onDirty={noop} onFeedback={noop} readUnavailable={false}/>}</section></main></>;
}
(window as any).comparison={ready:false,kind:'100',async load(kind:string){this.kind=kind;return api.load(kind);},select:(id:string)=>api.select(id),snapshot:()=>({current,selection,events,frames,tasks,renders,rows:document.querySelectorAll('.token-row').length}),stats:()=>request('stats')};
flushSync(()=>createRoot(document.querySelector('#root')!).render(<Harness/>));(window as any).comparison.ready=true;
