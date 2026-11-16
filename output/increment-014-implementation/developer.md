# Increment 014 developer evidence — R1

16 November 2026. Base `da3418e216151af3381cf4ae1c189bbdb37ef8c4`.
The coordinator's authorization/status edits predate application edits and are
excluded from the implementation diff/manifest. Nothing staged/committed/pushed;
no dependencies, model/application operations, viewport observer or state hooks changed.

## Baseline and ownership

Before mutations, `baseline-global.css`, `baseline-consumers.txt` and
`legacy-consumers.txt` preserve the inspected source. Actual isolated Chrome
baseline JSON/screenshots cover Projects 1440/1024/880/879/390 and Tokens/editor
1440/1120/1119/880/879/390 plus a creation modal. JSON captures effective winners,
not merely proposed class strings. Normal root was 16px. Source cascade confirms:

| Finding | Previous effective owner/winner | R1 owner/disposition |
| --- | --- | --- |
| F1 | Unlayered Projects 28px, Tokens 24px; Tokens below1120 and Projects below880 20px/16px; editor heading24px then20px/16px below880 | Owning workspace/heading utilities; 1.75rem/1.5rem distinctions retained |
| F2 | Header64px; below880 gap8px/px16/wrap; compact context reordering; history actions separate row; collapsed inspector padding0/gap0 | ApplicationHeader utilities/state own layout; scoped inspector state CSS retained with conditional nonconflicting classes |
| F3 | Unlayered below880 min44px, including history640–879/file/slider | Actual primitives, file input and sliders consume touch:min-h-11; larger existing variants retain minima |
| F4 | Two/container-three columns, viewport below880 one; authored-value hidden below880; description retains container visibility; inspector left border0 below880/top below768 | Same endpoint combinations at table/inspector owners; viewport+container composed explicitly |
| F5 | Modal p28px then20/16 below880; width480px/viewport32px clearance, max-height; radius10px, shadow0/16/80 | Modal primitive padding/radius/shadow utilities; focused width/clearance formula converted exactly to rem; drawer remains distinct |
| F6 | Mixed10/11/12/13/14/17/19/20/24px,550/650 weights and conflicting stacks | Agreed Geist roles/400–600; Mono technical values; intentional size/weight changes documented below |
| F7 | Fractional numeric utilities and off-scale dimensions | Retained exactly at16px root; no spacing rounding or breakpoint-unit changes |
| F8 | Literal chrome colors/shadows plus supporting-text secondary | Neutral semantic aliases/roles; inputs actually consume stronger input boundary; secondary migrated before remap |
| F9 | project-start/range-ends/exact-data no current consumers; editor-actions bottom offset on static node | Removed unused rules and inert offset, kept actual EditorActions owner |

Ordinary ownership cleanup preserves existing lengths at16px root; typography,
colors and the agreed Projects hierarchy are intentional visual changes. The
selected marker remains.25rem, not the prototype's3px marker.

## Semantic/type/exception inventory

One source: `src/presentation/styles/global.css`, referencing installed Tailwind
primitives through semantic CSS variables and inline theme namespaces. Retained
paired roles: background/card50/900, primary900/50, secondary100/900,
muted100/600, accent200/900, border200, input/ring500, ring-offset background,
destructive700/50 and error50/200. Meaning-specific aliases remain surface,
value, notice/notice-foreground, badge-foreground, row-hover, selected, mode,
control-hover, placeholder, trace and status. Supporting text-secondary consumers
are removed; surface semantics replace that old text role. Scrim uses foreground
33%, dialog shadow20%, drawer12%, small shadow10%. Specimen/swatch borders,
checkerboards and illustrative gradients remain deliberate decoration outside
chrome consolidation. Authored colors/default black, exact source and swatch
runtime data are unchanged.

Type roles: Geist page1.5rem/600/1.25; inspector1.25rem/600/1.3;
section1rem/500/1.5; body.875rem/400/1.5; supporting/control.75rem/400–500/1.5.
Geist Mono paths/token names/technical values/source/numeric color entries use
.75rem/400–500/1.5. Narrow actual text entry becomes1rem below768px. No 550/650
font declarations remain. Plain labels and project naming remain Geist. Font
assets are unmodified Geist1.800 and Mono1.701; exact URLs/SHA/embedded versions
and SIL OFL licenses are bundled beside them. Vite build emits all five assets;
no third-party runtime font request or new offline shell.

Rem exceptions retained at nearest owners: coordinated pane/grid formulas,
collapsed state, modal/drawer viewport formulas/transitions, dialog action wrapping,
native range pseudo-elements, selection marker, staged row containment,
ExactSource local scrolling, trace/specimen decoration and unlayered[hidden].
Runtime styles remain authored colors/derived gradients. Named hairline border
utilities are necessary because built-in border uses px; precompiled cn recognizes
their width group. Focus.125rem/.1875rem, shadows and slider geometry use rem.
Only coordinated CSS viewport/media policies retain px; SVG coordinates/strokes
remain SVG units. Browser rasterization rounds1.25px border lengths to1px at20px
root; declaration geometry is rem. No fixed root font size was added.

