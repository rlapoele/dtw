# Independent phase-1 diagnosis review — 10 November 2026

Phase 1 supplies a verified, narrowly scoped basis for preparing one corrected readiness attempt. It does not establish HTTP/session readiness or G-02 supervision. A new stable source/offline preflight remains required before that attempt creates a session.

## Snapshot and independent checks

Reviewed baseline `0f1c1a9` and manifest `phase-1-manifest.json`, SHA-256 `fb1a8e49b88785a2403dcf09a95f70b5d7bb7b21f326c4f1cef933583517cb6e`. Independently verified all six entry hashes, including the preserved old helper. Reviewed diagnostic source, offline tests and raw `driver-diagnostic.json` against the finite batch and G-02 requirements. Independently reran syntax validation and three offline tests: all pass. No reviewer native launch, HTTP request, session, browser intervention or production change occurred.

## Evidence and interpretation

Before launch, exact numeric-port lsof returned exit 1 with empty stdout/stderr. The own `/usr/bin/safaridriver -p 59466` spawn event identifies PID 41128. Two original PID-filtered lsof invocations return exit 1 with empty streams and no timeout. The second unfiltered exact-port query identifies one unique PID 41131 and loopback listeners only; same-UID ps and executable-mapping receipts identify Apple's WebDriver HTTPService XPC component. The own launcher had no exit event at that point.

The only recorded signal is SIGTERM to newly spawned PID 41128. Its observed exit is code 0, signal null; subsequent exact-port lsof reports empty endpoint. No XPC PID signal, HTTP or browser command exists in the inspected source. This records endpoint lifecycle correlation with the owned launch; it does not prove XPC process termination.

Requiring launcher/listener PID equality therefore rejects this actual observed topology. The original historical failure lacks equivalent native receipts, so its precise cause remains unverified. [Apple's current primary documentation](https://developer.apple.com/documentation/webkit/testing-with-webdriver-in-safari.md) mentions an XPC-hosted local server within historical Sierra setup instructions. That context is consistent with the observation; the local native receipts establish the topology here.

## Conditions for the corrected attempt

The proposed positive proof chain is suitable for one separately bounded attempt: previously unused exact loopback port; live owned launcher; one unique same-UID expected Apple XPC executable corroborated by process and mapped-image evidence; refusal on inconsistent, failed, timed-out or ambiguous observations. Names, PPID 1 or an arbitrary PID alone cannot establish ownership. Retain proof before HTTP, session or window actions and preserve raw command/exit/cleanup receipts. Signal only the owned launcher; no XPC, Safari.app or shared-window intervention.

Phase-1 launcher stdout was ignored, while stderr was piped. Raw command stdout/stderr are preserved, but launcher stdout availability is not claimed. The corrected attempt must capture and checkpoint both launcher streams, with explicit truncation flags if bounded. This is a requirement for new preparation, not a reason to rerun phase 1.

The new preflight must check the actual guard and refusal cases, finite G-02 control/probe inventory, exact-window ownership, same pending execute, independent lock-release witness, first-unexpected-result stop and bounded cleanup after the 12-second work settles. No automatic 65-case storage run or native retry follows. No actionable claim correction is required in the frozen phase-1 report.
