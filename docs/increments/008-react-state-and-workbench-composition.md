# Increment 008: React state and workbench composition

- Contract status: Agreed
- Delivery status: Completed
- Prepared: 12 November 2026
- Completed: 12 November 2026, following user-reported Chrome manual acceptance
- Agreement: the user agreed this contract and authorized implementation on 12 November 2026, using the developer and independent reviewer workflow within the shared verification budget. Staging, committing and pushing remain with the user.
- References: [vision](../project/vision.md), [product concept](../project/product-concept.md),
  [principles](../project/principles.md), [architecture](../project/architecture.md),
  [presentation conventions](../project/presentation-conventions.md),
  [open questions](../planning/open-questions.md), [agent workflow](../workflow/agent-roles.md).

## Outcome

Make existing React coordination easier to reason about and change while preserving
observable authoring, retained-state recovery and presentation behavior. This is a
maintenance increment supporting the delivered token workbench, not a new workflow.

## Scope

Included: selective state transitions, focused renderer hooks and decomposition of
`src/presentation/app/Workbench.tsx` into concrete composition boundaries. Inspect
`App.tsx`, `Editor.tsx` and `RestoreDialog.tsx` for the same ownership problems.
Extract their existing workflow logic into focused hooks; do not redesign those
workflows. Existing pure draft helpers remain authoritative.

Excluded: dependencies, global/context stores, routing, canonical model, application
operations, worker protocol, storage/backup formats, compatibility adapters, history,
new capabilities, visual redesign, CSS cleanup and systematic conversion of every
`useState`. Do not reopen Increment 007 qualification or its deferred register.

## Source assessment and proposed ownership

Baseline `71f274b` has a 1,385-line Workbench. Its length comes from both coordination
and substantial JSX: moving all its logic into one replacement hook would leave the
composition problem unresolved. The proposal splits demonstrated responsibilities;
line count is evidence of mixed ownership, not a target or acceptance measure.

| Current source responsibility | Proposed owner and boundary |
| --- | --- |
| Workbench `refresh`/`inspect`, header/context/rows/selection generations | One `useProjectReadback` instance per open project owns coherent applied projections, read progress/failure and generation refs. Explicit selection intent comes from Workbench; no child performs an independent project refresh. |
| Workbench `accept`/`check`/`retryReading`, unknown/retainedPending/completion | One `useProjectCommands` instance owns command outcome/reconciliation and completion consumption. It receives current revision/readback operations explicitly; components call intent callbacks, never issue competing authoring commands. |
| Workbench creation/rename fields, baseline/review and `create` | `useCreationForm` owns one form session, coupled fields and deliberate baseline-review transitions. It produces the existing command through the single command owner; completion intent coordinates selection/focus in Workbench. |
| Editor literal/reference session, baseline refs, recovery review and accepting | `useTokenEditor` owns one draft session within a keyed editable-token inspector. It consolidates coupled draft/baseline transitions using pure `state/session.ts` helpers. The inspector header and fields consume derived previews from that same instance; remove the child-to-parent preview-feedback mirror. Tab/simple UI state can stay local. No second draft copy in Workbench. |
| Workbench selection/filter/departure and `editorVersion` | Workbench retains composition intent, guarded navigation and explicit editor reset policy. Dirty flags are reports from the existing editor/form owners, not replacement draft data. |
| Workbench media effect and pane toggles | A small `useWorkbenchLayout` may isolate the media listener; booleans stay simple local state. It has no host, command or draft authority. |
| App catalogue/project creation/host lifecycle | `useProjects` extracts catalogue/create/open coordination; an effect-backed `useWorkbenchHost` isolates the single host lifetime. App composes them. Separate hook calls never share state; keep catalogue and open-project command ownership distinct. |
| RestoreDialog replacement/protection/acknowledgement | `useBackupRestore` owns one active restore session and a selective reducer for protection/acknowledgement/outcome transitions. Keep the existing dialog view and entry points. Its host operations are not folded into the authoring command hook. |

Reducer boundaries are proposed for coupled command states (idle/issuing/unknown/
retained-readback-pending), form fields plus baseline/review, and editor draft plus
baseline/review, and restore protection/outcome transitions where this removes
distributed transitions. Reducers are pure and do
not call the host, mutate refs, generate IDs or perform focus effects. Keep simple
`useState` where no invariant benefits from a reducer. Exact hook/action names are
implementation details; responsibility boundaries and behavior are the contract.

