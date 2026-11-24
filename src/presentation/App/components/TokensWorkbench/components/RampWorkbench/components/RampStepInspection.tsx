import { useState } from "react";
import { Tabs } from "@base-ui/react/tabs";
import type { ProjectSnapshot } from "@application/project-storage";
import { projectContext, selectedInspection } from "@application/retention/projections";
import { InspectorSection } from "@presentation/App/components/TokensWorkbench/components/InspectorSection";
import { TokenEditorTabs } from "@presentation/App/components/TokensWorkbench/components/TokenEditorTabs";
import { TokenMetadata } from "@presentation/App/components/TokensWorkbench/components/TokenMetadata";
import { ResolvedTokenPanel } from "@presentation/App/components/TokensWorkbench/components/ResolvedTokenPanel";
import { ExactSource } from "@presentation/App/components/TokensWorkbench/components/ExactSource";
import { AuthoredValue } from "@presentation/App/components/TokensWorkbench/components/AuthoredValue";
import { colorPreview } from "@presentation/App/components/TokensWorkbench/helpers/color-preview";
import { hexPreview } from "@presentation/App/components/TokensWorkbench/helpers/hex-preview";

/** Reads the saved snapshot only; the parent owns the complete ramp draft. */
export function RampStepInspection({ snapshot, tokenId, revision, tab, onTabChange }: { tab: string; onTabChange: (tab: string) => void; snapshot: ProjectSnapshot; tokenId: string; revision: string }) {
  const [sections, setSections] = useState({ applied: false, metadata: false, resolved: false, trace: false, diagnostics: false, raw: false });
  const toggle = (key: keyof typeof sections) => setSections(s => ({ ...s, [key]: !s[key] }));
  const token = snapshot.tokens.find(t => t.id === tokenId);
  if (!token) return <p className="px-6 py-4 text-caption text-muted-foreground">New step: applied data and resolution are available after applying the ramp.</p>;
  const inspection = selectedInspection(snapshot, tokenId);
  const project = projectContext(snapshot);
  const value = inspection.authoredValue;
  const preview = colorPreview(value?.kind === "literal" ? value : undefined);
  const hex = hexPreview(value?.kind === "literal" ? value : undefined);
  const groupLabels = new Map(project.groups.map(g => [g.authored.id, g.path.status === "derived" ? g.path.path.join(" / ") : g.authored.localName]));
  return <Tabs.Root value={tab} onValueChange={onTabChange}>
    <TokenEditorTabs />
    <Tabs.Panel value={tab} className="editor-body bg-surface px-6 pb-6 mobile:px-4 mobile:pb-4">
      {tab === "authored" ? <>
        <InspectorSection appliedSummary title="Currently applied" open={sections.applied} onToggle={() => toggle("applied")}>
          <dl className="text-caption mb-3"><dt className="text-muted-foreground">Description</dt><dd className="whitespace-pre-wrap wrap-anywhere">{token.description ?? "No description"}</dd><dt className="text-muted-foreground mt-3">Layer</dt><dd>{token.layer ?? "Unspecified"}</dd></dl>
          <AuthoredValue value={value} project={project} approximate />
          <dl className="details text-caption"><div className="flex justify-between gap-4 py-2.5 border-b-hairline border-border"><dt className="text-muted-foreground">HEX (sRGB preview)</dt><dd className="text-right min-w-0 wrap-anywhere font-mono" title={hex}>{hex.match(/#[0-9A-F]{6}$/)?.[0] ?? "Unavailable"}</dd></div></dl>
        </InspectorSection>
        <InspectorSection title="Metadata" open={sections.metadata} onToggle={() => toggle("metadata")}><TokenMetadata token={token} groupLabels={groupLabels} path={inspection.path} /></InspectorSection>
        <ExactSource revision={revision} request={() => Promise.resolve(JSON.stringify(token, null, 2))} />
      </> : <ResolvedTokenPanel sections={sections} onToggle={toggle} revision={revision} resolution={inspection.resolution} project={project} css={preview.css} message={preview.message} />}
    </Tabs.Panel>
  </Tabs.Root>;
}
