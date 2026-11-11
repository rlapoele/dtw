import type { ProjectContext } from "@application/retention/projections";

export type MembershipEntry = {
  kind: "group" | "token";
  id: string;
  label: string;
};

/** Presentation blocks preserve every exact identity and the existing order. */
export function membershipBlocks(
  context: ProjectContext,
  groupLabels: ReadonlyMap<string, string>,
): readonly (readonly MembershipEntry[])[] {
  const entries: MembershipEntry[] = [
    ...context.groups.map(({ authored }) => ({
      kind: "group" as const,
      id: authored.id,
      label: `Group · ${groupLabels.get(authored.id)} · ${JSON.stringify(authored.id)}`,
    })),
    ...context.tokens.map(({ authored }) => ({
      kind: "token" as const,
      id: authored.id,
      label: `Token · ${authored.localName || "(unnamed)"} · ${JSON.stringify(authored.id)}`,
    })),
  ];
  return Array.from({ length: Math.ceil(entries.length / 100) }, (_, index) =>
    entries.slice(index * 100, (index + 1) * 100),
  );
}

/** Each frame publishes one new block; disposal fences even an already queued
 * callback when its owning project/revision view is replaced. */
export function revealMembershipBlocks(
  total: number,
  publish: (count: number) => void,
  schedule: (callback: () => void) => number = requestAnimationFrame,
  cancel: (id: number) => void = cancelAnimationFrame,
): () => void {
  let visible = Math.min(1, total), stopped = false, frame: number | undefined;
  const advance = () => {
    if (stopped) return;
    publish(++visible);
    if (visible < total) frame = schedule(advance);
  };
  if (visible < total) frame = schedule(advance);
  return () => {
    stopped = true;
    if (frame !== undefined) cancel(frame);
  };
}
