# Increment 007 — ordinary description rendering isolation

**R2 executed and independently reviewed — 10 November 2026; stopped, inconclusive.**
Baseline: `2287060b82de9d59c7e644774d6e936376f6a0e1`. Recommend one finite,
isolated **layout-context diagnostic**, retaining current wrapping. This is neither
a proposed product repair nor renewed E-4 qualification. Contract remains Draft.

After committing this plan as `ea97bfc`, the user authorized execution with “Go
ahead.” This permits only the finite Chrome diagnostic batch and its independent
review below. It does not authorize production/prototype edits, Safari probes,
clipboard access or automatic follow-up experiments. Execution source and evidence
belong in new `research/increment-007-ordinary-rendering-isolation/` and
`output/increment-007-ordinary-rendering-isolation/` directories; prior artifacts
remain frozen. Staging, commits and pushes remain with the user.

## Evidence and remaining question

The [frozen E-4 report](../../output/increment-007-e4-qualification/report.md) and
[independent review](../../output/increment-007-e4-qualification/independent-review.md)
establish the first fixture's ordinary load failure (65,535 UTF-16 units of
complete pretty-serialized token source, not raw description length):
**RunTask 1,797.093 ms**, including **Layout 1,794.751 ms**, wall 1,806 ms, before
source opening. Nested costs are not added. The saved result has zero worker source
encodings/frames/active units. Boundary-sizing serialization occurs inside that load;
it must not be confused with requested full-source preparation.

Bounded offline inspection of [the raw trace](../../output/increment-007-e4-qualification/029-65535-ordinary-load-trace.json)
finds that Layout on renderer PID 24415/thread 330473 reports 120 dirty objects of
129, `partialLayout:false`, and a single `#document` root. It identifies no costly
description node or individual line-breaking operation. GC events also occur in
that interval; their presence establishes neither causation nor an additive cost.
This inspection reads saved data; it is no new timing measurement.

Current [TokenList](../../src/presentation/features/workbench/components/TokenList.tsx)
supplies the complete description to two responsive DOM variants, with
`line-clamp-2 whitespace-pre-wrap wrap-anywhere`; CSS selects their visibility.
The [inspector](../../src/presentation/features/workbench/components/Editor.tsx)
uses the full description with pre-wrap/anywhere and no clamp. Static code supports
an intact-text layout risk, not a claim that the hidden variant performs layout or
that wrapping, clamping, grid intrinsic sizing or a browser algorithm caused the
failure. The frozen App starts with no selected token; its runner selects only
after load. Complete-inspector risk therefore needs separate treatment.

**Question:** can that exact description incur over-budget layout in a definite-width
copy of its existing text surface, outside application/grid/flex ancestry? This
separates a sufficient text-surface trigger from cost requiring additional context;
it cannot identify every contributing ancestor or engine operation.

