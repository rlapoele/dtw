# Independent review — bounded E-4 qualification

10 November 2026. Reviewer examined baseline `d4b02c74de773d132847ca1b9e69f983b5fb44ed`
plus the frozen new research/output snapshot identified by manifest SHA-256
`06a26513c91b758c08d7157f8ba105d825a3966323db6f1f17edf1569f945cee`.
The coordinator-owned status edit is outside the executable snapshot.

**No actionable review finding identified in the current scoped evidence/report.**
This accepts an honest negative/incomplete qualification report, not E-4 readiness.
**E-4 remains incomplete, with a genuine ordinary-work failure and only a small
Chrome positive subset.** Increment 007 implementation and Stage B remain unauthorized.

## Basis and scope

Expectations were derived from AGENTS.md, the reviewer role brief, Draft AC-18/20/24
and its normative E scope, the agreed exceptional-detail policy, frozen V4 design
and analyst review, architecture, presentation conventions, open questions and gap
plan. Ordinary work retains 100 ms. Only explicitly invoked applied authored/identity
source above 65,536 pretty UTF-16 units and its scoped native actions may use 250 ms
per whole target-renderer task and 5,000 ms per complete action. Neither a cap nor a
missing/native/foreign-renderer interval can create a pass.

Inspected fixtures, transport, worker/client publication, disclosure, runner, Safari
probe, trace analyzer/tests, attempt snapshots, saved JSON/traces, report, preservation
checks and saved failure/compact screenshots. No browser, clipboard, settings, trust,
shared Safari, user port 4227 or failed/larger workload was operated during review.
No production/source/test/requirement/prototype file was edited. Independent checks
and build output used `/tmp`; this review file is outside the frozen manifest.

## Independently verified evidence

- All **141 frozen new files and 58 read-only production inputs** match manifest
  byte sizes/hashes; HEAD matches baseline. All 25 V4 and 131 corrected-comparison
  entries also match. Their manifest digests are respectively
  `00adc180f205819cc8549ce5223832886fe023139ac2a302071a4606bfe70ae0` and
  `1934c993a4a33834a5553130c270665c232d8216eb4ef9eb7a2b08368ad11796`.
- App/Editor copies are byte-identical to V4. Production components and operations
  are reused; no reduced list/inspector or fabricated readback substitutes were
  found. Scoped Git diff for production, tests, dependencies and prior prototypes/
  artifacts is empty. This proves source preservation, not integrated runtime parity.
- Replayed **64 saved trace verdicts**: attempt 1 (29), corrected attempt 2 (28),
  safe UI run (7). Independently identified the target URL/frame from raw tracing
  metadata and its renderer PID, verified same-PID start/end action marks, then
  replayed exact-frame ownership and interval maxima. Status, maxima and whole-task
  counts agree. Nested Layout durations are not added to RunTask.
- `029-65535-ordinary-load-trace.json` contains **1,797.093 ms RunTask**, including
  **1,794.751 ms Layout**, on the identified renderer main thread. The saved action
  wall time is 1,806 ms. `run.mjs:33` measures fixture/load/list work at 100 ms,
  before source activation. The intact description layout is ordinary work; no
  exceptional-source allowance applies. Stopping without larger repeats is correct.
- Fixture tests independently confirm 65,535/65,536/65,537 exact pretty-unit sizing,
  admission of the finite intersections, the 4,134,504-unit counterexample, and the
  escape-heavy crossing. These are fixture assertions, **not browser boundary passes**.
- Corrected 20 small openings have distinct activation identities and matching
  mounted unit counts/digests, with ordered assembly/mount/double-rAF witnesses.
  Recomputed action wall p95/max is **100/100 ms** and whole-task p95/max is
  **1.947/2.160 ms**. These support only the 562-unit source on the recorded Chrome
  session; no exceptional-size distribution follows.
