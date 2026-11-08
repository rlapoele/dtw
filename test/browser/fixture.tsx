// Explicit test-only entry, excluded from the production build. Never a project loader.
import { createRoot } from "react-dom/client";
import { App } from "@presentation/App";
import "@presentation/styles.css";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
import { createProject } from "@domain/project";
import { createToken } from "@domain/token";
import { createColorLiteral } from "@domain/color-literal";
import { createTokenReference } from "@domain/token-reference";
import { createNumberLiteral } from "@domain/numeric-literals";
import type {
  ProjectSnapshot,
  ProjectStorage,
} from "@application/project-storage";
const literal = createColorLiteral({
  colorSpace: "srgb",
  components: ["0.2", "0.4", "0.6"],
  alpha: "1",
});
const make = (
  id: string,
  value: Parameters<typeof createToken>[0]["definition"],
  extra: Partial<Parameters<typeof createToken>[0]> = {},
) =>
  createToken(
    {
      id,
      projectId: "fixture-project",
      localName: id,
      parentGroupId: null,
      regeneration: "allowed",
      definition: value,
      ...extra,
    },
    [],
  );
const definition = {
  type: "color",
  assignments: [{ condition: [], value: literal }],
};
const tokens = [
  make("protected-color", definition, {
    regeneration: "protected",
    description: "Retained authored description",
    semanticRole: "content.primary",
    layer: "primitive",
  }),
  make(
    "alias",
    {
      type: "color",
      assignments: [
        {
          condition: [],
          value: createTokenReference({
            targetTokenId: "protected-color",
            valuePath: [],
          }),
        },
      ],
    },
    { layer: "semantic" },
  ),
  make("number", {
    type: "number",
    assignments: [{ condition: [], value: createNumberLiteral("8") }],
  }),
];
const params = new URLSearchParams(location.search);
if (params.get("broken") === "true")
  for (const id of ["broken-a", "broken-b"])
    tokens.push(
      make(id, {
        type: "color",
        assignments: [
          {
            condition: [],
            value: createTokenReference({
              targetTokenId: "missing-" + id,
              valuePath: [],
            }),
          },
        ],
      }),
    );
const initial: ProjectSnapshot = {
  project: createProject({ id: "fixture-project", name: "Acceptance fixture" }),
  groups: [],
  tokens,
};
const inner = new InMemoryProjectStorage([initial]);
let failRead = false,
  failCommit = false;
const storage: ProjectStorage = {
  load: (id) =>
    failRead
      ? { status: "failure", message: "Controlled read failure" }
      : inner.load(id),
  commit: (snapshot) =>
    failCommit
      ? { status: "failure", message: "Controlled commit failure" }
      : inner.commit(snapshot),
};
Object.assign(window, {
  dtwFixture: {
    failRead: (value: boolean) => {
      failRead = value;
      window.dispatchEvent(new Event("dtw:read-project"));
    },
    failCommit: (value: boolean) => {
      failCommit = value;
    },
    snapshot: () => inner.load("fixture-project"),
  },
});
createRoot(document.getElementById("root")!).render(
  <App storage={storage} initialProjectId="fixture-project" />,
);
