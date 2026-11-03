# Increment 003 — Designer proposal V2

**3 November 2026. Interactive design revision for user feedback, before analyst review.**

V2 adds the requested explicit **0–255 sRGB entry scale** and **draft conversion between all five color spaces**, while preserving the neutral workbench layout and literal/reference boundary. It is an isolated, disposable prototype. No production stack, conversion library, precision/gamut policy, domain behavior or implementation has been agreed through this artifact.

The directory keeps its V1 name to preserve the existing preview setup. [V1 design notes](DESIGN-V1.md) retain the prior proposal, original limitations and subsequent normalized-sRGB guidance. V1 screenshots remain in `../../output/playwright/003-designer-v1-*`. V2 supersedes V1's blank-on-space-switch behavior and sRGB-only preview restriction; it does not retroactively establish any acceptance criterion.

## Agreed requests for next designer revision

**Agreed by the user on 3 November 2026; not implemented.** These requests amend the next prototype revision, not the production application contract. V2 remains the current artifact. No designer work or downstream review is started by this handoff.

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

Resume with a **separate designer subagent**, using these requests and the [designer workflow](../../docs/workflow/agent-roles.md#designer-brief). Produce an identified next revision (V3), document its checks and limits, and **show it to the user for review first**. Any material design ambiguity should be brought back to the user. Do not pass the result to an analyst, reviewer or developer until the user approves that next handoff. Prototype approval, analyst assessment, final contract/design agreement and application implementation authorization remain distinct steps.

Suggested resume instruction:

> Resume Increment 003 with a separate designer. Update the isolated prototype to implement agreed DR-1 and DR-2 in its design notes, preserving V2 behavior. Show me the resulting V3 for review before any analyst/reviewer handoff or application implementation.

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

## Try V2

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

| Draft criterion | V2 design evidence | Remaining limits |
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

## Verification

- Node `24.14.1`, npm `11.17.0`.
- `npm test`: **8 focused Node tests passed**. They cover byte mapping/fractions/extended channels and noise-free derived byte displays across all five space roundtrips; unchanged long strings on representation toggle; known red/HSL/OKLAB coordinates; all 25 source/target space pairs and `1e-8` sRGB roundtrip tolerance; preserved alpha; black/white/gray and qualified `none` hue; invalid/incomplete/missing/non-finite input; P3 out-of-gamut raw coordinates; and formatting boundaries.
- `npm run typecheck`: strict TypeScript passed in both the isolated prototype and repository root (root check verifies its existing type boundary only).
- `npm run build`: passed, with real Color.js in the built bundle.
- Retained loopback preview serves the rebuilt artifact; V1 HTTP 200 evidence remains. Coordinator performs V2 browser checks in a fresh tab, without reloading the user's existing tabs.
- Designer visually inspected V2 captures `../../output/playwright/003-designer-v2-byte-mode.jpg` and `../../output/playwright/003-designer-v2-converted-oklch.jpg`: entry-scale selection, red draft/applied-blue distinction, normalized summary, converted OKLCH fields and alpha specimen are clear, without observed overlap. These are limited desktop observations, not an accessibility assessment.
- Coordinator browser check observed entry-mode-only change leaving Apply disabled; `250,30,30` becoming the red normalized draft while applied blue stayed unchanged; alpha `0.4` preserved through HSL/OKLCH; and successful five-space selection with consistent specimens. The final derived-byte-display polish is additionally checked by helper tests; further runtime outcomes remain coordinator-owned.
- `git diff --check`: passed. No analyst/reviewer review or production acceptance claim.

Suggested commit only if later requested: `design: add rgb entry scales and color conversion to prototype`.
