# Increment 014: Neutral / Geist theme and styling ownership

- Contract status: Draft
- Delivery status: Not started
- Agreement: V1 approved for analyst review on 16 November 2026. Final contract/design agreement and implementation authorization remain pending. The user explicitly requested no implementation yet.
- References: [vision](../project/vision.md), [product concept](../project/product-concept.md), [principles](../project/principles.md), [architecture](../project/architecture.md), [visual direction](../project/visual-direction.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md), [styling audit F1–F9](../planning/tailwind-styling-ownership-audit.md), [V1 proposal](../project/neutral-theme-proposal-v1.md), [current handoff](../status/current.md).

## Outcome

Give the existing browser workbench a coherent Tailwind Neutral / Geist theme,
including a restrained editorial Projects hierarchy, while making styling ownership
clear. Authors retain the same project, token, editor and recovery workflows. This
is a combined visual change and maintenance increment; color/type changes are
intentional, while ownership cleanup preserves effective geometry and behavior.

## Scope

Included:

- Light application chrome across Projects and Tokens, shared controls, navigation,
  inspectors, authoring/restore/departure dialogs, recovery and feedback surfaces.
- Tailwind Neutral semantic surface/foreground pairs, Geist UI and Geist Mono for
  technical content, using the V1 mapping and type roles below.
- Projects title, collection-row hierarchy and section divisions, adapting the
  editorial composition to the actual catalogue and create/restore controls.
- Audit F1–F9: reconcile ordinary utilities and global overrides, rem conversion,
  coherent working scales, documented focused CSS and confirmed obsolete-rule removal.
- Self-hosted font assets, provenance/licenses and fallback behavior; applicable
  owning documentation, including presentation conventions and status, reconciled
  after implementation without rewriting historical evidence.

Excluded:

- Dark mode, theme preferences, font-size settings or a palette/type gallery in the
  product. V1 review navigation, tweak controls and sample data are not features.
- New Projects actions, implicit Open on selection, changed recovery/admission or
  backup behavior, new persistence, PWA installation/service-worker infrastructure,
  Electron, domain/adapter/model changes, dependency or component-library migration.
- Blanket dimension rounding, unrelated component reorganization, another Tailwind
  skill, authored black/white restrictions, full accessibility/browser qualification
  or reopening earlier stopped campaigns.

## Acceptance criteria

- **AC-1 — Semantic theme reaches the delivered interface.** All included screens
  and their existing empty/loading/error/disabled/selected states use the agreed
  Neutral mapping through one theme source and named utilities. `secondary` is a
  surface; existing supporting `text-secondary` consumers migrate to
  `text-muted-foreground` or a justified text role. Application chrome literals
  are consolidated; no direct CSS-variable expressions are added to JSX when a
  named utility suffices. The completion inventory identifies roles retained,
  aliased or removed, including input, focus, selection, error, scrim and elevation.
- **AC-2 — Typography and fonts.** Apply the V1 role table below consistently,
  removing conflicting font declarations. Geist 400/500/600 and Geist Mono 400/500
  are served locally with documented upstream revision, checksums and included
  licenses. System sans/mono fallbacks remain usable during loading or font failure;
  there is no third-party runtime font request. Font assets are included in the
  production build. Offline availability is tested only within delivery capabilities
  actually present; this criterion does not promise a new offline app shell.
- **AC-3 — Projects presentation preserves its workflow.** Use the V1 editorial
  title/collection/section hierarchy with real catalogue facts and actual controls.
  Selection remains read only, Open and Download remain explicit and state-gated.
  Empty, loading, unavailable, unsupported, missing selection, pending, retained,
  unknown-outcome, restore-preview and recovery content/actions remain reachable
  with their current labels, feedback semantics and disabling rules. Creation
  validation and native backup-file input remain functional. No placeholder
  prototype behavior replaces real application operations.
