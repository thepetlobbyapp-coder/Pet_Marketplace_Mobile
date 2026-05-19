/**
 * Harness de teste minimo e SEM dependencias.
 *
 * O projeto ainda nao tem runner (chega no Bloco 3). Os specs em
 * `src/__tests__` registram casos aqui; `runAllSuites()` executa tudo e
 * pode ser ligado a qualquer runner (vitest/jest/node:test) depois,
 * sem reescrever os testes. Por enquanto garante typecheck e logica.
 */

type TestFn = () => void | Promise<void>;

interface RegisteredTest {
  suite: string;
  name: string;
  fn: TestFn;
}

const registry: RegisteredTest[] = [];
let currentSuite = '(root)';

export function suite(name: string, body: () => void): void {
  const previous = currentSuite;
  currentSuite = name;
  body();
  currentSuite = previous;
}

export function test(name: string, fn: TestFn): void {
  registry.push({ suite: currentSuite, name, fn });
}

export function assert(condition: boolean, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function assertEqual<T>(actual: T, expected: T, label: string): void {
  if (actual !== expected) {
    throw new Error(
      `${label}: expected ${stringify(expected)}, got ${stringify(actual)}`,
    );
  }
}

export function assertDeepEqual(
  actual: unknown,
  expected: unknown,
  label: string,
): void {
  const a = stringify(actual);
  const e = stringify(expected);
  if (a !== e) {
    throw new Error(`${label}: expected ${e}, got ${a}`);
  }
}

export async function assertRejects(
  fn: () => Promise<unknown>,
  label: string,
): Promise<unknown> {
  try {
    await fn();
  } catch (err) {
    return err;
  }
  throw new Error(`${label}: expected the promise to reject`);
}

function stringify(value: unknown): string {
  try {
    return JSON.stringify(value);
  } catch {
    return String(value);
  }
}

export interface SuiteRunResult {
  total: number;
  passed: number;
  failures: { suite: string; name: string; error: string }[];
}

export async function runAllSuites(): Promise<SuiteRunResult> {
  const failures: SuiteRunResult['failures'] = [];
  let passed = 0;

  for (const item of registry) {
    try {
      await item.fn();
      passed += 1;
    } catch (err) {
      failures.push({
        suite: item.suite,
        name: item.name,
        error: err instanceof Error ? err.message : String(err),
      });
    }
  }

  return { total: registry.length, passed, failures };
}

/** Util para isolar registros em execucao programatica de um unico spec. */
export function resetRegistry(): void {
  registry.length = 0;
}
