import { useEffect, useRef, useState } from 'react';
import { Tabs } from '@base-ui/react/tabs';
import { Button } from './components/ui/button';
import { path, preview, specimen } from './fixtures';
import type { Color, Token, Value } from './fixtures';
import { LiteralFields } from './LiteralFields';
import { byteIssue, colorPreview, literalIssue } from './color-tools';
import type { InputMode, Triple } from './color-tools';
export function Swatch({color,large=false}:{color?:Color;large?:boolean}) {
 const background=preview(color);
 return <span aria-hidden="true" className={`swatch ${large?'swatch-large':''} ${background?'':'swatch-unavailable'}`}><span style={{background:background??'transparent'}}/></span>;
}
export function Editor({token,tokens,onApply,onDirty}:{token:Token;tokens:Token[];onApply:(v:Value)=>void;onDirty:(dirty:boolean)=>void}) {
 const [draft,setDraft]=useState<Value>(token.value);
 const [error,setError]=useState(''); const [notice,setNotice]=useState('');
 const [inputMode,setInputMode]=useState<InputMode>('normalized');
 const [byteText,setByteText]=useState<Triple|null>(null);
 const pendingByteIssue=draft.mode==='literal'&&draft.color.space==='srgb'&&inputMode==='bytes'&&byteText?byteIssue(byteText):undefined;
 const first=useRef<HTMLButtonElement>(null);
 const cycleExampleAvailable=token.id==='blue-500'&&tokens.some(t=>t.id==='action-primary'&&t.value.mode==='reference'&&t.value.target==='blue-500');
 const dirty=JSON.stringify(draft)!==JSON.stringify(token.value)||Boolean(pendingByteIssue);
 useEffect(()=>onDirty(dirty),[dirty,onDirty]);
 const update=(next:Value)=>{setDraft(next);setError('');setNotice('');};
 const cancel=()=>{setByteText(null);update(token.value);setNotice('Draft discarded. Applied value unchanged.');first.current?.focus();};
 function apply(){
  if(draft.mode==='reference' && (!draft.target || draft.target===token.id || (cycleExampleAvailable&&draft.target==='action-primary'))){setError(draft.target ? `Cannot apply: this reference creates a cycle. ${path(token)} → ${tokens.find(t=>t.id===draft.target)?path(tokens.find(t=>t.id===draft.target)!):''} → ${path(token)}. The applied value is unchanged.`:'Choose a reference target before applying.');return;}
  if(pendingByteIssue){setError(pendingByteIssue);return;}
  if(draft.mode==='literal'){const issue=literalIssue(draft.color);if(issue){setError(`Cannot apply: ${issue} The applied value is unchanged.`);return;}}
  onApply(draft);setByteText(null);onDirty(false);setNotice('Changes applied for this session.');setError('');first.current?.focus();
 }
 const color=specimen(token,tokens);
 const target=token.value.mode==='reference'?tokens.find(t=>t.id===(token.value as {target:string}).target):undefined;
 return <aside className="inspector" aria-label="Selected token"><div className="inspector-heading"><span className="eyebrow">Color token</span><h2>{path(token)}</h2><p>{token.description||'No description'}</p><div className="flex gap-2 mt-3"><span className="badge">{token.layer}</span><span className="badge">Unconditional</span></div></div>
 <Tabs.Root defaultValue="authored"><Tabs.List className="tabs" aria-label="Token inspection"><Tabs.Tab value="authored">Authored value</Tabs.Tab><Tabs.Tab value="resolved">Resolved & trace</Tabs.Tab></Tabs.List>
 <Tabs.Panel value="authored" className="editor-body"><div className="section-title"><h3>Value</h3>{dirty&&<span className="badge">Draft</span>}</div>
 <fieldset><legend>Value source</legend><div className="mode-switch"><Button ref={first} aria-pressed={draft.mode==='literal'} onClick={()=>{if(draft.mode!=='literal'){setByteText(null);update({mode:'literal',color:{space:'srgb',components:['','',''],alpha:'1'}});}}}>Literal color</Button><Button aria-pressed={draft.mode==='reference'} onClick={()=>{if(draft.mode!=='reference'){setByteText(null);update({mode:'reference',target:''});}}}>Reference</Button></div></fieldset>
 {draft.mode==='literal'?<LiteralFields color={draft.color} mode={inputMode} byteText={byteText} onMode={setInputMode} onBytes={setByteText} onChange={color=>update({mode:'literal',color})} onError={setError}/>:<><label className="field">Target token<select value={draft.target} aria-describedby="reference-note editor-error" onChange={e=>update({mode:'reference',target:e.target.value})}><option value="">Choose a color token…</option>{tokens.filter(t=>t.value.mode==='literal'||t.id===token.id||(cycleExampleAvailable&&t.id==='action-primary')).map(t=><option key={t.id} value={t.id}>{path(t)}{t.id===token.id?' (this token)':''}</option>)}</select></label><p className="helper" id="reference-note">Use the whole value of another color token. Its identity stays linked when its name changes.</p><div className="reference-box"><span aria-hidden="true">↗</span><p>A reference preserves the relationship.<br/><span className="helper">The resolved color is shown in the next tab.</span></p></div></>}
 {error&&<p className="error" id="editor-error" role="alert">{error}</p>}{!error&&<span id="editor-error"/>}
 <div className="editor-actions"><Button onClick={cancel} disabled={!dirty}>Cancel</Button><Button variant="default" onClick={apply} disabled={!dirty||Boolean(pendingByteIssue)}>Apply changes</Button></div><p role="status" className="helper min-h-5">{notice|| (dirty?'Changes are not applied yet.':'Editing preserves this token’s name and metadata.')}</p>
 <section className="applied-summary"><h3>Currently applied</h3><span className="helper">{token.value.mode==='reference'?'Reference to':'Literal color in'}</span><p className="mono break-words">{target?path(target):token.value.mode==='literal'?token.value.color.space:'Unresolved target'}</p>{token.value.mode==='literal'&&<p className="mono helper">[{token.value.color.components.join(', ')}] · α {token.value.color.alpha}</p>}</section>
 </Tabs.Panel><Tabs.Panel value="resolved" className="editor-body"><div className="section-title"><h3>Resolved color</h3><span className="badge">Applied value</span></div><div className="resolved-preview"><Swatch color={color} large/><p className="helper">{colorPreview(color).message}</p></div>{color?<dl className="details"><div><dt>Color space</dt><dd>{color.space}</dd></div><div><dt>Components</dt><dd className="mono">{color.components.join(', ')}</dd></div><div><dt>Alpha</dt><dd className="mono">{color.alpha}</dd></div></dl>:<p className="error">The selected fixture has no resolved specimen.</p>}<h3 className="mt-7">Resolution trace</h3><ol className="trace"><li><span className="trace-dot"/><strong>{path(token)}</strong><small>{token.value.mode==='reference'?'Authored reference':'Authored literal'}</small></li>{target&&<li><span className="trace-dot"/><strong>{path(target)}</strong><small>Literal color · {target.layer}</small></li>}<li><span className="trace-dot terminal"/><strong>Color value</strong><small>{color?`${color.space} · alpha ${color.alpha}`:'Unresolved'}</small></li></ol><p className="helper">All values in this example are unconditional. Inspection shows the applied value, including while a draft is open.</p></Tabs.Panel></Tabs.Root>
 <div className="inspector-foot"><span>Regeneration</span><span>Allowed</span></div></aside>;
}
