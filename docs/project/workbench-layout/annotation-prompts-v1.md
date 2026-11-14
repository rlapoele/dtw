# Annotation generation prompts V1

Generated during 14–15 November 2026 using the built-in image generation tool, one edit per saved original mockup. The original mockups remain unchanged in `mockups/`; generated annotations are derivatives in `annotated/`. The model may re-render source details; these are conceptual boundaries, not pixel-preserving overlays or new UI designs.

## Shared edit prompt

```text
Edit the supplied image by adding a precise COMPONENT DECOMPOSITION ANNOTATION OVERLAY ONLY. Keep the original UI, text, geometry, colors, all controls and whole screenshot visible; do not redesign, redraw, correct example data, or remove content. It is an implementation-planning diagram, not new UI. Add canvas margin/right legend space if needed; preserve the screenshot proportions. Thin solid rounded colored outlines for major regions; nested thin DASHED outlines for subcomponents. Labels in small opaque colored tabs with white bold readable text, placed on boundaries away from controls, use leader lines/external legend for crowded areas. Color scheme identical across all images: 1 teal project header, 2 blue navigation, 3 violet workspace, 4 dark green inspector, 5 slate status, 6 orange relationships, 7 magenta context preview. Use exact numbered IDs supplied. Show representative repeating leaves only, not a label on every swatch. Include a compact external legend "Solid: regions · Dashed: composition · IDs match component-map-v1.md" and note "Proposed boundaries · shared session · no implementation". Do not invent any components not specified. Render a high resolution legible screenshot annotation.
```

## desktop-visual-library

Source: `mockups/desktop-visual-library-v1.png`.
Output: `annotated/desktop-visual-library-decomposition-v1.png`.

```text
Annotate this wide desktop VISUAL LIBRARY screenshot. Major solid regions: 1 Project header entire top horizontal bar; 2 Namespace navigation entire left pane; 3 Token workspace central pane; 4 Inspector entire right pane; 5 Status entire bottom bar. Dashed subregions: 1a Project context at upper left project switch;1b Project actions at upper right undo/redo/import/export/overflow. 3a Scope / search / creation central breadcrumb, heading and search/filter/New token row;3b View controls row Visual/Table/Relationships and Preview/Compare. 3c Visual inventory containing primitive and semantic sections;3c.1 Palette group around the blue swatch strip;3c.2 Token specimen around SELECTED blue 600 tile only. 7 Context preview around entire bottom central Selected token in context area. Inspector dashed:4a Identity / tabs top selected-token heading and Value/Details;4b Applied / draft preview paired blue swatches;4c Source / display Literal/Reference and color space;4d Channel controls three L C H rows;4e Alpha separate row;4f Resolution / connections two disclosures;4g Editor actions bottom Cancel/Apply. No 4h,3d,3e,6 on this screen. Need clear green nested boundaries aligned to actual sections. Put explanation names in outer legend if labels crowd narrow inspector, short IDs suffice on screenshot.
```

## desktop-relationships

Source: `mockups/desktop-relationships-v1.png`.
Output: `annotated/desktop-relationships-decomposition-v1.png`.

```text
Annotate this wide desktop RELATIONSHIPS / DETAILS screenshot. Major solid 1 Project header top,2 Namespace navigation left,3 Token workspace center,4 Inspector right,5 Status bottom. Dashed 1a Project context and1b Project actions in header. 3a Scope / search / creation heading/search/New token;3b View controls toolbar. Within 3 annotate orange 6 Relationships workspace spanning center relationship content from selected blue context banner through dependency lists, not preview. Nested orange 6a Selected context banner;6b Reference neighborhood graph including nodes arrows headings;6c Resolution trace single Value source strip;6d Dependency lists two References/Used by panels. Smaller representative outline around one graph node identified "Reference node" and one dependent list row identified "Dependency item"; no extra number IDs for these leaf examples. Magenta 7 Context preview bottom central specimen. Green inspector 4a Identity / tabs heading and tabs;4h Details form entire fields and identity/provenance;nested4h.1 Name / namespace fields;4h.2 Layer / role fields;4h.3 Description / provenance;4g Editor actions Cancel/Apply bottom. No color fields 4b through4f on Details view. Preserve actual UI completely, clear nested borders, legible exact numbering.
```

