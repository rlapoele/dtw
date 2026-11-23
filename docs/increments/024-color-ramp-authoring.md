# Increment 024: Color ramp authoring

- Contract status: **Draft** — consolidated 22 November 2026; not finally agreed.
- Delivery status: **Not started; no implementation authorized**.
- Authority: V2 received analyst review, then the user made the replacement and
  reference-impact decisions consolidated here. The user authorized this contract
  cleanup and new wireframes. The user reviewed V3 as covering the scenarios, then
  agreed progressive-disclosure refinement. [Editing V4](../project/workbench-layout/color-ramp-editing-v4.md)
  was accepted as good enough for now on 22 November; further UX polish is deferred.
  V3 remains the coverage/workspace reference. The user authorized renewed analyst
  review on 23 November; that review is recorded below. Final full-contract agreement
  and implementation authorization remain pending.
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
- Ordinary regeneration preserves Protected colors and regenerates all unprotected
  colors, including Manual ones (amended 23 November). Count changes are
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
Unspecified consequence disclosure remain mandatory. V4 is the user-accepted static
UX version; the renewed analyst consistency review is recorded below.

## Acceptance criteria

These criteria describe intended delivery, not implemented behavior. Explicit user
decisions are requirements; **proposed** details and D1–D5 remain subject to agreement.
Material design revisions must return to the user before further analyst review.
The accepted V4 and retained V3 workspace received renewed review on 23 November.

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
  accepted placement; reopening never moves it. Later count replacement follows AC-13; non-count position invalidation follows AC-12; numerical edges need D1.
- **AC-6 — Preview truthfulness.** Show full names, paths and values even at 20
  steps, using scrolling as needed. Repeated 8-bit sRGB previews produce non-blocking
  feedback identifying steps, without claiming authored equality or perceptual
  equivalence. HEX is an sRGB preview, not the authored representation or full P3
  color. Checkerboard/Light/Dark affect compositing only. D1 must specify alpha and
  target-gamut comparison details. **Seed description — agreed 23 November:** save it
  only on the token at the final seed position, not the group or other generated
  steps. Before creation it follows the seed's final placement; afterward it is that
  token's ordinary description and follows the agreed preservation rules.

### Shared editing draft

- **AC-7 — Workspace and inspector.** Reopen saved settings/identities/states without
  regeneration. Show named rounded swatches, HEX previews and three aligned component
  rows with thin vertical sliders and values. Selected-step details use the familiar
  token inspector with Current/New comparison, description, color fields, alpha and
  read-only details. **Membership/layer rule agreed 23 November:** only explicitly
  Primitive tokens may participate in a ramp. Layer is fixed Primitive and read-only
  in both the ramp inspector and ordinary token editor while the token belongs to
  a ramp; ordinary editing cannot change or clear it. This scoped restriction is
  explicit, not a general restriction on non-member tokens. **Value-form rule agreed
  23 November:** each member contains one unconditional literal color, with no
  theme-dependent values. Reference mode and conditional/theme-specific value
  authoring are unavailable for members in both editors while membership applies. External tokens may still reference
  ramp steps. Do not mislabel incompatible data, flatten aliases or silently convert
  it. Precise inputs remain
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
  manually to an older color does not itself clear Manual. **Edit intent agreed
  23 November:** focusing/leaving a color field without a value change does not
  establish Manual. Changing the color and then manually returning to its original
  value retains Manual. Ordinary Revert restores the saved color and saved status.
  Apply may therefore persist a Manual-status change even when the final color
  equals the saved color; a result with no value or metadata changes writes nothing.
  **Amended 23 November:**
  Manual describes authorship, not preservation. Ordinary generation-setting changes
  regenerate unprotected Manual steps and clear Manual when generated colors replace
  them, without per-step acceptance. Protected colors remain unchanged. This supersedes
  the earlier Keep manual value default; count replacement follows AC-13.
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
  (AC-21). In ordinary editing without count replacement, Revert restores the
  selected step's saved color, Manual status, description and protection (field scope
  agreed 23 November). Other steps' pending edits and ramp settings remain unchanged.
  After count replacement use Reset color to generated: use the generated candidate
  from the latest valid draft recipe/settings, including subsequent seed changes
  (baseline agreed 23 November). Clear Manual; leave description and protection
  unchanged. Do not restore the original replacement recipe or saved color. Leaving offers Apply and leave / Discard and leave / Keep
  editing. Navigate after confirmed save success only; failure retains the draft.
