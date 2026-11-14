# Workbench component organisation

Current ownership after the Increment 010 first-slice extraction, 15 November 2026.
This is a partial migration toward the endorsed component-oriented direction.
Paths in the first table are relative to `src/presentation/`.

| Functional block | Components and local owners |
|---|---|
| Shared controls | `ui/{badge,button,dialog-content,field,icon,input,select}` retain their existing APIs and markup. |
| Project entry | `projects/ProjectsScreen` composes `ProjectList/ProjectList`, `ProjectListItem`, `CreateProjectForm/CreateProjectForm` and `ProjectRecovery/ProjectRecovery` with controlled values/actions. `projects/useProjects` still runs unconditionally in App and owns entry commands and readback. |
| Host lifetime | `app/useWorkbenchHost` retains the one-host lifetime and explicit reset. App retains refs, preview/departure state, event orchestration and dialog configuration. |
| Backup | `project-backup/RestoreDialog/RestoreDialog` is the cross-screen entry. Its colocated `useBackupRestore` owns staged protection; `project-backup/useWorkbenchBackup` retains file/download/preview coordination at its existing Workbench call site. |

The remaining workbench paths below are relative to
`src/presentation/features/workbench/`; their ownership has not yet migrated.

| Functional block | Components and local owners |
|---|---|
| Browser | `browser/TokenBrowser`, `ProjectedTokenList`, `AllContent`, `ProjectNavigation`; `browser-view` owns active-view/creation-parent mapping and `all-content` owns membership presentation. |
| Inspector | `inspector/WorkbenchInspector` composes group/token inspection; `EditableTokenInspector` is the single `useTokenEditor` owner. `EditorFields` composes authored/resolved sections; `EditRecovery`, `EditorActions`, `ColorFields`, `ReferenceFields`, `TokenMetadata`, `ResolvedTokenPanel` and `GroupInspector` receive section-specific values/actions. `session` owns pure draft operations; `inspection-tabs` owns tab rendering. |
| Creation | `creation/CreationDialog`, `useCreationForm` and `naming-preview` own the current form, reviewed baseline and deterministic name feedback. |
| Recovery | `recovery/RetentionRecovery`, `DepartureGuard` and `ProjectDiagnostics` render retained-outcome/departure/diagnostic feedback. Command and lifecycle authority stays with existing owners. |
| Coordination | `coordination/useProjectCommands`, `useProjectReadback`, `useWorkbenchLifecycle`, `useWorkbenchLayout` and pure `readback` helpers coordinate existing owners and coherent presentation. |
| Color | `color/` keeps existing pure presentation helpers. |

`presentation/app/Workbench` connects owners and composes the screen. Its
`WorkbenchNavigation` file owns the cohesive desktop pane and compact drawer
markup; Workbench supplies navigation content and controls open/expanded state.
App and the host/application/domain layers retain their existing responsibilities.
Generic UI now lives under `presentation/ui/`; the old shared-control, backup and
hook paths have no forwarding wrappers. App keeps the workbench project-ID key
and the single editor owner remains unchanged.

Cross-block leaf renderers `ExactSource`, `AuthoredValue` and `swatch` remain in
`components/`, alongside screen-shell `WorkbenchHeader`. There is no new shared
catch-all. `browser/TokenList` remains an alternate renderer used by existing
identity-presentation regression tests; it is not the retained screen's list.
The unused standalone `Editor` forwarding entry was removed after migrating its
test callers to the actual `EditableTokenInspector` owner.

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
decomposition's proposed paths; this document owns the current partial migration. Later shell/workspace and
inspector/display slices remain outside the first-slice implementation.


The Increment 010 [move map](../../output/increment-010-first-slice/moves.json)
records the shared-root moves and App extractions. No later roadmap folders or
components were created. Historical evidence/prototypes retain their recorded paths.
