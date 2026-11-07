# Culori qualification research

See the [report](../../../docs/increments/003-culori-qualification-report.md) for scope, interpretation and limits. This is disposable Node/Python research, not application code or a production dependency selection.

From the repository root:

```sh
python3 output/experiments/003-culori-qualification/fetch.py
node output/experiments/003-culori-qualification/probe.mjs > output/experiments/003-culori-qualification/run-summary.json
python3 output/experiments/003-culori-qualification/analyze.py > output/experiments/003-culori-qualification/analysis-summary.json
shasum -a 256 -c output/experiments/003-culori-qualification/SHA256SUMS
```

Fetch uses isolated `/tmp`, SHA-512 verification, safe extraction, and no lifecycle scripts. No npm install is needed. Set `CULORI_PACKAGE_ROOT` to an equivalent verified package extraction if required; registry provenance metadata still reads the fixed isolated path. Do not regenerate the frozen earlier references. Their equation module is imported read-only with Python bytecode writes disabled.

`results.json` distinguishes raw conversions, endpoint-only adapter candidates, historical guard classifications, actual callback traces, analytic mixing fixtures and lower-level transfer diagnostics. `analysis.json` asserts every core/special/guard expected observed status and complete finite metrics; the tiny-red HSL unexpected refusal remains a required-fixture failure, despite successful harness reproduction. Missing powerless hue substitution is restricted to its justified position. There is no overall strict-pass classifier. `package-source-sha256.json` identifies the verified source without committing a vendor tree. `baseline-checks.json` records prior frozen-manifest verification.
