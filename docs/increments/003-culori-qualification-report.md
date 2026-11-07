# Increment 003: bounded Culori qualification

8 November 2026. **Research complete; strict conversion gate remains open.** Baseline `37abfa5de16bb5200301595f5649c023d9a4a1d7` on clean `dev`. User-authorized scope is isolated Culori qualification against the existing independent fixtures and provisional mixing/gradient probes. No application implementation, dependency selection or numerical-policy amendment is made. The [agreed policy](003-color-policy-proposal.md), [parent contract](003-visible-color-authoring.md), and previous [feasibility](003-numerical-feasibility-report.md) and [guard](003-guards-cancellation-report.md) reports remain authoritative.

## Recommendation

Culori **4.0.2** is useful as a prospective manipulation backend, but **Culori plus only a small policy adapter does not satisfy the current strict conversion contract**. Its tiny-chroma polar conversion avoids Color.js's threshold override, yet its RGB→HSL formula introduces a new concrete numerical failure, and its built-in conversion callbacks still hide required internal stages. Do not switch production libraries on this evidence.

For strict conversion, retain the direction toward a narrow observable owned route, subject to the unresolved guard/uncertainty contract. Culori can still supply substantial future manipulation behavior: same-mode component interpolation, alpha premultiplication/unpremultiplication, hue fixups, positioned stop segmentation and parameter clamping all passed the bounded analytic fixtures. Already converted, unrounded same-mode stops avoid its internal color conversions in the measured path. That yields a concrete narrow-kernel/upstream-manipulation option, rather than requiring an entire owned color library. A unified Culori backend would require owned/custom conversion callbacks for stable HSL and observable transfer/matrix/nonlinear stages; merely overriding top-level callbacks with preflight guards is insufficient. Most strict numerical work would then be DTW-owned, so the claimed advantage of unified *conversion* reuse shrinks materially. No arbitrary-precision basis or implementation is selected.

## Reproduction, provenance and oracle

[Experiment directory](../../output/experiments/003-culori-qualification/):

```sh
python3 output/experiments/003-culori-qualification/fetch.py
node output/experiments/003-culori-qualification/probe.mjs > output/experiments/003-culori-qualification/run-summary.json
python3 output/experiments/003-culori-qualification/analyze.py > output/experiments/003-culori-qualification/analysis-summary.json
shasum -a 256 -c output/experiments/003-culori-qualification/SHA256SUMS
```

