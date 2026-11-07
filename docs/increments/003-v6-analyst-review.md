# Increment 003 — V6 analyst review

**7 November 2026 · Requirements/design review complete · Contract remains Draft / Not started.**

## Authority, snapshot and conclusion

The user said: “V6 looks good. Have the analyst review it against the Increment 003 contract and bring any gaps or decisions back to me. Don't start application implementation yet.” This authorizes this review and its report, not final contract/design agreement or implementation.

Reviewed snapshot: `c5adac537f1cfdf962fec25e8ffe49f62df70403` (`design: address focused workbench review findings in v6`), branch `dev`. The analyst independently verified a clean working tree and that full HEAD at the start. During review the coordinator updated only authorization/handoff documentation in the contract, UX capture, status and V6 guide; prototype source and captured evidence remained unchanged. Line references below identify source at the reviewed commit. The analyst owns only this new report.

**Assessment:** V6 is a suitable design basis for the bounded, session-only color-authoring slice. It preserves authored/applied/draft distinctions, independent forms, explicit submission and unavailable-preview explanations. Project-start and exceptional-state coverage is substantially complete at design-fixture fidelity. No broad redesign or mandatory prototype-code correction is established by this review. Final agreement still needs the interaction/scope reconciliation, D4, a creation-value clarification and an explicit collapsed-feedback exception below. None of AC-1–AC-8 is accepted as implemented.

Expectations were derived from the [owning contract](003-visible-color-authoring.md), its separately [agreed numerical bundle](003-color-policy-proposal.md), [captured UX requests](003-ux-ui-change-capture.md), project vision/concept/principles/architecture, [visual direction](../project/visual-direction.md), and relevant model/taxonomy/glossary/interoperability/open questions before comparing artifact behavior. Historical review conclusions are context, not independent proof.

## Evidence and acceptance mapping

The reviewed design is [V6](../../prototypes/increment-003-v1/DESIGN-V6.md), including its explicitly preserved [V5](../../prototypes/increment-003-v1/DESIGN-V5.md), [V5.1](../../prototypes/increment-003-v1/DESIGN-V5-1.md) and [V5.2](../../prototypes/increment-003-v1/DESIGN-V5-2.md) interactions and [focused F1–F7 proposal](003-design-improvement-proposal.md). Source references use `prototypes/increment-003-v1/src/` unless otherwise specified.

The analyst inspected saved screenshots [01 desktop](../../output/playwright/v6-review-2026-11-07/01-desktop.jpg), [09 short-mobile unresolved](../../output/playwright/v6-review-2026-11-07/09-small-unresolved.jpg) and [12 Apply rejection](../../output/playwright/v6-review-2026-11-07/12-apply-rejection.jpg). These show the intended hierarchy, distinct inspector, visible unavailable labels/target identity and separate Applied/Draft state during rejection. Runtime outcomes and other captures are attributed to the coordinator's [observations](../../output/playwright/v6-review-2026-11-07/observations.md), which identify the frozen build and its limits. The observations' `a40474a` baseline is the preceding designer-work baseline; this review identifies the resulting committed V6 snapshot above. No independent browser interaction was performed by this analyst.