The [user disposition](007-description-wrapping-and-source-selection-design-assessment.md#user-disposition-after-v5-review--10-november-2026)
rejects `break-all`. Keep normal word boundaries/anywhere wrapping, exact DOM text,
authored whitespace, two-line row previews, complete inspector, list membership,
values, controls, authored limits and the ordinary **100 ms** gate. The
[agreed E policy](007-exceptional-detail-policy-and-performance-proposal.md) grants
no exception to descriptions. The [native-selection result](../../output/increment-007-small-source-selection/report.md)
is separate: two small technical positives endorse no supported gesture.

## One bounded diagnostic proposal

After explicit execution authorization, a fresh developer creates an isolated
research harness with **one manipulation: remove surrounding layout ancestry**.
For each surface, first load only a small description in the unchanged application
shell, record its used text width, computed font/line-height/letter-spacing,
white-space, overflow-wrap, word-break, clamp/display and relevant box metrics.
Compare a separate definite-width leaf specimen with that small control visually
and by computed styles. Reproduce inherited selectors explicitly in the specimen;
retain the preview's actual text wrapper/clamp structure and inspector paragraph.
Diagnostic pixel widths are recorded fixture geometry, not new product tokens.
An unmatched control is inconclusive and stops execution.

Then, in a fresh owned page, mount the exact failed description into that specimen.
For preview probes, keep both full responsive description DOM strings, with the
inactive variant still `display:none`; the inspector specimen retains its paragraph.
Do not test a shortened string. Preserve current rendering rules,
font resources, padding and measured width. No grid/flex application ancestry,
containment trick, CSS alternative, inserted break character or new viewer is added.
This deliberate reduction is diagnostic only: it cannot qualify a reduced list.

Initial batch: **Chrome only**, maximum three first-risk cases, in order: wide preview at the
original 1600×1100 viewport; compact preview at a recorded narrow pane width;
complete inspector at its recorded used width. Each has one preceding small
control: at most three controls and three risky mounts initially. No unchanged
long application-load replay, larger fixture or automatic variant follows.

Use the frozen attempt-1 fixture source at its recorded baseline, adapting imports
only in a new isolated copy. Verify its canonical digest
`1b4b5241cf1af157ac990eb238c210366180d95076845d897ff2afe706beca8e`
and 65,535-unit pretty-source digest
`739717a5620a061f514a96948c80ae45044d37789d822b85e56d500522d442e6`
against the saved record; independently verify raw description UTF-16 length/digest
and direct DOM equality, without normalization.
Pin current component/CSS and frozen fixture hashes separately. Historical evidence
is immutable; the presentation refactor does not relocate its original replay inputs.

## Instrumentation, safety and stopping

Trace from mount activation through complete DOM publication and first painted
layout (double-rAF witness); retain preconstruction timing separately rather than
hiding it as an application load pass. Record exact browser/OS, viewport/DPR/zoom,
fonts, geometry, marks, target frame→PID/main-thread ownership, all intersecting
whole tasks and nested Layout/Paint. Reuse reviewed trace ownership controls,
including known-failure and foreign-renderer rejection. Maximum whole target task
is **100 ms**; missing ownership/whole-task coverage is inconclusive.

Start Chrome only in an owned disposable profile with independent 30-second
watchdog. Any genuine over-ceiling task, control mismatch, invalid instrumentation
or watchdog expiry stops the **batch**; preserve partial evidence. No repetitions
merely reconfirm failure. No distributions or qualification claim follows first-risk
observations. Safari long probes remain blocked until safe ownership and
same-pending-command external supervision are separately proven. A later separately
authorized Safari batch may use the same three-case ceiling; no automatic execution
or support waiver follows. Record Safari unrun at this initial handoff. Never operate/kill shared Safari or alter trust settings. Safari activation
repair and defensive-supervisor setup remain separate tasks. No clipboard authority.

## Handoff and next user decision

A slow isolated leaf shows current text rendering can exceed budget without the
removed ancestry; it does not name a CSS culprit. Fast leaves show only that this
reduction differs from the frozen failure: ancestry, sequencing and environment
remain possible contributors. Neither outcome fixes or qualifies application
load/selection. Return once with raw evidence, source/build manifest, controls,
limitations and fresh reviewer assessment; no automatic follow-up experiments.

**Decision now:** authorize this finite diagnostic developer/reviewer handoff,
retaining current wrapping, or leave the ordinary gate blocked. Any resulting
visible layout/interaction proposal needs designer/user review before analyst
review and separate implementation authorization. Full E-4 and integrated Stage B
remain later gates, not prerequisite application tests before implementation exists.

Applied debugging-and-error-recovery for localization. Checks here: current/frozen
source, bounded raw-trace inspection, prose, relative links and whitespace only.
Only this document changed; no browser, tests/build, timing replay, setup or commit.
Suggested human-owned commit: `docs: plan ordinary description layout isolation`.

## Executed result and disposition — 10 November 2026

The [developer report](../../output/increment-007-ordinary-rendering-isolation/report.md),
[frozen manifest](../../output/increment-007-ordinary-rendering-isolation/manifest.json)
and [independent evidence review](../../output/increment-007-ordinary-rendering-isolation/independent-review.md)
record a stopped first wide small control. Its wide outer span reports `min-height:
auto` in the application and `0px` in the reduced context; all other recorded
computed fields, used box metrics and small text match. The strict equivalence
prerequisite failed, so the entire batch stopped before any risky mount. The
6.972 ms covered whole task is not a matched-control pass or a long-text result.

Source inspection also found an unexecuted harness defect: copying the small
computed height as an inline value would freeze the wide nodes at 16.5px during
long-text mounting, instead of preserving natural preview/inspector expansion.
That must be corrected before any future execution; waiving the `min-height`
comparison alone would not produce a faithful diagnostic. Neither issue establishes
the cause of the original application failure. No source repair or rerun occurred.

The reviewer found no actionable evidence/report correction. It independently
checked the 112 manifest entries, 34 pre-execution entries, archived source/build
fidelity, exact fixture digests and raw target-renderer trace coverage, and passed
seven offline trace tests plus isolated typecheck. No reviewer browser run occurred.
The source/build bytes were archived before the live control. Production, current
wrapping, prior artifacts, dependencies and the original failed result are unchanged.

The diagnostic question remains unanswered. Next requires an explicit disposition
for correcting the diagnostic control/sizing semantics and separately authorizing
any fresh browser batch. No automatic retry, new CSS variant, source-viewer change,
Safari probe, performance waiver or production implementation follows. Staging,
commits and pushes remain with the user.

Suggested focused commit: `research: record stopped ordinary description isolation control`.

## Corrected sizing and fresh batch authorization — 10 November 2026

After committing the stopped batch as `9975731`, the user authorized correcting
the diagnostic's sizing semantics and running a fresh bounded batch with the same
stop rules and independent review. Work is isolated in new
`research/increment-007-ordinary-rendering-isolation-r2/` and
`output/increment-007-ordinary-rendering-isolation-r2/` directories. The first
batch/source/evidence remain frozen. This is not authority to change production,
current wrapping, authored limits, performance budgets or browser support.

The correction must preserve the surface's actual CSS/markup and authored sizing
behavior, including automatic height and existing clamp behavior. Pin only the
measured width; do not apply small computed pixel heights as constraints to later
text. Preserve inherited typography explicitly where needed without replacing
authored structural rules with serialized resolved values. Add focused regression
checks for the fixed-height defect before execution. Within each of the existing
three small controls, modest text-growth assertions may verify natural height and
clamp behavior; these are small fidelity checks, not extra long/risky cases.

Do not simply disable the `min-height` comparator. Record authored sizing rules,
layout context, resolved values and used boxes separately. The sole expected
wide-wrapper `auto`/`0px` resolution difference may be treated as a consequence of
removing grid ancestry only if preserved automatic sizing, matched used geometry
and natural-growth/clamp checks establish the control's intended equivalence.
Any unexplained difference remains an inconclusive stop. Keep all raw values.
The [CSS Sizing Level 3 draft's automatic minimum-size definition](https://www.w3.org/TR/css-sizing-3/#valdef-width-auto),
checked 10 November 2026, explains the context-sensitive zero resolved value; this
is platform rationale, not proof that a particular harness or browser case passes.

A fresh reviewer checks the corrected source/sizing safeguards before live work,
then independently reviews the resulting frozen evidence. Archive actual served
build/source before execution. The original Chrome-only ordering and ceilings
remain: at most three small controls and three first-risk mounts; stop the entire
batch at the first control mismatch, inconclusive instrumentation, task above
100 ms or independent 30-second watchdog expiry. No replay of the unchanged long
application failure, automatic variants, repetitions, Safari/clipboard work or
further batch follows. Both the correction and this fresh batch are already
authorized; routine work within this scope needs no repeated user approval.

## R2 result and disposition — 10 November 2026

The [R2 report](../../output/increment-007-ordinary-rendering-isolation-r2/report.md),
[preflight review](../../output/increment-007-ordinary-rendering-isolation-r2/preflight-review.md),
[final manifest](../../output/increment-007-ordinary-rendering-isolation-r2/manifest.json)
and [independent evidence review](../../output/increment-007-ordinary-rendering-isolation-r2/independent-review.md)
identify the corrected source and the incomplete fresh batch. The sizing correction
passed independent preflight: 14 focused offline tests, isolated typecheck/build,
archive fidelity and preservation checks. This established source-level safeguards,
not a live-control pass.

Only the first small control was attempted. A temporary-profile removal error
(`ENOTEMPTY`) escaped cleanup before the runner saved accumulated control results.
Original/leaf growth measurements, comparison result, runtime environment and
watchdog arm receipts were lost from process memory. Raw traces, screenshots and
the original specimen survive, but they cannot reconstruct those missing values.
The raw in-progress stop state is preserved, with no fabricated final control record.
No long-text mount or subsequent case ran; no repair or retry followed.

Independent trace inspection recovered target-owned maximum whole tasks of 4.008 ms
for the application control and 8.643 ms for the isolated control. These do not
establish control equivalence or answer the long-text question. The reviewer
verified all 126 final and 106 pre-execution entries and found no actionable
evidence/report correction. It confirmed a required future runner fix: checkpoint
measurements before fallible cleanup, protect final evidence saving and record
cleanup errors separately. The preflight review missed this defect. Any future
correction needs a failure-injection regression proving that a cleanup exception
cannot discard control results or permit the next case to continue.

The executor's scoped cleanup checks report the owned processes/listener absent
and the exact disposable profile removed. This is attributed incident evidence,
not an independent reviewer process-table check. Reviewed source/build bytes remain
unchanged, and the first batch, production, current wrapping and prior evidence
are preserved. The original ordinary failure and all other gates remain open.

This fresh batch is finished with an inconclusive outcome. Further source correction
or browser execution is not automatic; no additional batch, Safari/clipboard work,
performance waiver or production implementation is authorized by this record.
Staging, commits and pushes remain with the user.

Suggested focused commit: `research: correct ordinary isolation sizing and record stopped r2 control`.
