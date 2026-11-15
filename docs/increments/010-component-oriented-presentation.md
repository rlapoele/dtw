# Increment 010: Component-oriented presentation

- Contract status: Agreed
- Delivery status: Partially completed — first and shell/workspace slices implemented and independently reviewed; native-browser acceptance and later organisation work remain outstanding
- Agreement: on 15 November 2026 the user instructed “Go ahead with increment 10”, agreeing this first-slice contract and authorizing implementation through the separate developer/reviewer workflow. Later roadmap slices remain outside this authorization.
- References: [organisation proposal V1](../project/workbench-layout/presentation-organisation-proposal-v1.md), [decomposition V1](../project/workbench-layout/component-map-v1.md), [layout direction](../project/workbench-layout/README.md), [current ownership](../project/workbench-component-organisation.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md).

## Outcome

Make existing presentation responsibilities easier to find and evolve while users
continue creating/opening projects, restoring backups and editing retained projects
with the same behavior, raw session input and completion protections. Start with
the common controls and project-entry boundary, leaving the working editor intact.

## Delivery direction

This is a short proposed sequence, not a commitment to every component in the
mockups or to numbered future increments. Only the first slice below has a detailed
implementation contract. Later slices require their own bounded agreement.
Increment 010's currently drafted delivery scope and acceptance criteria cover
only this first slice; completing it would not complete the roadmap. Additional
scope needs a later contract or an explicit agreed amendment, without reserved
increment numbers.

1. Reorganize existing presentation using the endorsed component-oriented direction.
   Start with shared roots and project entry, then migrate shell/workspace and
   inspector responsibilities in coherent slices preserving behavior and sessions.
2. Define and deliver the responsive shell: usable side-by-side desktop regions,
   collapsed navigation, then narrow browse/edit composition with one editor
   session. Exact breakpoints, Back behavior and departure rules need a contract.
3. Add visual token browsing over the same project, scope and selection. Define
   view controls, grouping and specimen coverage without inventing canonical scales.
4. Define editable Details, including identity-safe naming/moves and explicit
   classification/description changes through application operations.
5. Define relationships and contextual previews, including accessible textual
   navigation, dependency semantics, preview bindings and applied/draft labeling.

Interchange and broader comparison are separate, currently unscoped work. Backup
is not interchange. The existing authored/resolved and applied/draft displays remain
available; this direction promises no additional comparison system, Undo/Redo,
variation editing, adapters or new token types.

## First implementation slice: shared roots and project entry

### Scope and rationale

Proposed: establish `ui/`, `app/`, `projects/` and `project-backup/` boundaries using
existing responsibilities. Project entry is a real usable boundary: the catalogue,
new-project form and recovery states are currently inline in `App.tsx`, while
restore already serves both project entry and the workbench. Moving these together
avoids presenting cross-screen restore as private workbench functionality.

Keep the current workbench, editor, readback and lifecycle owners at their current
paths in this slice. Their internal imports of moved controls/backup modules change;
their state, commands and layout do not. A temporary mixed tree is intentional and
must be documented as such, rather than declaring the whole target migration done.

Paths in the move table are relative to `src/presentation/`. Braced names enumerate
the complete file set for that row; they do not authorize additional moves.

| Current | Target / extraction |
| --- | --- |
| `components/ui/{badge,button,dialog-content,field,icon,input,select}.tsx` | `ui/{badge,button,dialog-content,field,icon,input,select}.tsx`; preserve exports and APIs. |
| `features/workbench/hooks/useWorkbenchHost.ts` | `app/useWorkbenchHost.ts`; same host lifetime. |
| `features/workbench/hooks/useProjects.ts` | `projects/useProjects.ts`; same implementation and call lifetime in App. |
| `features/workbench/backup/RestoreDialog.tsx` | `project-backup/RestoreDialog/RestoreDialog.tsx` |
| `features/workbench/backup/useBackupRestore.ts` | `project-backup/RestoreDialog/useBackupRestore.ts` |
| `features/workbench/backup/useWorkbenchBackup.ts` | `project-backup/useWorkbenchBackup.ts` |
| Inline project-screen shell in `app/App.tsx` | `projects/ProjectsScreen.tsx`: existing header/main, loading/empty/error/notice, restore file input and composition. |
| Inline catalogue list/items in `app/App.tsx` | `projects/ProjectList/ProjectList.tsx` and `ProjectListItem.tsx`: same list/item elements, row keys, unavailable entries and exact identity display. |
| Inline new-project form in `app/App.tsx` | `projects/CreateProjectForm/CreateProjectForm.tsx`: same form, input/ref, validation associations and actions. |
| Inline pending/retained/unknown recovery sections in `app/App.tsx` | `projects/ProjectRecovery/ProjectRecovery.tsx`: presentational states and recovery callbacks only. |

