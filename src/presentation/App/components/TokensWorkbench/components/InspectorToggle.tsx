import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
export function InspectorToggle({expanded, onToggle}: {expanded: boolean; onToggle(): void}) {
  return <Button variant="ghost" size="icon" className={`inspector-toggle mobile:hidden ${expanded ? "" : "border-b-0"}`} aria-label={expanded ? "Collapse inspector" : "Expand inspector"} aria-expanded={expanded} aria-controls="token-inspector-content" onClick={onToggle}>
    <Icon name="chevron-right" className={`panel-motion-chevron ${expanded ? "rotate-0" : "rotate-180"}`} />
  </Button>;
}
