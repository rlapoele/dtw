import {readFile,writeFile} from 'node:fs/promises';
const out='output/increment-007-worker-qualification';
function stats(a){const x=a.filter(Number.isFinite).sort((a,b)=>a-b);return x.length?{n:x.length,median:x[Math.floor((x.length-1)/2)],p95:x[Math.ceil(.95*x.length)-1],max:x.at(-1)}:null;}
const summary={definition:'nearest-rank p95, median lower central for n20; warmup excluded',engines:{}};
for(const engine of ['chrome','safari']){let raw;try{raw=JSON.parse(await readFile(out+'/'+engine+'-results.json'));}catch{continue;}
const s={build:raw.browserVersion??raw.capabilities,profile:raw.profileMode,origin:raw.origin,cases:raw.cases.length,failures:raw.cases.filter(c=>c.status!=='pass'),codec:{},command:{},catalogueMaximum:null};
for(const fixture of ['100','1000','max','detail','entities']){
 const samples=raw.cases.filter(c=>c.status==='pass'&&c.id.startsWith('W08-worker-codec-transfer-dom-'+fixture+'-')&&!c.value.warmup).map(c=>c.value);
 s.codec[fixture]={hashes:[...new Set(samples.map(v=>v.fixtureSha256))],counts:samples[0]?.counts,samples:samples.length};
 for(const key of ['encodeMs','decodeMs','workerMs','roundtripMs','rendererDomMs','endToPaintMs'])s.codec[fixture][key]=stats(samples.map(v=>v[key]));
 s.codec[fixture].longTasks=samples.flatMap(v=>v.longTasks);s.codec[fixture].eventLoopLagMs=stats(samples.flatMap(v=>v.eventLoopLags));s.codec[fixture].visibilityCounts=samples.reduce((r,v)=>(r[v.visibility]=(r[v.visibility]??0)+1,r),{});
}
for(const fixture of ['100','1000']){const rows=raw.cases.filter(c=>c.id.startsWith('W08-command-and-catalogue-'+fixture+'-')&&c.status==='pass'&&!c.value.warmup).map(c=>c.value);s.command[fixture]={samples:rows.length,workflowMs:stats(rows.map(v=>v.workflowMs)),dispatchCompleteMs:stats(rows.map(v=>v.write.dispatchCompleteMs)),catalogueMs:stats(rows.map(v=>v.catalogueMs)),records:[...new Set(rows.map(v=>v.records))]};}
const rows=raw.cases.filter(c=>c.id.startsWith('W08-max-catalogue-cursor-')&&c.status==='pass'&&!c.value.warmup).map(c=>c.value);s.catalogueMaximum={samples:rows.length,workerMs:stats(rows.map(v=>v.workerMs)),roundtripMs:stats(rows.map(v=>v.roundtripMs)),bytes:[...new Set(rows.map(v=>v.bytes))],records:[...new Set(rows.map(v=>v.rows.length))]};
summary.engines[engine]=s;
}
await writeFile(out+'/summary.json',JSON.stringify(summary,null,2)+'\n');
