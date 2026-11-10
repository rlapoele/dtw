import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {verdict} from './trace.mjs';
test('frozen 191.793 ms renderer Layout is a failure despite absent RunTask',async()=>{
 const trace=JSON.parse(await readFile('output/increment-007-rendering-qualification/chrome-attempt-3-raw-trace.json'));
 const result=verdict(trace,{targetPid:13625});assert.equal(result.status,'fail');assert.equal(result.maxima.Layout,191.793);assert.ok(result.violations.some(e=>e.name==='Layout'));assert.equal(result.unit,'microseconds');
});
test('missing whole-task evidence and empty traces are inconclusive',()=>{
 assert.equal(verdict({traceEvents:[]}).status,'inconclusive');
 assert.equal(verdict({traceEvents:[{name:'thread_name',pid:1,tid:2,args:{name:'CrRendererMain'}},{name:'Layout',pid:1,tid:2,ph:'X',dur:1,ts:1}]}).status,'inconclusive');
});
test('only renderer-main whole tasks can support pass, other-thread Layout ignored',()=>{
 const events=[{name:'thread_name',pid:1,tid:2,args:{name:'CrRendererMain'}},{name:'RunTask',pid:1,tid:2,ph:'X',dur:1000,ts:1},{name:'Layout',pid:2,tid:3,ph:'X',dur:999999,ts:1}];
 assert.equal(verdict({traceEvents:events},{targetPid:1}).status,'pass');
 events.push({name:'ThreadControllerImpl::RunTask',pid:1,tid:2,ph:'X',dur:100001,ts:1});assert.equal(verdict({traceEvents:events},{targetPid:1}).status,'fail');
});
test('R1: foreign renderer tasks cannot supply target-page coverage',()=>{
 const traceWithWrongRendererTasks={traceEvents:[{name:'TracingStartedInBrowser',args:{data:{frames:[{processId:1,url:'http://target/'}]}}},{name:'thread_name',pid:1,tid:11,args:{name:'CrRendererMain'}},{name:'thread_name',pid:2,tid:22,args:{name:'CrRendererMain'}},{name:'Layout',pid:1,tid:11,ph:'X',ts:1,dur:1000},{name:'RunTask',pid:2,tid:22,ph:'X',ts:1,dur:1000}]};
 assert.equal(verdict(traceWithWrongRendererTasks,{targetUrl:'http://target/'}).status,'inconclusive');
 assert.equal(verdict(traceWithWrongRendererTasks,{targetPid:1}).coverage.wholeTasks,0);
});
test('R1: missing/ambiguous ownership and absent actual target remain inconclusive',()=>{
 const trace={traceEvents:[{name:'thread_name',pid:2,tid:22,args:{name:'CrRendererMain'}},{name:'RunTask',pid:2,tid:22,ph:'X',ts:1,dur:1000}]};
 assert.equal(verdict(trace).status,'inconclusive');assert.equal(verdict(trace,{targetPid:1}).status,'inconclusive');
 assert.equal(verdict(trace,{targetUrl:'http://target/'}).status,'inconclusive');
 const ownership=[{name:'TracingStartedInBrowser',args:{data:{frames:[{frame:'f',processId:1,url:'http://target/'},{frame:'f',processId:2,url:'http://target/'}]}}}];
 assert.equal(verdict({traceEvents:[...ownership,...trace.traceEvents]},{targetFrameId:'f'}).status,'inconclusive');
});
test('E scope changes maximum task ceiling only when caller explicitly supplies250',()=>{
 const trace={traceEvents:[{name:'thread_name',pid:1,tid:2,args:{name:'CrRendererMain'}},{name:'RunTask',pid:1,tid:2,ph:'X',ts:1,dur:250000}]};
 assert.equal(verdict(trace,{targetPid:1}).status,'fail');assert.equal(verdict(trace,{targetPid:1,ceilingMs:250}).status,'pass');trace.traceEvents[1].dur=250001;assert.equal(verdict(trace,{targetPid:1,ceilingMs:250}).status,'fail');
});
test('saved stale repeat is detected; corrected20 samples have distinct phasecomplete equality identities',async()=>{
 const stale=JSON.parse(await readFile('output/increment-007-e4-qualification/attempt-1-chrome.json'));
 const previous=stale.cases.filter(c=>/first-open|warmup|sample-/.test(c.id)).map(c=>c.value.activation);assert.ok(new Set(previous).size<previous.length);
 const fixed=JSON.parse(await readFile('output/increment-007-e4-qualification/attempt-2-chrome.json'));
 const samples=fixed.cases.filter(c=>/sample-/.test(c.id));assert.equal(samples.length,20);assert.equal(new Set(samples.map(c=>c.value.activation)).size,20);
 for(const s of samples){assert.equal(s.status,'pass');assert.equal(s.value.mountedUnits,s.value.total);assert.equal(s.value.mountedSha256,s.value.sha256);assert.ok(s.value.painted>=s.value.mounted&&s.value.mounted>=s.value.assembled);assert.ok(s.trace.coverage.wholeTasks>0);}
});
