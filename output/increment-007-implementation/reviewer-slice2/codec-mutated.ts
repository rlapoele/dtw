import { createScanner, visit } from 'jsonc-parser';
import type { ProjectSnapshot } from '@application/project-storage';
import { TOKEN_TYPES } from '@domain/token';
import { compareDecimals, decimalFromCanonical } from '@domain/decimal';

export const retentionLimits = { fileBytes: 16_777_216, snapshotBytes: 8_388_608, projects: 25, tokens: 10_000, groups: 2_000, depth: 127, lexical: 500_000, values: 200_000, string: 65_536, strings: 4_194_304, rawString: 393_218, decimalDigits: 4096, tokenDescription: 1024 } as const;
export class AdmissionError extends Error {
  constructor(readonly code: string, readonly path: string = '', readonly observed?: number, readonly maximum?: number) { super(`${code}${path ? ` at ${path}` : ''}${observed === undefined ? '' : `: ${observed}${maximum === undefined ? '' : ` (maximum ${maximum})`}`}`); }
}
// jsonc-parser 3.3.1 scanner token values; its ambient const enum cannot be
// imported under verbatimModuleSyntax. Keep this local closed scanner mapping.
const SyntaxKind = { OpenBraceToken: 1, CloseBraceToken: 2, OpenBracketToken: 3, CloseBracketToken: 4, StringLiteral: 10, NumericLiteral: 11, LineCommentTrivia: 12, BlockCommentTrivia: 13, LineBreakTrivia: 14, Trivia: 15, Unknown: 16, EOF: 17 } as const;
type Json = null | boolean | number | string | Json[] | { [key: string]: Json };
type Obj = { [key: string]: Json };
const fail = (code: string, path = '', observed?: number, maximum?: number): never => { throw new AdmissionError(code, path, observed, maximum); };
const bound = (n: number, max: number, code: string, path = '') => { if (n > max) fail(code, path, n, max); };
function object(v: Json | undefined, required: readonly string[], optional: readonly string[] = [], path = ''): Obj {
  if (v === null || typeof v !== 'object' || Array.isArray(v)) return fail('shape', path);
  for (const k of required) if (!Object.hasOwn(v, k)) fail('missing-field', `${path}.${k}`);
  for (const k of Object.keys(v)) if (!required.includes(k) && !optional.includes(k)) fail('unsupported-field', `${path}.${k}`);
  return v;
}
function string(v: Json | undefined, path = ''): string { if (typeof v !== 'string') return fail('string-required', path); return v; }
function array(v: Json | undefined, max = Infinity, path = ''): Json[] { if (!Array.isArray(v)) return fail('array-required', path); bound(v.length, max, 'collection-limit', path); return v; }
function member(v: Json | undefined, choices: readonly string[], path = ''): string { const s = string(v, path); if (!choices.includes(s)) fail('unsupported-value', path); return s; }
function decimal(v: Json | undefined): string {
  const s = string(v); bound(s.replace(/[-.]/g, '').length, retentionLimits.decimalDigits, 'decimal-digits');
  try { decimalFromCanonical(s); } catch { return fail('canonical-decimal-required'); } return s;
}
function range(v: Json | undefined, min?: string, max?: string) {
  const d = decimalFromCanonical(decimal(v));
  if (min !== undefined && compareDecimals(d, decimalFromCanonical(min)) < 0 || max !== undefined && compareDecimals(d, decimalFromCanonical(max)) > 0) fail('literal-range');
}
function reference(v: Obj) {
  object(v, ['kind', 'targetTokenId', 'valuePath']); string(v.targetTokenId);
  for (const x of array(v.valuePath, 128)) {
    const part = object(x, ['kind'], ['key', 'index']);
    if (part.kind === 'field') { object(part, ['kind', 'key']); string(part.key); }
    else { object(part, ['kind', 'index']); member(part.kind, ['index']); if (typeof part.index !== 'number' || !Number.isSafeInteger(part.index) || part.index < 0) fail('reference-index'); }
  }
}
function literal(v: Obj) {
  member(v.kind, ['literal']); const type = string(v.valueType);
  switch (type) {
    case 'number': case 'dimension': case 'duration': case 'fontWeight': {
      object(v, ['kind', 'valueType', 'value', ...(['dimension', 'duration'].includes(type) ? ['unit'] : [])]); decimal(v.value);
      if (type === 'dimension') member(v.unit, ['px', 'rem']);
      if (type === 'duration') member(v.unit, ['ms', 's']);
      if (type === 'fontWeight') range(v.value, '1', '1000'); break;
    }
    case 'percentage': object(v, ['kind', 'valueType', 'ratio']); decimal(v.ratio); break;
    case 'boolean': object(v, ['kind', 'valueType', 'value']); if (typeof v.value !== 'boolean') fail('boolean-required'); break;
    case 'fontFamily': {
      object(v, ['kind', 'valueType', 'families']); const families = array(v.families, 256); if (!families.length) fail('empty-font-stack');
      for (const x of families) { const f = object(x, ['kind'], ['name', 'family']); if (f.kind === 'named') { object(f, ['kind', 'name']); if (!string(f.name).trim()) fail('blank-font'); } else { object(f, ['kind', 'family']); member(f.kind, ['generic']); member(f.family, ['serif', 'sans-serif', 'monospace', 'system-ui']); } } break;
    }
    case 'cubicBezier': { object(v, ['kind', 'valueType', 'controlPoints']); const points = array(v.controlPoints); if (points.length !== 4) fail('bezier-arity'); points.forEach((p, i) => range(p, i % 2 === 0 ? '0' : undefined, i % 2 === 0 ? '1' : undefined)); break; }
    case 'color': {
      object(v, ['kind', 'valueType', 'colorSpace', 'components', 'alpha']); const space = member(v.colorSpace, ['srgb', 'display-p3', 'hsl', 'oklab', 'oklch']); range(v.alpha, '0', '1'); const components = array(v.components); if (components.length !== 3) fail('color-arity');
      components.forEach((c, i) => { if (c === 'none') return; decimal(c);
        if (space === 'hsl') { if (i === 0) { range(c, '0'); if (compareDecimals(decimalFromCanonical(string(c)), decimalFromCanonical('360')) >= 0) fail('normalized-hue-required'); } else range(c, '0', '100'); }
        if (space === 'oklab' && i === 0 || space === 'oklch' && i === 0) range(c, '0', '1');
        if (space === 'oklch' && i === 1) range(c, '0');
        if (space === 'oklch' && i === 2) { range(c, '0'); if (compareDecimals(decimalFromCanonical(string(c)), decimalFromCanonical('360')) >= 0) fail('normalized-hue-required'); }
      }); break;
    }
    default: fail('unsupported-literal');
  }
}
const fields: Record<string, Record<string, string>> = {
  transition: { duration: 'duration', delay: 'duration', timingFunction: 'cubicBezier' },
  typography: { fontFamily: 'fontFamily', fontSize: 'dimension', fontWeight: 'fontWeight', letterSpacing: 'dimension', lineHeight: 'number' },
  shadow: { color: 'color', offsetX: 'dimension', offsetY: 'dimension', blur: 'dimension', spread: 'dimension', inset: 'boolean' },
};
function compositeFields(v: Obj, type: string) { for (const [key, expected] of Object.entries(fields[type])) { const x = object(v[key], ['kind'], ['valueType', 'value', 'unit', 'ratio', 'families', 'controlPoints', 'colorSpace', 'components', 'alpha', 'targetTokenId', 'valuePath']); if (x.kind === 'token-reference') reference(x); else { literal(x); if (x.valueType !== expected) fail('composite-field-type'); if (['duration', 'fontSize', 'lineHeight', 'blur'].includes(key)) range(x.value, '0'); } } }
function authoredValue(root: Json, expected: string, totals: { ast: number }) {
  const work: { value: Json; expected?: string; expressionDepth: number; operand: boolean }[] = [{ value: root, expected, expressionDepth: 0, operand: false }]; let nodes = 0;
  while (work.length) {
    const current = work.pop()!; const v = object(current.value, ['kind'], ['targetTokenId', 'valuePath', 'operation', 'operands', 'key', 'valueType', 'value', 'unit', 'ratio', 'families', 'controlPoints', 'colorSpace', 'components', 'alpha', 'duration', 'delay', 'timingFunction', 'fontFamily', 'fontSize', 'fontWeight', 'letterSpacing', 'lineHeight', 'layers']);
    if (current.operand || v.kind === 'expression') { bound(++nodes, 1024, 'assignment-ast-nodes'); bound(++totals.ast, 100_000, 'snapshot-ast-nodes'); }
    if (v.kind === 'token-reference') { reference(v); continue; }
    if (v.kind === 'expression') {
      object(v, ['kind', 'operation', 'operands']); const operation = member(v.operation, ['add', 'subtract', 'scale', 'min', 'max', 'clamp'].map(x => `portable.math.${x}.v1`)); const operands = array(v.operands); if (operands.length !== (operation.endsWith('clamp.v1') ? 3 : 2)) fail('expression-arity'); bound(current.expressionDepth + 1, 32, 'expression-depth');
      for (const x of operands) work.push({ value: x, operand: true, expressionDepth: current.expressionDepth + 1 }); continue;
    }
    if (v.kind === 'context-reference' && current.operand) { object(v, ['kind', 'key']); member(v.key, ['font.rootSize']); continue; }
    if (v.kind === 'literal') { literal(v); if (current.expected && current.expected !== v.valueType) fail('assignment-type'); continue; }
    if (v.kind === 'composite' && !current.operand) {
      const type = string(v.valueType); if (!Object.hasOwn(fields, type) || type !== current.expected) fail('unsupported-composite');
      if (type === 'shadow') { object(v, ['kind', 'valueType', 'layers']); const layers = array(v.layers, 256); if (!layers.length) fail('empty-shadow'); for (const x of layers) compositeFields(object(x, Object.keys(fields.shadow)), type); }
      else compositeFields(object(v, ['kind', 'valueType', ...Object.keys(fields[type])]), type); continue;
    }
    fail('unsupported-authored-value');
  }
}
// Descriptor traversal rejects accessors before reading values. No getters or
// inherited keys become authored data. Proxies are not accepted external JSON.
export function plainTree(root: unknown): Json {
  const active = new WeakSet<object>(); const work: { value: unknown; depth: number; leave?: boolean }[] = [{ value: root, depth: 1 }]; let count = 0, strings = 0;
  while (work.length) {
    const { value: v, depth, leave } = work.pop()!;
    if (leave) { active.delete(v as object); continue; } bound(++count, retentionLimits.values, 'semantic-values');
    if (typeof v === 'string') { bound(v.length, retentionLimits.string, 'decoded-string'); strings += v.length; }
    else if (v === null || typeof v === 'boolean') { /* scalar */ }
    else if (typeof v === 'number') { if (!Number.isSafeInteger(v) || v < 0 || Object.is(v, -0)) fail('canonical-integer-required'); }
    else if (typeof v === 'object') {
      bound(depth, retentionLimits.depth, 'snapshot-depth'); if (active.has(v)) fail('cyclic-data');
      const isArray = Array.isArray(v); if (![null, isArray ? Array.prototype : Object.prototype].includes(Object.getPrototypeOf(v))) fail('nonplain-data');
      if (Object.getOwnPropertySymbols(v).length) fail('symbol-field'); const descriptors = Object.getOwnPropertyDescriptors(v);
      if (isArray && Object.keys(descriptors).length !== v.length + 1) fail('sparse-array'); active.add(v); work.push({ value: v, depth, leave: true });
      for (const [key, descriptor] of Object.entries(descriptors)) {
        if (isArray && key === 'length') continue; if (!('value' in descriptor) || !descriptor.enumerable) fail('accessor-or-hidden-field');
        if (isArray && (!/^(0|[1-9]\d*)$/.test(key) || Number(key) >= v.length)) fail('array-field');
        if (!isArray) { bound(key.length, retentionLimits.string, 'decoded-key'); strings += key.length; }
        bound(work.length + count, retentionLimits.values * 2, 'scheduled-values'); work.push({ value: descriptor.value, depth: depth + 1 });
      }
    } else fail('nonserializable-data');
    bound(strings, retentionLimits.strings, 'decoded-string-total');
  }
  return root as Json;
}
export function utf8Bytes(text: string): number {
  let n = 0; for (let i = 0; i < text.length; i++) { const c = text.charCodeAt(i); if (c < 128) n++; else if (c < 2048) n += 2; else if (c >= 0xd800 && c <= 0xdbff && i + 1 < text.length && text.charCodeAt(i + 1) >= 0xdc00 && text.charCodeAt(i + 1) <= 0xdfff) { n += 4; i++; } else n += 3; } return n;
}
// Closed shapes are emitted deterministically; array/operand order stays exact.
const schemaKeys = 'format formatVersion authoredVersion createdAt snapshot project groups tokens id name description projectId localName parentGroupId layer semanticRole componentDefinitionId definition type assignments condition value authoring regeneration kind valueType colorSpace components alpha unit ratio families family controlPoints duration delay timingFunction fontFamily fontSize fontWeight letterSpacing lineHeight layers color offsetX offsetY blur spread inset targetTokenId valuePath key index operation operands'.split(' ');
const schemaRank = new Map(schemaKeys.map((key, index) => [key, index]));
function ordered(v: Json): string { if (v === null || typeof v !== 'object') return JSON.stringify(v); if (Array.isArray(v)) return `[${v.map(ordered).join(',')}]`; return `{${Object.keys(v).sort((a, b) => (schemaRank.get(a) ?? Infinity) - (schemaRank.get(b) ?? Infinity)).map(k => `${JSON.stringify(k)}:${ordered(v[k])}`).join(',')}}`; }
export function admitSnapshot(input: unknown): ProjectSnapshot {
  const s = object(plainTree(input), ['project', 'groups', 'tokens']); const p = object(s.project, ['id', 'name'], ['description']); Object.values(p).forEach(v => string(v)); const projectId = string(p.id); const totals = { ast: 0 };
  for (const kind of ['groups', 'tokens'] as const) {
    const list = array(s[kind], retentionLimits[kind]); const ids = new Set<string>();
    for (const item of list) {
      const x = object(item, ['id', 'projectId', 'localName', 'parentGroupId', ...(kind === 'tokens' ? ['authoring'] : [])], kind === 'tokens' ? ['description', 'layer', 'semanticRole', 'componentDefinitionId', 'definition'] : ['description']);
      for (const k of ['id', 'projectId', 'localName', 'description', 'semanticRole', 'componentDefinitionId']) if (Object.hasOwn(x, k)) string(x[k]);
      const id = string(x.id); if (ids.has(id)) fail('duplicate-identity', kind); ids.add(id); if (x.projectId !== projectId) fail('foreign-membership', kind); if (x.parentGroupId !== null) string(x.parentGroupId);
      if (kind === 'tokens') {
        if (Object.hasOwn(x, 'description')) bound(string(x.description).length, retentionLimits.tokenDescription, 'token-description', `tokens[${ids.size - 1}].description`);
        member(object(x.authoring, ['regeneration']).regeneration, ['allowed', 'protected']); if (Object.hasOwn(x, 'layer')) member(x.layer, ['primitive', 'semantic', 'component']); if ((x.layer === 'component') !== Object.hasOwn(x, 'componentDefinitionId')) fail('component-association-pair');
        if (Object.hasOwn(x, 'definition')) { const d = object(x.definition, ['type', 'assignments']); const type = member(d.type, TOKEN_TYPES); for (const assignment of array(d.assignments, 1)) { const a = object(assignment, ['condition', 'value']); array(a.condition, 0); authoredValue(a.value, type, totals); } }
      }
    }
  }
  bound(utf8Bytes(ordered(s)), retentionLimits.snapshotBytes, 'snapshot-bytes');
  // The cast follows complete structural validation, never a file TypeScript cast.
  return s as unknown as ProjectSnapshot;
}
function scan(text: string): void {
  bound(utf8Bytes(text), retentionLimits.fileBytes, 'file-bytes'); if (text.charCodeAt(0) === 0xfeff) fail('utf8-bom'); const scanner = createScanner(text, false); let count = 0, depth = 0;
  for (;;) { const kind = scanner.scan(); if (kind === SyntaxKind.EOF) break; if (scanner.getTokenError()) fail('invalid-json-token'); if (kind === SyntaxKind.Trivia || kind === SyntaxKind.LineBreakTrivia) continue;
    if (([SyntaxKind.LineCommentTrivia, SyntaxKind.BlockCommentTrivia, SyntaxKind.Unknown] as readonly number[]).includes(kind)) fail('strict-json-required'); bound(++count, retentionLimits.lexical, 'lexical-tokens');
    const raw = text.slice(scanner.getTokenOffset(), scanner.getTokenOffset() + scanner.getTokenLength()); if (kind === SyntaxKind.StringLiteral) bound(raw.length, retentionLimits.rawString, 'raw-string');
    if (kind === SyntaxKind.NumericLiteral && (!/^(0|[1-9]\d*)$/.test(raw) || raw.length > 16 || !Number.isSafeInteger(Number(raw)))) fail('canonical-integer-required');
    if (kind === SyntaxKind.OpenBraceToken || kind === SyntaxKind.OpenBracketToken) bound(++depth, retentionLimits.depth + 1, 'json-depth'); if (kind === SyntaxKind.CloseBraceToken || kind === SyntaxKind.CloseBracketToken) depth--;
  }
}
function parse(text: string): Json {
  scan(text); let root: Json | undefined; const stack: { value: Obj | Json[]; keys: Set<string>; key?: string }[] = [];
  function add(v: Json) { const top = stack.at(-1); if (!top) { if (root !== undefined) fail('multiple-json-roots'); root = v; } else if (Array.isArray(top.value)) top.value.push(v); else { const key = top.key; if (key === undefined) return fail('missing-json-key'); top.value[key] = v; top.key = undefined; } }
  visit(text, { onObjectBegin() { const value: Obj = Object.create(null); add(value); stack.push({ value, keys: new Set() }); }, onObjectProperty(key) { const top = stack.at(-1)!; if (false && top.keys.has(key)) fail('duplicate-json-key'); top.keys.add(key); top.key = key; }, onObjectEnd() { stack.pop(); }, onArrayBegin() { const value: Json[] = []; add(value); stack.push({ value, keys: new Set() }); }, onArrayEnd() { stack.pop(); }, onLiteralValue(value: Json) { add(value); }, onError() { fail('malformed-json'); } }, { disallowComments: true, allowTrailingComma: false, allowEmptyContent: false });
  if (root === undefined) return fail('empty-json'); return root;
}
export type BackupPreview = { readonly snapshot: ProjectSnapshot; readonly createdAt: string };
export function decodeBackup(text: string): BackupPreview {
  const wrapper = object(parse(text), ['format', 'formatVersion', 'authoredVersion', 'createdAt', 'snapshot']);
  if (wrapper.format !== 'dtw.project-backup' || wrapper.formatVersion !== 1 || wrapper.authoredVersion !== 1) fail('unsupported-backup-version'); const createdAt = string(wrapper.createdAt);
  if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(createdAt) || !Number.isFinite(Date.parse(createdAt)) || new Date(createdAt).toISOString() !== createdAt) fail('invalid-snapshot-date');
  const snapshot = admitSnapshot(wrapper.snapshot); checkOutput(snapshot, createdAt); return { snapshot, createdAt };
}
function checkOutput(snapshot: ProjectSnapshot, createdAt: string): string { const text = ordered({ format: 'dtw.project-backup', formatVersion: 1, authoredVersion: 1, createdAt, snapshot: snapshot as unknown as Json }) + '\n'; scan(text); return text; }
export function encodeBackup(input: unknown, createdAt: string): string { const snapshot = admitSnapshot(input); if (!/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$/.test(createdAt) || !Number.isFinite(Date.parse(createdAt)) || new Date(createdAt).toISOString() !== createdAt) fail('invalid-snapshot-date'); return checkOutput(snapshot, createdAt); }
