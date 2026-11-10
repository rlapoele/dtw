# R2 ordinary-description isolation — stopped with incomplete control evidence

10 November 2026. Baseline `99757311a4182ee1260433c8e00833d90ecf0516`.
**Inconclusive: only the first wide small control ran. No long description mounted.**
The batch ended after a cleanup failure prevented saving its complete control record.
No retry, compact/inspector control, risk case or follow-up experiment was run.
The diagnostic question remains unanswered; application E-4 remains failed.

## Corrected source and reviewed prerequisite

The [independent preflight](preflight-review.md) reviewed the corrected source/build
before live execution against [pre-execution manifest](pre-execution-manifest.json)
SHA-256 `569bc49d09165d05e4977c48d0500ec7d9c20298f6ba14d8a785995fc21de313`.
All 106 entries were rechecked unchanged immediately before the single live command.
[Execution source](execution-source/specimen.ts) and [actual served build archive](served-build/index.html)
were saved before that command. No source/build changes occurred after preflight.

The correction preserves original classes, both full responsive DOM descriptions,
wide wrapper/inner clamp and inspector paragraph. It emits inherited text styles
only, reproduces responsive visibility with authored `none`/`block`/`-webkit-box`,
and pins only the measured width of an ordinary block. Inspector's authored maximum
width is captured from the original CSS rule. Computed pixel height/min/max sizing
and computed legacy display are not cloned. The 14 focused tests include a fixed
small-height mutant that fails modest natural-growth safeguards, responsive clamp
checks and strict rejection of unsupported sizing changes. Typecheck/build passed;
source/cached-dependency checks and the separate review are offline evidence.

The comparator retains raw values. Only the exact wide-outer `min-height` and
horizontal-tb `min-block-size` `auto`→`0px` pair can be explained under preserved
automatic authoring, grid→block context and matched used geometry. Baseline/one-line/
three-line stages must match and separately prove natural growth and clamp behavior
in original and leaf. This is a source-level safeguard, **not a live pass**: its
complete runtime evidence was not saved in this batch.

## Executed case and evidence loss

The command was `node research/increment-007-ordinary-rendering-isolation-r2/run.mjs control-wide`.
The unchanged App received only the small fixture. Original and fresh leaf traces,
original [wide-spec](wide-spec.json), target-event extracts and paired screenshots
were saved. Crops show the same small text and 284px-wide single-line surface, with
ancestry/background differences visible. Crops cannot establish growth equivalence.

During final cleanup, recursive removal of the owned profile failed with `ENOTEMPTY`
on `Default/Cache`. The runner saved its accumulated result only after this removal;
that ordering lost the in-memory control record when cleanup threw. This is a
harness evidence-persistence defect. [Incident record](execution-incident.txt)
preserves the exact terminal error, exit and recovery actions.

No `control-wide.json` exists. Original/leaf one-line and three-line geometry/style
records, leaf baseline computed/cascade evidence, comparator/explained-pair outcome,
`environment()` values, arm acknowledgement receipts and controller wall times were
not durably saved. Their results are unknown from the remaining artifacts. Saved
marks establish the growth substeps executed, but not their measured geometry.
The original spec preserves its baseline raw styles/cascade/ancestry/used boxes;
it does not supply the missing leaf/growth comparisons. No control equivalence,
natural-height or clamp runtime pass is claimed, and no style mismatch is invented.

The persisted [state](state.json) remains the original `in-progress` stop with no
completed cases. It blocks every subsequent runner invocation. This retained raw
state is not relabeled as a completed control. The operational disposition is an
inconclusive stopped batch. No source correction or replay was performed afterward.

## Surviving trace evidence

[Offline extraction](offline-trace-summary.json) reads the already saved raw traces;
it is no browser measurement or replay. Both intervals have ten same-owned ordered
marks: activation, baseline measurement, one-line DOM/double-rAF/measurement,
three-line DOM/double-rAF/measurement, restored small DOM and final double-rAF.
All intersecting complete target events match their saved target-event files.

| Small-control interval | Target frame → renderer / main thread | Whole tasks / complete events | Maximum whole RunTask | Nested Layout / Paint |
| --- | --- | --- | --- | --- |
| [Original App](control-wide-original-trace.json) | `75191D350AF0AFE661005CA838E62927` → 36014 / 612288 | 48 / 123 | 4.008 ms | 0.230 / 0.113 ms |
| [Isolated leaf](control-wide-leaf-trace.json) | `1EA6B9E141424485093AEE4399CDB334` → 36019 / 612408 | 55 / 187 | 8.643 ms | 3.271 / 0.056 ms |

No event above 100ms was found in these covered intervals. Nested costs are not
added. Control intervals contain CSSOM/cascade/geometry auditing overhead as well
as small text replacement/layout. These are covered small-control timings, not
long-text cost or a matched-control performance qualification. Initial small App
loading and unmarked setup are not claimed qualified by these intervals.

Raw trace metadata establishes Chrome major 157 (UA redacts patch), macOS 27.2.0
arm64, `Mac15,6` and an Apple M3 Pro renderer. The initial spec records the inherited
Inter/system font stack, 11px text and 16.5px line height. Runner source requests a
1600×1100 viewport; the runtime viewport/DPR/scale/font-check record was lost.
No independently verified actual raster font face, native zoom or controller wall
time is claimed. Exact profile/command is retained in trace metadata.

## Exactness, safety, checks and limits

[Offline fixture verification](fixture-offline.json) matches the frozen attempt-1:
canonical SHA-256 `1b4b5241cf1af157ac990eb238c210366180d95076845d897ff2afe706beca8e`;
complete pretty token 65,535 UTF-16 units, SHA-256
`739717a5620a061f514a96948c80ae45044d37789d822b85e56d500522d442e6`;
raw description 65,004 units, SHA-256
`e1d984995d9313a85b2dd7db37d2498cbabc8c9d35baec4d36e5a67173b82316`.
This is offline identity, not long-description browser equality. No risk preparation
or long DOM mount executed, so long exactness, construction timings and layout cost
remain unmeasured. The wide risk, compact control/risk and inspector control/risk
all remain unrun. No distributions or p95 are computed.

The reviewed runner uses one native owned Chrome process/profile and independent
30-second PID/profile-verified watchdog. Awaited arming precedes setup and traced
commands; source/trace execution path supports that ordering, but the live arm
receipts were lost. No expiry artifact exists; watchdog expiry itself was not
independently exercised. After the runner exited, scoped process checks found no
owned Chrome/runner/watchdog. Only the exact disposable profile was removed with
bounded filesystem retries; a second process/port check found no owned process or
listener at 127.0.0.1:55207. Cleanup is now complete. Shared sessions were untouched.

Verification: [14/14 offline tests](offline-tests.txt), isolated [typecheck](typecheck.txt)
and [Vite build](build.txt) passed before preflight; independent review reran them.
No dependencies were installed. Root production/tests/config, first-batch source/
output and prior prototypes/artifacts remain unchanged; root dist was not a target.
Only new R2 research/output directories were written by this developer, apart from
the coordinator's separate plan amendment. No Git mutation occurred.

Safari, native selection/copy/clipboard, Find, AT, real zoom, alternate CSS, production
changes and full E-4/Increment 007 qualification remain outside this evidence.
No automatic fix, rerun or next batch follows. Final evidence awaits the independent
reviewer's check of this frozen incomplete result.

Suggested human-owned commit:
`research: correct ordinary isolation sizing and record stopped r2 control`.
