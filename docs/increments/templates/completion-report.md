## Completion report

[Append to the existing task or increment record by default. Omit unused sections,
not required evidence or limits. This record supports the chat handoff; it does not
replace it. Use familiar words and describe behavior alongside criterion IDs.]

- Delivery status: [Completed / Partially completed / Blocked]
- Date: [date]
- Reviewed snapshot: [base and reviewed commit, or exact working-tree snapshot including new files]

### Result

[Concrete delivered behavior and important unfinished work. Do not present planned
or unverified behavior as delivered. Distinguish implementation, checks and human acceptance.]

### Acceptance evidence

| Criterion | Evidence and result | Status |
|---|---|---|
| AC-1 — [behavior] | [test/scenario/artifact reference and observed outcome] | [Verified / Failed / Unverified] |

### Checks and independent review

- Checks: [commands or manual checks, actual outcomes, and skipped checks with reasons]
- Reviewer: [agent/task identifier and reviewed scope; say if independent review was unavailable]
- Design verification: [agreed artifact revision, implementation fidelity/interaction/accessibility evidence, optional designer check and findings; or not applicable]
- Findings: [finding, fix or evidence-based disposition, and recheck result; or no actionable findings]
- Unresolved disagreements: [details or none]
- Verification accounting: [approximate cumulative time and harness cycles used/remaining across agents, basis/unknowns, stopping reason and any bounded resume authority; no reset at handoff]

### Decisions made

[Links to owning decision records; distinguish agreed changes from routine implementation choices.]

### Limits and remaining work

[Unmet criteria, unverified behavior, and known limitations. Do not equate passing tests with complete product validation.]

[For each failed or untested requirement: behavior at risk, effect on agreed delivery,
and next action with its owner. Preserve its actual status; separate optional improvements.]

### Next step

[Smallest useful follow-up proposal. This report does not authorize starting it or merging, publishing, or deploying the result.]

[Surface needed decisions in chat: concrete question, reason, recommendation with its
main tradeoff, and work waiting for the answer. For useful human checks: starting place,
actions, expected result and what the check establishes. If neither is needed, say so
briefly in chat without inventing a request or seeking approval already given.]

[For changed files, include the change summary, checks and limits, and a ready-to-copy
focused commit message in the user-facing handoff. Leave staging, committing and pushing
to the user; preserve pre-existing staged work.]
