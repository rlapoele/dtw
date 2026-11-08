# Increment 006 actual Chrome zoom and bounded runtime evidence

8 November 2026, frozen r3 source ([manifest](../increment-006/implementation-manifest-r3.json)). Developer executed the user-authorized isolated Chrome check with cached Playwright CLI, session `dtw006zoom`, disposable profile `/tmp/dtw006-zoom-20261108`. Production `4186` and maintained development fixture `5186` only; no IAB tab, existing `4185` assets, source or dependencies changed.

## Actual zoom and layout

Chrome Settings → Appearance → Page zoom **200%** was selected through its real setting. Production baseline physical viewport 1440×900 / CSS 1440×900 / DPR1 / visualViewport.scale1 became CSS **720×450 / DPR2 / scale1**, with document scrollWidth720. No CSS zoom or device emulation was used. [Settings screenshot](settings-200.png), [100% example](example-100.png), [200% same authored example](example-200.png), [metrics](zoom-metrics.log).

After this actual-zoom check, a separate narrow production viewport of physical640×1440 measured **CSS320×720 / DPR2 / scale1 / scrollWidth320**. Its footer measured x0/y693.5/width320/height26.5 and stayed fully inside the viewport. [Narrow screenshot](narrow-footer-200.png), [final measurements](finish.log). At short CSS720×450, the established `short:hidden` footer is intentionally absent. Restoring Chrome Settings100% restored production CSS1440×900 / DPR1 / scale1.

The approximation was scrolled into the available inspector area and visually inspected: note y351.09/height16.5, above sticky actions y394. [Visible approximation](approximation-visible-200.png). The narrow list retains exact values/Alpha and quiet identity without horizontal overflow. Screenshots were visually inspected; native option choices are proven by actual DOM option text/value assertions, not by pretending their closed select screenshot shows an open native menu.

## Passed authoring and failure checks

- Passive byte display shows59/105/173 for distinct exact source RGB; Apply remains disabled. Alpha-only Apply retains all exact RGB strings. Green130 Apply retains Red0.2314, Blue0.67890123456789 and separate Alpha; real raw JSON confirms Green0.509803921568627451. No passive quantization.
- Red59.5 remains visible with associated error and disabled Apply. Cancel returns focus to **Literal color**. After collapsing inspector, the ordinary row omits raw tokenID and retains exact authored summaries.
- At200%, creation Cancel remained reachable at y369/height32 inside CSS450 height; closing the dialog returns focus to **New token**. [Dialog actions](dialog-actions-200.png), [settled production assertions](focus-fixture-setup.log).
- Controlled byte-draft commit failure retained59/130, focused the actual alert, and exposed the storage failure. Controlled read failure/retry retained the same byte draft. Retrying Apply preserved untouched exact Red/Blue/Alpha and committed only Green. [Failure assertions](fixture-failures.log), [focused error screenshot](commit-error-focus-200.png).
- No page errors were observed during the fixture failure flow; the broader check does not claim exhaustive error monitoring across every tab.

## Passed identity/rename checks requested by review

Actual CreationDialog Group options were distinct and retained full native values: static `Project root`, two duplicate groups distinguished through their long common ID prefixes, and authored `Project root · root-named-group`. Selecting the second duplicate used its full ID. Navigation exposed the same distinguishable groups. [Options and navigation assertions](fixture-failures.log).

An alias was explicitly applied to `nested-token`; selecting its containing group/token then renaming the group changed the displayed path to `renamed group / nested`. Selection remained tokenID`nested-token`, parent remained `common-long-prefix-group-a`, and both native reference selection and actual authored alias JSON retained targetID`nested-token`. Actual reference options retained full values and clear current-token context. [Rename/reference assertions](identity-rename.log), [technical reference screenshot](rename-reference-200.png).

The separate `?broken=true` fixture displayed Reference / Missing target without its raw targetID in the readable summary. Its selected missing native option retained value`missing-broken-a`, and All authored data retained that exact raw ID. These assertions ran before the later fixture-layout probe stopped, in [final checks](final-checks.js); [missing-reference screenshot](missing-reference-200.png) confirms the visible result.

## Tooling recoveries and limits

Two exploratory layout probes stopped; neither was counted as a product failure or a passing assertion. `production-flow.log` timed out requesting a footer intentionally hidden at short height; the follow-up explicitly confirmed its hidden state and completed focus/authoring checks. `final-checks.log` initially tested the320×720 **development fixture** footer, which extended19.5px because the visible test checkboxes are prepended outside the app. The same assertion was moved to the production app without external fixture controls and passed in `finish.log`. A centered scroll was used for the final unobscured approximation screenshot; the earlier scrollIntoViewIfNeeded screenshot alone did not establish note visibility above sticky actions.

This is developer-executed browser evidence, separate from coordinator IAB execution and independent reviewer source/tests/SSR checks. No screen-reader, physical-device/touch/virtual-keyboard, exhaustive cross-engine or formal WCAG claim is made. The disposable Chrome session was restored to100% and closed after verification.
