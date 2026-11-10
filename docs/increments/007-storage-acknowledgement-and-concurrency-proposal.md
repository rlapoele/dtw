# Increment 007: storage, acknowledgement and concurrency proposal

**Agreed direction — 9 November 2026; not implemented or technically qualified.**
The user agreed the recommended S-1–S-6 direction after reviewing the filesystem/
Electron comparison. The proposal was prepared against repository baseline
`fd4072b2147753b3c91473f8ed18098a51932020`. D-1/D-4 policy is agreed; D-5
capability policy and qualification targets are agreed, with exact supported builds
pending qualification. D-6 version separation is agreed; codec/parser/resource
choices remain open. Alternatives below are not selected.
The [agreed D-2/D-3 policy](007-backup-coverage-and-restore-policy-proposal.md)
is preserved, including exact values, opaque IDs, diagnostic loading and whole
rejection of unsupported data. This is research/planning only, not qualification,
final contract agreement, implementation or permission to install dependencies.

## Agreed first-version direction

| Bundle | Agreed direction | Tradeoff / unselected alternative |
| --- | --- | --- |
| S-1: retained state | One browser IndexedDB database, native API behind one small adapter; complete supported snapshots in project records. Derive Projects from those same records. Evolve current synchronous application/storage operations to asynchronous acceptance and explicit snapshot reads. | A thin library can reduce event plumbing but is not justified or selected yet. localStorage, OPFS and user files are not selected as authoritative retention; files remain independent backup. |
| S-2: acknowledgement | Request `strict` durability for authored/command-metadata writes and wait for transaction `complete`. Never report request success as retained success. No silent relaxed/default fallback when strict capability is unavailable. | Strict adds latency/energy cost. Relaxed completion is an alternative policy with a weaker acknowledged persistence boundary, requiring explicit revised agreement. No physical permanence guarantee follows from strict. |
| S-3: ownership and conflict | Exclusive Web Lock for the loaded editable project, plus atomic expected-revision comparison for every command. Other tabs inspect-only. No forced takeover, heartbeat leases or timestamp-based ownership. Retain until explicit departure/close, with lifecycle revalidation below. | CAS alone prevents overwriting the wrong revision but would still allow two writable tabs, contrary to the agreed product policy. Web Locks alone does not validate stale snapshots or replacement protection. |
| S-4: uncertain outcomes | Keep attempt identity and dispatch state in the live session; atomically store only the latest accepted command ID/result metadata with its project revision. Reconcile only with proof the original attempt cannot still submit. After reload reopen latest retained state without replay. No durable intent journal. | This does not reconstruct every interrupted command after reload. Durable prepared-intent/receipt recovery is a stronger alternative requiring explicit added scope, retention/cap policy and qualification. |
| S-5: capability and lifecycle | HTTPS top-level desktop browser; loopback development kept distinct. Qualification targets current stable desktop Chrome and Safari on macOS first, exact builds recorded later. Fail closed for missing required capabilities; no session-only fallback disguised as retention. | Additional OS/browser combinations require their own evidence. Optional hidden-tab release is a separate user-visible policy choice, not a platform requirement or proven crash detector. |
| S-6: representation/version | Native structured plain-data records with separate storage-layout version, authored-envelope version, opaque revision and recovery metadata. Portable backup version is distinct. Sequence complete backup syntax/parser/resource policy as the next D-6 proposal before implementation. | Avoid coupling the browser's database layout to the portable backup file. This recommendation does not resolve duplicate-key parsing, migration or measured limits by choosing JSON implicitly. |

Next step: prepare the bounded D-6 codec/version/budget proposal and qualification
plan. Agreement on direction does not establish technical qualification of D-1/4/5.

## Filesystem and the future Electron host

The user's question about choosing files now for Electron is material. My
recommendation remains **IndexedDB for this browser increment, a filesystem adapter
for the later Electron host, and one shared supported-data codec/validation and
application acceptance contract**. This host-adapter direction is agreed; the later Electron adapter is not
implemented or authorized by this agreement. The portable codec and application ports are the migration seam;
choosing the same low-level storage API in both hosts is not required for reuse.

