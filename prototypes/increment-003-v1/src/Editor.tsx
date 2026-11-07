import { Select } from './Select';
import { ArrowUpRightIcon } from '@heroicons/react/24/outline';
import { useEffect, useRef, useState } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { Button } from './components/ui/button';
import { path, preview, specimen } from './fixtures';
import type { Color, Space, Token, Value } from './fixtures';
import { LiteralFields } from './LiteralFields';
import { byteIssue, colorPreview, literalIssue } from './color-tools';
import type { InputMode, Triple } from './color-tools';
export function Swatch({color,large=false}:{color?:Color;large?:boolean}) {
 const background=preview(color);
 return <span aria-hidden="true" className={`swatch ${large?'swatch-large':''} ${background?'':'swatch-unavailable'}`}><span style={{background:background??'transparent'}}/></span>;
}
type DraftSession = { mode:Value['mode']; literal:Color; reference:string; inputMode:InputMode; byteText:Triple|null; viewSpace:Space };
function editingBaseline(value:Value,inputMode:InputMode='normalized'):DraftSession {
 return {mode:value.mode,literal:value.mode==='literal'?value.color:{space:'srgb',components:['','',''],alpha:'1'},reference:value.mode==='reference'?value.target:'',inputMode,byteText:null,viewSpace:value.mode==='literal'?value.color.space:'srgb'};
}
export function Editor({token,tokens,onApply,onDirty,commitFailure=false,repairBlocked=false}:{token:Token;tokens:Token[];onApply:(v:Value)=>void;onDirty:(dirty:boolean)=>void;commitFailure?:boolean;repairBlocked?:boolean}) {
 const [session,setSession]=useState(()=>editingBaseline(token.value));
 const baseline=useRef(session);
 const {inputMode,byteText}=session;
 const draft:Value=session.mode==='literal'?{mode:'literal',color:session.literal}:{mode:'reference',target:session.reference};
 const [error,setError]=useState(''); const [notice,setNotice]=useState('');
 useEffect(()=>{if(error)document.getElementById('editor-error')?.focus();},[error]);
 const setViewSpace=(viewSpace:Space)=>setSession(s=>({...s,viewSpace}));
 const setInputMode=(inputMode:InputMode)=>setSession(s=>({...s,inputMode}));
 const setByteText=(byteText:Triple|null)=>setSession(s=>({...s,byteText}));
 const pendingByteIssue=draft.mode==='literal'&&draft.color.space==='srgb'&&inputMode==='bytes'&&byteText?byteIssue(byteText):undefined;
 const first=useRef<HTMLButtonElement>(null);
 const cycleExampleAvailable=token.id==='blue-500'&&tokens.some(t=>t.id==='action-primary'&&t.value.mode==='reference'&&t.value.target==='blue-500');
 const retainedByteIssue=session.literal.space==='srgb'&&inputMode==='bytes'&&byteText?byteIssue(byteText):undefined;
 const authoredDrafts=(s:DraftSession)=>JSON.stringify({mode:s.mode,literal:s.literal,reference:s.reference});
 const dirty=authoredDrafts(session)!==authoredDrafts(baseline.current)||Boolean(retainedByteIssue);
 useEffect(()=>onDirty(dirty),[dirty,onDirty]);
 const update=(next:Value)=>{setSession(s=>next.mode==='literal'?{...s,mode:'literal',literal:next.color}:{...s,mode:'reference',reference:next.target});setError('');setNotice('');};
 const switchForm=(mode:Value['mode'])=>{setSession(s=>({...s,mode}));setError('');setNotice('');};
 const cancel=()=>{setSession(baseline.current);setError('');setNotice('Both drafts discarded. Applied value unchanged.');first.current?.focus();};
 function apply(){
  if(commitFailure){setError('Could not apply changes. The session store did not accept the update. Your applied color is unchanged and both drafts are retained. Retry when available, or Cancel to discard.');return;}
  if(repairBlocked){setError('Cannot apply this repair: another token still has a missing reference (token missing-secondary). The project is unchanged. Correct the other diagnostic before retrying; this slice cannot repair several tokens together.');return;}
  if(draft.mode==='reference' && (!draft.target || draft.target===token.id || (cycleExampleAvailable&&draft.target==='action-primary'))){setError(draft.target ? `Cannot apply: this reference creates a cycle. ${path(token)} → ${tokens.find(t=>t.id===draft.target)?path(tokens.find(t=>t.id===draft.target)!):''} → ${path(token)}. The applied value is unchanged.`:'Choose a reference target before applying.');return;}
  if(pendingByteIssue){setError(pendingByteIssue);return;}
  if(draft.mode==='literal'){const issue=literalIssue(draft.color);if(issue){setError(`Cannot apply: ${issue} The applied value is unchanged.`);return;}}
  onApply(draft);const next=editingBaseline(draft,draft.mode==='literal'?inputMode:'normalized');baseline.current=next;setSession(next);onDirty(false);setNotice('Changes applied for this session.');setError('');first.current?.focus();
 }
 const color=specimen(token,tokens);
 const draftColor=draft.mode==='literal'?draft.color:specimen({...token,value:draft},tokens);
 const draftPreviewMessage=pendingByteIssue?'Finish all channel entries to preview or apply.':draft.mode==='reference'&&!draft.target?'Choose a target to preview its color.':colorPreview(draftColor).message;
 const target=token.value.mode==='reference'?tokens.find(t=>t.id===(token.value as {target:string}).target):undefined;
 return <aside className="inspector" aria-label="Selected token"><div className="inspector-heading"><span className="eyebrow">Color token</span><h2>{path(token)}</h2><p>{token.description||'No description'}</p><div className="flex gap-2 mt-3"><span className="badge">{token.layer}</span><span className="badge">Unconditional</span></div></div>
 <Tabs.Root defaultValue="authored"><Tabs.List className="tabs" aria-label="Token inspection"><Tabs.Tab value="authored">Authored value</Tabs.Tab><Tabs.Tab value="resolved">Resolved & trace</Tabs.Tab></Tabs.List>
 <Tabs.Panel value="authored" className="editor-body"><div className="section-title"><h3>Value</h3>{dirty&&<span className="badge">Draft</span>}</div>
 <section className="color-comparison" aria-label="Applied and draft colors"><div className="color-comparison-item"><h3>Applied color</h3><Swatch color={color} large/><p className="helper">{colorPreview(color).message}</p></div><div className="color-comparison-item"><h3>Draft preview</h3><Swatch color={pendingByteIssue?undefined:draftColor} large/><p className="helper">{draftPreviewMessage}</p></div></section>
 {repairBlocked&&<p className="error">Unresolved reference. A repair here may still be blocked by other project diagnostics. See Resolved &amp; trace.</p>}
 <fieldset><legend>Value source</legend><div className="mode-switch"><Button ref={first} aria-pressed={draft.mode==='literal'} onClick={()=>switchForm('literal')}>Literal color</Button><Button aria-pressed={draft.mode==='reference'} onClick={()=>switchForm('reference')}>Reference</Button></div></fieldset>
 {draft.mode==='literal'?<LiteralFields color={draft.color} viewSpace={session.viewSpace} onView={setViewSpace} mode={inputMode} byteText={byteText} onMode={setInputMode} onBytes={setByteText} onChange={color=>update({mode:'literal',color})} onError={setError}/>:<><label className="field">Target token<Select value={draft.target} aria-describedby="reference-note editor-error" onChange={e=>update({mode:'reference',target:e.target.value})}><option value="">Choose a color token…</option>{tokens.filter(t=>t.value.mode==='literal'||t.id===draft.target||t.id===token.id||(cycleExampleAvailable&&t.id==='action-primary')).map(t=><option key={t.id} value={t.id}>{path(t)} · {t.id}{t.id===token.id?' (this token)':''}</option>)}</Select></label><p className="helper" id="reference-note">Use the whole value of another color token. Its identity stays linked when its name changes.</p><div className="reference-box"><ArrowUpRightIcon className="icon reference-icon" aria-hidden="true"/><p>A reference preserves the relationship.<br/><span className="helper">The draft preview follows the selected target.</span></p></div></>}

 {draft.mode==='literal'&&draft.color.space==='srgb'&&inputMode==='bytes'&&!pendingByteIssue&&<p className="helper mono mt-3 break-words">Normalized draft: [{draft.color.components.join(', ')}]</p>}
 {error&&<p className="error" id="editor-error" role="alert" tabIndex={-1}>{error}</p>}{!error&&<span id="editor-error"/>}
 <div className="editor-actions"><Button onClick={cancel} disabled={!dirty}>Cancel</Button><Button variant="default" onClick={apply} disabled={!dirty||Boolean(pendingByteIssue)}>Apply changes</Button></div><p role="status" className="helper min-h-5">{notice|| (dirty?'Changes are not applied yet.':'Editing preserves this token’s name and metadata.')}</p>
 <section className="applied-summary"><h3>Currently applied</h3><span className="helper">{token.value.mode==='reference'?'Reference to':'Literal color in'}</span><p className="mono break-words">{target?path(target):token.value.mode==='literal'?token.value.color.space:'Unresolved target'}</p>{token.value.mode==='literal'&&<p className="mono helper">[{token.value.color.components.join(', ')}] · α {token.value.color.alpha}</p>}</section>
 </Tabs.Panel><Tabs.Panel value="resolved" className="editor-body"><div className="section-title resolved-heading"><h3>Resolved color</h3><span className="badge">Applied value</span></div><div className="resolved-preview"><Swatch color={color} large/><p className="helper">{colorPreview(color).message}</p></div>{color?<dl className="details"><div><dt>Color space</dt><dd>{color.space}</dd></div><div><dt>Components</dt><dd className="mono">{color.components.join(', ')}</dd></div><div><dt>Alpha</dt><dd className="mono">{color.alpha}</dd></div></dl>:<p className="error" role="status">Resolution unavailable: missing target <code>missing-primary</code>. The authored reference is retained. Choose an eligible target in Authored value to propose a repair.</p>}<h3 className="mt-7">Resolution trace</h3><ol className="trace"><li><span className="trace-dot"/><strong>{path(token)}</strong><small>{token.value.mode==='reference'?'Authored reference':'Authored literal'}</small></li>{target&&<li><span className="trace-dot"/><strong>{path(target)}</strong><small>Literal color · {target.layer}</small></li>}<li><span className="trace-dot terminal"/><strong>Color value</strong><small>{color?`${color.space} · alpha ${color.alpha}`:'Unresolved'}</small></li></ol><p className="helper">All values in this example are unconditional. Inspection shows the applied value, including while a draft is open.</p></Tabs.Panel></Tabs.Root>
 <div className="inspector-foot"><span>Regeneration</span><span>Allowed</span></div></aside>;
}
