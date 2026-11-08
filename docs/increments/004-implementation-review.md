# Increment 004 implementation review

8 November 2026. Independent reviewer assessment of base `8ab986f` plus the uncommitted source/new files identified by `output/playwright/increment-004-refactor/review-snapshot.sha256`. All 25 manifest entries matched before and after this review. Contract/status completion edits are coordinator-owned and outside that manifest. No source, tests or requirements were edited by the reviewer.

## Initial verdict

**One required correction (R1) before completion.** The presentation refactor otherwise improves ownership and preserves the sampled authoring behavior and computed layout. This is a scoped review, not exhaustive correctness or accessibility certification. Separate designer findings belong to the coordinator's fidelity review.

### R1 — P2: preserve the accepted DialogContent className callback

- Criterion: AC-3, owned presentation components and forwarded Base UI props; related AC-7 component API verification.
- Location: `src/presentation/components/dialog-content.tsx:12`.
- Scenario: render the owned shell inside Dialog.Root with `className={(state) => "review-callback"}`. Its declared `Dialog.Popup.Props` accepts that callback, but the wrapper keeps only string values. The callback is never invoked and its classes disappear. This reproduces the same class-composition failure being repaired in Button at another newly owned boundary.
- Independent evidence: [standalone reproduction](../../output/playwright/increment-004-review/dialog-callback.html), [result](../../output/playwright/increment-004-review/dialog-callback-result.txt): callback invocation count `0`, caller class absent, owned shell classes retained. The local Vite dependency query in this disposable artifact identifies the module cache for this run; it is not a production API.
- Impact: latent component API defect; current production callers use string classes, so no existing modal workflow failure is claimed.
- Requested correction: compose the callback with actual Popup state and owned classes, and add a rendered check proving callback state/invocation and class retention. Preserve string callers, props/ref/render behavior and existing geometry.

### Optional cleanup

`styles.css:144` retains `.list-footer` in a typography selector group although source/development fixtures have no consumer (`rg -n 'list-footer' src test/browser` finds only this line). Remove this orphan when addressing R1 or record it as a small cleanup gap. It has no observed runtime effect and does not undermine the broader cascade migration.

## Independent checks and observations

- `npm run typecheck`, `npm test`, `npm run build`, `git diff --check`: passed. Existing 894 tests across 32 files remain intact. Production output was CSS32.62kB/JS400.76kB; no bundle budget claim.
- Inspected changed App/Editor/ColorFields/Select/Button/styles and every new component, creation/navigation/list extraction, development API fixture, README/architecture descriptions. Domain/application/adapters, session, exact-range helper, dependencies and lockfile have no diff against the base.
- Button rendered API checks passed in reviewer session `dtw004-review`: actual callback disabled state/classes, caller string class, forwarded title/ref, Enter activation, disabled handler suppression, reachable compact28 size, Dialog.Trigger/Close render composition and focus return. The focused fixture is manually executed browser evidence, not part of the 894 Node tests.
- Reviewer-authored [authoring/responsive flow](../../output/playwright/increment-004-review/independent-flow.js) and [result](../../output/playwright/increment-004-review/independent-result.txt) independently verified long exact strings, passive color-space return, raw incomplete `-`, `none` with withheld slider, mode/collapse retention, rejected Apply, hidden authored panel after resolved-tab activation, selected-filter action/focus, drawer Escape/focus return and modal Escape. The script explicitly waits for tab mounting; an initial unsynchronized immediate visibility probe was not a defect.
- Independently reran inspected failure/ownership scenarios into reviewer-owned artifacts: [script](../../output/playwright/increment-004-review/failure-ownership.js), [result](../../output/playwright/increment-004-review/failure-ownership-result.txt). Group create/rename failure fields survived; successful rename kept identity; inspector scroll restored after collapse and reset after changed selection; accepted dirty departure completed. Commit/read/create failures retained draft/data, protected metadata survived, inspect-only Number had no revision actions, and unrelated missing references blocked repair without changing storage.
- Independently reran the baseline/final comparison in the reviewer browser against isolated base5184/current5173: [script](../../output/playwright/increment-004-review/paired-styles.js), [result](../../output/playwright/increment-004-review/paired-result.txt). The script settles two frames at each threshold. Selected control/panel geometry, effective fonts/colors, spacing and responsive grids match at1440/1499/1500/1120/1119/901/900/768/767/541/540/320 widths and1440×480 short height. Differences were the disclosed4px vs5px/3px minor corners, zero-width border serialization, inert flex-label grid columns, and superseded mode minimum29px with effective32px retained. This is selected-property evidence, not pixel identity. Reviewer captures are under `output/playwright/increment-004-review/`; UUID text differs between runs.
- Inspected reviewer320px screenshot: drawer trigger, list, inspector context and sticky actions remained reachable without horizontal document overflow. Desktop/tablet/short screenshots and modal/drawer captures supplement computed checks. Immediate matchMedia measurements in the independent-flow log can precede React's topology update; the settled paired comparison is the authority for breakpoint geometry.

