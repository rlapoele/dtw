# Presentation organization review

**Completed and independently reviewed — 10 November 2026.**
The user requested a review and clearer organization of `src/presentation/`.
This is separate from Increment 007's behavior and qualification work. It changes
no presentation design, component API, domain semantics, dependency or retention policy.

The user approved proceeding with this refactor and confirmed that V4/V5 review
data need not be preserved, allowing those owned review servers to be retired.
Baseline: `c14bff7`. This authority is limited to the organizational maintenance
below; Increment 007 production implementation remains unauthorized.

Acceptance: the target layout below is in place; maintained imports/tests work;
runtime behavior and component contracts are unchanged; one semantic style source
and existing Tailwind/Heroicons/native-control conventions remain; historical
prototypes/evidence are unmodified and replay at their recorded commit. Full tests,
strict typechecks, an isolated build, generated-style comparison and bounded
fresh-browser checks precede independent review of the stable source snapshot.

## Findings and recommended structure

Before this refactor, the root mixed application composition, workbench components,
color formatting, raw draft state and readback presentation. The `components/`
folder also mixed generic controls with token-specific UI. For example, `Select.tsx`
was a generic native control outside that folder, while `inspection-tabs.tsx` had
fixed token-inspection labels despite wrapping Base UI. Library ancestry alone
does not make a component generic.

The agreed layout uses responsibility rather than file extension as its organizing rule:

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

The initial review inspected the presentation inventory, exports/imports, entry point,
type configuration, Vite aliases, standing conventions and historical consumers.
At that proposal stage no source files, prototypes or dependencies changed, and no
new application tests or browser checks ran. The native-selection evidence review
is separate.

## Completion — 10 November 2026

The user confirmed that the review sessions could be retired and authorized the
refactor. The owned V5 server was stopped before moves; the V4 port had no listener.
The [developer report](../../output/presentation-organization/report.md) and
[22-file mapping](../../output/presentation-organization/mapping.json) identify the
implemented layout above. All 33 affected maintained source/test files differ only
by module-import paths. No application logic, component API, class-composition
contract, dependency, alias or stylesheet rule changed. The stylesheet is
byte-identical at its new location. Current description wrapping is retained.

Developer and reviewer each passed **983 tests / 36 files**, all three strict
typecheck scopes and isolated production builds. Generated HTML, CSS and JavaScript
match the retained baseline bytes in independent review. Developer-operated fresh
Chrome checks cover creation, exact description/decimal editing, alias Apply/Cancel,
selected keyboard/focus behavior and 1440px/477px layouts. These are bounded checks,
not new accessibility, browser-support or performance qualification.

The [independent review](../../output/presentation-organization/independent-review.md)
found no actionable findings against the stable source snapshot. It verified source
preservation and historical artifact hashes; browser execution is attributed to the
developer. Its recorded evidence limits remain: ignored browser/test logs are not
in the snapshot manifest, and preservation of pre-existing root `dist/` is
developer-attributed. All builds targeted isolated temporary directories. Historical
prototypes/research/evidence remain unchanged and replay at their recorded source
commit; active owning-document source links now point to the new layout.

The coordinator completed this handoff and current status after review without
changing the reviewed executable source. Verification servers are stopped. No agent
staged, committed or pushed. Increment 007 remains Draft / Not started; this
maintenance closes none of its outstanding rendering/native-access/storage gates.

Suggested focused commit: `refactor: organize presentation by responsibility`.
