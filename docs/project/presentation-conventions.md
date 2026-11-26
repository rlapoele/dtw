# Presentation conventions

**Agreed working constraints — 9 November 2026.** The user approved these rules for consistent agent-assisted interface development. They consolidate the accepted renderer/visual direction and Increment 004 styling discipline. This agreement authorizes documentation reconciliation only; application refactoring, dependency installation and the next increment remain outside this change.

## Ownership

[AGENTS.md](../../AGENTS.md) carries the concise mandatory rules. This document owns their detailed interpretation and review checks. [Architecture](architecture.md) owns dependency boundaries; [visual direction](visual-direction.md) owns the accepted Precision reference. Completed increments and frozen evidence retain their original meaning.

Apply these rules to new interface work and changes to existing presentation, with verification proportionate to the change. They do not claim every existing component already satisfies every convention.

## File organization and naming

**Established guidance — 16 November 2026.** The user approved these rules after
reviewing presentation ownership and naming. This section owns the decision
procedure; the [ownership map](workbench-component-organisation.md) records current
locations and [architecture](architecture.md) owns dependency boundaries. Generic
skill examples and dated proposal trees do not override these project conventions.
This guidance does not authorize another refactor or application increment.

### Choose the owner from actual consumers

- Inspect current production consumers before adding, moving or sharing a file.
  Keep private code under its actual component or screen owner. Place code used by
  sibling branches at their nearest meaningful common owner; sharing within one
  workbench does not make a file presentation-wide. Tests and test-support consumers
  alone do not justify broadening production ownership. Possible future reuse is
  not a reason to create a shared module.
- Physical ownership, React caller and state lifetime are separate decisions.
  App may call a screen-owned hook to preserve context across screen changes.
  Moving that file must not silently move the call or change keys, mounted ancestry,
  draft lifetime, command authority or focus policy.
- Distinguish component owners, organizational categories and runtime boundaries.
  Generic token/project-agnostic primitives shared across screens belong in `ui/`;
  browser startup, worker transport and infrastructure wiring belong at their
  architecture-defined host/adapter boundary.
  A `.ts` extension does not make a file a helper, and absence of JSX alone does
  not decide its layer.

### Make structure and names express responsibility

- For a named component folder, use PascalCase and keep its matching entry file
  at the folder root. Group actual supporting files into `components/`, `hooks/`,
  `helpers/` and `state/` as appropriate. Hook filenames follow their `use…` exports;
  supporting helper/state filenames use the existing kebab-case convention.
  Shared categories such as `ui/`, `lib/` and `styles/` stay lowercase.
- A simple child may be a standalone file in its parent's `components/`. Add a
  named folder when supporting files or a substantial subtree justify it. Do not
  create empty categories, speculative wrappers or a one-folder-per-leaf rule.
  Related pane/drawer exports may share one module when that is their useful owner.
- Name components and hooks for their complete current responsibility, and revisit
  names when behavior changes. For example, AuthoringDialog covers creation and
  rename; SelectionInspector handles tokens and groups. Avoid repeating a parent
  name when a role-specific name is clearer; retain qualifiers that disambiguate
  responsibilities. Follow established screen names ProjectsWorkbench and
  TokensWorkbench; singular compounds such as TokenEditor remain appropriate.
- Evaluate common layout separately from shared workflows. Similar screens may
  share a layout without sharing selection, commands or editor state. Do not
  extract a generic framework or force the component hierarchy to mirror the
  domain containment model.

### Review the affected resulting tree

Before handoff, the developer and reviewer each perform a bounded structure check
of affected files and their actual consumers, rather than reviewing only changed
lines. For small work without a separate reviewer, the implementing agent performs
this check and does not claim independent review.

1. Check each changed file's role, production consumers and nearest meaningful
   owner. Look for private code left in a broad shared folder and host/adapter
   responsibilities placed in presentation.
2. Check names against complete current responsibilities and neighboring naming
   conventions. Identify obsolete grouping folders, redundant wrappers and empty
   directories; do not flatten a useful owner merely to reduce depth.
3. Confirm placement changes preserve caller/state/session ownership, component
   keys, semantic roots, focus policy and relevant component APIs. Distinguish
   source evidence from behavior actually exercised by tests or a browser.
4. For moves/renames, check imports, exports, actual destination casing and Git's
   view of paths; a case-insensitive filesystem is not proof of committed casing.
   Respect the repository's user-owned staging/commit policy. Update current path
   documentation while preserving identified historical snapshots and evidence.
5. Report concrete convention/dependency violations separately from optional
   organizational preferences or newly proposed product structure. Resolve work
   within the agreed scope and surface material decisions; this check is not an
   invitation to sweep unrelated files or add approval stages.

