# R2 focused correction — 16 November 2026

Independent reviewer identified P2 AC-5/F3: the RestoreDialog replacement
acknowledgement checkbox lost the below880px44px effective minimum when the
global input selector was removed. Coordinator authorized this correction.

RestoreDialog now owns `touch:min-h-11` on that existing native checkbox.
At16px root this retains the former44px minimum; at enlarged root it scales in
rem with the agreed control policy. Native type/checked/disabled/onChange,
label, flex alignment, protection gating and replacement workflow are unchanged.
No other R1 application/document/font/test file changed.

Focused verification: the existing replacement-acknowledgement behavioral test
passed (one selected test; others intentionally skipped by name filter). The
normal npm test prehook regenerated shared cn tables. R1 production CSS already
contains `.touch\\:min-h-11{min-height:calc(var(--spacing) * 11)}` under the
existing `max-width:879px` condition; this adds a consumer of that compiled
utility. Source/compiled-CSS inspection confirms the same breakpoint and rem
length. No full build, full suite or new browser recovery harness was run.
`r2-targeted-tests.log` records the exact focused invocation/result.

`source-r2-delta.diff` is the exact single-property R1→R2 change;
`source-r2.diff` is the full base→R2 implementation diff. The updated source
manifest hashes all50 files; comparison against R1 confirms only RestoreDialog
changed. Coordinator contract/status remain excluded. All R1 evidence and its
limits are retained; this addendum supersedes R1's completeness claim for that
specific omitted control only. Independent reviewer recheck remains pending.

Additional verification approximately1 minute. Developer cumulative18 minutes;
coordinator's latest aggregate before fix approximately30/40 becomes31/40.
Harness repairs remain1/1. Source frozen as R2; no staging/commits/pushes.
