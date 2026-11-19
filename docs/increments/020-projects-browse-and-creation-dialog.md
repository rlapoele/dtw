# Increment 020: Projects browsing and creation dialog

- Contract status: Draft
- Delivery status: Not started
- Agreement: not yet agreed. The user requested Tokens-like Projects browsing, search, a similar list and dialog-based creation on 19 November 2026. Detailed design, final contract agreement and implementation authorization remain pending.
- References: [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [React contracts](../../AGENTS.md#react-component-contracts), [workflow](../workflow/agent-roles.md), [project metadata](019-project-description-and-lifecycle-dates.md), [retention limits](007-local-retention-and-backup.md#deferred-qualification).

## Outcome

Users browse and find their browser-local projects through a workspace organized
like Tokens: heading and actions, search, a structured selectable list and useful
empty states. New project opens the creation form in a dialog instead of placing
it permanently beneath the list.

## Scope

- Adapt the Tokens main-content hierarchy and visual language to Projects.
- Add project search and a token-like project list using existing catalogue facts.
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
- AC-3: Rows preserve stable row-key selection, duplicate-name and unnamed-project
  readability, and unavailable-entry diagnostics. Filtering does not silently
  select another project or invalidate an existing selection. The agreed design
  makes a selected project outside the filtered list understandable and revealable.
  Opening and revision-checked backup remain explicit inspector actions.
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

The explicit user requests in Scope are established intent. The following remain
proposals to settle through the designer/user review before implementation:

1. Search fields and matching: name only, or name/description/identity; case and
   whitespace handling; treatment of unavailable entries. Catalogue already
   exposes supported descriptions and identities; no project opening is required.
2. List contents and ordering: which of name/description, token/group counts,
   dates, status and identity belong in rows versus the inspector; preserve current
   catalogue order or agree a presentation sort. Unknown legacy dates stay unknown.
3. Filtered selection and search lifetime: preserve selection with a reveal action;
   decide whether query persists across opening/returning to a project.
4. Dialog close behavior: preserve an unfinished draft on closure or offer explicit
   discard confirmation. This is a new interaction because the current form is
   always visible. Existing session-only draft ownership is a constraint, not an
   implicit choice of dismissal policy.
5. Placement of restore entry, storage guidance and recovery: choose a concise
   browse layout without hiding essential controls, especially under modal inertness.

These are implementation-blocking details, not a request to reapprove the already
requested search/list/dialog direction. Broader persistence, import/export and
project-model questions remain deferred under existing owning documents.

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

- A separate designer is assessing the existing Tokens/Projects sections and
  preparing an independent recommendation. No design artifact has been approved.
- User feedback on the direction precedes prototype editing. An identified
  proposal is then presented for approval for analyst review.
- Analyst design review: not started; it must wait for that approval.
- Final contract/design agreement and implementation authorization: pending.
- Material revisions return to the user before renewed analyst review.

## Review baseline

Planning baseline: `569f367`; the coordinator reported a clean working tree at
start. This initial draft changes documentation only. Record the full implementation
baseline and stable review snapshot when those stages are authorized. Staging,
committing and pushing remain user-owned.
