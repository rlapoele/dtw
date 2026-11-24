# Workbench component organisation

Current implementation ownership through the Increment 013 shared-layout extraction,
including the App, screen, browser-host and token-display placement refinements of 16 November 2026.
012 implementation and independent review are finished; acceptance gaps remain
in its increment record. This map records source ownership, not acceptance. The agreed
[owner-first V2 tree](workbench-layout/presentation-organisation-v2.md) supplies the
target structure, with the later placement refinements recorded below. Runtime evidence and remaining acceptance belong to the
[increment contract](../increments/011-responsive-shell.md), not this path map.
Paths below are relative to `src/presentation/` unless explicitly rooted at `src/`.

| Owner | Components, state and lifetime |
| --- | --- |
| Shared workbench layout | `App/components/WorkbenchLayout/WorkbenchLayout.tsx` reuses ApplicationShell and composes header, beforeBody, navigation/workspace/inspector, afterBody and overlays without wrapping the supplied pane roots. Its controlled geometry preserves the existing two/three-column modes. `hooks/useWorkbenchViewport.ts` observes 1120/880 thresholds with cleanup and no initial resize-policy callback; screen hooks retain focus, modal, surface and navigation policy. Projects reacts only to 880 transitions. |
| Shared application chrome | `App/components/ApplicationShell/ApplicationShell.tsx` and `App/components/ApplicationHeader/ApplicationHeader.tsx` render common frame/header slots. They own no project, host, command or editor state. Generic controls remain in `ui/`, with unchanged Base UI callback classes, Icon and Button APIs. |
| App and host | `App/App.tsx` unconditionally calls `App/hooks/useWorkbenchHost.ts` and `App/components/ProjectsWorkbench/hooks/useProjects.ts` before the page branch. `App/hooks/useStoragePersistence.ts` owns the advisory browser persistence query, once-per-session automatic request and explicit retry across page branches; the native calls remain in `adapters/browser/storage-preference.ts`. App retains one host, restore file/preview refs, departure state and Projects selection/scroll/narrow-surface context across Workbench entry. Workbench remains keyed by project identity. |
| Projects | `App/components/ProjectsWorkbench/ProjectsWorkbench.tsx` composes `components/{ProjectList,ProjectInspector,CreateProjectDialog,ProjectRecovery}/` and calls `hooks/useProjectsLayout.ts` only while mounted. `components/StorageProtection/StorageProtection.tsx` renders controlled status and gated conditional retry. CreateProjectDialog owns its private form; `RestoreSelectionDialog.tsx` hands file selection to the retained restore workflow. `helpers/project-catalogue.ts` serves browse filtering and row labels. Search and modal visibility remain App-owned. ProjectList's private row is `components/ProjectList/components/ProjectListItem.tsx`. Selection is controlled by App, separate from the opened project. Layout owns mounted DOM refs/focus; it never opens or writes a project. |
| Projects commands | `App/components/ProjectsWorkbench/hooks/useProjects.ts`, called by App, retains catalogue/open/create/unknown/retained state and exact name input. Selected backup captures a supported catalogue identity/revision, uses the existing download helper without opening, and refreshes stale facts without automatically retrying. Restore preview, pending, unknown and retained-result gates remain authoritative. Confirmed create acknowledgement notifies App independently of consume/readback/open; Projects only renders the owner’s storage status and retry. |
| Restore | `App/components/ProjectsWorkbench/components/RestoreDialog/RestoreDialog.tsx` calls `hooks/useBackupRestore.ts` within that owner. App retains file/restaging references; the dialog retains revision protection, backup acknowledgement, staged/unknown recovery and completion. Confirmed retained restore notifies App at acceptance, separately from ordinary Open local. The former Workbench-only backup hook is removed. `src/hosts/browser/backup-file.ts` still owns file/download effects. |
| Workbench coordination | `App/components/TokensWorkbench/TokensWorkbench.tsx` retains selection, view/query, dirty/departure, editor version and completion authority. It calls `hooks/{useProjectReadback,useProjectCommands,useProjectLifecycle,useTokensLayout}.ts` and AuthoringDialog's hook at the same lifetime. `helpers/browse-view.ts` owns view/creation-parent mapping. `hooks/useHistoryInteraction.ts`, called by Workbench, owns captured history intent, draft guard coordination, surviving-ID reconciliation and focus timing; `helpers/history-shortcuts.ts` owns pure shortcut eligibility. It supplies no snapshots or alternate command writer. |
| Workbench shell | `App/components/TokensWorkbench/components/{TokensHeader,TokensStatusBar,TokenNavigation}/` render controlled project context, compact status/disclosure and navigation. Header-private `App/components/TokensWorkbench/components/TokensHeader/components/HistoryControls.tsx` renders controlled history availability/actions and descriptions; labels switch at640 CSS px independently of pane modes. Only Projects is a project-management control. Navigation's private `TokenNavigation/components/NavigationContent.tsx` composes Library, Tokens and Groups; `TypeBranch.tsx` owns recursive disclosures. Shared workbench helpers own typed scopes, navigation projections, ordering and type icons. |
| Workspace | `App/components/TokensWorkbench/components/TokenWorkspace/TokenWorkspace.tsx` composes `components/{WorkspaceToolbar,TokenTable,NamespaceInventory,SelectionBar}/`. NamespaceInventory's private helper is `NamespaceInventory/helpers/namespace-inventory.ts`. Token rows retain button semantics; narrow SelectionBar reopens the existing selected session even outside the query/scope. |
| Feedback and recovery | `App/components/TokensWorkbench/components/{FeedbackRegion,RetentionRecovery,DepartureGuard,ProjectDiagnostics}.tsx`. Feedback places safety/recovery outside hidden browse/inspect panes. Command and departure authority remain in Workbench. |
| Authoring | `App/components/TokensWorkbench/components/AuthoringDialog/AuthoringDialog.tsx`, `hooks/useAuthoringForm.ts`, `helpers/naming-preview.ts`. Workbench remains the hook caller; raw form and reviewed-baseline state do not depend on responsive surfaces. |
| Inspector | `App/components/TokensWorkbench/components/SelectionInspector/SelectionInspector.tsx` retains the stable shell/fallback. Shared `TokensWorkbench/components/InspectorHeader.tsx` supplies the regular and ramp header; private `components/GroupInspector/GroupInspector.tsx` retains group rendering. |
| Token editor | `App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/TokenEditor.tsx` is the sole `hooks/useTokenEditor.ts` caller. Its key remains `[selection.id, editorVersion]`. Private rendering stays under `components/`; pure session transforms under `state/editor-session.ts`; shared editor helpers under `helpers/{integer-rgb,editor-failure,resolved-color}.ts`; Shared `TokensWorkbench/components/TokenValueComparison.tsx` compares applied/draft values. ColorEditor owns `components/ColorEditor/helpers/visual-range.ts`. |
| Token display | Within `App/components/TokensWorkbench/`: `components/{AuthoredValue,TokenSwatch}.tsx` serve workspace and inspector; color/identity/source helpers live in `helpers/`. `components/{ExactSource,TokenMetadata,ResolvedTokenPanel,TokenEditorTabs,InspectorHeader,InspectorHeading,InspectorToggle,InspectorSection,TokenValueComparison}.tsx` serve ordinary and ramp inspection (ExactSource also serves groups). Ramp-private `RampWorkbench/components/RampStepInspection.tsx` adapts saved snapshot projections without taking ownership of drafts or writes. ExactSource retains lazy revision-scoped source requests and bounded local scrolling. The legacy TokenList remains test support only. |

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
    ├── ProjectsWorkbench/
    │   ├── ProjectsWorkbench.tsx
    │   ├── components/
    │   └── hooks/
    ├── TokensWorkbench/
    │   ├── TokensWorkbench.tsx
    │   ├── components/
    │   ├── helpers/
    │   └── hooks/
    └── WorkbenchLayout/
        ├── WorkbenchLayout.tsx
        └── hooks/useWorkbenchViewport.ts
