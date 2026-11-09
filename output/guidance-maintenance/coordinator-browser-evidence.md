# Coordinator browser verification

9 November 2026. Executed by the coordinating agent in fresh in-app browser tabs,
separately from developer tests and independent reviewer source/check work.

## Sources and snapshot

- Before: isolated production build from the pre-maintenance audit, corresponding
  to application source at `cc49016` (plan-only `4b541f8` does not change it).
- After: developer implementation identified by
  [developer manifest](developer-manifest.json), based on `4b541f8`.
- The developer refreshed its build during the initial browser pass. That first
  page loaded `index-Dr0M3lUM.js`; it was closed and the checks repeated in a fresh
  final production tab loading `index-Dow4y_EG.js` with `index-BGo9VSWC.css`.
  The final checks below refer to that final tab unless otherwise noted.
- Existing maintained development fixture `test/browser/fixture.html` was served
  separately against final source for inspection-only/protected editing checks.

All projects were disposable review data. No existing user tab was opened or
reloaded. Production assets were served from isolated build directories, and
the three review servers were stopped. All review tabs were closed and the
temporary viewport override reset after verification.

## Textarea focus and native behavior

1. Created a project and opened New token. Initial focus was Name. Tab moved to
   Description, then Tab moved to Group, retaining labels/native semantics.
2. Focused Description computed outline was `rgb(99, 112, 131) solid`, matching
   the established ring; offset was `2.98507px` in this browser's current rendering
   scale. Width was `1.49254px`. These are observed values, not a claim of 100% zoom.
3. Entered `"  First line\nSecond line  \n第三行"`; created the token and expanded
   All authored data. Parsing its visible JSON returned that exact description,
   including leading/trailing spaces, line breaks and Unicode.
4. Opened another creation dialog at measured compact width. Description was
   keyboard-focused and fully in view: left47.55, right430.06, top428.35,
   bottom481.82 CSS pixels in an actual477×1075 viewport. Computed `resize` stayed
   `vertical`. A real resize-handle drag increased height from53.47 to96.99px.
   The initial wide pass also exercised an actual resize drag with the same result.
5. Cancel closed the compact dialog and returned focus to New token.

[Final compact focus screenshot](compact-focus.png) shows the neutral ring and
native handle in the final production build. The screenshot includes unused
browser capture area beyond the actual page viewport; it is not evidence of a
larger application layout width.

## Class cleanup parity

The following measurements matched before and after, both at the actual default
wide1910×1075 viewport and measured compact477×1075 viewport:

| Surface | Before and after |
| --- | --- |
| Search background | `rgb(250, 251, 252)` |
| Search padding | left34px; right10px |
| Resolved-heading alignment | `flex-start` |
| Resolved-heading wrapping | `wrap` |
| Resolved-heading gap | 8px |

Compact document scrollWidth was477px, matching innerWidth477px. The browser
viewport capability was requested as320×720, but actual DOM dimensions remained
477×1075. This report claims the measured compact check only, not320px coverage.
The final screenshot was visually inspected: dialog, labels, focused textarea,
selects and actions were within the measured page width.

## Shared policy browser checks

- A newly created ordinary literal exposed normal editable controls.
- In the maintained fixture, selecting `number` displayed Inspection only and
  the retained-data explanation; no color editor/Apply controls were rendered.
- Selecting `protected-color` exposed its normal color editor. Changing Red from
  `0.2` to `0.234567890123456789` enabled Apply. Apply succeeded and exact authored
  JSON retained that string, Green`0.4`, Blue`0.6`, Alpha`1`, ID`protected-color`,
  project`fixture-project`, description, layer, semantic role and protected policy.
  Focus returned to Literal color. No general persistence or loader behavior was used.

## Limits

This is scoped coordinator execution, not reviewer browser execution. No new
screen-reader, actual200% page zoom, physical-device/virtual-keyboard,
cross-engine or320px certification is claimed. Exact outline sizes reflect the
existing browser scale. Whole-project diagnostics, repair eligibility and atomic
failure semantics have test/source evidence rather than a new exhaustive browser
matrix. All checks operated on disposable data and session-only storage.
