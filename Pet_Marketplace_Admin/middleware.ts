import { NextResponse, type NextRequest } from "next/server";

/**
 * Bloco 9 — primeira camada de RBAC. Middleware roda na borda antes do
 * Server Component. Não faz I/O (não chama backend) — apenas verifica
 * presença do cookie HttpOnly de sessão admin. A validação final de role
 * `admin` acontece em `requireAdmin()` (server-side, em `app/admin/layout.tsx`)
 * usando GET /me com Bearer.
 *
 * Por que dois níveis:
 *  1) Middleware é barato e rápido — corta rotas /admin/* sem cookie.
 *  2) requireAdmin() é a autoridade real — cookie pode existir mas o token
 *     já estar revogado/expirado, ou o usuário não ter role admin.
 */
const ADMIN_COOKIE_NAME =
  process.env.ADMIN_SESSION_COOKIE_NAME?.trim() || "pet-admin-session";

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Só protege /admin/*. /login e raiz seguem livres no middleware.
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  const hasSessionCookie =
    request.cookies.get(ADMIN_COOKIE_NAME)?.value !== undefined;
  if (hasSessionCookie) {
    return NextResponse.next();
  }

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = "/login";
  loginUrl.search = "";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Casa /admin e tudo abaixo. Ignora _next, favicon e api auth (a rota
  // /api/auth/* precisa funcionar sem cookie para o login acontecer).
  matcher: ["/admin/:path*"],
};
