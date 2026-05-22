import {
  clearAdminSession,
  createAdminAuthViewModel,
  createAdminConfig,
  createPostLoginRedirect,
  persistAdminAccessToken,
  parseMeResponseDto,
  type AdminSessionStore,
} from "../src";

const secretToken = "test-access-token-must-not-return";

const adminMePayload = {
  createdAt: "2026-05-18T12:00:00.000Z",
  email: "admin@teste.com",
  id: "user-admin",
  locale: "en-GB",
  roles: ["tutor", "admin"],
  status: "active",
  updatedAt: "2026-05-18T12:05:00.000Z",
};

main().catch((error: unknown) => {
  throw error;
});

async function main(): Promise<void> {
  testAdminConfigDefaultsAndOverrides();
  await testPersistAdminAccessTokenDoesNotExposeToken();
  await testClearAdminSession();
  testPostLoginRedirects();
  testBlockedPostLoginStatesDoNotReachAdmin();

  console.log("admin-login tests passed");
}

function testAdminConfigDefaultsAndOverrides(): void {
  const defaults = createAdminConfig();
  const overrides = createAdminConfig({
    adminHomePath: "/ops",
    apiBaseUrl: "/internal/api/v1",
    loginPath: "/sign-in",
  });
  const emptyOverrides = createAdminConfig({
    adminHomePath: " ",
    apiBaseUrl: "",
    loginPath: "   ",
  });

  assert(defaults.apiBaseUrl === "/api/v1", "default api base should match");
  assert(defaults.loginPath === "/login", "default login path should match");
  assert(defaults.adminHomePath === "/admin", "default admin path should match");
  assert(overrides.apiBaseUrl === "/internal/api/v1", "api override works");
  assert(overrides.loginPath === "/sign-in", "login override works");
  assert(overrides.adminHomePath === "/ops", "admin home override works");
  assert(
    emptyOverrides.adminHomePath === "/admin" &&
      emptyOverrides.apiBaseUrl === "/api/v1" &&
      emptyOverrides.loginPath === "/login",
    "empty overrides should fall back safely",
  );
}

async function testPersistAdminAccessTokenDoesNotExposeToken(): Promise<void> {
  const store = createMemorySessionStore();
  const result = await persistAdminAccessToken(store, secretToken);

  assert(result.status === "persisted", "persist should report status only");
  assert(store.currentToken === secretToken, "token should be stored internally");
  assert(
    !JSON.stringify(result).includes(secretToken),
    "persist result should not expose token",
  );
}

async function testClearAdminSession(): Promise<void> {
  const store = createMemorySessionStore(secretToken);
  const result = await clearAdminSession(store);

  assert(result.status === "cleared", "clear should report status only");
  assert(store.currentToken === null, "token should be cleared");
  assert(
    !JSON.stringify(result).includes(secretToken),
    "clear result should not expose token",
  );
}

function testPostLoginRedirects(): void {
  const admin = parseMeResponseDto(adminMePayload);
  const authenticated = createAdminAuthViewModel({
    status: "authenticated",
    user: admin,
  });
  const unauthenticated = createAdminAuthViewModel({
    status: "unauthenticated",
  });
  const defaultAdminRedirect = createPostLoginRedirect(authenticated);
  const customAdminRedirect = createPostLoginRedirect(authenticated, {
    adminHomePath: "/ops",
  });
  const defaultLoginRedirect = createPostLoginRedirect(unauthenticated);
  const customLoginRedirect = createPostLoginRedirect(unauthenticated, {
    loginPath: "/sign-in",
  });

  assert(
    defaultAdminRedirect.kind === "redirect" &&
      defaultAdminRedirect.path === "/admin",
    "authenticated admin should redirect to admin home",
  );
  assert(
    customAdminRedirect.kind === "redirect" &&
      customAdminRedirect.path === "/ops",
    "admin redirect should respect safe override",
  );
  assert(
    defaultLoginRedirect.kind === "redirect" &&
      defaultLoginRedirect.path === "/login",
    "unauthenticated should redirect to login",
  );
  assert(
    customLoginRedirect.kind === "redirect" &&
      customLoginRedirect.path === "/sign-in",
    "login redirect should respect safe override",
  );
  assertNoTokenOrSecret([
    defaultAdminRedirect,
    customAdminRedirect,
    defaultLoginRedirect,
    customLoginRedirect,
  ]);
}

function testBlockedPostLoginStatesDoNotReachAdmin(): void {
  const forbidden = createPostLoginRedirect(
    createAdminAuthViewModel({ status: "forbidden" }),
  );
  const backendUnavailable = createPostLoginRedirect(
    createAdminAuthViewModel({
      message: "Backend is unavailable.",
      status: "backend_unavailable",
    }),
  );
  const loading = createPostLoginRedirect(
    createAdminAuthViewModel({ status: "loading" }),
  );
  const error = createPostLoginRedirect(
    createAdminAuthViewModel({
      message: "Could not bootstrap the admin session.",
      status: "error",
    }),
  );

  assert(
    forbidden.kind === "blocked" && forbidden.reason === "forbidden",
    "forbidden should not redirect to admin",
  );
  assert(
    backendUnavailable.kind === "blocked" &&
      backendUnavailable.reason === "backend_unavailable",
    "backend outage should not redirect to admin",
  );
  assert(
    loading.kind === "blocked" && loading.reason === "loading",
    "loading should not redirect to admin",
  );
  assert(
    error.kind === "blocked" && error.reason === "error",
    "generic error should not redirect to admin",
  );
  assertNoTokenOrSecret([forbidden, backendUnavailable, loading, error]);
}

function createMemorySessionStore(
  initialToken: string | null = null,
): AdminSessionStore & {
  readonly currentToken: string | null;
} {
  let token = initialToken;

  return {
    clear: () => {
      token = null;
    },
    getAccessToken: () => token,
    setAccessToken: (accessToken: string) => {
      token = accessToken;
    },
    get currentToken() {
      return token;
    },
  };
}

function assertNoTokenOrSecret(values: readonly unknown[]): void {
  const serialized = JSON.stringify(values);

  assert(!serialized.includes(secretToken), "helper result should not expose token");
  assert(!serialized.includes("secret"), "helper result should not expose secrets");
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
