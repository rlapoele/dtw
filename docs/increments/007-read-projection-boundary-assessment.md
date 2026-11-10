# Increment 007 — missing read-projection boundaries

**Recommendations approved for isolated comparison — 10 November 2026. Not implemented in production.**
Baseline: clean `7474dc0befc9a11622ac3202ae07ce6c62ee4c30`. Preserve current list,
complete inspector, AC-1–24 and agreed P/S/F/B policies. Draft / Not started remains.
The analyst did not review the new exact-detail design in this assessment. The user
subsequently approved both recommendations after commit `30abbf0` and authorized
an isolated developer comparison followed by independent review. The proposed
transport targets are starting points to measure, not new admission limits or proven
performance bounds. No existing-prototype or production implementation is authorized.

## Recommendation and evidence

Approve a small set of **named asynchronous read projections**, prepared from one
coherent worker read view, before further positive G-01 qualification. Keep the
existing synchronous `ProjectReadback`/`TokenInspection` as evidence of current
semantics, not browser transport contracts. Renderer presentation adapters will
need narrower props; preserve behavior and owned controls rather than supplying a
fake partial project merely to retain the old type signatures.

The [G-01 report](../../output/increment-007-rendering-qualification/report.md) and
[independent review](../../output/increment-007-rendering-qualification/independent-review.md)
identify the concrete omissions: a tiny visible row carried about 4.13 MB of authored
data, inspection returned the project, paths/resolution were synthetic, and group/
choice/All content/current-response/lifetime boundaries were incomplete. The admitted
4,134,504-code-unit raw detail produced a 191.793 ms renderer Layout event on its
combined open/complete-selection path. This is negative evidence for that path;
it neither rejects ordinary staged rows nor certifies the remaining candidate.
The [80-file manifest](../../output/increment-007-rendering-qualification/manifest.json)
SHA-256 is `aa83dbdbc6597c10138f1d0b1839b9ba91507613c9e4416aacfa51798d850024`.

## Five bounded recommendations for user review

| Choice | Recommended boundary | Cost / decision implication |
| --- | --- | --- |
| P-R1 — display-specific reads | Worker provides row, navigation/choice, selected-editor, selected-derived and exact-text reads below. No entire canonical project/token graph crosses incidentally. | Small prop/application-read changes are necessary; copying the inspector into production or manufacturing a partial ProjectReadback is not an acceptable shortcut. No generic RPC/query framework. |
| P-R2 — transport and commit pressure | One outstanding passive batch per active surface; row-count **and** encoded/text targets, including a single row. Frame oversized text rather than exempting it. Stable staged row blocks avoid repeatedly reconciling the growing prefix. | Targets below need measurement. Framing is transport, not a new authored-data limit or authority; final complete row/native-option/layout costs still require proof. |
| P-R3 — complete membership and identity | Derive search/group membership, order and collision-safe labels across the full applicable project collection before declaring ready. All content includes every admitted group/token regardless of ancestry. | Choices/sidebar need full preparation and eventual native content, not a new picker or prefix-based search. Large labels/options remain explicit feasibility risks. |
| P-R4 — live publication/lifetime | Compare response tags against **current** renderer context after every await, including assembly and mount. Invalidate replaced workers/results and free obsolete read material. | Requires actual delayed-message/lifecycle checks; a predicate tested only against captured request context is insufficient. Read cancellation cannot cancel a command. |
| P-R5 — exact access separate from overview | Exact applied/editor values arrive where existing controls need them; large raw/resolved/trace/diagnostic text is requested separately and remains fully available. | The separate designer's exact-detail proposal still needs user review. This assessment chooses no textarea, paging, clipping, list windowing or replacement detail interaction. |

## Minimal read surfaces — conceptual contracts, not a new schema/framework

All return a context envelope, explicit loading/ready/error state and completeness;
no read applies data, clears a draft, acknowledges a write or changes authoring rules.

