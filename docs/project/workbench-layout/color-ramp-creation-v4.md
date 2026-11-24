# Color ramp creation V4 — two-stage proposal

**Focused analyst review complete — 24 November 2026. Final agreement and implementation authorization remain pending.**

The user approved this identified V4 for bounded analyst review, preserving existing
ramp behavior. This review has a ten aggregate-minute ceiling: up to six analyst
minutes and four coordinator minutes, no harness repairs. Inspect the proposal,
owning contracts and relevant source only; no tests, browser, numerical, retention
or cross-engine qualification. Earlier campaigns remain stopped.

The user asked to proceed with the previously proposed one-form / one-review direction.
This static design consolidates the existing creation inputs; it changes no generation,
seed, placement, membership, persistence or history rules. It supersedes the four-stage
presentation in [creation V3](color-ramp-creation-v3.md) only if agreed.
The [Increment 024 contract](../../increments/024-color-ramp-authoring.md) remains authoritative.

![One creation form followed by final review](color-ramp-creation-v4.svg)

The drawing illustrates hierarchy, not computed colors or a functioning interface.
Preview colors and value placeholders are schematic. Production shows actual paths,
authored spaces, component values, alpha and explicitly labelled HEX previews.

## Recommendation

Use the existing New group dialog with two stages when Generate a color ramp is checked:
**Configure** and **Review**. Keep the ordinary unchecked group route unchanged.
One form makes related seed/count/position changes visible together and removes repeated
Continue steps. Keep the full member list on review so the form remains manageable.
A compact, non-editable swatch strip on the form gives immediate context.

### 1. Configure

- Group identity first: Generate a color ramp checkbox, Name, Parent group and the
  existing truthful name/path preview, including collision details when relevant.
- **User amendment — 24 November:** keep ramp fields visible but disabled until
  the group name is properly filled out and its identity validation is error-free,
  including parent/path availability and collisions. This covers Seed, Advanced,
  description, gamut actions, count, intensity, placement and Auto. Name, Parent
  group and Generate remain available. Explain the prerequisite beside the fields.
  If identity becomes invalid again, disable ramp controls without clearing their
  draft; correcting identity restores access to the same inputs.
- Seed: HEX input, authored-space/alpha summary and specimen, quiet project-default
  helper, Advanced disclosure, and optional Seed description. Preserve the explanation
  that description belongs only to the token at the final seed position.
- Scale and placement: Step count, Color intensity, then Seed position and Use Auto
  position. Use the existing defaults and placement rules. Indicate Auto/manual status
  alongside the actual chosen label. Placement is a visible normal input, not Advanced.
- Show resolved target, generated OKLCH space and Primitive layer as facts, not extra
  editable controls. Add a compact preview when calculation is available; invalid
  inputs show their errors without presenting stale swatches as a valid proposal.
- Footer: Cancel and Review ramp. Review writes nothing and is unavailable while name,
  parent, seed, count or placement is invalid, a gamut choice is unresolved, Advanced
  has an unaccepted edit, or existing pending/read/recovery gates prevent progress.
  Explain the blocking condition beside the affected input or in the shared failure area.

Checking Generate reveals this form in place; there is no preliminary group-only step.
Unchecking uses the current behavior: drop ramp-specific local state, preserve group
identity and return to ordinary group creation. This proposal does not add a new
checkbox retention policy. Review/Back must preserve the entire current ramp draft,
including original HEX, Advanced acceptance and gamut-adjustment restore state.

### 2. Review

Use a read-only final review with group path, count, intensity, actual seed position
and Auto/manual status, target gamut, generated space, Primitive layer and seed
summary/description. The full proposed member list includes each full token path,
authored space/components/alpha and explicitly labelled HEX (sRGB preview).
Long paths wrap. All 2–20 members remain reachable by scrolling; no ellipsis replaces
members. Repeated-preview feedback stays visible and non-blocking under existing rules.
No per-step value editor is introduced.

Footer: Back, Cancel and Create color ramp. Back returns to the same form with all
inputs intact. Create is the existing atomic group + members + recipe save and one
history entry. No later Apply is needed to finish creation. Subsequent saved-ramp edits
retain the existing shared draft and ramp-level Apply boundary.

