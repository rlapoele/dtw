# Increment 007 — frozen R4 functional evidence

11 November 2026. Base `5c22404e34ea9a9b39e1bb6da1135c2719440536`;
`s4-r4-before-browser-manifest.json` SHA-256
`21bb0c49f6dca66a53373dceec2bd5d0937bda04a1beacf42b7d748d5db2da0a`.
The manifest identifies 141 source/config/test files and separate production-only
and controlled-test build artifacts. Source remained unchanged during the R4 runs.
This is a review checkpoint, not Increment 007 acceptance or completion.

## Automated checks

- All four TypeScript scopes (domain/application, presentation/browser, tooling,
  dedicated worker) pass. Full suite: 1,023 tests / 44 files pass.
- Native Chrome 157.0.8103.50, own disposable profiles and loopback origins only.
- Production-only `http://127.0.0.1:4332/` build directory
  `/private/tmp/dtw007-production-r4`; no controlled fixture/fault worker in that build.
- Separate controlled build at
  `http://127.0.0.1:4333/test/browser/increment007.html`, directory
  `/private/tmp/dtw007-fixed-s4-r4`. Its explicit fixture adapter injects holds,
  lost terminal observation and readback errors around actual native IndexedDB.
  It uses production composition/service/protocol and real dedicated workers.

## Passing current-source cases

`s4-r4-controlled-chrome.json`: six checks, zero page errors. Exact creation fields
survive an injected unknown result; a real strict native accepted receipt completes
once after Check. An injected readback failure preserves the acknowledged state and
form until explicit read-only recovery. Real `Worker.terminate()` stops an issuer
held after native completion; the new worker reacquires ownership and confirms the
exact original command receipt without replay. A pre-native-dispatch hold followed
by actual termination and an ordered unchanged-baseline read proves nonacceptance.
Escape preserves the recovered form; explicit discard creates no phantom group.
Native facts and injected fault categories are separate in the receipt.

`s4-r4-drafts-chrome.json`: five checks, zero page errors on the production-only
build. Backup excludes an incomplete byte draft while preserving it. File selection
and cancelled same-ID preview preserve both literal/reference sessions, native view
and byte scale. Selected-outside-filter return retains input. Actual same-project
replacement retains the drafts; Review changes no revision, and explicit Reapply
performs a fresh checked command while preserving alpha.

## Failed/incomplete observations retained

- S4 R0/R1 reproduced a discard-guard Escape defect; installed Base UI source
  showed the sibling dialog roots lacked nested topmost context. R2/R4 pass the
  correction, with the guard nested under the active creation dialog.
- R3 draft run exposed revision publication before selected inspection. R4 stages
  selected data with the revision and passes the dirty Review/Reapply case.
- One R3 draft runner attempt stopped on an unsuitable native-select label lookup;
  the role/name selector corrected it without an application change.
- `final-r4-backup-restore-chrome.json` and the bounded diagnostic rerun pass eleven
  steps through real backup download and empty-origin restore, but stop waiting for
  the later Review replacement action. Diagnostic ARIA shows Projects with no
  active preview/error. Immediate selection during catalogue loading is suspected;
  no clean full current-source roundtrip verdict is claimed. The earlier 13-case
  S3 pass is historical, not a substitute for this incomplete rerun.
- Independent final review has identified a real clean-editor baseline defect:
  clean sessions do not synchronize after replacement. It remains open at this
  frozen checkpoint; the passing dirty-session case does not cover it.

## Remaining acceptance

Independent final review/fidelity and required fixes; fresh complete current-source
functional regression; applicable Chrome resource/performance distributions and
ordinary/exceptional source/native checks; actual HTTPS/CSP support evidence and
honest manual outcomes. OS picker cancellation, native clipboard custody/equality,
AT and actual browser zoom are not asserted by file-input automation or viewport
changes. The manual guide remains pending user execution. No Safari/Firefox
qualification, PWA installation/offline delivery, commit, push or deployment claimed.
