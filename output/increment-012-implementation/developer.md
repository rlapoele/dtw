# Increment 012 developer evidence

15 November 2026. Base `cf3fa82`; implementation authorized by the final agreement in the increment contract. This is developer evidence, not independent review or completion approval. Source edits are paused for the reviewer.

## Delivered behavior

- Application-owned, session-only snapshot history covers create group, rename group, create color token and explicit color revision. Exact authored data and stable identities are replayed through the existing retention port with a fresh revision and project-target receipt.
- Fifty steps / 32 MiB serialized UTF-8 shared snapshot payload, oldest eviction and oversized-step clearing. Snapshot targets are application-private, previously admitted states. No renderer snapshot API or backup/history persistence was added. Existing new-edit validation is preserved; exact prior diagnostic baselines can be restored.
- Exact authored no-op returns `unchanged` without writing a revision or destroying Redo. Only proven acknowledgment changes history; unknown/rejected/unreadable and interrupted-worker flows retain the existing command authority.
- Internal record v2 is emitted for Undo/Redo and preserved by subsequent writes. New reader accepts v1 and v2, and refuses unknown versions/v1 history receipts. The previous v1 decoder's version refusal supplies old-reader safe refusal; no authored format or backup envelope change.
- Existing `useProjectCommands` remains the synchronous mutation gate. Header and keyboard call it; recovery checks/read retries share that gate. Workbench history interaction/selection/focus lives in its own hook, with controls under the header owner.
- Header uses Heroicons Outline, text at >=640 CSS px, icon-only below, 44px minimum targets and nearby action/reason descriptions. Native editable/dialog keyboard ownership is retained, Cmd/Ctrl+Z and Shift+Z are scoped to eligible Workbench focus. Captured draft discard revalidates the revision/incarnation and exact history step.

## Verification actually performed

Approximate developer verification: **18 minutes**, including source diagnostics, test-data correction, tooling waits, browser observations and final recheck. Ordinary implementation/correction authoring was separate (roughly 10 minutes). **One repair cycle** charged conservatively for correcting test fixtures that used noncanonical trailing-zero decimals and an inadmissible reference diagnostic setup; no new browser tooling/dependency installation. Sandbox permission retries used the existing cached CLI. Shared remaining allowance: 22/40 minutes before reviewer/coordinator consumption; reviewer allocation remains 12 minutes.

- Behavior-first initial four history tests failed because the API did not exist, then passed after application implementation.
- `npm test`: 57 files / 1122 tests passed after initial UI integration. This predates the final added recovery cases and focus correction; it is not a claim of a final full-suite rerun.
- Latest targeted run: seven files / 53 tests passed (history, bounds, record, protocol, hook coordination, worker client and shortcut eligibility). It includes retained-unreadable traversal, same-baseline resume, incarnation invalidation, original Undo receipt recovery after worker fencing, no replay and once-only mixed Apply/Undo checks. This predates the final delivery focus scheduling correction.
- `npm run build` passed with all four TypeScript projects after recovery additions. Existing Vite large-chunk warning remains; no dependency/bundle redesign in scope.
- Final `npm run typecheck` passed after the final focus correction.
- Chrome through already-cached Playwright CLI, disposable profile and synthetic projects only. Wide/320/640 screenshots are adjacent. No admission maxima, stress matrix, other engines or earlier qualification campaign was run.

## Criterion evidence and limits

