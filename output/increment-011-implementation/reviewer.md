# Increment 011 independent review — r1

**Verdict: changes requested.** Two actionable regressions; AC-13 is demonstrably failed. This is a bounded independent review, not exhaustive acceptance.

Reviewed snapshot: `increment-011-final-r1`, base `e5a3e3fc4835ff29a806ccde292156c63eb260f1`, identified by `review-source-manifest.json` and `review-source.patch`. A case-sensitive physical-file inventory and SHA-256 comparison verified all **136** manifest entries with no mismatches, including deleted lowercase `workbench/Workbench.tsx` versus added uppercase `Workbench/Workbench.tsx`. Source remained frozen throughout review. No production/test/requirements edits, staging, commits, dependencies or agents were introduced.

## Expectations established before source assessment

Read the agreed contract and authorization first, including AC-1–14 and the selected V2 policies; then the V2 Projects/workbench interaction notes, adopted owner-first tree and role/lifetime matrix, current ownership map, workflow and presentation/product/architecture guidance. Historical Draft/pending prose was treated as superseded by the contract's explicit agreement section. The adopted capitalized/file-grouped tree takes precedence over earlier component-map paths.

Expected behavior: selection only inspects catalogue facts; explicit Open enters; backup captures one supported ID/revision without ownership and never automatically retries changed data; restore retains its staged completion and replacement protection. App retains Projects context. Wide/compact/narrow geometry changes visibility of one keyed editor, preserving exact invalid input and command guards. Safety feedback remains accessible on the active surface. Physical file moves preserve hook callers and lifetimes. No excluded capabilities or dependencies should appear.

Developer report was consulted only **after** forming these expectations, tracing implementation and reproducing the first finding. Its test/build/runtime claims below are attributed evidence, not independently repeated results.

## Required findings

### P1 — Restore completion is blocked by the preview gate

**AC-13; regression from base.** `src/presentation/projects/hooks/useProjects.ts:98` adds `hasPreview` to the normal `open` guard. `src/presentation/app/App.tsx:139–141` handles RestoreDialog's Open/completion by calling `setPreview(undefined)` and then `open(id)` synchronously. React has not rerendered at that point: this `open` closure still captures `hasPreview === true`, and silently returns before `openProject`.

Reproduction in isolated native Chrome 157.0.8103.51 at 720×800:

1. Create synthetic project; return to Projects.
2. Inspect selected project and Download backup.
3. Back to projects; select that downloaded native backup file.
4. In same-ID restore review, choose **Open local project**.

Observed: review modal closes; the page remains Projects and `.workbench` count is **0**. No page errors. Evidence: `output/playwright/increment-011/reviewer/runtime.cjs` and `restore-open-blocked.png`. Download, synthetic creation and narrow inspection/Back worked in the same scenario.

The same callback handles successful restore completion and Open retained project; source tracing shows they hit the same stale preview gate. Base `open` did not gate `hasPreview`, so this is introduced by 011. The existing new preview test only proves conflicting normal actions are blocked; it omits authorized restore completion. Preserve the conflicting-command gate while giving restore completion an explicit safe path after preview disposal, and add an App-level completion regression check.

### P2 — Narrow project Open errors are inside the hidden browse surface

**AC-8, AC-11, AC-13; source-demonstrated responsive regression.** `src/presentation/projects/ProjectsScreen.tsx:135–137` renders the sole `error` alert inside the browse `<main>` (hidden at line 68 when narrow inspection is active). `useProjects.ts:107–108` sets that error on Open failure; the active ProjectInspector at `ProjectsScreen.tsx:143–145` receives no error and remains on its last catalogue-supported facts.

Reproducible scenario: below 880px, select a supported row, Inspect, then Open while its retained record becomes unreadable/unavailable after the catalogue read. Open fails, pending clears, but no visible alert explains the failure on the current surface. Only Back reveals the actual reason. A backup failure whose subsequent catalogue refresh fails similarly leaves the detailed catalogue error/retry inside hidden browse, although backup's own generic feedback remains visible.

Expose the relevant error/recovery region outside the hidden Projects panes, or render it on the active inspector with an associated retry/Back path. Do not duplicate alert IDs. This finding follows the explicit render/command path; a live storage-failure injection was not performed and no claim is made about new storage qualification.

## Independently checked coverage and limits

| Criteria | Independent evidence | Remaining acceptance |
| --- | --- | --- |
| AC-1/2/3/7/10 | Source confirms 1120/880 thresholds, wide side regions, compact drawer, narrow hidden panes; isolated 720 Projects select/Inspect/Back and file review/download exercised. Semantic styling and shared components inspected. | Full wide/compact/narrow visual geometry, 320 controls, zoom, short-height and threshold-neighbor behavior not independently completed. |
| AC-4/5/6 | Stable WorkbenchInspector/TokenEditor ancestry and `[selection.id, editorVersion]` key; sole useTokenEditor caller preserved. Layout has no token/session mutation. Focus/modal policy and targeted test checked. | Independent editor runtime stopped before reaching a qualifying editable fixture; exact invalid/reference/display/session/focus/scroll transitions remain coordinator/developer evidence or unverified, not independently passed here. |
| AC-8 | Workbench feedback placed outside hidden panes; native hidden removes inactive panes from focus/navigation. Existing command/creation/readback and restore helpers retain owners. | P2 fails Projects active-surface feedback. No live unknown/read-failure/unsupported matrix. |
| AC-9/14 | Manifest verified; adopted root entry/component/hooks/helpers/state placement and call ownership inspected. Editor/session/channel/source algorithms mostly import-only moves. Generic UI remains separate; no package/host/domain/protocol change in scope. | No independent exhaustive module-by-module proof or platform qualification. |
| AC-11 | Runtime explicit selection/Inspect remains Projects; explicit Open after creation return works. Static supported/unavailable/missing/refresh tests inspected and run. Inspector uses controlled catalogue facts without new host read. | P2; arbitrary unavailable identities and disappearing catalogue row not sampled live. |
| AC-12 | Isolated native selected-revision backup downloaded without entering Workbench. Controlled-host test independently run verifies captured r1, identity-specific stale error, r2 refresh, no Open and no automatic retry/reissue; gates inspected. | Other-tab ownership and live revision mutation not independently sampled. |
| AC-13 | Synthetic create-and-open, narrow Projects Inspect/Back, native backup input/same-ID preview exercised. Restore protection reducer and staged hook source inspected. | **P1 fails restore Open/completion.** Long-catalogue scroll restoration and complete replacement/unknown/recovery matrix not independently observed. |

