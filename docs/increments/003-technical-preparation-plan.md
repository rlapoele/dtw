# Increment 003: technical preparation plan

8 November 2026. **Technical preparation plan; not implementation authorization.** Baseline: `3b3ca4d` (`docs: simplify numerical contract and select Culori`). Read-only repository/package checks and this plan do not install dependencies, change configuration or start delivery. The [agreement](003-visible-color-authoring.md), [current numerical policy](003-color-policy-proposal.md), approved [V6](../../prototypes/increment-003-v1/DESIGN-V6.md) plus the contract's written creation disclosure govern implementation; this plan does not amend them.

## Preparation findings and candidate dependencies

The root [manifest](../../package.json) and [lockfile](../../package-lock.json) contain TypeScript `7.0.2`, Vite `8.3.5` and Vitest `5.0.5`; root ranges resolve to those versions. There is no root HTML entry point or Vite config. The current [TypeScript config](../../tsconfig.json) deliberately has no DOM or ambient host types. The [prototype manifest](../../prototypes/increment-003-v1/package.json), [lockfile](../../prototypes/increment-003-v1/package-lock.json) and [Vite config](../../prototypes/increment-003-v1/vite.config.ts) supply concrete delivery candidates, not proof of compatibility with production operations or permission to copy prototype semantics.

| Role | Candidate exact version | Basis and disposition |
| --- | --- | --- |
| Existing tooling | TypeScript `7.0.2`; Vite `8.3.5`; Vitest `5.0.5` | Retain root locked versions; no upgrade is needed for this plan. |
| Renderer | `react` / `react-dom` `19.3.1` | Prototype pins; selected renderer direction. |
| React development types | `@types/react` / `@types/react-dom` `19.3.0` | Prototype pins; development only. |
| Vite React integration | `@vitejs/plugin-react` `6.2.1` | Prototype pin; development only. |
| Styling | `tailwindcss` / `@tailwindcss/vite` `4.3.4` | Prototype pins; development build integration. |
| Accessible primitives | `@base-ui/react` `1.9.0` | Prototype pin; local components use the selected Base UI primitives. |
| Icons | `@heroicons/react` `2.2.0` | Prototype pin; selected Outline treatment. |
| Color calculations | `culori` `4.0.2` | Selected backend's independently qualified baseline; not currently a root/prototype dependency. |
| Culori development types | `@types/culori` `4.0.1` | Candidate from the npm indexed versions listing; not registry-revalidated, installed or typechecked. Verify integrity/compatibility during authorized setup; use a strict localized adapter, not an ambient `any` workaround. |
| Optional button variant helper | `class-variance-authority` `0.7.1` | Prototype button uses it. Include only if retained by the locally owned button implementation; plain variants can omit it. |

**Read-only metadata checked 8 November:** local runtime Node `24.14.1` / npm `11.17.0` satisfies the declared root tool engines. Vite requires Node `^20.19.0 || >=22.12.0`; Vitest requires `^22.12.0 || ^24.0.0 || >=26.0.0` and accepts Vite 8. The installed prototype metadata aligns React DOM `^19.3.1`, Base UI's React/DOM 17–19 peers, React DOM types' `^19.3.0` peer, the React plugin's Vite 8 peer and Tailwind plugin's Vite 5–8 peer. These are declared engine/peer checks, not a clean root installation or production integration pass. Candidate manifests declare MIT, except TypeScript's Apache-2.0; distribution notices still require inspection.

