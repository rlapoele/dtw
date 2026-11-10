# Independent R2 source preflight

10 November 2026. Baseline `99757311a4182ee1260433c8e00833d90ecf0516`.
Reviewed pre-execution manifest SHA-256
`569bc49d09165d05e4977c48d0500ec7d9c20298f6ba14d8a785995fc21de313`
(106 entries). **No actionable source/preflight findings. Ready for the coordinator
to release the already authorized bounded batch. This is a static/offline verdict,
not a live control pass, long-text result or application qualification.**

## Expectations and independent inspection

Read AGENTS.md, reviewer role and the complete isolation plan including corrected
sizing authorization before inspecting implementation. Applied code-review-and-quality.
Derived these requirements: preserve original surface nodes/classes and structural
clamp CSS, both full responsive strings and inspector paragraph; pin definite width
only; retain automatic height, with explicit inherited typography and responsive
visibility translation permitted. Record authoring/context/resolved/used evidence
separately. Explain only the exact context-dependent wide-wrapper automatic-minimum
difference, with matched geometry and original-versus-leaf natural growth/clamp
checks. Every other mismatch stops the batch. Retain exact failed fixture identity,
target-owned whole-task tracing at 100 ms and independent 30-second supervision.

Then inspected specimen, styling/sizing policy, comparator, growth checks, regression
tests, fixture, runner, trace ownership/gates, watchdog and archiving code independently.
Consulted the stopped R1 raw failure basis/report/review and, after source inspection,
the R2 preflight explanation. No browser was opened or controlled during review.

## Source assessment

- `specimen.ts` preserves original tags/classes/children; `sizing.mjs` emits inherited
  text properties only, with explicit authored responsive display values. Inner
  `line-clamp-2` structure remains governed by original classes/CSS, rather than a
  serialized resolved `display`. Inspector retains its paragraph and original
  authored 285px maximum width. Measured width is applied to the new block; small
  used heights and min/max constraints are never copied.
- Sizing capture records matched declarations and enclosing conditions, original
  inline declarations, ancestor context, resolved properties and used boxes.
  Its current-source guard rejects any matched physical/logical vertical sizing
  declaration and unsupported writing mode instead of assuming equivalence.
- `compareControl` compares baseline, one-line and three-line stages in the original
  and isolated contexts. Only record 1 of the wide surface can explain `min-height`
  or its horizontal `min-block-size` alias from original grid `auto` to block `0px`;
  preserved automatic authoring and identical used geometry are prerequisites.
  Both contexts must separately grow from one line to two clamped preview lines or
  three inspector lines; the wide wrapper must grow with its child. Unsupported
  differences remain failures. Raw explained differences remain available.
- Focused regressions exercise the prior fixed-height failure with a mutant that
  matches the short baseline but fails growth, reject inline resolved sizing and
  unsupported auto-minimum cases, preserve authored legacy-box display/clamp, and
  verify actual three-line strings. These tests meaningfully target the known bug;
  they do not substitute for the upcoming live equivalence controls.
- Runner retains the six-action finite order, persisted stop/in-progress barrier,
  exact fixture/DOM checks, separate preconstruction timing, same-owned ordered
  activation/DOM/double-rAF marks, target-renderer whole-task coverage and unchanged
  100 ms ceiling. Original and leaf modest checks are supervised/traced within each
  small control. Mismatch, instrumentation failure, slow task or watchdog expiry
  prevents the next action. Watchdog is a separate process with PID/profile checking
  and arming acknowledgement; only owned Chrome is targeted.

## Independent offline verification

- All 106 pre-execution entries match bytes and SHA-256. All 14 research files match
  their execution-source archive. Rebuilt to a separate reviewer `/tmp` directory;
  all three resulting build files exactly match the pinned served `/tmp` build and
  archived served build. No live `state.json` exists at this preflight snapshot.
- All 111 unchanged R1 manifest inputs match. Its sole differing original manifest
  input is the separately authorized plan amendment. Both R1 research/output
  directories have zero tracked diff against baseline, including the R1 review
  excluded from that older manifest.
- Independently reconstructed fixture digests: canonical
  `1b4b5241cf1af157ac990eb238c210366180d95076845d897ff2afe706beca8e`;
  65,535-unit pretty token
  `739717a5620a061f514a96948c80ae45044d37789d822b85e56d500522d442e6`;
  65,004-unit raw description
  `e1d984995d9313a85b2dd7db37d2498cbabc8c9d35baec4d36e5a67173b82316`.
- `node --test research/increment-007-ordinary-rendering-isolation-r2/sizing.test.mjs research/increment-007-ordinary-rendering-isolation-r2/trace.test.mjs`:
  14/14 pass, including saved known Layout failure and foreign/missing/ambiguous
  renderer ownership controls.
- Isolated TypeScript check and isolated Vite build pass. No root application
  qualification or integrated Increment 007 tests were required or run.

Only this review file was written in the repository. Runtime control equivalence,
actual font/environment fidelity, browser tracing/ownership, long-text timing and
live watchdog/cleanup remain unverified until evidence review. No additional batch,
Safari, clipboard, production/prototype change, staging, commit or push is authorized
by this verdict. Final evidence requires this reviewer to recheck the frozen result;
no independent browser rerun should follow a stopping condition.

Suggested eventual focused commit:
`research: correct ordinary isolation sizing and record bounded r2 batch`.
