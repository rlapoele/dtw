# Glossary

This glossary defines terms as used in the inception documents. Definitions describe the current shared language; entries marked as hypotheses remain subject to refinement.

## Adapter

A target- or source-specific translator between an external representation and the canonical model. Importers and exporters are adapters.

## Alias

A token value expressed as a reference to another token rather than a duplicated literal. Aliases preserve relationships and are resolved deterministically.

## Authored value

The typed literal, reference, structured expression, or named composite saved by the author before resolution. A token may have multiple authored-value assignments under distinct normalized variation conditions, or none while its definition is incomplete.

## Canonical model

The tool-independent representation treated as authoritative inside a workbench project. It preserves token meaning and relationships without adopting one external tool's ontology. Its persistence format is undecided.

## Application operation

A meaningful workbench use case that coordinates domain behavior and external capabilities, such as creating a project, validating project tokens, importing tokens, or exporting a target artifact. Application operations are shared by delivery surfaces.

## Color

A color value, potentially including alpha. In this project, a color is distinct from a gradient and from layer opacity.

## Color alpha

Transparency encoded as part of a color value. It is not equivalent to applying opacity to an entire element or composited result.

## Color fallback

An explicit alternative color for a target that cannot represent the primary color as intended. It may be an approximation rather than an equivalent representation. Its canonical storage, authoring, and generation policy remain unresolved; a fallback must not silently replace the authored primary value.

## Color gamut

The range of colors a target color space or device can represent. Converting to a smaller gamut may require an explicit approximation policy.

## Color representation

A way of expressing or displaying a color using a color space/model and a notation. Alternative representations are derived, not independently authoritative token values. HEX is an sRGB notation, not a color space; choosing a display representation does not itself mutate the authored token.

## Color space/model

The explicit coordinate system and color interpretation for a literal's components, such as sRGB, HSL, or OKLCH. RGB alone does not identify a particular space. The authored space/model is preserved; the exact canonical schema and supported set remain open.

## Conditional token value

An authored value associated with a condition that matches a partial variation selection. The most specific matching value is selected deterministically; equally specific conflicting matches are ambiguities rather than declaration-order overrides.

## Compatibility profile

A versioned contract describing the accepted file shape, supported concepts, constraints, extensions, transformations, diagnostics, and expected round-trip behavior of an import, processor, or export target. Strict DTCG, Figma native, Penpot native, and Style Dictionary processor behavior are separate profile families.

## Component token

A token that expresses a stable design decision for a reusable component or pattern, commonly by referencing a semantic token.

## Component definition

A project-owned aggregate root giving stable identity and authoring context to a reusable component or pattern. It owns a Component contract but not embedded copies of its component Tokens. A component-layer Token is associated with exactly one Component definition in the same project.

## Component contract

The structure owned by a Component definition that conceptually accommodates parts, slots, properties, variant axes, interactive states, and component-token bindings. These concepts form a deliberate future extension boundary; their detailed schemas are not yet defined.

## Component-token binding

A relationship in a Component contract describing how an owned component Token is used by a component part, property, variant selection, interactive state, or combination of those concepts. Binding is distinct from ownership: the Token's `componentDefinitionId` identifies its owning component.

## Composite

A named, validated value schema assembled from multiple typed constituent fields. The initial canonical composites are typography, shadow, gradient, border, and transition; a composite is not an arbitrary object.

## Definition completeness

A derived assessment of whether a token contains the type and authored assignments required for an operation. A name-only token is a valid project member with an incomplete definition; incompleteness is not represented by an `EmptyValue` or a stored lifecycle status.

## Decimal

An exact finite base-10 numeric value object canonically serialized through validated normalized decimal text rather than an authoritative binary floating-point value. It is reused by numeric literals such as numbers, dimensions, durations, angles, percentages, and cubic-Bézier coordinates. Calculation and formatting precision are separate policies.

## DTCG

The W3C Design Tokens Community Group and, contextually, its design-token format work. The stable `2025.10` Format, Color, and Resolver reports are the project's current strict interchange baseline. DTCG is not yet the chosen canonical persistence format.

## Document conformance

Whether a file follows a named specification profile's syntax, type names, value shapes, and structural rules. Document conformance is distinct from the concepts a particular tool supports and from round-trip fidelity.

## Delivery surface

A way of invoking application operations, such as the Electron application, a CLI, a web interface, an MCP server, automation, or tests. A surface should not reimplement token semantics.

## Domain engine

