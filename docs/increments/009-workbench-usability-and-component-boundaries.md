# Increment 009: Workbench usability and component boundaries

- Contract status: Agreed
- Delivery status: Partially completed
- Prepared: 13 November 2026
- Agreement: on 13 November 2026 the user agreed the amended Increment 009 contract, naming policy and combined V1/V2 design and explicitly authorized implementation through the developer and independent reviewer workflow, within the shared verification budget. Staging, committing and pushing remain with the user.
- References: [vision](../project/vision.md), [product concept](../project/product-concept.md), [principles](../project/principles.md), [architecture](../project/architecture.md), [visual direction](../project/visual-direction.md), [presentation conventions](../project/presentation-conventions.md), [open questions](../planning/open-questions.md), [Increment 008](008-react-state-and-workbench-composition.md), [agent workflow](../workflow/agent-roles.md).

## Outcome

Make existing browsing and inspection easier to understand: controls match the
active view, routine information is readable, and the color editor uses space
more effectively. Align React ownership with these functional blocks while
preserving authored data, draft sessions and retained-command guarantees. Prevent
new ambiguous namespace paths through deterministic authoring validation while
keeping existing conflicting or unavailable-path content accessible.

This is a bounded usability, namespace-validation and maintenance increment; the
amendment adds no editing surface or replacement visual design.

## Review basis and functional blocks

The 13 November review inspected rendered normal desktop states before examining
React composition: project entry, empty workbench, token/group creation, literal
and reference editing, resolution, All content, group inspection and diagnostics.
Sparse synthetic data was used. Restore and exceptional recovery were mapped from
source, not visually audited; responsive and accessibility qualification were not
performed. This proposal records the relevant observations durably without making
the temporary local screenshot gallery an implementation dependency.

| Functional block | Current owner | Proposed treatment |
| --- | --- | --- |
| Project catalogue and creation | App / useProjects | Focused copy changes; retain ownership |
| Header and backup entry | WorkbenchHeader / Workbench | Keep rendering separate; extract cohesive backup coordination |
| Navigation and browser context | ProjectNavigation / Workbench | One explicit browser-view state, separate from inspected selection |
| Search and token catalogue | TokenBrowser / ProjectedTokenList | View-specific toolbar and accurate empty-state guidance |
| Complete content inventory | AllContent | Retain complete membership access; remove irrelevant controls |
| Inspector header and previews | WorkbenchInspector / EditableTokenInspector | Contextual naming; preserve one shared editor session |
| Literal/reference editing | EditorFields / ColorFields / useTokenEditor | Compact layout and meaningful editor sections |
| Resolution, metadata and group details | EditorFields / WorkbenchInspector | Readable summaries with disclosed technical details |
| Exact source | ExactSource | Preserve revision-aware, lazy/bounded access |
| Creation, diagnostics, departure, restore | Existing components and hooks | Retain workflow authority and guarantees |
| Lifecycle and status | Workbench | Extract lifecycle coordination; keep small footer inline |

Observed issues: All content inherits color search and the previously visited
group's rename action/highlight; inspection foregrounds JSON/UUIDs and empty `[]`;
the literal editor places substantial content above the channels; routine copy
includes slogans, implementation language and inaccurate root-creation guidance
inside an empty group. These are the scope basis, not evidence for a global redesign.

## Scope

Included:

- Coherent navigation, headings and controls for All tokens, a group and All content.
- Readable group/resolved-value/trace summaries and meaningful empty diagnostics.
- Contextual inspector naming, focused editor spacing and task-specific copy.
- Cohesive lifecycle and backup coordination extracted from Workbench; a shared
  renderer file-admission helper for both backup entry points.
- Focused editor sections with narrow props and one shared editor session.
- Project-scoped path uniqueness across namespace groups and all tokens, regardless
  of type or definition completeness, enforced for existing creation and group
  rename operations, including affected descendant paths.
- Continued opening, inspection, exact backup and restore of supported legacy
  conflicting data; identity-safe access for ambiguous or unavailable paths.
- Whitespace removal throughout newly authored namespace names, lowercasing and
  NFC preparation, previewed before submission; caseless collision comparison
  also covers preserved legacy names without rewriting them.

Excluded: generalized inventory search, global redesign, new dependencies/stores/
router, domain/application/worker behavior changes beyond the bounded namespace
validation amendment, storage or backup formats,
resource limits, new editing capabilities (including token rename/move UI), general
progressive repair, history, import/export, privacy/auth,
full PWA/offline delivery, Electron and renewed qualification of Increments 007/008.

## Design direction V1 — selected for mockups

The separate designer recommends retaining the neutral Precision three-pane
workbench and improving context, hierarchy and density. The user selected this
direction for mockups on 13 November 2026; it is not final design agreement or
implementation authorization.

1. **Explicit browser context.** Use “All tokens” consistently in navigation and
   heading. Exactly one navigation item is active. The inspected token/group is
   independent of the browser view; changing views does not discard its draft.
2. **Complete All content inventory.** Keep its library entry and progressive,
   native membership rendering. Remove color search and Rename group from this
   view. Preserve the catalogue search query for returning to token browsing.
   Suggested explanation: “Every group and token, including items outside the
   group tree.” Keep identity disambiguation and access to every entry; no
   virtualization or new filter semantics.
3. **Contextual inspection.** Title the pane “Inspector”; selected content says
   “Color token” or “Group · Read only”. Groups lead with name/readable path and an
   explicit unavailable-path state where needed. Project/group identities and
   structured path detail remain accessible in “Identity and path details”.
4. **Readable resolution.** Lead with specimen, color-space name, named channels
   and alpha, retaining full available values without silently rounding them.
   Trace steps lead with readable paths and reference relationships; identities
   remain available. Empty diagnostics say “No resolution issues.” Unresolved
   outcomes and nonempty diagnostics remain prominent. Raw derived resolution
   data has a separate disclosure from the existing “All authored data” source.
