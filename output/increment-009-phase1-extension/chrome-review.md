# Phase 1 slider-layout extension — Chrome observations

13 November 2026. Native Google Chrome at isolated localhost5179; existing synthetic normal project. [Rendered result](chrome-layout.png).

Observed: three color components side by side; each label precedes its native slider and exact input; separate full-width Alpha row below with slider above its input; circular thumbs including Alpha. All inputs and actions visible in the current desktop window.

Native slider accessibility Increment action updated the associated exact field. Cancel restored the applied zero without applying. Raw `invalid` input remained exact and replaced its unavailable slider with guidance above the input. Cancel restored the draft and focused Literal color. No test mutation was applied/retained.

Chrome device emulation was opened for a representative viewport check, but the user changed Chrome and closed DevTools during setup. The latest state was re-read and the ordinary desktop view was used; no attempt was made to override their window state. Consequently no new exact 1280 × 800 / compact screenshot, all-color-space walkthrough, byte-warning wrap or Firefox native-thumb runtime evidence is claimed. Source/compile/focused tests cover the common layout and preserved behavior; previous acceptance gaps remain explicit. No harness repair or previous qualification restart.

Approximate coordinator rendered/setup effort: four minutes. Developer about1.5 + reviewer2 + coordinator4 + reconciliation0.5 = about8 aggregate verification minutes of the extension's10-minute ceiling, zero repairs. Checks stop; Phase 2 remains untouched.
