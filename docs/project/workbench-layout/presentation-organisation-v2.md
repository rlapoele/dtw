# Presentation organisation V2 — proposed resulting tree

**Draft refinement after analyst review — 15 November 2026.** Applies to the V2
set at `ae75f29`, approved for analyst review; final agreement and implementation
remain pending. Read with the [review](../../increments/011-v2-analyst-review.md),
[draft 011 contract](../../increments/011-responsive-shell.md),
[V2 component map](component-map-v2.md) and
[current delivered ownership](../workbench-component-organisation.md).

## Organisation principle

Continue the endorsed named component folders. Put every file at the level that
expresses its purpose, owner and actual consumers. Hooks/helpers folders are
allowed where useful, as the user clarified during review. This applies equally
to types, constants, local styles, subcomponents and test support if such files
are needed; it is not a rule to create a global folder for each file kind or move
every existing file. Shared siblings use their nearest meaningful common owner;
private children stay private. Generic UI remains token/project agnostic.
Physical location is independent of the React component that calls a hook and
therefore independent of its state lifetime.

The proposed `workbench/hooks/` groups the four Workbench-called coordination
hooks; `workbench/helpers/workspace-view.ts` is shared by Workbench, namespace navigation and workspace composition. Small established private helpers remain beside their
components. Projects layout has its own hook rather than being folded into
useProjects' command/recovery state. No generic controller or page-wide mega-hook.
No new type/constant/style/test-support directory is needed in this bounded tree.

## Concrete resulting tree

`[N]` = new responsibility, `[M]` = existing file moved. Unmarked files retain
location, not necessarily unchanged JSX. This includes all current presentation
files, including host/token display/theme/config; it is not a scaffold for future
capabilities. Removing the Workbench backup hook is explained below.

```text
src/presentation/
├── ApplicationHeader/
│   └── ApplicationHeader.tsx [N]
├── ApplicationShell/
│   └── ApplicationShell.tsx [N]
├── app/
│   ├── App.tsx
│   └── useWorkbenchHost.ts
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
├── main.tsx
├── project-backup/
│   └── RestoreDialog/
│       ├── RestoreDialog.tsx
│       └── useBackupRestore.ts
├── projects/
│   ├── CreateProjectForm/
│   │   └── CreateProjectForm.tsx
│   ├── ProjectInspector/
│   │   └── ProjectInspector.tsx [N]
│   ├── ProjectList/
│   │   ├── ProjectList.tsx
│   │   └── ProjectListItem.tsx
│   ├── ProjectRecovery/
│   │   └── ProjectRecovery.tsx
│   ├── ProjectsScreen.tsx
│   ├── hooks/
│   │   └── useProjectsLayout.ts [N]
│   └── useProjects.ts
├── styles/
│   └── global.css
├── token-display/
│   ├── AuthoredValue.tsx
│   ├── ExactSource.tsx
│   ├── ResolvedTokenPanel.tsx
│   ├── TokenMetadata.tsx
│   ├── TokenSwatch.tsx
│   ├── authored-color.ts
│   ├── color-preview.ts
│   ├── identity-labels.ts
│   └── resolved-color.ts
├── tsconfig.json
├── ui/
│   ├── badge.tsx
│   ├── button.tsx
│   ├── dialog-content.tsx
│   ├── field.tsx
│   ├── icon.tsx
│   ├── input.tsx
│   └── select.tsx
└── workbench/
    ├── CreationDialog/
    │   ├── CreationDialog.tsx
    │   ├── naming-preview.ts
    │   └── useCreationForm.ts
    ├── TokenWorkspace/
    │   ├── AllContent/
    │   │   ├── AllContent.tsx
    │   │   └── all-content.ts
    │   ├── SelectionBar/
    │   │   └── SelectionBar.tsx [N]
    │   ├── TokenTable/
    │   │   └── TokenTable.tsx
    │   ├── TokenWorkspace.tsx
    │   └── WorkspaceToolbar/
    │       └── WorkspaceToolbar.tsx
    ├── Workbench.tsx
    ├── WorkbenchHeader/
    │   └── WorkbenchHeader.tsx
    ├── WorkbenchInspector/
    │   ├── GroupInspector/
    │   │   └── GroupInspector.tsx
    │   ├── InspectorHeader.tsx
    │   ├── TokenEditor/
    │   │   ├── ColorEditor/
    │   │   │   ├── ColorEditor.tsx
    │   │   │   └── visual-range.ts
    │   │   ├── EditRecovery.tsx
    │   │   ├── EditorActions.tsx
    │   │   ├── ReferenceFields.tsx
    │   │   ├── TokenEditor.tsx
    │   │   ├── TokenEditorContent.tsx
    │   │   ├── TokenEditorTabs.tsx
    │   │   ├── editor-failure.ts
    │   │   ├── editor-session.ts
    │   │   ├── integer-rgb.ts
    │   │   └── useTokenEditor.ts
    │   ├── TokenValueComparison.tsx
    │   └── WorkbenchInspector.tsx
    ├── WorkbenchNavigation/
    │   ├── NamespaceTree/
    │   │   └── NamespaceTree.tsx
    │   └── WorkbenchNavigation.tsx
    ├── WorkbenchRecovery/
    │   ├── DepartureGuard.tsx
    │   ├── ProjectDiagnostics.tsx
    │   ├── RetentionRecovery.tsx
    │   └── WorkbenchFeedback.tsx [N]
    ├── WorkbenchStatus/
    │   └── WorkbenchStatus.tsx
    ├── helpers/
    │   └── workspace-view.ts [M]
    └── hooks/
        ├── useProjectCommands.ts [M]
        ├── useProjectReadback.ts [M]
        ├── useWorkbenchLayout.ts [M]
        └── useWorkbenchLifecycle.ts [M]
```

