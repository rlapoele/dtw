import {createServer} from 'node:http';
import {readFile,appendFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const repo=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
export async function serve(port=0){const server=createServer(async(req,res)=>{
 try{
  if(req.method==='POST'&&req.url==='/manual-evidence'){
   let bytes=0,chunks=[];for await(const b of req){bytes+=b.length;if(bytes>262144)throw Error('evidence-size');chunks.push(b);}
   const evidence=JSON.parse(Buffer.concat(chunks).toString());
   await mkdir(path.join(repo,'output/increment-007-worker-qualification'),{recursive:true});
   await appendFile(path.join(repo,'output/increment-007-worker-qualification/manual-user-events.jsonl'),JSON.stringify({received:new Date().toISOString(),attribution:'user-operated normal Safari; self-reported browser actions plus harness observations',...evidence})+'\n');res.end('recorded');return;
  }
  let url=new URL(req.url,'http://localhost'),file=path.resolve(repo,'.'+url.pathname);
  const allowed=['research/increment-007-worker-qualification/','research/increment-007-stage-a/'];
  if(!allowed.some(p=>file.startsWith(path.join(repo,p))))throw Error('path');
  if(url.pathname.endsWith('/'))file=path.join(file,'index.html');
  let bytes;try{bytes=await readFile(file);}catch{bytes=await readFile(file+'.js');}
  res.setHeader('Content-Type',file.endsWith('.html')?'text/html':'text/javascript');
  res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; worker-src 'self'; connect-src 'self'; img-src 'self' blob:; style-src 'self'; base-uri 'none'; object-src 'none'");
  res.end(bytes);
 }catch(error){res.writeHead(404).end(String(error));}
 });await new Promise((r,j)=>{server.on('error',j);server.listen(port,'127.0.0.1',r);});return {server,origin:'http://127.0.0.1:'+server.address().port,route:'/research/increment-007-worker-qualification/'};}
if(process.argv[1]===fileURLToPath(import.meta.url)){const {origin,route}=await serve(Number(process.env.DTW_QUALIFICATION_PORT||0));console.log(origin+route+'manual.html');}