## Conditional states and interaction

| Condition | Presentation and behavior |
| --- | --- |
| Advanced color | Expand the existing color fields inline below Seed. Use color accepts; its Cancel abandons only that advanced edit. Return focus to Advanced. Keep the existing alpha and explicit-space rules. |
| Seed outside target / bounded lightness | Automatically show the existing original/candidate comparison and applicable explicit choices beside Seed, never behind optional disclosure. Do not preselect a gamut decision, silently clip or expand targets. Restore original remains available under the existing rule. |
| Invalid manual position after count/seed change | Retain the requested label visibly, explain why it needs review and block Review. Offer valid position choice or existing Auto action. Preserve exact white/black endpoint rules and the distinction between Auto and manual placement. |
| Name/parent problem | Retain the existing path/collision evidence beside identity. Ramp fields stay visible but disabled until identity is valid; preserve any existing ramp draft while disabled. No empty group is created to get to review. |
| Read failure, unavailable/unknown result, or save failure | Show existing failure/recovery content in both stages, outside stage-hidden panels. Keep the draft, truthfully gate actions and use existing recovery; do not add blind retry or claim success. |
| Cancel/close | Use the existing creation departure/discard policy. No project write on cancellation. Do not add a third confirmation stage to successful creation. |
| Pending create | Keep pending feedback visible, gate duplicate submission and preserve the existing close/departure restrictions. |

Native labels and controls retain keyboard access. Enter from the configuration form
can request Review only, never Create; final creation requires its deliberate review
submission. Focus moves to the Review heading on entry and the Configure heading on
Back, with the fields immediately following. Advanced retains its existing heading/
return-focus behavior. Errors are programmatically associated with their inputs;
shared failures remain announced and reachable in either stage. Closing returns focus
through the existing dialog owner.

Use one scrollable content area and a persistent action footer, with enough scroll
padding that focused fields are not obscured. Pair Name/Parent and Count/Intensity only
when space permits; use one column at narrow widths. Advanced content grows in the
same scroll area. Review uses stacked member entries when columns would crowd values.
Do not add nested page-like wizard chrome or an independently scrollable short preview
inside the configuration form.

## Scope, assumptions and handoff

This design uses existing generation and application operations. Stage presentation
must not move command ownership or reset mounted draft state. No new dependency,
persistence format, numerical algorithm, recovery policy or save owner is proposed.
The current source resets ramp fields when Generate is unchecked; that behavior is
retained. A future request to preserve those fields is separate.

No additional product decision was identified by the designer beyond agreement to this
identified layout and progression. The user has now approved focused analyst review.
The check covers existing creation criteria,
state preservation and both-stage error/recovery visibility before implementation.

Source/design inspection only; no browser interaction, tests, numerical runs or old
qualification campaign. Approximately four aggregate designer minutes, zero harness
repairs; the six-minute source/design review ceiling is stopped. Static layout has not
been browser-tested and does not establish runtime accessibility or numerical accuracy.

Suggested commit: `docs: propose two-stage ramp creation`.


## Focused analyst review — 24 November 2026

**Reviewed proposal; final agreement and implementation authorization remain pending.**
Baseline: production source at `41d2625`, with the coordinator's V4 review-approval
and budget annotation. The two-stage proposal is consistent with existing creation
semantics, subject to the integration requirements below. This is a source/design
consistency review, not evidence of runtime correctness or implementation approval.

### Findings and integration requirements

1. **Intentional contract amendment, not an accidental contradiction.** Increment
   024 AC-1 and its scope currently describe checked Continue and four stages, with
   positioning on final review. V4 intentionally replaces that presentation with
   Configure and read-only Review. On final agreement, reconcile those active
   descriptions and the owning direction's final-positioning wording; retain V3
   as historical design evidence. AC-2–6 and AC-16–19 retain their semantics.
