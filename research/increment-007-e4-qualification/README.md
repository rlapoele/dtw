# Increment 007 bounded E-4 qualification

Isolated research only, baseline `d4b02c7`. User-authorized bounded E-4 execution;
not Increment 007 implementation or Stage B acceptance. Preserve current list and
complete inspector. The result is **incomplete / stopped on an ordinary-work failure**.
See [report](../../output/increment-007-e4-qualification/report.md).

App.tsx and Editor.tsx are byte-identical V4 copies. Other current components,
operations, domain, controls, theme and styles are imported directly. Only local
ExactSource replaces the authored disclosure. No root dependency/install changes.

The worker creates the same synthetic canonical snapshot independently of the
renderer. No whole authored row/project crosses worker messaging. This is deliberately
not a complete worker-owned read-projection implementation: the actual unmodified App
still owns its normal full session snapshot and synchronous domain reads. Fixture
construction/load/list mounting is measured as ordinary work, never hidden setup.
The boundary fixtures size their synthetic description using JSON.stringify during
fixture creation; that sizing work is included in ordinary load. Do not interpret
worker source-encoding counters as proof that fixture sizing performed no encoding.

The source worker performs actual application readProject, encodes the applied token
only on open, returns true pretty UTF-16 count and digest, then pull-frames the entire
source within 32,768 whole-wire UTF-8 bytes and 8,192 source units. Metadata has numeric
source-context handles; no arbitrarily long authored identity is duplicated in headers.
Live worker/fixture epoch/revision/selection/request and result handle fence publication.
This single-worker read harness does not qualify worker replacement, mutations,
transaction contention, retained receipts or all Increment 007 projections.

Commands from repository root, existing dependencies only:

```sh
node --test research/increment-007-e4-qualification/transport.test.mjs research/increment-007-e4-qualification/trace.test.mjs
./node_modules/.bin/tsc -p research/increment-007-e4-qualification/tsconfig.json
./node_modules/.bin/vite build --config research/increment-007-e4-qualification/vite.config.ts
```

Safe browser reproductions start their own loopback server, disposable native Chrome
profile and browser, then clean up. They need desktop/local-network permission:

```sh
node research/increment-007-e4-qualification/run.mjs --small-only
node research/increment-007-e4-qualification/run.mjs --ui-only
```

These overwrite their named new evidence files; review frozen evidence first. Native
copy overwrites the Mac clipboard with synthetic text only and reads it only after
correlated native copy. It never reads/saves/restores previous clipboard content.
Do not run it without that same explicit procedure authorization.

The no-flag runner is the preserved full finite sequence and will reproduce the
known ordinary description-layout failure. **Do not automatically rerun/escalate it.**
The Safari runner's finite control/probe already failed same-pending-state supervision;
no defensive Safari source may follow. Its small-source activation also remained
incomplete before any worker source request. No third viewer, cap or threshold change.

```sh
# Historical finite probe; inspect preserved result, do not automatically repeat:
node research/increment-007-e4-qualification/safari-probe.mjs
```

`attempt-1-source/` and `attempt-2-source/` preserve source versions before the stale
metrics and selector fixes. `attempt-1-chrome.json`, `attempt-2-chrome.json`, all traces,
and the first Safari attempt are preserved. Current manifest excludes itself and any
future independent-review files. Do not edit its frozen files during independent review.
