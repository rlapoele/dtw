# Increment 008 developer handoff

Base: `9ce3622` on `dev`. Source/test snapshot: [snapshot.sha256](snapshot.sha256),
with exact paths in [changed-files.txt](changed-files.txt). The coordinator owns the
contract/status changes; this developer changed only the listed source/test paths
and this evidence directory. Edits are frozen for independent review. Nothing was
staged, committed or pushed.

## Ownership and reset map

- `useProjectReadback`: one applied project projection owner, header/context/rows,
  selected inspection, unavailable state, revision-scoped lazy diagnostics and read
  generations. Workbench explicitly supplies selection intent. Refresh publishes
  header/context/selected inspection together before bounded 100-row batches.
  Teardown and explicit departure invalidate both generations. New refresh also
  invalidates pending selection reads; inspection checks revision as well as identity.
- `useProjectCommands`: one authoring command owner; pure command-state reducer,
  synchronous active-issue lock, original-result check, retained-readback recovery,
  single completion ref. Retry reading never issues a command. Completion is cleared
  before recovered completion is called. Existing public recovery messages remain.
- `useCreationForm`: one form session with pure reducer for opening and coupled
  fields/baseline. Field actions mark dirty together. Revision changes revoke review;
  missing original targets/parents block mutation. Open deliberately resets fields;
  failed commands preserve them; close/discard clear only their existing dirty scope.
  Workbench supplies post-completion selection/filter/panel-focus intent.
- `useTokenEditor`: one hook inside keyed `EditableTokenInspector`, shared by the
  header and `EditorFields`. No Workbench feedback state or child-to-parent preview
  effect remains. Existing pure `state/session.ts` helpers, initial/baseline refs,
  accepting/recovery transitions and focus refs remain the authority. A standalone
  `Editor` composition serves existing rendering tests. The obsolete `onFeedback`
  test prop was removed with its mirror; no external application API changed.
- Workbench owns selection/filter, editor version, guarded pending departures and
  lifecycle coordination. Project-ID App key and `[selection.id, editorVersion]`
  editor key remain. Revision still keys AllContent and ExactSource, never drafts.
  Collapse uses `hidden`, preserving the mounted editor session. Apply/Cancel keep
  mode-button focus; form errors retain their focus ref; creation/departure retain
  panel/form final-focus routing and guard nesting inside CreationDialog.
- App composes `useWorkbenchHost` (effect-backed ensure/reset/dispose lifetime) and
  `useProjects` (catalogue/create/open/reconciliation semantic actions). App retains
  restore-preview and leaving-dialog presentation intent. Catalogue and open-project
  authoring owners remain separate.
- `useBackupRestore`: one staged restore session, original finish/check/restage
  behavior, and pure protection/acknowledgement reducer. Every protection revision
  change resets acknowledgement. Restore view retains its DOM and entry points.
- `useWorkbenchLayout`: media listener/pane booleans only. WorkbenchHeader,
  TokenBrowser, ProjectDiagnostics, WorkbenchInspector, RetentionRecovery and
  DepartureGuard compose existing markup, with recovery/diagnostic/editor slots and
  explicit focus/file refs. No view gains host or storage authority.

## Verification and bounds

Developer verification consumption: approximately **7 aggregate minutes**, zero
harness-repair cycles. This estimate includes focused inspection, diagnostic output,
run waits and affected rechecks; ordinary implementation and product/type corrections
are separate. The shared ceiling is 30 minutes/two repairs; at least 23 minutes remain
before coordinator/reviewer consumption is added. Developer stops verification here.

- Focused final command: `npm test -- test/presentation/workbench-coordination.test.tsx test/presentation/session.test.ts test/presentation/worker-client.test.tsx test/presentation/retention-protocol.test.ts test/presentation/identity-presentation.test.tsx` — **32 tests / 5 files passed**.
- New characterization tests exercise actual extracted hooks with controlled host
  promises and a small deterministic React-hook stub: superseded coherent refresh,
  selection/diagnostic fences, explicit invalidation of outstanding reads, duplicate
  issue lock, retained/unavailable readback, once-only completion/no replay, checking
  the original unknown attempt, missing-parent creation preservation, replacement
  protection invalidation and dirty raw-editor preservation across baseline refresh.
  This stub is ordering/state evidence; it does not establish real React lifecycle,
  focus or browser behavior.
- `npm run build` — **passed** all four typechecks and production bundling. Initial
  build attempts exposed extraction/test type mistakes (narrowed union, missing view
  setter, fixture/mock typing, leftover close setter); these were corrected, with
  final affected tests/build passing. No checks were disabled or suppressed.
- `git diff --check` — passed.
- Logs: [focused-tests.txt](focused-tests.txt), [build.txt](build.txt).
- Representative Chrome smoke is reserved for independent review/coordinator. Vite
  is running at `http://127.0.0.1:5173/` (execution session 3235). Sandbox listening
  initially returned EPERM; authorized escalation started Vite normally. No Chrome
  DevTools connector was available to this developer. No legacy 007 harness used.

AC-1 source ownership is implemented. Focused tests provide bounded AC-2–6 ordering,
raw-session and reconciliation evidence. Real focus, dialog containment/return,
compact drawer, pane visibility and visual parity in AC-7 remain for representative
browser review. No exhaustive restore/recovery/browser qualification is claimed.
No dependency, domain, application, worker protocol, storage or backup format change;
no full suite, old deferred 007 qualification, stress or other-engine run occurred.

Suggested commit message: `refactor: separate workbench state owners and composition`
