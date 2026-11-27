# Ramp and inspector refinements

**24 November 2026 — implemented and independently reviewed; user acceptance pending.**

The user supplied eleven browser annotations and then explicitly requested direct
implementation after the designer's focused recommendation. This supersedes the
proposed prototype step for this follow-up only. Existing Increment 024 semantics
and earlier qualification stopping decisions remain closed.

## Scoped acceptance

1. Ramp slider readouts show at most four decimal places using existing display
   formatting; authored precision and slider edits are unchanged.
2. HEX, origin text and protection controls are centered in each ramp step column.
3. Component names appear once in a left label column; step swatches and their
   component sliders remain vertically aligned. Accessible slider names still
   identify the step and component. Unavailable conversions do not show coordinates
   under incorrect component labels.
4. Settings and Rename use standard shared outline buttons without toolbar stretch.
   The redundant inspector Ramp settings button is removed.
5. The redundant Back to ramp button is removed. The existing shell Back control
   retains the narrow inspector's return path when the workspace is hidden; this
   path was confirmed in the browser during implementation.
6. Other color spaces uses the shared ghost button, retaining independent disclosure.
7. Inspector chevron and token-type label share its top bar; token path and Current/New
   previews form the content block underneath. Existing ownership and draft lifetimes
   are preserved.
8. Ramp-member Layer remains functionally locked to Primitive and visibly disabled.

## Verification boundary

One 30-minute aggregate ceiling for this newly requested follow-up, including about
three minutes of initial designer/source assessment. Allocate up to ten minutes to
developer checks, seven to independent review, seven to coordinator browser/docs,
with three minutes reserve. At most two harness repairs. Target existing component
tests, typechecks, and representative ramp/inspector desktop and narrow rendering.
No numerical, retention, stress or cross-engine qualification restart. Stop early
once sufficient evidence exists and record any unverified behavior honestly.

Staging, committing and pushing remain user-owned.

## Outcome and evidence

All eight scoped criteria were implemented. Shared header, buttons and disabled
select treatment replace the inconsistent presentation. The component matrix uses
one row label per component and preserves each slider's exact edit value. The
obsolete token-inspector-toggle CSS was removed after its final consumer moved to
the shared inspector header. No dependencies, domain rules or persistence changed.

All typecheck scopes and 62 targeted tests across five files passed. The extended
ramp-draft test covers rounded readouts with exact titles, shared component labels,
accessible step/component names, unavailable conversions and unchanged dirty state.
Final follow-ups removed the redundant Back control and orphan CSS; those removals
were source-rechecked without rerunning tests.

Independent review covered base `17aa553` plus eight production files (including
the final CSS cleanup) and the ramp-draft test. No actionable findings remain.
Reviewer assessed ownership, lifetimes, precision and disabled member controls.

Browser checks used the existing saved neutral ramp: matrix alignment, centered
metadata, four-decimal readouts, standard toolbar controls, absence of duplicate
settings, revised ordinary-token header, and disabled Primitive were observed.
The narrow shell Back successfully returned from the step inspector to the ramp.
No project changes were saved. Hot reload caused a stale read-context notice;
the existing Retry reading project action recovered it. This is not retention
qualification. [Final ramp view](../../output/playwright/ramp-inspector-refinements/ramp.jpg).

Approximately 25/30 aggregate minutes used (assessment3, developer9, reviewer5,
coordinator/browser/documentation8 including reserve); zero harness repairs.
Checks stop here. No exhaustive keyboard, cross-engine, numerical or retention
qualification; previous stopping decisions remain closed.

Suggested commit: `fix: refine ramp controls and token inspector layout`.

## Separate creation-flow discussion

The user asked whether creation can use one form and one review, and save at
finalization. Recommendation: combine group/seed/scale/placement inputs, retain
advanced and exceptional decisions contextually, then review and create atomically.
The current final Create action already saves the group, members and recipe; later
Apply is for subsequent edits. This simplification is proposed only and was not
implemented in the annotation follow-up.

