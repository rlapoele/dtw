# Current Project Status

> Last updated: 15 November 2026
>
> Phase: Increment 011 coordinated Projects/workbench V2 and React decomposition
> proposals prepared; user review pending
>
> Implementation state: retained React browser workbench, one module worker per tab,
> native IndexedDB/Web Locks, exact independent backups and staged protected restore.
> Applied data is browser-profile/origin local; drafts and forms remain session-only.

## Current focus

The user requested coordinated V2 designs incorporating the agreed scope and
explicitly reiterated React component reorganisation/decomposition. A separate
designer prepared [Projects V2](../project/workbench-layout/projects-shell-v2.md),
[workbench V2](../project/workbench-layout/workbench-shell-v2.md),
[representative states](../project/workbench-layout/v2-state-sheet.svg) and
[React map V2](../project/workbench-layout/component-map-v2.md). The
[011 contract/handoff](../increments/011-responsive-shell.md#coordinated-v2-design-handoff--15-november-2026)
is Draft; application delivery is Not started.

Agreed direction: wide navigation/workspace/inspector, compact split where usable,
full-width narrow browse/inspect with clear Back, minimum 320 CSS px. One token
editor session preserves drafts, invalid input, selection and browsing context.
011 also refines the existing workbench’s full UI into a coherent reviewed baseline.

Projects list selection shows contextual details; explicit opening enters the
token workbench. All project-management controls belong on Projects; the workbench
keeps only Projects navigation for project management plus project context/safety
feedback. The [project-capability inventory](../project/project-operations.md) is
broader than 011 delivery. Undo/Redo is deferred to 012, including controls;
visual grids, editable token Details, relationships/comparison and external
interchange remain later work.

## What V2 proposes and what remains open

Projects V2 shows a catalogue and read-only inspector with Open project/Download
backup, inline Create/Restore and narrow browse/inspect. Workbench V2 refines
existing navigation/list/editor, actions, typography/spacing/copy, status and
current dialogs/recovery. The React map proposes shared shell/header presentation,
ProjectInspector and SelectionBar while retaining page-specific command owners
and the single keyed TokenEditor session. No source reorganisation occurred.

Candidate 1120/880 thresholds, two-step narrow entry, focus/resize/scroll rules,
inline project forms, read-only metadata, narrower row detail and routine-status
consolidation still require user feedback. Moving Request persistent storage to
Projects is proposed. Selected-project backup requires analyst scoping of coherent
snapshot/revision reads and failure/ownership handling; catalogue facts are not a
current revision. Existing Create completion remains create-and-open.

User approval of the identified V2 set **for analyst review is pending**. No analyst
design review, final contract/design agreement or implementation authorization is
recorded. V1 artifacts remain historical inputs and are not the current proposal.

## Evidence and stopping

Coordinator rendered the three static sheets and inspected focused corrections.
[Projects preview](../../output/increment-011-responsive-shell/projects-shell-v2.png),
[workbench preview](../../output/increment-011-responsive-shell/workbench-shell-v2.png)
and [state preview](../../output/increment-011-responsive-shell/v2-state-sheet.png)
are viewing copies; SVGs are editable design sources. Some workbench captions are
clipped in Quick Look despite correct SVG coordinates; no renderer repair campaign
was undertaken. Static art does not establish runtime reflow, keyboard/focus,
exact native control geometry, session preservation or application acceptance.

V2 artifact review stopped at approximately 7/8 additional aggregate minutes,
zero application harness repairs; prior V1 remains stopped at 10/10 (cumulative
planning estimate 17/18). No app tests/build or earlier qualification restarted.
The owning 011 record carries exact scope, evidence and limits. Leave staging,
committing and pushing to the user.

## Earlier delivery and qualification

[Increment 010 is Closed, delivery Partially completed](../increments/010-component-oriented-presentation.md#user-directed-closure--15-november-2026).
S1/S2/S3 source organisation and independent reviews finished; native geometry,
keyboard/focus, recovery/restore and asynchronous-source gaps remain deferred and
unverified. Each stopped at roughly 21/30 minutes and zero harness repairs; none
restarts through V2 planning. [Current delivered ownership](../project/workbench-component-organisation.md)
remains authoritative for actual paths.

009 remains Closed with delivery Partially completed. 007/008 remain Completed on
their recorded user-reported manual acceptance. The
[007 deferred qualification register](../increments/007-local-retention-and-backup.md#deferred-qualification)
retains earlier exceptional/resource/lifecycle/HTTPS/accessibility/engine limits;
its stopped campaign has zero remaining authorized allowance. Chrome remains the
automated baseline; broader engines follow the fully featured PWA. Install/offline
PWA acceptance, interchange and Electron remain later work.

## Next meaningful action

Present coordinated V2 and React map to the user and collect design feedback.
Material revisions return to the user before analyst review. After explicit
approval of an identified design set for analyst review, the analyst must reconcile
Projects scope, backup coordination, acceptance and the broader UI verification
plan. Final contract/design agreement and implementation authorization follow;
preparing V2 grants neither.

## Resume

Read AGENTS.md, this handoff, actual Git state, the 011 V2 handoff and design/map
artifacts. Use [README](../../README.md) for commands and delivery limits. Earlier
[pre-010-closure status](history/2026-11-15-increment-010-before-closure.md) preserves
historical handoff detail; authoritative increment records own acceptance gaps.
