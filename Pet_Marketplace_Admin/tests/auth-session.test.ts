import {
  bootstrapAdminSession,
  createAdminAuthViewModel,
  createAdminApiClient,
  getSafeAdminIdentity,
  parseMeResponseDto,
  type AdminSessionStore,
} from "../src";

const adminMePayload = {
  createdAt: "2026-05-18T12:00:00.000Z",
  email: "admin@teste.com",
  id: "user-admin",
  locale: "en-GB",
  profiles: {
    tutor: {
      address: "must not be stored",
      displayName: "Admin Tutor",
      id: "tutor-profile",
      phone: "+44 0000",
      status: "active",
    },
  },
  roles: ["tutor", "admin"],
  status: "active",
  token: "must not be stored",
  updatedAt: "2026-05-18T12:05:00.000Z",
};

main().catch((error: unknown) => {
  throw error;
});

async function main(): Promise<void> {
  await testAdminAuthorized();
  await testUserWithoutAdminIsBlocked();
  await testUnauthorizedClearsSession();
  await testForbiddenClearsSession();
  await testBackendUnavailableBlocksRoute();
  testAdminAuthViewModelDecisions();
  testForbiddenFieldsAreNotStored();

  console.log("auth-session tests passed");
}

async function testAdminAuthorized(): Promise<void> {
  const store = createMemorySessionStore("access-token");
  const apiClient = createAdminApiClient({
    baseUrl: "/api/v1",
    fetchImpl: mockJsonResponse(200, adminMePayload),
    getAccessToken: store.getAccessToken,
  });

  const state = await bootstrapAdminSession({ apiClient, sessionStore: store });

  assert(state.status === "authenticated", "admin role should authenticate");
  assert(state.user.email === "admin@teste.com", "safe email should be stored");
  const safeIdentity = getSafeAdminIdentity(state.user);

  assert(safeIdentity.roles.includes("admin"), "safe roles should be exposed");
  assert(safeIdentity.status === "active", "safe status should be exposed");
  assert(safeIdentity.locale === "en-GB", "safe locale should be exposed");
}

async function testUserWithoutAdminIsBlocked(): Promise<void> {
  const store = createMemorySessionStore("access-token");
  const apiClient = createAdminApiClient({
    fetchImpl: mockJsonResponse(200, {
      ...adminMePayload,
      roles: ["tutor"],
    }),
    getAccessToken: store.getAccessToken,
  });

  const state = await bootstrapAdminSession({ apiClient, sessionStore: store });

  assert(state.status === "forbidden", "non-admin role should be blocked");
  assert(store.wasCleared === false, "valid non-admin session stays available");
}

async function testUnauthorizedClearsSession(): Promise<void> {
  const store = createMemorySessionStore("expired-token");
  const apiClient = createAdminApiClient({
    fetchImpl: mockJsonResponse(401, {
      error: { code: "UNAUTHENTICATED", message: "Unauthenticated." },
    }),
    getAccessToken: store.getAccessToken,
  });

  const state = await bootstrapAdminSession({ apiClient, sessionStore: store });

  assert(state.status === "unauthenticated", "401 should unauthenticate");
  assert(store.wasCleared === true, "401 should clear stored session");
}

async function testForbiddenClearsSession(): Promise<void> {
  const store = createMemorySessionStore("forbidden-token");
  const apiClient = createAdminApiClient({
    fetchImpl: mockJsonResponse(403, {
      error: { code: "FORBIDDEN", message: "Forbidden." },
    }),
    getAccessToken: store.getAccessToken,
  });

  const state = await bootstrapAdminSession({ apiClient, sessionStore: store });

  assert(state.status === "forbidden", "403 should block admin access");
  assert(store.wasCleared === true, "403 should clear stored admin session");
}

async function testBackendUnavailableBlocksRoute(): Promise<void> {
  const store = createMemorySessionStore("access-token");
  const apiClient = createAdminApiClient({
    fetchImpl: async () => {
      throw new Error("network down");
    },
    getAccessToken: store.getAccessToken,
  });

  const state = await bootstrapAdminSession({ apiClient, sessionStore: store });

  assert(
    state.status === "backend_unavailable",
    "backend outage should block protected routes",
  );
  assert(store.wasCleared === false, "backend outage should not erase token");
}