5. **Spacing-first editor compaction.** Reduce repeated heading/help spacing and
   gaps before channel controls. Keep Alpha in the normal form and persistent
   Apply/Cancel actions. Contextual help may hold explanatory guidance, never
   essential errors, baseline review, warnings or recovery actions.
6. **Task-specific copy.** Remove the central/sidebar slogans. Empty-group guidance
   refers to creating in that group. Reference guidance explains use of the whole
   selected color value. Preserve clear browser-local applied retention,
   session-only drafts, backup limitations and exceptional-state instructions.

Meaningful alternatives considered: moving All content under diagnostics reduces
routine navigation but hides complete discovery; keeping JSON expanded beside
summaries adds visual weight; widening the inspector changes the pane balance.
V1 recommends keeping All content discoverable, disclosing technical detail and
trying spacing changes before altering pane widths. The user selected this direction
for mockups; concrete presentation remains subject to review.

### Selected context transitions for mockups

- Group view: creation defaults to that group; rename targets that group.
- All tokens and All content: creation defaults visibly to Project root, never the
  last visited group. Missing original groups must not silently retarget a form.
- All content entry preserves inspected selection and unfinished editor input.
- Show selected token returns to All tokens and clears its search, preserving the
  existing reveal purpose. Choosing a different entity uses the existing guard.

## Architecture proposal

- Replace overlapping `group`/`allContent` state with a discriminated browser-view
  union. Derive navigation, heading, toolbar and creation defaults from it; keep
  inspected selection and editor lifetime separate.
- TokenBrowser composes view-specific controls/content. ProjectNavigation receives
  the active view rather than inferring it from group alone.
- Extract lifecycle listeners/recovery coordination and backup selection/staging/
  download coordination into cohesive owners with explicit callbacks. Keep
  authoring command, readback, creation and restore authority from Increment 008;
  do not create a second command owner or one replacement omnibus controller.
- Share the existing 16,777,216-byte renderer admission rule before file reading;
  worker-side validation remains authoritative and unchanged.
- Extract meaningful sections such as ReferenceFields, TokenMetadata,
  ResolvedTokenPanel and GroupInspector, with focused data/actions. Names are
  illustrative. Keep useTokenEditor above header and fields, with no duplicated
  drafts, revision-driven editor remount or callback-driven command reissuance.
- Reuse existing controls, semantic theme utilities, shared Icon and source access.
  Extraction serves responsibility boundaries, not a file-length target.

- Put deterministic namespace comparison and collision diagnostics in the domain;
  application operations enforce them against the current project before commit.
  Presentation may explain a rejection but must not be the enforcement boundary.
- Apply the identified naming policy deterministically at the authoring boundary,
  not only in form code. Keep prepared stored names separate from derived caseless
  comparison keys. Never persist comparison keys as names or normalize legacy
  snapshots during reads, backup or restore. Use the same comparison for every
  ancestor segment, including unmodified legacy ancestors.
- Compare derived arrays of local-name segments, never rendered/joined path text,
  across groups and tokens. Creation checks all existing token types, including
  name-only and typed-but-unassigned members; group rename includes descendants.
  Same short names in different groups are permitted when full paths differ.
- Separate legacy collision reporting/readability from command admissibility.
  Evaluate newly introduced collisions and additions to existing collisions using
  changed entities/paths and affected descendants. Do not reject an otherwise
  allowed command solely because an unrelated collision already existed, nor
  ignore a descendant collision introduced through renamed ancestry. Existing
  structural/reference checks and other command safety remain intact; this is no
  general relaxation or progressive-repair workflow.
- Keep Increment 007's supported-data schema, decode/restore admissibility and exact
  authored names, values, identities and order unchanged. Adding collision
  diagnostics must not accidentally tighten supported load/backup/restore gates.
  Future rename/move capabilities must preserve the same uniqueness invariant;
  adding editing UI or those capabilities is not required by this increment.

## Acceptance criteria

- **AC-1 — Coherent browsing:** exactly one browser view drives desktop/drawer
  navigation, heading, content and controls. All content has no color search,
  group rename action or stale group highlight; returning restores catalogue query.
- **AC-2 — Context transitions:** creation and reveal follow the agreed transitions
  above. View changes preserve inspected selection/raw draft input. Different
  entity selection retains departure protection; missing targets do not retarget.
- **AC-3 — Readable inspection:** primary group/resolution/trace summaries are
  readable. Empty diagnostics use prose. Failures, unknown paths and nonempty
  diagnostics remain explicit. Full identities, raw derived detail and exact
  authored source remain accessible without invented paths or transformed values.
- **AC-4 — Editor layout:** the agreed representative desktop design reduces space
  before channels and improves access to Alpha without hiding it. Actions remain
  readily accessible; compact layouts have no clipped controls or unintended
  horizontal page scrolling. Required guidance and errors remain visible.
- **AC-5 — Copy and naming:** affected instructions match the actual scope, parent
  and action; pane naming covers tokens/groups. Applied retention, draft lifetime
  and independent-backup limitations stay understandable.
- **AC-6 — Component ownership:** source inspection demonstrates the boundaries
  above, narrow section props, one editor session and shared admission behavior.
  No global store, generic workflow framework or duplicated command owner appears.
- **AC-7 — Integrity preservation:** touched paths retain invalid/raw draft text,
  baseline review, write blocking, rejected/unknown/retained outcome distinctions,
  no replay, completion consumption, current-revision restore protection and
  coherent async readback. Existing keys, hidden-pane lifetime, fences and bounded
  membership/source access remain effective.
- **AC-8 — Interaction and presentation:** affected controls/disclosures retain
  labels, keyboard operation, visible focus and error/disabled feedback. Apply,
  Cancel, departure-dialog and drawer focus retain their established behavior.
  Presentation conventions and owned component composition contracts are preserved.

- **AC-9 — Prevent new path ambiguity:** existing group/token creation and group
  rename reject a new duplicate derived segment path within a project across
  groups/tokens, regardless of type or completeness, without mutating retained
  state or losing form input. Renames check affected descendants. Distinct parent
  paths may contain the same short name; independent projects do not conflict.
  No new collision, or added member of an existing collision, is accepted. The
  naming/equality policy must be identified explicitly before implementation.
