import {test} from 'node:test';import assert from 'node:assert/strict';
import {frame,bytes,accept,same,context} from './transport.mjs';
import {snapshot} from './fixtures.mjs';
import {semantic,preflight} from '../increment-007-stage-a/codec.mjs';
test('whole-wire escapes headers and all source UTF16 round trip within both bounds',()=>{
 const text='\u0000\ud800😀"\\'.repeat(16000);const c=context(1,2,3,4,5);let offset=0,result;const state={offset:0,total:text.length,parts:[]};
 do{const f=frame(text,offset,{context:c,handle:1,op:'chunk'});assert.ok(bytes(f)<=32768);assert.ok(f.text.length<=8192);result=accept(state,f);offset+=f.text.length;}while(result===undefined);assert.equal(result,text);
});
test('mixed total/offset/false complete/overflow and every context dimension rejected',()=>{
 const c=context(1,2,3,4,5);for(const k of Object.keys(c))assert.equal(same(c,{...c,[k]:9}),false);
 const state=()=>({offset:0,total:3,parts:[]});for(const f of [{offset:1,total:3,text:'a',complete:false},{offset:0,total:4,text:'a',complete:false},{offset:0,total:3,text:'a',complete:true},{offset:0,total:3,text:'abcd',complete:false}])assert.throws(()=>accept(state(),f));
});
test('admitted finite fixture intersections and true pretty boundaries retain known font source',()=>{
 for(const kind of ['small','65535','65536','65537','escape','raw','escaped-large','long-color']){const s=snapshot(kind);semantic(s);preflight(s);const text=JSON.stringify(s.tokens[0],null,2);if(/^655/.test(kind))assert.equal(text.length,Number(kind));if(kind==='raw')assert.equal(text.length,4134504);if(kind==='escape')assert.ok(text.length>65536&&s.tokens[0].description.length<65536);}
});
