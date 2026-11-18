# Increment 018: Hierarchical token navigation

- Contract status: Agreed — records the user-authorized V3 scope below; this document adds no new product decision.
- Delivery status: Implemented; independent review pending; browser qualification gaps below.
- Agreement: 18 November 2026. The user approved the current mockup and explicitly instructed: “Looks good. Go ahead with the production implementation of the navigation, including the transitions and right-aligned chevrons.” This grants production implementation authority for the identified design, not merely analyst review. The analyst's subsequent written criteria capture that scope; no separate approval of this newly written document is asserted.
- References: [V3 design and amendments](../../prototypes/token-list-v1/DESIGN-V3.md), [vision](../project/vision.md), [product concept](../project/product-concept.md), [principles](../project/principles.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md), [Increment 017 list behavior](017-token-list-properties-and-ordering.md).

## Outcome and scope

Users browse the existing project by value type, layer and full namespace path in a new Tokens section, alongside retained Library and Groups navigation. Desktop and compact navigation expose the same scopes and disclosure behavior. This is a presentation projection over existing stable identities and authored properties.

Included: populated navigation branches/counts, scope selection and headings, scoped list filtering/order, disclosure motion and accessible controls, production drawer integration and preservation of selected-token context.

Excluded: new authoring semantics or type editors, persistence/schema/worker changes, export/import, search redesign, ARIA-tree keyboard behavior, list-property redesign, shell breakpoint changes and renewed qualification of earlier increments. The prototype's disabled All content/creation controls do not disable existing production functionality.

## Acceptance criteria

- AC-1: Library retains All tokens and existing functional All content. Groups retains existing cross-type namespace browsing and creation entry points. Tokens shows only populated types, using the same type icons as list rows, then populated Primitive, Semantic, Component and Unspecified layers in existing domain order.
- AC-2: Each layer lists populated direct namespace locations as full path leaves, with Project root for directly owned root tokens. A namespace leaf scopes that type/layer to its namespace subtree. Navigation counts describe those scopes over the whole current project, independent of selected scope/search. Ancestor and descendant leaves can therefore overlap; their counts need not sum to the layer count. Empty types/layers/locations are omitted; an empty project remains usable through Library/creation.
- AC-3: Type labels/counts select all tokens of that type; layer labels/counts further restrict layer; path labels/counts further restrict namespace ancestry. Scope identity uses type/layer values and stable group IDs (or an explicit root discriminator), never parsed display paths. Equal names, renames and moved groups must not cause another group's tokens to be selected. Search retains existing matching behavior within the selected scope.
- AC-4: Type scopes order by layer, namespace path and natural local name; layer/path scopes retain the applicable remaining order and deterministic identity tie-break. Existing All tokens and Groups ordering and All content behavior are preserved. Workspace headings identify the selected scope rather than falsely showing All tokens.
- AC-5: Scope controls and disclosure controls are separate focusable buttons. Only expandable type/layer branches with more than one token show a right-aligned chevron after the count. Single-token branches remain expanded and reserve the same trailing space; leaves also reserve space. Selection and expansion are independent. Disclosures expose expanded state and accessible names; selected scopes expose current state. Collapsed descendants cannot receive focus and are hidden from assistive technology.
- AC-6: Chevron rotation and branch expansion/collapse use synchronized 180ms ease-in-out transitions, including closing, on desktop and compact navigation. Reduced-motion preferences remove these transitions. Focus remains on the activated disclosure. No new animation dependency is introduced.
- AC-7: Compact Browse presents the same Library/Tokens/Groups content through the existing production drawer. Its navigation scrolls, close remains reachable, Escape/close return to Browse, and scope selection closes it and returns to the existing browse surface. Existing responsive thresholds and inspector surface policy remain intact.
- AC-8: Selecting or expanding navigation preserves selected identity, inspector/editor and unsaved drafts. If a selected token is outside the resulting visible list, the existing outside-list notice and Show selected token action continue to reveal it through All tokens with search cleared. Reuse that mechanism; do not add competing notices or session owners. Existing creation defaults and command gates remain intact; type/layer navigation does not silently prefill or alter authored token properties.
- AC-9: Navigation refreshes from current project data following edits/history/readback; vanished populated branches cannot leave a misleading active scope or crash. Reconcile missing stable group IDs through existing identity-based history behavior where applicable; type/layer scopes may retain an honest empty result or fall back to an existing broader scope without changing selection/drafts. Preserve existing unavailable/recovery states and complete-list loading behavior.
- AC-10: Changes follow the presentation ownership, naming, Tailwind/theme, shared Icon and owned-component conventions. Developer and reviewer inspect the affected resulting tree and actual consumers. Domain/application/storage boundaries and persisted data remain unchanged.

