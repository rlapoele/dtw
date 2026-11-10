# Observed native action log

Owned headless Google Chrome 157.0.8103.50, Playwright cached package path in session.mjs; macOS27.2 build26B123; viewport1600×1100, default device scale1, no zoom changes. Origin http://127.0.0.1:4231/ served unchanged V5 with CLI port override. Separate context, no clipboard permissions requested. Current wrapping selected before all checks. Coordinates below are viewport CSS pixels, chosen by reading saved full screenshots, never caret/Range geometry. Playwright mouse/keyboard/wheel dispatches browser input; no human participant or native OS pointer was used.

Setup: select wrapping current; click token row using accessible button name /unassigned/i, click All authored data; wait for pre. An earlier overly restrictive row locator /^unassignedUnspecified/ timed out before activation (accessible-name whitespace mismatch). This is setup automation failure, not selection failure. Initial noninteractive runner stdin closed; no selection actions there. Restarted owned context interactively.

## Unassigned

1. `unassigned-before.png`: complete9-line source visible. Click(1238,902) before first `{`; attempted click(1247,1034) with `{modifiers:['Shift']}` passed to mouse.click. This option is unsupported/ignored: actual second click was unmodified. `unassigned-initial.json/png`: collapsed160→160,0 selected. Invalid gesture; not a failed valid Shift-click or evidence of endpoint correction burden.
2. Single correction: click(1238,902); keyboard.down('Shift'); click(1247,1034); keyboard.up('Shift'). `unassigned-correction.json/png`: scoped PRE text0→160,160 selected, exact equality. No scroll.

## Prose

1. Click row /^color \/ prose primitive/; fill first textbox with raw `0.` (unapplied). Click All authored data. `prose-before.png`: source extends below inspector fold. Move(1500,900), wheel(0,650), settle200ms (presentation only, no performance measure). `prose-ready.png`: full bounded source viewport visible, source scroll0,0.
2. Click(1238,606) immediately before first `{`. Move(1430,800), wheel(0,350), settle200ms. `prose-scrolled.png`: source scrollTop137,scrollLeft0, final `}` visible. Read-only selection observation after scroll found anchor0 inside PRE.
3. keyboard.down('Shift'); click(1247,948) just after final `}`; keyboard.up('Shift'). `prose-initial.json/png`: PRE text0→882,882 selected, exact equality; input raw `0.` retained, applied source unchanged. No correction needed. Horizontal source overflow1971 vs349 client pixels existed; final endpoint at left, so no horizontal scroll was required to select it all. Not evidence of horizontal-anchor retention.

A long interactive command intended to do step3 plus save observations was interrupted in terminal line entry (BEL output; Ctrl-U/newline cleared it) before completion/submission. Explicit short step3 command then ran and saved observation via observe.mjs. No additional selection search sequence was run. Input terminal errors are not browser usability findings.

Both screenshots and raw JSON are observations, no trimming/normalization performed. Screenshot reading guided coordinates. Runtime script supports arbitrary interactive statements but only the actions above ran; no scripted range/selection injection, Cmd+A/C, clipboard API/read/write/save/restore, Find, AT, actual zoom or trace collection occurred. Scope stopped after two fixtures. Safari binary exists but no safely owned context was established/operated; Safari coverage unrun, not an activation-failure diagnosis. No keyboard-only selection control attempted; no proven ordinary browser path supplied.

Cleanup: owned assessment browser close requested via session `close`; runner then terminated with its own PTY Ctrl-C (no post-close inventory; sandbox process inventory denied). Isolated Vite process stopped via its own PTY Ctrl-C. Shared/user V5 port4228 and other browser sessions untouched. Failed noninteractive runner ended before selection; its lifecycle was not used as selection evidence.
