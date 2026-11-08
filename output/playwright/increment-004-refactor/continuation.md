# Interim developer handoff — Increment 004

8 November 2026. **Not completion evidence. T5 and T6 remain incomplete.** Baseline HEAD `8ab986f`; coordinator owns pre-existing contract/status modifications. No domain/application/session/readback/preview/range calculations, dependencies, lockfile or frozen evidence changed. No staging/commit/push.

## Delivered slice

- T1: fresh screenshots and actual computed controls; baseline 894 tests/32 files, typechecks/build passed. See inventory.md/json. The source value inventory is exhaustive by selected property; dispositions remain preliminary, not proof of dead CSS or final AC4.
- T2: Button callback/string classes retain owned classes; typed default/sm sizes with reachable `data-size`; default 32px and inherited13 typography retained. Removed unreachable historical `data-size` exclusion rules. Ref passes through React19 props into Base UI. `button-api.js`/rendered test entry exercise callback state, disabled behavior, keyboard Enter, props/ref, compact28 and Dialog render/focus return. Passed.
- T3: native Input, label Field, Badge, ordinary DialogContent and inspection tab strip. Native Select has owned class; range markup remains native with exact eligibility untouched. Global font inheritance moved to base layer. Default input styling uses owned selectors rather than broad input/select selectors. Wrappers still rely on too much ordinary CSS: complete in T5.
- T4: ProjectNavigation and TokenList extract rendering with original callbacks/state/operations retained App. Ordinary dialog portal/backdrop shells extracted; substantial App dialog forms remain inline. Typechecks passed.
- Partial T5: standard equivalent declarations from 67 unique simple class rules moved to markup utilities. No arbitrary bracket utilities/new theme token catalogue/dependencies. `utility-migration.json` maps those moves (partial declarations, **not** necessarily whole removed rules). Duplicate utility sequences removed and touched files formatted with cached Prettier. Unlayered !important declarations removed; parity requires broader final checks.

## Verification and evidence

After current code migration, all 894 tests/32 files and `npm run build` including all typechecks passed. `git diff --check` passed after formatting. Production CSS 38.32kB, JS391.22kB in the pre-format successful build; no budget/conformance claim. Rendered Button API passed after migration. `interim-*` screenshots repeat the baseline fixture/viewport sequence and are explicitly **interim**, not final. Desktop baseline/interim inspected visually: hierarchy/geometry match; UUID text changes between runs. Exact pixel equality is not claimed; future comparator should mask known UUID regions or inject deterministic UUIDs solely in the browser fixture before project creation, without altering app behavior. Do not rewrite baseline screenshots to normalize IDs.

A migration initially moved the last member of a shared selector group (Library label lost uppercase/weight). This was caught visually and corrected by restoring source then excluding comma-selector groups. Current interim desktop shows restored Library styling. All tests/typechecks/build passed after that correction. No known remaining demonstrated regression, but final matrix/journeys have not been performed.

## Remaining required work

1. Finish T5: residual styles.css is ~1,727 lines and still holds extensive ordinary layout/control styles, repeated historical/descendant/media overrides and scattered static palette. AC1/AC4 are **not satisfied**. Consolidate effective ownership, move ordinary equivalent values into utilities and reusable components, own native Input/Select geometry in their actual classes, remove demonstrably dead selectors/overrides after checking conditional states and development fixtures. Keep narrow native-range/pseudo/dynamic preview/actual panel geometry exceptions. Do not treat all remaining CSS as justified exceptions.
2. Keep existing typography narrowly owned (base13/caption11/heading25+17 weight650/leading as coordinator instructed); don't normalize density, or create custom tokens for every value. Centralize repeated meaningful palette roles only. Inventory final dispositions need concrete owners/reasons/parity evidence.
3. Recheck removal of !important at 540/900 source thresholds and mobile wrapping conditions; this was not independently evidenced yet. Preserve hidden-content semantics and readonly/disabled styling.
4. Complete T4 if needed: coherent dialog rendering split remains partial; evaluate whether current shell extraction is enough for AC3 rather than moving state/semantics.
5. T6: final real authoring/failure/read/commit/create/rename flows, nested groups/aliases/dirty departure, exact/incomplete/none/long values, independent drafts/views, tabs/modes, diagnostics/inspect-only, selected reveal/filter, collapse/reopen/focus/scroll. Existing Increment003 scripts may be adapted into new evidence paths; never write their original frozen outputs.
6. Actual 200% browser zoom and measured zoom state; fresh 900/540 threshold pair coverage plus contract thresholds/short-height; production no-console-error check. Baseline/partial captures don't prove these.
7. README/architecture source descriptions as needed; completion/status stay coordinator-owned. Fresh independent reviewer and designer after stable final snapshot; no independent review yet.

## Tooling/session

Vite at http://127.0.0.1:5173 via exec session25258. Browser CLI session `dtw004`. Direct cached CLI avoids npx network stalls: `node /Users/rlapoele-pro/.npm/_npx/31e32ef8478fbf80/node_modules/@playwright/cli/playwright-cli.js -s=dtw004 ...`. Browser execution/local listen required sandbox escalation. Existing helper wrapper works but some npx calls stalled. New rendered API entry `/test/browser/components.html` is development-only and excluded from production entry. `baseline.js` and `button-api.js` are persistent reproducible browser scripts.

Temporary `/tmp/dtw004-utilities.py` was a one-off migration helper, not an ongoing build/runtime dependency. It maps selected equivalent CSS declarations to standard utilities for unique simple top-level selectors only, preserving descendant/media rules; it was rerun while correcting shared-selector handling. **Do not rerun blindly:** it is not idempotent, adds repeated utilities, and is not a general CSS cascade parser. Current source + migration mapping are the durable result. Cached formatter: `/Users/rlapoele-pro/.npm/_npx/234afcd4ab2f5775/node_modules/prettier/bin/prettier.cjs`. No package install performed.

Suggested eventual commit after completed continuation/review: `refactor: compose presentation controls with Tailwind utilities`.
