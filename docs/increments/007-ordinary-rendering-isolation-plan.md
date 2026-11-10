# Increment 007 — ordinary description rendering isolation

**Analyst proposal for user review — 10 November 2026. Not agreed or executed.**
Baseline: `2287060b82de9d59c7e644774d6e936376f6a0e1`. Recommend one finite,
isolated **layout-context diagnostic**, retaining current wrapping. This is neither
a proposed product repair nor renewed E-4 qualification. Contract remains Draft.

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
