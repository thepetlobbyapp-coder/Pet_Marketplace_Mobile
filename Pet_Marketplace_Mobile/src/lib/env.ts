import { z } from "zod";

const envSchema = z.object({
  apiBaseUrl: z.string().url(),
  enableDemoFixtures: z.enum(["true", "false"]).default("false"),
  supabaseUrl: z.string().url().optional(),
  supabaseAnonKey: z.string().min(1).optional(),
});

const parsedEnv = envSchema.parse({
  apiBaseUrl:
    process.env.EXPO_PUBLIC_API_BASE_URL ||
    (isDevelopmentRuntime() ? "http://localhost:3000" : undefined),
  enableDemoFixtures: process.env.EXPO_PUBLIC_ENABLE_DEMO_FIXTURES || "false",
  supabaseUrl: process.env.EXPO_PUBLIC_SUPABASE_URL || undefined,
  supabaseAnonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || undefined,
});

export const env = {
  apiBaseUrl: trimTrailingSlash(parsedEnv.apiBaseUrl),
  isDemoFixturesEnabled:
    parsedEnv.enableDemoFixtures === "true" && !isProductionRuntime(),
  supabaseUrl: parsedEnv.supabaseUrl,
  supabaseAnonKey: parsedEnv.supabaseAnonKey,
  isSupabaseConfigured: Boolean(
    parsedEnv.supabaseUrl && parsedEnv.supabaseAnonKey,
  ),
};

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, "");
}

function isDevelopmentRuntime(): boolean {
  if (typeof __DEV__ !== "undefined") {
    return __DEV__;
  }

  return process.env.NODE_ENV === "development";
}

function isProductionRuntime(): boolean {
  return !isDevelopmentRuntime();
}
