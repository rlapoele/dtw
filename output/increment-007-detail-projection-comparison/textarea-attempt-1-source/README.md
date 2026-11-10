# Isolated exact-detail / read-projection comparison

Authorized bounded comparison, 10 November 2026. **Not production Increment 007.**
Production, prior research and frozen evidence remain read only. Coordinator owns
approval/status documents. No staging, commits, pushes or dependencies were added.

The first uniform no-wrap pre candidate **failed** its unchanged 100 ms renderer
blocking gate. Stop after that observation. Do not rerun large cases, proceed to scale
samples, or adopt/execute the conditional textarea without coordinator review.
[Report](../../output/increment-007-detail-projection-comparison/report.md).

Commands (existing installed dependencies only):

```sh
node --test research/increment-007-detail-projection-comparison/trace.test.mjs research/increment-007-detail-projection-comparison/transport.test.mjs
node node_modules/typescript/bin/tsc -p research/increment-007-detail-projection-comparison/tsconfig.json --noEmit
node node_modules/vite/bin/vite.js build --config research/increment-007-detail-projection-comparison/vite.config.ts
```

`run.mjs` is the exact executed runner archived in `attempt-1-source/`. It starts a
loopback server and separate ordinary Chrome process/profile, with an external Node
30-second watchdog per measured operation. It never opens existing user tabs, changes
Mac settings or touches the clipboard. A sandbox-denied launch is retained separately;
the same runner subsequently executed with approved escalation. The build uses its
own cache/output and React's production build, with no HMR or StrictMode.

`prepare-copies.py` reproduces the copied row/inspector from current production source;
`provenance.json` identifies read-only reused sources. The generated editor diff is
preserved. Owned ColorFields, buttons, fields, tabs, select, swatch, badges, themes,
color session/formatting/calculation code are imported unchanged. Copied adaptations:

- Row keeps production button/grid/description/type/layer/value/swatch markup; worker
  supplies only its display fields, not the token definition/font families/AST.
- Editor keeps the production literal/reference controls, all fields/sliders, five
  views/two scales, session/drafts, Apply/Cancel/error focus, description, metadata,
  applied summary and footer. Its narrow input is selected display metadata, exact
  eligible baseline and complete applicable reference choices; no fake ProjectReadback.
- Worker uses actual readProject/inspectToken/path/identityLabels/eligibility semantics.
  Raw text is the identical complete `JSON.stringify(authored,null,2)` on disclosure
  request. Heavy derived text is requested on its tab, not while closed.
- Uniform `.raw-source` uses no wrapping, natural height up to 50vh, horizontal/vertical
  overflow. It adds a labelled native pre Tab stop. The isolated two-column shell
  is not the full App/navigation/creation/retention UI. Native Cmd+A retains document
  selection scope. The copied row currently does not reflect selection styling.

These are explicit fidelity/semantic deltas, not approved production adoption.

The first risk gate is intentionally **partial**. Navigation/parent choices/All-content
worker DTOs exist but no native navigation/All-content UI was qualified. Expression/
composite F-5 evaluation is explicitly unavailable, not substituted with synthetic
success. Whole-app/draft conversion, immediate view-event fences, all races, cross-kind
selection, 2,000 native options and maximum scale are still unqualified. One outstanding
passive request per surface under rapid replacement is not yet enforced. Stable row
blocks prevent rerendering previous blocks during append; actual selected-state styling
and delayed-change race coverage remain incomplete. Do not call the whole candidate or
read boundary qualified.
