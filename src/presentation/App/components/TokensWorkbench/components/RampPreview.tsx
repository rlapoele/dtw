import { colorDecimalDisplay } from "@presentation/App/components/TokensWorkbench/helpers/color-decimal-display";
import type { ColorLiteralValue } from "@domain/color-literal";
import { rampPreviewKey } from "@domain/color-ramp";
import { colorPreview } from "@presentation/App/components/TokensWorkbench/helpers/color-preview";
export function RampPreview({
  steps,
  path,
  layout = "scroll",
}: {
  steps: readonly { label: string; value: ColorLiteralValue }[];
  path: string;
  layout?: "scroll" | "full" | "compact";
}) {
  const keys = new Map<string, string[]>();
  let unavailable = false;
  for (const step of steps) {
    try {
      const key = rampPreviewKey(step.value);
      keys.set(key, [...(keys.get(key) ?? []), step.label]);
    } catch {
      unavailable = true;
    }
  }
  return (
    <>
      <div className={layout === "compact" ? "flex flex-wrap gap-1" : layout === "scroll" ? "max-h-80 overflow-auto space-y-2" : "space-y-2"}>
        {steps.map((step) => (
          <div
            key={step.label}
            className={layout === "compact" ? "flex flex-col gap-1 items-center text-caption" : "flex gap-3 items-start border-b border-border py-2"}
          >
            <span
              className="size-10 shrink-0 rounded"
              style={{ background: colorPreview(step.value).css }}
            />
            {layout === "compact" ? <span>{step.label}</span> : <div className="min-w-0 text-caption wrap-anywhere">
              <strong>
                {path} / {step.label}
              </strong>
              <p title={`${step.value.colorSpace} ${step.value.components.join(" / ")} · Alpha ${step.value.alpha}`}>
                {step.value.colorSpace} {step.value.components.map(colorDecimalDisplay).join(" / ")} ·
                Alpha {colorDecimalDisplay(step.value.alpha)}
              </p>
              <p>
                {(() => {
                  try {
                    return (
                      "sRGB HEX preview #" +
                      rampPreviewKey(step.value)
                        .split("/")[0]
                        .split(",")
                        .map((n) => Number(n).toString(16).padStart(2, "0"))
                        .join("")
                        .toUpperCase()
                    );
                  } catch {
                    return "sRGB preview unavailable";
                  }
                })()}
              </p>
            </div>}
          </div>
        ))}
      </div>
      {[...keys.values()]
        .filter((v) => v.length > 1)
        .map((v) => (
          <p key={v.join()} role="status">
            Repeated sRGB previews: {v.join(", ")}. Authored colors may differ.
          </p>
        ))}
      {unavailable && <p>Some sRGB preview comparisons are unavailable.</p>}
    </>
  );
}