2. **Preserve mounted draft owners.** `RampCreation` currently remains mounted when
   returning to group identity, and its `RampSeedFields` remains mounted across
   stages. The latter owns raw HEX, Advanced draft/space/validity and the original
   seed for restoration. Hiding Configure during Review must preserve that state,
   not reconstruct it from accepted settings or a HEX preview. Unchecking Generate
   currently unmounts ramp state while retaining group identity; keep that explicit
   exception. `useAuthoringForm` remains called by `TokensWorkbench`, and Create
   still reaches its existing `createColorRamp` command through `create(value)`.
3. **Combined inputs need complete validity gates.** Current sequential UI separates
   count editing from placement. V4 exposes both simultaneously: an empty/fractional/
   out-of-range count or invalid seed must not let Use Auto call the calculation
   with unusable inputs. Review and final Create must check current name/parent/path,
   seed/Advanced acceptance, count, placement and existing read/pending/recovery gates.
   Invalid HEX currently leaves the previous accepted seed available for calculation;
   a compact preview must not present those old swatches as a valid new proposal.
   These are presentation integration requirements, not new numerical policy.
4. **Shared failures must be reachable in both stages.** In the current
   `AuthoringDialog`, read failure, creation error and submission-blocked explanation
   sit inside the group form hidden during ramp stages. Recovery itself is outside.
   V4 explicitly requires all applicable feedback and its focus target outside
   stage-hidden panels. A failed final submission must preserve the review/draft,
   expose its explanation and let the existing recovery owner govern what follows.
   Revalidate after baseline review; entering Review does not accept a stale baseline.
5. **Original finding; superseded by the user's identity prerequisite below.** Current
   ramp-local changes do not update `formDirty`; the sequential route normally
   requires an ordinary name edit before reaching those controls. In V4 a user can
   edit the seed or count before touching Name. Connect that dirty state to the
   existing departure guard so Cancel/close offers the established discard/keep-
   editing protection when needed, including incomplete input. This preserves V3's
   protection requirement through the changed ordering; it does not introduce a new
   confirmation policy or change the expressly retained uncheck reset behavior.
   **User disposition — 24 November:** disable ramp fields until the group name
   is filled out without identity errors. Ramp-first edits are therefore unavailable;
   no additional ramp-first dirty-state mechanism is required by this finding.
   Retain the existing departure guard and preserve drafts if identity later becomes
   invalid. The Generate-uncheck reset exception remains unchanged.
6. **Layout and submission need deliberate integration.** `RampPreview` currently
   supplies its own `max-h-80 overflow-auto` list; it is not directly the proposed
   compact strip or single-scroll review. Keep all members and existing truthful
   values/repeated-preview feedback while adapting layout. The current group form
   can fall through to ordinary `onSubmit` when ramp identity is invalid; the new
   checked form must never take that route. Configure Enter can only request Review;
   entering Review must not submit creation through the same event. Preserve
   Advanced button/heading focus and give both stage headings explicit focus targets.

No additional product decision is required by these findings. The recommendation is
to agree V4 with these integration requirements before authorizing implementation.
This does not settle unrelated historical gaps or reopen numerical, persistence,
replacement, history, saved-ramp editing or recovery policies.

### Proposed observable acceptance criteria for implementation

These criteria are proposed for final agreement, not already implemented or verified.

1. **V4-1 — Routes and identity.** Checking Generate immediately reveals identity,
   seed, scale and placement in Configure. The unchecked ordinary-group route remains
   unchanged. Unchecking resets only ramp-specific state and preserves identity.
   Ramp fields are visible but disabled until the group name and parent/path checks
   are valid and collision-free. Invalidating identity disables them again without
   clearing ramp inputs; correcting it restores those inputs. Invalid name/parent
   or collision blocks Review with truthful path evidence and never falls through
   to ordinary group creation. Identity controls remain editable.
2. **V4-2 — Draft lifetime.** Review then Back preserves name, parent, raw HEX,
   accepted seed representation/alpha, description, count, intensity, Auto/manual
   request, accepted gamut and original-seed restoration state without reconversion.
   Advanced Use color/Cancel retain their existing acceptance boundaries; unaccepted
   Advanced input blocks Review. Stage changes create no project/history writes.