| Criteria | Evidence | Limits |
| --- | --- | --- |
| AC-1–2 | Application tests undo/redo all four operations, exact canonical decimal strings, literal space, alias identity and creation metadata; repair rename Undo restores admitted collision baseline. Project-target v2 decoder test. Chrome token create/Apply reversal. | Namespace descendants/reference preservation follows full exact snapshot restoration; no broad graph stress campaign. Old-reader refusal checked from owning baseline decoder policy, not a second old app browser. |
| AC-3 | No-op preserves record object/revision/write count/Redo; new acknowledged edit branches. Atomic multi-field Apply Undo observed in Chrome. | Native text Undo can leave the editor's existing touched-draft state dirty; history traversal then correctly requests discard even when displayed input equals applied text. |
| AC-4–6 | Rejected retry retains step/data; unknown retained check advances once; unreadable acceptance blocks writes until read retry; gate test mixes Apply/Undo and repeated check; worker test fences original Undo and never replays it. | Browser recovery fault injection was **not performed**. The evidence is application/worker-client/hook level. |
| AC-7 | Chrome invalid raw Red text survives Keep editing exactly. Explicit Discard and undo removes creation without Apply. Guard initial focus is Keep editing. Keyboard Shift+Z with dirty input opens the same guard. | A representative creation dialog was used; no exhaustive modal matrix. |
| AC-8–9 | Application tests revision/incarnation invalidation, suspension block, same-baseline resume preservation, departure clearing and fresh-worker no-history reconstruction. Cold Chrome reopen shows empty history and retained project contents. | Browser two-tab ownership/replacement restore matrix not repeated. |
| AC-10 | Chrome selected creation Undo removes editor; passive Redo restores row without selecting it; surviving clean editor updates both reverted fields; 320 inspection returns browse. Final focus correction rechecked on fresh mount: `document.activeElement` is BUTTON with aria-label **Redo: Create final-accent** after terminal acknowledgment. | Ancestor-scope fallback implemented by stable parent IDs but not separately browser-observed. |
| AC-11 | Chrome 320px and 640px document scroll width equals viewport. Both history controls >=44x44; label display none at320 and block at640; SVG `aria-hidden=true`. Header visible in 320 inspection. | No full accessibility certification, zoom or full responsive matrix. |
| AC-12 | Chrome native Meta+Z in Red field changed `07` to `0`, leaving application Redo intact. Clean noneditable Meta+Z invoked app Undo; Shift+Z invoked guarded Redo. Pure shortcut tests cover repeat/composition/handled/Alt/Ctrl+Y exclusion. | Modal native typing Undo not separately observed. |
| AC-13 | Count eviction and oversize policy tested using small injected limits in application history tests. Shared snapshot reference accounting implemented. | No maximum-payload/stress performance assertion. |

## Runtime notes

The first focus implementation returned focus to the browse heading/body during narrow selection removal. The final hook waits for unblocked state and opposite branch publication before moving focus; the last fresh-mount Chrome check proved the opposite history button received focus. Screenshots before `final-focus-320.png` illustrate earlier source, not proof of this final focus behavior.

Development hot updates that inserted hooks caused React's development hook-order diagnostic and a remount. Cold reload of final source worked; the final focus evidence was obtained from a new cold mount. The console file therefore contains those development diagnostics; no clean-console claim is made for the entire changing-source browser session.

## Handoff

No staging, committing, pushing or index/casing edits. Existing Git paths use lowercase `workbench` while disk ownership/import paths are `Workbench`; preserve this baseline limitation. New owner files naturally use the disk's uppercase path. Coordinator agreement/status changes are separate from implementation.

Suggested commit: `feat: add guarded session undo and redo`

## Review correction R2 — AC-7/10 cancelled history focus

The independent reviewer identified that clearing `historyIntent` before Base UI calls its latest `finalFocus` callback selects the ordinary departure fallback. Focused Chrome reproduction confirmed a dirty draft followed by header Undo → Keep editing returned focus to **New token**, rather than the invoking Undo control.

Workbench now retains the history guard's captured return element independently through modal close. Each ordinary guard opening explicitly resets that element, preserving the existing unrelated departure fallback. No history mutation, draft or retention logic changed.

Focused fresh-mount Chrome recheck passed for **Keep editing and Escape**: invalid Red input remained exactly `invalid guard`, Undo stayed enabled with its original creation label, Redo remained disabled, and `document.activeElement` equaled the invoking Undo button in both cases. Artifact: `r2-draft-focus.png`. `npm run typecheck` passed after correction. No full-suite/build repeat or new harness repair.

Additional verification approximately **2 minutes**, within the allocated three; developer cumulative **20 minutes**, repair count remains **1**. Source edits are paused again. Original R1 manifest/diff are preserved; updated full source diff is `source-r2.diff`, updated manifest is `source-manifest-r2.json`.
