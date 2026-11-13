import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@presentation/components/ui/button';
import { Input } from '@presentation/components/ui/input';
import { Select } from '@presentation/components/ui/select';
import { Icon } from '@presentation/components/ui/icon';
import { DialogContent } from '@presentation/components/ui/dialog-content';
import './prototype.css';

type View = 'all' | 'foundation' | 'empty' | 'inventory';
type Entity = 'brand' | 'action' | 'broken' | 'group' | 'emptyGroup';
const projectId = '378664d4-aa05-4f4a-be54-207102a3486b';
const ids = { emptyGroup: '1a2f08f4-b094-4ccd-9b9b-7a3f3cbfa41c', brand: '0852fdac-e5cf-4bf6-8f88-696c0812a9f7', action: '97e7a4a8-b7db-4302-8c5b-12f982e54b2a', broken: '786f9147-3012-4665-bdc4-73a8f616b6cb', group: 'accd6060-6e20-41c8-8c9d-0a6891eb3e55' };
const missingId = '08a28327-54b5-4666-9671-87ab56742752';
const paths = { emptyGroup: 'semantic', brand: 'foundation.brand', action: 'action.primary', broken: 'action.secondary', group: 'foundation' };
const initial = ['0.8', '0', '0', '1'];
const names = ['Red', 'Green', 'Blue', 'Alpha'];

