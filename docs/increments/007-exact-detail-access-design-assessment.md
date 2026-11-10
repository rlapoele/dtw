# Increment 007 — exact-detail access assessment

**Candidate order approved for isolated comparison · 10 November 2026.**
Original assessment baseline: clean `dev` at `7474dc0`. After committing both
assessments as `30abbf0`, the user approved their recommendations and authorized an
isolated developer comparison with repaired instrumentation, then independent review.
Source/evidence belong under `research/increment-007-detail-projection-comparison/`
and `output/increment-007-detail-projection-comparison/`. Existing prototypes and
production remain untouched. Candidate comparison is not adoption of a new control,
final contract/design agreement or Increment 007 implementation authority. Contract
remains Draft / Not started; existing safety gates and unchanged budgets still apply.

## Recommendation

First compare a **targeted plain-text disclosure with less layout amplification**:
retain All authored data, its native details/summary and `<pre>`, the same complete
pretty-printed text and on-demand preparation. Assess one uniform raw-disclosure rule:
no soft wrapping; long lines scroll horizontally, tall source scrolls vertically
inside an area bounded by the inspector's usable space. Short source uses its natural
height with no artificial blank viewport; ordinary short pretty text looks unchanged.
All text remains present. This is a proposed layout, not a proven fix or source limit.

Prefer this first because it preserves document-text inspection and changes fewer
interaction semantics than a form control. The failing interval did not isolate
opening, selection or geometry; it is premature to conclude the `<pre>` itself must
be replaced. Chunking construction alone is also insufficient if final layout or
complete selection still blocks the renderer.

The meaningful second candidate is a **native read-only textarea inside that same
raw disclosure**, containing the complete exact text in a bounded viewport. Assess
it if the smaller layout candidate fails or if native local Select All is materially
clearer. It is a user-reviewed control change, not a new authoring editor and not a
claim that browser text controls can handle four million units below 100 ms.

**Approval scope:** the user approved this candidate order and uniform overflow
proposal for isolated comparison, with the projection recommendations and repaired
instrumentation. Visible layout/control adoption still requires identified review.
No paging, file-only access, list redesign or automatic control swap is agreed.

## What the evidence establishes

The [G-01 report](../../output/increment-007-rendering-qualification/report.md),
[independent review](../../output/increment-007-rendering-qualification/independent-review.md)
and frozen [80-file manifest](../../output/increment-007-rendering-qualification/manifest.json)
support one negative combined raw-access path. A valid font-family token has 63 named
families of 65,536 UTF-16 code units. Its raw pretty text is **4,134,504 units**;
complete DOM text/Range selection preserved its hash and boundaries. The wrapped
`<pre>` measured 1,487,885.875 CSS px high at 331 px wide.

Chrome CrRendererMain performed **191.793 ms Layout**, above the unchanged 100 ms
gate, within opening/complete DOM selection/text inspection/geometry work. The exact
forcing operation was not isolated. This is neither native keyboard Select All nor
Find/copy/AT evidence; it does not prove serialization, opening or selection alone
caused the failure. Repeating the same failed monolithic case is unnecessary.

Twenty small mounting observations and selected literal/draft/error checks are
limited positive evidence. Full authored-row/full-project returns and synthetic
resolution remain incomplete boundaries: fixing raw layout cannot qualify the whole
candidate or inspector. The [approved staged-list direction](007-bounded-rendering-design-assessment.md)
remains intact. Keep all admission/work budgets and the 100/1,000/10,000-token scale
interpretation; no rounding, truncation or exclusion of this admitted source.

## Focused alternatives

| Candidate | Visible behavior / benefit | Required caution |
| --- | --- | --- |
| Existing pretty `<pre>`, on demand; uniform bounded viewport/no-wrap — preferred first | Same disclosure and exact document text. Long lines scroll horizontally, tall source internally vertically; short text retains natural height. | Long text changes wrapping/scroll behavior. Viewport bounds do not prove internal text shaping/selection is bounded. Full text remains present; no constant-memory claim. |
| Native read-only textarea, on demand | Same raw text, with an explicit labelled read-only field and local text selection/scrolling. Could isolate a huge text surface from document layout. | Different focus/Select All/Find/AT semantics and possible internal layout cost. Verify each, including native browser Find through offscreen field content; no performance guarantee. |
| Compact instead of pretty JSON | Fewer formatting characters and lines. | The multi-million-unit string values remain. Compact text may create one enormous line and reduce readability. Not preferred; changing whitespace is a presentation choice, not a new canonical/backup format. |
| Paged/windowed raw text or external-file/export-only access | Potentially smaller active display. | Breaks ordinary full-source selection/Find/copy or moves access outside the inspector. Requires a material user choice; no silent adoption or new export tool. |

