# Ordinary-description layout isolation — stopped at first small control

10 November 2026; execution baseline `ea97bfc49addf2a0a34716801e8e3f76bce68049`.
**Inconclusive. The entire finite batch stopped on the first small-control mismatch.
No long description was mounted.** There is no new evidence about isolated long-text
cost, no application fix, and no E-4 or Increment 007 qualification.

## Observed result and stopping decision

The unchanged current App loaded only the frozen **small** fixture at 1600 × 1100.
The active wide description wrapper measured **284 × 16.5 CSS px**. The specimen
retained its outer wide span and inner clamp span, plus the full compact description
span with `display:none`, in a definite-width block without application/grid/flex
ancestry. All three measured node records retain the exact small text
`Small editable synthetic source`.

The saved comparison contains one mismatched computed field:

| Node | Property | Original small application | Isolated small leaf |
| --- | --- | --- | --- |
| Wide description outer span (record index 1) | `min-height` | `auto` | `0px` |

Every recorded used box metric, typography property, whitespace/wrap/word-break,
clamp/display, padding/border/margin, width/height and exact text otherwise matches.
The two visible text crops have the same small text and bounds; the transparent
surface's surrounding background differs after ancestry removal. Neither visual
similarity nor matching used dimensions overrides the failed computed-style prerequisite.
See [saved original/specimen records](control-wide.json), [recorded specimen](wide-spec.json),
[application crop](control-wide-application-surface.png) and
[leaf crop](control-wide-leaf-surface.png).

The archived fixture code explicitly copied the original computed `min-height:auto`
onto that span. Saved evidence establishes that the copied value computes to `0px`
in the reduced context, so the intended strict computed-style match was not achieved.
A context-dependent computed-value change is a plausible explanation; no new browser
inspection or property repair was performed to establish its engine cause. This is a
**harness control-equivalence failure**, not an observed production defect or evidence
that the existing long application failure was caused by this property. Preserving
`auto` in an inline declaration does not prove preserved computed semantics.

A further **unexecuted-path implementation limitation** was identified by source
inspection: `make()` copies the small computed `height` as an inline value, including
**16.5px** on the visible wide wrapper and clamp node. That would freeze the small
height during a later long mount, instead of retaining the natural two-line preview
or complete inspector expansion required by the definite-width-only manipulation.
No long mount executed, so this is a source-level harness defect, not a measured
long-text outcome. The saved small control's used dimensions really do match; this
finding does not retroactively change them. A future retry cannot merely waive the
`min-height` comparator: the specimen must also preserve natural height semantics.
Source/archive are left unchanged, and no repair or rerun follows in this batch.

This was the sole live case. Its scoped timing evidence is independently useful as
instrumentation coverage, but cannot turn an unmatched specimen into a valid control:
maximum whole target `RunTask` **6.972 ms**, nested Layout **3.814 ms**, Paint **0.077 ms**;
action wall **27 ms**. No costs are added. Raw trace identifies frame
`0B8402111BDAD910EB4769B000EE5BC4`, renderer PID **34414**, main thread **587218**,
with **14 intersecting whole-task records / 41 complete main-thread events**.
Activation, DOM-complete and double-rAF witness are same-owned, ordered marks.
The raw evidence includes [trace](control-wide-trace.json) and
[all intersecting target events](control-wide-target-events.json).

**Unrun after stop:** wide first-risk mount, compact small control and first-risk,
complete-inspector small control and first-risk. All Safari, native selection/copy,
Find, AT, actual browser zoom and stress/support qualification remain unrun. There
were no repetitions, distributions, long full-application replays or automatic variants.

## Identity, construction and environment

The isolated fixture file is byte-identical to frozen attempt-1 `fixtures.mjs`; its
relative Stage A import already resolves from the new research directory. No import
adaptation or historical-file edit was required. Offline construction verified:

| Identity | Exact value |
| --- | --- |
| Canonical snapshot SHA-256 | `1b4b5241cf1af157ac990eb238c210366180d95076845d897ff2afe706beca8e` |
| Complete pretty token source | **65,535 UTF-16 units** |
| Complete pretty token SHA-256 | `739717a5620a061f514a96948c80ae45044d37789d822b85e56d500522d442e6` |
| Raw description | **65,004 UTF-16 units**, repeated `x` |
| Raw description SHA-256 | `e1d984995d9313a85b2dd7db37d2498cbabc8c9d35baec4d36e5a67173b82316` |

Those are Node/offline identity checks, **not a browser long-DOM equality result**.
Browser first-risk preconstruction and its separate construction/hash timings were
never invoked. The archived runner would record them before mount activation; they
must not be attributed to the executed small control or hidden as an application load.
The small control compares complete DOM strings directly, without normalization.

