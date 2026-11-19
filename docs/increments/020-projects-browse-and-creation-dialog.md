# Increment 020: Projects browsing and creation dialog

- Contract status: Agreed
- Delivery status: Completed — implementation and independent review; user acceptance pending
- Agreement: on 19 November 2026, the user agreed to the refined contract, including the two-line description preview, and explicitly authorized implementation following V1.1 analyst review.
- References: [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [React contracts](../../AGENTS.md#react-component-contracts), [workflow](../workflow/agent-roles.md), [project metadata](019-project-description-and-lifecycle-dates.md), [retention limits](007-local-retention-and-backup.md#deferred-qualification).

## Outcome

Users browse and find their browser-local projects through a workspace organized
like Tokens: heading and actions, search, a structured selectable list and useful
empty states. New project opens the creation form in a dialog instead of placing
it permanently beneath the list.

## Scope

- Adapt the Tokens main-content hierarchy and visual language to Projects.
- Add project search and a token-like project list using existing catalogue facts,
  including Created and Last updated as requested in the V1.1 amendment.
- Add a prominent New project action and a dialog with required name and optional
  description, retaining the existing creation operation and successful open flow.
- Integrate existing restore, storage guidance, feedback and recovery controls into
  the agreed layout. Retain the project inspector and explicit Open project action.
- Exclude project metadata editing/deletion, bulk actions, new catalogue fields,
  storage/backup schema changes, token semantics, new dependencies, and a restart
  of deferred retention or cross-browser qualification.

## Acceptance criteria

- AC-1: Projects has the agreed heading/action area, search, structured list and
  empty-state hierarchy. New project opens a dialog; no creation form remains
  permanently in the browsing content. Existing centered Projects geometry and
  responsive browse/inspect behavior remain unless an identified design amendment
  is agreed.
- AC-2: Search follows the agreed matching and ordering rules. Loading/unavailable
  catalogue, genuinely empty catalogue and no search matches are distinguished.
  Search never mutates, opens or removes a project. Clearing it restores the list.
  Matching, sorting and query lifetime follow the proposed final details below.
- AC-3: Rows preserve stable row-key selection, duplicate-name and unnamed-project
  readability, and unavailable-entry diagnostics. Filtering does not silently
  select another project or invalidate an existing selection. The agreed design
  makes a selected project outside the filtered list understandable and revealable.
  Opening and revision-checked backup remain explicit inspector actions. Rows show
  Project (name/description), Contents, Created and Last updated; dates move to
  labeled row metadata below the agreed container-width threshold. Known dates
  use local calendar dates; absent legacy dates remain Unknown and unavailable
  entries show Unavailable. No dates are invented or changed by browsing.
- AC-4: The creation dialog contains accessible name/description fields, Create and
  a clear closing action. Name remains required without trimming accepted text;
  duplicate names remain supported. Description retains exact accepted text.
  Successful creation still opens the retained project through existing recovery.
- AC-5: Pending, rejected, unknown-outcome and retained-but-unreadable creation
  preserve inputs and existing command gates. Required Check outcome, Retry reading
  and safe-leaving recovery controls remain visible and operable in the active
  modal workflow; an inert page behind a dialog cannot be their only location.
  No blind retry or duplicate creation is introduced.
- AC-6: Dialog opening, closing, reopening and dirty-input handling follow the
  agreed policy. Keyboard focus enters the name field, remains within the modal,
  and returns to the invoking control on ordinary closure; validation focuses the
  relevant field. Pending/recovery closure cannot bypass current safety gates.
  Dirty Cancel, Escape and backdrop dismissal offer Keep editing / Discard draft.
  Keep editing retains exact input and returns focus to the form; explicit Discard
  clears the draft and closes. Clean closure needs no discard confirmation.
  Dialog visibility alone does not reset App-owned drafts or command state.
- AC-7: Backup restore retains file staging, preview/replacement safeguards and
  feedback. Storage status/retry and browser-local retention guidance stay
  discoverable. Catalogue and recovery errors remain actionable, including while
  a dialog is open. Relocation does not change backup/restore semantics.
- AC-8: App continues to own Projects workflow lifetime and host authority;
  `useProjects` is not moved into a conditionally mounted dialog. Selection,
  scroll and unfinished creation input continue to survive relevant screen
  changes. Search lifetime is explicitly agreed and tested. Presentation changes
  use existing aliases, owned primitives, semantic utilities and narrow contracts.

## Decisions and open questions

### Approved design intent

V1.1 is approved for analyst review, not final implementation. It establishes the
Projects / All projects heading, Restore backup and New project actions, search,
selectable rows and existing inspector, contextual empty states, Browser retention
disclosure and the dirty-close confirmation. The user's later request adds both
lifecycle dates to rows, superseding V1's inspector-only date placement.

### Proposed final interaction details

These details make the approved direction implementable and require final contract
agreement; they do not create new domain or persistence policies.

- Search supported name, description and identity by a case-insensitive substring
  after trimming query edges. Use deterministic case folding, not ambient locale;
  preserve authored values. Unavailable entries match their identity and visible
  fallback label, without inventing missing metadata. Whitespace-only query is
  equivalent to empty for filtering, counts and empty-state copy.
- Sort by displayed name with English natural numeric, case-insensitive collation;
  use exact identity then rowKey tie-breaks. Unavailable/unnamed labels participate
  consistently. Selection, React keys and reveal use rowKey, never display name or
  assumed unique identity alone. Query survives Open/Back and catalogue refresh in
  App-owned view state; filtering retains selection and scroll policy.
- Show identity for duplicate/unnamed/unavailable rows; determine duplicates from
  the complete catalogue so filtering does not remove needed disambiguation. Keep
  full identity and exact description available in the existing inspector.
- Use short local dates with day, English abbreviated month and year, semantic
  `time` values and a full local date/time title. The existing inspector remains
  the keyboard-accessible source for full date/time. Below 42rem of list-container
  width, dates become labeled metadata; no horizontal page overflow is introduced.
- Preserve complete searchable descriptions but use a bounded row preview, with
  wrapping for unbroken text; retain existing bounded, whitespace-preserving full
  description access in the inspector. Proposed preview limit: two visual lines.
- Restore backup opens the file-selection dialog, then hands off to the existing
  staged RestoreDialog as the sole active modal. Preserve its full replacement,
  backup protection, stage-loss and unknown-outcome review flow. Staging errors
  remain actionable in the selection dialog; repeated file selection works.
- Creation errors/recovery are rendered inside the creation modal. Preserve current
  `ProjectRecovery` gates: pending active mutations expose Check retained result;
  unknown results expose Check and Review before leaving; known retained/readback
  failure exposes Retry reading. Keep the existing safe-leaving confirmation and
  default Stay here focus. Do not add a new Leave action for known-retained results
  merely because the sample shows one. App-owned command state remains authoritative.
- Separate local creation validation from unrelated catalogue/open/backup errors;
  closing a modal must not erase unresolved recovery information. Only one active
  workflow owns focus; new creation/restore remain blocked by existing gates.

Final agreement must confirm these search/order/lifetime/date and bounded-preview
choices. Restore/recovery rules above preserve established production semantics
and explicitly supersede the sample's abbreviated handlers. Any requested departure
from those rules returns to design review before implementation.

## Verification approach

- Focused behavior tests: matching, empty/no-results distinction, unavailable rows,
  selected-but-filtered rows, query lifetime and creation close/reopen policy.
- Component/hook checks: preserve existing validation, pending/rejected/unknown and
  retained-readback gates, exact form text, restore entry and App state ownership.
- Bounded Chrome pass using disposable data: populated and empty Projects,
  search/clear/reveal, create/close/reopen, validation and successful creation,
  keyboard focus and a representative narrow browse/inspect layout. Use controlled
  tests for exceptional outcomes rather than restarting storage fault qualification.
- Run typechecking and affected tests; review the resulting component tree and
  callers. Broaden only for concrete regression evidence.
- Proposed shared implementation/review ceiling: 30 aggregate verification minutes
  and two harness-repair cycles, finalized before substantial verification. Initial
  analyst planning consumed approximately four minutes of source/document review;
  no tests, browser checks or harness repairs performed. Other agents' planning
  consumption is recorded by the coordinator before verification begins.
- Exclude maximum-load stress, additional engine qualification and all previously
  deferred Increment 007 campaigns. Prior evidence gaps remain open. Stop at either
  ceiling or earlier when value falls; no automatic budget reset or extension.

## Design proposals and review

- Prototype amendment requested on 19 November 2026: show project creation and
  last-updated dates in the project list as well as the inspector. Adapt their
  presentation to available width and preserve explicit unknown-date fallbacks.
  Design V1.1 implements this in the isolated prototype. Build and browser
  inspection of populated date columns passed; narrower placement was source-checked.
  This amendment used approximately two additional minutes of focused checks.
- On 19 November 2026, the user approved the recommended direction and explicitly
  authorized a prototype, including dirty-form Keep editing / Discard draft.
  The approved direction uses Projects / All projects, Restore backup and New
  project actions, name/description search, Project and Contents columns, the
  existing inspector, contextual empty states and a Browser retention disclosure.
  Centered geometry remains. V1.1 subsequently adds Created and Last updated to
  list rows; identity remains in rows where disambiguation or unavailable-entry
  feedback needs it.
- [Design V1.1](../../prototypes/projects-browse-v1/DESIGN-V1.md), with the isolated
  prototype at `prototypes/projects-browse-v1/`, was explicitly approved by the user
  for analyst review on 19 November 2026. Sample data and operations remain in-memory
  illustrations; this approval does not authorize production implementation.
- Bounded prototype checks: Vite build passed; browser inspection exercised
  description search with uppercase query, no matches, preserved filtered
  selection/reveal, empty collection, creation initial focus, dirty Cancel,
  Keep editing preservation and Discard focus return. At an observed 780 CSS-pixel
  width, browse/inspect/back worked without page overflow. Requested viewport
  dimensions were scaled by the browser tooling, so no exact 390px claim is made.
  Approximately eight aggregate minutes of prototype source/build/browser checks
  were used against a ten-minute ceiling. No production qualification was run.
  Recovery/restore scenarios are provided for review but were not runtime-qualified.
- A duplicate React-root warning during live prototype edits was repaired by
  separating the Fast Refresh component from the root entry. The repair passed
  build/source checks; browser checks were not repeated after that tooling fix.
- Analyst design review completed on 19 November 2026 against V1.1 at
  `8404f4831baa21144ae505b11e1f78ce328e3c97`. Findings and dispositions follow.
- Final contract/design agreement and implementation authorization: explicitly granted on 19 November 2026, including all refined interaction details and the two-line description preview.
- Material revisions return to the user before renewed analyst review.

## Review baseline

Planning baseline: `569f367`; the coordinator reported a clean working tree at
start. This initial draft changes documentation only. Record the full implementation
baseline and stable review snapshot when those stages are authorized. Staging,
committing and pushing remain user-owned.

### Analyst review — V1.1

Bounded source/document review by the separate analyst; no browser or production
verification was performed. The hierarchy and explicit creation/selection split
fit the existing architecture. No domain/schema change is required. The prototype
must not be copied as a replacement for production workflow owners.

| Finding | Severity and scenario | Required disposition |
| --- | --- | --- |
| Recovery illustration differs from current gates | P1 if copied: `App.tsx:61` offers Review leaving for retained-readback failure; it omits production's pending Check action. This would change recovery behavior and could strand a pending modal. | Preserve the current ProjectRecovery gates inside the modal, as AC-5 and final details now specify. The fake successful recovery callback is documented illustration, not retention evidence. |
| Long description presentation is unbounded | P2: `App.tsx:53` and `.project-description` render an entire description with no clamp or unbroken-text wrapping; long admitted content can dominate rows or overflow. The prototype inspector also lacks production's bounded exact-text presentation. | Use the proposed two-line row preview and preserve the existing full inspector. This small presentation detail requires final agreement; no prototype edit was made. |
| Missing/stale selection and restore handoff are not modeled | Implementation constraint: static sample IDs/rows and `App.tsx:65` do not demonstrate production rowKey distinctions, refresh failures, vanished selections or preview-disposal-before-open. Restore's checkbox alone is not the real revision-bound replacement protection. | Preserve production gates, last-known/missing inspector state and App restore sequencing. Show selected project only reveals a still-present filtered row; it cannot promise to restore a missing entry. These are documented prototype shortcuts, not evidence of production defects. |
| Matching/order/lifetime and dates need precise agreement | Detail gap: V1.1 describes name/description/identity search and natural sort, while the earlier direction mentioned name/description; ambient-locale folding and raw-query empty copy are underspecified. | Proposed final details above settle behavior for final agreement, including Unknown/Unavailable dates and query persistence. No silent authorization is inferred. |

No material redesign is recommended. Approval should be sought for the refined
contract with these dispositions; any material user amendment returns to the
identified design before implementation. The analyst did not inspect simulated
storage behavior as if it qualified real recovery.

This explicitly authorized review used approximately five minutes of the six-minute
source-review ceiling and no harness repairs. It is additional to the earlier
four-minute analyst planning and coordinator-recorded prototype checks; no earlier
verification budget or deferred qualification was reset. Final implementation and
independent review still require their bounded allowance to be recorded before use.

## Implementation authorization and verification allowance

Implementation baseline: `23027206f9facf279573151b0b8e59b70a770e74`; working tree
was clean before recording authorization. The user agreed the refined contract
and authorized implementation on 19 November 2026. The final interaction details
above are now agreed, including the two-line preview; earlier proposal language
records the review sequence rather than an outstanding decision.

The user additionally emphasized production code quality: prototype code is a
visual/interaction reference, not production architecture. Implement through the
existing workflow owners, typed component contracts and shared primitives; do not
copy illustrative state, recovery handlers, identity shortcuts or compressed
prototype structure. Independent review must explicitly assess this boundary.

The production implementation and independent review share a 30-minute aggregate
verification ceiling and at most two harness-repair cycles. Allocate approximately
15 minutes to focused developer tests/browser checks and 10 to independent review,
leaving five for targeted corrections. Earlier planning (four analyst minutes),
prototype checks (approximately ten aggregate minutes) and analyst review (five
minutes) remain recorded and do not count as production qualification evidence.
This is the separately planned production allowance, not a restart of any prior
qualification. Essential checks cover search/selection, modal draft/focus behavior,
real recovery gates using controlled tests, restore handoff and representative
responsive layout. No stress, cross-engine or deferred retention campaigns.

After that allowance was consumed, the user explicitly authorized up to ten
additional minutes on 19 November 2026 to complete the browser check. This
follow-up is limited to the restore-cancellation focus gap and any confirmed
correction/recheck; it does not reopen deferred qualification.

## Completion report — 19 November 2026

**Implemented and independently reviewed; user acceptance pending.** The production
change follows agreed V1.1 and the refined contract. The prototype was used as an
interaction reference; its sample data, fake recovery and compressed component
structure were not copied into production.

Reviewed snapshot: base `23027206f9facf279573151b0b8e59b70a770e74` plus the working-tree
changes in App, ProjectsWorkbench, its creation/list/restore/storage components,
useProjects/useProjectsLayout, global CSS and affected tests/conventions. New files
are CreateProjectDialog/CreateProjectDialog.tsx, its private components/CreateProjectForm.tsx,
RestoreSelectionDialog.tsx, helpers/project-catalogue.ts and
`test/presentation/project-catalogue.test.ts`. The old standalone creation form
was removed. The reviewer assessed the stable implementation and subsequent
restore-focus deltas separately; documentation completion records were added after review.

### Acceptance evidence

| Criterion | Evidence and result | Status |
| --- | --- | --- |
| AC-1 — browsing hierarchy | Production browser shows heading/actions, search, list/empty states, inspector and retention disclosure; inline creation removed. | Verified |
| AC-2 — search and ordering | Pure catalogue tests cover matching/sorting/fallbacks; uppercase description search, no matches and query Open/Back persistence exercised in browser. | Verified |
| AC-3 — rows, selection and dates | Tests cover rowKey/identity and missing-state behavior; browser confirmed filtered selection/reveal, retained dates and responsive labeled metadata at observed 480 CSS pixels without overflow. | Verified |
| AC-4 — creation | Real disposable project creation with description opens Tokens; required-name validation focuses the input. Existing exact-text workflow remains. | Verified |
| AC-5 — recovery | Controlled coordination tests and independent source review cover retained/unknown/pending gates and preserved ownership. No real storage faults were forced. | Verified by controlled tests/source |
| AC-6 — drafts and focus | Browser checked initial focus, dirty Cancel/Keep editing exact text, Escape/Discard and return to New project; focused tests cover discard/recovery gates. Nested unknown-write safe-leaving focus was not exercised live. | Verified with stated runtime limit |
| AC-7 — backup/retention | Existing restore machinery retained; real disposable backup staged into existing same-identity review, then canceled without replacement. Browser confirmed focus enters preview and returns to Restore backup after refresh. | Verified for changed handoff; full restore qualification unchanged |
| AC-8 — state and architecture | App-owned query/open state, unconditional useProjects and command authority retained; tests and independent affected-tree review confirm ownership. | Verified |

### Checks and findings

- `npm run typecheck` passed. The initial three focused suites passed 42 tests
  and were independently rerun. Following focus corrections, the coordination
  suite passed all 33 tests, including added focus-policy, delayed-refresh and
  no-focus-stealing checks. `git diff --check` passed.
- Separate reviewer `projects_reviewer` found no actionable source/test defects
  and explicitly checked production quality, component consumers, aliases,
  recovery gates and documented CSS exceptions. Its browser surface was unavailable;
  runtime evidence was gathered by the coordinator in an isolated origin.
- Browser checks found two restore-focus issues: ordinary preview initial focus
  did nothing, and cancellation attempted return focus while catalogue refresh
  disabled the trigger. The fixes explicitly request preview focus, suppress the
  outgoing selection dialog's return focus, and restore the original trigger
  after refresh only when focus is still on the body and no modal is active.
  Separate source rechecks found no further issue; final browser cancellation
  settled with zero dialogs and Restore backup focused.
- Transient Vite reload errors occurred while files were moved during development;
  final imports/typecheck passed. These are not a clean-console qualification claim.
- Approximate aggregate verification: the original 30-minute allowance and two
  harness adaptation cycles were consumed. The user's additional ten-minute
  follow-up used approximately five minutes for confirmation, correction tests,
  independent source recheck and settled browser proof. Stop after the focused
  checks passed; unused allowance is not a reason to broaden testing.

### Limits and next step

No deferred retention, stress or cross-engine campaign restarted. The live browser
pass used disposable data at a separate origin and did not touch the user's usual
workspace. Real fault-driven nested safe-leaving focus, full restore replacement,
all viewport sizes and screen-reader delivery remain outside this bounded pass.
The controlled tests do not replace those runtime qualifications. The test tab was
closed; a disposable backup file was downloaded during verification.

The implementation is ready for user review and acceptance. Staging, committing
and pushing remain user-owned. Suggested commit:
`feat: improve project browsing and creation dialogs`.
