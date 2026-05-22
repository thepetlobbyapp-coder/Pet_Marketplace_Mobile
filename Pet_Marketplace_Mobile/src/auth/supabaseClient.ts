import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { env } from '../lib/env';
import { secureSessionStorage } from './secureSessionStorage';

let client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!env.isSupabaseConfigured || !env.supabaseUrl || !env.supabaseAnonKey) {
    return null;
  }

  client ??= createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      detectSessionInUrl: false,
      persistSession: true,
      storage: secureSessionStorage,
    },
  });

  return client;
}
