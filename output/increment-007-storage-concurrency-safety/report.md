# Storage/concurrency safety qualification — 10 November 2026

Chrome completed the exact finite **65/65 cases**, with no live failure, watchdog expiry or extra repetition. Safari stopped at prerequisite driver readiness: **no G-02 control or Safari safety case ran**. This qualifies a small-fixture Chrome mechanism subset; G-02 and Safari G-03/G-04 remain open.

## Executed snapshots and environment

Baseline `7611ec7acf17d3e776aca3a24339746e328a13b9`. Chrome executed independently accepted R2, preserved in [executed-r2](executed-r2/preflight-r2.json). Chrome `157.0.8103.50`, macOS `27.2` build `26B123`, Node `v24.14.1`; disposable own normal profile and loopback origin are recorded in [host evidence](chrome/host.json). The fixed batch ran from 21:48:10 to 21:48:32 UTC; these are run bounds, not performance measurements.

The first preflight was rejected before browser execution. Its complete source/evidence are preserved in `preflight-r1/`. Nine findings were corrected and independently rechecked; fourteen offline checks passed, including delayed-watchdog failure latching, disk/HTTP partial evidence preservation, occupied-service/child-failure refusal, matching malformed-record rejection and causal witness start. See [preflight review](preflight-review.md) and [offline results](offline-tests-r2.txt).

After Chrome, only the Safari natural-control runner assertion changed. Rejected R3 is preserved; accepted R4 source and pre-execution manifest are in [executed-r4](executed-r4/preflight-r4.json). Neither worker nor Chrome evidence changed and Chrome was not rerun.

## Finite results

| Family | Chrome pass | Safari not run |
| --- | ---: | ---: |
| C1 terminal controls | 2 | 2 |
| C2 issuer cancellation before actual delayed dispatch | 3 | 3 |
| C3 issued transaction then worker loss | 3 | 3 |
| C4 native complete, reconciliation and late original response | 3 | 3 |
| C5 insufficient evidence and positive recovery controls | 8 | 8 |
| C6 actual held result delivered after context change/control | 10 | 10 |
| C7 readonly/writer catalogue contention | 12 | 12 |
| C8 absent-ID CAS contenders | 6 | 6 |
| C9 final slot, supported/unavailable records | 12 | 12 |
| C10 protected revision contention | 6 | 6 |
| Total | **65** | **65** |

Every planned identity/verdict is retained in the compressed Chrome results and [Safari coverage](safari/coverage.json). Safari's nonintervention control plus all three pending-close probes are explicitly not run.

Chrome native receipts establish strict-requested transaction issuance, request success/complete or abort, native locks, fixed-ceiling active request barriers, waiting operation issuance before release and ordered probes. C3's three actual worker losses all reconciled rejected after stop/reacquisition/ordered unchanged read; a retained winner was permitted but was not observed in these three cases. C4 reconciled known completion once before delivering its late original response; injected later read publication failure stayed retained/unavailable. C5 negatives stayed unknown with blocked resubmission; positives resolved rejected or retained, and native delete/recreate stayed unknown. Fault injections are labelled and do not claim native corruption or native read failure.

C7-C10 used only small records. Candidate-specific authored markers and whole-record/result/revision comparisons distinguish accepted winners, losing replacements and untouched unrelated/unavailable data. The uncooperative Web Lock bypass is explicitly a native CAS/cap test after cooperative ownership checks. Synthetic protection identities do not qualify real backup/acknowledgement UI.

**Evidence caveat:** C6's returned `fixture-setup-complete.context` object shares a renderer reference later mutated for the case. Use the immutable recorder JSONL entry for initial context, alongside held/delivered correlation and final context. Native receipts preserve the original context; no rerun or semantic evidence rewrite was performed.

## Safari unavailable, cleanup and limits

The first Safari attempt on R4 failed closed after the five-second owned-driver readiness deadline, before positive listener-PID ownership, session creation, window commands, CPU control or close intervention. [Host evidence](safari/host.json) records the error. Readiness root cause is unverified: the helper does not preserve detailed child/PID/listener failure receipts on this path. This is **unavailable prerequisite supervision**, not an executed failed preemption probe.

Source shows the helper requests SIGTERM only for its newly spawned driver on readiness failure. Without a saved PID/exit receipt this is source-attributed cleanup, not independently observed driver-exit proof. The runner records no cleanup error and no Safari session/window intervention. No Safari.app termination, shared-session deletion, trust-setting change or retry occurred.

Chrome host evidence records owned exit code 0 and no cleanup errors; [cleanup check](cleanup-check.json) confirms its exact disposable profile is absent. Both native and original terminal evidence were saved before shutdown/profile deletion. No production, root dependency/configuration or older research/output file changed.

No maximum-size, p95, normal-profile Safari, HTTPS deployment, product lifecycle/protection integration, performance capacity, physical permanence or Stage B claim follows. Large/defensive catalogue contention, actual protection/UI, browser support and the remaining owning gap-plan criteria stay open.

## Exact evidence packaging

Large Chrome JSON/JSONL are losslessly gzip-compressed. [Packaging map](packaging.json) records original bytes/SHA-256, gzip bytes/SHA-256 and verified decompressed equality. Historical preflight manifests refer to original paths; the map resolves them to `.gz` files. For example:

```sh
gzip -dc output/increment-007-storage-concurrency-safety/chrome/results.json.gz
gzip -dc output/increment-007-storage-concurrency-safety/chrome/native-receipts.jsonl.gz
```

[Final manifest](manifest.json) identifies frozen source, archives and evidence. Suggested commit message: `research: qualify finite Chrome storage concurrency safety`.
