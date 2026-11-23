# Saved incomplete composites — minimal draft contract

**Draft — 23 November 2026. No implementation authorized.**

The user authorized source assessment and a minimal contract without further questions.
The [model direction](conceptual-model.md#saved-incomplete-composites) is agreed:
users can save unfinished composites, and explicitly clearing a reference to a removed
ramp step can leave a composite incomplete. The technical choices below are proposals
for that behavior, not approval of an implementation or a new general composite editor.
[Increment 024](../increments/024-color-ramp-authoring.md) owns ramp decisions and gates.

## User outcome

A shadow can keep its offsets, blur and other authored fields when its color is unset.
It remains saved and inspectable. The user sees “Incomplete — layer 1 color missing”
and can later supply the color. Nothing silently substitutes black, transparency or
another token. Other shadow layers and references to this shadow remain intact.

In ramp review, the user can remap the affected color reference or explicitly choose
Unspecified. Unspecified clears that field only. Apply saves the ramp removal and
field change together; Undo restores them together. The same missing-field meaning
applies wherever ramp removal is explicitly authorized; this contract does not add
whole-ramp deletion or change its otherwise unspecified workflow.

## Smallest data contract

- Represent an unset known composite field by **omitting that field**. Do not add
  an empty-value object, persisted completion flag, lifecycle state machine or repair
  registry. In the editor, Unspecified means intentional absence; JSON omission is
  the proposed canonical representation, not lost data.
- Keep the composite kind/type and existing structure. For shadows, retain the
  nonempty ordered layer list, its objects and every other authored field. Clearing
  a layer's color never removes the layer or the whole assignment. Existing empty
  whole-token definitions remain a separate supported case.
- Permit known fields to be absent in authored shadow, typography and transition
  values, the three composite schemas already implemented. Apply the same small
  rule consistently; do not implement new composite families or generic nesting.
- Validate every field that is present using its existing type/range rules. Reject
  unknown fields, malformed field values, explicit `null`/`undefined`, invalid layer
  structure and incompatible references as before. A missing field does not excuse
  an invalid present field. Refactoring shared field handling is reasonable where it
  simplifies these existing responsibilities; a new framework is unnecessary.
- Resolved values remain complete and typed. Derive local completeness and missing
  field locations from the schema. Resolution of an incomplete composite returns
  an unavailable result identifying the field, not a fabricated partial resolved value.
  References through that composite remain authored references with an unresolved
  result. Distinguish locally missing fields from unavailable dependencies and invalid
  content; these are derived facts, not mutually exclusive editable statuses.

## Ramp reference changes

Support the concrete retained color consumers: whole-color aliases and shadow-layer
color references, with existing unconditional assignments and whole-value target paths.
Do not add conditional assignments, color expressions or part-value target support.
The location of a reference within a shadow is not a target value path.

Identify each affected reference by owning token plus its field/layer location in the
reviewed snapshot. For example, `shadow.card / layer 2 / color → brand.300`. Each
reference whose immediate target disappears needs its own acceptance; no bulk choice.
Use the existing nearest-label suggestion, alternative step or Unspecified controls.
Show which field will be cleared and which downstream values will become unavailable.
Material review-layout changes still return to the user before analyst review.

- Remapping changes only that occurrence's target identity, preserving other fields.
- Unspecified on a whole-color alias removes its assignment but retains its type/token.
- Unspecified on a shadow color reference omits only that color field, retaining the
  composite assignment, other fields and layers. The result is incomplete, not a
  dangling reference. A remaining unrelated field referencing the same removed step
  still needs its own decision.
- Indirect consumers retain their chains. Enumerate impacts from authored references,
  not the capped diagnostics display; compute notices against saved and proposed data.
  Keep existing cycle/type/path checks. Do not suppress diagnostics globally.
- A correctly shaped incomplete composite does not block Apply or later unrelated
  edits merely because it is incomplete. Existing invalid-data isolation under AC-15
  remains separate work; this does not bypass its integrity requirements.

## Save, return and complete

Partial composite data is valid authored content and must survive save/reopen, exact
backup/restore and the existing whole-operation Undo/Redo. Saving is not the same as
resolving or rendering successfully. Show the missing fields and unavailable preview
truthfully; no new preview renderer is required by this contract.

Current workbench authoring is color-token-only. Do not build a full shadow/typography/
transition editor solely to support ramp reference removal. Future composite creation
and editing must use this saveable partial representation. For the concrete cleared
color-field case, plan a focused way to assign a literal color or reference again,
reusing existing controls and validation, preserving other fields and token identity.
The [field review/refill V1 handoff](../project/workbench-layout/color-ramp-field-review-v1.md)
now specifies that focused inspector interaction and the analogous typed-but-unassigned
color-token refill. The user accepted the flow for focused analyst review, which
found both paths coherent. Neither completion path is implemented; no separate
repair wizard is needed.

Use the next authored-data version to admit missing composite fields, coordinated
with Increment 024's metadata versioning rather than issuing independent migrations.
Keep older version readers strict; read existing complete data unchanged. Preserve
missing fields exactly in the new version; older builds must refuse unsupported
versions instead of dropping data. No automatic repair or read-time rewrite. Envelope
and storage-platform changes are unnecessary unless later technical evidence requires
one. The [Increment 024 integration proposal](../increments/024-ramp-persistence-and-validation.md)
now proposes authored version 4 for both ramp metadata and known composite-field
omissions, without changing historical readers or the backup envelope. This remains
subject to final contract review/agreement; no version has been implemented.

This is canonical/backup behavior, not a new interchange guarantee. Incomplete values
cannot be exported as complete conforming composites or silently filled. Existing
profile diagnostics remain the boundary; building or revising export adapters is out
of scope for this preparation.

## Source assessment and bounded implementation surface

Inspected clean HEAD `1d240da3487a59f8df09725f2ff94cc0f822fd7f`.

| Existing source | Gap and smallest required change |
| --- | --- |
| [Shadow](../../src/domain/shadow.ts), [typography](../../src/domain/typography.ts), [transition](../../src/domain/transition.ts) | Authored types/constructors require all fields. Allow known omissions and copy/validate present fields; keep resolved types complete. |
| [Token resolution](../../src/domain/token-resolution.ts) | Missing composite fields currently produce invalid-composite failures. Report missing-field incompleteness with owner/field/layer context; preserve invalid-present-field errors and downstream traces. |
| [Reference validation](../../src/domain/token-reference-validation.ts) | Existing traversal covers composite field references. Absent fields add no edges; present references keep validation. Expose/reuse bounded reference-use enumeration for impact review without making diagnostics its inventory. |
| [Retention codec](../../src/application/retention/codec.ts) | Closed required-key checks reject partial values. Add version-aware known optional fields, preserve omissions and strict historical readers. Current zero/one unconditional assignment boundary is sufficient. |
| [Authoring](../../src/application/authoring.ts), [revision policy](../../src/application/color-revision-policy.ts) | Existing operations edit single literal/reference color tokens, not composite fields or typed-unassigned colors. Prepare narrow whole-candidate field changes/refill and the atomic ramp operation; no general command framework. |
| [Projections](../../src/application/retention/projections.ts), [TokenEditorContent](../../src/presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenEditorContent.tsx) | Composite values are inspection-only; no general creation/editor exists. Add honest completeness/field readback and the scoped completion interaction when authorized. |

## Observable acceptance and future checks

1. A partial shadow with a missing color saves and reopens without changing its other
   fields or layers; missing color is reported and full resolution remains unavailable.
2. Explicit Unspecified for a disappearing ramp target clears only the selected shadow
   color field. All required reference choices remain individual; Apply/Undo/Redo
   handle field changes and ramp membership together, preserving identities/chains.
3. Supplying a valid field value later preserves the rest and clears that missing-field
   diagnostic. Resolution succeeds when no other missing or invalid dependency remains.
4. Wrong-type/null/unknown present fields still fail validation. Existing complete
   composites retain behavior; a focused omission case covers typography and transition
   consistency without introducing their UI workflows.
5. New-version backup round trips preserve omissions exactly; historical complete
   snapshots remain readable and older versions do not gain permissive parsing.

These are future focused checks after agreement and implementation authorization,
not a new numerical/browser/retention qualification campaign. Do not add stress suites,
broad engine checks or speculative nested-composite scenarios.

## Preparation evidence and remaining gate

Separate analyst source assessment plus coordinator synthesis and document checks;
no production edits, tests, browser use or independent implementation review. This
explicitly authorized preparation has a 10 aggregate-minute ceiling, zero harness
repairs; prior verification stops remain unchanged. Final consumption is recorded in
Draft 024.

The subsequent [focused consolidated analyst review](../increments/024-color-ramp-authoring.md#focused-consolidated-analyst-review--23-november-2026)
found this minimal model coherent with the later ramp decisions. It identified the
already-open field-aware review and focused completion interactions as the next
required handoff; no broader model or repair system is needed. The subsequent
[field review/refill V1 proposal](../project/workbench-layout/color-ramp-field-review-v1.md)
now covers those interactions at design-contract level following user flow acceptance
and focused analyst review. Material revisions must return to the user before review. Final contract
agreement, numerical/versioning preparation and implementation authorization remain
outstanding. This is consistency evidence, not implementation or usability proof.
