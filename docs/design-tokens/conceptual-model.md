# Canonical Token Conceptual Model

## Purpose and status

This document records the current conceptual model. It deliberately separates established distinctions from hypotheses that still need formal schemas and examples.

## Canonical model

**Established direction**

The workbench needs a canonical, tool-independent model from which it can validate, explain, transform, and export token systems. “Canonical” means authoritative inside a workbench project; it does not yet imply a particular storage format.

A token minimally has:

- a stable identity or path;
- an authored literal, reference, expression, or composition;
- a value type;
- optional description and metadata;
- a place in a layer and semantic vocabulary;
- theme or condition behavior when applicable.

The exact schema, identity rules, and persistence representation are open.

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

**Established need; unresolved model**

A token identity such as `color.content.primary` should be able to resolve differently in light and dark themes without duplicating the semantic vocabulary. Systems may also vary by brand, density, platform, contrast, or locale.

Open modeling questions include whether these axes are modes, token-set combinations, conditions, or another construct; how axes compose; and how conflicts are resolved.

## Color, opacity, paint, and gradients

### Color

**Established direction**

A color is a color value and may include an alpha channel. A translucent color therefore remains a color; translucency alone does not make it a paint.

```text
color.overlay.scrim → color value with alpha
```

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

## Token sets and packages

**Working hypothesis**

A token set may group values for authoring, activation, theme composition, or interchange. A token package may be a higher-level distributable artifact containing sets, metadata, documentation, versions, and compatibility information.

## Project, workspace, and package hierarchy

**Established direction**

A project is the primary working context and ownership boundary for authored work. Users create, open, or import a project before creating tokens.

```text
Project
└── Token package
    └── Token sets, groups, and tokens
```

Every token belongs to a token package, and every package belongs to a project. A project may additionally own settings, import provenance, export-target configuration, compatibility reports, and generated-artifact metadata.

A workspace is the local location or environment in which a project is stored and edited. A workspace path is not the project's stable identity. A package is the reusable or distributable token artifact inside the project.

**Working hypothesis**

The first implementation may allow one primary package per project while preserving a path toward multiple packages, package dependencies, and shared packages. The exact relationship between package, collection, set, group, theme, and mode still requires formalization.

## Extensibility

**Working hypothesis**

The canonical model should support namespaced metadata and perhaps custom semantic vocabularies while protecting core invariants. Extensibility must not make validation meaningless or require every adapter to understand every extension.

## Persistence boundary

**Open question**

DTCG is the leading interoperability foundation, but the canonical persisted form may need concepts beyond a single interchange document: provenance, project configuration, adapter metadata, theme composition, package information, or editor state. Persistence should be selected only after the conceptual model and round-trip requirements are tested.

## Engine boundary

**Established direction**

The canonical model and deterministic operations over it form a reusable token engine. This engine must not depend on Electron, Chromium, Node.js filesystem APIs, a database, a UI framework, or an RPC transport. Desktop, CLI, web, MCP, and test surfaces invoke the same domain and application operations through their own adapters.
