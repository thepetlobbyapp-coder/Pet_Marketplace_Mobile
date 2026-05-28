declare const process: {
  env: {
    EXPO_PUBLIC_ENABLE_DEMO_FIXTURES?: "true" | "false";
    EXPO_PUBLIC_API_BASE_URL?: string;
    EXPO_PUBLIC_SUPABASE_ANON_KEY?: string;
    EXPO_PUBLIC_SUPABASE_URL?: string;
    NODE_ENV?: "development" | "production" | "test";
  };
};
