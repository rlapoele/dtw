# Design Token Workbench

A desktop-first, local-first design-token workbench. Product and domain discovery documents live in `docs/`; the latest handoff is in [docs/status/current.md](docs/status/current.md).

The accepted [visual direction and reference image](docs/project/visual-direction.md) guide subsequent interface design and prototyping.

## Development scaffold and domain core

The scaffold uses TypeScript, Vite, Vitest, and npm. Dependencies are development-only and `package-lock.json` records their resolved versions. The first host-independent domain code implements exact canonical Decimal validation and comparison plus number, dimension, and color literal construction. There is no application-operation layer or web entry point yet.

The scaffold was verified using Node.js `24.14.1` and npm `11.17.0`, satisfying the installed development tools' engine requirements. Install the locked dependencies with `npm ci`.

- `src/domain/` contains host-independent domain value objects and validation.
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
