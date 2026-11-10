/** Trace µs. An identified target page is required; foreign renderers never supply coverage. */
function ownership(events,{targetPid,targetFrameId,targetUrl}) {
 if(targetPid!==undefined)return Number.isSafeInteger(targetPid)&&targetPid>0?{pid:targetPid,source:'explicit-target-pid'}:{reason:'invalid target renderer pid'};
 if(targetFrameId===undefined&&targetUrl===undefined)return {reason:'target frame/process ownership not supplied'};
 const frames=events.filter(e=>e.name==='TracingStartedInBrowser').flatMap(e=>e.args?.data?.frames??[]);
 if(targetFrameId!==undefined)frames.push(...events.filter(e=>e.name==='FrameCommittedInBrowser').map(e=>e.args?.data).filter(Boolean));
 const matches=frames.filter(f=>targetFrameId!==undefined?f.frame===targetFrameId:f.url===targetUrl);
 const pids=[...new Set(matches.map(f=>f.processId).filter(p=>Number.isSafeInteger(p)&&p>0))];
 return pids.length===1?{pid:pids[0],source:targetFrameId!==undefined?'exact-target-frame-metadata':'exact-target-url-start-metadata'}:{reason:pids.length?'ambiguous target renderer ownership':'target frame/process ownership missing'};
}
export function verdict(trace,{start=-Infinity,end=Infinity,targetPid,targetFrameId,targetUrl,ceilingMs=100}={}) {
 const events=trace.traceEvents??[];
 const owner=ownership(events,{targetPid,targetFrameId,targetUrl});
 const threads=events.filter(e=>e.name==='thread_name'&&e.args?.name==='CrRendererMain'&&owner.pid!==undefined&&e.pid===owner.pid).map(e=>({pid:e.pid,tid:e.tid}));
 const main=events.filter(e=>e.ph==='X'&&Number.isFinite(e.dur)&&threads.some(t=>e.pid===t.pid&&e.tid===t.tid)&&e.ts<end&&e.ts+e.dur>start);
 const taskNames=['RunTask','ThreadControllerImpl::RunTask','TaskQueueManager::ProcessTaskFromWorkQueue'];
 const tasks=main.filter(e=>taskNames.includes(e.name));
 const measured=main.filter(e=>taskNames.includes(e.name)||['Layout','UpdateLayoutTree','Paint','FunctionCall','EventDispatch'].includes(e.name));
 const maxima=Object.fromEntries([...new Set(measured.map(e=>e.name))].map(name=>[name,Math.max(...measured.filter(e=>e.name===name).map(e=>e.dur))/1000]));
 const violations=measured.filter(e=>e.dur>ceilingMs*1000).map(({name,pid,tid,ts,dur})=>({name,pid,tid,ts,dur,ms:dur/1000}));
 const coverage={ownership:owner,rendererThreads:threads,wholeTasks:tasks.length,mainCompleteEvents:main.length,interval:{start:Number.isFinite(start)?start:null,end:Number.isFinite(end)?end:null}};
 return {status:violations.length?'fail':!threads.length||!tasks.length?'inconclusive':'pass',reason:owner.reason??(violations.length?'renderer-main blocking event exceeds scoped maximum-task gate':!tasks.length?'required renderer-main whole-task evidence absent':'observed covered interval'),ceilingMs,unit:'microseconds',maxima,violations,coverage};
}
