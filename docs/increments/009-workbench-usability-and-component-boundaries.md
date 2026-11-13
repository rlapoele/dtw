# Increment 009: Workbench usability and component boundaries

- Contract status: Draft
- Delivery status: Not started
- Prepared: 13 November 2026
- Agreement: the user agreed the proposed direction and authorized review mockups on 13 November 2026. Final contract/design agreement and implementation authorization remain pending. No application implementation is authorized.
- References: [vision](../project/vision.md), [product concept](../project/product-concept.md), [principles](../project/principles.md), [architecture](../project/architecture.md), [visual direction](../project/visual-direction.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md), [Increment 008](008-react-state-and-workbench-composition.md), [agent workflow](../workflow/agent-roles.md).

## Outcome

Make existing browsing and inspection easier to understand: controls match the
active view, routine information is readable, and the color editor uses space
more effectively. Align React ownership with these functional blocks while
preserving authored data, draft sessions and retained-command guarantees.

This is a bounded usability and maintenance increment, not a new token capability
or a replacement visual design.

## Review basis and functional blocks

The 13 November review inspected rendered normal desktop states before examining
React composition: project entry, empty workbench, token/group creation, literal
and reference editing, resolution, All content, group inspection and diagnostics.
Sparse synthetic data was used. Restore and exceptional recovery were mapped from
source, not visually audited; responsive and accessibility qualification were not
performed. This proposal records the relevant observations durably without making
the temporary local screenshot gallery an implementation dependency.

| Functional block | Current owner | Proposed treatment |
| --- | --- | --- |
| Project catalogue and creation | App / useProjects | Focused copy changes; retain ownership |
| Header and backup entry | WorkbenchHeader / Workbench | Keep rendering separate; extract cohesive backup coordination |
| Navigation and browser context | ProjectNavigation / Workbench | One explicit browser-view state, separate from inspected selection |
| Search and token catalogue | TokenBrowser / ProjectedTokenList | View-specific toolbar and accurate empty-state guidance |
| Complete content inventory | AllContent | Retain complete membership access; remove irrelevant controls |
| Inspector header and previews | WorkbenchInspector / EditableTokenInspector | Contextual naming; preserve one shared editor session |
| Literal/reference editing | EditorFields / ColorFields / useTokenEditor | Compact layout and meaningful editor sections |
| Resolution, metadata and group details | EditorFields / WorkbenchInspector | Readable summaries with disclosed technical details |
| Exact source | ExactSource | Preserve revision-aware, lazy/bounded access |
| Creation, diagnostics, departure, restore | Existing components and hooks | Retain workflow authority and guarantees |
| Lifecycle and status | Workbench | Extract lifecycle coordination; keep small footer inline |

Observed issues: All content inherits color search and the previously visited
group's rename action/highlight; inspection foregrounds JSON/UUIDs and empty `[]`;
the literal editor places substantial content above the channels; routine copy
includes slogans, implementation language and inaccurate root-creation guidance
inside an empty group. These are the scope basis, not evidence for a global redesign.

## Scope

Included:

- Coherent navigation, headings and controls for All tokens, a group and All content.
- Readable group/resolved-value/trace summaries and meaningful empty diagnostics.
- Contextual inspector naming, focused editor spacing and task-specific copy.
- Cohesive lifecycle and backup coordination extracted from Workbench; a shared
  renderer file-admission helper for both backup entry points.
- Focused editor sections with narrow props and one shared editor session.

Excluded: generalized inventory search, global redesign, new dependencies/stores/
router, domain/application/worker behavior changes, storage or backup formats,
resource limits, new editing capabilities, history, import/export, privacy/auth,
full PWA/offline delivery, Electron and renewed qualification of Increments 007/008.

## Design direction V1 — selected for mockups

The separate designer recommends retaining the neutral Precision three-pane
workbench and improving context, hierarchy and density. The user selected this
direction for mockups on 13 November 2026; it is not final design agreement or
implementation authorization.

1. **Explicit browser context.** Use “All tokens” consistently in navigation and
   heading. Exactly one navigation item is active. The inspected token/group is
   independent of the browser view; changing views does not discard its draft.
2. **Complete All content inventory.** Keep its library entry and progressive,
   native membership rendering. Remove color search and Rename group from this
   view. Preserve the catalogue search query for returning to token browsing.
   Suggested explanation: “Every group and token, including items outside the
   group tree.” Keep identity disambiguation and access to every entry; no
   virtualization or new filter semantics.
3. **Contextual inspection.** Title the pane “Inspector”; selected content says
   “Color token” or “Group · Read only”. Groups lead with name/readable path and an
   explicit unavailable-path state where needed. Project/group identities and
   structured path detail remain accessible in “Identity and path details”.
