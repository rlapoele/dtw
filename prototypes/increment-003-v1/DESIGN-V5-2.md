# Increment 003 — Designer proposal V5.2

**7 November 2026 · Two refinements approved for isolated prototyping; actual artifact awaits user review before analyst review.**

V5.2 follows the [designer's assessment of V5.1 feedback](DESIGN-V5-1.md#designer-assessment-of-v51-feedback--7-november-2026) and the user's approval of both recommendations. Other [V5.1 behavior](DESIGN-V5-1.md), [V5 missing states and numerical limitations](DESIGN-V5.md) remain unchanged. No application implementation, final design/contract agreement or analyst review is authorized.

## Review the revision

Build and preview from this directory as before (`npm run build`, then `npm run preview`); open **http://127.0.0.1:4173/** and choose **Explore sample project**. Check for an existing server first. Reloading loses the disposable session.

1. At the user's 649px width, inspect a component row and alpha. Slider and precision field use a **2:1 share of available width after the gap**, with labels and vertical alignment unchanged. At narrow widths, the precision field keeps a **7rem minimum**, so the ratio deliberately yields to usable exact entry. Long exact values remain horizontally scrollable within the field; no values are rounded by layout.
2. Scroll down the inspector, then select a **different token**. Once selection is accepted, the inspector's inner scrolling content returns to the top, showing the new token's identity and applied/draft context.
3. With pending edits, select another token. **Keep editing** retains the original token, both drafts and reading position. **Discard draft** accepts the switch and starts the newly selected token at the top.
4. Select the **same token**, or collapse/reopen its inspector: reading position and drafts remain. Same-token selection no longer invokes a departure dialog, because it does not leave the token. Ordinary edits, Apply and Cancel have no new top-reset rule; their existing operation/focus behavior remains.

The reset changes only the inspector content's scroll position. It neither moves document scroll nor focuses the inspector. V5.1's independent list-context reveal and explicit filtered-selection action remain intact.

## Checks and limits

Designer checks: isolated `npm run typecheck`, `npm run build` and all **8 existing helper tests** pass. Scoped Markdown links and `git diff --check` are checked. The existing tests cover the old numerical helper, not the new React scrolling behavior or the agreed production numerical policy. Coordinator browser evidence, if collected, is recorded separately.

No numerical helper, dependency, production source or canonical policy was changed. Exact entry/view anchoring, native slider ranges, compact navigation, responsive split, missing-state fixtures and their existing limitations remain. The next gate is user review of this identified artifact before any analyst review.

Suggested commit: `design: balance component rows and reset new-token inspection in v5.2`.

## Coordinator browser evidence — 7 November 2026

The in-app browser checked the frozen V5.2 loopback preview; these are scoped design observations, not analyst review or production acceptance.

- At 649×952, Red's slider/input widths measured 398px/199px with the same 44px height and vertical position: the intended 2:1 ratio. At 320×568, widths measured 156px/112px, retaining the 7rem precision minimum. Document width matched the narrow viewport and document `scrollY` remained zero.
- Selecting a different token with no pending edits reset inspector content from `scrollTop` 541.5 to 0 and showed the new token heading. Re-selecting the current token preserved `scrollTop` 852.5.
- With Red edited to `0.2`, clicking the current token produced no departure dialog and retained the edit. Selecting another token opened departure confirmation. **Keep editing** retained the original value and `scrollTop` 852.5. Repeating the switch and choosing **Discard draft** selected the new token and reset inspector content to 0.
- Collapse/reopen at the narrow size preserved inspector content `scrollTop` 1013.5. No sampled browser console warnings/errors were observed. Temporary viewport override was reset; V5.2 remains open for user review.

Screenshots: [proportional controls](../../output/playwright/003-designer-v5-2-controls.jpg), [new token from the inspector top](../../output/playwright/003-designer-v5-2-selection.jpg), [narrow precision-field minimum](../../output/playwright/003-designer-v5-2-narrow.jpg).

Full accessibility coverage, actual browser zoom, real-device virtual keyboards and broader V5.1 regressions were not rechecked for these two refinements. Existing numerical-helper and fixture limitations remain.

## V5.2.1 — Resolved-view badge refinement, 7 November 2026

After the designer recommended grouping the existing badge with its heading and the user approved, **Applied value** now sits immediately beside **Resolved color**, with an 8px gap and wrapping when needed. The badge still describes the whole Resolved & trace view: specimen, components, alpha and trace. Its styling and wording are unchanged; no additional status or control is introduced.

This is a small isolated layout revision over V5.2; the prototype's review toolbar continues to identify the V5.2 series. User review of the actual badge placement remains pending before analyst review. No numerical helper, operation, dependency or application source changed. Isolated typecheck/build and scoped diff checks pass; numerical helper tests were not repeated for this layout-only change. Coordinator browser evidence is recorded separately.

Coordinator check — 7 November 2026: at 649×952, the resolved title and badge measured an 8px horizontal gap at the same vertical position. At 320×568 the group remained within the content width and its wrapping behavior was enabled; no horizontal document overflow was observed. The resolved tab stayed selected for user review and the viewport override was reset. [Updated resolved view](../../output/playwright/003-designer-v5-2-1-badge.jpg). This visual-only check does not repeat prior behavioral/numerical verification.

## V5.2.2 — Trace-section spacing refinement, 7 November 2026

After the designer identified the unlayered heading reset overriding Tailwind’s intended `mt-7` spacing and recommended restoring its 28px gap, the user approved this isolated correction. **Resolution trace** now has a scoped 28px top margin above its heading. The existing gap below the heading, other headings, divider treatment and all interactions remain unchanged.

The badge refinement in V5.2.1 remains. The toolbar continues to identify the V5.2 series; actual-artifact review still precedes analyst review. No numerical helper, dependency, operation or production source changed. Isolated typecheck/build and scoped diff checks pass; numerical tests were not repeated for heading spacing alone. Coordinator screenshot evidence is recorded separately.

Coordinator visual check — 7 November 2026: the rebuilt resolved tab at 649×952 shows clear separation between the final detail-row divider and Resolution trace, with the scoped 28px rule in place. The trace content/spacing below the heading is retained. [Updated trace spacing](../../output/playwright/003-designer-v5-2-2-trace-spacing.jpg). The viewport override was reset and the resolved view remains open for user review; no broader behavioral checks were repeated for this spacing-only correction.

## V5.2.3 — Selection-indicator weight, 7 November 2026

The user explicitly requested stronger selection borders in the token list and Resolved & trace tab, plus the same treatment for comparable elements elsewhere. The designer increased the two existing line-based selection indicators from **2px to 4px**, the next spacing step, making selection easier to distinguish while retaining the neutral palette and geometry.

Inventory and scope:

- The shared selected-token-row rule covers ordinary color/alias rows, duplicate-identity fixtures and the inspect-only Number row. All now receive a 4px left selection bar.
- The shared active-tab rule covers **Authored value** as well as **Resolved & trace**. Both now receive a 4px underline when active. There are no other custom tab/line-based selection patterns in this prototype.
- Project/group navigation in both sidebar and drawer uses a filled active surface and stronger text; Literal/Reference uses a filled segmented control. These remain their existing patterns. No new selection bars were invented.
- Dividers, input/swatch borders, slider thumbs and keyboard focus outlines are separate functions and retain their weights. No layout dimensions, interactions, numerical helper, dependency or production source changed.

This source inventory is not a full accessibility audit. Isolated typecheck/build and diff checks pass; numerical helper tests were not repeated for line-weight styling. Coordinator browser samples are recorded separately. Actual-artifact user review still precedes analyst review, and no application implementation is authorized.

Coordinator visual check — 7 November 2026: at 649×952, the selected color-token bar and both inspector-tab active states were checked in the rebuilt preview. The 4px shared rules give the same selection weight to Authored value and Resolved & trace. Screenshots: [Authored tab](../../output/playwright/003-designer-v5-2-3-authored.jpg), [Resolved tab](../../output/playwright/003-designer-v5-2-3-resolved.jpg). The inspect-only row shares the token-row rule but was not separately exercised in this visual pass. Navigation/mode fills were reviewed in source as distinct patterns. The viewport override was reset and the resolved view remains open for user review. Broader behavioral/numerical checks were not repeated for this visual-only revision.

## V5.2.4 — Rounded tracks and compact actions, 7 November 2026

The user approved the designer’s recommendation: fully round the **actual gradient track**, equalize project-start actions and use compact action-button sizing, while preserving structural token rows, tabs, navigation, pane toggles, Literal/Reference segments and square icon controls. This is the expressly agreed scope, not an inferred exception to an “all buttons” request.

The component and alpha sliders now paint their gradients on the native 12px-high track with pill-shaped ends, separately from the 40px/44px input hit area. The thumb remains the existing native styled thumb, centered on the track; keyboard, focus and exact-entry behavior are unchanged. Color gradients pass to the track through a local CSS property. This is a visual treatment, not color gamut or numerical policy.

Action-button inventory:

- Standard **32px**: 18px text line, 6px vertical and 12px horizontal padding, plus the existing 1px borders. Small **28px**: the same text line, 4px vertical and 8px horizontal padding, plus borders. The horizontal/vertical padding ratio is 2:1 in both cases, applied consistently to default, outline and ghost variants.
- **Create project** no longer has its separate 44px minimum; it matches **Explore sample project** at 32px.
- New token, group create/rename dialogs, departure choices, Apply/Cancel, read retry, empty-state actions and Show selected token use the same standard action sizing. The compact panel-header padding and filtered-selection minimum-height overrides yield to that rule.
- Explicitly excluded structural patterns retain their previous dimensions: token rows, inspection tabs, project/group navigation, pane toggles, Literal/Reference segmented controls, header menu and drawer-close icon controls. The last two keep square 44px hit areas.

The existing 4px selection indicators, adjacent Applied value badge, 28px trace gap, component proportions, selection scrolling and all other behavior are preserved. No dependency, numerical helper or production source changed. Isolated typecheck/build and diff checks pass; numerical tests were not repeated for styling alone. Coordinator browser checks, including native-track rendering and measured button sizes, are recorded separately. Actual-artifact user review remains required before analyst review; no application implementation is authorized.

Coordinator browser check — 7 November 2026: at the user’s 887×952 width, both Create project and Explore sample project measured 32px high with 18px line height, 6px vertical and 12px horizontal padding. Sampled New token and Apply changes also measured 32px with the same padding. The visible component tracks showed pill ends; Red ArrowRight updated its exact field to `0.232` while retaining a 40px interaction height. At 390×844, alpha ArrowLeft updated to `0.99`, slider interaction height remained 44px, and the header navigation button / inspector toggle remained 44px. Document width matched the phone viewport and document scrolling remained zero. Cancel restored the disposable baseline; temporary viewport overrides were reset.

Screenshots: [equal project-start buttons](../../output/playwright/003-designer-v5-2-4-start.jpg), [rounded editor tracks](../../output/playwright/003-designer-v5-2-4-tracks.jpg), [phone component/alpha tracks](../../output/playwright/003-designer-v5-2-4-phone.jpg). Small-size and ghost action rules were reviewed in source; not every variant, dialog or browser engine was exercised. This is scoped prototype verification, not a full accessibility or numerical assessment.
