# Increment 016: Transient toast feedback

- Contract status: Agreed
- Delivery status: Completed — independently reviewed and user-accepted; remaining verification limits retained below
- Agreement: Initial scope/direction accepted and visual prototype authorized on 17 November 2026. V4 was reviewed by the user and explicitly approved for analyst recheck on 17 November 2026; the targeted source recheck below closes the prior design findings. The user agreed Increment 016 and V4 and authorized implementation followed by independent review on 17 November 2026, with a 15-minute aggregate verification ceiling and at most two harness repairs.
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
on 17 November 2026. The following detailed migration inventory is included in the final agreement.
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

### Persistent notification color inventory

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

## Acceptance criteria

- AC-1: Each approved completed outcome appears bottom-center above the current
  workbench, with readable wrapping and no horizontal overflow at desktop and 320 CSS px.
  The migrated confirmation no longer occupies a duplicate inline region.
- AC-2: Success and information use distinct dark status surfaces with light readable
  text. Persistent error and warning feedback use the same inverted status-color
  treatment requested after V1 review. Exact colors remain provisional at the user’s request.
  Apply this treatment to notification regions, not indiscriminately to destructive
  controls, field labels or every use of an error text token. Text and an accessible dismissal name convey meaning without relying on color.
  Theme tokens, shared Icon usage and component ownership follow presentation conventions.
- AC-3: A toast can be dismissed with pointer or keyboard. The automatic duration
  is five seconds of unpaused display, paused while hovered, keyboard-focused or the
  document is hidden. Dismissal/expiry never performs a project command or loses focus
  into a removed element. F8 reaches an active close control; dismissal returns to
  another active toast, then an available original trigger, then a stable workspace
  landmark. Exiting, hidden, disabled or inert targets are excluded. No global Escape
  handler competes with existing dialogs.
- AC-4: Entry and exit use restrained fade/slide motion; reduced-motion preference
  removes positional animation. Arrival does not move focus or interrupt typing.
  Each admitted outcome receives one polite announcement when the document is
  visible and no modal obscures it; visibility restoration releases pending
  announcements. Queued previews are not announced. No duplicate inline/toast announcements.
- AC-5: Two separate operations with identical outcome text each produce feedback.
  Rerendering, reopening a screen or replaying existing state does not replay an old
  notification. A single completed command/recovery does not generate duplicate toasts.
- AC-6: Pending, unknown, rejected and retained-but-unreadable outcomes do not become
  success toasts or lose their persistent explanations/actions. Existing command gates,
  validation, recovery, history semantics and dirty-editor helpers remain intact.
- AC-7: Rapid outcomes, project transitions and modal overlap follow the identified
  agreed design without stale cross-project feedback, obscured required actions or
  premature expiry of a notification that could not be read. Reviewed V4 policy:
  at most three visible, oldest above newest, FIFO overflow without timer until
  admission; a modal hides/pauses the stack and delays new announcements. Explicit
  project/screen navigation clears prior-context events; automatic opening after
  project creation carries only its own named confirmation. Long stacks must retain
  reachable dismissal controls in short/narrow viewports using accepted AC-8.

- AC-8: On short viewports, admit at most three toasts within half the available
  viewport height, capped at 24rem. Admit fewer when needed; FIFO waiting time does
  not consume display duration. A single oversized message appears alone with a
  keyboard-scrollable body and reachable close control, and requires manual dismissal,
  including after later viewport growth. Resizing may return later messages to the
  FIFO queue with their remaining display time preserved.
- AC-9: When it fits within the same height cap, show a 1.5rem decorative partial
  preview of the next queued message with a .5rem gap. It has no pointer target,
  focus stop, announcement or running timer until full admission. Reserve its space
  without displacing the sole full toast; omit it when an oversized message fills
  the budget. Oversized toast vertical padding is .875rem with the icon aligned
  to the first line, and the scroll-body limit accounts for that padding.

## Decisions and open questions

