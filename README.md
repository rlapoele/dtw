# Design Token Workbench

A desktop-first, local-first design-token workbench. Product and domain discovery documents live in `docs/`; the latest handoff is in [docs/status/current.md](docs/status/current.md).

The accepted [visual direction and reference image](docs/project/visual-direction.md) guide subsequent interface design and prototyping.

## Development scaffold and domain core

The scaffold uses TypeScript, Vite, Vitest, and npm. Dependencies are development-only and `package-lock.json` records their resolved versions. The host-independent domain code implements exact canonical Decimal validation and comparison; number, dimension, percentage, and color literal construction; variation axes, conditions, selection completion, assignment matching, and theme presets; the core `Project` entity and initial `Token` aggregate lifecycle; namespace groups, structural validation, and path derivation; stable-ID token references with project-scoped validation; and literal, alias, and portable number/dimension expression resolution. Token assignments accept the implemented literal subset, references, and portable expressions. There is no application-operation layer or web entry point yet.

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

`resolveToken(projectId, tokens, tokenId, selection, context?)` resolves one token through selected literals, whole-value aliases, and portable expressions. Each dependency independently selects its most-specific assignment under the same completed project selection. It returns `resolved` with the exact literal, root matched condition, and ordered dependency trace, or `unresolved` with a reason, diagnostic identifying the failing token, and the trace up to failure. It preserves authored data and never falls back after a selected assignment fails. The caller supplies the complete project token snapshot and a selection already completed from that project's axes. Duplicate token identities are rejected with `RangeError`. Iterative traversal supports long alias chains and nested expression evaluation. Inactive and unrelated references remain the responsibility of project validation, which also traverses expression operands and detects selected dependency cycles with multiple outgoing references.

`createExpression` constructs the closed serializable AST for `portable.math.add.v1`, `subtract.v1`, `scale.v1`, `min.v1`, `max.v1`, and `clamp.v1` under the same `portable.math` prefix. It checks operation support and arity; operand compatibility and result types are derived during evaluation with target and context information. Operands may be implemented literals, token references, nested expressions, or an explicit `font.rootSize` context reference. `analyzeExpression` extracts references and explicit context keys without evaluating; mixed-unit requirements may become known only after operand resolution.

Decimal addition, subtraction, and multiplication are exact. Number operations require no context. Same-unit dimensions preserve their unit, and scaling a dimension requires a number scalar. Mixed `px`/`rem` operations require `context["font.rootSize"]` as a non-negative `px` dimension and return `px`; no root size is assumed. Missing required context produces `context-required`. Invalid arity, operands, context, and reversed clamp bounds produce `invalid-expression` with a specific diagnostic code; unknown operations produce `unsupported-expression`. Expression diagnostics carry an operand-index path within the owning token's AST. Expressions remain authored ASTs after evaluation. Composite schemas, additional context keys, and target-specific operations remain unimplemented.

`TokenGroup` provides stable project-owned identity, an opaque local name, an optional description, and an explicit parent group ID or `null`. `createTokenGroup` constructs the data and `renameTokenGroup` preserves identity and containment. Project relationships are checked separately.

Namespace operations consume a `ProjectNamespaceSnapshot` containing the project ID, groups, and tokens. This is an operation input, not a persistence format or a Project aggregate. `validateProjectNamespace` reports foreign entities, missing or foreign parents, and group ancestry cycles. Duplicate group or token IDs in the snapshot raise `RangeError`. `deriveTokenPath` and `deriveTokenGroupPath` return root-to-leaf name-segment arrays or diagnostics for invalid ancestry. They traverse only the requested ancestry and return no partial path on failure. `moveTokenGroup` and `moveTokenInNamespace` return a new snapshot only after its structural namespace validation passes; inputs and descendant identities remain unchanged. Moving to `null` places the entity at the project root.

Namespace names remain opaque, including whitespace, separators, Unicode, and empty text. Name grammar, normalization, sibling-name collision checks, joined-path formatting, and deletion are deferred. Structurally valid snapshots may therefore still have duplicate derived paths; namespace validation currently does not establish naming validity. Renames and moves change derived paths without rewriting token definitions, references, or descendant containment.

`Project` contains a caller-supplied stable `ProjectId`, an opaque name, and an optional description. `createProject`, `renameProject`, and `changeProjectDescription` construct or return readonly plain data; edits preserve identity without mutating the input. Passing `undefined` to `changeProjectDescription` removes the field, while empty text remains explicit. Workspace location, tokens, groups, settings, provenance, and export configuration remain separate concerns. Identifier generation and name-validation policies remain open.

`createPercentageLiteral(ratio)` constructs `{ kind: "literal", valueType: "percentage", ratio: Decimal }` from canonical ratio text (`"0.5"` represents `50%`). Ratios may be negative or greater than one. Percentage assignments and whole-value aliases resolve without conversion; number/percentage and dimension/percentage substitutions are type errors. Percentage operands and scalars remain invalid in all portable operations. Parsing percentage display strings and references into the `ratio` field are outside the current support boundary.
