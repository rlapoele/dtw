import { useEffect, useRef, useState } from "react";
import type {
  ProjectContext,
  DisplayRow,
  SelectedToken,
} from "@application/retention/projections";
import type { DiagnosticDisplay } from "@application/retention/diagnostics";
import type { ProjectHeader, WorkbenchHost } from "@presentation/host/protocol";
export type Selection = { kind: "token" | "group"; id: string } | null;
export function useProjectReadback(
  host: WorkbenchHost,
  initial: ProjectHeader,
  selection: Selection,
) {
  const [header, setHeader] = useState(initial);
  const [context, setContext] = useState<ProjectContext>();
  const [rows, setRows] = useState<DisplayRow[]>([]);
  const [complete, setComplete] = useState(false);
  const [inspection, setInspection] = useState<SelectedToken>();
  const [readFailure, setReadFailure] = useState("");
  const [targetUnavailable, setTargetUnavailable] = useState("");
  const [diagnostics, setDiagnostics] = useState<DiagnosticDisplay>();
  const generation = useRef(0),
    selectedGeneration = useRef(0),
    reading = useRef(false);
  const current = useRef(header),
    selected = useRef(selection);
  current.current = header;
  selected.current = selection;
  useEffect(() => {
    void refresh(initial);
    return () => {
      generation.current++;
      selectedGeneration.current++;
    };
  }, []);
  async function refresh(known?: ProjectHeader) {
    const version = ++generation.current;
    selectedGeneration.current++;
    reading.current = true;
    setComplete(false);
    setDiagnostics(undefined);
    setReadFailure("");
    try {
      const next =
        known ?? (await host.call("openProject", initial.project.id));
      const data = await host.call("context", {
        projectId: next.project.id,
        revision: next.revision,
      });
      const target = selected.current;
      let selectedRead: SelectedToken | undefined,
        missingTarget = "";
      if (target?.kind === "token") {
        if (!data.tokens.some((token) => token.authored.id === target.id))
          missingTarget =
            "The original token no longer exists in current applied state.";
        else
          selectedRead = await host.call("inspection", {
            projectId: next.project.id,
            revision: next.revision,
            tokenId: target.id,
          });
      }
      if (version !== generation.current) return;
      selectedGeneration.current++;
      if (
        target?.kind === "token" &&
        selected.current?.kind === "token" &&
        selected.current.id === target.id
      ) {
        if (selectedRead) setInspection(selectedRead);
        setTargetUnavailable(missingTarget);
      }
      // Publish revision, metadata and selected applied inspection together.
      // Advancing a revision ahead of its selected value would silently rebase
      // the editor's preserved input before it can request deliberate review.
      setHeader(next);
      setContext(data);
      setRows([]);
      for (let offset = 0; offset < next.tokens; offset += 100) {
        const batch = await host.call("rows", {
          projectId: next.project.id,
          revision: next.revision,
          offset,
          count: 100,
        });
        if (version !== generation.current) return;
        setRows((previous) => [...previous, ...batch]);
        await new Promise<void>((resolve) =>
          requestAnimationFrame(() => resolve()),
        );
      }
      if (version === generation.current) {
        setComplete(true);
        return true;
      }
    } catch (e) {
      if (version === generation.current)
        setReadFailure(e instanceof Error ? e.message : "Project unavailable.");
    } finally {
      if (version === generation.current) reading.current = false;
    }
    return false;
  }
  async function inspect(id: string, target = current.current) {
    const version = ++selectedGeneration.current;
    try {
      const result = await host.call("inspection", {
        projectId: target.project.id,
        revision: target.revision,
        tokenId: id,
      });
      if (
        version === selectedGeneration.current &&
        current.current.revision === target.revision &&
        selected.current?.kind === "token" &&
        selected.current.id === id
      ) {
        setInspection(result);
        setTargetUnavailable("");
      }
      return result;
    } catch (e) {
      if (version === selectedGeneration.current)
        setTargetUnavailable(
          e instanceof Error ? e.message : "Inspection unavailable",
        );
    }
  }

  async function loadDiagnostics(onError: (message: string) => void) {
    const version = generation.current,
      target = current.current;
    try {
      const result = await host.call("diagnostics", {
        projectId: target.project.id,
        revision: target.revision,
      });
      if (
        version === generation.current &&
        current.current.revision === target.revision
      )
        setDiagnostics(result);
    } catch (error) {
      if (version === generation.current) onError(String(error));
    }
  }
  function select(target: NonNullable<Selection>) {
    selectedGeneration.current++;
    selected.current = target;
    setTargetUnavailable("");
    setInspection(undefined);
    if (target.kind === "token") void inspect(target.id);
  }
  function invalidate() {
    generation.current++;
    selectedGeneration.current++;
  }
  return {
    header,
    context,
    rows,
    complete,
    inspection,
    readFailure,
    targetUnavailable,
    diagnostics,
    refresh,
    inspect,
    select,
    invalidate,
    loadDiagnostics,
    setReadFailure,
    reading,
    current,
  };
}