`App.tsx` keeps the unconditional calls to `useWorkbenchHost` and `useProjects`,
its selected-backup-file and Stay refs, preview/leaving state, event orchestration,
restore/departure dialog configuration, workbench branch and project-ID key.
`ProjectsScreen` receives the existing controlled data/actions and dialog nodes;
render the dialogs at their existing positions after main. No additional DOM
wrapper is needed for the extraction. App retains the current project's state while
the project screen is absent, exactly as now; do not mount `useProjects` conditionally
inside the new screen. Module-level child definitions retain stable React types.

### Component ownership contracts

- `ProjectsScreen` composes entry presentation. Its children receive narrow typed
  display values, callbacks and required refs, rather than the entire host, hook
  return object or general mutation/session setter. It performs no host calls.
- `ProjectList` owns list composition; its private item renders a catalogue entry.
  Preserve unsupported/unavailable entries and the existing open disable policy.
- `CreateProjectForm` receives name, disabled/pending/error state, input ref and
  name/submit callbacks. Name validation and retained creation remain in
  `useProjects`; this form cannot create or acknowledge a command independently.
- `ProjectRecovery` renders pending, retained-but-unreadable and unknown results
  from explicit flags and actions. It cannot replay creation, dispose the host or
  consume receipts. App keeps the departure dialog's controlled state and focus ref.
- `RestoreDialog` remains the cross-screen public restore component. Its colocated
  hook owns current staged-restore protection; the workbench backup hook still owns
  file/preview/download coordination. Keep all existing signatures and callbacks.
  Both screens consume RestoreDialog through its component entry; neither reaches
  into its private hook. `useWorkbenchBackup` moves modules, while its call and
  session lifetime remain owned by Workbench.
- `ui/` remains token-independent, including Icon and Base UI ref/render/className
  behavior. Host, application and domain boundaries remain unchanged. No new
  provider, registry, package, dependency, barrel or compatibility forwarding file.

### Import, test and configuration scope

Update all live source/test import references to the moved files, including
`main.tsx` consumers where affected, `app/Workbench.tsx`, all current workbench
components using generic controls, `test/browser/components.tsx`,
`test/presentation/icon.test.tsx` and the restore reducer import in
`test/presentation/workbench-coordination.test.tsx`. Inspect live import references
repository-wide rather than assuming these examples are exhaustive. Existing tests
keep their meaning and assertions; no removal merely to make migration pass.

The existing `@presentation` root alias in `vite.config.ts` and
`tsconfig.presentation.json`, presentation-local `tsconfig.json`, Vitest's inherited
aliases and `test/**/*.test.{ts,tsx}` discovery already cover these destinations.
No alias, include, dependency or build-topology change is proposed. Keep
`lib/cn.ts`, generated-table setup and `styles/global.css` at their current paths.
Do not rewrite frozen prototypes, hashes or historical evidence to current imports.
Update owning presentation-path documentation after delivery, not vendored references.

## Acceptance criteria

- AC-1 — Ownership/imports: the exact moved/extracted responsibilities above exist
  at the proposed locations, old live imports are removed, public entry points are
  clear and no duplicate primitives, empty future scaffolds or forwarding wrappers
  remain. The ownership map accurately describes the partial migration.
- AC-2 — Project entry parity: catalogue loading, failure/retry, empty, supported
  and unavailable entries retain text, counts, exact identities and row keys;
  name input, mandatory-name validation/focus and open/create disable conditions
  behave as before. Supported legacy project names are still readable.
- AC-3 — Retained command/readback parity: the same host and useProjects owners
  issue/consume/check commands; retained-but-unreadable results retry reading
  without repeating creation. Unknown writes preserve input and prevent blind
  replay. Review/Stay/Leave preserve existing fencing, reset and catalogue behavior.