Use the existing proportionate verification allowance. Record the check and any
material exceptions in the handoff; a new automated structural test or broad
qualification campaign is not required by this guidance.

## Neutral theme and token source

Use shadcn-style semantic theming adapted to the accepted neutral Precision design. Content-first means clear token content, controls and feedback supported by restrained chrome. Increment 014 adopts the agreed Tailwind Neutral semantic mapping and Geist / Geist Mono typography; this remains a content-first workbench. Preserve accepted density, hierarchy, compact actions and inspector/navigation surfaces. Stock theme scaffolds must not silently replace those decisions. Color specimens and meaningful semantic feedback may use color.

Keep semantic design values in one source, currently `src/presentation/styles/global.css`. Map referenced semantic CSS variables through Tailwind's `@theme inline` namespaces: for example, `--color-background: var(--background)` exposes `bg-background`. Use the namespace appropriate to the decision, such as `--color-*`, `--radius-*` or `--font-*`. Focused CSS can reference the same source. Values defined directly in `@theme` also have one source; avoid adding a duplicate alias layer without a need. Application theme tokens remain distinct from user-authored design-token data.

## Inspector action placement — 20 November 2026

[Increment 023](../increments/023-token-description-and-inspector-sections.md)
supersedes the earlier tab-local action placement. A common **Edit token** section
above Applied / Resolved & trace contains Description, Layer and value fields.
Its one action/error/recovery footer stays visible when fields are collapsed; there
is no action-top hairline and the action row uses `pt-1`. Idle helper copy is empty.
Successful Apply and Cancel reopen the editor and focus Description after commit.
The existing session hook retains draft, recovery and command ownership.

InspectorSection supplies native heading buttons with expanded/content linkage,
hidden collapsed content and shared Heroicons chevrons. Tailwind transform motion
is suppressed for reduced motion. Edit token initially opens; read-only sections
initially close. Per-token session choices survive tab switches. ExactSource uses
that treatment for authored and raw derived source, retaining bounded rendering,
explicit requests, retry and stale-generation guards. Metadata contains direct
identity/path rows and the single Regeneration row. ColorEditor delegates its
initial top spacing to its sole production caller so field gaps remain consistent.

Earlier action-placement verification remains historical; current checks and
remaining limits are recorded in Increment 023.

## Applied HEX summary — 20 November 2026

At the user's request, Currently applied includes a read-only **HEX (sRGB preview)**
row. It uses the applied literal or applied resolved reference, never the editor
session. The shared workbench HEX preview helper preserves the token list's existing
conversion, gamut mapping and six-digit display policy; alpha stays separate.
Unavailable previews show “Unavailable” with the diagnostic in the title.
The authored space and coordinates remain visible and unchanged.

Typechecking, 12 focused HEX-preview/token-list/editor rendering tests and diff
checks passed. The editor assertion checks that a red draft leaves the applied
black HEX unchanged. Source review confirmed shared helper placement under the
nearest common workbench owner and unchanged session ownership. Browser rendering
was not repeated for this display-only addition. Focused verification stopped after
approximately two minutes, zero harness repairs; earlier qualification stays closed.

## HEX color entry — 20 November 2026

The user approved adding HEX alongside the existing sRGB component fields, with
alpha kept separate. This bounded editor enhancement uses the existing canonical
color model and Apply/Cancel workflow; it does not introduce a color space.

- The sRGB view accepts three or six hexadecimal digits, case-insensitively,
  with an optional `#` and surrounding whitespace. Four/eight-digit alpha forms
  are not accepted; the inline guidance points to the separate alpha control.
- Viewing HEX quantizes only the display to eight bits per channel using existing
  byte rounding. It never changes exact coordinates, alpha or dirty state.
  Missing, invalid, out-of-range or calculation-guarded components have no HEX
  display; no silent clamping or gamut mapping occurs.
- Editing valid HEX replaces all three coordinates with sRGB values using the
  existing byte conversion policy and preserves exact alpha. In an alternate
  sRGB view this promotes the draft to sRGB, like other component edits.
- Raw HEX belongs to the existing editor session. Incomplete text survives tab
  switches, marks the draft dirty, blocks literal Apply and representation changes,
  and shows an inline error. Component edits supersede HEX text; valid HEX replaces
  stale byte entries. Cancel resets the draft; failed saves retain it. Inactive
  literal errors do not block applying a valid reference.

