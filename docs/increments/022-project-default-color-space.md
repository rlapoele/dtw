# Increment 022: Project default color space

- Contract status: Draft
- Delivery status: Not started
- User request — 20 November 2026: allow choosing a default color space in project creation, with OKLCH selected by default. The user then clarified this belongs to project creation options/preferences and explicitly selected “Keep sRGB for existing projects.”
- Agreement: the creation selector and OKLCH preselection are requested. The legacy fallback to sRGB and a typed ProjectPreferences model are also agreed; later preference editing is deferred. The remaining detailed scope and compatibility strategy below are proposals; final contract agreement and implementation authorization against this contract are pending.
- References: [project model](../design-tokens/conceptual-model.md#project-ownership-and-identity), [product concept](../project/product-concept.md#project-centered-workflow), [architecture](../project/architecture.md), [interoperability](../design-tokens/interoperability.md), [presentation conventions](../project/presentation-conventions.md), [workflow](../workflow/agent-roles.md), [019 compatibility precedent](019-project-description-and-lifecycle-dates.md#agreed-implementation-and-migration-boundary).

## Outcome

A newly created project remembers the author's preferred starting color space.
New color tokens start as opaque black in that space, so authors need not repeatedly
switch away from sRGB. Existing authored colors retain their explicit spaces and values.

## Proposed scope

- Add a labeled Default color space native Select to the established project creation
  form, grouped under Project preferences and using existing owned controls and the five supported canonical spaces:
  sRGB, Display P3, HSL, OKLAB and OKLCH. Preselect OKLCH.
- Persist an optional `preferences: ProjectPreferences` project field, where
  `ProjectPreferences` requires `defaultColorSpace: ColorSpace`. New project
  creation explicitly establishes this typed object; omission from a creation operation defaults
  to OKLCH. Absence in loaded historical data remains absence, not inferred authorship.
- Use the project's effective default for the workbench's new-color-token starter
  value and its creation-dialog disclosure. Preserve the existing opaque-black
  starter: three explicit zero components and alpha 1 in the chosen space.
- Preserve explicit token-value inputs to application operations. The project
  default is an authoring convenience, not a constraint or implicit conversion rule.
- Carry the field through browser protocol validation, project projections,
  retention, backup and exact restore, preserving history and lifecycle behavior.
- Exclude later editing of the project default, new project inspector fields,
  converting existing tokens, overriding an existing token's editor view or authored
  space, changing import/export profiles, and new storage or color dependencies.

## Acceptance criteria

- AC-1: Each fresh project creation form selects OKLCH. Authors can select any of
  the five supported spaces using a labeled keyboard-operable control. The form
  explains that the setting supplies the starting space for new color tokens.
- AC-2: Changing only the color-space choice away from OKLCH participates in the
  existing dirty-close and browser-leave protection. Keep editing preserves it;
  discard resets it. Pending, rejected, unknown-outcome and retained-but-unreadable
  creation preserve the choice through existing recovery. Confirmed successful
  creation/readback and explicit discard reset the next form to OKLCH.
- AC-3: Successful project creation retains the selected space, including across
  reopen. Omitted creation input establishes OKLCH. Unsupported or malformed input
  is rejected at application/runtime boundaries without an accepted partial write.
- AC-4: New color-token creation in that project discloses and authors opaque black
  in its effective default space, with three zero components and alpha 1. Existing
  name, group, description, layer and draft/recovery behavior remains intact.
- AC-5: Existing tokens, aliases, authored spaces, exact components and alpha remain
  unchanged. Explicit token-creation values still win over the project default.
  Viewing or changing projects does not convert colors or mark token drafts dirty.
- AC-6: Supported old projects/backups without the field load without rewriting or
  inventing it. New token creation uses the agreed legacy fallback below. Existing
  explicit values survive ordinary edits, Undo/Redo, backup and exact restore;
  absence stays absent through exact restore.
- AC-7: Closed version-specific validation accepts old authored versions 1/2 and
  new version 3, rejects preferences in versions 1/2, rejects malformed preferences, unsupported spaces,
  unknown fields and unsupported future versions, and preserves whole-snapshot
  rejection. New writes/backups identify authored version 3 so older builds fail
  closed instead of silently dropping the preference.

## Decisions requiring agreement

1. **Meaning of default:** use it for newly created workbench color tokens only;
   keep existing token authoring/view behavior and explicit API inputs unchanged.
   This is the coordinator's stated interpretation, proposed for contract agreement.
2. **Legacy fallback — agreed:** the user explicitly selected sRGB for projects
   without the setting on 20 November 2026, preserving their previous new-token
   behavior. Existing tokens remain unchanged and absence remains absent. This
   decision no longer requires confirmation.
3. **Compatibility:** recommend authored version 3, with optional `preferences: ProjectPreferences`
   so exact historical restores can preserve absent preferences. Present preferences
   require a supported `defaultColorSpace`; an empty object is not a legacy fallback. Keep retained record versions
   1/2 and backup envelope format version 1: their outer structures are unchanged.
   No eager migration or write on read. New writes and generated backups emit 3;
   old versions retain their original closed project-field rules. This follows the
   established version separation rather than introducing a migration framework.
4. **Preferences model — agreed:** the user explicitly requested a project
   preferences data model, even though later preference editing is deferred.
   Store `preferences?: ProjectPreferences`, with the typed required member
   `defaultColorSpace: ColorSpace`. New projects establish this object; historical
   absence stays absent and uses the agreed sRGB fallback. This is a focused typed
   model, not an arbitrary settings bag. Update affected owning documentation.

Implementation waits for agreement to the resulting contract. No approval
already given for the selector or OKLCH preselection needs to be repeated separately.

## Interface assessment

This is a bounded extension of an existing form using an existing Select, not a
substantial new interaction or visual direction. A separate designer/prototype
phase is not recommended. Place a Project preferences group after Description and
before actions, containing the selector with existing color-space labels. Suggested
help: “Starting color space for new color tokens. Existing tokens keep their own
color space.” This is a saved project authoring preference, not a color restriction;
the visual group corresponds to the agreed typed ProjectPreferences model. Update dirty-discard copy to cover
all project details, and update the new-token dialog's current hardcoded sRGB
headline and initial-value facts. No layout redesign is needed.

## Implementation touchpoints

- `src/domain/project.ts`: typed ProjectPreferences, project/input preferences and new-creation default; reuse
  `ColorSpace`, `COLOR_SPACES` and existing supported-space validation.
- `src/application/retention/{service,codec,record,ports}.ts`: creation, authored
  version 3, closed validation and backup output. Check snapshot/history admission
  and project projections rather than assuming type propagation is sufficient.
- `src/hosts/browser/{protocol,validation}.ts`: request, response, context/header,
  snapshot and recovery validation paths; preserve the selected pending attempt.
- `src/presentation/App/components/ProjectsWorkbench/`: creation hook/form/dialog,
  draft protection and reset/recovery; adapt owning caller contracts together.
- `src/presentation/App/components/TokensWorkbench/components/AuthoringDialog/`:
  actual starter construction and matching disclosure through the existing owner.
- Update only affected conceptual model, product/architecture/interoperability
  descriptions and status; check other owning documents for contradictions.

## Verification approach

- Focused tests: each supported space/default omission; invalid input; color-only
  dirty guards/reset and creation recovery; new-token starter and disclosure;
  explicit token values unchanged; old/new retained records and backups; exact
  restore; representative ordinary edit and Undo/Redo preservation.
- Focused Chrome flow: initial OKLCH, keyboard selection, color-only close guard,
  create a non-default project/token, reopen and verify the chosen space; verify
  one fresh OKLCH project/token. Inspect the added field at desktop and a narrow
  form width. Use synthetic local data; do not modify the user's projects.
- Run typechecking and relevant tests. Use source review for unaffected boundaries
  and report any unexercised failure path honestly; no full retention campaign.
- Proposed shared implementation/review ceiling: 30 aggregate verification minutes
  and two harness-repair cycles. This is appropriate for a small schema/form slice;
  stop earlier when essential evidence is sufficient or tooling dominates. Analyst
  planning/source inspection used approximately four minutes, no test/browser runs
  and no harness repairs; this is not production verification. Earlier campaigns
  and qualification limits remain closed. No automatic budget reset or extension.
- Exclude stress, exhaustive engines, crash/suspension qualification and prior
  Increment 007 deferred work. Separate developer and independent reviewer per
  workflow; preserve an identified stable review snapshot.

## Review baseline

Planning baseline: `76f6a11910ae6e1eaa4b01380e553d6e1cbbd6f0`; working tree was
clean before this contract. The user reports the preceding applied-HEX/action
placement changes committed and pushed. No staging, committing or pushing is
part of agent authority. No implementation or independent implementation review
has occurred for this Draft.
