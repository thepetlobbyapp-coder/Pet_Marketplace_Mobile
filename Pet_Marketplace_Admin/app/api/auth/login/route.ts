import { NextResponse, type NextRequest } from "next/server";
import {
  AdminApiError,
  BackendUnavailableError,
  createAdminApiClient,
} from "../../../../src/api/adminApiClient";
import { hasAdminRole } from "../../../../src/auth/adminSession";
import { readAdminServerEnv } from "../../../../src/lib/serverEnv";

/**
 * Recebe `{ accessToken }` do <LoginForm/>, valida via GET /me e — somente
 * se o usuário tem role `admin` — emite cookie HttpOnly.
 *
 * Token NUNCA é eco no body de resposta. Erros internos são mapeados para
 * 401/503 sem vazar payload.
 */
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "INVALID_BODY", "Request body must be JSON.");
  }

  const accessToken = readAccessToken(body);
  if (!accessToken) {
    return jsonError(400, "MISSING_TOKEN", "accessToken is required.");
  }

  const env = readAdminServerEnv();
  const apiClient = createAdminApiClient({
    baseUrl: `${env.adminApiBaseUrl}/api/v1`,
    getAccessToken: () => accessToken,
  });

  try {
    const me = await apiClient.getMe();
    if (!hasAdminRole(me.roles)) {
      return jsonError(403, "FORBIDDEN", "Account is not an admin.");
    }

    const response = NextResponse.json({ status: "ok" }, { status: 200 });
    response.cookies.set({
      httpOnly: true,
      maxAge: env.cookieMaxAgeSeconds,
      name: env.cookieName,
      path: "/",
      sameSite: "lax",
      secure: env.isProduction,
      value: accessToken,
    });
    return response;
  } catch (error) {
    if (error instanceof AdminApiError) {
      if (error.status === 401) {
        return jsonError(401, "UNAUTHORIZED", "Token is invalid.");
      }
      if (error.status === 403) {
        return jsonError(403, "FORBIDDEN", "Account is not authorised.");
      }
      return jsonError(502, "BACKEND_ERROR", "Backend rejected the request.");
    }
    if (error instanceof BackendUnavailableError) {
      return jsonError(503, "BACKEND_UNAVAILABLE", "Backend is unavailable.");
    }
    // Não logar o erro bruto — pode conter trecho de payload do backend.
    return jsonError(500, "UNKNOWN", "Unexpected server error.");
  }
}

function readAccessToken(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const candidate = (value as { accessToken?: unknown }).accessToken;
  if (typeof candidate !== "string") return null;
  const trimmed = candidate.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function jsonError(
  status: number,
  code: string,
  message: string,
): NextResponse {
  return NextResponse.json({ error: { code, message } }, { status });
}
