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
