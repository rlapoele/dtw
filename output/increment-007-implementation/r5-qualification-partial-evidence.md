# R5 actual production qualification — stopped at observed failure

**Not qualified complete.** Source/build remain the frozen reviewed R5 identified
in `s4-r5-before-browser-manifest.json`, SHA-256
`771f2f1bf841dffb2c9888ac6dc512ce12e584e4e498e4ab5413232110f8ab4f`.
All 141 source and production-build hashes matched again after the failed batch.
Developer executed native Chrome 157.0.8103.50 in separate disposable owned profiles.
No source edits, shared browser interaction, clipboard writes or deployment.

## 100-token finite case

`../playwright/increment-007-implementation/qualification-ordinary100-2026-11-11T00-17-17.077Z/evidence.json.gz`
contains the complete lossless operation/observer/watchdog evidence: 107 operations,
one warm-up plus 20 measured commands, complete backup downloads, staged decode /
cancel, catalogue departure and project reopen. UI end-to-end p95 in milliseconds:
command **201.56**, encode/download **82.81**, stage/cancel **85.04**, catalogue
**75.86**. Corresponding worker transport/processing p95: command **21.8**, backup
**8.1**, stageBackup **6.3**, catalogue **3.6**. UI timing includes resulting paint;
worker timing is separate and does not represent total user latency.

No main-renderer LongTask entries above the 50 ms API threshold were observed;
observer support/instrumentation and actual worker calls were checked. At this initial run the separate 75 ms positive control had not yet run. Later
authorized diagnostics recorded that control successfully, as detailed below. Cold
startup and initial inspection are recorded; a separately identified first Apply
after persisted-project app/worker restart remains pending. The first authoring
command was the warm-up and was not relabeled as an independent cold sample.

## 1,000-token finite case

`../playwright/increment-007-implementation/qualification-ordinary1000-2026-11-11T00-18-59.005Z/evidence.json.gz`
contains **failed** partial evidence after 53 operations. The batch stopped on
`measured:command:9`: actual renderer tasks included **108, 107, 118, 117, 117 and
120 ms**, exceeding the ordinary 100 ms gate. The same action took **2,650.82 ms**
end to end; command worker observation was **252 ms**, project reopen **252.8 ms**,
and ten row responses ranged approximately **49–121 ms**. No full 20-command p95
is claimed. Fixture: 1,000 literal-color tokens, 301,860 UTF-8 snapshot bytes,
195,831 aggregate string units, 21,006 semantic values, zero token-description units.
Actual application restore admitted it before measurements.

There were no page errors or watchdog expiries. The owned browser was closed after
the failure; the whole affected batch stopped without a retry or a larger case.
A failure screenshot, UI snapshot, exact executed runner and fixture/watchdog
modules are preserved beside the gzip evidence. Every operation had a separate
30-second own-process watchdog with arm/disarm receipts. The external-watchdog
mechanism self-test separately proved checkpoint-before-kill, owned-child SIGKILL,
post-expiry refusal, normal disarm and a 30,000 ms production default.

## Current disposition

No production performance fix follows from the contaminated earlier timings.
Two separately authorized diagnostic commands/reopens on unchanged R5 demonstrated
that broad automation queries materially increased the observed renderer cost.
The native 75 ms observer control now passes. The independently audited single
reopen route completed in 301.90 ms, with a 40.70 ms maximum traced main task.
These are attribution diagnostics, not complete 20-sample qualification.

The independently cleared ordinary-only runner
`073fc23026cf3f16aa345a9d905ba3edc801b6c821b8a5e49ec49f6668277c3d`
now completed its finite 1,000-token series and separate 100-token cold supplement.
The native positive control passed in both profiles. The current pending work is
defensive 10,000-token / 2,000-group and 25×8 MiB catalogue qualification,
source/native access, and the other agreed Chrome/manual gates. The defensive
200 MiB catalogue has no 2,000 ms SLA under G-04; latency is recorded under its
30-second operation stop, ordinary 100 ms renderer-task and exactness requirements.
No failed or absent sample is upgraded to passing. No application code was changed
for unproven performance attribution.

## Single authorized diagnostic and attribution limit

