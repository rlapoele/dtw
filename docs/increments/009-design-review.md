# Increment 009 — Design V1 analyst review

13 November 2026. Separate analyst consistency review following the user's approval
of V1 for this review only. Final agreement and implementation remain unauthorized.

## Review identity and basis

- Baseline: `044a71c3f8389411f4ae2772d8b5d3b51df38621`; clean at dispatch.
- Requirements were derived first from the [draft contract](009-workbench-usability-and-component-boundaries.md),
  AGENTS.md and workflow, then checked against project/domain/architecture and
  presentation constraints, prototype source and saved screenshots.
- Reviewed artifact: [Design V1](../../prototypes/increment-009-v1/DESIGN-V1.md),
  `main.tsx`, `prototype.css`, `vite.config.ts`, `index.html`, and the existing
  [rendered evidence and source hashes](../../output/increment-009-design-v1/review.md).
  The coordinator's concurrent approval/status prose updates supersede the older
  pending-approval wording; prototype code/CSS and requirements were unchanged.
- Independently inspected saved captures 01, 02, 05, 06, 07, 08 and 10. Their
  previously measured viewport sizes are attributed to the coordinator. No browser
  was opened and no interaction was independently replayed.

## Required finding

### D9-1 — Preserve identity disambiguation on actionable inventory entries

**P2 · AC-1/AC-3/AC-7; contract design direction item 2.**

Scenario: two same-kind entries have the same readable path, or several groups
have unavailable paths. Sibling-name collisions remain explicitly deferred in
[Increment 001, D2](001-in-memory-authoring-workflow.md#agreed-decisions--3-november-2026);
distinct identities cannot be assumed to have distinct labels.

V1's inventory buttons show only readable path and kind/status, while exact IDs
are moved to a single detached “Full inventory identities” disclosure
([prototype source](../../prototypes/increment-009-v1/main.tsx), lines 95–99;
[capture 06](../../output/increment-009-design-v1/06-group-inspection.png)).
The disclosure exposes IDs but does not identify which otherwise identical
actionable row targets each ID. Existing
[membership labels](../../src/presentation/features/workbench/state/all-content.ts)
include kind and exact identity on each entry. Following the mockup literally
would remove this disambiguation and make deliberate selection unreliable.

Correction: retain readable primary labels while associating an exact identity
with each actionable entry, at least whenever labels are ambiguous/unavailable.
An adjacent or per-entry disclosure is possible; do not rely solely on a detached
JSON list or assume path uniqueness. Show a duplicate-label example in the design
handoff. This is a correction to the proposed inventory presentation, not a
request to implement fixtures, enforce new naming rules or reopen qualification.

## Criterion map

These are design-consistency conclusions, not production acceptance results.

| Criterion | Assessment and remaining boundary |
| --- | --- |
| AC-1 | One explicit fixture view drives navigation/title/toolbar, including drawer; All content removes search/rename. Query state is retained in source. D9-1 remains open for inventory identity access. Native progressive membership must remain the production mechanism. |
| AC-2 | Source separates view from selection/raw strings; creation visibly defaults by current view, reveal clears query into All tokens, and different selection has a guard. Missing creation-parent behavior is deliberately unmodeled; preserve existing unavailable-target protection. |
| AC-3 | Readable group, literal, alias trace and unresolved summaries align; empty resolution diagnostics use prose, missing target ID is explicit, derived and authored disclosures are separate. D9-1 remains open. Unknown/invalid path presentation is not illustrated; the explicit unavailable-path requirement remains binding, without inventing paths. |
| AC-4 | Saved representative desktop design brings channels/Alpha into the ordinary form with a separate persistent action row; validation is outside help. The initial literal capture places Alpha against the scroll boundary, so full-control visibility warrants the planned focused implementation check. Compact drawer evidence is not narrow-screen layout qualification. |
| AC-5 | Inspector covers tokens/groups; empty-group and whole-color-reference guidance match context. Browser-profile applied retention, page-only drafts and independent backups are stated. Disabled fixture storage actions do not establish real retention behavior. |
| AC-6 | Proposed ownership is viable: explicit view state, focused sections above one editor session, lifecycle/backup coordination and shared pre-read admission can remain renderer responsibilities without moving domain semantics. Thin single-file fixture state is explicitly excluded as production architecture evidence. |
| AC-7 | Raw strings and view/selection separation are represented. Exact identities and raw authored data must come from existing projections/source APIs, never the illustrative JSON. Baseline review, blocking/outcome distinctions, no replay, completion consumption, protected restore, keys/fences and coherent readback are unmodeled and unverified, not waived. |
| AC-8 | Shared owned Button/Input/Select/Icon/Dialog and semantic theme are reused; native disclosures have labels. Production Base UI tab behavior, Apply/Cancel focus, drawer/departure focus, visible focus, disabled/error semantics and composition contracts remain required. Hand-built fixture tabs and simplified focus callbacks do not qualify those behaviors. |

## Assumptions, gaps and limits

- No new domain, persistence, format, dependency, store or router decision is
  needed. Existing command/readback/restore authority must survive extraction;
  the prototype's `Number` checks and illustrative serialization must not migrate
  into domain validation or exact source access.
- Unavailable group paths, duplicate identities' readable labels, long/exact
  values and additional color-space layouts are not represented by these sparse
  fixtures. D9-1 requires a design correction; the others retain explicit contract
  requirements and need proportionate implementation evidence, not a new fixture
  qualification campaign. Existing dynamic approximation/warning/recovery messages
  must stay visible rather than moving into explanatory help.
- Missing/unresolved preview swatches should retain the existing textual
  unavailable meaning in production. The unresolved panel already explains the
  fixture failure; its neutral swatch alone is not evidence of an authored color.
- Full responsive/accessibility support, large-source/native Find and exceptional
  storage/concurrency behavior remain outside this review. No old mockup check is
  accepted as production evidence; no failed/unrun prior case is relabeled passing.

## Effort and next gate

Approximately **5–6 analyst minutes** of the assigned seven-minute ceiling, within
the coordinator's ten-minute aggregate review ceiling; zero harness repairs.
Document/source consistency and existing-image inspection only. No tests, builds,
installs, browser rerenders or application edits. Review stops here; Increment 007
allowance remains zero and prior 007/008 campaigns remain stopped.

Resolve D9-1 through the designer/coordinator. Present the identified material
inventory revision to the user before renewed analyst review. Then identify the
resulting contract/design for final agreement; implementation needs its separate
explicit authorization. This review neither agrees the design for the user nor
authorizes implementation.

Suggested commit: `docs: record increment 009 design consistency review`.
Staging, committing and pushing remain with the user.
