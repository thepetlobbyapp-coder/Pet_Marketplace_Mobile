import {
  AdminApiError,
  BackendUnavailableError,
  createAdminResourceClient,
  type FetchLike,
} from "../src";

const accessToken = "resource-client-token";
const forbiddenValue = "must not be returned";

main().catch((error: unknown) => {
  throw error;
});

async function main(): Promise<void> {
  await testDashboardEndpointSendsBearerAndReturnsSafeShape();
  await testListEndpointsSendBearerAndReturnSafeShapes();
  await testListEndpointSendsCursorPaginationParams();
  await testUpdateReportSendsPatchAndReturnsSafeShape();
  await testUpdateUserStatusSendsPatchAndReturnsSafeShape();
  await testAdminApiErrorsArePreserved();
  await testBackendUnavailableErrorIsPreserved();

  console.log("admin-resource-client tests passed");
}

async function testDashboardEndpointSendsBearerAndReturnsSafeShape(): Promise<void> {
  const requestedPaths: string[] = [];
  const fetchImpl: FetchLike = async (input, init) => {
    const url = String(input);
    const path = url.replace("/api/v1", "");
    const headers = new Headers(init?.headers);

    assert(path === "/admin/dashboard", "dashboard path should be stable");
    assert(
      headers.get("Authorization") === `Bearer ${accessToken}`,
      "Bearer auth should be sent",
    );
    assert(init?.method === "GET", "dashboard request should be GET");
    requestedPaths.push(path);

    return jsonResponse(200, payloadByPath(path));
  };
  const client = createAdminResourceClient({
    fetchImpl,
    getAccessToken: () => accessToken,
  });

  const dashboard = await client.getAdminDashboardSummary();

  assert(
    requestedPaths.join(",") === "/admin/dashboard",
    "dashboard should call aggregate endpoint",
  );
  assert(dashboard.totalUsers === 8, "dashboard parses total users");
  assert(dashboard.totalTutors === 7, "dashboard parses total tutors");
  assert(dashboard.totalProviders === 6, "dashboard parses providers");
  assert(dashboard.openReports === 5, "dashboard parses open reports");
  assert(dashboard.blockedUsers === 1, "dashboard parses blocked users");
  assert(
    dashboard.bookingsByStatus.requested === 4,
    "dashboard parses booking counts",
  );
  assertNoForbiddenFieldsOrValues([dashboard]);
}

async function testUpdateReportSendsPatchAndReturnsSafeShape(): Promise<void> {
  const requestedBodies: unknown[] = [];
  const fetchImpl: FetchLike = async (input, init) => {
    const url = String(input);
    const path = url.replace("/api/v1", "");
    const headers = new Headers(init?.headers);

    assert(
      path === "/admin/reports/report-1",
      "report update path should be stable",
    );
    assert(
      headers.get("Authorization") === `Bearer ${accessToken}`,
      "Bearer auth should be sent",
    );
    assert(
      headers.get("Content-Type") === "application/json",
      "PATCH should send JSON",
    );
    assert(init?.method === "PATCH", "report update should use PATCH");
    requestedBodies.push(JSON.parse(String(init?.body)));

    return jsonResponse(
      200,
      withForbiddenFields({
        category: "safety_concern",
        createdAt: "2026-05-18T12:00:00.000Z",
        id: "report-1",
        status: "open",
        targetType: "booking",
        updatedAt: "2026-05-18T12:05:00.000Z",
      }),
    );
  };
  const client = createAdminResourceClient({
    fetchImpl,
    getAccessToken: () => accessToken,
  });

  const report = await client.updateAdminReport("report-1", {
    internalNote: "Internal note",
    status: "in_review",
  });

  assert(report.id === "report-1", "report update should parse response id");
  const firstBody = requestedBodies[0] as { status?: string } | undefined;
  assert(firstBody?.status === "in_review", "status should be sent");
  assertNoForbiddenFieldsOrValues([report]);
}