Retained off-scale examples:13.25rem navigation/25rem inspector/3.25rem collapse;
Projects1.75rem; Field.4375rem gap/1.0625rem margin; tabs1.375rem gap/2.625rem
minimum; empty state4.375rem padding; modal.625rem radius; slider.75rem track,
1.125rem thumb/-.25rem alignment; marker.25rem. Existing fractional numeric
utility inventory remains valid; no aliases conceal one-off measurements.

Affected-tree review: existing screen/private/shared placements and complete
responsibility names remain appropriate. No wrappers/folders/modules added except
font assets/documentation under their actual stylesheet owner. App calls, keys,
ancestry, semantic roots, pane refs, scroll owners, editor sessions and command
ownership are unchanged. Heroicons remain exclusively through Icon. Button remains
additive; Base UI callbacks and forwarded props/refs remain untouched. Shared cn
continues precompiled with no package/runtime compiler migration.

## Verification and acceptance mapping

- AC1/2: production CSS/source inventory; local font requests200 and all five faces
  loaded. Fallback screenshot with all.ttf requests blocked remains usable. Initial
  font diagnostic found duplicate format declarations, corrected before final build.
- AC3/7:153 existing presentation tests pass, including Projects state/gates and
  mounted-workbench coordination. Actual project/token creation, empty-name
  validation, read-only selection/Open, native invalid backup-file validation
  exercised. No authored data/default changes. Actual hidden pane computed display
  remains none. Restore-preview/recovery/unknown/pending permutations source/tests
  only; no new fault/storage campaign.
- AC4/5: baseline and migrated geometry JSON; wide/compact/narrow/320 actual views,
  1119/1120 and879/880, history640, table/container transitions in real layout;
  below880 controls/sliders/file min44px. Base UI/cn existing tests plus a focused
  meaningful new merge test for type/elevation/rem border groups (7 tests) pass.
  No all-state×width matrix; collapse/table conditions also inspected in source.
- AC6: root20 screenshot and measured inputs within390px, no revealed hidden panes;
  root is reset by the test. No viewport observer changes. Rem declarations and
  generated CSS inspected; enlarged-root scrolling/actions not exhaustively exercised.
- AC8: actual320 editor screenshot, modal input keyboard outline2px/offset3px with
  room around field, normal input widths, local scroll structure retained. Drawer
  Escape returns to Open project navigation after transition. Actual dirty-modal
  Escape enters existing guard and focuses Keep editing; uncomplicated modal return
  is not asserted. Resolved runtime semantic pairs via canvas sRGB approximation:
  foreground/background17.18, muted-foreground/muted7.17, primary17.18,
  input/background4.54, ring/muted4.35, destructive/error-surface5.87,
  foreground/accent14.23. Text/control/focus thresholds satisfied for these pairs;
  translucent/error-border/disabled/hover combinations are not full certification.
- AC9: all F dispositions above, affected consumers/tree checked; current conventions
  reconciled without editing historical audit/proposal. No foreign icon/dependency.

Final gates: `build-final.log` records successful production build and all four
TypeScript scopes; standard Vite>500kB chunk notice remains. `presentation-tests-final.log`
records20 files/153 tests passing. Earlier initial152-test run/build predate the
final small corrections. `focus-contrast.json` includes actual native-file rejection
and keyboard guard observations. `git diff --check` passes. Browser no pageerrors
in runtime-checks; font-blocking is intentional in fallback case.

## Bounds and stable handoff

Developer verification approximately17 minutes of22 allocated; one server socket
sandbox escalation counted as the single1/1 harness repair. Two ordinary selector
corrections (duplicate New token / real header Back) and a guarded-modal navigation
attempt consumed the same allowance; no harness revival/dependency installation.
Coordinator separately used approximately2 minutes; aggregate approximately19/40
before reviewer. Reviewer13 minutes plus coordinator remainder remain within total;
previous qualification campaigns are unchanged/stopped. Broader browser engines,
full offline installation, persistence/concurrency faults, full accessibility,
short-height/zoom/long-list/state matrix and historical gaps remain unverified.

R1: `source-r1.diff` plus `source-manifest-r1.json` identifies tracked implementation
changes and every new font/license/provenance file. Evidence hashes are separately
listed in `evidence-manifest-r1.json` (excluding the manifests themselves). Coordinator
contract/status edits are explicitly outside this application snapshot. Frozen
application edits pending independent review.

Browser: Vite remains http://127.0.0.1:5173 (exec session39179). Cached API:
`require('/Users/rlapoele-pro/.npm/_npx/31e32ef8478fbf80/node_modules/playwright')`,
`chromium.launch({channel:'chrome',headless:true})`; isolated fresh browser context.
Recorded.cjs scripts in this folder show exact invocation. Avoid rerunning baseline
scripts against changed source as if producing a historical baseline.

Suggested commit: `feat: adopt Neutral Geist theme and clarify styling ownership`.
