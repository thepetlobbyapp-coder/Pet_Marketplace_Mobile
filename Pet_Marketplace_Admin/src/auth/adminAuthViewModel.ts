import {
  getSafeAdminIdentity,
  type AdminAuthState,
} from "./adminSession";
import type { MeResponseDto } from "./meContract";

export interface SafeAdminIdentity {
  readonly email: string;
  readonly locale: string | null;
  readonly roles: readonly string[];
  readonly status: string;
}

export interface AdminAuthViewModel {
  readonly status: AdminAuthState["status"];
  readonly canAccessAdmin: boolean;
  readonly isLoading: boolean;
  readonly safeUserIdentity?: SafeAdminIdentity;
  readonly shouldRedirectToLogin: boolean;
  readonly shouldShowBackendUnavailable: boolean;
  readonly shouldShowForbidden: boolean;
}

export function createAdminAuthViewModel(
  state: AdminAuthState,
): AdminAuthViewModel {
  switch (state.status) {
    case "authenticated":
      return {
        canAccessAdmin: true,
        isLoading: false,
        safeUserIdentity: toSafeAdminIdentity(state.user),
        shouldRedirectToLogin: false,
        shouldShowBackendUnavailable: false,
        shouldShowForbidden: false,
        status: state.status,
      };
    case "forbidden":
      return {
        canAccessAdmin: false,
        isLoading: false,
        safeUserIdentity: state.user
          ? toSafeAdminIdentity(state.user)
          : undefined,
        shouldRedirectToLogin: false,
        shouldShowBackendUnavailable: false,
        shouldShowForbidden: true,
        status: state.status,
      };
    case "unauthenticated":
      return {
        canAccessAdmin: false,
        isLoading: false,
        shouldRedirectToLogin: true,
        shouldShowBackendUnavailable: false,
        shouldShowForbidden: false,
        status: state.status,
      };
    case "backend_unavailable":
      return {
        canAccessAdmin: false,
        isLoading: false,
        shouldRedirectToLogin: false,
        shouldShowBackendUnavailable: true,
        shouldShowForbidden: false,
        status: state.status,
      };
    case "loading":
      return {
        canAccessAdmin: false,
        isLoading: true,
        shouldRedirectToLogin: false,
        shouldShowBackendUnavailable: false,
        shouldShowForbidden: false,
        status: state.status,
      };
    case "error":
      return {
        canAccessAdmin: false,
        isLoading: false,
        shouldRedirectToLogin: false,
        shouldShowBackendUnavailable: false,
        shouldShowForbidden: false,
        status: state.status,
      };
  }
}

export function toSafeAdminIdentity(user: MeResponseDto): SafeAdminIdentity {
  return getSafeAdminIdentity(user);
}
