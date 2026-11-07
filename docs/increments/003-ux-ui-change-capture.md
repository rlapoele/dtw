# Increment 003: UX/UI change capture

- Captured: **5 November 2026**, from the user's V4 feedback, by a separate designer.
- Status: **V5 designer proposal prepared for user review; design agreement and contract amendments pending**.
- Parent: [Increment 003](003-visible-color-authoring.md). Numerical baseline: [agreed color-policy bundle](003-color-policy-proposal.md).
- Authorization: capture requirements and check existing prototype coverage. No application or prototype implementation is authorized. This document records requests, a user-delegated interaction baseline, source observations and open decisions; it is not a final design or approval for analyst review.

## UX-1 — Preserve the draft color across space exploration

**User request:** after editing an sRGB draft, switching to another color space should keep the color as close as possible. Returning to sRGB without any edits in the other space should restore the exact sRGB component values present before leaving it. The relevant baseline is the user's current draft, not the last applied token value.

Example to design and verify: edit sRGB components → inspect Display P3 or OKLCH without editing → return to sRGB → see the original draft component strings. Switching spaces must not create cumulative drift merely through exploration. Supported conversion/preview limits still apply; an unavailable preview is not permission to change the color.

**Current mismatch:** the agreed numerical bundle's [space-conversion section](003-color-policy-proposal.md#space-conversion-and-rounding) explicitly permits accumulating approximation, using each converted candidate as the next source and not restoring source text on round trips. The new request therefore requires an explicit amendment to the interaction policy and related acceptance criteria after clarification/design review. The underlying pure conversion calculation can remain approximate; the editor need not repeatedly convert its result to restore an unedited source draft. This capture does not silently replace the agreement.

V4 currently keeps a single literal color in its draft session, not an exact source plus derived representations ([Editor.tsx](../../prototypes/increment-003-v1/src/Editor.tsx), lines 15–23). Each space switch calls `convertColor` with that current color, replaces it with the result, and clears byte text ([LiteralFields.tsx](../../prototypes/increment-003-v1/src/LiteralFields.tsx), lines 9–14). Source inspection therefore does not establish the requested exact round-trip restoration.

**Interaction baseline selected under user delegation — 5 November 2026:** the user asked the coordinator to choose the base scenario from UX/user expectations. Use view-only space switching: exploration alone does not dirty the draft or change its authoritative space. Apply commits the authoritative draft, even if another representation is currently displayed; if nothing else changed, Apply remains unavailable. An actual component edit in a different space makes that representation the new authoritative literal draft, using the agreed calculated-value policy for derived channels and exact entry for directly edited values. Apply commits that draft's space. Returning to the earlier space after an actual edit reflects the newly edited color, not stale cached values. This makes deliberate editing, rather than browsing, the authorship boundary. Derived views are temporary session data, not competing canonical values.

This selected baseline guides the upcoming design proposal; it is not final design/contract agreement, analyst approval or implementation authorization. The formal amendment to the agreed cumulative-conversion interaction remains pending the design/user/analyst sequence.

**Details for the design proposal:**
- Preserve alpha, entry scale and raw/incomplete text through the applicable draft transitions; do not create competing canonical color values or flatten aliases. Define when derived representations are invalidated after real edits.
- Define exact restoration for multi-space trips, Cancel/Apply, failed conversions, and Literal/Reference switching. Existing independent-form draft protection remains a constraint.

## UX-2 — Add graphical component editing and meaningful range context

**User request:** supplement the mostly textual numeric component fields with graphical controls where appropriate, and show what the current value means within that component's range. Hue was the concrete example: a slider or dial could display the hue spectrum and current position.

Sliders and dials are examples to explore, not selected widgets. Precision text entry remains necessary for exact values, missing components and extended coordinates. V4 currently renders labeled text inputs for all three components and alpha ([LiteralFields.tsx](../../prototypes/increment-003-v1/src/LiteralFields.tsx), lines 25–29); it has no graphical component controls.

**Design work to resolve:** select useful controls per space/component; show units and current position without relying on color alone; explain unavailable or approximate range graphics; define keyboard, touch and pointer operation, step sizes and precision entry. Bounded sliders must not clamp an extended authored coordinate or turn `none` into a numeric value merely to display a thumb. Changing the graphical control should be an explicit draft edit under the numerical policy.

