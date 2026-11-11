import type { WorkbenchHost } from "./protocol";
/** Download initiation is observable; file custody is the user's separate
 * acknowledgement. Never infer a recoverable independent copy from a click. */
export async function downloadProjectBackup(
  host: WorkbenchHost,
  projectId: string,
  revision: string,
): Promise<string> {
  const result = await host.call("backup", { projectId, revision });
  const blob = new Blob([result.bytes], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  try {
    const link = document.createElement("a");
    link.href = url;
    link.download = `dtw-project-backup-${result.createdAt.replace(/[:.]/g, "-")}.json`;
    document.body.append(link);
    link.click();
    link.remove();
  } finally {
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  return result.revision;
}
