import type {
  AdminAuditLogListItem,
  AdminBookingListItem,
  AdminProviderListItem,
  AdminReportListItem,
  AdminUserListItem,
} from "./adminResources";

export interface AdminTableColumn {
  readonly key: string;
  readonly label: string;
}

export interface AdminTableRow {
  readonly actionValues?: readonly AdminTableRowActionValue[];
  readonly cells: Readonly<Record<string, string>>;
  readonly id: string;
}

export interface AdminTableRowActionValue {
  readonly label: string;
  readonly value: string;
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
        roles: formatCellValue(item.roles.join(", ")),
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
      actionValues: [{ label: "Copy ID", value: item.id }],
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
    ["service", "Service"],
    ["status", "Status"],
    ["date", "Date"],
    ["timeSlotId", "Time"],
    ["createdAt", "Created"],
  ]);

  return {
    columns,
    emptyStateMessage: "No bookings found.",
    rows: items.map((item) => ({
      actionValues: [{ label: "Copy ID", value: item.id }],
      cells: {
        createdAt: formatCellValue(item.createdAt),
        date: formatCellValue(item.date),
        service: formatCellValue(item.service),
        status: formatCellValue(item.status),
        timeSlotId: formatCellValue(item.timeSlotId),
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

export function createAdminAuditLogsTable(
  items: readonly AdminAuditLogListItem[],
): AdminTableViewModel {
  const columns = createColumns([
    ["action", "Action"],
    ["actorUserId", "Actor user"],
    ["targetType", "Target"],
    ["createdAt", "Created"],
  ]);

  return {
    columns,
    emptyStateMessage: "No audit logs found.",
    rows: items.map((item) => ({
      actionValues: [
        { label: "Copy ID", value: item.id },
        ...(item.targetId
          ? [{ label: "Copy target ID", value: item.targetId }]
          : []),
      ],
      cells: {
        action: formatCellValue(item.action),
        actorUserId: formatCellValue(item.actorUserId),
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

function formatCellValue(value: number | string | null | undefined): string {
  if (typeof value === "number") {
    return Number.isFinite(value) ? String(value) : EMPTY_TABLE_VALUE;
  }

  if (typeof value === "string") {
    const trimmed = value.trim();

    return trimmed.length > 0 ? trimmed : EMPTY_TABLE_VALUE;
  }

  return EMPTY_TABLE_VALUE;
}
