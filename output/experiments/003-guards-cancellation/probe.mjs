// Disposable observable route investigation v1; NOT approved production kernel.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
import Color from '../../../prototypes/increment-003-v1/node_modules/colorjs.io/src/index.js';
import {M as S} from '../../../prototypes/increment-003-v1/node_modules/colorjs.io/src/spaces/srgb-linear.js';
import {M as O} from '../../../prototypes/increment-003-v1/node_modules/colorjs.io/src/spaces/oklab.js';
const dir=path.dirname(fileURLToPath(import.meta.url)), root=path.resolve(dir,'../../..');
const url=s=>'data:text/javascript;base64,'+Buffer.from(s).toString('base64');
const dec=url(stripTypeScriptTypes(fs.readFileSync(path.join(root,'src/domain/decimal.ts'),'utf8')));
const src=stripTypeScriptTypes(fs.readFileSync(path.join(root,'src/domain/color-literal.ts'),'utf8')).replaceAll('"./decimal"',JSON.stringify(dec));
const {createColorLiteral}=await import(url(src));
// Reuse only the frozen formatting TEXT, not candidate/reference results.
const prior=fs.readFileSync(path.join(dir,'../003-numerical-feasibility/probe.mjs'),'utf8');
const {sig}=await import(url(prior.slice(prior.indexOf('function expand('),prior.indexOf('function byte('))+'\nexport {sig};'));
const refs=JSON.parse(fs.readFileSync(path.join(dir,'reference.json'),'utf8'));
function rational(x){ // exact rational of the actual binary64, not shortest text
 const b=new DataView(new ArrayBuffer(8));b.setFloat64(0,x);const bits=b.getBigUint64(0),s=bits>>63n?-1n:1n,e=Number((bits>>52n)&2047n),f=bits&((1n<<52n)-1n);
 let n=s*(e?f+(1n<<52n):f),k=(e?e-1023:-1022)-52;return k>=0?[n<<BigInt(k),1n]:[n,1n<<BigInt(-k)];
}
const add=([a,b],[c,d])=>[a*d+c*b,b*d], mul=([a,b],[c,d])=>[a*c,b*d];
function exactdot(row,v){return row.map((x,i)=>mul(rational(x),rational(v[i]))).reduce(add,[0n,1n])[0]===0n;}
const valid=x=>Number.isFinite(x)&&(x===0||(Math.abs(x)>=1e-100&&Math.abs(x)<=1e6));
function attempt(input,target){
 const before=JSON.stringify(input),events=[],signals=[]; let output, failure;
 const record=(name,values,kind='coordinate')=>{const v=Array.isArray(values)?values:[values];events.push({name,kind,values:v,valid:v.every(valid)});return values;};
 const scalar=(n,x)=>record(n,x,'scalar');
 function matrix(name,m,v){return record(name,m.map((row,i)=>{
  const products=row.map((x,j)=>scalar(`${name}.${i}.product${j}`,x*v[j]));
  const a=scalar(`${name}.${i}.sum01`,products[0]+products[1]),sum=scalar(`${name}.${i}.sum012`,a+products[2]);
  const exactZero=exactdot(row,v);if(sum===0&&!exactZero)signals.push({kind:'demonstrated-matrix-zero-collapse',stage:name,row:i});
  const scale=products.reduce((a,b)=>a+Math.abs(b),0);if(scale&&Math.abs(sum)/scale<1e-12&&!exactZero)signals.push({kind:'ill-conditioned-unresolved',stage:name,row:i,ratio:Math.abs(sum)/scale});
  return sum;
 }));}
 try {
  const source=createColorLiteral(input);if(source.colorSpace===target){output=source;return {status:'identity',scalarStatus:'identity',output,events,signals,inputUnchanged:before===JSON.stringify(input)};}
  let texts=[...source.components];if(texts.some(x=>x.length>4096))throw Error('text-limit');
  if(source.colorSpace==='oklch'&&texts[1]==='0'&&texts[2]==='none')texts[2]='0';
  if(texts.includes('none'))throw Error('missing');
  let v=texts.map(Number);record('input',v);
  for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)if(texts[i]!==texts[j]&&v[i]===v[j])signals.push({kind:'source-number-collapse',pair:[i,j]});
  if(texts.some((x,i)=>x!=='0'&&v[i]===0))signals.push({kind:'source-number-zero-collapse'});
  let lab;
  if(source.colorSpace==='srgb'){
   if(texts[0]===texts[1]&&texts[1]===texts[2]){
    // Exact authored-neutral branch, avoids manufacturing matrix hue/axes.
    const x=v[0],linear=Math.abs(x)<=.04045?scalar('neutral.transfer',x/12.92):scalar('neutral.transfer',Math.sign(x)*((Math.abs(x)+.055)/1.055)**2.4);
    record('neutral.linear',linear);
    lab=record('exact-neutral.oklab',[scalar('neutral.cbrt',Math.cbrt(linear)),0,0]);
   } else {
    const lin=record('linear',v.map((x,i)=>{if(Math.abs(x)<=.04045)return scalar(`transfer.${i}.divide`,x/12.92);const p=scalar(`transfer.${i}.offset`,Math.abs(x)+.055),q=scalar(`transfer.${i}.divide`,p/1.055);return scalar(`transfer.${i}.pow`,Math.sign(x)*q**2.4);}));
    const xyz=matrix('xyz',S.toXYZ,lin),lms=matrix('lms',O.XYZtoLMS,xyz);
    const roots=record('cbrt',lms.map((x,i)=>scalar(`cbrt.${i}`,Math.cbrt(x))));
    for(let i=0;i<3;i++)for(let j=i+1;j<3;j++)if(lms[i]!==lms[j]&&roots[i]===roots[j])signals.push({kind:'demonstrated-cbrt-pair-collapse',pair:[i,j]});
    lab=matrix('oklab',O.LMStoLab,roots);
   }
  } else if(source.colorSpace==='oklab')lab=v;
  else if(source.colorSpace==='oklch'){
   const angle=scalar('polar.radians',v[2]*Math.PI/180),cos=scalar('polar.cos',Math.cos(angle)),sin=scalar('polar.sin',Math.sin(angle));
   lab=record('oklab',[v[0],scalar('polar.a',v[1]*cos),scalar('polar.b',v[1]*sin)]);
   if(v[1]!==0&&(lab[1]===0&&lab[2]===0))signals.push({kind:'demonstrated-polar-collapse'});
  } else throw Error('unexplored-route');
  let r=lab;
  if(target==='oklch'){
   const [l,a,b]=lab,c=scalar('polar.hypot',Math.hypot(a,b));
   const neutral=(source.colorSpace==='srgb'&&texts[0]===texts[1]&&texts[1]===texts[2])||(source.colorSpace==='oklab'&&texts[1]==='0'&&texts[2]==='0')||(source.colorSpace==='oklch'&&texts[1]==='0');
   if(!neutral&&c===0)signals.push({kind:'non-neutral-zero-chroma-unresolved'});
   r=neutral?[l,0,'none']:[l,c,scalar('polar.degrees',(Math.atan2(b,a)*180/Math.PI+360)%360)];
  } else if(target!=='oklab')throw Error('unexplored-route');
  record('final',r.filter(x=>x!=='none'));
  const components=r.map(x=>x==='none'?x:sig(String(x),12));if(components.some(x=>x.length>4096))throw Error('output-text-limit');
  output=createColorLiteral({colorSpace:target,components,alpha:source.alpha});
 }catch(e){failure=e.message;}
 const coordinateInvalid=events.filter(x=>x.kind==='coordinate'&&!x.valid),scalarInvalid=events.filter(x=>!x.valid);
 // Cbrt pair collapse proves internal loss, but not its effect on every final
 // rounded candidate. Conservative refusal is an explicitly unagreed hypothesis.
 const conservativeLoss=signals.some(x=>x.kind==='demonstrated-cbrt-pair-collapse');
 const loss=signals.some(x=>(x.kind.startsWith('demonstrated')&&x.kind!=='demonstrated-cbrt-pair-collapse')||x.kind.startsWith('source-number'));
 const status=failure?'required-refusal':coordinateInvalid.length||loss?'required-refusal':conservativeLoss?'conservative-refusal':signals.length?'unresolved':'sampled-success';
 const scalarStatus=failure||scalarInvalid.length||loss?'required-refusal':conservativeLoss?'conservative-refusal':signals.length?'unresolved':'sampled-success';
 const acceptedOutput=status==='sampled-success'?output:undefined,diagnosticCandidate=status==='sampled-success'?undefined:output;
 return {status,scalarStatus,failure,coordinateInvalid:coordinateInvalid.map(x=>x.name),scalarInvalid:scalarInvalid.map(x=>x.name),signals,output:acceptedOutput,diagnosticCandidate,events,inputUnchanged:before===JSON.stringify(input)};
}
const cases=refs.cases.map(f=>({id:f.id,input:{colorSpace:'srgb',components:f.input,alpha:'0.123456789123456789'},target:'oklch'}));
const special=[
 ['scalar-reading-split','srgb',['0.'+'0'.repeat(96)+'1','0','0'],'oklch'],
 ['source-collapse','srgb',['0.500000000000000000000001','0.5','0.5'],'oklch'],
 ['neutral-minimum','srgb',Array(3).fill('0.'+'0'.repeat(99)+'1'),'oklch'],
 ['neutral-gray','srgb',['0.5','0.5','0.5'],'oklch'],['black','srgb',['0','0','0'],'oklch'],['white','srgb',['1','1','1'],'oklch'],
 ['tiny-axis','oklab',['0.5','0.000000000000001','0'],'oklch'],['near-cancel','oklab',['0.5','0.00000000000000001','0.00000000000000001'],'oklch'],
 ['powerless-missing','oklch',['0.5','0','none'],'oklab'],['powerless-identity','oklch',['0.5','0','270'],'oklch'],
 ['polar-quarter-turn','oklch',['0.5','0.1','90'],'oklab'],['output-target-invalid','srgb',['2','0','0'],'oklab'],
 ['text-budget','srgb',['0.'+'0'.repeat(4094)+'1','0','0'],'oklab']
];
for(const [id,colorSpace,components,target] of special)cases.push({id,input:{colorSpace,components,alpha:'1'},target});
const results=cases.map(f=>({...f,result:attempt(f.input,f.target)}));
assert.equal(results.find(x=>x.id==='near-neutral').result.status,'conservative-refusal');
assert.equal(results.find(x=>x.id==='neutral-minimum').result.status,'required-refusal');
assert.equal(results.find(x=>x.id==='neutral-minimum').result.scalarStatus,'required-refusal');
assert(results.find(x=>x.id==='neutral-minimum').result.coordinateInvalid.includes('neutral.linear'));
assert.equal(results.find(x=>x.id==='scalar-reading-split').result.scalarStatus,'required-refusal');
assert.equal(results.find(x=>x.id==='scalar-reading-split').result.status,'sampled-success');
for(const id of ['minimum','maximum','source-collapse','text-budget','output-target-invalid'])assert.equal(results.find(x=>x.id===id).result.status,'required-refusal',id);
for(const id of ['interior','red','tiny','neutral-gray','black','white','tiny-axis'])assert.equal(results.find(x=>x.id===id).result.status,'sampled-success',id);
assert(results.every(x=>x.result.inputUnchanged));
const linear=refs.linear.map(f=>{const v=f.input.map(Number),actual=v[0]+v[1]+v[2],exactBinaryZero=exactdot([1,1,1],v);return {...f,actual,exactBinaryZero,status:actual===0&&!exactBinaryZero?'required-refusal':'exact-subcase-success'};});
assert.equal(linear.find(x=>x.id==='true-zero').status,'exact-subcase-success');assert.equal(linear.find(x=>x.id==='lost-nonzero').status,'required-refusal');
const nonlinearControls=[{kind:'synthetic-cbrt-pair',input:[1,1+Number.EPSILON],output:[Math.cbrt(1),Math.cbrt(1+Number.EPSILON)],status:Math.cbrt(1)===Math.cbrt(1+Number.EPSILON)?'demonstrated-injective-function-collapse':'distinct'}, {kind:'synthetic-polar-quadrature',angle:90,radians:90*Math.PI/180,cos:Math.cos(90*Math.PI/180),sin:Math.sin(90*Math.PI/180),status:'ideal-axis-zero-not-certified-by-libm'}];
assert.equal(nonlinearControls[0].status,'demonstrated-injective-function-collapse');
const injections=[NaN,Infinity,-Infinity,1e-101,1e7].map(x=>({label:String(x),valid:valid(x)}));assert(injections.every(x=>!x.valid));
const metrics=refs.cases.map(f=>{const r=results.find(x=>x.id===f.id).result,actual=r.events.find(x=>x.name==='oklab'&&x.kind==='coordinate')?.values,reference=f.reference['240'].oklab.map(Number);if(!actual)return {id:f.id,status:'unmeasured'};const maxAbs=Math.max(...actual.map((x,i)=>Math.abs(x-reference[i])));assert(Number.isFinite(maxAbs));return {id:f.id,status:'measured',maxAbs};});
const counts=k=>results.reduce((a,x)=>(a[x.result[k]]=(a[x.result[k]]??0)+1,a),{});
const summary={cases:results.length,coordinateReading:counts('status'),scalarReading:counts('scalarStatus'),allInputUnchanged:true,maxMeasuredLabAbs:Math.max(...metrics.filter(x=>x.status==='measured').map(x=>x.maxAbs))};
const pkg=JSON.parse(fs.readFileSync(path.join(root,'prototypes/increment-003-v1/node_modules/colorjs.io/package.json'),'utf8'));
fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify({version:'observable-research-route-v1',runtime:process.version,candidate:pkg.version,summary,results,linear,nonlinearControls,injections,metrics},null,2)+'\n');console.log(JSON.stringify(summary,null,2));
