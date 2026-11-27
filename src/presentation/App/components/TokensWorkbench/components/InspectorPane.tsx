import type { ReactNode, Ref } from "react";

/** Shared pane geometry only; callers retain content, drafts and portal targets. */
export function InspectorPane({ children, surfaceRef, hidden, as: Element = "section" }: {
  children: ReactNode;
  surfaceRef?: Ref<HTMLElement>;
  hidden?: boolean;
  as?: "section" | "aside";
}) {
  return (
    <Element ref={surfaceRef} hidden={hidden} tabIndex={-1}
      className="inspector-shell relative mobile:border-l-0 mobile:border-t-hairline mobile:isolate flex min-w-0 min-h-0 flex-col overflow-clip border-l-hairline border-border bg-surface"
      aria-label="Inspector pane"
    >
      {children}
    </Element>
  );
}
