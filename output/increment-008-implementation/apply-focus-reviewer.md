# Independent Apply focus recheck

12 November 2026. Baseline `7b13b69`; stable source and regression script identified by `apply-focus-snapshot.sha256`. SHA256 validation returned OK for both files before review. Read the agreed Apply focus follow-up and inspected the source diff and regression script before running or consulting developer evidence. No developer conclusions were used.

## Verdict

No corrective finding. The targeted fix passes the independently observed successful Apply, invalid Apply and Cancel focus checks in Chrome. This closes the successful Apply focus issue for the representative editable literal session exercised. No broader Increment 008 or 007 qualification is claimed.

## Source assessment

`useTokenEditor.ts` replaces immediate successful-Apply focus with a local request flag and effect gated by `!accepting`. The request is set only after the successful result resets the session and reports success; early invalid-input and command-failure returns do not request mode focus. The effect runs after the React commit that enables the containing fieldset, consumes the request and focuses the existing mode ref. Cancel retains its existing direct-focus path. The effect has no timer or asynchronous callback; unmount removes the effect and clears the ref, so this change introduces no post-teardown deferred focus mechanism. Runtime teardown during pending Apply was not exercised.

## Independently observed Chrome evidence

Used the existing installed Playwright CLI, session `dtw008`, and disposable selected editable token on local Vite. No CUA/native launch or new harness was used.

1. Executed the manifest-listed `test/browser/apply-focus.mjs` through `run-code`. It changed Red, applied, waited for the retained notice, asserted actual activeElement is the enabled Literal color button, and checked the authored channel remained the applied value. Passed; CLI return code 0.
2. Separate direct runtime check entered invalid Red text `-`, clicked Apply, asserted actual focus on `#editor-error`, and confirmed raw `-` remained preserved. Then clicked Cancel, asserted actual Literal color focus, and checked the prior applied channel was restored. Passed; CLI return code 0.

Unexpected host/storage command rejection and teardown while awaiting a host reply remain source-inspected rather than runtime-observed. The successful-only request placement and absence of deferred effect work support those expectations, but this report does not claim those scenarios were executed.

## Consumption and scope

Approximately 2 aggregate reviewer minutes including source/contract inspection, manifest validation, both Chrome calls and this evidence handoff; zero harness-repair cycles. Both browser subprocesses completed promptly (under one second execution each; tool responses approximately six and four seconds). No tests/build/suite/007 checks, source/test edits, staging, commits or pushes. Stopping within the three-minute allocation.
