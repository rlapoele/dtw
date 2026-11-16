import type { ReactNode } from "react";
/** Shared chrome only: page owners retain all session and command state. */
export function ApplicationShell({ children }: { children: ReactNode }) {
  return <div className="app-shell flex h-dvh min-h-0 flex-col overflow-clip bg-background">{children}</div>;
}
