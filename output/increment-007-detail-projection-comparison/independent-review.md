# Independent review — detail/projection comparison

Reviewed 10 November 2026 against baseline `30abbf00afbe75f9de8d4eca932dd28ed860d9af` and the user-approved exact-detail/projection assessments. This is review of isolated comparison evidence, not production Increment 007 or final contract/design agreement.

Snapshot: `manifest.json` SHA-256 `0e229f97953dbfa3e863b4b591bb7ed3dc32c60e721f939ed98f7efea74aa239`, 116 files. All hashes match. All 80 older G-01 manifest entries and 11 reused-source provenance entries also match. Coordinator-owned approval/status edits are outside this implementation manifest. Only this report and `reviewer-probes/` were written by the reviewer; no source, frozen evidence, production files or Git index were changed.

## Verdict

**Accept the two scoped negative opening observations. Neither candidate qualifies.** No correction or rerun is necessary to establish these failures. The results support returning the exact-detail design to the user; they do not prove either control or all bounded rendering strategies impossible. No positive complete-list, inspector, projection, native-interaction, distribution or Safari qualification follows.

| Executed candidate | Target-page renderer main | Whole RunTask | Nested Layout | Result |
| --- | --- | ---: | ---: | --- |
| No-wrap, bounded overflow pre | pid 18320 / tid 224750 | 120.547 ms | 110.780 ms | Exceeds unchanged 100 ms gate |
| Conditional readonly textarea, wrap off | pid 18826 / tid 229731 | 128.683 ms | 119.338 ms | Exceeds unchanged 100 ms gate |

The raw traces independently establish these events in the target page process, with whole-task coverage. Nested task/Layout durations overlap and must not be added. Each failure occurred in its own disclosure/request/transfer/assembly/mount/paint interval. Later source readback, keyboard selection and explicit geometry phases were not run for that large case. No explicit DOM Range or geometry probe appears in the failing runner phase. The trace does not establish the exact internal forcing call or a causal speed ranking between candidates. One genuine over-target observation is sufficient to stop; a p95 claim would require further evidence and was correctly not attempted.

## Finding required before future positive instrumentation reuse

**R1 / P2 — scope coverage to the target renderer (trace.mjs:4–12).** The detector aggregates every thread named CrRendererMain and accepts any RunTask among them as whole-task coverage. A trace containing target-page Layout without target-page whole tasks, plus a different renderer's ordinary RunTask, returns `pass`. That violates the missing-required-coverage-is-inconclusive rule. `reviewer-probes/offline.mjs` reproduces this using target process 1 and unrelated process 2; the recorded `missingTargetCoverage.status` is `pass`.

Require identified target-frame/process main-thread coverage for the measured interval, and add a regression for an unrelated renderer supplying the only tasks. Missing or ambiguous target coverage must remain inconclusive. This is a harness defect to resolve before future positive qualification, **not a reason to discard the current negative observations**: all saved non-navigation phases were independently re-evaluated using only the target-page process and retain their recorded verdicts. The known 191.793 ms Layout regression correctly fails despite absent RunTask; empty traces and the current single-thread missing-task regression correctly return inconclusive.

## Exactness, admission and provenance

