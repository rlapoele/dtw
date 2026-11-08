# Increment 005 implementation review

Date: 8 November 2026. Reviewer: separate fresh-context reviewer subagent.

## Snapshot and method

Initial review used base `b54c876` plus the 18 files identified by [`source-manifest-r2.json`](../../output/increment-005/source-manifest-r2.json). All 18 SHA-256 hashes matched. The R1 correction was independently rechecked against [`source-manifest-r3.json`](../../output/increment-005/source-manifest-r3.json): all 18 hashes match; only TokenList changed from r2 (removal of the conflicting compact-preview `block` utility). The coordinator owns the contract/status and completion evidence outside that source manifest. The initial snapshot is historical; the final source assessment targets r3.

Expectations were derived first from the agreed [005 contract](005-token-details-and-color-components.md), workflow reviewer brief, architecture, canonical color model, approved 003 numerical policy and 004 preservation requirements. Source and tests were then inspected independently, before reading the developer evidence. The code-review-and-quality skill supplied the review axes. Approved product choices, including the compact inline list arrangement, were not reopened.

## Findings

**R1 — P2, AC-4: compact description exceeds the two-line preview limit.** Coordinator IAB evidence at a 926px viewport / 574px token table showed the sRGB description at height 50px with 16.5px line height (three lines). This reviewer did not independently reproduce the live browser state. Independent inspection confirms the cause: the compact preview combines `block` and `line-clamp-2`; compiled production CSS emits `.line-clamp-2` with `display:-webkit-box`, then `.block{display:block}`, overriding the display required by the clamp. The wide-column inner preview does not carry the conflicting display class. Remove the compact preview's unconditional `block` utility while preserving `@3xl:hidden`, then verify the compact three-line fixture renders at most two lines on the corrected identified snapshot. **Disposition: resolved in r3.** Independent source/manifest inspection confirms removal of the conflicting `block` class, preserving the two-line clamp and wide hiding. The coordinator reports an actual IAB recheck at 926px / 574px table: compact description height 33px, line height 16.5px, full scroll height 50px; wide counterpart hidden at height 0. This runtime result is attributed to the coordinator. Reviewer reran the full 934-test suite, strict typecheck/build and whitespace check on r3; all pass.

No other actionable source defect found within this review's coverage. This is a bounded assessment, not exhaustive correctness or independent browser certification.

## Independent checks

- `npm test`: **934 tests / 33 files passed**. Existing constructor/range, exact/none, neutral/powerless hue, refusal/budget, preview, draft, alias and application tests remain present and pass. The new direct conversion assertions use fixed CSS reference fixtures across the five spaces; expected values do not come from the component definition or Culori output.
- `npm run typecheck`: passed for domain/application, presentation and tools scopes.
- `npm run build`: passed; r3 JS **402.94 kB**, CSS **32.85 kB**. These are observed sizes, not budgets.
- `git diff --check`: passed.
- Manifest verification: **18 files; no drift** for r2 and corrected r3.
- Actual React static rendering independently exercises `ColorFields` and expanded `AuthoredValue` for all five spaces with distinct coordinates, exact long decimals and separate Alpha, plus missing-reference presentation. Reproduce with `node output/increment-005-review/ssr-check.mjs`; [results](../../output/increment-005-review/ssr-results.txt). This runs Vite in middleware mode with WebSocket disabled; it does not launch or automate a browser and does not establish layout, focus or interaction behavior.

## Criterion assessment

| Criterion | Independently assessed evidence |
| --- | --- |
| AC-1 | Source connects a token-only, labelled `rows=2` textarea immediately after Name. App omits exactly empty text and passes every other string unchanged. Open/cancel/success reset description; failure/readback return paths retain it. Application creation/read/revision tests preserve exact optional descriptions, including whitespace/newlines. The explicit empty-string operation test intentionally exercises the pre-existing operation contract; omission of UI empty text is established by App's request mapping. Coordinator IAB evidence below covers live commit/read failure retention, recovery, initial/error/return focus, reset, multiline creation and empty omission. |
| AC-2 | Exact summary formatter consumes shared order without Number coercion or rounding. Numeric hue/HSL suffixes and unmodified `none` are checked by tests/source. Both expanded and compact cases cover five spaces; OKLab `a` and Alpha remain separate. Wrapping uses `min-w-0`, maximum width and anywhere wrapping; coordinator runtime evidence below measures long-value containment. |
| AC-3 | Shared presentation preserves Reference, current path or Missing target and stable ID. Currently applied uses the same formatter; All authored data still stringifies the actual token, retaining ordered arrays and separate alpha. Inspector description preserves whitespace. Missing-reference static rendering passed. |
| AC-4 | Header/row grids have identical column counts, padding and gaps. The token table itself is the query container: `@3xl` selects three columns at 48rem; below that description moves beneath identity and its header/column are hidden. Absent wide descriptions use `—`; previews clamp to two lines. Coordinator IAB evidence below establishes shared alignment, actual 767/768px allocation transition, panel-dependent switching and corrected two-line clamping. |
| AC-5 | Closed pure domain identities/order are consumed by constructor rules, Culori input/output, neutral/powerless mapping, editor labels and summaries. Channel keys/modes/scaling remain outside descriptor data. No dependency, tuple, alpha, Decimal or space-set change. Conversion and constructor tests plus rendered controls exercise consumers rather than merely comparing maps. |
| AC-6 | Source changes preserve exact draft/byte/session machinery and application coordination. Rewritten identity-based validation/neutral branches correspond to prior numerical rules; existing numerical and session regressions pass. Coordinator IAB evidence below covers relevant creation-modal focus, scrolling/reachability and description retention through value Apply; no exhaustive repetition of the entire earlier authoring matrix is claimed. |
| AC-7 | Automated checks and independent source/static-render review pass. Maintained-entry startup scanning and browser-specific obligations are coordinator-owned evidence, not independently repeated here. |

