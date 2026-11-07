# Increment 003: color-policy proposal

- Status: **Numerical behavior bundle agreed — 5 November 2026; V6 interaction reconciliation approved with the parent agreement — 7 November 2026**; implementation not authorized. Prepared by the separate analyst; the filename retains its proposal-stage identity.
- Parent: [Increment 003](003-visible-color-authoring.md), especially [V4 review finding 1](003-visible-color-authoring.md#1-before-agreement-reconcile-d2ac-3-with-requested-conversion-and-preview-ux).
- Agreement: the user confirmed that this behavior bundle matches the intended direction and explicitly requested recording it as agreed. Its numerical validation and candidate-library gates remain required; agreement is not proof of calculation accuracy or dependency suitability.
- Authorization: the user requested reconciliation with reviewed V6 on 7 November 2026 and adoption of the recommended renderer stack and disclosed initial black literal. This updates the interaction trigger and corresponding reconciled contract; numerical precision, limits and gates are unchanged. The user subsequently approved the updated whole contract/design and creation disclosure; application implementation remains unauthorized. Color.js remains a candidate, not a selected production dependency.

## Agreed behavior bundle

Keep sRGB 0–255 editing, pure conversion among the five supported spaces and bounded approximate specimens. The reconciled V6 interaction distinguishes passive derived views from deliberate component edits that promote a representation to the literal draft. Use the following bounded numerical policy:

| Concern | Agreed policy | Consequence for the author |
| --- | --- | --- |
| Direct component entry | Preserve exact canonical Decimal values; use the existing constructor and range rules. | Long decimals, `none`, extended RGB and alpha retain their meaning. |
| sRGB 0–255 entry | Divide edited channels by 255 using decimal arithmetic; keep terminating results exact, otherwise round to 18 significant digits, ties to even. | Fractional and extended entries work; repeating ratios are explicitly approximate. |
| Space conversion | Generate an approximate candidate with 12 significant digits per calculated component, ties to even; retain alpha exactly. | Passive viewing leaves the authoritative draft unchanged; a deliberate component edit in another representation promotes that representation. Only Apply commits the authoritative draft. |
| Missing and powerless components | Convert a missing hue only at exactly zero saturation/chroma. Preserve all other missing components and explain why conversion is unavailable. Do not automatically erase small nonzero chroma. | No missing component silently becomes zero, and near-neutral colors retain authored distinctions. |
| Extended values and failures | Never gamut-map or clamp authored candidates. Reject conversion when the target canonical schema or the bounded calculation service cannot represent it. | The current space, values and drafts survive a failed conversion. Exact editing remains available. |
| Specimens | Render numeric in-range sRGB, or an approximate conversion to it; withhold unsupported/out-of-gamut previews. | Specimen failure does not invalidate an otherwise valid authored color. |

**Reason for the precision choices:** 18 significant digits make decimal byte division independent of binary floating point. General color transforms are approximate; 12 significant digits give room for binary calculation noise while preserving very small nonzero magnitudes. Neither count claims that the algorithms have that many accurate digits. Their accuracy is a separate verification gate below. These agreed numerical defaults apply to this bounded operation, subject to the verification gate; they are not a global Decimal precision setting.

The user agreed this behavior bundle, including explicit approximation and bounded refusal. Numerical fixture validation and candidate-library evaluation remain engineering work; the user is not being asked to choose tolerances or library internals. A failed gate requires evidence and an explicit policy revision rather than silently changing agreed behavior.

## Boundaries retained

The [exact color model](../design-tokens/conceptual-model.md#color-literals) and [authored/derived distinction](../design-tokens/conceptual-model.md#authored-color-and-alternative-representations) remain authoritative. One authored literal has one space, three components and explicit alpha. Aliases remain relationships; switching editor mode, inspecting a converted representation or previewing a resolved alias never flattens one into a literal.

Included calculations are sRGB entry-scale adaptation and literal conversion among `srgb`, `display-p3`, `hsl`, `oklab`, and `oklch`. Same-space requests are identity operations. Native one-dimensional component/alpha sliders supplement exact entry under the [identified design](003-visible-color-authoring.md#identified-v6-design-and-draft-session-behavior); their intervals do not change these numerical rules. Excluded are HEX/two-dimensional pickers, interpolation/mixing, standalone manipulation operations such as relative lightness adjustments, ramps, color expressions, automatic fallbacks, gamut mapping and target compatibility. Direct editing of a literal lightness component remains included. No persistence representation changes.

The 5 November agreement concerns numerical behavior. On 7 November the user requested reconciliation with V6 following analyst review and adopted the production stack and disclosed initial black value. The interaction trigger below now reflects V6; the parent contract identifies responsive/sliders/draft behavior and the agreed written creation disclosure. Whole-contract/design agreement was approved on 7 November; application implementation authorization remains pending; the renderer choice does not select a color calculation dependency.

## Exact editing and entry-scale adaptation

1. Use the existing canonical Decimal grammar and color constructor. Do not route direct normalized entry through `Number`, browser CSS parsing or a library serializer. Noncanonical/incomplete text remains a correctable delivery draft and cannot be submitted as a valid literal. Existing exact modulo-360 hue normalization remains visible after successful submission.
2. Selecting 0–255 versus normalized entry is display-only. It must not dirty the literal or replace any exact normalized coordinate. Calculate derived byte coordinates by exact multiplication by 255, then display at most 12 significant digits, ties to even, without exponent or negative zero. Indicate that a shortened derived value is approximate. Raw byte text being edited stays visible until accepted/discarded under the agreed form behavior.
3. A deliberate byte edit affects only that channel: exact decimal division by 255, retaining the exact terminating quotient where possible; otherwise round once to 18 significant digits, ties to even. Trim trailing fractional zeros and expand exponents for canonical output. Negative and greater-than-255 values remain extended sRGB coordinates; fractional bytes are permitted. `none` stays `none`. Untouched channels and alpha stay exact.
4. An entry-scale toggle followed by an unchanged submission of a shortened displayed byte value must not count as a channel edit. Track the original coordinate and actual input edits rather than reparsing all displayed fields on Apply. Replacing a field with newly typed text, even if it looks identical, is an explicit edit.
5. Incomplete/invalid byte text blocks Apply and representation/conversion requests that would discard that text. Explain the issue and preserve both raw text and the underlying draft; do not apply an older normalized value in its place.

## Space conversion and rounding

Conversion remains a pure candidate calculation with a literal and target space as input; it never writes the project. Same-space requests return the exact input, including numeric powerless hue and alpha. The following V6 interaction reconciliation supersedes the original 5 November cumulative-space-switching trigger without changing the calculation policy:

- The literal editing session owns one authoritative draft plus a displayed space. Each alternate representation derives directly from that authoritative draft, never from another passive view. Changing views alone changes neither authorship nor dirty state; any unedited multi-space trip back restores the exact authoritative component/alpha text.
- A deliberate component edit in another representation promotes that calculated representation to the authoritative draft, replacing the edited channel with entered exact text and using this bundle's calculated-value rules for other channels. Incomplete text remains a delivery draft, not a valid literal; Apply remains blocked until constructor-valid. Promotion invalidates stale derived representations/raw byte caches. Alpha-only edits update the exact alpha on the existing authoritative draft without changing its space.
- Apply commits the authoritative draft even when a different representation is displayed; absent an authored edit it is unavailable. Successful Apply resets the view/baseline to the committed authored space and clears the inactive form draft. Rejection retains both form drafts. Cancel discards both and restores the applied baseline. Mode switches/pane collapse retain independent literal/reference fields, view, scale and raw text; an alias is never flattened by viewing.
- Valid raw byte text survives passive browsing; real edits in another space invalidate stale byte text. Incomplete/invalid text or failed calculation preserves current view, raw text and source rather than discarding them or applying an older normalized value. Entry-scale adaptation still follows the exact per-channel rules above.

Repeated deliberately promoted edits or sequential calls that intentionally use one conversion output as the next source may accumulate approximation. Such a calculated round trip is not undo and need not restore source text. This kernel behavior is tested separately from passive editor browsing, which must restore exact text without cumulative writes.

Use a fixed, documented algorithm/version: extended sRGB/Display P3 transfer functions and D65-based transforms, HSL as an sRGB model, and OKLAB/OKLCH rectangular/polar transforms. The [CSS Color 4 conversion sections and sample code](https://www.w3.org/TR/2026/CRD-css-color-4-20261103/#color-conversion-code), checked 5 November 2026, are reference material for equations and fixtures. That document is a Candidate Recommendation Draft; its sample code is informative. It is not adopted as the canonical schema, CSS parser behavior, or a blanket conformance promise.

For calculated numeric components, round to 12 significant decimal digits with ties to even, then serialize to canonical non-exponent Decimal. Specify rounding over the shortest round-tripping decimal text of each finite binary calculation result; do not inherit `toFixed` rounding or round at every intermediate matrix step. Strip negative zero. Run the resulting complete candidate through the existing constructor after rounding: hue normalization therefore also handles a rounded `360` as `0`. Retain the original alpha text, even at alpha zero; never premultiply components for this conversion.

Long exact source coordinates may lose low-order digits in a deliberate conversion; this is disclosed as a newly calculated candidate. Same-space requests, entry-scale inspection and previews cannot cause that loss. Fixed fractional rounding is rejected: the prototype's 12 fractional places turn a nonzero byte edit `0.000000000001 / 255` into zero, while significant-digit rounding preserves its magnitude.

### Missing components and near-neutral colors

- Same-space requests preserve every `none` without calculation.
- Cross-space conversion accepts fully numeric components, plus one narrow missing-hue case: HSL `[none, 0, L]` or OKLCH `[L, 0, none]`. For that case only, the domain may use zero internally for the irrelevant hue and produces the mathematically neutral result. This is an operation-local equivalence, never a rewrite of the source literal.
- Other missing components block conversion, including missing hue at nonzero saturation/chroma. Preview uses the same eligibility rule. No general CSS missing-component interpolation semantics are introduced.
- Detect exact neutral source cases using exact input values: equal numeric RGB channels, HSL saturation zero or lightness exactly 0/100, OKLAB axes both zero, or OKLCH chroma zero. Where target neutrality is representable, give HSL zero saturation and `none` hue; OKLCH zero chroma and `none` hue; OKLAB zero axes; RGB equal channels. This prevents matrix residue from manufacturing a chromatic hue for exact neutral input. Neutral RGB outside the destination schema's allowed lightness range still fails validation.
- For other sources, retain computed nonzero chroma and numeric hue, even if tiny. Do not inherit a library's near-neutral threshold. If an intermediate calculation collapses a distinction needed to form a valid result, refuse rather than invent a hue. This does not promise preservation of arbitrarily small differences through floating-point arithmetic.
- A numeric powerless source hue survives identity/direct editing. A deliberately promoted/calculated cross-space round trip can lose that original hue; it cannot be recovered from a neutral color and is not reconstructed.

### Bounded calculation and target failures

Agreed initial calculation guards, subject to the fixture gate: each numeric component sent through a cross-space transform must have absolute magnitude zero or between `1e-100` and `1e6`, inclusive, and at most 4,096 text characters before conversion. Normalize hue by the existing constructor before checking. Apply these guards to intermediate/final results too; reject non-finite results, nonzero underflow, excess output length or a target-schema violation. Alpha is copied exactly and does not pass through the numerical transform. These conservative service limits cover ordinary and extended editing without treating every finite Decimal as a safe floating-point calculation.

For exact byte arithmetic/derived multiplication, use the 4,096-character input guard and a 4,200-character output budget, without the binary magnitude guard. Check budgets before allocating large powers/expanded output. An unsupported byte representation does not change its normalized source.

These are **operation limits**, not new canonical literal limits or a global solution to Decimal resource constraints. Exact direct editing and identity operations retain existing domain behavior outside them. A stricter project-wide input budget would require its own explicit decision.

After rounding and constructor validation, a bounded HSL/OKLAB/OKLCH conversion may still be unavailable for an extended RGB source. For example, no promise is made that all extended RGB values have valid HSL saturation/lightness or OKLAB lightness in the chosen schema. Explain the target constraint; do not clamp it. No authored boundary epsilon is allowed. A numerically noisy result that still fails the constructor is a failed conversion, not permission to snap it silently into range. Common boundary fixtures must succeed through a verified algorithm/rounding path or the policy must return for revision.

Failures return a distinguishable reason: invalid input, unsupported missing components, calculation limit, numerical failure, or target-schema incompatibility. Prior source/draft/applied data remain intact. No production diagnostic payload is selected by these descriptive categories.

## Preview policy

Preview is a disposable rendering calculation outside the domain; it may reuse the verified conversion kernel but cannot write its output into authored fields. Use explicit sRGB CSS serialization, never a general library serializer with hidden gamut mapping. Direct sRGB gamut checks compare exact Decimal values to 0 and 1, so `1.000000000001` is outside even if binary conversion or formatting would round it to 1.

For other eligible spaces, use raw converted sRGB coordinates. Use the agreed initial absolute boundary-noise allowance of `1e-10` per channel for preview only, subject to boundary validation: within `[-1e-10, 1 + 1e-10]`, snap display-only overshoots to the nearest boundary; beyond it, withhold the specimen. Label successful cross-space previews approximate. This remains an unverified engineering parameter requiring boundary fixtures, not a perceptual tolerance, target compatibility test or proof of exact gamut membership. If the allowance cannot be justified by observed conversion error, revise it rather than widen it until tests pass.

Unavailable preview reasons distinguish invalid/incomplete text, unsupported missing components, calculation limits/failure, unresolved value and outside the bounded sRGB preview gamut. Authored extended RGB remains valid. Show exact text and the explanation; no browser-selected gamut-mapped fallback is substituted. Preview at alpha zero still retains underlying channels and alpha; a checkerboard is only a visual aid. Monitor, browser and color management can affect appearance; this slice promises an illustrative specimen, not display calibration or exact cross-device reproduction.

## Domain/application boundary and library evaluation

The [architecture](../project/architecture.md#domain-engine) already puts deterministic authored conversion in the portable domain. Implementing this agreement would add only pure literal conversion and sRGB byte-entry candidate calculations with explicit policy/version and failure results. The application continues to validate/commit accepted edits through existing operations; delivery code owns incomplete text, draft mode and specimen rendering. No token is mutated by a calculation. No registry, generic plugin interface, color-expression family or package split is warranted.

**Candidate, not selected:** evaluate Color.js `0.7.1`, already isolated in the prototype, as a local calculation dependency behind that boundary. Its [supported spaces](https://colorjs.io/docs/spaces) cover the required models, with canonical `display-p3` mapped locally to library `p3`. Its [gamut documentation](https://colorjs.io/docs/gamut-mapping), checked 5 November 2026, distinguishes coordinate conversion from lossy gamut mapping and notes serializer defaults. Do not use `.toGamut()` or default `.toString()` for authored candidates.

Local installed-source/runtime inspection found a consequential default: conversion to OKLCH uses a near-achromatic rectangular-axis test and can replace nonzero chroma with zero/hue `null`. This differs from the agreed policy. For example, source sRGB `[0.000000000000001, 0, 0]` converts through installed Color.js directly to OKLCH chroma `0`, hue `null`; converting to OKLAB and computing raw polar coordinates gives approximately chroma `0.000001098159548534976`, hue `29.23388027962786` degrees.

Recommendation: evaluate a narrow route using the library for verified rectangular transforms and explicit raw OKLAB↔OKLCH polar formulas under project policy, rather than accepting that hidden threshold or forking its global registry. The candidate is acceptable only if all routes preserve the policy, host independence and numerical fixtures. Confirm exact installed version/provenance, license, dependency/bundle effects and compatibility during technical preparation. No claim is made that `0.7.1` is the latest release. If the candidate cannot satisfy the gate, bring back a bounded alternative and its cost; do not silently replace these policies with library behavior.

## Representative fixtures and verification gate

The following specify **expected behavior under the agreed bundle** unless marked measured. They remain unverified acceptance work for an eventual implementation; measured candidate observations are not automatically accepted accuracy oracles.

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
| Direct sRGB `1.000000000001`; converted boundary overshoots | First withholds preview by exact comparison. Converted values inside/outside the agreed initial `1e-10` preview allowance test both sides without changing the source. |
| Hue rounds to `360`; negative/large entered hue | Constructor normalizes final hue; no invalid `360` candidate and no binary normalization of directly authored hue. |
| Target invalid after conversion/rounding; over-limit input/result; non-finite stub | Distinct failure; no changed space, field, token or success claim. Canonical exact editing outside calculation limits remains possible. |
| Repeated deliberate/kernel round trip, 100 cycles | Measure drift on ordinary bounded fixtures, report it, and compare against the cumulative bound below; never expect original decimal text from sequential calculated outputs. |
| Passive multi-space editor exploration and return | Restore exact current draft components/alpha; do not dirty or promote it. Verify pending edits, view/scale/raw text, alpha-only changes, independent forms, Apply/Cancel and failed representation retention separately from kernel drift. |

**Measured on 5 November 2026:** read-only Node probes of installed Color.js `0.7.1` gave the following raw floating-point coordinates. These are observations of a candidate, not independent accuracy or accepted canonical-output oracles:

```text
sRGB red → P3:     [0.9174875573251656, 0.20028680774084717, 0.13856059121111408]
sRGB red → OKLAB:  [0.6279553639214311, 0.2248630684262744, 0.125846277330585]
sRGB red → OKLCH:  [0.6279553639214311, 0.2576833038053608, 29.23388027962784]
P3 green → sRGB:   [-0.5116049825853448, 1.0182656579378029, -0.3106746212905826]
```

Python Decimal arithmetic with precision 18 and `ROUND_HALF_EVEN` independently reproduced the byte results above (trailing zeros normalized in the table). The existing isolated prototype `npm test` passes all eight helper tests; these verify its older policies, not the newly agreed bundle. Project-owned local file links and the scoped Markdown diff were checked. No new production code or calculation implementation exists yet; no browser, root regression or cross-runtime policy validation is claimed.

Required engineering gate before claiming this policy implemented (the quantitative accuracy thresholds below remain validation proposals, not measured guarantees):

1. Freeze the equations/constants and operation policy identity, and record independent expected fixtures from the dated CSS reference or a separately checked high-precision calculation. Comparing only against the same library does not validate it.
2. Verify decimal byte results and formatter outputs exactly. Test general conversion numerically: for ordinary fixtures with RGB coordinates in `[-1, 2]`, compare after conversion to a common sRGB basis, proposing maximum absolute channel error `1e-8` per directed conversion and `1e-6` over 100 round trips. Check OKLAB components within `1e-8`; compare chromatic hue with a wrapped angular bound `1e-5` degrees when chroma is at least `1e-4`. These are proposed validation thresholds, not measured accuracy or universal bounds over every accepted magnitude. Below that chroma, compare rectangular coordinates rather than unstable angle. Test tiny/large calculation-domain limits and cancellation separately; published service guards alone do not establish accuracy throughout that domain.
3. Prove exact-neutral and tiny-nonzero behavior, target validation, failure atomicity, and preview boundary checks independently. The preview `1e-10` allowance must be supported by measured boundary residue, even though broader transform tests permit `1e-8` error.
4. Record runtime/package versions and cross-runtime fixture results for Node and the supported browser. Decimal arithmetic/formatting must be exact; general transforms have a versioned algorithm and bounded numerical equivalence, not an unverified promise of byte-identical transcendental results across all JavaScript engines. Material differences require policy/algorithm review, not widened thresholds.
5. Preserve existing domain/application tests and add meaningful pure-operation tests plus browser checks for draft preservation, explicit Apply, aliases and unavailable specimens. A passing prototype helper suite does not satisfy this gate.

If the agreed initial limits or proposed validation tolerances fail, return the evidence for an explicit policy amendment before final implementation agreement/acceptance. Do not silently reduce coverage, erase near-neutral coordinates, clamp invalid results or loosen thresholds to obtain passing checks.

## Bounded feasibility evidence — 7 November 2026

The authorized [feasibility report](003-numerical-feasibility-report.md) records independent reference comparisons, exact decimal fixtures, tiny-color incompatibility in the default candidate route, sampled accuracy/boundary residue and guard/cancellation gaps. The [independent research review](003-numerical-feasibility-review.md) verifies reproduction and limits. This is representative Node-only evidence, not completion of the engineering gate. Numerical precision, limits and proposed thresholds remain unchanged; no production library is selected. Observable intermediate guard enforcement and cancellation detection are the recommended next investigation before integration. Application implementation and production dependency changes remain unauthorized.

## Guard/cancellation evidence — 7 November 2026

The completed [bounded investigation](003-guards-cancellation-report.md) and [independent review](003-guards-cancellation-review.md) provide reproducible stage/cancellation evidence with both review corrections resolved. Observable routes can catch internal violations while retaining useful ordinary samples; exact-neutral branches must still guard their linearized coordinate. Named-stage versus scalar guarding changes one sampled acceptance result. Cube-root pair collapse is measured, but its automatic refusal remains a conservative research hypothesis rather than adopted policy.

The [parent contract’s proposed clarifications](003-visible-color-authoring.md#guard-and-cancellation-evidence-and-proposed-clarification) recommend a versioned named-coordinate guard inventory and a narrowly documented conservative refusal rule before a route-and-refusal specification. These are proposals requiring user disposition; this evidence section changes no guard scope, magnitude limits, formatting, preview allowance or accuracy threshold. Application implementation, production dependency changes and library selection remain unauthorized.

## Agreement and follow-up

5 November 2026 — The user agreed this behavior bundle and asked to capture UX/UI changes next, before final implementation agreement, with no implementation started. The affected color-model/open-question sections and Increment 003 Scope, D2, AC-3 and verification now record that bounded agreement. Prototype history remains history. No prototype code or production dependency is selected by this agreement.

7 November 2026 — Following V6 analyst review, the user adopted the recommended production renderer stack and initial opaque-black literal disclosed before Create, and requested contract reconciliation with V6. The interaction amendment above and [reconciled parent contract](003-visible-color-authoring.md) now distinguish exact passive exploration from approximate promoted edits. The numerical precision, limits, candidate-library status and verification gates remain unchanged. The written creation disclosure is presented as a supplement, not claimed as existing prototype UI. Final whole-contract/design agreement and implementation authorization remain pending. Material design revisions return through the user/designer/analyst sequence; no application implementation starts under this documentation request.


7 November 2026 — The user approved the consolidated Increment 003 agreement and creation disclosure. The V6 interaction amendment is agreed; numerical precision, limits, preview policy and verification gates remain unchanged and unverified. The [proposed numerical feasibility check](003-visible-color-authoring.md#numerical-feasibility-preparation) is a recommendation, not authority to run probes or implement/integrate calculations. Delivery remains Not started; Color.js is not selected.


7 November 2026 — The user authorized the [bounded intermediate-guard/cancellation investigation](003-visible-color-authoring.md#intermediate-guards-and-cancellation-investigation). This authorizes isolated evidence collection only; numerical limits and refusal policy are unchanged. Material interpretation/precision ambiguities return for a decision rather than becoming implicit policy. Application implementation and production dependency changes remain unauthorized.
