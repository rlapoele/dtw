"""Disposable independent reference: CSS Color 4 CRD 2026-11-03 equations.
No candidate imports. Decimal 70 digits for rectangular matrices/transfers;
Python libm for polar trig/angle (explicitly not high-precision trig).
CSS sample epsilon hue suppression intentionally omitted under DTW policy.
Source https://www.w3.org/TR/2026/CRD-css-color-4-20261103/#color-conversion-code
W3C permissive document license: https://www.w3.org/copyright/document-license/
"""
from decimal import Decimal as D, localcontext, ROUND_HALF_EVEN
import math, json, pathlib

ROOT=pathlib.Path(__file__).parent
SPACES=['srgb','display-p3','hsl','oklab','oklch']
def matrix(rows):
    return [[D(x.split('/')[0])/D(x.split('/')[1]) if '/' in x else D(x) for x in row.split()] for row in rows]
S=matrix(['506752/1228815 87881/245763 12673/70218','87098/409605 175762/245763 12673/175545','7918/409605 87881/737289 1001167/1053270'])
SI=matrix(['12831/3959 -329/214 -1974/3959','-851781/878810 1648619/878810 36519/878810','705/12673 -2585/12673 705/667'])
P=matrix(['608311/1250200 189793/714400 198249/1000160','35783/156275 247089/357200 198249/2500400','0 32229/714400 5220557/5000800'])
PI=matrix(['446124/178915 -333277/357830 -72051/178915','-14852/17905 63121/35810 423/17905','11844/330415 -50337/660830 316169/330415'])
X=matrix(['0.8190224379967030 0.3619062600528904 -0.1288737815209879','0.0329836539323885 0.9292868615863434 0.0361446663506424','0.0481771893596242 0.2642395317527308 0.6335478284694309'])
XI=matrix(['1.2268798758459243 -0.5578149944602171 0.2813910456659647','-0.0405757452148008 1.1122868032803170 -0.0717110580655164','-0.0763729366746601 -0.4214933324022432 1.5869240198367816'])
O=matrix(['0.2104542683093140 0.7936177747023054 -0.0040720430116193','1.9779985324311684 -2.4285922420485799 0.4505937096174110','0.0259040424655478 0.7827717124575296 -0.8086757549230774'])
OI=matrix(['1 0.3963377773761749 0.2158037573099136','1 -0.1055613458156586 -0.0638541728258133','1 -0.0894841775298119 -1.2914855480194092'])
def mul(m,v): return [sum(a*b for a,b in zip(r,v)) for r in m]
def signedpow(x,p): return (1 if x>=0 else -1)*abs(x)**p
def linear(v): return [x/D('12.92') if abs(x)<=D('.04045') else signedpow((abs(x)+D('.055'))/D('1.055'),D('2.4'))*(1 if x>=0 else -1) for x in v]
def gamma(v): return [x*D('12.92') if abs(x)<=D('.0031308') else (1 if x>=0 else -1)*(D('1.055')*abs(x)**(1/D('2.4'))-D('.055')) for x in v]
def polar(v): return [v[0],(v[1]*v[1]+v[2]*v[2]).sqrt(),D(str(math.degrees(math.atan2(float(v[2]),float(v[1])))%360))]
def rect(v): return [v[0],v[1]*D(str(math.cos(math.radians(float(v[2]))))),v[1]*D(str(math.sin(math.radians(float(v[2])))))]
def hsl_rgb(v):
    h,s,l=v[0],v[1]/100,v[2]/100
    a=s*min(l,1-l)
    def f(n):
        k=(D(n)+h/30)%12
        return l-a*max(-1,min(k-3,9-k,1))
    return [f(0),f(8),f(4)]
def rgb_hsl(v):
    mx,mn=max(v),min(v); delta=mx-mn; l=(mx+mn)/2
    if delta==0: return [D(0),D(0),100*l]
    s=delta/(1-abs(2*l-1)) if l not in [0,1] else D(0)
    i=v.index(mx)
    h=60*(((v[1]-v[2])/delta)%6 if i==0 else (v[2]-v[0])/delta+2 if i==1 else (v[0]-v[1])/delta+4)
    if h<0:h+=360
    if s<0:h=(h+180)%360;s=-s
    return [h,100*s,100*l]