- Accepted scope: completed success/information outcomes become transient; progress,
  errors and actionable safety/backup feedback remain contextual.
- V2 supersedes the initial pale treatment with dark surfaces/light foregrounds for
  toast and persistent notification types. On 17 November the user found V2 easier
  to see/read and approved analyst review, while explicitly deferring color taste.
  Current color pairs are provisional; no final palette acceptance is inferred.
- Agreed timing and interaction: five seconds of unpaused display, modal and
  hidden-document pauses, three visible/FIFO overflow, F8 and safe focus return,
  and project-transition behavior as specified in AC-3/7 and the V4 design record.
  Accepted AC-8 supplies the oversized-message manual-dismissal exception.
- V4 source recheck closes the V2 findings below. The user has now agreed this contract and V4; no additional product decision is
  needed to begin implementation. Palette refinement
  remains deferred; use the identified provisional pairs until a later agreed change.
  This scope does not authorize wider validation or destructive-control redesign.
- Implementation choice: an App-owned outcome provider and private testable queue
  model. Installed Base UI toast admission/timer ownership did not fit the agreed
  FIFO and adaptive policy. Existing Base UI dialogs and shared controls remain;
  no dependency changes. The prototype remains a design artifact.

## Verification approach and limits

During draft preparation, source inspection only; no tests or browser qualification. Approximately
four analyst minutes consumed in preparation, zero harness repairs. Coordinator and
designer preparation time must be added at handoff rather than assumed zero.

Authorized implementation verification ceiling: 15 aggregate minutes and at most two
harness-repair cycles across developer, reviewer and coordinator. Allocate initially
eight minutes to developer checks, five to independent review and two to coordinator
checks or targeted rechecks. This is a ceiling, not a target; report any unmet checks
without weakening acceptance criteria. Earlier review campaigns remain stopped. Essential checks: focused lifecycle/event tests for
AC-3/5/6/7/8/9, appropriate typechecks, and a Chrome desktop/narrow smoke for placement,
wrapping, dismissal/focus, announcements, pause/expiry and reduced motion. Independently
review the stable snapshot and affected resulting tree. Use representative rapid
outcomes, not a notification-load benchmark. Safety non-regression evidence should
focus on affected routing and existing representative tests, without restarting
storage/concurrency fault injection.

The user reviewed V4 and approved analyst recheck; this is design feedback, not
application manual acceptance. No production behavior is claimed here.
Broader browser/assistive-technology, stress and previous increment qualification
remain outside this slice. Preserve all prior failed/unverified criteria and stopped
campaigns, including Increment 007's zero remaining campaign allowance.
Stop at either ceiling or earlier when tooling dominates or value is low; report
remaining gaps, and require an explicitly authorized bounded follow-up to resume.

## Design proposals and review history

- Agreed proposal: [V4 design and prototype](../project/toast-feedback-v1.md),
  retaining the original `increment-016-v1` paths. V1’s pale palette is historical.
- User approval for analyst review, 17 November 2026: “This is better in sense that
  it is easier to see and read. The colors are however not yet to my taste. We will
  improve these later. This V2 looks ready for the analyst review.”
- V4 approval for analyst recheck, 17 November 2026: “I've reviewed and am happy.
  The analyste can recheck.”
- Analyst review: V2 findings and completed V4 source recheck below; no prototype or production
  edits, runtime checks, tests or assistive-technology qualification.
- Final contract/design agreement and implementation authorization: granted on
  17 November 2026; see the implementation authorization record below.
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

**V2 disposition (superseded by the V4 recheck below):** refine the design handoff for these three findings,
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

### V4 queued-preview refinement — 17 November 2026

