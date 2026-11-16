# Current Project Status

> Last updated: 16 November 2026
>
> Phase: Increment 014 drafted after V1 analyst review; final agreement and
> implementation authorization pending. Increment 013 implemented/reviewed;
> earlier acceptance gaps preserved
>
> Applied projects remain browser-profile/origin local. Drafts/forms remain
> session-only. Applied Undo/Redo history is session-only; drafts/forms remain separate.

## Neutral / Geist and styling ownership contract — 16 November 2026

The user liked V1 and authorized a separate analyst to review it and draft the
combined [Increment 014 contract](../increments/014-neutral-geist-and-styling-ownership.md),
explicitly without implementation. The draft includes F1–F9 cleanup and records
two concrete migration hazards: secondary-text consumers and input-boundary roles.
It specifies intentional type/color changes separately from retained geometry,
viewport policy and workflows; broad dimension rounding remains deferred.
No further product question is identified beyond user agreement to the proposed
dispositions. Contract status is Draft, delivery Not started; final contract/design
agreement and implementation authorization remain pending. Planning source/link/
whitespace checks stopped at approximately 10/12 aggregate minutes, zero repairs;
no app tests, build or browser qualification ran. Previous campaign stops and
acceptance gaps remain unchanged. Next: user reviews the contract. Leave staging,
commits and pushes to the user.

## Neutral / Geist visual proposal — 16 November 2026

The user requested a visual proposal using Tailwind Neutral, Geist and Geist Mono,
with shadcn-compatible semantic pairs and the earlier Tailwind/CSS revamp retained.
The designer's [V1 proposal](../project/neutral-theme-proposal-v1.md) owns the
proposed mapping, type scale, surface tradeoff and F1–F9 cleanup integration. The
inline review includes Tokens, Projects and palette/type views; Projects borrows
the reference site's editorial hierarchy while keeping selection and Open separate.
Designer source checks and coordinator desktop preview/view switching completed;
the proposal records unverified narrow/font-scaling and host-control behavior.
The user permits a small additional very-light neutral step if needed; none is
selected in V1. This is a proposal for user feedback, not analyst approval, final
design agreement or production implementation. Source/dependencies are unchanged;
earlier acceptance gaps and qualification stopping decisions remain unchanged.
V1 subsequently received user approval for analyst review; the draft above records
that review and the proposed combined contract.
Leave staging, commits and pushes to the user.

## Tailwind styling ownership audit — 16 November 2026

The user requested a bounded audit and cleanup proposal, with broad rem preference,
coherent dimension scales and deliberate white/black usage. The
[audit and ordered plan](../planning/tailwind-styling-ownership-audit.md) records
source-confirmed styling conflicts, proposed ownership, unit/scale policy and a
separate palette/design review. Application code is unchanged; no cleanup is
authorized by the proposal. The additional third-party Tailwind skill is not being
adopted. Source and Markdown were reviewed; no browser, tests or build were run,
and no new runtime acceptance or independent review is claimed. Earlier acceptance
gaps and qualification stopping decisions remain unchanged. Next: user reviews the
proposal before a scoped implementation contract. Leave staging/commits/pushes to
the user.

## Presentation organization guidance — 16 November 2026

