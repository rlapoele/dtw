# V4 bounded design observations

Designer artifact: [DESIGN-V4](../../prototypes/increment-007-v4/DESIGN-V4.md),
10 November 2026, production baseline `e2a3534`. Not an independent review or
performance/native-access qualification. `manifest.json` identifies frozen files.

| Screenshot | Review point |
| --- | --- |
| [01 complete color inspector](01-complete-color-inspector.png) | Original list with swatches, layer/type, description and exact value; normal color fields/views/scales. |
| [01b color controls and alpha](01b-color-controls-and-alpha.png) | Existing editable controls lower in the same inspector; exact raw draft. |
| [02 notice before activation](02-preactivation-notice.png) | Closed disclosure plus pause notice, beside existing metadata. |
| [03 color source](03-color-source.png) | Complete applied document and keyboard focus ring. |
| [04 applied source separate from draft](04-applied-source-separate-from-draft.png) | Open source preserved after raw Red draft editing. |
| [05 short source](05-short-natural-height.png) | Full unassigned-token document, naturally sized. |
| [06 two-axis source](06-two-axis-source.png) | Whole modest font-family document in bounded viewport, metadata/notice/footer retained. |
| [07 long-line source](07-source-end-and-long-line.png) | Same document scrolled down and horizontally; no wrapping or source clipping. |
| [08 Preparing](08-preparing.png) | Held local preparation state; existing list and inspector retained. |
| [09 local failure](09-local-failure.png) | Explicit unavailable state and Retry; no source-loss claim. |
| [10 compact source](10-compact-source.png) | Existing compact pane layout with bounded source and native focus ring. |

Observed in a new disposable Playwright Chromium session, UA Chrome/157.0.0.0 on
macOS. Desktop viewport 1600×1100; compact 760×900. No user tab was reused/reloaded.
The designer used design-ui-with-restraint and the Playwright skill, existing cached
CLI/dependencies, and no package installation. Runtime/serving sandbox permissions
were granted; localhost Vite runs in exec session `96023` at port 4227 for review.

- Source rendering: brand 687 UTF-16 units, 349×382 px inner viewport versus
  454×536 px scroll content. Computed `white-space: pre`.
- Short unassigned source: 160 units; 349×173 px viewport and identical scroll
  content dimensions, demonstrating no forced tall area.
- Font-family source: 3,148 units; 349×382 px viewport versus 5,825×1,691 px scroll
  content. Both horizontal and vertical end positions were reached independently.
  This was DOM scroll geometry, not native Find/copy/selection evidence.
- Summary focus + Enter opened the source; Tab reached **Complete applied authored
  data, read only**. Escape on the source retained focus without closing native details.
- With Red draft `0.` and reference draft target `surface`, source failure then explicit
  Retry preserved both inputs. Applied source still showed original Red
  `0.231372549019607843`. Subsequent explicit Apply of `0.3` advanced the simulated
  applied project revision to 2; reopened source reflected `0.3` after Retry.
- No page-level horizontal overflow at checked desktop/compact widths. Compact source
  remained focusable and applied-revision-labelled; surrounding pane retains scrolling.
- Source snapshot checks were small-field/DOM observations, not exhaustive serialized
  equality, native clipboard, selection, Find, AT, zoom or engine qualification.

Operational limits: live source editing initially produced Vite HMR root-reset errors;
only the designer's disposable browser was reloaded before stable checks. The final
source was then held stable. One smoke script expected immediate complete source after
Apply under the fail-once setting and timed out; the expected first failure was then
retried explicitly and revision 2 was observed. Neither operational issue is a timing
qualification result. Raw initial logs/snapshots are saved under `browser-log/`.

Checks pass:

```sh
./node_modules/.bin/tsc -p prototypes/increment-007-v4/tsconfig.json
./node_modules/.bin/vite build --config prototypes/increment-007-v4/vite.config.ts
```

No production tests rerun for this isolated presentation specimen; no independent
review claimed. No source-size stress/benchmark, clipboard, Safari or AT action.
Existing tests/evidence/prototypes and production code remain unchanged.
