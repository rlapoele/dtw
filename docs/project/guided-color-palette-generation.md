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
- Generated steps are eligible for proposed changes when settings change.
- An intentional manual value edit, whether in the ramp preview or ordinary token
  inspector, marks that step as manual and preserves its value by default during
  regeneration. Renaming or changing a description does not create an override.
- Show manual steps visibly. Offer **Keep manual value** by default and **Use
  generated value** to preview the current generated candidate. Only accepting
  that candidate removes the override; returning manually to an earlier value
  does not silently re-enable generation.
- A manual override affects its own step, not neighbouring candidates. Turning it
  into another generation anchor would be a separate future capability.
- If a step-count or naming change would remove an overridden step, surface that
  consequence for review; never silently delete its token.

### Manual status and regeneration protection

**Agreed 22 November 2026; not implemented.**

Keep **Manual** ramp status separate from token-wide **Protected from regeneration**.
Manual identifies an intentionally edited or retained ramp-step value; Protected
is a safeguard against generated updates generally. Either condition keeps the
current value by default. Ordinary manual editing remains allowed.

- A manual value edit marks the ramp member Manual without changing its existing
  token-wide protection. Do not automatically enable global protection for every
  manual ramp edit.
- Regeneration keeps Manual and Protected tokens by default and explains the
  applicable reason(s). A token can have both states.
- An accepted generated replacement clears Manual status. If the token is also
  Protected, require an explicit reviewed **one-time replacement**, preserve its
  protection and say that it remains protected. The result may be Generated and
  Protected: it came from the recipe but future regeneration still keeps it.
- Allowing future regeneration requires an explicit protection change. Removing
  protection alone does not clear Manual status. Neither state is silently cleared
  by the other action, settings changes or an ordinary manual edit.
- Departing ramp members retain their ordinary token and its protection. Reusing
  them with **Keep value** establishes Manual ramp status again without changing
  that protection.

Within an editing session, replacement, Manual-status and protection changes
remain draft proposals until final Apply; acceptance must preserve their separate effects. This describes intended
behavior, not a finalized metadata schema or permission model. General detachment
and exact eligibility still need specification.

### Ramp-editing design resumed — 22 November 2026

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
  (explicit user amendment, 22 November). It cannot change layer in this surface.
- **Revert step changes** restores the selected step to its applied state while
  preserving other steps' pending edits and ramp settings. This is distinct from requesting a
  generated replacement; reverting does not silently clear an applied Manual state.
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

### Count replacement and reference remapping — 22 November 2026

**Latest direction; supersedes ordinary-token retention on count changes below.**
The user wants a count change to replace the ramp after a clear confirmation,
without listing departing steps or accumulating hidden ordinary tokens. This remains
a draft operation until the shared Apply. Manual/Protected and pending-edit handling
during replacement still need explicit reconciliation; do not infer that confirmation
already authorizes overriding every safeguard.

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
No revised wireframes, analyst re-review or implementation is authorized here.

### Confirmed replacement lifecycle — agreed 22 November 2026

The user selected a simple lifecycle: **confirmation replaces the draft, Apply
saves it, and discarding the whole draft restores the saved ramp**.

- Cancel the replacement confirmation to preserve the current draft unchanged.
- Confirm a count change to prepare a fresh replacement draft. Do not retain older
  individual edits or remapping choices for automatic recovery when returning to
  an earlier count. Every confirmed count change is another replacement.
- Clearly disclose that individual color adjustments are replaced, protected values
  may be replaced and protected disappearing steps removed, and affected references
  require explicit resolution. Returning to an earlier count does not recover the
  earlier draft. Retain the saved ramp until the shared Apply succeeds.
- Discarding the whole draft restores the saved ramp; confirmation is not a save
  and does not eliminate that escape route. Avoid misleading “no going back” copy.

This explicitly supersedes the earlier unapplied count-round-trip restoration rule.
Surviving token identities and descriptions are preserved under the agreements
above. Other metadata details remain separate decisions; those details remain separate decisions. No implementation authorized.

### Direct and indirect reference impacts — agreed 22 November 2026

Show notices for indirectly affected tokens as well as directly affected tokens.
Require remapping only for references whose immediate target disappears. Keep
reference chains intact: if button.background references action.primary, which
references a disappearing ramp step, review the target of action.primary while
leaving button.background connected to action.primary. Refresh downstream impact
notices/previews through that connection; do not flatten chains or require each
indirect token to select a ramp step. The consequences of explicitly choosing an
unspecified value within such a chain still need review policy.

### Accepted remappings after seed changes — agreed 22 November 2026

When only the seed color changes, preserve accepted remapping choices whose targets
remain valid. Refresh impact notices and color previews to reflect the new proposed
colors. Acceptance identifies the connection; a changed target color alone does not
require accepting that connection again. Users can still choose another target before
Apply. This does not preserve remappings across another confirmed count replacement,
which follows the separate fresh-draft rule, or resolve invalid-target handling.

### Color reset after replacement — agreed 22 November 2026

After confirming count replacement, an individually edited candidate can be reset
to the replacement's generated color using **Reset color to generated**. Clear the
new Manual color adjustment; leave description and protection unchanged. This
applies to the replacement candidate rather than restoring the old saved color.
The whole saved ramp remains recoverable through Discard draft. Reset is a draft
action, not a save or a new count replacement. The ordinary non-replacement Revert
behavior remains a separate context.

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

1. With the first-slice count, constant-hue direction and chroma choices agreed above, what chroma endpoint proportions, precision, alpha-preview/edge-case handling, numerical conversion and gamut-mapping rules complete the production calculation contract? How should the agreed creation placement rules be expressed in detailed validation/recovery states, and how should later editing handle count changes?
2. How should users compare accent suggestions, control neutral tint, and revise or retain selected candidates?
3. What makes status colors sufficiently coherent and distinguishable, and how should conflicts be surfaced?
4. Which opinionated semantic names, roles, states, and intended pairs belong in the first recipe? How much customization is useful?
5. How are light/dark assignments and any needed axes or presets proposed within existing project configuration?
6. Which WCAG/APCA profiles and contextual inputs should be supported, and how should diagnostics and an independent contrast view be presented?
7. How should acceptance, existing-token collisions, repeated generation, and user-edited tokens be handled safely?
8. What is the versioned ramp-metadata schema, and how do retention, backup and each export profile preserve or omit it? How are ordered step membership, renamed/moved tokens, references and missing members handled?
9. How should the agreed separate Manual/Protected states and one-time replacement behavior be represented and reviewed? What remaining detach, reset and partial-acceptance details complete that contract?
10. Which settings and entry points belong in the first slice, how do naming presets constrain step counts, and what batch/Undo contract applies? No detailed layout, algorithm or implementation contract is agreed yet.

When this work is explicitly resumed, use this concept and the [open questions](../planning/open-questions.md#guided-color-foundations-and-interface-semantics) to prepare a bounded proposal through the existing designer/user/analyst workflow. The first exploration is agreed in direction only; its design, contract, and execution still require the usual authorization.
