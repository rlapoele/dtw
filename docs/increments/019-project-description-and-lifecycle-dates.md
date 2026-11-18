# Increment 019: Project description and lifecycle dates

- Contract status: Agreed
- Delivery status: Partially completed — implementation and independent review finished; browser coverage gaps below
- Behavior agreement: on 18 November 2026 the user requested description at creation and `creationDate` / `lastUpdatedDate`, and confirmed exact restore preserves dates, successful Undo/Redo establishes a new update date, and legacy dates remain unknown until an edit establishes `lastUpdatedDate`.
- Display agreement: the user also confirmed description and read-only Created / Last updated in the existing project inspector.
- Final contract agreement and implementation authorization: granted by the user on 18 November 2026, explicitly including storage/backup migration and independent review.
- References: [project model](../design-tokens/conceptual-model.md#project-ownership-and-identity), [architecture](../project/architecture.md#application-operations), [interoperability](../design-tokens/interoperability.md), [presentation conventions](../project/presentation-conventions.md), [workflow](../workflow/agent-roles.md).

## Outcome

Users can describe a project when creating it. Projects retain truthful creation and modification timestamps alongside their applied content, including through backup and restore.

## Scope

- Optional multiline description in the existing creation form, passed through the worker protocol and retained creation operation. Preserve accepted text; empty input omits the optional description.
- Read-only project lifecycle metadata with UTC ISO timestamp strings; any visible dates use local presentation rather than changing stored values.
- Timestamp updates coordinated with existing atomic application writes, including history traversal, unknown-outcome reconciliation and versioned backup/retention admission.
- Existing projects and old backups remain readable without invented historical dates.
- Excluded: project metadata editing, sorting, new audit fields, authorship, DTCG export mappings, new storage technology and previously deferred Increment 007 qualification.
- Description and read-only Created / Last updated in the existing project inspector, through the bounded catalogue projection.

## Acceptance criteria

- AC-1: Creating a project with optional multiline description preserves that description in the applied snapshot and backup. Leaving it empty produces no description. Existing required-name behavior remains unchanged.
- AC-2: Unfinished description participates in the existing leave protection. Pending, failed and unknown creation preserves inputs; confirmed successful creation clears them through the existing recovery flow. Description uses existing owned controls and accessible labeling.
- AC-3: New creation sets `creationDate` and `lastUpdatedDate` to the same canonical UTC timestamp. A known creation date remains fixed under ordinary edits and Undo/Redo. Neither field is user-editable.
- AC-4: Every successful applied metadata/token/group change, including successful Undo/Redo, establishes `lastUpdatedDate` for that write. Reads, drafts, no-ops, rejected writes and backup downloads do not change either date. No-op comparison excludes automatically generated lifecycle differences.
- AC-5: One injected clock reading supplies the timestamp of a write attempt. Content and dates are committed together; unknown-outcome checks and accepted-attempt recovery preserve that attempt's timestamp instead of generating another. Domain operations remain deterministic and host-independent.
- AC-6: Restoring a supported backup preserves its project dates exactly, including absent dates. Backup wrapper `createdAt` continues to mean backup generation time. Restore never substitutes that date or the current time for missing project dates.
- AC-7: Legacy projects remain readable with unknown dates. Their next ordinary applied change establishes only `lastUpdatedDate`; unknown `creationDate` remains absent. Undo to an older snapshot does not roll lifecycle metadata backward or erase a subsequently known update date.
- AC-8: New readers accept supported old/new authored versions with closed, version-specific validation. Malformed timestamps, unsupported fields and unknown versions reject whole without partial conversion or writes. New output identifies the new authored version so older builds refuse it safely.
- AC-9: The project inspector shows the description when supplied and read-only Created / Last updated values in local time. Missing dates display as unknown. Long/multiline descriptions follow existing bounded display conventions, with access to the supplied content; catalogue refresh and unavailable-entry behavior remain intact.

## Agreed implementation and migration boundary

The pre-implementation baseline used retained `recordVersion: 1 | 2` and `authoredVersion: 1`; backup envelopes use `formatVersion: 1` and `authoredVersion: 1`. Its project fields were closed to `id`, `name` and optional `description`. Record version 2 enables history receipts, independently of authored schema.

Agreed migration strategy:

1. Introduce authored version 2 with optional `creationDate` and `lastUpdatedDate` in the project snapshot. Both are optional to represent legacy unknowns and exact restores; new creation supplies both.
2. Keep retained record versions 1/2 and backup format version 1 because their envelope shapes and receipt semantics do not change. Decoders explicitly support authored versions 1/2; version 1 retains its original closed field rules.
3. Read old snapshots without inventing dates or rewriting storage on open. Emit authored version 2 for newly accepted writes and generated backups. Exporting a legacy snapshot changes its envelope version, not its missing lifecycle facts. Preserve the existing record-version rule for history receipts.
4. Admit canonical millisecond UTC strings using the existing backup timestamp validation pattern, including parse/round-trip validation. Timestamps come from the host clock; they are informational and do not replace opaque revisions or imply cross-device clock ordering.
5. Detect substantive no-ops before stamping. For ordinary edits and history traversal, preserve creation metadata from the current retained project and stamp the candidate update date. Restore bypasses stamping and preserves the imported project metadata. Keep date stamping inside the existing write preparation/acceptance boundary.

This is the agreed scoped migration, not a new generic migration framework. Implementation and independent review covered codec, retained-record, catalogue, protocol and history consumers against the identified baseline.

## Decisions and interface assessment

- Agreed behavior: lifecycle semantics stated above; optional description at creation; UTC ISO representation with local display.
- Recommended interface: add one labeled optional textarea beneath Project name using existing form conventions. This is a small extension of an established interaction; no separate substantial interface exploration is proposed.
- Agreed inspector scope: show description and read-only Created / Last updated using existing inspector conventions. Extend the catalogue projection; unknown dates display as unknown, never as today's date. No design overhaul is needed.
- No additional dates or audit fields are recommended for this increment.
- Final contract agreement and implementation authorization were granted on 18 November 2026.

## Verification approach

- Essential behavior tests: creation with/without description, exact multiline round-trip, fixed creation date, ordinary applied update, no-op/rejection unchanged, injected clock called once for an attempted write, unknown recovery reusing the stored attempt, Undo/Redo after multiple changes, and legacy first edit followed by Undo/Redo.
- Integrity tests: legacy/new retained records and backups, exact restore with known/absent dates, wrapper time distinct from project dates, malformed date rejection, version-specific unsupported-field rejection and unknown-version refusal without retention changes.
- UI verification: focused Chrome creation flow with multiline description, pending/error/input preservation, keyboard labels/focus and representative desktop/narrow layout; inspect known/unknown dates and a long/multiline description in the project inspector. Run relevant typechecks and focused tests; broaden only for a concrete uncovered risk.
- Planning review used approximately three minutes of source analysis plus a bounded documentation pass; no application tests or browser checks run. Implementation verification starts with a shared ceiling of 30 aggregate minutes and two harness-repair cycles under the [shared stopping rules](../workflow/agent-roles.md#proportionate-verification).
- Excluded: stress runs, broader engine qualification, full retention/crash campaigns and all deferred Increment 007 qualification. Existing deferrals remain unresolved and are not reset by this work.

## Review baseline

Implementation baseline: `2c04a98259437a0061284333db51df2d46a765f9`; working tree clean before recording authorization. Give the independent reviewer the agreed contract and an identified stable source snapshot. No staging, committing or pushing is part of this increment's agent authority.


## Completion report — 18 November 2026

### Result

Implementation and independent review are finished, with no actionable review
findings. Optional multiline description is retained at creation and displayed in
the project inspector alongside local Created / Last updated values. Application
writes stamp lifecycle dates using an injected clock; exact restore preserves them.
New writes/backups use authored version 2, with closed backward reading of version 1.
No staging, committing or pushing was performed.

Delivery remains partially completed for the browser evidence gaps described below;
this does not identify a demonstrated product defect or claim user acceptance.

### Acceptance evidence

| Criterion | Evidence and result | Status |
|---|---|---|
| AC-1 — description creation/backup | Lifecycle test preserves exact whitespace/multiline text and omits empty description. Chrome creation/readback succeeded. | Verified |
| AC-2 — unfinished inputs and recovery | Live description-only beforeunload handler prevented a cancelable event; accessible textarea used by role. Observed unknown creation preserved both inputs; confirmed success cleared them. Pending/rejected paths inspected in source but not forced in Chrome. | Partially verified |
| AC-3 — creation dates | Lifecycle tests establish equal new dates and fixed creation date through edits and history. Inspector is read-only. | Verified |
| AC-4 — applied updates only | Lifecycle/history tests cover ordinary changes, Undo/Redo, no-op, rejection, reads and backup; no-op comparison excludes lifecycle fields. | Verified |
| AC-5 — atomic attempt timestamp | Injected-clock tests cover one reading per attempt and both unknown/interrupted recovery paths without restamping. Source review confirms domain independence. | Verified |
| AC-6 — exact restore | Known/absent dates round-trip and restore unchanged, with wrapper generation time separate and no clock call. | Verified |
| AC-7 — legacy unknown dates | Old record admission and repeated legacy Undo/Redo tests preserve absent creation date and establish current update dates. | Verified |
| AC-8 — version migration | Legacy/new record and backup tests cover closed versions, malformed/noncanonical dates, unsupported fields and future versions. New output emits authored version 2. | Verified |
| AC-9 — inspector | Static tests cover absent dates as Unknown. Desktop/narrow Chrome screenshots show multiline content/local dates. Independent Chrome check confirmed 60-line description bounded to 192px, keyboard-focusable and scrollable to its final line. Catalogue/unavailable behavior reviewed. | Verified |

### Checks and independent review

- Developer: `npm run typecheck` passed. `npm test -- test/application/retention test/presentation/retention-protocol.test.ts test/presentation/projects-screen.test.tsx` passed 68 tests in 10 files. After one additional inspector test, `npm test -- test/presentation/projects-screen.test.tsx` passed 8 tests; the combined suite was not rerun or claimed as a 69-test run.
- Independent reviewer: `/root/metadata_reviewer`; 45 focused tests passed across lifecycle, history, codec, project-screen and protocol suites. No actionable findings or unresolved disagreements.
- Review snapshot: base `2c04a98259437a0061284333db51df2d46a765f9`, tracked patch SHA-256 `e83bdac15da2df33ce83a547143e347aa4686121acaedcbf57afa756d0cfd0c8`, plus new `test/application/retention/lifecycle.test.ts` SHA-256 `7ed97886f653e5571dbd78a90991ce6de9bec67caee8b2a4cdad86cf888f6a9f`. Only coordinator completion/status documentation changed after this review snapshot.
- Browser artifacts: [desktop](../../output/playwright/increment-019-desktop.png) and [narrow](../../output/playwright/increment-019-narrow.png), using synthetic projects on isolated origin `127.0.0.1:5199`. User data on `localhost:5173` was not changed.
- Browser verification found a missed creation-attempt protocol description field during development; it was fixed and regression-tested before the independent snapshot.
- Affected-tree review: existing private form/inspector ownership and App-level hook lifetime remain coherent; clock stays at the application/host boundary. No dependencies or redundant wrappers added.
- `git diff --check` passed. Approximately 22 aggregate verification minutes consumed (developer 10, reviewer approximately 9 including bounded follow-ups, coordinator approximately 3), one harness repair. Stopped after relevant checks; no old qualification campaign restarted.

### Limits and next actions

Forced delayed-pending, known-rejected creation and retained-but-unreadable recovery
have not been exercised in Chrome. Application rejection/recovery tests and source
inspection support the implementation, but do not prove React input preservation
in those exact UI states. The live leave-handler test does not establish Chrome's
native confirmation-dialog behavior. A future explicitly bounded verification pass
can close these remaining UI evidence gaps; broader Increment 007 deferrals remain.
No additional product decision or implementation authorization is needed.

User review and commit remain with the user. Suggested commit:
`feat: retain project descriptions and lifecycle dates`.
