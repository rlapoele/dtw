# G-01 rendering qualification — frozen developer result

**10 November 2026 · negative raw-detail result; partial harness; independent review pending.**
Baseline: `dev` at `227e17a`. Authorization was isolated G-01 qualification of the approved
bounded-rendering direction while preserving the list and inspector; production
Increment 007, prototype edits and G-02–06 were not authorized. This report does not
close G-01 or establish complete browser/list/inspector qualification.

## Result and stopping point

A complete, admitted single-record raw-detail path incurred **191.793 ms Layout**
on Chrome's **CrRendererMain**, versus the unchanged 100 ms blocking-work gate.
The event consumed **190.465 ms thread CPU**. The trace identifies renderer pid
13625 / tid 154499, timestamp 6910761723 µs. CDP cumulative LayoutDuration increased
**192.521 ms** across the raw gate, independently consistent with that event.
See [native trace](chrome-attempt-3-raw-trace.json),
[executed result](chrome-results-attempt-3.json) and
[extracted evidence](source-checks-and-summary.json).

The sequence was: load one row → select its inspector → click the existing
“All authored data” summary → wait for the complete raw `<pre>` → use a native DOM
Range/Selection to select its entire contents, read selection text, hash it and read
the text geometry. Tracing covers that whole sequence. The long layout occurs about
7 ms after the logged raw commit. There are no separate start/end markers around
summary opening versus selection/geometry; **the evidence localizes the combined
open/complete-selection path, not the exact individual forcing call**. This was
DOM Range/Selection, not a native browser Find or keyboard Select All test.

The displayed text is **4,134,504 UTF-16 code units**, identical to the complete native
selection, SHA-256 `b7b6c3ea2c4bf426e52144643a6e556d1312015ed49efecee218d70f6660e56e`.
An independent source check regenerates and hashes the full expected `JSON.stringify`
text, including both boundaries. No ellipsis, source cap, syntax-highlighting tree,
textarea, pagination or changed raw UI was introduced. The `<pre>` had a computed
height of 1,487,885.875 CSS px at a 331 px width. That is evidence of the monolithic
wrapped-text cost, not a proposed fixed height or new admission limit.

The fixture has one font-family token with **63 named families of 65,536 units each**
(256 families remain permitted), accepted by the frozen semantic and preallocation
guards: 4,129,783 aggregate string units, 4,130,779 snapshot bytes, 211 values,
733 lexical tokens and maximum depth 10. It remains below the unchanged 4,194,304
aggregate-unit and 8,388,608 snapshot-byte limits. It is a near-aggregate-boundary
single-record counterexample, not a proof that every possible maximum was enumerated.
Fixture hashes/counts are in [fixtures](fixtures.json); the frozen Stage A codec and
fixture helpers were imported read only.

**No larger run, repetition of the failing raw case, Safari stress or redesign followed.**
This result does not prove ordinary-row staged mounting is impossible, does not
justify list paging/windowing, and is not a complete implementation test of the
approved candidate. The raw-detail bottleneck needs a bounded proposal/requalification
before acceptance; this experiment makes no replacement interaction decision.

## Executed observations

| Case | Evidence and disposition |
| --- | --- |
| R00 cold | Separate cold navigation record, exact Chrome/version/viewport/UA/navigation timing retained. Not mixed into warm samples. |
| R02 100 tokens | Warm-up plus 20 observations, each with exactly 100 actual DOM token buttons and exactly one render per row during background append; no scrolling required. Five bounded batches (24/24/24/24/4). Completion p95 **98.0 ms**, maximum **98.0 ms**. These are synthetic small-list mounting observations, not accepted-command or whole-app latency claims. |
| R01 row fidelity | First complete row `outerHTML` equals the unchanged production `TokenList` control byte for byte after choosing the same token. One heading per list. Same swatch, description, type/layer, exact named components/alpha and native button semantics. |
| R01 small inspector | Five view options, two RGB scales, eight inputs including illustrative sliders, full current metadata/footer, trace/diagnostic tab and exact raw text present. Draft Red `0.25` survives reference→literal, injected failed Apply, trace-tab return and raw opening; raw remains applied `0.2`. Typing rerenders **zero list rows** (300→300). The injected Apply failure retains draft and focuses its alert. These are synthetic selected-literal checks, not application mutation acceptance. |
| R03 single long row | One row, 65,536-unit name and description plus 4,096-digit Decimal; exact admitted source, 266,617-byte intact row message. One observation: row completion 25.6 ms, maximum traced Layout 6.172 ms. Not a workload/p95 pass or largest-inspector-input pass. |
| R03 complete raw | One observation; exact source/selection verified; 191.793 ms main-thread Layout fails gate. Initial raw row message itself contains 4,130,780 bytes, exposing the projection gap described below. |

