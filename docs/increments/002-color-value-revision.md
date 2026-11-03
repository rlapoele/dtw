# Increment 002: Color value revision

- Contract status: Draft
- Delivery status: Not started
- Agreement: Not yet agreed. All proposed scope and criteria below depend on resolving D1–D4 and explicit implementation authorization.
- References: [vision](../project/vision.md), [authoring workflow](../project/product-concept.md#author-and-understand), [principles](../project/principles.md), [application architecture](../project/architecture.md#application-operations), [authored assignments](../design-tokens/conceptual-model.md#authored-values-and-assignments), [references](../design-tokens/conceptual-model.md#tokenreference), [authored color](../design-tokens/conceptual-model.md#authored-color-and-alternative-representations), [regeneration protection](../design-tokens/conceptual-model.md#generated-change-proposals-and-protection), [taxonomy](../design-tokens/taxonomy.md), [glossary](../design-tokens/glossary.md), [open questions](../planning/open-questions.md#decision-priorities), [Increment 001](001-in-memory-authoring-workflow.md), [agent workflow](../workflow/agent-roles.md).

## Outcome

Enable a design-system author, initially represented by direct application calls in tests, to revise an existing unconditional color value, inspect the effect through dependent aliases, and explicitly repair or retarget an authored alias without changing token identity.

For example, changing a primitive color changes the resolved value of its semantic alias while preserving the alias as a reference. Retargeting that semantic alias changes its dependency deliberately. An edit that would make the primitive depend on its own downstream alias fails atomically.

This is a proposed enabling increment toward the browser authoring workflow. It remains in-memory and has no visible interface; it does not complete the first PWA slice or deliver durable local ownership.

## Scope

- Included, subject to D1–D4: one application use case that replaces the sole unconditional assignment value of an existing color token with an explicitly supplied structured color literal or whole-value reference. Inspection and validation reuse the existing operations.
- Keep the token's identity, project, name, group, explicit color type, description, layer, semantic role, and regeneration policy unchanged. All five existing color spaces and their current constructor semantics remain available. The caller supplies the complete new authored value; no resolved value is copied implicitly.
- Restrict revision to existing tokens with exactly one unconditional assignment, currently containing a color literal or reference. Preloaded recognizable broken references are eligible, including an unsupported old value path. Name-only, typed-but-unassigned, conditional, non-color, component-layer, and expression/composite-bearing edited tokens are outside this use case and fail explicitly without a write. Incomplete tokens may still be reference targets under AC-4.
- Preserve the existing in-memory storage port, detached data, sequential single-writer boundary, and complete-candidate namespace/reference checks. No extra persistence boundary or generic editing service is required.
- Excluded: UI, color pickers/display notation parsing, conversion/manipulation algorithms, automatic flattening, partial component edits, type or metadata changes, variation authoring, deletion, moves/renames, bulk migrations, progressive repair across multiple invalid tokens, undo/history, change-preview or impact-report API, concurrent writers, durable save/open, backup/restore, browser storage, import/export, compatibility profiles, PWA installation/offline caching, Electron, dependencies, or package restructuring.
- Sibling-name collision enforcement remains explicitly deferred as in Increment 001. Revision must neither rename tokens nor claim complete naming validation.

## Acceptance criteria

These are proposed criteria for the recommended D1–D4 choices, not approved requirements. Keep their IDs stable when recording agreement or an explicit amendment.

- AC-1: Through the application boundary, revising an eligible existing color literal preserves all token data outside its assignment value and preserves the empty condition. The newly supplied value passes the existing color constructor, retaining exact components, alpha, authored space, missing components, extended RGB coordinates, and existing hue normalization. Invalid input, including sparse component arrays, fails without a write. Explicit manual edits work for both `allowed` and `protected` regeneration policies and preserve that policy.
- AC-2: After revising a primitive in a chain of two or more aliases, subsequent inspection of every dependent returns the new resolved color and current domain trace. Each dependent's authored reference, identity, and metadata remain unchanged. Inspection and validation do not mutate stored data; no resolved value or derived trace is stored as authored data.
- AC-3: Explicitly retargeting an alias changes only its authored assignment value. Under proposed D2, explicit literal→reference and reference→literal replacement also work; the latter stores exactly the caller's supplied literal rather than fetching or copying the previous resolved value. No relationship changes merely because it is inspected. The token's layer/role are neither inferred nor changed when its value form changes.
- AC-4: New references require an existing same-project target with explicit compatible color type and `valuePath: []`. Missing/foreign targets, missing target types, incompatible types, and non-empty new paths fail without a write. A typed-but-unassigned color target remains structurally referenceable: inspection reports the existing missing-assignment outcome. Layer direction adds no new restriction.
- AC-5: Revision validates the complete candidate namespace and reference graph before committing, preserving existing diagnostic codes/details and their separation. Direct self-reference and a cycle through existing inbound aliases are rejected, with the entire previous snapshot preserved. Keeping the color type fixed preserves inbound type compatibility; changing the dependency still requires graph checks. Passing those checks is not labeled full validity, successful resolution, or target compatibility.
- AC-6: A preloaded recognizable broken reference can be explicitly replaced to fix a missing target, unsupported old path, or selected cycle when that one replacement leaves no namespace/reference diagnostics. An unrelated remaining namespace/reference error blocks the edit, even if the edited reference itself is repaired. The rejection exposes the candidate diagnostics and preserves all original authored data. Reads of rejected/broken data continue to expose existing outcomes and traces. No automatic cleanup or new loader API is introduced.
- AC-7: Unknown projects, missing or foreign edited entities, and ineligible edited tokens produce explicit expected failures without a write. A successful revision commits exactly once; constructor/candidate failures commit zero times. Simulated load and commit failures are distinct from invalid authoring and leave prior data unchanged. No intermediate removal/unassigned state is committed. Unexpected programmer exceptions retain the existing propagation behavior.
- AC-8: Tests demonstrate the create→alias→revise→inspect workflow through application calls and the existing adapter. Different projects remain isolated, including when token IDs match; mutation of command input, returned token, readback, or resolution data cannot change stored state. Domain/application code gains no host, filesystem, network, browser-storage, framework, or new runtime-library dependency, and existing Increment 001 behavior remains supported.

## Decisions and open questions

### Established constraints and implementation evidence

- The linked model preserves authored relationships and requires explicit compatible same-project references and cycle diagnostics. Regeneration protection concerns generated proposals; it is not a general manual-edit lock.
- [Current application operations](../../src/application/authoring.ts) create colors and inspect/validate projects but cannot revise values. Their `accept` helper checks the entire candidate's namespace and references; it does not require every token to resolve successfully.
- [Token operations](../../src/domain/token.ts) have pure assignment removal/addition functions but no dedicated replacement function. They can compose on detached data before one commit; adding a new domain API is not a prerequisite unless implementation evidence warrants it. Literal construction still needs the [color constructor](../../src/domain/color-literal.ts); Token assignment typing alone is not arbitrary-literal validation.
- [Reference validation](../../src/domain/token-reference-validation.ts) checks authored references across the candidate and selected dependency cycles. [Existing repairable-data tests](../../test/application/repairable-data.test.ts) prove inspection/preservation of broken data, not an existing repair command or permission to accept partially invalid candidates.

### Resolve before implementation

1. **D1 — Next workflow.** Recommend color revision as the smallest coherent next application increment: it closes the create-only authoring loop and tests dependency changes with concrete observable value. Alternative: prioritize durable retention plus independent backup/restore, which addresses data ownership sooner but needs an agreed complete-data boundary, versioned representation, restoration/identity policy, and adapter choice. Alternative: a visible authoring slice validates interaction sooner but needs an agreed interface scope and frontend approach; an ephemeral UI alone would not fulfill the complete PWA workflow. Choosing revision does not require either alternative to wait for further domain expansion, and it does not select their implementation order afterward.
2. **D2 — Deliberate value-form changes.** Recommend explicit complete replacement with either a literal or reference, including literal↔reference changes. The supplied discriminated authored value makes relationship creation/removal deliberate; there is no automatic conversion to a resolved literal. Alternative: permit only literal edits and reference retargeting while preserving the old value form, deferring relationship creation/removal. If that narrower option is chosen, amend AC-3 and the scope before agreement.
3. **D3 — Edited-token eligibility.** Recommend revising only the existing single unconditional color workflow described above. This includes recognizable broken-reference fixtures but excludes filling incomplete tokens or revising conditional values. Broadening eligibility would require an explicit assignment-selection/creation contract rather than silently treating every token as unconditional. Metadata preservation and manual editing of regeneration-protected tokens follow established semantics above; protection is not a new eligibility choice.
4. **D4 — Broken-data write policy.** Recommend retaining whole-candidate namespace/reference validation, with the limited single-edit repair described in AC-6. Two independent broken references cannot necessarily be repaired one at a time under this rule. Alternative: progressive repair that accepts a candidate with unrelated existing diagnostics needs a separate policy for identifying unchanged/worsened/new findings and cycles; it is not authorized by existing read preservation. If that is needed now, revise the contract before implementation rather than weakening checks implicitly.

None of D1–D4 is agreed. The coordinator must obtain the user's choices and explicit implementation authorization, record them here, and update only affected owning documentation consistently before starting a developer agent.

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
- Implementation has not started. Record the actual base and pre-existing changes after agreement; give the separate reviewer a stable identified commit or exact diff plus included new files, following the agent workflow.

## Agreed amendments

None. Draft prepared on 3 November 2026; no user agreement or implementation authorization recorded.
