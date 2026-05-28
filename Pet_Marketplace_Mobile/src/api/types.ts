export interface HealthResponse {
  status: "ok";
  uptimeSeconds?: number;
}

export type Role = "admin" | "provider" | "tutor";
export type UserStatus = "active" | "blocked" | "deleted";
export type ProviderProfileStatus = "active" | "blocked" | "deleted" | "paused";

export interface MeResponse {
  /**
   * Short-lived (1h) signed URL pointing at the user avatar. `null` when no
   * avatar is set. Field is optional so older API clients still type-check
   * against responses from a backend that hasn't shipped the field yet.
   */
  avatarUrl?: string | null;
  createdAt?: string;
  email?: string;
  id: string;
  locale?: string;
  profiles?: {
    provider?: {
      bio: string | null;
      categoryId: ProviderCategory | null;
      displayName: string;
      id: string;
      isAvailable: boolean | null;
      listingId: string | null;
      pricePerHour: number | null;
      ratingAverage: number | null;
      ratingCount: number;
      service: string | null;
      serviceRadiusKm: number;
      status: ProviderProfileStatus;
    };
    tutor?: TutorProfileResponse;
  };
  roles: Role[];
  status: UserStatus;
  updatedAt?: string;
}

export interface UpdateMeRequest {
  locale: string;
}

export interface AvatarResponse {
  avatarUrl: string;
}

export interface AvatarUploadAsset {
  fileName: string | null;
  mimeType: string | null;
  uri: string;
}

export interface TutorProfileResponse {
  createdAt: string;
  displayName: string;
  id: string;
  updatedAt: string;
}

export interface UpsertTutorProfileRequest {
  displayName: string;
}

export interface ProviderProfileResponse {
  bio: string | null;
  categoryId: ProviderCategory | null;
  createdAt: string;
  displayName: string;
  id: string;
  isAvailable: boolean | null;
  listingId: string | null;
  pricePerHour: number | null;
  ratingAverage: number | null;
  ratingCount: number;
  service: string | null;
  serviceRadiusKm: number;
  status: ProviderProfileStatus;
  updatedAt: string;
}

export interface UpsertProviderProfileRequest {
  baseAddressId?: string | null;
  bio?: string | null;
  categoryId?: ProviderCategory;
  displayName: string;
  isAvailable?: boolean;
  pricePerHour?: number;
  publish?: boolean;
  service?: string;
  serviceRadiusKm?: number;
}

export type AccountDeletionRequestStatus = "pending" | "processing" | "done";

export interface AccountDeletionRequestResponse {
  completedAt: string | null;
  estimatedCompletionAt: string;
  id: string;
  processingStartedAt: string | null;
  requestedAt: string;
  status: AccountDeletionRequestStatus;
  updatedAt: string;
}

export type AddressLocationPrecision = "postcode" | "approximate";

export interface AddressResponse {
  city: string | null;
  countryCode: "GB";
  createdAt: string;
  id: string;
  isDefaultTutorAddress: boolean;
  label: string | null;
  locationPrecision: AddressLocationPrecision;
  postcode: string | null;
  publicAreaLabel: string | null;
  updatedAt: string;
}

export interface CreateAddressRequest {
  city: string | null;
  countryCode: "GB";
  label: string | null;
  latitude: number;
  locationPrecision: AddressLocationPrecision;
  longitude: number;
  postcode: string | null;
  publicAreaLabel: string | null;
  setAsDefaultTutorAddress: boolean;
}

export interface UpdateAddressRequest {
  city?: string | null;
  countryCode?: "GB";
  label?: string | null;
  locationPrecision?: AddressLocationPrecision;
  postcode?: string | null;
  publicAreaLabel?: string | null;
  setAsDefaultTutorAddress?: boolean;
}

export type ProviderCategory = "walk" | "sitting" | "transport" | "boarding";

export interface ProviderResponse {
  avatarUrl: string | null;
  bio: string | null;
  categoryId: ProviderCategory;
  distanceMeters: number | null;
  id: string;
  isAvailable: boolean;
  name: string;
  pricePerHour: number;
  rating: number;
  reviewCount: number;
  service: string;
}

export interface ListProvidersParams {
  categoryId?: ProviderCategory;
  limit?: number;
  offset?: number;
  q?: string;
}

export interface CursorPaginationParams {
  cursor?: string | null;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  nextCursor: string | null;
}

export interface TimeSlotResponse {
  id: string;
  isAvailable: boolean;
  label: string;
}

export type BookingStatus =
  | "requested"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface BookingResponse {
  createdAt: string;
  date: string;
  id: string;
  petId: string;
  providerId: string;
  service: string;
  status: BookingStatus;
  timeSlotId: string;
  updatedAt: string;
}

export interface CreateBookingRequest {
  date: string;
  petId: string;
  providerId: string;
  service: string;
  timeSlotId: string;
}

export interface UpdateBookingRequest {
  status: BookingStatus;
}

export interface ConversationResponse {
  counterpartAvatarUrl: string | null;
  counterpartName: string | null;
  counterpartService: string | null;
  id: string;
  lastMessage: string | null;
  lastTime: string | null;
  providerId: string;
  unread: boolean;
  viewerIsProvider: boolean;
}

export interface MessageResponse {
  fromProvider: boolean;
  id: string;
  text: string;
  time: string;
}

export interface CreateMessageRequest {
  text: string;
}

export interface CreateConversationRequest {
  providerId: string;
}

export type ReportTargetType = "conversation" | "message";
export type ReportCategory =
  | "safety_concern"
  | "inappropriate_behaviour"
  | "harassment"
  | "spam_scam"
  | "no_show"
  | "other";
export type ReportStatus =
  | "open"
  | "in_review"
  | "action_taken"
  | "dismissed"
  | "closed";

export interface CreateReportRequest {
  category: ReportCategory;
  description?: string | null;
  targetId: string;
  targetType: ReportTargetType;
}

export interface ReportResponse {
  category: ReportCategory;
  createdAt: string;
  id: string;
  status: ReportStatus;
  targetId: string;
  targetType: ReportTargetType;
  updatedAt: string;
}

export interface UserBlockResponse {
  blockedUserId: string;
  conversationId: string | null;
  createdAt: string;
  id: string;
}

export type PetSpecies = "dog" | "cat" | "other";
export type PetSize = "small" | "medium" | "large" | "giant" | "unknown";

export interface PetResponse {
  ageRange: string | null;
  breed: string | null;
  createdAt: string;
  id: string;
  name: string;
  notes: string | null;
  size: PetSize;
  species: PetSpecies;
  updatedAt: string;
}

export interface CreatePetRequest {
  name: string;
  species: PetSpecies;
  size?: PetSize;
  breed?: string | null;
  ageRange?: string | null;
  notes?: string | null;
}

export interface UpdatePetRequest {
  name?: string;
  species?: PetSpecies;
  size?: PetSize;
  breed?: string | null;
  ageRange?: string | null;
  notes?: string | null;
}

export interface ApiErrorBody {
  error?: {
    code?: string;
    details?: unknown;
    message?: string;
  };
}
