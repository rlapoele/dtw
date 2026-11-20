# Color ramp authoring — interaction proposal V1

**Initial designer proposal — 20 November 2026. Not approved or analyst-reviewed.**

This written proposal supports the [Increment 024 draft](../../increments/024-color-ramp-authoring.md).
The user has selected the fixed 11-step scope and the rule that editing the seed
step through the ordinary token inspector creates a manual override without
changing the saved recipe seed. Other choices below remain proposals. No
interactive prototype, production implementation or numerical algorithm is
authorized by this document.

The [ramp direction](../guided-color-palette-generation.md#agreed-ramp-direction--20-november-2026),
[visual direction](../visual-direction.md) and [presentation conventions](../presentation-conventions.md)
remain authoritative. The contract owns delivery criteria and unresolved decisions;
this document describes a proposed interaction for user review.

## Recommendation

Use one focused ramp dialog with enough room for the whole progression and one
selected-step editor. On desktop it is wider than the ordinary token form; at
narrow widths it uses the available window and stacks its content. Exact dimensions
remain for visual design. The normal workbench stays visible behind it, but cannot
be edited concurrently. Do not open a second dialog to edit a swatch.

The benefit is a bounded editing session with one draft and one set of actions,
without compressing a ramp and its change review into the ordinary inspector.
The tradeoff is temporarily leaving ordinary token browsing. An integrated central
workbench surface is an alternative if keeping navigation active is more important;
it would need additional navigation and draft-lifetime design.

Offer **New ramp** in the existing creation area using the current namespace as
the proposed parent. Offer **Edit ramp** when a ramp group is selected. Creating
a ramp starts a new child group with an unused name; adopting or merging existing
groups is outside the proposed first slice.

## Creation

Keep the initial controls short: group name, parent path, recipe seed, and seed
position. Display the fixed steps as a fact rather than a disabled count control:
`50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`.

```text
New color ramp                                         [Close]
Parent: color
Group name [blue                 ]

Recipe seed [color editor]
Seed position [Auto              v]  Suggested: 500
11 steps: 50, 100, 200, ... 900, 950

[50] [100] [200] [300] [400] [500] [600] ... [950]
                       selected

color.blue.300                                      Generated
[Selected candidate color fields]
Editing this value keeps it when the ramp is regenerated.

11 tokens will be created in color.blue.
                                    [Cancel] [Review creation]
```

This is a structural wireframe, not a generated palette. The suggested position,
sample path and selected step are illustrative; no numerical behavior is implied.
Use normal color editing controls once input-space policy is agreed. Each swatch
has its step label and a readable value representation; HEX, where shown, remains
a labeled derived sRGB preview rather than the authoritative value for all spaces.
Full token paths remain available for the selected step and in review.

The preview changes while editing valid settings without creating tokens. Invalid
input remains visible beside its error and blocks review/application. A retained
last-valid strip must be labeled as such rather than implying it reflects invalid
settings. Selecting another swatch preserves each step's draft and manual status.

Manual edits display **Manual** and expose **Use generated value**. That action
changes the candidate only; the override is cleared in applied data only when the
reviewed proposal is committed. Changing settings preserves manual candidates.

## Reopening and the recipe seed

Reopening starts from the saved settings and applied token values, with no implicit
regeneration or save. Show the saved seed position. **Suggest position again**
explicitly requests a new Auto suggestion; ordinary reopening never does so.
When editing a saved recipe seed, retain its saved position unless the user changes
it or requests another suggestion. Exact Auto fitting and initial-preview timing
remain subject to the numerical contract.

The recipe seed and the applied token at that position can differ. If step 500 was
edited in the ordinary inspector, explain that distinction directly:

```text
Edit ramp: color.blue                                  [Close]
Recipe seed [saved seed editor]
Seed position [500 v]             [Suggest position again]

Step 500 has a manual value. It differs from the recipe seed.
The recipe seed still shapes generated steps.

[50] [100] ... [500: Manual] ... [950]

color.blue.500                                          Manual
Applied [swatch/value]       Candidate [swatch/value]
[Selected candidate color fields]
[Use generated value]

8 values change · 2 manual values kept · 1 unchanged
                                      [Cancel] [Review changes]
```

Counts are illustrative. Distinguish **Seed position** from **Manual**: a step may
be both. Do not hide the override behind a Seed badge. Editing the recipe seed is
an explicit generation-input change; editing any step, including its assigned
step, is a local override. This slice does not need a shortcut to promote a manual
value to recipe seed; users can edit the recipe seed directly.

## Review before applying

Use a second stage in the same dialog, with **Back to editing** preserving the
whole proposal. Show full paths and Applied / Proposed values, plus a text status
for each of the 11 steps. For creation, Applied is absent. Include a settings
summary and manual-status changes so settings-only changes and clearing an override
are reviewable even when the displayed color is unchanged.

For regeneration, each eligible changed step offers **Use proposed value** or
**Keep current value**. Existing manual steps default to keeping their value against regeneration. An
intentional new edit to a manual candidate remains visible as a proposed manual
value, rather than being discarded by that default. Explicitly
keeping a generated step whose value differs from the new candidate makes it
manual relative to the new recipe; an unchanged value does not become manual
merely by opening review. Selecting a
generated replacement clears manual status on acceptance. If the user edited a
candidate manually, using that proposed value retains its manual status. Keep
source-of-value status explicit rather than treating every proposed value as
generated. Token-level protection may constrain these choices; its unresolved
relationship to ramp overrides must be settled before this interaction is final.

```text
Review changes: color.blue
Settings changed: recipe seed; position unchanged at 500

Path              Applied     Proposed      Decision
color.blue.50     [value]     [value]        Use proposed value
color.blue.100    [value]     [value]        Keep current value
...
color.blue.500    [manual]    [generated]    Keep current value
...

Settings and accepted values will be applied together.
                         [Back to editing] [Apply ramp changes]
```

Propose creating all 11 candidates together, with manual editing available before
confirmation. Arbitrary omission of creation steps would undermine the selected
fixed structure and is not proposed. For regeneration, per-step keep/use decisions
produce one final proposal committed atomically with its metadata and one Undo
step. Cancel or closing before confirmation creates no group and changes no tokens.

After successful creation, close the dialog, select the new group and focus its
heading or primary action. After successful revision, return to the same group and
its **Edit ramp** action. Announce the outcome using existing feedback conventions.

## Interaction states and access

- Opening honors the existing dirty-token guard. Creation focuses Group name;
  reopening focuses the dialog heading or first settings control. Closing returns
  focus to the invoking control, with a stable fallback if its context changed.
- Use labeled buttons for swatch selection with visible selected state and complete
  accessible names. Normal Tab navigation and Enter/Space activation suffice for
  11 swatches; no custom arrow-key grid is required in this proposal. Manual and
  seed-position states must be available as text, not color alone.
- Keep text fields operable with native editing shortcuts. Application Undo must
  not replace native text undo while editing. The accepted batch has one normal
  application Undo/Redo entry after it is applied.
- Narrow layouts stack settings, strip, selected-step fields and review rows. Wrap
  swatches without changing their order. Review rows become labeled cards rather
  than an unreadable compressed table. Keep all actions reachable without relying
  on a fixed-height inner panel or horizontal page scrolling.
- Back, swatch selection and review transitions preserve drafts. Close/Escape and
  Cancel use the established discard/keep-editing guard when changes would be lost.
  Untouched creation can close directly. Drafts remain session-only; this proposal
  does not promise restoration after browser reload or closure.
- Reject name collisions with a field-level explanation and preserve the draft.
  Do not offer overwrite or merge in this slice. Validation errors identify the
  affected field/step; a review summary links back to the corresponding input.
- While submitting, prevent duplicate submissions and conflicting edits. An ordinary
  failed application retains the proposal. An unknown result uses existing recovery
  behavior; do not blindly retry a mutation to refresh the display.
- External changes or unavailable/missing members invalidate the old review. Preserve
  the user's draft and explain the changed baseline before any renewed application;
  never silently match a replacement token by path or reconstruct missing members.
  Exact recovery controls must follow the contract's resolved eligibility policy.

## Decisions before the next design stage

1. **Surface:** is the focused dialog acceptable, including a separate review stage,
   or should ramp editing remain within the central workbench? Recommend the dialog
   for this bounded first slice.
2. **Review:** agree fixed all-11 creation and per-step keep/use decisions during
   regeneration, with retained generated steps becoming manual and one atomic Apply.
3. **Color and eligibility policy:** settle supported seed/input and output spaces,
   alpha, numerical generation/Auto rules, gamut handling, exact-anchor exceptions,
   and how existing token protection or unsupported member values affect editing.
   The UI cannot invent these through defaults or disabled controls.

The next visual/mockup stage should make swatch density, selected-step controls,
review comparisons and narrow-width scrolling inspectable. No interactive
prototype has been prepared, no analyst consistency review of this proposal has
occurred, and no contract/design approval or implementation authorization is claimed.
