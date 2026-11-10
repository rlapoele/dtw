from pathlib import Path
import hashlib,json
root=Path(__file__).resolve().parents[2]
out=Path(__file__).resolve().parent
s=(root/'src/presentation/TokenList.tsx').read_text()
row=s[s.index('          <button'):s.index('\n        );',s.index('          <button'))]
row=row.replace('{labels.get(t.authored.id)}','{label}')
imports=s[:s.index('export function TokenList')]
(out/'Row.tsx').write_text(imports+'''\nexport function Row({t, selected, label, preview, project, onSelect}: any) { const v=t.authored.definition?.assignments[0]?.value; return (\n'''+row+'''\n); }\n''')
s=(root/'src/presentation/Editor.tsx').read_text().replace('useEffect, useLayoutEffect, useRef, useState','useEffect, useLayoutEffect, useRef, useState, useMemo')
s=s.replace('export function Editor({','export function Editor({').replace('  readUnavailable,\n','  readUnavailable,\n  rawText, requestRaw,\n',1)
s=s.replace('  readUnavailable: boolean;','  readUnavailable: boolean;\n  rawText?: string;\n  requestRaw: () => void;')
s=s.replace('  const tokenLabels = identityLabels(project.tokens);','  const tokenLabels = useMemo(() => identityLabels(project.tokens), [project]);')
s=s.replace('  const referenceChoices = project.tokens.filter(t => t.authored.definition?.type === "color");','  const referenceChoices = useMemo(() => project.tokens.filter(t => t.authored.definition?.type === "color"), [project]);')
s=s.replace('  const referenceLabels = identityLabels(referenceChoices, undefined, token.id);','  const referenceLabels = useMemo(() => identityLabels(referenceChoices, undefined, token.id), [referenceChoices, token.id]);')
s=s.replace('  const groupLabels = identityLabels(project.groups, ["Project root", "All tokens"]);','  const groupLabels = useMemo(() => identityLabels(project.groups, ["Project root", "All tokens"]), [project]);')
s=s.replace('            <details>','            <details onToggle={e => { if (e.currentTarget.open) requestRaw(); }}>')
s=s.replace('              <pre className="exact-data whitespace-pre-wrap text-caption my-3 max-w-full wrap-anywhere">\n                {JSON.stringify(token, null, 2)}\n              </pre>','''              {rawText === undefined ? <p role="status">Preparing authored data…</p> :
              <pre data-raw="complete" className="exact-data whitespace-pre-wrap text-caption my-3 max-w-full wrap-anywhere">{rawText}</pre>}''')
(out/'Editor.tsx').write_text(s)
files=['src/presentation/TokenList.tsx','src/presentation/Editor.tsx','src/presentation/AuthoredValue.tsx','src/presentation/ColorFields.tsx','src/presentation/ProjectNavigation.tsx','src/presentation/session.ts','src/presentation/readback.ts','src/presentation/styles.css']
(out/'provenance.json').write_text(json.dumps({p:hashlib.sha256((root/p).read_bytes()).hexdigest() for p in files},indent=2)+'\n')
