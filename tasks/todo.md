# Guidance maintenance tasks

**Authorized by the user on 9 November 2026, including optional Task 3.** See
[review and plan](plan.md) for scope and exclusions and
[developer evidence](../output/guidance-maintenance/developer-evidence.md),
[coordinator browser evidence](../output/guidance-maintenance/coordinator-browser-evidence.md)
and [independent review](../output/guidance-maintenance/independent-review.md)
for completed checks and explicit limits. All selected tasks are complete.

## Task 1 — Use the semantic ring for description focus

- [x] Add textarea to the existing shared focus-visible treatment; preserve native
  text, resize and label behavior without introducing a new primitive.
- [x] Check keyboard focus from Name to Description to Group, modal Cancel focus
  return, multiline exact text and a narrow viewport with the focused field visible.
- [x] Confirm the textarea outline uses the ring color and established offset.

Files: `src/presentation/styles.css`. Small. Dependencies: none.
Verification: real browser computed-style and keyboard checks; final strict
typechecks/tests/build. Do not add a test that merely searches for a CSS selector.

## Task 2 — Share color-edit eligibility

- [x] Extract the current eligibility predicate into a pure application-owned
  policy, used by operation enforcement and presentation consumers.
- [x] Preserve rejection of non-color, name-only, unassigned, conditional,
  multi-assignment, component, expression and composite cases; preserve eligible
  literals/references, broken-reference repair eligibility and protected manual edits.
- [x] Keep failure messages/codes, whole-candidate validation and atomic storage
  behavior unchanged, including failures caused by unrelated diagnostics.

Files: new `src/application/color-revision-policy.ts`, `src/application/authoring.ts`,
`src/presentation/session.ts`, focused application policy tests and existing
`test/application/color-revision.test.ts` as necessary. Medium. Dependencies: none.
The presentation `eligible` name may remain an import/export alias for the shared
predicate; do not keep a second implementation or add a pass-through wrapper.

Verification: focused behavioral matrix over the shared policy; existing operation
tests for eligibility, repair and storage; browser check that an ordinary literal
is editable and the maintained inspect-only fixture remains read-only. No new
general policy registry or dependency.

## Checkpoint — Selected corrections

- [x] Task 1 browser evidence and Task 2 behavioral checks pass.
- [x] No change to exact authored values, aliases, draft/apply semantics or storage.

## Task 3 — Optional static class cleanup

- [x] Express the resolved heading's intended alignment with one justify utility.
- [x] Give Input field/search appearances mutually exclusive background classes.
- [x] Preserve search surface/padding and resolved-heading wrapping/alignment;
  do not migrate class composition or add `cn`.

Files: `src/presentation/Editor.tsx`, `src/presentation/components/input.tsx`.
Small. Dependencies: none; selected by the user on 9 November 2026.
Verification: before/after browser computed styles and representative narrow/wide
rendering. Do not claim a behavioral fix where this audit found no visible defect.

## Task 4 — Reconcile guidance

- [x] Replace visual direction's obsolete implementation statement with a link to
  the current delivered scope; keep future inspection patterns illustrative.
- [x] Update README's test-file description to include maintained TSX tests.
- [x] Update status and this task list with actual outcomes and limits only after
  delivery; preserve historical evidence and pending Increment 007 decisions.

Files: `docs/project/visual-direction.md`, `README.md`, `docs/status/current.md`,
`tasks/plan.md`, `tasks/todo.md`. Medium. Dependencies: selected implementation tasks
for completion claims; prose corrections themselves are independent.
Verification: manual Markdown/link/terminology review and `git diff --check`.

## Checkpoint — Final verification and independent review

- [x] Run `npm test` and a production build including all strict typechecks, using
  isolated output when an existing preview needs preservation.
- [x] Run scoped browser checks described above; record actual viewport/zoom where
  relevant and distinguish source/tests from live-browser observations.
- [x] Pause edits and identify a stable snapshot for a fresh-context reviewer with
  the approved scope, owning guidance and evidence. Resolve/recheck findings.
- [x] Record remaining limits; leave staging, commits and pushes to the user.