Effects and async actions remain with their state owner. Workbench composes these
owners explicitly; hooks must not import one another into a hidden orchestration
chain or return a whole-screen state/setter bag. Pass small typed data and semantic
callbacks to the component that needs them; use children/slots for already-composed
content rather than duplicating policy in rendering components.

## Concrete component extraction

All proposed components live under `features/workbench/components/`, alongside the
existing feature components. Preserve markup/classes during extraction.

| Existing JSX section in Workbench | Proposed composition |
| --- | --- |
| Topbar, hidden backup input and backup/Projects actions | `WorkbenchHeader`: render project title/actions; file ref stays with the backup-stage owner and is passed explicitly. File staging/download callbacks stay outside rendering. |
| Main `#tokens`: heading/search/list/selection-outside-list | `TokenBrowser`: compose existing `ProjectedTokenList` and `AllContent`; receive filtered rows/context, query/group label, selection and semantic callbacks. Accept recovery/feedback slots instead of owning commands. Preserve the main element and its forwarded focus ref. |
| Project diagnostics details/summary | `ProjectDiagnostics`: isolate disclosure/display; revision-scoped lazy loading remains with readback ownership. Keep incomplete diagnostics wording and existing All content action. |
| Inspector section/header/specimens and selected token/group/empty body | `WorkbenchInspector`: reuse `Editor`, `ExactSource` and existing authored-value presentation. Compose the keyed editable-token inspector with one `useTokenEditor` instance shared by its header and fields; retain group/empty/inspection-only branches. Keep the same draft lifetime and reset key policy. |
| Recovery status branches and departure guard | `RetentionRecovery` renders command status/actions. `DepartureGuard` owns existing dialog markup only; pending intent and draft-discard authority remain in Workbench. Reuse the same recovery rendering inside the creation dialog. |
| Compact navigation Dialog plus desktop sidebar | Retain layout composition in Workbench initially and reuse `ProjectNavigation` for both. Extract a drawer shell only if it simplifies this exact markup without moving navigation/dirty policy. |
| CreationDialog and RestoreDialog assembly; footer | Keep existing components and small footer directly composed. No generic modal host, replacement form/dialog primitives or trivial-wrapper proliferation. |

Splitting JSX and state is a coordinated migration: components do not gain host or
storage authority. Existing `Button`, `Input`, `DialogContent`, `Icon`, fields,
tabs, lists and swatches remain reused. No icon/theme/class-composition migration.

## Acceptance criteria

- **AC-1 — Ownership:** source inspection shows focused owners above and a Workbench
  that visibly composes named sections. No giant replacement controller hook,
  duplicated draft/applied state, omnibus prop object, context store, dependency or
  domain/application/worker behavior change is introduced.
- **AC-2 — Draft fidelity:** incomplete/invalid raw channel and alpha text, byte text
  and edit flags, literal/reference sessions, reference identity, view/scale choices
  and dirty state survive mode/view changes and failed commands as before. Cancel,
  Apply and confirmed departure reset only their established scopes. Preview and
  normalization never overwrite authored/raw input implicitly.
- **AC-3 — Baselines:** coherent retained refresh preserves dirty editor/form input;
  changed applied baselines require existing explicit review before reapply. Clean
  sessions follow applied data. Missing original token/group/parent blocks mutation
  without automatic recreation or retargeting. Rename/create field semantics and
  exact accepted names/descriptions remain unchanged.
- **AC-4 — Command outcomes:** duplicate submissions remain blocked. Rejection,
  unknown outcome, retained-with-unavailable-readback and successful retention stay
  distinct. Check reconciles the original attempt; retry reading never repeats a
  write. A completion action is consumed at most once after coherent readback;
  no automatic replay, optimistic acceptance or rollback claim is introduced.
- **AC-5 — Async coherence:** project/selection generation fences and teardown
  invalidate superseded reads. Revision/context/selected applied inspection publish
  coherently; stale rows, diagnostics, source or inspection responses cannot be
  attached to a different current project/revision/selection. Existing bounded row
  batches and read/write/lifecycle blocking remain effective. Cover touched paths;
  this is not renewed maximum-resource or exceptional-lifecycle qualification.
- **AC-6 — Restore boundary:** reuse staged RestoreDialog and preserve same-ID
  replacement protection for the current revision, acknowledgement invalidation,
  unknown-result protection and no replay. Same-project open refreshes applied data
  while preserving drafts/baseline review; opening a different project follows the
  departure guard. Backup downloads exclude drafts and retain existing messages.
