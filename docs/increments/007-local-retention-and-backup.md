# Increment 007: local retention, reopening and project backup

- Contract status: **Draft — analyst updated after V3 review, 9 November 2026.**
- Delivery status: **Not started; implementation is not authorized.**
- Agreement: direction and isolated prototype preparation agreed 9 November;
  user subsequently approved identified V1 **for analyst review only** and V2
  **for renewed analyst review only** on that date. V3 was also approved for renewed
  analyst review, with explicit production-baseline preservation. Revision 2 was
  subsequently approved for renewed analyst review; V3-R1 is closed at design level,
  with documented specimen fidelity caveats and production obligations.
  Final contract/design agreement and implementation authorization remain pending.
- Production baseline: `4171dbc`; V1 review snapshot: `3b69671`; V2: `7014e75`;
  V3 original: base `50d9f67` plus frozen manifest; revision 2: committed `2805b0c`
  with its separate ten-file manifest (artifact base `52e8009`).

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
partially qualified only in isolated Stage A mechanisms. The policies below now
select storage/format direction; production integration and support claims remain
unqualified.

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
Prototype mechanics select no additional technology. The separately agreed storage
and format policies below own native IndexedDB and jsonc-parser 3.3.1; no general
schema framework is selected.

## Required name for new projects

**User-requested creation direction — 9 November 2026:** require a project name
when creating a new project. This improves identification in Projects and removes
the need for a new untitled-project creation path. It does not establish identity,
name uniqueness or storage/recovery guarantees.

**Proposed interpretation for final agreement:** reject empty and whitespace-only
creation input with an associated field error, while preserving accepted text
exactly. Test blankness without silently trimming, normalizing, changing case or
generating a name. Duplicate names remain permitted and distinguishable by stable
identity. Enforce the creation rule at the application command boundary as well
as the interface; it is not a new universal canonical-data invariant.

Existing supported unnamed projects remain readable and restorable with a truthful
presentation fallback. Do not rename them or reject an otherwise supported backup
merely to apply a new-creation rule retrospectively. The current production model,
API and tests intentionally permit opaque empty names and remain unchanged until
implementation is authorized. This amendment affects new projects only, not token
or group naming. V1 is unchanged; V2 represents the required-name validation
proposal without changing production behavior.

This narrows one creation UX choice without settling storage or recovery
qualification. The renewed V2 review resolves R-4 as a design-state omission, not production acceptance: a named
project can still have unavailable content.

## Acceptance criteria

These IDs are stable draft criteria. D-2/D-3, S-1–S-6 and F-1–F-5 policies are
agreed below. Remaining scheduling/placement, supported-build scope and
qualification/Stage B evidence are distinguished from those agreements;
no acceptance criterion is claimed implemented by prototype or Stage A evidence.

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
  Outcome-check failure or a still-unknown result preserves input and blocks unsafe
  resubmission under the agreed live-session policy. AC-23 specifies guarded
  departure without claiming rollback or reconstructing a verdict after reload.
- **AC-6 — Retained but unreadable:** acknowledged write followed by read failure is
  reported as retained with stale/unavailable display. Prior coherent snapshot, if
  any, belongs to that same project and is labelled stale; with no prior snapshot,
  neither an empty-project claim nor another project's content is shown.
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
  coherent refresh/recovery before writing. Recovery cannot silently rebase or apply
  a draft over a changed baseline: retain its original project/entity/revision
  association, revalidate current eligibility and define deliberate review/reapply
  or cancellation under the agreed D-4 recovery policy. Concurrent writes to distinct projects
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
- **AC-19 — Required new-project name:** creation requires a user-supplied name.
  Under the proposed blankness policy above, empty/whitespace-only submission
  reports an associated error, focuses the name field and preserves form input.
  It creates no retained project or catalogue entry. Accepted name text remains
  exact; duplicate names are allowed.
  Supported existing unnamed data remains reopenable/restorable without rewriting
  it. Verify application-boundary enforcement separately from interface validation.

