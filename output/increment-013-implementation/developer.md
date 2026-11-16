# Increment 013 developer evidence

Implementation baseline: `274fcf5a502998ca760cee3551bc7c754ab91055`.
Scope: agreed 013 contract; analyst contract unchanged by developer.

## Delivered structure

Projects and token authoring are named ProjectsWorkbench and TokenWorkbench,
with owned subtrees moved and import paths updated. WorkbenchLayout reuses
ApplicationShell and accepts explicit ordered slots. It renders supplied semantic
pane roots directly; the navigation child position remains fixed while compact
mode hides it, preserving the workspace/inspector and sole keyed editor position.
The existing geometry class strings and all CSS measurements remain unchanged.
A supplied navigation slot selects the existing three-column geometry; omission
selects the existing Projects two-column geometry. No dependencies were added.

Shared useWorkbenchViewport owns exact 1119/879 max-width media observations,
initial width state and listener cleanup. It invokes no resize policy at mount.
Screen hooks retain current focus/modal/surface/navigation decisions; Projects
responds only to the narrow threshold. App still calls useProjects unconditionally
and owns host/catalogue/page and restore orchestration. TokenEditor key is unchanged.

README, current ownership, architecture and presentation conventions describe the
result; the historical proposal has a later refinement note. Coordinator owns the
status/completion handoff after independent review.

## Checks and limits

- Focused layout-slot-order and viewport-observer cleanup/current-callback tests:
  2 passed. Initial preimplementation run failed because the module did not yet exist.
- Initial broader run exposed two stale test root-export references (Projects and
  Workbench), corrected together as routine test adaptation to the authorized rename. No runner,
  fixture or browser-tooling repair was needed.
- Production build passed, including domain/presentation/tools/worker typechecks.
  Existing Vite chunk-size advisory remains.
- Nested presentation TypeScript config passed.
- All presentation tests passed: 151 tests in 20 files.
- Added explicit Projects mount/1120/880 policy regression afterwards; targeted
  coordination plus layout suite passed: 30 tests. Full suite was not rerun after
  this test-only addition (152 presentation tests now defined).
- git diff --check passed before final developer evidence; final source changes
  since build were hook indentation only and the test-only addition.
- Offline existing Playwright wrapper probe returned ENOTCACHED for @playwright/cli.
  No install/network or harness repair attempted. No browser runtime path exercised.
- Source preservation was inspected during extraction. Responsive pixel parity,
  actual DOM focus/scroll/editor lifetime and drawer runtime remain unverified;
  prior qualification gaps/campaign stopping rules remain unchanged.

## Verification accounting and stop

Approximately **5 developer verification minutes**, including source/delta inspection,
failed/passing test runs, typechecks/build, CLI probe and diagnostics; implementation
and documentation writing time excluded. **0/1 harness repairs** used; stale export-test corrections were routine
implementation/test adaptation, not a harness repair. Analyst 4 + developer 5 = approximately
**9/20 aggregate minutes** used; approximately **11 minutes** remain for coordinator
and independent reviewer, **1 repair** remains. Verification stopped at coordinator
request; no further run authorized by this handoff. No staging, commits, pushes or
index casing edits were performed. Developer stops editing after this evidence.

Suggested commit: `refactor: share workbench layout across project and token screens`

## Exact changed paths at developer handoff

Deleted old paths and their new subtree paths are listed separately because Git has
not staged rename detection. The analyst contract is intentionally excluded.

