# Increment 023 — Inspector sections V1

**Visual prototype — 20 November 2026.** The user approved this structure for
prototyping, not production implementation or analyst design review. This artifact
implements that approved direction for visual/interaction feedback. The
[Increment 023 contract](../../docs/increments/023-token-description-and-inspector-sections.md)
remains Draft. No production source or persisted project data is changed.

## Open the prototype

From the repository root:

```sh
npx vite --config prototypes/increment-023-v1/vite.config.ts
```

Open **http://127.0.0.1:4223/**. The server binds only to loopback. It reuses installed
Vite/React/Tailwind and owned presentation components; no dependency install is
needed. `Focus inspector` in the prototype toolbar hides the illustrative workspace
while preserving the normal 25rem inspector width. Below 880px the inspector is the
only workspace surface and fills the width. The toolbar is prototype-only chrome.

Build: `npx vite build --config prototypes/increment-023-v1/vite.config.ts`.
The output is isolated at `/tmp/dtw-increment023-v1-dist`.
Typecheck: `npx tsc --project prototypes/increment-023-v1/tsconfig.json --noEmit`.

## Structure and interaction

- Sticky token heading and Current/New specimens remain above the scrolling content.
- **Edit token** contains Description, Layer and literal/reference color fields.
  It sits above **Applied / Resolved & trace** tabs, which switch read-only content.
  The existing ColorEditor is imported read-only as a code dependency, so its visual
  controls and color-calculation behavior remain representative.
- One action/error/recovery footer belongs to Edit token but stays visible when
  its fields are collapsed. It stays before all read-only information. A collapsed
  dirty section displays **Unapplied changes** next to its label.
- Every top-level section has the same full-width heading button, typography,
  divider, keyboard focus treatment and far-right shared Heroicons chevron.
  The chevron rotates right → down in 160ms; reduced-motion removes its transition.
  Panels open independently, not as an exclusive accordion. There is no height
  animation or simulated async animation dependency.
- Edit token starts open. All read-only sections—Currently applied, Metadata,
  All authored data, Resolved value, Resolution trace, Resolution diagnostics and
  Raw resolution data—start collapsed, as requested on 20 November 2026. Tab changes preserve expansion choices and drafts.
- Description/layer/value Apply and Cancel update one local sample atomically.
  The applied sample row and read-only information remain unchanged while drafting.
  Clearing the description removes it from the sample authored object. Exact
  multiline description text is preserved. Changing only color view/entry scale
  does not make the prototype dirty.
- Apply/Cancel reopen Edit token and return focus to Description. Failure and
  recovery messages remain in the always-visible footer. Invalid color text blocks
  Apply and the footer offers `Open editable fields` if the editor is collapsed.
- Metadata directly displays Regeneration, Semantic role, Parent group, Project
  identity, Token identity, Path status and Path segments. The sample path is a
  JSON segment array, preserving boundaries. Regeneration appears exactly once.
- All authored data is separate from Metadata. Its sample text is prepared only
  when opened, discarded when closed, and regenerated on applied revision change.
  A canceled request cannot publish a stale result. Raw resolution uses the same
  simulation. Source content uses a bounded, keyboard-focusable scrolling region.

## Review scenarios

1. Change Description, collapse Edit token, and switch read-only tabs. Check the
   dirty badge, unchanged applied text, and reachable Cancel/Apply. Cancel should
   restore the applied text and reopen the editor. Repeat with Apply.
2. Change Layer and a color component or HEX together with Description. Apply once;
   all three local values update together. Reference mode has one sample target.
3. With a dirty draft, choose **Save failure** in the prototype toolbar and Apply.
   The draft remains; the error is focused in the visible footer. Choose Ordinary
   editing to clear the simulated condition, then retry.
4. Choose **Changed elsewhere** with a dirty draft, collapse Edit token, and review
   the current-description sample. Reapply remains blocked until Review current
   changes is activated. This illustrates placement, not actual conflict semantics.
5. Choose **Inspection only** to see disabled fields and inspection-only feedback.
   This is a token-eligibility fixture, not regeneration protection. The Regeneration
   row remains `allowed`; regeneration protection does not prohibit manual editing.
6. Open All authored data, collapse it while Preparing is visible, then reopen.
   Choose **Source failure** before opening a source section to exercise its error
   and Retry source. The first preparation fails; retry succeeds locally.
7. Resize to roughly 390px wide and use Tab/Enter/Space on section headers. Check
   full-width labels, far-right chevrons, text wrapping and action visibility.
   Apply reduced-motion emulation to inspect the no-transition state.

## Policy represented versus simulated

This prototype uses only local React state and sample IDs. There are no workers,
IndexedDB writes, network persistence, real Undo/Redo, backup/restore, departure
protection or production recovery calls. Reload resets the sample. Save delay,
failure, changed-elsewhere and source requests are simulated explicitly via toolbar
scenarios. They establish layout and interaction direction only.

The production design proposes resetting section defaults on a different selected
token; this single-token sample does not exercise selection changes. Unavailable,
cyclic and malformed namespace paths must become truthful direct Metadata rows in
production, retaining the current diagnostics. They are not simulated in this
ordinary-path fixture. Inspect-only eligibility and accepted description omission/
removal semantics remain governed by the contract and application policy, not by
prototype convenience. Source/raw schemas are illustrative, not interchange data.

No canonical schemas, storage choices, revision operations or command gates are
approved by this prototype. Authoritative production focus/recovery behavior must
be integrated with the existing session owner; hiding fields must not move or
remount that owner.

## Verification and handoff

Designer checks: isolated Vite build and prototype TypeScript check passed. Source
review confirmed only `prototypes/increment-023-v1/` was written, semantic shared
controls and Icon are reused, and tabs/disclosures do not move draft ownership.
Prototype-specific CSS is limited to sample shell geometry, common section styling,
source bounds and responsive behavior; runtime specimen styles reflect sample color.
No new dependency, icon family or storage adapter was introduced.

Approximately four designer minutes plus four coordinator browser minutes of the
15-minute prototype verification ceiling used, zero harness repairs. Coordinator
smoke verified collapsed editing with visible actions, Cancel/Apply, tab preservation,
keyboard Metadata and reduced-motion. Coordinator inspected desktop/narrow captures
and found a transparent sticky-header background caused by an undefined prototype
CSS variable. It was corrected to the existing `--muted` token used by `bg-surface`;
coordinator recheck confirmed an opaque heading and inspected the corrected narrow capture. A data favicon avoids an
irrelevant browser 404. These browser results are coordinator-reported evidence. Prototype work stops for user feedback. The user must see and
approve identified V1 for analyst review before that review starts; final contract/
design agreement and production implementation authorization follow separately.

### Spacing refinement — 20 November 2026

At the user’s request, the gap after the Literal color / Reference radio group
now matches the shared Field spacing between Description and Layer (1.0625rem).
The prototype removes stacked radio-group and color-editor margins locally;
production ColorEditor is unchanged.

### Action divider refinement — 20 November 2026

The user approved removing the hairline immediately above Cancel / Apply changes.
Spacing separates the actions from the editable fields; the divider below the
Edit token section remains. Prototype only; production is unchanged. Source and
diff checks passed; browser verification was not repeated for this class removal.

The subsequent user refinement reduces action-row top padding from 12px to 4px,
keeping the existing field-to-footer separation and lower section divider.

Removed the idle “Description, layer and value share Apply and Cancel” helper
copy at the user’s request. The status region remains available for unsaved-change
and action-outcome feedback, with no idle message.
