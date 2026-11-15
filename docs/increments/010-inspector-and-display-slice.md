# Increment 010: Inspector and shared display slice proposal

- Contract status: Agreed
- Lifecycle: Closed with Increment 010 by user instruction, 15 November 2026; [remaining acceptance is deferred/unverified](010-component-oriented-presentation.md#user-directed-closure--15-november-2026).
- Delivery status: Partially completed — source organisation and independent review finished; native-browser acceptance remains unverified
- Agreement: on 15 November 2026 the user explicitly agreed and authorized this S3 amendment to [Increment 010](010-component-oriented-presentation.md) after committing and pushing it. Later functional roadmap work remains outside scope.
- Review baseline: `d430edd`, inspected on 15 November 2026 after the committed shell/workspace slice.
- References: [S2 handoff](010-shell-and-workspace-slice.md#implementation-handoff--15-november-2026), [current ownership](../project/workbench-component-organisation.md), [target organisation V1](../project/workbench-layout/presentation-organisation-proposal-v1.md), [decomposition V1](../project/workbench-layout/component-map-v1.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [role workflow](../workflow/agent-roles.md).

## Outcome and scope

Finish removing the single-feature presentation wrapper by giving the existing
inspector/editor and shared token rendering their component-oriented owners.
Preserve the usable interface, raw session state and retained command workflow.
This is the final remaining organisation slice, not the replacement UI or completion
of the functional roadmap. S1/S2 native acceptance gaps remain unverified; committing,
pushing or proceeding does not establish manual acceptance or close Increment 010.

Include all 20 remaining files under `src/presentation/features/workbench/`, split
the current multi-export inspector module, extract its existing small applied/draft
feedback, and relocate the two remaining readback helpers to their actual owners.
No new interaction or numerical policy is needed.

## Exact proposed map

Paths are relative to `src/presentation/`, except `test/` destinations, which are
relative to the repository root. `old/` abbreviates the current
`features/workbench/` prefix only. Braces enumerate complete file sets.

| Current file/export | Target / disposition |
| --- | --- |
| `old/inspector/WorkbenchInspector.tsx` · WorkbenchInspector | `workbench/WorkbenchInspector/WorkbenchInspector.tsx`; same shell/children/fallback composition. |
| Same file · InspectorHeader | `workbench/WorkbenchInspector/InspectorHeader.tsx`; same props/conditions and toggle. |
| Same file · EditableTokenInspector | `workbench/WorkbenchInspector/TokenEditor/TokenEditor.tsx` · TokenEditor; sole existing useTokenEditor caller, same props/rendering. |
| Current header's applied/draft feedback section | `workbench/WorkbenchInspector/TokenValueComparison.tsx`; only the existing section, not a larger mockup comparison. Move the existing Feedback type from Editor.tsx here. |
| `old/inspector/GroupInspector.tsx` | `workbench/WorkbenchInspector/GroupInspector/GroupInspector.tsx`; read-only group rendering unchanged. |
| `old/inspector/useTokenEditor.ts` | `workbench/WorkbenchInspector/TokenEditor/useTokenEditor.ts`; exact hook implementation/lifetime. |
| `old/inspector/session.ts` | `workbench/WorkbenchInspector/TokenEditor/editor-session.ts`; same pure operations, types and exports. |
| `old/inspector/inspection-tabs.tsx` · InspectionTabs | `workbench/WorkbenchInspector/TokenEditor/TokenEditorTabs.tsx` · TokenEditorTabs; current Authored value / Resolved & trace tabs only. |
| `old/inspector/{EditorActions,EditRecovery}.tsx` | `workbench/WorkbenchInspector/TokenEditor/{EditorActions,EditRecovery}.tsx`; same narrow APIs. |
| `old/inspector/Editor.tsx` · EditorFields | `workbench/WorkbenchInspector/TokenEditor/TokenEditorContent.tsx` · TokenEditorContent; same full heading/tabs/authored/resolved/metadata composition and editor argument. |
| `old/inspector/ReferenceFields.tsx` | `workbench/WorkbenchInspector/TokenEditor/ReferenceFields.tsx`; same reference-only contract. |
| `old/inspector/ColorFields.tsx` · ColorFields | `workbench/WorkbenchInspector/TokenEditor/ColorEditor/ColorEditor.tsx` · ColorEditor; preserve the whole current color-control composition. |
| `old/color/visual-range.ts` | `workbench/WorkbenchInspector/TokenEditor/ColorEditor/visual-range.ts`; current private color-control helper. |
| `old/color/integer-rgb.ts` | `workbench/WorkbenchInspector/TokenEditor/integer-rgb.ts`; common session/color-control helper. |
| `old/components/{AuthoredValue,ExactSource}.tsx` | `token-display/{AuthoredValue,ExactSource}.tsx`; same exports and contracts. |
| `old/components/swatch.tsx` · Swatch | `token-display/TokenSwatch.tsx` · TokenSwatch; same css prop, classes and markup. |
| `old/inspector/{TokenMetadata,ResolvedTokenPanel}.tsx` | `token-display/{TokenMetadata,ResolvedTokenPanel}.tsx`; unchanged read-only rendering. |
| `old/color/authored-color.ts` | `token-display/authored-color.ts`; existing spaceName/authoredColorCoordinates exports. |
| `old/color/preview.ts` | `token-display/color-preview.ts`; same colorPreview API and native CSS policy. |
| `workbench/readback.ts` · resolvedColor | `token-display/resolved-color.ts`; exact pure extraction/signature. |
| `workbench/readback.ts` · failureText | `workbench/WorkbenchInspector/TokenEditor/editor-failure.ts`; exact pure extraction/signature. Remove the now-empty readback module. |
| `old/browser/TokenList.tsx` | `test/presentation/support/TokenList.tsx`; unchanged alternate renderer/export as a legacy test support component, with migrated imports. |

The proposed destinations form real owners, not a scaffolding checklist:

```text
workbench/WorkbenchInspector/
  WorkbenchInspector.tsx, InspectorHeader.tsx, TokenValueComparison.tsx
  GroupInspector/GroupInspector.tsx
  TokenEditor/
    TokenEditor.tsx, useTokenEditor.ts, editor-session.ts, editor-failure.ts
    integer-rgb.ts, TokenEditorTabs.tsx, EditorActions.tsx, EditRecovery.tsx
    TokenEditorContent.tsx, ReferenceFields.tsx
    ColorEditor/{ColorEditor.tsx,visual-range.ts}
token-display/
  identity-labels.ts                            existing S2 owner
  AuthoredValue.tsx, ExactSource.tsx, TokenSwatch.tsx
  TokenMetadata.tsx, ResolvedTokenPanel.tsx
  authored-color.ts, color-preview.ts, resolved-color.ts
test/presentation/support/TokenList.tsx          repository-root test path
```

### Dependency rationale and deliberate exceptions

`integer-rgb` is used by editor-session and ColorEditor, so it belongs at their
nearest common TokenEditor owner rather than under private ColorEditor. visual-range
serves color controls and stays private there. Shared color preview/authored display
and resolvedColor must not depend on editor/session or shell coordination; shared
ResolvedTokenPanel currently imports resolvedColor from workbench/readback, which
this extraction resolves. failureText has one live source consumer, useTokenEditor,
and moves next to it. None of these moves changes calculations or formatting.

InspectorHeader serves both fallback/group and editable token inspection; its
comparison renderer and Feedback type therefore stay at the common inspector
owner, rather than making that shared header import a private TokenEditor child.
Keep no type-only cycle through TokenEditorContent or useTokenEditor. The hook can retain
its inferred feedback return; the exact existing Feedback fields remain compatible.

Source-informed naming exception: EditorFields currently owns the whole token
aside, heading, Tabs.Root, authored/resolved panels and read-only metadata, not
merely value input fields. Name that existing composition TokenEditorContent rather
than calling all of it ValueEditor. The target proposal conditioned ValueEditor on
separating tab/editor composition; that additional split is unnecessary for this
bounded migration. Do not create an empty ValueEditor directory or promise that
every future authored panel shares the current composition. This private component
renders existing content; it introduces no controller hook or independent state.

ColorEditor keeps the current mapped channel and separate Alpha blocks local.
Separate ColorChannelField/AlphaField files add no demonstrated reuse in this slice
and would redistribute tightly coupled range/byte/session callbacks. Their absence
does not leave empty future files or prevent later agreed extraction. Keep the
existing illustrativeGradient helper local. Callers use spaceName directly from
authored-color; retire the unused forwarding spaceName re-export from ColorFields
when renaming, rather than adding compatibility aliases.

## Component and session contracts

- Workbench imports the inspector shell and TokenEditor through their identified
  component entries. Its editor position, conditional rendering and key
  `[selection.id, editorVersion]` remain exactly as now. App/project keys and shell
  state/refs/callbacks are untouched apart from necessary imports/export renames.
- TokenEditor calls useTokenEditor exactly once at the same unconditional position.
  Keep all hook state/effect/ref order, dependencies, baselineRevision/initial,
  accepting/completion, dirty notification and restoreApplyFocus behavior. No state
  lifting, second session, provider/store or remount on tab/view/layout toggles.
- TokenEditorContent remains a private child receiving the existing owned editor result;
  this does not authorize passing that broad result to other leaves. Existing
  ReferenceFields, actions, recovery and shared display retain narrow props.
  ColorEditor retains DraftSession plus onChange/onError/readOnly, without command
  or host authority. Session operations stay at their common owner.
- InspectorHeader retains read/target-unavailable conditions, selected/editable
  status and controlled expanded/toggle props. TokenValueComparison receives only
  existing Feedback display data. Keep its exact applied/draft specimen DOM,
  tab-dependent visibility, accessible messages and runtime CSS background styles.
- Shared token-display components consume current token/project/resolution data,
  CSS/text and explicit source callbacks only. They cannot create editor drafts,
  issue mutations, access storage/worker runtime or import private workbench modules.
  ExactSource retains request fencing, revision behavior, disclosure and source
  limits; group/token keys and asynchronous generation guards do not change.

### Alternate TokenList disposition

The remaining TokenList has no live application consumer; identity-presentation
tests render it with ProjectReadback, visible tokens and inspect callbacks. Keep
that implementation as test support, updating that test import only. Preserve all
collision-safe labels, selection/identity, description/metadata and authored-value
assertions, including test input fixtures; do not delete or replace coverage with
a weaker assertion. Clearly describe it as a legacy consumer regression fixture,
not acceptance evidence for the retained projected TokenTable. Rename the current
test description “human identity labels in real consumers” to distinguish the legacy
fixture and current consumers, keeping every meaningful assertion. Existing retained
TokenTable code remains unchanged except shared-display/helper imports and Swatch
rename. This avoids an unused second production list API without rewriting test
semantics or claiming the two renderer contracts are interchangeable.

## Acceptance criteria

- S3-AC-1 — Exact moves/exports/extractions above resolve all live source/test imports;
  no live `src/presentation/features/` wrapper or compatibility forwarding files
  remain. Ownership documentation describes the actual final organisation, not
  unbuilt target features. Existing aliases/discovery work without config changes.
- S3-AC-2 — One TokenEditor/useTokenEditor session retains existing position/key,
  raw invalid literal/byte/reference input, view/scale/tab state, baseline review,
  target-unavailable/read-only guards, Apply/Cancel and focus-ref lifetime. Existing
  Workbench command/readback/completion/departure/restore authority is preserved.
- S3-AC-3 — Extracted renderers preserve element order/nesting, IDs, labels, roles,
  hidden/disabled conditions, classes, forwarded refs and callback behavior. Authored/
  resolved tabs retain Base UI semantics; color channels/sliders/Alpha retain their
  current layout, range messages, exact-entry associations and error behavior.
  No new Details tab, table/tree role, preview geometry or keyboard model.
- S3-AC-4 — Shared helpers retain exact calculation/formatting/native CSS/source
  behavior. Token display has no private editor/shell dependency or cycle; session
  and ColorEditor share one integer-rgb implementation. Source requests/fencing,
  resolved explanations and authored identity/metadata remain intact.
- S3-AC-5 — All meaningful alternate TokenList and existing editor/display test
  coverage remains, with the test-only renderer accurately labelled. No domain,
  application, host/protocol, persistence/codec, naming policy, dependency, CSS/theme,
  UI primitive API or future functionality change is introduced.

## Delivery and verification proposal

After agreement and authorization, use one fresh-context developer, then a fresh
independent reviewer of an identified stable source/test diff and new-file manifest.
Initial reviewer expectations come from this contract, not developer conclusions.
Record actual source baseline/pre-existing changes; freeze edits during review.
Update current owning path documentation after delivery. Historical prototypes,
hashes, output evidence and vendored references retain their recorded baselines.

Live consumers include Workbench, retained TokenTable and identity/session/reference/
integer-rgb/visual-range/preview/authored-value/exact-source/coordination tests under
`test/presentation/`; inspect static and dynamic imports repository-wide. Current
`@presentation`/`@tests` aliases and test discovery cover the destinations. No
configuration, generic UI or CSS change is expected.

Planning is source/document/link review only: shared ten-aggregate-minute ceiling,
zero repairs, analyst approximately five minutes used (estimate). No application
tests, builds, browser work or implementation occurred for this draft.

Proposed S3 verification after authorization: maximum 30 aggregate minutes and two
harness-repair cycles across developer/reviewer/coordinator; use less when evidence
suffices. Carry consumption through handoffs. This is S3's bounded allowance, not
a reset/resumption of S1 or S2's separately stopped approximately 21/30 minutes each.

- Primary S3-AC-1/4/5 checks: compare moved pure function bodies/signatures and live
  imports; inspect dependencies and legacy test assertions; confirm wrapper removal.
- Primary S3-AC-2/3 checks: source comparison of hook/effect bodies, session operations,
  keys/positions, JSX/classes/ref/event behavior; focused existing tests above plus
  one final `npm run build` including four typechecks. Add only meaningful extraction
  regression checks where needed, not directory or mirrored-implementation tests.
- Cheap ordinary smoke only if an existing browser surface is available: select
  literal/reference token, invalid raw entry, view/scale change, authored/resolved
  tabs, collapse/reopen inspector, Keep editing/Cancel and one Apply; inspect group
  and exact-source disclosure using disposable data. Preserve source/controlled-test/
  in-app/native evidence distinctions. Source/tests do not prove native focus or
  compact geometry; unavailable required observations remain explicitly unverified.
- Dedicated native Chrome, screenshots and exact viewport control were unavailable
  in prior slices. No setup/connector/profile/alternate-stack/harness repair to work
  around those limits is authorized here. No old rare-recovery, maximum-resource,
  performance, cross-engine or 007/009 qualification campaign restarts. Ordinary
  small projects suffice; no new performance guarantee follows from organisation.

Stop at either ceiling or earlier for low value/tooling dominance. Report demonstrated
defects and unverified criteria separately; do not silently waive acceptance or
extend budget. New agents/snapshots do not reset consumption. Resuming stopped
verification requires explicitly authorized bounded follow-up. S3 organisation
completion does not erase S1/S2 evidence gaps or automatically mark 010 Completed.

## Decisions, design and authority

Proposed for agreement: complete remaining-wrapper migration, test-support placement
of the legacy TokenList, common-owner helper/comparison exceptions, retaining local
color controls, S3-AC-1–5 and bounded verification. No new product/model decision is
settled. New Details editing, larger comparison/previews, responsiveness, relationships
and interchange remain separately scoped future work.

No new designer exploration is required for unchanged existing markup/behavior.
Saved mockups remain direction rather than implementation authority. Material visual
or interaction changes return to the established user/designer/analyst sequence.
Agreed amendments: none. Implementation not started. Leave staging, committing and
pushing to the user.

## Planning handoff — 15 November 2026

A separate analyst inspected the committed source, consumers and tests and drafted
this contract. Coordinator review refined the complete editor-content name, common
feedback/helper ownership and legacy fixture attribution without adding behavior.
All 46 local links checked across this proposal, the main 010 record and current
status resolve; whitespace checks pass. Approximately eight of ten aggregate
planning/source/documentation-review minutes used (estimate: analyst five,
coordinator three), zero repairs; checks stopped. No source moves, tests, build or
browser checks occurred. Next: user agreement and implementation authorization.

## Agreement and implementation authorization — 15 November 2026

The user instructed: “committed & pushed. I agree and authorize. Proceed”. The
agreement covers the exact map, source-informed naming/helper/test-support
exceptions and S3-AC-1 through S3-AC-5. Earlier Draft/pending wording is planning
history, superseded here. No new UI or functional-roadmap implementation is implied.

Implementation baseline: `5b626e2`, clean before coordinator authorization/status
documentation. One fresh developer implements, then freezes source for a separate
fresh reviewer. The single S3 verification allowance is now active: at most 30
aggregate minutes and two harness-repair cycles, stopping earlier for low value
or tooling dominance. Initial allocation developer ten, reviewer seven, coordinator
ten, reserve three; all share one ceiling. Carry actual consumption at handoffs.
Use focused affected tests, one final build and cheap available ordinary smoke;
known native Chrome/screenshot/viewport limitations do not authorize repair/setup.
S1/S2 and earlier stopped allowances remain unchanged. Staging, committing and
pushing remain with the user.

## Implementation handoff — 15 November 2026

**Agreed S3 source organisation delivered and independently reviewed; delivery
Partially completed with explicit native-browser evidence gaps.** No actionable
findings remain. The three organisation slices have now migrated the existing
presentation responsibilities without implementing the new interface roadmap.

### Delivered result

- All 20 remaining `features/workbench` files have their agreed owners. The old
  wrapper and empty workbench readback module are removed without forwarding files.
- Inspector shell, common header/comparison, GroupInspector and the single
  TokenEditor are separated. TokenEditorContent retains the complete existing
  heading/tabs/authored/resolved/metadata composition. ColorEditor retains its
  current channels, Alpha and local gradient helper.
- Shared token rendering/color helpers live under `token-display/`, with no private
  workbench/editor dependency. Integer-RGB and failure formatting live at their
  actual editor owner; resolved color is a shared pure helper.
- The alternate TokenList implementation moved unchanged after import/name
  normalization to test support. All meaningful assertions remain; its test
  description distinguishes legacy-fixture coverage from current consumers.
- Workbench retains editor position/key and command/completion authority. Hook/
  effect/ref/session operations, source fencing, JSX/classes and generic UI APIs
  remain unchanged. Current-path documentation describes actual rather than
  speculative owners.

See [move/extraction map](../../output/increment-010-inspector-display/moves.json)
and [current ownership](../project/workbench-component-organisation.md). No new
Details tabs, numerical policy, previews, responsive layout or dependency was added.

### Snapshot and evidence

Base: `5b626e2`. The [60-entry manifest](../../output/increment-010-inspector-display/review-source-manifest.json)
and [source/test/current-doc patch](../../output/increment-010-inspector-display/review-source.patch)
identify the frozen independent-review snapshot. Coordinator contracts/status/output
reports are outside it. Source/tests/current owning documents remained unchanged
after independent review.

| Criterion | Evidence and remaining limits |
| --- | --- |
| S3-AC-1 | Move/import checks, successful build and fresh independent review verify all destinations, wrapper/readback removal and absence of forwarding/future modules. Current ownership/path docs follow actual files. |
| S3-AC-2 | Exact hook/session and normalized shell/editor-body comparison preserve state/effect/ref/keys/callback authority. In-app smoke preserves invalid input through tabs/collapse/reopen/Keep editing and observes Cancel, literal/reference Apply. Native focus/compact/restore/exceptional-state matrix remains unverified. |
| S3-AC-3 | Exact renderer/JSX/classes and focused tests preserve current conditions, roles, labels and control APIs. In-app authored/resolved, view/scale, feedback visibility and source disclosure work. No screenshot, exact compact geometry or full native keyboard/focus parity is claimed. |
| S3-AC-4 | Pure helper bodies/signatures remain exact; shared display has no private shell/editor dependency. In-app alias resolution and group exact-source disclosure render current values/revision. Stale/conflicting asynchronous-source states were not induced. |
| S3-AC-5 | Legacy renderer body and all meaningful test assertions remain; suite description accurately names legacy/current coverage. Independent review confirms no domain/application/host/codec/config/dependency/CSS/UI-primitive or new-feature change. |

The [developer report](../../output/increment-010-inspector-display/developer-report.md)
records **92 existing focused tests in 11 files passing**, with no weakened
assertions or implementation-mirror additions. One final `npm run build` passes
all four TypeScript checks and Vite bundling. The existing >500 kB chunk advisory
remains; this is not performance qualification. No full-suite or redundant build
was run.

The fresh [independent reviewer](../../output/increment-010-inspector-display/reviewer.md)
derived expectations from the agreement before consulting developer evidence,
verified all 60 hashes/deletions and the complete tracked/new path set, and
reconstructed patch contents against the baseline. Its independent comparisons
confirm approved moves, shell/header/editor/content/comparison splits and both
remaining readback helper extractions preserve source behavior. No actionable
findings remain; no source edits or duplicate test/build run occurred in review.

Coordinator [in-app Chromium observations](../../output/increment-010-inspector-display/browser-observations.md)
cover literal/reference selection, invalid raw entry, tabs, collapse/reopen,
departure Keep editing/Cancel, color-space and RGB-scale controls, a retained
literal Apply, alias Apply/trace, read-only group inspection and exact-source
disclosure. Only the disposable task project changed. The warning/error sample was
empty. Known native Chrome, screenshot and viewport limitations were not retried
or repaired; no native Chrome, compact, full focus or exceptional-state acceptance
is inferred. The temporary tab and task-local Vite process were closed afterward.

### Accounting and next action

Approximately **21 of 30 aggregate S3 verification minutes** used (estimate:
developer six, independent reviewer six, coordinator/browser/source/reconciliation
nine), **zero harness repairs**. Checks stopped after useful evidence and explicit
tool limits. The remaining allowance does not automatically authorize another
campaign; S1/S2 and older qualification stops remain unchanged.

The agreed source-organisation destination is now delivered, with the documented
source-informed exceptions. Increment 010 is not automatically marked Completed:
older and current unverified native-browser criteria remain as recorded. Next is
user review/acceptance or an explicitly authorized bounded follow-up/closure
decision, followed by separately scoped functional-roadmap planning when requested.
No new interface implementation is implied. Staging, committing and pushing remain
with the user.

Suggested commit: `refactor: finish inspector and shared token display ownership`.
