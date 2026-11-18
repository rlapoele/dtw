# Increment 017: Token list properties and ordering

- Contract status: Agreed scope — transcribed from the user-authorized design; coordinator reconciled the bounded implementation adaptations on 18 November 2026. The user did not separately review this later-written document.
- Delivery status: Completed implementation and independent review; user acceptance pending.
- User authorization: on 18 November 2026, after reviewing and committing the V2 mockup and its ordering amendment, the user said, “Go ahead with the production implementation.” This authorizes that design's production scope. It is not evidence that the user separately reviewed this subsequently written contract or additional feature proposals.
- Design: [V2 and ordering amendment](../../prototypes/token-list-v1/DESIGN-V2.md), following the separate designer's V1/V2 work and user annotations.
- Constraints: [model](../design-tokens/conceptual-model.md), [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md), [workflow](../workflow/agent-roles.md).

## Outcome

The production token list exposes identity, type, layer, authored relationships,
color representations, description and regeneration protection in the accepted
existing shell. All tokens organizes comparable values together; selected groups
follow their namespace, including descendant subgroups.

## Scope

Included:

- Production TokenTable, its necessary lightweight projections and private helpers.
- Token / Type / Layer / Value hierarchy, full identity and descriptions, protection
  and type-specific Heroicons, authored aliases, color representation stacks.
- Display-only six-digit sRGB HEX with a bounded gamut approximation for convertible
  colors; canonical and converted coordinates remain independent of this preview.
- Contextual ordering, identity-safe selected-group subtree membership, existing
  search retained over the resulting scope.
- Readable dimension/duration values as demonstrated by the mockup; preserve existing
  generic authored-kind fallback for other unsupported presentations.

Excluded:

- New token-type editors, regeneration actions, editable metadata, import/export,
  canonical or backup schema changes, variation selection, new semantic taxonomy.
- Redesigning Projects, the inspector, All content or responsive shell. Prototype
  placeholder controls must not replace existing working production behavior.
- Broad numerical certification, stress campaigns or restarting deferred qualification.

## Acceptance criteria

- **AC-1 — Identity and metadata:** wide token rows show Token, Type, Layer and
  Value. Local name is prominent; parent path and full path including name are
  visible, followed by a one-line description when present. Scoped parent paths
  may omit the selected group's prefix; full paths remain complete. Existing
  duplicate-name/invalid-path identity disambiguation and recovery access survive.
  A protected-only icon has the accessible meaning “Protected from regeneration”;
  no edit lock is implied. Unspecified layer uses a quiet dash.
- **AC-2 — Icons and values:** types have representative Heroicons Outline through
  the shared Icon entry. Aliases use a link icon and readable target path;
  duration uses a clock. Dimension/duration literal examples show their authored
  number and unit. Unsupported, unassigned and unresolved values remain explicit
  and selectable rather than becoming invented values or disappearing.
- **AC-3 — Color detail:** literal color headline is six-digit HEX. Wide rows show
  sRGB, Display P3, HSL, OKLab and OKLCH derived from the authoritative literal;
  authored space and components are emphasized together. Components use the existing
  up-to-four-decimal display policy; alpha appears once after the stack. Missing
  components remain `none`; individually unavailable conversions are identified.
- **AC-4 — Aliases:** the authored target remains primary, with resolved HEX/swatch
  and coordinate representations when an eligible color is available. No resolved
  space is falsely marked as the alias's authored literal. Missing target, cycle,
  unsupported value-path and unresolvable preview states remain truthful. References
  are never flattened by display, ordering, search or selection.
- **AC-5 — HEX boundary:** for finite, eligible conversion results, HEX is quantized
  from a derived sRGB preview. Out-of-gamut conversion can use installed Culori
  4.0.2 `toGamut('rgb', 'oklch')` and `formatHex`, matching V2's practical perceptual
  approximation; it is not guaranteed mathematical nearest-color search. No visible
  approximation paragraph is added, as requested. Alpha remains separate. Missing
  information, conversion refusal or invalid/nonfinite result yields HEX unavailable,
  not an invented source. Authored data, precise coordinates, native source swatches,
  backups and export policy are unchanged.
