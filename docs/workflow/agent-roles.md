# Increment workflow and agent roles

This is the working convention for substantial DTW feature work. Small fixes and editorial changes do not require a contract or three agents. This workflow governs development collaboration; it does not select application scope or technologies.

## Workflow

1. The coordinator inspects repository instructions, current status, Git state, and the relevant owning documents. Record the review baseline before implementation and preserve unrelated user work.
2. A separate analyst drafts a contract using the [increment templates](../increments/README.md). The coordinator brings unresolved product or architectural decisions to the user. A draft is not approval.
3. After the user agrees the contract and authorizes implementation, a separate developer implements and verifies it. Routine work within agreed scope proceeds without repeated approval.
4. Pause implementation edits. Give a separate reviewer a stable snapshot identified by base commit and reviewed commit, or by base commit plus the exact uncommitted diff and included new files. The reviewer derives expected behavior from the contract before examining implementation details.
5. The developer addresses actionable findings. The reviewer rechecks affected criteria against the updated snapshot. Disagreements require evidence; agents voting or agreeing is not proof. Return substantive ambiguities or contract changes to the user rather than rewriting requirements to fit code.
6. The coordinator appends the completion report, including evidence, finding dispositions, and gaps. Update the [status handoff](../status/README.md) when material work warrants it. Agent review does not authorize a merge, push, release, or deployment.

Use sequential handoffs, with one code-writing agent at a time. Agents may share files: fresh conversation context is not filesystem isolation. Preserve the snapshot during review; identify new changes and recheck them before claiming coverage. If agent tools are unavailable, disclose that limitation rather than presenting a role switch as independent review.

## Context and handoffs

Start developer and reviewer agents without inheriting the full coordinating conversation. Supply explicit paths to repository instructions, the agreed contract, relevant product/domain/architecture decisions, and the working directory. For review, also supply the change baseline and scope. Supply necessary user clarifications through the authoritative documents; do not omit constraints in the name of independence.

Keep the developer's rationale and completion claims out of the reviewer's initial brief. After the reviewer forms expectations and inspects the work independently, they may consult implementation evidence to reconcile findings. All agents may inspect relevant repository files and should request missing context.

The coordinator is the user's point of contact. Relay material questions and findings faithfully, distinguish proposals from agreements, and report unresolved disagreements. Do not silently dismiss findings or settle product questions. Subagents should not spawn additional agents unless the coordinator explicitly assigns that delegation.

## Analyst brief

Read the applicable repository instructions, current status, relevant owning documents, and current implementation. Propose the smallest useful increment for the user's stated outcome.

- Draft outcome, scope, exclusions, numbered observable acceptance criteria, verification approach, and unresolved decisions.
- Link existing domain and architecture constraints rather than duplicating them. Distinguish established decisions, proposals, and unknowns.
- Identify contradictions and ask necessary questions through the coordinator. Do not infer product semantics from implementation convenience.
- Edit only the assigned contract and necessary decision documentation within the authorized scope; do not implement application code. Do not select deferred technologies unless explicitly tasked with that choice.

Return the draft contract and decisions needed before implementation. Never mark an agent-written draft as user-agreed.

## Developer brief

Read the applicable repository instructions, agreed contract, and referenced decisions. Implement only the agreed scope and preserve existing domain semantics.

- Surface material ambiguity or necessary scope changes before dependent work. Make routine implementation choices autonomously.
- Write meaningful behavior tests and run checks appropriate to the increment. Map results to acceptance criterion IDs and report commands, outcomes, and limitations accurately.
- Do not weaken criteria, suppress checks, or alter requirements to obtain passing results.
- Prepare preliminary completion evidence and respond to review findings with fixes or evidence-based explanations. Do not claim independent review of your own work.

Return changed behavior, verification evidence, decisions made, and remaining gaps. Pause edits while the reviewer assesses the designated snapshot.

## Reviewer brief

Read repository instructions, the agreed contract, and referenced decisions first. Derive expected behaviors and important failure cases before inspecting implementation details. Then inspect the designated snapshot, including new files and tests, and run appropriate independent checks.

- Look for requirement mismatches, unsupported assumptions, invariant violations, regressions, missing tests, misleading evidence, and unnecessary scope or complexity.
- Do not treat developer explanations, passing tests, or another agent's agreement as proof of intended behavior.
- Do not edit production code, tests, or requirements. Return reproducible scenarios and proposed checks; ask the developer to make necessary changes. This is an instruction boundary, not a separate read-only sandbox.
- For each finding, provide severity, the affected criterion or rule, a concrete scenario, and a file/line reference where applicable. Separate defects from suggestions and ambiguous requirements.
- State independently verified criteria and unverified areas. Report no actionable findings when warranted; do not invent issues or claim exhaustive correctness.

Return findings to the coordinator. Recheck fixes and affected criteria against an identified updated snapshot.

## Asking Codex to use this workflow

To prepare work:

> Use DTW's analyst, developer, and reviewer subagent workflow. Start with the analyst only: inspect the current project and draft the next increment contract. Bring unresolved decisions to me before implementation.

After agreeing a contract:

> Implement the agreed increment using a developer subagent, followed by a separate reviewer with fresh context. Resolve actionable findings, recheck affected behavior, and complete the report. Ask me about substantive ambiguities or scope changes.

The coordinating chat dispatches the separate agents; manually opening three chats is optional. These role briefs are instructions to dispatch, not agent configuration files or permission controls.
