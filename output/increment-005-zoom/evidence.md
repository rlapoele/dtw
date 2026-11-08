# Increment 005 actual browser zoom verification

8 November 2026. Production preview `http://127.0.0.1:4185/`, frozen r3 source. User explicitly authorized an isolated Chrome session for this bounded check. Cached Playwright CLI, session `dtw005zoom`, disposable profile `/tmp/dtw005-zoom-20261108`; no normal Chrome profile or IAB page was used. No source, tests or source manifests changed.

## Result

Actual Chrome Settings → Appearance → Page zoom **200%** passed. Baseline 1440×900 CSS px / DPR 1 / visualViewport.scale 1 became 720×450 CSS px / DPR 2 / scale 1 while the physical viewport remained 1440×900. Document scrollWidth was 720. No CSS zoom, device emulation or post-setting viewport resize was used. Returning Settings to 100% restored 1440×900 / DPR 1 / scale 1.

At 200%:

- Production project and token were created through the UI with an exact multiline description including leading/trailing spaces.
- Applying a 49-digit exact decimal coordinate preserved its text and description; raw All authored data confirmed the ordered component array and exact description after revision.
- Invalid `1.0` Decimal entry produced the expected alert and focused it. Correction applied successfully.
- Compact list retained the long coordinate, G/B and explicit Alpha without horizontal overflow. The three-line description measured height 33px, scrollHeight 50px, lineHeight 16.5px: exactly two visible lines.
- New form descriptions reset; Cancel remained reachable after scrolling (y369, height32 within 450px CSS height). Cancel/reopen reset was checked, and a settled follow-up verified focus returned to **New token**.
- No page errors occurred during the authoring flow. Screen-reader, physical-device/touch and other-engine checks were not performed.

## Screenshots

- [100% authored example](example-100.png) and [200% same authored example](example-200.png): same session/data, wide description column versus compact description under identity.
- [Actual settings 200%](settings-200.png).
- [200% error/focus](authoring-error-200.png).
- [200% reachable creation actions](creation-actions-200.png).
- [Fresh 100% baseline](baseline.png).

Screenshots were visually inspected. Logs: [zoom metrics](zoom-metrics.log), [authoring assertions](authoring.log), [settled focus/clamp/100% comparison](focus-comparison.log).

## Reproduction

Use the cached CLI with a new disposable session/profile. `open http://127.0.0.1:4185 --browser chrome --persistent --profile /tmp/<unique-profile>`, then `resize 1440 900` once before setting zoom. Run `settings-flow.js`, `set-zoom.js`, `bootstrap-project.js`, `authoring-flow.js` and `focus-and-comparison.js` with `run-code --filename <path>`. Each initial settings/production selection followed a fresh inspected accessibility snapshot. The comparison script opens a second settings page within the disposable context so the authored example survives restoring 100%. Close only the named CLI session afterward.

The retained `creation-flow.js`/`creation.log` record an exploratory failed assumption: an empty local name is permitted, so no creation alert appeared and its wait timed out. That probe created an extra disposable token. This was not treated as a product defect or passing validation check; the meaningful rejection/correction check uses invalid canonical Decimal text. The successful authoring log captures a transient dialog tree immediately after Cancel; `focus-comparison.log` waits for the settled hidden dialog and confirms New token focus. The reproduction sequence omits the exploratory probe.

The isolated browser was restored to 100% and closed after verification. IAB review remains open and unchanged. No staging, commit, push, installation or dependency changes occurred.
