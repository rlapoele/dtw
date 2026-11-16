import { useWorkbenchViewport } from "@presentation/App/components/WorkbenchLayout/hooks/useWorkbenchViewport";
import { useRef, useState } from "react";
export function useTokensLayout() {
  const [surface, setSurface] = useState<"browse" | "inspect">("browse");
  const [navigationOpen, setNavigationOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const [inspectorExpanded, setInspectorExpanded] = useState(true);
  const browse = useRef<HTMLElement>(null), inspector = useRef<HTMLElement>(null), reopen = useRef<HTMLButtonElement>(null);
  const navigationTrigger = useRef<HTMLButtonElement>(null);
  const navigationReturn = useRef<"trigger" | "workspace">("trigger");
  const current = useRef({ surface, inspectorExpanded }); current.current = { surface, inspectorExpanded };
  const { compact, narrow } = useWorkbenchViewport(viewport => {
    const focused = document.activeElement;
    const modal = document.querySelector('[role="dialog"]');
    const drawer = modal?.classList?.contains("navigation-drawer");
    const navigationFocused = (focused as HTMLElement | null)?.closest?.(".sidebar,.navigation-drawer");
    let next = current.current.surface;
    if (!modal || drawer) {
      if (inspector.current?.contains(focused) && current.current.inspectorExpanded) next = "inspect";
      else if (browse.current?.contains(focused)) next = "browse";
      if (!current.current.inspectorExpanded) next = "browse";
    }
    setSurface(next);
    if (!viewport.compact) setNavigationOpen(false);
    if (!modal || drawer) requestAnimationFrame(() => {
      if (navigationFocused) {
        if (drawer && viewport.compact) return;
        if (viewport.compact) navigationTrigger.current?.focus({ preventScroll: true });
        else document.querySelector<HTMLElement>('.sidebar [aria-current], .sidebar button')?.focus({ preventScroll: true });
        return;
      }
      if (!viewport.narrow) return;
      if (next === "browse" && inspector.current?.contains(focused)) focusHeading(browse.current);
      else if (next === "inspect" && browse.current?.contains(focused)) focusHeading(inspector.current);
    });
  });
  function showInspector() {
    setInspectorExpanded(true); setSurface("inspect");
    requestAnimationFrame(() => focusHeading(inspector.current));
  }
  function back(moveFocus = true) {
    setSurface("browse");
    if (!moveFocus) return;
    requestAnimationFrame(() => { if (reopen.current) reopen.current.focus({ preventScroll: true }); else { const row = browse.current?.querySelector<HTMLElement>('[aria-pressed="true"]'); if (row) row.focus({ preventScroll: true }); else focusHeading(browse.current); } });
  }
  function navigationFinalFocus() {
    if (document.querySelector('[role="dialog"]:not(.navigation-drawer)')) return false;
    if (navigationReturn.current === "workspace") {
      const heading = browse.current?.querySelector<HTMLElement>("h1");
      if (heading) heading.tabIndex = -1;
      return heading ?? browse.current;
    }
    return navigationTrigger.current;
  }
  return { navigationTrigger, navigationReturn, navigationFinalFocus, compact, narrow, surface, browse, inspector, reopen, showInspector, back, navigationOpen, setNavigationOpen, sidebarExpanded, setSidebarExpanded, inspectorExpanded, setInspectorExpanded };
}

function focusHeading(pane: HTMLElement | null) {
  const heading = pane?.querySelector?.<HTMLElement>("h1,h2");
  if (heading) heading.tabIndex = -1;
  (heading ?? pane)?.focus({ preventScroll: true });
}
