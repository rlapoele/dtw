# V5 design smoke observations

10 November 2026, baseline `a3ede16`. This is prototype presentation evidence,
not performance/native-source qualification or independent implementation review.

## Captures for user review

Same 1600×1100 viewport, same prose specimen, same inspector position:

- [Current inspector](03-inspector-current.png)
- [Candidate inspector](04-inspector-candidate.png)
- [Current complete workbench](02-desktop-current.png)
- [Candidate complete workbench](01-desktop-candidate.png)

The candidate visibly splits “the”, “concentrate”, “guidance”, “contrast” and
“documentation” across lines. The current capture retains those words intact at
this width. The candidate may make prose harder to read. No measured speed gain
is claimed and the user has not accepted this tradeoff by approving prototype creation.

`desktop-{prose,lines,unbroken,cjk,rtl,marks}-candidate.png` and corresponding
`compact-…` images cover each specimen at 1600×1100 and 760×900. Manual image
inspection included the prose pair, compact blank-line and RTL examples, and
desktop CJK and combining/emoji examples. Newline/blank-line layout remains visible.
No obviously detached combining mark or fragmented emoji was seen in the inspected
marks image; this is not an exhaustive shaping or language accessibility claim.
The compact layout retains separate list/inspector scrolling and no page-level
horizontal overflow was observed on any captured candidate specimen.

## Recorded checks

- `smoke.json`: Chromium user agent `HeadlessChrome/157.0.0.0`, desktop viewport,
  fixture sizes/actual newline and combining-code-point checks; exact desktop DOM
  equality in both row variants and full inspector for all six descriptions.
  Both row variants retain computed clamp `2`; inspector retains `pre-wrap` and
  candidate `break-all`. It also records all compact descriptions unchanged.
- `compact-keyboard-smoke.json`: all six compact descriptions equal their authored
  strings in both modes, including hidden row variants. Computed current policy
  is normal/anywhere and candidate policy break-all/normal. Native Tab from the
  marks row reaches unassigned; Enter selects it; Shift+Tab/Enter returns to marks.
  This is selected keyboard smoke, not a complete keyboard/accessibility audit.
- Literal Red `0.` survives wrapping-toggle and Literal→Reference→Literal return,
  then Cancel clears the draft through the existing control. No Apply or clipboard
  command was issued. Complete reference-draft qualification was not attempted.
- Final console check records zero errors and warnings. Strict isolated typecheck
  and Vite build pass (`typecheck.txt`, `build.txt`). Build bytes are archived under
  `build/`; production tests were not rerun.
- `copy-diffs.patch` and `preservation.json` identify the narrow copy delta,
  byte-identical V4 source disclosure, and unchanged prior V4 manifest entries.

Captured through cached Playwright CLI in new disposable session `dtw007v5`,
PID 28491; closed after checks. Native browser controls were used for ordinary
click/select/fill/key smoke; DOM reads supplied equality/computed-style evidence.
No source selection or copy procedure was run. The strict Vite server is still
available at <http://127.0.0.1:4228/> in exec session 21909. The coordinator separately
reports opening a new visible review tab, selecting prose and seeing the candidate
and full controls; that is attributed coordinator observation, not exhaustive parity.

No timing workload, known failure fixture, native-selection assessment, clipboard,
Find, actual zoom, AT, Safari, settings/trust change, install or dependency update
occurred. No existing review session was operated. Native assessment approval
persists but execution remains held for the user's prototype review. No new
analyst review or production authority follows from these design checks.
