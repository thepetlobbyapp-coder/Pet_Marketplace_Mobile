import type { AdminResourceClient } from "./adminResourceClient";
import {
  createAdminAuditLogsTable,
  createAdminBookingsTable,
  createAdminProvidersTable,
  createAdminReportsTable,
  createAdminReviewsTable,
  createAdminUsersTable,
  type AdminTableViewModel,
} from "./adminTableViewModels";
import type { AdminRouteId } from "../navigation/adminRoutes";

export type AdminListPageId = Exclude<AdminRouteId, "dashboard">;

export interface AdminListPageDefinition {
  readonly id: AdminListPageId;
  readonly path: string;
  readonly title: string;
}

export type AdminListPageState =
  | { readonly status: "loading"; readonly page: AdminListPageDefinition }
  | {
      readonly status: "ready";
      readonly page: AdminListPageDefinition;
      readonly table: AdminTableViewModel;
    }
  | {
      readonly status: "error";
      readonly message: string;
      readonly page: AdminListPageDefinition;
    };

export const ADMIN_LIST_PAGE_ERROR_MESSAGE =
  "Could not load admin list page.";

export const ADMIN_LIST_PAGE_DEFINITIONS: Readonly<
  Record<AdminListPageId, AdminListPageDefinition>
> = {
  auditLogs: {
    id: "auditLogs",
    path: "/admin/audit-logs",
    title: "Audit logs",
  },
  bookings: {
    id: "bookings",
    path: "/admin/bookings",
    title: "Bookings",
  },
  providers: {
    id: "providers",
    path: "/admin/providers",
    title: "Providers",
  },
  reports: {
    id: "reports",
    path: "/admin/reports",
    title: "Reports",
  },
  reviews: {
    id: "reviews",
    path: "/admin/reviews",
    title: "Reviews",
  },
  users: {
    id: "users",
    path: "/admin/users",
    title: "Users",
  },
};

export function createAdminListPageLoadingState(
  pageId: AdminListPageId,
): AdminListPageState {
  return {
    page: getAdminListPageDefinition(pageId),
    status: "loading",
  };
}

export async function loadAdminListPageViewModel(
  client: AdminResourceClient,
  pageId: AdminListPageId,
): Promise<AdminListPageState> {
  const page = getAdminListPageDefinition(pageId);

  try {
    return {
      page,
      status: "ready",
      table: await loadAdminListPageTable(client, pageId),
    };
  } catch {
    return {
      message: ADMIN_LIST_PAGE_ERROR_MESSAGE,
      page,
      status: "error",
    };
  }
}

export function getAdminListPageDefinition(
  pageId: AdminListPageId,
): AdminListPageDefinition {
  return ADMIN_LIST_PAGE_DEFINITIONS[pageId];
}

async function loadAdminListPageTable(
  client: AdminResourceClient,
  pageId: AdminListPageId,
): Promise<AdminTableViewModel> {
  switch (pageId) {
    case "auditLogs":
      return createAdminAuditLogsTable(await client.listAdminAuditLogs());
    case "bookings":
      return createAdminBookingsTable(await client.listAdminBookings());
    case "providers":
      return createAdminProvidersTable(await client.listAdminProviders());
    case "reports":
      return createAdminReportsTable(await client.listAdminReports());
    case "reviews":
      return createAdminReviewsTable(await client.listAdminReviews());
    case "users":
      return createAdminUsersTable(await client.listAdminUsers());
  }
}
