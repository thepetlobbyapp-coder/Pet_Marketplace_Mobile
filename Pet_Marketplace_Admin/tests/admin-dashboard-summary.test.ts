import {
  ADMIN_DASHBOARD_SUMMARY_ERROR_MESSAGE,
  createAdminDashboardSummary,
  loadAdminDashboardSummary,
  type AdminAuditLogListItem,
  type AdminBookingListItem,
  type AdminProviderListItem,
  type AdminReportListItem,
  type AdminResourceClient,
  type AdminReviewListItem,
  type AdminUserListItem,
} from "../src";

const forbiddenValue = "must not appear in dashboard summary";

main().catch((error: unknown) => {
  throw error;
});

async function main(): Promise<void> {
  testSummaryCalculatesTotals();
  await testLoaderCallsEveryClientMethod();
  await testLoaderReturnsGenericError();

  console.log("admin-dashboard-summary tests passed");
}

function testSummaryCalculatesTotals(): void {
  const resources = createResources();
  const summary = createAdminDashboardSummary(resources);
  const serialized = JSON.stringify(summary);

  assert(summary.totalUsers === 4, "summary should count all users");
  assert(summary.totalProviders === 2, "summary should count providers");
  assert(summary.totalBookings === 3, "summary should count bookings");
  assert(
    summary.openReports === 2,
    "summary should count open/pending reports only",
  );
  assert(
    summary.reportedReviews === 2,
    "summary should count reported/hidden reviews only",
  );
  assert(
    summary.recentAuditLogCount === 2,
    "summary should count recent audit logs",
  );
  assert(
    summary.blockedOrSuspendedUsers === 2,
    "summary should count blocked/suspended users",
  );
  assertNoForbiddenDashboardPayload(serialized);
}

async function testLoaderCallsEveryClientMethod(): Promise<void> {
  const calls: string[] = [];
  const client = createMockClient(calls);
  const state = await loadAdminDashboardSummary(client);

  assert(state.status === "ready", "loader should return ready state");
  assert(
    calls.join(",") ===
      "users,providers,bookings,reports,reviews,auditLogs",
    "loader should call every resource client method",
  );
  assert(state.summary.totalUsers === 4, "loader should aggregate users");
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
  const resources = createResources();

  return {
    listAdminAuditLogs: async () => {
      calls.push("auditLogs");
      return resources.auditLogs;
    },
    listAdminBookings: async () => {
      calls.push("bookings");
      return resources.bookings;
    },
    listAdminProviders: async () => {
      calls.push("providers");
      return resources.providers;
    },
    listAdminReports: async () => {
      calls.push("reports");
      return resources.reports;
    },
    updateAdminReport: async () => resources.reports[0]!,
    listAdminReviews: async () => {
      calls.push("reviews");
      return resources.reviews;
    },
    listAdminUsers: async () => {
      calls.push("users");

      if (shouldFail) {
        throw new Error(`raw backend payload ${forbiddenValue}`);
      }

      return resources.users;
    },
  };
}

function createResources(): {
  readonly auditLogs: readonly AdminAuditLogListItem[];
  readonly bookings: readonly AdminBookingListItem[];
  readonly providers: readonly AdminProviderListItem[];
  readonly reports: readonly AdminReportListItem[];
  readonly reviews: readonly AdminReviewListItem[];
  readonly users: readonly AdminUserListItem[];
} {
  return {
    auditLogs: [
      {
        action: "user.blocked",
        actorEmail: "admin@teste.com",
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "audit-1",
        targetId: "user-2",
        targetType: "user",
      },
      {
        action: "report.closed",
        createdAt: "2026-05-18T12:10:00.000Z",
        id: "audit-2",
      },
    ],
    bookings: [
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "booking-1",
        status: "requested",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "booking-2",
        status: "accepted",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "booking-3",
        status: "completed",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
    ],
    providers: [
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "provider-1",
        serviceCount: 2,
        status: "active",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "provider-2",
        status: "inactive",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
    ],
    reports: [
      {
        category: "safety_concern",
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "report-1",
        status: "open",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        category: "abuse",
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "report-2",
        status: "pending",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        category: "spam",
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "report-3",
        status: "closed",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
    ],
    reviews: [
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "review-1",
        rating: 2,
        status: "reported",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "review-2",
        rating: 1,
        status: "hidden",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "review-3",
        rating: 5,
        status: "published",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
    ],
    users: [
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        email: "admin@teste.com",
        id: "user-1",
        roles: ["admin"],
        status: "active",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        email: "blocked@example.com",
        id: "user-2",
        roles: ["tutor"],
        status: "blocked",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        email: "suspended@example.com",
        id: "user-3",
        roles: ["provider"],
        status: "suspended",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
      {
        createdAt: "2026-05-18T12:00:00.000Z",
        displayName: forbiddenValue,
        email: "ok@example.com",
        id: "user-4",
        roles: ["tutor"],
        status: "active",
        updatedAt: "2026-05-18T12:05:00.000Z",
      },
    ],
  };
}

function assertNoForbiddenDashboardPayload(serialized: string): void {
  for (const value of [
    "token",
    "phone",
    "address",
    "location",
    "coordinates",
    forbiddenValue,
  ]) {
    assert(!serialized.includes(value), `${value} should not appear in summary`);
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