- **AC-20 — Preserve the production baseline:** the next production version retains
  existing token-list swatches, collision-safe names/paths, layer/type labels, exact
  authored values/references, responsive Description column/preview and list/search/
  group/navigation/create/rename actions. Preserve inspector descriptions and metadata/
  semantic roles, complete three-component plus alpha exact inputs and eligible sliders,
  all five view spaces and normalized/integer sRGB entry scales. Preserve byte
  approximation indications, exact untouched components/alpha, aliases/IDs/metadata,
  applied/draft separation and previews, authored/resolved/trace/raw inspection and
  existing keyboard/focus, pane/scroll and responsive behavior under prior contracts.
  Simplified V3 controls/content are permitted exploratory specimens only; they do
  not authorize removing/changing these production capabilities or invent new metadata
  editing. Retain truthful ordinary missing-description feedback (No description),
  header eligibility/unavailable/empty-selection states and the separate regeneration
  footer; removed-target recovery wording must not replace ordinary data fallbacks.
  Associate actual invalid-draft/candidate errors with their fields and preserve
  accessible error/status focus, including normalized/byte/reference failure paths.
  Integrate pending/recovery/resource states into the existing owned controls.
- **AC-21 — Local resource feedback:** distinguish incoming/candidate/retained-record/
  whole-backup admission refusal from unavailable derived evaluation and incomplete
  diagnostic display. Admission failure changes no retained state and preserves raw
  input; details use actual bounded measurements/units. No partial backup/load, native
  input truncation or automatic retry of an unchanged deterministic limit. Valid costly
  ASTs/aliases stay exact and backuppable; unavailable derived results do not become
  authored-invalid. Incomplete reports never imply complete checks/all-clear or permit
  bypassing admission; structural checks remain complete within the agreed input bounds.
- **AC-22 — Deliberate recovered input:** compare previous applied/current applied/
  preserved input when its original baseline changed. Review opens comparison only;
  explicit Reapply performs one fresh validated revision-checked command. Preserve
  both literal/reference raw sessions and view/scale choices. Changed create/rename
  forms show the original target/parent identity and entered fields before submission;
  absent/ineligible targets keep selectable input and block mutation without recreation,
  retargeting, conversion or merge. Unchanged baseline still requires explicit Apply.
- **AC-23 — Unknown result and reachable safe departure:** Check retained result and
  failed-check feedback remain reachable inside **every active mutation dialog** and
  the workbench. Keep affected writes/duplicates blocked and input intact while unknown.
  Review before leaving initially focuses Stay here; Escape returns to intact input.
  Leave is available only after application proof that late dispatch/publication cannot
  affect another loaded context; it warns that an issued write may already be retained
  and session input is discarded, not rolled back. If proof is unavailable, keep Stay/
  check reachable with explicit not-ready feedback. Leaving/reload never replays the
  attempt; reopening reads latest retained state without a fabricated command verdict.
- **AC-24 — Identity-safe all-content inspection:** All content is a quiet secondary
  entry below All tokens and reachable from namespace diagnostics. Show every admitted
  group/token independently of ancestry, including empty/unreachable/cyclic groups.
  Selection keys use project/kind/exact ID with absence separate from empty/whitespace
  IDs; names/derived paths do not establish identity. Preserve normal healthy navigation.
  Show truthful unavailable-path reasons, full exact identity/context/raw canonical data
  with selectable text, and unverified component-ownership notices. No invented partial
  paths, reparenting, hidden records, move/delete/general repair or new authoring scope.

## Agreed supported-data matrix and restore admissibility

**D-2/D-3 policy agreed — 9 November 2026:** the user approved P-1–P-4 of the
[backup coverage and restore policy](007-backup-coverage-and-restore-policy-proposal.md),
explicitly including the first-version limits on conditional and complete component
systems. Its field/value matrix and admissibility allowlist own the detailed policy.
The same rules govern backup generation, retained loading and restoration.

- Retain the declared project/groups/tokens envelope: all nine implemented literal
  variants, three composites, references, six portable AST operations, and supported
  incomplete/protected/inspect-only data. Zero or one unconditional assignment;
  no invented schemas for unimplemented value variants.
- Preserve paired component layer/association IDs as inspect-only with an explicit
  unverified-context notice. Reject nonempty conditions, axes/options/presets and
  component-definition/contract collections as unsupported first-version content.
