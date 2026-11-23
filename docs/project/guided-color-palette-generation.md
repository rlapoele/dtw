# Guided Color Palette Generation

## Status and purpose

**Confirmed future product direction — 10 November 2026.**

Support guided creation of a project color foundation, followed by an optional guided step that turns it into an interface color system with semantic tokens for light and dark themes. Multiple guided approaches are intended; the brand-led approach below is the first example, not the only permitted workflow.

This document preserves the concept for later work. It is not an increment contract, an agreed interaction design, a scheduled milestone, or authorization to begin research, prototyping, or implementation. Existing increment work continues independently.

## User value

Help designers and developers move from a few brand decisions to a coherent color foundation, then optionally define how those colors serve an interface. A foundation is a useful outcome on its own; users do not have to generate semantic tokens or choose interface themes to create one.

The optional interface step adds explicit meaning, theme-specific assignments, and checks of intended foreground/background combinations. It should help users understand why a primitive is proposed for a role rather than merely produce a list of values.

## Confirmed direction

- Generate a color foundation first; keep interface semantics optional.
- Support semantic-token recipes that propose predefined token names and their intended roles. The product owner expects to contribute opinionated naming choices; the final vocabulary and recipe contents are not yet agreed.
- Support light and dark themes in the optional interface step.
- Emphasize contextual contrast guidance when proposing or creating semantic tokens, where intended uses and foreground/background relationships become explicit.
- Keep a contrast view available independently of the guided flow, including for later consultation and editing.
- Begin future exploration with one brand color, neutral and accent ramps, a small semantic proposal, and contextual contrast feedback. Additional accents and status families extend the broader concept rather than being prerequisites for that first exploration.

## Example guided approach: start from brand colors

### 1. Choose brand and accent colors

The user chooses a primary brand/accent color. They may add further accents manually or ask for suggestions that work with the first color. Where several accents exist, the user can choose which one influences the neutral ramp.

**Working proposals:** preserve exact chosen colors as visible anchors; explain alternative combinations rather than present one objectively correct match; let users retain selected choices while regenerating other candidates. The interaction for locking, revising, and regenerating candidates remains to be designed.

### 2. Generate a neutral ramp

Propose a neutral ramp with slight coloration derived from the primary or selected accent.

**Working proposal:** offer control over tint strength, including a fully neutral alternative. The ramp length, naming, and numerical behavior remain open.

### 3. Generate accent ramps

Propose a ramp for each selected brand/accent color.

**Working proposal:** retain the exact selected color without silently changing it to fit a predefined step. A brand anchor need not be suitable for every interface role; another ramp member may be proposed for a specific use.

### 4. Suggest status colors and ramps

Suggest coherent colors and ramps for information, success, warning, and danger. Visual harmony and distinguishable meaning are separate goals to evaluate. The established taxonomy uses `info`, `success`, `warning`, and `danger` directly under `color`, without a redundant `status` namespace.

Status hue selection, separation criteria, and handling of conflicts with brand colors remain open. Status generation belongs to the broader example and is outside the agreed first exploration.

### 5. Review and accept the foundation

Users review candidates and choose which primitive tokens to create. Foundation creation does not require semantic-token generation. Contrast inspection can support this stage without implying that every primitive must work against every other primitive.

The exact review layout, partial acceptance, naming/collision behavior, and handling of existing project tokens remain open.

### 6. Optionally create an interface color system

Offer a guided semantic step using the accepted foundation. A recipe proposes token names, describes their roles, and suggests references to primitives for light and dark themes. Users review the proposal before creation.

