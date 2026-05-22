import {
  EMPTY_TABLE_VALUE,
  createAdminAuditLogsTable,
  createAdminBookingsTable,
  createAdminProvidersTable,
  createAdminReportsTable,
  createAdminReviewsTable,
  createAdminUsersTable,
  type AdminAuditLogListItem,
  type AdminBookingListItem,
  type AdminProviderListItem,
  type AdminReportListItem,
  type AdminReviewListItem,
  type AdminTableViewModel,
  type AdminUserListItem,
} from "../src";

const forbiddenValue = "must not appear in table view model";

main();

function main(): void {
  testUsersTable();
  testProvidersTable();
  testBookingsTable();
  testReportsTable();
  testReviewsTable();
  testAuditLogsTable();
  testEmptyTables();

  console.log("admin-table-view-models tests passed");
}

function testUsersTable(): void {
  const table = createAdminUsersTable([
    withForbiddenFields<AdminUserListItem>({
      createdAt: "2026-05-18T12:00:00.000Z",
      displayName: forbiddenValue,
      email: "admin@teste.com",
      id: "user-1",
      roles: ["admin", "tutor"],
      status: "active",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  ]);

  assertColumnKeys(table, "email,roles,status,createdAt");
  assert(table.rows[0]?.id === "user-1", "user row should keep stable id");
  assert(table.rows[0]?.cells.roles === "admin, tutor", "roles should join safely");
  assertSafeTable(table);
}

function testProvidersTable(): void {
  const table = createAdminProvidersTable([
    withForbiddenFields<AdminProviderListItem>({
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "provider-1",
      status: "active",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  ]);

  assertColumnKeys(table, "displayName,status,serviceCount,createdAt");
  assert(table.rows[0]?.id === "provider-1", "provider row should keep stable id");
  assert(
    table.rows[0]?.cells.displayName === EMPTY_TABLE_VALUE,
    "missing provider display name should use fallback",
  );
  assert(
    table.rows[0]?.cells.serviceCount === EMPTY_TABLE_VALUE,
    "missing service count should use fallback",
  );
  assertSafeTable(table);
}

function testBookingsTable(): void {
  const table = createAdminBookingsTable([
    withForbiddenFields<AdminBookingListItem>({
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "booking-1",
      participantCount: 2,
      status: "requested",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  ]);

  assertColumnKeys(table, "serviceType,status,startsAt,participantCount");
  assert(table.rows[0]?.id === "booking-1", "booking row should keep stable id");
  assert(
    table.rows[0]?.cells.serviceType === EMPTY_TABLE_VALUE,
    "missing service type should use fallback",
  );
  assert(table.rows[0]?.cells.participantCount === "2", "numbers should stringify");
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

function testReviewsTable(): void {
  const table = createAdminReviewsTable([
    withForbiddenFields<AdminReviewListItem>({
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "review-1",
      rating: 4,
      status: "reported",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  ]);

  assertColumnKeys(table, "rating,status,reportCount,createdAt");
  assert(table.rows[0]?.id === "review-1", "review row should keep stable id");
  assert(table.rows[0]?.cells.rating === "4", "review rating should stringify");
  assert(
    table.rows[0]?.cells.reportCount === EMPTY_TABLE_VALUE,
    "missing report count should use fallback",
  );
  assertSafeTable(table);
}

function testAuditLogsTable(): void {
  const table = createAdminAuditLogsTable([
    withForbiddenFields<AdminAuditLogListItem>({
      action: "user.blocked",
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "audit-1",
      targetType: "user",
    }),
  ]);

  assertColumnKeys(table, "action,actorEmail,targetType,createdAt");
  assert(table.rows[0]?.id === "audit-1", "audit row should keep stable id");
  assert(
    table.rows[0]?.cells.actorEmail === EMPTY_TABLE_VALUE,
    "missing actor email should use fallback",
  );
  assertSafeTable(table);
}

function testEmptyTables(): void {
  const tables = [
    createAdminUsersTable([]),
    createAdminProvidersTable([]),
    createAdminBookingsTable([]),
    createAdminReportsTable([]),
    createAdminReviewsTable([]),
    createAdminAuditLogsTable([]),
  ];

  for (const table of tables) {
    assert(table.rows.length === 0, "empty table should have no rows");
    assert(
      table.emptyStateMessage.length > 0,
      "empty table should include en-GB empty state text",
    );
    assert(table.columns.length > 0, "empty table should keep columns");
    assertSafeTable(table);
  }
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
