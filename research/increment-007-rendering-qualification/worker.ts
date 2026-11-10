import {makeFixture} from './fixtures.mjs';
import {identityLabels} from '@presentation/readback';
let project:any,rows:any[]=[],labels=new Map(),context:any;
const utf=new TextEncoder();
self.onmessage=async ({data:x})=>{try{
 let value:any;
 if(x.op==='load') {const f=makeFixture(x.kind);project={project:f.snapshot.project,groups:f.snapshot.groups.map((authored:any)=>({authored,path:{status:'derived',path:[authored.localName]}})),tokens:f.snapshot.tokens.map((authored:any)=>({authored,path:authored.parentGroupId===null?{status:'derived',path:[authored.localName]}:{status:'unavailable',reason:'missing-group'}}))};labels=identityLabels(project.tokens);context=x.context;rows=project.tokens.filter((t:any)=>labels.get(t.authored.id)!.toLowerCase().includes((x.query??'').toLowerCase()));value={count:rows.length,groups:project.groups.length,counts:f.counts,sha256:Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256',utf.encode(f.canonical))),n=>n.toString(16).padStart(2,'0')).join(''),project:project.project};}
 if(x.op==='batch'){let batch:any[]=[],bytes=0;for(let i=x.offset;i<rows.length&&batch.length<24;i++){const t=rows[i],row={t,label:labels.get(t.authored.id)},size=utf.encode(JSON.stringify(row)).length;if(batch.length&&bytes+size>32768)break;batch.push(row);bytes+=size;}value={batch,bytes,done:x.offset+batch.length===rows.length};}
 if(x.op==='inspect'){const t=project.tokens.find((t:any)=>t.authored.id===x.tokenId);const v=t.authored.definition?.assignments[0]?.value;value={inspection:{...t,resolution:{status:'resolved',value:v,trace:[{tokenId:t.authored.id}],diagnostics:[]}},project};}
 if(x.op==='raw') value=JSON.stringify(project.tokens.find((t:any)=>t.authored.id===x.tokenId).authored,null,2);
 self.postMessage({id:x.id,context,value});
}catch(e){self.postMessage({id:x.id,error:String(e)});}};
