# Interoperability Model

## Purpose and confidence

Interoperability is a core product responsibility, not an afterthought. This document records the architectural direction and the Figma, Penpot, and Style Dictionary findings established during inception and re-verified against public vendor documentation and source on 29 September 2026.

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
| `style-dictionary-5.5.5` | Style Dictionary input processing, legacy conversion helpers, and generated platform artifacts | Must not treat successful processing or DTCG-shaped output as proof of DTCG `2025.10` conformance |

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

## Style Dictionary findings

**Established research finding for Style Dictionary `5.5.5`, subject to continued version verification**

Style Dictionary is primarily a build and transformation pipeline rather than a native token-authoring format. It can consume token data and generate CSS, Sass, JavaScript, Android, iOS, and other target artifacts. Since version 4 it has recognized the DTCG property envelope, but its own documentation states that the stable DTCG `2025.10` specification is not yet fully supported.

Key implications:

- input processing auto-detects `$value` and `$type`, delegates inherited group `$type` values to tokens, and supports conventional curly-brace aliases;
- one Style Dictionary instance must use either legacy Style Dictionary syntax or DTCG syntax; the two must not be mixed and accepted input is not evidence of document conformance;
- the `2025.10` implementation tracker records color, dimension, border, and shadow work as complete, while gradient color handling and object-form duration support remain incomplete and Resolver Module support remains outstanding;
- the `5.5.5` reference-processing implementation does not provide the complete DTCG `2025.10` behavior for JSON Pointer `$ref`, group `$extends`, or `$root` group-reference semantics;
- `convertToDTCG`, `convertJSONToDTCG`, and `convertZIPToDTCG` convert legacy property names and can consolidate common types on groups, but they do not make legacy type names or value shapes conforming;
- for example, the conversion helper does not change a legacy `size` type to `dimension`, a hex color string into the required structured color value, or a unit-bearing string into a DTCG dimension object;
- the generic `json` output is a serialization of the processed dictionary, not a dedicated DTCG preservation writer; the transformation pipeline flattens and reconstructs token data, so preservation of group-level metadata and unknown extensions must not be assumed;
- Style Dictionary is not a strict DTCG validator and does not provide a general DTCG-to-DTCG round-trip guarantee;
- generated CSS or platform code is an intentional target transformation, not a DTCG document and therefore should be judged against its target profile rather than DTCG document conformance.

The appropriate product boundary is:

```text
canonical model
      │
      ├── strict DTCG exporter ──► conforming DTCG document
      │
      └── Style Dictionary adapter ──► generated platform artifacts
```

Style Dictionary may be a useful implementation dependency behind a versioned export adapter. It must not become the canonical model, the strict DTCG validator, or an implicit migration authority.

## Tool-support classification

| Profile | Reads DTCG | Writes DTCG | Conformance assessment | Appropriate use |
|---|---|---|---|---|
| `figma-native` | Documented subset of atomic tokens | Native variable/mode JSON with vendor behavior and extensions | Partial processor and mapping coverage | Exchange with Figma variables and modes |
| `penpot-native` | DTCG-inspired native dialect through Penpot-specific envelopes and value shapes | Penpot token sets/themes dialect | Not strict DTCG `2025.10` without normalization | Exchange with Penpot sets and themes |
| `style-dictionary-5.5.5` | DTCG property envelope and a useful subset of `2025.10` values and aliases | Conversion helpers emit DTCG-shaped JSON; generic JSON output is processed data | Partial processor coverage; no conformance or preservation guarantee | Compile validated generated input into code and platform artifacts |

These profiles solve different problems. Figma and Penpot adapters translate native design-tool concepts. A Style Dictionary adapter feeds a build processor. None should weaken or replace the strict `dtcg-2025.10` profile.

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
| Variation axes and theme presets | Separate Resolver document with sets, modifiers, and resolution order | Collections and modes, commonly exchanged as files per mode | Native sets, theme groups, `$themes`, and `$metadata` | No direct structural equivalence; combinations may require flattening |
| Typography | `typography` composite with defined singular property names and value shapes | Variables feeding a text style | Typography token with native property/value conventions | Partial decomposition and shape conversion |
| Shadow/effect | `shadow` composite | Variables feeding effect styles | Shadow token | Multiple effects and target limits |
| Gradient/paint | `gradient` composite; no general paint type | Fill style; colors may be variables | No native gradient token found | Alternate artifacts and loss |

This table describes mapping direction, not final schemas.

Canonical variation axes remain independent even when a target cannot preserve that structure. An adapter may flatten a selection such as dark plus high contrast into a target mode, set, file, selector, or other artifact. It must make the generated combinations and naming policy deterministic and diagnose unsupported combinations, ambiguity, omitted coverage, and structural loss.

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

Imported structural groups normalize into the canonical single-parent namespace hierarchy; external sets, tags, or activation units must not silently become path-forming groups. When a source such as strict DTCG inherits `$type` from a group, the importer resolves and stores the effective explicit type on each canonical token. It may retain the source declaration as provenance, but inherited source structure does not make canonical token type dependent on containment.

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

