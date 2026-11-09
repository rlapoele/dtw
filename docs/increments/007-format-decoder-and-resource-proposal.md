# Increment 007: format, decoder and resource proposal

**Agreed policy — 9 November 2026; Stage A qualification authorized.**
The user agreed F-1–F-5 and the qualification plan after committing planning review
as `21196be`, and authorized isolated Stage A work including the parser dependency
if needed. Production Increment 007 implementation remains unauthorized. The
proposal was prepared against `d83a9e91f061ca6519849096e49ec1fc2c112d72`.
[D-2/D-3 coverage](007-backup-coverage-and-restore-policy-proposal.md) and
[S-1–S-6 storage direction](007-storage-acknowledgement-and-concurrency-proposal.md)
remain agreed. The [qualification plan](007-storage-concurrency-qualification-plan.md)
owns Stage A scope; agreement is not technical qualification or final contract/design
agreement. The existing filename is retained for stable references.

## Five agreed decisions

| Bundle | Agreed choice | Unselected alternative/cost |
| --- | --- | --- |
| F-1: portable format | One uncompressed UTF-8 JSON project backup, exact five-member wrapper below, format version 1 and authored envelope version 1. No browser revisions/outcomes or derived data in backup. | ZIP/multiple files add archive/path and cross-file failure work without current need. DTCG would lose the agreed envelope. |
| F-2: strict decoder | Fatal UTF-8 decode; reject BOM, duplicate decoded keys, invalid JSON and unknown members. Build prototype-safe records and apply explicit supported-shape validators without coercion/defaulting/normalization. | Native JSON.parse alone loses duplicate-member evidence. A general schema framework is unnecessary for this closed envelope. |
| F-3: parsing dependency | Use exact `jsonc-parser` 3.3.1, MIT, used only for bounded token scanning/strict visitor parsing. Own domain-aware runtime checks. No new schema-library dependency. | A handwritten JSON parser avoids a package but adds a language implementation to maintain. Native parse plus a homemade duplicate detector still needs trustworthy string/token handling. |
| F-4: admission limits | Adopt the concrete initial ceilings below consistently for accepted commands, retained loading, backup generation and restore, subject to measurement before final agreement. | Lower limits improve bounded cost but exclude more valid authored work. Higher limits need evidence. These are explicit new resource exclusions, not pre-existing canonical constraints. |
| F-5: derived work | Add explicit evaluation/derived-output work ceilings, separate from admissible authored data. Stop before costly arithmetic/expansion, report representation/evaluation unavailable, retain authored source. | Literal/AST depth limits alone do not bound repeated alias/AST expansion or BigInt multiplication. Rejecting every costly-but-valid AST would narrow agreed admissibility instead of preserving it. |

F-3 dependency/license/integrity/bundle checks are part of authorized isolated
qualification. F-4/F-5 explicitly bound previously unbounded data/work; the user
agreed this policy, with technical capacity and performance evidence still pending.
No measurement or security certification follows from agreement.

## Exact portable wrapper and retained boundaries

Agreed top-level required members, no others:

```json
{
  "format": "dtw.project-backup",
  "formatVersion": 1,
  "authoredVersion": 1,
  "createdAt": "2026-11-09T12:00:00.000Z",
  "snapshot": {
    "project": { "id": "example", "name": "Example" },
    "groups": [],
    "tokens": []
  }
}
```

`createdAt` is generation time, canonical UTC `YYYY-MM-DDTHH:mm:ss.sssZ`, with valid
calendar fields and date round-trip validation. It is not revision priority or proof
of independent recovery; do not reject a valid date merely because it is in the
future. `snapshot` uses exactly the agreed field/value/admissibility matrix, not
prototype samples. Optional authored fields remain absent or exactly present;
missing definition differs from typed-unassigned, null differs from absence.

