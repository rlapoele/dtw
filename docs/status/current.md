# Current Project Status

> Last updated: 6 October 2026
>
> Phase: domain discovery and development scaffolding
>
> Implementation state: npm scaffold with TypeScript, Vite, and Vitest; no domain code, tests, or web entry point

## Current focus

The project has a coherent product, domain, architecture, and interoperability baseline, plus an initial TypeScript, Vite, and Vitest scaffold using npm. Current work is narrowing the canonical data model against concrete CSS and strict DTCG export cases before implementation. The core model now includes storage-neutral Token, ComponentDefinition, VariationAxis, and ThemePreset aggregates; owned conditional token assignments; identity-less stable-ID TokenReference values with schema-relative value paths; identity-less structured ExpressionValue ASTs with versioned typed operations and explicit context dependencies; and a deliberately coarse ComponentContract boundary for future parts, slots, properties, variants, states, and token bindings. It also covers minimal projects, stable identities, namespace groups with derived paths, incomplete token definitions, optional layers and semantic roles, a selected foundational type set, and named composites. Number and dimension literals now use normalized exact Decimal values; dimensions carry an explicit `px` or `rem` unit in the flattened literal shape. Their initial portable expression algebra defines exact context-free number and same-unit operations, explicit `font.rootSize` context for mixed `px`/`rem`, and distinct invalid-expression outcomes. Theme variability uses independent variation axes, flat named presets, deterministic selection completion and most-specific assignment matching, explicit ambiguity and failure outcomes, and recursive dependency resolution under one completed selection. Scale generation is domain behavior without persisted scale entities or live generator dependencies. Context-aware preview remains a working direction. The delivery sequence remains PWA first and Electron immediately after the first complete vertical slice.

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
- Recorded [export-aware modeling](../design-tokens/conceptual-model.md#export-aware-modeling) using CSS and strict DTCG `2025.10` as the first modeling cases without selecting adapter order or full coverage.
- Defined [ExpressionValue](../design-tokens/conceptual-model.md#expressions) as an identity-less, structured, serializable typed AST. Versioned operation contracts derive result types and define arity, operand typing, unit algebra, context, precision, and rounding; literals, stable-identity references, nested expressions, and explicit context references form operands; authored ASTs survive evaluation; and generic inline fallbacks are excluded. The initial portable mathematical family is addition, subtraction, scaling, binary minimum and maximum, and clamp.
- Recorded [context-aware previews](../design-tokens/conceptual-model.md#value-previews) as a working direction, with browser rendering outside the domain and observed results distinct from canonical values.
- Established [scale helpers](../design-tokens/conceptual-model.md#scale-generation) as deterministic domain calculations: selected results become ordinary editable tokens without a live recipe relationship.
- Established [color authoring boundaries](../design-tokens/conceptual-model.md#authored-color-and-alternative-representations): one authoritative value per applicable theme/condition, preserved authored space/model, derived display representations, and explicit fallbacks. [Color manipulation](../design-tokens/conceptual-model.md#color-manipulation) belongs in the domain; its initial coverage and policies remain open.
- Selected [independent variation axes](../design-tokens/conceptual-model.md#themes-and-modes), conditional token values, deterministic most-specific resolution, and named presets as the working canonical direction for composable themes. UI views may be hierarchical or matrix-based; adapters may flatten combinations only with explicit diagnostics.
- Selected direct [project ownership and stable identity](../design-tokens/conceptual-model.md#project-ownership-and-identity): a project may contain zero tokens; every token belongs to one project; tokens and namespace groups retain stable non-semantic identities; token paths derive from single-parent namespace containment; and defined tokens store their explicit type. Packaging is deferred until a concrete distribution or reuse workflow requires it.
- Selected the [authored-value and type boundaries](../design-tokens/conceptual-model.md#authored-values-and-assignments): tokens may begin as name-only incomplete definitions; assignments contain typed literals, stable-identity references, structured expressions, or named composites under unique normalized conditions; completeness is derived rather than represented by an empty value.
- Selected the [canonical foundational value types and initial composites](../design-tokens/conceptual-model.md#three-independent-axes). Foundational types are color, number, dimension, percentage, angle, duration, string, boolean, font family, font weight, and cubic Bézier. Named composites are typography, shadow, gradient, border, and transition. Layer and semantic role remain optional explicit dimensions; purpose-specific concepts such as spacing and opacity are roles rather than additional value types.
- Established [reviewable generated-change proposals and regeneration protection](../design-tokens/conceptual-model.md#generated-change-proposals-and-protection): helpers do not mutate canonical tokens directly; changes can be accepted or rejected individually; protected tokens are skipped visibly by default; and accepted results have no live generator dependency.
- Defined the storage-neutral [Token aggregate and assignment structure](../design-tokens/conceptual-model.md#token-aggregate-and-assignment-structure): Token is an independently loaded aggregate root; its optional typed definition owns identity-less conditional assignments; completeness is derived; assignment order has no semantics; and cross-token, group, variation, component, and graph invariants are validated by project-scoped domain operations.
- Defined the minimal [ComponentDefinition and ComponentContract boundary](../design-tokens/conceptual-model.md#component-definitions-contracts-and-token-bindings): component-token ownership remains explicit on Token; contract bindings describe component usage; component authoring may create definitions, tokens, and bindings atomically; and detailed anatomy, slots, properties, variants, and states are deliberately deferred.
- Selected [exact decimal numeric values and normalized percentage ratios](../design-tokens/conceptual-model.md#exact-decimal-numeric-values-and-percentages): canonical numeric values do not use binary floating point as their authority; normalized non-exponent text gives each Decimal one stored representation; percentages store exact ratios; calculation precision is explicit; and UI or export formatting does not mutate canonical values.
- Defined [number and dimension literal schemas](../design-tokens/conceptual-model.md#number-and-dimension-literals): both use the flattened `kind`, `valueType`, and exact `value` shape; dimensions add a required lowercase `px` or `rem` unit, including for zero. Number and dimension references initially address whole values only. Their first portable expression algebra preserves same units, requires explicit non-negative `font.rootSize` context for mixed `px`/`rem`, returns mixed-unit results in `px`, and distinguishes invalid expressions from unsupported operations.
- Defined [VariationAxis and VariationOption](../design-tokens/conceptual-model.md#variationaxis-and-variationoption): an axis is a complete project-owned aggregate with one or more stable-identity owned options and one explicit default; option ordering is non-semantic; and referenced options or axes require reviewed project-scoped migration before removal.
- Defined [ThemePreset](../design-tokens/conceptual-model.md#themepreset) as a stable project-owned named partial variation selection: omitted axes derive their defaults; presets remain flat and own no token values; token conditions never reference presets; and activation preferences and target mappings remain separate concerns.
- Defined the [variation-resolution contract](../design-tokens/conceptual-model.md#variation-resolution-contract): activation produces one completed selection; assignments match by condition specificity without order-based tie-breaking; all highest-specificity ties are ambiguous; dependencies resolve under the same selection; and expected failures return structured diagnostics and derived traces.
- Defined [TokenReference](../design-tokens/conceptual-model.md#tokenreference) as an identity-less same-project authored value using stable token identity and a schema-relative value path: resolution uses the same completed variation selection; expected type comes from the use site; adapters derive external addresses; and broken canonical references remain visible for explicit repair.

## Next meaningful actions

1. Select the first user and minimum end-to-end workflow.
2. Define exact schemas for the remaining selected foundational literals and composites, including legal part-reference paths. Compare the decided number and dimension literals and expression algebra with small CSS and strict DTCG output and diagnostic fixtures. Detail ComponentContract internals only when a concrete component-authoring slice requires them.
3. Decide the persistence boundary relative to DTCG and the minimum project manifest.
4. Select the first target adapter and state its compatibility promise, including expression and color conversion handling; define the initial scale-helper, color-operation, and preview subsets.
5. Define acceptance criteria for the first PWA vertical slice and the immediately following Electron prototype without prematurely selecting unrelated infrastructure.

These actions propose the order of the remaining decisions. The PWA-first and immediately-following Electron sequence is settled as a working decision; the detailed slice, technologies, schemas, and compatibility promises remain unresolved.

## Blockers and unresolved decisions

There are no known external blockers. Domain implementation requires explicit choices for the behavior being implemented; product and delivery work remains guided by [`docs/planning/open-questions.md`](../planning/open-questions.md). Remaining literal and composite schemas, Decimal resource limits and future non-finite-result calculation policies, identifier formats, local-name grammar, sibling ordering, additional expression units and evaluation-context keys, initial axis selection, cross-axis constraints and coverage profiles, diagnostic payloads, activation-preference ownership, persistence, export policies, color-operation and fallback policies, and initial helper/preview coverage remain unresolved. This milestone changed documentation only; no implementation was started.

Do not silently choose a frontend framework, canonical persistence format, browser storage mechanism, database, schema library, plugin system, or package topology beyond the initial scaffold.

## Verification expectations

Type-check and test commands are documented in [README.md](../../README.md). They currently report no inputs and no tests, respectively; the scaffold has no behavior to verify yet. Build and preview commands await an entry point and generated output. For documentation changes:

- inspect `git status` and the scoped diff;
- run `git diff --check`;
- review Markdown structure, links, terminology, confidence labels, and cross-document consistency;
- confirm that vendored DTCG reference files were not modified unintentionally.
