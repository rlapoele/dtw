import { describe, expect, it } from "vitest";

import {
  createProject,
  renameProject,
  changeProjectDescription,
} from "../../src/domain/project";

describe("createProject", () => {
  it("creates a project without requiring tokens or a workspace location", () => {
    expect(createProject({ id: "project-1", name: "Design system" })).toEqual({
      id: "project-1",
      name: "Design system",
    });
  });

  it("preserves an optional description exactly", () => {
    expect(createProject({
      id: "project-1",
      name: "Design system",
      description: "  Shared product foundations\n",
    })).toEqual({
      id: "project-1",
      name: "Design system",
      description: "  Shared product foundations\n",
    });
  });

  it.each(["", "  Design / system.one  ", "é", "e\u0301"])(
    "preserves opaque name %j",
    (name) => {
      expect(createProject({ id: "project-1", name }).name).toBe(name);
    },
  );
});

describe("project changes", () => {
  it("renames a project while preserving identity and description", () => {
    const project = createProject({
      id: "project-1",
      name: "Before",
      description: "Shared foundations",
    });

    expect(renameProject(project, "  After  ")).toEqual({
      id: "project-1",
      name: "  After  ",
      description: "Shared foundations",
    });
    expect(project.name).toBe("Before");
  });

  it("adds a description without changing identity or name", () => {
    const project = createProject({ id: "project-1", name: "Design system" });

    expect(changeProjectDescription(project, "Shared foundations")).toEqual({
      ...project,
      description: "Shared foundations",
    });
    expect(project).not.toHaveProperty("description");
  });

  it.each(["Updated description", ""])(
    "replaces a description with %j without mutating the project",
    (description) => {
      const project = createProject({
        id: "project-1",
        name: "Design system",
        description: "Before",
      });

      expect(changeProjectDescription(project, description)).toEqual({
        ...project,
        description,
      });
      expect(project.description).toBe("Before");
    },
  );

  it("removes a description as an absent field while preserving identity", () => {
    const project = createProject({
      id: "project-1",
      name: "Design system",
      description: "Before",
    });

    const changed = changeProjectDescription(project, undefined);

    expect(changed).toEqual({ id: "project-1", name: "Design system" });
    expect(changed).not.toHaveProperty("description");
    expect(project.description).toBe("Before");
  });
});
