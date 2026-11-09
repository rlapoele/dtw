# Increment 007: V3 renewed analyst review

**9 November 2026 — design consistency review; one required finding remains.**
The user approved V3 for renewed analyst review and explicitly accepted simplified
prototype controls/content while requiring preservation of the production baseline.
This review updates the [Draft contract](007-local-retention-and-backup.md); it is
not final contract/design agreement or production implementation authorization.

## Reviewed snapshot and evidence boundaries

- Base `50d9f67d714a71536ae57dcfe5a82dea5c7114cc` plus frozen uncommitted V3.
  [Manifest](../../output/increment-007-prototype-v3/manifest.json) SHA-256:
  `92ac2ca978c5f7549fdb3699c03232f0e2206de09a384f352486a8ca9fcb0923`.
  Independently checked all ten listed SHA-256 hashes and byte sizes: match.
  V1/V2 each still match their six-file frozen manifests.
- Expected behavior derived first from AGENTS/workflow, project direction,
  [architecture](../project/architecture.md), [presentation conventions](../project/presentation-conventions.md),
  [P-1–P-4](007-backup-coverage-and-restore-policy-proposal.md),
  [S-1–S-6](007-storage-acknowledgement-and-concurrency-proposal.md),
  [F-1–F-5](007-format-decoder-and-resource-proposal.md), Draft AC-1–19 and the
  [approved assessment direction](007-post-qualification-design-assessment.md).
  Then inspected frozen [V3 notes/source](../../prototypes/increment-007-v3/DESIGN-V3.md),
  current production sources and Increment 005/006 agreements.
- [Coordinator observations](../../output/increment-007-prototype-v3/observations.md)
  attribute passing final isolated TypeScript/build checks (724 modules). Earlier
  JPEG/sample evidence predates the final composition and does not verify it.
  Analyst ran no browser/app tests/builds and touched no user session.
- Stage A [report](../../output/increment-007-stage-a/report.md) and
  [independent review](../../output/increment-007-stage-a/independent-review.md) are
  attributed mechanism evidence, not this analyst's execution or product acceptance.

## Assessment and required finding

V3 supplies the missing resource/refusal, exact recovered-input review, unsafe-exit
and all-content inspection specimens without adding storage settings, general repair
or history. Declared simplified shell/fixtures are acceptable for this exploratory
review. Production baseline preservation is a binding Draft requirement, not a
requirement to reproduce the complete production UI in the prototype.

### V3-R1 — required: uncertain mutation result traps the local token form

**Affected:** AC-5/8/18 and new AC-23. Source scenario:

1. Select **Interrupted · result check fails** (also relevant to later-confirmed
   accepted/rejected scenarios), open Studio and choose **New token** in Supplement.
2. Enter fields and submit. `main.tsx:51–61` changes root state to unknown while the
   local Supplement form remains open until its acceptance callback.
3. `Supplement.tsx:98–108` renders no **Check retained result** or **Review before
   leaving** inside that modal. Cancel is disabled by `uncertain`, Create by
   `writeBlocked`; Escape calls `ask()`, which returns while uncertain (`51`).
   Root recovery controls (`main.tsx:69`) remain behind modal focus containment.

The local form therefore has no reachable product recovery/departure route while
unknown. The root's separate project/restore dialogs include recovery controls,
but those are not the Supplement token dialog. This contradicts the assessment's
requirement to keep recovery/check feedback reachable inside an already-open form.

**Disposition:** unresolved; required bounded design correction before final
agreement. Expose check/failed-check and guarded safe-departure actions inside the
active mutation dialog, preserving its inputs and safe focus return. Reuse the
same one attempt, don't add blind resubmit or claim Leave cancels an issued write.
Return any material interaction revision to the user before renewed analyst review.
No prototype edits were made and no runtime reproduction is claimed; this is a
concrete source-traced design integration finding, not waived by shell simplification.

## Other scope and state dispositions

| Area | V3 assessment | Required production/verification consequence |
| --- | --- | --- |
| Admission/resource refusal | Incoming, ordinary edit/form, capacity, retained record and whole-backup refusal are separate (`main.tsx:53/72/80/102`; Supplement apply/form). Small scenario counts are explicitly simulated. | AC-21 binds whole-candidate/output-wrapper admission, exact input retention, meaningful units and no partial backup. Actual resource enforcement remains separate. |
| Derived work and report display | Costly AST shows unavailable derivation, authored-value navigation and preserved backup; incomplete report disclaims all-clear (Supplement `78/87`; BaselineInspector resolved panel). | Do not run costly resolution simply to show a refusal. Complete bounded structural checks remain separate from display limits; unchanged source/backup eligibility is mandatory. |
| Recovered edits/forms | Previous/current/input comparison, explicit Review→Reapply and same-parent/group-ID form review are represented (Supplement `54–71/89–90/102–103`). Removed/ineligible original input stays selectable read-only. | AC-22 requires revalidation/CAS at actual acceptance, exact both-mode state and original target identity. Hardcoded old/current sample labels are not a general comparison engine. |
| Unknown failed check/exit | Root review distinguishes safe versus not-yet-safe exit, warns of possible prior acceptance and no replay (`main.tsx:63–69/104–105`). | AC-23 makes proof/fencing, one-time departure and suppression of late publication application responsibilities; external safety checkbox is not production evidence. V3-R1 still blocks the local form route. |
| All content | Always-secondary navigation and kind+ID selection include empty/unreachable/cyclic groups, empty project/token/group identities and component notice (Supplement `12/71–89`; specimens). | AC-24 requires every admitted record, truthful raw canonical inspection and absence separate from opaque IDs. Tiny UI-shaped fixtures select no canonical schema; no move/delete/progressive repair is added. |
| Production fidelity | Final composition imports production TokenList/ColorFields/session/preview/readback through a small fixture adapter; inspector retains applied/draft specimens and descriptions/type/layer/role. | AC-20 preserves baseline behavior/data/actions in the next production version. Imported components and passing source checks do not certify final runtime parity or permit adopting sample restrictions. |
| Keyboard/responsive behavior | Source includes focus targets/guards, native inputs, modal primitives and bounded wrapping; no final-composition browser evidence. | AC-18/20 still need actual runtime checks, actual zoom and measured viewports. Earlier 582px evidence cannot become 390px/320px coverage. |

