# Interoperability Model

## Purpose and confidence

Interoperability is a core product responsibility, not an afterthought. This document records the architectural direction and the Figma/Penpot findings established during inception and re-verified against public vendor documentation on 29 September 2026.

Third-party capabilities change. The findings below are a design baseline, not a permanent compatibility contract. Exact import/export behavior must be tested against the versions targeted by an implementation.

## Architecture

**Established direction**

```text
External source
      │
      ▼
Source importer ── parse + retain provenance
      │
      ▼
Normalization proposal ── ambiguity and loss review
      │
      ▼
Canonical tool-independent model
      │
      ├── canonical validation
      └── target compatibility validation
                              │
                              ▼
                        Export adapter
                              │
                              ▼
                         Target artifact
```

Imports and exports are not assumed to be perfect inverses. A target may not express every canonical concept, and imported data may not contain enough intent to reconstruct the preferred taxonomy automatically.

## DTCG's role

**Established direction**

Use the W3C Design Tokens Community Group format as the primary interoperability foundation where it fits: token values and types, groups, aliases, descriptions, and extensibility conventions.

DTCG is not yet selected as canonical persistence. The internal project may need additional information, and vendor claims of DTCG support do not guarantee identical interpretation or lossless round trips.

**Working decision**

Use the stable DTCG `2025.10` Format, Color, and Resolver modules as the current strict interchange baseline. The repository contains a pinned source snapshot at `docs/references/dtcg-2025.10/`. A later specification version must be adopted explicitly rather than silently changing validation behavior.

The strict baseline is a versioned compatibility profile, not the canonical project schema and not a promise that every first-party adapter will support every DTCG concept initially.

## Conformance and compatibility language

Do not use “DTCG-compatible” as an undifferentiated claim. Record at least four separate properties:

1. **Document conformance** — whether a file follows the selected DTCG version's syntax, type names, and value shapes.
2. **Processor coverage** — which valid constructs an importer or exporter actually accepts, emits, rejects, or ignores.
3. **Mapping coverage** — how canonical concepts map to a target's native concepts.
4. **Round-trip fidelity** — whether names, aliases, types, values, extensions, themes, and provenance survive export and re-import.

Each adapter should classify mappings rather than return a single yes/no result:

- **Native** — directly representable using a target's standard concept.
- **Native with constraints** — representable only for a documented subset.
- **Extension-backed** — requires namespaced target metadata.
- **Transformed** — exported by changing shape or splitting/combining concepts.
- **Alternate artifact** — represented as a style or generated resource rather than a native token.
- **Unsupported** — cannot be represented safely.
- **Round-trip risk** — can be exported, but a later import may not recover canonical intent.

## Required profile separation

**Established direction**

Treat these as separate profile families with independently versioned fixtures and adapters:

| Profile | Purpose | Constraint |
|---|---|---|
| `dtcg-2025.10` | Strict standards-based interchange | Must not accept or emit vendor dialects as though they were conforming DTCG |
| `figma-native` | Figma variables, modes, scopes, and `com.figma.*` extensions | Must declare the tested Figma behavior or version and report the supported DTCG subset |
| `penpot-native` | Penpot token sets, themes, expressions, purpose-specific types, and file envelope | Must not be labeled strict DTCG without an explicit normalization step |

Shared parsing utilities are appropriate where the formats overlap. Sharing code must not erase the profile boundaries or weaken strict validation.

## Figma findings

**Established research finding, subject to continued version verification**

Figma uses a relatively small set of variable value types—color, number, string, boolean, timing, and easing—and applies scopes to give variables purposes such as gap, size, radius, font size, or opacity.

Key implications:

- semantic aliases align well with primitive → semantic → component relationships when variable types are compatible;
- collections and modes can represent theme-like variation;
- a color variable can include alpha;
- a numeric variable may represent different canonical roles through Figma scopes;
- composed visual treatments such as gradients, typography compositions, and multiple shadows often map to styles rather than single variables;
- gradient stops may reference colors even when the gradient itself is a style;
- native import accepts only a constrained DTCG subset: documented limitations include sRGB or HSL color, `px` dimensions, `s` durations, a single font-family string, and number tokens;
- Figma also accepts a non-standard string token and uses `com.figma.*` extensions for concepts such as boolean variables and cross-collection aliases;
- valid DTCG constructs outside that subset, including other color spaces, `rem`, font-family arrays, and composite types, cannot be assumed to import;
- native export is JSON over Figma variables and modes; vendor claims of DTCG alignment do not establish full processor coverage or lossless round trips;
- names may be normalized and unsupported or duplicate tokens may be omitted during import.

The important conceptual distinction is:

```text
Figma variable = reusable individual value
Figma style    = reusable composition of visual properties
```

This supports, but does not dictate, the canonical separation between value, role, and composition.

## Penpot findings

**Established research finding, subject to continued version verification**

Penpot exposes a broader set of purpose-specific token types, including color, dimension, number, opacity, rotation, sizing, spacing, border radius, border width, font-related types, typography, and shadow.

Key implications:

