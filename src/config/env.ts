/**
 * Acesso seguro a variaveis publicas do app.
 *
 * Regra: apenas variaveis EXPO_PUBLIC_* sao expostas ao bundle mobile.
 * Nenhum secret/token entra aqui. Sem @types/node no projeto, declaramos
 * um ambient minimo para `process.env` (Expo substitui em build time).
 */

declare const process: { env: Record<string, string | undefined> } | undefined;
/** RN/Expo expõem `__DEV__` global; false em build de produção. */
declare const __DEV__: boolean | undefined;

const DEFAULT_API_BASE_URL = 'http://localhost:3000';

function isProduction(): boolean {
  return typeof __DEV__ === 'boolean' ? !__DEV__ : false;
}

function readEnv(key: string): string | undefined {
  // Em Expo/RN `process.env.EXPO_PUBLIC_*` e inlinado no build.
  // Em ambientes sem `process`, retorna undefined sem quebrar.
  if (typeof process === 'undefined' || !process?.env) {
    return undefined;
  }
  return process.env[key];
}

/**
 * Base URL da API (sem barra final). Fallback = .env.example.
 * GATE MOBILE_SECURITY: em produção, HTTPS é obrigatório — URL não-HTTPS
 * em produção lança erro (fail-fast) em vez de trafegar token em claro.
 */
export function getApiBaseUrl(): string {
  const raw = readEnv('EXPO_PUBLIC_API_BASE_URL')?.trim();
  const value = raw && raw.length > 0 ? raw : DEFAULT_API_BASE_URL;
  const url = value.replace(/\/+$/, '');
  if (isProduction() && !url.startsWith('https://')) {
    throw new Error(
      'EXPO_PUBLIC_API_BASE_URL must use HTTPS in production builds.',
    );
  }
  return url;
}

/** Locale padrao do app. */
export function getDefaultLocale(): string {
  const raw = readEnv('APP_DEFAULT_LOCALE')?.trim();
  return raw && raw.length > 0 ? raw : 'en-GB';
}
