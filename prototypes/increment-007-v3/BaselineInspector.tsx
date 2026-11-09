import React,{useLayoutEffect,useRef,useState} from 'react';
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
import type {DraftSession} from '@presentation/session';
import type {ProjectReadback,TokenInspection} from '@application/authoring';
import type {Token} from './specimens';
type Props={token:Token|undefined;project:ProjectReadback;inspection:TokenInspection|undefined;inspect:(id:string)=>TokenInspection|undefined;session:DraftSession;onSession:(s:DraftSession)=>void;blocked:boolean;pending:boolean;controls:boolean;focusRef:React.RefObject<HTMLElement|null>;review:React.ReactNode;actions:React.ReactNode;identity:React.ReactNode;scenario:string};
export function BaselineInspector({token,project,inspection,inspect,session,onSession,blocked,pending,controls,focusRef,review,actions,identity,scenario}:Props){
 const [tab,setTab]=useState('authored'),[fieldError,setFieldError]=useState('');
 const wrapper=useRef<HTMLFieldSetElement>(null),source=useRef<HTMLDetailsElement>(null);
 const value=inspection?.authored.definition?.assignments[0]?.value;
 const applied=colorPreview(resolvedColor(inspection));
 const draft=session.mode==='literal'?session.byteInvalid?{message:'Unavailable: finish the incomplete byte entries.'}:colorPreview(session.literal):colorPreview(resolvedColor(inspect(session.reference)));
 const raw=JSON.stringify({literal:session.literal,referenceTargetId:session.reference,byteText:session.byteText},null,2);
 const labels=identityLabels(project.tokens);
 const choices=project.tokens.filter(t=>t.authored.definition?.type==='color');
 const referenceLabels=identityLabels(choices,undefined,token?.id);
 useLayoutEffect(()=>{const target=blocked?document.querySelector<HTMLElement>('[data-preserved-color-draft]'):wrapper.current?.querySelector<HTMLElement>('input:not([type=range]),select');focusRef.current=target??null;if(target)target.setAttribute('data-supplement-editor','');},[blocked,session.mode,tab,focusRef]);
 const title=token?(token.name.trim()===''?`${JSON.stringify(token.name)} (unnamed token)`:labels.get(token.id)??token.name):'Original token unavailable';
 return <>
  <div className="inspector-header flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4 mb-5"><span className="text-caption font-medium">Token inspector</span><section aria-label="Applied and draft color context" className="flex gap-4">{[['Applied',applied],...(tab==='authored'?[['Draft',draft]]:[])].map(([label,preview])=><div key={label as string} className="flex flex-col items-center gap-1 text-caption"><span>{label as string}</span><Swatch css={(preview as typeof applied).css}/><span className="sr-only">{(preview as typeof applied).message}</span></div>)}</section></div>
  <div className="inspector-heading"><span className="eyebrow uppercase text-muted-foreground font-semibold">{inspection?.authored.definition?.type??'Color'} token</span><h2 className="whitespace-pre-wrap wrap-anywhere">{title}</h2><p className="text-caption text-muted-foreground whitespace-pre-wrap wrap-anywhere">{token?.description??'Original input remains in this tab.'}</p><div className="flex flex-wrap gap-2 mt-3 mb-5"><Badge>{token?.layer??'Unspecified layer'}</Badge><Badge>{controls&&!token?.inspectOnly?'Unconditional':'Inspection only'}</Badge>{token?.semanticRole&&<Badge>{token.semanticRole}</Badge>}</div></div>
  <Tabs.Root value={tab} onValueChange={setTab}>
   <InspectionTabs/>
   <Tabs.Panel value="authored" className="pt-5">
    {review}
    {controls&&<><h3 className="mb-4">Value</h3><fieldset disabled={blocked||pending}><legend>Value source</legend><div className="mode-switch border border-border bg-mode flex p-0.75 rounded-md gap-0.75 mb-5"><Button variant="mode" size="mode" aria-pressed={session.mode==='literal'} onClick={()=>onSession({...session,mode:'literal',edited:true})}>Literal color</Button><Button variant="mode" size="mode" aria-pressed={session.mode==='reference'} onClick={()=>onSession({...session,mode:'reference',edited:true})}>Reference</Button></div></fieldset>
     <fieldset ref={wrapper} disabled={blocked||pending} className="min-w-0 border-0 p-0">
      {session.mode==='literal'?<ColorFields session={session} onChange={s=>{onSession(s);setFieldError('');}} onError={setFieldError}/>:<><Field>Target token<Select value={session.reference} onChange={e=>onSession({...session,reference:e.target.value,edited:true})}><option value="__prototype-unchosen-reference__">Choose a color token…</option>{!choices.some(t=>t.authored.id===session.reference)&&<option value={session.reference}>Missing target · {JSON.stringify(session.reference)}</option>}{choices.map(t=><option key={t.authored.id} value={t.authored.id}>{referenceLabels.get(t.authored.id)}</option>)}</Select></Field><p className="helper text-muted-foreground">Whole color value. Alias chains remain linked by identity; cycles are rejected on Apply.</p></>}
     </fieldset>
     <p className="helper text-muted-foreground mt-3">Draft preview: {draft.message}</p>
     {fieldError&&<p id="editor-error" role="alert" className="text-destructive text-caption mt-3">{fieldError}</p>}
     {blocked&&<label className="block text-caption mt-4">Preserved draft · read only<textarea data-preserved-color-draft readOnly className="source-text w-full mt-2 border border-border bg-background p-3" value={raw}/></label>}
     {actions}
    </>}
    <section className="border-t border-border mt-7 pt-5"><h3 className="mb-3.5">Currently applied</h3><div className="text-caption"><AuthoredValue value={value} project={project}/></div></section>
    <section className="border-t border-border mt-7 pt-5"><h3 className="mb-3.5">Metadata · read only</h3><dl className="text-caption"><div className="flex justify-between gap-4 py-2 border-b border-border"><dt>Regeneration</dt><dd>{token?.regeneration??'allowed'}</dd></div><div className="flex justify-between gap-4 py-2 border-b border-border"><dt>Semantic role</dt><dd>{token?.semanticRole??'Unspecified'}</dd></div><div className="flex justify-between gap-4 py-2 border-b border-border"><dt>Parent group</dt><dd className="source-text">{token?.parentGroupId===null||token?.parentGroupId===undefined?'Project root':JSON.stringify(token.parentGroupId)}</dd></div></dl>{identity}<details data-baseline-source ref={source} className="mt-5"><summary>All authored data</summary><pre className="source-text text-caption mt-3">{JSON.stringify(inspection?.authored??{originalTokenId:'t-brand',draft:session},null,2)}</pre></details></section>
   </Tabs.Panel>
   <Tabs.Panel value="resolved" className="pt-5"><h3>Resolved value</h3>{scenario==='costly'&&token?.id==='t-expression'?<><p className="text-caption mt-3">Resolved value unavailable. This calculation exceeds the supported evaluation limit. The authored value is unchanged.</p><Button className="mt-3" onClick={()=>{setTab('authored');requestAnimationFrame(()=>{if(source.current){source.current.open=true;source.current.querySelector('summary')?.focus();}});}}>View authored value</Button></>:<><div className="flex items-center gap-3 mt-4"><Swatch css={applied.css}/><p className="text-caption">{applied.message}</p></div><pre className="source-text text-caption mt-4">{JSON.stringify(inspection?.resolution.status==='resolved'?inspection.resolution.value:{reason:inspection?.resolution.reason},null,2)}</pre><h3 className="mt-7">Resolution trace</h3><ol className="text-caption mt-3 space-y-3">{inspection?.resolution.trace.map((step,i)=><li key={i}><strong>{labels.get(step.tokenId)??JSON.stringify(step.tokenId)}</strong><pre className="source-text">{JSON.stringify(step,null,2)}</pre></li>)}</ol><h3 className="mt-7">Resolution diagnostics</h3><pre className="source-text text-caption mt-3">{JSON.stringify(inspection?.resolution.diagnostics??[],null,2)}</pre></> }</Tabs.Panel>
  </Tabs.Root>
 </>;
}