- Penpot's taxonomy encodes more semantic purpose in token types than Figma's broad type-plus-scope model;
- aliases, sets, and themes align with layered and themed token systems;
- import can accept JSON and structured multi-file or ZIP representations;
- its model is DTCG-inspired, but its documented native exchange is not strict DTCG `2025.10`;
- its single-file envelope uses top-level sets plus `$themes` and `$metadata`, while its multi-file form uses separate theme and metadata files; neither is the DTCG `2025.10` Resolver document model;
- purpose-specific types such as spacing, sizing, opacity, border radius, and font-related types require explicit mapping to DTCG value types and semantic metadata;
- documented native values include legacy shapes such as hex color strings, unit-bearing or numeric strings, and expressions rather than the stable DTCG value objects;
- expressions have no equivalent in the DTCG `2025.10` Format Module and must be preserved as source syntax, evaluated under an explicit policy, or reported as unsupported;
- color values can include alpha;
- no native gradient token type was identified in the inception research;
- a strict DTCG import therefore requires a Penpot-specific normalization step, and a Penpot export requires a target-specific adapter before use by a strict DTCG consumer;
- documented alignment must not be treated as proof of conformance or extension preservation without fixtures for the chosen Penpot version.

## Comparative mapping baseline

| Canonical concept | DTCG `2025.10` | Figma native | Penpot native | Main concern |
|---|---|---|---|---|
| Color value | Structured `colorSpace` and `components` object | Color variable; documented import limited to sRGB and HSL | Color token commonly exchanged as a color string | Value-shape conversion and color-space loss |
| Color alpha | Part of color | Part of Color | Part of Color | Do not confuse with layer opacity |
| Number | `number` | Number variable | Number token | Role may be lost without metadata |
| Dimension | Object with `value` and `px` or `rem` unit | Number + scope; documented import requires `px` | Dimension and purpose-specific numeric tokens | Unit and string/object conversion |
| Spacing | Dimension plus semantic metadata/convention | Number + gap scope | Spacing token | Canonical role vs target type |
| Sizing | Dimension plus semantic metadata/convention | Number + size scope | Sizing token | Canonical role vs target type |
| Radius | Dimension plus semantic metadata/convention | Number + radius scope | Border Radius token | Per-corner composition may differ |
| Layer opacity | Number/role mapping to determine | Number + opacity scope | Opacity token | Distinct from color alpha |
| Alias | Curly-brace token reference and JSON Pointer rules | Same-type variable alias; cross-collection metadata may require extension | Curly-brace token alias and expressions | Required syntax, preservation, and error handling |
| Theme | Separate Resolver document with sets, modifiers, and resolution order | Collections and modes, commonly exchanged as files per mode | Native sets, theme groups, `$themes`, and `$metadata` | No direct structural equivalence |
| Typography | `typography` composite with defined singular property names and value shapes | Variables feeding a text style | Typography token with native property/value conventions | Partial decomposition and shape conversion |
| Shadow/effect | `shadow` composite | Variables feeding effect styles | Shadow token | Multiple effects and target limits |
| Gradient/paint | `gradient` composite; no general paint type | Fill style; colors may be variables | No native gradient token found | Alternate artifacts and loss |

This table describes mapping direction, not final schemas.

## Import requirements

**Established direction**

An importer should:

1. identify the source profile and version before interpreting vendor-shaped data;
2. validate strict DTCG independently from permissive vendor profiles;
3. parse without silently discarding unknown data;
4. preserve the original source or sufficient raw provenance for review and reprocessing;
5. preserve source names and namespaced metadata where the target profile permits it;
6. distinguish source value type from inferred semantic role;
7. propose layer and taxonomy mappings with confidence;
8. report references, expressions, themes, ignored tokens, unsupported constructs, and normalization loss;
9. require review where normalization changes meaning.

## Export requirements

**Established direction**

An exporter should:

1. validate the canonical model;
2. validate the selected target profile;
3. name the emitted profile and tested version in its report;
4. transform through a versioned adapter;
5. emit deterministic output;
6. keep vendor data inside valid namespaced extensions when emitting strict DTCG;
7. report omissions, coercions, flattening, extension use, and alternate artifacts;
8. make generated output distinguishable from authored canonical data.

## Round-trip strategy

**Working hypothesis**

Round-trip fidelity may improve if the workbench stores provenance and adapter-owned metadata, but exact vendor re-creation should not compromise the canonical ontology. Test fixtures should cover:

- canonical → target → canonical;
- target → canonical → same target;
- target A → canonical → target B;
- curly-brace aliases, JSON Pointer references, missing targets, and cycles;
- unknown `$extensions` and extension preservation;
- DTCG Resolver documents, Figma modes, and Penpot sets/themes as distinct fixtures;
- alpha versus opacity;
- sRGB and at least one wide-gamut color space;
- `px` and `rem` dimensions;
- single and fallback-list font families;
- typography, shadows, and gradients;
- vendor expressions, purpose-specific types, ignored tokens, and unsupported constructs.

Passing a target round trip does not establish cross-target compatibility. Each direction and profile pair needs its own expected-loss assertions.

## Verification sources

The current baseline is grounded in:

- the pinned local DTCG `2025.10` source under `docs/references/dtcg-2025.10/`;
- the official [DTCG Format](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/), [Color](https://www.w3.org/community/reports/design-tokens/CG-FINAL-color-20251028/), and [Resolver](https://www.w3.org/community/reports/design-tokens/CG-FINAL-resolver-20251028/) reports;
- Figma's official [variable mode import/export documentation](https://help.figma.com/hc/en-us/articles/15343816063383-Modes-for-variables);
- Penpot's official [design-token and import/export documentation](https://help.penpot.app/user-guide/design-systems/design-tokens/).

Vendor documentation is evidence of intended behavior, not a substitute for adapter fixtures against the exact product versions selected for support.

## Additional targets

**Future direction**

CSS custom properties, JavaScript/TypeScript modules, Style Dictionary-like pipelines, Tailwind-oriented output, Sketch, platform-native code, and documentation artifacts are plausible adapters. None is committed, and each needs its own capability profile rather than being grouped under a generic “code export.”
