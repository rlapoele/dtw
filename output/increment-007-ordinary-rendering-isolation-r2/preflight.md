# R2 preflight — no browser execution

Baseline `9975731`; only new R2 research/output directories written by developer.
The coordinator owns the separate plan amendment. Production, first batch and old
artifacts remain unchanged; no staging, commit, branch change or push.

Phase 1 checks: 14 focused Node tests pass (7 trace controls, 7 sizing safeguards),
isolated TypeScript check passes, isolated Vite build passes. Cached dependencies
only; build/cache under `/tmp/dtw-ordinary-isolation-r2-*`; root dist untouched.
Frozen fixture digests and 65,535 pretty / 65,004 raw UTF-16 lengths match offline.
Tests include a fixed-height mutant that matches a short baseline but fails growth,
unsupported vertical sizing and responsive legacy-box/clamp preservation.

The specimen keeps original classes and wrapper/paragraph nodes, copying inherited
text rules only. Responsive displays use authored `none` / `block` / `-webkit-box`,
never computed legacy display serialization. A measured definite width constrains
only a new ordinary block. Inspector max-width comes from its original matched
`.inspector-heading p` declaration. No used pixel heights/min/max sizes are cloned.

Records separate complete matched CSS declarations/group conditions, original
inline declarations, ancestor layout context, specified vertical defaults guarded
against any matching vertical sizing declaration, resolved values and used boxes.
All measured fields remain compared. Only wide outer `min-height` and its
horizontal-tb logical `min-block-size` alias may explain the exact `auto`→`0px`
change with original grid → leaf block context, unchanged automatic authoring and
matched geometry. Every baseline, one-line and three-line stage must match; both
original and leaf must grow naturally to two clamped lines / three inspector lines.
Raw differences and the narrowly explained pair remain visible.

Each of the at most three controls includes original and leaf traces covering the
small assertions and restored original small text. Baseline/CSSOM evidence capture
inside control traces is instrumentation overhead, not isolated long-text cost;
its whole tasks still obey 100 ms. All stage witnesses are retained and ownership
checked. Risk traces contain no cascade/geometry auditing until after the witness;
fixture construction/hashing is measured separately before activation. No long App
render occurs. Any failed gate or inconclusive result stops the whole batch without
retry; persisted in-progress state blocks restarting an interrupted action.

Before live work a fresh reviewer must inspect this exact source/build snapshot.
The pre-execution manifest pins source, copies and actual served `/tmp` build bytes;
the runner rechecks them before every action. Execution remains paused pending the
coordinator's release after independent preflight review. No browser process has
been launched and no live control or risk mount has run.

Suggested eventual commit: `research: correct ordinary isolation sizing and record bounded r2 batch`.
