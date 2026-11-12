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

Browser-managed project storage must remain replaceable. The first browser experience should provide explicit project backup and restore so locally authored work is not available only through one browser origin. Project backup is distinct from exporting a token compatibility profile. Increment 007 selects IndexedDB and the bounded versioned backup/retained representations below. A broader desktop workspace persistence layout and token interchange profile remain open.

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

**Current implementation ownership — 12 November 2026:** `app/App.tsx` owns the
catalogue and host lifetime; `app/Workbench.tsx` coordinates the open project. Their
component names are `App` and `Workbench`. The transitional `Retained` prefix was
removed after retiring the earlier session-only implementation; historical snapshots
and evidence retain their original filenames. `src/application/retention/` owns host-independent retention,
codec, candidate and projection operations; `src/adapters/browser/` owns native storage
adapters. `src/presentation/host/` owns the module-worker delivery entry, typed protocol
and renderer client. `tsconfig.worker.json` checks the WebWorker scope separately.
Draft and form state remains renderer-local; applied snapshots are retained per browser
profile/origin. Functional implementation is under final qualification; see the
[agreed contract](../increments/007-local-retention-and-backup.md) and
[current status](../status/current.md) for evidence and remaining gates. Chrome is the
current automated baseline; broader engine qualification follows the user-approved
browser policy. Earlier dated descriptions below describe their original increments.

**Source naming — 8 November 2026:** `src/presentation/` contains the React UI, styles, editor drafts and disposable browser previews; `src/application/` contains host-independent use-case coordination. The user approved renaming the former `delivery` folder to `presentation` for clarity, with the same dependency boundaries. Matching tests and UI type configuration use `test/presentation/` and `tsconfig.presentation.json`. The broader term “delivery surface” below also covers possible non-UI entry points such as CLI or MCP; those need not live under `presentation`. Source/test imports use `@domain`, `@application`, `@adapters`, `@presentation` and `@tests` mappings; these improve path clarity without permitting new dependencies between layers. TypeScript paths and shared Vite/Vitest aliases resolve the same folders. Build configuration is checked separately in `tsconfig.tools.json` with development-only Node types; domain/application checks and browser code retain their own host scopes.

**Presentation ownership — Increment 004, 8 November 2026:** App retains application-operation coordination, draft/departure state, readback and focus policy. ProjectNavigation, TokenList and CreationDialog render their existing responsibilities; generic controls and dialog shells are locally owned under `src/presentation/components/ui/`, while workbench-specific components, tabs and swatches live under `src/presentation/features/workbench/components/`. Ordinary presentation uses Tailwind utilities and semantic palette roles. The stylesheet owns only the retained dense typography foundation, explicit responsive panel/precision geometry, modal/drawer effects, native slider pseudo-elements and illustrative checkerboards. These presentation components do not parse authored strings or reimplement token semantics.

**Presentation organization — 10 November 2026:** `app/App.tsx` retains composition and coordination; `features/workbench/` groups workbench components, renderer-only draft state (`state/session.ts`), color presentation (`color/`) and `readback.ts`. `styles/global.css` remains the single semantic style source. The entry point and local TypeScript configuration remain at the presentation root. This path-only maintenance preserves existing behavior and component contracts. Historical prototypes and evidence retain their original source references and replay at their recorded commit rather than through compatibility wrappers.

**Component interpretation — Increment 005, 8 November 2026:** `src/domain/color-components.ts` defines the five spaces' closed semantic component identities/order and small readable name/unit metadata. Constructor validation and color calculations consume that order; Culori channel keys, modes and HSL scaling remain in the calculation integration boundary. `authored-color.ts` derives exact named text and `AuthoredValue` shares it between token rows and the applied inspector without changing canonical tuples or raw JSON. CreationDialog renders the token-only description textarea; App passes nonempty text unchanged through the existing operation and preserves it with failed form state. No model shape or numerical policy changed.

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

- canonical project, namespace-group, token, reference, and theme concepts;
- value-type, semantic-role, and composition distinctions;
- primitive, semantic, and component-token layers;
- reference resolution and cycle detection;
- validation and diagnostics;
- transformations and semantic change analysis.

