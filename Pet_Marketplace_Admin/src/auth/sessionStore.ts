export const ADMIN_ACCESS_TOKEN_STORAGE_KEY =
  "pet-marketplace-admin.access-token";

export interface AdminSessionStore {
  readonly getAccessToken: () => Promise<string | null> | string | null;
  readonly setAccessToken?: (accessToken: string) => Promise<void> | void;
  readonly clear: () => Promise<void> | void;
}

export interface BrowserStorageLike {
  readonly getItem: (key: string) => string | null;
  readonly removeItem: (key: string) => void;
  readonly setItem: (key: string, value: string) => void;
}

export function createBrowserAdminSessionStore(
  storage: BrowserStorageLike | undefined = globalThis.localStorage,
): AdminSessionStore {
  if (!storage) {
    return {
      clear: () => undefined,
      getAccessToken: () => null,
    };
  }

  return {
    clear: () => storage.removeItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY),
    getAccessToken: () => storage.getItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY),
    setAccessToken: (accessToken: string) =>
      storage.setItem(ADMIN_ACCESS_TOKEN_STORAGE_KEY, accessToken),
  };
}
