import test from 'node:test';
import assert from 'node:assert/strict';
import {request} from 'node:http';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {serve,csp} from './server.mjs';
function get(origin,route,method='GET',headers={}){return new Promise((resolve,reject)=>{const req=request(origin,{path:route,method,headers},res=>{const chunks=[];res.on('data',x=>chunks.push(x));res.on('end',()=>resolve({status:res.statusCode,headers:res.headers,body:Buffer.concat(chunks)}));});req.on('error',reject);req.end();});}
test('exact allowlist only; every byte and MIME matches; denial is header-specific',async()=>{const {server,origin,manifest}=await serve();try{
 assert.equal(server.address().address,'127.0.0.1');
 for(const entry of manifest.files)for(const route of entry.routes){const r=await get(origin,route);assert.equal(r.status,200,route);assert.equal(r.headers['content-type'],entry.mime);assert.equal(r.body.length,entry.bytes);assert.equal(createHash('sha256').update(r.body).digest('hex'),entry.sha256);assert.equal(r.headers['content-security-policy'],route==='/blocked'?csp.replace("worker-src 'self'","worker-src 'none'"):csp);const h=await get(origin,route,'HEAD');assert.equal(h.status,200);assert.equal(h.body.length,0);assert.equal(Number(h.headers['content-length']),entry.bytes);}
 for(const route of ['/.git/config','/AGENTS.md','/output/','/manual-evidence','/publish/','/vendor/','/../AGENTS.md','/%2e%2e/AGENTS.md','/vendor/../../AGENTS.md','/vendor/%2e%2e/codec.mjs','/worker.mjs?x=1','/worker.mjs/','//worker.mjs','/index.html%00','/http://127.0.0.1:5173/','http://example.com/worker.mjs']){assert.equal((await get(origin,route)).status,404,route);}
 for(const method of ['POST','PUT','DELETE','PATCH','OPTIONS']){const r=await get(origin,'/',method);assert.equal(r.status,405);assert.equal(r.headers.allow,'GET, HEAD');}
 assert.equal((await get(origin,'/','GET',{'Content-Length':'1'})).status,400);
 }finally{await new Promise(r=>server.close(r));}});

test('startup refuses symlink assets and mismatched content before binding',async()=>{
 const {mkdtemp,cp,rm,unlink,symlink,writeFile}=await import('node:fs/promises');
 const {pathToFileURL}=await import('node:url');
 const os=await import('node:os'),path=await import('node:path');
 const temp=await mkdtemp(path.join(os.tmpdir(),'dtw-https-origin-negative-'));
 try{await cp(new URL('.',import.meta.url),temp,{recursive:true});
  await unlink(path.join(temp,'publish','worker.mjs'));await symlink('/etc/hosts',path.join(temp,'publish','worker.mjs'));
  const copy=await import(pathToFileURL(path.join(temp,'server.mjs')));
  await assert.rejects(copy.serve(),/symlink refused/);
  await unlink(path.join(temp,'publish','worker.mjs'));await writeFile(path.join(temp,'publish','worker.mjs'),'changed');
  await assert.rejects(copy.serve(),/integrity mismatch/);
 }finally{await rm(temp,{recursive:true,force:true});}
});
