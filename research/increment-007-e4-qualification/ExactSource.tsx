import {createContext,useContext,useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {Token} from '@domain/token';
import {Button} from '@presentation/components/button';
import * as source from './client';
export const ReviewContext=createContext({preparation:'complete',revision:1,tokenIds:[] as string[]});
type State={kind:'closed'|'preparing'|'failure'}|{kind:'complete';text:string;metrics:source.Metrics;revision:number};
export let lastMetrics:source.Metrics|undefined;
export function ExactSource({token}:{token:Token}){
 const {preparation,revision,tokenIds}=useContext(ReviewContext);const [state,setState]=useState<State>({kind:'closed'});
 const details=useRef<HTMLDetailsElement>(null),summary=useRef<HTMLElement>(null),attempt=useRef(0),generation=useRef(0);
 useLayoutEffect(()=>{source.select();generation.current++;attempt.current=0;setState({kind:'closed'});if(details.current)details.current.open=false;},[token.id,revision,preparation]);
 useEffect(()=>()=>{generation.current++;source.select();},[]);
 useLayoutEffect(()=>{if(state.kind==='complete'){
  state.metrics.mounted=performance.now();const current=generation.current;
  requestAnimationFrame(()=>requestAnimationFrame(()=>{if(current===generation.current&&details.current?.open){state.metrics.painted=performance.now();lastMetrics=state.metrics;}}));
 }},[state]);
 function prepare(){
  const current=++generation.current;setState({kind:'preparing'});lastMetrics=undefined;
  const fail=preparation==='fail-once'&&attempt.current++===0;
  source.open(tokenIds.indexOf(token.id),fail,(text,metrics)=>{
   if(current!==generation.current||!details.current?.open)return;
   setState({kind:'complete',text,metrics,revision});
  },()=>{if(current===generation.current&&details.current?.open)setState({kind:'failure'});});
 }
 return <div className="mt-4"><details ref={details} onToggle={e=>{if(e.currentTarget.open)prepare();else{generation.current++;lastMetrics=undefined;source.invalidate();setState({kind:'closed'});}}}>
  <summary ref={summary} onClick={()=>{if(details.current?.open){generation.current++;lastMetrics=undefined;source.invalidate();}}} aria-describedby="authored-source-notice" className="cursor-pointer text-caption focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">All authored data</summary>
  <div className="pt-3"><p className="text-caption text-muted-foreground mb-2">Applied token · Revision {state.kind==='complete'?state.revision:revision} · Read only</p>
   <div role="status" aria-live="polite" className="text-caption">{state.kind==='preparing'&&<p className="text-muted-foreground py-2">Preparing authored data…</p>}{state.kind==='failure'&&<p className="text-destructive">Authored data unavailable. Applied data and drafts are unchanged.</p>}{state.kind==='complete'&&<p className="text-muted-foreground mb-2">Complete authored source</p>}</div>
   {state.kind==='failure'&&<Button className="mt-3" onClick={()=>{summary.current?.focus();prepare();}}>Retry authored data</Button>}
   {state.kind==='complete'&&<pre data-source="complete" tabIndex={0} aria-label="Complete applied authored data, read only" className="authored-source text-caption border border-border rounded-md bg-background p-3 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">{state.text}</pre>}
  </div></details><p id="authored-source-notice" className="text-caption text-muted-foreground mt-2">Opening very large exact source may briefly pause this view.</p></div>;
}
