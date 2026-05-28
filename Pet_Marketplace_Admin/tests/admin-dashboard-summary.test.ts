import {
  ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE,
  AdminResourceContractError,
  createAdminDashboardSummary,
  createAdminDashboardViewModel,
  loadAdminDashboardSummary,
  parseAdminDashboardSummary,
  type AdminDashboardSummary,
  type AdminResourceClient,
} from "../src";

const forbiddenValue = "must not appear in dashboard summary";

main().catch((error: unknown) => {
  throw error;
});

async function main(): Promise<void> {
  testContractParserKeepsOnlyAggregateFields();
  testContractParserRejectsInvalidCounts();
  testSummaryCalculatesViewModel();
  await testLoaderCallsDashboardEndpointOnly();
  await testLoaderReturnsGenericError();

  console.log("admin-dashboard-summary tests passed");
}

function testContractParserKeepsOnlyAggregateFields(): void {
  const summary = parseAdminDashboardSummary(
    withForbiddenFields(createDashboardPayload()),
  );
  const serialized = JSON.stringify(summary);

  assert(summary.totalUsers === 8, "summary should parse total users");
  assert(summary.totalTutors === 7, "summary should parse total tutors");
  assert(summary.totalProviders === 6, "summary should parse providers");
  assert(summary.openReports === 5, "summary should parse open reports");
  assert(summary.blockedUsers === 1, "summary should parse blocked users");
  assert(
    summary.bookingsByStatus.requested === 4,
    "summary should parse requested bookings",
  );
  assertNoForbiddenDashboardPayload(serialized);
}

function testContractParserRejectsInvalidCounts(): void {
  try {
    parseAdminDashboardSummary({
      ...createDashboardPayload(),
      totalUsers: -1,
    });
  } catch (error) {
    assert(
      error instanceof AdminResourceContractError,
      "invalid dashboard payload should throw a contract error",
    );
    return;
  }

  throw new Error("Expected dashboard contract error");
}

function testSummaryCalculatesViewModel(): void {
  const summary = createAdminDashboardSummary({
    dashboard: createDashboardSummary(),
  });
  const viewModel = createAdminDashboardViewModel(summary);
  const serialized = JSON.stringify(viewModel);

  assert(viewModel.kpiCards.length === 5, "dashboard should expose KPI cards");
  assert(
    viewModel.kpiCards.map((card) => card.id).join(",") ===
      "totalUsers,totalTutors,totalProviders,openReports,blockedUsers",
    "dashboard KPI order should stay stable",
  );
  assert(
    viewModel.bookingStatusRows.map((row) => row.status).join(",") ===
      "requested,confirmed,cancelled,completed",
    "booking status row order should stay stable",
  );
  assert(viewModel.totalBookings === 10, "booking total should be derived");
  assert(!viewModel.isEmpty, "dashboard with counts should not be empty");
  assertNoForbiddenDashboardPayload(serialized);
}

async function testLoaderCallsDashboardEndpointOnly(): Promise<void> {
  const calls: string[] = [];
  const client = createMockClient(calls);
  const state = await loadAdminDashboardSummary(client);

  assert(state.status === "ready", "loader should return ready state");
  assert(
    calls.join(",") === "dashboard",
    "loader should call only the aggregate dashboard endpoint",
  );
  assert(state.summary.openReports === 5, "loader should keep dashboard data");
  assertNoForbiddenDashboardPayload(JSON.stringify(state));
}

async function testLoaderReturnsGenericError(): Promise<void> {
  const client = createMockClient([], true);
  const state = await loadAdminDashboardSummary(client);
  const serialized = JSON.stringify(state);

  assert(state.status === "error", "loader should return error state");
  assert(
    state.message === ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE,
    "loader should use generic error message",
  );
  assert(
    !serialized.includes("raw backend payload"),
    "loader error should not expose raw failure details",
  );
  assertNoForbiddenDashboardPayload(serialized);
}

function createMockClient(
  calls: string[],
  shouldFail = false,
): AdminResourceClient {
  return {
    getAdminDashboardSummary: async () => {
      calls.push("dashboard");
      if (shouldFail) {
        throw new Error(`raw backend payload ${forbiddenValue}`);
      }

      return createDashboardSummary();
    },
    listAdminAuditLogs: async () => ({ items: [], nextCursor: null }),
    listAdminBookings: async () => ({ items: [], nextCursor: null }),
    listAdminProviders: async () => ({ items: [], nextCursor: null }),
    listAdminReports: async () => ({ items: [], nextCursor: null }),
    listAdminUsers: async () => ({ items: [], nextCursor: null }),
    updateAdminReport: async () => ({
      category: "safety_concern",
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "report-1",
      status: "open",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
    updateAdminUserStatus: async () => ({
      createdAt: "2026-05-18T12:00:00.000Z",
      email: "user@example.test",
      id: "user-1",
      roles: ["tutor"],
      status: "blocked",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  };
}

function createDashboardSummary(): AdminDashboardSummary {
  return parseAdminDashboardSummary(createDashboardPayload());
}

function createDashboardPayload(): Record<string, unknown> {
  return {
    blockedUsers: 1,
    bookingsByStatus: {
      cancelled: 1,
      completed: 2,
      confirmed: 3,
      requested: 4,
    },
    openReports: 5,
    totalProviders: 6,
    totalTutors: 7,
    totalUsers: 8,
  };
}

function withForbiddenFields<T extends Record<string, unknown>>(item: T): T {
  return {
    ...item,
    address: forbiddenValue,
    coordinates: forbiddenValue,
    description: forbiddenValue,
    displayName: forbiddenValue,
    email: forbiddenValue,
    id: forbiddenValue,
    location: forbiddenValue,
    metadata: forbiddenValue,
    phone: forbiddenValue,
    rawMetadata: forbiddenValue,
    serviceRole: forbiddenValue,
    service_role: forbiddenValue,
    targetId: forbiddenValue,
    token: forbiddenValue,
  };
}

function assertNoForbiddenDashboardPayload(serialized: string): void {
  for (const value of [
    "token",
    "phone",
    "address",
    "location",
    "coordinates",
    "email",
    "displayName",
    "description",
    "metadata",
    "targetId",
    forbiddenValue,
  ]) {
    assert(
      !serialized.includes(value),
      `${value} should not appear in summary`,
    );
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