- Independently regenerated all three frozen fixtures through their semantic/preflight guards. Counts, canonical hashes and expected pretty-source hashes match both result logs. The admitted font-family record has 63 families of 65,536 units; source length is 4,134,504 UTF-16 units and expected SHA-256 is `b7b6c3ea2c4bf426e52144643a6e556d1312015ed49efecee218d70f6660e56e`. There is no new admission cap, rounding, clipping or omitted family in its source construction.
- Worker raw text is the same `JSON.stringify(authored, null, 2)`, separately framed without putting the full font-family definition into its overview row/editor projection. Its row is 144 compact encoded bytes. The long color-row logical projection is 135,453 bytes and is transported in frames rather than exempted as an oversized row.
- Source inspection confirms the archived pre uses the native disclosure and complete pre with uniform no-wrap/overflow/max-height 50vh; current and textarea-archive source use a labelled readOnly, wrap-off textarea with fixed 50vh viewport. Both archived builds and exact executed variants are retained. The textarea short-source viewport differs from the natural-height pre and is explicitly disclosed.
- Expected source identity does not prove large mounted-text equality: the large readback phase was stopped before execution. Smaller ordinary/long source hashes independently agree with expected fixture hashes in both logs. The UTF-16 framing tests also preserve split pairs and lone surrogates.
- Worker load instrumentation eagerly pretty-serializes the raw fixture to obtain a unit count (`worker.ts:45`). It sends no full raw source to a closed disclosure and mounts no raw node before opening, but violates the stronger no-closed-source-construction objective. The combined handoff accurately discloses this; opening serializes it again. No positive on-demand whole-boundary claim is justified.

## Projection and UI limits remain mandatory

The comparison uses actual React production builds and owned ColorFields, session helpers, buttons, fields, swatches, badges, Select and tabs. Copied row/editor markup and exact source transformations are reviewable; real application read/inspect, domain path/resolution, identity-label and eligibility functions replace the earlier fake readback/synthetic successes. These facts provide useful fidelity/projection evidence, not a full parity pass.

The following disclosed gaps remain; they do not need to be implemented after a failed first risk gate merely to preserve this negative comparison:

- **Whole-wire accounting:** `nextFrame` bounds the frame before `worker.ts:52` adds `next` and `{id,value}`; renderer measurement also sees only `value`. The independent boundary probe produces a 32,753-byte frame but a 32,770-byte actual wrapper. Current observed frames remain comfortably below 32 KiB, so no observed result is invalidated. Before general reuse count/enforce the complete response/header, including added fields and long identities; this is a transport hypothesis, never a new data cap.
- **Preparation/mount work:** logical rows/options/text are still assembled in full, and row commits are bounded by 24 records rather than combined commit text size. The worker eagerly prepares the full row result and holds all serialized row strings. Selected editor includes all applicable references. No complete options/sidebar/All-content native surface or maximum final DOM/layout/AT footprint is qualified.
- **Live fences/lifetime:** checks around awaits/assembly/mount use live current selection/result and epochs in the tested path. Worker/project/revision values are fixed in this scaffold; tests do not exercise delayed old replies, replacement workers, revisions or close/reopen. Draft context is updated in a reference-preview effect, not synchronously on every mode/view/scale event. Only sameContext predicate tests are present; one outstanding passive request under rapid replacement, release-by-result ownership, obsolete assembly/cache/DOM lifetime and current field/header state require real race tests before qualification.
- **Domain guards:** real simple literal/reference resolution is used for tested rows. The derived helper's limited guard does not establish full F-5 DAG/arithmetic/path/diagnostic budgets; row/editor preview calls real inspect independently of that helper. No positive general derived-work claim is supported.
- **Full preserved experience:** Row receives no selected prop (`main.tsx:26`), so selected styling is absent. The shell omits production navigation, creation, rename, selected-outside-filter notice/return, dirty-departure coordination and applied/draft header context; search reload resets selection. Apply is deliberately injected failure. Copied control presence and four-input checks do not qualify field editing, sliders, five views, two RGB scales, both drafts, metadata, errors, tabs, trace/diagnostic completeness, recovery/focus or the production footer/header interactions. Production itself remains unchanged.
- **Passive failures:** comparison reads have no complete local error/retry publication path. Narrow props alone do not establish the required pending/stale/unavailable and accessible error states.

## Native evidence and geometry

The recorded pre Meta+A really uses keyboard input, but selects document scope: 13,777/407,149 units versus 572/135,690 raw source units. It does not prove local source Select All or clipboard fidelity. The textarea's smaller-control native selectionStart/selectionEnd cover its complete value. Neither control has large-case native selection/copy evidence. Clipboard was untouched, so no private clipboard capture or restoration was needed.

