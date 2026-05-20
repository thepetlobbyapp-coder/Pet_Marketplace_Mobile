/**
 * Guard de navegação: rota inicial e acesso protegido por sessão.
 */
import {
  homeRouteForSession,
  canAccessProtected,
} from '../session/routing';
import type { SessionState } from '../auth/session-state';

const authed: SessionState = {
  status: 'authenticated',
  user: { id: 'u1', roles: ['tutor'], status: 'active' },
};

test('authenticated → /profile and protected access allowed', () => {
  expect(homeRouteForSession(authed)).toBe('/profile');
  expect(canAccessProtected(authed)).toBe(true);
});

test('non-authenticated states → /sign-in, protected blocked', () => {
  const states: SessionState[] = [
    { status: 'idle' },
    { status: 'bootstrapping' },
    { status: 'unauthenticated', reason: 'no-token' },
    { status: 'unauthenticated', reason: 'token-cleared' },
    { status: 'blocked' },
    { status: 'error', kind: 'offline' },
  ];
  for (const s of states) {
    expect(homeRouteForSession(s)).toBe('/sign-in');
    expect(canAccessProtected(s)).toBe(false);
  }
});
