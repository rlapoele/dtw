# React component map V2 — coordinated shell and Projects inspection

**Proposed for user review — 15 November 2026.** Concrete continuation of the
[user-endorsed organisation](presentation-organisation-proposal-v1.md), scoped to
[Projects V2](projects-shell-v2.md), [workbench V2](workbench-shell-v2.md) and draft
011. The [delivered ownership map](../workbench-component-organisation.md) remains
the source of truth for current code. This document is a source-informed change
map, not permission to scaffold or an implementation plan already agreed.

## Shared presentation, distinct workflows

Extract the repeated outer shell/header geometry, not a shared controller.
`ApplicationShell` renders the viewport frame, one main region, contextual feedback
slot and status slot. `ApplicationHeader` renders application identity/context
and page-owned action slots. It accepts nodes/display props; it does not know
project catalogue, storage, token editor, selection commands or host lifetime.
Both pages use the same neutral theme and generic controls, while Projects uses
a two-region list/inspector and Workbench uses navigation/workspace/inspector.
Do not force a token navigation column into Projects for visual reuse.

The smallest useful target is below. **New** means a demonstrated extraction or
011 surface; it does not mean a delivered file. Existing names stay where useful.
Paths are relative to `src/presentation/`.

| Current file / responsibility | Proposed owner / change for V2 |
| --- | --- |
| Repeated shell/header markup in `projects/ProjectsScreen.tsx`, `workbench/Workbench.tsx`, `workbench/WorkbenchHeader/WorkbenchHeader.tsx` | **New** `ApplicationShell/ApplicationShell.tsx` and `ApplicationHeader/ApplicationHeader.tsx` for pure outer frame/header. Page-specific toolbar/action composition stays with each page. Slots rather than a registry/provider or a shared application state object. |
| `app/App.tsx`, `app/useWorkbenchHost.ts` | Retain one host lifetime, unconditional `useProjects`, project branch, Workbench project-ID key, preview/file refs, departure/restore dialog configuration. If restoring Projects selection/scroll across workbench departure requires page context here, keep it explicitly distinct from opened project state. No simultaneously mounted second Workbench. |
| `projects/ProjectsScreen.tsx` | Compose catalogue, selection affordance, **new** `ProjectInspector/ProjectInspector.tsx`, existing create/restore/recovery and responsive browse/inspect visibility. Proposed local selection state uses stable project ID; it never calls `onOpen` just because a row was selected. The opened `project` remains owned by useProjects. |
| `projects/ProjectList/ProjectList.tsx`, `ProjectListItem.tsx` | Replace direct-open row callback with selection props/callback and explicit selected state; render exact identity/disambiguation, supported counts or reason. Keep native button/list interaction rather than adopting an unimplemented ARIA grid/listbox. |
| No existing project inspector | **New** `projects/ProjectInspector/ProjectInspector.tsx`: read-only catalogue/details states, exact identity, explicit Open project, selected-project Download backup. Receives display values/action callbacks; no direct host calls or invented metadata. |
| `projects/useProjects.ts` | Retain catalogue, create/open, name validation, unknown/retained recovery, notice/error and host sequencing. Extend only after scope agreement for selected detail read/backup coordination; selection itself is not `openProject`/setProject. Avoid a second catalogue controller or bypassing its command gates. |
| `projects/CreateProjectForm/CreateProjectForm.tsx` | Reuse inline controlled name/form/error/ref flow. Its successful operation still uses current create-and-open completion; no new create modal or dismissal semantics. |
| Restore file section currently inline in ProjectsScreen | Keep it inline unless extraction becomes justified by the agreed backup UI. Native file selection invokes current staging path; do not add a file-picker service or separate form controller. |
| `projects/ProjectRecovery/ProjectRecovery.tsx` | Preserve exact pending/unknown/retained notices and actions, placed above active Projects content when relevant rather than outside the reachable narrow surface. |
| `project-backup/useWorkbenchBackup.ts` | Current open-header-based download coordination is unsuitable for blind relocation. Separate reusable file/download effects only if demonstrated by the agreed selected-project snapshot/revision flow; Projects/useProjects owns its actual action sequencing. No token-workbench session instantiation to acquire a backup. Name any resulting hook for its actual responsibility, not an imaginary generic command bus. |
| `project-backup/RestoreDialog/RestoreDialog.tsx`, `useBackupRestore.ts` | Keep cross-screen staged/replacement authority and exact file refs/preview lifetime. With project entry points moved to Projects, remove Workbench backup/restore entry composition only after the agreed replacement is concrete. Restore's current protections and Open completion stay meaningful. |
| `workbench/Workbench.tsx` | Retain selection, active view/query, refs, dirty/form/unknown departure coordination, editorVersion and completion authority. Compose shared shell/header and stable panes. Hide/reflow the same inspector subtree instead of conditional desktop/mobile clones. |
| `workbench/useWorkbenchLayout.ts` | Candidate owner of proposed threshold modes, remembered narrow surface, per-session collapse and drawer visibility. Layout state has no authority to mutate tokens, discard drafts, alter command completion or change editor keys. Focus restoration may be colocated here if it remains bounded to layout; no generic navigation framework. |
| `workbench/WorkbenchHeader/WorkbenchHeader.tsx` | Page-owned header composition: project context, Browse/Back where relevant, Projects guarded return. Remove backup/restore controls. No Undo/Redo placeholders. Consume shared ApplicationHeader without transferring request/departure authority. |
| `workbench/WorkbenchNavigation/WorkbenchNavigation.tsx`, `NamespaceTree/NamespaceTree.tsx` | Keep persistent pane/drawer wrappers and existing namespace semantics. Responsive overlay/focus handoff reuses these owners. No new tree keyboard contract, domain grouping or saved navigation preferences. |
| `workbench/TokenWorkspace/TokenWorkspace.tsx` | Continue workspace composition. Narrow inactive browse must not remain focusable. Keep actual All content, membership, Find/reveal, diagnostics and empty/read-error paths. |
| `TokenWorkspace/WorkspaceToolbar/WorkspaceToolbar.tsx` | Refine existing scope title/actions/search layout, wrapping and labels; no new view/filter controls. |
| `TokenWorkspace/TokenTable/TokenTable.tsx`, `AllContent/AllContent.tsx` | Responsive row detail and selected indication. At narrow width repeated authored column may yield to path/type; full value remains inspector. Preserve current identity and inspect callbacks, incomplete content and membership projections. |
| No current selected-token reopen surface | **New** `workbench/TokenWorkspace/SelectionBar/SelectionBar.tsx`: selected identity/path, dirty signal and Edit/Inspect callback for narrow browse or collapsed inspector as agreed. Receives controlled selection/feedback; owns no second selection or draft. Keep visible even when query/scope hides the selected row. |
| `WorkbenchInspector/WorkbenchInspector.tsx`, `InspectorHeader.tsx`, `GroupInspector/GroupInspector.tsx` | Preserve common fallback, collapse/reopen header and read-only group surface. Adapt header Back presentation without treating Back as cancellation. Retain existing feedback from TokenValueComparison; it is applied/draft feedback, not a new comparison feature. |
| `WorkbenchInspector/TokenEditor/TokenEditor.tsx` | **Sole** useTokenEditor caller. Its position/key/session lifetime must survive shell modes. Keep existing `[selection.id, editorVersion]` resets only for their authorized selection/completion/discard causes. |
| `TokenEditor/TokenEditorContent.tsx`, `TokenEditorTabs.tsx`, `EditorActions.tsx`, `ReferenceFields.tsx`, `EditRecovery.tsx` | Refine cohesive hierarchy using existing components. Content remains authored/resolved/metadata composition. Actions and reference/recovery callbacks remain owned by the editor hook; no independent local draft or direct command submitter in a child. |
| `TokenEditor/useTokenEditor.ts`, `editor-session.ts`, `editor-failure.ts` | Preserve exact raw literal/reference strings, mode/tab, display settings, validation/recovery and Apply/Cancel ownership. Pure session operations stay pure. Responsive state is not a reason to replace/initialize this state. |
| `TokenEditor/ColorEditor/ColorEditor.tsx`, `ColorEditor/visual-range.ts`, `TokenEditor/integer-rgb.ts` (nearest common owner) | Preserve current horizontal channel/Alpha controls, exact text and slider policies. Reflow/labels only. Do not extract a generic slider controller or add numerical policy. |
| `token-display/{AuthoredValue,TokenMetadata,ExactSource,ResolvedTokenPanel,TokenSwatch}.tsx` and helpers | Reuse read-only presentation, provenance/identity detail, lazy exact-source lifetime and current derived values. Keep token-aware displays independent of private editor/session ownership. |
| Inline session/lifecycle/read-failure rendering in Workbench, `WorkbenchStatus/WorkbenchStatus.tsx`, `WorkbenchRecovery/RetentionRecovery.tsx` | Refine ordinary status/guidance into current WorkbenchStatus composition; extract **new** `WorkbenchRecovery/WorkbenchFeedback.tsx` only for the concrete shared visible safety area containing existing lifecycle/read-failure/retention renderers. Workbench retains all callbacks and hook calls. Request persistent storage moves to Projects' retention section as a proposed presentation relocation. |
| `WorkbenchRecovery/DepartureGuard.tsx`, `ProjectDiagnostics.tsx`, `CreationDialog/CreationDialog.tsx`, `useCreationForm.ts` | Reuse existing dialogs/diagnostics and exact baseline/departure behavior. Reflow them rather than creating parallel mobile dialogs. Creation hook call stays in Workbench. |
| `ui/{button,input,select,field,badge,dialog-content,icon}.tsx`, `lib/cn.ts`, `styles/global.css` | Shared existing generic controls, theme and class composition. Reuse before adding primitives. Heroicons imports remain centralized in Icon. Preserve Button/Base UI callback/precedence contracts; layout work does not authorize a dependency migration. |

