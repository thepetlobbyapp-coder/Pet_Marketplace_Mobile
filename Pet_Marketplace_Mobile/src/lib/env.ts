import { z } from 'zod';

const envSchema = z.object({
  apiBaseUrl: z.string().url().default('http://localhost:3000'),
  supabaseUrl: z.string().url().optional(),
  supabaseAnonKey: z.string().min(1).optional(),
});

const parsedEnv = envSchema.parse({
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || undefined,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || undefined,
});

export const env = {
  apiBaseUrl: trimTrailingSlash(parsedEnv.apiBaseUrl),
  supabaseUrl: parsedEnv.supabaseUrl,
  supabaseAnonKey: parsedEnv.supabaseAnonKey,
  isSupabaseConfigured: Boolean(
    parsedEnv.supabaseUrl && parsedEnv.supabaseAnonKey,
  ),
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}
