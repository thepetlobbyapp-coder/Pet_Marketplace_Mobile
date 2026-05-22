import { env } from "../lib/env";
import type {
  ApiErrorBody,
  CreatePetRequest,
  HealthResponse,
  MeResponse,
  PetResponse,
  TutorProfileResponse,
  UpdatePetRequest,
  UpdateMeRequest,
  UpsertTutorProfileRequest,
} from "./types";

const apiV1BaseUrl = `${env.apiBaseUrl}/api/v1`;

export async function getHealth(): Promise<HealthResponse> {
  return request<HealthResponse>("/health");
}

export async function getMe(accessToken: string | null): Promise<MeResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<MeResponse>("/me", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function updateMe(
  accessToken: string | null,
  body: UpdateMeRequest,
): Promise<MeResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<MeResponse>("/me", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
}

export async function createTutorProfile(
  accessToken: string | null,
  body: UpsertTutorProfileRequest,
): Promise<TutorProfileResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<TutorProfileResponse>("/me/tutor-profile", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function updateTutorProfile(
  accessToken: string | null,
  body: UpsertTutorProfileRequest,
): Promise<TutorProfileResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<TutorProfileResponse>("/me/tutor-profile", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
}

export async function getPets(
  accessToken: string | null,
): Promise<PetResponse[]> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<PetResponse[]>("/pets", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function createPet(
  accessToken: string | null,
  body: CreatePetRequest,
): Promise<PetResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<PetResponse>("/pets", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function updatePet(
  accessToken: string | null,
  petId: string,
  body: UpdatePetRequest,
): Promise<PetResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<PetResponse>(petPath(petId), {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
}

export async function deletePet(
  accessToken: string | null,
  petId: string,
): Promise<void> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<void>(petPath(petId), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "DELETE",
  });
}

async function request<T>(
  path: "/health" | "/me" | "/me/tutor-profile" | "/pets" | `/pets/${string}`,
  init: RequestInit = {},
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12_000);

  try {
    const response = await fetch(`${apiV1BaseUrl}${path}`, {
      ...init,
      headers: {
        Accept: "application/json",
        ...(init.headers ?? {}),
      },
      signal: controller.signal,
    });

    const body = await readJson(response);
    const apiError = readApiError(body);

    if (!response.ok) {
      throw new ApiClientError(
        apiError?.code ?? `HTTP_${response.status}`,
        response.status,
        apiError?.message,
      );
    }

    return body as T;
  } finally {
    clearTimeout(timeout);
  }
}

function petPath(petId: string): `/pets/${string}` {
  return `/pets/${encodeURIComponent(petId)}`;
}

async function readJson(response: Response): Promise<ApiErrorBody | unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function readApiError(value: ApiErrorBody | unknown) {
  if (!value || typeof value !== "object" || !("error" in value)) {
    return null;
  }

  const error = (value as ApiErrorBody).error;
  return error && typeof error === "object" ? error : null;
}

export class ApiClientError extends Error {
  constructor(
    readonly code: string,
    readonly status: number,
    message?: string,
  ) {
    super(message ?? code);
  }
}
