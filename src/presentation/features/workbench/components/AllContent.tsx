import { memo, useEffect, useState } from "react";
import type { ProjectContext } from "@application/retention/projections";
import { Button } from "@presentation/components/ui/button";
import {
  membershipBlocks,
  revealMembershipBlocks,
} from "@presentation/features/workbench/state/all-content";
import type { MembershipEntry } from "@presentation/features/workbench/state/all-content";

// Previous blocks retain their native DOM and do not rebuild while a later
// block appears. Click delegation keeps callbacks current without stale closures.
const MembershipBlock = memo(function MembershipBlock({
  entries,
}: {
  entries: readonly MembershipEntry[];
}) {
  return entries.map((entry) => (
    <Button
      className="block mb-2 wrap-anywhere"
      key={JSON.stringify([entry.kind, entry.id])}
      data-entity-kind={entry.kind}
      data-entity-id={entry.id}
    >
      {entry.label}
      {entry.detail && <span className="block text-caption text-muted-foreground text-left">{entry.detail}</span>}
    </Button>
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
  useEffect(
    () => revealMembershipBlocks(blocks.length, setVisible),
    [blocks],
  );
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
          const kind = button.dataset.entityKind, id = button.dataset.entityId;
          if ((kind === "group" || kind === "token") && id !== undefined)
            onSelect(kind, id);
        }}
      >
        <p className="text-caption mb-4">
          Every group and token, including items outside the group tree.
        </p>
        {blocks.slice(0, visible).map((entries, index) => (
          <MembershipBlock key={index} entries={entries} />
        ))}
      </div>
    </>
  );
}
