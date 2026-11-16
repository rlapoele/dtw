# Workbench component organisation

Current implementation ownership through Increment 012, with the user-requested
App, Projects and browser-host folder reorganisations of 16 November 2026.
012 implementation and independent review are finished; acceptance gaps remain
in its increment record. This map records source ownership, not acceptance. The agreed
[owner-first V2 tree](workbench-layout/presentation-organisation-v2.md) supplies the
target structure, with the later placement refinements recorded below. Runtime evidence and remaining acceptance belong to the
[increment contract](../increments/011-responsive-shell.md), not this path map.
Paths below are relative to `src/presentation/` unless explicitly rooted at `src/`.

| Owner | Components, state and lifetime |
| --- | --- |
| Shared application chrome | `App/components/ApplicationShell/ApplicationShell.tsx` and `App/components/ApplicationHeader/ApplicationHeader.tsx` render common frame/header slots. They own no project, host, command or editor state. Generic controls remain in `ui/`, with unchanged Base UI callback classes, Icon and Button APIs. |
| App and host | `App/App.tsx` unconditionally calls `App/hooks/useWorkbenchHost.ts` and `App/components/Projects/hooks/useProjects.ts` before the page branch. `App/hooks/useStoragePersistence.ts` owns the advisory browser persistence query, once-per-session automatic request and explicit retry across page branches; the native calls remain in `adapters/browser/storage-preference.ts`. App retains one host, restore file/preview refs, departure state and Projects selection/scroll/narrow-surface context across Workbench entry. Workbench remains keyed by project identity. |
| Projects | `App/components/Projects/Projects.tsx` composes `components/{ProjectList,ProjectInspector,CreateProjectForm,ProjectRecovery}/` and calls `hooks/useProjectsLayout.ts` only while mounted. `components/StorageProtection/StorageProtection.tsx` renders controlled status and gated conditional retry. ProjectList's private row is `components/ProjectList/components/ProjectListItem.tsx`. Selection is controlled by App, separate from the opened project. Layout owns mounted DOM refs/focus; it never opens or writes a project. |
| Projects commands | `App/components/Projects/hooks/useProjects.ts`, called by App, retains catalogue/open/create/unknown/retained state and exact name input. Selected backup captures a supported catalogue identity/revision, uses the existing download helper without opening, and refreshes stale facts without automatically retrying. Restore preview, pending, unknown and retained-result gates remain authoritative. Confirmed create acknowledgement notifies App independently of consume/readback/open; Projects only renders the owner’s storage status and retry. |
| Restore | `App/components/Projects/components/RestoreDialog/RestoreDialog.tsx` calls `hooks/useBackupRestore.ts` within that owner. App retains file/restaging references; the dialog retains revision protection, backup acknowledgement, staged/unknown recovery and completion. Confirmed retained restore notifies App at acceptance, separately from ordinary Open local. The former Workbench-only backup hook is removed. `src/hosts/browser/backup-file.ts` still owns file/download effects. |
| Workbench coordination | `App/components/Workbench/Workbench.tsx` retains selection, view/query, dirty/departure, editor version and completion authority. It calls `hooks/{useProjectReadback,useProjectCommands,useWorkbenchLifecycle,useWorkbenchLayout}.ts` and CreationDialog's hook at the same lifetime. `helpers/workspace-view.ts` owns view/creation-parent mapping. `hooks/useWorkbenchHistory.ts`, called by Workbench, owns captured history intent, draft guard coordination, surviving-ID reconciliation and focus timing; `helpers/history-shortcuts.ts` owns pure shortcut eligibility. It supplies no snapshots or alternate command writer. |
| Workbench shell | `App/components/Workbench/components/{WorkbenchHeader,WorkbenchStatus,WorkbenchNavigation}/` render controlled project context, compact status/disclosure and navigation. Header-private `App/components/Workbench/components/WorkbenchHeader/components/HistoryControls.tsx` renders controlled history availability/actions and descriptions; labels switch at640 CSS px independently of pane modes. Only Projects is a project-management control. Navigation's private tree is `WorkbenchNavigation/components/NamespaceTree/NamespaceTree.tsx`. |
| Workspace | `App/components/Workbench/components/TokenWorkspace/TokenWorkspace.tsx` composes `components/{WorkspaceToolbar,TokenTable,AllContent,SelectionBar}/`. AllContent's private helper is `AllContent/helpers/all-content.ts`. Token rows retain button semantics; narrow SelectionBar reopens the existing selected session even outside the query/scope. |
| Recovery | `App/components/Workbench/components/WorkbenchRecovery/components/{WorkbenchFeedback,RetentionRecovery,DepartureGuard,ProjectDiagnostics}.tsx`. Feedback places safety/recovery outside hidden browse/inspect panes. Command and departure authority remain in Workbench. |
| Creation | `App/components/Workbench/components/CreationDialog/CreationDialog.tsx`, `hooks/useCreationForm.ts`, `helpers/naming-preview.ts`. Workbench remains the hook caller; raw form and reviewed-baseline state do not depend on responsive surfaces. |
| Inspector | `App/components/Workbench/components/WorkbenchInspector/WorkbenchInspector.tsx` retains the stable shell/fallback. Private `components/InspectorHeader.tsx`, `TokenValueComparison.tsx` and `GroupInspector/GroupInspector.tsx` retain read-only rendering. |
| Token editor | `App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/TokenEditor.tsx` is the sole `hooks/useTokenEditor.ts` caller. Its key remains `[selection.id, editorVersion]`. Private rendering stays under `components/`; pure session transforms under `state/editor-session.ts`; shared editor helpers under `helpers/{integer-rgb,editor-failure}.ts`. ColorEditor owns `components/ColorEditor/helpers/visual-range.ts`. |
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

