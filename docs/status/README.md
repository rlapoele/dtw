# Project Status Memory

## Purpose

This directory provides a durable handoff layer for people and agents resuming work after a break or in a new conversation. It answers what phase the project is in, what changed recently, what should happen next, and what is currently blocked.

Status documents summarize the repository; they do not replace its authoritative product, model, architecture, interoperability, or planning documents. Record a decision in the document that owns it, then link to that decision from the status log.

## Structure

```text
docs/status/
├── README.md          # Status-log rules and resume procedure
├── current.md         # Single live handoff snapshot
└── history/
    └── README.md      # Archive convention
```

## Resume procedure

For substantial continuation work:

1. read the applicable `AGENTS.md` instructions;
2. read `docs/status/current.md`;
3. inspect `git status` and recent history instead of trusting the snapshot for working-tree details;
4. follow links from the snapshot to the authoritative documents relevant to the task;
5. check `docs/planning/open-questions.md` before making an unresolved choice.

## Updating the live snapshot

Update `current.md` after a material milestone, research conclusion, explicit decision, phase change, or handoff. Do not update it for trivial wording fixes.

Keep it concise and self-contained. It should include:

- the update date and current phase;
- the current focus and state;
- recently completed material work;
- the next meaningful actions;
- blockers or explicitly unresolved decisions;
- the verification expectations for the current project state.

Use links instead of copying detailed specifications. Preserve confidence labels from the source documents, and do not promote an open question into a decision through status wording.

Do not record transient facts such as an assumed clean working tree, local process IDs, temporary paths, or uncommitted commit hashes. Readers must verify those directly.

## Archiving

Archive the outgoing snapshot when a major phase ends or when preserving it would materially help future reconstruction. Follow `history/README.md`. Git history is sufficient for routine updates; the archive is not a transcript of every session.
