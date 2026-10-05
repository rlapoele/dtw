# Product and Modeling Principles

These principles guide discovery and future implementation. They are intentionally more durable than feature ideas.

## 1. Preserve meaning upstream

**Established principle**

The workbench owns a tool-independent account of what a token means. External formats are sources and targets; they do not define the ontology by default.

## 2. Separate type, role, and composition

**Established principle**

Keep three questions distinct:

1. **Value type:** What data does this token contain?
2. **Semantic role:** What purpose does it serve in a design system?
3. **Composition:** Is it an atomic value or a structured treatment assembled from other values?

For example, spacing and opacity may both use numeric storage while carrying different roles. A gradient is not a larger kind of color; it is a composed paint that contains color stops and spatial information.

## 3. Make layered intent visible

**Established principle**

Support primitive, semantic, and component layers without forcing every system to use all three. Aliases should express intentional relationships, and tooling should reveal both references and resolved values.

## 4. Treat interoperability as translation

**Established principle**

Imports normalize source concepts into the canonical model. Exports adapt the canonical model to each target. Translation may be partial, so every adapter must report assumptions, transformations, and loss.

A standards profile, a vendor-native profile, and a processor profile are different targets even when they share syntax. Do not route Figma- or Penpot-shaped data through a permissive “DTCG” path that weakens strict validation, and do not treat successful Style Dictionary processing as proof of DTCG conformance.

## 5. Use DTCG as an interoperability foundation

**Established direction**

Align with DTCG concepts and syntax wherever useful for exchange. Do not assume that DTCG must also be the internal persistence format. Standard interchange and canonical storage are separate decisions.

Use the stable DTCG `2025.10` reports as the current strict interchange baseline. Treat adoption of a superseding version as an explicit compatibility decision.

## 6. Prefer local ownership

**Established direction**

Core authoring should be useful with local files and without a mandatory account. Generated artifacts should be reproducible, and users should be able to retain their data independently of a hosted service.

## 7. Serve design and engineering together

**Established principle**

The model should be understandable visually and structurally. Designers need meaning, relationships, themes, and previews; engineers need deterministic data, validation, diffs, automation, and explicit target behavior. Neither perspective is merely an export of the other.

## 8. Keep authored truth distinct from generated output

**Established principle**

Generated target files must not masquerade as the canonical source. The product should prevent accidental editing loops and make regeneration boundaries obvious.

## 9. Preserve provenance without polluting the core

**Working hypothesis**

Imported target-specific metadata may need to survive for high-quality re-export. Preserve it in namespaced metadata or adapter-owned structures rather than allowing vendor concepts to redefine the shared ontology.

## 10. State uncertainty explicitly

**Established principle**

Documentation and product behavior must distinguish decisions, hypotheses, future possibilities, and unresolved questions. A convenient implementation choice must not silently settle a product question.

## 11. Explain compatibility honestly

**Established principle**

Avoid a single “compatible” badge when the reality is nuanced. Compatibility should identify native mappings, constrained mappings, extensions, flattening, omissions, and round-trip risks.

## 12. Validate before transforming

**Established principle**

Model validity and target compatibility are different checks. Validate canonical semantics first, then validate against a selected destination before export.

## 13. Keep deterministic operations deterministic

**Established principle**

Parsing, reference resolution, validation, and export should be reproducible. AI may explain or suggest, but should not become an invisible requirement for deterministic model operations.

## 14. Design for evolution without premature infrastructure

**Established principle**

The model should be extensible, but the project should not pre-build registries, marketplaces, collaboration systems, or plugin platforms before their needs are understood.

## 15. Make the project the working context

**Established principle**

Users create, open, or import a project before authoring tokens. A project may contain no tokens; every token belongs to exactly one project. Project and token identities should remain stable independently of human-readable names and local directory paths, while persistence details remain replaceable.

## 16. Keep the domain independent of its surfaces

**Established principle**

The token engine and application operations must not depend on Electron, a frontend framework, filesystem APIs, RPC transport, or a visible UI. Electron, CLI, web, MCP, automation, and tests are delivery surfaces over shared use cases rather than separate implementations of token semantics.

## 17. Prefer a functional core and explicit adapters

**Established principle**

Use plain data, pure functions, and explicit dependencies for deterministic domain behavior. Introduce ports at genuine external boundaries such as storage, processes, Git, imports, and exports. Avoid dependency-injection frameworks, generic buses, and abstractions that do not yet serve a concrete variation or test boundary.

## 18. Treat the desktop bridge as a product API

**Established principle**

The Chromium renderer should communicate with privileged Electron code through a narrow, typed, runtime-validated RPC-style API over IPC. Expose meaningful project and domain operations rather than raw Electron objects, arbitrary paths, general message channels, or unrestricted shell commands.

## 19. Use the web platform deliberately

**Working decision**

Begin with a desktop-oriented, offline-capable browser application installable as a Progressive Web App, then validate Electron immediately after the first complete vertical slice. Both hosts should reuse the same renderer, application operations, and domain engine. Browser storage, service workers, Electron IPC, and desktop capabilities remain outside the domain and behind explicit adapters.

Electron remains the intended packaged desktop host because it supplies a known Chromium capability baseline, controlled local capabilities, and a mature distribution path. Its renderer should remain an HTML, CSS, and JavaScript or TypeScript web application using standard Web APIs wherever suitable. Electron-specific capabilities remain outside the renderer and behind adapters.

## 20. Let requirements earn remaining technology choices

**Established principle**

The PWA-first, Electron, and restrained-hexagonal directions do not choose a frontend framework, component library, persistence format, browser store, database, RPC library, plugin system, or build topology. Select those only when validated requirements and representative prototypes justify them.
