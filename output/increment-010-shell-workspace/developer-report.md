# Increment 010 shell/workspace developer handoff

15 November 2026. Baseline `d3a7e9c`. S2 source/test snapshot is frozen in
[source-snapshot.json](./source-snapshot.json); `null` hashes identify deleted paths.
[moves.json](./moves.json) records 20 moves and three extractions. No staging,
commit, push or application/domain/host/configuration/CSS/dependency edit occurred.
Coordinator-owned contract/status updates are outside this source manifest.

## Delivered scope

Moved Workbench and four coordination hooks beside their shell owner; retained
readback color/failure helpers there. Moved the header, cohesive navigation
container exports and NamespaceTree, common workspace-view, TokenWorkspace,
TokenTable, AllContent and membership helper, CreationDialog/form/naming helpers,
and three recovery renderers. Extracted only the existing toolbar and footer.
The three identity-label helper bodies/signatures moved unchanged to token-display.
All live source/test callers now use the real owners without forwarding modules.

Workbench retains orchestration, state, refs, hook calls, completion callbacks,
inline recovery/baseline sections and inspector placement/key. App changes only
its Workbench import. Inspector/session, color, shared value renderers and the
alternate test-exercised TokenList remain in the intentional mixed tree with
imports-only changes. No new table/tree semantics, wrapper DOM or future folders.
README, architecture, conventions and current ownership now describe this tree.

Applied using-agent-skills, code-simplification, incremental-implementation,
git-workflow-and-versioning and existing-test/TDD guidance. Explicit S2 authorization
and no-behavior-change/verification limits take precedence over generic automatic
commit/full-suite workflows. No new user/product decision was needed.

## Verification and limits

Developer verification/source-self-review: approximately **six aggregate minutes**,
including source comparison, tests/build waits and changed-document/link review;
zero harness-repair cycles. Coding time is separate. One new test assertion was
corrected after it also counted Base UI's `data-disabled`; production code was
unchanged by that correction. No unavailable connector/viewport repair attempted.

- Existing focused tests: six files, 49 tests pass (identity-presentation,
  all-content, workbench-coordination, increment-009, session, namespace-naming).
- Added two meaningful static-render regressions for scope/search/rename visibility
  and fallback labels, plus footer display precedence/count/disabled state. Both
  pass. These extend coverage without asserting file-path architecture.
- One final `npm run build` passes, including the four TypeScript checks and Vite.
  Existing large-chunk advisory remains; no build/config change was made.
- 17 moved module bodies compare identically after import and agreed component-name
  normalization. All three identity helper bodies/signatures compare exactly.
  Workbench and TokenWorkspace bodies compare identically after inlining their
  extracted section and normalizing imports/names. Toolbar JSX compares exactly;
  footer JSX compares after the explicit display/callback substitutions only.
- Source/test search finds no stale references to removed paths. Changed owning
  documentation links resolve; `git diff --check` passes. Generated class tables
  have no diff. Existing test assertions retain their meaning.

These demonstrate source/test extraction properties for S2-AC-1–5, not native
focus, geometry, invalid-draft DOM lifetime or drawer behavior. Coordinator owns
available-browser observation and reviewer owns independent stable-snapshot review.
No browser acceptance is claimed here, and no earlier stopped qualification is
restarted. The full Increment 010 roadmap remains incomplete.

Suggested commit: `refactor: organise workbench shell and workspace components`
