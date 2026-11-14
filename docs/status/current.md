# Current Project Status

> Last updated: 15 November 2026
>
> Phase: Increment 010 planning; first-slice contract Draft; implementation not started
>
> Implementation state: retained React browser workbench, one module worker per tab,
> native IndexedDB/Web Locks, exact independent backups and staged protected restore.
> Applied data is browser-profile/origin local; drafts and forms remain session-only.

## Current focus

The user directed closure of Increment 009 and opening Increment 010, starting with
presentation-code reorganisation using the endorsed component decomposition and
folder proposal. The [010 roadmap and first-slice contract](../increments/010-component-oriented-presentation.md)
are Draft. Starting planning is not agreement to the resulting contract or
implementation authorization. No application code has been moved or changed.

The proposed first slice establishes shared UI/backup roots and extracts the
existing project-entry presentation from App, retaining current host, project,
restore and departure lifetimes. Workbench/editor reorganisation follows as
roadmap-level slices; the replacement responsive shell, visual inventory,
Details editing, relationships and contextual preview remain future scoped work.
The roadmap does not commit all future component names, behaviors or increment
numbers. See the contract for exact scope, acceptance and verification limits.

## Authoritative references

- [Presentation organisation proposal V1](../project/workbench-layout/presentation-organisation-proposal-v1.md):
  user-endorsed target tree without the single-feature wrapper, named component
  subtrees, colocated hooks/helpers and generic UI. It replaces the earlier
  decomposition map's proposed paths, not the current source tree.
- [Annotated component map V1](../project/workbench-layout/component-map-v1.md):
  all four saved annotated derivatives, shared IDs and responsibility guidance.
- [Layout direction and original mockups](../project/workbench-layout/README.md):
  visual library, relationships, compact desktop and mobile browse/edit direction;
  proposed interactions and known generated-image inconsistencies remain explicit.
- [Current ownership map](../project/workbench-component-organisation.md): delivered
  components and single editor-session ownership before any 010 migration.
- [Presentation conventions](../project/presentation-conventions.md),
  [architecture](../project/architecture.md),
  [open questions](../planning/open-questions.md) and
  [agent workflow](../workflow/agent-roles.md) retain their authority.

## Increment 009 closure

**Lifecycle Closed by user instruction on 15 November 2026; delivery remains
Partially completed.** Implementation and independent review, including both
closure phases and the slider extension, are finished. The
[closure record and deferred acceptance](../increments/009-workbench-usability-and-component-boundaries.md#user-directed-closure--15-november-2026)
end the active handoff cycle without claiming the user executed every outstanding
manual check or that unverified criteria passed. Earlier pending-review prose in
historical handoffs is superseded by this closure record.

Remaining session/focus/departure, exceptional disclosure/Find, exact backup
roundtrip, post-extension viewport and rare-recovery evidence stays deferred as
recorded there. No demonstrated new defect is inferred from these evidence gaps.
They do not become mandatory replay of an old campaign in 010, but any later
change must still verify its own affected behavior within its agreed scope.

Original 009, Phase 1, slider-extension and Phase 2 verification consumption and
stopping decisions remain in the owning increment. None is reset or restarted.
Historical tests, builds, reviews and Chrome evidence identify their original
snapshots; closure/planning ran no new application checks.

## Earlier completed increments and qualification

Increments 007 and 008 remain completed on the recorded user-reported manual
acceptance. Browser retention is local to one normal profile/origin; drafts and
forms remain session-only. Chrome is the automated baseline; broader engines
remain deferred until the fully featured PWA. No new support claim is made.

The [007 deferred qualification register](../increments/007-local-retention-and-backup.md#deferred-qualification)
continues to own large-source/adversarial-resource, exceptional lifecycle,
deployed HTTPS/CSP, accessibility and broader-engine gaps. The recorded in-page
Find API visibility observation remains unresolved, not proof that native browser
Find fails. No old campaign restarts through a new agent, snapshot or folder move;
the stopped 007 campaign's remaining authorized allowance remains zero.
Install/offline PWA acceptance, interchange and Electron remain later milestones.

## Next meaningful action

User review of the 010 roadmap and detailed first-slice contract. Resolve any
material scope choices and record agreement/implementation authorization before
starting source edits. Later implementation uses one developer followed by a
fresh reviewer on an identified stable snapshot; this planning task does not
start either role. No replacement-interface design review is implied by drafting
a behavior-preserving reorganisation contract.

Staging, committing and pushing remain with the user. Future verification uses the
010 contract's scoped allowance only when implementation is authorized, preserving
prior stop decisions and deferred qualification.

## Evidence and continuity

This closure/planning task changes documentation only. Its bounded checks are
source/prose consistency, local links and whitespace; no application tests,
builds, browser sessions or qualification runs are part of this task. The 010
contract records planning-review effort separately from any future implementation
allowance.

The [010 planning handoff](../increments/010-component-oriented-presentation.md#planning-handoff--15-november-2026)
records the separate analyst draft, coordinator review, 117 successful local-link
checks and whitespace checks. Planning review stopped at approximately nine of ten
aggregate minutes, zero repairs. The first-slice implementation allowance is
proposed and inactive; no source migration or application verification has begun.

The [outgoing handoff snapshot](history/2026-11-15-before-increment-010-planning.md)
preserves the previous chronology; owning increments and Git retain detailed
evidence. The [pre-008 closure snapshot](history/2026-11-12-increment-008-before-closure.md)
remains available for earlier context.

## Resume

Read AGENTS.md, this handoff, actual Git state and the 010 draft/agreement. Use the
[README](../../README.md) for commands and delivery limitations. Draft status,
visual endorsement, historical evidence and a continuity request do not authorize
implementation or qualification on their own.
