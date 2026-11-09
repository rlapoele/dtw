import test from 'node:test';
import assert from 'node:assert/strict';
import {validateCall,classify,publishable} from './protocol.mjs';
test('closed bounded messages reject unknown, missing and excessive inputs',()=>{
 for(const x of [null,{}, {id:'x',op:'eval'}, {id:'x',op:'read',project:1}, {id:'x',op:'read',project:'p',extra:true}, {id:'x'.repeat(129),op:'read',project:'p'}])assert.throws(()=>validateCall(x));
 assert.doesNotThrow(()=>validateCall({id:'x',op:'read',project:''}));
});
test('absence cannot establish rejection without all fencing/ordering/baseline facts',()=>{
 const a={command:'c',expected:null,incarnation:'i'};
 for(const proof of [{},{stopped:true},{stopped:true,ordered:true},{stopped:true,ordered:true,ownership:true}])assert.equal(classify(a,null,proof),'unknown');
 const p={stopped:true,ordered:true,ownership:true,incarnation:'i'};
 assert.equal(classify(a,null,p),'rejected');
 assert.equal(classify(a,null,{...p,incarnation:'new'}),'unknown');
 assert.equal(classify(a,{revision:'later',last:'other'},p),'unknown');
 assert.equal(classify(a,{revision:'r',last:'c'},p),'retained');
 assert.equal(classify(a,{revision:'r',last:'c'},{...p,stopped:false}),'unknown');
});
test('publication fences request, project, revision and renderer generation',()=>{
 const s={id:'r',project:'',revision:'v',generation:2};
 assert.equal(publishable(s,{...s}),true);
 for(const patch of [{id:'old'},{project:'p'},{revision:'old'},{generation:1}])assert.equal(publishable(s,{...s,...patch}),false);
});
test('missing command metadata in a present baseline is unknown',()=>{
 const a={command:'c',expected:'old',incarnation:'i'},p={stopped:true,ordered:true,ownership:true,incarnation:'i'};
 assert.equal(classify(a,{revision:'old'},p),'unknown');
 assert.equal(classify(a,{revision:'old',last:'previous'},p),'rejected');
});
