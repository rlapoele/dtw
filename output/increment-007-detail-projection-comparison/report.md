# Exact-detail / read-projection comparison — first risk gate

**Failed first candidate; stopped for coordinator review. 10 November 2026.**
Baseline `30abbf0` on `dev`. This is isolated feasibility evidence, not Increment 007
implementation, production acceptance or independent review. Existing list/inspector
source and historical research/evidence were unchanged. Authoritative source archive:
[attempt-1-source](attempt-1-source/); [executed result](chrome-attempt-1.json).

## Outcome

The uniform no-wrap, internally bounded `<pre>` still exceeded the **100 ms** gate on
the same valid font-family fixture. During separately traced disclosure opening,
worker transfer/renderer assembly/mount/paint, Chrome CrRendererMain recorded:

| Event | Duration |
| --- | ---: |
| RunTask | **120.547 ms** |
| ThreadControllerImpl::RunTask | 120.518 ms |
| Layout | **110.780 ms** |

[Failing trace](C03-raw-open-transfer-mount-paint-trace.json): pid **18320**, tid
**224750**; Layout timestamp **11894763970 µs**, duration **110780 µs**. The task
wrappers overlap the same work and must not be summed. Trace units are microseconds;
reported durations divide by 1,000. No geometry request, DOM Range or native selection
was included in this period. The failure happens before the later source-equality,
keyboard, Find/copy and geometry periods. It does not isolate which internal opening,
assembly or layout step accounts for every millisecond.

No textarea, larger fixture, 20-sample scale qualification, Safari stress or retry of
this failure ran. Conditional textarea is the next coordinator decision. Viewport
bounds alone have not made complete text layout responsive below the agreed target.

## Fixture identity and integrity

The raw fixture reuses frozen `makeFixture('raw')`: **63** named font families of
**65,536** UTF-16 code units. Frozen semantic/preflight guards accepted it. Pretty
text is **4,134,504** units. Canonical snapshot SHA-256:
`6954761d7b16185e96c5cb0abcbf9c3eb52f6cf6a5e0946aeba88b0b434d5d74`.
Expected pretty raw SHA-256:
`b7b6c3ea2c4bf426e52144643a6e556d1312015ed49efecee218d70f6660e56e`.

The load result's fixture kind/count/raw-unit identity, one mounted row/one row render,
complete inspector presence, and no eager raw node were asserted before opening. The
worker uses the full admitted authored entity and exact pretty serialization; no
source truncation/rounding or new cap. The raw row is **144** compact UTF-8 bytes:
`literal`/fontFamily summary with no families payload. The inspector has no project
arrays and carries no font-family definition. Raw frames were ≤8,192 units; largest
measured frame object **8,413 encoded bytes** (outer `{id,value}` wrapper adds fewer
than 40 bytes for these bounded numeric request handles, remaining below 32 KiB).
Full renderer raw equality was scheduled after opening and **not reached** after the
failure; it must not be claimed as a positive large-surface integrity result.

## Repaired instrumentation

[Trace tests](trace-tests.txt) regress against the historical **191.793 ms Layout**
and require failure despite absent RunTask. Missing renderer-main metadata or whole-task
evidence produces **inconclusive**, never pass. Only exact renderer-main pid/tid events
can determine a verdict. The new trace categories include `toplevel` and capture actual
RunTask plus ThreadControllerImpl whole-task events. Each actual browser operation gets
its own trace and external 30-second watchdog. No timeout fired. Empty DOM, count
mismatch, missing controls or React/page errors are invalid, never passing timings.
The observed page reported no page/React errors.

Periods are separately marked: row preparation/transfer/mount/paint; selected editor
mount/paint; raw disclosure/transfer/mount/paint; source equality without geometry;
actual native keyboard selection; later geometry observation. Preparation/transfer
and mount have renderer event markers, but are not independent causal timing claims.
No trace absence is repaired by consulting only empty Long Tasks arrays.

## Limited control observations

