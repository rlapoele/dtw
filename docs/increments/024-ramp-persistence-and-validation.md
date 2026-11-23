# Increment 024: metadata, history, backup and validation draft

**Technical contract proposal — 23 November 2026. No implementation authorized.**
Parent: [Draft 024](024-color-ramp-authoring.md), especially AC-13–18 and D5.
This preparation implements no application behavior. It expresses the already-agreed
user behavior through the existing snapshot, retention and history mechanisms.
The [numerical draft](024-ramp-numerical-specification.md) owns calculation policy;
[incomplete composites](../design-tokens/incomplete-composites.md) owns field absence.

## Minimal saved metadata

Add one optional, typed `colorRamp` property to an ordinary namespace group. Do not
introduce a new group kind, generic extension registry, secondary palette store or
live computed token values. Proposed version-one payload:

| Field | Meaning |
| --- | --- |
| `schemaVersion: 1` | Shape of the ramp metadata |
| `recipe: { id, version, intensity }` | Initial id `single-seed-oklch`, numerical policy version `1`, intensity `retained` or `restrained` |
| `seed` | Exact prepared color literal, including its authored space/components/alpha |
| `targetGamut` | `srgb` or `display-p3` |
| `seedPosition: { mode, label }` | `auto` or `manual`, plus the accepted numerical label as a string |
| `members` | Ordered entries `{ tokenId, colorOrigin }`, with origin `generated` or `manual` |

Derive count from the member array and expected labels from the versioned recipe.
Do not store count, paths, generated-color caches, completeness, reference-impact
lists or duplicate member descriptions/colors/protection. Tokens remain the owners
of their literal values and descriptions. Reuse `token.authoring.regeneration`
(`allowed`/`protected`) for protection, preserving existing data outside ramps without
adding controls there. The origin flag records authorship, never protection.

The recipe seed is independent of the current literal on the seed-position member:
a manual edit to that token must not silently change the recipe seed. The member
origin changes in the same operation as a manual color edit. Reset clears only that
member's Manual status/color; description and protection remain as agreed. New
members start Generated/unprotected. Unknown recipe ids/versions do not cause colors
to be regenerated or rewritten.

Validate a known metadata shape strictly: required/allowed keys, literal shape,
finite version integers, valid enum values, bounded recipe identifiers, and 2–20
ordered member entries with unique ids. Apply existing retention resource limits;
use the existing internal-identifier text bound for recipe ids. Do not add arbitrary
future fields or new storage budgets. A token can belong to at most one ramp.

Cross-record checks verify members exist in this project and group, have their
expected numerical names, are Primitive color tokens with one unconditional literal,
and have no duplicate ownership. The selected seed label must exist and be valid.
Nonmember group children are not implicitly adopted. Group rename retains identities.
Missing/incompatible members are semantic ramp diagnostics, not a reason to reconstruct
a token or delete metadata. Known incompatible ramps remain inspectable but cannot
be edited or regenerated. Duplicate token/group identities and malformed payloads
remain structural admission failures.

## Session-only draft continuity

Open a ramp session against a project revision with the saved ramp/member/reference
baseline. Maintain a small in-memory registry keyed by numerical label, initialized
from saved members, with identity, saved/draft-only origin, latest description and
protection. Retain entries through temporary absence until Apply/Discard. This is
session state, not metadata on removed tokens or a persisted tombstone collection.

Every confirmed count change builds fresh replacement colors and clears prior
remapping choices. Reuse an entry's identity/latest description/protection if its
label returns; never restore its prior manual color. A first-seen label receives an
identity once for that session. Saved members still exist in the baseline until
Apply and are not mistaken for unrelated name conflicts. Recompute reference impacts
from baseline authored references and the proposed membership; returning saved targets
retain their original connections rather than previous remapping choices.

Build the final snapshot with only final members. Remove absent saved members after
all affected reference occurrences are resolved; never persist absent draft-only
members. Apply drops the registry and begins from the new saved state. Discard drops
it and restores the saved snapshot. Reference choices are session-only decisions;
only the resulting authored references/omissions are saved.

## Application operation and history boundary

Use coarse application commands, not chained commits of token edits:

- `createColorRamp`: group, member tokens and metadata in one candidate; receipt
  identifies the new group.
