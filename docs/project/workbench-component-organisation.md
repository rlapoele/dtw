# Workbench component organisation

Established for Increment 009 Phase 2, 13 November 2026. Paths below are relative
to `src/presentation/features/workbench/` unless stated otherwise.

| Functional block | Components and local owners |
|---|---|
| Browser | `browser/TokenBrowser`, `ProjectedTokenList`, `AllContent`, `ProjectNavigation`; `browser-view` owns active-view/creation-parent mapping and `all-content` owns membership presentation. |
| Inspector | `inspector/WorkbenchInspector` composes group/token inspection; `EditableTokenInspector` is the single `useTokenEditor` owner. `EditorFields` composes authored/resolved sections; `EditRecovery`, `EditorActions`, `ColorFields`, `ReferenceFields`, `TokenMetadata`, `ResolvedTokenPanel` and `GroupInspector` receive section-specific values/actions. `session` owns pure draft operations; `inspection-tabs` owns tab rendering. |
| Creation | `creation/CreationDialog`, `useCreationForm` and `naming-preview` own the current form, reviewed baseline and deterministic name feedback. |
| Backup | `backup/RestoreDialog`, `useBackupRestore` and `useWorkbenchBackup` own staged restore protection, file/download orchestration and preview state. |
| Recovery | `recovery/RetentionRecovery`, `DepartureGuard` and `ProjectDiagnostics` render retained-outcome/departure/diagnostic feedback. Command and lifecycle authority stays with existing owners. |
| Coordination | `coordination/useProjectCommands`, `useProjectReadback`, `useWorkbenchLifecycle`, `useWorkbenchLayout` and pure `readback` helpers coordinate existing owners and coherent presentation. |
| Color | `color/` keeps existing pure presentation helpers. |

`presentation/app/Workbench` connects owners and composes the screen. Its
`WorkbenchNavigation` file owns the cohesive desktop pane and compact drawer
markup; Workbench supplies navigation content and controls open/expanded state.
Project entry/host hooks remain in `hooks/`; `App` and the host/application/domain
layers retain their existing responsibilities. Generic UI remains under
`presentation/components/ui/`.

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
