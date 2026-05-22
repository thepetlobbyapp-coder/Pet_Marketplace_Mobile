import type { AdminResourceClient } from "./adminResourceClient";
import type {
  AdminAuditLogListItem,
  AdminBookingListItem,
  AdminProviderListItem,
  AdminReportListItem,
  AdminReviewListItem,
  AdminUserListItem,
} from "./adminResources";

export interface AdminDashboardSummaryResources {
  readonly auditLogs: readonly AdminAuditLogListItem[];
  readonly bookings: readonly AdminBookingListItem[];
  readonly providers: readonly AdminProviderListItem[];
  readonly reports: readonly AdminReportListItem[];
  readonly reviews: readonly AdminReviewListItem[];
  readonly users: readonly AdminUserListItem[];
}

export interface AdminDashboardSummary {
  readonly blockedOrSuspendedUsers: number;
  readonly openReports: number;
  readonly recentAuditLogCount: number;
  readonly reportedReviews: number;
  readonly totalBookings: number;
  readonly totalProviders: number;
  readonly totalUsers: number;
}

export type AdminDashboardSummaryState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly summary: AdminDashboardSummary }
  | { readonly status: "error"; readonly message: string };

export const ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE =
  "Could not load admin dashboard summary.";

const OPEN_REPORT_STATUSES = new Set(["open", "opened", "pending"]);
const REPORTED_REVIEW_STATUSES = new Set(["reported", "hidden"]);
const BLOCKED_USER_STATUSES = new Set([
  "blocked",
  "suspended",
  "banned",
  "inactive",
]);

export function createAdminDashboardSummary(
  resources: AdminDashboardSummaryResources,
): AdminDashboardSummary {
  return {
    blockedOrSuspendedUsers: resources.users.filter((user) =>
      BLOCKED_USER_STATUSES.has(normalizeStatus(user.status)),
    ).length,
    openReports: resources.reports.filter((report) =>
      OPEN_REPORT_STATUSES.has(normalizeStatus(report.status)),
    ).length,
    recentAuditLogCount: resources.auditLogs.length,
    reportedReviews: resources.reviews.filter((review) =>
      REPORTED_REVIEW_STATUSES.has(normalizeStatus(review.status)),
    ).length,
    totalBookings: resources.bookings.length,
    totalProviders: resources.providers.length,
    totalUsers: resources.users.length,
  };
}

export function createAdminDashboardSummaryState(
  resources: AdminDashboardSummaryResources,
): AdminDashboardSummaryState {
  return {
    status: "ready",
    summary: createAdminDashboardSummary(resources),
  };
}

export async function loadAdminDashboardSummary(
  client: AdminResourceClient,
): Promise<AdminDashboardSummaryState> {
  try {
    const [
      users,
      providers,
      bookings,
      reports,
      reviews,
      auditLogs,
    ] = await Promise.all([
      client.listAdminUsers(),
      client.listAdminProviders(),
      client.listAdminBookings(),
      client.listAdminReports(),
      client.listAdminReviews(),
      client.listAdminAuditLogs(),
    ]);

    return createAdminDashboardSummaryState({
      auditLogs,
      bookings,
      providers,
      reports,
      reviews,
      users,
    });
  } catch {
    return {
      message: ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE,
      status: "error",
    };
  }
}

function normalizeStatus(status: string): string {
  return status.trim().toLowerCase();
}