Prototype-specific policies must not migrate into production: single-choice fixtures,
restricted target filtering, fake timer acknowledgement, UI-shaped JSON downloads,
fixed resource observations, string sentinels, simplified group actions or new Cancel
behavior are interaction machinery. Production operations retain the agreed exact
values, names/IDs, metadata, eligible repairs and Apply/Cancel/draft semantics.
The read-only fixture adapter performs synchronous small domain inspections; it
neither proves coherent async production reads nor selects render-time storage access.

## Production preservation expectation

Inspected [TokenList](../../src/presentation/TokenList.tsx),
[ColorFields](../../src/presentation/ColorFields.tsx),
[Editor](../../src/presentation/Editor.tsx), [session](../../src/presentation/session.ts)
and owning [Increment 005](005-token-details-and-color-components.md)/
[Increment 006](006-integer-rgb-and-identity-presentation.md).

Next production version preserves row swatches, collision-safe names/paths, existing
layer/type labels, exact authored literal/reference summaries and responsive description
column/preview; inspector descriptions, metadata/semantic role and technical data;
all three color component fields/sliders plus independent exact alpha/slider; five
view spaces and both sRGB entry scales; untouched-channel exactness and approximation
indications; applied/draft previews/tabs/traces; search/group/filter/creation/rename
and existing navigation actions. This does not invent a new role column or metadata
editor. Keyboard/focus, modal/departure, pane/scroll and responsive behavior remain
constrained by prior agreements while integrating new asynchronous states.

## Readiness and remaining decisions

Policies D-2/D-3, S-1–S-6 and F-1–F-5 are agreed; do not reopen them through stale
“unselected storage/schema” wording. V3 approval is for analyst review, not final
design agreement. Draft remains **Draft / Not started**.

1. Correct V3-R1 and return the identified material revision to the user. Preservation
   of production controls/content is now explicit AC-20, independent of prototype scope.
2. Settle bounded production scheduling/placement. Stage A observed maximum synchronous
   codec tasks of 190–229 ms against the 100 ms target; a Chrome worker trial is an
   option, not selected/qualified production architecture. Preserve host-independent
   semantics and exact guards; no automatic worker adoption or target weakening.
3. Define the bounded supported-build/remaining qualification handoff. Native Chrome
   and Safari subsets and followup capacity serialization are evidence; Safari normal-
   profile retention/file/worker/max stress, lifecycle/bfcache, deployed HTTPS, integrated
   evaluator/metadata/command/draft/replacement paths and Stage B remain incomplete.
   This is not a requirement to pass product integration before implementation exists;
   distinguish pre-implementation mechanism decisions from later acceptance evidence.
4. Identify the resulting contract/design for final user agreement and obtain separate
   implementation authorization. No developer/reviewer phase starts with this review.

The [Draft](007-local-retention-and-backup.md) preserves AC-1–19 and adds AC-20–24
for explicit baseline parity and the V3 state obligations. No policy or criterion is
relaxed to fit the specimen. Documentation checks are hash/byte identity, source/
prose/link review and `git diff --check`; no fresh application verification is claimed.

## Revision 2 recheck — 9 November 2026

**V3-R1 closed for this design review. No remaining blocking design finding in the
reviewed flows; full production parity is not certified.** The user approved this
identified correction for renewed analyst review only. The original review/finding
above remains historical; final contract/design agreement and implementation
remain pending.

Reviewed clean HEAD `2805b0cb702f86177b3010710ebf06e9c85187c2`, containing the
[revision-2 manifest](../../output/increment-007-prototype-v3/revision-2/manifest.json)
(base `52e8009`, ten files). Manifest SHA-256:
`fd493c34f89bd473afe58f406f23c8c9e7b89a69b0ff5ca1a8187566b5d4c8c6`.
Independently verified all ten hashes and byte sizes; V1/V2 original hashes match.
Revision-2 [observations](../../output/increment-007-prototype-v3/revision-2/observations.md)
and images are coordinator evidence, not analyst execution. They cover local-form
recovery/failed check, safe/unsafe exit, accepted/rejected outcomes and representative
list/inspector paths, plus isolated type/build checks. No analyst browser/test/build
run or user-tab operation occurred.

