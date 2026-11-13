# Presentation conventions

**Agreed working constraints — 9 November 2026.** The user approved these rules for consistent agent-assisted interface development. They consolidate the accepted renderer/visual direction and Increment 004 styling discipline. This agreement authorizes documentation reconciliation only; application refactoring, dependency installation and the next increment remain outside this change.

## Ownership

[AGENTS.md](../../AGENTS.md) carries the concise mandatory rules. This document owns their detailed interpretation and review checks. [Architecture](architecture.md) owns dependency boundaries; [visual direction](visual-direction.md) owns the accepted Precision reference. Completed increments and frozen evidence retain their original meaning.

Apply these rules to new interface work and changes to existing presentation, with verification proportionate to the change. They do not claim every existing component already satisfies every convention.

## Neutral theme and token source

Use shadcn-style semantic theming adapted to the accepted neutral Precision design. Content-first means clear token content, controls and feedback supported by restrained chrome. It is a design principle, not a newly selected preset. Preserve accepted density, hierarchy, compact actions and inspector/navigation surfaces. Stock theme scaffolds must not silently replace those decisions. Color specimens and meaningful semantic feedback may use color.

Keep semantic design values in one source, currently `src/presentation/styles/global.css`. Map referenced semantic CSS variables through Tailwind's `@theme inline` namespaces: for example, `--color-background: var(--background)` exposes `bg-background`. Use the namespace appropriate to the decision, such as `--color-*`, `--radius-*` or `--font-*`. Focused CSS can reference the same source. Values defined directly in `@theme` also have one source; avoid adding a duplicate alias layer without a need. Application theme tokens remain distinct from user-authored design-token data.

## Utilities and exceptions

Use Tailwind's standard scale and existing project-defined utilities first. Avoid arbitrary-value utilities and direct CSS-variable expressions in JSX when named utilities express the design. A meaningful reusable non-standard decision should become a token exposed through the appropriate theme namespace before use. Do not create a token for every isolated measurement, duplicate palette literals in components, or move ordinary utility styling into broad CSS rules or mass `@apply` blocks.