## Lifetime and command handoff

```text
App — one host / project branch / keyed Workbench / entry dialogs
├─ useProjects — catalogue, create, explicit open, entry recovery
│  └─ ProjectsScreen — selected project ID, browse/inspect presentation
│     ├─ ProjectList — selection callback
│     └─ ProjectInspector — explicit Open / Backup callback
└─ Workbench — selected token ID, scope/query, guards, command completion
   ├─ useWorkbenchLayout — presentation and focus visibility
   ├─ useProjectReadback / useProjectCommands / useWorkbenchLifecycle
   ├─ TokenWorkspace — browse + SelectionBar
   └─ WorkbenchInspector → TokenEditor → useTokenEditor (one session)
```

This is a responsibility sketch, not literal simultaneous mounting or a prescribed
new context. The shared shell renders both pages through their existing branch;
it does not make useProjects/useProjectCommands interchangeable. Selection in
Projects, an opened project in App, namespace scope and token inspection selection
are different concepts even where all use a similar row/highlight/inspector UI.

Refs for focus, name input, pending action, selected backup file, reviewed baseline
and command completion keep their current meaning. A component move is not a
reason to reinitialize one. React key stability, hidden surface accessibility,
scroll restoration and source/request revision handling need explicit focused
implementation evidence later. Do not claim component reuse proves preservation.