The recipe must express assumptions rather than infer interface meaning from primitive values alone. Opinionated predefined names provide a starting point; whether users can edit, extend, save, or replace recipes remains open. Reconcile future recipes with the [established semantic vocabulary](../design-tokens/taxonomy.md#semantic-color-vocabulary) before agreeing their contents.

**Working proposal:** preview a small interface specimen alongside the proposed semantic mappings and their contrast diagnostics. Light and dark mappings should follow the existing [variation-axis and conditional-value model](../design-tokens/conceptual-model.md#themes-and-modes), rather than introduce separate token trees or theme-owned values.

## Contrast guidance

The highest-value contrast checks are expected during semantic authoring, because the recipe can identify intended pairs such as content on surfaces, content on accent fills, and feedback content on subtle feedback surfaces. Contrast should remain consultable after generation as project colors and references evolve.

The original proposal includes WCAG contrast ratios and APCA Lc values. Their implementation profiles, versions, interpretation, and presentation need research and explicit agreement before implementation. They must be presented as distinct measurements rather than interchangeable scores or a blanket accessibility guarantee.

**Working proposals:** provide a purpose-filtered view with access to failing combinations; avoid excluding pairs solely through coarse dark/light classifications; consider on-demand calculation or caching before selecting pair-exclusion heuristics. APCA foreground/background direction, typography context, alpha compositing, output gamut, and actual resolved theme values require explicit treatment in the future calculation contract.

The all-pairs view, relevant-pair selection, thresholds, typography inputs, and recalculation strategy remain open. Contrast is one part of evaluating an interface; status meaning must also remain understandable without relying on color alone.

## Model and architecture boundaries

- Follow the existing [scale-helper boundary](../design-tokens/conceptual-model.md#scale-generation): calculations propose candidates; selected candidates become ordinary editable canonical tokens. There is no implicit live link to a generation recipe.
- Semantic tokens retain authored references to primitive or other semantic tokens. Those aliases are real model relationships, distinct from a live dependency on the helper that proposed them.
- A recipe is authoring guidance, not a new canonical entity, persistence schema, or plugin mechanism. For color ramps, the 20 November direction below agrees retaining generation settings as optional group metadata; exact schema and broader recipe retention remain open.
- Keep deterministic color operations in the domain engine and accepted-change coordination in application operations. The guided UI collects choices and presents proposals.
- Preserve the existing exact authored-color policy. Algorithms, gamut mapping, and approximations must be agreed for this new operation scope; the feature does not silently extend the bounded Increment 003 conversion contract.
- No AI service is selected or required by this concept. Suggestions must not silently invent semantics or overwrite authored choices.

## Agreed ramp direction — 20 November 2026

**Confirmed product direction; documentation only, no implementation authorized.**

A color ramp is an ordinary namespace group with optional ramp authoring metadata,
not a separate entity alongside groups and tokens. Its members remain ordinary,
independently editable color tokens with stable identities. Group containment
continues to determine paths; ramp metadata does not introduce a token value type
or group-level type inheritance.

Remember generation settings so users can reopen and adjust a ramp. Metadata
needs to describe ordered steps and their token identities, the seed and its
assigned step, and the agreed generation settings. Exact fields and schema remain
open. Project retention and backups should preserve this information; individual
export profiles may include, translate or omit it under an explicit policy.

Generation and regeneration produce an editable proposal. Only reviewed, accepted
changes become applied data; reopening or changing settings never automatically
rewrites tokens. This extends the earlier recipe-retention question for color
ramps without introducing live computed token values.

### Manual overrides

- The recipe seed preserves the exact chosen seed and its assigned step as generation
  inputs. Editing that step through the ordinary token inspector creates a manual
  override, leaving the saved recipe seed unchanged (agreed 20 November 2026).
  The applied anchor-step token may therefore differ from the recipe seed; the
  ramp editor must make that difference explicit.
- Unprotected steps are eligible for generation when settings change, whether
  currently Manual or Generated (amended 23 November 2026).
- An intentional manual value edit, whether in the ramp preview or ordinary token
  inspector, marks that step Manual without changing protection. Renaming or changing
  a description does not establish Manual. Manual describes authorship, not immunity
  from regeneration.
- Show Manual visibly. Ordinary generation-setting changes regenerate unprotected
  Manual steps without a per-step acceptance requirement, clearing Manual when the
  generated color replaces the edit. Returning manually to an earlier color does
  not itself clear Manual. The earlier default Keep manual value rule is superseded.
- **Edit intent agreed 23 November:** focusing and leaving a color field unchanged
  does not establish Manual. Changing a color and then manually restoring its original
  value retains Manual; ordinary Revert restores saved color and saved status. Apply
  may save only the Manual-status difference when colors match. If values and metadata
  are all unchanged, Apply writes nothing.
- A manual override affects its own step, not neighbouring candidates. Turning it
  into another generation anchor would be a separate future capability.
- If a step-count or naming change would remove an overridden step, surface that
  consequence through the explicit replacement confirmation and reference-impact
  review below; no silent deletion or individual departing-step list.

### Manual status and regeneration protection

**Agreed 22 November; regeneration rule amended 23 November 2026; not implemented.**

Keep **Manual** ramp status separate from **Protected from regeneration**.
Protection controls in this increment apply to ramp steps only.
Manual identifies an intentionally edited or retained ramp-step value; Protected
alone determines preservation during ordinary regeneration. Ordinary manual editing
remains allowed. The user explicitly superseded automatic Manual preservation on
23 November: seed, intensity and seed-position changes regenerate every unprotected
step. Protected steps retain their colors, whether Manual or Generated.

- A manual value edit marks the ramp member Manual without changing its existing
  protection. Do not automatically protect every manual ramp edit.
- Ordinary regeneration preserves Protected colors only. Unprotected colors are
  regenerated and become Generated when replaced, including previously Manual colors.
  A token can be both Manual and Protected; Manual alone does not preserve it.
- Ordinary regeneration preserves Protected steps without replacement prompts.
  Remove **Use generated value once** from this flow. To participate in ordinary
  regeneration, a protected step must be explicitly unlocked. Manual is not another gate.
- Confirmed count replacement is the agreed exception: its disclosed consequences
  authorize replacing protected values and removing disappearing protected steps,
  subject to reference resolution, while preserving surviving protection choices.
  An accepted generated replacement clears Manual under the applicable rules.
- Allowing future regeneration requires an explicit protection change. Removing
  protection alone does not clear Manual status or regenerate a color. Ordinary
  manual edits do not change protection. A subsequent generation-setting change
  replaces unprotected colors and clears Manual as described above.
- Count replacement follows the later replacement/remapping agreements below,
  not the historical ordinary-token-retention policy.

Within an editing session, replacement, Manual-status and protection changes
remain draft proposals until final Apply; acceptance must preserve their separate effects. This describes intended
behavior, not a finalized metadata schema or permission model. General detachment
and exact eligibility still need specification.

### Ramp-editing design resumed — 22 November 2026

**Historical exploration:** the paragraph below predates the later replacement and
protection agreements and the V2 and V4/V3 analyst reviews. Protected one-time
replacement prompts and its pending-review gate are superseded.

The user resumed preparation of central-workspace and inspector wireframes,
including settings changes, manual overrides, count-change conflicts and protected
one-time replacements. The requested central workspace includes a color-space
selector initially using the effective project default, named rounded swatches
with HEX previews, and three component rows with a thin vertical slider and value
for every step. The user invited additional useful workspace elements.

[Editing V2](workbench-layout/color-ramp-editing-v2.md) refines the initial
[Editing V1](workbench-layout/color-ramp-editing-v1.md) after user feedback.
The distinction between workspace viewing/editing space and the creation seed's
explicit authored space remains proposed; passive space selection preserves authored
values. No analyst review or application implementation is authorized.

### Single Apply and step inspector — agreed 22 November 2026

The user agreed a single Apply boundary and requested updated wireframes:

- Step edits immediately update the shared ramp draft and its preview. There is
  no intermediate **Keep modified color** confirmation and no independent step save.
- Show Current/New color comparison and retain the existing color-token inspector's
  visual structure and controls as closely as possible, adding ramp-specific context.
  The ramp-step inspector displays Layer as **Primitive**, read-only/disabled
  (explicit user amendment, 22 November). **Amended 23 November:** only Primitive
  tokens may participate in a ramp. Layer cannot be changed or cleared in either
  the ramp inspector or the ordinary token editor while the token is a ramp member.
  Non-member layers remain unchanged. **Subsequently agreed 23 November:** members
  must contain literal colors; reference mode is unavailable in both editors while
  membership applies. External tokens can still reference ramp steps. This scoped
  constraint does not imply all Primitive tokens must be literals or authorize
  flattening incompatible member references.
- **Revert step changes** in ordinary editing without count replacement restores
  the selected step's saved color, Manual status, description and protection
  (**field scope agreed 23 November 2026**). Preserve other steps' pending edits
  and ramp settings. This is distinct from requesting a generated replacement;
  reverting does not clear an applied Manual state.
- **Apply ramp changes**, available after the inspector's editable fields, saves
  the complete reviewed draft. Show the overall scope of pending changes beside it.
- Switching steps or opening **Ramp settings** changes inspector content and keeps
  the draft. Leaving the ramp offers **Apply and leave**, **Discard and leave**, or
  **Keep editing**. Apply remains subject to validation and existing recovery gates;
  a failed save does not navigate away or discard the draft.
- Each step has an icon-only ghost protection button: open lock when unprotected,
  closed lock when protected. The inspector's **Protected from regeneration**
  section reflects and edits the same draft state. Provide action labels/tooltips;
  protection changes remain pending until the shared Apply.
- Manual editing is allowed in either protection state. Saving an intentional
  value edit establishes Manual without changing protection or the recipe seed.

The user subsequently approved V2, including the fixed-Primitive amendment, for
analyst review and authorized reconciliation of the draft contract. This is not
final complete contract agreement or implementation authorization. Exact draft reconciliation and numerical
policies remain unresolved. Static wireframes illustrate intended behavior only.

### Whole-ramp Apply history — agreed 23 November 2026

Each successful, substantive ramp Apply creates one Undo/Redo entry covering the
complete change. Undo restores the pre-Apply authored state together: token identities
and membership, colors, recipe/settings, descriptions, Manual/protection and affected
references. Redo reapplies that complete change. For example, applying an eleven-to-six
replacement with description edits and reference remappings is one history entry,
not independent token and reference entries. Draft edits create no history entries;
a genuinely unchanged Apply writes nothing and adds none. Existing session-only
history, lifecycle timestamps and revision/recovery rules remain in force. This is a
user-facing grouping decision, not a selected operation/schema implementation or a
restart of retention qualification.

**Creation grouping subsequently agreed 23 November:** successful Create ramp also
creates one history entry covering the new group, its steps and ramp settings. Undo
removes them together; Redo restores them together with the same identities and
authored data. Navigating or cancelling the creation dialog creates no history entry.
Existing history/revision/recovery rules still apply; this does not persist drafts
or history across reload.

### Unapplied count round trips — agreed 22 November 2026

**Superseded later on 22 November by the confirmed replacement lifecycle below.**
The following records the earlier decision only; it is no longer active behavior.

Within one editing draft, changing the count and then restoring it preserves the
original members' identities, membership and pending edits without returning-token
conflict review. For example, an unapplied 11→6→11 sequence restores the temporarily
excluded members and their pending edits; they never departed in applied data.
After applying the reduction, a later increase follows the agreed explicit reuse
review for occupied names. This agreement does not settle how pending edits on
departing steps are handled if the reduced count is actually applied.

### Automatic seed placement

Offer **Auto** alongside explicit seed-step selection. Auto proposes a suitable
step using the selected ramp's lightness distribution and generation policy,
shows the suggested position, and lets the user choose another. A color has no
intrinsic scale label: placement is recipe-dependent, not an objective property
of the seed.

Preserve the exact seed and fit the proposal around it. Save the accepted position
so reopening does not unexpectedly move it. Users can explicitly recalculate
placement after changing the seed or recipe. The fitting algorithm, tie-breaking,
edge cases and interaction details remain open.

## First increment exploration — 20 November 2026

**Historical preparation; superseded where noted by the 21 November decisions below.**

The user selected a fixed 11-step scope (`50`, `100`, `200`, `300`, `400`, `500`,
`600`, `700`, `800`, `900`, `950`) and authorized preparation of a draft contract
and initial interaction proposal. The seed-token override behavior above is also
agreed. Subsequently, the user selected a **Generate a color ramp** checkbox in
the ordinary group-creation form, with the group remaining provisional until final
confirmation creates the group and tokens together. Cancelling setup leaves no
applied group. Comparison wireframes for a dialog versus a central preview with
inspector are authorized; the editing surface remains undecided. The [Increment 024 draft](../increments/024-color-ramp-authoring.md) owns
proposed delivery boundaries and remaining decisions. These scoped decisions do
not constitute final contract/design agreement or implementation authorization.

## First-increment decisions — 21 November 2026

**Agreed product direction; no implementation authorized.**

- Use a single seed in the first increment; multiple anchors are deferred.
- Allow integer step counts from **2 through 20 inclusive**, default **11**. The
  user reconfirmed the maximum of 20 when selecting the recipe default.
- Name the first step `50`, the last `950`, and each interior step
  `round(1000 × i / (n − 1))`, where `i` is its zero-based index and `n` the count.
  Names describe position, not measured color lightness.
- Keep the seed's OKLCH hue constant while generating lightness and chroma;
  neutral seeds remain neutral. Preserve the exact seed.
- Use **B — Retained chroma** from the [single-seed comparison](workbench-layout/color-ramp-recipes-v1.md)
  as the default, and offer **A — Linear taper** as an alternative. These are two
  chroma behaviors, not a change in hue policy. Save the chosen behavior with ramp
  settings; changing it produces a reviewed proposal under the existing ramp rules.
- Alpha behavior agreed 21 November: preserve the seed's alpha uniformly across
  generated steps. Do not generate an opacity progression or bake the preview
  background into authored colors. Preview/compositing and numerical edge cases
  still need specification; see the agreed authoring/gamut direction below.
- Authored space and gamut agreed 21 November: author generated steps in **OKLCH**
  and preserve an explicitly chosen advanced-editor seed space and value. Default the
  target gamut to **sRGB**. If the seed lies outside it, require an explicit choice;
  never silently alter the seed or describe an out-of-gamut exception as a wholly
  sRGB-compatible ramp. Target gamut does not determine authored space.
- HEX-entry refinement agreed 21 November: treat HEX as sRGB input notation for a
  new seed, authored in the project's **effective default color space** (not always
  OKLCH). Convert once from the input using the agreed bounded conversion policy;
  keep original HEX in the creation draft to avoid cumulative conversion. Preserve
  alpha and show a quiet “Will be authored in [space] · Project default” helper,
  without a separate conversion confirmation. Conversion is numerically approximate,
  not a universal lossless round-trip promise. No gamut mapping is implied by
  conversion; numerical gamut-boundary tolerances still require qualification.
- An explicit space chosen in the advanced editor governs that seed when **Use
  color** is accepted; do not convert it back to the project default on return.
  Advanced Cancel retains the prior seed and authored-space choice. This is a
  narrow creation-only exception to preserving the original input space, not a
  change to existing token editing, passive viewing or the generated-OKLCH policy.
  The prepared authored seed is the exact anchor for generation; entering it from
  HEX has already incurred the documented conversion precision.
- Out-of-gamut choice agreed 21 November: show an inline choice beneath the seed,
  without a preselected option. Offer **Keep the exact color / Display P3** only
  when P3 contains the seed, or preview an **sRGB-compatible version** whose
  acceptance explicitly replaces the draft seed. Keep Edit seed and Restore
  original seed available; neither path saves before final creation. If outside
  P3 too, offer editing or explicit sRGB adjustment, not an unsupported wider
  target. Recheck after advanced color editing, preserve other draft settings and
  alpha, and show the resolved target gamut. Mapping/conversion precision remains
  open; endpoint and placement direction is recorded below.
- Endpoint/placement policy agreed 21 November after the
  [extreme-seed comparison](workbench-layout/color-ramp-endpoints-v1.md): use default
  OKLCH lightness endpoints **0.97 / 0.20**. Auto chooses the nearest reference
  lightness `0.97 − 0.77 × (step − 50) / 900`, with ties toward the lighter step.
  Rebuild lightness linearly on each side of the exact seed using numeric step
  positions. A seed placed at an endpoint replaces that endpoint's default.
- Allow manual interior placement for near-extreme seeds. For an interior seed at
  or above 0.97, set the upper endpoint to `(1 + seed L) / 2`; at or below 0.20,
  set the lower endpoint to `seed L / 2`. Exact white is restricted to step 50 and
  exact black to step 950. Preserve the seed rather than silently moving it.
- Give non-blocking feedback about repeated preview values for compressed ramps;
  do not describe different OKLCH authored values as identical merely because their
  8-bit sRGB HEX previews match. Exact display/target-gamut comparison and message
  details remain to be refined; no perceptual distinguishability threshold is agreed.
- Interface wording agreed 21 November: **Color intensity**, with **Retained**
  (default, B) and **Restrained** (linear taper, A). These labels control chroma
  distribution; they do not change hue or lightness. Technical documentation may
  retain the precise recipe names and formulas.
- Creation uses the group checkbox and a provisional dialog flow; later editing
  uses the central workbench, with the inspector's exact role still to be refined.
- Creation refinement agreed 21 November: keep individual generated-step editing
  **after creation**, in the workbench. Before creation, edit only the seed, count,
  Color intensity and seed position while inspecting the preview. This supersedes
  the earlier editable-candidate creation proposal, not later manual-override rules.
- During creation, Auto recalculates placement after seed/count changes. A manual
  position is retained when its label remains available and its placement is valid;
  if a count change removes it, propose a replacement and require confirmation.
  Exact white/black restrictions still apply after a seed change; never silently
  accept an invalid interior position. Exact recovery wording remains design work.
- Review on the final positioning view, showing full paths, ramp preview, resolved
  target gamut and any non-blocking repeated-preview feedback. **Create ramp**
  creates the group, tokens and settings together; no separate confirmation screen.
  Offer checkerboard, light and dark preview backgrounds without altering authored
  colors or alpha. No individual token is created while navigating these views.


The comparison records the quadratic retained-chroma and linear taper formulas
that demonstrate the selected behaviors. The lightness endpoint and Auto policies above are now agreed in direction.
Chroma endpoint proportions, exact gamut mapping, precision and remaining
alpha-preview/edge-case rules still require a production calculation contract.
The neutral-conversion rounding observation in the endpoint report remains open.

### Creation seed description — agreed 23 November 2026

The entered seed description initializes only the token at the final seed position.
It does not describe the group or populate other generated steps. Repositioning the
seed before creation moves this intended assignment to the final anchor. After
creation it is that token's ordinary description, subject to the agreed preservation
rules; later seed-position changes do not transfer it to a different token.

### Progressive disclosure for ramp review — agreed 22 November 2026

The user reviewed V3 as covering the scenarios, but requested a simpler, faster
experience for frequent use with details available when needed. The agreed refinement
direction keeps the behavior and safeguards while shortening their presentation:

- Brief confirmations show the action and important consequences immediately;
  secondary explanation is available through Details.
- Reference review puts required individual decisions first and groups information-only
  impacts separately, with fuller paths, previews and explanations available on demand.
- Accepted choices collapse to a concise summary with Change, rather than repeating
  the entire decision form. Required per-token acceptance is preserved; no automatic
  or batch remapping acceptance is introduced.
- Show contextual guidance where relevant. Do not hide consequential replacement of
  manual/protected colors or downstream unresolved effects behind optional disclosure.

The user accepted [Editing V4](workbench-layout/color-ramp-editing-v4.md) as good
enough for now on 22 November. Further UX polish is deferred. V3 remains the
scenario-coverage/workspace reference; V4 owns the accepted compact confirmation
and impact review. The user-authorized renewed analyst review completed on
23 November; [Draft 024](../increments/024-color-ramp-authoring.md#renewed-v4v3-analyst-review--23-november-2026)
records its findings. No material design revision was required. Full contract
agreement and implementation authorization remain pending.

### Changing an accepted reference choice — agreed 23 November 2026

Opening Change alone keeps the previous choice accepted. Selecting a different
target makes the choice pending and blocks Apply until the user explicitly accepts
it or cancels the change. Cancel change restores the previous accepted choice.
For example, after accepting 300 → 200, selecting 400 requires Accept 400 or
cancellation back to accepted 200. Unspecified still requires its visible consequences
and explicit acceptance. All actions remain in the shared draft; none saves separately.
This completes V4's previously open interim acceptance rule without a visual redesign
or implementation authorization.

### Count replacement and reference remapping — 22 November 2026

**Latest direction; supersedes ordinary-token retention on count changes below.**
The user wants a count change to replace the ramp after a clear confirmation,
without listing departing steps or accumulating hidden ordinary tokens. This remains
a draft operation until the shared Apply. The agreements below define the
Manual/Protected reset, preserved descriptions/protection and reference resolution.

For referencing tokens whose target step disappears, the user selected explicit
per-token review: accept a suggested new ramp step, choose another new step, or make
the referencing token's value unspecified rather than leave a broken reference.
Suggest the nearest new step by numerical label, choosing the lower label on a tie
(e.g. 300 → 200 when 200 and 400 are equally near). Each suggested remapping requires
user acceptance; no automatic reassignment. This is positional guidance, not inferred
semantic intent or color similarity. All accepted changes share the final Apply.

**Protected surviving steps — agreed 22 November 2026:** the clearly worded
count-replacement confirmation may authorize a one-time generated replacement of
protected values for steps whose labels survive. Explicitly warn that protected
colors will also be regenerated; no separate per-step replacement confirmation is
required in this count-replacement flow. Apply the replacement only at the shared
Apply and keep the surviving token's protection afterward. This scoped exception
does not remove ordinary regeneration safeguards.

**Protected disappearing steps — agreed 22 November 2026:** confirmed ramp
replacement may remove protected steps whose labels disappear, once their affected
references have been explicitly resolved. The confirmation must state that protection
does not preserve steps absent from the new ramp. Do not leave hidden ordinary tokens
behind or transfer their protection to another step. Removal and reviewed reference
changes occur together only at the shared Apply.

**Manual adjustments on replacement — agreed 22 November 2026:** confirmed
count replacement resets both saved and pending manual color adjustments to the
newly generated values. For surviving steps, accepting the generated replacement
clears Manual while preserving protection. The confirmation explicitly discloses
that individual color adjustments will be replaced. Editing a new candidate before
Apply establishes Manual again. These are draft effects until the shared Apply;
the confirmed replacement lifecycle below supersedes automatic round-trip recovery. This color-reset decision does not silently reset descriptions
or other token metadata.

**Surviving identities and reference impact — agreed 22 November 2026:** steps
whose names survive replacement retain their token identities and existing references.
Updating their colors does not require remapping. Inform the user about referencing
tokens whose resolved color changes, as well as those whose targets disappear.
Whenever a referencing token is found impacted, disclose the impact consistently;
the available action depends on context. A surviving target's changed color requires
an impact notice, not forced remapping; a disappearing target requires explicit
resolution under the agreed remapping rules. Do not imply that notice alone authorizes
a remapping. Exact impact traversal, presentation and technical eligibility remain
to specify; this agreement does not silently promise unsupported reference forms.

**Surviving draft protection — agreed 22 November 2026:** surviving steps retain
their latest protection state, including pending lock or unlock changes as well as
saved protection. Confirmed count replacement regenerates their color under its
explicit one-time authorization without reverting those protection choices. The
preserved protection state is saved only with the shared Apply. This is not recovery
of a removed step's older draft or transfer of protection to a different step.

**Surviving descriptions — agreed 22 November 2026:** surviving steps keep both
saved and pending descriptions during count replacement. Resetting manual color
adjustments does not reset separately authored descriptions. Newly created steps
do not inherit descriptions from removed steps. This is a scoped preservation rule,
not automatic restoration of older drafts when a count is changed back.

Exact impacted-reference eligibility and unspecified-value representation need the
technical contract. The earlier count-round-trip agreement is superseded by the lifecycle below.
The user authorized consolidation into [Editing V3](workbench-layout/color-ramp-editing-v3.md)
and the active draft contract. The user accepted the subsequent V4 UX refinement;
the renewed analyst check is recorded in Draft 024. No implementation is authorized.

### Confirmed replacement lifecycle — agreed 22 November 2026

The user selected a simple lifecycle: **confirmation replaces the draft, Apply
saves it, and discarding the whole draft restores the saved ramp**.

- Cancel the replacement confirmation to preserve the current draft unchanged.
- Confirm a count change to prepare a fresh replacement draft. Do not retain older
  manual color adjustments or remapping choices for automatic recovery when returning to
  an earlier count. Every confirmed count change is another replacement.
- Clearly disclose that individual color adjustments are replaced, protected values
  may be replaced and protected disappearing steps removed, and affected references
  require explicit resolution. Returning to an earlier count does not recover earlier
  manual colors or remapping choices. Retain the saved ramp until Apply succeeds.
- Discarding the whole draft restores the saved ramp; confirmation is not a save
  and does not eliminate that escape route. Avoid misleading “no going back” copy.

This explicitly supersedes the earlier unapplied count-round-trip restoration rule.
Surviving token identities and descriptions are preserved under the agreements
above. Other metadata details remain separate decisions. No implementation authorized.

### Returning saved-member identity — agreed 23 November 2026

When a saved ramp member disappears from an intermediate replacement draft and
returns before Apply, keep its original saved identity and original reference
connections. For example, saved `color.action.primary` → `color.brand.300` remains
connected after 11 → 6 → 11 before Apply. No intermediate removal was saved.
Generate fresh colors and clear prior remapping choices as already agreed; identity
continuity does not recover discarded color edits.

**Returning metadata — subsequently agreed 23 November 2026:** preserve the saved
member's latest saved/pending description and protection choices through its temporary
absence until Apply or whole-draft Discard. If the user edits step 300's description
and unlocks it before 11 → 6 → 11, it returns with that description and remains
unlocked, with a freshly generated color. Do not revert these choices to saved
metadata. Fresh replacement resets manual colors and remapping choices specifically.
If Apply removes step 300 at six steps, those choices do not transfer to a new step
created by a later increase. Whole-draft Discard still restores the saved ramp.
The subsequent draft-only continuity agreement below completes the corresponding
product rule for members not yet saved. Technical representation remains open;
implementation is not authorized.

### Returning draft-only members — agreed 23 November 2026

A step first introduced in the current draft retains its draft identity and latest
description/protection if it temporarily disappears and returns before Apply.
For example, start with saved six steps, confirm eleven, describe and protect new
300, then confirm six and eleven again. Returning 300 retains those choices and its
draft identity, but receives a fresh generated color with Manual cleared. Earlier
remapping choices are discarded under the existing replacement rule.

This is continuity within the shared draft, not recovery of earlier manual colors
or remappings, transfer to a different step, or creation of hidden ordinary tokens.
Only final members are created on Apply; omitted draft-only members are never saved.
Discard abandons them. A step introduced for the first time still starts Generated,
unprotected and without an inherited description. Non-member name conflicts still
block replacement. Exact session-state representation remains to specify.

### Disappearing seed position on replacement — agreed 22 November 2026

When confirmed count replacement removes the seed's assigned label, use the existing
Auto placement rule to position the unchanged recipe seed in the new ramp. Make the
result visible and editable before Apply, without a second confirmation dialog.
Use seed lightness and the agreed Auto rule, not numerical-label proximity used for
reference remapping. This supersedes the historical later-editing requirement to
block Apply pending explicit confirmation of a replacement seed position in this
count-replacement case. Creation rules and invalid seed positions caused by other
changes remain distinct.

**Surviving seed position — agreed 22 November 2026:** retain the assigned seed
position during count replacement when its label survives and remains valid.
Preserve the exact recipe seed and generate the replacement around that position.
Do not automatically reposition it merely because the count changed. The user can
still select another valid position or explicitly recalculate Auto placement before
Apply.

### Invalid seed position after a seed edit — agreed 23 November 2026

If a non-count recipe-seed edit makes the retained seed position invalid, keep the
requested position visible, explain the conflict and block Apply until the user
explicitly chooses a valid position or edits the seed. For exact white at step 500,
offer Use step 50 or Edit seed; exact black has the corresponding 950 restriction.
The user confirmed this behavior and the clearer white-seed wording:
**“White needs to start the ramp. Move the seed to 50 to generate darker steps.”**
A white seed at 50 is supported: remaining steps can be progressively darker.
The conflict is retaining an interior position with a lighter side above white,
not using white as a seed. Exact black is the mirror case: place it at 950, with
lighter colors before it. If an interior position is retained, offer Use step 950
or Edit seed rather than requiring colors darker than black. Explain that black
needs to end the ramp so lighter steps can precede it. This clarifies the existing
endpoint rule, not a new numerical policy. Do not silently reposition. This later-editing rule is distinct from the agreed
Auto placement when count replacement removes the assigned label. Numerical
classification/tolerances remain with Draft 024 D1; this agreement selects no new
threshold or algorithm.

### Non-member name conflicts — agreed 22 November 2026

An occupied required step name belonging to a token outside the ramp blocks count
replacement. Show a clear name-conflict message; do not offer adoption or overwrite.
Users can choose another count, or resolve the existing token's name through ordinary
editing before retrying. Replacement authority covers actual ramp members only.
Keep the existing token and its references untouched, and preserve the current draft
when replacement cannot proceed. The ordinary editing route must respect the shared
draft/departure guard; it does not authorize a second independently saving editor.
This supersedes historical proposals to reuse arbitrary non-members at returning names.

### New replacement-step defaults — agreed 22 November 2026

Genuinely new steps created by replacement start **Generated and unprotected**.
Do not inherit protection from nearby, removed or other steps. Users may explicitly
protect a new step in the draft before Apply. Surviving steps retain their separately
agreed protection state. This default does not authorize overwriting an existing
non-member token or treating an occupied name as a genuinely new step; the
non-member collision rule above blocks replacement.

### Ordinary regeneration preserves protection — agreed 22 November 2026

Changing the seed or other ordinary generation settings leaves Protected ramp-step
colors unchanged, without prompting to replace them. Remove **Use generated value
once** and its candidate re-acceptance workflow from ordinary regeneration. Manual
editing remains allowed. Under the 23 November amendment, all unprotected steps
participate regardless of Manual status; unlocking alone does not clear Manual or
replace a color.
Confirmed step-count replacement is the sole agreed regeneration exception, with
its explicit confirmation and shared Apply. This supersedes earlier per-protected-step
one-time replacement proposals and the associated V2 review state.

### Protection scope for this increment — agreed 22 November 2026

Protection controls and behavior in this increment are limited to ramp steps.
Broader token protection outside ramps is out of scope. Earlier references to
“token-wide protection” describe the conceptual distinction from Manual status;
they do not authorize expanding this increment to ordinary-token protection UI or
workflows. The proposed case of a protected external referencing token is set aside,
not a requirement or an agreed exception. Preserve existing authored data and do
not infer a canonical-schema migration or removal of existing capabilities from
this feature-scope decision. Separate Manual and Protected behavior within ramps,
including the agreed replacement rules, remains unchanged.

### Direct and indirect reference impacts — agreed 22 November 2026

Show notices for indirectly affected tokens as well as directly affected tokens.
Require remapping only for references whose immediate target disappears. Keep
reference chains intact: if button.background references action.primary, which
references a disappearing ramp step, review the target of action.primary while
leaving button.background connected to action.primary. Refresh downstream impact
notices/previews through that connection; do not flatten chains or require each
indirect token to select a ramp step.

**Unspecified consequences — agreed 22 November 2026:** an explicit Unspecified
choice may leave downstream tokens without a resolved color, provided those
consequences are clearly shown before Apply. Preserve the reference chains; do not
invent a fallback or require additional remapping for indirectly affected tokens.
Show their preview as unresolved. A consciously accepted unspecified value is not
an unanswered remapping choice; the technical contract must distinguish them.

### Accepted remappings after seed changes — agreed 22 November 2026

When only the seed color changes, preserve accepted remapping choices whose targets
remain valid. Refresh impact notices and color previews to reflect the new proposed
colors. Acceptance identifies the connection; a changed target color alone does not
require accepting that connection again. Users can still choose another target before
Apply. This does not preserve remappings across another confirmed count replacement,
which follows the separate fresh-draft rule, or resolve invalid-target handling.

### Color reset after replacement — agreed 22 November 2026

After confirming count replacement, an individually edited candidate can be reset
using **Reset color to generated**. **Baseline agreed 23 November:** use the generated
candidate from the latest valid draft recipe/settings, including subsequent seed
changes. Clear Manual; leave description and protection unchanged. Do not restore
the earlier replacement recipe or old saved color. For example, after blue six-step
replacement, a change to green regenerates an unprotected Manual step; a later orange
manual edit resets to the current green six-step candidate.
The whole saved ramp remains recoverable through Discard draft. Reset is a draft
action, not a save or a new count replacement. Ordinary non-replacement Revert
restores the selected step's saved color, Manual status, description and protection,
under the 23 November agreement above; other steps and ramp settings stay unchanged.

### Departing steps during later editing

**Historical policy, superseded for count replacement by the 22 November direction
above.** Keep this record for provenance, not as the active count-change contract.

**Agreed 21 November 2026:** when a count change removes steps from the ramp,
keep their tokens as ordinary tokens by default. Preserve their stable identities,
names, values and references; remove ramp membership only when the reviewed count
change is applied. Do not delete them as an implicit part of regeneration.

Increasing the count again may encounter those tokens or unrelated tokens at the
required paths. A matching path alone is not authorization to overwrite a token or
assume it is a former member.

**Returning-step conflict choices agreed 21 November 2026:**

- **Reuse and keep its value** is the default reviewed choice for an eligible
  existing color token. Preserve identity, value and references, and add it to the
  ramp as Manual. This requires acceptance of the overall proposal, not automatic
  reuse merely on changing the count.
- **Reuse and use generated value** preserves identity and references but proposes
  a value replacement and a return to generation. Show that dependent references
  will resolve to the changed value. Existing protection must be explicitly handled;
  its interaction with Manual follows the separate protection rules above.
- **Leave outside the ramp** preserves the token untouched. The required name must
  be freed or another count selected before applying the ramp; do not silently
  omit a required step or rename existing data.
- A conflicting group or incompatible token is not automatically converted into a
  ramp color. Exact eligibility remains to be specified. For eligible conflicts,
  an explicit **Reuse all and keep values** action may set the batch choice while
  retaining individual review.

No identity, value or membership changes before final Apply. Manual/protection
behavior is agreed above; detailed schema, eligibility and review design remain open.

The earlier Increment 024 draft must be reconciled with these decisions before
final contract/design agreement. No implementation or broader verification is
requested by recording these choices.

## Questions for future work

1. With the first-slice count, constant-hue direction and chroma choices agreed above, what chroma endpoint proportions, precision, alpha-preview/edge-case handling, numerical conversion and gamut-mapping rules complete the production calculation contract? How should the agreed creation placement rules be expressed in detailed validation/recovery states outside confirmed count replacement?
2. How should users compare accent suggestions, control neutral tint, and revise or retain selected candidates?
3. What makes status colors sufficiently coherent and distinguishable, and how should conflicts be surfaced?
4. Which opinionated semantic names, roles, states, and intended pairs belong in the first recipe? How much customization is useful?
5. How are light/dark assignments and any needed axes or presets proposed within existing project configuration?
6. Which WCAG/APCA profiles and contextual inputs should be supported, and how should diagnostics and an independent contrast view be presented?
7. Which exact reference forms can participate in the agreed impact review/remapping, and how is an explicitly accepted unspecified value represented and validated? Count replacement, non-member collisions and color resets follow the agreements above.
8. What is the versioned ramp-metadata schema, and how do retention, backup and each export profile preserve or omit it? How are ordered step membership, renamed/moved tokens, references and missing members handled?
9. How should Manual and ramp-step protection be represented technically? Ordinary regeneration preserves protected values without prompts; confirmed count replacement is the agreed exception. What precise ordinary-edit Revert behavior remains outside the agreed replacement reset?
10. What atomic operation and persistence compatibility contract implements the agreed creation/shared Apply and their one-entry Undo/Redo grouping? Creation V3 and the V3 workspace with accepted V4 review flows supply the identified interaction designs; numerical and implementation contracts remain unfinished.

When this work is explicitly resumed, use this concept and the [open questions](../planning/open-questions.md#guided-color-foundations-and-interface-semantics) to prepare a bounded proposal through the existing designer/user/analyst workflow. The first exploration is agreed in direction only; its design, contract, and execution still require the usual authorization.
