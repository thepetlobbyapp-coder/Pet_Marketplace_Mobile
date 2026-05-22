import type {
  AdminAuthViewModel,
  SafeAdminIdentity,
} from "../auth/adminAuthViewModel";
import {
  getAccessibleAdminRoutes,
  type AdminRoute,
} from "./adminRoutes";

export type AdminShellBlockedReason =
  | "loading"
  | "login_required"
  | "forbidden"
  | "backend_unavailable"
  | "error";

export interface AdminShellViewModel {
  readonly authStatus: AdminAuthViewModel["status"];
  readonly primaryBlockedReason: AdminShellBlockedReason | null;
  readonly safeUserIdentity?: SafeAdminIdentity;
  readonly visibleRoutes: readonly AdminRoute[];
}

export function createAdminShellViewModel(
  authViewModel: AdminAuthViewModel,
): AdminShellViewModel {
  return {
    authStatus: authViewModel.status,
    primaryBlockedReason: getPrimaryBlockedReason(authViewModel),
    safeUserIdentity: authViewModel.safeUserIdentity,
    visibleRoutes: getAccessibleAdminRoutes(authViewModel),
  };
}

function getPrimaryBlockedReason(
  authViewModel: AdminAuthViewModel,
): AdminShellBlockedReason | null {
  if (authViewModel.canAccessAdmin) {
    return null;
  }

  switch (authViewModel.status) {
    case "loading":
      return "loading";
    case "unauthenticated":
      return "login_required";
    case "forbidden":
      return "forbidden";
    case "backend_unavailable":
      return "backend_unavailable";
    case "error":
      return "error";
    case "authenticated":
      return "error";
  }
}
