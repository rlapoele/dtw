# Increment 007 — V4 analyst design review

**10 November 2026. Layout/notice consistent; no blocking design finding identified.**
The user approved V4 **for analyst review only**, after committing `42feef7`.
This is a bounded consistency review, not final design/contract agreement,
implementation review, performance qualification or authorization to implement.
V4 supplements V3 revision2; no retention/recovery obligation is replaced.

## Snapshot and evidence

- Clean review HEAD `42feef7e3fce8de420cb5d8c6bb4fdd573e19217`.
  [V4 notes](../../prototypes/increment-007-v4/DESIGN-V4.md) identify production
  source baseline `e2a3534`; current production source was compared directly.
- [Frozen manifest](../../output/increment-007-exceptional-detail-design/manifest.json)
  SHA-256 `00adc180f205819cc8549ce5223832886fe023139ac2a302071a4606bfe70ae0`:
  all 25 file hashes and byte sizes independently match. Frozen preparation labels
  describe the earlier handoff; the subsequent approval for this review is recorded here.
- Expected behavior derives from agreed [E-1–E-4](007-exceptional-detail-policy-and-performance-proposal.md),
  [Draft AC-18/20/24](007-local-retention-and-backup.md), B/P/S/F policies,
  architecture, presentation conventions and existing inspector/list semantics.
  Inspected App/Editor/ExactSource/main/CSS and saved screenshots 02/05/06/09/10.
- [Designer observations/screenshots](../../output/increment-007-exceptional-detail-design/observations.md)
  are attributed evidence: disposable Chromium at 1600×1100 and 760×900, small fixtures,
  selected keyboard/focus, failure/retry and draft-preservation paths. Their isolated
  type/build checks are not analyst execution. No new browser, test/build, source-size
  stress, clipboard, existing-session operation or artifact edit occurred.

## E/AC dispositions

| Basis | Source/layout assessment | Disposition and limit |
| --- | --- | --- |
| E-1; AC-18/20 | Existing Metadata / All authored data native disclosure remains; complete `JSON.stringify(source,null,2)` plain pre, no soft wrapping or alternate viewer. CSS sets local overflow auto, max-height min(24rem,50dvh), no minimum; short source remains natural. | Consistent. Screenshots show modest short/two-axis/compact specimens and preserved surrounding pane/footer. No complete-source native Find/AT/reflow/zoom or exceptional-size layout pass follows. |
| E-2/3; AC-18/20/24 | Generic notice is visible before activation and associated with summary via aria-describedby: “Opening very large exact source may briefly pause this view.” Open content identifies Applied token / Revision / Read only, Preparing, then Complete authored source. | Consistent presentation. It introduces no classifier or cap and promises no synchronous Cancel. 160/687/3148-unit fixtures are all ordinary; 900 ms simulation and indefinitely held mode are external review tools, not 5 s compliance. |
| E-4; AC-7/8/21 | Local failure says authored data unavailable, applied data/drafts unchanged; explicit Retry only. Retry returns focus to summary; no modal, auto-retry or partial success. Source status is local polite live feedback. | Consistent source-level behavior. Actual timeout/publication/error/focus and native access need qualification. A spinner cannot make native layout/selection/Find/copy interruptible. |
| AC-9/11/20; E applied-source scope | Raw source captures selected applied Token/revision, not renderer draft. Close invalidates queued generation; token/revision/simulation change closes and resets; unmount invalidates pending callback. Delayed callback checks generation and native open state before publishing. | Coherent for declared small simulation. Designer records raw Red `0.` and reference draft surviving fail/retry while source stays applied. No worker/incarnation/project-result framing, real CAS revision, late-message proof or accepted-state persistence is implemented/qualified. |
| AC-18/20; existing005/006 | Current App copy changes only Editor/type imports. Editor copy changes only ExactSource import and replacement of the raw authored disclosure. Production TokenList, ColorFields, controls, session, navigation and CreationDialog are reused unchanged. | Strong source-level preservation for this supplement; no missing baseline section/control found. No exhaustive runtime parity, responsive/accessibility or repaired opaque-ID handling claim. Existing limitations are not new proposed behavior. |

The complete baseline retains row swatches, collision-safe labels, descriptions,
layer/type and exact authored/reference summaries; inspector components/alpha/eligible
sliders, five views/two RGB scales, raw drafts, Apply/Cancel, applied/draft header,
Currently applied, description/eligibility/metadata/role/parent, resolved/trace/
diagnostics and regeneration footer. Ordinary missing-description fallback and actual
invalid-draft field/error association remain binding AC-18/20 checks, not waived by
reuse. The source diff gives no permission to simplify these during worker integration.

## Qualification limits and next gate

No actionable material layout/notice correction is required by this review. E-policy
is agreed; **V4 review approval is not final visible-design agreement**. Identify this
frozen supplement alongside V3 revision2 for final user review when its remaining
gates are disposed. Do not edit the frozen prototype or automatically create a V5.

The [Draft](007-local-retention-and-backup.md) now binds E's exact classification:
ordinary 100 ms; only explicitly opened applied authored/identity text **>65,536**
serialized UTF-16 units and its scoped native full-source actions may use maximum
individual task 250 ms / action 5,000 ms. No exception for list/editable strings,
automatic resolved/trace tabs or background work; no new authored-data ceiling.
Historical 120/128 ms failures remain failed under the then-current 100 ms gate,
not retrospectively qualified under E.

Next work requires separately authorized focused qualification, not production:
65,535/65,536/65,537 and relevant admitted large-source boundaries, full equality,
actual native selection/copy/Find/AT/zoom/scroll, truthful failure and both-engine
safety/task evidence under E-4. Remaining projection/live-fence/whole-wire/derived-
guard and other mechanism/support gates remain in the owning plans; Safari defensive
supervision is not waived. Complete product/list/inspector/command regression belongs
Stage B after final contract/design agreement and separate implementation authority.
No new policy choice, dependency or experiment is introduced by this review.

Checks: frozen hashes/bytes, source diffs, screenshots/attributed observations,
prose/local links and `git diff --check`. These are design/document checks only.
