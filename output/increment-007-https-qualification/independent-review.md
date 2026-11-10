# G-05 HTTPS qualification — independent review

10 November 2026. **Pre-exposure review ready: no actionable finding identified.**
This permits coordinator consideration of the already authorized bounded runtime step;
it is not passing HTTPS evidence, production acceptance or browser support certification.
No cloudflared executable, browser or public tunnel was started by this reviewer.

## Expectations and frozen snapshot

Derived expectations before source inspection from AGENTS.md, workflow/role briefs,
current status, scoped HTTPS authorization, agreed B-1–B-5, Draft AC-1–24, G-05 and
historical frozen worker report/review. The code-review-and-quality skill supplemented
review within the assigned read-only boundary. No memory-derived project facts used.

Reviewed baseline `cc8eb9ef437e8d40f511525ca48642491db40991` and the exact 25 files in
`pre-exposure-manifest.json`, SHA-256
`9cd1daf5ce793781655cc4d6d8adf51d9508e4aa7592a12bccdcde213d37d8db`.
All lengths/hashes independently match. Coordinator authorization/status edits are
outside that manifest. Only this report and reviewer-owned probes were written.

## Independent pre-exposure evidence

- Publication is 12 files, 20 explicit routes, 108,964 bytes. Every copied codec,
  fixture and vendor file equals its declared original. MIT notice is retained;
  extensionless aliases correspond to actual vendor imports. Public bytes contain
  no absolute user path or private report/data/config references. Reviewed sources
  contain no remote import, upload or evidence endpoint.
- Server binds 127.0.0.1 only, checks regular files/symlinks/hashes before binding,
  then serves immutable in-memory bytes by exact request-target lookup. No filesystem
  request resolution, listing, write endpoint, proxy or repository-root serving.
  Only GET/HEAD are handled; body-bearing requests are refused. CSP/nosniff/no-store
  are served. `/blocked` changes the document worker directive to `'none'`.
- Frozen server tests independently pass (2/2) after reviewed loopback-only host
  execution. Initial sandbox listen EPERM is an environment restriction, not a pass.
  Tests cover all published bodies/MIME/CSP, mutation/path/private/query refusals,
  startup symlink refusal and changed-byte refusal.
- Own 22 extra loopback probes pass: private preparation/manifest/report paths,
  double/encoded traversal and separators, absolute targets, query/fragment variants,
  extra methods, body-bearing HEAD and negative-route CSP. Own server closed normally.
  Source/raw result: `reviewer-probes/pre-exposure.mjs` and `pre-exposure.json`.
  Initial probe expected 404 for a backslash target; Node correctly refused it with
  400. Reviewer expectation was corrected to accept either refusal; reviewed source
  was unchanged. No public exposure or other local server was involved.
- Small worker cases use native strict-hint transaction completion/explicit abort,
  exact readback, two-worker locks, transferred byte buffers and the fixed coverage
  fixture. File restore only accepts those exact bounded synthetic bytes into a
  fresh own database. Capability-negative is explicitly injected. Actual CSP denial
  and file/browser behavior remain runtime obligations, not source-review passes.

## Executable provenance independently resolved

