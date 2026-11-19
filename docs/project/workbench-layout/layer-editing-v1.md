# Inspector layer editing V1

**Approved conversational direction — 19 November 2026.** The user requested an
editable Layer select in place of the inspector badge and then authorized the
proposed bounded flow: “Committed and pushed. Go ahead with making the Layer
editable.” This document records that accepted proposal for implementation and
review. Its text wireframe is a transcription of the agreed arrangement, not a
new independently user-reviewed mockup or evidence of delivered behavior.

The [visual direction](../visual-direction.md) and
[presentation conventions](../presentation-conventions.md) remain authoritative
for appearance. Existing application eligibility, retention, recovery and history
policies remain in force. This slice adds no component-definition authoring.

## Arrangement

Replace the layer badge beneath the token description with a visibly labeled
native Select, using the owned Select component and current input styling.
The selector remains above the inspector tabs, in the same token context.

```text
COLOR TOKEN
blue / 500                    Current   New

Blue colors…
Layer
[ Primitive                       ▾ ]

Authored value             Resolved & trace
──────────────────────────────────────────
[Selected tab's existing content]

──────────────────────────────────────────
Changes are not applied yet.
                    [ Cancel ] [ Apply changes ]

Regeneration                            allowed
```

One shared action region serves both tabs. It sits outside their panels, before
the existing Regeneration footer, and contains the existing Cancel/Apply controls
and relevant pending/error/recovery feedback. Tab switching must not hide the
only way to apply or discard a layer draft. Retain the existing pane scroll and
responsive geometry; do not introduce another modal, command owner or duplicated
sets of actions. Exact scroll visibility follows existing pane behavior rather
than promising a new sticky toolbar.

## Options and scope

| Option | Treatment |
| --- | --- |
| Unspecified | Selectable; represents the absence of an authored layer. |
| Primitive | Selectable. |
| Semantic | Selectable. |
| Component | Visible but unavailable for selection in this slice. |

Explain the unavailable option next to the field with concise copy such as
“Component requires a component association; editing it is not available yet.”
An option's disabled state alone is insufficient explanation. Existing component
tokens retain Component as their displayed selection and remain inspection-only.
Do not clear, invent or replace their component association.

Layer editing shares the existing eligible unconditional color-token scope.
Unsupported tokens and currently unavailable targets retain truthful applied or
last-known layer information; the select must not imply they are editable.
Existing regeneration protection policy remains unchanged.

## Draft and apply behavior

- Selecting a layer updates the same token edit session as Literal/Reference and
  color values. It does not persist, create history, move navigation rows or change
  applied labels immediately. Tab changes preserve the entire draft.
- Apply changes submits the selected layer and active authored value together as
  one atomic operation and one Undo/Redo step. A layer-only edit preserves exact
  authored value data; viewing a derived color space must not promote it.
- Cancel discards layer and value drafts together and restores current applied
  facts, preserving existing representation-preference policy. Dirty/departure
  protection includes layer-only drafts. Changing back to the applied layer does
  not leave a layer-only dirty state behind.
- Successful application refreshes applied layer labels, counts and navigation
  from the accepted result. Preserve token selection by stable identity even if
  the token leaves the previously selected layer branch. Do not select another
  token with a matching name or silently discard the just-applied inspector.
- Keep the existing no-op, validation, history capacity and retention policies.
  This design does not authorize weakening them or adding persistent draft state.

## States, feedback and focus

Reuse existing editor command gates for pending acceptance, ownership/read-only,
read failure, target unavailability and recovery. The Layer select is disabled
when changing it is unavailable; Apply remains blocked until the whole submitted
edit is valid and any required recovery review is complete. Cancel remains
available according to the existing dirty/pending policy, including to discard
invalid drafts. Pending acceptance must prevent duplicate submissions.

An ordinary failed Apply retains both drafts and reports the actual failure.
Unknown or retained-but-unreadable outcomes use the existing workbench recovery;
never retry the mutation merely to refresh the UI. External revision changes
refresh a clean session, while dirty sessions preserve layer and value input and
require the existing review/reapply path. Recovery comparison must include previous
applied layer, current layer and the preserved layer draft as well as value data.
No recovery action may substitute a new token identity.

The native select has a persistent “Layer” label, native keyboard selection and
the existing visible focus outline. Changing its option leaves focus in the
select. Preserve existing error/recovery heading focus behavior and post-command
focus intent, but never target an input hidden in the inactive tab: the always
mounted Layer select is a visible fallback for shared actions invoked from
Resolved & trace. Do not switch tabs merely to make a focus target available.
Pending controls should become enabled before post-command focus is restored.

The shared status copy must describe the expanded edit: replace the obsolete
“Editing preserves name and metadata” claim with wording that allows layer
changes while still making the preserved name/other metadata clear. Continue
using the established shared outcome feedback rather than adding a second toast.

## Review boundary

Check layer-only and combined edits, Cancel, tab switching, native keyboard
selection, no-op return to the applied layer, failure/recovery preservation,
Undo/Redo, and stable selection after reclassification. Inspect wide and compact
layouts for visible actions and focus. Use the increment's cumulative verification
allowance; these cases do not reopen prior qualification campaigns.

This is a design record only. Implementation, tests, runtime verification and user
visual acceptance must be recorded separately in the owning increment. No files
are staged, committed or pushed by this design task.