- **AC-7 — Presentation parity:** retain semantic DOM order, IDs/labels/live regions,
  classes, hidden-versus-unmounted behavior, breakpoint/pane behavior and skip link.
  Keyboard navigation, dialog containment/return, form-error focus, editor focus
  after Apply/Cancel, selected-token reveal and compact drawer behavior remain
  observable. Preserve Base UI composition and callbacks; no visual redesign.

## Migration plan

Implementation starts only after agreement and authorization. One developer writes
at a time; each slice leaves a coherent application. Checkpoints use the same
cumulative verification allowance, not a full repeated test/build campaign.

1. **Map transitions before moving them.** Record current command, draft, form,
   selection and reset owners in the implementation evidence; add narrowly meaningful
   characterization cases using the existing Vitest setup and controlled host replies.
   Prioritize AC-3–5: delayed readback, stale selection and one completion/no replay.
2. **Extract readback and command coordination.** Move existing async behavior with
   its refs/guards intact, then consolidate coupled transitions with a reducer where
   useful. Keep one explicit command owner per open project. Check AC-4–5 before
   moving creation/editor ownership; do not redesign the protocol to simplify hooks.
   Extract App host/catalogue coordination without changing host lifetime or the
   project-ID workbench key.
3. **Consolidate form/editor sessions selectively.** Preserve raw helpers, baseline
   comparison and review semantics. Extract `useTokenEditor` once into the keyed
   editable inspector and derive header previews there. Extract `useBackupRestore`
   within each existing active restore entry, preserving protection invalidation.
   Retain stable callbacks where effects depend on them. Check AC-2–3,6 and keep
   dirty reporting free of callback-driven effect loops.
4. **Extract concrete JSX sections.** Move header, token browser/diagnostics,
   inspector, recovery and departure rendering without extra DOM wrappers. Keep
   creation/restore composition and pane layout explicit. Check AC-1,6–7, especially
   focus refs and dialog nesting after each relevant move.
5. **Freeze and review.** Identify base plus exact diff/new files; independent
   reviewer derives expectations from this contract. Resolve findings with targeted
   checks, append completion evidence and update the status handoff. Staging,
   committing and pushing remain with the user.

Main migration risks are remounts and stale closures, not component size. Define
extracted components at module scope. Preserve App's project-ID Workbench key,
Editor's `[selection.id, editorVersion]` key, revision-keyed AllContent/ExactSource
resets, and intentional mounts. Do not key Editor by revision or expansion; that
would discard preserved input. Do not replace hidden panes with conditional mounts.
Keep departure guard nested within CreationDialog when a form is open and retain
its finalFocus routing to the form input or token panel. Effects must not reissue
writes because a callback identity changed; asynchronous completion must operate
on its captured intended target rather than whichever selection renders later.

## Decisions and design review

- Established: accepted Precision interface, presentation conventions, local draft
  versus retained applied boundary, and existing application/host ownership.
- Proposed: focused owners and composition above; no new product/schema decision.
- Agreement and implementation authorization: granted by the user on 12 November 2026.
  No additional product question identified in analysis.
- Designer: not required for behavior-preserving structural maintenance. No new
  design artifact or interaction is proposed. Material interaction/visual departures
  must return to the user and follow the normal designer/analyst sequence.
- Analyst preparation is not independent implementation review or user agreement.

## Verification approach and limits

Planning is documentation-only: source/prose/link/diff review; no application tests,
builds, browser sessions or new harnesses. Planning review has a separate 10 aggregate
minute ceiling, zero harness repairs; coordinator records total consumed time at
handoff. Planning source/prose/link review consumed approximately 7–9 aggregate
minutes (analyst 4–5, coordinator 3–4; estimates), with zero harness repairs.
No implementation criterion is marked verified by this draft.

For future authorized implementation: one shared ceiling of **30 aggregate minutes
and two harness-repair cycles**, including developer/reviewer inspection, diagnostics,
waits and reruns. This is proportionate maintenance verification, not comprehensive
requalification of inherited persistence. Consumption starts only with that work;
carry estimates forward across agents/snapshots. Increment 007's allowance remains zero.

- Essential functional/integrity: focused existing `session`, `worker-client`,
  `retention-protocol` tests and affected rendering tests, plus meaningful new
  reducer/coordination cases for touched races and completion behavior (AC-2–6).
  Controlled host promises should demonstrate ordering without a new test framework.