## Browser evidence and limits

This review context has no available IAB/browser binding. It did not launch Chrome, CLI browser automation, CDP or another browser, and did not touch the user's current session. The coordinator's dedicated IAB tab is the authorized runtime surface. No reviewer-performed live browser interaction is claimed.

The reviewer read and reconciled the coordinator's saved [`coordinator-browser-evidence.md`](../../output/increment-005/coordinator-browser-evidence.md). These are **coordinator-performed IAB checks**, assessed for consistency with the contract/source, not independently repeated live by this reviewer:

- All five literal list/applied/editor readouts, exact long decimals/alpha, numeric hue/percent and missing components; reference/missing-target presentation; truthful displayed raw JSON and full multiline description.
- Wide header/row x alignment, same-viewport inspector collapse changing allocated layout, exact 767/768px token-table transition, compact 926px case, long-value containment and the corrected R1 two-line clamp.
- Exact multiline creation through a controlled commit rejection/retry; read failure with disabled Create, preserved inputs and recovery; successful description retention through value Apply; new/cancel reset; keyboard textarea access/newline; empty description absent from raw token data; initial/error/return focus.
- 320px containment and scrollable creation form; settled 640×360 modal measurements with Create reachable and no horizontal overflow/overlap.

This evidence supports the changed runtime criteria within its sampled states. **Actual 200% browser zoom verification is now complete in the explicitly authorized isolated Chrome session.** The reviewer inspected the developer's [zoom evidence](../../output/increment-005-zoom/evidence.md), settings/authoring scripts and measurement logs, plus the saved 200% authored-example and reachable-creation-action screenshots. The setting explicitly selected Chrome Page zoom 200%; a fixed physical 1440×900 viewport changed from 1440×900 CSS px / DPR 1 to 720×450 CSS px / DPR 2 with visualViewport.scale 1, and restoration to 100% returned the baseline metrics. No intervening viewport resize/device-scale/CSS zoom is used as the zoom claim. The authoring/rejection/correction, exact raw JSON, compact long coordinate/Alpha, two-line clamp, reset, settled focus return and reachable modal actions are supported by the saved checks. The reported authoring error list is empty. The transient dialog tree and exploratory invalid assumption are disclosed rather than presented as passing checks.

This closes the actual-zoom evidence gap. It is **developer-performed browser verification**, inspected by this reviewer, not an independently repeated reviewer browser session. IAB's earlier shortcut attempt remains unsuccessful; the separately authorized Chrome session supplied the valid evidence and was restored/closed afterward.

The maintained-entry startup evidence gap is now closed by the coordinator's saved follow-up: `components.html` rendered its Callback button, `fixture.html` rendered New token and the browser error log was empty. The coordinator also opened an independent production preview at port 4185 from the reviewed build, observed its empty entry and successfully created a project/described token and applied a revision with the exact description retained; its error log was empty. This complements the developer's fresh `--force` optimization/startup evidence. These are attributed coordinator checks, not reviewer-performed browser sessions.

No screen-reader, physical-device/virtual-keyboard or cross-engine runtime verification was performed by this reviewer. No staging, commits, pushes or deployment were performed.

## Final assessment

The coordinator's documentation-only glossary addition, **Color component identity**, was also reviewed outside the 18-file implementation manifest. It accurately distinguishes semantic coordinate names/order from stable token/group IDs, new stored fields, independently referenceable parts and separate alpha; no contradiction found.

The r3 implementation satisfies the agreed bounded increment within the independent source/automated/static-render checks and explicitly attributed browser coverage above. R1 is resolved and rechecked; no required finding or verification gap remains. Existing session-only, numerical-service and known tiny-red refusal limits are preserved. Human Git review/staging/commit remains outside this review's authorization.
