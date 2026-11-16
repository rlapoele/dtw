# Increment 015: Workbench browse and inspector polish

- Contract status: Draft
- Delivery status: Not started
- Agreement: Not agreed. The 16 November 2026 browser annotations request these changes; this draft and any designer recommendation do not establish final contract/design agreement or implementation authorization.
- References: [workflow](../workflow/agent-roles.md), [presentation conventions](../project/presentation-conventions.md), [architecture](../project/architecture.md), [visual direction](../project/visual-direction.md), [responsive shell](011-responsive-shell.md), [session Undo/Redo](012-session-undo-redo.md), [Neutral / Geist](014-neutral-geist-and-styling-ownership.md).

## Outcome

Make the existing token workbench easier to scan and use: history availability is
visible at its controls, token rows show concise display values, creation actions
are reachable from the workspace, and the inspector gives more space to the token
and its editor.

## Scope

- Included: the user's 14 browser comments and subsequent sticky-heading request, grouped into history controls (1–2),
  token-list display (3–4), workspace copy/search/creation (5–7), and inspector
  labels, composition, collapse control and editor padding (8–14).
- Included: exposing true retained Undo/Redo step counts through the existing
  application/worker boundary, reusing existing group creation from the workspace,
  and the user-selected 2.25rem control baseline through shared controls and their
  existing consumers. This includes consistent control sizing on Projects/forms;
  it does not authorize redesigning their layouts or workflows.
- Excluded: additional token types, changed search semantics, new group semantics,
  domain/persistence changes, color calculation changes, new dependencies, new
  responsive breakpoints, general application redesign or renewed qualification.

## Acceptance criteria

- AC-1 — History counts: Undo and Redo each show their respective retained step
  count in a badge at the button's top-right corner. Counts come from the session
  history owner and change coherently after accepted changes, traversal, branching,
  pruning, invalidation and project-context changes. They are not inferred from
  next-action presence. Temporarily disabled history still reports retained counts.
  Zero is explicit. Badges have a 1.125rem minimum diameter, .625rem numerals,
  expand for multiple digits and use the identified neutral/muted disabled treatment.
- AC-2 — History information: remove the visible full-width Undo/Redo description
  strip. Preserve useful next-action/empty/blocked descriptions and accessible
  control names; retain history-cleared notices and existing traversal safeguards.
  No shortcut routing, native edit undo, draft guard or modal behavior changes.
- AC-3 — HEX summary: when an sRGB HEX preview is available, the token row displays
  only its HEX notation, including alpha when applicable. The existing preview
  explanation is available through native `title` and an appropriate accessible
  description without duplicating verbose visible text. An unavailable or
  out-of-sRGB preview displays HEX unavailable, with the actual reason in native
  title/accessibility detail; no invented HEX or silent clipping.
- AC-4 — Row decimals: color coordinates and alpha in the token-list authored-value
  summary display at most four digits after the decimal point. This is a display
  approximation only; authored source, references, editor input, calculation and
  retained data remain exact. Whole/short values gain no unnecessary trailing zeros.
  Round decimal nearest with ties away from zero; remove trailing fractional zeros
  and normalize rounded negative zero to zero. Tiny values may display zero.
  Native/accessibility detail identifies the rounded summary and gives access to
  original coordinates; `none` remains `none`. Full values remain available in the
  existing inspector/exact-source access. Existing byte-entry and conversion
  rounding policies remain unchanged.
- AC-5 — General token copy: workspace and search labels/placeholders say tokens
  rather than colors, including applicable group and empty/search-result copy.
  This wording does not claim that new token types have been implemented.
- AC-6 — Search affordance: a decorative Heroicons Outline magnifier appears inside
  the search field on the left. Text and the native search affordance do not overlap
  the icon. Search keeps its programmatic label, keyboard behavior and current matching.
- AC-7 — Group creation: the workspace header offers secondary New group alongside
  primary New token, always together and unwrapped at the heading's top-right.
  Title/type remain left; supporting copy spans the next row. Below 640px these
  become distinct folder/plus icon buttons with native titles and accessible names.
  It opens the existing group authoring workflow with the existing parent-context
  rule and blocked/error/draft protections. Cancelling returns focus to the visible
  initiating workspace action (or a meaningful fallback if it is unavailable).
  Successful creation preserves the current selected/view destination and focus
  policy; navigation creation remains usable. The initial parent is the browsed
  group, or project root for All tokens/All content; existing parent selection,
  validation, naming and recovery behavior remain available.
- AC-8 — Comparison labels: the inspector comparison swatches are labelled Current
  and New rather than Applied and Draft. Their underlying current applied state and
  unapplied draft meanings do not change. Existing preview/unavailable explanations
  remain accessible; Resolved & trace retains Current only, with New shown only
  for the authored tab.
