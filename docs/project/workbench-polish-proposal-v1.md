# Workbench polish — design proposal V1

**16 November 2026 · Proposed design, awaiting artifact review.** The user approved
the designer's recommended direction and requested this prototype. That approval
selects the direction to prototype; it is not final design/contract agreement or
implementation authorization. Analyst review of this artifact remains pending user
approval. [Increment 015](../increments/015-workbench-browse-and-inspector-polish.md)
owns the draft requirements and later review records.

## Review artifact

Source: [prototype V1](../../prototypes/increment-015-v1/main.tsx),
[styles](../../prototypes/increment-015-v1/prototype.css) and
[Vite config](../../prototypes/increment-015-v1/vite.config.ts).

From the repository root:

```sh
npx vite --config prototypes/increment-015-v1/vite.config.ts
```

Open `http://127.0.0.1:4215/`. The top strip is explicitly prototype review tooling,
not proposed application UI. Review at desktop width, approximately 1090px and
below 880px; 320px is the retained minimum. This artifact uses the production
semantic theme and local variable Geist fonts, with isolated prototype geometry.

## Identified V1 design

1. Undo/Redo retain their place in the application header. Each has a neutral,
   top-right overlapping count badge: minimum 1.125rem diameter, .625rem numerals,
   expanding for multiple digits. Empty counts show zero; disabled controls and
   badges are muted. The visible description strip is removed. Native titles and
   accessible descriptions retain next-action, empty or blocked explanations.
   Counts represent retained steps even while a temporary safeguard prevents use.
2. Token rows show HEX alone, including alpha. Native title/accessibility detail
   explains the sRGB 8-bit preview. An out-of-sRGB sample shows **HEX unavailable**,
   with the actual reason; it does not invent a fallback HEX or silently clip.
3. List coordinate summaries show at most four decimal places without trailing
   zeroes. Exact coordinates remain in the editor and inspection details. Proposed
   production rounding is decimal nearest, ties away from zero, normalizing a
   rounded negative zero to zero. Very small values can consequently display zero;
   the native/accessibility detail identifies this as a rounded list preview and
   exposes the original coordinates. Example: 0.532369162839 → 0.5324. This is
   proposed presentation policy, not a change to authored data or calculations.
4. Generic token copy and a left-inset decorative magnifier support the search
   field. Secondary **New group** sits beside primary **New token**, wrapping when
   needed. Both invoke the existing production workflow in the proposed design;
   creation parent follows the current browse context.
5. The redundant Inspector strip is removed. A compact sticky heading contains
   type and token title, closely associated **Current** / **New** specimens, then
   the collapse control on the right. Colored areas match the existing list's
   `size-8.5`: 2.125rem square. Long titles wrap; specimens wrap below the title
   rather than being pushed to a distant edge. Descriptions and layer metadata
   scroll below the sticky area.
6. The sticky heading has an opaque semantic surface and bottom separator. It
   lives inside the inspector's own scroll container; browsing remains independently
   scrollable. Its identity/comparison/control remain visible over exact details.
7. The same chevron points right when expanded and rotates 180 degrees to point
   left in the collapsed 3rem rail. Transform transition is 180ms; reduced motion
   disables transition. The control remains keyboard operable and named, with
   expanded/controls relationships. Group/empty/unavailable states retain the
   contextual heading and control without empty comparison specimens.
8. Below 880px, browsing and inspection remain separate full-width surfaces.
   Selection enters inspection; **Back to tokens** returns to browsing. A desktop
   collapse rail is not introduced on that surface. Below 640px, history retains
   icons and count badges while hiding button text.
9. Both tab panels use 1.5rem padding, reduced to 1rem below 880px. Current-only
   comparison on the Resolved tab is preserved. Existing comparison meaning
   remains applied state versus unapplied input; the short labels change only.

## Review interactions

- Initial sample has Undo 3 / Redo 0. Traverse sample history to see counts change.
  **Clear sample history** provides the zero/zero case. Check **Temporarily block
  history** to see retained counts with disabled controls.
- Type in search, select a row and hover the concise HEX/coordinate summaries.
  The overlay sample demonstrates alpha; vivid accent demonstrates unavailable HEX.
- Open **New group** in the workspace or navigation. Its native modal illustrates
  current browse-parent context, cancellation and return focus. Create a sample
  group to add a navigation entry and increment the sample Undo count.
- Use the review selector for long title, group, empty and unavailable headings.
  On narrow layouts, non-default scenarios open inspection directly for review;
  Back returns to the corresponding browse surface.
- Collapse and expand at desktop width. Scroll the inspector down to exact values
  and metadata, checking that identity/swatches/control remain visible.
- Edit the Green sample input or a slider to reveal the New specimen and disabled
  history guard. Cancel resets the mock draft; Apply increments Undo and clears Redo.
- Switch tabs to compare padding and Current-only resolved context. Test reduced
  motion through the browser's preference emulation if desired.

## Fidelity and limits

This is an isolated visual/interaction prototype with in-memory illustrative data.
It does not call application operations, retain projects, perform color conversion,
implement production history safeguards, or establish domain correctness. History
labels are illustrative. The color-space menu does not convert coordinates;
reference editing and Projects are outside this artifact. Only the Green exact
input is modeled as editable state; swatch changes are illustrative rather than
computed from entered numbers. Group creation demonstrates context and focus,
not the existing production validation or command implementation. Token creation
confirms a sample action but does not add a token row. Exact/source values are
fixed specimens and are not a serialization guarantee.

Production must preserve existing mounted session lifetime, keyboard shortcut
routing, draft/departure/recovery guards and application-owned history. This
prototype demonstrates their visual consequences without replacing their agreed
contracts. It introduces no dependency, domain or persistence decision.

## Checks and handoff

The isolated Vite production build passed on 16 November 2026 and bundled both
local WOFF2 font assets. Source and scoped output ownership were checked; no
production code or Git index was changed by the designer. Browser/visual review
is assigned to the coordinator, avoiding duplicate checks. The prototype check
ceiling is 10 aggregate minutes and one harness repair; the designer used under
one minute for the build and no harness repairs. No production qualification or
independent implementation review is claimed.

Coordinator browser review on 16 November 2026 used Chrome at 1090×865,
1440×1000 and 320×865. The heading stayed at the same top coordinate while its
scroller moved 350px; all six sampled row/comparison specimens measured 34px.
Sample Undo/Redo count changes, collapse/expand, group-state heading and workspace
New group creation/focus return were exercised. Narrow selection exposed Back,
and no document horizontal overflow was observed at the sampled widths. Desktop,
long-title and narrow screenshots are in
[`output/playwright/increment-015-v1/`](../../output/playwright/increment-015-v1/).
Visual review found the proposed composition readable. Color conversion and
production safeguards remain outside this mock. Reduced-motion behavior was
source-inspected, not emulated; exhaustive keyboard/state qualification was not
performed. During construction, live reload emitted duplicate-root warnings;
a fresh navigation completed the final checks. A missing favicon is a prototype
404. Approximate combined prototype check use: 5/10 minutes, zero harness repairs.

Suggested commit: `docs: prototype workbench browse and inspector polish`
