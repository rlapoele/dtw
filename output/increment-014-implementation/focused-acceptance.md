# Focused affected acceptance — 16 November 2026

Coordinator authorized only these remaining checks after independent R2 review;
source remains frozen at R2. Additional verification approximately2.5 minutes
including execution/approval waits and focused selector/modality corrections.
Cumulative developer20.5 minutes; preceding aggregate32/40 becomes34.5/40.
Harness repairs remain1/1; no setup repair, build, suite or qualification restart.

Actual isolated Chrome on the existing local server:

- At root20px, viewport390×900 and320×900, local inspector scrolling reaches both
  enabled lower Cancel and Apply changes actions after an unapplied color edit.
  The existing inspector-content scroll owner moves (scrollTop652/674); neither
  action requires document scrolling. Both buttons remain within the viewport,
  55px tall, and can receive keyboard focus. Keyboard traversal shows the Neutral
  500 solid outline with3px offset, fully visible with room around all edges.
- An unchanged authoring form's Cancel returns focus to its actual toolbar
  New token trigger with no remaining dialog.
- Cancelling a named, unfinished authoring form opens the existing discard guard.
  Discard draft closes both dialogs and returns focus to that same New token
  trigger. No product workflow was bypassed or changed.

`focused-acceptance.json` records actual rectangles, scroller bounds, focus/outline
and dialog results. Four screenshots show each lower action at each width;
`focused-acceptance.cjs` records the exact probe. Runtime helper mutations only
set the test root size and ordinary focus/scroll; no application source changed.
The initial narrow probe expected Edit token after resizing a focused editor;
existing focus preservation already retained inspection, so the final probe
respects that state. Keyboard traversal was added to observe :focus-visible
rather than treating programmatic pointer-modality focus as keyboard evidence.

These checks close those specific R1 runtime gaps. They do not expand prior
stopped campaigns, full state/viewport qualification or broader browser coverage.
