# R2 causal-timing correction

Before editing, preserved all 24 R1 manifest source files plus its manifest, notes,
offline results and independent preflight under `corrected-r1-archive/`, with an
explicit SHA-256 archive map. The archived manifest remains
`fbba8ba97bab03a54a273192e4a8fc226f3c391b22e9b5a34d21daf24aa418b0`.

Addressed preflight R1: intervention now requires both close response and witness
arrival strictly before `control.commandStartedAt + 12000`, a conservative Node
clock bound that precedes actual worker completion regardless of recorder delay.
A missing, nonnumeric, nonfinite or negative command-start anchor refuses the
assessment. The positive-start-plus-two-second intervention rule, same pending
command checks, natural sentinel refusal and other ownership/cleanup rules remain.

Added the exact delayed-delivery regression (command 100000, start arrival 102000,
close request 110000, response 112200, witness 112300, no natural sentinel) and six
invalid-anchor checks. Before the source correction these seven checks failed
with missing expected exceptions, reproducing the false-positive assessment.
The ordinary positive and natural-control fixtures now supply an explicit anchor.

No native execution has occurred. The revised adjacent `corrected-preflight.json`
and `corrected-offline-tests.txt` identify the R2 snapshot for independent recheck;
R1 evidence is preserved rather than relabelled passing.
