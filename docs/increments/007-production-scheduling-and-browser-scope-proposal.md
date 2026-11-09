# Increment 007 — production scheduling and browser qualification scope

**Proposed for user review — 9 November 2026. Not agreed or implemented.**
Baseline: clean `721d95e4470f42916c04a1bf62ca0bd5c90d95e3`. This closes the
remaining *recommendation* work, not qualification or final contract agreement.
Keep P-1–P-4, S-1–S-6, F-1–F-5, AC-1–24 and Draft / Not started unchanged.

## Recommended decisions

| Choice | Recommendation for approval | Material alternative / cost |
| --- | --- | --- |
| B-1 — execution placement | One dedicated module worker per browser tab hosts coarse application operations, native IDB and Web Locks adapters, codec/admission and bounded derived inspection. Renderer keeps raw editor/form sessions and presentation. | Codec-only worker leaves candidate construction, retained validation, IDB cloning and catalogue/derived work on the renderer. Chunking all that work there adds yielding/cancellation complexity; the existing maximum synchronous failure rules out accepting the current path unchanged. |
| B-2 — boundary and recovery | Narrow typed asynchronous application calls/results; one mutation attempt at a time, session-only cancellation/dispatch fencing and same-attempt reconciliation. No durable journal, automatic replay or synchronous fallback. Worker availability becomes an additional required capability, subject to approval here; S-5 alone did not select it. | Main-thread ownership/write coordination plus compute worker is viable but adds cross-context handoff of entire candidates and another ownership/dispatch race boundary. |
| B-3 — first browser scope | Both native desktop Chrome and Safari on macOS, normal persistent profiles, top-level HTTPS, on the exact qualified builds. Loopback is a separate development target. No private-mode retention support promise. | Chrome-only release is smaller but changes the agreed two-engine target; do not silently defer Safari. Wider OS/browser or installed-PWA scope requires separate evidence. |
| B-4 — readiness gates | A bounded pre-implementation worker/host mechanism followup, then final contract/design agreement and implementation authorization, then Stage B product acceptance in both engines. | Deferring every mechanism uncertainty to implementation risks discovering that the selected placement cannot meet the preserved scope. Product acceptance cannot run before the product exists. |
| B-5 — performance/qualification verdict | Keep agreed input/work limits and timing targets; qualify all significant renderer costs as well as worker work. A failed target returns evidence/options, not smaller fixtures or rounded values. | Lower caps or relaxed responsiveness are substantive revised agreements, not routine implementation fixes. |

## Evidence and rationale

The [Stage A report](../../output/increment-007-stage-a/report.md) and
[independent review](../../output/increment-007-stage-a/independent-review.md)
qualify stated subsets only. Maximum synchronous codec work reached 190–229 ms,
failing the 100 ms main-thread target. Final Chrome worker samples preserved
exactness, observed no main-thread long tasks and measured encode/decode p95
140.6/100.0 ms. This is feasibility evidence for a codec worker, **not** evidence
for the broader B-1 placement, cold startup, Safari worker behavior or full UI latency.

