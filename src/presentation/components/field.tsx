import type { ComponentProps } from "react";
export function Field({ className, ...props }: ComponentProps<"label">) {
  return (
    <label
      {...props}
      className={`field gap-1.75 mb-4.25 text-caption flex flex-col font-medium ${className ?? ""}`}
    />
  );
}
