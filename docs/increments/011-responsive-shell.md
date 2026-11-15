# Increment 011: Responsive shell and workbench UI refinement

- Contract status: Draft
- Delivery status: Not started
- Agreement: Planning/design preparation authorized; contract/design agreement and application implementation authorization **pending**. No new design has been approved for analyst review.
- References: [vision](../project/vision.md), [product concept](../project/product-concept.md), [principles](../project/principles.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md), [layout reference V1](../project/workbench-layout/README.md), [component map V1](../project/workbench-layout/component-map-v1.md), [current ownership](../project/workbench-component-organisation.md), [010 delivery direction](010-component-oriented-presentation.md#delivery-direction), [workflow](../workflow/agent-roles.md).

## Outcome

An author can use the current workbench beside a design tool or code editor:
navigation, browsing and inspection share a wide desktop window; navigation
collapses as space contracts; browsing and editing become successive full-width
surfaces when a usable split no longer fits. The same selected-token editor
session survives these presentations, including invalid raw input and browsing
context. This is responsive composition of the existing workbench, not delivery
of the other capabilities illustrated in the saved mockups.

**User-confirmed scope extension — 15 November 2026:** finish a coherent UI design
for the existing token-workbench workflows, not only responsive pane geometry.
Resolve the present interface together so future feature slices can extend a
reviewed baseline instead of reopening avoidable layout and interaction questions.

## Scope

Included:

- Cohesive refinement of existing workbench header, navigation, workspace/list, inspector/editor, action hierarchy, typography, spacing, copy, dialogs and feedback across the supported responsive states.

- Wide navigation/workspace/inspector composition and accessible collapse/reopen controls.
- Minimum supported viewport width: **320 CSS px**, supplied by the user on 15 November 2026.
- Compact navigation drawer and workspace/inspector split where both are usable.
- Narrow browse and inspect/edit surfaces with a clear in-app Back action and an explicit route to reopen the selected token.
- Reflow of existing toolbar, table/list, inspector fields/actions, header/status and necessary dialogs so present workflows remain reachable.
- Session-preserving transitions across sizes and browse/edit; scope, query, selection and browsing-position restoration.
- Responsive handling of current empty, group, unsupported/read-only, unavailable, validation, pending-command and recovery presentations. No new editing capability is implied for a read-only selection.

Excluded:

- Undo/Redo controls and history implementation: deferred by the user to Increment 012.
- Visual token grids/palettes, new inventory views or filters, editable Details, relationships, previews/comparison and interchange.
- Resizable pane drag handles or saved layout preferences unless separately agreed; collapse/reopen is sufficient for this bounded proposal.
- Domain/application semantics, color precision or slider policy, canonical schema, storage/backup format, worker protocol, new host, router or state-management framework.
- Draft persistence across reloads/restarts, native browser history routing and new browser/platform qualification.
- Restarting deferred 007/009/010 qualification or treating new-shell evidence as retrospective acceptance of those increments.

## Workbench UI design closure

The user explicitly wants Increment 011 to iron out the current token-workbench
UI so that avoidable visual/interaction rework is not carried into the next slices.
This expands design preparation beyond reflow while retaining neutral Precision,
presentation conventions, component decomposition and the existing model/command
boundaries. It does not reopen earlier qualification or promise that future
features will never require adaptation.

The revised designer proposal should resolve these as one coherent experience:

- Header/project context and Projects return; project-management actions are on Projects and Undo/Redo belongs to 012.
- Navigation, current view/scope/search, group actions, list rows, selection and empty states.
- Inspector hierarchy, current tabs, literal/reference controls, authored/resolved information, exact input, validation and Apply/Cancel placement.
- Density, typography, spacing, borders/surfaces, labels and action hierarchy, including long names and wrapped feedback.
- Current creation/rename, departure and recovery dialogs; routine retention status, errors, busy/read-only/unavailable states and reachable recovery actions.
- Wide, compact and narrow composition down to 320 CSS px; Back/reopen, keyboard/focus, scrolling and session-preserving resize transitions.

Use reviewable screens/states and explicit interaction notes at sufficient fidelity
to assess the result. Resolve material details with the user before analyst review;
source or static images alone cannot establish runtime acceptance. Any change to
existing editor interactions beyond presentation must be identified explicitly,
with its behavior/contract impact, rather than hidden as styling cleanup. Future
visual grids, editable token Details, relationships, comparison, interchange and
new token capabilities remain outside 011.

The desired handoff is an identified, user-reviewed workbench/Projects design
baseline and source-informed component ownership for implementation, with agreed
states/decisions and clearly retained gaps. Reassess the eventual implementation
verification plan against this broader scope before verification starts; the old
30-minute proposal is not evidence that all this acceptance fits that allowance.

## Projects entry-page design discussion

**User-requested exploration — 15 November 2026.** The Projects page precedes the
token workbench. Include its design/content and transition into a project in this
increment’s design discussion. Consider a dedicated Projects composition versus
reusing the workbench’s structural page layout for project browsing, creation and
inspection. Shared visual structure need not imply token-specific navigation,
editor controls or draft semantics on the Projects page.

The designer should inventory the existing catalogue/open/create/restore/recovery
content and show what belongs on each candidate composition before proposing a
selection. Preserve existing loading/empty/unavailable/error/unknown-command states
and creation/restore protections. The current workbench-only responsive wireframes
do not settle this question or represent a Projects proposal.

The user subsequently requested a concrete designer proposal showing Projects
content/layout and sharing with the workbench shell. The
[Projects/shared-shell V1 proposal](../project/workbench-layout/projects-shell-v1.md)
and [static sheet](../project/workbench-layout/projects-shell-v1.svg) now supply
1440px, 880px and 320px compositions, representative states, screen transition
and source-informed React component-sharing candidates. The separate designer
recommends a dedicated catalogue/Create/Restore composition inside shared outer
presentation. This recommendation is proposed, not selected by the user.

This discussion is included in planning; a Projects redesign is **not yet agreed
implementation scope**. Record the selected direction and any resulting contract,
acceptance and design changes explicitly before implementation. Material design
revisions return to the user before analyst review. Do not automatically turn the
Projects page into a token-shaped three-pane screen merely to reuse components.

### Agreed project-capability and inspection direction — 15 November 2026

The user agreed the [project operation inventory](../project/project-operations.md)
as product capability coverage, not as a commitment to deliver all operations in
011. They specified project-list selection showing details in the right-side
inspector, following the token-workbench experience, and explicitly confirmed a
separate control to enter/work on the selected project. Selection is therefore
separate from opening and supersedes Projects V1’s direct-open proposal.

A separate **Open project** action prominently in the inspector is the
coordinator’s recommended label/placement. Exact content, narrow/full-width
inspection/Back, focus, selection preservation and operation placement require
Projects V2 designer artifacts and user review before analyst review. Read-only
versus editable project metadata and which undelivered operations join 011 remain
unsettled. No current application behavior, acceptance status or implementation
authority changes through this planning decision.

### Project actions belong on Projects — 15 November 2026

The user further agreed that the token workbench needs no project-management
controls except returning to Projects. The [placement decision](../project/project-operations.md#placement-of-project-actions)
supersedes V1’s workbench Restore backup/Download backup controls. Revise both
page designs together: selected-project operations live on Projects; the workbench
retains project context and existing retention/recovery/departure protection.
Exact operation placement and backup coordination from the catalogue require the
revised design and analyst scoping. No application changes are authorized here.

### Requested Undo/Redo controls — 15 November 2026

The user requested **Undo / Redo** in the token-workbench header in place of
Restore backup / Download backup, following the accepted visual references.
Project-management actions remain on Projects. This is an explicit desired
capability, not merely an illustrative image control.

**Subsequent user scope decision — 15 November 2026:** detailed Undo/Redo design
and delivery belong to **Increment 012**, not 011. Increment 011 excludes history
and Undo/Redo control delivery; it removes workbench backup/restore controls
without adding placeholder Undo/Redo buttons. Preserve the initial direction below
for later planning. This deferral does not open a 012 contract or authorize its
implementation.

The user agreed the initial scope: applied token/group changes within the current
open-project session, with normal typing undo retained in native text inputs.
Persistent history across close/reopen/reload is outside this initial scope.
Remaining history semantics and delivery scope need definition: exact supported
operation kinds, redo
invalidation, retained revisions/concurrent changes, pending/unknown outcomes,
and interaction with dirty drafts and keyboard shortcuts. Undo must not be
silently equated with Cancel, a blind replay or restoring an old browser snapshot.

**User-agreed initial direction — 15 November 2026:** begin with applied token/group
changes within the currently open project session; native text inputs retain their
normal typing undo. Durable history across project close/reopen/reload remains
outside this first scope. Operation coverage and safe command/revision behavior need analyst
scoping in Increment 012. Its contract, acceptance and verification scope remain
to be prepared separately; Increment 011 does not implement history.

## Component-decomposition continuity

**User-confirmed continuation — 15 November 2026.** Increment 011 builds on the
[endorsed component-oriented organisation](../project/workbench-layout/presentation-organisation-proposal-v1.md)
and [delivered ownership map](../project/workbench-component-organisation.md).
Responsive shell and Projects design should identify useful shared layout
responsibilities while preserving page-specific components and command owners.
Candidate components remain proposals until scope/design agreement; the earlier
map is not authority to scaffold future features or force matching page columns.

App retains project switching/host lifetime, useProjects retains catalogue and
creation coordination, and Workbench retains editor/departure/command ownership.
Shared presentation must not merge these workflows or duplicate the editor session.

## Source-informed starting point

These are inspection observations, not runtime acceptance:

- `src/presentation/workbench/useWorkbenchLayout.ts` currently uses 1120 CSS px for compact navigation, initializes inspector expansion at 768 CSS px, and retains independent collapse flags.
- `src/presentation/styles/global.css` currently gives compact 768–1119 layouts a split and stacks workspace/inspector below 768. The latter is the behavior this proposal replaces with successive full-width surfaces. Those thresholds are inputs to design, not agreed new breakpoints.
- `src/presentation/workbench/Workbench.tsx` owns selection, scope/query, dirty/departure coordination and command completion. Its `TokenEditor` key is `[selection.id, editorVersion]`; deliberate accepted completion/discard may reset a session. Layout changes must not add a reset reason.
- `src/presentation/workbench/WorkbenchInspector/TokenEditor/TokenEditor.tsx` calls `useTokenEditor` once. That hook owns raw session input, tab, dirty/recovery state and Apply/Cancel behavior. Keep a single owner; do not mount parallel desktop/mobile editors and synchronize drafts.
- `src/presentation/app/App.tsx` retains project-level composition/keying. Existing `NavigationDrawer`, `DepartureGuard`, creation and restore owners remain authoritative for their respective workflows.

Choose the smallest implementation that preserves a stable session lifetime:
keeping one mounted editor and changing its presentation is a candidate; lifting
only the demonstrated session boundary is another. The contract does not select
the mechanics before design agreement and source-level implementation planning.

## Acceptance criteria

These proposed criteria become binding only with final contract/design agreement.
Any unresolved interaction below must be settled before implementation.

- **AC-1 — Wide shell:** at the agreed wide viewport, navigation, current workspace and inspector are usable side by side. Collapsing/reopening either side region preserves the selection and session. Projects navigation, All tokens/All content, group actions and diagnostics remain reachable. Project-management controls, including backup and restore entry points, belong on Projects rather than the workbench.
- **AC-2 — Compact split:** at the agreed compact viewport, a labeled Browse/navigation control opens the namespace drawer. Dismissal or scope navigation preserves the token draft. Workspace/inspector remain side by side only above the agreed usable-split threshold; exact fields, labels and Apply/Cancel are operable without overlap or clipped feedback.
- **AC-3 — Narrow flow:** below that threshold, browsing and inspection/editing each use the available content width, rather than a vertically squeezed simultaneous split. Selection has an explicit inspect/edit entry. In-app Back returns to the same namespace scope, query, selection and browsing position; it neither applies nor cancels a draft. Reopening the selected token restores its unfinished session. Group/read-only inspection and no-selection states have an equally clear route back.
- **AC-4 — One session:** start a color draft with invalid raw channel input, change size across every layout boundary, use Back/reopen and open/close navigation. The exact raw input, dirty state, editor tab/mode and supported display settings survive; no Apply, Cancel or token mutation occurs. A valid literal/reference draft behaves likewise. There is one live selected-token session, with no duplicate dirty notifications or competing Apply controls.
- **AC-5 — Deliberate departure:** actions that replace the selected token or leave the project preserve the existing guard and busy/unknown/read-failure protections. Keep editing preserves input; explicit discard has the current meaning. Same-token Back, layout change and navigation dismissal do not count as discard. A draft hidden on the browse surface still participates in departure protection. Explicit Cancel/Apply retain their existing semantics; agreed post-action presentation is documented below.
- **AC-6 — Keyboard and focus:** navigation, edit entry, Back, collapse controls and current forms are keyboard operable. Hidden surfaces cannot receive focus or contribute duplicate landmarks/IDs to accessibility navigation. Drawer Escape/close returns focus; edit entry and Back use the agreed focus destinations, including a fallback when the invoking row is absent. Resizing never leaves focus in hidden content. Existing validation and command feedback remain associated and reachable.
- **AC-7 — Reflow and access:** at agreed representative wide/half-screen/narrow/phone sizes and zoom, including the user-specified 320 CSS px minimum, long token/project names, wrapped errors and current editor controls remain readable and operable. Local scrolling reveals all fields/actions; sticky content, if used, does not obscure them. The shell does not require horizontal scrolling to reach primary actions. Existing table detail may use a contained accessible overflow region if the agreed design specifies it. Creation/restore/departure dialogs fit and retain reachable dismissal/actions.
- **AC-8 — Protection stays visible:** read-only/unavailable selection, read failure, pending or uncertain command, retention/recovery and validation states keep their existing meaning and reachable actions in each affected surface. Changing layout does not clear an error, bypass mutation blocking, retry a write or dismiss recovery. Existing group, incomplete/unsupported and empty-project content remains discoverable.
- **AC-9 — Boundaries:** presentation uses existing semantic theme, shared Icon/controls and current application operations. No canonical token value, identity, namespace membership, retention or backup semantics changes as a consequence of responsive composition.

- **AC-10 — Coherent existing-workbench UI:** implement the final identified design baseline across the existing header/navigation/workspace/inspector/editor and affected dialogs/feedback, with consistent typography, spacing, surfaces, copy and action hierarchy at agreed responsive sizes. The designer artifacts and interaction notes must specify ordinary and relevant empty/error/recovery states before implementation; material design decisions must not remain implicitly delegated to implementation. Match those artifacts in affected browser observations and retain explicit unverified acceptance gaps.

## Decisions and open questions

### Established direction

- Desktop-first/local-first companion; responsive composition is an extension of the accepted Precision direction.
- Wide navigation/workspace/inspector; compact hidden navigation and split only where usable; narrow successive full-width browse/edit with clear Back.
- One existing editor session preserving invalid input, selection and browsing context; drafts remain session-only.
- Minimum acceptable viewport width: 320 CSS px (user instruction, 15 November 2026). Behavior below 320 CSS px is outside this increment’s acceptance scope.
- Existing domain/application/host boundaries and presentation conventions remain constraints.

### Proposed interaction policies — for user/design agreement

| Question | Initial candidate | Decision needed |
| --- | --- | --- |
| Breakpoints and minimum widths | Retain 1120 CSS px as an initial wide/compact candidate; explore a browse/edit boundary around 880 CSS px, since the current 768 split is not usability evidence. | Designer recommends thresholds from actual existing controls, long labels, available height and zoom; settle exact boundaries and representative sizes before implementation. |
| Narrow entry | Selecting a token updates selection; an explicit Edit/Inspect action opens its full-width inspector. | Confirm this two-step entry versus opening directly on selection; choose labels for read-only/group inspection. |
| In-app Back | Return to browsing with draft intact, without a departure prompt. Preserve an obvious selected-token reopen affordance. | Confirm hidden-draft indication and reopen placement. Browser Back remains the existing browser behavior, not a new in-app route. |
| Scope/search while a draft exists | Preserve the existing ability to change scope/query without replacing the token session; another-token selection invokes the existing guard. | Confirm how the hidden/out-of-scope selected token is shown/reopened and how selection/scroll restoration falls back after filtering. |
| Resize between split and narrow | If inspector had focus, show inspector; otherwise show browsing. Return to split without discarding the remembered narrow surface. | Confirm focus-based policy versus always showing the selected inspector; cover initial load with/without selection and a collapsed inspector. |
| Apply/Cancel | Keep the current inspector surface after either explicit action; Back stays a separate action. | Confirm whether successful Apply or Cancel should instead return to browse; no automatic route change is assumed. |
| Focus | Edit entry focuses inspector heading; Back returns to invoking token/action, or workspace heading when absent. Drawer close returns to its trigger; breakpoint transitions move focus only if its current surface becomes hidden. | Confirm exact targets/fallbacks, scroll restoration and interaction with open dialogs. |
| Collapse state | Preserve user collapse choices during a page session; use drawer navigation at compact widths. | Confirm whether compact-to-wide restores earlier collapse choices. No persisted preference is proposed. |
| Status/recovery placement | Keep current safety information reachable; reflow existing messages before considering concise routine-status consolidation. | Decide whether copy/consolidation is necessary for narrow space; actionable warnings and independent-backup guidance must remain available. |

These are bounded shell questions, not new canonical-model decisions. Record their
agreed answers here and reconcile affected owning documents before implementation;
do not silently close the broader open questions. Visual inventory, Details,
relationships, comparison, interchange, PWA installation/offline and additional
engine qualification remain deferred.

## Verification approach

Current phase is design preparation: source/document inspection, static artifact
review and prose/link checks. No application tests, build, browser qualification
or application harness work is authorized by this draft. Coordinator artifact
checks do not constitute the later analyst design review or runtime acceptance.

For eventual authorized implementation, use the [shared verification rules](../workflow/agent-roles.md#proportionate-verification):

- Essential functional checks: focused session/transition behavior tests for AC-3–5, plus bounded real Chrome observations/screenshots and keyboard checks for AC-1–8. Record exact viewport/zoom and state, not only a claimed device preset. A useful proposed sample is wide 1440×900, half-screen 960×800, narrow 800×800 and phone 390×844 and minimum-width 320×720, with one short-height/zoom reflow case and checks immediately either side of chosen thresholds; finalize with the design.
- Relevant integrity checks: prove resizing/Back/drawer actions do not issue mutation requests or create duplicate sessions; existing Apply/Cancel/departure and disabled states remain authoritative. Reuse existing targeted tests rather than opening a storage stress campaign.
- Representative performance: ordinary supported project navigation/reflow remains responsive; no new worst-case resource or maximum-project guarantee is proposed.
- Excluded optional qualification: multi-engine/device matrices, physical mobile keyboard certification, exhaustive accessibility audit, maximum-size inventories, unusual lifecycle/resource cases and any restarted earlier qualification. Representative narrow/zoom/keyboard checks above remain current delivery requirements, not silently deferred hardening.
- Planning budget: coordinator allocated **10 aggregate documentation-check minutes**, shared across agents; approximately **8/10 minutes** used in total (analyst 1, designer 3, coordinator 4; estimates). Zero application harness repairs. Static Quick Look rendering required a sandbox exception after sandbox initialization failed; `sips` could not decode SVG. A rendered preview exposed a narrow-toolbar overlap, corrected by the designer and visually rechecked. These static artifact checks are not application acceptance. Prior application-qualification history is not counted as zero or reopened; each increment retains its own stopped record.
- V2 artifact follow-up: the user explicitly requested coordinated Projects/workbench V2 and React decomposition after committing the scope refinements as `1591757`. Prior V1 documentation review remains stopped at approximately 10/10 minutes. A bounded **8 additional aggregate minutes** covers only the newly requested V2 artifact review (designer up to 3, coordinator up to 5), for an approximately 18-minute cumulative planning ceiling. No application test/build/qualification or harness work is included; stop at the ceiling or earlier for low value. This does not reset any earlier campaign or authorize implementation.
- Future implementation/review budget: proposed starting ceiling **30 aggregate verification minutes and two harness-repair cycles**, to be assessed and recorded by the coordinator before verification. Planning time is not a new implementation allowance. Carry actual consumption between agents and snapshots; stop at a ceiling or earlier for tooling dominance/low value and record unmet criteria accurately. Resumption requires explicit bounded authorization.

## Design proposals and review

- Applicability: separate designer required for substantial responsive interaction decisions.
- Proposal: coordinated [Projects V2](../project/workbench-layout/projects-shell-v2.md), [workbench V2](../project/workbench-layout/workbench-shell-v2.md), [representative states](../project/workbench-layout/v2-state-sheet.svg) and [React component map V2](../project/workbench-layout/component-map-v2.md) are ready for user review. V1 artifacts remain historical inputs. V2 incorporates agreed scope but its remaining interaction/layout choices are proposals, not final agreement.
- Required states: wide expanded/collapsed shell; usable compact split and drawer; narrow browse with selection/draft indication; narrow edit with Back and Apply/Cancel; invalid input; no selection/group/read-only/unavailable; current error/recovery and dialog reflow. Show concrete sizes and the proposed transition/focus policies.
- User review: pending. Designer first presents its independent assessment/recommended direction and meaningful options. Prototype edits follow user direction approval. The coordinator presents actual artifacts and obtains approval of the identified revision for analyst review.
- Analyst review: **not started**; wait for explicit user approval of the identified design revision. Review against these criteria, boundaries and unresolved policies then; this initial contract drafting is not design review.
- Material revisions: return to user before renewed analyst review.
- Final contract/design agreement and implementation authorization: pending and distinct from approval for analyst review.

## Review baseline

Planning source inspection used the post-010 working tree on 15 November 2026,
not a frozen implementation-review snapshot. It covered the shell, responsive CSS,
layout hook, editor owner/session entry and departure/navigation owners; it did
not run the application or exhaustively inspect storage/recovery implementations.
The coordinator owns 010 closure/status and actual Git-state records. Before
implementation, record base commit, existing changes and agreed artifacts. Before
independent implementation review, freeze an exact snapshot including new files.

## Planning handoff — 15 November 2026

Increment 010 closed at the user’s instruction; see its criterion-linked deferred
acceptance register. A separate analyst drafted this contract; a separate designer
prepared initial static V1 and interaction notes. The user supplied the 320 CSS px
minimum and subsequently included the preceding Projects page and possible shared
page layout in the design discussion. The designer’s Projects recommendation is
proposed only and is not depicted in the workbench wireframes.

Coordinator inspected the static [rendered preview](../../output/increment-011-responsive-shell/responsive-shell-v1.png),
corrected one overlap through the designer and rechecked the updated rendering.
Changed Markdown local file targets and whitespace were checked. No application
code, tests or build changed or ran. No prior qualification campaign restarted.
No staging, committing or pushing occurred.

Next: user feedback on the identified responsive states and interaction policies,
and discussion of Projects content/layout and its intended delivery scope. Prepare
any resulting material design revision for user review; analyst design review has
not started. No final design/contract agreement or implementation authorization is
recorded.

## Projects design handoff — 15 November 2026

After committing the first planning handoff as `c8f0f2a`, the user confirmed that
React component decomposition should continue and requested the designer’s
Projects-page layout/content and shared-shell proposal. A separate designer
prepared Projects/shared-shell V1; no analyst design review occurred. Candidate
Projects stacking at 768px, list/Create/Restore order, identity prominence and
shared ApplicationShell/Header extraction remain proposed. Workbench V1’s exact
entry/Back/resize policies remain unresolved. Neither proposal is approved for
analyst review or implementation.

The designer used approximately one additional documentation-check minute; the
coordinator used approximately one for rendering/link/diff checks. Planning review
consumption is now approximately **10/10 aggregate minutes**, zero application
harness repairs. Static thumbnail cropping was handled by rendering a square
viewing canvas; the SVG remains unchanged. Checks stop here; no earlier application
qualification or implementation allowance is reset. No runtime check, test, build,
staging, commit or push was performed.

Next: user design feedback on Projects/shared-shell V1 and workbench V1, then an
identified revision approved for analyst review. Resolve any delivery-scope
amendment before final contract/design agreement and implementation authorization.

## Coordinated V2 design handoff — 15 November 2026

The user committed prior scope refinements as `1591757`, requested coordinated
Projects/workbench V2 and explicitly reiterated React component decomposition.
A separate designer prepared these identified artifacts:

- [Projects V2 notes](../project/workbench-layout/projects-shell-v2.md) and [sheet](../project/workbench-layout/projects-shell-v2.svg): selection and right-hand details, explicit Open project, selected-project backup, inline Create/Restore, 880px split and 320px browse/inspect.
- [Workbench V2 notes](../project/workbench-layout/workbench-shell-v2.md) and [sheet](../project/workbench-layout/workbench-shell-v2.svg): coherent existing UI, Projects-only project navigation, retained editor hierarchy, narrow Back/reopen and one-session constraints; no Undo/Redo.
- [Representative state sheet](../project/workbench-layout/v2-state-sheet.svg): current validation, reference/resolution, read-only/unavailable/recovery and creation/departure/restore treatments.
- [React map V2](../project/workbench-layout/component-map-v2.md): source-informed current-to-proposed paths, shared outer shell/header, project inspector/selection and backup coordination, workbench blocks and unchanged command/session authority.

The coordinator rendered all sheets, inspected them, and obtained focused fixes
for Projects desktop overflow/operation-label accuracy, identity formatting,
visible inspector collapse and a helper-owner path. Final previews are
[Projects](../../output/increment-011-responsive-shell/projects-shell-v2.png),
[workbench](../../output/increment-011-responsive-shell/workbench-shell-v2.png) and
[states](../../output/increment-011-responsive-shell/v2-state-sheet.png).
Some workbench sheet captions appear clipped in Quick Look despite correct SVG
coordinates; no renderer investigation/rebuild was undertaken. Main screen states
are reviewable. The SVGs remain editable sources, not runtime evidence.

Remaining user/design choices include exact 1120/880 thresholds, two-step narrow
entry versus direct inspection, focus/resize/scroll rules, inline project forms,
read-only project metadata, narrower row detail and routine-status consolidation.
Moving Request persistent storage to Projects is a designer proposal. Selected-
project backup needs analyst scoping of coherent snapshot/revision reads and
retained/ownership/error states; moving a button is insufficient. Current Create
completion still creates-and-opens, rather than merely selecting a row. The
capability inventory does not imply delivery of Delete, metadata editing or
external Import/Export in 011.

User review/approval for analyst review is **pending** for this identified V2 set.
No analyst design review, final contract/design agreement, application code edits,
test/build, runtime qualification, staging, commit or push occurred. The draft
contract’s detailed Projects behavior and any scope amendment must be reconciled
by the analyst only after user approval of the design proposal.

V2 checks stopped after approximately **7/8 aggregate minutes** (designer 2.5,
coordinator 4.5; estimates), zero application harness repairs. Prior V1 remains
stopped at 10/10, cumulative planning estimate 17/18. Static rendering, focused
artifact corrections and local link/whitespace checks do not reopen application
qualification or authorize implementation. Next: user feedback, material V2
revisions if needed, then explicit approval of an identified set for analyst review.

## Agreed amendments

None. This document is an initial proposal and must not be relabeled Agreed by an agent.
