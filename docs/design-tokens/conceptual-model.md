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
- zero or more conditional authored-value assignments;
- an explicit value type when its definition requires one;
- optional description and metadata;
- optional explicit layer and semantic role;
- theme or condition behavior when applicable.

A token may therefore be created by name before its type or value is known. Definition completeness is derived from its current fields and assignments; an absent value is not represented by a synthetic empty-value type. The exact serialized schema, identifier format, and persistence representation remain open.

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

Every defined canonical token stores its explicit value type. A newly named, incomplete token may temporarily omit its type and authored value; once a typed definition is supplied, its type is stored on the token rather than inferred from its name, layer, role, value syntax, or containment. A TokenGroup does not have a token type, and moving a token between groups does not mutate its type. If homogeneous groups become useful, a separately named type constraint or authoring default may be introduced after its semantics are demonstrated; neither replaces the token's explicit type.

DTCG group-level `$type` inheritance is an interchange concern. Importers resolve the effective source type and materialize it on each canonical token while retaining provenance needed for review or re-export. Exporters may consolidate repeated explicit types onto a target group when the selected profile permits it and the transformation is lossless.

### Export-aware modeling

**Working decision — 1 October 2026**

Use CSS and strict DTCG `2025.10` as the first concrete export cases when testing the canonical model. Model typed values and relationships with enough information for explicit adaptation, rather than storing target strings as the universal representation. This selects modeling examples, not an adapter implementation order or a promise that every canonical value is representable in both targets.

