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
  await testListEndpointsSendBearerAndReturnSafeShapes();
  await testAdminApiErrorsArePreserved();
  await testBackendUnavailableErrorIsPreserved();

  console.log("admin-resource-client tests passed");
}

async function testListEndpointsSendBearerAndReturnSafeShapes(): Promise<void> {
  const requestedPaths: string[] = [];
  const fetchImpl: FetchLike = async (input, init) => {
    const url = String(input);
    const path = url.replace("/api/v1", "");
    const headers = new Headers(init?.headers);

    assert(headers.get("Authorization") === `Bearer ${accessToken}`, "Bearer auth should be sent");
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
  const reviews = await client.listAdminReviews();
  const auditLogs = await client.listAdminAuditLogs();

  assert(
    requestedPaths.join(",") ===
      "/admin/users,/admin/providers,/admin/bookings,/admin/reports,/admin/reviews,/admin/audit-logs",
    "resource client should call stable planned endpoints",
  );
  assert(users[0]?.email === "admin@teste.com", "users expose safe email");
  assert(users[0]?.roles.includes("admin"), "users expose safe roles");
  assert(providers[0]?.serviceCount === 3, "providers expose safe counts");
  assert(bookings[0]?.participantCount === 2, "bookings expose safe counts");
  assert(reports[0]?.category === "safety_concern", "reports expose category");
  assert(reviews[0]?.rating === 4, "reviews expose rating");
  assert(auditLogs[0]?.action === "user.blocked", "audit logs expose action");
  assertNoForbiddenFieldsOrValues([
    users,
    providers,
    bookings,
    reports,
    reviews,
    auditLogs,
  ]);
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
  await expectAdminApiError(
    () => forbidden.listAdminUsers(),
    403,
    "FORBIDDEN",
  );
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
    case "/admin/users":
      return {
        items: [
          withForbiddenFields({
            createdAt: "2026-05-18T12:00:00.000Z",
            displayName: "Admin User",
            email: "admin@teste.com",
            id: "user-1",
            roles: ["tutor", "admin"],
            status: "active",
            updatedAt: "2026-05-18T12:05:00.000Z",
          }),
        ],
      };
    case "/admin/providers":
      return {
        items: [
          withForbiddenFields({
            createdAt: "2026-05-18T12:00:00.000Z",
            displayName: "Provider",
            id: "provider-1",
            serviceCount: 3,
            status: "active",
            updatedAt: "2026-05-18T12:05:00.000Z",
            userId: "user-provider-1",
          }),
        ],
      };
    case "/admin/bookings":
      return {
        items: [
          withForbiddenFields({
            createdAt: "2026-05-18T12:00:00.000Z",
            endsAt: "2026-05-20T11:00:00.000Z",
            id: "booking-1",
            participantCount: 2,
            serviceType: "dog_walking",
            startsAt: "2026-05-20T10:00:00.000Z",
            status: "requested",
            updatedAt: "2026-05-18T12:05:00.000Z",
          }),
        ],
      };
    case "/admin/reports":
      return [
        withForbiddenFields({
          category: "safety_concern",
          createdAt: "2026-05-18T12:00:00.000Z",
          id: "report-1",
          status: "open",
          targetType: "booking",
          updatedAt: "2026-05-18T12:05:00.000Z",
        }),
      ];
    case "/admin/reviews":
      return {
        items: [
          withForbiddenFields({
            createdAt: "2026-05-18T12:00:00.000Z",
            id: "review-1",
            rating: 4,
            reportCount: 1,
            status: "reported",
            updatedAt: "2026-05-18T12:05:00.000Z",
          }),
        ],
      };
    case "/admin/audit-logs":
      return {
        items: [
          withForbiddenFields({
            action: "user.blocked",
            actorEmail: "admin@teste.com",
            createdAt: "2026-05-18T12:00:00.000Z",
            id: "audit-1",
            targetId: "user-1",
            targetType: "user",
          }),
        ],
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
    assert(error instanceof AdminApiError, "API failures should keep AdminApiError");
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
