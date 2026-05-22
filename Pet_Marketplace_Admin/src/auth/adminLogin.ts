import type { AdminAuthViewModel } from "./adminAuthViewModel";
import type { AdminConfig, AdminConfigOverrides } from "../config/adminConfig";
import { createAdminConfig } from "../config/adminConfig";
import type { AdminSessionStore } from "./sessionStore";

export type AdminLoginActionResult =
  | { readonly status: "persisted" }
  | { readonly status: "cleared" };

export type PostLoginRedirectResult =
  | { readonly kind: "redirect"; readonly path: string }
  | {
      readonly kind: "blocked";
      readonly reason:
        | "loading"
        | "forbidden"
        | "backend_unavailable"
        | "error";
    };

export class AdminLoginError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "AdminLoginError";
  }
}

export async function persistAdminAccessToken(
  sessionStore: AdminSessionStore,
  accessToken: string,
): Promise<AdminLoginActionResult> {
  if (!sessionStore.setAccessToken) {
    throw new AdminLoginError("Admin session store cannot persist tokens.");
  }

  if (accessToken.trim().length === 0) {
    throw new AdminLoginError("Admin access token must be non-empty.");
  }

  await sessionStore.setAccessToken(accessToken);

  return { status: "persisted" };
}

export async function clearAdminSession(
  sessionStore: AdminSessionStore,
): Promise<AdminLoginActionResult> {
  await sessionStore.clear();

  return { status: "cleared" };
}

export function createPostLoginRedirect(
  authViewModel: AdminAuthViewModel,
  configOrOverrides: AdminConfig | AdminConfigOverrides = {},
): PostLoginRedirectResult {
  const config = createAdminConfig(configOrOverrides);

  if (authViewModel.canAccessAdmin) {
    return { kind: "redirect", path: config.adminHomePath };
  }

  if (authViewModel.shouldRedirectToLogin) {
    return { kind: "redirect", path: config.loginPath };
  }

  if (authViewModel.shouldShowForbidden) {
    return { kind: "blocked", reason: "forbidden" };
  }

  if (authViewModel.shouldShowBackendUnavailable) {
    return { kind: "blocked", reason: "backend_unavailable" };
  }

  if (authViewModel.isLoading) {
    return { kind: "blocked", reason: "loading" };
  }

  return { kind: "blocked", reason: "error" };
}