- `applyColorRamp`: all member additions/removals/edits, metadata and individually
  accepted reference changes in one candidate; receipt identifies the ramp group.
- Ordinary ramp-step color/description/protection edits update the owning token and
  any required member origin metadata in the same candidate, under existing session
  ownership. Never open a second saving editor alongside the ramp draft.
- The scoped missing-shadow-color and typed-unassigned-color refill operations use
  an ordinary token receipt and one history boundary, preserving other data. No
  generic composite editor or general patch-command API is introduced.

The application recomputes identity, eligibility, collisions, reference occurrences
and candidate validity against the reviewed revision. UI-generated arrays are not
trusted replacements for the project snapshot. Occurrence addresses identify owner,
assignment, layer/field and original target in that revision. Stale choices cannot
be replayed against a different revision; preserve the draft and use existing recovery.

Pass the complete candidate through existing retained write/acknowledgement logic:
one command identity, one expected revision, one atomic snapshot and one receipt.
Keep lock/ownership, uncertain-write reconciliation and readback behavior intact.
Do not emit partial successes or independent member writes.

Reuse existing before/after snapshot history. One substantive Create/Apply produces
one entry; metadata-only changes count. Compare authored content before lifecycle
stamping, so unchanged drafts produce neither a write nor a history entry. Undo/Redo
restores authored content, ids, metadata and reference omissions together without
regenerating colors. Undo/Redo retain project-level receipts, so undoing creation
does not require a receipt target that has just been removed. Existing lifecycle/
revision handling still applies. Draft edits
create no entries. Existing session lifetime, history size/byte limits, eviction
notices and uncertain-write handling remain unchanged. Backup does not acquire
session history or drafts. No new journal or per-ramp history mechanism is needed.

## Versions and backup

Propose **authored data version 4** for both optional ramp metadata and omitted known
composite fields. Retain strict readers for versions 1–3; no metadata inference from
a group name and no permissive reinterpretation of historical composite fields.
Historical complete snapshots load unchanged. New successful writes and emitted
backups use version 4; reading alone neither migrates the retained record nor creates
history. No-op Apply also does not write merely to upgrade a version.

Keep the backup envelope at `formatVersion: 1` and the existing retained-record
version-1/2 shapes and version-2 history receipts. Extend the closed command receipt
vocabulary for the new operations; do not add another envelope or database version.
Readers explicitly admit authored version 4 before interpreting its fields. Older
builds refuse it rather than silently dropping metadata or missing fields. A future
unknown authored version or ramp schema version is likewise refused with original
storage/backup input untouched; no downgrade/rewrite is offered.

For a **known ramp schema with an unknown recipe id/version**, preserve the payload
and authored tokens exactly. Inspect the ramp and show unsupported recipe; disable
its editing/regeneration. Unaffected work remains available through the validation
policy below. No generic opaque future-schema preservation machinery is introduced.

Exact backup includes the full authored snapshot: group metadata, seed, identities,
member origins, token protection/descriptions/values, and explicit composite omissions.
It excludes draft registries, accepted-choice UI state, generated previews and session
history. Reuse current staged restore, identity/conflict checks and atomic replace.
Restore does not regenerate, repair or fill missing values. Existing restore history
reset remains unchanged. New-version decode/encode must preserve authored values;
exactness does not mean retaining the original JSON whitespace or old wrapper version.
These are canonical backup rules, not new DTCG/export-adapter guarantees.

## Baseline-aware validation integration

Separate structural admission, namespace/reference integrity, ramp eligibility, and
resolution/completeness. The current authoring `accept` rejects any namespace/reference
diagnostic in the entire candidate. Replace that gate with a bounded baseline-aware
check for authored changes; do not weaken the domain validators or storage decoder.

1. Admit the baseline and candidate structurally. Malformed fields, unsupported schema,
   invalid present values and duplicate identities remain blocking. Known incomplete
   composites and typed-unassigned tokens are valid authored structures.
2. Run the full namespace/reference validators on both snapshots, plus existing
   introduced-collision checks and the ramp eligibility checks. Use uncapped results,
   not the UI diagnostic list or resolved colors as a reference inventory.
