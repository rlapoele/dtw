# Increment 007 — ordinary rendering and native-source access disposition

**Analyst recommendation for user review — 10 November 2026. No choice adopted.**
Baseline: clean `f5d7af86ea63d9a96ff4a87d52fafdfc34c09571`. This assessment follows
the [reviewed E-4 result](../../output/increment-007-e4-qualification/independent-review.md),
not its earlier execution authorization. Contract remains Draft / Not started.

Recommend one bounded designer assessment of description wrapping and practical
native source selection, while retaining the current list, complete inspector and
E-1 document-text source. Separately diagnose Safari's small activation failure.
Do not resume the larger qualification sequence until these concrete blockers have
a reviewed disposition. No new viewer, budget amendment or production change follows.

## What the evidence establishes

The [frozen report](../../output/increment-007-e4-qualification/report.md) and
[manifest](../../output/increment-007-e4-qualification/manifest.json), SHA-256
`06a26513c91b758c08d7157f8ba105d825a3966323db6f1f17edf1569f945cee`,
identify the evidence used here. The separate review verified that snapshot; this
assessment does not claim another independent review or rerun.

| Observation | Supported conclusion / limit |
| --- | --- |
| First 65,535-pretty-unit fixture load: RunTask **1,797.093 ms**, nested Layout **1,794.751 ms**, before source opening. | A genuine ordinary **100 ms** failure. These are whole-task and nested costs, not durations to add. Exceptional **250 ms** opening/native actions remain unmeasured. |
| The boundary fixture pads an admitted description with an unbroken `x` run. Production TokenList supplies the full string to both responsive description variants, using `line-clamp-2 whitespace-pre-wrap wrap-anywhere`. | Existing visual clamping does not remove the full text from layout input. No particular CSS property, browser algorithm or complexity class has been established as the cause. |
| Cmd+A after focusing the pre selected document content; clipboard text equalled neither selected text nor exact source. | That procedure fails native exact-source qualification. It does not prove that source-scoped native selection/copy is impossible. Scoped selection and clipboard serialization are separate obligations. |
| Safari small disclosure became open, without Preparing, read dispatch or source metrics. | Activation/read dispatch is incomplete. No worker/CSP defect, React defect or harmless automation limitation has been established. |
| Same-pending-command Safari Close timed out; finite worker finished naturally at 12,003 ms, lock witness at 12,006 ms. | This supervisor failed. A queued close or natural completion is not preemption. No Safari defensive escalation is permitted from this result. |

The corrected 562-unit Chrome openings and narrow draft/Retry/publication controls
remain useful positive evidence. They establish neither large-source access nor
whole projections, browser support or product readiness.

## Three concrete choices for the next handoff

### R-1 — description layout: assess one content-preserving wrapping candidate

**Recommended:** ask the designer to assess changing description wrapping from
`overflow-wrap: anywhere` to a `word-break: break-all` candidate, retaining whitespace,
exact text, the existing two-line list preview in both responsive variants, and the
complete unclipped inspector description. Use the existing surfaces; do not add a
description viewer or alter list membership, names, values, swatches or controls.

This is an **unverified layout hypothesis**, not a prescribed fix. The full string
would remain in the DOM and native text access; changing break opportunities might
change layout cost, but no performance benefit is established. It also changes word
breaks in ordinary prose. The designer must judge that reading tradeoff with normal
prose, explicit newlines, long unbroken text and non-Latin text before proposing it
to the user. The inspector currently also uses `whitespace-pre-wrap wrap-anywhere`:
fixing a list preview alone cannot qualify selecting that same long description.
No general wrapping migration of names, identities, values or other text is proposed.

**Meaningful alternative:** preserve current wrapping and keep this gate blocked.
That preserves typography but does not resolve the measured failure. A different
description layout may be proposed later through the designer/user loop; it is not
an automatic second experiment. Transport framing, worker work and yielding between
rows cannot by themselves bound the browser's final layout of one intact text node.

**Agreement required:** any changed wrapping behavior needs identified designer/user
review before qualification/adoption. No authored cap, shortened DOM text, new
clipping, paging, hidden content or relaxed ordinary gate is authorized here.

### R-2 — exact native access: keep the pre and try a source-scoped native procedure

**Recommended:** retain the agreed E-1 no-wrap, two-axis source pre. Assess a concrete
native procedure: click immediately before its first source character, scroll its
own viewport to the end without clicking other document text, then Shift-click
immediately after its last source character; invoke native Cmd+C. This is a proposed
procedure to verify in each engine, **not known cross-browser behavior**. If native
selection cannot be extended this way, record failure rather than substituting a
scripted DOM Range or claiming source focus makes Cmd+A local.

The designer should assess whether users can discover and perform that operation
without fragile pixel targeting, and retain keyboard/AT access as explicit gates.
Pointer success alone cannot close them. A normal browser-supported keyboard method
may qualify only after its actual source scope is observed on that engine; none is
assumed here. Do not add Select All/Copy controls or alter clipboard behavior as an
implementation shortcut.

**Acceptance:** separately require exact full-source selection scope, unit count/text
equality, then actual native copy-event-correlated clipboard equality with the same
complete applied source. No trimming, newline normalization, document wrapper text
or repaired clipboard value may manufacture equality. Qualify native Find at the
beginning/middle/end separately, with actual reveal, scroll boundaries, focus/exit,
actual 200% zoom and read-only AT reachability under the existing E gates.

