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
