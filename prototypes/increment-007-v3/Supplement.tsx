import React,{useEffect,useRef,useState} from 'react';
import {Dialog} from '@base-ui/react/dialog';
import {Button} from '@presentation/components/button';
import {DialogContent} from '@presentation/components/dialog-content';
import {ArrowLeftIcon,PlusIcon} from '@heroicons/react/24/outline';
import {TokenList} from '@presentation/TokenList';
import {baseline as makeBaseline,literalIssue} from '@presentation/session';
import type {DraftSession} from '@presentation/session';
import {readFixture,initialSession,tokenValue,updatedToken} from './baseline-adapter';
import {BaselineInspector} from './BaselineInspector';
import {authoredText,pathInfo,type Project,type Token} from './specimens';
type Selection={kind:'token'|'group';id:string}|null;
type Props={project:Project;scenario:string;allContent:boolean;pending:boolean;writeBlocked:boolean;uncertain:boolean;onAll:(v:boolean)=>void;onProjects:()=>void;onCommit:(p:Project,done:()=>void)=>void;onDirty:(v:boolean)=>void};
const visibleName=(name:string,kind:string)=>name===''?`(unnamed ${kind})`:name.trim()===''?`${JSON.stringify(name)} (whitespace name)`:name;
export function Supplement({project,scenario,allContent,pending,writeBlocked,uncertain,onAll,onProjects,onCommit,onDirty}:Props){
 const recovered=['changed-literal','changed-reference','removed','ineligible'].includes(scenario);
 const formScenario=['changed-create','changed-rename','resource-form'].includes(scenario);
 const [selection,setSelection]=useState<Selection>(()=>({kind:'token',id:scenario==='changed-reference'?'t-content':scenario==='costly'?'t-expression':'t-brand'}));
 const [session,setSession]=useState(()=>initialSession(project,scenario));
 const initialDraft=useRef(session);
 const literal=session.literal.components[0],reference=session.reference,mode=session.mode;
 const fixture=readFixture(project);
 const [query,setQuery]=useState('');
 const [dirty,setDirty]=useState(session.edited),[needsReview,setNeedsReview]=useState(recovered),[review,setReview]=useState(false);
 const [message,setMessage]=useState(''),[resourceDetails,setResourceDetails]=useState(false),[refusedAt,setRefusedAt]=useState<string|null>(null);
 const [form,setForm]=useState(formScenario),[formDirty,setFormDirty]=useState(formScenario),[formName,setFormName]=useState(scenario==='changed-rename'?'  Foundations draft  ':'  New color draft  '),[formDescription,setFormDescription]=useState('Unfinished description remains exact.');
 const [focusRequest,setFocusRequest]=useState<{target:'form'|'editor';sequence:number}|null>(null);
 const requestFocus=(target:'form'|'editor')=>setFocusRequest(previous=>({target,sequence:(previous?.sequence??0)+1}));
 const [formReviewed,setFormReviewed]=useState(false),[formReview,setFormReview]=useState(false),[guard,setGuard]=useState<(()=>void)|null>(null);
 const field=useRef<HTMLElement>(null),formField=useRef<HTMLInputElement>(null),reviewHeading=useRef<HTMLHeadingElement>(null),formHeading=useRef<HTMLHeadingElement>(null),details=useRef<HTMLDetailsElement>(null);
 const chosen=selection?.kind==='token'?project.tokens.find(t=>t.id===selection.id):undefined;
 const group=selection?.kind==='group'?project.groups?.find(g=>g.id===selection.id):undefined;
 const removed=selection?.kind==='token'&&chosen===undefined&&recovered;
 const ineligible=removed||chosen?.inspectOnly===true||chosen?.layer==='component';
 const invalid=mode==='literal'?!!literalIssue(session.literal)||session.byteInvalid:!project.tokens.some(t=>t.id===reference&&t.id!==chosen?.id);
 const current=chosen?authoredText(chosen):'(original token no longer exists)';
 const previousApplied=scenario==='changed-reference'?'Reference → "t-brand" (whole value)':JSON.stringify({kind:'literal',valueType:'color',colorSpace:'srgb',components:['0.231372549019607843','0.36','0.72'],alpha:'1'},null,2);
 // View replacement removes the focused guard/action. Wait through the popup's
 // focus-manager frame before focusing the now-mounted, enabled input.
 useEffect(()=>{
  if(!focusRequest||pending||guard!==null)return;
  let second=0;const first=requestAnimationFrame(()=>{second=requestAnimationFrame(()=>{
   const target=focusRequest.target==='form'?formField.current:field.current;
   (target??document.querySelector<HTMLElement>('[data-recovery-anchor]'))?.focus();
  });});
  return()=>{cancelAnimationFrame(first);cancelAnimationFrame(second);};
 },[focusRequest,pending,guard,form]);
 useEffect(()=>{onDirty(dirty||formDirty);},[dirty,formDirty,onDirty]);
 useEffect(()=>{if(review)reviewHeading.current?.focus();},[review]);
 useEffect(()=>{if(formReview)formHeading.current?.focus();},[formReview]);
 const ask=(fn:()=>void)=>{if(uncertain||pending)return;if(dirty||formDirty)setGuard(()=>fn);else fn();};
 const choose=(s:Selection)=>ask(()=>{setSelection(s);setNeedsReview(false);setReview(false);setDirty(false);setMessage('');if(s?.kind==='token'){const t=project.tokens.find(t=>t.id===s.id);const next=makeBaseline(t?tokenValue(t):undefined);initialDraft.current=next;setSession(next);}});
 const changeSession=(next:DraftSession)=>{if(writeBlocked||pending||ineligible)return;setSession(next);setDirty(next.edited||next.reference!==initialDraft.current.reference);setMessage('');};
 function apply(){
  if(!chosen||ineligible||invalid||writeBlocked||pending||needsReview&&!review)return;
  if(scenario==='resource-edit'&&(refusedAt===null||refusedAt===JSON.stringify(session))){setRefusedAt(JSON.stringify(session));setMessage('This change exceeds the supported limit. Nothing was applied.');setResourceDetails(true);field.current?.focus();return;}
  const candidate=structuredClone(project);candidate.updated='Just now';candidate.tokens=candidate.tokens.map(t=>t.id===chosen.id?updatedToken(t,session):t);
  const checked=readFixture(candidate).validation;
  if(checked.status==='failure'||checked.value.namespaceDiagnostics.length||checked.value.referenceDiagnostics.length){setMessage('Nothing was applied. The complete candidate still has namespace or reference diagnostics. Your edits remain in this tab.');return;}
  onCommit(candidate,()=>{const next=makeBaseline(tokenValue(updatedToken(chosen,session)));initialDraft.current=next;setSession(next);setDirty(false);setNeedsReview(false);setReview(false);setResourceDetails(false);setMessage('Changes retained.');requestFocus('editor');});
 }
 function submitForm(){
  if(pending||writeBlocked||(['changed-create','changed-rename'].includes(scenario)&&!formReviewed))return;
  if(project.diagnostics){setMessage('Nothing was applied. The complete candidate still has namespace or reference diagnostics. Your form is unchanged.');return;}
  if(scenario==='resource-form'&&(refusedAt===null||refusedAt===formName)){setRefusedAt(formName);setMessage('This change exceeds the supported limit. Nothing was applied.');formField.current?.focus();return;}
  const candidate=structuredClone(project);candidate.updated='Just now';
  if(scenario==='changed-rename')candidate.groups=candidate.groups?.map(g=>g.id==='g-color'?{...g,name:formName}:g);
  else candidate.tokens.push({id:crypto.randomUUID(),name:formName,value:'0',description:formDescription,parentGroupId:project.groups?.some(g=>g.id==='g-color')?'g-color':null,layer:'primitive',color:{colorSpace:'srgb',components:['0','0','0'],alpha:'1'}});
  onCommit(candidate,()=>{setForm(false);setFormDirty(false);setMessage('Changes retained.');});
 }
 const identity=<details className="mt-5 text-caption"><summary>Identity and context</summary><dl className="identity-grid mt-3"><dt>Project ID</dt><dd>{JSON.stringify(project.id)}</dd><dt>Kind</dt><dd>{selection?.kind??'None'}</dd><dt>Entity ID</dt><dd>{selection?JSON.stringify(selection.id):'None'}</dd><dt>Parent group ID</dt><dd>{(chosen??group)?.parentGroupId===null||(chosen??group)?.parentGroupId===undefined?'null · actual project root':JSON.stringify((chosen??group)?.parentGroupId)}</dd></dl></details>;
 const data=chosen??group;
 return <main className="workbench flex flex-1 min-h-0">
  <nav aria-label="Project library" className="project-sidebar shrink-0 border-r border-border bg-surface p-5"><Button variant="ghost" disabled={uncertain||pending} onClick={()=>ask(onProjects)}><ArrowLeftIcon className="w-4 h-4" aria-hidden="true"/>Projects</Button><p className="mt-7 mb-3 text-caption uppercase text-muted-foreground font-semibold">Library</p><Button className="w-full justify-start mb-2" aria-pressed={!allContent} disabled={uncertain||pending} variant={!allContent?'outline':'ghost'} onClick={()=>ask(()=>onAll(false))}>All tokens</Button><Button className="w-full justify-start" aria-pressed={allContent} disabled={uncertain||pending} variant={allContent?'outline':'ghost'} onClick={()=>ask(()=>onAll(true))}>All content</Button><p className="mt-6 text-caption text-muted-foreground">Applied work is retained.<br/>Drafts stay in this tab.</p></nav>
  <section className="flex-1 min-w-0 overflow-auto p-6"><div className="flex flex-wrap justify-between gap-3 mb-5"><div><h1>{allContent?'All content':'All tokens'}</h1><p className="text-muted-foreground mt-1">{allContent?'Tokens and namespace groups, independent of hierarchy':'Your project’s applied vocabulary'}</p></div>{<Button disabled={pending||dirty||writeBlocked} onClick={()=>{setFormName('');setFormDescription('');setForm(true);setFormDirty(false);}}><PlusIcon className="w-4 h-4" aria-hidden="true"/>New token</Button>}</div>
  {scenario==='second-tab'&&<div className="border border-border bg-notice p-4 mb-5"><strong>Open for editing in another tab</strong><p className="text-xs mt-2">You can inspect this project here. Return to the editing tab to make changes.</p></div>}
  {project.diagnostics&&<div className="border border-border bg-notice p-4 mb-5"><strong>Project opened with diagnostics</strong><p className="mt-2">Authored content is preserved. Some relationships need attention.</p><Button className="mt-3" disabled={uncertain||pending} onClick={()=>ask(()=>onAll(true))}>Inspect all content</Button></div>}
  {scenario==='report-limit'&&<section className="border border-border bg-muted p-4 mb-5"><h2>Some diagnostics are not shown.</h2><p className="mt-2 text-xs">The report reached its display limit. This is not an all-clear result. Select a record to inspect its available diagnostics.</p><details className="text-caption mt-3"><summary>Report details</summary><p>Display limit: 1,000 diagnostic items per requested report. Complete admissibility checks are separate and cannot be skipped by this display limit.</p></details></section>}
  <label className="block text-caption mb-5">Search tokens<input className="w-full mt-2 border border-border rounded-md bg-background p-2" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tokens…"/></label>
  <div className="border-t border-border">{allContent&&project.groups?.map(g=><button key={`group:${g.id}`} className={`content-row ${selection?.kind==='group'&&selection.id===g.id?'bg-selected':''}`} aria-pressed={selection?.kind==='group'&&selection.id===g.id} disabled={uncertain||pending} onClick={()=>choose({kind:'group',id:g.id})}><span className="text-caption text-muted-foreground">Group</span><strong>{visibleName(g.name,'group')}</strong><span className="text-caption">{pathInfo(project,g).path}</span><code className="text-caption">ID: {JSON.stringify(g.id)}</code></button>)}<fieldset disabled={uncertain||pending} className="min-w-0 border-0 p-0"><TokenList project={fixture.project} visible={fixture.project.tokens.filter(t=>!query||t.authored.localName.toLocaleLowerCase().includes(query.toLocaleLowerCase()))} selected={selection?.kind==='token'?selection.id:undefined} query={query} inspect={fixture.inspect} onSelect={id=>choose({kind:'token',id})} onEmptyAction={()=>{if(query)setQuery('');else{setForm(true);setFormName('');setFormDescription('');setFormDirty(false);}}}/></fieldset></div>
  </section>
  <aside className="token-inspector shrink-0 border-l border-border bg-surface p-6 overflow-auto" aria-label="Selected token">
   {group?<><h2 className="whitespace-pre-wrap">{visibleName(group.name,'group')}</h2><h3 className="mt-4">Namespace group</h3><p className="text-xs mt-3">This record is available for inspection even when its ancestry is unusable.</p><p className="text-xs mt-3">{pathInfo(project,group).path}</p>{pathInfo(project,group).reason&&<p className="text-xs mt-3">Diagnostic: {pathInfo(project,group).reason}</p>}{identity}<details className="mt-5"><summary>All authored data</summary><pre className="source-text text-caption mt-3">{JSON.stringify(group,null,2)}</pre></details></>:(chosen||removed)?<BaselineInspector token={chosen} project={fixture.project} inspection={chosen?fixture.inspect(chosen.id):undefined} inspect={fixture.inspect} session={session} onSession={changeSession} blocked={writeBlocked||ineligible} pending={pending} controls={recovered||(!chosen?.inspectOnly&&chosen?.layer!=='component')} focusRef={field} scenario={scenario} identity={identity}
   review={<>
    {chosen?.componentDefinitionId!==undefined&&<div className="border border-border bg-notice p-4 mb-5"><strong>Inspect only</strong><p className="text-xs mt-2">Component ownership context is unavailable and has not been verified.</p><p className="text-caption mt-2">Association ID: <code>{JSON.stringify(chosen.componentDefinitionId)}</code></p></div>}
    {chosen&&pathInfo(project,chosen).reason&&<p className="text-xs mb-4">Path unavailable · {pathInfo(project,chosen).reason}</p>}
    {scenario==='costly'&&chosen?.id==='t-expression'&&<section className="border border-border bg-muted p-4 mb-5"><h3>Resolved value unavailable</h3><p className="text-xs mt-2">This calculation exceeds the supported evaluation limit. The authored value is unchanged.</p><Button className="mt-3" onClick={()=>{const d=document.querySelector<HTMLDetailsElement>('[data-baseline-source]');if(d){d.open=true;d.querySelector('summary')?.focus();}}}>View authored value</Button></section>}
    {scenario==='report-limit'&&chosen?.alias==='missing-target'&&<p className="text-xs mb-5">Diagnostic: missing-reference · target ID <code>"missing-target"</code>. The authored reference is preserved.</p>}
    {needsReview&&<div className="border border-border bg-notice p-4 mb-5"><p className="text-xs">{ineligible?'This edit can no longer be applied to its original target.':'The applied value changed. Your unapplied edits are still here.'}</p>{ineligible?<p className="text-xs mt-2">{removed?'The original token was removed.':'The token is now component-associated and inspect-only.'}</p>:!review&&<Button className="mt-3" onClick={()=>setReview(true)}>Review edit</Button>}</div>}
    {review&&<section className="border border-border p-4 mb-5"><h3 ref={reviewHeading} tabIndex={-1}>Review edit</h3><h4 className="text-xs mt-4 font-semibold">Previously applied</h4><pre className="source-text text-xs mt-2">{previousApplied}</pre><h4 className="text-xs mt-4 font-semibold">Currently applied</h4><pre className="source-text text-xs mt-2">{current}</pre><h4 className="text-xs mt-4 font-semibold">Your unapplied edits</h4><pre className="source-text text-xs mt-2">{JSON.stringify(mode==='literal'?{kind:'literal',valueType:'color',...session.literal}:{kind:'token-reference',targetTokenId:reference,valuePath:[]},null,2)}</pre></section>}
   </>}
   actions={<>
    {dirty&&invalid&&!ineligible&&<p id="draft-error" className="text-xs text-destructive mt-3">{mode==='literal'?(session.byteInvalid?'Finish the incomplete byte entries.':literalIssue(session.literal)):'Choose an existing target by its exact ID.'}</p>}
    {message&&<div id="supplement-message" role="status" className="text-xs mt-4"><p>{message}</p>{resourceDetails&&message==='This change exceeds the supported limit. Nothing was applied.'&&<details className="mt-2"><summary>Limit details</summary><p>Snapshot limit: 8,388,608 bytes. Candidate observation: 8,388,609 bytes. Previous applied state is unchanged.</p></details>}</div>}
    <div className="editor-actions sticky bottom-0 flex flex-wrap justify-end gap-2 mt-5 border-t border-border bg-surface py-3"><Button disabled={!dirty||pending||uncertain} onClick={()=>ask(()=>{const next=makeBaseline(chosen?tokenValue(chosen):undefined);initialDraft.current=next;setSession(next);setDirty(false);setNeedsReview(false);setReview(false);setMessage('');requestFocus('editor');})}>{ineligible?'Discard edits':'Cancel'}</Button><Button variant="default" disabled={!dirty||ineligible||invalid||pending||writeBlocked||needsReview&&!review} onClick={apply}>{pending?'Applying…':needsReview?'Reapply changes':'Apply changes'}</Button></div><p className="text-caption text-muted-foreground" role="status">{dirty?'Changes are not applied yet.':'Editing preserves name and metadata.'}</p>
   </>}/>:<p>Select a token or group to inspect its authored data.</p>}
  </aside>
  <Dialog.Root open={form||guard!==null} onOpenChange={open=>{if(!open){if(guard){setGuard(null);requestFocus(form?'form':'editor');return;}ask(()=>{setForm(false);setFormDirty(false);});}}}>
   <DialogContent className="prototype-dialog" initialFocus={()=>document.querySelector<HTMLElement>('[data-supplement-safe]')??formField.current} finalFocus={()=>field.current??document.querySelector<HTMLElement>('[data-recovery-anchor]')}>
    <Dialog.Title>{guard?'Discard unapplied changes?':scenario==='changed-rename'?'Rename group':'New color token'}</Dialog.Title><Dialog.Description className="text-xs text-muted-foreground mt-2 mb-5">{guard?'Your unapplied edits will be discarded. Applied data is unchanged.':'Review the fields before submitting. Unfinished forms stay only in this tab.'}</Dialog.Description>
    {guard?<div className="flex flex-wrap justify-end gap-2"><Button data-supplement-safe autoFocus onClick={()=>{setGuard(null);requestFocus(form?'form':'editor');}}>Keep editing</Button><Button variant="default" onClick={()=>{const action=guard;setGuard(null);setDirty(false);setFormDirty(false);action();}}>Discard edits</Button></div>:<form onSubmit={e=>{e.preventDefault();submitForm();}}>
     {['changed-create','changed-rename'].includes(scenario)&&<section className="border border-border bg-notice p-4 mb-4"><p className="text-xs">Project content changed. Review before submitting.</p>{!formReviewed&&<Button className="mt-3" onClick={()=>{setFormReview(true);setFormReviewed(true);}}>Review changes</Button>}</section>}
     {formReview&&<section className="border border-border p-4 mb-4 text-xs"><h3 ref={formHeading} tabIndex={-1}>Review changes</h3><p className="mt-3">{scenario==='changed-rename'?'Previously applied group name':'Previously selected parent'}: <code className="source-text">"Foundations"</code></p><p className="mt-2">{scenario==='changed-rename'?'Currently applied group name':'Current parent name'}: <code className="source-text">"Foundations revised"</code></p><p className="mt-2">Exact {scenario==='changed-rename'?'group':'parent group'} ID: <code>"g-color"</code> · same original identity</p><p className="mt-2">Your entered name: <code className="source-text">{JSON.stringify(formName)}</code></p></section>}
     <label className="block text-xs mb-4">{scenario==='changed-rename'?'Group name':'Token name'}<input ref={formField} readOnly={writeBlocked} value={formName} disabled={pending} aria-describedby={message?'form-feedback':undefined} onChange={e=>{setFormName(e.target.value);setFormDirty(true);setMessage('');}}/></label>
     {scenario!=='changed-rename'&&<label className="block text-xs mb-4">Description (optional)<textarea readOnly={writeBlocked} value={formDescription} disabled={pending} onChange={e=>{setFormDescription(e.target.value);setFormDirty(true);}}/></label>}
     {message&&<div id="form-feedback" role="alert" className="text-destructive text-xs mb-4"><p>{message}</p>{scenario==='resource-form'&&<details className="mt-2"><summary>Limit details</summary><p>Decoded string limit: 65,536 UTF-16 code units. Candidate observation: 65,537 UTF-16 code units. No input was truncated.</p></details>}</div>}
     <div className="flex flex-wrap justify-end gap-2"><Button disabled={pending||uncertain} onClick={()=>ask(()=>{setForm(false);setFormDirty(false);setMessage('');})}>Cancel</Button><Button variant="default" type="submit" disabled={pending||writeBlocked||(['changed-create','changed-rename'].includes(scenario)&&!formReviewed)}>{pending?'Applying…':scenario==='changed-rename'?'Rename group':'Create token'}</Button></div>
    </form>}
   </DialogContent>
  </Dialog.Root>
 </main>;
}