- AC-4 — Session/restore parity: App's hooks remain unconditional and its host,
  refs and state keep their lifetime; the workbench's project key and single editor
  owner remain unchanged. Invalid raw editor drafts and unfinished creation input
  survive the same selection/view/departure actions as before. Backup file restaging,
  cancel/open callbacks and existing replacement-protection rules are preserved;
  session-only drafts do not become durable or enter backups.
- AC-5 — Markup/focus/style parity: extraction preserves rendered element order,
  nesting, labels, IDs, alert/status roles, disabled state, event behavior and class
  strings. Existing desktop/compact layout, native file-input reset, dialog initial
  focus, containment and return behavior remain. Generic APIs retain refs, Base UI
  state callbacks, additive Button classes and caller-last Icon composition.
- AC-6 — Architectural/scope parity: no token semantics, application command,
  host protocol, persistence/codec, naming policy, dependency or visual design
  changes; no new direct storage/worker-runtime access from rendering components.
  Workbench/editor changes are limited to imports for moved shared modules.

## Remaining reorganization slices: outline only

The endorsed proposal remains the destination, with these source-informed cautions:

- Shell/workspace: move `app/Workbench.tsx`, navigation containers and coordination
  beside `workbench/Workbench.tsx`; migrate header, navigation, workspace, creation,
  recovery and status into their named component owners. Extract only useful current
  responsibilities. Renaming ProjectedTokenList to TokenTable must preserve its
  current list accessibility semantics; a filename does not authorize table roles.
  Decide the test-used alternate TokenList's disposition without deleting coverage.
- Inspector/display: separate WorkbenchInspector's existing exports and ValueEditor
  composition; migrate the single editor owner/session and color controls without
  remounting them. Token-aware shared rendering belongs under `token-display/`, not
  generic UI or a private editor subtree. Resolve the existing AuthoredValue →
  readback identity-label dependency through a meaningful shared presentation helper,
  rather than making shared display depend on private workbench coordination.
- Shared helpers: `integer-rgb.ts` is currently used by both session operations and
  ColorFields. Place it at their nearest common TokenEditor owner when migrating,
  even though the illustrative tree nests it under ColorEditor; avoid sibling
  private coupling and duplicated arithmetic. `visual-range.ts` can remain with
  color controls where its actual consumers permit. Inspect dependencies again at
  that slice's baseline before fixing exact moves.

These are ownership constraints and planning notes, not detailed implementation
authority for later slices. No starred future components are created now.

## Decisions and open questions

- Established: user-endorsed component-oriented direction; current product/model,
  host/application/domain boundaries and presentation conventions still constrain it.
- Proposed for agreement: shared roots/project entry as the first delivery boundary,
  exact move/extraction table and ownership contracts above.
- Resolve before implementation: user agreement to this first-slice contract and
  explicit implementation authorization. No new product/schema/technology decision
  is needed for a behavior-preserving extraction; raise any discovered need first.
- Deferred: future responsive interactions, Details commands, relationships/preview
  semantics, interchange and broader comparison; existing open questions remain open.

## Verification approach

Planning is documentation/source review only: no application tests, builds, browser
work or harness repair. Shared ceiling with coordinator: ten aggregate minutes,
zero repair cycles; approximately five analyst minutes used (estimate). Coordinator
records aggregate consumption in the handoff; do not treat this as a fresh allowance.

After agreement/authorization, assess one shared first-slice ceiling of at most
30 aggregate verification minutes and two harness-repair cycles across developer,
reviewer and coordinator. Use less where evidence suffices; these are ceilings,
not targets. Record consumed/remaining effort and artifacts at each handoff.

- Essential AC-1/5/6: inspect the move/extraction diff and live imports; run the
  existing `npm run typecheck` and affected presentation tests, including Icon,
  coordination/restore, identity/session and exact-source coverage where imports
  cross the move. Commands use the existing generated-cn prehooks. A production
  `npm run build` can replace a separate identical typecheck run when used as the
  integration gate; avoid redundant repeats. Add focused entry-behavior coverage
  where extraction risk lacks evidence, not tests of directory names.
