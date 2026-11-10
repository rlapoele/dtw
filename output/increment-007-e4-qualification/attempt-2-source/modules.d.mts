declare module './transport.mjs' {
 export function bytes(value:unknown):number;
 export function context(worker:number,epoch:number,revision:number,selection:number,request:number):Record<string,number>;
 export function same(a:unknown,b:unknown):boolean;
 export function frame(text:string,offset:number,header:object):any;
 export function accept(state:{offset:number;total:number;parts:string[]},frame:any):string|undefined;
}
