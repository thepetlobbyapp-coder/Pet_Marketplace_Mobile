import {
  EMPTY_TABLE_VALUE,
  createAdminAuditLogsTable,
  createAdminBookingsTable,
  createAdminProvidersTable,
  createAdminReportsTable,
  createAdminUsersTable,
  type AdminAuditLogListItem,
  type AdminBookingListItem,
  type AdminProviderListItem,
  type AdminReportListItem,
  type AdminUserListItem,
  type AdminTableViewModel,
} from "../src";

const forbiddenValue = "must not appear in table view model";

main();

function main(): void {
  testUsersTable();
  testProvidersTable();
  testBookingsTable();
  testReportsTable();
  testAuditLogsTable();
  testEmptyTables();

  console.log("admin-table-view-models tests passed");
}

function testUsersTable(): void {
  const table = createAdminUsersTable([
    withForbiddenFields<AdminUserListItem>({
      createdAt: "2026-05-18T12:00:00.000Z",
      email: "admin@teste.com",
      id: "user-1",
      roles: ["admin", "tutor"],
      status: "active",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  ]);

  assertColumnKeys(table, "email,roles,status,createdAt");
  assert(table.rows[0]?.cells.roles === "admin, tutor", "roles should join");
  assertSafeTable(table);
}

function testProvidersTable(): void {
  const table = createAdminProvidersTable([
    withForbiddenFields<AdminProviderListItem>({
      createdAt: "2026-05-18T12:00:00.000Z",
      displayName: "Provider",
      id: "provider-1",
      serviceCount: 2,
      status: "active",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  ]);

  assertColumnKeys(table, "displayName,status,serviceCount,createdAt");
  assert(table.rows[0]?.cells.serviceCount === "2", "counts should render");
  assert(
    table.rows[0]?.actionValues?.[0]?.value === "provider-1",
    "providers should expose copy-safe id action",
  );
  assertSafeTable(table);
}

function testBookingsTable(): void {
  const table = createAdminBookingsTable([
    withForbiddenFields<AdminBookingListItem>({
      createdAt: "2026-05-18T12:00:00.000Z",
      date: "2026-05-21",
      id: "booking-1",
      service: "Dog walking",
      status: "requested",
      timeSlotId: "09:00",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  ]);

  assertColumnKeys(table, "service,status,date,timeSlotId,createdAt");
  assert(
    table.rows[0]?.actionValues?.[0]?.value === "booking-1",
    "bookings should expose copy-safe id action",
  );
  assertSafeTable(table);
}

function testReportsTable(): void {
  const table = createAdminReportsTable([
    withForbiddenFields<AdminReportListItem>({
      category: "safety_concern",
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "report-1",
      status: "open",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  ]);

  assertColumnKeys(table, "category,status,targetType,createdAt");
  assert(table.rows[0]?.id === "report-1", "report row should keep stable id");
  assert(
    table.rows[0]?.cells.targetType === EMPTY_TABLE_VALUE,
    "missing report target type should use fallback",
  );
  assertSafeTable(table);
}

function testAuditLogsTable(): void {
  const table = createAdminAuditLogsTable([
    withForbiddenFields<AdminAuditLogListItem>({
      action: "trust_safety.report_status_updated",
      actorUserId: null,
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "audit-1",
      targetId: "report-1",
      targetType: "report",
    }),
  ]);

  assertColumnKeys(table, "action,actorUserId,targetType,createdAt");
  assert(
    table.rows[0]?.cells.actorUserId === EMPTY_TABLE_VALUE,
    "null actor should use fallback",
  );
  assert(
    table.rows[0]?.actionValues?.map((action) => action.label).join(",") ===
      "Copy ID,Copy target ID",
    "audit logs should expose copy-safe row and target actions",
  );
  assertSafeTable(table);
}

function testEmptyTables(): void {
  const table = createAdminAuditLogsTable([]);

  assert(table.rows.length === 0, "empty table should have no rows");
  assert(
    table.emptyStateMessage.length > 0,
    "empty table should include en-GB empty state text",
  );
  assert(table.columns.length > 0, "empty table should keep columns");
  assertSafeTable(table);
}

function withForbiddenFields<T extends object>(item: T): T {
  return {
    ...item,
    address: forbiddenValue,
    coordinates: forbiddenValue,
    location: forbiddenValue,
    metadata: forbiddenValue,
    phone: forbiddenValue,
    rawMetadata: forbiddenValue,
    serviceRole: forbiddenValue,
    service_role: forbiddenValue,
    token: forbiddenValue,
  };
}

function assertColumnKeys(table: AdminTableViewModel, expected: string): void {
  assert(
    table.columns.map((column) => column.key).join(",") === expected,
    `expected columns ${expected}`,
  );
}

function assertSafeTable(table: AdminTableViewModel): void {
  const serialized = JSON.stringify(table);

  for (const value of [
    "token",
    "phone",
    "address",
    "location",
    "coordinates",
    "serviceRole",
    "service_role",
    "rawMetadata",
    "metadata",
    forbiddenValue,
  ]) {
    assert(!serialized.includes(value), `${value} should not appear in table`);
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
