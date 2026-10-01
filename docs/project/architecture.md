# Architecture Direction

## Purpose and status

This document records the current implementation architecture direction without turning inception material into a detailed technical design.

- **Established direction** — accepted as the basis for implementation discovery.
- **Working decision** — selected provisionally and to be validated through a representative prototype.
- **Open question** — intentionally unresolved.

## Architectural goals

**Established direction**

The architecture should:

- use the modern web platform as the primary rendering and interaction surface;
- provide controlled access to local operating-system capabilities;
- keep the token and project domain independent of Electron and any UI framework;
- allow the same engine and application operations to serve desktop, CLI, web, MCP, tests, and future automation surfaces;
- make deterministic domain behavior easy to test without launching a browser, Electron, a filesystem, or a network service;
- support a conventional download, install, run, and update experience;
- remain understandable and avoid infrastructure that has not been earned by a concrete requirement.

## Initial web host and desktop host

**Working decision**

Implement the first complete vertical slice as a desktop-oriented, offline-capable browser application installable as a Progressive Web App. The PWA is an initial delivery surface for validating the product workflow, not a persistence architecture or a separate version of the token engine.

The browser application should use HTML, CSS, JavaScript or TypeScript, and standard Web APIs. Its manifest, service worker, offline asset cache, browser persistence, and user-mediated file access belong to delivery or infrastructure adapters. They must not define the canonical model, leak into the domain engine, or become prerequisites for application operations that do not inherently require them.

```text
PWA renderer
    desktop-oriented web interface
                 │
                 ▼
Application operations
    project workflows and coordination
                 │
                 ▼
Domain engine
    token meaning, aliases, validation, transformations
                 ▲
                 │ ports
Browser adapters
    project storage, backup/restore, file selection, import/export
```

Browser-managed project storage must remain replaceable. The first browser experience should provide explicit project backup and restore so locally authored work is not available only through one browser origin. Project backup is distinct from exporting a token compatibility profile. The exact browser persistence technology, canonical persistence format, project backup representation, and token interchange profile remain open.

Electron remains the intended packaged desktop host. Validate it as the milestone immediately following the first complete browser vertical slice, before browser-only assumptions spread through the product. This choice is motivated principally by its bundled, versioned Chromium runtime, access to controlled desktop capabilities, and mature distribution path rather than by access to Node.js alone.

The intended desktop application has three execution areas:

```text
Chromium renderer
    HTML, CSS, JavaScript/TypeScript, standard Web APIs
                 │
                 │ typed, validated RPC-style API
                 ▼
Isolated preload bridge
    narrow workbench-specific capabilities over Electron IPC
                 │
                 ▼
Main and background processes
    application use cases, filesystem adapters, watchers,
    controlled subprocesses, dialogs, menus, updates, OS integration
```

The renderer should behave as a web application. It should not import Node.js or Electron APIs directly. Electron-specific code belongs in the desktop host and bridge.

The Electron application should bundle the renderer as local application content rather than treat the deployed PWA as privileged remote content. The reusable basis is the renderer, application operations, contracts, and domain engine; PWA installation and service-worker behavior need not be carried into the desktop host.

The backend side may be written in JavaScript or TypeScript and can use Node.js and Electron capabilities. Long-running, CPU-intensive, crash-prone, or separately isolatable work may later move into Electron utility processes or workers. Process separation is an implementation choice; it does not define the domain boundaries.

## Restrained hexagonal architecture

**Established direction**

Use a pragmatic ports-and-adapters, or hexagonal, architecture. The aim is replaceable boundaries and independent testing, not architectural ceremony.

```text
Delivery surfaces
    PWA · Electron renderer · CLI · MCP · automation
                         │
                         ▼
Application operations
    project workflows · commands · queries · coordination
                         │
                         ▼
Domain engine
    canonical model · references · validation · transformations
                         ▲
                         │ ports
                         │
Infrastructure adapters
    filesystem · Git · processes · persistence · import/export targets
```

Dependencies point toward the application and domain. The domain engine must not depend on Electron, Chromium, Node.js filesystem APIs, a database, an RPC library, or a frontend framework.

