import * as FileSystem from "expo-file-system/legacy";
import { env } from "../lib/env";
import type {
  ApiErrorBody,
  AccountDeletionRequestResponse,
  AddressResponse,
  AvatarResponse,
  AvatarUploadAsset,
  BookingResponse,
  ConversationResponse,
  CreateAddressRequest,
  CreateBookingRequest,
  CreateConversationRequest,
  CreateMessageRequest,
  CreatePetRequest,
  CreateReportRequest,
  CursorPaginationParams,
  HealthResponse,
  ListProvidersParams,
  MeResponse,
  MessageResponse,
  PaginatedResponse,
  PetResponse,
  ProviderProfileResponse,
  ProviderResponse,
  ReportResponse,
  TimeSlotResponse,
  TutorProfileResponse,
  UpdateAddressRequest,
  UpdateBookingRequest,
  UpdatePetRequest,
  UpdateMeRequest,
  UpsertProviderProfileRequest,
  UpsertTutorProfileRequest,
  UserBlockResponse,
} from "./types";

const apiV1BaseUrl = `${env.apiBaseUrl}/api/v1`;

/** Client-side hard cap mirrors the backend validator (5 MB). */
export const AVATAR_MAX_SIZE_BYTES = 5 * 1024 * 1024;

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

export async function uploadAvatar(
  accessToken: string | null,
  asset: AvatarUploadAsset,
): Promise<AvatarResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  const result = await FileSystem.uploadAsync(
    `${apiV1BaseUrl}/me/avatar`,
    asset.uri,
    {
      fieldName: "image",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      httpMethod: "POST",
      mimeType: asset.mimeType ?? "image/jpeg",
      uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    },
  );

  const body = parseUploadBody(result.body);
  const apiError = readApiError(body);
  if (result.status < 200 || result.status >= 300) {
    throw new ApiClientError(
      apiError?.code ?? `HTTP_${result.status}`,
      result.status,
      apiError?.message,
    );
  }

  return body as AvatarResponse;
}

export async function deleteAvatar(accessToken: string | null): Promise<void> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<void>("/me/avatar", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "DELETE",
  });
}