| Meaning of “filesystem” | Benefit and actual cost |
| --- | --- |
| Browser user-visible File System Access | A user-selected project file can be opened later in Electron without exporting a browser database. But reopening must handle saved handles, permission loss, moved/deleted files and external writers. The picker APIs are not universally available; this changes the browser support and Projects/reopening UX. |
| Browser OPFS | Files remain origin-private, not ordinary user-visible portable project files; clearing origin data removes them and browser quota applies. It does not itself solve the Electron transfer/user-ownership concern. [Mozilla OPFS](https://developer.mozilla.org/en-US/docs/Web/API/File_System_API/Origin_private_file_system) |
| Electron filesystem adapter | Suits locally owned project files while keeping Node/filesystem access behind the project-scoped typed bridge already required by architecture. Renderer/domain remain host-independent. Electron advises isolation and controlled IPC, not renderer-wide filesystem privileges. [Electron security](https://www.electronjs.org/docs/latest/tutorial/security) |

Browser handles can be stored in IndexedDB, but saved handles are not unconditional
future permission: query/request permission again when necessary. The browser picker
still needs capability qualification, and the documentation flags `showOpenFilePicker`
as limited availability. A file-first PWA therefore does not necessarily remove all
browser metadata storage or permission work.
[Chrome File System Access](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access),
[Mozilla picker support](https://developer.mozilla.org/en-US/docs/Web/API/Window/showOpenFilePicker)

A **coherent alternative**, if automatic work in ordinary user-owned files is the
priority now: require a user-selected project file, keep the full authored snapshot,
revision and minimal outcome metadata in that one versioned file, and treat the
browser's recent-file catalogue as a disposable reference list. Auto-retain Apply
by completing a safe file replacement; never dual-write an authoritative IDB copy
and file without a separate synchronization contract. Define missing/moved/denied
file states and qualify an explicitly narrower browser target before agreement.
Independent backups still matter: the working file is not its own recovery copy.
This would revise the agreed browser-local Projects workflow and return to user/design
review; it is not a drop-in implementation substitution.

The File System standard describes making file changes visible when the writable
stream closes, typically through temporary-file replacement; that is useful
single-file behavior, not a project/catalogue/multiple-file transaction or a global
compare-and-swap protocol.
[File System Standard](https://fs.spec.whatwg.org/#api-filesystemfilehandle-createwritable)

For that alternative, qualify close/abort/permission failures, stale file revisions,
multiple browser tabs, external editors and simultaneous Electron access. Web Locks
would coordinate cooperating browser contexts, not arbitrary filesystem writers.
A read-then-file-replace check alone has a race with external modification; either
restrict writers under an explicit supported policy or design a genuinely shared
coordination mechanism. Timestamp/size alone is not an accepted revision guarantee.
Electron also needs a tested temporary-write/flush/replacement/recovery protocol,
including platform and filesystem differences; a Node write call is not an automatic
whole-project transaction. Node exposes write flushing and rename operations, but
this proposal claims no universal cross-file atomicity or power-loss guarantee.
[Node filesystem documentation](https://nodejs.org/api/fs.html)

Choosing IDB now keeps the current browser workflow bounded, at the cost of explicit
backup/restore transfer to Electron. D-6 should make that supported-data transfer
lossless and versioned. Later filesystem evolution reuses model/codec/application
semantics, not IDB events or Web Lock ownership. No Electron implementation or file
format is authorized by discussing the route.

## Why IndexedDB and native APIs

IndexedDB provides scoped atomic transactions and asynchronous structured-data
storage. The specification distinguishes a request's success from transaction
completion and requires transaction-wide rollback on abort. Its durability option
is a user-agent hint; strict prioritizes persistence confidence, relaxed may complete
after handing changes to the operating system. These are documented API semantics,
not demonstrated guarantees on this machine.
[IndexedDB 3.0](https://www.w3.org/TR/IndexedDB/)

The authoring requirement needs an atomic revision check plus state and acceptance metadata
update. Native IndexedDB is the smallest proposed external mechanism meeting that
shape without adding a database dependency. Use focused adapter helpers for
transactions/results; no repository per entity, generic bus, event sourcing,
independently synchronized read database or undo framework.

| Alternative | Why not the first retained-state adapter |
| --- | --- |
| localStorage | The HTML standard explicitly advises assuming no locking mechanism across agents; it is not the proposed atomic compare/update transaction boundary. Reimplementing it with ad hoc locks would add correctness work. [HTML Web Storage](https://html.spec.whatwg.org/dev/webstorage.html) |
| OPFS | No demonstrated need for file-level storage in this bounded project snapshot workflow. Selecting it would still require designing our atomic state/catalogue/outcome protocol. This is a scope/cost judgement, not a claim OPFS cannot support safe storage. |
| User-managed files | Appropriate independent recovery, but making file access the authoring source now changes acknowledgement, permissions and host workflow beyond the approved browser-local direction. |
| IDB wrapper / database library | Could reduce callback boilerplate; costs dependency/version qualification. Start native; revisit only if implementation evidence shows a concrete benefit before installing. No library version is proposed. |

The current [ProjectStorage](../../src/application/project-storage.ts) is synchronous
and sequential. [Authoring](../../src/application/authoring.ts) reloads before
commands/inspection; [App](../../src/presentation/app/App.tsx) invokes it synchronously
and performs a separate readback. These must evolve together, preserving domain
validation and drafts. They cannot simply wrap the old synchronous interface around
a fire-and-forget browser write. [Architecture](../project/architecture.md#increment-007-read-and-write-boundary-direction)
owns the agreed separation.

## Proposed authoritative records and command boundary

One database, provisionally storage-layout version 1, with two narrow stores:

- `projects`: exact project ID → supported authored snapshot, authored-envelope
  version, opaque revision token, latest accepted command ID and result IDs.
- `metadata`: database incarnation and format/adapter bookkeeping, not token data.

Latest-command metadata confirms only that acceptance. It stores no raw draft,
candidate, old values or history, and is not a durable pending-intent queue. Internal
revision tokens change on every accepted write, including complete replacement;
restore never restores an old local concurrency revision. Keys/compound tuples
preserve opaque empty/whitespace/separator-containing IDs; group/token IDs remain
project-and-kind scoped. Unsupported stored records remain untouched and visibly
unavailable rather than filtered into partial or empty projects.

Derive catalogue identity/name/count from the same accepted project record; no
independently synchronized list/summary store. Initially list records coherently and
derive their display data; measure its cost against eventual D-6 budgets. Absent-ID
create/restore compares absence **inside** the acceptance transaction. Different
projects share store-level transaction contention: correctness first, no parallel-
write performance promise.

For every application command:

1. Verify editing ownership and load a coherent revision. Retain independent raw
   input; decode/validate the candidate outside any live storage transaction using
   normal-authoring versus restore policies as already agreed.
2. Allocate a session attempt ID/result IDs once. Track whether dispatch has occurred;
   a command that has provably never dispatched can be cancelled without an authored
   write. No automatic retry or new IDs after an uncertain submission.
3. Submit a short `readwrite` transaction. Read/compare expected revision or absence,
   and replacement's protected revision; then write the complete candidate, new
   revision and latest accepted command metadata together. A conflict makes no
   project write. No user interaction/external async work occurs inside acceptance.
4. Await transaction completion before retained success. Publish the accepted snapshot
   or enter retained/read-unavailable recovery; keep accepted before/after available
   at the application call boundary without storing history.

Transactions become inactive across task boundaries and are intended to be short.
Parse, external hashing, dialogs, lock waits, file downloads and domain computation
must not span a live transaction. If current revision differs, rebuild/review outside
it rather than reusing validation for another input. Handle setup failures and
terminal events; a request/error event alone does not prove the final outcome.
[Transaction lifecycle](https://www.w3.org/TR/IndexedDB/#transaction-lifetime)

## Known failure, retained success and uncertain outcome

| Evidence | Application/UI result |
| --- | --- |
| Candidate rejected before dispatch; transaction setup provably never submitted; confirmed transaction abort | Known no authored change. Prior state/input remain; allow correction/retry. |
| Acceptance transaction completed | Retained at the requested adapter boundary. Complete this edit/form once. A later read failure is retained + stale/unavailable, never rejected. Retry reads only. |
| Acceptance observation lost or adapter outcome cannot be confirmed while session survives | Unknown. Preserve live session input; block affected writes and duplicate submission. Offer Check retained result. Do not infer rollback, retry the payload, or use current revision alone as proof of this command's outcome. |
| Record says accepted, but newer local revision now exists | This command was accepted; inspect latest state separately. Do not restore its obsolete candidate or repeat it. |
| A known command's known acceptance metadata is missing, database incarnation differs, storage is unavailable or decoding failed | Still unknown / recovery unavailable. Missing evidence is not rejected evidence. Explain storage reset/loss possibility and independent backup recovery; no automatic replay. |

### Minimum recovery and stronger alternative

**Recommended first scope:** resolve the attempt while its session survives; after
reload open the latest retained project without automatically replaying any command.
AC-2/5/6 require reopening, no blind repeat and retained-versus-read-failed feedback;
they do **not** explicitly require a durable per-command outcome inbox after reload.
This proposal does not invent that stronger requirement. Session-only drafts/forms
are lost at reload, as agreed.

For live reconciliation, first prevent any delayed original submission: cancel its
pre-dispatch continuation in the application and verify whether a transaction was
already issued. Retain ownership and serialize the probe transaction after all
issued writes to the same store. Matching latest accepted command metadata proves
acceptance. A provably never-dispatched attempt is rejected. A terminal abort also
proves rejection. A serialized probe may establish no acceptance only when the
application has fenced **all future dispatch**, knows every original transaction is
before that probe, and sees the original expected state unchanged without that
command. A read alone/absent receipt is not a fence. If these conditions cannot be
proved, state remains unknown and affected mutations stay blocked; show retry read,
inspect latest, independent backup and explicit leave/reload with truthful draft-loss
warning. Never offer a blind “retry write” to resolve uncertainty.

Later revisions, missing known metadata, database reset/incarnation change or failed
reads cannot establish a former attempt's rejection. After reload, latest-state
inspection reports what is retained now, not a fabricated per-command verdict.
An accepted new project is discoverable through Projects; no automatic recreation.
Outcome metadata may be overwritten by later accepted writes only after the live
attempt has been consumed or its session has ended. Tests must prove the dispatch
fence/ordering and missing-evidence cases; source documentation alone does not.

**Stronger alternative if wanted:** a durable prepared intent before dispatch and
accepted/rejected receipts, with atomic prepared→cancelled fencing against late
acceptance. This adds a transaction, retained command IDs, cleanup/capacity rules
and startup recovery UI. Unresolved records cannot be age-pruned; missing records
still mean unknown. No draft payload or history need be stored. Do not adopt that
journal merely because a disposable prototype held an answer in a ref. User review
of this stronger reload requirement would precede its design/implementation.

## One writable project tab and stale-state recovery

Web Locks coordinate cooperating contexts in the same storage scope. A lock is
held while its callback's promise is pending; document cleanup/agent termination
releases remaining locks. Those rules do not establish a freeze timeout or authorize
stealing a suspended tab's lock.
[Web Locks specification](https://www.w3.org/TR/web-locks/)

Agreed adapter policy:

- Request an exclusive project lock with nonwaiting acquisition (`ifAvailable`).
  Use an injective, versioned encoding of `['dtw', 'project', exactProjectId]`, not
  a hash/truncated ID or concatenation with ambiguous separators. Contention opens
  inspect-only; explicit Check access can try again. A failed query is not ownership.
- Hold ownership for the editable loaded-project session; IDB transactions last only
  a command, never the whole editing session. No `steal`, expiry/heartbeat takeover
  or sharing of a fake editor flag. Acquiring a lock grants no permission to skip
  decoding, domain checks, expected revision or command fence checks.
- **Recommended default:** retain ownership while the loaded project remains open,
  including ordinary background tab switching; release on confirmed in-app departure
  or normal closure. Stop unsafe submissions during suspension/pagehide and recheck
  ownership, outcomes and current revision on pageshow/resume/focus before editing.
  Never schedule a late preflight write after ownership release.
- Frozen/background owners can prevent another tab editing. Explain inspect-only
  status and ask the user to return to or close the owner; no heartbeat/timeout theft.
  Lifecycle callbacks may not run; normal release is not a crash-detection guarantee.
- **Alternative for user review:** release whenever hidden, mark editing paused and
  reacquire/refresh on return, keeping raw input. This may avoid some frozen-owner
  obstruction but adds friction when simply switching tabs. It is not required by
  Web Locks. A freeze/pagehide cleanup can release when supported without promising
  those signals always arrive. Any chosen release policy stops new submissions first;
  an issued transaction must settle/abort or remain unknown before unsafe reuse.
- An already issued transaction can settle during lifecycle transition. Do not hold
  a transaction open waiting for cleanup; preserve ambiguity if terminal observation
  is lost. Acquiring ownership again never permits replay or bypasses revision checks.

Chrome's lifecycle guidance explicitly discusses releasing Web Locks/connections
before freezing; freeze, hidden, termination and bfcache are different states.
Our policy needs actual lifecycle testing, including failure to receive callbacks.
[Chrome lifecycle guidance](https://developer.chrome.com/docs/web-platform/page-lifecycle-api)

BroadcastChannel may announce project/revision changes **after** completion; it is
optional refresh notification, never lock authority, a retained source or proof a
message reached every tab. Refresh on open/focus/resume and explicit retry too.
The messaging API is defined separately from transaction/ownership mechanisms.
[HTML BroadcastChannel](https://html.spec.whatwg.org/multipage/web-messaging.html#broadcasting-to-other-browsing-contexts)

A recovered editor keeps each raw draft/form tied to its original project/entity
and base revision. If latest authored data is identical, refresh the base and permit
an explicit Apply. If changed, display old applied/current applied plus retained
input and require **Review and reapply** or Cancel; reapply constructs and validates
a new candidate against the latest revision, then uses CAS again. If a target was
removed, type/layer changed or editing became ineligible, keep raw text inspectable
and block that action; no recreation, silent overwrite or merge. Replacement requires
new preview/current backup/acknowledgement whenever the protected revision changes,
even after lock reacquisition. These interactions require designer/user review if
materially beyond V2; no prototype edit is authorized here.

## D-5: proposed capability and recovery baseline

No minimum listed below is a passing browser claim. Compatibility documentation
is not cross-tab/crash/storage qualification. Avoid a moving “latest supported” label:
record the exact browser/OS builds used before final agreement/implementation handoff.

| Surface | Proposed status |
| --- | --- |
| Current stable desktop Chrome and Safari on macOS at qualification time | First qualification targets; exact versions to be recorded, not guessed from the current date. |
| Desktop Edge/Firefox and additional OS combinations | Later candidates subject to exact-build qualification and the same capability gates; no arbitrary release floor or untested support promise. |
| Embedded in-app browsers, private/incognito, mobile, file URLs, insecure non-loopback HTTP | No durable-authoring support promise in this first qualification. Show explicit unsupported/unavailable state; don't pretend failure means empty storage. No private-mode detector is assumed reliable. |

Mozilla's compatibility data reports Web Locks in Chrome 69, Firefox 96 and Safari
15.4; transaction durability introspection in Chrome 83, Firefox 126 and Safari 15.
WebKit documents fuller Storage API policy from Safari 17. These differing dates
motivate feature checks, not an inferred 2026 test or a claim that historical
introduction versions are supported application minima.
[Web Locks compatibility data](https://github.com/mdn/browser-compat-data/blob/main/api/LockManager.json),
[durability compatibility data](https://github.com/mdn/browser-compat-data/blob/main/api/IDBTransaction.json),
[WebKit Storage API](https://webkit.org/blog/14403/updates-to-storage-policy/)

Require secure context, working IndexedDB open/read/write with acknowledged strict
hint, Web Locks, supported record decoding and required download/file-input behavior.
Detect required capabilities before allowing authoring; actual storage/quota failures
remain possible afterward. If retention/ownership is unavailable, disable mutation;
allow safe loaded-data inspection/independent backup when content is available.
Never fall back to an unlabelled volatile editor. Loopback can be trustworthy in
secure-context rules, but `localhost`, `127.0.0.1`, different ports and deployment
origins must be treated as different working stores; transfer via explicit backup,
not automatic migration.
[Secure contexts](https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Secure_Contexts)

Offer a user-triggered request for persistent storage after first applied work,
with a quiet status and independent-backup reminder. `persist()` returning true
means the storage mode request was granted; false is not a write failure and does
not block normal acknowledged editing. A granted mode does not prove a downloaded
backup, unlimited quota, or immunity from user/browser deletion. Handle unavailable
API, denial and `QuotaExceededError` without changing prior project/draft state;
quota estimates are not reservations. Browser policies vary, and private-session
storage may be temporary.
[Storage Standard](https://storage.spec.whatwg.org/#dom-storagemanager-persist),
[Mozilla storage guidance](https://developer.mozilla.org/en-US/docs/Web/API/Storage_API/Storage_quotas_and_eviction_criteria)

No save-on-unload strategy: applied commands retain immediately, not at exit. Attach
a native beforeunload guard only while unapplied input/pending uncertainty exists,
without promising it runs or preserves input. In-app departure remains fully guarded;
reload/close/browser discard may lose session-only drafts. Do not auto-apply drafts
on hide. Native beforeunload prompts are browser-controlled and unreliable in some
exit paths.
[beforeunload](https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)

## D-6: representation implications and next bounded proposal

**Subsequent agreement — 9 November 2026:** the user agreed F-1–F-5 in the
[format/decoder/resource policy](007-format-decoder-and-resource-proposal.md) and
its [qualification plan](007-storage-concurrency-qualification-plan.md), authorizing
isolated Stage A including the parser dependency. This resolves the policy choices
left open below; technical evidence remains pending. Production implementation
remains unauthorized. The original sequencing rationale is retained here.

Recommend storage-layout 1 and authored-envelope 1 as distinct provisional version
concepts, **not adopted formats**. IDB can retain the agreed plain data without a
Number conversion of Decimal text. The adapter adds revision/incarnation/command
metadata outside authored entities. An app release version does not determine
backup compatibility; a portable backup's own format/version is separate from the
browser database version. A supported restored snapshot acquires fresh local metadata.

Next D-6 work must make concrete choices for portable wrapper/encoding, strict
runtime decoder (including duplicate serialized-member detection before information
is lost), unknown/version/migration handling and measured byte/count/depth/string/
Decimal arithmetic limits. Prefer no speculative old-version migrations in first
release, and reject unsupported versions whole without resetting the existing DB.
An open/upgrade blocked by another connection needs visible Close other tab/Retry;
never delete a database to get past an upgrade or corruption error. If the stronger
durable recovery alternative is selected, receipt cleanup and unresolved-command
caps need explicit agreement too. No parser/schema library, dependency,
backup JSON shape or numeric resource policy is selected by this storage proposal.

All persistence, generation and restore must enforce the agreed D-2/D-3 envelope
consistently. Any D-6 resource exclusion that conflicts with current valid exact data
requires explicit agreement, not clamping/rounding/truncation. Representation and
qualified limits remain blockers before final implementation authorization.

## Qualification experiments required, not executed

1. Transaction request success followed by abort; quota/write failure; strict-hint
   availability; complete before/after readback failure; missing first snapshot.
   Verify no phantom catalogue entry or receipt/project split. Measure acceptance
   latency and list cost with the eventual D-6 maximum fixtures.
2. Two tabs simultaneously opening one project, create absent same ID, replacing
   after protection, changing distinct projects, and stale expected revisions. Include
   opaque empty/whitespace/separator IDs and cross-kind reuse, not just UUID samples.
3. Interrupt before dispatch, after acceptance dispatched and after commit before
   UI result. Race delayed dispatch against the live cancellation fence and serialized
   probe. Missing known acceptance metadata/incarnation and unavailable/unsupported
   records must never cause blind replay. Across reload inspect latest state without
   inventing a durable command verdict. Qualify journal/cleanup separately only if selected.
4. Hide/show, frozen/resumed, bfcache navigation, closed owner, killed tab/browser and
   blocked upgrades on exact candidate builds. Confirm inspect-only behavior and raw
   draft/form preservation where the session survives. Do not infer power-loss or
   eviction guarantees from a browser restart.
5. Actual independent file download/restore in a fresh origin, persisted true/false,
   unavailable storage/private-policy limitations and restore of diagnostic/inspect-only
   data. Record successful, refused and unverified cases independently.

Application/adapter tests and fresh isolated browser checks require separate
implementation/qualification authorization; none ran for this document. No browser
session, executable spike, retained record, dependency or production file was changed.
D-1/D-4/D-5 technical qualification, remaining D-6 choices, final design/contract
agreement and implementation authorization remain pending. The next bounded
proposal covers D-6 and the qualification plan, preserving the agreed coverage/
admissibility and storage direction.
