# Increment 003 numerical feasibility evidence

7 November 2026 — bounded research complete; application delivery **Not started**. Base: clean `dev`, `52a631a2acedbc52f3cb61d6ad1fb7a95242e7c4`. The user authorized isolated numerical preparation and this report, not application implementation or dependency changes. The [agreed numerical policy](003-color-policy-proposal.md) remains unchanged. Coordinator-owned authorization/status edits are outside this probe snapshot.

## Recommendation and material findings

Continue evaluating Color.js **0.7.1** for rectangular transforms with a narrow project-owned raw OKLAB↔OKLCH polar route. Do not select/integrate it yet. Its default OKLCH conversion demonstrably destroys small nonzero chroma. The narrow route supports the representative accuracy thresholds below, exact decimal arithmetic is feasible, and sampled raw boundary residue supports retaining the proposed `1e-10` preview allowance for further validation. This is evidence to proceed to the next validation phase, not a complete engineering-gate pass.

The candidate's opaque conversion call does not enforce the agreed intermediate calculation guards. Explicitly observed stages cross those guards even when input/final components are within them: sRGB red magnitude `1e-100` linearizes to `7.739938080495356e-102`; magnitude `1e6` linearizes to `220899205674266.94`. Those requests must refuse under the agreed all-stage limits, irrespective of finite final results. An endpoint-only wrapper is insufficient. A next investigation must verify stage-by-stage guard enforcement or reject such paths conservatively with demonstrable coverage. Do not loosen the guard to fit a library. The bounded alternative is a small explicit CSS-equation kernel, making stages observable; its cost is ownership of matrices/transfers, numerical tests and browser verification rather than a library call. Neither alternative is implemented here.

Very close exact non-neutral inputs can collapse on binary readback (`0.5000000000000000000000001`, `0.5`, `0.5` becomes three equal Numbers). The scratch harness detects this specific collapse and refuses; this is not a general cancellation detector. Arbitrary cancellation/underflow throughout the accepted service domain remains open.

## Reproduction and provenance

Run from the repository root, without installs or builds:

```sh
python3 output/experiments/003-numerical-feasibility/reference.py
node output/experiments/003-numerical-feasibility/probe.mjs > output/experiments/003-numerical-feasibility/run-summary.json
python3 output/experiments/003-numerical-feasibility/analyze.py > output/experiments/003-numerical-feasibility/analysis-summary.json
```