- **AC-6 — Responsive:** retain current shell transitions and state lifetime. At
  compact widths show only HEX and the source-authored representation plus alpha
  for colors; aliases also retain their target. Type/layer move to secondary text,
  descriptions hide first, and paths/values wrap without viewport overflow. Preserve
  row keyboard activation, selection feedback and narrow select/inspect/back behavior.
- **AC-7 — All tokens ordering:** type → layer → full group path → local name.
  Use existing `TOKEN_TYPES` declaration order for admitted types, with Unassigned
  last. Within a type: Primitive → Semantic → Component → Unspecified. Paths compare
  by segment; names and path segments use fixed-English natural numeric ordering
  (2 before 10 before 100), with stable identity breaking remaining ties. Invalid or
  unavailable paths use a deterministic fallback without pretending a valid path.
  Protection and search do not alter the ordering keys.
- **AC-8 — Selected groups:** include direct tokens and descendant-group tokens
  by stable parent-group ancestry. Sort relative subgroup path → local name, without
  type/layer partitioning; direct members precede descendant subgroups. Detect cycles
  and refuse missing/cross-project ancestry rather than guessing from path text.
  Token creation still targets the selected group. All content retains its separate
  namespace inventory behavior, and invalid entities remain reachable there and/or
  in All tokens according to existing recovery rules.
- **AC-9 — Integrity and ownership:** no canonical mutation from presentation,
  sorting or scope changes; preserve selection IDs, pending drafts, history and exact
  source. Extend only needed bounded read projections, without materializing full
  composite/expression payloads merely for summaries. Five-space calculations should
  reuse existing guarded conversion and avoid needless repeated work on unrelated
  renders. Check affected consumers/tree, names, obsolete wrappers and exceptions.

## Analyst review and bounded implementation adaptations

Reviewed the committed V2 plus ordering amendment against current TokenTable,
TokensWorkbench, retention projections and the domain model on 18 November 2026.
The following differences are implementation necessities, not new design proposals:

1. **Subtree membership:** production currently lists only direct children; the
   reviewed mockup includes descendants. The user's explicit “subgroup → name”
   request supplies authority for subtree browsing. Use identity ancestry, not
   path-prefix matching. No extra approval is needed for that requested behavior.
2. **Complete type order:** fixture types were only Color, Dimension and Duration.
   Existing `TOKEN_TYPES` order provides a bounded deterministic production order
   without adding a new classification. It preserves those three types' relative
   order. This is an execution choice recorded here, not a user-reviewed full taxonomy.
3. **Non-color payload:** retained backups already admit several literals,
   composites and expressions, but DisplayRow exposes only colors/references and
   authored kind. Add lightweight dimension/duration summaries to match the samples;
   keep generic truthful fallbacks for other cases. Do not ship new editors or copy
   unbounded raw values into each list row.
4. **Protection:** DisplayRow currently omits regeneration. Project its existing
   policy; do not infer protection from layer or editability.
5. **Gamut and impossible input:** adopt the V2 preview algorithm only within the
   requested derived-HEX display. The request for a closest match cannot recover
   missing source coordinates or resolve a broken reference; unavailable remains
   the explicit boundary. Broader canonical/export fallback ownership remains open.
6. **Prototype mechanics:** preserve production guardrails, functioning navigation,
   loading/error/empty states and existing breakpoints. Do not copy mockup's Browse
   toggle, disabled controls, fixture graph or duplicate private icon wrapper.

