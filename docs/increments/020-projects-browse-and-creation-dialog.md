# Increment 020: Projects browsing and creation dialog

- Contract status: Draft
- Delivery status: Not started
- Agreement: not yet agreed. The user requested Tokens-like Projects browsing, search, a similar list and dialog-based creation on 19 November 2026. The user approved Design V1.1 for analyst review on 19 November 2026; final contract/design agreement and implementation authorization remain pending.
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
- Final contract/design agreement and implementation authorization: pending.
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
