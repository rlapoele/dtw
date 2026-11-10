# Safari driver-only diagnosis — 10 November 2026

One native driver launch completed at 22:01:06–22:01:07 UTC. No HTTP request,
WebDriver session, browser command, shared Safari intervention or setting change
was made. The raw checkpoint is [driver-diagnostic.json](driver-diagnostic.json).

## Observed native facts

- The chosen ephemeral port, 59466, was verified unused before launch by an
  exact-port numeric `lsof` query (exit 1, empty stdout/stderr).
- `/usr/bin/safaridriver -p 59466` spawned PID 41128. Its stderr remained empty.
- The original predicate, using the original `lsof` arguments and 1,000 ms
  timeout, returned exit 1 and empty stdout/stderr on both attempts. No timeout
  or hidden command exception occurred in this diagnostic.
- On the second attempt the independent numeric exact-port query found PID 41131,
  `com.apple.WebDriver.HTTPService`, UID 501, listening on both loopback addresses.
  Targeted `ps` identified PPID 1 and the Apple WebDriver HTTPService XPC executable;
  targeted `lsof` executable metadata corroborates its WebDriver framework path.
- Cleanup sent SIGTERM only to the newly spawned PID 41128. An exit event was
  observed immediately afterwards (code 0, signal null). The exact-port listener
  query then returned exit 1 with empty stdout/stderr. The listener/XPC PID itself
  was never signalled. This observes endpoint lifecycle correlation with the owned
  driver; it does not claim that the XPC process itself exited.
- All saved commands include raw stdout/stderr, exit/error/signal/timeout and
  elapsed time. There was one launch, two comparisons, and no retry launch.

## Diagnosis and proposed routine correction

The new observation demonstrates that requiring the spawned driver PID to equal
the TCP listener PID rejects this working local listener. The listener is hosted
by a distinct Apple XPC service; its PPID is not the spawned driver's PID either.
[Apple's primary documentation](https://developer.apple.com/documentation/webkit/testing-with-webdriver-in-safari.md)
describes an XPC service hosting the local server in its historical Sierra setup
section. That contextual statement suggested the diagnostic; the present process
and endpoint receipts establish the actual behavior observed here.

The earlier batch did not save native command receipts, so its exact historical
cause remains unproved. This diagnostic reproduces a concrete false-negative
ownership assumption sufficient to explain that readiness failure. It does not
establish HTTP readiness, session availability, or pending-execute preemption.

For one separately checkpointed corrected attempt, replace strict PID equality
with positive validation of the previously unused exact endpoint, one unique
same-UID Apple WebDriver HTTPService executable, live owned driver, bounded raw
command receipts and refusal on ambiguous identity. Do not rely on PPID equality
or process names alone. Retain cleanup scoped to the spawned driver and record
its observed exit plus endpoint disappearance. Obtain the required independent
preflight before any session/G-02 gate, and never invoke the old 65-case runner.

## Offline verification and snapshot

`node --check research/increment-007-safari-readiness-supervision/driver-diagnostic.mjs`
passed. `node --test research/increment-007-safari-readiness-supervision/offline.test.mjs`
passed 3/3 checks: distinct listener-field parsing, raw nonzero command evidence,
and timeout distinction. These are diagnostic-harness checks, not product tests
or an independent review. Source was unchanged between the final checks and the
single native execution. See [phase-1-manifest.json](phase-1-manifest.json).

Only new research/output directories were written. The old helper and evidence,
production code, dependencies, settings and status documents remain unchanged.
Further execution is paused at the coordinator checkpoint.
