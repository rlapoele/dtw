import type { Ref } from "react";
import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
import { ApplicationHeader } from "@presentation/components/ApplicationHeader/ApplicationHeader";
export function WorkbenchHeader({ compact, projectName, busy, onProjectsClick, onNavigation, onBack, navigationRef }: { compact: boolean; projectName: string; busy: boolean; onProjectsClick: () => void; onNavigation: () => void; onBack?: () => void; navigationRef?: Ref<HTMLButtonElement> }) {
  return <ApplicationHeader compactBrand navigation={onBack ? <Button onClick={onBack}>Back</Button> : compact && <Button ref={navigationRef} variant="ghost" aria-label="Open project navigation" onClick={onNavigation}><Icon name="menu" />Browse</Button>} context={projectName || "(unnamed project)"} actions={<Button disabled={busy} onClick={onProjectsClick}>Projects</Button>} />;
}
