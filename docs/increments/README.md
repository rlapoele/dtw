# Increment contracts and completion reports

Use one numbered Markdown document per substantial increment, named `NNN-short-name.md` in this directory. Choose the next unused number when actual increment planning is requested. Templates are reusable blanks, not active increments or approved requirements.

1. Copy the [contract template](templates/contract.md) to the new document and fill it with the analyst.
2. Resolve decisions needed for implementation. Record the user's agreement and its scope; do not infer agreement from an agent draft. Follow the [agent workflow](../workflow/agent-roles.md).
3. Keep acceptance criterion IDs stable. Record substantive agreed amendments with their date and reason; do not silently rewrite the agreement during implementation.
4. Append the [completion report template](templates/completion-report.md) to the same document. Replace placeholders with actual evidence and explicit gaps.

Contract status is `Draft`, `Agreed`, or `Superseded`. Completion is recorded separately as `Not started`, `In progress`, `Completed`, `Partially completed`, or `Blocked`. An agreed contract is not a completion claim. Only mark completion when all acceptance criteria have evidence and required review findings are resolved; otherwise state the gaps.

Keep documents concise. Link to the authoritative product, model, architecture, and planning documents instead of creating competing definitions. If an increment needs to change those decisions, obtain agreement and update their owning documents. Status handoffs summarize and link to the increment; they do not replace it.

Adding workflow documentation and templates does not itself open or authorize an increment. [Increment 001](001-in-memory-authoring-workflow.md) separately records the agreed and completed in-memory application workflow. The complete PWA user workflow, durable persistence boundary, first compatibility profile, and PWA/Electron acceptance criteria remain subject to the existing [open questions](../planning/open-questions.md#decision-priorities).
