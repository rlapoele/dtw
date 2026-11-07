# Increment 003: intermediate guards and cancellation investigation

7 November 2026. **Bounded research complete; numerical gate remains open.** Baseline `ad2920d9a8f296f353974413c645a2e046f3d359`. Authorized scope: isolated guard/cancellation probes and this report. No application implementation, production dependency selection, dependency edits, installs or builds. The [agreed policy](003-color-policy-proposal.md) remains authoritative and unchanged. This follows the [previous feasibility report](003-numerical-feasibility-report.md) and its [independent review](003-numerical-feasibility-review.md).

## Recommendation

Prefer a small explicitly owned, observable equation route over an endpoint wrapper around Color.js `.to()` if implementation is later authorized. The research route demonstrates useful ordinary acceptance alongside intermediate rejection and stronger cancellation detection. A shadow preflight followed by an opaque library call does **not** establish that the actual call executes the guarded stages or equivalent arithmetic. Reusing candidate constants is separate from selecting that candidate as a production dependency.

Do not claim that the present probe closes the full conversion gate. Two points need resolution before a production contract can be made concrete:

1. Clarify which intermediates are guarded: named coordinate stages, every explicit arithmetic term, and/or implementation-private internals of functions such as `Math.hypot`. Both externally observable readings are measured below. They produce a real different acceptance result; choosing one silently would amend behavior.
2. Define a reviewable refusal contract for unresolved cancellation risk. Exact source-number collision, exact binary dot-product checks, and injective-function pair collapse catch demonstrated losses. They cannot certify every nonlinear distinction. An ill-conditioning ratio is a useful conservative signal, not a proof or an agreed threshold. Universal certification would require additional bounded-error machinery or a restricted certified subset; its implementation/maintenance cost exceeds this investigation. There is no evidence supporting a global ulp bound on JS transcendental functions.

A bounded next decision is therefore to specify the observable stage boundary and require refusal whenever a route cannot establish a needed zero/nonzero or hue distinction, then authorize only the resulting narrow kernel work. This will conservatively reject some near-neutral inputs while retaining exact editing and identity. If universal certification of every low-order distinction is intended, the present binary route is insufficient. No production kernel or policy revision is approved here.

## Reproduce and identify the evidence

From repository root, with the already installed candidate and existing Node/Python:

```sh
python3 output/experiments/003-guards-cancellation/reference.py
node output/experiments/003-guards-cancellation/probe.mjs > output/experiments/003-guards-cancellation/run-summary.json
python3 output/experiments/003-guards-cancellation/analyze.py
shasum -a 256 -c output/experiments/003-guards-cancellation/SHA256SUMS
```

[Source/results directory](../../output/experiments/003-guards-cancellation/). `probe.mjs` is disposable research route **v1**, not application/domain implementation. Recorded Node `v24.14.1`; Color.js local manifest `0.7.1`. The existing constructor is read/type-stripped/imported in memory and validates calculated candidates; source files are untouched. The frozen formatter text is read from the previous probe, without executing its run or rewriting it. Reference matrix text is parsed from the previous reference source, never imported as cached Decimal objects. Hash manifest includes these read dependencies and directly used installed candidate source modules.

The reference rebuilds **every** matrix within each declared **80/160/240-digit** Decimal context. This avoids cached low-precision coefficients. In the previous reference-generation run, initial rational-matrix definitions were evaluated before its local 70-digit context; the previous analyzer itself set 70 digits before importing that module. The limitation therefore concerns the earlier generated fixture coefficients, not a claim that the analyzer imported them at default precision. It does not invalidate prior ordinary-tolerance metrics. New 160/240-digit agreement is recorded in `analysis.json`; it is precision-stability evidence, **not** a certified interval or exact-zero proof. Nonintegral Decimal power is not a general certified oracle. Python reference has no high-precision trig claims; this run compares rectangular results only.

