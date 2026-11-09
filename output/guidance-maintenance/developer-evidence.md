# Guidance maintenance — preliminary developer evidence

**9 November 2026 — developer execution; independent review pending.**

The user authorized all tasks in [the plan](../../tasks/plan.md), including optional
Task 3. This maintenance does not open Increment 007. Starting HEAD was
`4b541f8491e33417fedf8d1e574a8c7bcd3f0113`, with a clean working tree.
No staging, commits, pushes, dependency changes or prototype edits were performed.

## Implemented scope

- Task 1: textarea joins the existing semantic `:focus-visible` ring rule. The
  native textarea and its description, resize, text and label behavior are intact.
- Task 2: `canReviseColorToken` in the application owns bounded manual-revision
  eligibility. The operation calls it and presentation re-exports it as `eligible`;
  no second predicate or wrapper remains. Protection does not prohibit manual
  editing; references are eligible without resolving their targets. Candidate
  validation, constructors, atomic commit and existing operation errors remain.
  The operation's explicit rejection of a missing assignment slot is retained.
- Task 3: resolved heading retains only `justify-start`; field/search background
  classes are mutually exclusive. Search left padding remains deliberate. Button
  additive composition and Base UI callbacks were not changed.
- Task 4: README includes TSX tests; visual direction links current delivered scope
  and retains future patterns as illustrative. Approval and preliminary checklist
  evidence are recorded. Coordinator owns final status/completion after review.

## Automated verification

Developer ran these commands against the final application/test snapshot:

- `npm test`: **983 tests / 36 files passed**, no skips (Vitest 5.0.5).
- `npm run build -- --outDir /tmp/dtw-guidance-maintenance-build`: all three strict
  TypeScript scopes passed, followed by the Vite production build (725 modules).
  The outside-root output notice is informational. No root build output replaced.
- `git diff --check`: passed.
- SHA-256 before/after comparison: all three existing root `dist/` files preserved
  byte-for-byte; see [recorded hashes](dist-preservation.json).

The new policy matrix covers 16 cases, including literal layers/protection,
references to existing/absent/self identities without target lookup, name-only,
unassigned/non-color/component/conditional/multiple-assignment values, non-color
literal, expression, composite and missing assignment slot. Serialized authored
inputs are checked for preservation. Existing revision tests retain graph repair,
whole-project diagnostics, storage failure/atomicity and data-isolation coverage;
the eligibility rejection now asserts the exact existing error message.

For this behavior-preserving extraction, the initial 15-case matrix was executed
against the previous presentation predicate and passed before extraction. Its
first import of the not-yet-created module failed discovery, not a behavior test;
that is not claimed as a red behavior regression. The first full build exposed
branded-condition and host-independent-global errors in test fixtures, corrected
with the domain condition constructor and JSON serialization. The final suite and
all strict scopes pass. No checks were suppressed or weakened.

## Browser evidence and limits

No browser automation was executed by this developer. The exposed tool inventory
had no dedicated browser-test connector and project dependencies had no installed
Playwright/Puppeteer. The coordinator is covering scoped browser checks in fresh
isolated production/development sessions; its evidence must be separately
attributed. Source inspection alone does not establish computed-style parity,
textarea native resizing, keyboard order, focus visibility/return, exact multiline
readback or live editability/inspect-only behavior. Those checklist criteria remain
pending until the coordinator records actual observations.

Independent review remains pending. This report is developer evidence, not review
approval or a full accessibility/cross-browser certification.
