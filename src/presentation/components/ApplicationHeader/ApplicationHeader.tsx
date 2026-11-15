import type { ReactNode } from "react";
import { Icon } from "@presentation/ui/icon";
export function ApplicationHeader({ navigation, context, actions, compactBrand = false }: { navigation?: ReactNode; context?: ReactNode; actions?: ReactNode; compactBrand?: boolean }) {
  return <header className={`application-header ${compactBrand ? "compact-brand" : ""} shrink-0 border-b border-border flex items-center gap-4 px-5 py-3`}>
    {navigation}<div className="brand flex items-center gap-2 min-w-0"><Icon name="stack" /><strong>Token Workbench</strong></div>
    {context && <div className="application-context min-w-0 text-muted-foreground wrap-anywhere">{context}</div>}
    <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>
  </header>;
}
