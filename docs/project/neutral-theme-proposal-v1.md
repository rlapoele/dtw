# Neutral / Geist visual proposal V1

**Proposed for user review — 16 November 2026.** This is a visual proposal,
not an agreed design, analyst approval or production implementation authorization.
The user selected Tailwind Neutral, Geist and Geist Mono for exploration and
requested continuity with the [styling ownership audit](../planning/tailwind-styling-ownership-audit.md).
Production source and dependencies are unchanged.

**Analyst review — 16 November 2026:** the user liked V1 and authorized analyst
review plus a combined increment contract, explicitly without implementation.
[Increment 014](../increments/014-neutral-geist-and-styling-ownership.md#design-proposals-and-analyst-review)
records the separate analyst's findings and proposed production dispositions.
Final design/contract agreement and implementation authorization remain pending;
this review pointer does not revise the visual artifact.

## Design judgment

Use a nearly achromatic workbench with a light working surface, slightly darker
supporting panes, fine structural separators and dark neutral primary actions.
Keep the existing dense, content-first [Precision direction](visual-direction.md)
and project/navigation/workspace/inspector responsibilities. Borrow the reference
site's clear hierarchy and technical typography rather than its marketing scale.
Projects uses an editorial title, collection row, restrained section divisions
and generous but bounded spacing around create/restore workflows. Selection is
read only; Open remains explicit. No hero, metrics or new product capability.

The lightest application surface is Neutral 50; supporting panes use Neutral 100.
This avoids pure white and keeps the palette small. The user permits an additional
very-light neutral if surface hierarchy needs it, but V1 does not need one. An
optional single extension at `oklch(99.2% 0 0)` could separate a raised field from
Neutral 50; it remains an unselected alternative, not another default palette step.

The prototype has review navigation outside application chrome: Tokens, Projects,
and Palette & type. It contains illustrative sample data and local presentation
interactions only. It is delivered inline in the review chat, not installed in DTW.
At narrower preview widths, browsing/inspection can be viewed separately. Prototype
container adaptations are for an embedded review, not a replacement specification
for production viewport/focus policy.

## Semantic mapping

Tailwind's installed 4.3.4 palette supplies the primitive values. The prototype
copies the exact OKLCH primitives to remain independent of the production build;
production should reference the built-in palette variables instead of duplicating
those values. Existing semantic `:root` variables map through `@theme inline` to
named utilities. Base UI supplies behavior and does not require another palette.

| Semantic token | Tailwind source | Intended use |
| --- | --- | --- |
| background / foreground | neutral-50 / neutral-900 | Working canvas and default text |
| card / card-foreground | neutral-50 / neutral-900 | Contained working surfaces and content |
| primary / primary-foreground | neutral-900 / neutral-50 | Main action |
| secondary / secondary-foreground | neutral-100 / neutral-900 | Lower-emphasis action surface |
| muted / muted-foreground | neutral-100 / neutral-600 | Supporting pane and supporting text |
| accent / accent-foreground | neutral-200 / neutral-900 | Hover/selection emphasis |
| border | neutral-200 | Subtle structural separators |
| input | neutral-500 | Identifiable control boundary |
| ring | neutral-500 | Focus indication |
| ring-offset | background | Focus separation; alias, not another color |
| destructive / destructive-foreground | red-700 / neutral-50 | Destructive action and content |
| error-surface / error-border | red-50 / red-200 | Supporting validation treatment |

`secondary` denotes a surface, never supporting text. Migrate current
`text-secondary` consumers to `text-muted-foreground` when that is their meaning;
review any exceptional emphasis before consolidation. Existing notice/badge/value
roles should reuse these semantic values where appropriate. Add popover/input
foreground or selection-specific roles only when actual consumers justify them.
Distinct meanings may share a value without requiring distinct palette shades.

Authored colors, exact source, sRGB preview values and illustrative ramps remain
data. The chrome mapping must never replace authored black/white tokens or alter
color creation defaults. The neutral sample in the prototype is illustrative
sRGB data, separate from its OKLCH application palette.

Coordinator source checks using the installed palette and culori report contrast
ratios approximately 17.16:1 for Neutral 900/50, 7.47:1 for Neutral 600/50,
7.15:1 for Neutral 600/100 and 6.01:1 for Red 700/Red 50. These are isolated palette
pair checks, not a runtime accessibility audit. Neutral 200 borders are subtle
structure, not the sole indicator of an interactive control; input uses the
stronger Neutral 500 boundary. Focus/hover/disabled combinations and assembled
components still need focused implementation checks.

## Typography and dimensions

| Role | Face | Size | Weight | Line height |
| --- | --- | --- | --- | --- |
| Page title | Geist | 1.5rem | 600 | 1.25 |
| Inspector heading | Geist | 1.25rem | 600 | 1.3 |
| Section title | Geist | 1rem | 500 | 1.5 |
| Body | Geist | .875rem | 400 | 1.5 |
| Supporting text / controls | Geist | .75rem | 400 / 500 | 1.5 |
| Paths, values, technical labels | Geist Mono | .75rem | 400 / 500 | 1.5 |

No serif face is proposed for the workbench. Mono is reserved for technical
content, not every field or paragraph. The review offers optional body/supporting
text size controls; their changes are exploration, not agreement to another scale.
Narrow editable controls use 1rem to retain usable text entry.

Prefer the audit's 0.25rem spacing foundation and named utilities. V1 uses rem
for visible layout, type, radius and stroke geometry: .0625rem borders,
.125rem focus width and .1875rem focus offset. Major pane concepts retain the
current 13.25rem navigation / 25rem inspector scale; no dimension is silently
rounded as part of color selection. The existing Projects 1.75rem versus Tokens
1.5rem wide padding difference remains. Typography changes intentionally affect
text metrics; they cannot be described as exact screenshot parity.

The preview embeds Geist 400/500/600 and Geist Mono 400/500 font faces, with
system sans/mono fallbacks, so reviewing it does not require external font
requests. Coordinator-supplied preview assets sit beside the inline fragment:
`geist-preview-fonts.css`, `font-provenance.json` (upstream URLs and SHA hashes),
`geist-OFL.txt` and `geistmono-OFL.txt`. This is preview delivery only. The
local-first application should self-host suitably licensed, versioned font files
and include them in its offline asset delivery. Verify the production format,
licenses, weights, loading/fallback behavior and offline availability before
adoption; no font dependency or external service is selected by this proposal.

## Styling cleanup remains part of the eventual work

The visual proposal does not replace or complete the earlier audit:

- **F1/F5:** reconcile browse, inspector and dialog padding at their actual owners.
- **F2/F3/F4:** preserve header wrapping, effective control minima, table columns,
  inspector borders and JS/CSS responsive coordination while removing hidden
  overrides. No blanket move of unlayered rules into a component layer.
- **F6:** implement the reviewed Geist/type scale from one theme source and remove
  duplicated/inconsistent font declarations.
- **F7:** keep parity cleanup separate from any newly approved dimension rounding.
- **F8:** apply this semantic map through existing primitives and retire redundant
  chrome literals, without recoloring authored specimens.
- **F9:** remove only legacy rules whose lack of consumers is confirmed.

The implementation contract should identify baseline screenshots/computed winners,
reviewed intentional color/type changes and unchanged responsive/interaction
behavior. Use Tailwind utilities for ordinary presentation, layered component
defaults where overrides are intended, and focused owner-documented CSS for pane
formulas, native slider pseudo-elements and dynamic specimens. Preserve `[hidden]`,
Button's additive contract, Base UI callbacks and the shared precompiled `cn`.
Check newly exposed theme utilities against generated CSS and class composition.

## Review and verification limits

User review should focus on neutral surface separation, primary/supporting text,
selection/focus/error appearance, Geist's dense UI readability and the restrained
Projects composition. This proposal needs user feedback before analyst review;
analyst review is distinct from final design/contract agreement and implementation.

Designer source review checked role aliases, declared rem sizes, local sample
state and selector/element references; JavaScript syntax and local documentation
links passed. Coordinator inspected desktop Tokens, Projects and Palette/type
views in the browser and exercised review-view switching. The final wrapper's
CSSOM contains the embedded Geist face definitions; its FontFaceSet reports five
faces and loaded status. The native preview did not establish the requested
1024/320 CSS-pixel viewports reliably; narrow layout and larger-font behavior
remain unverified. Host Tweak controls were not exercised. These are prototype
checks, not an independent implementation review or production acceptance.

The new prototype verification used approximately 9 aggregate minutes of its
15-minute ceiling, including source checks, font diagnostics and local preview
startup. One local-server launch retry was needed for sandbox socket permissions;
no further harness work or responsive qualification is being pursued. Font
retrieval/embedding was prototype authoring. No production build/tests were run.
Earlier qualification campaigns remain stopped; this preview does not close their
gaps. Suggested commit: `docs: propose Neutral and Geist visual direction`.