The user reported committing/pushing V3 and requested a glimpse of the next queued
message, plus more top space for the oversized message's information icon. The
separate designer implemented [V4](../project/toast-feedback-v1.md) at the same URL.
A noninteractive 1.5rem partial preview of the next queued message, with .5rem gap,
fits within the existing stack-height budget. It is not admitted, announced or timed
until fully displayed. Its reserved space may reduce the full-message count; it
never displaces the sole full toast. An oversized single message omits the preview
when there is no room. Oversized vertical padding is now .875rem, with .125rem
additional icon alignment. Colors and other behavior remain provisional/unchanged.

Coordinator browser viewing confirmed two full toasts and the partial third in
Five outcomes with Short-window budget on, then the increased oversized padding.
The accessible snapshot exposed only the two full messages and their close buttons.
This simulation is not a real short-screen test. Designer source/whitespace review
used approximately two minutes and coordinator viewing/checks approximately one;
three of four aggregate revision minutes used, then stopped. No application tests,
production edits or renewed analyst review. Earlier verification limits remain.
V4 awaits user artifact review before analyst recheck.

### V4 analyst recheck — 17 November 2026

**Outcome: no remaining actionable design findings in this bounded source review.**
The user reviewed V4 and explicitly authorized this recheck. The contract remains
Draft / Not started until final agreement and implementation authorization.

- **Focus/exit finding closed at source level.** `focusAfter` and F8 exclude leaving
  elements and the immediate exiting-ID set; `safeTarget` checks connection,
  visibility, disabled and inert states. Exit cleanup precedes all interaction,
  hidden-document and modal timer pauses. The reviewed correction removes the
  identified rapid-dismissal/invisible-focus path. Resize readmission also redirects
  focus from messages returned to the queue.
- **Hidden-document announcement finding closed at source level.** The visibility
  listener updates state; announcement admission checks modal, document visibility,
  full admission and exit status. Queued events retain their unannounced identities
  until eligible; the separate timer gate prevents background display-time consumption.
- **Overflow/color-boundary finding closed at design/source level.** V4 measures
  admission within the accepted half-available-height/24rem cap, limits full admission
  to three and reserves the decorative preview's 2rem only when it fits. The preview
  has `aria-hidden`, no interactive descendant and no timer/announcement admission.
  Oversized messages remain manual, expose a focusable scrolling body and account for
  the revised vertical padding. The explicit persistent-owner inventory bounds
  notification recoloring without changing destructive controls or field decoration.

The reviewed scope still preserves contextual progress, safety, recovery, validation
and backup instructions. No host/domain operation or persistence semantics are
introduced by the fixture. Repeated outcomes retain distinct event identities;
no new Undo action or notification history is proposed. The user-requested preview
is consistent with accepted adaptive admission rather than an extra active toast.

These closures establish design/source consistency only. This analyst performed no
browser interaction, test run, live screen-reader check or production validation.
Actual narrow/short viewports, resize/modal interleavings, focus/live announcements,
automatic project-opening carryover and integration with existing typed recovery
states remain implementation checks within the proposed bounded verification plan.
The existing fixture simulation and coordinator evidence retain their stated limits.
Provisional colors are usable design references, not final aesthetic acceptance.

**Ready for final agreement:** this Increment 016 draft (AC-1–AC-9 and the two owner
inventories) together with V4 at the snapshot below. The next user decision is final
contract/design agreement and authorization for separate developer implementation
followed by independent review. No further design exploration or qualification
campaign is proposed as a prerequisite.

### Review budget and evidence

Earlier preparation: approximately eight aggregate minutes, stopped. V1 prototype
checks: five of eight minutes, stopped. V2 revision/viewing: approximately two
minutes, stopped. This separately authorized analyst source review used approximately
four of five minutes, zero repairs, then stopped; no earlier campaign was reopened.
V3 checks stopped at six of six minutes; V4 checks stopped at three of four.
The separately authorized V4 analyst recheck used approximately three of four
minutes, zero repairs, then stopped. Earlier campaigns stay stopped.
The proposed 30-minute/two-repair implementation allowance remains unused and unauthorized.

## Review baseline

V2 source review baseline: clean `9087738`, before this contract edit. SHA-256:

