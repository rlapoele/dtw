# Increment 007 — interactive design V3 supplement

**9 November 2026 · User approved V3 for renewed analyst review; final corrective snapshot awaiting coordinator identification.**
The user approved the [assessment direction](../../docs/increments/007-post-qualification-design-assessment.md)
and authorized this isolated prototype after assessment commit `50d9f67`. This is
an interactive proposal, not final design/contract agreement or implementation.
The user subsequently approved V3 for renewed analyst review, accepting prototype simplification for retention/recovery validation. That approval does not authorize implementation.
[Draft AC-1–19](../../docs/increments/007-local-retention-and-backup.md) and the agreed
[coverage](../../docs/increments/007-backup-coverage-and-restore-policy-proposal.md),
[storage](../../docs/increments/007-storage-acknowledgement-and-concurrency-proposal.md)
and [resource](../../docs/increments/007-format-decoder-and-resource-proposal.md)
policies remain authoritative. V1/V2 are unchanged historical artifacts.

## View

From the repository root:

```sh
./node_modules/.bin/vite --config prototypes/increment-007-v3/vite.config.ts
```

Open <http://127.0.0.1:4217/> in a **fresh** tab/context. Port 4217 is strict;
if occupied, identify the owner rather than killing another process. No server
was started by the designer. Isolated cache: `/tmp/dtw-increment007-v3-vite-cache`.
Build output: `/tmp/dtw-increment007-v3-dist`; root `dist` is untouched.

The external review strip is outside the product. Selecting a new supplemental
workspace scenario loads its small disposable fixture and replaces previous test
inputs. Choose the scenario before interacting with its product controls; do not
use fixture switching as a product recovery action. Reload resets the simulation.
Original V2 failure scenarios still use their documented Normal → Retry reading path.
No actual IndexedDB, lock, portable codec, worker or receipt protocol runs. Current production domain/readback/preview helpers handle small ordinary fixture values only; resource refusal and costly evaluation remain simulated.

## Review routes and expected behavior

All names below are exact external **Review scenario** / **Restore fixture** labels.