A separately authorized **one-command** traced diagnostic on the same frozen R5
is preserved in
`../playwright/increment-007-implementation/qualification-diagnostic-one-command-ordinary1000-2026-11-11T00-21-46.578Z/`.
It is a diagnostic with tracing/profiling overhead, not a replacement qualification
run. That command reported 1,808.72 ms UI latency, 257.8 ms command-worker latency
and no LongTask observer entries. Its trace nevertheless includes renderer RunTask
work up to 383.63 ms. CPU sampling assigns 82 hit-count samples to production assets
and 1,180 to empty/injected script URLs; the dominant named functions are Playwright
`getTextAlternativeInternal`, `visit` and `getCSSContent`. There are 1,006 Layout
entries, maximum 1.18 ms, consistent with accessible-name/style selector traversal.

The earlier failed measurements remain failed. This new evidence limits their
attribution: unscoped `getByRole('button', name: ...)` searches traverse the 1,000
row buttons during timed actions and can add substantial automation work. A
specific application rendering fix is not established by this trace alone. Before
modifying production source for that failure, qualify the identical observer with
its requested isolated positive control and use bounded inspector-scoped control
queries for a separately identified diagnostic. No such additional browser run or
application edit followed automatically. All larger cases remain unrun.

## Corrected native control, command and independently audited reopen

- `qualification-scoped-command-control-ordinary1000-2026-11-11T00-24-10.460Z/`:
  cached inspector-native controls gave a 386.89 ms command; native temporary-button
  control produced a 75 ms LongTask, then was removed and buffers cleared. Trace
  main RunTask maximum 18.151 ms and Layout maximum 0.705 ms. Diagnostic only.
- `qualification-scoped-ordinary1000-2026-11-11T00-25-54.180Z/`: the next finite
  distribution attempt stopped after 62 operations at `measured:reopen:10`
  (103/102 ms tasks). It still contained a global loading-text regex wait, so its
  failure remains preserved with automation attribution unresolved by that run.
  No complete p95 is claimed from its 11 measured commands.
- `qualification-audited-one-reopen-ordinary1000-2026-11-11T00-34-04.381Z/`:
  the independently cleared exact one-reopen derivative
  `c0f579f8cd42b55237beebc167c03cc399452de382e014af2402371aaf20209d`
  uses direct loading/readiness probes, positive enabled-create/row-count checks,
  direct Red inspection, `observer.takeRecords()` and renderer start/end timestamps.
  The 75 ms native control was observed; the measured reopen had no LongTasks above
  the 50 ms API threshold, completed in 301.90 ms and traced a maximum main task of
  40.700 ms (Layout maximum 32.755 ms). Exactly 1,000 rows, all ten row responses
  and current Red=0.2 were verified. No source/build drift or page error occurred.

Each directory is under `../playwright/increment-007-implementation/` relative to
this evidence location's parent. Exact executed runners/modules and trace/CPU/data
are preserved losslessly gzip-compressed. The old failed samples were not rewritten.
No larger resource/source case followed these diagnostics automatically.

## Independently cleared ordinary-only finite qualification

The exact cleared runner `r5-ordinary-reviewed-timing.mjs`, SHA
`073fc23026cf3f16aa345a9d905ba3edc801b6c821b8a5e49ec49f6668277c3d`,
ran only the released ordinary cases. It positively checks all expected rows and
enabled controls, actual fresh retained receipt/inspection/current value, staged
preview identity/count, complete downloaded backup identity/count/current Red,
all observed tasks and document clock origins. It does not execute dormant resource
or source branches.

| Case | Result | UI end-to-end milliseconds | Worker p95 milliseconds |
| --- | --- | --- | --- |
| 1,000 tokens, one warm-up + 20 measured | Pass, 110 observed operations | command p95 298.68; encode/download 100.60; stage/cancel 157.67; catalogue 79.98 | command 85.4; backup 34.5; stageBackup 44.1; catalogue 22.5 |
| Separate cold first Apply after persisted-project app/worker restart, 1,000 tokens | Pass | 286.30 | Recorded separately in raw evidence |
| Separate cold first Apply after persisted-project app/worker restart, 100 tokens | Pass, 5 observed operations | 86.39 | Recorded separately in raw evidence |

Both native 75 ms positive controls produced 75 ms LongTask entries before the
qualification samples, then their buttons/observer buffers were cleared. No
qualification sample produced a main LongTask above the API's 50 ms threshold.
There were no page errors, watchdog expiries or source/build hash mismatches.
Twenty-one ordinary-1000 backup receipts include independently downloaded file
SHA, identity/count and current-value checks. All full raw measurements, per-operation
30-second supervisor receipts and executed runner/helper copies are gzip preserved:

