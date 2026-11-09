# Increment 007 — interactive design V2

**9 November 2026 · User review pending.** V2 preparation is authorized; renewed
analyst review, final design/contract agreement and implementation remain pending.
This separate revision preserves [V1](../increment-007-v1/DESIGN-V1.md) unchanged.
The [draft increment](../../docs/increments/007-local-retention-and-backup.md) owns
the scope; [V1 analyst review](../../docs/increments/007-design-review.md) identifies
R-1–R-6. V2 illustrates required new-project names and the missing recovery states.
It does not settle R-1 or D-1–D-6.

## View the prototype

From the repository root:

```sh
npx vite --config prototypes/increment-007-v2/vite.config.ts
```

Open <http://127.0.0.1:4207/> in a **fresh tab**. The coordinator may already have
the server running. Preserve the V1 user session on port 4197.

The external review strip selects simulated outcomes and restore fixtures. Choose
the scenario before starting its product action. The product surface begins below
that strip and its workflow note. Reload resets all simulated data. No browser
retention, real concurrent tab, storage protocol or canonical schema is implemented.
Downloads are clearly named prototype samples carrying a simulation marker; the
file selector accepts those samples only. Their shape is not a schema proposal.

## Review paths

| Question / finding | How to reach the V2 state | Expected proposal |
| --- | --- | --- |
| Required name, AC-19 | Normal → New project → submit empty or spaces | Actionable field error, associated with name input; focus returns to that input; no project is created. Enter a name with surrounding spaces/Unicode to retain its exact text. |
| Duplicate names, AC-1/19 | Create another `Studio foundations`, then Projects | Both projects remain; their full stable IDs distinguish identical names. Uniqueness is not required. |
| Existing unnamed data | Restore fixture: Existing unnamed project → Load sample → Restore project | Existing empty authored name remains unchanged; truthful `(unnamed project)` fallback; it can reopen and be backed up. New-creation rule is not retrospective. |
| Rejected write, R-5 | Open Studio → Retention fails → edit Red → Apply | Prior applied value and entered raw draft survive. Normal → Apply can retain it. Failed new-project/token creation also preserves the form. |
| Retained/stale snapshot, R-4/5 | Open Studio → Write succeeds, readback fails → edit → Apply | Known retained write is distinct from failure. Previous same-project loaded snapshot remains visible; writes block. Normal → Retry reading publishes accepted state without repeating Apply. |
| Retained/no snapshot, R-4 | From Projects: Write succeeds, readback fails → New project → valid name → Create | Dedicated “Project retained · content unavailable” body; no empty tokens table, no “No tokens yet,” no assumed empty project. Normal → Retry reading opens the accepted project, once. |
| Retained/absent restore, R-4 | Write succeeds, readback fails → absent-project fixture → confirm Restore | Same unavailable body; no unrelated previously loaded project's content appears. Retry is a read, not another restoration. |
| Failed first open, R-5 | Projects → Open fails · no snapshot → open a project | Dedicated unavailable body, retained data unchanged. Normal → Retry reading; Projects return remains available. |
| Catalogue lifecycle, R-5 | At Projects select Catalogue loading, Browser storage unavailable, then Empty project list | Waiting, failed read and genuinely empty examples differ. Catalogue failure offers Retry opening and never initializes an empty list. Empty-list scenario is an explicit external simulation reset. |
| Backup lifecycle, R-5 | Open a project → Backup preparation fails or Download initiation fails → Project backup → Download | Error remains inside the modal, draft/applied state unchanged. Cancel → Normal → reopen backup to retry. Initiation never claims verified independent file recovery. |
| Unknown outcome, R-5 | Interrupted · later confirmed retained/rejected → create named project, apply edit, or accept restore/replacement | Pending acceptance becomes an unconfirmed outcome. Draft/form is preserved, duplicate writes and departure block. **Check retained result** is available inside any open modal and in the workbench. Confirmed accepted completes that same candidate once; confirmed rejected retains inputs and permits correction/retry. Reconciliation returns the external scenario to Normal. |
| Ownership lost with editor, R-5 | Access lost · raw editor draft | Opens Studio with raw `0.` preserved, unsafe writes blocked. Check access and latest state refreshes the coherent applied snapshot without replacing the draft. Correct/review the draft before Apply. |
| Ownership lost with form, R-5 | Access lost · unfinished form | Opens token creation with intact name/description. Recovery action remains accessible inside the modal. Creation stays blocked until the check succeeds; Cancel/Escape uses the explicit discard guard. |
| Stale expected revision, R-3/5 | Stale revision · raw draft | Raw edits survive; check latest state before writing. This is a simulated conflict policy, not revision/ownership enforcement. |
| Replacement revision race, R-3 | Replacement · local state changes → same-project fixture → Review replacement → Download current backup → acknowledge → Replace | At acceptance a simulated external change adds a local token. Replacement stops; previous backup/acknowledgement are invalidated; updated local count/time are shown. Review and download a new current backup, acknowledge again, then replacement can proceed. No mutation is caused by preview; the changed data models another writer, not restore acceptance. |
| Diagnostics/admissibility, R-2 | Load readable missing-reference, unsupported version, corrupt file fixtures | Readable supported missing reference is preserved and visible; unsupported/corrupt examples block. This is illustrative classification, not the full agreed allowlist/decoder. |

