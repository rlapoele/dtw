# Open Questions

## How to use this document

These questions are intentionally unresolved. They are not implementation gaps that a future contributor or coding agent should fill by convenience. Important answers should be recorded as explicit decisions and reflected consistently across the inception documents.

Suggested decision states for future use are: `open`, `investigating`, `proposed`, `decided`, and `deferred`.

## Product scope and users

1. Which user and workflow should define the first useful product slice?
2. What is the minimum end-to-end workflow: author → validate → export, import → normalize → export, or another path?
3. How much visual editing is needed versus structured or source-oriented editing?
4. What does “local-first” require beyond offline availability and local ownership?
5. Must core use remain account-free permanently, or only at initial launch?
6. Which capabilities remain available in the PWA, and which require the subsequent Electron host or a future ecosystem surface?

## Canonical model

1. Beyond the decided exact-decimal numeric basis and normalized percentage ratio, what literal schema, accepted units, and constraints apply to each selected foundational type?
2. What exact fields, cardinalities, and nested-reference rules apply to typography, shadow, gradient, border, and transition composites?
3. What exact schemas, cardinalities, and rules should eventually define component parts, slots, properties, variant axes, interactive states, and component-token bindings inside `ComponentContract`?
4. Are patterns, images, or video fills within scope, and would they demonstrate a need for a future paint abstraction?
5. Which reference directions between primitive, semantic, and component layers are allowed?
6. Which expression abstract syntax tree, typing rules, and portable versus CSS-specific operations are permitted initially?
7. Which selected foundational types and composites belong in the first implementation slice?

[Project ownership, stable token identity, namespace groups, derived paths, the Token aggregate and owned assignment structure, authored-value forms, optional layers and semantic roles, foundational value types, the initial composite set, and the minimal ComponentDefinition and ComponentContract boundary](../design-tokens/conceptual-model.md) are working decisions. Name-only and typed-but-unassigned tokens are valid project members; definition completeness is derived. Component contracts deliberately anticipate parts, slots, properties, variant axes, interactive states, and token bindings without defining them in detail. The identifier format, local-name grammar, sibling ordering, group-deletion operations, optional group constraints, exact type and composite schemas, and persistence schema remain open.