- `../playwright/increment-007-implementation/qualification-ordinary-reviewed-ordinary1000-2026-11-11T00-39-28.103Z/`
- `../playwright/increment-007-implementation/qualification-ordinary-reviewed-ordinary100-2026-11-11T00-40-08.613Z/`

These scoped ordinary outcomes do not qualify the remaining maximum/resource,
source access, deployment-origin or manual acceptance gates. Earlier failed and
contaminated samples remain preserved with their attribution limits.

## Genuine maximum All content failure and narrow R6 correction

The independently cleared boundary runner
`ecb5d5125bd552c6a1f401d0beddd9f944c522bb3afaf5e92fb3f014e685479b`
ran the first released maximum case on R5, then stopped the inventory:
`../playwright/increment-007-implementation/qualification-boundary-reviewed-maximum-2026-11-11T00-45-22.597Z/`.
The fixture's 10,000 tokens and 2,000 groups were admitted; initial complete loading
finished in 5,144.13 ms with a maximum 61 ms LongTask. This defensive case has no
2,000 ms SLA. The subsequent cached native All content click, with O(1) membership
readiness and no global text/name poll, produced a **223 ms** ordinary renderer task
and 253.07 ms action duration. That is a genuine 100 ms gate failure; no worker call
occurred during the action. No page error/watchdog expiry or source/build drift.
The 25×8 MiB catalogue and three source cases were not started afterward.

The coordinator authorized a narrow application fix for this observed synchronous
creation of 12,000 buttons. R6 stages 100 native buttons per animation frame, retains
previous memoized blocks, preserves the complete flat DOM/order/exact kind-scoped
identities, and cancels old-revision callbacks. Loading/ready feedback is explicit.
Four added regressions cover complete membership order/count, bounded initial DOM,
opaque/empty identities and stale-callback cancellation. **1,031 tests / 45 files,
four typechecks, production build and whitespace checks pass.**

R6 is frozen for independent review by `s4-r6-before-review-manifest.json`, 144
source files, SHA `1980ae8614277ffd0f87661b206acbde8aaea9a7807c2605849b7811fa6c09b4`.
Its exact four-file delta from R5 is `s4-r6-against-r5.diff`. Before editing, all 141
R5 source files were hash verified and archived as `s4-r5-reviewed-source.tar.gz`,
SHA `87b6c5eda9cd471052f2517e9f45210a047622e909b1d573ebe16adba841430f`.
No post-fix browser qualification has run at this handoff. The prepared R6 boundary
runner preserves the approved logic and changes only the snapshot identity,
production origin and evidence labels; review/release is still required.

## R6 review correction and bounded mounted R7 regression

Independent source review found that a same-revision fresh context DTO could
rebuild R6's block arrays and restart reveal progress. The coordinator authorized
a bounded mounted structural regression and minimal correction, without resource
qualification. All 144 R6 source files were archived before editing:
`s4-r6-reviewed-source.tar.gz`, SHA
`c4df4a0b9edf2bc11fe96f6edc367e612f3f3ec77247743c719acb3710df522c`.

The same 500-token native Chrome regression first failed on frozen R6:
`../playwright/increment-007-implementation/r6-same-revision-red-2026-11-11T00-56-03.540Z/`.
After controlled delivery of the real production focus/resume handler, the retained
revision stayed identical but membership dropped from 501 children to 201; the
later button was detached/recreated and lost focus. The failed result is preserved.

R7 initializes its membership block plan once per coherent project/revision keyed
instance. Its delegated selection callback remains current. The exact same mounted
regression then passed:
`../playwright/increment-007-implementation/r7-same-revision-green-2026-11-11T00-57-06.002Z/`.
Same-revision refresh retained all 501 children, the exact later DOM button and its
focus. A real color Apply advanced the retained revision, replaced the membership
instance, began with 101 children and completed all 500 token buttons again.
This is structural/lifecycle coverage, not a p95 or resource-performance result.

R7 is frozen by `s4-r7-before-review-manifest.json`, 144 source files, SHA
`42f0e3c7e7cc53de36219f6b7b49be8d86c3ba11d4d1aae3b6c61a6311763df5`.
The minimal two-file delta is `s4-r7-against-r6.diff`. All 1,031 tests / 45 files,
four strict typechecks, production build and whitespace checks pass. Production
build is `/private/tmp/dtw007-production-r7` on loopback port 4336. The worker/CSS
bundles are unchanged from R5; only the UI bundle changed. Independent recheck and
release precede any R7 resource qualification; none has run at this handoff.
