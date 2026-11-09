# Increment 007 worker qualification — independent review

9 November 2026. Initial review: **changes required for two harness defects**.
This reviews isolated mechanism qualification, not production Increment 007 implementation,
final contract/design agreement, Stage B acceptance or browser support certification.

## Snapshot and method

Reviewed base `b84b1524596a0589e73680b769db0ed56b20396d` plus the 95 source/evidence
files in `manifest.json`, SHA-256
`f225e8f4c93fbbf8c53d906544d4b594f908615b12755ef346060df774f217df`.
All 95 hashes and sizes matched. Main Chrome/Safari and focused Safari raw source maps
matched their archived executed sources. Current worker/protocol source was inspected;
historical runner corrections and failed attempts were read separately.

Expected behavior was derived first from AGENTS.md, role briefs, agreed B-1–B-5,
storage/concurrency qualification plan, S-1–S-6, F-1–F-5, coverage/admissibility,
architecture and Draft AC-1–24. Key expectations: exact authored preservation;
strict transaction completion rather than request success; one active mutation;
worker-confirmed cancellation; same-attempt reconciliation requiring dispatch-stop,
transaction ordering, ownership and unchanged database incarnation; coherent worker-side
catalogue/projection; unchanged limits; native-event evidence distinct from injection,
manual attestation and automation. The code-review-and-quality skill supplemented these.
No memory-derived project facts were used.

Independent checks:

- `node --test research/increment-007-worker-qualification/protocol.test.mjs`: 4 passed.
- All 81 original Stage A manifest entries independently rehashed with no mismatch;
  original manifest SHA matches recorded `b9d8457c...705cf`.
- Tracked diff against base contains only six planning/status Markdown files. Production,
  root dependencies/tests/config, prototypes and original Stage A remain unchanged.
- Recomputed representative p95/sample counts from raw Chrome/Safari data, and checked
  the two Chrome >100 ms long tasks directly. Each listed codec workload has 20 measured
  samples excluding warmup. Main counts are 181/182; Safari main failures and focused
  replacement evidence remain separately visible.
- Checked manual Safari UA rows, checkpoint revision before/after explicit user restart
  attestation, selected-file hash/byte count and cancel event. Chrome smoke rows are
  distinct. Independently hashed retained Chrome download bytes: 10,407 bytes, matching
  recorded SHA-256. Manual Safari restart remains user-executed evidence, not my reproduction.
- Ran a focused own-profile native Chrome 157.0.8103.50 probe, headless, on a fresh
  loopback origin with the exact reviewed modules. No stress, user tabs, normal Safari,
  shared processes or existing prototype sessions were touched. Initial sandbox bind
  was denied; approved host execution then completed. Probe source and raw output:
  `reviewer-probes/native-counterexamples.mjs` and `native-counterexamples.json`.
  Own disposable profile and browser were closed normally. These probes establish
  counterexamples, not a normal visible-browser support claim.

## Required findings

### R1 — P1: database recreation reuses incarnation and fabricates rejection

Affected policy: S-4/B-2; Draft AC-5/6/23. `worker.mjs:9` initializes every new database
with literal `incarnation-1`; `worker.mjs:71` then uses it as reconciliation evidence.

Reproduction: prepare absent project `reset-proof` with expected revision `null`, dispatch
`accepted-before-reset`, observe retained and read back that revision; terminate the
worker, start a replacement, delete the qualification database, then recover the same
attempt with stopped dispatch. The probe returns `status: rejected`, unchanged
`incarnation-1` and absent revision. The command actually completed before database loss.
For an uncertain attempt the retained command would be missing, not evidence of rejection.
A fresh database must not impersonate the former database incarnation.

Required correction: generate and retain a new opaque incarnation per database creation;
validate incarnation evidence fail closed. Add a native reset/recreation regression
showing the old attempt stays unknown, while ordinary same-incarnation ordered absence
can still establish rejection and matching metadata can establish acceptance. Retain
historical raw evidence unchanged and distinguish corrected mechanism evidence.

### R2 — P2: overlapping prepares both acquire the single-mutation slot

Affected policy: B-2 one active mutation, latest-command consumption boundary.
`worker.mjs:66` checks `active` before awaiting `read`, but reserves the slot afterward.
Async message handlers therefore interleave during that read.

Reproduction: acquire project `parallel`, then issue two prepare calls together for
`parallel1` and `parallel2`. Both return fulfilled in the independent native probe,
leaving two prepared mutation attempts. The later assignment overwrites the slot;
completion/cancellation of one can clear it while the other still exists. Sequential
runner calls and the four pure protocol tests do not expose this race.

Required correction: reserve the slot synchronously before any asynchronous preparation,
retain it through the pending attempt and release it safely on preparation failure or
that attempt's terminal transition. Add overlapping-prepare rejection and failure-cleanup
regressions. Recheck existing cancellation/dispatch/recovery cases, not only pure predicates.

## Verified evidence and qualifications

Within the actual raw cases, both engines demonstrate loopback module worker startup,
strict-hint native transaction completion/abort, exact prior-state preservation after
abort, native exclusive locks in both owner orders, byte-exact transfer and coherent
selected reads/cursor summaries. The source keeps expensive codec/cursor work in the
worker and returns summaries without full catalogue snapshots. Worker cancellation
blocks the delayed dispatch exercised by W05a. W05b positively observes worker termination
and subsequent lock acquisition/readonly completion; raw invalid UTF-16 input survives
in the page, including Safari focused numeric code-unit evidence. These are exercised
subsets; R1/R2 prevent broad recovery/single-mutation qualification.

