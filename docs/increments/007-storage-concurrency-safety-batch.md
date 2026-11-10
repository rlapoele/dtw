# Increment 007 — finite storage/concurrency safety batch

10 November 2026. Baseline: clean `7611ec7` on `dev`. The user authorized
“Go ahead with the storage/concurrency safety qualification.” This document bounds
that execution; it does not authorize production implementation, a new interaction
design, staging, commits or pushes. Increment 007 remains Draft / Not started.

## Owning sources and scope

Read [G-02–04 and stop rules](007-qualification-gap-plan.md),
[S-2–4](007-storage-acknowledgement-and-concurrency-proposal.md),
[B-1/B-2 worker placement](007-production-scheduling-and-browser-scope-proposal.md),
the [qualification plan](007-storage-concurrency-qualification-plan.md), and the
[description amendment](007-format-decoder-and-resource-proposal.md#token-description-amendment--10-november-2026).
The [worker report](../../output/increment-007-worker-qualification/report.md) and
[revision-2 independent recheck](../../output/increment-007-worker-qualification/independent-review.md#revision-2-independent-recheck--10-november-2026)
own prior executed claims; R1/R2 closure is a control, not proof of G-03/G-04.

Use new isolated `research/increment-007-storage-concurrency-safety/` and
`output/increment-007-storage-concurrency-safety/` directories. Preserve every older
research/output byte. Reuse existing installed tooling and codec through explicit
read-only imports or identified new-scope copies; add no dependency. Use real module
workers, native IndexedDB with requested strict durability, and native Web Locks.
No production adapter, UI, prototype or root configuration change.

Use small exact synthetic projects, normally the 100-token fixture; identity/text
controls can be smaller. Every token description must be within 1,024 decoded
UTF-16 units. The separately qualified
[description-aware codec](../../research/increment-007-description-boundary/codec.mjs)
is a Node adapter, not a browser module import. Reuse the frozen browser-compatible
codec with explicit new-harness field guards, or copy its identified source and
the small guard into the new directory with provenance/hashes; no new codec
qualification is requested. Check fixture descriptions before every new admission
path. Do not call old `exactBytes()` or
load the excluded long-token-description fixture. Record counts, emitted bytes,
hashes and code-unit equality. Capacity tests use 24/25 small records: they test
record-count atomicity, not supported serialized size or performance capacity.

## Prerequisites and execution order

1. Developer prepares the new harness, finite case inventory and offline runner
   tests. Record baseline/source hashes and verify all old manifests/source paths
   remain unchanged. Independent preflight review checks the stable source snapshot
   and offline results before live execution.
2. Prove evidence preservation offline before launching a browser: inject an
   assertion failure, browser-command rejection, watchdog expiry and cleanup/profile
   deletion failure. Case identity, partial trace, original error, environment and
   terminal verdict must survive every injection; cleanup failure must remain a
   separate recorded error. Confirm first failure prevents the next case dispatch.
3. Execute Chrome cases below in order, using an owned disposable Chrome process,
   profile, origin and database. An independent Node supervisor can terminate only
   that owned process. Apply the external 30-second wall-clock limit to each live
   case, including race/barrier time; record fixture setup separately. Do not repeat
   historical maximum or rendering experiments.
4. Assess the Safari branch separately. Existing evidence proves idle-command
   own-window close only; it does not prove pending-command preemption. If the
   exact owned automation window/controller route below cannot be established
   without touching shared Safari, record G-02 unavailable and stop that branch.
   Chrome work does not depend on Safari readiness. No Safari G-03/G-04 executes
   before the G-02 gate passes.

All new live cases are finite. A live failure, inconclusive result or watchdog
expiry stops the affected engine batch immediately: preserve evidence and return
it for review, with no automatic repair, rerun or escalation. A failed Safari gate
does not cancel independent Chrome work or waive Safari qualification.

## Chrome G-03 — native dispatch, recovery and publication

Run C2–C4 three times each, C5's eight controls once each, and C6's three changed-
context subcases three times each plus one unchanged-context control. C1 has two
single controls. Keep fresh attempt identities and exact raw invalid input, baseline revision,
project/selection/request/generation and replacement-protection correlation in the
renderer before submitting. Trace native issuance, request success, complete/abort,
lock events, stop proof, ordered probes and publication consumption.

| Case | Controlled procedure | Required observation |
| --- | --- | --- |
| C1 — terminal controls | Complete one strict write; separately abort after request success. | Retained only after native `complete`; abort preserves exact prior record/revision/latest-command metadata. Strict unavailable fails closed. |
| C2 — cancellation before dispatch | Pause a real worker continuation before transaction creation, cancel in the issuing worker, then release the delayed continuation. Attempt a duplicate dispatch. | Positive worker stop acknowledgement; zero later acceptance transaction; unchanged state, known unsubmitted/rejected; duplicate cannot issue. Renderer-only cancellation is insufficient. |
| C3 — issued then lost worker | Observe actual transaction issuance, terminate only that worker before its result is consumed, start a new worker and reacquire the same project lock. Issue the recovery probe only after establishing original dispatch cessation/transaction ordering. | No replay; raw input survives. Matching validated same-incarnation metadata confirms retained once. Confirmed abort or fully proved ordered unchanged state can confirm rejection. If any required stop/order evidence is missing, verdict remains unknown even if the record is absent. Do not demand a particular native commit-versus-abort winner. |
| C4 — commit before result | Observe native complete, hold the actual worker response before renderer consumption, then lose/restart the worker and reconcile the same attempt. Deliver the old response afterward. | Matching latest metadata consumes success once; late response cannot complete again or overwrite current state. Read failure after known complete remains retained plus unavailable, never rejected. |
| C5 — lost/malformed evidence controls | Six separate negatives for unresolved sent attempts: withhold stop proof; withhold ordering proof; remove command evidence; malformed incarnation; read failure; delete/recreate only this database. Two positives: same-incarnation ordered unchanged-state; matching metadata. | Label injected evidence faults distinctly from native worker loss/reset. Insufficient proof stays unknown and blocks affected resubmission. New incarnation never fabricates rejection. Existing R1 predicate regression alone is insufficient. |
| C6 — actual late publication | Hold a real read/operation result at the renderer delivery boundary, change project, selection or worker generation in three separate subcases, then deliver it. Include one unchanged-context delivery control. | Wrong-context payload is observed but ignored; it does not alter current selection/view/raw input or acknowledge another attempt. Matching current delivery is consumed once. Do not replace message delivery with predicate-only tests. |

For C3/C5 explicitly compare a proof-complete run with an otherwise identical run
whose required evidence is withheld. A runner assertion or caller-supplied `stopped`
boolean cannot manufacture proof. Record which actor observed each fact. Hold
publication outside the acceptance transaction; no dialog/message await is inserted
inside native acceptance.

## Chrome G-04 — controlled small-fixture contention

For each row, run **three repetitions of each specified order/winner**. Reverse
worker identities as well as ordering. No extra repetitions or exhaustive-scheduling
claim. Prepare/validate candidates before acceptance. Use real two-worker native
transactions with explicit issuance and active-request barriers, not sleeps.

| Case | Material orders | Required observation |
| --- | --- | --- |
| C7 — validated catalogue versus writer | Start with an empty then typical catalogue. Active readonly cursor first / acceptance writer first. | Waiting operation is positively issued before releasing the first transaction. Catalogue is wholly before or wholly after the writer, returns only summaries after completion, and has coherent revisions. Writer eventually completes, unrelated project remains exact; no phantom catalogue/receipt split. Report writer wait separately from dispatch→complete and scan time. |
| C8 — same-ID absent insert | Both contenders prepare against absence; A first / B first. | Exactly one accepted record/revision/latest-command result; loser conflicts and cannot change winner or unrelated project. Cooperative ownership first proves only one writable owner. A separately labelled uncooperative native writer may bypass Web Locks solely to exercise atomic CAS. |
| C9 — final record slot | Seed 24 records, issue two different-project insertions before releasing the first acceptance barrier; A wins / B wins. Repeat with one unsupported/unavailable record among the 24. | Exactly one fills slot 25; other is refused with no partial record or metadata. Unsupported record counts and remains visible/unavailable. All original records, including unavailable raw record, remain byte/structure exact. |
| C10 — changed protected revision | Prepare replacement protected for A. Competing accepted B before replacement checks / complete replacement first and then stale contender. | B-first replacement conflicts and preserves B exactly. Replacement-first is complete replacement with its new revision/result; stale contender conflicts. No merge, protection bypass, lost unrelated project or split metadata. Protection/ack identities are explicit synthetic harness inputs, not proof of actual backup/UI protection. |

The harness may hold a native transaction active only with a labelled fixed-ceiling
request/cursor barrier. Record that ceiling and every request count. Never await an
external worker message in the acceptance transaction. If the required overlap
cannot be positively established within the ceiling, fail/inconclusive and stop;
an accidentally sequential run does not pass. This keepalive is test instrumentation,
not a proposed product technique. No 25×8 MiB scan runs in this batch: G-04 defensive
size/validation contention remains open, alongside product protection integration.

The complete inventory is **65 cases per eligible engine**: C1 2, C2–C4 9,
C5 8, C6 10, C7 12, C8 6, C9 12, C10 6. These are upper bounds, not a requirement
to continue after a stop. No dynamic case discovery or automatic extra repetitions.

## Safari G-02 — finite prerequisite, then the same small cases

Only an isolated native safaridriver automation session with positively identified
own target and witness windows is eligible. Never reuse a shared normal Safari
window, kill Safari.app, change browser trust settings or touch native clipboard.
The current WebDriver window is pinned to the target before starting the command;
no other actor may switch it while the command is pending. The close operation
must target that exact owned current window, not all windows/session deletion.

Use a finite **12-second** CPU block in the target worker while it owns a dedicated
Web Lock. Worker emits a start event to the renderer, which sends it to the local
recorder before the runner's same `execute/async` command waits for its result.
The witness in another own window requests the same lock and reports independently
to the recorder, without requiring a WebDriver command during the pending execute.

First run one nonintervention control: natural-finish sentinel at approximately
12 seconds, pending command completes, and normal release is witnessed. Then run
three controlled repetitions. A separate controller process requests actual exact-
own-window close **2 seconds after positive start**, with a **3-second response
deadline**. Capture controller/runner clocks, pending-command status, target handle,
close request/response, witness acquisition and natural-finish sentinel. Pass only
if close and witnessed cessation/lock release occur before natural completion while
that same execute was still pending. A successful HTTP submission or script timeout
alone does not pass. Preserve transport errors as observations.

On queued close, timeout, wrong target, missing evidence or any failed repetition,
stop Safari; let only the finite block finish, capture evidence and perform bounded
owned cleanup after pending work settles. No repeated close, infinite block, larger
fixture or shared-app termination. A different supervisor/isolation route requires
review; this plan does not invent a proven fallback.

Only after all G-02 controls pass, run C1–C10 with the same finite counts, fixtures,
stop rules and external 30-second per-case own-window supervision. Safari automation
results remain automation-mode mechanism evidence, not normal-profile support.

## Evidence, review and exclusions

Persist case-start/environment before dispatch; checkpoint each barrier and native
terminal evidence to the new output before cleanup, screenshots, browser shutdown
or profile deletion. Capture partial evidence in the failure handler before any
fallible cleanup; append cleanup results separately without replacing the original
verdict/error. Use server/supervisor receipts so browser loss cannot erase all logs.
Bound log size; capture exact old/new record comparisons, incarnation, attempt/result
and protection identities, fixtures/source hashes, browser/OS/profile/origin/CSP and
intervention ownership. Clock timestamps supplement causal barriers; they do not
replace observed transaction ordering.

Freeze a stable source/output manifest for an independent reviewer after execution.
Report each planned repetition as pass/fail/inconclusive/not run, preserve first
failures and missing Safari coverage, and distinguish native facts from injections.
The reviewer checks saved evidence against source and owning criteria; findings
requiring a new live run return through the coordinator, never an automatic retry.

No benchmark/p95 claim follows from three correctness repetitions. Maximum byte/
entity/catalogue stress, product dialogs/departure/reload, actual replacement backup
and acknowledgement UI, normal-profile/HTTPS release coverage, native file pickers,
rendering/accessibility and all Stage B acceptance stay separate. No durable journal,
alternate authority, worker pool, framework or relaxed acknowledgement is selected.
Strict completion does not establish physical permanence. The existing HTTPS result
is preserved; this local safety batch does not reopen hosting or TLS changes.

This analyst handoff performed document/source inspection only, with no browser
session, experiment or production implementation. Suggested documentation commit:
`docs: bound storage and concurrency safety qualification`.

## Executed result and handoff — 10 November 2026

The [report](../../output/increment-007-storage-concurrency-safety/report.md) and
[independent review](../../output/increment-007-storage-concurrency-safety/independent-review.md)
record Chrome **65/65 passing**, fourteen offline checks passing and no extra live
repetition. Nine initial preflight findings were corrected and independently
rechecked before execution. Chrome used identified R2; a separately reviewed narrow
Safari runner correction produced R4 without rerunning Chrome. Executed sources,
rejected preflight revisions and exact compressed evidence remain identified.

Safari stopped at owned-driver readiness before session creation. All four G-02
controls and 65 safety cases are **not run**; root cause is unverified. Driver
termination is source-attributed, while Chrome exit/profile cleanup is observed.
No retry, repair after that live stop, or shared Safari window action followed.
The report discloses the C6 mutable returned-context caveat and uses immutable
recorder receipts for initial-context evidence.

This completes the finite authorized attempt and independent review, not full
storage/concurrency qualification. Safari supervision/mechanisms, defensive-size
contention and actual application integration remain open. Next: scoped diagnosis
of Safari driver ownership/readiness or explicit gate disposition, before another
finite supervisor attempt. No automatic new execution, B-4 waiver or production
implementation is authorized. Suggested commit:
`test: qualify bounded Chrome storage concurrency safety`.
