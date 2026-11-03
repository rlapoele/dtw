# Increment 002: Color value revision

- Contract status: Agreed
- Delivery status: Completed
- Agreement: User agreed the four recommended choices D1–D4 on 3 November 2026 and explicitly authorized implementation without UI using a developer subagent followed by a separate reviewer.
- References: [vision](../project/vision.md), [authoring workflow](../project/product-concept.md#author-and-understand), [principles](../project/principles.md), [application architecture](../project/architecture.md#application-operations), [authored assignments](../design-tokens/conceptual-model.md#authored-values-and-assignments), [references](../design-tokens/conceptual-model.md#tokenreference), [authored color](../design-tokens/conceptual-model.md#authored-color-and-alternative-representations), [regeneration protection](../design-tokens/conceptual-model.md#generated-change-proposals-and-protection), [taxonomy](../design-tokens/taxonomy.md), [glossary](../design-tokens/glossary.md), [open questions](../planning/open-questions.md#decision-priorities), [Increment 001](001-in-memory-authoring-workflow.md), [agent workflow](../workflow/agent-roles.md).

## Outcome

Enable a design-system author, initially represented by direct application calls in tests, to revise an existing unconditional color value, inspect the effect through dependent aliases, and explicitly repair or retarget an authored alias without changing token identity.

For example, changing a primitive color changes the resolved value of its semantic alias while preserving the alias as a reference. Retargeting that semantic alias changes its dependency deliberately. An edit that would make the primitive depend on its own downstream alias fails atomically.

This is an agreed enabling increment toward the browser authoring workflow. It remains in-memory and has no visible interface; it does not complete the first PWA slice or deliver durable local ownership.

## Scope

- Included: one application use case that replaces the sole unconditional assignment value of an existing color token with an explicitly supplied structured color literal or whole-value reference. Inspection and validation reuse the existing operations.
- Keep the token's identity, project, name, group, explicit color type, description, layer, semantic role, and regeneration policy unchanged. All five existing color spaces and their current constructor semantics remain available. The caller supplies the complete new authored value; no resolved value is copied implicitly.
- Restrict revision to existing tokens with exactly one unconditional assignment, currently containing a color literal or reference. Preloaded recognizable broken references are eligible, including an unsupported old value path. Name-only, typed-but-unassigned, conditional, non-color, component-layer, and expression/composite-bearing edited tokens are outside this use case and fail explicitly without a write. Incomplete tokens may still be reference targets under AC-4.
- Preserve the existing in-memory storage port, detached data, sequential single-writer boundary, and complete-candidate namespace/reference checks. No extra persistence boundary or generic editing service is required.
- Excluded: UI, color pickers/display notation parsing, conversion/manipulation algorithms, automatic flattening, partial component edits, type or metadata changes, variation authoring, deletion, moves/renames, bulk migrations, progressive repair across multiple invalid tokens, undo/history, change-preview or impact-report API, concurrent writers, durable save/open, backup/restore, browser storage, import/export, compatibility profiles, PWA installation/offline caching, Electron, dependencies, or package restructuring.
- Sibling-name collision enforcement remains explicitly deferred as in Increment 001. Revision must neither rename tokens nor claim complete naming validation.

## Acceptance criteria

AC-1–AC-8 are agreed. Keep their IDs stable; record substantive agreed amendments explicitly.

- AC-1: Through the application boundary, revising an eligible existing color literal preserves all token data outside its assignment value and preserves the empty condition. The newly supplied value passes the existing color constructor, retaining exact components, alpha, authored space, missing components, extended RGB coordinates, and existing hue normalization. Invalid input, including sparse component arrays, fails without a write. Explicit manual edits work for both `allowed` and `protected` regeneration policies and preserve that policy.
- AC-2: After revising a primitive in a chain of two or more aliases, subsequent inspection of every dependent returns the new resolved color and current domain trace. Each dependent's authored reference, identity, and metadata remain unchanged. Inspection and validation do not mutate stored data; no resolved value or derived trace is stored as authored data.
- AC-3: Explicitly retargeting an alias changes only its authored assignment value. Under agreed D2, explicit literal→reference and reference→literal replacement also work; the latter stores exactly the caller's supplied literal rather than fetching or copying the previous resolved value. No relationship changes merely because it is inspected. The token's layer/role are neither inferred nor changed when its value form changes.
- AC-4: New references require an existing same-project target with explicit compatible color type and `valuePath: []`. Missing/foreign targets, missing target types, incompatible types, and non-empty new paths fail without a write. A typed-but-unassigned color target remains structurally referenceable: inspection reports the existing missing-assignment outcome. Layer direction adds no new restriction.
- AC-5: Revision validates the complete candidate namespace and reference graph before committing, preserving existing diagnostic codes/details and their separation. Direct self-reference and a cycle through existing inbound aliases are rejected, with the entire previous snapshot preserved. Keeping the color type fixed preserves inbound type compatibility; changing the dependency still requires graph checks. Passing those checks is not labeled full validity, successful resolution, or target compatibility.
- AC-6: A preloaded recognizable broken reference can be explicitly replaced to fix a missing target, unsupported old path, or selected cycle when that one replacement leaves no namespace/reference diagnostics. An unrelated remaining namespace/reference error blocks the edit, even if the edited reference itself is repaired. The rejection exposes the candidate diagnostics and preserves all original authored data. Reads of rejected/broken data continue to expose existing outcomes and traces. No automatic cleanup or new loader API is introduced.
- AC-7: Unknown projects, missing or foreign edited entities, and ineligible edited tokens produce explicit expected failures without a write. A successful revision commits exactly once; constructor/candidate failures commit zero times. Simulated load and commit failures are distinct from invalid authoring and leave prior data unchanged. No intermediate removal/unassigned state is committed. Unexpected programmer exceptions retain the existing propagation behavior.
- AC-8: Tests demonstrate the create→alias→revise→inspect workflow through application calls and the existing adapter. Different projects remain isolated, including when token IDs match; mutation of command input, returned token, readback, or resolution data cannot change stored state. Domain/application code gains no host, filesystem, network, browser-storage, framework, or new runtime-library dependency, and existing Increment 001 behavior remains supported.

## Decisions and open questions

### Established constraints and implementation evidence

- The linked model preserves authored relationships and requires explicit compatible same-project references and cycle diagnostics. Regeneration protection concerns generated proposals; it is not a general manual-edit lock.
- At the implementation baseline, [application operations](../../src/application/authoring.ts) create colors and inspect/validate projects but cannot revise values. Their `accept` helper checks the entire candidate's namespace and references; it does not require every token to resolve successfully.
- [Token operations](../../src/domain/token.ts) have pure assignment removal/addition functions but no dedicated replacement function. They can compose on detached data before one commit; adding a new domain API is not a prerequisite unless implementation evidence warrants it. Literal construction still needs the [color constructor](../../src/domain/color-literal.ts); Token assignment typing alone is not arbitrary-literal validation.
- [Reference validation](../../src/domain/token-reference-validation.ts) checks authored references across the candidate and selected dependency cycles. [Existing repairable-data tests](../../test/application/repairable-data.test.ts) prove inspection/preservation of broken data, not an existing repair command or permission to accept partially invalid candidates.

### Agreed decisions — 3 November 2026

1. **D1 — Next workflow.** Implement color revision through application operations without UI. This closes the create-only authoring loop and tests dependency changes. Durable retention/backup and a visible authoring slice remain future alternatives; their subsequent order is not selected.
2. **D2 — Deliberate value-form changes.** Allow explicit complete replacement with a supplied literal or reference, including literal↔reference changes. No automatic flattening or fetching a resolved value as replacement input.
3. **D3 — Edited-token eligibility.** Restrict edits to the existing single unconditional color workflow described above, including recognizable broken references. Filling incomplete tokens and revising conditional values are excluded. Metadata preservation and manual editing of regeneration-protected tokens follow established semantics; protection is not a manual-edit lock.
4. **D4 — Broken-data write policy.** Retain whole-candidate namespace/reference validation and the limited single-edit repair in AC-6. Unrelated remaining diagnostics block the edit; progressive repair of partially invalid projects is excluded.

Implementation and separate review are authorized within this contract. No UI, durable storage, or subsequent increment is authorized by this agreement.

### Deferred

Naming grammar/collisions, durable retention and backup representation, canonical persistence schema/manifest, frontend framework, first interchange profile, variation editing, complete PWA acceptance, and immediately following Electron validation remain in the owning open questions. No external-tool behavior or compatibility promise changes in this increment.

## Verification approach

- Extend application behavior tests under `test/application/` using the existing adapter and controlled storage fixture. Cover exact literal replacement and invalid/sparse inputs (AC-1), dependent-chain recomputation (AC-2), explicit value-form transitions (AC-3), typed/unassigned and rejected targets (AC-4), self/indirect cycles with unchanged snapshots (AC-5), isolated repair versus unrelated remaining errors (AC-6), eligibility/load/commit failures and commit counts (AC-7), and project/input/output isolation (AC-8). Use direct domain calls only to prepare focused preloaded fixtures, not as substitutes for application workflow coverage.
- Preserve current domain regression suites. If implementation adds or changes domain behavior, test that behavior independently under `test/domain/`; no domain extension is assumed by this draft.
- Follow the existing plain-data, readonly-input, pure-domain style exemplified by `removeTokenAssignment` and `addTokenAssignment`. Keep expected failure results distinct from programmer exceptions; do not suppress checks or broaden architecture to fit the use case.
- Run `npm run typecheck`, `npm test`, and `git diff --check`. Manually inspect dependencies, changed Markdown, links, terminology, and agreement/status claims. Map implementation and independent-review evidence to AC IDs in this document's eventual completion report.
- Browser, build/UI, offline installation, durability, external compatibility, performance, and Electron checks cannot establish acceptance for this in-memory increment and are not claimed.

## Review baseline

- Planning baseline: clean `dev` at `d58289ce654280d6379a47cb69ea9c9ecbab1e82`, independently checked by the analyst on 3 November 2026 before creating this draft.
- Coordinator reports baseline `npm run typecheck` and `npm test` passed: 654 tests across 26 files. The analyst inspected implementation/tests and did not independently rerun those checks. Baseline checks are not evidence for proposed revision behavior.
- Implementation baseline: clean `dev` at `879f5cdb99483f72f15f18fd4d8e22c880590262` before agreement documentation edits; no unrelated changes. Reviewed as snapshot `increment-002-review-1`: this base plus the exact tracked diff and new revision-test file identified below. Reviewer verified base, diff, file membership and all seven hashes unchanged before and after review. Completion/status reporting was updated afterward; implementation/test content remains unchanged.

## Agreed amendments

3 November 2026 — User accepted the four recommended D1–D4 choices and authorized implementation without UI followed by separate review. Scope and AC IDs are unchanged.


## Completion report

- Delivery status: Completed
- Date: 3 November 2026
- Reviewed snapshot: `increment-002-review-1`, base `879f5cdb99483f72f15f18fd4d8e22c880590262` plus uncommitted tracked edits to `README.md`, this contract, open questions, architecture, status, and `src/application/authoring.ts`, together with new `test/application/color-revision.test.ts`. All seven files were frozen by exact diff and SHA256 manifest; the reviewer verified them unchanged before and after review. Only this report/status metadata and the status handoff were changed afterward.

### Result

`reviseColorToken({ projectId, tokenId, value })` revises an eligible existing color token's sole unconditional literal/reference assignment. The supplied literal or whole-value reference may deliberately replace either form. All other token data is preserved, including regeneration protection. Dependent aliases resolve from the new authored value on inspection. Whole-candidate namespace/reference checks reject cycles and invalid targets before a single commit; unrelated diagnostics block a repair. No intermediate unassigned state is stored.

### Acceptance evidence

Evidence below is in [application revision tests](../../test/application/color-revision.test.ts) and the independent review of [application operations](../../src/application/authoring.ts).

| Criterion | Evidence and observed result | Status |
|---|---|---|
| AC-1 | Exact replacement in all five spaces, missing components, extended RGB, hue normalization and alpha; metadata and both regeneration policies preserved; invalid/sparse input rejected without a write. | Verified |
| AC-2 | Primitive revision updates a two-alias chain on inspection; authored references, identities and metadata remain intact. | Verified |
| AC-3 | Explicit alias retargeting and both literal/reference transitions; caller-supplied literal is stored without inferred layer/role or automatic flattening. | Verified |
| AC-4 | Missing/foreign/untyped/incompatible targets and non-empty new paths rejected with existing diagnostics; typed-unassigned color target remains referenceable and unresolved. | Verified |
| AC-5 | Direct self-reference and downstream dependency cycle rejected with unchanged snapshot; namespace/reference diagnostics remain separate. | Verified |
| AC-6 | Missing target, old unsupported path and selected cycle can be repaired by one replacement when final checks clear; remaining unrelated namespace/reference errors block and preserve original authored data. | Verified |
| AC-7 | Eligibility and absent/foreign entities fail explicitly; zero commits on rejection, one final assigned candidate on success; distinct load/commit failures and programmer exception propagation. | Verified |
| AC-8 | Application workflow with existing adapter, same-ID project isolation, detached command/results/readback/resolution data; no domain/storage implementation changes, host dependency or new runtime library. | Verified |

### Checks and independent review

- Developer `/root/developer_002`: `npm run typecheck`, `npm test` (689 tests across 27 files, including 35 new revision tests), and `git diff --check` passed.
- Separate fresh-context reviewer `/root/reviewer_002` derived expectations from the agreed contract before examining implementation, independently passed type checking and all 689 tests in an isolated copy, and verified snapshot identity and scoped documentation/link consistency.
- Mutation probe: inverting the component eligibility guard caused 21 test failures, including component-token rejection. The isolated copy was restored; all 35 revision tests and two additional adversarial tests then passed. Probes checked opaque IDs and absent optional metadata, unsupported input kind, propagation of an unexpected input/programmer exception, and repair of an old indexed path.
- Findings: no actionable findings. Unresolved disagreements: none.
- No UI/build/install, durable storage, concurrent-write, interoperability or benchmark evidence is claimed; no web entry point exists.

### Decisions made

User-agreed D1–D4 remain recorded above and in [architecture](../project/architecture.md#color-value-revision-increment). Routine implementation choices: exported `ReviseColorTokenInput`, a project-scoped revision method returning the existing application result type, eligibility failures using the existing `invalid-domain-input` outcome, and pure remove/add assignment composition before the existing candidate check/commit. No domain API or storage format was added.

### Reviewed implementation files

These hashes identify the reviewed implementation/test content and remain unchanged at completion.

| File | SHA256 |
|---|---|
| `src/application/authoring.ts` | `f21fb85a97380704fc108696a626392a1bd8bdd92e5b5ff49c60ee5db454cce6` |
| `test/application/color-revision.test.ts` | `d5bd57ae6033d7385dc1ed1d555fefd83baeaadd0866fedc037f368434ac20ca` |

### Limits and remaining work

This is an in-memory operation workflow without UI. Only existing single unconditional non-component color literal/reference assignments are eligible; incomplete and conditional tokens are not completed/edited. Whole-candidate validation intentionally prevents progressive repairs while unrelated diagnostics remain. Sibling-name enforcement, durable retention/backup, import/export, variation editing, UI technology, PWA and Electron acceptance boundaries remain open. The full passing suite establishes this increment's tested behavior, not completion of those product capabilities.

### Next step

Select and contract the next concrete workflow, considering durable retention/backup or a visible authoring slice without assuming their order. This report does not authorize another increment, a merge, push, release or deployment.
