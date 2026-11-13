# Increment 009 — Namespace naming policy proposal

13 November 2026. Documentation-only analyst recommendation for the
[draft contract](009-workbench-usability-and-component-boundaries.md).
No application behavior, prototype or retained data changed.

## Agreement and scope

**User-agreed direction:** remove whitespace everywhere, including inside names;
lowercase namespace names at creation/rename; normalize to NFC; preserve accents;
prevent case-insensitive duplicate paths; preserve existing data and access.

**Recommended details, pending agreement:** the exact removal set, default Unicode
casing/comparison algorithms and pinned Unicode baseline below. These implement
the direction precisely but must not be presented as already user-approved.

Names here mean token and namespace-group local names, across types and definition
completeness. “All content” does not authorize transforming project display titles,
descriptions, layer metadata, semantic roles or unrelated labels. Project creation
retains its separate required-name/exact accepted-text policy. Existing creation
and group rename are in Increment 009; future token rename/move must obey the same
invariant without adding those editing capabilities now.

## Recommended versioned policy

Identify the proposal as **DTW namespace naming v1 / Unicode 17.0.0**. This is a
pinned baseline, not a claim that 17.0.0 is the latest Unicode release. A future
Unicode upgrade can change accepted names or collision sets and therefore needs
explicit review and legacy handling. Do not let the host browser's Unicode data,
user locale or runtime update silently redefine the contract. This document does
not select an implementation library or authorize a dependency.

### Removal set

