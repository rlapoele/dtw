import { AllContent } from "@presentation/features/workbench/components/AllContent";
import { RestoreDialog } from "@presentation/features/workbench/components/RestoreDialog";
import type { RestorePreview } from "@presentation/host/protocol";
import { UnknownWriteError } from "@presentation/host/worker-client";
import { requestPersistentStorage } from "@adapters/browser/storage-preference";
import { downloadProjectBackup } from "@presentation/host/backup-file";
import type { DiagnosticDisplay } from "@application/retention/diagnostics";
import { readExactSource } from "@presentation/host/source";
import { useEffect, useRef, useState, useMemo } from "react";
import { Dialog } from "@base-ui/react/dialog";
import {
  Bars3Icon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  PlusIcon,
  Square3Stack3DIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import type {
  ProjectContext,
  DisplayRow,
  SelectedToken,
} from "@application/retention/projections";
import type { AuthoringCommand } from "@application/retention/ports";
import type { ApplicationResult } from "@application/authoring";
import type { Token } from "@domain/token";
import type {
  ProjectHeader,
  PublicAcceptance,
  WorkbenchHost,
} from "@presentation/host/protocol";
import { Button } from "@presentation/components/ui/button";
import { Input } from "@presentation/components/ui/input";
import { DialogContent } from "@presentation/components/ui/dialog-content";
import { Editor } from "@presentation/features/workbench/components/Editor";
import type { Feedback } from "@presentation/features/workbench/components/Editor";
import { CreationDialog } from "@presentation/features/workbench/components/CreationDialog";
import { ProjectNavigation } from "@presentation/features/workbench/components/ProjectNavigation";
import { ProjectedTokenList } from "@presentation/features/workbench/components/ProjectedTokenList";
import { ExactSource } from "@presentation/features/workbench/components/ExactSource";
import { identityLabels } from "@presentation/features/workbench/readback";
export function RetainedWorkbench({
  host,
  initial,
  onProjects,
  onProject,
}: {
  host: WorkbenchHost;
  initial: ProjectHeader;
  onProjects(reset?: boolean): void;
  onProject(id: string): void;
}) {
  const [header, setHeader] = useState(initial),
    [context, setContext] = useState<ProjectContext>(),
    [rows, setRows] = useState<DisplayRow[]>([]),
    [complete, setComplete] = useState(false);
  const [selection, setSelection] = useState<{
      kind: "token" | "group";
      id: string;
    } | null>(null),
    [inspection, setInspection] = useState<SelectedToken>(),
    [group, setGroup] = useState<string | null>(null),
    [allContent, setAllContent] = useState(false),
    [query, setQuery] = useState("");
  const [error, setError] = useState(""),
    [notice, setNotice] = useState(""),
    [readFailure, setReadFailure] = useState(""),
    [busy, setBusy] = useState(false),
    [unknown, setUnknown] =
      useState<Extract<PublicAcceptance, { status: "unknown" }>>();
  const [dirty, setDirty] = useState(false),
    [pending, setPending] = useState<(() => void) | null>(null),
    [editorVersion, setEditorVersion] = useState(0),
    [feedback, setFeedback] = useState<Feedback>();
  const [dialog, setDialog] = useState<"token" | "group" | "rename" | null>(
      null,
    ),
    [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [parent, setParent] = useState<string | null>(null),
    [layer, setLayer] = useState(""),
    [formDirty, setFormDirty] = useState(false);
  const [compact, setCompact] = useState(window.innerWidth < 1120),
    [navigationOpen, setNavigationOpen] = useState(false),
    [sidebarExpanded, setSidebarExpanded] = useState(window.innerWidth >= 1120),
    [inspectorExpanded, setInspectorExpanded] = useState(
      window.innerWidth >= 768,
    );
  const selectedBackupFile = useRef<File | undefined>(undefined);
  const [restorePreview, setRestorePreview] = useState<RestorePreview>();
  const restoreInput = useRef<HTMLInputElement>(null);
  const [diagnostics, setDiagnostics] = useState<DiagnosticDisplay>();
  const [targetUnavailable, setTargetUnavailable] = useState("");
  const [formBaseline, setFormBaseline] = useState<{
    revision: string;
    target: string | null;
    name: string;
  }>();
  const [formReviewed, setFormReviewed] = useState(false);
  const [retainedPending, setRetainedPending] =
    useState<Extract<PublicAcceptance, { status: "retained" }>>();
  const completion = useRef<(() => void) | undefined>(undefined);
  const reading = useRef(false),
    activeMutation = useRef(false);
  const [lifecycleBlocked, setLifecycleBlocked] = useState(false);
  const lifecycle = useRef({ busy, unknown: !!unknown });
  lifecycle.current = { busy, unknown: !!unknown };
  const generation = useRef(0),
    selectedGeneration = useRef(0),
    panel = useRef<HTMLElement>(null),
    formError = useRef<HTMLParagraphElement>(null),
    current = useRef(header),
    selected = useRef(selection);
  current.current = header;
  selected.current = selection;
  useEffect(() => {
    const media = matchMedia("(max-width:1119px)");
    const update = () => {
      setCompact(media.matches);
      if (!media.matches) setNavigationOpen(false);
    };
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);
  useEffect(() => {
    const pause = () => {
      setLifecycleBlocked(true);
      void host.call("suspend", null).catch(() => {});
    };
    const resume = () => {
      if (lifecycle.current.busy || lifecycle.current.unknown) {
        setLifecycleBlocked(true);
        return;
      }
      setLifecycleBlocked(true);
      void host
        .call("resume", initial.project.id)
        .then((next) => refresh(next))
        .then(() => setLifecycleBlocked(false))
        .catch((e) =>
          setReadFailure(
            e instanceof Error ? e.message : "Lifecycle recovery unavailable",
          ),
        );
    };
    addEventListener("pagehide", pause);
    addEventListener("freeze", pause);
    addEventListener("pageshow", resume);
    addEventListener("focus", resume);
    return () => {
      removeEventListener("pagehide", pause);
      removeEventListener("freeze", pause);
      removeEventListener("pageshow", resume);
      removeEventListener("focus", resume);
    };
  }, []);
  useEffect(() => {
    const protect = (event: BeforeUnloadEvent) => {
      if (dirty || formDirty || busy || unknown) {
        event.preventDefault();
        event.returnValue = "";
      }
    };
    addEventListener("beforeunload", protect);
    return () => removeEventListener("beforeunload", protect);
  }, [dirty, formDirty, busy, unknown]);
  useEffect(() => {
    void refresh(initial);
    return () => {
      generation.current++;
      selectedGeneration.current++;
    };
  }, []);
  useEffect(() => {
    if (error) formError.current?.focus();
  }, [error]);
  useEffect(() => setFormReviewed(false), [header.revision]);
  async function refresh(known?: ProjectHeader) {
    const version = ++generation.current;
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
        selected.current?.kind === "token" &&
        selected.current.id === id
      ) {
        setInspection(result);
        setTargetUnavailable("");
      }
    } catch (e) {
      if (version === selectedGeneration.current)
        setTargetUnavailable(
          e instanceof Error ? e.message : "Inspection unavailable",
        );
    }
  }
  function request(action: () => void) {
    if (busy || reading.current) return;
    if (dirty || formDirty || unknown) setPending(() => action);
    else action();
  }
  function choose(kind: "token" | "group", id: string) {
    if (selected.current?.kind === kind && selected.current.id === id) {
      setInspectorExpanded(true);
      return;
    }
    request(() => {
      setTargetUnavailable("");
      setSelection({ kind, id });
      selected.current = { kind, id };
      setInspection(undefined);
      setInspectorExpanded(true);
      setDirty(false);
      if (kind === "token") void inspect(id);
    });
  }
  function open(kind: "token" | "group" | "rename") {
    if (lifecycleBlocked || !header.writable || readFailure || busy || unknown)
      return;
    request(() => {
      setName(
        kind === "rename"
          ? (context?.groups.find((g) => g.authored.id === group)?.authored
              .localName ?? "")
          : "",
      );
      setDescription("");
      setParent(group);
      setLayer("");
      setError("");
      setFormDirty(false);
      setFormBaseline({
        revision: header.revision,
        target: group,
        name:
          kind === "rename"
            ? (context?.groups.find((g) => g.authored.id === group)?.authored
                .localName ?? "")
            : "",
      });
      setFormReviewed(false);
      setDialog(kind);
    });
  }
  async function accept(command: AuthoringCommand): Promise<PublicAcceptance> {
    if (
      lifecycleBlocked ||
      reading.current ||
      busy ||
      unknown ||
      retainedPending
    )
      return {
        status: "rejected",
        reason: "Editing paused until lifecycle recovery completes.",
      };
    setBusy(true);
    activeMutation.current = true;
    setError("");
    try {
      let result = await host.call("command", {
        command,
        revision: current.current.revision,
      });
      if (result.status === "unknown") setUnknown(result);
      else if (result.status === "retained") {
        await host.call("consume", result.receipt.commandId);
        if (result.readback === "available" && !(await refresh()))
          result = {
            ...result,
            readback: "unavailable",
            readError: "Retained, but coherent display is unavailable.",
          };
        if (result.readback === "unavailable") {
          setRetainedPending(result);
          setReadFailure(
            result.readError ??
              "Retained, but readback unavailable. Retry reading without repeating the write.",
          );
        }
      } else {
        completion.current = undefined;
        setError(result.reason);
      }
      return result;
    } catch (e) {
      const result = {
        status: "unknown" as const,
        reason: e instanceof Error ? e.message : "Retained outcome unknown",
        commandId:
          e instanceof UnknownWriteError
            ? e.attempt.commandId
            : "worker-observation-lost",
      };
      setUnknown(result);
      return result;
    } finally {
      activeMutation.current = false;
      setBusy(false);
    }
  }
  async function retryReading() {
    setBusy(true);
    try {
      if (await refresh()) {
        const finish = completion.current;
        completion.current = undefined;
        setRetainedPending(undefined);
        finish?.();
        setNotice(
          "Retained applied state recovered. The original write was not repeated.",
        );
      }
    } finally {
      setBusy(false);
    }
  }

  async function create() {
    if (
      !dialog ||
      busy ||
      unknown ||
      !header.writable ||
      readFailure ||
      (formBaseline?.revision !== header.revision && !formReviewed)
    )
      return;
    if (
      (dialog === "rename" &&
        !context?.groups.some((g) => g.authored.id === formBaseline?.target)) ||
      (dialog !== "rename" &&
        parent !== null &&
        !context?.groups.some((g) => g.authored.id === parent))
    ) {
      setError(
        "Original target or parent no longer exists. Input is preserved; mutation is blocked without retargeting or recreation.",
      );
      return;
    }
    const id = crypto.randomUUID();
    const command: AuthoringCommand =
      dialog === "rename"
        ? {
            operation: "renameGroup",
            projectId: header.project.id,
            groupId: group!,
            localName: name,
          }
        : dialog === "group"
          ? {
              operation: "createGroup",
              input: {
                id,
                projectId: header.project.id,
                localName: name,
                parentGroupId: parent,
              },
            }
          : {
              operation: "createColorToken",
              input: {
                id,
                projectId: header.project.id,
                localName: name,
                parentGroupId: parent,
                type: "color",
                regeneration: "allowed",
                ...(description === "" ? {} : { description }),
                ...(layer ? { layer: layer as "primitive" | "semantic" } : {}),
                value: {
                  kind: "literal",
                  colorSpace: "srgb",
                  components: ["0", "0", "0"],
                  alpha: "1",
                },
              },
            };
    const kind = dialog;
    completion.current = () => {
      setDialog(null);
      setFormDirty(false);
      setDescription("");
      setError("");
      setNotice(
        kind === "rename"
          ? "Group renamed. Identities and references retained."
          : `${kind === "token" ? "Color token" : "Group"} created and retained.`,
      );
      if (kind === "token") {
        setGroup(null);
        setQuery("");
        setAllContent(false);
        setSelection({ kind: "token", id });
        selected.current = { kind: "token", id };
        setInspection(undefined);
        setInspectorExpanded(true);
        void inspect(id);
      } else if (kind === "group") setGroup(id);
      requestAnimationFrame(() => panel.current?.focus());
    };
    const result = await accept(command);
    if (result.status === "retained" && result.readback === "available") {
      const finish = completion.current;
      completion.current = undefined;
      finish?.();
    }
  }

  async function check() {
    setBusy(true);
    try {
      let result = await host.call("check", null);
      if (result.status === "unknown") {
        setUnknown(result);
        setError(result.reason);
      } else {
        setUnknown(undefined);
        if (result.status === "retained") {
          await host.call("consume", result.receipt.commandId);
          if (result.readback === "available" && !(await refresh()))
            result = { ...result, readback: "unavailable" };
          if (result.readback === "unavailable") {
            setRetainedPending(result);
            setReadFailure(
              result.readError ??
                "Original write retained; retry coherent reading without repeating it.",
            );
          } else {
            const finish = completion.current;
            completion.current = undefined;
            finish?.();
            setNotice("Original command retained and completed once.");
          }
        } else {
          completion.current = undefined;
          setError(result.reason);
        }
      }
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Result check failed; original outcome remains unknown.",
      );
    } finally {
      setBusy(false);
    }
  }
  const blocked =
    !!retainedPending ||
    reading.current ||
    lifecycleBlocked ||
    busy ||
    !!unknown ||
    !header.writable ||
    !!readFailure;
  const visible = useMemo(
    () =>
      rows.filter(
        (row) =>
          (group === null || row.parentGroupId === group) &&
          row.label.toLowerCase().includes(query.toLowerCase()),
      ),
    [rows, group, query],
  );
  const groupLabels = useMemo(
    () => identityLabels(context?.groups ?? [], ["Project root", "All tokens"]),
    [context],
  );
  const source = (kind: "project" | "group" | "token", id: string) =>
    readExactSource(host, header.project.id, header.revision, kind, id);
  const navigation = (
    <ProjectNavigation
      drawer={compact}
      project={context}
      group={group}
      unavailable={blocked}
      onSelect={(id) => {
        if (!busy) {
          setGroup(id);
          setAllContent(false);
          setNavigationOpen(false);
        }
      }}
      onCreateGroup={() => open("group")}
      onAllContent={() => {
        if (!busy) {
          setAllContent(true);
          setNavigationOpen(false);
        }
      }}
    />
  );
  const recovery =
    busy && activeMutation.current && !unknown && !retainedPending ? (
      <section
        role="status"
        className="border border-border text-caption p-3 rounded my-3"
      >
        <p>
          Retention pending. Inputs are preserved; duplicate submission is
          blocked.
        </p>
        <Button onClick={() => void check()}>Check retained result</Button>
      </section>
    ) : retainedPending ? (
      <section
        role="status"
        className="border border-border text-caption p-3 rounded my-3"
      >
        <p>
          The original change is retained. Display recovery is unavailable;
          inputs are preserved and the write will not be repeated.
        </p>
        <Button disabled={busy} onClick={() => void retryReading()}>
          Retry reading project
        </Button>
      </section>
    ) : unknown ? (
      <section
        role="status"
        className="border border-error-border bg-error-surface text-caption p-3 rounded my-3"
      >
        <p>Retained result unknown. Inputs are preserved. {unknown.reason}</p>
        <Button disabled={busy} onClick={() => void check()}>
          Check retained result
        </Button>
        <Button
          disabled={busy}
          onClick={() =>
            setPending(() => () => {
              host.fence();
              generation.current++;
              selectedGeneration.current++;
              onProjects(true);
            })
          }
        >
          Review before leaving
        </Button>
      </section>
    ) : null;
  const departureGuard = (
    <Dialog.Root
      open={pending !== null}
      onOpenChange={(value) => {
        if (!value) setPending(null);
      }}
    >
      <DialogContent
        finalFocus={() =>
          dialog
            ? document.querySelector<HTMLElement>('[role="dialog"] input')
            : panel.current
        }
      >
        <Dialog.Title>
          {unknown ? "Review before leaving" : "Discard unapplied changes?"}
        </Dialog.Title>
        <Dialog.Description>
          {unknown
            ? "An issued write may already be retained. Leaving discards session input; it does not roll back applied work."
            : "Session drafts and unfinished form input will be discarded. Applied data is unchanged."}
        </Dialog.Description>
        <div className="dialog-actions justify-end flex gap-2.5 mt-6">
          <Dialog.Close render={<Button />}>
            {unknown ? "Stay here" : "Keep editing"}
          </Dialog.Close>
          <Button
            variant="default"
            disabled={busy}
            onClick={() => {
              const action = pending;
              setPending(null);
              setDirty(false);
              setFormDirty(false);
              setEditorVersion((v) => v + 1);
              action?.();
            }}
          >
            {unknown ? "Leave project" : "Discard draft"}
          </Button>
        </div>
      </DialogContent>
    </Dialog.Root>
  );
  return (
    <div className="app-shell flex h-dvh min-h-0 flex-col overflow-clip bg-background">
      <a
        className="skip-link fixed -top-20 left-5 z-20 bg-background focus:top-2.5 p-2"
        href="#tokens"
      >
        Skip to tokens
      </a>
      <header
        className={`topbar small:h-13 short:h-11 shrink-0 border-b border-border h-16 flex items-center ${compact ? "pl-2 pr-6 gap-2" : "px-6 gap-5"}`}
      >
        {compact && (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Open project navigation"
            onClick={() => setNavigationOpen(true)}
          >
            <Bars3Icon aria-hidden="true" className="w-5 h-5" />
          </Button>
        )}
        <div className="brand flex items-center gap-2.5">
          <Square3Stack3DIcon aria-hidden="true" className="w-4 h-4" />
          <strong>Token Workbench</strong>
        </div>
        <span className="project-title small:hidden min-w-0 wrap-anywhere text-muted-foreground">
          {header.project.name || "(unnamed project)"}
        </span>
        <input
          ref={restoreInput}
          className="sr-only"
          type="file"
          aria-label="Project backup file"
          accept=".json,application/json"
          disabled={busy || !!unknown}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            if (!file) return;
            selectedBackupFile.current = file;
            if (file.size > 16777216) {
              setError(
                "Backup admission refused: " +
                  file.size +
                  " bytes exceeds 16777216 bytes.",
              );
              return;
            }
            setBusy(true);
            setError("");
            try {
              setRestorePreview(
                await host.call("stageBackup", {
                  bytes: await file.arrayBuffer(),
                }),
              );
            } catch (error) {
              setError(
                error instanceof Error
                  ? error.message
                  : "Backup preview unavailable. Applied data and drafts are unchanged.",
              );
            } finally {
              setBusy(false);
              event.target.value = "";
            }
          }}
        />
        <Button
          className="ml-auto"
          disabled={busy || !!unknown}
          onClick={() => restoreInput.current?.click()}
        >
          Restore backup
        </Button>
        <Button
          disabled={busy || !!readFailure}
          onClick={async () => {
            setBusy(true);
            setError("");
            try {
              await downloadProjectBackup(
                host,
                header.project.id,
                header.revision,
              );
              setNotice(
                "Backup download requested. Keep the independent file; download initiation does not confirm it was saved. Unapplied drafts are excluded and unchanged.",
              );
            } catch (e) {
              setError(
                e instanceof Error
                  ? e.message
                  : "Backup generation failed. Applied data and drafts are unchanged.",
              );
            } finally {
              setBusy(false);
            }
          }}
        >
          Download backup
        </Button>
        <Button
          disabled={busy}
          onClick={() =>
            request(() => {
              void host.call("leaveProject", header.project.id).then((safe) => {
                if (safe) {
                  generation.current++;
                  onProjects();
                }
              });
            })
          }
        >
          Projects
        </Button>
      </header>
      <div className="session-notice shrink-0 border-b border-border bg-notice text-notice-foreground text-caption px-5 py-2 min-h-9 flex items-center justify-center gap-2">
        <InformationCircleIcon
          aria-hidden="true"
          className="w-4 h-4 shrink-0"
        />
        <span>
          {header.writable
            ? "Applied work is retained in this browser. Drafts stay in this page. Keep independent backups."
            : "Inspection only. Another tab has editing access. Local drafts remain in this page."}
        </span>
        {!header.writable && (
          <Button disabled={busy} onClick={() => void refresh()}>
            Check access
          </Button>
        )}
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
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
            >
              {sidebarExpanded ? (
                <ChevronLeftIcon aria-hidden="true" className="w-4 h-4" />
              ) : (
                <ChevronRightIcon aria-hidden="true" className="w-4 h-4" />
              )}
              <span>Project groups</span>
            </Button>
            <div
              hidden={!sidebarExpanded}
              className="sidebar-content flex-1 px-3 pt-5.5 pb-5 flex flex-col min-h-0 overflow-auto"
            >
              {navigation}
            </div>
          </nav>
        )}
        <main
          id="tokens"
          ref={panel}
          tabIndex={-1}
          className="token-panel relative min-w-0 min-h-0 overflow-auto"
        >
          <div className="panel-header source-compact:items-start compact:flex-wrap mb-6.5 flex justify-between items-center gap-3">
            <div>
              <span className="eyebrow uppercase text-muted-foreground font-semibold">
                Tokens
              </span>
              <h1 className="my-1.5 small-title">
                {allContent
                  ? "All content"
                  : group === null
                    ? "All colors"
                    : (groupLabels.get(group) ?? "Missing group")}
              </h1>
              <p className="text-xs/normal text-muted-foreground">
                Build a vocabulary, then connect its meaning.
              </p>
            </div>
            <Button
              variant="default"
              size="panel"
              disabled={blocked}
              onClick={() => open("token")}
            >
              <PlusIcon aria-hidden="true" className="w-4 h-4" />
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
            {group !== null && (
              <Button disabled={blocked} onClick={() => open("rename")}>
                Rename group
              </Button>
            )}
          </div>
          {lifecycleBlocked && !busy && !unknown && (
            <section
              role="status"
              className="text-caption border border-border rounded p-3 mb-3"
            >
              <p>
                Editing paused. Recheck current retained state before applying
                preserved input.
              </p>
              <Button
                onClick={() => {
                  void host
                    .call("resume", header.project.id)
                    .then((next) => refresh(next))
                    .then(() => setLifecycleBlocked(false))
                    .catch((e) => setReadFailure(String(e)));
                }}
              >
                Check access and retained state
              </Button>
            </section>
          )}
          {readFailure && (
            <section
              role="alert"
              tabIndex={-1}
              className="error border border-error-border bg-error-surface rounded text-caption p-3 text-destructive mt-4"
            >
              <h2>Project read unavailable</h2>
              <p>{readFailure}</p>
              <p>
                Last coherent data is stale. Inputs are preserved; writes are
                blocked.
              </p>
              <Button disabled={busy} onClick={() => void retryReading()}>
                Retry reading project
              </Button>
            </section>
          )}
          {recovery}
          {!complete && !readFailure && (
            <p role="status">
              Preparing complete project list… {rows.length} of {header.tokens}{" "}
              tokens
            </p>
          )}
          {!allContent &&
            selection?.kind === "token" &&
            complete &&
            !visible.some((row) => row.id === selection.id) && (
              <section className="selection-context flex-wrap border border-border rounded-md mb-4 text-caption flex items-center justify-between gap-3 p-3 bg-muted">
                <p className="mt-2">Selected token is outside this list.</p>
                <Button
                  size="selection"
                  onClick={() => {
                    setGroup(null);
                    setQuery("");
                    requestAnimationFrame(() =>
                      panel.current
                        ?.querySelector<HTMLElement>('[aria-pressed="true"]')
                        ?.focus(),
                    );
                  }}
                >
                  Show selected token
                </Button>
              </section>
            )}
          {context &&
            (allContent ? (
              <AllContent
                key={JSON.stringify([header.project.id, header.revision])}
                context={context}
                groupLabels={groupLabels}
                onSelect={choose}
              />
            ) : (
              <>
                <ProjectedTokenList
                  context={context}
                  rows={visible}
                  selected={selection?.kind === "token" ? selection.id : null}
                  query={query}
                  onSelect={(id) => choose("token", id)}
                  onEmptyAction={() => (query ? setQuery("") : open("token"))}
                />
              </>
            ))}
          <section className="project-diagnostics text-caption mt-6">
            <details
              onToggle={(event) => {
                if (event.currentTarget.open && !diagnostics)
                  void host
                    .call("diagnostics", {
                      projectId: header.project.id,
                      revision: header.revision,
                    })
                    .then(setDiagnostics)
                    .catch((error) => setError(String(error)));
              }}
            >
              <summary>Project diagnostics · namespace and references</summary>
              {diagnostics ? (
                <>
                  {diagnostics.total === 0 && (
                    <p>No namespace or reference diagnostics.</p>
                  )}
                  {diagnostics.items.map((item, index) => (
                    <pre
                      key={index}
                      className="whitespace-pre-wrap wrap-anywhere my-3"
                    >
                      {item}
                    </pre>
                  ))}
                  {!diagnostics.complete && (
                    <p role="status">
                      Diagnostic display is incomplete. Structural checks remain
                      complete; this is not an all-clear result.
                    </p>
                  )}
                </>
              ) : (
                <p role="status">Preparing diagnostics…</p>
              )}
              <Button onClick={() => setAllContent(true)}>
                Inspect all content
              </Button>
            </details>
          </section>
          <p role="status" className="helper text-muted-foreground">
            {notice}
          </p>
          {error && !dialog && (
            <p role="alert" className="text-destructive text-caption mt-3">
              {error}
            </p>
          )}
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
              !targetUnavailable &&
              inspection?.editable &&
              feedback &&
              selection?.kind === "token" &&
              feedback.tokenId === selection.id && (
                <section
                  className="inspector-feedback flex items-center gap-2 shrink-0"
                  aria-label="Applied and draft color context"
                >
                  {(
                    [
                      "applied",
                      ...(feedback.tab === "resolved" ? [] : ["draft"]),
                    ] as ("applied" | "draft")[]
                  ).map((kind) => (
                    <div
                      key={kind}
                      className="text-caption flex flex-col items-center w-16"
                    >
                      <span>{kind === "applied" ? "Applied" : "Draft"}</span>
                      {feedback[kind] ? (
                        <span
                          aria-hidden="true"
                          className="header-specimen rounded border border-specimen-border block w-9 h-4"
                          style={{ background: feedback[kind] }}
                        />
                      ) : (
                        <span>Unavailable</span>
                      )}
                      <span className="sr-only">
                        {
                          feedback[
                            kind === "applied"
                              ? "appliedMessage"
                              : "draftMessage"
                          ]
                        }
                      </span>
                    </div>
                  ))}
                </section>
              )}
            {(readFailure ||
              targetUnavailable ||
              !inspection?.editable ||
              !feedback ||
              feedback.tokenId !== selection?.id) && (
              <span className="inspector-header-status text-caption leading-4 text-secondary">
                {readFailure || targetUnavailable
                  ? "Unavailable"
                  : selection
                    ? "Inspection only"
                    : "Select a token"}
              </span>
            )}
            <Button
              variant="ghost"
              size="icon"
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
              <ChevronDownIcon aria-hidden="true" className="w-4 h-4" />
            </Button>
          </div>
          <div
            id="token-inspector-content"
            className="inspector-content flex-1 bg-surface overflow-auto min-h-0"
            hidden={!inspectorExpanded}
          >
            {selection?.kind === "token" && inspection && context ? (
              <Editor
                key={JSON.stringify([selection.id, editorVersion])}
                inspection={inspection}
                project={context}
                inspect={(id) => {
                  const row = rows.find((r) => r.id === id);
                  return row?.preview
                    ? { resolution: { status: "resolved", value: row.preview } }
                    : undefined;
                }}
                onDirty={setDirty}
                onFeedback={setFeedback}
                readUnavailable={false}
                readOnly={blocked}
                targetUnavailable={targetUnavailable}
                revision={header.revision}
                requestSource={() => source("token", selection.id)}
                onApply={async (value) => {
                  completion.current = () => {
                    setEditorVersion((v) => v + 1);
                    setDirty(false);
                  };
                  const result = await accept({
                    operation: "reviseColorToken",
                    input: {
                      projectId: header.project.id,
                      tokenId: selection.id,
                      value,
                    },
                  });
                  if (
                    result.status !== "retained" ||
                    result.readback === "unavailable"
                  )
                    return {
                      status: "failure",
                      error: {
                        code: "storage-failure",
                        operation: "commit",
                        message:
                          result.status === "retained"
                            ? "Retained, readback unavailable. Retry reading only."
                            : result.reason,
                      },
                    };
                  const next = await host.call("inspection", {
                    projectId: header.project.id,
                    revision: result.revision,
                    tokenId: selection.id,
                  });
                  if (!next.authoredValue)
                    return {
                      status: "failure",
                      error: {
                        code: "invalid-domain-input",
                        message: "Accepted color unavailable for inspection",
                      },
                    };
                  setInspection(next);
                  completion.current = undefined;
                  return {
                    status: "ok",
                    value: {
                      definition: {
                        type: "color",
                        assignments: [
                          { condition: [] as never, value: next.authoredValue },
                        ],
                      },
                    },
                  } satisfies ApplicationResult<Pick<Token, "definition">>;
                }}
              />
            ) : selection?.kind === "group" && context ? (
              <div className="p-6">
                <h2 className="wrap-anywhere">
                  {groupLabels.get(selection.id)}
                </h2>
                <p className="text-caption">Group · Read only</p>
                <p className="wrap-anywhere">
                  Project identity: {JSON.stringify(header.project.id)}
                </p>
                <p className="wrap-anywhere">
                  Group identity: {JSON.stringify(selection.id)}
                </p>
                <pre className="exact-data whitespace-pre-wrap wrap-anywhere">
                  {JSON.stringify(
                    context.groups.find((g) => g.authored.id === selection.id)
                      ?.path,
                    null,
                    2,
                  )}
                </pre>
                <ExactSource
                  key={JSON.stringify([selection.id, header.revision])}
                  revision={header.revision}
                  request={() => source("group", selection.id)}
                />
              </div>
            ) : (
              <div className="empty px-5 py-17.5 text-center text-muted-foreground">
                <h2 className="text-foreground text-base/normal">
                  {selection ? "Preparing inspection…" : "No token selected"}
                </h2>
                <p className="text-xs/normal mt-2 mb-5">
                  Select or create a color token.
                </p>
              </div>
            )}
          </div>
        </section>
      </div>
      <footer className="statusbar narrow:flex-wrap small:px-4 small:py-1.5 short:hidden shrink-0 flex justify-between gap-4 border-t border-border bg-surface text-status px-5 py-2">
        <span>{header.tokens} tokens</span>
        <span className="small:hidden">
          {busy
            ? "Retention pending"
            : unknown
              ? "Outcome unknown"
              : readFailure
                ? "Stale / unavailable"
                : header.writable
                  ? "Applied state retained locally"
                  : "Inspection only"}
        </span>
        <Button
          size="selection"
          disabled={busy}
          onClick={() => void requestPersistentStorage().then(setNotice)}
        >
          Request persistent storage
        </Button>
      </footer>
      <Dialog.Root
        open={compact && navigationOpen}
        onOpenChange={setNavigationOpen}
      >
        <Dialog.Portal>
          <Dialog.Backdrop className="navigation-backdrop fixed inset-0 z-30 bg-scrim" />
          <Dialog.Popup className="navigation-drawer fixed top-0 bottom-0 left-0 z-35 border-r border-border bg-background flex flex-col overflow-hidden">
            <div className="navigation-heading border-b border-border px-4 py-3 flex items-center justify-between gap-3">
              <Dialog.Title>Project navigation</Dialog.Title>
              <Dialog.Close
                render={<Button variant="ghost" size="icon" />}
                aria-label="Close project navigation"
              >
                <XMarkIcon aria-hidden="true" className="w-4 h-4" />
              </Dialog.Close>
            </div>
            <Dialog.Description className="sr-only">
              Browse groups. Closing preserves drafts.
            </Dialog.Description>
            <nav className="sidebar-content flex-1 px-3 py-6 overflow-auto">
              {navigation}
            </nav>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
      {dialog === null && departureGuard}
      {restorePreview && (
        <RestoreDialog
          restage={async () => {
            if (!selectedBackupFile.current)
              throw Error("Select a project backup file again.");
            return host.call("stageBackup", {
              bytes: await selectedBackupFile.current.arrayBuffer(),
            });
          }}
          host={host}
          initial={restorePreview}
          onCancel={(reset) => {
            setRestorePreview(undefined);
            if (reset) {
              generation.current++;
              onProjects(true);
            }
          }}
          onOpen={(id) => {
            setRestorePreview(undefined);
            if (id === header.project.id) {
              void refresh();
              setNotice(
                "Retained project refreshed. Preserved drafts have not been applied; review any changed baseline before reapplying.",
              );
            } else
              request(() => {
                void host
                  .call("leaveProject", header.project.id)
                  .then((safe) => {
                    if (safe) {
                      generation.current++;
                      onProject(id);
                    }
                  });
              });
          }}
        />
      )}
      <CreationDialog
        guard={dialog !== null ? departureGuard : undefined}
        dialog={dialog}
        project={context}
        name={name}
        description={description}
        onDescriptionChange={(value) => {
          setDescription(value);
          setFormDirty(true);
        }}
        parent={parent}
        layer={layer}
        readFailure={readFailure}
        error={error}
        formError={formError}
        finalFocus={() => panel.current}
        onClose={() =>
          request(() => {
            setDialog(null);
            setFormDirty(false);
          })
        }
        onCreate={() => void create()}
        onNameChange={(value) => {
          setName(value);
          setFormDirty(true);
        }}
        onParentChange={(value) => {
          setParent(value);
          setFormDirty(true);
        }}
        onLayerChange={(value) => {
          setLayer(value);
          setFormDirty(true);
        }}
        onRetry={() => void retryReading()}
        submissionBlocked={
          !!formBaseline &&
          formBaseline.revision !== header.revision &&
          !formReviewed
            ? "Review the changed baseline before creating or renaming."
            : dialog === "rename" &&
                !context?.groups.some(
                  (g) => g.authored.id === formBaseline?.target,
                )
              ? "Original rename target is unavailable. Input is preserved; mutation is blocked."
              : dialog !== "rename" &&
                  parent !== null &&
                  !context?.groups.some((g) => g.authored.id === parent)
                ? "Original parent is unavailable. Input is preserved; mutation is blocked without retargeting."
                : undefined
        }
        pending={busy || !!unknown || !!retainedPending || pending !== null}
        recovery={
          <>
            {recovery}
            {formBaseline && formBaseline.revision !== header.revision && (
              <section className="text-caption border border-border rounded p-3 mb-4">
                <h3>Form baseline changed</h3>
                <p className="wrap-anywhere">
                  Original target/parent identity:{" "}
                  {JSON.stringify(formBaseline.target)}
                </p>
                <p className="whitespace-pre-wrap wrap-anywhere">
                  Previous applied name: {formBaseline.name || "(unnamed)"}
                </p>
                <p className="whitespace-pre-wrap wrap-anywhere">
                  Current applied name:{" "}
                  {context?.groups.find(
                    (g) => g.authored.id === formBaseline.target,
                  )?.authored.localName ?? "(target unavailable)"}
                </p>
                <p className="whitespace-pre-wrap wrap-anywhere">
                  Preserved input: {name}
                </p>
                <Button
                  disabled={busy || !!unknown}
                  onClick={() => setFormReviewed(true)}
                >
                  Review changes
                </Button>
                {formReviewed && (
                  <p>
                    Reviewed. The existing Create/Rename action will validate
                    this preserved input against the current revision.
                  </p>
                )}
              </section>
            )}
          </>
        }
      />
    </div>
  );
}
