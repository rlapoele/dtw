# Increment 012 — analyst review of Undo/Redo V1

**15 November 2026. Separate analyst design/contract review; no implementation.**

## Verdict and authority

V1 is consistent with the proposed session-only outcome and restrained application
boundaries. It is ready for a decision discussion, **not yet a final agreed
implementation contract**. Resolve R1–R3 below and explicitly accept or amend the
listed policy bundle before final agreement. User approval was for analyst review
with desktop/tablet icons plus text and mobile icon-only; it did not authorize
implementation or select the other policies. No application defect is asserted:
Undo/Redo does not exist yet.

## Identified review snapshot

Actual local HEAD: `552f6e9219b2c03bc15c0075a7c99eb6fce15938`, the documentation
commit following `6aa6943`. Its source implementation is unchanged from that
source baseline. The reviewed working tree includes the coordinator's two
amendments to the contract and design notes. User reports commit/push; this review
identifies local evidence and makes no remote-state claim.

SHA-256 of exact reviewed inputs (paths relative to repository root):

| Input | SHA-256 |
| --- | --- |
| `docs/increments/012-session-undo-redo.md` | `b1650cc2b4948e37a84027b696fcf4268a4e79dc73610fb37558e6ec34c2ba25` |
| `docs/project/workbench-layout/undo-redo-v1.md` | `b7a65c5501f03af402e3b9650610244222775a550e0773c8cd4faced147fe97c` |
| `docs/project/workbench-layout/undo-redo-v1.svg` | `1c31556f0b3507d523899b3f9134100b7105f263a6610139121d772ce6023cb2` |
| `docs/project/workbench-layout/undo-redo-states-v1.svg` | `fe75dfac7bd9dee6b05cd7ffefb8620faf109e46a28ef717ddd1db2303bccd52` |
| `docs/project/workbench-layout/undo-redo-component-map-v1.md` | `a4ed03db9cfeba087949d780738497b3e562abb764a0585c52e158011cebebb9` |

Authority/evidence: AGENTS.md; workflow analyst brief and stopping rules; current
status; vision/product concept/principles; architecture; presentation conventions;
012 and the four V1 artifacts; relevant open questions; focused current application,
receipt decoder, host validation and Workbench command/layout source. SVG source
was inspected statically; the analyst did not rerender or run the application.

## Actionable findings

### R1 — demonstrated acceptance-coverage mismatch: responsive control amendment

