# Increment 024: numerical specification draft

**Completed numerical draft for final contract review — 23 November 2026.**
Not implemented or numerically qualified. Product agreements and technical proposals
remain distinguished below; completing this draft is not final contract acceptance.
Parent: [Draft 024 D1](024-color-ramp-authoring.md#d1--production-numerical-contract).
The user authorized specification preparation after agreeing the product behaviors
recorded there. This document makes a concrete technical proposal; it does not turn
unverified algorithm details or unresolved product choices into accepted requirements.

## Authority and scope

Preserve the agreed labels, Auto/endpoint placement, Retained/Restrained curves,
5%/15% endpoint defaults, constant hue, exact prepared anchor and alpha. Preserve
ordinary Protected steps; confirmed count replacement is the explicit exception.
Endpoint customization is outside Increment 024. Saved colors are ordinary authored
tokens: reopening reads them and does not regenerate them automatically.

Use the existing bounded conversion operations and their
[current policy](003-color-policy-proposal.md). No new color backend, conversion
equations, dependency, preference infrastructure or UI redesign is proposed.

## Calculation and serialization order

1. Validate the prepared seed and calculation eligibility. Missing hue is allowed
   only in the existing exactly-powerless cases. Preserve exact input on failure;
   do not apply an old candidate or invent missing information.
2. Derive calculation-only OKLCH coordinates directly from the prepared seed.
   Retain the prepared authored seed separately for the exact anchor. Do not use
   rounded display values or the preceding generated ramp as calculation inputs.
3. Calculate labels, placement, piecewise-linear lightness and the agreed chroma
   formula using numeric labels. Evaluate only existing sides of an endpoint seed.
   Apply the existing calculation input limits and finite-result checks.
4. Format generated lightness and hue with the existing up-to-12-significant-digit,
   ties-to-even rule, over the shortest round-tripping decimal text of the binary
   result. Canonicalize through the existing constructor, including hue normalization
   and negative-zero removal. Hold these serialized coordinates fixed while fitting
   chroma. Exact neutral generation uses chroma zero and calculated powerless hue
   semantics; it must not create a tint. The anchor's authored hue remains untouched.
5. Format requested chroma the same way and validate the complete candidate. Copy
   alpha exactly, including zero; do not premultiply. A candidate must remain
   nonnegative in chroma and no greater than seed chroma. If rounding would exceed
   that upper bound, the candidate is not admissible; fitting must use an admissible
   lower candidate, not round the seed itself or increase its chroma.
6. Perform target-gamut fitting on serialized candidates as specified below. The
   exact final candidate must pass constructor and gamut checks after formatting.
   No subsequent coordinate change may bypass those checks.

Version the complete calculation policy, including conversion baseline, mapping and
rounding, with the recipe metadata in D5. Repeated identical inputs/version reproduce
generated results; this never restores discarded manual colors or remapping choices.

## Proposed generated-color gamut fitting

The membership predicate converts the serialized candidate through the existing raw
conversion boundary into the selected RGB space, requires finite numeric channels,
and checks each channel in `[0,1]`, with zero boundary tolerance. Exact endpoint
equivalences below bypass noisy conversion for known white/black only. Same-space
RGB seed membership uses exact Decimal channel comparisons. Alpha does not affect membership. Do not borrow the superseded
preview-only `1e-10` allowance or silently clip a channel into range.

- Return an admissible requested candidate unchanged if it passes.
- Otherwise test zero chroma with the same serialized lightness/hue. If that cannot
  be evaluated or does not fit, return an unavailable calculation preserving input.
- If zero fits, bisect the interval from zero to requested chroma. Format and
  constructor-validate every trial before membership testing; retain the highest
  tested serialized candidate that passes all constraints. A failed calculation is
  an unavailable result, not evidence that the trial is simply out of gamut.
- Proposed deterministic work bound: at most **64 bisections**, stopping earlier if
  the binary midpoint equals a bound. Update the numeric bounds from the trial
  position and its serialized candidate's admissibility: initialize `low = 0`,
  `high = requested C`; evaluate `mid = low + (high - low) / 2`. On a passing trial
  set `low = mid`; otherwise set `high = mid`. Update the retained literal only
  when its serialized chroma exceeds the retained passing value. Equal serialized
  candidates still update numeric bounds; they do not trigger additional loops.
  This is a finite engineering bound, not a validated error tolerance or a promise
  of exact maximal chroma. For an authored OKLCH seed, the admissibility ceiling is
  its exact canonical Decimal chroma. For other spaces, use the calculation-only seed
  C used by the recipe, represented by its shortest decimal text. Do not use a
  separately rounded display or another conversion as the ceiling. If requested C
  is zero, test it once and skip the search.
- Return the retained passing candidate after a final check. Never fall back to RGB
  clipping or alter lightness/hue to make a generated step pass.

**Evidence still needed:** monotonic membership along the chosen chroma path,
behavior when formatting collapses trials, adequacy of the work bound, and ordinary
boundary success. This procedure is a concrete proposal, not yet a validated mapping
algorithm. Strict checks may expose conversion noise at white/black or gamut edges;
ordinary representative failures must return for correction before delivery, not
become a blanket accepted limitation. No boundary epsilon is selected here.

The installed Culori helper is not a drop-in policy: `clampChroma` falls back to RGB
clipping when zero chroma fails and derives its search resolution from the mode's
chroma range divided by `2^13`; `toGamut` also contains endpoint/clipping behavior.
This finding comes from local source inspection, not execution. Keep a small ramp
policy around existing conversions instead of adopting those hidden fallbacks.

## Seed preparation, classification and explicit adjustment

Proposed exact classification uses authored semantics, never rounded HEX:

| Authored space | Exact black / white conditions, with otherwise eligible input |
| --- | --- |
| sRGB or Display P3 | All three components exactly `0` / exactly `1` |
| HSL | Lightness exactly `0` / `100` |
| OKLAB | Lightness exactly `0` / `1`, with both opponent components zero |
| OKLCH | Lightness exactly `0` / `1`, with chroma zero |

Neutral classification otherwise follows the existing conversion boundary. HSL
endpoint classification does not broaden missing-hue eligibility: the accepted
missing-hue exception still requires exactly zero saturation. Do not promote a
near-neutral, near-white or near-black input through a numerical threshold.

**Exact endpoint conversion — technical proposal.** During ramp seed preparation,
classify only the exact source conditions above before any approximate conversion.
When changing space for a known exact endpoint, construct its exact equivalent:

| Target space | Black | White |
| --- | --- | --- |
| sRGB / Display P3 | `[0, 0, 0]` | `[1, 1, 1]` |
| HSL | `[none, 0, 0]` | `[none, 0, 100]` |
| OKLAB | `[0, 0, 0]` | `[1, 0, 0]` |
| OKLCH | `[0, 0, none]` | `[1, 0, none]` |

Preserve exact alpha. Identity/same-space preparation retains the original literal,
including numeric powerless hue; the exact anchor is never reconstructed merely for
calculation. The same endpoint equivalences govern calculation-only conversion and
RGB membership/preview conversion within this ramp operation. Thus HEX white prepared
in an OKLCH project becomes exactly `[1, 0, none]`, with no epsilon and no hidden
provenance flag. Advanced edits are classified from their new authored value. A
near-white value is never promoted to exact white because it looks white or rounds
to white in HEX. This supersedes the earlier durable-classification-metadata idea.
It is a narrow ramp operation rule, not a global ordinary-editor conversion change.

For all other seeds use the existing bounded raw conversion boundary. Calculation-only
coordinates may be outside canonical OKLCH lightness bounds during adjustment
preparation; they are not authored literals and must not be passed through a clamping
constructor. Require finite results and existing input eligibility. Within `[0,1]`,
retain calculated L; outside it, prepare the explicit adjustment below. A failed
calculation yields no candidate and preserves input, never a guessed endpoint.

**Upper-lightness seed adjustment — agreed 23 November 2026.** For a calculable
extended seed whose OKLCH lightness exceeds `1`, offer a candidate capped at `1`
through the existing explicit adjustment flow. Show original and adjusted values
and explain “Lightness reduced to 100% to fit the supported range.” Fit chroma as
needed for the candidate's target gamut, preserve exact alpha, and disclose any
additional chroma change. The original remains unchanged until the user accepts;
acceptance replaces the draft seed only, with the existing Create/Apply save boundary
and Restore original behavior retained. This supersedes the earlier edit-only
recommendation for above-range lightness. It is not automatic capping with a notice.

Apply the existing seed-position rules to the accepted candidate. An adjusted white
seed requires step 50; an invalid manual position must be resolved through the
existing flow, not silently moved. Generated-color gamut fitting still preserves
calculated lightness/hue: this explicit seed adjustment is a distinct operation.
**Lower-lightness seed adjustment — agreed 23 November 2026.** Mirror the upper
case for calculable lightness below `0`: preview a candidate raised to `0`, explain
the increase to 0% and any chroma reduction, preserve alpha, and require acceptance.
An adjusted black seed requires step 950 under the existing position rules. Neither
case moves an invalid manual position silently. Unsupported or failed calculations
retain input and cannot claim a valid adjusted preview.

**Adjusted-seed authored representation — technical proposal.** Preserve the
prepared seed's authored space (explicit Advanced selection or effective project
space used for HEX preparation). Retain that authored-space choice through candidate
preparation. Do not
silently switch to OKLCH or RGB because adjustment uses it internally.