| Named surface / current consumer | Minimal data and exactness | Ownership, scope and failure/completion |
| --- | --- | --- |
| `readTokenRows(query, group, result, range)` — TokenList/App | Ordered project/kind/identity; worker label/path status; layer/type; optional description exactly distinguished from absence; existing exact named color components/Alpha or reference target label/missing state or current noncolor kind/no-assignment summary; bounded real swatch outcome. **No complete definition/AST/composite/raw token.** | Worker computes complete path-label case-insensitive search and direct-parent filter as current App does; total membership before completed empty state. Batch completion differs from full mounted-result completion. Real domain alias resolution supplies preview or explicit unavailable; no synthetic literal-only success. Read failure is incomplete/stale, not empty. |
| `readNavigationAndChoices(kind, result, range)` — ProjectNavigation, CreationDialog, Editor | Group/sidebar rows, root/all actions, counts; reference choices contain the complete eligible color set with self/reserved-label context; parent choices contain all existing group identities/labels. Preserve exact option values via identity mapping. | Separate named kinds, not one generic query language. Labels use the **whole applicable project collection** (all token labels; all eligible reference choices; all group choices), never received prefix or search subset. All content combines kind-scoped records with unavailable-path reasons. No fake path for cycles/missing parents. |
| `readSelectedEditor(kind, id)` — Editor/header | Exact identity, name/description/type/layer/role/regeneration/parent display and eligibility; exact selected editable color literal or reference baseline; applied summary/preview and revision. Group inspection provides its admitted metadata/context without token-only assumptions. | No project array or unrelated authored records. Description absence yields No description for existing tokens. Preserve full components/alpha/view/scale and protected/inspect-only behavior. Raw draft/source mode/view/scale remain renderer session state, separate from applied baseline. Removed target is explicit, never replaced with same-name record. |
| `readSelectedDerived(id, panel, draftContext?)` — Resolved & trace/header/reference preview | Real bounded domain resolution, trace steps with exact IDs/worker labels and real diagnostic data; applied or draft-target preview distinctly tagged. Return lightweight status/specimen before separately requested heavy text. | Worker uses the same revision and agreed F-5 guards, not renderer graph traversal. Applied panel cannot accidentally read draft state. Draft preview carries its source/target/session generation; only current result may affect feedback. Budget-unavailable differs from invalid authored data; incomplete report never means all-clear. |
| `readExactText(kind, id, section, offset)` — existing requested exact details | Worker-produced exact authored/value/identity/resolved/trace/diagnostic text with total UTF-16 length, offset/length, section identity and complete flag. Selected raw text covers the complete admitted entity, not its overview projection. | Pinned to the same worker/incarnation/revision/entity/section; no mixed-revision concatenation. UTF-16 code units, lone surrogates and absence remain exact; no Number rounding or ellipses. Transport frames do not choose the visible raw UI. Preparing/error/incomplete cannot claim complete selectable source. |

Project catalogue/header reads remain bounded summaries over the same retained records,
not a second read database. Pure formatting such as authored color-coordinate labels
may be reused without exposing the graph. Move graph-dependent path derivation,
identity-label preparation, actual resolution/eligibility and target lookup behind
these application reads using owning domain functions. Do not duplicate semantics
in DTO adapters or reuse the harness's synthetic derivations as production logic.
Derived paths/collision labels can expand far beyond source size through repeated
ancestry/choice text. Enforce agreed F-5 derived work/text guards before allocating
that expansion. Resource-unavailable is truthful; a prefix is not a valid path or
unique label. Exact authored identity remains accessible; any new visible unavailable-
label fallback needs bounded design review, not a new authoring cap or hidden record.

Current sources motivating these boundaries: [TokenList](../../src/presentation/TokenList.tsx)
calls `inspect` per row; [AuthoredValue](../../src/presentation/AuthoredValue.tsx)
looks up reference labels in the whole project; [Editor](../../src/presentation/Editor.tsx)
derives all choices and reads full-token raw/resolved/trace data;
[readback helpers](../../src/presentation/readback.ts) compute collision-safe labels;
[application operations](../../src/application/authoring.ts) own actual paths/resolution.
Reuse owned controls, ColorFields and genuinely pure formatting where their contracts
fit. Async readiness, pending Apply and narrower props require deliberate adapters,
not synchronous callback-shaped promises or permanent copies of source components.
Commands keep their existing authoritative acknowledgement/CAS/reconciliation duties.

## Size and scheduling proposal — no new admission cap

Start qualification with **24 rows and 32 KiB (32,768 bytes) of compact UTF-8 encoded
response per batch**, whichever is reached first; include envelope, IDs, labels and
escaped text in accounting. Also target **8,192 decoded UTF-16 text units per frame**.
These are proposed scheduling/transport targets, not established safe numbers, new
F-4 ceilings or permission to reject an otherwise admitted project. Row count alone
misses long names/paths/descriptions/Decimals. Count before constructing a large reply.

No “oversized row travels alone” exemption carrying megabytes. Long display fields,
IDs and exact text use bounded frames with worker-local result/item handles and
length/offset metadata; handles never replace canonical identity in commands, details
or equality. Frame headers use bounded session-only view/request/item handles, not
repeated unbounded project/entity IDs or labels; resolve them to the exact context
assembled for this worker/project/revision/generation. Never use array position as
a retargetable identity. Count headers within the same byte budget. Assemble exact
canonical identity before publishing a selectable entity;
absence/root/All tokens are tagged alternatives, never empty-string sentinels. Preserve
surrogate code units across framing. A single logical row may require several frames;
its full content and final row layout still need separate qualification. If complete
ordinary row/options cannot meet the target, return evidence and a user choice—do not
clip them, label a prefix complete or turn them into raw-only inaccessible content.

