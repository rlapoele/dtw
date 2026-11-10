# Increment 007: backup coverage and restore policy

**Agreed policy — 9 November 2026.** The user approved P-1–P-4, explicitly
including the first-version exclusion of conditional and complete component
systems. This resolves D-2 coverage and D-3 admissibility at the policy level.
The original analyst investigation used snapshot
`616e1f299ae43e7c5d9fd73f09e719a048e1593e`; its proposal was committed as `c5c7ed8`
before this agreement. The existing filename is retained for stable references.

This agreement does not select file syntax, a runtime library, migration policy or
storage technology. Representation/version/resource choices remain D-6; actual
retention and concurrency qualification remain D-1/D-4/D-5. The
[Draft contract](007-local-retention-and-backup.md) remains Draft; final contract/design
agreement and implementation authorization are still pending.

## Four choices to review

| Choice | Agreed first-version policy | Alternatives considered and cost |
| --- | --- | --- |
| P-1: coverage | Preserve the complete declared project/groups/tokens envelope below, including all nine implemented literals, three composites, references, six portable AST operations, supported incomplete/non-color/protected/inspect-only tokens and component association fields. Restrict assignments to zero or one unconditional assignment. | Add axes/options/presets and conditional selection now: broader genuine domain coverage, but a larger application snapshot/inspection and backup contract. Color-editor-only backup is not an acceptable alternative to the agreed preservation promise. |
| P-2: absent context | Preserve a correctly paired component layer/association ID as inspect-only with an explicit **coverage notice** that component ownership context is unavailable/unverified; do not claim a complete component system. Reject conditional assignments and authored axes/presets/component-definition collections as outside this first envelope. | Reject component-associated tokens too: simpler completeness claim, but excludes valid current Token shapes and needs an explicit narrower agreement. Alternatively include actual component definitions and variation context: broader scope requiring schemas and operations beyond current storage. |
| P-3: repairable data | Strictly decode supported shapes/identity/membership; preserve the enumerated namespace/reference/evaluation failures below with diagnostics. Invalid or unknown representation is a whole-project rejection. | Permit only fully valid projects: simpler, but conflicts with agreed missing-reference preservation and prevents recovery of readable authored work. Preserve arbitrary malformed objects: larger safety/inspection contract and no trustworthy semantic interpretation. |
| P-4: identity and unknown data | Scope entity lookup by project **and kind**; reject duplicate IDs within one kind/project, allow the same string across kinds/projects. Reject unknown fields/content whole, including unimplemented extensions/provenance, rather than drop or pass through opaque metadata. | Require globally unique strings: incompatible with current separate maps and caller-supplied identities. Opaque metadata preservation: better future interchange, but requires a new bounded metadata contract, mutation guarantees and resource policy now. |

The user explicitly accepted the component-context and conditional-coverage
tradeoff in P-2. The declared envelope defines “supported authored data” for the
first version; excluded systems must be rejected whole, never partially backed up.
D-1/4/5/6 remain open; dependencies are listed at the end.

## Evidence and present implementation limits

- [ProjectSnapshot](../../src/application/project-storage.ts) contains only project,
  groups and tokens. [Authoring operations](../../src/application/authoring.ts)
  always use a selection completed from **no axes**. The preload adapter is a test
  facility, not an importer. No retained axes/presets/component definitions exist.
