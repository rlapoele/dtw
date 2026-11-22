# Increment 024: Color ramp authoring

- Contract status: **Draft** — consolidated 22 November 2026; not finally agreed.
- Delivery status: **Not started; no implementation authorized**.
- Authority: V2 received analyst review, then the user made the replacement and
  reference-impact decisions consolidated here. The user authorized this contract
  cleanup and new wireframes. The user reviewed V3 as covering the scenarios, then
  agreed progressive-disclosure refinement. [Editing V4](../project/workbench-layout/color-ramp-editing-v4.md)
  was accepted as good enough for now on 22 November; further UX polish is deferred.
  V3 remains the coverage/workspace reference. No completed V3/V4 analyst review,
  final full-contract agreement or implementation authorization is implied.
- References: [owning ramp direction](../project/guided-color-palette-generation.md),
  [creation V3](../project/workbench-layout/color-ramp-creation-v3.md),
  [scale model](../design-tokens/conceptual-model.md#scale-generation),
  [architecture](../project/architecture.md), [interoperability](../design-tokens/interoperability.md),
  [workflow](../workflow/agent-roles.md), [presentation conventions](../project/presentation-conventions.md),
  [retention qualification limits](007-local-retention-and-backup.md#deferred-qualification).

## Outcome and scope

Create a single-seed color ramp in a provisional group-creation dialog, then edit
its ordinary Primitive color tokens in the central workspace and familiar inspector.
Optional group metadata retains the recipe, accepted seed position and ordered
member identities; it does not create live computed values or group type inheritance.

- Counts 2–20, default 11; positional labels; constant OKLCH hue; seed alpha;
  Retained intensity by default and Restrained available.
- Creation has four stages and no per-step editing. Later editing has a shared draft
  for settings, values, descriptions, ramp-step protection and reference changes.
- Ordinary regeneration preserves Manual and Protected colors. Count changes are
  explicitly confirmed replacements: confirmation replaces the draft, Apply saves,
  and Discard draft restores the saved ramp.
- Replacement removes absent steps rather than leaving ordinary-token leftovers.
  Surviving labels keep identity, descriptions and protection; affected references
  receive notices or explicit remapping decisions as appropriate.
- New-group-only creation remains the proposed first boundary. Exclude existing-group
  adoption, non-member adoption/overwrite, custom labels, multiple anchors, extra curve
  controls, general detachment UI, semantic recipes, contrast calculations, pasted-list
  import, new interchange mappings and broad compatibility qualification. Protection
  controls/workflows outside ramp steps are out of scope; existing data is preserved.

The active requirements below incorporate the latest owning agreements. Historical
fixed-count, departing-token retention, returning-token adoption, automatic draft
round-trip restoration and protected one-time replacement prompts are not alternatives.
AC identifiers are retained where practical, with AC-20–22 added for reference review.

## Current UX refinement

The [progressive-disclosure direction](../project/guided-color-palette-generation.md#progressive-disclosure-for-ramp-review--agreed-22-november-2026)
shortens repeated reading without changing the requirements: important consequences
stay visible, optional detail expands, pending reference decisions come first, and
accepted choices collapse with Change. Individual remapping acceptance and explicit
Unspecified consequence disclosure remain mandatory. V4 is the user-accepted static UX version; a renewed analyst check remains a
separate next step.

## Acceptance criteria

These criteria describe intended delivery, not implemented behavior. Explicit user
decisions are requirements; **proposed** details and D1–D5 remain subject to agreement.
The latest design must return to the user before renewed analyst review.

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
  accepted placement; reopening never moves it. Later count replacement follows AC-13; non-count setting changes remain in D2; numerical edges need D1.
- **AC-6 — Preview truthfulness.** Show full names, paths and values even at 20
  steps, using scrolling as needed. Repeated 8-bit sRGB previews produce non-blocking
  feedback identifying steps, without claiming authored equality or perceptual
  equivalence. HEX is an sRGB preview, not the authored representation or full P3
  color. Checkerboard/Light/Dark affect compositing only. D1 must specify alpha and
  target-gamut comparison details. Seed description belonging only to the created
  anchor token is proposed, not a group/all-step description (D3).

### Shared editing draft

- **AC-7 — Workspace and inspector.** Reopen saved settings/identities/states without
  regeneration. Show named rounded swatches, HEX previews and three aligned component
  rows with thin vertical sliders and values. Selected-step details use the familiar
  token inspector with Current/New comparison, description, color fields, alpha and
  read-only details. Layer is fixed Primitive and disabled/read-only. Reference-mode
  editing in the ramp inspector remains unavailable pending D3; do not mislabel an
  incompatible token or remove ordinary-editor capabilities. Precise inputs remain
  available for otherwise valid values outside the slider's visual range.
- **AC-8 — View and edit semantics.** Proposed: initialize Component space from the
  effective project default and synchronize matrix/inspector viewing during the session.
  Passive viewing never converts source values or establishes Manual. A component edit
  promotes only that step under existing editing policy; alpha-only edits retain source
  space. Alpha is separate from the three rows; show Mixed alpha when appropriate.
  Description edits, viewing, renaming and unchanged Apply do not establish Manual.
- **AC-9 — Manual and recipe seed.** Intentional value edits mark that ramp member
  Manual, without changing protection or neighbouring candidates. Editing the seed-step
  token leaves the recipe seed unchanged; clearly expose any difference. Returning
  manually to an older color does not itself clear Manual. Ordinary regeneration keeps
  Manual values by default. For an unprotected Manual step, the already agreed explicit
  Use generated value choice previews the candidate; accepting it clears Manual. This
  is distinct from the removed protected override. Count replacement follows AC-13.
- **AC-10 — Protection.** Open/closed ghost locks and the inspector control share one
  pending protection state. Manual editing remains allowed. Ordinary regeneration
  preserves Protected colors without prompts; there is no Use generated value once
  action or repeated protected-candidate approval. Unlocking alone neither clears
  Manual nor replaces a color. Confirmed count replacement is the explicit exception:
  protected surviving colors can be replaced and protected absent steps removed after
  reference resolution. Surviving protection choices persist; new steps are unprotected.
  Broader token protection is outside this increment.
- **AC-11 — One Apply, reset and departure.** Edits immediately update one draft;
  selecting another step/settings view preserves it. Apply ramp changes saves the whole
  reviewed draft and displays scope. Unanswered required choices, invalid input and
  pending work block Apply with reasons; explicitly accepted Unspecified is distinct
  (AC-21). In ordinary editing, Revert restores the selected step to applied state
  without changing other steps/settings or erasing an applied Manual status; its exact
  field scope remains D2. After count replacement use Reset color to generated: restore
  the replacement candidate, clear the new Manual adjustment, and leave description
  and protection unchanged. Leaving offers Apply and leave / Discard and leave / Keep
  editing. Navigate after confirmed save success only; failure retains the draft.
- **AC-12 — Ordinary generation settings.** Seed and ordinary generation-setting
  changes prepare draft candidates while preserving Manual/Protected values. Manual
  step edits, view/background changes and lock toggles do not regenerate neighbours.
  Count replacement follows AC-13 instead. Reopening does not regenerate. Detailed
  non-count placement/setting reconciliation remains D2. Accepted reference remappings
  survive seed-only changes while their targets remain valid; refresh all impacted
  notices and previews without requiring acceptance solely for changed color (AC-22).

### Replacement, membership and integrity

- **AC-13 — Confirmed count replacement.** A count change requires confirmation
  explaining that saved/pending individual color adjustments will be replaced,
  protected colors may be regenerated, absent protected steps removed and affected
  references require resolution. Do not list departing steps. Cancel preserves the
  current draft. Confirmation creates the replacement draft, not a save. Returning
  to an earlier count is another confirmed replacement, never automatic recovery of
  older color edits or remapping choices. Discard draft restores the saved ramp.
  Before Apply, absent tokens are only proposed removals; apply removal and reviewed
  reference changes together, leaving no hidden ordinary-token leftovers.

  Surviving labels retain token identities, existing references and their latest
  saved/pending descriptions and protection. Replace saved/pending manual colors with
  generated values and clear Manual; subsequent edits establish Manual again. New
  steps start Generated and unprotected, with no transferred description/protection.
  Retain a surviving valid seed position; otherwise, when its label disappears, use
  existing Auto placement for the unchanged recipe seed without another confirmation.
  Show the position and permit manual selection or explicit Auto recalculation before
  Apply. Reference remapping uses label distance, not this lightness-based seed rule.
- **AC-14 — Non-member name conflicts.** A required name occupied by a non-member
  token blocks replacement. Do not adopt, overwrite, silently rename, skip a required
  step or mutate that token/references. Explain the conflict and preserve the current
  draft. The user can choose another count or resolve the name through ordinary editing
  before retrying, respecting the existing draft/departure guard. A conflicting group
  is not converted into a token. No second independently saving editor is authorized.
- **AC-15 — Structural integrity.** Preserve stable associations on group rename.
  Missing, moved, renamed or unsupported members need truthful diagnostics and cannot
  be silently recreated, converted or reassigned by path. Proposed first boundary:
  block affected regeneration until repaired through ordinary editing (D3). Keep
  layer/type/role/composition separate. Repeated draft replacement must not silently
  restore discarded edits; exact retained/new identity bookkeeping is specified in D5.
- **AC-16 — Atomic application and history.** Creation and whole-ramp Apply coordinate
  all accepted values, member creations/removals, references, settings, descriptions,
  Manual and protection changes together. Proposed: one atomic application operation
  and one Undo/Redo entry. A genuinely unchanged result writes nothing; settings-only
  changes may matter. Domain generation remains pure; application operations coordinate
  accepted changes. UI does not implement token semantics. D2/D5 complete this contract.
- **AC-17 — Retention and compatibility.** Preserve applied settings/recipe identity,
  exact seed, placement, member identities and statuses through reload and exact backup.
  Drafts are session-only. Historical projects without ramp metadata retain behavior.
  Proposed: validated versioned metadata and explicit unknown-version/recipe refusal
  without silent loss. D5 defines the exact schema/compatibility policy. No new
  interchange conformance or round-trip claims are made.
- **AC-18 — Revision and recovery.** Apply checks the reviewed project revision.
  Staleness, ownership loss, rejected or unknown writes cannot silently overwrite,
  delete or remap tokens or claim unconfirmed success. Preserve the draft with existing
  recovery and no blind retry. Ordinary token editing cannot bypass the ramp draft's
  guard. Recompute/revalidate impacted references against the accepted revision.
- **AC-19 — Accessible review.** Follow owned components, semantic theme, Heroicons
  through Icon and presentation conventions. Controls have keyboard access, visible
  focus, labels and reachable errors/actions. Lock action names include token path and
  current protection; status is not color-only. Preserve stage/Advanced return focus
  and selected-step context. Narrow layout and 20-step scrolling retain paths/actions.
  Static wireframes do not establish runtime accessibility or responsive behavior.

### Reference-impact review

- **AC-20 — Impact notices and explicit remapping.** Inform the user whenever a
  referencing token is found impacted, including changed colors at surviving targets.
  Show direct and indirect effects. Require a choice only when the immediate target
  disappears: explicitly accept the suggested new step, select another new step, or
  choose Unspecified. Suggest nearest numerical label, lower label on ties; this is
  positional guidance, not semantic/color inference. Every remapping requires individual
  acceptance; no automatic assignment or accept-all shortcut is agreed. Unanswered
  choices block Apply. Surviving-target color notices require no forced remapping.
- **AC-21 — Chains and Unspecified.** Preserve reference chains. If button.background
  references action.primary, which references a disappearing ramp step, edit the latter
  connection only. Show the indirect button impact and updated preview. Explicitly
  choosing Unspecified removes the affected token's reference/value under the technical
  representation to define in D4; downstream references stay intact and may resolve to
  no color. Clearly disclose that before Apply, show unresolved previews, and invent
  no fallback. An explicitly accepted unresolved outcome does not remain an unanswered
  choice or require remapping every indirect token.
- **AC-22 — Remapping draft lifetime.** Reference edits share the ramp draft/Apply.
  Seed-only changes preserve accepted remappings with still-valid targets; refresh
  notices/previews, and allow later target revision. Another confirmed count change
  discards earlier remapping choices and rebuilds the impact review for the new ramp.
  Cancelling that confirmation preserves the existing choices; Discard draft restores
  the saved references along with the saved ramp. D4 defines supported reference forms,
  impact traversal and technical representation without weakening these behaviors.

## Historical V2 analyst review — 22 November 2026

This is the review of V2 before the later replacement decisions, not a review of
V3 or of this consolidated draft. Findings below retain their historical wording;
current dispositions are recorded immediately after the table.

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

### Current dispositions after user decisions

F1/F2/F8 are superseded by the active criteria above where their old wording differs.
Most F4 interaction questions are now settled by AC-10–13 and AC-22; only D2 below
remains. F6's adoption/leave-outside design was rejected: AC-14 now blocks non-member
conflicts. F3/F5/F7 still require numerical, eligibility and metadata proposals.
Reference-impact requirements AC-20–22 are new since V2 review. This consolidation
is editorial/contract preparation, not renewed independent review of V3.

## Remaining preparation and decisions

Do not reopen agreed replacement, reference notices/remapping, protection defaults,
seed-count placement or single-Apply decisions. The remaining work is bounded below.

### D1 — Production numerical contract

Prepare versioned exact A/B formulas and chroma endpoint proportions; the samples'
0.05/0.15 are not production approval. Specify generated-color and seed-adjustment
gamut mapping, tolerances, precision, accepted seed domain, missing/powerless hue,
neutral preservation, white/black classification, extended values, alpha/compositing
and repeated-preview equality. Preserve the accepted endpoint/Auto formulas.

Use representative fixtures and the existing conversion boundary where applicable;
address the recorded neutral-rounding observation explicitly. No new numerical
algorithm, thresholds or qualification campaign is authorized by this consolidation.

### D2 — Ordinary editing and remaining draft details

Count replacement and its reset/lifetime rules are settled above. Remaining details
are ordinary, non-replacement Revert's field scope (color/description/protection),
no-op versus intentional edit-then-return handling, and non-count seed edits that invalidate a retained position.
Clarify these without reintroducing protected replacement prompts or automatic
count-round-trip recovery. Exact reset-candidate behavior after subsequent ordinary
setting changes also needs an identified state rule; do not silently restore an older
replacement recipe. These are small interaction decisions, not implementation latitude.

### D3 — Member eligibility and creation field ownership

Recommendation still awaiting agreement: support literal Primitive color members in
the calculation domain; diagnose incompatible ordinary-editor layer/reference changes
without coercion, false Primitive labels or alias flattening. Define missing/renamed/
moved-member recovery. Non-member adoption is excluded, so eligibility is not a route
to bypass AC-14. Existing ordinary-editor behavior must not be silently restricted.

Seed description initializing only the creation anchor remains proposed. Surviving
replacement descriptions are already agreed to persist; do not reopen that rule.

### D4 — Reference technical scope

Specify supported authored reference forms and impact traversal, cycle/missing-target
handling, and the canonical Unspecified operation while preserving token identity,
layer and descriptions. Separate explicit accepted unresolved outcomes from unsupported
or unanswered states. Notices must cover direct/indirect impacts in the supported model;
do not invent fallback values or silently claim support for unknown forms. Detail the
ordinary name-repair navigation under existing guards; the user-facing collision policy
itself is settled, with no adoption/overwrite workflow to design.

### D5 — Metadata, history and compatibility

Prepare typed versioned group metadata and application-operation proposals: recipe
identifiers, stable membership identities, accepted seed position/mode, Manual and
ramp protection, validation, unknown readers/recipes, historical absence, retention
and exact backup. Preserve existing protection data without expanding this feature's
controls outside ramps. Define repeated-draft replacement identity bookkeeping against
saved data without restoring discarded color edits. Original saved ramp members still
exist until Apply; do not mistake them for unrelated non-members during a repeated
draft replacement. Specify atomic removals, accepted
reference changes and history together. Recommend one Undo/Redo entry per Apply;
no schema version or storage platform is selected here.

## Verification approach and limits

No production tests, new numerical research or browser qualification occur in this pass.
After final agreement, target evidence to the criteria:

- **Essential function:** creation cancel/back/Advanced/gamut/placement; counts 2/6/11/20;
  both intensities; numerical fixtures after D1; ordinary Manual/Protected preservation;
  replacement confirmation/cancel/repeated count changes; generated reset; survivor
  description/protection/identity; seed-position survival/Auto; new-step defaults.
- **Reference and integrity:** direct/indirect notices; nearest-label ties; individual
  remap acceptance and explicit Unspecified; preserved chains; seed-only preview refresh;
  another count resetting choices; non-member blocking; atomic removals/reference edits;
  stale revision/unknown write; versioned retention/backup and history (AC-13–18/20–22).
- **Representative UI:** Chrome creation/reopen/settings/replacement/impact/departure,
  keyboard/focus, one narrow layout and 20-step scrolling. Eleven steps is the ordinary
  performance workload; no large-project guarantee or accessibility certification.
- **Human judgment:** confirmation consequences, informational versus actionable impacts,
  whole-ramp Apply and Discard are understandable; inspector still feels like token
  details. Human checks do not replace numerical/integrity evidence.
- Proposed future production ceiling: **45 aggregate minutes / two harness repairs**,
  reassess before implementation. Not an active allowance. Do not reopen Increment 007's
  deferred qualification, broad engine/stress/recovery campaigns or exhausted budgets.

Historical V2 analyst reconciliation stopped at approximately **13/15 aggregate minutes**
(analyst 9, coordinator 4), zero harness repairs. V2 static preparation stopped at about
8 aggregate minutes, zero repairs; V1/creation/recipe/endpoint limits remain with their
records. These are not reset by the current pass.

The newly authorized consolidation/V3 preparation has a shared **15 aggregate minute**
static-check ceiling, at most one harness repair (designer ≤8, coordinator ≤3, contract
consolidation ≤4). Contract checks cover changed Markdown, links and decision consistency;
no numerical/runtime evidence or independent V3 review is claimed. Consumption is recorded
at handoff, and unresolved issues remain visible when checks stop. Contract
consolidation checks used approximately **3 minutes**, zero harness repairs: changed
Markdown/whitespace, local link paths and active decision consistency. The completed V3 note and its local links were checked at handoff. Total checks
stopped at approximately **14/15 aggregate minutes** (designer 8, contract 3,
coordinator 3), zero harness repairs. The coordinator visually inspected the three
rendered sheets. This is static inspection, not independent V3 analyst review.

## History and next gate

- 20–21 November: initial fixed 11 scope evolved into 2–20 steps, both intensities,
  accepted seed/gamut/alpha/endpoint and creation flow. Earlier fixed-count designs
  are historical, not competing active requirements.
- 22 November: V2 plus fixed Primitive received analyst review. Later user decisions
  replaced ordinary-token retention with confirmed count replacement, removed protected
  override prompts and settled reference review, draft lifecycle and seed-count placement.
- Current pass: consolidated the active contract and prepared V3 for user review.
  V3 has not received analyst review or final approval. Earlier V2 findings do not
  certify the changed design.
- Next: user reviews V3; material revisions return to the user before a separately
  authorized analyst check. Prepare D1–D5 as needed, then obtain final contract/design
  agreement and explicit implementation authorization. No implementation yet.
- Capture actual base commit and stable diff/new files before later implementation/review.
  Leave staging, committing and pushing to the user.
