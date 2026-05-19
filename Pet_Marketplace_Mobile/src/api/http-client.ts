/**
 * Cliente HTTP minimo do Mobile.
 *
 * - Token injetado via `getToken()` (Bloco 3 ligara ao SecureStore).
 *   O token NUNCA e logado nem guardado por este client.
 * - Falha de rede / timeout viram ApiError de conectividade (retry-friendly).
 * - Respostas de erro do backend viram ApiError seguro.
 */
import {
  ApiError,
  apiErrorFromHttp,
  safeMessageFor,
} from './errors';

export interface TokenProvider {
  /** Retorna o access token atual ou null se nao houver sessao. */
  getToken: () => Promise<string | null> | string | null;
}

export interface ApiClientOptions extends TokenProvider {
  baseUrl: string;
  /** Timeout por request, ms. Default 15000. */
  timeoutMs?: number;
  /** Injetavel para teste. Default = fetch global. */
  fetchImpl?: typeof fetch;
}

export interface ApiClient {
  get<T>(path: string): Promise<T>;
}

const DEFAULT_TIMEOUT_MS = 15_000;

export function createApiClient(options: ApiClientOptions): ApiClient {
  const fetchImpl = options.fetchImpl ?? fetch;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;

  async function request<T>(path: string): Promise<T> {
    const token = await options.getToken();
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    let response: Response;
    try {
      response = await fetchImpl(`${options.baseUrl}${path}`, {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal: controller.signal,
      });
    } catch (cause) {
      // fetch rejeita por rede caida OU abort (timeout).
      if (controller.signal.aborted) {
        throw new ApiError({
          code: 'TIMEOUT',
          kind: 'timeout',
          message: safeMessageFor('TIMEOUT'),
        });
      }
      throw new ApiError({
        code: 'NETWORK_OFFLINE',
        kind: 'network',
        message: safeMessageFor('NETWORK_OFFLINE'),
      });
    } finally {
      clearTimeout(timer);
    }

    const body = await safeJson(response);

    if (!response.ok) {
      throw apiErrorFromHttp(response.status, body);
    }

    if (body === undefined) {
      throw new ApiError({
        code: 'BAD_RESPONSE',
        kind: 'parse',
        httpStatus: response.status,
        message: safeMessageFor('BAD_RESPONSE'),
      });
    }

    return body as T;
  }

  return { get: request };
}

async function safeJson(response: Response): Promise<unknown> {
  try {
    const text = await response.text();
    if (text.length === 0) {
      return undefined;
    }
    return JSON.parse(text) as unknown;
  } catch {
    return undefined;
  }
}
