# Increment 011 developer evidence — in progress

Baseline e5a3e3f; coordinator owns contract/status edits. No staging/commit/push.

Verification plan before application checks: targeted Projects controlled-host tests cover captured revision, no Open/ownership, stale-refresh/no retry and command gates (AC11–13). Existing coordination/editor/session/source/restore consumers cover deliberate reset/command authority (AC4–5,8–9). Static component rendering covers catalogue/inspector truthfulness and workflow content; source regrouping is checked through one final full suite and build/four type scopes (AC9,14). Root owns real native Chrome representative geometry/keyboard/session observations (AC1–8,10,13); developer will not duplicate the browser harness. No stress, engine or prior qualification campaign. Developer ceiling 30 verification minutes, shared 60, two repair cycles. Actual consumption is tracked below; coding excluded.

## Preliminary check results

- `npm test -- test/presentation/workbench-coordination.test.tsx test/presentation/projects-screen.test.tsx`: initial controlled Projects fixture failures after adding required page context props; updated fixtures to supply real controlled state. Backup tests passed. No acceptance assertions were removed.
- `npm test -- test/presentation/workbench-coordination.test.tsx test/presentation/projects-screen.test.tsx test/presentation/workbench-sections.test.tsx`: 3 files / 20 tests passed.
- `npm run typecheck`: first run caught mock typing in new tests; `vi.mocked` corrected the test type. Next run all four scopes passed.
- `npm test`: 53 files / 1,089 tests passed after source regrouping. Subsequently added one responsive focus/modal-policy test; focused coordination run 15 tests passed. Final build remains due after final production fixes.
- Native Chrome initial observation (coordinator): mechanical import relocation had incorrectly rewritten the worker's `new URL` literal. This was a product regression, not browser harness failure. Restored all unchanged `host/` files exactly to baseline; audited the remaining runtime URL literals (production and pre-existing isolated test worker). Runtime continues under coordinator ownership.

Approximate developer verification consumption so far: 6 minutes including diagnostics/source checks/test waits; zero harness repair cycles. Coding and documentation authoring excluded. Prior campaigns remain stopped.

## Implementation choices and source authority

The application remains React 19.3.1 / Base UI 1.9.0 / Tailwind 4.3.4 / Vite 8.3.5 from the existing lockfile/package. No dependencies changed. Existing owned controls and hook calls are reused. Base UI's installed `dialog/popup/DialogPopup.d.ts` documents `finalFocus` returning an element or false; navigation uses this API to hand focus to the workspace after scope choice and yields to another active modal. No new library behavior is assumed from an older API example.

One mounted WorkbenchInspector/TokenEditor ancestry remains. Responsive visibility uses native `hidden` with the existing final `[hidden]` display rule, so inactive surfaces leave keyboard/accessibility navigation while preserving the React subtree and local scroll. No portals, alternate editor branches, router, provider, schema or worker operation were added. Authored channel/reference/source logic is moved intact. The top feedback owner receives the existing command/lifecycle values and actions.

The catalogue revision is internal command input; the read-only inspector shows name, identity, supported/unavailable status and counts. Selection persists by rowKey, including unavailable storage identities. Download notices are strings tied to captured identity; failure refreshes facts and never repeats the download. App retains latest displayed row facts/selection/scroll/surface. Create/restore still open only through the original command owner and App-owned staged restore flow.

CSS exceptions are page/pane geometry, modal sizing, responsive repeated row-value suppression, native range/checkerboards and bounded exact source. Ordinary component styling remains named utilities. Editor actions now remain in normal inspector flow: the pre-existing sticky treatment obscured a field in the coordinator's 320px observation.

## Final developer checks and stopping record

- Final focused run: `npm test -- test/presentation/workbench-coordination.test.tsx test/presentation/projects-screen.test.tsx test/presentation/worker-client.test.tsx test/presentation/workbench-sections.test.tsx` — **4 files / 26 tests passed**.
- Added a worker-URL regression test after the observed migration defect — **4 worker-client tests passed**. No production host file differs from baseline.
- Extended the focus test first to reproduce focus being sent out of an open drawer on compact resize. It failed as expected; the product fix prevents that focus handoff while drawer modality remains. Final focused run passes.
- `npm run build` — four type scopes and Vite build passed before the final two isolated focus edge fixes. After those fixes, `npm run typecheck` passed all four scopes and `./node_modules/.bin/vite build` passed for the **final source** (787 modules, worker asset 201.58 kB, main asset 602.09 kB / gzip 191.39 kB). Vite reports the existing >500 kB chunk advisory; no threshold changed.
- `git diff --check` — passed. Reviewed move map and changed Markdown local references. No domain/application/adapter/host/protocol/schema/package changes.
- Full suite was run once for the broad relocation (**53 files / 1,089 tests passed**). Later small focus/loading/URL tests and focused presentation changes were checked with the focused run rather than rerunning the entire domain suite.