## Increment 012 application boundary

`src/application/retention/history.ts` owns bounded session snapshots and history
cursor, action identity/labels, baseline invalidation and payload accounting. The
retention service owns revision-checked transitions and receipt reconciliation.
The worker hosts that application state and publishes bounded availability; it
ends the session explicitly on departure even when the worker survives. Existing
`useProjectCommands` remains the sole renderer command/recovery gate. TokenEditor
remains the sole editor-session caller; no applied-history stack lives in it.
Internal record v2 receipts are separate from authored format and backup envelope.
See the [012 contract](../increments/012-session-undo-redo.md) for acceptance/evidence.

## Browser-feedback placement refinement — 15 November 2026

`TokenEditorContent` places `TokenValueComparison` in the token heading alongside
name/path, wrapping at narrow width; `InspectorHeader` retains generic pane/status/
collapse responsibilities. Both consume the sole editor session. `TokenTable` owns
its private `helpers/hex-preview.ts` for supplemental row display, using existing
domain calculation without changing authored values or the AuthoredValue column.
Shared Button adds the needed history geometry variant; existing tablet touch rules
and Projects geometry remain. Evidence/limits belong to the
[012 feedback report](../increments/012-session-undo-redo.md#browser-feedback-completion-and-review--15-november-2026).

## App placement refinement — 16 November 2026

The user requested `App/` casing to match its named component owner and moved
ApplicationHeader and ApplicationShell under `App/components/`. Both screens
continue to consume these stateless application components. Generic controls
remain in `ui/`; hook callers, state lifetimes and rendered ancestry are unchanged.


## Browser host placement — 16 November 2026

Worker entry/runtime/client, protocol and its validation, and backup-file effects now
live under `src/hosts/browser/`, outside presentation. Source-display assembly lives
in `token-display/helpers/read-exact-source.ts`. The [architecture decision](architecture.md#browser-host-placement--16-november-2026)
records dependencies and preserved coupling. UI hook callers, session lifetimes,
worker messaging/recovery and retained behavior are unchanged.


## Projects placement refinement — 16 November 2026

The user requested `Projects/Projects.tsx` in place of `projects/ProjectsScreen.tsx`
and moved RestoreDialog and its hook from `project-backup/` into
`Projects/components/RestoreDialog/`. The obsolete project-backup wrapper is removed.
App still calls useProjects and instantiates RestoreDialog through the Projects
restoreDialog prop; file/preview refs and restore completion sequencing stay in App.
This changes names, paths and imports without moving state or changing behavior.


## App screen ownership — 16 November 2026

The user requested moving both screen subtrees under `App/components/`:

```text
src/presentation/App/
├── App.tsx
├── hooks/
└── components/
    ├── ApplicationHeader/
    ├── ApplicationShell/
    ├── Projects/
    │   ├── Projects.tsx
    │   ├── components/
    │   └── hooks/
    └── Workbench/
        ├── Workbench.tsx
        ├── components/
        ├── helpers/
        └── hooks/
```

Supporting folders stay with their existing owners. App still calls
`App/components/Projects/hooks/useProjects.ts` unconditionally and instantiates
RestoreDialog; Workbench and TokenEditor retain their hook callers, keys and
lifetimes. Physical nesting adds no React wrapper. Shared token display, UI,
styles and class utilities remain at the presentation root; browser execution
remains under `src/hosts/browser/`. Earlier dated placement records above describe
the preceding organisation; the ownership table records current paths.
