# Increment 011 coordinator native Chrome observations

15 November 2026. Native Google Chrome **157.0.8103.51**, headless through an
already-installed cached Playwright driver. Vite localhost 127.0.0.1:5173;
separate ephemeral browser context, no normal user profile or existing projects.
Only a synthetic Increment 011 acceptance project and its backup were used.
The browser/context were closed after the bounded flow; downloaded synthetic
backup and screenshots remain as evidence under `output/playwright/increment-011/`.

## Observed behavior

- Initial real-browser load exposed a mechanical Worker URL rewrite regression.
  The developer restored the original literal relative worker URL and unchanged
  host files. Reload then loaded Projects and retained authoring successfully.
- At exact 1440×900, create-and-open worked. Return to Projects, row selection
  stayed on Projects; explicit Open entered Workbench. Download backup produced
  a native browser download from the selected supported project without navigation.
- A created color token accepted raw byte input `12x` as an invalid draft. The
  exact value and **same input DOM node** survived 1440→880×800→720×800→320×720,
  with focus-based narrow inspection and no document horizontal overflow observed.
- Narrow Back hid the editor; Edit token reopened it with the same node/value.
  Projects departure raised the guard; Keep editing preserved the raw draft/node.
  Explicit Cancel then allowed return to Projects.
- At 320, project Inspect did not enter Workbench; Back to projects restored the
  catalogue. Native file selection staged a same-ID backup preview; Cancel
  returned without replacing current data. This did **not** exercise preview Open
  or actual replacement completion (the independent reviewer later found an issue).
- A final reload after queued visual fixes captured Projects at 320/1440 and a
  320 editor. Red input bounds were y=522.56, height=44; Apply actions were below
  it at y=872.03, height=44, confirming normal flow rather than overlapping sticky
  actions in that sample. Preview errors did not appear in the console/page-error
  sample; initial worker failure is separately recorded above.

## Evidence boundaries

`projects-1440-final.png`, `projects-320-final.png` and `workbench-320-final.png`
are the later visual samples. Screenshots without `-final` precede the last UI
refinements and remain historical flow evidence. See `runtime-observations.json`
for the compact observation log. Subsequent drawer/empty-inspector focus edge
fixes were not rerun by the coordinator; those are reviewer/source/test evidence.

This was representative acceptance, not an exhaustive matrix. Full keyboard,
zoom/short-height, threshold-neighbor, long-list scroll, uncommon lifecycle and
unavailable/group/unknown-result browser combinations were not qualified here.
A drawer follow-up stopped at an accessible-name mismatch; no successful final
scope-drawer focus claim is made. Live selector-name adjustments were one bounded
adaptation pass, not application changes or new tooling installation. The server
required normal sandbox escalation for localhost binding; no security mode or
browser user profile was weakened.

Coordinator verification estimate: approximately **9.5/10 allocated minutes**,
including source attribution, Chrome checks and exact-snapshot preparation. One
bounded selector-adaptation cycle; no browser installation/infrastructure repair.
No earlier 007/009/010 campaign was restarted. Reports explicitly distinguish
observed behavior from still-unverified criteria and later independent findings.