It also owns deterministic scale-generation calculations that return candidate token values. Domain behavior does not have to correspond to a persisted canonical entity: scale recipes are helper inputs, not live relationships among the resulting tokens. See [scale generation](../design-tokens/conceptual-model.md#scale-generation).

Deterministic color conversions and manipulation calculations likewise belong in the domain engine and must be testable without browser color parsing or rendering. Operations use explicit spaces/models and policies; their supported subset, algorithms, and library choices remain open. Color pickers are delivery controls, while target color syntax and compatibility handling belong to adapters. Application operations coordinate accepted edits or candidate creation. See [color manipulation](../design-tokens/conceptual-model.md#color-manipulation).

Its public operations should accept and return serializable domain data. Representative operations include:

```text
validateProjectTokens
resolveTokenGraph
renameToken
analyzeReferences
moveTokenGroup
compareTokenGraphs
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

### Current Increment 007 implementation scope — 10 November 2026

**Implementation authorized.** The [agreed contract](../increments/007-local-retention-and-backup.md)
and [B-3/B-4 amendment](../increments/007-production-scheduling-and-browser-scope-proposal.md#current-b-3b-4-amendment--10-november-2026)
authorize production development with Chrome automated tests and user manual
Chrome/Firefox testing. Additional engines, including Safari supervision/storage
qualification, follow the fully featured working PWA and do not block this increment.
Remaining applicable Chrome mechanism/native/HTTPS/performance evidence is required
at completion/support, rather than before implementation. Existing worker, authority,
exactness, resource and recovery boundaries below remain binding; historical pending
implementation statements are superseded by this authorization, not by passing results.
No install/offline or Electron implementation is added.

### Increment 007 storage direction

**Agreed 9 November 2026; not implemented or technically qualified.**

Use native IndexedDB for browser retention behind a small adapter, with strict-hint
transaction-complete acknowledgement, Web Locks for project editing ownership and
atomic expected-revision checks. Keep live-session outcome reconciliation bounded;
no durable intent journal is selected. Retain ordinary background ownership.
A later Electron filesystem adapter shares canonical representation/validation and
application contracts; it does not reuse browser storage APIs. Version concepts for
storage layout, authored envelope and portable backup remain distinct. F-1–F-5 codec/parser/resource policy is now agreed below; exact supported browser
builds and technical qualification remain pending. The [agreed direction](../increments/007-storage-acknowledgement-and-concurrency-proposal.md)
owns details and unselected alternatives. This agreement does not authorize implementation.

**Format/resource agreement — 9 November 2026:** F-1–F-5 select a versioned
UTF-8 JSON portable backup and separate retained-record wrapper, strict duplicate-
aware boundary decoding using jsonc-parser 3.3.1, explicit admission ceilings and
bounded derived work that preserves authored source. The
[agreed format/resource policy](../increments/007-format-decoder-and-resource-proposal.md)
owns exact representation and limits. Isolated Stage A and the agreed bounded worker
qualification followup below are authorized; production code/dependencies remain unchanged.
This bounded envelope does not settle a future multi-file desktop workspace layout.

### Increment 007 read and write boundary direction

**Agreed design/architecture direction — 9 November 2026; not implemented.**

For [Increment 007 preparation](../increments/007-local-retention-and-backup.md),
separate read and write application interfaces over one authoritative retained
project state. Read operations expose listing, authored data, inspection and
diagnostics without project mutation capability. Commands may read to validate;
they own candidate validation, concurrency checks, atomic acceptance and required
retention acknowledgement. Inspect coherent loaded snapshots rather than routing
render-time inspection through repeated asynchronous storage reads. Keep drafts
separate and publish the next applied snapshot after successful acceptance.

A durable write followed by failed readback is not a failed write: retain that
distinction in results and recovery feedback. Exact adapter/async contracts and
cross-tab enforcement require investigation before implementation agreement.
This direction does not select a storage technology, persistence schema, separate
databases, event sourcing, generic command/query dispatchers or independently
synchronized read models.

Keep accepted before/after state available at the explicit atomic write boundary
to support future undo/redo. No history representation, recording, lifetime,
inverse-command mechanism or undo UI is part of Increment 007. This is bounded
evolution of the existing application layer, not a history framework.

**Browser execution placement agreed — 9 November 2026:** B-1–B-5 select one dedicated
module worker per tab for coarse application reads/commands, codec/validation/derived
work and native IndexedDB/Web Locks adapters. The renderer owns presentation and
session-only raw inputs/attempt correlation, receiving bounded detached revisioned
results. Worker APIs stay outside the host-independent application/domain core;
there is one authoritative retained database and no generic RPC framework or worker
pool. Worker availability is a required browser capability; failure handling preserves
unknown-versus-rejected-versus-retained outcomes without synchronous fallback or replay.
The [agreed placement and qualification gates](../increments/007-production-scheduling-and-browser-scope-proposal.md)
own details, catalogue strategy and exact-build normal-profile Chrome/Safari targets.
This broader placement is not qualified by the earlier codec-worker experiment.
The user authorized its bounded isolated developer followup and independent review,
not production implementation or final contract/design agreement.
The [reviewed worker followup](../../output/increment-007-worker-qualification/independent-review.md)
records partial native mechanism evidence and corrected harness findings. Its
renderer responsiveness failure and remaining watchdog/HTTPS/host gaps prevent
a blanket qualification claim; no new rendering approach is selected implicitly.

### First application-operation increment

**Agreed enabling scope — 3 November 2026**

[Increment 001](../increments/001-in-memory-authoring-workflow.md) proves project/group creation, unconditional color literal and semantic-alias authoring, group renaming, validation, and authored/resolved inspection through shared operations. Use caller-supplied opaque identities and a narrow project-scoped storage port with an in-memory adapter. Operational snapshots hold project metadata and separate group/token collections; they are coordination data, not a canonical persistence schema or a larger Project aggregate. Calls are sequential with one writer; failed commands and storage commits leave stored state unchanged.

Normal authoring checks same-project structural and reference relationships before commit. Reads preserve repairable authored data and domain diagnostics. Sibling-name collision enforcement is explicitly deferred, so structural validation does not guarantee unambiguous paths. This is an enabling increment without a UI or durable storage; it does not complete the PWA slice or select its deferred technologies and interchange profile.

### Color value revision increment

**Agreed enabling scope — 3 November 2026**

[Increment 002](../increments/002-color-value-revision.md) extends the same in-memory operations with explicit revision of an existing color token's sole unconditional assignment. Supplied literals and whole-value references may replace one another deliberately; token identity, namespace placement, type, metadata, and regeneration policy remain unchanged. Regeneration protection does not block explicit manual editing. Dependent aliases resolve from current authored data, without persisted resolved values or implicit flattening.

Validate the complete candidate namespace and reference graph before one atomic commit. Reject cycles and invalid targets; a repair is accepted only if no namespace/reference diagnostics remain, so unrelated errors still block it. This scope excludes UI, incomplete-token completion, conditional editing, progressive repair, durable storage, and further host/adapter choices.

## Expression preview boundary

**Working decision — 6 October 2026**

Keep expression/reference semantics in the domain and browser rendering in an outer preview adapter. The domain validates the closed typed expression AST, derives result types, extracts token and context dependencies, and evaluates supported operations from explicit serializable inputs without relying on DOM or browser measurements. A preview adapter gathers permitted environmental facts, translates supported values into an appropriate specimen, renders under an explicit context, and returns observations and diagnostics. The application layer coordinates the request; no delivery surface should duplicate reference resolution or operation semantics.

Preview context and observed measurements are distinct from authored canonical values. A controlled preview document is a candidate for viewport-dependent specimens; its implementation is not selected. Changing a specimen's width must not be assumed to change viewport-relative units.

Test domain semantics with ordinary unit tests. Browser preview behavior needs separate adapter/integration tests against a declared browser capability baseline. Preview success, canonical validity, and export compatibility are separate outcomes.

## Project boundary

**Established direction**

A project is the primary user working context. Users create, open, or import a project before creating and editing tokens. A project may contain no tokens, and every token belongs to exactly one project.

Application requests should identify a project. They should not grant the renderer arbitrary filesystem access. The desktop host resolves a project identity to an authorized local workspace and validates all project-relative paths.

```text
surface request: project identity + domain intent
                         │
                         ▼
application resolves authorized workspace and project data
                         │
                         ▼
domain operation + storage adapter
```

Namespace groups and tokens remain project-scoped domain data. A future reusable or distributable package boundary may be added for demonstrated workflows, but it is not required by the initial ownership model.

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

| Surface  | Translation responsibility                                                                |
| -------- | ----------------------------------------------------------------------------------------- |
| Electron | Preload/API calls and desktop events over IPC                                             |
| PWA      | In-browser calls plus browser storage, file-selection, offline, and installation adapters |
| CLI      | Arguments, standard input/output, and exit codes                                          |
| MCP      | Tool schemas, calls, and structured tool results                                          |
| Tests    | Direct calls with fixtures and in-memory adapters                                         |

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

Start domain implementation in TypeScript with strict type checking, Vite for build tooling, Vitest for unit tests, and npm for dependency management. The initial scaffold is a single private package with `src/` and `test/` directories. That original scaffold did not select a frontend framework, styling library, runtime-schema library, persistence adapter or domain schema. The later Increment 003 renderer selection below narrows delivery tooling only.

Type checking runs separately through `tsc --noEmit`; Vite's TypeScript transformation does not replace it. Domain tests run in Vitest's Node environment while domain behavior remains independent of Node APIs, Electron, the browser, storage, and the network. See the repository [README](../../README.md) for executable commands. Increment 003 now provides the session-only browser entry; host-independent checks remain separate from browser/TSX checks.

## Standing presentation conventions

**Agreed 9 November 2026:** [Presentation conventions](presentation-conventions.md) own Tailwind semantic-token mappings, utility-first styling and exceptions, Heroicons Outline, selective shadcn/Base UI reuse, optional `cn` composition and affected review checks. They preserve the existing presentation boundaries and accepted design. Allowing `cn` does not install it, change current component precedence or authorize a dependency migration.

## Increment 003 renderer selection

**Agreed delivery direction — 7 November 2026; implemented within Increment 003 on 8 November**

The user selected React with strict TypeScript and Vite, Tailwind v4, locally owned shadcn/ui-style components based on Base UI, the neutral Precision visual direction and Heroicons Outline for the application renderer. This closes the frontend/component direction for the [bounded Increment 003 contract](../increments/003-visible-color-authoring.md); installed direct pins, declared licenses, type/build integration and measured bundle effects are recorded in its [completion report](../increments/003-visible-color-authoring.md#completion-report), with scoped browser/accessibility limits. This renderer decision alone did not select a color-calculation library; the separate 8 November decision below selects Culori.

Keep the existing single package and scope TSX/browser types to delivery code. Domain/application checks remain host-independent. No router, general state-management library, backend or package split is introduced by this choice. The renderer consumes application operations rather than copying prototype namespace/reference semantics. Prototype code and dependency pins are exploratory evidence, not automatically approved for production reuse.

Increment 003 remains session-only and does not complete the PWA. Retention/independent backup, interchange and install/offline acceptance remain later scoped work before the complete browser milestone and immediately following Electron validation. The renderer decision alone did not authorize implementation; the user subsequently authorized Increment 003 implementation on 8 November under its agreed contract.

## Increment 003 color-calculation backend

**Agreed backend direction and simpler numerical contract — 8 November 2026; implemented within Increment 003**

The user selected Culori behind the domain's small pure calculation boundary under the [approved numerical amendment](../increments/003-color-policy-proposal.md#approved-numerical-amendment--8-november-2026). DTW retains exact canonical strings, alpha, identity/passive-view preservation, units, missing/neutral eligibility, deterministic formatting, validation and safe failure handling; Culori supplies approximate conversions. Domain/application code remains independent of renderer, browser, Node, filesystem and host APIs. No registry, package split, custom conversion equations or arbitrary-precision backend is planned.

Culori `4.0.2` is both the independently measured qualification baseline and installed application pin, with `@types/culori` `4.0.1`. Package integrity, declared licenses, selective imports/bundle effects and scoped Node/browser integration are recorded in the [completion report](../increments/003-visible-color-authoring.md#completion-report); this is not a latest-version or universal compatibility claim. The boundary-only numerical contract replaces internal-stage magnitude, underflow and cancellation certification; it does not weaken exact authored-data preservation or authorize hidden gamut mapping/clamping. The known exceptional tiny-red→HSL defect is handled as an unavailable representation with source/drafts intact, not silently corrected or claimed fixed. Future mixing/gradient semantics remain separately scoped.

The direction approval alone did not authorize implementation. After technical preparation, the user explicitly authorized Increment 003 implementation on 8 November, including necessary application, dependency and lockfile changes under the agreed contract. This does not authorize broader host/storage/interchange scope or rewriting historical prototype/research artifacts.

## Remaining open choices

This direction does not yet select:

- future upgrades or broader browser qualification beyond the installed Increment 003 renderer/component pins and scoped evidence;
- canonical persistence format; IndexedDB is the agreed Increment 007 browser database direction, pending qualification;
- any future monorepo topology or package split beyond the initial single-package scaffold;
- exact RPC contract library or runtime-schema library;
- detailed browser persistence implementation, backup and file-access adapters;
- supported browsers and PWA hosting or update policy;
- project manifest and on-disk layout;
- plugin sandbox or extension system;
- update provider or release infrastructure;
- the first CLI or MCP workflows.

The first PWA vertical slice should validate project lifecycle operations, namespace grouping and token authoring, aliases, validation, resolved-value inspection, and explicit import and export. Its exact user, minimal canonical schema, initial variation axes and coverage, persistence representation, and first compatibility profile must be decided before implementation.

The immediately following Electron prototype should reuse that renderer and application behavior while replacing browser infrastructure with a typed preload boundary and desktop adapters. It should open or create a workspace-backed project, watch project files, validate the same token graph, export the selected target, and produce an installable artifact for at least one intended platform.
