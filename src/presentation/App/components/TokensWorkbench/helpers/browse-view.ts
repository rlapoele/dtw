export type TokenBrowseView =
  | { kind: "all-tokens" }
  | { kind: "group"; id: string }
  | { kind: "all-content" };
export function creationParent(view: TokenBrowseView): string | null {
  return view.kind === "group" ? view.id : null;
}
