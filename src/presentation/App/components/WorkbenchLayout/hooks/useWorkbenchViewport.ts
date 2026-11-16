import { useEffect, useRef, useState } from "react";

type Viewport = { compact: boolean; narrow: boolean };
/** Observe geometry without running a screen's resize/focus policy on mount. */
export function useWorkbenchViewport(onChange: (viewport: Viewport, threshold: keyof Viewport) => void) {
  const [viewport, setViewport] = useState<Viewport>(() => ({
    compact: typeof window !== "undefined" && window.innerWidth < 1120,
    narrow: typeof window !== "undefined" && window.innerWidth < 880,
  }));
  const current = useRef(onChange); current.current = onChange;
  useEffect(() => {
    const compact = matchMedia("(max-width:1119px)"), narrow = matchMedia("(max-width:879px)");
    const update = (threshold: keyof Viewport) => {
      const next = { compact: compact.matches, narrow: narrow.matches };
      current.current(next, threshold);
      setViewport(next);
    };
    const onCompact = () => update("compact"), onNarrow = () => update("narrow");
    compact.addEventListener("change", onCompact); narrow.addEventListener("change", onNarrow);
    return () => { compact.removeEventListener("change", onCompact); narrow.removeEventListener("change", onNarrow); };
  }, []);
  return viewport;
}
