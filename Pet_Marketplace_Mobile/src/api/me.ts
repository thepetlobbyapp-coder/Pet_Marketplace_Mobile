/**
 * Consumo de `GET /api/v1/me`.
 *
 * O parser e DEFENSIVO: faz allow-list dos campos seguros. Mesmo que o
 * backend um dia retorne token/phone/endereco/coordenadas, eles sao
 * descartados e nunca chegam ao estado do app.
 */
import type { ApiClient } from './http-client';
import { ApiError, safeMessageFor } from './errors';
import {
  KNOWN_ROLES,
  KNOWN_USER_STATUSES,
  type MeUser,
  type ProviderProfileSummary,
  type ProviderStatus,
  type Role,
  type TutorProfileSummary,
  type UserStatus,
} from '../types/me';

export const ME_PATH = '/api/v1/me';

export async function fetchMe(client: ApiClient): Promise<MeUser> {
  const raw = await client.get<unknown>(ME_PATH);
  const parsed = parseMe(raw);
  if (!parsed) {
    throw new ApiError({
      code: 'BAD_RESPONSE',
      kind: 'parse',
      message: safeMessageFor('BAD_RESPONSE'),
    });
  }
  return parsed;
}

/** Allow-list estrita. Retorna null se o shape minimo nao bater. */
export function parseMe(input: unknown): MeUser | null {
  if (typeof input !== 'object' || input === null) {
    return null;
  }
  const o = input as Record<string, unknown>;

  if (typeof o.id !== 'string' || o.id.length === 0) {
    return null;
  }
  const roles = parseRoles(o.roles);
  if (!roles) {
    return null;
  }
  const status = parseUserStatus(o.status);
  if (!status) {
    return null;
  }

  const user: MeUser = { id: o.id, roles, status };

  if (typeof o.email === 'string') {
    user.email = o.email;
  }
  if (typeof o.locale === 'string') {
    user.locale = o.locale;
  }
  if (typeof o.createdAt === 'string') {
    user.createdAt = o.createdAt;
  }
  if (typeof o.updatedAt === 'string') {
    user.updatedAt = o.updatedAt;
  }

  const profiles = parseProfiles(o.profiles);
  if (profiles) {
    user.profiles = profiles;
  }

  return user;
}

function parseRoles(value: unknown): Role[] | null {
  if (!Array.isArray(value)) {
    return null;
  }
  const roles: Role[] = [];
  for (const entry of value) {
    if (
      typeof entry === 'string' &&
      (KNOWN_ROLES as readonly string[]).includes(entry)
    ) {
      const role = entry as Role;
      if (!roles.includes(role)) {
        roles.push(role);
      }
    }
    // Roles desconhecidas sao ignoradas (forward-compat sem quebrar UX).
  }
  return roles;
}

function parseUserStatus(value: unknown): UserStatus | null {
  return typeof value === 'string' &&
    (KNOWN_USER_STATUSES as readonly string[]).includes(value)
    ? (value as UserStatus)
    : null;
}

function parseProfiles(value: unknown):
  | { tutor?: TutorProfileSummary; provider?: ProviderProfileSummary }
  | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const p = value as Record<string, unknown>;
  const out: {
    tutor?: TutorProfileSummary;
    provider?: ProviderProfileSummary;
  } = {};

  const tutor = parseTutor(p.tutor);
  if (tutor) {
    out.tutor = tutor;
  }
  const provider = parseProvider(p.provider);
  if (provider) {
    out.provider = provider;
  }

  return out.tutor || out.provider ? out : null;
}

function parseTutor(value: unknown): TutorProfileSummary | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const t = value as Record<string, unknown>;
  if (typeof t.id !== 'string' || typeof t.displayName !== 'string') {
    return null;
  }
  return { id: t.id, displayName: t.displayName };
}

const PROVIDER_STATUSES: readonly ProviderStatus[] = [
  'active',
  'paused',
  'blocked',
  'deleted',
];

function parseProvider(value: unknown): ProviderProfileSummary | null {
  if (typeof value !== 'object' || value === null) {
    return null;
  }
  const v = value as Record<string, unknown>;
  if (
    typeof v.id !== 'string' ||
    typeof v.displayName !== 'string' ||
    typeof v.status !== 'string' ||
    !(PROVIDER_STATUSES as readonly string[]).includes(v.status) ||
    typeof v.serviceRadiusKm !== 'number' ||
    typeof v.ratingCount !== 'number'
  ) {
    return null;
  }
  const ratingAverage =
    typeof v.ratingAverage === 'number' ? v.ratingAverage : null;

  return {
    id: v.id,
    displayName: v.displayName,
    status: v.status as ProviderStatus,
    serviceRadiusKm: v.serviceRadiusKm,
    ratingAverage,
    ratingCount: v.ratingCount,
  };
}
