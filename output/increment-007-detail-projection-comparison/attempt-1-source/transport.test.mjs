import {test} from 'node:test';import assert from 'node:assert/strict';
import {nextFrame,appendFrame,encodedBytes,targets,sameContext} from './transport.mjs';
test('worst escaped code units, long exact identities, split pairs and lone surrogates round trip',()=>{
 const text=JSON.stringify({id:'i'.repeat(65536),label:'\ud800\u0000'.repeat(65536),body:'x'.repeat(8191)+'😀'+'\udfff'});let offset=0,assembled,frames=0;const state={parts:[],offset:0,total:text.length};
 do{const f=nextFrame(text,offset,{request:1,view:2,item:3});assert.ok(encodedBytes(f)<=targets.bytes);assert.ok(f.text.length<=8192);assembled=appendFrame(state,f);offset+=f.text.length;frames++;}while(assembled===undefined);
 assert.ok(frames>24);assert.equal(assembled,text);assert.deepEqual(JSON.parse(assembled),JSON.parse(text));
});
test('mixed offset is rejected; context dimensions all matter',()=>{
 assert.throws(()=>appendFrame({parts:[],offset:0,total:3},{offset:1,total:3,text:'a'}));
 const a={worker:1,project:'',incarnation:1,revision:1,result:1,request:1,entity:'',kind:'token',section:'raw',draft:1,mode:'literal',view:'srgb',scale:'bytes'};
 for(const k of Object.keys(a))assert.equal(sameContext(a,{...a,[k]:'changed'}),false,k);
});
