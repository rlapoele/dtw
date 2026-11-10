# Safari readiness and supervision investigation

Phase 1 is a single driver-only diagnostic. It never calls HTTP or creates a
WebDriver session. It compares the original PID-filtered listener predicate with
an exact-port numeric query, preserves bounded raw command receipts and targeted
listener metadata, and sends SIGTERM only to its own newly spawned driver.

Offline checks:

```sh
node --check research/increment-007-safari-readiness-supervision/driver-diagnostic.mjs
node --test research/increment-007-safari-readiness-supervision/offline.test.mjs
```

The single authorized phase-1 execution is complete. Do not rerun automatically.
See [the phase-1 report](../../output/increment-007-safari-readiness-supervision/phase-1-report.md).
No session/G-02 probe or storage case is included in this diagnostic.
