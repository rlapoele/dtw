# Toast feedback — design proposal V2

**17 November 2026 · V2 approved for analyst review; review findings remain open.** The user accepted
completed-action success/information toasts with persistent contextual errors and
recovery, and authorized this prototype. They explicitly requested appropriate
error status colors. This artifact is not production implementation, final design
agreement or implementation authorization. [Increment 016](../increments/016-transient-toast-feedback.md)
owns the contract and approval record.

## Requested color revision — V2

The user reviewed V1 as “pretty good” and requested inverted background/foreground
for **all toast and notification types**, because pale surfaces blended into the
neutral application. V2 applies this authorized prototype revision. The user subsequently approved it
for analyst review, stating that visibility/readability improved but palette taste
should be refined later. Colors remain provisional; no production implementation
is authorized. The analyst findings are recorded in Increment 016.
The URL and source directory remain unchanged; the visible review strip identifies V2.

| Status | Dark surface | Light text/icon/focus | Border | Text contrast |
| --- | --- | --- | --- | --- |
| Success toast | green-800 `#166534` | green-50 `#f0fdf4` | green-700 `#15803d` | 6.81:1 |
| Information toast | blue-800 `#1e40af` | blue-50 `#eff6ff` | blue-700 `#1d4ed8` | 8.01:1 |
| Persistent error | red-700 `#b91c1c` | red-50 `#fef2f2` | red-600 `#dc2626` | 5.91:1 |
| Persistent warning | amber-800 `#92400e` | amber-50 `#fffbeb` | amber-700 `#b45309` | 6.84:1 |

Status icons, close buttons and contextual action buttons inherit the light
foreground. Action buttons retain light outlines; notification controls use a light
focus ring and a translucent white hover surface. The fine outer borders remain
subordinate to the strongly contrasting surfaces. The rest of the neutral shell,
status scope, timing, queue, motion, modal and navigation behavior is unchanged.
The shared icon import uses its exact lowercase filename.

The color descriptions in the V1 section below are historical and superseded by
this table. The other V1 interaction decisions remain proposed unchanged.
V2 source/contrast review took approximately one minute, zero repairs. Ratios were
calculated from the supplied sRGB pairs; this is not browser, assistive-technology
or overall accessibility qualification. Whitespace passed. The coordinator owns
the focused rendered check. No production source or dependencies were changed.

## Review artifact

