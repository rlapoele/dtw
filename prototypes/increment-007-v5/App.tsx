import { CreationDialog } from "@presentation/CreationDialog";
import { TokenList } from "./TokenList";
import { ProjectNavigation } from "@presentation/ProjectNavigation";
import { DialogContent } from "@presentation/components/dialog-content";
import { Field } from "@presentation/components/field";
import { Input } from "@presentation/components/input";
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
  InformationCircleIcon,
  PlusIcon,
  Square3Stack3DIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { createAuthoringOperations } from "@application/authoring";
import type { ProjectReadback, TokenInspection } from "@application/authoring";
import type { ProjectStorage } from "@application/project-storage";
import { InMemoryProjectStorage } from "@adapters/in-memory-project-storage";
import { Button } from "@presentation/components/button";
import { Editor } from "./Editor";
import { Swatch } from "@presentation/components/swatch";
import type { Feedback } from "./Editor";
import { identityLabels, failureText, pathLabel, resolvedColor } from "@presentation/readback";
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
    [description, setDescription] = useState(""),
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
      setDescription("");
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
            ...(description === "" ? {} : { description }),
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
    setDescription("");
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
    <ProjectNavigation
      drawer={compact}
      project={project}
      group={group}
      unavailable={!!readFailure}
      onSelect={(id) => {
        setGroup(id);
        setNavigationOpen(false);
      }}
      onCreateGroup={() => {
        setNavigationOpen(false);
        open("group");
      }}
    />
  );
  const header = (
    <header
      className={`topbar small:h-13 short:h-11 shrink-0 border-b border-border h-16 flex items-center ${projectId && compact ? "pl-2 pr-6 gap-2 density:pr-4" : "px-6 gap-5 density:px-4 density:gap-3"}`}
    >
      {projectId && compact && (
        <Button
          variant="ghost"
          aria-label="Open project navigation"
          size="icon"
          className="navigation-trigger"
          onClick={() => setNavigationOpen(true)}
        >
          <Bars3Icon className="icon block w-5.5 h-5.5 shrink-0" />
        </Button>
      )}
      <div className="brand flex items-center gap-2.5">
        <Square3Stack3DIcon className="icon block w-4 h-4 shrink-0" />
        <strong className="density:text-xs/normal">Token Workbench</strong>
      </div>
      <span className="project-title small:hidden min-w-0 wrap-anywhere text-muted-foreground">
        {projectId && (project?.project.name || "(unnamed project)")}
      </span>
      <span className="session-label text-caption border border-border px-2.25 py-0.75 rounded ml-auto font-semibold bg-muted">
        Session only
      </span>
    </header>
  );
  if (!projectId)
    return (
      <div className="app-shell flex h-dvh min-h-0 flex-col overflow-clip bg-background">
        {header}
        <main className="project-start small:px-6 small:py-8 short:pt-6 mx-auto px-7 py-15 overflow-auto">
          <span className="eyebrow uppercase text-muted-foreground font-semibold">
            A project is your starting point
          </span>
          <h1 className="my-3">Create a color vocabulary</h1>
          <p className="text-muted-foreground">
            Organize colors, connect references and understand each value.
          </p>
          <form
            className="mt-8"
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
            <Field>
              Project name
              <Input
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
              />
            </Field>
            <Button variant="default" type="submit">
              Create project
            </Button>
          </form>
          {error && (
            <p
              className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4"
              role="alert"
            >
              {error}
            </p>
          )}
          <p className="session-start-notice text-caption mt-4.5">
            Work exists only in this page. Reloading, closing or leaving
            discards your project.
          </p>
        </main>
      </div>
    );
  return (
    <div className="app-shell flex h-dvh min-h-0 flex-col overflow-clip bg-background">
      <a
        className="skip-link fixed -top-20 left-5 z-20 bg-background focus:top-2.5 p-2"
        href="#tokens"
      >
        Skip to tokens
      </a>
      {header}
      <div className="session-notice density:justify-start small:annotation small:min-h-9 small:px-4 small:py-1.5 short:py-1 short:px-4 short:min-h-7 shrink-0 border-b border-border bg-notice text-notice-foreground text-caption px-5 py-2 min-h-9 flex items-center justify-center gap-2">
        <InformationCircleIcon
          className="icon block w-4 h-4 shrink-0"
          aria-hidden="true"
        />
        <span>
          Work exists only in this page. Reloading, closing or leaving will
          discard all changes.
        </span>
      </div>
      <div
        className={`workbench grid flex-1 h-0 min-h-0 overflow-hidden ${compact ? "compact-navigation" : ""} ${sidebarExpanded ? "groups-expanded" : "groups-collapsed"} ${inspectorExpanded ? "inspector-expanded" : "inspector-collapsed"}`}
      >
        {!compact && (
          <nav
            className="sidebar flex min-h-0 flex-col overflow-hidden border-r border-border bg-surface"
            aria-label="Project groups"
          >
            <Button
              variant="ghost"
              size="pane"
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
                <ChevronLeftIcon className="icon block w-4 h-4 shrink-0" />
              ) : (
                <ChevronRightIcon className="icon block w-4 h-4 shrink-0" />
              )}
              <span>Project groups</span>
            </Button>
            <div
              id="project-groups-content"
              hidden={!sidebarExpanded}
              className="sidebar-content flex-1 px-3 pt-5.5 pb-5 flex flex-col min-h-0 overflow-auto"
            >
              {navigation}
            </div>
          </nav>
        )}
        <main
          id="tokens"
          ref={panelRef}
          tabIndex={-1}
          className="token-panel relative min-w-0 min-h-0 overflow-auto"
        >
          <div className="panel-header source-compact:items-start compact:flex-wrap mb-6.5 flex justify-between items-center gap-3">
            <div>
              <span className="eyebrow uppercase text-muted-foreground font-semibold">
                Tokens
              </span>
              <h1 className="my-1.5 small-title">
                {group === "all"
                  ? "All colors"
                  : identityLabels(project?.groups ?? [], ["Project root", "All tokens"]).get(group) ?? "Missing group"}
              </h1>
              <p className="text-xs/normal text-muted-foreground">
                Build a vocabulary, then connect its meaning.
              </p>
            </div>
            <Button
              variant="default"
              size="panel"
              disabled={!!readFailure}
              onClick={() => open("token")}
            >
              <PlusIcon className="icon block w-4 h-4 shrink-0" />
              New token
            </Button>
          </div>
          <div className="list-tools compact:flex-wrap narrow:gap-2 flex gap-3 items-center mb-5">
            <label className="search tablet:min-w-25 flex-1 max-w-75 relative">
              <Input
                appearance="search"
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
              className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4"
              role="alert"
              tabIndex={-1}
              id="read-error"
            >
              <h2 className="text-sm/normal mb-2">
                Could not read the project
              </h2>
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
                <section className="selection-context flex-wrap border border-border rounded-md mb-4 text-caption flex items-center justify-between gap-3 p-3 bg-muted">
                  <p className="mt-2">Selected token is outside this list.</p>
                  <Button
                    size="selection"
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
              <TokenList
                project={project}
                visible={visible}
                selected={selected}
                query={query}
                inspect={inspection}
                onSelect={choose}
                onEmptyAction={() => (query ? setQuery("") : open("token"))}
              />
            </>
          )}
          <section className="project-diagnostics text-caption mt-6">
            <details>
              <summary>Project diagnostics · namespace and references</summary>
              <pre className="exact-data whitespace-pre-wrap text-caption my-3 max-w-full wrap-anywhere">
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
          <p role="status" className="helper text-muted-foreground font-normal">
            {message}
          </p>
        </main>
        <section
          className="inspector-shell small:border-l-0 small:border-t small:isolate flex min-w-0 min-h-0 flex-col overflow-clip border-l border-border bg-surface"
          aria-label="Token inspector pane"
        >
          <div className="inspector-header border-b border-border bg-surface h-11 min-h-11 shrink-0 flex items-center gap-2 pl-3 min-w-0">
            <span className="inspector-region-title flex-1 text-caption leading-3.5 min-w-0 font-medium">
              Token inspector
            </span>
            {!readFailure &&
            shown &&
            eligible(shown.authored) &&
            feedback?.tokenId === selected ? (
              <section
                className="inspector-feedback flex items-center gap-2 shrink-0"
                aria-label="Applied and draft color context"
              >
                {(
                  [
                    "applied",
                    ...(feedback.tab === "resolved" ? [] : ["draft"]),
                  ] as ("applied" | "draft")[]
                ).map((k) => (
                  <div
                    key={k}
                    className="inspector-preview-context text-caption leading-3.5 flex flex-col items-center justify-center gap-0.5 w-16 min-w-0"
                  >
                    <span className="preview-context-label text-secondary">
                      {k === "applied" ? "Applied" : "Draft"}
                    </span>
                    {feedback[k] ? (
                      <span
                        className="header-specimen rounded border border-specimen-border block w-9 h-4 overflow-hidden"
                        aria-hidden="true"
                      >
                        <span
                          className="block size-full"
                          style={{ background: feedback[k] }}
                        />
                      </span>
                    ) : (
                      <span className="preview-unavailable text-caption leading-4 text-secondary">
                        Unavailable
                      </span>
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
              <span className="inspector-header-status text-caption leading-4 text-secondary">
                {readFailure
                  ? "Unavailable"
                  : selected
                    ? "Inspection only"
                    : "Select a token"}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="pane-toggle inspector-toggle shrink-0 rounded-none"
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
                <ChevronRightIcon className="icon block w-4 h-4 shrink-0 side-direction small:hidden" />
              ) : (
                <ChevronLeftIcon className="icon block w-4 h-4 shrink-0 side-direction small:hidden" />
              )}
              <ChevronDownIcon className="icon block w-4 h-4 shrink-0 bottom-direction small:block hidden" />
            </Button>
          </div>
          <div
            id="token-inspector-content"
            className="inspector-content flex-1 bg-surface overflow-auto min-h-0"
            hidden={!inspectorExpanded}
          >
            {readFailure && (
              <div className="empty px-5 py-17.5 text-center text-muted-foreground">
                <h2 className="text-foreground text-base/normal">
                  Inspection unavailable
                </h2>
                <p className="text-xs/normal mt-2 mb-5">
                  Retry reading the project.
                </p>
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
                <div className="empty px-5 py-17.5 text-center text-muted-foreground">
                  <h2 className="text-foreground text-base/normal">
                    No token selected
                  </h2>
                  <p className="text-xs/normal mt-2 mb-5">
                    Select or create a color token.
                  </p>
                </div>
              )
            )}
          </div>
        </section>
      </div>
      <footer className="statusbar narrow:flex-wrap small:px-4 small:py-1.5 short:hidden shrink-0 flex justify-between gap-4 border-t border-border bg-surface text-status px-5 py-2">
        <span>{project?.tokens.length ?? 0} tokens</span>
        <span className="small:hidden">
          Memory only · No recovery after reload
        </span>
      </footer>
      <Dialog.Root
        open={compact && navigationOpen}
        onOpenChange={setNavigationOpen}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="navigation-backdrop fixed inset-0 z-30 bg-scrim" />
          <Dialog.Popup
            className="navigation-drawer fixed top-0 bottom-0 left-0 z-35 border-r border-border bg-background flex flex-col overflow-hidden"
            finalFocus={() =>
              document.querySelector<HTMLElement>(
                '[aria-label="Open project navigation"]',
              )
            }
          >
            <div className="navigation-heading border-b border-border px-4 py-3 flex items-center justify-between gap-3 shrink-0">
              <Dialog.Title className="text-sm/normal">
                Project navigation
              </Dialog.Title>
              <Dialog.Close
                render={<Button variant="ghost" size="icon" />}
                aria-label="Close project navigation"
              >
                <XMarkIcon className="icon block w-4 h-4 shrink-0" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Browse groups. Closing preserves drafts.
            </Dialog.Description>
            <nav className="navigation-content flex-1 flex flex-col min-h-0 overflow-hidden">
              <div className="sidebar-content flex-1 px-3 py-6 flex flex-col min-h-0 overflow-auto">
                {navigation}
              </div>
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
        <DialogContent className="dialog-popup">
          <Dialog.Title className="dialog-title mb-2.5">
            Discard unapplied changes?
          </Dialog.Title>
          <Dialog.Description className="text-xs/normal text-muted-foreground mb-6">
            Both drafts will be discarded. Applied data is unchanged.
          </Dialog.Description>
          <div className="dialog-actions justify-end flex gap-2.5 mt-6">
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
        </DialogContent>
      </Dialog.Root>
      <CreationDialog
        dialog={dialog}
        project={project}
        name={name}
        description={description}
        onDescriptionChange={setDescription}
        parent={parent}
        layer={layer}
        readFailure={readFailure}
        error={error}
        formError={formError}
        finalFocus={() => panelRef.current}
        onClose={() => { setDialog(null); setDescription(""); }}
        onCreate={create}
        onNameChange={setName}
        onParentChange={setParent}
        onLayerChange={setLayer}
        onRetry={() => {
          if (read(projectId)) setMessage("Project read succeeded.");
        }}
      />
    </div>
  );
}
