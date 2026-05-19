/**
 * Helpers de RBAC: roles multiplas, fallback tutor, admin nunca obrigatorio.
 */
import { suite, test, assert, assertEqual } from '../testing/harness';
import {
  hasRole,
  hasAnyRole,
  isProvider,
  isAdmin,
  canUseProviderExperience,
  primaryExperienceRole,
} from '../auth/roles';

suite('auth.roles', () => {
  test('hasRole / hasAnyRole with multiple roles', () => {
    const u = { roles: ['tutor', 'admin'] as const };
    assert(hasRole(u, 'tutor'), 'tutor');
    assert(hasRole(u, 'admin'), 'admin');
    assert(!hasRole(u, 'provider'), 'not provider');
    assert(hasAnyRole(u, ['provider', 'admin']), 'any');
  });

  test('tutor is the functional fallback experience', () => {
    assertEqual(primaryExperienceRole({ roles: [] }), 'tutor', 'empty');
    assertEqual(
      primaryExperienceRole({ roles: ['tutor'] }),
      'tutor',
      'tutor',
    );
  });

  test('provider role unlocks provider experience', () => {
    const u = { roles: ['tutor', 'provider'] as const };
    assert(isProvider(u), 'is provider');
    assert(canUseProviderExperience(u), 'can use provider exp');
    assertEqual(primaryExperienceRole(u), 'provider', 'primary provider');
  });

  test('admin never becomes the mobile primary experience', () => {
    const u = { roles: ['admin'] as const };
    assert(isAdmin(u), 'is admin');
    assertEqual(
      primaryExperienceRole(u),
      'tutor',
      'admin falls back to tutor on mobile',
    );
    assert(!canUseProviderExperience(u), 'admin alone != provider exp');
  });
});