- [Token](../../src/domain/token.ts) supports three definition states, sixteen
  declared type names, nine actual literal variants, three composite variants and
  component association pairing. It does not implement `extensions`, despite the
  [conceptual model](../design-tokens/conceptual-model.md#token-aggregate-and-assignment-structure)
  anticipating them. `createToken` does not deeply runtime-decode arbitrary input.
- [Namespace](../../src/domain/namespace.ts) and
  [reference validation](../../src/domain/token-reference-validation.ts) have
  separate group/token maps and explicit diagnostics; duplicates within each map
  throw. Names are deliberately not normalized or checked for sibling uniqueness.
  [Opaque branded IDs](../../src/domain/identifiers.ts) are strings, with no UUID,
  nonblank or global-uniqueness validation in current constructors.
- [Resolution](../../src/domain/token-resolution.ts) is diagnostic and nonmutating;
  it is not a complete external decoder. [Expression constructors](../../src/domain/expression.ts)
  check operation/arity, while evaluation reports operand/range/context failures.
  [Color revision eligibility](../../src/application/color-revision-policy.ts)
  is independent from project validity and backup eligibility.
- Source/tests inspected include [authoring](../../test/application/authoring.test.ts),
  [color revision](../../test/application/color-revision.test.ts),
  [eligibility](../../test/application/color-revision-policy.test.ts),
  [tokens](../../test/domain/token.test.ts), [namespace](../../test/domain/namespace.test.ts),
  [references](../../test/domain/token-reference.test.ts),
  [expressions](../../test/domain/expression-resolution.test.ts), composite/literal
  tests and the [browser fixture](../../test/browser/increment006.tsx). This is source
  evidence, not a fresh test run or proof of a delivered retention boundary.

The [conceptual model](../design-tokens/conceptual-model.md),
[glossary](../design-tokens/glossary.md) and
[interoperability](../design-tokens/interoperability.md) still govern meaning.
Preserving an invalid relationship is not declaring it valid. Backup is independent
recovery of the declared authored envelope, not DTCG export or arbitrary import.

## Agreed authored field and content matrix

All recognized fields are copied without conversion. Optional fields preserve
absence versus present empty/whitespace text. `null` is accepted only where specified
(e.g. root parent), not as a substitute for absent definition/description. Explicit
JavaScript `undefined`, functions, sparse arrays and cyclic object graphs are not
additional file values; normal domain constructors omit undefined optional fields.
A decoder must check actual runtime shapes before any domain traversal.

| Area | First-version content and required preservation |
| --- | --- |
| Snapshot | Exactly one `project`, `groups` array and `tokens` array; empty arrays allowed. Preserve array order even where not semantically significant. Version/wrapper fields are to be explicitly specified under D-6. |
| Project | `id`, `name`, optional `description`, all strings. Preserve even empty/whitespace IDs/names exactly; impose no new identifier grammar. New-creation required-name policy is not retroactive restore validation. |
| Group | `id`, `projectId`, `localName`, `parentGroupId` string or null, optional `description`. Every `projectId` must match this project. Preserve empty groups, opaque names and broken same-project parent links as specified below. |
| Token | `id`, `projectId`, `localName`, `parentGroupId`, optional `description`, `layer`, `semanticRole`, `componentDefinitionId`, `definition`; required `authoring.regeneration` (`allowed` or `protected`). Layer absent/primitive/semantic/component is explicit, not inferred. Preserve strings exactly and require project membership. No unknown authoring keys. |
| Definition | Absent definition is name-only. Present definition has one of the current sixteen `TOKEN_TYPES` strings and `assignments: []` or one `{condition: [], value}`. Name-only and typed-unassigned are supported, not corrupt. Duplicate unconditional assignments are invalid; nonempty conditions are excluded first-version content. |
| Declared but unimplemented types | `angle`, `string`, `gradient`, `border` may be typed-unassigned, or carry a structurally valid reference whose unresolved/type status is reported. They do **not** gain invented literal/composite schemas. An actual literal/composite with one of these unimplemented variants is rejected. |
| Component token | `layer: component` iff `componentDefinitionId` is a string, including on name-only/typed-unassigned tokens. Preserve the pair exactly; token remains inspect-only with unavailable/unverified context notice. A missing pair or association on another layer is rejected, not silently fixed. Actual component-definition payload is excluded. |
| Reference | `kind: token-reference`, string `targetTokenId`, `valuePath` array. Empty path is whole-value reference. Preserve well-shaped nonempty paths as unsupported/repairable: field segment has string `key`; index segment has a non-negative safe-integer `index`. No arbitrary field navigation, foreign-project lookup, target remap or alias flattening. |
| Expression | `kind: expression`, one of `portable.math.add.v1`, `subtract.v1`, `scale.v1`, `min.v1`, `max.v1`, `clamp.v1` with full `portable.math.` prefix; two operands, except three for clamp. Recursive operands are the nine supported literals, references, supported nested expressions, or `{kind: context-reference, key: font.rootSize}`. Preserve AST/operand order; no composites or context-reference as top-level assignment. Semantically wrong operands/root type remain diagnostics if structure is supported. |
| External evaluation context | No stored root-font-size defaults or browser facts. A supported AST needing absent `font.rootSize` is retained with `context-required`. This is deliberately external evaluation context, unlike missing authored variation axes. |
| Excluded authored collections | Axes/options/presets, component definitions/contracts, settings/provenance/adapter metadata/extensions and any other extra fields or collections: whole rejection before load/restore/backup generation. No speculative placeholders, opaque bags or partial backup. |
| Excluded session/derived data | Drafts/forms, selected token, active display space, resolved caches/traces/paths, previews, catalogue summaries and concurrency metadata are not additional authored fields. Transport/backup wrapper metadata must have a separate explicit contract; do not stuff it into tokens. |

Token descriptions additionally follow the user-agreed
[1,024-unit field ceiling](007-format-decoder-and-resource-proposal.md#token-description-amendment--10-november-2026),
amended 10 November 2026. Project/group descriptions retain the generic string
limit. This narrows resource admission, not the supported field shape: preserve
accepted exact text, reject over-limit candidates whole and never truncate or strip.

### Literal and composite coverage

| Variant | Supported exact data and constraints |
| --- | --- |
| Color | `colorSpace`, three explicit `components`, required `alpha`; all five spaces and constructor range constraints. Preserve canonical Decimal text and `none`, extended sRGB/P3, explicit zero alpha and unpremultiplied coordinates. Persisted hue must already be normalized `[0,360)`; restore must not silently wrap `360` or `-30`. See [color](../../src/domain/color-literal.ts). |
| Number | `value` exact canonical Decimal; signed/unbounded by use-site policy. |
| Dimension | `value` Decimal and required `unit: px/rem`, including at zero; signed values supported. |
| Percentage | Exact `ratio` Decimal, not percent text or a silently imposed 0–1 range. |
| Duration | Signed `value` Decimal, `unit: ms/s`; inline transition duration is narrower than standalone duration. |
| Boolean | `value` actual boolean, including explicit false; no coercion/default. |
| Font family | Nonempty ordered `families` stack of `{kind: named, name}` with nonblank exact text, or `{kind: generic, family}` from serif/sans-serif/monospace/system-ui. Preserve duplicates and named-versus-generic distinction. |
| Font weight | `value` Decimal in inclusive `[1,1000]`, including fractions. |
| Cubic Bézier | Four ordered Decimal `controlPoints`; x1/x2 in `[0,1]`, y coordinates signed. |
| Transition | All three required fields: duration, delay, timingFunction; correctly typed supported literals or references. Inline duration nonnegative, delay signed; no field AST. |
| Typography | All five required fields: fontFamily, fontSize, fontWeight, letterSpacing, lineHeight; typed literals/references. Inline fontSize and lineHeight nonnegative; letterSpacing signed; no field AST. |
| Shadow | Nonempty ordered layer stack; each layer has explicit color/offsetX/offsetY/blur/spread/inset typed literals or references. Inline blur nonnegative, offsets/spread signed; explicit inset; no field AST or whole-layer reference. |

Literal owners are [numeric literals](../../src/domain/numeric-literals.ts),
[percentage](../../src/domain/percentage-literal.ts),
[duration](../../src/domain/duration-literal.ts), [boolean](../../src/domain/boolean-literal.ts),
[font family](../../src/domain/font-family-literal.ts),
[font weight](../../src/domain/font-weight-literal.ts) and
[cubic Bézier](../../src/domain/cubic-bezier-literal.ts); composite owners are
[transition](../../src/domain/transition.ts), [typography](../../src/domain/typography.ts)
and [shadow](../../src/domain/shadow.ts).

Numeric fields use [canonical Decimal](../../src/domain/decimal.ts) text, not Number
round trips. For example `"0.10"`, `"-0"`, exponent text or numeric `0.1` are rejected
rather than normalized into a different authored representation. A backup decoder
can validate with constructors only if it verifies no authored field was changed;
constructors are not themselves strict decoders. Numerical calculation input caps
must not become persistence limits. D-6 will set resource budgets explicitly.

## Why the context boundary is asymmetric

An existing component association is a **stored opaque ownership link**. Neither
current unconditional token value selection nor resolution consults its definition;
the application has no component authoring operation, and component tokens are
already excluded from manual color revision. Preserving the pair does not require
fabricating a definition or calculating a component contract. The agreed coverage
notice must say ownership cannot be verified, not claim the component is valid or
complete. This notice is **not an existing domain diagnostic code**.

A nonempty condition instead changes **which authored assignment supplies a value**.
Its axes/options/defaults are authored context which this snapshot cannot contain;
the application's empty selection could report a missing assignment or choose an
unconditional fallback while concealing the absent variation system. Consequently
this proposal rejects that content whole rather than presenting incomplete selection
as correct. In contrast, `font.rootSize` is intentionally supplied externally for
supported expression evaluation, so its absence is an honest `context-required`
result and does not reject the AST.

This agreed bounded tradeoff is not a universal rule that absent component context
is safe while absent variation context is unsafe. The user agreed to defer backup of a **complete component or conditional system**.
Supporting one later requires its owning/context data in a revised envelope;
preserving association IDs alone is not that promise.

## Agreed restore and durable-load admissibility

**Accept exact** means supported authored representation, not necessarily editable
in the current UI. **Accept with diagnostics** means preserve the supported shape
unchanged, show its incompleteness/invalid relationships, and offer no silent repair.
**Reject** blocks the entire candidate before any retained project/catalogue mutation.
These same classifications govern backup generation, durable loading and restoration.
A generated backup must pass its own restore policy; diagnostics do not prevent
backing up an accepted diagnostic state.

| Candidate | Agreed result | Actual source outcome or boundary reason |
| --- | --- | --- |
| Supported valid envelope; empty project/groups; exact names including empty/whitespace/duplicate names or ambiguous derived paths | Accept exact | Opaque names and deferred sibling uniqueness; no current ambiguous-path diagnostic. Display identity-safe labels, do not add a path uniqueness constraint. |
| Name-only or typed-unassigned token, including declared-but-unimplemented type with no value | Accept with incompleteness diagnostics where inspected | Resolution `missing-assignment`; no invented black/default/type. It remains valid incomplete membership. |
| Missing target; alias to a name-only or unassigned target | Accept with diagnostics | Validator `missing-reference` / `target-type-missing`; resolver `missing-reference` / `missing-assignment`. Preserve target ID. |
| Wrong target type, including AST/composite reference fields | Accept with diagnostics | `type-mismatch`, with field/operand location where available. No literal coercion. |
| Well-shaped nonempty field/index reference path | Accept with diagnostics | `unsupported-value-path`; do not navigate it or claim part-value support. Invalid segment discriminant/key/index shape is rejected. |
| Self-reference or multi-token cycle, including field/AST edges | Accept with diagnostics | `reference-cycle`; stable IDs remain unambiguous, traversal already reports cycles. |
| Missing same-project parent or cyclic namespace | Accept with diagnostics | `missing-parent-group` / `group-cycle`; path is invalid, not partly fabricated. Keep every group/token accessible through identity-safe all-content inspection, including unreachable groups. No hierarchy repair operation is added. |
| Paired component association with no definition collection | Accept with coverage notice; token inspect-only | Exact link retained; unavailable/unverified ownership context is not current validator output and must not be called validated ownership. |
| Supported AST needs root-size context, or resolves to wrong type, invalid operands or reversed clamp bounds | Accept with diagnostics; AST inspect-only | `context-required`; `type-mismatch`; `invalid-expression` with `invalid-operands` / `invalid-clamp-range`. Known operation/arity/recursive payloads are structurally decoded first. Runtime-invalid external context is not authored backup data. |
| Well-shaped composite reference resolves negative duration/fontSize/lineHeight/blur | Accept with diagnostics; composite inspect-only | `invalid-composite` with `negative-transition-duration`, `negative-typography-font-size`, `negative-typography-line-height`, `negative-shadow-blur`. Preserve reference, not negative resolved output as a literal. |
| Foreign group/token `projectId`, foreign parent object, included foreign reference target | Reject whole | `project-mismatch`, `foreign-parent-group`, `token-project-mismatch`, `cross-project-reference` are not this restore allowlist: ownership must be unambiguous and no content may disappear through current read filtering. |
| Target string happens to exist only in another retained project, but no foreign object is included | Accept with local missing-reference diagnostic | Never resolve through a global map. Same string in this project's token map resolves locally, not by provenance guesses. References contain no project ID. |
| Duplicate group IDs or duplicate token IDs in this project | Reject whole | Existing namespace/reference/application duplicate checks reject rather than choose by array order. Exact-equal duplicate records are still duplicates. |
| Same string reused by project/group/token kinds or in different projects | Accept exact if otherwise admissible | Lookup key is project + entity kind + ID. Current separate maps support this; no global uniqueness invariant or UUID grammar is established. Duplicate project ID instead invokes the already-agreed restore collision choices. |
| Multiple unconditional assignments, malformed definition, missing required fields, unknown token type, broken component layer/association pairing | Reject whole | Ambiguous/malformed authored definition. `ambiguous-assignment` from duplicated unconditional candidates is not an admissible repair state here; current aggregate construction prohibits duplicate conditions. |
| Any nonempty condition, even well-formed; included axes/options/presets | Reject whole as unsupported content | No complete authored selection context in this envelope. Valid domain-only conditional projects are excluded explicitly, not labelled corrupt. |
| Bad literal or invalid direct composite field/range; literal/composite valueType differs from owner type | Reject whole | Constructor-level authored-value invariant. Resolver tolerance of forged malformed fixtures is not a persistence schema. An inline negative blur is different from a valid reference resolving negative. |
| Unknown AST operation/key, wrong arity, invalid recursive node, direct field expression, top-level context-reference | Reject whole | Unsupported/malformed representation, even if resolver could emit `unsupported-expression`, `invalid-context`, `invalid-arity` or `invalid-composite`. Preserve only the defined AST grammar. |
| Unknown fields, including extensions/provenance/extra authoring data; unimplemented actual literal/composite variants; extra project collections | Reject whole as unsupported content | Show offending locations; never strip unknown data or fabricate an owned context. No opaque passthrough selected. |
| Resource/version limits exceeded or unsupported version | Acceptance blocked pending D-6 policy | No numeric budget/version migration selected here; resource exhaustion cannot produce a partial project. |

`missing-group` and `missing-token` are failed queries for an entity ID, not extra
stored-data kinds. They must not be “fixed” by creating a record. A generated
preview/diagnostic set is not persisted authored truth. Multiple applicable issues
may coexist; **any reject-class issue blocks the whole candidate**, otherwise show
all available diagnostic findings and preserve the original authored candidate.

## Inspection and existing repair boundaries

Accepting diagnostic data must provide identity-safe access to its preserved
records, raw authored values and diagnostics, even when group ancestry is unusable.
A cycle must not cause a recursive tree to hang. This is required recovery inspection,
not group deletion/move/repair tooling or a new authoring feature.

Accepting empty/whitespace opaque IDs under P-4 creates an explicit implementation
burden; it is not evidence the current presentation handles them safely.
[App](../../src/presentation/app/App.tsx) uses empty-string selection state and truthiness
for `projectId`/`selected`, and `parent || null`;
[CreationDialog](../../src/presentation/features/workbench/components/CreationDialog.tsx) uses an empty option for
Project root; [session](../../src/presentation/features/workbench/state/session.ts) uses an empty reference
fallback. If P-4 is adopted, distinguish actual opaque IDs from absent selection,
root parent and unchosen reference throughout lookup/inspection/selection. Add
fixtures for empty and whitespace project/group/token/target IDs, root versus
empty-ID parent, and same string across kinds. A temporarily unavailable action
must refuse explicitly while preserving data; it must not hide a retained entity,
reparent to root, discard a reference or report a successful partial backup.
Do not trim whitespace IDs or silently introduce a nonblank ID rule as a workaround.

Do not make every diagnostic project globally read-only merely because restore
accepted it. Preserve current per-token eligibility: non-component single
unconditional color literals/references can be explicitly revised, including
protected colors and broken references. Name-only/unassigned, non-color, component,
AST and composite tokens remain inspect-only. A normal command still validates
the **whole candidate** namespace/reference graph before committing. Thus one broken
color alias may be repaired if that removes all those diagnostics; unrelated errors
still block it. Creating the missing color target can also succeed only if the
complete candidate passes existing checks. No progressive-repair exception is added.

Resolution-only failures are separately reported: current authoring acceptance
checks namespace/reference diagnostics, not every resolution diagnostic. This
proposal does not silently turn it into a universal all-diagnostics validator or
relax its existing checks. Component context notices neither establish ownership
validity nor permit component editing; unrelated operations preserve those links.

For example, color alias `content` → missing token `base` is readable and can be
backed up exactly. Duplicate token IDs both named `base` are rejected because no
single target can be addressed. A valid mixed `px/rem` AST without `font.rootSize`
is readable with context-required; a conditional assignment naming an absent axis
is rejected as outside this first envelope. The messages must distinguish those
cases before asking for restore acceptance.

## Compatibility with the minimum preservation promise

This covers ordinary current application-created data plus all valid unconditional
implemented values and their supported diagnostic forms. The browser fixtures'
protected colors, non-color number, long exact/extended/`none` values, opaque names,
duplicate paths, missing references and missing parent are all retained. The
application revision fixture's correctly paired component association is retained
as inspect-only with the agreed context notice.

It deliberately **does not promise every object current in-memory test preloading
can hold**. Conditional tokens constructed with axes in domain tests are genuine
domain data but cannot carry their complete authored context through current
ProjectSnapshot. Cast malformed fixtures (mismatched literal type, missing component
association, empty shadow stack, duplicate assignments) test refusal/tolerance; they
do not establish accepted external schemas. Domain-only conditional systems and
unknown metadata/complete components are explicitly excluded by the user-approved
first-version policy. Broader support would require a separate scoped agreement;
the first version must not present these exclusions as successful complete recovery.

For any existing/injected snapshot outside the accepted envelope, loading or backup
generation returns an explicit unsupported-data result with locations/reasons; it
does not sanitize, partially retain, delete or overwrite it. Where a prior valid
loaded snapshot exists, keep it visibly stale/read-only. The original input/source
remains untouched and no migration is inferred. Storage-level recovery of unreadable
records and version upgrade tooling remain D-1/D-6 work; the UI cannot claim an
independent backup was made when candidate validation blocked generation.

## Contract consequences and follow-on work

The Draft adopts this document as the D-2 matrix and D-3 allowlist, keeping AC IDs
stable. AC-9–14/17 verification should include every matrix boundary,
all supported literal/composite families, component notices, invalid paths/groups,
identity cross-kind reuse, foreign membership, all unknown-field locations,
unsupported conditions and exact backup→restore equality. Test same policies for
new backup generation, retained loading and incoming restoration; an unsupported
snapshot must fail without filtered data loss. No code/schema is supplied here.

- D-6 must select wrapper/representation, format version rules, strict decoder
  approach and resource limits, including nested ASTs, paths, arrays and Decimal
  calculations. Reject duplicate serialized field declarations before decoding can
  overwrite them (for an object-member representation, plain JSON parsing alone
  cannot prove their absence). Parser choice remains D-6. Do not rely on permissive
  constructors, prototype JSON or casts.
- D-1 must ensure catalogue/state failure atomicity and explicit unsupported retained-
  record recovery; D-4 must preserve these values on unrelated writes and conflicts.
  Neither is resolved by choosing data policy.
- Any required inspection/notice interaction beyond V2 returns to user/design review
  before implementation. Current prototype samples are not changed by this proposal.
- D-2/D-3 are **agreed policy**; implementation and verification are not complete.
  D-1/D-4/D-5/D-6, final contract/design agreement and implementation authorization
  remain pending. No app tests, browsers or external service claims were used.
