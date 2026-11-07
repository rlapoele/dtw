# Increment 003 — Designer proposal V5.1

**Latest: 7 November 2026 — [V5.1 proposal and review guide](DESIGN-V5-1.md).** The user selected option A from the designer’s assessment before prototype edits. V5.1 pairs left sliders with right precision fields, elevates the in-layout mobile inspector with visible selected-row context, and replaces compact navigation with a modal left drawer. User review of this artifact is pending before analyst review; no application implementation is authorized.

**V5 history: 5 November 2026 — [V5 proposal and review guide](DESIGN-V5.md).** V5 covers view-only color-space exploration with exact draft restoration, native component sliders plus precision fields, responsive refinements, project creation/empty state and a separate missing-state review gallery. User review is pending before analyst review; no application implementation is authorized. The prototype numerical helper retains V4 limitations and does not implement the agreed production numerical policy.

## V4 history

**3 November 2026. Interactive design revision for user feedback, before analyst review.**

V4 explores collapsible responsive panes and inset **Heroicons Outline** select chevrons at the user’s request. V3.1 established outline iconography. V3 implements agreed **DR-1 and DR-2**: side-by-side applied/draft colors and separately retained Literal/Reference drafts, preserving V2’s explicit **0–255 sRGB entry scale** and **draft conversion between all five color spaces**. It is an isolated, disposable prototype. No production stack, conversion library, precision/gamut policy, domain behavior or implementation has been agreed through this artifact.

The directory keeps its V1 name to preserve the existing preview setup. [V2 notes](DESIGN-V2.md) preserve the preceding proposal and verification. [V1 design notes](DESIGN-V1.md) retain the prior proposal, original limitations and subsequent normalized-sRGB guidance. V1 screenshots remain in `../../output/playwright/003-designer-v1-*`. V2 supersedes V1's blank-on-space-switch behavior and sRGB-only preview restriction; it does not retroactively establish any acceptance criterion.

## Agreed requests for next designer revision

