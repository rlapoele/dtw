"""Recheck path-only source/test changes against the agreed committed baseline."""
from pathlib import Path
import hashlib
import json
import subprocess

baseline = 'c14bff7df4b5f475ef46a5d29841444cd1bc443c'
evidence = Path(__file__).parent
mapping = json.loads((evidence / 'mapping.json').read_text())
prefix = 'src/presentation/'
replacements = {
    '@presentation/' + old[len(prefix):].removesuffix('.tsx').removesuffix('.ts'):
    '@presentation/' + new[len(prefix):].removesuffix('.tsx').removesuffix('.ts')
    for old, new in mapping.items() if not old.endswith('.css')
}
replacements['@presentation/styles.css'] = '@presentation/styles/global.css'
changed = subprocess.check_output(['git', 'diff', '--name-only', baseline, '--', 'src', 'test']).decode().splitlines()
checked = []
for old in changed:
    new = mapping.get(old, old)
    previous = subprocess.check_output(['git', 'show', baseline + ':' + old]).decode()
    expected = previous
    for before, after in replacements.items():
        expected = expected.replace('"' + before + '"', '"' + after + '"').replace("'" + before + "'", "'" + after + "'")
    assert Path(new).read_text() == expected, (old, new)
    checked.append(new)
assert not subprocess.check_output(['git', 'diff', '--name-only', baseline, '--', 'prototypes', 'research', 'output', ':!output/presentation-organization']).strip()
for path in ['package.json', 'package-lock.json']:
    assert subprocess.check_output(['git', 'show', baseline + ':' + path]) == Path(path).read_bytes()
assert subprocess.check_output(['git', 'show', baseline + ':src/presentation/styles.css']) == Path('src/presentation/styles/global.css').read_bytes()
print(f'{len(mapping)} moves and {len(checked)} affected maintained source/test files match baseline after import-path replacement only; stylesheet bytes, dependencies and tracked historical files unchanged.')
