# Increment 003 — Designer proposal V5.1

**7 November 2026 · Option A approved for isolated prototyping; actual artifact awaits user review before analyst review.**

This revision follows the [designer's assessment](../../docs/increments/003-v5-design-assessment.md) and the user's choice of its split-workbench option A. It changes only the three [V5 review items](../../docs/increments/003-ux-ui-change-capture.md#v5-review-feedback--7-november-2026). [V5](DESIGN-V5.md) remains the source for other interactions, missing-state coverage and numerical limitations. No application implementation, final design/contract agreement, production dependency or analyst review is authorized.

## Review the changes

Build and preview from this directory as before: `npm run build`, then `npm run preview`. Open **http://127.0.0.1:4173/** and choose **Explore sample project**. Check for an existing preview server first; reloading discards the disposable session.

1. Inspect each color component and alpha: the slider is left and the precision field right, with its label above the field. Track and input share a vertical center line. Exact fields keep their value; long decimals can scroll inside the input rather than being rounded or shrunk. Missing/incomplete/out-of-visual-range values retain the field and show a short explanation in the slider area.
2. At compact widths, open **project navigation** using the leftmost header button. The drawer slides from the left over the workspace, with a backdrop and Close control. Try Escape and reopening it while a component draft is pending.
3. At mobile width, select a lower token, collapse/reopen the inspector, and inspect the list above it. The selected row is revealed by scrolling only the list after its available size changes. The bottom inspector remains in layout with a light upward shadow; it does not cover the selected row.
4. Return to a wide desktop layout: persistent left navigation and its collapse control remain. The color editor, missing-state gallery, Literal/Reference drafts and Apply/Cancel behavior are unchanged.

## Design choices

### Paired component rows

The approved arrangement makes a visual adjustment and its exact value readable together. Each right-hand precision field starts at 7rem wide; the left slider uses the remaining space. Labels sit above the number field. Native slider naming, range descriptions, endpoints, keyboard controls and 40px/44px hit areas remain. The same row layout is used for alpha. A visual range is still an illustrative control interval, never a canonical limit or permission to clamp a value.

### Elevated, in-layout mobile inspector

Below the existing 768px inspector transition, the inspector stays beneath the list and gains a restrained upward shadow. The mobile split allocates the list a minimum of 104px plus a proportional share of available height, so an ordinary selected row can remain fully visible. A layout/resize observation adjusts the token panel's `scrollTop` only when needed. It neither focuses the row nor scrolls the document, changes selection or resets the editor.

This is a bounded prototype treatment, not proof that every long row or virtual-keyboard viewport fits. The list and inspector retain independent scrolling; short/landscape heights, long wrapped identities and real keyboard resizing still need observed checks. If the selected token is excluded by a search/group filter, a named context message identifies it and offers **Show selected token**. Only that explicit action clears the filters; it preserves the editor draft and moves keyboard focus to the revealed row without document scrolling. Ordinary reveal on resize/reopening does not move focus.

### Compact modal navigation

The candidate drawer boundary is **below 1120px**, matching the assessed option. The tablet inspector stays at the right from 768px upward; mobile keeps it at the bottom. The compact navigation rail/top accordion is replaced by a visible header trigger, giving that space back to the list.

One navigation surface is mounted: desktop sidebar or compact modal drawer. The drawer uses the existing Base UI Dialog, with focus containment, Escape/backdrop dismissal, explicit Close and focus return to its trigger. It has its own scrollable contents and a `min(320px, viewport − 32px)` width. Reduced-motion preferences remove transition motion. Its backdrop/panel sit above the inspector and sticky actions; existing create/departure dialogs keep higher layers.

Opening/closing the drawer alone preserves selected token, view and independent drafts. Choosing a group or a create action closes the drawer and uses the existing departure protection where applicable. No new navigation tree, domain model or package was added.

## Checks and limits

Designer checks: isolated `npm run typecheck`, `npm run build`, all **8 existing helper tests**, scoped Markdown file links and `git diff --check`. Existing helper tests do not verify drawer/React session behavior or production numerical policy. Coordinator browser checks and screenshots are recorded separately when performed.

`color-tools.ts`, dependencies and root production source remain unchanged. V5's approximate numerical helper and fixture-only identity/resolution/failure shortcuts remain explicitly limited. No canonical policy or acceptance criterion was silently rewritten by this revision.

The next gate is user feedback on the actual V5.1 artifact. Material revisions return to the user before analyst review. D4 and final design/contract agreement remain pending; application implementation has not started.

Suggested commit: `design: refine component rows and compact navigation in v5.1`.

## Coordinator browser checks — 7 November 2026

The in-app browser checked the loopback preview. These are scoped prototype observations, not analyst review or production acceptance.

- At the user's 796×952 width, the Lightness slider and precision input shared the same 40px height and vertical position; the label was above the right field. The modal drawer covered the workspace and preserved a pending Lightness edit. Escape returned focus to its header trigger after the closing transition; a sampled reverse-Tab remained inside the open dialog.
- At 649×952, selecting a lower token opened the inspector and revealed the full selected row inside the list. At 390×844, the full selected row also remained visible; document width matched the viewport and document `scrollY` remained zero. Wide 1280×900 retained one desktop navigation surface and no compact trigger.
- At 320×568, focusing a precision field initially caused the outer inspector to scroll and clip its header. The designer changed only outer overflow containment; the coordinator reloaded the corrected final build and repeated the field/drawer sequence. Outer inspector `scrollTop` stayed zero and the toggle remained fully within its shell. Inner content and actions remained reachable.
- The explicit filtered-selection cue identified the hidden selected token. **Show selected token** cleared the search only on activation, restored row context and retained a pending hue value (`217.3`). Automatic reveal did not change filters.
- On the final build, a long sRGB Red draft `0.123456789123456789` returned exactly after Display P3 and OKLAB viewing. No sampled console warnings/errors were observed. Temporary viewport overrides were reset and V5.1 was left open for user review.

Screenshots: [paired controls at 796px](../../output/playwright/003-designer-v5-1-controls.jpg), [compact navigation](../../output/playwright/003-designer-v5-1-navigation.jpg), [selected-row context at 649px](../../output/playwright/003-designer-v5-1-mobile.jpg), [corrected short-mobile inspector](../../output/playwright/003-designer-v5-1-short-mobile.jpg).

Final screenshots and exact-return/filter checks use the corrected build. Initial drawer keyboard/draft checks preceded its outer-overflow-only correction. Full keyboard coverage, screen readers, actual zoom, real-device touch/virtual keyboard, arbitrary long rows and all landscape heights remain unverified. Reduced-motion and backdrop/Close behavior are specified in source but were not exhaustively exercised in this run. Numerical helpers remain illustrative.

## Designer assessment of V5.1 feedback — 7 November 2026

**Proposed refinements for user approval; no prototype edits or builds made for this assessment.** The designer inspected the recorded 649px V5.1 screenshot and current row/selection source. This is not a new live browser audit.

### Give precision entry a proportional share

I agree with the suggested **two-thirds slider / one-third input** as the normal balance. The current fixed 7rem input leaves the slider taking roughly four-fifths of the row in the 649px example, while long saturation values are hard to read. A proportional field makes the two editing methods feel more balanced.

Recommend a **2:1 split of the usable row width after the gap**, for every component including alpha, while retaining a **7rem minimum for the precision field**. At narrow widths such as 320px, protect that minimum and let the slider use the remaining space rather than force a cramped one-third field. Preserve the same vertical alignment, label-above-input arrangement, native slider behavior and exact text scrolling. The tradeoff is less pointer travel on the slider; finer exact entry remains available, and no precision or numerical policy changes.

### Begin a newly selected token at the inspector's top

I agree that a new token should begin with its identity and applied/draft context visible. The current editor changes with selection, but its outer scrolling content can retain the previous token's reading position.

| User action | Recommended scroll behavior |
| --- | --- |
| Select a different token, with no pending edits | After selection succeeds and its content appears, set only the inspector content's scroll position to the top. |
| Select a different token with pending edits | Wait for the departure decision. **Discard draft** accepts the switch and starts the new token at the top. **Keep editing** retains the original token, drafts and scroll position. |
| Select the current token again, or collapse/reopen its inspector | Preserve its scroll position and drafts; this is continuation, not a new selection. |
| Edit a value, Apply or Cancel | Do not add a new top-reset rule. Preserve the existing operation/focus behavior. |

Resetting on a new identity costs some position continuity when comparing tokens, but it avoids presenting a newly selected token halfway down another token's editor. The selected-list-row reveal remains independent. Do not scroll the document or move keyboard focus merely to perform the reset.

If the user approves these two refinements, prepare the isolated prototype revision and show it again before analyst review. Existing numerical limitations, unrelated V5.1 behavior and application implementation boundaries remain unchanged.
