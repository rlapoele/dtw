import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {verdict} from '../../../research/increment-007-detail-projection-comparison/trace.mjs';
import {nextFrame,encodedBytes} from '../../../research/increment-007-detail-projection-comparison/transport.mjs';
import {makeFixture} from '../../../research/increment-007-rendering-qualification/fixtures.mjs';
const sha=x=>createHash('sha256').update(x).digest('hex');
const base='output/increment-007-detail-projection-comparison';
const manifest=JSON.parse(await readFile(base+'/manifest.json'));
for(const [p,h] of Object.entries(manifest.files))assert.equal(sha(await readFile(p)),h,p);
const old=JSON.parse(await readFile('output/increment-007-rendering-qualification/manifest.json'));
for(const f of old.files)assert.equal(sha(await readFile(f.path)),f.sha256,f.path);
const provenance=JSON.parse(await readFile('research/increment-007-detail-projection-comparison/provenance.json'));
for(const [p,h] of Object.entries(provenance))assert.equal(sha(await readFile(p)),h,p);
const fixtures={};for(const k of ['100','row','raw']){const f=makeFixture(k);fixtures[k]={counts:f.counts,canonicalSha256:sha(f.canonical),rawUnits:JSON.stringify(f.snapshot.tokens[0],null,2).length,rawSha256:sha(JSON.stringify(f.snapshot.tokens[0],null,2))};}
const replay=[];for(const name of ['chrome-attempt-1.json','chrome-textarea-attempt-1.json']){const log=JSON.parse(await readFile(base+'/'+name));for(const c of log.cases){const t=JSON.parse(await readFile(base+'/'+c.id+'-trace.json'));const v=verdict(t);assert.equal(v.status,c.status,c.id);assert.deepEqual(v.maxima,c.trace.maxima,c.id);const target=t.traceEvents.find(e=>e.name==='TracingStartedInBrowser')?.args?.data?.frames?.find(f=>f.url===log.origin+'/')?.processId;const relevant=t.traceEvents.filter(e=>e.pid===target);const tv=verdict({traceEvents:relevant});if(!c.id.endsWith('navigation'))assert.equal(tv.status,c.status,c.id+' target renderer');replay.push({id:c.id,status:v.status,targetPid:target,targetWholeTasks:tv.coverage.wholeTasks,maxima:tv.maxima});}assert.deepEqual(log.fixtures,fixtures);}
const traceWithWrongRendererTasks={traceEvents:[{name:'TracingStartedInBrowser',args:{data:{frames:[{processId:1,url:'http://target/'}]}}},{name:'thread_name',pid:1,tid:11,args:{name:'CrRendererMain'}},{name:'thread_name',pid:2,tid:22,args:{name:'CrRendererMain'}},{name:'Layout',pid:1,tid:11,ph:'X',ts:1,dur:1000},{name:'RunTask',pid:2,tid:22,ph:'X',ts:1,dur:1000}]};
const missingTargetCoverage=verdict(traceWithWrongRendererTasks);assert.equal(missingTargetCoverage.status,'pass');
let wrapperExample;for(let n=0;n<=8192;n++){const f=nextFrame('\0'.repeat(n)+'x'.repeat(8192-n),0,{request:1,view:1,item:1});const bare=encodedBytes(f),wire=encodedBytes({id:1,value:f});if(bare<=32768&&wire>32768){wrapperExample={nulUnits:n,bareBytes:bare,wireBytes:wire,textUnits:f.text.length};break;}}assert.ok(wrapperExample);
const result={manifestFiles:Object.keys(manifest.files).length,oldManifestFiles:old.files.length,provenanceFiles:Object.keys(provenance).length,fixtures,replay,missingTargetCoverage,wrapperExample};
await writeFile(base+'/reviewer-probes/offline-result.json',JSON.stringify(result,null,2)+'\n');console.log(JSON.stringify({...result,replay:`${replay.length} trace verdicts/maxima and target renderer coverage independently match`},null,2));
