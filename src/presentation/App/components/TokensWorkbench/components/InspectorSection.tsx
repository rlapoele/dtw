import type { ReactNode } from "react";
import { Icon } from "@presentation/ui/icon";

/** Inspector-only disclosure: the footer remains reachable when fields are hidden. */
export function InspectorSection({ title, open, onToggle, children, footer, badge, appliedSummary }: {
  title: string; open: boolean; onToggle: () => void; children: ReactNode;
  footer?: ReactNode; badge?: string; appliedSummary?: boolean;
}) {
  return <section data-applied-summary={appliedSummary || undefined} className="border-b-hairline border-border min-w-0">
    {/* Keep heading navigation independent of browser-specific summary child roles. */}
    <h3 className="sr-only">{title}</h3>
    <details open={open} onToggle={event => {
      // Ignore nested disclosures and notifications caused by controlled prop updates.
      if (event.target === event.currentTarget && event.currentTarget.open !== open) onToggle();
    }}>
      <summary
        className="inspector-section-summary flex items-center gap-3 w-full min-h-14 text-left text-caption font-semibold bg-transparent py-3 focus-visible:outline-2 focus-visible:outline-ring focus-visible:outline-offset-2 rounded cursor-pointer list-none">
        {title}{badge && <span className="text-muted-foreground font-normal">{badge}</span>}
        <Icon name="chevron-right" className={`ml-auto shrink-0 transition-transform duration-150 motion-reduce:transition-none ${open ? "rotate-90" : ""}`} />
      </summary>
      <div className="pb-5">{children}</div>
    </details>
    {footer}
  </section>;
}
