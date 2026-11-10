# G-05 isolated HTTPS qualification — developer results

10 November 2026. **Scoped HTTPS mechanisms pass in native Chrome and Safari;
full G-05/browser support remains partial.** Production Increment 007 remains
Draft / Not started. This is isolated synthetic evidence, not implementation,
normal-profile Safari HTTPS acceptance, production decoder or Stage B qualification.
Baseline `cc8eb9ef437e8d40f511525ca48642491db40991`.

## Result and exact limits

Both native engines loaded the frozen same-origin module worker through normally
validated public HTTPS. Small worker-owned native strict-complete/explicit-abort,
Web Lock refusal/reacquisition, exact transferred bytes and real filesystem File-input
restore pass. Actual served CSP denial fails closed in both engines; labelled injected
required-capability denial is separately recorded. Chrome completed an actual native
Blob disk download. Safari restored those exact downloaded bytes from an owned
`.json` copy. **Safari native Blob disk download was not run**: no scoped per-session
download-directory control was established, and shared Downloads/preferences were
left alone. Neither engine's file assignment is an OS picker selection/cancel test.
Prior normal Safari user-assisted evidence remains historical and separate.

The HTTPS host is a temporary **Cloudflare edge**, not a future product host. Browser
→ edge is authenticated HTTPS; cloudflared → dedicated 127.0.0.1 origin is HTTP. The
same exact assets/headers would require requalification at the actual delivery origin.
No normal-profile Safari HTTPS retention, installed/offline mode, production integration,
responsiveness, rendering, crash/restart/freeze, broad concurrency or other gap is claimed.

## Authorization, provenance and immutable publication

The separate pre-exposure review accepted the identified 25-file snapshot. Coordinator
then dispatched Phase 2 within the user's synthetic-only temporary exposure permission.
Before first binary execution, all 25 reviewed hashes and the official candidate binary
hash matched. Actual `--version` returned cloudflared **2026.10.7**, built 30 October
2026; actual help confirms `--no-autoupdate`, `--config`, `--url`, `--metrics`.
See `cloudflared-tunnel-help.txt`, `cloudflared-provenance.json` and `preflight.md` for
both archive/executable checksum mappings and sandbox/native-signature attempts.

Only the **12 reviewed files / 20 exact routes / 108,964 bytes** were published. All
public assets, publication manifest, server and pre-exposure source remained unchanged
throughout. Local-only automation scripts were added; they are not served. Safari's
first runner/result are archived before the bounded local filename/path correction.
`final-integrity.json` rechecks all 25 pre-exposure files plus all 81 Stage A and
115 prior worker files. No production/root dependency/config/test/prototype/old-research
edits, staging, commits, pushes or system/tool installation occurred.

The child environment was constructed with PATH and TMPDIR only, without HOME
repurposing or inherited Cloudflare credentials/config variables. Explicit task config
contained `{}` at `/tmp/dtw-https-cloudflared-config.yml`. Command used only the exact
loopback origin, loopback ephemeral metrics, no-autoupdate and a task-local logfile.
No account/login/service/DNS/hosts/trust/Keychain/certificate/TLS-validation settings
were read or changed. No private project, credential, report or evidence-collection
endpoint was public. Browser evidence was read locally via browser instrumentation.

## Host, TLS and headers

- macOS **27.2 (26B123)**, existing native builds. Native Chrome **157.0.8103.50**,
  new owned normal persistent disposable profile. Native Safari **27.2
  (22625.2.8.11.9)**, isolated WebDriver automation session; **not** a normal-profile
  retention claim. Safari capabilities explicitly return `acceptInsecureCerts: false`.
- Exact origin: `https://hip-exhaust-wash-routines.trycloudflare.com`.
  Dedicated local origin: `http://127.0.0.1:51970`. Tunnel active approximately
  **09:54:06–09:58:11 UTC**, then stopped. No redirect, authentication challenge,
  certificate interstitial or CAPTCHA occurred in the exercised routes.
- `edge-check.json`: ordinary Node TLS validation (`rejectUnauthorized:true`) passes;
  TLS 1.3, peer/issuer chain captured as DER and metadata: `trycloudflare.com`
  (SAN includes `*.trycloudflare.com`) → Google Trust Services **WE1** → **GTS Root R4**
  cross-signed by GlobalSign Root CA. Leaf validity **5 October 2026 20:58:33 UTC–
  3 January 2027 21:58:20 UTC**. No custom CA or verification override.
- `chrome-results.json`: actual native CDP security state is **secure**, TLS 1.3,
  certificate chain present, no security issue IDs, no obsolete protocol/cipher/signature.
  Actual native worker responses include matching TLS issuer/protocol/validity. Safari
  successfully loaded the exact HTTPS origin/modules with ordinary certificate handling
  and insecure acceptance disabled; Safari's own certificate-viewer chain was **not**
  separately inspected. The independent verified-client chain is not labelled a Safari
  certificate-viewer observation.