def xyz(space,v):
    if space=='hsl': return mul(S,linear(hsl_rgb(v)))
    if space in ['srgb','display-p3']:return mul(S if space=='srgb' else P,linear(v))
    if space=='oklch':v=rect(v)
    return mul(XI,[x**3 for x in mul(OI,v)])
def convert(space,v,target):
    if space==target:return v[:]
    if space=='hsl' and target=='srgb':return hsl_rgb(v)
    if space=='srgb' and target=='hsl':return rgb_hsl(v)
    q=xyz(space,v)
    if target in ['srgb','display-p3','hsl']:
        r=gamma(mul(PI if target=='display-p3' else SI,q))
        return rgb_hsl(r) if target=='hsl' else r
    lab=mul(O,[signedpow(x,1/D(3)) for x in mul(X,q)])
    return polar(lab) if target=='oklch' else lab
def canonical(x):
    if x==0:return '0'
    s=format(x,'f');return s.rstrip('0').rstrip('.') if '.' in s else s
def round_sig(x,n):
    with localcontext() as c:
        c.prec=n;c.rounding=ROUND_HALF_EVEN
        return canonical(+D(x))

def fixtures():
    samples={
      'srgb':[['.2','.4','.6'],['1','0','0'],['0','1','0'],['1','1','1'],['0','0','0'],['.5','.5','.5'],['-.1','.4','1.1'],['.500000000001','.5','.5'],['.000000000000001','0','0']],
      'display-p3':[['.2','.4','.6'],['1','0','0'],['0','1','0'],['1','1','1'],['0','0','0'],['.5','.5','.5'],['-.1','.4','1.1'],['.500000000001','.5','.5']],
      'hsl':[['210','50','40'],['0','100','50'],['120','100','50'],['240','0','100'],['200','100','0'],['300','0','50'],['359.9999999999','0.000000000001','50']],
      'oklab':[['.6','.1','-.1'],['1','0','0'],['0','0','0'],['.5','0','0'],['.5','.000000000000001','0'],['.5','-.4','.4']],
      'oklch':[['.6','.1','210'],['1','0','270'],['0','0','10'],['.5','0','90'],['.5','.000000000000001','30'],['.5','.4','120']]}
    out=[]
    for s,vs in samples.items():
      for k,v in enumerate(vs):
       v=[canonical(D(x)) for x in v]
       for t in SPACES:
        expected=convert(s,list(map(D,v)),t)
        out.append(dict(id=f'{s}-{k}-{t}',space=s,input=v,target=t,expected=list(map(canonical,expected)),expectedSrgb=list(map(canonical,convert(t,expected,'srgb')))))
    return out

if __name__=='__main__':
  with localcontext() as c:
    c.prec=70
    # Recompute rational matrices at research precision; module definitions initially use default context.
    for key in ['S','SI','P','PI']:
      # Exact numerator/denominator text is preserved in source: re-execute just initialization at 70 digits.
      line=next(x for x in pathlib.Path(__file__).read_text().splitlines() if x.startswith(key+'=matrix('))
      exec(line)
    data=fixtures()
    (ROOT/'reference.json').write_text(json.dumps(data,indent=2)+'\n')
    bytes_=['127.5','510','-255','1','30','128','250','254','0.000000000001']
    exact_long={'input':'31.481481226481481226481481195','expected':'0.123456789123456789123456789'}
    assert D(exact_long['input'])/255 == D(exact_long['expected'])
    (ROOT/'decimal-reference.json').write_text(json.dumps({'bytes':[{'input':x,'expected':round_sig(D(x)/255,18)} for x in bytes_]+[exact_long], 'format':[{'input':x,'digits':n,'expected':round_sig(x,n)} for x,n in [('1.234567890125',12),('1.234567890135',12),('-1.234567890125',12),('-1.234567890135',12),('9.999999999995',12),('1e-100',12),('-0',12),('1.234567890123456785',18),('1.234567890123456795',18)]]},indent=2)+'\n')
    print(f'{len(data)} independent reference cases')
