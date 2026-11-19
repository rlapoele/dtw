import { TokenSwatch } from "@presentation/App/components/TokensWorkbench/components/TokenSwatch";
import { colorPreview } from "@presentation/App/components/TokensWorkbench/helpers/color-preview";
import { memo, useMemo } from "react";
import { convertColor } from "@domain/color-calculation";
import { COLOR_SPACES, type ColorLiteralValue } from "@domain/color-literal";
import type { DisplayRow } from "@application/retention/projections";
import { authoredColorCoordinates, spaceName } from "@presentation/App/components/TokensWorkbench/helpers/authored-color";
import { colorDecimalDisplay } from "@presentation/App/components/TokensWorkbench/helpers/color-decimal-display";
import { Icon } from "@presentation/ui/icon";
import { hexPreview } from "@presentation/App/components/TokensWorkbench/components/TokenWorkspace/components/TokenTable/helpers/hex-preview";

const ColorRepresentations = memo(function ColorRepresentations({ source, authored }: { source: ColorLiteralValue; authored: boolean }) {
  const display = useMemo(() => ({
    hex: hexPreview(source),
    spaces: COLOR_SPACES.map(space => {
      const converted = convertColor(source, space);
      return { space, coordinates: converted.ok ? authoredColorCoordinates(converted.value, "compact", true).slice(0, 3).join(" · ") : "Unavailable" };
    }),
  }), [source]);
  return <>
    <span className="block font-medium text-foreground" title={display.hex}>{display.hex.match(/#[0-9A-F]{6}/)?.[0] ?? "HEX unavailable"}</span>
    <span className="block mt-2 space-y-1">
      {display.spaces.map(({ space, coordinates }) => <span key={space}
        className={`${space === source.colorSpace ? "block" : "hidden @3xl:block compact:@3xl:hidden"} ${authored && space === source.colorSpace ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
        <span className="block">{spaceName(space)}</span>
        <span className="block">{coordinates}</span>
      </span>)}
    </span>
    <span className="block mt-2 text-muted-foreground">Alpha {colorDecimalDisplay(source.alpha)}</span>
  </>;
});

export function TokenValue({ row, targetLabel }: { row: DisplayRow; targetLabel?: string }) {
  return <span className="value-summary flex gap-3 min-w-0 text-value text-caption font-mono wrap-anywhere">
    {row.type === "color" && <TokenSwatch css={colorPreview(row.preview).css} />}
    <span className="block min-w-0">
    {row.targetId !== undefined && <span className="flex items-start gap-1.5 mb-2 text-foreground"><Icon name="link" /><span>{targetLabel ?? `Missing target · ${row.targetId}`}</span></span>}
    {row.referenceDetail && <span className="block text-muted-foreground">{row.referenceDetail}</span>}
    {row.preview ? <ColorRepresentations source={row.preview} authored={!!row.color} /> : row.type === "color" ? <span className="text-muted-foreground">HEX unavailable · Color unavailable</span> : row.quantity ? <span className="flex gap-1.5 items-center"><Icon name={row.type === "duration" ? "clock" : "dimension"} />{row.quantity.value} {row.quantity.unit}</span> : <span className="text-muted-foreground">{row.targetId !== undefined ? "Resolved preview unavailable" : row.valueKind}</span>}
    </span>
  </span>;
}
