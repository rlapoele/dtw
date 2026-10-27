# Design Token Workbench

A desktop-first, local-first design-token workbench. Product and domain discovery documents live in `docs/`; the latest handoff is in [docs/status/current.md](docs/status/current.md).

The accepted [visual direction and reference image](docs/project/visual-direction.md) guide subsequent interface design and prototyping.

## Development scaffold and domain core

The scaffold uses TypeScript, Vite, Vitest, and npm. Dependencies are development-only and `package-lock.json` records their resolved versions. The host-independent domain code implements exact canonical Decimal validation and comparison; number, dimension, and color literal construction; variation axes, conditions, selection completion, assignment matching, and theme presets; the initial `Token` aggregate lifecycle; and stable-ID token references with project-scoped validation and literal/alias resolution. Token assignments accept the implemented literal subset and references. There is no application-operation layer or web entry point yet.

The scaffold was verified using Node.js `24.14.1` and npm `11.17.0`, satisfying the installed development tools' engine requirements. Install the locked dependencies with `npm ci`.

- `src/domain/` contains host-independent domain entities, value objects, and validation.
- `test/domain/` contains small unit tests named `*.test.ts`.

| Command | Purpose |
|---|---|
| `npm run typecheck` | Check source and test types with TypeScript |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run dev` | Start the Vite development server when a web entry point is added |
| `npm run build` | Check types, then build with Vite when an entry point is added |
| `npm run preview` | Preview an existing Vite production build |

The TypeScript configuration enables strict checking and includes `src/**/*.ts` and `test/**/*.ts`. Its default environment excludes browser and Node global types to keep the domain code independent of either host. Dependency declaration checking is skipped because the Vite and Vitest declarations reference host event types that are intentionally absent; project source and tests remain strictly checked. Vitest uses its default Node test environment.

Type checking and unit tests validate the current domain core. Building still requires a Vite entry point, and preview requires generated output.

Reference construction validates the structural field/index path representation and preserves broken references for repair. `validateProjectTokenReferences(projectId, tokens, selection)` reports target existence, project ownership, declared-type compatibility, and unsupported value paths for all authored reference assignments. It also reports ambiguous selected assignments and cycles under the supplied completed project selection. Supply the complete token snapshot and a selection completed from that project's axes. Currently only whole-value references (`valuePath: []`) are supported; non-empty paths remain diagnosable data. This validation does not resolve values or establish assignment coverage for every possible variation selection. Aggregate-local construction and assignment changes must be followed by project validation before accepting authored changes.

`resolveToken(projectId, tokens, tokenId, selection)` resolves one token through its selected literal or whole-value alias chain. Each dependency independently selects its most-specific assignment under the same completed project selection. It returns `resolved` with the exact literal, root matched condition, and ordered dependency trace, or `unresolved` with a reason, diagnostic identifying the failing token, and the trace up to failure. It preserves authored data, never converts units or color spaces, and never falls back after a selected assignment fails. Missing assignments or targets, ambiguity, cycles, incompatible types, foreign-project targets, and unsupported part paths are explicit outcomes. Duplicate token identities in the supplied snapshot are rejected with `RangeError`, consistently with reference validation. Iterative traversal supports long alias chains. The caller supplies the complete project token snapshot and a selection already completed from that project's axes; inactive and unrelated references remain the responsibility of project validation. Expressions and composites are not implemented yet.