## Criteria assessment and limits

| Criterion | Review assessment |
| --- | --- |
| AC-1 | Ordinary layout/control rules moved into actual Tailwind utilities and owned components. Broad inherited native font/focus foundation is layered; no unlayered input/select/button geometry, `!important` or `@apply` workaround. Remaining CSS has identifiable typography/precision geometry/effect/pseudo-element owners. Minor orphan selector noted above. |
| AC-2 | Explicit typed variants/sizes have production callers or rendered checks. Callback/ref/render/disabled/keyboard paths passed; historical unreachable size rules removed without activating new production dimensions. |
| AC-3 | Coherent navigation/list/creation rendering extracted while App retains operation coordination, shared state and departure/focus policy. Labels/selects/ranges/tabs remain native/Base UI as appropriate. R1 blocks full API acceptance. |
| AC-4 | Standard numeric spacing utilities, semantic roles and documented narrow exceptions are used; no arbitrary bracket-value utilities or custom measurement-token catalogue. Final developer inventory/dispositions were consulted after source review. Disclosed minor corner normalization remains subject to designer judgment. |
| AC-5 | No semantic/session helper changes; independent raw-input, rejection/failure, identity, protected metadata and draft checks passed. Existing tests remain intact. Not every numerical fixture was rerun in-browser during this presentation review. |
| AC-6 | Settled baseline comparison and sampled real interactions passed at required width/height transitions. Actual200% zoom evidence was inspected in developer artifacts (`realzoom-metrics/result`, settings/authoring/error captures), with720×450,DPR2,visualViewport.scale1 from1440×900,DPR1; reviewer did not independently repeat browser settings zoom. Separate designer check is required by the contract. |
| AC-7 | Independent checks and identified snapshot complete; R1 needs correction/recheck and coordinator completion report. Developer evidence index consulted after independent source review; stale/interim captures and an earlier connection-refused comparison log were not counted as passing. |

No screen-reader session, physical device/keyboard or virtual-keyboard testing; no Firefox/WebKit runtime verification, exhaustive screenshot comparison, all-domain numerical proof or formal WCAG claim. No mutation testing: source freeze and explicit reviewer read-only boundary took precedence over generic skill guidance. No production-source changes, installs, staging, commits or pushes by reviewer.

## R1 recheck — 8 November 2026

**R1 resolved; no remaining required findings in this scoped review.** The optional orphan selector was also removed. This supersedes the initial verdict above; the initial finding and original snapshot attribution remain historical evidence.

Reviewed the updated 25-file snapshot `output/playwright/increment-004-refactor/review-snapshot-r1.sha256` (manifest SHA256 `92614f11b7333fe8b67ab1ddbbb27451a428c24338dc1c0ee553cb3040c551ca`). Every manifest entry matched. Inspected the correction in DialogContent, the undefined-result guard in Button, added rendered fixture, orphan removal and restored hamburger utility dimensions. No unrelated semantic changes observed.

Reviewer-authored [targeted recheck](../../output/playwright/increment-004-review/r1-recheck.js) and [result](../../output/playwright/increment-004-review/r1-recheck-result.txt) passed in isolated session `dtw004-review`: Popup callback receives actual open/nested/transition state; caller and owned classes coexist; callback returning undefined removes caller classes without adding an `undefined` class or losing owned classes. The custom rendered SECTION, forwarded title/ref and render attributes survive. Escape closes and returns focus to the trigger; string caller classes also survive. Button's undefined callback retains owned geometry without a literal undefined class. This is independently executed evidence; developer red/green claims are not the basis for resolution.

[Independent icon check](../../output/playwright/increment-004-review/r1-icon-result.txt) measured restored22×22 hamburger inside44×44 trigger at768px; drawer opens and Escape closes. `rg` confirms `.list-footer` absent from source/fixtures. `npm run typecheck` and `git diff --check` passed again. Broad unaffected tests/matrix were not repeated: initial full independent checks remain above, and this correction is limited to component class composition and the identified optional cleanup/fidelity details. Earlier coverage limits remain, including actual200% zoom inspected from developer evidence rather than independently repeated, no physical devices/screen reader, and no exhaustive correctness claim.

Final completion/status and the separate designer disposition remain coordinator-owned.