## Analyst review and implementation notes — 18 November 2026

Reviewed V3, including motion and trailing-chevron amendments, and current prototype `main.tsx` / `prototype.css` at baseline below. Earlier V3 screenshots precede the trailing-chevron amendment; live source is the identified final design. The user's instruction authorizes this design directly; the earlier prototype document's pending-feedback wording is historical and superseded by this agreement.

No material blocking design or architecture gap found. Production integration differs from the illustrative prototype in these concrete ways:

- Current `TokenBrowseView` has only all-tokens/group/all-content; extend it with structured typed scopes. `tokenListRows` already uses identity ancestry, natural order and domain type/layer order. Extend that ownership rather than filtering by the prototype's path strings.
- `NamespaceTree` currently owns all Library/group content despite its narrower name. Reassess names/placement for the complete navigation responsibility; do not make the new hierarchy presentation-global.
- Production `TokenWorkspace` already owns the outside-list notice and reveal action; retain it. The production Base UI drawer and layout hook already own focus return and surface policy; the prototype native dialog is not an instruction to replace them.
- `creationParent`, workspace toolbar/table labels, and history reconciliation consume browse state. Audit every consumer so a new view is not accidentally treated as an ordinary group or All tokens. Keep existing creation behavior; new type/layer scopes carry no implied authoring defaults. A path scope may reuse its stable group as the existing creation parent without setting type/layer.
- Root and invalid/unavailable namespace data require honest labels; reuse established identity/path diagnostic conventions. Never infer a group from a matching displayed path. Fixture-specific initially expanded Colors/Primitive/Semantic are illustrative; a deterministic session-local expansion default is a routine implementation choice.

No additional human decision is needed before implementation within these constraints. Material departures return to the user; routine integration choices do not reopen approval.

## Verification approach and limits

