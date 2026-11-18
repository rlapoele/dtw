# Token list — Design V2

**User-requested revision — 18 November 2026.** Design proposal only. V1's
[record](DESIGN-V1.md) and screenshots remain historical; the existing preview route
now renders V2. No production code, dependencies, data or export policy changed.

Open [the live mockup](http://127.0.0.1:4198/) after running:

```sh
npx vite --config prototypes/token-list-v1/vite.config.ts
```

- [Desktop, 1600 × 1200](../../output/playwright/token-list-v1/desktop-v2.png)
- [Compact, 900 × 1080](../../output/playwright/token-list-v1/compact-v2.png)
- [Phone, 390 × 844](../../output/playwright/token-list-v1/phone-v2.png)

## Changes

- Link icons identify aliases. Clock icons replace the duration specimen's double
  arrow. Type text gains Heroicons Outline swatch, measurement/arrows or clock icons
  in both column and compact layouts. All imports remain inside the private Icon.
- Literal colors lead with a six-digit HEX preview. No visible approximation note
  is added. Aliases retain the link target first, followed by their resolved HEX.
- Wide color rows show sRGB, Display P3, HSL, OKLab and OKLCH, calculated from the
  source using the existing domain conversion service. Literal authored space and
  coordinates are emphasized together. An alias's authored value is its reference,
  so its resolved coordinate stack has no false authored-literal emphasis.
- Coordinates use the existing four-decimal presentation formatter, omitting
  redundant trailing zeros; alpha appears once after the stack. Missing powerless
  hue remains `none`; unavailable conversions remain explicitly unavailable.
- The full path, including local name, is added below the existing parent path.
  Description remains below identity, with the existing narrow-screen hiding rule.
- Following the user's additional instruction, below the prototype's 1120px compact
  threshold only HEX and the authored source-space coordinates remain for colors,
  with alpha below. Aliases also keep their reference target and the resolved source
  representation. The other four coordinate representations are hidden.

## Preview algorithm and limits

`color-values.tsx` resolves the small fixture alias graph by identity with a cycle
check, then uses `convertColor` for all five spaces. Canonical coordinates and
12-significant-digit conversion output are not modified by presentation rounding.

For the supplemental HEX preview only, a successful numeric sRGB conversion is
passed through installed Culori 4.0.2 `toGamut('rgb', 'oklch')`, then `formatHex`.
The library's default chroma search and perceptual tolerance provide an approximate
in-gamut sRGB appearance. This is a practical closest-match proposal, not a claim
of a mathematically nearest color. It is not a new canonical or export policy.
The source swatch remains browser-rendered from authored coordinates. Alpha is not
baked into six-digit HEX. Missing components, failed conversions and unresolved
sources return HEX unavailable rather than inventing color coordinates.

The fixture colors are resolvable; no comprehensive out-of-gamut numerical or
round-trip certification was attempted. Production fallback policy would still
need explicit agreement before implementation. Tall wide rows are the deliberate
tradeoff of showing all five representations. Compact layout avoids that density.
Shell controls and non-editing limitations from V1 remain unchanged.

## Verification

This revision has a separate user-authorized allowance of six aggregate minutes
and at most one harness repair. Historical V1 use remains approximately eight of
12 minutes, one repair; no old qualification campaign was restarted.

Designer visually checked desktop, compact and actual 390px phone captures.
A phone DOM check found document width equal to viewport width (390px), and only
OKLCH visible in the first color's coordinate stack. Coordinator viewed the wide
IAB layout. Existing domain conversion code and installed Culori implementation
were inspected; no owned conversion equations or dependencies were introduced.
No production suite, exhaustive interactions, screen-reader or cross-engine
qualification was run. Approximate revision verification use: four aggregate
minutes including coordinator viewing; zero harness repairs. Stopped after the
scoped visual checks. User design feedback remains next; no analyst approval or
implementation authorization is inferred.

Suggested commit: `docs: refine token list color representations mockup`.

## Ordering amendment — 18 November 2026

The user requested and the prototype now applies:

- All tokens: type → layer → full group path → local name.
- Selected group: relative subgroup path → local name, without type/layer partitioning.

The sample type order is Color, Dimension, Duration. Layer order is Primitive,
Semantic, Component, Unspecified. Paths compare by namespace segment, and both
segments and names use English natural numeric ordering (2 before 10 before 100).
Direct members sort before descendants. Stable identity breaks remaining ties.
Search filters retain the active scope's ordering; sorting does not mutate fixtures
or selected-token identity. The existing V2 screenshots predate this ordering amendment.

A focused in-app browser check confirmed All tokens order and the selected color
group's action → brand → neutral → text subgroup order, then restored All tokens.
Approximately two minutes of scoped follow-up verification, no repairs; no production
suite or new numerical/browser qualification. This remains prototype-only.

Suggested commit: `docs: apply contextual token list ordering to mockup`.
