// Disposable research harness, not a production kernel or editor/session model.
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {stripTypeScriptTypes} from 'node:module';
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
const packageRoot=process.env.CULORI_PACKAGE_ROOT||'/tmp/dtw-culori-qualification/package';
const C=await import(pathToFileURL(packageRoot+'/src/index.js'));
const {getMode,useMode}=await import(pathToFileURL(packageRoot+'/src/modes.js'));
let trace=[];
for(const mode of ['rgb','p3','hsl','lrgb','oklab','oklch','xyz65']){const d=getMode(mode);const wrap=(fn,from,to)=>x=>{const y=fn(x);trace.push({from,to,input:{...x},output:{...y}});return y;};useMode({...d,toMode:Object.fromEntries(Object.entries(d.toMode||{}).map(([to,fn])=>[to,wrap(fn,mode,to)])),fromMode:Object.fromEntries(Object.entries(d.fromMode||{}).map(([from,fn])=>[from,wrap(fn,from,mode)]))});}

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

const modes={srgb:'rgb','display-p3':'p3',hsl:'hsl',oklab:'oklab',oklch:'oklch'};
const channels={srgb:['r','g','b'],'display-p3':['r','g','b'],hsl:['h','s','l'],oklab:['l','a','b'],oklch:['l','c','h']};
function object(s,v){return {mode:modes[s],...Object.fromEntries(channels[s].flatMap((k,i)=>v[i]==='none'?[]:[[k,s==='hsl'&&i>0?v[i]/100:v[i]]]))};}
function raw(s,v,t){const out=C.converter(modes[t])(object(s,v));return channels[t].map((k,i)=>out[k]===undefined?null:t==='hsl'&&i>0?out[k]*100:out[k]);}
function neutral(s,v){
  if(s==='srgb'||s==='display-p3')return v[0]===v[1]&&v[1]===v[2];
  if(s==='hsl')return v[1]==='0'||v[2]==='0'||v[2]==='100';
  return s==='oklab'?v[1]==='0'&&v[2]==='0':v[1]==='0';
}
function limit(x){if(x===null||!Number.isFinite(x))throw Error('numerical-failure');if(x!==0&&(Math.abs(x)<1e-100||Math.abs(x)>1e6))throw Error('calculation-limit');}
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