- **AC-4 — F1/F2/F4/F5 ownership and geometry.** Record effective baseline winners
  before edits and give ordinary padding, header layout, table columns/visibility,
  inspector borders and dialog padding clear owners. Preserve Projects 1.75rem
  versus Tokens 1.5rem wide padding; compact/narrow 1.25rem vertical and 1rem
  horizontal padding at their existing thresholds. Keep viewport/container table
  conditions, header/history wrapping, collapse behavior and modal/drawer
  distinctions. Remove contradictory declarations together; do not move the whole
  unlayered stylesheet into a layer and assume parity.
- **AC-5 — F3 controls and composition.** Preserve effective control minima,
  including 2.75rem below 880 CSS px for applicable buttons, native inputs/selects,
  backup file input and slider hit areas, while preserving larger variant minima.
  History retains its existing 640–879 interval behavior. Slider track/thumb
  geometry remains distinct from the hit area. Preserve Button's additive API,
  Base UI state callbacks, props/refs and shared precompiled `cn`; new utilities
  must compile and compose correctly without changing existing precedence contracts.
- **AC-6 — F6/F7 unit and scale policy.** Prefer rem for type, spacing, dimensions,
  radii, strokes, focus and shadow lengths, using standard/named utilities. Preserve
  equivalent lengths at the normal 16px root outside explicitly listed visual
  changes. Record retained off-scale values and justified px exceptions. Do not
  fix the root font size for conversion. At an enlarged root, rem geometry may
  grow intentionally; content, actions, scrolling and focus must remain usable.
  Keep CSS and JavaScript viewport policies synchronized as specified below.
- **AC-7 — Authored data and mounted state remain intact.** Chrome changes do not
  recolor authored data, exact source, sRGB/other previews or black/white creation
  defaults. Preserve specimen/checkerboard meaning and dynamic authored styles.
  Hidden panes stay hidden despite display utilities; editor keys/ancestry,
  draft/form lifetime, command/session ownership, history and scroll owners stay
  unchanged. No new data write or read-only-to-edit transition is introduced.
- **AC-8 — Assembled interface remains usable.** Representative actual controls
  have legible text, distinguishable interactive boundaries and visible unclipped
  keyboard focus; hover/selected/error treatments retain their meaning. Check
  normal text at 4.5:1, large text at 3:1 and required control/focus indicators at
  3:1 against adjacent colors. Decorative separators need not meet control contrast.
  Check wide, compact, narrow and enlarged-font layouts for clipping, table/header
  alignment and local scrolling. Evidence is bounded to this change, not full WCAG
  certification or closure of historical acceptance gaps.
- **AC-9 — F8/F9 and maintainable handoff.** Confirm current production consumers
  before deleting legacy rules. Report disposition of `.project-start`,
  `.range-ends`, `.exact-data` and the apparently inert `.editor-actions` offset.
  Perform the affected-tree/consumer/naming check in the presentation conventions;
  document necessary component CSS/runtime-style exceptions with owner and reason.
  Provide F1–F9 and AC evidence, failed/unverified items and remaining allowance.

## Decisions and open questions

### Established user direction and proposed implementation agreement

The user selected Tailwind Neutral, Geist / Geist Mono, shadcn-compatible semantic
pairs, broad rem usage and a small coherent scale. They like V1 and approved it
for analyst review. The detailed dispositions here remain part of the Draft
agreement, not implementation authority.

Use V1's semantic mapping: background/card Neutral 50 with Neutral 900 foreground;
primary 900/50; secondary and muted surfaces 100, with foregrounds 900 and 600
respectively; accent 200/900; structural border 200; input and ring 500;
ring-offset aliases background; destructive Red 700/Neutral 50; error surface
Red 50 and error border Red 200. Reference the installed Tailwind primitives;
do not copy their OKLCH literals into a second palette.

Complete the actual consumer inventory during the first implementation slice.
Recommended routine dispositions are supporting text → muted-foreground,
hover/selection surfaces → muted/accent, input boundaries → input, modal/drawer
surfaces → card or background, and neutral scrim/shadow colors from the same
foundation with deliberate alpha. Retain distinct role names when their meanings
matter even if values coincide. Do not force data-specimen decoration into chrome
roles. Final documented aliases, opacity and shadow choices may be routine when
consistent with V1 and contrast requirements; material visual departures return
to the user. No extra very-light step is required. The user permits a small
extension if actual hierarchy needs it; document the reason and show the result.

