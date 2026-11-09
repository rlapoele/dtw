# Increment 007 — post-qualification design assessment

**Direction approved for V3 prototype preparation · 9 November 2026.**
Assessment baseline: clean `dev` at `12fa814`. This document proposes the smallest
material additions to V2; it approves no design, prototype edit or implementation.
V2 was subsequently approved **for analyst review**; historical “review pending”
labels in its frozen artifacts describe their preparation, not current authority.
The increment contract remains Draft. Agreed coverage, storage and F-1–F-5 policies
are constraints; Stage A is partial mechanism qualification, not product delivery.

## Recommendation and decision

**Subsequent user authorization:** after committing this assessment as `50d9f67`,
the user approved the recommended direction and authorized a separate V3 prototype.
Show the actual artifact to the user before renewed analyst review. This authorizes
prototype preparation only; final design/contract agreement and production
implementation remain pending. The original recommendation below is preserved.

Keep the existing Projects/workbench/inspector and staged restore design. Prepare
one bounded **V3 supplement** showing local resource feedback, deliberate recovered
draft review, unresolved-result departure, and diagnostic-content inspection.
Reuse existing status, field-error, details and departure surfaces; add no routine
error dialogs, recovery dashboard, storage setting or general repair workflow.

**Decision requested:** approve this scope and the proposed interaction direction
for a separate V3 prototype pass, or identify changes first. Approval would authorize
that prototype only. Present V3 to the user before seeking renewed analyst review;
final contract/design agreement and implementation authorization remain separate.
An annotation-only supplement would be cheaper, but cannot adequately demonstrate
review/reapply and guarded departure. I recommend the interactive supplement.

## Evidence and confidence

Read the [Draft contract](007-local-retention-and-backup.md),
[V1 review](007-design-review.md), agreed [coverage/admissibility](007-backup-coverage-and-restore-policy-proposal.md),
[storage/recovery](007-storage-acknowledgement-and-concurrency-proposal.md),
[format/resources](007-format-decoder-and-resource-proposal.md) and
[qualification plan](007-storage-concurrency-qualification-plan.md).
Used [V2 notes](../../prototypes/increment-007-v2/DESIGN-V2.md),
[source](../../prototypes/increment-007-v2/main.tsx), attributed
[observations](../../output/increment-007-prototype-v2/observations.md) and retained
[first-read](../../output/increment-007-prototype-v2/first-read-unavailable.png)/
[replacement](../../output/increment-007-prototype-v2/replacement-changed.png) screenshots.
Inspected the [accepted Precision reference](../project/visual-direction.md),
[presentation conventions](../project/presentation-conventions.md), product vision,
concept, principles, architecture, open questions and interoperability boundaries.

The [Stage A report](../../output/increment-007-stage-a/report.md) and
[independent review](../../output/increment-007-stage-a/independent-review.md) preserve
the synchronous maximum codec failure: up to 229 ms against the 100 ms target.
The worker trial preserved exactness with no observed Chrome main-thread long tasks;
production placement/scheduling remains a recommendation requiring its own decision.
It should not become a user setting or appear as worker/protocol jargon in feedback.
No additional browser-support, lifecycle or maximum-capacity promise follows.

This assessment uses documents, source and retained images only: no fresh browser,
usability, keyboard, screen-reader, responsive or performance test was performed.
No server/tab was assumed available or touched. Confidence is high in the policy
gaps and moderate in the proposed interaction clarity pending an actual V3 review.

## What V2 already contributes

Keep its required new-project name error, exact accepted text, duplicate-name
distinction, existing unnamed-project fallback, explicit Apply/Cancel and independent
backup explanation. Required names concern **new projects only**, not restored data.
Keep staged whole-project restore, identity collision choices and current-revision
backup/acknowledgement invalidation. Keep failed-write input preservation, inspect-only
access, coherent stale snapshots and the separate unavailable first-read body.
These are useful specimens, not qualified production behaviors or a complete codec.

V2 preserves raw drafts on access recovery but immediately re-enables Apply after
refresh; it does not show old/current/draft comparison when the baseline changes.
Its unresolved-outcome simulation blocks departure indefinitely and always resolves
on check. Its token-only fixture cannot demonstrate inaccessible groups, full agreed
value coverage, resource distinctions or incomplete reports. Those are the additions.

## Resource states: show the consequence where the action happened

