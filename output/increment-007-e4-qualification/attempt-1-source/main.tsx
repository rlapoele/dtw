import {createRoot} from 'react-dom/client';import {useState} from 'react';
import {App} from './App';import {ReviewContext,lastMetrics} from './ExactSource';import * as source from './client';
import {snapshot} from './fixtures.mjs';import {InMemoryProjectStorage} from '@adapters/in-memory-project-storage';import type {ProjectStorage,ProjectSnapshot} from '@application/project-storage';
import './prototype.css';
let change:((kind:string)=>Promise<unknown>)|undefined;
function Qualification(){
 const [run,setRun]=useState<{kind:string;storage:ProjectStorage;tokenIds:string[];key:number}|undefined>();const [revision,setRevision]=useState(1);const [mode,setMode]=useState('complete');
 change=async kind=>{
  source.select();const fixture=snapshot(kind) as unknown as ProjectSnapshot;const inner=new InMemoryProjectStorage([fixture]);
  await source.load(kind);setRevision(1);setMode('complete');
  const storage:ProjectStorage={load:id=>inner.load(id),commit:s=>{
   const before=inner.load(s.project.id),answer=inner.commit(s);
   if(answer.status==='ok'&&before.status==='ok'&&before.value){
    const previous=before.value;const changed=s.tokens.find(t=>t!==previous.tokens.find(v=>v.id===t.id));const value=changed?.definition?.assignments[0]?.value;
    if(changed&&value?.kind==='literal'&&value.valueType==='color')setRevision(source.appliedColor(changed.id,value));
   }return answer;
  }};
  setRun({kind,storage,tokenIds:fixture.tokens.map(t=>t.id),key:Date.now()});return {kind,tokens:fixture.tokens.length};
 };
 return <ReviewContext.Provider value={{preparation:mode,revision,tokenIds:run?.tokenIds??[]}}><div className="review-harness border-b border-border bg-muted px-4 py-2 flex items-center gap-4 text-xs"><strong>E-4 isolated qualification</strong><label>Requested failure <select aria-label="Requested failure" value={mode} onChange={e=>setMode(e.target.value)}><option value="complete">None</option><option value="fail-once">First read only</option></select></label></div><div className="review-product">{run&&<App key={run.key} storage={run.storage} initialProjectId="p"/>}</div></ReviewContext.Provider>;
}
createRoot(document.getElementById('root')!).render(<Qualification/>);
declare global{interface Window{e4:{load:(kind:string)=>Promise<unknown>;stats:typeof source.stats;metrics:()=>typeof lastMetrics;events:()=>unknown[];ready:boolean}}}
window.e4={load:kind=>change!(kind),stats:source.stats,metrics:()=>lastMetrics,events:()=>source.events,ready:true};
