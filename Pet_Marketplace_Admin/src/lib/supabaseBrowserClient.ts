"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente Supabase browser-only, usado pelo formulário de login para
 * `signInWithPassword`. Token resultante NÃO é persistido aqui — vai por
 * POST /api/auth/login e o Next emite cookie HttpOnly.
 *
 * `persistSession: false` é proposital: a fonte da verdade da sessão admin
 * é o cookie HttpOnly, não o localStorage do Supabase SDK.
 */
let cachedClient: SupabaseClient | null = null;

export function getSupabaseBrowserClient(): SupabaseClient | null {
  if (typeof window === "undefined") return null;
  if (cachedClient) return cachedClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anonKey) return null;

  cachedClient = createClient(url, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
  return cachedClient;
}
