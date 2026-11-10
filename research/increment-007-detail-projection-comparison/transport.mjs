export const targets={rows:24,bytes:32768,units:8192};
const utf=new TextEncoder();
export const encodedBytes=x=>utf.encode(JSON.stringify(x)).length;
/** JSON-framed UTF-16 slices preserve lone surrogates and split pairs losslessly. */
export function nextFrame(text,offset,header){
 let n=Math.min(targets.units,text.length-offset);
 let frame={...header,offset,total:text.length,text:text.slice(offset,offset+n),complete:offset+n===text.length};
 while(encodedBytes(frame)>targets.bytes&&n>0){n=Math.floor(n/2);frame={...frame,text:text.slice(offset,offset+n),complete:offset+n===text.length};}
 if(encodedBytes(frame)>targets.bytes||(!n&&offset<text.length))throw Error('bounded header cannot fit');
 return frame;
}
export function appendFrame(state,frame){
 if(frame.offset!==state.offset||frame.total!==state.total)throw Error('noncontiguous or mixed text');
 state.parts.push(frame.text);state.offset+=frame.text.length;
 if(frame.complete&&state.offset!==state.total)throw Error('false completion');
 return frame.complete?state.parts.join(''):undefined;
}
export function sameContext(a,b){return a!==undefined&&b!==undefined&&JSON.stringify(a)===JSON.stringify(b);}
