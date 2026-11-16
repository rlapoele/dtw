# Tailwind and global CSS ownership audit

**16 November 2026 — source audit completed; cleanup plan proposed.**

## Scope and authority

The user requested a bounded styling audit and cleanup proposal, preserving the
current appearance and responsive behavior, preferring rem units, a smaller
dimension scale and deliberate use of white/black. No application implementation,
dependency change, theme replacement or renewed qualification is authorized here.
The additional third-party Tailwind skill is not being adopted; use official
Tailwind guidance and the existing [presentation conventions](../project/presentation-conventions.md).

Baseline: committed source at `bf988a0`. Read the complete 339-line
[global stylesheet](../../src/presentation/styles/global.css), searched the 52
production TSX files for consumers, dimensions, palette literals and runtime
styles, and inspected the affected primitives, layout observer and representative
screen consumers. This is a source/cascade assessment, not computed-style,
screenshot, usability or accessibility certification. No browser, tests or build
were run. No independent subagent review is claimed.

The audit uses the repository's document structure rather than introducing a
second tasks directory. Existing increments, acceptance gaps and verification
stopping decisions remain unchanged. The [visual direction](../project/visual-direction.md),
[architecture](../project/architecture.md) and
[open questions](open-questions.md) remain authoritative.

## Assessment

The v4 foundation is already sound: CSS-first configuration, semantic colors,
`@theme inline` aliases, reusable primitives and a shared precompiled `cn`.
The largest maintenance problem is that several JSX utilities describe values
which an unlayered global rule overrides. Responsive policies are also spread
across viewport observation, CSS, container queries and primitive classes.

