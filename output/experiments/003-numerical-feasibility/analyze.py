"""Compare recorded Node outputs to the independent reference in a common basis."""
from decimal import Decimal as D, getcontext
getcontext().prec=70
import reference as ref
import json, pathlib, math
root=pathlib.Path(__file__).parent
r=json.loads((root/'results.json').read_text())
def numeric(v):return [D(0) if x=='none' or x is None else D(str(x)) for x in v]
def err(a,b):return float(max(abs(x-y) for x,y in zip(a,b)))
records=[]
for f in r['cases']:
  expected=numeric(f['expected']);basis=numeric(f['expectedSrgb'])
  ordinary=all(-1<=x<=2 for x in ref.convert(f['space'],numeric(f['input']),'srgb'))
  raw=f['narrowRaw']
  raw_basis=ref.convert(f['target'],numeric(raw),'srgb')
  # Neutral source HSL hue null is mathematically powerless, so use hue0 here.
  rec={'id':f['id'],'ordinary':ordinary,'rawSrgbError':err(raw_basis,basis),'status':f['candidate']['status']}
  if f['target']=='oklab':rec['rawOklabError']=err(numeric(raw),expected)
  if f['target']=='oklch' and expected[1]>=D('.0001'):
    delta=abs(numeric(raw)[2]-expected[2])%360;rec['rawHueError']=float(min(delta,360-delta))
  if f['candidate']['status']=='success':
    v=numeric(f['candidate']['value']['components'])
    rec['candidateSrgbError']=err(ref.convert(f['target'],v,'srgb'),basis)
    if f['target']=='oklab':rec['candidateOklabError']=err(v,expected)
    if f['target']=='oklch' and expected[1]>=D('.0001'):
      delta=abs(v[2]-expected[2])%360;rec['candidateHueError']=float(min(delta,360-delta))
  records.append(rec)
def maximum(k):
  eligible=[x for x in records if x['ordinary'] and k in x]
  return max(eligible,key=lambda x:x[k]) if eligible else None
summary={'caseCount':len(records),'pairCount':len(set((x['space'],x['target']) for x in r['cases'])),'ordinaryCount':sum(x['ordinary'] for x in records),'statuses':{k:sum(x['status']==k for x in records) for k in set(x['status'] for x in records)},'maxima':{k:maximum(k) for k in ['rawSrgbError','candidateSrgbError','rawOklabError','candidateOklabError','rawHueError','candidateHueError']},'accuracyFailures':[x for x in records if x['ordinary'] and (x.get('candidateSrgbError',0)>1e-8 or x.get('candidateOklabError',0)>1e-8 or x.get('candidateHueError',0)>1e-5)],'refusals':[{'id':x['id'],'result':x['candidate']} for x in r['cases'] if x['candidate']['status']!='success'],'special':r['special'],'stages':r['stages'],'byteBudgets':r['byteBudgets'],'cycles':r['cycles']}
(root/'analysis.json').write_text(json.dumps({'summary':summary,'comparisons':records},indent=2)+'\n')
print(json.dumps({k:v for k,v in summary.items() if k not in ['special','cycles']},indent=2))
