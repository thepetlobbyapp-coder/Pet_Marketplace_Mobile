/**
 * Maquina de estados do bootstrap de sessao do Mobile.
 *
 * Cobre os estados obrigatorios (SPEC_MOBILE secao 8):
 * loading, autenticado, nao autenticado, token expirado/401,
 * conta bloqueada/deletada (403), backend offline (retry).
 *
 * Sem React aqui de proposito: e logica pura, testavel sem Expo.
 * O Bloco 3 envolve isto num Context/Zustand + SecureStore.
 */
import type { MeUser } from '../types/me';
import { ApiError } from '../api/errors';
import { fetchMe } from '../api/me';
import type { ApiClient } from '../api/http-client';

export type SessionState =
  /** Antes de qualquer tentativa (splash). */
  | { status: 'idle' }
  /** Restaurando token + chamando /me. */
  | { status: 'bootstrapping' }
  /** Sessao valida. */
  | { status: 'authenticated'; user: MeUser }
  /** Sem sessao (sem token, ou token limpo apos 401). */
  | { status: 'unauthenticated'; reason: 'no-token' | 'token-cleared' }
  /** Conta nao pode acessar (403). Sem detalhe sensivel. */
  | { status: 'blocked' }
  /** Falha recuperavel: oferecer retry, manter token. */
  | { status: 'error'; kind: 'offline' | 'timeout' | 'unknown' };

export interface SessionBootstrapDeps {
  client: ApiClient;
  /** Le o token persistido (SecureStore no Bloco 3). */
  getStoredToken: () => Promise<string | null> | string | null;
  /** Limpa a sessao local de forma segura (chamado em 401). */
  clearSession: () => Promise<void> | void;
}

/**
 * Executa o bootstrap e retorna o estado resultante.
 * Nao lanca: toda falha vira um SessionState explicito.
 */
export async function bootstrapSession(
  deps: SessionBootstrapDeps,
): Promise<SessionState> {
  const token = await deps.getStoredToken();
  if (!token) {
    return { status: 'unauthenticated', reason: 'no-token' };
  }

  try {
    const user = await fetchMe(deps.client);
    return { status: 'authenticated', user };
  } catch (err) {
    return mapBootstrapError(err, deps);
  }
}

async function mapBootstrapError(
  err: unknown,
  deps: SessionBootstrapDeps,
): Promise<SessionState> {
  if (err instanceof ApiError) {
    if (err.isUnauthenticated) {
      // Token invalido/expirado: limpa sessao local antes de seguir.
      await safeClear(deps.clearSession);
      return { status: 'unauthenticated', reason: 'token-cleared' };
    }
    if (err.isForbidden) {
      // Conta bloqueada/deletada ou sem permissao: bloqueia, sem detalhe.
      return { status: 'blocked' };
    }
    if (err.kind === 'network') {
      return { status: 'error', kind: 'offline' };
    }
    if (err.kind === 'timeout') {
      return { status: 'error', kind: 'timeout' };
    }
  }
  return { status: 'error', kind: 'unknown' };
}

async function safeClear(
  clearSession: SessionBootstrapDeps['clearSession'],
): Promise<void> {
  try {
    await clearSession();
  } catch {
    // Limpeza best-effort: nunca propagar erro de storage no bootstrap.
  }
}

/** True quando o usuario tem sessao valida. */
export function isAuthenticated(
  state: SessionState,
): state is { status: 'authenticated'; user: MeUser } {
  return state.status === 'authenticated';
}

/** True quando vale a pena oferecer "Tentar novamente". */
export function isRetryable(state: SessionState): boolean {
  return state.status === 'error';
}
