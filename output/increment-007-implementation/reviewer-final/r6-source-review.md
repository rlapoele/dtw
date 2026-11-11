# R6 bounded All content source review — 11 November 2026

**Request changes: one required finding.** Reviewed `../s4-r6-before-review-manifest.json`, SHA-256 `1980ae8614277ffd0f87661b206acbde8aaea9a7807c2605849b7811fa6c09b4`, with all 144 source/test/config/package hashes matching before inspection. Expected behavior comes from AC-18/20/24, unchanged 100 ms ordinary task gate and the existing identity/native inspection contract. The narrow change stages complete native All content membership; no paging, virtualization, cap or ordering change is authorized.

## Required R6-1: preserve blocks and reveal progress across same-revision refresh

`AllContent.tsx` recomputes `membershipBlocks` whenever context/groupLabels references change, while its owning key is only the applied revision. `RetainedWorkbench` routinely obtains fresh detached context and label objects on focus/resume even when that revision is unchanged. After all 120 blocks have appeared, this rerender retains `visible === 120` but replaces every block's entries reference, bypassing the intended memo savings and eagerly rebuilding all 12,000 buttons. Its new effect then restarts a local counter at one and publishes two, temporarily shrinking the complete native DOM to 200 identities before growing again. A focused later membership button can disappear. This reintroduces the full-render cost the change is intended to avoid and breaks same-revision native DOM/focus continuity.

Keep membership blocks and reveal progress stable for the lifetime of the keyed coherent project/revision instance; reset through an actual revision/project remount. The event delegate can still consume the latest parent callback. Add a mounted regression that completes multiple blocks, focuses a later native button, supplies fresh semantically identical context/labels under the same key and proves count/order/identity/focus/progress remain intact; then prove a changed revision key starts a bounded fresh reveal and cancels old callbacks. The helper-only scheduling test does not exercise this component lifecycle. This is a source-derived finding, not a claimed browser reproduction by this reviewer.

## Other scoped observations

The initial implementation retains all group entries followed by all token entries in exact array order, uses kind plus exact ID for keys, distinguishes empty IDs from absence in delegated selection, and forwards native button click/keyboard semantics through the existing owned Button. Blocks append native DOM rather than replacing it with a virtual/paged subset. Status distinguishes preparation from complete membership. The scheduler's stopped flag prevents queued old callbacks from publishing after disposal; owning revision remounts provide the intended scope boundary. No new icon family, dependency, arbitrary styling value or domain semantic is introduced.

All-block label construction still occurs once synchronously, and append/layout costs still require the actual maximum qualification; source organization and unit tests cannot establish the 100 ms task ceiling. The earlier 223 ms maximum All content failure remains failed historical evidence. No post-fix browser performance or user manual result is implied.

## Independent checks

- All four strict TypeScript configurations pass.
- Full suite passes: **1,031 tests / 45 files**.
- Production build passes to `/tmp/dtw-007-reviewer-r6-dist`.
- Tests were reviewed for complete 12,000-member order/identity, initial 100-button native rendering, opaque empty cross-kind IDs and stale scheduler cancellation. They do not currently cover R6-1's mounted same-revision refresh.

No application/test/requirement source or Git index was changed by the reviewer. No browser or qualification batch was executed. Correct R6-1, identify the stable snapshot and recheck the affected lifecycle before rerunning the maximum boundary qualification.

## R7 recheck — finding closed

Reviewed exact two-file delta `../s4-r7-against-r6.diff` and all 144 files pinned by `../s4-r7-before-review-manifest.json`, SHA-256 `42f0e3c7e7cc53de36219f6b7b49be8d86c3ba11d4d1aae3b6c61a6311763df5`; all hashes match. **R6-1 is resolved, with no remaining required finding in this narrow source recheck.**

Membership blocks now initialize once through component state, so new DTO/label object references under the same coherent revision do not replace entries, rerender completed blocks or restart the effect. The owning key is the injective JSON tuple of exact project identity and applied revision. Real project/revision changes therefore create a bounded fresh instance and dispose its predecessor's scheduler. The event delegate still receives the current parent callback; freezing display entries does not freeze selection/recovery closures. Native button order, keys, labels and exact opaque IDs remain unchanged.

Inspected the mounted regression script `../all-content-same-revision-regression.mjs` and saved native Chrome 157.0.8103.50 RED/GREEN evidence. RED (`r6-same-revision-red-2026-11-11T00-56-03.540Z`) observes complete 500-token membership shrink from 501 container children to 201, detaching the later button and losing focus. GREEN (`r7-same-revision-green-2026-11-11T00-57-06.002Z`) retains 501 children, exact button identity and focus; a real retained Apply changes the revision, replaces the view, begins with 101 children and ultimately restores all 500 membership buttons. The script verifies retained revision equality/difference through native IDB reads. Focus/resume delivery is explicitly controlled by dispatching the production focus handler; this is meaningful mounted component regression evidence, not qualification of actual OS/browser lifecycle events. Browser execution is developer-attributed; the reviewer inspected its script and stored observations without rerunning a browser.

Independent all-four typechecks, **1,031 tests / 45 files**, and production build to `/tmp/dtw-007-reviewer-r7-dist` pass. No application source, dependencies or Git index was changed by the reviewer. The old 223 ms All content performance failure is not reclassified; actual finite boundary performance qualification remains necessary after coordinator release. This recheck establishes the source fix and its bounded behavioral regression, not completion of Increment 007 or outstanding manual/native/support gates.