## State, call ownership and consumers

| Physical owner | React caller / state owner and lifetime | Consumers and authority |
| --- | --- | --- |
| `app/App.tsx`, `useWorkbenchHost.ts` (retained) | App calls useWorkbenchHost and useProjects unconditionally, before its Projects/Workbench branch. App lifetime retains host ref, backup file ref, preview, departure dialog state and stay ref. | One host; App owns reset and keyed project branch. Restore file refs survive ProjectsScreen unmount, without a second Workbench. |
| `projects/useProjects.ts` (retained, extended coordination) | **App**, not ProjectsScreen, calls useProjects. Existing entries/opened project, name/nameRef, pending, activeMutation, retainedId, unknown, notices/errors stay here for App lifetime. Selected-project backup adds captured ID/revision and pending/error sequencing here, using existing file helper. | ProjectsScreen receives controlled data/actions. Open/Create/Restore and unknown recovery share existing gates; no second catalogue or backup controller. Opened `project` is distinct from selected catalogue entry. |
| `app/App.tsx` Projects page context (new state, no required extra hook) | App owns `projectsView`: selection for any catalogue row keyed by `rowKey`, preserving its exact displayed `id` and last-known status, plus saved browse scroll and remembered narrow surface. Reconcile against refreshed catalogue without discarding unsupported identity/reason; only a currently supported row enables Open/Backup. It survives the Workbench branch; full App reset/reload may clear it. | ProjectsScreen receives context and callbacks. Explicit Open/Create/Restore completion updates selection. Keep missing selection truthful. No saved preferences/database writes; no second selected ID inside ProjectInspector. |
| `projects/hooks/useProjectsLayout.ts` (new) | ProjectsScreen calls it once while mounted: current width mode, visible narrow surface, refs/focus handoff and mounted scroll restoration. Seed/save page context through App callbacks. Dispose listeners on unmount. | List/inspector presentation only. It never opens a project or creates a revision. DOM focus effects must run only for mounted Projects, even though saved context survives it. |
| `projects/ProjectsScreen.tsx`, ProjectList, ProjectListItem, ProjectInspector | Controlled selection and callbacks; local DOM refs only. Inspector has no private project read, writable ownership state or draft. | Exact catalogue name/identity/counts/status, or unavailable reason; separate Open/Download. New ProjectInspector is a real page region, not a wrapper for one button. Create/Restore/retention section remain composed inline with existing form/recovery children. |
| `ApplicationShell`, `ApplicationHeader` (new) | Stateless shared application chrome; page composition supplies slots/display props. | Both Projects and Workbench; frame/main/feedback/status geometry and app identity. No namespace, project list, domain value, host or editor state. This cross-screen structure is distinct from generic `ui/`. |
| `project-backup/RestoreDialog/{RestoreDialog,useBackupRestore}` (retained) | RestoreDialog calls useBackupRestore while App mounts the active preview. Its review, replacement acknowledgement/protection, pending/unknown/reconciliation stay tied to that preview. App retains file ref for restaging. | Projects restore entry only in 011; dialog still uses existing typed host operations and exact revision protection. Never reuse catalogue download success as acknowledgement. |
| `host/backup-file.ts` (retained) / removal of `project-backup/useWorkbenchBackup.ts` | Pure browser file/read/download effects stay in existing host helper. The Workbench-only hook's selected file/preview/restage flow duplicates App's already existing restore path and is removed once entry points move. Its download sequencing moves to useProjects; no new generic backup hook is needed. | useProjects invokes revision-checked download. App retains staging/file/preview ownership; RestoreDialog retains restore authority. No direct IndexedDB or storage policy in components. |
| `workbench/Workbench.tsx` (retained coordinator) | Workbench remains keyed by `project.project.id` in App. It owns selected token/group, view/query, dirty/departure/pending request, editorVersion, completion refs, source callbacks and creation-hook call. All survive responsive modes during that open project session. | Page-specific header, navigation, workspace, inspector, feedback and dialogs receive controlled values. No transfer of mutation or departure authority to chrome/layout. |
| `workbench/hooks/{useProjectReadback,useProjectCommands,useWorkbenchLifecycle}` (moved) | **Workbench** remains caller, with existing call order. Readback owns header/context/rows/inspection/diagnostics/failures; command hook owns busy/unknown/accept/reconciliation; lifecycle owns host pause/resume checks through current inputs. | Workbench composes their values; dependencies/refs remain explicit. Physical hooks folder changes neither worker lifetime nor completion authority. |
| `workbench/hooks/useWorkbenchLayout.ts` (moved, extended) | Workbench calls once: threshold mode, navigation drawer/collapse, inspector collapse, last narrow surface and pane focus/scroll refs. No editor values or command state. | Header/navigation/workspace/inspector use display props and callbacks. Same mounted inspector subtree changes visibility; focus policy yields to active dialogs. No storage preference persistence. |
| `workbench/helpers/workspace-view.ts` (moved) | Pure view/scope/creation-parent mapping; no hook/state. | Workbench creation-parent mapping, NamespaceTree and workspace consumers; nearest shared workbench owner. AllContent membership helper remains private to AllContent. |
| WorkbenchHeader / WorkbenchNavigation / TokenWorkspace (retained) | Stateless/controlled composition apart from existing local rendering details. SelectionBar is new controlled selected-target/draft-indication/reopen rendering. | No backup/restore/Undo controls. Workbench navigation retains existing button semantics. SelectionBar receives selected identity even if query/scope hides its row; it cannot replace the editor target. |
| WorkbenchInspector / TokenEditor / `useTokenEditor.ts` (retained) | **TokenEditor is the sole hook caller**, with key `[selection.id, editorVersion]`. Its raw literal/reference input, tab/mode, display/entry settings, validation/recovery and Apply/Cancel remain the one editor session. | TokenEditorContent, ReferenceFields, ColorEditor, actions/recovery receive bounded values/callbacks. Keep stable React ancestry/key across width, Back, drawer, collapse and filtering; CSS hiding/inertness alone adds no reset reason. Authorized deliberate selection/completion/discard still may reset as today. |
| TokenEditor helpers (retained) | `editor-session` pure session transforms, `editor-failure` text, `integer-rgb` shared by editor/color controls, ColorEditor `visual-range` private range presentation. | Existing component subtree; no generic slider/state abstraction and no numerical policy changes. |
| WorkbenchStatus / WorkbenchRecovery (retained + new WorkbenchFeedback) | WorkbenchFeedback renders existing lifecycle/read-failure/retention feedback from Workbench values/actions, without a new hook. WorkbenchStatus consolidates ordinary applied/draft guidance; Request persistent storage leaves this component. | Visible safety region outside hidden browse/inspect panes, with urgent actions always exposed. Diagnostics/DepartureGuard retain current semantics. Projects retention action calls existing storage-preference adapter from page command composition and reports the result. |
| CreationDialog / useCreationForm / naming-preview (retained) | Workbench calls useCreationForm; form draft/review baseline and refs stay alive through existing modal/cancel rules, not responsive visibility. | Creation/rename dialogs receive existing actions; no parallel phone dialog. Pure naming helper remains private. |
| `token-display/` (retained) | Read-only token-aware components/helpers; ExactSource retains on-demand request/revision invalidation and bounded viewport. No editor-hook dependency. | Used by inspector/workspace as today; pure identity/color/resolution helpers retain exact meanings. |
| `ui/`, `lib/cn.ts`, `styles/global.css`, `host/`, main/config (retained) | Existing control APIs/theme, class-composition and host runtime/validation/worker boundaries. | Generic UI and owned Icon; semantic theme shared by both pages. No new dependency/protocol, filesystem, domain semantics or direct storage access. Tests outside src remain at meaningful existing owners unless implementation demonstrates a necessary move. |

## Lifetime and cross-screen restrictions

App's page branch must not conditionally call useProjects. Retaining the hook file
under `projects/` expresses purpose; calling it inside ProjectsScreen would lose
entry state during project opening. Conversely, retaining Projects view context in
App does not keep the screen's hidden DOM/focus effects mounted.

Workbench's project-ID key remains deliberate. Responsive wrappers must keep one
stable inspector/editor position and key, not reparent it into distinct desktop/
mobile branches. A document-level React portal change or a new ancestor key can
remount despite retaining the same child key, so preservation needs focused runtime
proof later. The proposal does not select a portal or new context/provider.

No current source moves have been made. These refinements replace the ambiguous
screen-local selection lifetime in component map V2 and spell out a concrete
resulting tree. The tree, hook grouping, App context and backup sequencing remain
for final user review with the Draft contract; a material visual departure would
return to the designer/user before renewed analyst review.
