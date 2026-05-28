import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createAdminApiClient } from "../api/adminApiClient";
import { createAdminResourceClient } from "../admin/adminResourceClient";
import type { AdminResourceClient } from "../admin/adminResourceClient";
import { bootstrapAdminSession, type AdminAuthState } from "./adminSession";
import { createCookieAdminSessionStore } from "./cookieSessionStore";
import { readAdminServerEnv } from "../lib/serverEnv";

/**
 * Helpers usados pelos Server Components / route handlers.
 * Toda chamada ao backend acontece server-to-server com URL absoluta —
 * CORS cross-origin não se aplica.
 */

async function readSession(): Promise<{
  readonly authState: AdminAuthState;
  readonly resourceClient: AdminResourceClient;
}> {
  const env = readAdminServerEnv();
  const cookieJar = await cookies();
  const sessionStore = createCookieAdminSessionStore(cookieJar, env.cookieName);
  const apiClient = createAdminApiClient({
    baseUrl: `${env.adminApiBaseUrl}/api/v1`,
    getAccessToken: () => sessionStore.getAccessToken(),
  });
  const resourceClient = createAdminResourceClient({
    baseUrl: `${env.adminApiBaseUrl}/api/v1`,
    getAccessToken: () => sessionStore.getAccessToken(),
  });

  const authState = await bootstrapAdminSession({ apiClient, sessionStore });

  return { authState, resourceClient };
}

/**
 * Garante que o usuário atual é admin autenticado. Caso contrário,
 * redireciona para `/login` (qualquer outro estado é tratado como sessão
 * inválida nesta fatia). NUNCA retorna `null` — `redirect()` joga.
 */
export async function requireAdmin(): Promise<{
  readonly state: Extract<AdminAuthState, { status: "authenticated" }>;
  readonly resourceClient: AdminResourceClient;
}> {
  const { authState, resourceClient } = await readSession();
  if (authState.status !== "authenticated") {
    redirect("/login");
  }
  return { resourceClient, state: authState };
}

/**
 * Lê a sessão sem forçar redirect. Usado pela tela raiz (`/`) para escolher
 * destino. Nunca lança.
 */
export async function readAdminSession(): Promise<AdminAuthState> {
  const { authState } = await readSession();
  return authState;
}
