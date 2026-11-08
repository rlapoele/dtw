# Increment 006 coordinator browser evidence

8 November 2026. Executor: coordinator, actual in-app browser through CUA. Source: frozen `implementation-manifest-r3.json`; separate development fixture at 5186 and isolated production build at 4186. Existing user tab at 4185 and its build assets were not navigated, reloaded or rebuilt.

## Stateful authoring

- Fixture `protected-color` starts with exact RGB `0.2314`, `0.41234567890123456789`, `0.67890123456789` and alpha `0.1234567890123456789`. Passive byte selection shows 59/105/173 with per-field visible approximation and exact normalized text; Apply remains disabled.
- Green 130 → Apply: actual rendered applied data and canonical JSON show RGB `0.2314`, `0.509803921568627451`, `0.67890123456789`, original alpha retained. Successful Apply resets to the normalized baseline as before.
- Byte view → alpha 0.5 → Apply retains all three RGB strings above exactly. Actual All authored data includes the full ID, original metadata/description/protection and canonical ordered tuple/separate alpha.
- Byte Red `59.5` followed by Green `131`: raw fraction remains, associated error says “Enter a canonical whole number or none”; Apply disabled and preview unavailable. Attempted OKLCH and normalized-scale changes are refused with explicit alerts, without discarding text. Reference → Literal and collapse → expand retain Red `59.5`. Correcting Red to `59` and applying stores only explicitly edited R/G (`0.231372549019607843`, `0.513725490196078431`); Blue and alpha remain unchanged.
- A valid byte Red 60 followed by passive OKLCH is available; editing Lightness to 0.7 then returning to RGB bytes recomputes 97/167/211, replacing the obsolete byte cache. Cancel restores the applied baseline.
- Exact rounding fixtures: `half-ties` renders 26/76/-76; `half-sides` renders 25/77/51. Negative Blue has no slider. `outside-endpoints` renders 0/255/none with exact-source approximation notes; all three RGB sliders are withheld despite rounded endpoint displays. Alpha retains its slider.

## Identity and actual surfaces

- Routine token rows, inspector title and reference choices use names, with no routine raw-ID line. Distinct duplicate/whitespace/empty/placeholder-like choices carry disambiguation hints. Reference DOM options retain their full stable values; placeholders remain distinct.
- Actual reference choices include distinct `duplicate · common-long-prefix-token-a/b`, unnamed empty/fallback IDs, whitespace names, authored suffix-like names, and reserved placeholder-like names. These were inspected in the live native selector, rather than inferred from a helper.
- Alias Resolved & trace renders the actual current resolved literal and full trace identifiers. All authored data remains full canonical JSON. Self-marker collision R1 has independent actual Editor SSR regression/recheck; no separate IAB reproduction of that synthetic case is claimed.
- Fresh production entry at 4186 successfully creates a project and token with description, edits exact normalized RGB to 0.2314/0.5098/0.9647, applies, then passively shows byte values 59/130/246 with exact approximation notes and disabled Apply. Row and inspector have no UUID decoration. This review example is left open in a new deliverable tab, preserving the prior draft tab.

## Layout, accessibility and limits

Inline screenshots were visually inspected for the live production editor and compact fixture. The settled compact IAB viewport measured **477×848**, document width 477: no horizontal document overflow, integer fields about 142 CSS px wide and footer actions within the pane. A requested 320×568 override did not produce that actual viewport, so this is not claimed as a 320px test. Temporary override reset. CUA captures were inline observations, not saved image artifacts.

Controls retain native keyboard semantics, step-one byte sliders and associated approximation/error descriptions. Source tests and the independent reviewer supplement live coverage. Failed-read/commit retry, actual 200% zoom and narrower layout checks are attributed separately in the isolated Chrome report; do not infer them from this IAB pass. No screen-reader session, physical-device/virtual-keyboard or exhaustive cross-engine/color-management validation is claimed. Synthetic rename/missing-reference invariants and opaque-ID edge cases are automated/SSR coverage, not an IAB interaction claim.
