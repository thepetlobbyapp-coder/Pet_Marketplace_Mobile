import {
  requestAdminApiJson,
  type AdminApiClientOptions,
} from "../api/adminApiClient";
import type { AdminConfig } from "../config/adminConfig";
import {
  parseAdminDashboardSummary,
  type AdminDashboardSummary,
} from "./adminDashboardSummary";
import {
  parseAdminAuditLogsPage,
  parseAdminBookingsPage,
  parseAdminProvidersPage,
  parseAdminReportsList,
  parseAdminReportsPage,
  parseAdminUsersPage,
  AdminResourceContractError,
  type AdminAuditLogListItem,
  type AdminBookingListItem,
  type AdminProviderListItem,
  type AdminReportListItem,
  type AdminResourceListParams,
  type AdminResourcePage,
  type AdminUserListItem,
  type UpdateAdminReportRequest,
  type UpdateAdminUserStatusRequest,
} from "./adminResources";

export interface AdminResourceClientOptions extends AdminApiClientOptions {
  readonly config?: Pick<AdminConfig, "apiBaseUrl">;
}

export interface AdminResourceClient {
  readonly getAdminDashboardSummary: () => Promise<AdminDashboardSummary>;
  readonly listAdminAuditLogs: (
    params?: AdminResourceListParams,
  ) => Promise<AdminResourcePage<AdminAuditLogListItem>>;
  readonly listAdminBookings: (
    params?: AdminResourceListParams,
  ) => Promise<AdminResourcePage<AdminBookingListItem>>;
  readonly listAdminProviders: (
    params?: AdminResourceListParams,
  ) => Promise<AdminResourcePage<AdminProviderListItem>>;
  readonly listAdminReports: (
    params?: AdminResourceListParams,
  ) => Promise<AdminResourcePage<AdminReportListItem>>;
  readonly listAdminUsers: (
    params?: AdminResourceListParams,
  ) => Promise<AdminResourcePage<AdminUserListItem>>;
  readonly updateAdminReport: (
    reportId: string,
    body: UpdateAdminReportRequest,
  ) => Promise<AdminReportListItem>;
  readonly updateAdminUserStatus: (
    userId: string,
    body: UpdateAdminUserStatusRequest,
  ) => Promise<AdminUserListItem>;
}

export function createAdminResourceClient(
  options: AdminResourceClientOptions = {},
): AdminResourceClient {
  const baseUrl = options.baseUrl ?? options.config?.apiBaseUrl;

  return {
    getAdminDashboardSummary: async () =>
      parseAdminDashboardSummary(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: "/admin/dashboard",
        }),
      ),
    listAdminAuditLogs: async (params = {}) =>
      parseAdminAuditLogsPage(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: adminResourcePath("/admin/audit-logs", params),
        }),
      ),
    listAdminBookings: async (params = {}) =>
      parseAdminBookingsPage(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: adminResourcePath("/admin/bookings", params),
        }),
      ),
    listAdminProviders: async (params = {}) =>
      parseAdminProvidersPage(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: adminResourcePath("/admin/providers", params),
        }),
      ),
    listAdminReports: async (params = {}) =>
      parseAdminReportsPage(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: adminResourcePath("/admin/reports", params),
        }),
      ),
    listAdminUsers: async (params = {}) =>
      parseAdminUsersPage(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: adminResourcePath("/admin/users", params),
        }),
      ),
    updateAdminReport: async (reportId, body) => {
      const report = parseAdminReportsList([
        await requestAdminApiJson({
          ...options,
          baseUrl,
          body,
          method: "PATCH",
          path: `/admin/reports/${encodeURIComponent(reportId)}`,
        }),
      ])[0];
      if (!report) {
        throw new AdminResourceContractError("admin report response is empty.");
      }
      return report;
    },
    updateAdminUserStatus: async (userId, body) => {
      const user = parseAdminUsersPage([
        await requestAdminApiJson({
          ...options,
          baseUrl,
          body,
          method: "PATCH",
          path: `/admin/users/${encodeURIComponent(userId)}/status`,
        }),
      ]).items[0];
      if (!user) {
        throw new AdminResourceContractError("admin user response is empty.");
      }
      return user;
    },
  };
}

function adminResourcePath(
  path: string,
  params: AdminResourceListParams,
): string {
  const search = new URLSearchParams();

  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.cursor) search.set("cursor", params.cursor);

  const queryString = search.toString();
  return queryString ? `${path}?${queryString}` : path;
}
