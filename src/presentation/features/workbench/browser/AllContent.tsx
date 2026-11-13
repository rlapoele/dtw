import { memo, useEffect, useState } from "react";
import type { ProjectContext } from "@application/retention/projections";
import { Button } from "@presentation/components/ui/button";
import {
  membershipBlocks,
  revealMembershipBlocks,
} from "@presentation/features/workbench/browser/all-content";
import type { MembershipEntry } from "@presentation/features/workbench/browser/all-content";

// Previous blocks retain their native DOM and do not rebuild while a later
// block appears. Click delegation keeps callbacks current without stale closures.
const MembershipBlock = memo(function MembershipBlock({
  entries,
}: {
  entries: readonly MembershipEntry[];
}) {
  return entries.map((entry) => (
    <li className="min-w-0" key={JSON.stringify([entry.kind, entry.id])}>
      <Button
        size="inventory"
        data-entity-kind={entry.kind}
        data-entity-id={entry.id}
      >
        <span className="block min-w-0 w-full wrap-anywhere">
          <span className="block font-medium whitespace-pre-wrap">
            {entry.label}
          </span>
          <span className="block text-caption text-muted-foreground">
            {entry.kind === "group"
              ? "Namespace group"
              : `Token · ${entry.valueType}`}
          </span>
          {entry.detail && (
            <span className="block text-caption text-muted-foreground whitespace-pre-wrap">
              {entry.detail}
            </span>
          )}
        </span>
      </Button>
      {!entry.detail && (
        <details className="text-caption text-muted-foreground px-3 py-1">
          <summary className="cursor-pointer">
            {entry.kind === "group" ? "Group" : "Token"} identity
          </summary>
          <p className="wrap-anywhere whitespace-pre-wrap">
            {JSON.stringify(entry.id)}
          </p>
        </details>
      )}
    </li>
  ));
});

/** The owning workbench keys this view by the coherent applied revision. */
export function AllContent({
  context,
  groupLabels,
  onSelect,
}: {
  context: ProjectContext;
  groupLabels: ReadonlyMap<string, string>;
  onSelect: (kind: "group" | "token", id: string) => void;
}) {
  // The key is the coherent project/revision, not the identity of a refreshed
  // DTO. Same-revision resume reads must retain native nodes and reveal progress.
  const [blocks] = useState(() => membershipBlocks(context, groupLabels));
  const [visible, setVisible] = useState(Math.min(1, blocks.length));
  useEffect(() => revealMembershipBlocks(blocks.length, setVisible), [blocks]);
  const total = context.groups.length + context.tokens.length;
  return (
    <>
      <p role="status" className="text-caption mb-4">
        {visible < blocks.length
          ? `Preparing all content… ${Math.min(visible * 100, total)} of ${total} identities`
          : `All content ready · ${context.groups.length} groups · ${context.tokens.length} tokens`}
      </p>
      <div
        onClick={(event) => {
          if (!(event.target instanceof Element)) return;
          const button = event.target.closest<HTMLButtonElement>(
            "button[data-entity-kind]",
          );
          if (!button || !event.currentTarget.contains(button)) return;
          const kind = button.dataset.entityKind,
            id = button.dataset.entityId;
          if ((kind === "group" || kind === "token") && id !== undefined)
            onSelect(kind, id);
        }}
      >
        <ul
          className="flex min-w-0 flex-col gap-2"
          aria-label="All project content"
        >
          {blocks.slice(0, visible).map((entries, index) => (
            <MembershipBlock key={index} entries={entries} />
          ))}
        </ul>
      </div>
    </>
  );
}
