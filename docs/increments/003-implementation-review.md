# Increment 003 independent implementation review

8 November 2026. Reviewer role, fresh context. **Final verdict: no remaining required findings after R1 correction and independent recheck.** No production code, tests, requirements, staging or commits were changed by this reviewer.

## Reviewed snapshot and expectations

Base `733db0c57027aa6d077edcc7e52f8ae0b2b30849` plus the uncommitted implementation/new files identified by `output/playwright/increment-003-implementation/review-snapshot.sha256`. All 27 hashes matched before and after review. Authorization-document changes outside that manifest are coordinator-owned. Expectations were formed from the agreed Increment 003 AC-1–AC-8, current 8 November numerical amendment, technical preparation plan, V6 and written creation disclosure before inspecting implementation. Historical internal-stage/cancellation certification was not used as a requirement.

The code-review-and-quality and Playwright skills informed the review. Tests were read before implementation. The reviewer's no-production/test-edit instruction took precedence over the review skill's in-place mutation-test recommendation; no mutation was made. The browser profile `review003` was isolated from the developer's profile. The cached CLI was used without installing packages.

## Initial required finding — corrected

### R1 · P2 · Compare slider eligibility with exact Decimal bounds

**AC-3 and the agreed V6 visual-interval rule.** `src/delivery/ColorFields.tsx:144–145` decides component interval eligibility through `Number(value)`. A canonical exact value just outside a visual bound can round to the bound, producing an apparently valid slider thumb rather than the required unavailable-range explanation. The analogous alpha check at lines 216–218 has the same issue, including invalid alpha just beyond 1.

Reproduction in the production build: create a token, enter Red `1.0000000000000000000000001` in normalized sRGB. The exact field retains that text, but `Red slider` remains present with browser value `1`; no outside-range explanation appears. This was reproduced independently in the real browser. It does not currently rewrite the exact field by itself, but misrepresents visual eligibility and violates the explicit contract.

Use existing exact Decimal comparison for all component/alpha interval eligibility before converting an eligible value to a Number for native range rendering. Check positive and negative boundaries, alpha, hue, OKLAB axes, and byte mode; retain exact text and withhold sliders for outside values. Add a meaningful regression check that distinguishes the exact input from its rounded Number. Recheck that legitimate endpoints still have sliders.

## Independent evidence

- `npm run typecheck`, `npm test`, `npm run build` and `git diff --check` passed. Vitest: **31 files / 887 tests**. Build: 387.95 kB JavaScript (120.99 kB gzip), 39.93 kB CSS (8.95 kB gzip). Node `24.14.1`; reviewed browser Chrome `156.0.0.0` on macOS.
- Numerical tests include exact/18-digit byte arithmetic, ties-to-even, identity/alpha, all directed space pairs, exact neutrals/missing hue, inclusive input cap/text bounds/input underflow, safe tiny-red HSL refusal, the independent 180-case CSS reference corpus, and 100 deliberately calculated round trips. Source inspection confirms no authored clamp or custom color transform equations. Passing tests do not imply universal accuracy for all admitted inputs.
- Production browser: empty exact project name displays `(unnamed project)` without a stored-name fallback; disclosed opaque black creation; root/nested groups; unnamed token; rename changes `root / child / (unnamed)` to `root / renamed / (unnamed)` while its UUID remains `ddbbad07-b52b-4995-b439-31948a88caa7`.
- Exact Red `0.123456789123456789123456789` survives passive OKLAB → HSL → OKLCH → Display P3 → sRGB exploration, Reference/Literal switches and inspector collapse. Invalid raw byte `-` stays correctable, disables Apply and blocks space departure rather than submitting an earlier normalized value.
- Controlled fixture: failed Apply leaves byte-for-byte project readback unchanged and retains draft Red `0.9`. A failed read disables mutation and hides stale editing; successful reading restores the retained draft. Successful manual editing retains `regeneration: protected`, description and semantic role, while the existing alias remains an authored reference.
- An applied alias opens a blank Literal form. Self-cycle rejection preserves readback and exposes `reference-cycle`; error receives focus at `editor-error`. Broken-data one-edit repair remains blocked by unrelated `missing-reference` on `broken-b`, with unchanged readback.
- Failed token creation retains its name and unchanged project readback. A read failure arriving in an open creation dialog retains inputs, disables Create and exposes Retry; recovery permits the retained submission.
- At 320×568, drawer keyboard focus cycles inside the dialog, Escape closes it, the creation dialog fits within the viewport (288×528 at 16,20), its backdrop computes to `rgba(32, 38, 48, 0.333)`, and creation disclosure is present. Repeated Tab with normal focus-settling stays in the create dialog. No horizontal document overflow was observed. At 768×450, departure confirmation traps focus; Keep editing preserves the hidden Literal draft while Reference was active. Desktop 1440×900 was also exercised.
- Actual browser zoom was independently read back in the developer's idle disposable `dtw003-realzoom` profile: fixed viewport 1440×900, app `innerWidth:720`, `innerHeight:450`, `devicePixelRatio:2`, `visualViewport.scale:1`, `scrollWidth:720`. This confirms real browser zoom rather than viewport or CSS emulation. The developer's authoring/error interaction evidence at that setting is supplemental; the reviewer only read back state in that profile.
- Dependency/config inspection confirms pinned selected renderer/Culori packages, MIT declarations for the added direct packages, no production fixture import, scoped production entry and historical-prototype test exclusion. Domain/application source has no DOM/React/Node/Electron or persistence/network imports introduced. No storage/network-write APIs or test suppressions were found in the new delivery/calculation scope. No browser console errors/warnings occurred during the independent fixture checks.

