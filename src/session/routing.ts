/**
 * Decisão de rota pura (testável sem router). Mantém os guards das telas
 * triviais e consistentes.
 */
import type { SessionState } from '../auth/session-state';

export type AppRoute = '/profile' | '/sign-in';

/** Rota inicial conforme a sessão (estados não-nav tratados no _layout). */
export function homeRouteForSession(state: SessionState): AppRoute {
  return state.status === 'authenticated' ? '/profile' : '/sign-in';
}

/** True se a sessão pode acessar uma rota protegida. */
export function canAccessProtected(state: SessionState): boolean {
  return state.status === 'authenticated';
}
