"""Fetch/extract exact research candidate without installation or lifecycle scripts."""
import urllib.request,pathlib,json,hashlib,base64,tarfile
p=pathlib.Path('/tmp/dtw-culori-qualification');p.mkdir(exist_ok=True)
for url,name in [('https://registry.npmjs.org/culori/4.0.2','registry.json'),('https://registry.npmjs.org/culori/-/culori-4.0.2.tgz','culori-4.0.2.tgz')]:
 with urllib.request.urlopen(url) as response:(p/name).write_bytes(response.read())
m=json.loads((p/'registry.json').read_text());actual='sha512-'+base64.b64encode(hashlib.sha512((p/'culori-4.0.2.tgz').read_bytes()).digest()).decode()
expected='sha512-1+BhOB8ahCn4O0cep0Sh2l9KCOfOdY+BXJnKMHFFzDEouSr/el18QwXEMRlOj9UY5nCeA8UN3a/82rUWRBeyBw=='
assert actual==m['dist']['integrity']==expected
with tarfile.open(p/'culori-4.0.2.tgz') as t:
 for member in t.getmembers():
  dest=(p/member.name).resolve();assert str(dest).startswith(str(p.resolve())+'/package/') or dest==p/'package'
  assert not member.issym() and not member.islnk()
 t.extractall(p)
print('Verified Culori 4.0.2 SHA-512 integrity; extracted source only.')
