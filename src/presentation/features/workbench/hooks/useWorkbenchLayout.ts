import { useEffect, useState } from "react";
export function useWorkbenchLayout() {
  const [compact, setCompact] = useState(window.innerWidth < 1120),
    [navigationOpen, setNavigationOpen] = useState(false),
    [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1120),
    [inspectorExpanded, setInspectorExpanded] = useState(
      window.innerWidth >= 768,
    );
  useEffect(() => {
    const media = matchMedia("(max-width:1119px)");
    const update = () => {
      setCompact(media.matches);
      if (!media.matches) setNavigationOpen(false);
    };
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);
  return {
    compact,
    navigationOpen,
    setNavigationOpen,
    sidebarExpanded,
    setSidebarExpanded,
    inspectorExpanded,
    setInspectorExpanded,
  };
}
