# AGENTS.md

## Project state

This repository currently contains inception documentation for the Design Token Workbench; it has no application code or established build, test, or package toolchain. The accepted scope is a desktop-first, local-first token workbench. `docs/project/design-system-studio-extension.md` is exploratory and must not override the token-workbench documents.

## Read before changing direction

- Start with `docs/project/vision.md`, `product-concept.md`, and `principles.md`.
- Use `docs/project/architecture.md` for implementation boundaries.
- Use `docs/design-tokens/` for domain language and modeling constraints.
- Check `docs/planning/open-questions.md` before making a product, schema, persistence, or technology choice.

Treat status labels as meaningful: **established** directions and principles are constraints; working decisions and hypotheses require validation; future possibilities are not commitments; open questions must not be settled implicitly for implementation convenience. If a task requires an unresolved decision, make it explicit and update the affected documents consistently.

## Product and model invariants

- Keep the canonical model tool-independent and upstream of Figma, Penpot, DTCG, code formats, and other consumers.
- A project is the working context. Every token belongs to a package, and every package belongs to a project. Project identity is distinct from its workspace path.
- Keep value type, semantic role, and composition separate. Preserve primitive, semantic, and component-token layers without requiring every system to use all three.
- Preserve authored aliases and resolve them deterministically; detect missing references and cycles.
- Do not conflate color alpha with layer opacity, or gradients with colors.
- Treat DTCG as the leading interoperability foundation, not as the chosen canonical persistence format.
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
- Keep Markdown direct and semantic. Use small diagrams or examples only when they clarify a relationship.
- There are currently no automated checks. Review changed Markdown, links, terminology, and status claims manually. If code is introduced, document its real commands and test domain behavior independently from Electron, the visible UI, the real filesystem, and the network.