The developer report correctly limits sequential CAS/protection/capacity tests, pure
publication predicates and synthetic DOM work. Chrome host evidence records controlled
own-process restart/SIGKILL, renderer crash event, Blob download and persisted bfcache
events. Safari automated owner-close and visibility observations differ from normal
user restart and native-picker evidence. No universal crash, power-loss, eviction,
physical durability or freezing guarantee follows.

The report's material failures are supported: Chrome synthetic eager entities rendering
has actual long tasks 170/137 ms; Safari historical maximum samples do not qualify safe
in-flight WebDriver watchdog preemption; current Safari runner stops before defensive
stress. No limits were reduced and no successful completion is silently promoted to
a timing/support pass. Host-case historical `ms` is invalid and explicitly withdrawn.

## Remaining unverified limits

Required HTTPS/deployed CSP is not run and unavailable; it is an honest gap, not a request
to deploy. Chrome native OS picker select/cancel, Safari bfcache/freeze/renderer-crash,
writer contention during validated catalogue scans, lost-fencing/stale-publication
integration, full derived inspection, actual React/UI commit behavior and all Stage B
product ACs remain unqualified. Safari event-loop/DOM observations are not a trace-level
no-blocking guarantee. Maximum RSS sample is not peak memory certification.

No new stress or full matrix rerun is required by this review. Correct R1/R2 in isolated
scope, preserve originals, supply focused regressions and an identified new snapshot
for independent recheck. Production authorization and final agreement remain with the user.
Source inspection pauses after this initial report so the sole developer can work.

## Revision 2 independent recheck — 10 November 2026

**R1 and R2 are closed for the isolated qualification harness. No additional actionable
finding was identified in this focused recheck.** This supersedes the initial
changes-required disposition for these two defects only; the initial review and
counterexamples above remain historical evidence.

Snapshot: base `b84b1524596a0589e73680b769db0ed56b20396d`, revision-2 manifest SHA-256
`e0bb311243bbbaf919ad8559f3b3765747e1cf56f6709ac217277d42c221fde2`, 115 developer-owned
files excluding manifest and reviewer-owned files. All 115 hashes/sizes matched.
The preserved initial manifest retains SHA-256 `f225e8f4...17df`; all original 95
entries are recoverable with identical hashes/sizes through the explicit superseded-path
map. Both revision-2 native results' source maps match `revision-2/executed-source/`.
Original Stage A's 81 entries still match. Whitespace check passes. No production,
root dependency, application test/config or prototype change was introduced.

Reviewed changes against the original findings before interpreting new results.
Database creation now persists `crypto.randomUUID()` in its creation transaction;
recovery and acceptance validate incarnation evidence. Preparation reserves the active
slot synchronously before codec/read work. State transitions prevent duplicate dispatch
while database opening is pending. Release checks the exact command identity, preparation
failure frees its reservation, cancelled preparation/opening cannot later submit, and
attempt IDs cannot be reused within that worker session. Synthetic seed calls follow
the same preparation/dispatch gate; previous performance numbers remain historical.

Independent checks:

- Five focused Node protocol tests pass, including missing/malformed incarnation.
- Inspected both engines' five targeted native case records and actual outcomes,
  including reset/recreation repeated three times, retained/absence/malformed controls,
  overlapping prepares and duplicate dispatch repeated three times, preparation failure
  cleanup and cancelled continuation handling. No case/top-level error is present.
  Safari evidence is the developer's isolated native WebDriver execution, independently
  source/evidence reviewed; I did not reproduce it in normal Safari.
- Reran the original database-reset and parallel-prepare counterexamples in a new own
  native Chrome 157.0.8103.50 headless profile/origin. Accepted-then-reset now returns
  **unknown** with a different persisted incarnation; parallel preparation now returns
  exactly one fulfilled and one `one-active-mutation` rejection.
- Independently exercised preparation failure without ownership followed by successful
  preparation: the slot is released. Added a labelled deterministic 250 ms delay before
  `read` for the single synthetic project `deferred` via browser request interception,
  leaving repository source untouched. Cancelled the old preparation, prepared a newer
  command before the old read continuation completed, then observed the old continuation
  return never-dispatched. The newer slot stayed occupied, another prepare was refused,
  and the cancelled attempt could not dispatch. Two simultaneous dispatch calls for the
  newer command issued exactly one native transaction. An explicit request-success→abort
  control preserved that newer retained revision. All five reviewer probe assertions pass.

Probe source/raw result: `reviewer-probes/revision-2-native-recheck.mjs` and
`revision-2-native-recheck.json`. The source delay is explicitly scheduler injection,
not a native timing/lifecycle measurement. Original probe files were not overwritten.
The probe records the unmodified worker hash
`629f7ab86ff8578b134f0f999f1d33dcb19e0e451bde286c2dd32b7c3d205839`.
Only an own disposable browser/profile, new loopback origin and synthetic database were
used; own browser closed normally. No new stress, broad benchmark or user Safari action.

Unchanged qualification limits remain material: Chrome eager-render responsiveness
fails; safe Safari in-flight watchdog preemption is unqualified; HTTPS is unavailable/
not run; remaining native picker/lifecycle/crash coverage and actual application/React,
recovery-publication/departure and full AC integration remain unverified. In particular,
the harness's caller-supplied stop fact is exercised with explicit cancellation or
actual worker termination; this does not prove arbitrary production lost-fencing
recovery. R1/R2 closure neither qualifies support nor authorizes production implementation,
final contract/design agreement, Stage B, a revised render strategy or relaxed limits.