- **AC-12 — Ordinary generation settings.** Seed and ordinary generation-setting
  changes (including seed, intensity and seed position) regenerate every unprotected
  step in the shared draft, clearing Manual when its color is replaced. Protected
  colors remain unchanged whether Manual or Generated. Description and protection
  choices remain unchanged. Manual
  step edits, view/background changes and lock toggles do not regenerate neighbours.
  Count replacement follows AC-13 instead. Reopening does not regenerate.
  **Position invalidation — agreed 23 November:** if a non-count recipe-seed edit
  invalidates the retained seed position, keep that requested position visible,
  explain the conflict and block Apply until the user explicitly chooses a valid
  position or edits the seed. For exact white at 500, offer Use step 50 or Edit seed;
  exact black has the corresponding 950 restriction, with lighter colors before it.
  At an invalid interior position, offer Use step 950 or Edit seed; darker-side steps
  cannot be darker than exact black. Use the agreed white-seed
  message: “White needs to start the ramp. Move the seed to 50 to generate darker
  steps.” White at 50 permits a darker ramp; do not imply white itself is unsupported
  or silently reposition the seed.
  The disappearing-position Auto rule for confirmed count replacement stays distinct.
  Accepted reference remappings
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
  generated values and clear Manual; subsequent edits establish Manual again.
  Genuinely new steps start Generated and unprotected, with no transferred description/
  protection. Returning draft-only members follow the continuity rule below.
  Retain a surviving valid seed position; otherwise, when its label disappears, use
  existing Auto placement for the unchanged recipe seed without another confirmation.
  Show the position and permit manual selection or explicit Auto recalculation before
  Apply. Reference remapping uses label distance, not this lightness-based seed rule.

  **Saved-member return — agreed 23 November 2026:** if a saved member disappears
  from an intermediate replacement draft and returns before Apply (11 → 6 → 11),
  retain its original saved identity and original reference connections. Generate
  its color freshly and clear earlier remapping choices under AC-22. No intermediate
  removal was saved. Preserve its latest saved/pending description and protection
  choices across its temporary absence, until Apply or whole-draft Discard. This
  does not restore discarded manual colors or remapping choices. Applying a count
  that omits the step removes it; these choices do not transfer to a later new step.
  **Draft-only member return — agreed 23 November 2026:** a member first introduced
  in the current draft keeps its draft identity and latest description/protection
  if it temporarily disappears and returns before Apply. For saved six steps, create
  300 in an eleven-step draft, describe/protect it, then confirm six and eleven again:
  returning 300 keeps that identity, description and protection. Generate its color
  freshly, clear Manual and discard earlier remapping choices as for every confirmed
  replacement. This continuity is session-draft state, not a hidden ordinary token or
  persisted absent member. Apply includes only the final members; an omitted draft-only
  step is never created. Discard abandons draft-only members. First-time new-step
  defaults and non-member conflict blocking remain unchanged.
- **AC-14 — Non-member name conflicts.** A required name occupied by a non-member
  token blocks replacement. Do not adopt, overwrite, silently rename, skip a required
  step or mutate that token/references. Explain the conflict and preserve the current
  draft. The user can choose another count or resolve the name through ordinary editing
  before retrying, respecting the existing draft/departure guard. A conflicting group
  is not converted into a token. No second independently saving editor is authorized.
