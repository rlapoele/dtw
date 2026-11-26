import { InspectorHeading } from "@presentation/App/components/TokensWorkbench/components/InspectorHeading";
import { WorkspaceHeading } from "@presentation/App/components/TokensWorkbench/components/WorkspaceHeading";
import { RampReferenceReview } from "@presentation/App/components/TokensWorkbench/components/RampWorkbench/components/RampReferenceReview";
import { RampImpactPreview } from "@presentation/App/components/TokensWorkbench/components/RampWorkbench/components/RampImpactPreview";
import {
  useEffect,
  useState,
  useRef,
  type RefObject,
  type MutableRefObject,
} from "react";
import { createPortal } from "react-dom";
import { Dialog } from "@base-ui/react/dialog";
import { DialogContent } from "@presentation/ui/dialog-content";
import { Button } from "@presentation/ui/button";
import { InspectorHeader } from "@presentation/App/components/TokensWorkbench/components/InspectorHeader";
import { InspectorSection } from "@presentation/App/components/TokensWorkbench/components/InspectorSection";
import { TokenValueComparison } from "@presentation/App/components/TokensWorkbench/components/TokenValueComparison";
import { RampStepInspection } from "@presentation/App/components/TokensWorkbench/components/RampWorkbench/components/RampStepInspection";
import { Select } from "@presentation/ui/select";
import { Field } from "@presentation/ui/field";
import { Icon } from "@presentation/ui/icon";
import { COLOR_COMPONENTS, COMPONENT_NAMES } from "@domain/color-components";
import {
  COLOR_SPACES,
  createColorLiteral,
  type ColorSpace,
} from "@domain/color-literal";
import { convertColor } from "@domain/color-calculation";
import { effectiveDefaultColorSpace } from "@domain/project";
import {
  generateColorRamp,
  autoRampPosition,
  rampLabels,
  rampPreviewKey,
  type RampSettings,
} from "@domain/color-ramp";
import {
  previewRampDraft,
  openRampDraft,
  replaceRampCount,
  regenerateRamp,
  rampImpacts,
  downstreamTokens,
  type RampDraft,
  type RampStep,
  type ApplyRampInput,
} from "@application/color-ramp-authoring";
import type { ProjectSnapshot } from "@application/project-storage";
import type { WorkbenchHost, ProjectHeader } from "@hosts/browser/protocol";
import { deriveTokenPath, deriveTokenGroupPath } from "@domain/namespace";
import { colorDecimalDisplay } from "@presentation/App/components/TokensWorkbench/helpers/color-decimal-display";
import { colorPreview } from "@presentation/App/components/TokensWorkbench/helpers/color-preview";
import { ColorLiteralFields } from "@presentation/App/components/TokensWorkbench/components/ColorLiteralFields";
import { RampSeedFields } from "@presentation/App/components/TokensWorkbench/components/RampSeedFields";
import { RampPreview } from "@presentation/App/components/TokensWorkbench/components/RampPreview";
export function RampWorkbench({
  host,
  header,
  groupId,
  inspector,
  panel,
  hidden,
  disabled,
  onDirty,
  onSave,
  applyAction,
  onRename,
  onInspect,
  inspectorVisible = true,
  inspectorExpanded = true,
  onToggleInspector = () => {},
}: {
  host: WorkbenchHost;
  header: ProjectHeader;
  groupId: string;
  inspector: HTMLElement | null;
  panel: RefObject<HTMLElement | null>;
  hidden: boolean;
  disabled: boolean;
  onDirty: (dirty: boolean) => void;
  onSave: (input: ApplyRampInput) => Promise<boolean>;
  onRename: () => void;
  onInspect: () => void;
  inspectorVisible?: boolean;
  inspectorExpanded?: boolean;
  onToggleInspector?: () => void;
  applyAction: MutableRefObject<(() => Promise<boolean>) | null>;
}) {
  const [snapshot, setSnapshot] = useState<ProjectSnapshot>(),
    [draft, setDraft] = useState<RampDraft>(),
    [original, setOriginal] = useState<RampDraft>(),
    [error, setError] = useState(""),
    [selected, setSelected] = useState<string | null>(null),
    [space, setSpace] = useState<ColorSpace>(
      effectiveDefaultColorSpace(header.project),
    ),
    [background, setBackground] = useState("checkerboard"),
    [requestedCount, setRequestedCount] = useState<number>(),
    [invalid, setInvalid] = useState<Record<string, boolean>>({}),
    [seedValid, setSeedValid] = useState(true),
    [epoch, setEpoch] = useState(0),
    [fieldVersions, setFieldVersions] = useState<Record<string, number>>({});
  function resetFields(ids: string[]) {
    setFieldVersions((v) => ({
      ...v,
      ...Object.fromEntries(ids.map((id) => [id, (v[id] ?? 0) + 1])),
    }));
  }
  const [inspectionTabs, setInspectionTabs] = useState<Record<string, string>>({});
  const [editSections, setEditSections] = useState<Record<string, boolean>>({});
  const baselineRevision = useRef(header.revision);
  useEffect(() => {
    let live = true;
    host
      .call("rampSnapshot", {
        projectId: header.project.id,
        revision: header.revision,
      })
      .then((s) => {
        if (!live) return;
        setSnapshot(s);
        try {
          const d = openRampDraft(s, groupId);
          setDraft(d);
          setOriginal(d);
          baselineRevision.current = header.revision;
        } catch (e) {
          setError(String(e));
        }
      })
      .catch((e) => live && setError(String(e)));
    return () => {
      live = false;
    };
  }, [groupId]);
  const dirty =
    !!draft &&
    !!original &&
    (JSON.stringify(draft) !== JSON.stringify(original) ||
      !seedValid ||
      Object.values(invalid).some(Boolean));
  useEffect(() => onDirty(dirty), [dirty]);
  let calculation = "";
  if (draft)
    try {
      generateColorRamp(draft.settings, draft.steps.length);
    } catch (e) {
      calculation = e instanceof Error ? e.message : "Unavailable calculation";
    }
  const impacts =
    snapshot && draft ? rampImpacts(snapshot, groupId, draft.steps) : undefined;
  const proposed =
    snapshot && draft ? previewRampDraft(snapshot, groupId, draft) : undefined;
  const pendingChoices =
    impacts?.required.filter(
      (r) => !draft?.choices.some((c) => c.key === r.key),
    ).length ?? 0;
  const blocked =
    disabled ||
    !draft ||
    !snapshot ||
    !seedValid ||
    Object.values(invalid).some(Boolean) ||
    !!calculation ||
    pendingChoices > 0 ||
    baselineRevision.current !== header.revision;
  async function save() {
    if (blocked || !draft) return false;
    if (!dirty) return true;
    const ok = await onSave({
      projectId: header.project.id,
      groupId,
      settings: draft.settings,
      steps: draft.steps,
      choices: draft.choices,
    });
    if (ok) {
      setOriginal(draft);
      onDirty(false);
    }
    return ok;
  }
  useEffect(() => {
    applyAction.current = save;
    return () => {
      applyAction.current = null;
    };
  });
  function updateStep(id: string, change: Partial<RampStep>) {
    setDraft((d) =>
      d
        ? {
            ...d,
            steps: d.steps.map((s) => (s.id === id ? { ...s, ...change } : s)),
          }
        : d,
    );
  }
  function settings(next: RampSettings) {
    if (!draft) return;
    try {
      setDraft(regenerateRamp(draft, next));
      setError("");
      const regenerated = draft.steps
        .filter((s) => !s.protected)
        .map((s) => s.id);
      resetFields(regenerated);
      setInvalid((v) =>
        Object.fromEntries(
          Object.entries(v).filter(([id]) => !regenerated.includes(id)),
        ),
      );
    } catch (e) {
      setDraft({ ...draft, settings: next });
      setError(e instanceof Error ? e.message : "Invalid settings");
    }
  }
  function path(id: string) {
    if (!snapshot) return id;
    const p = deriveTokenPath(
      {
        projectId: snapshot.project.id,
        groups: snapshot.groups,
        tokens: snapshot.tokens,
      },
      id,
    );
    return p.status === "derived" ? p.path.join(" / ") : id;
  }
  const groupPath = snapshot
    ? deriveTokenGroupPath(
        {
          projectId: snapshot.project.id,
          groups: snapshot.groups,
          tokens: snapshot.tokens,
        },
        groupId,
      )
    : undefined;
  const title =
    groupPath?.status === "derived"
      ? groupPath.path.join(" / ")
      : (snapshot?.groups.find((g) => g.id === groupId)?.localName ??
        "Color ramp");
  const details =
    draft && snapshot ? (
      <div className="flex flex-col min-h-0 h-full">
        <InspectorHeader title={selected ? "COLOR TOKEN" : "RAMP SETTINGS"} readFailure="" targetUnavailable="" editable selected inspectorExpanded={inspectorExpanded} onToggle={onToggleInspector} />
        <div id="token-inspector-content" inert={!inspectorExpanded} aria-hidden={!inspectorExpanded} className="inspector-content overflow-auto min-h-0 flex-1 bg-surface">
          <div hidden={selected !== null} className="p-5 space-y-4">
            <h2>Ramp settings</h2>
            <p className="text-caption">One shared draft · {draft.steps.length} Primitive color tokens</p>
            <RampSeedFields
              key={epoch}
              seed={draft.settings.seed}
              gamut={draft.settings.targetGamut}
              defaultSpace={effectiveDefaultColorSpace(header.project)}
              disabled={disabled}
              onValidity={setSeedValid}
              onChange={(seed, targetGamut) =>
                settings({ ...draft.settings, seed, targetGamut })
              }
            />
            <Field>
              Step count
              <Select
                disabled={disabled}
                value={draft.steps.length}
                onChange={(e) => setRequestedCount(Number(e.target.value))}
              >
                {Array.from({ length: 19 }, (_, i) => (
                  <option key={i + 2}>{i + 2}</option>
                ))}
              </Select>
            </Field>
            <Field>
              Color intensity
              <Select
                value={draft.settings.recipe.intensity}
                disabled={disabled}
                onChange={(e) =>
                  settings({
                    ...draft.settings,
                    recipe: {
                      ...draft.settings.recipe,
                      intensity: e.target.value as "retained" | "restrained",
                    },
                  })
                }
              >
                <option value="retained">Retained</option>
                <option value="restrained">Restrained</option>
              </Select>
            </Field>
            <Field>
              Seed position
              <Select
                value={draft.settings.seedPosition.label}
                disabled={disabled}
                onChange={(e) =>
                  settings({
                    ...draft.settings,
                    seedPosition: { mode: "manual", label: e.target.value },
                  })
                }
              >
                {!draft.steps.some(
                  (s) => s.label === draft.settings.seedPosition.label,
                ) && <option>{draft.settings.seedPosition.label}</option>}
                {draft.steps.map((s) => (
                  <option key={s.label}>{s.label}</option>
                ))}
              </Select>
            </Field>
            <Button
              disabled={disabled}
              onClick={() =>
                settings({
                  ...draft.settings,
                  seedPosition: {
                    mode: "auto",
                    label: autoRampPosition(
                      draft.settings.seed,
                      draft.steps.length,
                    ),
                  },
                })
              }
            >
              Recalculate Auto position
            </Button>
            <p className="text-caption">
              Seed placement:{" "}
              {draft.settings.seedPosition.mode === "auto" ? "Auto" : "Manual"}{" "}
              · step {draft.settings.seedPosition.label}.{" "}
              {draft.replacement && draft.settings.seedPosition.mode === "auto"
                ? "If the previous position disappeared, Auto selected the nearest reference lightness."
                : ""}
            </p>
            <p className="text-caption">
              Regeneration preserves Protected colors and replaces all
              unprotected colors, including Manual colors.
            </p>
          </div>
          {draft.steps.map((step) => (
            <div
              key={step.id}
              hidden={selected !== step.id}
              className="inspector flex min-w-0 flex-col bg-surface"
            >
              <InspectorHeading active={selected === step.id}>
                <div className="flex flex-wrap items-start gap-3 min-w-0">
                  <h2 className="wrap-anywhere my-1 text-inspector font-semibold min-w-0 max-w-full">{title} / {step.label}</h2>
                  <TokenValueComparison feedback={{ tokenId: step.id, tab: inspectionTabs[step.id] ?? "authored", applied: colorPreview(original?.steps.find(s => s.id === step.id)?.value).css, draft: invalid[step.id] ? undefined : colorPreview(step.value).css, appliedMessage: original?.steps.some(s => s.id === step.id) ? "Currently applied color" : "New step; no applied color", draftMessage: invalid[step.id] ? "Complete invalid color input" : "Unapplied ramp color" }} />
                </div>
              </InspectorHeading>
              <div className="px-6 mobile:px-4">
              <InspectorSection title="Token details" open={editSections[step.id] !== false} onToggle={() => setEditSections(v => ({ ...v, [step.id]: v[step.id] === false }))}>
                <label className="block text-caption font-medium mb-1.75" htmlFor={`ramp-description-${step.id}`}>Description</label>
                <textarea id={`ramp-description-${step.id}`} rows={3} disabled={disabled} value={step.description ?? ""} onChange={e => updateStep(step.id, { description: e.target.value })} className="block w-full min-w-0 rounded-md border-2 border-input bg-background text-foreground px-2.5 py-2 text-caption resize-y mb-4.25" />
                <div className="w-full mb-4.25">
                  <label className="block text-caption font-medium mb-1" htmlFor={`ramp-layer-${step.id}`}>Layer</label>
                  <Select id={`ramp-layer-${step.id}`} disabled value="primitive"><option value="primitive">Primitive</option></Select>
                  <p className="text-caption text-muted-foreground mt-2">Ramp members remain Primitive literal colors while membership applies.</p>
                </div>
                <fieldset disabled={disabled} className="mb-0">
                  <legend className="sr-only">Value source</legend>
                  <label className="inline-flex min-h-9 items-center gap-2 text-caption"><input type="radio" checked readOnly name={`ramp-source-${step.id}`} className="size-4 shrink-0 accent-primary disabled:cursor-default" />Literal color</label>
                </fieldset>
                <div className="mt-4.25">
              <ColorLiteralFields
                key={`${step.id}/${epoch}/${fieldVersions[step.id] ?? 0}/${space}`}
                value={step.value}
                space={space}
                onViewChange={(next) => {
                  if (Object.values(invalid).some(Boolean))
                    throw new Error(
                      "Complete invalid step inputs before changing component space.",
                    );
                  setSpace(next);
                }}
                disabled={disabled}
                onValidity={(valid) =>
                  setInvalid((v) => ({ ...v, [step.id]: !valid }))
                }
                onChange={(value) =>
                  updateStep(step.id, { value, colorOrigin: "manual" })
                }
              />
                </div>
                <p className="helper text-muted-foreground font-normal preview-detail mt-2 wrap-anywhere">Draft preview: {invalid[step.id] ? "Unavailable: finish valid exact component and alpha entries." : colorPreview(step.value).message}</p>
              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={step.protected}
                  disabled={disabled}
                  onChange={(e) =>
                    updateStep(step.id, { protected: e.target.checked })
                  }
                />
                Protected from ordinary regeneration
              </label>
              {step.label === draft.settings.seedPosition.label &&
                JSON.stringify(step.value) !==
                  JSON.stringify(draft.settings.seed) && (
                  <p className="notification notification-information">
                    This token differs from the recipe seed. Editing it does not
                    change the recipe seed.
                  </p>
                )}
              <Button
                disabled={disabled}
                onClick={() => {
                  if (draft.replacement) {
                    try {
                      const generated = generateColorRamp(
                        draft.settings,
                        draft.steps.length,
                      ).find((s) => s.label === step.label)!;
                      updateStep(step.id, {
                        value: generated.value,
                        colorOrigin: "generated",
                      });
                    } catch (e) {
                      setError(String(e));
                    }
                  } else {
                    const saved = original?.steps.find((s) => s.id === step.id);
                    if (saved)
                      setDraft({
                        ...draft,
                        steps: draft.steps.map((current) =>
                          current.id === step.id ? saved : current,
                        ),
                      });
                  }
                  setInvalid((v) => ({ ...v, [step.id]: false }));
                  resetFields([step.id]);
                }}
              >
                {draft.replacement ? "Reset color to generated" : "Revert"}
              </Button>
              </InspectorSection>
              </div>
              {selected === step.id && <RampStepInspection tab={inspectionTabs[step.id] ?? "authored"} onTabChange={tab => setInspectionTabs(v => ({ ...v, [step.id]: tab }))} snapshot={snapshot} tokenId={step.id} revision={baselineRevision.current} />}

            </div>
          ))}
          {impacts && impacts.required.length > 0 && (
            <section className="space-y-3">
              <h3>Reference decisions · {pendingChoices} pending</h3>
              {[...impacts.required]
                .sort(
                  (a, b) =>
                    Number(!!draft.choices.find((c) => c.key === a.key)) -
                    Number(!!draft.choices.find((c) => c.key === b.key)),
                )
                .map((use) => (
                  <RampReferenceReview
                    key={`${epoch}/${use.key}`}
                    use={use}
                    draft={draft}
                    path={path}
                    preview={
                      <RampImpactPreview
                        before={snapshot}
                        after={proposed!}
                        tokenId={use.tokenId}
                        path={path}
                      />
                    }
                    affected={downstreamTokens(snapshot, use.tokenId).map((t) =>
                      path(t.id),
                    )}
                    disabled={disabled}
                    onChoice={(target) =>
                      setDraft({
                        ...draft,
                        choices: [
                          ...draft.choices.filter((c) => c.key !== use.key),
                          { key: use.key, target },
                        ],
                      })
                    }
                    onPending={() =>
                      setDraft({
                        ...draft,
                        choices: draft.choices.filter((c) => c.key !== use.key),
                      })
                    }
                  />
                ))}
            </section>
          )}
          {!!impacts?.informational.length && (
            <details>
              <summary>
                Other affected tokens · {impacts.informational.length}
              </summary>
              <p>Connections stay intact; colors change.</p>
              {impacts.informational.map((t) => (
                <section key={t.id}>
                  <p>{path(t.id)}</p>
                  <RampImpactPreview
                    before={snapshot}
                    after={proposed!}
                    tokenId={t.id}
                    path={path}
                  />
                </section>
              ))}
            </details>
          )}
          {calculation && <p role="alert">{calculation}</p>}
          {error && <p role="alert">{error}</p>}
          {baselineRevision.current !== header.revision && (
            <p role="alert">
              The retained baseline changed. Input is preserved; discard and
              reopen before applying.
            </p>
          )}
          {Object.values(invalid).some(Boolean) && (
            <p>Complete the invalid step inputs before Apply.</p>
          )}
        </div>
        <footer hidden={!inspectorExpanded} className="border-t border-border bg-background p-4 flex flex-wrap gap-2">
          <p className="w-full text-caption">
            Apply saves the complete ramp and {impacts?.required.length ?? 0}{" "}
            reviewed reference occurrences.
          </p>
          <Button
            variant="default"
            disabled={blocked || !dirty}
            onClick={() => void save()}
          >
            Apply ramp changes
          </Button>
          <Button
            disabled={disabled || !dirty}
            onClick={() => {
              setDraft(original);
              setInvalid({});
              setSeedValid(true);
              setError("");
              setEpoch((x) => x + 1);
            }}
          >
            Discard draft
          </Button>
        </footer>
      </div>
    ) : (
      <div className="p-5">
        <h2>{title}</h2>
        <p role="status">{error || "Loading ramp…"}</p>
        <p>
          Incompatible ramps remain inspectable; ordinary data is preserved.
        </p>
      </div>
    );
  return (
    <>
      <main
        id="tokens"
        ref={panel}
        hidden={hidden}
        tabIndex={-1}
        className="token-panel overflow-auto min-w-0 p-6"
      >
        <WorkspaceHeading title={title} onRename={onRename} renameDisabled={disabled} />
        <p className="text-caption mb-4">
          Colors are authored tokens. Settings do not regenerate them when
          reopening.
        </p>
        {draft && (
          <>
            <div className="flex flex-wrap items-end gap-3 mb-4">
              <Field>
                Component space
                <Select
                  value={space}
                  disabled={Object.values(invalid).some(Boolean)}
                  onChange={(e) => setSpace(e.target.value as ColorSpace)}
                >
                  {COLOR_SPACES.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </Select>
              </Field>
              <Field>
                Background
                <Select
                  value={background}
                  onChange={(e) => setBackground(e.target.value)}
                >
                  <option value="checkerboard">Checkerboard</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </Select>
              </Field>
              {(!inspectorVisible || selected !== null) && <Button
                variant="ghost"
                className="mb-4.25"
                onClick={() => {
                  setSelected(null);
                  onInspect();
                }}
              >
                Ramp settings
              </Button>}
            </div>
            <div className="overflow-x-auto">
              <table className="border-separate border-spacing-3 min-w-max">
                <caption className="sr-only">Ramp steps and color components in {space}</caption>
                <thead>
                  <tr>
                    <td />
                    {draft.steps.map((step) => (
                      <th key={step.id} scope="col" className="w-24 min-w-24 font-normal align-top">
                        <div className="space-y-2">
                      <Button
                        className="w-full"
                        variant="ghost"
                        aria-pressed={selected === step.id}
                        onClick={() => {
                          setSelected(step.id);
                          onInspect();
                        }}
                      >
                        {step.label}
                      </Button>
                      <button
                        className="block h-24 w-full rounded-xl border border-border"
                        aria-label={`Edit ${title} ${step.label}`}
                        onClick={() => {
                          setSelected(step.id);
                          onInspect();
                        }}
                        style={{
                          background:
                            background === "dark"
                              ? "#111"
                              : background === "light"
                                ? "#fff"
                                : "repeating-conic-gradient(#ddd 0% 25%,#fff 0% 50%) 0 / 12px 12px",
                        }}
                      >
                        <span
                          className="block size-full rounded-xl"
                          style={{ background: colorPreview(step.value).css }}
                        />
                      </button>
                      <p className="text-caption truncate text-center">
                        {(() => {
                          try {
                            return (
                              "#" +
                              rampPreviewKey(step.value)
                                .split("/")[0]
                                .split(",")
                                .map((n) =>
                                  Number(n).toString(16).padStart(2, "0"),
                                )
                                .join("")
                                .toUpperCase()
                            );
                          } catch {
                            return "Unavailable";
                          }
                        })()}
                      </p>
                      <p className="text-caption text-center">{step.colorOrigin}</p>
                      <Button
                        variant="ghost"
                        className="w-full"
                        aria-label={`${step.protected ? "Unprotect" : "Protect"} step ${step.label}`}
                        aria-pressed={step.protected}
                        disabled={disabled}
                        onClick={() =>
                          updateStep(step.id, { protected: !step.protected })
                        }
                      >
                        <Icon
                          name={step.protected ? "protected" : "unprotected"}
                        />
                      </Button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COLOR_COMPONENTS[space].map((identity, index) => (
                    <tr key={identity}>
                      <th scope="row" className="text-caption text-left font-medium align-middle pr-2">
                        {COMPONENT_NAMES[identity]}
                      </th>
                      {draft.steps.map((step) => {
                        const conversion = convertColor(step.value, space);
                        if (!conversion.ok) return (
                          <td key={step.id} className="text-caption text-center text-muted-foreground">
                            Unavailable
                          </td>
                        );
                        const view = conversion.value;
                        const component = view.components[index];
                        const min = identity === "a" || identity === "b" ? -0.4 : 0;
                        const max = identity === "hue" ? 360 : space === "hsl" ? 100 : identity === "chroma" ? 0.4 : 1;
                        return (
                          <td key={step.id} className="text-center">
                            <label className="flex flex-col items-center text-caption gap-1">
                              <input
                                type="range"
                                className="ramp-component-slider h-24"
                                min={min}
                                max={max}
                                step="any"
                                value={component === "none" ? min : Number(component)}
                                disabled={disabled}
                                aria-label={`${step.label} ${COMPONENT_NAMES[identity]}`}
                                onChange={(e) => {
                                  try {
                                    const components: string[] = [...view.components];
                                    components[index] = e.target.value;
                                    updateStep(step.id, {
                                      value: createColorLiteral({ ...view, components }),
                                      colorOrigin: "manual",
                                    });
                                    resetFields([step.id]);
                                  } catch (e) {
                                    setError(String(e));
                                  }
                                }}
                              />
                              <span className="max-w-24 truncate" title={component}>
                                {colorDecimalDisplay(component)}
                              </span>
                            </label>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-caption mt-4">
              Alpha:{" "}
              {new Set(draft.steps.map((s) => s.value.alpha)).size > 1
                ? "Mixed alpha"
                : draft.steps[0].value.alpha}{" "}
              · HEX is an sRGB preview.
            </p>
            <details className="mt-4">
              <summary>Full paths and authored values</summary>
              <RampPreview steps={draft.steps} path={title} />
            </details>
          </>
        )}
        {error && !draft && <p role="alert">{error}</p>}
      </main>
      {inspector && createPortal(details, inspector)}
      <Dialog.Root
        open={requestedCount !== undefined}
        onOpenChange={(open) => {
          if (!open) setRequestedCount(undefined);
        }}
      >
        <DialogContent>
          <Dialog.Title>Replace with {requestedCount} steps?</Dialog.Title>
          <Dialog.Description>
            Regenerate Manual and Protected colors. Remove missing steps,
            including Protected steps. Changing the count back does not restore
            individual colors or remapping choices. Nothing is saved until
            Apply.
          </Dialog.Description>
          <details className="my-4">
            <summary>Details</summary>
            <p>
              Surviving labels keep identities, descriptions and protection. New
              steps start Generated and unprotected. Reference decisions require
              individual acceptance. Discard draft restores the saved ramp.
            </p>
          </details>
          {snapshot && draft && requestedCount && (
            <p>
              {(() => {
                try {
                  const replacement = replaceRampCount(
                    snapshot,
                    groupId,
                    draft,
                    requestedCount,
                    (() => {
                      let n = 0;
                      return () => "preview" + ++n;
                    })(),
                  );
                  const count = rampImpacts(
                    snapshot,
                    groupId,
                    replacement.steps,
                  ).required.length;
                  return count
                    ? `${count} reference occurrences need review.`
                    : null;
                } catch (e) {
                  return String(e);
                }
              })()}
            </p>
          )}
          <div className="flex gap-2 mt-4">
            <Button onClick={() => setRequestedCount(undefined)}>Cancel</Button>
            <Button
              variant="default"
              disabled={disabled}
              onClick={() => {
                if (!snapshot || !draft || !requestedCount) return;
                try {
                  setDraft(
                    replaceRampCount(
                      snapshot,
                      groupId,
                      draft,
                      requestedCount,
                      () => crypto.randomUUID(),
                    ),
                  );
                  setRequestedCount(undefined);
                  setSelected(null);
                  setInvalid({});
                  setEpoch((x) => x + 1);
                  setError("");
                } catch (e) {
                  setError(String(e));
                  setRequestedCount(undefined);
                }
              }}
            >
              Replace in draft
            </Button>
          </div>
        </DialogContent>
      </Dialog.Root>
    </>
  );
}
