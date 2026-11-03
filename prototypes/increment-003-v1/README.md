# Increment 003 — Designer proposal V1

**3 November 2026. Initial interactive design artifact; awaiting user feedback.**

This is an isolated, disposable coded prototype. It has not gone to analyst review and is not implementation authorization, a final stack decision, an implemented increment, or approved reusable production code. It imports no DTW application/domain code. The root package, dependencies, tests and production sources are unchanged.

## View and run

Preview: **http://127.0.0.1:4173/** (loopback only).

From this directory:

```sh
npm ci
npm run typecheck
npm run build
npm run preview
```

For source iteration, use `npm run dev` instead of preview. Both use strict port 4173; stop the current preview before starting dev. The checked-in lockfile belongs only to this artifact. There are no remote services, external fonts, project-data requests or persistence APIs. Reload restores the sample; any session edits disappear. The production increment's proposed empty-on-reload lifecycle is not implemented here.

## Screen job and design contract

Help an author distinguish a color's authored value from its resolved specimen, then deliberately change that authored value without losing the relationship by accident.

One coherent workbench follows the accepted light neutral Precision reference: quiet project/group navigation, a compact token list, and a contextual inspector. White surfaces, cool gray separators, modest radii and an anthracite primary action keep interface color separate from fixture content. The token swatches carry the chromatic emphasis. No charts, dashboard cards, export menu, variation controls or save indicator are suggested.

The primary action is **Apply changes** in the contextual editor. New-token creation is secondary in the list. Group navigation and search narrow the collection; selection drives inspection. A persistent session notice and footer explain loss on reload/close/navigation.

Authored and resolved views are separate tabs. The authored view shows both the open draft and a clearly labeled currently applied summary. Switching literal/reference source or color space changes only the draft. Literal conversion is never inferred; changing space clears its components. The resolved view always shows the applied specimen, even while a draft exists.

## Try the interactions

1. Select `color / accent / primary`. Inspect its authored reference, then **Resolved & trace** to see the path to `color / blue / 500`.
2. Return to **Authored value**, retarget it to `color / blue / 700`, and **Apply changes**. The selected row's specimen and reference label update. **Cancel** discards a draft without changing the applied value.
3. Select `color / blue / 500`; edit exact component text. Applying updates one-hop dependent specimens. A long string is held as entered; no numeric input control or binary number round trip writes back to the text.
4. Reload to restore the sample before the fixed cycle example; select `color / blue / 500`, switch to **Reference**, choose `color / accent / primary`, then apply. A readable rejection keeps the old specimen and draft. Self-targets also show a rejection.
5. Switch an existing reference to **Literal color**. The fields start blank, so the resolved color is not silently copied into an authored value. Switch color space; components clear for explicit re-entry. Display P3, HSL, OKLAB and OKLCH, `none` and extended coordinates have exact fields but no rendered specimen.
6. Set alpha to `2`, or use the component text `0.50`, and apply to see the illustrative invalid-input presentation. Correct the draft or cancel. These are fixed example rejections, **not canonical validation**.
7. Start a draft, then choose another token/group or create something. The Base UI dialog asks whether to keep editing or discard the draft.
8. Use search; unmatched text shows an actionable empty state. Open a group, rename it, or create a new group. Create a token in a group or at the root, with an explicit layer choice. Newly created tokens start with a black sRGB literal as a **presentation default only**, then can be revised.
9. Reload. The sample returns and edits disappear; there is no saved/recovery claim.

## Responsive and accessibility intent

- Native associated text fields/selects, Base UI buttons/dialogs/tabs, semantic navigation/main/aside, visible focus, a skip link, and text alongside color specimens.
- Exact color fields are text inputs; strings such as `none` are not coerced by numeric input controls. Invalid example feedback uses an alert and associated description; apply/cancel feedback uses a status region.
- Base UI supplies tab arrow navigation, modal focus trapping and Escape dismissal. Apply/cancel returns focus to the value-source control. Unapplied-draft departure requires an explicit dialog choice.
- At widths below 900 CSS pixels, inspection moves below the list while group navigation remains alongside. Below 540 pixels group navigation becomes a horizontal strip. The page scrolls; no fixed-height editor or hidden action footer. This is intended to keep content reachable at narrow desktop sizes and 200% zoom.
- These are design intentions and limited runtime observations, not WCAG conformance or complete keyboard/assistive-technology verification.

## Proposed acceptance-criteria mapping

The draft 003 criteria describe the future application-backed increment. This design artifact is not evidence that those criteria pass.

| Criterion | V1 design coverage | Deliberate gaps |
| --- | --- | --- |
| AC-1 | Group navigation, empty group, group rename, create literal token at root/group, layer choice. | Starts in a seeded project; no create-project/empty-session screen. Groups are presentation strings; no identity/collision/duplicate-path or nested-rename proof. |
| AC-2 | Authored vs resolved tabs, explicit mode change/retarget/apply, dependent specimen refresh, cancellation. | Fixed one-hop specimens only. No actual application operation, reference graph resolution, protected-policy fixture or metadata-preservation proof. |
| AC-3 | All five exact-field spaces, string retention, alpha, unavailable-preview state, explicit component reset on space change. | Fixed invalid-input examples only; no constructor validation, hue normalization or precision correctness claim. |
| AC-4 | Fixed self/cycle rejection, retained draft, unchanged applied specimen. | No namespace/reference validation engine, broken-data repair workflow, diagnostic-code explorer or whole-candidate checks. |
| AC-5 | Explicit apply/cancel and draft-departure confirmation; success/failure messaging. | No storage load/commit failure, unsupported token fixtures or real transactional behavior. |
| AC-6 | Persistent session-loss notice; no persistence/network write. | Reload resets the sample rather than opening an empty project. No new-project identity lifecycle. |
| AC-7 | Labeled controls, focus styles, status/alert regions, keyboard-capable primitives, responsive stacking. | No formal accessibility audit; browser/zoom/focus findings below remain bounded to actual checks. |
| AC-8 | Isolated strict React/TypeScript build with requested Vite/Tailwind/Base UI stack. | No connection to shared application operations; root tests unchanged and not rerun as proof for this artifact. |

