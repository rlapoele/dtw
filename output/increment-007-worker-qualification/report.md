# Increment 007 worker qualification — developer handoff

9 November 2026. **Partial mechanism qualification; a renderer responsiveness gate
fails, Safari in-flight watchdog preemption is unqualified, and required host/lifecycle evidence remains missing.** Production Increment
007 stays Draft / Not started. User agreement to B-1–B-5 authorized this isolated
followup, not production integration, final contract/design agreement or Stage B.
Base: `b84b1524596a0589e73680b769db0ed56b20396d`.

## Material result and next decision

A module worker can own the exercised native IDB, strict-complete acknowledgement,
Web Locks, exact codec, cursor validation and session recovery mechanisms in both
installed engines. The maximum catalogue was consumed as 25 exact 8 MiB records
(209,715,200 serialized snapshot bytes), one cursor record at a time, returning only
25 summaries. Twenty measured scans finished with separate external30s timers installed. Chrome own-process termination is independently effective; Safari preemption during an in-flight WebDriver command remains unqualified below.

**The Chrome eager 10,000-token/2,000-group synthetic display fails the unchanged
100 ms main-thread blocking target:** observed long tasks include **170 ms and
137 ms**. The JavaScript DOM construction loop alone had p95 40.9 ms; browser
layout/paint/clone costs cannot be inferred from that loop. Event-loop lag reached
303.9 ms. This is a counterexample to eagerly constructing every row, not evidence
that B-1's explicitly bounded projections are impossible. No cap was lowered, exact
value rounded or record hidden. No new paging, virtualization or product interaction
was implemented. Next bounded options are measured chunking of the existing ordinary
list or a separately assessed bounded-rendering approach. Return any materially new
paging/detail interaction to user/designer review. Do not claim the performance gate
closed from this harness or start production implementation.

Raw `status: pass` means the recorded mechanism assertions/completion passed;
it does **not** mean every timing target, AC, browser support gate or product behavior
passed. Final main raw counts are Chrome **181** cases; Safari **182**, with **two
preserved runner failures** subsequently rechecked in four focused cases. Counts
include individual warmups/samples and are not acceptance coverage totals.

## Environment and identity

- macOS 27.2 (26B123), Mac15,6 Apple M3 Pro, 36 GiB; Node 24.14.1.
- Actual native Chrome **157.0.8103.50**, newly created normal persistent disposable
  profiles. Historical Chrome 156 evidence is not carried forward as qualification.
- Native Safari **27.2 (22625.2.8.11.9)**: WebDriver isolated automation sessions for
  automated cases; normal nonprivate user-operated Safari for the separate restart/
  picker exercise. Exact Safari bundle/driver build was reread locally and matches
  the user's About report. WebDriver profiles do not establish normal retention.
- Main Chrome origin `http://127.0.0.1:52409`; Safari `http://127.0.0.1:52475`.
  Each run has its own origin/store. Other origins/profile paths are in raw results.
  CSP `default-src 'self'; script-src 'self'; worker-src 'self'; connect-src 'self';
  img-src 'self' blob:; style-src 'self'; base-uri 'none'; object-src 'none'` was
  served for the exercised loopback modules. **Deployed HTTPS is unavailable/not run.**
  Secure loopback is not deployment/CSP integration evidence for another origin.
- Existing read-only jsonc-parser 3.3.1 and cached Playwright were reused. No install,
  root dependency, production source/test/config, prototype or original Stage A edit.
  All 81 original Stage A manifest hashes/byte sizes rechecked without mismatch;
  see `original-stage-a-integrity.json`.

`manifest.json` identifies every new source/output file except itself. Main execution
source is archived under `executed-source-main/`; focused corrections under
`executed-source-focused/`; prior attempts under their own source directories.
Every archive corresponding to raw `source` maps was checked against its recorded
hashes. Original Stage A imports retain their own provenance. Initial independent review identified R1/R2; the final section records developer
corrections awaiting independent recheck.

## Case matrix and observed limits