**Agreed by the user on 3 November 2026; implemented in prototype V3 for user review.** These requests amend the isolated prototype, not the production application contract. The user subsequently approved V4 for analyst review on 3 November 2026. The [analyst assessment](../../docs/increments/003-visible-color-authoring.md#analyst-review--v4-3-november-2026) records remaining decisions; final agreement and implementation authorization remain pending.

### DR-1 — Keep the applied color visible

The inspector must keep a clearly labeled **Applied color** swatch visible alongside the **Draft preview** while editing, including when switching between Literal color and Reference. The applied swatch represents the selected token's latest successfully applied color; it must not require opening another inspector tab. Preserve the authored/applied summary and distinguish the two states with labels rather than color alone.

- Editing components, changing color space, switching authoring mode or choosing a reference target changes only the draft preview.
- Successful Apply updates the applied swatch and summary. Rejected Apply leaves them unchanged and keeps the draft available for correction.
- Cancel restores the applied editing baseline. Selecting another token shows that token's applied color, subject to the existing unapplied-edit departure confirmation.
- Where an applied color cannot be resolved or previewed, show an explicit unavailable state rather than substituting the draft or an invented color.

### DR-2 — Preserve Literal and Reference drafts across switches

Maintain separate temporary drafts for the two authoring forms within the selected token's editing session. Changing the visible form alone must neither erase edits nor apply a value.

| Interaction | Required result |
| --- | --- |
| Literal → Reference → Literal, without choosing a target | Restore the literal draft's space, components and alpha. |
| Choose a reference target, then return to Literal | Restore the same literal draft; choosing a target does not destroy it. |
| Return to Reference before Apply | Restore the selected reference target. |
| Return to an in-progress literal entry | Preserve its sRGB entry scale and incomplete/raw entry text as well as normalized draft values. |
| Cancel | Discard pending edits in both forms and restore the applied baseline. |
| Successful Apply | Commit only the active form, update the applied preview and establish the new editing baseline. |
| Rejected Apply | Preserve the applied value and the pending drafts. |

Inactive drafts are temporary interface state, not additional canonical token values. Switching an applied alias to Literal must not silently flatten its resolved color: a token without literal authorship needs an explicit new literal draft. Retain the existing departure confirmation and prevent drafts from leaking between tokens. Preserve V2's normalized sRGB storage, entry modes, conversion behavior, alpha handling and invalid-input feedback.

### Resume and review gate

A separate designer prepared **V3 on 3 November 2026**. Show the actual prototype to the user before any analyst/reviewer/developer handoff. User approval for that handoff, analyst assessment, final contract/design agreement and application implementation authorization remain distinct.

## V4 — Responsive panes and select chevrons

**User-requested prototype revision, 3 November 2026; approved by the user for analyst review.** This revision adds an Outline `ChevronDownIcon` inset 12px from the end of every native select. Native selection semantics and keyboard behavior remain; 38px end padding keeps text clear of the decorative, pointer-transparent icon. A shared local `Select` presentation component covers editor controls and create/rename dialogs without adding a dependency.

The left **Project groups** and right **Token inspector** panes have visible keyboard-accessible collapse/reopen buttons with `aria-expanded` and `aria-controls`. Pane contents remain mounted behind an explicit `hidden` rule, preserving selected tokens, both draft forms, raw entries, entry scale and current inspection tab. Hiding a pane never applies or discards edits; hidden controls leave the tab order. The toggle stays visible/focused when its contents are hidden.

Prototype-only layout choices:

- **Desktop, 1120px and above:** both panes initially expanded, collapsing toward their respective outer edges into 52px rails.
- **Tablet, 768–1119px:** groups initially collapsed; inspector initially expanded at the right. Both can reopen independently. The token list and inspector scroll independently; the inspector remains beside the token list.
- **Mobile, below 768px:** both panes initially collapsed. Groups reopen above the token list. The inspector reopens in a bottom row with its own scrolling; it shares the remaining height with the token list (approximately 55/45) and uses a persistent 43px reopen bar while collapsed. It occupies layout space rather than covering content. Groups are capped at 22dvh so the list and bottom inspector remain reachable.
- These are page-load defaults only. Resizing preserves the user’s current expanded/collapsed choices and does not automatically hide focused controls. Selecting or creating a token reopens the inspector; existing unapplied-edit departure confirmation still runs before changing the selected token.
- The app uses the available viewport height. Header, notice and footer remain in flow; pane contents scroll to expose all fields and Apply/Cancel actions. There is no new drawer library, storage or production architecture choice.

Try editing a literal in byte mode, switch to Reference and choose a target, then collapse/reopen the inspector in each layout. Both drafts should return unchanged. On mobile, collapse the bottom inspector to browse tokens, then select a token to reopen it. In each layout, open a group or create-token dialog to inspect the same inset select treatment.

V4 verification and desktop/tablet/mobile screenshots are recorded below. No analyst/reviewer handoff or application implementation is authorized by this revision.

## V3.1 — Outline icon refinement

**User-requested direction, 3 November 2026:** use [Heroicons Outline](https://heroicons.com/) for icons. The isolated prototype now imports official React components from `@heroicons/react/24/outline`, pinned to **2.2.0** in this artifact’s package and lockfile. [Official usage documentation](https://github.com/tailwindlabs/heroicons#react) was checked on that date. No root dependency or production stack choice changes.

Decorative character icons are replaced for the workbench mark, session information, all-tokens navigation, group chevron/folders, add actions, search and reference indicators. Icons inherit the surrounding neutral color and use consistent sizing; all are `aria-hidden`. Text button names and field labels remain accessible. The project’s `S` monogram and meaningful text separators remain text. DR-1/DR-2 interaction behavior is preserved.

## V3 interaction notes

- **Applied color** and **Draft preview** are labeled side by side above the authoring controls, in both forms. The applied specimen and summary use applied token data only. Missing resolution, incomplete inputs and unsupported preview gamut retain explicit unavailable explanations.
- Form switches preserve the literal color space, components, alpha, sRGB entry scale and raw byte text, plus the independent reference target. Edits in either form contribute to departure protection, including edits hidden in the inactive form. Switching alone never applies a value.
- **Cancel** discards both forms and restores the applied editing baseline. **Apply changes** validates/commits only the active form; rejection preserves both drafts. Success starts a fresh baseline for that authored value and clears the old inactive draft. The active literal entry scale remains selected after literal Apply; reopening another token starts normalized entry.
- An applied alias starts its literal form with empty channels; its resolved color is never silently copied into a new literal. The current reference target stays visible in the selector even if an earlier fixture edit changed that target into an alias; the existing one-hop preview limitation remains explicit.

## Try V3

1. Select `color / blue / 500`, choose **0–255 scale** and enter `250, 30, 30`, alpha `0.6`. Applied color remains blue beside the translucent red draft.
2. Switch to **Reference**, choose `color / neutral / 900`, then switch back. The literal values, alpha and byte scale return. Switch again: the selected reference target returns.
3. Return to Literal and replace Red with `0.`. Switch away and back: this incomplete raw text is retained, its draft specimen is unavailable, and Apply is disabled until corrected. Cancel restores the applied baseline and clears both pending forms.
4. With a fresh sample, draft a literal on `color / blue / 500`, switch to Reference and choose `color / accent / primary`. Apply rejects the cycle without changing the applied blue. Both the reference selection and the inactive literal draft remain available.
5. Edit only a reference target, return to the unchanged literal form, then select another token. The departure dialog still protects the hidden reference edit. Keep editing restores it; Discard draft removes both pending forms without transferring them to another token.
6. Apply a valid literal or reference, then edit and Cancel. Both specimens and the applied summary follow the new applied baseline. When that baseline is an alias, its new literal draft is empty.

Screenshots: [literal draft](../../output/playwright/003-designer-v3-literal.png), [reference draft](../../output/playwright/003-designer-v3-reference.png).

## View and run

Preview: **http://127.0.0.1:4173/** (loopback only). Existing preview process serves rebuilt `dist/`; no user browser tab is automatically reloaded.

From this directory:

```sh
npm ci
npm test
npm run typecheck
npm run build
npm run preview
```

`npm test` uses Node's built-in test runner and TypeScript stripping (verified Node `24.14.1`), without another testing framework. `npm run dev` can replace preview for source iteration; both use strict port 4173, so stop the current server before changing modes. All dependencies and configuration belong to this artifact, not the root package/workspace.

## Screen and interaction proposal

The same project/group navigation → searchable token list → contextual inspector remains. Color is confined to token specimens and feedback; neutral surfaces, subtle borders, compact type and anthracite actions follow the accepted light Precision reference. Authored and resolved views remain separate tabs. Drafts are isolated until **Apply changes**; **Cancel** preserves the applied token. A departure dialog protects unapplied edits. The session-loss notice remains persistent.

For literal sRGB, **RGB entry scale** explicitly chooses **Normalized · 0–1** or **0–255 scale**. Alpha always remains a 0–1 ratio. Selecting the entry scale alone changes representation, preserves every normalized authored string exactly, and does not create a dirty draft. Byte-scale text may contain fractional values; it is not rounded to an integer. Editing one channel changes only that normalized draft channel via division by 255. The normalized draft is visible beneath the preview in byte mode; currently applied inspection and resolved components always use normalized sRGB coordinates.

Selecting another **Color space** deliberately converts the current literal draft with Color.js. The components synchronize to the selected space; alpha's exact text is retained. This is an approximate new authored-space draft until Apply. It never flattens a reference or copies an alias's resolved value into a literal.

Incomplete byte entries retain their visible text. They suppress the draft specimen, disable Apply, and block space/entry-scale changes with a clear message, so an older normalized value cannot be applied as though it were the unfinished entry. Cancel discards both raw entry text and normalized draft changes. Incomplete normalized fields remain in the draft and fail explicit submission/conversion; their preview explains invalid input. Missing `none` is distinct from incomplete or invalid numeric text.

## Preserved V2 interactions

1. Select `color / blue / 500`, choose **0–255 scale**, and enter Red `250`, Green `30`, Blue `30`. The specimen becomes red. Apply and inspect the normalized applied values: `[0.980392156863, 0.117647058824, 0.117647058824]`. The `color / accent / primary` specimen follows the applied primitive through the existing one-hop sample relationship.
2. Toggle between entry scales before editing. Apply remains disabled; the stored/draft normalized text stays unchanged, including long precise strings. Type a long normalized decimal to inspect string preservation, then toggle without applying. Merely displaying approximate byte coordinates does not rewrite it.
3. With the red draft, change space through **Display P3**, **HSL**, **OKLAB**, **OKLCH**, and **sRGB**. Components update and the specimen stays visually consistent within floating-point/rounding error. Alpha's text stays unchanged. Cancel leaves the previous applied space/components intact.
4. In byte mode clear Red or enter `-`. The incomplete text remains; preview is withheld and Apply is disabled. A space switch is refused without discarding the current space/text. Correct the entry or Cancel.
5. Enter `none` in an RGB component, then attempt a space change. Conversion is unavailable, with current space and draft preserved. No missing component becomes zero.
6. Set a neutral sRGB value such as `0.5, 0.5, 0.5` and convert to HSL/OKLCH. The library's powerless hue is shown as `none`, with zero saturation/chroma. This specific achromatic case can preview and convert back without inventing a hue.
7. In Display P3 enter `0, 1, 0`. Its specimen is explicitly outside the sRGB preview gamut. Convert to sRGB: extended coordinates remain, without clipping/mapping; Apply remains a presentation-only action. No target compatibility claim is made.
8. Existing reference retargeting, explicit source switch, Cancel, draft-departure dialog, search/empty state, group dialogs, and fixed self/indirect-cycle demonstrations remain. Reload before the fixed indirect-cycle example to restore its known sample state.

## Numerical and missing-component boundaries

These are **prototype policies only**, not proposed changes to the exact domain model or canonical persistence format.

- Color.js `0.7.1` performs conversions using JavaScript floating point. The prototype maps authored `display-p3` to Color.js's `p3`; the other four identifiers match. HSL uses hue degrees and saturation/lightness percentages; OKLAB/OKLCH lightness uses 0–1.
- New values produced by byte division or explicit space conversion are formatted with `toFixed(12)`, then trailing fractional zeros are removed. This rounds to at most 12 fractional places, suppresses negative zero, emits no exponent, and rejects non-finite or magnitude ≥ `1e21` results. Values below half of `1e-12` round to zero. Repeated conversions may accumulate rounding error.
- Derived byte-field display uses at most **6 fractional places**, with no integer rounding. This hides multiplication/roundtrip noise (e.g. `250.000000000065` displays as `250`) while retaining fractional entry such as `127.5`. Typed raw byte text remains visible until Apply, Cancel or another representation/space is selected; normalized authored strings are never replaced by this display rounding. Values too large for the non-exponent entry display are refused without changing the draft/scale.
- Representation-only toggles never call that formatting policy to write normalized text. Formatting a byte representation is display-only. An actual byte-channel edit converts that channel; untouched channels and alpha keep their exact strings. Direct normalized typing retains strings rather than passing through floating-point conversion.
- No gamut mapping is requested: use raw `.to(...).coords`, never Color.js `.toGamut()` or `.toString()` (whose default serialization may gamut-map). Extended RGB values are neither authored-clamped nor integer-quantized.
- Preview converts to sRGB using the same library, and withholds the specimen when outside sRGB. Direct sRGB coordinates use strict 0–1 bounds. Cross-space preview tolerates only numerical boundary noise within `1e-10`, rounding that display-only noise to 0 or 1. It never writes back to authored fields or claims color-managed display fidelity. Cross-space specimens are labeled approximate.
- Installed Color.js returns **`null`** for a derived powerless hue, not a usable numeric hue. V2 shows it as authored draft `none`. Conversion accepts a missing hue only when it is the sole missing coordinate and saturation (HSL) or chroma (OKLCH) is exactly zero; that `none` is passed to Color.js as `null`. A numeric authored hue remains intact on same-space/no-op operations. No hue is invented and a lost previous hue is not restored.
- All other missing components, incomplete/invalid numeric strings and non-finite values block conversion. Invalid attempts retain the current space and draft. This is not a complete implementation of CSS missing-component interpolation/conversion semantics.
- V2 checks presentation input completeness, finite decimal notation and alpha bounds. It is not the existing domain constructor or canonical validation engine. It does not establish domain normalization/range rules or strict DTCG conformance. The V1 fixed `0.50` rejection is removed; presentation text is no longer presented as canonical Decimal validation.

## Scope and acceptance-criteria mapping

| Draft criterion | Prototype design evidence | Remaining limits |
| --- | --- | --- |
| AC-1 | Seeded project, groups, token creation, group rename and search remain. | No create-project/empty-session flow or robust duplicate-name/identity UI. Groups remain string-only presentation data; nested rename semantics are not modeled. |
| AC-2 | Literal/reference boundary, explicit apply/cancel, authored/resolved separation, retargeting and dependent specimens remain. | Still one-hop fixture specimens; no actual operation or reference graph engine. |
| AC-3 | All five component editors, explicit byte scale, synchronized conversion, retained strings, alpha, approximate/bounded/unavailable specimens. | V2 intentionally explores behavior beyond draft D2's blank-on-space-change/no-conversion policy. Agreement and contract revision would be required before production. No canonical precision/hue/gamut policy is selected. |
| AC-4 | Fixed rejection states remain. | No whole-candidate namespace/reference validation, missing-target repair or general diagnostic engine. |
| AC-5 | Draft separation, incomplete-text retention, explicit apply/cancel and departure confirmation. | No load/commit failure or unsupported-token fixtures; operations remain sample state transitions. |
| AC-6 | Persistent session-loss notice; no persistence/network writes. | Reload restores the sample, not the proposed empty session. |
| AC-7 | Same labeled controls, native text/select inputs, real Base UI primitives, status/alert feedback and responsive stacking. | Browser checks are narrow; no formal keyboard/zoom/assistive-technology conformance claim. |
| AC-8 | Isolated requested stack with strict build and focused conversion-helper tests. | No production/application wiring or domain regression evidence. |

The unresolved questions and presentation shortcuts in [V1 notes](DESIGN-V1.md) still apply except where V2 explicitly supersedes them. In particular: string-only groups, fixture-only identity, black initial token default, one-hop specimens, no persistence, no storage failure/repair workflow, no project lifecycle and no domain integration. The library/rounding/missing-component choices require later agreement if proposed for the real application.

## Dependencies and official sources

V2 adds only **`colorjs.io@0.7.1`**, exact and isolated in this package/lockfile. Existing exact versions remain: React/DOM `19.3.1`; Base UI `1.9.0`; Tailwind/plugin `4.3.4`; Vite `8.3.5`; React Vite plugin `6.2.1`; TypeScript `7.0.2`; React/DOM types `19.3.0`; CVA `0.7.1`. The actual shadcn Base Button adaptation and Base UI/Tailwind provenance remain documented in [V1 notes](DESIGN-V1.md) and the source component.

Primary sources checked 3 November 2026:

- [Color.js supported spaces](https://colorjs.io/docs/spaces): identifiers, coordinates and scales.
- [Color.js gamut mapping](https://colorjs.io/docs/gamut-mapping): `.to()` retains raw coordinates; serializer defaults differ; gamut mapping is a separate lossy operation.
- [Color.js color object documentation](https://github.com/color-js/color.js/blob/main/docs/the-color-object.md): construction/conversion API; supplemented by installed `0.7.1` types and runtime probes for `null` powerless hue.

No remote API receives color/project data. Color.js runs locally in this prototype's browser bundle. Using it here does not choose it for production.

## V3 verification

- `npm test`: all **8 existing conversion-helper tests passed**. No conversion helper changed; these tests do not test the UI draft session.
- `npm run typecheck` and `npm run build`: passed in the isolated prototype.
- Separate designer’s CUA browser checks covered alias-to-literal blank initialization; literal/reference preservation; byte scale, `250,30,30`, alpha and incomplete raw `0.` retention; rejected indirect-cycle Apply; hidden-draft departure protection and Keep editing; valid literal/reference Apply and new baselines; Cancel of both forms; converted OKLCH retention; and token departure without draft leaks. Applied unresolved specimens were checked using the existing one-hop fixture limitation. Console warning/error log was empty during the checked session.
- Desktop screenshots show both specimens above authoring controls. A 320px layout check found document width 320px and the comparison contained at x=20…300; the temporary viewport override was reset. These are limited browser observations, not formal accessibility or responsive certification.
- `git diff --check`: passed. No analyst/reviewer review or production acceptance claim. Existing one-hop specimens, fixture diagnostics and all numerical/provenance limitations above remain.

V3.1 verification: isolated typecheck, production build, all 8 existing conversion-helper tests and `git diff --check` passed. Designer browser access was unavailable for this refinement; the coordinator performed the CUA rendered check and observed aligned outline icons in the header, notice, navigation, folders, add actions, search, alias rows and reference box, with the applied/draft comparison intact. [V3.1 screenshot](../../output/playwright/003-designer-v3-1-outline.png) records that coordinator check. No new interaction behavior was introduced or independently reviewed.

## V4 verification

- Isolated `npm run typecheck` and `npm run build` passed. `npm test` passed all **8 existing conversion-helper tests**; these do not test pane interaction state. `git diff --check` passed. No dependencies were added for V4.
- Designer browser access remained unavailable. The coordinator performed CUA interaction/rendered checks: desktop collapse/reopen preserved a pending reference to `neutral / 900` while the applied color stayed blue; tablet at **820 × 1000** kept the inspector at the right with groups initially collapsed and inset select arrows; mobile at **390 × 844** started with both panes collapsed.
- The first mobile check exposed document scrolling during inspector expansion/focus. Viewport containment was corrected and the token panel now anchors its absolute live-status paragraph to its own scroll area. Coordinator rechecks observed **scrollY 0**, document height **844**, and root top **0** after expansion and target selection/Tab. Inspector scrolling exposed Cancel/Apply; collapse/reopen retained the pending reference and Cancel restored the applied baseline. The final build retains that bounded layout. These checks are scoped samples, not a formal keyboard/accessibility certification or an independent reviewer assessment.
- Screenshots: [desktop](../../output/playwright/003-designer-v4-desktop.png), [collapsed rails](../../output/playwright/003-designer-v4-collapsed.png), [tablet](../../output/playwright/003-designer-v4-tablet.png), [mobile collapsed](../../output/playwright/003-designer-v4-mobile-collapsed.png), [mobile expanded](../../output/playwright/003-designer-v4-mobile-expanded.png), [mobile actions reached](../../output/playwright/003-designer-v4-mobile-actions.png).
- Existing fixture, one-hop specimen, temporary-session and numerical limitations remain. No production integration or analyst/reviewer handoff occurred. The user subsequently approved V4 for analyst review; the [analyst assessment](../../docs/increments/003-visible-color-authoring.md#analyst-review--v4-3-november-2026) records remaining decisions and missing-state design coverage. Final contract/design agreement and application implementation authorization remain pending.

Suggested commit only if later requested: `design: add responsive collapsible panes to prototype v4`.
