/**
 * Contrato seguro de `GET /api/v1/me`.
 *
 * Espelha SOMENTE os campos seguros expostos pelo backend (Bloco 2B).
 * NUNCA modelar: token, phone, endereco completo, location, coordinates,
 * documento, selo de verificacao. Se o backend um dia vazar algo extra,
 * o parser (api/me.ts) descarta — o tipo aqui e a fronteira de contrato.
 */

/** Papeis da Fase 1 (alinhado ao backend `Role`). */
export type Role = 'tutor' | 'provider' | 'admin';

/** Status da conta do usuario. */
export type UserStatus = 'active' | 'blocked' | 'deleted';

/** Status do perfil de prestador. */
export type ProviderStatus = 'active' | 'paused' | 'blocked' | 'deleted';

/** Resumo seguro do perfil de tutor. */
export interface TutorProfileSummary {
  id: string;
  displayName: string;
}

/** Resumo seguro do perfil de prestador (sem endereco/coordenadas). */
export interface ProviderProfileSummary {
  id: string;
  displayName: string;
  status: ProviderStatus;
  serviceRadiusKm: number;
  ratingAverage: number | null;
  ratingCount: number;
}

export interface LinkedProfiles {
  tutor?: TutorProfileSummary;
  provider?: ProviderProfileSummary;
}

/** Usuario autenticado, como o Mobile deve guardar localmente. */
export interface MeUser {
  id: string;
  email?: string;
  roles: Role[];
  status: UserStatus;
  locale?: string;
  createdAt?: string;
  updatedAt?: string;
  profiles?: LinkedProfiles;
}

export const KNOWN_ROLES: readonly Role[] = ['tutor', 'provider', 'admin'];
export const KNOWN_USER_STATUSES: readonly UserStatus[] = [
  'active',
  'blocked',
  'deleted',
];