- Initial repeated metrics really are stale and cannot support that distribution.
  Initial and corrected source/evidence are preserved separately. The later exact
  reference-label timeout is preserved as invalid, and the final safe UI run uses
  the corrected locator. No failed risk fixture was repeated for these corrections.
- Source/client code and safe UI records support requested worker failure/explicit
  Retry with literal `0.` and reference `target` retained, applied source unchanged,
  and rejection of held real responses after close/selection change. Single-worker
  read publication tests do not qualify mutation/CAS/worker-replacement mechanisms.
- Whole-message bounds account for serialized headers and escaping; focused tests
  check exact reassembly including lone surrogates/split pairs, offset/total/complete
  errors and context dimensions. No full authored row/project is posted incidentally.
  Boundary fixture construction does serialize for sizing; its ordinary load cost
  is included and the report correctly limits closed-source counters to worker work.
- Native selection/copy records preserve false equality booleans. Cmd+A selects
  document content; clipboard text equals neither selected text nor exact source.
  `run.mjs:43–48` gates clipboard read behind the synthetic native copy witness and
  paint turn, without reading/saving prior clipboard. Timing-only pass labels do not
  establish semantic/native-access success, as the report explicitly explains.
- Safari saved small activation leaves `details.open=true`, null metrics and only
  loaded/stats worker events. No read dispatch or source/native/task pass follows.
  Finite same-pending-command supervision fails: controller timeout occurs while
  execute/async is pending; natural finish is 12,003 ms and lock witness 12,006 ms
  after block start. The sequence stops at that first intervention failure. This
  establishes failure of this attempted supervisor, not universal Safari impossibility.

## Independent checks

Executed focused transport/trace tests: **10/10 pass**. Strict isolated TypeScript
passes. Isolated Vite build to `/tmp/dtw-e4-review-build` passes and every generated
build entry matches frozen bytes. Production's unchanged full suite was not rerun.

In a separate `/tmp` copy, removed the target-PID guard from renderer-thread matching;
two ownership tests fail as expected, exposing false pass from foreign tasks. The
frozen source was untouched. This is a focused mutation check, not a mutation score.
Manual screenshot review confirms local failure/Retry and the modest compact specimen;
it does not establish large-source geometry, actual zoom, AT or exhaustive parity.

Initial attempt build bytes were not archived separately. Exact source and traces
are retained, but the final reproducible build must not be attributed retroactively
to that initial attempt. The developer report discloses this provenance limit.

## Gate disposition and remaining limits

| Gate | Evidence-qualified disposition |
| --- | --- |
| E-1 layout/notice and current list/complete inspector preservation | Source-level consistency and modest saved screenshots; full integrated AC-18/20 acceptance remains Stage B. |
| Ordinary rendering | Genuine 100 ms failure on the first admitted boundary fixture load. No universal host/browser or complete-projection conclusion. |
| E-2 size boundary and E-3 exceptional ceilings | Offline boundary fixtures valid; actual boundary source and larger exceptional opening/native actions unrun. Not qualified. |
| Full native exact selection/copy/Find | Tested Cmd+A/C path does not qualify exact-source access; scoped full-source selection/copy and beginning/middle/end Find remain open. |
| Scroll/actual 200% zoom/AT | Modest geometry only; actual zoom was not established and AT was not run. Not qualified. |
| Safari support/safety | Small activation incomplete and attempted supervisor failed; defensive escalation correctly withheld. No both-engine pass. |
| Whole-wire/read publication mechanisms | Narrow framed-transfer tests and real close/selection response barriers supported; full projections, event-time command fences, worker replacement, lifetime/retention/contention/derived guards remain open. |

No corrective code change or automatic rerun is requested to make an honest failed
qualification appear successful. Any next mechanism investigation or material design
decision belongs to the coordinator/user under the existing gates. No third viewer,
lower cap, raised threshold or production implementation follows from this review.

The frozen manifest and production/prior artifact hashes were rechecked during review;
the reviewer made only this separate review artifact. Suggested human-owned commit
for the bounded package: `research: record bounded E4 qualification failures and review`.
