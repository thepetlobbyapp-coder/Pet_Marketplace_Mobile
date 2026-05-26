import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { t } from '../i18n';
import { getSupabaseClient } from './supabaseClient';

interface AuthResult {
  message?: string;
  ok: boolean;
  // Lets screens know when the Supabase project requires email confirmation
  // before sign-in (sign-up succeeded, session = null).
  requiresEmailConfirmation?: boolean;
}

interface AuthContextValue {
  accessToken: string | null;
  isAuthConfigured: boolean;
  isInitialising: boolean;
  session: Session | null;
  signIn: (email: string, password: string) => Promise<AuthResult>;
  signUp: (email: string, password: string) => Promise<AuthResult>;
  resetPassword: (email: string) => Promise<AuthResult>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const supabase = getSupabaseClient();
  const [isInitialising, setIsInitialising] = useState(Boolean(supabase));
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    if (!supabase) {
      return undefined;
    }

    let isMounted = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (isMounted) {
          setSession(data.session);
        }
      })
      .catch(() => {
        if (isMounted) {
          setSession(null);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsInitialising(false);
        }
      });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, nextSession) => {
        setSession(nextSession);
      },
    );

    return () => {
      isMounted = false;
      listener.subscription.unsubscribe();
    };
  }, [supabase]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) {
        return { ok: false, message: t('auth.config.body') };
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          ok: false,
          message: error.message || t('auth.login.genericError'),
        };
      }

      return { ok: true };
    },
    [supabase],
  );

  const signUp = useCallback(
    async (email: string, password: string): Promise<AuthResult> => {
      if (!supabase) {
        return { ok: false, message: t('auth.config.body') };
      }

      const { data, error } = await supabase.auth.signUp({ email, password });

      if (error) {
        // Keep sign-up errors generic so provider details are not exposed.
        return {
          ok: false,
          message: t('auth.signUp.genericError'),
        };
      }

      // When Supabase requires email confirmation, session = null.
      return {
        ok: true,
        requiresEmailConfirmation: data.session === null,
      };
    },
    [supabase],
  );

  const resetPassword = useCallback(
    async (email: string): Promise<AuthResult> => {
      if (!supabase) {
        return { ok: false, message: t('auth.config.body') };
      }

      // Anti email enumeration: ignore provider-specific errors and let the
      // screen show the same confirmation copy.
      await supabase.auth.resetPasswordForEmail(email);
      return { ok: true };
    },
    [supabase],
  );

  const signOut = useCallback(async () => {
    await supabase?.auth.signOut();
    setSession(null);
  }, [supabase]);

  const value = useMemo<AuthContextValue>(
    () => ({
      accessToken: session?.access_token ?? null,
      isAuthConfigured: Boolean(supabase),
      isInitialising,
      session,
      signIn,
      signUp,
      resetPassword,
      signOut,
    }),
    [
      isInitialising,
      session,
      signIn,
      signUp,
      resetPassword,
      signOut,
      supabase,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const value = useContext(AuthContext);
  if (!value) {
    throw new Error('useAuth must be used inside AuthProvider.');
  }
  return value;
}
