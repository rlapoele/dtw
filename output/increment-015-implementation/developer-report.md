# Increment 015 developer handoff

16 November 2026. Base: `dc41528e0d3ca33d809c9cf517873506a48f2f57`.
Implementation edits are paused for independent review. No staging, commits or pushes.
Coordinator owns contract/proposal/status edits; developer owns the remaining source,
tests, presentation-conventions reconciliation and this evidence folder.

## Implementation

- AC-1–2: retained history cursor/length expose required undoCount/redoCount through
  the existing typed/validated worker response. Header badges include zero; descriptions
  remain screen-reader/native-title accessible without the visible strip. Guards unchanged.
- AC-3–6: concise HEX/unavailable text retains explanation; decimal string rounding
  is an explicit row-only opt-in (nearest/ties away, none/negative zero retained correctly).
  Inspector/source stays exact. Generic browse/search copy and shared magnifier added.
- AC-7: workspace actions reuse existing authoring context/operations and guards.
  Cancellation returns to the visible initiating action; success retains existing destination.
- AC-8–15: compact opaque sticky identity/comparison, Current/New labels, 34px specimens,
  shared desktop arrow toggle/48px collapsed rail, narrow Back, 24px/16px panels.
  Actual heading ResizeObserver measurement sets existing scroller scroll-padding;
  editor hook, session keys, ancestry and command ownership remain unchanged.
- AC-16: shared Button/Input/Select, tabs, sliders, exact numeric fields, native file input
  and checkbox label areas reconcile to 2.25rem baseline; content rows stay natural.

Affected ownership reviewed: new InspectorToggle is under SelectionInspector because
both fallback/header and TokenEditor consume it. Existing public primitives remain shared;
row rounding is opt-in under TokensWorkbench's existing authored-coordinate helper.
No dependency, icon-family, mount/session or unrelated refactor. CSS exceptions documented
for actual sticky geometry, workspace heading grid and native file-button pseudo-element.
Button additive/state-callback class contract is retained.

## Checks

`focused-tests.txt`: 11 affected test files / 87 tests passed, including history traversal,
branching, suspension, invalidation, pruning/oversize counts, worker count validation and
row decimal ties/none/negative zero/exact-value preservation.
`build.txt`: full project typechecks and production Vite build passed. Existing large-chunk
advisory remains. `git diff --check` passed.

Fresh Chrome session `increment015`, isolated origin `http://127.0.0.1:5185/`:

- 1090×865: standard editor/action/search/form controls measured 36px; row/comparison
  specimens 34px; collapsed rail 48px; resolved panel Current-only and 24px padding.
  Sticky heading top remained 98px after inspector scrollTop=400.
- Workspace group cancel restored New group; successful creation preserved the group
  destination; next group form used that browsed group as parent.
- 320×865: no document horizontal overflow, desktop toggle absent, panel padding 16px,
  Back preserved unapplied draft and reentry retained exact `0.123456789`. Applying showed
  row `0.1235` with original detail while editor remained exact. `none` showed HEX unavailable
  with actual missing-component reason. Sample accepted changes incremented history counts;
  actual Undo/Redo exercised. Project departure/reentry showed zero count.
- 20px root/320px long title: sticky heading 287.25px, measured scroll-padding 295.25px;
  keyboard Tab focused Blue slider at 559.5–604.5px below heading bottom 461.75px.
  Targets scaled to 45px and no document overflow observed.
- Reduced-motion emulation: computed toggle transition-property `none`.
- Projects standard actions/name/file input measured 36px; project content card retained
  natural 106px height.

Screenshots: desktop-1090.png, browse-320.png, inspector-320-enlarged-focus.png.
The earlier inspector-320-enlarged.png captures initial heading focus before the explicit
keyboard follow-up; the *-focus screenshot is the keyboard geometry evidence.

## Limits and allowance

Approximate developer verification consumption: **11/30 aggregate minutes**, conservatively
**1/2 harness repair cycles** (final Projects selection initially waited for an open workbench;
corrected to activate existing Open project, then rechecked). Includes focused red/green,
diagnostics/build waits and browser checks. About 19 minutes/one repair remain for reviewer
and coordinator; no further developer verification planned.

Not an exhaustive state/accessibility/viewport matrix: exact 1120/880 adjacent-width sweeps,
all fallback/group/read-only/recovery states and checkbox replacement-form interaction
were source-inspected or left for focused independent review, not universally exercised.
Previous deferred qualification is unchanged. No storage stress, broader engine or performance
campaign. Isolated dev server/session remain available to reviewer; user's origin5173 untouched.

Suggested commit: `feat: polish workbench browsing and sticky token inspector`
