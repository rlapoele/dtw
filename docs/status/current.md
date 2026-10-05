# Current Project Status

> Last updated: 5 October 2026
>
> Phase: domain discovery and development scaffolding
>
> Implementation state: npm scaffold with TypeScript, Vite, and Vitest; no domain code, tests, or web entry point

## Current focus

The project has a coherent product, domain, architecture, and interoperability baseline, plus an initial TypeScript, Vite, and Vitest scaffold using npm. Current work is narrowing the canonical data model against concrete CSS and strict DTCG export cases before implementation. The core model now includes a storage-neutral Token aggregate with owned conditional value assignments, alongside minimal projects, stable identities, namespace groups with derived paths, name-only and typed-but-unassigned tokens, optional layers and semantic roles, a selected foundational type set, and named composites. Theme variability uses independent variation axes, deterministic resolution, and named presets. Scale generation is domain behavior without persisted scale entities or live generator dependencies. Context-aware preview remains a working direction. The delivery sequence remains PWA first and Electron immediately after the first complete vertical slice.

No domain schema or behavior has been implemented. Use the unresolved questions in [`docs/planning/open-questions.md`](../planning/open-questions.md#decision-priorities) to guide explicit decisions; the scaffold does not settle them.

## Established baseline

- The product is a desktop-first, local-first Design Token Workbench upstream of external tools and code targets. See [`vision.md`](../project/vision.md) and [`product-concept.md`](../project/product-concept.md).
- The canonical model remains tool-independent, separates value type, semantic role, and composition, and preserves authored aliases. See [`conceptual-model.md`](../design-tokens/conceptual-model.md) and [`principles.md`](../project/principles.md).
- The architectural direction is a restrained hexagonal design with a UI-independent domain engine, a desktop-oriented offline-capable PWA as the first implementation host, and Electron as the immediately following host-validation milestone and intended packaged desktop runtime. See [`architecture.md`](../project/architecture.md).
- Stable DTCG `2025.10` is the strict interchange baseline, not the selected canonical persistence format. Native Figma, native Penpot, and Style Dictionary processor behavior are separate compatibility profiles. See [`interoperability.md`](../design-tokens/interoperability.md).
- The official DTCG `2025.10` Markdown sources are vendored as reference material under [`docs/references/dtcg-2025.10/`](../references/dtcg-2025.10/README.md).

## Recently completed

- Initialized Git with `dev` as the default branch and `main` and `releases` as additional branches; configured the GitHub remote at `https://github.com/rlapoele/dtw.git`.
- Added and documented the pinned DTCG `2025.10` Format, Color, and Resolver reference snapshot.
- Researched and documented the difference between strict DTCG conformance and Figma, Penpot, and Style Dictionary interoperability behavior.
- Added versioned compatibility-profile language covering document conformance, processor coverage, mapping coverage, and round-trip fidelity.
- Synchronized `AGENTS.md` with the current document map and interoperability constraints.
- Added this dedicated status-memory and handoff structure.
- Selected a PWA-first implementation sequence: validate the first complete browser vertical slice, then immediately validate reuse through Electron and desktop adapters before browser-only assumptions accumulate.
- Created empty `src/` and `test/` directories, installed TypeScript, Vite, and Vitest as npm development dependencies, and added type-check, test, development, build, and preview scripts. See [development commands](../../README.md#development-scaffold) and the [tooling decision](../project/architecture.md#initial-development-tooling).
- Recorded working decisions for [export-aware modeling](../design-tokens/conceptual-model.md#export-aware-modeling) and [authored expressions](../design-tokens/conceptual-model.md#expressions), using CSS and strict DTCG `2025.10` as the first modeling cases without selecting adapter order or full coverage.
- Recorded [context-aware previews](../design-tokens/conceptual-model.md#value-previews) as a working direction, with browser rendering outside the domain and observed results distinct from canonical values.
- Established [scale helpers](../design-tokens/conceptual-model.md#scale-generation) as deterministic domain calculations: selected results become ordinary editable tokens without a live recipe relationship.
- Established [color authoring boundaries](../design-tokens/conceptual-model.md#authored-color-and-alternative-representations): one authoritative value per applicable theme/condition, preserved authored space/model, derived display representations, and explicit fallbacks. [Color manipulation](../design-tokens/conceptual-model.md#color-manipulation) belongs in the domain; its initial coverage and policies remain open.
- Selected [independent variation axes](../design-tokens/conceptual-model.md#themes-and-modes), conditional token values, deterministic most-specific resolution, and named presets as the working canonical direction for composable themes. UI views may be hierarchical or matrix-based; adapters may flatten combinations only with explicit diagnostics.
- Selected direct [project ownership and stable identity](../design-tokens/conceptual-model.md#project-ownership-and-identity): a project may contain zero tokens; every token belongs to one project; tokens and namespace groups retain stable non-semantic identities; token paths derive from single-parent namespace containment; and defined tokens store their explicit type. Packaging is deferred until a concrete distribution or reuse workflow requires it.
- Selected the [authored-value and type boundaries](../design-tokens/conceptual-model.md#authored-values-and-assignments): tokens may begin as name-only incomplete definitions; assignments contain typed literals, stable-identity references, structured expressions, or named composites under unique normalized conditions; completeness is derived rather than represented by an empty value.
- Selected the [canonical foundational value types and initial composites](../design-tokens/conceptual-model.md#three-independent-axes). Foundational types are color, number, dimension, percentage, angle, duration, string, boolean, font family, font weight, and cubic Bézier. Named composites are typography, shadow, gradient, border, and transition. Layer and semantic role remain optional explicit dimensions; purpose-specific concepts such as spacing and opacity are roles rather than additional value types.
- Established [reviewable generated-change proposals and regeneration protection](../design-tokens/conceptual-model.md#generated-change-proposals-and-protection): helpers do not mutate canonical tokens directly; changes can be accepted or rejected individually; protected tokens are skipped visibly by default; and accepted results have no live generator dependency.
- Defined the storage-neutral [Token aggregate and assignment structure](../design-tokens/conceptual-model.md#token-aggregate-and-assignment-structure): Token is an independently loaded aggregate root; its optional typed definition owns identity-less conditional assignments; completeness is derived; assignment order has no semantics; and cross-token, group, variation, component, and graph invariants are validated by project-scoped domain operations.

## Next meaningful actions

1. Select the first user and minimum end-to-end workflow.
2. Define exact schemas for the selected foundational literals and composites, the `ComponentDefinition` entity, references, and expressions, then compare small canonical examples with CSS and strict DTCG output and diagnostics.
3. Decide the persistence boundary relative to DTCG and the minimum project manifest.
4. Select the first target adapter and state its compatibility promise, including expression and color conversion handling; define the initial scale-helper, color-operation, and preview subsets.
5. Define acceptance criteria for the first PWA vertical slice and the immediately following Electron prototype without prematurely selecting unrelated infrastructure.

These actions propose the order of the remaining decisions. The PWA-first and immediately-following Electron sequence is settled as a working decision; the detailed slice, technologies, schemas, and compatibility promises remain unresolved.

## Blockers and unresolved decisions

There are no known external blockers. Domain implementation requires explicit choices for the behavior being implemented; product and delivery work remains guided by [`docs/planning/open-questions.md`](../planning/open-questions.md). Exact type and composite schemas, identifier formats, local-name grammar, sibling ordering, expression operations, initial variation axes and coverage rules, persistence, export policies, color-operation and fallback policies, and initial helper/preview coverage remain unresolved. This milestone changed documentation only; no implementation was started.

Do not silently choose a frontend framework, canonical persistence format, browser storage mechanism, database, schema library, plugin system, or package topology beyond the initial scaffold.

## Verification expectations

Type-check and test commands are documented in [README.md](../../README.md). They currently report no inputs and no tests, respectively; the scaffold has no behavior to verify yet. Build and preview commands await an entry point and generated output. For documentation changes:

- inspect `git status` and the scoped diff;
- run `git diff --check`;
- review Markdown structure, links, terminology, confidence labels, and cross-document consistency;
- confirm that vendored DTCG reference files were not modified unintentionally.
