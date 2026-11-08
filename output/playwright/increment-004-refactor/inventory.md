# Increment 004 baseline — 8 November 2026

Baseline HEAD 8ab986f. Only coordinator-owned contract/status edits pre-existed. `npm test`: 894/894, 32 files. `npm run build` (including all strict typechecks): passed. Browser Chromium via cached Playwright CLI; local Vite 5173. Baseline screenshots are fresh, not copied from Increment 003. `baseline.js` records the initial project/token fixture; IDs vary each run.

## Live controls and cascade

`computed-baseline.txt` owns actual computed values (short-height 1440×480 final matrix state). Ordinary actions: 32px height, 0 12px padding, **13px normal-weight / 19.5px**, not the apparent utility text-xs/font-medium. Global unlayered `font:inherit` defeats those utilities. Navigation is 36px/12px with active weight 600; pane toggles 44px/11px; tabs 42px/11px. Input defaults 36px, horizontal padding 10px; search 34px and 34px left padding. Mode buttons remain 32px even though historical minimum height says 29px.

No caller sets data-size. The two historical sizing exclusion rules are unreachable. A new size API must preserve default 32px, and compact 28px must only appear in focused API checks unless explicitly selected by a real caller. Structural controls must receive explicit treatment when those overrides migrate.

## Scale and exceptions

`inventory.json` lists all distinct authored measurements/colors, media thresholds and unreferenced selector candidates. Candidates are not deletion authorization: compare conditional classes and development fixtures before removal. Standard 4px-grid spacing, 6/8/12/16/20/24px gaps and 4/6px radii have equivalent Tailwind utilities. The existing semantic palette owns background/foreground/muted/border/primary/accent/ring/destructive roles. Existing 9/10/11/13/17/25px typography, 650 heading weight, 1.3/1.7 line heights, 3/5px radii and numerous precise panel/control widths are **not** equivalent to standard utilities. They must retain a narrowly justified semantic/geometry owner or return for visual review; no silent rounding.

Active media source includes 1500,1120,900,540,1119,767,768 and height500. Earlier 900/540 rules still affect descendants despite later panel topology; do not discard whole media blocks. Range track/thumb pseudo-elements, checkerboards, dynamic previews and panel layout are approved CSS exception categories. Scale inventory is preliminary until final consumer migration/disposition.

## Coverage limits

Fresh screenshot matrix: 1440×900,1499/1500×900,1119/1120×900,767/768×900,320×740,1440×480 plus project start. Initial screenshots do not yet cover every journey, 900/540 boundaries or actual 200% zoom; these remain required before completion. No screen-reader, physical mobile or virtual keyboard session.