Remove every occurrence of the 25 code points with `White_Space` in the pinned
[Unicode 17.0.0 property list](https://www.unicode.org/Public/17.0.0/ucd/PropList.txt):

```text
U+0009..U+000D  U+0020  U+0085  U+00A0  U+1680  U+2000..U+200A
U+2028  U+2029  U+202F  U+205F  U+3000
```

Recommend also removing these three explicitly named invisible spacing controls:
`U+200B ZERO WIDTH SPACE`, `U+2060 WORD JOINER` and
`U+FEFF ZERO WIDTH NO-BREAK SPACE / BYTE ORDER MARK`. They are **not** members of
Unicode `White_Space`; their inclusion is a product-policy recommendation to
address invisible spacing. The [Unicode layout-control descriptions](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-23/)
explain their breaking/joining functions and distinguish script joiners.

Call the resulting 28-code-point set `R` for this proposal. Removal means deletion,
not trimming, collapsing, replacement with hyphens or insertion of separators.
It applies to the beginning, middle and end of a local name.

Do not remove every `Cf` or default-ignorable character. Preserve combining marks
and `U+200C ZERO WIDTH NON-JOINER` / `U+200D ZERO WIDTH JOINER`, which can carry
orthographic meaning. Broader control-character, bidirectional-control, invisible
character and confusable policies remain deferred. This bounded rule does not
promise to eliminate every invisible or visually identical name. Punctuation and
target-specific escaping/identifier rules are not settled here.

### New stored local name

For a submitted raw local name `s`, recommend:

```text
storedName(s) = NFC(defaultFullLowercase(NFC(removeR(s))))
```

`defaultFullLowercase` means Unicode 17.0.0 default full lowercase, including
contextual rules, under [§3.13.2, R2](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/).
Use locale-independent behavior. NFC is canonical normalization; there is no
blanket compatibility normalization, accent stripping, ASCII conversion or
transliteration. Final NFC makes the stored result canonical after casing.

Reject an empty result, a failed/invalid transformation or a result exceeding
existing applicable input/data limits. Do not truncate or silently substitute
characters. Preserve the user's raw form text after rejection. Recommend showing
the transformed value before submission so removal and casing are visible; this
interaction recommendation still needs an identified design treatment and user
agreement. Do not silently rewrite input while the user types.

### Path equality key

For each actual local-name segment `s`, recommend a derived comparison key:

```text
segmentKey(s) = NFD(defaultFullCaseFold(NFD(removeR(s))))
```

This uses [§3.13.5, canonical caseless matching D145](https://www.unicode.org/versions/Unicode17.0.0/core-spec/chapter-3/),
with default full case folding from [CaseFolding 17.0.0](https://www.unicode.org/Public/17.0.0/ucd/CaseFolding.txt):
use common/full (`C` and `F`) mappings, excluding locale-specific Turkic (`T`)
mappings; unmapped characters remain unchanged. The key is derived, never a
replacement stored name or stable identity.

Compute this key directly from each segment's actual text, including legacy text;
do not first run the stored-name lowercase pipeline as the definition of equality.
Lowercase alone, uppercasing, locale collation and `Intl` locale settings do not
define this comparison. Full folding may equate spellings whose stored lowercase
forms differ. Canonical decomposition preserves accents rather than discarding
them; full folding's specified mappings still apply.

Compare ordered arrays of segment keys within one project, including equal array
length; never join/split rendered paths. Groups and tokens share the namespace
regardless of type/completeness. `["a.b"]` and `["a", "b"]` remain different paths.
Different project identities do not conflict.

## Illustrative consequences, not executed tests

Escapes denote actual code points, not literal backslash text.

| Input or comparison | Proposed result |
| --- | --- |
| `Brand\u00A0Blue`, ` Brand\tBlue ` | Stored `brandblue` |
| `Brand\u200BBlue`, `Brand\u2060Blue`, `Brand\uFEFFBlue` | Stored `brandblue` under the recommended three-extra rule |
| `E\u0301` and `É` | Both stored `é`; comparison equal |
| `é` and `e` | Distinct; accent retained |
| `Straße` and `STRASSE` | Stored `straße` / `strasse`; comparison equal |
| `σ` and `ς` | Different stored letters; comparison equal |
| `I` and `i` | Comparison equal under default folding |
| `İ`, `i`, `ı` | Three distinct keys: `i\u0307`, `i`, `ı` |
| Only characters from `R` | Empty result rejected |
| U+200C / U+200D within a name | Preserved; no blanket format-control stripping |

## Legacy access and affected-path checks

Never rewrite stored legacy names on open, read, inspection, backup, restore or an
unrelated authoring command. Existing uppercase, whitespace, decomposed forms,
empty names or collisions remain preserved under existing supported-data rules;
this policy creates no new whole-load/restore rejection gate.

Use the same comparison key for legacy names only when diagnosing collisions or
checking an affected candidate path. Thus a new `brandblue` conflicts with an
existing `Brand\u00A0Blue`, although the existing name remains exact. Creating a
subgroup/token under a legacy ancestor does not normalize that ancestor. Renaming
a group normalizes only its edited segment; descendant local names and all stable
identities/references remain unchanged, while derived descendant paths are
rechecked. A normalized no-op rename must not claim it repairs legacy data outside
the edited segment.

Prevent newly introduced collisions and added collision members; unrelated
unchanged legacy collisions do not newly block otherwise allowed commands. Retain
other structural/reference validation and command safety. Ambiguous or unavailable
actionable inventory entries still need exact identity/context per AC-3/AC-10 and
[D9-1](009-design-review.md); prevention alone cannot repair historical ambiguity.

## Evidence and next gate

Primary sources above checked **13 November 2026** against the named Unicode
17.0.0 baseline. Current `src/domain/namespace.ts` validates structure only;
`src/domain/token-group.ts` preserves opaque local-name strings and
`src/application/authoring.ts` accepts candidates through project validation.
These are implementation gaps, not evidence that the proposal already ships.

Keep AC-1 through AC-10 stable and add AC-11 for the agreed naming direction plus
the explicitly selected precise policy. Future focused checks should cover the
table, cross-kind collisions, affected ancestry, raw-input preservation and exact
legacy backup/restore. No tests or qualification were executed for this proposal.
The naming details, resulting contract and design remain subject to user agreement;
implementation requires separate explicit authorization. V1 mockups are unchanged.

Documentation/source review used approximately six analyst minutes plus two–three
coordinator minutes, **8–9 aggregate minutes** (estimates) of the separate ten-minute
ceiling, zero harness repairs. This review is stopped. Prior stopped campaigns
remain stopped; no implementation checks have begun.