## Scope and review

No folders/files in this map were created under `src/`; no dependency or code
change occurred. No Relationships, token Details form, visual inventory,
comparison, generic controller, registry or future-feature subtree is scaffolded.
The map supports AC-4/5/9 and the UI baseline in AC-10; artifact/static inspection
alone cannot satisfy runtime criteria. Shared-shell extraction, new inspector/
selection bar, exact responsive ownership and Projects snapshot/backup sequencing
remain proposals for user feedback, analyst scope and final agreement.

Designer self-check for the complete V2 artifact set: approximately
**2 minutes** (within the 3-minute ceiling), source/prose/SVG consistency only; zero harness repairs, app tests,
builds, browser runs or resumed qualification. The coordinator owns the remaining
render/link check and cumulative 8-minute additional allowance. Previous V1
10/10 planning-check consumption stays stopped and is not reset.

Suggested commit: `docs: propose coordinated Projects and workbench V2 design`

## Subsequent analyst handoff — 15 November 2026

The user approved this V2 set at `ae75f29` for analyst review. The completed
[review](../../increments/011-v2-analyst-review.md),
[refined Draft contract](../../increments/011-responsive-shell.md) and
[concrete presentation tree/ownership matrix](presentation-organisation-v2.md)
record the refinements. Supported catalogue entries already carry a revision for
the existing selected-project backup path; no extra header read or editing
ownership is needed for the proposed fields. App-lifetime Projects context
replaces the earlier screen-local lifetime suggestion where cross-screen
preservation is required. All file kinds follow purpose, owner and consumers;
meaningful hooks/helpers or other shared folders are allowed.

These are contract/ownership clarifications, not a material visual revision.
Original V2 artwork is unchanged; final agreement and implementation remain pending.
Read the refined tree with this earlier component map.

## User-adopted file grouping — 15 November 2026

After the analyst handoff, the user adopted the concrete owner-first, file-grouped
variant in [presentation organisation V2](presentation-organisation-v2.md). Its
resulting tree now owns the target paths: component entries stay at named-folder
roots and private/shared supporting code is grouped by role at its actual owner.
The older path table above remains design/review history; use the adopted tree
for current planned placement. Hook callers, state lifetimes and workflows remain
as refined by the analyst. No application files were moved or implemented.
