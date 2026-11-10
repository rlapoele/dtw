# Increment 007 token-description boundary qualification

Node-only research for the [agreed 10 November amendment](../../docs/increments/007-format-decoder-and-resource-proposal.md#token-description-amendment--10-november-2026).
This is a new isolated adapter over the frozen Stage A codec. It does not implement
Increment 007 or change production admission. No Zod or other dependency is added.

## Scoped criteria

- **C1:** each present token description accepts 1,023/1,024 decoded UTF-16 units
  and rejects 1,025 through snapshot encoding and independently constructed raw JSON
  decoding, across the supported authored-state fixture matrix.
- **C2:** preserve exact untrimmed Unicode, whitespace, JSON-escaped text and optional
  absence versus empty text; use decoded units, without normalization or truncation.
- **C3:** project/group descriptions retain their 65,536-unit generic string ceiling.
- **C4:** reject the whole mixed candidate with an invalid last token and preserve
  candidate objects, input bytes and synthetic caller prior state.
- **C5:** retain strict decoder rejection and safe preflight rejection of malformed
  objects/accessors; do not invoke getter values when adding the field guard.

The adapter calls frozen `preflight` before its encode guard, then delegates encode.
Decode delegates the strict decoder before checking token descriptions. Malformed
shapes remain the base codec's responsibility. `scan` is lexical inspection only,
not admission. Proxies remain outside the frozen synthetic harness's claims.

## Run

From the repository root, using the already installed Stage A dependency:

```sh
node --test research/increment-007-description-boundary/description-boundary.test.mjs
```

No install, root script, browser, storage, retained data or retired harness changes
are required. The import uses Stage A's installed `jsonc-parser` 3.3.1 UMD entry.
If that ignored dependency is absent, this run is unavailable until the existing
Stage A environment is restored; this research introduces no dependency package.

See the [report](../../output/increment-007-description-boundary/report.md) for
results, coverage limits and the exact hashed snapshot. Codec-only rejection does
not establish application atomicity, authoring validation, retained loading,
backup download or restore UI behavior. Performance is not measured.