Both preferred candidates retain plain exact text, without a syntax-highlighted DOM
tree. Preserve the existing pretty serialization for the first comparison so results
do not conflate control/layout and formatting changes. JSON indentation/escaping is
presentation; decoded authored string values, optional absence, order, IDs, aliases
and metadata remain exact. Do not treat raw authored text as a derived resolution.

## Bounded access and unchanged ordinary experience

Use the existing disclosure as the request boundary. Closed details do not construct
huge text or force layout. Opening requests one selected record, not its whole project;
the analyst's separate projection assessment owns that missing application boundary.
Correlate the response with project/kind/exact ID, revision, request and worker/result
generation. A late former selection must not populate the current disclosure.

While preparing, show local text such as “Preparing authored data…” and keep controls,
drafts, previews and the rest of the inspector responsive. Failure is local and leaves
source unchanged. Do not show an empty string or prefix as complete source. Prepare
heavy resolved/trace panels only when their existing tab is requested, preserving
their content and agreed derived-work/incomplete-report feedback independently.

Constructing/returning text in bounded pieces is a scheduling hypothesis, not a
selection solution. The completed surface must expose **one complete selectable
source**. No ellipsis, missing middle, segment-only Select All or “copy the rest” tool.
Do not serialize/hash the whole source again on each input, focus or selection event.
Worker serialization does not eliminate renderer decoding, shaping or selection cost.

Keep existing pretty text and disclosure behavior. Apply the proposed overflow rule
uniformly rather than introducing size categories, a guessed character threshold or
a live forced-geometry probe. Short details naturally remain compact; long-line/tall
source changes must be visible in the review. Scrollbars expose complete text rather
than clipping it; no automatic substitution of a different control at a size threshold.

## Fidelity and native interaction contract

| Surface / interaction | Preserve or explicitly verify |
| --- | --- |
| List and navigation | Current swatches, descriptions, layer/type, exact authored summaries, search/filter/selection and ordinary navigation; no page/list change. |
| Inspector | All component/alpha fields/sliders, five views, RGB scales, both drafts, applied/draft context, tabs, description, eligibility, metadata/roles/parent identity, raw data, traces/diagnostics, footer and recovery/error/focus behavior. |
| Complete source | Exact beginning/middle/end, Unicode/code units and full source equality; complete native selection/copy including content outside the viewport. Raw authored and derived resolved/trace data stay distinct. |
| Keyboard and focus | Summary keeps native activation and close behavior. If a scroll region needs a Tab stop, label it and verify Enter/Tab/Shift+Tab/Escape and return to the existing inspector control without traps or draft loss. No automatic focus steal merely because text arrives. |
| Selection scope | A document `<pre>` and a textarea do not imply identical Ctrl/Cmd+A scope. Test actual keyboard gestures after the appropriate focus/selection action, then actual clipboard text; a DOM Range hash alone is insufficient. |
| Find and AT | Find beginning/middle/end through the complete offscreen source, navigate matches and read context. Verify screen-reader read-only/region naming, content reachability and exit. Never call absent native/AT checks a markup pass. |
| Scrolling and zoom | Horizontal and vertical keyboard/pointer scrolling, text selection across scroll boundaries, return anchors and actual 200% browser zoom. No page-wide horizontal overflow, lost actions or forced enormous inspector height. |

Do not convert ordinary missing description/empty selection into recovery wording,
hide exact metadata, flatten aliases or remount the editor to receive a raw response.
Keep Precision theming, existing owned primitives and native semantics under the
[presentation conventions](../project/presentation-conventions.md).