const refs=JSON.parse(fs.readFileSync(path.join(dir,'../003-numerical-feasibility/reference.json'),'utf8'));
const baseline=JSON.parse(fs.readFileSync(path.join(dir,'../003-numerical-feasibility/results.json'),'utf8'));
const cases=refs.map(f=>{trace=[];const rawOutput=raw(f.space,f.input.map(Number),f.target);const route=[...trace];const input={colorSpace:f.space,components:f.input,alpha:'0.123456789123456789123456789'};const result=attempt(input,f.target);const expectedStatus=baseline.cases.find(b=>b.id===f.id).candidate.status;return {...f,raw:rawOutput,route,candidate:result,expectedStatus,statusMatches:result.status===expectedStatus};});
const dec=JSON.parse(fs.readFileSync(path.join(dir,'../003-numerical-feasibility/decimal-reference.json'),'utf8'));
const decimal={bytes:dec.bytes.map(f=>({...f,measured:byte(f.input),pass:byte(f.input)===f.expected})),format:dec.format.map(f=>({...f,measured:sig(f.input,f.digits),pass:sig(f.input,f.digits)===f.expected}))};
assert(decimal.bytes.concat(decimal.format).every(x=>x.pass));
const special=baseline.special.map(f=>{let rawOutput;trace=[];try{rawOutput=raw(f.input.colorSpace,f.input.components.map(x=>x==='none'?'none':Number(x)),f.target);}catch(e){rawOutput={error:e.message}};return {...f,baseline:f.result,result:attempt(f.input,f.target),raw:rawOutput,expectedStatus:f.result.status};});
const oldGuards=JSON.parse(fs.readFileSync(path.join(dir,'../003-guards-cancellation/results.json'),'utf8'));
const guards=oldGuards.results.map(f=>{trace=[];let rawOutput;try{rawOutput=raw(f.input.colorSpace,f.input.components.map(x=>x==='none'?'none':Number(x)),f.target)}catch(e){rawOutput={error:e.message}};const route=[...trace];const result=attempt(f.input,f.target);return {id:f.id,input:f.input,target:f.target,priorCoordinateClassification:f.result.status,priorScalarClassification:f.result.scalarStatus,priorSignals:f.result.signals,priorInvalid:f.result.coordinateInvalid,raw:rawOutput,route,endpointAdapter:result,coverage:'NOT stage-certified; callback internals opaque'};});
const routeInventory=[];for(const s of spaces)for(const t of spaces){trace=[];raw(s,({srgb:[.2,.4,.6],'display-p3':[.2,.4,.6],hsl:[30,40,50],oklab:[.5,.1,.1],oklch:[.5,.1,30]})[s],t);routeInventory.push({source:s,target:t,callbacks:trace.map(x=>x.from+'>'+x.to)});}
const mixes=[];
function mix(id,stops,mode,t,expected,options={}){trace=[];const before=JSON.stringify(stops);const fn=options.premult?C.interpolateWithPremultipliedAlpha:C.interpolate;const actual=fn(stops,mode,options.overrides)(t);const route=[...trace];const deltas=Object.entries(expected).map(([k,v])=>v===null?(actual[k]===undefined?0:Infinity):Math.abs(actual[k]-v));const maxAbs=Math.max(0,...deltas);mixes.push({id,stops,mode,t,policy:options,expected,actual,maxAbs,pass:Number.isFinite(maxAbs)&&maxAbs<1e-12,inputUnchanged:before===JSON.stringify(stops),route});}
const red={mode:'lrgb',r:1,g:0,b:0},blue={mode:'lrgb',r:0,g:0,b:1},green={mode:'lrgb',r:0,g:1,b:0};
for(const t of [0,.25,.5,1])mix('linear-'+t,[red,blue],'lrgb',t,{r:1-t,g:0,b:t});
mix('identical',[red,red],'lrgb',.37,{r:1,g:0,b:0});
for(const t of [-1,2])mix('clamp-'+t,[red,blue],'lrgb',t,t<0?{r:1,g:0,b:0}:{r:0,g:0,b:1});
for(const [id,fix,h] of [['shorter',C.fixupHueShorter,360],['longer',C.fixupHueLonger,180],['increasing',C.fixupHueIncreasing,360],['decreasing',C.fixupHueDecreasing,180]])mix('hue-'+id,[{mode:'oklch',l:.5,c:.1,h:350},{mode:'oklch',l:.5,c:.1,h:10}],'oklch',.5,{l:.5,c:.1,h},{overrides:{h:{fixup:fix}}});
for(const premult of [false,true]){mix('transparent-'+premult,[{...red,alpha:0},{...blue,alpha:1}],'lrgb',.5,premult?{r:0,g:0,b:1,alpha:.5}:{r:.5,g:0,b:.5,alpha:.5},{premult});mix('unequal-alpha-'+premult,[{...red,alpha:.25},{...blue,alpha:.75}],'lrgb',.5,premult?{r:.25,g:0,b:.75,alpha:.5}:{r:.5,g:0,b:.5,alpha:.5},{premult});mix('zero-alpha-'+premult,[{...red,alpha:0},{...blue,alpha:0}],'lrgb',.5,premult?{r:0,g:0,b:0,alpha:0}:{r:.5,g:0,b:.5,alpha:0},{premult});}
mix('missing-hue',[{mode:'oklch',l:.5,c:0},{mode:'oklch',l:.5,c:.1,h:30}],'oklch',.5,{l:.5,c:.05,h:30});
mix('both-missing-hue',[{mode:'oklch',l:.5,c:0},{mode:'oklch',l:.5,c:0}],'oklch',.5,{l:.5,c:0,h:null});
mix('numeric-powerless-hue',[{mode:'oklch',l:.5,c:0,h:300},{mode:'oklch',l:.5,c:.1,h:60}],'oklch',.5,{l:.5,c:.05,h:360});
mix('extended-p3-same',[{mode:'p3',r:-.5,g:2,b:0},{mode:'p3',r:1.5,g:0,b:2}],'p3',.5,{r:.5,g:1,b:1});
mix('extended-rgb-same',[{mode:'rgb',r:-.5,g:2,b:0},{mode:'rgb',r:1.5,g:0,b:2}],'rgb',.5,{r:.5,g:1,b:1});
mix('three-stop-position',[[red,0],[green,.25],[blue,1]],'lrgb',.625,{r:0,g:.5,b:.5});
mix('three-stop-auto',[red,green,blue],'lrgb',.25,{r:.5,g:.5,b:0});
mix('duplicate-left',[[red,0],[red,.5],[blue,.5],[blue,1]],'lrgb',.5,{r:1,g:0,b:0});
mix('duplicate-right',[[red,0],[red,.5],[blue,.5],[blue,1]],'lrgb',.500001,{r:0,g:0,b:1});
// Mixed-mode oracle: black/white are analytically the same in RGB and linear RGB.
mix('mixed-mode-seam',[{mode:'rgb',r:0,g:0,b:0},{mode:'lrgb',r:1,g:1,b:1}],'lrgb',.25,{r:.25,g:.25,b:.25});
mix('same-mode-seam',[{mode:'lrgb',r:0,g:0,b:0},{mode:'lrgb',r:1,g:1,b:1}],'lrgb',.25,{r:.25,g:.25,b:.25});
const cycles=[];for(const f of baseline.cycles){let current={colorSpace:'srgb',components:f.input,alpha:'1'},completed=0,status='success';for(let i=0;i<100;i++){let a=attempt(current,f.via);if(a.status!=='success'){status=a.status;break;}let b=attempt(a.value,'srgb');if(b.status!=='success'){status=b.status;break;}current=b.value;completed++;}cycles.push({...f,baseline:f,maxAbsSrgbError:Math.max(...f.input.map((x,i)=>Math.abs(Number(x)-Number(current.components[i])))),completed,status,final:current.components});}
const boundaries=baseline.boundaries.map(f=>{const middle=raw('srgb',f.input,f.via),back=raw(f.via,middle.map(x=>x===null?0:x),'srgb');return {input:f.input,via:f.via,middle,back,overshoot:Math.max(0,...back.flatMap(x=>[-x,x-1]))};});
const provenance={runtime:process.version,v8:process.versions.v8,platform:process.platform,arch:process.arch,package:JSON.parse(fs.readFileSync(packageRoot+'/package.json','utf8')),registry:JSON.parse(fs.readFileSync('/tmp/dtw-culori-qualification/registry.json','utf8')).dist};
const transferControls=['1e-100','1e-97','1e6'].map(x=>({input:x,actualLibraryLinear:C.converter('lrgb')({mode:'rgb',r:Number(x),g:0,b:0}),coverage:'separate actual public transfer call, not enforcement inside stock rgb-to-oklch'}));
const results={transferControls,provenance,cases,decimal,special,guards,routeInventory,mixes,cycles,boundaries};
fs.writeFileSync(path.join(dir,'results.json'),JSON.stringify(results,(_,v)=>typeof v==='number'&&!Number.isFinite(v)?String(v):typeof v==='function'?v.name:v,2)+'\n');
console.log(JSON.stringify({cases:cases.length,statusMismatches:cases.filter(x=>!x.statusMatches).map(x=>[x.id,x.expectedStatus,x.candidate.status]),mixFailures:mixes.filter(x=>!x.pass),guards:guards.map(x=>[x.id,x.endpointAdapter.status])},null,2));
