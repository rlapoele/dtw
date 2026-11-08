# Increment 006: Integer RGB controls and identity presentation

- Contract status: Agreed
- Delivery status: Completed
- Agreement: on 8 November 2026, after the coordinator recommended whole-number editing in the existing 0–255 control with exact Normalized · 0–1 entry and quieter token IDs, the user explicitly requested: “Excellent. Implement your suggestion for the 0-255 control behavior as well as for the token IDs.” This document records that authorized bounded proposal, rather than claiming approval of an agent-written draft or asking for a repeated approval.
- References: [active color policy amendment](003-color-policy-proposal.md#approved-integer-control-amendment--8-november-2026), [canonical color model](../design-tokens/conceptual-model.md#color-literals), [architecture](../project/architecture.md), [Increment 003](003-visible-color-authoring.md), [Increment 005](005-token-details-and-color-components.md), [visual direction](../project/visual-direction.md), [open questions](../planning/open-questions.md), [agent workflow](../workflow/agent-roles.md).

## Outcome

Authors use predictable whole-number sRGB controls without losing exact normalized values, and identify tokens/groups by their paths without scanning UUIDs during ordinary work. Stable IDs still determine identity, selection, containment and references, with technical data available through existing disclosures.

## Scope

1. Make only the existing sRGB 0–255 UI whole-number-oriented, with truthful derived approximation and explicit per-channel editing. Preserve exact normalized entry, canonical ranges, calculation APIs and explicit Apply.
2. Remove routine raw-ID decoration from token rows, inspector headers, normal reference/group-parent choices, navigation and readable authored-reference summaries. Disambiguate choices only when paths cannot identify them uniquely.
3. Preserve full IDs in existing All authored data, diagnostics, traces and technical disclosures, with no canonical JSON changes.

Excluded: global debug modes/preferences; persistence; new dependencies; new spaces or color operations; canonical/infrastructure/API schema changes; clamping or byte-encoding policy; renaming/name-uniqueness rules; a new technical-inspection system; historical prototype, report, evidence or vendored-reference edits. Existing authored literal summaries stay exact normalized data under Increment 005.

## Acceptance criteria

- AC-1 — **Integer-oriented controls:** the existing 0–255 RGB text controls accept canonical signed whole-number text and `none`, using current Decimal grammar rather than a permissive Number parser. Fractions, incomplete and otherwise noncanonical text remain visible and correctable with a clear associated error; do not silently round them or allow Apply to commit a hidden prior literal. Sliders retain nominal 0–255 travel and step 1. Extended integers such as `-255` and `510` remain valid authored input and map to `-1` and `2`; preserve the outside-visual-range explanation instead of clamping or fabricating a thumb. Alpha controls and exact Normalized · 0–1 input remain unchanged.
- AC-2 — **Truthful rounded inspection:** derive a byte coordinate by exact decimal multiplication by 255 and round only the displayed coordinate to the nearest integer, ties to even. No prior Number conversion or significant-digit formatting may change the rounding decision. Show a clear visible and accessible approximation indication for every fractional scaled coordinate. Exact integers and `none` receive no rounding indication. Example: normalized `0.2314` displays `59` as approximate, with the original exact normalized value available. Preserve existing resource guards, unsupported-representation handling and exact interval eligibility; an outside nominal-range source does not gain an available slider merely because its rounded display lies on a boundary.
- AC-3 — **No passive writes and channel isolation:** switching scale or passively exploring spaces never dirties or rounds the authoritative literal. Returning to its exact view restores original coordinate text. An unchanged Apply is unavailable or performs no authored mutation. Track explicit channel edits separately from passive rounded displays/raw caches: editing Green to `130` with Red `0.2314` preserves Red and every untouched RGB/alpha string exactly. Only that Green coordinate uses the existing decimal byte-division rule: terminating quotients exact, otherwise 18 significant digits, ties to even. Alpha-only Apply while byte values are rounded preserves all original RGB strings and authored space. Retyping an identical displayed integer is an explicit edit; unrelated channels remain unchanged. Real cross-space component edits retain the existing promotion semantics.
- AC-4 — **Draft and failure preservation:** invalid fractional/raw byte text blocks Apply and representation/scale changes that would discard it, and remains visible through mode changes/pane collapse and failed operations under the existing independent-form policy. Correcting the edited channel can recover without reparsing untouched rounded displays into authored values. Valid raw edits survive passive browsing; actual edits that invalidate a derived cache clear/recompute it under the existing session policy. Preserve explicit Apply/Cancel, successful-baseline reset, inactive-form clearing on success, failure retention, departure protection, focus behavior and inspect-only restrictions. No stale cached byte value or prior hidden valid literal may bypass current invalid text.
- AC-5 — **Quiet normal presentation:** ordinary token rows and inspector headings, navigation/group controls, reference-target and group-parent options, and readable authored-reference summaries use human-readable names/paths without routine full UUID decoration. Preserve type/space/description/context labels. Unambiguous valid paths need no ID suffix. A missing authored-reference target reads Reference / Missing target; its raw ID remains available in existing diagnostic/raw-data inspection. Do not turn references into resolved literals or fabricate target paths.
- AC-6 — **Collision-safe choice labels:** duplicate, empty and invalid derived-path choices remain visibly distinguishable in token selection, namespace navigation/group-parent choices and reference-target selection. Add a short stable-ID suffix only to the otherwise ambiguous choices, extending it as necessary against the whole ambiguous set; never assume eight characters are unique. Account for collisions in rendered path/fallback labels as well as identical paths. Selection values/keys and authored references remain full stable IDs. Duplicate names/paths remain supported, without imposing uniqueness or rewriting names. Renaming a containing group refreshes displayed paths while preserving selected token/group and reference targets by identity. A technical suffix is presentation only, never stored path/name data.
- AC-7 — **Technical fidelity and bounded regressions:** All authored data remains the actual canonical token JSON, including full IDs, ordered components and separate exact alpha. Existing technical diagnostics/traces retain their full IDs. Keep the current five-space model, exact normalized input/alpha/identity, general decimal-capable `byteToNormalized`/`normalizedToByte` APIs, numerical precision/guards/budgets, missing/powerless-component handling, no authored clamping/gamut mapping, constructor validation, safe tiny-red HSL refusal, metadata and session-only behavior. No new dependency, persistence or preference is introduced.
- AC-8 — **Verified stable result:** meaningful tests and actual IAB checks cover the changed behaviors and failure states. Existing tests, strict typechecks, production build and whitespace checks pass. A separate fresh-context reviewer assesses an identified stable snapshot, with findings resolved/rechecked or explicit remaining gaps. Attribute browser work to its actual executor; do not imply an unavailable independent browser check occurred.

## Decisions and assumptions

- Agreed: the final integer-control recommendation supersedes the earlier fractional scaled-entry UI recommendation. It does not supersede canonical Decimal support or general calculation APIs. The active owning policy/model are amended narrowly; historical evidence retains its original meaning.
- Routine deterministic choice: nearest-integer derived display uses the existing decimal ties-to-even convention, without binary coercion. Exact implementation/helper and suffix lengths are engineering choices constrained by AC-2/AC-6.
- Established: Increment 003 expressly permits duplicate/empty names and duplicate paths. The identity change is a presentation improvement, not a uniqueness validator or identity migration.
- Assumption grounded in the approved scope: existing raw data, diagnostics and technical disclosures suffice for full-ID access. No debug mode or extra preferences are needed.
- Resolve before implementation: none identified. Material scope/design changes return to the coordinator/user; routine choices within these criteria proceed without repeated approval.
- Deferred: existing durable-retention, interchange, broader color-operation and host questions remain in their owning open questions.

## Ordered implementation tasks

| Task | Boundary and evidence |
| --- | --- |
| T1 — Baseline and regression cases | Verify Git; inspect existing `session.ts` byteText caching, ColorFields scale/slider logic, Apply validation, raw inspection and ID consumers. Add behavioral regressions demonstrating the precision/cache and label-collision risks. AC-1–AC-7. |
| T2 — Integer UI and session isolation | Implement exact nearest-integer derived presentation with approximation metadata, UI-only whole-number validation and explicit edited-channel tracking. Keep general domain calculations decimal-capable. Preserve alpha-only, raw invalid and view/promotion behavior. AC-1–AC-4, AC-7. |
| T3 — Identity presentation | Share the small presentation logic needed for quiet path labels and collision-safe disambiguation across actual selection surfaces. Remove routine UUID decoration while retaining raw data and technical IDs. Verify rename/missing-target cases without changing operations/model. AC-5–AC-7. |
| T4 — Runtime evidence and stable review | Run automated checks and focused IAB scenarios; record evidence in a new increment-specific location. Pause source edits, identify snapshot and hand off to independent reviewer. Correct/recheck findings, then coordinator records completion/status and human Git handoff. AC-1–AC-8. |

## Verification approach

Use fixed exact-decimal fixtures for both sides of positive/negative half ties, exact integer products, `none`, signed/extended values, long coordinates and source values whose binary/significant-digit coercion would change a tie decision. Preserve the domain API's fractional fixtures (`127.5` → `0.5`, tiny nonzero input) while proving UI fractional text cannot submit. Exercise session sequences rather than merely testing a formatter: Red `0.2314` → byte view `59` approximate → Green `130` → Apply; alpha-only Apply; passive scale/space round trips; identical integer retyping; invalid fraction followed by editing another channel, blocked Apply, mode/pane retention, correction, Cancel and failed-operation retry. Assert exact original strings for every untouched channel and alpha. Check normalized arbitrary fractional input still works and rounding never changes source interval eligibility.

For labels, exercise actual rendered consumers with unique paths, duplicate names in different groups, identical paths, empty/invalid paths, fallback-label collisions, and IDs sharing the usual short suffix so fixed truncation fails. Ensure every member of an ambiguous set is distinguishable; assert option values/actions still use full IDs, rename refresh preserves identity/alias target, missing target reads clearly, and full IDs remain in real raw JSON/diagnostics. Assertions that only compare a helper with itself are insufficient.

IAB runtime evidence covers byte text/slider/approximation/error associations and explicit application readback, exact normalized restoration, alpha-only and rejected Apply, keyboard access, path choice/rename behavior, readable missing targets and technical inspection. Check wide and compact presentation, long suffix wrapping, narrow/short-height containment and existing focus behavior proportionately. The user's current production tab at port 4185 has an unsubmitted draft: do not reload/navigate it or rebuild its shared assets. Use a separate preview/build output and task tab for verification, then surface the stable result in a fresh preview. Do not substitute Chrome/CLI automation for the requested IAB without explicit user authorization. State unavailable actual zoom, screen-reader, physical-device or cross-engine coverage honestly rather than claiming it from viewport resizing.

Run `npm test`, `npm run typecheck`, `npm run build` with an isolated output location while the user's current preview needs its assets, and `git diff --check`. Preserve the maintained-entry development-scan boundary and historical evidence. No staging, commits, pushes or deployment.

## Design proposal and approval record

- Proposal identity: the in-chat whole-number 0–255 control plus exact Normalized input and quieter IDs recommendation, recorded as the behavior above on 8 November 2026. No new mockup/prototype or independent usability validation is claimed by this document.
- User review and final agreement: the user accepted that recommendation and explicitly requested implementation of both parts in the quoted instruction above. The latest agreed recommendation governs over the earlier fractional-entry preference. This bounded reconciliation introduces no additional material design revision.
- Analyst consistency review: current session/ColorFields, normal ID surfaces, Increment 003 duplicate-path contract and Increment 005 summaries were inspected. The active fractional-UI policy conflicts are reconciled by the linked amendment; explicit channel isolation, invalid raw blocking, exact-source rounding and whole-set suffix uniqueness are required implementation checks. No blocking product/domain contradiction remains.

## Review baseline

Pre-implementation base: `1f8f6f4f761f9637edf32cb9353eec3d9b99ec16`; working tree was clean at analyst inspection. This contract and active-policy/model amendments are authorized documentation changes. The coordinator owns current status. Before independent review, identify the exact source diff and included new files/manifest against this baseline; do not use this pre-implementation identifier as a claim about the later reviewed snapshot.

## Agreed amendments

None beyond the recorded initial scope. The linked 8 November integer-control amendment updates the active Increment 003 policy for this increment; it does not retroactively change frozen completion evidence.

## Completion report

8 November 2026. Implementation is identified by the [r3 source manifest](../../output/increment-006/implementation-manifest-r3.json) against the recorded base; earlier snapshots remain available. The [developer report](../../output/increment-006/developer-evidence.md), [independent implementation review](006-implementation-review.md), [coordinator IAB evidence](../../output/increment-006/coordinator-browser-evidence.md) and [isolated Chrome evidence](../../output/increment-006-zoom/evidence.md) own detailed results and limits.

### Delivered behavior

- AC-1–AC-4: exact-source nearest-integer byte inspection with visible/associated approximation, canonical whole-number validation and per-channel edited tracking. Passive displays cannot quantize source; alpha-only edits preserve RGB. Invalid fractional text remains correctable, blocks literal Apply and destructive representation changes, and survives independent-form/pane transitions. Exact normalized input and general decimal calculation APIs remain unchanged.
- AC-5–AC-7: human-readable ordinary labels replace routine IDs, with collision-safe hints only where needed. Actual choice values/keys remain full stable IDs; authored names, references, canonical ordered components and separate alpha remain unchanged. Existing raw JSON, diagnostics and traces retain technical identity.
- AC-8: final source passes **966 tests / 35 files**, strict typechecks, isolated production build and whitespace checks. The fresh-context reviewer independently verified the manifest, tests/build and a 1,999-case signed rounding oracle. R1, a self-context reference-label collision, was corrected with an actual Editor regression and independently rechecked.

### Verification and handoff

Actual Chrome Settings 200% verification measured CSS 720×450 / DPR2 from a 1440×900 physical viewport, with a separate production CSS 320×720 check. Failure retries, keyboard/focus, actual group-parent choices, navigation duplicates, containing-group rename with stable alias targets and readable missing references passed.

Stateful IAB checks cover exact untouched-channel/alpha preservation, invalid input and correction, passive versus promoted representations, derived cache refresh, half ties and close rounding boundaries, exact-source endpoint slider refusal, actual native reference choices, canonical raw data and a newly created production example. Runtime checks are attributed to their executor; the reviewer independently inspected source/tests/SSR and assessed supplied runtime evidence, without claiming an unavailable independent IAB session.

The production review example is open separately at `http://127.0.0.1:4186/`. The existing draft tab at 4185 was preserved; all three original production asset hashes still match. No new dependency, domain/application/adapter/schema, persistence or deployment change. No staging, commits or pushes by agents.

Screen-reader, physical-device/virtual-keyboard and exhaustive cross-engine/color-management validation remain outside this bounded evidence. The IAB compact check measured 477×848; it does not establish the requested-but-unachieved 320px override. Actual zoom and additional browser flows are described separately in the Chrome report. The known exceptional tiny-red Culori HSL refusal and session-only limitations remain unchanged.

Suggested commit: `feat: add integer RGB controls and quieter token identities`.
