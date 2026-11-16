# Increment 013: Shared workbench layout

- Contract status: Agreed
- Delivery status: Completed
- Agreement: 16 November 2026. The user approved the coordinator's source-based shared-layout proposal and authorized implementation. This contract records that described scope and its preservation checks; it does not assert separate user approval of newly invented criteria.
- References: [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [current ownership](../project/workbench-component-organisation.md), [workflow](../workflow/agent-roles.md).

## Outcome and scope

Give Projects and token authoring one shared presentation layout while preserving their current behavior and appearance.

- Rename `App/components/Projects/Projects.tsx` to `ProjectsWorkbench/ProjectsWorkbench.tsx` and `App/components/Workbench/Workbench.tsx` to `TokenWorkbench/TokenWorkbench.tsx`, moving their owned subtrees and updating imports/references.
- Add `App/components/WorkbenchLayout/WorkbenchLayout.tsx`, reusing ApplicationShell. Accept `header`, optional `beforeBody`, optional `navigation`, `workspace`, `inspector`, optional `afterBody` and optional `overlays` slots, controlled `navigationCollapsed`/`inspectorCollapsed` and the compact flags needed to express current modes.
- Put shared 1120/880 viewport observations in `WorkbenchLayout/hooks/useWorkbenchViewport.ts`. Keep each screen's layout hook, focus decisions, selection/surface state and navigation state with that screen; existing hook names may remain.
- Keep application/domain/host behavior, storage, commands, restore orchestration, dependencies, visual design and feature coverage unchanged. Do not reopen earlier qualification campaigns.

## Acceptance criteria

- AC-1: Both named screen owners use WorkbenchLayout and ApplicationShell through it. Shared layout owns common composition/geometry without acquiring project, command, editor or host authority. Required slots remain explicit; no duplicate screen layout abstraction is introduced.
- AC-2: Slot order is header → beforeBody → body (navigation, workspace, inspector) → afterBody → overlays. Token skip link still precedes its header, for example within the header slot. Token feedback remains before its body and status after it; Projects feedback and backup feedback remain after its body, followed by departure and restore dialogs. Existing pane semantic roots, refs, IDs, labels, scroll containers, padding and feedback ordering remain intact; slots do not add pane wrappers that alter these contracts.
- AC-3: Existing desktop/compact/narrow geometry, controlled collapse states, drawer behavior and focus/surface transitions remain screen-owned behavior. Centralized observation retains thresholds below1120 and below880 CSS px (existing queries max-width1119px/max-width879px), cleanup and current-focus/modal handling. Projects focus policy reacts only to880 transitions; token focus policy reacts to both thresholds. Do not introduce resize-policy execution on initial mount. This is an extraction, not a breakpoint or focus-policy change.
- AC-4: App still calls useProjects unconditionally and owns host/catalogue/page context, backup refs and restore sequencing. The project key remains project identity. One TokenEditor retains its existing key and stable mounted ancestry/position across responsive modes; dirty input/session lifetime is preserved. This does not require literal pre-refactor ancestry when first mounting the new shared component.
- AC-5: Imports, affected tests and current ownership/architecture/status documentation describe the resulting structure. Existing primitives, styling and icon conventions remain in force; no new library or unrelated cleanup is included.

## Decisions and open questions

No unresolved product or architecture decision blocks this extraction. Preserve existing pane roots rather than replacing them with generic semantic wrappers. Layout may express the existing two-column Projects and three-column token geometry through its scoped API/classes; it must preserve current responsive dimensions and padding. Centralizing media observation does not authorize centralizing screen state or changing resize focus policy. Material deviations return to the coordinator/user; routine implementation choices remain authorized.

## Design proposals and review

The designer supplied a source-based assessment, followed by the coordinator's concrete shared-layout proposal. The user reviewed and approved that described proposal and implementation on16 November2026. No new interaction, visual alternative or prototype is proposed by this increment, so a fresh prototype/reapproval loop adds no design decision to review. This record identifies the agreed source-based extraction; it does not invent a separately saved design artifact.

Analyst source review against baseline274fcf5 confirmed feasibility and no material contradiction. Preservation details are AC-2 through AC-4: the token skip link/header order, differently placed feedback, unchanged real pane roots and one editor, plus screen-owned focus policy. These are checks of the approved preservation intent, not an expansion of product scope. Any material design revision must return to the user before renewed analyst review.

## Verification approach and stopping rules

Use source ownership/delta comparison for all criteria, production build/typechecks, the existing presentation regression suite and minimal meaningful layout-slot-order and viewport-observation/cleanup tests. Preserve existing assertions while adapting paths. Review responsive/focus ownership and editor identity directly against baseline source. A representative browser smoke is useful if practical within the allowance; it is not a newly mandatory qualification campaign. Report runtime paths not exercised rather than claiming them passed.

The shared ceiling is **20 aggregate verification minutes and one harness-repair cycle**, including all agents' review, diagnostics, waits and reruns. This bounded allowance is proportionate to extraction risk. Analyst source/contract review consumed approximately **4 minutes**, **0 repairs**; approximately16 minutes and one repair remain at this handoff. The preceding source-based proposal assessment is preparation outside this new check allowance. Implementation time itself is distinct from verification. Carry updated consumption between developer, coordinator and reviewer; stop at either ceiling, tooling dominance or low value. Do not reset unused allowance at a handoff.

No new stress, network/storage fault, persistence, browser-engine or broad accessibility qualification campaign is authorized. Prior007/009/010/011/012 stopped campaigns and acceptance gaps remain unchanged. Any unavailable browser smoke or unverified scenario stays explicitly unverified; the coordinator records the actual evidence and limits in completion.

## Review baseline

Implementation base: clean HEAD `274fcf5a502998ca760cee3551bc7c754ab91055`, verified before this contract was written. Only this contract was introduced by the analyst. Before independent review, pause implementation and identify the exact stable working-tree diff plus all new files; staging, commits and pushes remain with the user. Reviewer must derive expectations from this contract and owning documents before implementation claims.

## Agreed amendments

None.

## Completion report

- Delivery status: Completed
- Date: 16 November 2026
- Reviewed implementation: base `274fcf5a502998ca760cee3551bc7c754ab91055`, [R1 manifest](../../output/increment-013-implementation/source-manifest-r1.json) and [R1 diff](../../output/increment-013-implementation/source-r1.diff), including new files. Independent review verified their hashes. Coordinator completion/status edits followed review and changed documentation only.

### Result and acceptance evidence

ProjectsWorkbench and TokenWorkbench now compose the same WorkbenchLayout through
explicit ordered slots. ApplicationShell is reused; pane roots and screen workflows
remain owned by the supplied components. Shared viewport observation preserves the
existing thresholds, with separate screen focus/surface policy.

| Criterion | Evidence and result | Status |
| --- | --- | --- |
| AC-1 | Both screens use WorkbenchLayout/ApplicationShell; independent source review confirms layout-only authority and no dependency additions. | Verified by source review |
| AC-2 | Static slot-order test and baseline comparison preserve semantic roots, refs, IDs, scrolling, skip link and distinct feedback/dialog ordering. Stylesheet unchanged. | Verified by source/static rendering; browser parity unverified |
| AC-3 | Shared observer tests cover exact media queries, current callback, no mount callback and cleanup. Projects transition regression and baseline comparison preserve screen policy/collapse/drawer branches. | Verified by mocked tests/source; browser focus/geometry unverified |
| AC-4 | Baseline-normalized source comparison confirms unchanged App orchestration, command/editor logic, project key and sole TokenEditor key; slots keep fixed positions across responsive modes. Existing coordination tests pass. | Verified by source/tests; real mounted session behavior unverified |
| AC-5 | Imports and current README/architecture/ownership/presentation documentation updated; historical proposal annotated. Typechecks/build and regression checks pass. | Verified |

### Checks and independent review

- [Developer evidence](../../output/increment-013-implementation/developer.md): production build and all four typecheck scopes passed; nested presentation config passed. Presentation suite: 151 tests passed before a later test-only addition; targeted 30 passed afterward. Final source differences after build were hook indentation and that test addition. Existing Vite chunk-size advisory remains.
- [Independent reviewer](../../output/increment-013-implementation/reviewer.md), `/root/layout_reviewer`: R1 hashes and baseline comparisons checked; 37 targeted tests passed. No actionable findings or unresolved disagreements. Reviewer did not repeat build/typechecks or perform browser interaction.
- Design verification: source-based designer assessment and agreed coordinator proposal supplied the extraction boundaries. No visual redesign was introduced. Static rendering/source review support preservation; rendered browser parity was not observed.
- Browser smoke was unavailable: the offline Playwright CLI probe returned ENOTCACHED. No installation, network attempt or browser harness repair was made. Browser geometry, actual focus/scroll, drawer interactions and mounted editor lifetime remain unverified; no new user manual acceptance is asserted.
- Coordinator reviewed the final handoff Markdown/links and checked whitespace and current paths. Documentation-only completion additions are outside the reviewed R1 implementation snapshot.
- Verification accounting: approximately **16/20 aggregate minutes** (analyst4, developer5, reviewer5, coordinator2), **0/1 harness repairs**. Routine stale renamed-export test corrections were implementation/test adaptation. Checks stopped after essential evidence and independent review; unused allowance is not a qualification restart.

### Decisions, limits and next step

The [architecture](../project/architecture.md#shared-workbench-layout--increment-013-16-november-2026)
and [ownership map](../project/workbench-component-organisation.md) describe the
agreed structure. No application/domain/host, storage, schema or editor-session
policy changed. Earlier qualification campaigns and acceptance gaps remain stopped
and unchanged. Browser qualification above remains a stated limit rather than a
newly claimed pass or a silently reopened campaign.

The user can review and stage/commit/push the delivered extraction. No further
implementation or qualification work is opened by this report. Suggested commit:
`refactor: share workbench layout across project and token screens`.



## Later naming maintenance — 16 November 2026

After committing/pushing the extraction and subsequent file moves, the user
requested renaming TokenWorkbench to TokensWorkbench (folder, entry file and
component) for consistency with ProjectsWorkbench. Current documentation/imports
use the plural name. The agreement and reviewed snapshots above retain the names
used at that increment's implementation/review; this maintenance does not reopen
its qualification or alter its acceptance record. See the
[current ownership map](../project/workbench-component-organisation.md#plural-workbench-naming--16-november-2026).