| Criterion | Design/source evidence at V6 | Remaining obligation; disposition |
| --- | --- | --- |
| **AC-1** | `App.tsx:24–28,51–66,74,80` provides project start, empty state, root/group placement, nesting/rename controls, optional layer and explicit color creation context. `DesignStates.tsx:4` demonstrates duplicate/empty parent and target IDs; identity fixture rows expose token IDs. | Real project/group identities, single-parent containment, exact names, nested descendant path refresh and duplicate/empty path disambiguation throughout real controls remain application work. String groups/static identity examples deliberately do not prove it. Preserve blank project names instead of storing the prototype's `Untitled project` substitution (`App.tsx:66`); that follows existing AC-1, not a new naming-policy question. Initial literal creation needs AR-4 disposition. |
| **AC-2** | `Editor.tsx:16–58,62–72` separates current applied inspection from independent literal/reference session data; explicit replacement, blank literal for an alias, Apply/Cancel and mode retention are represented. F2 header follows active form and applied-only trace context. | Use real inspection, ordered domain trace and dependent readback; include all eligible same-project color targets, including alias chains. `Editor.tsx:62` filters targets and `fixtures.ts:21–25` handles one hop only: acknowledged fixture shortcuts, not a new alias/layer restriction. Preserve/show metadata and regeneration; protected **color** manual revision remains required, although only protected inspect-only Number is shown. |
| **AC-3** | `LiteralFields.tsx:18–43` derives alternate views from the literal draft, promotes actual component edits and retains alpha authorship; all five spaces, exact text, missing/extended states and native graphical controls are represented. `Editor.tsx:31–35,46–53` protects raw invalid byte state and supplies unavailable feedback. | AR-1/AR-2 must reconcile contract interaction and graphical-control scope. The unchanged numerical helper is illustrative: binary byte arithmetic, fixed fractional formatting, incomplete constructor validation and library near-neutral behavior do not satisfy the agreed bundle. All numerical gates remain open; do not reuse these helpers as accepted domain behavior. |
| **AC-4** | `Editor.tsx:41–46,58,72` gives operation/cycle, blocked repair and unresolved explanations. `App.tsx:13–16` now labels missing target identity correctly. | Real whole-candidate namespace/reference checks, separate diagnostic families with existing codes/details, actual indirect cycles/invalid targets and one-edit repair atomicity remain required. The blocked-repair fixture mentions another diagnostic but does not contain a complete broken graph. Keep success wording operation-specific. |
| **AC-5** | `Editor.tsx:16–53` models retained independent drafts, explicit submission, unchanged applied state on simulated failure, error focus and successful baseline reset. `App.tsx:51–57,74–80` blocks mutations during failed read and retains mounted editor state. Inspect-only Number has no color revision flow. | Actual operations must return failure before any baseline reset/success claim; `onApply` currently has a void fixture callback. Verify creation/rename and revision failures, protected/ineligible data preservation, and a read failure arriving while a form/draft is already open. Existing fixture selector resets state rather than simulating that event. These are integration checks, not new product choices. |
| **AC-6** | Initial page starts without a project (`App.tsx:24,66`); sample entry is explicit; temporary-session notices remain at start and workbench (`66,69,76`). Source uses page state without a persistence adapter. | Browser verification of real reload/close/navigation loss, generated project identity before authoring and no persistence/server writes remains required. The prototype stores a project label, not a canonical Project ID. No backup, durable retention, full PWA or recovery claim is added. |
| **AC-7** | Native inputs/ranges, labels, current navigation, separate accessible collapse button, modal drawer, focus/error/status treatment and responsive layouts exist. Coordinator samples report 320×568 through desktop, modal boundaries/focus return, selected-row reveal and retained editor state. Saved screenshots support visual hierarchy. | Full create→alias→revise→inspect keyboard path, error associations/announcements, 200% browser zoom, long names/values/diagnostics and narrow/short-height reachability remain acceptance work. Screen readers, real touch/virtual keyboards and actual zoom were not checked in the cited run. AR-2 formalizes responsive coverage; AR-5 disposes of the wide collapsed rail exception. No WCAG conformance claim follows. |
| **AC-8** | All prototype code/configuration remains isolated. Shared application APIs already expose IDs, failures, validation and inspection (`src/application/authoring.ts:19–68,76–99,162–205`). Domain independence remains the governing boundary. | Real delivery integration/build/browser checks and regression evidence are still required. UI must consume operations rather than copy the fixture resolver/namespace logic. D4 remains open. Reported isolated build/typecheck/eight helper tests are prior prototype checks, not production acceptance or independent analyst reruns. |

## Findings and proposed dispositions

Priority here means a gate to agreement or verification, not severity of a shipped application defect.

### AR-1 — Required agreement: amend view switching without changing numerical policy

**Before final agreement · AC-3 / D2.** The numerical bundle's “Space conversion and rounding” still says each space change uses the current candidate and may accumulate approximation. Contract Scope/AC-3 still describe changing space as generating a draft candidate. V6 deliberately implements UX-1's later view-only baseline: `LiteralFields.tsx:19,25–36` derives from the authoritative draft; view changes set only view state. `Editor.tsx:27–35` excludes view changes from dirty detection. Alpha edits retain the source space (`LiteralFields.tsx:42`). These are materially different interaction contracts.

