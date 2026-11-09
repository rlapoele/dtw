# V3 revision 2 — coordinator observations

9 November 2026. Base `52e8009` plus the source identified in the
[revision-2 manifest](manifest.json). This is a prototype correction authorized by
the user, not production implementation or renewed analyst review. The original
V3 review manifest and earlier evidence remain historical and unchanged.

## Fresh browser checks

Coordinator operated three fresh in-app browser tabs at the isolated V3 origin.
No existing tabs were present; none were reloaded. All data used were disposable
fixtures. The clean Normal workspace is left visible for user review.

- Local New token → uncertain result: exact `  Recovery color  ` name and multiline
  description survive. Create and Cancel are blocked while Check retained result
  and Review before leaving are reachable inside the modal. Failed Check preserves
  fields and presents still-unconfirmed feedback.
- Local departure review initially focuses Stay here. Escape returns to the exact
  read-only name field with focus and whitespace intact. Simulated safe departure
  returns to Projects with a no-replay explanation; no additional token appears.
- Exit-not-yet-safe fixture disables Leave project and gives a truthful reason.
- Later-confirmed acceptance closes the form and shows one added `Accepted once`
  row. Later-confirmed rejection keeps name/description in the editable form and
  enables Create again only after the result is known.
- Normal list retains swatches, descriptions, primitive/semantic layer and color
  type, and full literal/reference summaries.
- Inspector has three component inputs and sliders plus independent alpha, five
  color-space choices and both RGB scales. Byte scale shows integer values and
  exact normalized approximation notes; passive OKLCH and byte view changes restore
  exact red `0.231372549019607843` without enabling Apply.
- Editing red shows Draft feedback; cancellation preserves the applied value.
  Alias selection exposes target choices and an identity-linked two-step resolution
  trace. Authored/resolved tabs, Applied value badge, resolved data and diagnostics
  are reachable. Description, layer/role, Currently applied, metadata, raw authored
  disclosure and regeneration footer remain present. Inspector scrolling reaches
  the remaining fields and metadata.
- No captured warning/error logs in the three fresh tabs. Isolated strict
  TypeScript and Vite build pass (724 modules), independently rerun by coordinator.

## Limits

These are scoped prototype checks, not independent analyst closure of V3-R1,
production parity certification or storage/concurrency qualification. No actual
IndexedDB, worker, lock, decoder, durable receipt or safe-exit protocol runs.
Inspector source comparison against production is recorded in the designer's
fidelity matrix; not every eligibility/error/trace branch was exercised at runtime.
No new compact/zoom/screen-reader/cross-engine checks or production tests were run.
Production, dependencies, V1/V2 and Stage A are unchanged.

## Images

- [Reachable dialog recovery](dialog-recovery.jpg)
- [Workbench/list/inspector](workbench-inspector.jpg)
- [Lower inspector and metadata](inspector-metadata.jpg)

Review this identified correction with the user before renewed analyst review.
