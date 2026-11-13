import React, { useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Dialog } from '@base-ui/react/dialog';
import { Button } from '@presentation/components/ui/button';
import { Input } from '@presentation/components/ui/input';
import { Select } from '@presentation/components/ui/select';
import { Icon } from '@presentation/components/ui/icon';
import { DialogContent } from '@presentation/components/ui/dialog-content';
import './prototype.css';

type Item = { id: string; name: string; kind: 'group' | 'token'; parent: string | null; type?: string; unavailable?: boolean; created?: boolean; description?: string; layer?: string };
const projectId = '378664d4-aa05-4f4a-be54-207102a3486b';
const gid = 'accd6060-6e20-41c8-8c9d-0a6891eb3e55';
const id = (tail: string) => `0852fdac-e5cf-4bf6-8f88-${tail.padStart(12, '0')}`;
const fixtures: Item[] = [
  { id: gid, name: 'foundation', kind: 'group', parent: null },
  { id: id('1'), name: 'Brand\u00a0Blue', kind: 'token', parent: gid, type: 'color' },
  { id: id('2'), name: 'brandblue', kind: 'group', parent: gid },
  { id: id('3'), name: 'Brand\u00a0Blue', kind: 'token', parent: gid, type: 'dimension' },
  { id: id('4'), name: 'Straße', kind: 'token', parent: null, type: 'string' },
  { id: id('5'), name: 'É', kind: 'token', parent: gid, type: 'color' },
  { id: id('6'), name: 'Palette', kind: 'group', parent: null },
  { id: id('7'), name: 'brandblue', kind: 'token', parent: id('6'), type: 'color' },
  { id: id('8'), name: 'Orphan\u200dBlue', kind: 'token', parent: 'missing-parent-identity', type: 'color', unavailable: true },
];
const presets = [ ['prepared', '1 · Prepared name'], ['collision', '2 · Case / spacing collision'], ['fold', '3 · Straße / STRASSE'], ['accent', '4 · Accent / NFC'], ['rename', '5 · Group rename + descendants'], ['legacy', '6 · Existing conflicts'], ['unavailable', '7 · Unavailable path'], ['empty', '8 · Empty prepared name'] ];
// Demo only: host casing/NFC and selected full-fold mappings. Never a Unicode-17 validator.
const removeR = (s: string) => s.replace(/[\u0009-\u000d\u0020\u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000\u200b\u2060\ufeff]/g, '');
const prepare = (s: string) => removeR(s).normalize('NFC').toLowerCase().normalize('NFC');
const key = (s: string) => removeR(s).normalize('NFD').toLowerCase().replace(/ß/g, 'ss').replace(/ς/g, 'σ').normalize('NFD');
function path(item: Item, items: Item[], seen = new Set<string>()): string[] | null {
  if (item.unavailable || seen.has(item.id)) return null;
  if (!item.parent) return [item.name];
  const parent = items.find(i => i.id === item.parent);
  if (!parent) return null;
  const above = path(parent, items, new Set([...seen, item.id]));
  return above ? [...above, item.name] : null;
}
const same = (a: string[] | null, b: string[] | null) => !!a && !!b && a.length === b.length && a.every((s, i) => key(s) === key(b[i]));
const label = (segments: string[] | null) => segments ? segments.join('.') : 'Path unavailable';
function Details({ label, children }: { label: string; children: React.ReactNode }) { return <details className="p9-details"><summary>{label}</summary><div>{children}</div></details>; }
function Data({ value }: { value: unknown }) { return <pre className="p9-data" tabIndex={0}>{JSON.stringify(value, null, 2)}</pre>; }
function App() {
  const [scenario, setScenario] = useState('prepared');
  const [items, setItems] = useState(fixtures);
  const [selection, setSelection] = useState(id('1'));
  const [view, setView] = useState('foundation');
  const [drawer, setDrawer] = useState(false);
  const [form, setForm] = useState<'create' | 'rename' | null>('create');
  const [raw, setRaw] = useState(' Brand\u00a0 Blue ');
  const [parent, setParent] = useState('root');
  const [description, setDescription] = useState('');
  const [layer, setLayer] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [notice, setNotice] = useState('');
  const errorRef = useRef<HTMLDivElement>(null);
  const createRef = useRef<HTMLButtonElement>(null);
  const selected = items.find(i => i.id === selection)!;
  const prepared = prepare(raw);
  const parentItem = items.find(i => i.id === parent);
  const candidatePath = parent === 'root' ? [prepared] : [...(parentItem ? path(parentItem, items) ?? [] : []), prepared];
  const conflicts = items.filter(i => same(path(i, items), candidatePath));
  const renameCandidate = items.map(i => i.id === gid ? { ...i, name: prepared } : i);
  const affected = items.filter(i => i.id === gid || i.parent === gid);
  const renameConflicts = affected.flatMap(i => {
    const next = renameCandidate.find(j => j.id === i.id)!;
    return items.filter(j => j.id !== i.id && !affected.some(a => a.id === j.id) && same(path(next, renameCandidate), path(j, items))).map(j => ({ item: i, other: j, candidate: path(next, renameCandidate) }));
  });
  const blocked = !prepared || (form === 'rename' ? renameConflicts.length > 0 : conflicts.length > 0);
  const conflictIds = new Set(items.filter(i => items.some(j => i.id !== j.id && same(path(i, items), path(j, items)))).map(i => i.id));
  const shown = view === 'all' ? items.filter(i => i.kind === 'token') : view === 'foundation' ? items.filter(i => i.parent === gid && i.kind === 'token') : items;
  function preset(next: string) {
    setScenario(next); setItems(fixtures); setDescription(''); setLayer(''); setSubmitted(false); setNotice(''); setDrawer(false); setParent(next === 'fold' ? 'root' : gid);
    setView(next === 'legacy' || next === 'unavailable' ? 'inventory' : 'foundation');
    setSelection(next === 'unavailable' ? id('8') : next === 'rename' ? gid : id('1'));
    setForm(next === 'legacy' || next === 'unavailable' ? null : next === 'rename' ? 'rename' : 'create');
    setRaw(next === 'prepared' ? ' Brand\u00a0 Blue ' : next === 'collision' ? ' BRAND Blue ' : next === 'fold' ? 'STRASSE' : next === 'accent' ? 'E\u0301' : next === 'rename' ? ' Palette ' : next === 'empty' ? '\u00a0\u200b\u2060\ufeff' : ' New Accent ');
    if (next === 'prepared') setParent('root');
  }
  function openCreate() { setDescription(''); setLayer(''); setRaw(''); setParent(view === 'foundation' ? gid : 'root'); setSubmitted(false); setForm('create'); }
  function submit() {
    setSubmitted(true);
    if (blocked) { requestAnimationFrame(() => errorRef.current?.focus()); return; }
    if (form === 'rename') {
      setItems(renameCandidate); setNotice(`Group renamed to ${prepared}. Descendant names and identities are unchanged.`);
    } else {
      const next: Item = { id: id(String(100 + items.length)), name: prepared, kind: 'token', parent: parent === 'root' ? null : parent, type: 'color', created: true, description, layer };
      setItems([...items, next]); setSelection(next.id); setView('inventory'); setNotice(`Created ${label(candidatePath)}. Existing names, identities and conflicts are unchanged.`);
    }
    setForm(null); requestAnimationFrame(() => createRef.current?.focus());
  }
  function row(item: Item) {
    const segments = path(item, items);
    return <button key={item.id} className={selection === item.id ? 'p9-selected' : ''} aria-pressed={selection === item.id} onClick={() => setSelection(item.id)}>
      {item.kind === 'group' ? <Icon name="folder"/> : <span className="p9-swatch"/>}
      <span className="p9-entry-copy"><strong>{label(segments)}</strong><small>{item.kind === 'group' ? 'Group' : `${item.type} token`}{conflictIds.has(item.id) && <span className="p9-conflict"> · Path conflict</span>}{!segments && <span className="p9-conflict"> · Missing parent</span>}</small>
      {(conflictIds.has(item.id) || !segments) && <><small>Parent: {item.parent === gid ? 'foundation' : item.parent ?? 'Project root'} · Precision study</small><code className="p9-entry-id">{item.id}</code></>}</span>
    </button>;
  }
  const nav = <div className="p9-nav-content"><div className="p9-project"><strong>Precision study</strong><span>{items.filter(i => i.kind === 'token').length} tokens · {items.filter(i => i.kind === 'group').length} groups</span></div><p className="p9-eyebrow">Library</p>{[['all','All tokens','grid'],['inventory','All content','stack'],['foundation','foundation','folder']].map(([v,l,icon]) => <Button key={v} variant="navigation" size="navigation" className={`nav-item w-full ${view === v ? 'active' : ''}`} aria-current={view === v ? 'page' : undefined} onClick={() => {setView(v);setDrawer(false);}}><Icon name={icon as 'grid' | 'stack' | 'folder'}/>{l}</Button>)}</div>;
  return <div className="p9-app">
    <div className="p9-review"><strong>Design V2 · Review controls</strong><label>State <select value={scenario} onChange={e => preset(e.target.value)}>{presets.map(([v,l]) => <option key={v} value={v}>{l}</option>)}</select></label><span>Fixed Unicode examples · Limited demo comparison · Session only</span></div>
    <header className="p9-header"><div className="flex items-center gap-3"><Icon name="stack"/><strong>Token Workbench</strong><span className="text-muted-foreground">Precision study</span></div><div className="p9-header-actions"><Button disabled>Restore backup</Button><Button disabled>Download backup</Button><Button disabled>Projects</Button></div></header>
    <div className="p9-retention"><Icon name="info"/><span>Applied work stays in this browser profile. Drafts last only in this page. Keep independent backups.</span></div>
    <div className="p9-workspace"><nav className="p9-navigation" aria-label="Project navigation">{nav}</nav>
    <main className="p9-browser"><Button className="p9-drawer-trigger" onClick={() => setDrawer(true)}><Icon name="menu"/>Project navigation</Button><div className="p9-browser-heading"><div><p className="p9-eyebrow">Library</p><h1>{view === 'inventory' ? 'All content' : view === 'all' ? 'All tokens' : 'foundation'}</h1></div><Button ref={createRef} variant="default" onClick={openCreate}><Icon name="plus"/>New token</Button></div>
      {view === 'foundation' && <div className="p9-toolbar"><span className="text-xs text-muted-foreground">Color and other tokens in this group</span><Button className="ml-auto" onClick={() => {setForm('rename');setRaw('foundation');setSubmitted(false);}}>Rename group</Button></div>}
      <div className="p9-legacy-notice"><Icon name="info"/><p>{conflictIds.size} items share conflicting paths. Select an item by its identity to inspect its exact data. Existing names are preserved.</p></div>
      <div className="p9-inventory">{shown.map(row)}</div><p className="p9-notice" role="status">{notice}</p>
    </main>
    <aside className="p9-inspector" aria-label="Inspector"><div className="p9-inspector-bar"><strong>Inspector</strong><span>Inspection</span></div><div className="p9-inspector-scroll"><div className="p9-entity-heading"><p className="p9-eyebrow">{selected.kind === 'group' ? 'Group' : `${selected.type} token`}</p><h2>{label(path(selected, items))}</h2><p className="text-xs text-muted-foreground">Exact authored name: <span className="p9-exact-name">{selected.name}</span></p></div>
      <div className="p9-section">{conflictIds.has(selected.id) && <div className="p9-error"><strong>This path is shared</strong><p>This item is selected by its exact identity. Existing names are preserved; no automatic rename or merge occurs.</p></div>}
      {selected.unavailable && <div className="p9-error"><strong>Path unavailable</strong><p>The parent group is missing. This item remains accessible by identity. No replacement path has been invented.</p></div>}
      <dl className="p9-facts"><dt>{selected.kind === 'group' ? 'Group' : 'Token'} identity</dt><dd><code>{selected.id}</code></dd><dt>Project</dt><dd>Precision study</dd><dt>Parent group</dt><dd>{selected.parent === gid ? 'foundation' : selected.parent ?? 'Project root'}</dd><dt>Path segments</dt><dd>{path(selected, items) ? <code>{JSON.stringify(path(selected, items))}</code> : 'Unavailable · Missing parent group'}</dd></dl>
      {selected.type === 'color' && <><h3 className="mt-5">Authored value</h3><div className={`p9-resolved-specimen ${selected.created ? 'p9-black-color' : 'p9-example-color'}`}/><p className="text-xs">{selected.created ? 'sRGB · R 0 · G 0 · B 0 · Alpha 1' : 'sRGB · R 0.18 · G 0.32 · B 0.64 · Alpha 1'}</p></>}
      <Details label="Exact authored source"><Data value={{id:selected.id, projectId, parentGroupId:selected.parent, localName:selected.name, ...(selected.created ? {description:selected.description,layer:selected.layer || 'unspecified'} : {}), ...(selected.kind === 'token' ? {definition:{type:selected.type}, value: selected.type === 'color' ? {kind:'literal',valueType:'color',colorSpace:'srgb',components:selected.created ? [0,0,0] : [0.18,0.32,0.64],alpha:1} : selected.type === 'dimension' ? {kind:'literal',valueType:'dimension',value:16,unit:'px'} : {kind:'literal',valueType:'string',value:'Street'}} : {})}}/></Details>
      <Details label="Identity and path details"><Data value={{projectId,entityId:selected.id,path:path(selected,items) ? {status:'derived',segments:path(selected,items)} : {status:'unavailable',reason:'missing-parent',parentGroupId:selected.parent}}}/></Details>
      </div></div></aside></div>
    <footer className="p9-footer"><span>Precision study</span><span>Applied state retained locally</span><Button size="sm" disabled>Request persistent storage</Button></footer>
    <Dialog.Root open={drawer} onOpenChange={setDrawer}><DialogContent className="p9-nav-dialog"><Dialog.Title>Project navigation</Dialog.Title><Dialog.Description>Choose the content shown in the library.</Dialog.Description>{nav}<Dialog.Close render={<Button/>}>Close navigation</Dialog.Close></DialogContent></Dialog.Root>
    <Dialog.Root open={form !== null} onOpenChange={open => {if (!open) setForm(null);}}><DialogContent className="p9-dialog p9-name-dialog"><Dialog.Title>{form === 'rename' ? 'Rename foundation' : 'Create color token'}</Dialog.Title><Dialog.Description>{form === 'rename' ? 'Only this group name changes. Descendant names and identities stay the same.' : 'Choose a name and parent group. Start with an explicit Color literal.'}</Dialog.Description>
      <form onSubmit={e => {e.preventDefault();submit();}}><div className="p9-form-scroll"><div className="p9-field"><label htmlFor="new-name">Local name</label><Input id="new-name" value={raw} aria-describedby="name-help name-preview" aria-invalid={submitted && blocked} onChange={e => {setRaw(e.target.value);setSubmitted(false);}}/><p id="name-help" className="p9-help">Spacing is removed; names use lowercase. Accents are kept.</p></div>
      {form === 'create' ? <div className="p9-field"><label htmlFor="parent">Parent group</label><Select id="parent" value={parent} onChange={e => {setParent(e.target.value);setSubmitted(false);}}><option value="root">Project root</option><option value={gid}>foundation</option><option value={id('6')}>Palette</option></Select></div> : <p className="p9-help mt-3">Parent: Project root</p>}
      {form === 'create' && <Details label="Description and layer"><div className="p9-field"><label htmlFor="description">Description (optional)</label><textarea id="description" rows={2} className="w-full rounded-md border border-border p-2 text-xs" value={description} onChange={e => setDescription(e.target.value)}/></div><div className="p9-field"><label htmlFor="layer">Layer</label><Select id="layer" value={layer} onChange={e => setLayer(e.target.value)}><option value="">Unspecified</option><option value="primitive">Primitive</option><option value="semantic">Semantic</option></Select></div></Details>}
      <div id="name-preview" className="p9-name-preview" aria-live="polite"><span>Name to save</span><strong>{prepared || 'No name remains'}</strong><span>{form === 'rename' ? 'New group path' : 'New token path'}</span><code>{!prepared ? 'No valid path yet' : form === 'rename' ? prepared : label(candidatePath)}</code></div>
      {(!prepared || (form === 'rename' ? renameConflicts.length : conflicts.length) > 0) && <div ref={errorRef} tabIndex={-1} className="p9-error" role={submitted ? 'alert' : 'status'}>
        <strong>{!prepared ? 'Enter a name that contains more than spacing.' : form === 'rename' ? 'This rename would create path conflicts.' : 'This path is already in use.'}</strong>
        {!!prepared && <><p>{form === 'rename' ? 'The group and affected descendant paths are checked together.' : 'Names are compared without spacing or case differences, across groups and all token types.'}</p><ul className="p9-conflict-list">{form === 'rename' ? renameConflicts.map(c => <li key={`${c.item.id}${c.other.id}`}><strong>{label(c.candidate)}</strong><span>{c.item.id === gid ? 'Renamed group' : 'Affected descendant'} conflicts with {c.other.kind}: {label(path(c.other, items))}</span><code>{c.other.id}</code></li>) : conflicts.map(c => <li key={c.id}><strong>{label(path(c, items))}</strong><span>{c.kind === 'group' ? 'Group' : `${c.type} token`} · Parent: {c.parent === gid ? 'foundation' : c.parent ?? 'Project root'}</span><code>{c.id}</code></li>)}</ul></>}
        {submitted && <p>No changes were made. Your input is preserved.</p>}
      </div>}
      {scenario === 'fold' && <p className="p9-help mt-3">Stored lowercase and caseless comparison are different: “Straße” stores as “straße”, while “STRASSE” stores as “strasse”. These compare equal. Existing “Straße” stays exact.</p>}
      {scenario === 'accent' && <p className="p9-help mt-3">“E” + combining acute becomes “é”. It matches “É”; “e” remains a different name.</p>}
      {form === 'create' && <p className="p9-help mt-3">Initial value: sRGB · Red 0 · Green 0 · Blue 0 · Alpha 1 (opaque black). Revise it or replace it with a reference in the editor.</p>}
      </div><div className="p9-form-actions flex justify-end gap-2"><Dialog.Close render={<Button type="button"/>}>Cancel</Dialog.Close><Button type="submit" variant="default">{form === 'rename' ? 'Rename group' : 'Create token'}</Button></div></form>
    </DialogContent></Dialog.Root>
  </div>;
}
createRoot(document.getElementById('root')!).render(<App/>);
