import { Button as Primitive } from "@base-ui/react/button";
export function Button({
  className,
  variant = "outline",
  ...props
}: Primitive.Props & { variant?: "outline" | "default" | "ghost" }) {
  return (
    <Primitive
      {...props}
      className={`button h-8 px-3 inline-flex items-center justify-center gap-2 rounded-md text-xs font-medium border ${variant === "default" ? "bg-primary text-primary-foreground border-primary" : variant === "ghost" ? "border-transparent hover:bg-muted" : "border-border bg-background hover:bg-muted"} ${typeof className === "string" ? className : ""}`}
    />
  );
}
