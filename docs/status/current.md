# Current Project Status

> Last updated: 29 September 2026  
> Phase: inception and discovery  
> Implementation state: documentation-only; no application code or established build, test, or package toolchain

## Current focus

The project has a coherent product, domain, architecture, and interoperability baseline. The delivery sequence is now PWA first and Electron immediately after the first complete vertical slice. The next phase should narrow that slice and the minimum canonical model before selecting unresolved implementation technologies.

There is no active implementation milestone. New work should begin from the decision priorities in [`docs/planning/open-questions.md`](../planning/open-questions.md#decision-priorities), not by inferring convenient defaults.

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

## Next meaningful actions

1. Select the first user and minimum end-to-end workflow.
2. Define the minimum canonical token schema, including alias and theme semantics.
3. Decide the persistence boundary relative to DTCG and the minimum project manifest.
4. Select the first target adapter and state its compatibility promise.
5. Define acceptance criteria for the first PWA vertical slice and the immediately following Electron prototype without prematurely selecting unrelated infrastructure.

These actions propose the order of the remaining decisions. The PWA-first and immediately-following Electron sequence is settled as a working decision; the detailed slice, technologies, schemas, and compatibility promises remain unresolved.

## Blockers and unresolved decisions

There are no known external blockers. Product and implementation work is intentionally gated by the unresolved questions summarized in [`docs/planning/open-questions.md`](../planning/open-questions.md), especially its decision priorities.

Do not silently choose a frontend framework, canonical persistence format, browser storage mechanism, database, schema library, plugin system, or build topology.

## Verification expectations

The repository currently has no automated checks. For documentation changes:

- inspect `git status` and the scoped diff;
- run `git diff --check`;
- review Markdown structure, links, terminology, confidence labels, and cross-document consistency;
- confirm that vendored DTCG reference files were not modified unintentionally.
