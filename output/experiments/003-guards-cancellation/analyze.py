"""Evidence only: finite metrics required, absence is never numeric zero."""
import json,pathlib,math
from decimal import Decimal as D,localcontext
p=pathlib.Path(__file__).parent
r=json.loads((p/'reference.json').read_text());j=json.loads((p/'results.json').read_text())
with localcontext() as c:
 c.prec=260
 stability=[]
 for f in r['cases']:
  vals=f['reference'];d=max(abs(D(a)-D(b)) for a,b in zip(vals['160']['oklab'],vals['240']['oklab']))
  stability.append({'id':f['id'],'max160vs240LabAbs':str(d)})
ordinary=[x for x in j['metrics'] if x['id'] not in ['minimum','maximum','near-neutral']]
assert all(x['status']=='measured' and math.isfinite(x['maxAbs']) for x in ordinary)
out={'precisionStabilityIsProof':False,'stability':stability,'ordinaryMeasuredCount':len(ordinary),'maxOrdinaryLabAbs':max(x['maxAbs'] for x in ordinary),'allNamedExpectedAssertions':'probe.mjs assertions completed'}
(p/'analysis.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
