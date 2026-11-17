# Increment 016: Transient toast feedback

- Contract status: Draft
- Delivery status: Not started
- Agreement: Initial scope/direction accepted and visual prototype authorized on 17 November 2026. V2 was approved for analyst review on 17 November 2026; that source review is recorded below. Final design/contract agreement and production implementation authorization remain pending.
- Prepared: 17 November 2026.
- References: [vision](../project/vision.md), [product concept](../project/product-concept.md), [principles](../project/principles.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md), [workflow](../workflow/agent-roles.md), [current handoff](../status/current.md).

## Outcome

Show short completed-operation feedback such as “Group created and retained.” in
bottom-center dismissible toasts, using a dark status background, light foreground,
and fade/slide motion. Free the workbench's persistent feedback area from routine
confirmations while preserving messages needed to understand or recover current state.

The accepted scope distinguishes transient confirmations from contextual state; it does not treat
all existing notice strings or status live regions as transient notifications.

## Scope and source inventory

The transient-confirmation versus persistent-actionable-feedback scope was accepted
on 17 November 2026. The following detailed migration inventory still awaits final
contract/design review.
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

### Persistent notification color inventory for final contract review

Use dedicated notification surface/foreground roles at these owners. This source
inventory bounds the requested inversion; it does not globally redefine existing
`destructive` or field-error tokens. Preserve exact messages, live regions, actions,
focus targets and operation-specific completion conditions.

| Owner (under `src/presentation/App/components/`) | Regions receiving notification treatment |
| --- | --- |
| `TokensWorkbench/TokensWorkbench.tsx` | Access/paused-editing warnings, failed-read/error feedback and persistent history/progress notices; keep associated retry/check controls together |
| `TokensWorkbench/components/RetentionRecovery.tsx` | Pending, retained-but-unreadable and unknown-result blocks with their recovery controls |
| `ProjectsWorkbench/ProjectsWorkbench.tsx` and `components/ProjectRecovery/ProjectRecovery.tsx` | Project errors, pending/unknown/read-recovery blocks and persistent backup feedback |
| `ProjectsWorkbench/components/RestoreDialog/RestoreDialog.tsx` | Pending, retained, lost-stage, unknown and error/notice feedback; retain required acknowledgment and review controls |
| `TokensWorkbench/components/AuthoringDialog/AuthoringDialog.tsx` | Read-unavailable, creation-error and submission-blocked notification blocks; preserve focus/description IDs |
| `TokensWorkbench/components/SelectionInspector/components/TokenEditor/TokenEditor.tsx` and `components/TokenEditorContent.tsx` | Read-unavailable, target-unavailable, editor-error and inspection-only notification blocks; ordinary dirty-state/help copy remains contextual text |

At these boundaries use success only for an established completed outcome, error
for an established failure, warning for restricted/uncertain states and information
for progress/instructions. Do not infer success from the presence of a retained flag
when display/read recovery is still unresolved. Bind variants to existing typed state,
not message-string matching. Field borders/labels, destructive action buttons,
structural diagnostics, exact-source output and static retention/storage disclosures
are not notification surfaces and are not recolored by this increment.

## Proposed acceptance criteria

- AC-1: Each approved completed outcome appears bottom-center above the current
  workbench, with readable wrapping and no horizontal overflow at desktop and 320 CSS px.
  The migrated confirmation no longer occupies a duplicate inline region.
- AC-2: Success and information use distinct dark status surfaces with light readable
  text. Persistent error and warning feedback use the same inverted status-color
  treatment requested after V1 review. Exact colors remain provisional at the user’s request.
  Apply this treatment to notification regions, not indiscriminately to destructive
  controls, field labels or every use of an error text token. Text and an accessible dismissal name convey meaning without relying on color.
  Theme tokens, shared Icon usage and component ownership follow presentation conventions.
