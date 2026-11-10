from pathlib import Path
import json,hashlib,difflib
root=Path(__file__).resolve().parents[2];out=Path(__file__).resolve().parent
a=(root/'src/presentation/TokenList.tsx').read_text();row=a[a.index('          <button'):a.index('\n        );',a.index('          <button'))]
row=row.replace('t.authored.id','t.id').replace('t.authored.layer','t.layer').replace('t.authored.description','t.description').replace('t.authored.definition?.type','t.type').replace('labels.get(t.id)','t.label').replace('preview.css','t.preview.css').replace('<AuthoredValue value={v} project={project} layout="compact" />','<Summary data={t.summary} layout="compact" />')
(out/'Row.tsx').write_text('import {Swatch} from "@presentation/components/swatch";\nimport {Summary} from "./Summary";\nimport type {RowData} from "./projections";\nexport function Row({t,selected,onSelect}:{t:RowData;selected?:string;onSelect:(id:string)=>void}){return (\n'+row+'\n);}\n')
a=(root/'src/presentation/Editor.tsx').read_text();s=a
s=s.replace('import { AuthoredValue } from "@presentation/AuthoredValue";','import {Summary} from "./Summary";\nimport type {SelectedEditor,Derived,Preview} from "./projections";')
s=s.replace('  inspection: i,\n  project,\n  inspect,','  data: token,\n  derived,\n  targetPreview,\n  requestPreview,\n  rawText,\n  requestRaw,\n  requestDerived,')
s=s.replace('  inspection: TokenInspection;\n  project: ProjectReadback;\n  inspect: (id: string) => TokenInspection | undefined;','  data:SelectedEditor;\n  derived?:Derived;\n  targetPreview?:Preview;\n  requestPreview:(id:string,context:string)=>void;\n  rawText?:string;\n  requestRaw:()=>void;\n  requestDerived:()=>void;')
s=s.replace('  const token = i.authored,\n    value = token.definition?.assignments[0]?.value;','  const value = token.baseline;')
s=s.replace('  const applied = colorPreview(resolvedColor(i));\n  const targetInspection = session.reference\n    ? inspect(session.reference)\n    : undefined;','  const applied = token.preview;\n  useEffect(()=>{if(session.mode==="reference")requestPreview(session.reference,JSON.stringify([session.mode,session.reference,session.viewSpace,session.scale]));},[session.mode,session.reference,session.viewSpace,session.scale,requestPreview]);')
s=s.replace('colorPreview(resolvedColor(targetInspection))','(targetPreview ?? {message:"Preparing reference preview…"})')
start=s.index('  const tokenLabels = identityLabels(');end=s.index('  function apply()',start)
s=s[:start]+'  const referenceChoices = token.references;\n  const editable = token.editable;\n  useEffect(()=>{if(tab==="resolved")requestDerived();},[tab,requestDerived]);\n'+s[end:]
s=s.replace('token.definition?.type','token.type').replace('tokenLabels.get(token.id)','token.label')
s=s.replace('!project.tokens.some(\n                          (t) => t.authored.id === session.reference,\n                        )','!referenceChoices.some(t => t.id === session.reference)')
s=s.replace('t.authored.id','t.id').replace('referenceLabels.get(t.id)','t.label')
s=s.replace('<AuthoredValue value={value} project={project} />','<Summary data={token.summary} />')
s=s.replace('token.authoring.regeneration','token.regeneration')
s=s.replace('token.parentGroupId ? groupLabels.get(token.parentGroupId) ?? "Missing group" : "Project root"','token.parentLabel')
s=s.replace('            <details>','            <details onToggle={e=>{if(e.currentTarget.open)requestRaw();}}>')
s=s.replace('              <pre className="exact-data whitespace-pre-wrap text-caption my-3 max-w-full wrap-anywhere">\n                {JSON.stringify(token, null, 2)}\n              </pre>','              {rawText===undefined?<p role="status">Preparing authored data…</p>:<pre data-raw="complete" tabIndex={0} aria-label="All authored data exact text" className="exact-data raw-source text-caption my-3 max-w-full">{rawText}</pre>}')
start=s.index('          {i.resolution.status');end=s.index('\n        </Tabs.Panel>',start)
s=s[:start]+'''          {derived===undefined?<p role="status">Preparing resolved value and trace…</p>:derived.status==='unavailable'?<p role="status">{derived.reason}. Authored data retained.</p>:<>
          {derived.resolved!==undefined?<pre className="exact-data raw-source text-caption my-3 max-w-full">{derived.resolved}</pre>:<p role="status">Unresolved: {derived.reason}. Authored data retained.</p>}
          <h3 className="trace-heading mt-7">Resolution trace</h3>
          <ol className="trace list-none mt-4.5 mb-6 p-0">{derived.trace.map((step,index)=><li className="relative pb-6 pl-6" key={index}><span className="trace-dot size-2.75 left-0 top-1 border-2 border-trace bg-background absolute rounded-full"/><strong className="block text-caption font-medium wrap-anywhere">{step.label}</strong><small className="mono block mt-1 text-muted-foreground">{step.id}{step.target?` → ${step.target}`:' · authored value'}</small></li>)}</ol>
          <h3>Resolution diagnostics</h3><pre className="exact-data raw-source text-caption my-3 max-w-full">{derived.diagnostics}</pre></>}
'''+s[end:]
(out/'Editor.tsx').write_text(s)
files=['src/presentation/TokenList.tsx','src/presentation/Editor.tsx','src/presentation/AuthoredValue.tsx','src/presentation/ColorFields.tsx','src/presentation/ProjectNavigation.tsx','src/presentation/session.ts','src/presentation/readback.ts','src/presentation/styles.css','research/increment-007-rendering-qualification/fixtures.mjs','research/increment-007-stage-a/fixtures.mjs','research/increment-007-stage-a/codec.mjs']
(out/'provenance.json').write_text(json.dumps({p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in files},indent=2)+'\n')
(root/'output/increment-007-detail-projection-comparison/editor-projection.diff').write_text(''.join(difflib.unified_diff(a.splitlines(True),s.splitlines(True),fromfile='production/Editor.tsx',tofile='isolated/Editor.tsx')))