**Recommend retaining V6 and amending the interaction, not removing the exact numerical bundle.** Proposed replacement wording for the bundle's opening interaction paragraph, mirrored in Scope/D2/AC-3:

> The literal editing session has one authoritative draft and a selected display space. Merely changing the display space derives a temporary representation directly from that draft; it does not change its components, authored space or dirty state. Returning to the draft's space restores its exact text, including across multi-space exploration. A deliberate component edit in a different representation promotes that calculated representation to the authoritative draft, replacing the edited channel with the entered value and retaining other derived channels under the agreed numerical policy. Alpha-only edits update the exact alpha of the authoritative draft without changing its space. Apply commits that authoritative draft even while another view is displayed; without an authored change Apply is unavailable. Successful Apply resets the view/baseline to the submitted authored space. Derived views are invalidated after an actual color edit. Failed calculations and incomplete text preserve source, view and raw drafts and cannot submit an older value in place of the text.

Retain same-space identity, 18-/12-significant-digit rules, constructor validation, exact alpha, no clamping, missing/neutral policy and calculation limits. Repeated **deliberate promoted edits/conversion operations** may accumulate approximation; passive browsing must not. Keep the 100-round-trip numerical kernel test, and add a separate exact multi-view browsing test. A domain pure conversion can still return an approximate candidate without mutating anything; this amendment controls when the editor promotes it.

Also formalize DR-1/DR-2 under AC-2/AC-5: independent Literal/Reference drafts retain view/scale/raw text across mode switches and pane collapse; rejection preserves both; Cancel restores applied baseline and discards both; successful Apply commits only the active form and clears the inactive draft; an alias's new literal form begins blank; departing protects edits in either form. No automatic resolved-value copy is authorized.

### AR-2 — Required scope wording: bounded sliders and responsive workflow

**Before final agreement · AC-3 / AC-7.** The contract excludes “picker” without distinguishing the component sliders now requested and designed. AC-7 currently requires desktop/zoom usability; UX-3 asks for tablet/mobile usability too. These should be observable contract language, not requirements scattered across historical guides.

Proposed Scope/AC-3 addition:

> Native one-dimensional component and alpha range controls supplement exact text fields. Their reviewed intervals/steps are delivery controls, not legal canonical ranges, gamut boundaries or precision limits. Slider use deliberately edits the draft. Missing, invalid or outside-interval values retain exact entry and an explanation without being clamped into a thumb. Tracks are explicitly illustrative, not predictive. Two-dimensional pickers, HEX input, interpolation, gamut mapping and fallback generation remain excluded.

Use V5's interval/step table as the identified initial control specification, with V5.2's 2:1 proportions/protected field minimum and V6's header/surface refinements. Do not transfer binary `Number` comparisons from the illustrative controls into exact validity/bounds authority.

Proposed AC-7 addition:

> Verify the complete scoped workflow at desktop, tablet and mobile widths, including 320px width and a short-height sample, and at 200% browser zoom. Drawer/modals, long exact fields/identities/diagnostics, selected-row context and sticky actions remain reachable. Resizing/collapse preserves drafts; accepting selection of a different token starts its inspector at the top, while same-token continuation and rejected departure preserve reading position. Hidden panels leave the tab order. Virtual-keyboard and assistive-technology checks are recorded with explicit device/browser limits; ordinary viewport resizing is not zoom evidence.

This adds verification for the same workflow, not separate mobile features. Routine layout tuning is permitted within agreed interaction behavior; material changes return to the user/designer.

### AR-3 — Required product/architecture decision: close D4 explicitly

**Before final agreement.** The isolated prototype stack does not choose production dependencies. Recommend D4 select the demonstrated React + strict TypeScript + Vite renderer, Tailwind v4, locally owned shadcn/ui-style components based on Base UI, neutral Precision treatment and Heroicons Outline, within the existing single package. Keep TSX/browser types scoped to delivery; no router, general state library, backend or package split is justified by this increment.