- AC-3: A toast can be dismissed with pointer or keyboard. Proposed automatic duration
  is five seconds of unpaused display, paused while hovered, keyboard-focused or the
  document is hidden. Dismissal/expiry never performs a project command or loses focus
  into a removed element. F8 reaches an active close control; dismissal returns to
  another active toast, then an available original trigger, then a stable workspace
  landmark. Exiting, hidden, disabled or inert targets are excluded. No global Escape
  handler competes with existing dialogs.
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
  premature expiry of a notification that could not be read. Proposed V2 policy:
  at most three visible, oldest above newest, FIFO overflow without timer until
  admission; a modal hides/pauses the stack and delays new announcements. Explicit
  project/screen navigation clears prior-context events; automatic opening after
  project creation carries only its own named confirmation. Long stacks must retain
  reachable dismissal controls in short/narrow viewports using accepted AC-8.
  The complete contract still awaits final agreement.

- AC-8: On short viewports, admit at most three toasts within half the available
  viewport height, capped at 24rem. Admit fewer when needed; FIFO waiting time does
  not consume display duration. A single oversized message appears alone with a
  scrollable body and reachable close control, and requires manual dismissal.

## Decisions and open questions

- Accepted scope: completed success/information outcomes become transient; progress,
  errors and actionable safety/backup feedback remain contextual.
- V2 supersedes the initial pale treatment with dark surfaces/light foregrounds for
  toast and persistent notification types. On 17 November the user found V2 easier
  to see/read and approved analyst review, while explicitly deferring color taste.
  Current color pairs are provisional; no final palette acceptance is inferred.
- Proposed timing and interaction: five seconds of unpaused display, modal and
  hidden-document pauses, three visible/FIFO overflow, F8 and safe focus return,
  and project-transition behavior as specified in AC-3/7 and the V3 design record.
  Accepted AC-8 supplies the oversized-message manual-dismissal exception.
- Before final agreement: recheck V3 against the V2 findings after user artifact
  review. The persistent-region inventory is now explicit and overflow behavior
  accepted; these do not authorize wider validation or destructive-control redesign.
- Technology remains unselected. Reusing installed Base UI toast capability is a
  candidate; do not copy the demonstration timer/focus engine as qualified production code.

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

- Identified proposal: [V2 design and prototype](../project/toast-feedback-v1.md),
  retaining the original `increment-016-v1` paths. V1’s pale palette is historical.
- User approval for analyst review, 17 November 2026: “This is better in sense that
  it is easier to see and read. The colors are however not yet to my taste. We will
  improve these later. This V2 looks ready for the analyst review.”
- Analyst review: completed source/contract review below; no prototype or production
  edits, runtime checks, tests or assistive-technology qualification.
- Final contract/design agreement and implementation authorization: pending.
- Material design revisions return to the user before renewed analyst review.

### V2 analyst findings — 17 November 2026

The proposed status boundary fits the accepted local-first workbench and preserves
command/retention authority. Prototype fixtures do not call the host. Dark success,
information, error and warning pairs match the requested inversion; palette aesthetics
are explicitly deferred, not a blocking finding. Source supports the proposed FIFO,
distinct IDs, hover/focus/modal/document-hidden timer pauses, modal suppression,
reduced-motion CSS and responsive width. Source review does not prove live-region
delivery, contrast in every state or real application navigation.

1. **Required focus correction (AC-3/4).** In
   [prototype main.tsx lines 11–14](../../prototypes/increment-016-v1/main.tsx),
   dismissal and F8 select close controls without excluding exiting toasts. Dismissing
   two notifications rapidly can return focus to the first notification during its
   150ms exit. Focus then pauses its removal even though its animation becomes
   invisible. Production must exclude exiting targets and keep exit cleanup independent
   of hover/focus pauses. Connected-only trigger checks must also exclude hidden,
   disabled or inert triggers. This is a prototype behavior mismatch, not a request
   to change the intended safe-focus design.
2. **Required announcement clarification (AC-4/7).** Line 13 suppresses new
   announcements during a modal but not while the document is hidden, and marks
   events announced immediately. An outcome arriving in a background document can
   therefore consume its announcement before return. Require admission/announcement
   only when the notification is actually eligible to be perceived, with visibility
   restoration triggering pending announcements. Existing source is not evidence of
   that behavior; real screen-reader delivery remains unverified.
3. **Required boundary clarification (AC-1/2/7).** Three wrapped messages have no
   maximum stack height or overflow handling in the prototype stylesheet; sufficiently
   long messages can put older controls above a short viewport. Specify accessible
   height handling before implementation, without dropping confirmations silently.
   Also inventory the existing persistent error/warning notification regions covered
   by the color inversion so shared destructive styles are not changed indiscriminately.

