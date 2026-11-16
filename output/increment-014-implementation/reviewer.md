# Increment 014 independent review — R1

16 November 2026. Expectations derived from the agreed Increment 014 contract, V1 proposal, styling audit, presentation conventions, architecture and visual direction before examining application changes or developer evidence. Read-only application review; no production, test, Git index or branch changes. Applied code-review, frontend and browser-testing guidance; Chrome DevTools unavailable, used existing cached Playwright/Chrome delivery without installing tools. No mutation test against the deliberately frozen snapshot.

## Identified snapshot

Base `da3418e216151af3381cf4ae1c189bbdb37ef8c4`.
`source-manifest-r1.json` SHA-256 `1ebbcb10d116d109eeba8d29c5e6877e1160a20c7cdb53da9acac939682f9d60`.
`source-r1.diff` SHA-256 `bfa8d5cd483005d9edcf06b4549af5e067e8942c5705bb655ce5534478eafd39`.
Independently checked all 50 included files against manifest: zero mismatches. Coordinator contract/status changes excluded as declared. No dependency changes.

## Finding

**P2 — Restore acknowledgement missed the narrow control-minimum migration (AC-5/F3).**
`src/presentation/App/components/ProjectsWorkbench/components/RestoreDialog/RestoreDialog.tsx:174` renders the native replacement-acknowledgement checkbox with no sizing class. Before this change, the unlayered below-880px `input:not([type="range"]) { min-height:44px }` applied to it. Removing that rule while migrating other native inputs to `touch:min-h-11` leaves this input at its native minimum; the effective checkbox box geometry is no longer preserved. This is an omission from the explicit minimum-preservation contract, not a request to redesign checkbox styling. The wrapping label remains clickable; no claim is made that its total target area falls below44px. Add the equivalent narrow minimum at this existing control owner (or explicitly obtain an agreed exception) and recheck this replacement section at879/880px. Guards, acknowledgement state and label should remain unchanged.

Source evidence is definitive for the missing declaration. A direct isolated workflow attempt to reach replacement timed out waiting for a backup download; it did not establish current checkbox computed dimensions, and is not classified as an application download defect. No harness repair/retry campaign was pursued.

## Independent checks

- Targeted existing tests: `npm test -- test/presentation/icon.test.tsx test/presentation/projects-screen.test.tsx test/presentation/workbench-layout.test.tsx test/presentation/increment-009.test.tsx`: four files,20 tests passed. Includes semantic merge groups, Projects guards, layout and retained editor composition. No full-suite/build repetition.
- Fresh isolated Chrome context via `reviewer-probe.cjs`; results `reviewer-runtime.json`. Exercised actual project/token creation and empty-name validation; measured1440/1120/1119/880/879/640/320 widths. Padding24px at1120 becomes20/16 at1119; history minimum32px at880 becomes44px at879 and remains44px at640; authored-value hides below880; container three/two columns and viewport one-column combinations compile and apply. All observed hidden panes retain display:none.
- Entered `.25`, used Back/Edit token: exact draft text survived. Root20px at320 width: numeric input font20px/minimum55px, within viewport. Viewed own `reviewer-editor-320.png` and `reviewer-editor-root20.png`; local scrolling and mounted editor structure remain present. No page errors in successful probe. This does not exhaustively verify lower actions/scroll/focus at enlarged root.
- Original protected browser launch failed due sandbox process restrictions; routine escalation ran the same unmodified probe successfully. This was no harness repair or dependency change. Separate restore diagnostic stopped after one timeout; `reviewer-restore.cjs` documents the attempted path and makes no success claim.
- After independent assessment, inspected developer evidence/build log and original baseline computed measurements. Successful build includes all five local font assets; developer reports153 presentation tests and bounded font/fallback/focus/contrast checks. These are corroborating implementation evidence, not checks independently rerun by this reviewer.

## Acceptance and audit disposition