The user authorized project-specific file organization/naming guidance and updated
review instructions. [Presentation conventions](../project/presentation-conventions.md#file-organization-and-naming)
own the consumer-based placement/naming procedure and bounded resulting-tree check;
AGENTS.md links it and developer/reviewer briefs apply it. The ownership map remains
the source of current paths; architecture retains dependency boundaries. This is
documentation-only guidance, not authorization for another application increment,
unrelated refactoring or renewed qualification. Earlier acceptance gaps/stopping
decisions are unchanged. Changed Markdown, new links/anchors and whitespace were
reviewed; no application tests were run for this documentation-only update. Leave
staging/committing/pushing to the user.

## Editor ownership and browse naming — 16 November 2026

The user authorized the two editor ownership moves and both naming refinements.
TokenValueComparison and resolved-color now live under TokenEditor components/
helpers; NamespaceInventory and its helper replace AllContent/all-content.ts;
browse-view.ts exports TokenBrowseView instead of workspace-view.ts/BrowserView.
Imports and current documentation follow those paths. The
[ownership map](../project/workbench-component-organisation.md#editor-ownership-and-browse-naming--16-november-2026)
records the decision. Visible labels, callback contracts, view discriminator values,
rendered structure and session/command ownership remain unchanged. Prior acceptance
gaps/stopping decisions remain unchanged. Production build/all typecheck scopes,
the nested presentation config and all152 presentation tests passed. Source/test
comparison confirmed only approved names/paths/imports changed. An isolated Git
index detected all6 exact expected renames at the default50% threshold, including
the inventory test filename; destination paths/casing are correct and old paths
are absent. Real index untouched; no browser qualification performed. Leave
staging/committing/pushing to the user.

## TokensWorkbench purpose-based names — 16 November 2026

The user authorized the proposed component/hook renames, including
AuthoringDialog/useAuthoringForm, and flattening WorkbenchRecovery. The
[ownership map](../project/workbench-component-organisation.md#purpose-based-component-and-hook-names--16-november-2026)
records the new names and paths. Imports and current documentation follow those
names; rendered hierarchy, CSS, session/command ownership and prior acceptance
gaps/stopping decisions remain unchanged. Build/all typecheck scopes, the nested
presentation config and all152 presentation tests passed. Source/test comparison
confirmed only approved names/paths/imports and an authoring-owner comment changed.
An isolated Git index verified all34 destination paths/casing and no recovery
wrapper:33 renames detected at the default50% similarity threshold, all34 at10%.
The tiny FeedbackRegion signature/body share one line, causing its low similarity
score despite preserved behavior. Real index untouched; no browser qualification.
Leave staging/committing/pushing to the user.

## Plural workbench naming — 16 November 2026

The user requested TokensWorkbench to match ProjectsWorkbench. The folder,
entry file/exported component and consumer imports use the plural name; the
[ownership map](../project/workbench-component-organisation.md#plural-workbench-naming--16-november-2026)
records the decision. This is naming-only maintenance; state/session ownership
and prior qualification gaps/stopping decisions remain unchanged. Leave staging,
committing and pushing to the user. Production build/all typecheck scopes, the
nested presentation config and all152 presentation tests passed. Source/test
comparison confirmed only approved names/imports changed. An isolated temporary
Git index detected all53 renames, exact destination casing and no old folder; the
real index remains untouched. No browser qualification was performed.

## Token display ownership — 16 November 2026

The user authorized moving the ten token-display files into TokensWorkbench at
their proposed owners: shared helpers/value/swatch components, inspector-shared
ExactSource, and editor-private metadata/resolution panels. Imports and current
documentation follow those paths; the empty top-level token-display folder is
removed. The [ownership map](../project/workbench-component-organisation.md#token-display-ownership--16-november-2026)
records exact placement. This path-only maintenance leaves existing behavior,
editor/session ownership and prior qualification gaps/stopping decisions unchanged.
Production build/all typecheck scopes, the nested presentation config and all152
presentation tests passed. All changed source/test files were compared with the
committed originals: only approved moves/imports changed. No browser runtime
qualification was performed. Leave staging/committing/pushing to the user.

## Shared workbench layout — Increment 013

The user approved the shared structure and authorized implementation. ProjectsWorkbench
and TokensWorkbench now use WorkbenchLayout under `App/components/`. The layout
reuses ApplicationShell, arranges explicit slots without pane wrappers and shares
1120/880 viewport observation. Screen hooks retain focus/surface policy; App retains
unconditional useProjects and host/page/restore context. Command/editor logic, keys,
scroll owners, CSS dimensions and feedback ordering are preserved in source.

[013 completion](../increments/013-shared-workbench-layout.md#completion-report)
records the R1 snapshot, developer evidence and independent review with no actionable
findings. Build/all typecheck scopes and nested presentation config passed. Developer
presentation suite151 and later targeted30 passed; reviewer targeted37 passed.
Browser smoke was unavailable (offline CLI ENOTCACHED); real geometry/focus/scroll,
drawer and mounted editor-session behavior remain unverified. No new manual
acceptance is asserted. Prior campaigns and acceptance gaps remain unchanged.

Checks stopped at approximately16/20 aggregate minutes and0/1 harness repairs.
Leave staging/committing/pushing to the user; no broader qualification restart.

## App screen nesting — 16 November 2026

The user authorized moving Projects and Workbench under `App/components/`, with
all imports and current ownership/architecture documentation updated. The
[resulting tree](../project/workbench-component-organisation.md#app-screen-ownership--16-november-2026)
records physical placement. App retains its unconditional useProjects call,
host/page context and restore sequencing; editor keys and mounted ancestry are
unchanged. Earlier qualification stopping decisions and acceptance gaps remain
unchanged. Production build/all typecheck scopes, the nested presentation config
and all 149 presentation tests passed. All 54 moved files were compared against
the committed originals; only import paths changed. No browser runtime
qualification was performed. Leave staging/committing/pushing to the user.

## Projects presentation reorganisation — 16 November 2026

The user authorized `Projects/Projects.tsx` and moving RestoreDialog with its hook
to `Projects/components/RestoreDialog/`. The project-backup wrapper is removed;
imports and current documentation follow the new names. App retains the same
hook calls, state lifetimes and restore orchestration. The
[ownership map](../project/workbench-component-organisation.md#projects-placement-refinement--16-november-2026)
records this placement decision. Earlier acceptance gaps and verification stopping
decisions remain unchanged. The user subsequently committed/pushed the casing
correction; Git-tree inspection confirmed all Projects paths used uppercase casing.
Production build/all typecheck scopes, the nested presentation config and 39 focused
tests passed. Moved files were compared with their originals: only approved names
and imports changed. No browser runtime qualification was performed.

## Browser host reorganisation — 16 November 2026

The user approved and authorized the reviewed placement proposal. Browser worker
entry/runtime/client, protocol/validation and backup-file effects now live under
`src/hosts/browser/`; source-display assembly lives under
`presentation/token-display/helpers/read-exact-source.ts`. Imports, shared aliases,
TypeScript scopes and current documentation follow the new structure. The
[architecture decision](../project/architecture.md#browser-host-placement--16-november-2026)
records responsibilities and retained coupling. Production build/all four
typecheck scopes, the nested presentation config and 50 focused tests passed.
Seven host files are byte-identical; source assembly changed only its protocol
import. The worker URL regression assertion now checks the new location. No browser
runtime qualification was performed. Earlier acceptance gaps and qualification
stopping decisions remain unchanged. Leave staging/committing/pushing to the user.

## App folder reorganisation — 16 November 2026

The user requested `App/` casing and moved ApplicationHeader/ApplicationShell to
`App/components/`. Imports and current architecture/ownership documentation now
follow those paths; the [ownership map](../project/workbench-component-organisation.md#app-placement-refinement--16-november-2026)
records the decision. This is path-only maintenance; earlier qualification
campaigns and acceptance gaps remain unchanged. Production build (including all
typechecks) and 32 affected presentation tests passed; source moves/imports and
Markdown changes were checked. No browser qualification was restarted.
The user subsequently recorded the case-only rename in Git and confirmed that
the IDE casing error was resolved.

## Latest focused fix

User agreed the editor-only0° fallback for computed powerless hue after committing
UI refinements as `7759f00`. The display projection now keeps black/white/gray
numeric in converted HSL/OKLCH without changing source values, alpha, genuinely
missing authored components or dirty state. Regression checks include transparent
black, all supported viewing spaces, return to source and intentional editing.
Full suite1136 tests/typechecks passed; isolated Chrome new black passed all5
spaces with no missing warning and Apply disabled. [Evidence/limits](../../output/powerless-hue-fix/checks.md)
records self-review, approximately5 minutes, zero repairs. Earlier campaigns and
acceptance gaps stay stopped/unchanged. Leave staging/commits/push to the user.

## Current browser feedback

User committed/pushed012 as `f63abcf`, then supplied six annotated UI comments.
Five requested fixes are delivered: unclipped creation focus outline; Applied/Draft
swatches within token heading, wrapping at320; badge spacing; Undo/Redo height
matching Projects (32px at1077, existing44px at640/mobile); supplementary labeled
sRGB hex preview with alpha and safe unavailable cases. The history next-action
strip was explained and retained. One editor/command owner remains.

[Feedback completion](../increments/012-session-undo-redo.md#browser-feedback-completion-and-review--15-november-2026)
links the exact10-file manifest, developer evidence and independent review.
Typecheck/9 affected tests passed; reviewer passed3 hex tests and independently
inspected source hashes/four screenshots, with no actionable findings. Reviewer
performed no browser interaction; short-height scrolling, exact independent DOM
geometry/screen-reader behavior and unavailable row runtime remain unverified.

Focused checks stopped at approximately13.5/15 aggregate minutes (developer8.5,
reviewer3, coordinator2),1/1 repair. Earlier01235/40 and older campaigns/gaps remain
stopped. No staging, commits, pushes, dependencies or index-casing changes by agents.

## Current focus

The user agreed the refined [Increment 012 contract](../increments/012-session-undo-redo.md#final-agreement-and-implementation-authorization--15-november-2026)
and amended [Undo/Redo V1 design](../project/workbench-layout/undo-redo-v1.md),
including the 640px control-label threshold and receipt compatibility policy,
and authorized a separate developer followed by an independent reviewer.
Implementation baseline is `cf3fa82`. Delivery is Partially completed with
[completion and gaps](../increments/012-session-undo-redo.md#implementation-completion-report--15-november-2026);
no new user manual acceptance is asserted.

Agreed: all four current token/group commands; application-owned session snapshots,
50 steps/32 MiB serialized shared payload, no-write no-ops preserving Redo, exact
known admitted diagnostic-baseline restoration under narrow validation, guarded
draft discard and native/modal input undo, conservative invalidation and passive
Redo. Icons plus text from 640 CSS px; icon-only below it with accessible names
and touch targets. Pane thresholds remain unchanged. Project-targeted undo/redo
receipts use a newer internal retained-record version, new-reader support for v1
and safe old-reader refusal/no overwrite. No durable history, authored format or
backup-envelope change. Preserve owner-first folders, one command gate and editor.

## Review order and limits

Separate developer implementation and fresh independent review finished. Reviewer
verified both 27-file manifests and 53 targeted tests. One P2 guard-focus issue was
reproduced and corrected; reviewer resolved it by final source-delta inspection.
No actionable findings remain. [Evidence](../../output/increment-012-implementation/reviewer.md)
distinguishes source review from unavailable independent browser runtime.

Developer checks: initial full suite1122 tests; later targeted53, build/typechecks,
representative Chrome wide/320/640, native typing/application shortcuts, draft guard,
selection/passive Redo and final actual focus checks. Full suite/build predate final
small focus corrections; final typecheck passed. Browser recovery fault injection,
ancestor fallback/modal key combinations, two-tab/old-app browser and broader
responsive/accessibility/stress qualification remain unverified as detailed in the
contract. Earlier acceptance gaps remain preserved.

Implementation checks stopped at approximately **35/40 aggregate minutes**
(developer20, reviewer12, coordinator3), **1/2 harness repairs**; unused allowance
is not a restart. Preparation13/15 and analyst review7.5/8 remain stopped. Source
snapshot is [R2 manifest](../../output/increment-012-implementation/source-manifest-r2.json)
plus [R2 diff](../../output/increment-012-implementation/source-r2.diff). No agent
staged, committed, pushed or changed index casing.

## Increment 011 closure

[011 is Closed, delivery Partially completed](../increments/011-responsive-shell.md#user-directed-closure--15-november-2026).
Its UI and automatic storage-protection implementations and independent reviews
finished, with required findings resolved. User closure is a scope decision, not
a new manual acceptance report. The closure register preserves keyboard/focus/
drawer combinations, zoom/short-height/threshold/long-content cases, long-list
scroll/context, live unavailable/unknown/ownership/replacement interleavings and
native persistence permission UX gaps. Nothing is relabelled passed or silently
transferred wholesale into 012.

Original 011 checks stopped at about 46/60 minutes and 2/2 harness repairs; the
storage amendment at 13/20 and zero repairs. Both stay stopped, including unused
allowance. Earlier 007/009/010 dispositions are unchanged; the
[007 deferred register](../increments/007-local-retention-and-backup.md#deferred-qualification)
retains its zero remaining authorized campaign allowance. Chrome remains the
automated baseline; broader engines follow the fully featured PWA.

## Separate repository-casing observation

The user reports committing the casing correction. Current Git-tree inspection at
`6aa6943` still lists `src/presentation/workbench/Workbench.tsx`, while the physical
owner is `Workbench/`. This discrepancy is recorded without assuming the index
correction succeeded. It does not block 012 planning; no source/index/staging
changes are made to resolve it here.

## Next meaningful action

User reviews the shared-workbench-layout extraction and stated evidence limits,
then stages/commits/pushes as desired. Earlier012 acceptance gaps remain open. Leave
staging, committing and pushing to the user. Do not close the increment or relabel
unverified runtime acceptance passed without further user instruction/evidence.
No additional automated qualification campaign is authorized by this handoff.

## Resume

Read AGENTS.md, this handoff, actual Git state, the 012 draft and its new design
artifacts. The [pre-closure snapshot](history/2026-11-15-increment-011-before-closure.md)
preserves outgoing 011 detail. [README](../../README.md) owns current commands and
limits; increment records own their agreements/evidence/acceptance gaps.
