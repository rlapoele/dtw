# Increment 010 first slice — bounded browser observations

15 November 2026. Production source frozen after the developer's final build;
base `717c08e`, with the exact reviewed changes identified by
[source patch](review-source.patch) and [manifest](review-source-manifest.json).
An ordinary synthetic project was created at the task-only origin
`http://127.0.0.1:5187/`. No existing project data was edited.

## Tool/environment limits

Native Chrome automation is not available as a connected browser surface. A
native-app attempt returned a current-state/concurrent-change guard, and creating
a dedicated Chrome browser session reported that Chrome was unavailable. The
active unrelated Chrome window was not used for testing. No connector was
installed, profile changed or new harness created.

The following observations use the available in-app Chromium surface, not native
Chrome qualification. The local Vite process initially could not listen inside
the filesystem sandbox (`EPERM`); the permitted local-server escalation started
it successfully. This was a tooling constraint, not evidence of an application
failure.

Screenshot capture was unavailable. A requested 900 × 800 viewport override did
not produce that reported page viewport: read-only DOM inspection still reported
1343 × 1194. Therefore no exact compact-viewport or screenshot-based visual parity
claim is made. The override was reset and the temporary tab closed at the end.
No screenshot or viewport harness repair was attempted.

## Observed through UI actions and fresh DOM snapshots

| Scenario | Observation |
| --- | --- |
| Empty catalogue | Project heading, empty message, restore file input, new-project form and alert/status containers rendered. |
| Empty name submission | Create project produced “A project name is required.” and focused the Project name input. |
| Project creation | A synthetic “Increment 010 smoke” project was created and opened in the workbench; zero-token context and normal controls rendered. |
| Token creation | New token dialog accepted `smoke`; Create returned a selected opaque-black color token and retained-success status. |
| Invalid raw draft | Red accepted `not-a-number`; All content retained the exact raw text, selected token and unavailable-draft preview. |
| Departure protection | Projects opened “Discard unapplied changes?” with Keep editing active. Keep editing returned with the exact invalid Red string still present. |
| Cancel and return | Editor Cancel followed by Projects returned to the catalogue. Its entry showed one token, zero groups and project identity. |
| Reopening | The catalogue entry reopened the same project, with its retained `smoke` token visible. |
| Captured console sample | In-app browser log query returned no warning/error entries for this sampled flow. This is not exhaustive console/network qualification. |

Read-only page inspection was limited to focus/DOM geometry; state changes used
the actual UI. No direct storage mutation, injected failure state or modified
application runtime was used.

## Unverified in this walkthrough

Native Chrome behavior, exact compact/desktop visual parity, screenshots,
restore-file selection/cancel and replacement protection, unknown-write
Review/Stay/Leave focus, full keyboard containment/return, unsuccessful native
open/recovery states and all older deferred qualification remain unverified here.
Controlled-host tests and independent source review provide distinct evidence;
they are not described as native React/browser checks.

Coordinator preparation, source-snapshot setup and bounded browser checking used
approximately eight aggregate verification minutes (estimate), zero harness-repair
cycles. Browser checks stopped on tool limitations and useful ordinary coverage;
no alternate automation stack or additional campaign was started.
