# Token list — Design V1

**Proposal for user review — 18 November 2026.** Requested mockup based on the
agreed exploration direction; not an approved implementation contract. Production
application code, dependencies, stored projects and domain semantics are unchanged.

## View

Run from the repository root:

```sh
npx vite --config prototypes/token-list-v1/vite.config.ts
```

Open [the prototype](http://127.0.0.1:4198/).

- [Desktop, 1600 × 1200](../../output/playwright/token-list-v1/desktop.png)
- [Compact, 900 × 1080](../../output/playwright/token-list-v1/compact.png)

The prototype imports the real WorkbenchLayout, ApplicationHeader, ColorEditor,
Button, Input and global stylesheet, including local Geist fonts. The list,
illustrative navigation and simplified inspector are private prototype code.
The lock glyph uses a private extension of the shared Icon wrapper with Heroicons
Outline; no production icon mapping was changed. Private CSS describes the proposed
list geometry and illustrative specimens without adding application tokens.

## Proposed hierarchy

Desktop columns are **Token · Type · Layer · Value**. Token identity receives most
space: local name is emphasized, the parent path appears below it, and description
is a single muted line. Description truncates visually and remains complete in the
inspector and its title. A selected group removes its shared path prefix; aliases
retain their full target path because the target can belong elsewhere.

Type and layer are quiet text, with a dash for an unspecified layer. Only protected
tokens carry the lock indicator, named **Protected from regeneration**. It does not
mean that manual editing is prohibited. No repeated Allowed indicator is needed.

The value cell places its specimen beside its authored representation. Color
coordinates use up to four decimal places and alpha remains distinct. An alias
shows its target path, Reference label and resolved swatch; the swatch does not
replace the authored relationship. Dimension and duration samples explore a mixed
inventory; their presence does not imply new production editor support. The
component sample has an illustrative Button association in the inspector.

When the central list falls below 760px, type and layer move below identity and
descriptions disappear first. This prototype also uses a full-width browse/inspect
composition below 1120px, with a selected-token Inspect action. That shell threshold
is illustrative and is not a proposed production breakpoint change.

## Try

- Select different rows; the inspector shows their full descriptions, protection
  policy and authored value/reference.
- Search `primary`, or select a namespace in the desktop navigation.
- Resize below 1120px to inspect the compact treatment. Browse switches between
  All tokens and color as a scoped demonstration; it is not a completed drawer.
- All token edits, creation, history and All content controls are inactive. The
  prototype never writes to browser project storage. Inspector tabs/source labels
  are illustrative, not implemented tab interactions.

## Verification and limits

Designer inspected Chrome renders at 1600 × 1200 and 900 × 1080. Search, desktop
namespace selection and alias-row selection were exercised. Coordinator separately
viewed the desktop screenshot and a roughly 1280px live layout. One harness repair
added explicit Tailwind source scanning; a compact reserved-column layout defect
was corrected before the final screenshot. Final render captures were visually
reviewed. No production test/build or broader browser, screen-reader or mobile
qualification was run. The localhost favicon and transient HMR warnings during
setup did not remain as product errors after reload.

Approximate shared verification use: 8 of 12 minutes (approximately 6 designer, 2 coordinator),
one harness repair. Checks stopped after representative visual/interaction evidence.
No independent analyst or implementation review is claimed. User feedback on the
hierarchy/density is next; implementation requires the usual agreed contract and
explicit authorization.

Suggested commit: `docs: add token list properties mockup`.
