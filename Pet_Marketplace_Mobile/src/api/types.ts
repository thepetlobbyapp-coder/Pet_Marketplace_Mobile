export interface HealthResponse {
  status: "ok";
  uptimeSeconds?: number;
}

export type Role = "admin" | "provider" | "tutor";
export type UserStatus = "active" | "blocked" | "deleted";

export interface MeResponse {
  createdAt?: string;
  email?: string;
  id: string;
  locale?: string;
  profiles?: {
    provider?: {
      displayName: string;
      id: string;
      ratingAverage: number | null;
      ratingCount: number;
      serviceRadiusKm: number;
      status: "active" | "blocked" | "deleted" | "paused";
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

export interface TutorProfileResponse {
  createdAt: string;
  displayName: string;
  id: string;
  updatedAt: string;
}

export interface UpsertTutorProfileRequest {
  displayName: string;
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
}

export interface UpdatePetRequest {
  name: string;
}

export interface ApiErrorBody {
  error?: {
    code?: string;
    details?: unknown;
    message?: string;
  };
}