Before implementing a behavior, compare small canonical examples with their expected exports and compatibility diagnostics. Keep token meaning in the model and target naming, serialization, conversion, and output policies in adapter configuration. Exact schemas and export coverage remain open; see [interoperability](./interoperability.md#initial-modeling-targets-and-expressions).

## Three independent axes

### Value type

**Working decision — 5 October 2026**

The value type describes the shape and constraints of stored data. The canonical foundational set is:

```text
color          number          dimension       percentage
angle          duration        string          boolean
fontFamily     fontWeight      cubicBezier
```

`dimension` represents a length-bearing quantity rather than any arbitrary unit-bearing number. `percentage`, `angle`, and `duration` remain distinct so validation and typed operations do not conflate context-relative proportions, rotation, length, and time. `fontFamily`, `fontWeight`, and `cubicBezier` have domain-specific shapes or constraints that justify explicit types.

Exact literal schemas, accepted units, constraints, and initial implementation coverage remain open. This canonical set is not a promise that every target represents every type losslessly. External tools may expose either broader storage types or more purpose-specific types; neither taxonomy is copied automatically.

#### Exact decimal numeric values and percentages

**Working decision — 5 October 2026**

Canonical numeric literals use a reusable exact finite base-10 `Decimal` value object rather than treating an IEEE-754 binary floating-point value as authoritative. Its storage-neutral representation is a validated canonical decimal string; the implementation may later use a decimal-arithmetic library internally without making that library part of the domain model.

```ts
type Decimal = string;

type PercentageLiteral = {
  ratio: Decimal;
};
```

A percentage stores a normalized ratio: `50%` becomes `"0.5"`, `12.5%` becomes `"0.125"`, `125%` becomes `"1.25"`, and `-10%` becomes `"-0.1"`. Percentage is a canonical value type rather than a unit accepted by `dimension`: a percentage is context-relative and does not become a length merely because some target contexts accept a length-percentage combination.

Not every value displayed with a percent sign is therefore a percentage token. For example, an opacity may remain a constrained `number` with value `"0.5"` and be displayed as `50%`; a genuinely context-relative value may use the `percentage` type. Percentages are not universally restricted to the ratio range zero through one because negative values and values above one may be valid in supported contexts.

Canonical, calculation, and presentation precision remain separate:

- canonical precision preserves the exact authored decimal value without rounding it for a view;
- deterministic calculations use an explicit precision and rounding policy appropriate to the operation;
- editors and adapters may format or round displayed and exported representations without mutating the canonical value.

Trailing zeros are not semantically significant: `"0.5"` and an authored `"0.5000"` denote the same value. If preserving that formatting later proves useful, it belongs to non-semantic authoring metadata. The exact decimal grammar, normalization rules, maximum accepted digits, calculation contexts, and rounding modes remain to be defined before implementation of the affected numeric operations.

### Semantic role

**Working decision — 5 October 2026**

The optional explicit semantic role states why a value exists: content color, surface color, spacing, radius, layer opacity, motion duration, and so on. Different roles may share a value type while needing different naming, validation, scopes, or export behavior. A role is not inferred canonically from the token's path, layer, group, or type, although importers may propose an inferred role for review.

Purpose-specific concepts normally remain roles over foundational types: spacing, sizing, radius, border width, and font size use `dimension`; opacity and unitless line height use `number`; rotation uses `angle`; motion duration uses `duration`; and content, surface, border, or accent purposes use `color`. Adapters may use the role together with type, layer, and path to map into target categories such as scopes, token kinds, or documentation sections.

### Composition

**Working decision — 5 October 2026**

A composite combines several typed fields into a meaningful treatment. The initial canonical composite set is:

```text
typography     shadow     gradient     border     transition
```

Each composite has a named, validated schema rather than an arbitrary object shape. Composite fields may contain permitted literal values, references, or expressions. Exact schemas and initial implementation coverage remain open.

```text
value type        semantic role          composition
-----------       ----------------       ----------------
dimension         spacing                typography
number            opacity                shadow
color             content color          gradient
duration          motion duration         transition
```

The columns answer different questions; an item appearing in one does not force it to be a primitive storage type in another.

Generic `object`, generic `array`, arbitrary `CSS value`, alias, expression, layer names, and theme options are not token types. Alias and expression describe authored-value forms; primitive, semantic, and component describe layers; theme choices belong to variation axes. `paint` is not part of the selected canonical type set: a solid value remains a `color`, while a gradient uses the `gradient` composite.

## Authored values and assignments

**Working decision — 5 October 2026**

A token owns zero or more value assignments. Each assignment pairs one authored value with a normalized condition over variation axes. The empty condition is the unconditional assignment. A token may have at most one assignment for the same normalized condition; an assignment is an owned value object and does not need a stable identity independent of its token.

The canonical authored-value union is:

```text
LiteralValue | ReferenceValue | ExpressionValue | CompositeValue
```

- A `LiteralValue` uses the structured schema of the token's value type; it is not a generic CSS string.
- A `ReferenceValue` identifies another token by stable token identity. Canonical references stay within a project, preserve authorship, require compatible types, and resolve paths only as derived display or interchange addresses. Missing external targets remain staged import data until reconciled rather than becoming valid canonical references.
- An `ExpressionValue` is a typed structured expression. Portable canonical operations remain distinguishable from explicitly target-specific operations such as supported CSS constructs. The exact abstract syntax tree and operation set remain open.
- A `CompositeValue` uses one of the named composite schemas. Its constituent fields retain their types and may contain supported references or expressions.

A condition applies to the whole assignment. Resolution selects one applicable assignment before resolving its contents; composite fields do not merge implicitly across matching conditions. Literal, reference, expression, and composite values all participate in deterministic type, dependency, missing-reference, and cycle validation.

A token with no assignments is a valid authored project member but has an incomplete definition. This is a derived state rather than a stored lifecycle status or an `EmptyValue`. Operations that require a resolved value, including many exports, report the incomplete definition explicitly.

### Token aggregate and assignment structure

**Working decision — 5 October 2026**

`Token` is an aggregate root that can be loaded and changed independently within its project ownership boundary. The Project does not need to be one giant in-memory aggregate merely because it owns all tokens. `TokenValueAssignment` is an owned value object inside its Token; it has no independent stable identity or lifecycle.

The storage-neutral conceptual structure is:

```ts
type Token = {
  id: TokenId;
  projectId: ProjectId;
  localName: TokenName;
  parentGroupId: TokenGroupId | null;
  description?: string;
  layer?: TokenLayer;
  semanticRole?: SemanticRoleKey;
  componentDefinitionId?: ComponentDefinitionId;
  definition?: TokenDefinition;
  authoring: {
    regeneration: "allowed" | "protected";
  };
  extensions?: NamespacedExtensions;
};

type TokenDefinition = {
  type: TokenType;
  assignments: readonly TokenValueAssignment[];
};

type TokenValueAssignment = {
  condition: VariationCondition;
  value: AuthoredValue;
};

type AxisOptionSelection = {
  axisId: VariationAxisId;
  optionId: VariationOptionId;
};

type VariationCondition = readonly AxisOptionSelection[];
```

The notation documents domain shape rather than selecting TypeScript objects as the persistence format. An absent `definition` represents a name-only token. A present definition with no assignments represents a typed but unassigned token. A definition with assignments represents an authored token. Completeness, validity, and resolvability for a particular variation selection remain derived outcomes rather than stored status fields.

Every assignment stores a condition, including the empty array for the unconditional assignment, so there are not two representations of the same case. A condition is a conjunction of axis-option selections. Within a condition, each axis may occur at most once, every option must belong to its axis, and entries normalize deterministically by axis identity. Normalization does not remove an explicitly selected default option because that condition remains more specific than an omitted axis. A token may have at most one assignment for an identical normalized condition. Assignment order has no semantic meaning and supplies neither priority nor a tie-breaker.

Aggregate-local invariants require assignments to belong to a typed definition and their authored values to be compatible with that type. Changing the type must not silently reinterpret existing assignments. Removing the last assignment leaves a typed but unassigned token; removing the definition returns it to a name-only token.

Project-scoped domain operations validate relationships that cross aggregate boundaries: parent-group ownership, sibling-path uniqueness, variation-axis and option existence, component-definition ownership, reference-target ownership and compatibility, dependency cycles, and ambiguous equally specific matching conditions. These checks do not require the Project entity itself to contain and mutate every Token as one aggregate.

A component-layer token carries a `componentDefinitionId`, and a token with that association uses the component layer. This records the component token alongside its owning component definition without weakening the invariant that both belong to the same project. The minimal ComponentDefinition boundary is described below; its contract internals remain intentionally coarse.

Derived paths, resolved values, active themes or presets, completeness or validity flags, assignment precedence, cached reference targets, generated target values, source-tool type names, and timestamps without a demonstrated product requirement are not canonical Token fields.

## Token layers

**Working decision — 5 October 2026**

Layer is optional explicit token metadata with the canonical values `primitive`, `semantic`, and `component`. It is not inferred from path or reference shape, and it does not determine the token's value type. A project may use only the layers that serve its system.

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

### Component definitions, contracts, and token bindings

**Working decision — 5 October 2026**

A `ComponentDefinition` is a project-owned aggregate root providing stable identity and authoring context for a reusable component or pattern. It remains distinct from any Figma, Penpot, web-framework, or other target-specific component.

```ts
type ComponentDefinition = {
  id: ComponentDefinitionId;
  projectId: ProjectId;
  name: ComponentName;
  description?: string;
  contract: ComponentContract;
  extensions?: NamespacedExtensions;
};
```

The owned `ComponentContract` conceptually accommodates component parts, slots, properties, variant axes, interactive states, and component-token bindings. Those concepts are recorded now so that the model has a deliberate extension boundary, but their detailed fields, cardinalities, constraints, and interactions are deferred. Contract collections may be empty while a component is being defined.

Component-token ownership and component-token usage are related but distinct:

- a component-layer Token stores `componentDefinitionId`, making its one owning component explicit;
- the ComponentContract may contain token bindings describing how an owned token applies to a part, property, variant selection, state, or combination of those concepts;
- paths and names do not establish either relationship implicitly.

An owned component token may temporarily remain unbound while authoring is incomplete. Component-level diagnostics can report unbound tokens, invalid targets, or incomplete coverage without turning those derived findings into stored token status.

Tokens remain separate aggregate roots because they participate independently in the project-wide reference, variation, resolution, import, export, and change graphs. The ComponentDefinition does not duplicate an authoritative list of complete Token objects. Component authoring views may compose the definition, its contract, its owned tokens, and resolved bindings as one read model.

Aggregate separation does not prescribe a delayed user workflow. A coarse application operation may define a component, create its initial component tokens, and add their bindings as one validated atomic change. Later component-oriented operations may add, update, bind, or remove tokens while coordinating all affected aggregates. The exact persistence transaction mechanism remains open.

When the internal contract concepts are detailed, parts, slots, properties, variant axes and options, and states should use stable component-local identities so renaming them does not invalidate bindings. Component variants and interactive states must not be conflated automatically with project-level variation axes.

### Layer rules

**Working hypothesis**

Reference rules may normally flow primitive → semantic → component, with carefully defined exceptions. The model should detect cycles and expose dependency direction, but whether cross-layer references are forbidden or simply discouraged is open.

## References, aliases, and resolution

**Established direction**

Aliases are first-class relationships, not text substitutions. The workbench should preserve the authored reference, resolve it deterministically, display the dependency graph, and detect missing or cyclic references.

DTCG-style references such as `{color.neutral.950}` are a strong interchange convention. Canonically, a reference identifies its target by stable token identity within the same project; adapters derive or resolve path-based target addresses at their boundaries. The exact serialized reference shape remains open.

A reference identifies another token or a supported part of its value. An alias token has a reference as its whole authored value; its name is still an ordinary token name. References may also occur inside expressions or composites without making the whole token an alias.

## Expressions

**Working decision — 1 October 2026**

The canonical model should support authored expressions, including CSS-function use cases such as `calc()`, `clamp()`, and `minmax()`. This is not a commitment to accept arbitrary CSS or support every function initially.

An expression is a form of authored value, not automatically a new value type. Its result or target-specific meaning still needs explicit typing: a length calculation and a grid-track definition must not be treated as the same kind of dimension merely because both use CSS functions.

Preserve authored expressions and identifiable token references. Reference analysis, missing-target detection, cycle detection, and type validation must apply to supported expression dependencies as well as whole-token aliases. Context-free evaluation must be distinguished from values that need a viewport, container, font metrics, or other rendering context; missing context must not be replaced by hidden assumptions.

Expressions use a structured, typed representation rather than an opaque universal string. The exact abstract syntax tree, initial supported operations, detailed typing rules, and evaluation policies remain open. Portable operations and explicitly CSS-specific constructs must remain distinguishable.

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

### Generated change proposals and protection

**Working decision — 5 October 2026**

Palette, scale, accessibility-adaptation, and similar helpers produce a reviewable change proposal rather than mutating canonical tokens directly. A proposal identifies candidate creations, updates, and removals with their rationale and diagnostics. Users may accept or reject changes individually; only accepted changes pass through normal application operations and become authored canonical data. Regeneration must not silently delete tokens or overwrite authored choices.

A token may carry optional authoring metadata that protects it from regeneration. Protected tokens are excluded from generated updates by default and remain visible as skipped or potentially stale relative to the current proposal. Protection does not create a live dependency on a generator and does not change token type, layer, role, or value semantics. A proposal may offer an explicit reviewed override, and protection may also be changed while reviewing a proposal.

## Themes and modes

**Working decision — 5 October 2026**

Model theme variability canonically through independent variation axes rather than nested theme trees. An axis represents one dimension of variation, such as color scheme, contrast, brand, platform, density, or locale, and defines named options plus a default option. These concerns use the same composition mechanism without implying that they have the same domain meaning.

A variation selection chooses options across the applicable axes. A token may have an unconditional authored value and conditional authored values whose conditions match a partial selection. This allows a token identity such as `color.content.primary` to resolve differently for light and dark schemes, standard and high contrast, or their combination without duplicating the semantic vocabulary or requiring a complete value copy for every theoretical combination.

Resolution must be deterministic. Complete omitted selections from axis defaults, retain conditional values whose conditions match the active selection, and choose the matching value with the most specific condition. Declaration order is not a semantic tie-breaker: equally specific matches that provide different values are ambiguous and must produce a validation diagnostic. A missing applicable value is also a validation outcome rather than permission to invent one. Aliases and supported expressions resolve under the same active selection and participate in ordinary missing-reference, cycle, and type validation.

Named themes are presets of variation selections, not owners of separate token trees. Presets select options; token assignments continue to carry conditions expressed through axis and option identities and never depend on a preset identity. The authoring interface may display axes and presets hierarchically, as a matrix, or through another useful view without changing the canonical relationships. Adapters may flatten composed selections into target modes, sets, files, selectors, or other target constructs, but must report assumptions, unsupported combinations, and loss explicitly.

### VariationAxis and VariationOption

**Working decision — 5 October 2026**

`VariationAxis` is a project-owned aggregate root. `VariationOption` is an identity-bearing entity owned by exactly one axis: it has a stable identity because token conditions and theme presets reference it, but it has no independent lifecycle outside that axis.

```ts
type VariationAxis = {
  id: VariationAxisId;
  projectId: ProjectId;
  name: VariationAxisName;
  description?: string;
  options: readonly VariationOption[];
  defaultOptionId: VariationOptionId;
  extensions?: NamespacedExtensions;
};

type VariationOption = {
  id: VariationOptionId;
  name: VariationOptionName;
  description?: string;
  extensions?: NamespacedExtensions;
};
```

A saved canonical axis contains at least one option and exactly one explicit default whose identity belongs to that axis. Incomplete form state may exist in an editor before saving, but the canonical project does not persist a name-only axis that cannot participate deterministically in resolution. The default is not inferred from option order.

Axis names are unique within a project, and option names are unique within their axis, under the eventual canonical name-normalization rules. Option order is preserved for authoring and deterministic presentation or export, but has no resolution or precedence semantics. The exact name grammar and ordering representation remain open.

Renaming an axis or option preserves its identity and all references. Copying an axis creates a new axis identity and new identities for all copied options; its copied default points to the corresponding new option. An option cannot move to another axis while retaining its identity.

Changing the default preserves axis, option, condition, and preset identities, but changes completion of omitted selections and is therefore a potentially broad semantic change. Adding an option does not automatically require every token to define a value for it; coverage requirements belong to validation profiles.

Removing a referenced option or axis is a project-scoped migration rather than an aggregate-local deletion. The operation must account for defaults, token assignment conditions, theme presets, and future variation constraints. It must not silently delete assignments, rewrite presets, or strip an axis from conditions: removing a selector may collapse distinct normalized conditions into duplicates or produce new ambiguities. A reviewed operation may select replacements, remove affected authored data explicitly, or cancel.

No closed built-in axis-kind enum is selected. Canonical relationships use stable identities rather than inferred meanings from names. If concrete validation, accessibility, or adapter workflows later require explicit standardized meanings, an optional semantic-role mechanism may be introduced without changing axis or option identity.

The initial axes, constraints between combinations, coverage requirements, exact persistence representation, and adapter-specific mappings remain open. Accessibility-related axes need precise meanings: contrast, forced colors, color-vision adaptations, typography, spacing, transparency, and motion must not be collapsed into an undifferentiated accessibility theme. Color-vision adaptations are reviewed authored decisions and do not establish that color alone can carry meaning.

### ThemePreset

**Working decision — 5 October 2026**

`ThemePreset` is a project-owned aggregate root that gives a stable identity and name to a reusable partial variation selection. It is an activation and authoring convenience, not a token-value owner or another theme tree.

```ts
type ThemePreset = {
  id: ThemePresetId;
  projectId: ProjectId;
  name: ThemePresetName;
  description?: string;
  selections: VariationSelection;
  extensions?: NamespacedExtensions;
};

type VariationSelection = readonly AxisOptionSelection[];
```

Each axis may occur at most once in a preset selection. Every referenced axis belongs to the same project, and every referenced option belongs to its stated axis. Entries normalize deterministically by axis identity; their stored order has no activation or precedence meaning. Preset names are unique within a project under the eventual canonical name-normalization rules.

A preset may omit any axis. To derive its complete active selection, begin with the explicit default option of every project axis, then replace the axes selected by the preset. An empty selection is therefore valid and represents a named use of all current axis defaults. The completed selection is derived rather than persisted. Adding an axis or changing the default of an omitted axis may change that derived result and is a potentially broad semantic change that impact diagnostics should expose.

Presets do not nest, inherit, extend, or canonically compose with one another. A combined preset explicitly stores the resulting flat partial selection. An authoring operation may apply temporary explicit selection overrides after a preset, but those overrides are activation state rather than part of the preset. Project-level variation constraints, when defined, validate the completed selection; the constraint model remains open.

There is no canonical `isDefault` preset flag. Axis defaults define the default complete selection. A currently active preset or preferred initial preset belongs to project, workspace, or user preference state rather than to token data or the semantic definition of `ThemePreset`.

Token assignment conditions reference axis and option identities, never a preset identity. Renaming or deleting a preset therefore does not change authored token values. Renaming a preset preserves its identity; changing its selections also preserves identity but may change consumers that reference it. Copying creates a new preset identity, and cross-project copying additionally requires reviewed mapping to new or existing axis and option identities. Removing a preset must explicitly handle preferences, export configurations, or other consumers that reference it, while leaving token assignments unchanged.

Two presets may validly derive the same complete selection because their names can express different authoring intent; tooling may report the duplication without treating it as invalid. Target selectors, media queries, mode names, filenames, and similar mappings belong to adapters or target configuration rather than canonical preset fields.

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

**Deferred abstraction — 5 October 2026**

Paint is a visual treatment applied to an area or stroke. It may provide a common conceptual home for:

```text
paint
├── solid → references or contains a color
└── gradient
    ├── kind
    ├── geometry
    └── ordered stops → colors + positions
```

`paint` is not part of the selected canonical token-type set. A solid authored value remains a `color`, and a gradient uses the `gradient` composite. A future paint abstraction should be introduced only if a concrete use case requires one common contract across solid, gradient, image, pattern, or other fills. Whether image or pattern fills belong in token scope remains unresolved.

### Gradient

**Established distinction; working composite decision**

A gradient is not a color. It is a composition of colors plus positions and geometry. Some targets represent gradients as reusable styles rather than variables or native tokens, so the canonical model must not pretend that every target can preserve a gradient as a token.

## Token sets and future packaging

**Working hypothesis**

A token set may group values for authoring, activation, theme composition, or interchange without determining canonical paths. A future token or design-system package may be a distributable artifact containing tokens, metadata, documentation, versions, and compatibility information. Packaging is not required by the initial canonical ownership model.

## Project and workspace

**Established direction**

A project is the primary working context and ownership boundary for authored work. Users create, open, or import a project before creating tokens.

```text
Project
├── Namespace groups and tokens
├── Component definitions
├── Variation axes
└── Theme presets
```

Every token, namespace group, component definition, variation axis, and theme preset belongs to exactly one project. This project ownership does not require one giant in-memory aggregate. A project may additionally own settings, import provenance, export-target configuration, compatibility reports, and generated-artifact metadata without embedding all of those concerns into the core Project entity.

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
