// Pure fixture/envelope guards shared by the worker and offline negative controls.
export function sample(project,marker='default'){return {project:{id:project,name:'Small exact '+marker+' e\u0301 😀 \ud800'},groups:[],tokens:Array.from({length:100},(_,i)=>({id:'t'+i,projectId:project,localName:'t'+i,parentGroupId:null,description:i===0?'e\u0301 😀 \ud800':'small',definition:{type:'number',assignments:[{condition:[],value:{kind:'literal',valueType:'number',value:'1'}}]},authoring:{regeneration:'allowed'}}))};}
export function guardDescriptions(snapshot){for(const token of snapshot.tokens)if(typeof token.description==='string'&&token.description.length>1024)throw Error('description-limit');return snapshot;}
const keys=(o,wanted)=>!!o&&typeof o==='object'&&!Array.isArray(o)&&Object.keys(o).sort().join(',')===wanted.split(',').sort().join(',');
export function validateRecord(record,key,encode){
 if(!keys(record,'recordVersion,authoredVersion,revision,lastAcceptedCommand,snapshot')||record.recordVersion!==1||record.authoredVersion!==1||record.snapshot?.project.id!==key||typeof record.revision!=='string'||!record.revision||record.revision.length>128)throw Error('record-unavailable');
 const c=record.lastAcceptedCommand;if(!keys(c,'commandId,operation,result')||c.commandId!==record.revision||c.operation!=='restoreProject'||!keys(c.result,'entityKind,id')||c.result.entityKind!=='project'||c.result.id!==key)throw Error('command-unavailable');
 encode(guardDescriptions(record.snapshot));return true;
}
export function recoverable(record,key,encode){if(record===null)return {status:'absent',record:null};try{validateRecord(record,key,encode);return {status:'validated',record};}catch(error){return {status:'unavailable',record:null,error:String(error)};}}
