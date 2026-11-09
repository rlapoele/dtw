# Increment 007: storage and concurrency qualification plan

**Proposed plan — 9 November 2026. No experiments executed.** Baseline
`d83a9e91f061ca6519849096e49ec1fc2c112d72`. The
[Draft AC-1–19](007-local-retention-and-backup.md),
[agreed coverage/admissibility](007-backup-coverage-and-restore-policy-proposal.md),
[agreed storage direction](007-storage-acknowledgement-and-concurrency-proposal.md)
and [proposed format/resources](007-format-decoder-and-resource-proposal.md)
are the expected behavior. Proposed F-1–F-5 need agreement; this plan creates no
implementation, runtime experiment or destructive-test authorization.

## Two stages, separate authorization

**Stage A — isolated mechanism qualification:** after separate user authorization,
a disposable narrowly scoped harness can test native IDB/Web Locks/lifecycle/file
mechanisms **and codec/resource feasibility** against the proposed F-1–F-5 policy.
That separately authorized feasibility stage permits measuring proposed limits
before final agreement, without authorizing product implementation. Parser package
installation, if needed in that harness, also needs that explicit authorization.
It does not implement the product, prove V2 usability or establish all ACs. There is no current retained adapter or existing command to run these cases.
Record harness source/manifest and independent findings; stop for material unsupported
mechanisms instead of quietly changing agreed policy.

**Stage B — implementation acceptance:** only after final contract/design agreement
and explicit implementation authorization, test actual application/ports/decoder/
adapter plus regression behavior. Use the developer/reviewer workflow and an
identified stable snapshot. Stage A success is not permission to start Stage B.

## Environment, fixtures and evidence requirements

- Use a disposable browser profile and isolated origin/database/download directory
  per run. Never reload/clear existing dirty user sessions or operate the user's
  retained V1/V2 tabs. Write only bounded synthetic fixtures to that isolated store.
  Data deletion/reset/forced termination is restricted to the authorized harness.
- First targets: stable desktop Chrome and Safari on macOS at execution time.
  Record exact browser/build, macOS/hardware/available memory, Node/npm if used,
  source/harness commit+hash, origin/port/scheme, profile/mode, feature probes,
  strict durability hint readback, visibility/bfcache/freeze setup, storage permission,
  codec/limit revision and fixture hash. A publication date is not installed support.
- Each case gets ID, AC/policy links, preconditions, exact actions, injected boundary,
  expected outcome, observed events/order, before/after authored equality+revision,
  command identity/dispatch facts, result and limits. Use deterministic sequence
  numbers/barriers to order races, not arbitrary sleeps. Save bounded event logs and
  screenshots where UI evidence matters; source assertions alone are insufficient.
- Versioned synthetic fixtures cover every supported literal/AST/composite/definition
  state, protected/component/inspect-only metadata, diagnostic aliases/namespaces,
  opaque empty/whitespace/separator/`__proto__` IDs, Unicode/lone-surrogate text,
  same-kind duplicate rejection, cross-kind reuse, unnamed existing projects and
  same-name identities. Keep malformed/unsupported fixtures distinct from diagnostic
  accepted fixtures. Record exact equality, not only screenshots or token counts.
- Boundary fixtures use `limit-1`, `limit`, `limit+1` in the units specified by F-4;
  exercise each independent maximum and conflicting budgets. Do not generate an
  unbounded billion-level document merely to test a depth ceiling. No real user data.

## Case matrix

Stage B applies to all cases; A means a disposable mechanism subset is useful first.

