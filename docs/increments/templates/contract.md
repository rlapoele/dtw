# Increment NNN: [short name]

> Template only. Copy into an increment document when planning is requested.

- Contract status: Draft
- Delivery status: Not started
- Agreement: [not yet agreed; record date, scope of final contract/design agreement where applicable, and implementation authorization]
- References: [links to relevant owning documents and constraints]

## Outcome

[Who can do what, and why it matters. For an enabling increment, name the workflow it supports.]

## Scope

- Included: [behavior or boundary]
- Excluded: [explicit limits]

## Acceptance criteria

- AC-1: [observable behavior]
- AC-2: [observable behavior]
- AC-3: [failure behavior or invariant]

## Decisions and open questions

- Established: [decision and source]
- Proposed: [choice requiring agreement]
- Resolve before implementation: [blocking question, or none]
- Deferred: [question deliberately outside scope]

## Verification approach

[How each criterion will be demonstrated: behavior tests, browser observations, artifacts, or other appropriate evidence. Identify checks that cannot yet be performed.]

Use the [shared verification rules](../../workflow/agent-roles.md#proportionate-verification).
Record briefly in this section, not a separate budget document:

- Essential functional / relevant integrity-security / representative performance checks: [criteria, realistic workload and actually agreed guarantees]
- Optional qualification excluded from current delivery: [stress, compatibility, future hardening; preserve stronger existing agreements]
- Shared time and harness-repair ceilings: [for a small increment, assess 30 aggregate minutes and two repair cycles; justify proportionate adjustments before starting]
- Carried-forward consumption: [approximate used/remaining time and cycles, evidence basis, estimates/unknowns and prior stop decisions; missing history is not zero]
- Stop/resume conditions: [stop at either ceiling or earlier for tooling dominance/low value; no automatic resets or extensions; bounded explicit authorization to resume]

## Design proposals and review

- Applicability: [designer required for substantial interaction/interface decisions, explicitly requested, or not applicable with reason]
- Proposal: [artifact paths/links, revision identity, viewing instructions, interaction details, and explicit illustrative or unresolved details]
- User review: [feedback and revisions; date and identified proposal approved for analyst review, or pending]
- Analyst review: [after user approval only; criterion/constraint checks, findings, dispositions, and reviewed revision]
- Material revisions: [return to user before renewed analyst review; record each affected revision and approval]
- Final design agreement: [pending or date and identified artifacts agreed alongside the resulting contract; approval for analyst review alone does not authorize implementation]
- Proportionality and existing authority: [intended outcome, independent recommendation, useful alternatives only, and settled choices/authority preserved without repeated approval]

## Review baseline

[Before implementation, record the base commit and any pre-existing changes. Before review, identify the reviewed commit or exact working-tree snapshot, including new files.]

## Agreed amendments

[None initially. Record date, changed scope/criteria, reason, and user agreement when needed.]
