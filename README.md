# Design Token Workbench

A desktop-first, local-first design-token workbench. Product and domain discovery documents live in `docs/`; the latest handoff is in [docs/status/current.md](docs/status/current.md).

## Development scaffold

The initial scaffold uses TypeScript, Vite, Vitest, and npm. Dependencies are development-only and `package-lock.json` records their resolved versions. No domain implementation, tests, or web entry point exists yet.

The scaffold was verified using Node.js `24.14.1` and npm `11.17.0`, satisfying the installed development tools' engine requirements. Install the locked dependencies with `npm ci`.

- `src/` is reserved for source code.
- `test/` is reserved for unit tests, named `*.test.ts` or `*.spec.ts`.

Both directories are initially empty. Git will track them once files are added.

| Command | Purpose |
|---|---|
| `npm run typecheck` | Check source and test types with TypeScript |
| `npm test` | Run Vitest once |
| `npm run test:watch` | Run Vitest in watch mode |
| `npm run dev` | Start the Vite development server when a web entry point is added |
| `npm run build` | Check types, then build with Vite when an entry point is added |
| `npm run preview` | Preview an existing Vite production build |

The TypeScript configuration enables strict checking and includes `src/**/*.ts` and `test/**/*.ts`. Its default environment excludes browser and Node global types to keep the initial domain code independent of either host. Vitest uses its default Node test environment.

Until TypeScript files are added, type checking reports `TS18003` (no inputs). Until tests are added, Vitest exits with a no-tests-found result. Building additionally requires a Vite entry point; preview requires generated output. These commands are wired for subsequent work rather than evidence of an implemented application.