| ID / stage | ACs / policy | Future procedure and pass evidence |
| --- | --- | --- |
| Q-01 A/B: capability/open | AC-1/7/17; S-1/2/5 | Probe secure context, native IDB, Web Locks and strict hint. Open fresh/versioned/blocked/unsupported DB. Deny required capability. Empty differs from loading/failure; no volatile fallback/reset. Record exact builds; hint support is not fsync proof. |
| Q-02 A/B: terminal ordering | AC-3/4/5; S-2 | Barrier after request success but before transaction terminal state; force abort. Project+last-command metadata unchanged, no retained-success UI before complete. Cover synchronous setup throw, request error→abort, explicit abort and success→complete. Record terminal event ordering once, no double callback. |
| Q-03 A/B: failures/quota | AC-3/4/12 | Deterministically inject quota/write refusal at adapter boundary; separately attempt bounded real disposable-origin quota denial only if authorized. Prior state/revision/draft intact; no phantom catalogue. Synthetic quota error is not evidence actual disk-full was reproduced. |
| Q-04 B: reads/coherence | AC-2/6/7 | Success then failed readback for each existing mutator and restore/create. Same-project stale snapshot or no-snapshot unavailable body; no unrelated/empty claim. Retry reads once, no duplicate write/new ID. List/inspector/resolution share revision; read operations never mutate authored state. |
| Q-05 A/B: project ownership | AC-16; S-3 | Two tabs reach acquisition barrier for same exact project ID; only one writable. Other inspect-only, no steal/TTL. Repeat reversed acquisition order. Distinct projects can be editable concurrently; shared-store contention must preserve both. Capture owner/query facts without treating query alone as ownership. |
| Q-06 A/B: atomic revisions | AC-3/14/16 | Race same-ID absent create/restore, equal expected-revision edits and distinct-project edits. Exactly one conflicting acceptance; no lost other-project data, phantom entry or command/state split. Test empty and separator IDs and exact case; never string-concatenate ambiguous keys. |
| Q-07 B: replacement | AC-10–15 | Preview revision A; create independent A backup and acknowledge; change local to B before acceptance. Block, preserve B, invalidate protection/ack; renew preview/backup/ack then replace completely. Cancellation/abort leave local unchanged; selected backup IDs preserved, no merge/copy. |
| Q-08 A/B: dispatch fence | AC-5/6/16; S-4 | Barrier before transaction issuance; request cancellation, then release delayed continuation. No future dispatch allowed. Separately issue acceptance before probe; serialized probe follows it. Exercise accepted, terminal abort, provably never-dispatched and unprovable order. Absence alone never produces rejection. Record fence state, actual issued transactions and event order. |
| Q-09 A/B: ambiguous evidence | AC-5/6/7; S-4 | Suppress terminal observation while controlling actual acceptance. Matching latest metadata confirms once; later revision/missing metadata/incarnation reset/read failure remains unknown if proof insufficient. Block blind resubmit, preserve live input. No durable intent journal introduced to simplify test assertions. |
| Q-10 B: reload recovery | AC-1/2/5/8 | Reload authorized disposable session after commit-before-UI-result and before-dispatch. Reopen latest retained Projects/snapshot; no auto replay or claimed per-command verdict, session drafts absent as disclosed. New project discoverable once. No claim that erased origin history can be reconstructed. |
| Q-11 A/B: lifecycle | AC-8/16; S-3/5 | Ordinary hide/show retains ownership by default. Exercise actual pagehide/pageshow, supported freeze/resume and actual bfcache navigation, recording whether bfcache was used. On resume revalidate ownership/revision/outcome; preserve live raw drafts/forms, require review/reapply if changed. Unsupported lifecycle tooling is an explicit gap. |
| Q-12 A/B: owner termination | AC-2/5/16 | Close owner normally; separately terminate only disposable tab/process/browser at recorded barriers. Determine new owner's acquisition, reopen and latest state. No timeout takeover of frozen owner. Controlled termination is not OS crash/power-loss or universal lock-release timing proof. |
| Q-13 A/B: upgrade/reset | AC-1/7/17 | Keep another connection open during version upgrade; record blocked/versionchange behavior and explicit Retry guidance. Clear only disposable DB/origin with known attempt and then inspect; missing evidence stays unknown, no silent replay/reset of unsupported data. |
| Q-14 B: draft conflict | AC-4/8/9/16 | Ownership loss/conflict with invalid raw literal, reference draft and unfinished create/rename form. Same baseline resumes explicitly; changed value requires deliberate review/reapply; removed/ineligible target blocks action without losing raw input or recreating data. Test ordinary current repairs still require whole-candidate checks. |
| Q-15 B: full backup/restore | AC-9–15/17; P-1–4/F-1–3 | Actual download and file-picker restore in a fresh isolated origin/profile. Compare complete authored structures/strings/arrays/IDs; exclude drafts and internal revisions/outcomes. Unsupported/corrupt/duplicate fields/foreign IDs/version/resource input rejects whole, readable diagnostics remain preserved and inspectable. |
| Q-16 A/B: decoder adversaries | AC-9/11/13; F-2/3 | Fatal UTF-8, BOM, escaped duplicate keys, comments/trailing commas/multiple roots, unknown `__proto__` structural key, allowed same-text ID, null/absence, unpaired escaped surrogate, numeric exponent/unsafe index, malformed AST versus valid unresolved AST. No prototype mutation, normalization or partial parse acceptance; original files untouched. |
| Q-17 A/B: resource/derived safety | AC-4/9–13/17; F-4/5 | Validate every boundary, long exact Decimals, repeated DAG evaluation and scaling growth. Admission does not evaluate AST. All commands/backups/load/restore use same ceilings. Derived guard triggers before over-budget allocation/expansion, preserves source and reports unavailable rather than invalid authored data. Include max-cap project plus one new token/group and exact rejected draft preservation. |
| Q-18 A/B: storage policy | AC-2/7/12; S-5 | Record persist granted/denied/unavailable and quota estimate uncertainty; no grant proves independent backup/permanence. Separate normal/private profile observations; private mode remains outside durable-support promise. File-origin/loopback/deployed origins remain independent; no automatic transfer. |
| Q-19 B: accessibility/name | AC-1/8/18/19 | Keyboard-only modal/departure/recovery/replacement flow; safe Escape, associated errors/status, focus containment/return; actual 200% browser zoom and specified compact widths. Blank new name rejects exactly; accepted Unicode/whitespace stays exact; existing unnamed restore preserved. Record actual viewport/zoom, not requested-only dimensions. |
| Q-20 B: architecture/regression | AC-9/17 + existing contracts | Run documented typechecks/tests/build after implementation; check domain/application remain browser-independent, no per-render async storage reads, no duplicated semantic decoder in UI, no unrequested history/dependencies. Independent reviewer checks stable snapshot plus bounded browser evidence. |

