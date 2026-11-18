# Token list — Design V3

**User-directed navigation proposal — 18 November 2026.** The user requested
navigation by type, then refined it to **type → layer → group/path**. The new
section is called **Tokens**; it replaces the intermediate flat By type proposal.
**Groups** remains available for namespace browsing across types. V1/V2 records
remain historical. This is a mockup revision, not application implementation.

Open [the existing preview](http://127.0.0.1:4198/) after running:

```sh
npx vite --config prototypes/token-list-v1/vite.config.ts
```

- [Desktop hierarchy, 1600 × 1200](../../output/playwright/token-list-v1/navigation-v3.png)
- [Compact navigation drawer, 390 × 844](../../output/playwright/token-list-v1/compact-navigation-v3.png)

## Navigation behavior

Library retains All tokens and the inactive All content control. Tokens contains
only populated types with the same type icons used in list rows. Fixture counts
are derived from the complete project, independent of active scope or search:
**Colors 6, Dimensions 2, Durations 1**. No absent type is shown.

Each type expands into populated Primitive, Semantic, Component and Unspecified
layers, then namespace-path leaves. Counts at every level reflect that branch's
project membership. Colors opens with Primitive and Semantic expanded to make the
proposal reviewable. Other branches can be expanded independently.

Chevron buttons expand/collapse; label/count buttons select the scope. They use
separate focusable controls, expanded-state labels and `aria-current` on the
selected scope. Clicking a type includes that type across all groups; clicking a
layer narrows to that type and layer; clicking a namespace leaf further narrows
to its subtree. Full namespace paths are shown at the leaf level; the prototype
does not create a new model tree or change token containment.

Within type scopes, tokens order by layer, namespace path and natural local name.
Layer/path scopes retain the applicable remaining order. Existing All tokens and
Groups ordering is preserved. Search filters the current scope while navigation
counts remain project-wide. Changing scope preserves the inspector selection;
a visible outside-list notice and Show selected token action prevent a misleading
selection when its row is filtered out.

## Compact navigation

Browse opens the same Library / Tokens / Groups content in a native modal dialog
styled as a left drawer. The drawer scrolls when branches exceed the viewport;
its close button stays reachable. Escape and close return focus to Browse.
Selecting a scope closes the drawer and returns to the browse surface. The
existing compact color presentation is unchanged. This replaces V1/V2's
illustrative All/color toggle. The native dialog is prototype-owned and does not
select a new production UI dependency or settle production drawer implementation.

## Evidence and limits

The initial flat-type step used approximately three of its five scoped verification
minutes. It verified type filtering/counts, counts stable during search, the
outside-selection notice, and phone Escape/focus return plus selection closing
the drawer. The preview server was restarted after it had stopped; no harness
repair was required.

The subsequent user-requested hierarchy had an additional five-minute allowance.
Approximately three aggregate minutes including coordinator viewing were used:
Primitive scope returned two rows, color / brand returned one, and the final
hierarchy was visually inspected at 1600px desktop and 390px phone widths. The
screenshots above supersede the intermediate flat-type captures. Checks stopped
with zero repairs; previous V1/V2 campaigns remain stopped.

No production suite, exhaustive tree keyboard audit, screen-reader or cross-engine
qualification was run. This uses ordinary buttons/disclosures, not an ARIA tree
with arrow-key navigation. All editing/creation/history limitations of V2 remain.
Production source, dependencies, stored projects and domain semantics are unchanged.
User feedback is next; no analyst approval or implementation authorization is inferred.

Suggested commit: `docs: add hierarchical token navigation mockup`.