**Before final agreement; AC-11.** The design amendment at
[design notes lines 11–20](../project/workbench-layout/undo-redo-v1.md#user-approved-review-amendment--15-november-2026)
records icons plus text on desktop/tablet and icon-only on mobile. AC-11 currently
requires names/reasons and widths but never requires this presentation. An
implementation with text-only controls could satisfy that criterion while missing
the user's explicit refinement. Original SVGs still depict text-only buttons;
this is disclosed and superseded evidence, not proof of the amended appearance.

Recommended AC-11 addition: “Desktop/tablet show shared Heroicons Outline icons
plus visible Undo/Redo text; mobile shows icon-only Undo/Redo with the same
accessible action names and nearby next-action/unavailable explanations. Use the
owned Icon and Button, decorative icons hidden from assistive technology, and at
least 44 × 44 CSS px mobile targets.” Preserve the existing wrapping and visibility
requirements. Update the component map's control row to reference this amendment.
No new design direction is required for the user-requested icons themselves.

### R2 — unresolved requirement: map mobile/tablet to a definite viewport rule

**Before final agreement; AC-11.** “Exact breakpoint follows the existing shell
modes” leaves the mobile/tablet words implicit. Current
`src/presentation/Workbench/hooks/useWorkbenchLayout.ts:3–4,14` provides wide
≥1120, compact 880–1119 and narrow <880; it does not define devices. For example,
a 768 CSS px tablet is narrow. Two implementations could hide or retain its text
while claiming the same amendment.

Recommendation for explicit agreement: separate control-label presentation from
pane mode, for example standard **640 CSS px**: below 640 icon-only; at or above
640 icons plus text. This keeps text on a 768 CSS px tablet in single-pane mode.
The threshold is a proposal for user agreement, independent of hardware or user
agent; do not change shell layout thresholds to solve this. Record the chosen
mapping in AC-11/design notes.
An amended static example can clarify the chosen appearance; original sheets
remain historical and cannot establish runtime fit.

### R3 — unresolved integrity/compatibility contract: receipts for removed creations

**Before implementation; AC-1/2/4/5/8/9.** The draft correctly flags the closed
receipt vocabulary and versioning. One further concrete constraint needs an
explicit disposition: `src/application/retention/record.ts:54–61` rejects a
receipt whose token/group result ID is absent from the retained snapshot. Undo
Create removes exactly that entity. Merely adding `undo`/`redo` to the enum while
retaining the forward command's entity receipt therefore makes its newly retained
record unreadable. This is a demonstrated current boundary constraint, not a
defect in an unimplemented feature.

Recommendation: define distinct `undo`/`redo` receipt operations targeting the
**project** that remains present; keep the reversed entity/step identity in the
session history and bounded delivery projection. Match issue/check/consume/fence
identity to the reversal receipt, without reusing `restoreProject`. Specify that
retained acknowledgment finalizes history once before coherent readback, while
read retry performs no write. Worker replacement clears history even when receipt
recovery establishes the original write outcome.

Also select an explicit retained-record compatibility policy. A concrete candidate
is a new internal record version for history receipts, new-reader support for
existing v1 records, and old readers treating newer records as unavailable without
overwriting them; authoredVersion and backup envelope stay unchanged. This
consciously limits downgrade/old-tab editing of a record last written by the new
application. If that is unacceptable, agree another safe compatibility scheme
before implementation. Do not pretend that an unchanged record version makes a
new closed-vocabulary receipt readable by old code. Add focused later checks for
Undo Create readback/reopen and old/new-reader disposition to the verification plan.

## Coverage and consistency assessment

| Criteria | Static assessment |
| --- | --- |
| AC-1–3 | All four exposed operations covered, authored exactness and stable IDs explicit; atomic command/no-op/branch rules agree. No token rename or general Delete is invented. Exact no-op result/revision handling still needs an API definition. |
| AC-4–6 | Reject/pending/unknown/retained-unreadable states and once-only acknowledgment are coherent. Existing command owner remains sole mutation gate; R3 must be resolved. UI recovery is not an alternate writer. |
| AC-7/12 | Explicit discard guard, Keep editing/Escape restoration and captured-step revalidation agree. Modal forms close through existing protection; native inputs/composition/dialogs/handled events stay local. Shift+Z/no Ctrl+Y and repeat exclusion remain proposals for agreement. |
| AC-8/9 | Exact revision/incarnation invalidation, conditional unchanged-baseline resume, worker/departure expiry and retained-data preservation agree. Application history must be explicitly cleared on successful leave/open-session replacement even if App's worker survives; renderer unmount alone cannot clear a worker-owned stack. |
| AC-10 | Design supplies the detail requested by the draft: preserve surviving IDs; nearest valid ancestor/All tokens fallback; return narrow missing-target inspection to browse; passive Redo; visible focus fallback. Copy these specifics into the agreed criterion or reference this identified design section. Runtime behavior remains unverified. |
| AC-11 | Persistent next-action descriptions, recovery outside hidden panes and accessible names are coherent. Resolve R1/R2; SVGs are superseded for icon presentation. |
| AC-13 | Count/byte accounting, shared states, oldest eviction and oversized accepted-edit notice are explicit proposals. The proposed bound limits stored serialized payload, not peak heap, serialization cost or admission-maximum performance. |

The component map respects delivery → application → domain direction: controlled
header, one guarded Workbench intent path, one command/recovery owner, one editor,
and authoritative application history inside worker lifetime. No renderer snapshot
assignment, second writer, new store, generic bus or durable journal is proposed.
Known diagnostic-baseline restoration is clearly separated from new-edit
validation; neither the artwork nor this review selects it. Preserve only the
exact previously admitted target, never arbitrary supplied invalid data.

## Concrete decisions for final agreement

Recommend bringing one resulting contract/design bundle to the user after the
coordinator records dispositions, retaining these choices as proposals until then:

1. Four-operation coverage, one exact changing acknowledged command per step;
   no-op does not advance history or destroy Redo. Define a no-write unchanged
   result/revision path rather than treating no-op as a new retained edit.
2. Bounded application-owned snapshots; proposed 50 steps/32 MiB shared serialized
   payload; oldest eviction and explicit oversize history clearing. This is the
   smallest source-supported mechanism, not a verified memory/performance claim.
3. Discard-and-traverse guard, local native/modal keyboard behavior, Cmd/Ctrl+Z and
   Shift+Z, no Ctrl+Y in V1; captured step cannot silently retarget.
4. Conservative external-revision/incarnation invalidation, session expiry and
   passive Redo with the identified selection/focus rules.
5. Exact restoration of a known admitted diagnostic baseline under narrow history
   validation, or explicit rejected Undo instead. Recommendation remains the
   former; new-edit validation is unchanged.
6. R1 responsive control acceptance wording, R2 explicit viewport mapping, and R3
   receipt target/vocabulary and old/new-record compatibility policy.

Optional: amend the static sheets to show the already requested icons and chosen
viewport mapping before final agreement. This is useful visual communication,
not a new runtime qualification allowance. Any material layout/interaction change
returns to the user before renewed analyst review. No unrelated redesign or
future hardening is recommended.

## Effort, assumptions and stopping

Approximately **5.5 analyst minutes** of focused source/static review, including
report consistency checks; **zero harness repairs, tests, builds, browser checks
or application qualification**. Stopped with decision-ready findings within the
analyst's six-minute share of the new eight-minute aggregate review phase.
Coordinator has its separate two-minute ceiling; it owns aggregate accounting.
Earlier preparation remains stopped at approximately 13/15 minutes. Earlier
007/009/010/011 stopping decisions and acceptance gaps are unchanged.

Assumptions: current source is the capability baseline, proposed behavior is not
delivered, review amendment outranks old text-only artwork, and an application
history coordinator remains host-independent. Limits: this is consistency and
source-boundary analysis, not usability, keyboard/focus, native typing-undo,
retention/concurrency or performance proof. Later authorized implementation needs
its own bounded essential checks and independent reviewer. This report makes no
final agreement or implementation authorization claim.

Only this report was written by the analyst. Staging, committing and pushing stay
with the user. Suggested commit: `docs: review undo redo V1 contract and decisions`.
