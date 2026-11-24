# Token list disclosure — V1

**User-approved prototype; focused analyst review complete — 24 November 2026.** Isolated, illustrative artifact; no production implementation or change to Increment 024 semantics. The user accepted V1 and authorized review of these two changes only, explicitly excluding implementation. The [focused review](../../docs/planning/token-list-disclosure-review.md) found no material design contradiction or unresolved product decision and records the integration criteria.

## Open

With the existing Vite development server, open `http://localhost:5173/prototypes/token-list-disclosure-v1/index.html`. No additional server is needed. Serving from the repository root allows the prototype to reuse the locally vendored Geist fonts. Directly opening `index.html` also works.

## Review

1. Initially, all three rows show only their source-space coordinates. HEX and alpha remain visible. `400` is selected.
2. Expand **Other color spaces** on `500`. Its four alternative representations appear inline; `400` remains selected. Expand another row independently, then collapse either. This exercises compact and expanded states without changing authored values.
3. Inspect `action`. Its reference target remains visible, and its coordinates say **Resolved · OKLCH**. It has no ramp control: referencing a member is not membership.
4. Activate **Ramp · blue** on `400` or `500`. The saved-ramp destination appears and receives heading focus. **Back to tokens** restores the originating control, selection, disclosure states and page scroll.
5. Use Tab, Enter and Space. Selection, representation disclosure and ramp navigation are separate sibling buttons. Repeat at narrow width: values follow identity, and representations remain available.

## Design decisions

- Preserve neutral Precision styling, technical typography, swatches, three-column coordinate grids and HEX/alpha summaries. Authored coordinates are the default at every width; there is no global view preference.
- Inline disclosure provides comparison beside the token, with independent, session-only per-row state and explicit expanded semantics.
- The primary identity button selects a token. Secondary actions do not select it. Noninteractive row containers avoid nested controls. The prototype intentionally does not make blank row space clickable.
- Ramp membership uses fixture identity metadata, never path inference or resolved alias targets. Its understated text control names the destination rather than relying on a cryptic icon.
- Narrow views stack identity and value; desktop retains Type/Layer columns when space allows. The prototype's simplified surrounding shell is illustrative, not a proposal to change production panel geometry.

## Limits and implementation requirements

The three tokens and displayed conversions are illustrative fixtures, not numerical qualification or generated ramp results. The destination only demonstrates reaching the existing saved-ramp workspace; its two sample members do not define a new recipe, ramp length or authoring policy. No persistence, recipe controls, editing, dirty-state dialog, search or retention behavior is simulated.

Production must use canonical authored/derived projections and `colorRamp.members` stable token identities. Literal summaries use their authored source; alias previews must be labelled resolved and retain unavailable diagnostics. The ramp action must pass through the existing `request()` guard even when a token editor, rather than a ramp, is dirty. Existing unknown-result and unavailable gates remain applicable. Cancelled navigation retains the triggering control and draft. Successful navigation focuses the existing destination appropriately, including narrow browse/inspect mode.

The ramp destination here hides the illustrative token inspector; production must retain its existing ramp inspector. Back is a prototype review convenience, not approval of a new production history mechanism. Preserve current production navigation unless explicitly agreed otherwise.

## Bounded checks

The coordinator checked the desktop presentation, independent disclosure without selection changes, ramp entry with heading focus, and return with originating-control focus and preserved selection/disclosure. Enter collapsed the disclosure. A narrow layout at an observed 582 CSS pixels had no horizontal overflow. [Default preview](../../output/playwright/token-list-disclosure-v1/default.jpg).

JavaScript syntax checking passed. Approximately four minutes of focused browser checks; no production tests, numerical or retention qualification, exhaustive keyboard audit or cross-engine testing. Earlier verification stopping decisions remain closed. No production files, dependencies, staging or commits changed.

Next: user agreement to the reviewed criteria and explicit implementation authorization. Prototype approval and completed analyst review are not production implementation authorization.

Suggested commit: `docs: add token list disclosure prototype v1`.
