import type { ComponentProps } from "react";
export function Badge({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      {...props}
      className={`badge border border-border bg-surface px-1.5 py-0.5 text-badge-foreground rounded whitespace-nowrap ${className ?? ""}`}
    />
  );
}
