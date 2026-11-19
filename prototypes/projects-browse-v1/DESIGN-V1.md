# Projects browsing — Design V1.1

**19 November 2026 · interactive proposal, not production implementation.**
The user approved the initial direction and authorized this prototype, including
Keep editing / Discard draft on dirty form dismissal. On 19 November 2026, the
user approved V1.1 for analyst review. Final contract agreement and production
implementation authorization remain pending.

## View

Run from the repository root:

```sh
npx vite --config prototypes/projects-browse-v1/vite.config.ts
```

Open [All projects](http://127.0.0.1:4200/). Each URL starts a fresh, independent
in-memory sample session. No browser project storage is read or written. Refresh
resets the sample. The production app at port 5173 is unaffected.

| Review state | URL / action |
| --- | --- |
| Populated collection | [All projects](http://127.0.0.1:4200/) |
| Description match | [Search storefront](http://127.0.0.1:4200/?q=storefront) |
| No matches | [Search zzz](http://127.0.0.1:4200/?q=zzz) |
| Empty collection | [Empty](http://127.0.0.1:4200/?collection=empty) |
| Loading | [Loading](http://127.0.0.1:4200/?collection=loading) |
| Catalogue failure | [Unavailable](http://127.0.0.1:4200/?collection=unavailable) |
| Creation | [New project](http://127.0.0.1:4200/?dialog=create), or use either New project button |
| Unknown write outcome | [Unknown result](http://127.0.0.1:4200/?result=unknown): open New project and submit a name |
| Retained, readback unavailable | [Readback failure](http://127.0.0.1:4200/?result=retained): submit a name |
| Rejected creation | [Rejected](http://127.0.0.1:4200/?result=rejected): submit a name |
| Backup replacement preview | [Restore review](http://127.0.0.1:4200/?dialog=restore) |

## Proposed composition

- Preserve the centered Projects grid: balancing left track, central browsing
  surface and 25rem contextual inspector. Below 880px, use separate browse and
  inspect surfaces, retaining an explicit Inspect selected project action.
- Tokens-like main heading: Projects / All projects, Restore backup secondary
  action, New project primary action, one line of browser-local context.
- Search follows the heading. Case-insensitive substring matching uses name,
  description and identity; trim search edges, preserve authored text. Sort names
  naturally, case-insensitively, with stable identity tie-breaks. These exact search
  details are proposed for review, not a claim about production behavior.
- The list shows Project (name plus description), Contents (tokens/groups), Created
  and Last updated. At list widths below 42rem, lifecycle dates appear as labeled
  metadata beneath the project description instead of separate columns. Identity appears in the row only to disambiguate duplicate or
  unnamed projects and identify unavailable entries; full identity remains in the
  inspector. Unavailable rows remain selectable with an explanatory reason.
- Selection remains separate from opening. Filtering preserves selection and
  offers Show selected project. Search survives the simulated Open/Back round trip.
- The inspector retains explicit Open project and Download backup actions and
  shows full local date/time values consistent with list dates. Legacy dates remain
  Unknown; unavailable entries show Unavailable. Fixture dates are illustrative.
- A Browser retention disclosure follows the list. It keeps the storage-protection
  message, retry action, backup guidance and session-only draft explanation.
- Empty collection, no matches, loading and unavailable catalogue have distinct
  content. Empty collection offers New project; no matches offers Clear search.

## Creation and recovery

New project uses the owned Base UI modal and shared fields/actions. Focus enters
Project name. Empty-name submission focuses the field and shows a local error.
Dirty Escape, backdrop or Cancel opens a confirmation; Keep editing retains exact
text, Discard draft clears it. Ordinary close returns to the invoking control.
Draft state sits above the modal in this prototype; production must retain its
existing App/useProjects ownership and command authority.

Creation outcomes are controlled by the external review URL. Pending disables
repeat submission. Rejected, unknown and retained-readback failures retain inputs.
Unknown/readback recovery appears within the modal, because background controls
are inert. Check outcome and Retry reading simulate successful recovery and open
a minimal Tokens landing surface. Review leaving exposes a separate warning.
These are interaction illustrations, not retention protocol implementations.

The simulated successful creation opens the new project, preserving the current
production destination. A Back to projects action lets reviewers inspect query
and selection continuity. The Tokens landing surface is deliberately abbreviated.

## Restore illustration and scope limits

Restore backup opens a file chooser dialog, then a staged preview. The direct
review URL supplies a sample preview without requiring a file. Selecting any file
also opens that same sample: file content is not read, parsed or validated.
The replacement checkbox illustrates an explicit safeguard only; production must
retain the existing complete staging, identity/revision checks, review steps,
recovery and restore behavior, rather than copying this simplified implementation.

Download backup and storage-protection retry only show local UI feedback. They do
not download data, request browser permissions or access storage. The sample has
no host, worker, IndexedDB, network API, actual backup handling or persistence.
All interactions use existing installed dependencies and owned UI primitives.

## Verification and next gate

Prototype Vite build passed. The coordinator checked case-insensitive name and
description search, filtered-selection reveal, empty/no-match states, dirty Cancel
with Keep editing and Discard focus, and narrow 780px browse/inspect layout without
overflow. During live prototype edits, React reported duplicate root creation and
reset sample state. The prototype now separates its exported App Fast Refresh
boundary from the entry point and disposes the root if that entry point is replaced.
That repair was source-reviewed and build-checked; no additional browser pass was
performed. These checks do not claim production tests or accessibility qualification. No deferred retention or
cross-browser campaigns were restarted. Review the visual hierarchy, list density,
dialog flow and retention/restore discoverability. The user subsequently approved
V1.1 for analyst review; that approval does not authorize production implementation.

## V1.1 — user-requested lifecycle dates

On 19 November 2026, the user requested creation and last-updated dates in the
project list. V1.1 adds both while retaining Project/Contents, centered geometry
and existing interactions. Container width determines columns versus labeled
metadata, so a wide viewport with a constrained middle pane remains readable.
Short dates use an explicit day/month-name/year format; titles expose full local
date/time and semantic `time` elements carry ISO timestamps. The inspector uses
the same values. Sample fixtures have explicitly illustrative timestamps, the
legacy unnamed fixture retains Unknown dates, and simulated newly created
projects receive the current timestamp. These sample values do not describe user
data or settle production lifecycle semantics. Prototype build and diff checks
passed; the coordinator owns any bounded visual check.
