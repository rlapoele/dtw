# Increment 009 developer handoff

13 November 2026. Implementation follows the agreed amended 009 contract, naming
policy and combined V1/V2 design. Production, tests and tools are frozen for the
independent reviewer. Baseline: `5b23a3027079b807faf1943af80d88a6f5478004`.
The [source manifest](source-manifest.json) records SHA-256 values for all changed
and new production/test/tool files. Coordinator-owned authority-document edits
are outside this developer snapshot; no staging, commits or pushes occurred.

## Implementation and acceptance evidence

- **AC-1/2:** `BrowserView` separates all-tokens/group/all-content from inspected
  selection and query. Navigation and toolbar consume that view. Creation parent
  is group-only; reveal returns to All tokens and clears search. Rename targets
  the captured form baseline, rather than whichever view is current later.
  Existing selection/departure/readback authorities and editor keys remain.
- **AC-3/5:** focused group and resolved panels lead with readable paths, named
  full-value color channels/alpha and reference relationships. Empty resolution
  diagnostics use prose. Unavailable paths show truthful parent identity context.
  Identity/path, derived-resolution and exact-authored data remain separate
  disclosures; exact-source revision keys and bounded access are retained.
- **AC-4/8:** compact heading/section gaps and side-by-side color view/scale
  controls reduce space before channels; Alpha remains in the ordinary form.
  Apply/Cancel stay sticky. Creation actions stick below the scrollable form;
  error focus, labels, shared controls/icons and native disclosures remain.
  Coordinator owns rendered/keyboard observations; source/static rendering is
  not a claim of browser accessibility or layout acceptance.
- **AC-6/7:** extracted lifecycle listeners/recovery coordination and backup
  selection/staging/download. Both entry points and both restage paths share
  renderer pre-read admission. Restore authority and worker validation remain
  unchanged. Reference, metadata, resolution and group sections have focused
  props; `useTokenEditor` still owns one session above header/fields. Existing
  command completion/unknown/retained semantics are untouched.
- **AC-9/11:** generated Unicode 17 tables implement canonical normalization,
  default full lowercase (including contextual Final Sigma), C+F default folding
  and precisely R removal, without runtime Unicode or locale authority. Source
  URLs/version/SHA-256 are in `tools/unicode-17/sources.json`; generator and Unicode
  V3 license are alongside it. No new dependency. Prepared names are checked at
  the application boundary; legacy constructors/decoder remain opaque. Collision
  buckets use ordered segment keys, include groups and all token types and
  completeness states, and compare baseline relationships with candidate
  relationships, covering every affected descendant. Prepared empty/over-limit
  names are rejected. Form previews preserve raw text; known naming collisions
  produce a readable focused rejection before issuing a retained command.
- **AC-10:** unchanged legacy collision relationships do not block an otherwise
  valid command. Structural/reference checks remain binding. Collision reporting
  is separate from strict load/restore gates. Each exceptional action has exact
  identity and parent context within its row. Backup codec remains unchanged.

## Checks and limits

Final focused command:

```sh
npx vitest run test/domain/namespace-naming.test.ts test/application/namespace-authoring.test.ts test/application/authoring.test.ts test/presentation/increment-009.test.tsx test/presentation/identity-presentation.test.tsx test/presentation/workbench-coordination.test.tsx test/presentation/all-content.test.tsx test/presentation/session.test.ts
```

**8 files, 72 tests passed.** This covers preparation/folding, deep descendant and
cross-kind collision prevention, legacy allowance, kind-scoped IDs, direct color
creation, project scope, exact legacy codec roundtrip, navigation/previews,
pre-read admission, raw-input retention and existing coordinated session/command
behavior. A kind-scoped identity collision test was observed failing before its
production correction and passing afterward. Existing tests whose new-authoring
fixtures violated the new agreed policy now seed supported legacy data through
storage/constructors or use usable names for independent command-safety cases;
their existing safety/identity assertions remain.

`npm run build` passed all four TypeScript configurations and the Vite bundle.
The first build exposed an extracted callback return-type mismatch; it was fixed.
A successful build preceded final UI corrections; the final successful build
covers the frozen production snapshot. No separate typecheck/full-suite campaign
ran. Vite reports the existing-style >500 kB advisory for the main bundle
(591.99 kB, gzip 187.83 kB); no speculative bundle work was added.

Developer verification used **approximately 10 aggregate minutes**, including
source/data checks, run waits, failed/rerun checks and fixture diagnostics.
**Two fixture harness repair cycles used**, exhausting the shared repair ceiling;
no further harness work is authorized by this handoff. Checks stop here. The
first fixture assertion assumed object/property/prototype representation equality;
the final check uses the codec's deterministic exact encode/decode/encode text.
No 007 qualification, cross-browser qualification or new benchmark campaign ran.
No claim of exhaustive Unicode conformance-suite execution is made; the pinned
implementation and focused examples remain subject to independent review.

## Coordinator browser fixture

[Supported synthetic legacy backup](synthetic-legacy-backup.json), generated with
`node tools/increment-009-fixtures.mjs`, using the production codec and checked
encode/decode/encode equality. It contains only synthetic authored data.

1. In the isolated development origin, choose Restore backup from Projects and
   select this file. Import it as a new project through the existing restore UI.
2. Open All content. Each duplicate color/dimension path and conflicting group
   has its own full identity; the orphan shows the exact missing-parent identity.
3. Select each duplicate/orphan, inspect path and exact source. Group details and
   the color token's resolved tab demonstrate readable detail/disclosures.
4. This mixed legacy fixture includes a missing parent: existing structural
   command checks therefore remain binding. Use a separate new project for
   ordinary creation, unrelated-collision allowance is covered by focused tests.
5. In the normal project create a group/token, type a raw spaced/cased name and
   inspect Name to save. Create `Straße`, then try ` S T R A S S E ` in the same
   parent; rejection preserves the raw text and exact collision context.
6. Navigate group → All content → All tokens with unfinished color input/query;
   check toolbar, one active navigation, root creation and draft preservation.

Remaining acceptance: independent source review and coordinator browser evidence,
particularly actual responsive/keyboard/focus outcomes, are not established by
this developer note. Broad engine and previously deferred qualifications stay
outside scope.

Suggested commit: `feat: improve workbench context and validate namespace names`
