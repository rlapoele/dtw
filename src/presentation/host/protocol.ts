import type { WriteIdentity } from "@application/retention/ports";
import type { DiagnosticDisplay } from "@application/retention/diagnostics";
import type {
  ProjectContext,
  DisplayRow,
  SelectedToken,
} from "@application/retention/projections";
import type {
  CatalogueEntry,
  Acceptance,
  AuthoringCommand,
} from "@application/retention/ports";
import type { Project } from "@domain/project";
export type ProjectHeader = {
  project: Project;
  revision: string;
  incarnation: string;
  writable: boolean;
  tokens: number;
  groups: number;
};
export type PublicAcceptance =
  | Omit<Extract<Acceptance, { status: "retained" }>, "before" | "after">
  | Exclude<Acceptance, { status: "retained" }>;
export type RestorePreview = {
  stageId: string;
  project: Project;
  createdAt: string;
  tokens: number;
  groups: number;
  diagnostics: DiagnosticDisplay;
  local: { revision: string; name: string } | null;
};
export interface HostCalls {
  recoverInterrupted: { input: WriteIdentity; output: PublicAcceptance };
  suspend: { input: null; output: true };
  resume: { input: string; output: ProjectHeader };
  diagnostics: {
    input: { projectId: string; revision: string };
    output: DiagnosticDisplay;
  };
  stageBackup: { input: { bytes: ArrayBuffer }; output: RestorePreview };
  refreshStage: { input: string; output: RestorePreview };
  backup: {
    input: { projectId: string; revision: string };
    output: { bytes: ArrayBuffer; revision: string; createdAt: string };
  };
  restore: {
    input: {
      stageId: string;
      projectId: string;
      expectedRevision: string | null;
      protectedRevision: string | null;
      acknowledgement: boolean;
    };
    output: PublicAcceptance;
  };

  context: {
    input: { projectId: string; revision: string };
    output: ProjectContext;
  };
  rows: {
    input: {
      projectId: string;
      revision: string;
      offset: number;
      count: number;
    };
    output: DisplayRow[];
  };
  inspection: {
    input: { projectId: string; revision: string; tokenId: string };
    output: SelectedToken;
  };
  source: {
    input: {
      projectId: string;
      revision: string;
      entityKind: "project" | "group" | "token";
      entityId: string;
    };
    output: { sourceId: string; units: number; revision: string };
  };
  sourceFrame: {
    input: { sourceId: string; offset: number; count: number };
    output: {
      sourceId: string;
      offset: number;
      units: number;
      revision: string;
      text: string;
      complete: boolean;
    };
  };
  ready: { input: null; output: { incarnation: string } };
  catalogue: { input: null; output: readonly CatalogueEntry[] };
  createProject: {
    input: { id: string; name: string };
    output: PublicAcceptance;
  };
  consume: { input: string; output: true };
  openProject: { input: string; output: ProjectHeader };
  leaveProject: { input: string; output: boolean };
  command: {
    input: { command: AuthoringCommand; revision: string };
    output: PublicAcceptance;
  };
  check: { input: null; output: PublicAcceptance };
}
export type HostOperation = keyof HostCalls;
export interface WorkbenchHost {
  call<K extends HostOperation>(
    operation: K,
    input: HostCalls[K]["input"],
  ): Promise<HostCalls[K]["output"]>;
  dispose(): void;
  fence(): void;
}
