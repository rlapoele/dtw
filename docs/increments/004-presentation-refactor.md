# Increment 004: Presentation refactor

- Contract status: Draft
- Delivery status: Not started
- Agreement: assessment and planning requested on 8 November 2026; this contract is not yet agreed and implementation is not authorized.
- References: [architecture](../project/architecture.md), [visual direction](../project/visual-direction.md), [Increment 003 contract and completion](003-visible-color-authoring.md), [numerical policy](003-color-policy-proposal.md), [V6 design](../../prototypes/increment-003-v1/DESIGN-V6.md), [implementation review](003-implementation-review.md), [browser evidence](../../output/playwright/increment-003-implementation/observations.md), [agent workflow](../workflow/agent-roles.md).

## Outcome

Make the completed session-only authoring interface easier to maintain through locally owned reusable components and coherent Tailwind styling, while preserving its functionality and accepted Precision/V6 visual direction. This is an enabling refactor, not a new product workflow or a redesign.

## Scope

Included findings from the presentation assessment:

1. Replace the accumulated 1,981-line prototype-derived stylesheet: remove demonstrably unused selectors, superseded declarations and historical patch layers; prevent unlayered global rules from silently defeating utility styles.
2. Complete the owned Button API. Its current Base UI callback `className` is silently dropped and its stylesheet's `data-size` rules are unreachable. Establish explicit variants/sizes and reliable composition.
3. Extract repeated dialog, field/control and tab presentation patterns; split the 909-line App along existing screen responsibilities without moving token semantics into components or introducing a generic framework.
4. Inventory scattered measurements and colors; use the standard Tailwind scale and semantic theme roles where equivalent, retaining justified geometry or requesting review for material visual changes.

Excluded: domain/application/storage behavior changes; numerical-policy or session-model changes; new features, pickers, persistence, interchange, routing or general state management; framework/library replacement; dependency installation/version changes in this planning step; changes to frozen prototypes/research or vendored references. Native selects and ranges remain intentional. Git staging, commits, pushes and deployment remain human actions unless separately authorized.

## Acceptance criteria

- AC-1 — **Cascade and cleanup:** each removed selector/declaration is supported by usage and cascade inspection, including conditional states and development fixtures. Ordinary layout/control styling uses utilities and owned components; remaining CSS has one clear owner and purpose rather than chronological overrides. No broad unlayered input/select/button rule or `!important` workaround defeats owned component APIs. There is no arbitrary CSS line-count target.
- AC-2 — **Button API:** supported variants and sizes are explicit, typed and exercised by real callers or focused API checks. Base UI string and callback `className` retain owned base/variant/size classes and caller classes; callback state, forwarded props/ref, `render` composition, disabled behavior and keyboard semantics remain intact. Size styling is reachable through the chosen API, with no dead `data-size` contract. Activating formerly unreachable size rules must not silently change current controls.
- AC-3 — **Owned patterns and boundaries:** actual repeated patterns use small owned Button, text Input, native Select, field, dialog and tab presentation components where useful; a badge/status wrapper is added only for demonstrated repetition. App delegates coherent navigation, token-list and dialog rendering, retaining readable coordination of shared operations and departure protection. No exhaustive component catalogue, generic form engine or new state framework is introduced. Extracted components preserve labels, descriptions, IDs, refs, form submission, announcements, portal/backdrop behavior, tab/panel relationships and focus return.
- AC-4 — **Scale and theme:** an inventory records off-scale spacing, dimensions, typography, radii and static colors, their current computed effect, and disposition: equivalent standard utility, existing semantic role, justified exception or proposed visual change. Ordinary components use the standard Tailwind scale and existing semantic colors. Repeated intentional palette roles may be named centrally after checking existing theme roles. No arbitrary bracket-value utilities, mass `@apply`, duplicated literal palette or custom-token-for-every-value workaround is introduced. Material visual normalization requires user review before implementation of that change.
- AC-5 — **Authoring parity:** exact raw component/alpha/byte strings, incomplete input and `none` survive as before; text inputs are not replaced with coercing NumberField behavior. Native range Number rendering stays behind existing exact eligibility checks. Independent Literal/Reference drafts, passive views, Apply/Cancel/rejection, stable IDs/aliases/renames, diagnostics, inspect-only/protected tokens, opaque-black disclosure and read/commit/create/rename failure retention remain unchanged. Domain/application/session calculations are not rewritten for component convenience.
- AC-6 — **Visual and interaction parity:** baseline and final browser evidence demonstrate matching hierarchy, colors, control geometry, responsive transitions, drawer/modals, selected-row reveal and filtered-selection action, panel collapse/reopen, hidden-content tab order, sticky actions and inspector scroll restoration/reset. Preserve effective breakpoints, panel widths and protected exact-field geometry. Check desktop, tablet, 320px and short-height layouts and actual 200% browser zoom, with controls/diagnostics reachable and no overlap or lost actions. Viewport emulation alone is not zoom evidence.
- AC-7 — **Verification and handoff:** all existing tests, scoped typechecks and production build pass; meaningful component API checks and real-browser parity evidence cover changed boundaries. A separate reviewer assesses an identified stable snapshot, and a separate designer checks fidelity to the accepted baseline. Findings are resolved and rechecked or recorded as gaps; documentation describes delivered source accurately without rewriting historical evidence.

