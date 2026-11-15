# Increment 012 independent review

15 November 2026. Reviewed base `cf3fa82` plus `source.diff`/live source described by `source-manifest.json`. All **27 manifest SHA256 hashes matched** before inspection. No production, test, contract or index edits made. Coordinator documentation changes are outside the source manifest. Expectations were derived from AGENTS, final agreement, amended V1, ownership delta, architecture and presentation conventions before reading implementation. Developer evidence was read only after independent source/test assessment. Applied code-review-and-quality skill; its mutation experiment was omitted because the explicit frozen-source/no-test-edits instruction takes precedence.

## Finding

**R1 — P2, required: preserve history-guard focus return after Keep editing/Escape (AC-7/AC-10).**

Scenario: with a dirty token draft and available Undo, activate header Undo, then Keep editing (or Escape). `src/presentation/Workbench/Workbench.tsx:268` clears `historyIntent` while closing the guard; the `finalFocus` callback at lines 269–273 chooses `historyReturn.current` only while that intent exists. On the closing render it therefore returns the browse panel instead. This contradicts V1's pre-dialog focus restoration, even though raw draft data is preserved.

Evidence is source-level: owned DialogContent forwards the callback to Base UI unchanged. Installed `dialog/popup/DialogPopup.js:95` passes it as `returnFocus`; `floating-ui-react/components/FloatingFocusManager.js:487–518` evaluates the **latest** callback during cleanup, then targets the panel's first tabbable child (or panel), rather than the captured invoking history button. This is not an observed Chrome reproduction. Preserve the captured return target independently of clearing the descriptive intent until close focus restoration completes. Recheck Keep editing and Escape with a dirty invalid raw value, verifying exact input, no traversal and the invoking control's focus. Do not broaden the modal/focus campaign.

No other actionable defect was identified in this bounded review. No invented integrity issue or general refactor request is raised.

## Independently verified

- Seven targeted Vitest files: **53 tests passed**, including application history/bounds, retained-record decoder, host protocol, hook coordination, worker client and shortcut matching. Command: `npm test -- --run test/application/retention/history.test.ts test/application/retention/history-bounds.test.ts test/application/retention/record.test.ts test/presentation/history-shortcuts.test.tsx test/presentation/workbench-coordination.test.tsx test/presentation/worker-client.test.tsx test/presentation/retention-protocol.test.ts`.
- AC-1–3: tests and implementation cover four operations, exact authored snapshots/identities/aliases, separate accepted steps, no-op revision/write/Redo preservation and acknowledged branching.
- AC-4–6: tests cover rejection retry, unknown proof once, unreadable accepted traversal blocking, interrupted original receipt/no replay, mixed Apply/Undo synchronous mutation gate. Source follows existing atomic commit with expected revision/incarnation and project-target receipt; renderer cannot submit a history snapshot.
- AC-8–9: tests cover external revision/incarnation invalidation, unchanged resume, suspension, departure and new-worker empty history; source explicitly ends history on successful departure. Existing old decoder refuses v2; new decoder accepts v1/v2, rejects v1 Undo/Redo receipts and preserves v2 on later writes. No authored/backup format change.
- AC-10–12 static: history reconciliation uses stable IDs and ancestor scope, passive Redo, shared Icon/Button, 44px utilities, `sm` label presentation and readable descriptions; shortcut eligibility excludes editable/modal/composition/repeat/handled cases. R1 remains above.
- AC-13: bounded-history tests exercise injected count and byte limits; source counts shared serialized payload and clears oversize accepted steps without rejecting their data.
- Architecture/readability/security/performance: application owns bounded detached history; worker/host boundaries remain explicit, no dependencies added, no unbounded retained history. Presentation policy remains in Workbench-owned hook/header rather than domain core. No broader performance claim.

## Unverified and evidence limits

No independent Chrome observations were obtained. Existing `dtw012` session was unavailable both sandboxed and with the authorized cached CLI escalation. An attempted disposable session was refused by sandbox cache permissions; no browser installation or repair was performed. These are tooling limits, not application defects. Independent 320/640/wide geometry, native typing/modal keys, actual guard return focus, selection/focus scheduling and browser recovery remain unverified. Developer's disclosed representative browser evidence is supporting evidence, not this reviewer's runtime acceptance. Root/developer should recheck R1 within the existing allowance.

The targeted tests do not directly exercise the new useWorkbenchHistory hook or assembled guard. Application tests and static review are not a full UI/recovery acceptance matrix. Count/byte tests use small injected limits, not maximum payload stress. No broad engine, old-app-browser, stress, full accessibility, fresh build or full-suite rerun was performed. Developer reported build/typecheck evidence was read, not independently re-run. Final user acceptance remains separate.

## Verdict and stopping

**Request narrow correction/recheck for R1.** Core retained-history integrity had no demonstrated blocker in the reviewed snapshot; the focus mismatch is bounded and does not justify reopening earlier qualification campaigns.

Independent review consumed approximately **11.5 minutes** including reads, diagnostics, targeted tests, CLI waits and report preparation; **zero harness repairs** and zero source repairs. Shared usage after this review: developer 18 + reviewer 11.5 = approximately **29.5/40 minutes**, with developer's 1/2 repair cycles carried forward; coordinator accounting remains authoritative. Stop this review here. An updated source snapshot and focused R1 disposition are required before claiming it resolved.

## R2 focused disposition

Reviewed `source-manifest-r2.json`: all 27 hashes match live files; compared with original manifest, only `src/presentation/workbench/Workbench.tsx` changed. The narrow delta retains `guardHistoryReturn` independently of descriptive intent, captures it while a history guard is open, resets it for an ordinary guard opening and uses the connected captured target for closing focus restoration. **R1 is resolved at source level.** No additional actionable finding in that delta. Original snapshot/report remain preserved; this disposition supersedes the initial request-changes verdict for R1.

Coordinator supplied developer Chrome recheck results for Keep editing and Escape preserving invalid raw input/history and focusing the invoking Undo, plus passing final typecheck. These are supporting developer observations, not independent runtime checks. No tests/browser restarted. Total independent review approximately **12 minutes**, zero harness repairs; stopped at allocation. With R1 corrected, no actionable findings remain; original verification/acceptance limits remain explicit.
