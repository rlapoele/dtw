# Increment 004 — Focused design fidelity review

8 November 2026. Independent designer check of base `8ab986f` plus the source/test/README/architecture files identified by `output/playwright/increment-004-refactor/review-snapshot.sha256`. All manifest entries verified with `shasum -a 256 -c` during this check. This supplements the separate implementation review; it is not a redesign or full acceptance verification.

## Expected result

The agreed [004 contract](004-presentation-refactor.md), [V6](../../prototypes/increment-003-v1/DESIGN-V6.md), [003 creation disclosure](003-visible-color-authoring.md), and [visual direction](../project/visual-direction.md) govern this check. Preserve the restrained Precision hierarchy, neutral surfaces, clear selected rows/current navigation, compact Applied/Draft header, separate collapse controls, exact-field/slider balance, native controls, dimmed modal surface and responsive panel geometry. Preserve the disclosed opaque-black creation value before Create. Scale normalization may produce incidental radius differences; exact pixel identity is not the acceptance standard.

## Result

No actionable material visual regression found in the inspected states. Recommend accepting the design-preservation aspect of AC-6/AC-7 within the scope below. This does not establish all interaction, numerical or accessibility criteria.

The primary title/body/metadata hierarchy, selected-row left rule and background, inspector surface and tabs, field sizing and slider-to-field proportions, rounded tracks, compact New token and Apply/Cancel controls, and modal geometry remain visually consistent. The narrow layouts retain labeled Applied/Draft context and sticky actions. At 320×740 the content below Value requires inspector scrolling in both versions; this is preserved geometry, not a newly introduced truncation.

A minor visible difference is the compact navigation hamburger: baseline CSS `.navigation-trigger .icon` uses 22px; final `App.tsx` uses 16px. Its owned button remains 44px, and live activation/dismissal worked. The reduced glyph is still recognizable and does not establish a meaningful usability or accessibility regression. Restoring it would be a fidelity preference, not a blocking finding. Small corner and mode-button shadow differences likewise do not materially change hierarchy or operation.

## Evidence inspected

All screenshot paths below are relative to `output/playwright/increment-004-refactor/`. Each listed before/after file was opened with the image viewer; interim and final-draft captures were excluded.

| State | Before / after screenshots | Assessment |
| --- | --- | --- |
| Desktop | `paired-baseline-1440-900.png` / `final-1440-900.png` | Preserved hierarchy, selection, inspector width and controls |
| Wider breakpoint | `paired-baseline-1499-900.png`, `paired-baseline-1500-900.png` / corresponding `final-*.png` | Preserved change in panel/layout geometry |
| Navigation breakpoint | `paired-baseline-1119-900.png`, `paired-baseline-1120-900.png` / corresponding `final-*.png` | Preserved sidebar/compact transition |
| Density boundary | `paired-baseline-900-900.png`, `paired-baseline-901-900.png` / corresponding `final-*.png` | Preserved geometry |
| Inspector breakpoint | `paired-baseline-767-900.png`, `paired-baseline-768-900.png` / corresponding `final-*.png` | Preserved bottom/side panel transition |
| Narrow spacing boundary | `paired-baseline-540-900.png`, `paired-baseline-541-900.png` / corresponding `final-*.png` | Preserved spacing/control balance |
| Smallest viewport | `paired-baseline-320-740.png` / `final-320-740.png` | Preserved compact header and sticky actions |
| Short height | `paired-baseline-1440-480.png` / `final-1440-480.png` | Preserved compact vertical geometry and sticky footer |
| Creation modal | `paired-baseline-modal.png` / `final-modal.png` | Preserved scrim, focus ring, disclosure and actions |

Fresh, independent live work used only the cached Playwright session `dtw004-design`, at localhost:5173, and wrote its own screenshots to `output/playwright/increment-004-design-review/`:

1. Created a temporary unnamed project at 320×740; opened navigation. `01-open-drawer-320.png` was saved and visually inspected: coherent drawer width, visible scrim, current All tokens treatment, reachable close/new-group controls and footer. Escape dismissed it and the subsequent DOM snapshot reported Open project navigation active.
2. Opened New token. `02-create-dialog-320.png` was saved and visually inspected: Name initially focused; Group/Layer, initial opaque-black disclosure, Cancel/Create visible without overlap. Entered `primary` and created it; subsequent DOM snapshot showed the selected token, inspector tabs, exact fields, sliders and action controls.

## Coverage limits and evidence cautions

The supplied files `paired-baseline-drawer.png` and `final-drawer.png` initially inspected both depicted closed navigation; they do not establish open-drawer parity. The independent live capture above establishes final drawer usability in the empty-project state, not a matched before/after drawer comparison. Later replacement captures require their own inspection.

The isolated live page reset to the start screen between the post-create snapshot and a read-only measurement attempt; no reload/navigation command was issued by this check. Further live authoring tests were stopped rather than interpreting the reset as a product defect. The check does not independently establish Apply/Cancel parity, long exact-string reachability, scroll restoration, filtered selection/reveal, hidden-content tab order, every failure state or actual 200% browser zoom. Those remain the separate implementation review's responsibility. No formal WCAG, screen-reader or mobile virtual-keyboard session occurred. Screenshot appearance is not evidence of focus containment or full keyboard behavior; only the drawer Escape focus-return path and creation initial focus were directly observed here.

No code, requirements, prototypes or dependencies were changed. Suggested commit message for this report: `docs: record Increment 004 design fidelity review`.

## Focused R1 recheck — 8 November 2026

Reviewed updated stable source manifest `output/playwright/increment-004-refactor/review-snapshot-r1.sha256`; all 25 entries passed independent hash verification. This supersedes the initial snapshot for the targeted correction. Source remains unmodified by this check.

Opened and inspected `r1-baseline-navigation-icon.png` against `r1-final-navigation-icon.png`, and `r1-baseline-drawer-open.png` against `r1-final-drawer-open.png` in the same evidence directory. The hamburger now visibly matches the baseline. `r1-icon-result.txt` records baseline/final icon geometry of 22×22px within the retained 44×44px button and Escape focus return in both; these measurements are supplied execution evidence, not a second independent live interaction session. The final source uses stock `w-5.5 h-5.5` for this correction.

The actual open-drawer pair preserves width, white navigation surface, scrim, current All tokens treatment, heading/close alignment, New group and footer placement at 768×900. The developer also replaced `paired-baseline-drawer.png` with an actual open-drawer capture, which was inspected during this recheck; the initial closed-image caution above remains a historical account of the first review, not a claim about the replaced file.

The optional hamburger fidelity difference is resolved. No remaining actionable design-fidelity finding in this targeted recheck. Original coverage limits remain: this recheck does not repeat all responsive captures or establish full authoring, assistive-technology or zoom coverage.
