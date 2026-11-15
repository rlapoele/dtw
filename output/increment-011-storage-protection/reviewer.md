# Independent review — automatic storage protection

15 November 2026. Snapshot `storage-protection-r1`, base
`3ee9ed95cab1958757b5bb20f42c3af99dc8ffac`.

**Disposition: no actionable findings in the bounded AC-15 amendment review.**
This is source and controlled-test evidence, not native-browser grant or prompt
qualification and not completion of the earlier Increment 011 acceptance campaign.

## Expectations and scope

Derived expectations from the agreed automatic-storage-protection amendment and
AC-15 before examining implementation. Also read repository instructions, the
reviewer/proportionate-verification rules, current ownership map and presentation
conventions. Used the code-review-and-quality skill. Did not read the developer
report or use its conclusions as proof.

Expected startup query without permission request; confirmed retained create or
restore notification independently of readback/open; at most one automatic
attempt per App lifetime; deduplicated manual retry with fresh query; truthful
controlled status and conflict gates; browser failures isolated from command
acceptance and existing restore protections. No domain, host, worker, schema or
dependency changes were required.

All 15 manifest file SHA-256 values matched before and after review. The exact
patch contains the same 15 paths as the manifest. Patch SHA-256:
`a77ad2640f1a2153cc53395300e29f3ac6b9278d0962d15ec5812b2cb63d5a9b`.
The concurrent global.css slider edit and baseline Workbench/workbench directory
case issue were excluded; neither is attributed to this amendment. No production,
test, requirement, README or ownership-map edits, staging or Git mutations occurred.

## Assessment

- App invokes the status owner unconditionally before screen branching. Startup
  reads are cached in a ref. Strict Mode effect replay and pending notification
  continuations use that read; the attempt flag is set before issuing a request.
  Manual retry consumes the automatic opportunity, uses an in-flight guard and
  rechecks actual status before requesting. Positive API results alone publish
  protected. Native sync throws and rejected promises become typed error states.
- Creation notifies on both immediate and later confirmed retained results before
  consume/readback. Notification failure is isolated; unknown/rejected outcomes,
  ordinary open and preview do not notify. Restore forwards the distinct callback
  through RestoreDialog and notifies only in the retained branch, before consume,
  with its existing accepted flag deduplicating acknowledgements. Open local
  remains a separate callback. Existing command calls and guards are preserved.
- Projects receives controlled status/retry. Checking, requesting, protected and
  unsupported states omit retry; unprotected and error states offer it through
  the existing conflicting-operation/preview gate. The owned Button, semantic
  utilities, status semantics, independent-backup/browser-deletion caveats and
  session-only draft wording are retained.
- Reviewed changed tests first, then source and callers. Tests exercise pending
  startup, repeated acknowledgement/effect replay, refusal/error/retry, actual
  create/restore outcomes including later confirmation and unavailable readback,
  separation from Open local, and App status across screen branches. Source
  inspection additionally checked the non-awaiting notification boundary and
  manual/automatic interleavings. No material correctness, ownership, dependency,
  security or performance regression was identified in scope.

## Independent verification and limits

Command:

```text
npx vitest run test/presentation/storage-persistence.test.tsx test/presentation/projects-screen.test.tsx test/presentation/workbench-coordination.test.tsx
```

Result: **3 files, 38 tests passed**, exit 0; Vitest reported 292 ms duration.
Also independently checked manifest hashes and exact patch/manifest path equality.
No full suite or build repetition; the coordinator retains the final build gate.

Controlled hook runners mock React hooks, browser API results and host promises;
static-markup tests check rendered status/action states. These support scoped
logic and wiring but do not establish actual React DOM mounting, native Strict
Mode behavior, browser-specific permission/grant UX, or real keyboard/focus/visual
acceptance. No browser harness, forced grant, new test infrastructure or source
mutation experiment was attempted; the explicit reviewer source-freeze rule
precludes the generic skill's mutation-test suggestion. Existing earlier 007/011
qualification remains stopped and unverified where already recorded.

Review effort: approximately **5 minutes of the 7-minute reviewer allowance**,
**0 harness-repair cycles**. Stopped after the scoped source assessment and useful
targeted checks; no demonstrated defect justified expanding verification.