Fresh official release metadata was fetched using normally validated HTTPS from
[Cloudflare's exact release API](https://api.github.com/repos/cloudflare/cloudflared/releases/tags/2026.10.7).
It independently confirms the official asset URL, archive digest and release-body
executable checksum. No candidate execution occurred.

- Archive SHA-256 `3586ccf397e98e5f437e60e7c307ca6ac463e110580503af8bb8e6f9ebf831bd`
  matches the API digest. Archive contains only `cloudflared`.
- Extracted archive member equals the staged executable byte for byte; executable
  SHA-256 `2136431d5eb467bf447d2ee514b713e192719b143aec1d9e09bf7dc290d5bb12`
  matches the release-body checksum. The archive/executable mapping discrepancy is
  resolved by actual bytes rather than waived.
- Native read-only `codesign --verify --strict --verbose=2` reports valid on disk and
  satisfies Designated Requirement. Native metadata identifies Cloudflare Inc.
  `68WVV388M8`, Developer ID Certification Authority and Apple Root CA. Sandbox
  verification first reported invalid/unavailable authority; the separate reviewed
  host verification succeeds without any trust change. Neither command runs the binary.

[Official Quick Tunnel documentation](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)
confirms account-free temporary URLs and shutdown ending access. Proposed explicit
empty task configuration, minimal child environment, no auto-update and exact owned
loopback target are consistent with the authorized scope. Runtime must verify supported
flags before invocation and preserve ordinary TLS validation; stop on unexpected behavior.

## Runtime review still required

Coordinator go remains necessary. Recheck exact hashes before first execution. Capture
normally trusted Chrome/Safari top-level HTTPS, actual edge certificate/chain and browser
security evidence, final origin/build/profile, served document/module/negative-route
headers and byte hashes. `isSecureContext` alone is insufficient. Cloudflare edge HTTPS
and its loopback HTTP origin hop must remain explicit.

Run only the selected small native worker/strict-complete+abort/locks/exact-transfer/
file subset and fail-closed CSP/capability negatives. Actual completed download and
selected bytes are separate evidence from gesture; programmatic file assignment is
File/Blob processing, not native picker operation. No stress, rendering, lifecycle,
shared sessions, trust/Keychain/hosts/DNS change or TLS bypass. Stop only owned resources,
verify former URL no longer serves the harness and local port is closed. Preserve failed
attempts and provide a new frozen evidence manifest for independent result review.

No G-05 closure, whole-browser qualification, B-4 timing amendment, Stage B acceptance,
contract agreement or production implementation follows from this pre-exposure verdict.

## Phase 2 frozen result review — 10 November 2026

**No actionable finding identified in the executed scoped subset. G-05 remains partial.**
Reviewed developer manifest SHA-256
`1204a56678a7af7a909548db46efca8f18218a64a416c7cb72358c1bb9bc085c`,
42 files. All lengths/hashes independently match; all 25 pre-exposure entries remain
unchanged. Expectations remain the originally scoped trusted-HTTPS native mechanisms,
actual CSP/fail-closed negatives, exact synthetic files, honest profile attribution and
owned-resource shutdown. No browser, tunnel, native workload or network rerun was needed.

Independent offline assertions and raw/source inspection:

- Compared all 20 captured edge routes directly with publication manifest hashes,
  lengths, MIME and full CSP, nosniff/no-store/referrer headers. All match; responses
  are 200 with no Location. The same 12 public files remain the reviewed bytes.
- Checked stored DER certificates using native X509 parsing: hostname matches the
  actual public origin, validity includes execution time, each captured child verifies
  against its captured issuer. Raw TLS records have authorized true and ordinary
  verification enabled. This validates consistency of the recorded chain; the earlier
  normally validated handshake supplies trust-anchor validation. Chrome CDP records
  secure state, no issue IDs and modern TLS. Safari returned `acceptInsecureCerts:false`
  and loaded the same top-level HTTPS/module paths. Runner source contains no TLS/CSP
  bypass. Safari's certificate viewer was not inspected; the report correctly separates
  independently captured client chain from Safari's observed successful normal TLS load.
- Inspected both Safari attempts and Chrome raw native event traces. Committed strict
  writes reach request success then complete; explicit abort follows request success,
  and source checks exact unchanged prior snapshot/revision. Lock records show owner
  true, contender false, then acquisition after release. Transfer records show detached
  renderer sender, exact regenerated bytes and returned hash. These are small native
  mechanism observations, not broader durable storage or performance guarantees.
- Independently regenerated `coverage()` through the frozen codec: 10,372 bytes,
  SHA-256 `06b15cbb8bad0815c90f88b665a53e10bcd2ef8624e3804f64dca31257757118`.
  Actual retained Chrome download and still-present owned Safari `.json` copy both
  match those bytes. Chrome raw download events include completed state. Both final
  file cases report the same selected hash/length, fresh own database, strict-complete
  readback and identical regenerated bytes. This is filesystem-backed file assignment
  through native browser input, not an actual OS picker test or independent-origin restore.
- First Safari GUID-file selection failure remains visible in archived runner/result.
  Corrected runner changes only local input argument/copy; public assets are unchanged.
  The actual successful selected `.json` bytes match independently. Filename, extension
  and path changed together, so the underlying rejection cause remains unisolated, as
  reported. Safari disk download was not executed; Chrome's download cannot replace it.
- Both engines record an actual enforcing worker-src violation for `/blocked`, worker
  error and fail-closed state. Capability-negative events are explicitly injected.
  Source inspection confirms no storage dispatch on either negative init path and no
  synchronous/volatile fallback; zero writes is not inferred solely from a JSON label.
- Runtime log names the exact approved local target/config, temporary Quick Tunnel,
  checksum and no-auto-update/loopback-metrics settings. It records graceful shutdown,
  tunnel server stopped and metrics stopped. Recorded teardown shows dedicated port
  ECONNREFUSED, known final owned processes ESRCH, and normally validated former HTTPS
  URL returning 530 / `error code: 1033` rather than harness content. Both Safari runs
  record own-session deletion. No source evidence shows shared Safari quit or user
  profile/trust settings manipulation. These are reviewed shutdown records, not a new
  independent live shutdown experiment.

Probe/source and assertion summary: `reviewer-probes/result-review.mjs` and
`result-review.json`; all assertions pass. The pre-exposure tests/probes above remain
credited because server/assets did not change. Final `git diff --check` passes.

### Gate disposition

Credit trusted Cloudflare-edge HTTPS worker/storage/locks/transfer/File-processing and
actual CSP-denial mechanisms on the identified native Chrome and isolated Safari
WebDriver contexts. Safari automation is not normal persistent-profile HTTPS retention;
historical user-assisted Safari restart/picker observations remain separate. Native
Safari HTTPS disk download, actual OS picker selection/cancel, Q-18 storage-persistence
policy observations, complete normal-profile qualification, actual delivery-host checks
and production Stage B/integrated independent-origin backup/restore remain unqualified
by this batch. None is silently waived. No Mac trust change was needed by the reviewed
route; browser→edge HTTPS and tunnel→loopback HTTP remain distinct.

This closes the identified bounded HTTPS mechanism evidence subset, **not all G-05**.
B-4 timing is unchanged without explicit user amendment. Contract remains Draft;
implementation, rendering/other gap experiments and supported-browser/release claims
are not authorized or established by this review. No new experiment is requested merely
to restate these honest remaining limits.
