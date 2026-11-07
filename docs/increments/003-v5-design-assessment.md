# Increment 003 — V5 design assessment

**Designer assessment · 7 November 2026 · Option A approved for isolated prototyping; revised artifact awaits user review.**

Context: the user's [three V5 review comments](003-ux-ui-change-capture.md#v5-review-feedback--7-november-2026), [V5 artifact](../../prototypes/increment-003-v1/DESIGN-V5.md), existing source and recorded V5 screenshots. This is a design assessment, not a new browser audit. At assessment preparation no V5.1 prototype changes or build had been made. The user subsequently approved option A for an isolated prototype revision on 7 November 2026. Option B is not selected; analyst review and application implementation remain unauthorized.

## My recommendation

Choose **A: refine the split workbench**. The requests point to a clearer relationship between controls, stronger inspector hierarchy and less navigation overhead. They do not, in my judgment, justify introducing a new editing mode. Keep the existing list/inspector relationship, make the controls compact and legible, and put compact navigation in a modal drawer.

## Component row — common to both options

The requested side-by-side layout is stronger than V5's stacked controls: a user can associate the visual adjustment with its exact value in one glance. The track and number field should share a center line; the component label belongs above the number field.

```text
                                      Hue (°)
  ────────────◇─────────────────    [ 217.3       ]
  0                        359.9
  slider / visual range              exact value
```

Use the same arrangement for alpha. Give the precision field a protected width (about 7rem as a starting point), with the track taking the remaining width. Long decimals remain exact and can scroll horizontally within the focused field; reducing their font to fit or truncating their stored value would be the wrong tradeoff. At a 320px viewport, the inspector's inner width should still accommodate a useful track, a small gap and that field; verify the actual labels, focus outlines and long values before selecting dimensions.

Keep native slider semantics, numeric endpoints, keyboard input and precise text entry. For `none`, incomplete text or a valid coordinate outside the visual range, the left area becomes a short explanation rather than a misleading clamped thumb. The right field remains editable. The track's color remains illustrative; this layout change does not alter numerical or gamut policies.

## A — Split workbench with elevated inspector (recommended)

```text
COMPACT HEADER                   MOBILE WORK AREA
┌───────────────────────────┐   ┌───────────────────────────┐
│ ☰  Token Workbench         │   │ Token list                │
└───────────────────────────┘   │ other rows may scroll      │
                                │ ┌───────────────────────┐ │
menu opens left drawer:         │ │ selected color / 500  │ │ ← fully visible
┌────────────────┐░░░░░░░░░░   │ └───────────────────────┘ │
│ Navigation   × │░ backdrop ░   ├───────────────────────────┤ ← subtle upward shadow
│ All tokens     │░░░░░░░░░░   │ Token inspector       ⌄   │
│ Groups         │░░░░░░░░░░   │ applied / draft colors    │
│ …              │░░░░░░░░░░   │ editing controls ↕        │
└────────────────┘░░░░░░░░░░   │              Cancel Apply │
                                └───────────────────────────┘
```

**Inspector:** keep it at the bottom, taking layout space. A light upward shadow and solid surface should make it read as the foreground editing surface without covering list content. A heavy shadow or floating-card treatment would compete with the restrained workbench design.

**Selection context:** reserve enough list height for a full selected row and its focus outline, then adjust only the list's scroll position after inspector opening/reopening or a token selection changes the available space. Do not move document scroll, steal focus from the inspector, reset drafts or center the row unnecessarily. If the selected token is excluded by the current search/group filter, do not silently change the filter; the exact reveal/context treatment is a detail to resolve in the approved prototype.

**Navigation:** a visible leftmost header trigger opens a left-to-right modal drawer over the workspace. A backdrop makes the temporary mode clear. Use a clear Close control, Escape/backdrop dismissal, focus containment and return to the trigger; reduce or remove slide motion for reduced-motion preferences. Render one interactive navigation surface at a time. Opening/closing navigation alone must not affect the selected token or draft.

**Candidate widths:** retain the persistent left pane on sufficiently wide layouts; try the drawer below **1120px**, where V4 already starts collapsing navigation. This is a sensible candidate, not proof of the best threshold. At the user's 796px sample, removing the left rail gives the list more room while keeping the inspector on the right. At 649px, use the drawer plus the bottom inspector. The current 768px inspector transition can remain a starting point, but the approved revision should assess actual available list/control width rather than treating device categories as a design argument.

**Tradeoff:** two independently scrolling areas retain browsing context but give the editor less vertical space. Short landscape views and the mobile virtual keyboard can make both regions too small. Do not claim that a fixed row ratio solves this; test the reduced viewport and action reachability. If it fails, return with evidence and a focused adaptation instead of silently hiding the selected context or covering fields.

## B — Focus sheet with pinned token context

```text
┌───────────────────────────┐
│ ☰  Token Workbench         │
├───────────────────────────┤
│ selected color / 500       │ ← pinned token context
│ Back to token list        │
╞═══════════════════════════╡ ← elevated sheet
│ Token inspector           │
│ applied / draft colors    │
│                           │
│ editing controls ↕        │
│                           │
│              Cancel Apply │
└───────────────────────────┘
```

Use the same compact drawer and component rows, but let the mobile inspector occupy most of the workspace. A pinned selected-token context row remains visible above it; an explicit return action restores the list. This gives precision editing, longer errors and a virtual keyboard more room.

The cost is substantial: selected context is now a pinned summary rather than the original row visible within the surrounding list. Browsing and editing become distinct modes, with additional return/focus/scroll-restoration behavior. That changes more than the user's requested refinement and is why I do **not** recommend it for this revision unless the user prefers an editing-focused mobile experience. It also needs user agreement on that interpretation of “selected token remains visible.”

## Review decision

Please choose A or B, or revise the recommendation. Then the designer can prepare the approved prototype revision and show it again before analyst review. For A, the prototype check should specifically cover the user's 796px and 649px widths, a narrower mobile viewport, same-level controls, selected-row visibility after opening/reopening, drawer keyboard/focus behavior and retained drafts.

Numerical helpers, canonical data, production dependencies and the existing missing-state coverage remain outside these proposed changes. This assessment does not amend the agreed color policy or authorize application implementation.

## Direction approval — 7 November 2026

The user selected option A and authorized the separate designer to update the isolated prototype, then show the revision before analyst review. This is approval of the direction for prototyping, not acceptance of the resulting artifact, final contract/design agreement or application implementation authorization.