- `README.md`
- `docs/project/architecture.md`
- `docs/project/presentation-conventions.md`
- `docs/project/workbench-component-organisation.md`
- `docs/project/workbench-layout/presentation-organisation-v2.md`
- `src/presentation/App/App.tsx`
- `src/presentation/App/components/Projects/Projects.tsx`
- `src/presentation/App/components/Projects/components/CreateProjectForm/CreateProjectForm.tsx`
- `src/presentation/App/components/Projects/components/ProjectInspector/ProjectInspector.tsx`
- `src/presentation/App/components/Projects/components/ProjectList/ProjectList.tsx`
- `src/presentation/App/components/Projects/components/ProjectList/components/ProjectListItem.tsx`
- `src/presentation/App/components/Projects/components/ProjectRecovery/ProjectRecovery.tsx`
- `src/presentation/App/components/Projects/components/RestoreDialog/RestoreDialog.tsx`
- `src/presentation/App/components/Projects/components/RestoreDialog/hooks/useBackupRestore.ts`
- `src/presentation/App/components/Projects/components/StorageProtection/StorageProtection.tsx`
- `src/presentation/App/components/Projects/hooks/useProjects.ts`
- `src/presentation/App/components/Projects/hooks/useProjectsLayout.ts`
- `src/presentation/App/components/ProjectsWorkbench/ProjectsWorkbench.tsx`
- `src/presentation/App/components/ProjectsWorkbench/components/CreateProjectForm/CreateProjectForm.tsx`
- `src/presentation/App/components/ProjectsWorkbench/components/ProjectInspector/ProjectInspector.tsx`
- `src/presentation/App/components/ProjectsWorkbench/components/ProjectList/ProjectList.tsx`
- `src/presentation/App/components/ProjectsWorkbench/components/ProjectList/components/ProjectListItem.tsx`
- `src/presentation/App/components/ProjectsWorkbench/components/ProjectRecovery/ProjectRecovery.tsx`
- `src/presentation/App/components/ProjectsWorkbench/components/RestoreDialog/RestoreDialog.tsx`
- `src/presentation/App/components/ProjectsWorkbench/components/RestoreDialog/hooks/useBackupRestore.ts`
- `src/presentation/App/components/ProjectsWorkbench/components/StorageProtection/StorageProtection.tsx`
- `src/presentation/App/components/ProjectsWorkbench/hooks/useProjects.ts`
- `src/presentation/App/components/ProjectsWorkbench/hooks/useProjectsLayout.ts`
- `src/presentation/App/components/TokenWorkbench/TokenWorkbench.tsx`
- `src/presentation/App/components/TokenWorkbench/components/CreationDialog/CreationDialog.tsx`
- `src/presentation/App/components/TokenWorkbench/components/CreationDialog/helpers/naming-preview.ts`
- `src/presentation/App/components/TokenWorkbench/components/CreationDialog/hooks/useCreationForm.ts`
- `src/presentation/App/components/TokenWorkbench/components/TokenWorkspace/TokenWorkspace.tsx`
- `src/presentation/App/components/TokenWorkbench/components/TokenWorkspace/components/AllContent/AllContent.tsx`
- `src/presentation/App/components/TokenWorkbench/components/TokenWorkspace/components/AllContent/helpers/all-content.ts`
- `src/presentation/App/components/TokenWorkbench/components/TokenWorkspace/components/SelectionBar/SelectionBar.tsx`
- `src/presentation/App/components/TokenWorkbench/components/TokenWorkspace/components/TokenTable/TokenTable.tsx`
- `src/presentation/App/components/TokenWorkbench/components/TokenWorkspace/components/TokenTable/helpers/hex-preview.ts`
- `src/presentation/App/components/TokenWorkbench/components/TokenWorkspace/components/WorkspaceToolbar/WorkspaceToolbar.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchHeader/WorkbenchHeader.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchHeader/components/HistoryControls.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/WorkbenchInspector.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/GroupInspector/GroupInspector.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/InspectorHeader.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/TokenEditor.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/components/ColorEditor/ColorEditor.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/components/ColorEditor/helpers/visual-range.ts`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/components/EditRecovery.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/components/EditorActions.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/components/ReferenceFields.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/components/TokenEditorContent.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/components/TokenEditorTabs.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/helpers/editor-failure.ts`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/helpers/integer-rgb.ts`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/hooks/useTokenEditor.ts`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenEditor/state/editor-session.ts`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchInspector/components/TokenValueComparison.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchNavigation/WorkbenchNavigation.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchNavigation/components/NamespaceTree/NamespaceTree.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchRecovery/components/DepartureGuard.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchRecovery/components/ProjectDiagnostics.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchRecovery/components/RetentionRecovery.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchRecovery/components/WorkbenchFeedback.tsx`
- `src/presentation/App/components/TokenWorkbench/components/WorkbenchStatus/WorkbenchStatus.tsx`
- `src/presentation/App/components/TokenWorkbench/helpers/history-shortcuts.ts`
- `src/presentation/App/components/TokenWorkbench/helpers/workspace-view.ts`
- `src/presentation/App/components/TokenWorkbench/hooks/useProjectCommands.ts`
- `src/presentation/App/components/TokenWorkbench/hooks/useProjectReadback.ts`
- `src/presentation/App/components/TokenWorkbench/hooks/useWorkbenchHistory.ts`
- `src/presentation/App/components/TokenWorkbench/hooks/useWorkbenchLayout.ts`
- `src/presentation/App/components/TokenWorkbench/hooks/useWorkbenchLifecycle.ts`
- `src/presentation/App/components/Workbench/Workbench.tsx`
- `src/presentation/App/components/Workbench/components/CreationDialog/CreationDialog.tsx`
- `src/presentation/App/components/Workbench/components/CreationDialog/helpers/naming-preview.ts`
- `src/presentation/App/components/Workbench/components/CreationDialog/hooks/useCreationForm.ts`
- `src/presentation/App/components/Workbench/components/TokenWorkspace/TokenWorkspace.tsx`
- `src/presentation/App/components/Workbench/components/TokenWorkspace/components/AllContent/AllContent.tsx`
- `src/presentation/App/components/Workbench/components/TokenWorkspace/components/AllContent/helpers/all-content.ts`
- `src/presentation/App/components/Workbench/components/TokenWorkspace/components/SelectionBar/SelectionBar.tsx`
- `src/presentation/App/components/Workbench/components/TokenWorkspace/components/TokenTable/TokenTable.tsx`
- `src/presentation/App/components/Workbench/components/TokenWorkspace/components/TokenTable/helpers/hex-preview.ts`
- `src/presentation/App/components/Workbench/components/TokenWorkspace/components/WorkspaceToolbar/WorkspaceToolbar.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchHeader/WorkbenchHeader.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchHeader/components/HistoryControls.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/WorkbenchInspector.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/GroupInspector/GroupInspector.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/InspectorHeader.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/TokenEditor.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/components/ColorEditor/ColorEditor.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/components/ColorEditor/helpers/visual-range.ts`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/components/EditRecovery.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/components/EditorActions.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/components/ReferenceFields.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/components/TokenEditorContent.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/components/TokenEditorTabs.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/helpers/editor-failure.ts`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/helpers/integer-rgb.ts`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/hooks/useTokenEditor.ts`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenEditor/state/editor-session.ts`
- `src/presentation/App/components/Workbench/components/WorkbenchInspector/components/TokenValueComparison.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchNavigation/WorkbenchNavigation.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchNavigation/components/NamespaceTree/NamespaceTree.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchRecovery/components/DepartureGuard.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchRecovery/components/ProjectDiagnostics.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchRecovery/components/RetentionRecovery.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchRecovery/components/WorkbenchFeedback.tsx`
- `src/presentation/App/components/Workbench/components/WorkbenchStatus/WorkbenchStatus.tsx`
- `src/presentation/App/components/Workbench/helpers/history-shortcuts.ts`
- `src/presentation/App/components/Workbench/helpers/workspace-view.ts`
- `src/presentation/App/components/Workbench/hooks/useProjectCommands.ts`
- `src/presentation/App/components/Workbench/hooks/useProjectReadback.ts`
- `src/presentation/App/components/Workbench/hooks/useWorkbenchHistory.ts`
- `src/presentation/App/components/Workbench/hooks/useWorkbenchLayout.ts`
- `src/presentation/App/components/Workbench/hooks/useWorkbenchLifecycle.ts`
- `src/presentation/App/components/WorkbenchLayout/WorkbenchLayout.tsx`
- `src/presentation/App/components/WorkbenchLayout/hooks/useWorkbenchViewport.ts`
- `test/presentation/all-content.test.tsx`
- `test/presentation/hex-preview.test.ts`
- `test/presentation/history-shortcuts.test.tsx`
- `test/presentation/identity-presentation.test.tsx`
- `test/presentation/increment-009.test.tsx`
- `test/presentation/integer-rgb.test.ts`
- `test/presentation/projects-screen.test.tsx`
- `test/presentation/reference-fields.test.tsx`
- `test/presentation/session.test.ts`
- `test/presentation/visual-range.test.ts`
- `test/presentation/workbench-coordination.test.tsx`
- `test/presentation/workbench-layout.test.tsx`
- `test/presentation/workbench-sections.test.tsx`
- `output/increment-013-implementation/developer.md` (this evidence)
