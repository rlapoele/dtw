import type { ComponentProps } from "react";
/** A native text control: never parses or normalizes authored strings. */
export function Input({
  className,
  appearance = "field",
  ...props
}: ComponentProps<"input"> & { appearance?: "field" | "search" }) {
  return (
    <input
      {...props}
      className={`text-input w-full min-w-0 rounded-md border border-border text-foreground px-2.5 hover:border-control-hover placeholder:text-placeholder ${appearance === "search" ? "h-8.5 pl-8.5 bg-surface text-xs/normal" : "h-10 min-h-10 bg-background text-xs/normal"} ${className ?? ""}`}
    />
  );
}
