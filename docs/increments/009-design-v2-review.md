# Increment 009 — Design V2 analyst review

13 November 2026. Independent analyst consistency review following explicit user
approval of V2 for analyst review only. Final contract/design agreement and
implementation authorization remain pending.

## Review identity and basis

- Stable baseline: `b33aadb76b0128efba9cbd1e73ebf277ae3caf28`; clean at dispatch.
- Requirements were derived first from the [amended draft contract](009-workbench-usability-and-component-boundaries.md)
  and [agreed naming policy](009-naming-policy-proposal.md), then compared with
  project/model/architecture/presentation constraints, the [prior review and amendments](009-design-review.md),
  V2 source and saved images. No external research or runtime qualification was needed.
- Reviewed [Design V2](../../prototypes/increment-009-v2/DESIGN-V2.md), `main.tsx`,
  `prototype.css`, `vite.config.ts`, `index.html`, and the [saved evidence and hashes](../../output/increment-009-design-v2/review.md).
  Recomputed source/CSS/config/HTML hashes match that manifest. Design prose may
  receive coordinator-owned approval/status updates without changing this snapshot.
- Independently inspected saved captures 01–10. Viewport measurements and recorded
  interaction outcomes are attributed to the coordinator; no browser was opened
  and no interaction was independently replayed.