**Meaningful alternative:** if this is unusable or fails exact native access, return
to the designer/user to reconsider E-1 explicitly. The previously tested textarea
has neither large native-access qualification nor a proven performance advantage;
it is not an approved fallback. Keeping the current pre with this gate open is also
honest, but cannot count as full-source support. No third viewer or file-only path
is selected by this assessment.

**Agreement required:** review any material interaction/instruction change before
adoption. This document creates **no clipboard authority**. The prior synthetic-copy
approval applied only to the completed qualification run; any later clipboard check
needs fresh scoped authorization, without reading, saving or restoring unrelated
clipboard content.

### R-3 — Safari: separate small activation diagnosis from defensive supervision

**Recommended:** a later, separately authorized small-fixture diagnosis should observe
native disclosure activation, native toggle event, React handler entry, Preparing,
worker request and response publication in order. Compare actual pointer and keyboard
activation with the same small source; do not programmatically open it and call that
a native pass. Fix an identified delivery defect within the existing disclosure
interaction if evidence supports one. A materially different control returns to
designer/user review. Do not blame the worker or replace the source view by inference.

Keep Safari defensive cases blocked. The concrete safe alternative to the failed
shared-host control path is a **genuinely disposable isolated OS/browser environment**
with an independently demonstrated own-process supervisor while the same runner
command remains pending. Establishing that environment needs a separate explicit
setup decision; this assessment authorizes no setup, installation, process kill or
new supervisor experiment. Retain the existing finite probe and stop criteria from
the [gap plan](007-qualification-gap-plan.md#g-02--finite-safari-supervisor-probe).

**Meaningful alternative:** keep Safari gates unresolved and pause the affected work
until a safe environment is available. Neither dropping Safari, deferring its gate
nor treating prior naturally completed work as safely supervised is adopted.

## Finite next step and stopping point

1. **User choice now:** accept the R-1/R-2 direction for one designer assessment,
   or retain the existing design and its open gates. The designer first returns a
   concrete proposal/tradeoffs; any prototype edit follows the established approval
   sequence. R-3 small source diagnosis is a separate possible authorization, not a
   reason to begin larger work. No automatic V5 or viewer comparison follows.
2. **Only after the identified proposal is reviewed and execution separately
   authorized:** perform one isolated repair/verification batch, developer then fresh
   reviewer. Start with small fixtures and the existing failed ordinary description
   fixture with the selected change; measure load and selection/complete-inspector
   layout separately at **100 ms**. Test the existing wide/compact two-line previews,
   full exact description, ordinary prose/newlines and preserved drafts/controls.
   Missing target-renderer whole-task coverage is inconclusive. A genuine failure
   stops that case; no repeated unchanged failure or automatic CSS alternative.
3. Qualify the proposed native selection/copy procedure on small source before any
   large-source access. A native scope/equality failure stops that path. Safari
   activation must dispatch/read correctly on small source before source qualification;
   safe supervision must be proven before any Safari defensive work. No larger case
   is used to diagnose either small failure.
4. Only if those prerequisites pass, resume the **already agreed** E-4 fixtures and
   action gates, without adding a new research program: 65,535/65,536 ordinary and
   65,537 exceptional serialized-unit boundaries, escape crossing, long editable color
   and admitted large-source intersections. Preserve warm-up/20 samples where safely
   reached, per-task/per-action maxima, actual native evidence and first-failure stop
   rules. A partial pass closes only its stated subset; all unrun cases stay open.

No change is proposed to the [Draft AC-1–24](007-local-retention-and-backup.md),
[E-1–E-4](007-exceptional-detail-policy-and-performance-proposal.md),
[P-R1–5](007-read-projection-boundary-assessment.md), P/S/F/B policies, authored
admission budgets, complete list/inspector or both-engine scope. Ordinary remains
100 ms; only the agreed explicit exceptional source actions may use 250 ms per
whole renderer task and 5,000 ms per complete action. Full projections, command
fencing, lifetime/contention, other host gates and Stage B remain open. Final
contract/design agreement and implementation authorization are separate decisions.

## Basis, assumptions and verification limits

Read-only basis: repository/analyst role instructions; current handoff; project
vision/concept/principles/architecture/visual direction/presentation conventions/open
questions; the Draft, E policy, V4 analyst review, read-projection assessment, gap and
scheduling/browser plans; frozen E-4 report/review/manifest and relevant saved evidence;
production TokenList/Editor and the isolated source disclosure, fixture and runner code.
V4 supplements V3 revision2. Earlier plan wording is interpreted through the later
reviewed E-4 chronology, not as renewed authorization.

Assumptions remain explicit: changing description break policy might help; scoped
native endpoint selection might work and might be usable; Safari activation may be
repairable within the current control. None is an observed fix. The user must judge
the typography/selection tradeoff; qualified native behavior must supply the answer.

Only this analyst document was created. Checks were source/evidence/prose and local
link review; no tests/build, source execution, browser/clipboard operation, experiments,
network/setup, production/prototype/frozen-evidence edits, staging, commit or push.

Suggested focused human-owned commit: `docs: propose rendering and native-access dispositions`.