Emit compact JSON plus one LF, fixed schema-member order as documented in the
coverage matrix and wrapper above; preserve array order and every string/code unit.
Decoder accepts object-member order/ordinary JSON whitespace variations. Deterministic
snapshot serialization is used for size accounting, not identity, hashing signatures
or a claim that regenerated backups have the same timestamp. Filename suggestion:
`dtw-project-backup-<UTC timestamp>.json`, MIME `application/json`; no raw project ID
in a filename. File extension/MIME are hints; inspect actual content.

Storage-layout version 1 remains separate: `projects` record has required
`recordVersion: 1`, `authoredVersion: 1`, `revision`, `lastAcceptedCommand` and
`snapshot`. Internal revision, command and incarnation strings are generated,
nonblank and at most 128 UTF-16 code units; this does not constrain authored opaque
IDs. `lastAcceptedCommand` is required and has exactly `commandId`, `operation`,
`result: {entityKind, id}`. Closed operations/results: createProject/restoreProject →
project; createGroup/renameGroup → group; createColorToken/reviseColorToken → token.
All have one result (no absent/null result); result IDs retain authored exact strings.
No draft/candidate/history payload. Require
record key equals `snapshot.project.id`. Database incarnation lives in the separate
metadata store. An empty Projects catalogue is derived, not a stored authored array.
Exact internal operation vocabulary follows existing named operations plus restore;
no generic command registry. Runtime record validation must cover these fields too.

Portable backup excludes recordVersion/revision/incarnation/command metadata,
selected token, activation/display preferences, paths, diagnostics/caches, previews,
drafts/forms and app/package version. Restore creates fresh local concurrency
metadata. Snapshot schema version is independent of app version and database layout;
keep that codec host-independent for a later Electron file adapter.

## Decoder sequence and dependency rationale