## Presentation shortcuts and open questions

- Fixture IDs are internal. Group organization uses strings and the specimen helper follows exactly one reference to a literal; neither is a proposed canonical group model or parallel domain engine. The fixed cycle example intentionally names an expected invalid transition without graph traversal. Creating arbitrary deep alias chains is not offered.
- Sample groups use `blue`, `neutral`, `accent`, `surface`, `content` vocabulary. No semantic role is inferred from names/layers. Optional descriptions are shown but not edited.
- Inputs preserve entered strings; this prototype does not claim to validate canonical Decimals or ranges. Its two invalid literal examples only expose a proposed feedback state. Bound sRGB rendering uses numeric checks solely for the visual specimen and never writes back.
- Reference target choices are bounded to literal fixtures, the selected token and the one fixed cycle example. An actual implementation needs ID-based disambiguation for duplicate/empty names, richer diagnostics and the existing operation boundary.
- Group naming and new-token black defaults are illustrative presentation choices, not agreed naming/creation policy. Group rename does not model nested descendant path updates. New project/session setup needs a follow-up design.
- The selected tab design favors separating authored intent from derived inspection. User feedback should decide whether the separate resolved tab is discoverable enough, whether the density is right, and whether exact component editing is clear enough for this first slice.
- Missing-target, unrelated-diagnostic repair, storage failures, protected regeneration and unsupported/ineligible fixtures remain later design coverage, not silently working controls.
- No loading state is shown because the sample initializes synchronously. No import/export, save, backup, Electron or PWA controls are displayed.

## Stack and provenance

Installed exact versions (`npm ls --depth=0`, 3 November 2026):

| Dependency | Version |
| --- | --- |
| React / React DOM | 19.3.1 |
| @base-ui/react | 1.9.0 |
| Tailwind CSS / @tailwindcss/vite | 4.3.4 |
| Vite | 8.3.5 |
| @vitejs/plugin-react | 6.2.1 |
| TypeScript | 7.0.2 |
| @types/react / @types/react-dom | 19.3.0 |
| class-variance-authority | 0.7.1 |

The source-owned Button is adapted from the [actual shadcn Base UI Button source](https://github.com/shadcn-ui/ui/blob/main/apps/v4/registry/bases/base/ui/button.tsx) (MIT): Base UI primitive/props, `cva` variants, and `data-slot` are retained; unused variants/sizes and the `cn` alias are omitted; neutral semantic Tailwind utilities replace registry style hooks. It is not a full generated shadcn kit. Tabs/dialogs directly compose real Base UI primitives and receive the same neutral theme. Native inputs/selects suit the exact-text fields.

Official sources checked for this artifact:

- [shadcn Vite installation](https://ui.shadcn.com/docs/installation/vite): Vite + React + Tailwind plugin setup.
- [shadcn Base UI Button](https://ui.shadcn.com/docs/components/base/button): source-owned variants and Base UI composition.
- [Base UI Tabs](https://base-ui.com/react/components/tabs) and [Dialog](https://base-ui.com/react/components/dialog): component anatomy and controlled dialog state; Context7 `/mui/base-ui/v1.9.0` checked.
- [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite): v4 Vite plugin and CSS import.
- [React controlled inputs](https://react.dev/reference/react-dom/components/input) and [useState](https://react.dev/reference/react/useState): string-valued controlled drafts and local presentation state.

## Verification evidence

- Node `24.14.1`, npm `11.17.0`.
- Isolated dependency install completed. The sandboxed install could not reach the registry; the narrowly authorized installation succeeded outside the network sandbox. npm reported an optional `fsevents` install-script approval warning; no blanket script approval was added.
- `npm run typecheck`: passed strict TypeScript.
- `npm run build`: passed; Vite produced the isolated `dist/` artifact. Final build includes 207 transformed modules.
- `npm ls --depth=0`: all requested exact versions installed, no missing dependency.
- `npm run preview`: running on strict port `4173`, loopback host `127.0.0.1`; HTTP `200 OK` verified with local curl. Sandbox loopback binding/access required narrow escalation.
- Designer visually inspected the coordinator's 1440-pixel-wide desktop capture: the three-pane hierarchy, neutral surfaces, selected-row marker, reference field, applied summary and session-loss notice are legible with no observed overlap or clipped controls. Capture: `../../output/playwright/003-designer-v1-desktop.jpg`. The coordinator observed the editor reflow below the list at roughly 850 CSS pixels; this requires page scrolling and is not a complete zoom/accessibility check.
- Coordinator browser observations: the authored/resolved tabs expose separate views; the resolved tab shows the seeded alias and literal trace. Selecting the current token as target enables an unapplied draft; Apply displays the illustrative cycle rejection while the applied reference stays unchanged; Cancel restores the original target and clears the draft/error. These are supplemental design checks, not independent review or canonical-validation evidence. No analyst assessment has happened.
- Captures: [desktop](../../output/playwright/003-designer-v1-desktop.jpg), [resolved trace](../../output/playwright/003-designer-v1-trace.jpg), and [rejected edit](../../output/playwright/003-designer-v1-rejected-edit.jpg).

Suggested artifact commit message, only if later requested: `design: add increment 003 color workbench prototype v1`.
