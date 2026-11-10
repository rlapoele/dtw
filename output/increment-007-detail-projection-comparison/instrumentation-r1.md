# R1 — target renderer coverage correction

**Offline correction, 10 November 2026. No browser or benchmark rerun.**
The [initial independent review](independent-review.md) found that the original verdict
combined every CrRendererMain process, allowing another renderer's whole task to supply
missing target-page coverage. This affected possible positive reuse; both recorded
negative opening observations were already independently verified in their target PID.

The detector now requires an explicit externally identified target PID, or resolves
an exact supplied page-frame ID/URL through trace frame/process metadata. Missing or
ambiguous ownership is inconclusive. Only that PID's CrRendererMain events supply
coverage, maxima or failure. A missing target thread/whole task remains inconclusive;
a known target's >100ms Layout still fails even without whole-task coverage. Foreign
renderer events cannot supply coverage or decide the target verdict. Future runner
calls provide the exact page frame ID from their page-scoped CDP session. These callers
were edited offline only; no subsequent execution/build is represented by this patch.

The exact reviewer counterexample (targetPID1 has only1ms Layout; unrelatedPID2 has
1ms RunTask) first failed the new assertion under the old code, then returned
**inconclusive** after correction. Additional missing/ambiguous-owner regressions pass.
The frozen191.793ms target Layout still fails. **Seven focused tests pass** and isolated
strict typecheck passes; [logs](r1-focused-tests.txt), [red witness](r1-red-tests.txt),
[typecheck](r1-typecheck.txt).

[Offline replay](r1-offline-replay.json) processes all32 saved traces using the exact
loopback target URL in trace-start frame metadata. **All30 non-navigation verdicts
retain their status.** Both navigation periods start before target URL ownership is
present, so are conservatively **inconclusive**, replacing their old coverage pass.
This is a corrected evidence interpretation, not new timing data. Both failures and
their target-only task/Layout durations remain:

| Candidate / owner | Task | Layout |
| --- | ---: | ---: |
| Pre / PID18320 |120.547ms|110.780ms|
| Textarea / PID18826 |128.683ms|119.338ms|

The [combined handoff](comparison-summary.md), candidate reports, old source archives,
builds, browser results and traces retain their historical bytes. The original116-file
manifest is preserved as both `manifest.json` and `manifest-v1.json`; changed old active
source is archived in `pre-r1-source/`. [Version mapping](r1-version-map.json) verifies
the original116 hashes using those archived paths for the five changed source files.
`manifest-r1.json` identifies the corrected offline snapshot and excludes reviewer-owned
files/directories. It does not replace original browser source/build identity.

All projection/fidelity/whole-wire/native/scale/Safari gaps remain open. No UI, protocol,
new workload, production, original prototype, dependency, Git index, commit or push
change; no browser/settings/clipboard operation. Both candidates remain failed.
