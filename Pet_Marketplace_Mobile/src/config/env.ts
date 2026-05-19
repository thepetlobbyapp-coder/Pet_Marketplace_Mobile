/**
 * Acesso seguro a variaveis publicas do app.
 *
 * Regra: apenas variaveis EXPO_PUBLIC_* sao expostas ao bundle mobile.
 * Nenhum secret/token entra aqui. Sem @types/node no projeto, declaramos
 * um ambient minimo para `process.env` (Expo substitui em build time).
 */

declare const process: { env: Record<string, string | undefined> } | undefined;

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function readEnv(key: string): string | undefined {
  // Em Expo/RN `process.env.EXPO_PUBLIC_*` e inlinado no build.
  // Em ambientes sem `process`, retorna undefined sem quebrar.
  if (typeof process === 'undefined' || !process?.env) {
    return undefined;
  }
  return process.env[key];
}

/** Base URL da API (sem barra final). Fallback = .env.example. */
export function getApiBaseUrl(): string {
  const raw = readEnv('EXPO_PUBLIC_API_BASE_URL')?.trim();
  const value = raw && raw.length > 0 ? raw : DEFAULT_API_BASE_URL;
  return value.replace(/\/+$/, '');
}

/** Locale padrao do app. */
export function getDefaultLocale(): string {
  const raw = readEnv('APP_DEFAULT_LOCALE')?.trim();
  return raw && raw.length > 0 ? raw : 'en-GB';
}
