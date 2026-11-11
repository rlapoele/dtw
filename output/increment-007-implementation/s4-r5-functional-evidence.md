# Increment 007 R5 functional corrections — 11 November 2026

The functional source is frozen by `s4-r5-before-browser-manifest.json`, SHA-256
`771f2f1bf841dffb2c9888ac6dc512ce12e584e4e498e4ab5413232110f8ab4f`.
All 141 source hashes matched after the three passing native Chrome runs below.
Base remains `5c22404e34ea9a9b39e1bb6da1135c2719440536`; no staging,
commit, push or deployment occurred. Independent recheck and remaining resource,
performance/native/manual qualification remain separate completion requirements.

## Corrections and regressions

- F1: on a changed applied revision, a clean Editor replaces both authored draft
  sessions and its initial baseline, retaining passive color-space/scale choices.
  Dirty sessions retain their existing preservation and explicit Review/Reapply
  route. The session regression verifies literal/reference reset, passive choices
  and a following single-channel edit preserving the newly applied untouched
  coordinates and alpha. Native coverage below exercises the actual mounted Editor.
- F2: context/rows/inspection use a display-only unavailable-path result before
  collecting/joining over-budget ancestry. Exact authored names, IDs, membership,
  parent identities and complete-source access remain unchanged. Per-item joined
  display text is bounded at 65,536 UTF-16 units; each projection batch additionally
  bounds path amplification to 262,144 units and 50,000 ancestry steps. No partial
  path is fabricated. Transport tree inspection has a separate finite 8 Mi-unit /
  400,000-value envelope for DTO metadata and bounded derived data; canonical
  admission still uses its original 4,194,304-string-unit / 200,000-value limits.
  Both reviewer counterexamples and a snapshot exactly at the authored aggregate
  string limit now pass transport validation without changing their backups.

Focused regressions first failed (both reviewer counterexamples, then exact authored
aggregate boundary), and passed after their fixes. Full suite: **1,027 tests / 44
files pass**; all four strict TypeScript configurations and production build pass.
`git diff --check` passes. Production directory `/private/tmp/dtw007-production-r5`
served on loopback port 4334. A fresh rebuild to `...-r5-fixed` emitted identical
production bytes; source and production hashes are in the manifest.

## Native Chrome functional evidence

Developer-executed Chrome **157.0.8103.50**, isolated disposable own profiles,
actual production worker, native IndexedDB and Web Locks. Each runner uses an
external-to-Chrome Node controller with a 30-second own-process stop; no user
browser, clipboard or OS file-picker interaction. Source remained frozen.

- `s4-r5-clean.json` and `s4-r5-clean.png` beside this note: **8 checks pass**, no
  page errors. Clean literal replacement; following one-channel Apply preserves
  Green/Blue/Alpha; literal→reference; unrelated revision; no false dirty recovery;
  reference→literal; inactive reference reset; passive byte scale preservation.
- `../../output/playwright/increment-007-implementation/s4-r5-drafts-chrome.json`: **5 checks
  pass**, no page errors. Exact unapplied byte text excluded from backup; canceled
  preview preserves both sessions/view/scale; selected-outside-filter recovery;
  replacement preserves dirty sessions and explicit Review/Reapply behavior.
- `../../output/playwright/increment-007-implementation/s4-r5-roundtrip-ready.json`: **13
  checks pass**, no page errors. Real authoring/source/reopen; independent download;
  empty-origin restore; current-local protective backup and acknowledged complete
  replacement removing a local-only token; resulting complete authored snapshot
  and IDs exactly equal the original backup snapshot.

The earlier `s4-r5-roundtrip.json` is preserved as **failed after 11 checks**, as are
R4 failures. Its runner selected the restore file immediately after clicking
Projects. Departure awaits the worker before unmounting the workbench; checking
only whether an input was enabled could target the old workbench input. The new
identified `s4-r5-roundtrip-ready-runner.mjs` waits for the actual Projects heading
and loaded retained entry before selecting the file. It changes the harness only;
application source stayed frozen. No earlier failed run is upgraded to passing.

## Historical source preservation

The R4 source archive was constructed retrospectively by reversing only the R5
changes in memory. Every recovered file was checked against the existing R4
manifest before archiving. `s4-r4-reviewed-source.tar.gz` contains all **141 exact
R4 source files**, archive SHA-256
`73a3eec4c0f13175676d84a55c0502b82468bf0c816133df7a277a36cbcf1866`.
Historical source/research/prototype/evidence files were not rewritten.

This note reports functional corrections and observed coverage, not completion of
Increment 007. User manual Chrome/Firefox acceptance and the remaining agreed
Chrome qualification gates have not been inferred from these checks.
