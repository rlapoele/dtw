import { useWorkbenchViewport } from "@presentation/App/components/WorkbenchLayout/hooks/useWorkbenchViewport";
import { useEffect, useRef } from "react";
import type { CatalogueEntry } from "@application/retention/ports";
export type ProjectsView = { selection?: CatalogueEntry; scroll: number; surface: "browse" | "inspect" };
export function useProjectsLayout(view: ProjectsView, onView: (next: ProjectsView) => void) {
  const browse = useRef<HTMLElement>(null), inspector = useRef<HTMLElement>(null), entry = useRef<HTMLButtonElement>(null);
  const current = useRef({ view, onView }); current.current = { view, onView };
  useEffect(() => {
    if (browse.current) browse.current.scrollTop = current.current.view.scroll;
  }, []);
  const { narrow } = useWorkbenchViewport((viewport, threshold) => {
    if (threshold !== "narrow") return;
    const { view, onView } = current.current;
    const modal = document.querySelector('[role="dialog"]');
    const focused = document.activeElement;
    let surface = view.selection ? view.surface : "browse" as const;
    if (!modal && view.selection && inspector.current?.contains(focused)) surface = "inspect";
    else if (!modal && browse.current?.contains(focused)) surface = "browse";
    onView({ ...view, surface });
    if (!modal && viewport.narrow && surface === "browse" && inspector.current?.contains(focused)) {
      requestAnimationFrame(() => focusHeading(browse.current));
    }
  });
  function show(surface: "browse" | "inspect") {
    onView({ ...view, surface });
    requestAnimationFrame(() => {
      if (surface === "inspect") focusHeading(inspector.current);
      else { if (browse.current) browse.current.scrollTop = view.scroll; if (entry.current) entry.current.focus({ preventScroll: true }); else focusHeading(browse.current); }
    });
  }
  return { narrow, browse, inspector, entry, show };
}

function focusHeading(pane: HTMLElement | null) {
  const heading = pane?.querySelector<HTMLElement>("h1,h2");
  if (heading) heading.tabIndex = -1;
  (heading ?? pane)?.focus({ preventScroll: true });
}
