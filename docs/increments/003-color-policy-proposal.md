# Increment 003: color-policy proposal

- Status: **Proposed — not agreed**; prepared by the separate analyst on 5 November 2026.
- Parent: [Increment 003](003-visible-color-authoring.md), especially [V4 review finding 1](003-visible-color-authoring.md#1-before-agreement-reconcile-d2ac-3-with-requested-conversion-and-preview-ux).
- Authorization: prepare this proposal. UX/UI changes will be captured separately before final implementation agreement. This document does not amend agreed D2, select a production dependency, accept V4 as final design, or authorize implementation.

## Recommendation for user review

Keep V4's ability to edit sRGB on a 0–255 scale, convert a literal draft between the five supported spaces, and show a bounded approximate specimen. Give those capabilities an explicit numerical contract:

| Concern | Recommended policy | Consequence for the author |
| --- | --- | --- |
| Direct component entry | Preserve exact canonical Decimal values; use the existing constructor and range rules. | Long decimals, `none`, extended RGB and alpha retain their meaning. |
| sRGB 0–255 entry | Divide edited channels by 255 using decimal arithmetic; keep terminating results exact, otherwise round to 18 significant digits, ties to even. | Fractional and extended entries work; repeating ratios are explicitly approximate. |
| Space conversion | Generate an approximate candidate with 12 significant digits per calculated component, ties to even; retain alpha exactly. | Conversion changes the draft, with the new space/value committed only by Apply. |
| Missing and powerless components | Convert a missing hue only at exactly zero saturation/chroma. Preserve all other missing components and explain why conversion is unavailable. Do not automatically erase small nonzero chroma. | No missing component silently becomes zero, and near-neutral colors retain authored distinctions. |
| Extended values and failures | Never gamut-map or clamp authored candidates. Reject conversion when the target canonical schema or the bounded calculation service cannot represent it. | The current space, values and drafts survive a failed conversion. Exact editing remains available. |
| Specimens | Render numeric in-range sRGB, or an approximate conversion to it; withhold unsupported/out-of-gamut previews. | Specimen failure does not invalidate an otherwise valid authored color. |

**Reason for the precision choices:** 18 significant digits make decimal byte division independent of binary floating point. General color transforms are approximate; 12 significant digits give room for binary calculation noise while preserving very small nonzero magnitudes. Neither count claims that the algorithms have that many accurate digits. Their accuracy is a separate verification gate below. These are recommended engineering defaults for this bounded operation, not a global Decimal precision setting.

The user decision is whether to accept this behavior bundle, including explicit approximation and bounded refusal. The analyst recommends it. Numerical fixture validation and candidate-library evaluation are engineering work; the user should not have to choose tolerances or library internals.

## Boundaries retained

The [exact color model](../design-tokens/conceptual-model.md#color-literals) and [authored/derived distinction](../design-tokens/conceptual-model.md#authored-color-and-alternative-representations) remain authoritative. One authored literal has one space, three components and explicit alpha. Aliases remain relationships; switching editor mode, inspecting a converted representation or previewing a resolved alias never flattens one into a literal.

Included calculations are sRGB entry-scale adaptation and literal conversion among `srgb`, `display-p3`, `hsl`, `oklab`, and `oklch`. Same-space requests are identity operations. Excluded are HEX/pickers, interpolation/mixing, lightness adjustments, ramps, color expressions, automatic fallbacks, gamut mapping and target compatibility. No persistence representation changes.

The proposal concerns numerical behavior. The control that triggers conversion, disclosure placement and other UX/UI changes return through the designer/user/analyst loop before final agreement. The existing missing-state supplement, D4 renderer/milestone decision and final implementation authorization remain pending.

## Exact editing and entry-scale adaptation

1. Use the existing canonical Decimal grammar and color constructor. Do not route direct normalized entry through `Number`, browser CSS parsing or a library serializer. Noncanonical/incomplete text remains a correctable delivery draft and cannot be submitted as a valid literal. Existing exact modulo-360 hue normalization remains visible after successful submission.
2. Selecting 0–255 versus normalized entry is display-only. It must not dirty the literal or replace any exact normalized coordinate. Calculate derived byte coordinates by exact multiplication by 255, then display at most 12 significant digits, ties to even, without exponent or negative zero. Indicate that a shortened derived value is approximate. Raw byte text being edited stays visible until accepted/discarded under the agreed form behavior.
3. A deliberate byte edit affects only that channel: exact decimal division by 255, retaining the exact terminating quotient where possible; otherwise round once to 18 significant digits, ties to even. Trim trailing fractional zeros and expand exponents for canonical output. Negative and greater-than-255 values remain extended sRGB coordinates; fractional bytes are permitted. `none` stays `none`. Untouched channels and alpha stay exact.
4. An entry-scale toggle followed by an unchanged submission of a shortened displayed byte value must not count as a channel edit. Track the original coordinate and actual input edits rather than reparsing all displayed fields on Apply. Replacing a field with newly typed text, even if it looks identical, is an explicit edit.
5. Incomplete/invalid byte text blocks Apply and representation/conversion requests that would discard that text. Explain the issue and preserve both raw text and the underlying draft; do not apply an older normalized value in its place.

## Space conversion and rounding

Conversion is a pure candidate calculation, with the current literal and a target space as input. It does not write the project. Repeated requests in an unchanged target space are no-ops and return the exact input, including numeric powerless hue and alpha. Each successful change of space uses the current candidate as its source; this is deliberately allowed to accumulate approximation. A round trip is not undo and need not restore source text. Cancel returns to the applied baseline under the agreed draft rules.

Use a fixed, documented algorithm/version: extended sRGB/Display P3 transfer functions and D65-based transforms, HSL as an sRGB model, and OKLAB/OKLCH rectangular/polar transforms. The [CSS Color 4 conversion sections and sample code](https://www.w3.org/TR/2026/CRD-css-color-4-20261103/#color-conversion-code), checked 5 November 2026, are reference material for equations and fixtures. That document is a Candidate Recommendation Draft; its sample code is informative. It is not adopted as the canonical schema, CSS parser behavior, or a blanket conformance promise.

For calculated numeric components, round to 12 significant decimal digits with ties to even, then serialize to canonical non-exponent Decimal. Specify rounding over the shortest round-tripping decimal text of each finite binary calculation result; do not inherit `toFixed` rounding or round at every intermediate matrix step. Strip negative zero. Run the resulting complete candidate through the existing constructor after rounding: hue normalization therefore also handles a rounded `360` as `0`. Retain the original alpha text, even at alpha zero; never premultiply components for this conversion.

Long exact source coordinates may lose low-order digits in a deliberate conversion; this is disclosed as a newly calculated candidate. Same-space requests, entry-scale inspection and previews cannot cause that loss. Fixed fractional rounding is rejected: the prototype's 12 fractional places turn a nonzero byte edit `0.000000000001 / 255` into zero, while significant-digit rounding preserves its magnitude.

### Missing components and near-neutral colors

- Same-space requests preserve every `none` without calculation.
- Cross-space conversion accepts fully numeric components, plus one narrow missing-hue case: HSL `[none, 0, L]` or OKLCH `[L, 0, none]`. For that case only, the domain may use zero internally for the irrelevant hue and produces the mathematically neutral result. This is an operation-local equivalence, never a rewrite of the source literal.
- Other missing components block conversion, including missing hue at nonzero saturation/chroma. Preview uses the same eligibility rule. No general CSS missing-component interpolation semantics are introduced.
- Detect exact neutral source cases using exact input values: equal numeric RGB channels, HSL saturation zero or lightness exactly 0/100, OKLAB axes both zero, or OKLCH chroma zero. Where target neutrality is representable, give HSL zero saturation and `none` hue; OKLCH zero chroma and `none` hue; OKLAB zero axes; RGB equal channels. This prevents matrix residue from manufacturing a chromatic hue for exact neutral input. Neutral RGB outside the destination schema's allowed lightness range still fails validation.
- For other sources, retain computed nonzero chroma and numeric hue, even if tiny. Do not inherit a library's near-neutral threshold. If an intermediate calculation collapses a distinction needed to form a valid result, refuse rather than invent a hue. This does not promise preservation of arbitrarily small differences through floating-point arithmetic.
- A numeric powerless source hue survives identity/direct editing. A cross-space round trip can lose that original hue; it cannot be recovered from a neutral color and is not reconstructed.

### Bounded calculation and target failures

Recommended initial calculation guards, subject to the fixture gate: each numeric component sent through a cross-space transform must have absolute magnitude zero or between `1e-100` and `1e6`, inclusive, and at most 4,096 text characters before conversion. Normalize hue by the existing constructor before checking. Apply these guards to intermediate/final results too; reject non-finite results, nonzero underflow, excess output length or a target-schema violation. Alpha is copied exactly and does not pass through the numerical transform. These conservative service limits cover ordinary and extended editing without treating every finite Decimal as a safe floating-point calculation.

For exact byte arithmetic/derived multiplication, use the 4,096-character input guard and a 4,200-character output budget, without the binary magnitude guard. Check budgets before allocating large powers/expanded output. An unsupported byte representation does not change its normalized source.

These are **operation limits**, not new canonical literal limits or a global solution to Decimal resource constraints. Exact direct editing and identity operations retain existing domain behavior outside them. A stricter project-wide input budget would require its own explicit decision.

After rounding and constructor validation, a bounded HSL/OKLAB/OKLCH conversion may still be unavailable for an extended RGB source. For example, no promise is made that all extended RGB values have valid HSL saturation/lightness or OKLAB lightness in the chosen schema. Explain the target constraint; do not clamp it. No authored boundary epsilon is allowed. A numerically noisy result that still fails the constructor is a failed conversion, not permission to snap it silently into range. Common boundary fixtures must succeed through a verified algorithm/rounding path or the policy must return for revision.

Failures return a distinguishable reason: invalid input, unsupported missing components, calculation limit, numerical failure, or target-schema incompatibility. Prior source/draft/applied data remain intact. No production diagnostic payload is selected by these descriptive categories.

## Preview policy

Preview is a disposable rendering calculation outside the domain; it may reuse the verified conversion kernel but cannot write its output into authored fields. Use explicit sRGB CSS serialization, never a general library serializer with hidden gamut mapping. Direct sRGB gamut checks compare exact Decimal values to 0 and 1, so `1.000000000001` is outside even if binary conversion or formatting would round it to 1.

For other eligible spaces, use raw converted sRGB coordinates. Recommend an absolute boundary-noise allowance of `1e-10` per channel for preview only: within `[-1e-10, 1 + 1e-10]`, snap display-only overshoots to the nearest boundary; beyond it, withhold the specimen. Label successful cross-space previews approximate. This is an engineering proposal requiring boundary fixtures, not a perceptual tolerance, target compatibility test or proof of exact gamut membership. If the allowance cannot be justified by observed conversion error, revise it rather than widen it until tests pass.

Unavailable preview reasons distinguish invalid/incomplete text, unsupported missing components, calculation limits/failure, unresolved value and outside the bounded sRGB preview gamut. Authored extended RGB remains valid. Show exact text and the explanation; no browser-selected gamut-mapped fallback is substituted. Preview at alpha zero still retains underlying channels and alpha; a checkerboard is only a visual aid. Monitor, browser and color management can affect appearance; this slice promises an illustrative specimen, not display calibration or exact cross-device reproduction.

## Domain/application boundary and library evaluation

The [architecture](../project/architecture.md#domain-engine) already puts deterministic authored conversion in the portable domain. Implementing this proposal would add only pure literal conversion and sRGB byte-entry candidate calculations with explicit policy/version and failure results. The application continues to validate/commit accepted edits through existing operations; delivery code owns incomplete text, draft mode and specimen rendering. No token is mutated by a calculation. No registry, generic plugin interface, color-expression family or package split is warranted.

**Candidate, not selected:** evaluate Color.js `0.7.1`, already isolated in the prototype, as a local calculation dependency behind that boundary. Its [supported spaces](https://colorjs.io/docs/spaces) cover the required models, with canonical `display-p3` mapped locally to library `p3`. Its [gamut documentation](https://colorjs.io/docs/gamut-mapping), checked 5 November 2026, distinguishes coordinate conversion from lossy gamut mapping and notes serializer defaults. Do not use `.toGamut()` or default `.toString()` for authored candidates.

Local installed-source/runtime inspection found a consequential default: conversion to OKLCH uses a near-achromatic rectangular-axis test and can replace nonzero chroma with zero/hue `null`. This differs from the proposed policy. For example, source sRGB `[0.000000000000001, 0, 0]` converts through installed Color.js directly to OKLCH chroma `0`, hue `null`; converting to OKLAB and computing raw polar coordinates gives approximately chroma `0.000001098159548534976`, hue `29.23388027962786` degrees.

Recommendation: evaluate a narrow route using the library for verified rectangular transforms and explicit raw OKLAB↔OKLCH polar formulas under project policy, rather than accepting that hidden threshold or forking its global registry. The candidate is acceptable only if all routes preserve the policy, host independence and numerical fixtures. Confirm exact installed version/provenance, license, dependency/bundle effects and compatibility during technical preparation. No claim is made that `0.7.1` is the latest release. If the candidate cannot satisfy the gate, bring back a bounded alternative and its cost; do not silently replace these policies with library behavior.

## Representative fixtures and verification gate

The following are **proposed expected behavior** unless marked measured. They specify acceptance work for an eventual implementation, not passing tests today.

| Fixture | Expected result/evidence |
| --- | --- |
| Direct sRGB channel `0.123456789123456789123456789`, long alpha, plus `none` | Exact readback after allowed submission; unchanged after entry-scale inspection, preview and identity conversion. |
| Byte `127.5`, `510`, `-255` | Exactly `0.5`, `2`, `-1`; no integer rounding or clipping. |
| Byte `1`, `30`, `128`, `250`, `254` | Respectively `0.00392156862745098039`, `0.117647058823529412`, `0.50196078431372549`, `0.980392156862745098`, `0.99607843137254902` under 18-significant-digit ties-to-even policy. |
| Byte `0.000000000001` | `0.00000000000000392156862745098039`, not zero. |
| Decimal rounding unit fixtures | Exercise positive/negative halfway cases, carry across powers of ten, exponent expansion, negative zero and terminating exact quotients separately from color equations. |
| sRGB red `[1, 0, 0]` → HSL | `[0, 100, 50]`, alpha exactly copied. |
| sRGB red → P3 / OKLAB / OKLCH | Compare independent reference values and the measured candidate observations below; validate canonical candidates after formatting. |
| All 25 space pairs | Cover same-space exact identity plus 20 directed conversions with interior, boundary, extended and near-neutral samples. No one-sample universal-accuracy claim. |
| Gray/black/white; numeric/missing powerless hue | Neutral target components as specified; no invented chroma/hue; original numeric hue survives a no-op. |
| Tiny red; OKLCH nonzero chroma `0.000000000000001` | No threshold-induced neutralization in authored conversions; verify raw route and numerical limits. |
| `none` in every position; incomplete `-`, `0.`, invalid `1e2` | Preserve source/text; only the two exactly powerless missing-hue forms are convertible. |
| Alpha `0`, `1`, long exact ratio | No premultiplication, erasure or binary readback of alpha; color calculations independent of it. |
| P3 green `[0, 1, 0]` → sRGB | Extended channels remain; unavailable sRGB preview; no clipping or gamut mapping. |
| Direct sRGB `1.000000000001`; converted boundary overshoots | First withholds preview by exact comparison. Converted values inside/outside the proposed `1e-10` preview allowance test both sides without changing the source. |
| Hue rounds to `360`; negative/large entered hue | Constructor normalizes final hue; no invalid `360` candidate and no binary normalization of directly authored hue. |
| Target invalid after conversion/rounding; over-limit input/result; non-finite stub | Distinct failure; no changed space, field, token or success claim. Canonical exact editing outside calculation limits remains possible. |
| Repeated round trip, 100 cycles | Measure drift on ordinary bounded fixtures, report it, and compare against the cumulative bound below; never expect original decimal text. |

**Measured on 5 November 2026:** read-only Node probes of installed Color.js `0.7.1` gave the following raw floating-point coordinates. These are observations of a candidate, not independent accuracy or accepted canonical-output oracles:

```text
sRGB red → P3:     [0.9174875573251656, 0.20028680774084717, 0.13856059121111408]
sRGB red → OKLAB:  [0.6279553639214311, 0.2248630684262744, 0.125846277330585]
sRGB red → OKLCH:  [0.6279553639214311, 0.2576833038053608, 29.23388027962784]
P3 green → sRGB:   [-0.5116049825853448, 1.0182656579378029, -0.3106746212905826]
```

Python Decimal arithmetic with precision 18 and `ROUND_HALF_EVEN` independently reproduced the byte results above (trailing zeros normalized in the table). The existing isolated prototype `npm test` passes all eight helper tests; these verify its older policies, not this proposal. Project-owned local file links and the scoped Markdown diff were checked. No new production code or calculation implementation exists yet; no browser, root regression or cross-runtime policy validation is claimed.

Recommended engineering gate before claiming this policy implemented:

1. Freeze the equations/constants and operation policy identity, and record independent expected fixtures from the dated CSS reference or a separately checked high-precision calculation. Comparing only against the same library does not validate it.
2. Verify decimal byte results and formatter outputs exactly. Test general conversion numerically: for ordinary fixtures with RGB coordinates in `[-1, 2]`, compare after conversion to a common sRGB basis, proposing maximum absolute channel error `1e-8` per directed conversion and `1e-6` over 100 round trips. Check OKLAB components within `1e-8`; compare chromatic hue with a wrapped angular bound `1e-5` degrees when chroma is at least `1e-4`. These are proposed validation thresholds, not measured accuracy or universal bounds over every accepted magnitude. Below that chroma, compare rectangular coordinates rather than unstable angle. Test tiny/large calculation-domain limits and cancellation separately; published service guards alone do not establish accuracy throughout that domain.
3. Prove exact-neutral and tiny-nonzero behavior, target validation, failure atomicity, and preview boundary checks independently. The preview `1e-10` allowance must be supported by measured boundary residue, even though broader transform tests permit `1e-8` error.
4. Record runtime/package versions and cross-runtime fixture results for Node and the supported browser. Decimal arithmetic/formatting must be exact; general transforms have a versioned algorithm and bounded numerical equivalence, not an unverified promise of byte-identical transcendental results across all JavaScript engines. Material differences require policy/algorithm review, not widened thresholds.
5. Preserve existing domain/application tests and add meaningful pure-operation tests plus browser checks for draft preservation, explicit Apply, aliases and unavailable specimens. A passing prototype helper suite does not satisfy this gate.

If these proposed limits or tolerances fail, return the evidence and revise the policy before final agreement/acceptance. Do not silently reduce coverage, erase near-neutral coordinates, clamp invalid results or loosen thresholds to obtain passing checks.

## Agreement and follow-up

Review this as one recommended behavior bundle. Any requested change is recorded here before amending the contract. Once agreed, update only the affected color-model/open-question sections and amend Increment 003 Scope, D2, AC-3 and verification together with a dated agreement record. Keep prototype history labeled as history. The proposal does not require importing its code or selecting every dependency.

Then address the user's separately captured UX/UI changes and required missing-state supplement, close D4, and identify the resulting design/contract for final agreement. Material design revisions return to the user before renewed analyst review. Implementation starts only after explicit authorization under the project workflow.