Open [interactive V2](http://localhost:5174/prototypes/increment-016-v1/index.html)
on the existing repository Vite server. Source:
[entry](../../prototypes/increment-016-v1/index.html),
[React prototype](../../prototypes/increment-016-v1/main.tsx),
[isolated styles](../../prototypes/increment-016-v1/prototype.css).
If no server is running, run `npm run dev -- --port 5174` from the repository root.

The separate “Toast feedback · V2” review strip exposes scenarios; it is not a
proposed product toolbar. The workbench is illustrative fixture data. Its controls
never call the host, persistence, worker or project operations. Existing local
Geist fonts and the shared Heroicons Outline Icon component are reused; no
production source or dependency changes are made.

Try Create group or Apply, then Discard drafts. Toggle error and warning to compare
persistent feedback with the transient stack. Five outcomes exercises overflow.
Open dialog hides and pauses notifications; Queue an outcome demonstrates waiting.
Switch project clears the old context. F8 reaches a notification close button;
Tab remains available normally. Hover or focus pauses that notification.

## Original V1 visual and interaction proposal

- Center the stack relative to the viewport, 1.5rem above its bottom on desktop,
  1rem at narrow widths, plus safe-area inset. Cap width at 28rem with 1rem side
  clearance. Long messages wrap. Toasts overlay rather than resize content.
- Use compact Geist text, .375rem rounding, a fine tinted border and light shadow.
  Close controls retain the accepted 2.25rem minimum size. Outline icons are
  supplementary; wording communicates meaning. V1 reuses the available information
  icon for both success and information to avoid changing the production icon API.
- Success: green-50 surface / green-800 text / green-200 border. Information:
  blue-50 / blue-800 / blue-200. Persistent error: red-50 / red-700 / red-200.
  Persistent warning: amber-50 / amber-800 / amber-200. These conventional palette
  mappings are prototype values; production should expose semantic pairs in the
  existing single theme source, including existing error roles where applicable.
- Each toast receives five seconds of unpaused visible time. Hover, keyboard focus,
  hidden document and modal overlap pause expiry. Arrival is an 8px upward
  fade/slide over 180ms; departure fades/slides down over 150ms. Reduced motion
  removes all toast animation.
- Three visible notifications maximum, oldest at the top and newest at the bottom.
  Further events wait FIFO, with no running timer until visible. Do not replace or
  coalesce identical outcomes: they can represent distinct operations. V1 uses a
  session-only FIFO without a synthetic overflow summary or arbitrary drop limit;
  this is intended for ordinary explicit command rates, not a load benchmark.
- A modal hides and pauses the entire stack and delays announcements. Events
  arriving during a modal wait. Closing it restores existing remaining durations
  and exposes newly eligible events. Nothing floats above dialog controls.
- Explicit project/screen navigation clears old-context confirmations and queued
  events. Exception: project creation's automatic open transition carries its own
  named confirmation into the resulting project. This exception is a design
  requirement, not implemented by the static project-switch demonstration.
- Arrival never moves focus. Visible events are announced once politely; identical
  later outcomes have distinct identities. F8 focuses a visible close control.
  Closing a focused toast moves to another visible toast close control, otherwise
  its original trigger if still connected, otherwise a stable workspace landmark.
  Escape retains existing modal/application behavior; no global Escape dismissal.
  When navigation clears toasts, the navigation destination owns focus.

## Status boundaries

Completed creation, rename and Apply outcomes are success; no-op and draft discard
are information. Successful Undo/Redo carries its associated removed-selection
explanation in one message. Pending operations, form errors, failed reads, unknown
retention, editing access restrictions and retry instructions remain contextual.
Backup initiation still requires confirming an independent copy; its instructions
must remain available. A timed toast must not be the only location of an error,
warning or recovery action. Persistent feedback has no automatic timeout or casual
close button; resolving the demonstrated condition removes it.

## Evidence and limits

Source inspection covers timer pauses, FIFO admission, close/focus handling, modal
suppression, distinct event identity, reduced-motion styles and responsive width.
The coordinator supplies actual browser viewing and its focused evidence before
handoff. No application test suite, storage qualification, assistive-technology
qualification or independent analyst review is claimed here. Existing campaigns
remain stopped. The mock shell does not establish fidelity of every production
layout or model semantics. Live announcement delivery still needs implementation
verification with the chosen component; source semantics alone are not proof.

Prototype verification budget is eight aggregate minutes: designer at most five,
coordinator at most three, no harness-repair campaign. Initial preparation's eight
minutes remain separate. Designer source review took approximately two minutes;
no browser or automated application tests were run. A local HTTP request was
blocked/unavailable in this shell and was not pursued; coordinator browser access
is the intended visual check. No files were staged, committed or pushed.

Next: user assesses actual placement, color weight and motion; identified approval
for analyst review precedes analyst design review. Final contract/design agreement
and implementation authorization remain separate.

### Coordinator preview evidence

Opened V1 in a separate in-app browser tab on 17 November 2026. Success and
information feedback rendered; expiry removed the earlier toast while the red
error stayed visible. Manual dismissal returned focus to its trigger, and a
five-outcome burst initially displayed three toasts. One attempt to click a toast
after it had expired had no target; a fresh scenario verified dismissal. The tab
is left available for user review. No application data or source was changed.

Isolated sRGB foreground/background calculations give approximately 6.81:1 for
success, 8.01:1 for information, 5.91:1 for error and 6.84:1 for warning. These are
palette-pair checks, not a full accessibility audit. Hover/focus/document-hidden
timing, queue drain, modal overlap, navigation, narrow layout and reduced motion
remain source-reviewed only. Screen-reader announcement delivery is untested.
Coordinator viewing/source checks used approximately three minutes; combined with
designer two minutes, five of eight aggregate minutes were used, then checks stopped.
No application tests or independent analyst review were run.
