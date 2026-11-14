import { Button as Primitive } from "@base-ui/react/button";

const variants = {
  default: "bg-primary text-primary-foreground border-primary",
  outline: "border-border bg-background hover:bg-muted",
  ghost: "border-transparent hover:bg-muted",
  navigation:
    "border-transparent hover:bg-muted aria-current:bg-accent aria-current:text-foreground aria-current:font-semibold",
  mode: "border-0 bg-transparent text-muted-foreground aria-pressed:bg-background aria-pressed:text-foreground aria-pressed:shadow-sm",
};
const sizes = {
  default: "h-8 px-3 justify-center gap-2 rounded-md",
  panel:
    "h-8 px-3 justify-center gap-2 rounded-md source-compact:px-2.5 source-compact:text-caption",
  navigation: "h-9 min-h-9 px-3 justify-start gap-2.5 rounded text-xs/normal",
  group:
    "h-auto min-h-11 pl-7 pr-3 py-2 justify-start gap-2.5 rounded text-xs/normal",
  pane: "h-11 min-h-11 w-full px-4 justify-start gap-2 rounded-none text-caption border-b-border",
  icon: "h-11 min-h-11 w-11 min-w-11 p-0 justify-center gap-2 rounded-md shrink-0",
  mode: "h-8 px-3 flex-1 justify-center gap-2 rounded-md text-caption shadow-none",
  inventory: "h-auto min-h-11 w-full px-3 py-2 justify-start gap-2 rounded-md text-left whitespace-normal",
  selection: "h-10 px-3 justify-center gap-2 rounded-md text-caption",
  sm: "h-7 px-2 justify-center gap-2 rounded-md",
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
  const owned = `button inline-flex items-center border disabled:opacity-45 disabled:cursor-default ${sizes[size]} ${variants[variant]}`;
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
