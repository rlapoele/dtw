import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
export function InspectorToggle({expanded, onToggle}: {expanded: boolean; onToggle(): void}) {
  return <Button variant="ghost" size="icon" className="inspector-toggle touch:hidden" aria-label={expanded ? "Collapse inspector" : "Expand inspector"} aria-expanded={expanded} aria-controls="token-inspector-content" onClick={onToggle}>
    <Icon name="chevron-right" className={`transition-transform motion-reduce:transition-none ${expanded ? "" : "rotate-180"}`} />
  </Button>;
}
