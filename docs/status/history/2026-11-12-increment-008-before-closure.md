> Superseded on 12 November 2026 by [current status](../current.md), following
> user-reported Chrome manual acceptance and closure of Increment 008.

# Current Project Status

> Last updated: 12 November 2026
>
> Phase: Increment 007 Completed; Increment 008 implemented, acceptance incomplete
>
> Implementation state: retained React browser workbench, one module worker per tab,
> native IndexedDB/Web Locks, exact independent backups and staged protected restore.
> Applied data is browser-profile/origin local; drafts and forms remain session-only.

## Current focus

**React state and workbench composition — 12 November 2026:** the user agreed
and authorized [Increment 008](../../increments/008-react-state-and-workbench-composition.md).
Implementation extracts focused hooks and composed views; one editor session supplies
both inspector header and fields. Status is **Agreed / Implemented; acceptance
incomplete**. Independent source review found no required corrective findings.
Thirty-two focused tests and the final build (all four typechecks plus bundling)
passed. Representative Chrome smoke covered ordinary authoring/draft/collapse,
departure cancellation, Cancel focus and compact drawer behavior.

**Apply focus follow-up — 12 November 2026:** the user authorized a bounded fix
and independent recheck. Focus was attempted before React committed the enabled
fieldset. A one-shot effect now restores focus after successful Apply. The real
Chrome regression failed before and passed after; the independent reviewer also
verified successful Apply focus, invalid Apply error focus/raw preservation and
Cancel reset/focus. Sixteen focused tests passed; no corrective findings.
See the [follow-up result](../../increments/008-react-state-and-workbench-composition.md#follow-up-result).
The focused Apply observation is resolved; visual parity, comprehensive focus
containment/return and remaining delayed-refresh/restore runtime paths retain their
previous explicit limits. Increment 008 acceptance therefore remains incomplete.

Original shared verification used approximately 28.5–29.5 aggregate minutes and
one tooling-recovery cycle. The separately authorized Apply follow-up used
approximately 8.5 aggregate minutes and one repair cycle. Both are stopped, without
a reset or scheduled follow-up. No 007 qualification was restarted. Staging,
committing and pushing remain with the user.

**cn precompilation — 12 November 2026:** the user authorized moving custom merge
configuration out of the browser bundle. `lib/cn.ts` now consumes generated tables
through `cn/engine`; the CSS theme is the source for caption/heading registration.
Vite generates/watches tables and npm pre-hooks cover typechecks and test startup;
all class groups are retained to preserve the API. See the
[presentation conventions](../../project/presentation-conventions.md#class-composition-with-cn).
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
[presentation conventions](../../project/presentation-conventions.md#icons). The merger
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
automated qualification. The [closure amendment and completion report](../../increments/007-local-retention-and-backup.md#closure-and-qualification-amendment--12-november-2026)
record this decision. The [manual acceptance record](../../increments/007-manual-acceptance.md)
is user-reported overall acceptance, not an agent replay or an exact-build support
claim; optional AT/cross-browser outcomes and environment metadata were not supplied.

The earlier OKLCH preview issue was fixed with native CSS previews for all five
supported spaces, preserving exact authored values. The user explicitly confirmed
the original case works, then completed manual testing. Presentation composition is
`app/App.tsx` and `app/Workbench.tsx`; current source paths are in the [README](../../../README.md).

## Evidence and limits

Code at closure is commit `6904d45` (native CSS previews), following `27bb970`
(component rename), `b1662a4` (proportionate workflow) and `cb77be8` (retention/backup).
The user reports committing and pushing these changes.

- Original R7 implementation review: 1,031 tests / 45 files, four typechecks and build
  passed within the [recorded review scope](../../../output/increment-007-implementation/reviewer-final/r6-source-review.md).
- Native CSS follow-up: 22 focused tests and all four typechecks passed; the user
  confirmed the preview in the browser. The rename had identifier/import parity.
- Existing functional, ordinary performance, maximum entity/catalogue and controlled
  recovery evidence retains its original snapshots and limits. No old failed or
  unrun case is relabelled passing, and no new qualification was run for closure.

The contract's [deferred qualification register](../../increments/007-local-retention-and-backup.md#deferred-qualification)
owns remaining large-source access/performance, adversarial resource/concurrency,
exceptional lifecycle, deployed HTTPS/CSP/support-matrix, dedicated accessibility
and additional-engine checks. The recorded in-page Find API visibility failure
remains an unresolved observation, not a proven defect of real browser Find UI.
These checks are explicitly deferred from 007 closure, not completed or scheduled.
Install/offline PWA acceptance, interchange and Electron remain later milestones.

## Next meaningful action

User review of the implemented Increment 008 and its explicit acceptance gaps.
The Apply focus issue is fixed and independently rechecked. Any further investigation
of remaining unobserved browser paths requires a separately authorized bounded
verification follow-up; do not infer
one from continuation. No agent, snapshot or workflow change resets consumption.
The stopped Increment 007 campaign's remaining authorized allowance stays **zero**.

The 007 closure and 008 contract preparation ran no application tests/builds or
browser sessions. The 008 contract records planning consumption separately from
implementation verification. The [previous status snapshot](../history/2026-11-12-increment-007-before-closure.md)
preserves the pre-closure handoff; owning documents and Git preserve detailed history.

## Resume

Read AGENTS.md, this status, actual Git state and the applicable agreed increment or
proposal. Use the [README](../../../README.md) for commands and product limitations.
Do not treat historical plans, deferred checks or a continuity request as authority
to resume qualification or start implementation.