The UI- and infrastructure-independent TypeScript implementation of the canonical token model, reference resolution, validation, transformations, and other deterministic domain rules.

## Electron

The intended packaged desktop host, to be validated immediately after the first complete PWA vertical slice. Electron supplies a bundled Chromium renderer, Node.js-capable privileged processes, desktop integration, and distribution tooling. It is an outer delivery mechanism rather than part of the canonical token model.

## Export

The deterministic adaptation of canonical data into a target representation, accompanied by compatibility diagnostics.

## Expression

A typed structured calculation or function-based authored value that may contain token references. Portable canonical operations remain distinguishable from explicit target-specific operations. Its exact abstract syntax tree, operation set, and evaluation policies remain open; an expression is not itself a token value type.

## Gradient

A composed visual treatment containing multiple color stops, positions, and geometry. A gradient is not a color.

## Group

A project-owned namespace node with a stable identity, local name, and at most one parent group. Groups and tokens form an acyclic hierarchy from which human-readable token paths are derived. Non-structural sets, collections, or tags do not determine paths.

## Import

The staged process of parsing external data, retaining provenance, inferring possible canonical concepts, surfacing ambiguity or loss, and accepting reviewed normalization.

## Layer

An architectural level of intent. The current model distinguishes primitive, semantic, and component layers.

## Local-first

A product direction in which core authoring works with locally owned data and does not require a hosted account. It does not yet prescribe a storage or synchronization architecture.

## MCP

Model Context Protocol. A possible delivery surface through which tools can expose workbench application operations to compatible AI or automation clients. MCP support is an architectural possibility, not an initial-release commitment.

## Mode

A named variation within an external collection or theme-like construct, such as light and dark. Figma uses this term specifically. A mode may map to an option on a canonical variation axis or to a flattened combination of options, but it is not itself the canonical composition model.

## Native profile

A compatibility profile for the actual interchange behavior of a particular tool and version. A native profile may borrow DTCG syntax while adding extensions, legacy value shapes, custom types, or a different theme envelope; it must not be labeled strict DTCG unless it satisfies that profile.

## Normalization

The deliberate mapping of source-specific concepts into the canonical model. It may require user review when intent cannot be inferred safely.

## Opacity

A compositing property applied to a layer, element, or composed result. It is conceptually distinct from color alpha.

## Paint

A possible future abstraction for visual treatments applied to an area or stroke. It is not in the selected canonical token-type set: solid values remain colors and gradients use the gradient composite. It should be introduced only if concrete solid, gradient, image, pattern, or related use cases require a shared contract.

## Percentage

A context-relative numeric value represented canonically as an exact decimal ratio, such as `"0.5"` for `50%`. Percentage is a value type rather than a dimension unit. A percent-formatted editor value may still represent another type, such as a constrained number used for opacity.

## Package

A possible future reusable or distributable unit containing a token or broader design-system artifact plus relevant metadata, documentation, versioning, and compatibility information. Packaging is not required by the initial canonical ownership model; its boundaries and dependency semantics remain open.

## Port

An application- or domain-owned contract for an external capability, such as project storage, Git, a process runner, or an adapter registry. Infrastructure adapters implement ports.

## Preload bridge

The isolated Electron boundary that exposes a narrow workbench-specific API to the Chromium renderer. It translates typed frontend calls into validated IPC requests without exposing raw Electron or Node.js capabilities.

## Project

The primary working context and initial ownership boundary for a product, brand, client, or design system. Its core entity has a stable identity, name, and optional description. A project may contain no tokens; every token and namespace group belongs to exactly one project.

## Project identity

A stable identifier for a project that remains distinct from its human-readable name and local directory path.

## Progressive Web App

The first implementation host for the workbench: a desktop-oriented, offline-capable browser application that can be installed through supporting browsers. PWA installation, caching, and browser persistence are delivery concerns and do not define the canonical token model or persistence format.

## Primitive token

A reusable source value or scale step that does not itself commit to a product-facing semantic role.

## Processor profile

A compatibility profile for a build or translation engine, describing its accepted input subset, validation behavior, transformations, generated outputs, metadata preservation, and known loss. Successful processing under a processor profile does not establish source-document conformance. Style Dictionary `5.5.5` is the current researched example.

## Provenance

Information about where imported data came from, its source version or path, and target-specific metadata useful for explanation or re-export.

## Preview context