Native Chrome **157.0.8103.50**, macOS **27.2 / 26B123**, Node **24.14.1**;
1600 × 1100 viewport, DPR **1**, `visualViewport.scale` **1**, fresh disposable profile.
Declared body font is `Inter, ui-sans-serif, -apple-system, "system-ui", "Segoe UI",
sans-serif`; `document.fonts.status` is loaded and `check('11px Inter')` returns true.
This check does not establish the installed/resolved raster font face. No web font
resource is added. Scale metadata is not a native browser UI zoom qualification.
Hardware model, physical device, cross-engine behavior and universal performance are
not claimed.

## Scope, checks and preservation

Only the new `research/increment-007-ordinary-rendering-isolation/` and matching
output directory were written by this developer. The coordinator's plan authorization
amendment is separate. Current App, TokenList, Editor and global CSS are pinned
independently from historical fixture/source. [Pre-execution manifest](pre-execution-manifest.json)
pins the exact harness and archived **actual served build bytes before the live case**.
The final [manifest](manifest.json) additionally pins all read-only current source
inputs, build tools/config/dependency locks, frozen evidence and new output files.
[Execution source](execution-source/run.mjs) and [served build](served-build/index.html)
are frozen; no implementation edit occurred after the failed control.

Source manipulation was limited to removing layout ancestry and explicitly reproducing
recorded surface rules/geometry. No wrapping alternative, containment, inserted break,
truncation, paging, cap, new viewer, reduced application or dependency was introduced.
Pixel width is measured diagnostic fixture geometry, not a product token. Root
production/test/prototypes/dependencies/config and prior artifacts have no Git diff;
no staging, branch, commit or push was performed. All build/cache outputs used `/tmp`,
with served bytes then archived here; root `dist` was not a build target. No before/after
root-dist hash comparison is claimed.

Commands/checks:

- `node --test research/increment-007-ordinary-rendering-isolation/trace.test.mjs`:
  **7/7 pass**, including saved 191.793 ms Layout failure, foreign-renderer rejection,
  missing/ambiguous ownership and missing whole-task fail-closed coverage. Analyzer
  and tests are byte-identical copies of reviewed E-4 controls. Final rerun was offline.
- `./node_modules/.bin/tsc -p research/increment-007-ordinary-rendering-isolation/tsconfig.json`:
  **pass**. An initial pre-execution inference error from the frozen JS fixture was
  corrected with an explicit `ProjectSnapshot` cast before any live case.
- `./node_modules/.bin/vite build --config research/increment-007-ordinary-rendering-isolation/vite.config.ts`:
  **pass** to `/tmp/dtw-ordinary-isolation-build`; no packages installed.
- `node research/increment-007-ordinary-rendering-isolation/run.mjs control-wide`:
  one live case, **inconclusive, batch stopped**. First sandbox invocation failed at
  local listen (`EPERM`) before Chrome spawn or case execution. Scoped unsandboxed
  execution was then approved. This startup failure is preserved in [startup note](startup.txt).
- Saved computed records and paired crop screenshots were manually inspected offline.
  No unchanged production test suite was run, as the application was not edited.

## Owned execution and cleanup

The loopback-only server used an ephemeral port. Chrome ran as a newly spawned native
process group with a new disposable profile. A **separate Node watchdog process**
checks the exact browser PID/profile command and acknowledges arming before awaiting
browser setup or a traced action. Its independent 30-second timer can kill only that
owned process group. No expiry occurred; this batch does **not** claim an induced
watchdog-expiry safety test or Safari supervision proof.

Runner cleanup awaited owned browser close and server close, then removed the owned
profile and disconnected the watchdog. Saved cleanup flags report success. A later
sandboxed read-only `ps` check was denied, so independent post-cleanup process-table
verification is not claimed. No user browser/session, Safari, clipboard, trust/keychain,
TLS, tunnel or public origin was touched.

## Interpretation and handoff

The failed prerequisite leaves the diagnostic question unanswered. There is no result
that current long-text rendering is sufficient outside layout ancestry, nor that
ancestry is required. The frozen full-application ordinary failure remains failed.
No CSS root-cause claim, repair recommendation, performance waiver or next experiment
follows. Editing is paused for a fresh independent review of this stable incomplete
snapshot. Any corrective control design or subsequent browser batch needs a new
coordinator/user disposition; no repair/rerun is part of this batch.

Suggested human-owned commit: `research: record stopped ordinary description isolation control`.