3. Reject every new or changed integrity diagnostic. An existing diagnostic may carry
   forward only when its exact identity and the authored semantic fields causing it
   remain unchanged. Comparing only diagnostic counts or code strings is insufficient.
4. For reference issues compare owner/assignment/occurrence, target id, expected type,
   value path and the relevant target existence/project/type facts. For namespace
   issues compare entity ownership and relevant parent links/existence. For cycles
   compare the canonical directed cycle and involved authored reference/parent edges;
   changes to those edges require resolution, not grandfathering. Normalize cycle
   rotation only; do not equate different directed cycles. Descriptions and unrelated
   metadata are not causal fields and need not block otherwise eligible edits.
5. All created/changed ramp metadata and member operations must satisfy the relevant
   ramp invariants. Existing incompatible/unsupported ramps may carry forward only
   with their problematic membership/recipe facts unchanged; do not enable their
   editing or silently fix them. Ordinary group rename preserves metadata and stable
   associations. The per-member rename/move/delete/layer/reference restrictions remain.
6. Missing assignments/fields and their downstream unavailable resolution are not
   automatically integrity errors. Explicit accepted Unspecified removes the direct
   edge, preserves the chain elsewhere and permits the disclosed incomplete result.
   Wrong-type references, cycles and malformed present fields still block as above.

Example: a loaded ramp references a missing member. Keep that ramp disabled and show
its diagnostics. Editing an unrelated valid token may save if the existing missing
member/reference facts are unchanged and no new error appears. Changing another
reference to a different missing target fails even if the error count stays the same.

Implement diagnostic identity/causal comparison as small helpers over current known
codes, not a generic validation framework or persisted exception list. An unrecognized
code fails closed for authoring until its rule is defined. Commands that create new
snapshots without a baseline must satisfy full integrity. Staged restore and Undo/Redo
retain their existing roles: restore admits known structured data with truthful
semantic diagnostics, and history restores its own previously admitted snapshots,
including their existing diagnostic baseline. Do not substitute renderer-supplied
snapshots or rerun ramp generation during Undo.

## Source findings and evidence boundary

Preparation base: `3dc1f328c90ba74ff6af51908f23649093f91c58`.

- [Token groups](../../src/domain/token-group.ts) currently have no ramp metadata;
  token authoring already carries regeneration protection.
- [Codec](../../src/application/retention/codec.ts) admits versions 1–3, validates
  closed shapes separately from graph diagnostics, and owns backup admission.
- [Record decoder](../../src/application/retention/record.ts) and
  [ports](../../src/application/retention/ports.ts) have closed operation/version
  vocabularies that need coordinated updates.
- [Retention service](../../src/application/retention/service.ts) already compares
  authored content before date changes and coordinates one accepted snapshot.
- [History](../../src/application/retention/history.ts) stores whole before/after
  snapshots and restores prior diagnostic baselines; no ramp-specific mechanism needed.
- [Authoring](../../src/application/authoring.ts) currently rejects all candidate
  namespace/reference diagnostics. The baseline-aware rule above is a required change,
  not existing behavior. [Reference validation](../../src/domain/token-reference-validation.ts)
  already identifies token, condition, field/layer and target for supported references.

Future essential checks: legacy and v4 round trips; unknown-version refusal without
mutation; unknown-recipe isolation; repeated replacement identity/description/protection
continuity; one-entry Apply/creation/refill Undo/Redo; atomic reference omissions;
unchanged-error unrelated edit versus changed-target/error rejection; stale revision
and uncertain-write behavior. Reuse existing seams with small representative cases.
No retention stress campaign, broad browser qualification or general migration framework.

No new user behavior decision was required for this proposal. The final consolidated
analyst review must check its consistency with accepted UX, numerical and composite
contracts before final user contract agreement and implementation authorization.
This document itself is preparation, not independent verification of implementation.


Preparation used approximately 10 of a 12 aggregate-minute document/source-check
ceiling (analyst 4, coordinator 6), zero repairs. Changed Markdown/local links and
whitespace checked, then checks stopped. No production code, dependency changes,
tests, numerical runs, browser work or retention qualification. All earlier stopping
decisions remain intact; these are future implementation checks, not a restarted
qualification allowance. Leave staging, committing and pushing to the user.