- All 20 actual HTTPS responses have **200**, exact reviewed body length/hash and
  intended MIME, no Location redirect. `final-integrity.json` also compares all captured
  HTTPS CSP/MIME headers against the allowlist. `/blocked` changes only `worker-src
  'self'` to `worker-src 'none'`. `nosniff`, `no-store` and referrer headers are preserved.

## Executed bounded cases

| Case | Chrome | Safari | Exact scope |
| --- | --- | --- | --- |
| Module worker/capability | Pass | Pass, both attempts | Native worker, top-level secure origin, worker IDB and Web Locks. |
| Native strict write/abort | Pass | Pass, both attempts | `write-issued → request-success → complete`; explicit abort after request success records abort, leaves exact prior snapshot/revision. Acknowledgment follows complete. Strict is a browser hint, not power-loss proof. |
| Worker Web Locks | Pass | Pass, both attempts | Two actual workers, exclusive owner true, contender false, explicit release and contender acquisition true. No lease/steal or race/stress claim. |
| Exact transferred coverage | Pass | Pass, both attempts | Sender ArrayBuffer detaches; frozen codec decodes/re-encodes full coverage; renderer hashes returned bytes. Exact UTF-16 strings/opaque identities/decimal values/aliases/composites preserved by whole canonical equality. |
| Native Blob disk download | Pass | Not run | Chrome browser download-completed event and actual filesystem bytes. Safari Blob link prepared only; no disk-download claim. |
| Real filesystem input restore | Pass | Pass on bounded path correction | Chrome CDP-downloaded GUID file; Safari exact same bytes copied into owned temporary `.json`. WebDriver/Playwright selects an actual filesystem file; worker transfers/decodes/writes into a fresh empty own database, strict-complete readback and identical regenerated bytes. No OS picker operation claimed. |
| Actual CSP worker denial | Pass | Pass, both attempts | Browser's actual `worker-src` violation/error, disabled controls, zero dependent storage calls; no synchronous/volatile fallback. |
| Injected required Worker denial | Pass | Pass, both attempts | Explicitly labelled deterministic injection before creating worker; not an observed missing API. Controls stay disabled, no fallback. |

The exact synthetic backup is **10,372 bytes**, SHA-256
`06b15cbb8bad0815c90f88b665a53e10bcd2ef8624e3804f64dca31257757118`.
The original coverage fixture module is byte-identical; this standalone harness calls
`coverage()` directly. Earlier worker evidence may use a project-ID-adjusted fixture;
its different backup size is not this run's expected artifact. No real project/draft
was read or uploaded. Restore is a fresh own database on this HTTPS origin, not an
independent-origin/product migration or metadata acceptance test.

## Attempts and attribution

- `chrome-results.json`, 09:55:37–09:55:45 UTC: complete scoped Chrome pass. Actual
  download bytes retained under `chrome-downloads/`; native screenshot included.
- `safari-results-attempt-1.json`, 09:56:40–09:56:44 UTC: mechanisms and both negatives
  pass; real-file input rejects Chrome's GUID-named artifact with `invalid argument:
  One or more files could not be selected`. `safari-run-attempt-1.mjs` preserves the
  exact first runner. This failure is not deleted or treated as success.
- `safari-results.json`, 09:57:30–09:57:33 UTC: one bounded local argument correction
  copies the identical downloaded bytes to owned `/tmp/dtw-https-synthetic-<uuid>.json`.
  Actual native file input/worker restore passes, followed by both fail-closed negatives.
  Filename/extension/path correction resolved this attempt; the underlying Safari
  rejection cause was not independently isolated. `status: partial` deliberately
  retains the unexecuted native Safari disk-download path.
- Runners never use ignored HTTPS errors, insecure-certificate capabilities, custom
  CA, browser certificate-bypass flags, CSP bypass, generated File/DataTransfer input
  substitutions or interstitial bypass. No native OS picker/cancel claim is inferred.
- Initial sandbox network/listen/signature limitations and successful reviewed elevated
  checks are preserved in Phase 1 provenance. No browser or network failure was
  suppressed into a pass. This is not a repeated large matrix or performance sample.

## Teardown and review handoff

Known own tunnel/origin processes received SIGTERM at **09:58:11 UTC**. Runtime records
`Tunnel server stopped` and `Metrics server stopped`. Chrome closed its owned browser;
each Safari runner deleted only its own WebDriver session and stopped its own driver,
without quitting shared Safari. At **09:58:38 UTC**, `teardown.json` verifies:

- Exact known tunnel/origin/Chrome/Safari-driver processes are absent (`ESRCH`).
- Dedicated loopback port is closed (`ECONNREFUSED`).
- Former public URL, with normal TLS validation, returns **530 / error code 1033**,
  17 bytes, and no harness. No exposure remains.

`manifest.json` freezes developer-owned source/evidence, excludes independent reviewer
files and itself, and retains the pre-exposure manifest as historical review identity.
All edits now pause for independent **result** review. Passing isolated subsets do not
close all G-05/native-normal-profile/file-product support requirements or authorize
production work. Suggested commit: `research: record isolated HTTPS qualification`.
