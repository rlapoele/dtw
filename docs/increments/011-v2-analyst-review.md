# Increment 011 — V2 analyst consistency review

**Completed bounded source/static review — 15 November 2026.** Reviewed baseline:
commit `ae75f29`, containing [Projects V2](../project/workbench-layout/projects-shell-v2.md),
[Workbench V2](../project/workbench-layout/workbench-shell-v2.md), their SVGs,
[state sheet](../project/workbench-layout/v2-state-sheet.svg) and
[React map V2](../project/workbench-layout/component-map-v2.md). The user approved
this identified set and React decomposition **for analyst review**, not final
contract/design agreement or implementation. This review creates no application
acceptance or permission to begin implementation.

## Expected behavior derived before source assessment

Projects selection must be separate from opening. Its read-only inspector and
selected backup must work without instantiating the token editor or acquiring
editing ownership. Open/Create/Restore and uncertain results retain current safety
semantics. All project management is on Projects; Workbench retains guarded return,
context and safety feedback. Undo/Redo controls and history belong to 012.

Responsive Workbench must preserve one editor session, including invalid raw input,
reference/literal mode, tabs, display settings and dirty/recovery state. Back,
collapse, drawer and resize are presentation actions; they cannot cancel, apply,
mutate, retry a write or bypass departure. Coherent visual refinement covers all
current workspace/editor/feedback/dialog states, not only geometry.

## Findings and dispositions

| ID / classification | Concrete issue or question and evidence | Disposition / affected acceptance |
| --- | --- | --- |
| AR-1 — source-assumption correction, resolved in draft | V2 warns catalogue facts cannot supply backup revision and conditionally suggests additional details/header reads. Supported CatalogueEntry **already includes revision** (`src/application/retention/ports.ts:43`); catalogue derives name/counts/revision from the same decoded record (`src/adapters/browser/indexeddb-retention.ts:128–160`). It is coherent at read time, not guaranteed latest indefinitely. | Use exact read-only catalogue fields; capture selected supported ID/revision and invoke existing revision-checked backup. No additional detail read or full ProjectHeader is needed for the proposed inspector. Draft AC-11/12 and operation flow now specify this; V2 art/notes remain untouched as reviewed baseline. This is technical clarification, not a new visual design. |
| AR-2 — architectural risk avoided, resolved in draft | Reusing openProject merely to inspect/back up would acquire ownership (`src/application/retention/service.ts:174–178`), update worker loaded state (`src/presentation/host/worker-runtime.ts:210–225`) and, through useProjects.open, enter Workbench. Existing backup directly rereads selected ID and checks revision (`worker-runtime.ts:106–120`); it does not depend on loaded snapshot or ownership. | Selection never calls openProject. Existing backup helper accepts ID/revision (`src/presentation/host/backup-file.ts:4–23`). Stale revision fails, then refresh/review and a new explicit Download are required. Another tab's editing ownership alone is not a backup prohibition. Preserve pending/unknown/restore gates, no takeover. AC-9/11/12. |
| AR-3 — ownership ambiguity, resolved in proposed organisation | V2 map suggests screen-local selected ID while its notes require restoring selection/scroll after Workbench. App currently branches away from ProjectsScreen (`src/presentation/app/App.tsx:28–64`); screen-local state alone would disappear. | App owns retained Projects page context, separately from useProjects.opened project. ProjectsScreen owns mounted layout/focus effects. The [resulting tree/matrix](../project/workbench-layout/presentation-organisation-v2.md) makes physical location, caller and lifetime explicit. No simultaneous second page/editor is needed. AC-13/14. |
| AR-4 — scope/semantics reconciliation, resolved in draft | Existing creation calls recoverCreated after retained acceptance and that opens the project (`src/presentation/projects/useProjects.ts:52–67,105–127`). Create cannot quietly become only list selection. Restore owns staged local revision/backup acknowledgement and unknown recovery (`project-backup/RestoreDialog/useBackupRestore.ts`). | Keep create-and-open, exact accepted name, retained/read-unavailable and unknown recovery. Keep App file/preview refs and RestoreDialog authority. Catalogue backup does not stand in for fresh replacement acknowledgement. AC-8/13. Delete, metadata editing and external Import/Export remain excluded. |
| AR-5 — final design decisions, unresolved agreement | V2 recommends 1120/880 thresholds, select-then-Edit/Inspect at narrow sizes, focus-based resize, Back/reopen with preserved scroll, Apply/Cancel staying in inspection, inline Projects forms, read-only project fields, compact routine guidance and persistent-storage relocation. These are explicit proposals despite approval for review. | No demonstrated contradiction with the bounded scope/domain rules. Present these policies together with final Draft and organisation refinement for agreement; do not silently treat them as already agreed. Material changes return to user/design before renewed analyst review. AC-1–8/10–14. |
| AR-6 — implementation preservation risk, future verification | App currently keys Workbench by project ID; Workbench keys TokenEditor by selection ID/editorVersion (`App.tsx:48`, `Workbench.tsx:419–424`); TokenEditor is the sole editor-hook caller. Moving a keyed child under different responsive ancestors can still remount it. Static art cannot prove state/focus preservation. | Keep stable editor ancestry/key and one hook caller; layout owns visibility/focus only. Focused later tests/browser checks must prove exact invalid input, hidden-draft departure, dialogs and source revision lifetime. This is an unverified future implementation requirement, not a demonstrated V2 defect. AC-4–9/14. |

