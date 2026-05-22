import {
  AdminApiError,
  BackendUnavailableError,
  type AdminApiClient,
} from "../api/adminApiClient";
import type { MeResponseDto } from "./meContract";
import type { AdminSessionStore } from "./sessionStore";

export const REQUIRED_ADMIN_ROLE = "admin";

export type AdminAuthState =
  | { readonly status: "loading" }
  | { readonly status: "unauthenticated" }
  | { readonly status: "authenticated"; readonly user: MeResponseDto }
  | { readonly status: "forbidden"; readonly user?: MeResponseDto }
  | { readonly status: "backend_unavailable"; readonly message: string }
  | { readonly status: "error"; readonly message: string };

export interface BootstrapAdminSessionOptions {
  readonly apiClient: AdminApiClient;
  readonly sessionStore: AdminSessionStore;
}

export async function bootstrapAdminSession({
  apiClient,
  sessionStore,
}: BootstrapAdminSessionOptions): Promise<AdminAuthState> {
  const accessToken = await sessionStore.getAccessToken();

  if (!accessToken) {
    return { status: "unauthenticated" };
  }

  try {
    const user = await apiClient.getMe();

    if (!hasAdminRole(user.roles)) {
      return { status: "forbidden", user };
    }

    return { status: "authenticated", user };
  } catch (error) {
    if (error instanceof AdminApiError) {
      if (error.status === 401) {
        await sessionStore.clear();

        return { status: "unauthenticated" };
      }

      if (error.status === 403) {
        await sessionStore.clear();

        return { status: "forbidden" };
      }
    }

    if (error instanceof BackendUnavailableError) {
      return {
        message: "Backend is unavailable. Keep the current admin route blocked.",
        status: "backend_unavailable",
      };
    }

    return {
      message: "Could not bootstrap the admin session.",
      status: "error",
    };
  }
}

export async function logoutAdminSession(
  sessionStore: AdminSessionStore,
): Promise<AdminAuthState> {
  await sessionStore.clear();

  return { status: "unauthenticated" };
}

export function hasAdminRole(roles: readonly string[]): boolean {
  return roles.some((role) => role.trim().toLowerCase() === REQUIRED_ADMIN_ROLE);
}

export function getSafeAdminIdentity(user: MeResponseDto): {
  readonly email: string;
  readonly locale: string | null;
  readonly roles: readonly string[];
  readonly status: string;
} {
  return {
    email: user.email,
    locale: user.locale,
    roles: user.roles,
    status: user.status,
  };
}