JSON permits implementations to vary on duplicate member handling, and interoperability
uses UTF-8. Our stricter duplicate and encoding policy is intentional.
[RFC 8259](https://www.rfc-editor.org/rfc/rfc8259)

1. Check file byte length before allocation; bounded byte reading also verifies the
   actual length. Reject UTF-8 BOM and invalid byte sequences rather than replace them.
   Use the standard fatal TextDecoder behavior; no legacy-encoding guesses.
   [Encoding Standard](https://encoding.spec.whatwg.org/#dom-textdecoder)
2. Scan with depth/token/raw-token ceilings before a recursive visitor/parser can
   traverse excessive nesting. Comments, trailing commas, empty document, multiple
   roots and any scan/parse error reject whole. Never use a parser's fault-tolerant
   partial result as a successful project.
3. Maintain a separate Set of **decoded** property names per object; `"id"` and
   `"\u0069d"` collide. Reject duplicates before assignment. Use null-prototype
   intermediate maps/own-property checks and explicitly constructed known-field
   records. No untrusted object spread/merge, inherited-property lookup or reviver.
   Unknown structural keys such as `__proto__` reject as unknown members, while the
   same text as an opaque ID/name/value remains accepted unchanged and indexed by Map.
4. Check wrapper/version and closed shapes recursively using an explicit work stack.
   JSON numeric tokens occur only in version metadata and reference indices: require
   canonical nonnegative safe-integer lexical form, not `1e0`, `1.0`, `-0` or a rounded
   oversized integer. All authored Decimal values remain strings. Keep null/boolean/
   array/object/string types strict; distinguish own absence from undefined/null.
5. Enforce size/count budgets while traversing; then ownership/kind-scoped identity,
   authored-value invariants and the agreed diagnostic allowlist. Do **not** evaluate
   an AST to decide whether its grammar/data can be safely retained. No normalization
   by constructors: hue wrapping or changed Decimal text must fail exactness checks,
   not overwrite the candidate. Preview only after complete admission; acceptance
   still rechecks identity/revision atomically later.

Recommend `jsonc-parser` **3.3.1**, a deliberately pinned source baseline, not a claim
it is latest. Its official manifest declares MIT and no production dependencies;
its tagged API provides scanner/visitor and strictness options. Configure
`disallowComments: true`, `allowTrailingComma: false`, `allowEmptyContent: false`.
Duplicate sets, depth/work limits and safe materialization are **our responsibilities**;
the package does not supply the project's strict schema or duplicate policy.
[Tagged manifest](https://raw.githubusercontent.com/microsoft/node-jsonc-parser/v3.3.1/package.json),
[tagged API](https://raw.githubusercontent.com/microsoft/node-jsonc-parser/v3.3.1/src/main.ts)

Use the scanner before bounded visitor parsing; avoid `parse()`'s default object
construction and `getNodeValue()` as schema validation. Abort on the first fatal
error/budget violation, not by merely skipping callbacks while parsing continues.
Qualify that behavior against tagged implementation and adversarial fixtures before
use. Library/main-branch packaging changes are not evidence for this pin.
[Tagged implementation](https://raw.githubusercontent.com/microsoft/node-jsonc-parser/v3.3.1/src/impl/parser.ts)

Strings are exact **JavaScript UTF-16 code-unit sequences**. Do not Unicode-normalize,
trim, casefold or reject empty/whitespace IDs. Escaped lone surrogates such as
`"\ud800"` remain supported; serialize them as JSON escapes so UTF-8 encoding does
not replace them. Invalid UTF-8 bytes differ from valid JSON containing an escaped
lone surrogate. Lexical escape spelling is not authored data: `"a"`/`"\u0061"`
represent the same string. No new identifier/name grammar is selected.

## Agreed admission ceilings — qualification pending

All maxima inclusive. Reject the entire candidate at first exceeded ceiling;
identify limit/path/observed count and preserve prior retained state plus draft/form.
These ceilings are agreed for qualification, **not yet measured safe capacity**.

**Earlier user capacity feedback — 9 November 2026:** the user said the proposed limits
are more than sufficient and that exceeding 1,000 tokens would already be an
exceptionally large real-world design system. Keep the 10,000-token defensive
ceiling; this feedback is not a request to lower it, a benchmark qualification,
or by itself agreement to F-1/F-2/F-3/F-5. The subsequent explicit agreement above
adopts all five policies and the qualification plan.

| Resource | Agreed ceiling and precise scope |
| --- | --- |
| Incoming backup file | 16 MiB = 16,777,216 bytes, including whitespace/wrapper. No decompression. |
| Snapshot size | 8 MiB = 8,388,608 bytes in deterministic compact UTF-8 JSON of the snapshot; same accounting for retained admission and backup generation. Wrapper headroom keeps a generated compact backup under the input ceiling. |
| Projects | 25 project records per browser database, counting unsupported/unreadable records too; replacement does not add a project. Check atomically with insertion, not from a filtered/stale catalogue; never delete records to create capacity. |
| Entities per project | 10,000 tokens and 2,000 groups; each count independent and includes incomplete/diagnostic records. |
| JSON/container depth | 128 simultaneously nested object/array containers for the incoming wrapper, root depth 1; snapshot-relative maximum 127, snapshot root depth 1. Retained records apply the same snapshot-relative 127 ceiling (record root plus snapshot gives 128); metadata is separately shallow. Check before parser recursion. |
| Parsed nodes/tokens | 500,000 JSON lexical tokens per input, including punctuation but excluding whitespace; 200,000 semantic JSON values per snapshot (each object/array/scalar counts once, keys not values). Every raw JSON numeric token is at most 16 ASCII code units and must pass the canonical safe-integer rule before acceptance; no other numeric-token class is permitted. |
| String size | Each decoded string/key at most 65,536 UTF-16 code units; sum of decoded snapshot keys and string values at most 4,194,304 code units, counting repeats. No narrower ID limit. Raw JSON string token at most 393,218 code units including quotes (six escaped characters per decoded unit plus quotes). |
| AST | At most 32 nested expression nodes on any operand path; 1,024 operand nodes per assignment (root expression, nested expressions and every literal/reference/context leaf count); 100,000 across a snapshot. Shared references are not expanded for admission counting. |
| Ordered collections | At most 256 shadow layers per value, 256 font-family entries per literal and 128 segments per valuePath. This preserves order, not truncation. |
| Decimal | At most 4,096 ASCII digits per canonical Decimal string (sign/dot excluded), all numeric string fields including color/hue/alpha/composite/AST leaves; no minimum magnitude, Number coercion or calculation input cap. |

The starting envelope is engineering judgement for a desktop workbench handling
small-team token systems: use about 100 tokens as a typical qualification fixture
and 1,000 as an exceptionally large real-world fixture, following the user feedback.
The 10,000-token/2,000-group ceilings provide defensive capacity headroom, not an
expected product workload or a claim such systems are realistic. The 8 MiB snapshot
cap bounds candidate/old snapshot/string/parser copies, but **does not** mean only
8 MiB heap use; several copies and object overhead may coexist. The 16 MiB file cap
allows whitespace/escaping/wrapper overhead, not twice as much accepted authored
data. String/depth/collection/Decimal ceilings bound individual pathological cases
that byte size alone misses; AST work guards handle reuse amplification separately.
These are reviewable starting tradeoffs, not empirically optimal constants.
Twenty-five maximum snapshots imply up to **200 MiB of authored serialized data**
for same-record catalogue listing. That is deliberate qualification pressure on
S-1's simple listing strategy, not evidence the proposed list latency is feasible.
If it fails, bring measured design/limit options back rather than silently changing
coverage or claiming a fast catalogue from tiny fixtures.

Use the same admission/serialization policy for candidate commands, restored files,
retained loads and generated backups. Never accept a normal authoring command that
creates an unbackuppable snapshot under these limits. Count the accepted candidate,
not only the edited token. Before accepting a normal command or retained candidate,
validate the **complete generated portable wrapper** against all output lexical,
container-depth, raw-string/numeric-token and total-file limits too, in addition to
semantic and snapshot-size limits. In particular, 200,000 semantic values and an
8 MiB snapshot do not alone prove the emitted wrapper fits 500,000 lexical tokens.
Use the actual deterministic encoder or a proven budget-equivalent counting encoder;
validate/count before durable acceptance, without evaluating authored ASTs. Generation
and restore must use the same definitions. Fixed wrapper keys/version values and the
24-character createdAt form contribute to the full-wrapper count; do not account
only for snapshot tokens or treat metadata as free. Incoming noncanonical whitespace/
escape spellings separately consume the incoming file/raw-token budgets.

IDB objects have no input lexical spelling, but their emitted full-wrapper projection
must pass these exact output constraints before admission. Retained record metadata
has its separate closed shape/bounds and is not backed up. Qualify the counter against
the actual writer and decoder at boundaries, including wrapper overhead. Reject
cycles/accessors/non-plain/sparse/nonserializable objects at the typed adapter boundary;
no getters execute during validation of untrusted in-memory inputs.

**Agreed compatibility consequence:** these limits newly exclude some
otherwise valid long strings/Decimals, large projects, long paths/collections and
ASTs. They do not reinterpret that data as malformed domain semantics. An existing
or injected over-budget source stays untouched with explicit unsupported-size and
backup-refused feedback; no partial recovery/backup claim. If preserving every
previously unbounded valid input is required, revise the numbers/policy before
agreement. Do not silently raise/lower limits during implementation to get green.

## Dated scale references and interpretation

Supernova's [State of Design Tokens 2024 publisher PDF](https://cdn-assets.supernova.io/marketing/State-Design-Tokens-2024.pdf)
reports bands of 51–150 tokens (28.3%), 151–300 (26.4%) and more than 1,000 (8.5%)
on page 11. These figures were checked through indexed publisher-PDF text; direct
retrieval of the 22 MB document failed. Survey methods/representativeness and the
counting distinction between authored tokens, theme variants and generated output
are not established here. This is dated 2024 evidence, not a current 2026 industry
baseline or proof that one token-count definition applies to DTW.

Figma's [18 February 2026 prepared remarks](https://s206.q4cdn.com/973901332/files/doc_financials/2025/q4/Figma-Q4_25-Prepared-Remarks.pdf)
report that small Primer updates affect more than 7,400 design tokens (page 5).
This is an official company report, not an independent count; the counting method
is unspecified, so 7,400 cannot be equated with unique DTW authored identities.
Larger reported systems exist; that does not change this user's intended workload:
100 typical, 1,000 exceptionally large, 10,000 defensive capacity. No caps or
unmeasured performance assumptions change because of these references.

## Derived-operation ceilings — agreed policy, qualification pending

[Decimal arithmetic](../../src/domain/decimal.ts) constructs BigInts and powers of
10; [color construction](../../src/domain/color-literal.ts) normalizes hue similarly.
[Expression resolution](../../src/domain/token-resolution.ts) uses an iterative work
stack but has no current expansion/output budget. Small authored DAGs can revisit
subgraphs many times; repeated scaling can expand derived digits. AST/input limits
alone therefore cannot certify bounded runtime work.

The agreed qualification policy is:

- Per root inspection: 10,000 scheduled evaluation/alias/field tasks, counted **before**
  pushing/traversing, including revisits. Per requested inspection batch: 50,000 tasks;
  don't resolve every project row merely to render a catalogue.
- Derived Decimal intermediate/output maximum: 8,192 digits and fractional scale
  at most 8,192. Conservatively bound aligned coefficient/result lengths and powers
  before allocating BigInts or `10 ** scale`; refuse before an over-budget operation.
- Derived path/diagnostic text per item: 65,536 UTF-16 code units; at most 1,000
  diagnostic items per requested display report, with an explicit incomplete-report
  notice if more exist. Structural rejection/ownership checks must still scan all
  bounded records; display truncation is not proof that a candidate is admissible.

Do not evaluate on decode or persist a failed/approximate result. A supported valid
AST that exceeds an evaluation budget remains retained and backed up exactly;
report evaluation/representation unavailable with a resource reason. Do not label
it invalid-expression, flatten it, auto-rewrite it or reject restore for that reason.
Normal authoring's existing namespace/reference validation remains unchanged;
performance guards may return explicit operation-unavailable without accepting a
partial edit. Pure operations without budgets remain a separate future API question;
this increment must not silently change universal Decimal semantics. Budget injection
or another small domain/application policy boundary needs implementation review,
not a generic evaluation framework. Timers alone cannot interrupt synchronous BigInt
work; counters/preallocation bounds must do the primary work. Resource-unavailable
feedback/incomplete reports are new interactions beyond V2; return their identified
design to the user/designer review loop before implementation. This proposal does
not treat those interactions as already agreed.

## Versions, errors and migration

Accept only exact `format/formatVersion/authoredVersion` above and supported retained
record/database versions. Unknown or older versions reject whole with the observed
version, leaving source/storage unchanged; no speculative migration, auto-upgrade
of authored data, “try parsing anyway”, or database reset. App version is not a
compatibility gate. A future migration is separately reviewed and preserves an
independent backup before destructive conversion. Missing/blocked IDB upgrades
remain explicit Retry/close-other-tab states under agreed storage policy.

Distinguish encoding/syntax/duplicate-member, unsupported format/version/field,
shape/identity/ownership, resource admission, supported diagnostic, retained-write-
readback failure and unknown outcome. Error payloads carry bounded location/code;
do not echo megabytes of raw data into alerts/logs. Future diagnostic names in this
proposal are categories, not invented existing domain codes. At the original planning handoff no implementation, parser installation, tests,
benchmarks or browser observations had been performed. Subsequent Stage A evidence
is recorded separately under the qualification plan; production implementation is
not authorized.

## Stage A evidence and remaining qualification

The [developer qualification report](../../output/increment-007-stage-a/report.md)
and [independent review](../../output/increment-007-stage-a/independent-review.md)
record executed mechanism/resource subsets, source identities and explicit gaps.
The synchronous maximum codec exceeded the 100 ms main-thread target; a dedicated
worker trial is a feasibility option, not an agreed production scheduling choice.
Actual lifecycle, Safari normal-profile/restart/maximum stress, native OS picker
and production-wide integration remain unqualified. Policy agreement is unchanged;
implementation authority and final contract/design agreement remain separate.
