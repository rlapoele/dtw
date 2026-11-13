import { useRef, useState } from 'react';
import type { ChangeEvent } from 'react';
import type { ProjectHeader, RestorePreview, WorkbenchHost } from '@presentation/host/protocol';
import { downloadProjectBackup, readBackupFile } from '@presentation/host/backup-file';
/** Selection/staging/download coordination, separate from restore authority. */
export function useWorkbenchBackup(host: WorkbenchHost, header: ProjectHeader, setBusy: (busy:boolean) => void, setError: (message:string) => void, setNotice: (message:string) => void) {
  const selectedBackupFile = useRef<File | undefined>(undefined);
  const [restorePreview, setRestorePreview] = useState<RestorePreview>();
  const restoreInput = useRef<HTMLInputElement>(null);
  async function restage() {
    if (!selectedBackupFile.current) throw Error('Select the original backup file again.');
    return host.call('stageBackup', { bytes: await readBackupFile(selectedBackupFile.current) });
  }
  async function onBackupFile(event: ChangeEvent<HTMLInputElement>) {
    const input = event.target, file = input.files?.[0];
    if (!file) return;
    selectedBackupFile.current = file;
    setBusy(true); setError('');
    try { setRestorePreview(await restage()); }
    catch (error) { setError(error instanceof Error ? error.message : 'Backup preview unavailable. Applied data and drafts are unchanged.'); }
    finally { setBusy(false); input.value = ''; }
  }
  async function onDownload() {
    setBusy(true); setError('');
    try {
      await downloadProjectBackup(host, header.project.id, header.revision);
      setNotice('Backup download requested. Keep the independent file; download initiation does not confirm it was saved. Unapplied drafts are excluded and unchanged.');
    } catch (error) { setError(error instanceof Error ? error.message : 'Backup generation failed. Applied data and drafts are unchanged.'); }
    finally { setBusy(false); }
  }
  return { restorePreview, setRestorePreview, restoreInput, restage, onBackupFile, onDownload };
}
