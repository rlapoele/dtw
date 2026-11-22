# Increment 024: Color ramp authoring

- Contract status: **Draft** — reconciled 22 November 2026; not finally agreed.
- Delivery status: **Not started; no implementation authorized**.
- Review authority: the user approved **Ramp editing V2**, including the fixed
  Primitive inspector amendment, for analyst review on 22 November and requested
  reconciliation of this contract with all recorded decisions. Approval for this
  review is distinct from final contract/design agreement and implementation.
- References: [owning ramp direction](../project/guided-color-palette-generation.md),
  [scale model](../design-tokens/conceptual-model.md#scale-generation),
  [architecture](../project/architecture.md), [interoperability](../design-tokens/interoperability.md),
  [workflow](../workflow/agent-roles.md), [presentation conventions](../project/presentation-conventions.md),
  [existing retention qualification limits](007-local-retention-and-backup.md#deferred-qualification).

## Outcome and scope

Create a single-seed color ramp in a provisional group-creation dialog, then reopen
its remembered settings in the central workbench and review changes in one shared
draft. Members remain ordinary color tokens with stable identities. Optional group
metadata records authoring settings and ordered membership, without live computed
values, a new token type, group type inheritance or external-tool semantics.

The active scope follows the [21 November decisions](../project/guided-color-palette-generation.md#first-increment-decisions--21-november-2026)
and [22 November editing agreement](../project/guided-color-palette-generation.md#single-apply-and-step-inspector--agreed-22-november-2026):

- Single seed; integer counts **2–20**, default **11**; positional names; constant
  OKLCH hue and uniform seed alpha for generated steps.
- **Color intensity: Retained** (quadratic retained chroma B, default) or
  **Restrained** (linear taper A). Numerical completion is still required below.
- Four-stage creation: group, seed, scale, positioning/final review. No individual
  step editing before creation. Later editing uses the central matrix and inspector.
- Retained seed, accepted position, settings and stable member identities; reviewed
  regeneration, manual editing, separate Manual and Protected states, count changes
  with preserved departing tokens and explicit returning-name conflict choices.
- One final Apply for the entire editing draft, including descriptions, protection,
  settings, values and membership; drafts remain session-only. Atomic history,
  versioned persistence and recovery details below remain contract proposals.

New-group-only creation is the proposed first boundary: no adoption or overwriting
of an existing group. Exclude custom labels, multiple anchors, additional curve
controls, general detachment UI, pasted-list import, semantic recipes, contrast
calculations, new export mappings and broad compatibility qualification. Count
changes and returning-token conflict review are included, not deferred topology.

## Acceptance criteria

These numbered criteria describe intended delivery, not implemented behavior.
Explicit user decisions are requirements; details marked **proposed** await final
agreement. Open decisions D1–D5 block the dependent criteria rather than allowing
implementation to fill gaps implicitly.

### Creation and calculation

- **AC-1 — Provisional creation.** The existing New group form offers Generate a
  color ramp. Unchecked behavior is unchanged; checked Continue opens the dialog
  without applying an empty group. Validate name, parent and path collisions. Back
  preserves the draft; Cancel writes nothing. Final positioning is the final review,
  with full paths, values, target and feedback; creating succeeds for group, tokens
  and settings together. No separate final confirmation or per-step editing occurs.
- **AC-2 — Count, labels and recipe.** Accept integers 2–20 only, default 11. First
  label is `50`, last `950`, interiors are `round(1000 × i / (n − 1))`, where `i`
  is the zero-based index. At 11 this gives 50, 100…900, 950; at 6 it gives
  50, 200, 400, 600, 800, 950. Retained is default; Restrained is available. Both
  keep seed hue constant and neutrals neutral. Generated steps preserve seed alpha
  uniformly and are authored in OKLCH; the exact prepared seed retains its own
  authored representation at the anchor. D1 completes precision and chroma rules.
- **AC-3 — Seed entry and authored space.** HEX denotes sRGB input, converted once
  into the project's effective default authored space, with the quiet project-default
  helper and no conversion-confirmation step. Preserve original HEX in the draft
  against cumulative conversion. An explicit Advanced space/value accepted with
  Use color takes precedence; Advanced Cancel retains the previous seed and space
  and the rest of the draft. Generated space, seed space and target gamut remain
  distinct. Alpha stays exact; conversion is approximate under the existing policy,
  not universally lossless. Existing-token authorship is unchanged.
- **AC-4 — Explicit gamut choice.** Default target is sRGB. An out-of-sRGB seed
  prompts two unselected choices: preserve exact seed with Display P3 only when it
  fits, or explicitly accept a previewed sRGB adjustment. Outside P3, require editing
  or explicit adjustment, with no invented wider target. Show original and adjusted
  values; Restore original seed remains available in the draft and reopens a required
  choice. Recheck after seed edits, preserve other fields/alpha and show the resolved
  target at final review. Mapping, limits and tolerances require D1; a monitor preview
  does not prove numerical gamut membership.
- **AC-5 — Lightness and placement.** Default endpoints are 0.97 / 0.20. Auto picks
  the nearest reference lightness `0.97 − 0.77 × (step − 50) / 900`, ties toward
  the lighter step. Interpolate lightness linearly on each side of the exact seed
  using numeric step positions. An endpoint seed replaces that endpoint. For an
  interior seed at/above 0.97 use upper `(1 + seed L) / 2`; at/below 0.20 use lower
  `seed L / 2`. Exact white requires 50, exact black 950. During creation Auto
  recalculates after seed/count changes; a valid surviving manual label stays.
  Removed/invalid manual positions remain visible and require a confirmed valid
  replacement. No illustrative replacement label selects an algorithm. Save the
  accepted placement; reopening never moves it. Later explicit Recalculate position
  and setting-change reconciliation are proposed in D2; numerical edges need D1.
- **AC-6 — Preview truthfulness.** Show full names, paths and values even at 20
  steps, using scrolling as needed. Repeated 8-bit sRGB previews produce non-blocking
  feedback identifying steps, without claiming authored equality or perceptual
  equivalence. HEX is an sRGB preview, not the authored representation or full P3
  color. Checkerboard/Light/Dark affect compositing only. D1 must specify alpha and
  target-gamut comparison details. Seed description belonging only to the created
  anchor token is proposed, not a group/all-step description (D3).

### Shared editing draft

- **AC-7 — Workspace and inspector.** Reopen with saved settings/identities/states;
  do not regenerate on open. Show named rounded swatches, HEX previews and exactly
  three aligned component rows with thin vertical sliders/values per step. The
  selected step uses the familiar token inspector with Current/New comparison,
  description, value fields, alpha and read-only detail sections. Layer is fixed
  **Primitive**, read-only/disabled in this surface. Reference is unavailable in V2
  pending D3, not permission to remove ordinary token-editor capabilities. Keep
  precise inputs for unavailable/out-of-range sliders, with honest range feedback.
- **AC-8 — View and edit semantics.** Proposed: initialize Component space from the
  effective project default and retain one synchronized matrix/inspector selection
  during the session. Viewing another space changes neither source values nor Manual
  state. An actual component edit promotes only that step under existing editing
  policy; alpha-only edits retain source space. Alpha is separate from the three
  rows and the summary can show Mixed alpha. Description-only changes, viewing,
  unchanged Apply and renaming do not establish Manual. No bulk conversion occurs.
- **AC-9 — Manual and recipe seed.** Intentional value edits in either ramp or
  ordinary token editing mark a member Manual while retaining token-wide protection.
  Manual edits affect only that step; editing the seed-position token does not change
  the recipe seed or reshape neighbours. Clearly show any difference between recipe
  seed and anchor token. Returning manually to an older color does not itself clear
  Manual. Any deliberate keep against a changed recipe follows Manual preservation;
  exact draft/no-op reconciliation remains D2.
- **AC-10 — Separate protection.** Manual or Protected keeps the value by default;
  both can coexist. Manual editing remains allowed in either protection state. Matrix
  open/closed ghost locks and the inspector control edit the same pending protection
  state. Unlocking does not clear Manual, save, or immediately replace a value.
  Accepting a generated candidate clears Manual; for a Protected token this requires
  an explicit reviewed one-time replacement and retains protection. Generated plus
  Protected is valid. Changed candidate authorization must be resolved under D2.
- **AC-11 — One Apply, revert and departure.** Step/description/protection edits
  update the shared draft immediately with no intermediate keep/save action. Switching
  steps/settings or disclosures retains it. Apply ramp changes after editable fields
  saves the entire reviewed draft and shows its scope; invalid/unresolved/pending
  states block it with reasons. Revert step changes restores the selected step to
  its applied state without reverting other steps/settings or silently clearing an
  applied Manual state. D2 defines fields, membership interaction and new-member
  behavior. Leaving offers Apply and leave, Discard and leave, Keep editing. Apply
  and leave navigates only after confirmed success; failure retains the draft.
- **AC-12 — Regeneration triggers and review.** Proposed V2 behavior: seed, count,
  intensity, placement and target-gamut changes can prepare candidates. Manual edits,
  passive view-space/background changes and lock toggles do not regenerate neighbours.
  Settings/review remain draft-only. Show current versus generated candidate and
  default keep reasons. Review generated value and Back to token fields preserve
  the same session. Do not treat review approval as acceptance of a later changed
  candidate. D2 resolves candidate invalidation and settings changed back.

### Membership and integrity

- **AC-13 — Count reduction and seed destination.** A reviewed count reduction
  removes membership only on Apply. Departing tokens keep their stable identities,
  names, values, references and token-wide protection as ordinary tokens. No implicit
  deletion. Resolve a disappearing seed position visibly. Moving the recipe anchor
  does not authorize overwriting a Manual/Protected destination; retain its value by
  default and show recipe-seed divergence or obtain explicit replacement review.
  D2 must distinguish same-session count reversal from reopening applied departures.
- **AC-14 — Returning-name collisions.** A matching path alone does not authorize
  reuse. For an eligible token, reviewed Reuse and keep value is default: preserve
  identity/value/references/protection and establish Manual membership. Reuse with
  generated value preserves identity, explains changed reference resolution and
  follows protection/replacement rules. Leave outside keeps the token untouched
  and blocks Apply until its required name is freed or count changed. Do not skip
  required steps, silently rename, or convert a group/incompatible token. An explicit
  batch keep-values choice may retain individual review. D3 defines eligibility and
  D4 the name-resolution workflow; incidental extra group tokens remain outside.
- **AC-15 — Structural integrity.** Preserve stable associations on group rename.
  Missing, moved, renamed or unsupported members must receive explicit diagnostics
  and cannot be silently recreated, converted or reassigned by path. Proposed first
  boundary: block regeneration until the inconsistency is resolved; preserve ordinary
  editing and all authored data (D3). Layer/type/role/composition stay separate.
- **AC-16 — Atomic application and history.** Proposed: creation and each whole-ramp
  Apply are one atomic application operation and one Undo/Redo step, restoring all
  values, identities/membership, settings, descriptions, Manual and protection changes
  consistently. A genuinely unchanged result writes nothing; settings-only changes
  may be meaningful. Domain generation remains pure; application operations coordinate
  accepted changes, UI does not implement token semantics. D2/D5 complete this contract.
- **AC-17 — Retention and compatibility.** Preserve applied settings, recipe identity,
  exact seed, accepted placement, ordered token identities and Manual/protection states
  through reload and exact project backup/restore. Drafts are session-only. Existing
  projects without ramp metadata keep their behavior. Proposed: validated versioned
  metadata and explicit unknown-version/recipe refusal without silent discard. D5
  supplies the exact schema/read-write compatibility policy. No new interchange claims.
- **AC-18 — Revision and recovery.** Check Apply against the reviewed project revision.
  Staleness, ownership loss, rejected or unknown writes cannot silently overwrite
  tokens or claim unconfirmed success. Preserve the draft with explicit recovery,
  pending gates and actionable errors consistent with existing authoring. Ordinary
  token edits and ramp edits must not bypass one another's draft/revision guards.
- **AC-19 — Accessible review.** Follow owned components, semantic theme, Heroicons
  through Icon, and existing presentation conventions. All controls have keyboard
  access, visible focus, labels and reachable errors/actions. Ghost lock action names
  contain token path and expose current protection state; statuses are not color-only.
  Preserve stage/Advanced return focus, selected-step context and one dialog boundary.
  A representative narrow layout and 20-step scrolling retain full paths and actions.
  Static SVGs establish none of the runtime keyboard/screen-reader behavior.

## Analyst review — 22 November 2026

### Reviewed baseline and authorization

Reviewed the user-approved **Editing V2** note and workspace/settings/count SVGs,
including the final Primitive field without dropdown affordance. The linked
[Creation V3](../project/workbench-layout/color-ramp-creation-v3.md) note and three
SVGs supply the accepted creation decisions being reconciled, not an invented
separate historical approval. V2 inherits component-space/row behavior from V1
where expressly referenced; older V1 Apply/inspector designs are superseded.

The analyst compared these artifacts with the owning direction, vision, product
concept, principles, architecture, presentation conventions, model, interoperability
and open questions. Bounded source inspection confirms token layer is optional and
regeneration is separately `allowed`/`protected`; neither establishes ramp eligibility
or the new schema. This is independent requirements/consistency review, not production
review, numerical validation or usability acceptance.

### Findings and dispositions

| ID | Priority | Finding and disposition |
| --- | --- | --- |
| F1 | High, resolved in this draft | Active fixed-11, single-behavior, creation step-editing and fixed-membership restrictions contradicted decisions. Replaced with AC-1–6 and AC-13–14; retained historical choices only below. |
| F2 | High, resolved in this draft | Protection and manual-reset questions had already been answered. AC-9–10 now preserve separate Manual/Protected states and explicit one-time replacement. No repeat approval requested for those decisions. |
| F3 | High, open D1 | Approved qualitative recipe and placement formulas do not define a deterministic production calculation. Preview samples cannot supply missing numerical policy. AC-2–6 remain dependent. |
| F4 | High, open D2 | V2 lacks complete draft reconciliation for Revert, new members, count round trips, changed-back settings and stale replacement choices. One Apply is agreed; its detailed state transitions are not. AC-9–13/16 need this specification. |
| F5 | High, open D3 | A fixed Primitive inspector cannot truthfully present an ordinary member changed to another layer or an eligible reuse of arbitrary color tokens. Reference-disabled V2 also leaves ordinary-editor aliases unresolved. Define eligibility/recovery; do not relabel data or restrict ordinary editing implicitly. |
| F6 | Medium, open D4 | Leave outside requires name resolution but no safe route is selected. A second independently saving editor could invalidate the ramp draft. AC-14/18 need a bounded workflow. |
| F7 | High, open D5 | Optional group metadata lacks a validated version/compatibility contract. Existing backup support does not imply new metadata will survive it. AC-16–18 need technical preparation. |
| F8 | Resolved as requirement/proposal split | Added fixed Primitive, shared Apply/departure and current/new requirements. Kept multi-setting candidate triggers, detailed revert, component-view and seed-description ownership explicitly proposed rather than silently agreed. |

## Decisions still needed

These are genuine missing details, not requests to reopen agreed count, endpoint,
Manual/Protected, creation flow, fixed Primitive or single-Apply decisions.

### D1 — Production numerical contract (high priority)

Prepare an identified versioned numerical proposal before implementation: exact A/B
formulas and endpoint chroma proportions (comparison samples use 0.05/0.15 but do
not establish production values), gamut mapping for generated colors and explicit
seed adjustment, tolerances, precision/rounding, admissible seed/component domain,
missing/powerless hue, exact-neutral preservation and white/black classification.
Specify extended/negative lightness handling rather than extrapolating agreed
endpoint formulas outside their supported domain. Define repeated-preview equality,
alpha/compositing and Display P3 feedback without changing authored values.

**Recommendation:** qualify the two selected behaviors on representative brand,
neutral, near-extreme, chromatic-boundary and transparent seeds; reuse existing
conversion boundaries where applicable but explicitly scope any new mapping.
Resolve the documented [neutral rounding observation](../project/workbench-layout/color-ramp-endpoints-v1.md)
without changing fixtures to imply a general guarantee. No new algorithm or numerical
threshold is selected by this analyst review; a small technical proposal is needed.

### D2 — Draft reconciliation (high priority)

**Recommended policy for agreement:** derive membership from the applied baseline
plus the latest reviewed count. An unapplied 11→6→11 round trip restores original
membership/identities and pending edits rather than treating the five members as
already departed. After applying 6 and later returning to 11, those names require
explicit conflict choices. Retain temporarily excluded edits in the draft but expose
that they are not applied while outside the proposed ramp; decide this explicitly.

Revert an existing step's color, description, protection and pending replacement
choice to the applied baseline while preserving count/settings. Preserve applied
Manual; if keeping a previously generated applied value against a changed recipe,
make the resulting deliberate keep Manual and explain it. For a newly proposed
member with no applied state, recommend a separately labeled Reset to generated
value, not a misleading Current or Revert-to-applied claim. This is a design detail
to return to the user if selected.

Tie an accepted replacement to the reviewed candidate and settings context. If the
candidate changes, invalidate that choice and require renewed review; recommend no
automatic resurrection of a one-time choice when settings change back. Specify
unchanged proposals/no-ops, edit-then-return versus explicit Revert, surviving seed
placement on later edits, and all seed-destination Manual/Protected combinations.
Keep multi-setting regeneration triggers proposed; no seed-only rule is inferred.

### D3 — Eligibility and field ownership (high priority)

**Recommendation:** first support direct literal Primitive color members in the
supported calculation domain; all supported literal spaces/alpha remain usable
under existing policy. A token changed outside that boundary through ordinary
editing stays intact but blocks affected regeneration with a truthful diagnostic
and an explicit ordinary-editor repair route. Never show a non-Primitive token as
Primitive, silently change its layer, or flatten an alias to its resolved color.
Decide eligibility of absent layer, aliases/expressions, incomplete components,
renamed/moved members and restored inconsistencies explicitly. New ramps being
Primitive does not settle arbitrary existing-token eligibility.

Recommend seed description initializes only the creation anchor token; later moving
the recipe anchor does not move/copy descriptions. Preserve reused tokens' descriptions
and protection. Confirm these field semantics with the eligibility boundary.

### D4 — Leave-outside name resolution (medium priority)

**Recommendation:** for this slice, allow selecting a non-conflicting count inside
the draft; to rename/move an existing conflicting token, leave through the agreed
Apply/Discard/Keep guard, edit it ordinarily, then reopen/review the ramp against
the new revision. An unresolved draft cannot Apply and leave. This is smaller than
adding a second saving inspector or transactional rename workflow; tradeoff is
re-entering discarded settings. Any richer in-session workflow needs an identified
design revision. Do not silently remove Leave outside or skip required labels.

### D5 — Metadata, history and compatibility (high priority)

Prepare the exact typed, versioned group metadata and application-operation proposal,
including recipe/version identifiers, ordered stable identities, position mode versus
accepted position, Manual representation, token-wide protection, reader/writer and
unknown-recipe behavior, historical absence, retention and backup validation.
Recommend refusal over silent metadata loss and one atomic history operation per
Apply; this is technical preparation within existing architecture, not a new storage
platform decision. Do not guess an authored-version number or schema here.

## Verification approach and limits

No production tests or browser qualification are authorized by this reconciliation.
After agreement, use targeted evidence mapped to the criteria:

- **Essential function:** creation cancel/back/Advanced/gamut/placement; counts 2,
  6, 11 and 20; both intensities; representative numerical fixtures after D1; same
  session and applied count round trips; seed-destination conflicts; independent
  Manual/Protected transitions; Revert and new-member reset; changing candidate
  authorization; description-only/view-only/no-op behavior (AC-1–15).
- **Integrity:** atomic apply/history, stable aliases and departing identities,
  collision rejection, ordinary-editor incompatibility, stale revision/unknown
  write, new/historical metadata round trips and malformed/unknown versions through
  retention and exact backup (AC-13–18). Do not restart the prior retention matrix.
- **Representative UI:** Chrome creation/reopen/edit/settings/conflict/departure
  flow, keyboard/focus, one narrow layout, 20-step scrolling and familiar inspector
  hierarchy (AC-7–12/19). The ordinary 11-step ramp is the performance workload;
  20-step reachability is not a large-project performance promise.
- **Human judgment:** from a saved ramp, change intensity/seed, edit a protected
  anchor, inspect Current/New and preview a one-time replacement; assess whether
  recipe seed versus token value and whole-ramp Apply are understandable. Numerical
  correctness and integrity still need their own evidence.
- Proposed future production ceiling remains **45 aggregate minutes / two harness
  repairs**, to reassess before implementation. This is not an active allowance.
  Exclude broad engine qualification, accessibility certification, stress and the
  deferred Increment 007/PWA recovery matrix. Preserve failed/unverified criteria
  and stop at the shared limits; no automatic restarts.

This newly authorized analyst/document reconciliation has a separate **15 aggregate
minute / one tool-repair ceiling** (analyst target ≤11, coordinator ≤4). Analyst
consumption is approximately **9 minutes**, zero tool/harness repairs: source/document
inspection, SVG text/structure inspection and changed Markdown/link checks only.
Coordinator consumption is approximately **4 minutes**, including the Primitive
wireframe amendment/render inspection and document checks: **13/15 aggregate
minutes**, zero harness repairs; review stopped. Older static review budgets remain
stopped: Editing V2 approximately 8 aggregate minutes, zero repairs; prior V1 and
creation/recipe/endpoint evidence retain their own recorded limits. No budget reset,
new numerical evidence, visual runtime validation or implementation review is claimed.

## Review history and next gate

- **20 November:** fixed 11 was the initial planning scope; seed-token edits keep
  recipe seed unchanged; group checkbox/provisional creation selected. Fixed count
  is historical, superseded by 21 November; V1 separate New ramp entry is obsolete.
- **21 November:** adjustable count, both intensity behaviors, authored/gamut/alpha,
  endpoint/Auto policy, creation-only seed/settings editing and departing/reused
  token rules selected. Creation V3 records these refinements; old comparison
  surfaces do not remain competing active options.
- **22 November:** Manual/Protected separation, editing V2 and fixed Primitive
  amendment; explicit approval for analyst review, followed by this reconciliation.
  Static design checks remain historical evidence, not implemented acceptance.
- **Next:** resolve D1–D5, identify any revised design details and obtain final
  contract/design agreement and explicit implementation authorization. Material
  design revisions return to the user before renewed analyst review.
- Before implementation/review, capture the actual base commit and complete stable
  diff/new files. Leave staging, committing and pushing to the user.
