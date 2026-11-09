# Increment 007 Stage A qualification — 9 November 2026

**Partial mechanism qualification; product implementation remains unauthorized.**
Base commit `21196be5fee369ee5983dc910c3d544dad16cff2`. No production/root package,
configuration, dependencies, tests or prototypes were changed. All new research and
evidence belongs to the two Stage A directories. The final manifest supersedes the
historical Chrome core manifest, whose transient `.log` entries are now also preserved
as portable `.txt` files. This is the developer handoff, pending independent review.

Native Chrome and Safari both support the observed strict-hint IDB and Web Locks
mechanisms in the tested contexts. Supported fixture strings/IDs/values survived
codec and Chrome IDB round trips exactly. **The synchronous maximum-sized codec
failed the 100 ms main-thread responsiveness target.** A dedicated-worker experiment
preserved exactness and avoided observed Chrome main-thread long tasks; it is an
implementation option to review, not a selected production architecture. The full
agreed policy, all boundary combinations, recovery protocol and supported browser
baseline are not completely qualified by this harness.

## Environment and reproducibility

MacBook Pro Mac15,6, Apple M3 Pro, 11 cores, 36 GiB RAM; macOS 27.2 build 26B123;
Node 24.14.1 / npm 11.17.0. Installed Chrome **156.0.8078.80**, installed Safari
**27.2 / WebDriver 22625.2.8.11.9**. Environment, instantaneous free memory and
parser distribution sizes are in `environment.json`. No physical disk allocation,
process RSS, peak heap, fsync, power-loss or eviction claim follows.

Chrome's primary run used its own fresh **normal persistent profile**, random
`http://127.0.0.1:<port>` origin, and `dtw-stage-a` database. Profiles/ports/PIDs are
recorded in `chrome-results.json` and `extra-results.json`; no existing browser was
attached. Historical private-context observations remain separate and do not prove
normal retention. Playwright 1.60.0 came from an existing cached installation;
**installed Chrome**, rather than bundled Chromium, executed all Chrome cases.

