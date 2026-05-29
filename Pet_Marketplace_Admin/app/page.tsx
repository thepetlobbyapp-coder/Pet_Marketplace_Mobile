import { redirect } from "next/navigation";
import { readAdminSession } from "../src/auth/serverSession";

/**
 * Raiz da SPA admin. Decide destino conforme estado da sessão:
 *   authenticated → /admin/reports (Dashboard adiado para próxima fatia)
 *   qualquer outro → /login
 */
export default async function RootPage() {
  const state = await readAdminSession();
  if (state.status === "authenticated") {
    redirect("/admin/reports");
  }
  redirect("/login");
}
