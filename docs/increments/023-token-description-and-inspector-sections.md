# Increment 023: Token description and inspector sections

- Contract status: Agreed
- Delivery status: In progress
- User request — 20 November 2026: edit token descriptions; group editable fields under a labeled section; consistently labeled expandable/collapsible read-only sections with a far-right animated chevron; show identity/path as Metadata field/value rows; remove duplicate Regeneration information.
- Agreement: the requested outcome and current editable color-token scope are established. On 20 November the user approved the structure for a visual prototype, refined V1, then said “I think the prototype looks good. Let us proceed.” The analyst completed consistency review without material changes or unresolved product decisions. The coordinator treats the user’s explicit instruction to proceed with the accepted prototype as implementation authorization for this unchanged scope, after completing the review.
- References: [workflow](../workflow/agent-roles.md), [presentation conventions](../project/presentation-conventions.md), [visual direction](../project/visual-direction.md), [architecture](../project/architecture.md), [token model](../design-tokens/conceptual-model.md), [layer editing](021-token-layer-editing.md), [retention limits](007-local-retention-and-backup.md#deferred-qualification).

## Outcome

Authors can revise a token's description alongside its existing editable fields,
then Apply or Cancel one draft. Consistent inspector sections make editing and
inspection distinguishable and reduce scrolling without hiding unsaved work or
losing the current draft. Identity and namespace facts are readable alongside the
other metadata, and Regeneration appears once.

## Resulting scope for final agreement

- Add a labeled Description textarea to the existing token-edit session. Use
  the user-agreed current non-component, single-unconditional-color literal/reference
  editing scope; wider description-only metadata editing is excluded. Regeneration protection does not prohibit manual edits under
  the existing policy. Retain read-only/pending/recovery/capability gates.
- Extend the accepted revision operation to commit description, layer and value
  atomically. Preserve all unedited authored data, no-op semantics, retention,
  revision conflicts and one-step Undo/Redo. Do not autosave the textarea.
- Group all currently editable token fields, including Description, Layer and
  literal/reference value controls, under **Edit token**, above the read-only
  **Applied / Resolved & trace** tabs, following reviewed V1. Its single action,
  error and recovery footer stays visible when editable fields are collapsed.
- Use a consistent heading/trigger treatment for all agreed top-level inspector
  sections, with the existing shared Heroicons chevron on the far right, animated
  rotation and reduced-motion behavior consistent with navigation.
- Move Project identity, Token identity and path facts into Metadata definition
  rows alongside Regeneration, Semantic role and Parent group. Preserve exact
  identities, segment boundaries, unavailable/error states and root/missing-group
  distinctions; do not replace a structured path with an ambiguous dotted string.
- Remove the duplicate inspector-footer Regeneration row; retain the Metadata row.
- Keep complete authored source and raw derived data opt-in, bounded and read-only.
  Use separate consistently styled top-level source sections rather than a nested
  disclosure inside Metadata. No eager source request
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
  focus. Edit token initially opens; every read-only section initially collapses.
  Choices survive read-only tab switches and reset on selecting a different token.
  Collapsing Edit token shows Unapplied changes when dirty. Successful Apply and
  Cancel reopen Edit token and focus Description after the enabled field is mounted.
  Failure/recovery focus stays in the always-visible footer; a collapsed invalid
  draft offers Open editable fields to reveal the editor and focus Description.
- AC-6 — Motion and layout: chevrons animate their expanded/collapsed state without
  replacing labels or changing accessible names, and reduced-motion suppresses
  transitions. At desktop and representative narrow inspector widths, labels,
  textarea, metadata values and actions fit/wrap without horizontal overflow;
  keyboard focus remains visible and controls remain reachable. Match the accepted
  V1 gap after Value source to Description-to-Layer spacing; remove the hairline
  immediately above actions, use 4px action-row top padding, and remove idle helper
  prose while preserving meaningful dirty/error/recovery/outcome feedback.
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

## Reviewed design and bounded implementation decisions

The identified artifact is [refined V1](../../prototypes/increment-023-v1/DESIGN-V1.md),
including the user's collapsed-read-only defaults and subsequent spacing/action
refinements. Its layout was approved for analyst review; the resulting contract
below awaits final agreement. No further material product/design question was
identified by the analyst.

1. **Eligibility — already agreed:** only the current non-component, single-
   unconditional-color literal/reference revision flow. Regeneration protection
   retains its existing manual-edit allowance. No broader metadata operation.
2. **Editing and action placement:** Description, Layer and value editing live in
   Edit token above the read-only tabs. One footer remains visible even when the
   fields are collapsed. Idle status text is empty; useful feedback remains.
3. **Read-only sections:** Applied contains Currently applied, Metadata and All
   authored data. Resolved & trace contains Resolved value, Resolution trace,
   Resolution diagnostics and Raw resolution data. Each has the same full-width
   accessible heading trigger, far-right shared chevron and independent state.
   Currently applied includes the applied description/layer as well as existing
   value/HEX facts; drafts never leak into that summary.
4. **Expansion/lifetime:** Edit token open, all read-only sections closed initially;
   preserve choices across tab changes and reset to defaults for another selected
   token. These are session presentation choices, not project preferences. Keep the
   existing editor hook, selected-token ownership and raw draft lifetime intact.
5. **Description command semantics:** omitted optional description preserves it;
   `null` removes it; string stores exact text. The textarea's deliberate clear maps
   to removal. Track the baseline sufficiently to omit untouched absent or empty
   historical descriptions during unrelated edits. Do not trim whitespace, invent
   content, or normalize optional authored data through the UI.
6. **Path rows:** show exact JSON-quoted project/token identities and a truthful
   path status. A derived path uses a JSON segment-array value; an invalid path
   includes its diagnostic codes and exact identity/cycle details in direct rows;
   an unavailable path includes its reason. Preserve Parent group root/missing
   distinctions. Do not invent path segments or silently omit diagnostics merely
   because the ordinary prototype only shows a derived path.
7. **Source behavior:** top-level source sections remain opt-in. Reuse production
   on-demand loading, request cancellation/generation guards and bounded source
   rendering. Collapse releases prepared text; revision changes invalidate it.
   Tab return may re-prepare an already-open source through existing guards, but
   opening Metadata or another section never requests complete authored source.
8. **Motion/layout:** reproduce the reviewed heading/chevron direction and user
   refinements through owned controls, semantic tokens and project utilities.
   Rotation uses a short transition disabled by reduced-motion; no height animation
   is required. Prototype CSS is visual evidence, not an exception allowing copied
   custom values or movement of state ownership in production.

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

## Analyst consistency review of refined V1 — 20 November 2026

**Result: consistent; ready for final contract/design agreement.** No material
mismatch requiring another design revision was found. Review covered the identified
V1 design notes, `main.tsx`, `prototype.css`, the contract, current editing/recovery
owners, namespace result shapes, and presentation/domain constraints. This is a
source/design review, not independent runtime or production acceptance.

- AC-1–AC-3: the local description sample demonstrates placement and shared actions.
  Real omission/removal/exact text, no-op, command validation, description-aware
  changed-baseline recovery and failure retention remain production obligations.
  Prototype fingerprint/JSON sample construction is not a replacement for them.
- AC-4–AC-6: V1 matches Edit token above the read-only tabs, an always-visible footer,
  initially collapsed read-only sections, shared chevrons and reduced motion. Source
  confirms equal Field/radio spacing, no action-top hairline, `pt-1`, and no idle
  helper sentence. The contract now states token-change reset and visible-target
  focus explicitly rather than leaving these to implementation convenience.
- AC-7: direct ordinary identity/path rows and a single Regeneration row match the
  request. The prototype does not exercise invalid/unavailable paths; production
  must preserve their complete diagnostics using the direct-row policy above.
  Source loading is simulated, so retain the real guarded worker/source flow.
- AC-8: no domain-model or persisted-format change is needed for the existing optional
  description. Real retention/history/reopen/backup behavior remains to be verified.

Prototype approval chronology in the V1 notes predates this review; this section
records the user's subsequent “prototype looks good” approval for analyst review.
It does not promote simulated storage/conflict examples to production evidence.
Final implementation authorization is still pending, with no additional unresolved
product choice beyond agreeing this consolidated contract and reviewed design.

Review baseline: `af68cb42391be28239322cecfce848e2c5c455bd`.
Reviewed artifacts (SHA-256):
- `DESIGN-V1.md`: `975b7211cc795fc64750b851cb3c801c7d414899b03974f2662d588ee91185ba`.
- `main.tsx`: `8aebac96933339dd922d4309f4d5dc0bd7e75e9875e956c6ca9d7d7655a8fe6f`.
- `prototype.css`: `bba05cfcf935e2ef0700918f08d14c2c3ca6df2ccfb5b4fea133474150a0d2fb`.

Approximately four analyst source-review minutes; no tests/browser runs and no
harness repairs. This is planning/design review, not a restart of the completed
prototype campaign or earlier qualification. The production verification allowance
has not begun. Suggested commit: `docs: finalize inspector section contract after V1 review`.

## Implementation handoff — 20 November 2026

The coordinator completed the analyst gate before implementation. The reviewed
contract introduces no material departure from the user-approved refined V1;
the user's “Let us proceed” is carried forward as authority to implement that scope.
Use the identified V1 and consolidated criteria above. Historical pending-authority
statements describe their earlier stages and are superseded by this handoff.
One developer followed by a fresh independent reviewer; no staging/committing/push.
Production verification ceiling: 30 aggregate minutes, two harness repair cycles.
Essential checks cover description semantics/state/command recovery, history/retention,
disclosures/focus/lazy source and representative browser layout. Earlier campaigns
remain closed; prototype/review effort stays recorded separately.

## Developer implementation handoff — 20 November 2026

Implemented against the agreed refined V1 and `af68cb42391be28239322cecfce848e2c5c455bd`.
Independent review and user acceptance remain pending at this handoff.

- Description extends the existing revision input and runtime command validator:
  omission preserves, null removes, strings retain exact text. Value/layer/description
  reach the existing whole-candidate acceptance, retention and history authority
  together. No model/envelope migration or new persistence path was introduced.
- The existing editor session owns description text, deliberate-clear tracking,
  dirty/recovery baselines and disclosure choices. Untouched absent/historical empty
  descriptions are omitted during unrelated edits. A deliberately cleared historical
  empty description is removable. Recovery comparison shows previous/current
  description and retains exact failed input. Successful Apply/Cancel reveal and
  focus Description; failure and review remain in the visible footer.
- Edit token and its single footer precede the read-only tabs. InspectorSection
  supplies the common accessible trigger, hidden content and reduced-motion
  chevron. Metadata has direct exact identity/path diagnostics and one Regeneration
  row. Authored and raw derived source share bounded opt-in rendering, retry,
  generation guards, revision invalidation and release on collapse.
- Resulting-tree source check: InspectorSection is shared at SelectionInspector,
  the nearest owner of its token and exact-source/group consumers. Token-specific
  sections stay private to TokenEditor; session hook callers/keys stay unchanged.
  ColorEditor's sole production caller now owns initial spacing. Existing semantic
  utilities and Icon are reused, with no new dependency or CSS exception. The
  existing presentation-conventions action-placement section is reconciled.

Developer verification (approximately eight aggregate minutes, zero harness
repairs): focused command/protocol, editor-state, source, metadata and retention
history/backup/exact-restore tests pass. The broader bounded run covered 290 tests
across presentation plus color revision/history/codec, excluding the previously
known unrelated Icon assertion. It initially found one removed source-warning
assertion; restoring the useful warning inside the source disclosure and rechecking
its owning test passed. Earlier action-placement/callback/focus assertions were
updated for this contract. Final affected session/HEX/coordination recheck: 81 passed.
`npm run typecheck`, `npm run build` and `git diff --check` passed; build retains the
existing bundle-size warning. Build preceded the final small spacing/warning and
clear-tracking refinements; final typechecking and affected tests include them.

Tests demonstrate exact multiline application/removal, omission/legacy-empty
preservation, description-aware recovery, failed input retention, collapsed/tab
state persistence, source cancellation/retry, truthful path rows, single history
steps, no-op write/revision preservation, reopen and backup/exact restore. Browser
focus, responsive rendering and actual worker/native storage evidence belongs to
the coordinator's separate check. Browser fault injection, screen-reader delivery
and broader engine/stress qualification remain unverified; earlier limits stay
closed. No staging, committing or pushing was performed.

Suggested commit: `feat: edit token descriptions and organize inspector sections`.

## Independent review and implementation handoff — 20 November 2026

Implementation and independent review are complete; user acceptance is pending.
Reviewer `/root/inspector_sections_reviewer` derived expectations from the contract
and refined V1 before source inspection, then independently passed 117 focused
tests across six files and diff checks. No actionable code findings remained.
The reviewer checked command/host propagation, exact description semantics,
recovery, state lifetime, visible actions/focus reveal, metadata diagnostics and
lazy source guards. A subsequent spacing-only correction was source-rechecked:
block textarea and zero radio-fieldset bottom margin leave the two agreed 17px
gaps. No state/handler change followed review.

Reviewed code: base `af68cb42391be28239322cecfce848e2c5c455bd`, tracked source/test
patch SHA-256 `fa8294eae4eefdf9641deee11a5778e1ce9d5c5d8c65fa6844260fc20d26b13a`, plus:
- `src/presentation/App/components/TokensWorkbench/components/SelectionInspector/components/InspectorSection.tsx`: `b9b6d2bdd7c75b1a14418822510ca46528469acbbe347c205512b3005e30a4d6`.
- `test/presentation/inspector-metadata.test.tsx`: `0095771fd9214fc02528c57db73748a9d35d3b7080e5d338e8a50903fbe20209`.

Coordinator Chrome checks used disposable data at `127.0.0.1:5193`:

- All read-only sections initially collapsed on both tabs; Edit token initially open.
- Exact multiline description applied from a collapsed editor on Resolved & trace;
  Apply reopened Description and returned keyboard focus. Actual source JSON
  preserved whitespace. Undo/Redo restored description; clearing removed the
  optional property, and Undo restored it. Collapsed Cancel restored the baseline
  and returned focus to visible Description.
- Real Metadata project/token/parent identities and path rows, a single Regeneration
  row, opt-in source reading and native reload/reopen retaining exact description.
- Keyboard Metadata toggle and reduced-motion suppression; 390px inspector checked
  visually. Final computed geometry confirmed Description→Layer and radios→color
  controls are both 17px. [Desktop capture](../../output/playwright/increment-023-implemented-desktop.png)
  and [narrow capture](../../output/playwright/increment-023-implemented-narrow.png)
  show the implemented structure before that final spacing-only correction.

Two bounded harness repairs were used: the reduced-motion assertion was corrected
from duration alone to transition-property suppression, and a development hot-reload
hook-order interruption was cleared by reloading stable code and waiting for the
inspector to mount. No hook-order failure reproduced after that full reload; saved
data remained intact. These are not claims of general hot-reload qualification.
Approximate production verification total: 22/30 minutes (developer 8, reviewer 6,
coordinator 8), two/two harness repairs. Verification stops here. No earlier
qualification campaign was restarted.

Screen-reader delivery, live fault-injected retention/recovery and exhaustive
path/engine combinations were not exercised in Chrome. Focused deterministic
application/hook/source tests cover their scoped semantics but do not replace
browser evidence for every failure path. The known unrelated Icon test assertion
was excluded rather than changed; no new full-suite pass is claimed. Production
build passed before the final bounded refinements; final typecheck/affected tests
and the spacing source/browser recheck are recorded above.

Next human review: use an editable color token, revise its description, collapse
Edit token, then Apply or Cancel. Confirm the grouped controls, collapsed read-only
sections and direct Metadata rows match the accepted prototype. Production edits
are ready for user review, not marked user-accepted. Changes remain unstaged.
Suggested commit: `feat: edit token descriptions and organize inspector sections`.
