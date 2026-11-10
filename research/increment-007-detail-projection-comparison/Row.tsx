import {Swatch} from "@presentation/components/swatch";
import {Summary} from "./Summary";
import type {RowData} from "./projections";
export function Row({t,selected,onSelect}:{t:RowData;selected?:string;onSelect:(id:string)=>void}){return (
          <button
            key={t.id}
            type="button"
            className={`token-row border-0 border-b border-border hover:bg-row-hover aria-pressed:bg-selected relative grid grid-cols-2 @3xl:grid-cols-3 gap-3 items-start w-full text-left p-3 narrow:px-2 bg-transparent ${selected === t.id ? "selected" : ""}`}
            aria-pressed={selected === t.id}
            onClick={() => onSelect(t.id)}
          >
            <span className="flex gap-3 min-w-0 items-start"><Swatch css={t.preview.css} />
            <span className="token-identity flex-1 min-w-0">
              <strong className="block text-xs/normal small:text-caption token-name wrap-anywhere">
                {t.label}
              </strong>
              <small className="block text-secondary mt-1 wrap-anywhere">
                {t.layer ?? "Unspecified"} ·{" "}
                {t.type ?? "Unassigned"}
              </small>
              {t.description !== undefined && <span className="@3xl:hidden mt-2 line-clamp-2 whitespace-pre-wrap wrap-anywhere text-caption text-secondary">{t.description}</span>}
            </span>
            </span>
            <span className="hidden @3xl:block min-w-0 text-caption text-secondary"><span className="line-clamp-2 whitespace-pre-wrap wrap-anywhere">{t.description ?? "—"}</span></span>
            <span className="value-summary min-w-0 text-value text-caption wrap-anywhere"><Summary data={t.summary} layout="compact" /></span>
          </button>
);}
