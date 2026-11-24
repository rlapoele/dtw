import { typeIcon } from "@presentation/App/components/TokensWorkbench/helpers/token-type-presentation";
import { useMemo } from "react";
import type { DisplayRow, ProjectContext } from "@application/retention/projections";
import { Button } from "@presentation/ui/button";
import { Icon } from "@presentation/ui/icon";
import { identityLabels, namespaceEntryDetails } from "@presentation/App/components/TokensWorkbench/helpers/identity-labels";
import { TokenValue } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/TokenTable/components/TokenValue";

const title = (value: string) => value.charAt(0).toUpperCase() + value.slice(1);

export function TokenTable({ context, creationParentLabel = "Project root", rows, selected, query, onSelect, onEmptyAction, onOpenRamp, rampNavigationBlocked = false }: {
  context: ProjectContext;
  creationParentLabel?: string;
  rows: readonly DisplayRow[];
  selected: string | null;
  query: string;
  onSelect(id: string): void;
  onEmptyAction(): void;
  onOpenRamp?(groupId: string): void;
  rampNavigationBlocked?: boolean;
}) {
  const identity = useMemo(() => ({ labels: identityLabels(context.tokens), details: namespaceEntryDetails(context),
    tokens: new Map(context.tokens.map(token => [token.authored.id as string, token])) }), [context]);
  const ramps = useMemo(() => {
    const labels = identityLabels(context.groups, ["Project root", "All tokens"]);
    return new Map(context.groups.flatMap(group => (group.authored.colorRamp?.members ?? []).map(member =>
      [member.tokenId, { id: group.authored.id, label: labels.get(group.authored.id) ?? group.authored.localName }] as const)));
  }, [context]);
  return (
    <div className="token-table @container border-t-hairline border-border">
      <div className="table-heading border-b-hairline border-border p-3 mobile:px-2 grid grid-cols-2 @3xl:grid-cols-12 compact:@3xl:grid-cols-2 mobile:grid-cols-1 mobile:@3xl:grid-cols-1 gap-3 text-muted-foreground">
        <span className="@3xl:col-span-4 compact:@3xl:col-span-1">Token</span>
        <span className="hidden @3xl:block @3xl:col-span-2 compact:@3xl:hidden">Type</span>
        <span className="hidden @3xl:block compact:@3xl:hidden">Layer</span>
        <span className="@3xl:col-span-5 compact:@3xl:col-span-1 mobile:hidden">Value</span>
      </div>
      {rows.map(row => {
        const token = identity.tokens.get(row.id);
        const detail = identity.details.get(JSON.stringify(["token", row.id]));
        const layer = row.layer === "Unspecified" ? "—" : title(row.layer);
        const ramp = ramps.get(row.id);
        return <div key={row.id}
          className={`token-row border-0 border-b-hairline border-border hover:bg-row-hover relative grid grid-cols-2 @3xl:grid-cols-12 compact:@3xl:grid-cols-2 mobile:grid-cols-1 mobile:@3xl:grid-cols-1 gap-3 items-start w-full text-left p-3 mobile:px-2 ${selected === row.id ? "selected bg-selected" : "bg-transparent"}`}
          >
          <span className="block min-w-0 @3xl:col-span-4 compact:@3xl:col-span-1">
            <button type="button" className="flex gap-3 min-w-0 items-start w-full text-left rounded-sm" aria-pressed={selected === row.id} onClick={() => onSelect(row.id)}>
            <span className="token-identity flex-1 min-w-0">
              <span className="flex items-start gap-1.5"><strong className="text-xs/normal mobile:text-caption token-name wrap-anywhere">{token?.authored.localName || "(unnamed)"}</strong>{row.regeneration === "protected" && <Icon name="protected" label="Protected from regeneration" className="text-muted-foreground" />}</span>
              <span className="block text-caption font-mono text-muted-foreground mt-1 wrap-anywhere">{identity.labels.get(row.id) ?? row.label}</span>
              <span className="flex items-center gap-1.5 mt-2 text-caption text-muted-foreground @3xl:hidden compact:@3xl:flex"><Icon name={typeIcon(row.type)} />{title(row.type)} · {layer}</span>
              {detail && <span className="block text-caption wrap-anywhere mt-1">{detail}</span>}
              {row.description !== undefined && <span className="hidden @3xl:line-clamp-1 compact:@3xl:hidden mt-2 text-caption text-muted-foreground wrap-anywhere">{row.description}</span>}
            </span>
            </button>
            {ramp && onOpenRamp && <button type="button" disabled={rampNavigationBlocked}
              className="flex items-center gap-1.5 min-h-9 mt-1 text-caption text-muted-foreground hover:text-foreground rounded-sm text-left wrap-anywhere disabled:opacity-45 disabled:cursor-default"
              onClick={() => onOpenRamp(ramp.id)}><Icon name="swatch" />Ramp · {ramp.label}</button>}
          </span>
          <span className="hidden @3xl:flex @3xl:col-span-2 compact:@3xl:hidden items-center gap-1.5 min-w-0 text-caption text-muted-foreground wrap-anywhere"><Icon name={typeIcon(row.type)} />{title(row.type)}</span>
          <span className="hidden @3xl:block compact:@3xl:hidden text-caption text-muted-foreground">{layer}</span>
          <span className="min-w-0 @3xl:col-span-5 compact:@3xl:col-span-1"><TokenValue row={row} targetLabel={row.targetId === undefined ? undefined : identity.labels.get(row.targetId)} /></span>
        </div>;
      })}
      {rows.length === 0 && (
        <div className="empty px-5 py-17.5 text-center text-muted-foreground">
          <h2 className="text-foreground text-base/normal">
            {query
              ? "No matching tokens"
              : context.tokens.length
                ? "This group is empty"
                : "Your project is empty"}
          </h2>
          <p className="text-xs/normal mt-2 mb-5">
            {query
              ? "Try another search or clear it to see this view."
              : `Create a token in ${creationParentLabel}.`}
          </p>
          <Button onClick={onEmptyAction}>
            {query ? "Clear search" : "New token"}
          </Button>
        </div>
      )}
    </div>
  );
}
