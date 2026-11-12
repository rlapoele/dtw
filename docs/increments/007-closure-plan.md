# Increment 007 — concise closure plan

## Closure disposition — 12 November 2026

**Increment 007 is Completed** following the user's successful manual acceptance and
explicit instruction to close with remaining checks deferred, without restarting
automated qualification. The [closure amendment](007-local-retention-and-backup.md#closure-and-qualification-amendment--12-november-2026)
and [deferred qualification register](007-local-retention-and-backup.md#deferred-qualification)
own the current disposition. Uncompleted portions of earlier completion prerequisites
below are deferred, not passed. No new run, repair, deployment or next increment is
authorized. The earlier plans and results below retain their historical meaning;
they are not instructions to resume stopped work.

**Adopted as amended — 10 November 2026.** The user's latest instruction authorizes
Increment 007 implementation with Chrome automation and user manual Chrome/Firefox
tests. Broader engine qualification follows the fully featured working PWA and is
not a completion blocker for this increment. The
[agreed contract](007-local-retention-and-backup.md) and
[B-3/B-4 amendment](007-production-scheduling-and-browser-scope-proposal.md#current-b-3b-4-amendment--10-november-2026)
own the current authorization and scope.

## Current position and decisions retained

Production is still session-only. Research establishes useful subsets: exact codec
admission (including the revised description boundary), native worker/storage/lock
mechanisms, normal Safari restart/file observations, and 65 small-fixture Chrome
storage/concurrency cases. These are inputs to implementation, not delivered ACs.
The [gap plan](007-qualification-gap-plan.md) owns evidence and residual gaps.
Safari readiness now passes, but pending-command supervision does not: the first
close probe timed out and execution finished naturally. G-02 remains unsatisfied.

Keep P-1–P-4, S-1–S-6, F-1–F-5, B-1–B-5 and E-1–E-4, subject only to the explicit
browser scope and timing amendment below. Retain one application worker per tab, authoritative IDB,
strict completion acknowledgement, Web Locks, exact authored data, session-only
input/recovery and normal-profile native Chrome for current automated acceptance.
User manual testing may use Chrome or Firefox; additional engines are deferred. Preserve
the complete current list/inspector, current description wrapping, V3 revision-2
retention/recovery flows and the V4 source-disclosure supplement.

## Adopted readiness and design dispositions

1. **B-4 amended: implement now.** Remaining mechanism, rendering/projection,
   native-access, lifecycle and HTTPS evidence is collected against the actual app
   where possible and remains required Chrome completion/support evidence. Admission
   caps, exactness, safety stops and performance/acceptance budgets are unchanged.
2. **B-3 amended: Chrome automation, Chrome/Firefox manual tests.** Additional engine
   qualification is deferred until the PWA is fully featured and working. Safari
   G-02/G-03/G-04 are future work; no Safari setup, watchdog probe or test is required
   now. This explicit scope amendment removes their current blocker status without
   upgrading failed/incomplete historical evidence.
3. **Contract/design agreed and implementation authorized by the latest instruction.**
   Adopt [V3 revision 2](007-v3-analyst-review.md#revision-2-recheck--9-november-2026)
   and [V4](007-v4-analyst-review.md), integrated with the current production list/full
   inspector and current description wrapping. Reject empty/whitespace-only new
   project names, preserve accepted exact text, permit duplicates and retain support
   for reopening/restoring supported unnamed data. Earlier analyst-review approvals
   are not retroactively described as final approval. No new prototype is required
   unless integration exposes a material design gap.

## Five observable delivery slices after authorization

| Order | Deliverable and end criterion | Contract coverage |
| --- | --- | --- |
| 1 | **Retain and reopen a project.** Establish asynchronous application ports, worker host, native storage/ownership and common exact admission/codec. Projects distinguishes loading/empty/unavailable; acknowledged named creation survives a fresh session with identical IDs/data. Rejection creates no partial record; required-capability failure fails closed. | AC-1/2/4/7/17/19/21 |
| 2 | **Integrate every existing authoring command and coherent reads.** Project/group/token creation, group rename and color revision use atomic revision-checked acceptance. Preserve accepted before/after state, all existing controls, independent raw sessions and untargeted content. Distinguish rejected, unknown and retained/read-unavailable outcomes from the outset; response fences prevent cross-project publication. Include All content and bounded selected inspection without eager full-project renderer work. | AC-3–7/9/17/18/20/21/24 |
| 3 | **Download and restore independent backups.** Exact supported applied state survives an empty-origin round trip; drafts stay excluded. Stage decoding/preview without writes; absent-ID restore and same-ID complete replacement require explicit choices. Backup plus acknowledgement protects the exact local revision; concurrent change invalidates protection. Apply the same description/resource rules at authoring, retained load, backup and restore. | AC-9–15/18/21 |
| 4 | **Complete recovery, concurrency and departure flows.** Exercise worker/ownership loss, stale baselines, commit/readback failure, same-attempt Check, reset/upgrade and late results across every mutating form/dialog. Preserve input; deliberate review/reapply never silently rebases. Prove safe departure fencing, one-time completion, competing creates/restores, final-slot capacity and replacement races. | AC-4–8/14–16/18/22/23 |
| 5 | **Qualify the actual application and review a stable snapshot.** Complete the amended Chrome mechanism/support matrix and AC-1–24, integrating earlier positive evidence only where still applicable. Check normal profiles, actual delivery HTTPS/CSP and loopback, native files/restart/lifecycle, keyboard/focus/compact/200% zoom, exact-source native selection/copy/Find/AT and full authoring regressions. Run performance/resource boundaries under proven safe supervision; resolve findings with a fresh independent reviewer. | AC-1–24; B/E/F gates |

The slices are implementation order, not permission to postpone truthful outcomes,
atomicity or input preservation until slice 4. Use one developer at a time and
separate analyst/reviewer handoffs under the [role workflow](../workflow/agent-roles.md).

## Evidence to finish, and research to stop

Actual application latency, renderer/clone/DOM costs, recovery dialogs, all mutators,
file flows and baseline fidelity are best checked on the integrated application.
The adopted B-4 amendment moves remaining mechanism/native/source prerequisites
to actual-application completion evidence in the current Chrome scope.
Credit unchanged reviewed evidence; keep failures/inconclusive samples frozen.
The 65,004-unit token-description investigation is retired under the inclusive
1,024 decoded UTF-16-unit amendment. Stop automatic expansion of standalone
synthetic studies, alternate viewers and wrapping comparisons. A new isolated
experiment needs a specific remaining claim, finite stop rule and authorization.

Completion requires all ACs and required gates satisfied, not merely code present:
100/1,000-token command p95 ≤250/1,000 ms; typical/large catalogue and codec ≤2,000 ms;
ordinary renderer tasks ≤100 ms; qualifying exceptional source only ≤250 ms/task
and ≤5 s/action. Preserve F-4/5 intersections, 10,000 tokens, 2,000 groups,
25×8 MiB catalogue and the external 30-second per-stress-case stop. Capture agreed
warm-up/20-run distributions and separate cold samples; publish exact passing builds.
Safari qualification is deferred; future stress work still requires proven safe
supervision. Uninducible native events need explicit gate/support disposition, never an inferred pass. Any unmet
requirement returns a concrete fix or user-agreed amendment before completion.

Finish with the reviewed completion report, accurate support/retention limitations
and status handoff. Suggested focused commit: `docs: authorize increment 007 Chrome development`.
