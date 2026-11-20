# Increment 022: Project default color space

- Contract status: Agreed
- Delivery status: Completed — user-accepted on 20 November 2026
- User request — 20 November 2026: allow choosing a default color space in project creation, with OKLCH selected by default. The user then clarified this belongs to project creation options/preferences and explicitly selected “Keep sRGB for existing projects.”
- Agreement — 20 November 2026: after the typed ProjectPreferences correction, the user explicitly authorized: “Proceed with the implementation.” The contract, scoped semantics and compatibility strategy below are agreed.
- References: [project model](../design-tokens/conceptual-model.md#project-ownership-and-identity), [product concept](../project/product-concept.md#project-centered-workflow), [architecture](../project/architecture.md), [interoperability](../design-tokens/interoperability.md), [presentation conventions](../project/presentation-conventions.md), [workflow](../workflow/agent-roles.md), [019 compatibility precedent](019-project-description-and-lifecycle-dates.md#agreed-implementation-and-migration-boundary).

## Outcome

A newly created project remembers the author's preferred starting color space.
New color tokens start as opaque black in that space, so authors need not repeatedly
switch away from sRGB. Existing authored colors retain their explicit spaces and values.

## Agreed scope

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

## Agreed decisions

1. **Meaning of default:** use it for newly created workbench color tokens only;
   keep existing token authoring/view behavior and explicit API inputs unchanged.
   This is the agreed authoring scope.
2. **Legacy fallback — agreed:** the user explicitly selected sRGB for projects
   without the setting on 20 November 2026, preserving their previous new-token
   behavior. Existing tokens remain unchanged and absence remains absent. This
   decision no longer requires confirmation.
3. **Compatibility:** authored version 3, with optional `preferences: ProjectPreferences`
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

Implementation is authorized against this contract, including the typed preferences model.

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
- Shared implementation/review ceiling: 30 aggregate verification minutes
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
had occurred at the planning handoff.

Implementation baseline: `0fcdec08607685fa4b4533d95b51b508b7c88538`; clean working tree
before recording authorization. Developer and independent reviewer share the
30-minute verification ceiling and two harness repairs; no earlier campaign resumes.


## Developer implementation evidence — 20 November 2026

Implementation is ready for independent review; this section is developer evidence,
not reviewer conclusions or user acceptance.

- AC-1–AC-2: the existing native Select supplies all five spaces under Project
  preferences. `useProjects` retains the choice with the same App-owned lifetime;
  color-only leave/close protection, pending/rejected/unknown and unreadable
  retained recovery preserve it. Success/readback and explicit discard reset it.
  Deterministic hook tests cover these transitions, including the selected
  creation payload, color-only browser-leave guard and dirty-close request.
- AC-3–AC-5: domain and retained creation establish typed preferences, defaulting
  to OKLCH. Both runtime boundaries validate them. Hook tests check opaque-black
  creation in all five spaces and legacy sRGB; existing application tests retain
  exact explicit sRGB values and aliases in a new OKLCH-default project. The
  dialog uses the same effective default and canonical component names.
- AC-6–AC-7: lifecycle tests cover all selected defaults, ordinary group edit,
  Undo/Redo, reopen, backup and exact restore. Closed version tests admit old
  absence and version 3 preferences while rejecting preferences in versions 1/2,
  malformed preferences and future versions. Existing legacy restore/history
  checks remain passing. New retained writes/backups emit authored version 3;
  record versions and backup envelope version are unchanged.
- Final focused command: `npx vitest run test/domain/project.test.ts
  test/application/retention test/application/authoring.test.ts
  test/presentation/retention-protocol.test.ts test/presentation/projects-screen.test.tsx
  test/presentation/workbench-coordination.test.tsx` — **167 passed** in 13 files.
  `npm run typecheck`, `npm run build` and `git diff --check` passed. Build retains
  the existing large-chunk warning.
- One broader `npm test` run checked creation-shape compatibility across existing
  fixtures: **1233 passed, 1 failed**. The failure is unrelated
  `test/presentation/icon.test.tsx:19`, expecting `size-4 shrink-0` while Icon emits
  `size-4 shrink-0 stroke-2`. `git show` of both files at implementation baseline
  confirms the same mismatch predates this increment. Neither file was changed.
  The broad suite was not repeated; final focused testing includes the one
  subsequently added pending-choice assertion.
- Affected-tree source review: creation controls remain private to their existing
  dialog; App still calls the creation hook. No keys or mounted owner changed.
  Color-space labels moved to `App/helpers/color-space.ts`, the nearest common
  owner for ProjectsWorkbench and TokensWorkbench consumers; actual consumers
  import it directly and the obsolete local export was removed. Existing Select,
  Field and semantic utilities are reused; no new primitive, dependency, icon,
  CSS exception or conversion policy was introduced. Project context and history
  retain complete project objects rather than rebuilding/dropping preferences.
- Verification consumption: approximately **8 developer minutes**, **zero harness
  repair cycles**; approximately 22 of the 30 shared minutes remain before adding
  coordinator browser/reviewer consumption. Verification stopped after the focused
  checks and baseline diagnosis. Browser, keyboard/focus, narrow layout and actual
  storage reopen evidence are assigned to the coordinator; no crash, cross-engine,
  screen-reader or prior retention qualification campaign was restarted.

Suggested commit: `feat: add project default color space preferences`.

### Developer correction after catalogue finding

The coordinator's browser reload and independent reviewer exposed an omitted
catalogue boundary: the IndexedDB adapter spreads complete project metadata into
supported catalogue rows, but the closed catalogue DTO/validator did not admit
preferences. This prevented browsing projects after reload. The supported
`CatalogueEntry` now carries optional typed preferences, and both catalogue
allowlists admit and validate them. Unavailable rows remain closed and reject
preferences. No retained data rewrite or adapter storage change was needed.

An adapter-shaped catalogue regression covers all five valid choices, historical
absence, malformed present preferences, whole-response rejection and unavailable
rows. `npx vitest run test/presentation/retention-protocol.test.ts` passed all
14 tests; typechecking and diff checks passed. Approximately one additional
developer verification minute, no harness repairs. Coordinator browser reload
and reviewer recheck remain pending at this correction handoff. Edits paused.

### Independent review and final browser handoff — 20 November 2026

Implementation and independent review are complete; user acceptance is pending.
Reviewer `/root/preferences_reviewer` independently ran 112 focused tests and,
following the catalogue correction, all 14 protocol tests. The initial review
missed the catalogue projection; the coordinator's live reload exposed it and the
reviewer confirmed its source and subsequently verified the fix. No actionable
findings remain. The reviewer inadvertently read appended developer evidence
before source inspection; the review was separate but not fully blinded.

Final reviewed source/test snapshot: base `0fcdec08607685fa4b4533d95b51b508b7c88538`
plus tracked source/test diff SHA-256 `fe8e90ae6bd002636173d1a1bb0eb73d17f558844a53124305322bf5c5b2a709`
and new `src/presentation/App/helpers/color-space.ts` SHA-256
`ea4f05b574a49187c7c0daf9a51e3fa86f6662627e13db75ccab64bb95d67617`. Only coordinator documentation
and evidence artifacts followed this code review.

Chrome on isolated origin `127.0.0.1:5191` verified OKLCH preselection, changing
only the preference triggering the dirty-close guard, Keep editing preservation,
discard reset, creation with Display P3, matching new-token disclosure and authored
token space, successful reload/catalogue/open after the fix, and retained Display P3
preference for another token. A second fresh project reset to OKLCH and created an
OKLCH token. Desktop and 390px-wide form screenshots were inspected; labels, help,
selection and actions fit. Artifacts: [desktop](../../output/playwright/increment-022-desktop.png),
[narrow](../../output/playwright/increment-022-narrow.png),
[OKLCH token](../../output/playwright/increment-022-oklch-token.png).

The native select was keyboard-focusable, but synthetic Home/ArrowUp did not
change selection in this headless session. One bounded keyboard harness repair
was attempted, then selection was checked using Playwright selectOption. Native
keyboard selection remains unverified, not a demonstrated application defect.
Screen-reader delivery and forced storage-failure browser flows remain unverified;
focused hook/application tests cover recovery. No prior qualification was restarted.
The full-suite pre-existing Icon assertion failure remains as recorded above.

Approximate aggregate verification: 26/30 minutes (developer 9, reviewer 8,
coordinator 9), one of two harness repair cycles. Checks stopped after the fix,
targeted review and successful runtime recheck; no further campaign is requested.
Next human check: open New project, inspect Project preferences and try choosing
a color space with the keyboard; create a project/token to assess the intended flow.
Staging, committing and pushing remain with the user.

### User acceptance — 20 November 2026

The user reported: “I previewed in the browser and it works well.” Increment 022
is complete on the basis of this browser acceptance, implementation evidence and
independent review. The user did not identify individual keyboard or accessibility
checks, so acceptance does not claim those previously unverified paths were tested.
All recorded verification limits and the pre-existing Icon test failure remain.
No additional verification campaign or later preference-editing work is opened.

Suggested commit: `docs: record Increment 022 browser acceptance`.
