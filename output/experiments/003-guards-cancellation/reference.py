"""Independent bounded Decimal reference. Constants rebuilt INSIDE each context.
CSS Color 4 CRD 2026-11-03 informative equations; no candidate imports.
Only rectangular sRGB -> OKLab; no claim of high-precision trig or error proof.
"""
from decimal import Decimal as D, localcontext
from fractions import Fraction as F
import ast,json,pathlib,sys
HERE=pathlib.Path(__file__).parent
OLD=HERE.parent/'003-numerical-feasibility/reference.py'
# Parse frozen source constants as TEXT; never import cached Decimal matrices.
TREE=ast.parse(OLD.read_text())
ROWS={n.targets[0].id:ast.literal_eval(n.value.args[0]) for n in TREE.body if isinstance(n,ast.Assign) and isinstance(n.value,ast.Call) and isinstance(n.value.func,ast.Name) and n.value.func.id=='matrix'}
def matrices():
 return {key:[[D(a)/D(b) if '/' in x else D(x) for x in row.split() for a,b in [x.split('/') if '/' in x else (x,'1')]] for row in rows] for key,rows in ROWS.items()}
def calc(v,p):
 with localcontext() as c:
  c.prec=p
  m=matrices()
  def mul(M,v):return [sum(a*b for a,b in zip(row,v)) for row in M]
  lin=[x/D('12.92') if abs(x)<=D('.04045') else (1 if x>=0 else -1)*((abs(x)+D('.055'))/D('1.055'))**D('2.4') for x in map(D,v)]
  xyz=mul(m['S'],lin);lms=mul(m['X'],xyz)
  roots=[(1 if x>=0 else -1)*abs(x)**(D(1)/3) for x in lms]
  return {k:list(map(str,v)) for k,v in [('linear',lin),('xyz',xyz),('lms',lms),('roots',roots),('oklab',mul(m['O'],roots))]}
cases=[('interior',['0.2','0.4','0.6']),('red',['1','0','0']),('green',['0','1','0']),('blue',['0','0','1']),('tiny',['0.000000000000001','0','0']),('minimum',['0.'+'0'*99+'1','0','0']),('maximum',['1000000','0','0']),('near-neutral',['0.5000000000000001','0.5','0.5']),('transfer-below',['0.04044999999999999','0','0']),('transfer-at',['0.04045','0','0']),('transfer-above',['0.04045000000000001','0','0'])]
linear=[('true-zero',['1','-1','0']),('lost-nonzero',['1','0.00000000000000001','-1']),('small-survives',['1','-1','0.00000000000000001'])]
out={'precision':[80,160,240],'matrixConstruction':'inside each localcontext; source text AST only','cases':[{'id':i,'input':v,'reference':{str(p):calc(v,p) for p in [80,160,240]}} for i,v in cases],'linear':[{'id':i,'input':v,'exact':str(sum(map(F,v)))} for i,v in linear]}
(HERE/'reference.json').write_text(json.dumps(out,indent=2)+'\n')
print('reference: 11 cases x 3 contexts; 3 exact rational linear subcases')