For normal declarations, unlayered CSS outranks layered utilities. Moving the
whole unlayered section into `@layer components` would reverse several winners.
That is not a safe cleanup by itself. The intended result is one clear owner per
property and responsive state; a base value plus an explicit responsive override
is legitimate. See [CSS cascade layers](https://www.w3.org/TR/css-cascade-5/#layer-order)
and [Tailwind component layers](https://tailwindcss.com/docs/adding-custom-styles#adding-component-classes).

## Concrete findings

Values below describe declared source behavior, assuming matching selectors and
the normal 16px root where a rem utility is compared with px. They do not assert
that every runtime state was exercised. Existing deliberate overrides are
maintenance findings, not newly discovered visual failures.

### F1 — Browse and editor heading padding have competing owners

- [ProjectsWorkbench](../../src/presentation/App/components/ProjectsWorkbench/ProjectsWorkbench.tsx)
  line 74 declares `p-6`; CSS line 206 supplies 28px. Below 880px, CSS line 233
  changes this to 20px vertically and 16px horizontally.
- [TokenEditorContent](../../src/presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenEditorContent.tsx)
  line 65 declares `p-3`; CSS line 208 supplies 24px, then line 244 supplies
  20px/16px below 880px.
- TokenWorkspace padding is wholly CSS-owned: 24px wide, 20px/16px below 1120px.
  This is not a duplicate declaration but belongs in the same migration inventory.

**Proposed remedy:** preserve those distinct values and thresholds in the owning
components' utility classes, then remove only their ordinary padding CSS.
Projects' 28px and Tokens' 24px are explicitly retained by the Increment 013
presentation conventions. Do not normalize their difference during parity work.

### F2 — Header and collapsed inspector rules override utility layout

- [ApplicationHeader](../../src/presentation/App/components/ApplicationHeader/ApplicationHeader.tsx)
  line 4 declares `gap-4 px-5 py-3`. Below 880px, CSS line 238 changes gap to 8px,
  horizontal padding to 16px and wrapping; compact-brand/context ordering and
  the later workbench-history rules at lines 336–339 add state-specific policy.
- [InspectorHeader](../../src/presentation/App/components/TokensWorkbench/components/SelectionInspector/components/InspectorHeader.tsx)
  line 19 declares `gap-2 pl-3`. At widths at least 880px, collapsed-inspector
  CSS lines 228–229 hides labels/status and sets zero padding/gap and centering.

**Proposed remedy:** let each header own its responsive layout; pass an explicit
collapsed state if required rather than silently changing descendant geometry.
Preserve Projects versus workbench history wrapping. Keeping a small, scoped
collapsed-state component rule is also valid if contradictory utilities are
removed for that state. Do not broaden the public component API unnecessarily.

### F3 — Global narrow control height overrides primitive sizes

CSS line 245 sets `min-height: 44px` below 880px on `.button`, every non-range
input, every select and `.component-range`. This overrides `min-h-9`, `min-h-10`
and similar utilities in [Button](../../src/presentation/ui/button.tsx),
[Input](../../src/presentation/ui/input.tsx), [Select](../../src/presentation/ui/select.tsx)
and the color sliders. Fixed `height` and effective `min-height` can therefore
describe different sizes. The selector also affects the native backup file input.
History has another size transition at Tailwind `sm` (640px); the global rule still
enforces 44px below 880px, including the 640–879px interval.

**Proposed remedy:** put the same below-880px minimum into each applicable owned
control, including an explicit file-input policy. Preserve every size's larger
minimum; do not mechanically replace all controls with one height. Keep slider
hit area separate from visible track/thumb size. Preserve the current history
behavior even where it differs from the apparent utility-only intent; changing
the 640–879px behavior would be a separately reviewed design change.

### F4 — Table columns and inspector borders have hidden responsive overrides

[TokenTable](../../src/presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/TokenTable/TokenTable.tsx)
lines 32/41 declares two columns and a third at container `@3xl`. CSS lines
235–237 forces one column below viewport 880px and hides the authored-value cell;
the description has its own container-based visibility. The CSS rule wins even
when a container utility would otherwise match. Inspector JSX declares a left
border while CSS line 234 removes it below 880px; SelectionInspector separately
adds a top border below 768px.

**Proposed remedy:** preserve both viewport and container conditions at the table
owner. Preserve the below-880px left-border removal and below-768px top-border
addition at the inspector owner. Do not merge these thresholds or replace them
with default `md`/`lg`. Inspect header/body column alignment and description/value
visibility together before removing any global rule.

### F5 — Dialog padding is split between primitive and global CSS

[DialogContent](../../src/presentation/ui/dialog-content.tsx) line 5 declares
`p-7`; CSS line 247 replaces it with 20px/16px below 880px. Width, viewport
clearance, max-height, radius and shadow are separate global declarations at
line 217; drawer geometry is different at line 219.

**Proposed remedy:** move responsive padding into the existing primitive. Keep
the modal and navigation drawer distinct. Express elevation/radius through named
theme utilities; retain a focused viewport-sizing formula where it is clearer.
Preserve Base UI callbacks, refs, focus and mounted content behavior.

### F6 — Typography is split across base selectors and role classes

CSS lines 87–117 defines body/headings in px; lines 139–199 defines role and
descendant styles. Text inputs also receive a literal monospace stack at line
176 while `--font-mono` is defined elsewhere with a different fallback list.
`.mono` supplies 11px and line-height may also come from `.helper`. There are
nine distinct literal CSS font sizes: 10, 11, 12, 13, 14, 17, 19, 20 and 24px,
besides sizes supplied by Tailwind utilities.

**Proposed remedy:** first convert equivalent typography to rem and map actual
reusable roles through `--text-*`/`--font-*`; resolve the monospace fallback
difference explicitly. A smaller type scale is a later visual proposal, not an
excuse to round 17px to 16px or 19px to 20px during parity work. Keep semantic
roles such as `text-caption` when meaningful even if their value matches `text-xs`.

### F7 — Rem-based utilities already encode an unusually fine spacing vocabulary

Examples include [Field](../../src/presentation/ui/field.tsx)'s `gap-1.75`
(0.4375rem) and `mb-4.25` (1.0625rem); namespace navigation uses `pb-7.5` and
`source-compact:pb-6.25`; editor tabs use `gap-5.5`, compact `gap-4.5` and
`min-h-10.5`; toolbar uses `mb-6.5`; empty states use `py-17.5`.

**Proposed remedy:** treat this as scale fragmentation, not invalid Tailwind or
px usage. Tailwind v4 numeric utilities derive from `--spacing` and accept
fractional multipliers. Retain values during parity work; propose rounding a
small identified group only after comparing affected screens. Avoid creating
named tokens solely to conceal every one-off measurement.

### F8 — Palette ownership is mostly centralized, with remaining exceptions

CSS lines 16/22 uses pure white for background/primary foreground. Foreground
`#20242d` and primary `#252a33` are already off-black. Literal white also appears
in checkerboards, unavailable specimens and slider thumbs/rings. The swatch
border is translucent black (`#0000000f`), not opaque black. Explicit modal/drawer
shadows use dark tinted alpha colors; Tailwind's default shadows introduce
another elevation/color vocabulary. There are closely spaced neutral text roles
such as notice, badge and secondary colors; similarity alone does not prove
they should be merged.

**Proposed remedy:** separate application chrome from specimen decoration and
authored data. Centralize remaining reusable chrome colors/elevations without
changing their values first. Then review an off-white canvas and foreground-on-
primary pair and neutral-role consolidation as a palette adjustment. No exact
replacement color is selected by this audit. Pure white/black are not inherently
accessibility failures; evaluate contrast and surface separation. Never alter
authored pure-black/white tokens, exact source, previews or creation defaults to
enforce a chrome palette preference.

### F9 — A few legacy rules are candidates for removal

Repository source search found `.project-start`, `.range-ends` and `.exact-data`
only in global.css, with no current source consumers. `.editor-actions` line 214
sets `bottom: -1px`, but the current EditorActions element has no positioning
utility or other matching positioning rule; it appears inert under static
positioning.

**Proposed remedy:** recheck all current source and runtime class generation,
then remove confirmed unused/inert rules in a small cleanup. Do not infer
unreachability solely from a class-name regex or remove historical evidence.

## Styling ownership proposal

| Owner | Responsibility |
| --- | --- |
| Global theme | One source for reusable application colors, fonts, type roles, radii, elevation and justified dimensions; expose named utilities. |
| Base layer | Document defaults, typography defaults and native baseline behavior. |
| Existing UI primitives | Control dimensions, appearance, disabled/focus behavior and actual responsive size policy. Preserve their composition contracts. |
| Screen/component JSX | Ordinary local spacing, layout, responsive visibility and content organization. |
| Focused component CSS | Pane formulas, coordinated state geometry, native pseudo-elements and decorative specimens that benefit from CSS. Name the owning component and reason. |
| Deliberate invariant | `[hidden] { display: none }` currently stays unlayered so display utilities cannot reveal mounted hidden panes. Preserve this behavior unless explicitly replaced and verified. |
| Runtime style | Authored swatch colors and computed illustrative gradients only; these are data, not application-theme values. |

No blanket move of global rules, blanket `@apply`, new merging helper, component
library migration or custom global override layer is proposed. Layer component
defaults where utility overrides are intended, and reconcile both sides of each
conflict together. The current additive Button contract remains intact.

## Units and dimension scale proposal

**Requested direction:** prefer rem broadly, including focus geometry and shadow
lengths; use a small coherent vocabulary and named utilities. **Still proposed:**
the exact scale, conversions and exceptions below. Application units do not
change authored design-token units or SVG icon viewBox coordinates/stroke units.

- Keep Tailwind's 0.25rem spacing base. Prefer working values of 0, 0.25, 0.5,
  0.75, 1, 1.25, 1.5, 2 and 3rem, with 0.125rem for fine spacing where needed.
  These are preferred working steps, not a ban on other scale values. Existing
  1.75rem Projects padding remains during parity work.
- Prefer existing numeric utilities such as `p-6`, `min-h-11`, `w-13`, `w-53`
  and `w-100` where they express the actual decision. At a 16px root these
  correspond to 24, 44, 52, 212 and 400px. Do not register redundant theme
  aliases for every available numeric utility.
- Consider named `--spacing-pane-navigation`, `--spacing-pane-inspector` and
  `--spacing-pane-collapsed` only if coordinated geometry genuinely needs those
  roles in multiple places. For example, 13.25rem, 25rem and 3.25rem preserve
  current default-root dimensions. Scoped grid CSS can consume the same theme
  values or `--spacing()`; JSX uses utilities, not raw variable expressions.
- Expose justified type/radius/shadow roles with `--text-*`, `--radius-*` and
  `--shadow-*`. A modal radius of 0.625rem and its current shadow lengths
  (0 1rem 5rem) preserve the current 10px and 0 16px 80px at a 16px root.
  A smaller radius/elevation set can be proposed separately after visual review.
- Stroke candidates: 0.0625rem hairline, 0.125rem focus width and 0.1875rem focus
  offset. Use named utilities, including narrowly defined `@utility` rules if no
  appropriate standard theme namespace exists. Do not replace `border` everywhere
  mechanically or put CSS variables directly into HTML. Check the precompiled
  `cn` understands new utility conflicts before adoption.
- Slider candidates: track 0.75rem, thumb 1.125rem, existing thumb offset
  -0.25rem; use relative offsets/formulas if necessary to retain alignment.
  Rounded-full replaces a 9999px circular radius where behavior is equivalent.
- Retain px only for an identified need such as a proven hairline rasterization
  exception or a coordinated viewport-query policy. A CSS px is not a device
  pixel. Rem strokes may rasterize differently as the root size changes; inspect
  rather than assuming conversion makes every edge equally crisp.

Rem uses the root font size, not this application's `body { font-size: 14px }`.
Do not set the root to a fixed 16px or 62.5% to make conversion convenient.
At a 16px root, exact conversion can preserve lengths; at a larger user font
setting it intentionally changes them. That accessibility behavior requires
separate verification from default-root visual parity.

Do not independently convert media queries to rem. CSS media-query font-relative
units use the initial font size, while element rem uses the root element's font
size. The observer uses numeric innerWidth thresholds and matching px queries;
changing just CSS could desynchronize pane visibility and focus policy. Keep
1120/880 and the existing 640/768/540/900/short-height distinctions during initial
cleanup. Any query-unit migration must update CSS and matchMedia together and
address the observer's initialization as well as change events.

References: [Tailwind theme namespaces](https://tailwindcss.com/docs/theme),
[spacing function](https://tailwindcss.com/docs/functions-and-directives#spacing-function),
[CSS relative lengths](https://www.w3.org/TR/css-values-4/#font-relative-lengths),
[media query units](https://www.w3.org/TR/mediaqueries-4/#units),
[WCAG text contrast](https://www.w3.org/WAI/WCAG22/Understanding/contrast-minimum.html).
External guidance checked 16 November 2026; installed Tailwind is pinned to 4.3.4.

## Ordered cleanup plan

All tasks below are proposed, not implementation authorization. Group them into
a bounded increment contract if pursued; follow the existing role/design workflow.

| Step | Scope and dependency | Acceptance and focused verification |
| --- | --- | --- |
| 1. Capture the parity baseline | Existing Projects, editor, modal, header and table owners; before edits. | Record computed winners and screenshots at wide, compact and narrow sizes, plus the relevant boundary pairs. Include an open editor, selected table row and modal. Record default font/root settings. This is a cleanup baseline, not closure of earlier acceptance gaps. |
| 2. Resolve padding conflicts | F1 first, then F5 as a separate small slice; depends on 1. | Current wide/compact/narrow padding is expressed at the owner, with obsolete declarations removed. Match the measured baseline; modal clearance/scroll/focus remains intact. Keep slices around 2–4 files. |
| 3. Resolve responsive policy conflicts | F2, F3 and F4 in separate header, controls, and table/inspector slices; depends on 1. | Preserve header wrapping, effective control minima, file-input behavior, table visibility and inspector borders. Each slice checks only its boundary pairs, keyboard/focus and scroll owners; do not combine all into one large patch. |
| 4. Convert remaining dimensions by owner | F6 and focused geometry/strokes, in separate small slices after relevant ownership cleanup. | Rem typography, dimensions and shadows equal the baseline at the default root; larger default-font settings do not clip controls, focus rings or active editor content. Preserve JS/CSS viewport-query synchronization. Rebuild cn tables and check custom utility merging if new utilities are introduced. |
| 5. Remove verified legacy rules | F9; independent small slice after 1. | No current consumers or layout effect; remove confirmed rules only. Review source and relevant before/after view, without removing historical records. |
| 6. Review scale and palette consolidation | F7/F8; depends on the parity cleanup, separate design proposal. | Present exact before/after dimension and neutral-color candidates for user review. Check text/control/focus contrast and specimen separation before implementation. List intended visual changes explicitly; do not claim pixel parity for this step. |

For implemented slices, run the documented build/typechecks and only affected
presentation tests. Check new theme values against generated CSS and existing
class-composition contracts; do not write tests that merely snapshot class strings.
Use focused Chrome checks of affected geometry, focus/hidden behavior, scroll and
slider hit areas. No broader browser, retention or stress campaign is implied.

Baseline coverage should include 1280, 1000 and 640/320 CSS px views as relevant;
compare 1119/1120 and 879/880 for pane policy, 767/768 for the inspector border,
and 639/640 for history labels/sizing when those owners change. Exercise the
table container threshold on both sides independently of viewport width. Add one
larger browser default-font setting and representative zoom/short-height checks
for the rem slice; do not exhaustively cross-product every state.

Before implementation verification, set one aggregate allowance in its contract,
including baseline capture and independent review. Stop at the agreed time/repair
ceiling, or sooner if tooling dominates; report parity as unverified where evidence
is missing. This audit does not restart prior campaigns or consume their unused
allowance. Revert only the current authorized slice if needed, preserving user work.

## Handoff

The request is coherent. Exact default-root parity, broad rem adoption, a smaller
set of dimension values and a softer palette are compatible goals when sequenced:
first clarify ownership, then convert equivalent units, then explicitly review
rounding and palette changes. They cannot all be promised as visually identical
at every font setting and viewport.

Audit verification was bounded to source inspection and documentation review
(approximately 15 minutes, no harness repairs). Findings are existing source
conditions; no runtime regression or full accessibility result is claimed. Only
this audit and the status summary were edited. No staging, commits or pushes.

Suggested commit message: `docs: audit Tailwind styling ownership and propose cleanup`