4. **Readable resolution.** Lead with specimen, color-space name, named channels
   and alpha, retaining full available values without silently rounding them.
   Trace steps lead with readable paths and reference relationships; identities
   remain available. Empty diagnostics say “No resolution issues.” Unresolved
   outcomes and nonempty diagnostics remain prominent. Raw derived resolution
   data has a separate disclosure from the existing “All authored data” source.
5. **Spacing-first editor compaction.** Reduce repeated heading/help spacing and
   gaps before channel controls. Keep Alpha in the normal form and persistent
   Apply/Cancel actions. Contextual help may hold explanatory guidance, never
   essential errors, baseline review, warnings or recovery actions.
6. **Task-specific copy.** Remove the central/sidebar slogans. Empty-group guidance
   refers to creating in that group. Reference guidance explains use of the whole
   selected color value. Preserve clear browser-local applied retention,
   session-only drafts, backup limitations and exceptional-state instructions.

Meaningful alternatives considered: moving All content under diagnostics reduces
routine navigation but hides complete discovery; keeping JSON expanded beside
summaries adds visual weight; widening the inspector changes the pane balance.
V1 recommends keeping All content discoverable, disclosing technical detail and
trying spacing changes before altering pane widths. The user selected this direction
for mockups; concrete presentation remains subject to review.

### Selected context transitions for mockups

- Group view: creation defaults to that group; rename targets that group.
- All tokens and All content: creation defaults visibly to Project root, never the
  last visited group. Missing original groups must not silently retarget a form.
- All content entry preserves inspected selection and unfinished editor input.
- Show selected token returns to All tokens and clears its search, preserving the
  existing reveal purpose. Choosing a different entity uses the existing guard.

## Architecture proposal

- Replace overlapping `group`/`allContent` state with a discriminated browser-view
  union. Derive navigation, heading, toolbar and creation defaults from it; keep
  inspected selection and editor lifetime separate.
- TokenBrowser composes view-specific controls/content. ProjectNavigation receives
  the active view rather than inferring it from group alone.
- Extract lifecycle listeners/recovery coordination and backup selection/staging/
  download coordination into cohesive owners with explicit callbacks. Keep
  authoring command, readback, creation and restore authority from Increment 008;
  do not create a second command owner or one replacement omnibus controller.
- Share the existing 16,777,216-byte renderer admission rule before file reading;
  worker-side validation remains authoritative and unchanged.
- Extract meaningful sections such as ReferenceFields, TokenMetadata,
  ResolvedTokenPanel and GroupInspector, with focused data/actions. Names are
  illustrative. Keep useTokenEditor above header and fields, with no duplicated
  drafts, revision-driven editor remount or callback-driven command reissuance.
- Reuse existing controls, semantic theme utilities, shared Icon and source access.
  Extraction serves responsibility boundaries, not a file-length target.

## Acceptance criteria

- **AC-1 — Coherent browsing:** exactly one browser view drives desktop/drawer
  navigation, heading, content and controls. All content has no color search,
  group rename action or stale group highlight; returning restores catalogue query.
- **AC-2 — Context transitions:** creation and reveal follow the agreed transitions
  above. View changes preserve inspected selection/raw draft input. Different
  entity selection retains departure protection; missing targets do not retarget.
- **AC-3 — Readable inspection:** primary group/resolution/trace summaries are
  readable. Empty diagnostics use prose. Failures, unknown paths and nonempty
  diagnostics remain explicit. Full identities, raw derived detail and exact
  authored source remain accessible without invented paths or transformed values.
- **AC-4 — Editor layout:** the agreed representative desktop design reduces space
  before channels and improves access to Alpha without hiding it. Actions remain
  readily accessible; compact layouts have no clipped controls or unintended
  horizontal page scrolling. Required guidance and errors remain visible.
- **AC-5 — Copy and naming:** affected instructions match the actual scope, parent
  and action; pane naming covers tokens/groups. Applied retention, draft lifetime
  and independent-backup limitations stay understandable.
- **AC-6 — Component ownership:** source inspection demonstrates the boundaries
  above, narrow section props, one editor session and shared admission behavior.
  No global store, generic workflow framework or duplicated command owner appears.
- **AC-7 — Integrity preservation:** touched paths retain invalid/raw draft text,
  baseline review, write blocking, rejected/unknown/retained outcome distinctions,
  no replay, completion consumption, current-revision restore protection and
  coherent async readback. Existing keys, hidden-pane lifetime, fences and bounded
  membership/source access remain effective.
