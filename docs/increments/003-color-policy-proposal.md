# Increment 003: color-policy proposal

- Status: **Numerical behavior bundle agreed 5 November 2026; V6 reconciliation approved 7 November; simpler numerical contract and Culori direction approved 8 November 2026**; that baseline was implemented and independently reviewed 8 November within the scoped acceptance evidence. The subsequent **integer-control amendment agreed 8 November** is implemented and independently reviewed within the scoped [Increment 006 completion evidence](006-integer-rgb-and-identity-presentation.md#completion-report). The filename retains its proposal-stage identity.
- Parent: [Increment 003](003-visible-color-authoring.md), especially [V4 review finding 1](003-visible-color-authoring.md#1-before-agreement-reconcile-d2ac-3-with-requested-conversion-and-preview-ux).
- Agreement: the user approved the simpler numerical proposal and Culori direction on 8 November 2026 and authorized documentation reconciliation only. The current rules below supersede conflicting earlier intermediate-guard, cancellation and candidate-library provisions. Agreement is not evidence of implementation correctness or completed integration.
- Authorization: the 7 November V6 agreement, renderer direction and disclosed initial black literal remain intact. After the 8 November numerical amendment and technical preparation, the user explicitly authorized Increment 003 implementation. Necessary application/dependency work and verification may proceed under the parent contract; earlier dated preparation-only prohibitions are historical. This does not authorize changing the numerical agreement or broader future scope.

## Approved native CSS preview amendment — 12 November 2026

During Increment 007 manual testing, the user approved native CSS previews for every
supported color space, preserving exact authored values. This supersedes the earlier
sRGB-only specimen, out-of-sRGB refusal and preview-only `1e-10` allowance; it does
not change authored conversion, byte entry, domain validation or stored data.
The preview helper now implements this amendment; focused verification is recorded
in [current status](../status/current.md). Earlier dated implementation/research
reports retain their original policy and evidence limits.

## Approved numerical amendment — 8 November 2026

The user approved a UX-based distinction: preserve authored data exactly, while treating converted representations as approximate results from Culori. This amendment replaces the earlier requirement to guard internal magnitudes, detect internal underflow/cancellation or certify that no small distinction was lost. No minimum magnitude is imposed. The `1e6` absolute maximum remains an **input-only** calculation-service cap; finite inputs, nonzero-input-to-zero refusal, text/output budgets, finite results and final constructor validation remain required. Derived tiny distinctions and near-neutral hue can lose numerical significance without invalidating the exact source.

Culori is the selected calculation-backend direction, with `4.0.2` as the measured qualification baseline. At amendment approval, production pinning/integration were unverified and that agreement alone installed nothing. The subsequent authorized implementation installs Culori 4.0.2 and records scoped package/type/build/browser evidence in the [completion report](003-visible-color-authoring.md#completion-report). No owned conversion equations, arbitrary-precision backend or internal-stage instrumentation are planned. The earlier named-stage and conservative cancellation-refusal proposals are superseded, not pending implementation decisions.

The known sRGB `[0.000000000000001, 0, 0]` → HSL saturation defect remains a real Culori defect. An unavailable representation with intact source/drafts is an accepted initial limitation for this exceptional case; it is not a fixed or successful conversion. Ordinary representative palette/boundary fixtures must succeed, but this contract does not promise success for every input within the service cap. Do not silently clamp the defect away or generalize this exception to ordinary failures.

Exact input/alpha/identity, passive view restoration, byte arithmetic, 12-significant-digit derived formatting, missing-component eligibility, exact-neutral handling, no authored gamut mapping/clamping, and the preview-only `1e-10` allowance remain unchanged. Future mixing and gradients stay separately scoped. That amendment approval authorized documentation only; the subsequent explicit implementation authorization recorded in the parent contract now starts delivery.

## Approved integer-control amendment — 8 November 2026

After reviewing the integer-control recommendation, the user explicitly authorized implementing it together with quieter token-ID presentation in [Increment 006](006-integer-rgb-and-identity-presentation.md). The existing sRGB **0–255 scale** becomes a whole-number-oriented UI control. Passive fractional scaled coordinates display the nearest integer, ties to even, with a clear approximation indication; Normalized · 0–1 remains exact. Scale/view changes and unchanged Apply cannot round authored coordinates. Only explicitly edited channels use byte division; fractional raw entry in this UI is invalid, retained for correction and never silently rounded. Signed/extended integers and `none` remain supported, with the nominal slider interval unchanged. Alpha is unchanged.

This supersedes fractional UI entry and the previous 12-significant-digit byte display in the current entry-scale rules below. It changes neither the canonical model nor the decimal-capable pure byte calculation APIs; their existing fractional fixtures remain valid. Exact decimal multiplication must precede nearest-integer display rounding, without a prior Number or significant-digit approximation. Existing calculation budgets and failure retention remain required. The amendment records the agreed behavior; the [Increment 006 completion report](006-integer-rgb-and-identity-presentation.md#completion-report) owns delivered coverage and verification limits.

## Agreed behavior bundle

Keep sRGB 0–255 editing, pure conversion among the five supported spaces and bounded approximate specimens. The reconciled V6 interaction distinguishes passive derived views from deliberate component edits that promote a representation to the literal draft. Use the following bounded numerical policy:

| Concern | Agreed policy | Consequence for the author |
| --- | --- | --- |
| Direct component entry | Preserve exact canonical Decimal values; use the existing constructor and range rules. | Long decimals, `none`, extended RGB and alpha retain their meaning. |
| sRGB 0–255 UI entry | Accept canonical whole-number text or `none`; divide explicitly edited channels by 255 using decimal arithmetic, retaining terminating results exactly and otherwise rounding to 18 significant digits, ties to even. | Passive fractional scaled coordinates show nearest integers with clear approximation; signed/extended integers work. Normalized input remains exact and untouched channels never round. |
| Space conversion | Generate an approximate candidate with 12 significant digits per calculated component, ties to even; retain alpha exactly. | Passive viewing leaves the authoritative draft unchanged; a deliberate component edit in another representation promotes that representation. Only Apply commits the authoritative draft. |
| Missing and powerless components | Convert a missing hue only at exactly zero saturation/chroma. Preserve other missing components and explain why conversion is unavailable. Keep exact-neutral semantics without adding a near-neutral threshold. | Missing components do not silently become zero. Exact source distinctions remain stored; derived near-neutral hue and tiny distinctions are approximate. |
| Extended values and failures | Never gamut-map or clamp authored candidates. Reject conversion when the target canonical schema or the bounded calculation service cannot represent it. | The current space, values and drafts survive a failed conversion. Exact editing remains available. |
| Specimens | Serialize validated source directly in its native CSS notation, preserving component/alpha text. Let the browser render/map for its display. | Outside-sRGB colors can have a preview; no display result is written back to authored data. |

**Reason for the precision choices:** 18 significant digits make decimal byte division independent of binary floating point. General color transforms are approximate; 12 significant digits give deterministic derived formatting without fixed-fraction truncation. This formatting does not certify preservation of every tiny distinction. Neither count claims that the algorithms have that many accurate digits. Their accuracy is a separate verification gate below. These agreed numerical defaults apply to this bounded operation, subject to the verification gate; they are not a global Decimal precision setting.

The user agreed this behavior bundle, including explicit approximation and bounded refusal. Representative numerical fixtures and Culori integration verification remain engineering work; the user is not being asked to choose tolerances or library internals. A failed gate requires evidence and an explicit policy revision rather than silently changing agreed behavior.

## Boundaries retained

The [exact color model](../design-tokens/conceptual-model.md#color-literals) and [authored/derived distinction](../design-tokens/conceptual-model.md#authored-color-and-alternative-representations) remain authoritative. One authored literal has one space, three components and explicit alpha. Aliases remain relationships; switching editor mode, inspecting a converted representation or previewing a resolved alias never flattens one into a literal.

Included calculations are sRGB entry-scale adaptation and literal conversion among `srgb`, `display-p3`, `hsl`, `oklab`, and `oklch`. Same-space requests are identity operations. Native one-dimensional component/alpha sliders supplement exact entry under the [identified design](003-visible-color-authoring.md#identified-v6-design-and-draft-session-behavior); their intervals do not change these numerical rules. Excluded are HEX/two-dimensional pickers, interpolation/mixing, standalone manipulation operations such as relative lightness adjustments, ramps, color expressions, automatic fallbacks, gamut mapping and target compatibility. Direct editing of a literal lightness component remains included. No persistence representation changes.

The 5 November agreement concerns numerical behavior. On 7 November the user requested reconciliation with V6 following analyst review and adopted the production stack and disclosed initial black value. The interaction trigger below now reflects V6; the parent contract identifies responsive/sliders/draft behavior and the agreed written creation disclosure. Whole-contract/design agreement was approved on 7 November; implementation authorization was still pending at that point. It was subsequently authorized and completed on 8 November as recorded below. The renderer choice alone did not select a color calculation dependency. Culori was subsequently selected by the 8 November numerical amendment.

## Exact editing and entry-scale adaptation

1. Use the existing canonical Decimal grammar and color constructor. Do not route direct normalized entry through `Number`, browser CSS parsing or a library serializer. Noncanonical/incomplete text remains a correctable delivery draft and cannot be submitted as a valid literal. Existing exact modulo-360 hue normalization remains visible after successful submission.
2. Selecting 0–255 versus normalized entry is display-only. It must not dirty the literal or replace any exact normalized coordinate. Calculate derived byte coordinates by exact multiplication by 255, then display the nearest whole number, ties to even, without exponent or negative zero. Clearly indicate approximation whenever the exact product is fractional; exact integers and `none` have no rounding indicator. Do not first reduce the exact product to Number or significant-digit formatted text. Raw byte text being edited stays visible until accepted/discarded under the agreed form behavior.
3. A deliberate byte edit affects only that channel: exact decimal division by 255, retaining the exact terminating quotient where possible; otherwise round once to 18 significant digits, ties to even. Trim trailing fractional zeros and expand exponents for canonical output. Negative and greater-than-255 whole numbers remain extended sRGB coordinates. This UI accepts canonical whole-number text or `none`; fractional raw text remains invalid and correctable rather than being rounded. The general pure byte calculation API remains decimal-capable. `none` stays `none`. Untouched channels and alpha stay exact.
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

Long exact source coordinates may lose low-order digits in a deliberate conversion; this is disclosed as a newly calculated candidate. Same-space requests, entry-scale inspection and previews cannot cause that loss. Fixed fractional rounding is rejected: the prototype's 12 fractional places turn the general byte calculation `0.000000000001 / 255` into zero, while significant-digit rounding preserves its magnitude.

### Missing components and near-neutral colors

- Same-space requests preserve every `none` without calculation.
- Cross-space conversion accepts fully numeric components, plus one narrow missing-hue case: HSL `[none, 0, L]` or OKLCH `[L, 0, none]`. For that case only, the domain may use zero internally for the irrelevant hue and produces the mathematically neutral result. This is an operation-local equivalence, never a rewrite of the source literal.
- Other missing components block conversion, including missing hue at nonzero saturation/chroma. Preview uses the same eligibility rule. No general CSS missing-component interpolation semantics are introduced.
- Detect exact neutral source cases using exact input values: equal numeric RGB channels, HSL saturation zero or lightness exactly 0/100, OKLAB axes both zero, or OKLCH chroma zero. Where target neutrality is representable, give HSL zero saturation and `none` hue; OKLCH zero chroma and `none` hue; OKLAB zero axes; RGB equal channels. This prevents matrix residue from manufacturing a chromatic hue for exact neutral input. Neutral RGB outside the destination schema's allowed lightness range still fails validation.
- For other sources, use Culori's finite derived coordinates without adding an arbitrary near-neutral threshold. Small distinctions may be lost during approximate conversion, and hue close to gray need not be numerically stable. Exact source components remain unchanged until a deliberate edit promotes the representation. No internal cancellation, underflow or no-lost-distinction certification is required; near-neutral accuracy fixtures compare rectangular coordinates instead of unstable hue.
- A numeric powerless source hue survives identity/direct editing. A deliberately promoted/calculated cross-space round trip can lose that original hue; it cannot be recovered from a neutral color and is not reconstructed.

### Bounded calculation and target failures

Agreed observable calculation guards: each numeric source component sent through a cross-space transform must have absolute magnitude at most `1e6`, inclusive, and at most 4,096 text characters. Normalize hue by the existing constructor before checking. There is no nonzero minimum magnitude. Require a finite Number input and refuse if conversion of a nonzero exact source component to Number becomes zero. Alpha is copied exactly and is not part of the transform. Ordinary loss of low-order digits or collapse of tiny source distinctions is permitted in this approximate calculation; it never rewrites the exact source by itself.

Do not apply the input magnitude cap to internal or final coordinates. Do not inspect internal arithmetic or require detection of internal underflow/cancellation. Require finite numeric output, a 4,200-character output budget after formatting, and final constructor validity. These boundary checks and representative accuracy fixtures bound the service; they are not universal numerical certification over all admitted inputs.

For exact byte arithmetic/derived multiplication, use the 4,096-character input guard and a 4,200-character output budget, without the binary magnitude guard. Check budgets before allocating large powers/expanded output. An unsupported byte representation does not change its normalized source.

These are **operation limits**, not new canonical literal limits or a global solution to Decimal resource constraints. Exact direct editing and identity operations retain existing domain behavior outside them. A stricter project-wide input budget would require its own explicit decision.

After rounding and constructor validation, a bounded HSL/OKLAB/OKLCH conversion may still be unavailable for an extended RGB source. For example, no promise is made that all extended RGB values have valid HSL saturation/lightness or OKLAB lightness in the chosen schema. Explain the target constraint; do not clamp it. No authored boundary epsilon is allowed. A numerically noisy result that still fails the constructor is an unavailable representation, not permission to snap it silently into range. Ordinary representative palette and boundary fixtures must succeed or return for review. The exceptional tiny-red HSL defect identified in the approved amendment is an accepted initial numerical-failure case with preserved source/drafts, not target-schema incompatibility of the mathematical color or a promise that all inputs below the service cap convert successfully.

Failures return a distinguishable reason: invalid input, unsupported missing components, calculation limit, numerical failure, or target-schema incompatibility. Prior source/draft/applied data remain intact. No production diagnostic payload is selected by these descriptive categories.

## Preview policy

**Current agreement — 12 November 2026.** Preview is disposable browser rendering
outside the domain. Validate the literal with the existing constructor, then serialize
the original component and alpha text without Number conversion or a Culori round trip:

| Authored space | Native CSS notation |
| --- | --- |
| sRGB | `color(srgb r g b / alpha)` |
| Display P3 | `color(display-p3 r g b / alpha)` |
| HSL | `hsl(h s% l% / alpha)` |
| OKLAB | `oklab(l a b / alpha)` |
| OKLCH | `oklch(l c h / alpha)` |

HSL saturation/lightness use percentages; missing components remain the CSS keyword
`none`, without a percent suffix. CSS missing-component display semantics apply only
to painting; exact authored `none` remains distinct from zero. Extended RGB coordinates
and valid colors outside sRGB are not refused merely for that reason. The browser
handles display conversion, gamut mapping and numeric rendering precision. This is
not an authored conversion or a guarantee of exact display/cross-device reproduction.
The application does not calculate, clamp or write back a mapped preview value.

Unresolved colors and invalid/incomplete entries retain unavailable feedback. In a
browser, use `CSS.supports` to withhold unsupported color syntax with an explanation,
without substituting another color. Native support checks are not a gamut-membership
test. Alpha remains exact in CSS text and source, including zero. Preview feedback
identifies browser rendering and display dependence; no new gamut-diagnostic UI or
editing/conversion behavior is introduced.

The old raw-sRGB conversion checks and `1e-10` display allowance are retired for previews
only. Culori still supplies explicit approximate editing representations under the
unchanged numerical policy. Historical preview qualification below describes its
original implementation, not additional gates for this small amendment.

CSS notation and display semantics were checked against
[CSS Color 4](https://www.w3.org/TR/css-color-4/) on 12 November 2026.

## Domain/application boundary and library evaluation

The [architecture](../project/architecture.md#domain-engine) already puts deterministic authored conversion in the portable domain. Implementing this agreement would add only pure literal conversion and sRGB byte-entry candidate calculations with explicit policy/version and failure results. The application continues to validate/commit accepted edits through existing operations; delivery code owns incomplete text, draft mode and specimen rendering. No token is mutated by a calculation. No registry, generic plugin interface, color-expression family or package split is warranted.

**Selected backend direction — 8 November 2026:** use Culori behind this small owned boundary for exact canonical data, units, missing/neutral eligibility, deterministic formatting, constructor validation and safe failures. Culori `4.0.2` is both the [qualification baseline](003-culori-qualification-report.md), independently reproduced in the [evidence review](003-culori-qualification-review.md), and the exact installed application pin with `@types/culori` `4.0.1`. Package integrity, declared licenses, selective imports, strict type/build integration and representative Node/browser checks are recorded in the [completion report](003-visible-color-authoring.md#completion-report). This is not a latest-version or universal compatibility claim. Use raw numeric conversion, not serializers/clamping/gamut-mapping helpers, for authored candidates. No custom conversion equations or arbitrary-precision backend are planned.

The qualification's 173 constructor-valid cases, six expected extended-HSL refusals and one tiny-red HSL numerical defect remain historical measurements under the earlier stricter contract. Its hidden-stage gap is no longer a requirement under the approved amendment; the HSL defect remains explicit. That historical qualification claims no run against this later amended contract or application/browser acceptance; the subsequent implementation evidence is recorded separately in the completion report. The 28 provisional mixing/gradient cases support future reuse, without choosing future interpolation, hue, alpha, stop, geometry or gamut semantics or expanding Increment 003.

## Representative fixtures and verification gate

The following specify **expected behavior under the agreed bundle** unless marked measured. Scoped implementation verification is now recorded in the [completion report](003-visible-color-authoring.md#completion-report); the historical candidate observations below are not independent expected-value oracles.

| Fixture | Expected result/evidence |
| --- | --- |
| Direct sRGB channel `0.123456789123456789123456789`, long alpha, plus `none` | Exact readback after allowed submission; unchanged after entry-scale inspection, preview and identity conversion. |
| Pure calculation API byte `127.5`, `510`, `-255` | Exactly `0.5`, `2`, `-1`; no integer rounding or clipping in the API. The integer-oriented UI rejects `127.5`, while accepting `510` and `-255`. |
| Byte `1`, `30`, `128`, `250`, `254` | Respectively `0.00392156862745098039`, `0.117647058823529412`, `0.50196078431372549`, `0.980392156862745098`, `0.99607843137254902` under 18-significant-digit ties-to-even policy. |
| Pure calculation API byte `0.000000000001` | `0.00000000000000392156862745098039`, not zero. |
| Decimal rounding unit fixtures | Exercise positive/negative halfway cases, carry across powers of ten, exponent expansion, negative zero and terminating exact quotients separately from color equations. |
| sRGB red `[1, 0, 0]` → HSL | `[0, 100, 50]`, alpha exactly copied. |
| sRGB red → P3 / OKLAB / OKLCH | Compare independent reference values and the measured candidate observations below; validate canonical candidates after formatting. |
| All 25 space pairs | Cover same-space exact identity plus 20 directed conversions with interior, boundary, extended and near-neutral samples. No one-sample universal-accuracy claim. |
| Gray/black/white; numeric/missing powerless hue | Neutral target components as specified; no invented chroma/hue; original numeric hue survives a no-op. |
| Tiny red; tiny OKLCH chroma; near-gray source distinctions | Preserve the exact source; check finite/valid approximate outputs or explicit numerical failure. Do not require internal distinction-loss certification or stable near-neutral hue. Tiny-red→HSL is the documented accepted initial exception, not a passing conversion. |
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

1. Record the Culori version and DTW operation policy identity, with independent expected fixtures from the dated CSS reference or a separately checked high-precision calculation. Comparing only against the same library does not validate it.
2. Verify decimal byte results and formatter outputs exactly. Test general conversion numerically: for the named representative ordinary fixture corpus (including extended RGB samples in `[-1, 2]`), compare after conversion to a common sRGB basis, proposing maximum absolute channel error `1e-8` per directed conversion and `1e-6` over 100 round trips. Check OKLAB components within `1e-8`; compare chromatic hue with a wrapped angular bound `1e-5` degrees when chroma is at least `1e-4`. These are proposed validation thresholds, not measured accuracy or universal bounds over every accepted magnitude. Below that chroma, compare rectangular coordinates rather than unstable angle. Test input cap sides, non-finite and nonzero-input-to-zero refusal, text/output budgets, target validity and safe numerical failures separately. No exhaustive internal-stage, cancellation or all-domain accuracy proof is required.
3. Verify exact-neutral handling, exact source retention for tiny/near-neutral inputs, target validation, safe refusal for the documented tiny-red HSL defect, failure atomicity and preview boundary checks independently. Ordinary representative fixtures must succeed; expected unavailable cases must assert the reason and intact source rather than be counted as successful conversions. The preview `1e-10` allowance must be supported by measured boundary residue, even though broader transform tests permit `1e-8` error.
4. Record runtime/package versions and cross-runtime fixture results for Node and the supported browser. Decimal arithmetic/formatting must be exact; general transforms have a versioned algorithm and bounded numerical equivalence, not an unverified promise of byte-identical transcendental results across all JavaScript engines. Material differences require policy/algorithm review, not widened thresholds.
5. Preserve existing domain/application tests and add meaningful pure-operation tests plus browser checks for draft preservation, explicit Apply, aliases and unavailable specimens. A passing prototype helper suite does not satisfy this gate.

If the agreed initial limits or proposed validation tolerances fail, return the evidence for an explicit policy amendment before final implementation agreement/acceptance. Do not silently reduce ordinary fixture coverage, rewrite exact source coordinates, clamp invalid results or loosen thresholds to obtain passing checks. Derived low-order distinctions may be lost as explicitly agreed; this is not a reason to erase authored data.

## Bounded feasibility evidence — 7 November 2026

**Historical evidence under the earlier stricter contract.** The frozen report and review remain unchanged. The 8 November amendment above supersedes their pending library-selection and internal-guard recommendations; they do not reopen those decisions.

The authorized [feasibility report](003-numerical-feasibility-report.md) records independent reference comparisons, exact decimal fixtures, tiny-color incompatibility in the default candidate route, sampled accuracy/boundary residue and guard/cancellation gaps. The [independent research review](003-numerical-feasibility-review.md) verifies reproduction and limits. This is representative Node-only evidence, not completion of the engineering gate. Numerical precision, limits and proposed thresholds remain unchanged; no production library is selected. Observable intermediate guard enforcement and cancellation detection are the recommended next investigation before integration. Application implementation and production dependency changes remain unauthorized.

## Guard/cancellation evidence — 7 November 2026

**Historical evidence under the earlier stricter contract.** The frozen report/review remain unchanged; named-stage guarding and conservative cancellation refusal are superseded by the 8 November amendment, not pending current requirements.

The completed [bounded investigation](003-guards-cancellation-report.md) and [independent review](003-guards-cancellation-review.md) provide reproducible stage/cancellation evidence with both review corrections resolved. Observable routes can catch internal violations while retaining useful ordinary samples; under that earlier contract, exact-neutral branches also had to guard their linearized coordinate. Named-stage versus scalar guarding changes one sampled acceptance result. Cube-root pair collapse is measured, but its automatic refusal remains a conservative research hypothesis rather than adopted policy.

The [parent contract’s historical proposed clarifications](003-visible-color-authoring.md#guard-and-cancellation-evidence-and-proposed-clarification) recommend a versioned named-coordinate guard inventory and a narrowly documented conservative refusal rule before a route-and-refusal specification. These were proposals requiring user disposition at that time; they are now superseded by the approved 8 November boundary-only contract. This historical evidence section does not restore their earlier requirements. At that time application implementation, production dependency changes and library selection were unauthorized; Culori selection is now recorded above, while implementation and dependency changes remain unauthorized.

## Agreement and follow-up

The dated entries preserve their then-current states. The approved 8 November numerical and integer-control amendments and current normative sections above govern where these historical records differ.

5 November 2026 — The user agreed this behavior bundle and asked to capture UX/UI changes next, before final implementation agreement, with no implementation started. The affected color-model/open-question sections and Increment 003 Scope, D2, AC-3 and verification now record that bounded agreement. Prototype history remains history. No prototype code or production dependency is selected by this agreement.

7 November 2026 — Following V6 analyst review, the user adopted the recommended production renderer stack and initial opaque-black literal disclosed before Create, and requested contract reconciliation with V6. The interaction amendment above and [reconciled parent contract](003-visible-color-authoring.md) now distinguish exact passive exploration from approximate promoted edits. The numerical precision, limits, candidate-library status and verification gates remain unchanged. The written creation disclosure is presented as a supplement, not claimed as existing prototype UI. Final whole-contract/design agreement and implementation authorization remain pending. Material design revisions return through the user/designer/analyst sequence; no application implementation starts under this documentation request.


7 November 2026 — The user approved the consolidated Increment 003 agreement and creation disclosure. The V6 interaction amendment is agreed; numerical precision, limits, preview policy and verification gates remain unchanged and unverified. The [proposed numerical feasibility check](003-visible-color-authoring.md#numerical-feasibility-preparation) is a recommendation, not authority to run probes or implement/integrate calculations. Delivery remains Not started; Color.js is not selected.


7 November 2026 — The user authorized the [bounded intermediate-guard/cancellation investigation](003-visible-color-authoring.md#intermediate-guards-and-cancellation-investigation). This authorizes isolated evidence collection only; numerical limits and refusal policy are unchanged. Material interpretation/precision ambiguities return for a decision rather than becoming implicit policy. Application implementation and production dependency changes remain unauthorized.

8 November 2026 — The user approved the simpler numerical contract and Culori direction and authorized updating the agreement. The approved amendment and current normative sections above replace conflicting earlier guard, cancellation, tiny-distinction and unselected-library language. Documentation only: no implementation, prototype revision, installation or production dependency change is authorized.

8 November 2026 — After the technical preparation plan, the user explicitly authorized implementation of Increment 003. The approved numerical rules are unchanged. Required application/dependency integration and criterion-linked verification may now proceed; staging, commits and pushes remain human-controlled.

8 November 2026 — Implementation and independent correction recheck completed under the agreed rules: 894 tests, strict typechecks/build, representative Node/browser numerical fixtures and real authoring/failure/zoom checks. The [completion report](003-visible-color-authoring.md#completion-report) owns coverage and limits. This does not promote historical strict research requirements or claim all-domain accuracy.

8 November 2026 — The user approved the integer-oriented 0–255 control recommendation and quieter stable-ID presentation, explicitly requesting implementation of both. The current integer-control amendment supersedes fractional UI entry and prior derived byte-display precision only; canonical normalized values, decimal-capable calculation APIs and historical evidence are preserved. [Increment 006](006-integer-rgb-and-identity-presentation.md) records the bounded agreed contract and completed delivery evidence.
