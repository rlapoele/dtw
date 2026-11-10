import assert from 'node:assert/strict';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createRequire} from 'node:module';
import {makeFixture} from '../../../research/increment-007-rendering-qualification/fixtures.mjs';
import {makeCodec,canonical} from '../../../research/increment-007-stage-a/codec.mjs';
const out='output/increment-007-rendering-qualification/',sha=b=>createHash('sha256').update(b).digest('hex'),json=async p=>JSON.parse(await readFile(p));
const mb=await readFile(out+'manifest.json'),m=JSON.parse(mb);
assert.equal(sha(mb),'aa83dbdbc6597c10138f1d0b1839b9ba91507613c9e4416aacfa51798d850024');
assert.equal(m.files.length,80);
for(const f of m.files){const b=await readFile(f.path);assert.equal(b.length,f.bytes,f.path);assert.equal(sha(b),f.sha256,f.path);}
const result=await json(out+'chrome-results-attempt-3.json');
for(const [p,h] of Object.entries(result.source))assert.equal(sha(await readFile(out+'attempt-3-source/'+p)),h,p);
const provenance=await json('research/increment-007-rendering-qualification/provenance.json');
for(const [p,h]of Object.entries(provenance))assert.equal(sha(await readFile(p)),h,p);
const require=createRequire(new URL('../../../research/increment-007-stage-a/package.json',import.meta.url));
const codec=makeCodec(require('jsonc-parser')),fixtures={};
for(const kind of ['100','1000','entities','row','raw','coverage']){const f=makeFixture(kind),encoded=codec.encode(f.snapshot);assert.equal(canonical(encoded.snapshot),f.canonical);fixtures[kind]={...encoded.counts,canonicalSha256:sha(f.canonical)};}
const raw=makeFixture('raw'),text=JSON.stringify(raw.snapshot.tokens[0],null,2),gate=result.cases.find(c=>c.id==='R03-raw-gate');
assert.equal(text.length,gate.value.detail.units);assert.equal(sha(text),gate.value.detail.sha256);assert.equal(gate.value.detail.exactSelection,true);assert.equal(text.length,gate.value.detail.selectedUnits);
const trace=(await json(out+'chrome-attempt-3-raw-trace.json')).traceEvents;
const main=trace.find(e=>e.name==='thread_name'&&e.args.name==='CrRendererMain');
const layouts=trace.filter(e=>e.ph==='X'&&e.name==='Layout'&&e.pid===main.pid&&e.tid===main.tid),longest=layouts.reduce((a,b)=>a.dur>b.dur?a:b);
assert.equal(longest.dur,191793);assert.equal(longest.tdur,190465);
const metric=(items,name)=>items.find(x=>x.name===name).value;
assert(longest.ts>=metric(gate.value.before,'Timestamp')*1e6);assert(longest.ts+longest.dur<=metric(gate.value.after,'Timestamp')*1e6);
const samples=result.cases.filter(c=>/^R02-100-\d+$/.test(c.id));assert.equal(samples.length,20);assert(!result.pageErrors&&!result.error&&!result.watchdog);
for(const c of samples){assert.equal(c.value.mounted,100);assert.equal(c.value.rowRenders,100);assert.deepEqual(c.value.batches.map(b=>b.rows),[24,24,24,24,4]);}
const times=samples.map(c=>c.value.totalMs).sort((a,b)=>a-b);
const small=await json(out+'chrome-small-functional.json');assert(!small.error&&!small.pageErrors&&!small.watchdog);
const evidence={manifestSha256:sha(mb),filesMatched:80,archiveSourceMapMatched:true,productionProvenanceMatched:true,fixtures,raw:{units:text.length,sha256:sha(text),selectionMatches:true,mainThread:main,longestLayout:longest,layoutDeltaMs:(metric(gate.value.after,'LayoutDuration')-metric(gate.value.before,'LayoutDuration'))*1000,withinGateMetricInterval:true},small:{n:20,p95Ms:times[18],maxMs:times[19],mountedAndRenderCountsValid:true,functionalCase:small.cases.find(c=>c.id==='R01-small-inspector-draft-state')},limits:'Offline source/raw-evidence checks only; no browser rerun, native keyboard, Find, AT or zoom claim.'};
await writeFile(out+'reviewer-probes/offline-review.json',JSON.stringify(evidence,null,2)+'\n');
console.log(JSON.stringify({matched:80,rawLayoutMs:longest.dur/1000,rawExactUnits:text.length,p95SmallMs:times[18],fixturesRoundTrip:Object.keys(fixtures)}));
