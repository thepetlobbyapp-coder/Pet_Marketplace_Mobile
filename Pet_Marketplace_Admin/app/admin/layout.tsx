import type { ReactNode } from "react";
import { requireAdmin } from "../../src/auth/serverSession";
import { AdminShell } from "./_components/AdminShell";

/**
 * Guard server-side de /admin/*. Combinação com middleware.ts:
 *   - middleware corta sem cookie (não chama backend).
 *   - este layout valida via /me + role admin (autoridade real).
 * Se a sessão for inválida/forbidden/erro, requireAdmin() redireciona
 * para /login antes de renderizar.
 */
export default async function AdminLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  const { state } = await requireAdmin();
  return <AdminShell user={state.user}>{children}</AdminShell>;
}