- V2 supplements frozen V1. Ordinary editing, resolution, query/departure behavior
  and editor layout retain the [V1 review's assessments and limits](009-design-review.md).
  Their absence from this focused V2 fixture is not a proposed deletion.

## Conclusion and D9-1 disposition

**No required design-consistency findings. D9-1 is addressed at design-review level.**

The original P2 concerned deliberate selection of legacy ambiguous/unavailable
entries, rather than merely exposing identities somewhere. In V2, each conflicting
or unavailable native row button contains its own full exact identity and context;
its handler selects `item.id` (`main.tsx`, `row`, lines 92–100). Capture
[06](../../output/increment-009-design-v2/06-existing-conflicts.png) shows both
identically displayed token paths with separate identities, plus the conflicting
group. Capture [07](../../output/increment-009-design-v2/07-unavailable-path.png)
shows the orphan's actionable identity, missing-parent context and explicit
unavailable inspector path. The inspector and its disclosures derive from the
selected fixture identity, without a detached identity list or invented path.

This resolves the residual AC-3/AC-10 presentation issue identified by D9-1.
It does not establish production AC-9 prevention, exact source/backup fidelity,
legacy admission, or user agreement to the resulting design. The fixture's two
duplicate tokens have different types; identity is associated with every conflicting
row independently of that distinction, so the treatment does not depend on types
being different.

## Criterion map

These are design-consistency assessments, not application acceptance results.

| Criterion | Assessment and remaining boundary |
| --- | --- |
| AC-1 | V2 uses one explicit view for navigation, heading and controls; All content has neither search nor Rename group. Saved compact drawer has one active view. V1 owns ordinary catalogue/query behavior; native progressive production membership remains required. |
| AC-2 | Creation visibly previews its chosen parent; opening from All content defaults to root. Selection is separate from view. V1 remains the reference for reveal, preserved editor input and departure protection; missing-target protection is not qualified by fixed parent options. |
| AC-3 | Associated identities, exact local names/segment disclosure and truthful unavailable-path context address D9-1. Ordinary successful/unresolved resolution retains V1's readable design. Fixture JSON is illustrative, not production exact-source evidence. |
| AC-4 | Ordinary channels/Alpha/actions remain governed by V1. V2's naming modal keeps actions separate from a scrollable body; captures 02/05 show long collision lists within that body. Full compact layout remains unverified. |
| AC-5 | Inspector covers both kinds; prepared-name/path labels distinguish raw input from the submitted name. Retention, page-only drafts and independent backup copy remain understandable. Focused metadata disclosure does not supersede ordinary full-form layout. |
| AC-6 | The proposed domain comparison/application enforcement and renderer previews are feasible within existing boundaries. One editor session, cohesive lifecycle/backup owners and shared admission remain requirements; V2's single-file synchronous fixture is not the proposed production ownership. No new dependency/store/router is selected. |
| AC-7 | Rejection retains raw input in source and leaves fixture membership unchanged. Existing baseline review, outcome distinctions, no replay, completion consumption, restore revision protection, keys/fences, bounded access and coherent async readback are unmodeled and unverified, not waived. |
| AC-8 | Owned controls, shared Icon/theme, native row buttons/disclosures, labels, invalid state and focused rejection feedback are represented. CSS explicitly provides row focus and wrapping. Source/saved captures do not establish keyboard, dialog focus return, announcement, composition or accessibility acceptance. V1 Apply/Cancel/departure behavior remains binding. |
| AC-9 | Cross-kind/type collisions and exact conflicting identities appear in form feedback. Rename shows the group's collision and affected descendant collisions (capture 05); rejection preserves input. All descendant depths, incomplete tokens, separate projects, segment-array distinctions and atomic enforcement remain future implementation requirements, not deficiencies requiring more mockups. |
| AC-10 | Per-row identity/context and unavailable inspection address the design gap. Capture 09 illustrates unrelated creation alongside unchanged conflicts. Supported opening, exact backup/restore and other command safety remain unverified; the mixed fixture's orphan cannot establish real authoring admissibility. No repair or automatic legacy rewrite is proposed. |
| AC-11 | Raw editable text, pre-submit prepared-name/path preview, empty-result rejection and accented NFC examples align with the policy. Straße/STRASSE explicitly distinguishes stored lowercase from the broader equality relation. Only the edited group name is prepared; legacy ancestor/descendant names remain exact in the illustrated paths. Complete version-pinned Unicode behavior remains unimplemented. |

## Assumptions and implementation limits

- The agreed policy remains authoritative: all 28 members of `R` are removed
  everywhere; storage uses NFC/default full lowercase/NFC, while keys use
  NFD/default C+F case folding/NFD on actual segments, without Turkic overrides.
  Accents and script joiners remain; keys never replace names or identities.
- V2 explicitly labels host casing/normalization and its few folding substitutions
  as limited fixtures. Greek sigma, dotted/dotless I, other full-fold mappings,
  contextual casing, failed/oversized preparation and pinned Unicode 17 behavior
  remain production requirements. No library or Unicode source choice is silently made.
- The rename fixture checks its fixed group's immediate children and excludes
  unchanged internal legacy conflicts. Production must traverse all affected
  descendants and distinguish unchanged collision relationships from newly added
  members, using project-scoped arrays of segment keys rather than joined labels.
  These simulation limits are explicit production work, not semantic test evidence.
- Creating under legacy ancestry must preserve actual ancestor text. Load/read/
  inspection/backup/restore and unrelated commands must not run name preparation
  over existing data or gain blanket rejection from collision diagnostics. Other
  existing structural/reference and retained-command safety remains binding.
- No new material product ambiguity was identified within this design scope.
  Broader naming grammar, confusables, target escaping, future editing capabilities
  and general repair remain deferred. No complete application reconstruction or
  additional mockup campaign is required by this review.

## Effort and next gate

Approximately **6 analyst minutes** (estimate) within the assigned seven-minute
ceiling and shared ten-minute aggregate stage; **zero harness repairs**. Source,
documentation, hash and saved-image inspection only; focused Markdown/link review
of this record. No tests, builds, installs, browser replay or application changes.
Review stops here. Previous stopped V1/V2 mockup and 007/008 campaigns stay stopped;
the proposed implementation allowance remains unstarted.

Coordinator reconciles this disposition with the contract/design/status records
and presents the identified amended contract plus V1/V2 design for final user
agreement. Implementation still requires separate explicit authorization. Material
design revisions return to the user before renewed analyst review. Staging,
committing and pushing remain with the user.

Suggested commit: `docs: record increment 009 V2 design review`.
