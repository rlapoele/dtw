# React presentation organisation proposal V1

## Status and purpose

**User-endorsed proposal — 15 November 2026.** The user approved this direction
and requested that it be persisted after reviewing the component-oriented tree.
It is the preferred target organisation for future scoped implementation, not a
description of the current source tree or authorization to move files.

This proposal develops the [annotated component decomposition](./component-map-v1.md)
and [layout direction](./README.md). It supersedes the earlier decomposition map's
conservative proposed folder paths, which retained `features/workbench`; its
annotation IDs and responsibility descriptions remain useful. The
[current organisation map](../workbench-component-organisation.md) continues to
describe the delivered code until a migration is agreed and implemented.

No application implementation, new feature contract, analyst review or
qualification restart is authorized by this documentation request. Increment 009's
agreements, delivered behavior and outstanding acceptance remain unchanged.

**Planning follow-up — 15 November 2026:** the user subsequently directed closure
of Increment 009 and opened [Increment 010](../../increments/010-component-oriented-presentation.md)
to plan the reorganisation. Its roadmap and first-slice contract are Draft;
implementation still requires agreement and authorization. The
[009 closure record](../../increments/009-workbench-usability-and-component-boundaries.md#user-directed-closure--15-november-2026)
preserves deferred, unverified acceptance separately from lifecycle closure.

## Organising principle

Use a component-oriented structure with colocated hooks and helpers, removing the
single-feature `features/workbench` wrapper. Each substantial component owns a
named folder containing its implementation, private subcomponents, hooks and
helpers. Shared components receive an explicit common location; generic reusable
controls remain in `ui`.

The current code already separates useful responsibilities. The proposed hierarchy
makes their composition and ownership easier to navigate: for example,
`WorkbenchInspector.tsx` currently exports several substantial components,
`Editor.tsx` exports `EditorFields`, and project-list presentation remains inline
in `App.tsx`.

## Proposed target tree

`★` identifies future functionality from the mockups. Other entries represent
existing responsibilities, including proposed extractions and renames; they are
not all existing files. This is a target organisation, not a scaffolding checklist.

```text
src/presentation/
├── main.tsx
│
├── app/
│   ├── App.tsx
│   └── useWorkbenchHost.ts
│
├── projects/
│   ├── ProjectsScreen.tsx
│   ├── useProjects.ts
│   ├── ProjectList/
│   │   ├── ProjectList.tsx
│   │   └── ProjectListItem.tsx
│   ├── CreateProjectForm/
│   │   └── CreateProjectForm.tsx
│   └── ProjectRecovery/
│       └── ProjectRecovery.tsx
│
├── workbench/
│   ├── Workbench.tsx
│   ├── useWorkbenchLayout.ts
│   ├── useWorkbenchLifecycle.ts
│   ├── useProjectCommands.ts
│   ├── useProjectReadback.ts
│   ├── readback.ts
│   │
│   ├── WorkbenchHeader/                         # 1
│   │   ├── WorkbenchHeader.tsx
│   │   ├── ProjectContext.tsx
│   │   └── ProjectActions.tsx
│   │
│   ├── WorkbenchNavigation/                     # 2
│   │   ├── WorkbenchNavigation.tsx
│   │   ├── NavigationPane.tsx
│   │   ├── NavigationDrawer.tsx
│   │   └── NamespaceTree/
│   │       ├── NamespaceTree.tsx
│   │       └── NamespaceTreeItem.tsx
│   │
│   ├── TokenWorkspace/                          # 3
│   │   ├── TokenWorkspace.tsx
│   │   ├── workspace-view.ts
│   │   ├── WorkspaceToolbar/
│   │   │   ├── WorkspaceToolbar.tsx
│   │   │   └── WorkspaceViewControls.tsx        # ★
│   │   ├── TokenTable/
│   │   │   ├── TokenTable.tsx
│   │   │   └── TokenTableRow.tsx
│   │   ├── AllContent/
│   │   │   ├── AllContent.tsx
│   │   │   └── all-content.ts
│   │   ├── VisualTokenInventory/               # ★ 3c
│   │   │   ├── VisualTokenInventory.tsx
│   │   │   ├── PaletteGroup.tsx
│   │   │   └── TokenSpecimen.tsx
│   │   └── SelectionBar/
│   │       └── SelectionBar.tsx                 # ★ 3e
│   │
│   ├── WorkbenchInspector/                     # 4
│   │   ├── WorkbenchInspector.tsx
│   │   ├── InspectorHeader.tsx
│   │   ├── GroupInspector/
│   │   │   └── GroupInspector.tsx
│   │   └── TokenEditor/
│   │       ├── TokenEditor.tsx
│   │       ├── useTokenEditor.ts
│   │       ├── editor-session.ts
│   │       ├── TokenEditorTabs.tsx
│   │       ├── TokenValueComparison.tsx
│   │       ├── EditorActions.tsx
│   │       ├── EditRecovery.tsx
│   │       ├── ValueEditor/
│   │       │   ├── ValueEditor.tsx
│   │       │   ├── ReferenceFields.tsx
│   │       │   └── ColorEditor/
│   │       │       ├── ColorEditor.tsx
│   │       │       ├── ColorChannelField.tsx
│   │       │       ├── AlphaField.tsx
│   │       │       ├── integer-rgb.ts
│   │       │       └── visual-range.ts
│   │       └── TokenDetailsForm/               # ★ 4h
│   │           ├── TokenDetailsForm.tsx
│   │           ├── TokenIdentityFields.tsx
│   │           └── TokenClassificationFields.tsx
│   │
│   ├── WorkbenchStatus/                        # 5
│   │   └── WorkbenchStatus.tsx
│   │
│   ├── TokenRelationships/                     # ★ 6
│   │   ├── TokenRelationships.tsx
│   │   ├── RelationshipContext.tsx
│   │   ├── ReferenceNeighborhood/
│   │   │   ├── ReferenceNeighborhood.tsx
│   │   │   └── ReferenceNode.tsx
│   │   ├── DependencyLists/
│   │   │   ├── DependencyLists.tsx
│   │   │   └── DependencyItem.tsx
│   │   └── RelatedTokens.tsx
│   │
│   ├── ContextPreview/                         # ★ 7
│   │   └── ContextPreview.tsx
│   │
│   ├── CreationDialog/
│   │   ├── CreationDialog.tsx
│   │   ├── useCreationForm.ts
│   │   └── naming-preview.ts
│   │
│   └── WorkbenchRecovery/
│       ├── DepartureGuard.tsx
│       ├── RetentionRecovery.tsx
│       └── ProjectDiagnostics.tsx
│
├── project-backup/
│   ├── RestoreDialog/
│   │   ├── RestoreDialog.tsx
│   │   └── useBackupRestore.ts
│   └── useWorkbenchBackup.ts
│
├── token-display/
│   ├── TokenSwatch.tsx
│   ├── AuthoredValue.tsx
│   ├── ExactSource.tsx
│   ├── TokenMetadata.tsx
│   ├── ResolvedTokenPanel.tsx
│   ├── authored-color.ts
│   └── color-preview.ts
│
├── ui/
│   ├── badge.tsx
│   ├── button.tsx
│   ├── dialog-content.tsx
│   ├── field.tsx
│   ├── icon.tsx
│   ├── input.tsx
│   └── select.tsx
│
├── host/                                      # Existing host boundary
├── lib/
│   └── cn.ts
└── styles/
    └── global.css
```

Existing configuration files such as `tsconfig.json` are omitted from this
component-focused sketch, not proposed for removal.

## Responsibilities and rationale

`App.tsx` handles application entry, host lifetime and choosing between projects
and an open workbench. Project catalogue, creation and recovery presentation leave
its inline JSX and become identifiable components under `projects/`.

`Workbench.tsx` remains the project-level coordinator. Its adjacent hooks own
readback, commands, lifecycle and responsive composition. This replaces the
generic `coordination/` folder with colocation beside the component that uses those
responsibilities. Moving a hook changes neither its authority nor its lifecycle.

Large screen regions receive recognisable folders. `TokenWorkspace/` reveals
browsing composition; `WorkbenchInspector/TokenEditor/` reveals editing composition.
The numbered comments in the tree connect those folders to the annotated mockups.

`TokenRelationships` and `ContextPreview` sit beside workspace and inspector
because multiple regions can use their presentation. The workspace renders larger
views; the inspector can link to relationships or use a summary. Application and
domain operations continue to supply their data and semantics.

`project-backup/` is outside the workbench because restore is already used from
both the project screen and an open project. Backup remains distinct from
interchange; the proposal does not prebuild import/export modules.

`token-display/` holds shared token-aware rendering and presentation helpers.
A token swatch or resolution explanation understands token data; a generic
button or dialog does not. Keep generic controls under `ui/`, retaining the existing
lowercase filenames for those owned primitives and the shared Icon conventions.

The host boundary and application/domain dependency direction remain unchanged.
No rendering component gains direct database, worker-runtime or privileged access
through this folder change. Shared presentation must not depend on a private
workbench editor implementation.

## Proposed component names and transitions

Current paths below are relative to `src/presentation/features/workbench/`.
Target paths are relative to `src/presentation/`.

| Current implementation | Proposed target |
| --- | --- |
| `browser/TokenBrowser.tsx` · `TokenBrowser` | `workbench/TokenWorkspace/TokenWorkspace.tsx` · `TokenWorkspace` |
| `browser/ProjectNavigation.tsx` · `ProjectNavigation` | `workbench/WorkbenchNavigation/NamespaceTree/NamespaceTree.tsx` · `NamespaceTree` |
| `browser/ProjectedTokenList.tsx` · `ProjectedTokenList` | Starting point for `workbench/TokenWorkspace/TokenTable/TokenTable.tsx`; preserve its actual behavior during a rename. |
| `inspector/WorkbenchInspector.tsx` · `EditableTokenInspector` | `workbench/WorkbenchInspector/TokenEditor/TokenEditor.tsx` · `TokenEditor` |
| `inspector/Editor.tsx` · `EditorFields` | `workbench/WorkbenchInspector/TokenEditor/ValueEditor/ValueEditor.tsx` · `ValueEditor`, after separating tab/editor composition. |
| `inspector/ColorFields.tsx` · `ColorFields` | `workbench/WorkbenchInspector/TokenEditor/ValueEditor/ColorEditor/ColorEditor.tsx` · `ColorEditor` |
| `inspector/inspection-tabs.tsx` · `InspectionTabs` | `workbench/WorkbenchInspector/TokenEditor/TokenEditorTabs.tsx` · `TokenEditorTabs` |
| `components/swatch.tsx` | `token-display/TokenSwatch.tsx` |

The alternate `browser/TokenList.tsx`, currently used by regression tests, needs
a separate disposition. Inspect its remaining purpose before migrating or removing
it. The target tree does not authorize deletion or weakening its test coverage.

## Naming and dependency conventions

- Use PascalCase component folders and filenames, camelCase hook filenames and
  descriptive kebab-case helper filenames.
- Keep private children in their parent's folder. Add a nested folder when a child
  has meaningful composition or supporting files of its own.
- Match the main component filename to its folder name; avoid making every entry
  point `index.tsx` or adding blanket barrel exports.
- Consume a subtree through its parent component. Avoid sibling components reaching
  into another subtree's private editor/session files. A demonstrated shared helper
  belongs at the nearest meaningful common owner; do not duplicate its logic merely
  to satisfy a directory shape.
- Extract components for meaningful responsibilities, repetition or complexity,
  not simply to match every annotated rectangle. The target tree does not mandate
  empty folders or one file per outline.
- Preserve one token-editor session across desktop and mobile. Responsive
  containers change presentation rather than instantiating independent editors
  with competing drafts. Keep raw invalid input, completion authority and
  departure/retention protections intact.

## Scope and follow-up

Existing responsibilities can be reorganised separately from delivering starred
capabilities. A rename such as TokenTable does not itself authorize changing list
behavior, accessibility semantics or keyboard interaction. Editable Details,
relationships, preview bindings and view controls still require scoped contracts.

Before a migration, establish the exact move/extraction map and review scope,
preserve current component contracts and editor lifetime, and review affected
imports/tests against a stable snapshot under the existing workflow. No particular
state library, context provider, package split or dependency is selected here.

Persisting this proposal is documentation-only. Verify prose, links and naming
consistency; application tests/builds and browser qualification are not needed for
this save. Leave staging, committing and pushing to the user.
