import { parseMeResponseDto, type MeResponseDto } from "../auth/meContract";

export type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export const DEFAULT_ADMIN_API_BASE_URL = "/api/v1";

export class AdminApiError extends Error {
  readonly status: number;
  readonly code: string | undefined;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "AdminApiError";
    this.status = status;
    this.code = code;
  }
}

export class BackendUnavailableError extends Error {
  constructor(message = "Backend is unavailable.") {
    super(message);
    this.name = "BackendUnavailableError";
  }
}

export interface AdminApiClientOptions {
  readonly baseUrl?: string;
  readonly fetchImpl?: FetchLike;
  readonly getAccessToken?: () => Promise<string | null> | string | null;
}

export interface AdminApiJsonRequestOptions extends AdminApiClientOptions {
  readonly body?: unknown;
  readonly method?: "GET" | "PATCH";
  readonly path: string;
}

export interface AdminApiClient {
  readonly getMe: () => Promise<MeResponseDto>;
}

export function createAdminApiClient(
  options: AdminApiClientOptions = {},
): AdminApiClient {
  return {
    getMe: async () => {
      return parseMeResponseDto(
        await requestAdminApiJson({ ...options, path: "/me" }),
      );
    },
  };
}

export async function requestAdminApiJson({
  baseUrl = DEFAULT_ADMIN_API_BASE_URL,
  fetchImpl = globalThis.fetch?.bind(globalThis),
  getAccessToken,
  method = "GET",
  path,
  body,
}: AdminApiJsonRequestOptions): Promise<unknown> {
  if (!fetchImpl) {
    throw new BackendUnavailableError("Fetch API is not available.");
  }

  const accessToken = await getAccessToken?.();
  const headers = new Headers({ Accept: "application/json" });

  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  let response: Response;

  try {
    response = await fetchImpl(buildApiUrl(baseUrl, path), {
      body: body === undefined ? undefined : JSON.stringify(body),
      credentials: "include",
      headers,
      method,
    });
  } catch {
    throw new BackendUnavailableError();
  }

  if (!response.ok) {
    throw await toAdminApiError(response);
  }

  return response.json();
}

function buildApiUrl(baseUrl: string, path: string): string {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${normalizedBase}${normalizedPath}`;
}

async function toAdminApiError(response: Response): Promise<AdminApiError> {
  const fallbackMessage = `Admin API request failed with status ${response.status}.`;

  try {
    const body = (await response.json()) as unknown;

    if (isApiErrorBody(body)) {
      return new AdminApiError(
        response.status,
        body.error.message,
        body.error.code,
      );
    }
  } catch {
    // Keep the generic status-only error when the body is not JSON.
  }

  return new AdminApiError(response.status, fallbackMessage);
}

function isApiErrorBody(
  value: unknown,
): value is { error: { code?: string; message: string } } {
  if (!value || typeof value !== "object" || !("error" in value)) {
    return false;
  }

  const error = (value as { error?: unknown }).error;

  return (
    !!error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  );
}
