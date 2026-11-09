# Increment 007 — interactive design V1

**9 November 2026 · Proposal for user review.** Direction and prototype preparation
are authorized. This V1 artifact has not been approved for analyst review or
production implementation. The [design-stage brief](../../docs/increments/007-local-retention-and-backup.md)
owns the agreed direction and unresolved boundaries.

## Viewing

From the repository root:

```sh
npx vite --config prototypes/increment-007-v1/vite.config.ts
```

Open <http://127.0.0.1:4197/>. The coordinator may already have this server running;
do not start a second server on its port. No install or root configuration change
is required. Reload returns to the sample projects and discards all simulated work.

The top review strip belongs to the prototype, outside the product interface.
It changes simulated outcomes and loads restore samples. Product actions below
it are the proposed user experience. No browser storage, concurrent-tab ownership,
network service, canonical file representation or real durable write is implemented.
Any downloaded file is prominently named `DTW-PROTOTYPE-…` and carries a simulation
marker. Only this prototype's sample downloads can be selected again.

## Recommended review path

1. Open **Studio foundations**. Edit the Red field and Apply: a brief Saving state
   precedes acknowledgment. Projects → reopen shows the applied edit in the
   simulated retained state. Cancel restores the applied baseline.
2. Enter another value; use **Project backup**. Its dialog says unapplied edits are
   excluded. Downloading does not discard or Apply the draft. Projects departure
   presents Keep editing / Discard edits. Literal/reference draft inputs remain
   independent when switching their tabs.
3. Choose **Retention fails** in the external strip and Apply another edit. The
   applied value is unchanged and the raw input remains. Normal → Apply succeeds.
4. Choose **Write succeeds, readback fails** and Apply. The command was retained;
   its old loaded snapshot is visibly stale and further writes are blocked. Choose
   Normal and Retry reading to see the acknowledged edit, without repeating Apply.
5. Open New token or return to Projects → New project. Type into the form, then
   Cancel or Escape. Keep editing returns to the intact form. A failed creation
   retains entered name/description. Successful creation appears after simulated
   acknowledgment; token creation discloses the opaque-black starting value.
6. Use the external Restore fixture selector and Load sample, or Projects → Restore
   backup then choose an earlier prototype download. Review a project absent
   locally and confirm Restore project. No project is changed by merely loading
   the sample. Reopening preserves its project/token identities and references.
7. Load **Same project · older snapshot**. The preview identifies the local collision
   and offers Open local project, Review replacement or Cancel. Replacement requires
   downloading the current backup and explicitly acknowledging that the older
   snapshot replaces the complete local applied state. It does not merge changes.
   Select Retention fails before replacement to verify the local project survives;
   cancel and reopen it. Normal allows replacement. Selecting the same sample
   after a prior successful restoration also exercises identity collision.
8. Load **Readable · missing reference**, **Unsupported version**, and **Corrupt
   file**. The first can open with visible diagnostics and its missing target
   preserved. The latter two block acceptance without changing the local list.
9. Review **Second tab · inspect only**, **Project read unavailable**, **Browser
   storage unavailable** at Projects, and **Empty project list**. The unavailable
   catalogue is explicitly distinct from an empty catalogue. Normal replenishes
   the starter projects after the empty-list scenario.

The external fixture loader is a review shortcut: it opens the restore preview
directly rather than modelling a second product navigation entry. It may be used
while reviewing the workbench; ordinary project navigation retains its draft guard.

## Design choices represented

- Projects in this browser is the launch surface. One loaded project is open at a
  time; the project-name control and sidebar Projects action provide quiet return.
- Applied authored state is automatically retained; Apply/Cancel remain the editing
  decision. No second Save action is introduced. Session-only raw drafts/forms are
  distinguished from retained applied data and excluded from project backup.
- A coherent loaded snapshot supplies the token list, applied inspector and authored
  data. A simulated write coordinates validation/acknowledgment separately from its
  subsequent readback. Rejected writes preserve prior applied state; successful
  writes with failed readback remain successful and require a read retry.
- Restore is staged: select → preview → confirm. Identity collision changes the
  choices; names and timestamps do not silently establish identity or precedence.
  No overwrite default, copy, remapping or automatic merge is offered.
- Replacement requires current-state protection plus explicit acknowledgement.
  “Download started” does not establish that a recoverable file reached independent
  storage. The checkbox records the user's acknowledgement, not file verification.
- A supported readable project with a missing reference differs from an unreadable
  representation. This illustrates policy, not a complete admissibility validator.
- One writable tab per project is a product policy. The second-tab scenario merely
  demonstrates inspect-only feedback; it does not enforce ownership across tabs.

## Visual, interaction and accessibility intent

The layout reuses the production semantic theme, owned Button and Base UI dialog
shell, with Heroicons Outline. It keeps the accepted neutral Precision palette,
compact controls, project navigation, central token list and contextual inspector.
There is no alternate dashboard visual system. Status uses text independently of
color; failure feedback uses alerts. Dialog containment/Escape behavior comes from
Base UI; forms use native labelled inputs, selects, textarea and checkbox. Guard
Escape returns to editing rather than approving discard. Focus return and small
viewport ergonomics still need runtime review.

`prototype.css` is a prototype-only exception for scoped panel widths, hub width,
token column geometry, native form framing, modal geometry and two responsive
breakpoints. It consumes production semantic variables rather than adding a second
palette. Production styles/components are imported unchanged. This exception does
not approve CSS mechanics or geometry for production reuse.

## Assumptions and outstanding choices

- The editor is deliberately a bounded interaction specimen: one sRGB channel or
  an explicit reference, not the full domain/color editor. Its simple 0–1 input rule
  is sample-only and must not replace the established extended/exact color policy.
  Reference choices are limited to another sample literal token; no general graph
  validation or cycle algorithm is duplicated. All three component drafts, color
  conversion, alias repair and full production creation forms are not reproduced.
- Fixture data contains tokens only; the backup example does not define complete
  canonical coverage, a storage schema or a production migration contract. Existing
  authored values/identities are copied unchanged by prototype backup/restore; the
  absent-project fixture is separately authored sample data. Derived views are not
  written back. Groups, protected/inspect-only data and other supported value forms
  must be covered by a later agreed backup contract rather than inferred absent.
- Sample dates/counts support review; they are not provenance certification.
  Catalogue metadata, backup version labels, filenames, resource limits, corrupt
  data classification and complete diagnostics need analyst/technical specification.
- Actual durable acknowledgment, atomic acceptance, supported browser capabilities,
  persistence representation, single-writer enforcement/crash recovery and read
  retry behavior require technical evidence before implementation agreement.
- Future undo/redo readiness means explicit accepted atomic writes and before/after
  state at the application boundary. This prototype adds no history storage, undo
  controls, inverse commands or history framework.
- Token interchange, cloud/accounts/sync, offline/install, Electron, durable drafts,
  copying and merging remain outside V1.

## Checks and limits

Designer checks: isolated TypeScript strict check and isolated Vite production build
pass. Build output is under `/tmp/dtw-increment007-v1-dist`; root `dist` is preserved.
No dependencies or production code/configuration were changed. No tests were added
for this disposable prototype. Live interaction and visual checks are delegated to
the coordinator's browser session and must be attributed to that evidence; these
source/build checks alone do not establish accessibility or storage correctness.

```sh
npx tsc -p prototypes/increment-007-v1/tsconfig.json
npx vite build --config prototypes/increment-007-v1/vite.config.ts
```

Next stage: surface this actual V1 artifact to the user, iterate on feedback, then
obtain approval for analyst review of the identified revision. Neither prototype
completion nor initial direction agreement authorizes implementation.
