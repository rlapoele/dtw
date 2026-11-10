# Independent review — incomplete stopped R2 control

10 November 2026. Baseline `99757311a4182ee1260433c8e00833d90ecf0516`.
Final manifest SHA-256
`d5da8c022df6ac6e6952fb18e152d08eaee56d66759d6560ea3ab97d45cff8cc`
(126 entries).

**No actionable evidence/report correction found. Accept this as an incomplete,
correctly stopped diagnostic record. The harness requires an evidence-persistence
fix before any future execution.** The live control equivalence outcome is unknown;
this is not an observed CSS mismatch, matched-control pass or long-text result.
The original application failure remains unresolved. No browser run, retry,
clipboard operation, source repair, staging, commit or push occurred in this review.

## Expectations and source readiness finding

The plan requires automatic sizing, original clamp/markup and exact text in matched
original/isolated small controls, backed by raw baseline and modest-growth records.
Target-owned whole tasks must cover activation through DOM publication and the
double-rAF witness under the unchanged 100 ms limit. A mismatch, inconclusive
instrumentation or watchdog expiry stops the entire bounded batch. Preserving
partial evidence does not permit reconstructing missing control measurements.
These expectations were established before reviewing the execution report/evidence.

**Required before a separately authorized future run — durable results must survive
cleanup failure.** `research/increment-007-ordinary-rendering-isolation-r2/run.mjs:94–100`
performs cleanup inside `finally`, including unguarded recursive profile removal
at line 99, before saving the accumulated result. The retained `ENOTEMPTY` incident
therefore bypasses both final result persistence and completed/disposition-state
writing. Traces/crops survive because they were written earlier; growth records,
raw comparator results and environment/arming metadata do not. This is a concrete
harness defect, independently confirmed from source and remaining artifacts, and
accurately disclosed in the report. The earlier static preflight did not catch it.

A future correction should checkpoint accumulated measurements before fallible
cleanup and preserve a final record even if a cleanup step fails, recording cleanup
failures separately and retaining a fail-closed stop. Do not repair or replay this
stopped batch. No new CSS finding follows from the lost result.

## Independently verified surviving evidence

- All 126 final-manifest entries and all 106 pre-execution entries match byte counts
  and SHA-256. The pre-execution manifest still hashes to
  `569bc49d09165d05e4977c48d0500ec7d9c20298f6ba14d8a785995fc21de313`.
  Source, source archives, served-build bytes and the frozen preflight review are
  unchanged from preflight. Its independent 14-test/typecheck/build findings remain
  applicable; no unnecessary test or browser repetition was performed.
- All 111 original-manifest inputs other than the authorized plan amendment still
  match. Prior R1 research/output directories have no tracked baseline diff.
- Directly inspected both raw traces, deriving each target frame from trace metadata
  and checking its renderer/main-thread ownership. Independently filtered all
  intersecting complete target-main-thread events; both extracts exactly match
  their saved target-event files. Recomputed scoped verdicts agree with the report
  and offline summary. Each interval has exactly ten ordered same-owned marks.

| Interval | Frame → PID / main TID | Whole-task records / complete events | Maximum RunTask | Nested Layout / Paint |
| --- | --- | --- | --- | --- |
| Original small App | `75191D350AF0AFE661005CA838E62927` → 36014 / 612288 | 48 / 123 | 4.008 ms | 0.230 / 0.113 ms |
| Small isolated leaf | `1EA6B9E141424485093AEE4399CDB334` → 36019 / 612408 | 55 / 187 | 8.643 ms | 3.271 / 0.056 ms |

No measured event exceeds 100 ms in those covered intervals. Nested costs are not
added. These control intervals include measurement/cascade overhead; they do not
qualify unmarked setup, the application load, control equivalence or long rendering.
The marks witness execution of small-text replacement/measurement stages and final
restoration, without preserving the measurements returned from those stages.

The original `wide-spec.json` retains both responsive surfaces and three flattened
node records, complete small strings, authored-default sizing evidence, cascade,
ancestors and original used boxes. Its active width is 284 CSS px, height 16.5px;
typography is 11px/16.5px with the recorded Inter/system stack. Both saved crops show
the same small text and single-line bounds, with different surrounding backgrounds.
I inspected these images offline. Neither crops nor original baseline supply the
missing leaf baseline, one-line/multiline geometry, comparator or explained-pair
result. No live natural-growth/clamp equivalence result can be independently checked.

## Stopping, cleanup attribution and limits

`state.json` has zero completed actions and the original `control-wide` in-progress
stop. No final control record or risk-case record exists. The frozen runner checks
that stop before browser/server creation and requires finite action order. The
retained source, trace names, files and incident are consistent with one wide small
control attempt and no risky mount or later case. No long DOM equality/preparation
or performance result is claimed. The offline fixture identities checked in
preflight remain pinned and unchanged.

The trace command-line metadata independently identifies the disposable profile
named in the incident. Raw trace environment metadata agrees with the report's
Chrome major 157, macOS 27.2.0/arm64, Mac15,6 and Apple M3 Pro renderer. Runtime
viewport/DPR/scale/font-check receipts and controller wall/arming receipts were
lost; requested viewport settings in source do not replace those receipts.

The separate watchdog's PID/profile validation and acknowledged arming order remain
source-level observations. There is no saved expiry file; actual expiry behavior
was not exercised independently. The incident attributes recovery cleanup to scoped
process/port checks and exact-profile removal after runner exit. Those checks were
not independently observed by this reviewer and their terminal output is not saved
as separate raw evidence. This review therefore attributes completed cleanup to the
incident account, without claiming an independent live process-table verification.

Only this new review file was written. No Safari, native selection/copy, clipboard,
AT, real zoom, alternate CSS, prototype/production changes or application E-4 /
integrated Increment 007 qualification is covered. The diagnostic question remains
unanswered. This review requests no additional execution; future correction/batch
requires the user's next disposition.

Suggested human-owned commit:
`research: correct ordinary isolation sizing and record stopped r2 control`.
