# Glossary

This glossary defines terms as used in the inception documents. Definitions describe the current shared language; entries marked as hypotheses remain subject to refinement.

## Adapter

A target- or source-specific translator between an external representation and the canonical model. Importers and exporters are adapters.

## Alias

A token value expressed as a reference to another token rather than a duplicated literal. Aliases preserve relationships and are resolved deterministically.

## Authored value

The literal, reference, expression, or composition saved by the author before resolution.

## Canonical model

The tool-independent representation treated as authoritative inside a workbench project. It preserves token meaning and relationships without adopting one external tool's ontology. Its persistence format is undecided.

## Application operation

A meaningful workbench use case that coordinates domain behavior and external capabilities, such as creating a project, validating a package, importing tokens, or exporting a target artifact. Application operations are shared by delivery surfaces.

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

## Composite

A structured value or treatment assembled from multiple constituent values, such as typography, shadow, or gradient.

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

An authored calculation or function-based value definition that may contain token references. Expression support is a working decision; its grammar, representation, result typing, and supported context requirements remain open. An expression is not automatically a new value type.

## Gradient

A composed visual treatment containing multiple color stops, positions, and geometry. A gradient is not a color.

## Group

A hierarchical organizational construct used to contain tokens or other groups. Its exact canonical semantics versus those of a set remain open.

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

A proposed composite visual treatment applied to an area or stroke, potentially including solid and gradient variants. Whether it is a canonical token type is unresolved.

## Package

A reusable or distributable unit owned by a project and containing a token system plus relevant metadata, themes, documentation, versioning, and compatibility information. Every token belongs to a package. The package schema and multi-package dependency semantics are not yet defined.

## Port

An application- or domain-owned contract for an external capability, such as project storage, Git, a process runner, or an adapter registry. Infrastructure adapters implement ports.

## Preload bridge

The isolated Electron boundary that exposes a narrow workbench-specific API to the Chromium renderer. It translates typed frontend calls into validated IPC requests without exposing raw Electron or Node.js capabilities.

## Project

The primary working context for a product, brand, client, or design system. A user creates, opens, or imports a project before editing tokens. A project owns one or more token packages plus relevant settings, provenance, target configuration, and workflow metadata.

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

A relationship identifying another token or a supported part of its value. A whole-value token reference makes the referring token an alias; references can also occur within expressions or composites. The internal representation and initially supported addressing forms remain open.

## Resolved value

The value obtained after applying a variation selection, following aliases, and evaluating permitted expressions where sufficient context is available. Resolution does not imply that every expression can become a context-free literal; browser preview measurements are separate observations.

## Scale helper

An authoring tool whose deterministic domain calculation generates candidate token values from a pattern and parameters. Selected candidates become ordinary canonical tokens without live generator dependencies. A scale recipe is not a required canonical entity; curated progressions are manually authored values.

## Semantic role

The design-system purpose served by a value, such as content color, surface color, spacing, or radius. It is distinct from storage type.

## Semantic token

A token named for design intent rather than a raw value, normally referencing a primitive or another semantic token.

## Set

A named grouping or activation unit for tokens. External tools use sets differently; its canonical relationship to groups and themes remains open.

## Source of truth

The authoritative authored representation from which derived target artifacts are generated. The workbench's canonical project should serve this role; its file format is undecided.

## Taxonomy

The organized vocabulary used to classify and name tokens by layer, category, role, variant, state, or other meaningful dimensions.

## Theme

A user-facing coherent variation in resolved token values. Canonically, a named theme is a preset of options selected across independent variation axes rather than a separate token tree.

## Theme preset

A named variation selection, such as dark with high contrast. A preset provides a convenient activation and authoring view but does not own duplicated token definitions.

## Token

A named design decision represented by typed data, a reference, an expression, or a composition together with meaning and metadata.

## Token path

A hierarchical human-readable name such as `color.content.primary`. Whether paths are also stable identity is an open question.

## Value type

The shape and constraints of a token's data, such as color, number, dimension, string, boolean, or duration. It does not by itself state semantic purpose.

## Variation axis

An independent canonical dimension along which token values may vary, such as color scheme, contrast, brand, platform, density, or locale. An axis defines named options and a default option; sharing the mechanism does not make different axes semantically equivalent.

## Variation option

A named choice on a variation axis, such as `light` or `dark` on a color-scheme axis.

## Variation selection

A choice of options across applicable variation axes. Conditional token values match partial selections; named theme presets provide reusable selections.

## Workbench

The desktop-first authoring, reasoning, validation, import, and export environment proposed by this project.

## Workspace

The local location or active environment in which a project is stored and edited. A workspace may be moved or renamed without changing project identity.
