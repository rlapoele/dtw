# Presentation organization — developer evidence

10 November 2026. Baseline `c14bff7df4b5f475ef46a5d29841444cd1bc443c`, branch `dev`.
This is authorized organizational maintenance, not Increment 007 implementation.
No independent-review claim is made in this developer report.

## Changes and preservation

[Exact 22-file rename mapping](mapping.json) implements the agreed target. Only
module-import paths change inside moved TypeScript files. The root entry and four
maintained browser fixtures follow the new paths; six existing presentation test
files change imports only. Test locations and assertions stay unchanged. The
presentation root TypeScript configuration stays in place. No aliases, component
APIs, dependencies, formatting, application/domain semantics or CSS rules change.

Run `python3 output/presentation-organization/verify-preservation.py` to reproduce
comparison against the committed baseline. Every affected maintained source/test
file equals its baseline after only the explicit import replacements. The stylesheet
is byte-for-byte identical. The [hash evidence](preservation.json) includes every
move's before/after SHA-256 and exact generated-asset comparison.

A temporary before/after filesystem inventory also checked 12,242 existing files
under prototypes/research/output, including ignored artifacts, unchanged. Its
large inventory remains at `/tmp/dtw-presentation-organization-frozen-before.json`,
not in this delivery. `git diff --name-only c14bff7 -- prototypes research output
':!output/presentation-organization'` is empty. Historical source links/manifests
remain tied to their recorded original commits; no compatibility shims were added.
Root `dist/` was never a build target and was not emptied.

README, architecture and presentation conventions describe current ownership and
paths. The coordinator owns the approved proposal and targeted active Increment 007
source-link reconciliation; those changes are separate from the source moves.

## Checks

- Before moves: `npm run build -- --outDir /tmp/dtw-presentation-organization-before`
  passed all three strict typecheck scopes and production build.
- After moves: `npm run build -- --outDir /tmp/dtw-presentation-organization-after`
  passed all three scopes and production build (725 modules).
- `npm test`: **983 tests / 36 files passed**; [log](tests.log).
- Generated CSS: **34,818 bytes**, SHA-256
  `e392397961eefae05aeb3962252a9ad270bbafe13ba334d7f2444af827816703`,
  identical before/after. [Saved baseline CSS](baseline-generated.css).
- Generated JS: **404,836 bytes**, SHA-256
  `42ead3a02bd30e211f9f31587191db41ed651b2bf837d5050769b81d0aa8747b`,
  identical before/after. No CSS adjustment/source-scan workaround was required.
- `git diff --check` passed. Existing dependencies were used without installation.

## Bounded browser observations

Developer-operated fresh isolated Chrome through cached Playwright CLI 0.1.23;
new Vite server at `127.0.0.1:4235`, separate from retired historical review servers.
No historical prototype tab was targeted. The npm offline wrapper could not resolve
its package cache; the already-present CLI executable was used without installation.
Local listen/browser-cache permissions required normal tool escalation.

The root app created a project and token with an exact multiline description;
then applied `0.1234567890123456789`, edited another value and canceled back to the
exact applied decimal. [Authoring actions](browser-flow.log). Maintained Increment
006 fixture reference target applied from protected-color to hsl, canceled an oklab
draft back to hsl; a creation dialog focused Name and Escape returned focus to New
token. [Fixture assertions](fixture-flow.log).

[Rendering assertions](rendering.log) confirm inspector description `overflow-wrap:
anywhere`, `word-break: normal`, and the exact newline. ArrowRight moves tab focus;
Enter selects Resolved & trace, preserving manual activation. Measured 477px compact
viewport has 477px document scroll width. Screenshots were inspected at
[1440×1000](wide.png) and [477×850](compact.png). Generated CSS/JS identity supplies
before/after parity; these screenshots document the maintained post-move surface.

All maintained entries started: root, fixture.html, increment005.html,
increment006.html and components.html; [remaining fixture startup](entry-startup.log)
records HTTP 200 and no page errors. No behavior qualification claim is made for
Safari/native selection, clipboard, assistive technology, zoom, physical devices,
performance/resource limits or Increment 007. Existing qualification gaps remain.

Suggested focused commit: `refactor: organize presentation by responsibility`.
