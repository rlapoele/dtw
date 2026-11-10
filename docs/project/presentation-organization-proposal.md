# Presentation organization review

**Proposed maintenance refactor — 10 November 2026. No source moves yet.**
The user requested a review and clearer organization of `src/presentation/`.
This is separate from Increment 007's behavior and qualification work. It changes
no presentation design, component API, domain semantics, dependency or retention policy.

## Findings and recommended structure

The root currently mixes application composition, workbench components, color
formatting, raw draft state and readback presentation. The existing `components/`
also mixes generic controls with token-specific UI. For example, `Select.tsx` is
a generic native control outside that folder, while `inspection-tabs.tsx` has
fixed token-inspection labels despite wrapping Base UI. Library ancestry alone
does not make a component generic.

Use responsibility rather than file extension as the organizing rule:

```text
src/presentation/
├── main.tsx
├── tsconfig.json
├── app/
│   └── App.tsx
├── styles/
│   └── global.css
├── components/
│   └── ui/
│       ├── badge.tsx
│       ├── button.tsx
│       ├── dialog-content.tsx
│       ├── field.tsx
│       ├── input.tsx
│       └── select.tsx
└── features/
    └── workbench/
        ├── components/
        │   ├── ProjectNavigation.tsx
        │   ├── TokenList.tsx
        │   ├── CreationDialog.tsx
        │   ├── Editor.tsx
        │   ├── ColorFields.tsx
        │   ├── AuthoredValue.tsx
        │   ├── inspection-tabs.tsx
        │   └── swatch.tsx
        ├── state/
        │   └── session.ts
        ├── color/
        │   ├── authored-color.ts
        │   ├── integer-rgb.ts
        │   ├── preview.ts
        │   └── visual-range.ts
        └── readback.ts
```

Keep the stylesheet intact when moving it: semantic tokens and Tailwind mappings
remain one source. Split no new theme/reset/component stylesheet layers without
a demonstrated need. Generic UI includes owned native controls as well as Base UI
wrappers; it does not imply installing shadcn tooling or `cn`. Workbench swatches
and inspection tabs stay with the feature that gives them meaning.

The `.ts` files are not interchangeable utilities: `session.ts` owns renderer-only
drafts, color files adapt exact data for presentation, and `readback.ts` presents
application results/identity labels. A generic `helpers/` or `utils/` folder would
conceal those responsibilities again. Keep their current code and exports during
this move; future extraction can follow actual reuse. Preserve existing component
filenames except `Select.tsx` becoming the consistent UI primitive `select.tsx`.

## Migration impact and boundaries

1. Identify a stable post-assessment source snapshot and preserve user sessions
   before changing paths. No source move during the native-selection review.
2. Move production files and update maintained application/test/browser-fixture
   imports, CSS entry points and relevant aliases/configuration. Mirror test
   ownership where useful without changing assertions or behavior.
3. Reconcile current architecture, presentation conventions, source navigation and
   README references. Do not rewrite historical reports or frozen manifests.
4. Run the existing full tests, strict typechecks and isolated production build,
   then focused fresh-browser authoring/focus/layout checks. Compare generated CSS
   and inspect the source diff for behavior changes. Obtain independent review of
   the stable refactor snapshot before the completion handoff.

Frozen prototypes and research import old source paths, including direct relative
stylesheet paths. A search found 155 matching reference lines in 45 maintained or
historical test/prototype/research files; this is an impact inventory, not a count
of files to rewrite. Preserve historical artifacts byte-for-byte and replay them
at their recorded source commit when required. Do not quietly edit them to follow
the new layout or add a large permanent compatibility layer just to preserve old
imports. Explicitly record any currently needed prototype replay requirement
before choosing the migration route.

There is also a live-session constraint: V4/V5 development servers reuse production
modules. Moving those modules can trigger HMR/reload or broken imports in a review
tab. A user may have session-only drafts there. Establish whether those sessions
must survive before moving files or retiring their serving processes; do not infer
that a clean Git tree means those sessions are clean.

## Review scope and next action

This review inspected the presentation inventory, exports/imports, entry point,
type configuration, Vite aliases, standing conventions and historical consumers.
No source files, prototypes or dependencies changed; no new application tests or
browser checks ran for this organizational review. The native-selection evidence
review is separate.

Recommended next action: resolve the live review-session/replay constraint, then
execute this as an isolated behavior-preserving maintenance change with one
developer and an independent reviewer. It does not authorize Increment 007 storage
implementation or close any of its qualification gates.

Suggested documentation commit: `docs: propose presentation source organization`.
