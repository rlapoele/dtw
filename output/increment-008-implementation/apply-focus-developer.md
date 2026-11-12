# Apply focus follow-up — developer

Baseline `7b13b69`. Frozen source/test snapshot:
[apply-focus-snapshot.sha256](apply-focus-snapshot.sha256).
Only production change: `hooks/useTokenEditor.ts`; new real-browser regression:
`test/browser/apply-focus.mjs`. Contract amendment belongs to the coordinator.
No staging, commit, push, dependency change or 007 qualification.

## Reproduction and causal diagnosis

Existing Chrome session `dtw008`, Vite `http://127.0.0.1:5173/`, retained project
`Increment 008 smoke`, token `smoke`. Before editing production source, changing Red
to `0.35` and applying successfully left `document.activeElement.tagName === "BODY"`.
A temporary native `HTMLElement.prototype.focus` trace recorded exactly one call:
`{text:"Literal color",disabled:true,fieldset:true}`. This establishes that the
synchronous success focus ran while the mode button still inherited disabled from
the retaining fieldset. `setAccepting(false)` had queued a React update without
committing the enabled fieldset yet. Cancel runs outside that asynchronous retaining
transition and was unaffected.

The real-browser regression asserted successful canonical channel retention and
native focus on the enabled Literal color button. It failed before the fix with
`page.waitForFunction: Timeout 1500ms exceeded`; see
[apply-focus-before.txt](apply-focus-before.txt).

## Fix and verification

Successful Apply now requests one-shot focus state. An effect handles that request
after React commits `accepting === false`, focuses the mode control and consumes the
request. Rejection/throw/validation paths never request success focus; Cancel and
existing error-focus behavior remain unchanged. An unmounted editor discards its
local pending focus request.

- The identical real-browser regression passed after the fix; see
  [apply-focus-after.txt](apply-focus-after.txt).
- In the same Chrome page, invalid Red `-` followed by Apply focused `#editor-error`.
  Cancel then restored focus to Literal color. Both were asserted with bounded
  1500ms native-focus checks. No storage-failure injection was performed; source
  branches preserve existing failure returns before the success request.
- `npm test -- test/presentation/workbench-coordination.test.tsx test/presentation/session.test.ts`:
  **16 tests / two files passed**; [apply-focus-tests.txt](apply-focus-tests.txt).
- `git diff --check` passed before handoff. No broad build/full suite was run.

Verification consumed approximately **5.5 aggregate minutes**, including source
triage, browser/tool waits and rechecks. **One conservative harness-repair cycle**:
corrected the initial regression waitForFunction options (the first attempt was
bounded by an outer 20-second timeout), then reran; the corrected pre-fix regression
failed at 1500ms as intended. Adding hook state caused a Vite hot-reload hook-order
error; a normal full page reload restored the page, and the final pass used the
fresh real React mount. The first post-change check was bounded at ten seconds.
No stalled launch/native-app route or further qualification was attempted.

Developer verification stops here. Against the separate 10-minute follow-up cap,
approximately 4.5 minutes remain for reviewer/coordinator; the one repair allowance
is consumed. This does not reopen any earlier acceptance gaps.

Reviewer instructions: Chrome CLI session `dtw008` remains at the selected smoke
color, clean and focused on Literal color after Cancel. Read the regression file,
remove `export default ` and preceding comments, and pass its function expression
to the existing absolute Playwright CLI `-s=dtw008 run-code`. No reload is needed
unless source changes. The regression toggles Red between `0.35` and `0.45` and
retains that value in the disposable smoke project.

Suggested commit: `fix: restore editor focus after Apply commits`