No demonstrated material visual contradiction was established that requires a
revised designer artifact before final agreement. This does not establish visual
usability or native-control fit. AR-5 remains a required agreement gate; application
implementation remains Not started.

## Concrete organisation refinement

The [proposed resulting presentation tree](../project/workbench-layout/presentation-organisation-v2.md)
includes every current presentation file and marks new/moved files. It distinguishes
generic UI, shared application chrome, Projects composition, Workbench composition,
backup orchestration, token display and host/theme infrastructure. It records the
removal of the Workbench-only backup hook after its restore responsibilities move
to the existing App path and download sequencing to useProjects.

The user's further clarification applies to **all file kinds**, not only hooks or
helpers: purpose, owner and actual consumers determine placement. Meaningful local
hooks/helpers folders are allowed; neither global folders per file kind nor blanket
flatness is required. React call owner/lifetime is a separate matrix column. These
are proposed implementation directions, not source changes or a new architecture.

## Material assumptions and decisions still needed

- Final agreement chooses the identified V2 interaction policies, exact inspector
  fields and Projects capabilities, together with AC-11–14 and the refined tree.
- Supported catalogue revision plus existing backup is sufficient because no extra
  project metadata/ownership field is in 011. Adding description, dates or writable
  state would change that scope and requires explicit review.
- Backup errors remain attached to their captured project even if catalogue facts
  refresh; no automatic write retry or silent newer-revision download is permitted.
- The proposed implementation verification budget must be assessed for the full
  Projects/workbench UI scope before verification starts. No historical allowance
  or successful old test is new runtime evidence for 011.

## Evidence and limits

Reviewed repository instructions/workflow, draft contract, V2 prose/component map,
SVG labels/structure, delivered ownership/endorsed organisation, product/architecture/
presentation constraints, current status and relevant source boundaries. Source
inspection focused on App/useProjects, catalogue/service/worker backup and ownership,
restore coordination, Workbench layout/keying/status and current presentation inventory.
Prior rendered previews remain the coordinator's artifact evidence; this analyst
review did not rerender or claim a new pixel-level visual audit. No application code,
dependencies, test/build/browser/runtime/storage qualification, harness repair,
staging, commit or push occurred. Source/prose inspection cannot prove CSS fit,
keyboard/focus behavior, hidden-surface accessibility or React session preservation.

Approximately **8.5 analyst review minutes** used, within the assigned 10-minute
analyst ceiling and new 15-minute aggregate follow-up (coordinator at most 5).
Ordinary contract/tree authoring is separate from verification. Prior V1 10/10 and
V2 artifact 7/8 remain stopped; cumulative consumption before this review was about
17 minutes, not zero. New cumulative planning ceiling is about 33 minutes including
the prior 18-minute ceiling. Checks stop here; unresolved runtime requirements remain
unverified. Coordinator records its own consumption without rerunning this review.

Suggested commit: `docs: review 011 V2 contract and presentation ownership`
