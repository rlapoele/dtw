import React,{useEffect,useLayoutEffect,useRef,useState} from 'react';
import {Tabs} from '@base-ui/react/tabs';
import {ColorFields} from '@presentation/ColorFields';
import {AuthoredValue} from '@presentation/AuthoredValue';
import {InspectionTabs} from '@presentation/components/inspection-tabs';
import {Badge} from '@presentation/components/badge';
import {Button} from '@presentation/components/button';
import {Swatch} from '@presentation/components/swatch';
import {Field} from '@presentation/components/field';
import {Select} from '@presentation/Select';
import {identityLabels,resolvedColor} from '@presentation/readback';
import {colorPreview} from '@presentation/preview';
import {eligible} from '@presentation/session';
import type {DraftSession} from '@presentation/session';
import type {ProjectReadback,TokenInspection} from '@application/authoring';
import type {Token} from './specimens';
type Props={token:Token|undefined;project:ProjectReadback;inspection:TokenInspection|undefined;inspect:(id:string)=>TokenInspection|undefined;session:DraftSession;onSession:(s:DraftSession)=>void;blocked:boolean;pending:boolean;controls:boolean;focusRef:React.RefObject<HTMLElement|null>;review:React.ReactNode;actions:React.ReactNode;identity:React.ReactNode;scenario:string};
export function BaselineInspector({token,project,inspection,inspect,session,onSession,blocked,pending,controls,focusRef,review,actions,identity,scenario}:Props){
 const [tab,setTab]=useState('authored'),[fieldError,setFieldError]=useState('');
 const errorRef=useRef<HTMLParagraphElement>(null);
 const wrapper=useRef<HTMLFieldSetElement>(null),source=useRef<HTMLDetailsElement>(null);
 useEffect(()=>{if(fieldError)errorRef.current?.focus();},[fieldError]);
 const value=inspection?.authored.definition?.assignments[0]?.value;
 const applied=colorPreview(resolvedColor(inspection));
 const draft=session.mode==='literal'?session.byteInvalid?{message:'Unavailable: finish the incomplete byte entries.'}:colorPreview(session.literal):colorPreview(resolvedColor(inspect(session.reference)));
 const raw=JSON.stringify({literal:session.literal,referenceTargetId:session.reference,byteText:session.byteText},null,2);
 const labels=identityLabels(project.tokens);
 const groupLabels=identityLabels(project.groups,['Project root','All tokens']);
 const editable=inspection?eligible(inspection.authored):false;
 const choices=project.tokens.filter(t=>t.authored.definition?.type==='color');
 const referenceLabels=identityLabels(choices,undefined,token?.id);
 useLayoutEffect(()=>{const target=blocked?document.querySelector<HTMLElement>('[data-preserved-color-draft]'):wrapper.current?.querySelector<HTMLElement>('input:not([type=range]),select');focusRef.current=target??null;if(target)target.setAttribute('data-supplement-editor','');},[blocked,session.mode,tab,focusRef]);
 const title=token?(token.name.trim()===''?`${JSON.stringify(token.name)} (unnamed token)`:labels.get(token.id)??token.name):'Original token unavailable';
 return <>
  <div className="inspector-header flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-5"><span className="text-caption font-medium">Token inspector</span><section aria-label="Applied and draft color context" className="flex gap-4">{[['Applied',applied],...(tab==='authored'?[['Draft',draft]]:[])].map(([label,preview])=><div key={label as string} className="flex flex-col items-center gap-1 text-caption"><span>{label as string}</span><Swatch css={(preview as typeof applied).css}/><span className="sr-only">{(preview as typeof applied).message}</span></div>)}</section></div>
  <div className="inspector-heading"><span className="eyebrow uppercase text-muted-foreground font-semibold">{inspection?.authored.definition?.type??'Color'} token</span><h2 className="whitespace-pre-wrap wrap-anywhere">{title}</h2><p className="text-caption text-muted-foreground whitespace-pre-wrap wrap-anywhere">{token?.description??'Original input remains in this tab.'}</p><div className="flex flex-wrap gap-2 mt-3 mb-5"><Badge>{token?.layer??'Unspecified layer'}</Badge><Badge>{editable?'Unconditional':'Inspection only'}</Badge>{token?.semanticRole&&<Badge>{token.semanticRole}</Badge>}</div></div>
  <Tabs.Root value={tab} onValueChange={setTab}>
   <InspectionTabs/>
   <Tabs.Panel value="authored" className="pt-5">
    {review}
    {!editable&&<p className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4 mb-5">Inspection only: this token is outside the unconditional primitive/semantic color revision flow. Its data is retained.</p>}
    {controls&&<><div className="section-title flex items-center justify-between mb-5"><h3>Value</h3>{session.edited&&<Badge>Draft</Badge>}</div><fieldset disabled={blocked||pending}><legend>Value source</legend><div className="mode-switch border border-border bg-mode flex p-0.75 rounded-md gap-0.75 mb-5"><Button variant="mode" size="mode" aria-pressed={session.mode==='literal'} onClick={()=>onSession({...session,mode:'literal',edited:true})}>Literal color</Button><Button variant="mode" size="mode" aria-pressed={session.mode==='reference'} onClick={()=>onSession({...session,mode:'reference',edited:true})}>Reference</Button></div></fieldset>
     <fieldset ref={wrapper} disabled={blocked||pending} className="min-w-0 border-0 p-0">
      {session.mode==='literal'?<ColorFields session={session} onChange={s=>{onSession(s);setFieldError('');}} onError={setFieldError}/>:<><Field>Target token<Select value={session.reference} aria-describedby="reference-note editor-error" onChange={e=>onSession({...session,reference:e.target.value,edited:true})}><option value="__prototype-unchosen-reference__">Choose a color token…</option>{!choices.some(t=>t.authored.id===session.reference)&&<option value={session.reference}>Missing target · {JSON.stringify(session.reference)}</option>}{choices.map(t=><option key={t.authored.id} value={t.authored.id}>{referenceLabels.get(t.authored.id)}</option>)}</Select></Field><p id="reference-note" className="helper text-muted-foreground">Whole color value. Alias chains remain linked by identity; cycles are rejected on Apply.</p></>}
     </fieldset>
     <p className="helper text-muted-foreground mt-3">Draft preview: {draft.message}</p>
     {fieldError?<p ref={errorRef} id="editor-error" role="alert" tabIndex={-1} className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4">{fieldError}</p>:<span id="editor-error"/>}
     {blocked&&<label className="block text-caption mt-4">Preserved draft · read only<textarea data-preserved-color-draft readOnly className="source-text w-full mt-2 border border-border bg-background p-3" value={raw}/></label>}
     {actions}
    </>}
    <section className="border-t border-border mt-7 pt-5"><h3 className="mb-3.5">Currently applied</h3><div className="text-caption"><AuthoredValue value={value} project={project}/></div></section>
    <section className="border-t border-border mt-7 pt-5"><h3 className="mb-3.5">Metadata · read only</h3><dl className="text-caption"><div className="flex justify-between gap-4 py-2 border-b border-border"><dt>Regeneration</dt><dd>{token?.regeneration??'allowed'}</dd></div><div className="flex justify-between gap-4 py-2 border-b border-border"><dt>Semantic role</dt><dd>{token?.semanticRole??'Unspecified'}</dd></div><div className="flex justify-between gap-4 py-2 border-b border-border"><dt>Parent group</dt><dd className="source-text">{token?.parentGroupId===null||token?.parentGroupId===undefined?'Project root':groupLabels.get(token.parentGroupId)??'Missing group'}</dd></div></dl>{identity}<details data-baseline-source ref={source} className="mt-5"><summary>All authored data</summary><pre className="source-text text-caption mt-3">{JSON.stringify(inspection?.authored??{originalTokenId:'t-brand',draft:session},null,2)}</pre></details></section>
   </Tabs.Panel>
   <Tabs.Panel value="resolved" className="pt-5"><div className="section-title flex items-center flex-wrap gap-2 mb-5"><h3>Resolved value</h3><Badge>Applied value</Badge></div>{scenario==='costly'&&token?.id==='t-expression'?<><p className="text-caption mt-3">Resolved value unavailable. This calculation exceeds the supported evaluation limit. The authored value is unchanged.</p><Button className="mt-3" onClick={()=>{setTab('authored');requestAnimationFrame(()=>{if(source.current){source.current.open=true;source.current.querySelector('summary')?.focus();}});}}>View authored value</Button></>:<><div className="flex items-center gap-3 mt-4"><Swatch css={applied.css}/><p className="text-caption">{applied.message}</p></div>{inspection?.resolution.status==='resolved'?<pre className="source-text text-caption mt-4">{JSON.stringify(inspection.resolution.value,null,2)}</pre>:<p className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4" role="status">Unresolved: {inspection?.resolution.reason??'original token unavailable'}. Authored data retained.</p>}<h3 className="mt-7">Resolution trace</h3><ol className="trace list-none mt-4.5 mb-6 p-0">{inspection?.resolution.trace.map((step,i)=><li className="relative pb-6 pl-6" key={i}><span className="trace-dot size-2.75 left-0 top-1 border-2 border-trace bg-background absolute rounded-full"/><strong className="block text-caption font-medium wrap-anywhere">{labels.get(step.tokenId)??JSON.stringify(step.tokenId)}</strong><small className="mono block mt-1 text-muted-foreground wrap-anywhere">{JSON.stringify(step.tokenId)}{'targetTokenId' in step?` → ${JSON.stringify(step.targetTokenId)}`:' · authored value'}</small></li>)}</ol><h3 className="mt-7">Resolution diagnostics</h3><pre className="source-text text-caption mt-3">{JSON.stringify(inspection?.resolution.diagnostics??[],null,2)}</pre></> }</Tabs.Panel>
  </Tabs.Root>
  <div className="inspector-foot density:mt-5 small:mt-0 border-t border-border bg-surface px-6 py-4 mt-7 flex justify-between text-muted-foreground"><span>Regeneration</span><span>{token?.regeneration??'allowed'}</span></div>
 </>;
}