- **AC-15 — Structural integrity.** **Agreed 23 November:** individual ramp members
  cannot be renamed or moved while they belong to a ramp, including through ordinary
  editing. **Individual deletion also prohibited, agreed 23 November:** ordinary
  editing cannot delete a ramp member. Step removal goes through confirmed count
  replacement with reference resolution and shared Apply. Keep numerical names and
  membership location fixed. Renaming the
  ramp group itself remains allowed and preserves stable associations. This does not
  add a detach workflow. Missing, moved, renamed or unsupported members encountered
  in data need truthful diagnostics and cannot be silently recreated, converted or
  reassigned by path. **Incompatible-member boundary agreed 23 November:** keep the
  affected ramp inspectable but unavailable for editing or regeneration, with a
  precise explanation of the incompatible or missing member. Preserve its data and
  keep unaffected project work available; do not silently recreate tokens, flatten
  references or coerce values. No dedicated repair workflow is included in this
  increment. D3 retains technical diagnosis and enforcement preparation. Keep
  layer/type/role/composition separate. Repeated draft replacement must not silently
  restore discarded manual colors or remapping choices; remaining identity bookkeeping is specified in D5.
- **AC-16 — Atomic application and history.** Creation and whole-ramp Apply coordinate
  all accepted values, member creations/removals, references, settings, descriptions,
  Manual and protection changes together. **Apply history agreed 23 November:**
  each successful, substantive whole-ramp Apply creates one Undo/Redo entry. Undo
  restores the complete pre-Apply authored state, including token identities and
  membership, colors, recipe/settings, descriptions, Manual/protection and affected
  references; Redo reapplies the complete change. Draft edits create no history entries.
  **Creation history also agreed 23 November:** successful Create ramp creates one
  history entry for the new group, all member tokens and ramp settings. Undo removes
  that complete creation; Redo restores it with the same identities and authored data.
  Creation-dialog navigation and cancellation create no history entries. Preserve
  existing session-only history and lifecycle/revision rules. One atomic application
  operation remains the technical proposal; versioned representation remains D5. A genuinely unchanged result writes nothing
  and creates no entry; settings-only changes may matter. Domain generation remains pure; application operations coordinate
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

  **Change an accepted choice — agreed 23 November 2026:** opening Change alone
  preserves the accepted choice. Selecting a different target makes the choice
  pending and blocks Apply until explicit acceptance or Cancel change. Cancel change
  restores the previous accepted choice. For example, after accepting 300 → 200,
  selecting 400 requires Accept 400 or cancellation back to accepted 200. Selecting
  Unspecified retains AC-21's consequence disclosure and explicit acceptance. These
  actions affect only the shared draft; they never save independently.

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

## Renewed V4/V3 analyst review — 23 November 2026

The user explicitly authorized this review, not implementation. A separate analyst
reviewed clean commit `f4a37017ec5417b3c2e87aad091aec2929ebb3da`: accepted V4 notes
and two SVGs, retained V3 notes and three SVGs, accepted creation V3, this consolidated
draft and its owning product/model/architecture/interoperability decisions. Bounded
source inspection checked existing token/reference representations. SVG inspection
covered textual scenarios; no new render or runtime evidence is claimed.

**Outcome:** no material contradiction in the settled V4/V3 behavior and no material
design revision required. D1–D5 still prevent a complete implementation contract.
Consistency review does not establish usability, numerical correctness or accessibility.

| ID | Classification | Finding and disposition |
| --- | --- | --- |
| R1 | Documentary contradiction, corrected | Current gates still requested V3/user review before analyst review despite V4 acceptance and renewed authorization. Updated active gates and linked design notes; preserved dated historical evidence. |
| R2 | Documentary ambiguity, corrected | The model said manual edits “protect” steps by default. Clarified Manual preservation without changing Protected state, matching the owning agreement. |
| R3 | Resolved by user decision, 23 November | Opening Change preserves acceptance; selecting a different target makes the choice pending and blocks Apply until acceptance or cancellation back to the previous accepted choice. AC-22 records the agreement. |
| R4 | Product decision resolved; bookkeeping remains D5 | On 23 November the user agreed saved-member identity/reference continuity and preservation of latest saved/pending descriptions and protection through temporary draft absence (AC-13). Draft-only identity bookkeeping remains open. |
| R5 | Unresolved requirement, D3/D4 | Literal Primitive membership, reference forms/traversal and canonical Unspecified need exact contracts. Existing `typed-unassigned` is a possible representation, not an agreed ramp operation. |