- Run `npm run build` once for all four existing typechecks and production bundling;
  do not separately duplicate its typecheck gate without cause. No full-suite mandate.
- Small representative Chrome smoke, as feasible: edit/toggle/cancel/apply; preserve
  dirty input across a coherent refresh; creation/departure guard focus; compact
  drawer/pane collapse; existing restore entry and baseline protection (AC-3,6–7).
  Inspect implementation plus focused tests for other outcome branches; no exhaustive
  browser matrix or storage-fault campaign. Record unobserved paths honestly.
- Representative performance: preserve bounded batching/render strategy and ordinary
  responsiveness in this smoke. No new throughput, maximum-load or benchmark claim.
- Excluded qualification: old 007 deferred checks, additional engines, deployed
  HTTPS/CSP, exceptional lifecycle/storage failures, dedicated AT audit and stress.
- Stop at either ceiling or earlier if tooling dominates/value is low. After failure,
  assess attribution and cheapest useful recheck; rerun only affected checks. Unmet
  criteria remain failed/unverified. No automatic budget reset/extension; a bounded
  follow-up requires explicit authorization. Continue unaffected authorized work.

## Review baseline and amendments

Planning baseline: `71f274b` (`perf: precompile cn merge tables at build time`), clean
working tree before preparation. Source review only; no production changes. Before
implementation, verify Git again and preserve any intervening user work. Before
independent review, record the exact stable snapshot including new files.

Implementation baseline: `9ce3622`, clean working tree before recording user agreement.
The approved verification ceiling remains 30 aggregate minutes and two harness-repair
cycles. Developer allocation: at most 18 minutes; reserve at least 10 minutes for
independent review and 2 minutes for coordinator verification/handoff. These are
allocations within one ceiling, not separate allowances.

Agreed amendments: none.

## Completion report — 12 November 2026