Official platform sources checked 9 November 2026: workers execute independently
of UI scripts and have startup/memory costs; use one long-lived worker rather than
one per field/token/job. Termination can discard execution/messages, so it cannot
serve as an acknowledgement. [HTML workers](https://html.spec.whatwg.org/multipage/workers.html)
IDB and Web Locks are exposed in workers; Web Locks requires a secure context.
These specifications establish API contracts, not tested builds or physical durability.
[IndexedDB](https://www.w3.org/TR/IndexedDB/),
[Web Locks](https://www.w3.org/TR/web-locks/)

### B-1 placement and single authority

| Responsibility | Proposed location / required boundary |
| --- | --- |
| React, owned controls, focus, raw drafts/forms, selected view/scale and immediate input display | Renderer. Preserve original inspector/list behavior, AC-18/20 fallbacks and error associations. Raw input survives worker failure while this page survives. No full-project validation or serialization during render/keystrokes. |
| Application reads | Worker reads one coherent loaded revision and produces detached display/inspection results tagged with project/revision/request identity. Reads do not mutate retained state or consume a draft. Old responses cannot replace another selection/project or newer draft view. |
| Parsing, duplicate-aware strict decoding, exact encoding, whole-candidate admission, canonical validation | Worker, outside the acceptance transaction. Transfer bounded incoming bytes where useful; keep exact strings/IDs/absence/order and all agreed budgets. No unsafe evaluation as admission. |
| Derived resolution, alias/AST work, diagnostic reporting, costly view conversion | Worker using the existing pure domain functions with agreed guards. Cheap single-field UI calculations may remain only when qualified under the same blocking-task target; this is not permission to leave whole-graph work in the renderer. |
| Candidate construction and command coordination | Worker application operation, against explicit loaded baseline plus exact submitted input; accepted before/after remain available at application boundary. Renderer does not rebuild semantics. |
| Native IDB reads/writes, revision/absence/capacity/protection checks, latest-command metadata | Worker infrastructure adapter. One retained authoritative database; worker loaded snapshot is a revisioned read view, not a second writable source. |
| Per-project exclusive ownership and lifecycle revalidation | Worker Web Locks adapter, scoped to exact project identity. Renderer reflects explicit ownership/pending states and reports lifecycle transitions. Ordinary backgrounding keeps ownership; no TTL/forced takeover. Revalidation gates resumed writes. |
| Native file selection/download gesture, browser departure prompts | Renderer host adapter; worker supplies/consumes exact bounded backup bytes. No filesystem source-of-truth change or server upload. |

Worker APIs remain delivery/infrastructure code around host-independent application
operations and domain functions. Keep one package and focused named operations;
no generic RPC framework, worker pool, event bus, registry, shared mutable memory,
service worker or new state-management dependency. A later Electron host can call
the same operations with its filesystem adapter without adopting this browser topology.

**Catalogue:** scan the same project records using a worker-side readonly cursor,
validate each record and derive bounded identity/name/count/status rows there. Keep
only the current record and summaries while scanning; do not `getAll` 25 maximum
snapshots into renderer memory. Return the completed catalogue view after its read
transaction completes; no separately synchronized summary store. Unsupported records
remain visible as unavailable and count toward capacity. This read transaction may
span cursor requests, but must not await external work; row derivation uses bounded
synchronous worker code. Measure its contention with writers. If a whole-catalogue
snapshot proves too costly, return a measured revision to this proposal rather than
silently introducing stale authoritative summaries or dropping records.

Only requested UI data crosses to the renderer: catalogue rows, current selection,
inspection/trace data, command status and bounded backup bytes. Do not repeatedly
clone a whole project per keystroke or render all raw JSON/all tokens eagerly.
Structured cloning still has costs, and ordinary objects are copied rather than
magically zero-copy. [HTML structured data](https://html.spec.whatwg.org/dev/structured-data.html)
Qualify startup, messaging/transfer, actual IDB cloning, renderer row construction,
large exact strings/raw details and DOM/React commits. Every admitted value remains
fully inspectable/selectable; lazy rendering cannot truncate source or hide records.
If meeting the target needs a materially new paging/detail interaction, return that
bounded change for user/designer review; do not silently alter AC-20/24.

### B-2 command and failure protocol

Use a small fixed set of typed application calls with validated message shapes,
request/attempt ID, project/kind identity and revision; responses have explicit
known-rejected, retained, retained/read-unavailable or unknown outcomes. Permit one
active mutation; coalesce obsolete passive reads instead of accumulating a queue.
A read response cannot acknowledge a write. No candidate/draft pending queue is durable.
Before posting a mutation, the renderer records its exact attempt/result IDs, project,
expected baseline revision, replacement protection/acknowledgement identity and raw
input correlation in its live session. Worker death cannot erase those facts or
turn a potentially submitted attempt into a fresh submission.

Prepare and validate outside IDB; immediately before dispatch confirm current
ownership/session eligibility, then use a short atomic transaction to recheck expected
revision/absence, database incarnation, replacement protection and project capacity.
Write candidate/revision/latest-command result together. No worker call, dialog,
lock wait or expensive domain computation inside that transaction. Request success
is not acceptance; transaction `complete` is the agreed strict-hint boundary.
[IDB transaction lifecycle](https://www.w3.org/TR/IndexedDB/#transaction-lifetime)

Cancellation must be processed by the worker that can issue writes: confirm no
future dispatch for that attempt, and fence late publications before safe departure.
A renderer-only cancelled flag or ignored response is insufficient. Once issued,
retain exact attempt facts and apply S-4's serialized read/proof rules; uncertain
submission is not safely retried. A check response is evidence for the same attempt,
not permission to dispatch a replacement command. Complete a form once only.

Startup/worker failure before any command was sent is unavailable/known unsubmitted.
Failure after a call was sent but before a provable dispatch verdict is **unknown**,
even if the renderer never received “dispatched”. A confirmed abort is rejected;
a confirmed commit followed by failed publication/read is retained plus stale or
unavailable. Keep raw input, block affected writes, and offer reachable Check/Stay/
guarded departure under AC-23. Worker restart may reopen/read and reconcile available
session evidence; never replay the input. Missing command evidence remains unknown.
Lost fencing knowledge cannot authorize unsafe departure/publication. A newly started
worker must first reacquire ownership and establish the S-4 dispatch-stop/transaction-
ordering proof before an unchanged/absent record can establish rejection; absence
alone is unknown. Qualify worker-death, lock reacquisition, late results and missing
metadata explicitly; there is no alternate readonly-worker saving mode. Reload reads
latest retained state with no fabricated verdict; session inputs are not recoverable
from a journal. Termination is not rollback or proof that an issued write failed.

Fail closed if worker startup, messaging validation or required storage/lock features
fail. No heavy synchronous fallback, relaxed durability or session-only saving badge.
Known retained data is never presented as an empty project merely because reads fail.
Existing V3 unavailable/recovery states supply the intended interaction; genuinely
new failure interactions return for bounded design review if implementation reveals one.

## B-3 exact first-host qualification policy

Recommend native **Chrome and Safari on macOS**, normal persistent nonprivate profiles,
without extensions, one top-level deployed HTTPS origin; also verify loopback development
separately. Start followups on the recorded Stage A machine/builds: Mac15,6 M3 Pro,
36 GiB, macOS 27.2 (26B123), Chrome 156.0.8078.80 and Safari 27.2
(WebDriver 22625.2.8.11.9). These are observed candidate builds, **not qualified
support floors or claims of today's latest versions**. Capture exact current installed
build/OS/hardware again; if changed, qualify the actual build instead. At delivery
publish the two exact passing build/OS combinations, not “version X and later”.
Requalify critical storage/worker/ownership/recovery smoke cases on browser updates;
failed smoke suspends the new build's qualified claim pending investigation.

Required capabilities: worker module load under deployed CSP, native IDB with requested
strict durability, worker Web Locks, exact codec/transfer, native file input and Blob
backup download. Do not infer these from UA strings. Secure loopback trust and HTTPS
are distinct deployment cases; a different origin has different local data and must
use explicit backup/restore transfer. [Secure Contexts](https://www.w3.org/TR/secure-contexts/)
Storage persistence permission remains best effort under S-5; denial is not a claim
of write failure or permanent safety. No universal crash/eviction/power-loss guarantee.

Private/incognito contexts, other browsers/OSes, mobile, `file:` origins, embedded frames,
installed/standalone PWA, offline/install acceptance and Electron remain outside this
initial supported retention scope. Do not detect private mode through fingerprinting;
state the normal-profile scope visibly in documentation, use runtime capabilities,
and fail honestly on actual denial. Native browser close/reload prompts are best effort,
not reliable final saving or draft persistence; no unload flush strategy.
[HTML document unloading](https://html.spec.whatwg.org/multipage/browsing-the-web.html#unloading-documents)

## B-4 gates and B-5 acceptance evidence

| Gate | Concrete required evidence / stop rule |
| --- | --- |
| Before production authorization: separately authorized bounded Stage A followup | In both actual engines: worker module/CSP startup, IDB strict-complete/abort and locks in selected placement; exact opaque/surrogate/value transfer; before-dispatch cancellation and issued-write unknown/check ordering; cursor summary/no renderer full-catalogue transfer; cold and maximum worker transfer/renderer blocking measurements. Native normal Safari retain→close browser→reopen same profile/origin; native file picker select/cancel and download bytes; deployed HTTPS plus loopback. Do not attach/reload the user's dirty tab. |
| Lifecycle mechanism gate | Actual tab background, hide/resume and navigation/bfcache where available, owner close/crash and new acquisition in both normal browsers. Record actual events and missing events; injected lifecycle callbacks alone do not qualify freezing. Confirm no forced takeover or late stale acceptance. Revalidate ownership/revision on resume before writes. If an event cannot be induced, state the unqualified path and return a bounded support/gate choice; no universal lifecycle claim. |
| Final agreement gate | User selects B-1–B-5 and reviews resulting evidence/gaps and identified Draft/design. Final contract agreement and explicit implementation authorization remain separate. No product tests required before product exists. |
| Stage B after authorization | Actual application AC-1–24 in both engines: real command/transaction/readback, unknown/dialog/departure fencing, ownership/revision/create/restore/protection races, capacity, reset/upgrade, source-preserving refusal, exact independent-origin backup restore and all-content opaque IDs. Preserve full inspector/list, truthful fallbacks and candidate-error association; actual keyboard/responsive/200% zoom evidence. Fresh independent reviewer checks a stable snapshot. |
| Performance/resource gate | Agreed 100-token typical / 1,000-token exceptional-large command p95 ≤250/1,000 ms; catalogue and codec typical/large ≤2,000 ms; no main-thread blocking task >100 ms. Include worker startup and renderer/clone/DOM costs separately; Safari absence of Long Tasks API is not a pass—use trace/event-loop instrumentation and interaction evidence. Warm-up +20 runs, cold samples separate; preserve fixture hashes and all samples. |
| Defensive stress gate | Unchanged 10,000-token/2,000-group and all intersecting byte/lexical/AST/Decimal limits; 25×8 MiB catalogue is up to 200 MiB serialized source, not typical work. Whole accepted boundaries must round-trip own decoder; unsupported intersections reject correctly. External 30 s per-case harness watchdog remains a safety stop, not a product SLA. Expiry is failed/inconclusive and stops escalation; no caps silently lowered. |

Normal Safari restart/native-event checks require a disposable **nonprivate**
profile/environment, isolated from user work. If available automation cannot isolate
a real normal-browser restart or native event, use a user-assisted scoped step or
record the tooling gap before acceptance; automation-session results are not a
substitute. Never close/kill shared Safari or all user windows. The external stress
supervisor may terminate only its own disposable worker/harness, never a shared
Safari host. No experiments are authorized by this clarification.

Failure/quota/reset branches may use deterministic injection with explicit labels;
real OS picker, restart and lifecycle claims need actual native evidence. Process
kill after commit is not OS crash/power-loss qualification. No new experiments,
implementation, browser sessions or benchmarks were performed for this proposal.
If Safari or an admitted maximum fails, report the concrete gap and choices; recommend
fix/requalification before claiming both engines, rather than quietly releasing Chrome-only.

Routine implementation may choose helper names, message unions and existing-component
integration within these boundaries. Splitting authority, changing recovery guarantees,
durable journaling, weakening budgets/support targets or material new UI requires
explicit review. This proposal introduces no new authored format or domain semantics.
