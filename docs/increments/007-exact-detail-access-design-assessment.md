# Increment 007 — exact-detail access assessment

**Designer recommendation · 10 November 2026 · awaiting user review.**
Baseline: clean `dev` at `7474dc0`. Assessment only: no prototype/production edits,
experiment or new control is authorized. The contract remains Draft / Not started.
The user's delivery aim does not remove the remaining agreement/qualification gates.

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

**Decision requested:** approve this narrow candidate order and uniform overflow
proposal for a separately scoped comparison/prototype proposal, or prefer the textarea
candidate first. Visible layout/control changes need identified user review before
adoption. No paging, file-only access, list redesign or automatic control swap is agreed.

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