At the initial implementation handoff, acceptance was explicitly incomplete.
The [closure record](#manual-acceptance-and-closure--12-november-2026) below supersedes
that delivery status; the original evidence and limits remain recorded here.
The source/test snapshot is base `9ce3622` plus the
[20-file manifest](../../output/increment-008-implementation/snapshot.sha256).
No staging, commit or push was performed.

Focused owners and named views are implemented; Workbench is now 770 lines versus
1,385 at baseline. This is a composition result, not a line-count acceptance target.
The editable inspector owns one session shared by header and fields. Pure reducers
cover coupled command, creation and restore transitions; independent state remains
local. Readback now fences lazy diagnostics by generation/revision. No dependencies,
domain/application/protocol/storage formats or visual redesign were introduced.

- [Developer evidence](../../output/increment-008-implementation/developer.md):
  32 focused tests / five files passed; final build passed all four typechecks and
  production bundling. Initial extraction/type errors were corrected and affected
  checks rerun. Controlled hook tests do not prove real React lifecycle behavior.
- [Independent source review](../../output/increment-008-implementation/reviewer.md):
  frozen manifest validated, relevant source inspected, no required corrective
  findings. Source supports AC-1 and structural AC-2–7 preservation. Reviewer browser
  access stalled; no independent runtime acceptance or blanket approval is claimed.
- [Coordinator Chrome smoke](../../output/increment-008-implementation/coordinator-smoke.md):
  project/token creation, raw draft mode/collapse preservation, validation,
  departure cancellation, successful canonical Apply, Cancel reset/focus and compact
  drawer open/Escape close observed.

### Acceptance gaps and stopping

At the initial handoff, AC-7 remained incomplete: successful Apply left focus on
document body in the smoke. The immediate focus call also existed at baseline;
attribution was then unresolved and no fix or pass was claimed. Cancel focus passed.
Visual comparison, comprehensive focus containment/return and real delayed
refresh/restore browser paths were then unobserved;
AC-2–6 have bounded source/controlled-test evidence, not exhaustive runtime proof.
No new regression was confirmed by independent source review.

Shared verification consumption is approximately **28.5–29.5 aggregate minutes**:
developer 7, independent reviewer 14.5 (including an 8.5-minute stalled native Chrome
call), coordinator 7–8, with **one conservative tooling-recovery cycle**. Verification
stops here because tooling consumed disproportionate value and the ceiling is near.
No automatic follow-up or budget reset is scheduled. Any further qualification needs
an explicitly authorized bounded follow-up. Increment 007 remains closed and deferred.

Suggested commit: `refactor: separate workbench state owners and composition`.

## Apply focus follow-up — 12 November 2026

The user explicitly authorized investigation, correction and independent recheck of
successful Apply focus. Baseline: `7b13b69`, clean working tree. Scope is the AC-7
Apply focus observation only; all other acceptance limits remain as recorded above.
No Increment 007 qualification is authorized. Staging, committing and pushing remain
with the user.

Separate bounded follow-up ceiling: **10 aggregate verification minutes and one
harness-repair cycle**, including source diagnosis, browser/tool waits and independent
recheck. Allocate at most six minutes to developer verification, three to reviewer
and one to coordinator. Reuse the installed Playwright CLI/local Chrome session where
available; do not repeat native-app launch tooling that stalled. Focused regression
and type/build checks only as justified; no full-suite or broader qualification.
Status: fixed and independently rechecked. Carry consumption forward; no automatic
extension/reset.

### Follow-up result

The immediate successful-Apply focus call ran while the Literal color control still
inherited disabled from its fieldset; React had not yet committed the queued enabling
update. A temporary native focus trace demonstrated this cause. Successful Apply
now requests one-shot local focus; an effect consumes it after the enabled editor
commits. Failure paths do not request this action; Cancel/error focus is unchanged.

- [Developer evidence](../../output/increment-008-implementation/apply-focus-developer.md):
  the real Chrome regression failed before and passed after; 16 focused tests passed.
- [Independent recheck](../../output/increment-008-implementation/apply-focus-reviewer.md):
  manifest validated, source inspected and actual Chrome success focus/retained value,
  invalid Apply error focus/raw preservation and Cancel reset/focus all passed.
  No corrective findings. Host-failure/teardown were source-inspected, not exercised.
- Exact source/test target: base `7b13b69` plus
  [apply-focus snapshot](../../output/increment-008-implementation/apply-focus-snapshot.sha256).
  Production change is limited to `useTokenEditor.ts`; the regression is
  `test/browser/apply-focus.mjs`. No broad build/full-suite or 007 checks ran.

The successful Apply focus observation above is resolved; other acceptance gaps
remain explicitly unverified. Follow-up verification is finished at approximately
**8.5 aggregate minutes** (developer 5.5, independent reviewer 2, coordinator 1),
with **one tooling-repair cycle**. This separate authorized allowance does not reset
or reopen the original verification campaign. No further checks are scheduled.

Suggested commit: `fix: restore editor focus after Apply commits`.

## Manual acceptance and closure — 12 November 2026

**Delivery status: Completed.** The user reported completing the remaining manual
checks in Chrome with everything looking good and explicitly instructed closing
Increment 008 without restarting automated qualification.

The reported acceptance covers the remaining manual checklist presented for closure:

- Presentation parity in desktop/compact layouts, inspector panes, tabs and navigation.
- Creation/restore dialog keyboard containment, cancellation/focus return and creation
  validation focus.
- Nested departure guard: keeping unfinished creation input and returning to the form,
  and explicit discard.
- Same-project readback through Restore → Open local project while preserving an
  unapplied token draft, without reloading the page.
- Same-ID restore replacement acknowledgement and explicit changed-baseline review
  before reapplying preserved dirty input.

This is user-reported overall acceptance of that checklist, not an agent replay or
an individually instrumented result for each step. Chrome version, operating-system
metadata and exact tested-build identity were not supplied. Repository HEAD when
recording closure was `f58b131` (Apply focus fix), following `7b13b69` (ownership and
composition refactor); this identifies the recorded source state, not a verified
mapping to the user's browser session.

Together with the existing implementation/source review and independently rechecked
Apply fix, this acceptance closes the remaining Increment 008 delivery gaps. Prior
unobserved automated paths are not relabelled automatically verified. Broader engine,
assistive-technology, exceptional lifecycle/storage, stress and other excluded
qualification remain outside this maintenance increment; Increment 007's deferred
qualification remains unchanged and unauthorized to restart.

Closure is documentation-only. No application tests, builds or browser sessions were
run for closure. Existing verification consumption and stopping decisions above are
unchanged; no allowance is reset and no further qualification is scheduled. No next
increment or implementation is authorized by closure. Staging, committing and pushing
remain with the user.

Suggested commit: `docs: record Chrome acceptance and close increment 008`.
