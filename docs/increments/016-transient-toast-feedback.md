# Increment 016: Transient toast feedback

- Contract status: Draft
- Delivery status: Not started
- Agreement: None. Initial direction, design review and implementation authorization are pending.
- Prepared: 17 November 2026.
- References: [vision](../project/vision.md), [product concept](../project/product-concept.md), [principles](../project/principles.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md), [workflow](../workflow/agent-roles.md), [current handoff](../status/current.md).

## Outcome

Show short completed-operation feedback such as “Group created and retained.” in
bottom-center dismissible toasts, using a pale status background, dark foreground,
and fade/slide motion. Free the workbench's persistent feedback area from routine
confirmations while preserving messages needed to understand or recover current state.

This document proposes a boundary for “similar notifications”; it does not treat
all existing notice strings or status live regions as transient notifications.

## Scope and source inventory

The following is a proposed migration inventory, not an agreed design.
Paths below are relative to `src/presentation/App/components/`.

| Current owner and message category | Proposed treatment |
| --- | --- |
| `TokensWorkbench/components/AuthoringDialog/hooks/useAuthoringForm.ts`: group/token created, group renamed | Success toast after the existing completion condition |
| `TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor.ts`: changes applied and retained; both drafts discarded | Success toast for Apply; information toast for discard |
| `TokensWorkbench/hooks/useProjectCommands.ts`: unchanged command; confirmed recovered state/original command completed once | Information or success toast after resolution, preserving the original-write distinction |
| `TokensWorkbench/hooks/useHistoryInteraction.ts`: completed Undo/Redo and removed-selection explanation | One outcome toast including any associated selection explanation |
| `ProjectsWorkbench/hooks/useProjects.ts`: project retained in this browser | Success toast associated with that creation/recovery, visible through its automatic opening transition |
| Same history hook: “Undoing…” / “Redoing…” | Persistent progress until resolved, not an expiring outcome |
| `ProjectsWorkbench/hooks/useProjects.ts` and `ProjectsWorkbench/components/RestoreDialog/hooks/useBackupRestore.ts`: backup preparation/failure and download initiated/requested with instruction to confirm an independent file | Keep existing contextual feedback; browser download initiation is not proof of a saved backup |
| `TokensWorkbench/TokensWorkbench.tsx`, project/retention recovery, storage protection, editor/dialog validation and project diagnostics | Keep persistent/contextual: unknown result, retained-but-unreadable state, lost access, stale reads, retry actions, errors, warnings and diagnostics |
| Editor helper text and history availability/invalidation explanations | Keep contextual; these describe current state rather than a completed event |

Included: one coherent presentation mechanism for the approved outcome inventory,
manual dismissal, automatic duration, reduced-motion behavior and scoped accessible
announcements. An event must be classified at its source; `notice`, `role="status"`
or message wording alone is not a sufficient migration rule.

Excluded: canonical/domain changes, persistence or receipt semantics, new commands,
notification history, new Undo actions inside toasts, broad copy rewrites, dependency
migration and unrelated interface cleanup. Safety recovery and backup qualification
campaigns remain stopped; this increment does not reopen them.

## Proposed acceptance criteria

- AC-1: Each approved completed outcome appears bottom-center above the current
  workbench, with readable wrapping and no horizontal overflow at desktop and 320 CSS px.
  The migrated confirmation no longer occupies a duplicate inline region.
- AC-2: Success and information use distinct pale status surfaces with dark readable
  text. Text and an accessible dismissal name convey meaning without relying on color.
  Theme tokens, shared Icon usage and component ownership follow presentation conventions.
- AC-3: A toast can be dismissed with pointer or keyboard. Proposed automatic duration
  is five seconds of unpaused display, paused while hovered, keyboard-focused or the
  document is hidden. Dismissal/expiry never performs a project command or loses focus
  into a removed element. Exact keyboard access/return behavior belongs in the design.
- AC-4: Entry and exit use restrained fade/slide motion; reduced-motion preference
  removes positional animation. Arrival does not move focus or interrupt typing.
  Each outcome receives one polite announcement rather than duplicate inline/toast announcements.
- AC-5: Two separate operations with identical outcome text each produce feedback.
  Rerendering, reopening a screen or replaying existing state does not replay an old
  notification. A single completed command/recovery does not generate duplicate toasts.