| State and trigger | Explanation and action | Preservation and focus |
| --- | --- | --- |
| Incoming backup exceeds an admission limit during selection/classification | In restore: “This backup exceeds the supported limit. No project was changed.” Primary **Choose another file**; secondary existing Cancel. Details identify the limit, bounded location and observed value where known. | Reject the whole candidate; preserve the selected source and all prior retained work. No restore/replacement action for a failed preview. Keep focus at file feedback/selection; associate the error, do not open a new dialog. |
| Ordinary Apply/Create/Rename would exceed a complete-candidate limit | Beside the action: “This change exceeds the supported limit. Nothing was applied.” Primary return to the preserved fields to revise; secondary existing Cancel/discard behavior. Do not suggest deleting groups or splitting backups. | Prior applied/retained state and exact raw form/draft remain. Validate the whole candidate and emitted backup representation; never accept only the edited part. Keep focus in the form/editor and associate feedback. |
| Retained record is over budget or outside the supported envelope | Existing unavailable body: “This project exceeds the supported size. Its retained data was left unchanged.” Primary **View details**; secondary **Projects**. Backup refusal explains that a complete backup cannot be prepared. Retry reading belongs only to a separately retryable read failure, not an unchanged deterministic limit. | No empty-project claim, partial load or successful backup claim. Keep an available prior same-project snapshot explicitly stale/read-only, otherwise show no content. Focus follows the existing open/read-error pattern. |

The retained-state message must distinguish size from unsupported version/content
and malformed data. “Invalid project” is wrong for otherwise valid over-budget data.
Details may show technical measurements; routine headings need no token/task counts.
State string limits in UTF-16 code units, bytes as bytes, and entity limits by kind.
Over-limit entered text must remain exact: native `maxlength` must not silently truncate
pasted input. The 25-project refusal offers no delete/clear-storage workaround;
replacement of an existing identity does not create capacity for a different project.
Backup representation failure blocks the **whole** backup; keep input readable where
already safely available, with native selection, without inventing raw-export/copy tools.

For a valid authored AST whose derived evaluation exceeds its work/output budget,
use the inspector's resolved-value area: **“Resolved value unavailable”**, followed
by “This calculation exceeds the supported evaluation limit. The authored value is
unchanged.” Primary **View authored value** opens the existing details; secondary
is ordinary navigation. Preserve the exact AST/aliases and whole-project backup
eligibility. Do not mark the expression invalid, flatten it or offer auto-repair.
Only the unavailable derived representation/controls are disabled; normal per-token
eligibility and accepted-data preservation remain separate. No automatic retry loop.

If a report reaches its display budget, retain readable available diagnostics and
show **“Some diagnostics are not shown.”** Details explain the display limit; do not
invent a total or an all-clear result. The existing entity selection is the way to
inspect another record. No “show everything” control may bypass the agreed budgets.
This is display-only: complete bounded structural/admissibility checks still run;
truncation never converts a rejected candidate into an admissible one. Keep focus
stable and announce the incomplete status once, without announcing each item.

## Recovered input: review before a new submission

Keep every input tied to its original project, entity kind/ID and baseline. Access
recovery and coherent reading are separate from permission to submit that input.
No automatic apply, rebase, merge, retargeting or reconstruction of a removed entity.

| Recovery state and trigger | Explanation and primary/secondary actions | Safety and keyboard/focus |
| --- | --- | --- |
| Access restored; authored baseline identical | “Latest applied state checked. Your unapplied edits are still here.” Existing explicit **Apply** / **Cancel**, subject to validation and eligibility. | Preserve all independent literal/reference drafts, raw text and display choices; refresh the internal base only after equality is established. Do not submit on recovery. Keep focus on the initiating recovery control or retained field. |
| Latest authored baseline changed for a recovered literal/reference draft | Show the changed-baseline notice and primary **Review edit**, which opens **Previously applied**, **Currently applied**, **Your unapplied edits** in the inspector. There, **Reapply changes** is the single submission action; existing explicit **Cancel** discards through the established behavior. | Compare exact authored literals, or reference target identity/path and current eligibility; derived swatches alone are insufficient. Never substitute a resolved literal for an alias. Preserve both draft modes, including invalid text. Reapply builds/validates a fresh whole candidate against latest revision; another change returns to review. Focus review heading, then allow ordinary Tab traversal; no automatic submission. |
| Unfinished create or group-rename form after changed project state | Keep the existing dialog/fields with “Project content changed. Review before submitting.” Primary **Review changes** exposes current target/parent context and unchanged entered fields; then explicit **Create** or **Rename**. Secondary **Keep editing** / guarded Cancel. | Recheck exact parent/target identity, eligibility and full candidate. Group rename shows old/current group name plus entered name; token/group creation shows the exact selected parent, never a same-name substitute or root fallback. A new-project form has no existing project baseline: preserve its name and recheck absence/capacity on submission, without inventing project rename. Focus the review section; return to preserved field on Keep editing. |
| Original token/group/parent removed or now ineligible | “This edit can no longer be applied to its original target.” State the specific removal/type/layer/eligibility reason. Primary inspect preserved input; secondary explicit **Discard edits** through the existing guard, then select current content. | Keep raw text and reference identity readable/selectable even when mutation controls are unavailable; use read-only fields where suitable. No recreation, conversion or replacement target selection as a recovery shortcut. Focus the reason/review heading; Escape keeps input, never discards it. |