The fetch requires network access. It downloads only the exact [registry metadata](https://registry.npmjs.org/culori/4.0.2) and [4.0.2 tarball](https://registry.npmjs.org/culori/-/culori-4.0.2.tgz) into `/tmp/dtw-culori-qualification`, verifies the published SHA-512 integrity against a pinned expected value, and extracts without npm installation or lifecycle execution. Verified integrity: `sha512-1+BhOB8ahCn4O0cep0Sh2l9KCOfOdY+BXJnKMHFFzDEouSr/el18QwXEMRlOj9UY5nCeA8UN3a/82rUWRBeyBw==`. Package is MIT, copyright 2018 Dan Burzo, with no runtime dependencies declared; notice captured as `CULORI-LICENSE.txt`. Source file hashes, including all package JS source, are in `package-source-sha256.json`. No package source was changed or vendored into the repository.

Recorded runtime: Node `v24.14.1`, V8 `13.6.233.17-node.44`, Darwin arm64. The real Decimal and color constructors are read, type-stripped and imported in memory; Node reports its experimental stripping warning. Exact arithmetic/formatter source text is reused from the frozen previous probe, with ten byte and nine formatter fixtures rechecked. These results are **DTW-owned**, not a Culori precision feature. Alpha and exact canonical identity remain outside the backend.

The same frozen 36 literals × five targets supply all 180 cases/25 pairs. Expected coordinates and common-sRGB values are unchanged. The independent Python reference executes the previous rational CSS matrices/equations at 70-digit Decimal precision, with binary Python libm for polar trig; candidate output never creates expected values. Shared CSS matrix provenance and binary transcendental uncertainty remain limitations, as recorded in the previous reports. This is not certified arbitrary-precision color truth or an independent color-science standard. The original fixture-generation coefficient-context limitation is unchanged; no frozen reference was regenerated. The previous guard investigation's 80/160/240-digit fixtures and actual classifications are read as historical controls, not claimed as Culori internal arithmetic.

Both prior frozen manifests verified every listed file after the run (`baseline-checks.json`). No tracked file changed before report authoring. This experiment's manifest freezes its own source/results/report and read dependencies. Scripts do not install, build, stage, commit or push.

## Three measured layers

1. **Raw Culori:** object-channel conversion without CSS parsing, formatting, gamut mapping or equation overrides. `results.json` retains raw output and actual public callback input/output traces. Missing channels are omitted from raw objects; explicit JSON null means absent output, not zero.
2. **Minimal DTW policy adapter:** real constructor; exact same-space return; exact source-neutral detection; narrow powerless-missing-hue eligibility; canonical HSL percent↔normalized units; input text/magnitude and output endpoint guards; detected complete RGB source-number collision; explicit neutral target coordinates; original alpha copied exactly; shortest binary-result text rounded once to 12 significant digits, ties-to-even; real final constructor. Every intervention is visible in `probe.mjs`. No transfer, matrix, HSL or polar equation is replaced. Its `success` status means only endpoint-adapter success, **never strict all-stage certification**.
3. **Still unimplemented:** internal-stage guard enforcement, general cancellation/underflow certification, actual editor/application behavior and browser gates. The known guard fixtures expose this gap rather than disguising it with accepted endpoint candidates.

## Conversion results

| Measurement | Culori 4.0.2 + minimal adapter | Frozen Color.js narrow-route control |
| --- | --- | --- |
| Constructor-valid core cases | 173 | 174 |
| Expected extended-HSL refusals | Six | Six |
| Unexpected core refusals | **One: tiny red→HSL** | Zero in the frozen sample |
| Maximum raw common-sRGB difference | `2.2127716616166654e-14` | `1.6713498145703114e-14` |
| Maximum formatted common-sRGB difference | `1.0292361366012729e-10` | Same |
| Maximum raw OKLAB difference | `5.690524940826115e-16` | `3.847987241194044e-16` |
| Maximum formatted OKLAB difference | `4.421894216000836e-13` | Same |
| Maximum wrapped raw hue error, chroma ≥ `1e-4` | `1e-13` degrees | Same |
| Maximum formatted hue error | `4.4387e-10` degrees | Same |
| 100-cycle paths completed | 12/12; maximum sRGB drift `8.17827805477e-12` | 12/12; `8.17774015172e-12` |
| 32 raw cube-corner round trips | Maximum overshoot `2.8329560919360118e-14` | `3.46947470752923e-14` |

All successful sampled candidates meet the existing proposed `1e-8` common-RGB/OKLAB and `1e-5`-degree hue thresholds; round trips meet `1e-6`. Refusals have an explicit not-applicable candidate metric, not a default zero. Every core status is asserted; the observed tiny-HSL refusal is separately asserted as a known failure against the required fixture status, so reproduction succeeding does **not** label that refusal acceptable. All applicable metrics are finite. Comparison differences at these sizes do not establish meaningful numerical superiority of either backend. Frozen Color.js results were read, not rerun.

**Material failure:** sRGB `[0.000000000000001,0,0]`→HSL should give `[0,100,0.00000000000005]`. Culori produces saturation `100.07999171934436`; 12-digit formatting leaves `100.079991719` and the real constructor rejects. Its `1 - abs(max + min - 1)` denominator cancels low-order information. Common-sRGB absolute error is only `3.999585967218e-19`, illustrating why accuracy thresholds cannot substitute for expected constructor/status assertions. An epsilon, saturation clamp or pretending this is an ordinary extended-target refusal would violate the policy. Correcting it requires owning/replacing actual HSL arithmetic, rather than routine units/formatting adaptation. A stable equation replacement was not implemented.

Tiny red→OKLCH succeeds raw: chroma `1.098159548534975e-6`, hue `29.233880279627872`; no Color.js-like suppression occurs. Exact gray raw RGB→OKLAB already zeroes axes after **Number equality**, so exact text-neutral detection and collision refusal must precede the backend. Near-neutral distinctions are not certified by that behavior. Direct tiny OKLAB axes stay nonzero through Culori's polar route; source uses `sqrt(a*a+b*b)`, whose hidden products remain subject to strict guard interpretation.

All 34 previous special fixtures retain the same observed statuses: missing components in every position, eligible powerless missing hue, forbidden chromatic missing hue, invalid text, exact alpha variants, long identity, numeric powerless hue identity, constructor hue normalization, endpoint guards and source collision. The raw missing values are retained separately: Culori can treat absent axes/channels as zero, which is unsuitable as general literal-conversion eligibility. The adapter supplies eligibility rather than inheriting those defaults. Extended P3→RGB stays extended (for example P3 green has negative red/blue and green above one); six independently expected extended-HSL targets still refuse. No serializer or gamut mapping is invoked. All sampled inputs retain JSON serialization: this is pure-probe nonmutation, not editor failure atomicity.

## Guard coverage and actual routes

All **24** previous guard fixtures run through raw Culori and the endpoint adapter, with individually asserted observed statuses. Their earlier coordinate/scalar classifications are recorded separately and do not become Culori acceptance claims. In particular:

- Minimum red `1e-100` and minimum exact gray produce plausible final OKLCH and endpoint success, yet an actual separate Culori RGB→linear call produces `7.739938080495356e-102`, outside the guard. The stock direct RGB→OKLCH callback invokes that transfer internally. Endpoint success is therefore insufficient, including for neutral gray.
- Maximum red `1e6` separately linearizes to `220899205674266.94`; stock conversion eventually fails target lightness, but that final refusal is not proof of early intermediate enforcement.
- Red `1e-97` separately linearizes within the magnitude domain; the prior coordinate/scalar split concerns small matrix products. Culori combines matrices differently, so the old split does not prove exactly the same scalar event occurs in Culori. Actual built-in scalar terms remain opaque.
- The long exact RGB source collision refuses before conversion. Near gray `[0.5000000000000001,0.5,0.5]` instead produces raw chroma `3.3766115072321297e-16` and hue `189.4623222080256`. Its finite endpoint success does not certify preserved hue significance. The earlier route's cube-root pair collapse is **not** asserted to be a measured Culori collapse: combined coefficients/order differ and these operands are hidden.
- Tiny-axis, tiny-chroma, quarter-turn trig residue, missing hue, numeric identity, target-invalid and text-budget controls remain individually recorded. No conservative cube-root or ill-conditioning classifier is adopted, so there is no unexercised classifier branch being presented as certified behavior. Guard granularity and uncertainty refusal remain unagreed hypotheses.

`routeInventory` records all 25 actual public routes. Five identities invoke no conversion callback. RGB directly invokes P3/HSL/OKLAB/OKLCH callbacks; other pairs generally go through RGB, except direct OKLAB↔OKLCH. Wrappers registered through public `useMode` record callback arguments/results and return the original calculation unchanged. No global Math hook, shadow kernel or source instrumentation is used.

The public RGB↔linear, linear↔OKLAB and P3↔XYZ callbacks permit composition of some meaningful stages, but internal transfer powers, XYZ sums, LMS products/cube roots, inverse cubes, HSL divisions and polar products remain hidden. Inspecting [`converter.js`](https://github.com/Evercoder/culori/blob/v4.0.2/src/converter.js), [`convertLrgbToOklab.js`](https://github.com/Evercoder/culori/blob/v4.0.2/src/oklab/convertLrgbToOklab.js), [`convertOklabToLrgb.js`](https://github.com/Evercoder/culori/blob/v4.0.2/src/oklab/convertOklabToLrgb.js), [`convertRgbToHsl.js`](https://github.com/Evercoder/culori/blob/v4.0.2/src/hsl/convertRgbToHsl.js) and [`convertLabToLch.js`](https://github.com/Evercoder/culori/blob/v4.0.2/src/lch/convertLabToLch.js) confirms the boundaries. These sources were inspected from the integrity-verified package on 8 November. Separate lower-level transfer measurements are explicitly diagnostic, not proof that a preflight controls the stock opaque route.

Consequently a boundary wrapper cannot close the current contract. Observable named transfers alone would still not settle LMS/root cancellation; full explicit-scalar enforcement would require additional ownership. This evidence does not silently choose the interpretation, nor claim native Math internals can be certified.

## Future mixing and gradient fit

**28/28 analytic cases pass**, with finite component errors below `1e-12`. These are provisional future-operation policies, not additions to Increment 003 or chosen gradient semantics. Expected values are rational linear interpolation or geometric hue expectations, never computed from candidate outputs. Raw same-space mixing is unrounded; canonical gradient construction is not tested.

- Linear-RGB red→blue at 0, 0.25, 0.5 and 1; identical stops; outside parameters clamped to the first/last endpoint.
- OKLCH hue 350→10 midpoint: shorter/increasing gives 360 (geometric 0), longer/decreasing gives 180. Raw 360 is a library interpolation representation; canonical hue normalization belongs to DTW.
- Transparent red→opaque blue: straight midpoint `[0.5,0,0.5]`, alpha 0.5; premultiplied midpoint `[0,0,1]`, alpha 0.5. Unequal 0.25/0.75 endpoint alpha gives premultiplied `[0.25,0,0.75]`. Both-zero alpha produces black under Culori's premultiplied convention and retains straight components under straight interpolation. This convention requires an eventual product contract.
- Missing hue carries the defined endpoint; two missing hues stay missing. A **numeric** powerless hue participates in the arc. These are measured interpolation rules, distinct from current literal conversion eligibility.
- Extended P3 and RGB same-mode endpoints stay extended; no implicit clipping/mapping. Three-stop explicit and automatically positioned segmentation produces the analytic local interpolation. Duplicate positions form a hard stop: exact duplicate position picks the left color, immediately after picks the right color. Left/right continuity must be chosen explicitly for DTW.
- A black RGB→white linear-RGB seam has analytic output `[0.25,0.25,0.25]`. Its actual trace invokes `rgb>lrgb` for the RGB stop. The equivalent same-linear-mode stops invoke **zero conversion callbacks**. Thus preconverted same-mode stops can genuinely bypass built-in endpoint conversion in this path; this is not inferred from equivalent final numbers alone.

These results substantiate useful reuse of [`interpolate`](https://github.com/Evercoder/culori/blob/v4.0.2/src/interpolate/interpolate.js), alpha mapping, hue fixups and stop normalization. They do not establish CSS-gradient conformance, desired default space, rounded-stop equivalence, mixed extended-endpoint conversion accuracy, or strict stage guards during interpolation. Mixed-mode stops can reintroduce Culori's converter and numerical defects; a hybrid must keep the actual same-mode seam explicit and separately own output conversion. Default premultiplication, missing semantics, stop continuity, extrapolation and rounding remain decisions for a future contract.

## Limits and handoff

This is Node-only research. No browser/cross-runtime gate, bundle size, throughput, supply-chain audit, real gradient model, durable storage, application session, Apply/Cancel or UI failure behavior was measured. No root/prototype dependency, lockfile, source, test, config or prototype code changed; no builds or application regression tests were run because no application implementation changed. Existing root checks cannot certify these new equations. No precision, guard, preview epsilon or target schema was relaxed. The preview corner result supports retaining the existing allowance for further investigation, not a universal error bound.

Concrete next decision: specify the observable-stage/uncertainty contract, then choose a bounded owned strict conversion route versus custom Culori conversions that would own largely the same math. Keep qualified upstream interpolation as a viable future reuse path. Culori's ordinary conversion accuracy and manipulation utility are established on these fixtures; a smaller sufficient strict conversion adapter is **not** established. Independent review of this frozen snapshot is separate from author verification.

Suggested commit: `docs: qualify Culori conversion and interpolation seams`.
