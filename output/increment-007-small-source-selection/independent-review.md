# Independent review — bounded small-source native selection

10 November 2026. **No actionable findings in the identified evidence snapshot.**
This is an independent source/evidence review, not a repeated browser experiment,
participant study, supported-workflow endorsement, performance qualification or
Increment 007 implementation approval.

Reviewed baseline `cf1fbc34578e364eca00a6a8e5f0304c038a10a0` and
[manifest.json](manifest.json), SHA-256
`f15fdcae8faad335f32a422449c30e82059597fabd5e7dd587a20225c7abcb02`.
Recomputed byte lengths and SHA-256 for all **16 new files** and **66 read-only
inputs**: all match. All 66 read-only inputs also match their baseline Git blobs.
This review file is intentionally outside the frozen manifest. Coordinator policy
and status edits are outside the executable/evidence snapshot and this verdict.

Expected scope came first from AGENTS.md, the reviewer role, the
[assessment and latest user disposition](../../docs/increments/007-description-wrapping-and-source-selection-design-assessment.md),
[E policy](../../docs/increments/007-exceptional-detail-policy-and-performance-proposal.md),
V4/V5 design handoffs and [recorded bounded scope](scope.md). Current wrapping is
retained; the rejected break-all candidate is not adopted. Applied the
code-review-and-quality skill within the expressly read-only evidence scope.

Independent checks:

- Read both new research scripts, scope, action log, report and all three raw JSON
  records; visually inspected all eight screenshots. Checked relevant unchanged
  V5 fixture, source component and CSS. V4/V5 ExactSource remains byte-identical.
- Recomputed UTF-16 lengths and exact string equality without normalization:
  unassigned initial is 160 source units / 0 selected; corrected unassigned is
  160 / 160 exact; prose is 882 / 882 exact. Positive endpoint records are PRE
  text offsets 0 through complete source length. The source component renders
  complete JSON as one plain PRE text child; these records agree with that scope.
- Screenshots agree with the visible endpoint positions, current wrapping,
  unassigned selection and prose selection after vertical source scrolling.
  Prose geometry records scrollTop 137, scrollLeft 0 and horizontal overflow;
  no horizontal-anchor success is inferred. Its raw input remains `0.` while
  source Red remains the original applied decimal.
- The observation helper reads selection/text/geometry/inputs and saves artifacts;
  it does not construct a Range, mutate native selection or touch the clipboard.
  The runner accepts interactive commands, so it is not a self-contained action
  replay or immutable event transcript. The exact action sequence, post-scroll
  anchor observation, environment and cleanup history are executor-recorded in
  actions.md; this review checks their consistency with saved artifacts, not an
  independent verification of every dispatched input or process lifecycle event.
- Report and action log correctly distinguish the unsupported mouse.click modifier
  attempt from a valid Shift-click failure, and terminal/setup errors from browser
  usability defects. The successful correction fixes input dispatch; human
  endpoint-error recovery remains unobserved. Machine-assisted equality checking
  and an informed automated executor are explicitly distinguished from discovery
  by participants or physical-pointer success rates. Local report links resolve.

The evidence supports two limited Chrome native pointer-selection observations,
including one vertical-scroll sequence, with exact saved mounted/selected strings.
It does not establish clipboard equality, keyboard-only or AT access, Find, actual
zoom, horizontal-anchor retention, error-recovery usability, larger source access,
performance, Safari support or full E-4/Stage B acceptance. Discoverability and
normal-user completeness verification remain open burdens; reporting them is
consistent with the approved assessment, not a requirement to invent a viewer fix.
No production design change or support waiver follows. Ordinary and exceptional
budgets remain unchanged, as does the unresolved ordinary description-rendering
failure.

No browser, clipboard, experiment, build, tests, dependency operation, staging,
commit or push was run by this reviewer. Only this new review file was written;
production, prototypes, runner and frozen evidence were not modified. No extra
subagent review is implied.

Suggested human-owned commit: `research: assess bounded small-source native selection`.