function testAdminAuthViewModelDecisions(): void {
  const admin = parseMeResponseDto(adminMePayload);
  const authenticated = createAdminAuthViewModel({
    status: "authenticated",
    user: admin,
  });
  const forbidden = createAdminAuthViewModel({
    status: "forbidden",
    user: parseMeResponseDto({ ...adminMePayload, roles: ["tutor"] }),
  });
  const unauthenticated = createAdminAuthViewModel({
    status: "unauthenticated",
  });
  const backendUnavailable = createAdminAuthViewModel({
    message: "Backend is unavailable.",
    status: "backend_unavailable",
  });
  const loading = createAdminAuthViewModel({ status: "loading" });
  const error = createAdminAuthViewModel({
    message: "Unexpected bootstrap error.",
    status: "error",
  });

  assert(
    authenticated.canAccessAdmin === true,
    "authenticated admin should access admin",
  );
  assert(
    authenticated.safeUserIdentity?.email === "admin@teste.com",
    "authenticated identity should expose email",
  );
  assert(
    authenticated.safeUserIdentity?.status === "active",
    "authenticated identity should expose status",
  );
  assert(
    authenticated.safeUserIdentity?.locale === "en-GB",
    "authenticated identity should expose locale",
  );
  assert(forbidden.canAccessAdmin === false, "forbidden cannot access admin");
  assert(forbidden.shouldShowForbidden === true, "forbidden should show block");
  assert(
    unauthenticated.shouldRedirectToLogin === true,
    "unauthenticated should redirect to login",
  );
  assert(
    backendUnavailable.shouldShowBackendUnavailable === true,
    "backend outage should show unavailable state",
  );
  assert(
    backendUnavailable.safeUserIdentity === undefined,
    "backend outage should not invent user identity",
  );
  assert(loading.isLoading === true, "loading should be explicit");
  assert(error.canAccessAdmin === false, "generic errors should block admin");
}

function testForbiddenFieldsAreNotStored(): void {
  const user = parseMeResponseDto(adminMePayload);
  const serialized = JSON.stringify(user);

  assert(!("token" in user), "token should not be part of /me DTO");
  assert(!serialized.includes("must not be stored"), "forbidden data dropped");
  assert(!serialized.includes("phone"), "phone should not be stored");
  assert(!serialized.includes("address"), "address should not be stored");
  assert(!serialized.includes("coordinates"), "coordinates should not be stored");
  assert(Array.isArray(user.roles), "roles should be an array from backend");

  const identity = createAdminAuthViewModel({
    status: "authenticated",
    user,
  }).safeUserIdentity;

  assert(identity !== undefined, "safe identity should exist for admin");
  assert(!("token" in identity), "safe identity should not expose token");
  assert(!("phone" in identity), "safe identity should not expose phone");
  assert(!("address" in identity), "safe identity should not expose address");
  assert(!("location" in identity), "safe identity should not expose location");
  assert(
    !("coordinates" in identity),
    "safe identity should not expose coordinates",
  );
}

function mockJsonResponse(status: number, body: unknown) {
  return async (
    _input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const headers = new Headers(init?.headers);

    if (status === 200) {
      assert(
        headers.get("Authorization") === "Bearer access-token" ||
          headers.get("Authorization") === "Bearer expired-token" ||
          headers.get("Authorization") === "Bearer forbidden-token",
        "Bearer token should be sent without exposing it elsewhere",
      );
    }

    return new Response(JSON.stringify(body), {
      headers: { "Content-Type": "application/json" },
      status,
    });
  };
}

function createMemorySessionStore(
  initialToken: string | null,
): AdminSessionStore & {
  readonly wasCleared: boolean;
} {
  let token = initialToken;
  let wasCleared = false;

  return {
    clear: () => {
      token = null;
      wasCleared = true;
    },
    getAccessToken: () => token,
    get wasCleared() {
      return wasCleared;
    },
  };
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