## Decisions and open questions

- Established: retain the accepted React/strict TypeScript/Vite, Tailwind v4, locally owned Base UI components and Heroicons stack, existing aliases, application boundaries and session-only limits. Métiers360's utility-based owned Button variants/sizes, Input, NativeSelect, Badge and minimal themed CSS are an organizational reference; their palette, dimensions and application semantics are not a DTW design contract.
- Proposed: implement class composition with the smallest readable local helper/maps necessary for actual components. Do not add a variant library, class-merging dependency or component kit by default. If a dependency becomes necessary, explain its concrete benefit, alternatives, compatibility/license and cost, and obtain scoped authorization before installation.
- Proposed CSS exceptions: retain focused native range track/thumb pseudo-elements, illustrative/checkerboard gradients and dynamic authored-preview styles; explicit responsive/panel geometry may remain in named CSS rules/custom properties when standard utilities cannot preserve it. Each exception needs an owner, reason and parity check. These exceptions do not permit arbitrary component styling to migrate wholesale into CSS variables.
- Resolve before implementation: user agreement to this contract and explicit implementation authorization. The baseline inventory must distinguish currently rendered behavior from historical intentions; discrepancies that imply a material visual/interaction change return to the user. No unresolved product or numerical policy is delegated to implementation convenience.
- Deferred: new product/design direction and the existing [open questions](../planning/open-questions.md), including durable retention and backup/restore.

## Ordered implementation plan

Each task is a thin verified slice. One developer writes code at a time; do not delete a shared CSS rule until all its consumers have an identified replacement.

| Task | Depends on | Expected files/boundary | Checks and criteria |
| --- | --- | --- | --- |
| T1 — Capture baseline and inventory | Contract agreement and authorization | Inspect `src/presentation/{App,Editor,ColorFields,Select}.tsx`, `components/button.tsx`, `styles.css`, current tests/config and development fixtures; record new evidence under an identified `output/playwright/increment-004-*` location | Run existing tests/typecheck/build; capture screenshots and computed styles for representative controls/states and effective breakpoints. Inventory live/dead CSS, global consumers, off-scale values and exceptions. Record current Button dimensions separately from unreachable historical size rules. AC-1, AC-4–AC-7. |
| T2 — Repair Button and prove composition | T1; resolve baseline discrepancies first | `components/button.tsx`, its callers, focused checks; remove its obsolete CSS only after caller migration | Exercise variants/sizes, string/callback classes, callback state, props/ref, disabled/keyboard and Dialog `render` composition. Compare computed dimensions/focus/hover. Preserve structural-control distinctions through explicit APIs rather than selector exclusions. AC-1, AC-2, AC-6. |
| T3 — Own repeated controls and modal/tab shells | T2 | Small files under `src/presentation/components/`; migrate `Select.tsx`, `ColorFields.tsx`, `Editor.tsx` and App form/dialog callers as appropriate | Text Input forwards raw strings and accessibility props; Select remains native; field IDs/descriptions and native ranges remain intact. Check Base UI tabs, form submit, nested modal backdrops, Escape, focus containment/return and error focus. Migrate every global-rule consumer before deleting that rule. AC-1–AC-3, AC-5–AC-6. |
| T4 — Split screen rendering | T3 | `App.tsx` and focused navigation/token-list/dialog components; `Editor.tsx` only where presentation repetition remains | Preserve state ownership, stable keys, mount/hidden behavior, refs and effect ordering. Exercise dirty departure acceptance/rejection, failures, selection reveal and inspector scroll behavior after each extraction. Leave session/domain/application logic intact. AC-3, AC-5–AC-6. |
| T5 — Finish utility/theme migration and CSS consolidation | T2–T4 | Remaining presentation markup, `styles.css`, inventory/evidence | Replace equivalent values with standard utilities/semantic colors; consolidate justified exceptions and effective breakpoints in one place. Remove historical/dead overrides last, after computed-style comparisons across remaining consumers. Review any non-equivalent value with the user before material change. Search for arbitrary values, residual overrides and duplicate colors; manually inspect justified exceptions. AC-1, AC-4, AC-6. |
| T6 — Verify and review stable result | T5 | Tests, browser evidence, this document's completion report, affected README/architecture and status handoff | Full tests/typecheck/build and browser parity matrix; fresh-context independent reviewer and focused designer fidelity check. Fix/recheck findings through the developer. Record criterion evidence and limitations; review Markdown/links and `git diff --check`. AC-1–AC-7. |

