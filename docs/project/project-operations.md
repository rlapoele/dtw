# Project operations

**Agreed capability inventory and inspection direction — 15 November 2026.**
This records the user’s project-capability discussion during
[Increment 011 planning](../increments/011-responsive-shell.md). It is not a claim
that every operation is delivered or authorized for implementation in 011.

## Capability inventory

| Capability | Intended meaning |
| --- | --- |
| Create | Create a project with its own stable identity. |
| Open / close | Enter the project’s token workbench or return to Projects; closing is not deletion. |
| Rename / edit description | Change project metadata without changing identity. |
| Back up | Download supported applied project data in a native, versioned DTW project representation. Drafts and unfinished forms are excluded. |
| Restore | Read a native DTW backup to create or replace the corresponding local project, preserving identity and requiring explicit replacement protection. |
| Delete | Remove a locally retained project; previously downloaded backups remain independent. Exact protection/recovery policy needs a scoped contract. |
| Import | Normalize an external format into a new or existing project with visible compatibility diagnostics; exact profiles and merge/replacement policy remain to be scoped. |
| Export | Generate a selected external format with explicit compatibility diagnostics and coverage. |
| Inspect | Select a project in the list and display its information in the contextual inspector. |

Backup/Restore are the native-project pair; Import/Export are the external-format
pair. A native backup is an explicitly supported representation, not a raw browser
storage dump or an implicit choice of the broader canonical workspace format.
Existing backup coverage and replacement rules remain authoritative. External
profiles and interoperability promises remain governed by
[interoperability](../design-tokens/interoperability.md).

Duplicate/fork remains a possible later capability, not a delivery commitment.
An independent duplicate would require a new project identity; restore preserves
identity. No new duplication/identity-remapping policy is selected here.

## Selection, inspection and opening

The user agreed that project inspection should follow the workbench experience:
select a project in the list and show its details in the inspector on the right
where the layout provides sufficient space. Selecting a project **does not open**
its token workbench. The user explicitly confirmed that opening now requires a
separate control indicating the intent to work on the project.

This supersedes the direct-open-on-project-name direction in
[Projects/shared-shell V1](workbench-layout/projects-shell-v1.md). Current application
behavior still opens directly; this is an agreed design direction for revision,
not an implemented change.

**Coordinator recommendation, pending design review:** label the separate action
**Open project** and place it prominently in the project inspector. At narrow
widths, adapt project inspection to the full-width inspection/Back pattern rather
than squeezing a right-hand pane beside the list. Exact narrow entry, action
placement, focus, list-context preservation and no-selection/unavailable states
need concrete revised designer artifacts and user review.

Inspector fields, editable versus read-only metadata, and the exact arrangement
of project operations on Projects remain to be designed. The capability inventory does not add buttons for
undelivered operations or settle their contracts. Existing project command,
restore, error/recovery and identity guarantees constrain the revised design.

## Placement of project actions

**User-agreed direction — 15 November 2026.** Project-management capabilities
belong on **Projects**. Within the token workbench, the only project-management
control is navigation back to **Projects**. In particular, the next workbench
design removes **Restore backup** and **Download backup** from its header and
provides their project-management entry points on Projects instead. Future
project-level metadata, delete, import/export and duplication actions follow this
placement rule when their separate scope is agreed.

The workbench may still identify the current project and show relevant retention,
validation or recovery feedback; these are contextual information and existing
safety behavior rather than a duplicate project-management toolbar. Returning to
Projects retains the current dirty-form/draft, busy/unknown and safe-departure
protections. It is distinct from Back within a narrow token inspector.

The new design must account for backing up a selected project from Projects,
without assuming that opening the token workbench is required. The required
read/backup coordination and any affected retained/unknown states need scoped
analysis; the placement decision alone does not authorize protocol changes or
weaken revision/replacement protection. Current application controls remain
unchanged until implementation is agreed and authorized.

## Next design step

Prepare an identified Projects V2 proposal with list selection, contextual project
inspector, explicit Open project action and project-operation entry points.
Revise the workbench header to retain only Projects navigation for project
management; show responsive states down to
320 CSS px and shared React shell/component boundaries. Present it to the user
before analyst review. No new design revision, analyst approval, final contract
agreement or implementation authorization is established by this record.