Exact compatible versions, official integration instructions, lockfile/license/bundle effects and dependency suitability require technical preparation; the prototype's pins are evidence of its environment, not an approved production set. Color.js is a separate candidate evaluation under the numerical gate and is not selected by D4.

Proposed milestone wording:

> Increment 003 is an intentionally session-only browser authoring slice. Its completion does not establish a complete PWA. Durable retention and independent backup/restore are the recommended next contract; named-profile interchange and install/offline acceptance remain necessary to complete the browser milestone. Validate Electron immediately after that complete browser milestone. This ordering does not authorize subsequent increments.

The alternative is an explicitly chosen different renderer/component approach, with new delivery setup and design-equivalence checks. No user decision about persistence format, bridge schema or interchange provider is needed to complete this bounded D4 choice.

### AR-4 — Creation handoff: preserve exact names; clarify the first literal

**Before final agreement · AC-1 / AC-3 / AC-5.** `App.tsx:54,80` immediately creates applied opaque sRGB black from a name/placement/layer dialog; the initial color is not shown there. This is explicitly documented as a prototype shortcut. User approval for analyst review does not establish it as the application default. Literal-first creation followed by explicit reference replacement can satisfy AC-2; no alias wizard is required.

**Recommend the smallest clarification:** keep that compact create flow, but explicitly show the proposed initial literal (opaque sRGB black) before Create and ask the user to accept that default for this bounded slice. Suggested contract wording, **only if agreed**:

> The creation form explicitly discloses its initial opaque sRGB `[0, 0, 0]`, alpha `1`, literal before submission. Create deliberately authors that value with the supplied name, placement and optional layer, then opens the editor for explicit revision or reference replacement. It does not create an incomplete token. A failed create retains the form and writes nothing.

Alternative: choose literal fields before first creation submission. This avoids a fixed initial-value default but adds unreviewed create-form interaction; return it to the designer/user before renewed analyst review. If disclosing the fixed default is selected, surface the small resulting annotated state/copy for user review; no broad redesign is needed. The current artifact need not be retrofitted merely to claim production completeness.

Blank project names are different: AC-1 already requires exact name preservation. Do **not** copy `projectName || 'Untitled project'` into production. Store the actual supplied name, including empty text, and use presentation-only `(unnamed project)` plus identity where needed. Do not ask the user to establish another naming rule. Duplicate/empty namespace labels likewise remain presentation disambiguation, without uniqueness enforcement or normalization.

### AR-5 — Bounded design exception: feedback in a collapsed wide rail

**Before final agreement · focused F2 / AC-7.** The approved focused proposal's collapsed-inspector row says feedback remains visible. V6 expressly preserves the existing 52px icon-only desktop/tablet rail; `styles.css:78` hides preview/status context at widths ≥768px when collapsed. Mobile retains the full-width compact feedback header. The V6 guide discloses this exception, so this is a disposition to agree rather than an undisclosed implementation defect.

Recommend accepting and recording:

> Applied/Draft feedback persists in the expanded inspector header while editing and in the collapsed full-width mobile header. The collapsed desktop/tablet inspector is a 52px reopen-only rail; expanding restores feedback, drafts and reading position. Resolved & trace shows applied-only header context.

The tradeoff is loss of visible color comparison while the wide inspector is deliberately closed, in exchange for retaining its narrow rail. Requiring labeled feedback there would need a wider or different collapsed layout and another designer/user loop. Approval of that exception is distinct from final agreement on V6 as a whole.

## Missing-state disposition and implementation evidence work

No additional broad missing-state prototype pass is required. Project start/empty/group/search, identity specimens, literal/reference/alpha/byte states, unavailable specimens, failed Apply/read, missing target/blocked repair, inspect-only Number, departure and modal/drawer states have identified treatments. Their shortcuts remain explicit.

Before implementation handoff, incorporate this bounded written supplement into the final design/contract references:

- **Protected color:** use the same color editor with visible `Protected` regeneration context; manual revision stays available and does not change protection. The protected Number specimen demonstrates inspection-only eligibility, not protected-color editability. Show existing descriptions/roles/other metadata read-only when present; revision preserves them.
- **Diagnostics:** use the existing failure region and focus/error-association pattern for namespace, reference and resolution outcomes, visibly identifying the family and retaining codes/details. Never display a fixture's hard-coded `missing-primary` or cycle path as another token's diagnosis. No new production diagnostic payload or universal “valid/compatible” badge is selected.
- **Real graph/identity:** derive labels/paths/traces from application readback, and use IDs as selection/target values; include valid alias chains and nested descendant rename. Root and group choices must remain distinguishable when names/paths duplicate or are empty.
- **Failure atomicity:** read/commit/create/rename failures preserve the last successful data and current form inputs; block mutations during unreadable state; Retry restores eligibility only on successful read. Unsupported/ineligible data is inspectable without destructive conversion. Focus should return to a meaningful initiating control or error/correction point, including when the original control is unavailable.

These are already required production behaviors, not requests to approve each fixture, label or implementation detail. The supplement does not permit new persistence, progressive repair, broader authoring eligibility or automatic alias flattening.

Numerical work remains substantial and distinct from design approval: independent reference fixtures; exact byte arithmetic/formatter tests; all 25 space pairs; exact neutrals/tiny nonzero chroma; missing components; constructor/hue/range validation; limits/failure preservation; exact direct-sRGB preview bounds; measured justification for the preview-only `1e-10` allowance; drift; cross-runtime evidence; and candidate-library suitability. Proposed accuracy thresholds remain proposals until supported. A reported passing eight-test prototype suite does not close these gates. If evidence requires changing agreed limits/policy, return it for explicit amendment; do not loosen criteria to fit the helper. This review neither performs nor authorizes application/numerical implementation.

## Questions for the coordinator to bring to the user

1. **Adopt V6's view-only authorship and bounded native sliders/responsive specification as the formal interaction amendment?** Recommend yes, using AR-1/AR-2 while retaining the agreed numerical rules/gates. This preserves exact browsing and the reviewed interaction instead of reverting to drift-producing space switches.
2. **Select the demonstrated production renderer/component direction and incomplete-browser milestone boundary under D4?** Recommend yes, bounded as AR-3; technical dependency verification and numerical-library selection remain separate.
3. **Make the fixed opaque-black first value explicit before Create, or require value entry before creation?** Recommend explicit disclosed black for the smallest continuation of V6. Accepting that default requires an actual decision; the alternative returns a revised create state to design review. Exact empty names are already required and need no new choice.
4. **Accept the wide collapsed rail's feedback exception?** Recommend yes under AR-5; mobile/expanded feedback and all draft/scroll retention remain required. Otherwise the collapsed-wide treatment needs a material design revision.

These decisions can be answered together. After disposition, reconcile only affected owning documents and identify the resulting contract/design/supplement for final user agreement. Any material artifact change returns to user review before renewed analyst review. Final agreement, technical-preparation scope and application implementation authorization remain explicit separate matters; none is inferred from this report.

## Checks, assumptions and limits

- Independently inspected instructions, Git identity/status, owning requirements/domain/application boundaries, current prototype source and the three named saved screenshots. Verified no source/evidence changes against the reviewed commit during inspection; coordinator authorization edits were documented above.
- Used a lightweight prior-memory orientation for workflow/anchored-draft history, then verified relevant facts against current owning repository documents. No stale memory fact establishes a requirement.
- No browser session, new captures, actual zoom, screen reader, virtual keyboard, runtime/network audit, numerical accuracy check, build or test rerun was performed. Unchanged domain/prototype suites were not rerun for this documentary review. Attributed coordinator observations remain attributed.
- This is independent analyst consistency review, not an independent implementation review or a new visual/usability certification. Source, screenshots and sampled browser observations do not prove every interaction or acceptance criterion.
- Only this review document was created by the analyst. Markdown structure/relative targets and scoped whitespace were checked. No contract/status/prototype/source/dependency change, staging, commit, push or recursive agent delegation was performed by the analyst.

Suggested commit: `docs: review v6 against increment 003 contract`.
