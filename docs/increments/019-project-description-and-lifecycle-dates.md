# Increment 019: Project description and lifecycle dates

- Contract status: Draft
- Delivery status: Not started
- Behavior agreement: on 18 November 2026 the user requested description at creation and `creationDate` / `lastUpdatedDate`, and confirmed exact restore preserves dates, successful Undo/Redo establishes a new update date, and legacy dates remain unknown until an edit establishes `lastUpdatedDate`.
- Display agreement: the user also confirmed description and read-only Created / Last updated in the existing project inspector.
- Final contract agreement and implementation authorization: pending. Behavior agreement does not authorize production implementation.
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

## Proposed implementation and migration boundary

Current source uses retained `recordVersion: 1 | 2` and `authoredVersion: 1`; backup envelopes use `formatVersion: 1` and `authoredVersion: 1`. Project fields are closed to `id`, `name` and optional `description`. Record version 2 enables history receipts, independently of authored schema.

Proposed strategy for contract review:

1. Introduce authored version 2 with optional `creationDate` and `lastUpdatedDate` in the project snapshot. Both are optional to represent legacy unknowns and exact restores; new creation supplies both.
2. Keep retained record versions 1/2 and backup format version 1 because their envelope shapes and receipt semantics do not change. Decoders explicitly support authored versions 1/2; version 1 retains its original closed field rules.
3. Read old snapshots without inventing dates or rewriting storage on open. Emit authored version 2 for newly accepted writes and generated backups. Exporting a legacy snapshot changes its envelope version, not its missing lifecycle facts. Preserve the existing record-version rule for history receipts.
4. Admit canonical millisecond UTC strings using the existing backup timestamp validation pattern, including parse/round-trip validation. Timestamps come from the host clock; they are informational and do not replace opaque revisions or imply cross-device clock ordering.
5. Detect substantive no-ops before stamping. For ordinary edits and history traversal, preserve creation metadata from the current retained project and stamp the candidate update date. Restore bypasses stamping and preserves the imported project metadata. Keep date stamping inside the existing write preparation/acceptance boundary.

This is a scoped migration proposal, not a new generic migration framework or an agreed production format change. Developer review should verify all codec, retained-record, catalogue, protocol and history consumers against the identified implementation baseline.

## Decisions and interface assessment

- Agreed behavior: lifecycle semantics stated above; optional description at creation; UTC ISO representation with local display.
- Recommended interface: add one labeled optional textarea beneath Project name using existing form conventions. This is a small extension of an established interaction; no separate substantial interface exploration is proposed.
- Agreed inspector scope: show description and read-only Created / Last updated using existing inspector conventions. Extend the catalogue projection; unknown dates display as unknown, never as today's date. No design overhaul is needed.
- No additional dates or audit fields are recommended for this increment.
- Final contract agreement and implementation start remain pending; existing behavior agreement must not be requested again.

## Verification approach

- Essential behavior tests: creation with/without description, exact multiline round-trip, fixed creation date, ordinary applied update, no-op/rejection unchanged, injected clock called once for an attempted write, unknown recovery reusing the stored attempt, Undo/Redo after multiple changes, and legacy first edit followed by Undo/Redo.
- Integrity tests: legacy/new retained records and backups, exact restore with known/absent dates, wrapper time distinct from project dates, malformed date rejection, version-specific unsupported-field rejection and unknown-version refusal without retention changes.
- UI verification: focused Chrome creation flow with multiline description, pending/error/input preservation, keyboard labels/focus and representative desktop/narrow layout; inspect known/unknown dates and a long/multiline description in the project inspector. Run relevant typechecks and focused tests; broaden only for a concrete uncovered risk.
- Planning review used approximately three minutes of source analysis plus a bounded documentation pass; no application tests or browser checks run. Implementation verification has not started. Before implementation, coordinator records one cumulative budget; proposed ceiling is 30 aggregate minutes and two harness-repair cycles under the [shared stopping rules](../workflow/agent-roles.md#proportionate-verification).
- Excluded: stress runs, broader engine qualification, full retention/crash campaigns and all deferred Increment 007 qualification. Existing deferrals remain unresolved and are not reset by this work.

## Review baseline

Before implementation, record the current commit and pre-existing changes. Give the independent reviewer the agreed contract and an identified stable source snapshot. No staging, committing or pushing is part of this increment's agent authority.
