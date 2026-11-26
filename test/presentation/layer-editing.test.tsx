import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { createAuthoringOperations } from "@application/authoring";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
import { useTokenEditor } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/hooks/useTokenEditor";
import { TokenEditorContent } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenEditorContent";

it.each(["authored", "resolved"])("renders one shared editable layer and action region on the %s tab", tab => {
  const app = createAuthoringOperations(new InMemoryProjectStorage());
  app.createProject({id: "p", name: "Project"});
  app.createColorToken({projectId: "p", id: "t", localName: "color", parentGroupId: null, type: "color", layer: "primitive", regeneration: "allowed", value: {kind: "literal", colorSpace: "srgb", components: ["0", "0", "0"], alpha: "1"}});
  const project = app.readProject("p"), inspection = app.inspectToken("p", "t");
  if (project.status !== "ok" || inspection.status !== "ok") throw Error("Fixture unavailable");
  function Content() {
    const editor = useTokenEditor({project: project.status === "ok" ? project.value : undefined!, inspection: inspection.status === "ok" ? inspection.value : undefined!, inspect: () => undefined, onApply: () => {throw Error("No render mutation");}, onDirty() {}, readUnavailable: false});
    return createElement(TokenEditorContent, {editor: {...editor, tab, dirty: true, session: {...editor.session, literal: {...editor.session.literal, components: ["1", "0", "0"]}, mode: "reference", reference: "target", byteInvalid: true, layer: "semantic"}}});
  }
  const html = renderToStaticMarkup(createElement(Content));
  if (tab === "authored") {
    const summary = html.slice(html.indexOf("Currently applied"), html.indexOf("Metadata"));
    expect(summary).toContain("HEX (sRGB preview)");
    expect(summary).toContain("#000000");
    expect(summary).not.toContain("#FF0000");
  }
  expect(html).toContain("Description</label>");
  expect(html).toContain('<details open="">');
  expect((html.match(/>Regeneration</g) ?? [])).toHaveLength(tab === "authored" ? 1 : 0);
  expect(html).toContain('value="semantic" selected=""');
  expect(html).toContain('value="component" disabled=""');
  expect(html).toContain("Component requires a component association");
  expect((html.match(/>Apply changes<\/button>/g) ?? [])).toHaveLength(1);
  expect((html.match(/>Cancel<\/button>/g) ?? [])).toHaveLength(1);
  expect(html).not.toMatch(/<button[^>]* disabled=""[^>]*>Apply changes/);
  expect(html.indexOf(">Layer</label>")).toBeLessThan(html.indexOf('role="tablist"'));
  expect((html.match(/role="tabpanel"/g) ?? [])).toHaveLength(1);
  expect(html.indexOf("editor-actions")).toBeLessThan(html.indexOf('role="tabpanel"'));
  if (tab === "authored") {
    expect(html.indexOf("editor-actions")).toBeGreaterThan(html.indexOf("Draft preview:"));
    expect(html.indexOf("editor-actions")).toBeLessThan(html.indexOf("Currently applied"));
    expect(html.indexOf("editor-actions")).toBeLessThan(html.indexOf("Metadata"));
  } else {
    expect(html).not.toContain("Currently applied");
    expect(html.indexOf("editor-actions")).toBeLessThan(html.indexOf("Resolved value"));
  }
});
