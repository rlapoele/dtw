import test from 'node:test';import assert from 'node:assert/strict';import {gateFacts,assessControl} from './gate-evidence.mjs';
const context={lock:'safety-g02-unique',targetCase:'g02-target-unique',witnessCase:'g02-witness-unique'};
const start={type:'block-start',caseId:context.targetCase,lock:context.lock,actor:'native-worker',worker:'A',seq:3,at:100,receivedAt:new Date(100000).toISOString()};
const request={type:'witness-request-after-positive-start',caseId:context.witnessCase,lock:context.lock,rendererAt:10};
const acquired={type:'witness-acquired',caseId:context.witnessCase,lock:context.lock,actor:'native-worker',worker:'A',rendererAt:20,receivedAt:new Date(103000).toISOString()};
const natural={type:'natural-finish',caseId:context.targetCase,actor:'native-worker',worker:'A',seq:4,at:12100};
const control=()=>({intervention:true,pendingAtPositiveStart:true,pendingAtClose:true,target:'own-target',close:{ok:true,requestAt:102000,responseAt:102100,response:{value:['own-witness']}}});
test('actor, unique case and lock correlation ignore unrelated receipts',()=>{
 assert.deepEqual(gateFacts([{...start,caseId:'wrong'},{...acquired,lock:'wrong'},start,request,acquired,natural],context),{start,request,acquired,natural});
});
test('natural control uses same-worker duration, not cross-context delivery order',()=>{
 const facts=gateFacts([acquired,natural,request,start],context);
 assert.equal(assessControl({intervention:false,pendingAtPositiveStart:true,result:true},facts),true);
});
test('controlled close passes only with pending, disappeared target and early witness',()=>assert.equal(assessControl(control(),{start,request,acquired}),true));
for(const [name,change] of [
 ['already settled',c=>c.pendingAtClose=false],['close queued',c=>c.close.responseAt=113000],
 ['close deadline',c=>c.close.responseAt=105001],['wrong target remains',c=>c.close.response.value.push(c.target)],
 ['early intervention',c=>c.close.requestAt=101999],['transport failure',c=>c.close.ok=false],
])test('refuses '+name,()=>{const c=control();change(c);assert.throws(()=>assessControl(c,{start,request,acquired}));});
test('natural completion is never preemption',()=>assert.throws(()=>assessControl(control(),{start,request,acquired,natural})));
test('late witness is never preemption',()=>assert.throws(()=>assessControl(control(),{start,request,acquired:{...acquired,receivedAt:new Date(112000).toISOString()}})));
test('missing positive handshake refuses',()=>assert.throws(()=>assessControl(control(),{start,acquired})));
