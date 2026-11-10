import {fixture,token,literal,coverage} from '../increment-007-stage-a/fixtures.mjs';
import {semantic,preflight,canonical} from '../increment-007-stage-a/codec.mjs';
export function makeFixture(kind='100') {
 let s=kind==='coverage'?coverage():fixture(kind==='raw'?1:kind==='row'?1:kind==='1000'?1000:kind==='entities'?10000:100);
 if(!['coverage','raw','entities'].includes(kind))for(const [i,t] of s.tokens.entries()) {t.definition={type:'color',assignments:[{condition:[],value:literal('color',{colorSpace:'srgb',components:['0.2','0.4','0.6'],alpha:'1'})}]};t.layer='primitive';t.description='Exact description '+i+' with variable length '+('long '.repeat(i%7));}
 if(kind==='entities')s.groups=Array.from({length:2000},(_,i)=>({id:'g'+i,projectId:'p',localName:'Group '+i,parentGroupId:null}));
 if(kind==='row') {const t=s.tokens[0];t.localName='N'.repeat(65536);t.description='D'.repeat(65536);t.definition.assignments[0].value.components=['1'.repeat(4096),'0','1'];}
 if(kind==='raw') {const t=s.tokens[0];t.definition={type:'fontFamily',assignments:[{condition:[],value:literal('fontFamily',{families:Array.from({length:63},(_,i)=>({kind:'named',name:String(i).padStart(2,'0')+'x'.repeat(65532)+'YZ'}))})}]};}
 const counts={...semantic(s),...preflight(s)};
 return {snapshot:s,counts,canonical:canonical(s)};
}