- AC-9 — Inspector hierarchy: remove the redundant visible Inspector header row.
  Keep a programmatically named inspector region and preserve useful unavailable,
  read-only, loading and empty-state feedback in the remaining content.
- AC-10 — Inspector control: in the selected editable color-token view, the toggle
  is to the right of the comparison swatches at desktop split widths (880px and
  above). It remains available when collapsed
  and in group, nothing-selected, loading, read-only and unavailable states. Expanded
  points right; collapsed points left. A transform transition rotates the arrow
  between states, respecting reduced motion. Accessible name, expanded/controls
  relationships, keyboard activation and focus are retained. The collapsed rail
  remains 3rem wide. Below 880px there is no collapse rail/toggle; the existing
  Back to tokens control returns from inspection to browsing.
- AC-11 — Comparison geometry: Current/New appear close to the token title/type
  instead of drifting to the far side of the header. Their colored areas match the
  existing token-list swatch size (`size-8.5`, 2.125rem square). Long names,
  unavailable specimens and narrow
  layouts wrap without losing the toggle, labels or token identity.
- AC-12 — Editor spacing: increase the authored/resolved tab-panel padding to the
  V1.3 values: 1.5rem, reduced to 1rem below 880px. Controls, focus outlines,
  scrolling and lower
  Apply/Cancel actions remain reachable at the retained viewport thresholds.
- AC-13 — Preservation: changing tabs, collapsing/expanding or crossing retained
  responsive thresholds preserves editor session/drafts, selection, view-space
  and command ownership. Narrow Back behavior and selection-to-editor entry remain
  as agreed in Increment 011.
- AC-14 — Presentation ownership: reuse existing primitives and place changes at
  their actual consumer owners. Preserve the Neutral/Geist theme, named utilities,
  shared Icon integration, component class contracts and native controls; review
  the resulting affected tree and remove only obsolete wrappers from this scope.
- AC-15 — Sticky token heading: token identity/type, Current/New comparison and the
  desktop collapse control remain visible while the token-inspector content scrolls.
  Descriptions and layer metadata scroll below that compact opaque heading;
  specimens may wrap below long title/type. Below 880px the same sticky identity/
  comparison excludes the desktop toggle; Back remains outside the inspector scroller.
  Other panes retain independent scrolling. Sticky positioning must not obscure
  keyboard focus or lower editor actions, and narrow entry/Back remains usable.
- AC-16 — Control baseline: standard application buttons, single-line inputs,
  selects and tabs use 2.25rem (36px at a 16px root) at every screen size. Standard
  icon-only buttons are square. Sliders use the same 2.25rem target height while
  retaining existing track/thumb visuals. Apply this through shared primitives
  and current custom control consumers, including Projects/forms, without changing
  their workflows. Remove conflicting legacy 44px mobile minima for these targets.
  Text/root scaling, wrapped labels and content may grow controls; no maximum-height
  clamp. Content rows/cards, multiline textareas and exact-source views retain
  natural content geometry. Checkboxes retain native glyphs with a suitably sized
  clickable label area rather than a stretched square. Preserve existing narrow
  text-entry font sizing, accessible names and focus outlines.

## Decisions and open questions

**Established constraints:** the user wants top-right count badges, a concise HEX
row preview, a four-decimal maximum for long list numbers, generic token wording,
a search magnifier, workspace group creation, Current/New labels, more editor
padding, removal of the redundant inspector row, relocation of its toggle and
matching list/comparison swatch geometry, and a sticky token-inspector heading. Existing model, draft and history
semantics remain governed by the linked owning documents.

**Source findings, 16 November 2026:**

- `HistoryState` currently exposes only the next Undo/Redo `{id, label}` and an
  optional notice. `createSessionHistory` owns `steps` and `cursor`; true counts
  therefore require a narrow application/protocol exposure, not renderer counting.
- `HistoryDescriptions` currently owns the visible strip and description IDs used
  by both controls. Removing its visual block must not leave dangling ARIA references.
- `TokenSwatch` uses `size-8.5`; comparison specimens currently use `w-9 h-4`.
- `AuthoredValue` is shared by rows and inspector and promises exact data. Rounding
  must be explicitly scoped to row display; changing every consumer would exceed
  the request and remove exact inspection.
- Existing HEX conversion returns explanation and unavailable reasons together.
  Presentation separation must retain unavailable cases and alpha behavior.
- Group creation already exists in navigation. The workspace needs an additional
  entry to that workflow, not a second authoring implementation.
- `InspectorHeader` is used by both TokenEditor and fallback/group inspection;
  simply deleting the token header would lose controls or states elsewhere.

**V1.3 reconciled choices for final agreement:** the user approved the identified
prototype for analyst review on 16 November 2026. AC-1–16 now state its zero badges,
short unavailable HEX wording, exact decimal rounding policy, unwrapped action pair,
comparison/tab coverage, sticky composition, desktop/narrow toggle distinction,
concrete panel padding and control baseline. These are reviewed proposed contract
terms, not final implementation authorization.

