# Independent slice 2 review — 10 November 2026

Reviewed base `5c22404e34ea9a9b39e1bb6da1135c2719440536` plus all 36 files in `../slice2-manifest.json`; every hash matched before inspection. Scope is the retained workbench checkpoint and the first review's fixes, not pending backup/restore UI, full recovery/lifecycle or final performance qualification. Expectations remain the amended agreed contract and its P/S/F/B/E policies, current production baseline and reviewed V3 revision 2/V4 design.

## Prior findings

- **R1 partly resolved:** named input/result validation and request-operation correlation now exist. Nested selected-inspection validation remains incomplete; see S2-1.
- **R2 resolved for the reported defects:** descriptor-safe traversal precedes retained field access; whitespace-only internal IDs reject, while authored opaque IDs remain allowed. A separate boundary-accounting regression is S2-3.
- **R3 resolved:** the writer now uses explicit schema ordering, including the required wrapper order.
- **R4 resolved:** duplicate-key/numeric tests now use otherwise-valid wrappers and positive controls. Independently disabling the duplicate-key guard in a reviewer copy makes the new nested duplicate test fail (12 pass/1 fail), unlike the first snapshot.
- **R5 resolved:** known acceptance readback checks database incarnation, revision and complete receipt, and marks mismatches unavailable without changing the known acceptance.
- **R6 resolved:** uncertain checks compare full receipt and revision, preserving conflicting evidence as unknown.
- **R7 resolved:** candidate staging is application-owned and no longer imports the concrete infrastructure adapter.

## Required findings

1. **S2-1 — Complete runtime validation of selected derived output.** `src/presentation/host/validation.ts`, inspection output branch, checks only the resolution's outer keys/status and that trace/diagnostics are arrays. It accepts `status: resolved` without a value, `trace: [42]`, `diagnostics: [false]`, invented authoredKind and an inconsistent editable flag. The included probe passes all of those malformed fields together. These are not runtime-validated DTOs despite their TypeScript types. Validate each supported resolution variant, nested trace/diagnostic/value shape and closed enums; check semantic eligibility/value-kind correlation where the transport promises it. Keep this focused and avoid a general schema framework. Both worker and renderer consume this validator, so fix it once with malformed/positive cases.

2. **S2-2 — Do not apply the authored single-string ceiling to serialized exact source.** `validateHostOutput` calls `plainTree(output)` before its source branch. `plainTree` caps every string at 65,536 units, so a complete pretty source over that size is rejected in the worker before publication. A supported name of exactly 65,536 units produces an admitted/backuppable token whose source exceeds the limit; the reviewer probe demonstrates its source response rejects with `decoded-string`. This makes the E-policy exceptional-source path impossible, even though that policy explicitly preserves complete serialized presentation text above 65,536. Validate source framing/text against its own output contract and existing bounded authored envelope, preserving exact complete text; do not raise authored admission caps or truncate the source.

3. **S2-3 — Keep retained metadata outside snapshot resource accounting.** `decodeRetainedRecord` now calls the snapshot-budgeted `plainTree(input)` on the complete record. A snapshot with exactly 4,194,304 decoded snapshot key/string units successfully passes `admitSnapshot` and `encodeBackup`, but adding the required record metadata causes retained decoding to reject `decoded-string-total`. The probe uses 64 valid group descriptions, each within the single-string limit, and no tokens/large entity count. This can acknowledge an accepted command whose own readback and all later reopen attempts become unavailable. Descriptor/prototype validation must still cover the whole record, while snapshot string/value/depth budgets apply to the snapshot only and metadata receives its separately specified shallow closed bounds. Add valid-max snapshot→record→load/backup round-trip checks.

## Verification and limits

- Independent all-three strict typechecks, full suite **1,009 tests / 41 files**, and production build to `/tmp/dtw-007-reviewer-slice2-dist` pass.
- Three reviewer-only counterexample probes pass; their source/config sits beside this report. The aggregate-boundary case is approximately 4 MiB serialized, well within existing limits; it is a deterministic codec probe, not a renderer stress or capacity qualification.
- The duplicate-key mutation is killed by the new test. Production files remain unchanged.
- Source review confirms separate display DTOs preserve actual type/kind/metadata without inventing canonical assignments for readonly values. Source requests are separate and read responses use generation/context checks. These observations do not certify maximum renderer work, all races or complete protocol validation.
- Developer-attributed nine-case Chrome functional evidence was inspected. No independent browser run, clipboard access or user-session interaction was performed. The designer's separate fidelity check is not included as reviewer execution.
- Full recovery, all-content worst cases, resource intersections, native exact-access and latency distributions remain pending checkpoint work; no final Increment 007 acceptance or broad support claim follows.

Verdict: address S2-1–S2-3 and recheck the affected boundaries; the remaining implementation may proceed with these findings carried forward. No unrelated pending feature is reported as a checkpoint defect.
