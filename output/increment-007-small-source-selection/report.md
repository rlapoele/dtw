# Small-source native-selection usability assessment

10 November2026. **Two scoped Chrome pointer-selection positives; insufficient basis to endorse this as the supported full-source workflow.** Retain current E-1 and its open native-access gate. Recommend explicit user/design review of the gesture's discovery and verification burden before any further qualification or E-1 reconsideration. No viewer replacement or product instruction is adopted.

User retained current wrapping after V5 review and authorized this bounded assessment. Baseline cf1fbc34578e364eca00a6a8e5f0304c038a10a0. Skills: playwright and design-ui-with-restraint. [Scope](scope.md), [exact action log](actions.md), raw JSON and screenshots describe the execution. New evidence and read-only executable inputs are frozen by manifest.json; policy/status coordinator edits are outside this executor's scope.

| Fixture | Complete source UTF16 units | Observed native selection | Outcome |
| --- | ---: | --- | --- |
| V5 unassigned (`empty`) |160|PRE text offset0→160,160 units|Exact text and scope after corrected input dispatch; unsupported initial mouse.click modifier option caused a collapsed selection, not a browser failure. |
| V5 color/prose (`prose`) |882|PRE text offset0→882,882 units|Exact text and scope on initial valid sequence. Source-local vertical scrollTop0→137 retained anchor0. Draft Red `0.` retained, applied source still original literal. |

No normalization was used to obtain equality; selected strings exactly equal mounted complete source. Both endpoints are the PRE's own text node. Clipboard serialization is a separate obligation and remains wholly untested. V5 JSON is the current small applied token snapshot, not proof of E4 worker request/publication behavior.

Observed execution used owned headless Chrome157.0.8103.50, viewport1600×1100, default device scale1, macOS27.2 build26B123. Browser input automation and an informed executor judged targeting from screenshots. This is a bounded expert usability inspection, not a naive-user, participant, physical-pointer or native-OS study. Pixel coordinates expose what was attempted, not general human success rates. Source-local scroll was needed for prose; although its long description overflows horizontally, the closing brace remains at the left so horizontal scrolling was unnecessary. No claim about retaining anchors through two-axis navigation follows.

Discovery remains weak by design inspection: the existing disclosure/status describes read-only source but supplies no local selection command or endpoint-gesture hint. The successful sequence was provided in the task; it was not discovered unaided. Precision succeeded at these two small targets, using screenshot-visible brace boundaries. This does not establish tolerance for motor error or dense/scrolled endpoints. Anchor retention has one positive vertical-scroll observation. After scrolling, the initial anchor is invisible; the ending highlight cannot itself prove completeness. The executor verified exactness through read-only DOM data unavailable as a normal product confirmation. That verification cost remains material even when the gesture technically works.

Correction evidence is limited: unassigned required repairing the automation's Shift dispatch, not correcting a human boundary miss. No valid gesture missed a boundary, so user endpoint-error correction cost remains unobserved. Do not relabel the setup/terminal/dispatch errors in actions.md as browser usability defects. No repeated sequence searched for a magic endpoint.

Safari is unrun: a safaridriver binary exists, but a safely owned Safari context was not established. No shared Safari operation, activation diagnosis, stress or supervision attempt followed. Keyboard-only selection, AT, clipboard, Find, zoom, performance/task tracing, larger fixtures and full support remain unqualified. No third fixture was needed after these two observations; no further execution is implied. Ordinary100ms and exceptional250ms/task /5000ms action policy and authored budgets remain unchanged.

Only new output/research directories were written by this executor. Production, prototypes, old evidence and dependencies unchanged; no root tests/build required or run. No staging, commit or push. Assessment browser close requested via its owned runner; runner then terminated via its own PTY Ctrl-C (no post-close browser/process inventory available); isolated port4231 server stopped; existing user port4228/tab untouched. No new model/product assumptions introduced. Reading current V5 as a small usability specimen and selecting screenshot coordinates are assessment methods only.

Suggested human-owned commit: `research: assess bounded small-source native selection`.
