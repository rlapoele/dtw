# Increment 009 — coordinator Chrome observations

13 November 2026. Native Google Chrome on isolated origin `http://127.0.0.1:5179/`; synthetic project only. Approximately six coordinator verification minutes including browser setup and evidence; no harness repairs. This is a focused walkthrough, not complete manual acceptance or cross-browser qualification.

- Created project with display name `Increment 9 review` (not normalized).
- Created root group from exact raw input `  Br and\u00a0É  ` (U+00A0 between `and` and `É`): raw form preserved; prepared preview and saved group `brandé`.
- Group-view New token defaulted to that group. Created token from ` Straße ` as `straße`.
- Attempting ` S T R A S S E ` in the same group showed prepared `strasse`, path `brandé / strasse`, and conflict with exact identity/parent of existing `straße`. Earlier submission reached the application guard, retained the raw input and did not add a token. Developer subsequently replaced the raw expected-error feedback with preflight rejection; this final submission branch was source-reviewed, not browser replayed.
- Empty creation preview copy corrected to `No valid path yet.` and observed live after correction.
- Frozen source reloaded; synthetic applied group/token remained retained. All content had matching heading/navigation, New token, no color search or rename control, and retained inspected token. [All content screenshot](chrome-all-content.png).
- Frozen resolved tab showed named Red/Green/Blue/Alpha values, readable authored-value trace, `No resolution issues.`, and separate raw-derived disclosure. [Resolution screenshot](chrome-resolution.png).
- Authored view had separate view/scale controls in one row, exact-entry channels and persistent Cancel/Apply action area. Inspected accessibility tree exposed Alpha and labeled controls. This walkthrough did not establish a complete keyboard/focus or compact drawer matrix.

A temporary stale-read/write-blocked state occurred during Vite hot replacement before the freeze; fresh reload reopened the retained project. No claim about production failure recovery is inferred from that development event.

Not executed: synthetic legacy backup restore in browser, full legacy-row runtime matrix, every required compact/keyboard/focus transition, assistive technology, stress or alternate browser engines. Existing fixture harness reached two repair cycles and is stopped. These limits must remain explicit in the completion report.