For a seed needing adjustment, bound calculation-only L to `[0,1]` under the explicit
rules above; retain hue while reducing chroma to fit sRGB. For supported L this is
chroma-only adjustment. At either endpoint the neutral candidate is exact black or
white; construct its equivalent through the table above. Show all resulting changes
before acceptance. Original alpha remains exact, including zero.

Use the same bounded search with an adjustment-specific candidate predicate: form
the OKLCH trial, convert it back to the intended authored space using endpoint
semantics or the existing conversion boundary, format it, construct the literal,
and check the **final returned literal** for sRGB membership. Retain that tested
literal as the preview/acceptance value. This prevents a subsequent conversion from
undoing a successful gamut check. Invalid or failed conversions return unavailable
with input intact; they are not mere out-of-gamut search results. Do not save a
rounded display reconstruction or run another conversion on acceptance.

The fixed L/hue promise applies to the adjustment calculation path; conversion back
to the chosen space inherits existing approximate-conversion limits. For generated
steps, fixed serialized OKLCH L/hue remains the stricter rule. No universal exact
cross-space round-trip promise is introduced. Seed acceptance triggers classification,
position validity and preview refresh using the accepted literal. Restore original
restores the original authored input and reopens required gamut/adjustment decisions.

## Repeated-preview key

Propose a deterministic comparison key derived from each final authored step:

