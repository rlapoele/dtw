import test from 'node:test';
import assert from 'node:assert/strict';
import { codec } from './codec.mjs';
import { coverage, fixture } from '../increment-007-stage-a/fixtures.mjs';

const utf = text => new TextEncoder().encode(text);
// Independent input path: never use the adapter or base encoder to make decoder input.
const raw = snapshot => utf(JSON.stringify({format:'dtw.project-backup',formatVersion:1,
  authoredVersion:1,createdAt:'2026-11-09T12:00:00.000Z',snapshot}));
const plain = value => JSON.parse(JSON.stringify(value));
const rejectsDescription = run => assert.throws(run, error =>
  error.code === 'token-description-size' && error.observed === 1025);
const variants = coverage();
const nameOnly = {id:'name-only',projectId:'',localName:'name-only',parentGroupId:null,
  authoring:{regeneration:'allowed'}};
variants.tokens.push(nameOnly);
const supportedTypes = ['color','number','dimension','percentage','angle','duration','string',
  'boolean','fontFamily','fontWeight','cubicBezier','typography','shadow','gradient','border','transition'];
for (const type of supportedTypes) variants.tokens.push({...nameOnly,id:`typed-${type}`,
  definition:{type,assignments:[]}});

for (const [index, token] of variants.tokens.entries()) {
  for (const n of [1023,1024,1025]) {
    test(`C1 token ${index} ${token.id || '(empty ID)'} description ${n}: encode + raw decode`, () => {
      const source = structuredClone(variants);
      source.tokens[index].description = 'x'.repeat(n);
      const before = structuredClone(source), bytes = raw(source), originalBytes = bytes.slice();
      if (n > 1024) {
        rejectsDescription(() => codec.encode(source));
        rejectsDescription(() => codec.decode(bytes));
      } else {
        assert.deepEqual(plain(codec.encode(source).snapshot), source);
        assert.deepEqual(plain(codec.decode(bytes).snapshot), source);
      }
      assert.deepEqual(source, before);
      assert.deepEqual(bytes, originalBytes);
    });
  }
}

for (const [label, text] of [
  ['surrogate pairs', '😀'.repeat(512)],
  ['combining text', 'e\u0301'.repeat(512)],
  ['lone surrogate', '\ud800'.repeat(1024)],
  ['whitespace', ' \t\n\r'.repeat(256)],
  ['JSON escapes', '"\\\u0001\n'.repeat(256)],
]) test(`C2 ${label}: decoded units, exact preservation and +1 rejection`, () => {
  assert.equal(text.length,1024);
  const source = fixture(1); source.tokens[0].description = text;
  const bytes = raw(source);
  assert.deepEqual(plain(codec.decode(bytes).snapshot),source);
  const encoded = codec.encode(source);
  assert.deepEqual(plain(codec.decode(encoded.bytes).snapshot),source);
  source.tokens[0].description += 'x';
  rejectsDescription(() => codec.encode(source));
  rejectsDescription(() => codec.decode(raw(source)));
});

test('C2 raw Unicode escape length differs from decoded length', () => {
  const source = fixture(1); source.tokens[0].description = 'x'.repeat(1024);
  const text = new TextDecoder().decode(raw(source));
  const escaped = text.replace('x'.repeat(1024),'\\u0078'.repeat(1024));
  assert.equal(codec.decode(utf(escaped)).snapshot.tokens[0].description, source.tokens[0].description);
  rejectsDescription(() => codec.decode(utf(escaped.replace('\\u0078'.repeat(1024),'\\u0078'.repeat(1025)))));
});

test('C2 absent and empty token descriptions remain distinct', () => {
  const source = fixture(2); source.tokens[1].description = '';
  for (const decoded of [codec.encode(source),codec.decode(raw(source))]) {
    assert.equal(Object.hasOwn(decoded.snapshot.tokens[0],'description'),false);
    assert.equal(Object.hasOwn(decoded.snapshot.tokens[1],'description'),true);
    assert.equal(decoded.snapshot.tokens[1].description,'');
  }
});

for (const owner of ['project','group']) for (const n of [65535,65536,65537]) {
  test(`C3 ${owner} description retains generic boundary ${n}`, () => {
    const source = fixture(0);
    source.groups.push({id:'g',projectId:'p',localName:'g',parentGroupId:null});
    (owner === 'project' ? source.project : source.groups[0]).description = 'x'.repeat(n);
    if (n <= 65536) {
      assert.deepEqual(plain(codec.encode(source).snapshot),source);
      assert.deepEqual(plain(codec.decode(raw(source)).snapshot),source);
    } else {
      for (const run of [() => codec.encode(source),() => codec.decode(raw(source))])
        assert.throws(run,error => error.code === 'string-size');
    }
  });
}

test('C4 mixed candidate invalid last rejects whole; synthetic caller prior state stays untouched', () => {
  const prior = fixture(1), priorBefore = structuredClone(prior);
  const candidate = structuredClone(variants);
  for (const token of candidate.tokens) token.description = '  exact\n';
  candidate.tokens.at(-1).description = 'x'.repeat(1025);
  const candidateBefore = structuredClone(candidate), bytes = raw(candidate), bytesBefore = bytes.slice();
  let accepted = prior;
  assert.throws(() => { accepted = codec.encode(candidate).snapshot; }, /token-description-size/);
  assert.equal(accepted,prior);
  assert.throws(() => { accepted = codec.decode(bytes).snapshot; }, /token-description-size/);
  assert.equal(accepted,prior);
  assert.deepEqual(prior,priorBefore);
  assert.deepEqual(candidate,candidateBefore);
  assert.deepEqual(bytes,bytesBefore);
});

test('C5 encode rejects malformed data without invoking getters', () => {
  let touched = 0;
  for (const candidate of [
    Object.defineProperty({},'tokens',{enumerable:true,get(){touched++;throw Error('getter');}}),
    {project:{id:'p',name:'p'},groups:[],tokens:[Object.defineProperty({},'description',
      {enumerable:true,get(){touched++;throw Error('getter');}})]},
  ]) assert.throws(() => codec.encode(candidate), error => error.code === 'accessor');
  assert.equal(touched,0);
  for (const candidate of [null,{}, {tokens:null},{tokens:[null]},{tokens:'wrong'},
    {...fixture(1),tokens:[{...fixture(1).tokens[0],description:1025}]}]) {
    assert.throws(() => codec.encode(candidate));
    assert.throws(() => codec.decode(raw(candidate)));
  }
});

test('C5 strict duplicate/unknown keys and encoding rejection retained', () => {
  const good = new TextDecoder().decode(raw(fixture(1)));
  const bad = [
    good.replace('"formatVersion":1','"formatVersion":1,"\\u0066ormatVersion":1'),
    good.replace('"tokens":','"unknown":true,"tokens":'),
    good.replace('"authoring":','"unknown":true,"authoring":'),
    good.replace('"formatVersion":1','"formatVersion":1.0'),
    good.replace('"formatVersion":1','"formatVersion":2'),
    '// comment\n'+good, good.replace(/}$/,',}'),
  ];
  for (const text of bad) assert.throws(() => codec.decode(utf(text)));
  assert.throws(() => codec.decode(new Uint8Array([0xc3,0x28])));
  assert.throws(() => codec.decode(new Uint8Array([0xef,0xbb,0xbf,...utf(good)])));
  const source = fixture(1); source.tokens[0].unknown = true;
  assert.throws(() => codec.encode(source), error => error.code === 'unknown');
});