| Criteria | Review assessment and limits |
| --- | --- |
| AC-1 / F8 | Exact Neutral semantic mapping and paired roles present in single stylesheet; all prior supporting text-secondary consumers migrated. Inputs/select/textarea/outline buttons actually use input. Scrim/shadows neutral aliases; specimens/runtime colors stay separate. Source supported; full state matrix not exercised. |
| AC-2 / F6 | Local Geist400/500/600 and Mono400/500, fallbacks, swap, hashes, embedded version record and OFL files reviewed. Source/build evidence supports assets/no remote runtime requests. Role mapping and narrow text entry coherent. Font-failure test only developer evidence, not independently rerun; no new offline guarantee. |
| AC-3 | Projects editorial hierarchy uses real entry counts/names; selection/Open/Download guards unchanged. Source plus existing targeted Projects tests cover unavailable/missing/recovery gates; creation validation exercised. Full restore-preview/recovery state runtime matrix unverified. |
| AC-4 / F1/F2/F4/F5 | Owner utility migration removes counterpart global declarations; preserved Projects28/Tokens24 spacing, compact endpoints, table viewport/container policy, inspector borders, header/history wrapping and dialog/drawer distinction. Independent representative runtime supports touched endpoints; not every collapse/container state repeated. |
| AC-5 / F3 | **Finding above remains open.** Other owned controls, file input, slider hit areas and history intervals source checked; history runtime checked. Button additive callback/API preserved; precompiled cn tests pass. |
| AC-6 / F7 | Broad rem conversion with retained off-scale lengths and unchanged CSS-pixel observer/query policy. No fixed root size or rounding bundle. Own320/root20 sample usable within checked region; exhaustive enlarged-root actions/short-height/zoom unverified. |
| AC-7 | No application/domain/adapter/session hooks, command routing, ancestry or editor keys changed. Dynamic preview styles and black/white defaults unchanged. Own draft text survived responsive surface change; hidden invariant holds. |
| AC-8 | Own320/editor/root20 visual inspection; stronger actual input boundaries present. Developer assembled focus/contrast evidence reviewed (normal text/control pairs above required thresholds). Reviewer did not independently repeat keyboard-focus/fallback/contrast matrix. No full accessibility certification. |
| AC-9 / F9 | Confirmed no current source consumers for removed project-start/range-ends/exact-data. EditorActions remains static and at current owner; removed bottom offset inert. Exceptions inventory and tree check below support handoff. Contract completion not declared. |

## Affected tree, consumers and naming

Changed component files remain with their current private screen/component owners. Shared header and generic controls retain genuine cross-screen consumers; font assets/provenance live under their actual stylesheet owner. No unnecessary wrapper, registry, generic abstraction, folder relocation or naming change was introduced. Existing component names continue to describe their responsibilities. Source diff preserves roots/refs/keys/calls, mounted ancestry, session/command ownership and scroll containers. Only Icon imports Heroicons for production rendering; no foreign icon family/dependency. Component CSS exceptions remain justified for pane formulas/collapsed states, modal/drawer viewport/transition geometry, native range pseudo-elements, authored specimens/trace/selection decoration, exact-source scrolling, staged rows and unlayered hidden invariant. Concrete ownership omission is the checkbox finding; no optional tree preference is elevated to a defect.

## Limits and ledger

Approximately11 reviewer minutes, zero harness repairs; combined allowance approximately30/40 minutes using supplied19-minute prior consumption. Leave the remaining approximately10 minutes to coordinator/correction/recheck; ceilings are not targets. No broader engine, storage fault, stress, PWA/offline-shell or historical qualification campaign reopened. No unresolved product question identified beyond whether the missed checkbox minimum should be fixed (routine contract compliance) or explicitly excepted by the user. Stop here pending targeted correction; no contract completion claim.

Suggested commit after resolution: `feat: adopt Neutral Geist theme and clarify styling ownership`.

At report close, coordinator accepted P2 and authorized the developer's focused correction. A final manifest comparison therefore identifies RestoreDialog.tsx as changed; the other49 files still match R1. This report's finding and review refer to the original identified R1 snapshot. R2 needs a separate exact-delta recheck.
