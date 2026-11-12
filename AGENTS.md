# AGENTS.md

## Project state

This repository contains product and domain documentation for the Design Token Workbench, a vendored DTCG `2025.10` reference snapshot, and a TypeScript/Vite/Vitest application with a host-independent domain core and retained React workbench. Increment 007 implementation uses a dedicated browser worker, native IndexedDB/Web Locks, exact project backups and staged restore; Increment 007 was completed on 12 November 2026 following user-reported manual acceptance, with [remaining qualification explicitly deferred](docs/increments/007-local-retention-and-backup.md#deferred-qualification) and no automated qualification restart authorized. Applied state is retained within one normal browser profile/origin; drafts and unfinished forms remain session-only. Chrome is the automated development baseline; the user may manually test Chrome or Firefox, with broader engine qualification deferred until the PWA is fully featured and working. See `README.md` for commands and delivery limitations, and `docs/status/current.md` for the latest reviewed handoff. The accepted scope is a desktop-first, local-first token workbench. `docs/project/design-system-studio-extension.md` is exploratory and must not override the token-workbench documents.

## Read before changing direction

- Start with `docs/project/vision.md`, `product-concept.md`, and `principles.md`.
- Use `docs/project/architecture.md` for implementation boundaries.
- For interface design and prototyping, use `docs/project/visual-direction.md` and its accepted reference image; preserve the distinction between visual guidance and unresolved interaction or feature decisions.
- Before presentation changes, read [presentation conventions](docs/project/presentation-conventions.md) for agreed Tailwind, Heroicons and shadcn/Base UI rules, review checks and CSS exceptions.
- Use `docs/design-tokens/` for domain language and modeling constraints.
- Read `docs/design-tokens/interoperability.md` before changing import, export, compatibility, or external-tool behavior.
- Check `docs/planning/open-questions.md` before making a product, schema, persistence, or technology choice.
- When resuming substantial work or beginning a new phase, read `docs/status/current.md` for the latest handoff state.
- For normative DTCG details, start with `docs/references/dtcg-2025.10/README.md` and prefer its linked official reports where report-level conformance context matters.

Treat status labels as meaningful: **established** directions and principles are constraints; working decisions and hypotheses require validation; future possibilities are not commitments; open questions must not be settled implicitly for implementation convenience. If a task requires an unresolved decision, make it explicit and update the affected documents consistently.

## Increment collaboration

- For substantial feature increments, explicitly delegate to separate analyst, developer, and reviewer subagents following [the workflow and role briefs](docs/workflow/agent-roles.md). The main chat coordinates user questions and handoffs. Small fixes and editorial changes do not require this workflow.
- Add a separate designer subagent for substantial interaction or interface decisions, or explicitly requested design exploration. Surface wireframes, mockups, or prototypes to the user and iterate before sending the identified proposal to the analyst for review. Material design revisions return to the user before renewed analyst review. Approval for analyst review is distinct from final contract/design agreement and implementation authorization.
- Use [increment contracts and completion reports](docs/increments/README.md). Start implementation only after the user agrees the contract and authorizes implementation; drafts and templates are not approval.
- Start developer and reviewer agents with fresh conversation contexts and explicit references to the authoritative documents and agreed design artifacts where applicable. Give the reviewer an identified stable snapshot; do not seed its initial brief with the developer's rationale or conclusions.
- Use one code-writing agent at a time. Resolve findings with evidence and recheck affected behavior. Surface material ambiguities or scope changes; continue routine work within agreed scope without repeated approval.
- If subagents are unavailable, state that limitation rather than implying an independent review occurred. Role instructions do not create separate permission boundaries.
- Setting up or editing the workflow does not authorize opening or implementing the next application increment.
- Apply the [proportionate verification and stopping rules](docs/workflow/agent-roles.md#proportionate-verification) across all agents and handoffs. Carry consumed effort and stopping decisions forward; workflow upgrades grant no new verification allowance and do not remove agreed acceptance gates.
- Leave staging, committing and pushing to the user. Preserve existing staged work and include a focused suggested commit message in the handoff.

## Product and model invariants

- Keep the canonical model tool-independent and upstream of Figma, Penpot, DTCG, code formats, and other consumers.
- A project is the working context and directly owns zero or more tokens. Every token belongs to exactly one project. Project identity is distinct from its workspace path.
- Tokens and namespace groups have stable, non-semantic identities. Token paths are derived from single-parent namespace-group containment plus local names; non-structural sets or tags do not determine paths.
- Every token carries its explicit value type. Namespace groups do not define token types; DTCG group-level `$type` inheritance is normalized at the adapter boundary.
- Keep value type, semantic role, and composition separate. Preserve primitive, semantic, and component-token layers without requiring every system to use all three.
- Preserve authored aliases and resolve them deterministically; detect missing references and cycles.
- Do not conflate color alpha with layer opacity, or gradients with colors.
- Treat stable DTCG `2025.10` as the current strict interchange baseline, not as the chosen canonical persistence format.
- Keep strict `dtcg-2025.10`, `figma-native`, `penpot-native`, and versioned Style Dictionary processor profiles distinct. Successful import or processing does not by itself establish document conformance or round-trip fidelity.
- Treat Style Dictionary `5.5.5` as a researched, partial DTCG processor and possible generated-artifact adapter, not as a committed dependency, strict validator, canonical model, or implicit migration authority.
- Model import as staged normalization with visible ambiguity and provenance. Model export as deterministic adaptation with explicit compatibility diagnostics.
- Keep authored canonical data distinct from generated target artifacts.
- Do not silently invent semantics. AI may explain or propose reviewed changes, but deterministic model operations must remain deterministic.

## Architecture guardrails

- Use restrained hexagonal architecture: delivery surfaces → application operations → domain engine, with explicit ports to infrastructure adapters.
- Keep the domain engine independent of Electron, UI frameworks, filesystems, databases, RPC transports, and networks. Prefer serializable plain data, pure functions, and explicit dependencies.
- Put project workflows and coordination in coarse application operations. Delivery surfaces must not reimplement token semantics.
- Treat Electron as a host. Renderer code must not access Node.js or Electron directly; privileged capabilities belong behind a narrow, typed, runtime-validated, project-scoped preload API.
- Add abstractions only for demonstrated variation or test boundaries. Do not pre-build plugin systems, registries, marketplaces, generic buses, or unneeded services.
- Do not select an unresolved framework, persistence format, database, schema library, or build topology unless the task explicitly includes that decision and evidence for it.

## Presentation conventions

- Preserve the accepted neutral, content-first Precision design and shadcn-style semantic theming. Keep one token source; map referenced semantic CSS variables through Tailwind's `@theme inline` namespaces.
- Prefer standard or existing project-defined Tailwind utilities in JSX. Avoid arbitrary values and direct CSS-variable expressions when named utilities suffice. Add tokens only for meaningful reusable decisions; document necessary CSS/runtime-style exceptions.
- Use Heroicons Outline as the sole application UI icon family, including inside copied/generated components. Preserve accessible control names and hide decorative icons from assistive technology.
- Reuse owned components before adding another implementation. Add shadcn/Base UI primitives only for real slice needs, style them for the product, and retain native controls when custom behavior adds no value. Preserve keyboard, focus, labels, errors and component APIs.
- `cn` may compose conditional classes and resolve Tailwind conflicts through one shared project entry point when needed. Preserve Base UI callback `className` behavior and existing component precedence contracts. Permission to use `cn` does not itself migrate dependencies or change those contracts.
- Review affected code for duplicated primitives, avoidable custom values, foreign icon families and unnecessary dependencies; verify affected responsive, keyboard/focus and class-composition behavior. Use the linked conventions for details rather than imposing blanket bans on brackets or runtime styles.

## Documentation and verification

- Reuse the terminology in `docs/design-tokens/glossary.md`; update the glossary when introducing a durable term.
- Preserve confidence labels and distinguish current direction from proposals, examples, and future scope.
- When changing a concept, check vision, product concept, principles, model, taxonomy, interoperability, glossary, architecture, and open questions for contradictions; edit only the affected files.
- Treat `docs/references/dtcg-2025.10/` as vendored reference material. Do not edit it as project documentation; replace it only through an intentional version/provenance update that preserves its license.
- Date and version claims about external tools, and re-verify them before turning research findings into adapter behavior.
- Update `docs/status/current.md` after a material milestone, research conclusion, decision, or handoff. Follow `docs/status/README.md`; status files summarize authoritative documents and must not become a second source of truth.
- Whenever work crystallizes a decision or direction in the repository documentation, include a suggested short commit message in the final handoff.
- Keep Markdown direct and semantic. Use small diagrams or examples only when they clarify a relationship.
- Review changed Markdown, links, terminology, and status claims manually. The scaffold provides `npm run typecheck` and `npm test` for the current domain core; see `README.md` for command scope and build limitations. Keep commands documented and test domain behavior independently from Electron, the visible UI, the real filesystem, and the network.
