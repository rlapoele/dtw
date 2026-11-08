# Increment 004 — developer evidence for the frozen review snapshot

8 November 2026. Base commit `8ab986f`; `review-snapshot.sha256` identifies frozen presentation source, the rendered API fixture and source-description documentation. This is developer evidence, not independent review or acceptance. The coordinator owns contract/status and subsequent review dispositions.

## R1 correction snapshot — current source

`review-snapshot-r1.sha256` is now the current stable25-file code/test/docs identity. The original manifest and initial review evidence remain unchanged. After the independent review, only these corrections were authorized: DialogContent callback composition, undefined callback-result handling in DialogContent and Button, the22px hamburger restoration within its44px target, and removal of the confirmed unused `.list-footer` selector.

`button-api-r1-red.txt` demonstrates the new rendered regression failed before the production correction with **DialogContent callback or owned classes lost**. `button-api-r1-green.txt` passes the extended probe in `button-api.js`: string/callback/undefined caller classes preserve owned classes; actual Popup open/nested/transition state is forwarded; title, ref, section render composition and close/focus return work. Undefined callbacks add no literal `undefined` class to either wrapper. Popup transition status is serialized explicitly as null when settled, so the test does not depend on capturing an animation frame.

`r1-icon-captures.js`, `r1-icon-result.txt`, `r1-{baseline,final}-navigation-icon.png` and `r1-{baseline,final}-drawer-open.png` are authoritative for the corrected icon/drawer fidelity. Both sides measure22×22px icon and44×44px trigger, with open drawer and Escape focus return checked. Earlier final navigation captures describe the initial reviewed16px icon and remain historical initial-snapshot evidence.

After correction: `npm test`894/32 pass; strict typechecks/build and diff check pass. Production JS400.78kB/CSS32.69kB (gzip124.82/7.60kB). The final fixture-only serialization refinement was followed by typecheck and the focused rendered API check again. No broad matrix repeat was needed: callback strings/undefined handling do not change existing string-caller layout; icon fidelity has its own paired capture. Earlier authoring/failure/zoom/matrix evidence remains explicitly attributed to the initial reviewed snapshot. Independent targeted recheck remains coordinator-owned; this paragraph is developer evidence only.

## Authoritative outputs

- `paired-styles.js` and successful `paired-computed-final.txt`: exact baseline source served separately from a disposable `/tmp` archive of `8ab986f`, compared with frozen current source. Two animation frames settle each viewport. The comparison covers 43 representative selectors × 16 computed properties at 1440×900; 1499/1500;1120/1119;901/900;768/767;541/540;320×740;1440×480. `paired-baseline-{width}-{height}.png` and `final-{width}-{height}.png` are the paired captures. Random UUID text differs; no pixel equality claim is made.
- `paired-baseline-modal.png` / `final-modal.png` and `paired-baseline-drawer.png` / `final-drawer.png` supplement the matrix. Drawer captures must show the open surface after its entrance transition; earlier closed captures under those names were identified during review and superseded by recapture. `final-drawer-open.png` is the explicitly named settled final drawer capture.
- `verify-authoring-result.txt`: real project/nested-group creation, opaque-black disclosure, raw long values, passive views, literal/reference draft separation, alias trace/refresh, cycle rejection, draft retention, rejected dirty departure, collapse/reopen and session loss on reload.
- `verify-failure-result.txt`: commit failure/source nonmutation, read failure/recovery/draft retention, protected metadata, create failure/modal retention, inspect-only token and blocked repair.
- `verify-production-spaces-result.txt`: actual production edits in all five spaces, exact alpha, extended/none/noncanonical/incomplete-byte handling, no page errors/external requests.
- `verify-responsive-result.txt`: 1024×768,320×568,640×360, no horizontal document overflow, draft retention, collapsed visibility/hidden focus, drawer/dialog focus containment and Escape return.
- `verify-range-result.txt`: exact inclusive endpoints versus decimal values just outside each visual interval, with withheld native slider and unchanged storage.
- `ownership-result.txt`: group creation and rename commit failures retain fields; successful rename preserves group ID; selected-filter action clears filter and focuses selected row; inspector scroll survives collapse/reopen and resets for new token; accepted dirty departure.
- `button-api-final.txt` with `button-api.js` and `test/browser/components.tsx`: callback/string classes, callback disabled state, forwarded props/ref, Enter, disabled activation, reachable compact28 and Dialog render/focus return. The development fixture now uses the owned modal shell.
- `realzoom-result.txt`, `realzoom-metrics.txt`, `realzoom-flow.js`, `final-realzoom-{settings,authoring,error}.png`: actual Chrome Settings Page zoom200% in disposable `/tmp/dtw004-zoom-20261108` profile. Baseline1440×900,DPR1; zoom720×450,DPR2,visualViewport.scale1,scrollWidth720. No CSS zoom/emulated page scale or post-setting viewport resize. Raw authoring, rejection/correction, collapse/reopen, drawer focus return and no page errors verified.
- `production-console-final.txt`: explicit console-error listener around production project/token creation returned an empty error list.

`baseline-*` and `computed-baseline.txt` retain the original T1 run. `interim-*`, `continuation.md`, `utility-migration.json`, and original `inventory.md/json` describe earlier stages and are not final proof. Redundant `final-draft-*` images were removed. Source-frozen final evidence commands must run with the browser/local-server sandbox permission; an unprivileged rerun during review produced a connection-refused log, which was replaced by a successful privileged rerun. Failed exploratory attempts are not passing evidence.

## Computed comparison disposition

