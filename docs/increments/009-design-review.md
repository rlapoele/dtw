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

## Requirements amendment and D9-1 reassessment — 13 November 2026

This section supersedes the initial review's proposed disposition/next step where
noted, while preserving that review and its evidence above. The user subsequently
agreed unique paths regardless of token type, with continued access to existing
conflicting data, and authorized updating the proposal and reassessing the finding.
This is a source/document requirements reassessment, not renewed rendered design
review, final amended contract/design agreement or implementation authorization.
No new mockup is required for this documentation task.

### Basis and resulting scope

- Baseline: `2b98316529dfedc825ef3da5983403b308217e17`, clean at dispatch. The
  coordinator concurrently owns model/open-question/status/design-note alignment;
  this analyst owns only the Increment 009 contract and this review record.
- The [shared namespace model](../design-tokens/conceptual-model.md#namespace-groups-and-derived-paths)
  already puts groups and tokens in one sibling namespace; type does not partition
  it. [Increment 001 D2](001-in-memory-authoring-workflow.md#agreed-decisions--3-november-2026)
  deferred enforcement, not the underlying unambiguous-path direction. Its delivery
  claims remain historical. The new amendment proposes ending that enforcement
  deferral within Increment 009, without claiming implementation.
- Actual [namespace validation](../../src/domain/namespace.ts) is structural only,
  derives arrays of opaque local-name strings and does not detect sibling/path
  collisions. [Authoring operations](../../src/application/authoring.ts) validate
  whole candidates before commit. Merely adding collision failures to this shared
  validation could reject every subsequent command on a legacy-colliding snapshot;
  acceptance must distinguish pre-existing collisions from newly introduced ones.
- [Increment 007 AC-24 and supported-data policy](007-local-retention-and-backup.md#agreed-supported-data-matrix-and-restore-admissibility)
  preserve admitted membership, exact identities/authored data and readable
  diagnostics. New uniqueness enforcement must not turn supported legacy load,
  inspection, backup or restore into a hard rejection or silently repair data.

### D9-1 — Prevention first; residual identity-safe access remains required

**P2 · Open, amended scope · AC-3/AC-9/AC-10.**

The agreed response now addresses the source of future ambiguity: deterministic
application/domain checks must prevent new duplicate derived segment paths within
a project across groups/tokens regardless of type or assignment completeness.
Existing creation and group rename are in scope, including descendants affected
by renamed ancestry. Same short names under distinct full paths remain permitted.
Future rename/move capabilities must obey the same invariant; adding those editing
capabilities or UI is not required by this amendment.

The revised contract must reject new collisions and added members of existing
collisions, without newly rejecting otherwise allowed commands solely because an
unrelated unchanged collision already exists. This requires comparing affected
paths/descendants, not a blanket assertion that the candidate has no collisions.
Other structural/reference validation and command safety stay binding. Supporting
legacy reads does not establish a general progressive-repair workflow.

Prevention does not remove ambiguity from legacy data, and structural failures can
still make paths unavailable. Those actionable inventory rows must remain reliably
associated with exact identity and truthful context. IDs preserve identity but do
not prevent duplicate paths; a detached ID list still does not identify which
otherwise identical row selects which entity. The original finding therefore is
**not closed** by either uniqueness requirements or stable IDs alone. AC-9 covers
prevention; AC-3/AC-10 retain residual access/presentation obligations.

No prototype code or screenshots changed. The exact residual presentation remains
to be identified for final design agreement; any later material interface revision
returns to the user before renewed analyst review. The initial demand to create a
new duplicate-label mockup is not a prerequisite for this newly authorized
requirements reassessment. Existing captures cannot establish the amended
validation behavior or production acceptance.

### Explicit unresolved policy and verification boundary

The user agreed uniqueness, not a new local-name grammar or normalization policy.
The contract proposes exact segment-by-segment comparison of current authored
strings. Case folding, Unicode normalization, trimming, empty-name handling,
separator rules and target naming are not thereby agreed. This equality choice
must be confirmed explicitly before implementation; comparing joined display text
would invent path equivalence (for example `["a.b"]` versus `["a", "b"]`).

AC-9/AC-10 and the amended verification plan require focused future evidence for
cross-kind/type/completeness collisions, project/parent scoping, affected descendants,
atomic rejection and legacy admission without rewriting. Those checks are proposed,
not executed. No change to Increment 007 schema or restore admissibility, raw
source information, general repair capability or existing unrelated command safety
is authorized.

### Effort and handoff

New amendment/reassessment ceiling: **10 aggregate minutes, zero harness repairs**;
seven analyst minutes maximum, three reserved for coordinator reconciliation.
Approximately **5–6 analyst minutes** used (estimate), including document/source
review, amendment drafting and focused Markdown/link review. No tests, builds,
browser sessions, prototype changes or application edits. This review stops here;
all previous stopped mockup/007/008/review allowances remain stopped and the
proposed implementation allowance is unstarted.

Next gate: coordinator reconciles owning model/open-question/status/design notes,
surfaces the still-unagreed equality choice and residual design obligation, and
identifies the amended contract/design for final agreement. Implementation still
requires separate explicit authorization.

Suggested commit: `docs: amend increment 009 path uniqueness requirements`.
Staging, committing and pushing remain with the user.

## Naming amendment and D9-1 reassessment — 13 November 2026

This append-only reassessment supersedes the preceding section's statement that
case/Unicode/whitespace direction is wholly unagreed and its proposed exact-text
comparison. Historical evidence and unmet presentation obligations remain intact.

### Basis and confidence

- Stable starting baseline: `739c1b6c9359b23db5d1b92107d80908ff55e19b`, clean at
  dispatch. Coordinator owns the contract, model, open questions, status and design
  notes; this analyst owns the separate naming recommendation and this appendix.
- **User-agreed direction:** remove all whitespace including internal whitespace,
  lowercase namespace names at creation/rename, use NFC, preserve accents, compare
  paths case-insensitively and retain exact existing data/access. This narrows the
  previous equality question without approving unstated Unicode details.
- **Recommendations pending agreement:** [DTW namespace naming v1 / Unicode 17.0.0](009-naming-policy-proposal.md)
  pins the Unicode baseline, a 25-code-point Unicode `White_Space` set plus three
  separately identified invisible spacing controls, default full lowercase for
  newly authored stored names and canonical caseless D145 comparison keys. Source
  references and illustrative consequences are in that proposal; the three extras
  are product policy, not a Unicode-property claim.
- Existing namespace code remains structural and names remain opaque. A renderer
  transformation alone would not establish domain/application enforcement. No
  production source, tests, dependencies, vendored references or mockups changed.

### Consequences for the contract and finding

AC-1 through AC-10 retain their identifiers; the coordinator should add AC-11 for
canonical namespace naming and identify the selected precise policy explicitly.
Comparison operates segment by segment, across groups/tokens regardless of type;
the proposed full-fold relation is broader than comparing stored lowercase names.
Accents remain significant and no blanket compatibility fold/transliteration is
selected. Namespace names do not include project display titles or descriptions.

New authoring checks must compare against legacy names under the selected key
without rewriting them or tightening supported load/backup/restore gates. A group
rename changes only its edited local name and affected derived paths, preserving
descendant local names and identities. Existing unrelated collisions must not
newly reject otherwise allowed commands. Broader control/confusable policy stays
deferred; this proposal does not guarantee visually unique labels.

**D9-1 remains P2/open for residual legacy or unavailable-path access.** Prevention
and canonical naming cannot identify two already ambiguous actionable entries.
AC-3/AC-10 still require each such entry's association with exact identity and
truthful context. No new rendered artifact establishes the residual treatment or
the recommended pre-submission transformed-name preview. V1 is unchanged. An
identified material interface revision must reach the user before renewed analyst
review; this documentation amendment neither forces new mockups now nor grants
final design agreement or implementation authority.

### Effort and next gate

New documentation/source-review ceiling: **10 aggregate minutes**, seven assigned
to this analyst and three reserved for coordinator reconciliation; **zero harness
repairs**. Approximately **6 analyst minutes** used (estimate), including targeted
primary-source checks, drafting and manual Markdown/link review. No test/build or
browser campaign. Stop this review here; previous stopped 007/008/mockup/review
campaigns stay stopped and proposed implementation verification remains unstarted.

Next gate: present the named Unicode/removal/comparison recommendations and
reconciled draft to the user, keeping agreed direction distinct from recommendations.
Final amended contract/design agreement and separate implementation authorization
remain pending.

Suggested commit: `docs: define increment 009 namespace naming proposal`.
Staging, committing and pushing remain with the user.

## Subsequent user agreement and V2 preparation — 13 November 2026

Coordinator record: after the naming reassessment, the user explicitly agreed the
[precise policy](009-naming-policy-proposal.md), including the Unicode baseline,
removal set, stored-name pipeline and canonical caseless comparison. The prior
pending-agreement wording records its historical stage and is superseded by that
approval. The user authorized V2 mockups, without implementation. This is not a
renewed analyst design review or a disposition closing D9-1. Identified V2 artifacts
must reach the user before approval for renewed analyst review; final contract/
design agreement and application implementation authorization remain pending.

## Subsequent V2 review disposition — 13 November 2026

Coordinator record: the user approved V2 for analyst review. The
[fresh V2 review](009-design-v2-review.md), against baseline `b33aadb`, reports no
required consistency findings and finds **D9-1 addressed at design-review level**.
Its per-action identities/context and truthful unavailable-path treatment resolve
the residual presentation issue. Earlier open findings/reassessments in this file
remain historical. Production naming enforcement, exact source/backup preservation
and retained-state guarantees remain unimplemented/unverified; final user contract/
design agreement and implementation authorization remain pending.