No unsupported semantics, new dependencies, excluded history/placeholders or second editor were found. No optional aesthetic finding or unresolved design ambiguity is elevated into a defect.

## Commands, runtime and stopping record

- Case-sensitive Python filesystem inventory + SHA-256 manifest verification: **136 paths, no mismatches**.
- `npm test -- --run test/presentation/projects-screen.test.tsx test/presentation/workbench-coordination.test.tsx`: **2 files / 20 tests passed**, Vitest 5.0.5. This runs the established pretest `cn:build` generation; no tracked source changed.
- `node output/playwright/increment-011/reviewer/runtime.cjs`: passed reproduction/setup against existing Vite `http://127.0.0.1:5173`; installed Playwright driver, native Chrome **157.0.8103.51**, headless disposable context, synthetic data only.
- Default sandbox Chrome launch was denied by process sandbox; rerun with scoped escalation succeeded. This was environment access, not a product defect or harness repair.
- `responsive.cjs`: initial duplicate New token selector (toolbar and empty-state action) adapted in **one bounded repair cycle**. Its recheck then timed out on RGB entry scale because the synthetic token's default unspecified layer does not enter the eligible editor flow. This is an unsuitable fixture, not proof of a product defect. No further harness repair/recheck was attempted. Remaining responsive checks stay unverified.
- No full test/build rerun: developer records the full relocation suite and final build/type scopes passing; no concrete regression risk justified duplicating that cost during independent review. Mutation testing was not performed because the frozen reviewer scope prohibits production/test edits.

Approximate reviewer verification/review consumption: **17 of 20 minutes** (includes source/static review, commands, diagnostics and waits). One reviewer harness repair cycle; combined with coordinator's recorded one, the campaign's **two-cycle ceiling is reached**. Shared estimate on receipt was 23.5 minutes; after this review approximately **40.5/60 aggregate minutes**, before fix/recheck effort. Stop because actionable findings are established and further runtime work would require another harness repair. Product fixes remain authorized; use targeted regression checks and preserve existing unverified acceptance. No earlier stopped qualification was resumed.

## R2 targeted independent disposition — 15 November 2026

**Both required findings resolved for the checked paths. No remaining actionable finding from this review.** This disposition supersedes the r1 changes-requested verdict for P1/P2; all earlier unverified acceptance remains unverified.

Exact target: `increment-011-final-r2`, `review-source-manifest-r2.json` and `review-source-r2.patch`, same base commit. Independently verified all **136** case-sensitive manifest entries/hashes/deletions, no mismatches. The recorded four-path delta is App, ProjectsScreen and their two existing test files; original r1 manifest/patch remain separate.

- **P1 resolved:** Restore callback now records an explicit `restoreOpen` request and disposes preview. App effect issues the request from the subsequent render with `hasPreview` false. Normal `useProjects.open` preview/pending/unknown/retained guards remain intact. The added App-level test checks normal Open remains blocked while preview is active, then restore completion reaches Workbench with exactly one `openProject` call. Independently reran the **unchanged proven** `reviewer/runtime.cjs`: same synthetic create/download/same-ID-review/Open local project scenario now enters Workbench (`.workbench` count **1**) with no page errors, native Chrome 157.0.8103.51 at 720×800. Browser explicitly closed. This samples Open local; successful mutation/retained completion shares the fixed callback but was not separately run live.
- **P2 resolved:** Project recovery, one `project-error` alert, notices and catalogue retry now render in a bounded, scrollable Project feedback region outside both hidden panes. Input's existing error association is retained. New narrow render test verifies hidden browse plus exposed error/recovery/retry region and exactly one error ID. Source review confirms ordinary project Open errors reach this region without changing the active selection or pane. No live storage-failure injection or new 320/short-height feedback geometry claim.

Commands: unchanged synthetic runtime command and `npm test -- --run test/presentation/projects-screen.test.tsx test/presentation/workbench-coordination.test.tsx` — **2 files / 22 tests passed**. No full suite/build, new fixture, selector change or harness repair. R1 screenshot preserved as `reviewer/restore-open-blocked-r1.png`; R2 screenshot is `reviewer/restore-open-fixed-r2.png` (the unchanged script's original output filename also now contains R2).

R2 review/recheck approximately **2 minutes**, cumulative reviewer approximately **19/20 minutes**. Campaign estimate approximately **46/60 aggregate minutes** using the coordinator's latest 44-minute pre-recheck estimate. Harness cycles remain **2/2** aggregate, no R2 repair. Stopped after focused fixes were independently supported; broader responsive/editor/scroll/zoom/modal acceptance gaps remain as recorded. Source unchanged by reviewer; Vite server left root-owned.
