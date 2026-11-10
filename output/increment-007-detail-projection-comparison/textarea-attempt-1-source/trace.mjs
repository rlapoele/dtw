/** Chrome trace timestamps/durations are microseconds. Fail before coverage checks. */
export function verdict(trace,{start=-Infinity,end=Infinity}={}) {
 const events=trace.traceEvents??[];
 const threads=events.filter(e=>e.name==='thread_name'&&e.args?.name==='CrRendererMain').map(e=>({pid:e.pid,tid:e.tid}));
 const main=events.filter(e=>e.ph==='X'&&Number.isFinite(e.dur)&&threads.some(t=>e.pid===t.pid&&e.tid===t.tid)&&e.ts<end&&e.ts+e.dur>start);
 const taskNames=['RunTask','ThreadControllerImpl::RunTask','TaskQueueManager::ProcessTaskFromWorkQueue'];
 const tasks=main.filter(e=>taskNames.includes(e.name));
 const measured=main.filter(e=>taskNames.includes(e.name)||['Layout','UpdateLayoutTree','Paint','FunctionCall','EventDispatch'].includes(e.name));
 const maxima=Object.fromEntries([...new Set(measured.map(e=>e.name))].map(name=>[name,Math.max(...measured.filter(e=>e.name===name).map(e=>e.dur))/1000]));
 const violations=measured.filter(e=>e.dur>100000).map(({name,pid,tid,ts,dur})=>({name,pid,tid,ts,dur,ms:dur/1000}));
 const coverage={rendererThreads:threads,wholeTasks:tasks.length,mainCompleteEvents:main.length,interval:{start:Number.isFinite(start)?start:null,end:Number.isFinite(end)?end:null}};
 return {status:violations.length?'fail':!threads.length||!tasks.length?'inconclusive':'pass',reason:violations.length?'renderer-main blocking event exceeds unchanged 100 ms gate':!tasks.length?'required renderer-main whole-task evidence absent':'observed covered interval',unit:'microseconds',maxima,violations,coverage};
}
