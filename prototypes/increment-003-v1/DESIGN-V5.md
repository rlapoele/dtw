# Increment 003 — Designer proposal V5

**5 November 2026 · User review pending · No analyst review or application implementation authorized.**

This isolated interactive revision covers the [three captured UX/UI requests](../../docs/increments/003-ux-ui-change-capture.md) and the [V4 missing-state finding](../../docs/increments/003-visible-color-authoring.md#3-before-final-design-agreement-complete-the-missing-state-handoff-without-redesigning-v4). It retains V4's neutral Precision shell, Heroicons Outline, applied/draft comparison, independent Literal/Reference drafts, explicit Apply/Cancel and pane collapse. It uses the user-delegated view-only baseline. The numerical bundle's interaction amendment remains pending the user-before-analyst sequence; prototype behavior is not a silently amended production contract.

## View the proposal

From this directory, run `npm run build` then `npm run preview`; open **http://127.0.0.1:4173/**. Check for an existing server first. Reload starts at project creation and discards all session state.

1. Create a named project to see its empty state. Add a root color or a group; reopen the create dialog to see root/parent choices.
2. Reload and choose **Explore sample project** to review the color editor. The **Prototype V5 · review states** toolbar is a design-review aid, outside the proposed product flow. Changing its state resets sample fixtures, with departure protection for edits.
3. In the sample, edit sRGB Red to a long decimal. Change **View color space** through P3, HSL and OKLCH without editing. Return to sRGB: the exact draft string returns. View changes alone do not enable Apply. If an sRGB edit was already pending, Apply commits that sRGB draft even while another representation is displayed.
4. Edit a component in another space: that representation becomes the literal draft. The copy names the draft's current space. Returning to sRGB now derives the edited color; it does not resurrect an earlier stale sRGB draft. Alpha-only changes preserve the draft's existing space.
5. Use hue's spectrum slider and the precise field in HSL or OKLCH. Try an extended RGB value, `none`, or incomplete text: no slider silently clamps it or supplies zero. Exact fields remain available.
6. Use the review-state selector for duplicate/empty identities, Apply failure, unresolved/blocked repair, inspect-only Number and project read failure. These are controlled design fixtures, not domain/storage behavior.

## UX-1 — Explore without changing authorship

A literal editing session keeps one exact literal draft plus a displayed space. Each alternate view is derived directly from the exact draft, never from another derived view. Returning to its space reads the draft itself. The existing approximate helper only calculates disposable representations.

| Interaction | Proposed behavior |
| --- | --- |
| Switch view without an edit | Keep literal draft and dirty state unchanged; show approximate-view context when different. |
| Multi-space exploration and return | Restore the authoritative draft's exact components and alpha; no accumulated view-round-trip writes. |
| Apply while an alternate view is displayed | Commit the authoritative draft and its space. If no authored edit exists, Apply is disabled. |
| Type or move a component control in another view | Promote the displayed representation to the draft; replace the edited component with the entered value; other displayed components remain calculated candidates. |
| Edit alpha in another view | Update exact alpha on the existing draft; do not promote the displayed space. |
| Incomplete text / failed representation | Keep current view, raw text and draft; explain the refusal. |
| Entry-scale exploration | Keep normalized source exact; retain valid raw byte text while browsing other spaces. A real edit in another space invalidates stale byte text. |
| Literal / Reference switch or pane collapse | Preserve both form drafts, the view, entry scale and raw byte text. |
| Cancel | Restore the applied baseline in its authored space and discard both temporary form drafts. |
| Successful Apply | Commit only the active form; establish a new baseline and clear inactive temporary draft. |
| Rejected Apply | Keep applied data and both drafts; focus the error message. |

Alternative representations remain temporary views, not separately persisted colors. An applied alias starts with blank literal fields; inspection does not copy its resolved color into a literal.

**Design detail to assess:** view changes do not themselves create dirty state. “Apply saves the draft in …” makes its target explicit even when viewing another space. Apply resets the view to the newly applied author's space, avoiding a hidden change of meaning after submission.

## UX-2 — Graphical controls alongside precision

Use native linear range inputs rather than custom dials. They retain ordinary keyboard operation and provide a visible value and labeled endpoints. Hue uses a spectrum track; lightness, chroma and axis/channel controls use illustrative tracks. The copy explicitly distinguishes context from a prediction of the resulting color. There is no two-dimensional picker, HEX input, gamut mapping, ramp generator or color expression.

| Component | Proposed visual interval | Slider step |
| --- | --- | --- |
| sRGB / P3 channels | 0–1; sRGB bytes 0–255 | 0.001; byte 1 |
| HSL hue; OKLCH hue | 0–359.9° | 0.1° |
| HSL saturation / lightness | 0–100% | 0.1% |
| OKLAB / OKLCH lightness | 0–1 | 0.001 |
| OKLAB a / b | −0.4–0.4 | 0.001 |
| OKLCH chroma | 0–0.4 | 0.001 |
| Alpha | 0–1 | 0.01 |

These are design proposals for useful control travel, not canonical legal ranges, gamut promises or precision limits. Every field remains directly editable at higher precision. A valid value beyond the visual interval has no misleading clipped thumb; it shows an exact-value explanation instead. `none` and incomplete text likewise keep text entry without a fabricated numeric thumb. Returning to the visual interval by deliberate exact entry restores the slider.

Native arrow keys, Home/End and pointer/touch operation are retained. Visible labels, accessible slider names, `aria-valuetext`, range/step descriptions and numeric endpoints convey meaning without depending on color. Hit areas are 40px high on desktop and 44px on mobile; visible tracks are 12px. Native dial-like continuous hue wrapping is not introduced; exact hue normalization remains a separate domain obligation.

## UX-3 — Responsive and accessible interaction

Keep V4's desktop side panes, tablet right inspector and mobile bottom inspector. Expansion choices survive resizing. Hidden pane contents remain mounted and leave the tab order. Selecting/creating a token reopens the inspector. This revision gives mobile editing more of the remaining viewport than the list, wraps the design-review toolbar, uses full-width stacked component rows and keeps Apply/Cancel in a sticky row within the inspector's scrolling content. Dialogs remain bounded and scrollable. Short-height styling reduces chrome; it does not add a new host or responsive framework.

The proposed full workflow must still be verified at 320px, tablet and desktop widths, short/landscape heights, 200% zoom, virtual keyboard appearance, long names/values/errors and both-pane combinations. Source semantics and a successful build do not prove screen-reader, contrast, zoom or touch usability. No formal accessibility conformance claim is made.

## Missing states and correction behavior

| State | Review surface | Proposed behavior / focus |
| --- | --- | --- |
| Project start | Initial page | Named-project form, persistent temporary-session explanation. Successful creation focuses the empty token region. |
| Empty project / group / search | Actual session list | Explain the absence and offer New token; search offers Clear search. New token supports Project root. |
| Duplicate / empty labels | Identity review state | Paths paired with stable presentation IDs in token rows and reference options; annotated parent/reference examples show same-path and unnamed choices. Select values distinguish IDs. |
| Commit failure | Apply-failure state | Edit and Apply; show operation-specific failure, unchanged applied specimen and retained forms; focus alert, allowing return to fields. Cancel remains available. |
| Read failure | Read-failure state | Do not show an empty replacement as successful data. Explain unavailable inspection; Retry reveals the existing sample and focuses token region. |
| Unresolved reference | Unresolved state / Resolved & trace | Keep missing authored target, with explicit unavailable specimen and target ID; propose correction through the reference control. |
| Repair blocked elsewhere | Unresolved state / Apply | Explain another missing-reference diagnostic, unchanged project and one-edit repair limitation. Retain draft and focus alert. |
| Ineligible token | Inspect-only Number state | Show type/value/protection; no color editor or conversion action. Selecting a color returns to color authoring. |
| Cycle, incomplete input, departure | Existing form/dialog states | Retain V4 protection and correctable fields; Base UI dialog keeps keyboard focus within dialog and restores trigger on dismissal. |

The identity panel's group selectors are annotated interactive specimens; the ordinary prototype group model remains string-based and is not a canonical group engine. Read/commit/repair failure states are deliberate simulations. The Number specimen is inspection-only presentation data. Their purpose is to review wording, hierarchy, choices and focus, not to prove actual storage atomicity, resolution or unsupported-data preservation.

## Acceptance coverage and boundaries

- **AC-1:** project-start/empty states and identity-disambiguation proposal; ordinary group nesting/rename remain fixture shortcuts.
- **AC-2 / AC-5:** separate forms, explicit Apply/Cancel, anchored literal views and failure preservation; reference specimens remain the existing one-hop illustrative resolver.
- **AC-3:** view-only exploration and native component controls are proposed interaction/scope amendments. The pure domain conversion remains a separate implementation obligation.
- **AC-4:** explicit unresolved/repair-blocked/cycle states; no real graph validation or progressive repair implementation.
- **AC-6:** empty initial page and page-lifetime state; sample project is an explicit review action. No storage or backup.
- **AC-7:** responsive/keyboard/focus proposal with numerical precision entry and color-independent labels; broader runtime/accessibility acceptance remains pending.
- **AC-8:** all source/configuration remains in the isolated artifact; no production wiring, host, package or dependency decision is made.

### Numerical limitations retained

`color-tools.ts` is unchanged from V4: Color.js 0.7.1, fixed 12 fractional-place conversion formatting, approximate binary byte conversion, restricted missing-hue handling and the known near-neutral threshold remain. That helper does **not** implement or validate the agreed 18-/12-significant-digit numerical bundle, its limits, raw-polar policy or accuracy gate. Long exact values are preserved by the view anchor while browsing, but a deliberate edit in a derived view still uses this older illustrative helper. No production numerical-accuracy claim follows from the prototype.

The component controls therefore demonstrate proposed editing behavior, not a completed domain conversion feature. No production source, root dependencies, persistence, compatibility profiles or agreed policy documents are changed.

## Checks and user-review gate

Designer checks: isolated `npm run typecheck`, `npm run build` and all eight existing `npm test` helper cases pass. Those tests cover the existing helper, not the new React view session or the agreed numerical policy. Markdown/link/diff checks accompany this artifact. Live browser checks and screenshots, if performed by the coordinator, should be recorded separately with actual sizes, interactions and limits.

Show V5 to the user before analyst review. Assess view-only authorship, linear controls and their proposed intervals/steps, missing-state wording and mobile pane proportions. Record requested revisions; material revisions return to the user. Only after approval of the identified proposal for analyst review should the analyst reconcile the interaction-policy amendment and contract scope. D4, final design/contract agreement and application implementation authorization remain pending.

Suggested commit: `design: propose increment 003 editor and state coverage v5`.

## Coordinator browser evidence — 5 November 2026

The coordinator used the in-app browser against the loopback preview. These are sampled design checks, not independent analyst/reviewer assessment or production acceptance.

- Created a named empty project; observed focus on the token region. Sample data requires an explicit Explore sample project action.
- Edited sRGB Red to `0.123456789123456789`, explored OKLCH and Display P3 and returned: exact text restored. View-only exploration kept Apply disabled when no authored edit existed. A hue-slider ArrowRight promoted the displayed space; alpha-only editing while viewing another space retained sRGB authorship.
- Apply-failure fixture retained the edited Red value and focused its alert; Cancel restored the baseline. Blocked reference repair, inspect-only Number, duplicate/empty identity presentation and read-failure/Retry states were inspected. These remain deliberate fixture transitions.
- Sampled desktop at 1280×720/900, tablet at 820×1000, mobile at 390×844 and short mobile at 320×568. At 390×844 and 820×1000, document dimensions matched the viewport; mobile collapse/reopen retained a hue edit and sticky actions were reachable. A 320×568 create dialog exposed its fields and both actions.
- Found background sticky actions above the modal during a short-mobile check. The designer raised backdrop/popup layers; the coordinator reloaded the final build and verified that both departure and create dialogs correctly cover the background. Final-build hue editing and Cancel were also rechecked. Earlier fixture/layout checks were not all repeated after this CSS-only layering correction.
- No warnings/errors were observed in the sampled browser console. Temporary viewport overrides were reset; the prototype tab remains open for user review.

Screenshots: [editor controls](../../output/playwright/003-designer-v5-controls.jpg), [project start](../../output/playwright/003-designer-v5-start.jpg), [empty project](../../output/playwright/003-designer-v5-empty.jpg), [Apply failure](../../output/playwright/003-designer-v5-apply-failure.jpg), [tablet](../../output/playwright/003-designer-v5-tablet.jpg), [mobile controls](../../output/playwright/003-designer-v5-mobile.jpg), [short-mobile dialog after correction](../../output/playwright/003-designer-v5-mobile-dialog.jpg). Controls and corrected dialog captures show the final build; other captures record the sampled preceding build.

Not verified: full keyboard path, actual browser zoom, screen-reader announcements, contrast audit, real-device touch/virtual keyboard, every short/landscape height, or production numerical behavior. These limits remain acceptance work; no accessibility conformance claim is made.
