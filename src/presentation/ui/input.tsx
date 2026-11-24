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
      className={`min-h-9 mobile:text-base/normal w-full min-w-0 rounded-md border-2 border-input text-foreground px-2.5 hover:border-control-hover placeholder:text-placeholder ${appearance === "search" ? "h-9 pl-9 bg-surface text-xs/normal" : "h-9 bg-background text-xs/normal"} ${className ?? ""}`}
    />
  );
}
