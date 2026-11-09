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