Expected component names and file splits are implementation proposals, not a mandate to add unused abstractions. Ordinary extraction decisions may proceed within the agreed boundary; material changes return through the user/design workflow.

## Verification approach

Use the completed Increment 003 application and its evidence as the behavioral authority, with a fresh pre-refactor runtime baseline at the actual implementation commit. Freeze viewport, browser, zoom, fixtures and interaction sequence for paired before/after screenshots. Inspect computed styles and reachability as well as pixels; exact byte-identical bundles are not expected.

`npm test` currently uses `test/**/*.test.ts` with no configured DOM environment. Its existing pure presentation-helper tests do not prove TSX component APIs. Before T2, choose focused checks using the available browser harness or a narrowly scoped test setup without adding dependencies by default. Exercise actual rendered callback classes, disabled behavior and `render`/ref composition; do not add tests that only restate class maps. If meaningful automated checks require a dependency/configuration change beyond the agreed boundary, surface the smallest proposal and cost before proceeding. Browser checks remain required regardless.

The parity matrix covers empty project and creation dialogs; nested groups/rename and aliases; exact/incomplete/long raw values; mode/tab/view switching; Apply/Cancel and failures/retry; unavailable previews and diagnostics; drawer/departure modal focus; filtered selected tokens; panel collapse, scrolling and resize. Sample both sides of effective responsive transitions (including 767/768, 1119/1120 and 1499/1500 where active) and the existing short-height transition. Preserve source-proven additional active thresholds rather than assuming older media rules are dead. Perform actual browser Page zoom 200% and record how zoom state was verified. State screen-reader, physical-device and virtual-keyboard coverage explicitly without claiming formal WCAG certification.

Run `npm run typecheck`, `npm test`, `npm run build` and `git diff --check` for final verification. Keep framework/browser types isolated from host-independent checks. No required existing test may be removed or weakened simply to make the refactor pass.

## Design proposals and review

- Applicability: no new design direction or prototype is proposed. The completed V6-based application plus its creation disclosure is the fidelity target; current runtime baseline resolves implementation details, not new product semantics.
- Proposal: this preservation strategy and the T1 value/exception inventory; no implementation artifact exists yet.
- User review: contract review pending. Approval of the assessment/planning request does not authorize implementation.
- Analyst review: this initial draft maps the four findings to AC-1–AC-4 and preservation obligations to AC-5–AC-7. No new design artifact has been approved or reviewed.
- Material revisions: any meaningful geometry, color, interaction or accessibility change requires a designer proposal surfaced to the user before analyst review and renewed final agreement for the affected scope.
- Final design agreement: pending agreement to preserve the identified baseline. A separate designer fidelity check of implementation supplements independent review; it does not replace it.

## Review baseline

Planning inspection on 8 November 2026: HEAD `73dbe48cc1a616b39172b387267c93687f23e047`; working tree clean before this new draft. The coordinator updates the status handoff separately; verify Git directly before delivery.

Before implementation, record the actual base commit and all pre-existing changes. Before independent review, pause edits and identify the reviewed commit or exact uncommitted diff plus included new files. Supply fresh-context developer/reviewer briefs with this contract, agreed baseline/design references and authoritative documents; do not seed the reviewer's initial brief with developer conclusions.

## Agreed amendments

None. This document is a planning draft; no completion report or acceptance evidence is claimed.
