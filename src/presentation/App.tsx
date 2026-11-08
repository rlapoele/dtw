import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Dialog } from "@base-ui/react/dialog";
import {
  Bars3Icon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FolderIcon,
  InformationCircleIcon,
  PlusIcon,
  Square3Stack3DIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { createAuthoringOperations } from "@application/authoring";
import type {
  ProjectReadback,
  TokenInspection,
} from "@application/authoring";
import type { ProjectStorage } from "@application/project-storage";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
import { Button } from "@presentation/components/button";
import { Select } from "@presentation/Select";
import { Editor, Swatch } from "@presentation/Editor";
import type { Feedback } from "@presentation/Editor";
import { failureText, pathLabel, resolvedColor } from "@presentation/readback";
import { colorPreview } from "@presentation/preview";
import { eligible } from "@presentation/session";
export function App({
  storage = new InMemoryProjectStorage(),
  initialProjectId,
}: {
  storage?: ProjectStorage;
  initialProjectId?: string;
}) {
  const [operations] = useState(() => createAuthoringOperations(storage));
  const [projectId, setProjectId] = useState(initialProjectId),
    [project, setProject] = useState<ProjectReadback>(),
    [projectName, setProjectName] = useState("");
  const [selected, setSelected] = useState(""),
    [group, setGroup] = useState("all"),
    [query, setQuery] = useState("");
  const [dirty, setDirty] = useState(false),
    [pending, setPending] = useState<(() => void) | null>(null),
    [editorVersion, setEditorVersion] = useState(0);
  const [readFailure, setReadFailure] = useState(""),
    [message, setMessage] = useState(""),
    [error, setError] = useState("");
  const [dialog, setDialog] = useState<"token" | "group" | "rename" | null>(
      null,
    ),
    [name, setName] = useState(""),
    [parent, setParent] = useState(""),
    [layer, setLayer] = useState("");
  const [compact, setCompact] = useState(() => window.innerWidth < 1120),
    [navigationOpen, setNavigationOpen] = useState(false),
    [sidebarExpanded, setSidebarExpanded] = useState(
      () => window.innerWidth >= 1120,
    ),
    [inspectorExpanded, setInspectorExpanded] = useState(
      () => window.innerWidth >= 768,
    );
  const [feedback, setFeedback] = useState<Feedback>();
  const panelRef = useRef<HTMLElement>(null),
    formError = useRef<HTMLParagraphElement>(null),
    lastSelected = useRef("");
  const read = useCallback(
    (id: string) => {
      const result = operations.readProject(id);
      if (result.status === "failure") {
        setReadFailure(failureText(result));
        return false;
      }
      setProject(result.value);
      setReadFailure("");
      return true;
    },
    [operations],
  );
  useEffect(() => {
    if (projectId) read(projectId);
  }, [projectId, read]);
  useEffect(() => {
    const media = window.matchMedia("(max-width:1119px)");
    const change = () => {
      setCompact(media.matches);
      if (!media.matches) setNavigationOpen(false);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);
  useEffect(() => {
    const refresh = () => {
      if (projectId) read(projectId);
    };
    window.addEventListener("dtw:read-project", refresh);
    return () => window.removeEventListener("dtw:read-project", refresh);
  }, [projectId, read]);
  useEffect(() => {
    if (error) formError.current?.focus();
  }, [error]);
  useEffect(() => {
    if (readFailure)
      document
        .getElementById(dialog ? "dialog-read-error" : "read-error")
        ?.focus();
  }, [readFailure, dialog]);
  const request = (action: () => void) => {
    if (dirty) setPending(() => action);
    else action();
  };
  const inspection = (id: string): TokenInspection | undefined => {
    if (!projectId || readFailure) return undefined;
    const r = operations.inspectToken(projectId, id);
    return r.status === "ok" ? r.value : undefined;
  };
  const current = selected ? inspection(selected) : undefined;
  const lastInspection = useRef<TokenInspection | undefined>(undefined);
  if (current) lastInspection.current = current;
  const shown =
    current ??
    (lastInspection.current?.authored.id === selected
      ? lastInspection.current
      : undefined);
  const visible =
    project?.tokens.filter(
      (t) =>
        (group === "all" || t.authored.parentGroupId === group) &&
        pathLabel(t.path).toLowerCase().includes(query.toLowerCase()),
    ) ?? [];
  useLayoutEffect(() => {
    if (lastSelected.current !== selected) {
      lastSelected.current = selected;
      document.getElementById("token-inspector-content")?.scrollTo(0, 0);
    }
    const frame = requestAnimationFrame(() => {
      const row = panelRef.current?.querySelector<HTMLElement>(
        '[aria-pressed="true"]',
      );
      row?.scrollIntoView({ block: "nearest" });
    });
    return () => cancelAnimationFrame(frame);
  }, [selected, inspectorExpanded, visible.length]);
  function choose(id: string) {
    if (id === selected) {
      setInspectorExpanded(true);
      return;
    }
    request(() => {
      setSelected(id);
      setInspectorExpanded(true);
      setDirty(false);
    });
  }
  function open(kind: "token" | "group" | "rename") {
    if (readFailure) return;
    request(() => {
      setName(
        kind === "rename"
          ? (project?.groups.find((g) => g.authored.id === group)?.authored
              .localName ?? "")
          : "",
      );
      setParent(group === "all" ? "" : group);
      setError("");
      setDialog(kind);
    });
  }
  function create() {
    if (readFailure) {
      setError("Project unavailable. Retry reading; form retained.");
      return;
    }
    if (!projectId) return;
    const result =
      dialog === "token"
        ? operations.createColorToken({
            projectId,
            id: crypto.randomUUID(),
            localName: name,
            parentGroupId: parent || null,
            type: "color",
            regeneration: "allowed",
            ...(layer ? { layer: layer as "primitive" | "semantic" } : {}),
            value: {
              kind: "literal",
              colorSpace: "srgb",
              components: ["0", "0", "0"],
              alpha: "1",
            },
          })
        : dialog === "group"
          ? operations.createGroup({
              projectId,
              id: crypto.randomUUID(),
              localName: name,
              parentGroupId: parent || null,
            })
          : operations.renameGroup(projectId, group, name);
    if (result.status === "failure") {
      setError(
        `${dialog === "rename" ? "Rename" : dialog === "group" ? "Create group" : "Create token"} failed. ${failureText(result)}`,
      );
      if (
        result.error.code === "storage-failure" &&
        result.error.operation === "load"
      )
        read(projectId);
      return;
    }
    const kind = dialog;
    if (!read(projectId)) {
      setError(
        "Operation succeeded, but readback failed. Retry reading to inspect current data.",
      );
      return;
    }
    setDialog(null);
    setError("");
    setDirty(false);
    setEditorVersion((v) => v + 1);
    if (kind === "token") {
      setSelected(result.value.id);
      setGroup("all");
      setQuery("");
      setInspectorExpanded(true);
    } else if (kind === "group") setGroup(result.value.id);
    setMessage(
      kind === "rename"
        ? "Group renamed. Identities and references retained."
        : `${kind === "token" ? "Color token" : "Group"} created for this session.`,
    );
    requestAnimationFrame(() => panelRef.current?.focus());
  }
  const navigation = (
    <>
      <div className="sidebar-project">
        <span className="project-icon" aria-hidden="true">
          T
        </span>
        <div>
          <strong>{project?.project.name || "(unnamed project)"}</strong>
          <span>Color foundations</span>
        </div>
      </div>
      <div className="nav-label">Library</div>
      <Button
        variant="ghost"
        className={`nav-item ${group === "all" ? "active" : ""}`}
        aria-current={group === "all" ? "true" : undefined}
        onClick={() => {
          setGroup("all");
          setNavigationOpen(false);
        }}
      >
        <Squares2X2Icon className="icon" />
        All tokens<span className="count">{project?.tokens.length ?? 0}</span>
      </Button>
      <div className="group-tree">
        {project?.groups.map((g) => (
          <Button
            key={g.authored.id}
            variant="ghost"
            className={`nav-item group-item ${group === g.authored.id ? "active" : ""}`}
            aria-current={group === g.authored.id ? "true" : undefined}
            onClick={() => {
              setGroup(g.authored.id);
              setNavigationOpen(false);
            }}
          >
            <FolderIcon className="icon" />
            <span className="group-label">
              {pathLabel(g.path)}
              <small className="mono">{g.authored.id}</small>
            </span>
          </Button>
        ))}
      </div>
      <Button
        className="nav-item add-group"
        variant="ghost"
        disabled={!!readFailure}
        onClick={() => {
          setNavigationOpen(false);
          open("group");
        }}
      >
        <PlusIcon className="icon" />
        New group
      </Button>
      <div className="sidebar-bottom">
        <span className="eyebrow">Project</span>
        <p>
          One vocabulary.
          <br />
          Clear relationships.
        </p>
        <span className="helper">{project?.groups.length ?? 0} groups</span>
      </div>
    </>
  );
  const header = (
    <header className="topbar">
      {projectId && compact && (
        <Button
          variant="ghost"
          aria-label="Open project navigation"
          className="navigation-trigger"
          onClick={() => setNavigationOpen(true)}
        >
          <Bars3Icon className="icon" />
        </Button>
      )}
      <div className="brand">
        <Square3Stack3DIcon className="icon" />
        <strong>Token Workbench</strong>
      </div>
      <span className="project-title">
        {projectId && (project?.project.name || "(unnamed project)")}
      </span>
      <span className="session-label">Session only</span>
    </header>
  );
  if (!projectId)
    return (
      <div className="app-shell">
        {header}
        <main className="project-start">
          <span className="eyebrow">A project is your starting point</span>
          <h1>Create a color vocabulary</h1>
          <p>Organize colors, connect references and understand each value.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const id = crypto.randomUUID();
              const result = operations.createProject({
                id,
                name: projectName,
              });
              if (result.status === "failure") {
                setError("Create project failed. " + failureText(result));
                return;
              }
              setProjectId(id);
              setMessage("Project created for this session.");
            }}
          >
            <label className="field">
              Project name
              <input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </label>
            <Button variant="default" type="submit">
              Create project
            </Button>
          </form>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <p className="session-start-notice">
            Work exists only in this page. Reloading, closing or leaving
            discards your project.
          </p>
        </main>
      </div>
    );
  return (
    <div className="app-shell">
      <a className="skip-link" href="#tokens">
        Skip to tokens
      </a>
      {header}
      <div className="session-notice">
        <InformationCircleIcon className="icon" aria-hidden="true" />
        <span>
          Work exists only in this page. Reloading, closing or leaving will
          discard all changes.
        </span>
      </div>
      <div
        className={`workbench ${compact ? "compact-navigation" : ""} ${sidebarExpanded ? "groups-expanded" : "groups-collapsed"} ${inspectorExpanded ? "inspector-expanded" : "inspector-collapsed"}`}
      >
        {!compact && (
          <nav className="sidebar" aria-label="Project groups">
            <Button
              variant="ghost"
              className="pane-toggle sidebar-toggle"
              aria-label={
                sidebarExpanded
                  ? "Collapse project groups"
                  : "Expand project groups"
              }
              aria-expanded={sidebarExpanded}
              aria-controls="project-groups-content"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              {sidebarExpanded ? (
                <ChevronLeftIcon className="icon" />
              ) : (
                <ChevronRightIcon className="icon" />
              )}
              <span>Project groups</span>
            </Button>
            <div
              id="project-groups-content"
              hidden={!sidebarExpanded}
              className="sidebar-content"
            >
              {navigation}
            </div>
          </nav>
        )}
        <main id="tokens" ref={panelRef} tabIndex={-1} className="token-panel">
          <div className="panel-header">
            <div>
              <span className="eyebrow">Tokens</span>
              <h1>
                {group === "all"
                  ? "All colors"
                  : pathLabel(
                      project?.groups.find((g) => g.authored.id === group)
                        ?.path ?? { status: "derived", path: [] },
                    )}
              </h1>
              <p>Build a vocabulary, then connect its meaning.</p>
            </div>
            <Button
              variant="default"
              disabled={!!readFailure}
              onClick={() => open("token")}
            >
              <PlusIcon className="icon" />
              New token
            </Button>
          </div>
          <div className="list-tools">
            <label className="search">
              <input
                type="search"
                aria-label="Search color tokens"
                placeholder="Search colors…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            {group !== "all" && (
              <Button disabled={!!readFailure} onClick={() => open("rename")}>
                Rename group
              </Button>
            )}
          </div>
          {readFailure ? (
            <section
              className="error"
              role="alert"
              tabIndex={-1}
              id="read-error"
            >
              <h2>Could not read the project</h2>
              <p>{readFailure}</p>
              <p>
                Mutation is unavailable. Last successful data and drafts are
                retained.
              </p>
              <Button
                onClick={() => {
                  if (read(projectId)) {
                    setMessage("Project read succeeded.");
                    requestAnimationFrame(() => panelRef.current?.focus());
                  }
                }}
              >
                Retry reading project
              </Button>
            </section>
          ) : (
            <>
              {selected && !visible.some((t) => t.authored.id === selected) && (
                <section className="selection-context">
                  <p>Selected token is outside this list.</p>
                  <Button
                    onClick={() => {
                      setGroup("all");
                      setQuery("");
                      requestAnimationFrame(() =>
                        panelRef.current
                          ?.querySelector<HTMLElement>('[aria-pressed="true"]')
                          ?.focus(),
                      );
                    }}
                  >
                    Show selected token
                  </Button>
                </section>
              )}
              <div className="token-table">
                <div className="table-heading">
                  <span>Token</span>
                  <span>Authored value</span>
                </div>
                {visible.map((t) => {
                  const v = t.authored.definition?.assignments[0]?.value,
                    preview = colorPreview(
                      resolvedColor(inspection(t.authored.id)),
                    );
                  return (
                    <button
                      key={t.authored.id}
                      type="button"
                      className={`token-row ${selected === t.authored.id ? "selected" : ""}`}
                      aria-pressed={selected === t.authored.id}
                      onClick={() => choose(t.authored.id)}
                    >
                      <Swatch css={preview.css} />
                      <span className="token-identity">
                        <strong>{pathLabel(t.path)}</strong>
                        <small>
                          {t.authored.layer ?? "Unspecified"} ·{" "}
                          {t.authored.definition?.type ?? "Unassigned"} ·{" "}
                          {t.authored.id}
                        </small>
                      </span>
                      <span className="value-summary mono">
                        {v?.kind === "token-reference" ? (
                          <>
                            {project?.tokens.find(
                              (x) => x.authored.id === v.targetTokenId,
                            )
                              ? pathLabel(
                                  project.tokens.find(
                                    (x) => x.authored.id === v.targetTokenId,
                                  )!.path,
                                )
                              : "Missing target"}
                            <small>{v.targetTokenId}</small>
                          </>
                        ) : v?.kind === "literal" && v.valueType === "color" ? (
                          <>
                            {v.colorSpace}
                            <small>{v.components.join(" · ")}</small>
                          </>
                        ) : (
                          (v?.kind ?? "No assignment")
                        )}
                      </span>
                    </button>
                  );
                })}
                {visible.length === 0 && (
                  <div className="empty">
                    <h2>
                      {query
                        ? "No matching colors"
                        : project?.tokens.length
                          ? "This group is empty"
                          : "Your project is empty"}
                    </h2>
                    <p>
                      Create a color at the root, or add a group to organize it.
                    </p>
                    <Button
                      onClick={() => (query ? setQuery("") : open("token"))}
                    >
                      {query ? "Clear search" : "New token"}
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
          <section className="project-diagnostics">
            <details>
              <summary>Project diagnostics · namespace and references</summary>
              <pre className="exact-data">
                {project && !readFailure
                  ? JSON.stringify(
                      operations.validateProject(projectId),
                      null,
                      2,
                    )
                  : "Unavailable until successful read"}
              </pre>
            </details>
          </section>
          <p role="status" className="helper">
            {message}
          </p>
        </main>
        <section className="inspector-shell" aria-label="Token inspector pane">
          <div className="inspector-header">
            <span className="inspector-region-title">Token inspector</span>
            {!readFailure &&
            shown &&
            eligible(shown.authored) &&
            feedback?.tokenId === selected ? (
              <section
                className="inspector-feedback"
                aria-label="Applied and draft color context"
              >
                {(
                  [
                    "applied",
                    ...(feedback.tab === "resolved" ? [] : ["draft"]),
                  ] as ("applied" | "draft")[]
                ).map((k) => (
                  <div key={k} className="inspector-preview-context">
                    <span className="preview-context-label">
                      {k === "applied" ? "Applied" : "Draft"}
                    </span>
                    {feedback[k] ? (
                      <span className="header-specimen" aria-hidden="true">
                        <span style={{ background: feedback[k] }} />
                      </span>
                    ) : (
                      <span className="preview-unavailable">Unavailable</span>
                    )}
                    <span className="sr-only">
                      {
                        feedback[
                          k === "applied" ? "appliedMessage" : "draftMessage"
                        ]
                      }
                    </span>
                  </div>
                ))}
              </section>
            ) : (
              <span className="inspector-header-status">
                {readFailure
                  ? "Unavailable"
                  : selected
                    ? "Inspection only"
                    : "Select a token"}
              </span>
            )}
            <Button
              variant="ghost"
              className="pane-toggle inspector-toggle"
              aria-label={
                inspectorExpanded
                  ? "Collapse token inspector"
                  : "Expand token inspector"
              }
              aria-expanded={inspectorExpanded}
              aria-controls="token-inspector-content"
              onClick={() => setInspectorExpanded(!inspectorExpanded)}
            >
              {inspectorExpanded ? (
                <ChevronRightIcon className="icon side-direction" />
              ) : (
                <ChevronLeftIcon className="icon side-direction" />
              )}
              <ChevronDownIcon className="icon bottom-direction" />
            </Button>
          </div>
          <div
            id="token-inspector-content"
            className="inspector-content"
            hidden={!inspectorExpanded}
          >
            {readFailure && (
              <div className="empty">
                <h2>Inspection unavailable</h2>
                <p>Retry reading the project.</p>
              </div>
            )}
            {shown && project ? (
              <Editor
                key={`${shown.authored.id}-${editorVersion}`}
                inspection={shown}
                project={project}
                inspect={inspection}
                onDirty={setDirty}
                onFeedback={setFeedback}
                readUnavailable={!!readFailure}
                onApply={(value) => {
                  const result = operations.reviseColorToken({
                    projectId,
                    tokenId: selected,
                    value,
                  });
                  if (result.status === "ok") {
                    read(projectId);
                    setMessage("Changes applied for this session.");
                  } else if (
                    result.error.code === "storage-failure" &&
                    result.error.operation === "load"
                  )
                    read(projectId);
                  return result;
                }}
              />
            ) : (
              !readFailure && (
                <div className="empty">
                  <h2>No token selected</h2>
                  <p>Select or create a color token.</p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
      <footer className="statusbar">
        <span>{project?.tokens.length ?? 0} tokens</span>
        <span>Memory only · No recovery after reload</span>
      </footer>
      <Dialog.Root
        open={compact && navigationOpen}
        onOpenChange={setNavigationOpen}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="navigation-backdrop" />
          <Dialog.Popup
            className="navigation-drawer"
            finalFocus={() =>
              document.querySelector<HTMLElement>(
                '[aria-label="Open project navigation"]',
              )
            }
          >
            <div className="navigation-heading">
              <Dialog.Title>Project navigation</Dialog.Title>
              <Dialog.Close
                render={<Button variant="ghost" />}
                aria-label="Close project navigation"
              >
                <XMarkIcon className="icon" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Browse groups. Closing preserves drafts.
            </Dialog.Description>
            <nav className="navigation-content">
              <div className="sidebar-content">{navigation}</div>
            </nav>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root
        open={pending !== null}
        onOpenChange={(o) => {
          if (!o) setPending(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop forceRender className="dialog-backdrop" />
          <Dialog.Popup className="dialog-popup">
            <Dialog.Title>Discard unapplied changes?</Dialog.Title>
            <Dialog.Description>
              Both drafts will be discarded. Applied data is unchanged.
            </Dialog.Description>
            <div className="dialog-actions">
              <Dialog.Close render={<Button />}>Keep editing</Dialog.Close>
              <Button
                variant="default"
                onClick={() => {
                  pending?.();
                  setPending(null);
                  setDirty(false);
                  setEditorVersion((v) => v + 1);
                }}
              >
                Discard draft
              </Button>
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      <Dialog.Root
        open={dialog !== null}
        onOpenChange={(o) => {
          if (!o) setDialog(null);
        }}
      >
        <Dialog.Portal>
          <Dialog.Backdrop forceRender className="dialog-backdrop" />
          <Dialog.Popup
            className="dialog-popup"
            finalFocus={() => panelRef.current}
          >
            <Dialog.Title>
              {dialog === "token"
                ? "Create a color token"
                : dialog === "rename"
                  ? "Rename group"
                  : "Create a group"}
            </Dialog.Title>
            <Dialog.Description>
              {dialog === "token"
                ? "Start with an explicit Color literal."
                : "Groups organize paths; names do not define types."}
            </Dialog.Description>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                create();
              }}
            >
              <label className="field">
                Name
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  aria-describedby="creation-error"
                />
              </label>
              {dialog !== "rename" && (
                <label className="field">
                  {dialog === "token" ? "Group" : "Parent group"}
                  <Select
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                  >
                    <option value="">Project root</option>
                    {project?.groups.map((g) => (
                      <option key={g.authored.id} value={g.authored.id}>
                        {pathLabel(g.path)} · {g.authored.id}
                      </option>
                    ))}
                  </Select>
                </label>
              )}
              {dialog === "token" && (
                <>
                  <label className="field">
                    Layer
                    <Select
                      value={layer}
                      onChange={(e) => setLayer(e.target.value)}
                    >
                      <option value="">Unspecified</option>
                      <option value="primitive">Primitive</option>
                      <option value="semantic">Semantic</option>
                    </Select>
                  </label>
                  <section className="creation-disclosure">
                    <h3>Initial value</h3>
                    <p>
                      sRGB · Red 0 · Green 0 · Blue 0 · Alpha 1 (opaque black)
                    </p>
                    <p>
                      Create starts with this color. You can revise it or
                      explicitly replace it with a reference in the editor.
                    </p>
                  </section>
                </>
              )}
              {readFailure && (
                <div
                  className="error"
                  id="dialog-read-error"
                  tabIndex={-1}
                  role="status"
                >
                  <p>
                    Project unavailable. Inputs retained; Retry reading the
                    project to resume.
                  </p>
                  <Button
                    onClick={() => {
                      if (read(projectId))
                        setMessage("Project read succeeded.");
                    }}
                  >
                    Retry reading project
                  </Button>
                </div>
              )}
              {error ? (
                <p
                  ref={formError}
                  tabIndex={-1}
                  id="creation-error"
                  className="error"
                  role="alert"
                >
                  {error}
                </p>
              ) : (
                <span id="creation-error" />
              )}
              <div className="dialog-actions">
                <Dialog.Close render={<Button />}>Cancel</Dialog.Close>
                <Button
                  type="submit"
                  variant="default"
                  disabled={!!readFailure}
                >
                  {dialog === "rename" ? "Rename group" : "Create"}
                </Button>
              </div>
            </form>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
