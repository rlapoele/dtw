# Presentation organisation V2 — proposed resulting tree

**User-adopted grouping refinement — 15 November 2026.** After the analyst-review
handoff at `529b2db`, the user adopted the concrete file-grouped tree shown in
chat and requested this documentation update only. The V2 design set at `ae75f29`
was approved for analyst review; this structural decision does not establish final
agreement to the whole Increment 011 contract or authorize implementation.
Read with the [review](../../increments/011-v2-analyst-review.md),
[draft 011 contract](../../increments/011-responsive-shell.md),
[V2 component map](component-map-v2.md) and
[current delivered ownership](../workbench-component-organisation.md).

## Later App placement refinement — 16 November 2026

The user subsequently requested `App/` casing and placement of ApplicationHeader
and ApplicationShell under `App/components/`. The dated tree and adoption records
below preserve the Increment 011 proposal; the [current ownership map](../workbench-component-organisation.md)
records the revised delivered paths. This supersedes the presentation-level
`components/` placement below without changing component or state ownership.

## Later browser host placement — 16 November 2026

The user subsequently approved moving the browser execution boundary to
`src/hosts/browser/` and source-display assembly to
`src/presentation/token-display/helpers/read-exact-source.ts`. This supersedes
`presentation/host/` in the dated tree below. See the
[architecture decision](../architecture.md#browser-host-placement--16-november-2026).

## Later Projects placement refinement — 16 November 2026

The user subsequently requested `Projects/Projects.tsx` and placement of RestoreDialog
with its hook under `Projects/components/RestoreDialog/`. This supersedes lowercase
`projects/`, `ProjectsScreen.tsx` and the separate `project-backup/` wrapper in the
dated tree below. App retains its hook calls and restore orchestration. See the
[current ownership map](../workbench-component-organisation.md#projects-placement-refinement--16-november-2026).

## Later App screen nesting — 16 November 2026

The user subsequently requested moving the Projects and Workbench subtrees under
`src/presentation/App/components/`. This supersedes their root-level placement in
the dated tree below. Hook callers and state lifetimes remain unchanged; see the
[current resulting tree](../workbench-component-organisation.md#app-screen-ownership--16-november-2026).

## Later token display ownership — 16 November 2026

The user subsequently requested distributing the former `token-display/` contents
inside TokenWorkbench. This supersedes the top-level token-display placement below;
the [current ownership map](../workbench-component-organisation.md#token-display-ownership--16-november-2026)
records shared workbench helpers/components and inspector/editor-private components.

## Later plural screen naming — 16 November 2026

The current token screen is `App/components/TokensWorkbench/TokensWorkbench.tsx`,
renamed from TokenWorkbench to match ProjectsWorkbench. See the
[current ownership map](../workbench-component-organisation.md#plural-workbench-naming--16-november-2026).
Dated proposal trees and review evidence retain their original names.

## Organisation principle

Keep a component’s entry file at its named folder’s root. Group its supporting
files by role: `components/` for private child components, `hooks/` for hooks,
`helpers/` for supporting functions and `state/` for pure state/session logic.
Use `components`, rather than `views`, to cover controls and sections as well as
larger views. Add other categories such as `types/`, `constants/` or local styles
only when actual files need them; create no empty category folders.

Ownership comes before file kind. A private file stays within its component’s
subtree; sibling consumers share a file at their nearest meaningful common owner.
Cross-screen application structure lives in presentation-level `components/`;
generic token/project-agnostic controls remain in `ui/`, which already expresses
that category. Shared token-aware renderers and their functions are separated
under `token-display/components/` and `token-display/helpers/`. Browser/worker
boundary modules stay under `host/`; they are not helpers merely because they
have a `.ts` extension.

A child gets its own named folder when it owns supporting files or a substantial
component subtree. Simple private children may stay as individual files within
the parent’s `components/`; existing named component boundaries in the tree are
retained. This makes file roles visible while accepting deeper nested paths,
especially inside TokenEditor. Do not add folders solely to make every leaf
look identical.

File extension alone does not determine role: `.ts` may contain types, state
transitions, worker/runtime code or validation. `editor-session.ts` belongs to
TokenEditor’s `state/`; `integer-rgb.ts` belongs to its `helpers/` because the
editor session and ColorEditor both use it. `visual-range.ts` stays within
ColorEditor’s private `helpers/`.

The user also selected **`Workbench/`** capitalization for the named owner of
`Workbench.tsx`, consistent with other named component folders. The source still
uses lowercase `workbench/`; that current-source evidence and historical review
paths remain unchanged. Future source paths/imports must use the selected target
casing when implementation is authorized.

Physical location remains independent of the React caller and state lifetime.
App still calls useProjects unconditionally; Workbench still calls useCreationForm;
TokenEditor remains the sole useTokenEditor caller. Grouping files does not move
those calls, change keys, reparent rendered components or introduce reset reasons.

## Concrete resulting tree

`[N]` = new responsibility, `[M]` = existing file moved. Markers compare target
paths with current application source, not the earlier proposal. Unmarked files
retain location, not necessarily unchanged JSX. This includes all current
presentation files, including host/token display/theme/config; it is not a scaffold for future
capabilities. Removing the Workbench backup hook is explained below.

```text
src/presentation/
├── app/
│   ├── hooks/
│   │   └── useWorkbenchHost.ts [M]
│   └── App.tsx
├── components/
│   ├── ApplicationHeader/
│   │   └── ApplicationHeader.tsx [N]
│   └── ApplicationShell/
│       └── ApplicationShell.tsx [N]
├── host/
│   ├── backup-file.ts
│   ├── derived-validation.ts
│   ├── protocol.ts
│   ├── source.ts
│   ├── validation.ts
│   ├── workbench.worker.ts
│   ├── worker-client.ts
│   └── worker-runtime.ts
├── lib/
│   ├── cn-tables.generated.ts [generated, ignored]
│   └── cn.ts
├── project-backup/
│   └── components/
│       └── RestoreDialog/
│           ├── hooks/
│           │   └── useBackupRestore.ts [M]
│           └── RestoreDialog.tsx [M]
├── projects/
│   ├── components/
│   │   ├── CreateProjectForm/
│   │   │   └── CreateProjectForm.tsx [M]
│   │   ├── ProjectInspector/
│   │   │   └── ProjectInspector.tsx [N]
│   │   ├── ProjectList/
│   │   │   ├── components/
│   │   │   │   └── ProjectListItem.tsx [M]
│   │   │   └── ProjectList.tsx [M]
│   │   └── ProjectRecovery/
│   │       └── ProjectRecovery.tsx [M]
│   ├── hooks/
│   │   ├── useProjects.ts [M]
│   │   └── useProjectsLayout.ts [N]
│   └── ProjectsScreen.tsx
├── styles/
│   └── global.css
├── token-display/
│   ├── components/
│   │   ├── AuthoredValue.tsx [M]
│   │   ├── ExactSource.tsx [M]
│   │   ├── ResolvedTokenPanel.tsx [M]
│   │   ├── TokenMetadata.tsx [M]
│   │   └── TokenSwatch.tsx [M]
│   └── helpers/
│       ├── authored-color.ts [M]
│       ├── color-preview.ts [M]
│       ├── identity-labels.ts [M]
│       └── resolved-color.ts [M]
├── ui/
│   ├── badge.tsx
│   ├── button.tsx
│   ├── dialog-content.tsx
│   ├── field.tsx
│   ├── icon.tsx
│   ├── input.tsx
│   └── select.tsx
├── Workbench/
│   ├── components/
│   │   ├── CreationDialog/
│   │   │   ├── helpers/
│   │   │   │   └── naming-preview.ts [M]
│   │   │   ├── hooks/
│   │   │   │   └── useCreationForm.ts [M]
│   │   │   └── CreationDialog.tsx [M]
│   │   ├── TokenWorkspace/
│   │   │   ├── components/
│   │   │   │   ├── AllContent/
│   │   │   │   │   ├── helpers/
│   │   │   │   │   │   └── all-content.ts [M]
│   │   │   │   │   └── AllContent.tsx [M]
│   │   │   │   ├── SelectionBar/
│   │   │   │   │   └── SelectionBar.tsx [N]
│   │   │   │   ├── TokenTable/
│   │   │   │   │   └── TokenTable.tsx [M]
│   │   │   │   └── WorkspaceToolbar/
│   │   │   │       └── WorkspaceToolbar.tsx [M]
│   │   │   └── TokenWorkspace.tsx [M]
│   │   ├── WorkbenchHeader/
│   │   │   └── WorkbenchHeader.tsx [M]
│   │   ├── WorkbenchInspector/
│   │   │   ├── components/
│   │   │   │   ├── GroupInspector/
│   │   │   │   │   └── GroupInspector.tsx [M]
│   │   │   │   ├── TokenEditor/
│   │   │   │   │   ├── components/
│   │   │   │   │   │   ├── ColorEditor/
│   │   │   │   │   │   │   ├── helpers/
│   │   │   │   │   │   │   │   └── visual-range.ts [M]
│   │   │   │   │   │   │   └── ColorEditor.tsx [M]
│   │   │   │   │   │   ├── EditorActions.tsx [M]
│   │   │   │   │   │   ├── EditRecovery.tsx [M]
│   │   │   │   │   │   ├── ReferenceFields.tsx [M]
│   │   │   │   │   │   ├── TokenEditorContent.tsx [M]
│   │   │   │   │   │   └── TokenEditorTabs.tsx [M]
│   │   │   │   │   ├── helpers/
│   │   │   │   │   │   ├── editor-failure.ts [M]
│   │   │   │   │   │   └── integer-rgb.ts [M]
│   │   │   │   │   ├── hooks/
│   │   │   │   │   │   └── useTokenEditor.ts [M]
│   │   │   │   │   ├── state/
│   │   │   │   │   │   └── editor-session.ts [M]
│   │   │   │   │   └── TokenEditor.tsx [M]
│   │   │   │   ├── InspectorHeader.tsx [M]
│   │   │   │   └── TokenValueComparison.tsx [M]
│   │   │   └── WorkbenchInspector.tsx [M]
│   │   ├── WorkbenchNavigation/
│   │   │   ├── components/
│   │   │   │   └── NamespaceTree/
│   │   │   │       └── NamespaceTree.tsx [M]
│   │   │   └── WorkbenchNavigation.tsx [M]
│   │   ├── WorkbenchRecovery/
│   │   │   └── components/
│   │   │       ├── DepartureGuard.tsx [M]
│   │   │       ├── ProjectDiagnostics.tsx [M]
│   │   │       ├── RetentionRecovery.tsx [M]
│   │   │       └── WorkbenchFeedback.tsx [N]
│   │   └── WorkbenchStatus/
│   │       └── WorkbenchStatus.tsx [M]
│   ├── helpers/
│   │   └── workspace-view.ts [M]
│   ├── hooks/
│   │   ├── useProjectCommands.ts [M]
│   │   ├── useProjectReadback.ts [M]
│   │   ├── useWorkbenchLayout.ts [M]
│   │   └── useWorkbenchLifecycle.ts [M]
│   └── Workbench.tsx [M]
├── main.tsx
└── tsconfig.json
```

## State, call ownership and consumers

| Physical owner | React caller / state owner and lifetime | Consumers and authority |
| --- | --- | --- |
| `app/App.tsx`, `app/hooks/useWorkbenchHost.ts` (hook moved) | App calls useWorkbenchHost and useProjects unconditionally, before its Projects/Workbench branch. App lifetime retains host ref, backup file ref, preview, departure dialog state and stay ref. | One host; App owns reset and keyed project branch. Restore file refs survive ProjectsScreen unmount, without a second Workbench. |
| `projects/hooks/useProjects.ts` (moved, extended coordination) | **App**, not ProjectsScreen, calls useProjects. Existing entries/opened project, name/nameRef, pending, activeMutation, retainedId, unknown, notices/errors stay here for App lifetime. Selected-project backup adds captured ID/revision and pending/error sequencing here, using existing file helper. | ProjectsScreen receives controlled data/actions. Open/Create/Restore and unknown recovery share existing gates; no second catalogue or backup controller. Opened `project` is distinct from selected catalogue entry. |
| `app/App.tsx` Projects page context (new state, no required extra hook) | App owns `projectsView`: selection for any catalogue row keyed by `rowKey`, preserving its exact displayed `id` and last-known status, plus saved browse scroll and remembered narrow surface. Reconcile against refreshed catalogue without discarding unsupported identity/reason; only a currently supported row enables Open/Backup. It survives the Workbench branch; full App reset/reload may clear it. | ProjectsScreen receives context and callbacks. Explicit Open/Create/Restore completion updates selection. Keep missing selection truthful. No saved preferences/database writes; no second selected ID inside ProjectInspector. |
| `projects/hooks/useProjectsLayout.ts` (new) | ProjectsScreen calls it once while mounted: current width mode, visible narrow surface, refs/focus handoff and mounted scroll restoration. Seed/save page context through App callbacks. Dispose listeners on unmount. | List/inspector presentation only. It never opens a project or creates a revision. DOM focus effects must run only for mounted Projects, even though saved context survives it. |
| `projects/ProjectsScreen.tsx`, ProjectList, ProjectListItem, ProjectInspector | Controlled selection and callbacks; local DOM refs only. Inspector has no private project read, writable ownership state or draft. | Exact catalogue name/identity/counts/status, or unavailable reason; separate Open/Download. New ProjectInspector is a real page region, not a wrapper for one button. Create/Restore/retention section remain composed inline with existing form/recovery children. |
| `ApplicationShell`, `ApplicationHeader` (new) | Stateless shared application chrome; page composition supplies slots/display props. | Both Projects and Workbench; frame/main/feedback/status geometry and app identity. No namespace, project list, domain value, host or editor state. This cross-screen structure is distinct from generic `ui/`. |
| `project-backup/components/RestoreDialog/RestoreDialog.tsx` and `hooks/useBackupRestore.ts` (moved) | RestoreDialog calls useBackupRestore while App mounts the active preview. Its review, replacement acknowledgement/protection, pending/unknown/reconciliation stay tied to that preview. App retains file ref for restaging. | Projects restore entry only in 011; dialog still uses existing typed host operations and exact revision protection. Never reuse catalogue download success as acknowledgement. |
| `host/backup-file.ts` (retained) / removal of `project-backup/useWorkbenchBackup.ts` | Pure browser file/read/download effects stay in existing host helper. The Workbench-only hook's selected file/preview/restage flow duplicates App's already existing restore path and is removed once entry points move. Its download sequencing moves to useProjects; no new generic backup hook is needed. | useProjects invokes revision-checked download. App retains staging/file/preview ownership; RestoreDialog retains restore authority. No direct IndexedDB or storage policy in components. |
| `Workbench/Workbench.tsx` (moved path, retained coordinator) | Workbench remains keyed by `project.project.id` in App. It owns selected token/group, view/query, dirty/departure/pending request, editorVersion, completion refs, source callbacks and creation-hook call. All survive responsive modes during that open project session. | Page-specific header, navigation, workspace, inspector, feedback and dialogs receive controlled values. No transfer of mutation or departure authority to chrome/layout. |
| `Workbench/hooks/{useProjectReadback,useProjectCommands,useWorkbenchLifecycle}` (moved) | **Workbench** remains caller, with existing call order. Readback owns header/context/rows/inspection/diagnostics/failures; command hook owns busy/unknown/accept/reconciliation; lifecycle owns host pause/resume checks through current inputs. | Workbench composes their values; dependencies/refs remain explicit. Physical hooks folder changes neither worker lifetime nor completion authority. |
| `Workbench/hooks/useWorkbenchLayout.ts` (moved, extended) | Workbench calls once: threshold mode, navigation drawer/collapse, inspector collapse, last narrow surface and pane focus/scroll refs. No editor values or command state. | Header/navigation/workspace/inspector use display props and callbacks. Same mounted inspector subtree changes visibility; focus policy yields to active dialogs. No storage preference persistence. |
| `Workbench/helpers/workspace-view.ts` (moved) | Pure view/scope/creation-parent mapping; no hook/state. | Workbench creation-parent mapping, NamespaceTree and workspace consumers; nearest shared workbench owner. AllContent membership helper remains private to AllContent. |
| `Workbench/components/` header/navigation/workspace owners (moved) | Stateless/controlled composition apart from existing local rendering details. SelectionBar is new controlled selected-target/draft-indication/reopen rendering. | No backup/restore/Undo controls. Workbench navigation retains existing button semantics. SelectionBar receives selected identity even if query/scope hides its row; it cannot replace the editor target. |
| WorkbenchInspector / TokenEditor / `hooks/useTokenEditor.ts` (grouped under `Workbench/components/`) | **TokenEditor is the sole hook caller**, with key `[selection.id, editorVersion]`. Its raw literal/reference input, tab/mode, display/entry settings, validation/recovery and Apply/Cancel remain the one editor session. | TokenEditorContent, ReferenceFields, ColorEditor, actions/recovery receive bounded values/callbacks. Keep stable React ancestry/key across width, Back, drawer, collapse and filtering; CSS hiding/inertness alone adds no reset reason. Authorized deliberate selection/completion/discard still may reset as today. |
| TokenEditor `state/`, `helpers/` and ColorEditor `helpers/` (moved) | `editor-session` pure session transforms, `editor-failure` text, `integer-rgb` shared by editor/color controls, ColorEditor `visual-range` private range presentation. | Existing component subtree; no generic slider/state abstraction and no numerical policy changes. |
| WorkbenchStatus / WorkbenchRecovery under `Workbench/components/` (moved + new WorkbenchFeedback) | WorkbenchFeedback renders existing lifecycle/read-failure/retention feedback from Workbench values/actions, without a new hook. WorkbenchStatus consolidates ordinary applied/draft guidance; Request persistent storage leaves this component. | Visible safety region outside hidden browse/inspect panes, with urgent actions always exposed. Diagnostics/DepartureGuard retain current semantics. Projects retention action calls existing storage-preference adapter from page command composition and reports the result. |
| CreationDialog entry / `hooks/useCreationForm.ts` / `helpers/naming-preview.ts` (moved) | Workbench calls useCreationForm; form draft/review baseline and refs stay alive through existing modal/cancel rules, not responsive visibility. | Creation/rename dialogs receive existing actions; no parallel phone dialog. Pure naming helper remains private. |
| `token-display/components/` and `token-display/helpers/` (grouped) | Read-only token-aware components/helpers; ExactSource retains on-demand request/revision invalidation and bounded viewport. No editor-hook dependency. | Used by inspector/workspace as today; pure identity/color/resolution helpers retain exact meanings. |
| `ui/`, `lib/cn.ts`, `styles/global.css`, `host/`, main/config (retained) | Existing control APIs/theme, class-composition and host runtime/validation/worker boundaries. | Generic UI and owned Icon; semantic theme shared by both pages. No new dependency/protocol, filesystem, domain semantics or direct storage access. Tests outside src remain at meaningful existing owners unless implementation demonstrates a necessary move. |

## Lifetime and cross-screen restrictions

App's page branch must not conditionally call useProjects. Keeping the hook file
under `projects/hooks/` expresses purpose; calling it inside ProjectsScreen would lose
entry state during project opening. Conversely, retaining Projects view context in
App does not keep the screen's hidden DOM/focus effects mounted.

Workbench's project-ID key remains deliberate. Responsive wrappers must keep one
stable inspector/editor position and key, not reparent it into distinct desktop/
mobile branches. A document-level React portal change or a new ancestor key can
remount despite retaining the same child key, so preservation needs focused runtime
proof later. The proposal does not select a portal or new context/provider.

No current source moves have been made. These refinements replace the ambiguous
screen-local selection lifetime in component map V2 and spell out a concrete
resulting tree. The file-grouping convention and concrete variant were adopted by the user after
that review. The overall Draft contract, UI policies, App context and backup
sequencing still await final agreement; implementation is explicitly not authorized.
A material visual departure would return to the designer/user before renewed review.

## Adoption record — 15 November 2026

The user reviewed a concrete in-chat tree, liked the grouping approach and asked
to adopt it in this proposed tree and Increment 011 contract without implementation.
This is a file-placement refinement of the analyst-reviewed ownership plan. The
component purposes, actual consumers, hook callers, state/refs, one-editor session
and command/lifecycle boundaries remain unchanged. The earlier analyst review is
historical evidence for its identified snapshot, not a claim that this later
path-grouping revision received a second independent review. No source files or
folders were moved, added or deleted.

## Implementation handoff — 15 November 2026

The user subsequently agreed the whole 011 contract/design/structure and authorized
implementation. This tree is now delivered; see the
[current ownership map](../workbench-component-organisation.md) and
[completion report](../../increments/011-responsive-shell.md#completion-report--15-november-2026)
for actual paths, exact reviewed snapshot, evidence and unverified acceptance.
Earlier planning-only and no-source-move statements above describe their dated
planning stage. They do not override the later explicit authorization.

## Storage-protection amendment owners — 15 November 2026

The authorized 011 amendment adds `app/hooks/useStoragePersistence.ts` for
App-lifetime status/request coordination and
`projects/components/StorageProtection/StorageProtection.tsx` for controlled
Projects status/retry rendering. Native capability calls remain in
`src/adapters/browser/storage-preference.ts`. Existing create/restore owners
notify only confirmed retention; they do not own browser-protection state. The
[current ownership map](../workbench-component-organisation.md) includes these
actual files. This extends the implemented tree above without changing its
owner-first categories or the existing command/session boundaries.


## Increment 013 placement refinement — 16 November 2026

Current screens are `App/components/ProjectsWorkbench/ProjectsWorkbench.tsx` and
`App/components/TokenWorkbench/TokenWorkbench.tsx`. Both use
`App/components/WorkbenchLayout/WorkbenchLayout.tsx`, reusing ApplicationShell; its
viewport hook shares only threshold observation. Screen hooks retain focus and
surface policy, and App still calls useProjects unconditionally. The current
[ownership map](../workbench-component-organisation.md) supersedes the dated tree
for present paths. Historical evidence and the proposal tree remain dated records.
