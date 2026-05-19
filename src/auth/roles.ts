/**
 * Helpers de RBAC no Mobile.
 *
 * Regras de produto:
 * - `tutor` e o fallback funcional da experiencia principal.
 * - Nao assumir que toda conta tem provider/admin.
 * - NUNCA exigir `admin` no Mobile (admin e o painel web).
 */
import type { Role } from '../types/me';

/** Aceita qualquer objeto somente-leitura com roles (MeUser inclusive). */
export type WithRoles = { readonly roles: readonly Role[] };

export function hasRole(user: WithRoles, role: Role): boolean {
  return user.roles.includes(role);
}

export function hasAnyRole(
  user: WithRoles,
  roles: readonly Role[],
): boolean {
  return roles.some((r) => user.roles.includes(r));
}

export function isTutor(user: WithRoles): boolean {
  return hasRole(user, 'tutor');
}

export function isProvider(user: WithRoles): boolean {
  return hasRole(user, 'provider');
}

export function isAdmin(user: WithRoles): boolean {
  return hasRole(user, 'admin');
}

/** Pode usar a experiencia/aba de prestador. */
export function canUseProviderExperience(user: WithRoles): boolean {
  return isProvider(user);
}

/**
 * Experiencia inicial sugerida. Nunca retorna 'admin'.
 * Sem nenhuma role conhecida, ainda cai em 'tutor' (fallback funcional),
 * para nao travar a UX de uma conta recem-criada.
 */
export function primaryExperienceRole(
  user: WithRoles,
): Exclude<Role, 'admin'> {
  return isProvider(user) ? 'provider' : 'tutor';
}
