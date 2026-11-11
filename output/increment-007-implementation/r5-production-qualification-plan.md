# Finite R5 production qualification inventory — preparation only

No live resource/performance batch has been authorized by this preparation note.
Await coordinator release after independent source checks and CPU tests finish.
Source/build: `s4-r5-before-browser-manifest.json` (141 files), SHA
`771f2f1bf841dffb2c9888ac6dc512ce12e584e4e498e4ab5413232110f8ab4f`;
actual production origin `http://127.0.0.1:4334/`.

Run separate selected cases in this order, stopping the whole affected batch on
its first over-budget task, failing assertion, watchdog stop or inconclusive
observation. No automatic retries or escalation to a larger case afterward.

1. **100-token ordinary app**: real staged backup/restore; first open/command,
   independently reported cold sample; one warm-up plus 20 measured UI color
   Apply commands, 20 complete backup encodes/downloads, and 20 staged decodes
   canceled without writes; one warm-up plus 20 catalogue departures/reopens.
   Command p95 ≤250 ms; catalogue/codec ≤2,000 ms; ordinary renderer tasks ≤100 ms.
2. **1,000-token ordinary app**: same finite distributions, command p95 ≤1,000 ms,
   catalogue/codec ≤2,000 ms; ordinary renderer tasks ≤100 ms.
3. **Maximum entity intersection**: one admitted 10,000-token / 2,000-group
   snapshot. One color is editable; the rest are supported unassigned tokens,
   avoiding semantic-value cap overflow. Restore, full All content reachability,
   selected inspection, backup and reopen. Mechanism/boundary observations, not
   a p95 claim without 20 measurements. Ordinary renderer tasks ≤100 ms.
4. **Catalogue byte intersection**: exactly 25 independently staged/restored
   snapshots of exactly 8,388,608 UTF-8 snapshot bytes, then cold catalogue plus
   one warm-up and 20 measured catalogue reads/reopens. Each fill uses group
   descriptions of at most 65,536 decoded units and multi-byte Unicode; token
   descriptions remain ≤1,024 units. Fixture aggregate strings/values and counts
   checked before submission, then real application admission must succeed.
   No replacement or 26th record is silently introduced. Every setup restore is
   separately timed and supervised. This 200 MiB defensive catalogue has no
   2,000 ms typical/large SLA under G-04: record latency, enforce the external
   30-second per-operation stop, exactness and ordinary tasks ≤100 ms.
5. **Exact-source framing boundaries**: group sources with serialized lengths
   65,535, 65,536 and 65,537 UTF-16 units, including a supplementary Unicode
   character. One ordinary cold/open and one warm-up +20 measured opens each;
   exact source text equality and native in-tab selection/Find checks. Ordinary
   ≤65,536-unit source tasks ≤100 ms; qualifying >65,536 source tasks ≤250 ms and
   ≤5,000 ms/action. No large-name/list/setup work receives a source exemption.

Instrumentation observes actual renderer PerformanceObserver long-task entries
and production Worker message dispatch/response durations. Production bundle bytes
are unchanged. UI end-to-end timing is reported separately from worker transport
and includes rendering; no standalone fixture construction loop is substituted
for actual application performance. Cold/warm-up/measured samples stay distinct.

Each setup operation and each measured stress operation gets its own external-to-
Chrome Node-controller 30-second timer. Twenty measurements do not share a single
30-second aggregate timer. The controller records the active case, issued time,
Chrome owned PID and explicit arm/disarm/expiry receipts; expiry first writes a
partial checkpoint, then kills only its own isolated Chrome PID. Ready/before/after
manifest and build hash checks fence accidental drift. A short own-controller
supervision self-test is required before release; a watchdog must be exercised,
not merely present in source. No shared browser or app process is terminated.

Evidence is checkpointed after each operation; JSON logs and any traces are gzip
compressed losslessly before handoff. An exact fixture SHA and compact admission
facts identify every large fixture without dumping 200 MiB into normal logs.
Only user-owned disposable browser profiles and loopback origins are touched.
Native clipboard writes, OS file-picker interaction, actual page zoom and AT are
not included in this automated scope; manual acceptance remains pending.
