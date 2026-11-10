# Increment 007 — bounded rendering design assessment

**Direction approved for isolated qualification · 10 November 2026.**
Original assessment baseline: clean `dev` at `448b943`, with assessment-only authority.
Subsequent isolated qualification approval is recorded below; it does not authorize
existing-prototype or application edits. The contract remains Draft; production
implementation is unauthorized.

## Scoped user approval

After committing the HTTPS qualification as `227e17a`, the user approved this
bounded-rendering direction and authorized isolated developer qualification followed
by an independent reviewer, preserving the current list and inspector. Source and
evidence live separately under `research/increment-007-rendering-qualification/`
and `output/increment-007-rendering-qualification/`. Production, prototypes and prior
qualification artifacts stay unchanged. This authorizes the preferred candidate's
bounded evaluation, not paging/windowing, new admission limits, final contract/design
agreement or production Increment 007 implementation. Existing safety gates remain
binding; unavailable Safari defensive supervision is not waived by this approval.

## Preferred direction

First qualify **staged mounting of the existing ordinary rows, with fine-grained
native rendering containment**, while keeping the current list and complete inspector.
Use bounded worker projections and bounded renderer commits together. Prefer
`content-visibility: auto` for already mounted offscreen row subtrees if the actual
engines preserve their native interaction. Do not introduce paging, a virtual grid,
new keyboard conventions or a dependency before testing this smaller change.

This is a performance hypothesis with an explicit stop gate, not a demonstrated fix.
It bounds each return/mount operation and eventually reaches the unchanged admitted
entity ceiling. It **does not provide constant DOM size**: a complete maximum view
can still contain 10,000 token and 2,000 group records, each with several DOM nodes.
Measure final node/text/memory growth and repeated layout as well as initial work.
Splitting a JavaScript loop while leaving one large final layout is insufficient.
If an independent constant-DOM requirement becomes necessary, this direction cannot
meet it; return the measured reason and a material windowing/paging choice to the user.

**Approval scope:** isolated developer qualification and independent review are now
authorized. The original prototype and production remain untouched. Any material new
interaction or fallback returns to the user before analyst review and final
contract/design agreement.

## Evidence and constraints

The [worker report](../../output/increment-007-worker-qualification/report.md) and
[independent recheck](../../output/increment-007-worker-qualification/independent-review.md)
record Chrome long tasks of **170/137 ms** during eager synthetic maximum display,
against the unchanged 100 ms target. Its construction-loop timing omits other browser
costs. This is not React evidence and does not prove staged native rendering fails.
The [revision-2 manifest](../../output/increment-007-worker-qualification/manifest.json)
identifies the frozen harness; its corrected recovery findings are distinct from
the still-open rendering gate. No original evidence was regenerated here.

[B-1–B-5](007-production-scheduling-and-browser-scope-proposal.md) already select a
worker for coarse operations and require bounded projections and renderer qualification.
Keep 100 tokens typical, 1,000 exceptionally large, 10,000/2,000 defensive capacity;
do not lower admission/resource budgets or relax performance/support targets.
Neither new browser support nor a qualified Safari maximum follows from this document.

Read [AGENTS](../../AGENTS.md), [workflow](../workflow/agent-roles.md),
[status](../status/current.md), [vision](../project/vision.md),
[principles](../project/principles.md), [architecture](../project/architecture.md),
[accepted Precision direction](../project/visual-direction.md),
[presentation conventions](../project/presentation-conventions.md),
[Increment 005](005-token-details-and-color-components.md),
[Increment 006](006-integer-rgb-and-identity-presentation.md) and
[Draft AC-1–24](007-local-retention-and-backup.md).
Inspected current [TokenList](../../src/presentation/TokenList.tsx),
[Editor](../../src/presentation/Editor.tsx), [ColorFields](../../src/presentation/ColorFields.tsx),
[App](../../src/presentation/App.tsx), [session](../../src/presentation/session.ts),
[ProjectNavigation](../../src/presentation/ProjectNavigation.tsx) and owned controls.
The current list synchronously inspects every visible row; the group navigation
maps every group; closed raw details still contain eagerly constructed children.
These are concrete integration costs, not permission to simplify their content.

