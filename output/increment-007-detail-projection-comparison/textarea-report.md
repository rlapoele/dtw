# Conditional native textarea — first risk gate

**Failed; stopped. 10 November 2026.** The coordinator reviewed the frozen pre failure
and authorized this conditional comparison under the user's approved candidate order.
It authorizes comparison only; no textarea adoption or production work follows.

The same exact pretty source, worker/projection code, fixtures, owned inspector/list
controls, Chrome build, viewport and external 30-second watchdog were used. The only
raw-surface change is a labelled native `readOnly` textarea with `wrap="off"`, 30 rows,
width100%, height50vh/max-height50vh, internal overflow and resize disabled. Unlike the
pre candidate's natural short height, textarea uses this fixed bounded native viewport.
No size threshold or automatic swap. Derived pre panels remain unchanged.

[Executed source](textarea-attempt-1-source/), [result](chrome-textarea-attempt-1.json),
[editor diff](editor-textarea-projection.diff), [build log](textarea-build.txt),
[typecheck](textarea-typecheck.txt). Its separate build preserves the pre build.

## Failure

[T03 raw opening trace](T03-raw-open-transfer-mount-paint-trace.json), CrRendererMain
pid **18826**, tid **229731**, records **128.683ms RunTask** and **119.338ms Layout**
(Layout timestamp12096508979µs / duration119338µs), exceeding100ms. The nested
ThreadControllerImpl task is128.658ms; these are overlapping, not additive.

This period includes disclosure/return/assembly/mount/paint. Later full `.value`
equality, native selection, copy/Find and geometry did not run for the large case.
No geometry/selection was forced in the failing period. The loaded raw fixture
identity/unit count and one actual mounted row/complete inspector were checked first.
There were no page/React errors and no watchdog expiry.

No larger run, scale sample, Safari defensive test, third viewer or retry followed.
Both reviewed exact-text candidates remain unqualified under the unchanged100ms gate.

## Limited controls

Single observations; no p95 or general performance claim:

| Case | Mount longest whole task | Raw opening longest whole task | Exact `.value` | Actual focused Meta+A |
| --- | ---: | ---: | --- | --- |
| 100 ordinary rows | 6.743ms | 4.451ms |572units / source hash equal|selectionStart0 / selectionEnd572|
| Admitted long row |8.256ms|4.647ms|135,690units / source hash equal|0 /135,690|

Both later geometry observations showed331×500px native viewports and no surrounding
page horizontal overflow. Text scroll widths were397px and434,142px respectively.
Native local Select All is clearer than the document pre in these small controls;
large native selection and clipboard fidelity remain unverified. Clipboard was never
read or changed; user clipboard restoration was therefore unnecessary.

The same explicit read-boundary/fidelity gaps in [pre report](report.md) remain.
No whole projection/candidate/inspector qualification or complete-source large native
selection claim. Actual Find/AT/200%zoom/320px/scroll/reflow checks are not run; Safari
stress is not run because safe pending-command preemption remains unqualified.
