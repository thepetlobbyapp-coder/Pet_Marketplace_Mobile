import {
  ADMIN_ROUTES,
  createAdminAuthViewModel,
  createAdminShellViewModel,
  getAccessibleAdminRoutes,
  parseMeResponseDto,
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
      location: "must not be stored",
      phone: "+44 0000",
      status: "active",
    },
  },
  roles: ["tutor", "admin"],
  status: "active",
  token: "must not be stored",
  updatedAt: "2026-05-18T12:05:00.000Z",
};

main();

function main(): void {
  testAdminSeesPlannedRoutesWithBackendStatus();
  testNonAdminSeesNoRoutes();
  testBlockedReasons();
  testSafeIdentityShape();

  console.log("admin-shell tests passed");
}

function testAdminSeesPlannedRoutesWithBackendStatus(): void {
  const admin = parseMeResponseDto(adminMePayload);
  const authViewModel = createAdminAuthViewModel({
    status: "authenticated",
    user: admin,
  });
  const shell = createAdminShellViewModel(authViewModel);

  assert(shell.primaryBlockedReason === null, "admin should not be blocked");
  assert(
    shell.visibleRoutes.length === ADMIN_ROUTES.length,
    "admin should see every planned route",
  );
  assert(
    routeIds(shell.visibleRoutes).join(",") ===
      "dashboard,users,providers,bookings,reports,reviews,auditLogs",
    "admin route order should be stable",
  );
  assert(
    shell.visibleRoutes.every((route) => route.requiresAdmin === true),
    "every admin route should require admin",
  );
  assert(
    routeStatuses(shell.visibleRoutes).join(",") ===
      "dashboard:enabled,users:enabled,providers:enabled,bookings:enabled,reports:enabled,reviews:enabled,auditLogs:enabled",
    "backend-backed admin routes should be enabled",
  );
  assert(
    shell.visibleRoutes
      .filter((route) => route.status === "disabled")
      .every((route) => !!route.disabledReason),
    "disabled routes should include a clear reason",
  );
  assert(
    getAccessibleAdminRoutes(authViewModel).length === ADMIN_ROUTES.length,
    "route helper should expose all routes to admin",
  );
}

function testNonAdminSeesNoRoutes(): void {
  const tutor = parseMeResponseDto({ ...adminMePayload, roles: ["tutor"] });
  const authViewModel = createAdminAuthViewModel({
    status: "forbidden",
    user: tutor,
  });
  const shell = createAdminShellViewModel(authViewModel);

  assert(shell.visibleRoutes.length === 0, "non-admin should see no routes");
  assert(
    getAccessibleAdminRoutes(authViewModel).length === 0,
    "route helper should hide routes from non-admin",
  );
  assert(
    shell.primaryBlockedReason === "forbidden",
    "non-admin should get forbidden block reason",
  );
}

function testBlockedReasons(): void {
  const unauthenticated = createAdminShellViewModel(
    createAdminAuthViewModel({ status: "unauthenticated" }),
  );
  const forbidden = createAdminShellViewModel(
    createAdminAuthViewModel({ status: "forbidden" }),
  );
  const backendUnavailable = createAdminShellViewModel(
    createAdminAuthViewModel({
      message: "Backend is unavailable.",
      status: "backend_unavailable",
    }),
  );
  const loading = createAdminShellViewModel(
    createAdminAuthViewModel({ status: "loading" }),
  );
  const error = createAdminShellViewModel(
    createAdminAuthViewModel({
      message: "Could not bootstrap the admin session.",
      status: "error",
    }),
  );

  assert(
    unauthenticated.primaryBlockedReason === "login_required",
    "unauthenticated should require login",
  );
  assert(
    forbidden.primaryBlockedReason === "forbidden",
    "forbidden should stay explicit",
  );
  assert(
    backendUnavailable.primaryBlockedReason === "backend_unavailable",
    "backend outage should stay explicit",
  );
  assert(
    loading.primaryBlockedReason === "loading",
    "loading should stay explicit",
  );
  assert(error.primaryBlockedReason === "error", "generic errors should block");
  assert(
    [
      unauthenticated,
      forbidden,
      backendUnavailable,
      loading,
      error,
    ].every((shell) => shell.visibleRoutes.length === 0),
    "blocked states should expose no routes",
  );
}

function testSafeIdentityShape(): void {
  const admin = parseMeResponseDto(adminMePayload);
  const shell = createAdminShellViewModel(
    createAdminAuthViewModel({
      status: "authenticated",
      user: admin,
    }),
  );
  const identity = shell.safeUserIdentity;

  assert(identity !== undefined, "admin shell should include safe identity");
  assert(identity.email === "admin@teste.com", "safe identity includes email");
  assert(identity.status === "active", "safe identity includes status");
  assert(identity.locale === "en-GB", "safe identity includes locale");
  assert(identity.roles.includes("admin"), "safe identity includes roles");
  assert(!("token" in identity), "safe identity should not expose token");
  assert(!("phone" in identity), "safe identity should not expose phone");
  assert(!("address" in identity), "safe identity should not expose address");
  assert(!("location" in identity), "safe identity should not expose location");
  assert(
    !("coordinates" in identity),
    "safe identity should not expose coordinates",
  );
  assert(
    !JSON.stringify(shell).includes("must not be stored"),
    "shell should not contain forbidden mocked values",
  );
}

function routeIds(routes: readonly { readonly id: string }[]): readonly string[] {
  return routes.map((route) => route.id);
}

function routeStatuses(
  routes: readonly { readonly id: string; readonly status: string }[],
): readonly string[] {
  return routes.map((route) => `${route.id}:${route.status}`);
}

function assert(condition: unknown, message: string): asserts condition {
  if (!condition) {
    throw new Error(message);
  }
}
