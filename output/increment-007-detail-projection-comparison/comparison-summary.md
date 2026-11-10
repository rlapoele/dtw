# Bounded comparison handoff

**Both exact-detail candidates fail their first exact-4M opening gate.**

| Candidate | Renderer-main RunTask | Layout | Disposition |
| --- | ---: | ---: | --- |
| Uniform bounded no-wrap pre |120.547ms|110.780ms|Fail; preserved and stopped|
| Conditional readonly textarea, wrap off |128.683ms|119.338ms|Fail; preserved and stopped|

These are separately traced disclosure/transfer/assembly/mount/paint intervals,
not the old combined selection/geometry interval. Both exceed unchanged100ms.
No causal ranking or distribution follows from one observation each. No scale,
Safari maximum, third viewer, threshold, data cap, source clipping or production work.

[Pre report](report.md), [textarea report](textarea-report.md) and exact source/build/
traces/results are preserved. `nowrap-manifest.json` was verified unchanged after the
conditional run. The final `manifest.json` freezes both outcomes plus current source;
reviewer-owned reports are excluded. Current source is the conditional textarea
variant; the original pre is reproducible from its exact `attempt-1-source/` archive.

Instrumentation corrections are demonstrated by the frozen191.793ms regression and
missing-coverage tests. Five focused tests pass; isolated strict typechecks and both
production builds pass. Existing production suite: **983tests/36files**; production
strict typechecks pass. No agent staged/committed/pushed.

The isolated projection scaffold is partial. Rows carry actual display fields;
raw font-family row144bytes versus4,134,504 source units, long-row135,453bytes is framed
without exempting it from transport targets. Actual domain namespace/labels/eligibility/
literal-reference resolution are reused; no fake ProjectReadback. Current transport
measurements count frame objects; actual message wrappers stay well below32KiB in
observed cases, but general whole-response byte-accounting enforcement is incomplete.
Do not claim all P-R1–5 surfaces qualified. Reported race/lifetime/navigation/All-content/
F-5/native/fidelity gaps remain open. Selection styling is absent in copied rows.

One instrumentation-only caveat: worker `load('raw')` pretty-serializes the fixture
once to assert its expected unit identity before the opening measurement. This is
worker-only preparation and no raw DOM/payload appears while closed, but it is eager
source construction; it does **not** qualify the stronger no-closed-source-construction
obligation. Opening serializes the source again. The final native mounted text is only
produced after disclosure. Both failing results remain valid negative main-thread
layout observations; no positive on-demand whole-boundary conclusion follows.

Next decision belongs to the coordinator/user: review the two negative outcomes and
choose a revised exact-detail contract/design or another specifically bounded proposal.
No implied approval for paging/windowing/file-only access, new controls or relaxed
budgets. Independent reviewer receives this stable snapshot without claiming review
already occurred. Suggested commit: `research: compare bounded exact-detail rendering`.