| Scenario / route | Product action and expected result |
| --- | --- |
| Restore fixture **Resource · incoming backup refused** → **Load sample** | Restore shows “This backup exceeds the supported limit. No project was changed.” **Choose another file** targets the native file input; **Limit details** shows byte units. There is no successful preview/Restore action. Cancel preserves prior work. |
| **Resource · ordinary edit refused** | The editor opens with draft `0.25`. **Apply changes** refuses the whole candidate, keeps applied data and the complete raw color draft, and exposes **Limit details**. Change the input to `0.3`, then Apply to exercise a revised candidate. Repeating the unchanged candidate remains refused. |
| **Resource · create form refused** | A token form opens with exact surrounding spaces/description. **Create token** refuses and preserves fields; details use UTF-16 code units. Change the name before retrying to simulate a revised admissible candidate. No native maxlength/truncation. Cancel/Escape invokes the discard guard. |
| **Resource · retained record unavailable** | Opens an unavailable body, not an empty project. **View details** explains unsupported size; **Project backup** refuses a complete backup. **Projects** remains available. No useless retry of an unchanged deterministic cap. |
| **Resource · backup representation refused** → open Studio → **Project backup** → **Download backup** | Whole-backup refusal stays in the existing modal. No file is created; Download is disabled after deterministic refusal. Cancel preserves applied state and drafts. |
| **Resource · project capacity refused** → **New project** → enter name → **Create project** | No new project is created; the exact form remains. **Limit details** states 25 records and the attempted 26th. No delete/clear-storage workaround. |
| **Derived calculation unavailable** | Selects `size.calculated`. Inspector distinguishes exact authored expression from **Resolved value unavailable**. **View authored value** opens/focuses existing details. Header **Project backup** downloads the complete specimen including AST, numeric source and groups. No AST evaluation or flattening occurs. |
| **Diagnostics report incomplete** | “Some diagnostics are not shown.” with no invented total or all-clear. Select `color.content.primary` for readable missing-reference details. **Report details** explains display-only limits; no show-all/admissibility bypass. |
| **Recovered literal · baseline changed** | Old applied Red is `0.231372549019607843`, current is `0.42`, raw draft is `0.`. **Review edit** reveals old/current/input in place. Invalid draft blocks **Reapply changes**. Enter `0.3`, then Reapply once; no automatic apply/rebase. Literal color/Reference toggles preserve both complete drafts. |
| **Recovered reference · baseline changed** | Current alias now targets `t-surface`, preserved reference draft targets `t-brand`; independent literal draft is `0.`. **Review edit** shows both exact identities; **Reapply changes** explicitly restores the selected reference after the review. It does not replace it with a resolved literal. |
| **Recovered creation · parent changed** | Creation form preserves exact entered name/description. **Review changes** shows previously selected/current parent name and exact same parent ID `g-color`; then **Create token** submits once. No root fallback or retargeting. |
| **Recovered rename · group changed** | Group form preserves `  Foundations draft  `. **Review changes** shows previous/current/entered name; **Rename group** submits once and preserves group identity. This is existing group rename, not project rename. |
| **Recovered edit · target removed** | Removed target keeps both literal/reference inputs readable/selectable in the inspector. **Apply changes** stays disabled. **Discard edits** opens the safe guard; no recreation or other-target shortcut. |
| **Recovered edit · target ineligible** | Original token is now component-associated/inspect-only. Same raw-input behavior, explicit reason and unverified ownership notice; no mutation or reference flattening. |
| **Interrupted · result check fails** → open Studio → change Red → **Apply changes** | After pending, **Check retained result** keeps the result unconfirmed and preserves input; no duplicate Apply. **Review before leaving** opens the existing departure surface, initially **Stay here**. **Leave project** discards session input only after the simulated safe-exit condition, without claiming rollback; no candidate is replayed. |
| **Interrupted · exit not yet safe** → same edit/Apply/recovery route | The departure review explains the same uncertainty but disables **Leave project**. Stay here/Escape returns to the preserved input; check remains available. External **Simulated safe exit** controls only the fixture condition. This is not a product setting or proof of a dispatch fence. |
| **All content · broken namespace / opaque identities** | Opens a project with empty ID. **All content** is always below **All tokens**; the diagnostic notice also links there. All tokens/groups, including empty/unreachable/cyclic groups, are selectable by kind and exact ID. Root token ID `""` has null parent; token `"shared"` has parent `""`, distinct from root and the group `"shared"`. |
| In that All content fixture select **Orphan group**, **In cycle**, **Empty group**, **button.foreground**, or the whitespace-named reference | Inspector shows unavailable paths with reasons, complete exact identity/context details, raw authored data and component notice. The whitespace token references target ID `""`, preserved as an alias. No fabricated partial path, reparent, repair, move or delete. |
| Normal → open Studio → **All content** | Quiet always-available secondary navigation; healthy **All tokens** remains intact. New content view uses the same workbench/inspector rather than a recovery dashboard. |

## Interaction and fidelity

V3 retains V2's Projects, name validation, restore preview/collision/protection,
known-rejected/known-retained/read-unavailable and inspect-only specimens. Existing
new-project name rules still apply only to creation; supported restored unnamed
projects retain their exact name. Backup initiation never proves independent recovery.

The final corrective pass reuses the current production TokenList, ColorFields, AuthoredValue, session, preview and readback helpers through a small read-only fixture adapter. Added states reuse the neutral Precision semantic theme, existing owned Button and
DialogContent, Base UI focus containment and Heroicons Outline. `@source` includes
the production presentation directory and all prototype TSX files. No dependency was added.
New CSS exceptions are limited to prototype list/context geometry, source wrapping,
selectable raw text and compact layout; colors remain semantic variables.

Routine feedback stays local. Details carry byte/string counts and exact IDs;
normal product labels do not expose worker/protocol concepts. Literal/reference
raw drafts remain independent, including invalid `0.`. Full authored color space, all three components and alpha survive Apply and sample backup; view-space and integer/normalized entry controls use the existing production helpers. Read-only raw input supports
native selection. Identity selection distinguishes null from empty IDs and kind
from kind; escaped identity display does not alter authored text.

Review edit opens a comparison; Reapply changes is the single explicit submission.
Changed forms use Review changes then their existing Create/Rename action. Recovered
writes still have validation/eligibility gates. Namespace/reference-invalid fixtures
refuse normal candidate writes without globally disabling eligible color fields.
This is a limited fixture policy, not progressive repair or a production validator.