function Details({ label, children }: { label: string; children: React.ReactNode }) {
  return <details className="p9-details"><summary>{label}</summary><div>{children}</div></details>;
}
function Data({ value }: { value: unknown }) { return <pre className="p9-data" tabIndex={0}>{JSON.stringify(value, null, 2)}</pre>; }
function App() {
  const [view, setView] = useState<View>('foundation');
  const [selection, setSelection] = useState<Entity>('brand');
  const [tab, setTab] = useState('authored');
  const [query, setQuery] = useState('');
  const [raw, setRaw] = useState(initial);
  const [applied, setApplied] = useState(initial);
  const [mode, setMode] = useState('literal');
  const [target, setTarget] = useState('brand');
  const [dirty, setDirty] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [pending, setPending] = useState<Entity | null>(null);
  const [drawer, setDrawer] = useState(false);
  const [creation, setCreation] = useState(false);
  const [parent, setParent] = useState('foundation');
  const [newName, setNewName] = useState('');
  const [scenario, setScenario] = useState('literal');
  const modeFocus = useRef<HTMLButtonElement>(null);
  const errorFocus = useRef<HTMLParagraphElement>(null);
  function select(next: Entity) {
    if (selection === next) return;
    if (dirty) { setPending(next); return; }
    changeSelection(next);
  }
  function changeSelection(next: Entity) {
    setSelection(next); setMode(next === 'action' || next === 'broken' ? 'reference' : 'literal');
    setTarget(next === 'broken' ? 'missing' : 'brand'); setDirty(false); setError(''); setNotice(''); setRaw(applied);
  }
  function preset(next: string) {
    setScenario(next); setDirty(false); setError(''); setNotice(''); setRaw(initial); setApplied(initial); setQuery('');
    setView(next === 'inventory' || next === 'group' ? 'inventory' : next === 'empty' ? 'empty' : 'foundation');
    setSelection(next === 'group' ? 'group' : next === 'unresolved' ? 'broken' : next === 'reference' ? 'action' : 'brand');
    setTab(next === 'resolved' || next === 'unresolved' ? 'resolved' : 'authored');
    setMode(next === 'reference' || next === 'unresolved' ? 'reference' : 'literal');
    setTarget(next === 'unresolved' ? 'missing' : 'brand');
    if (next === 'validation') { setRaw(['red', '0', '0', '1']); setDirty(true); setError('Enter a decimal value for Red. Your input is preserved.'); }
  }
  function color(values: string[]) { return values.every((v,i) => v.trim() !== '' && Number.isFinite(Number(v)) && (i !== 3 || (Number(v) >= 0 && Number(v) <= 1))) ? `color(srgb ${values.slice(0, 3).join(' ')} / ${values[3]})` : undefined; }
  const shownColor = selection === 'broken' ? undefined : color(applied);
  const draftColor = mode === 'reference' ? target === 'missing' ? undefined : color(applied) : color(raw);
  const title = view === 'all' ? 'All tokens' : view === 'inventory' ? 'All content' : view === 'empty' ? 'semantic' : 'foundation';
  const inventory = view === 'inventory';
  const rows: Entity[] = view === 'foundation' ? ['brand'] : view === 'empty' ? [] : ['brand', 'action', 'broken'];
  const filtered = rows.filter(e => paths[e].toLowerCase().includes(query.toLowerCase()));
  function openCreate() { setParent(view === 'foundation' ? 'foundation' : view === 'empty' ? 'semantic' : 'root'); setNewName(''); setCreation(true); }
  function apply() {
    if ((mode === 'literal' && !color(raw)) || (mode === 'reference' && target === 'missing')) {
      setError(mode === 'reference' ? 'The referenced token is missing. Choose an available color token.' : raw[3].trim() !== '' && Number.isFinite(Number(raw[3])) && (Number(raw[3]) < 0 || Number(raw[3]) > 1) ? 'Alpha must be from 0 to 1. Your input is preserved.' : `Enter a decimal value for ${names[raw.findIndex(v => v.trim() === '' || !Number.isFinite(Number(v)))]}. Your input is preserved.`);
      requestAnimationFrame(() => errorFocus.current?.focus()); return;
    }
    if (mode === 'literal') setApplied([...raw]);
    setDirty(false); setError(''); setNotice('Applied in this review session.'); requestAnimationFrame(() => modeFocus.current?.focus());
  }
  const nav = <div className="p9-nav-content">
    <div className="p9-project"><strong>Precision study</strong><span>3 tokens · 2 groups</span></div>
    <p className="p9-eyebrow">Library</p>
    {([['all', 'All tokens', 'grid'], ['inventory', 'All content', 'stack'], ['foundation', 'foundation', 'folder'], ['empty', 'semantic', 'folder']] as const).map(([key, label, icon]) => <Button key={key} variant="navigation" size="navigation" className={`nav-item w-full ${view === key ? "active" : ""}`} aria-current={view === key ? 'page' : undefined} onClick={() => { setView(key); setDrawer(false); }}><Icon name={icon}/>{label}{key === 'all' && <span className="ml-auto">3</span>}</Button>)}
    <Button variant="ghost" className="mt-4" onClick={() => setNotice('Group creation is outside this mockup.')}><Icon name="plus"/>New group</Button>
  </div>;
  const isGroup = selection === 'group' || selection === 'emptyGroup';
  const identity = <Details label="Identity and path details"><dl className="p9-facts"><dt>Project identity</dt><dd>{projectId}</dd><dt>{isGroup ? 'Group' : 'Token'} identity</dt><dd>{ids[selection]}</dd></dl><Data value={{ status: 'derived', path: paths[selection].split('.') }}/></Details>;
  const exact = <Details label="All authored data"><p className="text-xs text-muted-foreground">Illustrative fixture · Applied data · Read only</p><Data value={isGroup ? { id: ids[selection], projectId, parentGroupId: null, localName: paths[selection] } : { id: ids[selection], projectId, parentGroupId: selection === 'brand' ? ids.group : null, localName: selection === 'brand' ? 'brand' : paths[selection], definition: { type: 'color' }, value: selection === 'brand' ? { kind: 'literal', valueType: 'color', colorSpace: 'srgb', components: applied.slice(0,3), alpha: applied[3] } : { kind: 'reference', targetTokenId: selection === 'broken' ? missingId : ids.brand } }}/></Details>;
  return <div className="p9-app">
    <div className="p9-review"><strong>Design V1 · Review controls</strong><label>State <select aria-label="Review state" value={scenario} onChange={e => preset(e.target.value)}>{[['literal','Literal editor'],['inventory','All content after group'],['resolved','Resolved value'],['unresolved','Unresolved reference'],['group','Group inspection'],['reference','Reference editor'],['empty','Empty group'],['validation','Invalid channel']].map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label><span>Fixture only · No browser storage or backup operations</span></div>
    <header className="p9-header"><div className="flex items-center gap-3"><Icon name="stack"/><strong>Token Workbench</strong><span className="text-muted-foreground">Precision study</span></div><div className="p9-header-actions"><Button disabled>Restore backup</Button><Button disabled>Download backup</Button><Button disabled>Projects</Button></div></header>
    <div className="p9-retention"><Icon name="info"/><span>Applied work stays in this browser profile. Drafts last only in this page. Keep independent backups.</span></div>
    <div className="p9-workspace"><nav className="p9-navigation" aria-label="Project navigation">{nav}</nav>
      <main className="p9-browser"><Button className="p9-drawer-trigger" onClick={() => setDrawer(true)}><Icon name="menu"/>Project navigation</Button>
        <div className="p9-browser-heading"><div><p className="p9-eyebrow">Library</p><h1>{title}</h1></div><Button variant="default" onClick={openCreate}><Icon name="plus"/>New token</Button></div>
        {!inventory ? <div className="p9-toolbar"><Input type="search" aria-label="Search color tokens" placeholder="Search color tokens…" value={query} onChange={e => setQuery(e.target.value)}/>{(view === 'foundation' || view === 'empty') && <Button onClick={() => setNotice(`Rename ${title} is outside this mockup.`)}>Rename group</Button>}</div> : <p className="p9-inventory-note">2 groups · 3 tokens<br/><span className="text-muted-foreground">Every group and token, including items outside the group tree.</span></p>}
        {inventory ? <div className="p9-inventory">
          <button onClick={() => select('group')} className={selection === 'group' ? 'p9-selected' : ''}><Icon name="folder"/><span><strong>foundation</strong><small>Group</small></span></button>
          <button onClick={() => select('emptyGroup')} className={selection === 'emptyGroup' ? 'p9-selected' : ''}><Icon name="folder"/><span><strong>semantic</strong><small>Group · Empty</small></span></button>
          {(['brand','action','broken'] as Entity[]).map(e => <button key={e} onClick={() => select(e)} className={selection === e ? 'p9-selected' : ''}><span className="p9-swatch" style={{ background: e === 'broken' ? undefined : color(applied) }}/><span><strong>{paths[e]}</strong><small>Color token{e === 'broken' ? ' · Unresolved reference' : ''}</small></span></button>)}
          <Details label="Full inventory identities"><Data value={[{kind:'group',path:'foundation',id:ids.group},{kind:'group',path:'semantic',id:'1a2f08f4-b094-4ccd-9b9b-7a3f3cbfa41c'},...(['brand','action','broken'] as Entity[]).map(e => ({kind:'token',path:paths[e],id:ids[e]}))]}/></Details>
        </div> : filtered.length ? <div className="p9-table"><div className="p9-table-label"><span>Token</span><span>Authored value</span></div>{filtered.map(e => <button key={e} onClick={() => select(e)} className={selection === e ? 'p9-selected' : ''}><div className="flex items-center gap-3"><span className="p9-swatch" style={{background:e === 'broken' ? undefined : color(applied)}}/><span><strong>{paths[e]}</strong><small>{e === 'brand' ? 'Primitive' : 'Semantic'} · Color</small></span></div><span className="p9-row-value">{e === 'brand' ? <>sRGB<small>R: {applied[0]} · G: {applied[1]} · B: {applied[2]} · Alpha: {applied[3]}</small></> : <>Reference<small>{e === 'broken' ? 'Missing target' : paths.brand}</small></>}</span></button>)}</div> : <div className="p9-empty"><h2>{query ? 'No matching color tokens' : `No color tokens in ${title}`}</h2><p>{query ? 'Try a different search.' : 'Create a color token in this group.'}</p><Button onClick={() => query ? setQuery('') : openCreate()}>{query ? 'Clear search' : 'Create color token'}</Button></div>}
        {!inventory && !isGroup && !filtered.includes(selection) && <div className="p9-outside"><span>Selected item is outside this list.</span><Button size="sm" onClick={() => { setView('all'); setQuery(''); }}>Show selected token</Button></div>}
        <Details label="Project diagnostics"><p>One unresolved reference: action.secondary.</p><Button size="sm" onClick={() => { select('broken'); setTab('resolved'); }}>Inspect token</Button></Details>
        <p role="status" className="p9-notice">{notice}</p>
      </main>
      <aside className="p9-inspector" aria-label="Inspector"><div className="p9-inspector-bar"><strong>Inspector</strong>{!isGroup && <div className="p9-previews"><span>Applied<i style={{background:shownColor}}/></span>{tab === 'authored' && <span>Draft<i style={{background:draftColor}}/></span>}</div>}{isGroup && <span>Inspection only</span>}</div>
        <div className="p9-inspector-scroll"><div className="p9-entity-heading"><p className="p9-eyebrow">{isGroup ? 'Group · Read only' : 'Color token'}</p><h2>{paths[selection]}</h2>{!isGroup && <p className="text-xs text-muted-foreground">{selection === 'brand' ? 'Primitive · Unconditional' : 'Semantic · Unconditional'}</p>}</div>
        {isGroup ? <div className="p9-section"><h3>Path</h3><p className="mt-2">{paths[selection]}</p>{identity}{exact}</div> : <>
          <div className="p9-tabs" role="tablist" aria-label="Token inspection">{[['authored','Authored value'],['resolved','Resolved & trace']].map(([v,l]) => <button role="tab" aria-selected={tab===v} key={v} onClick={() => setTab(v)}>{l}</button>)}</div>
          {tab === 'authored' ? <div className="p9-section" role="tabpanel" aria-label="Authored value"><div className="flex justify-between items-center mb-3"><h3>Value</h3>{dirty && <span className="p9-draft">Unapplied draft</span>}</div>
            <div className="p9-source" aria-label="Value source">{[['literal','Literal color'],['reference','Reference']].map(([v,l]) => <Button key={v} ref={v === 'literal' ? modeFocus : undefined} variant="mode" size="mode" aria-pressed={mode===v} onClick={() => {setMode(v);setDirty(true);setError('');}}>{l}</Button>)}</div>
            {mode === 'literal' ? <><div className="p9-field"><label htmlFor="space">View color space</label><Select id="space" value="srgb" onChange={() => {}}><option value="srgb">sRGB</option></Select></div><div className="p9-field"><label htmlFor="scale">RGB entry scale</label><Select id="scale" value="normalized" onChange={() => {}}><option value="normalized">Normalized · 0–1</option></Select></div>
              <div className="p9-channels">{names.map((name,i) => <div className="p9-channel" key={name}><label htmlFor={`channel-${i}`}>{name}</label><div><input type="range" aria-label={`${name} slider`} min="0" max="1" step="0.01" value={Number.isFinite(Number(raw[i])) ? Number(raw[i]) : 0} onChange={e => { const next=[...raw];next[i]=e.target.value;setRaw(next);setDirty(true);setError(''); }}/><Input id={`channel-${i}`} inputMode="decimal" value={raw[i]} aria-invalid={!!error && (raw[i].trim()==='' || !Number.isFinite(Number(raw[i])) || (i===3 && (Number(raw[i])<0 || Number(raw[i])>1)))} onChange={e => {const next=[...raw];next[i]=e.target.value;setRaw(next);setDirty(true);setError('');}}/></div></div>)}</div>
              <Details label="About color views and precision"><p>Switching display views does not replace the authored color. Input text is preserved until Apply.</p></Details></> : <><div className="p9-field"><label htmlFor="reference">Target token</label><Select id="reference" value={target} onChange={e => {setTarget(e.target.value);setDirty(true);setError('');}}><option value="brand">foundation.brand</option><option value="missing">Missing target · {missingId}</option></Select></div><p className="text-xs text-muted-foreground">Uses the whole color value of the selected token.</p>{target==='missing' && <p className="p9-error">The referenced token is missing. Choose an available color token before applying.</p>}</>}
            {error && <p className="p9-error" role="alert" ref={errorFocus} tabIndex={-1}>{error}</p>}
            <p role="status" className="p9-draft-status">{dirty ? 'Changes are not applied yet.' : 'No unapplied changes.'}</p>
            <Details label="Metadata · Read only"><dl className="p9-facts"><dt>Semantic role</dt><dd>{selection==='brand'?'Unspecified':'Action'}</dd><dt>Parent group</dt><dd>{selection==='brand'?'foundation':'Project root'}</dd><dt>Regeneration</dt><dd>Allowed</dd></dl>{identity}</Details>{exact}
          </div> : <div className="p9-section" role="tabpanel" aria-label="Resolved value"><h3>Resolved applied value</h3><p className="text-xs text-muted-foreground mt-1">Unapplied drafts do not change this result.</p>{selection === 'broken' ? <div className="p9-error" role="status"><strong>Cannot resolve this token</strong><p>action.secondary references a missing token. Authored data is retained.</p><p className="p9-id">Missing target: {missingId}</p></div> : <><div className="p9-resolved-specimen" style={{background:shownColor}}/><h3>sRGB</h3><dl className="p9-values">{names.map((n,i)=><div key={n}><dt>{n}</dt><dd>{applied[i]}</dd></div>)}</dl><p className="text-xs text-muted-foreground">Browser preview; appearance depends on your display.</p></>}
            <h3 className="mt-5 mb-3">Resolution trace</h3><ol className="p9-trace"><li><strong>{paths[selection]}</strong><span>{selection==='brand'?'Authored color value':selection==='broken'?'References a missing token':`References ${paths.brand}`}</span></li>{selection==='action' && <li><strong>{paths.brand}</strong><span>Authored color value</span></li>}</ol>
            <h3 className="mt-5 mb-2">Resolution diagnostics</h3><p>{selection==='broken'?'Missing reference target.':'No resolution issues.'}</p>
            <Details label="Resolution data and identities"><Data value={{status:selection==='broken'?'unresolved':'resolved', tokenId:ids[selection], ...(selection==='broken'?{reason:'missing-reference',targetTokenId:missingId}:{value:{kind:'literal',valueType:'color',colorSpace:'srgb',components:applied.slice(0,3),alpha:applied[3]}}),trace:selection==='action'?[{tokenId:ids.action,targetTokenId:ids.brand},{tokenId:ids.brand}]:[{tokenId:ids[selection],...(selection==='broken'?{targetTokenId:missingId}:{})}],diagnostics:selection==='broken'?[{code:'missing-reference',targetTokenId:missingId}]:[]}}/></Details>{exact}
          </div>}
        </>}
        </div>{!isGroup && tab==='authored' && <div className="p9-actions"><Button disabled={!dirty} onClick={() => {setRaw([...applied]);setDirty(false);setError('');setNotice('Draft cancelled.');modeFocus.current?.focus();}}>Cancel</Button><Button variant="default" disabled={!dirty} onClick={apply}>Apply changes</Button></div>}
      </aside></div>
    <footer className="p9-footer"><span>3 tokens · 2 groups</span><span>Applied state retained locally</span><Button size="sm" disabled>Request persistent storage</Button></footer>
    <Dialog.Root open={drawer} onOpenChange={setDrawer}><DialogContent className="p9-nav-dialog"><Dialog.Title>Project navigation</Dialog.Title><Dialog.Description>Choose the content shown in the library.</Dialog.Description>{nav}<Dialog.Close render={<Button/>}>Close navigation</Dialog.Close></DialogContent></Dialog.Root>
    <Dialog.Root open={pending!==null} onOpenChange={open => {if(!open)setPending(null);}}><DialogContent className="p9-dialog"><Dialog.Title>Discard unapplied changes?</Dialog.Title><Dialog.Description>Choosing another item discards this draft. Applied values are unchanged.</Dialog.Description><div className="flex justify-end gap-2 mt-5"><Dialog.Close render={<Button/>}>Keep editing</Dialog.Close><Button variant="default" onClick={() => {if(pending)changeSelection(pending);setPending(null);}}>Discard draft</Button></div></DialogContent></Dialog.Root>
    <Dialog.Root open={creation} onOpenChange={setCreation}><DialogContent className="p9-dialog"><Dialog.Title>Create color token</Dialog.Title><Dialog.Description>Choose a name and parent group.</Dialog.Description><div className="p9-field"><label htmlFor="new-name">Local name</label><Input id="new-name" value={newName} onChange={e=>setNewName(e.target.value)}/></div><div className="p9-field"><label htmlFor="parent">Parent group</label><Select id="parent" value={parent} onChange={e=>setParent(e.target.value)}><option value="root">Project root</option><option value="foundation">foundation</option><option value="semantic">semantic</option></Select></div><p className="text-xs text-muted-foreground">Review mockup: creation is not submitted.</p><div className="flex justify-end gap-2 mt-5"><Dialog.Close render={<Button/>}>Cancel</Dialog.Close><Button variant="default" disabled={!newName.trim()} onClick={()=>{setCreation(false);setNotice(`Creation preview: ${newName} in ${parent==='root'?'Project root':parent}. No token was created.`);}}>Preview creation</Button></div></DialogContent></Dialog.Root>
  </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
