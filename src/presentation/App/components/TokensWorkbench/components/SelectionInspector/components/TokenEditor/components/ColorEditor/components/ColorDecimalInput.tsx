import { useState, type ComponentProps } from "react";
import { Input } from "@presentation/ui/input";
import { colorDecimalDisplay } from "@presentation/App/components/TokensWorkbench/helpers/color-decimal-display";

/** Only presentation changes on focus/blur; edits alone reach the draft. */
export function ColorDecimalInput({
  value,
  rounded = true,
  suffix,
  className,
  ...props
}: Omit<ComponentProps<typeof Input>, "value" | "onFocus" | "onBlur"> & {
  value: string;
  rounded?: boolean;
  suffix?: string;
}) {
  const [focused, setFocused] = useState(false);
  const display = rounded && !focused ? colorDecimalDisplay(value) : value;
  return (
    <span className="relative block">
    <Input
      {...props}
      className={`${className ?? ""} ${suffix ? "pr-7" : ""}`}
      value={display}
      title={display !== value ? `Approximate · exact value ${value}` : undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
    {suffix && <span aria-hidden="true" className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-caption text-muted-foreground">{suffix}</span>}
    </span>
  );
}
