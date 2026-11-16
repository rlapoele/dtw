import type { ReactNode } from "react";
import { Icon } from "@presentation/ui/icon";
export function ApplicationHeader({ navigation, context, actions, compactBrand = false }: { navigation?: ReactNode; context?: ReactNode; actions?: ReactNode; compactBrand?: boolean }) {
  return <header className={`application-header ${compactBrand ? "compact-brand" : ""} shrink-0 border-b-hairline border-border flex items-center gap-4 px-5 py-3 min-h-16 touch:flex-wrap touch:gap-2 touch:px-4`}>
    {navigation}<div className={`brand touch:text-caption ${compactBrand ? "touch:hidden" : ""} flex items-center gap-2 min-w-0`}><Icon name="stack" /><strong>Token Workbench</strong></div>
    {context && <div className={`application-context min-w-0 text-muted-foreground wrap-anywhere touch:text-caption ${compactBrand ? "touch:order-0 touch:flex-1" : "touch:order-3 touch:basis-full"}`}>{context}</div>}
    <div className={`ml-auto flex shrink-0 items-center gap-2 ${compactBrand ? "touch:basis-full touch:justify-end" : ""}`}>{actions}</div>
  </header>;
}