The explicit conditions under which a token specimen is rendered, such as a variation selection, viewport or container dimensions, fonts, and content. Preview observations under that context are distinct from authored canonical values.

## Reference

A typed authored relationship identifying another token in the same project by stable identity. A whole-value reference makes the referring token an alias; references can also occur within expressions or composites. Paths are derived display or interchange addresses rather than canonical reference identity.

## Regeneration protection

Optional authoring metadata that excludes a token from generator-proposed updates by default. Protection preserves an authored choice without creating a live generator dependency; skipped protected tokens remain visible during proposal review.

## Resolved value

The value obtained after applying a variation selection, following aliases, and evaluating permitted expressions where sufficient context is available. Resolution does not imply that every expression can become a context-free literal; browser preview measurements are separate observations.

## Scale helper

An authoring tool whose deterministic domain calculation generates candidate token values from a pattern and parameters. Selected candidates become ordinary canonical tokens without live generator dependencies. A scale recipe is not a required canonical entity; curated progressions are manually authored values.

## Semantic role

Optional explicit token metadata describing the design-system purpose served by a value, such as content color, surface color, spacing, or radius. It is distinct from value type, layer, composition, and path, and may guide validation or target adaptation.

## Semantic token

A token named for design intent rather than a raw value, normally referencing a primitive or another semantic token.

## Set

A named non-structural grouping or activation unit for tokens. A token may potentially belong to multiple sets without changing its canonical path. External tools use sets differently; their exact canonical and interoperability semantics remain open.

## Source of truth

The authoritative authored representation from which derived target artifacts are generated. The workbench's canonical project should serve this role; its file format is undecided.

## Taxonomy

The organized vocabulary used to classify and name tokens by layer, category, role, variant, state, or other meaningful dimensions.

## Theme

A user-facing coherent variation in resolved token values. Canonically, a named theme is a preset of options selected across independent variation axes rather than a separate token tree.

## Theme preset

A project-owned aggregate root that gives stable identity and a name to a reusable partial variation selection, such as dark with high contrast. Omitted axes derive their current defaults. A preset provides a convenient activation and authoring view but does not own token values, participate in token conditions, nest, or contain target-specific activation mappings.

## Token

A project-owned aggregate root representing one design decision. It has a stable non-semantic identity, local name, namespace placement, optional meaning and component-definition association, optional typed definition containing its value assignments, authoring policy, and namespaced extensions. A token may be created by name before its definition is complete.

## Token definition

The optional typed portion of a Token containing one explicit token type and its owned value assignments. Absence represents a name-only token; an empty assignment collection represents a typed but unassigned token.

## Token identity

A stable, non-semantic, collision-resistant identifier distinct from a token's mutable path. Renaming or moving a token within its project preserves identity; copying, recreating, or transferring it to another project creates a new identity.

## Token value assignment

An identity-less value object owned by a Token definition, pairing one authored value with one normalized variation condition. Assignment order has no semantic meaning, and a Token may contain at most one assignment for an identical normalized condition.

## Token path

A mutable human-readable address such as `color.content.primary`, derived from ancestor namespace-group names and the token's local name. A path is not token identity.

## Value type

The explicit shape and constraints of a token's data. The canonical foundational set is color, number, dimension, percentage, angle, duration, string, boolean, font family, font weight, and cubic Bézier. A defined token carries its type; a name-only incomplete token may temporarily omit it. Containment does not define type, and type does not by itself state semantic purpose.

## Variation axis

An independent project-owned aggregate root along which token values may vary, such as color scheme, contrast, brand, platform, density, or locale. A saved axis owns at least one Variation option and identifies exactly one explicit default. Sharing the mechanism does not make different axes semantically equivalent.

## Variation condition

A normalized conjunction of axis-option selections attached to a Token value assignment. The empty condition is unconditional; each axis may appear at most once, and an explicitly selected default option remains more specific than omission.

## Variation option

An identity-bearing entity owned by one Variation axis, such as `light` or `dark` on a color-scheme axis. Its stable identity is referenced by conditions and theme presets; it has no independent lifecycle outside its axis.

## Variation selection

A normalized choice of at most one option from each represented variation axis. A selection may be partial; omitted axes can be completed from their explicit defaults for activation and resolution. Conditional token values match selections, and named theme presets store reusable partial selections.

## Workbench

The desktop-first authoring, reasoning, validation, import, and export environment proposed by this project.

## Workspace

The local location or active environment in which a project is stored and edited. A workspace may be moved or renamed without changing project identity.
