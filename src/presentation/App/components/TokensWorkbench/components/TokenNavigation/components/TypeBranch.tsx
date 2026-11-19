import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
import { scopeKey, type TokenBrowseView } from "@presentation/App/components/TokensWorkbench/helpers/browse-view";
import { typeIcon } from "@presentation/App/components/TokensWorkbench/helpers/token-type-presentation";
import type { NavigationBranch } from "@presentation/App/components/TokensWorkbench/helpers/token-navigation";
export function TypeBranch({branch, depth, view, collapsed, onToggle, onSelect}: {
  branch: NavigationBranch; depth: number; view: TokenBrowseView; collapsed: ReadonlySet<string>;
  onToggle(key: string): void; onSelect(view: TokenBrowseView): void;
}) {
  const key = scopeKey(branch.scope), active = scopeKey(view) === key;
  const expandable = !!branch.children?.length, open = branch.count === 1 || !collapsed.has(key);
  return <div>
    <div className={`navigation-row relative flex items-center hover:bg-accent ${active ? "active bg-selected" : ""} ${depth === 2 ? "pl-9.5" : depth === 1 ? "pl-6.5" : ""}`}>
      <Button variant="navigation" size="navigation" className={`nav-item min-w-0 flex-1 ${active ? "active" : ""}`} aria-current={active ? "page" : undefined} onClick={() => onSelect(branch.scope)}>
        {depth === 0 && <Icon name={typeIcon(branch.scope.type)} />}
        <span className="min-w-0 flex-1 text-left wrap-anywhere">{branch.label}</span>
        <span className="text-muted-foreground font-normal">{branch.count}</span>
      </Button>
      {expandable && branch.count > 1 ? <Button variant="plain" size="icon" aria-label={`${open ? "Collapse" : "Expand"} ${branch.label}`} aria-expanded={open} onClick={() => onToggle(key)}>
        <Icon name="chevron-right" className={`navigation-chevron size-3 ${open ? "rotate-90" : ""}`} />
      </Button> : <span className="size-9 shrink-0" aria-hidden="true" />}
    </div>
    {expandable && <div className="navigation-children" data-expanded={open} inert={!open} aria-hidden={!open}>
      <div className="min-h-0 overflow-hidden">{branch.children!.map(child => <TypeBranch key={scopeKey(child.scope)} branch={child} depth={depth + 1} view={view} collapsed={collapsed} onToggle={onToggle} onSelect={onSelect} />)}</div>
    </div>}
  </div>;
}