Chrome **157.0.8103.50**, macOS/Node details, own disposable profile and origin are in
the result. Production-built React/owned controls, viewport 1440×1000 CSS px. One
observation per risk control, **not** workload p95 or 20-sample qualification.

| Control | Observed result |
| --- | --- |
| 100 ordinary color rows | 100 mounted / 100 row renders; longest mount whole task 73.704 ms. Editor and raw opening stayed below 100 ms in recorded intervals. Raw full-source equality passed: 572 units. |
| Admitted long row/color input | 1 mounted / 1 render; 135,453-byte logical row transported in bounded frames, not an oversized-record bypass. Mount task 12.544 ms. Raw equality passed: 135,690 units. |
| Ordinary raw geometry | 331px viewport width, 500px bounded height, 397px source scroll width; surrounding document had no horizontal overflow. |
| Long raw geometry | 331px viewport width, 500px height, 434,142px source scroll width; no surrounding page horizontal overflow. This is an accessibility tradeoff, not a reflow compliance claim. |
| Native keyboard selection | Actual Meta+A after pre focus selected document scope: 13,777 vs 572 source units; 407,149 vs 135,690. It does not establish local source Select All or copy. Clipboard untouched. |

## Projection and fidelity boundaries

[Source README](../../research/increment-007-detail-projection-comparison/README.md),
[provenance](../../research/increment-007-detail-projection-comparison/provenance.json)
and [editor diff](editor-projection.diff) describe reused production components and
explicit adaptations. No fake partial ProjectReadback or synthetic path/resolution
success crosses the boundary. Real domain/application semantics drive the tested
literal rows, eligibility, namespace labels and inspection. Exact text uses numeric
session-only handles and bounded JSON-escaped UTF-16 frames; split surrogate/lone
surrogate and long ID tests pass. Logical entities mount only after complete assembly.

This is **not a qualified complete P-R1–5 boundary**:

- Navigation/parent/native-choice/All-content UI and full cross-kind identity behavior
  are not implemented/qualified; only worker DTO preparation exists.
- Selected-editor DTO still includes all applicable reference choices in its framed
  assembly; full native options at maximum scale remain unmeasured.
- Literal/reference resolution uses the real domain. Expressions/composites are
  explicitly unavailable under this limited harness guard. Real F-5 arithmetic/derived
  output budgets, DAGs, diagnostics and heavy trace maximum remain unqualified.
- Live project/result/selection/request checks surround awaits/assembly/mount, but
  immediate event-time draft mode/view/scale invalidation, delayed old-response tests,
  replaced worker/revision/project tests and cache/DOM lifetime checks remain incomplete.
  Rapid same-surface replacement does not yet enforce one outstanding request.
- Memoized immutable row blocks avoid rerendering old rows when appending, but copied
  rows do not currently show selected styling. No production baseline parity claim.
- Actual field editing/sliders/five-view/two-scale/recovery/draft/keyboard regression
  suite was not reached. Existing control code is retained, not qualified by retention.

## Coverage disposition and cleanup

**Fail:** uniform nowrap pre exact-detail opening on admitted raw counterexample.
**Limited observed controls:** ordinary/long row mounting, complete ordinary/long raw
text equality, document-scope keyboard selection, later geometry, current frame sizes.
**Inconclusive/unqualified:** whole candidate/read boundary/native local source selection,
full inspector parity, races/lifetime, performance distribution.
**Not run:** conditional textarea; clipboard; Find; AT; 320px/actual 200% zoom; 1,000/
10,000 tokens and 2,000 groups; Safari defensive stress (supervision gap preserved).

The first sandbox-denied loopback launch is preserved in
[launch-failure-1.json](launch-failure-1.json). It started no browser. Approved escalation
then ran the same source. Only the own disposable Chrome process/profile/server were
used and terminated; existing user tabs, clipboard, browser/OS settings and trust were
untouched. No shared Safari quit/kill, tunnel, HTTPS or storage experiment.

Suggested human-owned commit: `research: compare bounded exact-detail rendering`.
