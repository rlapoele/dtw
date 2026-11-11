# Slice 2 design fidelity

11 November 2026. Separate designer check of the frozen slice-2 checkpoint, base
`5c22404e34ea9a9b39e1bb6da1135c2719440536`, manifest SHA-256
`c8ad85cdd867074cc480e587857c67431ea9c40ec46d38720b698ee2f49b32e5`.
All 36 listed files independently matched their manifest hashes after inspection.
No production source, tests, requirements or historical evidence changed.

## Required baseline corrections

1. **P2 / AC-20 — restore selected-outside-filter context.**
   `src/presentation/app/RetainedWorkbench.tsx:71` renders the filtered list directly,
   omitting the existing selection-context surface from `App.tsx:475`.
   Select a token, then enter a search excluding it or select another group: the
   inspector continues to show that selected token without the former “Selected
   token is outside this list” notice and return-to-selection action. Preserve the
   existing notice/action within the retained composition. This is source-verified;
   the bounded live run did not execute this filtering scenario.

2. **P2 / AC-20, AC-18 — restore inspector header state and accessible preview context.**
   `src/presentation/app/RetainedWorkbench.tsx:74` displays feedback for any selected
   token with cached feedback and supplies no alternative header status. The prior
   `App.tsx:531–589` gates specimens on readable/eligible selected content and exposes
   “Unavailable”, “Inspection only” or “Select a token”; it also includes the
   `appliedMessage`/`draftMessage` text for assistive technology. The retained header
   omits that gating, status text and descriptive text, plus `aria-controls` on its
   pane toggle. Restore this baseline policy so ineligible/unavailable/empty states
   cannot inherit misleading color-authoring context. Empty selection was present
   in the live flow; other special states are source-verified, not runtime qualified.

No new layout or interaction design is needed for these corrections: reuse the
existing baseline behavior. Backup/restore and complete recovery are later slices
and were deliberately not assessed as missing current-checkpoint features.

## Observed preservation

The developer-provided `slice2-workbench.png` was inspected before forming findings.
A separate native Chrome **157.0.8103.50** session then used a new disposable profile
and the actual app at `http://127.0.0.1:4327`. No user tab/profile was touched.
The corrected runner completed with zero page errors. Its screenshots were opened
and visually inspected; ARIA snapshots and measured values are saved alongside them.

1. Projects/new-project — clear browser-local storage explanation and labelled form.
2. Desktop token creation/list/inspector — neutral Precision hierarchy, swatch,
   layer/type, Description column and complete inspector description preserved.
   Authored newline and ordinary word-friendly wrapping remain visible.
3. Color views — actual native combobox selects all five spaces; each exposes three
   corresponding component inputs plus independent alpha. sRGB normalized and
   integer 0–255 scale remain available; three sliders plus alpha are in the snapshot.
4. Metadata/source — Currently applied, regeneration/semantic-role/parent metadata,
   separate regeneration footer and generic preactivation pause notice remain.
   Source opens as complete applied token JSON with identity and exact description,
   revision/read-only label, focusable plain `pre`, no soft wrap and local scrolling.
   Measured source: `white-space: pre`, `overflow: auto`, 384px client height,
   479px scroll height, 384px maximum, tabindex 0. This is a small ordinary specimen.
5. Resolved & trace — readable applied preview, full small exact result, trace and
   diagnostics remain present.
6. Compact 760×900 and narrow 320×900 — preserved stacked list/inspector, compact
   description preview, independent pane scrolling and no document horizontal
   overflow (measured scroll width equals viewport width). These were viewport
   changes, not actual browser zoom or physical-device checks.

Evidence: `output/playwright/increment-007-implementation/slice2-fidelity-r2-*`;
runner: `output/increment-007-implementation/slice2-design-fidelity-runner.mjs`.
The native browser connection was closed and only the owned child received SIGTERM
in the runner's finally block. Profile disposal is not independently verified.

## Limits and optional polish

No additional optional visual polish is recommended for this checkpoint. Keep the
existing design while restoring the two baseline omissions above.

This check does not establish exactness for every admitted value, retained failure
or recovery behavior, modal/focus return, source preparation/failure/Retry runtime,
natural short-source height, native full selection/copy/Find, clipboard equality,
AT usability, actual 200% zoom, performance budgets, HTTPS, restart/native-file
qualification, or any other engine. These remain separate acceptance obligations.
No clipboard, Safari or Firefox operation occurred. No tests/build were rerun by
the designer; developer/reviewer evidence owns those checks.

The initial sandbox browser-readiness attempt never connected; its separate
`slice2-fidelity-sandbox-readiness.json` is tooling evidence. The first host run
captured Projects/editor but stopped on an unsuitable getByLabel selector;
`slice2-fidelity-selector-failure.json` records it. The role-based corrected run
passed. Neither stopped attempt is classified as an application failure.
