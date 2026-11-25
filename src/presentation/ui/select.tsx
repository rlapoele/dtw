import type { ComponentProps } from "react";
import { Icon } from "@presentation/ui/icon";
// Keep native select semantics and keyboard behavior; the outline icon is decorative.
export function Select({ className, ...props }: ComponentProps<"select">) {
  return (
    <span className="select-control block relative w-full">
      <select
        {...props}
        className={`native-select  appearance-none w-full min-w-0 h-9 min-h-9 rounded-md border-2 border-input bg-background text-foreground pl-2.5 pr-9.5 text-xs/normal enabled:hover:border-control-hover disabled:opacity-45 disabled:cursor-default ${className ?? ""}`}
      />
      <Icon
        name="chevron-down"
        className="icon block select-chevron absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
      />
    </span>
  );
}