No-wrap with internal two-axis scrolling is a deliberate accessibility tradeoff,
not an assumed WCAG reflow exception because the content is JSON, code or `<pre>`.
W3C's [reflow guidance](https://www.w3.org/WAI/WCAG22/Understanding/reflow.html)
(checked 10 November 2026) ties that exception to usage/meaning and does not extend
it to surrounding content. Review this proposal at 320 CSS px and actual zoom,
including whether horizontal scrolling is justified for the raw task and whether
the rest of the inspector reflows. No compliance promise or exception is established;
the uniform no-wrap direction remains a user choice subject to that review.

## Small next feasibility gate, after separate authorization

1. Repair automatic verdict instrumentation **before positive qualification**. It
   must detect renderer-main Layout/whole-task failure and fail inconclusive when
   required evidence is absent; empty LongTask/RunTask arrays missed the known event.
2. Keep one ordinary literal control, one long single-row/color-input control and the
   exact admitted font-family counterexample. Compare the original serialized text
   and chosen layout/control only. Begin safely below the risky size; stop on failure,
   not repeated maximum stress or lowered budgets. Keep the existing external safety gate.
3. Mark preparation/return, mount/open, full text availability, first paint, actual
   keyboard selection, clipboard readback, Find and geometry observation separately.
   Do not force geometry during the native interaction measurement and attribute the
   combined delay to opening. Preserve raw samples and exact fixture/source identity.
4. Verify the complete large surface in the exact scoped Chrome/Safari builds only
   where safe supervision is qualified. Four million units remain a hypothesis, not
   a promise. Native keyboard/AT/200% checks are separate from structural assertions.
5. Success needs exact full access plus unchanged blocking-work targets and fidelity.
   An initial viewport that looks fast while full selection/copy/Find blocks is not
   success. A passing raw candidate leaves other G-01 projections/list/inspector gaps open.

Read [current Editor](../../src/presentation/Editor.tsx),
[list](../../src/presentation/TokenList.tsx), [authored value](../../src/presentation/AuthoredValue.tsx),
[fields](../../src/presentation/ColorFields.tsx), [App](../../src/presentation/App.tsx),
[session](../../src/presentation/session.ts), [visual direction](../project/visual-direction.md),
workflow/status and [Draft AC-18/20/24](007-local-retention-and-backup.md).
This assessment used source/documents and frozen evidence, not a fresh browser,
experiment, usability/AT proof or vendor performance promise. Only this file changed.
Checks: prose, local links and scoped whitespace/diff review. Suggested human-owned
commit: `docs: assess exact-detail access for increment 007`.

## Reviewed isolated comparison — 10 November 2026

The [comparison handoff](../../output/increment-007-detail-projection-comparison/comparison-summary.md)
and [independent review/recheck](../../output/increment-007-detail-projection-comparison/independent-review.md)
accept two negative first-risk observations on the same admitted 4,134,504-unit source:
uniform no-wrap pre incurred 120.547 ms renderer task / 110.780 ms Layout; conditional
read-only textarea incurred 128.683 ms task / 119.338 ms Layout. Both exceed the
unchanged 100 ms gate during disclosure/transfer/assembly/mount/paint, before large
equality, native selection, Find or geometry phases. One observation each supplies
no distribution or causal ranking. Neither candidate is accepted for product adoption.

Small controls and narrower projection subsets are positive evidence only. G-01 and
full P-R1–5/list/inspector qualification remain incomplete; general whole-message byte
enforcement, immediate event-time draft fences, eager worker source construction,
selection styling and remaining native/scale/Safari coverage are explicit limitations.
The review found a foreign-renderer task-coverage bug; its minimal offline correction
is independently closed in the [131-file corrected snapshot](../../output/increment-007-detail-projection-comparison/manifest-r1.json).
All 30 non-navigation saved verdicts remain unchanged; two navigation intervals are
conservatively inconclusive. No browser, viewer or workload was rerun for that fix.

Production/current list/inspector, old prototypes, budgets and previous evidence remain
unchanged. The next step needs an explicit exact-detail product/gate disposition and
remaining projection/fidelity obligations, not an automatic third viewer, threshold,
source cap or other interaction adoption. No further experiment or implementation is
authorized by this result.
