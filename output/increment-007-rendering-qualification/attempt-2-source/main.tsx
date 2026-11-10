import React,{memo,Profiler,useState,useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import {flushSync} from 'react-dom';
import {Row} from './Row';
import {Editor} from './Editor';
import {TokenList} from '@presentation/TokenList';
import {colorPreview} from '@presentation/preview';
import '@presentation/styles.css';
import './qualification.css';
const worker=new Worker(new URL('./worker.ts',import.meta.url),{type:'module'});
let serial=0,generation=0,current:any,api:any,renderCount=0;
const pending=new Map<number,any>(),events:any[]=[],commits:any[]=[],tasks:any[]=[],frames:any[]=[];
worker.onmessage=({data:x})=>{const p=pending.get(x.id);pending.delete(x.id);if(!p)return;x.error?p.reject(Error(x.error)):p.resolve(x);};
function request(op:string,fields:any={}){return new Promise<any>((resolve,reject)=>{const id=++serial;pending.set(id,{resolve,reject});worker.postMessage({id,op,...fields});});}
try{new PerformanceObserver(l=>tasks.push(...l.getEntries().map(e=>({start:e.startTime,duration:e.duration})))).observe({type:'longtask'});}catch{}
let last=performance.now();function frame(t:number){frames.push({t,gap:t-last});last=t;requestAnimationFrame(frame);}requestAnimationFrame(frame);
const yieldPaint=()=>new Promise<void>(r=>requestAnimationFrame(()=>setTimeout(r,0)));
const onApply=()=>({status:'failure',error:{code:'invalid-domain-input',message:'Synthetic harness injected apply failure; drafts retained.'}} as const);
const noop=()=>{};
const MemoRow=memo((props:any)=>{renderCount++;return <Row {...props}/>;});
function Harness(){const [rows,setRows]=useState<any[]>([]),[status,setStatus]=useState('Loading tokens…'),[selection,setSelection]=useState<any>(),[raw,setRaw]=useState<string>(),[reference,setReference]=useState(false);
 api={setRows,setStatus,setSelection,setRaw,setReference};
 const select=useCallback(async(id:string)=>{const context=current,reply=await request('inspect',{tokenId:id});if(context!==current||JSON.stringify(reply.context)!==JSON.stringify(context))return;flushSync(()=>{setRaw(undefined);setSelection(reply.value);});},[]);
 const rawRequest=async()=>{if(raw!==undefined)return;const context=current,tokenId=selection.inspection.authored.id,t=performance.now(),reply=await request('raw',{tokenId});events.push({op:'raw-return',ms:performance.now()-t,codeUnits:reply.value.length});if(context!==current||selection.inspection.authored.id!==tokenId)return;flushSync(()=>setRaw(reply.value));events.push({op:'raw-commit',at:performance.now()});};
 (window as any).qual.select=select;
 return <><header><h1>G-01 isolated rendering qualification</h1><p role="status">{status}</p><button onClick={()=>setReference(!reference)}>Toggle unchanged TokenList control</button></header><main className="qualification"><section className="list-pane" aria-label="Tokens">{reference&&selection?<TokenList project={selection.project} visible={selection.project.tokens} selected={selection.inspection.authored.id} query="" inspect={()=>selection.inspection} onSelect={select} onEmptyAction={noop}/>:<div className="token-table @container border-t border-border"><div className="table-heading border-b border-border p-3 narrow:px-2 grid grid-cols-2 @3xl:grid-cols-3 gap-3 text-muted-foreground"><span>Token</span><span className="hidden @3xl:block">Description</span><span>Authored value</span></div>{rows.map(({t,label})=><MemoRow key={t.authored.id} t={t} label={label} selected={selection?.inspection.authored.id} preview={colorPreview(t.authored.definition?.assignments[0]?.value)} project={selection?.project} onSelect={select}/>)}</div>}</section><section className="editor-pane">{selection&&<Editor key={selection.inspection.authored.id} inspection={selection.inspection} project={selection.project} inspect={id=>selection.project.tokens.find((t:any)=>t.authored.id===id)?selection.inspection:undefined} onApply={onApply} onDirty={noop} onFeedback={noop} readUnavailable={false} rawText={raw} requestRaw={rawRequest}/>}</section></main></>;
}
const root=createRoot(document.querySelector('#root')!);
(window as any).qual={ready:false,events,commits,tasks,frames,get rowRenders(){return renderCount},async load(kind:string){const t=performance.now(),startTask=tasks.length,startFrame=frames.length,startCommit=commits.length;current={project:'p',revision:'r1',generation:++generation,worker:'w1'};const context=current;flushSync(()=>{api.setRows([]);api.setSelection(undefined);api.setStatus('Loading tokens…');});const loaded=await request('load',{kind,context});if(context!==current)return {obsolete:true};let offset=0;flushSync(()=>api.setStatus('Preparing remaining results…'));const batches=[];while(true){const a=performance.now(),r=await request('batch',{offset});if(context!==current||JSON.stringify(r.context)!==JSON.stringify(context))return {obsolete:true};flushSync(()=>api.setRows((old:any)=>[...old,...r.value.batch]));batches.push({rows:r.value.batch.length,bytes:r.value.bytes,roundtripCommitMs:performance.now()-a});offset+=r.value.batch.length;await yieldPaint();if(r.value.done)break;}flushSync(()=>api.setStatus('All results prepared'));await yieldPaint();return {...loaded.value,batches,totalMs:performance.now()-t,tasks:tasks.slice(startTask),frames:frames.slice(startFrame),commits:commits.slice(startCommit),nodes:document.querySelectorAll('*').length,textCodeUnits:document.body.textContent!.length,mounted:document.querySelectorAll('.token-row').length,memory:(performance as any).memory?.usedJSHeapSize??null};},snapshot(){return {events,commits,tasks,frames,rows:document.querySelectorAll('.token-row').length,rowRenders:renderCount}}};
flushSync(()=>root.render(<Profiler id="qualification" onRender={(id,phase,actual,base,start,commit)=>commits.push({id,phase,actual,base,start,commit})}><Harness/></Profiler>));
(window as any).qual.ready=true;
