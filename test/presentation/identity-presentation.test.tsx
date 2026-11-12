import { describe, it, expect } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TokenList } from "@presentation/features/workbench/components/TokenList";
import { ProjectNavigation } from "@presentation/features/workbench/components/ProjectNavigation";
import { AuthoredValue } from "@presentation/features/workbench/components/AuthoredValue";
import { Editor } from "@presentation/features/workbench/components/Editor";
import { identityLabels } from "@presentation/features/workbench/readback";
import { createColorLiteral } from "@domain/color-literal";
import { createToken } from "@domain/token";
import { createTokenGroup } from "@domain/token-group";
import { createProject } from "@domain/project";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
import { createAuthoringOperations } from "@application/authoring";
import { ColorFields } from "@presentation/features/workbench/components/ColorFields";
import {
  baseline,
  editComponent,
} from "@presentation/features/workbench/state/session";
import type { DraftSession } from "@presentation/features/workbench/state/session";
import type {
  ApplicationResult,
  TokenInspection,
} from "@application/authoring";
function ok<T>(r: ApplicationResult<T>): T {
  if (r.status !== "ok") throw new Error(JSON.stringify(r));
  return r.value;
}
function setup() {
  const groups = ["shared-prefix-group-a", "shared-prefix-group-b"].map((id) =>
    createTokenGroup({
      id,
      projectId: "p",
      localName: "same",
      parentGroupId: null,
    }),
  );
  const literal = createColorLiteral({
    colorSpace: "srgb",
    components: ["0.2314", "0.4", "0.6"],
    alpha: "1",
  });
  const specs = [
    ["shared-prefix-token-a", "same", null],
    ["shared-prefix-token-b", "same", null],
    ["empty-a", "", null],
    ["fallback-b", "(unnamed)", null],
    ["invalid-a", "x", "absent"],
    ["invalid-b", "(invalid namespace)", null],
    ["unique-token-id", "unique", "shared-prefix-group-a"],
    ["space-a", "a  b", null],
    ["space-b", "a b", null],
    ["suffix-like", "same · shared-prefix-token-a", null],
    ["placeholder-token", "Choose a color token…", null],
    ["missing-label-token", "Missing target", null],
  ] as const;
  const tokens = specs.map(([id, localName, parentGroupId]) =>
    createToken(
      {
        id,
        projectId: "p",
        localName,
        parentGroupId,
        regeneration: "allowed",
        layer: "primitive",
        definition: {
          type: "color",
          assignments: [{ condition: [], value: literal }],
        },
      },
      [],
    ),
  );
  const storage = new InMemoryProjectStorage([
    { project: createProject({ id: "p", name: "Fixture" }), groups, tokens },
  ]);
  return createAuthoringOperations(storage);
}
describe("human identity labels in real consumers", () => {
  it("renders collision-safe rows/navigation and retains selected identity", () => {
    const app = setup(),
      project = ok(app.readProject("p"));
    const labels = identityLabels(project.tokens);
    expect(new Set(labels.values()).size).toBe(project.tokens.length);
    expect(labels.get("shared-prefix-token-a")).toBe(
      "same · shared-prefix-token-a",
    );
    expect(labels.get("space-a")).toContain("space-a");
    expect(labels.get("space-b")).toContain("space-b");
    expect(labels.get("suffix-like")).toContain("suffix-like");
    expect(labels.get("shared-prefix-token-b")).toBe(
      "same · shared-prefix-token-b",
    );
    expect(labels.get("empty-a")).toContain("empty-a");
    expect(labels.get("fallback-b")).toContain("fallback");
    expect(labels.get("unique-token-id")).toBe("same / unique");
    expect(labels.get("placeholder-token")).toContain("placehol");
    expect(labels.get("missing-label-token")).toContain("missing-");
    const html = renderToStaticMarkup(
      createElement(TokenList, {
        project,
        visible: project.tokens,
        selected: "unique-token-id",
        query: "",
        inspect: (id) => ok(app.inspectToken("p", id)),
        onSelect: () => {},
        onEmptyAction: () => {},
      }),
    );
    expect(html).toContain('aria-pressed="true"');
    expect(html).toContain("same · shared-prefix-token-a");
    expect(html).toContain("same · shared-prefix-token-b");
    expect(html).not.toContain("unique-token-id");
    expect(html).toContain("same / unique");
    const nav = renderToStaticMarkup(
      createElement(ProjectNavigation, {
        drawer: false,
        project,
        group: "shared-prefix-group-b",
        unavailable: false,
        onSelect: () => {},
        onCreateGroup: () => {},
      }),
    );
    expect(nav).toContain("same · shared-prefix-group-a");
    expect(nav).toContain("same · shared-prefix-group-b");
    expect(nav).toContain('aria-current="true"');
  });
  it("keeps readable references quiet and defers exact technical JSON until disclosure", () => {
    const app = setup(),
      project = ok(app.readProject("p"));
    const ref = {
      kind: "token-reference",
      targetTokenId: project.tokens[6].authored.id,
      valuePath: [],
    } as const;
    const html = renderToStaticMarkup(
      createElement(AuthoredValue, { project, value: ref }),
    );
    expect(html).toContain("same / unique");
    expect(html).not.toContain("unique-token-id");
    const missing = renderToStaticMarkup(
      createElement(AuthoredValue, {
        project,
        value: {
          ...ref,
          targetTokenId: "missing-secret-id" as typeof ref.targetTokenId,
        },
      }),
    );
    expect(missing).toContain("Missing target");
    expect(missing).not.toContain("missing-secret-id");
    const editor = renderToStaticMarkup(
      createElement(Editor, {
        project,
        inspection: ok(app.inspectToken("p", "unique-token-id")),
        inspect: (id) => ok(app.inspectToken("p", id)),
        onApply: () => {
          throw new Error("No render mutation");
        },
        onDirty: () => {},
        readUnavailable: false,
      }),
    );
    expect(editor).toContain("All authored data");
    expect(editor).not.toContain("&quot;id&quot;: &quot;unique-token-id&quot;");
    expect(editor).toContain(
      "Opening very large exact source may briefly pause this view.",
    );
    expect(editor).not.toContain("Complete applied authored data");
    expect(editor).not.toContain("Token unique-token-id");
    const targetInspection = ok(app.inspectToken("p", "unique-token-id"));
    const aliasInspection: TokenInspection = {
      ...targetInspection,
      authored: {
        ...targetInspection.authored,
        definition: {
          type: "color",
          assignments: [
            {
              condition:
                targetInspection.authored.definition!.assignments[0].condition,
              value: ref,
            },
          ],
        },
      },
    };
    const referenceEditor = renderToStaticMarkup(
      createElement(Editor, {
        project,
        inspection: aliasInspection,
        inspect: (id) => ok(app.inspectToken("p", id)),
        onApply: () => {
          throw new Error("No render mutation");
        },
        onDirty: () => {},
        readUnavailable: false,
      }),
    );
    expect(referenceEditor).toContain(
      '<option value="&quot;unique-token-id&quot;" selected="">same / unique (this token)</option>',
    );
    expect(referenceEditor).toContain(
      '<option value="&quot;shared-prefix-token-a&quot;">same · shared-prefix-token-a</option>',
    );
  });
  it("refreshes names after rename while preserving alias targets and values", () => {
    const app = createAuthoringOperations(new InMemoryProjectStorage());
    ok(app.createProject({ id: "p", name: "P" }));
    ok(
      app.createGroup({
        id: "group-stable",
        projectId: "p",
        localName: "before",
        parentGroupId: null,
      }),
    );
    ok(
      app.createColorToken({
        id: "target-stable",
        projectId: "p",
        localName: "base",
        parentGroupId: "group-stable",
        type: "color",
        regeneration: "allowed",
        value: {
          kind: "literal",
          colorSpace: "srgb",
          components: ["0", "0", "0"],
          alpha: "1",
        },
      }),
    );
    ok(
      app.createColorToken({
        id: "alias-stable",
        projectId: "p",
        localName: "alias",
        parentGroupId: null,
        type: "color",
        regeneration: "allowed",
        value: {
          kind: "token-reference",
          targetTokenId: "target-stable",
          valuePath: [],
        },
      }),
    );
    ok(app.renameGroup("p", "group-stable", "after"));
    const project = ok(app.readProject("p")),
      alias = project.tokens.find((t) => t.authored.id === "alias-stable")!;
    expect(alias.authored.definition?.assignments[0].value).toMatchObject({
      targetTokenId: "target-stable",
    });
    const html = renderToStaticMarkup(
      createElement(AuthoredValue, {
        project,
        value: alias.authored.definition!.assignments[0].value,
      }),
    );
    expect(html).toContain("after / base");
    expect(html).not.toContain("before");
    expect(identityLabels(project.tokens).get("target-stable")).toBe(
      "after / base",
    );
  });
});