- Preserve the enumerated supported namespace/reference/evaluation failures with
  diagnostics. Reject malformed representation, ambiguous same-kind identities,
  foreign membership and unknown fields/content as a whole; never strip or normalize.
- Keep exact authored values, metadata, names, IDs and order. Use project-and-kind
  identity scope. Required new-project names do not invalidate supported unnamed
  restored data. Identity-safe UI handling must not confuse opaque IDs with absence.
- Preserve normal authoring validation and existing repair eligibility; acceptance
  with diagnostics adds no progressive repair or new authoring capability.

Coverage/admissibility is agreed here; separate storage and format/resource
agreements below own those choices. D-1/D-4/D-5/D-6 technical/integration evidence
and final contract/design agreement remain pending.

## Decisions and open questions

D-2 and D-3 are **agreed policy**. The user also agreed S-1–S-6 of the
[storage, acknowledgement and concurrency direction](007-storage-acknowledgement-and-concurrency-proposal.md)
on 9 November 2026: native browser IndexedDB; strict-hint transaction-complete
acknowledgement; Web Locks plus atomic revision checks; ordinary background
ownership; live-session reconciliation without a durable intent journal; and
separate storage, authored-envelope and portable-backup version concepts.
Browser capability policy and initial Chrome/Safari macOS qualification targets
are agreed; exact supported builds require evidence. A later Electron filesystem
adapter shares model/codec/application semantics. User-file-first PWA storage,
hidden-tab release and durable per-command reload recovery are unselected alternatives.
D-1/D-4 policy is resolved, with technical qualification pending; D-5 support
qualification and D-6 technical evidence remain pending. F-1–F-5 codec/parser/
resource policy is now agreed below. This agreement
is not final contract/design agreement or implementation authorization.

| ID | Resolve before agreement/implementation | Analyst recommendation and evidence needed |
| --- | --- | --- |
| D-1 | **Direction agreed; qualification pending:** browser persistence adapter, exact acknowledgment/atomicity boundary, catalogue consistency, and interrupted/unknown-outcome recovery. | Qualify one simple adapter over authoritative project state. Specify observable completion/failure and reconciliation; no hardware-permanence guarantee. Prove abort/no partial project/catalogue and crash/reopen outcomes. Native IndexedDB and the linked live-session recovery policy are agreed; technical qualification remains pending. |
| D-2 | **Agreed:** supported authored envelope and coverage matrix. | P-1/P-2/P-4 of the linked policy are adopted, including unconditional-only scope and explicit context/unknown-content exclusions. Representation/version/resource policy is separately agreed under D-6; implementation evidence remains pending. |
| D-3 | **Agreed:** restore/durable-load admissibility and identity scope. | P-3/P-4 and the linked allowlist are adopted: supported readable diagnostics remain inspectable, malformed/ambiguous/foreign/unknown content rejects whole, normal authoring checks remain unchanged. Decoder/limit integration and qualification remain pending under D-6. |
| D-4 | **Direction agreed; qualification pending:** single-writer acquisition/release, owner crash/suspension recovery, stale revisions, same-ID restore race, replacement protection validity and changed-baseline draft/form recovery policy. | Require atomic revision checks in addition to ownership; bind protection/acknowledgement to current revision. Prototype inspect-only scenario is not evidence. Qualify supported browser behavior and fail closed where exclusivity is unavailable. Raw-input preservation is not automatic merge or takeover; define review/reapply and target-change handling before enabling a recovered write. Web Locks plus atomic revisions and the linked review/reapply policy are agreed; technical qualification remains pending. |
| D-5 | **Capability policy/targets agreed; exact supported builds pending:** supported browser/version/capability baseline, behavior when storage/ownership APIs are unavailable, browser reload/close guards and recovery limits. | Declare the narrow tested baseline before promising support; distinguish retained from independently backed up. Native page-exit behavior needs explicit limits, while in-app departure must preserve drafts. Installation/offline remain excluded. |
| D-6 | **F-1–F-5 policy agreed; qualification pending:** version compatibility/migration policy, runtime decoding approach/library, byte/entity/depth/string/Decimal budgets and resource-failure feedback. | Agreed version separation and first-version rejection of unsupported versions avoid speculative migrations. Verify the agreed bounded budgets against fixtures/measurements without rewriting exact values or imposing the color-calculation input cap on persistence. The agreed parser is jsonc-parser 3.3.1; no general runtime-schema framework is selected. |