Normal V1 paths remain: create/open/reopen, one workbench, literal/reference draft
specimen, Cancel/Apply, backup excluding drafts, identity-preserving restore,
same-ID Open local / Review replacement / Cancel, and inspect-only second-tab state.

## Design interpretation

Project-name blankness is tested on submit without trimming accepted text, changing
case or generating a fallback name. The rule concerns **new creation only**. The
choice of blankness policy and duplicate-name identity presentation remains a V2
proposal for final agreement. This prototype does not implement the production
application-command validation required by AC-19. Token/group naming is unchanged.

Recovery distinguishes a rejected command, a known retained result with unavailable
readback, and an unconfirmed outcome. It avoids treating a lost acknowledgment as
rollback. Reconciliation is a simulated read of an outcome held by the prototype;
it neither resubmits nor generates another identity. The product labels do not
expose the simulation mechanism. While outcome is unresolved, this V2 deliberately
blocks in-app departure until reconciliation; exact interruption/browser-exit policy
remains D-1/D-5 work.

Project content appears only from one coherent loaded snapshot belonging to the
active project. A newly accepted project with unavailable first read has a dedicated
body. A failed read never fills it with an old different-project snapshot or an
empty project claim. Known metadata can identify the project without claiming its
contents were read. Retried reads preserve an existing raw draft where applicable.

Ownership/revision recovery keeps raw fields and unfinished forms. The recovery
button simulates successful reacquisition/refresh, never automatic takeover. Its
mechanism and whether a fresh comparison/rebase is needed for a real concurrent
edit remain unqualified. Replacement protection is bound to the current simulated
revision; a changed revision invalidates both protection and acknowledgement.

## Interaction and presentation

The accepted neutral Precision layout and production semantic theme are reused.
Owned Button/DialogContent and Base UI dialogs remain unchanged; Heroicons Outline
is the icon family. Explicit Tailwind source discovery includes the production
owned components, preserving their utilities under the isolated V2 root.

Names/errors use native labels, `aria-required`, `aria-invalid` and an error
description. Feedback uses textual statuses/alerts. A discard guard initially
focuses Keep editing. Cancel/Escape never accepts replacement or discard; replacement
Escape returns to the restore preview. Form-guard cancellation returns focus to
the intact name field. When dialogs close, focus returns to the editor field when
available, otherwise the stable product header. Runtime focus verification remains
necessary; primitive reuse does not establish accessibility.

Prototype-only CSS exceptions remain scoped panel/modal geometry, native form
framing and compact breakpoints. V2 also wraps the external scenario strip and
modal actions on narrow screens. Semantic variables remain the only palette;
these geometry choices are not approved production CSS.

## What this does not settle

- R-1 / D-2: token-only sample data does not specify complete supported backup
  coverage. Groups, supported inspect-only/protected/incomplete tokens, exact
  metadata, other implemented value forms and associated context still need the
  explicit preservation matrix. No silent omission policy is approved.
- R-2 / D-3/D-6: missing-reference fixture and minimal sample-file checks are not a
  complete runtime decoder, identity/ownership check, resource policy or diagnostic
  allowlist. No migration/schema library is selected.
- R-3 / D-1/D-4/D-5: timeouts, retained arrays, unknown-result refs and simulated
  revision comparison are disposable interaction machinery. They do not establish
  actual durable atomicity, single-writer enforcement, crash recovery, authoritative
  reconciliation, catalogue consistency or supported-browser guarantees.
- The single-channel 0–1 editor remains a V1 specimen; it must not replace exact
  color/Decimal policy, extended coordinates, `none`, alpha, byte edits, conversion
  eligibility or production graph validation. Other literal/reference draft inputs
  remain independent within this limited specimen.
- Downloads do not verify that the user kept a recoverable independent file.
  No privacy/account, cloud/sync, install/offline, Electron, copy/merge, durable
  drafts or history/undo feature is included. Future undo readiness still means
  accepted atomic before/after state at the application boundary, not a framework.

## Checks and handoff

Designer ran the isolated strict TypeScript check and Vite production build. Output
is under `/tmp/dtw-increment007-v2-dist`; root `dist` and V1 remain unchanged. No
dependencies, production source/tests/configuration or historical prototypes were
changed. No tests were added to this disposable prototype.

```sh
npx tsc -p prototypes/increment-007-v2/tsconfig.json
npx vite build --config prototypes/increment-007-v2/vite.config.ts
```

Coordinator browser verification is separately attributed in the final handoff;
these source/build checks claim no live keyboard, zoom, screen-reader or cross-engine
coverage. Show V2 to the user and iterate before seeking approval for renewed
analyst review. Do not treat artifact completion as final agreement or implementation
authorization.
