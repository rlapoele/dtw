import { AuthoredValue } from "@presentation/AuthoredValue";
import type { ProjectReadback, TokenInspection } from "@application/authoring";
import { Button } from "@presentation/components/button";
import { Swatch } from "@presentation/components/swatch";
import { identityLabels, resolvedColor } from "@presentation/readback";
import { colorPreview } from "@presentation/preview";

export function Row({t, selected, label, preview, project, onSelect}: any) { const v=t.authored.definition?.assignments[0]?.value; return (
          <button
            key={t.authored.id}
            type="button"
            className={`token-row border-0 border-b border-border hover:bg-row-hover aria-pressed:bg-selected relative grid grid-cols-2 @3xl:grid-cols-3 gap-3 items-start w-full text-left p-3 narrow:px-2 bg-transparent ${selected === t.authored.id ? "selected" : ""}`}
            aria-pressed={selected === t.authored.id}
            onClick={() => onSelect(t.authored.id)}
          >
            <span className="flex gap-3 min-w-0 items-start"><Swatch css={preview.css} />
            <span className="token-identity flex-1 min-w-0">
              <strong className="block text-xs/normal small:text-caption token-name wrap-anywhere">
                {label}
              </strong>
              <small className="block text-secondary mt-1 wrap-anywhere">
                {t.authored.layer ?? "Unspecified"} ·{" "}
                {t.authored.definition?.type ?? "Unassigned"}
              </small>
              {t.authored.description !== undefined && <span className="@3xl:hidden mt-2 line-clamp-2 whitespace-pre-wrap wrap-anywhere text-caption text-secondary">{t.authored.description}</span>}
            </span>
            </span>
            <span className="hidden @3xl:block min-w-0 text-caption text-secondary"><span className="line-clamp-2 whitespace-pre-wrap wrap-anywhere">{t.authored.description ?? "—"}</span></span>
            <span className="value-summary min-w-0 text-value text-caption wrap-anywhere"><AuthoredValue value={v} project={project} layout="compact" /></span>
          </button>
); }
