# Increment 008 coordinator Chrome smoke — 12 November 2026

Snapshot: base `9ce3622` plus the unchanged 20-file source/test manifest in
[snapshot.sha256](snapshot.sha256). Actual Google Chrome driven by the installed
Playwright CLI against local Vite at `http://127.0.0.1:5173/`, isolated CLI session
`dtw008`. This is coordinator evidence, separate from independent source review.

## Observed

- Project catalogue loaded; created a project and root color token through the UI.
  Creation dialog initially focused Name; token creation retained and selected it.
- Exact noncanonical raw text `0.2500` survived literal/reference switching and
  inspector collapse/expand (explicit assertions). Apply rejected noncanonical text
  with the existing validation message and focused the error. This was an invalid
  input check, not a successful Apply.
- Dirty departure opened Discard unapplied changes, initially focused Keep editing.
  Keep editing preserved raw text `0.37500` (explicit assertion).
- Canonical `0.25` applied; applied specimen text and Changes applied and retained
  status were observed. Focus afterward was document body, not Literal color.
  This remains an unresolved AC-7 observation. Source has the same immediate
  modeRef focus call in baseline and extracted hook; attribution was not established.
  Do not claim successful Apply focus preservation or silently accept this criterion.
- A subsequent edit to `0.5` followed by Cancel reset to applied `0.25` and focused
  Literal color (explicit assertions).
- At 640×900, compact navigation control appeared; drawer opened and Escape closed
  it (dialog visibility assertions). Inspector remained usable at this width.

No screenshot comparison, comprehensive keyboard containment, creation/departure
form-error routing, real delayed readback refresh, restore replacement/protection,
exceptional storage/lifecycle or additional-engine smoke was performed. No blanket
visual parity or real React lifecycle qualification is claimed.

## Tooling and budget

The npx wrapper did not return promptly and was stopped; the cached installed CLI
worked after sandbox escalation for its cache and Chrome launch. Count conservatively
as one bounded tooling-recovery cycle, within the shared two-cycle cap. No application
code, browser trust setting or dependency was changed for automation. Reviewer native
Chrome stall is recorded separately and included in that agent's consumption.

Coordinator verification/tooling/document review estimate: approximately 7–8 minutes.
Combined developer 7 + reviewer 14.5 + coordinator 7–8 = approximately 28.5–29.5
aggregate minutes, one recovery cycle. Stop verification now; no allowance reset.
