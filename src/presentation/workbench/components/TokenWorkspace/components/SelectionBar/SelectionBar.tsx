import type { Ref } from "react";
import { Button } from "@presentation/ui/button";
export function SelectionBar({ label, dirty, editable, onInspect, actionRef }: { label: string; dirty: boolean; editable: boolean; onInspect: () => void; actionRef: Ref<HTMLButtonElement> }) {
  return <section className="selection-bar flex flex-wrap items-center justify-between gap-3 border border-border bg-muted p-3 rounded-md mb-4"><div className="min-w-0"><p className="wrap-anywhere">{label}</p>{dirty && <p className="text-caption text-muted-foreground">Unapplied changes</p>}</div><Button ref={actionRef} onClick={onInspect}>{editable ? "Edit token" : "Inspect selection"}</Button></section>;
}
