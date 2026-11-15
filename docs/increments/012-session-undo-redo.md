# Increment 012: Session Undo/Redo

- Contract status: **Draft — initial proposal, 15 November 2026**
- Delivery status: Not started
- Agreement: Initial scope below was agreed during 011; this contract, history policies, design and implementation are **not agreed or authorized**.
- Planning authority: prepare contract/design only. No application qualification restart.
- References: [011 initial scope](011-responsive-shell.md#requested-undoredo-controls--15-november-2026), [workflow](../workflow/agent-roles.md), [architecture](../project/architecture.md), [principles](../project/principles.md), [project operations](../project/project-operations.md), [open questions](../planning/open-questions.md), [presentation conventions](../project/presentation-conventions.md), [current ownership](../project/workbench-component-organisation.md), [accepted visual direction](../project/visual-direction.md), [V2 shell](../project/workbench-layout/workbench-shell-v2.md).

## Outcome

Within an open project, reverse and reapply acknowledged token/group changes without
retyping authored data or overwriting a later retained revision. Undo/Redo belongs
in the Workbench header. Project management remains on Projects.

## Scope and authority

**User-agreed initial scope:** applied token/group changes in the current
open-project session; native text inputs keep their normal typing undo; no durable
history across project close/reopen/reload. Preserve the delivered owner-first UI
structure and desktop-first shell down to 320 CSS px.

**Proposed included coverage:** all four currently exposed token/group commands in
the capability table below; one acknowledged command per history step, safe
retained Undo/Redo, recovery, revision fencing, controlled header state and scoped
keyboard routing. These are proposals for agreement, not delivered capabilities.

Excluded: durable history/journals; undoing project create/restore/delete or backup;
new general Delete, token rename/move, group move, token Details/metadata editing;
external Import/Export; new token types or conditional editing; history browser or
branching/merge; canonical persistence/schema, backup envelope and DTCG changes;
new dependencies or broad host/browser qualification. Creation metadata already
submitted by existing forms is preserved by reversal, without adding edit fields.

## Current capability and reversal inventory

Source baseline: `6aa6943`, inspected 15 November 2026. This table records actual
commands; the reversal behavior is proposed.

| Exposed operation | Existing behavior/source | Required Undo and Redo |
| --- | --- | --- |
| `createGroup` | Creates a stable-ID group at the selected parent, through `useCreationForm` and application authoring. | Undo removes exactly this creation after later dependent steps have been undone; Redo restores the same ID, parent, name and authored fields. No new public Delete capability is implied. |
| `renameGroup` | Changes local name with identity/reference preservation and namespace checks. | Restore prior/next authored local name; preserve descendant IDs, containment and authored aliases while deriving paths again. |
| `createColorToken` | Creates a stable-ID unconditional black sRGB token; form can submit description and primitive/semantic layer. | Remove/reinstate that token with the same identity and complete authored metadata/value; never call Create again with a new UUID. |
| `reviseColorToken` | Explicit Apply replaces an eligible unconditional color literal or reference; existing editor also proposes literal space conversions. | Restore/reapply exact authored value, including space, component/alpha strings or reference identity. Preserve token identity and all other authored fields. |

Sources: [`AuthoringCommand`](../../src/application/retention/ports.ts),
[authoring operations](../../src/application/authoring.ts),
[creation/rename form](../../src/presentation/Workbench/components/CreationDialog/hooks/useCreationForm.ts),
[Workbench Apply and guards](../../src/presentation/Workbench/Workbench.tsx),
[token editor](../../src/presentation/Workbench/components/WorkbenchInspector/components/TokenEditor/hooks/useTokenEditor.ts).
There is no existing inverse/delete/history command. Omitting creation Undo because
that API is absent would fail the proposed coverage; a narrow reversal operation
must supply it. There is no currently exposed token-name or Details editor to
promise Undo coverage for.

## Proposed history semantics

All policies in this section need agreement.

1. A step is one successful explicit Create, Rename or Apply that changes authored
   data. Typing, slider movement, draft tabs, preview/display conversion, selection,
   query, resize, Cancel and failed/rejected/no-op commands do not create steps.
   Several field changes accepted by one Apply remain one atomic step. Equality
   uses exact authored data, not resolved color or display equivalence. A no-op
   must leave the redo branch intact even if the current implementation would
   otherwise acknowledge an equivalent write; implementation must define its
   no-op result/revision handling explicitly.
2. Undo traverses newest-first; Redo reapplies oldest-undone-first. A new acknowledged
   changing command after Undo discards the redo branch. Failed, unknown or pending
   work does not prematurely discard it. Undo/Redo are not recorded as new user
   steps. Each accepted reversal writes a **new** retained revision; old revision
   IDs are never restored.
3. History transitions occur only on proven retained acknowledgment, once per
   command receipt. Pending/unknown outcomes freeze traversal and preserve the
   tentative transition. A rejected write leaves cursor/entries unchanged. A
   later retained reconciliation finalizes that same transition exactly once.
   Retained-but-unreadable finalizes acceptance but keeps all history commands
   blocked until coherent current readback; Retry reading never repeats the write.
4. Dirty token drafts or unfinished dirty forms use the existing departure-guard
   pattern: Keep editing cancels history intent; explicit Discard and continue
   discards the session input before executing the captured Undo/Redo intention.
   Revalidate availability/revision after the guard. Do not silently Apply, cancel
   drafts, retarget missing identities or call draft Cancel as Undo. Modal forms
   retain keyboard ownership; close them through existing protected actions
   before history traversal. Designer must make this interaction explicit.
5. Read-only ownership, lifecycle suspension, active mutation, unknown outcome,
   retained readback failure and outstanding read block history writes through the
   same command authority as ordinary edits. Suspension alone need not erase
   history: retain it only if reacquisition proves the identical project,
   incarnation and expected revision. Changed/outside-session retained revision,
   same-ID restore replacement or incarnation change clears both branches with a
   visible explanation; no blind overwrite or automatic rebase. Reacquiring write
   access alone cannot make stale history valid.
6. Successful departure to Projects/project close, project switch, reload or worker
   replacement/fencing clears session history. Worker-loss recovery may establish
   whether the original write was retained, but does not reconstruct history from
   storage or a receipt whose `before` is unavailable. The retained project remains;
   no history-based warning is needed merely because valid history will expire.
7. Proposed bound: at most **50 changing steps and 32 MiB of UTF-8 serialized
   authored snapshot payloads** retained by session history, including both
   branches; count shared states once. Evict oldest steps first and explain the
   oldest available point. If one step alone exceeds the byte bound, preserve the
   acknowledged edit, clear prior history and explain that this change cannot be
   undone in this session. Resource accounting and this trade-off require user
   agreement; the bound does not promise maximum-source performance or qualify
   defensive admission ceilings.

## Architecture proposal and unresolved mechanism

Existing [retention service](../../src/application/retention/service.ts) prepares a
detached candidate, admits it, then commits through an explicit
[`RetentionPort`](../../src/application/retention/ports.ts) with revision/incarnation
checks and ownership. Accepted results already contain internal `before`/`after`
[`ProjectSnapshot`](../../src/application/project-storage.ts) values.
The [worker runtime](../../src/presentation/host/worker-runtime.ts) removes those
values from the public response; the [protocol](../../src/presentation/host/protocol.ts)
exposes only acknowledgment/projections. The
[worker client](../../src/presentation/host/worker-client.ts) tracks issued write
identities, terminates/fences issuers and does not replay lost writes.
[`useProjectCommands`](../../src/presentation/Workbench/hooks/useProjectCommands.ts)
owns the existing renderer acceptance/recovery gate; it must remain the sole
command owner rather than adding a second header mutation path.

| Approach | Evidence and trade-off |
| --- | --- |
| Bounded before/after authored snapshots | Existing acceptance payload already supplies exact data and current port writes a whole record atomically. Covers creations and metadata without inventing public Delete or alias reconstruction. Memory cost needs an explicit bound; replacement must be a revision-checked application operation, never renderer snapshot assignment or backup restore. |
| Operation-specific inverse data | Could store smaller affected entities/names/values, but four forward commands have no inverse/remove API. Creation removal needs dependency checks; group path/alias effects, exact metadata and every candidate invariant must still be preserved. More operation-specific code and proof obligations; no source evidence currently establishes a memory/performance need for that complexity. |

**Recommendation, not selection:** bounded snapshots owned by a host-independent
application history coordinator inside the existing worker lifetime. Keep history
semantics plain-data/application-level and persistence/locks behind the existing
explicit port. Workbench owns delivery session coordination, dirty-input guards,
selection/focus and controlled history requests; header renders state/actions only.
Publish bounded history availability/action labels rather than project snapshots.
Use narrow typed, runtime-validated history operations and extend mutation-identity,
receipt, consume/check/fence handling for Undo/Redo; do not route arbitrary snapshot
payloads from the renderer or bypass current gates. No generic command bus,
registry, second writer or durable journal is needed.

Before implementation, agree snapshot versus inverse mechanism, the bound and
oversize policy, plus the precise history operation/result contract. Implementation
must show a fresh revision/receipt path, atomic failure, and no history loss when
commit fails. The retained `lastAcceptedCommand.operation` uses a closed operation
vocabulary in the [ports](../../src/application/retention/ports.ts),
[record decoder](../../src/application/retention/record.ts) and
[host validation](../../src/presentation/host/validation.ts). New Undo/Redo receipts
therefore require an explicit decoder and old/new application compatibility policy;
do not silently reuse `restoreProject` receipts. Prefer no authored-format or
backup-envelope change and no persisted history payload, but whether internal
record versioning is necessary remains an agreement question.

A restored candidate preserves stable identities, explicit value types, exact
metadata and authored aliases. Validate membership, namespace/collisions,
references and retained-envelope admission before any write. Existing authoring
rejects whole invalid candidates, while supported retained snapshots may contain
inspect-only diagnostics. History may restore a previously admitted inspect-only
baseline (for example Undo of a permitted group creation); it must not become a
way to author arbitrary invalid candidates or silently repair source. Define this
narrow baseline-restoration validation separately from new-edit validation and
preserve existing progressive-repair limits. Current revision equality is required
even when replacing a complete snapshot, protecting all data outside the history.

## Acceptance criteria — proposed

- **AC-1 Coverage:** Each of the four operation kinds above supports one exact Undo
  and Redo in a session, including create/remove/reinstate and group descendant
  paths. No extra field-edit UI or general Delete appears.
- **AC-2 Authored integrity:** Undo/Redo preserves the same IDs, membership,
  metadata and authored literal/reference representation, not merely equal rendered
  colors. Admission and revision/identity protections remain effective. Replay
  cannot introduce arbitrary invalid data, collisions or dangling references.
  Exact restoration of diagnostics already present in a known admitted target
  baseline is allowed only if the diagnostic-baseline policy above is agreed;
  its narrow history validation must distinguish that restoration from a new edit.
- **AC-3 Granularity and branch:** One changing acknowledged command produces one
  step. Two Applies undo separately; one multi-field Apply undoes together.
  Draft/Cancel/navigation/rejected/no-op actions leave history unchanged. A new
  changing acknowledged action after Undo alone invalidates Redo.
- **AC-4 Atomic failure:** Rejected Undo/Redo leaves retained authored data, cursor,
  entries and available retry intact. No partial removal or consumed history step.
- **AC-5 Acknowledgment/recovery:** Pending/unknown operations do not advance or
  destroy history. Proven retained results finalize once, including check recovery;
  repeated check/consume/readback cannot duplicate a step. Retained-but-unreadable
  blocks traversal; read retry repeats no write.
- **AC-6 Single command owner:** Header and keyboard reach the same guarded command
  path as edits, with at most one dispatched mutation. Repeated clicks/key repeats,
  mixed Apply/Undo and stale completion callbacks cannot produce a second write.
- **AC-7 Draft/form protection:** Dirty invalid input survives Keep editing and
  cancelled history intent exactly. Discard and continue is explicit, rechecks the
  current baseline and never applies the discarded input. Modal inputs retain
  their own typing behavior.
- **AC-8 Revision and ownership:** Read-only, suspended, unavailable and unknown
  states cannot write through Undo/Redo. External revision/restore/incarnation
  changes invalidate history visibly. Data added outside this session is never
  overwritten; same-ID open alone cannot authorize old history.
- **AC-9 Lifecycle:** Close/reopen, switch, reload and worker replacement start
  empty history without discarding acknowledged project state. Unchanged-baseline
  resume may retain history; uncertain interrupted outcomes retain existing safety.
- **AC-10 Selection and focus:** If Undo removes the selected token/group or active
  group scope, clear the missing selection and fall back to a valid browse scope;
  no stale editor remains editable. Propose Redo restores data without stealing
  selection/focus. Existing selection on a surviving entity remains by ID and clean
  inspection refreshes coherently. Focus stays on the invoking history control
  when possible; an unavailable/removed focus target has a predictable visible
  fallback. Exact behavior needs designer confirmation before agreement.
- **AC-11 Header/accessibility:** Undo/Redo are reachable with names and availability
  reasons at wide/compact/320 CSS px, in browse and inspect. Empty/pending/failed/
  read-only/expired states are understandable without color alone; feedback stays
  outside hidden panes. Project-management controls remain on Projects.
- **AC-12 Keyboard:** Proposed Cmd/Ctrl+Z Undo and Cmd/Ctrl+Shift+Z Redo operate only
  within eligible Workbench non-editable focus. Inputs, textareas, contenteditable,
  dialogs, composition and already-handled events retain native/local behavior;
  no interception of disabled commands or browser shortcuts elsewhere. Ctrl+Y is
  an explicit design choice, not an implicit promise.
- **AC-13 Bound:** History remains within the agreed count/byte bound, evicts only
  the oldest available steps and explains truncation/oversize without failing or
  misrepresenting an acknowledged edit. Representative ordinary projects remain
  usable; admission maxima do not imply an interactive guarantee.

## Decisions and open questions

**Established:** initial session-only scope, native input undo, Workbench-header
placement, Projects management boundary, existing presentation/command/editor
ownership, exact authored preservation and current concurrency protections.

**Resolve with user before implementation:**

1. Approve coverage of all four operations and atomic command/no-op policy.
2. Approve dirty-input Discard/Keep editing history flow and modal/shortcut policy.
3. Approve conservative revision invalidation rather than rebasing or merging.
4. Select bounded snapshots versus inverses; approve 50-step/32 MiB and oversize
   history-clearing trade-off, or revise them explicitly.
5. Explicitly agree whether history may restore a known admitted baseline with
   existing diagnostics, using narrow baseline-restoration validation, or must
   reject that Undo while preserving current data and history. This choice must
   not silently weaken new-edit validation or treat Undo as backup restore.
6. Agree Undo/Redo receipt vocabulary, record-decoder behavior and old/new
   application compatibility, including whether internal record versioning is
   needed. Keep authored-format/backup changes and persisted history outside
   scope; surface any incompatibility before implementation.
7. Agree identified designer proposal, selection/focus behavior and final contract;
   authorize implementation separately after analyst design review.

**Deferred:** durable recovery/history across restart, history inspection/branching,
undo of project management, new editing capabilities, broader engine/stress checks.

## Verification approach and stopping

Planning only: source inventory and Markdown/link review; no app tests, build,
browser/native harness or qualification. Source facts are evidence of current
capabilities, not proof that proposed Undo/Redo works.

For later authorized implementation, establish a shared bounded verification plan
before checking. Essential behavior/integrity checks: targeted application/port
cases for AC-1–9/13 (exact values/IDs, creation dependencies, no-op/branch, atomic
failure, unknown/retained-unreadable, duplicate completion, revision/incarnation and
ownership conflicts), plus representative Chrome header/keyboard/draft/focus and
320/wide observations for AC-7/10–12. Use synthetic disposable data and existing
working test boundaries. Representative performance covers an ordinary authoring
session, including bound eviction; no admission-maximum campaign. Optional future
qualification includes huge sources, stress/crash matrices, broader engines,
platform shortcut variants and full accessibility certification. Missing essential
acceptance remains unverified, not automatically optional.

Planning allowance: **15 aggregate minutes** (analyst <=6, designer <=5,
coordinator <=4), source/static/prose/link checks only. Analyst source/draft checks
used approximately **5.5 minutes**, designer **4.5 minutes**, and coordinator
**3 minutes**: approximately **13/15 aggregate minutes**, zero harness repairs.
Source/static checks are stopped after this handoff. Coordinator owns accounting. Ordinary authoring is
separate from verification time. Earlier 011 approximately 46/60 minutes with 2/2
repairs and amendment approximately 13/20 with zero repairs, plus prior campaigns,
remain stopped; this planning allowance resets none of them. Stop at the planning
ceiling or earlier if value is low; further automated application qualification
requires explicitly authorized bounded follow-up.

## Design proposals and review

Designer required for the header, guarded history flow, shortcuts, selection/focus
and responsive states. **Initial contract is design input only.** Preserve accepted
Precision styling, sole Heroicons/owned primitives and delivered layout/owner tree.
First return independent assessment and recommended direction/options to the user;
wait for direction approval before editing an interactive prototype. Cover empty,
Undo/Redo available, dirty draft, pending/unknown, retained unreadable, read-only,
external-change invalidation, failed reversal and truncated history at 320/wide.

- Proposal/artifact identity: [Session Undo/Redo V1](../project/workbench-layout/undo-redo-v1.md),
  [responsive header sheet](../project/workbench-layout/undo-redo-v1.svg),
  [state sheet](../project/workbench-layout/undo-redo-states-v1.svg) and
  [component ownership delta](../project/workbench-layout/undo-redo-component-map-v1.md),
  prepared by a separate designer on 15 November 2026. Both SVG sheets were rendered
  and visually inspected as static artifacts; this proves no runtime behavior.
- User approval for analyst review: pending.
- Analyst review of new design: **not performed**; only after approval of an
  identified proposal. This initial source-grounded contract is not that review.
- Material design revisions: return to user before renewed analyst review.
- Final contract/design agreement and implementation authorization: pending.

## Review baseline

Planning source baseline `6aa6943`; coordinator records actual working-tree changes
and 011 closure separately. Known physical `Workbench/` versus indexed lowercase
`workbench/` casing discrepancy is outside this increment and does not block
planning. No index/staging fix is authorized by this contract. No application
snapshot exists for independent implementation review yet.

## Agreed amendments

None. Initial scope agreement does not approve the proposed policies above.

## Initial planning handoff — 15 November 2026

011 is closed with its original acceptance gaps preserved. The separate analyst
inventoried operations and drafted this contract; the separate designer produced
V1. Coordinator checked source/proposal consistency, static sheet rendering,
Markdown links and diff hygiene. No application code, tests, build, browser
qualification or interactive prototype changed. V1 is ready for user feedback;
new-design analyst review has not started. All proposed policies and the mechanism
remain unagreed.

Suggested commit: `docs: close increment 011 and propose session undo redo`
