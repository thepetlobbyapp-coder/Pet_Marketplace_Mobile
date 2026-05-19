/**
 * Ponte: roda os specs do harness (src/__tests__/*) dentro do Jest SEM
 * reescrevê-los. Importar registra os casos; runAllSuites() executa.
 */
import '../__tests__/me.contract.test';
import '../__tests__/session-state.test';
import '../__tests__/roles.test';
import { runAllSuites } from '../testing/harness';

test('harness specs all pass under jest', async () => {
  const r = await runAllSuites();
  if (r.failures.length > 0) {
    throw new Error(
      `harness failures:\n${r.failures
        .map((f) => `- [${f.suite}] ${f.name}: ${f.error}`)
        .join('\n')}`,
    );
  }
  expect(r.passed).toBe(r.total);
  expect(r.total).toBeGreaterThanOrEqual(16);
});