| ID | Policy / Draft criteria | Executed evidence and result |
| --- | --- | --- |
| W01 | B-1/2/3; S-2/5; AC-1/7/17 | Worker module loads under recorded loopback CSP; secure context/native worker IDB/Web Locks/strict hint observed in both engines. No synchronous fallback. Strict is a hint/completion boundary, not fsync proof. |
| W02 | S-2; AC-3/4 | Request-success then complete, and request-success then explicit abort recorded. Abort preserved exact coverage snapshot/revision. Worker record+latest-command metadata written atomically. |
| W03 | S-3; AC-16 | Exact separator ID lock contention, both owner orders ×3 per engine; one acquired, contender refused, distinct project acquired. No TTL/steal. |
| W04 | P-1–4/F-1–4; AC-9–13 | Frozen complete coverage fixture transfers through worker decode/encode with exact bytes and detached sender buffer; opaque/empty/whitespace/prototype-text/separator IDs, lone surrogates, nine literal kinds, AST/composites/incomplete/protected content preserved. Codec is frozen feasibility code, not production decoder/domain admission. |
| W05a | S-4/B-2; AC-5/23 | Worker-confirmed pre-dispatch cancellation then attempted delayed dispatch, three times: never-dispatched and absent. Renderer-only ignored response is not treated as cancellation. |
| W05b | S-4/B-2; AC-5/6/16/23 | Actual worker termination after positive issued event, three times. Renderer retains exact raw invalid draft plus attempt/baseline/protection metadata. Restart first reacquires lock and issues ordered readonly proof; without stop proof result is unknown. Chrome main run reconciled retained/rejected/rejected; Safari focused run rejected/rejected/rejected. No replay. Exact Safari raw UTF-16 code-unit sequence, including 0xD800, survives; WebDriver returns numeric evidence instead of the surrogate string. |
| W05c/d | S-4/B-2; AC-5/7/23 | Pure identity/request/revision/generation publication predicate rejects wrong context. Missing metadata counterexample fails closed as unknown; retained record validation precedes recovery verdict. Full queued stale publication integration, lost-fencing generations, later-result UI consumption and production safe-departure remain unqualified. |
| W06 | S-1/B-1; AC-2/7 | One readonly transaction produces selected revision/projection/latest command; cursor validates each supported record and returns summaries after transaction completion. No renderer full-project catalogue/getAll. Writer contention with a long validated catalogue scan was not measured. Unsupported-record UI/count race and full domain-derived inspection remain Stage B gaps. |
| W07 | S-3/F-4; AC-3/14–16 | Worker-side stale expected revision and wrong replacement protection refuse; 26th create refuses after 25 supported records. These are sequential atomic-check subsets, not controlled cross-worker replacement/capacity races. Stage A's independent count-race evidence remains separately scoped. |
| W08 | B-5/F-4; AC-17/20/24 | Cold starts ×3; warmup +20 exact samples for100/1000/max/detail/entities; command/list workloads100/1000 and25×8MiB cursor scans. Bounded completion succeeds; Chrome eager entities responsiveness fails. See timing distinctions below. |
| W09 | S-3/5/B-3/4; AC-2/8/16 | Both automated engines observe own owner-tab close then reacquisition. Safari actual visibility changes and Chrome CDP frozen/active interventions recorded; Chrome main page emitted no freeze/resume or hide/show events in that probe, so these events are not invented. Separate Chrome host navigation observes actual bfcache pagehide/pageshow persisted=true and intact raw draft. Resume ownership/revision-gating application integration is not implemented. |

Four focused Node protocol tests pass (`tests-final.txt`); original missing-module
red phase and missing-metadata red/green regression are preserved. Eleven maintained
new `.mjs` files pass syntax checks. Production tests/typechecks/build were not rerun
because production is untouched; these are not product acceptance checks.

## Measurements

Nearest-rank p95, one separately identified warmup plus20 measured samples per
workload. Full samples and fixture hashes/counts are in raw JSON and `summary.json`.
Worker codec timing includes exact encode/decode; roundtrip additionally includes
fixture construction, exact comparisons, projections, message/clone/transfer and
renderer receipt. It is not a pure transport estimate. Renderer DOM timing is only
synthetic plain-div construction, not React parity or full browser task duration.
Visible two-frame paint observations are separate; hidden paint is unavailable.

| Workload | Chrome p95 ms | Safari p95 ms | Interpretation |
| --- | ---: | ---: | --- |
|100-token native dispatch→complete |2.7|5|Within250ms target for this synthetic operation. |
|1000-token native dispatch→complete |5.6|7|Within1000ms target for this synthetic operation. |
|100-token prepare+write+catalogue workflow |17|26|Different broader interval; not dispatch latency. |
|1000-token prepare+write+catalogue workflow |124|58|Different broader interval. |
|One-record100-token validated catalogue |2.9|2|Within2000ms, project count1. |
|One-record1000-token validated catalogue |24.8|16|Within2000ms, project count1. |
|25×8MiB validated cursor catalogue |2902.1|2394|Defensive stress; no typical2000ms SLA inferred. |
|Maximum worker encode+decode interval |1173|181|Defensive exact codec work; no typical deadline inferred. |
|10000-token/2000-group synthetic DOM construction |40.9|10|Does not include whole task/layout; Chrome actual170/137ms long tasks fail. |

