# Increment 015 — R1 correction ready for R2

16 November 2026. Production edits paused again. No application verification was
run after the review repair ceiling was reached: no tests, build, browser or
runtime inspection. R1 screenshots/test logs remain evidence of the earlier
snapshot, not proof of this correction.

Reviewer R1 AC-10 finding accepted: the expanded toggle was hidden with its
scroller and replaced by a different visible toggle, losing keyboard focus and
preventing a continuous visible arrow rotation.

Source correction:

- TokenEditor owns one persistent InspectorToggle before the content scroller.
  It is never conditionally replaced on collapse; the same icon's rotate class
  changes with the existing expanded prop. An unavailable-state paragraph retains
  status feedback without introducing another control.
- SelectionInspector adds relative positioning. The existing heading reserves a
  noninteractive 36px control slot; the persistent toggle overlays this slot and
  stays outside the independently scrolling content.
- Focused collapsed-rail CSS moves only that wrapper to the 48px rail inset.
  Narrow mode still hides the desktop toggle and uses the existing Back control.
- Presentation conventions describe the focused geometry exception. No editor
  hook/key, mounted editor/content ancestry, draft or command ownership changed.

Changed since R1: SelectionInspector.tsx, TokenEditor.tsx, TokenEditorContent.tsx,
styles/global.css, presentation-conventions.md and this note. InspectorToggle's
existing normal/reduced-motion transition classes remain unchanged.

Only source/diff inspection performed. **Keyboard focus, continuous normal-motion
rotation, reduced-motion behavior, sticky positioning, collapse/expand and draft
preservation after this correction are UNVERIFIED.** They require the newly
bounded recheck authority being coordinated by the main chat. Prior aggregate
usage remains approximately 17/30 minutes and 2/2 harness repair cycles, with all
application checks stopped; no allowance restarted.
