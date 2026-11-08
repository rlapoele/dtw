import { createServer } from 'vite';
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import assert from 'node:assert/strict';
const manifest = JSON.parse(readFileSync('output/increment-006/implementation-manifest-r2.json','utf8'));
for (const [path, hash] of Object.entries(manifest.files)) assert.equal(createHash('sha256').update(readFileSync(path)).digest('hex'), hash, path);
const server = await createServer({server:{middlewareMode:true, hmr:false, ws:false}, cacheDir:'/tmp/dtw006-review-vite-cache', appType:'custom'});
try {
 const rgb = await server.ssrLoadModule('/src/presentation/integer-rgb.ts');
 const session = await server.ssrLoadModule('/src/presentation/session.ts');
 const readback = await server.ssrLoadModule('/src/presentation/readback.ts');
 const { createColorLiteral } = await server.ssrLoadModule('/src/domain/color-literal.ts');
 const { createAuthoringOperations } = await server.ssrLoadModule('/src/application/authoring.ts');
 const { InMemoryProjectStorage } = await server.ssrLoadModule('/src/adapters/in-memory-project-storage.ts');
 const { Editor } = await server.ssrLoadModule('/src/presentation/Editor.tsx');
 const { createElement } = await import('react');
 const { renderToStaticMarkup } = await import('react-dom/server');
 // Independent integer arithmetic oracle across both signs and half boundaries.
 for (let i=-999;i<=999;i++) {
  const negative=i<0, magnitude=Math.abs(i);
  const text=(negative?'-':'')+(magnitude/1000).toFixed(3).replace(/0+$/,'').replace(/\.$/,'');
  const scaled=BigInt(magnitude)*255n, quotient=scaled/1000n,remainder=scaled%1000n;
  const rounded=quotient+(remainder>500n || remainder===500n&&quotient%2n===1n ? 1n:0n);
  assert.deepEqual(rgb.integerByteDisplay(text), {text:(negative&&rounded!==0n?'-':'')+rounded,approximate:remainder!==0n});
 }
 const source=createColorLiteral({colorSpace:'srgb',components:['0.2314','0.41234567890123456789','0.67890123456789'],alpha:'0.1234567890123456789'});
 let s={...session.baseline(source),scale:'bytes'};
 s=session.editComponent(s,1,'130');
 assert.deepEqual(s.literal.components,['0.2314','0.509803921568627451','0.67890123456789']);
 s=session.changeView(s,'oklab'); s=session.editComponent(s,0,'0.6');
 assert.equal(s.byteText,null); assert.deepEqual(s.byteEdited,[false,false,false]);
 s=session.changeView(s,'srgb'); assert.equal(session.fields(s).length,3);
 const labels=readback.identityLabels([{authored:{id:'a  b'},path:{status:'derived',path:['same']}},{authored:{id:'a b'},path:{status:'derived',path:['same']}}]);
 assert.equal(new Set(labels.values()).size,2);
 const app=createAuthoringOperations(new InMemoryProjectStorage());
 const ok=r=>{assert.equal(r.status,'ok');return r.value;};
 ok(app.createProject({id:'p',name:'P'}));
 for(const [id,name] of [['self','x'],['other','x (this token)']])ok(app.createColorToken({id,projectId:'p',localName:name,parentGroupId:null,type:'color',regeneration:'allowed',value:{kind:'literal',colorSpace:'srgb',components:['0','0','0'],alpha:'1'}}));
 ok(app.reviseColorToken({projectId:'p',tokenId:'self',value:{kind:'token-reference',targetTokenId:'other',valuePath:[]}}));
 const project=ok(app.readProject('p')),inspection=ok(app.inspectToken('p','self'));
 const html=renderToStaticMarkup(createElement(Editor,{project,inspection,inspect:id=>ok(app.inspectToken('p',id)),onApply:()=>{throw Error('unexpected mutation')},onDirty:()=>{},onFeedback:()=>{},readUnavailable:false}));
 const options=[...html.matchAll(/<option value="([^"]*)"[^>]*>(.*?)<\/option>/g)].filter(m=>['self','other'].includes(m[1])).map(m=>({value:m[1],text:m[2]}));
 writeFileSync('output/increment-006-review/reference-options.json',JSON.stringify(options,null,2));
 console.log(JSON.stringify({manifestFiles:Object.keys(manifest.files).length,integerOracleCases:1999,sessionPromotion:'passed',opaqueFallback:'passed',referenceOptions:options},null,2));
} finally { await server.close(); }
