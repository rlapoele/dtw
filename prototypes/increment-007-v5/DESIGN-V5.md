# Increment 007 V5 — description wrapping

**10 November 2026 · isolated user-review prototype · baseline `a3ede16`.**
The user approved the [assessment direction](../../docs/increments/007-description-wrapping-and-source-selection-design-assessment.md)
and requested the prototype first, before further qualification. Native-selection
usability assessment is approved separately but held until the user sees/reviews V5.
No analyst review, final design/contract agreement or production implementation is implied.

## View and compare

Open [V5](http://127.0.0.1:4228/) in a fresh tab. The server remains available.
Select **color / prose**, then use the external **Description wrapping** selector
to compare **Candidate · break-all** with **Current · wrap-anywhere**. The same
authored data, selection and drafts remain mounted. The selector is outside the
product; it is not a proposed setting. The candidate is the initial choice.

The difference is visible in the full inspector and the two-line row previews:
the candidate splits ordinary words at line ends, including short words. The
current rule more often keeps complete prose words together. This is a real
reading tradeoff, not evidence that the candidate improves performance.

Select **lines** for explicit newlines/blank lines, **unbroken** for a modest URL,
**cjk** for Japanese/Chinese punctuation, **rtl** for Arabic/Hebrew mixed with Latin,
and **marks** for combining marks/emoji sequences. Descriptions are 100–275 UTF-16
units, with actual line breaks and combining code points. **unassigned** retains
the missing-description fallback. These are synthetic readable design specimens,
not the 65,535-unit failure fixture or a language-wide typography certification.

At compact width the existing list stacks above the inspector; both panes retain
their original scrolling. Scroll the inspector to reach all components, alpha,
metadata and source. Its complete description is not line-clamped.

## Exact scope and preservation

- App is a current production copy with only TokenList/Editor/type imports redirected.
- TokenList is a current production copy with only its two description utilities
  changed from `wrap-anywhere` to `break-all`; both retain `whitespace-pre-wrap`
  and `line-clamp-2`. Complete authored strings remain in both DOM variants.
- Editor is the V4 full production-based copy with only its description utility
  changed to `break-all`. All current controls/content and the complete description remain.
- V4 **ExactSource.tsx is byte-identical**. Its no-wrap viewport CSS, pause notice,
  applied/read-only revision context, Preparing and local failure/Retry are carried
  forward unchanged. No source-selection affordance, instruction or interaction is added.

The CSS exception for the external comparison selector scopes the old wrapping
behavior to the three description `break-all` nodes. It does not change source,
names, values, identities or production CSS. Existing V4 harness/source geometry
exceptions remain unchanged. Owned controls, semantic theme and Heroicons are reused.
[Exact copy diffs](../../output/increment-007-description-wrapping-design/copy-diffs.patch)
identify the source delta; reuse does not certify exhaustive runtime parity.

## Evidence and limits

[Observations and images](../../output/increment-007-description-wrapping-design/observations.md)
record disposable Chromium design smoke at 1600×1100 and 760×900. Exact description
DOM comparisons pass for all six specimens, both row variants and full inspector;
computed whitespace/clamp remain intact. Selected Tab/Shift+Tab/Enter navigation
and literal draft `0.` preservation through the comparison and mode switch pass.
No console errors/warnings were observed. Isolated strict typecheck/build pass.

No performance measurement, native-selection usability assessment, clipboard,
Find, Safari, actual zoom, AT or stress qualification ran. Ordinary 100 ms and the
agreed exceptional-source 250 ms/task /5,000 ms/action scope, authored budgets,
support targets, remaining mechanisms and Stage B are unchanged. Source exactness
in these small DOM descriptions is not native selection or clipboard qualification.

Production, old prototypes/evidence and dependencies remain unchanged. The capture
browser is closed; the separate coordinator/user review tab and V4 session are untouched.
Stop for the user's V5 review before further work; no analyst review is authorized.

To serve/check with existing dependencies:

```sh
./node_modules/.bin/vite --config prototypes/increment-007-v5/vite.config.ts
./node_modules/.bin/tsc -p prototypes/increment-007-v5/tsconfig.json
./node_modules/.bin/vite build --config prototypes/increment-007-v5/vite.config.ts
```

Port 4228 is strict; do not terminate another owner. Cache/build output is isolated
under `/tmp/dtw-increment007-v5-*`. Suggested human-owned commit:
`design: prototype description wrapping comparison`.
