# Increment 007: local retention, reopening and project backup

- Contract status: Draft — design-stage brief; analyst contract not yet prepared.
- Delivery status: Not started — production implementation is not authorized.
- Design stage: direction agreed; isolated V1 prototype prepared for user review.
- Baseline: maintenance committed as `4171dbc`.

## Outcome and agreed direction

On 9 November 2026, the user agreed the designer's recommended direction for
returning to applied work and recovering projects independently of browser-managed
retention. The user subsequently authorized an isolated prototype, to be shown
before analyst review. This agreement is not final contract/design agreement or
implementation authorization.

- Automatically retain applied project/token/group changes. Preserve Apply/Cancel
  as the editing decision without adding a separate project Save action.
- Report write success after required retention acknowledgement. On write failure,
  preserve the prior applied state and entered draft/form. A successful write
  followed by failed readback must remain distinguishable from a rejected write.
- Start at a small Projects in this browser view: New project, retained projects,
  Restore backup. Open one project at a time, with a quiet return to Projects.
- Retain applied authored data with exact values, metadata, stable identities and
  aliases. Unapplied literal/reference drafts and unfinished forms remain
  session-only; protect them on project departure. Backups exclude these drafts
  without applying or discarding them.
- Download independent versioned project backups, distinct from named-profile
  export. Staged restoration validates and previews before acceptance, preserving
  supported authored content including protected and inspect-only data.
- Preserve identities when restoring. An existing project identity requires an
  explicit choice to open local, review complete replacement or cancel. Matching
  names alone do not establish identity. No automatic merge, overwrite or copy.
- Review replacement with protection of current applied data and explicit
  acknowledgement. Cancellation or failed acceptance must leave it unchanged.
- Distinguish structurally unsupported/unreadable backup content from supported
  repairable domain diagnostics; the exact admissibility rules need analyst work.
- Design for one writable tab per project with other tabs inspect-only. Actual
  enforcement, crash recovery and stale-write detection remain unvalidated.

## Agreed architecture direction

The user separately agreed [the application boundary direction](../project/architecture.md#increment-007-read-and-write-boundary-direction): explicit
read/write application interfaces, one authoritative retained state, coherent
loaded snapshots for inspection, and atomic writes owning validation, concurrency
and acknowledgement. Commands may read to validate. Queries must not mutate
authored project data. No separate databases, generic dispatchers, event sourcing
or independently synchronized read model is selected.

The user also agreed to leave a route to future undo/redo through explicit atomic
writes and accepted before/after state available at the application boundary.
History storage, inverse commands, undo UI, granularity and history lifetime are
outside Increment 007. No history framework is authorized.

## Scope boundaries and unresolved decisions

The prototype explores navigation, information hierarchy, draft protection,
retention/recovery feedback, staged backup restoration and replacement. Its data,
file examples and failures are simulations, not delivered retention or a schema
decision. It must not select browser storage, canonical persistence format,
runtime validation library, migration policy or concurrency implementation.

Resolve through analyst/technical work before implementation agreement:

- Durable asynchronous acknowledgement and atomic failure/readback semantics.
- Browser persistence, catalogue and single-writer ownership boundaries.
- Versioned backup representation, validation/resource limits, supported content,
  repairable diagnostic acceptance and unsupported-version behavior.
- Safe replacement and the precise protection/acknowledgement flow.
- Supported browser capabilities and verifiable failure/recovery acceptance.

Token compatibility-profile interchange, cloud/account/sync features, installation
and offline acceptance, Electron, copy/merge, durable drafts and undo/redo remain
outside this increment. [Open questions](../planning/open-questions.md#persistence-and-project-structure)
retain the broader unresolved choices.

## Design proposal and review stages

- Designer assessment: source-based recommendations presented in this chat; user
  agreed direction before any prototype edit. No live storage qualification claimed.
- Prototype: [interactive V1 design notes](../../prototypes/increment-007-v1/DESIGN-V1.md)
  identify viewing instructions, interactions, sample-only behavior and unresolved
  details. [Coordinator observations](../../output/increment-007-prototype-v1/observations.md)
  record scoped browser/build evidence and limits. V1 is presented for user review;
  actual retention, concurrency and schema guarantees are not implemented.
- User review of V1: pending. Direction approval is not approval of this artifact.
- Approval for analyst review: pending; do not send V1 to the analyst yet.
- Analyst review and numbered acceptance criteria: not started.
- Final contract/design agreement and implementation authorization: pending.

Material revisions return to the user before analyst review. The designer owns
only the isolated prototype; production code, dependencies and historical
prototypes remain unchanged. Staging, commits and pushes remain with the user.

## References

- [Vision](../project/vision.md), [product concept](../project/product-concept.md),
  [principles](../project/principles.md), [architecture](../project/architecture.md).
- [Visual direction](../project/visual-direction.md),
  [presentation conventions](../project/presentation-conventions.md).
- [Conceptual model](../design-tokens/conceptual-model.md),
  [interoperability](../design-tokens/interoperability.md),
  [workflow](../workflow/agent-roles.md).
