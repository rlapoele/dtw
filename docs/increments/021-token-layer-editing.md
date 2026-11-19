# Increment 021: Token layer editing

- Contract status: Agreed
- Delivery status: Completed; user acceptance pending
- Agreement: on 19 November 2026, after the proposed scope and Apply/Cancel behavior were explained, the user said, “Committed and pushed. Go ahead with making the Layer editable.” This records that conversational agreement and implementation authorization; no separate prototype approval is asserted.
- Implementation baseline: `16d8f5b` (working-tree state must be checked independently).
- References: [design record](../project/workbench-layout/layer-editing-v1.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [workflow](../workflow/agent-roles.md), [Undo/Redo](012-session-undo-redo.md), [retention limits](007-local-retention-and-backup.md#deferred-qualification).

## Outcome and scope

Users can change an editable color token's layer from a labeled native select in
the inspector, replacing its layer badge. Changes remain drafts until Apply changes
and can be cancelled together with value edits. The accepted options are
Unspecified, Primitive and Semantic. This does not add component-definition
editing, broaden value-editing eligibility, or change token identity/type/path.

- Apply the dropdown to the current non-component, single-unconditional-color
  literal/reference editing scope. Regeneration-protected tokens remain manually
  editable under the existing explicit-edit policy.
- Keep existing component tokens inspect-only. Component is not an available
  destination; never invent or remove a component-definition association to make
  a selection valid. Other inspect-only tokens retain truthful layer display.
- Integrate layer and value in one editor draft, one command gate and one atomic
  accepted operation. Apply and Cancel remain reachable from both inspector tabs.
- Preserve session history, local retention, recovery, exact authored values,
  diagnostics, lifecycle dates, and stable selected-token identity.
- Exclude token names/descriptions/roles/namespace editing, new token types,
  component associations, bulk operations, new dependencies, durable history,
  and any restart of deferred storage or cross-browser qualification.

## Acceptance criteria

- AC-1: Eligible token inspection shows a labeled Layer select in the existing
  header-metadata area. Missing layer displays Unspecified. The three accepted
  choices are accessible by keyboard and correctly reflect the draft. Component
  is visible but disabled, with the design’s adjacent association explanation. Inspect-only
  and component tokens cannot mutate their layer; their current facts remain visible.
- AC-2: Selecting a layer changes only the session draft. Apply changes commits
  the proposed layer and value atomically; Cancel restores both from the current
  accepted baseline. A layer-only draft can be applied with unchanged value.
  Returning both fields to the accepted baseline produces no retained write,
  lifecycle-date change, or history entry. A layer-only return to the baseline
  clears layer dirtiness; existing value-draft edited-flag semantics need not be
  redesigned, provided applying an unchanged candidate remains a no-write no-op.
  Pending/recovery/read-only gates apply
  to the select and existing actions consistently.
- AC-3: Layer changes retain exact token identity, name, namespace, description,
  semantic role, regeneration policy and authored assignment unless that value was
  deliberately edited in the same draft. Unspecified removes the optional layer
  property rather than storing a new sentinel. Domain and retained-data constraints
  reject component transitions/associations outside this scope. Invalid input or
  rejected acceptance does not partially change the token.
- AC-4: Dirty-state, departure/discard, Cancel, success focus and conflict-recovery
  flows cover both draft concerns. Changing Authored value / Resolved & trace tabs
  does not reset the layer draft, hide its only actions or create another editor
  owner. Apply/Cancel stay reachable from both tabs. Recovery never silently
  overwrites newer layer data or treats a metadata change as an unchanged baseline.
  Shared actions must not restore focus into an inactive panel; the always-mounted
  Layer select is the fallback. Replace obsolete metadata-preservation copy with
  wording that acknowledges layer editing.
- AC-5: A successful layer-only or combined edit creates one existing-session
  Undo/Redo step, with correct token targeting and useful action text. Undo/Redo
  restores value and layer together through the existing retention boundary;
  no-op edits preserve Redo. Current bounds, lifecycle handling and dirty-draft
  safeguards remain intact.
- AC-6: Accepted changes survive normal readback/reload and exact backup/restore
  through existing supported authored data. Pending, rejected, unknown-outcome and
  retained-but-unreadable results preserve the draft/recovery information and do
  not permit blind duplicate writes. Runtime command/receipt validation and
  old-reader compatibility are addressed explicitly as below.
- AC-7: Reclassification updates browse/navigation layer counts and grouping from
  accepted state without replacing selected token identity or losing its inspector.
  If the existing layer-filtered list no longer contains that token, preserve the
  current browse scope and selection using the existing selected-outside-view
  behavior; do not jump to a different token or silently broaden the filter.
- AC-8: Existing alias imports, presentation ownership, hook callers, editor keys,
  draft lifetime and application-command authority remain intact. Reuse owned
  Select and existing draft/action contracts; do not put model mutation in the
  header component. Review actual consumers and affected resulting file names/tree.

## Technical boundary and compatibility

The current revise-color command only changes the assignment; layer editing needs
an explicit application/transport change. Implementation may extend that operation
within this agreed color-edit scope, but must distinguish an omitted layer request
(preserve current layer, for existing callers) from explicit Unspecified (remove it).
A typed explicit unset such as `null` belongs only in the command/draft contract,
never in the authored token. Layer-only edits must not coerce or reconstruct exact
values through their rounded display text.

Prefer the smallest compatible extension over a generic metadata-editing framework.
Inspect all command runtime validators, request/response contracts, operation labels,
receipt validation, accepted-history snapshots and recovery readback. If the existing
operation/record versions remain valid, record why their semantics and old-reader
handling remain safe. If a new operation or incompatible retained envelope is
necessary, use explicit versioning with safe old-reader refusal, not permissive
unknown-operation acceptance or silent data stripping. Canonical layer values and
backup envelope do not need a new representation merely to expose this editor.
Material compatibility/scope changes return to the coordinator; routine compatible
implementation choices do not create another user approval gate.

## Verification and stopping plan

Essential checks:

- Focused application/domain tests for all three layer states, value+layer atomic
  acceptance, layer-only edits, unchanged no-op, malformed/component rejection,
  protected manual edits and preservation of unrelated authored data.
- Targeted session/command checks for dirty Cancel, both-tab actions, stale-baseline
  recovery, retained/readback gates, one-step Undo/Redo and selected-outside-filter
  handling. Use controlled tests for exceptional outcomes; do not restart browser
  storage fault campaigns.
- Typechecking and affected suites; a bounded Chrome check with disposable data for
  changing a layer, tab switching, Cancel/Apply, selection after reclassification,
  and Undo/Redo. Check native keyboard/focus and one narrow inspector layout where
  available. Report unavailable browser evidence as a gap, never as a pass.
- Independent reviewer receives an identified stable source snapshot and this
  contract/design, without the developer's conclusions in its initial brief.

Shared ceiling: **30 aggregate verification minutes and two harness-repair cycles**
across implementation/review. Allocate initial document review 2 minutes, developer
at most 17, reviewer 8, coordinator 3. Record approximate consumption and remaining
allowance in handoffs. Stop earlier when the remaining checks cannot change a useful
decision. Prior campaigns, exhausted allowances and acceptance gaps remain stopped.
No staging, committing or pushing by agents; the user owns those actions.

## Analyst review

Reviewed [Inspector layer editing V1](../project/workbench-layout/layer-editing-v1.md)
on 19 November 2026 against the accepted scope and current owning sources. No
blocking material discrepancy remains. The record correctly keeps the select
above tabs, one action region outside panels, unavailable Component visibly
explained, and focus/recovery aware of layer data and inactive tabs. The no-op
criterion requires no retained write; it does not broaden this slice into redesign
of existing value-draft edited flags. Layer-only dirtiness clears on return to the
baseline. The proposed optional request field with explicit unset is compatible
in principle; implementation must prove its runtime/retained-reader handling.

Initial contract/design review used approximately 2 aggregate minutes, zero
harness repairs. No production code, tests or browser verification were performed
by the analyst. Implementation and the independent stable-snapshot review may
proceed under the recorded authorization and remaining shared allowance.

## Developer completion evidence — 19 November 2026

Implemented the existing color editor's Layer draft and shared action region.
The owned native Select appears above the tabs with Unspecified, Primitive,
Semantic and a visibly disabled Component option plus adjacent explanation.
Existing editing eligibility remains authoritative. Layer and active value submit
through one revise command; Cancel discards both. Layer-only return to baseline
clears dirtiness. Recovery compares previous/current layers alongside authored
values and preserved input. Shared errors/recovery/actions remain outside tab
panels; Apply and Cancel defer focus until controls are enabled and use Layer
when Resolved & trace is active. Literal/Reference radios are preserved.

The application command accepts optional `layer`: omission preserves existing
callers' behavior; `null` removes the authored property. Other inputs, including
Component, are rejected. Assignment construction retains existing exact strings;
passive color-space viewing does not reconstruct the applied value. Existing
retention acceptance performs unchanged detection before dates, writes or history
change. Existing whole-snapshot history restores layer and value together, with
its existing `Change <token path>` action label. Existing readback targets stable
selected identity independently of filtered rows; no browse scope mutation was
added.

### Compatibility decision

No new canonical, backup, operation or retained-record version is required.
Primitive, semantic and absent layers are already valid supported authored data.
The existing `reviseColorToken` receipt identifies the edited token and accepted
snapshot; it does not encode an assignment-only delta or replay a command body.
Historical snapshots are admitted in full, so older supported snapshot readers
retain these layers rather than strip them. The request boundary remains closed:
new readers validate the optional field, while an older command reader rejects
an unknown `layer` request field before mutation. Omitted requests retain their
previous meaning. Existing response/attempt correlation continues to validate
operation, token identity and revision; no permissive unknown-operation path was
introduced. Component associations remain subject to the existing domain and
retained snapshot admission constraints.

### Verification and limits

- 125 focused tests passed across application color revision, retained history,
  protocol validation, hook coordination, editor sessions, section rendering,
  identity presentation, worker client and the new layer rendering tests.
- New coverage exercises all three supported layer states, malformed/component
  destination rejection without partial mutation, protected manual edits, exact
  missing/long decimal channels, combined alias+layer edits, layer-only retained
  no-op with Redo preserved, one-step layer/value Undo, retained decoding and exact
  backup round-trip, receipt targeting, converted-view precision preservation,
  pending duplicate prevention, failure preservation, metadata-only recovery,
  Cancel and visible-tab focus intent. Static rendering verifies shared actions
  on both tabs and that inactive invalid literal byte input does not block an
  active reference draft. These are controlled/markup tests, not browser evidence.
- Typechecking passed. Production build passed with the existing large-chunk
  advisory. The final Cancel focus-timing refinement was followed by the 35-test
  coordination suite, typechecking and diff checks; build preceded that refinement.
- Source review confirmed retained selection/readback ownership, existing
  selected-outside-list behavior, semantic utility reuse, owned Select/Icon and
  unchanged editor caller/key/lifetime. No new abstraction, dependency or file
  ownership move was introduced.
- Developer verification stopped at approximately 9 minutes, with one test-harness
  repair (a disabled-attribute assertion initially matched utility class text).
  No browser qualification was performed by the developer. Coordinator Chrome
  evidence and independent review are recorded separately; user acceptance is
  pending. Deferred qualification remains closed.

Suggested commit: `feat: edit token layers in the inspector`

## Coordinator Chrome check — 19 November 2026

After the user launched external Chrome and authorized its use, native app control
connected successfully. The browser-tab provider itself was unavailable. A new
`Layer editing verification 021` project and `layer-sample` color token were created
for this check; the user's pre-existing project was not edited. The disposable
project remains in Chrome local storage for inspection.

Observed through live accessibility state and a wide-layout screenshot:

- Primitive creation; native Layer selection by keyboard to Semantic creates an
  unapplied draft while the Primitive list/count stays applied.
- Switching to Resolved & trace preserves the draft and exposes enabled shared
  Cancel/Apply actions. Cancel restores Primitive, disables the actions and returns
  actual focus to the visible Layer select without switching the tab.
- Applying Semantic from Resolved & trace succeeds, clears the draft and returns
  focus to Layer. The Primitive browse scope stays selected; the same token remains
  inspected with “Selected token is outside this list.” Navigation shows Semantic.
- Undo restores Primitive and the row; Redo restores Semantic and the outside-list
  state, with the same token selected and unchanged black color values.
- Wide native Chrome screenshot shows the select, explanation and radio controls
  fitting the inspector. Current browser zoom was 110%; no setting was changed.

No narrow-layout, reload, live conflict/fault injection, or exhaustive keyboard/
screen-reader check was performed. Those are not claimed by the controlled tests
or this smoke check. Browser work plus availability checks used approximately five
coordinator minutes, no harness repair. Developer allowance was reduced from17
to12 minutes to keep the aggregate ceiling unchanged; developer used9. Initial
review2 + developer9 + coordinator5 = approximately16/30 minutes before independent
review, with1/2 harness repairs used. Source was stable except the developer's
Cancel focus-timing refinement before the actual Cancel check; final browser
observations therefore cover that refinement.

Review snapshot: [R1 manifest](../../output/increment-021/review-r1-manifest.json)
identifies every changed production/test file including the new test, at base
`16d8f5b7e53fba79747f3db8e7636b1e3034fcb8`. The
[R1 diff](../../output/increment-021/review-r1.diff) captures tracked changes;
the new test is included by manifest hash and working-tree content.

## Independent review and completion — 19 November 2026

Reviewer verified all12 production/test hashes in R1 and found no actionable
findings. Its independent five-suite run passed93 tests: color revision, retained
history, layer markup, protocol validation and workbench coordination. Review
covered application/worker validation, omission versus explicit unset, exact value
preservation, no-op ordering, snapshot history, recovery and shared action/focus
ownership. Actual consumers/tree retained one editor hook owner, keys/ancestry and
command authority; no concrete naming/placement/dependency violation was found.

Review limitation: the first bounded document read inadvertently included the
appended developer completion section before source inspection. The reviewer
independently checked source and tests, but the review was not fully rationale-blind.
No reviewer browser repetition occurred; coordinator runtime evidence is separate.

| Criteria | Evidence |
| --- | --- |
| AC-1 | Layer markup/eligibility tests, native Chrome select and keyboard use. |
| AC-2 | Application/session/history tests; Chrome draft, Cancel and Apply. |
| AC-3 | Application rejection/preservation tests and independent boundary review. |
| AC-4 | Coordination/recovery tests; Chrome both-tab actions and actual visible focus. |
| AC-5 | Retained history tests and Chrome Undo/Redo. |
| AC-6 | Codec/backup/history/protocol and controlled failure tests; successful live retention/readback. Live reload and injected browser faults not repeated. |
| AC-7 | Chrome layer-filtered reclassification and stable selected inspector. |
| AC-8 | Independent owner/consumer/tree and source review. |

Implementation and independent review are complete, with no unresolved actionable
findings. User acceptance remains pending. Narrow layout, live reload/fault-recovery
and screen-reader checks remain unverified in this increment; no prior acceptance
or qualification limit is promoted to passed. The existing supported persistence
path has controlled-test evidence, not a renewed browser storage campaign.

Verification stopped at approximately **21/30 aggregate minutes**, **1/2 harness
repairs** (initial documents2, developer9, coordinator5, reviewer5). Final handoff
Markdown/link/diff review adds less than one minute; unused allowance is not a new
campaign. No staging, committing or pushing occurred.

For human review: select an editable color token, change Layer, and switch to
Resolved & trace. The draft and shared actions should remain available. Cancel
should restore the applied layer; Apply should update classification without
losing the inspector, and Undo should restore it. Judge the layout/interaction;
the tested correctness evidence above need not be repeated wholesale.

## Authorized follow-up checks — 19 November 2026

After committing and pushing implementation (`03f2c6b`), the user explicitly
authorized the remaining checks. This follow-up used a separate ceiling of15
minutes and one tooling repair; it does not reopen earlier qualification campaigns.

Observed in external Chrome using only `Layer editing verification 021`:

- Reload retained the applied Semantic layer and unchanged black color values.
  Undo/Redo reset with the session, as expected.
- At a320 ×800 emulated viewport, the inspector and shared Cancel/Apply actions
  fit horizontally. Keyboard navigation reached Layer, changed its draft to
  Primitive, switched to Resolved & trace and reached Cancel. Cancel restored
  Semantic and disabled both actions.
- Focus after that keyboard Cancel was inconclusive: accessibility state reported
  the document, and the next Tab reached About retention rather than a control
  adjacent to Layer. The normal desktop pointer Cancel path subsequently returned
  focus to Layer. A further desktop keyboard attempt did not reliably stage a
  draft and supplies no additional pass/fail evidence. The existing focus effect
  and controlled test do not resolve this live discrepancy; no speculative code
  change was made.
- Browser automation unexpectedly lost Chrome while adjusting emulation width.
  The single repair allowance was consumed reconnecting/reopening the app. The
  cause was not established as an application defect. Emulation dimensions were
  restored to900 ×800 and DevTools closed; browser zoom remained110%. The
  disposable token was left applied as Semantic with no draft.

The three focused suites for retained history, workbench coordination and layer
editing passed48 tests. These cover controlled failure/recovery and focus behavior;
they are not evidence of injected failures in a live browser.

Follow-up browser work stopped at the bounded allowance with the tooling repair
used. Narrow keyboard Cancel focus remains an unresolved observation requiring
reliable reproduction. Live storage/conflict fault injection and actual
screen-reader delivery remain unverified; accessibility-tree inspection is not
screen-reader testing. Implementation acceptance remains pending. Only evidence
documentation changed in this follow-up; no staging, committing or pushing occurred.

## Narrow keyboard verification — 19 November 2026

The user authorized a further check with a strict five-minute maximum, at committed
baseline `f694de8`. In external Chrome at320 ×800, using the same disposable token
on Resolved & trace, changing Layer from Semantic to Primitive enabled the shared
actions. Five Tab presses from Layer reached Cancel. Return restored Semantic,
disabled both actions and returned actual accessibility focus to Layer. The next
Tab focused Resolved & trace, confirming the restored tab order. This focused
scenario passed; the earlier inconclusive observation did not reproduce. It does
not establish the cause of that earlier observation.

The first accessibility-index click missed the scaled select; a screenshot-based
click reached it without a tooling repair. No application code changed. Emulation
was restored to900 ×800 and DevTools closed, leaving Semantic applied with no
draft. The check and evidence update completed within five minutes. Live fault
injection and screen-reader delivery remain outside this check.
