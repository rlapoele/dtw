import {readFile,writeFile} from 'node:fs/promises';import assert from 'node:assert/strict';import {verdict} from './trace.mjs';
const base='output/increment-007-detail-projection-comparison',results=[];
for(const name of ['chrome-attempt-1.json','chrome-textarea-attempt-1.json']){
 const log=JSON.parse(await readFile(base+'/'+name));
 for(const c of log.cases){
  const trace=JSON.parse(await readFile(base+'/'+c.id+'-trace.json'));
  // Only exact target URL at tracing start establishes ownership for the entire
  // saved interval. Navigation begins at about:blank, so it stays inconclusive.
  const corrected=verdict(trace,{targetUrl:log.origin+'/'});
  if(!c.id.endsWith('navigation'))assert.equal(corrected.status,c.status,c.id);
  else assert.equal(corrected.status,'inconclusive',c.id);
  results.push({id:c.id,originalStatus:c.status,corrected,changed:corrected.status!==c.status});
 }
}
assert.equal(results.length,32);assert.equal(results.filter(r=>r.corrected.status==='fail').length,2);
await writeFile(base+'/r1-offline-replay.json',JSON.stringify({method:'offline saved traces only; exact target URL at trace-start frame metadata; no browser run',results},null,2)+'\n');
console.log(JSON.stringify({traces:results.length,nonNavigationSame:results.filter(r=>!r.changed).length,navigationInconclusive:results.filter(r=>r.changed).map(r=>r.id),failed:results.filter(r=>r.corrected.status==='fail').map(r=>({id:r.id,maxima:r.corrected.maxima,owner:r.corrected.coverage.ownership}))},null,2));