Safari used a native **isolated WebDriver automation session** after the user enabled
remote automation. No agent changed preferences, terminated Safari or touched a
normal Safari window. Safari's automation mode is separate from ordinary browsing;
within-session mechanism results do not establish normal-profile or cross-session
retention. Apple's isolation documentation was supplied by the coordinator:
[Safari WebDriver](https://developer.apple.com/documentation/safari-developer-tools/webdriver/).
Initial remote automation refusal was observed before the subsequent successful probe.

Commands are documented in `research/increment-007-stage-a/README.md`. Additional:

```sh
node --test research/increment-007-stage-a/boundary-more.test.mjs
node research/increment-007-stage-a/counter-supervisor.mjs
node research/increment-007-stage-a/safari.mjs
node research/increment-007-stage-a/summarize.mjs
```

The parser is exact `jsonc-parser` 3.3.1, MIT, no production dependencies; integrity
is recorded in the isolated lockfile. Initial online npm resolution failed ENOTFOUND;
offline cached installation succeeded. The harness serves the package's ESM modules
rather than a production bundle; `environment.json` records entire ESM distribution
and gzip sizes, not a tree-shaken application bundle delta.

## Fixtures and measurement

`fixtures.json` records deterministic snapshot/wrapper SHA-256, counts and byte sizes.
Typical/large fixtures have 100/1,000 populated number tokens, zero groups, and exact
snapshot sizes **23,152 / 232,852 bytes**. The coverage specimen contains 32 tokens,
two groups, all nine literals, five color spaces, three composites, six AST operations,
context/reference leaves, incomplete/unimplemented typed-unassigned data, optional
metadata, protected/component association, broken group cycle/missing parent,
missing targets/nonempty paths, cross-kind identity reuse, empty/whitespace/separator/
`__proto__`/lone-surrogate IDs and decomposed Unicode. It preserves source; the
harness does not execute every domain diagnostic in the agreed allowlist.

The maximum fixture is **8,388,608 snapshot bytes**, **8,388,729 wrapper bytes**,
1,000 populated number tokens, 17,007 semantic values, 65,046 lexical tokens and
1,514,293 decoded UTF-16 string/key units. Escaped control-character text makes this
size feasible below the aggregate string ceiling. Twenty-five distinct single-unit
project IDs produce **209,715,200 total serialized snapshot bytes**. This is neither
200 MiB physical storage nor 200 MiB JavaScript strings; IDB stores objects rather
than those JSON escapes. The 10,000-token fixture is **name-only** (70,006 values,
260,042 lexical tokens). Ten thousand populated number tokens instead reject at
lexical token 500,001. Independent caps do not imply simultaneous capacity at all
maxima or 10,000 arbitrarily complex tokens.

Each performance workload ran once for warm-up then **20 non-injected measurements**.
`performance.json` contains median, nearest-rank p95 (19th/20), maximum; raw arrays
remain in browser results. Corrected typical/large catalogue measurements contain **one record**;
25-record stress is separate. Write timing includes prior-read/open overhead, so
conservatively contains dispatch-through-complete; it does not isolate only that
interval. This synthetic operation is not full product-command acceptance latency.

The following original-source codec/write results remain historical measurements.
The original unconsumed `getAll` list column is superseded by materialized followup
measurements below and is intentionally omitted.

| Browser/workload | Encode p95 | Decode p95 | Write p95 |
| --- | ---: | ---: | ---: |
| Chrome 100 tokens | 1.7 ms | 1.2 ms | 2.7 ms |
| Chrome 1,000 tokens | 13.5 ms | 9.6 ms | 3.9 ms |
| Safari 100 tokens | 2 ms | 1 ms | 5 ms |
| Safari 1,000 tokens | 11 ms | 8 ms | 11 ms |
| Chrome exact 8 MiB | 123.7 ms | 97.6 ms | 9.9 ms |

Chrome maximum catalogue `getAll` including structured-clone completion: median
28.45 ms, p95 33.4 ms, maximum 35.7 ms (20 runs). Subsequent byte-count verification
makes total case wall times roughly 415–523 ms; that extra serialization must not be
represented as free catalogue work. Full retained decoding/diagnostic derivation for
25 maximum records was not measured. Chrome exposes a sample JS heap counter, not
an accurate process/peak-memory bound; Safari exposes no comparable counter here.
Cold startup was not separately instrumented and remains unverified.

Chrome maximum encode/decode combined tasks reached **229 ms**, failing the 100 ms
target. The initial-source worker alternative performs the same encoding/decoding off-thread,
returns each full snapshot to the main thread, and checks exact equality off-thread.
Twenty post-warm-up samples were equal; zero Chrome main-thread long-task entries
were observed. Worker encode/decode p95 were 829.5/637.4 ms (slower and variable);
the complete experiment took 20.6 s. This does not establish end-to-end product
latency, main-thread candidate-construction cost, or Safari worker performance.
Safari lacks the `longtask` observer entry type; its empty arrays prove no
responsiveness claim. No limits or timing targets were raised to obtain passes.

## Independent-review followups and final evidence

The original core was archived byte-for-byte in `initial-source/` before any review
fix. Its hashes match the historical core manifest. The intermediate preflight codec
used by `followup-results.json` is preserved in `intermediate-source/codec.mjs` and
verified against that run’s recorded SHA-256. Final worker/Blob evidence records its
own source hashes. Unchanged fixture output hashes remain identical across revisions.
No original unsuccessful result was deleted or relabelled passing.

Encoder review fix: a bounded descriptor traversal now checks cycles, getters, plain
objects/arrays, sparse/extra array fields, semantic values, aggregate/string size,
depth, exact emitted UTF-8 byte count and full-wrapper lexical budget before JSON
materialization. Closed shape/entity/AST/Decimal checks also run before the writer.
It does not invoke getters; a hidden array `map` accessor and foreign array prototype
are explicitly rejected. Proxy traps are outside this plain-data harness claim.
Counter-vs-writer-vs-decoder equality is checked on empty, typical, coverage and exact
8 MiB candidates. One valid 8,196-token candidate emits 499,998 lexical tokens; adding
an empty project description leaves snapshot lexical count 499,982 but would make
the wrapper 500,002, and rejects before serialization.

Materialized catalogue timing now consumes every returned record and constructs
identity/name/revision/token/group-count rows inside the measured interval. One
warm-up plus 20 samples each: Chrome100 median0.2/p950.3/max0.5 ms; Chrome1000
median0.85/p951.2/max1.5 ms; Safari100 median0/p951/max1 ms; Safari1000
median1/p951/max1 ms. Safari’s timer precision explains zero samples; these are
not claims of zero work. See `followup-performance.json`; the original unused-result
list timings are superseded. Full retained validation/diagnostics remain outside
this materialized-summary measurement.

Both native engines now have controlled transaction-issuance evidence: the first
readwrite transaction is issued and held by bounded IDB requests; the contender
transaction is issued before the coordinator releases the first. Absence and seeded
expected-revision cases run both tab orders three times each (12/engine). First
acceptance and contender conflict are asserted. No sleep establishes ordering.
Read keepalive has a 10,000-request safety cap, not a product transaction technique.

Both engines also issue a readonly probe while the original acceptance transaction
is held, suppress app-facing terminal observations, then release the write. Native
transaction serialization yields matching acceptance metadata or unchanged absence
after abort. The executable classifier confirms accepted/rejected accordingly.
Eleven additional classifier cases assert matching/later/missing/incarnation/read
failure/unprovable-order/future-dispatch/never-dispatched/known-terminal facts. Some
missing/read-failed evidence is injected into the classifier, clearly separate from
native transaction observations. No production recovery protocol or UI is implied.

The one bounded HTTP attachment alternative succeeds with browser-level CDP
download-progress events, exact bytes/hash, file-input change and native IDB restore
in an independent empty port origin. Native OS picker cancellation remains untested.
Final browser-local Blob export also succeeds: a visible test link received a real
automated click, browser-level CDP recorded `blob:` download start/completion, and
the actual 10,372-byte file equals the generated backup byte-for-byte
and by SHA-256. See `worker-blob-followup.json`; browser-generated download and
HTTP attachment are separately identified. HTTP-downloaded bytes were restored
through a file-input event into an independent empty origin with exact IDB readback.

Final-source preflight/worker requalification: one warm-up plus 20 samples, exact
equality for all, no observed Chrome main-thread long-task entries. Encode p95
140.6 ms, decode p95 100.0 ms, total measured
experiment 5.1 s under the unchanged external 30 s watchdog.
This supersedes initial/intermediate worker timing for the final encoder. It retains
the original 229 ms synchronous failure as evidence that off-thread scheduling is
needed at this maximum. Safari worker/max stress and production scheduling remain
unqualified. The final source hashes are included with that run.


## Applicable case dispositions

“Passed subset” is evidence for the stated mechanism only, never all corresponding
ACs or a Stage B acceptance verdict. JSON evidence includes ordered local event
sequences, revisions, command metadata and before/after structures.

| Case / AC-policy | Observed evidence and disposition | Explicit gaps |
| --- | --- | --- |
| Q-01 / AC-1,7,17 S-1,2,5 | **Passed subset, both engines:** secure loopback, IDB open/read/write, strict hint readback, Web Locks. Fresh schema, blocked upgrade, setup failure observed. File-input/download properties exist. | Capability denial UI, unsupported stored-record decoding/version refusal, Safari download behavior and deployed origins unverified; native Chrome HTTP/Blob download and file-input restoration now pass. Strict hint is not fsync. |
| Q-02 / AC-3–5 S-2 | **Passed native subset:** request-success→forced abort leaves prior complete record and receipt unchanged in Chrome/Safari. Chrome extra probe produces request-success→request-error→abort with no retained first insertion, plus synchronous NotFoundError setup throw. Successful records complete before returned acceptance. | No production callback/UI success or per-mutator one-time-consumption proof. Safari request-error variant unverified. |
| Q-03 / AC-3,4,12 | **Passed synthetic subset, both:** injected refusal aborts before put and preserves prior authored revision. Injection is recorded. | Not a real QuotaExceededError/storage-full/eviction test; no draft/form UI in harness. |
| Q-05 / AC-16 S-3 | **Passed ordered-acquisition subset, both:** three repetitions each first-owner order; second exact-ID contender denied; distinct project lock acquired. | Tests use explicit acquisition-order barriers, not simultaneous lock-request issuance barriers. Hidden/suspended behavior and an uncooperative writer remain separate. |
| Q-06 / AC-3,14,16 | **Passed CAS subset:** Controlled Chrome/Safari two-window transaction issuance, both orders three times for absence and seeded expected revision, produces one acceptance and one conflict; IDs include empty and separator text. Distinct-project writes preserve both across three runs. Final followup supersedes initial readiness-flag/same-event-loop-only proofs. | Replacement protection/capacity races and exhaustive scheduling remain unverified; native issued-before-release interleavings are now forced. |
| Q-08 / AC-5,6,16 S-4 | **Passed narrow fence subset:** cancelling delayed promise before gate release yields zero issued writes and no record. Final followup issues a serialized readonly probe before releasing the already-issued write, with app-facing terminal observation suppressed; accepted/aborted cases reconcile through actual evidence. | No production dispatch-fence/probe integration. Unprovable ordering, missing/read-failed/incarnation states are executable classifier fixtures, not forced native failures. |
| Q-09 / AC-5–7 S-4 | **Passed bounded classifier/mechanism subset:** both engines reconcile suppressed terminal observations through native queued probes; eleven evidence-based classifier branches pass. Initial hardcoded illustration remains historical only. | Production recovery transitions, actual read/reset fault injection and duplicate-submit UI prevention remain unverified. |
| Q-11 / AC-8,16 S-3,5 | **Passed Chrome bfcache subset:** actual pagehide/pageshow with `persisted:true`, JS event history survives. CDP freeze/active commands and lock-contender denial observed. | Followup document-targeted listeners and own-window minimization still did not observe hidden/freeze/resume events; bounded waits timed out. Native lifecycle qualification remains incomplete. These portions, revalidation and draft preservation are unverified. Safari lifecycle not tested. |
| Q-12 / AC-2,5,16 | **Passed Chrome intervention subset:** normal owner-tab close permits new acquisition. Separate own-browser SIGKILL after commit/readback; same disposable profile/origin reopened with exact authored record/receipt, new owner acquires. | Not kill-at-every-write-barrier, renderer crash, OS crash/power-loss, universal release timing or Safari cross-session durability. |
| Q-13 / AC-1,7,17 | **Passed native subset, both:** versionchange→blocked→connection close→upgrade→success. Only own database reset during fixture cleanup. | Unsupported existing data/reset-incarnation outcome policy and actual Retry UI remain unverified. Cleanup is not recovery by deletion. |
| Q-16 / AC-9,11,13 F-2,3 | **Passed sample/parser subset:** Node adversaries reject UTF-8/BOM, escaped duplicates, comments/trailing commas/multiple roots, unknown keys, bad numbers/shapes/ownership/IDs/conditions. Exact surrogate/opaque/diagnostic-source round trips. Native Safari selected strict adversaries and full specimen; Chrome native IDB exact specimen readback. | No exhaustive schema/security proof or complete diagnostic computation. Retained metadata decoder not implemented. |
| Q-17 / AC-4,9–13,17 F-4,5 | **Partial qualification:** boundary and stress details below; exact generated wrappers run through own decoder before encode succeeds. Maximum Chrome bounded completion; synchronous responsiveness **failed**. | Product whole-candidate command/load/restore integration, all intersecting admitted boundaries, max+entity edit/draft preservation and integrated resolver guards unverified. |
| Q-18 / AC-2,7,12 S-5 | **Passed observed policy subset:** both initially persisted false; persist request results/estimates recorded. No grant/permanence inference. Private Chrome exploratory data distinct from normal-profile evidence. | Denied/unavailable API branches, deployed/file origins, native Safari normal-mode persistence, browser eviction and transfer workflow unverified. |

The original native download/input attempts failed and remain preserved. Final
HTTP attachment download succeeds with actual browser events/bytes and exact
restore into an empty independent origin. This demonstrates a native mechanism,
not a selected transport implementation. Native OS picker cancellation/error remains unverified. Browser-local Blob download
is separately passed in the final-source run.

## Resource boundaries and guard scope

Node suites: core **8 tests**, added boundary suite **5 tests**, separate counter
suite **4 tests**, preflight suite **4 tests**; final combined run **21 passed**. Logs preserve actual outcomes, not only assertions in source.

- Whole valid candidates exercise string length 65,535/65,536/65,537; Decimal digits
  4,095/4,096/4,097; tokens 9,999/10,000/10,001 name-only; groups 1,999/2,000/2,001;
  valuePath 127/128/129; font-family/shadow entries 255/256/257; expression depth
  31/32/33; assignment operands 1,023/1,024/1,025; aggregate strings
  4,194,303/4,194,304/4,194,305; snapshot bytes 8 MiB±1; input bytes 16 MiB±1.
- Scanner-only triples exercise raw escaped string size around 393,218,
  container depth 127/128/129, lexical tokens 499,999/500,000/500,001, and numeric
  tokens 15/16/17 plus safe-integer edges. These probes are deliberately not all
  valid full project wrappers; full parser/shape validation still follows scanning.
- Counter-only probes directly exercise semantic values 199,999/200,000/200,001
  and AST total 99,999/100,000/100,001. These bypass earlier intersecting budgets
  explicitly; they **do not** demonstrate admitted full candidates at those maxima.
- Derived scheduled-task and batch guards stop before task 10,001 / 50,001.
  A repeated-DAG scheduling specimen terminates with source unchanged. Decimal
  multiplication digit bounds 8,191/8,192/8,193 checked before allocation. Fractional
  scale 8,191/8,192/8,193 tiny-value probes are conservatively refused by the digit
  guard first; independent scale-ceiling behavior is not established. No expensive
  fixture is sent to the unbounded production resolver or hue normalizer.
- Getter rejection did not execute its getter; cycles, sparse arrays and unsafe
  prototypes reject before encoding. Prototype-pollution keys reject structurally;
  identical text as opaque IDs survives. `encode` checks full emitted wrapper through
  the actual scanner/visitor/decoder, including its 121-byte overhead here.

Unverified resource details include atomic 24/25/26 project-capacity enforcement,
retained-record metadata bounds, derived display text/diagnostic truncation limits,
all possible full-wrapper lexical/value intersections, and product-wide integration. The specific wrapper-only crossing is now exercised before writer allocation.
The standalone conservative arithmetic/task helpers are feasibility probes, **not**
a changed production Decimal API or a bounded production resolver.

## Watchdogs, unsuccessful attempts and remaining choices

Main maximum Chrome runs are externally supervised by Node's independent timer;
30 s expires only the recorded disposable Chrome child PID. Maximum codec,
25-record reads and worker alternative finished without an expiry. Counter-only
large probes have an independent child-Node 30 s supervisor, no expiry. No Safari
maximum stress ran because terminating the user's shared Safari process is forbidden;
session deletion alone is not proof it can interrupt blocked arithmetic.

Preserved unsuccessful attempts: initial npm network failure, initial populated
10,000-token boundary assumption (correctly refused by lexical budget), private
exploratory browser mode, normal-profile bfcache load-wait timeout after navigation,
download timeouts, and a counter-scale test expectation that overlooked the earlier
digit guard. One transient syntax error in the new counter test was fixed before its
final successful run. The first download run ended with a 30 s timeout/unhandled
promise rejection; it did not capture a distinct watchdog-firing receipt. Treat that
attempt as inconclusive, not bounded success. The suspected driver download-policy
path was reviewed before the second 5 s Playwright-event probe; it still failed.
Independent review then requested the successful browser-level-CDP HTTP/Blob
alternative, with explicit user activation and bounded observation, described above.
No failed source or real user data was erased to make a result pass.

Before final agreement/implementation, review a worker/bounded-scheduling direction
for large codec work, catalogue decoding/validation scheduling, remaining replacement/capacity race and product recovery/integration checks, native file download/picker behavior, Safari
lifecycle/normal-retention evidence and F-5 unavailable/incomplete-report UI. Preserve
all source rather than lowering admission limits or silently normalizing values.
Stage B and material design work require their existing separate authorizations.

Suggested short commit message (human owns Git):
`research: qualify increment 007 browser storage and codec mechanisms`

## Independent-review finding dispositions

| Finding | Disposition in the final Stage A handoff |
| --- | --- |
| R1 main-thread maximum responsiveness | Original failure retained. Final-source worker option requalified with 20 exact samples, zero observed main-thread long tasks and unchanged 30 s watchdog. Product/Safari scheduling remains open. |
| R2 unused-result catalogue timing | Corrected by materialized record consumption/summary derivation; 20 new observations per typical/large workload in both engines. Old unused-result numbers explicitly superseded. Workflow write timing labelled conservatively. |
| R3 uncontrolled issuance order | Added bounded held transaction, positively observed contender issuance, then explicit release; absence and seeded cases both tab orders three times in each native engine. Replacement/capacity races remain Stage B/integration gaps. |
| R4 illustrative recovery classification | Added executed evidence classifier, app-facing terminal suppression and readonly probe issued behind an already-issued write before release. Actual acceptance/abort plus eleven classified evidence states pass in both engines. Production recovery UI remains outside scope. |
| R5 boundary and allocation gaps | Added boundary/counter suites and exact wrapper-only lexical crossing. Encoder now bounds descriptor traversal, counts and closed shapes before writer allocation; array accessor/prototype regression tests pass. Counter-only ceilings and intersecting budgets are identified as such; production evaluator guards remain unimplemented. |
| R6 file mechanism | Preserved original tool failures; actual browser-level-CDP HTTP attachment and Blob downloads now pass, bytes/hash verified. File-input restore into a separate empty origin passes. Native OS picker cancellation/error and Safari file flows remain unqualified. |

All test/evidence files are identified by `final-manifest.json`; ignored transient
`.log` files are excluded and preserved portable `.txt` copies are included. Original
source/evidence, intermediate preflight codec and final source are distinguished by
recorded hashes. No staging, commits or pushes occurred. Edits pause for independent
review of this identified snapshot.

Final portability correction: four remaining Playwright runners now honor the same
`DTW_PLAYWRIGHT` module override as `run.mjs`. Only import selection changed; no
codec, protocol or browser experiment was rerun. Pre-correction runner bytes/hashes
are archived in `pre-portability-source/`, preserving execution-source evidence.
`final-manifest.json` revision 2 supersedes preserved `final-manifest-v1.json`.
