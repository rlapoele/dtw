# Current Project Status

> Last updated: 13 November 2026
>
> Phase: Increment 009 Phase 2 implemented and independently reviewed; user review pending
>
> Implementation state: retained React browser workbench, one module worker per tab,
> native IndexedDB/Web Locks, exact independent backups and staged protected restore.
> Applied data is browser-profile/origin local; drafts and forms remain session-only.

## Current focus

**Phase 2 implementation handoff — 13 November 2026:** functional workbench
folders, focused reference/recovery/action contracts and cohesive navigation-layout
composition are implemented. The [ownership map](../project/workbench-component-organisation.md)
records current paths, editor/session ownership and deliberate cross-block leaves.
Developer focused regressions pass 32/32 and final build passes all four typechecks
and bundling; independent frozen-source review found no actionable defects.
Native Chrome smoke confirmed approved color controls and invalid raw-draft
preservation into All content plus reference-section rendering. See the
[Phase 2 handoff](../increments/009-workbench-usability-and-component-boundaries.md#phase-2-implementation-handoff--13-november-2026)
for evidence and limits. Approximately 8.5 of 10 aggregate verification minutes,
zero repairs; stopped. Phase 1 changes and extension are user-approved; Phase 2
awaits user review. Earlier explicit manual-acceptance gaps remain, so Increment 009
is not marked Completed. No staging/commit/push or qualification restart occurred.

**Phase 1 slider extension handoff — 13 November 2026:** after approving Phase 1,
the user requested side-by-side color components, separate Alpha, sliders above
exact inputs and circular thumbs. Implemented in the existing color fields/range
CSS; presentation compile and 36 focused tests pass, independent source review found
no actionable defects. [Screenshot/evidence](../../output/increment-009-phase1-extension/chrome-review.md)
records native Chrome layout, invalid raw text preservation and Cancel focus
return, with exact viewport/compact rechecks explicitly unverified. Approximately
eight of ten extension verification minutes, zero repairs; checks stopped.
Phase 2 has not started and its ten-minute allocation is untouched. Await user
review/go-ahead; previous gaps and stopped qualification remain unchanged.

**Increment 009 closure Phase 1 handoff — 13 November 2026:** editor density and
All content presentation changes are implemented. Chrome evidence shows all four
sRGB inputs including Alpha above actions at 1280 × 800, a readable vertical
inventory, compact drawer keyboard/focus behavior, invalid draft preservation and
normal-UI legacy restore with exact duplicate/orphan selection. Focused tests 9/9
and presentation compile pass; independent source review found no actionable
defects. The [phase handoff](../increments/009-workbench-usability-and-component-boundaries.md#phase-1-implementation-handoff--13-november-2026)
and [rendered checklist](../../output/increment-009-phase1/checklist.md) explicitly
retain missing interaction/source/backup-roundtrip and rare-recovery evidence.
Phase 1 is ready for user review, not claimed fully accepted. Verification stopped
at approximately 20 aggregate minutes, zero harness repairs. Phase 2 has not begun;
its ten-minute allocation is unused and awaits user review/comments/go-ahead.
Naming and data-safety agreements stand; staging/commit/push remain with the user.

**Increment 009 implementation handoff — 13 November 2026:** the agreed naming
policy and V1/V2 design are implemented and independently source-reviewed, with no
demonstrated required defects. The [completion report](../increments/009-workbench-usability-and-component-boundaries.md#completion-report)
records delivery **Partially completed**, because representative compact/focus,
draft/departure and native legacy restore/selection acceptance remain pending.
The developer reports 72 focused tests and the final build passing; bounded Chrome
checks confirmed normalization, collision rejection, All content context and
readable resolution. Source ownership now separates browser view, lifecycle,
backup coordination and focused inspector sections. New authoring uses the agreed
pinned Unicode 17 preparation/comparison and collision guards; supported legacy
admission remains exact. See the report for evidence and limits.

Approximately 25 of 30 aggregate verification minutes were used; both harness
repair cycles were consumed and the affected fixture campaign stopped. Independent
source/evidence review and the existing Chrome walkthrough required no further
repair. Prior 007/008/design campaigns remain stopped. Staging, committing and
pushing stay with the user. Earlier pending-authority prose below is historical,
superseded by final user agreement and implementation authorization.

**Increment 009 proposal — 13 November 2026:** the user requested a proposal
addressing the rendered UX/UI and React component architecture findings, explicitly
without implementation. The [draft contract and design direction V1](../increments/009-workbench-usability-and-component-boundaries.md)
cover coherent browser context, readable inspection, editor spacing/copy and
focused component/workflow ownership. Separate analyst drafting and independent
designer recommendations informed the proposal. The user selected the direction
and authorized mockups on 13 November. [Design V1](../../prototypes/increment-009-v1/DESIGN-V1.md)
and its [screenshot gallery](../../output/increment-009-design-v1/index.html) are ready
for user review. A bounded mockup render check observed desktop/compact fixture
states; [evidence and limits](../../output/increment-009-design-v1/review.md) record
approximately 12–15 aggregate minutes and one harness repair, now stopped.
The user approved V1 for analyst review on 13 November. The [fresh analyst review](../increments/009-design-review.md)
initially identified one required P2 correction **D9-1** concerning ambiguous
inventory entries. The proposed React
boundaries are viable at design level; unmodeled integrity/focus/source behavior
remains required and unverified. Review used approximately 7–9 aggregate minutes
(estimate), zero repairs, and is stopped. No mockup correction, browser rerender,
application tests/builds or implementation occurred during this review.
Final agreement and implementation authorization remain pending. Earlier
qualification campaigns remain stopped; Increments 007 and 008 remain completed.

**Path uniqueness amendment — 13 November 2026:** the user agreed prevention of
duplicate project paths regardless of token type, preserving access to existing
conflicting data. The [amended draft](../increments/009-workbench-usability-and-component-boundaries.md#agreed-direction-amendment--13-november-2026)
adds AC-9/AC-10: deterministic authoring checks for creation/group rename and
affected descendants; unchanged supported legacy load, inspection, backup and
restore; no silent repair or new rejection solely for unrelated old collisions.
The [analyst reassessment](../increments/009-design-review.md#requirements-amendment-and-d9-1-reassessment--13-november-2026)
reframes D9-1 as prevention first, with identity-safe access still required for
legacy conflicts/unavailable paths. The finding remains open; no revised mockup
or production acceptance is claimed. The earlier exact-text comparison proposal
is superseded by the subsequent naming direction below.
Only documentation changed. Approximately 7–9 aggregate amendment/reassessment
minutes were used (estimate: 5–6 analyst plus 2–3 coordinator), zero repairs;
checks are stopped. No tests, builds, browser runs or implementation occurred.

**Naming direction and Unicode recommendations — 13 November 2026:** the user
selected whitespace removal throughout namespace names, lowercasing newly authored
names, case-insensitive paths, NFC and retained accents. The
[named policy](../increments/009-naming-policy-proposal.md) records the agreed
pinned Unicode 17.0.0 baseline, all 25 `White_Space` code points plus three explicit
zero-width spacing controls, default full lowercase for stored new names and
canonical caseless matching for derived segment keys. The user explicitly agreed
the precise definitions and authorized V2 mockups on 13 November. Combining marks and
language-significant joiners are not indiscriminately stripped; legacy stored
names and supported backup/restore admission remain unchanged. AC-11 and the
[appended analyst reassessment](../increments/009-design-review.md#naming-amendment-and-d9-1-reassessment--13-november-2026)
record the amendment; D9-1 remains open for exceptional legacy/unavailable-path
access. Primary sources were checked; documentation/source review used about
8–9 aggregate minutes (estimate: six analyst plus two–three coordinator), zero
repairs, and is stopped. No tests, builds, browser runs or implementation occurred
in that documentation stage. The separate designer's
[Design V2](../../prototypes/increment-009-v2/DESIGN-V2.md) and
[screenshot gallery](../../output/increment-009-design-v2/index.html) are ready for
user review. V2 covers name preparation, blocked collisions and unchanged legacy
conflicts with per-entry identities; V1 is frozen. The
[rendered observations and limits](../../output/increment-009-design-v2/review.md)
record approximately 12–15 aggregate mockup-review minutes (estimate), zero repairs,
now stopped. Fixtures do not implement or qualify production Unicode/validation/
storage behavior. No application tests, production builds or implementation ran.
The user approved V2 for analyst review on 13 November. A fresh source/saved-image
[consistency review](../increments/009-design-v2-review.md) against baseline `b33aadb`
is complete with no required findings. **D9-1 is addressed at design-review level**
by V2's per-entry identities/context and unavailable-path treatment; earlier open
dispositions above are historical. The review maps AC-1 through AC-11 and preserves
unverified production Unicode/enforcement/integrity requirements. Approximately
8–9 aggregate minutes (estimate: six analyst plus two–three coordinator), zero
repairs, now stopped. No browser rerender, application tests/builds or implementation
occurred. Final design/contract agreement and application implementation
authorization remain pending.

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

User review of Phase 2's ownership/folder map and working application. Both closure
phases are implemented; Phase 1 and its slider extension are approved. Retain the
recorded manual-acceptance gaps and do not automatically start another review or
qualification campaign. Staging, committing and pushing stay with the user.
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
