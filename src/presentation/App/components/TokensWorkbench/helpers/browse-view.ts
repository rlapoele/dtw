import type { TokenType, TokenLayer } from "@domain/token";
export type TokenTypeScope = { kind: "type"; type: TokenType | "Unassigned"; layer?: TokenLayer | "Unspecified"; location?: { kind: "root" } | { kind: "group"; id: string } };
export type TokenBrowseView =
  | { kind: "all-tokens" }
  | { kind: "group"; id: string }
  | TokenTypeScope
  | { kind: "all-content" };
export function creationParent(view: TokenBrowseView): string | null {
  return view.kind === "group" ? view.id : view.kind === "type" && view.location?.kind === "group" ? view.location.id : null;
}
export const scopeKey = (view: TokenBrowseView) => view.kind === "type"
  ? JSON.stringify([view.kind, view.type, view.layer ?? null, view.location?.kind ?? null, view.location?.kind === "group" ? view.location.id : null])
  : JSON.stringify([view.kind, view.kind === "group" ? view.id : null]);
