# Increment 007: V1 analyst consistency review

9 November 2026. Review of the identified V1 after the user explicitly approved it
for analyst review. This is a design/architecture consistency review and draft
contract preparation, not final design agreement, implementation review or storage
qualification. No prototype revision is made by this review.

## Identity, basis and limits

- Repository snapshot: `3b69671edbac6e86aa08ea6e56187522e012d3fb`;
  production baseline `4171dbc`.
- Artifact: [V1 notes](../../prototypes/increment-007-v1/DESIGN-V1.md), source
  `prototypes/increment-007-v1/` and [manifest](../../output/increment-007-prototype-v1/manifest.json).
  Analyst independently checked all six SHA-256 hashes against the manifest: match.
- Expected behavior was derived first from the agreed direction in the
  [increment](007-local-retention-and-backup.md), [architecture](../project/architecture.md#increment-007-read-and-write-boundary-direction),
  [principles](../project/principles.md), [conceptual model](../design-tokens/conceptual-model.md),
  [interoperability](../design-tokens/interoperability.md), [visual direction](../project/visual-direction.md)
  and [presentation conventions](../project/presentation-conventions.md).
- Inspected current application/storage/session source and V1 source. Existing
  [coordinator observations](../../output/increment-007-prototype-v1/observations.md)
  provide attributed, bounded runtime evidence. Analyst did not operate a browser,
  reload an existing session, run application tests, or qualify any browser API.
  Historical stage labels inside the frozen artifact describe its preparation;
  the increment records the subsequent user approval for this review.

## Assessment

V1 is consistent with the central workflow direction: browser-local Projects,
explicit Apply/Cancel, pending acknowledgment, separate rejected-write and
retained/read-unavailable feedback, independent backup, staged identity collision
and deliberate whole-project replacement. Its neutral theme, owned controls and
Heroicons follow the accepted visual direction at the source level. This does not
establish keyboard, focus, responsive or assistive-technology correctness.

The prototype is a bounded specimen, not a complete implementation specification.
The following findings prevent treating V1 alone as an agreed implementation handoff.
No evidenced material contradiction in the core proposed workflow requires rejection
of that direction. Material additions to the design must return to the user.

## Findings and dispositions

| ID | Importance and concrete scenario | Evidence and required disposition |
| --- | --- | --- |
| R-1 | Blocking coverage decision: a backup contains groups, protected/non-color/incomplete tokens or other supported inspect-only content. A token-only envelope would lose authored data. | V1 `main.tsx:9–11`, notes “Assumptions”; current `project-storage.ts` has project/groups/tokens only. Specify the supported envelope and exact preservation matrix before agreement (D-2, AC-10/11). The declared specimen limitation is not a prototype defect. |
| R-2 | Blocking policy: a readable restored project has a missing reference, a cycle or a missing parent. Applying normal authoring validation during restore would reject every diagnostic, whereas blindly accepting decoded objects could permit ambiguous identity/ownership. | V1 missing-reference fixture is illustrative. Current `authoring.ts` reads namespace/reference diagnostics but rejects duplicate group/token IDs; `accept()` requires no namespace/reference diagnostics. Define restore-specific decoding/admissibility independently (D-3, AC-13). Opening with diagnostics does not imply progressive repair. |
| R-3 | Blocking concurrency: a replacement preview and current-state backup are made at revision A; another writer changes the project to B before confirmation. Replacing B after acknowledging A would discard unprotected work. | V1 `collision`, `protectedCurrent`, `ack`, `restore()` have no revision/ownership checks; concurrency is expressly simulated. Bind backup, acknowledgement and acceptance to the same current revision, recheck atomically, invalidate protection after change (D-4, AC-15/16). Define owner-loss/crash recovery and catalogue atomicity; do not infer mechanisms from sample state setters. |
| R-4 | Required missing state: project creation or absent-project restoration succeeds but its first read fails, so no prior loaded snapshot exists. | V1 `create()/restore()` set `active` with `loaded=null`; the workbench then resembles an empty project and says “No tokens yet”, despite unavailable content. The recovery banner exists, but the no-snapshot body is misleading if copied. Require a distinct unavailable/loading body with Retry and guarded return (AC-6). Designer should present this material state to the user before final agreement. |
| R-5 | Required lifecycle coverage: catalogue/open/backup preparation fails, a write outcome is uncertain after interruption, or ownership is lost with drafts open. | V1 has selected simulated failures but no complete lifecycle or transport/recovery specification. Define known rejected, known retained, and unresolved outcomes without inviting duplicate creation/replacement; preserve drafts and block unsafe writes (D-1/4/5, AC-4–8/16). Resolve uncertainty by reading authoritative state, not rerunning blindly. |
| R-6 | Required verification gap: Cancel/Escape/focus return across stacked form/departure/replacement dialogs, file selection and read recovery; compact and zoomed layouts. | Notes and coordinator observations explicitly limit runtime evidence. Specify browser verification and accessible status/error associations (AC-18), including no accidental discard/replacement via Escape. No independent accessibility pass is claimed. |

### Intentional shortcuts that must remain illustrative

The single sRGB field and its 0–1 regular expression (`main.tsx:27`) must never
replace exact Decimal entry, extended RGB values, `none`, five authored color
spaces, alpha, integer-byte policy or established conversion eligibility. Literal
and reference draft specimens do not replace the production independent draft
sessions. Restricted reference choices do not replace domain graph validation.
Token-only samples, JSON download syntax, simulation markers, timestamps, example
counts, filenames and fixture IDs select no persistence or backup schema. Restore
samples authored with other IDs are separate example projects; restoration of a
selected backup must preserve its own IDs unchanged.

The prototype's React state and timeout do not implement the agreed application
boundary. Existing production operations also require bounded evolution: they use
synchronous `ProjectStorage.load/commit`, reload storage for inspection, assume
sequential single-writer calls, and expose no catalogue/revision/ownership decoder.
Application reads must inspect a coherent loaded snapshot; explicit commands may
read authoritative state for validation and concurrency. One authoritative state
and atomic commands are sufficient; no read database, event bus or history engine
is warranted.

## Required transition contract

```text
coherent loaded state + independent draft/form
    → command pending (no duplicate acceptance or unsafe departure)
    → rejected: prior retained state + entered draft/form unchanged
    → retained, readable: publish accepted snapshot; complete that edit/form
    → retained, read unavailable: mark stale/unavailable; Retry read, no repeat write
    → outcome unknown: block writes; reconcile authoritative result before retry

restore file → decode/classify → preview (no retained mutation)
    → absent ID: explicit restore acceptance
    → same ID: Open local | Review replacement | Cancel
        → protect exact local revision + explicit acknowledgement
        → atomic identity/revision/ownership check + complete replacement
        → changed revision: stop and renew preview/protection/acknowledgement
```

Read failure after a known retained write is never rollback or permission to repeat
it. Unknown acknowledgment after interruption is a separate state to resolve in
D-1. A successful browser-adapter acknowledgment is not a guarantee of permanent
physical storage, immunity from browser eviction or verified independent backup.

## Recommendations requiring agreement or technical evidence

The [draft contract](007-local-retention-and-backup.md#decisions-and-open-questions)
records D-1–D-6. Recommended policy is strict representation/identity decoding with
explicitly enumerated supported repairable diagnostics, and complete rejection of
unsupported content rather than partial restoration. Supported inspect-only data
must survive every write as well as backup/reopen; editor eligibility is not a
serialization filter. No unimplemented conceptual feature is implicitly added to
production merely because the conceptual model describes it.

Prefer a single atomic project/catalogue acceptance boundary, revision-based stale
write checks even with exclusive ownership, and user-confirmed independent backup
of the exact replaced revision. These are proposed observable safeguards; their
mechanisms and browser feasibility remain unselected. A focused qualification
spike is appropriate for D-1/4/5 before a production implementation handoff. No
external API support claim, library choice, installation or implementation is made
by this review.

## V2 renewed analyst review — 9 November 2026

The user explicitly approved V2 **for renewed analyst review**, asking for the Draft
contract update and no implementation. This section updates dispositions only;
the V1 review above retains its historical meaning. Final design/contract agreement
and implementation authorization remain pending.

### Snapshot and evidence

- Reviewed clean HEAD `7014e7566f188c2f2d826e7310e7fb7d4bdd98f8`;
  production baseline remains `4171dbc`.
- [V2 notes](../../prototypes/increment-007-v2/DESIGN-V2.md),
  [manifest](../../output/increment-007-prototype-v2/manifest.json) and source
  `prototypes/increment-007-v2/main.tsx` inspected after deriving expectations from
  R-1–R-6 and AC-1–19, including the user's required-new-project-name amendment.
- Independently recomputed all six V2 hashes: match. All six V1 hashes also match
  its original manifest. Neither prototype was edited.
- [Coordinator observations](../../output/increment-007-prototype-v2/observations.md)
  supply attributed runtime evidence. No analyst browser session, test or build was
  run. The user's existing V2 session was not touched. Frozen artifact stage labels
  predate the approval and this review; this section records the later stage.

### Dispositions against V1 findings

| Finding | V2 disposition | Evidence and remaining acceptance |
| --- | --- | --- |
| R-1 | **Open data-policy decision; no new prototype defect.** | V2 retains the declared token-only sample envelope (`main.tsx:9–11`). It claims no complete codec. D-2 and AC-10/11 still require the explicit supported-data matrix, whole-project completeness and untouched-content preservation through unrelated writes. |
| R-2 | **Open admissibility/decoder decision.** | `fixtureBackup` and `selectFile` (`67–75`) retain illustrative missing-reference/unsupported/corrupt classifications. They establish no complete allowlist, identity/ownership decoder, resource limits or new authoring repair capability. D-3/D-6 remain. |
| R-3 | **Replacement-race interaction addressed; enforcement unqualified.** | `protectCurrent/restore` (`76–84`) clear backup protection, acknowledgement and revision marker after a simulated local change; updated local content remains visible and renewed protection is required. Coordinator observed invalidation. `updated` text is sample machinery, not a production revision token or atomic compare-and-write. D-1/D-4 and AC-14–16 remain; complete renewed replacement was not browser-certified. |
| R-4 | **Resolved as a design-state omission.** | `create` clears loaded content before failed first read (`64`); `restore` retains a previous snapshot only for the same project ID (`83–84`); the `!loaded` body (`95`) shows retained/content-unavailable or initial-open-unavailable with read-only retry. It cannot display the former “No tokens yet” fallback. Coordinator observed creation and absent-restore recovery without duplication or unrelated content. Production behavior still needs AC-6 evidence. |
| R-5 | **Required lifecycle specimens supplied; recovery policy and mechanisms remain proposed.** | `publish/acknowledge/reconcile` (`41–60`) distinguish rejected, known retained/read-failed and unconfirmed outcomes. `busy` and dialog guards prevent duplicate acceptance/dismissal while unknown; recovery is available inside forms/restore. `recoverAccess/retry` (`61/86`) preserve raw dirty inputs; ownership-form recovery preserves name/description. Catalogue/open/backup/download-failure bodies are present. Coordinator observed selected routes, not all scenarios. Reconciliation and owner recovery are simulations; D-1/D-4/D-5 are not resolved. |
| R-6 | **Focused interaction improvements represented; verification remains open.** | Name validation has stable label/error association and focus; form discard guard returns to intact input; replacement Escape returns to preview; guard defaults to Keep editing (`27–28/39` and dialog JSX). Coordinator observed limited name/form Escape/focus and measured477px dialog behavior. Full traversal, actual320px, actual200% zoom, screen reader, physical-device and cross-engine acceptance remain unverified under AC-18. |

### Required project names — AC-19

V2 `create()` (`64`) tests `name.trim()===''` for blankness without replacing the
accepted `name` string. Empty/whitespace inputs remain intact with an associated
error and focus; coordinator observed exact `"  Étude  "` retention. The list uses
stable IDs to distinguish exact duplicate names (`94`); restoration accepts an
existing empty name and uses a truthful fallback (`34/71/75`). Those latter routes
have source evidence but were not all exercised in the recorded browser pass.

This is consistent with the requested new-name direction and the Draft's proposed
nonblank interpretation. It does not settle global Unicode name grammar, require
unique names, or reject old unnamed supported data. The production application
boundary is unchanged, so AC-19 is not implemented or independently runtime-proven.
Approval for this review is not final agreement to the detailed interpretation.

### Remaining recovery-policy boundary

V2 supplies coherent interaction examples without a new material contradiction
requiring another prototype solely for this review. In particular, preserving raw
inputs does not grant permission to overwrite concurrent edits. `recoverAccess()`
refreshes a sample snapshot and enables editing while displaying “Review them before
applying”; it does not model a changed token's old/new comparison, actual exclusive
ownership acquisition, stale-commit prevention or a reapply decision.

Before final agreement, D-4 must define how the retained draft/form is associated
with its original project/entity/revision and what happens when the latest applied
state changes its target, eligibility or value. Preserve the raw input, refresh
coherently, validate against current state, and require deliberate review/reapply
or cancellation where needed; never infer automatic merge or safe takeover from
the recovery button. Any material resulting interaction returns to the user before
renewed analyst review. This is a bounded conflict-policy choice, not authorization
for a merge framework or new token editing capability.

Likewise, V2's unconfirmed-outcome route stores a candidate and simulated answer in
a ref until reconciliation. Its later `publish()` illustrates the visible outcome;
it is not evidence that a real read discovered an earlier committed transaction.
D-1 must define authoritative reconciliation, unresolved/check-failure feedback,
and retry/exit limits. No command-ID ledger, storage protocol or technology is
selected by this specimen.

### Draft update and next decisions

Stable AC-1–19 are retained. AC-5/6/16/19 and their verification are clarified for
outcome checking, snapshot ownership, draft conflict safety and name-error focus;
no criterion is relaxed to fit sample mechanics. D-1–D-6 remain open.

Priorities are (1) supported envelope and restore admissibility (D-2/3),
(2) a bounded technical qualification proposal for acknowledgement/atomicity,
ownership, reconciliation and browsers (D-1/4/5), including the conflict-review
policy above, and (3) version/decoder/resource policy (D-6). Then identify the
resulting final design/contract for user agreement and separate implementation
authorization. This review starts no developer or reviewer phase.