**Resolve before implementation:** final agreement to this resulting contract and
V1.3 design, plus explicit implementation authorization. No unresolved product or
architecture decision remains in this bounded proposal. Production must derive
history counts from its owner, preserve creation guards/parent selection and
successful-create focus, and account for the actual sticky heading height when
keeping focused content visible; the mock does not establish those behaviors.

**User-selected control size — 16 November 2026:** after reviewing the compact
mobile iteration, the user rejected 24px as too small and selected 36px for all
screen sizes, explicitly including all buttons and inputs. V1.3 uses a 2.25rem
baseline for standard buttons, input/select fields and slider target areas;
icon buttons are square. Content can grow without a maximum-height clamp. Token
rows remain content surfaces rather than single-line controls. This supersedes
V1.1's 44px and V1.2's 24px prototype choices. Production and historical
acceptance remain unchanged pending final agreement.

**Deferred:** rounding editor fields, new precision controls, durable history,
additional token types and richer search/filter behavior.

## Verification approach

Use [proportionate verification](../workflow/agent-roles.md#proportionate-verification).

- Essential functional checks: focused history-count tests covering accepted steps,
  traversal, branching and clear/prune behavior; focused display checks for decimal
  rounding and unavailable/alpha HEX; existing affected presentation tests and
  production build/typechecks. Focused browser checks cover counts/disabled history,
  workspace group creation/cancel/focus, search layout and inspector states, plus
  representative shared-control consumers on Projects/forms for AC-16.
- Relevant integrity: demonstrate display-only rounding leaves exact authored data
  unchanged; preserve existing draft guards and application-owned history traversal.
- Representative UI coverage: inspect normal desktop and the supplied approximately
  1090px composition, retained 1120/880 transitions and a 320px narrow view; check
  long titles, both tabs, empty/group/collapsed/unavailable states, keyboard focus,
  sticky heading with scrolled content, 36px controls and reduced motion. Include
  enlarged-root/long-title focus visibility without a full viewport/state matrix.
- Optional qualification excluded: maximum projects/tokens, storage recovery,
  cross-tab concurrency, broader browser engines, exhaustive accessibility,
  performance profiling and earlier deferred qualification campaigns.
- Proposed shared ceiling: 30 aggregate verification minutes and at most two harness
  repair cycles across developer/reviewer/coordinator, assessed before implementation.
  Stop at either limit or earlier for tooling dominance/low value. Report unmet or
  unverified criteria; extensions/resumption require explicitly bounded authority.
- Current consumption: no application verification performed for this draft.
  Source/document inspection is planning, not new qualification. Earlier increment
  consumption and stopping decisions remain with those increments and are not reset.

## Design proposals and review

- Applicability: separate designer required for the inspector and history composition.
- Proposal: [Workbench polish V1.3](../project/workbench-polish-proposal-v1.md),
  with interactive source in `prototypes/increment-015-v1/`. The designer prepared
  the approved direction; coordinator browser checks and limits are recorded in
  the proposal. V1.3 was approved for analyst review on 16 November 2026.
- Direction approval — 16 November 2026: the user approved the recommended
  direction, including the compact sticky token heading, and requested a prototype
  for review. This authorizes prototype preparation only. Identified artifact
  approval for analyst design review was subsequently granted; final contract/design
  agreement and implementation authorization remain pending.
- Artifact approval for analyst review — 16 November 2026: “This looks good. I
  approve prototype V1.3 for analyst review. Please proceed with that review.”
- Analyst review — 16 November 2026: [V1.3 source consistency review](015-v1-3-analyst-review.md).
  Contract omissions were reconciled; no required material design revision was
  identified. Production integration and verification obligations remain explicit.
- Material revisions: return to the user before renewed analyst review.
- Final design/contract agreement and implementation authorization: pending.
- Proportionality: retain established visual character and behaviors; explore only
  choices needed to make these annotations coherent across existing states.

## Review baseline

Planning source baseline: `e2d3ef9131423783487603b280bf37980b8b6ac1` on
16 November 2026. The working tree was clean before this draft was created.
V1.3 analyst review used source baseline
`07c73dff160809f485a70a8a0bbd9d78a3210acf`; Git was clean before analyst document edits.
Recheck actual Git state before implementation; identify the stable implementation
snapshot, including new files, before separate review. Leave staging/commits/pushes
to the user.

## Agreed amendments

No final contract agreement yet. The reviewed proposal would amend earlier exact-list
presentation expectations for this scoped summary only and replace the earlier
44px mobile control minimum with the user-selected 36px baseline. Exact inspector/
source and authored-data requirements remain unchanged. On final agreement,
reconcile the affected current presentation conventions/status during implementation;
retain identified historical evidence. Neither this review nor prior prototype
approval authorizes implementation.
