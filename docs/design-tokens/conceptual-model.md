# Canonical Token Conceptual Model

## Purpose and status

This document records the current conceptual model. It deliberately separates established distinctions from hypotheses that still need formal schemas and examples.

## Canonical model

**Established direction**

The workbench needs a canonical, tool-independent model from which it can validate, explain, transform, and export token systems. “Canonical” means authoritative inside a workbench project; it does not yet imply a particular storage format.

A token minimally has:

- a stable identity distinct from its mutable, derived path;
- ownership by exactly one project;
- a local name and optional parent namespace group;
- an authored literal, reference, expression, or composition;
- an explicit value type;
- optional description and metadata;
- a place in a layer and semantic vocabulary;
- theme or condition behavior when applicable.

The exact schema, identifier format, authored-value representation, and persistence representation remain open.

### Project ownership and identity

**Working decision — 5 October 2026**

A Project is the stable working context and initial ownership boundary. Its core entity has a stable identity, a human-readable name, and an optional description. A project may contain zero tokens; every token belongs to exactly one project through its project identity. No package or relationship entity is required merely to represent that one-to-many ownership.

Project identity is distinct from its workspace location. Moving or renaming a workspace does not change the project. Settings, provenance, export targets, generated-artifact records, and other project-owned concerns may remain associated entities or configuration rather than fields embedded into the core Project entity.

### Token identity and lifecycle

**Working decision — 5 October 2026**

Every token has a stable, non-semantic, collision-resistant identity. Its exact generation format remains open and consumers must not infer token meaning from it. Renaming or moving a token within its project, or changing its value, role, layer, conditions, or metadata, preserves the identity.

Copying a token creates a new identity. Deleting and recreating a token creates a new identity even when the path is reused, and deleted identities are not reused. Copying or moving a token across a project boundary also creates a new identity; external source identifiers remain provenance rather than canonical identity.

### Namespace groups and derived paths

**Working decision — 5 October 2026**

A TokenGroup is a project-owned namespace node with a stable identity, local name, optional description, and either one parent group in the same project or no parent at the project root. A group may be empty. Group ancestry is acyclic; a group cannot be moved into itself or a descendant. Renaming or moving a group preserves its identity and those of all descendants.

Tokens have a local name and either one parent namespace group in the same project or no parent at the project root. A token's human-readable path is derived from its ancestor group names plus its local name. The derived path may be cached for indexing or display, but it is not an independently authored source of truth. Renaming or moving a token or ancestor group changes affected paths without changing token identities. Such a change may still be breaking for path-based exports and consumers and must be visible in semantic change analysis.

Child groups and tokens share one sibling namespace so derived paths remain unambiguous. Deleting a non-empty group requires an explicit operation; descendants must not disappear or be reparented silently. A namespace group has one structural parent and determines paths. Sets, collections, tags, or other potentially multi-membership organization are separate non-structural concepts and do not determine canonical paths.

### Explicit token types

**Working decision — 5 October 2026**

Every canonical token stores its explicit value type. A TokenGroup does not have a token type, and moving a token between groups does not mutate its type. If homogeneous groups become useful, a separately named type constraint or authoring default may be introduced after its semantics are demonstrated; neither replaces the token's explicit type.

DTCG group-level `$type` inheritance is an interchange concern. Importers resolve the effective source type and materialize it on each canonical token while retaining provenance needed for review or re-export. Exporters may consolidate repeated explicit types onto a target group when the selected profile permits it and the transformation is lossless.

### Export-aware modeling

**Working decision — 1 October 2026**

Use CSS and strict DTCG `2025.10` as the first concrete export cases when testing the canonical model. Model typed values and relationships with enough information for explicit adaptation, rather than storing target strings as the universal representation. This selects modeling examples, not an adapter implementation order or a promise that every canonical value is representable in both targets.

