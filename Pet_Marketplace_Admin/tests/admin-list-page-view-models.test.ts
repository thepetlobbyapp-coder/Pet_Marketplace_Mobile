import {
  ADMIN_LIST_PAGE_ERROR_MESSAGE,
  createAdminListPageLoadingState,
  getAdminListPageDefinition,
  loadAdminListPageViewModel,
  type AdminListPageId,
  type AdminResourceClient,
  type AdminResourceListParams,
} from "../src";

const forbiddenValue = "must not appear in list page state";

main().catch((error: unknown) => {
  throw error;
});

async function main(): Promise<void> {
  testLoadingState();
  await testReadyStatesCallExpectedClientMethods();
  await testReadyStatePreservesPagination();
  await testErrorStateIsGeneric();

  console.log("admin-list-page-view-models tests passed");
}

function testLoadingState(): void {
  const loading = createAdminListPageLoadingState("reports");

  assert(loading.status === "loading", "loading state should be explicit");
  assert(loading.page.id === "reports", "loading state should include page id");
  assert(
    loading.page.path === "/admin/reports",
    "loading state should include path",
  );
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
      expectedColumnKeys: "service,status,date,timeSlotId,createdAt",
      pageId: "bookings",
    },
    {
      expectedCall: "reports",
      expectedColumnKeys: "category,status,targetType,createdAt",
      pageId: "reports",
    },
    {
      expectedCall: "auditLogs",
      expectedColumnKeys: "action,actorUserId,targetType,createdAt",
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
    assert(
      state.table.rows.length === 1,
      `${expectation.pageId} should map rows`,
    );
    assert(state.items[0]?.id, "ready state should keep safe items");
    assertSafeState(state);
  }
}

async function testReadyStatePreservesPagination(): Promise<void> {
  const calls: string[] = [];
  const state = await loadAdminListPageViewModel(
    createMockClient(calls),
    "reports",
    {
      cursor: "cursor-1",
      limit: 20,
    },
  );

  assert(state.status === "ready", "paginated reports should be ready");
  assert(
    calls[0] === "reports:cursor-1:20",
    "list page should forward cursor pagination params",
  );
  assert(
    state.pagination.cursor === "cursor-1",
    "ready state should expose current cursor",
  );
  assert(
    state.pagination.nextCursor === "cursor-2",
    "ready state should expose next cursor",
  );
  assert(
    state.pagination.isAfterFirstPage,
    "current cursor should mark page after first",
  );
  assertSafeState(state);
}

async function testErrorStateIsGeneric(): Promise<void> {
  const client = createMockClient([], true);
  const state = await loadAdminListPageViewModel(client, "reports");

  assert(state.status === "error", "failed load should return error state");
  assert(
    state.message === ADMIN_LIST_PAGE_ERROR_MESSAGE,
    "failed load should use generic message",
  );
  assert(
    state.page.id === "reports",
    "error state should retain page definition",
  );
  assertSafeState(state);
}

function createMockClient(
  calls: string[],
  shouldFail = false,
): AdminResourceClient {
  return {
    getAdminDashboardSummary: async () => ({
      blockedUsers: 0,
      bookingsByStatus: {
        cancelled: 0,
        completed: 0,
        confirmed: 0,
        requested: 0,
      },
      openReports: 0,
      totalProviders: 0,
      totalTutors: 0,
      totalUsers: 0,
    }),
    listAdminAuditLogs: async (params: AdminResourceListParams = {}) => {
      recordCall(calls, "auditLogs", params);
      if (shouldFail) {
        throw new Error(`raw payload ${forbiddenValue}`);
      }

      return {
        items: [
          {
            action: "trust_safety.report_status_updated",
            actorUserId: "user-1",
            createdAt: "2026-05-18T12:00:00.000Z",
            id: "audit-1",
            targetId: "report-1",
            targetType: "report",
          },
        ],
        nextCursor: params.cursor ? "cursor-2" : null,
      };
    },
    listAdminBookings: async (params: AdminResourceListParams = {}) => {
      recordCall(calls, "bookings", params);
      if (shouldFail) {
        throw new Error(`raw payload ${forbiddenValue}`);
      }

      return {
        items: [
          {
            createdAt: "2026-05-18T12:00:00.000Z",
            date: "2026-05-21",
            id: "booking-1",
            service: "Dog walking",
            status: "requested",
            timeSlotId: "09:00",
            updatedAt: "2026-05-18T12:05:00.000Z",
          },
        ],
        nextCursor: params.cursor ? "cursor-2" : null,
      };
    },
    listAdminProviders: async (params: AdminResourceListParams = {}) => {
      recordCall(calls, "providers", params);
      if (shouldFail) {
        throw new Error(`raw payload ${forbiddenValue}`);
      }

      return {
        items: [
          {
            createdAt: "2026-05-18T12:00:00.000Z",
            displayName: "Provider",
            id: "provider-1",
            serviceCount: 2,
            status: "active",
            updatedAt: "2026-05-18T12:05:00.000Z",
          },
        ],
        nextCursor: params.cursor ? "cursor-2" : null,
      };
    },
    listAdminReports: async (params: AdminResourceListParams = {}) => {
      recordCall(calls, "reports", params);
      if (shouldFail) {
        throw new Error(`raw payload ${forbiddenValue}`);
      }

      return {
        items: [
          {
            category: "safety_concern",
            createdAt: "2026-05-18T12:00:00.000Z",
            id: "report-1",
            status: "open",
            targetType: "booking",
            updatedAt: "2026-05-18T12:05:00.000Z",
          },
        ],
        nextCursor: params.cursor ? "cursor-2" : null,
      };
    },
    listAdminUsers: async (params: AdminResourceListParams = {}) => {
      recordCall(calls, "users", params);
      if (shouldFail) {
        throw new Error(`raw payload ${forbiddenValue}`);
      }

      return {
        items: [
          {
            createdAt: "2026-05-18T12:00:00.000Z",
            email: "admin@teste.com",
            id: "user-1",
            roles: ["admin"],
            status: "active",
            updatedAt: "2026-05-18T12:05:00.000Z",
          },
        ],
        nextCursor: params.cursor ? "cursor-2" : null,
      };
    },
    listAdminReviews: async () => ({ items: [], nextCursor: null }),
    updateAdminReport: async () => ({
      category: "safety_concern",
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "report-1",
      status: "in_review",
      targetType: "booking",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
    updateAdminReviewStatus: async () => ({
      bookingId: "booking-1",
      createdAt: "2026-05-18T12:00:00.000Z",
      id: "review-1",
      rating: 5,
      status: "hidden_by_admin",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
    updateAdminUserStatus: async () => ({
      createdAt: "2026-05-18T12:00:00.000Z",
      email: "admin@teste.com",
      id: "user-1",
      roles: ["admin"],
      status: "blocked",
      updatedAt: "2026-05-18T12:05:00.000Z",
    }),
  };
}

function recordCall(
  calls: string[],
  name: string,
  params: AdminResourceListParams,
): void {
  calls.push(
    params.cursor || params.limit
      ? `${name}:${params.cursor ?? ""}:${params.limit ?? ""}`
      : name,
  );
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
