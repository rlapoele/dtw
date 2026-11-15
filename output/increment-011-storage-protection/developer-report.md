# Increment 011 automatic storage protection — developer handoff

15 November 2026. Implementation baseline: `3ee9ed9`. This report covers only the
AC-15 amendment, not the earlier stopped responsive qualification campaign.

## Delivered behavior

- App calls `useStoragePersistence` before its Projects/Workbench branch. Startup
  queries actual browser persistence without requesting it. Ref-owned startup,
  attempt and in-flight facts survive rerenders and effect setup replay.
- Confirmed create acknowledgement and restore `finish` acknowledgement notify
  App before consume/readback/open, including later confirmed unknown outcomes and
  unavailable readback. Notification exceptions/rejections are isolated from the
  retained command outcome. Create command IDs and the restore accepted ref prevent
  repeated notifications; App independently limits automatic attempts to one.
- Ordinary Open local, existing-project open, staging/preview and rejected or
  still-unknown results do not notify retention. Existing App queued restore-open
  and preview gates are preserved.
- Projects renders controlled checking/requesting/protected/unprotected/unsupported/
  check-error/request-error status. The permanent request button and screen-local
  notice are removed. Conditional retry honors existing pending/retained/unknown/
  preview gates, rechecks actual status, and consumes the automatic opportunity.
- Native adapter catches capability/query/request failures. Positive results alone
  mean protected; partial APIs do not expose an unusable action. Saving never waits
  for persistence work. Backup, browser deletion and session-only draft caveats remain.
- README and current ownership map describe the delivered owners. No dependency,
  host, worker, domain, schema or storage-protocol change.

## AC-15 evidence

Controlled tests cover initial true/false/unavailable/throwing APIs; pending startup
plus repeated acknowledgements; in-flight retry deduplication; refusal followed by
retry; retry discovering already-granted status without a new request; request
failure recovery; effect setup replay; confirmed create despite failed reading;
unknown create later confirmed; restore available/unavailable/unknown/rejected;
notification throw/rejection isolation; actual App create/restore notification
wiring and status across the Workbench branch; preview/Open local non-trigger;
and conditional status/action rendering with all project gates.

The existing deterministic hook runner explicitly replays effect setup with retained
refs. This is controlled React-owner evidence, not a real browser Strict Mode mount
or a native browser permission acceptance claim.

## Commands and results

Tests were written before their corresponding implementation. Initial expected red
runs failed for the missing owner, missing acknowledgement callbacks and missing
controlled status rendering. Focused implementation runs passed. Final commands:

- `npm test -- test/presentation/storage-persistence.test.tsx test/presentation/projects-screen.test.tsx test/presentation/workbench-coordination.test.tsx test/presentation/retention-protocol.test.ts test/presentation/increment-009.test.tsx` — 5 files, 46 tests passed.
- `npm run build` — four strict TypeScript scopes and production Vite build passed.
  Existing >500 kB bundle advisory remains; no threshold was changed.
- `git diff --check` — passed.

One intermediate combined check exposed a partial-API TypeScript narrowing issue
and a controlled navigator fixture lacking Base UI platform fields during dynamic
module import. The adapter now uses an optional capability type; the fixture is
installed after importing App. Final affected tests and build passed. No browser
harness was introduced or repaired; no dependencies installed.

Approximate developer verification/review consumption: **5 of 10 minutes**, including
source/diff review, diagnostics, expected-red runs and final checks. Ordinary test
fixture and product implementation time is separate. No further qualification is
needed for this handoff. The original 46/60-minute and 2/2-cycle campaign remains
stopped. Independent review has not yet occurred.

## Scope and remaining limits

Native grant/prompt/refusal UX depends on the browser and was not forced or tested.
No new browser matrix, storage stress or earlier responsive acceptance was attempted.
Existing recorded UI/qualification gaps remain unchanged.

`src/presentation/styles/global.css` changed concurrently (range thumb geometry).
The developer did not edit it; the coordinator identified it as concurrent user
work. Preserve and exclude it from amendment authorship/review scope. Contract and
status changes are coordinator-owned. The committed Workbench path-casing issue
identified by the coordinator is outside this amendment.

Source/test/current-map edits are now frozen for independent review. New files:

- `src/presentation/app/hooks/useStoragePersistence.ts`
- `src/presentation/projects/components/StorageProtection/StorageProtection.tsx`
- `test/presentation/storage-persistence.test.tsx`
- this report

No staging, commit or push performed.

## Sources and routine choices

React 19.3.1 is installed. App ref lifetime/effect replay follows the official
[useRef](https://react.dev/reference/react/useRef) and
[useEffect](https://react.dev/reference/react/useEffect) references, retrieved through
Context7 on 15 November 2026. Browser method meanings follow the amendment's checked
[StorageManager.persisted](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persisted)
and [StorageManager.persist](https://developer.mozilla.org/en-US/docs/Web/API/StorageManager/persist)
references. No new product decision or durable preference was introduced.

Suggested commit: `feat: protect retained projects with browser storage persistence`
