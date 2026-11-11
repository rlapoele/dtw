import type { WorkbenchHost } from "./protocol";
/** Frames preserve UTF-16 code units, including split surrogate pairs. Only a
 * complete same-revision assembly becomes selectable document text. */
export async function readExactSource(
  host: WorkbenchHost,
  projectId: string,
  revision: string,
  entityKind: "project" | "group" | "token",
  entityId: string,
): Promise<string> {
  const source = await host.call("source", {
    projectId,
    revision,
    entityKind,
    entityId,
  });
  const chunks: string[] = [];
  let offset = 0,
    frames = 0;
  while (offset < source.units) {
    const frame = await host.call("sourceFrame", {
      sourceId: source.sourceId,
      offset,
      count: 8192,
    });
    if (
      frame.revision !== revision ||
      frame.units !== source.units ||
      frame.offset !== offset ||
      frame.text.length === 0
    )
      throw Error("Exact source assembly changed");
    chunks.push(frame.text);
    offset += frame.text.length;
    if (++frames % 16 === 0)
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => resolve()),
      );
  }
  const text = chunks.join("");
  if (text.length !== source.units) throw Error("Exact source incomplete");
  return text;
}
