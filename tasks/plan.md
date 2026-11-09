# Guidance adherence review and proposed maintenance plan

**9 November 2026 — review completed; maintenance implementation authorized by the user, including optional Task 3. Implementation completed and independently approved with no actionable findings.**

## Baseline and scope

Reviewed application baseline: `cc49016`, following Increment 006 at `d022ba2`.
The request covers adherence to README and related repository guidance before
Increment 007. This maintenance plan was approved and delivered separately from Increment 007.

Read README, AGENTS, presentation conventions, architecture, visual direction,
vision, product concept, principles, open questions, workflow roles, status rules,
and the Increment 004 CSS exception inventory. Inspected maintained presentation
components, styles, drafts and preview helpers, application authoring/storage,
the in-memory adapter, module imports, configuration and relevant tests.

This coordinator performed the review and verification. No separate independent
reviewer assessed this audit. Domain internals were checked through dependency
inspection, selected call paths and the existing suite; this was not an exhaustive
re-audit of every domain algorithm or a security/dependency-vulnerability audit.

## Conclusion

The implementation substantially follows the agreed direction. Recommend a small
maintenance pass for one visible theme inconsistency and one duplicated workflow
policy, with optional class cleanup. No broad restyling, new component library,
`cn` migration or persistence preparation is justified by these findings.

## Findings

### F1 — Description focus bypasses the semantic theme

**Recommended correction; visible consistency gap, not a missing-focus defect.**

`src/presentation/CreationDialog.tsx` renders the native description textarea.
The shared `:focus-visible` rule in `src/presentation/styles.css` includes inputs,
selects, buttons, links and tabs, but omits textarea. In the fresh production
browser check, keyboard focus on Name used `rgb(99, 112, 131)` and a positive
outline offset; Tab to Description used Chromium's `rgb(0, 95, 204)` auto outline
with zero offset. Both controls retained visible focus and accessible labels.

This introduces blue browser chrome into the neutral theme despite the existing
semantic ring. Extend the established focus rule to textarea, retaining native
multiline entry, resizing, wrapping and exact text. Its proportional sans font is
appropriate for prose; do not impose the exact-coordinate monospace treatment.
A new Textarea wrapper is unnecessary for the single current consumer.

### F2 — Color revision eligibility has two owners

**Recommended architecture correction; no current behavior mismatch observed.**

`src/presentation/session.ts:47` independently implements the same eligibility
conditions as `src/application/authoring.ts:169`: non-component color token, one
unconditional assignment, literal color or reference. App and Editor consume the
presentation predicate, while the operation enforces its separate copy.

The rules currently agree, and operation validation remains authoritative. The
duplication creates a concrete drift point against the guidance to keep shared
workflows in application operations. Extract a small pure application-owned
predicate and use it in both places. Keep editing eligibility separate from
whole-project validation and successful application: an eligible broken reference
can still fail validation because other diagnostics remain. Preserve protected
tokens' eligibility for explicit manual editing.

### F3 — Conflicting utilities obscure the intended styling

**Optional cleanup; no demonstrated visual defect.**

`src/presentation/Editor.tsx:331` combines `justify-between` and `justify-start`.
`src/presentation/components/input.tsx:11` combines common `bg-background` with
search-only `bg-surface`. The browser confirms the current search surface is
`rgb(250, 251, 252)` with 34px left padding. Make these choices explicit and
mutually exclusive while preserving current computed appearance. The search
`px-2.5` plus `pl-8.5` combination expresses a deliberate left-side override;
it is not inherently a defect.

Do not install a merger to resolve these few static choices, or change the
documented additive Button caller-class contract.

### F4 — Guidance contains stale descriptions of delivery

**Documentation correction.**

The status next action still asks for committing the presentation update already
recorded by `cc49016`. Its browser-tab descriptions assert transient state.
Visual direction's final paragraph under “Details still to validate” still says
no interface implementation has started. README's test directory description
mentions only `*.test.ts` despite maintained TSX consumer tests. These statements
need precise reconciliation without changing accepted scope or frozen evidence.

The status next action and tab wording are reconciled in this audit handoff.
Remaining guidance corrections are proposed in Task 4.

## Areas adhering to the guidance

| Constraint | Inspected evidence and disposition |
| --- | --- |
| Neutral semantic theme | `styles.css` maps root semantic roles through `@theme inline`; additional roles are defined once in `@theme`. No additional alias layer needed. F1 is the specific observed gap. |
| Named Tailwind utilities | Ordinary JSX styling uses named utilities and named responsive variants. No arbitrary-value migration is needed. |
| Scoped CSS exceptions | Panel topology, precise geometry, dense typography, modal effects, native range pseudo-elements and illustrative specimens correspond to the Increment 004 inventory. Runtime specimen backgrounds and range gradients are legitimate data/preview exceptions. |
| Heroicons Outline | Maintained UI imports use `@heroicons/react/24/outline`. All ten SVGs present in the inspected creation state had `aria-hidden="true"`; no foreign icon family was found in maintained source. |
| Owned components | Buttons, fields, inputs, badges, inspection tabs, modal content and swatches are reused. Native selects/ranges serve the current flows. The distinct navigation drawer has documented geometry and does not require replacement by a generic Sheet. |
| Class composition | Button and DialogContent evaluate Base UI callback classes with actual state and retain owned classes. No source `cn` helper or declared merger dependency; permission to adopt one is not a requirement. F3 is bounded optional cleanup. |
| Architecture | Domain imports remain host-independent, application coordinates validation/commit through a storage port, and the adapter owns detached storage copies. No browser/Node/Electron/network imports were found in domain/application. F2 is the specific duplicated policy. |
| Authored data | Exact values, byte edit preservation, stable IDs, aliases and independent drafts remain represented in the inspected paths and covered by passing tests. Specimen conversion/clamping is display-only and explicitly distinguished from authored data. |
| Session-only scope | In-memory storage remains the production default; no durable storage, service worker, interchange adapter or Electron host was introduced. These remain future scoped work. |

