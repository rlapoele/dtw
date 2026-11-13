// Synthetic review fixture only. Uses the production codec, no browser data.
// Run: node tools/increment-009-fixtures.mjs
import { createServer } from 'vite';
import { writeFile, mkdir } from 'node:fs/promises';
const server = await createServer({server:{middlewareMode:true,ws:false}});
try {
 const {encodeBackup,decodeBackup} = await server.ssrLoadModule('/src/application/retention/codec.ts');
 const literal={kind:'literal',valueType:'color',colorSpace:'srgb',components:['0.2','0.4','0.6'],alpha:'1'};
 const token=(id,name,parent,type='color')=>({id,projectId:'increment-009-synthetic',localName:name,parentGroupId:parent,authoring:{regeneration:'allowed'},definition:{type,assignments:[{condition:[],value:type==='color'?literal:{kind:'literal',valueType:'dimension',value:'8',unit:'px'}}]}});
 const group=(id,name,parent=null)=>({id,projectId:'increment-009-synthetic',localName:name,parentGroupId:parent});
 const snapshot={project:{id:'increment-009-synthetic',name:'Increment 009 synthetic legacy'},groups:[group('foundation-id','foundation'),group('conflicting-group-full-id','brandblue','foundation-id'),group('rename-source','old'),group('rename-child','Child','rename-source'),group('rename-target','palette'),group('rename-target-child','child','rename-target')],tokens:[token('duplicate-color-full-identity','Brand\u00A0Blue','foundation-id'),token('duplicate-dimension-full-identity','Brand\u00A0Blue','foundation-id','dimension'),token('orphan-full-identity','Orphan\u200DBlue','missing-parent-full-identity'),token('deep-source','Straße','rename-child'),token('deep-target','STRASSE','rename-target-child')]};
 const text=encodeBackup(snapshot,'2026-11-13T00:00:00.000Z');
 if(encodeBackup(decodeBackup(text).snapshot,'2026-11-13T00:00:00.000Z') !== text) throw Error('Fixture codec roundtrip differs');
 await mkdir('output/increment-009-implementation',{recursive:true});
 await writeFile('output/increment-009-implementation/synthetic-legacy-backup.json',text);
} finally { await server.close(); }
