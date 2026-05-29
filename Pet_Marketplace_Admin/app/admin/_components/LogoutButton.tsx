"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

/**
 * Logout admin client-side. Apenas chama POST /api/auth/logout (limpa o
 * cookie HttpOnly) e força refresh para /login.
 */
export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout(): Promise<void> {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    try {
      await fetch("/api/auth/logout", {
        credentials: "same-origin",
        method: "POST",
      });
    } catch {
      // Mesmo se o POST falhar, mandamos o usuário para /login — middleware
      // tratará caso o cookie ainda exista.
    }

    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      disabled={isLoggingOut}
      onClick={handleLogout}
      style={{
        background: "transparent",
        border: "1px solid var(--color-border)",
        borderRadius: "var(--radius-sm)",
        color: "var(--color-text)",
        cursor: isLoggingOut ? "wait" : "pointer",
        padding: "var(--space-2) var(--space-3)",
      }}
      type="button"
    >
      {isLoggingOut ? "Signing out…" : "Sign out"}
    </button>
  );
}