- AC-6: Pending, unknown, rejected and retained-but-unreadable outcomes do not become
  success toasts or lose their persistent explanations/actions. Existing command gates,
  validation, recovery, history semantics and dirty-editor helpers remain intact.
- AC-7: Rapid outcomes, project transitions and modal overlap follow the identified
  agreed design without stale cross-project feedback, obscured required actions or
  premature expiry of a notification that could not be read. Final queue/stack and
  modal policies must be recorded before this criterion can be agreed.

## Decisions and open questions

- Established request: bottom placement, manual dismissal, fade/slide, pale status
  background, dark text and a common few-second duration. Horizontal centering was
  suggested by the user ("probably center") and is the recommended proposal.
- Recommended scope question: should only completed success/information outcomes
  become transient, with progress, errors and actionable safety feedback retained
  contextually? This preserves recovery instructions while covering routine confirmations.
  Scope agreement is needed before final inventory and implementation.
- Proposed timing: five seconds with interaction/document-visibility pauses. This is
  a concrete default proposal, not an accessibility or universal-duration claim.
- Before final agreement: identify the design's stacking/overflow, cross-project
  lifetime, modal overlap, keyboard access and focus-return behavior. A maximum-three
  upward stack is an initial designer suggestion; overflow behavior remains unresolved.
- Technology remains unselected. Reusing the installed Base UI toast capability is a
  candidate to assess within existing presentation constraints, not a new dependency decision.

## Verification approach and limits

For this draft, source inspection only; no tests or browser qualification. Approximately
four analyst minutes consumed in preparation, zero harness repairs. Coordinator and
designer preparation time must be added at handoff rather than assumed zero.

Proposed implementation verification ceiling: 30 aggregate minutes and at most two
harness-repair cycles across developer, reviewer and coordinator, starting only after
implementation authorization. Essential checks: focused lifecycle/event tests for
AC-3/5/6/7, appropriate typechecks, and a Chrome desktop/narrow smoke for placement,
wrapping, dismissal/focus, announcements, pause/expiry and reduced motion. Independently
review the stable snapshot and affected resulting tree. Use representative rapid
outcomes, not a notification-load benchmark. Safety non-regression evidence should
focus on affected routing and existing representative tests, without restarting
storage/concurrency fault injection.

The user should assess the actual prototype's placement, visual weight and motion
before analyst design review; no application manual acceptance is claimed here.
Broader browser/assistive-technology, stress and previous increment qualification
remain outside this slice. Preserve all prior failed/unverified criteria and stopped
campaigns, including Increment 007's zero remaining campaign allowance.
Stop at either ceiling or earlier when tooling dominates or value is low; report
remaining gaps, and require an explicitly authorized bounded follow-up to resume.

## Design proposals and review

- Designer: separate initial recommendation completed; no prototype or reviewed artifact yet.
  Proposed compact bottom-center treatment, 24px desktop bottom clearance and 16px
  narrow clearance plus safe area, capped at 28rem with 16px side margins. Success
  uses pale/dark green, information pale/dark blue, with text and an Outline icon.
  A close button is named “Dismiss notification”. Proposed entry is an 8px upward
  fade/slide over 180ms, exit 150ms, with reduced motion respected. These are starting
  values for the prototype, not agreed tokens or contrast evidence.
- Duration evidence: the installed Base UI toast type declarations and the
  [official Toast reference](https://base-ui.com/react/components/toast), checked
  17 November 2026, both document a 5000ms default. Five seconds is a proposal for
  DTW; this does not establish suitability for every message.
- Preparation totals: approximately eight aggregate minutes (analyst four, designer
  three, coordinator one), source/self-review only, no harness repairs or runtime checks.
- User review and approval for analyst review: pending.
- Analyst design review: not started; this draft is source/scope analysis only.
- Final contract/design agreement and implementation authorization: pending.
- Material design revisions return to the user before renewed analyst review.

## Review baseline

Source inspection baseline: `f5361d52bd6b8168f4982b6de2aec0630eb0b539`; working tree
was clean at inspection. This draft is the only analyst edit. Capture a fresh baseline
and preserve any intervening user work before implementation; reviewer snapshot is pending.
Staging, committing and pushing remain with the user.