## Fresh verification

- `npm test`: **966 tests in 35 files passed** on 9 November 2026.
- `npm run build -- --outDir <isolated temporary directory>`: all three strict
  TypeScript scopes and Vite production build passed. Root preview assets were
  preserved. The outside-root build notice was informational.
- Fresh production preview in a newly created in-app browser tab: create project,
  open token creation, inspect Name and Description keyboard focus, inspect search
  computed styling and decorative SVGs, then Cancel. Focus returned to New token.
  The disposable tab was closed and the review server stopped. Existing sessions
  were not opened or reloaded.

Browser results are bounded observations, not a new responsive/zoom,
screen-reader, mobile-keyboard or cross-engine certification. Existing suite
success is supporting regression evidence, not proof of full guidance compliance.
No application mutation experiment was performed during this review.

## Proposed implementation order

The actionable checklist, acceptance criteria and per-task verification live in
[todo.md](todo.md). The user authorized all tasks on 9 November 2026, including
the optional static class cleanup, with developer then independent reviewer
execution. Staging, commits and pushes remain with the user. This approval does
not authorize Increment 007. Preliminary developer evidence is recorded in
[the maintenance report](../output/guidance-maintenance/developer-evidence.md).

1. Align textarea focus with the existing ring (F1).
2. Share color revision eligibility through a pure application policy (F2).
3. Optionally remove the identified contradictory utility choices (F3).
4. Reconcile remaining live guidance and record delivery evidence (F4).
5. Pause edits for separate review against the approved scope and stable snapshot;
   resolve findings and update the completion handoff.

Tasks 1 and 2 are independent; run them sequentially with one code-writing agent.
Task 3 was selected by the user. Documentation and final verification follow the selected code
tasks. Do not grow this into a new design exploration: these changes preserve
existing design intent. Material visual or behavioral changes must return to the
user and follow the repository's designer/analyst agreement process.

## Risks and boundaries

- Preserve application error codes/messages and validation/atomic-commit behavior
  when sharing eligibility. UI gating must never replace operation validation.
- Preserve native field labels, exact multiline descriptions, modal focus return,
  resizing and narrow-layout scrolling when extending focus styling.
- Preserve current computed styles, not assumed class-string ordering, in cleanup.
- Keep the Button additive contract and Base UI callback evaluation intact.
- No dependencies, format/storage choices, new persistence APIs, design changes,
  prototype edits, staging, commits or pushes are included.
- Independent review of the identified implementation and coordinator browser
  evidence is complete; no actionable findings or required scoped verification
  gaps remain. Coverage limits are recorded below.

Suggested commit message for this review/plan: `docs: review guidance adherence and plan targeted maintenance`.


## Completion report — 9 November 2026

The user approved the maintenance plan including optional Task 3 and authorized a
separate developer followed by an independent reviewer. Implementation started
from committed plan baseline `4b541f8`. All selected tasks are complete.

- Textarea focus now uses the existing neutral semantic ring and offset. Native
  multiline input, labels, resizing and modal focus return are preserved.
- `canReviseColorToken` is a pure application-owned policy used by operation
  enforcement and re-exported for presentation. The operation retains its exact
  failure message, candidate validation and atomic commit boundary. Missing/sparse
  assignment slots remain rejected; this also removes the old UI predicate's
  possible missing-slot throw without broadening valid editing eligibility.
- Search appearances select one background; the resolved heading selects one
  alignment. Wide/compact computed styles match the baseline.
- README describes TSX tests; visual direction points to delivered scope while
  retaining the distinction between accepted reference and future patterns.

Developer and independent reviewer each ran **983 tests in 36 files** and passed
all three strict typechecks and isolated production builds. The coordinator
verified Name→Description→Group focus, semantic ring/offset, exact multiline
Unicode/whitespace readback, actual native resizing, Cancel focus return,
editable/protected color behavior, inspect-only Number behavior and wide/compact
search/heading parity. The independent reviewer inspected source/tests first,
then assessed the attributed browser record and screenshot, and found **no
actionable findings or required verification gaps within this scope**.

Evidence:

- [Developer checks](../output/guidance-maintenance/developer-evidence.md) and
  [identified snapshot](../output/guidance-maintenance/developer-manifest.json).
- [Coordinator browser checks](../output/guidance-maintenance/coordinator-browser-evidence.md).
- [Independent review](../output/guidance-maintenance/independent-review.md).
- [Root asset preservation](../output/guidance-maintenance/dist-preservation.json).

The developer manifest freezes its handoff, including then-pending completion
wording. Subsequent changes to this plan, checklist and status are completion
reconciliation, not implementation changes. The reviewer rechecks that final
reconciliation separately; implementation/test hashes remain those reviewed.

Limits: measured compact viewport was477×1075 despite a requested320×720 override;
actual320px, new page-zoom, screen-reader, physical-device/virtual-keyboard and
cross-engine checks are not claimed. Browser execution was the coordinator's;
reviewer source/check execution and artifact assessment were independent.
Existing root dist was preserved. No dependencies, durable storage, prototypes,
staging, commits or pushes were changed. Increment 007 remains unstarted and
requires separate product/contract decisions and authorization.

Suggested implementation commit: `refactor: align focus styling and share color revision policy`.