async function testUpdateUserStatusSendsPatchAndReturnsSafeShape(): Promise<void> {
  const requestedBodies: unknown[] = [];
  const fetchImpl: FetchLike = async (input, init) => {
    const url = String(input);
    const path = url.replace("/api/v1", "");
    const headers = new Headers(init?.headers);

    assert(
      path === "/admin/users/user-1/status",
      "user status update path should be stable",
    );
    assert(
      headers.get("Authorization") === `Bearer ${accessToken}`,
      "Bearer auth should be sent",
    );
    assert(
      headers.get("Content-Type") === "application/json",
      "PATCH should send JSON",
    );
    assert(init?.method === "PATCH", "user update should use PATCH");
    requestedBodies.push(JSON.parse(String(init?.body)));

    return jsonResponse(
      200,
      withForbiddenFields({
        createdAt: "2026-05-18T12:00:00.000Z",
        email: "user@example.test",
        id: "user-1",
        roles: ["tutor"],
        status: "blocked",
        updatedAt: "2026-05-18T12:05:00.000Z",
      }),
    );
  };
  const client = createAdminResourceClient({
    fetchImpl,
    getAccessToken: () => accessToken,
  });

  const user = await client.updateAdminUserStatus("user-1", {
    status: "blocked",
  });

  assert(user.id === "user-1", "user update should parse response id");
  const firstBody = requestedBodies[0] as { status?: string } | undefined;
  assert(firstBody?.status === "blocked", "status should be sent");
  assertNoForbiddenFieldsOrValues([user]);
}

async function testListEndpointsSendBearerAndReturnSafeShapes(): Promise<void> {
  const requestedPaths: string[] = [];
  const fetchImpl: FetchLike = async (input, init) => {
    const url = String(input);
    const path = url.replace("/api/v1", "");
    const headers = new Headers(init?.headers);

    assert(
      headers.get("Authorization") === `Bearer ${accessToken}`,
      "Bearer auth should be sent",
    );
    assert(init?.method === "GET", "admin resource requests should be GET");
    requestedPaths.push(path);

    return jsonResponse(200, payloadByPath(path));
  };
  const client = createAdminResourceClient({
    fetchImpl,
    getAccessToken: () => accessToken,
  });

  const users = await client.listAdminUsers();
  const providers = await client.listAdminProviders();
  const bookings = await client.listAdminBookings();
  const reports = await client.listAdminReports();
  const auditLogs = await client.listAdminAuditLogs();

  assert(
    requestedPaths.join(",") ===
      "/admin/users,/admin/providers,/admin/bookings,/admin/reports,/admin/audit-logs",
    "resource client should call backend-backed admin list endpoints",
  );
  assert(users.items[0]?.email === "admin@teste.com", "users expose email");
  assert(users.items[0]?.roles.includes("admin"), "users expose roles");
  assert(providers.items[0]?.serviceCount === 2, "providers expose counts");
  assert(
    bookings.items[0]?.service === "Dog walking",
    "bookings expose service",
  );
  assert(
    reports.items[0]?.category === "safety_concern",
    "reports expose category",
  );
  assert(
    auditLogs.items[0]?.action === "report.closed",
    "audit logs expose action",
  );
  assert(reports.nextCursor === "cursor-2", "reports keep backend cursor");
  assertNoForbiddenFieldsOrValues([
    users,
    providers,
    bookings,
    reports,
    auditLogs,
  ]);
}

async function testListEndpointSendsCursorPaginationParams(): Promise<void> {
  const requestedPaths: string[] = [];
  const fetchImpl: FetchLike = async (input) => {
    const url = String(input);
    const path = url.replace("/api/v1", "");
    requestedPaths.push(path);

    return jsonResponse(200, {
      items: [],
      nextCursor: null,
    });
  };
  const client = createAdminResourceClient({
    fetchImpl,
    getAccessToken: () => accessToken,
  });

  const bookingPage = await client.listAdminBookings({
    cursor: "cursor-2",
    limit: 20,
  });

  assert(
    requestedPaths[0] === "/admin/bookings?limit=20&cursor=cursor-2",
    "resource client should preserve cursor pagination query",
  );
  assert(bookingPage.nextCursor === null, "empty page should keep null cursor");
  assertNoForbiddenFieldsOrValues([bookingPage]);
}

