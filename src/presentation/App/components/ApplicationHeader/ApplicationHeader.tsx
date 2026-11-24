import type { ReactNode } from "react";
import { Icon } from "@presentation/ui/icon";
export function ApplicationHeader({ navigation, context, actions, compactBrand = false }: { navigation?: ReactNode; context?: ReactNode; actions?: ReactNode; compactBrand?: boolean }) {
  return <header className={`application-header ${compactBrand ? "compact-brand" : ""} shrink-0 border-b-hairline border-border flex items-center gap-4 px-5 py-3 min-h-16 mobile:flex-wrap mobile:gap-2 mobile:px-4`}>
    {navigation}<div className={`brand mobile:text-caption ${compactBrand ? "mobile:hidden" : ""} flex items-center gap-2 min-w-0`}><Icon name="stack" /><strong>Token Workbench</strong></div>
    {context && <div className={`application-context min-w-0 text-muted-foreground wrap-anywhere mobile:text-caption ${compactBrand ? "mobile:order-0 mobile:flex-1" : "mobile:order-3 mobile:basis-full"}`}>{context}</div>}
    <div className={`ml-auto flex shrink-0 items-center gap-2 ${compactBrand ? "mobile:basis-full mobile:justify-end" : ""}`}>{actions}</div>
  </header>;
}
