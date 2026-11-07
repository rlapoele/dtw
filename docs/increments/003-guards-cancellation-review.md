# Increment 003 guard/cancellation research review

7 November 2026 — independent review of bounded evidence, not application implementation or production dependency acceptance.

## Snapshot and assessment

Base: `ad2920d9a8f296f353974413c645a2e046f3d359`. Final report SHA-256: `1dccb808b17f57feb0ea829b336d67c50b2a307d5382779cc5d50099ddd70327`; probe: `b8b862f56750d4f53f33969a05a9e10ed3053e505259fcad62c03394b9f4a77e`; manifest: `c7e442d486026db65eddf5d077f07ccf7af6f10193e6cca1ba5ea08c6a075cdd`. Every listed report, artifact and read dependency verified against the final manifest. Coordinator-owned authorization/status documentation is outside this measurement review. Frozen files were not changed by the reviewer.

The corrected evidence supports the report's bounded recommendation to prefer an observable equation route over an opaque endpoint wrapper for further investigation. It does not certify a production kernel, select Color.js, settle intermediate granularity or adopt a cancellation-refusal rule. No required research findings remain after the corrections below. Numerical, browser and application gates remain open.

Expectations were derived from AGENTS.md, the reviewer workflow, the agreed parent contract and full numerical policy before inspecting the frozen work. Code-review and source-driven skills were applied proportionately. Previous feasibility results were treated as attributed prior evidence, not current proof.

## Findings and dispositions

**F1 — Required: neutral coordinate stage bypassed the coordinate classifier. Resolved.** Initial `probe.mjs:49–50` tagged the neutral transfer only as scalar. Independently probing exact gray `[1e-100,1e-100,1e-100]` returned `sampled-success` under the coordinate reading although its linear value was `7.739938080495356e-102`, below the agreed guard. Exact neutrality justifies zero axes, not exemption from intermediate magnitude limits. The final probe records `neutral.linear` as a coordinate, adds the gray endpoint fixture and asserts refusal under both readings with that failing stage. Independent rerun confirms the correction and absence of an accepted output. The original 23 recorded outcomes were reproducible; this finding exposed an omitted case rather than falsifying those observations.

**F2 — Required clarification: distinguish proposed conservative refusal from policy-required refusal. Resolved.** Ideal cube-root injectivity proves a distinction was lost when different LMS inputs produce equal binary roots. It does not prove that every such loss changes a distinction needed for the final rounded valid candidate. The final classifier and report separately label this signal `conservative-refusal`, an unagreed research hypothesis. The near-neutral case is withheld rather than counted successful. This avoids silently adopting a stronger production refusal policy. The coordinator also identified this concern independently.

**Precision-context clarification — resolved.** The report now correctly locates the previous low-precision rational coefficient issue in reference generation before its local 70-digit context; it does not claim that the previous analyzer imported at default precision. The new reference reconstructs all matrices inside each 80/160/240-digit context. This improves evidence without retroactively proving all prior reference digits.

## Independently verified evidence

Scripts and read dependencies were copied to `/tmp/dtw-guard-review-b9dmlv70/`, with the existing candidate installation linked read-only by convention. Running `reference.py`, `probe.mjs` and `analyze.py` there reproduced final `reference.json`, `results.json`, `run-summary.json` and `analysis.json` byte for byte. Node reported `v24.14.1`; the expected experimental TypeScript-stripping warning appeared. No install, build, production test/source/dependency edit or Git mutation was performed.

- All 24 cases reconcile: coordinate reading has 16 sampled successes, six required refusals, one proposed conservative refusal and one identity; sampled scalar reading has 15, seven, one and one respectively. No unresolved or withheld result is counted as success. All recorded event numbers and all 11 comparison metrics are finite. All input serialization checks pass.
- The eight ordinary/reference metrics reproduce maximum raw OKLAB difference `3.3306690738754696e-16`; the all-reference maximum `1.4551915228366852e-11` belongs to an already-refused huge input. Those numbers do not certify cancellation or convert refused inputs into successes.
- The explicit route actually computes its traced transfer, matrix, root and polar values. It is not a shadow trace used to certify an opaque Color.js call. Named stages and sampled scalar terms are distinguished; native Math internals and some polar subexpressions remain unobserved as disclosed.
- Minimum/maximum red and the corrected minimum gray refuse intermediate guard violations. Red `1e-97` passes named coordinates while three scalar products fail: this establishes a concrete interpretation difference, not authority to choose a reading.
- Exact Fraction checks independently confirm legitimate zero, erased nonzero and surviving nonzero linear controls. The BigInt binary-rational dot logic evaluates actual binary inputs/coefficient values; it does not recover pre-quantization or ideal nonlinear values. The source collision and real/synthetic cube-root pair collapses reproduce.
- Exact gray/black/white, powerless missing hue and numeric-hue identity are preserved by their declared routes. Tiny red and direct tiny OKLAB axes retain nonzero chroma. The 90-degree trig residue remains explicitly uncertified as an ideal mathematical axis value. No near-neutral epsilon is accepted.
- The pinned [CSS Color 4 sample code](https://www.w3.org/TR/2026/CRD-css-color-4-20261103/#color-conversion-code) was fetched successfully during review; extended sRGB transfer, rational sRGB matrix and rectangular OKLAB constants match the reference transcription. Shared equation provenance remains a limitation. [Python Decimal power documentation](https://docs.python.org/3.9/library/decimal.html#decimal.Context.power) and [ECMAScript Math semantics](https://tc39.es/ecma262/multipage/numbers-and-dates.html#sec-math.cbrt) support the report's distinction between precision stability and proof; no global transcendental error bound was established.

## Limits and handoff

The `1e-12` ill-conditioning ratio is an explicitly unagreed diagnostic; its standalone unresolved branch is not exercised by a recorded named case. The fixture assertions cover important statuses, not an exhaustive production classifier contract. Before reuse as a gate, add explicit expected outcomes for every case and a standalone unresolved control. These are future harness improvements, not blockers to this bounded evidence report.

This review does not establish P3/HSL/inverse-route intermediate coverage, universal cancellation detection, full scalar enforcement, ideal polar zero classification, browser/cross-runtime behavior, packaging or real draft/application atomicity. Continuing after a recorded violation is diagnostic research behavior, not an approved production control flow. The report identifies these limits and leaves numerical limits, formatting precision, preview allowance and proposed accuracy thresholds unchanged. Intermediate granularity and unresolved-risk refusal remain user decisions before a concrete production contract; no hidden policy choice is accepted here.

Suggested commit: `docs: record bounded color guard and cancellation evidence`.
