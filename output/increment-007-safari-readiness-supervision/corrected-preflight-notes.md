# Corrected route — offline preflight handoff

No corrected driver launch, HTTP request, session, or G-02 block has executed.
Phase-1 source/evidence remain byte-identical to their manifest.

New source:

- `owned-xpc-driver.mjs`: exact previously-unused port; live owned child; unique
  same-UID listener; exact canonical `ps` image and supporting `lsof` executable
  path from either the canonical location or the explicit observed Cryptex path.
  Query failures, timeout, ambiguous listeners, wrong UID/image and early child
  exit refuse readiness. Both launcher streams retain bounded tails and truncation
  flags. Only the launcher receives SIGTERM, with exit/endpoint receipts.
- `gate-only.mjs`: verifies released source hashes before launch; refuses an
  existing native-output directory. Starts one corrected readiness attempt, then
  one session and at most four G-02 controls: one 12-second nonintervention control,
  then three 12-second pending-execute close probes. It imports the old server and
  navigates the old page/worker read-only; it never imports the old runner or case
  inventory. Each control has unique case IDs and lock, with pinned target handle,
  positive native start handshake and independent witness. Close uses a separate
  process, waits at least two seconds after recorder start, and has a three-second
  HTTP deadline. Receipt correlation uses case, lock, actor, worker and worker
  sequence/duration; cross-window recorder delivery order does not establish causality.
- `close-controller.mjs`: checkpoints before/after one exact pinned-window DELETE.
  No window switch, session deletion, process search or Safari termination.
- `gate-evidence.mjs` and focused tests: conservative gate assessment; queued close,
  transport error, natural finish, stale command, retained target or late witness
  stop the gate. No storage qualification follows a pass.
- `corrected-preflight.mjs`: offline checks, syntax checks and hashes covering all
  new source plus borrowed server/page/worker/model/codec/protocol and parser files.

Host checkpoints serialize per file and recover their write queue after an error.
Any first unexpected failure records the original error and stops new work. Only
already-issued finite work is allowed to settle; cleanup does not switch windows
while pending, never retries an attempted target close, and closes only known owned
session handles after exact current-handle verification. Cleanup errors and skipped
ambiguous windows remain explicit. Even evidence-write failures do not prevent the
owned driver stop attempt. No XPC process or shared Safari process is signalled.

Offline tests cover saved native receipts, exact identity rejection, occupied-port
refusal before spawn, early exit, launcher stream truncation, scoped cleanup,
checkpoint failure, raw query exit/timeout evidence, and gate causal/timing checks.
These checks do not claim native preemption or an independent review. The exact
source manifest and offline output are adjacent; coordinator release of its SHA
and independent preflight are required before live invocation. The runner's
`--released-live --preflight-sha=...` switches are a release guard, not permission
to run it automatically.
