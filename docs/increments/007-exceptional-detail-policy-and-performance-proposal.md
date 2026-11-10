# Increment 007 — exceptional exact-detail policy and performance

**E-1–E-4 agreed by the user — 10 November 2026. Not implemented or qualified.**
Baseline: clean `372f3e52355817c4cb06db96c6bf72a25d534c1b`. Preserve the current
list and complete inspector, all authored budgets/identities and Draft / Not started.
After committing this proposal as `e2a3534`, the user agreed E-1–E-4 and authorized
the designer to prepare the layout and notice for user review. The narrow E-3
exception below amends the 100 ms gate; ordinary list/editor/inspector work retains
100 ms. The visible artifact still requires review. No performance experiment,
final contract agreement or Increment 007 implementation was authorized at that stage.
Subsequently the user approved V4 for analyst review, then separately authorized
bounded E-4 execution after `d4b02c7`. The [independently reviewed result](../../output/increment-007-e4-qualification/independent-review.md)
is incomplete: an ordinary long-description list/load failed before source opening;
exceptional/native/Safari gates remain unqualified. The agreed policy is unchanged.

## Four agreed choices

**Subsequent admission amendment — 10 November 2026:** the user limited token
descriptions to [1,024 decoded units under F-4](007-format-decoder-and-resource-proposal.md#token-description-amendment--10-november-2026).
This explicitly changes that field's supported envelope; prior no-budget-change
statements describe their original handoff. E's serialized-source threshold and
100/250 ms task gates are unchanged. Large source can arise from other admitted
fields/collections. The earlier over-limit description case is retired for future
qualification, with its original failure preserved, not retrospectively passed.

| Decision | Agreed direction | Tradeoff / alternative |
| --- | --- | --- |
| E-1 — full-source access | Keep All authored data as on-demand, complete read-only document text in its existing disclosure/pre. Select the tested uniform **no-soft-wrap, bounded two-axis scrolling** layout for the next identified design handoff; short source stays naturally sized. | Current production pre wraps text: no-wrap is a material layout choice, not already adopted. Prefer this limited change over a textarea because it retains document-text semantics; the two observations do not prove it faster. A textarea has clearer local Select All in small controls but is not a qualified fallback. No third viewer, paging, source clipping or file-only replacement. |
| E-2 — explicit exceptional class | Only an explicitly opened **applied authored/identity source disclosure**, whose complete pretty text exceeds **65,536 UTF-16 code units**, may use E-3. All source remains available up to the existing admitted envelope. | This is an agreed presentation/performance policy boundary, not F-4 admission. Retaining strict 100 for every detail is coherent, but requires a separately chosen, bounded further investigation/material alternative; neither tested large opening currently meets it. |
| E-3 — bounded allowance | For that class only, use **maximum individual target-renderer task ≤250 ms**, and **end-to-end action completion ≤5,000 ms**, with exactness/native access still mandatory. Everywhere else remains ≤100 ms. | A consciously invoked exceptional source action may briefly pause the view. These are agreed UX budgets, not empirical safe limits or passes inferred from 120/128 ms. If either ceiling fails, return the evidence; do not raise it or exclude admitted source silently. |
| E-4 — convergence and gates | With E-1–3 agreed, obtain a bounded designer/user review of the layout/notice, then separately authorize focused both-engine qualification of the selected path and remaining critical projection mechanisms. Actual full app acceptance stays Stage B. | Policy agreement can end open-ended viewer comparison; it cannot turn unrun selection/Find/AT/Safari or projection tests into passing evidence. Final contract agreement/implementation authorization remain separate gates. |

## Evidence and confidence

The [comparison summary](../../output/increment-007-detail-projection-comparison/comparison-summary.md)
and [independent review/R1 recheck](../../output/increment-007-detail-projection-comparison/independent-review.md)
accept two **negative first observations** for the admitted 4,134,504-unit source:
no-wrap pre **120.547 ms** whole task / 110.780 ms Layout; textarea **128.683 ms** /
119.338 ms. Layout is nested inside the task, not an additional duration to sum.
Both failed the then-current 100 ms gate and stopped before large mounted equality,
keyboard selection, copy, Find or geometry phases. No distribution, causal ranking
or revised-gate qualification follows. Preserve those recorded failures unchanged.

The repaired target-renderer coverage defect is independently closed in the
[131-file snapshot](../../output/increment-007-detail-projection-comparison/manifest-r1.json),
SHA-256 `1934c993a4a33834a5553130c270665c232d8216eb4ef9eb7a2b08368ad11796`.
Thirty non-navigation saved verdicts remain unchanged; two navigation intervals are
inconclusive. This is evidence review, not a new experiment or implementation review.

## Why these numbers

65,536 units deliberately separates unusually large read-only source from ordinary
inspection. It numerically matches the defensive single-string limit, but counts
**serialized presentation text**, so it is a separate boundary, not an admission
rule or a claim that one maximum field stays ordinary. The 250 ms ceiling accepts
a limited, deliberately invoked brief pause while keeping the ordinary 100 ms rule
intact. Five seconds bounds the total wait across preparation, transfer and display,
with interim feedback; it does not permit a five-second blocking task. These are
agreed UX tradeoffs, not standards, measured safe values or evidence of passing
capacity. The existing observations establish neither ceiling.

## Exact scope — keep the exception small

Classify by the **actual complete serialized presentation text length**, including
pretty-print whitespace, JSON escapes and quotes. Worker metadata supplies exact
unit count/revision/source identity during requested encoding; never infer size from
token count or raw field length. One 65,536-unit field can exceed the threshold after
escaping/formatting. At exactly 65,536 the ordinary 100 ms rule applies; above it the
agreed exceptional rule applies. No new maximum source length is introduced: all
admitted canonical source remains supported. This creates no eager closed-disclosure
source construction requirement; use a generic pause notice before opening and count
only when the requested source is prepared. Existing F-4/5 remain unchanged.

| Surface/action | Gate under the agreed policy |
| --- | --- |
| List/sidebar/All content/options, search, row swatches, selection and normal inspector/header updates | **100 ms**, regardless of any long name/ID/description/path/value. No source-size exemption for list work or mounting a whole project. |
| Editable strings, component/alpha fields/sliders, passive view/scale changes, literal/reference drafts, Apply/recovery dialogs | **100 ms**; exact editing and command acknowledgement/revision/fencing remain unchanged. A long editable string is not raw-source access. |
| Automatic Resolved/trace tab preparation, previews and diagnostics | **100 ms** with existing derived guards/incomplete-report rules. A costly AST stays exact; no new permission for unbounded evaluation or a blanket tab exception. |
| Explicit opening of an authored/identity source disclosure ≤65,536 serialized units | **100 ms**; complete source still required. |
| Explicit opening of an authored/identity source disclosure >65,536 units | **250 ms maximum task /5 s complete opening**. No automatic open, preload into hidden DOM or extra full-record transport attached to selection. |
| Native full-source selection, copy and Find within that already-open exceptional source | **250 ms maximum task /5 s per deliberately invoked source action**. Qualify selection, actual clipboard equality and beginning/middle/end Find separately. This does not excuse ordinary scrolling, typing, unrelated document interaction or background source reflow. |

Heavy resolved/trace exact-text disclosures are **not** newly covered automatically.
If a separate explicit derived-source disclosure is necessary, bring its identified
scope/interaction for user review rather than calling the existing tab exceptional.
No hidden records, incomplete-source success or reduced list/inspector content follows.

## Timing, feedback and cancellation

For opening, measure from the user's disclosure activation through requested worker
preparation, bounded transfer/assembly, complete text mount and first paint with the
full source available. Report each phase plus wall time; do not hide preparation as
fixture setup. For a native command, measure the actual key/menu activation through
complete selection/clipboard result or Find match/reveal; do not include time the
user spends typing a search query. Record focus/selection scope: a document pre's
Cmd/Ctrl+A may select the document, unlike a textarea; never claim local source
selection solely from a DOM Range hash. Accessibility/Find behavior is an obligation,
not a reason to silently swap controls.

Apply 250 ms to **each whole target-renderer task**, including layout/paint work;
never use an average or sum nested task/Layout. Scope instrumentation to the actual
source-action interval and target frame/process; unrelated UI work retains 100 ms,
and missing/ambiguous coverage is inconclusive. The 5 s maximum is end-to-end, not
p95, not an allowance for one5 s blocking task. Record warm-up plus 20 measured action
samples after safe first-risk checks; report p95/max/all samples but do not replace
these per-task/per-action ceilings with p95. One genuine over-ceiling task stops the
affected case; no repetition is needed merely to prove a failure.

Recommend a short notice associated with the disclosure before activation:
“Opening very large exact source may briefly pause this view.” Show Preparing until
complete, and truthful unavailable/error feedback on failure. No implicit task runs
from opening a token, changing a tab or typing. Keep selection/scroll/focus stable
and all renderer drafts/forms intact; source remains applied and revision-labelled.
Material notice/layout/selection changes need the designer/user workflow before
adoption; the user has authorized preparation of that design artifact for review.

Cancellation can stop queued worker preparation/transfer or discard obsolete replies
before publication, under the agreed live context/identity fences. **The app cannot
preempt an already-running main-thread/native layout, Find, selection or copy action.**
A spinner, Cancel button or timeout cannot make that synchronous work cancellable.
The event loop processes tasks before later task/interaction handling; API scheduling
is not interruption proof. [HTML event-loop model](https://html.spec.whatwg.org/multipage/webappapis.html#event-loop-processing-model)
(checked 10 November 2026). Do not promise Cancel during a renderer pause. After control
returns, safe close/Retry must retain the original source and inputs; never auto-repeat
an expensive request. Native clipboard changes occur only through explicit user copy.
Read cancellation never cancels/acknowledges a mutation; unknown writes keep their
separate recovery/safe-exit contract. Source failure is not retained-data loss.

## Small, finite next gate — only after separate authorization

1. Identify the user-approved layout/notice with a bounded designer handoff/review;
   preserve ordinary row/inspector controls/content. No third viewer is presumed.
2. Separately authorize a focused qualification, reusing exact ordinary, **65,535 /65,536 /65,537** serialized-unit boundary,
   long editable-color control and admitted 4,134,504-unit source fixtures. Include
   escape-heavy/pretty-print size crossing and other relevant admitted intersections;
   the known fixture does not enumerate the largest possible pretty source.
3. In each target native Chrome/Safari build, record exact environment, complete source
   equality/code units, phase-specific actual task coverage, full native selection/copy,
   Find beginning/middle/end, scroll boundaries, focus/exit, actual 200% zoom/compact
   layout and AT read-only reachability. Preserve clipboard only through a separately
   scoped user-approved procedure; this proposal does not itself authorize clipboard
   access or a new clipboard workflow. Do not read unrelated clipboard content.
4. Safari defensive work must wait for qualified same-pending-state external supervision
   or an explicitly approved safe alternative; never kill shared Safari. The external
   **30-second per-case watchdog** remains harness safety only, distinct from the 5 s
   action ceiling. Expiry is failed/inconclusive and stops escalation. No inferred
   Safari pass from Chrome or automation-profile normal-retention claims.
5. Close remaining **pre-authorization** critical read/dispatch/lifetime/contention
   gaps with the bounded cases already identified in the [gap plan](007-qualification-gap-plan.md)
   and [projection assessment](007-read-projection-boundary-assessment.md): whole-message
   bounds, synchronous event-time draft fences, no closed-source construction, live
   worker/revision/selection changes and retained-state safety. Do not launch a broader
   investigation or require all application tests before the application exists.
6. Final contract/design agreement requires the recorded E-policy agreement, identified
   reviewed interaction and a recorded disposition of those mechanism/support gates.
   Stage B then validates actual integrated AC-1–24, list/inspector fidelity, complete
   options/All content, all commands/recovery/error states and both-engine delivery-origin
   behavior after **separate implementation authorization**. Harness success is not Stage B.

The agreed allowance does not establish that Increment 007 is ready. A material
paged/segmented/file-only viewer would change full native access semantics and need
fresh user/design agreement; none is an automatic third experiment. If measured exact
access still fails, return that concrete result without another automatic threshold rise.

The user agreement changes the policy, not the qualification verdicts. Original proposal checks:
current documents/frozen evidence, corrected manifest identity, local links and diff
whitespace. No source/prototype/dependency changes, browser/tests/build run, experiment,
clipboard access or support/performance qualification occurred.
