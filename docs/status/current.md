# Current Project Status

> Last updated: 1 October 2026
>
> Phase: domain discovery and development scaffolding
>
> Implementation state: npm scaffold with TypeScript, Vite, and Vitest; no domain code, tests, or web entry point

## Current focus

The project has a coherent product, domain, architecture, and interoperability baseline. An initial TypeScript, Vite, and Vitest scaffold is now in place using npm. The immediate next step is to specify a small domain behavior and its identity, reference, value, and diagnostic rules before implementing it with unit tests. The delivery sequence remains PWA first and Electron immediately after the first complete vertical slice.

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

## Next meaningful actions

1. Select the first user and minimum end-to-end workflow.
2. Define the minimum canonical token schema, including alias and theme semantics.
3. Decide the persistence boundary relative to DTCG and the minimum project manifest.
4. Select the first target adapter and state its compatibility promise.
5. Define acceptance criteria for the first PWA vertical slice and the immediately following Electron prototype without prematurely selecting unrelated infrastructure.

These actions propose the order of the remaining decisions. The PWA-first and immediately-following Electron sequence is settled as a working decision; the detailed slice, technologies, schemas, and compatibility promises remain unresolved.

## Blockers and unresolved decisions

There are no known external blockers. Domain implementation requires explicit choices for the behavior being implemented; product and delivery work remains guided by [`docs/planning/open-questions.md`](../planning/open-questions.md). The initial scaffold does not resolve token identity, reference representation, theme semantics, or persistence.

Do not silently choose a frontend framework, canonical persistence format, browser storage mechanism, database, schema library, plugin system, or package topology beyond the initial scaffold.

## Verification expectations

Type-check and test commands are documented in [README.md](../../README.md). They currently report no inputs and no tests, respectively; the scaffold has no behavior to verify yet. Build and preview commands await an entry point and generated output. For documentation changes:

- inspect `git status` and the scoped diff;
- run `git diff --check`;
- review Markdown structure, links, terminology, confidence labels, and cross-document consistency;
- confirm that vendored DTCG reference files were not modified unintentionally.
