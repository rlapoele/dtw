import {readFile,writeFile,readdir} from 'node:fs/promises';import {execFileSync} from 'node:child_process';import {createHash} from 'node:crypto';
const scope='research/increment-007-safari-readiness-supervision',out='output/increment-007-safari-readiness-supervision';
const sha=b=>createHash('sha256').update(b).digest('hex'),source={};
for(const name of (await readdir(scope)).sort())source[scope+'/'+name]=sha(await readFile(scope+'/'+name));
for(const file of ['index.html','page.mjs','worker.mjs','server.mjs','model.mjs'])source['research/increment-007-storage-concurrency-safety/'+file]=sha(await readFile('research/increment-007-storage-concurrency-safety/'+file));
for(const file of ['research/increment-007-stage-a/codec.mjs','research/increment-007-worker-qualification/protocol.mjs'])source[file]=sha(await readFile(file));
async function tree(dir){for(const e of await readdir(dir,{withFileTypes:true})){const file=dir+'/'+e.name;if(e.isDirectory())await tree(file);else if(e.isFile())source[file]=sha(await readFile(file));else throw Error('nonregular dependency: '+file);}}
await tree('research/increment-007-stage-a/node_modules/jsonc-parser/lib/esm');
const phase1=JSON.parse(await readFile(out+'/phase-1-manifest.json'));
for(const e of phase1.entries)if(sha(await readFile(e.path))!==e.sha256)throw Error('frozen phase1 changed: '+e.path);
const checks=[scope+'/offline.test.mjs',scope+'/ownership.test.mjs',scope+'/gate-evidence.test.mjs'];
const tests=execFileSync(process.execPath,['--test',...checks],{encoding:'utf8'});
await writeFile(out+'/corrected-offline-tests.txt',tests);
for(const file of Object.keys(source).filter(f=>f.startsWith(scope+'/')&&f.endsWith('.mjs')))execFileSync(process.execPath,['--check',file]);
const runner=await readFile(scope+'/gate-only.mjs','utf8');
if(runner.includes('inventory.mjs')||runner.includes("from '../increment-007-storage-concurrency-safety/run.mjs'"))throw Error('forbidden bulk runner dependency');
const snapshot={createdAt:new Date().toISOString(),baseline:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),scope:'one corrected driver readiness attempt then conditional G-02 only; zero storage cases',source,phase1ManifestSha:sha(await readFile(out+'/phase-1-manifest.json')),offlineTestsSha:sha(tests),liveExecuted:false,release:'independent preflight and coordinator release of this exact SHA required'};
const bytes=JSON.stringify(snapshot,null,2)+'\n';await writeFile(out+'/corrected-preflight.json',bytes);
console.log(JSON.stringify({files:Object.keys(source).length,sha:sha(bytes),tests:tests.split('\n').filter(l=>/pass|fail/.test(l))}));
