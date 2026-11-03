# Increment 001: In-memory authoring workflow

- Contract status: Agreed
- Delivery status: Completed
- Agreement: User agreed D1–D4 on 3 November 2026 and explicitly authorized implementation using a developer subagent followed by a separate reviewer.
- References: [vision](../project/vision.md), [product concept](../project/product-concept.md#initial-project-experience), [principles](../project/principles.md), [application architecture](../project/architecture.md#application-operations), [canonical model](../design-tokens/conceptual-model.md), [taxonomy](../design-tokens/taxonomy.md), [glossary](../design-tokens/glossary.md), [open questions](../planning/open-questions.md#decision-priorities), [agent workflow](../workflow/agent-roles.md).

## Outcome

Enable a design-system author, represented initially by direct application calls in tests, to create a project, organize two color tokens through namespace groups, author a literal primitive and a semantic whole-value alias, and inspect their authored and resolved values and validation diagnostics.

This is an enabling application-operation increment. It supports the future browser authoring workflow but is not the first complete PWA vertical slice or a usable end-user application. In-memory retention proves coordination and isolation, not durable local ownership, backup, offline installation, or persistence compatibility. The planned PWA-first / immediately-following Electron sequence remains unchanged.

## Scope

- Included: project creation and project-scoped readback; root/nested group creation; creation of fully authored color tokens with one unconditional literal or whole-value reference assignment; group renaming; derived path inspection; reference validation and resolved-value inspection through shared application operations and an explicitly supplied in-memory storage adapter.
- Group placement is supplied at creation. One group-rename operation is sufficient to demonstrate organization changes without rewriting descendant identities or aliases; token/group moves, token renaming, and value replacement are not prerequisites for this increment.
- Application inputs explicitly supply opaque identities, names, optional descriptions, optional primitive/semantic layer and semantic role, and the existing regeneration policy. Examples explicitly use `primitive` and `semantic`; neither layers nor roles are inferred from paths or alias shape. No identity generator or implicit authoring default is selected.
- Color inputs use the existing structured literal input: one supported color space, three canonical Decimal-or-`none` components, and explicit alpha. Reuse all five currently implemented spaces without adding display parsing, color conversion, gamut mapping, or new numeric policies.
- Projects in this workflow have no variation axes or presets; authored conditions are empty. Operations derive the completed empty selection using the existing domain selection functions. This is an agreed initial workflow restriction, not a change to canonical variation semantics.
- Excluded: visible UI, PWA manifest/service worker, Electron, CLI/MCP delivery, real filesystem/network/browser storage, project listing/recent projects, durable save/open, backup/restore, import/export, compatibility claims, canonical serialization/manifest, identity-generation format, component tokens, incomplete-token authoring, variation authoring, remaining value types, expressions, previews, deletion, migrations, undo/history, concurrent writers, and package restructuring.

## Acceptance criteria

AC-1–AC-9 are agreed for this increment. Sibling-name collision enforcement is explicitly deferred under D2.

- AC-1: Through the application boundary, creating a project with a supplied identity, name, and optional description permits readback of that project with no tokens or groups and no workspace path. An unknown project returns an explicit application failure. Creating an already stored project identity does not overwrite it.
- AC-2: Within an existing project, create root and nested groups and place tokens either at the root or in a same-project group. Readback exposes the authored entities and domain-derived segment-array paths. A missing or foreign parent fails without changing stored data. Names are preserved exactly; path uniqueness behavior follows the explicit D2 decision below.
- AC-3: Create a color token with explicit `color` type and one unconditional literal assignment using the existing color constructor. Exact components, alpha, space, and the constructor's existing hue normalization are preserved. Invalid canonical Decimal text, wrong component count, unsupported space, and invalid alpha produce explicit failures without storing a token. No CSS/hex/display-string parsing or additional color normalization occurs.
- AC-4: Create a semantic-layer color alias with an explicit same-project target identity and `valuePath: []`. Normal authoring rejects a missing/foreign target, target without a declared type, or incompatible target type without storing the proposed change. A typed-but-unassigned color target remains structurally referenceable; resolving it reports the existing missing-assignment outcome rather than inventing a value. No layer-direction restriction or inferred role is added. Stored-cycle diagnostics are verified separately under AC-7; this creation-only workflow does not introduce a cycle-authoring operation.
- AC-5: Inspection returns authored data separately from domain resolution results, including matched condition, trace, and diagnostics. For the literal/alias example, both resolve to the same exact color; the alias remains an authored stable-identity reference. Renaming the target's ancestor group changes derived paths while preserving all identities, the alias target, and its resolved value. Reads and resolution do not mutate stored authored data.
- AC-6: A project-scoped validation operation exposes namespace structural diagnostics and existing project reference diagnostics as distinct checks. It does not label a project fully valid merely because those checks pass: incomplete definitions, resolution outcomes, name uniqueness coverage, and target compatibility remain distinct. Existing domain diagnostic codes and details survive application coordination.
- AC-7: For focused preloaded storage fixtures containing repairable broken references, unsupported value paths, missing assignments, or selected alias cycles, inspection exposes existing unresolved outcomes and traces and preserves authored data. This verifies diagnostic handling of stored data; it does not add an import/loader API or allow normal authoring to create missing/foreign targets.
- AC-8: Each modifying operation rejects duplicate identities within the relevant project/entity collection, applies the agreed checks to the candidate state, and commits once only on success. Missing entities, invalid domain input, and a simulated storage failure leave the previous stored state unchanged. Requests for one project cannot read or modify another project's entities. Mutating caller inputs or returned read data cannot mutate the adapter's stored state.
- AC-9: Application operations coordinate existing domain behavior through an explicit storage port; an in-memory adapter implements that port without defining a canonical persistence format or enlarging the Project entity into a canonical aggregate of all data. Tests exercise the complete workflow through application calls, not direct domain calls disguised as application coverage. No domain/application dependency on a UI, browser API, Electron, filesystem, network, or new third-party runtime library is introduced.

## Decisions and open questions

### Established constraints and implementation evidence

- [Project ownership](../design-tokens/conceptual-model.md#project-ownership-and-identity), [explicit types](../design-tokens/conceptual-model.md#explicit-token-types), [optional layers](../design-tokens/conceptual-model.md#token-layers), [same-project references](../design-tokens/conceptual-model.md#tokenreference), and [variation resolution](../design-tokens/conceptual-model.md#variation-resolution-contract) remain authoritative. Normal reference authoring targets existing same-project tokens; loaders may preserve invalid references for repair.
- Existing [Project](../../src/domain/project.ts), [TokenGroup](../../src/domain/token-group.ts), and [Token](../../src/domain/token.ts) constructors accept caller-supplied identities and opaque names. They do not enforce cross-entity identity uniqueness or parent/reference existence. Token construction does not validate arbitrary literal objects; application color creation must use the [color constructor](../../src/domain/color-literal.ts).
- [Namespace operations](../../src/domain/namespace.ts) enforce structural ownership/ancestry and derive segment arrays. Duplicate identities throw `RangeError`; structural problems return diagnostics. [Reference validation](../../src/domain/token-reference-validation.ts) and [resolution](../../src/domain/token-resolution.ts) return structured diagnostics/results but also reject duplicate token IDs by exception. Application coordination must account for both forms without replacing diagnostic detail with a generic success/failure flag.
- The model says groups and tokens share a sibling namespace so paths remain unambiguous. Implementation and [current status](../status/current.md#blockers-and-unresolved-decisions) explicitly defer sibling-name collision checks; duplicate paths currently pass structural validation. This is a documented enforcement gap, not permission to infer unique paths or silently choose a naming policy.

### Agreed decisions — 3 November 2026

- D1 — **Workflow boundary.** Keep this enabling increment color-only and unconditional, with grouping at creation and one group rename. Moves and value editing are deferred. This is separate from the complete PWA.
- D2 — **Sibling collisions.** Explicitly defer sibling-name collision enforcement for this increment. Validation is structural only; duplicate names are neither normalized nor auto-renamed, and derived paths may be ambiguous. The model's unambiguous-path direction remains; this increment does not fulfill its naming validation coverage. Broader grammar, Unicode/case normalization, and target-name rules remain open.
- D3 — **Storage and identity boundary.** Use caller-supplied opaque identities and one narrow project-scoped storage port backed by an in-memory adapter, holding Project metadata plus separate group/token collections. Operations load an operational snapshot and commit a checked candidate for sequential single-writer calls; snapshots are coordination data, not a persisted Project aggregate or canonical file schema. Reject duplicate project identities and duplicate identities within each project/entity collection. No identity-generation format, database, browser store, cross-project global indexing, or concurrency protocol is selected.
- D4 — **Authoring and failure policy.** Reject invalid normal-authoring commands without changing stored state. Use explicit application failure results for expected command failures and preserve existing domain results/diagnostic details for reads and validation. Preloaded fixtures verify repairable-data reads without adding a loader API. Successful resolution is not required for every structurally valid reference: a typed-but-unassigned color target is referenceable. Storage failure remains distinct from invalid authoring; unexpected programmer faults must not be relabeled as ordinary invalid input. Exact TypeScript signatures and result discriminants are routine implementation choices within these behaviors.

### Deferred

Frontend technology, persistence format/manifest, runtime schema/bridge library, browser storage, backup, first adapter/profile and its compatibility promise, initial variation axes, full PWA acceptance, and Electron packaging remain in the owning [open questions](../planning/open-questions.md). This enabling increment must not be presented as resolving those prerequisites for the complete PWA. The agreed enabling boundaries are recorded in the application architecture and status handoff; those broader deferred choices remain unresolved.

## Verification approach

- Add application behavior tests using the in-memory adapter: empty-project readback (AC-1), nested organization and rename (AC-2/AC-5), exact color and semantic alias creation/inspection (AC-3–AC-5), and explicit diagnostic separation with focused preloaded fixtures (AC-6/AC-7).
- Test failures against before/after stored snapshots: unknown project/entity, duplicate identity, missing/foreign parent/target, incompatible target type, invalid color input, and fake commit failure (AC-1–AC-4/AC-8). Include two project contexts, root placement, a typed-but-unassigned target, and input/output mutation isolation. Collision cases must demonstrate the explicit D2 deferral.
- Inspect dependencies and operation boundaries manually (AC-9); run `npm run typecheck`, `npm test`, and `git diff --check`. Retain existing domain regression coverage; do not duplicate all five color-space domain suites in application tests.
- No browser, installation/offline, durability, adapter integration, export/conformance, performance, or Electron verification is claimed. The repository has no web entry point, so its existing build command is not an application acceptance check.

## Review baseline

- Planning baseline supplied and verified by the coordinator: clean `dev` at `9cb5a938be652f94d111929b4ff240fe16bc0289`, 3 November 2026. No application implementation has started.
- Coordinator reports baseline `npm run typecheck` passed and `npm test` passed with 23 files / 614 tests under Node.js `24.14.1` and npm `11.17.0`. The analyst inspected source/tests and has not independently rerun those commands; these baseline checks are not evidence for proposed application behavior.
- Implementation baseline: clean `dev` at `3536ae6` before agreement documentation edits; no unrelated working-tree changes.
- Implementation review: snapshot `increment-001-review-1`, base `3536ae61bd33ca412f4157b7f40bc1d7e8b958fd` plus the exact tracked diff and six new source/test files identified below. Reviewer verified all 13 changed/new file hashes and membership before and after review. Completion/status documentation was updated afterward; source and tests remain identical to the reviewed snapshot.

## Agreed amendments

3 November 2026 — User agreed the four recommended decision bundles and authorized implementation followed by separate review. Scope and AC IDs are unchanged; D2 explicitly permits ambiguous derived paths within this enabling increment.


## Completion report

- Delivery status: Completed
- Date: 3 November 2026
- Reviewed snapshot: `increment-001-review-1`, base `3536ae61bd33ca412f4157b7f40bc1d7e8b958fd` plus uncommitted changes to `AGENTS.md`, `README.md`, the canonical model, this contract, open questions, architecture, status handoff, and the six new files below. No unrelated changes existed at implementation start. Tracked diff and SHA256 manifest were frozen before review; all 13 files remained unchanged throughout review. Only this completion report/status metadata and the status handoff were changed afterward.

### Result

`createAuthoringOperations(storage)` provides project/group creation, unconditional structured color literal and whole-value alias authoring, group rename, project readback with derived paths, token inspection with separate authored/resolved data, and separate namespace/reference validation results. The in-memory adapter copies its inputs and outputs. Invalid commands and simulated storage failures preserve stored state. Existing domain behavior and dependencies are unchanged.

### Acceptance evidence

| Criterion | Evidence and result | Status |
|---|---|---|
| AC-1 | [Authoring tests](../../test/application/authoring.test.ts): empty metadata/readback, unknown project, duplicate project protection. | Verified |
| AC-2 | Authoring tests: root/nested groups and token placement, derived paths, missing/foreign parents, opaque names and explicit sibling-collision deferral. | Verified |
| AC-3 | Authoring tests: all five existing spaces, exact Decimal components/alpha, hue normalization, invalid Decimal/count/space/alpha rejection. | Verified |
| AC-4 | Authoring and [repairable-data tests](../../test/application/repairable-data.test.ts): explicit semantic aliases, missing/foreign/untyped/incompatible target rejection, typed-but-unassigned target acceptance. | Verified |
| AC-5 | Authoring tests: exact literal/alias resolution and trace, separate authored data, ancestor rename preserves identities and references, read/result mutation isolation. | Verified |
| AC-6 | Repairable-data tests: separate structural/reference diagnostics with original details and no full-validity flag. | Verified |
| AC-7 | Repairable-data tests: stored missing references, unsupported paths, missing assignments and selected cycles retain authored data and return existing outcomes/traces. | Verified |
| AC-8 | Authoring and [adapter tests](../../test/adapters/in-memory-project-storage.test.ts): identity rejection, project isolation, one commit on success, unchanged snapshots on rejected commands/failed commits, detached inputs/outputs. | Verified |
| AC-9 | Reviewer inspected [application operations](../../src/application/authoring.ts), [storage port](../../src/application/project-storage.ts), [adapter](../../src/adapters/in-memory-project-storage.ts), imports and tests. Domain functions own semantics; no new host/runtime dependency or persistence schema. | Verified |

### Checks and independent review

- Developer `/root/developer`: `npm run typecheck`, `npm test` (26 files / 644 tests, including 30 new application/adapter tests), and `git diff --check` passed.
- Separate fresh-context reviewer `/root/reviewer` derived expectations from the agreed contract, reviewed the designated snapshot and all ACs, and independently passed type checking and the full 644-test suite in an isolated copy. Snapshot identity, changed-file membership, whitespace and Markdown local link targets were checked.
- Reviewer mutation probe: weakening reference rejection caused three relevant tests to fail (missing target, missing declared type, incompatible type). The isolated copy was restored. Additional isolated probes checked opaque IDs, identical token IDs in distinct projects, rejected self-reference with unchanged state, and storage exception propagation.
- Findings: no actionable implementation defects or unresolved contract ambiguities. Optional handoff wording about future application work was narrowed to extending the implemented operations for the selected PWA workflow.
- Unresolved disagreements: none.

### Decisions made

The user-agreed D1–D4 decisions are recorded above and in [architecture](../project/architecture.md#first-application-operation-increment). Routine implementation choices are synchronous sequential calls, a small discriminated application-result union, one snapshot load/commit port, and plain-data copying in the adapter. None selects a canonical storage format or concurrency protocol.

### Limits and remaining work

Data lasts only for the adapter lifetime. Atomic failure behavior is a storage-port obligation, tested with a controlled failing adapter; durable adapters require their own integration evidence. Sibling names may collide and derived paths may be ambiguous. No visible UI, durable storage, backup, import/export, variation authoring, value editing/moves, Electron host, concurrent writers, performance benchmark, or external compatibility promise is delivered. Build/UI/install/offline checks were not run because there is no web entry point. Type checking/tests verify this enabling workflow, not the complete PWA.

### Reviewed new files

The hashes below identify the reviewed source/test content, unchanged at completion. The seven tracked files listed in the snapshot description contain agreement and state documentation; the post-review changes are completion/status reporting only.

| New file | SHA256 |
|---|---|
| `src/adapters/in-memory-project-storage.ts` | `ec64cb1b75c35fb7df9b948eb1ca2bfe6fd410290e3654d8a553dcff64598989` |
| `src/application/authoring.ts` | `82db69427b2c8fd4451624192b381af1c9cef246dc3c68d821f70cb158ad3cb9` |
| `src/application/project-storage.ts` | `ae84603e8c16f2f4b2a5fafc0a39327eaf17d2d518a071c10873d9efc1a886f8` |
| `test/adapters/in-memory-project-storage.test.ts` | `3ffae485b91203a71403e8038d2c11a9120a83959b6958d2bddea716fbac7d7a` |
| `test/application/authoring.test.ts` | `02f1457c5249fb80d3782ef3f163118b637b2df7b5e812a552759ed3cdb20f86` |
| `test/application/repairable-data.test.ts` | `d5e72bbf973b953ef947a4c1ca4ca0a62344333df216d0ce96fbf990eacc3dde` |

### Next step

Select the next concrete authoring/PWA increment and its contract, resolving only the product and architectural questions it needs. Durable project retention/backup, editing and movement, initial interchange profile, and full PWA/Electron acceptance boundaries remain candidates for explicit analysis. This report does not authorize the next increment, a merge, push, release, or deployment.