The [visual direction](../project/visual-direction.md#preferred-inspection-patterns) already anticipates a visual color widget, but the current contract excludes pickers. Determine whether the chosen component controls fit a bounded revision of AC-3 or require a scope amendment; do not infer approval of a full color picker, HEX editing or broader manipulation tools from this request.

## UX-3 — Usable responsive layouts and accessible interaction

**User request:** the workbench must be usable and accessible on desktop, tablet and mobile-size viewports. Verify what the previous side-panel work addressed rather than assuming that it completed the requirement.

### Existing prototype coverage, checked in source

| Layout or behavior | Existing V4 treatment | Source |
| --- | --- | --- |
| Initial pane state | Groups expanded at widths ≥1120px; inspector expanded at widths ≥768px. | [App.tsx](../../prototypes/increment-003-v1/src/App.tsx), lines 10–11. |
| Desktop | Side panes collapse into 52px rails; central list can shrink and scroll. | [styles.css](../../prototypes/increment-003-v1/src/styles.css), lines 18–19. |
| Tablet, 768–1119px | Inspector remains at the right; groups can reopen; list tools/header wrap. | [styles.css](../../prototypes/increment-003-v1/src/styles.css), line 20. |
| Mobile, <768px | Groups above the list, capped at 22dvh; inspector below it with independent scrolling and a 43px collapsed reopen row. | [styles.css](../../prototypes/increment-003-v1/src/styles.css), line 21. |
| Collapse and reopen | Toggle buttons have names, `aria-expanded` and `aria-controls`; contents stay mounted and use `hidden`. | [App.tsx](../../prototypes/increment-003-v1/src/App.tsx), lines 29 and 32; [styles.css](../../prototypes/increment-003-v1/src/styles.css), lines 16–18. |
| Resize/selection | Initial state is chosen only at mount; resizing does not reset pane state. Selecting/creating a token reopens the inspector. | [App.tsx](../../prototypes/increment-003-v1/src/App.tsx), lines 10–11, 19 and 22. |

The [V4 verification notes](../../prototypes/increment-003-v1/README.md#v4-verification) attribute prior coordinator browser samples at tablet 820×1000 and mobile 390×844, including retained drafts, corrected document scrolling and reachable Apply/Cancel. These are historical evidence, not independently repeated checks in this capture.

**Conclusion:** responsive side-panel behavior exists in V4; complete responsive usability and accessibility are not established. Source includes labeled controls, focus styling, status/error elements and pane semantics, but their presence is not proof of complete keyboard, screen-reader, zoom or touch usability.

**Remaining verification/design coverage:** whole create→edit→alias→inspect flow at representative widths and short/landscape heights; expanded-pane combinations; long exact values/paths/errors; dialogs; focus/order/visibility; 200% zoom and reflow; touch targets; mobile virtual keyboard; assistive-technology feedback; and any new graphical component controls. Include the still-missing project-start/identity/failure states from the [V4 analyst review](003-visible-color-authoring.md#3-before-final-design-agreement-complete-the-missing-state-handoff-without-redesigning-v4). Exact breakpoints and pane proportions remain design proposals. No formal accessibility conformance claim is made.

## Next handoff

On 5 November 2026, the user confirmed no further changes for now and requested the designer proposal before analyst review. The separate designer prepared [V5](../../prototypes/increment-003-v1/DESIGN-V5.md), presented for user feedback. No approval for analyst review, final agreement or application implementation is inferred.

Use UX-1’s user-delegated view-only baseline to prepare an identified designer proposal covering these requests and the missing-state supplement. Present material proposals to the user before analyst review. After the user approves the proposal for that review, the analyst reconciles Scope, D2, AC-3/AC-7 and the numerical-policy interaction section as needed. Final contract/design agreement and explicit implementation authorization remain separate.

This capture used source and the repository's attributed historical verification notes only. No current browser, rendered audit, new screenshots, runtime interaction tests or accessibility certification were performed. No prototype/application source or dependencies changed.

## V5 review feedback — 7 November 2026

The user supplied three annotated browser comments for designer assessment and a proposed direction before any prototype revision or analyst review:

- **V5-R1 — Align component controls:** put the slider on the left and precise input on the right at the same vertical level; put the component label above its input. Apply the layout consistently to component/alpha controls while preserving exact input and unavailable-range behavior.
- **V5-R2 — Elevate the mobile inspector and retain selection context:** give the bottom inspector a light shadow so it reads as above the token list in visual depth. When it opens, scroll the token-list container as necessary to keep the selected token visible. The coordinator interprets “visually above” as elevation, not moving the inspector to the top; the revised artifact returns to the user for feedback.
- **V5-R3 — Compact navigation drawer:** on viewports too narrow for persistent left navigation, replace the top accordion with a panel that slides in from the left and covers underlying content. Propose a visible header control at the left to open it. Exact compact breakpoint and drawer geometry are design choices to review. Preserve keyboard/modal behavior, motion preferences, focus return and pending drafts.

These are scoped requests for the isolated prototype. No analyst review, final contract/design agreement or application implementation is authorized.

### Designer assessment before prototype edits — 7 November 2026

The user clarified that the designer must form its own opinion on requested changes and visual design, propose options or ideas for user feedback, and only then implement approved prototype changes. The coordinator paused the direct-edit approach; no prototype source or build changes had been made. V5 remains the current interactive artifact. Next: designer assessment and reviewable options, user feedback/approval of direction, then any authorized isolated prototype revision; user review of that artifact still precedes analyst review. This sequence does not authorize application implementation.

The separate designer’s [assessment and options](003-v5-design-assessment.md) recommend a refined split workbench (A), with a focus-sheet alternative (B). The user subsequently approved option A for isolated prototyping on 7 November 2026; option B is not selected. The updated artifact must return to the user before analyst review. No application implementation is authorized.

Option A was prototyped by the separate designer as [V5.1](../../prototypes/increment-003-v1/DESIGN-V5-1.md) and presented for user review on 7 November 2026. Scoped browser evidence and limits are in the artifact guide; no approval for analyst review or application implementation is inferred.

## V5.1 review feedback — 7 November 2026

The user supplied two additional annotated comments at 649×952:

- **V5.1-R1 — Component proportions:** sliders occupy too much horizontal space; assess approximately two-thirds slider and one-third precision input while keeping labels above fields, alignment, exact values and narrow-layout usability.
- **V5.1-R2 — Inspector entry point:** when selecting a token while the inspector is open, show the new token from the top of the inspector rather than retaining the preceding token’s scroll position.

The separate designer is assessing these requests before any further prototype edits, following the user's assessment-first workflow. Approval of a specific treatment remains pending; no analyst review or application implementation is authorized.

On 7 November 2026, the user approved both assessed V5.1 refinements: a 2:1 usable-width ratio with a protected precision-field minimum, and inspector top reset after an accepted switch to a different token. A separate designer is preparing the isolated revision; the artifact must return to the user before analyst review. No application implementation is authorized.

The separate designer prepared [V5.2](../../prototypes/increment-003-v1/DESIGN-V5-2.md), presented to the user on 7 November 2026 with scoped browser evidence. Approval of the refinements for prototyping is separate from review of the artifact; analyst review and application implementation remain unauthorized.

## V5.2 badge placement — 7 November 2026

The user asked about the scope of “Applied value” in Resolved & trace. It describes the applied-state resolution view (specimen, components, alpha and trace). After the separate designer assessed the placement, the user approved grouping the existing badge immediately beside “Resolved color,” with a small gap, unchanged styling and narrow wrapping. The designer is applying this isolated visual refinement; no copy/semantics change, analyst review or application implementation is authorized. The revised artifact returns to the user.

## Resolution-trace spacing — 7 November 2026

The user requested more space above Resolution trace. The separate designer assessed the missing intended margin and recommended restoring a scoped 28px gap without changing other headings or the space below this title. The user approved this isolated prototype fix and requested presentation before analyst review; no application implementation is authorized.

## Selection-indicator weight — 7 November 2026

The user explicitly requested implementation of stronger selected-token left bars and active-tab underlines, plus the same treatment for other comparable elements found in the prototype. The separate designer reviewed selection patterns and selected the next weight step, 2px to 4px, for shared token-row and inspector-tab indicator rules. These shared rules also cover the Authored value tab and inspect-only Number row. Navigation and Literal/Reference selection use filled surfaces; no new bars, global border thickening or focus-outline changes are implied. The isolated revision returns to user review before analyst review; no application implementation is authorized.

## Rounded tracks and compact action buttons — 7 November 2026

The user requested rounded visible slider bars, action-button horizontal padding at least 1.5 times vertical padding across sizes/variants, and Create project matching Explore sample project. After the designer’s assessment, the user approved pill-shaped 12px tracks with existing larger interaction areas, standard 32px action buttons (6px vertical / 12px horizontal insets) and small 28px action buttons (4px vertical / 8px horizontal insets). The agreed scope preserves structural token rows, tabs, navigation, pane toggles, mode controls and square icon-control layouts. The separate designer is preparing the isolated revision and must show it before analyst review. Application implementation remains unauthorized.
