import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export const secureSessionStorage = {
  getItem: (key: string) => {
    if (Platform.OS === "web") {
      return Promise.resolve(getWebStorage()?.getItem(key) ?? null);
    }

    return SecureStore.getItemAsync(key);
  },
  setItem: (key: string, value: string) => {
    if (Platform.OS === "web") {
      getWebStorage()?.setItem(key, value);
      return Promise.resolve();
    }

    return SecureStore.setItemAsync(key, value, {
      keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
    });
  },
  removeItem: (key: string) => {
    if (Platform.OS === "web") {
      getWebStorage()?.removeItem(key);
      return Promise.resolve();
    }

    return SecureStore.deleteItemAsync(key);
  },
};

function getWebStorage(): Storage | null {
  return typeof globalThis.localStorage === "undefined"
    ? null
    : globalThis.localStorage;
}
