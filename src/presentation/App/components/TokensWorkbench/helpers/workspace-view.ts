export type BrowserView =
  | { kind: "all-tokens" }
  | { kind: "group"; id: string }
  | { kind: "all-content" };
export function creationParent(view: BrowserView): string | null {
  return view.kind === "group" ? view.id : null;
}
