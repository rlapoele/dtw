export const bytes=value=>new TextEncoder().encode(JSON.stringify(value)).length;
export const context=(worker,epoch,revision,selection,request)=>({worker,epoch,revision,selection,request});
export const same=(a,b)=>!!a&&!!b&&Object.keys(a).length===Object.keys(b).length&&Object.keys(a).every(k=>a[k]===b[k]);
export function frame(text,offset,header){
 let count=Math.min(8192,text.length-offset);let value;
 do{value={...header,offset,total:text.length,text:text.slice(offset,offset+count),complete:offset+count===text.length};if(bytes(value)<=32768)return value;count=Math.floor(count/2);}while(count>0);
 throw Error('Whole frame header cannot fit');
}
export function accept(state,f){
 if(bytes(f)>32768||f.text.length>8192||f.offset!==state.offset||f.total!==state.total||state.offset+f.text.length>state.total||!f.text.length&&!f.complete)throw Error('Invalid exact-source frame');
 state.parts.push(f.text);state.offset+=f.text.length;
 if(f.complete){if(state.offset!==state.total)throw Error('False complete');return state.parts.join('');}
 if(state.offset===state.total)throw Error('Missing complete');
}
