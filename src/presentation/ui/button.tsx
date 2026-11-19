import { Button as Primitive } from "@base-ui/react/button";

const variants = {
  default: "bg-primary text-primary-foreground border-primary",
  outline: "border-primary bg-background hover:bg-muted",
  ghost: "border-transparent hover:bg-muted",
  navigation:
    "relative border-transparent hover:bg-accent aria-current:bg-accent aria-current:text-foreground aria-current:font-semibold",
  mode: "border-0 bg-transparent text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm",
};
const sizes = {
  default: "min-h-9 px-3 justify-center gap-2 rounded-md",
  history: "min-h-9 min-w-9 px-0 sm:px-3 justify-center gap-2 rounded-md w-9 sm:w-auto",
  panel:
    "min-h-9 px-3 justify-center gap-2 rounded-md source-compact:px-2.5 source-compact:text-caption",
  navigation: "min-h-9 px-3 justify-start gap-2.5 rounded-none text-xs/normal",
  group:
    "h-auto min-h-9 pl-7 pr-3 py-2 justify-start gap-2.5 rounded-none text-xs/normal",
  pane: "min-h-9 w-full px-4 justify-start gap-2 rounded-none text-caption border-b-border",
  icon: "min-h-9 w-9 min-w-9 p-0 justify-center gap-2 rounded-md shrink-0",
  mode: "min-h-9 px-3 flex-1 justify-center gap-2 rounded-md text-caption shadow-none",
  inventory: "h-auto min-h-9 w-full px-3 py-2 justify-start gap-2 rounded-md text-left whitespace-normal",
  selection: "min-h-9 px-3 justify-center gap-2 rounded-md text-caption",
  sm: "min-h-9 px-2 justify-center gap-2 rounded-md",
};

export type ButtonProps = Primitive.Props & {
  variant?: keyof typeof variants;
  size?: keyof typeof sizes;
};

/** Caller classes are additive; choose geometry and appearance through size/variant. */
export function Button({
  className,
  variant = "outline",
  size = "default",
  ...props
}: ButtonProps) {
  const actionMotion = ["default", "history", "panel", "sm", "selection"].includes(size) && variant !== "navigation" && variant !== "mode";
  const motionClasses = actionMotion
    ? "motion-safe:transition-transform duration-150 ease-out motion-safe:not-disabled:not-data-disabled:hover:scale-[1.02] motion-safe:not-disabled:not-data-disabled:active:scale-[0.98]"
    : "";
  const borderWidth = variant === "default" || variant === "outline" ? "border-2" : "border-hairline";
  const owned = `button ${motionClasses} inline-flex items-center ${borderWidth} text-caption font-medium disabled:opacity-45 disabled:cursor-default ${sizes[size]} ${variants[variant]}`;
  return (
    <Primitive
      {...props}
      data-size={size}
      className={(state) =>
        `${owned} ${(typeof className === "function" ? className(state) : className) ?? ""}`
      }
    />
  );
}