### V3-R1 source recheck and disposition

`main.tsx:102` passes the root attempt's `recoveryMessage`, `exitSafe`, `onCheck`
and `onLeave` into Supplement. Its local dialog (`Supplement.tsx:100–110`) now
renders Check retained result and Review before leaving within the active focus
boundary. Failed checks reuse root feedback without resetting form state. Duplicate
Create/Cancel stay blocked while unknown; checking invokes the existing root
reconciliation, not a new command or creation ID.

Departure review replaces local dialog content, keeps the live form state, initially
focuses Stay here (`49/101–103`), and Escape/Stay returns to the preserved name field
through the existing focus request. Unsafe Leave is disabled; safe Leave invokes
root `leaveUnknown`, which clears the simulated pending callback and returns to
Projects without resubmission. Known acceptance publishes once and invokes the
original form-completion callback; known rejection does not invoke it, retains the
fields and enables correction only after unknown clears (`main.tsx:45–65`, Supplement
submit callback). Coordinator observations support these selected paths, including
exact whitespace/multiline inputs. These simulated callback semantics do not prove
actual cancellation fencing, late transaction handling or durable concurrency safety.

### Independent inspector content comparison

Compared the entire current production Editor, ColorFields, App-owned feedback,
TokenList, session and Increment 005/006 requirements to revision-2 source, not just
the designer's matrix. Core inspector sections/controls are present:

| Production content | Revision-2 source disposition / evidence limit |
| --- | --- |
| Header Applied/Draft context; heading/description/type/layer/eligibility | Present in BaselineInspector `35–41`; authored/resolved tab changes preserve appropriate Applied context. Header eligibility/unavailable branches and absent-description fallback are not fully equivalent; see C-1 below. |
| Three exact component inputs/eligible sliders, alpha input/slider, five views, normalized/integer RGB scale and approximation notes | Production ColorFields/session reused. Coordinator exercised representative passive view/scale exactness. No exhaustive per-channel, unavailable-range, powerless/missing or numerical edge-case parity claim. |
| Literal/reference source controls, target choices/note, preview, Value/Draft status, Apply/Cancel/completion | Present (`42–49` and supplied actions). Pending/unknown guards add the reviewed async state. Ordinary source-switch dirty behavior/Cancel remain prototype composition differences, not replacements for production semantics; validation association caveat C-2 remains. |
| Currently applied; metadata regeneration/role/parent; raw authored/identity details | Present (`51–52`); group labels derive identity-safe names with exact IDs in details. Component/removal recovery supplements inspection. UI-shaped specimen backup still does not define canonical codec. |
| Authored/Resolved & trace tabs; Applied value badge; resolved/unresolved data/specimen; trace IDs/targets and diagnostics | Present (`37–38/54`), with separate resource-unavailable state. Representative alias trace observed; complete diagnostic/eligibility branches not runtime-certified. |
| Separate regeneration footer and list content | Footer present (`56`); production TokenList still supplies swatches, responsive descriptions, layer/type, names and authored summaries. Source presence does not prove production scrolling/layout or full shell/navigation parity. |

Two concrete nonblocking **specimen fidelity caveats**, retained as production
AC-18/20 obligations rather than silently waived:

- **C-1 — ordinary missing-data/header fallbacks:** production Editor uses
  `token.description ?? 'No description'`; BaselineInspector `36` uses removed-input
  wording instead. Its fixture Token requires a description string, so it does not
  actually demonstrate the ordinary existing-token/absent-description case. Likewise,
  App gates header specimens on eligibility and shows Unavailable/Inspection only/
  Select a token; BaselineInspector always renders its specimen header. Production
  must retain truthful no-description and appropriate eligibility/unavailable/empty-
  selection feedback; do not apply removed-target recovery wording to existing data.
- **C-2 — candidate-error association:** Supplement `95` renders invalid draft text
  under `draft-error`, while ColorFields/reference controls describe `editor-error`
  and BaselineInspector `47` fills that target only for its separate field/view error.
  Thus presence of original field-error UI does not establish associated candidate
  errors. Production must associate each invalid-draft/error with its actual controls
  and preserve accessible status/focus; test normalized and byte invalid input and
  reference/candidate failure paths explicitly.

These caveats do not recreate the modal trap or require full exploratory-shell
parity. They prevent claiming the whole original inspector is behaviorally identical.
The Draft now names these fallback/error obligations without changing AC IDs or
weakening preserved production behavior. No prototype correction is made here.

### Current readiness

The required V3-R1 correction has been reviewed; no new material flow contradiction
was found. Remaining scheduling/placement and bounded support/qualification handoff
from the original review stay open. Stage A remains partial and the worker option
unselected; implementation/Stage B, full accessibility/responsive/parity checks and
final contract/design agreement are not inferred from this closure. All P/S/F policy
agreements, Draft / Not started and the separate implementation gate are preserved.