All selected effective widths/heights, padding/margins/gaps, fonts, colors, surface backgrounds and panel grid measurements match across the full matrix, except explicitly listed non-effective or immaterial differences:

- Small navigation/swatch/error/session corners use stock4px rounded instead of incidental5px; header specimen uses stock4px instead of3px. No field or pane width/height changes follow from these corner differences. Designer review remains the authority on fidelity.
- Zero-width borders serialize as `0px solid` rather than `0px none`; they consume no space.
- Mode button's superseded minimum29px is removed; effective fixed32px is preserved.
- The historical grid-template-columns property on component labels was inert because the labels render display:flex. It was removed; actual component-control grid remains proportional2fr/1fr with exact-field minimum7rem and native40/44px hit geometry.

This is a selected-property matrix, not exhaustive CSS/pixel equivalence or an assertion that every possible state was visually captured. The open drawer's hamburger icon size difference was flagged by independent designer review and remains for the coordinator's review loop; source was not changed during review.

## Final CSS disposition and ownership

The original measurement inventory is retained in `inventory.json`; values without a rendered consumer were source inventory, not evidence of current computed effect. `styles.css` is consolidated by present owner rather than prototype chronology. No `!important`, `@apply`, bracket-value utilities, new dependencies or token-per-measurement theme catalogue were introduced.

| Original family / measurements | Final owner and disposition | Evidence |
| --- | --- | --- |
| Global native input/select36px,10px padding, border, surface, hover, placeholder; field minimum40px; search34px | Input and native Select own utility geometry/color. Input's search appearance is explicit; Field owns label stack/gap/margin. Exact text controls remain text inputs. | Paired computed controls; authoring/production/range journeys |
| Button32px vs unreachable data-size exclusions; navigation36px, group44px, panes44px, modes32px | Typed variant/size maps in owned Button; callers explicitly choose structural roles. Historical unreachable sizing exclusions and descendant mode/nav overrides removed. | Button API and paired computed matrix |
| Ordinary4/6/8/10/12/14/16/18/20/22/24/28/32/36px spacing and dimensions | Tailwind numeric spacing utilities at component owners, including half steps; no custom spacing tokens. Equivalent standard borders, flex, grid placement, overflow, positioning and colors moved into markup. | Current components, matrix, modal/failure states |
| Ordinary media padding/gap/visibility/wrapping; 1120/1119,900,767,540,height500 | Named source-threshold variants on owners; desktop/compact drawer padding now owned by ProjectNavigation placement and App shell, not descendant patches. Panel topology remains explicit CSS geometry. | Threshold pairs, responsive flow, actual zoom |
| Source-only color comparison, draft preview/reference box/large swatch, toolbar, identity example, alias/reference icons, folder/tree-root/sample-entry/list-footer/alpha-field and terminal trace styling | Removed after source/development-fixture usage inspection. No live UI consumer. Historical contradictory sidebar topology rules removed because sidebar mounts only at desktop width; compact navigation uses drawer. | Original candidate inventory plus production/fixture source inspection and drawer/compact journeys |
| Base13; caption11; dense metadata9/10; token550; heading650/25/17; copy1.7/description1.8/exact1.6 | Narrow inherited/scoped typography foundation retains accepted density. Only caption11 and heading weight650 have theme roles; no theme catalogue for each historic type measurement. Native fields preserve monospace12. | Fonts in paired matrix; exact/readback captures |
| Repeated static surfaces and meaningful foreground/error/scrim/hover roles | Central semantic palette in theme; no repeated component literal palette. Existing background/foreground/muted/border/primary/accent/ring/destructive roles retained. | Paired computed colors and reviewed screenshots |
| Groups212/228/176 and inspector376/400/320, collapsed52; split-pane rows;42/37/34% value columns; exact field min7rem; token rows76/80/68 | Named workbench/component geometry CSS retains actual source thresholds and state behavior. Grid cols/rows and percentage widths cannot be replaced with stock scale without changing behavior. | Full matrix, collapse/reopen and320/short-height/zoom checks |
| Token-panel top33 and inspector heading27/22, heading margin7; project-icon radius7, popup radius10, dialog max-width440, drawer320 and viewport gutters; heading description max285 | Bounded retained geometry exceptions, not rounded silently. These remain explicit local owners pending any separate visual normalization. | Paired computed geometry; modal/drawer captures |
| Range track12, native thumb14×24 / Firefox12×22; dynamic gradients; checkerboard cells8/10; modal/drawer shadows/transitions | Focused native pseudo-element/illustrative/effect CSS. WebKit and Firefox track selectors remain separate because unsupported cross-engine pseudo-elements invalidate grouped selector lists. | Exact range flow, visible track captures and modal layers |
| Native hidden and browser root fixed/clip/overflow-anchor policy | Browser-session/pane foundation; native `[hidden]` deliberately wins display utilities so mounted authoring state stays inaccessible when collapsed. | Responsive hidden-focus/visibility, scroll restoration |

## Checks, boundaries and limits

Final `npm test`:894 tests in32 files pass. `npm run build`: all strict type scopes and production bundle pass; JS400.76kB/CSS32.62kB (gzip124.82/7.59kB). `git diff --check` passes. No domain/application/session/readback/preview/range calculation or dependency/lockfile changes. Frozen prototype, vendored references and previous increment evidence were not edited. No staging/commit/push.

No independent review is claimed here. The coordinator’s callback-composition follow-up on DialogContent and independent reviewer/designer findings are handled in the review loop after this freeze. No screen-reader, physical mobile/keyboard, virtual-keyboard or exhaustive pixel/snapshot testing was performed. Suggested eventual commit: `refactor: compose presentation controls with Tailwind utilities`.