For genuine races use a barrier to force each material interleaving, then repeat
that interleaving at least three times in each target engine; add runs only for
unresolved nondeterminism/failures. Three runs are a reproducibility minimum, not a
probability bound or exhaustive scheduling proof. Lifecycle/termination observations
must identify which intervention actually occurred, not infer it from a delay.

## Performance experiments and provisional acceptance targets

Targets below are review proposals, not measurements or existing quality constraints.
Stage A may measure disposable codec/IDB workloads; Stage B measures actual UI/app
acceptance. Label them separately; harness speed is not delivered product evidence.
User feedback on 9 November treats 1,000 tokens as exceptionally large and the
proposed capacity limits as more than sufficient. Therefore distinguish a typical
100-token fixture, a 1,000-token large case, and defensive maximum-capacity stress.
The user did not lower the 10,000-token ceiling or agree these timing targets.
The proposal's [dated scale references](007-format-decoder-and-resource-proposal.md#dated-scale-references-and-interpretation)
provide context: Supernova's 2024 survey bands and Figma's February 2026 report of
7,400+ Primer tokens use unestablished counting definitions for this comparison.
They neither establish a current representative baseline nor equate to DTW authored
identities. Keep target workloads distinct from a universal claim that larger
systems cannot exist; fixtures, caps and timing proposals remain unchanged.
Measure on the captured primary test machine after a warm-up, with at least 20
non-injected runs per workload/browser; report all values, median, p95 definition
(nearest-rank), maximum, fixture hash and rejected/refused cases. Record cold startup
separately. No universal device claim follows.

| Workload | Starting review target |
| --- | --- |
| Normal accepted command, typical 100-token fixture | Proposed p95 dispatch→transaction-complete ≤250 ms; UI success only afterward. |
| Accepted command, exceptionally large 1,000-token fixture | Proposed p95 ≤1,000 ms; report actual observations independently of typical-case results. |
| Defensive maximum admitted snapshot | Safety and bounded completion first; record latency/work/memory and refusals. No typical-use latency requirement or qualified numerical deadline is inferred; agree a stress completion bound after feasibility evidence. |
| Projects list: typical/large cases versus 25 maximum-sized records | Proposed ≤2,000 ms for typical/large catalogue fixtures, whose project counts must be recorded. Maximum catalogue is defensive stress: 25×8 MiB is 200 MiB serialized read workload; measure bounded completion/memory without implying real-world prevalence or a qualified deadline. |
| Backup decode/validate/generate: typical/large versus maximum | Proposed each ≤2,000 ms for 100/1,000-token fixtures. Defensive maximum measures bounded completion; no uncontrolled task/heap growth or call-stack failure, and no typical-use latency inference. |
| UI responsiveness during non-IDB domain/codec work | No single blocking task >100 ms as an initial target; if exceeded, propose bounded scheduling/worker scope and requalify rather than silently relax limits. |

Refusal at a documented admitted boundary, catastrophic heap growth, uncontrolled
BigInt work or stack overflow is a failure needing investigation, not “expected
large data.” A correctly rejected over-budget fixture passes correctness while its
bounded rejection cost is still measured. If proposed timing/resource limits conflict,
return the evidence and choices to the user; do not replace exact values with rounded
ones, shrink fixtures or lower the quality bar quietly.

## Evidence, stop criteria and handoff

Pass requires actual evidence for every applicable case and AC, or an explicitly
agreed reduced support claim; unexecuted/unavailable cases stay unverified. Stop
and return material findings for any silent data loss, premature retained success,
duplicate acceptance, stale replacement, dual writable ownership, decoder coercion,
unsafe resource growth or unsupported required capability. Do not continue testing
against user data or erase a failed source to recover the harness.

A report records stage/snapshot/environment, case results, fixture equality and
revisions, event/barrier evidence, performance results, defects and rechecks, explicit
missing browser/OS/lifecycle coverage and stop-condition disposition. Record failed
attempts without presenting a later pass as proof all intervening outcomes were safe.
Implementation review remains a separate role and stable snapshot.

No OS power interruption, filesystem damage, true browser eviction, physical-device
or hardware durability test is authorized or planned by default. Simulated events
can establish application handling; actual termination can establish only that
intervention. A strict-hint property/event trace never proves an fsync or immunity
from power loss. API research is in the linked agreed storage document; no new API
support or measured performance claim is made here. This plan and format/resources
remain for user review; no tests, experiments, app edits or qualification ran.
