# Workbench component organisation

Current Increment 011 implementation ownership, 15 November 2026. The agreed
[owner-first V2 tree](workbench-layout/presentation-organisation-v2.md) supplies the
target structure. Runtime evidence and remaining acceptance belong to the
[increment contract](../increments/011-responsive-shell.md), not this path map.
Paths below are relative to `src/presentation/`.

| Owner | Components, state and lifetime |
| --- | --- |
| Shared application chrome | `components/ApplicationShell/ApplicationShell.tsx` and `components/ApplicationHeader/ApplicationHeader.tsx` render common frame/header slots. They own no project, host, command or editor state. Generic controls remain in `ui/`, with unchanged Base UI callback classes, Icon and Button APIs. |
| App and host | `app/App.tsx` unconditionally calls `app/hooks/useWorkbenchHost.ts` and `projects/hooks/useProjects.ts` before the page branch. `app/hooks/useStoragePersistence.ts` owns the advisory browser persistence query, once-per-session automatic request and explicit retry across page branches; the native calls remain in `adapters/browser/storage-preference.ts`. App retains one host, restore file/preview refs, departure state and Projects selection/scroll/narrow-surface context across Workbench entry. Workbench remains keyed by project identity. |
| Projects | `projects/ProjectsScreen.tsx` composes `components/{ProjectList,ProjectInspector,CreateProjectForm,ProjectRecovery}/` and calls `hooks/useProjectsLayout.ts` only while mounted. `components/StorageProtection/StorageProtection.tsx` renders controlled status and gated conditional retry. ProjectList's private row is `components/ProjectList/components/ProjectListItem.tsx`. Selection is controlled by App, separate from the opened project. Layout owns mounted DOM refs/focus; it never opens or writes a project. |
| Projects commands | `projects/hooks/useProjects.ts`, called by App, retains catalogue/open/create/unknown/retained state and exact name input. Selected backup captures a supported catalogue identity/revision, uses the existing download helper without opening, and refreshes stale facts without automatically retrying. Restore preview, pending, unknown and retained-result gates remain authoritative. Confirmed create acknowledgement notifies App independently of consume/readback/open; Projects only renders the owner’s storage status and retry. |
| Restore | `project-backup/components/RestoreDialog/RestoreDialog.tsx` calls `hooks/useBackupRestore.ts` within that owner. App retains file/restaging references; the dialog retains revision protection, backup acknowledgement, staged/unknown recovery and completion. Confirmed retained restore notifies App at acceptance, separately from ordinary Open local. The former Workbench-only backup hook is removed. `host/backup-file.ts` still owns file/download effects. |
| Workbench coordination | `Workbench/Workbench.tsx` retains selection, view/query, dirty/departure, editor version and completion authority. It calls `hooks/{useProjectReadback,useProjectCommands,useWorkbenchLifecycle,useWorkbenchLayout}.ts` and CreationDialog's hook at the same lifetime. `helpers/workspace-view.ts` owns view/creation-parent mapping. |
| Workbench shell | `Workbench/components/{WorkbenchHeader,WorkbenchStatus,WorkbenchNavigation}/` render controlled project context, compact status/disclosure and navigation. Only Projects is a project-management control. Navigation's private tree is `WorkbenchNavigation/components/NamespaceTree/NamespaceTree.tsx`. |
| Workspace | `Workbench/components/TokenWorkspace/TokenWorkspace.tsx` composes `components/{WorkspaceToolbar,TokenTable,AllContent,SelectionBar}/`. AllContent's private helper is `AllContent/helpers/all-content.ts`. Token rows retain button semantics; narrow SelectionBar reopens the existing selected session even outside the query/scope. |
| Recovery | `Workbench/components/WorkbenchRecovery/components/{WorkbenchFeedback,RetentionRecovery,DepartureGuard,ProjectDiagnostics}.tsx`. Feedback places safety/recovery outside hidden browse/inspect panes. Command and departure authority remain in Workbench. |
| Creation | `Workbench/components/CreationDialog/CreationDialog.tsx`, `hooks/useCreationForm.ts`, `helpers/naming-preview.ts`. Workbench remains the hook caller; raw form and reviewed-baseline state do not depend on responsive surfaces. |
| Inspector | `Workbench/components/WorkbenchInspector/WorkbenchInspector.tsx` retains the stable shell/fallback. Private `components/InspectorHeader.tsx`, `TokenValueComparison.tsx` and `GroupInspector/GroupInspector.tsx` retain read-only rendering. |
| Token editor | `Workbench/components/WorkbenchInspector/components/TokenEditor/TokenEditor.tsx` is the sole `hooks/useTokenEditor.ts` caller. Its key remains `[selection.id, editorVersion]`. Private rendering stays under `components/`; pure session transforms under `state/editor-session.ts`; shared editor helpers under `helpers/{integer-rgb,editor-failure}.ts`. ColorEditor owns `components/ColorEditor/helpers/visual-range.ts`. |
| Shared token display | `token-display/components/{AuthoredValue,ExactSource,ResolvedTokenPanel,TokenMetadata,TokenSwatch}.tsx`; pure color/identity helpers in `token-display/helpers/`. ExactSource retains lazy revision-scoped source requests and bounded local scrolling. The legacy TokenList remains test support only. |

Responsive presentation changes visibility at 1120/880 CSS px without reparenting
or cloning the editor. Back/reopen, drawer and collapse add no session reset reason.
The same browse and inspector DOM nodes retain local scroll; App retains Projects
browse position across its page branch. Session input remains page-only.

The [Increment 011 move map](../../output/increment-011-implementation/moves.json)
records physical regrouping. Historical Increment 009/010 move maps and frozen
research/prototypes keep their original paths and evidence; no compatibility
forwarders or empty future folders are introduced.

Focused CSS exceptions remain in `styles/global.css`: page/pane and modal geometry,
responsive row-detail suppression, native range/checkerboard specimens and exact
source scrolling. Theme roles remain the single source; ordinary JSX uses named
Tailwind utilities. No dependency, worker operation, schema or domain boundary is
introduced by this grouping.
