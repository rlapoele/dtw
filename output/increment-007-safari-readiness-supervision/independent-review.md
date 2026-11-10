# Independent Safari readiness/supervision result review — 10 November 2026

**No actionable finding remains in the scoped report. Corrected native readiness is established for this observed setup; G-02 remains unsatisfied.** The first controlled close reached its transport deadline while the same execute remained pending, then the worker completed naturally. No early-preemption qualification, retry or Safari storage qualification follows.

## Snapshot and independent checks

Reviewed result manifest SHA-256 `5e2845337bb6fcbb23e9d73aac88a20f6d6d07b80fcb45ac0c4a6b58dae5a864` at baseline `0f1c1a9`; independently verified all 80 entry hashes. Verified all 24 current and archived executed R2 source hashes against the released preflight `27ea208e38a43a10edcc3bf9a5dc776ddceda701724e96006d11545b619077a2`, and every phase-1 manifest entry. Independently reran 37 offline tests: all pass. The required causal-deadline defect and R2 closure remain in [preflight-review.md](preflight-review.md); R1 source/evidence remain archived.

The tracked research/output count is 1,240 and `git diff --name-only HEAD -- research output` is empty. Git status contains only the two new scoped directories. This independently confirms the saved prior-preservation check for tracked material. Independently compared all 28 JSONL native receipts with the host's saved partial receipts: exact equality. This review is added after the frozen result manifest. No reviewer native launch, HTTP request, browser action, source/test/requirement edit, staging, commit or push occurred.

## Native findings

The driver receipt proves exact-port absence before launcher PID 42214, distinct same-UID Apple XPC listener PID 42217, exact executable corroboration and a live launcher. Positive ownership timestamp precedes the first HTTP request. Status reports ready and one new session reports Safari 27.2 / macOS build 26B123, without accepting insecure certificates. Both launcher streams are empty and untruncated. This qualifies the corrected guarded readiness route in this environment, not a universal ownership policy or normal-profile support. Phase 1 plus this result demonstrates the old PID-equality assumption's false negative on this topology; the old historical failure's exact cause remains unproved because its raw native receipts were not saved.

The natural control's matched target-worker start/finish have sequence 1 → 2 and a 12,001 ms same-worker duration; the witness requests after the positive recorder handshake and acquires the dedicated lock, and the same execute returns true. This supports its pass.

The first controlled repetition pins the exact newly created target before issuing execute. Its independently recorded start is 22:12:21.596 UTC. The separate controller issues the one DELETE at 22:12:23.630, 2,034 ms later, and records TimeoutError at 22:12:26.636, after 3,006 ms. Runner state and execute-request completion timestamps corroborate that execute was pending at request and controller return. The target worker later emits natural-finish at 22:12:33.597 after exactly 12,000 ms on its own clock. The matching witness arrives at that same recorder millisecond; execute then returns true. No early cessation is observed.

The subsequent handle list excludes the controlled target. Eventual disappearance is consistent with delayed/queued processing, but neither its exact close instant nor internal driver queue behavior is established by a missing HTTP response. The report properly labels that inference. Timeout is a failure of the required response deadline, while native preemption remains unestablished; it is not proof that every Safari intervention route is impossible.

## Stop, cleanup and coverage

Only two controls were dispatched. On the first controlled failure the runner records the original stop error and lets only the existing finite block settle. The raw control retains `running` because execution never reached its pass marker; the aggregate stop and separate coverage file truthfully classify it. Remaining two controlled repetitions and all 65 Safari storage cases are not run. No storage or defensive-size workload was dispatched.

After execute completion, cleanup queries remaining handles and closes only the three known owned handles, verifying current identity before each DELETE. No second DELETE targets the failed controlled window. Final DELETE returns an empty handle list; cleanup errors/skips are empty. Driver cleanup signals only launcher 42214, observes exit code 0 and exact endpoint absence with raw lsof exit 1, empty streams and no timeout. The XPC PID is never signalled; recorder closure is saved. The result manifest's runner exit code 1 is executor-reported and consistent with the inspected stop path, not an application failure or independently observed reviewer process exit.

G-02 is unsatisfied for this tested route. Safari storage mechanisms, defensive-size contention, actual product integration, normal-profile/HTTPS support and other existing qualification gates remain open. A different supervisor/isolation route or explicit gate disposition requires separate scope; there is no automatic repair, retry, storage run, waiver or production implementation authorization.

Suggested short commit message: `research: document Safari readiness and supervision limits`.