| Type role | Face | Size | Weight | Line height |
| --- | --- | --- | --- | --- |
| Page title | Geist | 1.5rem | 600 | 1.25 |
| Inspector heading | Geist | 1.25rem | 600 | 1.3 |
| Section title | Geist | 1rem | 500 | 1.5 |
| Body | Geist | .875rem | 400 | 1.5 |
| Supporting text / controls | Geist | .75rem | 400 / 500 | 1.5 |
| Paths, values, technical labels | Geist Mono | .75rem | 400 / 500 | 1.5 |

Map roles by actual meaning, not tag alone. The proposal's narrow editable-control
1rem treatment applies to actual narrow text entry; preserve control hit minima
and allow necessary wrapping/growth. Labels and prose stay Geist; technical
inputs/source use Geist Mono. Moving current 10/11px annotations to .75rem,
17px inspector headings to 1.25rem, and 13px section headings to 1rem is an
intentional type change where those roles apply. There is no screenshot-parity
claim for resulting text metrics. Document the final role inventory; do not
silently retain conflicting 550/650 weights or invent additional type roles.

Keep the 0.25rem spacing foundation and prefer 0, .25, .5, .75, 1, 1.25, 1.5,
2 and 3rem, with .125rem fine spacing. Retain existing geometry when outside this
preferred set: for example 1.75rem Projects padding, 13.25rem navigation,
25rem inspector, 3.25rem collapsed panes, .4375rem Field gap, 1.0625rem Field
margin, 1.375rem tab gap and 4.375rem empty-state padding. Numeric utilities are
valid for these; do not mint a token to conceal each measurement. A reduction
of such retained values needs identified before/after examples and user agreement;
this contract proposes no rounding bundle. Thus the coherent scale governs new
choices while preserving explicitly listed existing exceptions.

Use .0625rem hairlines, .125rem focus width and .1875rem focus offset where feasible;
retain .25rem selection-marker width (current 4px), despite V1's illustrative
.1875rem marker. Preserve modal .625rem radius and shadow lengths 0 1rem 5rem,
and drawer .5rem 0 1.875rem shadow lengths; unify colors without silently changing
elevation geometry. Native slider baseline is .75rem track, 1.125rem thumb and
-.25rem offset. Use rounded-full where equivalent. Record any demonstrated
rasterization exception rather than imposing a blanket px ban.

Retain the current CSS-pixel responsive policy: 1120/880 pane observation and
existing 640/768/540/900/500-height distinctions, including the 1120 source-compact
versus 1119 compact endpoints. Keep table container conditions as well as viewport
conditions. Media-query rem uses different font-size semantics from element rem;
no query-unit conversion or automatic breakpoint redesign is included. If enlarged
fonts reveal unusable content, surface the smallest correction and its effect;
do not silently redefine the pane policy or declare that case passing.

- **Resolve before implementation:** the user's final agreement to this contract,
  its explicit intentional changes and V1 as limited by these dispositions, plus
  implementation authorization. No separate product question is currently required.
- **Routine technical choices:** suitable licensed self-hosted font format/files,
  documented semantic aliases and focused CSS placement within these constraints.
  Verify actual provenance and installed APIs when implementing.
- **Deferred:** broader dimension normalization, new responsive policy, dark mode,
  font preferences, complete offline/PWA acceptance and earlier qualification gaps.

## Design proposals and analyst review

- **Identified V1:** [committed proposal](../project/neutral-theme-proposal-v1.md)
  at `83f8d040b8a0daaa69303bd2c14aeb155e5cc512`; inline fragment
  `/Users/rlapoele-pro/.codex/visualizations/2026/11/16/01a1e487-725f-7242-9aec-f4cfe54c6476/dtw-neutral-proposal.html`,
  SHA-256 `e0048c451f2e52e07ab7803a388a27a17571f560ab255af96a708c9090d209a0`.
  View the inline proposal in the original review chat. The path is a local review
  artifact, not a repository runtime dependency. The committed proposal and this
  contract are the durable implementation handoff; loss of the visual artifact
  requires resurfacing it before claiming visual fidelity.