The small inspector test uses the existing `ColorFields`, shared controls, Base UI
Tabs, native selects, AuthoredValue and Swatch unchanged. It verifies option presence,
not every conversion/slider operation, passive view behavior or all failure branches.
The copied Editor retains the existing “No description”, inspection-only notice,
metadata, regeneration footer, errors and action markup; source assertions and the
[precise scheduling diff](editor-scheduling-boundary.diff) identify that preservation.
No broad inspector fidelity or accessibility pass follows from those markers.

## What was implemented versus still missing

| Boundary | Actual isolated behavior / limit |
| --- | --- |
| Real row | Exact extracted token `<button>` markup. Injected worker-computed coherent label; swatch computed in memoized row. Owned components imported unchanged. `Row` has an experiment-only untyped prop boundary. |
| Mounting | Worker returns at most 24 rows / nominal 32 KiB encoded JSON, one outstanding batch; oversized single rows travel intact alone. `flushSync` commits each batch then rAF+timer yields; memoized prior rows are not rerendered as batches append. Arrays/React reconciliation still grow. |
| Containment | Native `content-visibility:auto; contain-intrinsic-size:auto 100px` on each ordinary button, an intrinsic estimate rather than clipped/fixed height. Isolated shell CSS supplies two scrollable panes. Scroll anchoring/width/zoom behavior is unqualified. |
| Coherence/search | Worker computes labels and path-string membership before row batches, with project/revision/generation/worker-tag context checked by renderer. No stale-response test executed. No actual group/revision/worker replacement or selected-outside-list flow implemented. |
| Projections | **Incomplete candidate boundary.** Row batches carry whole authored tokens rather than only existing display fields. `inspect` returns the complete synthetic selected inspection plus full readback project, not bounded choices/projections. No 10,000-record canonical-clone efficiency claim is justified. |
| Inspector | Copy changes only memoized labels/reference choices and on-toggle worker raw string, preserving renderer-owned draft state. Selected inspection and synthetic resolution are supplied immediately; raw serialization is deferred. Heavy resolved/trace preparation is **not** independently staged. |
| Domain fidelity | Worker fixture paths/resolution are synthetic. Direct single literal resolution is adequate for executed literal checks; aliases, diagnostics, missing/cyclic identities, empty IDs/groups, namespace repair and reference previews are **not qualified**. The test adapter must not become application semantics. |
| Navigation | Real production `ProjectNavigation`/2,000 groups, native choice preparation, All content and complete malformed-identity reachability are **not implemented/tested** here. |

Consequently this is a negative raw-path experiment plus small React controls, **not
an otherwise complete bounded-renderer candidate that only needs a faster raw panel**.

## Instrument limits and environment

Native Google Chrome **157.0.8103.50**, macOS **27.2 (26B123)**, Mac15,6 with
38,654,705,664 bytes memory; normal disposable persistent profiles, no attached user
context. Viewport 1440×1000 CSS px, devicePixelRatio 2. No browser zoom command was
issued (default profile zoom); actual 200% browser zoom was **not tested**. Loopback
origins and exact profile/PID are retained per result. Production React 19.3.1/Vite
8.3.5 build, no HMR/StrictMode; dependencies/config/application remained unchanged.

The production React Profiler provides no callbacks here, so internal React
commit/actualDuration is unavailable. Per-batch roundtrip+`flushSync` envelope includes
worker dispatch/return/clone and React work; it does **not isolate cloning** or establish
layout/paint cost. CDP traces retain actual Layout, UpdateLayoutTree and Paint events;
aggregate metrics are cumulative counters and include GC/detached nodes. JS heap is
an observation, not peak or whole-process memory. The raw gate ends with roughly
58.6 MB CDP JSHeapUsedSize and 393 CDP nodes (including retained/detached accounting),
not a maximum-list footprint or memory guarantee.