The old resumed-design paragraph in the owning direction is now explicitly historical.
Changing SVG “Proposal” labels solely for presentation is optional polish and deferred.
No settled decision was reopened; no artwork or production behavior changed.

**User decision after review — 23 November 2026:** retain the original saved identity
when a saved step returns during repeated replacement before Apply. For saved
`color.brand.300` referenced by `color.action.primary`, 11 → 6 → 11 preserves
that connection while generating fresh colors and clearing prior remapping choices.
This avoids deletion/recreation without an intermediate save. AC-13 records the
agreement. In a subsequent explicit decision, the user also agreed to preserve the
latest saved/pending description and protection choices through temporary absence.
The earlier proposed restoration of saved metadata was rejected and is not policy.
Fresh replacement resets manual colors and remapping choices, not these metadata
choices. D1–D5 remain bounded below.

## Ordinary regeneration amendment — agreed 23 November 2026

After the renewed analyst review, the user explicitly changed the earlier Manual
preservation rule. Manual describes authorship; Protected alone preserves a color
during ordinary regeneration. Seed, intensity and seed-position changes regenerate
all unprotected steps, clearing Manual when a generated color replaces the edit.
Protected colors remain untouched; manual editing and lock toggling alone do not
regenerate neighbours. Confirmed count replacement remains the explicit protection
exception. AC-9/10/12 and the owning direction reflect this agreement.

The earlier analyst review assessed the previous rule, not this amendment. A focused
analyst consistency check remains pending before final contract agreement; no new
review, runtime/numerical checks or implementation is claimed. The user's approval
settles this behavioral revision; it does not authorize implementation. The user
subsequently agreed that generated reset uses the latest draft recipe/settings
(AC-11), through this step-by-step example:

1. Start with a saved blue eleven-step ramp; step 400 is Generated, unprotected,
   with description “Primary accent”.
2. Confirm six-step replacement: 400 survives with fresh generated color, unchanged
   identity, description and protection. Nothing is saved yet.
3. Manually edit 400 to purple: it becomes Manual without changing the recipe seed
   or neighbouring colors.
4. Change the recipe seed to green: unprotected 400 regenerates and becomes Generated;
   the purple edit is not retained for recovery. Protected steps keep their colors.
5. Manually edit 400 to orange, then Reset color to generated: use the current green
   six-step candidate and clear Manual, keeping description and protection unchanged.

Discard throughout this sequence restores the original saved eleven-step ramp.
These are agreed behavioral examples, not numerical fixtures or runtime evidence.

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

The previously listed D2 product decisions are now recorded in AC-9/11/12/22;
a focused consistency check of the post-review amendments remains pending.
No-op versus intentional edit-return handling is agreed in AC-9. Non-count seed edits
that invalidate a retained position now follow AC-12's explicit correction gate.
Ordinary non-replacement Revert's field scope
was agreed on 23 November: saved color, Manual status, description and protection,
with other steps and ramp settings preserved (AC-11).
Clarify these without reintroducing protected replacement prompts or automatic
count-round-trip recovery. Reset after subsequent settings changes uses the latest
draft recipe/settings, as agreed in AC-11. Any additional material reconciliation
ambiguity found during preparation must be surfaced, not settled as implementation
latitude.

V4's interim **Change** state was settled on 23 November and is specified in AC-22;
it is no longer an open D2 decision.

### D3 — Member eligibility and creation field ownership

**Agreed 23 November:** only Primitive tokens may participate. Both the ramp inspector
and ordinary token editor prevent changing or clearing a member's layer (AC-7).
This supersedes the proposal to permit ordinary-editor layer changes and diagnose
incompatibility afterward. **Recovery boundary now agreed:** incompatible loaded
members make the affected ramp inspectable but unavailable for editing/regeneration,
with precise diagnostics and preserved data (AC-15). Unaffected project work stays
available. No dedicated repair workflow is included.

