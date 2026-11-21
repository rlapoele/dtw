# Increment 024: Color ramp authoring

- Contract status: Draft
- Delivery status: Not started
- Agreement: on 20 November 2026 the user agreed a fixed 11-step first scope and that editing the seed's token in the ordinary inspector creates a manual override while leaving the recipe seed unchanged. The user subsequently agreed entry through a checkbox in group creation and keeping the group provisional until final confirmation, and requested comparison wireframes. These decisions do not constitute agreement to this complete contract or implementation authorization.
- References: [ramp direction](../project/guided-color-palette-generation.md#agreed-ramp-direction--20-november-2026), [scale model](../design-tokens/conceptual-model.md#scale-generation), [architecture](../project/architecture.md), [interoperability](../design-tokens/interoperability.md), [workflow](../workflow/agent-roles.md), [presentation conventions](../project/presentation-conventions.md), [existing retention qualification limits](007-local-retention-and-backup.md#deferred-qualification).

## Latest planning decisions — 21 November 2026

**This draft requires reconciliation before agreement.** The fixed-11 and single-recipe
proposals below are historical and are superseded by the
[latest owning decisions](../project/guided-color-palette-generation.md#first-increment-decisions--21-november-2026):
single seed, adjustable **2–20** steps with **11** default, positional naming,
constant OKLCH hue, **B retained chroma by default** with **A linear taper** available.
Agreed interface wording is **Color intensity: Retained / Restrained**, with
Retained selected by default. The seed’s alpha is preserved uniformly across
generated steps (agreed 21 November). Generated values are authored in OKLCH;
HEX input for a new seed uses the effective project default authored space, with
an unobtrusive helper and no conversion-confirmation step. Explicit advanced-editor
space selection is preserved instead. Alpha remains unchanged; conversions are
approximate under existing policy, not claimed universally lossless. This does not
change existing-token behavior. sRGB is the default target gamut,
with an explicit inline choice for an out-of-gamut seed: preserve it using Display
P3 when it fits, or explicitly accept a previewed sRGB-adjusted seed. No option is
preselected; original-seed restoration remains available during the draft. Seeds
outside P3 require editing or explicit adjustment. Numerical mapping rules remain
open; the owning direction records the accepted interaction. The user also agreed
lightness endpoints 0.97/0.20, nearest-reference Auto, exact endpoint seed replacement,
halfway-to-white/black expansion for near-extreme interior seeds, white/black
endpoint restrictions and non-blocking repeated-preview feedback. The owning
record specifies the formulas; detailed numerical qualification remains pending.
Creation uses a provisional dialog entered through group creation; subsequent
editing uses the central workbench. Creation has no individual-step editing;
Auto recalculates on seed/count changes, while removed manual positions require
confirmation of a replacement. Final positioning includes review, target gamut,
full paths and repeated-preview feedback, with checkerboard/light/dark preview
backgrounds. A separate final confirmation screen is not required. The
[creation wireframes V3](../project/workbench-layout/color-ramp-creation-v3.md)
refine this direction for user review; they are not approved for analyst review.
Departing steps after a count change are kept as ordinary tokens by default,
preserving their identities, values and references. Returning labels use explicit reviewed conflict choices, defaulting to reuse
and keep value as Manual. Alternatives are reuse with generated value, or leave
outside with name/count resolution required. Preserve identities; do not silently
rename, skip required steps or convert incompatible tokens. Protection interaction
and exact reuse eligibility remain unresolved. Multiple anchors are deferred. Detailed
numerical, count-change and interaction criteria remain to be revised; none of
this constitutes final contract/design agreement or implementation authorization.

## Outcome

Authors create a color ramp, reopen its remembered settings, and review proposed
changes while preserving deliberate manual values. The first slice exercises that
complete lifecycle with fixed membership rather than introducing every generation
control or migration workflow.

## Scope

The following is the proposed contract scope; only the explicitly recorded user
decisions below are already agreed.

- Enter through the existing group-creation form with **Generate a color ramp**.
  Unchecked, retain ordinary group creation; checked, **Continue** opens ramp setup
  without saving an empty group. Final confirmation creates group, tokens and ramp
  metadata together; cancelling leaves no provisional group in applied data.
- Create a new named ramp group in an existing project beneath a selected namespace,
  containing 11 ordinary color tokens named `50`, `100`, `200`, `300`, `400`, `500`,
  `600`, `700`, `800`, `900`, `950`. No adoption or overwrite of existing groups.
- Use one deterministic, versioned generation recipe. Choose a seed and either
  Auto placement or an explicit step. Exact algorithm and numerical policy remain
  unresolved; no prototype calculation establishes the production contract.
- Preview the complete ramp and resulting token paths before creation. Edit
  individual candidates and preserve those edits during subsequent generation.
- Retain optional group metadata containing generation settings, exact recipe seed,
  accepted anchor position and ordered step-to-token identity associations. Reopen
  from the group to adjust settings and review regeneration.
- Keep the 11 labels and member identities fixed during regeneration. Group renaming
  retains associations. Unrelated tokens subsequently created in the group do not
  automatically become ramp members.
- Apply accepted token and metadata changes atomically, with one Undo/Redo step.
  Persist applied ramp data through normal retention and project backups; drafts
  remain session-only.
- Integrate manual override detection with ordinary token editing. Value edits
  affect protection; description and layer edits alone do not.
- Exclude custom labels/counts, membership editing, detachment UI, existing-group
  adoption, overwrite conflict resolution, multi-anchor generation, curve controls,
  pasted-list import, semantic recipes, contrast calculations/targets, and new
  interchange export mappings. These exclusions do not remove the broader product
  direction or resolve its deferred questions.

## Acceptance criteria

These are draft observable requirements, subject to the unresolved decisions and
identified design agreement. Criteria are not claims of existing behavior.

- AC-1 — Preview and creation: the group-creation checkbox starts ramp setup without
  creating an applied group. Seed/settings and per-step changes remain draft-only
  until confirmation. The preview exposes all 11 names, paths and values, with
  generated, seed-anchor and manual states distinguishable without color alone.
  Invalid input or a namespace collision blocks creation with actionable feedback.
  Cancel creates neither group nor tokens.
- AC-2 — Exact seed and placement: Auto visibly suggests a recipe-dependent step
  and allows explicit selection. The accepted position and exact recipe seed are
  retained. Reopening does not move the seed or regenerate applied data. An explicit
  recalculation action revisits placement; its algorithm and edge-case behavior
  must be specified before this criterion can be agreed.
- AC-3 — Manual overrides: intentional value changes in either ramp editing or
  the ordinary token inspector preserve that member by default during regeneration.
  A metadata-only edit, unchanged Apply, or viewing conversion does not mark it
  manual. A manual value does not reshape neighbouring candidates. Returning
  manually to an older value does not silently resume generation.
- AC-4 — Recipe seed versus anchor token: inspector editing of the token at the
  assigned seed step makes that token manual and leaves the saved recipe seed
  unchanged. The ramp clearly distinguishes that applied override from the recipe
  seed. Generation still uses the exact saved seed; changing the recipe seed does
  not silently replace the overridden token. An explicit accepted generated
  replacement can restore the step to generation, subject to AC-6 protection rules.
- AC-5 — Reopening and review: a saved ramp reopens with settings, member identities
  and manual states intact. A proposed change shows current and candidate values.
  The proposed first-slice review allows each changed step to keep its current value
  or accept its candidate, then applies the selected set once. Keeping a divergent
  current value is proposed to make it manual; this policy still needs agreement.
  No review action writes data before final Apply.
- AC-6 — Explicit reset and protection: a manual step offers Keep manual value and
  Use generated value. The latter previews the generated candidate; only acceptance
  removes the ramp override. Reconciliation with existing token-wide regeneration
  protection must be agreed before implementation, including whether/how a separate
  protection can be explicitly removed. No implicit clearing of unrelated protection.
- AC-7 — Fixed topology and identities: regeneration updates the same 11 member
  identities without renaming, moving or deleting them. Existing aliases to those
  identities remain intact. Unrelated group members remain untouched. Missing or
  unsupported members produce an explicit blocked-regeneration state rather than
  silent recreation; exact supported member forms and recovery guidance remain open.
- AC-8 — Atomic application and history: creation writes the group, tokens and
  metadata together. Regeneration writes accepted values, settings and override
  state together. Each successful operation is one history step; Undo/Redo restores
  values and metadata consistently. A genuinely unchanged result writes nothing and
  preserves existing no-op/history semantics. A settings-only change may still be
  meaningful even if no token value changes.
- AC-9 — Retention and compatibility: reload/reopen and exact project backup/restore
  preserve ramp settings, identities and manual states. Existing projects without
  ramp metadata retain their behavior. Versioned validation rejects malformed or
  unsupported metadata without silently discarding it; reader/writer compatibility
  and older-application refusal behavior require an explicit schema contract.
- AC-10 — Revision and draft safety: Apply is checked against the project revision
  used for review. A stale baseline, ownership loss or rejected/unknown write cannot
  silently overwrite current tokens or present an unconfirmed operation as saved.
  Preserve the draft and use explicit recovery/review. Departure guards, pending
  gates and errors remain consistent with existing authoring flows.
- AC-11 — Usable review: the identified design supplies labeled keyboard-operable
  controls, visible focus, reachable validation/actions and readable comparison at
  desktop and a representative narrow layout. Closing a disclosure or switching
  review steps does not discard the draft. Exact placement, focus transitions and
  accessible status announcements belong to the pending design.

## Decisions and open questions

### Established direction and user decisions

- Optional metadata on ordinary groups, ordinary independently authored tokens,
  remembered settings and reviewed regeneration follow the recorded ramp direction.
- Fixed 11-step first scope: `50`, then `100` through `900`, then `950`; no topology
  changes in this slice. User agreement recorded 20 November 2026.
- Inspector edits of the seed-position token create a manual override without
  changing the recipe seed. User agreement recorded 20 November 2026.
- Entry through group creation with a ramp checkbox and a provisional group until
  final confirmation: user agreement recorded 20 November 2026. No separate permanent
  New ramp action. Dialog versus central preview plus inspector is not yet selected.
- Exact seed, recipe-dependent Auto suggestion and saved accepted placement remain
  established direction. This does not select an automatic placement algorithm.

### Resolve before final agreement and implementation

1. **Generation policy:** what progression should the first recipe produce? Prepare
   representative brand, neutral, near-light/dark and high-chroma examples, then
   propose the deterministic algorithm, versioning, rounding, precision, endpoint,
   hue/chroma and Auto-fit/tie policies. Recommend one fixed recipe; tuning controls
   would expand the first slice. Numeric research is still required.
2. **Input and output colors:** which seed forms, alpha values and stored spaces are
   supported? Decide how generation space differs from authored/output space and
   the project default. Define gamut mapping and unsupported inputs without changing
   the exact seed silently. No sRGB-only, opaque-only or universal-space policy is
   selected by this draft.
3. **Per-step acceptance:** may a user keep any current step while applying other
   proposed changes? Recommend yes, with one final atomic Apply and kept divergent
   values becoming manual. This preserves individual review but requires clear
   handling of settings changes that no longer match every applied value.
4. **Protection:** how do manual ramp state and existing `allowed`/`protected` token
   metadata interact? Recommend one clear effective protection rule, without silently
   clearing independent protection. Decide exact persistence/reset semantics before
   implementing either editor integration or regeneration.
5. **Membership eligibility:** how should references, manual alpha/space changes,
   incomplete restored membership and extra group tokens appear? Recommend extra
   tokens stay outside membership and unsupported/missing members block regeneration
   with a useful explanation. Do not remove existing ordinary editing capabilities
   merely to simplify the ramp. Exact supported forms remain unresolved.
6. **Persistence:** select the validated versioned metadata representation, recipe
   identification and reader/writer compatibility policy. Include unknown-recipe
   behavior and backup fidelity. This is technical preparation, not a new canonical
   persistence-platform choice.
7. **Creation conventions and design:** confirm new-group-only collision behavior,
   default token layer, selected namespace behavior, and the review
   layout. Recommend primitive-layer creation with no inferred semantic role; this
   remains a proposal. The designer owns the identified interaction proposal.

Deferred questions include additional recipes, editable topology, automatic group
adoption, detachment, contrast profiles and ramp-metadata interchange mappings.

## Verification approach

Proposed only; no production verification campaign has started.

- Domain/application checks: deterministic fixtures once numerical policy is agreed;
  exact seed and Auto stability; manual/anchor override transitions; partial review;
  fixed identities and unrelated-token preservation; invalid/colliding candidates;
  atomic/no-op/history behavior; stale revision and unsupported metadata handling.
- Focused codec/backup tests: new and historical project round trips, invalid/unknown
  metadata and recipe versions, and selected older-reader refusal behavior.
- Representative Chrome checks: create, cancel, reopen, manually edit an ordinary
  member and the seed-position member, regenerate/review/reset, Undo/Redo, reload,
  backup/restore, keyboard/focus and one narrow layout. One ordinary 11-step ramp is
  the representative performance workload; no new large-project guarantee.
- Human design check: from a saved ramp, change its seed and compare generated
  neighbours with a protected manual step. Confirm the recipe seed versus manual
  anchor distinction and review choices are understandable. This assesses usability,
  not numerical correctness or a substitute for integrity tests.
- Proposed shared production-verification ceiling: 45 aggregate minutes and two
  harness repairs across developer/reviewer/coordinator. This exceeds the small-change
  default because the slice crosses generation, two editing paths, retention and
  history. Reassess suitability before implementation; no budget is consumed or
  campaign authorized merely by this proposal.
- Preparation so far consists of bounded read-only source/document inspection and
  contract drafting; no application tests or browser qualification. Earlier increment
  consumption and stop decisions remain with their owning records and are not reset.
- Exclude broad engine, accessibility certification, stress, full recovery matrix and
  prior deferred PWA/retention qualification. Stop at either ceiling or earlier for
  tooling dominance/low value; report unmet criteria explicitly. Resumption requires
  an explicitly authorized bounded follow-up under the [shared rules](../workflow/agent-roles.md#proportionate-verification).

## Design proposals and review

- Designer required: substantial creation, regeneration and per-step review flow.
- Current comparison: [Color ramps V2](../project/workbench-layout/color-ramps-v2.md),
  static wireframes comparing the dialog and central-preview/inspector surfaces
  through the agreed group-creation entry point. The [V1 written proposal](../project/workbench-layout/color-ramps-v1.md)
  remains historical; its separate New ramp entry is superseded. No interactive
  prototype exists and neither editing surface is selected.
- User review: pending; no identified proposal approved for analyst review.
- Analyst design review: not performed. Begins only after the user approves the
  identified proposal for that review.
- Material revisions return to the user before renewed analyst review.
- Final contract/design agreement and implementation authorization: pending.

## Review baseline

Planning only. Before implementation, capture the actual base commit and pre-existing
changes. Before independent implementation review, identify a stable complete diff
and new files. Do not infer implementation approval from this draft or prototype work.
Leave staging, committing and pushing to the user.

## Agreed amendments

20 November 2026: after the initial draft, the user agreed the group-creation
checkbox and provisional creation until confirmation, and requested surface
comparison wireframes. These planning inputs supersede V1’s separate New ramp
entry. Remaining criteria and proposals await agreement.