The coordinator confirmed these bounded adaptations on 18 November 2026 and
communicated subtree membership and unavailable-HEX boundaries to the user.
Culori API behavior was checked against [its official API documentation](https://github.com/evercoder/culori/blob/main/docs/api.md)
on 18 November 2026; implementation must also inspect the installed 4.0.2 code.
The default OKLCH chroma search/perceptual tolerance is an approximation, not an
absolute nearest-color guarantee.

No remaining human decision is identified within this bounded interpretation.
If implementation evidence requires a material departure, surface it before changing
that scope. The coordinator reconciled this handoff within the existing implementation authorization.

## Verification approach

Essential checks: focused projection/sorting/ancestry/formatting tests including
natural numeric order, type/layer precedence, filtered scope order, protection,
invalid paths, missing/cyclic references, missing components, out-of-gamut HEX,
alpha separation and source immutability. Exercise production browsing with mixed
retained values, representative aliases, search, selected groups and narrow layout.
Run normal typecheck and appropriately targeted tests; build if integration requires.

Inspect Chrome at wide desktop and small viewport, including keyboard activation,
selection/inspect/back and readable long paths. Numerical checks are representative
of the changed preview policy, not broad color qualification. Consider the current
page-sized projection/workload and memoization; maximum retention ceilings do not
create a new interactive performance guarantee.

Shared new implementation verification allowance: 30 aggregate minutes and two
harness repair cycles, including developer, coordinator and reviewer work. Analyst
preflight allowance: five minutes, approximately five consumed, counted inside the shared 30-minute total. About
25 minutes remain for developer, coordinator and independent reviewer; reserve
roughly 15 for developer and 10 for review/focused follow-up. Historical
mockup verification was approximately 8/12 minutes V1, 4/6 V2 and two minutes ordering;
those campaigns remain stopped. Stop at either allowance limit or earlier if tooling
dominates; preserve unverified checks honestly. No automatic resets/extensions.

Independent reviewer must receive a stable source snapshot, derive expected behavior
from this contract and V2, and report findings separately from developer conclusions.
User review remains valuable for density/readability of the taller wide color rows;
it does not replace evidence of exact-value preservation or failed checks.

## Review baseline

- Base commit: `d963086aa0c2045783e394f6ac20f47f188b10a2`.
- Working tree was clean at analyst preflight; only this contract is analyst-authored.
- Developer/reviewer snapshot and completion evidence: pending.

Suggested commit: `feat: expand token list properties and contextual ordering`.

## Developer implementation evidence — 18 November 2026

Production implementation is ready for independent review; human acceptance is not
claimed. Stable review base remains `d963086aa0c2045783e394f6ac20f47f188b10a2`;
review the uncommitted source/tests/docs plus newly added `TokenValue.tsx`,
`token-list-order.ts` and `test/presentation/token-list.test.tsx`. The coordinator
owns the concurrent status-file update.

- AC-1–4, AC-6: TokenTable now renders identity/description, type icons, layer and
  protection, with a Value-owned native swatch, linked target and memoized coordinate
  stack. Only literal source space receives authored emphasis. Compact rows retain
  source space and alpha; technical values use Geist Mono. Unsupported references
  retain their target and an unavailable preview; value-path references identify
  that limitation. Dimension/duration carry scalar summaries through the closed
  worker response validator, without copying composite/expression payloads.
- AC-5: guarded domain conversion feeds finite numeric sRGB. In-gamut channels are
  quantized directly, avoiding a Culori round-trip rounding artifact at 0.5;
  out-of-gamut channels use installed `toGamut("rgb", "oklch")`. Six-digit HEX
  never absorbs alpha. Missing source components remain unavailable for HEX; each
  coordinate-space conversion keeps the existing domain missing-hue rules.
- AC-7–9: immutable list selection/sorting uses declared type/layer order,
  segment-wise English numeric comparisons and stable IDs. Selected-group ancestry
  includes descendants while rejecting cyclic/missing/foreign ancestry. Existing
  All content, creation parent, state ownership and recovery flows remain in place.
- `npm run typecheck` passed, including after final specimen relocation.
- Focused command: `npm test -- test/presentation/token-list.test.tsx
  test/presentation/hex-preview.test.ts test/application/retention/projections.test.ts
  test/presentation/retention-protocol.test.ts
  test/presentation/workbench-coordination.test.tsx
  test/presentation/identity-presentation.test.tsx`: **55 tests passed in six files**.
  Final display-only changes were followed by the two changed presentation suites:
  **7 tests passed**. `git diff --check` passed.
- Chrome used a fresh `increment017` Playwright session on local port 4199, restoring
  only the synthetic fixture in `output/playwright/increment-017/fixture.json`.
  Wide 1600 × 1200, compact 900 × 1080, and phone 390 × 844 screenshots are in that
  directory. Developer visually inspected wide/phone captures. At 390px, measured
  document width equalled viewport width; only OKLCH was visible for the source
  fixture, and the computed value font was Geist Mono. Group order was action, 2,
  10; All tokens was 2, 10, missing, action, space-2, fast. Search was exercised,
  keyboard Enter selected action, and Edit token → Back retained action and returned
  focus to Edit token. No user projects were accessed.
- Browser console contained two transient Vite HMR errors from moving TokenValue
  during the live session; the final module loaded and exercised successfully.
  This is not a claim of a fresh-load zero-error console audit.

Affected-tree review: the private Value component lives in TokenTable/components;
HEX stays in its existing TokenTable/helpers owner. Sorting belongs to the
TokensWorkbench caller that owns browse scope; production consumers were checked.
Shared icons remain in the existing Icon entry. No new dependency, wrapper, state
owner or styling exception was introduced. Existing swatch runtime CSS remains
its documented exception; normal named Tailwind utilities carry layout and styling.
Owning model/interoperability/open-question/presentation documentation now records
only the narrow display policy and subtree browsing; historical increments stay intact.

Approximate developer verification effort: **12 minutes**, including setup,
source/tree review, targeted tests and captures; stop here for independent review.
Browser setup needed one repair sequence (sandboxed CLI/server access, then an
unavailable old server port). Two unit-test fixture authoring errors (value-path
segment shape and canonical timestamp) were corrected before the passing run;
these are disclosed separately from product failures and browser setup. No broad
qualification restarted. Remaining gaps: independent review, human density judgment,
screen-reader delivery, comprehensive long-path/browser-engine checks, larger-list
responsiveness, full draft/history lifecycle regression and broad numerical
certification. Prior deferred qualification remains deferred.

## Independent review and handoff — 18 November 2026

A fresh-context reviewer assessed base `d963086aa0c2045783e394f6ac20f47f188b10a2`
plus the complete unstaged implementation diff and new files after developer edits
stopped. The scope included the new `TokenValue.tsx`, `token-list-order.ts`, focused
`token-list.test.tsx`, projection/host validation changes, owning documentation and
synthetic browser evidence. No production changes were made during review.

**No actionable production findings.** The reviewer independently passed 16 tests
across token-list, HEX-preview and identity-presentation suites, and checked diff
whitespace. Source review covered ordering, stable-ID ancestry and invalid paths,
protection, alias/source distinction, separate alpha, lightweight projections, host
validation and affected component ownership. No new dependencies, canonical writes
or editor lifetime changes were found. The coordinator also inspected production
wide/phone captures and verified the final specimen placement and numeric typography.

Review compared the accepted V2 with existing production captures rather than
repeating live browser interactions. Production's narrower Value column causes some
coordinate triples to wrap, making rows taller. User density/readability judgment
remains pending. Screen-reader delivery, comprehensive long-path and larger-list
behavior, broader engines and full draft/history lifecycle regression remain
unqualified; no prior qualification campaign was restarted. Developer live-browser
checks and independent source/test checks remain distinct evidence.

Approximate cumulative verification: analyst 5 + developer 12 + coordinator 3 +
reviewer 6 = **26 of 30 minutes**, one of two browser harness repair cycles. Checks
stopped with scoped tests and review complete; remaining allowance is not a mandate
to broaden qualification. The user can review All tokens, a parent group with
subgroups, and narrow browse/inspect to judge hierarchy and density. Staging,
committing and pushing remain with the user.

Suggested commit: `feat: expand token list properties and contextual ordering`.
