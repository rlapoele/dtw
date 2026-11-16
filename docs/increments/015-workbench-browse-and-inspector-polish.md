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
  application/worker boundary, and reusing existing group creation from the workspace.
- Excluded: additional token types, changed search semantics, new group semantics,
  domain/persistence changes, color calculation changes, new dependencies, new
  responsive breakpoints, general application redesign or renewed qualification.

## Acceptance criteria

- AC-1 — History counts: Undo and Redo each show their respective retained step
  count in a badge at the button's top-right corner. Counts come from the session
  history owner and change coherently after accepted changes, traversal, branching,
  pruning, invalidation and project-context changes. They are not inferred from
  next-action presence. Temporarily disabled history still reports retained counts.
- AC-2 — History information: remove the visible full-width Undo/Redo description
  strip. Preserve useful next-action/empty/blocked descriptions and accessible
  control names; retain history-cleared notices and existing traversal safeguards.
  No shortcut routing, native edit undo, draft guard or modal behavior changes.
- AC-3 — HEX summary: when an sRGB HEX preview is available, the token row displays
  only its HEX notation, including alpha when applicable. The existing preview
  explanation is available through native `title` and an appropriate accessible
  description without duplicating verbose visible text. An unavailable or
  out-of-sRGB preview remains honestly unavailable; no invented HEX or silent clipping.
- AC-4 — Row decimals: color coordinates and alpha in the token-list authored-value
  summary display at most four digits after the decimal point. This is a display
  approximation only; authored source, references, editor input, calculation and
  retained data remain exact. Whole/short values gain no unnecessary trailing zeros.
  Full values remain available in the existing inspector/exact-source access.
- AC-5 — General token copy: workspace and search labels/placeholders say tokens
  rather than colors, including applicable group and empty/search-result copy.
  This wording does not claim that new token types have been implemented.
- AC-6 — Search affordance: a decorative Heroicons Outline magnifier appears inside
  the search field on the left. Text and the native search affordance do not overlap
  the icon. Search keeps its programmatic label, keyboard behavior and current matching.
- AC-7 — Group creation: the workspace header offers New group alongside New token.
  It opens the existing group authoring workflow with the existing parent-context
  rule and blocked/error/draft protections. Creating or cancelling returns focus
  appropriately to the initiating workspace action; navigation creation remains usable.
- AC-8 — Comparison labels: the inspector comparison swatches are labelled Current
  and New rather than Applied and Draft. Their underlying current applied state and
  unapplied draft meanings do not change. Existing preview/unavailable explanations
  remain accessible; resolved-tab comparison coverage is explicitly preserved.
- AC-9 — Inspector hierarchy: remove the redundant visible Inspector header row.
  Keep a programmatically named inspector region and preserve useful unavailable,
  read-only, loading and empty-state feedback in the remaining content.
- AC-10 — Inspector control: in the selected editable color-token view, the toggle
  is to the right of the comparison swatches. It remains available when collapsed
  and in group, nothing-selected, loading, read-only and unavailable states. Expanded
  points right; collapsed points left. A transform transition rotates the arrow
  between states, respecting reduced motion. Accessible name, expanded/controls
  relationships, keyboard activation and focus are retained.
- AC-11 — Comparison geometry: Current/New appear close to the token title/type
  instead of drifting to the far side of the header. Their colored areas match the
  existing token-list swatch size. Long names, unavailable specimens and narrow
  layouts wrap without losing the toggle, labels or token identity.
- AC-12 — Editor spacing: increase the authored/resolved tab-panel padding to the
  identified agreed design values. Controls, focus outlines, scrolling and lower
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
  collapse control remain visible while the token-inspector content scrolls.
  Other panes retain independent scrolling. Sticky positioning must not obscure
  keyboard focus or lower editor actions, and narrow entry/Back remains usable.

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

**Proposed for design review:** show zero badges explicitly; retained counts remain
visible while a guard temporarily disables traversal. Use native title for the
next action/reason alongside accessible descriptions. Label a rounded row summary
as approximate through accessible/native detail rather than adding verbose prose.
Reuse the existing group dialog parent-context policy. Preserve Current-only
comparison in the resolved tab unless the user selects a different design. Keep
only identity/type, comparison and collapse in a compact sticky heading within the
existing inspector scroller; place long descriptions/layer below that persistent
area so they do not consume the editor viewport. This composition is a designer
recommendation pending user direction approval, not an analyst-reviewed design.

**Resolve before implementation:** the designer must identify concrete padding,
header grouping, badge geometry, zero/disabled appearance and collapsed-rail,
group/empty/unavailable control placement. Confirm the four-decimal rounding rule
(including tiny values that round to zero) and concise unavailable HEX wording.
These must be visible in the agreed design/contract rather than selected silently.

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
  workspace group creation/cancel/focus, search layout and inspector states.
- Relevant integrity: demonstrate display-only rounding leaves exact authored data
  unchanged; preserve existing draft guards and application-owned history traversal.
- Representative UI coverage: inspect normal desktop and the supplied approximately
  1090px composition, retained 1120/880 transitions and a 320px narrow view; check
  long titles, both tabs, empty/group/collapsed/unavailable states, keyboard focus
  sticky heading with scrolled content, and reduced motion. Reuse scenarios rather than running all viewport/state pairs.
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
  the proposal. User artifact review is pending.
- Direction approval — 16 November 2026: the user approved the recommended
  direction, including the compact sticky token heading, and requested a prototype
  for review. This authorizes prototype preparation only. Identified artifact
  approval for analyst design review and final implementation authorization remain
  pending.
- Analyst review: pending user approval of the identified proposal; this draft is
  source-based requirements preparation, not a review of a design proposal.
- Material revisions: return to the user before renewed analyst review.
- Final design/contract agreement and implementation authorization: pending.
- Proportionality: retain established visual character and behaviors; explore only
  choices needed to make these annotations coherent across existing states.

## Review baseline

Planning source baseline: `e2d3ef9131423783487603b280bf37980b8b6ac1` on
16 November 2026. The working tree was clean before this draft was created.
Recheck actual Git state before implementation; identify the stable implementation
snapshot, including new files, before separate review. Leave staging/commits/pushes
to the user.

## Agreed amendments

None. The proposed rounded row display would amend earlier exact-list presentation
expectations for this scoped summary only; exact inspector/source and authored-data
requirements remain unchanged. Record final user agreement before implementation.