- `prototypes/increment-016-v1/index.html`: `daa1f6b92a7486bff0bf17085d47df81a98131a762833bd8e236516cc4064eb1`
- `prototypes/increment-016-v1/main.tsx`: `6496c6fc93301224f27289df1df405b3c5f4a10c45aabbc0e65ca4147203bb3d`
- `prototypes/increment-016-v1/prototype.css`: `283d11e6aa2193bc109f32c7d0890a930bdb0d435c11e94ab21f26532ee79b36`
- `docs/project/toast-feedback-v1.md`: `bc162f845bbc2fd21640156cb8cdb92ec57f172d066ee6130e134a6dcee8a88f`

This analyst edited only this contract. Capture a fresh baseline before implementation
and an exact stable snapshot for independent implementation review. Staging, committing
and pushing remain with the user.

### V4 source recheck snapshot

Clean Git baseline before the analyst contract edit:
`ba53f298063c4f75f60c9ebf2d41446c26561b9a`. SHA-256:

- `prototypes/increment-016-v1/index.html`: `901bb8c42c6c89378981cae153153fc495b6d61fc972bd3f9d2cb6a4aa77fd35`
- `prototypes/increment-016-v1/main.tsx`: `677a722b63333948b439e4579619b44ca105f81552ecd36a86a5ccad9aa1dde5`
- `prototypes/increment-016-v1/prototype.css`: `dbe6de81968574c0bb560193a03225b02a8c90306e4f715c81fd09752394b4d0`
- `docs/project/toast-feedback-v1.md`: `9979ae5cd046e83be605933e8e535a7f31c460a33bf88a8482d2e3bcc26ed93f`

Only this contract was edited by the rechecking analyst. Subsequent approval/status
annotations do not substitute for a new check if prototype behavior changes.

## Implementation authorization — 17 November 2026

The user reported committing and pushing, agreed Increment 016 and V4, and authorized
implementation followed by review. Baseline: `b0319a7f3afc1f16c5e51bdfc25f2f7acf2d59b2`,
with a clean working tree. The new allowance is 15 aggregate verification minutes and
at most two harness repairs, superseding the unused proposed 30-minute allowance.
Production acceptance was pending at this authorization stage; the subsequent user
acceptance is recorded below. Palette refinement remains deferred.

## Implementation and independent review — 17 November 2026

Implementation is finished and independently reviewed. No actionable production-code
finding remains. At this handoff, delivery was **Partially completed** because the
bounded checks did not establish all browser acceptance behavior. The subsequent
production acceptance below closes the increment while retaining those evidence limits.

### Delivered behavior

`App/components/OutcomeFeedback` owns the shared delivery lifetime for both workbenches.
Its private queue model handles event identity, FIFO admission, remaining display time,
once-only announcement admission and oversized manual dismissal. Explicit completed
outcomes now emit from their existing source owners; progress, uncertain results,
recovery actions and backup instructions remain contextual. Scoped notification tokens
apply the provisional dark/light status pairs without recoloring ordinary field errors
or destructive buttons. No domain, persistence or dependency change was made.

The reviewer checked the 21-file source/test snapshot against baseline
`b0319a7f3afc1f16c5e51bdfc25f2f7acf2d59b2`. Its ordered SHA-256 manifest digest was
`45d38cec018c3842605e240196f86311cd1894c66e3d6bec410b12585d1949d3`.
No production or test edits followed that review. Both developer and reviewer checked
actual consumers, App ownership, private state placement, shared Icon use and semantic
tokens. Runtime geometry exceptions are explained beside their implementation.

### Evidence and limits

