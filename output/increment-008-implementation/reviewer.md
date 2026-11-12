# Increment 008 independent review — initial bounded pass

Reviewed 12 November 2026. Baseline `9ce3622` plus the frozen source/test manifest in `changed-files.txt`. `shasum -a 256 -c output/increment-008-implementation/snapshot.sha256` returned OK for every one of the 20 entries before source inspection. No source/test edits, staging, commits or pushes performed.

## Verdict

Incomplete review; no confirmed new correctness defect identified in the inspected code. This is not approval or full acceptance. Browser-dependent AC-7 and portions of AC-2–6 remain unverified. No finding has been silently treated as fixed or accepted.

## Independent expectations and inspected evidence

Read repository instructions, role workflow and the entire agreed Increment 008 contract before implementation assessment. The first combined architecture/presentation/skill read was output-truncated, so those supporting documents were not fully reviewed. Read the code-review-and-quality skill portion included in that output. Developer rationale/evidence was not read before deriving expectations or inspecting source; no developer completion claims were used.

Inspected the complete new coordination tests; complete `useProjectCommands`, `useProjectReadback`, `useCreationForm`, `useTokenEditor`, `useBackupRestore`, `useProjects`, `useWorkbenchHost`; complete Workbench and WorkbenchInspector; and tracked diffs for Editor, RestoreDialog and identity-presentation tests. Other extracted render components and App were identified in the manifest but not fully inspected before stopping.

- AC-1: Workbench visibly composes named sections and owns selection/departure/layout intent. Readback, commands, creation, editor, restore and catalogue have distinct owners. The editable inspector creates one `useTokenEditor` instance and passes it to fields and derives its header from the same draft; the previous feedback mirror was removed. No domain/application/worker changes appear in the manifest. Full renderer parity/architecture signoff is incomplete.
- AC-2–3: Editor extraction preserves the existing session helpers, raw-session storage, dirty baseline comparison/review, Apply and Cancel transitions in the inspected diff. Creation retains original-parent validation and exact input fields. The added tests directly cover dirty raw channel preservation and missing-parent mutation refusal. Actual React lifecycle behavior and broader mode/byte/reference combinations were not executed.
- AC-4: Command owner retains immediate `activeMutation` protection for duplicate issue, distinct unknown and retained-pending states, check of original attempt, read-only retry and consumption of completion ref before callback. Controlled tests exercise duplicate issue and once-only completion after unavailable readback and unknown reconciliation. Tests were inspected, not rerun in this pass.
- AC-5: Readback has project and selection generation refs, teardown invalidation, revision checks for selected inspection/diagnostics and bounded 100-row reads. Controlled tests cover older context completion, stale selected/diagnostics responses and explicit invalidation. Refresh retains coherent header/context/selected publication. Actual React batching/effect ordering and all lazy-source paths remain unobserved.
- AC-6: Restore extraction retains known-accepted/unknown separation, protection reset on refreshed stage and explicit retry controls. New protection reducer clears acknowledgement when protection changes and prevents acknowledgement without protection; a focused reducer case asserts this. Full same-ID replacement and restore/departure browser paths remain unobserved.
- AC-7: Source shows the keyed editable inspector remains keyed by selection ID and editorVersion, hidden inspector body remains mounted, main panel ref and departure final-focus callback remain explicitly composed, and departure guard remains inside CreationDialog while that form is open. No browser confirmation of focus, mount preservation, dialog containment, compact drawer or visual parity was achieved.

## Verification limits and findings

No actionable regression can be established from the inspected evidence alone. Inherited editor/restore transitions were treated as preserved behavior, not reported as new defects.

The new coordination test file replaces React hooks with a small deterministic runner. This gives useful ordering tests for host promises and reducer/session logic, but does not establish real React mount, effect, closure, batching or focus behavior. Its stale-selection test explicitly calls `select` and `invalidate`; its teardown case explicitly calls `invalidate` rather than executing a React unmount. Those test names should not be cited as browser or real React lifecycle verification. This is an evidence limitation, not by itself a demonstrated production defect.

No tests, mutation experiments, build, full suite, stress checks or Increment 007 qualification were run by the reviewer. A mutation experiment was omitted to preserve the frozen source/test snapshot and remaining allowance. No developer test/build results have been independently reconciled in this initial pass.

Chrome smoke was attempted through CUA. Creating a Chrome browser tab failed because that browser surface was unavailable. CUA inventory reported no browser surfaces and native Google Chrome not running. Native `getApp("com.google.Chrome")` then stalled for 507.9 seconds and was aborted. No application UI was observed and no browser acceptance path is claimed. No further browser setup or harness work is authorized by this report.

## Consumption and stopping

Approximately 13 aggregate reviewer minutes: about 4–5 minutes initial source/contract/manifest inspection and browser discovery, plus the recorded 507.9-second native Chrome wait. Exact stopwatch start was not recorded; this is a candid estimate. Zero harness-repair cycles. The 10-minute initial allocation was exceeded because the synchronous native-app tool call did not return until interrupted; no checks were continued afterward. Coordinator requested immediate stop and this evidence-only handoff. Remaining shared allowance must be recalculated from actual aggregate consumption; this pass does not reset it.

Useful bounded next action, only if allocated by the coordinator: inspect the remaining extracted rendering/App diffs and use already available browser tooling for representative AC-7 evidence, without another native-app launch attempt. Preserve failed/unverified browser criteria if tooling still blocks.

## Authorized source-only followup

Coordinator allocated a further maximum two aggregate minutes on the same unchanged snapshot. Completed approximately 1.5 minutes of source-only inspection, zero harness repairs, zero runtime/check waits. Total reviewer estimate is approximately 14.5 minutes.

Completed architecture sections previously lost to output truncation and the full presentation conventions. Inspected remaining App composition (including project-ID key, restore entry and unknown-leaving dialog) and its extraction diff; inspected complete TokenBrowser, ProjectDiagnostics, DepartureGuard, RetentionRecovery, WorkbenchHeader and useWorkbenchLayout.

These remaining components retain specific rendering responsibilities and semantic callback boundaries without host/storage authority. TokenBrowser keeps `main#tokens`, forwarded panel ref and revision-keyed AllContent; WorkbenchHeader keeps the backup input ref explicit; diagnostics retain lazy loading via parent callback and incomplete-result wording; departure preserves Base UI DialogContent and finalFocus; layout retains existing breakpoints and simple booleans. Shared Button/Input/Icon/Dialog primitives and semantic class strings remain in use; no new style/theme/icon system was introduced. App preserves the project-ID Workbench key and effect-backed single-host ownership. Catalogue/open coordination remains separate from open-project commands. No confirmed new source defect identified.

Updated verdict: source inspection supports AC-1 ownership and the structural portions of AC-2–7, with no required corrective findings. This is a source review with explicit runtime limits, not blanket acceptance. Reviewer did not execute tests/build or observe Chrome behavior. Coordinator is separately performing Chrome smoke; its observed paths may close corresponding browser gaps, but must be recorded as coordinator evidence rather than reviewer observations. Delayed-host ordering tests remain controlled-runner evidence and do not prove actual React lifecycle behavior. No further reviewer verification is undertaken.
