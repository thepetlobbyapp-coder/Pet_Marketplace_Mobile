import type {
  AdminAuditLogListItem,
  AdminBookingListItem,
  AdminProviderListItem,
  AdminReportListItem,
  AdminReviewListItem,
  AdminUserListItem,
} from "./adminResources";

export interface AdminTableColumn {
  readonly key: string;
  readonly label: string;
}

export interface AdminTableRow {
  readonly cells: Readonly<Record<string, string>>;
  readonly id: string;
}

export interface AdminTableViewModel {
  readonly columns: readonly AdminTableColumn[];
  readonly emptyStateMessage: string;
  readonly rows: readonly AdminTableRow[];
}

export const EMPTY_TABLE_VALUE = "-";

export function createAdminUsersTable(
  items: readonly AdminUserListItem[],
): AdminTableViewModel {
  const columns = createColumns([
    ["email", "Email"],
    ["roles", "Roles"],
    ["status", "Status"],
    ["createdAt", "Created"],
  ]);

  return {
    columns,
    emptyStateMessage: "No users found.",
    rows: items.map((item) => ({
      cells: {
        createdAt: formatCellValue(item.createdAt),
        email: formatCellValue(item.email),
        roles: formatCellValue(item.roles),
        status: formatCellValue(item.status),
      },
      id: item.id,
    })),
  };
}

export function createAdminProvidersTable(
  items: readonly AdminProviderListItem[],
): AdminTableViewModel {
  const columns = createColumns([
    ["displayName", "Display name"],
    ["status", "Status"],
    ["serviceCount", "Services"],
    ["createdAt", "Created"],
  ]);

  return {
    columns,
    emptyStateMessage: "No providers found.",
    rows: items.map((item) => ({
      cells: {
        createdAt: formatCellValue(item.createdAt),
        displayName: formatCellValue(item.displayName),
        serviceCount: formatCellValue(item.serviceCount),
        status: formatCellValue(item.status),
      },
      id: item.id,
    })),
  };
}

export function createAdminBookingsTable(
  items: readonly AdminBookingListItem[],
): AdminTableViewModel {
  const columns = createColumns([
    ["serviceType", "Service"],
    ["status", "Status"],
    ["startsAt", "Starts"],
    ["participantCount", "Participants"],
  ]);

  return {
    columns,
    emptyStateMessage: "No bookings found.",
    rows: items.map((item) => ({
      cells: {
        participantCount: formatCellValue(item.participantCount),
        serviceType: formatCellValue(item.serviceType),
        startsAt: formatCellValue(item.startsAt),
        status: formatCellValue(item.status),
      },
      id: item.id,
    })),
  };
}

export function createAdminReportsTable(
  items: readonly AdminReportListItem[],
): AdminTableViewModel {
  const columns = createColumns([
    ["category", "Category"],
    ["status", "Status"],
    ["targetType", "Target"],
    ["createdAt", "Created"],
  ]);

  return {
    columns,
    emptyStateMessage: "No reports found.",
    rows: items.map((item) => ({
      cells: {
        category: formatCellValue(item.category),
        createdAt: formatCellValue(item.createdAt),
        status: formatCellValue(item.status),
        targetType: formatCellValue(item.targetType),
      },
      id: item.id,
    })),
  };
}

export function createAdminReviewsTable(
  items: readonly AdminReviewListItem[],
): AdminTableViewModel {
  const columns = createColumns([
    ["rating", "Rating"],
    ["status", "Status"],
    ["reportCount", "Reports"],
    ["createdAt", "Created"],
  ]);

  return {
    columns,
    emptyStateMessage: "No reviews found.",
    rows: items.map((item) => ({
      cells: {
        createdAt: formatCellValue(item.createdAt),
        rating: formatCellValue(item.rating),
        reportCount: formatCellValue(item.reportCount),
        status: formatCellValue(item.status),
      },
      id: item.id,
    })),
  };
}

export function createAdminAuditLogsTable(
  items: readonly AdminAuditLogListItem[],
): AdminTableViewModel {
  const columns = createColumns([
    ["action", "Action"],
    ["actorEmail", "Actor"],
    ["targetType", "Target"],
    ["createdAt", "Created"],
  ]);

  return {
    columns,
    emptyStateMessage: "No audit logs found.",
    rows: items.map((item) => ({
      cells: {
        action: formatCellValue(item.action),
        actorEmail: formatCellValue(item.actorEmail),
        createdAt: formatCellValue(item.createdAt),
        targetType: formatCellValue(item.targetType),
      },
      id: item.id,
    })),
  };
}

function createColumns(
  entries: readonly (readonly [key: string, label: string])[],
): readonly AdminTableColumn[] {
  return entries.map(([key, label]) => ({ key, label }));
}

function formatCellValue(
  value: readonly string[] | string | number | undefined,
): string {
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(", ") : EMPTY_TABLE_VALUE;
  }

  if (typeof value === "number") {
    return String(value);
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : EMPTY_TABLE_VALUE;
  }

  return EMPTY_TABLE_VALUE;
}