Platform sources checked 10 November 2026: the W3C Working Draft specifies that
`content-visibility: auto` keeps skipped content available to Find, focus, selection
and tab navigation, while warning of size-estimate scroll jumps. That is the intended
mechanism, not exact-build proof. [CSS Containment Level 2](https://www.w3.org/TR/css-contain-2/)
Google's explanation also notes offscreen accessibility-tree presence and forced-layout
pitfalls. Test actual keyboard/assistive-technology behavior rather than adopting
published demo speedups. [content-visibility explanation](https://web.dev/articles/content-visibility)

## Narrow alternatives

| Candidate | Benefit | Material limit / disposition |
| --- | --- | --- |
| Staged ordinary rows plus native containment — preferred first | Retains existing buttons, DOM order, native navigation and complete mounted content; smallest intended visual change. | Eventual full DOM/text/accessibility-tree growth remains. Must demonstrate layout, Find, scrolling, focus and whole-load responsiveness through completion, not merely fast append calls. |
| Staged append alone | Simple and preserves ordinary semantics. | Does not address eventual layout/paint/accessibility costs. Useful control case in qualification, insufficient as the recommended final strategy by itself. |
| Variable-height windowing | Strong bound on mounted row count independent of result count. | Offscreen records are absent from native Find/accessibility traversal. Variable exact text and zoom require measurement/anchors; focused rows need retention and keyboard-boundary handling. A custom focus bridge changes native behavior. Reserve for a demonstrated need and user review. |
| Explicit bounded result pages | Strong DOM bound with ordinary buttons/Tab within each page; predictable reachability through Previous/Next and complete application search. | Adds page navigation to tokens, All content and possibly groups; native Find covers the current page only. Selection/scroll restoration need explicit design. Material fallback if native containment cannot pass; not selected now. |

Do not convert token buttons into an ARIA feed/grid to obtain performance. WAI notes
assistive-technology interoperability difficulties with scroll-triggered dynamic
content; its feed contract concerns articles and different navigation conventions.
[WAI feed guidance](https://www.w3.org/WAI/ARIA/apg/patterns/feed/)
CSS visibility is also not row eviction: do not claim windowing's constant-DOM benefit
for a strategy that retains all rows, or promise full-document native Find for evicted rows.

## What the preferred candidate must actually bound

1. **Worker projection:** compute complete search/group membership and collision-safe
   labels against one coherent loaded revision. Retain the result ordering in the
   worker; return its identity/count/completion state and requested row batches, not
   a complete canonical project or repeated whole-project JSON. Include only existing
   display fields, exact identity, eligibility and requested bounded derived feedback.
   Do not resolve the full project just to paint row swatches.
2. **Return pressure:** permit a bounded number of outstanding passive batches, with
   both row-count and actual encoded/text-size accounting. A row-count-only limit
   misses long paths/descriptions/Decimals. Return each admitted row intact; a large
   single row gets its own batch and separate worst-row qualification, never truncation.
   Exact batch thresholds are measured engineering choices, not new admission limits.
3. **Mount pressure:** commit a bounded batch of unchanged owned rows, yield through
   browser rendering/input opportunities, then request the next. Do not accumulate
   all responses and commit them together. Measure cloning, React reconciliation,
   style/layout/paint, accessibility-tree cost and final activation. A timer or a
   transition label alone does not establish bounded work.
4. **Offscreen rendering:** apply containment at rows or small independently sized
   groups of rows, not the entire always-visible list. Preserve container-based
   Description layout, variable heights, focus rings, selection and authored specimens.
   Size estimates must not become fixed clipped heights. Remember measured heights
   only for the relevant content revision/pane width/zoom; verify anchors on reflow.
5. **Lifetime:** discard obsolete result generations and their row trees/caches rather
   than retaining successive queries/projects indefinitely. Do not duplicate the same
   records in multiple complete token/All content views. The current view can grow
   to the admitted entity maximum; record its measured DOM/text/memory upper footprint.

The small Projects catalogue remains a separate maximum of 25 rows; it does not need
new pagination. The 2,000-group sidebar and the native reference/group choices still
need their own bounded preparation/mount assessment. Do not replace a native select
with a novel picker, hide groups or substitute a same-name target to meet the target.

## Preserve the current workbench and state contract

| Surface | Required preservation / scheduling behavior |
| --- | --- |
| Token rows | Existing swatches, collision-safe names/paths, layer/type, exact named authored components/Alpha or reference summary, Description column/compact preview. Preserve existing role information where it already appears; no invented role column. |
| Navigation and search | Existing path-search and direct group-filter semantics, all matching records, All tokens / All content, root/parent distinction, create/rename/navigation and Clear search. Search covers the full coherent worker view, not the mounted prefix. |
| All content | Every admitted group/token, including unreachable/cyclic/empty groups and empty/whitespace IDs, is eventually reachable by project/kind/exact ID. No tree-only reachability, fabricated path, string sentinel collision or new repair actions. |
| Inspector | All current descriptions, type/layer/eligibility, semantic role/regeneration metadata and footer; full component/alpha controls/sliders, five views, both RGB scales, approximation notes, independent literal/reference drafts, applied/draft context, tabs, trace, diagnostics, raw/identity details and errors. |
| Immediate input | Raw typing/paste and focus stay renderer-owned and responsive. No full-list relabel/resolve/re-render or project serialization per keystroke. Expensive derived responses cannot overwrite a newer draft/view/scale or apply a value. |

Tag every batch/inspection with project, revision, result generation, request and exact
entity context as applicable. Worker replacement also invalidates its old generation.
Responses for old query/group/project/revision must never append to the current list.
Discard obsolete passive work without pretending that cancelling a read cancels a
mutation; all agreed unknown-attempt fencing and reachable modal recovery remain intact.

Selected identity and draft lifetime are independent of mounted rows. New row batches
do not remount/reset the editor. A filter can exclude the selected row while its
inspector/draft remains intact; preserve the existing selected-outside-list notice
and Show selected token action. Reveal/mount its correct row before focusing it.
Reopening a project or returning from a dialog restores the appropriate stable row,
field or header, never a recycled same-index row from another result generation.

## Native reachability, partial states and scrolling

Mount remaining results through a bounded background schedule, not solely when a
scroll observer fires: otherwise native Tab/Find/screen-reader reading cannot reach
records that have never entered the DOM. Complete the schedule without requiring
scroll, while prioritizing explicit selected-record reveal and keeping editing usable.
Do not steal focus as batches appear or disable the whole inspector while listing.
Preserve native button Tab/Shift+Tab/Enter/Space behavior and ordinary pane scrolling.

During initial preparation say “Loading tokens…” or “Loading groups…”, using the
existing local status surface. Once membership is known but mounting is incomplete,
quietly say “Preparing remaining results…”; available rows are usable. Announce stage
changes, not each batch. A total may describe complete membership, never an observed
prefix as the whole project. Only a completed zero-result query can show the current
empty/no-match state. A failed batch/read is an error with retained current-context
content identified as incomplete/stale; it cannot become an empty project/all-clear.

Native browser Find covers mounted content during preparation and the complete view
only after completion. State this limitation; do not claim complete native Find early.
Application search remains complete independently. Mounted offscreen auto-contained
rows should remain in the accessibility tree and native navigation, subject to actual
engine/AT verification. Do not use `hidden`, `aria-hidden`, `inert` or disabled controls
to remove merely offscreen records. Avoid globally setting aria-busy in a way that
prevents screen readers using available results until the entire maximum finishes.

Preserve a stable visible entity and its offset when neighboring blocks activate;
do not scroll to the top on each append or measurement. Verify deep-scroll return,
rapid scrollbar jumps, Find-driven reveal, keyboard focus beyond the first batch,
sidebar scrolling, Description breakpoint changes and actual 200% browser zoom.
No fixed-row-height assumption is defensible for long exact values and variable text.

## Full exact details without a second eager project view

Prepare selected-token inspection independently; fetch raw authored data only when
its existing details are requested, with truthful preparing/error feedback. Keep the
current controls and complete source inspection, not a replacement export/copy tool.
Prepare heavy resolved/trace panels when their existing tab is opened; lightweight
selection/eligibility feedback must not require mounting the full trace first.
Use plain exact text and bounded construction, not a huge syntax-highlighted node tree.
Do not eagerly stringify every token inside closed details or clone the whole project
for selection/typing. Complete raw source must remain natively selectable, including
Select all and boundary text; no ellipses, clipped middle, rounding or partial-source
success claim. Preserve exact code units/absence/aliases, including escaped identities.

A largest admitted token can contain far more text than one normal color field.
Moving serialization to a worker does not remove return/decoding/text-layout cost.
Measure that complete open-detail path separately. Until it is fully available,
label it preparing; do not invite selection of a prefix as if complete. If one exact
detail cannot meet the unchanged target, return the measured detail-specific choices
for review. This assessment neither imposes a new source limit nor pre-approves a
paged raw viewer, readonly-textarea replacement or incomplete diagnostic display rule.

## Learning questions and evidence gate

Before adopting the candidate, a separately authorized isolated check should answer:

- Do unchanged real row components at 100/1,000/10,000 tokens plus 2,000 groups meet
  the existing responsiveness target through final mounting and subsequent scrolling,
  searching, native Find, repeated filtering and inspector editing in both engines?
- What batch row/text limits avoid renderer bursts, including one worst admitted row,
  native options, complete selected raw detail and long exact input? What final node,
  text and memory footprint remains after all rows mount and after obsolete views leave?
- Does auto containment preserve native Tab/focus/selection, screen-reader reading
  and Find-driven reveal, including deep rows, long variable heights and 200% zoom?
  Does mounting finish without scrolling? Do scroll anchors survive width/zoom changes?
- Can a delayed old query, revision, project, worker incarnation or selected inspection
  be rejected without overwriting newer rows, field input, forms or readback state?

Use current React/owned components and independently identified exact fixtures;
the prior synthetic eager-DOM failure is a baseline counterexample, not the new test.
Record warmup plus 20 samples and separate cold observations under B-5, actual task/
layout evidence and interaction outcomes. Safari's missing Long Tasks API is not a
pass. Preserve worst samples and unchanged source equality. The 30-second watchdog
is a harness safety stop, not permission for 30-second unresponsive UI. A completed
loop, attractive screenshot or one fast first viewport cannot close this gate.

If the preferred candidate fails, identify whether return cloning, React commit,
offscreen activation, final DOM/accessibility growth or selected details caused it.
Then compare a targeted fix with windowing or explicit pages. User approval is needed
for their changed navigation/Find/selection behavior; do not force either in advance.

Only this assessment was written. Checks: prose, local links, terminology and scoped
whitespace/diff review. No app tests, build, prototype edits, experiment or live browser
inspection ran. Historical and external sources inform hypotheses, not fresh proof.
Suggested human-owned commit: `docs: assess bounded rendering for increment 007`.

## Reviewed isolated result — 10 November 2026

The [developer report](../../output/increment-007-rendering-qualification/report.md),
[80-file snapshot](../../output/increment-007-rendering-qualification/manifest.json)
and [independent review](../../output/increment-007-rendering-qualification/independent-review.md)
support a **negative monolithic raw-detail result, not complete G-01 qualification**.
A valid near-aggregate-boundary single token produces 4,134,504 exact raw code units.
Its combined open/complete DOM Range/Selection/geometry path incurred a 191.793 ms
CrRendererMain Layout event (190.465 ms thread CPU), above the unchanged 100 ms gate.
The exact forcing call was not isolated; this was not native keyboard Select All.

Twenty small 100-row mounting observations, literal-row markup equality and selected
inspector draft/error/raw/tab checks are bounded positive evidence only. The harness
still returns whole authored rows/full-project inspection, supplies synthetic resolution
and lacks group/All content/stale-state/native interaction coverage. Safari and larger
list cases were not run after the risk failure. The approved full candidate is incomplete;
this does not establish that staged ordinary rows are impossible or justify list paging.

Before any reuse/positive qualification, automatic whole-task failure detection must
be corrected: LongTask/RunTask observations were empty and the runner missed the
known Layout event; trace inspection caught it before escalation. The independent
review accepts the counterexample without requiring another large run.

Next design work should address the exact-detail bottleneck and incomplete projection
boundaries explicitly. No replacement raw control, paging/windowing, truncation, new
source limit or lower resource budget is selected here. Production and the current
list/inspector remain unchanged; further design/qualification needs bounded authority.
