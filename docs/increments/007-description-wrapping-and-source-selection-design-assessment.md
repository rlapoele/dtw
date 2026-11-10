# Increment 007 — description wrapping and native source selection

**Designer proposal for user review · 10 November 2026 · baseline `1105d57`.**
Assessment only. Nothing below is adopted. The contract remains Draft / Not started.

## Preferred proposal

Offer **one description-only `word-break: break-all` prototype candidate** for user
review, preserving full text and existing surfaces. Its prose-reading cost needs
explicit acceptance; its performance benefit is unknown. Retain E-1's existing
no-wrap source disclosure, but **do not endorse endpoint click/scroll/Shift-click
as the supported full-source workflow**. It is a possible diagnostic procedure,
with substantial usability and accessibility risks. Keep native access unqualified
unless actual engine-specific evidence establishes a usable complete path.

This responds to [R-1/R-2](007-rendering-and-native-access-disposition.md), within
the [agreed E policy](007-exceptional-detail-policy-and-performance-proposal.md),
[V4](../../prototypes/increment-007-v4/DESIGN-V4.md) and its
[analyst review](007-v4-analyst-review.md). V4 supplements V3 revision 2; retention,
recovery, current list and complete inspector obligations remain intact.

## Evidence and interpretation

The [frozen E-4 report](../../output/increment-007-e4-qualification/report.md) and
[independent review](../../output/increment-007-e4-qualification/independent-review.md)
record **1,797.093 ms RunTask**, including **1,794.751 ms Layout**, during ordinary
65,535-unit fixture/list load, before source opening. This fails **100 ms**; it is
not an exceptional-source 250 ms failure. The cause is unproven. Full unbroken
description text reaches both responsive previews despite visual two-line clamping.
The [production inspector](../../src/presentation/Editor.tsx) also wraps its complete
description. Fixing only a preview would leave that independent ordinary-layout risk.

The tested Cmd+A/C path selected document content and produced unequal source,
selection and clipboard text. That disproves this path, not every native method.
Corrected small-source openings establish exact mounted text for their limited
fixture; they establish neither large-source access nor keyboard/AT usability.

## Description candidate: exact content, changed reading rhythm

Replace `wrap-anywhere` only on the two description preview variants in
[TokenList](../../src/presentation/TokenList.tsx) and the inspector description with
`break-all`, retaining `whitespace-pre-wrap`. Retain two-line list previews, current
wide/compact placement, and the complete unclipped inspector paragraph. Preserve
missing-description fallbacks, font, size, color, spacing and pane geometry. Keep
the exact authored DOM string, spaces and line breaks; insert no hyphens, break
characters, shortened strings or language/length heuristics. Names, identities,
values, source and controls retain their current policies.

Design expectation, **not rendered evidence**: this trades some word recognition
for a consistent way to fit long text. Ordinary prose may split inside words near
the line end instead of moving the whole word. For example, a line ending within
“background” can require the reader to reconnect its fragments. This matters more
in the full inspector than in a short preview, and becomes more conspicuous as
available width shrinks or actual browser zoom increases. A fast result alone
would not justify unreadable prose.

Explicit newlines and blank lines must remain authored boundaries; soft breaks
must remain presentation only. Unbroken IDs, URLs or repeated characters can still
fit without widening the pane, but become harder to scan as meaningful units.
No shortened DOM representation follows from the existing preview clamp.

Do not equate non-Latin text with an unbroken Latin test run. Review CJK text with
punctuation, scripts whose word boundaries are less visibly spaced, and RTL/mixed
direction text. Combining marks and emoji sequences need visual integrity as well
as exact code-unit preservation. Their actual break/shaping behavior remains
unknown here; this assessment makes no language-wide typography claim.

My judgment: this is a proportionate candidate to **show**, because it changes one
presentation rule without changing authored meaning or adding controls. It is not
yet a good enough basis for adoption. The meaningful alternative is to preserve
current word-friendly wrapping and leave the ordinary performance gate blocked.
Different rules for preview and inspector might protect prose, but would leave the
same long inspector description unresolved; I do not recommend that partial repair.

## Native source: retain document text, acknowledge the interaction gap

Keep Metadata / All authored data, its preactivation pause notice, Preparing,
failure/explicit Retry, applied revision/read-only context, and the complete plain
`pre`. Preserve natural short height and bounded no-wrap two-axis scrolling.

The proposed native procedure is concrete: click immediately before the first
source character; scroll the source viewport without clicking other document text;
Shift-click immediately after its last character; invoke Cmd+C. Neither endpoint
selection nor clipboard equality is established. No product instruction should
promise that sequence works until its actual native behavior is observed.

