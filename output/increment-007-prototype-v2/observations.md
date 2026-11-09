# Increment 007 prototype V2 — coordinator observations

9 November 2026. V2 is a design proposal for user review before renewed analyst
review. Baseline `d6fc1e0`; production remains at maintenance `4171dbc`.

The separate designer created `prototypes/increment-007-v2/` without changing V1.
Coordinator verification used a fresh in-app tab on a separate prototype server.
The user's existing V1 session was not inspected, reloaded or changed.

## Fresh verification

- Isolated strict TypeScript check passed:
  `./node_modules/.bin/tsc -p prototypes/increment-007-v2/tsconfig.json`.
- Isolated Vite build passed:
  `./node_modules/.bin/vite build --config prototypes/increment-007-v2/vite.config.ts`.
  Output targets a temporary directory, preserving production build output.
- V1's six files were checked against its frozen manifest and remain unchanged.
  No production source/tests/dependencies/root configuration changes were present.

## Observed prototype behavior

- Empty and whitespace-only new-project submissions stayed in the form, showed
  the associated error and focused the name field. The whitespace input remained
  exact. The field retained its stable accessible name after invalid submission;
  `aria-invalid` was true and `aria-describedby` referenced the error.
- Creating `"  Étude  "` retained that exact header text, including spaces/Unicode.
  Ordinary creation reached an acknowledged empty project; this is distinct from
  the unavailable state below.
- Creation under known-retained/readback-failure showed **Project retained ·
  content unavailable**, with Retry reading and no token-empty claim. Switching
  to Normal and retrying opened the same accepted project without recreating it.
- Absent-project restoration under that failure showed the same unavailable body,
  with neither “No tokens yet” nor content from another project. Retry published
  the accepted Archive foundations snapshot, Red`0.12`.
- Interrupted creation preserved the form and disabled duplicate Create/Cancel
  while exposing Check retained result. Accepted reconciliation completed once;
  Projects showed exactly one Interrupted sample entry. Rejected reconciliation
  retained Rejected sample in the editable form and enabled correction/retry.
  Explicit Cancel → Discard edits then returned to Projects without obsolete
  “your edits are still here” feedback.
- Ownership-loss editor fixture preserved raw`0.` and disabled unsafe writes.
  Check access and latest state recovered editing access without normalizing or
  replacing the raw draft.
- Ownership-loss form fixture displayed its retained token name/description and
  blocked Create. Escape opened the discard guard; Keep editing returned focus to
  the intact name. Explicit discard closed the form. The final fixture resets
  unrelated editor state when loading this scenario; it does not inject a hidden
  second editor draft.
- Replacement-change fixture stopped acceptance after a simulated external change
  increased local content from3 to4 tokens. The prior backup protection and checked
  acknowledgement were cleared; checkbox and replacement were disabled until
  renewed protection. No replacement was accepted by that conflicting action.
- Backup-preparation failure stayed in the modal with explicit feedback. Cancelling
  returned to the unchanged applied value and raw invalid draft`0.`.
- Compact name-error dialog measured477×1075 CSS pixels, document scrollWidth477;
  the name field remained visible/focused. Requested320×720 did not yield those
  dimensions, so no320px coverage is claimed. Override was reset afterward.

The coordinator's disposable V2 data was reset at completion; the deliverable tab
opens the initial Projects view. Prototype reload intentionally resets simulation.

## Corrections during the browser pass

The designer moved the name error outside its wrapping label to prevent changing
the accessible name, while preserving description association and focus; the
coordinator rechecked empty/whitespace rejection with the exact field name.
The designer also cleared obsolete form feedback after explicit discard and
separated the ownership-form fixture from an unrelated raw-editor specimen.
The rejected-outcome → discard path was re-executed successfully after that change.

## Visual evidence

- [Required-name feedback](required-name.png).
- [Retained but first-read unavailable](first-read-unavailable.png).
- [Changed local revision invalidates replacement protection](replacement-changed.png).

## Limits and stage

These are coordinator prototype observations, not renewed analyst approval,
independent implementation review or a production acceptance report. Actual storage,
unknown-outcome reconciliation, cross-tab ownership and revision safety are not
implemented or qualified. R-1 and contract D-1–D-6 remain unresolved.

Other available scenarios, including duplicate-name creation, actual unnamed-file
round trip, download-initiation failure, catalogue loading/open failure, stale-draft
recovery and complete renewed-protection replacement, were not all exercised in
this browser pass. They remain documented specimens rather than certified behavior.
The full production suite was not rerun for this isolated prototype/documentation
change. No actual200% page zoom, screen-reader, physical-device/virtual-keyboard,
cross-engine, complete compact workbench or exhaustive focus traversal was checked.
Name blankness, recovery and duplicate-name presentation remain V2 proposals for
final agreement. No production implementation, staging, commit or push occurred.
