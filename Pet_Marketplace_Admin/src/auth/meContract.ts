export const FORBIDDEN_ME_RESPONSE_FIELDS = [
  "token",
  "phone",
  "address",
  "location",
  "coordinates",
] as const;

export type ForbiddenMeResponseField =
  (typeof FORBIDDEN_ME_RESPONSE_FIELDS)[number];

export type UserRole = "admin" | "provider" | "tutor" | (string & {});

export interface SafeProfileSummaryDto {
  readonly id: string;
  readonly displayName?: string;
  readonly status?: string;
  readonly createdAt?: string;
  readonly updatedAt?: string;
}

export interface MeProfileSummariesDto {
  readonly tutor?: SafeProfileSummaryDto | null;
  readonly provider?: SafeProfileSummaryDto | null;
}

export interface MeResponseDto {
  readonly id: string;
  readonly email: string;
  readonly roles: readonly UserRole[];
  readonly status: string;
  readonly locale: string | null;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly profiles?: MeProfileSummariesDto;
}

type AssertNoForbiddenFields<T> =
  Extract<keyof T, ForbiddenMeResponseField> extends never ? true : never;

export const meResponseDtoHasNoForbiddenFields: AssertNoForbiddenFields<MeResponseDto> =
  true;

export const profileSummaryDtoHasNoForbiddenFields: AssertNoForbiddenFields<SafeProfileSummaryDto> =
  true;

export class MeContractError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "MeContractError";
  }
}

export function parseMeResponseDto(payload: unknown): MeResponseDto {
  const record = expectRecord(payload, "GET /api/v1/me response");
  const roles = expectStringArray(record.roles, "roles");

  return {
    createdAt: expectString(record.createdAt, "createdAt"),
    email: expectString(record.email, "email"),
    id: expectString(record.id, "id"),
    locale: readNullableString(record.locale, "locale"),
    profiles: readProfileSummaries(record),
    roles,
    status: expectString(record.status, "status"),
    updatedAt: expectString(record.updatedAt, "updatedAt"),
  };
}

function readProfileSummaries(
  record: Record<string, unknown>,
): MeProfileSummariesDto | undefined {
  const profiles = expectOptionalRecord(record.profiles, "profiles");
  const tutor =
    readProfileSummary(profiles?.tutor, "profiles.tutor") ??
    readProfileSummary(record.tutorProfile, "tutorProfile");
  const provider =
    readProfileSummary(profiles?.provider, "profiles.provider") ??
    readProfileSummary(record.providerProfile, "providerProfile");

  if (tutor === undefined && provider === undefined) {
    return undefined;
  }

  return { provider, tutor };
}

function readProfileSummary(
  value: unknown,
  label: string,
): SafeProfileSummaryDto | null | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (value === null) {
    return null;
  }

  const record = expectRecord(value, label);

  return {
    createdAt: readOptionalString(record.createdAt, `${label}.createdAt`),
    displayName: readOptionalString(record.displayName, `${label}.displayName`),
    id: expectString(record.id, `${label}.id`),
    status: readOptionalString(record.status, `${label}.status`),
    updatedAt: readOptionalString(record.updatedAt, `${label}.updatedAt`),
  };
}

function expectRecord(value: unknown, label: string): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new MeContractError(`${label} must be an object.`);
  }

  return value as Record<string, unknown>;
}

function expectOptionalRecord(
  value: unknown,
  label: string,
): Record<string, unknown> | undefined {
  if (value === undefined) {
    return undefined;
  }

  return expectRecord(value, label);
}

function expectString(value: unknown, label: string): string {
  if (typeof value !== "string" || value.length === 0) {
    throw new MeContractError(`${label} must be a non-empty string.`);
  }

  return value;
}

function readOptionalString(
  value: unknown,
  label: string,
): string | undefined {
  if (value === undefined) {
    return undefined;
  }

  return expectString(value, label);
}

function readNullableString(value: unknown, label: string): string | null {
  if (value === null) {
    return null;
  }

  return expectString(value, label);
}

function expectStringArray(value: unknown, label: string): readonly UserRole[] {
  if (!Array.isArray(value)) {
    throw new MeContractError(`${label} must be an array.`);
  }

  return value.map((role, index) => {
    if (typeof role !== "string" || role.length === 0) {
      throw new MeContractError(`${label}[${index}] must be a non-empty string.`);
    }

    return role as UserRole;
  });
}