Guard initial actions are Keep editing/Stay here. Escape never discards or accepts
replacement. In-form discard cancellation returns to its name field; draft guards
return to the retained editor where present. Review headings receive focus when
revealed; source details summary receives focus when opened. Removed-target return
falls back to the stable header when the original field no longer exists. These are
intended source behaviors awaiting actual coordinator browser verification.

## Specimen boundaries

- Resource counts are **fixed scenario observations** representing the agreed real
  thresholds. Tiny test inputs do not really reach those counts. No enormous file,
  AST or diagnostic collection is allocated. The valid small AST stands for a costly
  admitted expression; it is not evidence its own evaluation actually exceeds a cap.
- Incoming file selection additionally rejects actual files larger than 16 MiB;
  all other sample parsing remains a minimal simulation, not the agreed decoder.
- Samples use `DTW007-SIMULATION`, filename `DTW-PROTOTYPE-V3-….json`, and a UI-shaped
  complete specimen. They are not canonical backup syntax or DTCG. Full clone includes
  groups, exact specimen values/ASTs, aliases and association IDs, never editor drafts.
  Generated samples round-trip only within this prototype's limited sample parser.
- Recovery compares a live previous/current/input specimen. It has no durable drafts,
  history, undo, merging, profiles, sync or general repair facility. A successful small
  edit does not prove full application/domain validation or concurrency safety.
- Unknown-outcome departure uses a simulated safety condition. Application eligibility,
  dispatch fencing, terminal observation and preventing late publication into another
  project remain production-integration requirements. Leave does not cancel an issued
  transaction; reload/close may lose drafts and no command verdict is reconstructed.
- Stage A remains partial. Worker placement, pending scheduling, remaining exact-build
  browser/OS/lifecycle/file qualification and final contract agreement stay separate.
  No browser support claim, storage permanence or full accessibility proof is added.

## Checks and handoff

Designer source checks:

```sh
./node_modules/.bin/tsc -p prototypes/increment-007-v3/tsconfig.json
./node_modules/.bin/vite build --config prototypes/increment-007-v3/vite.config.ts
```

Both pass. Output/cache are isolated under `/tmp`; no root tests were rerun for this
prototype. No browser was opened or user session inspected/reloaded by the designer.
Coordinator browser observations/manifests belong separately under
`output/increment-007-prototype-v3/`; no fresh keyboard/compact/zoom/screen-reader or
usability result is claimed here. Source/local links/whitespace reviewed. Production,
V1/V2, Stage A, root dependencies/configuration/tests and Git index remain unchanged.

Edits are frozen for coordinator snapshot identification and renewed analyst review. The user approved this review stage; it is not final design/contract agreement or implementation authorization. Suggested
human-owned commit: `design: prototype increment 007 recovery and resource states`.

## Production baseline preservation and final correction

The reduced V2-derived workspace initially omitted current production controls and
list content. That was a prototype regression, not an approved product change.
The user accepted simplification for validating retention/recovery and approved
renewed analyst review; **no prototype simplification authorizes removing or changing
production swatches, descriptions, layer/type/role information, exact inputs, sliders,
color-space/entry-scale controls, previews, aliases or other existing workflows**.
The analyst must carry preservation into the resulting contract and implementation.

| Baseline concern | Final isolated artifact / remaining limit |
| --- | --- |
| List swatches, description, layer/type, authored values | Current production TokenList reused, including responsive description handling. Fixture tokens carry layer/role metadata. |
| Full color editing | Current production ColorFields and DraftSession reuse all three components, alpha, sliders, five views and normalized/integer RGB scales. Applied candidate and backup retain the full literal, metadata and alias distinction. |
| Applied/draft context | Owned Swatch plus production preview helpers, explicit applied and draft specimens. |
| Applied inspection and metadata | Current AuthoredValue; description, layer, role, regeneration, raw data and owned Authored / Resolved & trace tabs. |
| Retention/recovery integration | Prototype composition retains raw sessions until simulated acknowledgement; production Editor is not reused unchanged because its synchronous Apply completion would misrepresent pending/unknown outcomes. Complete recovered values appear in comparison. |
| Existing group navigation/creation and full application shell | Still simplified prototype surfaces. No removal or change of these production workflows is authorized; this is not a complete visual/behavioral parity certification. |

The final corrective source passes isolated strict TypeScript and Vite build. No
fresh browser pass of that corrective composition was performed by the designer;
earlier coordinator evidence predates it and must not be described as its runtime
verification. No production source, dependency, test, V1/V2 or Stage A change occurred.