It demands knowledge of a hidden gesture, precise character-edge targeting, and
retaining an invisible anchor while navigating nested scroll areas. Long lines
add horizontal navigation; the last character may require a different horizontal
position from the widest line. At high zoom or with limited pointer precision,
accidental caret placement, an off-by-one boundary or a reset selection can be
hard to detect. A highlighted viewport cannot demonstrate a complete selection.
Adding a sentence of help would improve discovery but would not remove these
motor, verification or keyboard-access costs.

I recommend a later, separately authorized **bounded small-source usability assessment
of native browser selection** before reconsidering E-1. Assess discoverability,
endpoint precision, scroll/anchor retention and correction of a mistaken selection,
as well as equality. Do not escalate to large source if the gesture is already
impractical on small text. The endpoint gesture is not an acceptable supported
workflow on this assessment alone. A pointer pass cannot
establish keyboard or assistive-technology access. Focusability and a read-only
label do not supply a proven local Select All command. No keyboard sequence is
claimed here. If native full-source access remains unusable, return that result
for explicit E-1 review rather than presenting this gesture as sufficient support.

Keeping E-1 and its open gate is the bounded alternative now. The previously tested
textarea has no qualified large-source native path or proven speed advantage.
No Select All/Copy control, textarea substitution, third viewer, paging, clipping
or file-only replacement is proposed or authorized.

## User decisions and stopping point

1. Accept the reading tradeoff enough to authorize a later isolated description
   prototype, or preserve current wrapping and its blocked ordinary gate. Prototype
   review should show ordinary prose, authored newlines, unbroken text and non-Latin
   examples in both previews and the complete inspector before qualification.
2. Choose a later bounded native-selection usability assessment, retaining E-1 and
   treating the endpoint gesture as unproven; this is my preferred next direction.
   Alternatively request explicit E-1 reconsideration now because the gesture's
   interaction burden is unacceptable even if technically exact;
   this document does not select another viewer or waive access obligations.

Any later qualification must separate exact complete selection scope/text/unit
equality from native copy-event-correlated clipboard equality, without trimming or
repair. Keyboard reachability/exit, read-only AT access, native Find at
beginning/middle/end with actual reveal, both scroll boundaries and **actual 200%
browser zoom** remain mandatory. Preserve drafts and focus. Ordinary work stays
100 ms; only explicit applied authored/identity source above 65,536 serialized
UTF-16 units gets 250 ms/task and 5,000 ms/action. Authored budgets do not change.
Safari small activation diagnosis and safe defensive supervision remain separate
pending work, without a support waiver. Later clipboard work needs fresh scoped
authorization; earlier approval covered only the completed run.

## Basis and limits

Applied **design-ui-with-restraint**. Read repository/role instructions, current
chronology, Draft contract, E policy, V4/review, relevant V3 revision-2 preservation,
vision/concept/principles/architecture, visual direction and accepted image,
presentation conventions, open questions, production components and frozen E-4
report/review/native records. Typography and gesture risks above are design
inferences, not new runtime findings. Checked prose, local links and whitespace.
Only this document changed: no prototype/code/evidence edits, execution, tests/build,
browser/session, clipboard, setup/dependency, staging, commit or push operations.
Stop for user review before any prototype work or analyst review of this proposal.

Suggested focused human-owned commit: `docs: assess description wrapping and native selection`.

## User disposition after V5 review — 10 November 2026

The user prefers the current wrapping because splitting words makes descriptions
harder to read. Retain `wrap-anywhere` for description previews and the complete
inspector; do not adopt the `break-all` candidate. Frozen V5 remains unchanged as
the reviewed comparison. This decision leaves the ordinary long-description
rendering failure unresolved; it changes neither authored limits nor the 100 ms gate.

The user authorized proceeding with the previously approved bounded small-source
native-selection usability assessment after this review. It assesses native
selection scope and practical operation, without changing the disclosure/pre or
authorizing larger E-4 qualification, clipboard access, Safari defensive work or
production implementation. Record results separately from this design proposal.

The [bounded assessment](../../output/increment-007-small-source-selection/report.md)
and [independent evidence review](../../output/increment-007-small-source-selection/independent-review.md)
now support two small Chrome pointer-selection positives (160 and 882 UTF-16
units), including one vertical-scroll anchor-retention observation. They do not
endorse the gesture as the supported workflow: discovery and user verification
remain unresolved, and Safari, keyboard-only selection, clipboard and broader
qualification are unrun. The initial ignored mouse-modifier option is explicitly
invalid automation evidence, not a human targeting failure. No further design or
qualification is authorized by this result alone.