The replacement flow's user-confirmed backup protection is agreed direction; D-4
specifies its revision safety and recovery details. Broader canonical file layout,
future migrations, privacy profiles, cross-host persistence and future history
policies remain outside this bounded agreement. See [open questions](../planning/open-questions.md#persistence-and-project-structure).

## Agreed format/resources and authorized Stage A

**Agreed and authorized — 9 November 2026:** the user agreed F-1–F-5 in the
[format, decoder and resource policy](007-format-decoder-and-resource-proposal.md)
and the [qualification plan](007-storage-concurrency-qualification-plan.md).
This adopts the versioned UTF-8 JSON wrapper, strict duplicate-aware decoding,
jsonc-parser 3.3.1, explicit admission ceilings and separate bounded derived work.
The plan's targets and external 30-second stress watchdog are agreed for qualification;
they are not passing performance/capacity evidence. Isolated Stage A harness work
and its parser dependency are authorized. Stage A evidence is kept in
`output/increment-007-stage-a/`; production source/dependencies and prototypes are
outside its writable scope. V3 design additions have received approval for analyst
review only. Final contract/design agreement and Increment 007 implementation
authorization remain pending.

The [Stage A report](../../output/increment-007-stage-a/report.md) and
[independent review](../../output/increment-007-stage-a/independent-review.md)
record partial mechanism qualification, not acceptance of this application contract.
Maximum main-thread codec work failed its responsiveness target; the worker trial
is an option for final scheduling review. Remaining lifecycle/browser/picker and
product integration gaps stay explicit. No production implementation is authorized.

## V3 review and remaining readiness

On 9 November 2026 the user approved V3 for renewed analyst review, explicitly
permitting simplified prototype content while requiring the production preservation
in AC-20. [V3 analyst review](007-v3-analyst-review.md) identifies the frozen ten-file
[manifest](../../output/increment-007-prototype-v3/manifest.json) and
[attributed evidence boundaries](../../output/increment-007-prototype-v3/observations.md).
All ten hashes/byte sizes match; V1/V2 remain unchanged. Resource/refusal, recovered
input, unknown-departure and all-content specimens are coherent in scope.
**V3-R1 is closed by the renewed revision-2 review:** its active token form now
exposes the same attempt's Check/failed-check and guarded safe-departure actions.
The user approved that identified correction for renewed analyst review only.
[Revision-2 manifest](../../output/increment-007-prototype-v3/revision-2/manifest.json)
and [coordinator observations](../../output/increment-007-prototype-v3/revision-2/observations.md)
identify the corrected snapshot and scoped browser evidence. The review records
nonblocking missing-data/header fallback and invalid-draft error-association caveats;
AC-18/20 explicitly preserve the production behavior. No blocking design finding
remains in the reviewed flows; full prototype/production parity is not certified.

Production scheduling/placement is still to be settled against the preserved
main-thread responsiveness failure; Stage A's worker option is not selected by V3.
The [production scheduling and browser-scope proposal](007-production-scheduling-and-browser-scope-proposal.md)
records agreed B-1–B-5 (9 November 2026): one application worker per tab, bounded
renderer reads, session-only fencing/recovery, both normal-profile native macOS
Chrome/Safari on exact qualified builds, and staged mechanism/product gates.
Worker-required capability/placement and these bounded gates are now agreed. The
user authorized an isolated developer qualification followup and independent review,
not production implementation. No new passing evidence is established by agreement.
The [reviewed isolated followup](../../output/increment-007-worker-qualification/independent-review.md)
now closes the recreated-database and overlapping-preparation harness findings.
Its [report](../../output/increment-007-worker-qualification/report.md) and
[revision-2 snapshot](../../output/increment-007-worker-qualification/manifest.json)
record partial native-worker/host evidence. Eager maximum-list responsiveness fails
the 100 ms target; Safari pending-command watchdog preemption remains unqualified.
A subsequent [reviewed temporary-HTTPS probe](../../output/increment-007-https-qualification/independent-review.md)
passes its scoped native worker/storage/transfer/file-input/CSP subset without Mac
trust changes. G-05 remains partial for normal Safari HTTPS, Safari disk download,
native picker/policy observations and actual delivery-origin/product integration.
The temporary tunnel is stopped; no B-4 gate deferral is adopted. Other native and product integration limits remain explicit. No new
render strategy or weaker budget is selected by these results.
The [qualification-gap plan](007-qualification-gap-plan.md) proposes a prioritized
mechanism/design batch, later Stage B acceptance, and an explicit HTTPS gate-timing
choice because that environment is unavailable. These recommendations await user
review; B-4 timing is unchanged unless the user explicitly agrees an amendment.
Completed normal Safari restart/file evidence is credited. No new experiments or
bounded-rendering direction are authorized by this plan.
Exact supported-build scope and residual mechanism qualification remain bounded
readiness items. Product integration/Stage B evidence comes after separately
authorized implementation, not from speculative claims of passing all ACs now.
Policies D-2/D-3/S-1–S-6/F-1–F-5 are not reopened. Contract remains Draft / Not started.

The [reviewed G-01 experiment](../../output/increment-007-rendering-qualification/independent-review.md)
now records a supported 191.793 ms renderer-main Layout counterexample for the exact
raw-detail path. Small row/inspector checks do not qualify the full candidate;
projection/lifetime and native interaction coverage remain incomplete. Automatic
whole-task failure detection needs correction before reuse. No raw-viewer or list
interaction change, smaller resource cap or production implementation is adopted.

## Verification approach

- Application/port tests map AC-1–8/14–17 to detached snapshots and focused async fake
  adapters: controlled ack delays, rejection, known success/read failure, ambiguous
  interruption, out-of-order completion, revision conflicts and ownership loss.
  Verify each affected authoring operation, create/restore catalogue atomicity,
  one-time acceptance, preserved drafts/forms, unresolved/check-failure feedback and
  no unintended project changes. Include a changed/deleted/ineligible draft target
  after ownership recovery, not only an unchanged sample baseline.
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
- Creation-name checks (AC-19) cover empty/whitespace-only rejection and focus, exact accepted
  Unicode/whitespace-bearing names, duplicate names, unchanged form/storage after
  rejection, and preserved reopening/restoration of supported unnamed projects.

- AC-20 regression evidence must exercise actual baseline components and production
  flows (not merely imported component names), including three components/alpha,
  passive view/scale restoration, per-channel byte isolation, row swatches/metadata/
  descriptions and aliases, search/group/create/rename, keyboard/focus and responsive
  behavior. AC-21–24 add resource/refusal, exact recovery, every-dialog unknown-state
  access and full kind/opaque-ID all-content scenarios. Final-composition runtime
  evidence is required for implementation acceptance; prototype parity is not required.

No application checks were run for this documentation draft. Prototype build/runtime
observations are attributed in the review and cannot establish these criteria.

## Design proposals and review

- Post-qualification recommendations, 10 November 2026:
  [bounded-rendering designer assessment](007-bounded-rendering-design-assessment.md)
  was subsequently approved for isolated developer qualification and independent
  review after commit `227e17a`. Production AC-18/20/24 remain binding; no production
  or existing-prototype edits, paging/windowing fallback or final implementation
  agreement follows. The separately prepared qualification-gap plan is not itself
  approval of additional experiments.

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
- Material revision V2: on 9 November 2026 the user authorized a separate designer
  prototype with required new-project names and the analyst's missing recovery
  states. The user subsequently approved identified V2 for renewed analyst review
  on that date. V1 remains frozen; neither preparation nor review authorizes
  production implementation.
- V2 proposal: [design notes and walkthrough](../../prototypes/increment-007-v2/DESIGN-V2.md),
  [identified snapshot](../../output/increment-007-prototype-v2/manifest.json) and
  [coordinator observations](../../output/increment-007-prototype-v2/observations.md).
  Isolated typecheck/build and scoped browser checks passed. The prototype presents
  required-name validation, unavailable first reads, uncertain-outcome recovery,
  preserved drafts/forms after access loss and invalidated replacement protection.
  These simulations do not resolve storage/data-policy blockers D-1–D-6 or establish
  production acceptance.
- User approval of V2 for renewed analyst review: **9 November 2026**, identified by
  its six-file manifest and committed snapshot `7014e75`.
- Renewed analyst review: [V2 dispositions](007-design-review.md#v2-renewed-analyst-review--9-november-2026).
  R-4 is resolved at design level; R-3 replacement invalidation and R-5 lifecycle
  specimens are represented, with mechanisms/recovery policy still open. R-1/R-2
  data-policy choices and R-6 broader verification remain. AC-19 is represented in
  V2, not delivered in production. No new material prototype revision is required
  by this bounded review; resulting material policy/design changes return to the user.
- V3: [design notes](../../prototypes/increment-007-v3/DESIGN-V3.md), frozen manifest
  and [analyst review](007-v3-analyst-review.md), approved for renewed analyst review
  on 9 November 2026. Final corrected composition has source/type/build evidence;
  earlier images/sample do not verify that original composition's runtime.
- V3 revision 2: user approved renewed analyst review on 9 November 2026;
  [recheck](007-v3-analyst-review.md#revision-2-recheck--9-november-2026) closes V3-R1
  at design level using the separate manifest, source and attributed observations.
  Core inspector sections/controls are present, with documented fallback/error
  fidelity caveats; production preservation remains binding. This is not final agreement.
- Final contract/design agreement: pending. Implementation authorization: pending.

## Review baseline and amendments

Clean working tree and HEAD `3b69671edbac6e86aa08ea6e56187522e012d3fb` confirmed before
analyst documentation edits; no production/prototype/dependency changes are included.
Renewed analyst review began from clean HEAD
`7014e7566f188c2f2d826e7310e7fb7d4bdd98f8`. Both frozen six-file manifests match.
The required-name direction is a user-requested amendment to this Draft. On
9 November 2026 the user additionally agreed coverage/admissibility P-1–P-4,
including first-version conditional/complete-component exclusions; D-2/D-3 policy
is now adopted. Neither amendment is final contract/design agreement or
implementation authorization. No developer work or completion claim exists.
Staging, commits and pushes remain with the user. Follow the [workflow](../workflow/agent-roles.md)
and [increment conventions](README.md) for subsequent handoffs.

## Proposed read-projection assessment — 10 November 2026

The [read-projection boundary assessment](007-read-projection-boundary-assessment.md)
recommends named worker reads, display-only rows/selected state, separately requested
exact text, full-membership choices and live publication/lifetime fences. Its row/
encoded-text scheduling targets are proposed transport choices, not new authored
admission limits. Recommendations await user review alongside the separate exact-detail
assessment; no new design approval, experiment or implementation is implied.
AC-1–24, current list/inspector preservation and Draft / Not started remain unchanged.

The separate [exact-detail designer assessment](007-exact-detail-access-design-assessment.md)
proposes candidate order and overflow behavior for user review only. It is not yet
an analyst-reviewed design or an approved prototype change. The current list/full
inspector preservation, unchanged budgets and qualification gates remain binding.

On 10 November 2026, after committing the assessments as `30abbf0`, the user approved
both recommendations for isolated detail/projection comparison with repaired task
instrumentation and independent review. Production/current-prototype edits, final
contract/design agreement and Increment 007 implementation remain unauthorized.

The [reviewed isolated comparison](../../output/increment-007-detail-projection-comparison/independent-review.md)
now confirms both first large-detail openings exceed the unchanged 100 ms task gate
(pre 120.547 ms; textarea 128.683 ms). Neither raw candidate or the partial projection
scaffold is production-qualified. One offline instrumentation finding is independently
closed; remaining fidelity/framing/fence/native/scale gaps are explicit. No raw control,
budget reduction, performance-gate amendment or implementation is adopted.

## Proposed exceptional-detail policy — 10 November 2026

The [E-1–E-4 proposal](007-exceptional-detail-policy-and-performance-proposal.md)
recommends a narrowly classified explicit full-source allowance and concrete
performance/qualification gates while preserving the list and complete inspector.
Its 65,536-unit trigger, 250 ms task/5 s action budgets and no-wrap disclosure layout
are **proposed changes requiring user agreement**, not qualified results or adopted
policy. The existing 100 ms gate remains binding. No new experiment, third viewer,
authored-data cap, prototype change or implementation is authorized by this link.