Long Tasks arrays and captured `RunTask` arrays are empty even for the observed
191.793 ms main-thread layout. Those APIs/categories therefore **cannot establish a
passing task bound** in this setup. The runner's automatic gate originally checked
only LongTask/RunTask; the source-summary assertion and manual native-trace inspection
caught the Layout failure before any escalation. No full trace/React/clone breakdown
or Safari event-loop equivalence claim is made. Requalification must strengthen the
whole-task instrumentation as well as address the detail cost.

## Invalid attempts, safety and unexecuted work

All source, logs and invalid results remain available:

- Initial fixture preparation retained numeric definitions on 10,000 records, exceeding
  the unchanged lexical intersection (500,010 observed / 500,000 limit). It was rejected
  before browser work; reconstructed exact initial generator is labelled accordingly.
  The valid name-only entity fixture is generated/guarded but **not browser-run**.
- Build logs 1–4 are retained. The first runtime command hit sandbox loopback EPERM
  before browser launch (`run-attempt-1.log`). The authorized retry used a loopback
  server and its own Chrome process only.
- `chrome-results-attempt-1.json` and `attempt-1-source/`: copied row omitted its local
  value declaration. React unmounted. **All zero-DOM samples INVALID**; the subsequent
  fidelity wait expired at 30 seconds and the external watchdog SIGKILLed only owned
  Chrome pid13221. This is a harness defect/watchdog observation, not a candidate fail.
- `chrome-results-attempt-2.json` and `attempt-2-source/`: restored row; valid exact row
  comparison, but unstable preview props repeated prefix rendering. Its timings are
  **not bounded-candidate evidence**. A harness assertion confused nested `mounted`
  result with a count and stopped before trace export. No candidate conclusion used it.
- `chrome-results-attempt-3.json` and `attempt-3-source/`: corrected memoization,
  mounted-count checks and source identity; this owns the actual raw counterexample.
  `chrome-small-functional.json` owns the later small-only state checks. Every operation
  had a separate external 30-second own-process watchdog; no expiry in these runs.

**NOT RUN:** 1,000-token and 10,000-token+2,000-group browser cases; full DOM/text/memory
and repeated activation/reflow at maximum; expanded long trace; worst color inspector
input; stale query/project/revision/worker rejection; selected-outside-filter reveal;
native keyboard boundary traversal; native browser Find; rapid/deep scroll and anchoring;
Description breakpoint changes; actual 200% browser zoom; AT reading. No AT tooling
was exercised; accessibility remains a gap, not a source-markup pass.

**Safari: all cases NOT RUN**, including safe small cases, because the Chrome risk
failure stopped escalation. Safari defensive stress was additionally barred by the
unproven external preemption path while WebDriver is pending. No G-02 probe, native
file/lifecycle/storage/HTTPS work, public tunnel, trust-setting change or shared
browser intervention occurred. Earlier worker/HTTPS evidence remains frozen.

Cleanup independently checked all four own loopback ports as ECONNREFUSED and all
four owned Chrome PIDs absent, using an authorized unsandboxed read-only check;
[cleanup evidence](cleanup.json). Disposable profile/source/log evidence is retained.

## Verification and handoff

Production bundle builds passed; isolated TypeScript check passed;
`check-source.mjs` passed exact extracted row markup, preserved inspector markers,
fixture admissibility/counts, expected raw hash equals browser-selected raw hash,
20 valid mounted/render-count observations, and renderer-main Layout identification.
Scoped whitespace/diff review passed. Production tests were not rerun because no
production files changed. The final manifest freezes the new research/output files
excluding itself and future reviewer files; no independent review has occurred yet.

**Disposition:** fail the tested monolithic exact raw-detail performance path; keep
G-01 incomplete. Return the bottleneck and missing candidate boundaries for review,
without adopting a new raw interaction, list navigation or resource cap. Coordinator
owns policy/status decisions and reviewer handoff. Suggested human-owned commit:
`research: qualify increment 007 rendering limits`.
