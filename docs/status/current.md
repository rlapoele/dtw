# Current Project Status

> Last updated: 18 November 2026
>
> Phase: Increment 016 completed, independently reviewed and user-accepted; verification limits retained.
> Increment 015 completed, independently reviewed and user-accepted; Increment 014
> completed and user-accepted. Earlier qualification limits retained. Increment 013 implemented/reviewed;
> earlier acceptance gaps preserved
>
> Applied projects remain browser-profile/origin local. Drafts/forms remain
> session-only. Applied Undo/Redo history is session-only; drafts/forms remain separate.

## Token list ordering amendment — 18 November 2026

The mockup now follows the user's requested All tokens order (type → layer → group
→ natural name) and selected-group order (relative subgroup → natural name).
The [V2 ordering amendment](../../prototypes/token-list-v1/DESIGN-V2.md#ordering-amendment--18-november-2026)
owns the sample type/layer order and verification. Both scopes were checked in the
in-app browser; production behavior remains unchanged. User design feedback is next.
Suggested commit: `docs: apply contextual token list ordering to mockup`.

## Token list V2 mockup — 18 November 2026

The [V2 proposal](../../prototypes/token-list-v1/DESIGN-V2.md) incorporates the user's
six browser annotations: link/clock/type icons, HEX headlines, all five color-space
representations with authored emphasis and separate alpha, and full paths below
parent paths. The follow-up small-device instruction limits compact color rows to
HEX plus the authored source representation and alpha; references retain their target.
The existing preview route now shows V2; V1 notes and screenshots remain historical.

Designer and coordinator visually inspected the revised mockup, including a 390px
phone capture. V2 notes own the bounded verification evidence and the prototype-only
perceptual HEX fallback proposal; no production fallback/export policy was changed.
Approximately four of six additional verification minutes used, zero harness repairs.
User feedback is next. No analyst approval or production implementation is inferred.
Suggested commit: `docs: refine token list color representations mockup`.

## Token list V1 mockup — 18 November 2026

The user requested a mockup of the proposed token-list properties in the existing
app shell. A separate designer created the [standalone V1 prototype](../../prototypes/token-list-v1/DESIGN-V1.md)
with Token / Type / Layer / Value columns, descriptions under identity, protected-only
regeneration indicators, authored reference targets and responsive summaries.
Search, namespace scopes and selection illustrate the proposal using sample data.
Current shell, theme, fonts and owned controls are reused; production application
files and dependencies are unchanged. The designer's notes own the viewing command,
artifacts, verification evidence and prototype limits.

Coordinator visually checked desktop and narrower renderings. This is a design
proposal awaiting user feedback, not an agreed increment, analyst-reviewed contract,
or implementation authorization. Earlier qualification campaigns remain stopped.
Suggested commit: `docs: add token list design prototype`.

## Four-decimal color presentation — 18 November 2026

Implemented the user's requested [color display policy](../project/presentation-conventions.md#color-display-precision)
as a focused presentation change. Table and inspector summaries plus unfocused decimal
fields use up to four decimal places; focused fields and exact/raw data retain full
precision. Focus/blur never writes the draft. Existing integer RGB entry and domain
conversion precision remain unchanged. No separate feature increment or independent
review was required or claimed.

Verification: `npm run typecheck` passed; focused authored-value, identity-presentation,
session and integer-RGB tests passed (70 tests). An isolated Chrome project verified
rounding, precise component/alpha values after Apply, passive space switching,
invalid input preservation, Cancel, keyboard focus/blur, resolved summaries and raw
derived precision. The [desktop capture](../../output/playwright/color-precision.png)
was visually reviewed. Affected file ownership/consumers and Markdown links were
reviewed; no styling exceptions or dependencies were added. Broader responsive and
screen-reader checks were not run. Approximately five of ten minutes of the scoped
verification allowance were used, with one environment setup retry and no product
repair cycle; checks stopped after the focused checks passed. Earlier qualification
campaigns remain stopped.

The user reported committing and pushing this change on 18 November 2026.
The verification limits above remain unchanged.

## Increment 016 user acceptance — 17 November 2026

The user tested the implemented workbench, reported being happy with the result and
explicitly accepted Increment 016 while retaining its remaining verification limits.
The increment is completed and user-accepted. Independent review found no actionable
production-code defect. Colors remain provisional; palette refinement is deferred.

[The increment record](../increments/016-transient-toast-feedback.md#user-acceptance--17-november-2026)
owns the acceptance, evidence and limits. Specific manual test cases are not inferred.
Full production-flow coverage, hidden-tab timing, reduced-motion rendering, actual
screen-reader delivery and other recorded runtime cases remain unverified as documented.
Approximately 14 of 15 aggregate minutes and one of two repairs were used before checks
stopped. Acceptance does not restart verification or mark untested cases as passed.
Earlier campaigns remain stopped; any further agent verification needs a separately
authorized bounded follow-up. No further acceptance action is pending for Increment 016.
Staging, committing and pushing remain with the user.

## Historical handoffs

The following entries describe their state at the time. Their pending-approval wording
and proposed budgets are superseded by the current handoff above.

## Toast V4 analyst recheck — 17 November 2026

The user reviewed V4, reported being happy and authorized the analyst recheck.
The separate analyst found no remaining actionable design findings in the bounded
source review. [Increment 016](../increments/016-transient-toast-feedback.md#v4-analyst-recheck--17-november-2026)
records closures, AC-1–AC-9, both message-owner inventories and the stable snapshot.
Focus/exit cleanup, visible-only announcement admission, adaptive overflow and the
noninteractive queued preview are consistent at source/design level. Colors remain
provisional, with aesthetic refinement deferred.

Recheck used approximately three of four minutes, zero repairs, then stopped.
No browser or application tests ran; actual integration, short/narrow viewport and
assistive-technology evidence remain implementation checks. Earlier campaigns remain
stopped. Documentation links and whitespace checked. The contract is Draft / Not
started. Next is user agreement to Increment 016 and V4 plus authorization for a
separate developer followed by independent review under the proposed 30-minute /
two-repair verification ceiling. Staging, committing and pushing remain with user.

## Toast visual prototype V4 — 17 November 2026

The user requested a partial queued-message cue and more icon spacing after
committing/pushing V3. The designer's [V4](../project/toast-feedback-v1.md) shows the
beginning of the next queued message beneath the full stack within its height cap.
The cue has no actions, timer or announcement until admitted. Oversized messages
retain sole/manual-dismissal behavior and now have increased top padding.

Coordinator browser viewing confirmed two full toasts plus a partial third in the
short-window simulation and checked the long-message spacing. The
[increment record](../increments/016-transient-toast-feedback.md#v4-queued-preview-refinement--17-november-2026)
records tradeoffs and evidence limits. Approximately three of four aggregate minutes
used, zero repair campaign; checks stopped. No production code or application tests.
V4 awaits user review before analyst recheck; colors remain provisional. Staging,
committing and pushing remain with the user.

## Toast visual prototype V3 — 17 November 2026

The user reported committing/pushing the review and accepted adaptive overflow.
The designer delivered [V3](../project/toast-feedback-v1.md), with fewer visible
toasts when space is tight, an oversized manually dismissed scrollable message,
and corrections for exiting-toast focus and hidden-document announcements.
The [increment record](../increments/016-transient-toast-feedback.md#v3-prototype-handoff--17-november-2026)
owns evidence, the explicit persistent-color inventory and remaining limits.

Browser checks confirmed simulated height handling, oversized persistence/scrolling,
reachable dismissal, focus return and queue advancement after rapid dismissal.
Background/screen-reader delivery and real narrow/short viewport behavior remain
unverified. Six aggregate revision minutes consumed, zero harness-repair campaign;
checks stopped. Production code is unchanged; no application tests ran. V3 awaits
user artifact review before analyst recheck, final agreement and implementation
authorization. Colors remain provisional. Staging/committing/pushing stay with user.

## Toast V2 analyst review — 17 November 2026

The user approved V2 for analyst review, with aesthetic palette refinement deferred.
The [Increment 016 review](../increments/016-transient-toast-feedback.md#v2-analyst-findings--17-november-2026)
confirms the status scope and records three required findings: exiting-toast focus
can stall removal; background outcomes can consume announcements before return;
and short-viewport stack handling plus the persistent-color region inventory need
clarification. The prototype is not ready to be treated as implementation evidence.

The separate analyst performed source/contract review only, approximately four of
five minutes, zero repairs, then stopped. No browser or application tests ran.
Earlier budgets/campaigns stay stopped. Final contract/design agreement and production
implementation authorization remain pending. Next is a concrete overflow proposal
for user review plus corrections to the intended focus/announcement behavior.
Staging, committing and pushing remain with the user.

## Toast visual prototype V2 — 17 November 2026

The user found V1 broadly good and requested inverted status colors for every
notification/toast type to improve separation from the neutral workbench. The
[design record](../project/toast-feedback-v1.md) now identifies V2 at the same
prototype URL. Success, information, error and warning use dark status surfaces
with light text/icons; dismissal and action controls have adapted hover/focus colors.
Scope, timing and behavior remain unchanged. Production source is untouched.

The designer checked source and isolated contrast (all four pairs exceed 4.5:1),
and the coordinator visually inspected all four treatments together in the browser.
This focused revision used approximately two aggregate minutes, zero repairs; prior
V1 checks remain stopped and their runtime limits are unchanged. No application tests
or analyst review ran. V2 awaits user approval for analyst review, not implementation.
Staging, committing and pushing remain with the user.

## Toast visual prototype V1 — 17 November 2026

The user accepted the transient-confirmation scope and authorized the visual
prototype, explicitly requesting appropriate error status colors. The separate
designer delivered [V1](../project/toast-feedback-v1.md): bottom-center green success
and blue information toasts, persistent red errors and amber warnings, dismissal,
paused five-second timers and proposed stack/modal/navigation behavior. The live
prototype is available from its design record. Production code is unchanged.

Coordinator browser checks confirmed rendering, expiry, dismissal/focus return and
three visible toasts after a five-event burst. Isolated text/surface contrast checks
passed 4.5:1 for all four pairs. Remaining runtime gaps and prototype-only behavior
are explicit in the design record. Prototype verification stopped at approximately
five of eight aggregate minutes; initial preparation remains eight minutes separately.
Markdown links and whitespace checked; no application tests or analyst design review.

Next: user assesses placement, colors and motion in V1 and identifies whether it is
ready for analyst review. Final contract/design agreement and production authorization
remain pending. Staging, committing and pushing remain with the user.

## Toast feedback proposal — 17 November 2026

The user requested transient dismissible notifications with bottom fade/slide motion
and status colors. Separate analyst and designer preparation produced the
[Increment 016 draft](../increments/016-transient-toast-feedback.md), still Draft /
Not started. The initial recommendation is five-second bottom-center confirmations,
with hover/focus/hidden-page pauses and pale success/information colors. Progress,
errors and actionable recovery messages would stay contextual. That scope and the
initial design direction await user feedback before prototyping; analyst design
review and final implementation authorization have not occurred.

Only preparation documents changed. Source review, Markdown links and whitespace
were checked; no application tests or runtime acceptance. Approximately eight aggregate
preparation minutes, zero repairs. Existing application work, acceptance and stopped
campaigns are preserved. Staging, committing and pushing remain with the user.

## Panel slides and navigation footer — 17 November 2026

The user requested smooth panel entrance/exit with slower synchronized chevrons,
then removal of the navigation project/group-count footer. Both are implemented.
Desktop tracks resize as fixed-width content slides outward/inward; headings and
chevrons share a 500 ms duration/easing. Content stays mounted, with collapsed
content immediately inert and hidden from assistive technology, then visually hidden
after exit. Reduced motion disables transitions. The footer and obsolete selector
are removed. [Presentation conventions](../project/presentation-conventions.md#panel-motion-refinement--17-november-2026)
own the CSS exception and state-preservation approach.

All typecheck scopes and 34 existing layout/coordination/inspector tests passed before
the subsequent footer removal and equivalent width-variable consolidation. Browser
checks at approximately 1395 × 1269 confirmed intermediate width/translation values
in both directions for both panels, final collapsed widths of 52/48 px, hidden/inert
content and retained toggle focus. Final visual inspection confirmed the footer is
absent and both panels are open. No project data was edited. Selected-token drafts,
rapid reversals, narrow layouts and reduced-motion runtime were not exercised; their
coverage is limited to source review and existing tests, not new runtime acceptance.

Self-review checked affected component owners, callbacks and CSS scope; whitespace
passed. Approximately seven minutes of focused verification, no harness repair or
independent review. Initial browser annotations intercepted actions; checks succeeded
after that overlay cleared. Earlier campaigns remain stopped. No decision or human
check is needed. Staging, committing and pushing remain with the user.

## Panel header refinement — 17 November 2026

Further user annotations requested plain NAVIGATION and INSPECTOR headings,
matching icon-only controls, and a visible inspector rotation. Navigation now has
an independent heading and the same ghost/icon Button variant as the inspector.
Inspector warnings and inspection-only feedback remain separate from its heading.
Both chevrons use explicit rotation endpoints and a 300 ms transition, with the
existing reduced-motion exception. Existing callbacks and component owners remain.

All typecheck scopes and 34 layout/coordination/inspector tests passed; whitespace
and affected owners were self-reviewed. Browser checks at approximately 1395 × 1269
confirmed both buttons are 36 × 36, labels are headings, and collapse/expand retains
focus. Live computed rotation progressed from 0 to 5.69 degrees during inspector
collapse, confirming interpolation rather than just changed endpoints. Both panels
were left open. No data was edited. Reduced-motion runtime, narrow layouts and
selected-token rendering were not exercised; source inspection is not runtime proof.

Verification took approximately four minutes, including one unsupported animation
inspection call replaced by computed-style sampling. No further campaign or independent
review was started. Earlier stopping decisions remain intact. No human decision or
check is needed; staging, committing and pushing remain with the user.

## Panel chevron feedback — 17 November 2026

The user accepted, committed and pushed the previous three browser corrections,
then requested panel-toggle placement changes. The navigation chevron now sits
at the far right of its label, pointing left when open and right when closed.
One mounted icon rotates through a transform transition, disabled for reduced motion.
The inspector toggle now sits left of the status text and token heading. Its existing
rotation and persistent mounted control remain intact; the token heading spacer and
collapsed-rail offset move with it. This is a focused fix, not a reopened increment.

All typecheck scopes and 34 existing layout/coordination/inspector tests passed.
In-app browser checks at approximately 1395 × 1269 confirmed placement, both panels'
collapse/expand actions and retained keyboard focus. Computed styles confirmed the
navigation rotation endpoints and transform transition. Source review covered reduced
motion, the token-editor spacer/offset, existing owners and unchanged callbacks.
Reduced-motion runtime, selected-token rendering and narrow layouts were not exercised;
these limit visual evidence, not claimed passes. No project data was changed.

Self-review and whitespace checks completed in approximately four minutes, with no
harness repair campaign or independent review. Earlier acceptance and verification
stops remain unchanged. No user decision or check is needed. Staging, committing and
pushing remain with the user.

## Focused browser feedback — 17 November 2026

The user's three annotated corrections are implemented: group rename is a pencil
button beside the group heading, with title and accessible name `Rename group`;
Undo/Redo counts use the primary foreground/background pair; and the Projects
button is replaced by `Projects / current project` in the header context.
Projects is a native link. Ordinary activation reuses the existing guarded return;
modified activation keeps native link behavior. Busy state prevents ordinary
activation. No routing system, persistence policy or session owner changed.

All typecheck scopes and 11 existing toolbar/layout/icon tests passed. In the
in-app browser at approximately 951 × 865, the placement and colors were inspected;
rename opened with the current name, and cancellation restored focus to the pencil.
No project data was edited. Source review confirmed the existing draft guard and
leave-project callback are reused. The Projects link was not activated in the user's
session to preserve its Undo history. Busy/modified navigation, dirty-draft navigation,
narrow wrapping and long names were not exercised in the browser. These limit the
runtime evidence; they are not reported as passed or as new user acceptance.

Self-review checked the four affected component owners and consumers, shared Icon
use, semantic utilities and unchanged callback ownership. No independent review or
new component/dependency was needed for these small fixes. Verification stopped after
approximately five minutes, without a harness repair campaign. Earlier increment
acceptance and verification stops remain unchanged. No decision or human check is
required now; any further runtime check belongs to the agent if a concrete concern
arises. Staging, committing and pushing remain with the user.

## Workflow communication update — 17 November 2026

The requested v0.6.0 human-review guidance is applied locally in the
[workflow](../workflow/agent-roles.md#human-review-and-communication) and
[increment templates](../increments/README.md). Future chat handoffs explain outcomes,
unfinished work and next actions directly. Questions include a recommendation and
tradeoff; useful human checks include steps, expected results and purpose. Completion
evidence stays in the existing task record by default.

This documentation-only update preserves design review order, authority, acceptance
criteria and all earlier verification limits and stopping decisions. No historical
report or accepted increment is changed or reopened. No conflict needs a user decision
and no human check is requested. Verification is limited to self-review of preservation,
consistency, local links and whitespace; no application tests or independent review.
Staging, committing and pushing remain with the user. No new increment is authorized.

## Increment 015 completed and user-accepted — 16 November 2026

The user agreed the updated [Increment 015 contract and prototype V1.3](../increments/015-workbench-browse-and-inspector-polish.md)
and authorized developer implementation followed by independent review. The
[completion report](../increments/015-workbench-browse-and-inspector-polish.md#completion-report--16-november-2026)
records delivered history count badges/hidden descriptions, concise HEX and rounded
row-only summaries, generic search and workspace group creation, sticky Current/New
inspector composition, and the 2.25rem control baseline across shared/current consumers.
Exact authored/editor data and existing workflow ownership remain within recorded coverage.

Developer R1 passed 87 focused tests and full typechecks/build, with representative
Chrome desktop/narrow/enlarged-root evidence. Independent R1 review passed 38
focused tests and found one AC-10 focus/animation defect. Developer correction R2
keeps the same toggle mounted. Following explicit user authorization for one
five-minute/zero-repair follow-up, the [independent R2 recheck](../../output/increment-015-implementation/reviewer-R2.md)
verified keyboard focus/same-node retention, real normal/reduced-motion rotation,
exact draft preservation, sticky heading and full build/typechecks. No actionable
finding remains within the bounded review. Source hashes matched before/after.

Verification stopped originally at about 18/30 minutes and 2/2 harness repairs;
the separately authorized R2 follow-up used about two of five minutes and zero
repairs, then stopped after passing. Earlier qualification limits remain explicit;
no exhaustive WCAG/browser/recovery matrix is claimed.

The user opened the application from the IDE, checked it and confirmed all requested
changes were correctly implemented. The [acceptance record](../increments/015-workbench-browse-and-inspector-polish.md#user-acceptance--16-november-2026)
owns this 16 November 2026 report. No particular unreported scenario or broader
qualification is inferred. This documentation-only update reran no application
checks. Staging, committing and pushing remain with the user; no further work,
next increment or additional campaign is authorized.

## Variable WOFF2 font maintenance — 16 November 2026

At the user's request, the five static TrueType application fonts were replaced
with two unmodified variable WOFF2 files from the supplied Vercel Geist download.
Both report version 1.900 and a weight axis of 100–900; existing type roles, weights
and fallbacks remain. The [font asset record](../../src/presentation/styles/fonts/README.md)
owns source provenance, hashes, versions and licenses. The download's exact
upstream revision is unverified; Increment 014's original evidence remains historical.

Production build/all typechecks passed. A focused Playwright CLI Chrome check
against the production preview loaded both local WOFF2 assets and resolved
weights 100/400/500/600/900 for each family. Source/asset metadata, resulting font
folder ownership, obsolete TTF references and Markdown/diff checks were reviewed
by the implementing agent. No independent review or broader qualification is
claimed. Staging/committing/pushing remain with the user.

## Neutral / Geist and styling ownership completion — 16 November 2026

The user reviewed the application, confirmed they were happy with the changes and
explicitly accepted Increment 014 on 16 November 2026. The
[acceptance record](../increments/014-neutral-geist-and-styling-ownership.md#user-acceptance--16-november-2026)
owns that report. No particular manual scenarios or broader qualification results
are inferred from it. This documentation update ran no application checks.

The user agreed V1 and Increment 014 and authorized a separate developer followed
by an independent reviewer. [Completion and evidence](../increments/014-neutral-geist-and-styling-ownership.md#completion-report--16-november-2026)
record the Neutral semantic theme, local Geist fonts, Projects hierarchy and F1–F9
styling cleanup. Workflows, authored data, mounted state and viewport policy are
preserved within stated source/test/runtime coverage. Final build/all typechecks
and 153 presentation tests passed before the one-line R2 correction; its focused
acknowledgement test and compiled utility check passed afterwards. Independent
review ran 20 tests and Chrome checks, found one checkbox-minimum omission and
resolved it through exact R2 recheck; no actionable findings remain. Final focused
developer evidence closes enlarged-root lower-action/focus and authoring-return
checks, without changing reviewed source. Full restore/recovery/viewport and
broader qualification limits remain explicit; earlier gaps are unchanged.

Checks stopped at approximately 37/40 aggregate minutes and 1/1 repair. Delivery
is Completed within the agreed bounded scope, without new full accessibility or
offline/PWA claims. User acceptance is now recorded. Staging/committing/pushing
remain with the user. No additional campaign or next increment is authorized.

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
selected in V1. V1 subsequently received analyst review and final user agreement
alongside Increment 014. The completion above supersedes the prototype-only
handoff; original preview limits remain historical evidence in the proposal.
Leave staging, commits and pushes to the user.

## Tailwind styling ownership audit — 16 November 2026

The user requested a bounded audit and cleanup proposal, with broad rem preference,
coherent dimension scales and deliberate white/black usage. The
[audit and ordered plan](../planning/tailwind-styling-ownership-audit.md) records
source-confirmed styling conflicts, proposed ownership, unit/scale policy and a
separate palette/design review. At audit time no cleanup was authorized; the
later agreed Increment 014 delivers it as recorded above. The additional third-party Tailwind skill is not being
adopted. Source and Markdown were reviewed; no browser, tests or build were run,
and no new runtime acceptance or independent review is claimed. Earlier acceptance
gaps and qualification stopping decisions remain unchanged. Leave staging/commits/pushes to
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

## Session Undo/Redo agreement — Increment 012

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

Increment 015 is complete and user-accepted. The user stages/commits/pushes as
desired and selects any future work to scope. Earlier qualification/acceptance
gaps remain with their owning increments. No next increment or renewed campaign
is authorized.

## Resume

Read AGENTS.md, this handoff, actual Git state and the
[Increment 015 contract/design and authorization](../increments/015-workbench-browse-and-inspector-polish.md)
before scoping further work or checking the delivered handoff. The [pre-closure snapshot](history/2026-11-15-increment-011-before-closure.md)
preserves outgoing 011 detail. [README](../../README.md) owns current commands and
limits; increment records own their agreements/evidence/acceptance gaps.