async function testAdminApiErrorsArePreserved(): Promise<void> {
  const unauthorized = createAdminResourceClient({
    fetchImpl: async () =>
      jsonResponse(401, {
        error: { code: "UNAUTHENTICATED", message: "Unauthenticated." },
      }),
    getAccessToken: () => accessToken,
  });
  const forbidden = createAdminResourceClient({
    fetchImpl: async () =>
      jsonResponse(403, {
        error: { code: "FORBIDDEN", message: "Forbidden." },
      }),
    getAccessToken: () => accessToken,
  });

  await expectAdminApiError(
    () => unauthorized.listAdminUsers(),
    401,
    "UNAUTHENTICATED",
  );
  await expectAdminApiError(() => forbidden.listAdminUsers(), 403, "FORBIDDEN");
}

async function testBackendUnavailableErrorIsPreserved(): Promise<void> {
  const client = createAdminResourceClient({
    fetchImpl: async () => {
      throw new Error("network down");
    },
    getAccessToken: () => accessToken,
  });

  try {
    await client.listAdminUsers();
  } catch (error) {
    assert(
      error instanceof BackendUnavailableError,
      "network failures should become BackendUnavailableError",
    );
    return;
  }

  throw new Error("Expected BackendUnavailableError");
}

function payloadByPath(path: string): unknown {
  switch (path) {
    case "/admin/dashboard":
      return withForbiddenFields({
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
      });
    case "/admin/users":
      return {
        items: [
          withForbiddenFields({
            createdAt: "2026-05-18T12:00:00.000Z",
            email: "admin@teste.com",
            id: "user-1",
            roles: ["admin", "tutor"],
            status: "active",
            updatedAt: "2026-05-18T12:05:00.000Z",
          }),
        ],
        nextCursor: null,
      };
    case "/admin/providers":
      return {
        items: [
          withForbiddenFields({
            createdAt: "2026-05-18T12:00:00.000Z",
            displayName: "Provider",
            id: "provider-1",
            serviceCount: 2,
            status: "active",
            updatedAt: "2026-05-18T12:05:00.000Z",
          }),
        ],
        nextCursor: null,
      };
    case "/admin/bookings":
      return {
        items: [
          withForbiddenFields({
            createdAt: "2026-05-18T12:00:00.000Z",
            date: "2026-05-21",
            id: "booking-1",
            service: "Dog walking",
            status: "requested",
            timeSlotId: "09:00",
            updatedAt: "2026-05-18T12:05:00.000Z",
          }),
        ],
        nextCursor: null,
      };
    case "/admin/reports":
      return {
        items: [
          withForbiddenFields({
            category: "safety_concern",
            createdAt: "2026-05-18T12:00:00.000Z",
            id: "report-1",
            status: "open",
            targetType: "booking",
            updatedAt: "2026-05-18T12:05:00.000Z",
          }),
        ],
        nextCursor: "cursor-2",
      };
    case "/admin/audit-logs":
      return {
        items: [
          withForbiddenFields({
            action: "report.closed",
            actorUserId: "user-1",
            createdAt: "2026-05-18T12:00:00.000Z",
            id: "audit-1",
            targetId: "report-1",
            targetType: "report",
          }),
        ],
        nextCursor: null,
      };
    default:
      throw new Error(`Unexpected path ${path}`);
  }
}

function withForbiddenFields<T extends Record<string, unknown>>(item: T): T {
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

function jsonResponse(status: number, body: unknown): Response {
  return new Response(JSON.stringify(body), {
    headers: { "Content-Type": "application/json" },
    status,
  });
}

async function expectAdminApiError(
  action: () => Promise<unknown>,
  status: number,
  code: string,
): Promise<void> {
  try {
    await action();
  } catch (error) {
    assert(
      error instanceof AdminApiError,
      "API failures should keep AdminApiError",
    );
    assert(error.status === status, "AdminApiError should keep HTTP status");
    assert(error.code === code, "AdminApiError should keep backend code");
    return;
  }

  throw new Error(`Expected AdminApiError ${status}`);
}

function assertNoForbiddenFieldsOrValues(values: readonly unknown[]): void {
  const serialized = JSON.stringify(values);

  for (const field of [
    "token",
    "phone",
    "address",
    "location",
    "coordinates",
    "serviceRole",
    "service_role",
    "rawMetadata",
    "metadata",
  ]) {
    assert(!serialized.includes(`"${field}"`), `${field} should be discarded`);
  }

  assert(
    !serialized.includes(forbiddenValue),
    "forbidden payload values should be discarded",
  );
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
