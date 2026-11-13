# Increment 009 — Design V2

**13 November 2026 · Interactive design proposal · Awaiting user approval for
analyst review.** Application implementation, final design agreement and renewed
analyst review are not authorized by preparing these artifacts.

V2 supplements [V1](../increment-009-v1/DESIGN-V1.md) for the agreed
[namespace policy](../../docs/increments/009-naming-policy-proposal.md) and
[AC-9, AC-10 and AC-11](../../docs/increments/009-workbench-usability-and-component-boundaries.md#acceptance-criteria).
V1 remains unchanged and is still the reference for ordinary authoring, resolution,
raw value drafts, departure protection and the original layout improvements.
V2 does not replace those flows or reconstruct the entire application.

## Viewing

From the repository root:

```sh
npm exec vite -- --config prototypes/increment-009-v2/vite.config.ts
```

Open [the V2 prototype](http://127.0.0.1:4200). The isolated server uses port 4200
and existing installed dependencies. No production configuration, source,
dependencies or storage are changed. Use the separate review bar above the product
header to select one of the eight states. Selecting a state resets only this
prototype's in-memory fixtures. Reload also resets them.

The review target is 1280 × 800 CSS pixels. The existing 1119 px and 767 px
breakpoints are retained: navigation becomes a left-edge drawer, and the inspector
stacks below the browser on small screens. The modal body scrolls within the viewport
when collision detail requires more height, while its actions remain visible. Compact navigation is available after
closing the initial creation modal. This describes intended geometry, not a
claim of observed browser verification.

## Direction and trade-offs

Keep the raw name editable and explain the prepared result immediately below the
name and parent controls. A compact “Name to save” and explicit path preview
make removal, casing and normalization reviewable before the user submits.
Do not replace the raw input while typing. Preserve it after rejected submission.
The primary action remains available to trigger an explicit rejection and focus
its explanation, rather than leaving a disabled action without a recovery path.

Collision feedback lives in the relevant creation/rename form. It identifies the
existing item, its kind/type, parent context and exact identity. No generic repair,
automatic rename or merge is offered. Group rename includes affected descendant
paths in the same feedback instead of claiming only the edited group's path
matters.

For existing conflicts, place the conflict indicator and identity **inside each
selectable row**, with context. Two identical readable paths remain distinct
native button targets, each with a different full identity. Ordinary valid rows
retain their simpler presentation. A detached global identity list would require
users to reconstruct the association and does not meet D9-1.

The inspector preserves exact authored names, explicit path segments and exact
source access. For unavailable paths, show “Path unavailable” and the missing
parent identity; do not fabricate a path or promote the item to project root.
The focused fixture inspector omits editing. That does not propose a blanket
read-only policy caused by legacy collisions: existing supported authoring
capabilities and unrelated command admissibility remain binding.

## Eight review states

| Preset | Interaction and expected illustration |
| --- | --- |
| 1 · Prepared name | Raw ` Brand\u00A0 Blue `, parent **Project root**, preview **brandblue**, path **brandblue**. Create adds a color-token fixture with the existing explicit opaque-black sRGB literal, reveals it in All content, and leaves legacy fixtures unchanged. Raw input stays exact until closing the form. |
| 2 · Case / spacing collision | Raw ` BRAND Blue ` under **foundation** previews **brandblue**. Submission is blocked by existing color and dimension tokens and a group sharing the compared path. Input is retained and the rejection receives focus. Changing parent to Project root allows the distinct path. |
| 3 · Straße / STRASSE | Raw `STRASSE` previews stored **strasse**, blocked against the existing root string token **Straße**. Enter `Straße` to preview stored **straße** while comparison still blocks. A full-fold equality key is never displayed as the stored name. |
| 4 · Accent / NFC | Raw `E\u0301` previews stored **é**, blocked against existing **É** under foundation. Enter plain `e` to observe a distinct, valid accented-versus-unaccented path. |
| 5 · Group rename + descendants | Rename **foundation** using raw ` Palette `, preview **palette**. Feedback includes the root **Palette** group and the affected descendant paths colliding with **Palette.brandblue**. Rejection changes neither the group nor any descendant's exact name/identity. |
| 6 · Existing conflicts | All content contains two tokens with the exact same readable path **foundation.Brand\u00A0Blue**, plus the equivalent **foundation.brandblue** group. Each has its own full ID and context within its clickable row. Select either exact duplicate, then open **Exact authored source** to inspect the corresponding identity, name and different value types. Click New token and create ` Fresh Accent ` at root: only **freshaccent** is added; the conflicts and legacy source are unchanged. |
| 7 · Unavailable path | Select an orphaned color token by its row identity. Its actual local name `Orphan\u200DBlue` and missing-parent identity stay accessible; no path is invented. |
| 8 · Empty prepared name | Raw `\u00A0\u200B\u2060\uFEFF` has no name after removal. Preview explains the empty result. Submit rejects it and preserves all raw characters. Replace it with a usable name to recover. |

Escapes above denote actual code points. The preset inputs contain those code
points, not literal backslash sequences. Source JSON preserves authored string
content; JSON serialization may escape controls according to its ordinary display
rules. Invisible character identity can be inspected in the source or copied
from the input; the UI does not insert visible markers into the stored name.

## Criteria and residual finding

- **AC-9:** cross-kind and cross-type creation collisions, parent-sensitive paths,
  full-fold and NFC equivalence, rejected form preservation, and group rename's
  affected descendants are illustrated. Existing conflicts do not prevent the
  unrelated root creation example.
- **AC-10 / D9-1:** exact duplicate readable paths, case/spacing equivalents and
  unavailable paths have per-action identity/context. Each row opens the exact
  item; no detached identity inventory is needed. Exact authored data is accessible
  without legacy rewriting. D9-1 is addressed by this design proposal, **not closed
  as accepted or independently reviewed**.
- **AC-11:** prepared name and path appear before submit; raw input is not rewritten;
  empty-after-removal is rejected; stored lowercase is distinct from comparison;
  accents and script joiners are preserved in the illustrated examples.
- **AC-3 / AC-8:** readable inspector, associated source disclosures, native button
  keyboard activation, accessible labels and inherited Base UI dialog focus behavior
  are designed in. Runtime focus/keyboard/responsive verification belongs to the
  coordinator's bounded rendered review; no accessibility certification is claimed.

## Explicit boundaries

The agreed production policy is **DTW namespace naming v1 / Unicode 17.0.0**:
`R` is the 25 Unicode White_Space code points plus U+200B, U+2060 and U+FEFF;
stored preparation uses NFC / default full lowercase / NFC; comparison uses D145
canonical caseless matching with default C+F folding excluding Turkic T mappings.
These definitions are owned by the naming-policy document.

**This fixture is not a production Unicode implementation or validator.** Its
small helper uses the explicit R character class, host normalization/lowercasing
and hand-written ß/final-sigma comparison mappings to make these fixed examples
interactive. It does not pin host Unicode data, implement all C+F mappings or
establish complete D145 conformance. The external review bar labels this limited
demo comparison. No library, production dependency or enforcement boundary is
selected. Other multilingual input is exploratory and cannot establish contract
conformance. Versioned domain/application behavior must be implemented and
verified separately if authorized.

The creation form is deliberately focused on naming. Existing description and
layer controls are retained in a compact disclosure for this review fixture; this
placement does not supersede V1 or settle ordinary full-form layout. Creation
retains the existing explicit sRGB literal, Red/Green/Blue 0 and Alpha 1 (opaque
black), rather than introducing name-only color creation. Created fixture source
records the entered description/layer. Rename simulation changes
only the edited fixture group's name and derives descendant paths; this is not a
new token rename/move capability.

All operations are synchronous in-memory simulations. No worker commands,
IndexedDB, Web Locks, backup, restore, async rejection, revision conflict, command
replay, retained-state safety, strict decoding, load/restore admission or exact
backup round-trip evidence is exercised. Header backup/project controls and
persistent-storage action are disabled. The retention copy is preserved product
context, not a claim that the prototype persists data. Existing source and fixture
order are preserved during the illustrated unrelated creation. That local simulation
illustrates the collision-policy allowance only: it does not bypass or demonstrate
other structural/reference checks. In particular, this mixed review fixture also
contains an unrelated missing-parent item. AC-10 still permits only an otherwise
allowed command under all existing command-safety rules. Legacy restore
admissibility and production safety remain binding requirements, unverified here.

## Presentation and verification handoff

Reuses existing Button, Input, native Select, shared Icon and Base UI DialogContent.
The stylesheet imports the shared global theme before scanning this artifact and
shared presentation source, preserving V1's resolved Tailwind compilation order.
No custom icon family or theme duplication is introduced. Prototype CSS exceptions
own panel geometry, per-row identity wrapping, name preview and long collision
messages. The color specimen is fixed fixture data, not an application color token.

Designer performed source/document preparation only; **no tests, builds, browser
sessions or analyst review were run by the designer**. The coordinator's
[rendered observations](../../output/increment-009-design-v2/review.md) and
[screenshot gallery](../../output/increment-009-design-v2/index.html) record actual
mockup checks and limits under the shared **15 aggregate minute / one harness-repair**
ceiling: approximately 12–15 aggregate minutes (estimate), zero repairs, now stopped.
Prior stopped campaigns remain stopped. Source checking does not qualify the
production implementation or close any acceptance criterion.

The next gate is user review of this identified V2 artifact, followed only after
user approval by renewed analyst consistency review. Final contract/design agreement
and implementation authorization remain distinct and pending.

Suggested commit message: `docs: propose increment 009 naming and legacy-access mockups`