Equation provenance is the [CSS Color 4 dated CRD, 3 November 2026, conversion sample code](https://www.w3.org/TR/2026/CRD-css-color-4-20261103/#color-conversion-code), previously verified for the agreed policy. The investigator's fresh fetch failed; the independent reviewer subsequently fetched this pinned CRD successfully and checked its constants. That verification is attributed to the reviewer, not the investigator's failed request. Candidate constants/evaluation order are inspected directly in installed `spaces/srgb-linear.js`, `spaces/oklab.js`, `spaces/srgb.js`, `multiply-matrices.js`; their exact hashes are included. CSS sample code is informative; neither agreement nor this experiment promises blanket CSS conformance. Math functions have implementation-approximated semantics in [ECMAScript](https://tc39.es/ecma262/multipage/numbers-and-dates.html); Decimal nonintegral power limitations are documented in [Python 3.9 Decimal](https://docs.python.org/3.9/library/decimal.html#decimal.Context.power). The coordinator checked these two primary references during this investigation.

## Route and observability inventory

| Route/stage v1 | Observable checks | Boundaries of evidence |
| --- | --- | --- |
| Existing constructor → exact text/Number | Constructor first, 4,096-character component budget, numeric source bounds, differing exact components mapping to equal Numbers | Pair collisions are sufficient loss signals, not a complete audit of decimal approximation. Alpha is copied exactly. Identity bypasses numerical limits and preserves authored text. |
| sRGB → linear → XYZ → LMS | Every resulting coordinate, explicit transfer branch arithmetic, each matrix product and left-associated partial sum | Constants taken from installed candidate; reference uses CSS rational RGB coefficients independently. This is an explicit research route, not an instrumented `.to()`. |
| LMS → cbrt → OKLAB | Roots and matrix coordinates; exact binary rational dot checks; distinct LMS coordinates collapsing to equal roots | Native cbrt internals/error bounds unavailable. Pair collapse proves numerical loss in this stage; whether every such internal loss matters to the final authored result can require conservative overrefusal. |
| OKLAB → raw OKLCH | `Math.hypot` chroma, angle output, final constructor after 12-significant-digit rounding | No library achromatic epsilon. `hypot`/`atan2` internals opaque; no global polar accuracy proof. |
| OKLCH → OKLAB | Radian/trig values and axis products; missing hue allowed only at exact zero chroma | Native trig internal operations unobserved; a 90° cosine residue is not proof of a nonzero mathematical axis. |
| Exact neutral RGB → neutral OKLAB/OKLCH | Exact authored equality selects transfer/cbrt lightness, guards the named neutral linear coordinate, and assigns zero axes; chroma zero/`none` hue | Explicit policy branch avoids manufacturing hue from matrix residue. No approximate neutral threshold. |
| Opaque Color.js `.to()` | Endpoints only through ordinary public call | Cannot enforce all intermediate guards. A preflight trace cannot certify equivalence without a separately verified implementation contract. |
| P3, HSL, inverse rectangular routes | Not added to this bounded experiment | Prior feasibility samples remain evidence; no new intermediate-guard/cancellation certification for these routes. |

Scalar diagnostics cover explicit transfer terms, matrix terms/partial sums, cbrt and sampled polar outputs. They do not expose every native arithmetic step within Math functions, nor every subexpression of polar angle normalization. Consequently the scalar-reading counts below are **sampled diagnostics**, not exhaustive scalar enforcement. The named-stage reading checks all named coordinates on the implemented research routes. The diagnostic path records violations and continues to expose downstream evidence; it returns refusal rather than an accepted output. Production code should stop before unsafe dependent operations, rather than copying this research logging strategy.

## Observed results and expected classifications

24 named cases: under coordinate-stage reading, **16 sampled successes, 6 required refusals, 1 proposed conservative refusal, 1 exact identity**. Under sampled scalar reading, **15 sampled successes, 7 required refusals, 1 proposed conservative refusal, 1 identity**. No unresolved result is counted as a success. The probe contains explicit expected-status assertions for important controls and refusals, including the scalar split and new cbrt collapse. `sampled-success` means no demonstrated necessary distinction loss and observed guards/constructor pass for that sample; it is not universal numerical certification. All 24 input object serializations remain identical, including refusals. These are pure-probe observations, not editor/session/application atomicity tests.

| Case | Measured evidence | Disposition |
| --- | --- | --- |
| sRGB interior `[0.2,0.4,0.6]`, RGB primaries, transfer branch immediately below/at/above `0.04045` | Eight ordinary/reference controls have maximum raw OKLAB absolute difference `3.3306690738754696e-16` against 240-digit reference converted to Number | Useful sampled acceptance, not refuse-everything behavior. |
| Tiny red `1e-15` | Nonzero raw chroma retained, named/scalar sampled guards valid | Accepted; no near-neutral threshold. |
| Tiny direct OKLAB axis `1e-15` and two axes `1e-17` | Raw polar output retains nonzero chroma/hue | Accepted; direct polar paths do not introduce a matrix cancellation. |
| sRGB red `1e-100` | Linear/XYZ/LMS coordinates fall below `1e-100` | Required calculation-limit refusal despite valid source magnitude. |
| Exact gray `[1e-100,1e-100,1e-100]` | Neutral transfer produces `7.739938080495356e-102`; the named `neutral.linear` coordinate is below the guard | Required refusal under both readings. Exact-neutral handling does not exempt intermediate magnitudes. |
| sRGB red `1e6` | Transfer/linear/XYZ/LMS exceed `1e6` | Required calculation-limit refusal; finite final numbers do not rescue it. |
| sRGB red `1e-97` | All named coordinates pass; three LMS scalar products fall below `1e-100` | Named-stage success, scalar refusal. Concrete policy ambiguity; no implicit preferred interpretation. |
| sRGB `[0.500000000000000000000001,0.5,0.5]` | Different exact source strings map to equal Numbers | Required numerical refusal; source collision detected before interpreting final residue. |
| sRGB `[0.5000000000000001,0.5,0.5]` | Source Numbers are distinct; three distinct LMS values become equal cbrt outputs. Final axes contain nonzero matrix residue | Proposed conservative refusal (`conservative-refusal`), an unagreed research hypothesis. An endpoint nonzero-chroma test or source-collision-only guard misses the measured internal loss; its necessity for every final rounded candidate is unproved. |
| Exact gray/black/white | Neutral policy branch produces zero axes/chroma and `none` hue | Accepted; legitimate exact zero is not blanket-refused. |
| OKLCH `[0.5,0,none]`, numeric powerless identity hue `270` | Narrow missing-hue eligibility works; identity retains numeric hue | Accepted and identity respectively. |
| OKLCH hue 90° | `cos(π/2)` is about `6.12e-17`; axis residue remains numeric | Shows unproven zero identification at trig boundaries; not silently snapped. This sample passes observed policy guards but does not certify mathematical axis zero. |
| sRGB red `2` → OKLAB, 4,097-character input | Existing lightness validation refuses target; text budget refuses before Number conversion | Required target/text refusal. |

The largest raw measured OKLAB difference across **all 11** reference cases is `1.4551915228366852e-11`, at the already-refused huge source; it is not counted as an accepted ordinary error. Finite metric assertions are mandatory; missing metrics remain `unmeasured`, never zero. No full 25-space sweep, 4,096-digit arithmetic sweep or browser run was attempted.

## Cancellation evidence and proof limits

Three independent exact Fraction linear controls use `[1,1,1]` as a dot row. `[1,-1,0]` is exact legitimate zero; `[1,1e-17,-1]` is exact nonzero `1/100000000000000000` but the left-associated binary dot returns zero; `[1,-1,1e-17]` retains its small value. The probe independently reconstructs each input binary64 as an exact integer/power-of-two rational and evaluates the dot exactly using BigInt. Thus it can distinguish legitimate zero from a rounded-to-zero dot **for those actual binary inputs and finite matrix coefficients** without a guessed epsilon. This does not undo earlier source quantization or establish that approximate cbrt/trig values equal ideal values.

The exact-dot signal generalizes systematically to each inspected matrix row: binary sum zero plus exact binary-rational dot nonzero is a demonstrated arithmetic collapse and required refusal. Exact zero remains allowed. It is stronger than comparing a result to a near-neutral tolerance. It does not detect every loss where the result stays nonzero.

The cbrt pair signal relies on injectivity of the ideal real cube root: distinct finite inputs must have distinct exact roots. The synthetic pair `1` and `1 + Number.EPSILON` maps to equal `Math.cbrt` results on this runtime; the real near-neutral color above exhibits the same stage failure. This proves some internal distinctions were lost, **not** that all cross-runtime errors have a known bound or that every loss would change the final rounded candidate. Conservative refusal here can overrefuse. The classifier now labels this signal alone `conservative-refusal`, distinct from `required-refusal`; this is a proposed research safety choice, not adopted policy or proof that every such loss affects a distinction required by the final rounded candidate.

The probe additionally records an **unagreed diagnostic** ratio `abs(sum)/sum(abs(products)) < 1e-12`. If this alone occurs, classification is unresolved, not passing. It is no certificate and must not become a production threshold by copying the scratch source. A robust future refusal policy needs evidence for how uncertainty propagates through earlier nonlinear steps; finite/interval agreement alone cannot prove exact mathematical zero. In particular, residue from approximate matrices and trig cannot be assumed to be authored chroma. Source equality and explicit policy-neutral branches remain the reliable exact-neutral cases identified here.

## Independent-review correction

Review finding F1 identified that the initial research route tagged neutral transfer only as a scalar observation, letting exact gray at `1e-100` pass the coordinate reading despite its below-limit linear coordinate. The corrected route records `neutral.linear` as a named coordinate while retaining its scalar trace. A dedicated fixture explicitly asserts refusal under both readings and the named failing stage. Results/counts and hashes were regenerated. Exact-neutral branches retain the same service limits as chromatic routes. Review also prompted the separate conservative-refusal label for cbrt pair loss and clarification of the previous reference-generation precision context. No agreed policy or prior frozen research was edited.

## Remaining boundaries and handoff

This investigation establishes feasibility of observable named-stage guarding and useful conservative loss signals, plus concrete reasons an endpoint wrapper is insufficient. It does not establish complete all-space coverage, exhaustive cancellation detection, browser/runtime agreement, native Math error bounds, exact target-boundary behavior in every route, dependency packaging, or real draft preservation. Exact authored editing/identity must remain available independently of any derived calculation refusal. No source, test, prototype, root configuration, dependency or lockfile edits were made; no staging/commit/push occurred.

Suggested commit: `docs: record bounded color guard and cancellation evidence`.