All100/1000 codec encode/decode p95 observations are below2000ms. Every admitted
fixture returns through its own decoder exactly. Defensive entities use name-only
10,000 tokens plus2,000 groups; populated10,000-token lexical intersections remain
as previously documented, not silently admitted. Detail fixture exercises a full
65,536-code-unit selectable raw string including lone surrogate and4096-digit Decimal.
The maximum catalogue is exactly25×8,388,608 snapshot bytes; summary rows contain no
snapshot payload. Catalogue validation CPU remains worker-side but prolongs its
readonly transaction; contention is explicitly unmeasured.

Chrome's observed Long Tasks entries distinguish actual >100ms execution from timer
lag. Safari empty long-task arrays are **not** a pass: supported-entry capability
was not separately exported; only event-loop/DOM/paint observations support its
bounded responsiveness subset. Safari entities event-loop lag max32ms; this is not
a trace-level guarantee. Chrome lag exceeded100ms even in some worker-heavy runs;
OS scheduling/GC/renderer effects are not attributed without a trace.

One own Chrome process-tree RSS sample after maximum scans summed1,867,312 KiB
(~1.78GiB), including browser/helpers; shared mappings may be double counted.
`chrome-memory-sample.json` is not peak memory or worker-only heap certification.
No safely attributable Safari process-tree/peak-memory bound was measured.

## Actual host and user-assisted evidence

`chrome-host-results.json` records own-profile normal browser termination/restart
and separately SIGKILL after known commit, preserving exact checkpoint revision;
actual own renderer `crash` event followed by lock reacquisition; native Blob download
terminal events and saved bytes; and actual bfcache navigation. These are specific
controlled interventions, not OS crash/power-loss/eviction proof. Host-case `ms` in
that historical output was computed before awaiting its operation and is invalid;
no performance conclusion uses it. Executed host source is archived; current runner
corrects this bookkeeping only and was not rerun.

Manual route origin `http://127.0.0.1:52078`, normal nonprivate Safari operated by
user. User confirmed completion and About **27.2 (22625.2.8.11.9)** through coordinator.
Raw manual endpoint rows include automated Chrome smoke too: its original hardcoded
attribution label is not proof; exclude Chrome UA rows from Safari/user claims.
Original manual server/source closure is preserved in `manual-server-source/`.

Safari checkpoint `manual-1794263366029` was acknowledged and verified exact,
then verified with the **same revision/exactCoverage:true** after user-operated
quit/reopen. Explicit attestation was recorded22:31:44Z. The user's downloaded
`dtw-qualification.json`, selected through native picker22:32:37Z, had **10407bytes**,
SHA-256 `590682c07ab35318225b5e06f59ab6fee43b77e92f6b864b627db017bd414059`.
Independent Node regeneration matches both hash/bytes; worker decode/encode exactness
passed. Native picker cancel event observed22:33:29Z. The local server was stopped
after completion; no shared Safari app/process/tab was terminated by automation.
Manual result is user-executed evidence plus harness observations, not independent
reviewer reproduction or universal normal-profile safety.

Native Chrome OS picker select/cancel remains **not run**; Chrome Blob download is
a different verified mechanism. Safari actual bfcache, explicit freeze/resume and
renderer crash remain **not run/unqualified**; normal user restart and automation
owner close do not substitute. HTTPS remains **not run** at user's stated unavailable
host; no deployment, trust install or browser preference change occurred.

## Watchdogs and unsuccessful attempts

- Initial tool command serialization failed before execution because it contained
  a literal lone surrogate; no files from that batch were written. First sandboxed
  loopback bind failed EPERM, then own server/native runs used approved host execution.
- Chrome attempts1/2 failed before cases because a directory route returned404;
  explicit manual.html smoke was unaffected. Both sources/results are preserved.
- Attempt3 had a closed-message recovery test error and an aggregate20-sample
  maximum watchdog expiry at30,001ms. Supervisor killed only its own disposable
  Chrome child; no larger fixture ran. This is inconclusive/failure, not bounded pass.
- After coordinator reviewed corrections, attempt4 used per-operation supervision
  and completed maximum warmup+two samples before unexpected browser closure.
  No watchdog fired and no cause was established. Do not attribute it to user action.