| Criteria and behavior | Evidence | Remaining limits |
| --- | --- | --- |
| AC-1/2: placement, wrapping and status treatment | Source inventory review; coordinator fixture showed bottom-center dark toasts and a long message at measured 320 × 360 CSS px with document width 320 | Full production operation flows and every persistent status surface were not browser-tested; palette remains provisional |
| AC-3/4: dismissal, focus, timers and announcements | Queue tests; desktop fixture F8 reached close and dismissal moved focus to the next active toast; final narrow fixture F8 reached long-message close | Actual screen-reader delivery, hidden-tab timing and reduced-motion rendering were not tested; ordinary five-second expiry and all focus fallback paths lack final browser evidence |
| AC-5/6: distinct outcomes and safe completion | Queue and representative mocked command/recovery tests; independent source review of both inventories | End-to-end retained/recovery operations were not rerun; earlier storage qualification stays stopped |
| AC-7: modal and navigation lifetime | Source/tests; fixture navigation cleared events; final Base UI modal hid the stack and closing restored it | Automatic project-creation carryover and modal timing were not exercised through the full application |
| AC-8/9: adaptive stack and queued preview | Queue tests; desktop fixture showed three full toasts and decorative fourth, excluded from AX; short fixture showed fewer full toasts; final 320 × 360 long-message fixture had scroll area and reachable close | Resize permutations, native keyboard scrolling and all queue/focus combinations were not exhaustively tested |

Developer checks passed:

```sh
npm run typecheck
npm test -- test/presentation/toast-queue.test.tsx test/presentation/workbench-coordination.test.tsx test/presentation/projects-screen.test.tsx
git diff --check
```

The focused run passed 39 tests across three files. Independent reviewer command:

```sh
npx vitest run test/presentation/toast-queue.test.tsx test/presentation/workbench-coordination.test.tsx
```

That run passed 32 tests across two files; reviewer whitespace checks also passed.
The independent review found no actionable production defect. It requested correction
of stale pending-agreement statements; the coordinator corrected active statements and
explicitly labeled preceding status handoffs as historical. No requirements were relaxed.

The developer could not access a browser; pending CLI attempts were canceled without
installing or repairing infrastructure. Coordinator browser checks used the in-app
browser and the no-storage `test/browser/increment016.html` fixture. They did not modify
retained projects and are not a separate Chrome or Firefox qualification. The earlier
desktop smoke preceded final self-review corrections; the narrow/modal smoke used the
final reviewed source. The temporary viewport override was reset.

### Budget and next action

Approximately 14 aggregate verification minutes were used: developer four, independent
reviewer five and a half, and coordinator four and a half including browser, snapshot,
document/link and whitespace checks. One browser-call correction is conservatively
counted as a harness repair; no other repair cycle. Checks stopped within the authorized
15-minute/two-repair ceiling because further coverage needs a separate useful follow-up.
Earlier verification campaigns remain stopped.

No new design decision is needed. The user can assess production integration by opening
a project, creating or renaming a group and applying a token edit: expect one bottom-center
outcome, no duplicate inline confirmation, and contextual errors/recovery actions where
needed. This checks integration and visual fit, not screen-reader or background timing.
Those missing checks remain owned by the agent in a separately authorized bounded
follow-up. At that handoff, they prevented claiming complete acceptance of all criteria. Git staging,
commit and push remain with the user.

Suggested commit: `feat: add transient outcome toasts and status notifications`.

## User acceptance — 17 November 2026

After testing the implemented workbench, the user stated: “I've tested it and I'm happy
with the result. You can record my acceptance of increment 016, keeping the remaining
verification limits documented.” Increment 016 is completed and user-accepted.

This is user-reported acceptance of the implemented result. No specific test sequence,
browser coverage or criterion-by-criterion execution is inferred. The evidence table
above remains unchanged: full production-flow coverage, background timing, reduced
motion, screen-reader delivery and the other listed runtime cases remain unverified
to the extent recorded. Acceptance does not turn these checks into passes.

The approximately 14-minute/one-repair verification record is preserved. Verification
campaigns remain stopped; this acceptance does not authorize a restart. Further agent
verification requires a separately authorized bounded follow-up. Palette refinement
remains deferred. No application code changed and no application tests ran to record
acceptance; documentation consistency, local links and whitespace were checked.
