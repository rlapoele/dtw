import type { ProjectSnapshot } from "@application/project-storage";
import type {
  CreateColorTokenInput,
  ReviseColorTokenInput,
} from "@application/authoring";
import type { TokenGroupInput } from "@domain/token-group";
export type AuthoringCommand =
  | { operation: "createGroup"; input: TokenGroupInput }
  | {
      operation: "renameGroup";
      projectId: string;
      groupId: string;
      localName: string;
    }
  | { operation: "createColorToken"; input: CreateColorTokenInput }
  | { operation: "reviseColorToken"; input: ReviseColorTokenInput };
export type Operation =
  | AuthoringCommand["operation"]
  | "createProject"
  | "restoreProject";
export type CommandReceipt = {
  readonly commandId: string;
  readonly operation: Operation;
  readonly result: {
    readonly entityKind: "project" | "group" | "token";
    readonly id: string;
  };
};
export type WriteIdentity = {
  readonly commandId: string;
  readonly revision: string;
  readonly projectId: string;
  readonly expectedRevision: string | null;
  readonly incarnation: string;
  readonly operation: Operation;
  readonly result: CommandReceipt["result"];
};
export type RetainedRecord = {
  readonly recordVersion: 1;
  readonly authoredVersion: 1;
  readonly revision: string;
  readonly lastAcceptedCommand: CommandReceipt;
  readonly snapshot: ProjectSnapshot;
};
export type CatalogueEntry =
  | {
      readonly rowKey: string;
      readonly id: string;
      readonly status: "supported";
      readonly name: string;
      readonly revision: string;
      readonly tokens: number;
      readonly groups: number;
    }
  | {
      readonly rowKey: string;
      readonly id: string;
      readonly status: "unavailable";
      readonly reason: string;
    };
export type RetainedRead = {
  readonly record: RetainedRecord | undefined;
  readonly incarnation: string;
};
export type WriteAttempt = {
  readonly projectId: string;
  readonly incarnation: string;
  readonly expectedRevision: string | null;
  readonly record: RetainedRecord;
};
export type CommitOutcome =
  | { readonly status: "retained" }
  | { readonly status: "rejected"; readonly reason: string }
  | { readonly status: "unknown"; readonly reason: string };
/** Adapter commits compare incarnation/revision, capacity and write one complete
 * record in the same transaction; retained means strict transaction complete. */
export interface RetentionPort {
  catalogue(): Promise<readonly CatalogueEntry[]>;
  read(projectId: string): Promise<RetainedRead>;
  acquire(projectId: string): Promise<boolean>;
  owns(projectId: string): boolean;
  release(projectId: string): Promise<void>;
  commit(attempt: WriteAttempt): Promise<CommitOutcome>;
}
export type Acceptance =
  | {
      readonly status: "retained";
      readonly revision: string;
      readonly receipt: CommandReceipt;
      readonly before: ProjectSnapshot | undefined;
      readonly after: ProjectSnapshot;
      readonly readback: "available" | "unavailable";
      readonly readError?: string;
    }
  | { readonly status: "rejected"; readonly reason: string }
  | {
      readonly status: "unknown";
      readonly reason: string;
      readonly commandId: string;
    };
