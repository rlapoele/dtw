# Increment workflow and agent roles

This is the working convention for substantial DTW feature work. Use separate analyst, developer, and reviewer subagents; add a separate designer when an increment introduces substantial interaction or interface decisions. The designer is also available for explicitly requested design exploration. Domain-only increments can omit design. Small fixes and editorial changes do not require a contract or this sequence of agents. This workflow governs development collaboration; it does not select application scope or technologies.

## Workflow

1. The coordinator inspects repository instructions, current status, Git state, and the relevant owning documents. Record the review baseline before implementation and preserve unrelated user work.
2. A separate analyst drafts a contract using the [increment templates](../increments/README.md). The coordinator brings unresolved product or architectural decisions to the user. A draft is not approval.
3. When design is involved, the designer first forms an independent opinion on the requested changes and visual design, explains trade-offs, and proposes a recommended direction with meaningful options or ideas. Present that assessment and proposal to the user before editing the interactive prototype; use their feedback and approval to select what to prototype. The designer then prepares wireframes, mockups, or an interactive prototype at the fidelity needed to assess the workflow. The coordinator presents the actual artifacts to the user in this chat. The user can request changes; repeat this step until the user approves the identified proposal for analyst review. Do not send the proposal to the analyst for review before that approval.
4. The analyst reviews the user-approved proposal against the draft contract and domain/architecture constraints, recording gaps, contradictions, and scope changes. The designer and analyst refine their respective artifacts through the coordinator. Any material design revision returns to the user before renewed analyst review. Resolve findings and identify the resulting contract and design versions for final agreement.
5. After the user agrees the resulting contract and design, where applicable, and authorizes implementation, a separate developer implements and verifies them. Approval for analyst review is not final design agreement or implementation authorization. Routine work within agreed scope proceeds without repeated approval.
6. Pause implementation edits. Give a separate reviewer a stable snapshot identified by base commit and reviewed commit, or by base commit plus the exact uncommitted diff and included new files. The reviewer derives expected behavior from the contract and agreed design before examining implementation details. A focused designer check of the implemented interface may supplement independent review; it does not replace it.
7. The developer addresses actionable findings. The reviewer rechecks affected criteria against the updated snapshot. Disagreements require evidence; agents voting or agreeing is not proof. Return substantive ambiguities, material design changes, or contract changes to the user rather than rewriting requirements to fit code. Material design changes follow the user-before-analyst review loop again before implementation resumes on the affected work.
8. The coordinator appends the completion report, including evidence, finding dispositions, and gaps. Update the [status handoff](../status/README.md) when material work warrants it. Agent review does not authorize a merge, push, release, or deployment.

Use sequential handoffs, with one code-writing agent at a time. Agents may share files: fresh conversation context is not filesystem isolation. Preserve the snapshot during review; identify new changes and recheck them before claiming coverage. If agent tools are unavailable, disclose that limitation rather than presenting a role switch as independent review.

## Context and handoffs

Start developer and reviewer agents without inheriting the full coordinating conversation. Supply explicit paths to repository instructions, the agreed contract, relevant product/domain/architecture decisions, and the working directory. For review, also supply the change baseline and scope. Supply necessary user clarifications through the authoritative documents; do not omit constraints in the name of independence.

Give the designer the draft contract, relevant domain constraints, [visual direction and accepted reference](../project/visual-direction.md), and authorized artifact location. Identify each design revision by file/version or another durable reference. Record user approval for analyst review, analyst findings and dispositions, and final user agreement separately in the increment document. Developer and reviewer handoffs must include the agreed design artifacts and interaction details; unresolved illustrative details must remain explicit.

Keep the developer's rationale and completion claims out of the reviewer's initial brief. After the reviewer forms expectations and inspects the work independently, they may consult implementation evidence to reconcile findings. All agents may inspect relevant repository files and should request missing context.

The coordinator is the user's point of contact. Relay material questions and findings faithfully, distinguish proposals from agreements, and report unresolved disagreements. Do not silently dismiss findings or settle product questions. Subagents should not spawn additional agents unless the coordinator explicitly assigns that delegation.

## Analyst brief

Read the applicable repository instructions, current status, relevant owning documents, and current implementation. Propose the smallest useful increment for the user's stated outcome.

- Draft outcome, scope, exclusions, numbered observable acceptance criteria, verification approach, and unresolved decisions.
- Link existing domain and architecture constraints rather than duplicating them. Distinguish established decisions, proposals, and unknowns.
- Identify contradictions and ask necessary questions through the coordinator. Do not infer product semantics from implementation convenience.
- After the user's approval for analyst review, check the identified design proposal against acceptance criteria, domain invariants, architecture boundaries, and scope. Report concrete mismatches and missing states; update the draft contract only within authorized scope. Consistency review does not establish usability or replace user feedback and testing.
- Edit only the assigned contract and necessary decision documentation within the authorized scope; do not implement application code. Do not select deferred technologies unless explicitly tasked with that choice.

