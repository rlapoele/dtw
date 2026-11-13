# Increment 009 — Design V1

**Interactive mockup, 13 November 2026.** The user selected the V1 direction and
authorized mockup preparation. On 13 November 2026 the user approved this identified
V1 artifact for analyst review. The [consistency review](../../docs/increments/009-design-review.md)
is complete with one required inventory-identity design correction, D9-1, still
open. Final contract/design agreement and production implementation authorization
remain pending. V1's code and rendered mockups remain unchanged by this review.

## Run

From the repository root:

```sh
npx vite --config prototypes/increment-009-v1/vite.config.ts
```

Open [the isolated local mockup](http://127.0.0.1:4199/). It uses installed
dependencies; no installation, production build or application server is needed.
The Vite configuration belongs only to this prototype. Shared semantic theme,
Button, Input, Select, Icon and Dialog components are imported without modification.
It relies on the existing generated shared `cn` tables in this checkout; it does
not generate or edit production files.

## What to review

The separate review strip is outside product chrome. Its fixtures reset the
mockup, while the normal controls demonstrate transitions within one fixture.

- **Literal editor:** initial foundation browser and selected foundation.brand.
  At 1280 × 800, inspect channels including Alpha and the persistent Apply/Cancel
  row. Edit raw channel text, Apply a valid value, or Cancel. Channel values remain
  strings; no formatter silently rounds them. The slider is a separate coarse
  editing affordance with a 0.01 step, not an exact source representation.
- **All content after group:** All content is the sole active browser view.
  It has no color search or group Rename action. Every fixture membership entry
  can be inspected. Full inventory identities are in a disclosure, untruncated.
  Type a token query in the group view, switch to All content and back to observe
  query preservation. Switching browser views preserves an unfinished draft.
- **Resolved value:** readable sRGB channel values, applied-only status, trace,
  prose diagnostics, and separately disclosed derived data and authored fixture.
  For a two-step trace, use Reference editor and the Resolved & trace tab.
- **Unresolved reference:** explicit missing-target outcome and full identity;
  no invented color or path. Technical detail and authored fixture remain available.
- **Group inspection:** generic Inspector title; readable path precedes identity
  and path details. Both fixture groups have complete disclosed identities.
- **Reference editor / Empty group / Invalid channel:** reference guidance,
  missing-target validation, contextual empty guidance and preserved invalid text.
  Apply invalid text to focus the error. Apply or Cancel returns focus to the
  value-source control. Choosing another entity with an unapplied draft opens
  the review guard; switching the browser view does not.
- **Compact navigation:** at 1119 px and below, Project navigation opens a full-height
  left-edge drawer using the shared modal primitive; choose a view or close it.
  At 767 px and below the browser and inspector
  stack. The primary acceptance viewport is 1280 × 800; compact review is
  representative only, not a responsive support-matrix claim.
- **Creation defaults:** New token / Create color token opens a preview form.
  The current group is the visible default in group views; All tokens and All
  content visibly default to Project root. Preview creation does not add data.

## Direction represented

Keep the Precision surfaces, density and three-pane hierarchy. Exactly one view
owns navigation emphasis, heading and toolbar. Selection is separate. Readable
summaries lead, technical details remain available through native disclosures.
Space is recovered through a tighter entity heading, adjacent color-view/entry
scale controls and compact channel inputs; Alpha remains in the ordinary form.
No inspector widening or new navigation model is proposed.

The retention sentence is proposed production copy, not an assertion about this
mockup's behavior. The external review strip explicitly identifies the fixture session. Header
backup/project actions and the footer persistent-storage request are visibly
disabled: their workflows are outside this mockup. The footer shows proposed
production status copy, not real storage state. The applied/draft swatches and Apply action operate only on
temporary React state. Browser refresh resets everything.

## Deliberate limits

- This is a thin fixture UI, not a production architecture implementation. It
  does not import domain operations, host/worker code, IndexedDB, Web Locks or
  backup/restore. Backup/project/storage actions are disabled rather than simulated as successful.
- Only normalized sRGB control geometry is shown. There is no color conversion,
  integer-entry policy, additional color-space editing or authored-value migration.
  Raw field strings are preserved, but the fixture's validity checks are not
  domain validation. The invalid fixture uses malformed `red` text, not an
  out-of-range RGB number; finite RGB channel numbers are not rejected for falling
  outside 0–1. Alpha retains its 0–1 interval. Slider bounds are a coarse editing
  affordance, not an authored-value policy. Authoritative numeric semantics remain
  unchanged. Display specimens use browser CSS rendering.
- The resolution fixtures illustrate success, alias chains and missing targets;
  they do not resolve arbitrary graphs. Reference editing does not implement
  complete canonical mutation semantics. Metadata is read only. Rename/New group
  produce an explicit review notice; they perform no operation.
- All authored data and resolution detail disclosures contain illustrative fixture
  objects. They are not a canonical schema specification, an exact serializer or
  a replacement for production ExactSource. Their placement is reviewable; real
  revision-aware lazy/bounded source access remains unqualified and unchanged.
- The five inventory fixtures render at once. This does not replace or verify
  production progressive membership rendering, identity-disambiguation policy,
  exceptional paths, large-source behavior or native browser Find behavior.
- The draft guard demonstrates the choice and normal focus behavior. It does not
  model retained/unknown command outcomes, recovery baselines, concurrent writers,
  departure lifecycles, missing creation parents or protected restore.
- No new global store, dependencies, production components, tests or configuration
  were introduced. Lifecycle/backup extraction and narrow production prop contracts
  remain an implementation proposal, not something proven by these mockups.

## Styling ownership

`prototype.css` owns only prototype geometry and fixture compositions, uses the
shared semantic palette and imports the production theme into the same Tailwind
compilation as explicit prototype/shared-component source directives. Fixed pane
widths, channel-input geometry and review-strip layout are focused mockup CSS
exceptions used to assess the selected density; they are not additional theme
tokens. Navigation retains the existing 1119/767 px breakpoints and left-edge
drawer geometry; ordinary creation/guard dialogs remain centered. Authored
swatch colors are runtime data. The sole UI icon source is the
shared Heroicons Outline wrapper. No external assets or fonts are loaded.

## Evidence and next gate

The coordinator's [rendered observations and snapshot](../../output/increment-009-design-v1/review.md)
and [screenshot gallery](../../output/increment-009-design-v1/index.html) record the
normal desktop and compact states observed, subsequent corrections and limits.
These are mockup observations, not analyst review, accessibility certification or
production integrity acceptance.

Mockup render review has one cumulative ceiling of 15 aggregate minutes and at
most one harness repair. The initial shared-style source-scanning correction uses
that repair allowance; it is not a qualification restart. Increment 007 allowance
remains zero and Increment 008 campaigns remain stopped.

The user approved the identified V1 artifact for analyst review on 13 November
2026. Consistency review completed against baseline `044a71c`; D9-1 requires exact
identity to be associated with ambiguous inventory entries and a duplicate-label
design example. This correction has not been made in V1. The identified material
revision must return to the user before renewed analyst review. No production
implementation is authorized.

Suggested commit message, after user review: `docs: add increment 009 usability mockups`

Staging, committing and pushing remain with the user.
