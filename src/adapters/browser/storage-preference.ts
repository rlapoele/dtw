export type StoragePersistenceResult = "protected" | "unprotected" | "unsupported" | "check-error" | "request-error";

type PersistenceAPI = Partial<Pick<StorageManager, "persisted" | "persist">>;

export async function checkPersistentStorage(): Promise<StoragePersistenceResult> {
  try {
    const storage: PersistenceAPI | undefined = typeof navigator === "undefined" ? undefined : navigator.storage;
    if (!storage?.persisted)
      return "unsupported";
    if (await storage.persisted() === true) return "protected";
    return storage.persist ? "unprotected" : "unsupported";
  } catch {
    return "check-error";
  }
}

export async function requestPersistentStorage(): Promise<StoragePersistenceResult> {
  try {
    const storage: PersistenceAPI | undefined = typeof navigator === "undefined" ? undefined : navigator.storage;
    if (!storage?.persist)
      return "unsupported";
    return await storage.persist() === true ? "protected" : "unprotected";
  } catch {
    return "request-error";
  }
}
