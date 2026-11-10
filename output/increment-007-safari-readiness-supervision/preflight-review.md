# Independent corrected-route preflight — 10 November 2026

**Hold live release: one required causal-timing correction.** No corrected native launch, HTTP request or G-02 execution was performed by this reviewer.

Reviewed frozen manifest SHA-256 `fbba8ba97bab03a54a273192e4a8fc226f3c391b22e9b5a34d21daf24aa418b0` against baseline `0f1c1a9`; independently verified all 24 source hashes and reran all 30 offline tests (pass). Derived requirements from the finite batch and G-02 before source inspection. Reviewed the corrected ownership helper, gate runner, controller, gate evaluator, tests and borrowed browser graph. Existing phase-1 diagnosis remains valid.

## R1 — required: recorder arrival is not the worker's natural-finish deadline

`research/increment-007-safari-readiness-supervision/gate-evidence.mjs:18` compares witness arrival against `start.receivedAt + 12000`. The recorder receives the worker start after the worker has begun its finite block. Its arrival plus twelve seconds is therefore later than actual natural completion. Missing natural-finish evidence alone cannot repair this: closing the target just after natural completion can discard a queued sentinel.

Reproduced offline that the evaluator accepts an intervention with command start 100000, start receipt 102000, close request 110000, close response 112200, witness 112300 and no saved sentinel. These inputs permit actual natural completion near 112000, so this is not positive preemption proof. The source can reach delayed intervention through checkpoint/controller delay; its lower-bound two-second wait does not impose an upper bound. Existing tests all pass despite the defect.

Use the already-recorded `control.commandStartedAt` as a conservative host-clock anchor: require witnessed acquisition strictly before `commandStartedAt + 12000`, or provide an equivalently proved clock relation. The command begins before this worker can start its block, making that conservative upper bound independent of delivery delay. Retain the actual natural sentinel refusal, exact target disappearance, successful bounded close and same-pending-command checks. Add a regression for delayed start delivery/intervention that presently passes, plus an ordinary positive fixture with the explicit command-start anchor. Freeze a revised snapshot and recheck before the single authorized corrected launch.

## Other inspected conditions

The inspected ownership path preserves the phase-1 native topology: exact previously unused port, unique same-UID expected Apple executable and mapped path, live launcher, refusal on query/identity ambiguity, dual bounded launcher streams and launcher-only signal/exit/endpoint cleanup receipts. HTTP is guarded behind positive ownership. The runner has one launch, one session and at most four G-02 controls; it neither imports nor dispatches the old 65-case inventory. The target is pinned before execute, the independent controller sends one DELETE without switching, witness requests follow the recorded start handshake, and the natural control uses same-worker duration rather than recorder delivery order. Stop handling preserves partial receipts and permits only already-issued finite work to settle before bounded owned cleanup. No additional actionable finding was identified within this preflight scope.

This review does not establish native correctness, normal-profile support, endpoint readiness or pending-execute preemption. Such claims require the bounded live receipts and independent result review after this correction.

## R2 independent recheck

Rechecked revised manifest SHA-256 `27ea208e38a43a10edcc3bf9a5dc776ddceda701724e96006d11545b619077a2`. All 24 source hashes match. Compared its source map against the preserved R1 archive: only `gate-evidence.mjs` and its focused test changed. Independently reran all 37 offline tests: pass.

R1 is closed: both close response and witness arrival must precede the conservative command-start-plus-twelve-second bound; invalid command-start anchors refuse. The exact delayed-delivery counterexample now refuses, while the correlated positive and natural-control fixtures pass. Existing exact target, pending, bounded response, natural sentinel and witness checks remain present.

**R2 preflight acceptable for the one corrected readiness attempt and conditional four-control G-02 sequence only**, with first-unexpected-result stop and owned cleanup as already reviewed. This clears no storage case and establishes no native readiness or supervision result. No reviewer native execution occurred. Final live evidence still requires independent review; any failure/inconclusive outcome stops without automatic repair or retry.
