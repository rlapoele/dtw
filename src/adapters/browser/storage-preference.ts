export async function requestPersistentStorage(): Promise<string> {
  if (!navigator.storage?.persist)
    return "Persistent browser storage preference is unavailable. Keep independent backups.";
  try {
    const granted = await navigator.storage.persist();
    return granted
      ? "Persistent storage preference granted. Browser/user deletion can still remove projects; keep independent backups."
      : "Persistent storage preference was not granted. Applied retention continues; keep independent backups.";
  } catch {
    return "Persistent storage preference could not be checked. Applied retention is unchanged; keep independent backups.";
  }
}