Later smaller-control geometry shows 331-by-500-pixel source viewports and no surrounding document horizontal overflow. Those measurements are explicitly separate from the failing opening phases. The pre has horizontal scroll widths 397 and 434,142 px, supporting no-wrap scrolling in these controls, not a reflow/zoom/AT pass. No new native browser session was needed for this review: failed large paths were not rerun. Find, clipboard readback, pointer/key scrolling across boundaries, AT, 320px layout, actual 200% zoom and full selected-inspector keyboard/focus behavior remain unverified. Safari defensive supervision remains unqualified and was not bypassed.

## Independent verification

- 116 current snapshot hashes, all 80 older G-01 entries and 11 reused-source provenance hashes verified.
- All 32 saved trace verdicts/maxima replayed; all non-navigation phases additionally checked against the target-page process from trace frame metadata. Both recorded failures retained.
- Five focused trace/framing tests pass, including the historical 191.793 ms rejection. Isolated strict TypeScript check passes.
- Offline fixture/source-identity, target-renderer-coverage counterexample and whole-wrapper boundary probes are preserved in `reviewer-probes/offline.mjs` and `offline-result.json`.
- Inspected archived/current source, generated editor diffs, raw traces/results, stop sequence and production provenance. No broad scale, native large case, Safari, public tunnel, settings or clipboard operation ran. Existing production test/build logs were inspected; the reviewer did not independently rerun the full production suite or rebuild over frozen artifacts.

The developer's candid failed/incomplete disposition is supported. Preserve both failures and explicit gaps; repair R1 and complete applicable boundaries before any later positive reuse. Next product/design choice remains with the user. No staging, commit, push, production implementation or third viewer is authorized by this review.

## R1 independent recheck — closed

Reviewed the offline-only correction frozen by `manifest-r1.json`, SHA-256 `1934c993a4a33834a5553130c270665c232d8216eb4ef9eb7a2b08368ad11796`, 131 files. All hashes match. Original `manifest.json` and `manifest-v1.json` retain SHA-256 `0e229f97953dbfa3e863b4b591bb7ed3dc32c60e721f939ed98f7efea74aa239`; all 116 historical entries verify through `r1-version-map.json`, including the five archived pre-correction active source files. Original source/build/browser results/traces remain intact.

**R1 is resolved for the identified defect.** `trace.mjs` now requires externally identified ownership, scopes CrRendererMain coverage/events to that process, and returns inconclusive for missing/ambiguous ownership or missing target whole tasks. The exact reviewer counterexample returns inconclusive with explicit PID, exact frame ID and exact URL selection. Added foreign >100ms Layout cannot decide the target verdict; a target >100ms Layout still fails despite missing whole tasks. The historical 191.793 ms target Layout continues to fail.

Both future runner call sites supply their own page-scoped CDP frame ID, rather than using arbitrary renderer metadata to establish ownership. Source inspection verifies this correction; these edited callers have not been executed in a browser. An unidentified/ambiguous navigation can stop inconclusive and must not be relabelled a pass. No live integration or general complete-trace guarantee follows solely from these offline checks.

Independent replay of all 32 saved traces confirms **all 30 non-navigation statuses and target-only maxima unchanged**. Both initial navigation traces lack target-URL ownership at trace start and now conservatively return inconclusive; this supersedes their historical pass interpretation without rewriting saved results. Both admitted large-detail failures and durations above remain unchanged. `reviewer-probes/r1.mjs` and `r1-result.json` preserve independent checks. Seven focused tests and the isolated strict typecheck pass.

No browser, UI, workload, build, native clipboard, settings, tunnel, source-budget or production experiment was run for the correction/recheck. No further required correction remains to accept this scoped negative comparison. All whole-wire, eager closed-source preparation, full UI fidelity, live races/lifetime, F-5, native exact-source access, scale/distribution and Safari gaps identified above remain open; R1 closure is not whole-candidate qualification.