- **AC-10 — Preserve legacy access:** supported existing colliding/unavailable-path
  data still opens, can be selected and inspected by exact identity, and can be
  backed up/restored without silent rename, merge, stripping, loss or new hard
  rejection. Each ambiguous/unavailable actionable entry is associated with its
  exact identity and truthful context. An otherwise allowed creation/rename is
  not newly blocked by an unrelated unchanged collision; changed paths and
  descendants are checked for new ambiguity while existing command safety stays
  binding. No general repair capability or broader restore admissibility is implied.
- **AC-11 — Prepared namespace names:** new group/token names and explicitly edited
  group names remove the agreed spacing set everywhere, use locale-independent
  lowercase and NFC, and reject an empty prepared result while preserving raw form
  input. Show the prepared name before submission. Case-insensitive segment keys
  determine uniqueness across kinds/types and legacy names under the identified
  policy. Keep accents; do not transliterate or remove diacritics. Group rename
  changes only its explicitly edited name, retaining descendant local names and
  identities. The [Unicode naming definitions](009-naming-policy-proposal.md) were
  explicitly agreed by the user on 13 November 2026.

## Decisions and design review

- Established: Precision direction, presentation conventions, token/retention
  semantics and Increment 008 ownership guarantees, as linked above.
- Analyst: separate agent prepared the draft scope/criteria from source and audit.
  This is requirements drafting, not review of the designer proposal.
- Designer: separate agent supplied the independent V1 text direction above.
- User direction selection: agreed on 13 November 2026; mockup preparation explicitly
  authorized, without application implementation.
- Design artifact: [Design V1 mockups and review notes](../../prototypes/increment-009-v1/DESIGN-V1.md),
  prepared by the separate designer on 13 November 2026. Run instructions are in
  that document. [Screenshot gallery](../../output/increment-009-design-v1/index.html)
  and [rendered observations / artifact snapshot](../../output/increment-009-design-v1/review.md)
  cover group → All content with a preserved draft, literal editor at measured
  1280 × 800 CSS pixels, resolved/unresolved inspection, group details, validation,
  empty-group creation context, reference editing and compact navigation.
  Fixtures illustrate presentation only; they do not implement or qualify the
  proposed production component boundaries, storage, source or command semantics.
- Approval of the identified artifact for analyst review: granted by the user on
  13 November 2026 for Design V1. The [fresh analyst consistency review](009-design-review.md)
  is complete against baseline `044a71c`; this is not final design agreement.
- Initial review: **D9-1** identified ambiguous/unavailable inventory entries and
  required identity-safe access. The original review remains historical evidence.
- Requirements reassessment — 13 November 2026: the user's agreed prevention-first
  amendment addresses the source of future ambiguity through path uniqueness.
  **D9-1 remains open with amended scope**: AC-9 covers prevention; AC-3/AC-10 still
  require per-entry identity/context for legacy collisions and unavailable paths.
  Stable IDs alone and a detached identity list do not satisfy deliberate selection.
  No mockup correction or renewed rendered design review occurred. The user
  authorized this requirements reassessment without requesting new mockups.
  Any later material interface revision returns to the user before renewed analyst
  review; final amended contract/design agreement is still pending.
- Subsequent naming direction: the user selected removal of all whitespace,
  lowercase new namespace names, case-insensitive paths, NFC and retained accents.
  The user subsequently agreed the [precise naming policy](009-naming-policy-proposal.md),
  including the Unicode sets/algorithms and version pinning.
  It supersedes the earlier exact-string comparison proposal, not legacy source
  preservation. V1 does not illustrate this preparation/collision feedback.
- V2 preparation: explicitly authorized on 13 November 2026 after agreement of
  the precise naming definitions. The separate designer prepared
  [Design V2](../../prototypes/increment-009-v2/DESIGN-V2.md), with a
  [screenshot gallery](../../output/increment-009-design-v2/index.html) and
  [bounded render observations / source snapshot](../../output/increment-009-design-v2/review.md).
  It covers prepared names, blocked collisions, full-fold/NFC examples, affected
  descendants, individual legacy identities, unavailable paths and empty names.
  V1 remains frozen. The user approved the identified V2 artifact for analyst
  review on 13 November 2026. The [fresh V2 analyst consistency review](009-design-v2-review.md)
  is complete against baseline `b33aadb`, with **no required findings**.
- Current D9-1 disposition: **addressed at design-review level** by V2's associated
  full identities/context on ambiguous entries and truthful unavailable-path
  treatment. Earlier open dispositions above record the prior stages. This closes
  the design finding, not production AC-9/AC-10 acceptance or final user agreement.
- The proposed component boundaries are viable at design level. Other fixture
  omissions remain explicit implementation requirements and verification limits;
  neither the review nor the prototype establishes production acceptance.
- Final contract/design agreement and implementation authorization: granted by the
  user on 13 November 2026 for this amended contract, the agreed naming policy and
  identified V1/V2 artifacts, using a fresh developer and independent reviewer.
- Material revisions return to the user before renewed analyst review.

