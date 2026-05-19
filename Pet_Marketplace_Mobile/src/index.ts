/**
 * Camada base de sessao/auth do Mobile (sem Expo).
 *
 * O Bloco 3 (Expo) consome estes modulos:
 *  - createApiClient + getToken (SecureStore) -> ApiClient
 *  - bootstrapSession -> SessionState para o Context/Zustand
 *  - roles helpers -> guards de navegacao tutor/provider
 */
export * from './types/me';
export * from './config/env';
export { ApiError } from './api/errors';
export type { ApiErrorCode, ApiErrorKind } from './api/errors';
export { safeMessageFor } from './api/errors';
export { createApiClient } from './api/http-client';
export type {
  ApiClient,
  ApiClientOptions,
  TokenProvider,
} from './api/http-client';
export { fetchMe, parseMe, ME_PATH } from './api/me';
export {
  hasRole,
  hasAnyRole,
  isTutor,
  isProvider,
  isAdmin,
  canUseProviderExperience,
  primaryExperienceRole,
} from './auth/roles';
export type { WithRoles } from './auth/roles';
export {
  bootstrapSession,
  isAuthenticated,
  isRetryable,
} from './auth/session-state';
export type {
  SessionState,
  SessionBootstrapDeps,
} from './auth/session-state';
