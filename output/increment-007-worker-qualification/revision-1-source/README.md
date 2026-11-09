# Increment 007 isolated worker qualification

Research only. Production Increment 007 remains Draft / Not started. These synthetic
fixed messages, native mechanism calls and small DOM projections are **not** a
production port, persistence adapter, React UI or product acceptance implementation.
The original Stage A source/output are read-only imports, including installed
jsonc-parser 3.3.1; no new dependency is installed.

From repository root:

```sh
node --test research/increment-007-worker-qualification/protocol.test.mjs
node research/increment-007-worker-qualification/run.mjs chrome
node research/increment-007-worker-qualification/run.mjs safari
node research/increment-007-worker-qualification/server.mjs
```

`DTW_PLAYWRIGHT` points to an existing absolute Playwright ESM entry; the default
is the same recorded cached installation used by Stage A. Native loopback/browser
launches require host execution permission. The runner starts only disposable
Chrome profiles or native isolated Safari WebDriver sessions. Never run automated
Safari during the user's normal Safari quit/reopen exercise. Do not attach to,
reload, clear, kill or close user browser windows. Manual normal Safari observations
are separately attributed and do not make WebDriver a normal profile.

The server binds loopback only and restricts reads to the two research directories;
it accepts bounded JSON evidence only into the new output directory. Its source
is not a hosting/deployment/CSP integration or authorization to deploy. HTTPS is
unavailable in this qualification run; loopback secure-context observations do not
qualify deployed HTTPS. Current server routes and exact origins are in evidence.

The manual route creates only a deterministic synthetic coverage checkpoint and
refuses to overwrite an existing checkpoint. Verification compares every authored
field/code unit to the expected deterministic fixture in the worker after native
readonly transaction completion. The user's file picker selects only its own small
synthetic backup; raw user files are not required. Manual telemetry includes UA,
exact checkpoint revision, events and explicit restart attestation. Server-side
labels are not proof of browser/profile/user action: exclude Chrome smoke entries
from manual Safari claims and use the actual user confirmation plus observations.

The external Node supervisor applies a 30-second watchdog to each measured stress
operation. It may terminate **only** the disposable Chrome child or close the exact
Safari automation tab. Expiry is failure/inconclusive and stops escalation; never
count it as completion. The historical Safari probe verified idle-command own-tab close of a CPU-blocked
worker, but did not establish preemption while WebDriver execute/async is in flight.
Current Safari runner therefore stops before defensive stress until that gap is
qualified; completed historical samples remain observations, not supervision readiness. Warmup and 20
samples are distinct operations, with failed historical aggregate-supervision runs
preserved. Fixture generation is inside codec measurements; catalogue seeding is
separately timed and recorded, not hidden read work.

Cold startup includes a fresh page/module worker load and capability transaction.
Codec timing includes encode/decode in worker; message roundtrip includes fixture
creation, equality comparison, worker projection, structured-clone costs and byte
transfer. It is not a pure transport-only estimate. Renderer DOM cost is separately
timed and uses synthetic plain divs, not production React. Hidden paint is unavailable;
visible two-frame observations are labelled and never equated to production commit
latency. Chrome long tasks and both-engine event-loop samples supplement bounded
observations; absent Safari Long Tasks API does not prove no blocking.

See the output report for the case matrix, unsuccessful attempts, source identity,
actual native interventions, all samples, pass/fail/inconclusive/not-run scope and
remaining product/host gaps. No agent independent review is claimed here.

Focused commands used after concrete harness failures:

```sh
DTW_ONLY_MAX=1 node research/increment-007-worker-qualification/run.mjs chrome
DTW_FOCUS=safari-recovery node research/increment-007-worker-qualification/run.mjs safari
node research/increment-007-worker-qualification/chrome-host.mjs
node research/increment-007-worker-qualification/summarize.mjs
```

The first two intentionally stop after their selected cases; raw `error` records
say `deliberate stop` and are not native failure verdicts. Full main-run source,
focused source and earlier unsuccessful sources are separately archived with
hashes in output. Source archives keep historical relative imports and are evidence,
not directly runnable copies. The current runner includes only the focused harness
corrections; the underlying browser-mechanism source matches main evidence.

**Known failed performance gate:** eager 10,000-row synthetic Chrome rendering
observed 170/137 ms long tasks. Completion/exactness `pass` in raw case records
is not a timing/support pass. See the report before interpreting case counts.

Safari full historical execution used the weaker idle-command safety probe. The
current source deliberately fails closed before defensive stress; the focused
recovery/cold command remains available. This source safety correction was syntax
checked, not followed by another native benchmark.
