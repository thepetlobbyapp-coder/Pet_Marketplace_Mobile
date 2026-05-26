import {
  requestAdminApiJson,
  type AdminApiClientOptions,
} from "../api/adminApiClient";
import type { AdminConfig } from "../config/adminConfig";
import {
  parseAdminAuditLogsList,
  parseAdminBookingsList,
  parseAdminProvidersList,
  parseAdminReportsList,
  parseAdminReviewsList,
  parseAdminUsersList,
  AdminResourceContractError,
  type AdminAuditLogListItem,
  type AdminBookingListItem,
  type AdminProviderListItem,
  type AdminReportListItem,
  type AdminReviewListItem,
  type AdminUserListItem,
  type UpdateAdminReportRequest,
} from "./adminResources";

export interface AdminResourceClientOptions extends AdminApiClientOptions {
  readonly config?: Pick<AdminConfig, "apiBaseUrl">;
}

export interface AdminResourceClient {
  readonly listAdminUsers: () => Promise<readonly AdminUserListItem[]>;
  readonly listAdminProviders: () => Promise<readonly AdminProviderListItem[]>;
  readonly listAdminBookings: () => Promise<readonly AdminBookingListItem[]>;
  readonly listAdminReports: () => Promise<readonly AdminReportListItem[]>;
  readonly updateAdminReport: (
    reportId: string,
    body: UpdateAdminReportRequest,
  ) => Promise<AdminReportListItem>;
  readonly listAdminReviews: () => Promise<readonly AdminReviewListItem[]>;
  readonly listAdminAuditLogs: () => Promise<readonly AdminAuditLogListItem[]>;
}

export function createAdminResourceClient(
  options: AdminResourceClientOptions = {},
): AdminResourceClient {
  const baseUrl = options.baseUrl ?? options.config?.apiBaseUrl;

  return {
    listAdminAuditLogs: async () =>
      parseAdminAuditLogsList(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: "/admin/audit-logs",
        }),
      ),
    listAdminBookings: async () =>
      parseAdminBookingsList(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: "/admin/bookings",
        }),
      ),
    listAdminProviders: async () =>
      parseAdminProvidersList(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: "/admin/providers",
        }),
      ),
    listAdminReports: async () =>
      parseAdminReportsList(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: "/admin/reports",
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
    listAdminReviews: async () =>
      parseAdminReviewsList(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: "/admin/reviews",
        }),
      ),
    listAdminUsers: async () =>
      parseAdminUsersList(
        await requestAdminApiJson({
          ...options,
          baseUrl,
          path: "/admin/users",
        }),
      ),
  };
}
