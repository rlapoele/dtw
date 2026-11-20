# Increment 023: Token description and inspector sections

- Contract status: Draft
- Delivery status: Not started
- User request — 20 November 2026: edit token descriptions; group editable fields under a labeled section; consistently labeled expandable/collapsible read-only sections with a far-right animated chevron; show identity/path as Metadata field/value rows; remove duplicate Regeneration information.
- Agreement: the requested outcome is established. The user agreed description editing within the current editable color-token scope. On 20 November the user approved the proposed structure for a visual prototype. Prototype review, analyst design review, final contract agreement and production implementation authorization remain pending.
- References: [workflow](../workflow/agent-roles.md), [presentation conventions](../project/presentation-conventions.md), [visual direction](../project/visual-direction.md), [architecture](../project/architecture.md), [token model](../design-tokens/conceptual-model.md), [layer editing](021-token-layer-editing.md), [retention limits](007-local-retention-and-backup.md#deferred-qualification).

## Outcome

Authors can revise a token's description alongside its existing editable fields,
then Apply or Cancel one draft. Consistent inspector sections make editing and
inspection distinguishable and reduce scrolling without hiding unsaved work or
losing the current draft. Identity and namespace facts are readable alongside the
other metadata, and Regeneration appears once.

## Proposed bounded scope

- Add a labeled Description textarea to the existing token-edit session. Use
  the user-agreed current non-component, single-unconditional-color literal/reference
  editing scope; wider description-only metadata editing is excluded. Regeneration protection does not prohibit manual edits under
  the existing policy. Retain read-only/pending/recovery/capability gates.
- Extend the accepted revision operation to commit description, layer and value
  atomically. Preserve all unedited authored data, no-op semantics, retention,
  revision conflicts and one-step Undo/Redo. Do not autosave the textarea.
- Group all currently editable token fields, including Description, Layer and
  literal/reference value controls, under one consistent section. Recommend
  **Edit token** over **Value**, since descriptions and layer are not token values.
  The designer must propose placement relative to the current tabs and actions.
- Use a consistent heading/trigger treatment for all agreed top-level inspector
  sections, with the existing shared Heroicons chevron on the far right, animated
  rotation and reduced-motion behavior consistent with navigation.
- Move Project identity, Token identity and path facts into Metadata definition
  rows alongside Regeneration, Semantic role and Parent group. Preserve exact
  identities, segment boundaries, unavailable/error states and root/missing-group
  distinctions; do not replace a structured path with an ambiguous dotted string.
- Remove the duplicate inspector-footer Regeneration row; retain the Metadata row.
- Keep complete authored source and raw derived data opt-in, bounded and read-only.
  Recommend separate consistently styled top-level source sections instead of
  placing an unrelated nested disclosure inside Metadata. No eager source request
  on inspector render or simply opening Metadata.
- Exclude token rename/move, semantic-role/regeneration editing, new value types,
  component associations, bulk edits, project preference editing and new persisted
  inspector settings. No canonical or authored-envelope version change is needed
  merely to edit the existing optional token description field.

## Acceptance criteria

- AC-1 — Description editing: eligible tokens expose a labeled textarea populated
  from their applied optional description. Editing remains draft-only. Applying
  exact multiline text preserves whitespace; explicitly clearing it removes the
  optional description. Unchanged absence/empty historical text is not rewritten
  merely by opening the inspector or applying an unrelated field edit.
- AC-2 — Atomic change: description-only and combined description/layer/value edits
  use one accepted operation and one history step. Cancel restores all fields from
  the current applied baseline. An unchanged candidate produces no write, date
  change or history entry. Explicit command omission preserves description;
  removal must be unambiguous rather than inferred from missing command input.
- AC-3 — Draft/recovery: description participates in dirty detection, departure
  protection, pending/rejected/unknown outcomes, changed-baseline comparison and
  explicit reapply. A failed save retains exact input. Current description changes
  cannot be silently overwritten because recovery compares only value/layer.
  Invalid active value drafts still block the combined Apply; inactive literal
  errors retain the existing reference-mode behavior.
- AC-4 — Section grouping: the user-approved design visibly groups all editable
  fields and keeps one Apply/Cancel action pair before read-only information.
  Read-only sections share consistent label typography, trigger geometry and
  far-right decorative chevron. No duplicate Regeneration row remains. Inspect-only
  tokens retain truthful existing facts and do not gain unintended mutation controls.
- AC-5 — Disclosure behavior: section triggers work with pointer and keyboard and
  expose expanded state and associated content. Collapsed content is not focusable
  or announced as visible. Closing/reopening a section or switching retained tabs
  does not discard raw description, HEX, byte, reference or layer drafts, change
  dirty state, issue commands, or move the session hook into conditional content.
  Apply/Cancel, validation and recovery must not become unreachable when editing
  is collapsed; a required focus destination must be visible before it receives
  focus. Initial expansion and per-token/session lifetime follow the approved design.
- AC-6 — Motion and layout: chevrons animate their expanded/collapsed state without
  replacing labels or changing accessible names, and reduced-motion suppresses
  transitions. At desktop and representative narrow inspector widths, labels,
  textarea, metadata values and actions fit/wrap without horizontal overflow;
  keyboard focus remains visible and controls remain reachable.
- AC-7 — Metadata/source: identities and path details are field/value rows inside
  Metadata, with missing/unavailable/cyclic/invalid path information represented
  truthfully. Complete authored source remains explicitly requested only when its
  own disclosure opens, retains loading/error/retry behavior, and invalidates stale
  responses on collapse/revision change. Raw derived diagnostics preserve existing
  data and do not become canonical facts through presentation.
- AC-8 — Retained integrity: accepted descriptions survive reopen, ordinary later
  edits, Undo/Redo, backup and exact restore. Token/project identity, authored space,
  exact components/alpha, aliases, namespace and unrelated metadata are unchanged
  unless explicitly edited by the existing workflow. Existing supported descriptions
  require no invented migration or authored-envelope bump.

## Decisions and design work pending

1. **Description eligibility — agreed:** the user selected the current editable
   color-token scope. Preserve existing regeneration/manual-edit semantics; no
   broader metadata operation or token-editing eligibility is authorized.
2. **Section name:** recommend Edit token. Value is accurate for the color/reference
   subsection but too narrow for description and layer. The user approved this label as part of the structure for the visual prototype.
3. **Section inventory and tabs — approved for prototype:** place a
   complete Edit token section above read-only Applied / Resolved & trace tabs.
   Group Description, Layer and value fields there, keeping its action/error/recovery
   area visible even when collapsed. Read-only sections use independent consistent
   headings/chevrons. Metadata contains direct identity/path rows; All authored data
   is a separate lazy, bounded top-level section. The design artifact/link is pending
   user direction and must be identified before analyst consistency review.
4. **Expansion policy — approved for prototype:** editing and ordinary
   read-only sections start open; raw source sections start closed. A collapsed edit
   section indicates unsaved changes. Independent toggles avoid an exclusive
   accordion. No persisted preference is proposed; selection-lifetime and focus
   details must be explicit in the design artifact. Material layout changes remain
   subject to user approval before prototype work and final implementation agreement.
5. **Clearing description:** propose command omission = preserve, `null` = remove,
   and string = exact text. The textarea's deliberate empty edit maps to removal.
   This supports clearing without normalizing untouched legacy optional text.

## Technical findings and touchpoints

- `Token.description?: string` already exists in `src/domain/token.ts`, token
  creation, selected-token projections, snapshots and versioned backup data.
  No schema migration is necessary for the field itself.
- `src/application/authoring.ts` currently revises value and optional layer only;
  `color-revision-policy.ts` restricts the operation to one unconditional color
  assignment on a non-component token. Whole-candidate validation remains intact;
  this increment does not implicitly authorize progressive repair.
- Extend the selected operation's host command/request/recovery validation paths
  together. `useTokenEditor` baseline, dirty calculation, accepted result contract,
  recovery.previous/current and Apply/Cancel messages currently know value/layer.
  Update all owning callers together rather than adding parallel save authority.
- `TokenEditorContent` currently renders description as read-only header prose,
  Layer above tabs, authored editing/actions in a single active tab panel, and a
  duplicate footer. `TokenMetadata`, `ResolvedTokenPanel` and `ExactSource` own
  relevant read-only sections. Keep their actual consumers and lifetime explicit.
- Navigation `TypeBranch` already has an animated shared Icon and inert collapsed
  content. Reuse its visual convention without importing navigation-specific
  semantics or introducing a generalized accordion framework for speculative reuse.
- Exact-source loading currently owns generation/open guards and revision-keyed
  lifetime; disclosure refactoring must preserve those properties.

## Verification and handoffs

Designer assessment and identified user-approved artifact precede analyst review.
Final contract/design agreement precedes a fresh-context developer and separate
fresh-context reviewer. One code-writing agent at a time; no staging/commits/push.

Before implementation, coordinator records a shared ceiling of 30 aggregate
verification minutes and two harness repairs, adjusted only if concrete scope
requires it. Essential checks: focused description command/state/recovery tests,
protocol rejection, retention/history/exact-restore preservation, section state and
source-loading tests, typechecking/build, plus a bounded Chrome path for edit,
collapse/reopen, Apply/Cancel, keyboard/focus, reduced motion and narrow layout.
Do not rerun broad retention/engine/stress campaigns. Any untested acceptance path
remains explicitly unverified; budget exhaustion cannot turn it into a passing claim.

Planning baseline: `25b15fabfdcbf13d249844a29337648d85c9f078`, clean at inspection.
Analyst source inspection approximately six minutes; no tests/browser runs and no
harness repairs. Increment 022 and earlier acceptance/qualification limits remain
closed. No production implementation or independent implementation review occurred.

Suggested commit: `docs: draft token description and inspector section increment`.

## Prototype authorization — 20 November 2026

The user stated: “I approve this structure for a visual prototype. Committed and
pushed.” This approves the presented common Edit token section, visible actions,
read-only tabs and independently collapsible sections for prototype work only.
The designer is preparing `prototypes/increment-023-v1/` with local illustrative
state. No production implementation is authorized. The prototype will be shown
to the user before analyst consistency review; material revisions return to the
user. Prototype verification is bounded to 15 aggregate minutes and one harness
repair, separate from the not-yet-started implementation allowance.

## Prototype V1 handoff — 20 November 2026

[Interactive V1 and design notes](../../prototypes/increment-023-v1/DESIGN-V1.md)
implement the approved structure with local sample state only. Prototype build and
isolated TypeScript checks passed. Coordinator Chrome checks covered description
editing, collapsed dirty state with visible actions, Cancel/Apply, tab preservation,
keyboard Metadata disclosure and reduced-motion. Desktop/narrow captures were
inspected; a transparent sticky heading was corrected and rechecked. Approximately
eight of 15 prototype verification minutes used, zero harness repairs.

The prototype server is available at `http://127.0.0.1:4223/` while running.
Production source is unchanged. Failure/conflict/source scenarios are illustrative;
no real command, history or retention acceptance is implied. User review of V1 is
next, including approval for analyst consistency review. Neither analyst design
review nor production implementation is authorized yet.
