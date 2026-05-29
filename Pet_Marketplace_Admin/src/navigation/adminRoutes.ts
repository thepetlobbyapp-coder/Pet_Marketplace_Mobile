import type { AdminAuthViewModel } from "../auth/adminAuthViewModel";

export type AdminRouteId =
  | "dashboard"
  | "users"
  | "providers"
  | "bookings"
  | "reports"
  | "reviews"
  | "auditLogs";

export interface AdminRoute {
  readonly id: AdminRouteId;
  readonly label: string;
  readonly path: string;
  readonly requiresAdmin: true;
  readonly status: "enabled" | "disabled";
  readonly disabledReason?: string;
}

export const ADMIN_ROUTES: readonly AdminRoute[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    path: "/admin",
    requiresAdmin: true,
    status: "enabled",
  },
  {
    id: "users",
    label: "Users",
    path: "/admin/users",
    requiresAdmin: true,
    status: "enabled",
  },
  {
    id: "providers",
    label: "Providers",
    path: "/admin/providers",
    requiresAdmin: true,
    status: "enabled",
  },
  {
    id: "bookings",
    label: "Bookings",
    path: "/admin/bookings",
    requiresAdmin: true,
    status: "enabled",
  },
  {
    id: "reports",
    label: "Reports",
    path: "/admin/reports",
    requiresAdmin: true,
    status: "enabled",
  },
  {
    id: "reviews",
    label: "Reviews",
    path: "/admin/reviews",
    requiresAdmin: true,
    status: "enabled",
  },
  {
    id: "auditLogs",
    label: "Audit logs",
    path: "/admin/audit-logs",
    requiresAdmin: true,
    status: "enabled",
  },
];

export function getAccessibleAdminRoutes(
  authViewModel: AdminAuthViewModel,
): readonly AdminRoute[] {
  if (!authViewModel.canAccessAdmin) {
    return [];
  }

  return ADMIN_ROUTES;
}
