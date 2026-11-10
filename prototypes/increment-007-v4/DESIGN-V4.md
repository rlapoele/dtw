# Increment 007 V4 — exceptional authored detail

**Design review artifact · 10 November 2026 · production baseline `e2a3534`.**
E-1–E-4 are user-agreed in the [owning policy](../../docs/increments/007-exceptional-detail-policy-and-performance-proposal.md).
This isolated V4 artifact presents the layout and notice for user review. It is a
focused supplement to [V3](../increment-007-v3/DESIGN-V3.md), not a replacement for
its retention, recovery, resource, All content or identity obligations. Increment
007 remains Draft / Not started. No analyst review, final design agreement,
qualification or production implementation follows from preparing this artifact.

## Recommendation

Keep **All authored data** in its existing Metadata section. Keep native disclosure
and complete pretty document text. Place this quiet notice directly beside the
closed disclosure, before activation:

> Opening very large exact source may briefly pause this view.

The notice applies generically, without constructing closed source to guess its size.
Opening reveals **Applied token · Revision N · Read only**, then **Preparing authored
data…**. Complete source is one plain read-only `pre`, with no soft wrapping and a
local two-axis scroll viewport. Its maximum height is the smaller of 24 rem and
50 dynamic viewport-height units; there is no minimum height. The short specimen
therefore occupies its natural height. The inspector retains its own existing
vertical scrolling. This is the sole proposed product geometry exception.

A local failure says **Authored data unavailable. Applied data and drafts are
unchanged.** It offers **Retry authored data**. There is no partial-success text,
automatic retry, modal interruption or synchronous Cancel promise. Closing the native
disclosure invalidates queued simulated preparation; it does not claim to interrupt
browser layout, native selection, Find or copy. Source remains applied, independent
of literal/reference drafts and their previews.

## Run and review

From the repository root, using existing dependencies:

```sh
./node_modules/.bin/vite --config prototypes/increment-007-v4/vite.config.ts
```

Open [the isolated prototype](http://127.0.0.1:4227/). Port is strict; do not terminate
another process to obtain it. Build/cache output belongs under `/tmp`, not the app.

1. Select **color / brand**. The existing inspector has all component controls and
   alpha below its fold. Scroll within that pane to Metadata / All authored data.
2. Observe the closed notice; activate the summary using Enter or Space. The small
   deliberate delay exposes Preparing, then complete applied source.
3. Select **unassigned** for naturally sized short source; select **font-family**
   for a modest multiline specimen with one long authored family name. Both axes
   scroll within the same document surface. No third viewer is introduced.
4. The external **Design review · V4** strip changes only preparation simulation:
   **Preparing · held** holds feedback; **Failure · Retry succeeds** fails the first
   request, then succeeds after explicit Retry. Changing the selector closes the
   disclosure. Failure resets for a new selection or applied revision.
5. In brand, enter raw Red `0.`, switch to Reference and choose a target, then back
   to Literal color. Open/fail/retry source: both drafts remain exact and unapplied;
   the source still shows the applied Red. Existing Apply/Cancel behavior is retained.

The review strip is outside the product. Its simulation labels are not proposed
product UI. The held state deliberately lasts indefinitely for inspection; production
still owes the agreed five-second action ceiling and truthful failure behavior.

## Baseline preservation

V4 uses isolated copies of current production **App.tsx** and **Editor.tsx** rather
than V3's reduced workbench composition. The App copy differs only in importing the
local Editor. The Editor copy differs only in importing/substituting ExactSource
for the existing authored disclosure. Everything else is reused unchanged.

| Existing surface | Preservation in V4 |
| --- | --- |
| Token rows | Real production TokenList: swatches, descriptions, layer/type, exact authored values and references, current responsive behavior. |
| Shell/navigation | Current App, ProjectNavigation, search, group filter, pane controls, creation dialogs, selected-outside-filter notice and session-only warning. |
| Color authoring | Current ColorFields: three component fields/sliders, independent alpha, all five color views and normalized/integer RGB scales. |
| Drafts | Current session, literal/reference switch, complete independent raw inputs, validation, Draft badge, Apply/Cancel and status. |
| Applied/draft context | Current App-owned header specimens, preview messages and Currently applied AuthoredValue. |
| Token context | Current type/name/description, layer/eligibility, regeneration, semantic role and parent group. |
| Applied exact source | Same full token JSON formatting; only explicit preparation, status, revision label and bounded no-wrap layout are proposed. |
| Resolved & trace | Entire existing tab, resolved/unresolved feedback, specimen, exact result, trace IDs/targets and diagnostics untouched. No new performance exemption for the tab. |
| Footer/guards | Current regeneration footer, draft departure guard, focus and application callbacks untouched. |

Preserving the current shell includes its current labels and limitations; these
fixtures do not propose new noncolor editing or repair capabilities. V3's wider
Increment 007 behaviors remain separate agreed design obligations. This is not a
new persistence/recovery implementation or a certification of every baseline route.

## Evidence and limits

[Saved screenshots and observations](../../output/increment-007-exceptional-detail-design/observations.md)
identify the bounded designer smoke checks. Isolated strict TypeScript and Vite
build pass. Browser: disposable Playwright Chromium, desktop 1600×1100 and compact
760×900. Screenshot review confirmed existing neutral theme, list content, color
controls, notice, natural short source, two-axis source, Preparing and local failure.
Summary Enter opens; Tab reaches the labelled read-only source. Escape on the source
keeps native focus and leaves it open. No page-level horizontal overflow was observed
at either checked width. The local source has one focus stop and remains ordinary
document text; Cmd/Ctrl+A is not claimed to be local-source-only selection.

The small fixtures contain 160 / 687 / 3,148 serialized UTF-16 units before edits.
They are intentionally below the exceptional-class boundary. No >65,536-unit or
multi-million-unit workload was allocated. The 900 ms delay, failure, held state and
revision counter simulate presentation only. Revision N is an in-memory whole-project
counter advanced by successful sample commits; it is not a durable concurrency/CAS
revision. Applied source is genuinely the current small domain token snapshot, not
placeholder text; drafts are not serialized into it.

This prototype still uses synchronous production domain/application reads and full
small in-memory snapshots. It does not implement named worker projections, transfer
framing, event-time mutation fences, lifecycle safety, budgets or E-2 classification.
No 100/250 ms or 5 s timing result is claimed. Native full selection/copy, clipboard
equality, browser Find, AT, actual 200% zoom, Safari and remaining projection/support
qualification are unrun. No clipboard access, browser trust change, durable storage,
root dependency or production-source change occurred. The serving process remains
available for user review; the designer's disposable browser is closed after capture.

Review this identified layout and wording before analyst review. Suggested human-owned
commit: `design: prototype exceptional authored detail layout and notice`.
