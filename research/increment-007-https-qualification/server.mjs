// Read-only static origin. Publication routes are exact, immutable in-memory bytes.
import {createServer} from 'node:http';
import {readFile,lstat,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const root=path.dirname(fileURLToPath(import.meta.url));
export const csp="default-src 'self'; script-src 'self'; worker-src 'self'; connect-src 'self'; object-src 'none'; base-uri 'none'";
export async function serve(port=0){
 const publish=path.join(root,'publish');
 if((await lstat(publish)).isSymbolicLink())throw Error('publish symlink refused');
 const manifest=JSON.parse(await readFile(path.join(root,'publication-manifest.json'),'utf8')),map=new Map();
 for(const entry of manifest.files){
  if(!/^publish\/[A-Za-z0-9/_.-]+$/.test(entry.file)||entry.file.split('/').includes('..'))throw Error('manifest path refused');
  const parts=entry.file.split('/');let current=root;
  for(const part of parts){current=path.join(current,part);if((await lstat(current)).isSymbolicLink())throw Error('asset symlink refused');}
  if(!((await lstat(current)).isFile())||await realpath(current)!==current)throw Error('asset not regular exact path');
  const bytes=await readFile(current);if(bytes.length!==entry.bytes||createHash('sha256').update(bytes).digest('hex')!==entry.sha256)throw Error('publication integrity mismatch');
  for(const route of entry.routes){if(!/^\/[A-Za-z0-9/_.-]*$/.test(route)||route.split('/').includes('..')||map.has(route))throw Error('manifest route refused');map.set(route,{bytes,mime:entry.mime});}
 }
 const server=createServer({maxHeaderSize:8192,requestTimeout:10000,headersTimeout:10000},(req,res)=>{
  res.setHeader('Content-Security-Policy',req.url==='/blocked'?csp.replace("worker-src 'self'","worker-src 'none'"):csp);
  res.setHeader('X-Content-Type-Options','nosniff');res.setHeader('Cache-Control','no-store');res.setHeader('Referrer-Policy','no-referrer');
  const deny=(status,text)=>{res.setHeader('Connection','close');res.writeHead(status,{'Content-Type':'text/plain; charset=utf-8'}).end(req.method==='HEAD'?undefined:text);};
  if(!['GET','HEAD'].includes(req.method)){res.setHeader('Allow','GET, HEAD');deny(405,'Method not allowed');return;}
  if(req.headers['transfer-encoding']||Number(req.headers['content-length']||0)!==0){deny(400,'Request body refused');return;}
  // No URL decoding, normalization, query matching, filesystem fallback or proxy.
  const asset=map.get(req.url);if(!asset){deny(404,'Not found');return;}
  res.writeHead(200,{'Content-Type':asset.mime,'Content-Length':asset.bytes.length});res.end(req.method==='HEAD'?undefined:asset.bytes);
 });
 server.maxRequestsPerSocket=100;server.keepAliveTimeout=1000;
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});
 return {server,origin:'http://127.0.0.1:'+server.address().port,manifest};
}
if(process.argv[1]===fileURLToPath(import.meta.url)){const {server,origin}=await serve(Number(process.env.DTW_HTTPS_PORT||0));console.log(JSON.stringify({origin,pid:process.pid,mode:'loopback-only exact synthetic allowlist'}));for(const signal of ['SIGINT','SIGTERM'])process.on(signal,()=>server.close(()=>process.exit(0)));}
