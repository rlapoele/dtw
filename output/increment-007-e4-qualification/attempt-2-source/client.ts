import {bytes,accept,same,context} from './transport.mjs';
export type Metrics={activation:number;metadata?:number;assembled?:number;mounted?:number;painted?:number;total?:number;sha256?:string;encodeMs?:number;maxWire:number;maxUnits:number;frames:number};
const worker=new Worker(new URL('./worker.ts',import.meta.url),{type:'module'});
let epoch=0,revision=1,selection=0,request=0;let live:Record<string,number>|undefined;
let result:((text:string,m:Metrics)=>void)|undefined,reject:((error:Error)=>void)|undefined;
let state:{offset:number;total:number;parts:string[]}|undefined,handle=0,metrics:Metrics;
let timer:number|undefined;
let loaded:((value:unknown)=>void)|undefined,stat:((value:unknown)=>void)|undefined;
export const events:unknown[]=[];
function send(value:unknown){if(bytes(value)>32768)throw Error('Request wire bound');worker.postMessage(value);}
export function invalidate(){clearTimeout(timer);if(live)send({op:'release',context:live});live=undefined;result=undefined;reject=undefined;state=undefined;request++;}
export function select(){invalidate();selection++;}
export function load(kind:string){invalidate();epoch++;revision=1;return new Promise(resolve=>{loaded=resolve;send({op:'load',epoch,kind});});}
export function appliedColor(tokenId:string,value:unknown){invalidate();revision++;send({op:'appliedColor',epoch,revision,tokenId,value});return revision;}
export function stats(){return new Promise(resolve=>{stat=resolve;send({op:'stats'});});}
export function open(tokenHandle:number,fail:boolean,onComplete:(text:string,m:Metrics)=>void,onError:(error:Error)=>void){
 invalidate();live=context(1,epoch,revision,selection,++request);metrics={activation:performance.now(),maxWire:0,maxUnits:0,frames:0};result=onComplete;reject=onError;
 const requested=live;timer=window.setTimeout(()=>{if(same(live,requested)){reject?.(Error('Requested source action exceeded five seconds'));invalidate();}},5000);
 send({op:'open',context:live,tokenHandle,fail});return live;
}
let held=false;const queue:any[]=[];
export function hold(value:boolean){held=value;}
export function release(){held=false;const messages=queue.splice(0);for(const x of messages)receive(x);return messages.length;}
export function queued(){return queue.length;}
worker.onmessage=({data:x})=>{if(held&&['source','chunk','error'].includes(x.op)){queue.push(x);return;}receive(x);};
function receive(x:any){
 events.push({op:x.op,context:x.context,at:performance.now(),bytes:bytes(x)});
 if(x.op==='loaded'){loaded?.(x);loaded=undefined;return;}
 if(x.op==='stats'){stat?.(x);stat=undefined;return;}
 if(!same(live,x.context)){events.push({ignored:true,op:x.op});return;}
 if(bytes(x)>32768){reject?.(Error('Whole wire overflow'));invalidate();return;}
 if(x.op==='error'){reject?.(Error(x.message));invalidate();return;}
 if(x.op==='source'){
  handle=x.handle;state={offset:0,total:x.total,parts:[]};Object.assign(metrics,{metadata:performance.now(),total:x.total,sha256:x.sha256,encodeMs:x.encodeMs});
  send({op:'next',context:live,handle,offset:0});return;
 }
 if(x.op==='chunk'&&state){try{
  if(x.handle!==handle)throw Error('Mixed source handle');
  metrics.maxWire=Math.max(metrics.maxWire,bytes(x));metrics.maxUnits=Math.max(metrics.maxUnits,x.text.length);metrics.frames++;
  const text=accept(state,x);if(text!==undefined){metrics.assembled=performance.now();clearTimeout(timer);result?.(text,metrics);state=undefined;}
  else send({op:'next',context:live,handle,offset:state.offset});
 }catch(error){reject?.(error as Error);invalidate();}}
}