Return the draft contract and decisions needed before implementation. Never mark an agent-written draft as user-agreed.

## Designer brief

Read repository instructions, current status, the draft contract, relevant product/domain/architecture constraints, and the accepted visual direction. Design the scoped user workflow without silently settling unresolved product or technology choices.

- Assess requested changes before translating them into frontend edits. Explain your design judgment, trade-offs and recommended direction; propose options or ideas for user feedback. Do not treat annotations as approval of the first implementation approach. Wait for user approval of the proposed direction before changing the interactive prototype.
- Produce reviewable wireframes, mockups, or an interactive prototype appropriate to the questions being explored. Cover navigation, information hierarchy, editing behavior, relevant empty/loading/validation/error states, keyboard and focus behavior, accessibility, and responsive behavior as the increment requires.
- Return actual artifacts with viewing instructions, the revision identity, interaction notes, assumptions, limitations, and decisions needed. The coordinator must surface the proposal to the user before analyst review; do not treat silence or artifact generation as approval.
- Iterate on the user's feedback until approval for analyst review. Address subsequent analyst findings through the coordinator; return material revisions to the user before renewed analyst review. Do not mark either review stage as implementation authorization.
- Keep exploratory prototype code and sample data distinct from application implementation. Work only in the assigned artifact scope; do not change production code, dependencies, domain semantics, or agreed requirements. A prototype's technology does not select the production stack, and prototype code is not automatically approved for reuse.
- Prepare the agreed handoff with screens/states, interaction behavior, links to applicable acceptance criteria, and unresolved details. If assigned, check the implemented interface for fidelity and usability concerns and return findings without editing implementation or claiming independent review of your own proposal.

Return proposals and findings to the coordinator. The user retains design and substantive product decisions; the analyst checks requirements and constraints; the reviewer independently verifies implementation.

## Developer brief

Read the applicable repository instructions, agreed contract, agreed design artifacts and interaction details where applicable, and referenced decisions. Implement only the agreed scope and preserve existing domain semantics.

- Surface material ambiguity or necessary scope changes before dependent work. Make routine implementation choices autonomously.
- Write meaningful behavior tests and run checks appropriate to the increment. Map results to acceptance criterion IDs and report commands, outcomes, and limitations accurately.
- Do not weaken criteria, suppress checks, or alter requirements to obtain passing results.
- Prepare preliminary completion evidence and respond to review findings with fixes or evidence-based explanations. Do not claim independent review of your own work.

Return changed behavior, verification evidence, decisions made, and remaining gaps. Pause edits while the reviewer assesses the designated snapshot.

## Reviewer brief

Read repository instructions, the agreed contract, agreed design artifacts where applicable, and referenced decisions first. Derive expected behaviors and important failure cases before inspecting implementation details. Then inspect the designated snapshot, including new files and tests, and run appropriate independent checks. For interface increments, check design fidelity, interaction states, and accessibility with appropriate runtime evidence; identify unverified areas explicitly.

- Look for requirement mismatches, unsupported assumptions, invariant violations, regressions, missing tests, misleading evidence, and unnecessary scope or complexity.
- Do not treat developer explanations, passing tests, or another agent's agreement as proof of intended behavior.
- Do not edit production code, tests, or requirements. Return reproducible scenarios and proposed checks; ask the developer to make necessary changes. This is an instruction boundary, not a separate read-only sandbox.
- For each finding, provide severity, the affected criterion or rule, a concrete scenario, and a file/line reference where applicable. Separate defects from suggestions and ambiguous requirements.
- State independently verified criteria and unverified areas. Report no actionable findings when warranted; do not invent issues or claim exhaustive correctness.

Return findings to the coordinator. Recheck fixes and affected criteria against an identified updated snapshot.

## Asking Codex to use this workflow

To prepare work:

> Use DTW's analyst, developer, and reviewer subagent workflow. Start with the analyst only: inspect the current project and draft the next increment contract. Bring unresolved decisions to me before implementation.

To explore an interface after drafting its contract:

> Use a designer subagent to prepare wireframes, mockups, or a prototype for the draft increment. Show me the actual proposal and iterate on my feedback. Wait for my approval before sending it to the analyst for review. Bring material revisions back to me, then present the resulting contract and design for final agreement. Do not implement yet.

After agreeing a contract and design where applicable:

> Implement the agreed increment and its agreed design using a developer subagent, followed by a separate reviewer with fresh context. Resolve actionable findings, recheck affected behavior, and complete the report. Ask me about substantive ambiguities, material design changes, or scope changes.

The coordinating chat dispatches the separate agents; manually opening separate chats is optional. These role briefs are instructions to dispatch, not agent configuration files or permission controls. Updating this workflow does not start design work or authorize any application increment, and does not retroactively amend existing increment agreements.