**Also agreed 23 November:** ramp members contain literal colors only. Reference
mode is unavailable in both ramp and ordinary token editors while membership applies;
external referencing tokens remain allowed. This is an explicit ramp constraint,
not an implication of Primitive layer generally. **Assignment shape agreed
23 November:** one unconditional literal color per member; no theme-dependent
member values. Record this shape and the agreed incompatible-member boundary in
technical validation/diagnostics, without flattening or coercion.
The user's likely theme direction is to reuse the primitive palette through different
semantic mappings; this is not a finalized theme contract or implementation scope.
Non-member adoption remains excluded under AC-14. Individual member renaming/moving
is now explicitly prohibited while membership applies (AC-15); group renaming remains
allowed. Diagnostic inspection must respect these restrictions rather than offer
ordinary editing as an implicit repair route. Prepare how ramp-local diagnostics
coexist with existing project validation so unaffected work stays available without
bypassing unrelated integrity gates; the product decision does not itself prove
current operations support that boundary. Individual member deletion through
ordinary editing is now prohibited; step removal uses confirmed count replacement
(AC-15). No detach workflow is introduced. This does not select a whole-group
removal policy.

Seed-description ownership is settled in AC-6: only the final creation anchor token
receives it; afterward ordinary token-description preservation applies. Surviving
replacement descriptions remain preserved.

### D4 — Reference technical scope

Specify supported authored reference forms and impact traversal, cycle/missing-target
handling, and the canonical Unspecified operation while preserving token identity,
layer and descriptions. Separate explicit accepted unresolved outcomes from unsupported
or unanswered states. Notices must cover direct/indirect impacts in the supported model;
do not invent fallback values or silently claim support for unknown forms. Detail the
ordinary name-repair navigation under existing guards; the user-facing collision policy
itself is settled, with no adoption/overwrite workflow to design.

### Shared incomplete-composite dependency — agreed 23 November 2026

