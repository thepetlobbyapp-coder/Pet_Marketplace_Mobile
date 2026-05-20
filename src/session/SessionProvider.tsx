/**
 * SessionProvider: liga a camada base (bootstrapSession + /me) ao app.
 *
 * - Token vem/sai do SecureStore (token-store).
 * - 401 → limpa sessão; 403 → blocked; offline/timeout → retry.
 * - Nunca expõe token nem dado sensível pelo contexto.
 */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { createApiClient } from '../api/http-client';
import { getApiBaseUrl } from '../config/env';
import {
  bootstrapSession,
  type SessionState,
} from '../auth/session-state';
import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from './token-store';

interface SessionContextValue {
  state: SessionState;
  /** Re-tenta o bootstrap (uso em estado de erro/offline). */
  retry: () => void;
  /** Persiste um token e re-bootstrapa (login real entra aqui no futuro). */
  signInWithToken: (token: string) => Promise<void>;
  /** Limpa a sessão local e volta para não autenticado. */
  signOut: () => Promise<void>;
}

const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<SessionState>({ status: 'idle' });
  const runningRef = useRef(false);

  const runBootstrap = useCallback(async () => {
    if (runningRef.current) {
      return;
    }
    runningRef.current = true;
    setState({ status: 'bootstrapping' });
    try {
      const client = createApiClient({
        baseUrl: getApiBaseUrl(),
        getToken: getStoredToken,
      });
      const next = await bootstrapSession({
        client,
        getStoredToken,
        clearSession: clearStoredToken,
      });
      setState(next);
    } catch {
      // getApiBaseUrl pode lançar (HTTPS obrigatório em produção).
      setState({ status: 'error', kind: 'unknown' });
    } finally {
      runningRef.current = false;
    }
  }, []);

  useEffect(() => {
    void runBootstrap();
  }, [runBootstrap]);

  const retry = useCallback(() => {
    void runBootstrap();
  }, [runBootstrap]);

  const signInWithToken = useCallback(
    async (token: string) => {
      await setStoredToken(token);
      await runBootstrap();
    },
    [runBootstrap],
  );

  const signOut = useCallback(async () => {
    await clearStoredToken();
    setState({ status: 'unauthenticated', reason: 'token-cleared' });
  }, []);

  return (
    <SessionContext.Provider
      value={{ state, retry, signInWithToken, signOut }}
    >
      {children}
    </SessionContext.Provider>
  );
}

export function useSession(): SessionContextValue {
  const ctx = useContext(SessionContext);
  if (!ctx) {
    throw new Error('useSession must be used within <SessionProvider>.');
  }
  return ctx;
}
