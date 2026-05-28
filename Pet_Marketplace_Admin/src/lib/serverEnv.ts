/**
 * Leitura controlada de variáveis de ambiente do server.
 * Falha cedo e com mensagem clara quando algo essencial está ausente,
 * em vez de "Cannot read undefined" no meio do request.
 *
 * Nenhuma leitura aqui pode aparecer em bundle client — todos os callers
 * deste módulo são Server Components, route handlers ou middleware.
 */

const DEFAULT_BACKEND_BASE_URL = "http://localhost:3000";
const DEFAULT_COOKIE_NAME = "pet-admin-session";
const DEFAULT_COOKIE_MAX_AGE_SECONDS = 3600;

export interface AdminServerEnv {
  readonly adminApiBaseUrl: string;
  readonly cookieName: string;
  readonly cookieMaxAgeSeconds: number;
  readonly isProduction: boolean;
}

export function readAdminServerEnv(): AdminServerEnv {
  const adminApiBaseUrl = (
    process.env.ADMIN_API_BASE_URL ?? DEFAULT_BACKEND_BASE_URL
  ).replace(/\/+$/, "");
  const cookieName =
    process.env.ADMIN_SESSION_COOKIE_NAME?.trim() || DEFAULT_COOKIE_NAME;
  const cookieMaxAgeSeconds = parsePositiveInt(
    process.env.ADMIN_SESSION_COOKIE_MAX_AGE,
    DEFAULT_COOKIE_MAX_AGE_SECONDS,
  );

  return {
    adminApiBaseUrl,
    cookieMaxAgeSeconds,
    cookieName,
    isProduction: process.env.NODE_ENV === "production",
  };
}

function parsePositiveInt(value: string | undefined, fallback: number): number {
  if (value === undefined) return fallback;
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}
