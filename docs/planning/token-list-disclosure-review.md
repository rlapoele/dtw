# Token-list disclosure — focused analyst review

**24 November 2026 — review complete; implementation not authorized.**

The user accepted [prototype V1](../../prototypes/token-list-disclosure-v1/DESIGN-V1.md)
and authorized review of its two changes only: compact authored-space summaries
with other-space disclosure, and opening a saved ramp from a member token.
No material design contradiction or unresolved user behavior decision was found.
The criteria below are an analyst handoff for agreement, not an implemented or
user-agreed delivery contract.

## Baseline and boundaries

Reviewed branch `dev`, HEAD `328c5f9` (`docs: add token list disclosure prototype v1`).
At review start, the only working-tree change was the coordinator's approval wording
in `prototypes/token-list-disclosure-v1/DESIGN-V1.md`; nothing was staged. The review
covered that document and the prototype's HTML, script and stylesheet, current
TokenTable/TokenValue, TokensWorkbench and RampWorkbench integration, display
projections and authored-coordinate formatting.

Constraints come from [AGENTS.md](../../AGENTS.md), the
[analyst and verification workflow](../workflow/agent-roles.md),
[presentation conventions](../project/presentation-conventions.md),
[architecture](../project/architecture.md),
[Increment 024](../increments/024-color-ramp-authoring.md), its
[metadata/integrity contract](../increments/024-ramp-persistence-and-validation.md)
and the [ramp direction](../project/guided-color-palette-generation.md).
Settled ramp, numerical, retention and history decisions remain closed.
Prototype conversion numbers, boolean membership fixtures and its two-member
destination illustrate appearance; they do not define production data or calculations.
Its Back button is a review convenience, not a new production history mechanism.

## Findings and integration requirements

**Contradictions:** none in the accepted interaction. Two current documentation
statements need coordinator reconciliation: status still says analyst review is
unauthorized, and the historical 19 November color-summary convention says
authored/converted visibility is unchanged. Add a dated scoped supersession for
the approved disclosure direction; preserve the historical record.

**Coordinator disposition:** both documentation inconsistencies were reconciled
on 24 November 2026. Current status records completed review and the remaining
implementation gate; presentation conventions include a dated visibility
supersession. No material prototype revision was required.

**Integration requirements:**

- TokenTable currently renders the entire row as a button. Implement the accepted
  noninteractive row with sibling selection, disclosure and ramp controls; do not
  nest buttons or make a secondary action change the selected token. Preserve
  selection styling, descriptions, type/layer facts and protection markers.
- TokenValue currently computes all spaces from `row.preview`. Use the authored
  literal (`row.color`) for its source summary and the resolved preview for aliases.
  Keep existing formatting, HEX/alpha interpretation, conversion boundary and
  unavailable/reference diagnostics. Resolved coordinates must not look authored.
- Derive membership from current project groups' `colorRamp.members` token IDs.
  A path match, containment alone or an alias targeting a member is not membership.
  Display the destination's current identity label and open its existing group view.
- Keep the navigation action in TokensWorkbench's coordination boundary. Its
  existing namespace callback guards departure only when `activeRamp` is set;
  copying that condition would bypass a dirty ordinary token editor. The new
  action must use `request()` regardless of which editor is dirty, retain existing
  unavailable/unknown-result gates and use the existing departure choices.
- Successful navigation must expose and focus the existing ramp workspace in
  narrow mode as well as desktop, retaining its inspector. Cancelled departure
  keeps the draft and restores the initiating control. Read-only/incompatible ramp
  states continue through the existing ramp behavior; opening is not regeneration.
- Keep disclosure state session-only and associated with token identity. Preserve
  editor caller/key/lifetime and command ownership. Reuse semantic Tailwind styles,
  owned controls and shared Heroicons rather than copying prototype CSS or glyphs.

**Unresolved user decisions:** none identified within these two changes. Final
agreement on this handoff and explicit implementation authorization remain required.

**Optional polish:** none required before implementation; no additional visual
variants, persistent display preference or navigation history are proposed.

## Observable acceptance criteria

1. A literal color row initially shows its authored-space coordinates, HEX and alpha
   at every supported layout width. Other spaces remain collapsed; expanding them
   changes neither authored data nor the ordinary token editor's draft.
2. A resolved color alias retains its target and labels the visible coordinates
   `Resolved`; it never claims an authored literal space. Missing/unresolvable
   references and unavailable conversions remain visibly unavailable, without
   fabricated coordinates or lost diagnostics. Non-color rows retain their behavior.
3. Each color row's disclosure works independently with keyboard and pointer,
   exposes expanded/content semantics and retains visible focus. Opening or closing
   it does not select a token; selecting a token uses the separate identity control.
   The three-column coordinates remain readable at narrow width.
4. Only explicit stable-ID ramp members expose the ramp action. An ordinary token
   in the same group and an alias referencing a member do not acquire membership.
   Renaming a ramp group updates its label without breaking its destination.
5. Activating the action opens the existing saved ramp with its saved state and
   inspector, without regeneration, persistence writes or silently selecting a
   different token first. Narrow layout reveals a usable destination and focus.
6. From a dirty ordinary token editor, ramp navigation uses the existing departure
   guard. Cancel leaves the draft, selection and trigger intact; permitted departure
   proceeds only after the existing chosen action succeeds. Existing busy,
   unavailable and unknown-result restrictions are not bypassed.
7. Existing row facts, selected indication, non-color summaries and production
   navigation remain available. No new Back/history mechanism, persisted disclosure
   preference, ramp semantics or editor lifetime change is introduced.

## Verification handoff and stopping point

This review used approximately five analyst minutes of source/document inspection,
zero harness repairs. It adds to the prototype's recorded approximately four minutes
of focused browser checks; coordinator effort is additional. No browser, tests,
numerical calculations, retention or cross-engine qualification ran here. Source
inspection establishes integration requirements, not runtime conformance.

After authorization, keep checks focused on these criteria: representative literal,
alias and unavailable summaries; independent controls; actual membership after a
group rename; dirty-token Cancel and successful departure; desktop and narrow focus.
Use targeted component/integration checks and a short browser pass under a coordinator
budget. Do not restart earlier stopped qualification or broaden into ramp arithmetic,
stress, compatibility or unrelated navigation repairs.

Only this report was written by the analyst. Staging, committing and pushing remain
user-owned. Suggested commit: `docs: record token list disclosure analyst review`.
