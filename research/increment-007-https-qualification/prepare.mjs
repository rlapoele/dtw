// Local-only manifest authoring. Never part of the published map.
import {readFile,writeFile,readdir,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url)), repo=path.resolve(root,'../..');
const hash=b=>createHash('sha256').update(b).digest('hex');
async function files(dir){let result=[];for(const name of (await readdir(dir)).sort()){const p=path.join(dir,name),s=await lstat(p);if(s.isSymbolicLink())throw Error('symlink refused');if(s.isDirectory())result.push(...await files(p));else if(s.isFile())result.push(p);else throw Error('not regular file');}return result;}
const entries=[];
for(const p of await files(path.join(root,'publish'))){const name=path.relative(path.join(root,'publish'),p).replaceAll(path.sep,'/'),bytes=await readFile(p);let source;
 if(['codec.mjs','fixtures.mjs'].includes(name))source='research/increment-007-stage-a/'+name;
 if(name.startsWith('vendor/'))source='research/increment-007-stage-a/node_modules/jsonc-parser/'+(name==='vendor/LICENSE.md'?'LICENSE.md':'lib/esm/'+name.slice(7));
 const original=source?await readFile(path.join(repo,source)):null;
 if(original&&!original.equals(bytes))throw Error('copy differs '+name);
 const routes=['/'+name];if(name==='index.html')routes.push('/','/blocked','/capability-failure');
 if(name.startsWith('vendor/impl/')&&name.endsWith('.js'))routes.push('/'+name.slice(0,-3));
 entries.push({file:'publish/'+name,routes,mime:name.endsWith('.html')?'text/html; charset=utf-8':name.endsWith('.md')?'text/plain; charset=utf-8':'text/javascript; charset=utf-8',bytes:bytes.length,sha256:hash(bytes),provenance:source?{source,originalSHA256:hash(original),change:'byte-identical copy'}:{source:'new isolated synthetic qualification source',change:'authored for this harness'},license:name.startsWith('vendor/')?'MIT; Microsoft Corporation; notice at /vendor/LICENSE.md':'DTW project-authored research; no separate outbound license asserted'});
}
const manifest={schema:1,baseCommit:'cc8eb9ef437e8d40f511525ca48642491db40991',scope:'Exact public synthetic asset allowlist only. No repository source/output roots or evidence endpoints.',files:entries};
await writeFile(path.join(root,'publication-manifest.json'),JSON.stringify(manifest,null,2)+'\n');
console.log(JSON.stringify({files:entries.length,routes:entries.flatMap(x=>x.routes).length,bytes:entries.reduce((n,x)=>n+x.bytes,0)}));
