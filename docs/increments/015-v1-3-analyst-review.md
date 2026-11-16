# Increment 015 — V1.3 analyst review

**16 November 2026 · Source consistency review completed.** The user explicitly
approved prototype V1.3 for analyst review. This reviews the identified
[design proposal](../project/workbench-polish-proposal-v1.md) and actual
[prototype source](../../prototypes/increment-015-v1/main.tsx),
[styles](../../prototypes/increment-015-v1/prototype.css) and
[Icon](../../prototypes/increment-015-v1/Icon.tsx) against the
[resulting draft contract](015-workbench-browse-and-inspector-polish.md), current
production sources and owning architecture/presentation/color/history agreements.
It is not implementation review, usability qualification or final authorization.

Baseline: `07c73dff160809f485a70a8a0bbd9d78a3210acf`, initially clean Git tree.
Only this review and the assigned contract were edited. No production/prototype,
index or dependency changes; no browser, build or application test run.

## Verdict

The V1.3 direction is consistent with the token-workbench scope and architecture.
No required material visual revision or remaining product decision was identified.
The draft now states the concrete design choices and separates mock interactions
from production behavior that must be preserved. It is ready to present for final
contract/design agreement and explicit implementation authorization.

## Criterion mapping

| Criteria | Source consistency result | Required implementation evidence |
| --- | --- | --- |
| AC-1–2, history | Named controls, zero/retained badges, native titles, hidden descriptions and removed strip are represented in prototype `main.tsx:21`; badge geometry is in `prototype.css:6`. Counts and blocked states are intentional mocks. | Application-owned counts across traversal/branch/prune/clear; existing notices, draft/modal/native-shortcut and recovery guards. |
| AC-3–4, row values | `main.tsx:6,25` represents HEX/alpha/unavailable cases and concise coordinate summaries. Exact examples and display-only policy are documented. Rounding examples are fixed data, not an implementation. | Exact decimal nearest/ties-away rounding, negative-zero/tiny/`none` cases; retained authored strings unchanged and full exact inspection. |
| AC-5–7, workspace | Generic copy, magnifier and secondary/primary action pair appear in `main.tsx:24–25`. Grid/non-wrapping pair and named small-screen icons are in `prototype.css:8,12`. | Existing matching, parent context, naming/validation, blocked writes and draft guard; cancellation focus and successful-created destination. |
| AC-8–12, inspector | Sticky type/title/comparison/control, Current/New labels and Current-only resolved view are in `main.tsx:29–39`; matching 2.125rem specimens, padding, desktop rail/rotation and reduced motion in `prototype.css:8–13`. Group/empty/unavailable scenarios are represented. | Actual editable/read-only/unavailable recovery states, accessible names/controls, keyboard/tab behavior, focus return and unobscured actions. |
| AC-13–15, preservation/sticky | Independent inspector scroll and sticky opaque heading are represented in `main.tsx:28–30`, `prototype.css:9`. Narrow Back replaces desktop collapse in `main.tsx:27`, `prototype.css:11`. | Preserve mounted editor session, refs, selection and responsive transitions; sticky height must not obscure focused content when title/root size changes. |
| AC-16, controls | 2.25rem standard controls and slider targets are in `prototype.css:4,8–12,16`; content rows remain natural. Current user direction is 36px at all widths. | Reconcile shared primitives/custom consumers across workbench, Projects and forms; preserve multiline/content geometry, scaling, native semantics and class precedence. |

## Findings and dispositions

1. **Contract omission, resolved — control sizing.** The original draft had a
   narrative 36px note without an observable criterion or shared-consumer scope.
   AC-16 now covers standard buttons/inputs/selects/tabs and slider target heights,
   at every viewport; content rows and multiline views retain natural geometry.
   Existing shared sources still contain differing heights and 44px mobile minima
   (`src/presentation/ui/button.tsx:13–45`, `input.tsx:14`, `select.tsx:11`). Their
   adoption affects current Projects/form consumers through the same primitives,
   not a separate Projects redesign. On final agreement, implementation must
   reconcile current presentation-convention statements about the old 44px minimum
   (`docs/project/presentation-conventions.md:224–226`), preserving historical evidence.
2. **Contract mismatch, resolved — narrow inspector.** The old AC-10/15 could imply
   a collapse toggle at every width. Approved V1.3 deliberately hides that desktop
   control below 880px and uses Back. Those criteria now distinguish desktop
   toggle/3rem rail from narrow Back while preserving sticky identity/comparison.
   No prototype change is needed.
3. **Contract mismatch, resolved — successful creation focus.** The old AC-7 could
   require trigger focus after successful creation. Production currently moves to
   the created token/group and schedules workspace focus
   (`TokensWorkbench.tsx:134–142`), whereas prototype dialog trigger return
   (`main.tsx:46`) is illustrative. The contract now requires initiating-action
   restoration on cancellation and preserves the existing successful-create
   destination/focus policy. Group parent follows browse context, not the inspected
   token's parent, with existing editable parent selection/validation intact.
4. **Integration requirement, retained — history safeguards.** Prototype dirty state
   disables traversal; production routes dirty history through its existing
   departure guard (`hooks/useHistoryInteraction.ts:28–58`). That mock does not
   select a replacement guard policy. AC-2/13 retain the existing behavior. True
   counts must originate from the session history's `steps`/`cursor`, not the mock
   counters or presence of next-action labels (`src/application/retention/history.ts:5,43–60`).
5. **Implementation check, retained — sticky focus.** The prototype uses fixed
   `scroll-padding-top:9rem`/panel scroll margin (`prototype.css:9`). This is not
   evidence that every long admitted title/enlarged root is covered. AC-15 requires
   keeping focus visible against the actual heading geometry. Production may use a
   small owned measurement/appropriate scroll composition; it must preserve state
   lifetime and independent pane scrolling. This does not require a new visual
   design or authorize truncating identity/source.

## Architecture and presentation assessment

No canonical schema, persistence, color conversion or token-type decision is
introduced. Rounded rows and HEX are delivery representations, distinct from
exact authored values and inspector input. The proposed ties-away four-decimal
row rule is local; existing ties-even byte-entry/conversion policies remain intact.
Application history owns counts and candidates across the existing typed worker
boundary. Reuse existing group operations/dialog and retained command safeguards.

The isolated prototype shares production colors/fonts and Heroicons, with its own
illustrative Icon and geometry. Those prototype conveniences are not a direction
to duplicate shared primitives, import Heroicons directly at production call sites,
copy raw CSS wholesale or change Button's additive class contract. Actual affected
owners/consumers must be reviewed by developer and independent reviewer under AC-14.
No speculative abstraction or dependency is needed by the design.

## Limits and next handoff

This review inspected source and reconciled documentation; it did not independently
repeat coordinator browser measurements or establish production behavior. Mock
color conversion, fixed exact-source examples, native dialog, simplified tabs,
synthetic history and incomplete reference/Projects behavior are identified limits,
not defects in this bounded design artifact.

Prototype verification remains approximately **9/10 aggregate minutes, zero repairs**
as reported by the coordinator; no allowance was restarted or browser work added.
The contract proposes a separate **30 aggregate minutes/two repair cycles** for
implementation/review, to be assessed before that phase. Earlier qualification
stopping decisions and acceptance gaps remain unchanged.

Present V1.3 plus the reconciled AC-1–16 contract for final agreement and explicit
implementation authorization. No material design revision needs another prototype
round. Final agreement must not be inferred from this review or from approval for
analyst review.

Suggested commit: `docs: review workbench polish V1.3 contract`
