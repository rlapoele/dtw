# Complete offline harness traversal audit — ready for independent review

**No further browser execution authorized by this note.** Earlier runners and
failed evidence remain immutable. The corrected candidate is
`r5-audited-production-qualification.mjs`, importing only
`r5-qualification-fixtures.mjs`, `r5-owned-process-watchdog.mjs`, Playwright and
Node built-ins. There is no production source edit. These exact three local
modules are archived and hashed at each future invocation. A separate manifest
pins this offline review snapshot. No corrected reopen diagnostic has run yet.

The whole candidate was checked for `getByText`, `getByRole`, `getByLabel`,
locator filters, native/evaluate waits and imported helper browser behavior.

| Occurrence/function | Before / issue | Corrected candidate / cost boundary |
| --- | --- | --- |
| `projects()` | Global Projects role query; old input could still belong to departing workbench | Toolbar role query searches only the three header actions. Then direct `main > h1` equality and `main input[type=file]` enabled state; no old workbench input can satisfy that main selector. |
| `loaded()` | Global regex text wait traversed every node of the growing token table on each poll | Direct `#tokens h1`, exact heading text, direct `#tokens > p[role=status]` loading paragraphs, and one `.panel-header button`. No table text walk or global role poll. |
| `chooseToken()` | Global row role query, then a text-filter over all row subtrees | First `.token-row` by CSS, assert its one `.token-name` text equals the fixture identity label, native row click. Red lookup is restricted to `aside.inspector`. Fixture insertion order fixes token0 at the first row; no changed application ordering is assumed beyond this controlled fixture. |
| `submitBackup()` | Global labeled input and global preview/action role queries | Unique `input[type=file]`; direct dialog text-state readiness; button text filters restricted to the small `[role=dialog]` subtree; direct dialog hidden state. Native file input selection is unchanged. |
| `backup()` | Global Download backup role query traversed row buttons | Role query restricted to `header.topbar`; download event/file completion and Node JSON decoding do not search DOM. |
| Empty startup | Global no-project text query | Direct `main > p` text-state loop over the few catalogue paragraphs. |
| Positive observer control | Instrumentation readiness needed a proven actual event task | Temporary fixed DOM button identified by unique ID. Native mouse click invokes its 75 ms handler; exact observed LongTask is recorded, button removed and observer buffers cleared before qualified actions. No broad DOM queries. |
| Warm/measured command | Global Apply role polling caused accessible-name/style work over all row buttons | Native Red/Apply element handles acquired before timing within `aside.inspector`; timed action fills/clicks these handles. Completion checks only inspector buttons and their disabled/text state. No global accessible-name poll. |
| Reopen / cold restart | Global project button and heading role queries | Catalogue button text filtering is restricted to `main ul button` (at most 25 small project controls), then corrected `loaded()` and first-row selection. Restart readiness checks direct catalogue heading and scoped project button. |
| Cold first Apply | Same global Apply polling issue | Freshly acquired inspector-only native handles and local inspector completion; sample stays separate from p95. |
| All content activation | Name query could traverse 2,000 group buttons / 10,000 row buttons | Exact current-source CSS `.sidebar-content > button:nth-of-type(2)` cached before timing and asserted to read `All content`. Current ProjectNavigation renders All tokens then All content as the first two direct buttons. |
| Maximum membership | Role/name counts computed 12,000 accessible names | Direct CSS collection of the plain All content membership buttons, checked with short native text prefixes. No style/accessible-name calculation or formatted color subtree walk. |
| Maximum last-token inspection | Global exact-name lookup among 12,000 controls | Exact indexed CSS button handle, assert full expected `Token · token9999 · "t9999"` text before timing, then native click. Source-summary readiness is scoped to inspector summaries. |
| Defensive catalogue open/count | Broad project-role queries | `main ul button` filter (≤25); direct `main ul > li` count. No 2,000 ms SLA applies to this defensive catalogue case. |
| Source group inspection | Global All content/group name lookup | Cached asserted All content handle; first direct membership button asserted to read exact group identity; native click. Read-only text readiness stays within the small inspector, before source disclosure opens. |
| Source open/close | Global source-summary text lookup could walk the already-open complete source | Cache the inspector summary handle once before sampling; native handle clicks. Complete source is one direct `aside.inspector [aria-label="Complete applied authored data"]` element; exact text equality/length reads are necessary source-access work. |
| Native source selection / Find | Must distinguish browser work from harness queries | Geometry-only Ranges locate first/last characters; native clicks with Shift create selection, and actual selected text is compared. `window.find` is the deliberately requested native browser Find action, not a locator or a synthetic selected Range. No clipboard write. |
| Observer/worker metrics | Must not substitute synthetic construction for application costs | Array reads/splices only; Worker message dispatch/response timestamps; no DOM traversal. Two native animation frames include resulting first paint. Observer callback wait stays inside the operation watchdog, outside action latency. |
| Failure diagnostics | Full-body aria snapshot is intentionally broad | Runs only after the failure verdict/checkpoint, outside qualification measurements, under its own external 30-second stop. No failure diagnostic becomes evidence that an action passed. |
| Imported fixture helper | Possible hidden selectors or retired description fixtures | No browser/DOM calls. Pure bounded builders and preflight counters; actual app staging remains the admission authority. Multi-byte group descriptions fill 8 MiB; token-description ceiling remains 1,024. |
| Imported watchdog helper | Possible hidden retry / shared process termination | No DOM calls. One externally supervised operation at a time; checkpoint before killing only its own child PID; later dispatch refused after expiry. Separate idle-child self-test receipt exists. |

Remaining `getByRole` calls are only header toolbar and inspector Apply controls.
Remaining `getByLabel` calls are only Red within the inspector. The single remaining
`getByText` is inspector-local Group read-only readiness before exact source opens.
There are **zero `page.getByRole`, `page.getByText` or `page.getByLabel` calls** in the
candidate. Direct CSS and DOM-state operations do not claim to be free; their
specific bounded scopes are recorded above. Native full-source selection/Find and
exact source string reads remain intentionally measured application interactions.

The independent reviewer should assess this complete candidate plus helpers before
the coordinator releases exactly one corrected REOPEN trace. The finite 20-sample
and larger boundary inventory remains held until that diagnostic is assessed.
