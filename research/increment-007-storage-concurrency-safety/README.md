# Finite storage/concurrency safety harness

Isolated qualification only. Owning scope: [finite batch](../../docs/increments/007-storage-concurrency-safety-batch.md).
No browser has run at preflight. R1 source and evidence are preserved in `output/increment-007-storage-concurrency-safety/preflight-r1/`. R2 adds validated recovery, actual paused dispatch, once-only reconciliation, native start timing, owned-driver verification and causal witness start. Fourteen offline checks include disk/HTTP receipt preservation and delayed-deadline regression. Live execution waits for coordinator release after independent source/offline review.

- Offline: `node research/increment-007-storage-concurrency-safety/preflight.mjs`
- After release: `node research/increment-007-storage-concurrency-safety/run.mjs chrome --released-live`
- Separate Safari branch: same command with `safari`. G-02 control and three exact-own-window pending close probes must pass before its 65-case inventory.

The module worker reuses the frozen Stage A browser codec and parser by read-only imports. It constructs its own 100-token exact fixture; it never imports the old fixture module or calls excluded byte/description cases. The new admission guard enforces token descriptions <=1,024 UTF-16 units. Fixture reports retain emitted bytes, hashes and code-unit equality. Worker-native facts are emitted to the renderer, which sends bounded receipts to the local Node recorder. Recovery evidence faults are explicitly labelled; native loss, abort, database reset and actual response delivery remain separate observations.

`inventory.mjs` fixes 65 ordered identities. `journal.mjs` checkpoints environment/case identity before setup/dispatch, each supervisor fact, original terminal verdict before cleanup, and cleanup separately. Each measured live case has an independent Node 30-second browser-process/owned-window watchdog; setup is recorded separately. A first case failure stops further dispatch, with not-run rows retained. No automatic retry exists. The 4,096-request native barrier is bounded test instrumentation: request callbacks enqueue only native IDB requests; an incoming release message sets a flag, and no external promise is awaited inside acceptance. Failure to establish overlap within that ceiling aborts/fails.

C5 fault injections edit a copy of a real ordered native read result or withhold an observed proof; they do not claim native corruption. C4 additionally injects read publication failure after known native complete and preserves retained/unavailable. C6 holds an actual returned read result, changes renderer project/selection/generation, and delivers the queued payload. C8-C10 explicitly label a Web Lock bypass solely for native CAS/cap controls, after checking cooperative ownership. Synthetic protection identities do not qualify actual protection/backup UI.

The Safari controller only submits DELETE for the session's pinned current owned target. It never switches a window during pending execute, deletes a session, or kills Safari.app. Its three-second transport deadline is recorded as a failure, not evidence of preemption; finite pending work is allowed to settle before bounded cleanup. Native Safari automation is not normal-profile support.

`preflight-r2.json` records exact source hashes, original research/output hashes, baseline and offline result. Do not regenerate it while an independent reviewer is inspecting that identified snapshot. No staging, commit, push, production source, old evidence, root dependency or configuration edits are performed.
