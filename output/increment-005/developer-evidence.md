# Increment 005 developer evidence

Date: 8 November 2026. Base: `b54c876`. This is preliminary implementation evidence, not independent review or a completion report. The source snapshot is identified by [source-manifest.json](source-manifest.json); coordinator-owned contract/status are intentionally excluded.

## Delivered behavior and criterion coverage

- AC-1: App owns a token-only description draft; CreationDialog renders the labelled native two-line textarea immediately below Name. Only exact empty text omits the operation field. Nonempty text passes unchanged. New form, Cancel and successful creation clear the description; failure paths retain it. Existing operations and revision tests cover omitted, explicit-empty, whitespace-only and multiline descriptions. Browser confirmation is coordinated in the main chat.
- AC-2–AC-3: `authored-color.ts` derives exact named coordinates plus separate Alpha; `AuthoredValue` renders these for both TokenList and Currently applied. References retain target identity and show Reference/current path or Missing target. All authored data remains raw canonical JSON. Full inspector descriptions preserve newlines. Six direct consumer tests cover every space, long exact decimal text and `none` without unit suffixes.
- AC-4: the token-table is a Tailwind query container. Below `@3xl`/48rem it uses two aligned columns and a two-line description below identity; at/above it uses three aligned equal-width columns including Description/absent `—`. Header and row padding/gaps match. Obsolete viewport-based 42%/37%/34% value widths are removed. Actual browser geometry and transition validation are delegated to the coordinator's IAB session; this developer session cannot access IAB.
- AC-5–AC-6: pure closed semantic component order drives validation, conversion input/output, neutral/missing-hue access, labels, range/gradient identity and readable text. Culori channel keys/modes/scaling remain calculation integration data. No library/dependency, tuple, Decimal, alpha or policy changes. The existing independent 180-case corpus is retained; 25 added direct expected-coordinate checks use its fixed CSS references across all input/output spaces. Existing validation, exact drafts, byte scale, refusal and operation tests pass.

## Automated verification

At the manifested snapshot:

- `npm run typecheck`: passed (host-independent, browser and tools scopes).
- `npm test`: passed, 929 tests / 33 files.
- `npm run build`: passed; output JS 402.64 kB, CSS 32.79 kB, no dependency changes.
- `git diff --check`: passed.
- Dedicated `npm run dev -- --host 127.0.0.1 --port 5185 --strictPort --force`: fresh optimization/startup passed, Vite ready. An initial sandboxed attempt could not bind the port; the authorized escalated local-server invocation succeeded. The server is intentionally retained for main-chat browser verification.

No historical evidence, vendored references or frozen prototype was modified. No staging, commit, push or deployment was performed.

## Browser fixture and reproducible checks

Use the root-chat-owned new IAB tab at `http://127.0.0.1:5185/test/browser/increment005.html?broken=true`. Do not reload or alter the user's existing application tab.

The fixture retains protected-color, alias, Number and broken-reference cases, and adds sRGB/Display P3/HSL/OKLab/OKLCH literals, multiline descriptions, long decimal coordinates and `none`. It imports maintained source and bare packages. Visible Fail reads/Fail commits checkboxes are test-only. Within an open modal, Alt+Shift+R toggles read failure and dispatches a read; Alt+Shift+C toggles commit failure. These are source-defined fixture controls, not a browser-state evaluation API.

1. Open New token: Name then Description (optional), native textarea rows=2. Fill both. Force commit failure and Create: error focus and fields retained. Restore commits/Create: inspector and list show exact description. Edit/apply a value: description retained. New/Cancel/reopen: empty description.
2. Fill another creation form. Toggle read failure: Create disabled and fields retained. Restore/read retry: same fields. Test rejected duplicate name while description remains.
3. Select literal fixtures: inspect named exact values, Alpha, degrees/percent, `none`; expand All authored data to confirm ordered tuple and separate alpha. Select alias/missing alias: relationship stays visible.
4. Wide pane: real Description column and aligned cells; collapse/expand panels at the same viewport. Reported 926px/~590px pane must be compact. Check both sides of 768px actual table allocation. Previews clamp after two lines; inspector has all three.
5. Check 320px, short height, modal focus/return, scrolling and actual verified browser zoom 200%. Do not emulate zoom with CSS.
6. Also load maintained `fixture.html?broken=true` and `components.html`, plus production entry, to confirm fresh development scanning and fixture startup remain clean.

## Coverage limits

The developer CUA call `createBrowserTab("iab", ...)` returned `Browser is not available: iab`; inventory showed no browser providers. No user tab was touched and no alternate browser was used. Main chat has its own IAB binding and owns runtime checks/screenshots. Browser verification is pending in this evidence until the coordinator records it. Screen-reader, physical-device/touch/virtual-keyboard and cross-engine runtime checks are not claimed.

## Coordinator visual correction — r2

The coordinator's IAB check found that the first implementation stacked every list coordinate vertically, making rows unnecessarily tall. The approved arrangement is now explicit: TokenList selects the compact presentation (space label, then inline named pairs separated by middots and wrapping between pairs). Long exact pairs can wrap internally to remain visible. The inspector keeps expanded full-name rows. Both variants consume the same exact formatter and domain component order; Alpha remains separate from OKLab axis `a`.

Five new failing-then-passing compact consumer cases cover all spaces and exact values/units/none. The r2 snapshot is [source-manifest-r2.json](source-manifest-r2.json); the initial manifest remains preserved. Updated full suite: **934 tests / 33 files**, passing. Strict typecheck, production build and whitespace checks pass. Browser confirmation remains coordinator-owned.

## Coordinator clamp correction — r3

At a 574px allocated table width, the main IAB measured the compact three-line description at 50px instead of the expected two-line 33px. Its redundant `block` utility overrode the `line-clamp-2` display requirement. Removed that conflicting utility from the compact description only. The wide preview was already clamped correctly and remains unchanged.

The identified snapshot is [source-manifest-r3.json](source-manifest-r3.json). Strict typecheck, production build and whitespace checks pass. The 934-test suite was unchanged by this single utility correction; a class-string assertion was deliberately omitted. Main-chat IAB height/scroll-height measurement is the behavioral regression verification and remains pending in this developer evidence.
