# Workbench polish — design proposal V1.3

**16 November 2026 · V1.3 agreed for implementation.** Following user-approved
analyst review, the user agreed the updated Increment 015 contract and prototype
V1.3 and authorized developer implementation followed by independent review.
[Increment 015](../increments/015-workbench-browse-and-inspector-polish.md) owns the
agreement and delivery record. Earlier iteration notes below preserve historical
status; V1.3 is the identified agreed design.

## Requested revision — V1.3

The user corrected the compact direction: **36px is ideal at all screen sizes**,
then explicitly confirmed that this applies to **all buttons and inputs**.
V1.3 uses a 2.25rem baseline for standard controls at every width. Icon buttons are
2.25rem square; text buttons, inputs, selects and tabs have a 2.25rem minimum
height with padding that accommodates their labels. Text/root enlargement and
wrapped content can increase height; no clipping maximum is imposed. Mobile text
fields, including search and exact-value/name entry, remain 1rem. Native sliders have a 2.25rem input target; token rows and
other content retain natural geometry. Prototype review controls use the same
baseline where applicable; checkbox labels provide a 2.25rem-tall clickable wrapper
without stretching the native checkbox.

This selected direction supersedes the earlier 24px and 44px specimens for the
proposed increment. Those iterations and their evidence remain historical. This
is a prototype revision, not a production rule change or implementation approval.
The action pair remains unwrapped at the heading's top-right at all widths.

## Previous requested revision — V1.2

The user selected compact mobile controls after reviewing V1.1. V1.2 removes the
blanket 2.75rem mobile button minimum in this prototype. Simple buttons use a
1.5rem minimum width/height and compact vertical padding; below 640px the named
creation and history icon buttons are 1.5rem square at the default root size.
This is 24 CSS px at a 16px root and grows with text/root scaling. Text or content
may require greater height: no maximum height is imposed. Token rows and tabs
retain their content-driven geometry, and text inputs remain 1rem with natural
height. Native controls remain native.

This user-selected direction supersedes the previous 44px minimum **for this
proposed increment**. It does not rewrite earlier acceptance evidence or authorize
a production-wide rule change. WCAG 2.2 AA's target-size minimum is 24 by 24 CSS
pixels, subject to its exceptions; 24px is not a maximum. The coordinator checked
[the official target-size guidance](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum).
No overall WCAG conformance is established by this prototype.

## Previous requested revision — V1.1

After reviewing V1, the user explicitly requested that New group and New token
always remain together at the workspace heading's top-right, including small
screens, without wrapping. V1.1 implements that requested layout in the prototype:
a two-column heading, non-wrapping action pair, full-width supporting copy below,
and named icon-only actions below 640px. All other prototype behavior is preserved.
This revision is awaiting artifact review; no analyst design review or production
implementation is authorized by it.

## Review artifact

Source: [prototype V1.3](../../prototypes/increment-015-v1/main.tsx),
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

## Identified V1.3 design

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
   field. Secondary **New group** and primary **New token** stay together in one
   unwrapped row at the workspace heading's top-right corner at every width.
   Title/type remain on the left; descriptive copy flows across the next row.
   Below 640px the two actions use distinct folder/plus icons in 2.25rem square
   buttons, keeping native titles and accessible names. This preserves a readable
   title at 320px without moving or wrapping the action pair. Both invoke the
   existing production workflow in the proposed design; creation parent follows
   the current browse context.
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

The preceding V1 coordinator browser review on 16 November 2026 used Chrome at 1090×865,
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

V1.1 source/build checks passed; browser review of the revised action placement is
assigned to the coordinator. No additional browser checks or harness repairs were
performed by the designer. Approximate designer V1.1 build check use: under one
minute, within the remaining five-minute prototype allowance.

Suggested commit: `docs: prototype workbench browse and inspector polish`

Coordinator V1.1 follow-up checked 1131, 1090, 640 and 320px: both action
buttons shared the heading's top coordinate, the action pair's right edge matched
the heading, and no document horizontal overflow was observed. The 320px view
uses 44px named icon buttons. Revised screenshots are
`actions-v1-1-1090.png` and `actions-v1-1-320.png` in the existing evidence folder.
Approximate cumulative prototype checks: 7/10 minutes, zero harness repairs.
This remains a user-requested prototype revision awaiting artifact approval.

V1.2 source/diff review completed; no repeat build, browser check or harness repair
was run by the designer. The coordinator owns the focused 320px measurement of
compact controls and content fit. Earlier screenshots describe their identified
versions, including V1.1's 44px specimens; they are not V1.2 evidence. Approximate
prototype check use at this handoff remains 7/10 minutes, zero harness repairs.

Coordinator V1.2 check at 320×865 measured Undo/Redo and both creation actions
at 24×24 CSS px, Back at 24px high, search at 43px high and exact-value input
font at 16px. Browse and inspector had no document horizontal overflow. Screenshot:
`output/playwright/increment-015-v1/compact-v1-2-320.png`. Approximately 8/10
aggregate prototype verification minutes used, zero harness repairs. No full
WCAG conformance assessment or production verification is claimed.

V1.3 source/diff checks completed without a repeated build or browser run. The
coordinator owns the focused 320px/1090px measurement and screenshot. The 36px
control baseline is the current proposal; earlier compact/44px screenshots remain
identified historical iterations. No production or Git index edits were made.

Coordinator V1.3 measurements at 1090px and 320px confirmed header/creation
buttons and search at 36px. At 320px, Back, tabs, segments, sliders and exact-value
inputs measured 36px, with no document horizontal overflow. Native select height
was explicitly aligned to 2.25rem after an initial 37px intrinsic measurement.
Screenshot: `output/playwright/increment-015-v1/controls-v1-3-320.png`.
Approximately 9/10 prototype verification minutes used, zero harness repairs.
Checks stop here; no broader qualification or production acceptance is implied.
