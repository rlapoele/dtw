import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { FolderIcon, PlusIcon } from "@heroicons/react/24/outline";
import { describe, expect, it } from "vitest";
import { Icon } from "@presentation/components/ui/icon";
import { cn } from "@presentation/lib/cn";

const render = (props: Parameters<typeof Icon>[0]) =>
  renderToStaticMarkup(createElement(Icon, props));
const paths = (html: string) => html.match(/<path\b[^>]*>/g);

describe("shared icons", () => {
  it("selects the requested outline glyph and defaults to decorative semantics", () => {
    expect(paths(render({ name: "plus" })))
      .toEqual(paths(renderToStaticMarkup(createElement(PlusIcon))));
    expect(paths(render({ name: "folder" })))
      .toEqual(paths(renderToStaticMarkup(createElement(FolderIcon))));
    const html = render({ name: "plus" });
    expect(html).toContain('class="size-4 shrink-0"');
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('focusable="false"');
  });
  it("lets caller classes override defaults while preserving marker classes", () => {
    const html = render({ name: "menu", className: "size-5 text-muted-foreground icon" });
    expect(html).toContain("size-5");
    expect(html).not.toContain("size-4");
    expect(html).toContain("shrink-0");
    expect(html).toContain("text-muted-foreground icon");
  });
  it("labels meaningful icons and forwards ordinary SVG props", () => {
    const html = render({ name: "info", label: "Information", strokeWidth: 2, id: "status-icon" });
    expect(html).toContain('role="img"');
    expect(html).toContain('aria-label="Information"');
    expect(html).not.toContain('aria-hidden="true"');
    expect(html).toContain('stroke-width="2"');
    expect(html).toContain('id="status-icon"');
  });
});

describe("shared cn", () => {
  it("combines conditional classes and resolves Tailwind conflicts", () => {
    expect(cn("size-4", false && "hidden", { "text-muted-foreground": true }, "size-5"))
      .toBe("text-muted-foreground size-5");
  });
  it("understands the project's caption size and heading weight", () => {
    expect(cn("text-caption", "text-muted-foreground")).toBe("text-caption text-muted-foreground");
    expect(cn("text-caption", "text-sm")).toBe("text-sm");
    expect(cn("font-heading", "font-semibold")).toBe("font-semibold");
    expect(cn("font-sans", "font-heading")).toBe("font-sans font-heading");
  });
  it("retains full class-group support beyond current icon classes", () => {
    expect(cn("rotate-12", "rotate-45")).toBe("rotate-45");
    expect(cn("md:size-4", "size-5", "md:size-6")).toBe("size-5 md:size-6");
    expect(cn("font-black", "font-light")).toBe("font-light");
  });
});
