# AGENTS.md

## Project state

This repository currently contains inception documentation for the Design Token Workbench plus a vendored DTCG `2025.10` reference snapshot; it has no application code or established build, test, or package toolchain. The accepted scope is a desktop-first, local-first token workbench. `docs/project/design-system-studio-extension.md` is exploratory and must not override the token-workbench documents.

## Read before changing direction

- Start with `docs/project/vision.md`, `product-concept.md`, and `principles.md`.
- Use `docs/project/architecture.md` for implementation boundaries.
- Use `docs/design-tokens/` for domain language and modeling constraints.
- Read `docs/design-tokens/interoperability.md` before changing import, export, compatibility, or external-tool behavior.
- Check `docs/planning/open-questions.md` before making a product, schema, persistence, or technology choice.
- When resuming substantial work or beginning a new phase, read `docs/status/current.md` for the latest handoff state.
- For normative DTCG details, start with `docs/references/dtcg-2025.10/README.md` and prefer its linked official reports where report-level conformance context matters.

Treat status labels as meaningful: **established** directions and principles are constraints; working decisions and hypotheses require validation; future possibilities are not commitments; open questions must not be settled implicitly for implementation convenience. If a task requires an unresolved decision, make it explicit and update the affected documents consistently.

## Product and model invariants

- Keep the canonical model tool-independent and upstream of Figma, Penpot, DTCG, code formats, and other consumers.
- A project is the working context. Every token belongs to a package, and every package belongs to a project. Project identity is distinct from its workspace path.
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

## Documentation and verification

- Reuse the terminology in `docs/design-tokens/glossary.md`; update the glossary when introducing a durable term.
- Preserve confidence labels and distinguish current direction from proposals, examples, and future scope.
- When changing a concept, check vision, product concept, principles, model, taxonomy, interoperability, glossary, architecture, and open questions for contradictions; edit only the affected files.
- Treat `docs/references/dtcg-2025.10/` as vendored reference material. Do not edit it as project documentation; replace it only through an intentional version/provenance update that preserves its license.
- Date and version claims about external tools, and re-verify them before turning research findings into adapter behavior.
- Update `docs/status/current.md` after a material milestone, research conclusion, decision, or handoff. Follow `docs/status/README.md`; status files summarize authoritative documents and must not become a second source of truth.
- Keep Markdown direct and semantic. Use small diagrams or examples only when they clarify a relationship.
- There are currently no automated checks. Review changed Markdown, links, terminology, and status claims manually. If code is introduced, document its real commands and test domain behavior independently from Electron, the visible UI, the real filesystem, and the network.
