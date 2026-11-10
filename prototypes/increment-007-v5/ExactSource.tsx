// Isolated design state simulation. No persistence, worker or qualification implementation.
import {createContext,useContext,useEffect,useLayoutEffect,useRef,useState} from 'react';
import type {Token} from '@domain/token';
import {Button} from '@presentation/components/button';
export type Preparation = 'complete'|'held'|'fail-once';
export const ReviewContext=createContext({preparation:'complete' as Preparation,revision:1});
type SourceState = {kind:'closed'|'preparing'|'failure'}|{kind:'complete';text:string;revision:number};
export function ExactSource({token}:{token:Token}) {
 const {preparation,revision}=useContext(ReviewContext);
 const [state,setState]=useState<SourceState>({kind:'closed'});
 const details=useRef<HTMLDetailsElement>(null),summary=useRef<HTMLElement>(null);
 const generation=useRef(0),attempt=useRef(0);
 useLayoutEffect(()=>{generation.current++;attempt.current=0;setState({kind:'closed'});if(details.current)details.current.open=false;},[token.id,revision,preparation]);
 useEffect(()=>()=>{generation.current++;},[]);
 function prepare(){
  const request=++generation.current,source=token,sourceRevision=revision;
  const shouldFail=preparation==='fail-once'&&attempt.current++===0;
  setState({kind:'preparing'});
  if(preparation==='held')return;
  // Small deliberate wait makes feedback reviewable; no performance claim.
  window.setTimeout(()=>{
   if(request!==generation.current||!details.current?.open)return;
   if(shouldFail){setState({kind:'failure'});return;}
   try{setState({kind:'complete',text:JSON.stringify(source,null,2),revision:sourceRevision});}
   catch{setState({kind:'failure'});}
  },900);
 }
 return <div className="mt-4">
  <details ref={details} onToggle={e=>{
   if(e.currentTarget.open){prepare();}
   else{generation.current++;setState({kind:'closed'});}
  }}>
   <summary ref={summary} aria-describedby="authored-source-notice" className="cursor-pointer text-caption focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">All authored data</summary>
   <div className="pt-3">
    <p className="text-caption text-muted-foreground mb-2">Applied token · Revision {state.kind==='complete'?state.revision:revision} · Read only</p>
    <div role="status" aria-live="polite" className="text-caption">
     {state.kind==='preparing'&&<p className="text-muted-foreground py-2">Preparing authored data…</p>}
     {state.kind==='failure'&&<p className="text-destructive">Authored data unavailable. Applied data and drafts are unchanged.</p>}
     {state.kind==='complete'&&<p className="text-muted-foreground mb-2">Complete authored source</p>}
    </div>
    {state.kind==='failure'&&<Button className="mt-3" onClick={()=>{summary.current?.focus();prepare();}}>Retry authored data</Button>}
    {state.kind==='complete'&&<pre tabIndex={0} aria-label="Complete applied authored data, read only" className="authored-source text-caption border border-border rounded-md bg-background p-3 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2">{state.text}</pre>}
   </div>
  </details>
  <p id="authored-source-notice" className="text-caption text-muted-foreground mt-2">Opening very large exact source may briefly pause this view.</p>
 </div>;
}
