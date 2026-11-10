import {serve} from '../../../research/increment-007-https-qualification/server.mjs';
import {request} from 'node:http';
import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
const {server,origin}=await serve();
const results=[];
function probe(path,method='GET',headers={}){return new Promise((resolve,reject)=>{const q=request(origin,{path,method,headers},r=>{let bytes=0;r.on('data',b=>bytes+=b.length);r.on('end',()=>resolve({path,method,status:r.statusCode,bytes,csp:r.headers['content-security-policy']}));});q.on('error',reject);q.end();});}
try {
 for(const p of ['/publication-manifest.json','/preflight.md','/server.mjs','/prepare.mjs','/research/increment-007-https-qualification/publish/worker.mjs','/%252e%252e/AGENTS.md','/%2fworker.mjs','/vendor%2fmain.js','/vendor/impl/../main.js','/vendor/impl/%2e%2e/main.js','/worker.mjs#x','/?x=1','/capability-failure?x=1','/blocked/','/../../../../etc/passwd','\\worker.mjs','http://127.0.0.1:5173/','//127.0.0.1:5173/']){const r=await probe(p);assert.ok([400,404].includes(r.status),p);results.push(r);}
 for(const method of ['TRACE','PROPFIND']){const r=await probe('/',method);assert.ok([400,405].includes(r.status),method);results.push(r);}
 const denied=await probe('/blocked');assert.equal(denied.status,200);assert.ok(denied.csp.includes("worker-src 'none'"));results.push(denied);
 const body=await probe('/','HEAD',{'Transfer-Encoding':'chunked'});assert.equal(body.status,400);results.push(body);
} finally {await new Promise(r=>server.close(r));}
await writeFile(new URL('pre-exposure.json',import.meta.url),JSON.stringify({scope:'own loopback only; no binary/browser/tunnel execution',serverClosed:!server.listening,results},null,2)+'\n');
console.log(JSON.stringify({checks:results.length,serverClosed:!server.listening}));