- **User review:** on 16 November 2026, the user said they liked the direction
  and requested analyst review plus a combined contract; they explicitly said not
  to implement. Approval is for this identified V1's analyst review only.
- **Assessment:** the Neutral/Geist direction is consistent with restrained
  Precision, canonical data separation and existing architecture. This is a source
  consistency review by a separate analyst, not usability testing, runtime
  accessibility certification or independent implementation review.

| Finding / classification | Scenario, consequence and evidence | Proposed disposition |
| --- | --- | --- |
| A1 — Demonstrated source migration hazard | Existing `text-secondary` means text, while V1 secondary is Neutral 100. A direct token remap would make supporting text nearly disappear. See global.css `--color-secondary` and TokenTable supporting labels. | AC-1 requires consumer migration before adopting surface meaning; retain meaning-specific text roles where needed. |
| A2 — Demonstrated source migration hazard | Input currently uses `border-border`; merely defining V1 input Neutral 500 leaves fields with Neutral 200 boundaries. V1's contrast explanation depends on stronger interactive boundaries. See ui/input.tsx and proposal semantic mapping. | AC-1/8 require actual control consumers to use the input role and assembled contrast checks; not every structural border becomes input. |
| A3 — Unresolved implementation detail, bounded here | Prototype table is simplified to two columns and uses container-only adaptations. Real TokenTable has description/container visibility plus viewport overrides; copying V1 would change information visibility and potentially focus/surface policy. See TokenTable.tsx and useWorkbenchViewport.ts. | AC-4/6 retain production policy; V1 is visual guidance only. No table redesign or breakpoint adoption. |
| A4 — Unresolved design coverage, bounded here | V1 Projects samples do not demonstrate every unavailable/pending/restore/recovery state. Replacing real components with those samples could omit safeguards/actions. See ProjectsWorkbench.tsx, ProjectInspector.tsx and proposal limitations. | AC-3 adapts visual hierarchy around existing workflows; no workflow rewrite. |
| A5 — Unresolved delivery detail, bounded here | Embedded preview fonts and its offline wording do not establish production font provenance, cache delivery or PWA readiness. See proposal typography section. | AC-2 uses self-hosted build assets/licenses/fallback; no new service worker or offline certification. |
| A6 — Intentional-change boundary | V1 uses different typography and a 3px-equivalent selected-row marker; source uses a 4px marker and mixed literal sizes. Exact parity and blanket rounding would contradict these facts. See global.css selected marker/type roles and V1 fragment. | Adopt explicit type changes; retain .25rem marker and existing off-scale lengths. Rem growth is intentional and separately checked. |
| A7 — Optional improvement | Extra very-light neutral may help a particular raised surface, but V1 uses 50/100 and no demonstrated failure requires another step. | Keep V1 default; add only with actual hierarchy evidence. Not a delivery prerequisite. |

The combined inventory still needs implementation evidence for focus/selection/
error combinations, scrim/shadow roles, sliders and fallback text metrics. The
proposal's isolated contrast numbers and prior desktop preview do not close these
gaps. No material visual revision was authored in this review. If implementation
requires one, return it to the user before renewed analyst review.

**Final design agreement: pending.** The recommendation is to agree V1 with the
explicit production boundaries above, rather than require another prototype solely
to repeat already delivered application states. Final agreement does not occur
through this analyst recommendation.

## Ordered implementation slices — proposed only

1. Capture a small parity/state baseline and consumer inventory; confirm font
   provenance, effective CSS winners and existing dimensional exceptions. Record
   approved color/type changes separately from unchanged geometry.
2. Establish semantic/type/font sources and local assets; migrate text-secondary
   and interactive boundaries together. Compile theme utilities/merge tables.
3. Reconcile F1–F5 at current component owners, retaining current responsive policy,
   minima, mounted panes and composition contracts. Convert equivalent geometry.
4. Apply Projects editorial hierarchy and complete F6–F9; remove only confirmed
   obsolete rules. Document retained exceptions and update owning guidance.
5. Perform bounded checks, freeze the snapshot, independent reviewer handoff,
   targeted corrections/recheck and completion/status report. One code-writing
   agent at a time; do not stage, commit or push.