Expression support is a [working decision](../design-tokens/conceptual-model.md#expressions); its concrete schema and coverage are not selected. Scale generation is [domain behavior](../design-tokens/conceptual-model.md#scale-generation), not a requirement for persisted scale entities or live token dependencies.

Numeric literals use an exact finite base-10 Decimal value object, and percentage literals store normalized ratios. The exact decimal grammar, normalization limits, calculation precision, and rounding policies remain open; display and adapter formatting must not mutate canonical values.

## Color values and operations

The [authored-color decision](../design-tokens/conceptual-model.md#authored-color-and-alternative-representations) keeps one authoritative value per applicable theme/condition, preserves a literal's space/model, and treats alternative display representations as derived. Deterministic [color manipulation](../design-tokens/conceptual-model.md#color-manipulation) belongs in the domain engine.

1. Which color spaces/models and editing notations should be supported initially?
2. What component, alpha, and missing-component schema and validation rules should the canonical literal use?
3. How do edits in a different representation affect the authored space/model, and how are alias or expression edits handled explicitly?
4. Which conversion, component-adjustment, mixing, interpolation, and palette-generation operations are initially supported?
5. Which precision, rounding, hue, alpha, and gamut-mapping policies make each operation deterministic?
6. Are fallbacks author-managed canonical data, generated adapter output, or both under explicit policies, and how are stale fallbacks handled?
7. What fixtures and numerical tolerances should validate the chosen algorithms or future color-library dependency?

No color library, canonical schema, universal operation set, or fallback-generation algorithm is selected by these decisions.

## Authoring helpers and value previews

1. Which scale patterns and parameters should the first helpers support?
2. What validation, rounding, units, naming, and collision rules govern candidate creation?
3. Would saved helper presets be useful, and where would that non-canonical configuration belong?
4. Which token types and expressions require which preview specimens in the first slice?
5. What explicit contexts and browser capability baseline should previews support?
6. How should preview diagnostics distinguish missing context, unsupported rendering, and invalid values or dependencies?

Created tokens have no live link to scale helpers. Context-aware preview is a working direction, not a promise to render every possible value.

## Taxonomy and naming

1. Is the default taxonomy configurable, extensible, or replaceable?
2. Which names are reserved core vocabulary?
3. Can users define custom semantic roles while retaining adapter compatibility?
4. What is the standard grammar for variants and interactive states?
5. How should role overlaps such as accent, brand, action, and interactive be resolved?
6. How are taxonomy changes and migrations represented?
7. Should projects be able to enforce stricter naming profiles?

The decision to omit a redundant `status` node above `info`, `success`, `warning`, and `danger` is established and is not currently an open question.

## Themes and variability

The canonical composition direction is decided: model independent [variation axes](../design-tokens/conceptual-model.md#themes-and-modes), conditional token values, deterministic most-specific resolution, and named presets. User interfaces may present the model hierarchically or as a matrix; adapters may flatten combinations with explicit diagnostics. Different axes share a composition mechanism without becoming semantically equivalent.

Remaining questions:

1. Which axes and options belong in the first slice, and which project-defined axes are permitted?
2. Which constraints make an option combination invalid or unavailable?
3. When may a token inherit a less-specific value, and when must a validation profile require explicit coverage for a selection?
4. How are defaults, missing applicable values, and equally specific ambiguities represented and explained in the exact schema?
5. How should conditional aliases and expressions be represented, resolved, and diagnosed?
6. Where are axes, presets, and project activation preferences persisted relative to canonical authored token data?
7. How should axes and presets map to DTCG Resolver documents, Figma collections/modes, Penpot sets/themes, and CSS activation mechanisms?

## Persistence and project structure

The existence of an explicit project is decided: users create, open, or import a project before editing tokens. A project may contain no tokens; every token and namespace group belongs to exactly one project. The initial canonical ownership model does not require a package entity.

1. What is the canonical source-of-truth file format?
2. What constitutes stable project identity, and how is it preserved when a workspace moves?
3. Should canonical persistence itself use DTCG, extend it, or use a separate project model with DTCG import/export?
4. How is adapter-specific metadata stored without polluting the core model?
5. How are comments, sibling ordering, formatting, and manual edits preserved?
6. What belongs in authored data, project configuration, caches, and generated output?
7. Can multiple files form one canonical project, and how are references addressed across them?
8. How are migrations and project schema versions handled?
9. How are recent, missing, moved, duplicated, and imported projects recognized?

## Interoperability

The stable DTCG `2025.10` reports are the current strict interchange and research baseline. This does not select DTCG as canonical persistence, guarantee complete initial support, make Figma and Penpot native formats equivalent to DTCG, or make Style Dictionary acceptance proof of conformance.

1. Which exact Figma, Penpot, and Style Dictionary versions and workflows will the first adapters target?
2. What level of round-trip fidelity is promised for each target?
3. How much source provenance should survive normalization?
4. When should an importer infer semantic roles, and when must it ask the user?
5. How are target-only concepts retained for re-export?
6. What should happen to unsupported concepts: block, omit, flatten, approximate, or emit alternate artifacts?
7. How are target capability profiles versioned and tested?
8. Which subset of `dtcg-2025.10` must the first strict importer and exporter support?
9. Which normative DTCG processor behaviors belong in the first conformance suite, including JSON Pointer and extension preservation?
10. How are vendor extensions reviewed and namespaced?
11. Should an initial Style Dictionary adapter only compile validated generated input, or also offer explicitly lossy legacy-to-DTCG migration?
12. What initial CSS export profile should be supported, and in which implementation order relative to strict DTCG?
13. Which expression evaluation, reviewed fallback, blocking, and metadata-preservation policies should each export profile allow?

CSS and strict DTCG `2025.10` are the [first concrete modeling cases](../design-tokens/interoperability.md#initial-modeling-targets-and-expressions), not a selected adapter order or complete coverage promise.

## Validation and change management

1. Which invariants make a canonical project valid?
2. Which rules are universal, project-configurable, or target-specific?
3. How should warnings distinguish correctness, interoperability loss, accessibility concerns, and conventions?
4. What constitutes a breaking token change?
5. How should semantic diffs represent alias, theme, and resolved-value changes?
6. Which accessibility checks belong in the workbench, and what context do they require?

## Future packaging, versions, and forking

Packaging is not part of the initial canonical ownership model. If independent distribution or reuse later requires it:

1. What exactly constitutes a token package?
2. Can packages depend on or extend other packages?
3. Which versioning scheme matches token-system changes?
4. Are published package versions immutable?
5. How are forks, lineage, and upstream changes represented?
6. How do consumers customize a package without losing an upgrade path?
7. What metadata, documentation, previews, licenses, and compatibility claims are required?
8. Is a registry needed, and can packages also be distributed independently?

## Web community and marketplace

1. Which discovery and preview experiences provide value before social features?
2. What can be viewed without an account?
3. How do publishing, moderation, trust, provenance, and abuse handling work?
4. Is a marketplace desirable after community sharing is validated?
5. What licensing models are supported, and how are entitlements enforced without undermining portability?
6. What commercial model, if any, aligns with an open interoperability foundation?

Marketplace work remains a future possibility, not an MVP assumption.

## AI assistance

1. Which task benefits most from AI: explanation, normalization, naming, documentation, migration, or validation triage?
2. Which operations must remain entirely deterministic?
3. What data may leave the local machine, under what consent and policy?
4. How are suggestions reviewed, attributed, reverted, and audited?
5. Can useful assistance work without a hosted provider?
6. How is hallucinated semantic intent prevented from becoming canonical data?

AI assistance is exploratory and must not be required for core authoring.

## Architecture and implementation

The following directions are decided or selected for validation:

- web-first renderer using HTML, CSS, JavaScript or TypeScript, and standard Web APIs;
- a desktop-oriented, offline-capable PWA as the first implementation host;
- Electron as the immediately following host-validation milestone and intended packaged desktop runtime;
- a typed, validated RPC-style preload API over Electron IPC;
- a restrained hexagonal architecture with a UI-independent token engine, shared application operations, and replaceable adapters;
- reuse of the same engine and operations from Electron, CLI, web, MCP, automation, and tests where appropriate;
- TypeScript with strict checking for the initial domain code, Vite for build tooling, Vitest for unit tests, and npm with a lockfile in a single private scaffold package.

Remaining questions:

1. Which frontend framework and component approach best support the editor?
2. Which runtime-schema and RPC-contract approach keeps the bridge typed without coupling the application to Electron?
3. When would package boundaries beyond the initial single-package scaffold provide real reuse without creating a premature monorepo taxonomy?
4. Which work should remain in Electron's main process, and which should move to utility processes or workers?
5. Which browser persistence, backup, and file-access adapters should the PWA use, and which persistence engine, if any, is needed beyond authored project files?
6. Is a plugin system needed, and if so, for which concrete extension use cases?
7. How will large token graphs be indexed, resolved, watched, and diffed?
8. What exact acceptance criteria define the first complete PWA vertical slice and the immediately following Electron boundary, packaging, and OS-integration prototype?
9. Which CLI or MCP workflow should first prove that the application layer is genuinely surface-independent?
10. What security and trust model governs external commands, adapters, plugins, and remote community content?

## Decision priorities

Before implementation planning, resolve or narrow at least:

1. the first user and end-to-end workflow;
2. the minimal canonical model;
3. theme and alias semantics;
4. persistence boundaries relative to DTCG;
5. the first target adapter and its compatibility promise;
6. the MVP boundary;
7. the minimal project manifest and namespace hierarchy representation;
8. the acceptance boundary between the first PWA vertical slice and the immediately following Electron architecture and distribution prototype.