Before implementing a behavior, compare small canonical examples with their expected exports and compatibility diagnostics. Keep token meaning in the model and target naming, serialization, conversion, and output policies in adapter configuration. Exact schemas and export coverage remain open; see [interoperability](./interoperability.md#initial-modeling-targets-and-expressions).

## Three independent axes

### Value type

**Established distinction**

The value type describes the shape and constraints of stored data. Candidate foundational types include color, number, dimension, string, boolean, duration, and other types justified by real use cases.

The definitive type set is unresolved. External tools may expose either broad storage types or purpose-specific types; neither should be copied automatically.

### Semantic role

**Established distinction**

The semantic role states why a value exists: content color, surface color, spacing, radius, layer opacity, motion duration, and so on. Different roles may share a value type while needing different naming, validation, scopes, or export behavior.

### Composition

**Established distinction**

A composite combines several values into a meaningful treatment. Candidate composites include paint, gradient, typography, shadow/effect, and potentially motion definitions.

```text
value type        semantic role          composition
-----------       ----------------       ----------------
dimension         spacing                typography
number            opacity                shadow
color             content color          gradient / paint
```

The columns answer different questions; an item appearing in one does not force it to be a primitive storage type in another.

## Token layers

### Primitive layer

**Established direction**

Primitives name reusable values without committing them to a product role.

```text
color.neutral.950
color.blue.600
dimension.4
duration.fast
```

Primitives provide scales and raw ingredients. “Primitive” describes architectural responsibility, not simplicity of the underlying data.

### Semantic layer

**Established direction**

Semantic tokens name design intent and normally alias primitives or other semantic tokens.

```text
color.content.primary  → {color.neutral.950}
color.surface.default  → {color.neutral.0}
color.accent.default   → {color.blue.600}
spacing.container      → {dimension.6}
```

The semantic name should remain meaningful when a theme changes the resolved primitive.

### Component layer

**Established direction**

Component tokens represent decisions local to a reusable component or pattern and normally refer to semantic tokens.

```text
button.primary.background.default → {color.accent.default}
button.primary.label.default      → {color.content.on-accent}
```

Component tokens are useful when they encode a real contract or themeable decision. They should not be generated merely to mirror every implementation property.

### Layer rules

**Working hypothesis**

Reference rules may normally flow primitive → semantic → component, with carefully defined exceptions. The model should detect cycles and expose dependency direction, but whether cross-layer references are forbidden or simply discouraged is open.

## References, aliases, and resolution

**Established direction**

Aliases are first-class relationships, not text substitutions. The workbench should preserve the authored reference, resolve it deterministically, display the dependency graph, and detect missing or cyclic references.

DTCG-style references such as `{color.neutral.950}` are a strong interchange convention. The internal reference representation remains undecided.

A reference identifies another token or a supported part of its value. An alias token has a reference as its whole authored value; its name is still an ordinary token name. References may also occur inside expressions or composites without making the whole token an alias.

## Expressions

**Working decision — 1 October 2026**

The canonical model should support authored expressions, including CSS-function use cases such as `calc()`, `clamp()`, and `minmax()`. This is not a commitment to accept arbitrary CSS or support every function initially.

An expression is a form of authored value, not automatically a new value type. Its result or target-specific meaning still needs explicit typing: a length calculation and a grid-track definition must not be treated as the same kind of dimension merely because both use CSS functions.

Preserve authored expressions and identifiable token references. Reference analysis, missing-target detection, cycle detection, and type validation must apply to supported expression dependencies as well as whole-token aliases. Context-free evaluation must be distinguished from values that need a viewport, container, font metrics, or other rendering context; missing context must not be replaced by hidden assumptions.

The expression representation, grammar, initial supported functions, typing rules, and evaluation policies remain open. A structured representation is a candidate, not a selected schema. Portable operations and explicitly CSS-specific constructs must remain distinguishable.

## Value previews

**Working direction — 1 October 2026**

Provide meaningful previews for the supported token types and expressions. Rendering may use an explicit context, including the selected theme, viewport or container dimensions, root font size, fonts, and specimen content. A preview result is an observation under that context, not a replacement for the authored canonical value.

The preview should distinguish a rendered result from missing context, unsupported rendering, and invalid values or dependencies, with explanations. Universal preview coverage is not required; the initial supported subset and specimen types remain open. A successful browser preview does not establish export compatibility or DTCG conformance.

Browser rendering and measurement belong outside the domain engine. See the [preview boundary](../project/architecture.md#expression-preview-boundary).

## Scale generation

**Established decision — 1 October 2026**

Scales are authoring helpers for generating a series of candidate token values following a pattern. Their deterministic calculation belongs in the domain engine; they are not merely UI utilities. A scale recipe is not a required persisted entity, token value type, or relationship in the canonical model.

Users supply parameters, inspect candidates, and choose which tokens to create. Application operations create those tokens through the normal naming, typing, and validation rules. Once accepted, the tokens are ordinary authored canonical data, independently editable with no live relationship to the generator. Changing generator parameters later does not automatically update existing tokens.

For example, a helper using a base of `1rem`, a ratio of `1.25`, and four steps could propose `1rem`, `1.25rem`, `1.5625rem`, and `1.953125rem`. This illustrates generation, not a finalized function signature or naming scheme. Curated values are manually chosen by users and need no scale object.

Supported patterns, parameter validation, rounding, naming, collision handling, and initial release scope remain open. Saving helper presets, if later useful, is a separate product/configuration decision and must not silently introduce live scale dependencies.

## Themes and modes

**Working decision — 5 October 2026**

Model theme variability canonically through independent variation axes rather than nested theme trees. An axis represents one dimension of variation, such as color scheme, contrast, brand, platform, density, or locale, and defines named options plus a default option. These concerns use the same composition mechanism without implying that they have the same domain meaning.

A variation selection chooses options across the applicable axes. A token may have an unconditional authored value and conditional authored values whose conditions match a partial selection. This allows a token identity such as `color.content.primary` to resolve differently for light and dark schemes, standard and high contrast, or their combination without duplicating the semantic vocabulary or requiring a complete value copy for every theoretical combination.

Resolution must be deterministic. Complete omitted selections from axis defaults, retain conditional values whose conditions match the active selection, and choose the matching value with the most specific condition. Declaration order is not a semantic tie-breaker: equally specific matches that provide different values are ambiguous and must produce a validation diagnostic. A missing applicable value is also a validation outcome rather than permission to invent one. Aliases and supported expressions resolve under the same active selection and participate in ordinary missing-reference, cycle, and type validation.

Named themes are presets of variation selections, not owners of separate token trees. The authoring interface may display axes and presets hierarchically, as a matrix, or through another useful view without changing the canonical relationships. Adapters may flatten composed selections into target modes, sets, files, selectors, or other target constructs, but must report assumptions, unsupported combinations, and loss explicitly.

The initial axes and options, constraints between combinations, coverage requirements, exact persistence representation, and adapter-specific mappings remain open. Accessibility-related axes need precise meanings: contrast, forced colors, color-vision adaptations, typography, spacing, transparency, and motion must not be collapsed into an undifferentiated accessibility theme. Color-vision adaptations are reviewed authored decisions and do not establish that color alone can carry meaning.

## Color, opacity, paint, and gradients

### Color

**Established direction**

A color is a color value and may include an alpha channel. A translucent color therefore remains a color; translucency alone does not make it a paint.

```text
color.overlay.scrim → color value with alpha
```

#### Authored color and alternative representations

**Established decision — 2 October 2026**

Keep one authoritative authored value for a color token under each applicable theme or condition. That value may be a literal, reference, or supported expression; do not persist independently editable RGB, HSL, HEX, and OKLCH copies as competing sources of truth.

A literal color should retain its explicit color space/model, components, and alpha rather than being reduced to a HEX string or automatically normalized to sRGB. The exact schema and initially supported spaces remain open. Preserve meaningful component information, including missing components where supported, rather than silently treating every missing component as zero.

HEX is a notation for sRGB, not a separate color space. RGB requires a specified space, such as sRGB or Display P3; HSL is an sRGB-based model. OKLCH is another color model. Users should be able to select supported editing/display representations without those representations becoming separate token values. See [CSS color notation](https://www.w3.org/TR/css-color-4/#hex-notation).

Alternative representations are derived from the authoritative color and may be cached as disposable derived data. Merely inspecting another representation must not mutate the token. An accepted edit or explicit conversion updates the authoritative value under a defined editing policy, then invalidates or recalculates derived representations. Editing an alias or expression must not silently replace its authored relationship with a resolved literal.

A fallback is distinct from an equivalent representation: a color outside a target gamut may need an approximation. Keep that distinction visible, report loss, and never overwrite the authored color with a preview or export approximation implicitly. Whether fallbacks are author-managed data or generated adapter output, and how they remain current after edits, is unresolved. Theme/condition variants are different authored decisions, not formatting alternatives.

#### Color manipulation

**Established direction — 2 October 2026**

Deterministic color conversion and manipulation belong in the domain engine, not only in color-picker UI code. Candidate capabilities include component adjustments, mixing/interpolation, and palette generation; their initial coverage is not selected.

Operations must state their color model or interpolation space and applicable parameters. For example, adjusting HSL lightness and adjusting OKLCH lightness are different operations; an unspecified “lighten by 10%” is not a sufficient domain contract. Precision, hue handling, alpha behavior, gamut-mapping policy, and algorithms remain explicit implementation decisions.

Like scale helpers, color helpers may propose candidate values that become ordinary tokens when accepted. This does not establish live dependencies. Retaining a manipulation as an authored expression is a separate expression-support decision. UI controls collect parameters and show candidates; application operations coordinate accepted changes through domain validation.

### Opacity

**Established distinction**

Color alpha and layer or element opacity are related but different concepts:

- color alpha is part of a color value;
- layer opacity is a compositing property applied to an element or composed result.

```text
color.overlay.scrim  ≠  opacity.disabled
```

Their export destinations may also differ.

### Paint

**Working hypothesis**

Paint is a visual treatment applied to an area or stroke. It may provide a common conceptual home for:

```text
paint
├── solid → references or contains a color
└── gradient
    ├── kind
    ├── geometry
    └── ordered stops → colors + positions
```

Whether a solid paint should be modeled explicitly, whether paint is itself a token type, and whether image or pattern fills belong in token scope are unresolved.

### Gradient

**Established distinction; unresolved representation**

A gradient is not a color. It is a composition of colors plus positions and geometry. Some targets represent gradients as reusable styles rather than variables or native tokens, so the canonical model must not pretend that every target can preserve a gradient as a token.

## Token sets and future packaging

**Working hypothesis**

A token set may group values for authoring, activation, theme composition, or interchange without determining canonical paths. A future token or design-system package may be a distributable artifact containing tokens, metadata, documentation, versions, and compatibility information. Packaging is not required by the initial canonical ownership model.

## Project and workspace

**Established direction**

A project is the primary working context and ownership boundary for authored work. Users create, open, or import a project before creating tokens.

```text
Project
└── Namespace groups and tokens
```

Every token and namespace group belongs to exactly one project. A project may additionally own settings, import provenance, export-target configuration, compatibility reports, and generated-artifact metadata without embedding all of those concerns into the core Project entity.

A workspace is the local location or environment in which a project is stored and edited. A workspace path is not the project's stable identity.

**Working hypothesis**

A reusable or distributable package boundary may be introduced later if independent versioning, dependencies, installation, or publication require it. The exact relationship between future packaging, collections, sets, theme presets, and non-structural organization remains open.

## Extensibility

**Working hypothesis**

The canonical model should support namespaced metadata and perhaps custom semantic vocabularies while protecting core invariants. Extensibility must not make validation meaningless or require every adapter to understand every extension.

## Persistence boundary

**Open question**

DTCG is the leading interoperability foundation, but the canonical persisted form may need concepts beyond a single interchange document: stable identities, provenance, project configuration, adapter metadata, theme composition, or editor state. Persistence should be selected only after the conceptual model and round-trip requirements are tested.

## Engine boundary

**Established direction**

The canonical model and deterministic operations over it form a reusable token engine. This engine must not depend on Electron, Chromium, Node.js filesystem APIs, a database, a UI framework, or an RPC transport. Desktop, CLI, web, MCP, and test surfaces invoke the same domain and application operations through their own adapters.
