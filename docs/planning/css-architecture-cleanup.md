# CSS architecture cleanup — 24 November 2026

User-authorized maintenance, baseline `d115782`. Review/reorganize Tailwind/CSS before
ramp annotations; no ramp interaction redesign or domain changes. The user reports
that reopening a saved ramp is not discoverable; keep this for the annotation pass.

Scope: one semantic root and each cascade block, token-backed notification/preview
chrome, scale-backed spacing, explicit geometry exceptions, three viewport modes
(<880, 880–1119, >=1120px), retained component-container and accessibility queries.
Audit actual consumers when moving formerly unlayered CSS. Preserve mounted/hidden
state, focus, native controls, notifications and reduced motion.

New maintenance verification ceiling: 30 aggregate minutes, one harness repair
(developer12, coordinator10, independent reviewer8). Build/typecheck and affected
presentation tests, generated CSS/cascade checks, representative desktop/tablet/mobile
browser views. Prior Increment024 numerical/retention/browser qualification ceilings
remain closed; this is a separately authorized CSS scope, not a qualification restart.

Guidance: [presentation conventions](../project/presentation-conventions.md),
[Tailwind custom styles](https://tailwindcss.com/docs/adding-custom-styles),
[Tailwind theme variables](https://tailwindcss.com/docs/theme).

## Result

Completed the maintenance scope. `global.css` has one root, base, components, direct
theme and inline-theme block. Application selectors are layered; utility override
priority is intentional and preserved. Native hidden is the sole documented important
base invariant. Top-level font declarations and Tailwind directives are not unlayered
component-selector escape hatches.

Notification roles reuse shared semantic/palette variables, including destructive/error
roles. Hover tint uses current color; preview borders/checkerboards/placeholder chrome
reference semantic/palette values. No hexadecimal literals remain in global.css.
Authored token colors and runtime color calculations remain data, not UI theme tokens.
Scale-based dimensions use --spacing(), with shared pane/control dimensions and retained
documented geometry/typography exceptions. The three viewport modes and compact union
replace the overlapping variants, including former sm labels/history sizing. Container
queries and reduced motion remain; no orientation exception was needed.

## Evidence and limits

- Developer: production build and all four typechecks passed on the final source;
  63 focused layout/coordination/feedback/project tests passed, followed by four toast
  queue tests after the measurement correction. Compiled CSS checked for variable
  expansion, variant order, semantic palettes and layer precedence.
- Independent reviewer `/root/css_cleanup_reviewer` inspected the stable diff against
  d115782, actual consumers and compiled CSS. Found a toast geometry mismatch: inert
  measurement clones lacked live notification borders. Corrected by sharing notification
  geometry and source-rechecked. No remaining correctness finding in reviewed scope.
  The final preview-color substitutions followed review and passed build/typechecks plus
  coordinator source inspection; they were not a second independent review.
- Coordinator: in-app browser observed actual CSS viewport widths 480, 1000 and1280px
  (queried innerWidth; the browser capability request sizes differed). Checked Projects
  browse/inspect hidden-pane transitions, mobile actions/dialog, tablet/desktop controls,
  token creation with visible success toast and desktop pane collapse actions. Native
  sliders and editor remained visible; temporary viewport override reset. This is
  representative browser evidence, not pixel-identical or exhaustive accessibility/engine
  qualification. Initial baseline captures were actual780/2560px, so no same-width
  screenshot-diff claim is made. HMR during source changes reset the synthetic project
  view; final checks used the frozen source.
- Whitespace checks passed. No dependencies, staging, commits or pushes. No domain or
  ramp interaction change. User annotations and saved-ramp discoverability remain next.

Verification stopped at approximately30/30 aggregate minutes, zero harness repairs:
developer13, coordinator9, reviewer8 (one minute reassigned from coordinator to the
final palette/build correction). Earlier qualification stopping decisions remain intact.

Suggested commit: `refactor: consolidate presentation styles and responsive modes`.