Prefer plain data, pure functions, and explicit dependency parameters. Do not introduce a dependency-injection framework, repository abstraction for every entity, generic command bus, internal event bus, background daemon, or microservice unless a demonstrated requirement justifies it.

## Domain engine

**Established direction**

The domain engine owns deterministic design-token meaning and rules, including:

- canonical token, reference, theme, and package concepts;
- value-type, semantic-role, and composition distinctions;
- primitive, semantic, and component-token layers;
- reference resolution and cycle detection;
- validation and diagnostics;
- transformations and semantic change analysis.

It also owns deterministic scale-generation calculations that return candidate token values. Domain behavior does not have to correspond to a persisted canonical entity: scale recipes are helper inputs, not live relationships among the resulting tokens. See [scale generation](../design-tokens/conceptual-model.md#scale-generation).

Its public operations should accept and return serializable domain data. Representative operations include:

```text
validateTokenPackage
resolveTokenGraph
renameToken
analyzeReferences
transformPackage
comparePackageVersions
```

The domain engine does not open files, display dialogs, start processes, or know which surface invoked it.

## Application operations

**Established direction**

The application layer coordinates domain operations with external capabilities. Its API should express meaningful workbench use cases rather than expose low-level Electron or filesystem primitives.

Representative operations include:

```text
createProject
openProject
importIntoProject
createToken
renameToken
validateProject
saveProject
exportProject
watchProject
```

Operations should usually be coarse enough to avoid a chatty RPC boundary. Fast, temporary interface state may remain in the renderer; operations that enforce domain invariants, mutate canonical project data, persist changes, or create target artifacts belong behind the application boundary.

For scale helpers, the UI collects parameters and presents candidates; the domain calculates them; an application operation coordinates creation of the selected tokens through normal domain validation. Later helper changes do not mutate existing tokens automatically.

## Expression preview boundary

**Working direction — 1 October 2026**

Keep expression/reference semantics in the domain and browser rendering in an outer preview adapter. The domain validates supported expressions and prepares dependencies without relying on DOM or browser measurements. A preview adapter translates supported values into an appropriate specimen, renders under an explicit context, and returns observations and diagnostics. The application layer coordinates the request; no delivery surface should duplicate reference resolution.

Preview context and observed measurements are distinct from authored canonical values. A controlled preview document is a candidate for viewport-dependent specimens; its implementation is not selected. Changing a specimen's width must not be assumed to change viewport-relative units.

Test domain semantics with ordinary unit tests. Browser preview behavior needs separate adapter/integration tests against a declared browser capability baseline. Preview success, canonical validity, and export compatibility are separate outcomes.

## Project boundary

**Established direction**

A project is the primary user working context. Users create, open, or import a project before creating and editing tokens. Every token belongs to a token package, and every token package belongs to a project.

Application requests should identify a project and, where necessary, a package. They should not grant the renderer arbitrary filesystem access. The desktop host resolves a project identity to an authorized local workspace and validates all project-relative paths.

```text
surface request: project identity + domain intent
                         │
                         ▼
application resolves authorized workspace and package
                         │
                         ▼
domain operation + storage adapter
```

The initial product may support one primary token package per project while preserving a model that can later support multiple packages and dependencies.

## Typed bridge and contracts

**Established direction**

Electron IPC is the transport; the product should expose a typed, validated RPC-style API through an isolated preload bridge.

The bridge should:

- expose named workbench operations rather than raw `ipcRenderer` or generic message channels;
- share compile-time request, response, error, and event types;
- validate all untrusted inputs at the privileged boundary at runtime;
- use structured, serializable data;
- support backend-to-frontend events for file changes, progress, and lifecycle notifications;
- provide cancellation for operations where it is materially useful;
- validate the sender and restrict navigation and new-window creation.

Dangerous general capabilities such as `readAnyPath` or `executeArbitraryCommand` should not be exposed. File operations should be project-scoped. External tools should be invoked through explicit operations, structured arguments, and deliberate trust rules rather than shell command strings.

## Multiple delivery surfaces

**Established direction**

Surfaces are thin adapters over the same application operations:

| Surface | Translation responsibility |
|---|---|
| Electron | Preload/API calls and desktop events over IPC |
| PWA | In-browser calls plus browser storage, file-selection, offline, and installation adapters |
| CLI | Arguments, standard input/output, and exit codes |
| MCP | Tool schemas, calls, and structured tool results |
| Tests | Direct calls with fixtures and in-memory adapters |

No surface should reimplement token semantics. A pure portion of the engine may run directly in a browser or Web Worker. Workflows requiring unrestricted local files, watchers, Git, or subprocesses need an appropriate host adapter or service.

## Testing strategy

**Established direction**

Testing should follow the boundaries:

```text
Domain engine
    fast tests with plain values and no mocks where practical

Application operations
    tests with in-memory or focused fake ports

Infrastructure adapters
    contract and integration tests against real external behavior

Electron bridge
    API-contract, runtime-validation, and security-boundary tests

Desktop application
    a focused set of Chromium and end-to-end workflow tests
```

The core acceptance test for separation is that domain behavior can be exercised without Electron, a visible UI, the real filesystem, or a network connection.

## Packaging and distribution

**Working decision**

The first host should support browser installation as a PWA and offline use for the selected vertical slice. Exact browser support, hosting, update, and cache policies remain open.

For the subsequent desktop host, use the standard Electron distribution model: bundle the web application, Electron, Chromium, Node.js, and desktop code into platform applications and installers. Electron Forge is the leading packaging tool to validate for that milestone.

A production distribution will require platform-specific packaging, code signing, macOS notarization, release hosting, and update policy. End users should not need to install Node.js, Chromium, package managers, or developer tooling.

## Security baseline

**Established direction**

The desktop renderer should use Electron's secure defaults deliberately:

- Node integration disabled in renderers;
- context isolation enabled;
- renderer sandboxing enabled;
- restrictive Content Security Policy;
- packaged local application content rather than privileged remote content;
- navigation and new-window creation restricted;
- a narrow preload API;
- validation and authorization of every privileged request;
- current Electron releases maintained as a security dependency.

Future community or marketplace content must be treated as untrusted data. It must not gain access to the privileged workbench bridge merely because it can be displayed by the product.

## Possible source organization

**Working hypothesis**

Package boundaries should follow actual reuse. A possible evolution is:

```text
packages/
├── token-engine/
├── workbench-application/
├── workbench-contracts/
└── node-adapters/

apps/
├── desktop/
├── cli/
├── mcp/
└── web/
```

Only packages and applications required by current work should be created. The PWA is the first committed implementation host; Electron is the immediately following host-validation milestone. CLI and MCP remain architectural consumers rather than initial implementation commitments.

## Initial development tooling

**Working decision — 1 October 2026**

Start domain implementation in TypeScript with strict type checking, Vite for build tooling, Vitest for unit tests, and npm for dependency management. The initial scaffold is a single private package with `src/` and `test/` directories. No frontend framework, styling library, runtime-schema library, persistence adapter, or domain schema is selected by this scaffold.

Type checking runs separately through `tsc --noEmit`; Vite's TypeScript transformation does not replace it. Domain tests run in Vitest's Node environment while domain behavior remains independent of Node APIs, Electron, the browser, storage, and the network. See the repository [README](../../README.md) for executable commands and the limitations while the source directories are empty.

## Remaining open choices

This direction does not yet select:

- a frontend framework or component library;
- canonical persistence format or database;
- any future monorepo topology or package split beyond the initial single-package scaffold;
- exact RPC contract library or runtime-schema library;
- browser persistence, backup, and file-access adapters;
- supported browsers and PWA hosting or update policy;
- project manifest and on-disk layout;
- plugin sandbox or extension system;
- update provider or release infrastructure;
- the first CLI or MCP workflows.

The first PWA vertical slice should validate project lifecycle operations, one primary package per project, token grouping and authoring, aliases, validation, resolved-value inspection, and explicit import and export. Its exact user, minimal canonical schema, theme behavior, persistence representation, and first compatibility profile must be decided before implementation.

The immediately following Electron prototype should reuse that renderer and application behavior while replacing browser infrastructure with a typed preload boundary and desktop adapters. It should open or create a workspace-backed project, watch project files, validate the same token graph, export the selected target, and produce an installable artifact for at least one intended platform.
