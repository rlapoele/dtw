# Safari readiness and pending-command supervision — 10 November 2026

**Corrected driver readiness passed. G-02 stopped on the first controlled close:
early preemption was not established.** No storage/concurrency case or defensive
fixture ran. No retry, repair after native failure, setting change, shared Safari
intervention or XPC-process signal followed.

## Executed snapshot and scope

The coordinator released the independently rechecked R2 manifest SHA-256
`27ea208e38a43a10edcc3bf9a5dc776ddceda701724e96006d11545b619077a2`.
Before execution, all 24 identified source files and the pre-execution manifest
were copied to [executed-r2-source/](executed-r2-source/). Source hashes were
reverified after execution. The runner used precisely:

```sh
node research/increment-007-safari-readiness-supervision/gate-only.mjs --released-live --preflight-sha=27ea208e38a43a10edcc3bf9a5dc776ddceda701724e96006d11545b619077a2
```

One corrected driver launch and one new isolated automation session executed.
The natural control and first controlled repetition ran; controlled repetitions
two and three are **not run**. All 65 Safari storage cases are **not run**.
The runner exited 1 after its stop and owned cleanup. The outer process remained
briefly alive while a bounded settle timer drained; no further native action
occurred during that interval.

Raw evidence is [native-gate/host.json](native-gate/host.json),
[driver.json](native-gate/driver.json),
[close-1.json](native-gate/close-1.json) and
[native-receipts.jsonl](native-gate/native-receipts.jsonl).
The separate [coverage disposition](coverage.json) explicitly records all four
controls as pass, fail, not run, not run without changing the raw runner state.

## Native readiness facts

The endpoint on port 60002 was verified unused before launch. The launcher PID
was **42214**, while the listener was **42217**, UID 501, PPID 1, at the exact
Apple WebDriver HTTPService image and the corroborated observed Cryptex path.
Both bounded launcher streams were empty, with no truncation. Ownership was
recorded before the first HTTP request. `/status` returned `ready: true` and the
new session reported Safari **27.2**, macOS platform build **26B123**.

This native attempt establishes readiness for the corrected guarded route in
this environment. Together with phase 1, it demonstrates the old helper's
spawned-PID-equals-listener-PID assumption rejects this topology. The old run's
missing raw receipts still limit attribution of its exact historical failure.

## Native G-02 observations

| Observation | Nonintervention control | First controlled repetition |
| --- | --- | --- |
| Positive recorder start UTC | 22:12:09.182 | 22:12:21.596 |
| Same execute pending at positive start | Yes | Yes |
| Close request UTC | None | 22:12:23.630 |
| Time from positive start receipt to close | — | 2,034 ms |
| Close response | — | Timeout at 22:12:26.636; 3,006 ms elapsed |
| Same execute pending when controller returned | — | Yes |
| Worker natural duration from same-worker clock | 12,001 ms | 12,000 ms |
| Natural-finish receipt UTC | 22:12:21.185 | 22:12:33.597 |
| Matching witness-acquired receipt UTC | 22:12:21.186 | 22:12:33.597 |
| Execute result | `true` | `true` after natural finish |

Each target/witness pair uses its own case IDs and dedicated lock. The witness
request follows the recorded positive start handshake. Start and finish share
the target's native-worker actor/worker and ordered sequence 1 → 2. These native
facts establish a successful natural control and show that the first attempted
close did not produce observed early cessation or lock acquisition.

The close controller saved a transport timeout, not a successful close response.
After the execute settled naturally, the session's handle list no longer contained
that controlled target. This is consistent with a queued close completing later;
the missing close response prevents claiming its exact completion instant. No
early-preemption pass follows from eventual target disappearance. The raw failing
control retains `status: running` because the runner stops before its pass marker;
the enclosing `result: stopped` and original error own the aggregate disposition.

## Stop and cleanup

The first timeout stopped further controls. Only the already-issued finite worker
block was allowed to finish. No second close was sent to that target. After the
pending execute settled, cleanup queried remaining handles and closed the three
known owned windows, verifying each current handle before DELETE. The last close
response returned an empty handle list. No cleanup error or skipped window was
recorded.

Cleanup sent SIGTERM only to launcher PID 42214. It observed exit code 0, then
verified port 60002 absent with an exact-port query (exit 1, empty stdout/stderr,
no timeout). The listener/XPC PID was never signalled. The local recorder server
closed; native lifecycle and cleanup checkpoints completed in **26,158 ms**.

## Verification and remaining disposition

R1 preflight and its 24 source files were preserved in
[corrected-r1-archive/](corrected-r1-archive/) before the causal-timing correction.
The delayed-start regression first failed, then passed using the conservative
`commandStartedAt + 12000` deadline. R2 has **37/37 passing offline checks** and
syntax checks. These are harness checks, not application qualification. Phase-1
files remain unchanged and its original receipts stay separate.

G-02 remains unsatisfied for the tested pending-execute close route. Safari
storage/concurrency mechanisms and defensive-size cases remain unexecuted; this
investigation does not waive Safari or authorize production implementation. Any
different supervision/isolation route requires a separate explicit disposition.
No automatic repair, retry or expansion is proposed as part of this result.

Only the new research/output directories were written. No production, dependency,
older research/evidence, setting, status document, staged file, commit or push was
changed by this developer task. Suggested eventual commit message:
`Document Safari driver readiness and supervision limits`.