1. Derive a disposable sRGB comparison copy. If outside sRGB, use the proposed
   fixed-lightness/hue chroma-fitting policy on that copy only. Native CSS preview
   continues to render authored colors; comparison must not rewrite them.
2. Quantize each valid normalized sRGB channel multiplied by 255 to the nearest
   integer, ties to even. Do not introduce an intermediate display-rounding pass.
3. Compare the three integer bytes and the **exact canonical Decimal alpha**.
   Do not quantize alpha to a byte or introduce an alpha tolerance.

Matching keys produce the agreed non-blocking notice identifying matching **sRGB
previews**. Background selection has no effect. At alpha zero, different RGB keys
still differ; this is value comparison, not perceived equality. P3 colors can share
an sRGB key while rendering differently on a capable display. If comparison fails,
show that comparison is unavailable; do not claim distinctness or fabricate a key.
A comparison-only failure must not silently mutate or invalidate otherwise valid
authored data; retain the existing save gates for the actual ramp candidate.

## Evidence and stopping boundary

Read-only preparation against clean base `799b9b4e6ec1d2b4680851a5e42572e3e3df61e1`:
separate analyst and coordinator inspected D1, the retained recipe/endpoint notes,
[src/domain/color-calculation.ts](../../src/domain/color-calculation.ts),
[color-literal.ts](../../src/domain/color-literal.ts),
[color-preview.ts](../../src/presentation/App/components/TokensWorkbench/helpers/color-preview.ts)
and the installed Culori mapping source. No new independent implementation review
or review of an unapproved material interface change is claimed.

The historical `#040404` neutral-rounding observation remains unresolved. Existing
exact-neutral source handling is relevant, but does not prove that pipeline fixed.
No calculations, numerical scripts, tests, rendering, browser or retention runs were
performed. Earlier qualification stops remain intact. This preparation had an
8 aggregate-minute document/source-check ceiling, zero repairs; approximately 7
minutes used (analyst 4, coordinator 3). Markdown links and whitespace checked,
then checks stopped. Final contract agreement and implementation authorization remain
outstanding; numerical qualification needs its own explicitly authorized bounded work.

## Completion of numerical detail preparation — 23 November 2026

The user authorized completing numerical details and explicitly accepted the
below-zero adjustment. A separate analyst supplied source-based recommendations;
the coordinator reconciled exact endpoint conversion, authored-space preservation,
final-literal adjustment validation and deterministic search updates into this draft.
No endpoint-provenance metadata or new conversion backend is required by this proposal.
D5 still owns recipe version storage; it must carry the selected policy/version,
prepared seed and settings without inventing additional numerical semantics.

No numerical product question is intentionally left open in this draft. The mapping
and serialization rules are technical proposals for final contract review, not proof
of accuracy or successful operation. Representative evidence must cover ordinary
colors, exact and near endpoints, neutral output (including the historical observation),
final serialized gamut membership, explicit adjustments in each supported seed space,
repeatability and preview keys. This names future essential checks; it does not run
or authorize a new qualification campaign. A failure returns for correction or an
explicit decision, not silent weakening of the contract.

This follow-up used approximately 7 of its 8 aggregate document/source-check minutes
(analyst 3, coordinator 4), zero repairs. Local Markdown links and whitespace checked.
No production changes, calculations, tests, browser/rendering or retention runs.
Previous evidence and stopping limits above remain intact. The completed numerical
draft subsequently received the [final consolidated analyst review](024-color-ramp-authoring.md#final-consolidated-analyst-review--23-november-2026)
with no material findings. User full-contract agreement and implementation authorization
remain pending; this consistency review supplies no numerical correctness evidence.