Approximate developer verification consumption: **14/30 minutes**, including source/design checks, diagnostics, test/build waits and rechecks. No browser harness was operated by the developer. The fake DOM's querySelector was expanded while authoring heading-focus behavior tests; this was ordinary test-fixture evolution, not infrastructure/browser harness repair. Coordinator reports **9/10 minutes** and **one bounded live-selector adaptation pass**. Reviewer allowance remains separate within the agreed shared 60-minute ceiling. No additional harness repair is proposed. Coding and document authoring excluded. Checks stop for independent review; prior campaigns remain stopped.

## Criterion-linked evidence and remaining limits

| Criterion | Evidence in this implementation | Limits retained for review |
| --- | --- | --- |
| AC-1 | 1440 native Chrome screenshot and usable three-pane composition; independent navigation/inspector collapse state remains mounted; project management moved to Projects. | No exhaustive collapse/focus interaction matrix. |
| AC-2 | 880 screenshot and compact split; existing Base UI modal drawer retained with explicit finalFocus. | Final drawer live focus flow did not complete in coordinator automation; no passing native drawer-focus claim. |
| AC-3 | Native 720/320 successive surfaces and Back/Edit flow; selected strip remains independent from query/scope. | Long-list/scope scroll restoration inferred from stable DOM/App retained values, not a long-catalogue browser scenario. |
| AC-4 | Coordinator verified exact invalid byte `12x` and the same Red DOM node across 1440→880→720→320 and Back/Edit. Sole editor hook/key/ancestry remain stable. Existing session/reference tests pass. | Valid reference/display-setting combinations were not all exercised across every breakpoint in native Chrome. |
| AC-5 | Native Projects departure guard, Keep editing with raw input/node preserved; explicit Cancel then return. Existing command/session/creation/restore checks passed. | Unknown/read-failure departure combinations remain controlled-test/source evidence, not new live storage qualification. |
| AC-6 | Focus-policy unit regression covers pane selection, modal priority and no open-drawer focus escape. Edit/Inspect focus headings, Back returns to action/row/heading; hidden surfaces use native hidden. | Native final drawer close/scope/resize focus and all fallback destinations remain incompletely observed. |
| AC-7 | Native screenshots at 1440×900, 880×800, 720×800 and 320×720; coordinator reports no document horizontal overflow. Final 320 normal-flow actions no longer overlay Red (Red y522–566, Apply y872). Modal sizing/actions wrap and scroll. | Zoom, short-height, exact threshold-neighbor and all dialog-content samples remain unverified; no criterion weakened. |
| AC-8 | Safety/retention/unknown/read-failure feedback moved outside hidden panes; existing restore/coordination/source/session tests passed; static unsupported/missing/loading entries covered. | No newly claimed live unsupported/group/read-failure/unknown matrix; inherited deferred qualification unchanged. |
| AC-9 | Host/domain/application/adapter/protocol/dependencies unchanged; full suite passed after regrouping. Native worker URL regression fixed and covered. | No new platform/conformance claim. |
| AC-10 | Whole current shell/Projects/editor uses neutral theme, refined 14px body/12px supporting text, consistent panes and controls; V2 Projects ordering/action stacking/header and normal-flow editor actions applied. Native screenshots available. | Static source/design comparison plus bounded screenshots is not exhaustive visual acceptance of every state. |
| AC-11 | Native row selection does not open; explicit Open enters. Supported/unavailable/missing/loading static tests preserve exact identity/reason/count truthfulness. Read-only inspector has no metadata editing or additional header RPC. | Native arbitrary unavailable identities/missing selection not sampled. |
| AC-12 | Native selected backup downloaded; controlled-host test captures ID/r1, blocks repeated issue, refreshes r2 after stale failure, gives captured-identity notice and never opens/retries backup. Pending/unknown/retained/preview gates preserved. | No live concurrent storage mutation stress; selected-revision mismatch is controlled-host evidence. |
| AC-13 | Native create-and-open; same-ID restore file review + Cancel; Projects narrow Inspect/Back. Exact name, staged protection/recovery remain existing owners; App retains context and restore refs. | Full successful same-ID replacement/unknown recovery and long catalogue scroll not newly exercised live; existing protocol/service tests remain relevant. |
| AC-14 | Adopted physical `Workbench/` casing, owner-root entries and supporting components/hooks/helpers/state; shared chrome split from generic UI; move map/current ownership documented. Hook callers/keys/ref lifetimes preserved. | Independent reviewer must assess final stable snapshot; developer checks do not substitute for independent review. |

