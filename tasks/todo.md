# Proposed guidance maintenance tasks

**Not authorized for implementation.** See [review and plan](plan.md) for evidence,
scope and exclusions. Checkboxes describe future work, not current delivery.

## Task 1 — Use the semantic ring for description focus

- [ ] Add textarea to the existing shared focus-visible treatment; preserve native
  text, resize and label behavior without introducing a new primitive.
- [ ] Check keyboard focus from Name to Description to Group, modal Cancel focus
  return, multiline exact text and a narrow viewport with the focused field visible.
- [ ] Confirm the textarea outline uses the ring color and established offset.

Files: `src/presentation/styles.css`. Small. Dependencies: none.
Verification: real browser computed-style and keyboard checks; final strict
typechecks/tests/build. Do not add a test that merely searches for a CSS selector.

## Task 2 — Share color-edit eligibility

- [ ] Extract the current eligibility predicate into a pure application-owned
  policy, used by operation enforcement and presentation consumers.
- [ ] Preserve rejection of non-color, name-only, unassigned, conditional,
  multi-assignment, component, expression and composite cases; preserve eligible
  literals/references, broken-reference repair eligibility and protected manual edits.
- [ ] Keep failure messages/codes, whole-candidate validation and atomic storage
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

- [ ] Task 1 browser evidence and Task 2 behavioral checks pass.
- [ ] No change to exact authored values, aliases, draft/apply semantics or storage.

## Task 3 — Optional static class cleanup

- [ ] Express the resolved heading's intended alignment with one justify utility.
- [ ] Give Input field/search appearances mutually exclusive background classes.
- [ ] Preserve search surface/padding and resolved-heading wrapping/alignment;
  do not migrate class composition or add `cn`.

Files: `src/presentation/Editor.tsx`, `src/presentation/components/input.tsx`.
Small. Dependencies: none; include only if the user selects this optional task.
Verification: before/after browser computed styles and representative narrow/wide
rendering. Do not claim a behavioral fix where this audit found no visible defect.

## Task 4 — Reconcile guidance

- [ ] Replace visual direction's obsolete implementation statement with a link to
  the current delivered scope; keep future inspection patterns illustrative.
- [ ] Update README's test-file description to include maintained TSX tests.
- [ ] Update status and this task list with actual outcomes and limits only after
  delivery; preserve historical evidence and pending Increment 007 decisions.

Files: `docs/project/visual-direction.md`, `README.md`, `docs/status/current.md`,
`tasks/plan.md`, `tasks/todo.md`. Medium. Dependencies: selected implementation tasks
for completion claims; prose corrections themselves are independent.
Verification: manual Markdown/link/terminology review and `git diff --check`.

## Checkpoint — Final verification and independent review

- [ ] Run `npm test` and a production build including all strict typechecks, using
  isolated output when an existing preview needs preservation.
- [ ] Run scoped browser checks described above; record actual viewport/zoom where
  relevant and distinguish source/tests from live-browser observations.
- [ ] Pause edits and identify a stable snapshot for a fresh-context reviewer with
  the approved scope, owning guidance and evidence. Resolve/recheck findings.
- [ ] Record remaining limits; leave staging, commits and pushes to the user.