**Follow-up — 24 November 2026:** the user asked to proceed with that direction.
The separate designer prepared [creation V4](../project/workbench-layout/color-ramp-creation-v4.md),
a static one-form / one-review proposal. The user subsequently approved focused
analyst review, now completed with integration requirements and eight proposed criteria
in V4. No new product decision was identified. Final agreement and implementation
authorization were subsequently granted, including the valid-name prerequisite.
The [V4 completion record](../project/workbench-layout/color-ramp-creation-v4.md#implementation-completion--24-november-2026)
now documents implementation, independent review, corrected Auto placement and
bounded browser evidence. The active contract describes two-stage creation; human
acceptance remains pending and earlier verification stopping decisions remain intact.

## Clean draft actions and consistent step inspector — 24 November 2026

The next annotations identify enabled Apply/Discard on unchanged ramps and ask for
the regular color-token inspection experience for ramp steps. Direct correction
continues within the user's implementation direction.

Acceptance: clean drafts disable both actions; invalid pending input remains
discardable but cannot Apply; passive inspection/view changes do not create edits.
Ramp step presentation reuses regular inspector conventions and appropriate shared
components: token-type header, path/current/new preview block, description and
visibly locked Primitive layer, literal color fields and inspection details.
Ramp-specific protection/reset remains available. The ramp owner keeps all draft
state and the single Apply boundary; this is not a second ordinary-token editor.
No fabricated resolution information or change to settled replacement semantics.

Scoped verification ceiling:30 aggregate minutes, at most2 harness repairs;
developer10, reviewer6, coordinator8, reserve6. Focus on dirty/action transitions,
state-preserving reuse, representative ordinary/ramp inspector rendering and focus.
No broader numerical/retention/compatibility campaign. Earlier checks stay stopped.

**Completed; user acceptance pending.** The user explicitly clarified that visual
presentation must be identical except for ramp-related controls/restrictions.
Regular and ramp inspection now share header/toggle, measured sticky heading,
Current/New comparison, sections, tabs, metadata, source and resolved presentation.
Moved components live at their actual shared TokensWorkbench owner; private
RampStepInspection adapts the saved snapshot, including explicit absence of saved
data for newly proposed steps. Existing color fields remain mounted; no second save
owner was introduced. Apply and Discard are disabled on clean drafts; invalid
pending input is still discardable. A clean internal save is a no-write success
so coordinated departure remains possible.

All typecheck scopes and 237 presentation tests passed. After the final shared
sticky-heading correction, typechecks and 50 affected tests passed. Independent
review of base `0b20535` plus the source/test changes identified the missing scroll
padding protection, then verified its correction; no actionable findings remain.
Browser checks confirmed both buttons disabled initially, both enabled after a
temporary description edit, and both disabled after discarding that edit. The saved
green/600 inspector visibly uses the regular layout with Primitive disabled and
shared inspection sections. Measured heading scroll padding was present. No edits
were saved. [Final inspector](../../output/playwright/ramp-inspector-refinements/step-inspector.jpg).

Approximately20/30 aggregate minutes (developer5, reviewer7, coordinator8), one
test-selector harness repair. Checks stop; no new broad numerical/retention,
cross-engine or exhaustive keyboard campaign. Narrow behavior and all read-only
tabs were source/test reviewed, not exhaustively browser-replayed.

Suggested commit: `fix: align ramp step inspection and disable unchanged actions`.

## Heading and settings annotation follow-up — 24 November 2026

The next three annotations requested the normal group heading/pencil rename pattern,
removal of the toolbar Rename button, and contextual settings navigation aligned
with the fields. A shared WorkspaceHeading now serves both normal and ramp views.
Ramp settings uses a ghost button only when a step is selected or the settings
inspector is not visible (including narrow layout and collapsed desktop inspector).
Matching the fields' existing bottom margin aligns all three controls.

Presentation typecheck and 11 existing tests across three focused files passed.
Independent review found one collapsed-inspector reachability issue; it was fixed
and source-rechecked with no remaining finding. Browser checks confirmed the pencil
heading, settings appearing on step selection, settings navigation hiding the now
redundant control, and identical control top/height geometry. No values were saved.
[Heading and aligned settings](../../output/playwright/ramp-inspector-refinements/heading.jpg).
Narrow/collapsed conditions were source-reviewed, not browser-replayed in this slice.
Approximately seven additional aggregate minutes for this separately requested small
follow-up, zero harness repairs; prior campaigns remain stopped.

Suggested commit: `fix: unify ramp group heading and settings navigation`.

## Color summary precision follow-up — 25 November 2026

The creation review annotation identified full-precision seed and generated-step
coordinates. Ramp previews, the review seed summary, and shared seed/gamut summaries
now use the existing color display formatter: up to four decimal places, including
alpha, without padding trailing zeros. Titles retain the exact original values.
Stored precision, generation, editable inputs and save ownership are unchanged.

Presentation typecheck and 29 existing authored-value and ramp-draft tests passed.
Checks stopped after this focused verification. This small presentation
fix was source-reviewed by the implementing agent; no independent review or browser
replay was performed, and the user's open creation draft was not manipulated.
Prior broad verification stopping decisions remain in force.

Suggested commit: `fix: round ramp color summaries to four decimal places`.

## Inspector container border follow-up — 27 November 2026

The ramp inspector's outer container now matches SelectionInspector's shell
utilities: surface background, left hairline, mobile top hairline without a left
border, minimum dimensions, relative positioning, isolation and clipping. It also
has the same pane label and programmatic focusability. The existing ramp portal,
mounted ancestry, content scrolling and draft ownership remain unchanged.

Presentation typecheck and production compilation passed; the existing bundle
size advisory remains. Source and whitespace review completed. No browser replay
or expanded qualification ran for this small container correction; visual acceptance
remains pending.

Suggested commit: `fix: align ramp inspector container with token inspector`.

## Shared InspectorPane extraction — 27 November 2026

Following user authorization, both inspector containers now render InspectorPane
at their existing shared TokensWorkbench owner. It owns identical shell utilities,
the pane label and programmatic focusability, with children, hidden state, an
optional surface ref and the existing section/aside choice. It adds no DOM wrapper,
state owner, scroll container or portal target. SelectionInspector keeps its
fallback; TokensWorkbench keeps the ramp target div and stable callback ref.
Token editor keys, hook callers and ramp createPortal destination are unchanged.

Presentation typecheck and six existing layer-editing/ramp-draft tests passed.
Source review checked both consumers, unchanged resulting DOM geometry and portal
ownership; whitespace checks passed. Verification stopped without a new browser
campaign. This small refactor was reviewed by the implementing agent, not a separate
reviewer. Previous uncommitted border correction was preserved. Visual acceptance
remains pending.

Suggested commit: `refactor: share inspector pane container`.
