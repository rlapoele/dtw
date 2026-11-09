# Increment 007 prototype V1 — coordinator observations

9 November 2026. Design proposal only; not analyst review or production delivery.
Baseline production commit: `4171dbc`. The separate designer wrote only
`prototypes/increment-007-v1/`; coordinator changes record direction and handoff.

## Fresh checks

- Isolated prototype strict TypeScript check passed:
  `./node_modules/.bin/tsc -p prototypes/increment-007-v1/tsconfig.json`.
- Isolated Vite build passed:
  `./node_modules/.bin/vite build --config prototypes/increment-007-v1/vite.config.ts`.
  Output targets a temporary directory, not production `dist`.
- `git diff --check` passed. No production source, dependencies, root configuration
  or historical prototype changes were present.
- Coordinator operated a fresh in-app browser tab. Existing sessions were not
  opened/reloaded. The disposable test session was reset at the end so the retained
  deliverable tab presents the initial Projects view. Viewport override was reset.

## Observed interactions

- Opened Studio foundations from Projects. Corrected shared Button geometry was
  visually inspected after fixing isolated Tailwind source discovery.
- Entered Red`0.42`, selected Retention fails and applied. Pending state blocked
  navigation/selection/actions. Failure retained draft`0.42`; the applied row and
  inspector stayed at`0.231372549019607843`.
- Opened Project backup with that unapplied draft, downloaded an explicitly marked
  prototype sample and inspected its JSON. Its marker was`DTW007-SIMULATION`; the
  saved Red remained`0.231372549019607843`, excluding draft`0.42`. Download did not
  apply or discard the draft. Projects departure offered Keep editing/Discard
  edits; Keep editing returned to the preserved draft.
- Simulated successful write/readback failure. The old applied snapshot remained
  visible, status identified retained data with unavailable display, and mutation
  controls were blocked. Switched to Normal, then Retry reading: applied row,
  inspector and draft baseline became`0.42` without repeating the write.
- Typed an unfinished New token name; Cancel presented the departure guard.
  Keep editing preserved the entered name; Discard edits closed it.
- Loaded absent-project restore fixture. Preview appeared before any write;
  Restore project opened Archive foundations with Red`0.12` after acknowledgement.
- Loaded same-identity older fixture. Preview offered Open local project,
  Review replacement and Cancel. Replacement required a current backup download
  followed by explicit checkbox acknowledgement; Replace was initially disabled.
- Attempted acknowledged replacement under Retention fails. Failure stayed in the
  review flow. Back → Open local project showed Studio foundations still at`0.42`,
  rather than the selected old snapshot's`0.12`.
- Unsupported version and Corrupt file fixtures displayed distinct blocking
  messages with no Restore action. Cancelling returned to unchanged projects.
- Second-tab scenario displayed Inspect only and disabled authoring. Browser
  storage unavailable at Projects displayed a catalogue failure distinct from an
  empty list, with Retry opening and disabled creation/restoration.

## Corrections during preparation

The designer corrected missing shared Tailwind utility generation, hardcoded
backup-date display, and pending-write navigation. Coordinator testing then found
scenario switching hid Retry reading while stale state remained; the designer
preserved the recovery banner, and coordinator re-executed the failure → Normal →
Retry reading route successfully. No production code was changed for these fixes.

## Visual evidence and limits

- [Projects screenshot](projects.png) — final default review entry view.
- [Replacement screenshot](replacement.png) — explicit protection/acknowledgement.
- Compact Projects view measured477×1075 CSS pixels, scrollWidth477. Requested
  viewport320×720 did not produce those exact dimensions; no320px claim is made.
  The compact layout was visually inspected and the override reset afterward.

This is scoped prototype verification by the coordinator, not independent analyst,
implementation review, formal accessibility verification or browser persistence
qualification. The app's production test suite was not rerun because production
code did not change. Real retention, concurrency ownership, canonical backup schema,
validation completeness, resource budgets and migration behavior remain unresolved.
Successful project creation, complete successful replacement, actual file-picker
restore, missing-reference acceptance, exhaustive keyboard/focus, compact workbench,
screen-reader, physical-device and cross-engine paths were not runtime-certified.
They remain available prototype scenarios or later contract work, not proven
production behavior. Reload intentionally resets all prototype data.
