import Link from "next/link";
import type { ReactNode } from "react";
import { createAdminAuthViewModel } from "../../../src/auth/adminAuthViewModel";
import { createAdminShellViewModel } from "../../../src/navigation/adminShellViewModel";
import type { MeResponseDto } from "../../../src/auth/meContract";
import { LogoutButton } from "./LogoutButton";

/**
 * Header + navegação derivada de getAccessibleAdminRoutes. Rotas planejadas
 * sem endpoint backend real ficam visíveis como desabilitadas, sem link.
 */
export function AdminShell({
  children,
  user,
}: {
  readonly children: ReactNode;
  readonly user: MeResponseDto;
}) {
  const authViewModel = createAdminAuthViewModel({
    status: "authenticated",
    user,
  });
  const shellViewModel = createAdminShellViewModel(authViewModel);
  const identity = shellViewModel.safeUserIdentity;

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <header
        style={{
          alignItems: "center",
          background: "var(--color-surface)",
          borderBottom: "1px solid var(--color-border)",
          display: "flex",
          justifyContent: "space-between",
          padding: "var(--space-3) var(--space-5)",
        }}
      >
        <div style={{ alignItems: "center", display: "flex", gap: "var(--space-5)" }}>
          <strong style={{ fontSize: 16 }}>Pet Marketplace Admin</strong>
          <nav style={{ display: "flex", gap: "var(--space-4)" }}>
            {shellViewModel.visibleRoutes.map((route) =>
              route.status === "enabled" ? (
                <Link
                  key={route.id}
                  href={route.path}
                  style={{ color: "var(--color-text)" }}
                >
                  {route.label}
                </Link>
              ) : (
                <span
                  key={route.id}
                  aria-disabled="true"
                  style={{
                    color: "var(--color-muted)",
                    cursor: "not-allowed",
                  }}
                  title={route.disabledReason}
                >
                  {route.label}
                </span>
              ),
            )}
          </nav>
        </div>
        <div style={{ alignItems: "center", display: "flex", gap: "var(--space-3)" }}>
          {identity ? (
            <span style={{ color: "var(--color-muted)", fontSize: 13 }}>
              {identity.email}
            </span>
          ) : null}
          <LogoutButton />
        </div>
      </header>
      <main style={{ padding: "var(--space-5)" }}>{children}</main>
    </div>
  );
}