## Verification approach

Use the [shared verification rules](../workflow/agent-roles.md#proportionate-verification).

- **Essential delivery:** one production build/typecheck gate; existing affected
  presentation/class-composition tests, adding behavior tests only for a concrete
  changed risk. Source/consumer/generated-CSS review maps F1–F9 and AC-1–9. No
  tests that merely restate class strings or document text are required.
- **Representative browser evidence:** Chrome baseline only. Capture actual
  Projects and Tokens at wide (for example 1440), compact (1024) and narrow (390)
  widths, with selected project/token, open editor, validation and one modal.
  Check 879/880 and 1119/1120 boundary pairs for changed geometry; verify
  640/768 and table container transitions only where touched. Exercise keyboard
  focus/modal return, narrow browse/inspect and navigation drawer, history/header
  wrapping, slider hit area, native file input and an enlarged-root (20px) sample.
  Use a focused 320px check where narrow text-entry/type changes could clip.
  Reuse representative states instead of multiplying every state by every width.
- **Fonts/contrast/integrity:** confirm local font loading/build output and one
  fallback case; inspect representative assembled text, input, selected, focus and
  error pairs. Source/targeted behavior evidence checks unchanged authored values,
  disabled gates, mounted state and class callbacks. No storage fault campaign is
  needed for presentation-only changes. No new performance guarantee is proposed;
  use realistic ordinary content to notice material layout/scroll regressions.
- **Proposed future implementation ceiling:** 40 aggregate verification/review
  minutes, at most one browser-harness repair cycle, shared across developer,
  reviewer and coordinator (indicatively 22/13/5). The combined theme touches all
  current surfaces and fonts plus responsive cascade ownership, justifying more
  than the small-increment default. This is a proposed allowance for a later
  authorized implementation, not permission to run checks now. Reviewer must
  retain a usable share; stop optional checks before consuming it.
- **Excluded qualification:** full state×viewport matrix, stress/resource ceilings,
  browser-engine campaign, persistence/concurrency faults, PWA installation/offline
  shell qualification and historical 007/009/011/012/013 gap closure. Existing
  criteria/gaps are neither weakened nor silently transferred here.
- **Planning consumption:** separate current source/analyst/documentation ceiling
  12 aggregate minutes, with up to nine for this analyst and three reserved for
  coordinator. Analyst used approximately seven minutes; zero harness repairs;
  no app build/tests/browser. Coordinator source/document checks used approximately
  three minutes: planning review stopped at approximately 10/12 aggregate minutes,
  zero repairs, with local links and whitespace checked. V1's
  approximately 9/15 prototype minutes and the audit's approximately 15 minutes
  are historical separate scopes, remain stopped and grant no new allowance.
  Earlier campaign consumption/limits remain in their owning increments.
- **Stop/resume:** log actual aggregate use at each handoff. Stop at either limit,
  earlier if tooling dominates or value is low; retain failed/unverified ACs.
  Changing agent/snapshot/tool does not reset allowance. Any resumption beyond
  stopping needs explicitly authorized bounded follow-up. Genuine defect fixes
  may proceed within scope; their verification consumes the same allowance.

## Review baseline

Analyst verified clean Git status and HEAD
`83f8d040b8a0daaa69303bd2c14aeb155e5cc512` before authoring this draft. The
committed audit records its earlier `bf988a0` baseline; current inspected owners
and cascade retain the relevant findings. This draft changes documentation only.
Before later implementation, record actual HEAD and all pre-existing changes;
preserve staged and unrelated work.

Before implementation review, pause code edits and identify base plus reviewed
commit, or base plus exact working-tree diff and included new files/assets with
hashes. Give the fresh-context reviewer the agreed contract/design and owning
documents without developer rationale or success claims. Reviewer independently
checks resulting ownership, expected behavior and evidence within the shared
allowance. Identify updated snapshots for any corrections and recheck affected
criteria only; a source review is not runtime acceptance.

## Agreed amendments

None. This remains an analyst draft awaiting final user agreement and separate
implementation authorization.

Suggested commit message: `docs: draft Neutral Geist and styling ownership increment`
