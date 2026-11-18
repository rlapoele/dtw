import { createServer } from 'vite';
import { writeFile } from 'node:fs/promises';
const server = await createServer({server:{middlewareMode:true,ws:false}});
try {
 const { encodeBackup } = await server.ssrLoadModule('/src/application/retention/codec.ts');
 const color={kind:'literal',valueType:'color',colorSpace:'oklch',components:['0.5461','0.2152','262.8809'],alpha:'0.75'};
 const token=(id,name,parent,type,layer,value=color)=>({id,projectId:'increment-017-isolated',localName:name,parentGroupId:parent,description:'Readable authored design-token description',authoring:{regeneration:'protected'},...(layer?{layer}:{}),definition:{type,assignments:[{condition:[],value}]}});
 const group=(id,name,parent=null)=>({id,projectId:'increment-017-isolated',localName:name,parentGroupId:parent});
 const snapshot={project:{id:'increment-017-isolated',name:'Increment 017 isolated fixture'},groups:[group('color','color'),group('brand','brand','color')],tokens:[token('blue10','10','brand','color','primitive'),token('blue2','2','brand','color','primitive'),token('alias','action','color','color','semantic',{kind:'token-reference',targetTokenId:'blue2',valuePath:[]}),token('missing','missing',null,'color','semantic',{kind:'token-reference',targetTokenId:'absent',valuePath:[]}),token('dimension','space-2',null,'dimension','primitive',{kind:'literal',valueType:'dimension',value:'12',unit:'px'}),token('duration','fast',null,'duration',undefined,{kind:'literal',valueType:'duration',value:'150',unit:'ms'})]};
 await writeFile('output/playwright/increment-017/fixture.json',encodeBackup(snapshot,'2026-11-18T00:00:00.000Z'));
} finally { await server.close(); }
