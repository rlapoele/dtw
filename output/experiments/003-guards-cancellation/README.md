# Bounded guard/cancellation research v1

See [the report](../../../docs/increments/003-guards-cancellation-report.md) for authorization, expected outcomes, scope and limitations. These scripts are disposable research and are not approved application code.

Run from repository root, without installs:

```sh
python3 output/experiments/003-guards-cancellation/reference.py
node output/experiments/003-guards-cancellation/probe.mjs > output/experiments/003-guards-cancellation/run-summary.json
python3 output/experiments/003-guards-cancellation/analyze.py
shasum -a 256 -c output/experiments/003-guards-cancellation/SHA256SUMS
```

`reference.json` records 80/160/240-digit independently rebuilt constants/results and exact Fraction linear controls. `results.json` records all named/scalar observations and signals, explicit statuses, constructor-valid outputs only for accepted coordinate-reading samples, diagnostic rejected candidates, exact binary rational controls and labeled synthetic injections. `analysis.json` records finite metrics and precision-stability evidence, which is not proof. `SHA256SUMS` freezes source/results/report and read dependencies; it excludes itself.
