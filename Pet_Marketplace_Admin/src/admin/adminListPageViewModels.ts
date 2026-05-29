import type { AdminResourceClient } from "./adminResourceClient";
import type {
  AdminAuditLogListItem,
  AdminBookingListItem,
  AdminProviderListItem,
  AdminReportListItem,
  AdminResourceListParams,
  AdminResourcePage,
  AdminUserListItem,
} from "./adminResources";
import {
  createAdminAuditLogsTable,
  createAdminBookingsTable,
  createAdminProvidersTable,
  createAdminReportsTable,
  createAdminUsersTable,
  type AdminTableViewModel,
} from "./adminTableViewModels";
import type { AdminRouteId } from "../navigation/adminRoutes";

export type AdminListPageId = Exclude<AdminRouteId, "dashboard" | "reviews">;

export interface AdminListPageDefinition {
  readonly id: AdminListPageId;
  readonly path: string;
  readonly title: string;
}

export interface AdminListPageItems {
  readonly auditLogs: AdminAuditLogListItem;
  readonly bookings: AdminBookingListItem;
  readonly providers: AdminProviderListItem;
  readonly reports: AdminReportListItem;
  readonly users: AdminUserListItem;
}

export type AdminListPageItem = AdminListPageItems[AdminListPageId];

export interface AdminListPaginationViewModel {
  readonly cursor: string | null;
  readonly isAfterFirstPage: boolean;
  readonly nextCursor: string | null;
}

export type AdminListPageState<
  TItem extends AdminListPageItem = AdminListPageItem,
> =
  | { readonly status: "loading"; readonly page: AdminListPageDefinition }
  | {
      readonly items: readonly TItem[];
      readonly pagination: AdminListPaginationViewModel;
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

export async function loadAdminListPageViewModel<
  TPageId extends AdminListPageId,
>(
  client: AdminResourceClient,
  pageId: TPageId,
  params: AdminResourceListParams = {},
): Promise<AdminListPageState<AdminListPageItems[TPageId]>> {
  const page = getAdminListPageDefinition(pageId);

  try {
    const resourcePage = await loadAdminResourcePage(client, pageId, params);

    return {
      items: resourcePage.items,
      page,
      pagination: {
        cursor: params.cursor ?? null,
        isAfterFirstPage: Boolean(params.cursor),
        nextCursor: resourcePage.nextCursor,
      },
      status: "ready",
      table: createAdminListPageTable(pageId, resourcePage.items),
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

async function loadAdminResourcePage<TPageId extends AdminListPageId>(
  client: AdminResourceClient,
  pageId: TPageId,
  params: AdminResourceListParams,
): Promise<AdminResourcePage<AdminListPageItems[TPageId]>> {
  switch (pageId) {
    case "auditLogs":
      return client.listAdminAuditLogs(params) as Promise<
        AdminResourcePage<AdminListPageItems[TPageId]>
      >;
    case "bookings":
      return client.listAdminBookings(params) as Promise<
        AdminResourcePage<AdminListPageItems[TPageId]>
      >;
    case "providers":
      return client.listAdminProviders(params) as Promise<
        AdminResourcePage<AdminListPageItems[TPageId]>
      >;
    case "reports":
      return client.listAdminReports(params) as Promise<
        AdminResourcePage<AdminListPageItems[TPageId]>
      >;
    case "users":
      return client.listAdminUsers(params) as Promise<
        AdminResourcePage<AdminListPageItems[TPageId]>
      >;
  }
}

function createAdminListPageTable(
  pageId: AdminListPageId,
  items: readonly AdminListPageItem[],
): AdminTableViewModel {
  switch (pageId) {
    case "auditLogs":
      return createAdminAuditLogsTable(
        items as readonly AdminAuditLogListItem[],
      );
    case "bookings":
      return createAdminBookingsTable(items as readonly AdminBookingListItem[]);
    case "providers":
      return createAdminProvidersTable(
        items as readonly AdminProviderListItem[],
      );
    case "reports":
      return createAdminReportsTable(items as readonly AdminReportListItem[]);
    case "users":
      return createAdminUsersTable(items as readonly AdminUserListItem[]);
  }
}