export async function getDeletionRequest(
  accessToken: string | null,
): Promise<AccountDeletionRequestResponse | null> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  try {
    return await request<AccountDeletionRequestResponse>(
      "/me/deletion-request",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
  } catch (error) {
    if (error instanceof ApiClientError && error.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function requestDeletionRequest(
  accessToken: string | null,
): Promise<AccountDeletionRequestResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<AccountDeletionRequestResponse>("/me/deletion-request", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
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

export async function createProviderProfile(
  accessToken: string | null,
  body: UpsertProviderProfileRequest,
): Promise<ProviderProfileResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<ProviderProfileResponse>("/me/provider-profile", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function updateProviderProfile(
  accessToken: string | null,
  body: UpsertProviderProfileRequest,
): Promise<ProviderProfileResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<ProviderProfileResponse>("/me/provider-profile", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
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

export async function getAddresses(
  accessToken: string | null,
): Promise<AddressResponse[]> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<AddressResponse[]>("/addresses", {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function createAddress(
  accessToken: string | null,
  body: CreateAddressRequest,
): Promise<AddressResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<AddressResponse>("/addresses", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function updateAddress(
  accessToken: string | null,
  addressId: string,
  body: UpdateAddressRequest,
): Promise<AddressResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<AddressResponse>(addressPath(addressId), {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
}

export async function getProviders(
  accessToken: string | null,
  params: ListProvidersParams = {},
): Promise<ProviderResponse[]> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<ProviderResponse[]>(providersPath(params), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function getProvider(
  accessToken: string | null,
  providerId: string,
): Promise<ProviderResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<ProviderResponse>(providerPath(providerId), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
}

export async function getProviderAvailability(
  accessToken: string | null,
  providerId: string,
  date: string,
): Promise<TimeSlotResponse[]> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<TimeSlotResponse[]>(
    providerAvailabilityPath(providerId, date),
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  );
}

export async function createBooking(
  accessToken: string | null,
  body: CreateBookingRequest,
): Promise<BookingResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<BookingResponse>("/bookings", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function getBookings(
  accessToken: string | null,
  params: CursorPaginationParams = {},
): Promise<BookingResponse[]> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  const payload = await request<
    PaginatedResponse<BookingResponse> | BookingResponse[]
  >(cursorPaginatedPath("/bookings", params), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return readPaginatedItems(payload);
}

export async function updateBooking(
  accessToken: string | null,
  bookingId: string,
  body: UpdateBookingRequest,
): Promise<BookingResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<BookingResponse>(bookingPath(bookingId), {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "PATCH",
  });
}

export async function getConversations(
  accessToken: string | null,
  params: CursorPaginationParams = {},
): Promise<ConversationResponse[]> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  const payload = await request<
    PaginatedResponse<ConversationResponse> | ConversationResponse[]
  >(cursorPaginatedPath("/conversations", params), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return readPaginatedItems(payload);
}

/**
 * Abre (ou retoma) a conversa direta entre o tutor autenticado e um provider.
 * Idempotente do lado do backend — chamar duas vezes com o mesmo `providerId`
 * devolve a mesma `ConversationResponse`. Erros possíveis:
 *  - 401 sem sessão; 403 quando há bloqueio em qualquer direção;
 *  - 404 quando o provider está indisponível;
 *  - 429 quando o tutor excedeu o limite de conversas cold-start na janela.
 */
export async function openConversation(
  accessToken: string | null,
  body: CreateConversationRequest,
): Promise<ConversationResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<ConversationResponse>("/conversations", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function getConversationMessages(
  accessToken: string | null,
  conversationId: string,
  params: CursorPaginationParams = {},
): Promise<MessageResponse[]> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  const payload = await request<
    PaginatedResponse<MessageResponse> | MessageResponse[]
  >(conversationMessagesPath(conversationId, params), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  return readPaginatedItems(payload);
}

export async function createConversationMessage(
  accessToken: string | null,
  conversationId: string,
  body: CreateMessageRequest,
): Promise<MessageResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<MessageResponse>(conversationMessagesPath(conversationId), {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function createReport(
  accessToken: string | null,
  body: CreateReportRequest,
): Promise<ReportResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<ReportResponse>("/reports", {
    body: JSON.stringify(body),
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
}

export async function blockConversation(
  accessToken: string | null,
  conversationId: string,
): Promise<UserBlockResponse> {
  if (!accessToken) {
    throw new ApiClientError("AUTH_SESSION_MISSING", 401);
  }

  return request<UserBlockResponse>(conversationBlockPath(conversationId), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    method: "POST",
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
  path:
    | "/health"
    | "/me"
    | "/me/avatar"
    | "/me/deletion-request"
    | "/me/provider-profile"
    | "/me/tutor-profile"
    | "/addresses"
    | `/addresses/${string}`
    | "/providers"
    | `/providers?${string}`
    | `/providers/${string}`
    | `/providers/${string}/availability?${string}`
    | "/bookings"
    | `/bookings?${string}`
    | `/bookings/${string}`
    | "/conversations"
    | `/conversations?${string}`
    | `/conversations/${string}/messages`
    | `/conversations/${string}/messages?${string}`
    | `/conversations/${string}/block`
    | "/reports"
    | "/pets"
    | `/pets/${string}`,
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

function addressPath(addressId: string): `/addresses/${string}` {
  return `/addresses/${encodeURIComponent(addressId)}`;
}

function bookingPath(bookingId: string): `/bookings/${string}` {
  return `/bookings/${encodeURIComponent(bookingId)}`;
}

function providerPath(providerId: string): `/providers/${string}` {
  return `/providers/${encodeURIComponent(providerId)}`;
}

function providerAvailabilityPath(
  providerId: string,
  date: string,
): `/providers/${string}/availability?${string}` {
  const search = new URLSearchParams({ date });
  return `/providers/${encodeURIComponent(providerId)}/availability?${search.toString()}`;
}

function conversationMessagesPath(
  conversationId: string,
  params: CursorPaginationParams = {},
):
  | `/conversations/${string}/messages`
  | `/conversations/${string}/messages?${string}` {
  return cursorPaginatedPath(
    `/conversations/${encodeURIComponent(conversationId)}/messages`,
    params,
  );
}

function conversationBlockPath(
  conversationId: string,
): `/conversations/${string}/block` {
  return `/conversations/${encodeURIComponent(conversationId)}/block`;
}

function providersPath(
  params: ListProvidersParams,
): "/providers" | `/providers?${string}` {
  const search = new URLSearchParams();
  const q = params.q?.trim();

  if (params.categoryId) search.set("categoryId", params.categoryId);
  if (q) search.set("q", q);
  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.offset !== undefined) search.set("offset", String(params.offset));

  const queryString = search.toString();
  return queryString ? `/providers?${queryString}` : "/providers";
}

function cursorPaginatedPath<TBase extends string>(
  basePath: TBase,
  params: CursorPaginationParams,
): TBase | `${TBase}?${string}` {
  const search = new URLSearchParams();

  if (params.limit !== undefined) search.set("limit", String(params.limit));
  if (params.cursor) search.set("cursor", params.cursor);

  const queryString = search.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}

function readPaginatedItems<T>(payload: PaginatedResponse<T> | T[]): T[] {
  if (Array.isArray(payload)) return payload;
  return payload.items;
}

async function readJson(response: Response): Promise<ApiErrorBody | unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function parseUploadBody(raw: string | undefined | null): unknown {
  if (!raw) return null;
  try {
    return JSON.parse(raw);
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