Pinned [Culori metadata](https://raw.githubusercontent.com/Evercoder/culori/v4.0.2/package.json) confirms MIT, no declared runtime dependencies, compatible Node engines and no shipped types. [DefinitelyTyped's Culori metadata](https://raw.githubusercontent.com/DefinitelyTyped/DefinitelyTyped/master/types/culori/package.json) identifies a 4.0 declaration line and `./fn` exports; its `4.0.9999` repository placeholder is **not an installable pin**. The primary [npm versions listing](https://www.npmjs.com/package/%40types/culori?activeTab=versions), returned through indexed search, reports `@types/culori` `4.0.1`, MIT, no dependencies and a `ts7.0` tag pointing to that version. This supplies the candidate above; direct page opening and registry revalidation were unavailable. It is not a verified-latest claim or extracted/typechecked package. Verify package integrity and compatibility in the first authorized setup, without reopening backend selection.

Use the official [Tailwind Vite integration](https://tailwindcss.com/docs/installation/using-vite), [Base UI quick start](https://base-ui.com/react/overview/quick-start) and [Culori selective-import guidance](https://culorijs.org/guides/tree-shaking/). Static registration of only needed Culori modes may live inside the adapter; do not build an application registry. Check portal stacking/isolation with the actual drawer/dialog layout. No shadcn runtime package is needed for locally owned components. Base UI's date-fns peers and the React plugin's compiler/Babel peers are optional; do not add them merely because they appear in metadata.

## Implementation boundaries

- Keep one package. Add a narrow browser delivery directory, entry point and Vite React/Tailwind setup; keep canonical models and application operations free of React, DOM, Node, CSS and host imports.
- Retain the existing host-independent TypeScript check; add a scoped delivery check with JSX/DOM types, and a separate scoped tool-config check only where needed. Run all relevant checks from the documented root commands. Configure tests/build entry scope deliberately so prototype/research files do not become production inputs.
- Put pure color-candidate/byte operations behind the existing domain boundary: exact strings, units, missing/neutral eligibility, formatting and validation remain owned; Culori supplies approximate conversions. No custom conversion equations, arbitrary precision, registry, plugin system or new package topology.
- Compose `createAuthoringOperations` with the in-memory adapter at the browser entry boundary. Supply opaque IDs there. Delivery consumes project readback/inspection and commands; it does not reconstruct namespace paths, reference resolution, validation or alias semantics.
- Reuse approved visual treatment and interaction ideas deliberately. Prototype string groups, static identity examples, one-hop resolution, failure shortcuts and older numerical helper are not implementation foundations. Creation must add the agreed initial opaque-black disclosure absent from committed V6.
- Keep preview outside canonical authoring: exact direct-sRGB bounds, the existing converted-only `1e-10` allowance, explicit unavailable reasons and no hidden mapping. No persistence, interchange, Electron, gradient implementation or additional controls enter this increment.

## Ordered delivery slices after authorization

| Order | Thin result and verification | Contract criteria |
| --- | --- | --- |
| 1 | Establish the browser entry and selected tooling without changing domain semantics. Prove root domain/application checks remain independent, delivery typecheck works and a production build/preview opens. Inspect dependency/lockfile/license and production bundle effects. | AC-8 |
| 2 | Add pure Culori/byte candidate calculations and meaningful independent fixtures under the amended policy. Test exact formatting/identity/alpha, missing and exact neutrals, all 25 directed space pairs, representative boundaries/extended values, input/resource and target refusals. Keep the tiny-red HSL case an explicit safely unavailable result, not a successful conversion. | AC-3, AC-8 |
| 3 | Deliver empty session → project → nested groups/rename → disclosed black token → token list/inspection through real operations. Verify readback, exact empty/duplicate names, stable-ID disambiguation, initial `regeneration: "allowed"` and reload loss. | AC-1, AC-2, AC-6 |
| 4 | Deliver literal/reference editing, real alias chains and dependent refresh. Verify one authoritative draft, exact passive multi-space returns, deliberate promotion, alpha-only retention, byte raw text, independent forms, Apply/Cancel/departure and protection/metadata retention. | AC-2, AC-3, AC-5 |
| 5 | Complete failure/inspect-only fixtures and V6 responsive/accessibility behavior. Verify cycle/target and blocked-repair diagnostics; read/commit/create/rename failure retention and Retry; right/bottom inspector, drawer, selected-row reveal, accepted-token scroll reset, collapsed-header rules and unavailable specimens. | AC-4, AC-5, AC-7 |
| 6 | Review a stable implementation snapshot independently, correct findings and recheck affected behavior. Finish criterion-linked completion evidence and a concise handoff; humans stage/commit/push. | AC-1–AC-8 |

Keep one code-writing agent active at a time. Use a fresh developer with explicit references to the approved agreement/policy/design; a fresh reviewer derives expectations from them and receives an identified stable snapshot. Material scope/interaction changes return to the user. Routine fixes and checks within the authorized contract need no repeated approvals.

## Evidence required during implementation

- Exact Decimal/byte fixtures must match exactly. Record Culori/runtime versions and independent numerical expectations; retain the representative proposed tolerances (`1e-8` common-sRGB/OKLAB, `1e-5` degrees for chroma at least `1e-4`, `1e-6` after 100 deliberate calculated round trips). Compare near-neutral rectangular coordinates rather than unstable hue. No universal all-input or hidden-intermediate guarantee is added.
- Test the inclusive `1e6` input-only cap, no minimum magnitude, non-finite/nonzero-input-to-zero refusal, 4,096-character input and 4,200-character output budgets, finite results and real final constructor. Do not require old named-stage/cancellation probes as acceptance criteria or relabel frozen research as a new run.
- Distinguish pure-probe/source nonmutation from real application failure atomicity. Inspect successful application readback, stored aliases/metadata and unchanged data after rejected operations; verify drafts through real browser interactions.
- Run `npm run typecheck`, `npm test`, `npm run build`, production `npm run preview` and `git diff --check` with the eventual documented scopes. Record actual commands and results; do not claim a root browser build is currently available.
- Record Node and supported-browser versions and fixture/browser results. Check desktop/tablet/mobile including 320px and short height, actual 200% zoom, keyboard/focus/error announcements, hidden content, dialogs and long values. Record assistive-technology and virtual-keyboard coverage/limits. Inspect console/network behavior and absence of project persistence or network writes.

## Current verification and next action

Preparation consists of reading the owning documents, local manifests/locks/configuration and the primary metadata/integration sources above; no application tests, new numerical probes, build or browser acceptance were performed. Historical prototype and qualification checks retain their original scope. Package metadata is not proof of a working installed combination; browser integration, exact production lockfile, bundle size and accessibility remain future evidence.

Present this plan with its metadata findings to the user. The next action is explicit authorization to implement Increment 003 against the already agreed contract and design, using the ordered slices above. This plan creates no extra product-approval stage and does not itself grant implementation permission.

Suggested commit: `docs: prepare Increment 003 delivery plan`.
