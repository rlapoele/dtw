# Increment 006 developer verification

Date: 8 November 2026. Implementation baseline: `1f8f6f4f761f9637edf32cb9353eec3d9b99ec16`. The [r3 implementation manifest](implementation-manifest-r3.json) identifies the source/tests/configuration/README frozen for independent review. Coordinator-owned contract, policy/model amendments and status are outside that source manifest.

## Implemented boundaries

- UI-only exact integer RGB presentation and validation. Multiplication uses exact Decimal text, then nearest whole number with ties to even; the existing domain formatter is invoked only for its existing resource guards. The general decimal calculation APIs are unchanged.
- Independent byte-channel edit flags distinguish passive derived integers from explicit authoring, including identical-integer retyping. Invalid fractional/raw text remains visible and prevents discarded/hidden commits. Untouched source RGB and alpha remain exact.
- Visible per-channel approximation and associated validation descriptions. Slider eligibility uses original normalized source for untouched rounded fields, so outside-source values do not acquire a thumb through endpoint rounding.
- Shared rendered-label collision detection across normal token/group/reference consumers. It handles fallback text, whitespace collapse, long common ID prefixes, suffix-like authored names and static choice sentinels. Full values/keys and technical JSON/diagnostics/traces retain stable IDs.

## Automated evidence

- `npm test`: **966 tests / 35 files passed**. General decimal/color/conversion tests remain intact; the existing UI fractional-entry assertion was changed to the agreed integer rejection plus correction.
- `npm run typecheck`: all three strict TypeScript scopes passed. Rendered TSX consumer tests run in the presentation scope and Node Vitest runner, without a new DOM dependency.
- `npm run build -- --outDir /tmp/dtw006-dist`: passed; latest production JavaScript `index-D-NZxCNl.js`, CSS `index-DkTLDCoY.css`. Root `dist` was never rebuilt.
- `git diff --check`: passed.
- New tests independently assert exact half ties and both sides beyond 12 significant digits/Number precision, budgets, extended integers/none, explicit Green/identical-Red edits, alpha-only source retention, passive space round trips, invalid raw correction and other-channel retention. SSR tests exercise actual TokenList, ProjectNavigation, Editor native reference option labels/full values, readable references, real raw JSON, rename readback and rendered ColorFields approximation/error/slider eligibility.

## Maintained browser entries and preview isolation

Started a fresh Vite development server with `cacheDir: /tmp/dtw006-vite-cache`, host `127.0.0.1`, strict port `5186`. The unchanged maintained-entry scan boundary is `index.html` plus `test/browser/*.html`; startup and subsequent logs showed no dependency-scan errors. HTTP checks returned 200 with Vite client injection for `/`, `/test/browser/fixture.html`, `/test/browser/increment005.html` and `/test/browser/increment006.html`.

The new fixture uses only maintained bare/alias imports. It covers distinct exact RGB strings, ties/sides/outside endpoints, duplicate/empty/fallback/whitespace/suffix-like names, duplicate groups with long common ID prefixes, reserved choice names and a nested token. `?broken=true` adds missing references and invalid namespaces. Visible failure controls and test-only Alt+Shift+R/C are retained from the earlier maintained fixture pattern. Fixtures remain outside production.

Production preview uses strict port `4186` and `/tmp/dtw006-dist`. The user's existing `4185` production tab and shared root assets were not navigated, reloaded or rebuilt by the developer.

## Runtime attribution and limits

The coordinator performs actual in-app-browser flows against the frozen implementation and records their evidence separately. This document claims developer source/tests/SSR/build/HTTP checks only. The developer did not use an unavailable child IAB binding, claim independent review, or substitute other browser automation for ordinary IAB flows. Actual 200% zoom, screen-reader, physical-device and cross-engine checks are not established by these automated results.

## Bounded label follow-up before review

Developer self-audit found that opaque IDs containing collapsed whitespace or the suffix delimiter could exhaust the normal full-prefix loop without producing unique rendered labels. The coordinator released the writer lock for this bounded correction before stateful browser verification. Normal prefixes remain unchanged; exhaustion now uses visible `id:` plus escaped UTF-16 units, checks newly colliding authored names, and is bounded. Duplicate stable IDs are diagnosed immediately rather than looping (application readback already rejects them). Regressions cover whitespace-only ID differences, a deliberate four-entry base/suffix collision, an authored name matching the escaped fallback and duplicate IDs. The original manifest is retained; r2 owns the updated reviewed source.

## Independent review R1 correction

The independent reviewer reproduced a final-choice collision: a current token named `x` and another named `x (this token)` rendered identically because the self hint was added after disambiguation. The helper now includes that optional current-token hint before checking the actual color reference choice set. Ordinary headers/readable paths remain unchanged; native option values and authored aliases retain full IDs. A failing-then-passing real application-operations/Editor SSR regression asserts both final labels, selection values and unchanged source names/reference target; a focused helper regression checks context separately. Full tests, strict typechecks, isolated production build and whitespace checks pass on r3. Earlier manifests are retained.
