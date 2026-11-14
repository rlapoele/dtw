# Workbench component organisation

Current ownership after the Increment 010 shared-root/project-entry and shell/workspace extractions, 15 November 2026.
This is a partial migration toward the endorsed component-oriented direction.
Paths in the first table are relative to `src/presentation/`.

| Functional block | Components and local owners |
|---|---|
| Shared controls | `ui/{badge,button,dialog-content,field,icon,input,select}` retain their existing APIs and markup. |
| Project entry | `projects/ProjectsScreen` composes `ProjectList/ProjectList`, `ProjectListItem`, `CreateProjectForm/CreateProjectForm` and `ProjectRecovery/ProjectRecovery` with controlled values/actions. `projects/useProjects` still runs unconditionally in App and owns entry commands and readback. |
| Host lifetime | `app/useWorkbenchHost` retains the one-host lifetime and explicit reset. App retains refs, preview/departure state, event orchestration and dialog configuration. |
| Backup | `project-backup/RestoreDialog/RestoreDialog` is the cross-screen entry. Its colocated `useBackupRestore` owns staged protection; `project-backup/useWorkbenchBackup` retains file/download/preview coordination at its existing Workbench call site. |

The shell/workspace paths below are relative to `src/presentation/`.

| Functional block | Components and local owners |
|---|---|
| Shell and coordination | `workbench/Workbench` composes the screen and retains selection, view/query, dirty/departure state, refs, hook call order and command completion authority. Colocated `useProjectCommands`, `useProjectReadback`, `useWorkbenchLifecycle` and `useWorkbenchLayout` retain their implementations/call ownership. `readback` retains `resolvedColor` and `failureText`. |
| Header and status | `workbench/WorkbenchHeader/WorkbenchHeader` retains project actions; `WorkbenchStatus/WorkbenchStatus` renders only the existing footer through display props and a persistent-storage request callback. The session notice remains inline in Workbench. |
| Navigation | `workbench/WorkbenchNavigation/WorkbenchNavigation` keeps cohesive NavigationPane/NavigationDrawer exports; `NamespaceTree/NamespaceTree` renders the existing namespace buttons without new tree semantics. Workbench supplies content and controls open/expanded state. |
| Workspace | `workbench/TokenWorkspace/TokenWorkspace` composes `WorkspaceToolbar/WorkspaceToolbar`, `TokenTable/TokenTable` and `AllContent/AllContent`. TokenTable retains button/list semantics; the memoised MembershipBlock remains local to AllContent. `AllContent/all-content` owns membership presentation. `workbench/workspace-view` owns shared active-view/creation-parent mapping. |
| Creation | `workbench/CreationDialog/{CreationDialog,useCreationForm,naming-preview}` retain form rendering, reviewed baseline and deterministic name feedback. Workbench retains the hook call and inline changed-baseline sections. |
| Recovery | `workbench/WorkbenchRecovery/{RetentionRecovery,DepartureGuard,ProjectDiagnostics}` render existing feedback. Workbench retains command/lifecycle authority and inline lifecycle/read-failure sections. |
| Shared identity labels | `token-display/identity-labels` owns pure `pathLabel`, `identityLabels` and `namespaceEntryDetails`; consumers import directly without a forwarding module. |

The following owners deliberately remain under `src/presentation/features/workbench/`.

| Functional block | Components and local owners |
|---|---|
| Inspector | `inspector/WorkbenchInspector` composes group/token inspection; `EditableTokenInspector` is the single `useTokenEditor` owner. `EditorFields` composes authored/resolved sections; `EditRecovery`, `EditorActions`, `ColorFields`, `ReferenceFields`, `TokenMetadata`, `ResolvedTokenPanel` and `GroupInspector` receive section-specific values/actions. `session` owns pure draft operations; `inspection-tabs` owns tab rendering. |
| Color | `color/` keeps existing pure presentation helpers, including the integer-rgb dependency shared by session and ColorFields. |
| Value rendering | Cross-block leaves `components/{ExactSource,AuthoredValue,swatch}` remain here. |
| Alternate list | `browser/TokenList` remains exercised by identity-presentation regression tests; it is not the retained screen renderer. |

App keeps the Workbench project-ID key. Workbench keeps the existing editor key,
placement and one session owner. Generic UI remains under `presentation/ui/`;
there are no compatibility forwarding modules, empty future folders or new
state/controller abstractions. The unused standalone Editor forwarding entry was
removed in Increment 009 Phase 2 after migrating callers to EditableTokenInspector.

`ReferenceFields` receives a reference identity, labeled choices, missing-target
and disabled state, and a reference-only callback. The editor owner merges that
change into its draft. Recovery and action sections receive their own display
values/actions; they cannot replace the editor session or commit commands.
The editor key, session lifetime, completion authority and retained-command
workflow are unchanged. The approved horizontal color components, separate Alpha,
sliders above exact inputs and circular thumbs retain their existing markup/CSS.

The mechanical [move map](../../output/increment-009-phase2/moves.json) records old
and new source paths for review. Frozen prototypes, research and old evidence keep
their recorded source references and hashes; replay them at their recorded Git
baseline rather than adding current-tree compatibility wrappers. This organisation
change does not restart their qualification campaigns.

## Future layout decomposition

The [15 November 2026 annotated mockups and component map
V1](./workbench-layout/component-map-v1.md) propose how the endorsed future visual
direction could reuse and extend these owners. That guide distinguishes existing
files from candidate additions; it does not replace this current organisation or
authorize implementation.

The subsequent [presentation organisation proposal
V1](./workbench-layout/presentation-organisation-proposal-v1.md) is the
user-endorsed future folder direction, removing `features/workbench` in favor of
named component subtrees and colocated hooks/helpers. It replaces the earlier
decomposition's proposed paths; this document owns the current partial migration. The shell/workspace slice has now migrated the named existing owners; inspector/display migration and replacement-interface capabilities remain outside the delivered scope.


The Increment 010 [move map](../../output/increment-010-first-slice/moves.json)
records the shared-root moves and App extractions. That first slice created no
later-roadmap folders or components. Historical evidence/prototypes retain their
recorded paths.

The Increment 010 [shell/workspace move map](../../output/increment-010-shell-workspace/moves.json)
records the second-slice moves and extractions. Historical evidence/prototypes
retain their recorded paths. Source and focused tests establish extraction
properties; native focus/geometry acceptance remains subject to the slice report.