Verification: 71 focused session, HEX, layer and coordination tests passed;
`npm run build` passed, including typechecking (bundle-size warning retained).
Isolated Chrome exercised synchronized components, invalid Apply, tab preservation,
Cancel, shorthand Apply, exact-alpha preservation and Tab from HEX to Red slider.
The desktop screenshot was inspected. Source review checked actual consumers,
private editor placement, shared Input reuse, existing state lifetime and semantic
classes; no new dependencies, wrappers, icons or style exceptions were introduced.
This was implementing-agent review, not independent review. Screen-reader delivery,
narrow layouts, reload and fault-injected retention were not checked for this change.
Approximately six minutes of the 15-minute focused verification ceiling were used,
with one tooling fallback to the cached Playwright CLI after the wrapper stalled.
Checks stopped after the listed evidence; previous qualification remains closed.

## Color display precision

**Established presentation choice — 18 November 2026.** Show color coordinates
and alpha with up to four decimal places in readable summaries and unfocused
normalized/component entry fields. Omit unnecessary trailing zeros. Reuse decimal
text rounding (nearest, ties away from zero) without converting authored text to
binary floating point. This display policy is distinct from calculation rounding.

Focusing a decimal field reveals its full underlying text; typing edits that text.
Focus and blur alone never write a draft, promote a derived color space, or mark a
token dirty. Incomplete or non-canonical input remains verbatim so validation stays
understandable. The existing whole-number 0–255 entry policy remains unchanged.
Precision guidance identifies rounded fields; rounded summaries expose original
coordinates in their title/accessibility text or the existing raw-data disclosure.
Exact source and raw resolution data retain full precision.

Canonical values, conversion candidates (12 significant digits, ties to even),
slider steps, preview rendering, backups and target export policies are unchanged.
The formatter belongs to TokensWorkbench helpers because summaries and the editor
consume it; the focus-aware input belongs privately to ColorEditor. This is a small
presentation change, not a new feature increment or numerical qualification campaign.

## Utilities and exceptions

Use Tailwind's standard scale and existing project-defined utilities first. Avoid arbitrary-value utilities and direct CSS-variable expressions in JSX when named utilities express the design. A meaningful reusable non-standard decision should become a token exposed through the appropriate theme namespace before use. Do not create a token for every isolated measurement, duplicate palette literals in components, or move ordinary utility styling into broad CSS rules or mass `@apply` blocks.