- Attempt5 same-maximum-only diagnostic completed warmup+20 safely, then deliberately
  stopped before escalation. Its raw deliberate-stop error is a harness selection
  terminator, not native failure. Later full run has separate source/evidence.
- Safari main W05b failed WebDriver transport of a lone-surrogate result, not proof
  the renderer changed its input; cold startup failed after closing selected own
  window. Archived source/results remain. Focused rerun fixes only JSON evidence
  representation and owned-window selection; all four selected cases passed.
- Safari external-supervisor probe before defensive stress positively
  observed own worker holding lock while CPU-blocked, externally DELETE exact own
  automation tab, then observe another own worker acquire that lock. **The probe's
  execute/async command had already returned before DELETE. It does not prove
  DELETE can preempt a real stress execute/async still waiting for the worker;
  safaridriver command serialization is unqualified.** Stress timers would request
  closing only the identified own tab at30s, but effectiveness in that state was
  not established. No Safari expiry/app kill occurred. Completed Safari maximum
  measurements are observations, not proof the required supervision gate passed.
  Current source fails closed before Safari defensive stress; no benchmark rerun
  followed this safety correction. All later stresses use30s per actual operation,
  with warmups separately marked. Seeding/setup is separately timed and bounded.

No further benchmark, renderer redesign or larger fixture follows the material
Chrome responsiveness finding. Evidence/source edits pause for independent review.
Suggested commit: `research: qualify increment 007 worker placement and host mechanisms`.


## Revision 2 — R1/R2 developer correction handoff

The initial independent review (`independent-review.md`) reproduced two real harness
defects against the original95-file snapshot. Its reviewer-owned report and raw
counterexamples remain untouched. **Developer corrections below await independent
recheck; they do not qualify production or close existing readiness gates.**

| Finding | Correction | Focused evidence |
| --- | --- | --- |
| R1 fixed database incarnation fabricated rejection after data loss | Database creation atomically persists a fresh `crypto.randomUUID()` incarnation. Recovery and acceptance fail closed for absent/empty/overlong/changed incarnation. A newly created database cannot impersonate the previous incarnation. | Native Chrome157.0.8103.50 and isolated Safari27.2: accepted absent-project command → own DB delete/recreate + worker restart → same-attempt recovery stays unknown, repeated3 times. Same-incarnation matching metadata still confirms retained; worker-confirmed never-dispatched unchanged absence confirms rejected; deliberately corrupted incarnation remains unknown. |
| R2 overlapping preparations bypassed the single-mutation slot | Reserve active command before codec/read work or await; release only matching reservation on preparation/setup/terminal failure. Keep live-session attempt states through preparing/opening; cancellation fences continuations. Command IDs cannot be reused; opening/issued/completed dispatches cannot dispatch a second time. Synthetic seeding now follows this same gate. | Both engines: overlapping two-project prepares×3 yields exactly1 prepared/1 refused; denied command cannot dispatch or create a record. Concurrent dispatch×3 issues exactly1 native transaction and preserves winning latest-command metadata. Reused command IDs refuse. Ownership-preparation failure frees the slot. Cancelled/preparing old attempts cannot clear a newer reservation or publish a write. |

`revision-2/chrome-results.json` and `revision-2/safari-results.json` each contain5
passing targeted cases, including repetitions and normal controls; source hashes
match `revision-2/executed-source/`. These are native mechanism regressions, not UI,
production domain/codec, broad stress or browser-support acceptance. Browser/origin/
profile/build facts and event/transaction order are retained in each raw result.
Five focused Node tests pass; the malformed-incarnation test's initial red output
is preserved. Twelve maintained `.mjs` files pass syntax checks. No old performance
matrix was rerun; its timings remain attributed to its historical source.

The initial95-file manifest is preserved verbatim as `manifest-revision-1.json`.
Changed old active worker/protocol/test/README/report/verdict bytes are archived in
`revision-1-source/`; revision-2 manifest explicitly maps these superseded paths.
Earlier executed-source archives/results, reviewer probes and original Stage A are
unchanged. Current manifest excludes reviewer-owned report/probes so the reviewer
can append a recheck without changing developer snapshot identity.

**Unchanged gaps:** Chrome eager10,000-row170/137ms long-task failure; Safari
preemption while WebDriver execute/async is pending; unavailable deployed HTTPS;
native Chrome picker and remaining Safari lifecycle/crash/bfcache coverage; full
production integration and Stage B. No new render strategy, cap change, dependency,
production feature, benchmark or journal was added. Stop edits for independent
recheck of this revision-2 snapshot.
