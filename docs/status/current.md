# Current Project Status

> Last updated: 15 November 2026
>
> Phase: Increment 010 second-slice planning; first slice committed and pushed;
> earlier native-browser acceptance remains unverified
>
> Implementation state: retained React browser workbench, one module worker per tab,
> native IndexedDB/Web Locks, exact independent backups and staged protected restore.
> Applied data is browser-profile/origin local; drafts and forms remain session-only.

## Current focus

**Next-slice planning — 15 November 2026:** the user reported committing/pushing
the first slice and instructed “Proceed”; repository HEAD is `32ec593` with a clean
working tree before planning. A separate analyst is defining the
[workbench shell/workspace slice](../increments/010-shell-and-workspace-slice.md)
as a Draft amendment. It advances named component folders and colocated owners
while preserving the existing UI and editor/session lifetimes. Exact scope needs
agreement before source moves; the replacement interface remains future work.
The first slice's recorded browser gaps and stopped checks remain unchanged.
The second-slice draft is ready for user review: exact moves plus toolbar/footer
extractions, five acceptance criteria and an explicit shared identity-label helper
owner. Planning checks passed 41 local links and whitespace; approximately eight
aggregate minutes, zero repairs, stopped. No further source moves or application
checks occurred.

The user agreed Increment 010's first-slice contract and authorized implementation
on 15 November 2026. The [implementation handoff](../increments/010-component-oriented-presentation.md#first-slice-implementation-handoff--15-november-2026)
records delivery **Partially completed**: source migration and fresh independent
review are finished with no actionable defects, while native-browser/focus/compact
acceptance is not fully observed.

Delivered: seven generic controls under `ui/`, host/project hooks under `app/` and
`projects/`, cross-screen restore under `project-backup/`, and project-screen/list/
item/form/recovery presentation extracted from App. App retains unconditional
hooks, host/state/ref/dialog authority and the Workbench project-ID key. Remaining
Workbench/navigation/editor changes are moved-module imports only. The
[current ownership map](../project/workbench-component-organisation.md) documents
this deliberate partial migration; the full target tree is not yet implemented.

## Evidence and limits

The [010 contract/handoff](../increments/010-component-oriented-presentation.md)
owns acceptance and accounting. The developer reports 39 focused tests passing and
one final build passing four typechecks plus bundling; the existing >500 kB chunk
advisory remains. The [source patch and 58-entry manifest](../../output/increment-010-first-slice/review-source-manifest.json)
identify the stable review snapshot against `717c08e`. A fresh
[independent source review](../../output/increment-010-first-slice/reviewer.md)
confirmed snapshot integrity, preserved ownership/markup and import-only workbench
changes, with no actionable implementation findings.

[Bounded in-app Chromium observations](../../output/increment-010-first-slice/browser-observations.md)
cover required-name focus, project/token creation, invalid draft preservation,
All content, Keep editing, Cancel/return and reopening retained content. They are
not native Chrome qualification. Dedicated Chrome control and screenshots were
unavailable; the requested compact viewport was not established. Native restore
file/cancel/replacement, unknown-write Review/Stay/Leave focus, exact geometry and
full keyboard/focus acceptance remain explicitly unverified. No alternate harness,
profile change, connector install or qualification restart was attempted.

Checks stopped at approximately 21 of 30 aggregate verification minutes (estimate),
zero harness repairs. Unused time does not authorize automatically continuing
past the recorded stop; the owning handoff explains the tool limits. Source/tests
remained frozen after independent review; coordinator handoff/report edits followed
before the user committed and pushed the result as `32ec593`. Agents did not stage,
commit or push.

## Direction and roadmap

- [Presentation organisation proposal V1](../project/workbench-layout/presentation-organisation-proposal-v1.md):
  endorsed destination without the single-feature wrapper; named component
  subtrees, colocated hooks/helpers and generic UI.
- [Annotated map V1](../project/workbench-layout/component-map-v1.md) and
  [layout/original mockups](../project/workbench-layout/README.md): responsibility
  guidance and visual direction, with known generated-image limitations.
- [010 roadmap](../increments/010-component-oriented-presentation.md#delivery-direction):
  later shell/workspace and inspector/display reorganisation, responsive shell,
  visual browsing, Details editing and relationships/previews remain scoped future
  work. No future components, interactions, increment numbers or delivery order
  beyond the agreed first slice are implicitly committed.

Architecture, presentation conventions and open questions keep their authority.
Backup remains distinct from interchange; no new adapters, types, variation
comparison, persistent drafts, state library or host capabilities were added.

## Earlier increments and deferred qualification

Increment 009 is **Closed by user instruction**, with delivery Partially completed.
Its [closure record](../increments/009-workbench-usability-and-component-boundaries.md#user-directed-closure--15-november-2026)
retains outstanding checks as deferred/unverified rather than user-reported passes.
010 does not reopen that work or transfer every old evidence gap into a new gate.

Increments 007/008 remain completed on their recorded manual acceptance. The
[007 deferred qualification register](../increments/007-local-retention-and-backup.md#deferred-qualification)
retains large-source, adversarial-resource, exceptional lifecycle, deployed HTTPS/
CSP, dedicated accessibility and additional-engine gaps. The in-page Find API
visibility observation remains unresolved, not proof that native browser Find
fails. Chrome remains the automated baseline; broader engines follow the fully
featured PWA. No old campaign restarts through new agents, snapshots or folder
moves; the stopped 007 campaign has zero remaining authorized allowance.
Install/offline PWA acceptance, token interchange and Electron remain later work.

## Next meaningful action

Review the second-slice Draft's exact moves, exclusions and acceptance criteria;
record scope agreement and implementation authorization before further code moves.
This does not start later inspector/display migration or new interface features.

User review of the delivered 010 first slice and its explicit native-browser
acceptance gaps. Do not mark Completed solely from source/tests or silently waive
unobserved criteria. A bounded automated follow-up needs explicit authorization;
manual checks use disposable data. Later roadmap slices require their own bounded
agreement before code changes. Leave staging, committing and pushing to the user.

## Resume

Read AGENTS.md, this handoff, actual Git state and the 010 contract/report. Use the
[README](../../README.md) for commands and delivery limits. The
[outgoing pre-010 snapshot](history/2026-11-15-before-increment-010-planning.md)
preserves earlier chronology. Existing evidence and unused budget do not authorize
implementation of later slices or restarting stopped qualification.
