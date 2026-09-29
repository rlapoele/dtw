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

1. What is the minimal canonical token schema?
2. Is a token path its stable identity, or can a token be renamed without changing identity?
3. Which value types are foundational?
4. How are semantic roles represented independently from value types?
5. Which composites are first-class: typography, shadow, paint, gradient, motion, others?
6. Is `paint` a token type, a composite family, a usage view, or unnecessary abstraction?
7. Should a solid paint exist separately from its referenced color?
8. Are patterns, images, or video fills within scope?
9. Which reference directions between primitive, semantic, and component layers are allowed?
10. Are expressions part of the canonical model, and if so, which deterministic expression language is permitted?

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

1. How are themes represented canonically?
2. Are light/dark, brand, platform, density, contrast, and locale all the same kind of axis?
3. How do multiple axes compose, and what are the conflict and precedence rules?
4. Are themes mappings, activated token sets, modes, conditions, or a combination?
5. How are missing values and fallback behavior handled?
6. How should themes map to Figma collections/modes and Penpot sets/themes?

## Persistence and project structure

The existence of an explicit project is decided: users create, open, or import a project before editing tokens; every token belongs to a package; every package belongs to a project.

1. What is the canonical source-of-truth file format?
2. What constitutes stable project identity, and how is it preserved when a workspace moves?
3. What is the initial relationship between project, workspace, and token package?
4. Does the first release enforce one primary package per project?
5. Should canonical persistence itself use DTCG, extend it, or use a separate project model with DTCG import/export?
6. How is adapter-specific metadata stored without polluting the core model?
7. How are comments, ordering, formatting, and manual edits preserved?
8. What belongs in authored data, project configuration, caches, and generated output?
9. Can multiple files form one canonical project, and how are references addressed across them?
10. How are migrations and project schema versions handled?
11. Can a project refer to packages outside its workspace, and under what portability rules?
12. How are recent, missing, moved, duplicated, and imported projects recognized?

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
12. Which code-oriented export target should be supported first, if any?

## Validation and change management

1. Which invariants make a canonical project valid?
2. Which rules are universal, project-configurable, or target-specific?
3. How should warnings distinguish correctness, interoperability loss, accessibility concerns, and conventions?
4. What constitutes a breaking token change?
5. How should semantic diffs represent alias, theme, and resolved-value changes?
6. Which accessibility checks belong in the workbench, and what context do they require?

## Packages, versions, and forking

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
- reuse of the same engine and operations from Electron, CLI, web, MCP, automation, and tests where appropriate.

Remaining questions:

1. Which frontend framework and component approach best support the editor?
2. Which runtime-schema and RPC-contract approach keeps the bridge typed without coupling the application to Electron?
3. What initial package boundaries provide real reuse without creating a premature monorepo taxonomy?
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
7. the minimal project manifest and project/package relationship;
8. the acceptance boundary between the first PWA vertical slice and the immediately following Electron architecture and distribution prototype.
