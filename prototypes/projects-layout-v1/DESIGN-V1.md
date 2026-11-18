# Projects layout — Design V1

**User-authorized mockup — 18 November 2026.** The selected direction gives
Projects a centered, bounded content area balanced against its existing inspector.
This is a layout proposal only; production files, dependencies and retained data
are unchanged.

## View

```sh
npx vite --config prototypes/projects-layout-v1/vite.config.ts
```

Open [the preview](http://127.0.0.1:4200/).

- [Wide, 1588 × 1080](../../output/playwright/projects-layout-v1/wide.png)
- [Intermediate, 1200 × 1080](../../output/playwright/projects-layout-v1/intermediate.png)
- [Collapsed, 1588 × 1080](../../output/playwright/projects-layout-v1/collapsed.png)
- [Compact, 390 × 844](../../output/playwright/projects-layout-v1/compact.png)

The separate **Layout preview** toolbar is a review control, not proposed product
content. Use it or the inspector chevron to compare expanded and collapsed states.
Choose a project to update the inspector. At compact widths, Inspect selected
project opens the full-width inspector; Back to projects returns to browsing.

## Proposed geometry

The wide layout has three regions: a borderless empty balancing gutter, Projects
content, and the existing 25rem inspector. The left region contains no navigation,
placeholder controls, divider or other fake product content. At 1588px, both side
regions are 400px and the center is 788px before its existing internal padding.

The blank region yields space before the central content becomes cramped. Its
prototype width is `clamp(0rem, calc(100vw - 67rem), 25rem)`: it is fully 25rem from
1472px upward, shrinks at intermediate widths and reaches zero at 1072px. At 1200px
it is 128px, leaving 672px for the center alongside the 400px inspector. Below
880px, both side allocations disappear and browsing/inspection use separate
full-width surfaces. These thresholds are explicit proposal values, not silently
adopted production breakpoints.

Center content has a 56rem maximum width, preserving readable form/list lengths
on very wide or collapsed-inspector layouts. It remains centered in the available
middle region, retaining the application's existing padding and vertical rhythm.

### Equal collapsed widths

The proposed common navigation/inspector collapsed width is **3.25rem**, reusing
the larger existing production rail rather than shrinking its control space.
Projects has no navigation pane: its collapsed demonstration uses a 3.25rem empty
left balance gutter and a real 3.25rem inspector rail. Both measured 52px at the
normal root size. Content remains bounded instead of stretching across the freed
space.

The existing token mockup also now defines `--collapsed-pane-width: 3.25rem` for
its `groups-collapsed` and `inspector-collapsed` geometry classes. This is a
prototype-only alignment; no invented collapse controls were added there, and
that prototype's accepted expanded25rem widths and layer text alignment remain
unchanged. Its collapsed states were source-reviewed, not separately exercised.
Production still retains its current collapsed widths pending agreement.

## Reuse and specimen limits

The mockup directly imports the real WorkbenchLayout, ApplicationHeader,
ProjectList, ProjectInspector, CreateProjectForm, StorageProtection, Button, Icon
and global theme/font stylesheet. Prototype-owned composition/CSS supplies only
the proposed layout, inspector collapse control and separate preview toolbar.

Three invented supported catalogue entries are held in component memory. No
browser storage service is instantiated. Project creation, opening, backup,
restore and storage-protection actions are disabled. The displayed storage status
is sample content, not a claim about the user's browser. Selection and layout
controls are functional; this is not a persistence or data-management prototype.

## Verification

This design revision had a separate five-minute aggregate allowance with at most
one harness repair. Approximately four minutes including coordinator viewing were
used, with zero repairs. Earlier campaigns remain stopped.

Designer viewed the wide, intermediate, collapsed and phone captures. Coordinator
viewed the live wide layout. A DOM check confirmed both collapsed side allocations
are52px. On the phone, project selection, inspect/back and absence of horizontal
document overflow were checked. Changed prototype ownership, imports and Markdown
links were reviewed. Checks stopped after the scoped evidence passed.

No production tests, exhaustive resize/focus matrix, screen-reader or cross-engine
qualification was run. Existing production acceptance gaps remain unchanged.
User design feedback is next; this mockup does not authorize production adoption.

Suggested commit: `docs: mock up balanced Projects layout and equal collapsed rails`.

## Production adoption and width amendment — 18 November 2026

User approved production adoption with one correction: remove the projects-content
max-width so content fills the middle region up to normal inspector-side padding.
This supersedes the56rem/42rem caps above; both caps are removed from the prototype,
and production uses its existing uncapped main element. Production Projects now
uses the balancing left track and existing narrow browse/inspect policy. Both
existing token-workbench collapsed rails use a common3.25rem variable. The mockup
inspector preview toggle is not added as a new Projects interaction.
