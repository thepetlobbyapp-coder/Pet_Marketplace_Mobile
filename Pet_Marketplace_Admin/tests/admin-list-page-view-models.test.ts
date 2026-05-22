import {
  ADMIN_LIST_PAGE_ERROR_MESSAGE,
  createAdminListPageLoadingState,
  getAdminListPageDefinition,
  loadAdminListPageViewModel,
  type AdminListPageId,
  type AdminResourceClient,
} from "../src";

const forbiddenValue = "must not appear in list page state";

main().catch((error: unknown) => {
  throw error;
});

async function main(): Promise<void> {
  testLoadingState();
  await testReadyStatesCallExpectedClientMethods();
  await testErrorStateIsGeneric();

  console.log("admin-list-page-view-models tests passed");
}

function testLoadingState(): void {
  const loading = createAdminListPageLoadingState("users");

  assert(loading.status === "loading", "loading state should be explicit");
  assert(loading.page.id === "users", "loading state should include page id");
  assert(loading.page.path === "/admin/users", "loading state should include path");
  assertSafeState(loading);
}

async function testReadyStatesCallExpectedClientMethods(): Promise<void> {
  const pageExpectations: readonly {
    readonly pageId: AdminListPageId;
    readonly expectedCall: string;
    readonly expectedColumnKeys: string;
  }[] = [
    {
      expectedCall: "users",
      expectedColumnKeys: "email,roles,status,createdAt",
      pageId: "users",
    },
    {
      expectedCall: "providers",
      expectedColumnKeys: "displayName,status,serviceCount,createdAt",
      pageId: "providers",
    },
    {
      expectedCall: "bookings",
      expectedColumnKeys: "serviceType,status,startsAt,participantCount",
      pageId: "bookings",
    },
    {
      expectedCall: "reports",
      expectedColumnKeys: "category,status,targetType,createdAt",
      pageId: "reports",
    },
    {
      expectedCall: "reviews",
      expectedColumnKeys: "rating,status,reportCount,createdAt",
      pageId: "reviews",
    },
    {
      expectedCall: "auditLogs",
      expectedColumnKeys: "action,actorEmail,targetType,createdAt",
      pageId: "auditLogs",
    },
  ];

  for (const expectation of pageExpectations) {
    const calls: string[] = [];
    const client = createMockClient(calls);
    const state = await loadAdminListPageViewModel(client, expectation.pageId);

    assert(state.status === "ready", `${expectation.pageId} should be ready`);
    assert(
      state.page === getAdminListPageDefinition(expectation.pageId),
      `${expectation.pageId} should reuse stable page definition`,
    );
    assert(
      calls.join(",") === expectation.expectedCall,
      `${expectation.pageId} should call only its resource loader`,
    );
    assert(
      state.table.columns.map((column) => column.key).join(",") ===
        expectation.expectedColumnKeys,
      `${expectation.pageId} should expose expected table columns`,
    );
    assert(state.table.rows.length === 1, `${expectation.pageId} should map rows`);
    assertSafeState(state);
  }
}

async function testErrorStateIsGeneric(): Promise<void> {
  const client = createMockClient([], true);
  const state = await loadAdminListPageViewModel(client, "users");

  assert(state.status === "error", "failed load should return error state");
  assert(
    state.message === ADMIN_LIST_PAGE_ERROR_MESSAGE,
    "failed load should use generic message",
  );
  assert(state.page.id === "users", "error state should retain page definition");
  assertSafeState(state);
}

function createMockClient(calls: string[], shouldFail = false): AdminResourceClient {
  return {
    listAdminAuditLogs: async () => {
      calls.push("auditLogs");
      return [
        {
          action: "user.blocked",
          actorEmail: "admin@teste.com",
          createdAt: "2026-05-18T12:00:00.000Z",
          id: "audit-1",
          targetType: "user",
        },
      ];
    },
    listAdminBookings: async () => {
      calls.push("bookings");
      return [
        {
          createdAt: "2026-05-18T12:00:00.000Z",
          id: "booking-1",
          participantCount: 2,
          serviceType: "dog_walking",
          status: "requested",
          updatedAt: "2026-05-18T12:05:00.000Z",
        },
      ];
    },
    listAdminProviders: async () => {
      calls.push("providers");
      return [
        {
          createdAt: "2026-05-18T12:00:00.000Z",
          displayName: "Provider",
          id: "provider-1",
          serviceCount: 3,
          status: "active",
          updatedAt: "2026-05-18T12:05:00.000Z",
        },
      ];
    },
    listAdminReports: async () => {
      calls.push("reports");
      return [
        {
          category: "safety_concern",
          createdAt: "2026-05-18T12:00:00.000Z",
          id: "report-1",
          status: "open",
          targetType: "booking",
          updatedAt: "2026-05-18T12:05:00.000Z",
        },
      ];
    },
    listAdminReviews: async () => {
      calls.push("reviews");
      return [
        {
          createdAt: "2026-05-18T12:00:00.000Z",
          id: "review-1",
          rating: 4,
          reportCount: 1,
          status: "reported",
          updatedAt: "2026-05-18T12:05:00.000Z",
        },
      ];
    },
    listAdminUsers: async () => {
      calls.push("users");

      if (shouldFail) {
        throw new Error(`raw payload ${forbiddenValue}`);
      }

      return [
        {
          createdAt: "2026-05-18T12:00:00.000Z",
          displayName: forbiddenValue,
          email: "admin@teste.com",
          id: "user-1",
          roles: ["admin", "tutor"],
          status: "active",
          updatedAt: "2026-05-18T12:05:00.000Z",
        },
      ];
    },
  };
}

function assertSafeState(state: unknown): void {
  const serialized = JSON.stringify(state);

  for (const value of [
    "token",
    "phone",
    "address",
    "location",
    "coordinates",
    "serviceRole",
    "rawMetadata",
    "metadata",
    "raw payload",
    forbiddenValue,
  ]) {
    assert(!serialized.includes(value), `${value} should not appear`);
  }
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
