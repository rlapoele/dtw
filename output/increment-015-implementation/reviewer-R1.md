# Increment 015 independent review — R1

16 November 2026. Verdict: **Request changes** for one demonstrated AC-10 regression.

## Snapshot and method

Reviewed base `dc41528e0d3ca33d809c9cf517873506a48f2f57`, exact `review-R1/source.diff`, manifest and included new InspectorToggle source. All manifest SHA-256 hashes matched at beginning and end. Production/test/requirements files were not edited. No staging, commits or pushes.

Derived expectations first from AGENTS.md, workflow reviewer brief/proportionate verification, agreed AC-1–16, proposal V1.3 and prototype source. Then inspected implementation/tests and affected owners. Applied code-review-and-quality and Playwright skills; skipped mutation editing because the project reviewer instruction explicitly prohibits production/test edits. No developer report was used to form findings.

## Required finding

**P2 / AC-10: Preserve keyboard focus and an actual arrow transition across token inspector collapse.**

Source: `src/presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/TokenEditor.tsx:17–30`, `.../TokenEditor/components/TokenEditorContent.tsx:89`, and `.../SelectionInspector/components/InspectorToggle.tsx:4–5`.

In an editable selected token, the expanded toggle lives inside `#token-inspector-content`. Collapsing hides that ancestor and inserts another InspectorHeader toggle outside it. Expanding removes that outside toggle again. The control receiving keyboard activation is therefore hidden/removed instead of retaining focus on the visible toggle. The separate visible instances also mean the transform transition cannot continuously rotate the displayed arrow between expanded and collapsed states; a transition class alone does not establish that behavior.

Independent Chrome reproduction on isolated `http://127.0.0.1:5185`: create project Independent R1 and token review-long-color-token-name; focus the accessible Collapse inspector button; press Enter. Subsequent active-element evaluation returned `{tag: "BODY", name: null}`. The same source path is used with ordinary short names. This breaks the explicit retained focus requirement and makes immediate keyboard expansion unavailable from the former control position.

Minimal correction: retain a single visible/focusable toggle across both states if practical within existing owners, or deliberately focus the replacement while separately providing a real visible transform transition. Preserve the editor mounted ancestry and narrow Back policy. Recheck keyboard collapse/expand, focus destination and normal/reduced-motion arrow behavior against an identified R2 snapshot.

## Independently verified evidence

- `npx vitest run test/application/retention/history.test.ts test/application/retention/history-bounds.test.ts test/presentation/authored-value.test.ts test/presentation/retention-protocol.test.ts test/presentation/workbench-sections.test.tsx`: five files, **38 tests passed**, 164ms reported runtime. Covers true owner counts through acceptance/traversal/branch/suspend/invalidation/context end and pruning/oversize, count transport validation, decimal ties/carry/negative-zero/none/large exact values, row-only exact preservation, and workspace sections.
- Source establishes counts from history cursor/retained steps rather than renderer inference; worker output requires bounded integer counts. Existing coarse operation ownership is retained.
- Row approximation is explicitly opt-in at TokenTable; exact AuthoredValue consumers retain default exact output. HEX visible summary retains native and accessible explanatory text; source retains unavailable reasons. No conversion policy is changed.
- Source preserves existing group begin/create workflow, parent-context rule and guards; workspace gets only another callback, with cancellation return ref and success clearing that ref to retain destination policy.
- Chrome fresh independent session `review015` showed zero history badges initially, then Undo 1 / Redo 0 after token creation; named search, generic workspace copy, both creation actions, Current/New comparison and editable token content were present. Creation sample snapshots: `.playwright-cli/page-2026-11-16T21-02-31-656Z.yml`, `page-2026-11-16T21-03-04-259Z.yml`.
- Sticky heading is isolated from scrolling metadata; ResizeObserver uses actual heading geometry for scroll padding. Panels use p-6/touch:p-4; comparison uses existing size-8.5. These are source findings, not completed runtime sticky/focus-visibility acceptance.

## Affected-tree and conventions review

Existing screen/workflow/session owners and component keys are retained. InspectorToggle has two actual sibling-branch consumers (InspectorHeader and TokenEditorContent), so SelectionInspector/components is their nearest meaningful common owner. AuthoredValue remains shared within TokensWorkbench; its approximation parameter serves the actual row consumer without moving precision policy to the domain. HexPreview is private to TokenTable. WorkspaceToolbar owns its heading/search/action composition. History state remains in application retention and validation at browser boundary. Shared button/input/select/Icon changes apply to their actual cross-screen consumers; Projects file/restore checkbox consumers receive focused sizing changes. No new dependency, foreign icon import, speculative owner, obsolete wrapper or structural convention violation was found in the affected tree. The legacy unavailable-range paragraphs retain larger geometry as explanatory content, not standard controls.

## Unverified and stopping boundary

Not independently completed: group cancel focus/parent and dirty guard runtime; desktop/narrow viewport and enlarged-root matrices; sticky heading scroll/focus visibility; shared 36px computed dimensions across Projects/forms; unavailable/read-only states, reduced motion and Resolved tab runtime; full build/typecheck. Source assessment supports many of these, but does not replace browser acceptance. Prior developer evidence may supplement them; this report does not claim exhaustive AC passage. No optional cosmetic improvements or new qualification requirements are proposed.

Approximately **6 reviewer verification minutes** consumed; incoming shared usage 11/30 minutes, so approximately **17/30 used, 13 minutes remain**. Incoming repairs 1/2; one corrected Playwright run-code callback signature plus recheck consumed the remaining repair cycle: **2/2** total. Initial Chrome cache permission failure was resolved by the normal authorized escalation, not a source/harness repair. Runtime checking stopped after the demonstrated defect and repair ceiling; further repair/recheck needs a newly bounded coordinator/user-authorized allowance under the owning workflow. No storage/cross-tab/broader-engine campaign was started.
