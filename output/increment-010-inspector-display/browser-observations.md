# Increment 010 S3 — ordinary editor/browser observations

15 November 2026. Available in-app Chromium at task-only origin
`http://127.0.0.1:5187/`, after the developer reported production source stable.
Final reviewed source is identified by [patch](review-source.patch) and
[manifest](review-source-manifest.json) against baseline `5b626e2`.

The walkthrough used the disposable “Increment 010 smoke” project from prior
slices, initially containing `smoke` and `s2check`. Applied edits below affect
only that synthetic project, not unrelated user data. All mutations used UI
controls with fresh DOM snapshots; no storage/runtime injection or failure setup.

## Observed

| Scenario | Observation |
| --- | --- |
| Open/select | Existing project and token list rendered; selecting `smoke` mounted the migrated editor with current authored/resolved tabs. |
| Invalid input | Red accepted exact raw `not-a-number`. Switching to Resolved & trace and back, then collapsing/reopening the inspector, retained that exact string. |
| Departure | Projects opened the existing guard; Keep editing returned with the same invalid Red string. Cancel discarded the draft. |
| Color view | Selecting OKLCH displayed its channels and approximate-view explanation while retaining authored sRGB. Returning to sRGB restored RGB controls. |
| Entry scale | Selecting 0–255 allowed raw Blue `59.5` to remain entered. Cancel discarded it; returning to normalized entry restored the normalized controls. No new integer policy is inferred from this observation. |
| Literal Apply | Red `0.2` was applied and retained; row and Currently applied showed 0.2, actions became disabled and Literal color was active. |
| Reference Apply | Reference mode offered labeled targets; selecting `s2check` and applying changed the row to Reference s2check. |
| Resolution | Resolved & trace showed the resolved sRGB value, smoke → s2check authored-value chain, no resolution issues, and only Applied feedback in the header. |
| Group inspection | Created synthetic `s3group`, selected it from All content, and observed the read-only Group inspector. Group creation changed scope while preserving the prior token selection until explicit group selection, matching current behavior. |
| Exact source | Opening All authored data in Group inspector displayed the current revision and complete read-only group JSON with the expected local name and project/parent identities. |
| Log sample | Captured warning/error query returned no entries for the sampled flow; this is not exhaustive console/network qualification. |

## Limits and stopping

This is in-app Chromium evidence, not native Chrome qualification. Known dedicated
Chrome, screenshot and exact viewport limitations were not retried or repaired.
No compact geometry, screenshot/visual parity, full keyboard/focus matrix,
same-native-node instrumentation, restore conflict/recovery, stale source request
or exceptional target/unavailable state is claimed here. Source comparisons and
focused tests are distinct evidence, not substitutes for those runtime claims.

The temporary tab was closed after the walkthrough. Approximately five coordinator
browser/preparation minutes (estimate), zero harness repairs; browser checking
stopped after useful ordinary coverage. Final source/documentation reconciliation
is accounted separately in the S3 handoff. No older stopped campaign resumed.
