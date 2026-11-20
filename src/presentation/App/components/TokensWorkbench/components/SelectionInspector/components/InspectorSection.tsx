import { useId, type ReactNode } from "react";
import { Icon } from "@presentation/ui/icon";

/** Inspector-only disclosure: the footer remains reachable when fields are hidden. */
export function InspectorSection({ title, open, onToggle, children, footer, badge }: {
  title: string; open: boolean; onToggle: () => void; children: ReactNode;
  footer?: ReactNode; badge?: string;
}) {
  const id = useId();
  return <section className="border-b-hairline border-border min-w-0">
    <h3><button type="button" aria-expanded={open} aria-controls={id} onClick={onToggle}
      className="flex items-center gap-3 w-full min-h-14 text-left text-caption font-semibold bg-transparent py-3 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded">
      {title}{badge && <span className="text-muted-foreground font-normal">{badge}</span>}
      <Icon name="chevron-right" className={`ml-auto shrink-0 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-90" : ""}`} />
    </button></h3>
    <div id={id} hidden={!open} className="pb-5">{children}</div>
    {footer}
  </section>;
}