Review is a deliberate user step, not a new diff/history feature: compare only the
live recovery baseline/current state/input needed for this attempt. Ordinary editing
still uses the accepted inspector. Normal authoring checks the whole namespace and
reference graph; an eligible color repair can still fail because other errors remain.
Do not make diagnostic projects globally read-only or introduce progressive repair.
**Review edit** only opens the comparison; **Reapply changes** performs the one write.
There is no additional Save/confirmation step or inert Keep reviewing action.

## Unknown result, failed check and honest departure

For a dispatched attempt with no confirmed result, retain V2's **Check retained
result**, block affected writes and duplicate submission, and preserve raw input.
Add the missing failed-check branch: “The result is still unconfirmed. Your input
remains in this tab.” Primary check again; secondary **Review before leaving**.
Do not describe missing evidence, a later revision or failed read as rejection.

Review before leaving reuses the existing departure guard, initially focusing
**Stay here**. Explain: “The change may already have been retained. Leaving discards
unapplied input in this tab. Reopen to inspect the latest retained state; this change
will not be submitted again.” Secondary explicit **Leave project** completes guarded
in-app departure only once future dispatch is fenced under the agreed application
policy. It does not promise to cancel an issued write; if safe departure cannot yet
complete, say so and retain Stay here/check controls. Browser reload/close remains
possible and can lose drafts; the native warning is best effort, never a recovery promise.
Safe in-app exit eligibility and suppression of late publication into another project
are application/protocol dependencies still requiring integration qualification, not
facts established by this design. Leaving must not enable an unsafe retry of the attempt.

During pending work, use truthful **Preparing…**, **Applying…**, **Checking…** or
**Preparing backup…** at its action, with a quiet status and duplicate actions disabled.
Do not add percentage progress without evidence. Offer cancellation only where the
application can prove pre-dispatch prevention; no Stop/Cancel implying rollback after
dispatch. This is separate from cancelling a draft or closing a completed read flow.

Known retained plus unreadable content stays distinct: complete that accepted
attempt once, label previous same-project content stale or use V2's unavailable body,
and offer **Retry reading** / guarded **Projects**. Never offer Apply/Restore again.
Keep unrelated live drafts; do not resurrect the already completed candidate as dirty.
A readable coherent snapshot may support an independently labelled backup only when
its revision is known and the complete backup policy passes; an unavailable record
cannot be claimed backed up. A stale backup cannot protect a newer replacement.
Recovery/check feedback stays inside an already open form/restore dialog too, with
no focus jump behind it. Failed check keeps focus available on its retry action;
Escape from the departure guard returns to the intact originating input.

## Identity-safe inspection beyond the V2 token specimen

Recommend one **All content** navigation entry reusing the current central list and
inspector, with token/group kinds visibly distinguished. Make it always available
as a quiet secondary entry immediately below **All tokens** in project navigation:
stable placement makes diagnostic recovery discoverable without replacing healthy
namespace navigation. A namespace-issue notice links directly to it when needed.
Include every admitted group/token once, independent of ancestry, including empty/
unreachable groups. Never invent groups, reparent records or fabricate a partial
path; show “Path unavailable” with its reason. Healthy projects retain usual navigation.
This bounded inspection is needed by agreed coverage, not a group-management feature.

Use readable names with full exact project/kind/ID in details and collision-safe
choice labels. Empty, whitespace and separator-containing IDs are valid opaque data;
represent absence separately, preserve exact code units, and provide an escaped
readable identity representation where otherwise invisible. Do not trim, normalize,
generate IDs or use names/paths as keys. Selection and keyboard activation must reach
all admitted records, including IDs reused across kinds/projects. Raw authored data
and available diagnostics remain readable with native selection in the same inspector.
Component-associated tokens show “Component ownership context is unavailable and
has not been verified,” remain inspect-only, and retain the exact association.
No component-definition editor, repair/delete/move command or new authoring scope.

## Proposed next artifact and checks

V3 should add representative scenarios for each resource context, costly valid AST,
incomplete report, changed literal/reference and create/rename recovery, removed or
ineligible target, unresolved failed check/departure, and broken namespace/component
inspection with empty/cross-kind IDs. Retain V2 unchanged; simulate policy honestly
without installing dependencies or claiming storage qualification. Reuse Precision
semantic Tailwind tokens, owned primitives, Heroicons Outline and native semantics.
Verify the new artifact's affected keyboard/focus/compact/zoom paths when authorized;
production qualification, worker placement and browser-support decisions stay separate.

This document alone was added. Checks: source/document/image review, local-link
existence and scoped whitespace/diff review; no application tests or experiments.
Suggested human-owned commit: `docs: assess increment 007 post-qualification UX`.
