# Increment 007: local retention, reopening and project backup

- Contract status: **Draft — analyst proposal, 9 November 2026.**
- Delivery status: **Not started; implementation is not authorized.**
- Agreement: direction and isolated prototype preparation agreed 9 November;
  user subsequently approved identified V1 **for analyst review only** on that date.
  Final contract/design agreement and implementation authorization remain pending.
- Production baseline: `4171dbc`; V1 review snapshot: `3b69671`.

## Outcome

An author can return to applied work in this browser after reopening the application
and recover supported authored project data from an independent versioned backup.
Apply/Cancel remain the editing decision; successful applied changes are retained
automatically. This increment does not deliver the full installable/offline PWA.

## Established direction and constraints

The user agreed automatic retention of applied project/token/group changes,
acknowledgment before success, session-only drafts/forms protected on departure,
a browser-local Projects launch surface, independent backups, staged identity-
preserving restore and explicit same-ID whole-project replacement. Successful
retention followed by failed readback is distinct from a rejected write. Design
for one writable tab per project with other tabs inspect-only; enforcement is
unqualified. These behavioral directions do not select storage or schemas.

The agreed [application boundary](../project/architecture.md#increment-007-read-and-write-boundary-direction)
uses explicit read/write interfaces over one authoritative retained state. Reads
inspect coherent loaded snapshots without authored mutation; commands may read
and own validation, concurrency, atomic acceptance and retention acknowledgment.
Keep accepted before/after state available at that boundary for possible future
undo/redo; no history feature or framework is included.

[Vision](../project/vision.md), [product concept](../project/product-concept.md),
[principles](../project/principles.md), [conceptual model](../design-tokens/conceptual-model.md),
[interoperability](../design-tokens/interoperability.md), [glossary](../design-tokens/glossary.md),
[visual direction](../project/visual-direction.md) and
[presentation conventions](../project/presentation-conventions.md) retain authority.
DTCG 2025.10 is interchange, not the chosen persistence or backup format.

## Scope

Included in this draft: browser-local project catalogue/new/list/open/return;
retention of existing authoring operations; explicit asynchronous application and
adapter results; coherent inspection; independent applied-state backup; runtime
backup decoding, preview and complete restore/replacement; read/write/ownership
failure recovery; preservation of the agreed supported authored envelope.

Excluded: token compatibility-profile import/export, lossy normalization, cloud,
accounts, synchronization, privacy profiles/authentication, durable drafts,
copy/remap/merge, project deletion, new token authoring capabilities, progressive
repair, install/offline acceptance, Electron, encryption and undo/redo/history.
No package/framework/database/schema-library selection follows from V1.

## Acceptance criteria

These IDs are stable draft criteria. D-1–D-6 must be resolved and incorporated before
final agreement; dependent criteria do not establish a settled implementation policy.

- **AC-1 — Launch/catalogue:** launch shows Projects in this browser with New project,
  retained-project choices and Restore backup. Empty, loading and failed catalogue
  reads are distinct. Failure never initializes or overwrites storage with an empty
  catalogue. Same-name projects remain distinguishable without treating names as IDs.
- **AC-2 — Reopen:** after acknowledged creation and edits, leaving/reopening the
  project and a fresh application session recovers the same applied authored state,
  identities and relationships. One project is loaded at a time; switching never
  mixes inspection data, draft state or pending results across projects.
- **AC-3 — Atomic authoring:** existing project/group/token creation, group rename
  and color revision retain their domain rules and execute once atomically through
  application commands. Success follows the selected adapter's specified completion
  acknowledgment. Catalogue existence/summary and accepted state cannot leave phantom,
  missing or misleading entries after acceptance/failure. No second Save action.
- **AC-4 — Rejection:** validation, ownership/revision conflict or known failed
  retention leaves prior retained state and all entered draft/form data unchanged;
  error is visible and retry/correction is possible. No success or clean form is
  reported before acknowledgment. Failed creation/restore adds no partial project.
- **AC-5 — Pending:** duplicate submission and unsafe navigation/mutation are blocked
  during acceptance. Late results cannot publish into another loaded project. The
  documented interruption/unknown-outcome policy reconciles authoritative state
  before repeating a potentially accepted command; it never invents rollback.
- **AC-6 — Retained but unreadable:** acknowledged write followed by read failure is
  reported as retained with stale/unavailable display. Prior coherent snapshot, if
  any, is labelled stale; with no prior snapshot, no empty-project claim is shown.
  Further writes are blocked. Retry reads the accepted state without repeating the
  write, creating another entity or replacing again. Successful recovery publishes
  one coherent snapshot and completes the accepted edit/form exactly once.
- **AC-7 — Read failure:** catalogue/project/inspection reads cannot mutate authored
  state. A failed open/read preserves retained data and any available snapshot and
  session drafts; retry or return has explicit feedback. All list/inspector/path/
  resolution data refer to one loaded revision, with no render-time asynchronous
  per-token storage reload or independently synchronized read database.
- **AC-8 — Drafts and departure:** independent literal/reference drafts, raw invalid
  entries and unfinished creation/rename forms remain session-only. App-controlled
  departure offers Keep editing or explicit discard, with Cancel/Escape preserving
  entered data and focus. Draft exclusion from backup never applies/discards drafts.
  Browser reload/close protection and its limits follow the D-5 agreement; no durable
  draft recovery is promised.
- **AC-9 — Preserve current authoring:** existing exact color, extended coordinate,
  `none`, alpha, byte-editing, conversion, metadata, alias/identity, protection and
  inspect-only eligibility rules remain unchanged. Presentation and storage do not
  reinterpret the V1 0–1 specimen as domain validation or apply preview approximations.
- **AC-10 — Backup content:** download a version-identified independent project backup
  of one coherent applied revision. Preserve all supported authored data from the
  agreed D-2 matrix, including project/group/token IDs and ownership, names, hierarchy,
  optional descriptions/metadata, explicit types, exact values, authored aliases/ASTs/
  composites and regeneration protection. Preserve empty/incomplete/inspect-only
  supported data; do not filter by editor eligibility. Exclude unapplied drafts,
  unfinished forms and derived previews/resolution caches as authored truth.
- **AC-11 — Preservation throughout:** reopen, backup/restore and unrelated accepted
  edits preserve untouched supported content exactly, including Decimal text, `none`,
  transparent colors, order where meaningful, absence versus explicit optional data,
  and reference targets. A backup/restore round trip into an empty browser environment
  recovers semantic authored equality and identical IDs without relying on origin data.
  Unsupported whole-project content is never silently omitted or labelled backed up.
- **AC-12 — Backup feedback:** snapshot preparation or file-generation failure reports
  failure without retained mutation or draft loss. Download initiation is not proof
  the user kept a recoverable file. UI explains browser retention limits and independent
  recovery. Filenames/dates aid identification without certifying identity or recency.
- **AC-13 — Decode and stage:** file selection/parsing/classification/preview make no
  retained mutation. Enforce agreed D-2/D-3/D-6 shape, version and resource policies at
  runtime, not through a TypeScript cast. Show project identity, name, snapshot metadata,
  supported content summary and diagnostics. Distinguish unsupported version/content,
  malformed/unreadable/over-budget data and supported repairable diagnostics. No silent
  coercion, partial import, ID generation/remapping or reference flattening.
- **AC-14 — Identity choices:** absent project ID requires explicit restore confirmation;
  same ID offers Open local project, Review replacement or Cancel. A matching name with
  a different ID does not trigger replacement. Recheck identity existence at acceptance;
  a collision arising after preview cannot silently overwrite. Entity identity and
  ownership ambiguities follow D-3, never cross-project reference resolution by chance.
- **AC-15 — Replacement:** show that the complete selected project will replace local
  applied state. Require protection of the exact current local applied revision via
  independent backup plus explicit acknowledgement before acceptance. Download alone
  is insufficient. Changed local revision invalidates prior preview/protection/ack;
  review anew. Cancellation or known rejection preserves all local applied data.
  Accepted replacement preserves selected-backup identities and removes local-only
  authored content as the explicitly reviewed complete replacement, without merge.
- **AC-16 — Concurrent access:** only one tab can accept writes for a project under
  the agreed D-4 protocol. Other tabs are visibly inspect-only. Ownership loss,
  stale expected revision, suspended/crashed owner and competing restores/creations
  cannot cause silent lost updates. Preserve local drafts on loss/conflict and require
  coherent refresh/recovery before writing. Concurrent writes to distinct projects
  cannot corrupt the catalogue or each other's snapshots.
- **AC-17 — Boundaries:** deterministic domain semantics stay host-independent;
  browser retention, file access and ownership mechanisms are adapters behind explicit
  application ports. Runtime external input validation belongs at the boundary and
  does not turn normal authoring into permissive restore. Accepted before/after state
  is available at the atomic application write boundary without a history subsystem.
- **AC-18 — Usable states:** affected flows have labelled controls, associated errors,
  textual status, keyboard operation, safe Escape, modal focus containment/return and
  usable compact/zoomed layout under existing presentation conventions. Pending,
  inspect-only, stale, diagnostic, empty and unavailable states are distinguishable.
  Prototype component reuse alone is not acceptance evidence.

## Supported-data acceptance matrix to complete

D-2 is blocking: “supported” must be an explicit versioned matrix, not “anything the
color editor displays” or every conceptual future feature. Minimum coverage must
include everything the current operational project snapshot can legitimately retain,
including supported inspect-only tokens and protected values. The current snapshot
has project/groups/tokens, not axes/presets/component definitions/provenance stores.

| Area | Required preservation/decision |
| --- | --- |
| Project and namespace | Empty projects/groups; exact names/descriptions; IDs, ownership, parent links; current deferred sibling-name policy is not silently tightened. |
| Tokens and metadata | Primitive/semantic and supported inspect-only forms, name-only/typed-unassigned definitions, explicit types, descriptions/roles/layers/regeneration; association metadata only with explicit ownership policy. |
| Implemented values | Nine literal variants in `ImplementedLiteralValue`; references, portable number/dimension expressions; transition/typography/shadow composites. Closed `TOKEN_TYPES` names do not prove every literal/composite is implemented. |
| Exact color/numeric data | Five color spaces, extended RGB, `none`, explicit exact alpha/Decimals, signed values and units; no conversion or global binary Number normalization. |
| Conditional/other project-owned data | Determine whether axes/options/presets and component-definition ownership enter the supported retention envelope or are explicitly rejected. Never preserve assignments while silently dropping their required context. |
| Extensions/provenance/unknown fields | Agree supported fields and unknown-field handling; do not claim lossless whole-project backup while omitting unsupported imported content. No new external importer is included. |
| Diagnostics | Enumerate supported structural/reference/resolution diagnostics independently of decoder-invalid representation and ambiguous identity. Open-with-diagnostics does not promise all such states are editable. |

## Decisions and open questions

All decisions below remain **open**. Recommendations are analyst proposals, not user
agreement. Product policy needs user choice; feasibility/adapter details need evidence
and a bounded technical proposal before final agreement, not arbitrary preferences.

| ID | Resolve before agreement/implementation | Analyst recommendation and evidence needed |
| --- | --- | --- |
| D-1 | Browser persistence adapter, exact acknowledgment/atomicity boundary, catalogue consistency, and interrupted/unknown-outcome recovery. | Qualify one simple adapter over authoritative project state. Specify observable completion/failure and reconciliation; no hardware-permanence guarantee. Prove abort/no partial project/catalogue and crash/reopen outcomes. No technology selected. |
| D-2 | Versioned persistence/backup envelope and complete supported-data matrix, including axes/presets/component context, metadata/extensions and unknown fields. | Start from current legitimate operational data plus explicitly supported inspect-only forms; enumerate gaps before agreeing breadth. Reject unsupported whole content rather than silently omit. Operational snapshots and V1 JSON are not automatically canonical schemas. |
| D-3 | Exact restore admissibility: which namespace/reference/cycle/conditional diagnostics may load; duplicate identity, cross-project membership and identity-kind collision scope. | Separate strict representation/ownership/identity decoding from an enumerated repairable-diagnostic allowlist. Permit supported missing references for inspection as agreed; preserve their authored relationship. Current loader rejects duplicate IDs, while ordinary commands reject all candidate namespace/reference diagnostics. Do not relax authoring or introduce progressive repair. |
| D-4 | Single-writer acquisition/release, owner crash/suspension recovery, stale revisions, same-ID restore race and replacement protection validity. | Require atomic revision checks in addition to ownership; bind protection/acknowledgement to current revision. Prototype inspect-only scenario is not evidence. Qualify supported browser behavior and fail closed where exclusivity is unavailable. No lease/locking technology selected. |
| D-5 | Supported browser/version/capability baseline, behavior when storage/ownership APIs are unavailable, browser reload/close guards and recovery limits. | Declare the narrow tested baseline before promising support; distinguish retained from independently backed up. Native page-exit behavior needs explicit limits, while in-app departure must preserve drafts. Installation/offline remain excluded. |
| D-6 | Version compatibility/migration policy, runtime decoding approach/library, byte/entity/depth/string/Decimal budgets and resource-failure feedback. | First version may block unsupported versions explicitly rather than implement speculative migrations; confirm policy. Set bounded budgets from fixtures/measurements without rewriting exact values or imposing the color-calculation input cap on persistence. No runtime-schema dependency selected. |

The replacement flow's user-confirmed backup protection is agreed direction; D-4
specifies its revision safety and recovery details. Broader canonical file layout,
future migrations, privacy profiles, cross-host persistence and future history
policies remain outside this bounded agreement. See [open questions](../planning/open-questions.md#persistence-and-project-structure).

## Verification approach

- Application/port tests map AC-1–8/14–17 to detached snapshots and focused async fake
  adapters: controlled ack delays, rejection, known success/read failure, ambiguous
  interruption, out-of-order completion, revision conflicts and ownership loss.
  Verify each affected authoring operation, create/restore catalogue atomicity,
  one-time acceptance, preserved drafts/forms and no unintended project changes.
- Decoder/codec tests map AC-9–15 to an agreed fixture matrix: exact extreme/extended
  values, `none`, zero alpha, metadata, aliases, all supported literals/AST/composites,
  protected/inspect-only/incomplete/empty content, repairable diagnostics, corrupt
  shape, duplicate IDs, foreign membership, unsupported versions/fields and all
  agreed resource boundaries. Check equality and unchanged local data on failure.
- Real adapter tests verify D-1/D-4 completion semantics, transactional abort,
  restart recovery, unavailable storage, simultaneous creation/replacement, owner
  loss and competing tabs. In-memory tests cannot qualify browser retention.
- Browser tests demonstrate fresh-session reopening; independent backup selected
  into an empty origin/storage environment; actual file-picker cancellation/error;
  absent/same-ID restore, successful replacement, protected-revision conflict and
  readback failure with/without a prior snapshot. Exercise app-controlled draft/form
  departure and declared browser-exit limitations.
- Keyboard/focus/status/compact layout and actual 200% zoom checks cover affected
  flows (AC-18). Record exact browsers/viewports and limits. Follow existing test,
  strict typecheck and build commands; a fresh reviewer checks an identified stable
  implementation snapshot after implementation is separately authorized.

No application checks were run for this documentation draft. Prototype build/runtime
observations are attributed in the review and cannot establish these criteria.

## Design proposals and review

- V1: [design notes](../../prototypes/increment-007-v1/DESIGN-V1.md),
  [SHA-256 manifest](../../output/increment-007-prototype-v1/manifest.json),
  [coordinator observations](../../output/increment-007-prototype-v1/observations.md).
  Source viewing command remains in the frozen notes; existing dirty browser
  sessions must not be reloaded to inspect this contract.
- User review: identified V1 approved **for analyst review on 9 November 2026**.
- Analyst review: [consistency review](007-design-review.md), same date. All six
  manifest hashes match. Core direction is coherent; R-1–R-6 require supported-data,
  admissibility, concurrency, unavailable-state and verification completion.
- Sample-only field limits, token-only data, simulated storage/ownership, JSON shape
  and fixtures do not select production semantics. Preserve V1 unchanged.
- Material revisions: pending; coordinator returns material design changes to the
  user before renewed analyst review, particularly no-loaded-snapshot recovery.
- Final contract/design agreement: pending. Implementation authorization: pending.

## Review baseline and amendments

Clean working tree and HEAD `3b69671edbac6e86aa08ea6e56187522e012d3fb` confirmed before
analyst documentation edits; no production/prototype/dependency changes are included.
No agreed amendments, developer work or completion claim exist. Staging, commits
and pushes remain with the user. Follow the [workflow](../workflow/agent-roles.md)
and [increment conventions](README.md) for subsequent handoffs.
