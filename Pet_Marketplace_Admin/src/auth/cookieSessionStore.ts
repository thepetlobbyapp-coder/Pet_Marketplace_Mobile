import type { AdminSessionStore } from "./sessionStore";

/**
 * Session store server-side. Lê o token a partir do conjunto de cookies do
 * Server Component / route handler atual (Next 15 `cookies()` é assíncrono).
 *
 * Setar/limpar token NÃO é responsabilidade deste store — isso fica nos
 * route handlers `/api/auth/login` e `/api/auth/logout`, que recebem o
 * `Response` e podem chamar `cookies().set(...)` com segurança.
 */
export interface CookieAccessor {
  readonly get: (name: string) => { readonly value: string } | undefined;
}

export function createCookieAdminSessionStore(
  cookieAccessor: CookieAccessor,
  cookieName: string,
): AdminSessionStore {
  return {
    clear: () => undefined,
    getAccessToken: () => cookieAccessor.get(cookieName)?.value ?? null,
  };
}
