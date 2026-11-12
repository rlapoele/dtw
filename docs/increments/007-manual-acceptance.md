# Increment 007 — manual acceptance

**USER-REPORTED ACCEPTANCE — 12 November 2026.** The user reported finishing the
manual tests with everything looking good and explicitly requested Increment 007
closure with deferred checks recorded and no automated qualification restart.
The earlier OKLCH preview issue was fixed in `6904d45`, and the user explicitly
confirmed that the original preview case works before completing manual acceptance.

This is overall user acceptance of the ordinary checklist, not an agent-observed or
instrumented per-step replay. Browser/version, OS, profile, URL/origin and individual
optional cross-browser/AT results were not supplied. They remain unrecorded rather
than inferred as passes. The checklist below is retained for reference, not another
test request. See the [closure amendment](007-local-retention-and-backup.md#closure-and-qualification-amendment--12-november-2026)
and [deferred qualification](007-local-retention-and-backup.md#deferred-qualification).

Record browser/build, OS, normal browser profile, exact application URL/origin and date.
Use only clearly named **disposable test projects**. Keep existing real projects intact;
no storage clearing, private browsing or deletion is needed. Leave test projects in place.

| Record | Value |
| --- | --- |
| Browser/build, OS | Not supplied in the acceptance report |
| Profile, URL/origin, date | Profile/origin not supplied; report received 12 November 2026 |

1. **Create:** in Projects, try an empty name and a whitespace-only name. Expect a
   name-field error, preserved input and no project entry. Create a disposable project
   with a recognizable name containing leading/trailing spaces and Unicode. Expect
   accepted text preserved exactly; duplicate names are allowed. For a new token,
   check a short description with Unicode/whitespace is preserved too.
2. **Author and reopen:** create a group, a literal color token and a reference token.
   Edit a value: Cancel leaves applied data unchanged; Apply retains the change.
   Return to Projects, reopen, then reload after all writes finish. Expect identical
   IDs, hierarchy, literal/reference values, description and applied state.
3. **Backup excludes drafts:** leave a visibly different unapplied color draft and
   download a backup. Expect the draft to remain in the editor, while backup/restore
   contains only the applied value. Download initiation alone does not confirm a file
   was kept; locate the actual downloaded file.
4. **Native picker and preview:** use Restore backup and the OS file picker. Cancel
   the picker: expect no retained change. Select the downloaded file: expect project
   identity, content summary and diagnostics before confirmation, with no write merely
   from selection/preview. Cancel this preview; local applied data stays unchanged.
5. **Independent restore:** optionally open the same application origin in your other
   normal browser, where this disposable project is absent. Chrome and Firefox have
   separate stores; there is no automatic synchronization. Select the backup and
   explicitly confirm restore. Expect the same project/entity IDs and applied data.
   If no separate empty environment is available, mark this check Not checked.
6. **Same-ID choices and replacement:** use only the disposable project. Add a local-only
   token after the earlier backup. Select that earlier backup: try Open local project,
   Review replacement and Cancel. No choice may silently replace data. To actually
   replace, first back up the **current local revision** and explicitly acknowledge its
   protection. Confirm complete replacement: earlier backup IDs/data return and the
   local-only token disappears. A local change after protection must invalidate it.
7. **Second tab:** open this same project at the same origin/profile in another tab.
   Expect only one writable tab; the other is visibly inspect-only. Do not use two
   browsers as a same-store ownership test. Closing the owner permits deliberate
   recovery in the other tab without silent overwriting of preserved input.
8. **Dirty departure:** enter an invalid color draft or unfinished creation/rename form.
   Attempt app-controlled departure. Keep editing/Stay and Escape preserve exact input
   and return focus sensibly; explicit discard leaves applied data unchanged. Reload
   and browser close prompts are best effort; session drafts are not durable.
9. **Keyboard and layout:** use Tab/Shift+Tab, Enter and Escape through affected dialogs;
   check visible focus, labels, errors and focus return. Set actual browser zoom to
   200%, then try a compact window. Controls, feedback and inspector remain usable.
10. **Complete source:** select a token, then open Metadata → All authored data. The
    source describes the selected entity; a project backup separately contains the whole project.
    Check complete applied source, local scrolling and visible status. Try native
    selection/copy into a local editor and Find a known unique value. Check the copied
    source is complete, not a prefix. If available, try your screen reader; otherwise
    mark that portion Not checked. A small fixture does not qualify large-source limits.

For future issue reports, use **Pass / Issue / Not checked** with reproduction details. No additional report is required for the accepted closure.

| Check(s) | Result | Notes / reproduction |
| --- | --- | --- |
| Overall ordinary manual checklist | User reports everything looks good | Accepted for closure; individual optional checks and environment metadata not supplied |