3. **V4-3 — Validity and preview.** Invalid seed, count or placement and unresolved
   gamut choices visibly block progression. Count/seed changes preserve existing
   Auto/manual and endpoint rules; unavailable Auto calculations cannot be invoked.
   A compact preview is shown only as a valid proposal when the contributing draft
   inputs are valid. No generated member becomes individually editable.
4. **V4-4 — Read-only review.** Review shows current group path, count/intensity,
   actual seed position and mode, target, generated space, Primitive layer and
   truthful seed/description. Every proposed member from 2 through 20 is reachable,
   with full wrapping path, authored space/components/alpha and explicitly labelled
   sRGB HEX preview. Existing repeated-preview feedback stays non-blocking.
5. **V4-5 — Final command and recovery.** Only deliberate Review submission invokes
   existing atomic Create. It rechecks current validity and owner gates; pending or
   unknown outcomes prevent duplicate submission. Read/save failures, stale-baseline
   explanations and recovery controls remain visible/reachable in either stage.
   Failure retains the draft and uses existing recovery; confirmed success selects
   the new group with the existing single creation-history boundary and no later Apply.
6. **V4-6 — Departure.** Cancel/close writes nothing and uses the existing departure
   protection. Ramp edits cannot precede valid identity entry under the user's
   amendment; no new ramp-first dirty-state mechanism is required. Keep editing
   preserves the session, including when identity has become invalid again.
   Existing pending/unknown departure restrictions remain;
   the Generate-uncheck reset exception remains unchanged.
7. **V4-7 — Keyboard and layout.** Configure Enter requests Review only; Advanced
   actions do not submit the form. Review entry/Back focus their respective heading;
   Advanced returns focus to its trigger and dialog close uses existing owner return
   focus. Inputs expose associated errors and shared failures remain announced.
   One scrollable content area and persistent footer keep focused controls and all
   review members reachable, with narrow stacking and no nested short preview scroll.
8. **V4-8 — Ownership and scope.** Existing domain generation, atomic application
   command and workbench draft/recovery owners remain authoritative. Use owned
   controls/theme/icon conventions; assess any changed file placement against actual
   consumers. No new dependency, algorithm, persistence format or saved-ramp Apply
   boundary is introduced.

### Evidence and stopping boundary

Inspected: repository `AGENTS.md`; workflow role briefs; this V4 Markdown and SVG
source; creation V3; Increment 024 creation criteria and lifecycle/recovery boundaries;
the relevant guided-color direction; current status and ramp-inspector refinement
record; architecture and applicable presentation ownership/control conventions.
Product foundations and open-question headings were consulted for scope, not treated
as permission to revisit settled decisions.

Production source inspected under
`src/presentation/App/components/TokensWorkbench/`: `TokensWorkbench.tsx`,
`components/AuthoringDialog/AuthoringDialog.tsx`,
`components/AuthoringDialog/components/RampCreation.tsx`,
`components/AuthoringDialog/hooks/useAuthoringForm.ts`,
`components/RampSeedFields.tsx`, and `components/RampPreview.tsx`.

Approximately five analyst minutes of the allocated six; zero harness repairs.
Stopped after enough source evidence to identify the integration obligations. No
application edits, tests, browser interaction, rendering validation, numerical runs,
retention or cross-engine qualification. Keyboard, focus, scrolling and failure
behavior remain implementation checks; this review does not assert they work today.
Coordinator source, findings and document checks consumed approximately three minutes:
about eight of ten aggregate minutes total, zero harness repairs. Checks stop here.
The coordinator confirmed the departure requirement follows existing protection,
without changing the Generate-uncheck reset exception. Changed Markdown, local links
and whitespace were checked; no application or user-data changes were made.

Suggested commit: `docs: review two-stage ramp creation contract`.

## User refinement after review — 24 November 2026

The user selected disabled ramp fields until group identity is valid, replacing
the review's proposed handling of ramp-first edits. Configure and V4-1/V4-6 above
record this refinement. The wireframe shows an already-valid name, so its enabled
controls remain representative. This is a direct user amendment, not a new analyst
review or implementation authorization. Final agreement to the remaining V4 criteria
and implementation authority remain pending. Documentation-only consistency and
whitespace checks; earlier review and qualification stopping decisions remain intact.
