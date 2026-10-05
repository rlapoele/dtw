# Default Token Taxonomy

## Purpose

This is a default vocabulary for the workbench, not a claim that every design system must use one fixed hierarchy. It captures the established semantic-color direction and illustrates how broader taxonomy decisions should be made.

## Status

- The primitive, semantic, and component layers are an **established direction**.
- The semantic color families below are an **established vocabulary baseline**.
- Exact suffixes, state grammar, and non-color families remain **working hypotheses**.
- User configurability and extension rules are **open questions**.

## Naming model

**Working hypothesis**

Names should move from broad concept to specific intent:

```text
category.role.variant.state
```

Examples:

```text
color.content.primary
color.surface.elevated
color.border.subtle
color.accent.hover
button.primary.background.hover
```

Not every token needs every segment. Names should express intent rather than encode a target tool, a current primitive value, or an implementation technology.

Canonical paths are derived from namespace-group names plus the token's local name. Value type and primitive, semantic, or component layer remain explicit token properties rather than being inferred from those path segments.

## Primitive taxonomy

**Working hypothesis**

Primitive names may describe scales and measurable values:

```text
color.neutral.0
color.neutral.50
color.neutral.950
color.blue.600
dimension.0
dimension.1
dimension.2
duration.fast
```

Scale names are system-specific. Numeric steps must not falsely imply a mathematical relationship unless one exists.

## Semantic color vocabulary

**Established baseline**

```text
color
├── content
├── surface
├── border
├── accent
├── info
├── success
├── warning
└── danger
```

### Structural families

- `content` — foreground communication such as text, icons, and other legible marks.
- `surface` — backgrounds, layers, containers, and raised or inset areas.
- `border` — outlines, separators, dividers, and focus boundaries where appropriate.
- `accent` — brand emphasis, selection, interactive emphasis, or primary action treatment.

### Feedback and meaning families

- `info` — informational or neutral-notice meaning.
- `success` — successful, positive, or completed meaning.
- `warning` — caution, risk, or attention-needed meaning.
- `danger` — destructive, critical, or error meaning.

### Why there is no `status` group

**Established decision**

Do not insert a redundant `status` segment above `info`, `success`, `warning`, and `danger`.

Prefer:

```text
color.success.default
color.warning.subtle
color.danger.content
```

Avoid:

```text
color.status.success.default
color.status.warning.subtle
```

The four families already communicate their semantic category. Removing `status` shortens names and avoids a grouping node with little additional meaning.

This does not ban the ordinary word “status” from product or component names. A status-badge component, for example, may legitimately have component tokens.

## Variants and states

**Working hypothesis**

Useful variants may include concepts such as:

```text
primary
secondary
tertiary
default
subtle
strong
on-accent
disabled
```

Interactive states may include:

```text
hover
active
focus
selected
disabled
```

The project has not decided whether interactive state is always a final path segment, whether it may use conditional token values, or how to prevent combinatorial growth. Theme variability uses canonical [variation axes](./conceptual-model.md#themes-and-modes) and should not be duplicated in token names. Names such as `default` should be used only when their scope is unambiguous.

## Example semantic mappings

These examples demonstrate relationships; they are not prescribed values:

```text
color.content.primary    → {color.neutral.950}
color.content.secondary  → {color.neutral.700}
color.surface.default    → {color.neutral.0}
color.surface.subtle     → {color.neutral.50}
color.border.default     → {color.neutral.300}
color.accent.default     → {color.blue.600}
color.success.default    → {color.green.600}
color.warning.default    → {color.amber.600}
color.danger.default     → {color.red.600}
```

A theme preset should normally change conditional mappings through a variation selection, not semantic token names.

## Non-color semantic families

**Explored direction**

The broader taxonomy is expected to cover concerns such as:

```text
spacing
sizing
radius
border width
opacity
typography
shadow / elevation
motion
```

These words may denote semantic roles, purpose-specific token kinds, composite definitions, or convenience views. The conceptual model must decide that distinction before a definitive hierarchy is documented.

## Component taxonomy

**Working hypothesis**

Component paths may follow:

```text
component.variant.property.state
```

For example:

```text
button.primary.background.default
button.primary.background.hover
button.primary.label.default
input.default.border.focus
```

The component layer should encode stable decisions needed by consumers. It should not mirror an implementation's complete CSS or property tree.

## Taxonomy constraints to test

The future schema and editor should explore whether they can:

- distinguish a controlled default vocabulary from project-defined additions;
- attach descriptions and usage guidance to taxonomy nodes;
- validate names without forcing one organizational culture;
- migrate renamed roles while preserving identity and aliases;
- map target scopes without embedding target terminology in canonical names;
- prevent overlapping roles such as `accent`, `brand`, `action`, and `interactive` from becoming ambiguous.