Exporters derive target paths from the canonical namespace hierarchy. A profile may consolidate repeated explicit token types into group-level declarations such as DTCG `$type` when that transformation is valid and deterministic. Export optimization must not change canonical authorship or make re-imported token types ambiguous.

## Initial modeling targets and expressions

**Working decision — 1 October 2026**

Use CSS and strict DTCG `2025.10` as the first concrete cases for testing canonical modeling choices. This does not select which adapter is implemented first or settle its supported subset. Fixtures should compare authored values, references, expected output, and compatibility diagnostics rather than assume universal cross-target coverage.

The canonical model's [expression direction](./conceptual-model.md#expressions) goes beyond strict DTCG values. The DTCG `2025.10` Format Module has no generic expression value type; its [dimension definition](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#dimension) requires a numeric value and `px` or `rem` unit. A CSS function string is therefore not a conforming dimension `$value`.

An exporter must distinguish:

- expression emission supported by a named CSS target profile;
- deterministic context-free evaluation into a valid target value, with a transformation diagnostic;
- context-dependent evaluation or an author-approved fallback under an explicit policy;
- unsupported expressions that cannot be represented safely.

Namespaced [DTCG extensions](https://www.w3.org/community/reports/design-tokens/CG-FINAL-format-20251028/#extensions) may preserve optional expression metadata alongside a valid standard value. They do not make an invalid `$value` conforming or guarantee that another tool can reconstruct the expression. Exact fallback, blocking, and extension policies remain unresolved. A preview measurement must not become an export fallback implicitly.

Scale helpers create ordinary tokens; their generation recipes are not required to export those tokens. Do not confuse accepted tokens produced by a helper with generated target artifacts: the former become authored canonical data, while the latter remain derived output.

## Color representation and fallback boundary

**Established direction — 2 October 2026**

Export from the authoritative [authored color](./conceptual-model.md#authored-color-and-alternative-representations), not from a currently selected picker notation, rounded display text, or preview approximation. Preserve the authored color space/model where the target profile supports it; conversions and gamut approximations require explicit policies and compatibility diagnostics.

The [DTCG `2025.10` Color Module](https://www.w3.org/community/reports/design-tokens/CG-FINAL-color-20251028/#format) specifies a primary `colorSpace` and `components`, optional alpha, and an optional six-digit HEX fallback. The fallback's alpha is supplied separately by the color value. This supports interchange of a primary color and fallback; it does not select our canonical schema, require a stored fallback for every token, or establish that every fallback is exactly equivalent to its primary color.

Canonical fallback ownership, automatic generation, gamut-mapping algorithms, precision, and target emission policies remain open. A fallback must not become an independently authoritative copy or silently overwrite the primary value on re-import. Fixtures should test conversion loss and fallback handling separately from theme variants and equivalent display representations.

## Round-trip strategy

**Working hypothesis**

Round-trip fidelity may improve if the workbench stores provenance and adapter-owned metadata, but exact vendor re-creation should not compromise the canonical ontology. Test fixtures should cover:

- canonical → target → canonical;
- target → canonical → same target;
- target A → canonical → target B;
- curly-brace aliases, JSON Pointer references, missing targets, and cycles;
- unknown `$extensions` and extension preservation;
- DTCG Resolver documents, Figma modes, and Penpot sets/themes as distinct fixtures;
- Style Dictionary `5.5.5` input, legacy conversion, generic JSON output, and selected platform outputs as distinct fixtures;
- `$root`, `$extends`, JSON Pointer `$ref`, group metadata, and unknown extensions through the Style Dictionary pipeline;
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
- Penpot's official [design-token and import/export documentation](https://help.penpot.app/user-guide/design-systems/design-tokens/);
- Style Dictionary's official [DTCG support overview](https://styledictionary.com/info/dtcg/), [DTCG conversion utilities](https://styledictionary.com/reference/utils/dtcg/), [built-in formats](https://styledictionary.com/reference/hooks/formats/predefined/), and [DTCG `2025.10` implementation tracker](https://github.com/style-dictionary/style-dictionary/issues/1590);
- the published Style Dictionary `5.5.5` source for [legacy conversion](https://github.com/style-dictionary/style-dictionary/blob/v5.5.5/lib/utils/convertToDTCG.js), [reference resolution](https://github.com/style-dictionary/style-dictionary/blob/v5.5.5/lib/utils/references/resolveReferencesMap.js), [token flattening](https://github.com/style-dictionary/style-dictionary/blob/v5.5.5/lib/utils/flattenTokens.js), and the [processing pipeline](https://github.com/style-dictionary/style-dictionary/blob/v5.5.5/lib/StyleDictionary.js).

Vendor and project documentation is evidence of intended behavior, not a substitute for adapter fixtures against the exact product or package versions selected for support.

## Additional targets

**Future direction**

Style Dictionary `5.5.5` is an established research target but not yet a committed implementation dependency or adapter. CSS is now an initial modeling target as described above, but its implementation and coverage are not selected. JavaScript/TypeScript modules, other build pipelines, Tailwind-oriented output, Sketch, platform-native code, and documentation artifacts remain plausible additional targets. Each needs its own capability profile rather than being grouped under a generic “code export.”
