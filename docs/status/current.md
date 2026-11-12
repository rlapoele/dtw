# Current Project Status

> Last updated: 12 November 2026
>
> Phase: Increments 007 and 008 Completed
>
> Implementation state: retained React browser workbench, one module worker per tab,
> native IndexedDB/Web Locks, exact independent backups and staged protected restore.
> Applied data is browser-profile/origin local; drafts and forms remain session-only.

## Current focus

**Increment 008 completed — 12 November 2026:** the user reported completing the
remaining manual checks in Chrome with everything looking good and explicitly
instructed closing the increment without restarting automated qualification. The
[manual acceptance and closure record](../increments/008-react-state-and-workbench-composition.md#manual-acceptance-and-closure--12-november-2026)
owns the accepted checklist, evidence attribution and limits. This is user-reported
overall acceptance, not an agent replay or exact-build/browser-version support claim.

Implementation extracts focused hooks and composed views, with one editor session
shared by header and fields. Independent source review found no required corrective
findings. Thirty-two focused tests and the final build (four typechecks plus bundling)
passed during implementation. The bounded Apply focus fix passed its real Chrome
regression and independent recheck; invalid Apply and Cancel focus were also checked,
and sixteen focused tests passed. See the
[follow-up result](../increments/008-react-state-and-workbench-composition.md#follow-up-result).

Original verification used approximately 28.5–29.5 aggregate minutes and one recovery
cycle; the separate Apply follow-up used approximately 8.5 minutes and one repair
cycle. Both remain stopped. Closure ran no application tests, builds or browser
sessions and resets no allowance. Broader qualification remains outside 008;
Increment 007 qualification stays deferred. Staging, committing and pushing remain
with the user.

**cn precompilation — 12 November 2026:** the user authorized moving custom merge
configuration out of the browser bundle. `lib/cn.ts` now consumes generated tables
through `cn/engine`; the CSS theme is the source for caption/heading registration.
Vite generates/watches tables and npm pre-hooks cover typechecks and test startup;
all class groups are retained to preserve the API. See the
[presentation conventions](../project/presentation-conventions.md#class-composition-with-cn).
Fifteen focused icon/consumer tests and all four typechecks pass. An isolated paired
production build measured 516,698 → 471,440 bytes minified and 152,741 → 147,415 bytes
with identical local gzip settings. The precompiled build has no 500 kB chunk warning;
its entry module list contains the merge engine and no cn configuration/compiler.
Building with the generated file absent proved Vite regeneration. Icon behavior,
Button's additive implementation and typography values remain unchanged. This is
bounded build-size verification, not a runtime benchmark or resumed 007 qualification.
Approximately 5–10 aggregate verification minutes (estimate) of a 10-minute ceiling
were used, with zero harness repairs; focused diff/whitespace review is complete.
No browser tests or full-suite rerun were performed, and no further run is scheduled.

**Shared Icon and cn maintenance — 12 November 2026:** the user authorized a typed
`components/ui/icon.tsx` and shared `lib/cn.ts` backed by pinned `cn` 0.5.2. All four
production icon consumers now use the wrapper. Default sizing/decorative semantics,
caller class overrides and optional accessible labels follow the
[presentation conventions](../project/presentation-conventions.md#icons). The merger
recognizes our caption size and heading weight; Button's additive implementation is
byte-for-byte unchanged. Fourteen focused icon/consumer tests, all four typechecks
and an isolated Vite production build passed. Vite warned about the 516.69 kB app
chunk; this task makes no bundling optimization or performance claim. Verification
used approximately 5–10 aggregate minutes (estimate) of a 10-minute ceiling, with
zero harness-repair cycles; checks are finished, including reference/whitespace checks.
No browser test or full-suite rerun occurred. Increment 007 remains closed and its stopped
qualification campaign remains unauthorized.

The user reported finishing the manual tests with everything looking good and
instructed closing Increment 007, documenting deferred checks and not restarting
automated qualification. The [closure amendment and completion report](../increments/007-local-retention-and-backup.md#closure-and-qualification-amendment--12-november-2026)
record this decision. The [manual acceptance record](../increments/007-manual-acceptance.md)
is user-reported overall acceptance, not an agent replay or an exact-build support
claim; optional AT/cross-browser outcomes and environment metadata were not supplied.

The earlier OKLCH preview issue was fixed with native CSS previews for all five
supported spaces, preserving exact authored values. The user explicitly confirmed
the original case works, then completed manual testing. Presentation composition is
`app/App.tsx` and `app/Workbench.tsx`; current source paths are in the [README](../../README.md).

## Evidence and limits

Code at closure is commit `6904d45` (native CSS previews), following `27bb970`
(component rename), `b1662a4` (proportionate workflow) and `cb77be8` (retention/backup).
The user reports committing and pushing these changes.

- Original R7 implementation review: 1,031 tests / 45 files, four typechecks and build
  passed within the [recorded review scope](../../output/increment-007-implementation/reviewer-final/r6-source-review.md).
- Native CSS follow-up: 22 focused tests and all four typechecks passed; the user
  confirmed the preview in the browser. The rename had identifier/import parity.
- Existing functional, ordinary performance, maximum entity/catalogue and controlled
  recovery evidence retains its original snapshots and limits. No old failed or
  unrun case is relabelled passing, and no new qualification was run for closure.

The contract's [deferred qualification register](../increments/007-local-retention-and-backup.md#deferred-qualification)
owns remaining large-source access/performance, adversarial resource/concurrency,
exceptional lifecycle, deployed HTTPS/CSP/support-matrix, dedicated accessibility
and additional-engine checks. The recorded in-page Find API visibility failure
remains an unresolved observation, not a proven defect of real browser Find UI.
These checks are explicitly deferred from 007 closure, not completed or scheduled.
Install/offline PWA acceptance, interchange and Electron remain later milestones.

## Next meaningful action

Await the user's next direction. Increment 008 is closed following Chrome manual
acceptance; closure does not authorize another increment or further qualification.
Any future qualification requires an explicitly authorized bounded follow-up. No
agent, snapshot or workflow change resets prior consumption. The stopped Increment
007 campaign's remaining authorized allowance stays **zero**.

The 007 and 008 closures were documentation-only. The 008 contract records planning,
implementation and Apply follow-up evidence separately. The
[pre-008-closure snapshot](history/2026-11-12-increment-008-before-closure.md) preserves
the previous handoff; owning documents and Git preserve detailed history.

## Resume

Read AGENTS.md, this status, actual Git state and the applicable agreed increment or
proposal. Use the [README](../../README.md) for commands and product limitations.
Do not treat historical plans, deferred checks or a continuity request as authority
to resume qualification or start implementation.