- **AC-8 — Interaction and presentation:** affected controls/disclosures retain
  labels, keyboard operation, visible focus and error/disabled feedback. Apply,
  Cancel, departure-dialog and drawer focus retain their established behavior.
  Presentation conventions and owned component composition contracts are preserved.

## Decisions and design review

- Established: Precision direction, presentation conventions, token/retention
  semantics and Increment 008 ownership guarantees, as linked above.
- Analyst: separate agent prepared the draft scope/criteria from source and audit.
  This is requirements drafting, not review of the designer proposal.
- Designer: separate agent supplied the independent V1 text direction above.
- User direction selection: agreed on 13 November 2026; mockup preparation explicitly
  authorized, without application implementation.
- Design artifact: [Design V1 mockups and review notes](../../prototypes/increment-009-v1/DESIGN-V1.md),
  prepared by the separate designer on 13 November 2026. Run instructions are in
  that document. [Screenshot gallery](../../output/increment-009-design-v1/index.html)
  and [rendered observations / artifact snapshot](../../output/increment-009-design-v1/review.md)
  cover group → All content with a preserved draft, literal editor at measured
  1280 × 800 CSS pixels, resolved/unresolved inspection, group details, validation,
  empty-group creation context, reference editing and compact navigation.
  Fixtures illustrate presentation only; they do not implement or qualify the
  proposed production component boundaries, storage, source or command semantics.
- Approval of the identified artifact for analyst review: pending. Analyst design
  review has not occurred and must follow user approval.
- Final contract/design agreement and implementation authorization: pending.
- Material revisions return to the user before renewed analyst review.

The [project workflow](../workflow/agent-roles.md#workflow) requires the designer's
direction to reach the user before prototype work, then user approval of the
identified proposal before analyst review. Preparation does not skip either step.

## Proposed implementation and verification sequence

After final agreement and explicit implementation authorization only:

1. Implement browser-view transitions and matching toolbar/navigation context.
2. Extract lifecycle/backup owners and meaningful inspector sections, preserving
   state lifetimes and command authority; improve summaries, spacing and copy.
3. Freeze an identified snapshot for a fresh independent reviewer. Resolve
   findings with targeted checks, then record criterion-linked completion evidence.

Proposed shared implementation verification ceiling: **30 aggregate minutes and
two harness-repair cycles**, including developer/designer/reviewer checks and
waiting. This is a ceiling, not a target; reserve independent-review time within it.
It covers affected normal workflows rather than exceptional qualification.

- Focused behavior tests: view transitions/parent defaults and shared admission;
  controlled existing-host tests for materially touched lifecycle/backup paths.
- One `npm run build` for existing typechecks and production bundling. No redundant
  separate typecheck campaign or blanket full-suite rerun without concrete risk.
- One representative Chrome walkthrough: group → All content → catalogue, query
  applicability, selection/draft preservation, readable successful/unresolved/group
  details, technical disclosures, Alpha/actions, Apply/Cancel focus and compact drawer.
- Focused source/controlled evidence for touched integrity guarantees, including a
  normal backup entry if changed. No exhaustive restore, fault or lifecycle campaign.
- Preserve existing ordinary responsiveness and bounded rendering; no new maximum
  workload or benchmark claim. Check affected contrast/readability and keyboard
  behavior; this is not full accessibility or additional-engine qualification.

Stop at either ceiling or earlier for tooling dominance/low value. Carry consumed
effort and repair cycles across handoffs; unresolved criteria remain unverified.
Resumption after a stop requires a separately authorized bounded follow-up.
Increment 007 qualification allowance remains **zero**; original Increment 008
checks and its Apply follow-up remain **stopped**. This proposal resets neither.

Planning used document/source review only, approximately 10–15 aggregate minutes
(estimate across coordinator, analyst and designer), zero harness repairs; stopped
after focused Markdown/link checks. No tests, builds or browser sessions were run
for this proposal. Future implementation checks remain proposed and unstarted.

Subsequent authorized mockup preparation used a separate 15-minute aggregate
render-review ceiling and at most one harness repair. Approximately 12–15 minutes
(estimate) and one stylesheet-scanning repair were used; checks are stopped.
The linked rendered observations distinguish mockup checks/corrections from
application qualification. No production tests, builds or implementation ran.
This does not consume or activate the proposed implementation allowance above.

## Review baseline and amendments

Planning baseline: `58053d6`. Recheck HEAD and user changes before implementation;
do not assume this baseline will remain current. Before independent implementation
review, identify the exact commit or diff/new-file manifest. Developer and reviewer
start with fresh contexts and authoritative contract/design references.

No agreed amendments. Staging, committing and pushing remain with the user.
