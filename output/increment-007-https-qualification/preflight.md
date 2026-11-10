# G-05 HTTPS qualification — pre-exposure freeze

10 November 2026. **Prepared only; no public tunnel or browser qualification run.**
Developer baseline: clean `cc8eb9ef437e8d40f511525ca48642491db40991` (`dev`).
Only new `research/increment-007-https-qualification/` and paired output files belong
to this developer. Coordinator-owned gap-plan/status edits are excluded. No production,
root dependency/config/test, prototype, original Stage A or worker evidence edits.
No staging, commit, push, tool installation, Mac trust/Keychain/cert/hosts/DNS/browser
TLS setting change. Suggested eventual commit: `research: qualify isolated HTTPS worker paths`.

## Stable review inputs

- [Publication allowlist](../../research/increment-007-https-qualification/publication-manifest.json):
  12 exact files, 20 exact routes, 108,964 public bytes; per-file hashes/MIME/licenses
  and original-copy hashes. It is not itself served.
- [Runtime plan and scope](../../research/increment-007-https-qualification/README.md).
- [Read-only server](../../research/increment-007-https-qualification/server.mjs),
  [negative checks](../../research/increment-007-https-qualification/server.test.mjs),
  [synthetic worker](../../research/increment-007-https-qualification/publish/worker.mjs)
  and [page](../../research/increment-007-https-qualification/publish/page.mjs).
- `pre-exposure-manifest.json` identifies this full developer snapshot excluding
  itself and future independent-review records.

Exact schema/version/retention authority remains agreed P-1–4/S-1–6/F-1–5/B-1–5
and Draft AC-1–24. This isolated small G-05 probe neither implements those criteria
nor claims whole production decoder/command semantics. Frozen coverage bytes are
exercised only after explicit coordinator go. Browser observation and HTTPS trust,
CSP beyond the tunnel, download and chosen-file restore evidence remain **not run**.

## Executed preflight checks

`node --test research/increment-007-https-qualification/server.test.mjs`:
**2 passed**. This checks every allowlisted GET/HEAD body hash, MIME and CSP; private,
traversal, encoded-path, directory, query and absolute URL denial; all mutating verbs;
GET body refusal; startup symlink and changed-content refusal. Loopback only, ephemeral
127.0.0.1 port, closed after tests. See `server-tests.txt`. Initial sandbox attempt
could not listen (EPERM); the reviewed elevated loopback-only run passed. Page/worker
`node --check` passes. No broad root suites are needed for isolated new research.

`frozen-original-integrity.json`: all **81 Stage A** and **115 worker qualification**
manifest file lengths/hashes match. Original manifests match their frozen SHA-256s.
No unchanged historical test/browser matrix was rerun.

## Official temporary binary provenance

Official docs checked today: [Quick Tunnels](https://developers.cloudflare.com/tunnel/get-started/quick-tunnels/)
and [downloads](https://developers.cloudflare.com/tunnel/downloads/).
Their account-free temporary testing URL is public to anyone who knows it; process
shutdown ends access. This is not a hosting/support selection. Explicit authorization
covers synthetic asset transit only. Local browser records are never submitted.

Candidate: [Cloudflare 2026.10.7 Darwin arm64 archive](https://github.com/cloudflare/cloudflared/releases/download/2026.10.7/cloudflared-darwin-arm64.tgz),
from [official release metadata](https://api.github.com/repos/cloudflare/cloudflared/releases/tags/2026.10.7).
Stored only under task-owned `/tmp` paths, no installation or execution.

- Actual archive **19,847,161 bytes**, SHA-256
  `3586ccf397e98e5f437e60e7c307ca6ac463e110580503af8bb8e6f9ebf831bd`,
  exactly matching GitHub API asset digest. Archive has only `cloudflared`.
- Actual extracted binary SHA-256
  `2136431d5eb467bf447d2ee514b713e192719b143aec1d9e09bf7dc290d5bb12`,
  exactly matching release-body checksum. Body labels its line with the archive
  filename, but the published hash actually corresponds to the executable. This
  resolves the initially apparent checksum disagreement without ignoring either hash.
- Initial sandbox `codesign --verify --strict --verbose=2` reported invalid signature
  and `Authority=(unavailable)`. Read-only unsandboxed native recheck: **valid on disk;
  satisfies its Designated Requirement**. Full public signing metadata identifies
  `Developer ID Application: Cloudflare Inc. (68WVV388M8)` → `Developer ID Certification
  Authority` → `Apple Root CA`; arm64, hardened runtime, signed 30 October 2026.
  No trust/certificate state was changed to obtain this result.

`cloudflared-provenance.json` and three archived metadata snapshots preserve attempts.
The two prior metadata checks happened before archive/executable mapping was resolved;
no earlier binary was downloaded. Initial sandbox network DNS failure was followed by
reviewed official HTTPS-only download. No TLS verification bypass was used.

## Remaining release/support gaps and next gate

Independent pre-exposure review and coordinator go are required before even executing
this candidate's help/version or starting a tunnel. Planned commands and explicit
empty task config/sanitized child environment are in the runtime README. Actual flags
must be confirmed against help after go. No user config contents or credentials may
be read; no account/service/DNS/certificate actions. Preserve ordinary TLS validation.

Phase 2 may qualify only the small real HTTPS module-worker, strict-complete/abort,
Web Locks, exact transferred fixture, Blob download/File-input restore and actual
served CSP denial paths in scoped native Chrome/Safari. Record exact builds/profile/
origin and edge certificate trust/chain; local origin hop remains loopback HTTP.
Automation file-input assignment is not native OS picker selection or cancellation.
Do not repeat historical user-assisted Safari picker/restart or introduce other gaps,
stress, hangs, rendering, crash/lifecycle or production changes. Stop own tunnel/server/
contexts and verify unavailable URL/local port at the end. HTTPS and support remain
open until the actual scoped evidence is independently reviewed.
