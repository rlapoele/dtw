# Increment 007 — retained workbench checkpoint

10 November 2026. This checkpoint adds existing authoring and selected inspection;
backup/restore, complete recovery/lifecycle/departure and performance/native-source
qualification remain incomplete. It is not full Increment 007 acceptance.

R1–R7 from the first review were addressed: closed named input/output validation and
request correlation, descriptor-safe retained records/nonblank internal metadata,
schema-member writer order, valid-wrapper duplicate/numeric regression cases,
incarnation/revision/full receipt readback checks, full uncertain receipt matching,
and application-owned detached candidate staging. Regression tests exercise the
reviewed counterexamples; independent recheck is pending.

The retained default workbench reuses existing Editor/ColorFields/owned primitives,
with asynchronous Apply acknowledgment, native encoded reference choices, separate
worker context/row-batch/selected-inspection/exact-source reads, staged ordinary rows,
All content and group inspection. Display DTOs preserve type/value kind/metadata;
full authored AST/composite payloads are not attached to selection. Worker-side
resolution has optional work/arithmetic guards; unavailable derived state remains
separate from authored data. Exact source is a separate on-demand V4 disclosure.
Legacy App remains only as a transitional injected-storage fixture composition;
retiring/migrating it remains part of final cleanup, not a production fallback.

Checks: full `npm test`: 41 files / 1,009 tests pass. `npm run build` includes all
strict typechecks and production Vite build and passes. Two SSR assertions changed
for intentional encoded native option values and closed-disclosure source deferral;
readable target labels and selected identity checks remain.

Actual native Chrome 157.0.8103.50, disposable owned profile, loopback
http://127.0.0.1:4327: nine small functional checks pass, zero page errors:
empty catalogue, retained workbench creation, token creation, exact color Apply,
raw literal/source-switch preservation and Cancel, complete applied source opening,
group creation/rename, All content group identity inspection, reload/reopen exact
color/description. Receipt and screenshot are under
`output/playwright/increment-007-implementation/slice2-*`.

Two prior small runner attempts stopped on selector mistakes (duplicate New token
button and wrong Red label); their receipts are preserved separately. They are not
application or stress-performance verdicts. The successful corrected runner uses
five-second locator timeouts and an external owned-browser 30-second stop. No stress
case, clipboard operation, native picker, HTTPS, manual Firefox or full native-source
performance result is claimed. Full backup/restore and recovery remain next.
