// Qualification-only fixed message vocabulary. No production port/API is selected.
const fields={capability:[],lock:['project'],release:['project'],read:['project'],prepare:['project','command','expected','fixture','protection'],dispatch:['command','abort'],cancel:['command'],catalogue:[],seed:['fixture','count'],bench:['fixture'],echo:['bytes'],recover:['project','attempt','stopped'],reset:[],watchdogHang:[]};
export function validateCall(x){
 if(!x||Object.getPrototypeOf(x)!==Object.prototype||typeof x.id!=='string'||!x.id.length||x.id.length>128||!Object.hasOwn(fields,x.op))throw Error('message-shape');
 const allowed=['id','op',...fields[x.op]];
 if(Object.keys(x).some(k=>!allowed.includes(k)))throw Error('unknown-message-field');
 for(const k of fields[x.op])if(!Object.hasOwn(x,k))throw Error('missing-message-field:'+k);
 if('project'in x&&(typeof x.project!=='string'||x.project.length>65536))throw Error('project');
 if('command'in x&&(typeof x.command!=='string'||!x.command.length||x.command.length>128))throw Error('command');
 if('expected'in x&&x.expected!==null&&(typeof x.expected!=='string'||x.expected.length>128))throw Error('expected');
 if('fixture'in x&&!['100','1000','max','entities','coverage','detail'].includes(x.fixture))throw Error('fixture');
 if('count'in x&&(!Number.isInteger(x.count)||x.count<0||x.count>25))throw Error('count');
 if('abort'in x&&typeof x.abort!=='boolean')throw Error('abort');
 if('stopped'in x&&typeof x.stopped!=='boolean')throw Error('stopped');
 if('bytes'in x&&(!(x.bytes instanceof ArrayBuffer)||x.bytes.byteLength>16777216))throw Error('bytes');
 if('protection'in x&&x.protection!==null&&(typeof x.protection!=='string'||x.protection.length>128))throw Error('protection');
 if('attempt'in x){const a=x.attempt;if(!a||Object.keys(a).sort().join(',')!=='command,expected,incarnation'||typeof a.command!=='string'||a.command.length>128||typeof a.incarnation!=='string'||a.incarnation.length>128||(a.expected!==null&&typeof a.expected!=='string'))throw Error('attempt');}
 return x;
}
export function classify(a,record,p){
 if(!p.stopped||!p.ordered||!p.ownership||p.incarnation!==a.incarnation)return 'unknown';
 if(record&&(typeof record.revision!=='string'||typeof record.last!=='string'||!record.last.length))return 'unknown';
 if(record?.last===a.command)return 'retained';
 return (record?.revision??null)===a.expected?'rejected':'unknown';
}
export function publishable(current,response){return ['id','project','revision','generation'].every(k=>current[k]===response[k]);}
