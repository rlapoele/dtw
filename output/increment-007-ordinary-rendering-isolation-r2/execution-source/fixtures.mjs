// Synthetic canonical snapshots; no source encoding occurs here except exact boundary sizing.
// Boundary sizing is fixture construction and remains inside the traced ordinary-load action.
import {fixture,literal,ref} from '../increment-007-stage-a/fixtures.mjs';
export const kinds=['small','65535','65536','65537','escape','raw','escaped-large','long-color'];
export function snapshot(kind='small'){
 if(!kinds.includes(kind))throw Error('Unknown fixture');
 const s=fixture(1),t=s.tokens[0];s.project.name='E-4 synthetic qualification';
 if(kind==='raw'||kind==='escaped-large'){
  t.definition={type:'fontFamily',assignments:[{condition:[],value:literal('fontFamily',{families:Array.from({length:63},(_,i)=>({kind:'named',name:String(i).padStart(2,'0')+(kind==='raw'?'x':'\u0001').repeat(kind==='raw'?65532:21000)+'YZ'}))})}]};return s;
 }
 t.definition={type:'color',assignments:[{condition:[],value:literal('color',{colorSpace:'srgb',components:['0.2','0.4','0.6'],alpha:'1'})}]};
 t.layer='primitive';t.description='Small editable synthetic source';
 if(kind==='long-color')t.definition.assignments[0].value.components[0]='0.'+'1'.repeat(4095);
 if(kind==='escape')t.description='\u0001'.repeat(12000);
 if(/^655/.test(kind)){t.description='';t.description='x'.repeat(Number(kind)-JSON.stringify(t,null,2).length);}
 // Actual production reference draft options and literal editing remain available.
 const second=fixture(1).tokens[0];second.id='target';second.localName='target';second.definition={type:'color',assignments:[{condition:[],value:literal('color',{colorSpace:'srgb',components:['1','0','0'],alpha:'1'})}]};
 s.tokens.push(second);return s;
}