describe("integer RGB rendered fields", () => {
  it("associates approximation and errors and guards sliders with exact source", () => {
    const source = createColorLiteral({
      colorSpace: "srgb",
      components: [
        "-0.000000000000000000001",
        "1.000000000000000000001",
        "0.2314",
      ],
      alpha: "1",
    });
    const s = { ...baseline(source), scale: "bytes" as const };
    const render = (session: DraftSession) =>
      renderToStaticMarkup(
        createElement(ColorFields, {
          session,
          onChange: () => {},
          onError: () => {},
        }),
      );
    const html = render(s);
    expect(html).toContain('value="0"');
    expect(html).toContain('value="255"');
    expect(html).not.toContain('aria-label="Red slider"');
    expect(html).not.toContain('aria-label="Green slider"');
    expect(html).toContain('aria-label="Blue slider"');
    expect(html).toContain("Approximate · exact normalized 0.2314");
    expect(html).toContain(
      'aria-describedby="range-note-2 byte-note-2 editor-error"',
    );
    const invalid = render(editComponent(s, 2, "59.5"));
    expect(invalid).toContain('value="59.5"');
    expect(invalid).toContain('aria-invalid="true"');
    expect(invalid).toContain("Enter a canonical whole number or none.");
    expect(invalid).not.toContain('aria-label="Blue slider"');
    const exact = render(editComponent(s, 2, "51"));
    expect(exact).not.toContain("Approximate · exact normalized 0.2");
  });
});

