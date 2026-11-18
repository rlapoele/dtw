import { useState, type ComponentProps } from "react";
import { Input } from "@presentation/ui/input";
import { colorDecimalDisplay } from "@presentation/App/components/TokensWorkbench/helpers/color-decimal-display";

/** Only presentation changes on focus/blur; edits alone reach the draft. */
export function ColorDecimalInput({
  value,
  rounded = true,
  ...props
}: Omit<ComponentProps<typeof Input>, "value" | "onFocus" | "onBlur"> & {
  value: string;
  rounded?: boolean;
}) {
  const [focused, setFocused] = useState(false);
  const display = rounded && !focused ? colorDecimalDisplay(value) : value;
  return (
    <Input
      {...props}
      value={display}
      title={display !== value ? `Approximate · exact value ${value}` : undefined}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}
