// Disposable research harness, not a production kernel or editor/session model.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import Color from '../../../prototypes/increment-003-v1/node_modules/colorjs.io/src/index.js';
const dir=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(dir,'../../..');
// Read actual constructor source, strip types in memory, rewrite only module URL.
const moduleUrl=s=>'data:text/javascript;base64,'+Buffer.from(s).toString('base64');
const decimalUrl=moduleUrl(stripTypeScriptTypes(fs.readFileSync(path.join(root,'src/domain/decimal.ts'),'utf8')));
const constructorSource=stripTypeScriptTypes(fs.readFileSync(path.join(root,'src/domain/color-literal.ts'),'utf8')).replaceAll('"./decimal"',JSON.stringify(decimalUrl));
const {createColorLiteral}=await import(moduleUrl(constructorSource));
const spaces=['srgb','display-p3','hsl','oklab','oklch'];
const map=s=>s==='display-p3'?'p3':s;
function expand(s){
  let [m,e='0']=s.toLowerCase().split('e'),neg=m.startsWith('-');if(neg)m=m.slice(1);
  let [a,b='']=m.split('.'),digits=a+b,pos=a.length+Number(e);
  let out=pos<=0?'0.'+'0'.repeat(-pos)+digits:pos>=digits.length?digits+'0'.repeat(pos-digits.length):digits.slice(0,pos)+'.'+digits.slice(pos);
  let [i,f='']=out.split('.');i=i.replace(/^0+(?=\d)/,'');f=f.replace(/0+$/,'');
  out=i+(f?'.'+f:'');return /^0(?:\.0*)?$/.test(out)?'0':(neg?'-':'')+out;
}
// Rounding is over exact decimal text, not toFixed or intermediate matrix stages.
function sig(s,n){
  let x=expand(String(s)),neg=x.startsWith('-');if(neg)x=x.slice(1);
  const [a,b='']=x.split('.');let d=(a+b).replace(/^0+/,'');if(!d)return '0';
  let scale=b.length;
  if(d.length>n){let cut=d.length-n,r=d.slice(n),q=BigInt(d.slice(0,n));
    if(r[0]>'5'||r[0]==='5'&&(/[1-9]/.test(r.slice(1))||q%2n===1n))q++;
    d=q.toString();scale-=cut;
  }
  return expand((neg?'-':'')+d+'e'+(-scale));
}
function byte(s){
  if(s.length>4096)throw Error('calculation-limit');
  let neg=s.startsWith('-');s=s.replace(/^-/,'');let [a,b='']=s.split('.');let p=BigInt(a+b),q=255n*10n**BigInt(b.length);
  const gcd=(a,b)=>b?gcd(b,a%b):a,g=gcd(p,q);p/=g;q/=g;
  let z=q,two=0,five=0;while(z%2n===0n){two++;z/=2n;}while(z%5n===0n){five++;z/=5n;}
  if(z===1n){const scale=Math.max(two,five);if(scale+String(p).length>4200)throw Error('calculation-limit');return expand((neg?'-':'')+String(p*2n**BigInt(scale-two)*5n**BigInt(scale-five))+'e-'+scale);}
  // Scale quotient so its leading significant digit is integral; round remainder exactly.
  let exponent=String(p).length-String(q).length;
  if(exponent>=0?p<q*10n**BigInt(exponent):p*10n**BigInt(-exponent)<q)exponent--;
  let shift=17-exponent;if(Math.abs(shift)>4200)throw Error('calculation-limit');
  let numerator=shift>=0?p*10n**BigInt(shift):p,denominator=shift>=0?q:q*10n**BigInt(-shift);
  let rounded=numerator/denominator,remainder=numerator%denominator;
  if(remainder*2n>denominator||remainder*2n===denominator&&rounded%2n===1n)rounded++;
  const out=expand((neg?'-':'')+rounded+'e'+(-shift));if(out.length>4200)throw Error('calculation-limit');return out;
}
function raw(s,v,t,narrow=true){
  if(s===t)return [...v];
  if(narrow&&s==='oklch'){
    const [l,c,h]=v,r=h*Math.PI/180;v=[l,c*Math.cos(r),c*Math.sin(r)];s='oklab';
  }
  if(narrow&&t==='oklch'){
    const [l,a,b]=new Color(map(s),v).to('oklab').coords;
    return [l,Math.hypot(a,b),(Math.atan2(b,a)*180/Math.PI+360)%360];
  }
  return new Color(map(s),v).to(map(t)).coords;
}
function neutral(s,v){
  if(s==='srgb'||s==='display-p3')return v[0]===v[1]&&v[1]===v[2];
  if(s==='hsl')return v[1]==='0'||v[2]==='0'||v[2]==='100';
  return s==='oklab'?v[1]==='0'&&v[2]==='0':v[1]==='0';
}
function limit(x){if(!Number.isFinite(x))throw Error('numerical-failure');if(x!==0&&(Math.abs(x)<1e-100||Math.abs(x)>1e6))throw Error('calculation-limit');}
function candidate(input,t){
  const source=createColorLiteral(input);if(source.colorSpace===t)return {status:'success',value:source};
  let v=[...source.components],s=source.colorSpace;
  if(v.includes('none')){
    if(s==='hsl'&&v[0]==='none'&&v[1]==='0')v[0]='0';
    else if(s==='oklch'&&v[2]==='none'&&v[1]==='0')v[2]='0';
    else throw Error('unsupported-missing-components');
  }
  v.forEach(x=>{if(x.length>4096)throw Error('calculation-limit');limit(Number(x));if(x!=='0'&&Number(x)===0)throw Error('numerical-failure');});
  if((s==='srgb'||s==='display-p3')&&!neutral(s,v)&&new Set(v.map(Number)).size===1)throw Error('numerical-failure');
  let r=raw(s,v.map(Number),t);
  if(!neutral(s,v)&&t==='oklch'&&r[1]===0)throw Error('numerical-failure');
  if(neutral(s,v)){
    if(t==='hsl')r=['none',0,r[2]];
    else if(t==='oklch')r=[r[0],0,'none'];
    else if(t==='oklab')r=[r[0],0,0];
    else r=[r[0],r[0],r[0]];
  }
  // A null powerless library hue is replaced only after exact neutral detection.
  // Explicit endpoint guards only: Color.js internal-stage observability is absent.
  r.filter(x=>x!=='none').forEach(limit);
  const components=r.map(x=>x==='none'?x:sig(String(x),12));
  try{return {status:'success',value:createColorLiteral({colorSpace:t,components,alpha:source.alpha})};}
  catch(e){return {status:'target-schema-incompatibility',message:e.message,components};}
}
function attempt(input,target){
  const before=JSON.stringify(input);let result;
  try{result=candidate(input,target);}catch(e){result={status:['calculation-limit','numerical-failure','unsupported-missing-components'].includes(e.message)?e.message:'invalid-input',message:e.message};}
  return {...result,inputUnchanged:before===JSON.stringify(input)};
}
const refs=JSON.parse(fs.readFileSync(path.join(dir,'reference.json'),'utf8'));
const cases=refs.map(f=>{let input={colorSpace:f.space,components:f.input,alpha:'0.123456789123456789123456789'};return {...f,defaultRaw:raw(f.space,f.input.map(Number),f.target,false),narrowRaw:raw(f.space,f.input.map(Number),f.target,true),candidate:attempt(input,f.target)};});
const dec=JSON.parse(fs.readFileSync(path.join(dir,'decimal-reference.json'),'utf8'));
const decimal={bytes:dec.bytes.map(f=>({...f,measured:byte(f.input),pass:byte(f.input)===f.expected})),format:dec.format.map(f=>({...f,measured:sig(f.input,f.digits),pass:sig(f.input,f.digits)===f.expected}))};
const special=[];
function add(name,s,v,t,alpha='0'){const input={colorSpace:s,components:v,alpha};special.push({name,input,target:t,result:attempt(input,t)});}
for(const s of spaces)for(let i=0;i<3;i++){const v=({srgb:['0','0','0'],'display-p3':['0','0','0'],hsl:['0','0','50'],oklab:['0.5','0','0'],oklch:['0.5','0','0']})[s].slice();v[i]='none';add('missing-'+s+'-'+i,s,v,'srgb'===s?'oklab':'srgb');}
add('missing-chromatic-hsl','hsl',['none','1','50'],'srgb');add('missing-chromatic-oklch','oklch',['0.5','0.1','none'],'srgb');
for(const bad of ['-','0.','1e2'])add('invalid-'+bad,'srgb',[bad,'0','0'],'oklab');
for(const a of ['0','1','0.123456789123456789123456789'])add('alpha-'+a,'srgb',['1','0','0'],'oklab',a);
add('long-exact-identity','srgb',['0.123456789123456789123456789','none','0'],'srgb','0.123456789123456789123456789');
add('numeric-powerless-identity','oklch',['0.5','0','270'],'oklch');
add('rounded-hue-360','oklab',['0.5','0.1','-0.00000000000001'],'oklch');
add('negative-large-hue','hsl',['-360000000000000000001','50','50'],'srgb');
for(const x of ['0.'+'0'.repeat(99)+'1','0.'+'0'.repeat(100)+'1','1000000','1000001','0.'+'0'.repeat(4094)+'1'])add('guard-'+x.length+'-'+x.slice(-9),'srgb',[x,'0','0'],'oklab');
add('underflow-endpoint','oklab',['0.'+'0'.repeat(99)+'1','0','0'],'srgb');
add('cancellation-collapsed-distinction','srgb',['0.5000000000000000000000001','0.5','0.5'],'oklch');
const cycles=[];
for(const v of [['0.2','0.4','0.6'],['1','0','0'],['0.5','0.5','0.5']])for(const t of spaces.filter(s=>s!=='srgb')){
 let current={colorSpace:'srgb',components:v,alpha:'1'},status='success',completed=0;
 for(let i=0;i<100;i++){let a=attempt(current,t);if(a.status!=='success'){status=a.status;break;}let b=attempt(a.value,'srgb');if(b.status!=='success'){status=b.status;break;}current=b.value;completed++;}
 cycles.push({input:v,via:t,status,completed,final:current.components,maxAbsSrgbError:Math.max(...v.map((x,i)=>Math.abs(Number(x)-Number(current.components[i]))))});
}
const boundaries=[];
for(const rgb of [[1,0,0],[0,1,0],[0,0,1],[1,1,1],[0,0,0],[0,1,1],[1,0,1],[1,1,0]])for(const t of spaces.filter(s=>s!=='srgb')){
 const middle=raw('srgb',rgb,t),roundtrip=raw(t,middle,'srgb');
 const overshoot=Math.max(0,...roundtrip.flatMap(x=>[-x,x-1]));
 boundaries.push({input:rgb,via:t,middle,roundtrip,overshoot,previewWithin1e10:overshoot<=1e-10});
}
const previewChecks=[-1e-10,-1.00001e-10,1+1e-10,1+1.01e-10].map(x=>({raw:x,available:x>=-1e-10&&x<=1+1e-10}));
const stages=['1e-100','1e6'].map(x=>({input:x,linear:new Color('srgb',[Number(x),0,0]).to('srgb-linear').coords,xyz:new Color('srgb',[Number(x),0,0]).to('xyz-d65').coords,oklab:raw('srgb',[Number(x),0,0],'oklab')}));
const byteBudgets=[];
for(const [name,x] of [['4096-char-input','0.'+'0'.repeat(4093)+'1'],['4097-char-input','0.'+'0'.repeat(4094)+'1'],['4096-char-integer','9'.repeat(4096)]]){
 try{const out=byte(x);byteBudgets.push({name,inputLength:x.length,status:'success',outputLength:out.length,nonzero:out!=='0'});}catch(e){byteBudgets.push({name,inputLength:x.length,status:e.message});}
}
const injectedNonFinite=[NaN,Infinity,-Infinity].map(x=>{try{limit(x);return 'unexpected-success';}catch(e){return e.message;}});
const lock=JSON.parse(fs.readFileSync(path.join(root,'prototypes/increment-003-v1/package-lock.json'),'utf8'));
const pkg=JSON.parse(fs.readFileSync(path.join(root,'prototypes/increment-003-v1/node_modules/colorjs.io/package.json'),'utf8'));
const provenance={node:process.version,v8:process.versions.v8,platform:process.platform,arch:process.arch,candidate:pkg.version,license:pkg.license,lock:lock.packages['node_modules/colorjs.io'],runtimeDependencies:pkg.dependencies??{},import:'prototypes/increment-003-v1/node_modules/colorjs.io/src/index.js'};
fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify({provenance,decimal,cases,special,cycles,boundaries,previewChecks,stages,byteBudgets,injectedNonFinite},null,2)+'\n');
console.log(JSON.stringify({provenance,decimalPass:decimal.bytes.concat(decimal.format).every(x=>x.pass),cases:cases.length,statusCounts:cases.reduce((a,x)=>(a[x.candidate.status]=(a[x.candidate.status]??0)+1,a),{}),tiny:cases.find(x=>x.id==='srgb-8-oklch'),cycles,maxBoundaryOvershoot:Math.max(...boundaries.map(x=>x.overshoot))},null,2));
