# Increment 005 — coordinator in-app browser verification

8 November 2026. Source base `b54c876`, r3 implementation identity `source-manifest-r3.json`. Verification was performed by the coordinator through supported CUA UI actions and read-only DOM/AX observations in a dedicated IAB tab at `http://127.0.0.1:5185/test/browser/increment005.html`. The separate original user tab was not navigated or reloaded by automation. This is coordinator runtime evidence, not independent reviewer browser execution. Screenshots were inspected directly in the CUA results; no local screenshot files are claimed.

## Shared components and exact readouts

- Inspected all five seeded literals in list and Currently applied, and their actual editor labels. sRGB/Display P3 use Red/Green/Blue; HSL uses Hue/Saturation/Lightness; OKLab Lightness/a/b; OKLCH Lightness/Chroma/Hue. Every summary includes separate Alpha. Compact list uses short labelled pairs after the space title; the inspector uses full names.
- sRGB source retained `-0.2`, `0.4`, `1.234567890123456789012345678901234567890123456789`, and alpha `0.1234567890123456789` without rounding. HSL missing hue/saturation display `none` without unit suffix; numeric Lightness displays `63%`. OKLCH numeric hue displays `39°`; OKLab axis `a` is distinct from Alpha. All inspected value cells had scrollWidth no greater than clientWidth plus one pixel.
- Alias stays Reference + protected-color path/ID; broken-a stays Reference + Missing target + missing-broken-a. No alias was flattened.
- Expanded All authored data for sRGB: parsed the displayed JSON, confirming a three-string components array and separate exact alpha. Its description retained leading/trailing spaces and all three lines. Full inspector description remained complete.

## Allocated width and clamping

- 1440×900, expanded panels: table width796, three tracks249.328/249.336/249.328. Header and first-row cell x positions matched exactly:252,513.328125,774.6640625. Description header visible; no horizontal document overflow.
- At the same1300px viewport, expanded inspector gave table656/two tracks310/310 and hidden Description header; collapsing inspector gave table980/three tracks310.664 each and visible Description header. This demonstrates allocation-driven behavior rather than viewport-only switching.
- Exact transition: viewport1411→table767/two tracks365.5 and hidden Description; viewport1412→table768/three tracks240 and visible Description.
- Reported926×952 case: table574/two tracks269 and hidden Description column; description appears beneath identity; no horizontal document overflow.
- R1 reproduction on r2: compact description had conflicting block utility and showed three lines: height50, scroll50, line-height16.5. Wide description already clamped correctly.
- R1 r3 recheck at926px: compact description display flow-root, height33, scroll50, line-height16.5: exactly two visible lines with full text retained. Hidden wide counterpart height0. This recheck followed the developer's removal of only the conflicting display utility.

## Creation, failure retention and keyboard

- Created `described token` with exact description ` First line\nSecond line\nThird line. ` through the real app operation. Before success, test-only Alt+Shift+C enabled commit failure: Create reported Controlled commit failure, focus was creation-error, Name and exact textarea content remained. Toggled failure off and retried Create successfully; list and inspector retained the exact description.
- Edited Red to0.25 and applied: Currently applied updated and description remained byte-for-byte unchanged.
- New creation started with empty description, rows attribute2 and Name initially focused.
- Filled `read retained` and ` Read failure\nRetained verbatim `, enabled read failure with test-only Alt+Shift+R. Create disabled; focus dialog-read-error; both fields retained. Retry was activated while failure persisted; AX still showed the retained fields and Retry focused. Clearing the fixture read failure dispatched a successful read: fields remained, read error disappeared and Create enabled.
- Cancel returned focus to New token. Reopening had empty description and Name focus. Tab moved to TEXTAREA; Return inserted newline and left the dialog open.
- Created `without-description` with empty textarea. Displayed canonical JSON had no description property, while inspector showed No description; components remained ["0","0","0"] and alpha"1".
- Test failure toggles are fixture-only keyboard/UI controls; no backing application state was accessed through browser evaluation.

## Narrow and short-height checks

- 320×568: Description column hidden, document horizontal overflow false and all value cells within width. Creation showed associated Name/Description labels and initial Name focus. Screenshot inspection confirmed two-line textarea and scrollable modal; scrolling exposed Cancel/Create.
- 640×360: scrolled modal had clientHeight318, scrollHeight644 and scrollTop326; Create rect top279/bottom311 inside the360px viewport; no horizontal document overflow. Screenshot inspection confirmed actions reachable with no overlap. The first immediate post-wheel measurement was unsettled; only the later settled measurement is used here.

## Zoom and limits

IAB exposes only visibility and viewport capabilities. After resetting temporary viewport override, baseline measured1280×720, DPR2, visualViewport.scale1. A supported native Cmd+= shortcut produced identical metrics and no AX change. This does not establish actual200% zoom. No CSS zoom, device-scale emulation or viewport narrowing is represented as actual browser page zoom. The user explicitly authorized a separate disposable Chrome/Playwright zoom check after IAB verification. That bounded check passed and is recorded in [actual zoom evidence](../increment-005-zoom/evidence.md): fixed1440×900/DPR1 became720×450/DPR2/scale1, no document overflow. It exercised actual new description/edit/error/focus/clamp/action behavior. This is developer-performed isolated Chrome evidence, not an IAB or independent reviewer zoom run.

No screen-reader, physical mobile/virtual-keyboard or cross-engine runtime test was performed. Browser screenshots and captured DOM observations do not establish formal accessibility compliance. An attribute-locator probe timed out after Retry activation; a fresh AX snapshot and read-only DOM recovery checks completed the actual scenario, with no demonstrated product error.


## Maintained-entry and production startup follow-up

- Navigated the dedicated IAB verification tab to `test/browser/components.html`: Callback button rendered. Navigated to maintained `test/browser/fixture.html`: New token rendered. Browser error log returned an empty array.
- Started an independent production preview on4185 from the reviewed build. A new IAB tab loaded the empty Create a color vocabulary entry; created project Token details review, token primary with exact two-line description `Primary brand color.\nUse for main actions.` and applied sRGB [0.2314,0.5098,0.9647], alpha1. Description survived Apply and was visible in list and inspector. Collapsed groups at normal1280px viewport to show the allocated-width Description column. Production browser error log returned an empty array.
- Updated production app is retained as an IAB deliverable tab at `http://127.0.0.1:4185/`. Original user tab is retained separately. Verification fixture tab was closed and temporary viewport override reset; no user tab was intentionally navigated or reloaded.