Keep necessary exceptions focused: native range track/thumb pseudo-elements, dynamic authored-color specimens, illustrative gradients/checkerboards, and panel/precision geometry that standard utilities cannot preserve. Record the owner, reason and affected verification with the change. Existing exceptions are inventoried in the [Increment 004 evidence](../../output/playwright/increment-004-refactor/final-evidence.md#final-css-disposition-and-ownership).

A runtime color or computed specimen is data, not automatically a reusable application-theme token. Do not impose a blanket ban on inline styles or bracket syntax; inspect purpose and existing alternatives. Material visual changes still follow the user/design agreement workflow.

## Class composition with cn

The [`cn` utility](https://github.com/shadcn-ui/cn) may join conditional classes and resolve Tailwind utility conflicts when combining defaults, variants, states and caller-provided `className`. Keep simple static class strings straightforward. If adopted, expose it through one shared presentation entry point using project import aliases; reuse that entry rather than adding parallel merging helpers.

Preserve each component's documented composition contract. The current Button contract is additive, with geometry/appearance selected through size/variant; conflict resolution must not silently change caller precedence. For Base UI components accepting a `className` callback, evaluate the callback with its actual state before composing its result. Retain owned classes and forwarded props/ref/render behavior. Check custom theme utilities are understood by the merger, so legitimate classes are not discarded as conflicts.

**Adopted and precompiled — 12 November 2026:** `cn` 0.5.2 (MIT, Node >=22)
remains pinned. Import the shared utility from `@presentation/lib/cn`. It now uses
`createCn` from `cn/engine` with generated merge tables, not browser-side `cn/config`.
The compiler reads `src/presentation/styles/global.css`; the `@theme` namespaces
register `text-caption` as a font size and `font-heading` as a font weight directly,
so these names and values have one source of truth. No runtime configuration compiler
or duplicate manual registration is shipped to the browser.

The `cn/vite` plugin generates `src/presentation/lib/cn-tables.generated.ts` at
Vite dev/build start and updates tables when the theme stylesheet changes. The
`cn:build` npm script performs the same generation before typechecking, tests and
test-watch startup. The generated file is Git-ignored; run `npm run cn:build` before
raw compiler/IDE commands that bypass these entry points on a fresh checkout.
All class groups are retained (`full: true` / `--full`) to preserve the shared merger's
behavior for classes beyond the current icon corpus, rather than introducing
source-scanning restrictions. Additional custom behavior not expressed by theme
namespaces would require a build-time extension, not a new runtime merger.

Caller-last precedence, conditional classes and the existing Icon API are unchanged.
Button retains its additive class string and state-callback handling. No package-wide
parity or runtime-performance claim is made. This uses the package's
[documented precompilation interface](https://github.com/shadcn-ui/cn/blob/main/docs/build-setup.md),
checked against the installed 0.5.2 APIs on 12 November 2026.

## Icons

Heroicons Outline is the sole application UI icon family. Reuse the existing `@heroicons/react/24/outline` integration, including when adapting copied/generated components that default to another family. Keep sizing and stroke treatment consistent; avoid ad hoc SVG or text glyph replacements for ordinary interface icons. Product artwork and token specimens are separate from UI icons.

Icon-only controls need accessible names. Hide decorative icons from assistive technology and preserve the native semantics of their containing controls.

**Shared Icon — 12 November 2026:** application callers use
`@presentation/ui/icon`; only that component imports Heroicons directly.
Its typed `name` is one of `menu`, `chevron-down`, `chevron-left`, `chevron-right`,
`folder`, `info`, `plus`, `stack`, `grid` or `close`, backed by explicit imports of
the ten Outline glyphs in use. Add a mapping when a real new icon is needed.

`Icon` defaults to `size-4 shrink-0`, decorative `aria-hidden` and `focusable="false"`.
Caller `className` is merged last through the shared `cn`, allowing explicit overrides
such as `size-5`. Existing marker/positioning classes remain at their call sites.
For an icon that independently conveys meaning, supply `label`; the SVG then has
`role="img"` and an accessible label instead of being hidden. Icon-only buttons
still carry their own accessible control names. Other supported SVG props/ref are
forwarded to the underlying glyph; accessibility defaults are owned by the wrapper.

```tsx
<Icon name="plus" />
<Icon name="folder" className="size-5 text-muted-foreground" />
<Icon name="info" label="Information" />
```

## Owned components and native controls

Inspect `src/presentation/ui/` and the functional blocks under `src/presentation/App/components/{TokensWorkbench,ProjectsWorkbench,WorkbenchLayout}/` before adding another implementation. The [workbench ownership map](workbench-component-organisation.md) identifies the current component and workflow owners. Reuse or extend an existing component where appropriate. Use locally owned shadcn-style components built on Base UI or native HTML, adapted to the product.

Consider `Sheet`, `Dialog`/`AlertDialog`, `Select`, `Combobox`, `Field`, `Input`, `Checkbox`, `Alert`, `Skeleton`, `Spinner`, `Empty` and `Pagination`, alongside foundational `Button`/`Badge` primitives, when a real slice requires them. This list is neither exhaustive nor an installation checklist. Avoid speculative loading, pagination or modal machinery.

Preserve native controls when custom behavior adds no demonstrated value; a styled native select remains valid. Choose a custom Select or searchable Combobox for an actual interaction need. Preserve labels, descriptions, validation errors, keyboard behavior, focus containment/return where applicable, and component contracts. Library primitives alone do not establish accessibility of the assembled interface.

## Verification

For affected interface code, the developer and reviewer check:

- The affected resulting tree was checked against [file organization and naming](#file-organization-and-naming), including actual consumers, ownership, responsibility names and obsolete wrappers.
- Existing primitives were reused appropriately; additions and dependencies serve the scoped feature.
- Named utilities and semantic tokens express ordinary styling; exceptions have an owner/reason and no duplicated palette or cascade workaround.
- UI icons use Heroicons Outline and controls retain accessible names.
- Class composition retains defaults, variants, conditions, caller behavior and callback state. Custom utilities are not incorrectly discarded. Add focused behavioral checks when changing the composition contract.
- Affected keyboard, focus, validation, disabled/loading/empty states and responsive layout work in the browser. Inspect relevant visual parity when changing geometry or theme values.

Use existing typechecks, tests and runtime checks proportionately; report actual evidence and limits. Documentation-only updates require prose/link/diff review, without claiming a new application test run. Automated searches can assist but must not classify every bracket or runtime style as a violation.

## References

Consulted for the approved reformulation, 9 November 2026: [Tailwind theme variables](https://tailwindcss.com/docs/theme), [shadcn theming](https://ui.shadcn.com/docs/theming), [Heroicons](https://github.com/tailwindlabs/heroicons), and [`cn`](https://github.com/shadcn-ui/cn). Recheck applicable APIs and installed versions when implementing; upstream examples do not override agreed product or dependency scope.


## Shared pane geometry — Increment 013

WorkbenchLayout owns common composition and controlled two/three-column geometry,
using ApplicationShell. Supplied navigation/workspace/inspector slots retain their
real semantic roots, refs and scroll containers. The scoped `.workbench` and
`.projects-layout` CSS exceptions remain in `styles/global.css`; Projects retains
1.75rem wide browse padding and Tokens 1.5rem, owned by their workspace components. Compact Tokens (below 1120px) and narrow Projects (below 880px) retain 1.25rem vertical / 1rem horizontal padding. Increment 015 gives the compact sticky token heading 1rem padding; authored/resolved panels use 1.5rem, reduced to 1rem below 880px. Pane grid formulas remain focused CSS; thresholds are unchanged.
Screen hooks retain focus, modal and surface policy; shared viewport observation
does not run those policies on mount. See the [ownership map](workbench-component-organisation.md).


## Neutral / Geist implementation — Increment 014

`styles/global.css` owns the semantic pairs and aliases, referencing installed
Tailwind Neutral primitives. `secondary` is a surface; supporting text uses
`muted-foreground`. Input/select/textarea and outline-action boundaries actually
consume `input`; structural separators use `border`. Selected/hover values alias
accent/muted. Notice, badge, value and status roles retain meaning-specific names
while sharing muted values. Error surface/border use Red 50/200 and destructive
content Red 700. Scrim and elevations use the neutral foreground with deliberate
alpha. Authored previews and checkerboards remain separate data/decoration.

Geist UI roles are page 1.5rem/600/1.25, inspector 1.25rem/600/1.3,
section 1rem/500/1.5, body .875rem/400/1.5 and caption/control .75rem/400–500/1.5.
Technical paths, values, exact source and numeric color entry use Geist Mono
.75rem/400–500/1.5. Actual mobile text entry uses 1rem below 880px; labels/prose
retain Geist. Local fonts, upstream versions, hashes and licenses live in
[`styles/fonts/`](../../src/presentation/styles/fonts/README.md). No remote font
service or new offline shell is involved.

Prefer rem lengths with the existing .25rem spacing foundation; preserve retained
off-scale geometry rather than rounding it. Named `border-hairline` and directional
`border-*-hairline` utilities express .0625rem strokes (built-in `border` uses px).
They preserve border-width composition groups in the precompiled merger. Focus
uses .125rem width/.1875rem offset; browser rasterization can quantize strokes.
Viewport queries deliberately remain CSS px, synchronized with the observer;
root font size is not fixed. SVG viewBox/stroke coordinates remain SVG units.

Increment 015 supersedes the earlier mobile minimum: standard buttons, single-line
inputs/selects, tabs and slider target areas use a 2.25rem baseline at every width.
Icon actions are square; wrapped text/root scaling may grow controls without a
maximum-height clamp. Content rows, textareas and exact source retain natural
geometry. Checkbox labels provide the clickable area without stretching native glyphs.
Native backup file controls share the target baseline.
Track .75rem/thumb 1.125rem geometry remains separate. Ordinary workspace/modal
padding and table viewport/container policy live at their component owners.
ApplicationHeader owns wrapping/context order; its existing compactBrand state
retains the history action row. The remaining collapsed-inspector selector owns
only that coordinated state; conflicting gap/padding utilities are conditional.

Focused stylesheet exceptions remain: WorkbenchLayout pane/grid formulas;
collapsed navigation/inspector state; modal/drawer viewport sizing and transition;
dialog action wrapping; native slider pseudo-elements/gradients; TokenTable
selection marker and staged row containment; ExactSource local native scrolling;
trace decoration and the base-layer `[hidden]` invariant. Runtime authored colors
and illustrative gradients remain at their current consumers. No component/state
owners or mounted ancestry were moved. Confirmed unused `.project-start`,
`.range-ends`, `.exact-data` and the statically positioned `.editor-actions`
bottom offset were removed; EditorActions remains in its current owner.

Increment 015 keeps sticky token identity/comparison at TokenEditorContent, with
an actual-heading ResizeObserver measurement setting its existing scroller's
scroll padding. This runtime geometry exception prevents wrapped titles and text
scaling from obscuring focused editor content; it does not change session ownership.
WorkspaceToolbar owns the focused two-column heading formula keeping actions
together beside shrinkable identity text. The shared inspector toggle lives under
SelectionInspector for token and fallback consumers. TokenEditor retains one toggle outside its hidden/scrolled content,
positioned over the heading's reserved control space; collapsed rail positioning
is a focused pane-geometry exception. The same button/icon remains mounted and
visible across desktop collapse so focus and a continuous rotation can be retained.
Native file-selector-button sizing remains a focused pseudo-element exception.

### Panel motion refinement — 17 November 2026

Desktop panel tracks and their content now animate together using the shared
500 ms panel-motion duration and easing in `global.css`. Content slides toward
its outer edge while the workspace gains space. Fixed expanded content widths
prevent text reflow during the slide; their dimensions share the pane geometry
variables. Headings slide while toggle buttons stay available. Chevrons use the
same timing. These remain focused pane-geometry CSS exceptions, not a new layout
owner or animation dependency. Narrow navigation drawer behavior is unchanged.

Collapsed content stays mounted to preserve editor state and scroll position.
`inert` and `aria-hidden` exclude it from interaction immediately; visibility is
hidden when the exit finishes. Reduced motion removes transitions. The generic
`[hidden]` rule still applies to other hidden surfaces. Browser evidence and limits
are recorded in the current status handoff.


### Native inspector disclosures — 26 November 2026

Shared InspectorSection uses native `details`/`summary`, retaining its existing
caller-owned open state and mounted children. Native toggle notifications update
the owner only when the DOM state differs; nested disclosure events and controlled
prop notifications do not flip the owner again. The action footer remains outside
the disclosure. No exclusive `name` grouping is introduced.

The [HTML standard](https://html.spec.whatwg.org/dev/interactive-elements.html#the-details-element)
permits flow content, including form controls, after the summary and demonstrates
collapsible inputs. Inputs, textareas and selects remain in that content, not in
the summary. Closing a disclosure hides its contents; it does not reset or disable
form controls. Existing application validation and save ownership remain unchanged.

Headings inside summary are valid, but [MDN documents inconsistent exposure of
their heading roles](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/summary#summaries_as_headings).
A visually hidden level-three heading therefore stays outside details, followed
by the visible summary label. This preserves heading navigation without overriding
native disclosure semantics. Existing typography, spacing, focus ring and chevron
are reused. The scoped WebKit marker suppression in `global.css` is a necessary
pseudo-element exception to prevent a second native marker.

Presentation typecheck and six affected tests passed. An isolated Chrome fixture
using the production component checked pointer/Enter/Space toggles, controlled
updates, nested disclosures, retained controlled textarea and uncontrolled input
values, and the visible footer. The accessibility snapshot exposed the level-three
heading; summary height remained 56px. The fixture screenshot is
[recorded here](../../output/playwright/inspector-disclosure.png).
One fixture module-import repair; checks stopped after this focused pass.
Full inspector visual acceptance, assistive-technology and other-engine checks
remain unperformed. No user project or browser draft was changed.

### Token list properties — Increment 017

The [agreed token-list scope](../increments/017-token-list-properties-and-ordering.md)
adds Token / Type / Layer / Value columns when the workspace has sufficient width.
Compact rows retain the authored source-space coordinates and separate alpha;
wide rows add all five supported spaces. Protection means protected from
regeneration, not an edit lock. Derived six-digit HEX uses the explicit display-only
approximation below; native source swatches and authored values remain separate.

All tokens sorts by declared type, layer, full group path and local name, using
natural numeric name ordering. A selected group includes descendants by stable
identity ancestry and orders by subgroup path then local name. All content remains
the separate namespace inventory, including invalid-path recovery.

## Hierarchical navigation motion — Increment 018

TokenNavigation owns intrinsic-height branch disclosures. The focused
`.navigation-children` grid-row/visibility and `.navigation-chevron` transform
rules in `styles/global.css` implement the agreed synchronized 180ms ease-in-out
opening and closing; reduced motion disables transitions. Mounted descendants
are inert and hidden from assistive technology while collapsed. This CSS exception
handles animated intrinsic height and delayed visibility, without a new theme
value or animation dependency. Ordinary spacing uses named Tailwind utilities.

### Token list identity refinement — 18 November 2026

User-approved token list identity shows the local name followed by the full path
including name, then description under existing responsive visibility rules.
Omit the redundant parent-only path line. Preserve protection indicators and
honest diagnostic/identity fallbacks when a full derived path is unavailable.
This applies to the production list and current prototype, not inspector headings.

### Equal expanded side panels — 18 November 2026

Following approval of the mockup trial, production TokensWorkbench navigation
shares the inspector's 25rem expanded width through the existing pane geometry
variable. Collapsed rails, drawer width and responsive breakpoints retain their
existing behavior. The central workspace receives the remaining space.

**Fluid-width amendment — agreed, implemented and visually accepted 25 November 2026.**
TokensWorkbench now gives both expanded panels `clamp(20rem, 25vw, 25rem)` through
its existing inspector/navigation geometry variables. At the default root size,
panels stay 320px through 1280px, grow to 400px at 1600px, then stop growing.
The workspace receives the recovered width without a jump at 1440px. The focused
CSS uses `--spacing(80)` and the existing maximum token; Projects retains its
400px inspector and balancing geometry. Collapse rails, motion/content widths,
mounted state and the existing responsive mode thresholds are unchanged.

The user approved the result in their active Firefox tab after hot reload.
Vite production compilation passed with the existing bundle-size advisory;
whitespace and preservation of the three pre-existing form-control edits were
checked. This was a small implementing-agent review, not independent review.
Checks stopped after the user's visual acceptance, within the eight-minute ceiling;
approximately three minutes, no harness repairs. The visible empty workbench was
checked; populated-inspector and breakpoint sweeps were not run. No numerical,
retention or broader browser qualification was restarted.

TypeBranch layer text aligns with the type label after its size-4 icon and
navigation button gap-2.5: a pl-6.5 wrapper offsets the layer by1.625rem.
Namespace leaves use pl-9.5, a further .75rem. The same content is used in the
pane and drawer. Existing button padding, count columns and transitions remain.

### Centered Projects and common rails — 18 November 2026

**Superseded geometry — 25 November 2026.** The historical balancing formula below
has been replaced at the user's request. Both workbenches now consume the shared
`--pane-expanded-width: clamp(20rem, 25vw, 25rem)` decision, expressed using the
existing spacing scale in CSS. On desktop (1120px and above at the default root),
Projects' blank left grid track equals its inspector width, matching Tokens' expanded
side tracks. This remains a blank balancing column, not a navigation component.
From 880px to below 1120px, the blank track becomes zero-width, matching Tokens'
navigation-free workspace/inspector mode. Below880px the existing Projects single-
surface browse/inspect behavior remains. No state owners or mounted ancestry change.

Live Firefox at a measured 1303px viewport reported grid tracks of 325.75px / 651.5px /
325.75px. Inspector buttons and metadata remained within the pane's measured bounds.
Vite compilation and whitespace checks passed, with the existing bundle-size advisory.
This bounded CSS follow-up used approximately five minutes of an eight-minute ceiling,
no code harness repairs; implementing-agent review only. Tablet/mobile rules were
source-reviewed, not browser-replayed. A native shortcut unexpectedly opened Firefox's
quit confirmation during cleanup; it was cancelled, no tab closed, and Developer
Tools were closed through their visible button. Existing project selection/data remain.
No tests or earlier qualification campaigns were restarted.

Approved Projects geometry uses a borderless balancing left grid track,
`clamp(0rem, calc(100vw - 67rem), 25rem)`, and a25rem right inspector. At wide
widths the side regions match; the blank track yields first below1472px and
reaches zero at1072px. Below880px the existing single-column browse/inspect policy
continues. Content fills the middle track with its existing padding and no
max-width cap, per the user's explicit amendment. CSS grid placement preserves
existing semantic pane roots, scroll refs, focus and state ownership.

The token workbench's collapsed navigation and inspector tracks both use
`--collapsed-pane-width:3.25rem`. Existing pane motion derives from those tracks;
expanded widths, toggle behavior and responsive thresholds are unchanged.

Increment 020 gives ProjectList a focused container-geometry exception in
`styles/global.css`: Project/Contents columns grow into four columns at 42rem of
list width, while lifecycle dates otherwise use labeled row metadata. The list
owns this threshold because the centered browse track can be narrow on a wide
viewport. Ordinary row styling remains semantic utilities; the two-line description
preview uses `line-clamp-2` and `wrap-anywhere`. Verification is recorded in the
[increment](../increments/020-projects-browse-and-creation-dialog.md).

The 19 November table-style follow-up aligns Projects with Tokens: shared header
typography, explicit top/bottom hairlines, row padding/gaps, top alignment and
4.75rem minimum height. Both reuse the same foreground selection-marker rule
in `global.css`; hover/selected backgrounds remain semantic utilities. Project
names retain UI typography, while technical token names retain Geist Mono.
Project columns, responsive date metadata and two-line description previews remain
specific to the Projects list.

## Browser feedback refinements — 19 November 2026

User-requested small presentation fixes: project list contents use separate
`tokens: n` and `groups: n` blocks. Project inspector facts start with Description
(`No description` when empty), align labels left and values right, and end with a
separate Identity section. Existing unavailable/last-known fact gates remain.
Navigation rows are square, hover with accent contrast against the muted pane,
and reuse the table's foreground left selection marker (0.25rem).

Shared Button action sizes (default, history, panel, sm, selection) use a subtle
1.015 hover / 0.985 pressed scale with a 150ms ease-out transition. Navigation,
mode, pane, inventory and icon sizes stay stationary. Motion only runs without a
reduced-motion preference; disabled buttons do not scale. Shared Button owns the motion through Tailwind `motion-safe`, `transition-transform`,
`duration-150`, `ease-out` and guarded hover/active utilities. The two arbitrary scale
values preserve the requested ±1.5% effect: the installed Tailwind compiler does not
emit decimal numeric `scale-101.5` / `scale-98.5` utilities. The square navigation
disclosure geometry remains a focused CSS rule; no new tokens,
dependencies, state owners or wrappers are introduced.

### Visible control borders — 19 November 2026

At the user's request, primary/outline buttons and text/search inputs, native
selects and textareas use Tailwind `border-2` (2px at the default root size,
double the previous hairline). Transparent/borderless buttons, structural
separators and focus outlines retain their existing treatment.

### Color summary component grid — 19 November 2026

The user approved a three-column grid in token-table color summaries. Each color
space has a semibold heading, then three aligned component labels above their
normal-weight values. Labels omit colons and values omit middle-dot separators;
space groups use additional vertical spacing. Each label/value pair stays in one
grid cell, with long values allowed to wrap within narrow cells. Following the
20 November refinement, Alpha appears once alongside HEX above the color spaces;
the summary row wraps when space is limited. Authored/converted visibility, precision and color emphasis
are unchanged. TokenValue owns this presentation through Tailwind utilities.

**Approved design update — 24 November 2026.**
[Token-list disclosure V1](../../prototypes/token-list-disclosure-v1/DESIGN-V1.md)
supersedes the previous visibility behavior: show only the authored color space
by default at every width, retaining HEX and separate Alpha. Other representations
use a per-token disclosure. Alias previews identify their resolved space rather
than claiming an authored literal space. The coordinate grid, precision and color
emphasis remain unchanged. Actual ramp members gain a named control opening the
existing ramp workspace; membership comes from stable member identities, not
paths or alias targets. Selection, disclosure and ramp navigation use separate
controls. Existing draft guards and ramp behavior remain applicable.

### Token table column balance — 19 November 2026

At the user's request, the wide token table uses 12 equal tracks: Token spans 4,
Type 2, Layer 1 and Value 5. This transfers space from Layer to Value while
preserving the existing compact/touch layouts and shared header/row alignment.

### Applied color facts and entry units — 19 November 2026

Color component fields show their applicable unit (degrees or percent) as a
non-editable suffix inside the field; missing `none` components omit the suffix.
The suffix is presentation only and never enters draft text or parsing. Existing
labels retain the accessible unit, and full-precision focus behavior is unchanged.
The expanded applied-color summary uses metadata-style rows: Color Space and
component/alpha labels left, values right, using the same caption font and separators.
Compact authored summaries retain their existing format.

### Value-source radios — 19 November 2026

The user approved native radio inputs for Literal color / Reference. Both share
a per-editor name and the existing Value source fieldset/disabled gate, retain
explicit labels and invoke the existing changeMode action. Apply/Cancel focus
continues to target the literal choice; draft ownership and validation are unchanged.


## CSS ownership and responsive modes — 24 November 2026

The stylesheet has one semantic `:root` inside `@layer base`, one `@theme inline`
mapping, one direct `@theme` block and one `@layer components` block. Top-level
`@utility` declarations retain variant-capable strokes and annotation typography.
Component rules are overridable by utilities. Native `[hidden]` alone deliberately
uses `display: none !important` in base: mounted pane state must win over any
normal display utility. Native file-selector sizing also belongs to base.

Viewport modes share the observer's CSS-pixel boundaries: mobile below 880px,
tablet from 880px to below 1120px, and desktop from 1120px. `compact` is only the
mobile/tablet union and is declared before mobile so the narrower mode wins
when both apply. Former small/narrow/touch/source-compact and 640px label rules
now follow these modes. Consequently labels, square creation/history actions,
input typography, row padding and toast offset change at the mobile boundary;
this is an intentional cosmetic consolidation. The project-list 42rem container
query and token-list container queries remain actual-content-width decisions.

Focused CSS geometry uses Tailwind `--spacing()` for scale-based dimensions,
a shared expanded-pane width and control size; typography, radii, strokes and
illustrative/authored previews retain their appropriate existing units. Success,
information and warning roles reference the shared Tailwind palette; errors reuse
the existing destructive/error roles. Notifications no longer own a raw palette.
Their controls explicitly inherit foreground/border and a current-color hover tint
through shared Button context utilities (and the native toast dismissal control).
Notification borders and radii belong to `.notification`; toast rules own their
specific padding/grid geometry. Collapsed toggle border and position belong to
conditional consumer utilities, preventing component-layer specificity conflicts.
