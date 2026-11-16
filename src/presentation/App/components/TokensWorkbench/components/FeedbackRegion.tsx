import type { ReactNode } from "react";
export function FeedbackRegion({ children }: { children: ReactNode }) { return <div className="workbench-feedback shrink-0 max-h-48 overflow-auto px-4 text-caption wrap-anywhere" aria-label="Project safety feedback">{children}</div>; }