## Coverage and limits

AC-1–AC-8 have independent source/test coverage and the specific browser checks above, subject to R1. The reviewer did not exhaust every responsive combination, independently repeat every possible alias-chain/duplicate-path/rename-failure permutation, or conduct a screen-reader, physical mobile virtual-keyboard, full WCAG or color-management audit. Browser native focus guards can briefly receive focus before returning it inside the dialog; settled keyboard checks passed. The actual-zoom workflow evidence combines independent state verification with developer interaction evidence, not a claim of an entirely separate second full zoom journey. Dependency license declarations are not a legal opinion or a fresh vulnerability audit. No full-domain numerical guarantee is made.

At the initial snapshot, completion was blocked on R1 correction and an identified stable recheck; the recheck below closes that finding. The session-only boundary, missing durable retention/PWA/Electron behavior, and accepted exceptional tiny-red HSL unavailability are deliberate scope, not additional defects.


## R1 correction recheck — 8 November 2026

Reviewed the new stable 29-file manifest `output/playwright/increment-003-implementation/review-snapshot-r1.sha256`, retaining the original manifest unchanged as historical evidence. All 29 hashes matched before and after recheck. The correction changes `ColorFields.tsx` and adds `visual-range.ts` plus its focused test; the component delegates interval classification to existing canonical Decimal parsing/comparison, then uses Number only for an eligible native thumb. No numerical color policy, authored-data or range endpoint changes were introduced.

Independently reran `npm run typecheck`, `npm test`, `npm run build` and `git diff --check`: all passed; **32 test files / 894 tests**. Final bundle: 388.07 kB JavaScript (121.03 kB gzip), unchanged CSS 39.93 kB (8.95 kB gzip). The seven added tests cover exact endpoints, both sides of all six visual intervals, invalid/missing values and text that rounds onto a binary endpoint.

Independent production-browser rechecks in `review003` confirm:

- Original Red `1.0000000000000000000000001`: exact field retained, Red slider withheld. Red `1` restores its slider.
- Alpha `1.0000000000000000000000001`: slider withheld; correction to `1` restores normal eligibility.
- Raw byte Red `255.0000000000000000000000001`: exact raw byte text retained, slider withheld.
- HSL hue `359.9000000000000000000000001`: exact draft text retained, slider withheld; `359.9` restores the slider.
- OKLAB a `0.4000000000000000000000001` and `-0.4000000000000000000000001`: exact text retained, slider withheld; both legitimate `0.4` and `-0.4` endpoints restore it.

**R1 is resolved. No further required findings were identified.** The initial review's coverage limits remain; this is independent review of the identified implementation, not authorization to stage, commit, push, release, persist real project data or advance the next increment.
