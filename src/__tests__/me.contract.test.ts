/**
 * Contrato de /api/v1/me: parser defensivo + roles multiplas.
 */
import {
  suite,
  test,
  assert,
  assertEqual,
  assertDeepEqual,
} from '../testing/harness';
import { parseMe } from '../api/me';

suite('me.contract', () => {
  test('parses a minimal valid payload', () => {
    const user = parseMe({
      id: 'u1',
      roles: ['tutor'],
      status: 'active',
    });
    assert(user !== null, 'should parse');
    assertEqual(user?.id, 'u1', 'id');
    assertDeepEqual(user?.roles, ['tutor'], 'roles');
  });

  test('supports multiple roles like ["tutor","admin"]', () => {
    const user = parseMe({
      id: 'admin-1',
      email: 'admin@teste.com',
      roles: ['tutor', 'admin'],
      status: 'active',
    });
    assertDeepEqual(user?.roles, ['tutor', 'admin'], 'roles');
  });

  test('strips forbidden/unknown fields (token, phone, address, coords)', () => {
    const user = parseMe({
      id: 'u2',
      roles: ['provider'],
      status: 'active',
      token: 'SECRET',
      phone: '+44 7000 000000',
      address: '10 Downing St',
      location: { lat: 51.5, lng: -0.12 },
      coordinates: [51.5, -0.12],
    });
    assert(user !== null, 'parsed');
    const keys = Object.keys(user as object).sort();
    assertDeepEqual(keys, ['id', 'roles', 'status'], 'only safe keys kept');
  });

  test('drops unknown roles but keeps known ones', () => {
    const user = parseMe({
      id: 'u3',
      roles: ['tutor', 'superuser', 'provider'],
      status: 'active',
    });
    assertDeepEqual(user?.roles, ['tutor', 'provider'], 'unknown role removed');
  });

  test('keeps safe provider summary, no address/coords', () => {
    const user = parseMe({
      id: 'u4',
      roles: ['provider'],
      status: 'active',
      profiles: {
        provider: {
          id: 'p4',
          displayName: 'Jo',
          status: 'active',
          serviceRadiusKm: 5,
          ratingAverage: null,
          ratingCount: 0,
          address: 'leak',
          coordinates: [1, 2],
        },
      },
    });
    const provider = user?.profiles?.provider;
    assert(provider !== undefined, 'provider parsed');
    const keys = Object.keys(provider as object).sort();
    assertDeepEqual(
      keys,
      [
        'displayName',
        'id',
        'ratingAverage',
        'ratingCount',
        'serviceRadiusKm',
        'status',
      ],
      'provider only safe keys',
    );
  });

  test('rejects payload missing required fields', () => {
    assertEqual(parseMe({ id: 'x' }), null, 'no roles/status');
    assertEqual(parseMe({ roles: [], status: 'active' }), null, 'no id');
    assertEqual(parseMe(null), null, 'null');
    assertEqual(parseMe('nope'), null, 'string');
  });
});