The project-creation automatic-open exception is explicitly specified but deliberately
not demonstrated by the fixture; keep it as an implementation acceptance check. The
unbounded session FIFO is a documented proposal for ordinary command rates, not a
performance guarantee. No new domain semantics, notification persistence or new Undo
action is needed. Cosmetic palette refinement can remain deferred.

**Recommended disposition:** refine the design handoff for these three findings,
then seek final agreement to the identified contract/design and implementation
scope. None is resolved merely by recording it here. A material new height or
interaction design must be surfaced to the user under the normal workflow.

### Designer follow-up — overflow accepted, 17 November 2026

For the height finding, the designer recommends at most three visible toasts in
no more than half the available viewport height, capped at 24rem. Admit fewer when
necessary; queued events retain their unstarted timers. If one message cannot fit,
show it alone with a scrollable message body, an always-visible close button and
manual dismissal rather than automatic expiry. Existing bottom/side clearances stay.

Tradeoff: unusually long messages on short screens require dismissal and delay queued
confirmations, but remain readable without covering most of the workspace. This
changes stacking and adds an exception to five-second expiry. The user accepted
this overflow behavior on 17 November 2026 and reported committing/pushing the
review record. The revised prototype may now demonstrate it; implementation and
independent verification of the finding remain pending. The focus and announcement corrections preserve intended behavior;
no user decision about their technical causes is needed. Designer follow-up reasoning
took under one minute, with no file edits, tests or renewed qualification.

### V3 prototype handoff — 17 November 2026

The designer applied the accepted overflow rule and corrected exit cleanup/focus
selection and hidden-document announcement handling in the isolated prototype.
The explicit persistent-notification owner inventory above completes the proposed
color boundary. These are corrections awaiting analyst recheck, not independent
closure of the V2 findings. V3 is available at the existing URL and awaits user
artifact review before renewed analyst review. Palette preference remains deferred.

Coordinator browser checks used the Short-window budget simulation: the oversized
message remained beyond five seconds, its body had 800px scroll content in a 142px
viewport, the close control remained in view, and dismissal returned focus to its
trigger. A five-outcome burst admitted two short toasts in the constrained budget;
two rapid dismissals advanced to queued outcomes without a stuck exiting control.
Source review confirms visibility restoration is observed for announcements; real
background/screen-reader delivery was not exercised. The simulation is not a real
short-viewport or narrow-browser test. Modal overlap, resize interleavings and full
keyboard/screen-reader qualification remain untested in this revision.

Designer source/whitespace review used approximately three minutes; coordinator
browser/source review approximately three, completing the six-minute revision
ceiling, with no harness repair campaign. Checks stopped. Earlier budgets and stop
decisions remain unchanged; no application tests or production edits occurred.

### Review budget and evidence

Earlier preparation: approximately eight aggregate minutes, stopped. V1 prototype
checks: five of eight minutes, stopped. V2 revision/viewing: approximately two
minutes, stopped. This separately authorized analyst source review used approximately
four of five minutes, zero repairs, then stopped; no earlier campaign was reopened.
The proposed 30-minute implementation allowance remains unused and unauthorized.

## Review baseline

V2 source review baseline: clean `9087738`, before this contract edit. SHA-256:

- `prototypes/increment-016-v1/index.html`: `daa1f6b92a7486bff0bf17085d47df81a98131a762833bd8e236516cc4064eb1`
- `prototypes/increment-016-v1/main.tsx`: `6496c6fc93301224f27289df1df405b3c5f4a10c45aabbc0e65ca4147203bb3d`
- `prototypes/increment-016-v1/prototype.css`: `283d11e6aa2193bc109f32c7d0890a930bdb0d435c11e94ab21f26532ee79b36`
- `docs/project/toast-feedback-v1.md`: `bc162f845bbc2fd21640156cb8cdb92ec57f172d066ee6130e134a6dcee8a88f`

This analyst edited only this contract. Capture a fresh baseline before implementation
and an exact stable snapshot for independent implementation review. Staging, committing
and pushing remain with the user.
