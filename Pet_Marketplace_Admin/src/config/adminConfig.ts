import { DEFAULT_ADMIN_API_BASE_URL } from "../api/adminApiClient";

export interface AdminConfig {
  readonly adminHomePath: string;
  readonly apiBaseUrl: string;
  readonly loginPath: string;
}

export type AdminConfigOverrides = Partial<AdminConfig>;

export const DEFAULT_ADMIN_CONFIG: AdminConfig = {
  adminHomePath: "/admin",
  apiBaseUrl: DEFAULT_ADMIN_API_BASE_URL,
  loginPath: "/login",
};

export function createAdminConfig(
  overrides: AdminConfigOverrides = {},
): AdminConfig {
  return {
    adminHomePath: readPathOverride(
      overrides.adminHomePath,
      DEFAULT_ADMIN_CONFIG.adminHomePath,
    ),
    apiBaseUrl: readPathOverride(
      overrides.apiBaseUrl,
      DEFAULT_ADMIN_CONFIG.apiBaseUrl,
    ),
    loginPath: readPathOverride(
      overrides.loginPath,
      DEFAULT_ADMIN_CONFIG.loginPath,
    ),
  };
}

function readPathOverride(value: string | undefined, fallback: string): string {
  if (value === undefined) {
    return fallback;
  }

  const trimmed = value.trim();

  return trimmed.length > 0 ? trimmed : fallback;
}