Renderer appends stable blocks of unchanged owned rows; it does not spread/relabel/
reconcile the entire accumulated array on each batch or each draft keystroke. Keep
one active result per surface, bounded outstanding requests and no unbounded detached
assembly queue. Navigation/options may stage **preparation** but preserve the complete
native select and current option semantics at ready; prefix choices must not silently
become the complete eligible set. Hidden options still have construction costs.
Transient loading/error feedback in existing surfaces is expected; a new picker,
partial-options interaction or altered reachability needs user/design review first.

## Coherence, current selection and lifetime

Envelope concept: `{projectId, incarnation, revision, workerGeneration,
resultGeneration, requestId, entityKind?, entityId?, section?}`. Opaque IDs are exact
strings scoped by project/kind; empty/whitespace differs from absent. Long identity
framing may use a worker handle but its resolved exact identity remains mandatory.
After **every await**, before assembly publication **and** before mount, compare with
live active project/read revision/worker/result/request/selected identity/section.
Also compare draft/source-mode/view/scale generation for derived draft responses.
Checking only the values captured when sending the request proves nothing about
later navigation. Old responses may not steal focus, replace current rows, reset
inputs or update another inspector/header. Preserve selected-outside-filter behavior.

Worker keeps one loaded coherent snapshot plus derived indexes/result identity lists
for its revision; these are disposable read material, never independent persistence
or a separately synchronized truth. Invalidate on accepted revision change, project
close, worker replacement and obsolete query/section. Keep only active read results
and explicitly needed current selection; clear old text assemblies/DOM blocks and
worker handles when their owner ends. A retained/stale same-project view may remain
only with its original revision/status visible, never masquerading as current.
Worker lifetime caches must not accumulate every past query, draft preview or project.
Read cancellation stops/discards passive work only. Mutation attempts/raw input and
safe-exit fences retain the agreed independent lifecycle; no command replay follows.

## Small next handoff and evidence gate

| Check | Pre-implementation feasibility subset after separate authorization | Actual Stage B obligation |
| --- | --- | --- |
| T-P1 projection/size | Worst admitted font-family token yields tiny kind row without raw payload; selected editor has no project arrays. Measure encoded/decoded frame sizes and exact reassembly of long label/ID/color fields. | Preserve full existing row/inspector content and exact editor controls; no incidental graph clone per selection/keystroke. |
| T-P2 domain/membership | Real domain aliases/cycles/missing paths, cross-kind/empty IDs and colliding labels across batch boundaries; search/group includes matches beyond first batch; all 2,000 groups/eligible native options and All content reachable. | Full labels, options, diagnostics and ordinary repair eligibility stay correct after mutations/reopening. |
| T-P3 live races/lifetime | Delay worker messages, change selection/query/revision/project/draft mode, then release. Replace worker with old reply queued; change during exact-text assembly. No wrong publication; old cache/DOM growth released over repeated switches. | Real React/header/focus/form state and unknown-command recovery, not predicate-only assertions. |
| T-P4 heavy sections/task evidence | Independent resolved/trace/raw requests; real guarded DAG/Decimal work. Correct task instrumentation must catch known 191.793 ms Layout and fail closed on missing evidence before positive qualification. | Complete exact detail interaction chosen by user; native selection/Find/keyboard/AT/zoom and all actual DOM/layout/paint costs. |

Recommend approve the projection direction and proposed transport targets, then combine
a bounded corrected G-01 feasibility handoff with the **user-chosen** exact-detail
direction. Do not launch another broad research stream or rerun the known failure
unchanged. No prototype edit or new experiment follows from this assessment alone.
Retain the unchanged 100 ms main-thread target, all 100/1,000/maximum fixtures and
F-4/5 limits; Safari stress still requires safe supervision. HTTPS/worker reviews
remain scoped evidence; this adds no support, performance or production acceptance.
Checks here are current-source/evidence/prose/local-link/manifest/whitespace review,
not browser/tests/build execution or independent review of production implementation.

## Reviewed comparison boundary evidence — 10 November 2026

The [isolated handoff](../../output/increment-007-detail-projection-comparison/comparison-summary.md)
and [independent recheck](../../output/increment-007-detail-projection-comparison/independent-review.md)
record narrower display-only row payloads, framed long data and real application
namespace/label/selected-literal/reference subsets. The raw font-family row is 144
logical bytes rather than its multi-million-unit definition. Observed raw text frames
remain bounded. These facts do **not** qualify general whole-message byte enforcement,
all identities/derived-work/lifetime/fencing surfaces, complete list/inspector fidelity
or all P-R1–5 behavior. Both large raw-control openings failed the unchanged task gate.

A foreign-renderer coverage defect was repaired offline and independently closed;
seven focused tests and strict typecheck pass. The [corrected manifest](../../output/increment-007-detail-projection-comparison/manifest-r1.json)
identifies current research/evidence, preserving originals and known failures. Larger
native/scale/Safari and other unexecuted cases remain explicit. No new transport cap,
raw control, production read API or implementation agreement is adopted by this result.