Keep necessary exceptions focused: native range track/thumb pseudo-elements, dynamic authored-color specimens, illustrative gradients/checkerboards, and panel/precision geometry that standard utilities cannot preserve. Record the owner, reason and affected verification with the change. Existing exceptions are inventoried in the [Increment 004 evidence](../../output/playwright/increment-004-refactor/final-evidence.md#final-css-disposition-and-ownership).

A runtime color or computed specimen is data, not automatically a reusable application-theme token. Do not impose a blanket ban on inline styles or bracket syntax; inspect purpose and existing alternatives. Material visual changes still follow the user/design agreement workflow.

## Class composition with cn

The [`cn` utility](https://github.com/shadcn-ui/cn) may join conditional classes and resolve Tailwind utility conflicts when combining defaults, variants, states and caller-provided `className`. Keep simple static class strings straightforward. If adopted, expose it through one shared presentation entry point using project import aliases; reuse that entry rather than adding parallel merging helpers.

Preserve each component's documented composition contract. The current Button contract is additive, with geometry/appearance selected through size/variant; conflict resolution must not silently change caller precedence. For Base UI components accepting a `className` callback, evaluate the callback with its actual state before composing its result. Retain owned classes and forwarded props/ref/render behavior. Check custom theme utilities are understood by the merger, so legitimate classes are not discarded as conflicts.

**Adopted and precompiled — 12 November 2026:** `cn` 0.5.2 (MIT, Node >=22)
remains pinned. Import the shared utility from `@presentation/lib/cn`. It now uses
`createCn` from `cn/engine` with generated merge tables, not browser-side `cn/config`.
The compiler reads `src/presentation/styles/global.css`; the `@theme` namespaces
register `text-caption` as a font size and `font-heading` as a font weight directly,
so these names and values have one source of truth. No runtime configuration compiler
or duplicate manual registration is shipped to the browser.

The `cn/vite` plugin generates `src/presentation/lib/cn-tables.generated.ts` at
Vite dev/build start and updates tables when the theme stylesheet changes. The
`cn:build` npm script performs the same generation before typechecking, tests and
test-watch startup. The generated file is Git-ignored; run `npm run cn:build` before
raw compiler/IDE commands that bypass these entry points on a fresh checkout.
All class groups are retained (`full: true` / `--full`) to preserve the shared merger's
behavior for classes beyond the current icon corpus, rather than introducing
source-scanning restrictions. Additional custom behavior not expressed by theme
namespaces would require a build-time extension, not a new runtime merger.

Caller-last precedence, conditional classes and the existing Icon API are unchanged.
Button retains its additive class string and state-callback handling. No package-wide
parity or runtime-performance claim is made. This uses the package's
[documented precompilation interface](https://github.com/shadcn-ui/cn/blob/main/docs/build-setup.md),
checked against the installed 0.5.2 APIs on 12 November 2026.

## Icons

Heroicons Outline is the sole application UI icon family. Reuse the existing `@heroicons/react/24/outline` integration, including when adapting copied/generated components that default to another family. Keep sizing and stroke treatment consistent; avoid ad hoc SVG or text glyph replacements for ordinary interface icons. Product artwork and token specimens are separate from UI icons.

Icon-only controls need accessible names. Hide decorative icons from assistive technology and preserve the native semantics of their containing controls.

**Shared Icon — 12 November 2026:** application callers use
`@presentation/components/ui/icon`; only that component imports Heroicons directly.
Its typed `name` is one of `menu`, `chevron-down`, `chevron-left`, `chevron-right`,
`folder`, `info`, `plus`, `stack`, `grid` or `close`, backed by explicit imports of
the ten Outline glyphs in use. Add a mapping when a real new icon is needed.

`Icon` defaults to `size-4 shrink-0`, decorative `aria-hidden` and `focusable="false"`.
Caller `className` is merged last through the shared `cn`, allowing explicit overrides
such as `size-5`. Existing marker/positioning classes remain at their call sites.
For an icon that independently conveys meaning, supply `label`; the SVG then has
`role="img"` and an accessible label instead of being hidden. Icon-only buttons
still carry their own accessible control names. Other supported SVG props/ref are
forwarded to the underlying glyph; accessibility defaults are owned by the wrapper.

```tsx
<Icon name="plus" />
<Icon name="folder" className="size-5 text-muted-foreground" />
<Icon name="info" label="Information" />
```

## Owned components and native controls

Inspect `src/presentation/components/ui/` and the functional blocks under `src/presentation/features/workbench/` before adding another implementation. The [workbench ownership map](workbench-component-organisation.md) identifies the current component and workflow owners. Reuse or extend an existing component where appropriate. Use locally owned shadcn-style components built on Base UI or native HTML, adapted to the product.

Consider `Sheet`, `Dialog`/`AlertDialog`, `Select`, `Combobox`, `Field`, `Input`, `Checkbox`, `Alert`, `Skeleton`, `Spinner`, `Empty` and `Pagination`, alongside foundational `Button`/`Badge` primitives, when a real slice requires them. This list is neither exhaustive nor an installation checklist. Avoid speculative loading, pagination or modal machinery.

Preserve native controls when custom behavior adds no demonstrated value; a styled native select remains valid. Choose a custom Select or searchable Combobox for an actual interaction need. Preserve labels, descriptions, validation errors, keyboard behavior, focus containment/return where applicable, and component contracts. Library primitives alone do not establish accessibility of the assembled interface.

## Verification

For affected interface code, the developer and reviewer check:

- Existing primitives were reused appropriately; additions and dependencies serve the scoped feature.
- Named utilities and semantic tokens express ordinary styling; exceptions have an owner/reason and no duplicated palette or cascade workaround.
- UI icons use Heroicons Outline and controls retain accessible names.
- Class composition retains defaults, variants, conditions, caller behavior and callback state. Custom utilities are not incorrectly discarded. Add focused behavioral checks when changing the composition contract.
- Affected keyboard, focus, validation, disabled/loading/empty states and responsive layout work in the browser. Inspect relevant visual parity when changing geometry or theme values.

Use existing typechecks, tests and runtime checks proportionately; report actual evidence and limits. Documentation-only updates require prose/link/diff review, without claiming a new application test run. Automated searches can assist but must not classify every bracket or runtime style as a violation.

## References

Consulted for the approved reformulation, 9 November 2026: [Tailwind theme variables](https://tailwindcss.com/docs/theme), [shadcn theming](https://ui.shadcn.com/docs/theming), [Heroicons](https://github.com/tailwindlabs/heroicons), and [`cn`](https://github.com/shadcn-ui/cn). Recheck applicable APIs and installed versions when implementing; upstream examples do not override agreed product or dependency scope.
