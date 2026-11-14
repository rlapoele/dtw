# Increment 010: Shell and workspace slice proposal

- Contract status: Agreed
- Delivery status: Partially completed — implementation and independent review finished; native-browser/compact acceptance remains unverified
- Agreement: on 15 November 2026 the user explicitly agreed this contract and authorized implementation after committing and pushing the proposal. This is the second-slice amendment to [Increment 010](010-component-oriented-presentation.md); later slices remain outside scope.
- Baseline: `32ec593`, inspected on 15 November 2026 after the committed first slice.
- References: [target organisation V1](../project/workbench-layout/presentation-organisation-proposal-v1.md), [decomposition V1](../project/workbench-layout/component-map-v1.md), [current ownership](../project/workbench-component-organisation.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [role workflow](../workflow/agent-roles.md).

## Outcome and boundary

Give the existing open-project screen recognisable shell, navigation, workspace,
creation and recovery owners, while retaining the same usable workbench and one
editor session. This is existing-code reorganisation, not delivery of the replacement
responsive interface or mockup features. The first slice remains Partially completed
with native acceptance gaps; committing/pushing is not evidence those checks passed.

Recommended boundary: move the existing shell and its adjacent coordination hooks,
move its existing section modules, and extract only the existing workspace toolbar
and footer. Keep command callbacks and recovery/baseline orchestration in Workbench.
This progresses the named hierarchy without rewriting its 640-line coordinator into
a large new controller hook or redistributing mutation authority.

## Exact proposed moves and extractions

Paths are relative to `src/presentation/`. `features/workbench/` is abbreviated
`old/` in this table only. Braced names enumerate exact files, not wildcard scope.

| Current | Target and disposition |
| --- | --- |
| `app/Workbench.tsx` | `workbench/Workbench.tsx`; same export, props, state, refs and hook call order. App changes its import only. |
| `old/coordination/{useWorkbenchLayout,useWorkbenchLifecycle,useProjectCommands,useProjectReadback}.ts` | `workbench/{useWorkbenchLayout,useWorkbenchLifecycle,useProjectCommands,useProjectReadback}.ts`; unchanged implementations and call ownership. |
| `old/coordination/readback.ts` | `workbench/readback.ts` retains `resolvedColor` and `failureText`; extract the three label helpers described below. |
| `old/components/WorkbenchHeader.tsx` | `workbench/WorkbenchHeader/WorkbenchHeader.tsx`; existing header intact, no speculative ProjectContext/ProjectActions files. |
| `app/WorkbenchNavigation.tsx` | `workbench/WorkbenchNavigation/WorkbenchNavigation.tsx`; keep NavigationPane and NavigationDrawer exports together as the public container module. |
| `old/browser/ProjectNavigation.tsx` | `workbench/WorkbenchNavigation/NamespaceTree/NamespaceTree.tsx`; rename export to NamespaceTree, preserve actual semantics. |
| `old/browser/browser-view.ts` | `workbench/workspace-view.ts`; retain BrowserView and creationParent exports. Shared shell/navigation/workspace dependency, not a private workspace child. |
| `old/browser/TokenBrowser.tsx` | `workbench/TokenWorkspace/TokenWorkspace.tsx`; rename export to TokenWorkspace. |
| Existing header and conditional search/rename block in TokenBrowser | `workbench/TokenWorkspace/WorkspaceToolbar/WorkspaceToolbar.tsx`; same sibling elements and conditionals, no added wrapper. |
| `old/browser/ProjectedTokenList.tsx` | `workbench/TokenWorkspace/TokenTable/TokenTable.tsx`; rename export to TokenTable, retain current button/list presentation. |
| `old/browser/AllContent.tsx` and `all-content.ts` | `workbench/TokenWorkspace/AllContent/AllContent.tsx` and `all-content.ts`; keep memoised MembershipBlock local. |
| `old/creation/{CreationDialog.tsx,useCreationForm.ts,naming-preview.ts}` | `workbench/CreationDialog/{CreationDialog.tsx,useCreationForm.ts,naming-preview.ts}`; same exports and behavior. |
| `old/recovery/{DepartureGuard,RetentionRecovery,ProjectDiagnostics}.tsx` | `workbench/WorkbenchRecovery/{DepartureGuard,RetentionRecovery,ProjectDiagnostics}.tsx`; no new recovery controller. |
| Existing footer in Workbench | `workbench/WorkbenchStatus/WorkbenchStatus.tsx`; only the current footer, not the separate session notice. |
| `pathLabel`, `identityLabels`, `namespaceEntryDetails` in readback.ts | `token-display/identity-labels.ts`; pure shared presentation helper, exact bodies/signatures preserved. |

The last row resolves a demonstrated dependency: AuthoredValue already consumes
identityLabels, which calls pathLabel; navigation, lists and All content use these
helpers too. Moving them into private shell coordination would perpetuate a shared
renderer → private workbench dependency. `token-display/identity-labels.ts` owns
namespace/identity display only, with existing application DTO/domain imports and
no React, host, session or mutation dependency. Update callers directly; do not
re-export helpers through old readback or duplicate their logic. `resolvedColor`
and `failureText` remain workbench-level common helpers, not inside a private child.

This intentionally refines the illustrative target tree: workspace-view lives at
the nearest common shell owner; navigation containers stay cohesive rather than
adding wrapper components; shared label helpers precede the later display migration.
The tree is guidance, not a requirement to create every sketched file.

## Composition and ownership contracts

- Workbench retains selection/view/query/error/notice/dirty/pending/editorVersion,
  all refs, useMemo/effects, hook calls, source requests, request/choose/open,
  creation callbacks, resume/retry actions, completion.current assignments and
  onApply. Keep their captured values, execution order and deferred closures.
- Header remains presentational with its existing props. NavigationPane/Drawer
  still receive controlled state/actions and navigation children. NamespaceTree
  keeps existing data/action props, current view meaning and exact selection IDs.
- TokenWorkspace keeps its current section-specific props and recovery/diagnostics
  slots. Toolbar receives only view/title context, query, blocked state and the
  existing query/create/rename callbacks; it cannot command a host or own selection.
  TokenTable and AllContent keep their current data/action APIs and keys.
- WorkbenchStatus receives token count, busy/unknown/readFailure/writable display
  values and an onRequestPersistentStorage callback. Workbench retains the existing
  requestPersistentStorage().then(setNotice) orchestration; no adapter import in
  the footer renderer. Keep footer text precedence and classes exactly.
- CreationDialog and recovery modules retain existing narrow contracts. Workbench
  keeps inline lifecycle/read-failure and form-baseline sections and their callbacks
  for now. Moving modules does not move useCreationForm's call or baseline authority.
- No leaf gains a broad host/controller/store prop, draft setter or omnibus hook
  result. Keep public component entries, required refs and callbacks; no barrels,
  compatibility forwarding modules, provider, store or new dependency.

Workbench's return keeps the same DOM order: skip link, header, session notice,
workbench grid (pane/workspace/inspector), footer, navigation drawer, conditional
departure guard, restore dialog, creation dialog. Extraction must not introduce a
wrapper or relocate the inspector. Preserve App's project-ID key and the existing
EditableTokenInspector key `[selection.id, editorVersion]`. One useTokenEditor
owner remains in the current inspector; no second editor for navigation or compact
layout. A module move is not permission to remount an editor on ordinary rerenders.

## Intentional mixed tree and exclusions

`features/workbench/inspector/`, `color/`, shared AuthoredValue/ExactSource/swatch
and the alternate `browser/TokenList.tsx` stay at their current locations. Only
their imports of moved common modules/helpers change. The alternate TokenList is
still exercised by identity-presentation tests; retain its implementation and
coverage, rather than deleting it or making it the retained screen renderer.

The later inspector/display slice will migrate these remaining owners. Its
integer-rgb helper remains shared by session and ColorFields until a nearest-common
TokenEditor location is agreed. No private-sibling coupling or duplication is
introduced to match the illustrative ColorEditor tree. Token-display currently
gains only the real shared identity helper, not empty future renderers.

No new visual inventory, relationship graph, Details editing, view modes, specimen,
responsive behavior, breakpoints, comparison system, Undo/Redo or interchange.
No token semantics, naming/collision rule, schema/codec, host protocol, dependency,
CSS/theme/class-merging API or generic UI changes. Backup remains cross-screen under
project-backup, separate from interchange and unchanged apart from necessary imports.

## Acceptance criteria

- S2-AC-1 — The move/extraction table is implemented without duplicate or forwarding
  modules; all live source/test imports resolve and the current ownership map describes
  the deliberate mixed tree. Existing test assertions/meaning remain intact.
- S2-AC-2 — Workbench state, refs, hook ownership/order and callback completion
  authority remain unchanged. Exactly one token-editor session with the same keys
  preserves raw invalid input and the existing creation/departure behavior. Selection,
  search, All content reveal progress and same-revision native nodes retain lifetime.
- S2-AC-3 — Commands/readback/lifecycle retain duplicate-issue blocking, unknown-result
  checks, consume-once completion, retained-read retry without replay, stale-read/write
  fences and changed-baseline review. Restore cancel/open/restage and same/different
  project transitions keep current protections and Workbench orchestration.
- S2-AC-4 — Rendered elements/order/nesting, IDs, roles, labels, text, conditions,
  class strings, forwarded refs and event behavior are preserved. Renames to TokenTable
  and NamespaceTree add no table/tree roles or new keyboard model. Focus targets,
  drawer/dialog containment/return, skip link and desktop/compact behavior stay current.
- S2-AC-5 — Label helper extraction preserves exact identity/namespace disambiguation,
  reserved labels and fallback behavior, without shared rendering depending on private
  shell/editor code. Component contracts remain narrow and architectural boundaries
  unchanged; no future scaffolding or functionality is introduced.

## Implementation and review plan

After agreement/authorization, one fresh-context developer performs the mechanical
moves/import updates and bounded extractions, then freezes an exact diff/new-file
manifest for a separate fresh reviewer. Preserve source snapshots while reviewing;
the reviewer derives expectations from this contract before developer conclusions.
Update current ownership/path documentation after delivery; leave frozen evidence,
historical prototypes/hashes and vendored references untouched.

Affected live tests include workbench-coordination, all-content, increment-009 and
identity-presentation under `test/presentation/`, plus inspector/session callers of
moved helpers. Search all live source/test references, including App's Workbench
import and dynamic Selection imports. Existing aliases/configuration already cover
the destinations; no Vite/Vitest/TypeScript discovery or build-topology change.

No new designer exploration is required while markup/behavior stay unchanged.
Material visual or interaction decisions return to the established user/designer/
analyst sequence. Neither the saved mockups nor this analyst draft grants design
implementation authority beyond the agreed behavior-preserving slice.

## Verification and stopping

Planning: documentation/source/link review only, shared coordinator/analyst ceiling
ten aggregate minutes and zero repairs; analyst approximately five minutes used
(estimate). No tests, builds or browser actions during this draft.

Proposed after S2 authorization: one cumulative allowance of at most 30 aggregate
verification minutes and two harness-repair cycles across developer/reviewer/
coordinator, using less where sufficient. This is a new bounded S2 allowance, not
resetting or resuming the first slice's stopped approximately 21/30 minutes or its
native acceptance gaps. Record consumption and remaining time at each handoff.

- Source/diff/import comparison maps to every criterion; explicitly compare unchanged
  hook bodies, keys/positions, callback captures, DOM/classes and extracted helper
  bodies. Review public/private dependency direction and generic UI invariants.
- Run affected existing focused tests for identity, All content, coordination,
  editor/session and naming plus one final `npm run build` (includes four typechecks);
  avoid duplicate typecheck/full-suite campaigns. Add only meaningful extraction
  regression coverage where existing checks lack it, not path/implementation mirrors.
- If an existing native Chrome surface is available cheaply, observe ordinary
  browse/select/search/All content, one invalid draft with Keep editing/Cancel and
  navigation focus, creation and Projects return; desktop plus compact only when
  viewport can be established. Do not promise tools that are unavailable: the prior
  dedicated Chrome, screenshot and compact-viewport limits remain known constraints.
  Source/controlled-host tests do not establish native focus or geometry parity;
  report missing runtime evidence explicitly and keep affected criteria unverified.
- No alternate browser stack, connector/profile installation, new harness, maximum
  data/performance campaign, rare fault matrix or old 007/009 qualification restart.
  Ordinary small projects suffice; no new performance guarantee follows from moves.

Stop at either ceiling or earlier for low value/tooling dominance. Do not spend
repairs on unavailable connector/viewport capabilities or silently waive criteria.
Report demonstrated defects separately from evidence gaps. New agents/snapshots
do not reset consumption; resumed stopped verification needs explicitly authorized
bounded follow-up. Completion of S2 does not complete the entire roadmap, close 010,
or relabel the first slice's unobserved native checks passed.

## Decisions needed and amendments

Proposed for user agreement: the exact second-slice boundary, source-informed shared
helper/ownership exceptions, S2-AC-1 through S2-AC-5 and bounded verification approach.
No unresolved product/model/technology decision is silently settled. Subsequent
inspector/display and functional roadmap work remain outside this draft.

Agreed amendments: none. Implementation not started. Leave staging, committing and
pushing to the user.

## Planning handoff — 15 November 2026

A separate analyst inspected the committed source and drafted this scope; the
coordinator checked the boundary against the overall component-organisation
objective, existing lifetimes/semantics and the first slice's evidence limits.
All 41 local links checked across this proposal, the main 010 record and current
status resolve, and whitespace checks pass. Approximately eight of ten aggregate
planning/source/documentation-review minutes used (estimate: analyst five,
coordinator three), zero repairs; checks stopped. No implementation, tests, build
or browser work occurred. Next: user agreement to this identified proposal and
implementation authorization under the project workflow.

## Agreement and implementation authorization — 15 November 2026

The user instructed: “Committed & pushed. I agree to this contract and authorize
implementation.” This authorizes the exact move/extraction table, shared identity
helper boundary and S2-AC-1 through S2-AC-5. Earlier Draft/pending-authority wording
records proposal history and is superseded here. Inspector/display migration and
replacement-interface capabilities remain outside this agreement.

Implementation baseline: `d3a7e9c`, clean working tree before coordinator
authorization/status documentation. One fresh developer writes code, then freezes
the source for a separate fresh reviewer. No new visual exploration is needed
for the agreed behavior-preserving scope.

The single S2 verification ceiling is active: at most 30 aggregate minutes and two
harness-repair cycles, stopping earlier for low value/tooling dominance. Initial
allocation: developer ten, fresh reviewer seven, coordinator ten, reserve three;
these share one ceiling. Carry actual time and repair consumption at every handoff.
Use focused affected tests and one final build. Known native Chrome/screenshot/
viewport limitations do not authorize alternate-stack setup or repair; optional
ordinary browser observations must be labeled accurately, with affected runtime
criteria unverified where unavailable. First-slice and older qualification stops
remain unchanged. Agents leave staging, committing and pushing to the user.

## Implementation handoff — 15 November 2026

**S2 implementation and independent review finished; delivery Partially completed
with explicit native-browser evidence gaps.** No actionable source or documentation
finding remains. This delivers the agreed reorganisation slice, not the later
inspector/display migration or any replacement interface functionality.

### Delivered organisation

- Workbench and its coordination hooks now live under `src/presentation/workbench/`.
  Header, navigation/NamespaceTree, TokenWorkspace/TokenTable/AllContent, creation
  and recovery modules have the agreed named owners.
- The existing workspace toolbar and footer are extracted to WorkspaceToolbar and
  WorkbenchStatus. They receive controlled display/action props and add no DOM
  wrappers, independent selection/session state or host/adapter authority.
- Pure `pathLabel`, `identityLabels` and `namespaceEntryDetails` live under
  `token-display/identity-labels.ts`, with unchanged bodies and signatures.
- Workbench retains its refs/state/hooks, command/callback/completion authority,
  inline recovery/baseline logic and inspector position/key. App changes its import
  only; the old inspector still owns the single useTokenEditor session.
- Current import/test/documentation references follow real paths. Inspector/color,
  AuthoredValue/ExactSource/swatch and the alternate tested TokenList remain in the
  intentional mixed tree, with moved-helper imports only.

The [move map](../../output/increment-010-shell-workspace/moves.json) records 20
moves and three extractions; the [ownership map](../project/workbench-component-organisation.md)
describes current rather than future organisation.

### Review snapshot and acceptance evidence

Base: `d3a7e9c`. The final [source patch](../../output/increment-010-shell-workspace/review-source.patch)
and [59-entry manifest](../../output/increment-010-shell-workspace/review-source-manifest.json)
identify the reviewed source/test/current-path documentation. The initial
[R1 patch](../../output/increment-010-shell-workspace/review-source-r1.patch) and
[R1 manifest](../../output/increment-010-shell-workspace/review-source-manifest-r1.json)
are preserved; the only delta to the final snapshot is two historical wording
corrections in the ownership document. Source/tests did not change after the build.
Coordinator contract/status/output reports are outside this source snapshot.

| Criterion | Evidence and remaining limits |
| --- | --- |
| S2-AC-1 | Source/import/move checks and fresh independent review verify exact destinations, no forwarding/duplicate/future modules, retained test meaning and current mixed-tree documentation. |
| S2-AC-2 | Source comparisons preserve Workbench orchestration, editor location/key and hook lifetime. In-app smoke preserves an invalid raw draft across filtering, reveal, All content and Keep editing, plus unfinished creation input. Native same-node identity instrumentation and full focus parity remain unverified. |
| S2-AC-3 | Unchanged command/readback/lifecycle and callback bodies independently reviewed; affected controlled tests pass. Native rare recovery, changed-baseline/restore interleavings and their focus states were not induced or replayed. |
| S2-AC-4 | Exact toolbar/helper and normalized shell/footer source comparison, static-render regressions and reviewer inspection preserve DOM/classes/labels/conditions; TokenTable and NamespaceTree retain existing list/button semantics. In-app ordinary flows pass; native Chrome, exact compact geometry, screenshots and full drawer/dialog focus remain unverified. |
| S2-AC-5 | All three identity-label bodies/signatures compare exactly; direct imports use the shared pure owner. Reviewer verified narrow component contracts and unchanged application/domain/host/config/CSS/dependency boundaries. |

Developer [report](../../output/increment-010-shell-workspace/developer-report.md):
49 existing focused tests across six files and two new toolbar/footer variant
regressions pass, **51 total**. One final `npm run build` passes all four typechecks
and Vite bundling. The existing large-chunk warning remains; no performance claim
is made. A new test's overly broad disabled matcher was corrected without changing
production code; this was not a browser/harness infrastructure repair.

Fresh [independent review](../../output/increment-010-shell-workspace/reviewer.md)
derived expectations before inspecting implementation, verified all 59 entries and
patch integrity, and found no application-source defect. Its low-priority ownership
document attribution finding was corrected by the developer and independently
rechecked with the entire final manifest. No actionable findings remain. It ran no
duplicate build/test suite, browser setup or mutation experiment.

Coordinator [in-app Chromium observations](../../output/increment-010-shell-workspace/browser-observations.md)
cover a prior disposable project's reopen, select/search/reveal, invalid draft,
All content, departure Keep editing/Cancel, nested unfinished creation protection,
successful creation and Projects return. Captured warning/error sample was empty.
No existing unrelated user data was changed. Known native Chrome, screenshot and
compact-viewport limitations were not retried or repaired; these observations are
not native Chrome/visual/compact qualification. The temporary tab and task-local
Vite server were closed after the check.

### Accounting and next action

Approximately **21 of 30 aggregate S2 verification minutes** used (estimate:
developer 6.5, reviewer 5.5, coordinator/browser/source/reconciliation nine),
**zero harness repairs**. Checks stopped after adequate useful source/test/ordinary
browser evidence and explicit tool limits. Remaining allowance is not an automatic
invitation to another campaign. First-slice 21/30 and all 007/008/009 stop decisions
remain unchanged; no old missing case becomes a pass.

Next: user review of the S2 result and its native-browser evidence limits. Retain
unverified criteria rather than mark the entire increment Completed. Any additional
automated acceptance requires an explicitly authorized bounded follow-up; later
inspector/display reorganisation requires its own bounded agreement/amendment.
No staging, committing or pushing occurred.

Suggested commit: `refactor: organise workbench shell and workspace components`.
