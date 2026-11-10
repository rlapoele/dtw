# Independent storage/concurrency safety review — 10 November 2026

**No actionable finding remains in the reported finite Chrome result.** The saved evidence supports the stated small-fixture Chrome mechanism subset. Safari is unavailable before its prerequisite gate; it has no passing or failing native preemption result and no executed C1–C10 result. This is not production, whole-browser, defensive-size or Stage B acceptance.

## Snapshot and independent checks

Derived expected behavior from the finite batch, G-02–04, S-2–4, B-1–2 and qualification plan before reading implementation. Initial preflight findings, reproduced watchdog defect and subsequent dispositions remain in [preflight-review.md](preflight-review.md). Nine findings were corrected before Chrome execution. Rejected R1 and Safari-specific R3 artifacts remain preserved; no failed live result was repaired or retried.

Final developer manifest SHA-256: `59abfed39234c19c3a0ec2e1e11418b40c1d3a1d9704b63e090348e192c0cc1e`. Independently checked SHA-256 and byte size for all 74 entries (13 current source, 61 evidence/archive files), plus all 1,227 preserved older research/output files: no mismatch. Also checked archived Chrome R2 source against its pre-execution manifest; the subsequent Safari runner-only assertion change does not rewrite Chrome's executed source. This independent review file is added after that frozen developer manifest and is not one of its entries.

Independently reran all 14 offline tests: 14 pass, including actual temporary-file/HTTP receipt persistence under all four injected failure types, irrevocable watchdog expiry despite delayed checkpoint/action, malformed matching-ID recovery records, occupied-driver refusal and the causal witness start signal. The initial sandboxed rerun could not bind loopback (`EPERM`); the authorized loopback rerun passed. No reviewer browser session, native rerun, source/test/requirement edit, staging, commit or push occurred.

Independently decompressed both gzip artifacts and verified their original byte counts and hashes against the pre-packaging frozen raw evidence:

| Artifact | Original bytes | Decompressed SHA-256 |
| --- | ---: | --- |
| Chrome results | 35,039,825 | `0558309333e90047fd17f652ad79bf8b6cbe438c8d032bdf9f274012e451add0` |
| Native receipts | 2,386,819 | `a7f2265472babac326c43d4a63d5212019b5ea99bc46bbe8519b516b5d1eca15` |

Gzip bytes/hashes also match [packaging.json](packaging.json). Historical raw paths resolve through that map without semantic evidence changes.

## Chrome findings from raw evidence

The exact ordered inventory has 65 unique cases, all passing, with no missing/extra repetition or watchdog/error outcome. The recorded engine is native Chrome `157.0.8103.50` on macOS `27.2` / `26B123`, using the own disposable profile and loopback origin in [host.json](chrome/host.json). These are mechanism observations on that recorded setup, not a browser support floor or HTTPS result.

Checked all 6,959 native/renderer receipts against returned evidence, including the separate C6 context caveat below. Reconstructed all 422 prepared synthetic fixtures with the identified codec and candidate marker, then independently checked their emitted SHA-256, exactness flags and description limits. They use 100 tokens; recorded maximum token-description length is seven UTF-16 units. The record-count cases use small records, not supported-size capacity fixtures.

