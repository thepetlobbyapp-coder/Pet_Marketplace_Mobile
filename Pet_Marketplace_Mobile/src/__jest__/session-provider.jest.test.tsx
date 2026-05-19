/**
 * Wiring de sessão: SecureStore + /me + SessionProvider.
 * Caminhos: token válido → authenticated; 401 → limpa token e
 * unauthenticated; sem token → unauthenticated(no-token).
 */
import { Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';

let mockMem: Record<string, string> = {};
const mockDeleteSpy = jest.fn(async (k: string) => {
  delete mockMem[k];
});

jest.mock('expo-secure-store', () => ({
  WHEN_UNLOCKED: 'whenUnlocked',
  getItemAsync: jest.fn(async (k: string) =>
    k in mockMem ? mockMem[k] : null,
  ),
  setItemAsync: jest.fn(async (k: string, v: string) => {
    mockMem[k] = v;
  }),
  deleteItemAsync: (k: string) => mockDeleteSpy(k),
}));

import { SessionProvider, useSession } from '../session/SessionProvider';

function Probe() {
  const { state } = useSession();
  const detail =
    state.status === 'authenticated'
      ? `:${state.user.id}`
      : state.status === 'unauthenticated'
        ? `:${state.reason}`
        : '';
  return <Text>{`${state.status}${detail}`}</Text>;
}

function mockFetchOnce(status: number, body: unknown) {
  (globalThis as { fetch: unknown }).fetch = jest.fn(async () => ({
    ok: status >= 200 && status < 300,
    status,
    text: async () => JSON.stringify(body),
  }));
}

beforeEach(() => {
  mockMem = {};
  mockDeleteSpy.mockClear();
});

test('valid token → authenticated with safe user', async () => {
  mockMem.pm_session_token = 'good-token';
  mockFetchOnce(200, {
    id: 'user-123',
    email: 'a@b.com',
    roles: ['tutor', 'admin'],
    status: 'active',
  });

  render(
    <SessionProvider>
      <Probe />
    </SessionProvider>,
  );

  await waitFor(() =>
    expect(screen.getByText('authenticated:user-123')).toBeTruthy(),
  );
});

test('401 clears token and ends unauthenticated', async () => {
  mockMem.pm_session_token = 'expired';
  mockFetchOnce(401, { error: { code: 'UNAUTHENTICATED', message: 'x' } });

  render(
    <SessionProvider>
      <Probe />
    </SessionProvider>,
  );

  await waitFor(() =>
    expect(
      screen.getByText('unauthenticated:token-cleared'),
    ).toBeTruthy(),
  );
  expect(mockDeleteSpy).toHaveBeenCalledWith('pm_session_token');
});

test('no token → unauthenticated(no-token), no /me call', async () => {
  const fetchMock = jest.fn();
  (globalThis as { fetch: unknown }).fetch = fetchMock;

  render(
    <SessionProvider>
      <Probe />
    </SessionProvider>,
  );

  await waitFor(() =>
    expect(screen.getByText('unauthenticated:no-token')).toBeTruthy(),
  );
  expect(fetchMock).not.toHaveBeenCalled();
});
