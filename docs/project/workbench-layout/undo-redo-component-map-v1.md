# Undo/Redo V1 — component ownership delta

**Source-informed proposal — 15 November 2026.** Read alongside
[V1 design](undo-redo-v1.md), [draft 012](../../increments/012-session-undo-redo.md)
and the [delivered ownership map](../workbench-component-organisation.md).
No history API currently exists; names and mechanism below remain candidates.

| Existing owner / candidate delta | Responsibility and lifetime |
| --- | --- |
| `Workbench/Workbench.tsx` | Retain open-project selection, view/query, guarded intent and completion authority. Remain the caller of `useProjectCommands`, `useCreationForm`, lifecycle/readback/layout hooks. Header/shortcut intents enter this same guarded path; accepted completion reconciles surviving selection/scope and the one editor. Project-keyed lifetime ends on departure. |
| `Workbench/components/WorkbenchHeader/WorkbenchHeader.tsx` | Compose context, controlled history controls, Projects and current Browse/Back. No host calls, snapshots, history stack or independent busy state. |
| Candidate `Workbench/components/WorkbenchHeader/components/HistoryControls.tsx` | Small controlled pair plus next-action/disabled-reason descriptions, using owned Button. Props carry availability, action names, reasons and callbacks. Follow the V1 user amendment: icons plus text on desktop/tablet, icon-only with accessible names on mobile; proposed separate 640px label threshold remains for agreement. No hook or state folder is needed just to render this. |
| Existing shared `components/ApplicationHeader/ApplicationHeader.tsx` | Keep generic navigation/context/action slots and frame responsibility. Permit the identified wrapped composition without Workbench command knowledge. Projects header stays free of history. |
| `Workbench/hooks/useProjectCommands.ts` | Extend this existing command/recovery owner for requested history operations after application API agreement. One mutation gate, issue identity, acknowledgment, unknown/readback recovery and completion path; no competing history writer. It does not become the authoritative snapshot stack. |
| Candidate `Workbench/hooks/useWorkbenchHistoryShortcuts.ts` | If event routing warrants extraction, called once by Workbench. Only eligibility/modifier routing and cleanup; callback reaches the same guarded intent. Native inputs/dialogs/composition and disabled/repeat events are shielded. No command calls or stack here. Could remain a small Workbench effect if clearer. |
| Existing `Workbench/components/WorkbenchRecovery/components/{WorkbenchFeedback,RetentionRecovery,DepartureGuard}.tsx` | Render controlled success/failure/expiry and existing recovery outside hidden panes. Extend guard with explicit history action/copy, keeping existing project-departure semantics. Reuse dialog primitives and safe focus return; no parallel history modal owner. |
| Existing `Workbench/hooks/useWorkbenchLayout.ts` and Workbench completion | Preserve single mounted editor and responsive surface. Apply agreed visible fallback after target removal; avoid resetting selection or focus for passive Redo. Extract pure selection/scope reconciliation under Workbench `helpers/` only if the actual logic warrants it. |
| Existing `TokenEditor/TokenEditor.tsx` → `hooks/useTokenEditor.ts` | Remain sole editor-session caller and native draft-undo owner; no applied-history stack or global shortcut listener. Key/session refresh changes only for accepted authored replacement or removed target, never responsive hiding or an unaccepted reversal. |
| Candidate `application/retention/history.ts` or purpose-owned subfolder if warranted | Host-independent plain-data application coordinator owns authoritative session entries/cursor and admitted target transitions. Coarse project operation uses current retention port with revision/incarnation checks. Snapshot versus inverse is unselected; avoid speculative files/types. Not a private React hook or durable retained schema. |
| Existing `presentation/host/{protocol,worker-runtime,worker-client}.ts` | Typed runtime-validated history intent/result and availability projection after API agreement. Runtime hosts application history within open-session lifetime and fences/replaces it with host rules. Keep exact snapshots internal; renderer supplies no arbitrary replacement payload. Existing issue/check/consume/fence semantics must extend coherently. |

Place shared operation/result types beside their actual application/host boundary;
private presentation types stay with their consumer owner. A pure history-label or
selection helper belongs under its functional owner `helpers/`, not a global
folder grouped only by file kind. Add no empty directories, generic command bus,
mega-hook, new state store, alternate editor or worker port. This delta extends
the delivered component categories; it does not reopen 011 decomposition.

Application mechanism, port changes and exact result vocabulary need contract
agreement and implementation design. This map allocates responsibilities without
claiming those capabilities already exist. Source evidence is the current header's
controlled actions, Workbench's `request` guard, its direct `useProjectCommands`
call, command hook's current acceptance/recovery gate and TokenEditor's sole
`useTokenEditor` call. All are observable source facts, not runtime Undo evidence.

The draft also identifies an existing closed persisted receipt-operation decoder.
Undo/Redo therefore needs an explicit receipt compatibility/versioning decision;
it cannot be mislabeled as `restoreProject`. That boundary decision remains open.
This does not choose a new authored format, alter backup scope or authorize durable
history persistence. It does not require different user-facing controls.

## Agreement — 15 November 2026

User agreed the refined contract/design and authorized implementation then independent
review. This map's ownership allocation and 640px label threshold are agreed; exact
file extraction remains an implementation choice within existing owner/type folders.
The [012 final agreement](../../increments/012-session-undo-redo.md#final-agreement-and-implementation-authorization--15-november-2026)
supersedes earlier pending-mechanism/compatibility labels in this planning artifact.