The user agreed to saved incomplete composites with explicit missing fields and
automatically derived completeness. The
[conceptual model](../design-tokens/conceptual-model.md#saved-incomplete-composites)
owns this shared direction. In the ramp case, explicit Unspecified should remove
only the affected composite field's reference, retain the other fields/layers and
token identity, and leave the composite saved but incomplete. Preserve incoming
reference chains and disclose unresolved consequences before Apply; no fallback.
This is not the whole-color-token operation of removing its entire assignment.

The [minimal shared draft contract](../design-tokens/incomplete-composites.md) now
records the source assessment and proposed field representation, validation/resolution,
completion path, versioned retention/backup and reference-use contract. It proposes
omitting unset known fields, keeping present-field validation and complete resolved
types, and reusing existing snapshot/history mechanisms. The user authorized this
preparation without further questions, prioritizing simple token authoring over
speculative scenarios. Technical proposals remain Draft, not implemented behavior. Do not implement optional composite fields as a local ramp
shortcut. Present invalid data and intentionally missing fields must stay distinct.
The proposed direct-composite blocker below remains **undecided** while this shared
contract is reviewed; it was not accepted as the final product boundary. The current
draft instead supports reviewed shadow-color remapping and field-only Unspecified. No complete
composite design, schema migration or application implementation is authorized.
Material interface changes return to the user before further analyst review.

### Minimal composite contract preparation — 23 November 2026

Steps 1 and 2 requested by the user are complete: a separate analyst assessed the
current source, and the coordinator prepared the linked shared draft. Stable source
baseline: `1d240da3487a59f8df09725f2ff94cc0f822fd7f`. The contract records current
constructor/resolver/codec limitations and the absence of a general composite editor.
It limits changes to partial authored forms for existing shadow/typography/transition
schemas, field-aware ramp review/mutation, derived completeness, and versioned storage.
A focused refill path may reuse existing controls; a full composite editor is not a
prerequisite. Whole-ramp deletion is not designed or authorized here.

The newly authorized preparation used approximately **9/10 aggregate minutes**
(analyst 4, coordinator synthesis/document checks 5), zero harness repairs. Changed
Markdown, local file links and whitespace checked. No tests, source changes, browser,
numerical or retention qualification; previous stops remain unchanged. This is analyst
preparation, not independent review of the resulting draft or all late amendments.

### D4 preparation — source findings and proposal, 23 November 2026

**Historical source preparation, before the subsequent incomplete-composite agreement.**
Current source findings still apply; the narrow direct-composite blocker is undecided,
and the shared dependency above now guides preparation. The full reference mutation
contract is not yet agreed. The coordinator
and a separate analyst inspected current source at
`68bf96900690d67ef05dfa274745b0e6b4f8b0ec`. This is targeted technical preparation,
not the pending consistency review of all post-review product amendments. No code,
schema, dependency or runtime behavior changed.

#### Observed implementation boundaries

- [Token operations](../../src/domain/token.ts) preserve token metadata when removing
  an assignment; a retained type with zero assignments derives `typed-unassigned`.
  [Reference validation](../../src/domain/token-reference-validation.ts) checks target
  existence/type/path, not assignment availability. An alias to a typed-but-unassigned
  color therefore need not become a dangling or type-invalid reference; resolution
  reports `missing-assignment` through the chain instead.
- The [retention codec](../../src/application/retention/codec.ts) accepts zero or one
  assignment and requires its condition to be empty (lines 610–615). Domain-level
  conditional assignments do not establish retained-product theme support. No new
  value representation is needed merely to express a color with no assignment;
  versioned ramp metadata remains separate D5 work.
- Valid authored references include whole-token aliases and composite fields. A
  [shadow layer](../../src/domain/shadow.ts) requires its color field to contain a
  literal or reference; it has no absent-field Unspecified representation. Transition
  and typography fields are also traversed, but are not direct color consumers.
  [Expressions](../../src/domain/expression.ts) currently support number/dimension
  math, not color expressions. Nonempty reference value paths remain unsupported.
- The validator traverses authored references in all assignments and supported
  composites/operands, but returns issues rather than a complete dependency inventory.
  Its selected cycle graph excludes invalid edges. The
  [diagnostics display](../../src/application/retention/diagnostics.ts) caps output
  at 1,000 entries; it cannot establish complete impact counts or remapping coverage.
- [Ordinary authoring](../../src/application/authoring.ts) rejects candidates containing
  any namespace/reference diagnostics. Its current color revision operation requires
  an existing single assignment; [revision eligibility](../../src/application/color-revision-policy.ts)
  rejects typed-but-unassigned tokens. The accepted Unspecified outcome can be
  represented, but the existing ordinary editor cannot subsequently fill that empty
  color value. This recovery gap must be addressed explicitly before implementation.

#### Proposed technical contract

1. Support remapping/Unspecified for a direct whole-value color alias with exactly
   one unconditional assignment and an empty value path. Preserve identity, color
   type, layer, description and other metadata. Explicit Unspecified removes that
   assignment: `definition: { type: "color", assignments: [] }`. Do not remove the
   token/type, substitute transparent/black, retain the removed target or flatten
   downstream chains. The acceptance marker belongs to the shared draft; saved
   authored data needs no special “accepted error” value kind.
2. Build the impact inventory from authored references, retaining owner identity
   and assignment/field/layer/operand location. Compare saved and proposed graphs;
   traverse reverse dependencies with cycle termination. Disclose surviving-target
   and transitive impacts, including indirect shadow consequences. Preserve chains
   and report unavailable previews honestly; no composite-rendering capability is
   assumed. Do not treat truncated diagnostics as complete coverage.
3. **Product choice pending:** if a disappearing step has a direct reference from
   a form outside that mutation scope, such as `shadow.layers[0].color`, block the
   count replacement with its exact token/field location. Preserve the draft and
   data; do not erase the whole shadow, leave a dangling reference or invent a
   field-level Unspecified value. Such references to surviving targets still receive
   impact notices. This is a proposed first-slice limitation, not an agreed exception
   to AC-20/21. Broadening composite-field editing needs an explicit alternative
   contract, including what Unspecified removes.
4. For accepted Unspecified on a whole color alias, downstream color aliases and
   composites keep their connections and may resolve unavailable. Distinguish this
   deliberate missing assignment from unanswered choices, missing tokens, cycles,
   invalid types/paths and unsupported edits. Revalidate the complete staged change
   against the reviewed revision; never suppress diagnostic categories globally.
5. Prepare a bounded way to assign a literal/reference again to an external
   typed-but-unassigned color token without changing its identity. This is a necessary
   ordinary-authoring recovery proposal, not ramp-member reference permission or an
   implemented capability. Identify the affected editor/operation contract before
   implementation; Undo alone should not silently become the only recovery route.
6. Keep invalid ramp metadata/member eligibility diagnostics separate from canonical
   reference/namespace validation. Some incompatible ramps can therefore be isolated
   without broadening existing validation. Where loaded missing members also produce
   canonical errors, keeping unrelated work available needs an explicit baseline-aware
   validation proposal. Do not claim current operations already satisfy AC-15 or grant
   blanket permission to commit invalid candidates. This integration remains open.

**Subsequent disposition:** the user agreed the shared incomplete-composite direction
above. Prepare that contract and its field-level Unspecified use before returning to
the exact reference mutation scope. The narrow blocker remains undecided, not an
accepted limitation or a reason to silently omit composite dependencies.

**Evidence limits:** approximately 8/10 aggregate minutes for this explicitly
authorized preparation (analyst 4, coordinator 4), zero harness repairs. Source and
changed-document inspection only; whitespace/local link checks. No tests, numerical,
browser or retention qualification. Prior stopping decisions remain unchanged.

### D5 — Metadata, history and compatibility

Prepare typed versioned group metadata and application-operation proposals: recipe
identifiers, stable membership identities, accepted seed position/mode, Manual and
ramp protection, validation, unknown readers/recipes, historical absence, retention
and exact backup. Preserve existing protection data without expanding this feature's
controls outside ramps. Repeated-draft replacement must preserve returning saved-member
identities and original reference connections under AC-13, without restoring discarded
color edits or remapping choices. Original saved ramp members still exist until Apply;
do not mistake them for unrelated non-members. Preserve returning saved members'
latest saved/pending descriptions and protection under AC-13. Returning draft-only
members likewise retain draft identity and latest description/protection until Apply
or Discard, as now agreed in AC-13. Define the technical representation of this
session-only continuity, atomic removals, accepted reference changes and history
together; do not persist absent draft-only members. One Undo/Redo entry per substantive ramp
Apply and one entry for successful creation are agreed in AC-16, with no entries
for draft edits, creation navigation or cancellation. Exact operation/schema
representation still requires preparation; no schema version or storage platform
is selected here.

## Verification approach and limits

No production tests, new numerical research or browser qualification occur in this pass.
After final agreement, target evidence to the criteria:

- **Essential function:** creation cancel/back/Advanced/gamut/placement; counts 2/6/11/20;
  both intensities; numerical fixtures after D1; ordinary Protected preservation and
  regeneration of unprotected Manual/Generated colors;
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

The explicitly authorized 23 November analyst follow-up has a **15 aggregate minute**
document/source-review ceiling and zero harness repairs. It used approximately
**14 minutes** (analyst 7, coordinator reading/reconciliation/checks 7), zero repairs,
and stopped after the focused review and documentary corrections. Checks cover changed
Markdown, local link targets, whitespace and alignment with settled decisions. Earlier
V1–V4, numerical, browser and retention stopping decisions remain unchanged; this
follow-up grants no runtime or numerical allowance.

## History and next gate

- 20–21 November: initial fixed 11 scope evolved into 2–20 steps, both intensities,
  accepted seed/gamut/alpha/endpoint and creation flow. Earlier fixed-count designs
  are historical, not competing active requirements.
- 22 November: V2 plus fixed Primitive received analyst review. Later user decisions
  replaced ordinary-token retention with confirmed count replacement, removed protected
  override prompts and settled reference review, draft lifecycle and seed-count placement.
- 22 November: consolidated the active contract and prepared V3; the user endorsed
  its coverage and accepted V4's compact review as good enough for now.
- 23 November: user-authorized renewed analyst review completed; findings and
  documentary reconciliation are recorded above. No material design revision needed.
- 23 November, after review: user agreed saved-member identity/reference continuity
  on return before Apply; AC-13 records it.
- 23 November, subsequent decision: preserve returning saved members’ latest
  description/protection choices through temporary absence; AC-13 records it.
- 23 November, subsequent decision: V4 Change preserves acceptance on opening;
  changing the selection blocks Apply until acceptance or Cancel change (AC-22).
- 23 November, subsequent decision: ordinary Revert restores the selected step’s
  saved color, Manual status, description and protection; other steps/settings stay.
- 23 November, subsequent decision: generated reset uses the latest draft recipe;
  the agreed blue → green six-step example above records the behavior.
- 23 November, subsequent decision: non-count seed-position invalidation keeps the
  requested position visible and blocks Apply until explicit correction (AC-12).
- 23 November, subsequent decision: seed description initializes only the final
  creation anchor token and then becomes its ordinary description (AC-6).
- 23 November, clarification: white at 50 supports a darker ramp; the user retained
  the position-correction behavior and agreed clearer explanatory wording (AC-12).
- 23 November, subsequent decision: unchanged input does not establish Manual;
  intentional edit-return retains it and may be a metadata-only Apply (AC-9).
  Exact black at 950 is the mirror of the white-at-50 rule (AC-12).
- 23 November, subsequent decision: only Primitive members; their layer cannot be
  changed or cleared in either ramp or ordinary editing (AC-7). This post-review
  amendment needs inclusion in the pending focused analyst consistency check.
- 23 November, subsequent decision: members contain literal colors only; reference
  mode is unavailable in both editors for members. External references remain allowed.
- 23 November, subsequent decision: each substantive ramp Apply has one Undo/Redo
  entry for the complete authored change; draft edits create none (AC-16).
- 23 November, subsequent decision: returning draft-only members retain their draft
  identity and latest description/protection; colors regenerate and remapping choices
  clear (AC-13).
- 23 November, subsequent decision: successful creation has one Undo/Redo entry
  for group, members and settings; Redo restores identical identities/authored data.
- 23 November, subsequent decision: individual members cannot be renamed or moved
  while in a ramp; renaming the ramp group remains allowed (AC-15).
- 23 November, subsequent decision: ordinary editing cannot delete individual
  members; step removal uses confirmed count replacement (AC-15).
- 23 November, subsequent decision: each member has one unconditional literal color;
  no theme-dependent member values. Shared primitives with differing semantic mappings
  are the likely theme direction, not a finalized theme contract.
- 23 November, subsequent decision: incompatible ramps remain inspectable but cannot
  be edited/regenerated; preserve data and unaffected work, with no repair workflow.
- 23 November: targeted D4 source preparation recorded above. Typed-unassigned fits
  whole-color Unspecified; direct composite-reference mutation needs a scope decision.
- 23 November, subsequent decision: support saved incomplete composites through
  explicit missing fields and derived completeness; prepare a shared contract before
  using field-level Unspecified. The proposed composite blocker remains undecided.
- 23 November: minimal shared incomplete-composite source assessment and draft
  contract completed at the user's request; technical proposals remain Draft.
- Next: agree the identified minimal contract and prepare only necessary field-review/
  completion interactions before focused analyst consistency review, then continue remaining
  D1–D5 questions one at a time. Material design revisions return to the user before
  further review. Final contract/design agreement and explicit implementation
  authorization remain required. No implementation yet.
- Capture actual base commit and stable diff/new files before later implementation/review.
  Leave staging, committing and pushing to the user.
