# Editor powerless-hue fix

15 November 2026; baseline `7759f00`. User agreed the editor-level numeric hue
fallback and requested regression checks. Small focused bug fix, self-reviewed;
no independent subagent review is claimed.

`displayed()` supplies0 only for converted missing hue with zero saturation(HSL)
or chroma(OKLCH), when the authored draft has no missing components. The numeric
fallback lives solely in the editor view. It changes neither the converter nor
source coordinates/alpha, draft dirty state, persistence or history. Same-space
explicit numeric/missing hue is untouched. Editing a represented component promotes
that numeric representation through the existing deliberate-edit path.

## Evidence

- Added8 regression cases before the fix:5 failed on the original computed `none`
  behavior;3 preservation cases already passed. All16 session tests pass after fix.
- Black, white, gray and transparent black traverse all5 spaces and return to
  source; fields stay numeric and valid, exact literal object/alpha unchanged,
  `edited` remains false. Exact alpha/intentional component editing also covered.
- Authored missing HSL/OKLCH hue and missing RGB coordinates remain missing;
  source numeric hue is preserved. Domain converter still returns powerless `none`.
- Full suite:58 files /1136 tests passed. All four TypeScript project checks passed.
- Isolated Chrome session `dtw-hue`, disposable project/token only, localhost5173.
  Opaque new black switched HSL → OKLCH → OKLab → Display P3 → sRGB. At every
  view all3 inputs were0, no missing-component message existed, Apply stayed
  disabled. [OKLCH screenshot](black-oklch.png) visually inspected.

Small-fix checks limited to source/self-review, tests, typecheck and that one Chrome
flow: approximately5 minutes, zero harness repairs, stopped. White/gray/transparent
cases were regression-tested, not separately driven in browser. No stress, engine
matrix, broad runtime campaign or existing qualification restart. Earlier acceptance
registers remain unchanged. No dependencies, staging, commits, push or index changes.

Suggested commit: `fix: display numeric powerless hue in color editor`