- Essential AC-2/3/4: controlled-host checks for creation/open failure, unknown write
  and retained-read retry; inspect unchanged hook authority and command flow. The
  existing coordination harness is useful evidence, not real React/focus evidence.
- Essential AC-4/5: a bounded native Chrome smoke of catalogue → create/open → return,
  validation focus, restore cancel and Review/Stay/Leave focus where representative
  states can be reached cheaply; check desktop and one compact viewport. Include
  one invalid raw editor-draft/selection/departure check after shared imports move.
  Label source, controlled-host and browser evidence separately; unreachable or
  unobserved required behaviors remain explicitly unverified.
- Relevant integrity checks concern unchanged command completion, restore protection
  and session ownership; no new retention stress, security audit or maximum-data
  performance promise follows from moving files. Use an ordinary small project.
- Excluded optional qualification: broad engines, maximum resource workloads,
  reload/crash campaigns, full PWA/offline/deployment and historical rare recovery.
  [007 deferred qualification](007-local-retention-and-backup.md#deferred-qualification)
  and [009 evidence/gaps](009-workbench-usability-and-component-boundaries.md)
  remain with their owning records, unpassed where unverified. Closing 009 does
  not transfer all its missing acceptance evidence into 010 or restart campaigns.

Stop at either ceiling or sooner when tooling dominates or another check cannot
change delivery judgment. Report failed/unverified criteria honestly; do not repair
harnesses or extend allowances automatically. Resumption after a stopping decision
requires an explicitly authorized bounded follow-up. New agents/snapshots do not
reset consumption; missing prior history is unknown, not zero.

## Design proposals and review

No new designer exploration is required for this slice: it preserves existing
markup, layout and interaction rather than implementing the mockups. The saved
layout/decomposition and endorsed organisation proposal are references, not
formally analyst-reviewed final visual contracts or application acceptance evidence.
Any material visual/interaction departure returns to the applicable user/designer/
analyst sequence before implementation. Final contract agreement is pending.

After authorization, use a separate developer with fresh context, then a separate
fresh reviewer on an identified stable snapshot under the
[role workflow](../workflow/agent-roles.md). Initial reviewer instructions derive
expectations from the agreed contract, without developer conclusions. One code
writer at a time; staging, committing and pushing remain with the user.

## Review baseline

Source inspected at `d33cfbb` on 15 November 2026. The coordinator is separately
recording user-directed 009 closure and status/archive changes; those documentation
changes are not this slice's implementation. Recheck and record the actual base
commit plus pre-existing working-tree changes before implementation. Record the
exact reviewed diff/new-file set before independent implementation review.

## Planning handoff — 15 November 2026

A separate analyst drafted this first-slice contract from the current source and
endorsed organisation/decomposition references. The coordinator checked scope,
closure attribution, session/command ownership, planned evidence and source-path
consistency. This is requirements drafting and coordinator review, not independent
implementation review or final design/contract acceptance.

The user-directed [009 closure](009-workbench-usability-and-component-boundaries.md#user-directed-closure--15-november-2026)
is recorded separately. Next: user review/agreement to this draft and explicit
implementation authorization. No source edits or application checks occurred.

Planning checks: all 117 local links checked across this contract, 009, the
organisation proposal, current status and outgoing archive resolve; Markdown
whitespace checks pass. Approximately nine of ten aggregate planning/source/
documentation-review minutes used (estimate: analyst five, coordinator four),
zero harness repairs; checks stopped. No runtime evidence is added. The future
implementation allowance above remains proposed and inactive, not consumed by
this documentation task and not a reset of prior qualification campaigns.

## Agreed amendments

### First-slice agreement and implementation authorization — 15 November 2026

The user authorized Increment 010 after the draft roadmap and first-slice contract
were saved, committed and pushed. The agreement covers only shared UI/backup roots
and project-entry extraction, AC-1 through AC-6. Earlier pending/Draft statements
record planning history and are superseded by this authorization, not permission
to implement later roadmap slices or the replacement interface.

Implementation baseline: `717c08e` with no pre-existing working-tree changes.
Coordinator authorization/status edits are documentation outside the source
snapshot. Preserve project/session lifetimes, command authority, current DOM,
styles and component APIs as contracted. No new designer exploration is needed
for this behavior-preserving slice.

The single implementation verification allowance is now active: at most 30
aggregate minutes and two harness-repair cycles, stopping at either limit or
earlier for low value/tooling dominance. Initial allocation: developer up to ten
minutes, fresh reviewer seven, coordinator/browser ten, three reserved for focused
reconciliation or repairs; these share one ceiling and are not new allowances.
Record actual consumption at handoffs. Run focused affected tests and one final
build rather than duplicate typechecks/full-suite campaigns. Use existing Chrome
tools for bounded ordinary parity, and report unreachable required states as
unverified. Old 007/008/009 campaigns stay stopped; no expanded qualification is
authorized. Staging, committing and pushing remain with the user.

## First-slice implementation handoff — 15 November 2026

**Implementation and independent source review finished; delivery Partially
completed because required native-browser/focus/compact acceptance is not fully
observed.** No demonstrated implementation defect remains. This handoff covers
only the agreed shared-roots/project-entry slice, not the rest of the roadmap.

### Delivered result

- Seven generic controls now live in `src/presentation/ui/` with the same APIs,
  markup and class-composition behavior.
- Host lifetime and project-entry hooks live at `app/useWorkbenchHost.ts` and
  `projects/useProjects.ts`, still called unconditionally by App.
- Cross-screen restore and workbench backup coordination live under
  `project-backup/`; their call sites, signatures and session lifetimes are preserved.
- `ProjectsScreen`, `ProjectList`, `ProjectListItem`, `CreateProjectForm` and
  `ProjectRecovery` render the extracted entry presentation through controlled
  data/actions/refs. App retains host/project orchestration, file reset/restaging,
  preview/departure state, refs, dialog configuration and the Workbench project key.
- Live imports, focused tests and current-path documentation follow the moves.
  Workbench, navigation, editor/session and remaining internals changed only their
  moved-module imports. No replacement responsive UI or future scaffolding was added.

See the [move map](../../output/increment-010-first-slice/moves.json) and
[current ownership map](../project/workbench-component-organisation.md) for the
deliberate partial migration.

### Snapshot and evidence

Implementation base: `717c08e3e982b3cf1a724a5a82d74c5469b44a6e`.
The [exact source/test/current-doc patch](../../output/increment-010-first-slice/review-source.patch)
and [58-entry hash manifest](../../output/increment-010-first-slice/review-source-manifest.json)
identify the frozen independent-review snapshot, including new and deleted files.
Coordinator contract/status/report edits are outside that source snapshot.

| Criterion | Evidence and disposition |
| --- | --- |
| AC-1 ownership/imports | Verified by move comparison, live-import checks and fresh independent source review. All 12 moved modules preserve their implementations after import mapping; five entry components are extracted. |
| AC-2 project entry | Source/render/controlled-host evidence covers catalogue branches, identities, counts, disablement, validation/open failure. In-app smoke observed required-name focus, creation, return and reopening. Native Chrome failure/legacy-state coverage is not claimed. |
| AC-3 retained commands | Unchanged hook/host authority independently reviewed; controlled-host checks cover retained-read retry without replay and unknown-write fencing/reset. Native unknown-write Review/Stay/Leave focus remains unverified. |
| AC-4 sessions/restore | Source and focused tests preserve editor/key/restore authority; in-app smoke retained invalid raw input across All content and Keep editing. Native file-selection/restaging/cancel/replacement behavior was not replayed. |
| AC-5 markup/focus/style | Independent source review confirms no extra DOM wrapper and unchanged markup/classes/roles/refs/control APIs. In-app required-name focus and ordinary departure were observed. Exact compact geometry, screenshots and full native focus/restore acceptance remain unverified. |
| AC-6 architecture/scope | Verified by independent diff/source review: no domain/application/host/protocol/codec/dependency/configuration/style changes; existing non-App source changes are imports only. |

Developer [report](../../output/increment-010-first-slice/developer-report.md):
39 focused tests across six files passed, including new entry-state and
controlled-host characterizations. The single final `npm run build` passed all
four TypeScript configurations and Vite bundling. The existing >500 kB chunk
advisory remains; no performance claim follows. No full-suite rerun occurred.

The fresh [independent reviewer](../../output/increment-010-first-slice/reviewer.md)
derived expectations from the agreed contract before inspecting implementation,
confirmed all 58 manifest entries and patch integrity, and found no actionable
implementation findings. It ran no duplicate tests/builds or browser qualification.

Coordinator [browser observations](../../output/increment-010-first-slice/browser-observations.md)
separate in-app Chromium evidence from native Chrome. Native Chrome was unavailable
as a dedicated connected surface; screenshot capture was unavailable and the
requested compact viewport did not match the reported page size. No native Chrome,
exact compact or screenshot parity is claimed. No connector/profile/harness was
installed or repaired. The temporary tab/override and task-local Vite process were
closed after checking; no existing user projects were changed.

### Verification accounting and next action

Approximately **21 of 30 aggregate verification minutes** used (estimate:
developer six, independent reviewer five, coordinator browser/source/reconciliation
ten), **zero harness repairs**. Checks stopped with useful source/test evidence and
explicit browser-tool limits; the unused allowance does not authorize automatic
alternate-stack setup or another campaign. All prior 007/008/009 stop decisions
remain unchanged. No failed or unobserved old case is relabelled passed.

Next: user review of the first-slice result and remaining native-browser acceptance.
Any resumed automated acceptance needs an explicitly authorized bounded follow-up;
manual checks should use disposable projects and retain the distinction between
source, controlled-host and browser evidence. Do not mark 010 Completed until its
required acceptance is evidenced or the user explicitly changes its closure scope.
Later shell/workspace and inspector/display reorganisation still needs a bounded
contract/amendment and implementation authorization. Staging, committing and
pushing remain with the user.

Suggested commit: `refactor: extract project entry and shared presentation roots`.

## Next-slice planning — 15 November 2026

After committing and pushing the first slice, the user instructed “Proceed”.
The next bounded reorganisation is the workbench shell and token workspace.
The [second-slice proposal](010-shell-and-workspace-slice.md) defines its exact
moves/extractions and acceptance criteria against committed baseline `32ec593`.
It is a Draft amendment, not an agreed extension of AC-1 through AC-6 or authority
to implement future mockup functionality. Source changes await agreement to that
identified scope under the existing increment workflow.

The first slice's native-browser acceptance remains unverified as recorded above;
committing, pushing and proceeding to planning do not constitute a manual test
report, waive criteria or restart its stopped verification. No further first-slice
qualification or migration ran while drafting the next slice.

### Second-slice authorization — 15 November 2026

After committing the proposal as `d3a7e9c`, the user explicitly agreed the
[shell/workspace contract](010-shell-and-workspace-slice.md#agreement-and-implementation-authorization--15-november-2026)
and authorized implementation. S2-AC-1 through S2-AC-5 and its exact boundaries are
now agreed; its separate bounded verification allowance is active. This supersedes
the preceding pending-authority text only for S2, not later roadmap work, and does
not resolve the first slice's recorded native-browser evidence gaps.

### Second-slice implementation handoff — 15 November 2026

The [S2 handoff](010-shell-and-workspace-slice.md#implementation-handoff--15-november-2026)
records completed shell/workspace source migration and fresh independent review,
51 passing focused tests, one passing final build and useful in-app ordinary-flow
observations. The sole low-priority documentation finding was corrected and
rechecked; no actionable findings remain. Native Chrome/compact/full-focus evidence
remains unverified, so delivery is Partially completed. The remaining inspector/
display migration and replacement-interface roadmap are not delivered or authorized.
S2's approximately 21/30 aggregate minutes and zero repairs are recorded separately
from the first slice's unchanged stopped allowance; no old campaign restarts.

### Inspector/display planning — 15 November 2026

The user reported committing and pushing S2 and instructed proceeding to the next
step. Baseline `d430edd` is the committed shell/workspace implementation, clean
before this planning task. The [inspector/display proposal](010-inspector-and-display-slice.md)
defines a Draft S3 amendment for the remaining component organisation and removal
of the single-feature wrapper. Exact source-informed scope requires agreement
before implementation; no new interface capabilities are included.

The first-slice and S2 native-browser evidence gaps remain unverified, and their
stopped budgets are not reset by committing, pushing or planning S3.