describe("opaque identity suffix exhaustion", () => {
  const entries = (values: readonly (readonly [string, string])[]) =>
    values.map(([id, name]) => ({
      authored: { id },
      path: { status: "derived" as const, path: [name] },
    }));
  it("distinguishes opaque IDs whose full text collapses in normal rendering", () => {
    const labels = identityLabels(
      entries([
        ["a  b", "same"],
        ["a b", "same"],
      ]),
    );
    expect(labels.get("a  b")).toBe("same · id:0061002000200062");
    expect(labels.get("a b")).toBe("same · id:006100200062");
  });
  it("bounds deliberate base-plus-full-suffix collisions across the whole set", () => {
    const source = entries([
      ["a · b", "x"],
      ["q", "x"],
      ["b", "x · a"],
      ["r", "x · a"],
    ]);
    const labels = identityLabels(source);
    expect(new Set(labels.values()).size).toBe(4);
    expect(labels.get("a · b")).toBe("x · id:0061002000b700200062");
    expect(labels.get("b")).toBe("x · a · id:0062");
    // An otherwise unique authored name may match an escaped generated label.
    const withName = identityLabels([
      ...source,
      ...entries([["extra", "x · id:0061002000b700200062"]]),
    ]);
    expect(new Set(withName.values()).size).toBe(5);
    expect(withName.get("extra")).toContain(" · id:00650078007400720061");
  });
  it("diagnoses duplicate stable IDs instead of looping", () => {
    expect(() =>
      identityLabels(
        entries([
          ["same-id", "x"],
          ["same-id", "x"],
        ]),
      ),
    ).toThrow("unique stable IDs");
  });
});

describe("final reference choice context", () => {
  it("includes current-token context in whole-set label checks", () => {
    const entries = [
      {
        authored: { id: "self" },
        path: { status: "derived" as const, path: ["x"] },
      },
      {
        authored: { id: "other" },
        path: { status: "derived" as const, path: ["x (this token)"] },
      },
    ];
    expect([...identityLabels(entries, undefined, "self").values()]).toEqual([
      "x (this token) · self",
      "x (this token) · other",
    ]);
    expect([...identityLabels(entries).values()]).toEqual([
      "x",
      "x (this token)",
    ]);
  });
  it("disambiguates the actual Editor labels after adding the current-token hint", () => {
    const app = createAuthoringOperations(new InMemoryProjectStorage());
    ok(app.createProject({ id: "p", name: "P" }));
    const value = {
      kind: "literal" as const,
      colorSpace: "srgb" as const,
      components: ["0", "0", "0"] as const,
      alpha: "1",
    };
    for (const [id, localName] of [
      ["self", "x"],
      ["other", "x (this token)"],
    ])
      ok(
        app.createColorToken({
          id,
          projectId: "p",
          localName,
          parentGroupId: null,
          type: "color",
          regeneration: "allowed",
          value,
        }),
      );
    ok(
      app.reviseColorToken({
        projectId: "p",
        tokenId: "self",
        value: {
          kind: "token-reference",
          targetTokenId: "other",
          valuePath: [],
        },
      }),
    );
    const html = renderToStaticMarkup(
      createElement(Editor, {
        project: ok(app.readProject("p")),
        inspection: ok(app.inspectToken("p", "self")),
        inspect: (id) => ok(app.inspectToken("p", id)),
        onApply: () => {
          throw new Error("No render mutation");
        },
        onDirty: () => {},
        readUnavailable: false,
      }),
    );
    expect(html).toContain(
      '<option value="&quot;self&quot;">x (this token) · self</option>',
    );
    expect(html).toContain(
      '<option value="&quot;other&quot;" selected="">x (this token) · other</option>',
    );
    const labels = [
      ...html.matchAll(
        /<option value="&quot;(?:self|other)&quot;"[^>]*>([^<]*)<\/option>/g,
      ),
    ].map((match) => match[1]);
    expect(labels).toHaveLength(2);
    expect(new Set(labels).size).toBe(2);
    expect(ok(app.inspectToken("p", "self")).authored.localName).toBe("x");
    expect(
      ok(app.inspectToken("p", "self")).authored.definition!.assignments[0]
        .value,
    ).toMatchObject({ targetTokenId: "other" });
  });
});
