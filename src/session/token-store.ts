/**
 * Persistência segura do token de sessão (gate MOBILE_SECURITY).
 *
 * Regra: token SOMENTE em Expo SecureStore (keystore/keychain), NUNCA em
 * AsyncStorage, NUNCA logado. Este módulo é o único ponto que toca o token.
 */
import * as SecureStore from 'expo-secure-store';

const TOKEN_KEY = 'pm_session_token';

export async function getStoredToken(): Promise<string | null> {
  try {
    return await SecureStore.getItemAsync(TOKEN_KEY);
  } catch {
    // Falha de leitura do keystore: tratar como sem sessão (não vazar erro).
    return null;
  }
}

export async function setStoredToken(token: string): Promise<void> {
  await SecureStore.setItemAsync(TOKEN_KEY, token, {
    keychainAccessible: SecureStore.WHEN_UNLOCKED,
  });
}

export async function clearStoredToken(): Promise<void> {
  try {
    await SecureStore.deleteItemAsync(TOKEN_KEY);
  } catch {
    // Limpeza best-effort: nunca propagar erro de storage.
  }
}
