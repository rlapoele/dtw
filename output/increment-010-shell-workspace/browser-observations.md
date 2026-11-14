# Increment 010 S2 — ordinary browser observations

15 November 2026. Available in-app Chromium at task-only origin
`http://127.0.0.1:5187/`, after the developer reported production source stable.
The final source is identified by [patch](review-source.patch) and
[manifest](review-source-manifest.json) against baseline `d3a7e9c`.

The project was the disposable “Increment 010 smoke” project created during the
first-slice check, with one existing token before this walkthrough. No unrelated
user project was opened or changed. UI actions and fresh DOM snapshots supplied
the evidence; no injected runtime/storage mutations or failure states were used.

## Observed

| Scenario | Result |
| --- | --- |
| Catalogue/open | Existing synthetic project reopened with the retained token, moved header/navigation/workspace and current footer status. |
| Select/edit | Selecting `smoke` opened its color inspector; Red accepted exact invalid raw input `not-a-number`. |
| Search | Entering `missing` hid the selected token from results, showed the outside-list notice and Show selected token action, and preserved the inspector's invalid raw input. |
| Reveal | Show selected token cleared the search and revealed the selection. |
| All content | Switching to All content displayed the existing inventory, with the selected inspector and invalid raw text still present. |
| Departure | Projects opened Discard unapplied changes with Keep editing active. Keep editing preserved the exact invalid Red text. |
| Cancel/create entry | Cancel discarded the editor draft without changing the applied value; New token opened the moved creation dialog with Name active. |
| Unfinished form | After entering `s2check`, dialog Cancel opened the nested departure guard; Keep editing preserved `s2check` in Name. |
| Complete/return | Create retained the second token. Projects returned to the catalogue, which displayed two tokens and zero groups. |
| Log sample | Captured warning/error query returned no entries for this flow; this is not exhaustive console/network qualification. |

## Limits and stopping

This is in-app Chromium evidence, not native Chrome qualification. The dedicated
native Chrome connector, screenshot capture and exact compact viewport were not
retried after their first-slice limitations; no new connector, profile, alternate
stack or harness was installed. No screenshot, compact geometry, drawer keyboard
containment/return, same-node identity instrumentation, native restore or rare
recovery qualification is claimed. Source comparison and controlled tests are
separate evidence, not substitutes for unobserved browser behavior.

The temporary tab was closed after the sampled flows. Approximately four
coordinator browser/preparation minutes (estimate), zero harness-repair cycles;
browser checks stopped after useful ordinary coverage. Coordinator source-snapshot
and final documentation review are accounted separately in the S2 handoff.
