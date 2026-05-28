import type { AdminResourceClient } from "./adminResourceClient";
import { AdminResourceContractError } from "./adminResources";

export const ADMIN_DASHBOARD_BOOKING_STATUSES = [
  "requested",
  "confirmed",
  "cancelled",
  "completed",
] as const;

export type AdminDashboardBookingStatus =
  (typeof ADMIN_DASHBOARD_BOOKING_STATUSES)[number];

export type AdminDashboardBookingStatusCounts = Record<
  AdminDashboardBookingStatus,
  number
>;

export interface AdminDashboardSummaryResources {
  readonly dashboard: AdminDashboardSummary;
}

export interface AdminDashboardSummary {
  readonly totalUsers: number;
  readonly totalTutors: number;
  readonly totalProviders: number;
  readonly bookingsByStatus: AdminDashboardBookingStatusCounts;
  readonly openReports: number;
  readonly blockedUsers: number;
}

export interface AdminDashboardKpiCard {
  readonly id:
    | "totalUsers"
    | "totalTutors"
    | "totalProviders"
    | "openReports"
    | "blockedUsers";
  readonly label: string;
  readonly value: number;
}

export interface AdminDashboardBookingStatusRow {
  readonly status: AdminDashboardBookingStatus;
  readonly label: string;
  readonly count: number;
}

export interface AdminDashboardViewModel {
  readonly kpiCards: readonly AdminDashboardKpiCard[];
  readonly bookingStatusRows: readonly AdminDashboardBookingStatusRow[];
  readonly totalBookings: number;
  readonly isEmpty: boolean;
}

export type AdminDashboardSummaryState =
  | { readonly status: "loading" }
  | { readonly status: "ready"; readonly summary: AdminDashboardSummary }
  | { readonly status: "error"; readonly message: string };

export const ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE =
  "Could not load admin dashboard summary.";

const BOOKING_STATUS_LABELS: Record<AdminDashboardBookingStatus, string> = {
  cancelled: "Cancelled",
  completed: "Completed",
  confirmed: "Confirmed",
  requested: "Requested",
};

export function parseAdminDashboardSummary(
  payload: unknown,
): AdminDashboardSummary {
  const record = expectRecord(payload, "admin dashboard");
  const bookingsByStatus = expectRecord(
    record.bookingsByStatus,
    "admin dashboard.bookingsByStatus",
  );

  return {
    blockedUsers: expectNonNegativeInteger(
      record.blockedUsers,
      "admin dashboard.blockedUsers",
    ),
    bookingsByStatus: {
      cancelled: expectNonNegativeInteger(
        bookingsByStatus.cancelled,
        "admin dashboard.bookingsByStatus.cancelled",
      ),
      completed: expectNonNegativeInteger(
        bookingsByStatus.completed,
        "admin dashboard.bookingsByStatus.completed",
      ),
      confirmed: expectNonNegativeInteger(
        bookingsByStatus.confirmed,
        "admin dashboard.bookingsByStatus.confirmed",
      ),
      requested: expectNonNegativeInteger(
        bookingsByStatus.requested,
        "admin dashboard.bookingsByStatus.requested",
      ),
    },
    openReports: expectNonNegativeInteger(
      record.openReports,
      "admin dashboard.openReports",
    ),
    totalProviders: expectNonNegativeInteger(
      record.totalProviders,
      "admin dashboard.totalProviders",
    ),
    totalTutors: expectNonNegativeInteger(
      record.totalTutors,
      "admin dashboard.totalTutors",
    ),
    totalUsers: expectNonNegativeInteger(
      record.totalUsers,
      "admin dashboard.totalUsers",
    ),
  };
}

export function createAdminDashboardSummary(
  resources: AdminDashboardSummaryResources,
): AdminDashboardSummary {
  return {
    blockedUsers: resources.dashboard.blockedUsers,
    bookingsByStatus: { ...resources.dashboard.bookingsByStatus },
    openReports: resources.dashboard.openReports,
    totalProviders: resources.dashboard.totalProviders,
    totalTutors: resources.dashboard.totalTutors,
    totalUsers: resources.dashboard.totalUsers,
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

export function createAdminDashboardViewModel(
  summary: AdminDashboardSummary,
): AdminDashboardViewModel {
  const bookingStatusRows = ADMIN_DASHBOARD_BOOKING_STATUSES.map((status) => ({
    count: summary.bookingsByStatus[status],
    label: BOOKING_STATUS_LABELS[status],
    status,
  }));
  const totalBookings = bookingStatusRows.reduce(
    (total, row) => total + row.count,
    0,
  );
  const kpiCards: AdminDashboardKpiCard[] = [
    { id: "totalUsers", label: "Total users", value: summary.totalUsers },
    { id: "totalTutors", label: "Tutors", value: summary.totalTutors },
    {
      id: "totalProviders",
      label: "Providers",
      value: summary.totalProviders,
    },
    { id: "openReports", label: "Open reports", value: summary.openReports },
    {
      id: "blockedUsers",
      label: "Blocked users",
      value: summary.blockedUsers,
    },
  ];

  return {
    bookingStatusRows,
    isEmpty:
      totalBookings === 0 && kpiCards.every((card) => card.value === 0),
    kpiCards,
    totalBookings,
  };
}

export async function loadAdminDashboardSummary(
  client: AdminResourceClient,
): Promise<AdminDashboardSummaryState> {
  try {
    const dashboard = await client.getAdminDashboardSummary();

    return createAdminDashboardSummaryState({ dashboard });
  } catch {
    return {
      message: ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE,
      status: "error",
    };
  }
}

function expectRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new AdminResourceContractError(`${label} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function expectNonNegativeInteger(value: unknown, label: string): number {
  if (
    typeof value !== "number" ||
    !Number.isInteger(value) ||
    value < 0
  ) {
    throw new AdminResourceContractError(
      `${label} must be a non-negative integer.`,
    );
  }

  return value;
}
