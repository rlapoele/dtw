// Offline only. Run before live execution; freezes scoped source/current inputs and
// actual bytes the runner serves. Never rebuild or rearchive after a live case.
import {readdir,readFile,writeFile,mkdir,cp} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {execFileSync} from 'node:child_process';
const source='research/increment-007-ordinary-rendering-isolation-r2',out='output/increment-007-ordinary-rendering-isolation-r2',build='/tmp/dtw-ordinary-isolation-r2-build';
try{await readFile(out+'/state.json');throw Error('A live batch was claimed; archive is frozen');}catch(e){if(e.code!=='ENOENT')throw e;}
const hash=s=>createHash('sha256').update(s).digest('hex');
async function list(dir){const result=[];for(const e of await readdir(dir,{withFileTypes:true})){const p=dir+'/'+e.name;if(e.isDirectory())result.push(...await list(p));else result.push(p);}return result.sort();}
const old=JSON.parse(await readFile('output/increment-007-ordinary-rendering-isolation/manifest.json'));
const inputs=old.entries.map(e=>e.path).filter(p=>!p.startsWith('research/increment-007-ordinary-rendering-isolation/')&&!p.startsWith('output/increment-007-ordinary-rendering-isolation/'));
inputs.push('output/increment-007-ordinary-rendering-isolation/report.md','output/increment-007-ordinary-rendering-isolation/independent-review.md','output/increment-007-ordinary-rendering-isolation/manifest.json');
await mkdir(out+'/execution-source',{recursive:true});await cp(source,out+'/execution-source',{recursive:true});await cp(build,out+'/served-build',{recursive:true});
const paths=[...inputs,...await list(source),...await list(out+'/execution-source'),...await list(out+'/served-build'),...await list(build)];
const files=await Promise.all([...new Set(paths)].sort().map(async path=>{const bytes=await readFile(path);return {path,bytes:bytes.length,sha256:hash(bytes)};}));
const manifest={baselineCommit:execFileSync('git',['rev-parse','HEAD']).toString().trim(),createdBeforeAnyLiveCase:true,files};
const serialized=JSON.stringify(manifest,null,2)+'\n';await writeFile(out+'/pre-execution-manifest.json',serialized);console.log(JSON.stringify({entries:files.length,sha256:hash(serialized)}));