Use the [shared verification rules](../workflow/agent-roles.md#proportionate-verification).

- Essential behavior tests: counts independent of search; type/layer/root/nested namespace filtering and ordering; duplicate paths/stable identities; empty project and refreshed data; single-token disclosure reachability; selected-token context preserved.
- Essential browser checks in Chrome: representative wide and compact navigation, separate selection/disclosure controls, expand/collapse and trailing alignment, keyboard focus/collapsed descendants, drawer close/Escape/select return, reduced-motion rule, and one dirty editor preserved across navigation. Reuse existing harness. Distinguish computed/source evidence from visually observed motion.
- Relevant integrity checks: no authored mutation from browsing, existing command/draft/history ownership preserved. Typecheck/build and focused affected presentation tests; full-suite repetition only for concrete regression risk.
- Representative performance: ordinary project with several populated types/layers and nested groups; no new maximum-size performance claim. Stress, screen-reader qualification, broader engines and prior deferred qualification remain excluded and explicitly unverified unless separately evidenced.
- Ceiling: **30 aggregate verification minutes and two harness-repair cycles** across analyst, developer, reviewer and coordinator. Analyst source review consumed approximately **4 minutes, zero repairs**; approximately **26 minutes/two repairs remain**. Earlier prototype and increment campaigns remain stopped and do not restart.
- Stop at either ceiling, earlier tooling dominance or low value. Record gaps honestly; no silent allowance reset. Ordinary implementation/product correction is separate from verification; resuming stopped checks requires a bounded authorized follow-up.

## Review baseline and handoff

Implementation baseline: `df4e2b9fe28272e4c346a382d792dd4ec3b806e6`; working tree clean before this contract was added. No production changes by the analyst. Before independent review, freeze and identify the exact diff and new files against this baseline. Use a fresh developer and reviewer context with the agreed design and this contract.

Staging, committing and pushing remain user-owned. Suggested implementation commit: `feat: add hierarchical token navigation`.

## Preliminary developer evidence — 18 November 2026

Implemented structured type/layer/root-or-group scopes, complete-project counts,
full-path identity labels, existing natural ordering and selected-scope headings.
Navigation refreshes from current complete readback; typed locations reconcile
removed identities through history and ordinary readback. Type/layer browsing does
not author defaults; group locations reuse existing creation-parent behavior.
Name-only tokens appear under the existing honest `Unassigned` type description.
Branches initially expand deterministically; session-local collapse choices are
shared across desktop and drawer. Single-token branches stay open.

The navigation owner is now TokenNavigation, with private NavigationContent and
TypeBranch. Shared workbench helpers serve navigation and workspace consumers;
the list and hierarchy share type icons. Source review checked the resulting tree,
actual consumers, old imports, creation/reveal/history/draft ownership and focused
motion CSS exception. No domain/application/storage/dependency changes were made.

Checks:

- `npm run typecheck` passed after final production edits.
- `npm run build` passed before the final compact-surface return and spacer fix;
  final typecheck passed. Existing large-chunk build warning remains.
- Focused token-list/identity/increment-009 suites: 20 tests passed. Additional
  affected workbench-coordination/layout/history-shortcut suites: 31 tests passed.
  Tests cover identity filtering, natural order, type/layer/root scopes, overlapping
  location counts, renames/moves, empty/refreshed branches, independent disclosures,
  single-token reachability and existing context ownership. `git diff --check` passed.
- Chrome used a new isolated `increment018` session on port 4199, restoring only
  `output/playwright/increment-017/fixture.json`. Wide runtime assertions passed:
  Colors yields four rows, Primitive two; collapse hides descendant accessible
  controls and keeps focus on the disclosure; opening restores them. A dirty
  Lightness field (`0.6`) survived selecting Dimensions, and the existing reveal
  action was exercised. No authored changes were applied and no user data accessed.
- Developer visually inspected `output/playwright/increment-018/wide.png`; it
  captured transient inspector loading. This exposed count alignment caused by an
  icon button's minimum width; the final spacer now matches its size-9 geometry.
  The final spacer is source/typecheck verified, not recaptured successfully.
- Compact automation stopped after two harness repair cycles: an accessible-name
  correction, then waiting for drawer focus return before assertions. The bounded recheck
  passed Escape return, selecting Durations closed the drawer and returned to the
  visible Durations heading. It subsequently timed out reading a disclosure in
  the now-closed compact navigation, so computed reduced motion was not checked.
  The compact screenshot captured a transition frame, so is not settled layout
  evidence. Close-button activation and final compact geometry remain unverified. Source establishes the 180ms closing/opening,
  reduced-motion rules and inert descendants; visual timing was not measured.

Developer verification used approximately 13 minutes, two repair cycles; stop
further harness repair. With analyst 4 minutes and coordinator approximately 1.5,
roughly 11.5 aggregate minutes remain for independent review/handoff within the
30-minute ceiling. Earlier qualification campaigns remain stopped. No broad-engine,
screen-reader, maximum-size or prior persistence qualification is claimed.

Implementation edits paused for independent review. Staging/commit/push remain
user-owned. Suggested commit: `feat: add hierarchical token navigation`.

## Independent review and handoff — 18 November 2026

A fresh reviewer inspected the frozen implementation against baseline
`df4e2b9fe28272e4c346a382d792dd4ec3b806e6`, its tracked diff and the included new
TokenNavigation components, navigation/type presentation helpers and tests.
No actionable production finding was reported. Independent focused tests passed
20 cases; the final production build, including typecheck, passed. The existing
large-chunk build warning remains. Diff whitespace and snapshot stability passed.
The reviewer checked actual consumers/ownership, stable identity filtering,
count scopes, history/readback reconciliation, draft/session ownership, separate
controls, spacer geometry and motion/inert rules.

AC-1–5 and AC-8–10 have focused test/source evidence and the representative browser
evidence above; this does not establish exhaustive runtime correctness. AC-6/7
remain partially verified: transition/reduced-motion rules exist, and developer
checks exercised compact Escape and scope return, but final settled desktop and
compact geometry, close-button activation, computed reduced motion and visual
transition timing were not established. The reviewer found the previous browser
session unavailable and stopped without restarting or repairing it. Earlier
screenshots are transitional evidence, not final visual acceptance captures.

Useful user review: in the production workbench with several populated types,
expand/collapse a multi-token type and layer; confirm chevrons rotate smoothly
after aligned counts and single-token branches have blank trailing space with
contents visible. At compact width, use Browse and confirm branches remain
readable, then close using the close button. With reduced motion enabled, these
branch transitions should be immediate. These checks would supply the remaining
visual/runtime evidence; no specific manual result is inferred from commit/push.

Approximately 24.5 aggregate verification minutes used (analyst4, developer13,
reviewer6, coordinator approximately1.5), two of two harness-repair cycles used.
Checks stopped; remaining time is not a new campaign. No broader-engine,
screen-reader or earlier deferred qualification was restarted. Implementation is
ready for user review with the stated limits. No source changes followed the
independent review; this completion/status documentation is the only final delta.

Suggested commit: `feat: add hierarchical token navigation`.