Coordinator runtime evidence: `output/playwright/increment-011/runtime-observations.json`, representative PNGs in that folder and its isolated synthetic backup. Runtime used installed native Chrome 157.0.8103.51 with a disposable browser context; no user projects were used. The coordinator owns the exact runtime claims and final screenshots.

## Handoff

All developer source/test/README/current-map edits are **paused for independent review**. The coordinator owns contract/status and the exact frozen base-plus-diff snapshot, including new/deleted paths. Use `git -c core.ignorecase=false` for inventory because the physical Workbench casing change can be hidden by default case-insensitive Git discovery. No staging, committing, pushing, dependency installation or storage qualification restart occurred.

Changed paths: presentation regrouping recorded in `moves.json`; new shared ApplicationShell/Header, ProjectInspector, Projects layout hook, SelectionBar and WorkbenchFeedback; App/Projects/Workbench/layout/theme integration; import references in existing consumer/session/source/worker tests and meaningful new controlled-host/render/focus regression checks; README and delivered organisation map.

Suggested commit: `feat: add responsive workbench and project inspection`

## R1 required finding corrections — ready for R2

R1 snapshot/manifest/patch remain unchanged. Only the two required findings and
associated regression tests were changed after the coordinator released the freeze.

- **P1 / AC-13:** App now queues the identity returned by RestoreDialog completion,
  disposes the preview, and issues the normal guarded `open` from an effect on the
  following render. That render captures `hasPreview === false`; no bypass flag or
  weakened normal gate was added. All RestoreDialog Open-local/retained/successful
  completion paths share this callback. The actual App callback→useProjects
  regression uses the established controlled hook runner: stage a file, prove
  ordinary Open remains blocked during preview, invoke completion, then prove one
  `openProject` and Workbench entry after preview disposal.
- **P2 / AC-8/11/13:** Projects now renders its one error ID, notices, recovery and
  unavailable-catalogue retry in a shared feedback region outside both responsive
  panes. Raw error text and existing recovery callbacks are retained. Retry is
  disabled while pending or previewing. There is no duplicated alert/association.
  The existing static renderer regression uses a 720px inspect surface, verifies
  browse is hidden, and verifies identity-bearing error, retry and retained-result
  recovery sit in the visible shared region with exactly one `project-error` ID.

Both tests were written first and failed on the R1 source for the expected defects
(restore remained Projects; shared feedback did not exist). After fixes:

- `npm test -- test/presentation/workbench-coordination.test.tsx test/presentation/projects-screen.test.tsx`
  — **2 files / 22 tests passed**.
- `npm run build` — **all four type scopes and Vite production build passed**;
  worker asset 201.58 kB, main 602.35 kB / gzip 191.48 kB. Existing chunk advisory
  remains unchanged; no threshold/dependency change.
- `git diff --check` — passed.

Approximately **3 additional developer verification minutes**, **17/30 cumulative**,
including source confirmation, red/green tests, build and review of changed paths.
No browser/harness infrastructure work, new harness, dependency or repair cycle.
Shared consumption is approximately **43.5/60 minutes** before R2; prior 2/2 harness
repair ceiling remains reached. No broad suite, browser retry or qualification
restart occurred. R2 reviewer owns independent native completion/source recheck.
Existing unverified acceptance listed above is unchanged.

Source/test/README/current-map edits are **frozen again for R2**. No staging,
committing or pushing. Suggested commit remains
`feat: add responsive workbench and project inspection`.