```

Supporting folders stay with their existing owners. App still calls
`App/components/ProjectsWorkbench/hooks/useProjects.ts` unconditionally and instantiates
RestoreDialog; Workbench and TokenEditor retain their hook callers, keys and
lifetimes. WorkbenchLayout now supplies the shared React frame; its supplied pane roots retain a fixed position across responsive modes. Shared token display, UI,
styles and class utilities remain at the presentation root; browser execution
remains under `src/hosts/browser/`. Earlier dated placement records above describe
the preceding organisation; the ownership table records current paths.


## Shared layout extraction — Increment 013

ProjectsWorkbench and TokensWorkbench both compose WorkbenchLayout. ApplicationShell
remains the frame owner used by that shared layout. Pane semantics, scroll refs,
Projects wide 28px padding and token wide 24px padding stay with their existing
roots/styles. Feedback remains before the token body and after the Projects body;
status/dialog ordering and the skip link before the token header are preserved.
App still calls useProjects unconditionally; the project and TokenEditor keys and
screen-owned command/session authority are unchanged. Review and actual verification
limits belong to the [013 contract](../increments/013-shared-workbench-layout.md).


## Token display ownership — 16 November 2026

All production consumers of the former presentation-level `token-display/` folder
are inside TokensWorkbench. The user requested distributing its ten files to their
actual owners under `App/components/TokensWorkbench/`:

- `components/{AuthoredValue,TokenSwatch}.tsx` are shared by workspace and inspector.
- `helpers/{authored-color,color-preview,resolved-color,identity-labels,read-exact-source}.ts`
  support multiple branches or the screen coordinator.
- `components/WorkbenchInspector/components/ExactSource.tsx` is shared by group and
  token inspection.
- `components/WorkbenchInspector/components/TokenEditor/components/{TokenMetadata,ResolvedTokenPanel}.tsx`
  serve only the token editor.

The empty `token-display/` wrapper is removed. Tests and test-support imports follow
these paths. This is a path/import change: authored values, preview behavior,
resolution displays, source retrieval and mounted component/session behavior are
unchanged. Earlier dated placement records above preserve their historical paths.


## Plural workbench naming — 16 November 2026

The user requested `TokensWorkbench/` with entry file `TokensWorkbench.tsx` and
exported component TokensWorkbench, matching ProjectsWorkbench. All owned files
remain within the renamed subtree; consumers and current documentation follow
the plural name. This is a name/path/import change with no behavior or state
ownership change. Earlier increment evidence retains the original singular name.


## Purpose-based component and hook names — 16 November 2026

The user approved removing redundant Workbench names from the TokensWorkbench
children. The current ownership table uses the resulting paths; earlier dated
records above and increment review evidence retain their historical names.

| Previous name | Current name |
| --- | --- |
| WorkbenchHeader | TokensHeader |
| WorkbenchStatus | TokensStatusBar |
| WorkbenchInspector | SelectionInspector |
| WorkbenchNavigation | NamespaceNavigation |
| NavigationPane / NavigationDrawer | NamespaceNavigationPane / NamespaceNavigationDrawer |
| WorkbenchFeedback | FeedbackRegion |
| useWorkbenchLayout | useTokensLayout |
| useWorkbenchHistory | useHistoryInteraction |
| useWorkbenchLifecycle | useProjectLifecycle |
| CreationDialog / useCreationForm | AuthoringDialog / useAuthoringForm |

Component folders and entry files follow their renamed components; hook files
follow their exports. NamespaceNavigation continues exporting both pane/drawer
components. The WorkbenchRecovery grouping is removed: FeedbackRegion,
RetentionRecovery, DepartureGuard and ProjectDiagnostics are direct files under
TokensWorkbench/components. No new recovery coordinator is introduced.

SelectionInspector handles token and group selection; AuthoringDialog handles
creation and group rename. useHistoryInteraction coordinates UI requests/focus,
while application history and useProjectCommands retain their existing authority.
useProjectLifecycle retains the opened project's suspend/resume/departure policy.
This maintenance changes names/paths/imports only; CSS classes, rendered hierarchy,
keys, state/session lifetimes, command behavior and storage remain unchanged.


## Editor ownership and browse naming — 16 November 2026

The user approved two ownership refinements within TokensWorkbench:

- `TokenValueComparison.tsx` now lives in
  `components/SelectionInspector/components/TokenEditor/components/` because only
  TokenEditorContent renders it.
- `resolved-color.ts` now lives in that editor's `helpers/`; its production consumers
  are useTokenEditor and ResolvedTokenPanel. The legacy test-support consumer uses
  the new path without broadening production ownership.

`TokenWorkspace/components/NamespaceInventory/NamespaceInventory.tsx` replaces
AllContent; its private helper is `helpers/namespace-inventory.ts`. It inventories
tokens and namespace groups. `helpers/browse-view.ts` replaces workspace-view and
exports TokenBrowseView in place of BrowserView. Matching imports and the inventory
test filename follow these names. Visible labels, onAllContent callbacks and
`all-content` view discriminator values remain unchanged. Earlier dated records
above retain their historical paths. No rendered hierarchy, session, command,
source-data or preview behavior changes.

## Hierarchical navigation ownership — 18 November 2026

Increment 018 renames NamespaceNavigation to TokenNavigation (pane/drawer exports)
and replaces NamespaceTree with private NavigationContent and TypeBranch. These
names cover Library, typed/layered token scopes and cross-type namespace groups.
TokensWorkbench retains browse and disclosure state; pane and drawer share it.
`helpers/{browse-view,token-navigation,token-list-order,token-type-presentation}.ts`
serve navigation and workspace consumers at their nearest common workbench owner.
Earlier dated names above describe historical organization.
