/**
 * token-store: persistência só via SecureStore; leitura tolerante a falha.
 */
let mockMem: Record<string, string> = {};
let mockFailRead = false;

jest.mock('expo-secure-store', () => ({
  WHEN_UNLOCKED: 'whenUnlocked',
  getItemAsync: jest.fn(async (k: string) => {
    if (mockFailRead) throw new Error('keystore locked');
    return k in mockMem ? mockMem[k] : null;
  }),
  setItemAsync: jest.fn(async (k: string, v: string) => {
    mockMem[k] = v;
  }),
  deleteItemAsync: jest.fn(async (k: string) => {
    delete mockMem[k];
  }),
}));

import {
  clearStoredToken,
  getStoredToken,
  setStoredToken,
} from '../session/token-store';

beforeEach(() => {
  mockMem = {};
  mockFailRead = false;
});

test('set → get → clear roundtrip', async () => {
  expect(await getStoredToken()).toBeNull();
  await setStoredToken('abc.def');
  expect(await getStoredToken()).toBe('abc.def');
  await clearStoredToken();
  expect(await getStoredToken()).toBeNull();
});

test('read failure is swallowed as no session', async () => {
  mockFailRead = true;
  expect(await getStoredToken()).toBeNull();
});

test('clear failure does not throw', async () => {
  const secure = require('expo-secure-store');
  secure.deleteItemAsync.mockRejectedValueOnce(new Error('boom'));
  await expect(clearStoredToken()).resolves.toBeUndefined();
});
