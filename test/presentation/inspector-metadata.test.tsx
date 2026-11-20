import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { expect, it } from "vitest";
import { TokenMetadata } from "@presentation/App/components/TokensWorkbench/components/SelectionInspector/components/TokenEditor/components/TokenMetadata";
import { createToken } from "@domain/token";

const token = createToken({id: 't"exact', projectId: "p", localName: "name", parentGroupId: "missing", regeneration: "protected"}, []);
it("shows exact identity and diagnostic fields directly without requesting authored data", () => {
  const html = renderToStaticMarkup(createElement(TokenMetadata, {token, groupLabels: new Map(), path: {status: "invalid", diagnostics: [{code:"missing-parent-group", entityKind:"token", entityId:token.id, parentGroupId:token.parentGroupId!}, {code:"group-cycle", cycle:["a", "b", "a"] as never}]}}));
  expect(html).toContain("Missing group"); expect(html).toContain("Project identity"); expect(html).toContain("Token identity");
  expect(html).toContain("missing-parent-group"); expect(html).toContain("group-cycle"); expect(html).toContain("Path diagnostic 2");
  expect(html).not.toContain("<details"); expect(html).not.toContain("All authored data");
});
it("preserves segment boundaries and distinguishes unavailable paths from root parents", () => {
  const render = (path: Parameters<typeof TokenMetadata>[0]["path"]) => renderToStaticMarkup(createElement(TokenMetadata, {token: {...token, parentGroupId:null}, groupLabels:new Map(), path}));
  expect(render({status:"derived", path:["a.b", "c"]})).toContain('[&quot;a.b&quot;,&quot;c&quot;]');
  const unavailable = render({status:"unavailable", reason:"Resource bound"});
  expect(unavailable).toContain("Project root"); expect(unavailable).toContain("Resource bound"); expect(unavailable).not.toContain("Path segments");
});
