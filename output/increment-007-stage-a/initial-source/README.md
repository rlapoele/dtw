# Stage A disposable qualification

Research only; Increment 007 is not implemented. Uses native installed Chrome and
Safari, jsonc-parser 3.3.1, and an existing Playwright 1.60.0 installation. No root
package, dependency, production source, prototype or test changes.

Commands from repository root:

```sh
npm ci --prefix research/increment-007-stage-a --offline --ignore-scripts --no-audit --no-fund
npm test --prefix research/increment-007-stage-a
node research/increment-007-stage-a/run.mjs
node research/increment-007-stage-a/extra.mjs
node research/increment-007-stage-a/safari-probe.mjs
```

`DTW_PLAYWRIGHT` can identify an existing Playwright module. Loopback/browser launch
requires the host's execution permission. Runners allocate random loopback origins
and disposable Chrome user-data directories. They never attach to existing browsers.
Temporary profiles remain under the recorded system temporary paths; retaining them
permits evidence inspection. Normal runs close their own browser. Stress watchdogs
run in Node, independently of the page thread, and terminate only the child Chrome
PID at 30 seconds. Fixture setup is outside catalogue read timing; fixture creation,
encoding/validation and measured operations otherwise remain visible in experiment
wall times. `extra.mjs` records an independent committed-state SIGKILL/restart.

`codec.mjs` is an intentionally isolated feasibility prototype with closed schemas,
scanner-before-visitor, null-prototype maps, bounded admission and conservative
standalone evaluation guard probes. It is not the product adapter, validator or
resolver. Every generated wrapper is run through its own decoder. Native IDB `write`
mechanism probes intentionally receive already selected fixture objects; they do not
implement production whole-candidate admission, ownership enforcement, 25-record
capacity checks, outcome recovery UI, metadata decoding or domain diagnostic display.

No authored AST is evaluated on decode. Supported diagnostic fixtures are preserved
as source; this harness does not compute every domain diagnostic. Returned literal
range checks use lexical Decimal comparison without BigInt allocation.

Exact 8 MiB fixtures contain escaped control text, 1,000 number tokens and roughly
1.5 million decoded UTF-16 units. They exercise serialized admission/storage/clone
cost, not 8 MiB of actual physical disk or heap. The 10,000-token entity-limit fixture
is name-only because 10,000 populated number tokens exceed the lexical ceiling.
See the output report for measured scope, failed attempts and unverified criteria.
