# Increment 005: Token details and shared color components

- Contract status: Agreed
- Delivery status: Completed
- Agreement: on 8 November 2026 the user approved the designer's bounded proposal points 1–3, then explicitly authorized implementation of points 1–4, including one shared definition of color-component identities and order. This contract records that authorized scope; it does not request another approval. Staging, commits, pushes and deployment remain human-controlled.
- References: [conceptual model — color literals](../design-tokens/conceptual-model.md#color-literals), [architecture](../project/architecture.md), [visual direction](../project/visual-direction.md), [Increment 003](003-visible-color-authoring.md), [approved numerical policy](003-color-policy-proposal.md#approved-numerical-amendment--8-november-2026), [Increment 004](004-presentation-refactor.md), [open questions](../planning/open-questions.md), [agent workflow](../workflow/agent-roles.md).

## Outcome

Authors can add a description when creating a color token, scan descriptions and understand exact authored color coordinates without inferring tuple positions. All supported spaces use a shared component definition, preserving the existing canonical tuple and calculation policy.

## Scope

1. Token creation: add **Description (optional)** immediately below Name, using a two-line textarea and the existing `CreateColorTokenInput.description` path.
2. Token list: stack a color-space label above named exact components and Alpha; show references as relationships rather than literal coordinates.
3. Responsive description presentation: a real aligned **Token | Description | Authored value** layout when the token pane has enough width; description below token identity when it does not.
4. Define supported component identities and order once as closed, pure domain data; reuse them across conversion key ordering, editor labels, readable list/applied summaries and ordering-sensitive validation where practical.

Excluded: editing existing token metadata; group/project description authoring; additional color spaces; changing canonical data shapes, numerical policy, conversion eligibility, precision or libraries; persistence, import/export or backup; generic registries, schemas or form engines; dependency changes; historical prototype/research/evidence and vendored reference edits.

## Acceptance criteria

- AC-1 — **Creation and exact description:** only token creation gains the labelled two-line textarea below Name. An empty string produces absent description; every nonempty string, including whitespace and newlines, is passed through unchanged without trimming. Successful creation exposes the description through existing readback and inspection. New-token forms start empty; create/commit/read failures retain description together with the other form inputs through correction or retry. Existing error focus, disabled mutation during read failure, focus return and opaque-black initial-value disclosure remain intact.
- AC-2 — **Readable authored literals:** each supported literal shows its color-space label followed by named coordinates in canonical order and an explicit **Alpha**. Show exact canonical decimal strings and `none`, with no display rounding or Number coercion. Degrees apply only to numeric hue; percentages apply only to numeric HSL saturation/lightness. `none` is displayed unchanged, without a degree or percent suffix. OKLab axis `a` remains distinct from Alpha. Long exact strings wrap without clipping or silently dropping coordinates/alpha. These are authored values, not resolved or alternative-space approximations.
- AC-3 — **References and inspection:** aliases display **Reference** plus the current target path, or **Missing target** when unavailable, preserving stable target identity and existing diagnostics. Do not flatten a reference into resolved coordinates. **Currently applied** gains the same human-readable named literal/reference presentation; existing **All authored data** remains truthful raw canonical JSON with the ordered component array and separate alpha. Full description remains available in the inspector. No named-object JSON schema is invented for display convenience.
- AC-4 — **Allocated-width layout:** a sufficiently wide token pane renders aligned Token, Description and Authored value headers and cells, using a shared column layout. Description occupies a genuine middle column, with `—` for an absent description. At narrower allocated pane widths, omit the Description header/column and place a description preview beneath token identity; omit that preview when description is absent. Description previews are limited to two lines, with full text in the inspector. Choose the transition from actual pane geometry, including inspector/navigation expansion, rather than viewport width alone. The reported 926px viewport with approximately 590px token pane must use the compact arrangement. The minimum useful wide-pane threshold is an implementation measurement, not a new product decision.
- AC-5 — **Single component definition and boundaries:** the five supported spaces have one host-independent, closed definition of their three ordered component identities. Conversion input/output key ordering, `ColorFields` labels and readable summaries consume that definition; migrate ordering-sensitive validation where practical without replacing straightforward numerical rules with a generic engine. Canonical `readonly [ColorComponent, ColorComponent, ColorComponent]`, separate exact alpha, exact Decimal strings, permitted `none`, and the closed space set remain unchanged. Domain definition data imports no UI, browser, host or Culori types/runtime. Culori modes, channel-key adaptation and percentage scaling remain integration-specific, derived from the shared identity order rather than a second independently ordered tuple map.
- AC-6 — **Behavior preservation:** same-space identity, exact component/alpha and byte strings, incomplete edits, passive views, independent Literal/Reference drafts, explicit Apply/Cancel and failure retention remain as agreed in Increment 003. Preserve neutral/powerless-hue handling, missing-component eligibility, finite/nonzero and budget refusals, constructor validation, target incompatibility and the known safe tiny-red HSL refusal. No hidden clamping, gamut mapping or invented hue is introduced. Preserve sliders and exact eligibility, stable IDs/paths/aliases, metadata during revisions, selection/departure behavior, modal/keyboard focus, scroll behavior and session-only notice. Existing protected/inspect-only and broken-reference fixtures remain meaningful.
- AC-7 — **Verification and review:** meaningful automated checks exercise actual descriptor consumers and existing operations, with independent expected fixtures across all five spaces. Browser evidence covers the changed creation/list/inspector behavior and responsive/focus/failure regressions. Existing tests, typechecks, production build, maintained-entry development startup scanning and diff whitespace pass. A fresh-context reviewer assesses an identified stable snapshot; actionable findings are resolved and rechecked or explicitly reported as gaps.

## Component interpretation

This table restates the existing domain model for verification; it does not change stored components or their units.

| Space | Ordered component identities / readable names | Display suffixes |
| --- | --- | --- |
| `srgb` | red / Red; green / Green; blue / Blue | none |
| `display-p3` | red / Red; green / Green; blue / Blue | none |
| `hsl` | hue / Hue; saturation / Saturation; lightness / Lightness | numeric hue `°`; numeric saturation/lightness `%` |
| `oklab` | lightness / Lightness; a / a; b / b | none |
| `oklch` | lightness / Lightness; chroma / Chroma; hue / Hue | numeric hue `°` |

Alpha is separate, named **Alpha**, and unitless in `[0, 1]`. RGB summaries use authored normalized values even when the editor is viewing the byte entry scale. The exact text remains authoritative; presentation may add labels and unit suffixes without changing it.

## Technical boundary and decisions

- Established: optional description is already supported by the token model and `CreateColorTokenInput`; this increment connects creation UI to that existing path. App retains form/session/operation/readback coordination; CreationDialog renders the field, TokenList renders rows and Editor renders inspection.
- Agreed: shared component identities/order are pure closed domain data, not stored `{name, value}` objects. Small semantic metadata such as readable name/unit may accompany the definition where useful. Keep target/library channel mappings outside that definition; use the identity order to select library keys. Keep conversion formulas, validation ranges and presentation-specific slider geometry in their existing owners.
- Routine implementation choices: precise module/helper names, shared readable presentation component shape, textarea ownership and measured pane-width threshold. Prefer existing owned controls/Tailwind conventions and narrowly justified container geometry. No dependency or generic registry is needed by this scope.
- Analyst consistency review: the approved proposal is compatible with the canonical model and architecture. The description path already exists; named summaries are derived views; shared definitions preserve tuple identity and do not select persistence/interchange. The 926px example requires a pane-width fallback and is captured explicitly in AC-4. No material unresolved decision blocks implementation.
- Deferred: metadata editing and the existing open retention, compatibility and broader color-operation questions. Material scope/design changes return to the coordinator/user; routine decisions within this contract proceed without repeated approval.

## Ordered implementation tasks

| Task | Boundary and checks |
| --- | --- |
| T1 — Establish baseline | Verify Git and current operations/tests; inspect current list width, creation failures, applied/JSON sections and component consumers. Record new evidence separately from frozen earlier evidence. |
| T2 — Centralize component identities/order | Add the small pure definition; migrate calculation input/output ordering, applicable validation and editor labels. Prove known input/output mapping and validation behavior across all five spaces before layering presentation changes. Preserve library scaling/modes and all numerical guards. AC-5–AC-7. |
| T3 — Connect token description creation | Add textarea/state and existing input mapping; preserve reset, success, read/commit failure and retry behavior. Demonstrate absent versus exact nonempty description through actual creation/readback. AC-1, AC-6. |
| T4 — Render readable summaries and descriptions | Reuse the ordered definition for TokenList and Currently applied; keep raw JSON canonical. Implement aligned wide columns and compact description preview based on allocated pane width. Check literals, aliases, missing targets, absent/long/multiline descriptions and long exact values. AC-2–AC-5. |
| T5 — Verify stable result and hand off | Run all checks and scoped browser regression matrix; pause edits for independent review. Resolve and recheck findings; coordinator records completion and current status with evidence/limits. AC-1–AC-7. |

One developer writes code at a time. Review receives the base commit plus exact diff and included new files, or a reviewed commit, with authoritative documents and this agreement rather than developer conclusions.

## Verification approach

Use independent known fixtures with distinct values in each position so swapped components cannot pass. Exercise actual conversion adapters in both directions, domain constructor normalization/ranges and rendered editor/summary labels across sRGB, Display P3, HSL, OKLab and OKLCH. Assertions that merely compare the new definition with itself are insufficient. Retain existing numerical regressions and prove correct HSL percentage scaling and separate alpha. Include `none`, powerless and numeric hue, out-of-gamut RGB, long exact decimals, missing/invalid targets and safe conversion refusal cases.

Exercise actual application creation/readback for omitted, multiline, whitespace-only and other nonempty descriptions. Browser checks cover exact description retention on rejected create/commit and failed read/retry, creation success and subsequent value revision without metadata loss. Check label association, keyboard access, error/return focus and full inspector text.

Capture wide and compact list evidence with inspector/navigation expanded and collapsed; include the reported 926px/~590px-pane case, intermediate widths around the chosen container transition, 320px and short-height layouts, plus actual 200% browser zoom with verified zoom state. Assert shared header/cell alignment, two-line description preview, wrapping exact coordinate strings, Alpha visibility and reachable actions without overlap. Use only the user-requested in-app browser (IAB); use a dedicated task tab/session/fixtures and do not reload or alter the user's current session data. State screen-reader, physical-device, cross-engine and other unperformed coverage limits explicitly.

Run `npm run typecheck`, `npm test`, `npm run build` and `git diff --check`. Check fresh Vite dependency scanning/startup and both maintained browser fixtures using the existing README procedure; preserve the maintained-entry scan boundary and historical artifacts. Do not weaken existing tests or add dependencies solely for convenience.

## Design proposal and approval record

- Proposal identity: the designer's four-point bounded proposal discussed in this chat on 8 November 2026, recorded above as scope points 1–4 and AC-1–AC-5. This is an in-chat proposal; no new prototype artifact or independent usability certification is claimed.
- User review: points 1–3 were accepted before analyst consistency review. Point 4 was clarified with the user as a shared central component definition reused for conversion, labels and readable summaries, retaining the ordered tuple instead of stored named objects.
- Final agreement and authorization: the user then explicitly authorized implementing points 1–4 on 8 November 2026. This document transcribes that approved bounded proposal without adding a further approval gate.
- Analyst review: no contradiction requiring a material revision was found. Actual responsive geometry, failure retention and independent consumer tests remain implementation/review obligations rather than claims established by this document.

## Review baseline

Planning baseline: clean working tree at `b54c876` (`fix: scope Vite dependency scanning to maintained entries`) on 8 November 2026. Increment 005 was the next unused number. This analyst added only this contract. The coordinator owns status updates; recheck Git and record the exact implementation/review snapshot before review.

## Agreed amendments

None. Completion evidence is not yet recorded.


## Completion report

**Completed — 8 November 2026.** All four approved changes are delivered within the agreed scope. Source and tests were frozen for independent review; the corrected r3 snapshot is identified by [source-manifest-r3.json](../../output/increment-005/source-manifest-r3.json). Earlier snapshots are preserved. Main-owned contract/status and post-review glossary/evidence records sit outside that 18-file implementation manifest.

| Criterion | Delivered result and evidence |
| --- | --- |
| AC-1 | Two-line native Description (optional) textarea follows Name for token creation. Empty input omits description; all nonempty text passes unchanged. Application tests cover absent/multiline/whitespace text, and IAB verifies exact creation through commit rejection/retry, read failure/recovery, new/cancel reset, focus and native Tab/Enter. Description survives a later color-value Apply. |
| AC-2 | Shared exact formatter renders a space title plus inline wrapping short-labelled coordinate pairs and explicit Alpha in the list. All five spaces use the central semantic order, correct numeric units and unchanged `none`; no Number coercion or rounding. Inspector uses expanded names from the same definition/formatter. |
| AC-3 | Alias and missing-target readouts remain relationships with target identity/path. Currently applied is human-readable; All authored data still shows real canonical JSON with three ordered component strings and separate alpha. Full multiline description remains available in the inspector. |
| AC-4 | Container-driven layout adds an aligned Description column at 768px token-table allocation. Main measured hidden at767 and visible at768, and a same1300px viewport changed table656/two columns to980/three by collapsing inspector. The926px case used table574/compact description. R1 corrected the compact preview display conflict: height33, line-height16.5 and scrollHeight50 prove two visible lines with full content retained. |
| AC-5 | `src/domain/color-components.ts` owns the closed semantic identities/order and shared coordinate names/units. Constructor validation, Culori channel ordering/scaling and neutral/missing-hue interpretation, editor labels/ranges/gradients and readable summaries consume identities. Library modes/channel adaptation remain in calculation integration. Stored tuple/alpha, exact Decimal text and the supported space set are unchanged. |
| AC-6 | Existing numerical/session behavior remains covered by the retained tests; distinct known fixtures exercise real conversion/validation consumers across all spaces. IAB verifies long exact values/alpha, `none`, reference/missing target, raw JSON, metadata retention, focus, narrow containment and reachable short-height actions. No new clamping, conversion policy or metadata-editing operation was introduced. |
| AC-7 | Final 934 tests in33 files, strict typechecks, production build and diff whitespace pass. Fresh maintained-entry optimization/startup, both existing browser fixtures and empty production entry were checked. IAB checks and user-authorized isolated Chrome actual200% zoom passed. [Independent review](005-implementation-review.md) resolves R1 and records no remaining required findings or verification gaps within the stated coverage. |

### Verification and review

- [Developer evidence](../../output/increment-005/developer-evidence.md): implementation, meaningful consumer tests and snapshot progression. Baseline894 tests increased to934; none of the existing tests were weakened or removed. Final production build is approximately402.94kB JS/32.85kB CSS; these are measurements, not budgets.
- [Coordinator IAB evidence](../../output/increment-005/coordinator-browser-evidence.md): actual five-space readouts, exact descriptions/failures, raw JSON, responsive geometry, clamping, keyboard/focus, maintained fixture loads and production workflow. Screenshots were inspected directly in CUA; local screenshot files are not claimed for those captures.
- [Actual zoom evidence](../../output/increment-005-zoom/evidence.md): with the user's explicit permission, an isolated Chrome profile used actual Settings Page zoom200%. Fixed1440×900/DPR1 became720×450/DPR2/visualViewport.scale1, scrollWidth720. Description creation, exact revision and validation, two-line preview, compact Alpha/wrapping and reachable modal actions passed. Comparison/settings/error/action screenshots and reproducible scripts/logs are preserved. Only that disposable browser was reset and closed; the IAB review remained open.
- Reviewer independently inspected the source/snapshots, ran tests/typechecks/build and exercised actual React editor/summary rendering using SSR. Its browser binding was unavailable; it reconciled explicitly attributed coordinator/developer live evidence rather than claiming independent live interaction. No required findings remain.

### Finding dispositions and limits

- Coordinator found a first-pass list-density mismatch and the developer restored the approved compact named-pair format before independent review. Independent expected fixtures exercise that format.
- R1 (AC-4): the compact description's `block` utility defeated `line-clamp-2`. Developer removed only that conflict; the reviewer independently confirmed compiled CSS/source and final hashes, while coordinator IAB verified the corrected two-line runtime result. All final checks pass.
- The glossary defines semantic color-component identity separately from stable token/group identity. This documentation does not add stored component ID fields or independently referenceable token parts.
- IAB supplied no supported real page-zoom control; its unchanged shortcut metrics were not counted as zoom evidence. The separately authorized Chrome check closed that gap. Exploratory locator/empty-name assumptions are disclosed in evidence rather than claimed as passing validation.
- No screen-reader, physical mobile/virtual-keyboard, exhaustive pixel or all-browser conformance claim is made. No new dependencies, durable storage, canonical-schema change, library replacement or historical evidence/reference rewrite. Existing descriptions remain read-only after creation. Known numerical limitations remain unchanged.

The updated production app is open in the in-app browser at `http://127.0.0.1:4185/` with a small UI-authored review example. Changes remain for human review/staging/commit; agents performed no staging, commit, push or deployment.

Suggested commit: `feat: add token descriptions and shared color component details`.
