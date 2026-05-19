/**
 * Bootstrap de sessao: caminhos feliz / 401 / 403 / offline / sem token.
 */
import {
  suite,
  test,
  assert,
  assertEqual,
} from '../testing/harness';
import { bootstrapSession } from '../auth/session-state';
import type { ApiClient } from '../api/http-client';
import { ApiError } from '../api/errors';
import type { MeUser } from '../types/me';

function clientReturning(user: MeUser): ApiClient {
  return { get: async () => user } as unknown as ApiClient;
}
function clientThrowing(err: unknown): ApiClient {
  return {
    get: async () => {
      throw err;
    },
  } as unknown as ApiClient;
}

const VALID_USER: MeUser = {
  id: 'u1',
  roles: ['tutor', 'admin'],
  status: 'active',
};

suite('session-state.bootstrap', () => {
  test('no token -> unauthenticated(no-token)', async () => {
    const state = await bootstrapSession({
      client: clientReturning(VALID_USER),
      getStoredToken: () => null,
      clearSession: () => {
        throw new Error('must not clear when there was no token');
      },
    });
    assertEqual(state.status, 'unauthenticated', 'status');
    assert(
      state.status === 'unauthenticated' && state.reason === 'no-token',
      'reason no-token',
    );
  });

  test('valid token -> authenticated with user', async () => {
    const state = await bootstrapSession({
      client: clientReturning(VALID_USER),
      getStoredToken: () => 'tok',
      clearSession: () => undefined,
    });
    assert(
      state.status === 'authenticated' && state.user.id === 'u1',
      'authenticated user',
    );
  });

  test('401 clears session -> unauthenticated(token-cleared)', async () => {
    let cleared = false;
    const state = await bootstrapSession({
      client: clientThrowing(
        new ApiError({
          code: 'UNAUTHENTICATED',
          kind: 'http',
          httpStatus: 401,
          message: 'x',
        }),
      ),
      getStoredToken: () => 'expired',
      clearSession: () => {
        cleared = true;
      },
    });
    assert(cleared, 'clearSession was called on 401');
    assert(
      state.status === 'unauthenticated' &&
        state.reason === 'token-cleared',
      'token-cleared',
    );
  });

  test('403 -> blocked, session NOT cleared', async () => {
    const state = await bootstrapSession({
      client: clientThrowing(
        new ApiError({
          code: 'FORBIDDEN',
          kind: 'http',
          httpStatus: 403,
          message: 'x',
        }),
      ),
      getStoredToken: () => 'tok',
      clearSession: () => {
        throw new Error('403 must not clear the session');
      },
    });
    assertEqual(state.status, 'blocked', 'blocked');
  });

  test('network error -> error(offline), retryable', async () => {
    const state = await bootstrapSession({
      client: clientThrowing(
        new ApiError({
          code: 'NETWORK_OFFLINE',
          kind: 'network',
          message: 'x',
        }),
      ),
      getStoredToken: () => 'tok',
      clearSession: () => undefined,
    });
    assert(
      state.status === 'error' && state.kind === 'offline',
      'offline error',
    );
  });

  test('clearSession failure does not crash bootstrap', async () => {
    const state = await bootstrapSession({
      client: clientThrowing(
        new ApiError({
          code: 'UNAUTHENTICATED',
          kind: 'http',
          httpStatus: 401,
          message: 'x',
        }),
      ),
      getStoredToken: () => 'tok',
      clearSession: () => {
        throw new Error('storage exploded');
      },
    });
    assertEqual(state.status, 'unauthenticated', 'still unauthenticated');
  });
});