The [project workflow](../workflow/agent-roles.md#workflow) requires the designer's
direction to reach the user before prototype work, then user approval of the
identified proposal before analyst review. Preparation does not skip either step.

## Proposed implementation and verification sequence

After final agreement and explicit implementation authorization only:

1. Use the agreed naming policy to implement deterministic
   collision checks for existing creation/group rename and legacy-safe admission.
   Implement browser-view transitions and matching toolbar/navigation context.
2. Extract lifecycle/backup owners and meaningful inspector sections, preserving
   state lifetimes and command authority; improve summaries, spacing and copy.
3. Freeze an identified snapshot for a fresh independent reviewer. Resolve
   findings with targeted checks, then record criterion-linked completion evidence.

Proposed shared implementation verification ceiling: **30 aggregate minutes and
two harness-repair cycles**, including developer/designer/reviewer checks and
waiting. This is a ceiling, not a target; reserve independent-review time within it.
It covers affected normal workflows rather than exceptional qualification.

- Focused domain/application tests: group/group, token/token and group/token
  collisions at root and nested paths; other-type and incomplete existing tokens;
  same short names at distinct paths/projects; changed descendant collisions and
  unchanged IDs/aliases on rename; atomic rejection. Include legacy collisions
  with an unrelated otherwise allowed command, an added collision member and a
  changed-path collision. Do not broaden existing repair eligibility.
- Naming-policy examples: every spacing-set member at leading/internal/trailing
  positions, empty-after-removal, lowercase/NFC preparation, retained accents,
  canonical-equivalent encodings, full-fold expansion and Greek sigma, default
  dotted/dotless-I behavior, preserved script joiners, and unchanged legacy data.
  Demonstrate that the domain/application path cannot bypass preparation and that
  form preview and committed name agree. No exhaustive Unicode qualification is
  implied; implementation must substantiate the chosen Unicode version/algorithm.
- Controlled representative legacy evidence: opening/identity-safe inspection and
  exact backup/restore remain admitted without name rewriting or schema changes.
  Target only the newly touched admission boundary; no Increment 007 campaign restart.
- Focused behavior tests: view transitions/parent defaults and shared admission;
  controlled existing-host tests for materially touched lifecycle/backup paths.
- One `npm run build` for existing typechecks and production bundling. No redundant
  separate typecheck campaign or blanket full-suite rerun without concrete risk.
- One representative Chrome walkthrough: group → All content → catalogue, query
  applicability, selection/draft preservation, readable successful/unresolved/group
  details, technical disclosures, Alpha/actions, Apply/Cancel focus and compact drawer.
- Focused source/controlled evidence for touched integrity guarantees, including a
  normal backup entry if changed. No exhaustive restore, fault or lifecycle campaign.
- Preserve existing ordinary responsiveness and bounded rendering; no new maximum
  workload or benchmark claim. Check affected contrast/readability and keyboard
  behavior; this is not full accessibility or additional-engine qualification.

Stop at either ceiling or earlier for tooling dominance/low value. Carry consumed
effort and repair cycles across handoffs; unresolved criteria remain unverified.
Resumption after a stop requires a separately authorized bounded follow-up.
Increment 007 qualification allowance remains **zero**; original Increment 008
checks and its Apply follow-up remain **stopped**. This proposal resets neither.

Planning used document/source review only, approximately 10–15 aggregate minutes
(estimate across coordinator, analyst and designer), zero harness repairs; stopped
after focused Markdown/link checks. No tests, builds or browser sessions were run
for this proposal. Future implementation checks remain proposed and unstarted.

Subsequent authorized mockup preparation used a separate 15-minute aggregate
render-review ceiling and at most one harness repair. Approximately 12–15 minutes
(estimate) and one stylesheet-scanning repair were used; checks are stopped.
The linked rendered observations distinguish mockup checks/corrections from
application qualification. No production tests, builds or implementation ran.
This does not consume or activate the proposed implementation allowance above.

The user subsequently authorized source/document consistency review of Design V1.
This review stage has a shared 10-minute aggregate ceiling, zero harness repairs;
the analyst was allocated at most seven minutes, with three reserved for coordinator
reconciliation and documentation. The completed review used approximately 5–6
analyst minutes plus 2–3 coordinator minutes, **7–9 aggregate minutes** (estimate),
zero harness repairs; review is stopped. Findings and evidence limits are in the
[design-review record](009-design-review.md). No browser rerender, application
tests/builds or implementation occurred; stopped mockup/007/008 campaigns remain
stopped.

## Review baseline and amendments

Planning baseline: `58053d6`. Recheck HEAD and user changes before implementation;
do not assume this baseline will remain current. Before independent implementation
review, identify the exact commit or diff/new-file manifest. Developer and reviewer
start with fresh contexts and authoritative contract/design references.

### Agreed direction amendment — 13 November 2026

At baseline `2b98316529dfedc825ef3da5983403b308217e17`, the user agreed that
canonical paths must be unique within each project regardless of token type, and
that existing conflicting data must remain accessible. This supersedes Increment
001 D2's enforcement deferral for the proposed Increment 009 implementation only;
it does not rewrite Increment 001's historical delivery claims. Groups and tokens
share the namespace; type, layer and assignment state do not partition it. Paths
are segment arrays, independent of their display/export separators.

**Earlier comparison proposal, superseded by the subsequent naming direction:**
exact current local-name comparison had been proposed but not agreed. The user
then selected whitespace-free lowercase authoring, NFC and case-insensitive
comparison. The precise recommendations are in the naming-policy proposal below.
Paths still compare segment arrays: `["a.b"]` and `["a", "b"]` must not collide
merely because a display joins them with dots.

**Agreed preservation boundary:** prevent new collisions/additions using affected
paths and descendants, while keeping supported legacy data readable, inspectable,
backable and restorable. Do not rename/merge data or tighten Increment 007's schema
or restore policy. This does not authorize a general progressive-repair workflow,
new rename/move UI, or bypassing other existing command safety.

**Remaining design requirement:** D9-1 is reframed, not closed. Legacy conflicting
and unavailable paths still need reliable per-entry identity/context. The exact
presentation remains to be identified for final design agreement; no rendered
review or mockup revision is claimed by this amendment.

This newly authorized documentation amendment/reassessment has a separate
**10 aggregate minute ceiling, zero harness repairs**: at most seven analyst
minutes and three coordinator minutes. Analyst document/source review and focused
Markdown checks used approximately **5–6 minutes**; coordinator reconciliation and
documentation used **2–3 minutes**, **7–9 aggregate minutes** total (estimates), zero
repairs. No tests, build, browser sessions or application changes.
All earlier stopped allowances remain stopped; the proposed implementation
allowance is unstarted. Requirements reassessment stops after this handoff.

Final amended contract/design agreement and implementation authorization remain
pending. Staging, committing and pushing remain with the user.

### Naming direction and precise recommendations — 13 November 2026

The user initially selected removal of all whitespace, including internal whitespace,
case-insensitive path segments, lowercase newly authored names, NFC and retained
accented letters. The [naming-policy proposal](009-naming-policy-proposal.md) owns
the recommended precise definitions: a pinned Unicode baseline, removal set,
stored-name preparation versus canonical caseless comparison, examples and scope.
Those technical choices were initially recommendations; the user explicitly agreed
them and authorized V2 mockups in the subsequent instruction recorded below. Normalization
here is deliberate preparation of a newly submitted name, not permission to
rewrite existing authored data or unrelated labels.

The accompanying [analyst reassessment](009-design-review.md) preserves D9-1's
exceptional legacy/unavailable-path access requirement. No prototype/code change,
new rendered design review, tests, builds or implementation is authorized by this
documentation request. Previous stopped campaigns remain stopped. This amendment
uses a separate 10-minute aggregate source/document-review ceiling, zero repairs;
actual effort and stopping record are in the naming-policy handoff.

### Precise naming agreement and V2 authorization — 13 November 2026

At baseline `add6ac12f3ada78b821ce02c00aa5d77f876b343`, the user explicitly agreed
the [named policy](009-naming-policy-proposal.md): Unicode 17.0.0, all 25
`White_Space` code points plus U+200B/U+2060/U+FEFF, full default lowercase with NFC
for newly submitted namespace names, and canonical caseless segment comparison
using default full folding without Turkic overrides. Accents and script-significant
joiners remain; existing names/source and supported legacy admission stay exact.
The prepared-name preview must make deliberate authoring transformations visible.

The user authorized V2 mockups for normalization, blocked collisions and existing
conflicting data. This authorizes isolated prototype/evidence work only. V2 must
return to the user before renewed analyst design review. D9-1 remains open until
the exceptional legacy/unavailable-path access treatment is reviewed; preparing
V2 does not claim production collision prevention or implementation acceptance.

V2 uses a separate **15 aggregate minute render-review ceiling, at most one harness
repair**, shared across designer/coordinator. Prior V1 and 007/008 checks remain
stopped and are not resumed; production implementation verification is unstarted.
The linked V2 evidence records approximately **12–15 aggregate render-review
minutes** (estimate), **zero harness repairs**; checks are stopped. No production
tests, builds, validator, storage changes or application implementation occurred.
The limited fixture helper does not establish Unicode 17.0.0/D145 conformance.

### V2 approval for analyst review — 13 November 2026

The user explicitly approved Design V2 for review against this amended proposal
and the agreed naming policy, without implementation. A fresh analyst reviews
baseline `b33aadb76b0128efba9cbd1e73ebf277ae3caf28` using source and saved screenshots
only. This stage has a separate **10 aggregate minute review ceiling, zero harness
repairs**: at most seven analyst minutes and three coordinator minutes. No browser
rerender, application tests/builds, mockup correction or implementation is included.
Prior stopped campaigns remain stopped; production verification is unstarted.
The [completed V2 review](009-design-v2-review.md) maps AC-1 through AC-11 and reports
no required findings. D9-1 is addressed at design-review level; version-pinned
Unicode, all affected descendants, legacy admission and retained-state guarantees
remain unimplemented/unverified production requirements. Approximately six analyst
minutes plus two–three coordinator minutes, **8–9 aggregate minutes** (estimates),
zero repairs; review is stopped. No browser, tests, builds or implementation ran.
The next gate is final user agreement to this amended contract, the agreed naming
policy and identified V1/V2 design, followed by explicit implementation authority.

### Implementation authorization — 13 November 2026

The user explicitly agreed this amended contract, the naming policy and V1/V2
design and authorized implementation with separate developer/reviewer agents.
Implementation baseline: `5b23a3027079b807faf1943af80d88a6f5478004`, clean at dispatch.
Earlier pending-authorization wording records historical stages and is superseded
by this authorization. Material scope/design changes still return to the user.

The agreed **30 aggregate verification minutes / two harness-repair cycles** are
now active for this implementation only: up to 12 developer minutes, six
coordinator browser/evidence minutes, nine independent-review minutes and three
reserved for targeted rechecks/reconciliation. These allocations share one ceiling,
not additional allowances. Record actual consumption at each handoff; stop at
either limit or earlier for low value/tooling dominance. Prior stopped design and
007/008 campaigns remain stopped. No optional qualification is reopened.


## Completion report

- Delivery status: **Partially completed — implementation and independent review finished; manual acceptance pending**
- Date: 13 November 2026
- Reviewed snapshot: base `5b23a3027079b807faf1943af80d88a6f5478004`, [exact tracked source patch](../../output/increment-009-implementation/review-source.patch) and [included new files / 38 file hashes](../../output/increment-009-implementation/review-source-manifest.json). Reviewer confirmed the patch and hashes matched. Documentation handoff edits are outside that frozen source snapshot.

### Result

Implemented distinct browser views, view-specific controls and creation defaults,
readable group/resolution inspection, more compact color controls and persistent
actions. Lifecycle and backup coordination are extracted; reference, metadata,
group and resolution sections have focused ownership. No replacement global store
or dependency was introduced.

Application authoring now prepares new/explicitly renamed namespace names under
the agreed pinned Unicode 17 policy and rejects newly introduced path collisions
across groups and tokens, including affected descendants. Legacy constructors and
supported load/restore admission preserve authored data; exceptional rows retain
associated identities/context. These source/test results do not establish every
required browser interaction or legacy recovery scenario.

### Acceptance evidence

See the [developer AC map and commands](../../output/increment-009-implementation/developer.md),
[Chrome observations/screenshots](../../output/increment-009-implementation/chrome-review.md)
and [independent review](../../output/increment-009-implementation/reviewer.md).

| Criterion | Evidence and result | Status |
|---|---|---|
| AC-1 | Focused view tests, independent source review and Chrome All content heading/controls/navigation | Verified within recorded scope |
| AC-2 | Source/tests and group creation destination; complete draft/query/departure interaction matrix not replayed | Partly verified; manual acceptance pending |
| AC-3 | Chrome readable resolution/trace; source/tests for groups and exact details; exceptional legacy browser matrix not executed | Partly verified; manual acceptance pending |
| AC-4 | Compact controls/sticky actions in source and saved desktop screenshot; representative 1280 × 800 and compact geometry not qualified | Partly verified; manual acceptance pending |
| AC-5 | Source review and observed normalization/context/Inspector copy; misleading empty-path copy corrected and observed | Verified within recorded scope |
| AC-6 | Independent ownership/base-diff review; shared pre-read admission tests | Verified |
| AC-7 | Existing focused session/coordination tests and source comparison; complete affected native interactions not replayed | Partly verified; manual acceptance pending |
| AC-8 | Labels/controls/focus paths inspected in source; full keyboard/focus/drawer matrix not executed | Partly verified; manual acceptance pending |
| AC-9 | Focused cross-kind/type/descendant/project/legacy tests, independent source review, Chrome full-fold collision rejection | Verified within recorded scope |
| AC-10 | Focused legacy codec/collision tests and per-entry source review; native legacy restore/selection/backup matrix not executed | Partly verified; manual acceptance pending |
| AC-11 | Focused policy tests and pinned-table review; raw input, preparation preview and saved name observed in Chrome | Verified within recorded scope |

### Checks and independent review

- Developer: eight focused test files, **72 tests passed**. Final `npm run build` passed four TypeScript configurations and Vite bundling. Build advisory: main chunk about 592 kB (188 kB gzip); no performance acceptance is inferred.
- Fresh independent reviewer `/root/increment9_independent_reviewer` derived expectations before source inspection: **no demonstrated required defects**. No independent test/build rerun; source review is not full UI acceptance.
- Combined V1/V2 fidelity checked through source and bounded native Chrome evidence. No separate implemented-interface designer review or complete accessibility/responsive qualification occurred.
- Coordinator feedback corrected empty prepared-path copy and expected collision submission feedback. Empty-copy correction was observed; final preflight submission branch was source-reviewed, not browser-replayed.
- Unresolved disagreements: none. Missing runtime evidence remains a delivery gap, not a demonstrated defect or a waived criterion.
- Verification accounting: approximately **25 aggregate minutes** (developer 10, coordinator Chrome/evidence 6, reviewer 8, final reconciliation/document checks about 1), within the single 30-minute ceiling. **Two of two harness repair cycles used**, both on the fixture harness; that campaign stopped. Unaffected frozen-source/evidence review and existing Chrome walkthrough continued without harness repair. No further automated campaign is running or authorized by this report; unused time does not reset repair limits or prior 007/008/design stops.

### Decisions and limits

The agreed [naming policy](009-naming-policy-proposal.md) is unchanged. Generated
Unicode tables and provenance/license live in `tools/unicode-17/`; application
semantics do not depend on host Unicode casing/normalization. Focused examples and
source review do not claim exhaustive Unicode conformance-suite execution.
No token rename/move UI, general legacy repair, interchange or broader browser
qualification was added. No staging, commit, push, release or deployment occurred.

### Next step

User manual acceptance should cover: representative desktop/compact Alpha/action
access and keyboard/drawer focus; invalid draft/query preservation and departure/
Apply/Cancel/rejection focus; supported legacy duplicate/orphan selection by exact
identity and exact backup/restore through the normal UI. The reviewer report gives
a concise scenario checklist and the developer note links a synthetic backup.
An orphan still triggers existing structural write guards; use structurally valid
colliding data for unrelated-creation checks. These checks are pending, and this
increment is not marked Completed. Do not restart stopped automated qualification
without an explicitly authorized bounded follow-up.

## Focused closure proposal — 13 November 2026

**Agreed; Phase 1 authorized on 13 November 2026.** Proposal baseline: `834a990` (current Increment 009
implementation). The user requested a simple two-phase proposal to close
the gaps identified after implementation. The user subsequently approved this
two-phase proposal and authorized Phase 1 only; Phase 2 awaits the Phase 1 user
handoff, comments and explicit go-ahead. This follows up Increment 009; it does not reopen naming policy,
the product model, or completed Increments 007/008. AC-1 through AC-11 remain
binding. The earlier completion report remains the historical implementation
handoff, not acceptance of the work proposed below.

### Phase 1 — Finish the UX/UI and its rendered acceptance

| Task | Concrete result |
|---|---|
| 1. Compact the ordinary inspector | At 1280 × 800 CSS pixels, the representative sRGB literal editor shows all four channel inputs, including Alpha, above persistent Apply/Cancel actions. Reduce redundant headings, empty metadata placeholders and spacing before reducing readable control sizes. Keep full exact values, essential guidance, errors and recovery visible; longer/exceptional content may scroll normally. |
| 2. Finish All content | Render a vertical list of individually selectable, wrapping rows with a clear name/path, kind and token-type hierarchy. Ordinary entries expose full identity through associated details; conflicting/unavailable entries retain their exact identity and truthful context inside each actionable row. Remove the duplicated explanation and redundant labels; preserve complete progressive membership and native Find access. |
| 3. Complete the rendered functional-block review | Walk the existing project entry, navigation/catalogue, creation/rename, literal/reference editing, group/resolution/source inspection, diagnostics, backup/restore and available recovery screens using synthetic data. Check normal, empty and relevant error states. Correct affected copy, spacing and readability defects within the accepted Precision direction. Record recovery states that cannot safely be exercised as unverified; do not build new fault-injection machinery. |
| 4. Close the interaction evidence gaps | In Chrome, check one compact layout plus desktop: keyboard/drawer focus, raw draft and query preservation across views, departure choices, Apply/Cancel, name-rejection focus, duplicate/orphan selection by exact identity, and supported backup/restore through the normal UI. Use a structurally valid conflicting project for unrelated creation; an orphan still obeys existing write guards. |

**Done means:** supplemental closure criterion **009-F1** has screenshot evidence
for the representative desktop editor and readable ordinary/exceptional inventory;
**009-F2** has a short functional-block checklist recording observed interaction
outcomes and any unresolved AC-2/3/4/7/8/10 gaps. No clipped controls or unintended
horizontal page scrolling in the representative compact check. No new technical
meaning, normalization or identity policy is introduced by presentation changes.

**User handoff:** the running application, a small before/after screenshot set and
the checklist, followed by a pause for user comments/acceptance and explicit go-ahead
to Phase 2. Address ordinary Phase 1 corrections within this phase; a material new
design request is surfaced rather than silently expanding the work.

### Phase 2 — Align React responsibilities and files with the interface

| Task | Concrete result |
|---|---|
| 1. Group files by functional block | Move block-owned files out of the flat workbench `components/`, `hooks/` and `state/` buckets into the shallow functional groups below. Colocate each block's components, hook and local state helpers. Update imports/tests in the same change; keep domain, application, host protocol and global UI primitives in their existing layers. Do not force genuinely cross-block files into a new catch-all folder. |
| 2. Narrow component contracts | Give ReferenceFields its reference value, choices, feedback/disabled state and reference-change callback rather than a whole DraftSession and replacement setter. Narrow actual rendered sections to focused value/action contracts; keep broad editor coordination only at its owning composition boundary. Do not replace the whole-hook-result dependency with dozens of scalar props or merely rename it as another controller/model type. Keep exactly one useTokenEditor owner and existing session key/identity/lifetime. |
| 3. Clarify workbench composition | Keep Workbench responsible for composing the screen and connecting existing owners. Extract only cohesive layout/dialog rendering or coordination that has a clear responsibility; retain one owner for commands, readback, lifecycle, creation and backup/restore. Do not replace the current component with an omnibus hook or split it to meet a line-count target. |
| 4. Clean and document the result | Apply consistent formatting/import conventions to touched files, remove obsolete forwarding exports only when their callers are updated, and record a compact functional-block → component/hook ownership map. Check the diff for accidental behavior/style changes. |

Proposed organisation under `src/presentation/features/workbench/`:

```text
browser/       TokenBrowser, ProjectedTokenList, AllContent, ProjectNavigation;
               browser-view and membership helpers
inspector/     WorkbenchInspector, Editor, ColorFields, ReferenceFields,
               ResolvedTokenPanel, GroupInspector, TokenMetadata,
               inspection-tabs, useTokenEditor and draft session state
creation/      CreationDialog, useCreationForm and naming-preview
backup/        RestoreDialog, useBackupRestore and useWorkbenchBackup
recovery/      RetentionRecovery, DepartureGuard and ProjectDiagnostics
coordination/  useProjectCommands, useProjectReadback, useWorkbenchLifecycle,
               useWorkbenchLayout and workbench readback helpers
color/         existing pure presentation color helpers
```

Workbench/App stay in `presentation/app/`; global `components/ui/`, project entry
and host ownership stay outside this move. WorkbenchHeader remains a screen-shell
component rather than being forced into backup ownership. Genuinely cross-block
leaf renderers such as ExactSource, AuthoredValue and swatch may remain in their
existing component location; do not create a new `shared/` dumping ground or
abstract them merely to complete the folder tree. Existing unused or
alternate files such as TokenList are inspected before any move or deletion; no
unrelated cleanup or speculative shared abstraction is required.

**Done means:** **009-F3** has a readable folder/ownership map and section-specific
props, with one editor session and unchanged command authority. **009-F4** preserves
the accepted Phase 1 UI and existing raw input, revision, async completion,
restore, source-access and departure guarantees. Evidence is a focused source
review, relevant behavior regression checks and final build, plus a brief rendered
smoke check of the moved UI. Do not add tests that only enforce file locations or
component size. File moves alone do not count as responsibility separation.

**User handoff:** concise structure/change summary, ownership map, check results
and any remaining gaps. Mark Increment 009 Completed only when its required
criteria and both phase outcomes have evidence and user acceptance is recorded.

### Execution and stopping rules

After approval, execute each phase as one bounded delivery: one developer makes
the changes, freezes the snapshot, and one independent reviewer checks it; fix
concrete findings and recheck the affected behavior within the same allowance.
There is no fresh mockup/analyst cycle for each task and no repeated full review
of unchanged work. Existing V1/V2 and this accepted task list guide implementation.
Only a material design/scope change returns to a design decision. A genuine defect
is not waived merely to meet a one-pass promise: if it cannot be resolved within
the bound, hand it back explicitly instead of silently starting another cycle.

Proposed follow-up verification ceiling: **30 aggregate minutes total**, at most
20 for Phase 1 and 10 for Phase 2, including developer checks, rendered review,
independent review and affected rechecks; **zero harness repairs**. This allowance
becomes active only when the user approves this bounded follow-up and authorizes
the relevant phase. The earlier approximately 25/30 minutes and exhausted two
repair cycles remain consumed and stopped; this is not a reset or authority to
repair/restart that fixture campaign. Use existing working tools and ordinary UI
flows; a tool failure produces a recorded evidence gap, not a new harness project.
Focused tests only; no full-suite run per phase, with one final build in Phase 2
and only the relevant compile checks needed earlier. No stress/max-resource,
alternate-engine or old 007/008 qualification is included.

Planning used approximately **five aggregate source/document-review minutes**
(three analyst plus two coordinator), zero repairs, no tests/builds/browser sessions. No production code, mockups or
tests changed. Staging, committing and pushing remain with the user.


### Phase 1 authorization and active allowance — 13 November 2026

The user approved the two-phase closure proposal and explicitly authorized Phase 1
implementation, followed by a user review before Phase 2. Production baseline:
`834a99003d6f449c89454a4a7492f355de65c33d`. Existing proposal/status edits are preserved.
The follow-up ceiling is now approved: 30 aggregate verification minutes total,
Phase 1 at most 20 and Phase 2 at most 10, zero harness repairs. Phase 1 allocations
are developer focused checks/compile up to four, coordinator rendered checks up to
ten, independent review up to four and targeted correction/reconciliation reserve
two minutes. This is one shared allowance, not additional time per agent. Prior
campaigns remain stopped. No Phase 2 implementation or folder/contract refactor is
authorized now. Staging, committing and pushing remain with the user.


### Phase 1 implementation handoff — 13 November 2026

**Implemented; user review pending; rendered acceptance partially verified.**
Phase 2 has not started. Reviewed production snapshot: baseline
`834a99003d6f449c89454a4a7492f355de65c33d` plus the
[exact Phase 1 patch](../../output/increment-009-phase1/review.patch) and
[nine-file hash manifest](../../output/increment-009-phase1/review-manifest.json).
Existing proposal/status changes were preserved. No staging, commits or pushes.

- **009-F1:** ordinary editor now removes empty description/layer placeholders and
  redundant Value heading, compacts header/channel spacing without shrinking the
  exact inputs, and retains sticky actions. Chrome at 1280 × 800 initially showed
  Alpha clipped; the developer corrected spacing and the final screenshot shows
  all four complete inputs above the actions. All content now uses vertical
  wrapping native list/button rows, name/path plus kind/type hierarchy, associated
  ordinary identity disclosures and inline exceptional identity/context. Duplicate
  explanatory copy is removed. Desktop, compact and restored legacy evidence is
  linked in the [rendered checklist](../../output/increment-009-phase1/checklist.md).
- **009-F2:** observed compact drawer keyboard entry/selection/focus return,
  invalid raw draft preservation into All content, focused invalid Apply feedback,
  supported normal-UI legacy restore and exact duplicate/orphan selection.
  The checklist records unverified query/departure/successful Apply/rejection-focus,
  reference/group/source/diagnostics and exact backup roundtrip scenarios; rare
  recovery states were not induced. This is partial rendered coverage, not full
  functional-block acceptance or a waiver of AC-2/3/7/8/10.
- Developer: focused all-content/Increment 009 tests **9/9 pass**; presentation
  TypeScript compile passes. No full build/suite: final build remains planned for
  Phase 2. [Developer evidence](../../output/increment-009-phase1/developer.md).
- Fresh independent reviewer: no demonstrated actionable source defects; snapshot
  matched. [Review and scope](../../output/increment-009-phase1/reviewer.md).
  Source review does not substitute for missing runtime scenarios.
- Verification stopped at approximately **20 aggregate minutes**: developer three,
  reviewer about four, coordinator Chrome/setup/evidence about twelve and final
  reconciliation/document checks about one. The coordinator used the unused
  developer minute and one reserve minute; Phase 1 ceiling remains twenty.
  **Zero harness repairs.** Chrome device-toolbar setup and emulation hit-testing
  consumed part of the rendered allowance; existing native UI/keyboard controls
  were used, no automation harness was added/repaired. Optional screenshot cropping
  was unavailable; full screenshots were retained without installation/repair.
  Phase 2's ten minutes remain unused, and prior stopped campaigns stay stopped.

**User handoff:** review the [running application](http://127.0.0.1:5179/),
[screenshots/checklist](../../output/increment-009-phase1/checklist.md) and explicit
acceptance gaps. Await user comments and go-ahead before any Phase 2 work. Neither
Phase 1 full acceptance nor Increment 009 completion is claimed by this handoff.
No automatic verification extension or additional workflow cycle is started.


### Phase 1 approval and slider-layout extension — 13 November 2026

The user approved the Phase 1 changes and explicitly requested this presentation
extension before Phase 2: three color components side by side in one horizontal
block, Alpha in a separate full-width block below; each slider above its exact
input; circular slider thumbs. This is the agreed layout for all existing color
spaces. Raw values, transformations, warnings, invalid/unavailable states and
keyboard behavior stay unchanged. Existing Phase 1 changes remain uncommitted and
must be preserved. Phase 2 remains unauthorized pending the extension handoff.

A separate bounded allowance applies only to this newly authorized extension:
**10 aggregate verification minutes, zero harness repairs** (developer up to two,
coordinator rendered checks up to five, independent review up to two, reserve one).
Earlier Phase 1's twenty minutes and other stopped campaigns remain consumed;
Phase 2's ten-minute allocation is untouched. Use existing working tools, one
focused compile/check and desktop/compact rendered observations. No full build,
new harness, or restart of earlier acceptance scenarios. One developer and one
independent reviewer; the user's precise layout is approved without another
mockup/analyst cycle. Final implementation handoff returns to the user.


### Slider-layout extension handoff — 13 November 2026

Implemented the user-selected layout in ColorFields and its native range CSS:
three equal component columns, Alpha full-width below, slider above exact input
for all four controls, and equal-size circular WebKit/Mozilla thumbs. Existing
raw-value, view/byte, unavailable/invalid and apply semantics are preserved; no
Phase 2 files/folder refactor occurred. Earlier uncommitted Phase 1 work remains.

[Developer evidence](../../output/increment-009-phase1-extension/developer.md):
presentation compile and **36 focused existing tests pass**. No full build/suite.
[Independent source review](../../output/increment-009-phase1-extension/reviewer.md):
no actionable defects; two-file snapshot hashes match. Extension-only patch and
pre-extension baseline patch are recorded in the same evidence directory.

[Chrome screenshot and observations](../../output/increment-009-phase1-extension/chrome-review.md)
confirm the selected desktop arrangement/circular thumbs, native slider/input
synchronization, exact invalid text preservation and Cancel focus return. The
user changed Chrome during device-preview setup; the current desktop state was
respected. No new exact desktop/compact viewport or Firefox runtime qualification
is claimed. This extension does not close earlier unverified acceptance scenarios.

Approximately **eight aggregate verification minutes of ten**, zero harness repairs
(developer1.5, reviewer2, coordinator4, reconciliation0.5). Checks are stopped.
Phase 2's allocation is untouched. Return the visible extension for user review;
Phase 2 has not begun. No staging, commit or push.
