import { AuthClient } from "@supabase/auth-js";
import { env } from "../lib/env";
import { secureSessionStorage } from "./secureSessionStorage";

type SupabaseAuthClient = InstanceType<typeof AuthClient>;

let client: SupabaseAuthClient | null = null;

export function getSupabaseClient(): SupabaseAuthClient | null {
  if (!env.isSupabaseConfigured || !env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  client ??= new AuthClient({
    autoRefreshToken: true,
    detectSessionInUrl: false,
    headers: {
      apikey: env.supabaseAnonKey,
      Authorization: `Bearer ${env.supabaseAnonKey}`,
    },
    persistSession: true,
    storage: secureSessionStorage,
    storageKey: getAuthStorageKey(env.supabaseUrl),
    url: getAuthUrl(env.supabaseUrl),
  });

  return client;
}

function getAuthUrl(supabaseUrl: string): string {
  return new URL(
    "auth/v1",
    supabaseUrl.endsWith("/") ? supabaseUrl : `${supabaseUrl}/`,
  ).toString();
}

function getAuthStorageKey(supabaseUrl: string): string {
  return `sb-${new URL(supabaseUrl).hostname.split(".")[0]}-auth-token`;
}
