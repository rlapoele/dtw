"""Independent frozen reference comparison; never derives expectations from Culori."""
import sys,importlib.util,json,pathlib,math
from decimal import Decimal as D,getcontext
sys.dont_write_bytecode=True
getcontext().prec=70
p=pathlib.Path(__file__).resolve().parent
spec=importlib.util.spec_from_file_location('frozen_reference',p.parent/'003-numerical-feasibility/reference.py');ref=importlib.util.module_from_spec(spec);spec.loader.exec_module(ref)
r=json.loads((p/'results.json').read_text());prior=json.loads((p.parent/'003-numerical-feasibility/analysis.json').read_text())
def numeric(v,space):
 out=[]
 for i,x in enumerate(v):
  if x is None or x=='none':
   assert (space=='hsl' and i==0 and D(str(v[1]))==0) or (space=='oklch' and i==2 and D(str(v[1]))==0),(space,v)
   out.append(D(0))
  else:
   z=D(str(x));assert z.is_finite();out.append(z)
 return out
def err(a,b):
 z=float(max(abs(x-y) for x,y in zip(a,b)));assert math.isfinite(z);return z
records=[]
for f in r['cases']:
 expected=numeric(f['expected'],f['target']);basis=numeric(f['expectedSrgb'],'srgb');raw=numeric(f['raw'],f['target']);candidate=f['candidate'];status=candidate['status']
 expected_measured='target-schema-incompatibility' if f['id']=='srgb-8-hsl' else f['expectedStatus']
 assert status==expected_measured,(f['id'],status,expected_measured)
 rec={'id':f['id'],'status':status,'expectedObservedStatus':expected_measured,'agreedFixtureStatus':f['expectedStatus'],'statusAssertionPass':True,'statusMatchesAgreedFixture':f['statusMatches'],'rawSrgbError':err(ref.convert(f['target'],raw,'srgb'),basis)}
 if f['target']=='oklab':rec['rawOklabError']=err(raw,expected)
 if f['target']=='oklch' and expected[1]>=D('.0001'):
  d=abs(raw[2]-expected[2])%360;rec['rawHueError']=float(min(d,360-d))
 if status=='success':
  v=numeric(candidate['value']['components'],f['target']);rec['candidateSrgbError']=err(ref.convert(f['target'],v,'srgb'),basis)
  if f['target']=='oklab':rec['candidateOklabError']=err(v,expected)
  if f['target']=='oklch' and expected[1]>=D('.0001'):
   d=abs(v[2]-expected[2])%360;rec['candidateHueError']=float(min(d,360-d))
  rec['accuracyPass']=rec['candidateSrgbError']<=1e-8 and rec.get('candidateOklabError',0)<=1e-8 and rec.get('candidateHueError',0)<=1e-5
 else:rec['candidateMetrics']='not-applicable-refusal';rec['accuracyPass']=None
 records.append(rec)
# Every expected status below is a declared measured regression expectation, not strict acceptance.
guardExpected={'maximum':'target-schema-incompatibility','source-collapse':'numerical-failure','output-target-invalid':'target-schema-incompatibility','text-budget':'calculation-limit'}
for f in r['guards']:assert f['endpointAdapter']['status']==guardExpected.get(f['id'],'success'),f['id']
for f in r['special']:assert f['result']['status']==f['expectedStatus'],f['name']
assert len(records)==180 and len(set((f['space'],f['target']) for f in r['cases']))==25
assert all(f['candidate']['inputUnchanged'] for f in r['cases'])
assert all(f['result']['inputUnchanged'] for f in r['special'])
assert all(f['endpointAdapter']['inputUnchanged'] for f in r['guards'])
assert all(f['pass'] and f['inputUnchanged'] for f in r['mixes'])
assert all(f['status']=='success' and f['completed']==100 and math.isfinite(f['maxAbsSrgbError']) and f['maxAbsSrgbError']<=1e-6 for f in r['cycles'])
assert all(math.isfinite(f['overshoot']) for f in r['boundaries'])
def maximum(k):
 rows=[x for x in records if k in x];return max(rows,key=lambda x:x[k]) if rows else None
keys=['rawSrgbError','candidateSrgbError','rawOklabError','candidateOklabError','rawHueError','candidateHueError']
summary={'cases':180,'pairs':25,'statuses':{s:sum(f['status']==s for f in records) for s in sorted(set(f['status'] for f in records))},'statusMismatch':[f for f in records if not f['statusMatchesAgreedFixture']],'accuracyFailures':[f for f in records if f['accuracyPass'] is False],'maxima':{k:maximum(k) for k in keys},'frozenColorjsMaxima':prior['summary']['maxima'],'mixCount':len(r['mixes']),'mixPass':all(f['pass'] for f in r['mixes']),'guardCases':len(r['guards']),'maxCycleDrift':max(f['maxAbsSrgbError'] for f in r['cycles']),'cycleCompleted':sum(f['completed']==100 for f in r['cycles']),'maxBoundaryOvershoot':max(f['overshoot'] for f in r['boundaries'])}
(p/'analysis.json').write_text(json.dumps({'summary':summary,'comparisons':records},indent=2)+'\n');print(json.dumps(summary,indent=2))
