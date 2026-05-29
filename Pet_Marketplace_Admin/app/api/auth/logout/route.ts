import { NextResponse } from "next/server";
import { readAdminServerEnv } from "../../../../src/lib/serverEnv";

/**
 * Limpa o cookie de sessão. Idempotente: chamar duas vezes não muda nada
 * além do header de set-cookie. Não acessa backend.
 */
export async function POST(): Promise<NextResponse> {
  const env = readAdminServerEnv();
  const response = NextResponse.json({ status: "ok" }, { status: 200 });
  response.cookies.set({
    httpOnly: true,
    maxAge: 0,
    name: env.cookieName,
    path: "/",
    sameSite: "lax",
    secure: env.isProduction,
    value: "",
  });
  return response;
}
