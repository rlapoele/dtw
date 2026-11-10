/// <reference lib="webworker" />
import {snapshot} from './fixtures.mjs';
import {bytes,frame,same} from './transport.mjs';
import type {ProjectSnapshot} from '@application/project-storage';
import {createAuthoringOperations} from '@application/authoring';
import {createColorLiteral} from '@domain/color-literal';
let applied:ProjectSnapshot,epoch=0,revision=0,serial=0;
let active:{context:Record<string,number>;handle:number;text:string}|undefined;
let encodings=0,frames=0;
const ops=createAuthoringOperations({load:()=>({status:'ok',value:applied}),commit:()=>{throw Error('read-only');}});
function send(value:unknown){if(bytes(value)>32768)throw Error('Whole wire bound');postMessage(value);}
self.onmessage=async({data:x})=>{try{
 if(bytes(x)>32768)throw Error('Request too large');
 if(x.op==='load'){active=undefined;applied=snapshot(x.kind) as unknown as ProjectSnapshot;epoch=x.epoch;revision=1;encodings=0;frames=0;send({op:'loaded',epoch,revision});return;}
 if(x.op==='stats'){send({op:'stats',encodings,frames,activeUnits:active?.text.length??0});return;}
 if(x.op==='release'){if(active&&same(x.context,active.context))active=undefined;return;}
 if(x.op==='appliedColor'){
  active=undefined;if(epoch!==x.epoch||revision+1!==x.revision)throw Error('Stale applied delta');
  const index=applied.tokens.findIndex(t=>t.id===x.tokenId);const t=applied.tokens[index];
  if(!t||x.value.kind!=='literal'||x.value.valueType!=='color')throw Error('Delta outside qualification scope');
  const value=createColorLiteral({colorSpace:x.value.colorSpace,components:x.value.components,alpha:x.value.alpha});
  applied={...applied,tokens:applied.tokens.map((token,i)=>i===index?{...token,definition:{type:'color',assignments:[{condition:t.definition!.assignments[0].condition,value}]}}:token)};revision=x.revision;send({op:'applied',epoch,revision});return;
 }
 if(x.context.epoch!==epoch||x.context.revision!==revision)throw Error('Stale applied source');
 if(x.op==='open'){
  active=undefined;if(x.fail)throw Error('Injected requested worker read failure');
  // Genuine application read, not a fabricated ProjectReadback. Fixture load did not encode source.
  const result=ops.readProject(applied.project.id);if(result.status!=='ok')throw Error('Read unavailable');
  const t=result.value.tokens[x.tokenHandle]?.authored;if(!t)throw Error('Token not found');
  const started=performance.now();const text=JSON.stringify(t,null,2);encodings++;
  const handle=++serial,local={context:x.context,handle,text};active=local;
  const digest=Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',new TextEncoder().encode(text))),b=>b.toString(16).padStart(2,'0')).join('');
  if(active!==local)return;
  send({op:'source',context:x.context,handle,total:text.length,sha256:digest,encodeMs:performance.now()-started});return;
 }
 if(x.op==='next'){
  if(!active||!same(x.context,active.context)||active.handle!==x.handle)throw Error('Obsolete source handle');
  frames++;send(frame(active.text,x.offset,{op:'chunk',context:active.context,handle:active.handle}));return;
 }
 throw Error('Unknown exact-source request');
}catch(error){send({op:'error',context:x.context,message:String(error)});}};
