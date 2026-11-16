import type { ReactNode } from "react";
import { ApplicationShell } from "@presentation/App/components/ApplicationShell/ApplicationShell";

/** Shared frame and geometry only. Screens supply the real pane roots and policy. */
export function WorkbenchLayout({
  header, beforeBody, navigation, workspace, inspector, afterBody, overlays,
  compact = false, narrow, surface, navigationCollapsed = false, inspectorCollapsed = false,
}: {
  header: ReactNode;
  beforeBody?: ReactNode;
  navigation?: ReactNode;
  workspace: ReactNode;
  inspector: ReactNode;
  afterBody?: ReactNode;
  overlays?: ReactNode;
  compact?: boolean;
  narrow: boolean;
  surface: "browse" | "inspect";
  navigationCollapsed?: boolean;
  inspectorCollapsed?: boolean;
}) {
  const bodyClass = navigation !== undefined
    ? `workbench ${narrow ? `narrow-${surface}` : ""} grid flex-1 h-0 min-h-0 overflow-hidden ${compact ? "compact-navigation" : ""} ${navigationCollapsed ? "groups-collapsed" : "groups-expanded"} ${inspectorCollapsed ? "inspector-collapsed" : "inspector-expanded"}`
    : "projects-layout flex-1 min-h-0 grid overflow-hidden";
  return (
    <ApplicationShell>
      {header}
      {beforeBody}
      <div className={bodyClass}>
        {compact ? null : navigation}
        {workspace}
        {inspector}
      </div>
      {afterBody}
      {overlays}
    </ApplicationShell>
  );
}