## half-screen-desktop

Source: `mockups/half-screen-desktop-v1.png`.
Output: `annotated/half-screen-desktop-decomposition-v1.png`.

```text
Annotate this HALF-SCREEN DESKTOP screenshot with the same IDs as wide desktop. Major solid 1 Project header entire top bar;3 Token workspace left pane below header;4 Inspector right pane below header;5 Status bottom horizontal bar. There is NO visible namespace pane: annotate only the Browse trigger with blue "2 Navigation trigger" nested in header and place note in legend "2 Namespace drawer hidden". Teal1a Project context around Atlas switch;1b Project actions around Undo/Redo Export overflow. Purple dashed3a Scope / search / creation breadcrumb heading New token search;3b View controls row Visual Filter Preview;3c Visual inventory blue primitive 10-swatch two-row grid;3c.1 Palette group around that same blue family within inventory, can use inset boundary with external leader;3c.2 Token specimen around selected blue600 tile.3d Related tokens around three related semantic rows. Magenta7 Context preview bottom left button specimen. Green dashed4a Identity / tabs around heading and Value/Details;4b Applied / draft swatches;4c Source / display segmented and dropdown;4d Channel controls stacked L C H rows;4e Alpha row;4f Resolution / connections;4g Editor actions Cancel/Apply bottom. Avoid overlay labels covering exact inputs. Use right external legend if needed. Keep original UI geometry and all content recognizable. Note "Responsive composition; same components and session" outside screenshot. Number labels precisely no invented mobile IDs.
```

## mobile-browse-and-edit

Source: `mockups/mobile-browse-and-edit-v1.png`.
Output: `annotated/mobile-browse-and-edit-decomposition-v1.png`.

```text
Annotate BOTH MOBILE SCREENS in supplied image, preserving them as TWO SUCCESSIVE STATES. Keep existing captions Browse tokens and Edit selected token. Do NOT add a third screen or tiny desktop panes. Add external legend margin if necessary. LEFT screen solid1 Project header around top Browse/Atlas row;blue dashed2 Navigation trigger only Browse button with external note "Namespace drawer hidden";teal dashed1a Project context Atlas switch;1b Project actions overflow. Purple solid3 Token workspace around body from breadcrumb through selected Edit token bar, not footer;purple dashed3a Scope / search / creation top breadcrumb title New search;3b View controls Visual/Filter row;3c Visual inventory two-column swatch grid;3c.1 Palette group around that blue palette as representative nested family, label can be external;3c.2 Token specimen around selected blue600 tile;3e Selection bar around bottom blue.600 + Edit token row. Slate solid5 Status around Retained locally footer only.
RIGHT screen solid1 Project header around top Tokens/Atlas/overflow bar; teal1a Project context; blue/nav label for back 'Tokens' can read "Return to browsing", not namespace drawer. Green solid4 Inspector around full editor body INCLUDING bottom action bar. Dashed4a Identity / tabs heading and Value/Details tabs;4b Applied / draft swatches;4c Source / display Literal Reference and sRGB;4d Channel controls Red Green Blue;4e Alpha;4f Resolution / connections two bottom rows;4g Editor actions sticky Cancel/Apply bar. Do NOT invent visible Details fields or a navigation tree. No region7 context preview or6 relationship graph on mobile; those are not shown. Use short ID tabs with legible external keyed legend to avoid covering labels or slider values. Note outside screens "Sequential views · shared selection and draft · no duplicate editor session". Thin borders and readable annotation text.
```

