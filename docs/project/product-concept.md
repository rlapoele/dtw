# Product Concept

## Status convention

- **Established direction** — accepted as the basis for continued discovery.
- **Working hypothesis** — plausible and worth prototyping or researching.
- **Future possibility** — deliberately not part of the initial commitment.
- **Open question** — requires an explicit decision.

## Core proposition

**Established direction**

The Design Token Workbench is a desktop-first, local-first companion for designers and developers. It owns a canonical, tool-independent representation of token meaning and converts between that representation and external ecosystems through explicit adapters.

It should help people work with a design system as a connected model, not just a list of name/value pairs.

## Primary users

**Working hypothesis**

- Design-system designers defining foundations, semantics, themes, and component decisions.
- Engineers maintaining token files, transformations, and generated artifacts.
- Cross-functional teams reviewing how design intent maps into multiple tools and platforms.
- Authors preparing reusable token packages for other teams or the public.

## Project-centered workflow

**Established direction**

A project is the primary working context. Users create, open, or import a project before they create and edit tokens. This reflects the reality that designers and developers work across multiple products, brands, clients, and design systems.

```text
Project
├── identity and descriptive metadata
├── one or more token packages
├── project settings and validation profiles
├── import sources and provenance
├── export targets and compatibility reports
└── generated artifacts and local workflow metadata
```

Every token belongs to a package, and every package belongs to a project. The first product version may support one primary package per project while avoiding assumptions that would prevent multiple packages or dependencies later.

A project is distinct from:

- its **workspace**, meaning the local location or environment in which it is stored and edited;
- a **token package**, meaning a reusable or distributable token artifact owned by the project;
- a temporary editor session or open window.

Projects should have stable identity independent of a directory name so they can be renamed or moved. The exact manifest, on-disk layout, schema, and identity mechanism remain open.

## Core desktop workflows

### Author and understand

**Established direction**

- Create and edit primitives, semantic tokens, and component tokens.
- Express aliases rather than duplicating resolved values.
- Browse by value type, semantic role, layer, theme, or dependency.
- Inspect both authored and resolved values.
- Visualize relationships and downstream usage.

### Validate

**Established direction**

- Detect broken references, cycles, incompatible values, and invalid names.
- Apply model-level rules separately from target-specific compatibility rules.
- Explain degradations instead of treating export as a binary supported/unsupported operation.

**Working hypothesis**

Accessibility checks, naming guidance, and change-impact analysis could become first-class validation capabilities.

### Import and normalize

**Established direction**

Import is a staged process:

```text
source data
    → parse source representation
    → preserve available provenance
    → propose canonical concepts
    → surface ambiguity or loss
    → user reviews normalization
    → canonical model
```

Import must not imply that a vendor's taxonomy becomes the workbench taxonomy. Ambiguous mappings should be visible and revisable.

### Export through adapters

**Established direction**

Each export target owns a mapping from the canonical model into its supported concepts. The exporter should produce a compatibility report and distinguish:

- directly representable concepts;
- representable concepts that need target metadata or extensions;
- transformed or flattened concepts;
- unsupported concepts that must be omitted or converted to another artifact.

Potential targets include DTCG interchange, Figma, Penpot, CSS, JavaScript or TypeScript, and build-tool formats. This list is directional, not a delivery promise.

## Initial project experience

**Established direction with unresolved details**

A start experience should let users create a project, open a recent or existing project, or import existing token material into a newly created project. Once open, a project may contain authored token data, themes, target configuration, generated output, and compatibility reports.

An import workflow may create the containing project as part of the operation rather than forcing a redundant preliminary form. A lightweight untitled-project experience is also plausible if the project receives an identity immediately and chooses a durable location before persistence is required.

The workbench should integrate with normal source-control workflows and make generated files clearly different from canonical authored data.

The exact file layout and source-of-truth format are unresolved. A visual editor must coexist safely with manual file editing if files are exposed to users.

## Token packages

**Working hypothesis**

A token package may become the portable unit shared between the desktop workbench and a future web ecosystem. It could include:

- identity and authorship metadata;
- a version and changelog;
- canonical tokens, relationships, and themes;
- compatibility declarations or generated artifacts;
- documentation, preview information, and license terms.

Package boundaries, dependency semantics, and versioning rules remain open. “Package” currently names a useful product concept, not a finalized schema.

## Application architecture

**Established direction**

Use a restrained hexagonal architecture so the token engine remains independent of the desktop shell and independently testable.

```text
Electron · CLI · Web UI · MCP · tests
                   │
                   ▼
       application operations
                   │
                   ▼
             token engine
                   ▲
                   │
 filesystem · Git · process · import/export adapters
```

The Electron renderer is a Chromium web application. A secure isolated preload bridge exposes typed, validated, workbench-specific operations over Electron IPC. The backend coordinates application use cases and controlled OS capabilities. Neither the renderer nor Electron defines the canonical token model.

The same application operations should be callable directly from a CLI, mapped to MCP tools, or used by a browser surface with suitable storage or service adapters. This is a reuse objective, not a commitment to ship all surfaces in the first release. See `architecture.md` for the complete direction.

## Web ecosystem

**Working hypothesis**

The web product is primarily an ecosystem surface:

- discover and preview token packages;
- explore primitives, semantic roles, themes, and relationships;
- compare versions and packages;
- publish, share, discuss, or install packages.

This division keeps serious authoring close to local project files while making published systems easy to understand without installing the editor.

### Community, forking, and marketplace

**Future possibility**

Structured token data could enable semantic diffs, explicit forks, lineage, releases, contribution workflows, and eventually free or commercial distribution. A marketplace is plausible because the valuable artifact would be portable design-system knowledge rather than a single-tool file.

No business model, licensing policy, moderation model, payment flow, or marketplace requirement is established.

## AI assistance

**Explored direction / working hypothesis**

AI could assist with explanation, normalization suggestions, naming, documentation, validation triage, migration plans, and compatibility analysis. It should not silently invent semantics or overwrite authored decisions.

Any AI feature should:

- show its evidence and uncertainty;
- propose changes for review;
- respect local-first and privacy expectations;
- remain optional for core authoring;
- avoid turning deterministic transformations into opaque generation.

The provider, runtime, data policy, and initial use cases are open.

## Explicit non-decisions

The product concept does not yet choose:

- a frontend framework, component library, database, or canonical persistence format;
- cloud synchronization or real-time collaboration;
- a plugin architecture;
- a package registry protocol;
- pricing or commercial strategy;
- the boundary of an MVP.
