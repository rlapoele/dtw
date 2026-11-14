# Increment 010 first slice — developer handoff

15 November 2026. Source frozen for independent review against baseline `717c08e`.
Coordinator-owned contract/status authorization edits were already present and were
not edited by this developer. No staging, commits or pushes occurred.

Implemented the agreed first slice only: seven generic controls moved to `ui/`,
host/project hooks moved to their named owners, three backup modules moved to
`project-backup/`, and five project-entry components extracted from App.
[moves.json](moves.json) records every move/extraction;
[developer-manifest.json](developer-manifest.json) identifies changed/new/deleted
source, test and owning-document paths, with SHA-256 hashes for existing files.
The manifest excludes coordinator-owned contract/status and this output folder.

App retains unconditional hooks, selected-file/Stay refs, preview/leaving state,
file staging/reset orchestration, departure/restore dialog configuration and the
Workbench branch/project key. Entry children receive explicit values, actions and
refs; none calls the host. RestoreDialog remains the public cross-screen entry;
its hook remains private and colocated. No dependencies/configuration changed.

Verification completed:

- Before migration, three new controlled-host characterization tests passed with
  the existing coordination harness (12 tests total): mandatory-name focus/open
  failure input preservation, retained-read retry without creation replay, and
  unknown-write input/replay protection plus explicit departure fencing/reset.
- After extraction, six focused files passed, 39 tests total:
  `projects-screen`, `workbench-coordination`, `icon`, `identity-presentation`,
  `session` and `exact-source`. New screen checks cover loading/failure/retry/empty,
  supported legacy names, unavailable rows, exact identities/counts, disabled
  controls, validation associations, recovery text and dialog order.
- One final `npm run build` passed all four TypeScript configurations and Vite.
  Vite reported its existing bundle-size warning (>500 kB); no new build failure.
- Mechanical comparison confirmed all 12 moved files preserve exact contents
  after import rewriting. Remaining Workbench/navigation/editor/internal source
  changes are import-only. No old live alias imports remain under `src/` or `test/`.
- Changed Markdown/current paths and `git diff --check` reviewed successfully.

Estimated developer verification/source-self-review consumption: six aggregate
minutes of the ten allocated, zero harness repairs. This is shared consumption
within the contract's 30-minute ceiling, not a fresh allowance for the next role.
No full suite, browser work or old retention qualification was run. Controlled-host
and server-rendered evidence do not establish real React focus/mount behavior;
coordinator browser evidence and independent review remain separate gates.

Current partial migration deliberately stops at project entry/shared controls and
backup roots. Workbench/navigation, browser, creation, inspector/editor/session,
readback and token-display migration remain later roadmap work. No responsive
redesign, token semantics, persistence or host protocol changes were made.

Assumptions: DOM-only component boundaries do not add wrappers; row keys remain
on the corresponding mapped item components. Existing caller-managed void/promise
behavior and native file-input reset remain unchanged. No material unresolved
implementation question was discovered.

Suggested commit: `refactor: extract project entry and shared presentation roots`