- Recorded runtime: Node `v24.14.1`, V8 `13.6.233.17-node.44`, Darwin arm64; Python `3.9.6`. Node emits its experimental `stripTypeScriptTypes` warning. The actual existing Decimal/color constructors are read, type-stripped and imported in memory; no domain source is rewritten.
- Candidate import: `prototypes/increment-003-v1/node_modules/colorjs.io/src/index.js`, installed package version `0.7.1`. Prototype lockfile points to [npm tarball](https://registry.npmjs.org/colorjs.io/-/colorjs.io-0.7.1.tgz), integrity `sha512-LY7OHnJZxHwT5UlzNa9bbhHHDbzB6yE5+3MIPwJEQKRvSCt/T4G7epsj+9j2BExUIIfXFIJGsIXUKdfrK9Q5tA==`. This records local manifest/lock provenance, not fresh tarball integrity verification or a latest-release claim.
- MIT license, copyright 2021 Lea Verou and Chris Lilley; installed package has no runtime dependencies. Installed `src/` occupies approximately 612 KiB on disk; that is **not** a bundled/download size. The full index registers many spaces and side effects. Browser bundle/tree-shaking effects and the eventual narrow import surface remain unmeasured.
- Equation source: [CSS Color 4 CRD, 3 November 2026, sample conversions](https://www.w3.org/TR/2026/CRD-css-color-4-20261103/#color-conversion-code), checked 7 November. It is informative sample code in a draft. W3C attribution/license links are retained in the independent probe. [Color.js gamut documentation](https://colorjs.io/docs/gamut-mapping) distinguishes coordinate conversion from serializer gamut mapping. Neither `.toGamut()` nor `.toString()` is used.
- Source-driven verification and the agent-skills scope/verification guidance were applied proportionately to research. No prototype helper was used as an oracle.

`reference.py` independently transcribes the dated CSS rational RGB/P3 matrices, extended transfer functions, D65 OKLAB matrices, HSL equations and raw polar formulas. Python Decimal uses 70 significant digits for matrix, power and byte calculations; Python `math` supplies polar trig/angle, so those steps are binary libm, **not** high-precision transcendental truth. Candidate values never generate expected fixtures. The equations/constants share provenance with Color.js, including the recalculated OKLAB matrices; this is independent code/arithmetic execution, not an independent color science standard or proof against shared source errors. CSS sample achromatic hue suppression is deliberately excluded to follow DTW's agreed policy. Exact neutral target treatment is project policy layered over equations; raw reference residue near neutrality is not an authored hue oracle.

The scratch files in [the experiment directory](../../output/experiments/003-numerical-feasibility/) are disposable research, not approved implementation. `reference.json` records all inputs/expected coordinates; `results.json` records raw default/narrow coordinates, formatted constructor results and special cases; `analysis.json` records common-basis comparisons. The adjacent `SHA256SUMS` freezes these artifacts and the report. No production/prototype source, root config, dependency or lockfile was changed, and no Git staging/commit/push occurred.

## Measurements and classifications

| Check | Evidence and result |
| --- | --- |
| Exact byte arithmetic | **Pass on 10 fixtures.** Python Decimal expectations match separate BigInt division. Includes exact terminating long result, fractional/extended values and all specified repeating ratios. |
| Significant-digit formatter | **Pass on 9 fixtures.** Positive/negative ties-to-even, 12/18-digit ties, carry, exponent expansion and negative zero. No `toFixed` or intermediate rounding. |
| All five-space pairs | **Sampled, not universally proved:** 36 literals × 5 targets = 180 cases, covering all 25 pairs (36 identities, 144 directed conversions). Interior/boundary/extended/near-neutral inputs. 174 constructor-valid candidates, 6 expected target-schema refusals. All source RGB bases fall in `[-1,2]` for this sample. |
| Independent common-sRGB comparison | Raw narrow route maximum absolute channel difference `1.6713498145703114e-14`; formatted constructor-valid candidate maximum `1.0292361366012729e-10`, below proposed `1e-8`. No failed sampled numerical accuracy threshold. Refusals are not counted as successful conversions. |
| OKLAB and chromatic hue | Raw OKLAB maximum difference `3.847987241194044e-16`; formatted candidate `4.421894216000836e-13`, below `1e-8`. Wrapped hue at chroma≥`1e-4`: raw `1e-13°`, formatted `4.4387e-10°`, below `1e-5°`. Below that chroma comparisons use common rectangular RGB basis, not angle accuracy. |
| 100 deliberate round trips | 12/12 sampled paths completed 100 cycles (three sRGB colors through each other space). Worst measured sRGB drift `8.17774015172e-12`, below `1e-6`. This says nothing about passive editor browsing or exact undo. |
| Raw boundary noise | Eight sRGB cube corners through four other spaces and back: **32 samples**, maximum raw overshoot `3.46947470752923e-14`, below preview-only `1e-10`. Includes unrounded computed intermediate coordinates; it is not exhaustive boundary coverage. |
| Refusal/source safety | Six HSL target refusals, missing/invalid text, endpoint service guards, specific collapsed distinction and nonfinite stubs preserve input object serialization in the harness. This establishes pure-probe nonmutation, **not** actual draft/application atomicity. |

The formatted common-sRGB-basis error maximum is slightly greater than `1e-10`; this measures numerical difference from the reference, not gamut-boundary overshoot, and does not justify widening the preview allowance. A preview converts the current authoritative literal to raw sRGB and checks those raw output coordinates without applying authored-candidate 12-significant-digit formatting to the preview output. A legitimately promoted or committed 12-significant-digit literal is a valid new authoritative source for that calculation. Boundary validation of the actual preview path remains required.

Selected exact decimal fixtures (the full machine-readable table contains all fixtures):

| Input/operation | Independent expected = measured |
| --- | --- |
| `127.5 / 255`; `510 / 255`; `-255 / 255` | `0.5`; `2`; `-1` |
| `1 / 255`; `30 / 255` | `0.00392156862745098039`; `0.117647058823529412` |
| `128 / 255`; `250 / 255`; `254 / 255` | `0.50196078431372549`; `0.980392156862745098`; `0.99607843137254902` |
| `0.000000000001 / 255` | `0.00000000000000392156862745098039` |
| `31.481481226481481226481481195 / 255` | Exact `0.123456789123456789123456789`, **not** shortened to 18 digits |
| `1.234567890125`, 12 significant digits | `1.23456789012` (even tie); negative gives `-1.23456789012` |
| `1.234567890135`, 12 significant digits | `1.23456789014` (odd tie); negative gives `-1.23456789014` |
| `9.999999999995`, 12 significant digits; `-0` | `10`; `0` |

Selected color/edge evidence:

- Tiny sRGB red `[0.000000000000001,0,0]`: independent OKLCH chroma `0.000001098159548534974741959181067268663585141293298568827215251218530353152`; default library returns `0`/`null` hue (**incompatible**). Narrow route gives `0.000001098159548534976`, hue `29.23388027962784`; 12-digit candidate retains nonzero chroma `0.00000109815954853`. Installed `lch.js` uses `abs(a)<8e-6 && abs(b)<8e-6` for OKLCH; this default cannot implement the policy.
- sRGB red→HSL is exactly `[0,100,50]`. Red→OKLAB candidate is `[0.627955363921,0.224863068426,0.125846277331]`. Hue calculated just below `360` rounds to `360` and the actual constructor returns `0`; large negative entered hue is normalized exactly before conversion.
- Black/white/gray and zero saturation/chroma receive policy-neutral targets, including `none` hue. Numeric powerless OKLCH hue `270` survives identity. Tiny nonzero OKLCH chroma `0.000000000000001` remains numeric through the narrow route. Neutral handling is explicit; library null hue cannot be blindly fed into numeric guards.
- P3 green→sRGB candidate `[-0.511604982585,1.01826565794,-0.310674621291]` remains extended. It is outside bounded preview gamut. No clipping/mapping. The same source→HSL is refused because saturation `301.951723303` exceeds 100. Other six-case refusal details are in `analysis.json`; none was silently repaired.
- Missing component in every source position: only HSL `[none,0,50]` and OKLCH `[0.5,0,none]` cross-convert; chromatic missing hue and all other missing positions refuse. Same-space long Decimal plus `none` and long alpha survive exactly. Alpha `0`, `1` and `0.123456789123456789123456789` give identical color components and retain their exact text. No premultiplication.
- Input `-`, `0.`, `1e2` rejects via the existing constructor. Endpoint guards test `1e-100`, below it, `1e6`, above it and 4097-character source. Guard success at an endpoint does **not** mean all-stage policy success. OKLAB `L=1e-100`→sRGB produces below-limit output and refuses. NaN/±Infinity endpoint stubs classify numerical failure; they do not simulate arbitrary internal-stage failure injection.
- Exact byte input budgets: a 4096-character tiny decimal gives a nonzero 4116-character output within the 4200 budget; 4097 characters refuses. A 4096-digit integer produces 4096 output characters without allocating an unbounded exponent. The outer input/output budget logic is sampled, not a global canonical Decimal resource policy.
- Synthetic preview boundary checks cover inclusive `-1e-10`/`1+1e-10` and immediately outside. Direct sRGB `1.000000000001` must withhold preview by exact Decimal comparison; that required delivery preview behavior is **not implemented/tested** by this raw-transform harness. Browser CSS serialization and specimen rendering remain unsupported here.

## Remaining gates and decisions

1. **Engineering gap, no policy change requested:** provide observable stage guards and systematic cancellation/nonzero-underflow detection, with explicit refusal semantics. Current endpoint harness cannot establish service-domain correctness. Operation-policy identity/equation revision and the production library route still need a final technical decision and independent review.
2. **Sampling gap:** broad randomized/adversarial and continuous boundary coverage, all intermediate stages, extreme magnitudes, hue stability and long-text multiplication budgets. The 180 cases do not prove correctness for all permitted inputs. Exact byte multiplication/display shortening was not integrated or separately validated as a delivery operation.
3. **Runtime gap:** Node only. Supported browser/cross-runtime fixtures, production imports/bundle effects, browser specimen checks and any Electron host checks are unperformed. Pure Node operation demonstrates no DOM host requirement for the inspected candidate path, not final packaging suitability.
4. **Application gap:** no real authoring operation, draft cache, token state, Apply/Cancel, passive exploration, incomplete-field retention, alias resolution or failure/session retention check. Source nonmutation and exact identity in the scratch probe cannot close those acceptance criteria.
5. **Verification gap:** no application implementation exists and no new production tests were added. This research did not rerun root regression/typecheck or prototype tests/build; those suites cannot validate these new numerical rules. Existing source/dependencies were unchanged. Independent review of the frozen research snapshot is separate from this report's author self-check.

No failed threshold was loosened, no authored boundary epsilon introduced, and no production dependency selected. The material incompatibility is the default neutral threshold; the narrow route is promising with the guard/cancellation gaps above. Return to the user before any policy amendment or application integration authorization.

Suggested commit: `docs: record increment 003 numerical feasibility evidence` (include the reproducible research artifacts intentionally; these experiment files are visible as untracked files).
