import { useLayoutEffect, useRef, type ReactNode } from "react";

/** Reserve the actual sticky title height without mounting or owning editor state. */
export function InspectorHeading({ children, active = true }: { children: ReactNode; active?: boolean }) {
  const headingRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (!active) return;
    const heading = headingRef.current;
    const scroller = heading?.closest<HTMLElement>(".inspector-content");
    if (!heading || !scroller) return;
    // A wrapped title or enlarged root text must not obscure focused fields.
    const update = () => { scroller.style.scrollPaddingTop = `${heading.getBoundingClientRect().height + 8}px`; };
    update();
    const observer = new ResizeObserver(update);
    observer.observe(heading);
    return () => { observer.disconnect(); scroller.style.scrollPaddingTop = ""; };
  }, [active]);
  return <div ref={headingRef} className="inspector-heading sticky top-0 z-10 bg-surface border-b-hairline border-border p-4">{children}</div>;
}
