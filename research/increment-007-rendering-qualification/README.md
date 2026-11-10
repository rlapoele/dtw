# G-01 isolated rendering qualification

**Frozen negative/partial experiment, 10 November 2026. Not Increment 007 implementation.**
See [report](../../output/increment-007-rendering-qualification/report.md) and its manifest.
Production files, dependencies and existing evidence were read only. Coordinator owns
agreement/status documentation. No staging, commit, push, prototype change or delegation.

The risk-first experiment imports current React/owned controls, copies the exact token
button from `TokenList`, and copies `Editor` with memoized label preparation and lazy
worker-authored raw text. `prepare-copies.py` identifies source hashes and reproduces
those copies. The plain source diff is preserved in the output. This is a **partial
adapter**, not a complete implementation of the approved bounded projection design.
Do not adopt it as production code or infer reference/group/All content correctness.

The largest raw source path exceeded the 100 ms main-thread gate. Do not rerun/expand
large tests without coordinator review of that result. Safari defensive work is
prohibited until the independently controlled stop path is qualified separately.

Reproduce nonbrowser source checks:

```sh
node research/increment-007-rendering-qualification/check-source.mjs
node node_modules/typescript/bin/tsc -p research/increment-007-rendering-qualification/tsconfig.json --noEmit
```

Build (existing repository dependencies only):

```sh
node node_modules/vite/bin/vite.js build --config research/increment-007-rendering-qualification/vite.config.ts
```

The exact performance browser source is `output/.../attempt-3-source/`; the final
runner additionally contains the subsequently executed small functional subset and
uses `DTW_SMALL_ONLY=1` for that subset. `run.mjs` opens its own native Chrome process,
profile and loopback-only static server. It uses the already installed Playwright
library for CDP automation, not a newly installed browser or dependency. Production
build only: no HMR/StrictMode. The production React Profiler callbacks are empty;
CDP Layout/style/paint traces and aggregate performance metrics are the actual browser
cost evidence. Long Tasks/RunTask absence is never an acceptance result.