| Cases | Independently verified evidence |
| --- | --- |
| C1, two controls | Native strict-requested issuance, request success, then complete or abort. Complete stores the expected whole record/result/revision. Abort preserves the exact prior record and metadata. Runtime strict-unavailable denial is not independently induced by this batch; fail-closed handling is source-reviewed. |
| C2, three repetitions | The original dispatch call pauses outside IDB, the same issuing worker acknowledges cancellation, then its actual pending continuation resumes. No acceptance issuance follows, including the duplicate attempt; prior state/raw input remain exact. |
| C3, three repetitions | Actual issuance precedes worker termination, new ownership acquisition and ordered recovery reads. All three native outcomes are rejected after proved unchanged/absent state with matching incarnation; no retained winner was observed here. The test permits either native winner and does not equate worker termination with rollback. |
| C4, three repetitions | Native complete precedes held response/worker loss. Validated same-attempt reconciliation consumes success once, then actual late original delivery is ignored without replacing the reconciled view. Separately injected later read publication failure remains retained/unavailable. |
| C5, eight controls | Withheld stop, withheld ordering, removed command metadata, malformed incarnation, injected read failure and actual owned database delete/recreate all remain unknown. Same-incarnation ordered unchanged state resolves rejected; matching metadata resolves retained. Reset changes incarnation. The first five are labelled evidence faults, not native corruption/read-failure observations. |
| C6, ten controls | A real returned read is held, project/selection/generation changes, and its actual payload is delivered but ignored. Unchanged context consumes once. Raw input and current view remain preserved; a read does not acknowledge another attempt. |
| C7–C10, 36 material interleavings | Second native operation issuance is positively observed after the first active barrier and before its release. Three repetitions per specified order/winner are present, with reversed worker identities. All 36 released barriers stay within the 4,096-request ceiling; actual maximum is 13. These are overlapping native transactions, not sequential timing assertions. |

C7 returns wholly before/after catalogue rows and coherent revisions, preserves unrelated records and reports writer wait from first native request callback separately from dispatch-to-complete. These correctness repetitions establish no p95 or workload capacity claim.

C8–C10 full winner snapshots and complete record/latest-command metadata independently equal their distinct prepared candidates. Same-ID/protected-revision losers conflict; final-slot losers are refused with no partial record. All expected unrelated seeded records reconstruct exactly. The unavailable seed remains structurally exact, visible/unavailable and counted toward slot 25. Native CAS controls explicitly bypass cooperative Web Locks only after the ownership check; they do not claim that ordinary cooperating owners are simultaneously writable. Synthetic protection does not qualify actual backup/acknowledgement interaction.

**Evidence representation caveat:** nine changed-context C6 rows contain a returned `fixture-setup-complete.context` reference later mutated in place. The already-persisted JSONL receipt retains the correct original context. This review uses that immutable receipt together with held-result correlation and final context, and confirms all remaining event evidence matches persisted receipts. The limitation is disclosed in the developer report; it does not require rewriting evidence or rerunning these cases.

## Safari and cleanup

R4's first Safari attempt stopped after the five-second owned-driver readiness deadline, before positive listener ownership, session creation, window commands or G-02 execution. [Safari host evidence](safari/host.json) records that error. [Coverage](safari/coverage.json) truthfully marks the natural control, three pending-close probes and all 65 C1–C10 identities not run. The helper's detailed PID/listener/exit facts were not persisted on this failure path; root cause is unverified. This is an unavailable prerequisite, not demonstrated queued-close failure or failed native preemption.

The reviewed helper requests SIGTERM only for its newly spawned driver on readiness failure. That is **source-attributed cleanup**, not an observed driver-exit receipt. No shared Safari termination/session deletion or trust change is evidenced or invoked by the reviewed path. No automatic retry occurred. G-02 and Safari G-03/G-04 remain open.

Chrome host evidence records the owned process exit code zero and no cleanup errors; [cleanup-check.json](cleanup-check.json) reports the exact disposable profile absent. Complete native evidence was persisted before shutdown/profile deletion. The reviewer did not rerun browser cleanup or claim OS-level permanence. Safari runner cleanup reports no error, with the driver-exit limitation explicitly retained.

## Remaining limits

This result closes only the executed small-fixture Chrome mechanism subset. It does not close maximum 25×8 MiB catalogue contention, defensive entity/byte/resource qualification, actual protection/backup UI, application dialogs/departure/resume/reload, generic B-2 port acceptance, normal-profile Safari, native file/lifecycle gaps, actual HTTPS delivery-origin support, renderer performance/accessibility or Stage B. Existing authored budgets, strict acknowledgement policy and two-engine target are unchanged. No physical permanence or exhaustive scheduling claim follows.

Suggested short commit message: `research: qualify finite Chrome storage concurrency safety`.
